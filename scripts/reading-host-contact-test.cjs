'use strict';
const assert=require('node:assert/strict');
const api=require('../assets/visual/painted/reading-host-framing.js');
const manifest=require('../assets/visual/painted/host-pose-candidates.json');
let n=0;const ck=(v,m)=>{assert(v,m);n++};
for(const [id,ch] of Object.entries(manifest.characters))for(const pose of Object.keys(ch.poses))for(const span of [5,10,20,40,80]){
 const f=api.contacts(manifest,id,pose,[400,300],span);
 ck(f&&f.eyeSpan===span,'framing');
 for(const p of Object.values(f.contacts).flatMap(v=>Array.isArray(v[0])?v:[v])){
  ck(p[0]>=f.rect[0]&&p[0]<=f.rect[0]+f.rect[2]&&p[1]>=f.rect[1]&&p[1]<=f.rect[1]+f.rect[3],'contact within sprite')
 }
 for(const name of ['card','paper']){
  const s=api.surface(f,name);ck(!!s===Object.hasOwn(f.contacts,name),'surface identity');
  if(s){const [a,b,c,d]=s.matrix;ck(a*d-b*c>0,'positive area');ck(s.corners.length===4,'corners')}
 }
}
const f=api.contacts(manifest,'fortune-teller','seated-present-card',[400,300],20),p=api.contacts(manifest,'master-yue','seated-present-blank-parchment',[400,300],20),image={complete:true,naturalWidth:1024,naturalHeight:2180};
let ops=[];const ctx=Object.fromEntries(['save','restore','transform','beginPath','rect','clip','translate','rotate','drawImage'].map(k=>[k,(...a)=>ops.push([k,...a])]));
for(const rev of [true,false]){
 ops=[];ck(api.drawHeldCard(ctx,f,image,[0,0,100,200],rev),'card painted');
 ck(ops[0][0]==='save'&&ops.at(-1)[0]==='restore','balanced');
 ck(ops.some(a=>a[0]==='rotate')===rev,'exact orientation');
 ck(ops.find(a=>a[0]==='drawImage')[5]===200,'exact atlas crop');
}
ck(!api.drawHeldCard(ctx,f,image,[1000,0,100,200]),'bad crop rejected');
ck(!api.drawHeldCard(ctx,p,image,[0,0,100,200]),'wrong host rejected');
ck(api.drawHeldParchment(ctx,p,()=>{}),'paper');
ck(!api.drawHeldParchment(ctx,f,()=>{}),'wrong paper');
console.log('PASS '+n+' reading host prop contact assertions');
