/* =========================================================
   内容库
   - 所有文章均为原创，避免版权问题
   - 中文标点统一使用全角
   ========================================================= */

const EN_WORDS = [...new Set(`
the be to of and a in that have it for not on with as you do at this but by from they we say or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is are was were been being has had did does doing should may might must shall
able about above accept across act add address after again against age ago agree air all allow almost alone along already also although always among amount animal another answer anyone anything appear apply area arm around arrive art ask attention aunt available avoid away baby back bad bag ball bank base beautiful become bed before begin behavior behind believe below best better between beyond big bill bird bit black blood blue board body book born both box boy break bring brother build business buy call camera can capital car card care carry case catch cause cell center century certain chair chance change check child choice choose church city class clear climb close clothes club coach cold college color come common company compare complete computer concern condition conference consider continue control cook cool corner cost could country couple course court cover create cross cry culture cup current customer cut dark data daughter day dead deal death decide decision deep defense degree describe design detail determine develop die difference different difficult dinner direction discover discuss disease do doctor dog door down draw dream drive drop drug during each early east easy eat economy edge education effect effort eight either election else employee end energy enjoy enough enter entire environment especially establish even evening event ever every everyone everything evidence exactly example executive exist expect experience expert explain eye face fact factor fail fall family far fast father fear federal feel feeling few field fight figure fill film final finally find fine finger finish fire firm first fish five floor fly focus follow food foot for force foreign forget form former forward four free friend from front full fund future game garden general generation get girl give glass go goal good government great green ground group grow growth guess gun guy hair half hand hang happen happy hard have he head health hear heart heat heavy help her here herself high him himself his history hit hold home hope hospital hot hotel hour house how however huge human hundred husband idea identify if image imagine impact important improve include including increase indeed indicate individual industry information inside instead interest international interview into investment involve issue item its itself job join just keep key kid kill kind kitchen know knowledge land language large last late later laugh law lawyer lay lead leader learn least leave left leg legal less let letter level lie life light like likely line list listen little live local long look lose loss lot love low machine main maintain major make man manage manager many market marriage material matter may maybe me mean measure media medical meet meeting member memory mention message method middle might military million mind minute miss mission model modern moment money month more morning most mother mouth move movement movie much music must my myself name nation national natural nature near nearly necessary need network never new news newspaper next nice night no none nor north not note nothing notice now number occur off offer office officer official often oil ok old on once one only open operation opportunity option or order organization other others our out outside over own owner page pain painting paper parent part participant particular particularly partner party pass past patient pattern pay peace people per perform performance perhaps period person personal phone physical pick picture piece place plan plant play player point police policy political politics poor popular population position positive possible power practice prepare present president pressure pretty prevent price private probably problem process produce product professional program project property protect prove provide public pull purpose push put quality question quickly quite race radio raise range rate rather reach read ready real reality realize really reason receive recent recently recognize record red reduce reflect region relate relationship religious remain remember remove report represent require research resource respond response rest result return reveal rich right rise risk road rock role room rule run safe same save say scene school science score sea season seat second section security see seek seem sell send senior sense series serious serve service set seven several shake share she shoot short should shoulder show side sign significant similar simple simply since sing single sister sit site situation six size skill small smile so social society soldier some somebody someone something sometimes son song soon sort sound source south space speak special specific speech spend sport spring staff stage stand standard star start state station stay step still stop store story strategy street strong structure student study stuff style subject success such suddenly suffer suggest summer support sure surface system table take talk task tax teach teacher team technology television tell ten tend term test than thank that the their them themselves then theory there these they thing think third this those though thought thousand threat three through throughout throw thus time to today together tonight too top total tough toward town trade traditional training travel treat treatment tree trial trip trouble true truth try turn two type under understand unit until up upon us use usually value various very victim view violence visit voice vote wait walk wall want war watch water way we weapon wear week weight well west what whatever when where whether which while white who whole whom whose why wide wife will win wind window wish with within without woman wonder word work worker world worry would write writer wrong yard yeah year yes yet you young your yourself
`.split(/\s+/).filter(Boolean))];

