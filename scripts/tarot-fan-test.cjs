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
const finish=new Function(source.slice(source.indexOf('function pawTarotFinishSelection('),source.indexOf('const pawSelectStartBefore'))+';return pawTarotFinishSelection')();
for(const count of [1,3,5]){
 const pool=Array.from({length:12},(_,i)=>({i,rev:!!(i%2)}));
 const q={readStage:'choose',pawCardPool:pool,pawSelectedCards:Array.from({length:count},(_,i)=>i),pawPickFinishAt:10};
 ck(!finish(q,count,10.1),'final slide must complete');
 ck(finish(q,count,10.25),'finish at settled time');
 ck(q.readStage==='cards'&&q.readCards.length===count&&q.readFlip.every(v=>v===-1),'same selected identities and unrevealed state');
 ck(q.readCards.every((v,i)=>v===pool[i]),'identity preserved');
 ck(!finish(q,count,11),'no repeated transition');
}
new Function(source);
console.log('PASS '+n+' tarot fan motion and input checks');
