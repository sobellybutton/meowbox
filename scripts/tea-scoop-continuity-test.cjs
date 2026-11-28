'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),ext=read('src/extensions.js'),startup=read('src/startup.js');
const scoop=ext.slice(ext.indexOf('function pawTeaScoopBusy'),ext.indexOf('function teaShake(',ext.indexOf('function pawTeaScoopBusy')));
const advance=ext.slice(ext.indexOf('function pearlAdvance(){'),ext.indexOf('const pearlPanel=',ext.indexOf('function pearlAdvance(){')));
const clock=startup.slice(startup.indexOf('function pawFoodClock('),startup.indexOf('/* PAW_FOOD_CLOCK_END */'));
const api=new Function(scoop+advance+clock+`
let state,activity='bubbleTea',t=0;const sound=()=>{},pearlStage=stage=>{state.teaStage=stage;state.teaAt=t};
return {reset(topping){state={teaStage:'pearls',teaTopping:topping,teaToppingCount:0,teaPearls:0,teaAt:0};t=0;return state},scoop:(origin)=>teaAddPearls(origin),step(now,blocked=false){t=now;pawFoodClock(state,activity,t,blocked);if(!blocked)pearlAdvance()},frame:pawTeaScoopFrame}
`)();
let checks=0;const ck=(v,m)=>{assert.ok(v,m);checks++};
for(const topping of [1,2]){
 const q=api.reset(topping);api.scoop();api.step(0);api.scoop();
 ck(q.teaToppingCount===0&&q.pawScoopPending,'count only when topping reaches cup');
 api.step(.2);api.step(.3,true);api.step(60,true);api.step(60.1);
 ck(q.teaToppingCount===0&&q.pawScoopPending,'no hidden deposit');
 api.step(60.38);ck(q.teaToppingCount===1&&q.teaPearls===5&&q.pawScoopPending,'exactly one deposit at cup');
 api.scoop();api.step(60.8);ck(q.teaToppingCount===1&&!q.pawScoopPending&&q.teaStage==='pearls','first scoop returns to bowl');
 api.scoop();api.step(60.8);api.scoop();api.step(61.3);
 ck(q.teaToppingCount===2&&q.teaPearls===10&&q.teaStage==='pearls','second deposit does not skip return');
 api.step(61.7);ck(q.teaStage==='mix'&&!q.pawScoopPending,'mix only after return');api.scoop();ck(q.teaToppingCount===2,'no extra topping');
}
const q=api.reset(0);api.scoop();ck(!q.pawScoopPending,'no topping unchanged');
for(let i=0;i<=85;i++){const f=api.frame(i/100);ck(f.x>=428&&f.x<=530&&f.y>=410&&f.y<=520,'bounded scoop path')}
const drop=api.frame(.85*.55);ck(Math.abs(drop.x-428)<1e-8&&Math.abs(drop.y-437)<1e-8&&drop.drop,'cup lip anchor');
const end=api.frame(.85);ck(end.x===530&&end.y===520&&end.done,'back at storage bowl');
const warm=startup.slice(startup.indexOf('function pawFoodWarmKeys'),startup.indexOf('function pawWarmFoodProps'));
const keys=new Function(warm+';return pawFoodWarmKeys')();
ck(keys('boba').includes('boba_jelly_bowl')&&keys('boba').includes('boba_pearls_bowl'),'both registered art types prewarmed');
ck(keys('park').length===0,'room-specific art');
ck(startup.includes("for(const dish of kitchenDishNames)"),'ingredient plates requested before activity');
ck(ext.includes("state.pawToppingBowlPainted=typeof pawFoodPropReady"),'stable selected painted bowl');
console.log('PASS '+checks+' scoop transfer, hidden-time, repeated input and food asset readiness checks.');

const near=(a,b)=>Math.abs(a-b)<1e-7;
for(const origin of [{x:420,y:480},{x:392,y:450},{x:450,y:490},null]){
 const rest=api.frame(0,false,origin),drop=api.frame(.85*.55,false,origin),done=api.frame(.85,false,origin);
 ck(near(rest.x,origin?.x??530)&&near(rest.y,origin?.y??520),'drag begins at actual release position');
 ck(near(drop.x,428)&&near(drop.y,437)&&drop.drop,'same cup transfer anchor');
 ck(near(done.x,530)&&near(done.y,520)&&done.done,'return to storage bowl');
 for(let i=0;i<=100;i++){
  const f=api.frame(.85*i/100,false,origin);ck(Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.angle),'finite motion');
 }
}
for(const origin of [{x:NaN,y:0},{x:1000,y:1000},null]){
 const f=api.frame(0,false,origin);ck(f.x===530&&f.y===520,'invalid origins use rest');
}
const drag=api.reset(1);api.scoop({x:420,y:480});ck(drag.pawScoopOrigin.x===420,'accepted release stored');api.step(.5);ck(drag.teaToppingCount===1,'single deposit after drag');api.step(.9);ck(drag.pawScoopOrigin===null,'clear drag origin after return');
const reducedEnd=api.frame(.85,true,{x:420,y:480});ck(reducedEnd.x===530&&reducedEnd.y===520,'reduced motion returns to storage');
ck(keys('boba').includes('kitchen_small_ladle'),'existing painted scoop prewarmed');
ck(ext.includes("state.pawToppingScoopPainted=typeof pawFoodPropReady"),'stable scoop artwork admission');
ck(ext.includes("anchor:[32,68],angle:tilt+.5"),'source bowl anchor');
console.log('PASS '+checks+' combined scoop transfer and painted asset checks');

{
 const block=ext.split('/* PAW_TEA_POUR_CONTINUITY_BEGIN */')[1].split('/* PAW_TEA_POUR_CONTINUITY_END */')[0];
 const {admit,timing,pose}=new Function(block+';return {admit:pawTeaPourAdmission,timing:pawTeaPourTiming,pose:pawTeaFallbackPour}')();
 for(const ready of [true,false]){
  const q={};ck(admit(q,ready)===ready,'first artwork decision');
  for(let i=0;i<100;i++)ck(admit(q,!ready)===ready,'no switch after decode');
 }
 for(const reduced of [false,true]){
  let last=0;
  for(let i=0;i<=1550;i++){
   const age=i/1000,f=pose(age,reduced),v=timing(age);
   ck(Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.angle),'finite physical pour');
   ck(f.fill>=last&&f.fill>=0&&f.fill<=1,'monotonic fill');last=f.fill;
   ck(f.stream===v.stream,'same liquid transfer clock');
   if(f.p<.35)ck(f.fill===0,'no liquid before pour');
   if(f.p>=.70)ck(near(f.fill,1),'full before return');
   if(f.stream)ck(near(f.from[0],420)&&near(f.from[1],411)&&f.to[0]===420&&f.to[1]===445,'stream begins at spout and meets cup');
  }
  for(const age of [0,1.55]){const f=pose(age,reduced);ck(near(f.x,530)&&near(f.y,516)&&near(f.angle,0),'same counter rest position')}
 }
 ck(ext.includes("fill=prepared?1:stage==='pouring'?pawTeaPourTiming(age).fill:0"),'visible cup uses transfer clock');
 ck(startup.includes("state.teaStage==='pourReady'&&state.pawTeaPourPainted"),'ready vessel uses same art family');
 ck(ext.includes("state.pawTeaPourPainted&&typeof pawFoodPourFrame"),'pour uses admitted family');
 console.log('PASS '+checks+' combined tea preparation and pour continuity checks');
}
