/* Original fictional resident remarks. Stable IDs; no rewards, personal data
or autonomous timers. Merge into the existing ambient scheduler only. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawResidentRemarks=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const lines={
  "temple": [
    [
      "moss",
      "The moss has claimed another little corner of the stone steps.",
      "石阶上的青苔又长了一点。"
    ],
    [
      "broom",
      "I made a smaller broom for the little corners.",
      "我做了把小扫帚，专门扫那些角落。"
    ],
    [
      "visitor",
      "A traveller came just to watch the clouds.",
      "有位旅人特地来这里看云。"
    ],
    [
      "quietbell",
      "I wait for the bell to finish ringing before I pick up the broom.",
      "钟声还没散呢，扫帚可以再等等。"
    ],
    [
      "incensebox",
      "Three sticks at a time. The rest can wait in the box.",
      "一次三炷就好，其他的留给下一位香客。"
    ],
    [
      "steps",
      "Nobody gives the stone steps a deadline. They still get us there.",
      "石阶没有截止日期，也一样能把人送到想去的地方。"
    ]
  ],
  "tarot": [
    [
      "linen",
      "The new tablecloth makes shuffling much quieter.",
      "换了桌布，洗牌的声音都轻了。"
    ],
    [
      "bookmark",
      "A pressed leaf fell out of my notebook.",
      "笔记本里掉出来一片压干的叶子。"
    ],
    [
      "choice",
      "You can leave a question unanswered for today.",
      "有些问题，今天不回答也没关系。"
    ],
    [
      "deckrest",
      "Even the cards get a break between questions.",
      "牌也要休息一下，可不能连轴转。"
    ],
    [
      "notverdict",
      "A card can give us something to think about. That's all it needs to do.",
      "抽到什么牌，就聊聊什么。它又不能替你做决定。"
    ],
    [
      "teacold",
      "I was so busy listening that my tea went cold again.",
      "听故事听得太入迷，茶又凉了。"
    ]
  ],
  "yue": [
    [
      "ink",
      "The ink needs a little more water today.",
      "今天的墨有些浓，得再添点水。"
    ],
    [
      "calendar",
      "The calendar has turned a page. The mountains look the same.",
      "日历又翻了一页，远山还是老样子。"
    ],
    [
      "spectacles",
      "I spent ten minutes looking for the glasses on my head.",
      "找了十分钟眼镜，原来就在头顶。"
    ],
    [
      "brushrest",
      "A brush writes better when I stop trying to hurry it.",
      "越催毛笔，字越写不好。"
    ],
    [
      "margin",
      "A chart has room for notes. So does a life.",
      "命盘旁边可以写批注，人生也不是一页定稿。"
    ],
    [
      "teaagain",
      "I nearly poured tea into the ink dish. Perhaps I need a little rest.",
      "差点把茶倒进砚台里。看来老夫也该歇会儿了。"
    ]
  ],
  "garden": [
    [
      "raincup",
      "A little rain collected in the empty flowerpot.",
      "空花盆里积了一点雨水。"
    ],
    [
      "dragonfly",
      "A dragonfly has claimed the stepping stone.",
      "有只蜻蜓把那块踏脚石当成了地盘。"
    ],
    [
      "prune",
      "I left a branch alone. It wanted to grow its own way.",
      "那根枝条我没剪，让它自己长吧。"
    ],
    [
      "chime",
      "The wind chime has a lot to say for something with no mouth.",
      "风铃没有嘴，话倒是不少。"
    ],
    [
      "bench",
      "I wiped the bench. The leaves immediately moved back in.",
      "长椅刚擦干净，落叶就搬回来了。"
    ],
    [
      "pond",
      "Some afternoons, sitting by the pond is all the company I need.",
      "有时什么都不做，坐在池边就很舒服。"
    ]
  ],
  "grandma": [
    [
      "lid",
      "The pot lid is dancing. Dinner must be close.",
      "锅盖都跳起来了，快开饭咯。"
    ],
    [
      "seconds",
      "I cook for two. Somehow the pot feeds six.",
      "明明只做两人份，结果一锅能喂六个人。"
    ],
    [
      "recipe",
      "The recipe says one clove. My hand says three.",
      "食谱说一瓣蒜，我的手说三瓣。"
    ],
    [
      "taste",
      "Have a little taste. The recipe can't tell you when the soup is just right.",
      "来，尝一口。好不好喝，你的舌头比食谱清楚。"
    ],
    [
      "apron",
      "This apron has survived three soups and one very ambitious pancake.",
      "这条围裙熬过三锅汤，还挺过一张不太成功的煎饼。"
    ],
    [
      "leftovers",
      "Leftovers? I prefer to call them tomorrow's head start.",
      "什么剩菜？那叫明天提前备好的饭。"
    ]
  ],
  "mei": [
    [
      "saucer",
      "I found a saucer that finally matches this cup.",
      "终于找到一只配得上这个杯子的碟子。"
    ],
    [
      "knitting",
      "My scarf has accidentally become a blanket.",
      "本来织条围巾，不小心织成了毯子。"
    ],
    [
      "sunbeam",
      "There is a warm patch of sunlight over there.",
      "那边有块晒得暖暖的地方。"
    ],
    [
      "seat",
      "The chair by the window has heard more stories than I have.",
      "窗边那张椅子听过的故事，比我还多。"
    ],
    [
      "steep",
      "Let the tea steep. The gossip can wait thirty seconds.",
      "茶先泡好，八卦再等半分钟。"
    ],
    [
      "quietcup",
      "Some days I set out two cups, just in case someone stops by.",
      "有时我多摆一只茶杯，万一有人来坐坐呢。"
    ]
  ],
  "hong": [
    [
      "queue",
      "I joined a queue without knowing what it was for.",
      "我排了半天队，才想起来问是在买什么。"
    ],
    [
      "mysteryparcel",
      "The parcel was enormous. Inside was one pair of socks.",
      "快递箱大得吓人，里面就一双袜子。"
    ],
    [
      "secret",
      "I can keep a secret. The problem is my facial expression.",
      "我嘴巴很严，就是表情不太配合。"
    ],
    [
      "meeting",
      "The village had a meeting about meetings. I brought biscuits.",
      "小镇开了个会，讨论要不要少开会。我负责带饼干。"
    ],
    [
      "typing",
      "I saw someone type for five minutes. The message was just 'OK'.",
      "有人打了五分钟字，最后发来两个字：好的。"
    ],
    [
      "rumour",
      "I heard a rumour about the cat. The cat refused to comment.",
      "听说那只猫有点八卦，当事猫拒绝回应。"
    ]
  ],
  "wang": [
    [
      "outofoffice",
      "My out-of-office reply is doing better than I am.",
      "自动回复比我本人还会拒绝工作。"
    ],
    [
      "calendar",
      "I scheduled fifteen minutes to do absolutely nothing.",
      "我在日历上安排了十五分钟，专门发呆。"
    ],
    [
      "spreadsheet",
      "I opened a spreadsheet to decide what to eat. Send help.",
      "为了决定午饭吃什么，我竟然打开了表格。"
    ],
    [
      "printer",
      "The printer and I have agreed to see other people.",
      "打印机又闹脾气了，我决定跟它暂时分居。"
    ],
    [
      "lunch",
      "My lunch break has a waiting list. It is mostly my own tasks.",
      "午休还得排队，前面全是我自己的待办。"
    ],
    [
      "attachment",
      "I attached the attachment on the third email. Personal best.",
      "第三封邮件终于记得加附件，今天有进步。"
    ]
  ],
  "ahma": [
    [
      "laundry",
      "The wind dried my laundry before I finished my tea.",
      "茶还没喝完，衣服就被风吹干了。"
    ],
    [
      "pockets",
      "Empty your pockets before washing. Especially those tiny worries.",
      "洗衣服前记得清空口袋，那些小烦恼也别留着。"
    ],
    [
      "repair",
      "A broken stool only needed one new screw.",
      "那张坏凳子换颗螺丝就修好了。"
    ],
    [
      "slipper",
      "This slipper is for paper targets, not your neighbour's head.",
      "拖鞋是拍纸人的，可不是拍邻居脑袋的。"
    ],
    [
      "wind",
      "The wind is free. No need to subscribe to it.",
      "海风不用充值会员，放心吹。"
    ],
    [
      "stitch",
      "A loose thread is easier to fix before it becomes a hole.",
      "线头松了就补一补，别等破了洞才着急。"
    ]
  ],
  "lin": [
    [
      "pawprints",
      "Tiny pawprints appeared beside the water bowl.",
      "水碗旁多了一串小脚印。"
    ],
    [
      "sparrow",
      "A sparrow keeps hopping around the deer's water bowl.",
      "有只小麻雀，总在鹿儿的水碗边蹦来蹦去。"
    ],
    [
      "shade",
      "I moved the water bowl into the shade.",
      "我把水碗挪到阴凉处了。"
    ],
    [
      "distance",
      "The deer will come closer when it feels ready.",
      "小鹿想靠近的时候，自然会走过来。"
    ],
    [
      "catnap",
      "The cat's appointment book is completely full of naps.",
      "猫咪今天的行程排满了，全是午睡。"
    ],
    [
      "quietpath",
      "I take the longer path when the animals are resting.",
      "小动物在休息，我就绕远一点走。"
    ]
  ],
  "arcade": [
    [
      "joystick",
      "The joystick squeaks less after its little repair.",
      "修完以后，摇杆终于不吱吱响了。"
    ],
    [
      "almost",
      "A near miss can be more entertaining than a win.",
      "有时候差一点点抓到，比抓到还刺激。"
    ],
    [
      "tokens",
      "I found an old arcade token in a coat pocket.",
      "在旧外套口袋里翻到一枚游戏币。"
    ],
    [
      "claw",
      "The claw is a little stubborn. I respect its commitment.",
      "这抓娃娃机有点倔，倒是挺有原则。"
    ],
    [
      "fishnet",
      "A steady hand is better than a heroic splash.",
      "捞金鱼讲究手稳，不是谁溅的水花大谁厉害。"
    ],
    [
      "rhythm",
      "The cabinet does not mind if you miss a beat.",
      "漏拍也没关系，机器又不会写绩效评语。"
    ]
  ],
  "boba": [
    [
      "ice",
      "The ice cubes are making tiny cracking sounds.",
      "冰块在杯子里咔嚓咔嚓地响。"
    ],
    [
      "order",
      "One order said extra happiness. I added a smile.",
      "有张订单写着多加快乐，我送了个笑脸。"
    ],
    [
      "foam",
      "The milk foam looks like a little mountain today.",
      "今天的奶泡像一座小山。"
    ],
    [
      "pearls",
      "The pearls are ready. They have better timing than my alarm.",
      "珍珠煮好了，比我的闹钟还准时。"
    ],
    [
      "sweet",
      "Less sugar and extra pearls? A drink with its priorities in order.",
      "少糖，多珍珠？看来重点很明确嘛。"
    ],
    [
      "shake",
      "The shaker makes a better percussion instrument than I expected.",
      "这摇杯拿来打节拍，居然还挺像回事。"
    ]
  ],
  "souvenir": [
    [
      "twine",
      "I saved the pretty string from yesterday’s delivery.",
      "昨天包裹上的漂亮绳子，我留着了。"
    ],
    [
      "stamp",
      "The new stamp looks like a sleepy cat.",
      "新到的印章像只没睡醒的猫。"
    ],
    [
      "label",
      "I wrote the gift tags before opening the shop.",
      "开门前就把礼物的小吊牌写好了。"
    ],
    [
      "ribbon",
      "I have a drawer of ribbons too pretty to throw away.",
      "有一抽屉丝带，漂亮得舍不得扔。"
    ],
    [
      "postcard",
      "A postcard can be a whole holiday in a pocket.",
      "一张明信片，就能把一场旅行装进口袋。"
    ],
    [
      "shelfspace",
      "I left a space on the shelf for something I have not found yet.",
      "架子上留了一个空位，等还没遇见的小宝贝。"
    ]
  ],
  "lab": [
    [
      "eraser",
      "I use more erasers than pencils in this room.",
      "这间屋子里，橡皮用得比铅笔还快。"
    ],
    [
      "pause",
      "Taking longer to decide is also a perfectly good answer.",
      "多想一会儿，也是一种很好的回答。"
    ],
    [
      "drawing",
      "Someone drew a tiny boat in the margin.",
      "有人在纸边画了一艘小船。"
    ],
    [
      "pencil",
      "The pencil has an eraser for a reason. Answers can change.",
      "铅笔带橡皮是有道理的，答案也可以改。"
    ],
    [
      "labels",
      "A label belongs on a drawer, not on someone's whole personality.",
      "标签贴在抽屉上就好，别拿来定义一个人。"
    ],
    [
      "notebook",
      "My notebook has a page for things I am still curious about.",
      "我的笔记本里专门留了一页，记还没想明白的事。"
    ]
  ],
  "story": [
    [
      "envelope",
      "This envelope has travelled farther than I have.",
      "这只信封去过的地方比我还多。"
    ],
    [
      "chapter",
      "I stopped reading at a lovely sentence yesterday.",
      "昨天读到一句很喜欢的话，就停在那里了。"
    ],
    [
      "shelf",
      "The unfinished stories have their own shelf.",
      "没写完的故事，也有专属书架。"
    ],
    [
      "fork",
      "At a crossroads, I like imagining where the other road might go.",
      "每逢岔路，我总忍不住想想另一条路会通往哪里。"
    ],
    [
      "ending",
      "Some stories end with a train ticket instead of a wedding.",
      "有些故事的结尾不是婚礼，而是一张火车票。"
    ],
    [
      "draft",
      "My first draft had three endings. None involved replying to email.",
      "初稿写了三个结局，没有一个需要回邮件。"
    ]
  ],
  "cafe": [
    [
      "spoons",
      "I never remember which spoon belongs to which set.",
      "这些勺子到底是哪套的，我总记不住。"
    ],
    [
      "tablecloth",
      "A little stain on the tablecloth looks like a heart.",
      "桌布上有块小污渍，长得像颗心。"
    ],
    [
      "orders",
      "Two different drinks can share the same tray.",
      "两杯不一样的饮料，也能放在同一个托盘上。"
    ],
    [
      "twochairs",
      "People can see things differently and still enjoy a cup of tea together.",
      "看法不一样，也可以坐下来好好喝杯茶。"
    ],
    [
      "menu",
      "I keep the menu short. Getting to know someone takes long enough.",
      "菜单就写短一点吧，了解一个人已经够费时间了。"
    ],
    [
      "listening",
      "The best part of a conversation sometimes comes after the pause.",
      "有些话，安静一会儿才说得出口。"
    ]
  ]
};
const extraLines={
  "temple": [
    [
      "leavephone",
      "The incense is burning nicely. Your phone can stay in your pocket.",
      "香烧得正好，手机就留在口袋里吧。"
    ],
    [
      "cloudshift",
      "The clouds have changed shifts. No handover meeting required.",
      "云朵换班了，连交接会都不用开。"
    ]
  ],
  "tarot": [
    [
      "deckdayoff",
      "The deck refuses to predict the exact time your boss will log off.",
      "这副牌拒绝预测老板几点下班。"
    ],
    [
      "questionmark",
      "A question mark is allowed to remain a question mark.",
      "问号不必今天就变成句号。"
    ]
  ],
  "yue": [
    [
      "redink",
      "I used red ink for a date, not for your performance review.",
      "朱砂是拿来标日子的，不是给你打绩效的。"
    ],
    [
      "pagewind",
      "A gust of wind chose a page for me. I still have to read it.",
      "风替我翻了页，内容还是得自己看。"
    ]
  ],
  "garden": [
    [
      "bamboo",
      "The bamboo pipe has one job. What a luxurious career.",
      "竹筒只需要做好一件事，真是令人羡慕的职业。"
    ],
    [
      "leafrent",
      "The leaves have moved into the pond. I doubt they pay rent.",
      "落叶搬进池塘了，看样子也不交租。"
    ]
  ],
  "grandma": [
    [
      "soupclock",
      "Soup is ready when it smells right, not when the calendar says so.",
      "汤香了才算好，日历催也没用。"
    ],
    [
      "garlic",
      "Someone asked for a little garlic. I interpreted that generously.",
      "有人说放一点蒜，我对一点的理解比较大方。"
    ]
  ],
  "mei": [
    [
      "teaspoon",
      "I found three teaspoons in my apron. None can stir away Monday.",
      "围裙里摸出三把茶匙，没一把能把周一搅没。"
    ],
    [
      "seatfree",
      "That empty chair is free. No reservation deposit or team bonding.",
      "空椅子随便坐，不用订位费，也不用团建。"
    ]
  ],
  "hong": [
    [
      "voice",
      "A seven-minute voice message arrived. I am making tea first.",
      "收到一条七分钟的语音，我先泡杯茶。"
    ],
    [
      "seen",
      "The group chat is very active for people who say they are busy.",
      "群里那群说自己很忙的人，聊得可真热闹。"
    ]
  ],
  "wang": [
    [
      "calendarfull",
      "My calendar is fully booked. My actual work is waiting outside.",
      "日历排满了，真正的工作还在门外排队。"
    ],
    [
      "urgent",
      "The email marked urgent has been waiting since Tuesday.",
      "那封标着紧急的邮件，从周二等到现在。"
    ]
  ],
  "ahma": [
    [
      "paperwork",
      "My paper has no approval chain. A very efficient operation.",
      "我这儿的纸不用层层审批，效率高得很。"
    ],
    [
      "riverquiet",
      "The river has never asked for a status update.",
      "河水从来不催进度。"
    ]
  ],
  "lin": [
    [
      "sunspot",
      "The cats moved their meeting to a sunnier patch.",
      "猫咪把会议地点改到更暖和的太阳底下。"
    ],
    [
      "deergrass",
      "The deer is investigating a leaf. Apparently the report is confidential.",
      "小鹿正在研究一片叶子，报告似乎是保密的。"
    ]
  ],
  "arcade": [
    [
      "highscore",
      "The high-score board does not ask for a cover letter.",
      "排行榜不用附求职信。"
    ],
    [
      "prize",
      "The prizes are here to be enjoyed, not audited.",
      "奖品拿来开心就好，不用做盘点报告。"
    ]
  ],
  "boba": [
    [
      "receipt",
      "The receipt says extra pearls. A decision I can fully support.",
      "小票写着加珍珠，这个决定我完全支持。"
    ],
    [
      "straw",
      "The straw has one opening and no complicated onboarding.",
      "吸管插好就能用，不需要入职培训。"
    ]
  ],
  "souvenir": [
    [
      "wrapping",
      "I spent longer choosing the ribbon than the gift.",
      "挑丝带的时间比挑礼物还长。"
    ],
    [
      "postage",
      "The postcard is on holiday even if you are not.",
      "你没放假也没关系，明信片替你去旅行。"
    ]
  ],
  "lab": [
    [
      "pencilcase",
      "There isn't an answer key for being yourself.",
      "做自己这件事，可没有标准答案。"
    ],
    [
      "answer",
      "The quietest answer can be the one worth keeping.",
      "最安静的那个答案，也许最值得记下来。"
    ]
  ],
  "story": [
    [
      "plot",
      "A plot twist need not involve resigning in a dramatic hallway.",
      "人生反转不一定要在走廊里潇洒辞职。"
    ],
    [
      "ticket",
      "The spare ticket is for an imaginary journey, not a commitment.",
      "备用车票是给想象中的旅程，不是给你签合约。"
    ]
  ],
  "cafe": [
    [
      "sugar",
      "Two people can disagree on sugar and still share a table.",
      "甜度意见不合，也不耽误同桌喝茶。"
    ],
    [
      "quiet",
      "A comfortable silence does not need a rescue plan.",
      "舒服的沉默，不需要谁来救场。"
    ]
  ]
};
for(const [id,rows] of Object.entries(extraLines))lines[id].push(...rows);
/* Local conversational humour: warm teasing, rest and individual voices. */
const auntieVoiceLines={
  "temple": [
    [
      "workox",
      "Aiyo, who are you working so hard for? Even an ox gets to rest when the field is ploughed.",
      "哎哟，你这么拼命是为了谁？做牛做马干嘛，牛耕完田还知道歇一歇呢。"
    ],
    [
      "incensepace",
      "The incense burns at its own pace. No need to rush through your whole life.",
      "香都有自己的时辰，你也不用把一辈子过得那么赶。"
    ],
    [
      "smallwish",
      "Always praying for everyone else? Remember to save one wish for yourself.",
      "老是替别人求平安？也记得给自己留一个心愿。"
    ]
  ],
  "tarot": [
    [
      "overtimecard",
      "Even The Chariot needs somewhere to park. What are you in such a hurry for?",
      "战车牌也得找地方停车呀。你到底在急什么呢？"
    ],
    [
      "ownlife",
      "What would you choose if nobody were waiting to be impressed?",
      "如果不用证明给谁看，你自己真正想选什么？"
    ],
    [
      "replytomorrow",
      "The cards aren't going to answer your work email. That can wait until you're ready.",
      "牌又不能替你回工作消息，等你想清楚了再回也不迟。"
    ]
  ],
  "yue": [
    [
      "fateovertime",
      "My friend, your birth chart does not say you must spend your whole life working overtime.",
      "小友，命盘可没写着你这辈子必须加班啊。"
    ],
    [
      "goodfortune",
      "You ask about good fortune. Have you made any time to enjoy the fortune you already have?",
      "你来问福气，可曾留点时间享受眼前已有的福气？"
    ],
    [
      "brushpause",
      "Even this old man puts his brush down. A rest is not a wasted day.",
      "老夫写累了也要搁笔。歇一歇，又不是白过一天。"
    ]
  ],
  "garden": [
    [
      "grasssalary",
      "Look at that grass. No promotion, no bonus, still growing quite happily.",
      "你看那草，不升职、不加薪，照样长得挺开心。"
    ],
    [
      "benchfree",
      "Sit awhile. This bench won't ask what you've achieved today.",
      "坐一会儿吧，这长椅又不会问你今天做了多少事。"
    ],
    [
      "windleave",
      "The wind comes and goes as it pleases. I envy its leave policy.",
      "风想来就来，想走就走。真羡慕它请假的自由。"
    ]
  ],
  "grandma": [
    [
      "workmeal",
      "Aiyo, work so hard for what? Will your boss come and cook porridge if you fall sick?",
      "哎哟，那么拼命干嘛？你病了，老板会来给你煮粥啊？"
    ],
    [
      "ricefirst",
      "Come, eat first. Your salary isn't going up just because your rice is getting cold.",
      "来，先吃饭。饭都凉了，工资又不会跟着涨。"
    ],
    [
      "bodyone",
      "Money can earn again, dear. You've only got one body. Take better care of it.",
      "钱可以再赚，身子就这一个。傻孩子，对自己好一点。"
    ],
    [
      "soupclockout",
      "Your shift can finish. The soup is already done, and so are you for today.",
      "汤都煮好了，你今天的活也该收工了。"
    ],
    [
      "fullbowl",
      "Here, another spoonful. At least in this house, more work comes with more food.",
      "来，再添一勺。外婆这里多干一点活，至少还多给一口饭。"
    ]
  ],
  "mei": [
    [
      "hottea",
      "Come, sit. You can put the whole company down for the length of one cup of tea.",
      "来坐，喝一杯茶的工夫，公司那摊事先放下吧。"
    ],
    [
      "notmachine",
      "You are a person, not a kettle. Nobody needs to keep you boiling all day.",
      "你是个人，又不是烧水壶，哪能一天到晚烧着呀。"
    ],
    [
      "replytea",
      "If they can wait three days to approve your leave, they can wait while you finish your tea.",
      "批你的假能拖三天，等你喝完这杯茶总可以吧。"
    ]
  ],
  "hong": [
    [
      "cowhorse",
      "Eh, doing the work of three people for one salary? What a bargain for the boss!",
      "一个人的工资，三个人的活？哎哟，老板这笔买卖可太划算了！"
    ],
    [
      "companyfamily",
      "They say the company is a family. Funny, my family doesn't need a leave application.",
      "公司说大家是一家人。奇怪，我回自己家可不用填请假单。"
    ],
    [
      "urgentclock",
      "Everything is urgent until it's time to approve your pay rise. Then suddenly, take it slow.",
      "什么事都十万火急，一谈加薪，哎呀，怎么突然就不急了？"
    ],
    [
      "bossdream",
      "Your boss has a dream. Very nice. But why are YOU the one losing sleep?",
      "老板有梦想，很好啊。怎么熬夜实现梦想的却是你？"
    ],
    [
      "afterhours",
      "Don't tell me you're replying after dinner again. Is the office paying rent in your head?",
      "别跟红姐说你吃完饭还回消息。公司住你脑子里，交房租了没？"
    ]
  ],
  "wang": [
    [
      "myfault",
      "I said 'quick meeting' once and booked an hour. Yes, yes, I owe everyone an apology.",
      "我也说过开个短会，结果订了一小时。行行行，是我欠大家一个道歉。"
    ],
    [
      "goodemployee",
      "A good employee shouldn't have to prove it by being the last one to leave.",
      "好员工又不一定非得最后一个下班。"
    ],
    [
      "clockout",
      "If I send you something after hours, it can wait. I need to remember that myself.",
      "我下班后发你的消息可以明天回。这话我自己也得记住。"
    ]
  ],
  "ahma": [
    [
      "oxhorse",
      "Work like an ox, run like a horse, eat like a mouse. Aiyo! Come sit down.",
      "做牛做马，吃饭像只小老鼠。哎哟，快给阿嬷坐下来！"
    ],
    [
      "slipperboss",
      "I can whack the paper. I can't whack an extra day of annual leave out of it. Pity, ah.",
      "纸人阿嬷能打，可惜打不出多一天年假。唉，真可惜。"
    ],
    [
      "borrowedworry",
      "Someone else's bad mood, you carry home for what? Leave it on the paper.",
      "别人的坏脾气，你带回家干嘛？写在纸上，留给阿嬷。"
    ],
    [
      "renthead",
      "That worry has been living in your head for free. Today we give it notice.",
      "这烦恼在你脑子里白住那么久，今天阿嬷给它下逐客令！"
    ],
    [
      "enoughday",
      "You already did what you could today. Don't make me scold you for not resting.",
      "今天能做的都做了。还不休息，等阿嬷骂你啊？"
    ]
  ],
  "lin": [
    [
      "catlesson",
      "Watch the cat. When it's tired, it sleeps. It never feels obliged to justify it.",
      "看看那只猫，累了就睡，从来不用写理由。"
    ],
    [
      "quiettime",
      "The deer doesn't need you to be useful. It just needs you to be gentle.",
      "小鹿不需要你有多能干，温柔一点就好。"
    ],
    [
      "napping",
      "That cat has never felt guilty about an afternoon nap. Quite a talent.",
      "那只猫午睡从来不内疚，真是个值得学的本事。"
    ]
  ],
  "arcade": [
    [
      "bossfree",
      "Play one round for yourself. The high score isn't going into your performance review.",
      "为自己玩一局吧，分数又不用写进绩效报告。"
    ],
    [
      "missagain",
      "Missed? That's all right. Here, you can try again without explaining it in a meeting.",
      "没抓到？没事，在这儿失败了可以再来，不用开会解释。"
    ],
    [
      "funfirst",
      "A game is supposed to be fun, not another thing on your to-do list.",
      "玩游戏是来开心的，不是给待办清单再加一项。"
    ]
  ],
  "boba": [
    [
      "sugarboss",
      "Your boss can choose the meeting time. The sugar level is yours to decide.",
      "开会几点老板定，奶茶几分糖你自己定。"
    ],
    [
      "littlejoy",
      "Long day, ah? At least let the first sip belong entirely to you.",
      "今天挺累啊？至少第一口奶茶，完完全全留给自己。"
    ],
    [
      "bubblebreak",
      "The pearls have already been through boiling water. You don't need to join them.",
      "珍珠都在开水里熬过了，你就别跟着一起熬了。"
    ]
  ],
  "souvenir": [
    [
      "buyforown",
      "Always buying gifts for other people? Pick a little something you like, too.",
      "老是给别人买礼物？也挑一件自己喜欢的小东西嘛。"
    ],
    [
      "notuseful",
      "A little trinket doesn't have to be useful. Looking at it and smiling is enough.",
      "小摆件不用非得有用，看着开心就够了。"
    ],
    [
      "tripprice",
      "A holiday is not a prize you have to earn by exhausting yourself first.",
      "放假不是奖励，不用先把自己累坏了才配去玩。"
    ]
  ],
  "lab": [
    [
      "workidentity",
      "If nobody asked what you do for a living, how would you introduce yourself?",
      "如果没人问你做什么工作，你会怎么介绍自己？"
    ],
    [
      "answerown",
      "Pick your answer, not the answer that would look good at a job interview.",
      "选自己的答案，不是选面试官爱听的答案。"
    ],
    [
      "notreview",
      "This isn't a review of how well you're doing at being a person.",
      "这里可不是给你做人打绩效的地方。"
    ]
  ],
  "story": [
    [
      "ownending",
      "Who said every happy ending needs a promotion? Mine might just need a little seaside shop.",
      "谁规定大团圆一定要升职？我的结局说不定只要一家海边小店。"
    ],
    [
      "sidecharacter",
      "You get to be the main character in this story, not somebody else's assistant.",
      "这回你是故事的主角，不是谁的助理。"
    ],
    [
      "chapteroff",
      "You can turn the page without finishing every single sentence on the last one.",
      "上一页不必每句话都写完，才有资格翻开下一页。"
    ]
  ],
  "cafe": [
    [
      "careback",
      "You spend all that time looking after everyone else. Who makes you a cup of tea?",
      "你忙着照顾那么多人，有没有人也给你倒杯茶？"
    ],
    [
      "notearnlove",
      "You don't need to be the most useful person at the table to deserve a seat.",
      "不用做桌上最有用的那个人，才配有个位置坐。"
    ],
    [
      "quietfriend",
      "A good friend can sit beside you even when you've got absolutely nothing to report.",
      "真正的朋友，哪怕你今天什么都没做，也愿意陪你坐一会儿。"
    ]
  ]
};
for(const [id,rows] of Object.entries(auntieVoiceLines))lines[id].push(...rows);
function merge(target){
 if(!target||typeof target!=='object')return 0;let added=0;
 for(const [id,rows] of Object.entries(lines)){
  if(!Array.isArray(target[id]))continue;
  const known=new Set(target[id].map(r=>r[0]));
  for(const [key,en,cn] of rows){const stable='v2:'+key;if(!known.has(stable)){target[id].push([stable,en,cn]);known.add(stable);added++}}
 }
 return added
}
return Object.freeze({merge,profiles:Object.keys(lines)});
});
