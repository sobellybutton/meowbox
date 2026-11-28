'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),ext=read('src/extensions.js'),startup=read('src/startup.js');
const scoop=ext.slice(ext.indexOf('function pawTeaScoopBusy'),ext.indexOf('function teaShake(',ext.indexOf('function pawTeaScoopBusy')));
const advance=ext.slice(ext.indexOf('function pearlAdvance(){'),ext.indexOf('const pearlPanel=',ext.indexOf('function pearlAdvance(){')));
const clock=startup.slice(startup.indexOf('function pawFoodClock('),startup.indexOf('/* PAW_FOOD_CLOCK_END */'));
const api=new Function(scoop+advance+clock+`
let state,activity='bubbleTea',t=0;const sound=()=>{},pearlStage=stage=>{state.teaStage=stage;state.teaAt=t};
return {reset(topping){state={teaStage:'pearls',teaTopping:topping,teaToppingCount:0,teaPearls:0,teaAt:0};t=0;return state},scoop:()=>teaAddPearls(),step(now,blocked=false){t=now;pawFoodClock(state,activity,t,blocked);if(!blocked)pearlAdvance()},frame:pawTeaScoopFrame}
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