const EN_ARTICLES = [
  {
    title: "The Quiet Power of Habit",
    text: `Most people imagine that change arrives with a dramatic decision. In reality, the changes that last usually begin with something much smaller: a habit repeated until it becomes invisible. A person who wants to read more does not need a new library; they need twenty minutes before bed. A person who wants to run a marathon does not start with the marathon; they start by putting on their shoes.

Habits are powerful because they remove the cost of deciding. Every choice we make consumes attention, and attention is the most limited resource we have. When a behavior becomes automatic, it stops competing with everything else. We no longer ask ourselves whether to do it; we simply do it. This is why a good routine can feel like a quiet engine running in the background of a busy life.

But habits are also stubborn. They do not care whether they serve us. A person can practice distraction as faithfully as they practice kindness. The key is not to fight an old habit with willpower, but to replace it with a new one that satisfies the same need. If checking your phone fills a moment of boredom, the answer is not to stare at the wall; it is to keep a book where the phone used to be.

Small changes also compound. Twenty minutes of practice every day sounds modest, and it is. Over a year, however, it becomes more than a hundred hours. The person who improves is rarely the one who makes the biggest single effort. It is the one who shows up on ordinary days, when the work feels unremarkable and no one is watching.

So the question is not whether you can change everything at once. You cannot, and you do not need to. The better question is what small action you could repeat tomorrow, and the day after that. Choose something almost too easy, make it visible, and let time do the part that motivation cannot.`
  },
  {
    title: "A Morning in the City",
    text: `The city is at its most honest before the shops open. At six in the morning, the streets belong to a different set of people: bakers, cleaners, nurses coming off a night shift, and runners who have learned to avoid the heat. The traffic lights change for almost no one. The air still smells of rain from the night before.

I like to walk through the old market at this hour. The stalls are not ready yet, but the work has already begun. A woman arranges tomatoes into a neat pyramid; a man hoses down the pavement and whistles at a dog. Someone is frying dough in a deep pan, and the smell follows me for a whole block. None of this is remarkable, and that is exactly why I notice it. During the day, the same street will be loud and crowded, and I will walk through it without seeing anything at all.

By seven, the first buses arrive. Students with headphones stand in a loose line; office workers hold coffee and check their phones. The city begins to assemble itself, piece by piece, like a machine that has been switched on. For a few minutes, the early crowd and the late night crowd share the same pavement, and then they separate, each group disappearing into its own version of the day.

I often think that a city is not really made of buildings. It is made of these small routines, repeated by millions of people who will never meet. The baker does not know the nurse; the runner does not know the student waiting for the bus. Yet their schedules fit together, and the whole thing works. There is something comforting about that, even if it is also a little lonely.

By eight, the market is full and the streets are ordinary again. I finish my coffee, join the crowd, and become just another person in a hurry.`
  },
  {
    title: "Why We Read",
    text: `We read for many reasons, and not all of them are noble. We read to pass the time on a train, to learn how to fix a sink, to fall asleep, to feel less alone. Sometimes we read because everyone else is reading the same book and we do not want to be left out of the conversation. None of these reasons is a bad one.

The strange thing about reading is how private it is. A film can make a room laugh together; a song can turn a crowd into a single voice. A book asks you to sit still and build the world yourself. Two people can read the same paragraph and imagine entirely different rooms, faces, and weather. The words are shared, but the experience is not.

This privacy is also why reading can be so useful. A book gives you a place to think without being watched. You can disagree with the author, put the book down, and come back a year later. You can underline a sentence that you are not ready to explain. In a world that rewards quick reactions, reading offers the rare pleasure of a slow one.

I do not remember most of the books I have read. I remember a few sentences, a handful of characters, and the feeling of certain afternoons. Perhaps that is enough. A book does not have to stay in your memory to change the way you see things. Sometimes it leaves behind a question, and the question turns out to be more valuable than the answer.

So I keep a book near the door, another by the bed, and a third in my bag. I rarely finish them on schedule. But they are there, waiting, and that is a kind of company.`
  },
  {
    title: "The Shape of the Internet",
    text: `When people describe the internet, they often use the language of space. We talk about visiting a site, entering a room, browsing a market, or getting lost down a rabbit hole. These metaphors are useful, but they hide something important: the internet is not a place. It is a set of decisions, made by people, about what should be easy and what should be hard.

Consider the simple act of opening an app. The designers have chosen which buttons appear first, which notifications arrive, and which actions require an extra tap. None of these choices is neutral. A feed that loads endlessly is not an accident; it is a design decision that makes stopping slightly harder. A message that disappears after a few seconds is not magic; it is a rule about memory.

This does not mean that technology is evil or that its creators are villains. Most of these choices are made to solve real problems, and many of them work well. But it does mean that we should be curious about the shape of the tools we use. What does this app make easy? What does it make difficult? What would I do differently if the button were somewhere else?

The good news is that attention is trainable. We can notice the moment an app pulls us away and choose to return. We can keep a book where the phone usually sits. We can decide that some hours are for deep work and others are for messages. These are small acts, but they add up to a kind of authorship over our own days.

The internet will keep changing, and so will the decisions behind it. The useful skill is not memorizing which platform is good or bad today. It is learning to see the design, ask who benefits, and then choose, deliberately, how much of your life you want to hand over to it.`
  }
];

