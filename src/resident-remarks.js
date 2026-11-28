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
