'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const block=source.match(/\/\* PAW_ROOM_VISITS_BEGIN \*\/([\s\S]*?)\/\* PAW_ROOM_VISITS_END \*\//);
assert.ok(block);
const api=new Function(block[1]+';return {pawRoomVisitRows,pawRoomVisitRead,pawRoomVisitProgress,pawStationActionAllowed}')();
const world={st:[['temple',2,4,'Temple','寺庙'],['station',1,2,'Station','车站'],['tea',3,4,'Tea room','茶馆'],['tea',7,8,'Tea room','茶馆'],null,['bad']]};
assert.deepEqual(api.pawRoomVisitRows(world).map(r=>r[0]),['temple','tea']);
assert.deepEqual(api.pawRoomVisitRead({fortune:['temple','temple','station','bad'],unknown:['x']},{fortune:world,home:{}}),{fortune:['temple'],home:[]});
assert.deepEqual(api.pawRoomVisitRead(null,{fortune:world}),{fortune:[]});
assert.deepEqual(api.pawRoomVisitProgress(world,['temple','station','tea','tea']),{count:2,total:2,remaining:[]});
assert.equal(api.pawRoomVisitProgress(world,[]).remaining.length,2);
const valid={connected:true,open:true,sameDistrict:true,boarded:false,transitioning:false,room:false,activity:false,entrance:false,hidden:false};
assert.equal(api.pawStationActionAllowed(valid),true);
for(const key of Object.keys(valid))assert.equal(api.pawStationActionAllowed({...valid,[key]:!valid[key]}),false,key);
assert.equal(api.pawStationActionAllowed({}),false);
const directBlock=source.match(/\/\* PAW_DIRECT_BOARD_BEGIN \*\/([\s\S]*?)\/\* PAW_DIRECT_BOARD_END \*\//);
assert.ok(directBlock);
const direct=new Function(directBlock[1]+';return {pawDirectBoardAllowed,pawRailStationCopy,pawRailChapterNote}')();
const board={valid:true,transitioning:false,room:false,activity:false,entrance:false,hidden:false,page:false};
assert.equal(direct.pawDirectBoardAllowed(board),true);
for(const key of Object.keys(board))assert.equal(direct.pawDirectBoardAllowed({...board,[key]:!board[key]}),false,key);
const worlds={fortune:{n:['Fortune Valley','解忧谷']},home:{n:['Lazy Island','懒人岛']},island:{n:['Munch & Play','吃喝玩乐岛']},wonder:{n:['Discovery Station','奇遇站']}};
for(const [from,to] of [['fortune','home'],['home','island'],['island','wonder'],['wonder','fortune']]){
 assert.deepEqual(direct.pawRailStationCopy(from,to,worlds),from==='fortune'?['Railway Station','火车站']:['To '+worlds[to].n[0],'前往'+worlds[to].n[1]]);
 const note=direct.pawRailChapterNote(from,to);assert.ok(note&&note.every(v=>typeof v==='string'&&v.length>0));
}
assert.equal(direct.pawRailChapterNote('fortune','wonder'),null);
assert.deepEqual(direct.pawRailStationCopy('fortune','missing',worlds),['Railway Station','火车站']);
assert.ok(!source.includes('pawStationPlatform(scene)'));
console.log('District visit and direct station boarding regression passed');


// Actual edge-navigation helpers: geometry alone does not prove reachability.
{
 const start=source.indexOf('function pawRailPlaqueReachable('),end=source.indexOf('let pawRailEdgeAt=',start);
 assert.ok(start>=0&&end>start);
 let hit=null,style={display:'block',visibility:'visible',pointerEvents:'auto'};
 const {pawRailPlaqueReachable:ready,pawRailEdgePosition:position}=new Function('document','getComputedStyle',source.slice(start,end)+';return {pawRailPlaqueReachable,pawRailEdgePosition}')({elementFromPoint:()=>hit},()=>style);
 const g={left:0,top:0,right:390,bottom:844,width:390,height:844};
 const sign={hidden:false,disabled:false,getBoundingClientRect:()=>({left:10,top:100,right:110,bottom:144,width:100,height:44}),contains:v=>v===sign};
 hit=sign;assert.ok(ready(sign,g));
 hit={};assert.ok(!ready(sign,g));hit=sign;
 for(const [key,value] of [['visibility','hidden'],['display','none'],['pointerEvents','none']]){
  const previous=style[key];style[key]=value;assert.ok(!ready(sign,g));style[key]=previous;
 }
 sign.hidden=true;assert.ok(!ready(sign,g));sign.hidden=false;
 sign.disabled=true;assert.ok(!ready(sign,g));sign.disabled=false;
 assert.ok(!ready(sign,{...g,bottom:120}));
 for(const [w,h] of [[320,568],[390,844],[430,932],[844,390],[1440,900]]){
  const viewport={left:10,top:20,width:w,height:h};
  for(let block=0;block<=240;block+=24){
   const pos=position(viewport,130,44,[{left:10,right:10+w,top:20,bottom:20+block}]);
   if(pos){assert.ok(pos.left>=8&&pos.left+130<=w-8);assert.ok(pos.top+44<=h-100);assert.ok(pos.top>=block+5)}
   else assert.ok(block+5+44>h-100-24);
  }
 }
 assert.equal(position(g,390,44,[]),null);
 assert.equal(position(g,130,44,[{left:0,right:390,top:0,bottom:844}]),null);
 console.log('Railway touch reachability and bounded edge placement passed');
}

// District stamps are saved and counted normally, without obscuring map plaques.
{
 const e=fs.readFileSync(path.resolve(__dirname,'../src/engine.js'),'utf8');
 const start=e.indexOf('function addItem('),end=e.indexOf('let toastTimer',start);
 assert.ok(start>=0&&end>start);
 const run=new Function('items','save','updateHUD','toast','tr',e.slice(start,end)+';return addItem');
 for(const chinese of [false,true]){
  const items=[],notices=[],saves=[];let hud=0;
  const add=run(items,(k,v)=>saves.push([k,v.length]),()=>hud++,v=>notices.push(v),(en,zh)=>chinese?zh:en);
  for(const [en,zh] of [['Fortune Valley','解忧谷'],['Sea Breeze Island','海风岛'],['Lantern Lane','灯笼巷'],['Starlight Valley','星光谷']]){add('Arrival: '+en,zh+'入境章');add('Arrival: '+en,zh+'入境章')}
  assert.equal(items.length,4);assert.equal(hud,4);assert.equal(saves.length,4);assert.equal(notices.length,0);
  add('Tea keepsake','茶饮纪念品');add('Tea keepsake','茶饮纪念品');
  assert.equal(items.length,5);assert.equal(hud,5);assert.equal(saves.length,5);assert.deepEqual(notices,[chinese?'已收藏：茶饮纪念品':'Collected: Tea keepsake']);
 }
 console.log('Arrival stamps preserve collection and HUD without obscuring map labels');
}

// Fortune Valley wayfinding is based on player progress, not visibility of the distant art.
{
 const discovery=source.match(/\/\* PAW_VALLEY_DISCOVERY_BEGIN \*\/([\s\S]*?)\/\* PAW_VALLEY_DISCOVERY_END \*\//);
 assert.ok(discovery);
 const nearby=new Function(discovery[1]+';return pawValleyDoorNearby')();
 const doors={tarot:{approach:[305,1135]},destiny:{approach:[755,1135]},temple:{approach:[375,702]},wishes:{approach:[630,727]},station:{approach:[568,365]}};
 for(const id of ['tarot','destiny'])assert.equal(nearby(id,1570,doors),true,id);
 for(const id of ['temple','wishes','station'])assert.equal(nearby(id,1570,doors),false,id);
 for(const id of ['temple','wishes'])assert.equal(nearby(id,1150,doors),true,id);
 assert.equal(nearby('station',1150,doors),false);
 assert.equal(nearby('station',835,doors),true);
 assert.equal(nearby('station',836,doors),false);
 assert.equal(nearby('station',365,doors),true);
 assert.equal(nearby('station',NaN,doors),false);
 assert.equal(nearby('unknown',365,doors),false);
 console.log('Fortune Valley progressive discovery regression passed');
}