/* 常用字（按频率排列，运行时去重后取前 600 个） */
const ZH_CHARS_RAW = `的一是不了在人有我他这个们中来上大为和国地到以说时要就出会可也你对生能而子那得于着下自之年过发后作里用道行所然家种事成方多经么去法学如都同现当没动面起看定天分还进好小部其些主样理心她本前开但因只从想实日军者意无力它与长把机十民第公此已工使情明性知全三又关点正业外将两高间由问很最重并物手应战向头文体政美相见被利什二等产或新己制身果加西斯月话合回特代内信表化老给世位次度门任常先海通教儿原东声提立及比员解水名真论处走义各入几口认条平系气题活尔更别打女变四神总何电数安少报才结反受目太量再感建务做接必场件计管期市直德资命山金指克许统区保至队形社便空决治展马科司五基眼书非则听白却界达光放强即像难且权思王象完设式色路记南品住告类求据程北边死张该交规万取拉格望觉术领共确传师观清今切院让识候带导争运笑飞风步改收根干造言联持组每济车亲极林服快办议往元英士证近失转夫令准布始怎呢存未远叫台单影具罗字爱击流备兵连调深商算质团集百需价花党华城石级整府离况亚请技际约示复病息究线似官火断精满支视消越器容照须九增研写称企八功吗包片史委乎查轻易早曾除农找装广显吧阿李标谈吃图念六引历首医局突专费号尽另周较注语仅考落青随选列武红响虽推势参希古众构房半节土投某案黑维革划敌致陈律足态护七兴派孩验责营星够章音跟志底站严巴例防族供效续施留讲型料终答紧黄绝奇察母京段依批群项故按河米围江织害斗双境客纪采举杀攻父苏密低朝友诉止细愿千值仍男钱破网热助倒育属坐帝限船脸职速刻乐否刚威毛状率甚独球般普怕弹校苦创假久错承印晚兰试股拿脑预谁益阳若哪微尼继送急血惊伤素药适波夜省初喜卫源食险待述陆习置居劳财环排福纳欢雷警获模充负云停木游龙树疑层冷洲冲射略范竟句室异激汉村哈策演简卡罪判担州静退既衣您宗积余痛检差富灵协角占配征修皮挥胜降阶审沉坚善妈刘读啊超免压银买皇养伊怀执副乱抗犯追帮宣佛岁航优怪香著田铁控税左右份穿艺背阵草脚概恶块顿敢守酒岛托央户烈洋哥索胡款靠评版宝座释景顾弟登货互付伯慢欧换闻危忙核暗姐介坏讨丽良序升监临亮露永呼味野架域沙掉括舰鱼杂误湾吉减编楚肯测败屋跑梦散温困剑渐封救贵枪缺楼县尚毫移娘朋画班智亦耳恩短掌恐遗固席松秘谢鲁遇康虑幸均销钟诗藏赶剧票损忽巨炮旧端探湖录叶春乡附吸予礼港雨呀板庭妇归睛饭额含顺输摇招婚脱补谓督毒油疗旅泽材灭逐莫笔亡鲜词圣择寻厂睡博勒烟授诺伦岸奥唐卖俄炸载洛健堂旁宫喝借君禁阴园谋宋避抓荣姑孙逃牙束跳顶玉镇雪午练迫爷篇肉嘴馆遍凡础洞卷坦牛宁纸诸训私庄祖丝翻暴森塔默握戏隐熟骨访弱蒙歌店鬼软典欲萨伙遭盘爸扩盖弄雄稳忘亿刺拥徒姆杨齐赛趣曲刀床迎冰虚玩析窗醒妻透购替塞努休虎扬途侵刑绿兄迅套贸毕唯谷轮库迹尤竞街促延震弃甲伟麻川申缓潜闪售灯针哲络抵朱埃抱鼓植纯夏忍页杰筑折郑贝尊吴秀混臣雅振染盛怒舞圆搞狂措姓残秋培迷诚宽宇猛摆梅毁伸摩盟末乃悲拍丁赵硬麦蒋操耶阻订彩抽赞魔纷沿喊违妹浪汇币丰蓝殊献桌啦瓦莱援译夺汽烧距裁偏符勇触课敬哭懂墙袭召罚侠厅拜巧侧韩冒债曼融惯享戴童犹乘挂奖绍厚纵障讯涉彻刊丈爆乌役描洗玛患妙镜唱烦签仙彼弗症仿倾牌陷鸟轰咱菜闭奋庆撤泪茶疾缘播朗杜奶季丹狗尾仪偷奔珠虫驻孔宜艾桥淡翼恨繁寒伴叹旦愈潮粮缩罢聚径恰挑袋灰捕徐珍幕映裂泰隔启尖忠累炎暂估泛荒偿横拒瑞忆孤鼻闹羊呆厉衡胞零穷舍码赫婆魂灾洪腿胆津俗辩胸晓劲贫仁偶辑邦恢赖圈摸仰润堆碰艇稍迟辆废净凶署壁御奉旋冬矿抬蛋晨伏吹鸡倍糊秦盾杯租骑乏隆诊奴摄丧污渡旗甘耐凭扎抢绪粗肩梁幻菲皆碎宙叔岩荡综爬荷悉蒂返井壮薄悄扫敏碍殖详迪矛霍允幅撒剩凯颗骂赏液番箱贴漫酸郎腰舒眉忧浮辛恋餐吓挺励辞艘键伍峰尺昨黎辈贯侦滑券崇扰宪绕趋慈乔阅汗枝拖墨胁插箭腊粉泥氏彭拔骗凤慧媒佩愤扑龄驱惜豪掩兼跃尸肃帕驶堡届欣惠册储飘桑闲惨洁踪勃宾频仇磨递邪撞拟滚奏巡颜剂绩贡疯坡瞧截燃焦殿伪柳锁逼颇昏劝呈搜勤戒驾漂饮曹朵仔柔俩孟腐幼践籍牧凉牲佳娜浓芳稿竹腹跌逻垂遵脉貌柏狱猜怜惑陶兽帐饰贷昌叙躺钢沟寄扶铺邓寿惧询汤盗肥尝匆辉奈扣廷澳嘛董迁凝慰厌脏腾幽怨鞋丢埋泉涌辖躲晋紫艰魏吾慌祝邮吐狠鉴曰械咬邻赤挤弯椅陪割揭韦悟聪雾锋梯猫祥阔誉筹丛牵鸣沈阁穆屈旨袖猎臂蛇贺柱抛鼠瑟戈牢逊迈欺吨琴衰瓶恼燕仲诱狼池疼卢仗冠粒遥吕玄尘冯抚浅敦缠`;

