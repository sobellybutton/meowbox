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
ck(phase('tarot',{readStage:'shuffle'},'love',false,false)==='table-wash','tabletop owns shuffle');
ck(plan('tarot',{x:0,y:0,w:928,h:1648},'table-wash').pose==='seated-idle','no second held deck during tabletop wash');
for(const now of [0,.5,1.449,1.45,2,10])ck(phase('tarot',{readStage:'choose',readAt:1.45},'tarot',false,false,now)===(now<1.45?'table-wash':'idle'),'daily wash host phase follows card clock');
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

const ownershipChecks=new Function(block[1]+`
let n=0;
for(const visitId of [null,'destiny','tarot'])for(const id of ['destiny','tea'])for(const kind of [null,'chart'])for(const transition of [false,true])for(const already of [false,true])for(const ready of [false,true]){
 const v=visitId?{id:visitId,ready:already}:null;
 let probes=0;const result=pawYueAdoptSeatedVisit(v,id,kind,transition,()=>{probes++;return ready});
 const eligible=visitId==='destiny'&&id==='destiny'&&!kind&&!transition&&!already;
 if(result!==(eligible&&ready)||probes!==Number(eligible)||(v&&v.ready!==(already||result)))throw Error('late pose ownership');n++;
}
for(const talk of [true,false])for(const page of [true,false])for(const transition of [true,false]){
 if(pawYueConsultPlaqueVisible(talk,page,transition)!==(!talk&&!page&&!transition))throw Error('plaque ownership');n++;
}
return n`)();
assert.equal(ownershipChecks,104);
assert.equal((source.match(/pawYueAdoptSeatedVisit\(pawHostVisit,room,activity,transitioning/g)||[]).length,2);
assert.ok(source.includes("if(activity||!pawYueConsultPlaqueVisible(talkOpen,$('page').style.display==='block',transitioning))return false"));
console.log('PASS '+ownershipChecks+' seated visit and plaque checks, plus 2 wiring assertions');

const actualStudy={x:0,y:0,w:928,h:1648};
for(const phase of ['idle','question','result']){
 const p=plan('destiny',actualStudy,phase),f=api.contacts(manifest,p.host,p.pose,p.center,p.span);
 ck(Math.abs(p.center[1]-359.264)<.01,'eye at painted host chair');
 ck(Math.abs(p.clip[3]-504.288)<.01,'desk lip clipping');
 ck(f.rect[1]>=280&&f.rect[1]<350,'host head above chair back');
 if(phase==='question')ck(f.contacts.tip[1]>=460&&f.contacts.tip[1]<=485,'brush tip at actual tabletop');
 if(phase==='result')ck(f.contacts.paper.every(q=>q[1]<p.clip[3]),'complete held parchment above desk lip');
}
console.log('PASS actual study furniture and hand contact alignment checks');
