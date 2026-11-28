'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_TAROT_FAN_BEGIN \*\/([\s\S]*?)\/\* PAW_TAROT_FAN_END \*\//)[1];
const slots=source.slice(source.indexOf('function pawTarotChoiceSlots('),source.indexOf('function pawTarotFrameMatches('));
const {pawTarotFanPose:pose,pawTarotFanSettled:settled,pawTarotChoiceSlots,pawTarotWashPose:wash,pawTarotTrayPose:tray}=new Function(block+slots+';return {pawTarotFanPose,pawTarotFanSettled,pawTarotChoiceSlots,pawTarotWashPose,pawTarotTrayPose}')();
let n=0;const ck=(v,m)=>{assert(v,m);n++};
for(const portrait of [true,false])for(const [i,q] of pawTarotChoiceSlots(portrait).entries()){
 const p=pose(q,i,0),end=pose(q,i,1),reduced=pose(q,i,0,true);
 ck(p.x===400&&p.y===475,'deck origin');ck(p.visible===(i===0),'stagger');
 for(const v of [end,reduced])ck(Math.abs(v.x-q.x)<1e-8&&Math.abs(v.y-q.y)<1e-8&&v.w===q.w&&v.h===q.h&&v.landed&&v.visible,'exact settled slot');
 for(let step=0;step<100;step++){const v=pose(q,i,step/100);ck([v.x,v.y,v.w,v.h,v.angle].every(Number.isFinite)&&v.w>0&&v.h>0,'finite frame')}
}
const q={readStage:'choose',readAt:1,pawFanActive:true};
ck(!settled(q,1.7),'input locked');ck(settled(q,1.75),'ready');ck(settled(q,1,true),'reduced motion');
ck(!settled({...q,readStage:'cards'},2),'stale stage');
ck(settled({readStage:'choose'},0),'legacy test fixture');
const near=(a,b)=>Math.abs(a-b)<1e-7;
for(const portrait of [true,false])for(const [i,q] of pawTarotChoiceSlots(portrait).entries()){
 const end=pose(q,i,1);
 ck(near(end.angle,q.angle),'curved final angle');
 ck(q.hitW>40&&q.hitW<q.w,'distinct touch strip');
 for(let j=0;j<=100;j++){
  const p=wash(i,j/100),v=tray(q,0,3,portrait,j/100);
  ck([p.x,p.y,p.angle,v.x,v.y,v.angle].every(Number.isFinite),'finite tabletop frame');
  ck(p.x-p.w/2>215&&p.x+p.w/2<585,'wash stays horizontally on table');
  ck(p.y-p.h/2>290&&p.y+p.h/2<780,'wash stays vertically on table');
 }
 ck(near(wash(i,0).x,wash(i,1,true).x),'gather matches deck');
}
const washComplete=new Function(block+';return pawTarotWashComplete')();
for(const reduced of [true,false])for(const blocked of [true,false])for(const age of [0,.5,1.449,1.45,1.451,10]){
 const q={readStage:'shuffle',readAt:0};
 ck(washComplete(q,age,reduced,blocked)===(!blocked&&(reduced||age>=1.45)),'wash advances once active and ready');
 ck(!washComplete({...q,readStage:'choose'},age,reduced,blocked),'no repeat after fan starts');
}
ck(!washComplete({readStage:'shuffle'},2),'invalid clock');
ck(source.includes('if(pawTarotWashComplete(state,t,reduced,pawArcadeInputBlocked()))pawOpenCardChoice(false);'),'physical wash directly continues to fan');
const finish=new Function(block+source.slice(source.indexOf('function pawTarotFinishSelection('),source.indexOf('const pawSelectStartBefore'))+';return pawTarotFinishSelection')();
const ext=fs.readFileSync('src/extensions.js','utf8');
const one=ext.slice(ext.indexOf('function readingActivitySlot('),ext.indexOf('function drawFittedFortuneText('));
const five=source.slice(source.indexOf('function fiveReadingLayout('),source.indexOf('function fiveReadingArchive('));
const {pawTarotHandoffPose:move,pawTarotHandoffProgress:progress,pawTarotReadingSlot:landing,pawTarotRestingDeckPose:rest,pawTarotRemainingCount:remaining}=new Function(block+one+five+';return {pawTarotHandoffPose,pawTarotHandoffProgress,pawTarotReadingSlot,pawTarotRestingDeckPose,pawTarotRemainingCount}')();
for(const portrait of [true,false])for(const count of [1,3,5]){
 const slots=pawTarotChoiceSlots(portrait);
 for(let rank=0;rank<count;rank++){
  const from=tray(slots[rank],rank,count,portrait,1),to=landing(rank,count,portrait);
  for(const k of ['x','y','w','h','angle']){ck(near(move(from,to,0)[k],from[k]),'no jump from selection tray');ck(near(move(from,to,1)[k],to[k]),'exact reading slot handoff')}
  for(let step=0;step<=100;step++){const v=move(from,to,step/100);ck([v.x,v.y,v.w,v.h,v.angle].every(Number.isFinite)&&v.w>0&&v.h>0,'valid handoff frame')}
 }
 for(let rank=0;rank<12-count;rank++){const q=rest(rank);const end=move(slots[rank],q,1);ck(near(end.x,q.x)&&near(end.y,q.y)&&near(end.w,q.w)&&near(end.h,q.h),'remaining cards keep same resting deck');ck(q.x-q.w/2>=205&&q.y-q.h/2>=303,'deck rests on mat and in frame')}
 const q={readStage:'choose',pawSelectedCards:Array.from({length:count},(_,i)=>i),pawPickFinishAt:10};
 ck(progress(q,count,10.24)===0,'tray slide precedes handoff');ck(progress(q,count,10.45)>.49&&progress(q,count,10.45)<.51,'handoff middle');ck(progress(q,count,10.1,true)===1,'reduced motion immediate');ck(progress({...q,readStage:'cards'},count,11)===null,'no repeat');
}
for(const count of [1,3,5]){
 const pool=Array.from({length:12},(_,i)=>({i,rev:!!(i%2)}));
 const q={readStage:'choose',pawCardPool:pool,pawSelectedCards:Array.from({length:count},(_,i)=>i),pawPickFinishAt:10};
 ck(!finish(q,count,10.1),'final slide must complete');
 ck(!finish(q,count,10.25),'do not enable reveal while cards are travelling');
 ck(finish(q,count,10.66),'finish at exact reading position');
 ck(q.readStage==='cards'&&q.readCards.length===count&&q.readFlip.every(v=>v===-1),'same selected identities and unrevealed state');
 ck(q.readCards.every((v,i)=>v===pool[i]),'identity preserved');
 ck(remaining(q)===12-count,'resting deck retains unchosen cards');
 ck(remaining({...q,readCards:q.readCards.map(c=>({...c}))})===0,'stale spread cannot render an unrelated resting deck');
 ck(!finish(q,count,11),'no repeated transition');
}