const ZH_CHARS = [...new Set(Array.from(ZH_CHARS_RAW))].slice(0, 600);

const ZH_WORDS = [...new Set(`
我们 你们 他们 她们 它们 自己 什么 怎么 这个 那个 这样 那样 因为 所以 但是 如果 虽然 已经 可以 应该 需要 可能 觉得 知道 认为 希望 喜欢 开始 结束 工作 学习 生活 时间 今天 明天 昨天 现在 以后 以前 地方 东西 事情 问题 办法 方法 世界 国家 社会 学校 老师 学生 朋友 家人 父母 孩子 身体 心情 天气 太阳 月亮 星星 天空 大海 城市 农村 公园 商店 医院 银行 电脑 手机 网络 信息 数据 系统 程序 代码 文件 内容 结果 原因 变化 发展 提高 增加 减少 解决 发现 出现 发生 选择 决定 准备 完成 继续 努力 认真 仔细 清楚 简单 复杂 重要 主要 特别 非常 一定 真正 直接 实际 基本 一般 普通 特殊 相同 不同 安全 健康 快乐 幸福 美丽 干净 安静 热闹 方便 舒服 困难 容易 紧张 放松 有趣 无聊 奇怪 正常 正确 错误 成功 失败 经验 教训 机会 挑战 目标 计划 梦想 未来 过去 历史 文化 艺术 音乐 电影 书籍 故事 语言 文字 汉字 拼音 输入 练习 记忆 思考 理解 表达 交流 讨论 意见 建议 帮助 支持 鼓励 感谢 抱歉 对不起 没关系 再见 你好 早上 中午 晚上 吃饭 睡觉 起床 休息 运动 散步 旅行 旅游 风景 照片 礼物 生日 节日 春节 中秋 国庆 夏天 冬天 春天 秋天 下雨 下雪 刮风 阳光 空气 自然 环境 动物 植物 花朵 树林 河流 山峰 地球 宇宙 科学 技术 研究 实验 数学 物理 化学 生物 经济 政治 法律 新闻 广告 产品 市场 价格 质量 服务 客户 公司 工厂 农业 工业 交通 汽车 火车 飞机 地铁 公交 道路 桥梁 建筑 房屋 房间 厨房 卧室 客厅 窗户 门口 桌子 椅子 床上 衣服 鞋子 帽子 眼镜 颜色 红色 蓝色 绿色 黄色 黑色 白色 数字 第一 第二 最后 左边 右边 前面 后面 上面 下面 里面 外面 中间 旁边 附近 远处 这里 那里 哪里 每次 每天 每年 一些 一点 很多 不少 全部 大部分 其他 另外 而且 并且 或者 还是 不但 甚至 例如 比如 其实 当然 确实 也许 大概 差不多 马上 立刻 终于 仍然 正在 将要 曾经 从来 一直 总是 经常 有时 偶尔 很少 从不 必须 千万 不要 分别 一起 共同 互相 各自 单独 亲自 主动 被动 积极 消极 优点 缺点 长处 短处 兴趣 爱好 习惯 态度 性格 能力 水平 成绩 分数 排名 比赛 足球 篮球 游泳 跑步 唱歌 跳舞 画画 读书 写字 听歌 看电影 玩游戏 上网 购物 聊天 打电话 发消息 看新闻 做作业 上课 考试 放假 开学 毕业 就业 面试 工资 收入 支出 存款 投资 风险 保险 合同 规则 制度 政策 政府 人民 群众 个人 集体 团队 合作 竞争 和平 战争 自由 平等 公平 正义 道德 文明 传统 现代 古代 年轻 年老 男生 女生 大人 小孩 青年 老人 医生 护士 警察 司机 工人 农民 商人 律师 记者 演员 歌手 作家 画家 科学家 工程师 程序员 经理 老板 同事 同学 邻居 客人 主人 服务员 售货员 运动员 教练 队员 观众 读者 作者 用户 会员 志愿者 陌生人 熟人 恋人 夫妻 丈夫 妻子 儿子 女儿 哥哥 姐姐 弟弟 妹妹 爷爷 奶奶 外公 外婆 叔叔 阿姨 表哥 表妹 堂哥 堂妹 侄子 侄女 孙子 孙女 女婿 媳妇 亲戚 一心一意 三心二意 井井有条 实事求是 循序渐进 熟能生巧 温故知新 举一反三 全神贯注 持之以恒 日积月累 脚踏实地 精益求精 一丝不苟 有条不紊 从容不迫 心平气和 聚精会神 自然而然 恰到好处
`.split(/\s+/).filter(Boolean))];

