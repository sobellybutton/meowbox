'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),s=read('src/startup.js'),e=read('src/extensions.js'),engine=read('src/engine.js');
const block=k=>s.split('/* '+k+'_BEGIN */')[1].split('/* '+k+'_END */')[0];
const h=new Function(block('PAW_TEMPLE_JOURNEY')+block('PAW_RITUAL_PAUSE')+';return {pawFortuneNext,pawFortuneAction,pawQuietClock,pawFortuneTransferFrame}')();
let checks=0;const ck=(x,m)=>{assert.ok(x,m);checks++};
for(const result of [1,2])for(let i=0;i<=200;i++){const now=10+i/100,q={pawFortuneNumber:4,count:1,result,moonPending:false,tossUntil:10,pawFortuneSettledAt:10};const want=now-10<1.2?null:'retry';ck(h.pawFortuneNext(q,'moon',now,false)===want,'hold');ck(h.pawFortuneAction(q,q,'moon',now,false,'retry')===(want==='retry'),'guard');ck(h.pawFortuneNext(q,'moon',now,true)===null,'blocked')}
const q={pawFortuneNumber:4,count:1,result:1,pawFortuneSettledAt:10,tossUntil:10};h.pawQuietClock(q,'moon',10,false);h.pawQuietClock(q,'moon',10.2,true);h.pawQuietClock(q,'moon',60,true);h.pawQuietClock(q,'moon',60.1,false);ck(h.pawFortuneNext(q,'moon',60.1,false)===null,'pause');ck(h.pawFortuneNext(q,'moon',62,false)==='retry','resume');ck(h.pawFortuneNext({...q,result:0},'moon',62,false)==='receive','success unchanged');
const g={moonFoot:{x:500,y:400},stickPickFoot:{x:350,y:390},stickFoot:{x:250,y:390}};
for(const action of ['retry','confirm']){const q={pawFortuneNumber:3,pawFortuneTransfer:action,pawFortuneTransferAt:10,stickDelivered:true};const start=h.pawFortuneTransferFrame(q,10,g),end=h.pawFortuneTransferFrame(q,20,g);ck(start.x===(action==='retry'?500:350),'start from actual station');ck(end.x===(action==='retry'?250:500)&&end.done,'arrive at target');let prev=start.x;for(let i=1;i<=200;i++){const f=h.pawFortuneTransferFrame(q,10+i/100,g);ck(action==='retry'?f.x<=prev:f.x>=prev,'continuous directional walk');prev=f.x;ck(h.pawFortuneNext(q,action==='retry'?'moon':'sticks',10+i/100,false)===null,'prevent repeated route');}h.pawQuietClock(q,action==='retry'?'moon':'sticks',10,false);h.pawQuietClock(q,action==='retry'?'moon':'sticks',10.2,true);h.pawQuietClock(q,action==='retry'?'moon':'sticks',50,true);ck(!h.pawFortuneTransferFrame(q,50,g).done,'hidden travel pauses')}
ck(e.includes('state.pawFortuneSettledAt=t'),'actual landing clock');ck(s.includes("key:'fortune-settled'"),'visible settled state');ck(s.includes('pawAlcoveScene();if(!pawDrawAlcoveFortuneTransfer())'),'same painted scene');ck(!s.includes("tr('Fictional resident','虚构居民')"),'no rack immersion-breaking label');ck(!e.includes('Town residents · fictional companions'),'no town banner label');ck(!engine.includes('Fictional town news'),'no news label');console.log('PASS '+checks+' temple result, physical walk and resident copy checks');

