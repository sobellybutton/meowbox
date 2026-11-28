'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_READING_SEATED_HOST_BEGIN \*\/([\s\S]*?)\/\* PAW_READING_SEATED_HOST_END \*\//);
assert(block);
const {pawReadingSeatPlan:plan,pawReadingHostPhase:phase,pawReadingCoverPlate:cover,pawReadingHostFamilyReady:ready}=new Function(block[1]+';return {pawReadingSeatPlan,pawReadingHostPhase,pawReadingCoverPlate,pawReadingHostFamilyReady}')();
const api=require('../assets/visual/painted/reading-host-framing.js'),manifest=require('../assets/visual/painted/host-pose-candidates.json');
let n=0;const ck=(v,m)=>{assert(v,m);n++};
for(const bounds of [{x:245,y:235,w:550*928/1648,h:550},{x:220,y:200,w:390,h:844},{x:-100,y:10,w:1440,h:900}]){
 const plate=cover(bounds,928,1648);
 ck(plate.w>=bounds.w-1e-8&&plate.h>=bounds.h-1e-8,'cover');
 for(const id of ['tarot','destiny']){
  const phases=id==='tarot'?['idle','shuffle','focus']:['idle','question','result'];
  let center=null,span=null;
  for(const stage of phases){
   const p=plan(id,plate,stage),f=api.contacts(manifest,p.host,p.pose,p.center,p.span);
   ck(f,'verified frame');
   if(center){ck(p.center.every((v,i)=>v===center[i]),'face position stable');ck(p.span===span,'eye span stable')}
   center=p.center;span=p.span;
   const points=Object.values(f.contacts).flatMap(v=>Array.isArray(v[0])?v:[v]);
   const [x,y,w,h]=p.clip;
   ck(points.every(v=>v[0]>=x&&v[0]<=x+w&&v[1]>=y&&v[1]<=y+h),'hands and held props remain visible');
  }
 }
}
for(const id of ['tarot','destiny']){
 ck(ready(id,manifest,api,()=>true),'whole family ready');
 for(let missing=0;missing<3;missing++){let i=0;ck(!ready(id,manifest,api,()=>i++!==missing),'partial family rejected')}
}
ck(phase('tarot',{readStage:'shuffle'},'love',false,false)==='shuffle','shuffle pose');
for(const now of [0,.5,1.449,1.45,2,10])ck(phase('tarot',{readStage:'choose',readAt:1.45},'tarot',false,false,now)===(now<1.45?'shuffle':'idle'),'daily wash host phase follows card clock');
ck(phase('tarot',{readStage:'choose'},'tarot',false,false,0)==='idle','invalid wash timestamp');
ck(phase('tarot',{readStage:'focus',readFocus:0,readCards:[{i:2}]},'love',false,false)==='focus','actual chosen card');
ck(phase('tarot',{readStage:'focus',readFocus:4,readCards:[]},'love',false,false)==='idle','invalid card');
ck(phase('destiny',{},null,true,false)==='question','brush pose');
ck(phase('destiny',{},null,true,true)==='result','parchment pose');
ck(phase('destiny',{},null,false,true)==='idle','closed consultation');
ck(plan('park',{x:0,y:0,w:100,h:100},'idle')===null,'other rooms excluded');
ck(cover({x:0,y:0,w:0,h:10},928,1648)===null,'invalid cover');
new Function(source);
console.log('PASS '+n+' seated reading scene geometry and phase checks');