const ZH_ESSAYS = [
  {
    title: "城市清晨",
    text: `清晨六点，城市还没有完全醒来。街道上只有零星的车辆，路边的早餐店已经亮起灯，热气从窗口缓缓升起。环卫工人推着小车，把昨夜的落叶扫成一堆。远处的公交站台前，站着几个赶早班的人，他们低头看手机，偶尔抬头张望。太阳从楼群后面升起来，把玻璃幕墙染成金色。我沿着河边慢慢走，看见有人在跑步，有人在打太极，还有一位老人坐在长椅上喂鸽子。风从水面吹过来，带着一点潮湿的味道。这一刻，城市显得安静而温柔，好像所有的匆忙都还没有开始。我想，也许每个城市都有这样的时刻，只要你愿意早起，就能看见它不为人知的一面。那些白天里被忽略的声音，此刻都变得清楚：扫帚摩擦地面的沙沙声，远处传来的鸟叫，还有早餐店老板招呼客人的笑声。它们拼在一起，成了这座城市最朴素的早晨。`
  },
  {
    title: "关于坚持",
    text: `很多事情开始的时候都很热闹，坚持下来却很难。第一天跑步，你会觉得自己充满力量；第一周学一门新技能，你会被新鲜感推着往前走。真正考验人的，是热度退去之后那些普通的日子。窗外下着雨，工作又很累，你很容易给自己找一个合理的借口：明天再开始吧。可是明天也有明天的困难，如果每次都把今天推给明天，计划就会慢慢变成一句空话。有人说：“坚持就是胜利。”这句话听起来简单，做起来却需要一点耐心。坚持并不是要求你每天都做到完美。有时候你只能完成计划的一小部分，有时候你甚至需要停下来休息。重要的是，休息之后还愿意回来。就像春天的种子，表面上看不见变化，根却一直在土壤里生长。等你回头的时候，会发现那些看似微小的努力，已经连成了一条路。所以，不必急着证明自己，也不必因为一次中断就否定全部。把目标拆小一点，把脚步放稳一点，日子久了，时间自然会给出答案。`
  },
  {
    title: "一次旅行",
    text: `去年秋天，我一个人去了一趟山里。出发前，我做了详细的计划，甚至连每天几点吃饭都写在本子上。可是到了那里才发现，山路比想象中难走，天气也变化得很快。第一天下午，一场大雨打乱了所有安排，我只好躲进路边的小店，点了一碗热汤面。店主是一位五十多岁的阿姨（后来我才知道，她在这里住了三十年），她一边擦桌子，一边和我聊天。她说，山里的天气就是这样，急也没有用，等雨停了再走就好。那天我在店里坐了两个小时，看雨从屋檐上落下来，听她讲附近村子的事情。后来雨停了，天空出现一道很淡的彩虹。我改变了原来的路线，沿着一条小路慢慢走，反而看见了计划之外的风景。旅行让我明白，安排得再周密，也总会遇到意外。与其和意外较劲，不如留一点余地，接受它带来的另一种可能。回到城里以后，我常常想起那碗热汤面和那道彩虹，它们比任何一张照片都更清楚。`
  },
  {
    title: "读书的意义",
    text: `读书有什么用？这个问题听起来简单，回答起来却不容易。有人说读书可以增长知识，有人说读书可以改变命运，还有人说读书只是消磨时间。这些答案都对，但都不完整。在我看来，读书最大的好处，是让人有机会安静下来，认真听别人把话说完。一本好书不会急着给你结论，它会把一个问题慢慢展开，让你看见不同的立场和选择。读得多了，你会发现自己原来的想法并不是唯一正确的，世界也比想象中复杂。这种认识不会立刻带来什么实际的收益，却会悄悄改变你看待事情的方式。当然，读书并不是万能的。书里的知识可能过时，作者的观点也可能有偏见。所以读书的时候，既要愿意相信，也要保持怀疑。真正重要的不是记住多少句子，而是学会思考：这句话为什么这样说？如果换一个角度，会不会有别的答案？读书是一件很慢的事情，它的回报也来得很慢。但正因为慢，它才不容易被拿走。`
  },
  {
    title: "家乡的秋天",
    text: `我的家乡在一个不大的县城，秋天是最舒服的季节。夏天的炎热刚刚退去，风里带着一点凉意，天空也比平时更高更蓝。街道两旁的梧桐树开始落叶，风一吹，叶子就在地上打着旋儿。小时候，我最喜欢跟着爷爷去菜市场。秋天的市场格外热闹，摊子上堆着新收的花生、红薯和玉米，空气里混着炒栗子的香味。爷爷总会买一袋热乎乎的糖炒栗子，装在纸袋里递给我，让我慢慢吃。回家的路上，我们会经过一条小河。河水不深，岸边长满了芦苇，风一吹，白色的芦花就轻轻地摇。傍晚的时候，家家户户的灯陆续亮起来，饭菜的香味从窗户里飘出来。现在我在外地工作，很少能赶上家乡的秋天。偶尔在超市看见卖栗子的摊位，我就会想起那条小河，想起爷爷走路时略微驼背的样子。原来，秋天不只是一种天气——它还藏着许多回不去的时光。`
  },
  {
    title: "学会提问",
    text: `在学习中，提问往往比回答更重要。一个只会背答案的人，遇到新的问题就容易不知所措；而一个会提问的人，即使暂时不知道答案，也知道该往哪个方向寻找。提问的第一步，是承认自己不懂。很多人害怕在别人面前暴露无知，于是把疑问藏在心里，结果问题越积越多。其实，承认不懂并不可耻，它恰恰是学习的开始。第二步，是把问题说清楚。不要只问“为什么不对”，而要说清楚自己做到了哪一步，在哪里卡住，已经尝试过什么。一个具体的问题，往往能换来具体的帮助。第三步，是继续追问。得到答案以后，不要急着点头，可以再问一句：这个结论在什么条件下成立？有没有例外？还有没有别的可能？好的提问会像一盏灯，不仅照亮眼前的问题，也照亮更远的地方。当然，提问也需要尊重。不要用问题去为难别人，也不要把自己的思考完全交给别人。提问的最终目的，是让自己慢慢具备独立寻找答案的能力。`
  }
];

