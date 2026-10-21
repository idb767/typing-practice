 [在线访问打字练习](https://idb767.github.io/typing-practice/)
# Typing Practice (Offline Single-File Edition)

A typing-speed practice page for Chinese, English, and Python code. The whole app is one `index.html` — double-click it in Edge or Chrome. No internet, no installation.

> [中文版](#打字练习离线单文件版)

## Quick Start

1. Double-click `index.html`.
2. Click anywhere in the text area and start typing.
3. Press `Esc` or `Tab` to restart the current text. Use **History** and **Settings** in the top-right corner.

The timer starts on your first keystroke. Switching to another window pauses the session automatically; click back to resume.

## Modes

### Chinese (full pinyin)

- **Characters & words**: a random mix of common characters and words, 30 / 60 / 120 seconds. The session ends automatically when time is up.
- **Essays**: 6 original short essays with full-width punctuation. The session ends when you finish the text.
- Type with your system IME (full pinyin). The candidate window follows the current caret.
- The result screen analyzes weak spots: characters you got wrong and characters with a slow average response time. Click **Drill these characters** to generate a focused drill.

### English

- **Words**: 15 / 30 / 60-second timed sessions, or fixed lengths of 10 / 25 / 50 words.
- **Articles**: 4 original passages with punctuation, capitalization, and line breaks.
- The result screen shows a physical-key heatmap. Darker keys mean more mistakes or slower typing on that key.

### Code (Python)

- 16 progressive snippets: variables, conditionals, loops, functions, default arguments, comprehensions, classes, and more.
- Leading indentation is filled in automatically after a newline. Auto-inserted spaces do not count toward speed or accuracy.
- Blank lines and repeated indentation are supported; the caret maps to the correct line.
- Speed is measured in **characters/min**. The result screen also includes a key heatmap.

> Keep your keyboard in English input mode for Code and English modes. Chinese punctuation will be counted as mistakes.

## Settings

Settings are saved in your local browser and persist across visits.

- **Correction mode**
  - Free: mistakes do not stop you; the final score is based on accuracy (default).
  - Strict: a wrong key does not advance; you must press the correct key to continue.
- **Punctuation leniency** (Chinese only, off by default)
  - Accepts half-width punctuation in place of full-width punctuation, e.g. `,` for `，`.
  - Only width is relaxed, not punctuation type. Typing `，` where `。` is required still counts as an error.
  - The result screen reports both `Punctuation errors: N` and `Half-width punctuation allowed: N`.
  - After 3 punctuation errors in a row, the page suggests enabling this option.
- **Auto-indent** (Code mode, on by default)
  - Fills in leading indentation after a newline. Inserted spaces are not counted as manual input.

## Metrics

| Metric | Definition |
| --- | --- |
| Chinese chars/min | Correctly committed characters ÷ effective minutes |
| English WPM | Correct characters ÷ 5 ÷ effective minutes |
| Code chars/min | Manually typed correct characters ÷ effective minutes, excluding auto-indent |
| Accuracy | Correct attempts ÷ total attempts. Chinese counts whole committed characters; English and Code count keystrokes |
| Consistency | Stability of keystroke intervals: `100 × (1 − SD / mean interval)`. Only intervals between 40 and 2500 ms are used; fewer than 3 samples counts as 100 |
| Duration | From the first keystroke to the last input, excluding paused time |

- Chinese input is scored per committed character. When several characters are committed at once, each one is compared individually.
- Best results are tracked separately for each essay, each code snippet, and each word setting. Beating a record shows a PB badge.
- History keeps up to 800 records. Speed charts can be viewed separately for Chinese, English, and Code.

## Data Storage

Everything stays in your browser's localStorage and is never uploaded:

- `typing-practice.settings.v1` — correction mode, punctuation leniency, auto-indent
- `typing-practice.prefs.v1` — last selected mode, text, and duration
- `typing-practice.history.v1` — practice records

Clearing site data for this page also clears settings and history. Data does not sync across browsers or computers.

## Project Layout

```
typing-practice/
├─ index.html        # Final deliverable; double-click to use
├─ README.md         # This file (English first, Chinese below)
└─ src/              # Split source files
   ├─ 00-head.html   # HTML skeleton + CSS
   ├─ 10-data.js     # Chinese/English word lists, essays, Python snippets
   ├─ 15-sep.html    # <script> separator
   ├─ 20-app.js      # All application logic
   └─ 90-tail.html   # Closing tags
```

Rebuild after editing `src/`:

```bash
cd typing-practice
cat src/00-head.html src/10-data.js src/15-sep.html src/20-app.js src/90-tail.html > index.html
```

Syntax check:

```bash
cat src/10-data.js src/20-app.js > /tmp/tp-check.js && node --check /tmp/tp-check.js
```

## Known Limitations

- The Chinese IME candidate window is drawn by the OS/browser. Automated tests can only simulate composition events. Verify candidate-window placement with your actual IME (Microsoft Pinyin, Sogou, etc.) on your machine.
- The page is designed for a desktop keyboard. It opens on phones but is not optimized for touch.
- There are no accounts and no cross-device sync.

## Tests

Development tests live in `../typing-practice-test/`:

- `node smoke.mjs` — Edge + Chrome DevTools Protocol; 78 checks covering IME commits, strict/lenient punctuation, pause/resume, code auto-indent and blank-line caret mapping, English articles, automatic finish of a 15-second session, history, and persistence.
- `node shots.mjs` — saves UI screenshots to `shots/`.

---

# 打字练习（离线单文件版）

练中文、英文和 Python 代码的手速练习页。整个应用只有一个 `index.html`，双击用 Edge / Chrome 打开就能用，不需要联网、不需要安装任何东西。

> [English](#typing-practice-offline-single-file-edition)

## 快速开始

1. 双击 `index.html`。
2. 在页面文字区域点一下，直接开始打字。
3. `Esc` 或 `Tab` 重开当前内容；右上角可以打开「记录」和「设置」。

计时从第一次按键开始，切换到别的窗口会自动暂停，点回来继续。

## 三种模式

### 中文（全拼）

- **字词**：常用字 + 常用词随机组合，可选 30 / 60 / 120 秒，时间到自动结算。
- **范文**：6 篇原创短文，全角标点，打完自动结算。
- 用系统输入法（全拼）输入，候选框会跟随当前光标位置。
- 结算页有弱项分析：打错的字、平均反应慢的字。点「专练这些字」会把这些字打散成一组专项练习。

### 英文

- **单词**：15 / 30 / 60 秒计时，或 10 / 25 / 50 词定量。
- **文章**：4 篇原创短文，带标点、大写和换行。
- 结算页给出物理按键热力图，颜色越深表示这个键错得越多或按得越慢。

### 代码（Python）

- 16 段由浅入深的片段：变量、条件、循环、函数、默认参数、推导式、类等。
- 换行后自动补齐行首缩进；自动补上的空格不计入速度和正确率。
- 支持空行、连续缩进，光标位置按行正确映射。
- 速度单位是「字符/分」，结算页同样有按键热力图。

> 代码模式和英文模式请保持英文输入状态；中文标点会被判错。

## 设置

设置会自动保存在本机浏览器里，下次打开仍然有效。

- **纠错模式**
  - 自由：打错也能继续，最后按正确率结算（默认）。
  - 严格：打错不会前进，必须按对才能继续。
- **标点宽容**（仅中文，默认关闭）
  - 打开后接受半角标点代替全角标点，例如用 `,` 代替 `，`。
  - 只放宽全角/半角，不放过标点种类错误（比如把 `。` 打成 `，`）。
  - 结算时会注明「标点错误 N 处」和「半角标点宽容 N 处」。
  - 连续出现 3 次标点错误时，页面会提示可以开启这个选项。
- **自动缩进**（代码模式，默认开启）
  - 换行后自动补上行首缩进；补上的空格不算手动输入。

## 统计口径

| 指标 | 算法 |
| --- | --- |
| 中文字/分 | 正确提交的字数 ÷ 有效用时（分钟） |
| 英文 WPM | 正确字符数 ÷ 5 ÷ 有效用时（分钟） |
| 代码字符/分 | 手动输入的正确字符数 ÷ 有效用时（分钟），不含自动缩进 |
| 正确率 | 正确次数 ÷ 总尝试次数；中文按整字提交计，英文/代码按按键计 |
| 一致性 | 按键间隔越稳定越高：`100 × (1 − 标准差 / 平均间隔)`，只统计 40–2500ms 的间隔，少于 3 个样本按 100 计 |
| 用时 | 从第一次按键到最后一次输入，暂停时间不计入 |

- 中文按整字提交统计：一次提交多个字时，逐字比对。
- 每篇范文、每段代码、每种单词设置分别记录最佳成绩；破纪录会显示 PB 标记。
- 历史最多保留 800 条，可按中文 / 英文 / 代码分别查看速度曲线。

## 数据存储

所有数据只存在本机浏览器的 localStorage 里，不会上传：

- `typing-practice.settings.v1`：纠错模式、标点宽容、自动缩进
- `typing-practice.prefs.v1`：上次选的模式、篇目、时长
- `typing-practice.history.v1`：练习记录

清除浏览器对应站点的数据会一并清空设置和记录。换浏览器或换电脑不会同步。

## 文件结构

```
typing-practice/
├─ index.html        # 最终交付文件，双击即可使用
├─ README.md         # 本文件（英文在前，中文在后）
└─ src/              # 拆分后的源文件
   ├─ 00-head.html   # HTML 骨架 + CSS
   ├─ 10-data.js     # 中英文词库、范文、Python 片段
   ├─ 15-sep.html    # <script> 分隔
   ├─ 20-app.js      # 全部应用逻辑
   └─ 90-tail.html   # 收尾标签
```

修改 `src/` 后重新拼装：

```bash
cd typing-practice
cat src/00-head.html src/10-data.js src/15-sep.html src/20-app.js src/90-tail.html > index.html
```

语法检查：

```bash
cat src/10-data.js src/20-app.js > /tmp/tp-check.js && node --check /tmp/tp-check.js
```

## 已知限制

- 中文候选框由操作系统/浏览器绘制，自动化测试只能模拟输入法组合事件。实际候选框位置和不同输入法（微软拼音、搜狗等）的兼容性，建议在本机实打一遍确认。
- 页面以桌面键盘为主，手机上能打开，但没有针对触屏做优化。
- 没有账号体系，无法在设备间同步记录。

## 测试

开发用的无头浏览器测试在 `../typing-practice-test/`：

- `node smoke.mjs`：Edge + Chrome DevTools Protocol，78 项检查，覆盖中文输入法提交、严格/宽容标点、暂停恢复、代码自动缩进与空行光标、英文文章、15 秒计时自动结算、历史与持久化等。
- `node shots.mjs`：生成界面截图到 `shots/`。
>>>>>>> master
