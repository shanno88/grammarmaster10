
import React from 'react';

export const LICENSE_SECRET = "MY_SUPER_SECRET_KEY_2025";
export const TRIAL_HOURS = 72;
export const DAILY_LIMIT = 10;

export const QR_WECHAT_IMG = "https://grammar-master.oss-cn-beijing.aliyuncs.com/qg.jpg"; 
export const QR_OFFICIAL_IMG = "https://grammar-master.oss-cn-beijing.aliyuncs.com/qw.png";

export const GAOKAO_EXAMPLES = [
  // === 第一部分：核心基础 (1-10) ===
  { id: 1, category: "There be句型", text: "There is a book and two pens on the desk.", translation: "桌上有一本书和两支钢笔。", analysis: [{ text: "There", role: "引导词", color: "bg-slate-50 text-slate-600 border-slate-200", detail: "引导词" }, { text: "is", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "系动词(就近原则)" }, { text: "a book and two pens", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "真正的主语" }, { text: "on the desk", role: "状语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "地点状语" }] },
  { id: 2, category: "There be句型", text: "There used to be a river here.", translation: "这里以前有一条河。", analysis: [{ text: "There", role: "引导词", color: "bg-slate-50 text-slate-600 border-slate-200", detail: "引导词" }, { text: "used to be", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "过去常常有" }, { text: "a river", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "真正的主语" }, { text: "here", role: "状语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "地点状语" }] },
  { id: 3, category: "感叹句", text: "What a beautiful flower it is!", translation: "多么漂亮的一朵花啊！", analysis: [{ text: "What", role: "感叹词", color: "bg-purple-50 text-purple-600 border-purple-200", detail: "引导词(What+n.)" }, { text: "a beautiful flower", role: "强调部分", color: "bg-amber-50 text-amber-600 border-amber-200", detail: "名词短语" }, { text: "it", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "主语" }, { text: "is", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "系动词" }] },
  { id: 4, category: "感叹句", text: "How fast time flies!", translation: "时间过得真快啊！", analysis: [{ text: "How", role: "感叹词", color: "bg-purple-50 text-purple-600 border-purple-200", detail: "引导词(How+adv.)" }, { text: "fast", role: "副词", color: "bg-amber-50 text-amber-600 border-amber-200", detail: "被强调的副词" }, { text: "time", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "主语" }, { text: "flies", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "动词" }] },
  { id: 5, category: "倒装句", text: "Here comes the bus.", translation: "公交车来了。", analysis: [{ text: "Here", role: "状语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "前置引起倒装" }, { text: "comes", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "完全倒装" }, { text: "the bus", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "主语后置" }] },
  { id: 6, category: "反意疑问句", text: "He has few friends, does he?", translation: "他几乎没有朋友，是吗？", analysis: [{ text: "He has few friends", role: "陈述部分", color: "bg-slate-50 text-slate-600 border-slate-200", detail: "few表否定" }, { text: "does he?", role: "疑问部分", color: "bg-indigo-50 text-indigo-600 border-indigo-200", detail: "前否后肯" }] },
  { id: 7, category: "祈使句", text: "Please turn down the music.", translation: "请把音乐关小点。", analysis: [{ text: "Please", role: "语气词", color: "bg-slate-50 text-slate-400 border-slate-200", detail: "礼貌用语" }, { text: "turn down", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "动词短语" }, { text: "the music", role: "宾语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "动作承受者" }] },
  { id: 8, category: "双宾语", text: "My father bought me a new bike.", translation: "我父亲给我买了一辆新自行车。", analysis: [{ text: "My father", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "S" }, { text: "bought", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "V" }, { text: "me", role: "间宾", color: "bg-orange-50 text-orange-600 border-orange-200", detail: "IO (人)" }, { text: "a new bike", role: "直宾", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "DO (物)" }] },
  { id: 9, category: "宾补结构", text: "We must keep our classroom clean.", translation: "我们必须保持教室清洁。", analysis: [{ text: "We", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "S" }, { text: "must keep", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "V" }, { text: "our classroom", role: "宾语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "O" }, { text: "clean", role: "宾补", color: "bg-cyan-50 text-cyan-600 border-cyan-200", detail: "OC (adj.)" }] },
  { id: 10, category: "主谓一致", text: "Neither he nor I am right.", translation: "他和我都不是对的。", analysis: [{ text: "Neither he nor I", role: "主语", color: "bg-red-50 text-red-600 border-red-200", detail: "就近原则" }, { text: "am", role: "谓语", color: "bg-green-50 text-green-600 border-green-200", detail: "系动词" }, { text: "right", role: "表语", color: "bg-blue-50 text-blue-600 border-blue-200", detail: "形容词作表语" }] },

  // === 第二部分：深度句库 (11-60) ===
  {
    "id": 11,
    "category": "伴随状语、过去分词短语作定语",
    "text": "With their shining brown eyes, wagging tails, and unconditional love, dogs can provide the nonjudgmental listeners needed for a beginning reader to gain confidence, according to Intermountain Therapy Animals (ITA) in Salt Lake City.",
    "translation": "据盐湖城的ITA的观点，闪烁的棕色眼睛，摇着尾巴，并有无条件的爱心，狗能成为无判断力的（忠实的）听者，这是刚开始搞阅读的小孩所需要的。"
  },
  {
    "id": 12,
    "category": "习惯用语",
    "text": "The Salt Lake City public library is sold on the idea.",
    "translation": "这家盐湖城公共图书馆接受这个观点。"
  },
  {
    "id": 13,
    "category": "过去分词短语作状语",
    "text": "Discovered by the Portuguese admiral of the same name in 1506, and settled in 1810, the island belongs to Great Britain and has a population of a few hundred.",
    "translation": "这个岛屿，于1506年被同名的葡萄牙上将发现，在1810年有人居住，现在属于英国，人口数有几百人。"
  },
  {
    "id": 14,
    "category": "现在分词短语作状语、过去分词短语作定语、定语从句",
    "text": "They had no connection with the outside world for more than a thousand years, giving them plenty of time to build more than 1000 huge stone figures, called moat, for which the island is most famous.",
    "translation": "他们已有一千多年与外界没有联系，这给他们充足的时间来修建1000多座巨大的石像，被称为莫艾，因为有这个东西这个岛屿极其出名。"
  },
  {
    "id": 15,
    "category": "原因状语从句（in that）",
    "text": "Our parties are aimed for children 2 to 10 and they're very interactive and creative in that they build a sense of drama based on a subject.",
    "translation": "我们的（生日）聚会针对两到十岁的小孩，它们互动感强，富有创新，因为它们能基于一个主题构建一种戏剧的氛围。"
  },
  {
    "id": 16,
    "category": "表语从句、过去分词短语作定语",
    "text": "The most important idea behind the kind of party planning described here is that it brings parents and children closer together.",
    "translation": "在这里叙述的这种筹备（生日）聚会的计划所带有的最重要的观点在于它能让父母和孩子的关系更加密切。"
  },
  {
    "id": 17,
    "category": "宾语从句、同位语、过去分词短语",
    "text": "He had realized that the words: 'one of six to eight' under the first picture in the book connected the hare in some way to Katherine of Aragon, the first of Henry VIII's six wives.",
    "translation": "他曾认识到那本书里第一幅图画下面的那些词'一、六、八'在某些方面将这个野兔和阿拉甘的凯撒英，即亨利八世的六个妻子当中的第一个妻子，联系起来。"
  },
  {
    "id": 18,
    "category": "时间状语从句（until）、宾语从句",
    "text": "Until one day he came across two stone crosses in Ampthill park and learnt that they had been built in her honor in 1773.",
    "translation": "直到有一天他在阿帕斯尔公园碰巧看见两个石制的十字架，他才懂得在1773年修建这两个十字架是为了向她表示敬意。"
  },
  {
    "id": 19,
    "category": "过去分词短语作定语",
    "text": "It is Sue Townsend's musical play, based on her best-selling book.",
    "translation": "它是苏珊·汤森德的音乐剧本，根据她畅销的小说改编的。"
  },
  {
    "id": 20,
    "category": "现在分词短语作定语、状语从句",
    "text": "Gold is one of a growing number of shoppers buying into the organic trend, and supermarkets across Britain are counting on more like him as they grow their organic food business.",
    "translation": "戈德是对有机食品感兴趣众多购买者当中的一位，遍及英国的超市依赖更多像他那样的购买者，因为他们要增加有机食品生意。"
  },
  {
    "id": 21,
    "category": "宾语从句、比较结构（rather than）",
    "text": "Supporters of underground development say that building down rather than building up is a good way to use the earth's space.",
    "translation": "地下发展的支持者说在地下搞建筑而不是在地上搞建筑是一种利用地球空间的办法。"
  },
  {
    "id": 22,
    "category": "省略句（定语从句承前省）",
    "text": "Those who could were likely to name a woman.",
    "translation": "那些能够说出好朋友名字的单身男人，很有可能说出一个女人的名字。"
  },
  {
    "id": 23,
    "category": "并列句、短语作谓语",
    "text": "In general, women's friendships with each other rest on shared emotions and support, but men's relationships are marked by shared activities.",
    "translation": "一般来说，女人相互的友谊基于相互分享情感和支持，但男人间的关系以共同参与社会活动为特征。"
  },
  {
    "id": 24,
    "category": "插入语、破折号补充说明",
    "text": "For the most part, interactions between men are emotionally controlled ---a good fit with the social requirements of 'manly behavior'.",
    "translation": "就大部分而言，男人间的交往在感情上受控制，这与'男子汉气概'的社会要求是相符合的。"
  },
  {
    "id": 25,
    "category": "对比从句（Whereas）、形式主语、时间状语从句、现在分词短语",
    "text": "Whereas a woman's closest female friend might be the first to tell her to leave a failing marriage, it wasn't unusual to hear a man say he didn't know his friend's marriage was in serious trouble until he appeared one night asking if he could sleep on the sofa.",
    "translation": "一个女人最亲密的女性朋友可能是第一个告诉她离开一次失败的婚姻；而听见一个男人说直到他的朋友一天晚上问他是否可以睡在他家的沙发上他才知道他朋友的婚姻已非常糟糕，这是很平常的。"
  },
  {
    "id": 26,
    "category": "完全倒装句、定语从句、现在分词短语作定语",
    "text": "Before 1066, in the land we now call Great Britain lived peoples belonging to two major language groups.",
    "translation": "1066年以前，在我们现在称为英国的土地上，住着属于两个主要语种的民族。"
  },
  {
    "id": 27,
    "category": "虚拟语气（与过去事实相反）",
    "text": "If this state of affairs had lasted, English today would be close to German.",
    "translation": "如果这种情况延续下去的话，那么今天的英语将和德语很相近。"
  },
  {
    "id": 28,
    "category": "非谓语动词、宾语从句、非限制性定语从句、同位语从句",
    "text": "We even have different words for some foods, meat in particular, depending on whether it is still out in the fields or at home ready to be cooked, which shows the fact that the Saxon peasants were doing the farming, while the upper-class Normans were doing most of the eating.",
    "translation": "我们甚至对某些食物有不同的单词，特别是肉类，取决于它是长在田野里，还是在家里准备煮着吃，这就表明一个事实，即萨克森农民在农田干活，而上层阶级的诺曼人在大吃大喝。"
  },
  {
    "id": 29,
    "category": "时间状语从句、原因状语从句、比较状语从句",
    "text": "When Americans visit Europe for the first time, they usually find Germany more 'Foreign' than France because the German they see on signs and ads seems much more different from English than French does.",
    "translation": "当美国人第一次游览欧洲时，他们通常发现德国比法国对他们来说更加'陌生'，因为他们在标牌和广告上看到的德语，比起法语更加不同于英语。"
  },
  {
    "id": 30,
    "category": "宾语补足语",
    "text": "Some companies have made the manufacturing of clean and safe products their main selling point and emphasize it in their advertising.",
    "translation": "一些公司已经把洁净安全产品的生产当作他们主要的销售关键，并且在他们的广告宣传中强调这一点。"
  },
  {
    "id": 31,
    "category": "现在分词短语作定语、同位语从句",
    "text": "After their stay, all visitors receive a survival certificate recording their success, that is, when guests leave the igloo hotel they will receive a paper stating that they have had a taste of adventure.",
    "translation": "在他们逗留之后，所有的游客都会收到一份生存证明记录他们的成功，也就是说当游客离开小冰屋旅馆时，他们会得到一份证明，表明他们曾尝试过冒险。"
  },
  {
    "id": 32,
    "category": "非限制性定语从句",
    "text": "The major market force rests in the growing population of white-collar employees, who can afford the new service, in other words, Shanghai's car rental industry is growing so fast mainly due to the increasing number of white-collar employees.",
    "translation": "主要的市场因素取决于白领工人的人数增加，这些人付得起这种新型服务，换句话说，上海的汽车出租行业发展如此快，主要因为白领工人人数的增加。"
  },
  {
    "id": 33,
    "category": "主语从句、宾语从句、时间状语从句（before）",
    "text": "That you won't be for long means it won't be long before you'll have to recycle your rubbish.",
    "translation": "你不会等很长时间意味着过不了多久你就会回收你的垃圾。"
  },
  {
    "id": 34,
    "category": "插入语、定语从句",
    "text": "These words, I have just made up, have to stand for things and ideas that we simply can't think of.",
    "translation": "这些词，是我编造的，只是代表我们不能想到的事物和观念。"
  },
  {
    "id": 35,
    "category": "动名词短语作主语",
    "text": "Picturing (Imagining) the future will serve the interests of the present and future generations.",
    "translation": "设想未来有益于现在和将来的几代人。"
  },
  {
    "id": 36,
    "category": "双重否定、并列宾语从句（not only...but also...）",
    "text": "Decision thinking is not unlike poker --- it often matters not only what you think, but also what others think you think and what you think they think you think.",
    "translation": "做决策像打扑克牌，起作用的不但是你怎么想的，还包括别人对你的想法是怎么看的以及你对别人的看法是如何考虑的。"
  },
  {
    "id": 37,
    "category": "主语（the way out）、系表结构",
    "text": "The easy way out isn't always easiest.",
    "translation": "解决问题容易的办法并非总是最容易的。"
  },
  {
    "id": 38,
    "category": "并列句、比喻、方式状语从句（as though）",
    "text": "The hot sun had caused the dough to double in size and the fermenting yeast made the surface shake and sigh as though it were breathing and it looked like some unknown being from outer space.",
    "translation": "炙热的太阳导致面团面积加倍，酵母使面团的表面摆晃叹息，似乎它在呼吸，它看上去像某种来自外部空间的无名生物。"
  },
  {
    "id": 39,
    "category": "反问句、动名词短语作宾语",
    "text": "After all, what lively children wouldn't settle for spending only half the day doing ordinary school work, and acting, singing or dancing their way through the other half of the day?",
    "translation": "毕竟，难道这些活泼可爱的孩子们不满足于半天搞普通教育的文化课，半天搞表演、唱歌、舞蹈等舞台训练吗？"
  },
  {
    "id": 40,
    "category": "插入语、目的状语从句、破折号补充说明",
    "text": "Dad, in a hurry to get home before dark so he could go for a run, had forgotten to wear his safety belt---a mistake 75% of the US population make every day.",
    "translation": "爸爸，急匆匆地在天黑之前赶回家，以便他能出去跑步，却忘记系安全带---这是75%的美国人每天犯的一个错误。"
  },
  {
    "id": 41,
    "category": "定语从句、不定式作表语",
    "text": "The summit was to mark the 25th anniversary of president Nixon's journey to China, which was the turning point in China-US relations.",
    "translation": "这次高峰会是为了纪念尼克松总统访华25周年，尼克松访华是中美关系的转折点。"
  },
  {
    "id": 42,
    "category": "介词短语作表语、短语动词",
    "text": "Many of the problems are of college level and these pupils can figure them out.",
    "translation": "很多问题是大学水平，这些小学生能够解答出来。"
  },
  {
    "id": 43,
    "category": "完全倒装句、定语从句内倒装",
    "text": "Rising through the roof is the Tower of the Sun, inside which stands a 160-foot-tall Tree of Life.",
    "translation": "穿过屋顶矗立着太阳之塔，在里面有一棵160英尺高的生命之树。"
  },
  {
    "id": 44,
    "category": "表语从句、宾语后置",
    "text": "The present question is that many people consider impossible what is really possible if effort is made.",
    "translation": "目前的问题是，很多人把其实只要付诸努力就能做到的事情看成是做不到的。"
  },
  {
    "id": 45,
    "category": "让步状语从句（as倒装）、形容词短语作状语",
    "text": "Ill and suffering as she was after the inhuman punishment, she yet remained so cheerful and confident, eager to devote the little strength left to her to helping the other comrades.",
    "translation": "她受过重罚，而且有病，可她却这样愉快，这样充满了信心，这样用尽她所剩的力量来帮助其他同志。"
  },
  {
    "id": 46,
    "category": "过去分词短语作状语",
    "text": "Freed from TV, forced to find their own activities, they might take a ride together to watch the sunset.",
    "translation": "如果他们从电视中的束缚中解脱出来，不得不自己安排活动，他们可能会全家驱车去看日落。"
  },
  {
    "id": 47,
    "category": "并列谓语、独立主格结构",
    "text": "I went around to the front of the house, sat down on the steps, and, the crying over, I ached, and my father must have hurt, too, a little.",
    "translation": "我绕到房子的前面，坐在台阶上，哭了一阵之后，我感到阵阵心痛，我的父亲心里肯定也有一点不好受。"
  },
  {
    "id": 48,
    "category": "比喻、破折号说明",
    "text": "It covered the whole distance from broken-hearted misery to bursting happiness---too fast.",
    "translation": "先是令人心碎的痛苦，继而是极度的喜悦，从一个极端到另一个极端---变换得实在太快了。"
  },
  {
    "id": 49,
    "category": "虚拟语气、条件状语从句、定语从句、插入语",
    "text": "Still, he could not help thinking that if anything should happen, the nearest person he could contact by radio, unless there was a ship nearby, would be on an island 885 miles away.",
    "translation": "他禁不住寻思起来，要是果真有什么意外，除非附近有条船，他用无线电能联系上的最近的人远在885英里以外的岛上。"
  },
  {
    "id": 50,
    "category": "插入语、过去分词作定语、方式状语从句",
    "text": "After all, eighty was a special birthday, another decade lived or endured, just as you choose to look at it.",
    "translation": "八十大寿，毕竟非同一般，不管怎么说你又活了十年，或者说熬了十年，是活还是熬，全在于你怎么看了。"
  },
  {
    "id": 51,
    "category": "宾语从句、with复合结构",
    "text": "News reports say peace talks between the two countries have broken down with no agreement reached.",
    "translation": "新闻报道说这两个国家的和平谈判失败，没有达成协议。"
  },
  {
    "id": 52,
    "category": "并列句、部分倒装句",
    "text": "The old couple have been married for 40 years and never once have they quarreled with each other.",
    "translation": "这对老年夫妇结婚40年了，两人从来没有一次争吵。"
  },
  {
    "id": 53,
    "category": "比较级句型",
    "text": "After all, Ed's idea of exercise has always been nothing more effort-making than lifting a fork to his mouth.",
    "translation": "要记住的是，伊德搞锻炼的想法根本没有进餐使用刀叉那么费力。"
  },
  {
    "id": 54,
    "category": "时间状语从句、插入语",
    "text": "As a result, at the point in our game when I'd have figured on the score to be about 9 to 1 in my favor, it was instead 7 to 9 --- and Ed was leading.",
    "translation": "就在我们比赛之前，我曾预料这场比赛对我有利，比分大概是9比1，结果比分反而是7比9，伊德暂时领先。"
  },
  {
    "id": 55,
    "category": "时间状语从句、结果状语从句、情态动词表推测",
    "text": "So when Ed arrived for our game not only with the bottom of his shirt gathered inside his trousers but also with a stomach you could hardly notice, I was so surprised that I was speechless, my cousin must have made an effort to get himself into shape.",
    "translation": "因此当伊德来参加我们的比赛时，我发现他不仅将衬衫的底部扎进裤里，而且几乎注意不到他的肚子，我感到很惊奇，以致无话可说，我的表弟过去一定努力把自己训练好，保持很好的竞技状态。"
  },
  {
    "id": 56,
    "category": "插入语、省略句",
    "text": "In a way, I think we both won: I the game, but cousin Ed my respect.",
    "translation": "在一定程度上，我认为我们都赢了，我赢得了这次比赛，伊德表弟赢得了我的尊重。"
  },
  {
    "id": 57,
    "category": "比较级句型、宾语从句",
    "text": "It is said in Australia there is more land than the government knows what to do with.",
    "translation": "据说在澳大利亚土地太多以致政府不知道怎么去处理。"
  },
  {
    "id": 58,
    "category": "结果状语从句、过去分词短语作状语",
    "text": "The research is so designed that once begun nothing can be done to change it.",
    "translation": "这项研究设计得如此好以致一旦开始任何事都不可能改变它。"
  },
  {
    "id": 59,
    "category": "宾语从句、原因状语从句",
    "text": "The mother didn't know who to blame for the broken glass as it happened while she was out.",
    "translation": "妈妈不知道谁应该受责备，因为打破玻璃这件事是她不在家里的时候发生的。"
  },
  {
    "id": 60,
    "category": "时间状语从句、定语从句",
    "text": "When I was in the army I received an intelligence test that all soldiers took, and, against an average of 100, scored 160.",
    "translation": "当我在军队服役时，我曾接受过所有战士都参加的智力测试，与平均分100分相比，我得了160分。"
  },

  // === 第三部分：深度句库 (61-110) ===
  {
    "id": 61,
    "category": "并列句、短语动词",
    "text": "We didn't plan our art exhibition like that but it worked out very well.",
    "translation": "我们原不是那样计划艺术展览的，但出来的结果却很好。"
  },
  {
    "id": 62,
    "category": "宾语从句、what little结构",
    "text": "The home improvements have taken what little there is of my spare time.",
    "translation": "房子装修花费我的闲暇时间不多。"
  },
  {
    "id": 63,
    "category": "现在分词完成式作状语、too...to...结构",
    "text": "Having suffered such heavy pollution already, it may now be too late to clean up the river.",
    "translation": "这条河流已经遭受很重的污染，现在要清理为时太晚。"
  },
  {
    "id": 64,
    "category": "宾语从句、定语从句",
    "text": "Most believe the footprints are nothing more than ordinary animal tracks, which had been made larger as they melted and refroze in the snow.",
    "translation": "大多数人相信这些脚印只是普通动物的足迹，这些足迹由于在雪里融化再结冰而变大了。"
  },
  {
    "id": 65,
    "category": "条件状语从句、选择疑问句",
    "text": "But if they ever succeed in catching one, they may face a real problem: would they put it in a zoo or give it a room in a hotel?",
    "translation": "但若他们真的抓住一个“雪人”的话，那么他们可能面临一个现实问题：他们会把它放进动物园，还是在一个旅馆里给它一个房间呢？"
  },
  {
    "id": 66,
    "category": "with复合结构",
    "text": "With production up by 60%, the company has had another excellent year.",
    "translation": "产量增长了60%，公司又经历了一个极好的年头。"
  },
  {
    "id": 67,
    "category": "条件状语从句、定语从句",
    "text": "The WTO cannot live up to its name if it does not include a country that is home to one fifth of mankind.",
    "translation": "世贸组织如果没有一个占世界五分之一人口的大国加入的话，那么它就不能名副其实。"
  },
  {
    "id": 68,
    "category": "强调句型（It is...that...）",
    "text": "It is the ability to do the job that matters not where you come from or what you are.",
    "translation": "重要的是你做这件工作的能力，而不是你来自什么地方，或是你是什么身份。"
  },
  {
    "id": 69,
    "category": "特殊疑问句、介词短语作状语、定语从句",
    "text": "How could I ever get him to finish unloading the car without screaming at me and making a scene in front of the other girls, who I would have to spend the rest of the year with?",
    "translation": "我怎么才能让父亲卸完车上的行李而不向我大喊大叫，在其他女孩子面前出洋相呢？我还要和这些女孩一起度过以后的日子。"
  },
  {
    "id": 70,
    "category": "时间状语从句",
    "text": "Dad's face turned decidedly less red before he could bring out a 'yes'.",
    "translation": "父亲在说出一声'是'之前，脸终于没有先前那么红了。"
  },
  {
    "id": 71,
    "category": "介词宾语替代、并列宾语",
    "text": "Soon I heard a sound like that of a door burst in, and then a climb of feet.",
    "translation": "很快我听到好象是门被撞进的声音，接着是一阵上楼的脚步声。"
  },
  {
    "id": 72,
    "category": "并列谓语、非限制性定语从句",
    "text": "Father took the still smoking pistol from my hand, and fired another shot, which killed the gorilla.",
    "translation": "爸爸从我手里拿起那只仍冒烟的枪，又开了一枪，这才杀死了那只大猩猩。"
  },
  {
    "id": 73,
    "category": "形式主语结构（It happened that...）、原因状语从句、非限制性定语从句",
    "text": "It happened that father had sent us upstairs because he thought he would be able to lock the door---which was twenty feet away---before the animal reached it.",
    "translation": "事情发生是这样的，爸爸先把我们送上楼，因为他原以为他能够在那个动物赶到之前（距离20英尺远）将门锁上。"
  },
  {
    "id": 74,
    "category": "宾语从句、时间状语从句",
    "text": "He certainly looked the part all right, he thought, as he admired himself in the mirror.",
    "translation": "当他在镜子前自我欣赏时，他想他当然看上去很适合那个角色。"
  },
  {
    "id": 75,
    "category": "并列谓语、迂回表达",
    "text": "He put his head in his hands and tried to remember his lines, but nothing came to his mind.",
    "translation": "他抱着头，尽力的想台词，但什么也想不起来。"
  },
  {
    "id": 76,
    "category": "the more...the more...结构",
    "text": "In fact the more he watched the play, the more he felt himself part of it.",
    "translation": "实际上，他越是观看这台戏剧，他越是认为自己已进入角色。"
  },
  {
    "id": 77,
    "category": "现在分词短语作伴随状语",
    "text": "Instead she took a short walk in a park nearby and came home, letting herself in through the back door.",
    "translation": "反而，她在附近公园散步一会儿就回到家，她经过后门让自己进去的。"
  },
  {
    "id": 78,
    "category": "不定式短语作目的状语、宾语从句",
    "text": "She settled down to wait and see what would happen.",
    "translation": "她静下心来等，看会发生什么事。"
  },
  {
    "id": 79,
    "category": "现在分词短语作伴随状语",
    "text": "Picking up the kettle of boiling water, she moved quietly towards the door.",
    "translation": "她拿起那个装着开水的壶，悄悄地向门移动。"
  },
  {
    "id": 80,
    "category": "时间状语从句、被动语态、非限制性定语从句",
    "text": "A sharp cry was heard outside as the wire fell to the floor and the hand was pulled back, which was followed by the sound of running feet.",
    "translation": "当那根铁丝掉在地上，那只手缩回时，外面传来尖叫声，接着是逃跑的声音。"
  },
  {
    "id": 81,
    "category": "It wasn't long before...句型",
    "text": "It wasn't long before the police caught the thief.",
    "translation": "很快警察抓住了那个小偷。"
  },
  {
    "id": 82,
    "category": "现在分词短语作伴随状语、过去分词短语作定语",
    "text": "Then, I noticed a tall man by the door, carrying something covered with brown paper.",
    "translation": "接着，我注意到门旁一个高个子男人，拿着用棕色纸遮盖着的某种东西。"
  },
  {
    "id": 83,
    "category": "现在分词短语作时间状语、过去分词短语作宾语补足语",
    "text": "Turning to my next customer, I was terrified to see a gun stuck out of his coat.",
    "translation": "转向下一个顾客，看见一杆枪从他的外套伸出来，我非常恐惧。"
  },
  {
    "id": 84,
    "category": "直接引语、比喻",
    "text": "'Smith!' the manager cried out in a voice like thunder. 'None of your excuses! Go start work at once!'",
    "translation": "'史密斯！'经理用象雷一样的声音大喊，'你不要找借口！给我立即开始工作。'"
  },
  {
    "id": 85,
    "category": "完全倒装句、现在分词短语作状语",
    "text": "Waiting above the crowded streets, on top of a building 110 stories high, was Philippe Pettit.",
    "translation": "菲力浦帕底特在110层高的建筑物上，人群拥挤的大街上空等候。"
  },
  {
    "id": 86,
    "category": "并列句",
    "text": "Philippe took his first step with great care. The wire held. Now he was sure he could do it.",
    "translation": "菲力浦非常小心地迈开第一步，钢丝绳承受住了，现在他确信他可以走钢丝了。"
  },
  {
    "id": 87,
    "category": "with复合结构",
    "text": "And thousands of terrified watchers stared with their hearts beating fast.",
    "translation": "成千上万感到很害怕的观众盯着看，他们的心跳很快。"
  },
  {
    "id": 88,
    "category": "定语从句",
    "text": "Already she does many things a human being can do.",
    "translation": "她已经会做一个人能做的许多事情。"
  },
  {
    "id": 89,
    "category": "动名词短语作宾语",
    "text": "She even enjoys watching television before going to bed.",
    "translation": "她甚至喜欢在上床睡觉前看电视。"
  },
  {
    "id": 90,
    "category": "表语从句、虚拟语气",
    "text": "The measure of a man's real character is what he would do if he knew he would never be found out.",
    "translation": "衡量一个人真正品质的标准是看如果他知道他不会被别人发现的情况下他会做些什么事。"
  },
  {
    "id": 91,
    "category": "时间状语、原因状语从句、比较结构（rather than）",
    "text": "Thirty years after being introduced to McCauley's words, they still seem to me the best yardstick, because they give us a way to measure ourselves rather than others.",
    "translation": "在我知道玛考雷名言三十年后，它对我来说仍是最好的人生准则，因为这句名言给我们提供了一种衡量我们自己而不是他人的方法。"
  },
  {
    "id": 92,
    "category": "动名词复合结构作宾语",
    "text": "Few of us are asked to make great decisions about nations going to war or armies going to battle, but all of us are called upon daily to make a great many personal decisions.",
    "translation": "我们当中很少有人被要求作出关于国家进行战争，军队进行战斗的重大决定，但我们每天都要求作出很多个人的决定。"
  },
  {
    "id": 93,
    "category": "定语从句、习惯用语",
    "text": "Here's a fellow who just walks into a bank and helps himself to so much money.",
    "translation": "有一个家伙，就这样走进一家银行，擅自拿走这么多钱。"
  },
  {
    "id": 94,
    "category": "定语从句（介词+which）、宾语从句",
    "text": "Todd thought of the difficulty with which he managed to get the amount of money he needed to start his gas station.",
    "translation": "托德想起自己的难处，他曾设法搞一大笔钱，他需要这笔钱来开办他的加油站。"
  },
  {
    "id": 95,
    "category": "祈使句、并列句",
    "text": "Don't pick up strangers and all your folks in gas stations better not do service to a white Ford car.",
    "translation": "不要搭载陌生人，加油站所有的工作人员最好不要为一辆白色福特牌小汽车服务。"
  },
  {
    "id": 96,
    "category": "直接引语、现在分词短语作伴随状语",
    "text": "'Fill her up', the man said sounding like any other driver.",
    "translation": "'给车加油'那个男人说，听起来（这个劫匪）就好像是其他任何一名司机。"
  },
  {
    "id": 97,
    "category": "形式主语结构（It seemed that...）",
    "text": "It seemed that there was no suitable work for him.",
    "translation": "看来对我来说没有合适的工作。"
  },
  {
    "id": 98,
    "category": "时间状语从句、现在分词作定语、定语从句、时间状语从句（as）",
    "text": "But when John and his fellow soldier came in sight some of the people watching couldn't help laughing at the one who couldn't keep pace with the others as they marched along.",
    "translation": "但当约翰和他的战友们出现时，一些观看的人们禁不住嘲笑那个在行进中不能同步的那个人（约翰）。"
  },
  {
    "id": 99,
    "category": "not only...but also...结构",
    "text": "They not only make it difficult to sleep at night, but they are doing damage to our houses and shops of historical interest.",
    "translation": "他们不仅使人们在晚上睡觉困难，而且他们损害我们历史名胜的房子和商店。"
  },
  {
    "id": 100,
    "category": "现在分词短语作定语、宾语从句、as...as possible结构",
    "text": "Harry also studying biology said they wanted to make as much noise as possible to force the government officials to realize what everybody was having to stand.",
    "translation": "也攻读生物学的哈利说他们要制造尽可能大的噪音来迫使政府官员们认识到大家正不得不忍受的东西。"
  },
  {
    "id": 101,
    "category": "过去分词短语作状语、定语从句",
    "text": "First put forward by the French mathematician Pierre de Fermat in the seventeenth century, the theorem had baffled and beaten the finest mathematical minds, including a French woman scientist who made a major advance in working out the problem, and who had to dress like a man in order to be able to study at the Ecolab polytechnique.",
    "translation": "这个定理，先是由十七世纪法国数学家皮尔法特提出，曾使一批杰出的数学大师为难，包括一位法国女科学家，她在解决这个难题方面取得了重大的进展，她曾女扮男装为了能够在伊科尔理工学院学习。"
  },
  {
    "id": 102,
    "category": "形式主语、让步状语从句、宾语从句",
    "text": "It is difficult to measure the quantity of paper used as a result of use of Internet-connected computers, although just about anyone who works in an office can tell you that when e-mail is introduced, the printers start working overtime. That is, the growing demand for paper in recent years is largely due to the increased use of the Internet.",
    "translation": "由于因特网的使用，计算所使用的纸张的数量是很难的，然而几乎任何在办公室工作的人能告诉你，当引进电子邮件后，打印机就开始超时工作。也就是说近年来人们对于纸张的日益需求主要是由于因特网越来越多的使用。"
  },
  {
    "id": 103,
    "category": "主语从句、非限制性定语从句",
    "text": "Perhaps the best sign of how computer and internet use pushes up demand for paper comes from the high-tech industry itself, which sees printing as one of its most promising new markets.",
    "translation": "或许，表明电脑及因特网使用促进人们对于纸张的需求的最好迹象源于高科技产业本身，印刷业被认为是高科技产业极有前景的新市场之一。"
  },
  {
    "id": 104,
    "category": "过去分词短语作定语、other than结构",
    "text": "The action group has also found acceptable paper made from materials other than wood, such as agricultural waste.",
    "translation": "这个行动组也发现一种人们可接受的纸，制成这种纸的原料不是木料，而是农业废料。"
  },
  {
    "id": 105,
    "category": "过去分词短语作状语、过去分词短语作定语",
    "text": "Mostly borrowed from English and Chinese, these terms are often changed into forms no longer understood by native speakers.",
    "translation": "这些术语，主要从英语和汉语引入，经常会变成不再被说本族语的人们理解的形式。"
  },
  {
    "id": 106,
    "category": "定语从句、比喻",
    "text": "It is one of many language books that are now flying off booksellers' shelves.",
    "translation": "它是现在很畅销的许多外语书中的一本。"
  },
  {
    "id": 107,
    "category": "简单句、术语",
    "text": "The mass media and government white papers play an important part in the spread of foreign words.",
    "translation": "大众传播媒介和政府白皮书（正式报告）在外国词传播过程中起重要作用。"
  },
  {
    "id": 108,
    "category": "定语从句、虚拟语气（whether it be）",
    "text": "Tales from Animal Hospital will delight all fans of the programme and anyone who has a lively interest in their pet, whether it be a cat, dog or snake!",
    "translation": "来自动物医院（这个电视节目）的故事（这本书），将使这个电视节目的爱好者以及对无论是猫、狗还是蛇这类宠物有浓厚兴趣的任何人感到高兴。"
  },
  {
    "id": 109,
    "category": "定语从句、定语从句嵌套",
    "text": "Newton is shown as a gifted scientist with very human weaknesses who stood at the point in history where magic ended and science began.",
    "translation": "牛顿被证明是一位很有才华的科学家，他处于一个魔术终结科学开启的历史时期，他也有普通人所特有的弱点。"
  },
  {
    "id": 110,
    "category": "让步状语、定语从句",
    "text": "But for all the texts that are written, stored and sent electronically, a lot of them are still ending up on paper.",
    "translation": "但对于所有这些以电子手段记录，贮存及传递的文本而言，许多文本仍要（打印）在纸上。"
  }
];