const PY_SNIPPETS = [
  {
    title: "变量与输出",
    level: "入门",
    text: `name = "world"
count = 3
print("hello", name)
print("count =", count)`
  },
  {
    title: "算术运算",
    level: "入门",
    text: `a = 12
b = 5
print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a // b, a % b, a ** 2)`
  },
  {
    title: "条件分支",
    level: "入门",
    text: `score = 86
if score >= 90:
    level = "A"
elif score >= 75:
    level = "B"
else:
    level = "C"
print(level)`
  },
  {
    title: "for 循环",
    level: "入门",
    text: `total = 0
for i in range(1, 11):
    total += i
print("sum =", total)`
  },
  {
    title: "while 循环",
    level: "入门",
    text: `n = 10
while n > 0:
    print(n)
    n -= 1
print("done")`
  },
  {
    title: "列表基础",
    level: "基础",
    text: `fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
for fruit in fruits:
    print(fruit)
print(len(fruits))`
  },
  {
    title: "列表推导式",
    level: "基础",
    text: `numbers = [1, 2, 3, 4, 5, 6]
squares = [n * n for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
print(squares)
print(evens)`
  },
  {
    title: "字典遍历",
    level: "基础",
    text: `ages = {"alice": 24, "bob": 31}
ages["carol"] = 28
for name, age in ages.items():
    print(name, age)
print(ages.get("dave", 0))`
  },
  {
    title: "函数与默认参数",
    level: "基础",
    text: `def greet(name, greeting="hello"):
    message = greeting + ", " + name
    return message

print(greet("alice"))
print(greet("bob", "hi"))`
  },
  {
    title: "字符串处理",
    level: "基础",
    text: `text = "  Hello, Python!  "
clean = text.strip()
print(clean.lower())
print(clean.upper())
print(clean.replace("Python", "World"))
print(clean.split(", "))`
  },
  {
    title: "读取文件",
    level: "进阶",
    text: `with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line:
            print(line)`
  },
  {
    title: "异常处理",
    level: "进阶",
    text: `try:
    value = int("42")
    result = 100 / value
except ValueError:
    print("not a number")
except ZeroDivisionError:
    print("cannot divide by zero")
else:
    print(result)`
  },
  {
    title: "类与对象",
    level: "进阶",
    text: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance(self, other):
        dx = self.x - other.x
        dy = self.y - other.y
        return (dx * dx + dy * dy) ** 0.5

p = Point(0, 0)
q = Point(3, 4)
print(p.distance(q))`
  },
  {
    title: "enumerate 与 zip",
    level: "进阶",
    text: `names = ["alice", "bob", "carol"]
scores = [92, 85, 78]
for rank, (name, score) in enumerate(zip(names, scores), 1):
    print(rank, name, score)`
  },
  {
    title: "二分查找",
    level: "挑战",
    text: `def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

data = [1, 3, 5, 7, 9, 11]
print(binary_search(data, 7))`
  },
  {
    title: "词频统计",
    level: "挑战",
    text: `text = "the quick brown fox jumps over the lazy dog"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
for word, count in sorted(counts.items()):
    print(word, count)`
  }
];