// Test exact runtime entry and selection with a mock local store.
const daily=source.match(/\/\* PAW_DAILY_TAROT_BEGIN \*\/([\s\S]*?)\/\* PAW_DAILY_TAROT_END \*\//)[1];
const choice=source.slice(source.indexOf('function pawOpenCardChoice('),source.indexOf('function pawTarotFinishSelection('));
const pool=source.slice(source.indexOf('function pawTarotPool('),source.indexOf('/* PAW_OWNER_TAROT_CHOICE_END */'));
const runtime=new Function(daily+pool+block+choice+`
let date='2026-11-28',activity='tarot',state={},t=20,W=390,H=844,talkOpen=false,transitioning=false;
const data={},tarotDeck=Array(78).fill(null),document={hidden:false},proposal={hidden:true},residentReducedMotion={matches:false},$=()=>({style:{display:'none'}}),physicalFx=()=>{},hint=()=>{},shrineClock=()=>({day:date}),load=(k,d)=>data[k]??d,save=(k,v)=>{data[k]=JSON.parse(JSON.stringify(v))};
return {open:()=>pawOpenCardChoice(true),select(i){state.pawChoiceFrame={pool:state.pawCardPool,portrait:true};t=23;return pawSelectTarotCard(i)},state:()=>state,data,day(d){date=d},reset(k='tarot'){activity=k;state={};t=20},validate:pawDailyTarotRecord,existing:pawDailyTarotExisting}
`)();
ck(runtime.open()&&runtime.state().readStage==='choose','first daily visit keeps real fan');
const selected=runtime.state().pawCardPool[4];
ck(runtime.select(4),'first choice accepted');
ck(runtime.data.pawDailyTarotDrawV1.i===selected.i&&runtime.data.pawDailyTarotDrawV1.rev===selected.rev,'exact first choice persisted');
runtime.reset();
ck(runtime.open()&&runtime.state().readStage==='cards'&&runtime.state().readFlip[0]===-1,'return directly to same face-down card');
ck(runtime.state().readCards[0].i===selected.i&&runtime.state().readCards[0].rev===selected.rev,'return preserves identity and orientation');
ck(!runtime.select(2),'cannot select again during same-day replay');
ck(!runtime.data.readingJournalV1,'daily lock is not journal autosave');
runtime.reset('love');
ck(runtime.open()&&runtime.state().readStage==='choose','three-card reading remains free');
ck(runtime.select(0)&&runtime.select(1)&&runtime.select(2),'three distinct choices remain available');
ck(runtime.data.pawDailyTarotDrawV1.i===selected.i,'deeper reading cannot change daily card');
runtime.day('2026-11-29');runtime.reset();
ck(runtime.open()&&runtime.state().readStage==='choose','next day allows new choice');
const next=runtime.state().pawCardPool[7];ck(runtime.select(7)&&runtime.data.pawDailyTarotDrawV1.day==='2026-11-29'&&runtime.data.pawDailyTarotDrawV1.i===next.i,'new day stores actual selection');
runtime.reset();runtime.day('2026-11-30');runtime.data.readingJournalV1=[{date:'2026-11-30',cards:[{i:5,rev:true}]}];
ck(runtime.open()&&runtime.state().readCards[0].i===5&&runtime.state().readCards[0].rev===true,'migrate existing daily journal entry');
for(const rec of [null,{day:'2026-11-30',i:-1,rev:false},{day:'2026-11-30',i:78,rev:false},{day:'2026-11-30',i:1,rev:'false'},{day:'2026-11-29',i:1,rev:false}])ck(runtime.validate(rec,'2026-11-30',78)===null,'invalid or stale daily data rejected');
ck(runtime.existing(null,[{date:'2026-11-30',cards:[{i:2,rev:false},{i:3,rev:false},{i:4,rev:false}]}],'2026-11-30',78)===null,'three-card archive cannot become daily result');
runtime.day('2026-12-01');runtime.reset();ck(runtime.open(),'new visit starts fan');
runtime.data.pawDailyTarotDrawV1={day:'2026-12-01',i:8,rev:true};
ck(runtime.select(2)&&runtime.state().readStage==='cards'&&runtime.state().readCards[0].i===8,'respect other-tab existing daily choice');
ck(ext.includes("entry.date=activity==='tarot'&&typeof state.pawDailyDay"),'journal retains the original draw day');

new Function(source);
console.log('PASS '+n+' tarot fan motion and input checks');