// Owner reported block/character overlap. Exercise exact rendered geometry and
// actual toss trajectories, not just the nominal tray center.
const moonApi=new Function(block('PAW_PURIFICATION_PAINT')+block('PAW_ALCOVE_PAINT')+e.slice(e.indexOf('function pawMoonFlat('),e.indexOf('function pawRitualAdvance('))+';return {pawAlcoveGeometry,pawAlcoveMoonReach,pawAlcoveMoonPoint,pawAlcoveMoonContact,pawAlcoveMoonClearance,pawWaterCamera,pawMoonFlat,pawMoonMotion}')();
const moonGeo=moonApi.pawAlcoveGeometry();
let clearanceChecks=0,minClearance=Infinity;
for(const result of [0,1,2])for(const height of [45,95,135])for(let frame=0;frame<=200;frame++){
 const f=frame/200;
 for(let index=0;index<2;index++){
  const m=moonApi.pawMoonMotion(f,index,moonApi.pawMoonFlat(result,index,1),height);
  const gap=moonApi.pawAlcoveMoonClearance(moonGeo,m);
  assert.ok(gap>=3,'Crescent crosses traveller silhouette');minClearance=Math.min(minClearance,gap);clearanceChecks++;
  if(index===0){const hand=moonApi.pawAlcoveMoonContact(moonGeo,f,m),reach=moonApi.pawAlcoveMoonReach(moonGeo);
   if(hand){assert.ok(Math.hypot(hand.x-reach.shoulder.x,hand.y-reach.shoulder.y)<=reach.maxReach);clearanceChecks++}
   if(f===0){assert.deepEqual(hand,moonApi.pawAlcoveMoonPoint(moonGeo,m));clearanceChecks++}
  }
 }
}
for(const action of ['retry','confirm'])for(let frame=0;frame<=200;frame++){
 const pose=h.pawFortuneTransferFrame({pawFortuneTransfer:action,pawFortuneTransferAt:10},10+frame/100,moonGeo);
 for(let index=0;index<2;index++){
  const m=moonApi.pawMoonMotion(1,index,false,95);
  assert.ok(moonApi.pawAlcoveMoonClearance(moonGeo,m,pose)>=3,'Retry/approach crosses blocks');clearanceChecks++;
 }
}
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1440,900]]){
 const c=moonApi.pawWaterCamera(w,h);
 assert.ok(c.ox+moonGeo.moonTray.x*c.s<w&&c.ox+moonGeo.moonFoot.x*c.s>0);clearanceChecks++;
}
console.log('PASS '+clearanceChecks+' moon clearance, contact, walk and viewport checks; minimum world gap '+minClearance.toFixed(2));

// The converged candidate installs a later paired-ritual runtime. Test its actual guard and route, not only the older startup fallback.
const pairedSource=read('src/release-fixes.js').split('/* PAW_CONTINUOUS_FORTUNE_BEGIN */')[1].split('/* PAW_CONTINUOUS_FORTUNE_END */')[0];
const paired=new Function(pairedSource+';return {pawPairedNext,pawPairedWalkPlan,pawPairedWalkTick}')();
let pairedChecks=0;
for(const result of [1,2])for(const failures of [1,2,3])for(let i=0;i<=200;i++){const now=10+i/100,q={pawFortuneNumber:4,count:1,result,pawFortuneFailures:failures,pawFortuneSettledAt:10,tossUntil:10};assert.equal(paired.pawPairedNext(q,'moon',now,false),now-10<1.2?null:failures===3?'finish':'retry');pairedChecks++;assert.equal(paired.pawPairedNext(q,'moon',now,true),null);pairedChecks++}
for(const painted of [true,false])for(const from of ['moon','sticks']){const plan=paired.pawPairedWalkPlan(from,painted,moonGeo,{x:0,y:0,w:800,h:600},10),origin={...plan.pos},end={...plan.path[plan.path.length-1]};assert.equal(paired.pawPairedWalkTick(plan,20,true,false),false);assert.deepEqual(plan.pos,origin);pairedChecks+=2;let done=false,moved=false;for(let i=1;i<=500&&!done;i++){const old={...plan.pos};done=paired.pawPairedWalkTick(plan,20+i*.02,false,false);const distance=Math.hypot(plan.pos.x-old.x,plan.pos.y-old.y);assert.ok(distance<=145*.02001);moved||=distance>0;pairedChecks++}assert.ok(done&&moved);assert.deepEqual(plan.pos,end);pairedChecks+=2}
console.log('PASS '+pairedChecks+' effective paired-ritual pause, blocked movement and route checks');
