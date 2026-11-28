'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_TAROT_FAN_BEGIN \*\/([\s\S]*?)\/\* PAW_TAROT_FAN_END \*\//)[1];
const slots=source.slice(source.indexOf('function pawTarotChoiceSlots('),source.indexOf('function pawTarotFrameMatches('));
const {pawTarotFanPose:pose,pawTarotFanSettled:settled,pawTarotChoiceSlots,pawTarotWashPose,pawTarotTrayPose,pawTarotFinishSelection,pawTarotWashComplete}=new Function(block+slots+';return {pawTarotFanPose,pawTarotFanSettled,pawTarotChoiceSlots,pawTarotWashPose,pawTarotTrayPose,pawTarotFinishSelection,pawTarotWashComplete}')();
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
new Function(source);
console.log('PASS '+n+' tarot fan motion and input checks');

for(const portrait of [true,false])for(const [i,slot] of pawTarotChoiceSlots(portrait).entries())for(let j=0;j<=100;j++){
 const f=j/100,p=pawTarotWashPose(i,f),fan=pose(slot,i,1),tray=pawTarotTrayPose(slot,i%3,3,portrait,f);
 ck([p.x,p.y,fan.x,fan.y,tray.x,tray.y].every(Number.isFinite)&&Math.abs(fan.angle-slot.angle)<1e-8,'physical table frame');
}
for(const count of [1,3,5]){
 const q={readStage:'choose',pawSelectedCards:Array.from({length:count},(_,i)=>i),pawCardPool:Array.from({length:12},(_,i)=>({i})),pawPickFinishAt:10};
 ck(!pawTarotFinishSelection(q,count,10.1),'wait for card slide');
 ck(pawTarotFinishSelection(q,count,10.25)&&q.readCards.length===count,'preserve selected identities');
}
ck(!pawTarotWashComplete({readStage:'shuffle',readAt:0},2,false,true),'covered wash');
ck(pawTarotWashComplete({readStage:'shuffle',readAt:0},2),'wash to spread');
console.log('PASS '+n+' total tabletop motion checks');
