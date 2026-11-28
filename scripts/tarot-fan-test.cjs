'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_TAROT_FAN_BEGIN \*\/([\s\S]*?)\/\* PAW_TAROT_FAN_END \*\//)[1];
const slots=source.slice(source.indexOf('function pawTarotChoiceSlots('),source.indexOf('function pawTarotFrameMatches('));
const {pawTarotFanPose:pose,pawTarotFanSettled:settled,pawTarotChoiceSlots}=new Function(block+slots+';return {pawTarotFanPose,pawTarotFanSettled,pawTarotChoiceSlots}')();
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
