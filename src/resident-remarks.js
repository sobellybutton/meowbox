/* Original fictional resident remarks. Stable IDs; no rewards, personal data
or autonomous timers. Merge into the existing ambient scheduler only. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawResidentRemarks=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const lines={
  "temple": [
    [
      "moss",
      "The moss is slowly taking back the stone steps.",
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
      "A sparrow keeps stealing the deer’s leftovers.",
      "有只麻雀老来捡小鹿剩下的饼干。"
    ],
    [
      "shade",
      "I moved the water bowl into the shade.",
      "我把水碗挪到阴凉处了。"
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
    ]
  ]
};
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
