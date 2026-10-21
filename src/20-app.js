/* =========================================================
   打字练习 · 应用逻辑
   两种输入适配器：
   1) DirectInput  英文 / 代码，keydown 直接比对
   2) IMEInput     中文，输入法上屏后按已提交文本比对
   ========================================================= */
(() => {
  'use strict';

  /* ---------------- helpers ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const nowMs = () => performance.now();
  const PUNCT_RE = /[\p{P}\p{S}]/u;
  const isPunct = (ch) => !!ch && PUNCT_RE.test(ch);

  const PUNCT_GROUPS = [
    ['，', ','], ['。', '.'], ['？', '?'], ['！', '!'],
    ['；', ';'], ['：', ':'], ['（', '('], ['）', ')'],
    ['“', '"'], ['”', '"'], ['‘', "'"], ['’', "'"],
    ['—', '-']
  ];

  function punctEquivalent(a, b) {
    if (a === b) return true;
    for (const group of PUNCT_GROUPS) {
      if (group.includes(a) && group.includes(b)) return true;
    }
    return false;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function clampInt(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return clamp(Math.round(n), min, max);
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* 隐私模式或空间不足时静默失败 */
    }
  }

  /* ---------------- storage keys ---------------- */
  const SETTINGS_KEY = 'typing-practice.settings.v1';
  const PREFS_KEY = 'typing-practice.prefs.v1';
  const HISTORY_KEY = 'typing-practice.history.v1';

  const DEFAULT_SETTINGS = { correction: 'free', punctLenient: false, autoIndent: true };

  function loadSettings() {
    const raw = readJSON(SETTINGS_KEY, {});
    return {
      correction: raw.correction === 'strict' ? 'strict' : 'free',
      punctLenient: !!raw.punctLenient,
      autoIndent: raw.autoIndent !== false
    };
  }

  function loadPrefs() {
    const raw = readJSON(PREFS_KEY, {});
    const zhAmount = [30, 60, 120].includes(Number(raw?.zh?.amount)) ? Number(raw.zh.amount) : 60;
    const enAmount = Number(raw?.en?.wordAmount);
    const enMode = raw?.en?.wordMode === 'count' ? 'count' : 'time';
    const validEnAmount = enMode === 'count'
      ? ([10, 25, 50].includes(enAmount) ? enAmount : 25)
      : ([15, 30, 60].includes(enAmount) ? enAmount : 30);
    return {
      mode: raw.mode === 'en' || raw.mode === 'code' ? raw.mode : 'zh',
      zh: {
        sub: raw?.zh?.sub === 'essay' ? 'essay' : 'words',
        amount: zhAmount,
        essay: clampInt(raw?.zh?.essay, 0, ZH_ESSAYS.length - 1, 0)
      },
      en: {
        sub: raw?.en?.sub === 'article' ? 'article' : 'words',
        wordMode: enMode,
        wordAmount: validEnAmount,
        article: clampInt(raw?.en?.article, 0, EN_ARTICLES.length - 1, 0)
      },
      code: {
        snippet: clampInt(raw?.code?.snippet, 0, PY_SNIPPETS.length - 1, 0)
      }
    };
  }

  function loadHistory() {
    const raw = readJSON(HISTORY_KEY, []);
    return Array.isArray(raw) ? raw.filter((r) => r && typeof r.speed === 'number') : [];
  }

  /* ---------------- app state ---------------- */
  const app = {
    settings: loadSettings(),
    prefs: loadPrefs(),
    history: loadHistory(),
    mode: 'zh',
    session: null,
    ticker: null,
    composing: false,
    compositionText: '',
    punctuationHintShown: false,
    imeHintShown: false,
    customZh: null,
    lastDrillChars: [],
    historyMode: 'zh',
    toastTimer: null,
    imeWarnTimer: null
  };

  app.mode = app.prefs.mode;

  /* ---------------- DOM ---------------- */
  const el = {
    modeTabs: $('#modeTabs'),
    toolbar: $('#toolbar'),
    stage: $('#stage'),
    textViewport: $('#textViewport'),
    textDisplay: $('#textDisplay'),
    chars: $('#chars'),
    caret: $('#caret'),
    preview: $('#compositionPreview'),
    imeSink: $('#imeSink'),
    directSink: $('#directSink'),
    stageHint: $('#stageHint'),
    stageHintText: $('#stageHintText'),
    pauseOverlay: $('#pauseOverlay'),
    imeWarning: $('#imeWarning'),
    speedLabel: $('#speedLabel'),
    speedValue: $('#speedValue'),
    accValue: $('#accValue'),
    timeLabel: $('#timeLabel'),
    timeValue: $('#timeValue'),
    progressBar: $('#progressBar'),
    restartBtn: $('#restartBtn'),
    finishBtn: $('#finishBtn'),
    modeHint: $('#modeHint'),
    resultOverlay: $('#resultOverlay'),
    settingsOverlay: $('#settingsOverlay'),
    historyOverlay: $('#historyOverlay'),
    historyTabs: $('#historyTabs'),
    historyChart: $('#historyChart'),
    historyBest: $('#historyBest'),
    historyList: $('#historyList'),
    clearHistoryBtn: $('#clearHistoryBtn'),
    correctionSeg: $('#correctionSeg'),
    punctLenient: $('#punctLenient'),
    autoIndent: $('#autoIndent'),
    toast: $('#toast')
  };

  /* ---------------- content ---------------- */
  function randomWords(count) {
    const pool = shuffle(EN_WORDS.slice());
    const out = [];
    let i = 0;
    while (out.length < count) {
      out.push(pool[i++ % pool.length]);
      if (i % pool.length === 0) shuffle(pool);
    }
    return out.join(' ');
  }

  function generateZhText(length) {
    const words = shuffle(ZH_WORDS.slice());
    let out = '';
    let i = 0;
    while (out.length < length) {
      if (Math.random() < 0.14) {
        out += ZH_CHARS[Math.floor(Math.random() * ZH_CHARS.length)];
      } else {
        out += words[i++ % words.length];
        if (i % words.length === 0) shuffle(words);
      }
    }
    return out;
  }

  function buildTarget(cfg) {
    if (cfg.sub === 'custom') return cfg.target;
    if (cfg.mode === 'zh') {
      if (cfg.sub === 'essay') return ZH_ESSAYS[cfg.essay].text;
      return generateZhText(Math.max(400, cfg.amount * 8));
    }
    if (cfg.mode === 'en') {
      if (cfg.sub === 'article') return EN_ARTICLES[cfg.article].text;
      if (cfg.wordMode === 'count') return randomWords(cfg.wordAmount);
      return randomWords(Math.max(100, Math.ceil(cfg.wordAmount * 3.2)));
    }
    return PY_SNIPPETS[cfg.snippet].text;
  }

  function currentConfig() {
    if (app.mode === 'zh') {
      if (app.customZh) return { mode: 'zh', sub: 'custom', target: app.customZh.text };
      const p = app.prefs.zh;
      if (p.sub === 'essay') return { mode: 'zh', sub: 'essay', essay: p.essay };
      return { mode: 'zh', sub: 'words', amount: p.amount };
    }
    if (app.mode === 'en') {
      const p = app.prefs.en;
      if (p.sub === 'article') return { mode: 'en', sub: 'article', article: p.article };
      return { mode: 'en', sub: 'words', wordMode: p.wordMode, wordAmount: p.wordAmount };
    }
    return { mode: 'code', sub: 'snippet', snippet: app.prefs.code.snippet };
  }

  function sessionTitle(cfg) {
    if (cfg.mode === 'zh') {
      if (cfg.sub === 'words') return `中文 · 字词 · ${cfg.amount} 秒`;
      if (cfg.sub === 'essay') return `中文 · 范文 · ${ZH_ESSAYS[cfg.essay].title}`;
      return '中文 · 专项练习';
    }
    if (cfg.mode === 'en') {
      if (cfg.sub === 'words') {
        return `英文 · 单词 · ${cfg.wordAmount} ${cfg.wordMode === 'time' ? '秒' : '词'}`;
      }
      return `英文 · 文章 · ${EN_ARTICLES[cfg.article].title}`;
    }
    return `代码 · Python · ${PY_SNIPPETS[cfg.snippet].title}`;
  }

  /* ---------------- session ---------------- */
  function newSession(cfg, target) {
    return {
      cfg,
      mode: cfg.mode,
      sub: cfg.sub,
      target,
      targetChars: Array.from(target),
      typed: '',
      spans: [],
      indexToSpan: [],
      lineAnchors: [],
      lineLastSpan: [],
      lineOfIndex: [],
      autoSet: new Set(),
      status: 'idle',
      startedAt: 0,
      lastResume: 0,
      elapsed: 0,
      keystrokes: 0,
      correct: 0,
      errors: 0,
      committed: 0,
      committedCorrect: 0,
      punctErrors: 0,
      lenientUsed: 0,
      keyStats: new Map(),
      charStats: [],
      intervals: [],
      lastInputAt: 0,
      strict: app.settings.correction === 'strict',
      finishedReason: ''
    };
  }

  function makeSpan(ch, mode) {
    const sp = document.createElement('span');
    sp.className = 'ch'
      + (ch === ' ' ? ' space' : '')
      + (mode !== 'code' && isPunct(ch) ? ' punct' : '');
    sp.textContent = ch;
    sp._base = sp.className;
    return sp;
  }

  function renderTarget(target, mode) {
    const s = app.session;
    const frag = document.createDocumentFragment();
    s.spans = new Array(s.targetChars.length).fill(null);
    s.indexToSpan = new Array(s.targetChars.length).fill(null);
    s.lineAnchors = [];
    s.lineLastSpan = [];
    s.lineOfIndex = [];

    let idx = 0;
    if (mode === 'code') {
      const lines = target.split('\n');
      for (let li = 0; li < lines.length; li++) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'code-line';

        const anchor = document.createElement('span');
        anchor.className = 'line-anchor';
        lineDiv.appendChild(anchor);
        s.lineAnchors[li] = anchor;

        let last = null;
        for (const ch of Array.from(lines[li])) {
          const sp = makeSpan(ch, mode);
          lineDiv.appendChild(sp);
          s.spans[idx] = sp;
          s.indexToSpan[idx] = sp;
          s.lineOfIndex[idx] = li;
          last = sp;
          idx++;
        }
        s.lineLastSpan[li] = last;

        if (li < lines.length - 1) {
          s.lineOfIndex[idx] = li;
          idx++;
        }
        frag.appendChild(lineDiv);
      }
    } else {
      for (const ch of s.targetChars) {
        const sp = makeSpan(ch, mode);
        frag.appendChild(sp);
        s.spans[idx] = sp;
        s.indexToSpan[idx] = sp;
        idx++;
      }
    }
    el.chars.replaceChildren(frag);
  }

  function lastSpan() {
    const s = app.session;
    for (let i = s.spans.length - 1; i >= 0; i--) {
      if (s.spans[i]) return s.spans[i];
    }
    return null;
  }

  function caretAnchor() {
    const s = app.session;
    if (!s || s.targetChars.length === 0) return null;
    const i = s.typed.length;

    if (i >= s.targetChars.length) {
      const last = lastSpan();
      return last ? { el: last, after: true } : null;
    }

    if (s.mode === 'code' && s.targetChars[i] === '\n') {
      const line = s.lineOfIndex[i];
      const last = s.lineLastSpan[line];
      if (last) return { el: last, after: true };
      const anchor = s.lineAnchors[line];
      if (anchor) return { el: anchor, after: false };
    }

    const sp = s.indexToSpan[i];
    if (sp) return { el: sp, after: false };

    for (let j = i + 1; j < s.indexToSpan.length; j++) {
      if (s.indexToSpan[j]) return { el: s.indexToSpan[j], after: false };
    }
    const last = lastSpan();
    return last ? { el: last, after: true } : null;
  }

  function charsEqual(typedCh, targetCh) {
    if (typedCh === targetCh) return true;
    const s = app.session;
    if (!s || s.mode !== 'zh' || !app.settings.punctLenient || !isPunct(targetCh)) return false;
    return punctEquivalent(typedCh, targetCh);
  }

  /* ---------------- view ---------------- */
  function applyModeClasses(mode) {
    el.stage.classList.remove('mode-zh', 'mode-en', 'mode-code');
    el.stage.classList.add(`mode-${mode}`);
  }

  function ensureVisible() {
    const s = app.session;
    if (!s) return;
    const anchor = caretAnchor();
    if (!anchor || !anchor.el) return;
    const vp = el.textViewport;
    const vr = vp.getBoundingClientRect();
    const sr = anchor.el.getBoundingClientRect();
    const pad = 10;

    let dy = 0;
    if (sr.top < vr.top + pad) dy = sr.top - vr.top - pad;
    else if (sr.bottom > vr.bottom - pad) dy = sr.bottom - vr.bottom + pad;
    if (dy) vp.scrollTop += dy;

    let dx = 0;
    if (sr.left < vr.left + pad) dx = sr.left - vr.left - pad;
    else if (sr.right > vr.right - pad) dx = sr.right - vr.right + pad;
    if (dx) vp.scrollLeft += dx;
  }

  function updateCaret() {
    const s = app.session;
    if (!s) return;
    if (s.status === 'finished') {
      el.caret.classList.remove('visible');
      el.preview.classList.remove('visible');
      return;
    }

    const anchor = caretAnchor();
    if (!anchor || !anchor.el) {
      el.caret.classList.remove('visible');
      return;
    }

    const textRect = el.textDisplay.getBoundingClientRect();
    const r = anchor.el.getBoundingClientRect();
    const x = r.left - textRect.left + (anchor.after ? r.width : 0);
    const y = r.top - textRect.top;
    const height = Math.max(12, r.height * 1.04);

    el.caret.style.left = `${x}px`;
    el.caret.style.top = `${y}px`;
    el.caret.style.height = `${height}px`;
    el.caret.classList.add('visible');
    el.caret.classList.toggle('solid', s.status === 'paused');

    if (s.mode === 'zh') {
      el.imeSink.style.left = `${x}px`;
      el.imeSink.style.top = `${y}px`;
      el.imeSink.style.height = `${height}px`;
      el.imeSink.style.lineHeight = `${height}px`;
    }

    el.preview.style.left = `${x}px`;
    el.preview.style.top = `${y + height}px`;
  }

  function updateHint() {
    const s = app.session;
    if (!s) return;
    const idle = s.status === 'idle';
    el.stageHint.classList.toggle('hidden', !idle);
    if (idle) {
      el.stageHintText.textContent = s.mode === 'zh'
        ? '点击这里，用中文输入法开始'
        : '点击这里，开始输入';
    }
  }

  function updateView() {
    const s = app.session;
    if (!s) return;
    const active = s.typed.length;

    for (let i = 0; i < s.spans.length; i++) {
      const sp = s.spans[i];
      if (!sp) continue;
      let cls = sp._base;
      if (i < s.typed.length) {
        cls += charsEqual(s.typed[i], s.targetChars[i]) ? ' correct' : ' wrong';
        if (s.autoSet.has(i)) cls += ' auto';
      }
      if (i === active && s.status !== 'finished') cls += ' active';
      sp.className = cls;
    }

    ensureVisible();
    updateCaret();
    updateHUD();
    updateHint();
  }

  /* ---------------- timing ---------------- */
  function timeLimitMs(s) {
    if (!s) return 0;
    if (s.mode === 'zh' && s.sub === 'words') return s.cfg.amount * 1000;
    if (s.mode === 'en' && s.sub === 'words' && s.cfg.wordMode === 'time') {
      return s.cfg.wordAmount * 1000;
    }
    return 0;
  }

  function isTimed(s) {
    return timeLimitMs(s) > 0;
  }

  function activeElapsed(s) {
    if (!s) return 0;
    if (s.status === 'running') return s.elapsed + (nowMs() - s.lastResume);
    return s.elapsed;
  }

  function startTicker() {
    stopTicker();
    app.ticker = setInterval(() => {
      const s = app.session;
      if (!s || s.status !== 'running') return;
      updateHUD();
      const limit = timeLimitMs(s);
      if (limit && activeElapsed(s) >= limit) finishSession('time');
    }, 100);
  }

  function stopTicker() {
    if (app.ticker) {
      clearInterval(app.ticker);
      app.ticker = null;
    }
  }

  function ensureStarted() {
    const s = app.session;
    if (!s) return;
    if (s.status === 'idle') {
      s.status = 'running';
      s.startedAt = nowMs();
      s.lastResume = nowMs();
      s.lastInputAt = nowMs();
      startTicker();
      updateHint();
    } else if (s.status === 'paused') {
      resumeSession();
    }
  }

  function pauseSession() {
    const s = app.session;
    if (!s || s.status !== 'running') return;
    s.elapsed += nowMs() - s.lastResume;
    s.status = 'paused';
    el.pauseOverlay.hidden = false;
    el.stage.classList.add('paused');
    updateCaret();
    updateHint();
  }

  function resumeSession() {
    const s = app.session;
    if (!s || s.status !== 'paused') return;
    s.status = 'running';
    s.lastResume = nowMs();
    s.lastInputAt = nowMs();
    el.pauseOverlay.hidden = true;
    el.stage.classList.remove('paused');
    updateView();
  }

  /* ---------------- HUD ---------------- */
  function computeSpeed(s, elapsed) {
    const minutes = elapsed / 60000;
    if (minutes <= 0.008) return 0;
    if (s.mode === 'zh') return s.committedCorrect / minutes;
    if (s.mode === 'en') return (s.correct / 5) / minutes;
    return s.correct / minutes;
  }

  function computeAccuracy(s) {
    const attempts = s.mode === 'zh' ? s.committed : s.keystrokes;
    const ok = s.mode === 'zh' ? s.committedCorrect : s.correct;
    return attempts ? (ok / attempts) * 100 : 100;
  }

  function updateHUD() {
    const s = app.session;
    if (!s) return;
    const elapsed = activeElapsed(s);
    const speed = computeSpeed(s, elapsed);
    const acc = computeAccuracy(s);

    el.speedLabel.textContent = s.mode === 'zh' ? '字/分' : s.mode === 'en' ? 'WPM' : '字符/分';
    el.speedValue.textContent = String(Math.round(speed));
    el.accValue.textContent = `${Math.round(acc)}%`;

    const limit = timeLimitMs(s);
    if (limit) {
      el.timeLabel.textContent = '剩余';
      el.timeValue.textContent = String(Math.max(0, Math.ceil((limit - elapsed) / 1000)));
      el.progressBar.style.width = `${clamp((elapsed / limit) * 100, 0, 100)}%`;
      el.finishBtn.hidden = true;
    } else {
      el.timeLabel.textContent = '用时';
      el.timeValue.textContent = `${(elapsed / 1000).toFixed(1)}s`;
      const p = s.targetChars.length ? (s.typed.length / s.targetChars.length) * 100 : 0;
      el.progressBar.style.width = `${clamp(p, 0, 100)}%`;
      el.finishBtn.hidden = false;
    }
  }

  /* ---------------- direct input ---------------- */
  function getCharStat(index) {
    const s = app.session;
    if (!s.charStats[index]) {
      s.charStats[index] = { attempts: 0, errors: 0, totalMs: 0 };
    }
    return s.charStats[index];
  }

  function recordKey(code, ok, dt) {
    if (!code) return;
    const s = app.session;
    let st = s.keyStats.get(code);
    if (!st) {
      st = { attempts: 0, errors: 0, totalMs: 0 };
      s.keyStats.set(code, st);
    }
    st.attempts++;
    if (!ok) st.errors++;
    st.totalMs += dt || 0;
  }

  function typeDirect(ch, code) {
    const s = app.session;
    if (!s || s.status === 'finished' || s.status === 'paused') return;
    if (s.typed.length >= s.targetChars.length) return;

    ensureStarted();

    const t = nowMs();
    const i = s.typed.length;
    const expected = s.targetChars[i];
    const dt = s.lastInputAt ? t - s.lastInputAt : 0;
    if (dt >= 30 && dt < 3000) s.intervals.push(dt);
    s.lastInputAt = t;

    const stat = getCharStat(i);
    stat.attempts++;
    stat.totalMs += dt;

    const ok = ch === expected;
    s.keystrokes++;
    recordKey(code, ok, dt);

    if (ok) {
      s.typed += ch;
      s.correct++;
    } else {
      s.errors++;
      stat.errors++;
      if (isPunct(expected)) s.punctErrors++;
      if (s.strict) {
        flashError(i);
      } else {
        s.typed += ch;
      }
    }

    if (ok && ch === '\n' && s.mode === 'code' && app.settings.autoIndent) {
      autoSkipIndent();
    }

    updateView();
    checkFinish();
  }

  function autoSkipIndent() {
    const s = app.session;
    const chars = s.targetChars;
    let i = s.typed.length;
    if (i > 0 && chars[i - 1] !== '\n') return;
    while (i < chars.length && chars[i] === ' ') {
      s.typed += ' ';
      s.autoSet.add(i);
      i++;
    }
  }

  function backspace() {
    const s = app.session;
    if (!s || s.status === 'finished') return;
    if (s.typed.length === 0) return;
    s.typed = s.typed.slice(0, -1);
    for (const i of Array.from(s.autoSet)) {
      if (i >= s.typed.length) s.autoSet.delete(i);
    }
    updateView();
  }

  function flashError(index) {
    const s = app.session;
    const sp = s.spans[index];
    if (!sp || !sp.animate) return;
    sp.animate(
      [
        { background: 'rgba(255, 100, 108, 0.42)' },
        { background: 'rgba(255, 100, 108, 0)' }
      ],
      { duration: 240, easing: 'ease-out' }
    );
  }

  function onDirectKey(e) {
    const s = app.session;
    if (!s || s.mode === 'zh') return;

    if (e.isComposing || e.keyCode === 229 || e.key === 'Process') {
      e.preventDefault();
      showImeWarning('检测到输入法合成，请切换到英文输入状态');
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (s.mode === 'code') typeDirect('\n', 'Enter');
      return;
    }
    if (e.key.length !== 1) return;

    e.preventDefault();
    typeDirect(e.key, e.code || '');
  }

  /* ---------------- Chinese IME input ---------------- */
  function handleZhCommitted(text) {
    const s = app.session;
    if (!s || s.mode !== 'zh' || s.status === 'finished') return;
    const chars = Array.from(text);
    if (!chars.length) return;

    ensureStarted();

    const t = nowMs();
    const dt = s.lastInputAt ? t - s.lastInputAt : 0;
    if (dt >= 30 && dt < 3000) s.intervals.push(dt);
    s.lastInputAt = t;
    const perCharMs = chars.length ? dt / chars.length : 0;

    for (const ch of chars) {
      if (s.typed.length >= s.targetChars.length) break;
      const i = s.typed.length;
      const expected = s.targetChars[i];
      const stat = getCharStat(i);
      stat.attempts++;
      stat.totalMs += perCharMs;
      s.committed++;

      const ok = charsEqual(ch, expected);
      if (ok) {
        if (ch !== expected) s.lenientUsed++;
        s.typed += ch;
        s.committedCorrect++;
      } else {
        s.errors++;
        stat.errors++;
        if (isPunct(expected)) s.punctErrors++;
        if (s.strict) {
          flashError(i);
          break;
        }
        s.typed += ch;
      }
    }

    if (s.punctErrors >= 3 && !app.settings.punctLenient && !app.punctuationHintShown) {
      app.punctuationHintShown = true;
      showToast('连续标点错误：可能没开中文标点。可在设置里开启“标点宽容”。', 4200);
    }
    if (/[a-zA-Z]/.test(text) && !app.imeHintShown) {
      app.imeHintShown = true;
      showImeWarning('检测到英文字母，请把输入法切换到中文状态');
    }

    updateView();
    checkFinish();
  }

  function processImeBuffer() {
    const s = app.session;
    if (!s || s.mode !== 'zh') return;
    const text = el.imeSink.value;
    if (!text) return;
    el.imeSink.value = '';
    try { el.imeSink.setSelectionRange(0, 0); } catch (err) { /* noop */ }
    handleZhCommitted(text);
  }

  function onZhInput(e) {
    if (app.composing || e.isComposing) return;
    processImeBuffer();
  }

  function onCompStart() {
    app.composing = true;
    app.compositionText = '';
  }

  function onCompUpdate(e) {
    app.compositionText = e.data || '';
    showComposition(app.compositionText);
  }

  function onCompEnd() {
    app.composing = false;
    app.compositionText = '';
    setTimeout(() => {
      el.preview.classList.remove('visible');
      processImeBuffer();
    }, 0);
  }

  function showComposition(text) {
    if (!text) {
      el.preview.classList.remove('visible');
      return;
    }
    el.preview.textContent = text;
    el.preview.classList.add('visible');
    updateCaret();
  }

  function onZhKey(e) {
    const s = app.session;
    if (!s || s.mode !== 'zh') return;
    if (e.isComposing || app.composing || e.keyCode === 229) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }

  /* ---------------- finish ---------------- */
  function checkFinish() {
    const s = app.session;
    if (!s || s.status === 'finished') return;
    if (s.typed.length >= s.targetChars.length) finishSession('complete');
  }

  function finishSession(reason) {
    const s = app.session;
    if (!s || s.status === 'finished') return;
    if (s.status === 'idle') return;

    if (s.status === 'running') {
      s.elapsed += nowMs() - s.lastResume;
    }
    s.status = 'finished';
    s.finishedReason = reason;

    stopTicker();
    el.pauseOverlay.hidden = true;
    el.stage.classList.remove('paused');
    el.caret.classList.remove('visible');
    el.preview.classList.remove('visible');
    el.imeSink.value = '';
    try { el.imeSink.blur(); } catch (err) { /* noop */ }
    try { el.directSink.blur(); } catch (err) { /* noop */ }

    updateView();
    const result = buildResult();
    saveResult(result);
    showResult(result);
  }

  function buildResult() {
    const s = app.session;
    const elapsed = activeElapsed(s);
    const speed = computeSpeed(s, elapsed);
    const accuracy = computeAccuracy(s);
    const unit = s.mode === 'zh' ? '字/分' : s.mode === 'en' ? 'WPM' : '字符/分';
    return {
      ts: Date.now(),
      mode: s.mode,
      sub: s.sub,
      title: sessionTitle(s.cfg),
      speed: Math.round(speed),
      unit,
      accuracy: Math.round(accuracy * 10) / 10,
      errors: s.errors,
      duration: Math.round((elapsed / 1000) * 10) / 10,
      chars: s.mode === 'zh' ? s.committedCorrect : s.correct,
      consistency: Math.round(calcConsistency(s.intervals)),
      punctuationErrors: s.punctErrors,
      lenientUsed: s.lenientUsed,
      strict: s.strict
    };
  }

  function calcConsistency(intervals) {
    const xs = intervals.filter((x) => x >= 40 && x <= 2500);
    if (xs.length < 3) return 100;
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
    return clamp(100 * (1 - sd / mean), 0, 100);
  }

  function saveResult(result) {
    const same = app.history.filter((r) => r.mode === result.mode && r.title === result.title);
    result.isFirst = same.length === 0;
    const best = same.reduce((m, r) => Math.max(m, r.speed), 0);
    result.isPB = !result.isFirst && result.speed > best;
    app.history.push(result);
    if (app.history.length > 800) app.history = app.history.slice(-800);
    writeJSON(HISTORY_KEY, app.history);
  }

  /* ---------------- result UI ---------------- */
  function zhWeak(s) {
    const map = new Map();
    for (let i = 0; i < s.charStats.length; i++) {
      const st = s.charStats[i];
      if (!st || !st.attempts) continue;
      const ch = s.targetChars[i];
      if (!ch || ch === '\n' || ch === ' ' || isPunct(ch)) continue;
      let item = map.get(ch);
      if (!item) {
        item = { ch, attempts: 0, errors: 0, totalMs: 0 };
        map.set(ch, item);
      }
      item.attempts += st.attempts;
      item.errors += st.errors;
      item.totalMs += st.totalMs;
    }
    const arr = Array.from(map.values());
    const wrong = arr
      .filter((x) => x.errors > 0)
      .sort((a, b) => b.errors - a.errors || b.errors / b.attempts - a.errors / a.attempts)
      .slice(0, 8);
    const slow = arr
      .filter((x) => x.attempts >= 2)
      .map((x) => ({ ...x, avg: x.totalMs / x.attempts }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8);
    return { wrong, slow, chars: Array.from(new Set([...wrong.map((x) => x.ch), ...slow.map((x) => x.ch)])) };
  }

  function keyLabel(code) {
    if (code.startsWith('Key')) return code.slice(3).toLowerCase();
    if (code.startsWith('Digit')) return code.slice(5);
    const map = {
      Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']',
      Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/',
      Space: 'space', Enter: '↵', Tab: '⇥'
    };
    return map[code] || code;
  }

  function symbolErrors(s) {
    let n = 0;
    for (let i = 0; i < s.charStats.length; i++) {
      const st = s.charStats[i];
      if (st && st.errors && isPunct(s.targetChars[i])) n += st.errors;
    }
    return n;
  }

  function heatmapHtml(s) {
    const rows = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
      ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
      ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
    ];
    const stats = s.keyStats;
    const all = Array.from(stats.entries()).map(([code, st]) => ({
      code,
      attempts: st.attempts,
      errors: st.errors,
      rate: st.attempts ? st.errors / st.attempts : 0,
      avg: st.attempts ? st.totalMs / st.attempts : 0
    }));

    const wrong = all.filter((x) => x.errors >= 2).sort((a, b) => b.rate - a.rate).slice(0, 5);
    const slow = all.filter((x) => x.attempts >= 3).sort((a, b) => b.avg - a.avg).slice(0, 5);

    const rowsHtml = rows.map((row, ri) => {
      const keys = row.map((code) => {
        const st = stats.get(code);
        const label = keyLabel(code);
        let style = '';
        let cls = 'heat-key';
        if (st && st.attempts) {
          cls += ' used';
          const rate = st.errors / st.attempts;
          style = `background:rgba(255,100,108,${(0.07 + rate * 0.78).toFixed(3)});`
            + `border-color:rgba(255,100,108,${(0.16 + rate * 0.5).toFixed(3)});`;
        }
        const title = st && st.attempts
          ? `${label} · ${st.attempts} 次 · 错 ${st.errors} 次 · 平均 ${Math.round(st.totalMs / st.attempts)}ms`
          : `${label} · 未使用`;
        return `<div class="${cls}" style="${style}" title="${esc(title)}">${esc(label)}</div>`;
      }).join('');
      return `<div class="heat-row" style="margin-left:${ri * 14}px">${keys}</div>`;
    }).join('');

    const spaceSt = stats.get('Space');
    const spaceStyle = spaceSt && spaceSt.attempts
      ? `background:rgba(255,100,108,${(0.07 + (spaceSt.errors / spaceSt.attempts) * 0.78).toFixed(3)});`
      : '';
    const spaceHtml = `<div class="heat-row"><div class="heat-key space ${spaceSt && spaceSt.attempts ? 'used' : ''}" style="${spaceStyle}" title="空格键">space</div></div>`;

    const wrongText = wrong.length
      ? `最常错：${wrong.map((x) => `${esc(keyLabel(x.code))} ${Math.round(x.rate * 100)}%`).join(' · ')}`
      : '没有明显的错误键，表现很稳。';
    const slowText = slow.length
      ? `反应最慢：${slow.map((x) => `${esc(keyLabel(x.code))} ${Math.round(x.avg)}ms`).join(' · ')}`
      : '';

    return `
      <div class="weak-section">
        <div class="weak-title">
          <h3>按键热力图</h3>
          <div class="heat-legend"><span>错误率</span><span class="heat-scale"></span><span>高</span></div>
        </div>
        <div class="heatmap-wrap">
          <div class="heatmap">${rowsHtml}${spaceHtml}</div>
          <div class="note-line" style="width:100%">${wrongText}${slowText ? `<br>${slowText}` : ''}</div>
        </div>
      </div>`;
  }

  function resultWeakHtml(s) {
    if (s.mode !== 'zh') return heatmapHtml(s);

    const weak = zhWeak(s);
    app.lastDrillChars = weak.chars;
    const wrongChips = weak.wrong.length
      ? weak.wrong.map((x) => `<span class="chip error-chip"><b>${esc(x.ch)}</b><em>×${x.errors}</em></span>`).join('')
      : '<span class="empty-note">没有错字，很稳。</span>';
    const slowChips = weak.slow.length
      ? weak.slow.map((x) => `<span class="chip"><b>${esc(x.ch)}</b><em>${Math.round(x.avg)}ms</em></span>`).join('')
      : '<span class="empty-note">样本还不够，多打一会儿会出现。</span>';
    const drillBtn = weak.chars.length
      ? '<button class="ghost-btn small" data-action="drill" type="button">专练这些字</button>'
      : '';

    return `
      <div class="weak-section">
        <div class="weak-title"><h3>弱项分析</h3>${drillBtn}</div>
        <div class="weak-columns">
          <div class="weak-panel">
            <h4>错得最多</h4>
            <div class="chip-row">${wrongChips}</div>
          </div>
          <div class="weak-panel">
            <h4>最慢的字</h4>
            <div class="chip-row">${slowChips}</div>
          </div>
        </div>
      </div>`;
  }

  function nextLabel(s) {
    if (s.sub === 'essay' || s.sub === 'article') return '换一篇';
    if (s.mode === 'code') return '下一个片段';
    if (s.sub === 'custom') return '再练一组';
    return '换一组';
  }

  function showResult(result) {
    const s = app.session;
    const badge = result.isFirst
      ? '<span class="pb-badge">首次记录</span>'
      : result.isPB
        ? '<span class="pb-badge">★ 新纪录</span>'
        : '';

    let notes = '';
    if (s.mode === 'zh') {
      const bits = [];
      if (result.punctuationErrors) bits.push(`标点错误 ${result.punctuationErrors} 处`);
      if (result.lenientUsed) bits.push(`半角标点宽容 ${result.lenientUsed} 处`);
      if (bits.length) notes = `<div class="note-line">${bits.join(' · ')}</div>`;
    } else if (s.mode === 'en') {
      if (result.punctuationErrors) {
        notes = `<div class="note-line">标点错误 ${result.punctuationErrors} 处</div>`;
      }
    } else if (s.mode === 'code') {
      const se = symbolErrors(s);
      if (se) notes = `<div class="note-line">符号错误 ${se} 处，可以在下一组专门慢练符号。</div>`;
    }

    el.resultOverlay.innerHTML = `
      <div class="modal result-modal" role="dialog" aria-modal="true" aria-label="练习结果">
        <div class="modal-head">
          <div>
            <p class="eyebrow">${esc(result.title)}</p>
            <h2>练习完成</h2>
          </div>
          <button class="icon-btn" data-close="resultOverlay" type="button" aria-label="关闭">×</button>
        </div>

        <div class="result-hero">
          <div class="result-speed"><span class="num">${result.speed}</span><span class="unit">${result.unit}</span></div>
          ${badge}
        </div>

        <div class="result-grid">
          <div class="metric"><label>正确率</label><b>${result.accuracy}%</b></div>
          <div class="metric"><label>错误</label><b>${result.errors}</b></div>
          <div class="metric"><label>用时</label><b>${result.duration.toFixed(1)}<small>s</small></b></div>
          <div class="metric"><label>一致性</label><b>${result.consistency}%</b></div>
        </div>
        ${notes}

        ${resultWeakHtml(s)}

        <div class="result-actions">
          <button class="ghost-btn" data-action="history" type="button">查看记录</button>
          <button class="ghost-btn" data-action="next" type="button">${nextLabel(s)}</button>
          <button class="primary-btn" data-action="again" type="button">再来一次</button>
        </div>
      </div>`;
    el.resultOverlay.classList.remove('hidden');
  }

  function hideResult() {
    el.resultOverlay.classList.add('hidden');
    el.resultOverlay.innerHTML = '';
  }

  /* ---------------- session lifecycle ---------------- */
  function configureInput(mode) {
    const zh = mode === 'zh';
    el.directSink.classList.toggle('hidden', zh);
    el.imeSink.classList.toggle('hidden', !zh);
    el.directSink.readOnly = true;
    el.imeSink.readOnly = false;
    el.directSink.value = '';
    el.imeSink.value = '';
    try { el.imeSink.setSelectionRange(0, 0); } catch (err) { /* noop */ }
  }

  function focusInput() {
    const s = app.session;
    if (!s) return;
    const sink = s.mode === 'zh' ? el.imeSink : el.directSink;
    try {
      sink.focus({ preventScroll: true });
    } catch (err) {
      sink.focus();
    }
    if (s.mode === 'zh') {
      try { el.imeSink.setSelectionRange(0, 0); } catch (err) { /* noop */ }
    }
  }

  function startSession() {
    stopTicker();
    hideResult();

    const cfg = currentConfig();
    const target = buildTarget(cfg);
    const s = newSession(cfg, target);
    app.session = s;
    app.composing = false;
    app.compositionText = '';
    app.punctuationHintShown = false;
    app.imeHintShown = false;

    el.imeWarning.hidden = true;
    el.pauseOverlay.hidden = true;
    el.stage.classList.remove('paused');
    el.caret.classList.remove('visible');
    el.preview.classList.remove('visible');
    el.textViewport.scrollTop = 0;
    el.textViewport.scrollLeft = 0;

    applyModeClasses(cfg.mode);
    renderTarget(target, cfg.mode);
    configureInput(cfg.mode);
    renderToolbar();

    updateView();
    updateHUD();
    focusInput();
  }

  function restart() {
    if (!app.session) return;
    startSession();
  }

  function nextContent() {
    const s = app.session;
    if (!s) return;
    if (s.sub === 'custom') {
      if (app.lastDrillChars.length) {
        app.customZh = { text: buildDrill(app.lastDrillChars) };
      }
      startSession();
      return;
    }
    if (s.mode === 'zh' && s.sub === 'essay') {
      app.prefs.zh.essay = (app.prefs.zh.essay + 1) % ZH_ESSAYS.length;
    } else if (s.mode === 'en' && s.sub === 'article') {
      app.prefs.en.article = (app.prefs.en.article + 1) % EN_ARTICLES.length;
    } else if (s.mode === 'code') {
      app.prefs.code.snippet = (app.prefs.code.snippet + 1) % PY_SNIPPETS.length;
    }
    savePrefs();
    startSession();
  }

  function buildDrill(chars) {
    const unique = Array.from(new Set(chars.filter(Boolean)));
    if (!unique.length) return '';
    const pool = [];
    for (const ch of unique) {
      for (let i = 0; i < 4; i++) pool.push(ch);
    }
    shuffle(pool);
    const out = pool.slice();
    while (out.length < 32) {
      out.push(...shuffle(pool.slice()));
    }
    return out.join('');
  }

  function startDrill(chars) {
    if (!chars || !chars.length) {
      showToast('暂时没有明显的弱项字，多练几组再看看。');
      return;
    }
    app.mode = 'zh';
    app.prefs.mode = 'zh';
    app.customZh = { text: buildDrill(chars) };
    savePrefs();
    updateTabs();
    startSession();
  }

  /* ---------------- toolbar ---------------- */
  function renderToolbar() {
    const mode = app.mode;
    const p = app.prefs;
    let html = '';

    if (mode === 'zh') {
      if (app.customZh) {
        html += `<div class="tool-group"><span class="tool-tag">专项练习</span><button class="ghost-btn small" data-action="back-words" type="button">返回字词</button></div>`;
      } else {
        html += `<div class="tool-group"><span class="tool-label">内容</span><div class="seg">
          <button data-sub="words" class="${p.zh.sub === 'words' ? 'active' : ''}" type="button">字词</button>
          <button data-sub="essay" class="${p.zh.sub === 'essay' ? 'active' : ''}" type="button">范文</button>
        </div></div>`;
        if (p.zh.sub === 'words') {
          html += `<div class="tool-group"><span class="tool-label">时长</span><div class="seg">
            ${[30, 60, 120].map((n) => `<button data-time="${n}" class="${p.zh.amount === n ? 'active' : ''}" type="button">${n}秒</button>`).join('')}
          </div></div>`;
        } else {
          html += `<div class="tool-group"><span class="tool-label">篇目</span>
            <select class="tool-select" id="essaySelect">
              ${ZH_ESSAYS.map((e, i) => `<option value="${i}" ${i === p.zh.essay ? 'selected' : ''}>${esc(e.title)} · ${e.text.length} 字</option>`).join('')}
            </select></div>`;
        }
      }
    } else if (mode === 'en') {
      html += `<div class="tool-group"><span class="tool-label">内容</span><div class="seg">
        <button data-sub="words" class="${p.en.sub === 'words' ? 'active' : ''}" type="button">单词</button>
        <button data-sub="article" class="${p.en.sub === 'article' ? 'active' : ''}" type="button">文章</button>
      </div></div>`;
      if (p.en.sub === 'words') {
        html += `<div class="tool-group"><span class="tool-label">时长</span><div class="seg">
          ${[15, 30, 60].map((n) => `<button data-wordmode="time" data-amount="${n}" class="${p.en.wordMode === 'time' && p.en.wordAmount === n ? 'active' : ''}" type="button">${n}秒</button>`).join('')}
        </div></div>
        <div class="tool-group"><span class="tool-label">词数</span><div class="seg">
          ${[10, 25, 50].map((n) => `<button data-wordmode="count" data-amount="${n}" class="${p.en.wordMode === 'count' && p.en.wordAmount === n ? 'active' : ''}" type="button">${n}词</button>`).join('')}
        </div></div>`;
      } else {
        html += `<div class="tool-group"><span class="tool-label">篇目</span>
          <select class="tool-select" id="articleSelect">
            ${EN_ARTICLES.map((a, i) => `<option value="${i}" ${i === p.en.article ? 'selected' : ''}>${esc(a.title)}</option>`).join('')}
          </select></div>`;
      }
    } else {
      html += `<div class="tool-group"><span class="tool-label">片段</span>
        <select class="tool-select" id="snippetSelect">
          ${PY_SNIPPETS.map((sn, i) => `<option value="${i}" ${i === p.code.snippet ? 'selected' : ''}>${i + 1}. ${esc(sn.title)} · ${esc(sn.level)}</option>`).join('')}
        </select></div>`;
    }

    el.toolbar.innerHTML = html;
  }

  function onToolbarClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.action === 'back-words') {
      app.customZh = null;
      app.prefs.zh.sub = 'words';
      savePrefs();
      startSession();
      return;
    }

    if (btn.dataset.sub) {
      app.customZh = null;
      if (app.mode === 'zh') app.prefs.zh.sub = btn.dataset.sub === 'essay' ? 'essay' : 'words';
      else if (app.mode === 'en') app.prefs.en.sub = btn.dataset.sub === 'article' ? 'article' : 'words';
      savePrefs();
      startSession();
      return;
    }

    if (btn.dataset.time) {
      app.prefs.zh.amount = Number(btn.dataset.time);
      savePrefs();
      startSession();
      return;
    }

    if (btn.dataset.wordmode) {
      app.prefs.en.wordMode = btn.dataset.wordmode;
      app.prefs.en.wordAmount = Number(btn.dataset.amount);
      savePrefs();
      startSession();
    }
  }

  function onToolbarChange(e) {
    const id = e.target.id;
    const value = Number(e.target.value);
    if (id === 'essaySelect') {
      app.prefs.zh.essay = clampInt(value, 0, ZH_ESSAYS.length - 1, 0);
      savePrefs();
      startSession();
    } else if (id === 'articleSelect') {
      app.prefs.en.article = clampInt(value, 0, EN_ARTICLES.length - 1, 0);
      savePrefs();
      startSession();
    } else if (id === 'snippetSelect') {
      app.prefs.code.snippet = clampInt(value, 0, PY_SNIPPETS.length - 1, 0);
      savePrefs();
      startSession();
    }
  }

  /* ---------------- mode ---------------- */
  function updateTabs() {
    $$('#modeTabs .tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === app.mode);
    });
  }

  function setMode(mode) {
    if (mode === app.mode) return;
    app.mode = mode;
    app.prefs.mode = mode;
    app.customZh = null;
    savePrefs();
    updateTabs();
    startSession();
  }

  /* ---------------- settings ---------------- */
  function saveSettings() {
    writeJSON(SETTINGS_KEY, app.settings);
  }

  function syncSettingsUI() {
    $$('#correctionSeg button').forEach((b) => {
      b.classList.toggle('active', b.dataset.correction === app.settings.correction);
    });
    el.punctLenient.checked = app.settings.punctLenient;
    el.autoIndent.checked = app.settings.autoIndent;
  }

  function updateFoot() {
    el.modeHint.textContent = app.settings.correction === 'strict'
      ? '严格模式 · 按对才能继续'
      : '自由模式 · 错了也能继续';
  }

  function openSettings() {
    syncSettingsUI();
    openOverlay('settingsOverlay');
  }

  /* ---------------- overlays ---------------- */
  function openOverlay(id) {
    pauseSession();
    document.getElementById(id).classList.remove('hidden');
  }

  function closeOverlay(id) {
    const node = document.getElementById(id);
    if (node) node.classList.add('hidden');
  }

  function openOverlayEl() {
    const list = $$('.overlay:not(.hidden)');
    return list.length ? list[list.length - 1] : null;
  }

  /* ---------------- history ---------------- */
  function subLabel(mode, sub) {
    const map = {
      zh: { words: '字词', essay: '范文', custom: '专项' },
      en: { words: '单词', article: '文章' },
      code: { snippet: '片段' }
    };
    return map[mode]?.[sub] || sub;
  }

  function fmtDate(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function chartSvg(records, unit) {
    const W = 640;
    const H = 190;
    const L = 42;
    const R = 16;
    const T = 18;
    const B = 30;
    const max = Math.max(10, ...records.map((r) => r.speed));
    const x = (i) => L + (records.length === 1 ? (W - L - R) / 2 : (i / (records.length - 1)) * (W - L - R));
    const y = (v) => T + (1 - v / max) * (H - T - B);
    const pts = records.map((r, i) => [x(i), y(r.speed)]);
    const poly = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `M ${x(0).toFixed(1)} ${H - B} L ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} L ${x(records.length - 1).toFixed(1)} ${H - B} Z`;

    const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
      const gy = T + f * (H - T - B);
      const label = Math.round(max * (1 - f));
      return `<line x1="${L}" y1="${gy.toFixed(1)}" x2="${W - R}" y2="${gy.toFixed(1)}" stroke="#252b38" stroke-width="1"/>`
        + `<text x="${L - 8}" y="${(gy + 3.5).toFixed(1)}" text-anchor="end" fill="#4e576b" font-size="9">${label}</text>`;
    }).join('');

    const dots = pts.map((p, i) => {
      const last = i === pts.length - 1;
      return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${last ? 3.6 : 2.2}" fill="${last ? '#e8b923' : '#7aa2ff'}" opacity="${last ? 1 : 0.65}"/>`;
    }).join('');

    const d0 = new Date(records[0].ts);
    const d1 = new Date(records[records.length - 1].ts);
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="成绩趋势">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8b923" stop-opacity="0.22"/>
        <stop offset="1" stop-color="#e8b923" stop-opacity="0"/>
      </linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#areaGrad)"/>
      <polyline points="${poly}" fill="none" stroke="#e8b923" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
      <text x="${L}" y="${H - 8}" fill="#4e576b" font-size="9">${fmt(d0)}</text>
      <text x="${W - R}" y="${H - 8}" text-anchor="end" fill="#4e576b" font-size="9">${fmt(d1)}</text>
      <text x="${W - R}" y="12" text-anchor="end" fill="#818b9f" font-size="9">${unit}</text>
    </svg>`;
  }

  function renderHistory() {
    const mode = app.historyMode;
    const records = app.history.filter((r) => r.mode === mode);
    const unit = mode === 'zh' ? '字/分' : mode === 'en' ? 'WPM' : '字符/分';
    const recent = records.slice(-40);

    el.historyChart.innerHTML = recent.length
      ? chartSvg(recent, unit)
      : '<div class="chart-empty">还没有这个模式的记录，先练一组吧</div>';

    const bestBySub = new Map();
    for (const r of records) {
      if (!bestBySub.has(r.sub) || r.speed > bestBySub.get(r.sub)) bestBySub.set(r.sub, r.speed);
    }
    el.historyBest.innerHTML = Array.from(bestBySub.entries())
      .map(([sub, speed]) => `<span class="best-pill">${subLabel(mode, sub)} 最佳 <b>${Math.round(speed)}</b> ${unit}</span>`)
      .join('');

    const recentList = records.slice(-12).reverse();
    el.historyList.innerHTML = recentList.length
      ? recentList.map((r) => `
          <div class="history-item">
            <div class="hi-main">
              <span class="hi-speed">${r.speed} ${r.unit}</span>
              <span class="hi-sub">${esc(r.title)}</span>
            </div>
            <div class="hi-right">
              <span>${r.accuracy}%</span>
              <span>${fmtDate(r.ts)}</span>
            </div>
          </div>`).join('')
      : '<div class="empty-note" style="padding:14px 0">还没有记录。</div>';
  }

  function syncHistoryTabs() {
    $$('#historyTabs button').forEach((b) => {
      b.classList.toggle('active', b.dataset.hmode === app.historyMode);
    });
  }

  function openHistory() {
    app.historyMode = app.mode;
    syncHistoryTabs();
    renderHistory();
    openOverlay('historyOverlay');
  }

  /* ---------------- toast / warning ---------------- */
  function showToast(message, ms = 2600) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(app.toastTimer);
    app.toastTimer = setTimeout(() => el.toast.classList.remove('show'), ms);
  }

  function showImeWarning(message) {
    el.imeWarning.textContent = message;
    el.imeWarning.hidden = false;
    clearTimeout(app.imeWarnTimer);
    app.imeWarnTimer = setTimeout(() => {
      el.imeWarning.hidden = true;
    }, 4600);
  }

  /* ---------------- events ---------------- */
  function bindEvents() {
    $$('#modeTabs .tab').forEach((b) => {
      b.addEventListener('click', () => setMode(b.dataset.mode));
    });

    el.toolbar.addEventListener('click', onToolbarClick);
    el.toolbar.addEventListener('change', onToolbarChange);

    el.restartBtn.addEventListener('click', restart);
    el.finishBtn.addEventListener('click', () => {
      const s = app.session;
      if (!s || s.status === 'idle' || s.typed.length === 0) {
        showToast('先开始输入吧。');
        return;
      }
      finishSession('manual');
    });

    $('#settingsBtn').addEventListener('click', openSettings);
    $('#historyBtn').addEventListener('click', openHistory);

    el.correctionSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-correction]');
      if (!btn) return;
      app.settings.correction = btn.dataset.correction === 'strict' ? 'strict' : 'free';
      if (app.session) app.session.strict = app.settings.correction === 'strict';
      saveSettings();
      syncSettingsUI();
      updateFoot();
      showToast(app.settings.correction === 'strict' ? '已切换到严格模式' : '已切换到自由模式');
    });

    el.punctLenient.addEventListener('change', () => {
      app.settings.punctLenient = el.punctLenient.checked;
      saveSettings();
      if (app.session) updateView();
      showToast(app.settings.punctLenient ? '标点宽容已开启' : '标点宽容已关闭');
    });

    el.autoIndent.addEventListener('change', () => {
      app.settings.autoIndent = el.autoIndent.checked;
      saveSettings();
      showToast(app.settings.autoIndent ? '自动缩进已开启' : '自动缩进已关闭');
    });

    el.historyTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-hmode]');
      if (!btn) return;
      app.historyMode = btn.dataset.hmode;
      syncHistoryTabs();
      renderHistory();
    });

    el.clearHistoryBtn.addEventListener('click', () => {
      if (!app.history.length) {
        showToast('还没有记录。');
        return;
      }
      if (!window.confirm('确定清空全部练习记录吗？此操作无法撤销。')) return;
      app.history = [];
      writeJSON(HISTORY_KEY, []);
      renderHistory();
      showToast('记录已清空。');
    });

    el.resultOverlay.addEventListener('click', (e) => {
      if (e.target === el.resultOverlay) {
        hideResult();
        return;
      }
      const btn = e.target.closest('[data-action]');
      if (btn) {
        const action = btn.dataset.action;
        if (action === 'again') {
          hideResult();
          restart();
        } else if (action === 'next') {
          hideResult();
          nextContent();
        } else if (action === 'history') {
          hideResult();
          openHistory();
        } else if (action === 'drill') {
          hideResult();
          startDrill(app.lastDrillChars);
        }
        return;
      }
      if (e.target.closest('[data-close="resultOverlay"]')) hideResult();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-close]');
      if (!btn) return;
      const id = btn.dataset.close;
      if (id === 'resultOverlay') hideResult();
      else closeOverlay(id);
    });

    ['settingsOverlay', 'historyOverlay'].forEach((id) => {
      const node = document.getElementById(id);
      node.addEventListener('mousedown', (e) => {
        if (e.target === node) closeOverlay(id);
      });
    });

    el.directSink.addEventListener('keydown', onDirectKey);
    el.directSink.addEventListener('beforeinput', (e) => e.preventDefault());
    el.directSink.addEventListener('paste', (e) => e.preventDefault());
    el.directSink.addEventListener('compositionstart', () => {
      showImeWarning('检测到输入法合成，请切换到英文输入状态');
    });
    el.directSink.addEventListener('focus', onSinkFocus);
    el.directSink.addEventListener('blur', onSinkBlur);

    el.imeSink.addEventListener('keydown', onZhKey);
    el.imeSink.addEventListener('input', onZhInput);
    el.imeSink.addEventListener('compositionstart', onCompStart);
    el.imeSink.addEventListener('compositionupdate', onCompUpdate);
    el.imeSink.addEventListener('compositionend', onCompEnd);
    el.imeSink.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertFromPaste') e.preventDefault();
    });
    el.imeSink.addEventListener('paste', (e) => e.preventDefault());
    el.imeSink.addEventListener('focus', onSinkFocus);
    el.imeSink.addEventListener('blur', onSinkBlur);

    el.stage.addEventListener('click', (e) => {
      if (e.target.closest('button, select, option')) return;
      focusInput();
    });

    el.pauseOverlay.addEventListener('click', focusInput);

    window.addEventListener('blur', pauseSession);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseSession();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (e.isComposing || app.composing) return;
        const overlay = openOverlayEl();
        if (overlay) {
          e.preventDefault();
          if (overlay.id === 'resultOverlay') hideResult();
          else closeOverlay(overlay.id);
          return;
        }
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'SELECT' || ae.tagName === 'INPUT' || ae.tagName === 'BUTTON')) return;
        if (app.session) {
          e.preventDefault();
          restart();
        }
        return;
      }

      if (e.key === 'Tab') {
        if (e.isComposing || app.composing) return;
        if (openOverlayEl()) return;
        const ae = document.activeElement;
        if (ae === el.directSink || ae === el.imeSink) {
          e.preventDefault();
          restart();
        }
      }
    });
  }

  function onSinkFocus() {
    const s = app.session;
    if (!s) return;
    if (s.status === 'paused') resumeSession();
    if (s.mode === 'zh') {
      try { el.imeSink.setSelectionRange(0, 0); } catch (err) { /* noop */ }
    }
  }

  function onSinkBlur() {
    const s = app.session;
    if (!s || s.status !== 'running') return;
    pauseSession();
  }

  function savePrefs() {
    app.prefs.mode = app.mode;
    writeJSON(PREFS_KEY, app.prefs);
  }

  /* ---------------- init ---------------- */
  function init() {
    updateTabs();
    syncSettingsUI();
    updateFoot();
    bindEvents();
    startSession();
  }

  init();
})();
