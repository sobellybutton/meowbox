'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const s=read('src/startup.js'),a=s.indexOf('/* PAW_RUNTIME_MODULES_BEGIN'),b=s.indexOf('/* PAW_RUNTIME_MODULES_END */');
assert(a>=0&&b>a);
const code=s.slice(a,b),ambientStart=s.indexOf('const pawAmbientLines='),ambientEnd=s.indexOf('\n};',ambientStart)+3;
const events=[],motionMock={...require('../src/paw-motion-audio'),createPlayer:()=>({reset(){},footstep(step){events.push(step.surface)},railway(){events.push('rail')}})};
const api=new Function('PawResidentRemarks','PawEconomy','PawMotionAudio',s.slice(ambientStart,ambientEnd)+`
let ambientLastFoot=0,indoorStepAt=0,loop=()=>{},pawWalletPage=()=>{};
const document={hidden:false,createElement:()=>({}),head:{append(){}}};
let currentDay='2026-11-27',recordDay=currentDay,checkedInDay='2026-11-26';
let muted=false,room=null,activity=null,transitioning=false,talkOpen=false,scene='fortune',avatar=0,proStep=0,pawFirstRailState=null,actionFxBus={},audio={state:'running'};
let proposal={hidden:true},meowSoundPrefs={effects:true},p={x:0,y:0,walk:true},indoor={x:0,y:0,tx:200,ty:0};
let screen={style:{display:'none'}},rail=null;const game={querySelector:()=>rail};
const $=id=>id==='page'?screen:game,indoorReady=()=>!activity&&!talkOpen&&!transitioning;
const actionFxContext=()=>{throw Error('Unexpected audio context allocation')};
const furnitureCatalogue=()=>[['roomExtension','Reading room','阅读小室',600,'extension'],['roomStudio','Studio','工作室',1000,'extension']];
const furnitureOwned=id=>id==='roomExtension';const hideoutBalance=()=>450;
const shrineClock=()=>({day:currentDay}),townPawRecord=()=>({day:recordDay,keys:['food']}),townPawCategories=()=>[{id:'food',amount:10},{id:'play',amount:20}],dailyWheelPrizes=[10,30],dailyWheelRecord=()=>({day:checkedInDay});
 `+code+`return {pawLiveRemarkCount,pawLiveSurface,pawLiveEconomySnapshot,ambientLastFoot,indoorStepAt,
 tick:pawLiveMotionTick,move:x=>p.x=x,setDay:(r,c)=>{recordDay=r;checkedInDay=c},setMode:m=>{
   proposal.hidden=m!=='first'&&m!=='paused';proStep=5;pawFirstRailState={phase:'riding',paused:m==='paused'};
   transitioning=m==='inter'||m==='arrive';rail=transitioning?{querySelector:()=>({disabled:m==='arrive'})}:null;
   room=m==='indoor'?'boba':null;activity=m==='activity'?'cook':null;talkOpen=m==='talk';
   screen.style.display=m==='page'?'block':'none';muted=m==='mute';document.hidden=m==='hidden';
   meowSoundPrefs.effects=m!=='effectsOff';
 }};`)(require('../src/resident-remarks'),require('../src/paw-economy'),motionMock);
// Compare runtime wiring with a fresh independent merge of the current content.
const remarks=require('../src/resident-remarks');
const baseline=new Function(s.slice(ambientStart,ambientEnd)+';return pawAmbientLines;')();
const expectedRemarkCount=remarks.merge(baseline);
assert(expectedRemarkCount>=96,'Resident content must not regress below the approved collection');
assert.equal(api.pawLiveRemarkCount,expectedRemarkCount);
assert.equal(remarks.merge(baseline),0);assert.equal(api.pawLiveSurface('home',null),'sand');assert.equal(api.pawLiveSurface('fortune','temple'),'stone');assert.equal(api.pawLiveSurface('island','boba'),'wood');
assert.equal(api.ambientLastFoot,Infinity);assert.equal(api.indoorStepAt,Infinity);
const q=api.pawLiveEconomySnapshot();assert.equal(q.goals[0].owned,true);assert.equal(q.goals[1].needed,550);assert.equal(q.goals[1].available,true);assert.equal(q.earn.possible,50);
api.setDay('2026-11-28','2026-11-28');assert.equal(api.pawLiveEconomySnapshot().earn.possible,0);
api.setDay('2026-11-26','2026-11-26');assert.equal(api.pawLiveEconomySnapshot().earn.possible,60);
api.setMode('walk');api.tick();api.move(45);api.tick();assert.equal(events.join(','),'stone');
for(const mode of ['hidden','mute','effectsOff','page','talk','activity','paused','arrive']){api.setMode(mode);api.move(90);api.tick();assert.equal(events.join(','),'stone')}
api.setMode('first');api.tick();api.setMode('inter');api.tick();assert.equal(events.join(','),'stone,rail,rail');
api.setMode('walk');api.tick();api.move(135);api.tick();assert.equal(events.join(','),'stone,rail,rail,stone');
for(const name of ['resident-remarks','paw-motion-audio','paw-economy']){assert(read('index.html').includes('src/'+name+'.js'));assert(read('scripts/build.cjs').includes("'"+name+"'"))}
console.log('PASS live module wiring, resident merge, surfaces and read-only ledger');
