'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const s=fs.readFileSync('src/startup.js','utf8');
const api=new Function(s.split('/* PAW_SLIP_COUNTER_BEGIN */')[1].split('/* PAW_SLIP_COUNTER_END */')[0]+';return {pawSlipGeometry,pawSlipPose,pawSlipTravellerContact}')();
const g=api.pawSlipGeometry({x:100,y:-145,w:600,h:600*1635/962});
let n=0;const counts={};
for(const stage of ['folded','opening','open','tied','kept']){
 let contacts=0;
 for(let i=0;i<=1000;i++){
  const age=i/1000,p=api.pawSlipPose(stage,age,g),q=api.pawSlipTravellerContact(stage,age,p,g);
  assert([q.foot.x,q.foot.y,p.x,p.y,p.open,p.alpha].every(Number.isFinite)&&p.alpha>=0&&p.alpha<=1&&p.open>=0&&p.open<=1);
  if(q.hand){contacts++;assert(Math.hypot(q.hand.x-q.shoulder.x,q.hand.y-q.shoulder.y)<=48*q.scale+1e-7)}
  n++;
 }
 counts[stage]=contacts;
}
for(const stage of ['folded','opening','tied','kept'])assert(counts[stage]>0);
assert.equal(counts.open,0);
for(const stage of ['kept','tied']){
 const p=api.pawSlipPose(stage,.7,g);
 assert.equal(p.alpha,0);assert.equal(p.open,0);
}
assert.deepEqual(api.pawSlipTravellerContact('tied',.7,api.pawSlipPose('tied',.7,g),g).foot,g.rackFoot);
assert.equal(g.bag.y,g.counterFoot.y-54);
console.log('PASS '+n+' traveller and paper contact frames '+JSON.stringify(counts));
