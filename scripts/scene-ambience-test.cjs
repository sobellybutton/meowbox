'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const startup=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const block=startup.split('/* PAW_SCENE_AMBIENCE_BEGIN */')[1]?.split('/* PAW_SCENE_AMBIENCE_END */')[0];
assert.ok(block);
const {pawSceneLightFrame:light,pawSceneVapourFrame:vapour,pawSceneAir:air}=new Function(block+';return {pawSceneLightFrame,pawSceneVapourFrame,pawSceneAir}')();
let n=0;const ck=(v,m)=>{assert.ok(v,m);n++};
const ids=['kitchen','boba','tarot','destiny','match'];
for(const id of ids){
 const still=JSON.stringify(light(id,0,true));
 for(let t=0;t<=120;t+=.2){
  const q=light(id,t);ck(q.length>0&&q.length<=5,'bounded light count');
  ck(q.every(l=>l.u-l.rx>=0&&l.u+l.rx<=1&&l.v-l.ry>=0&&l.v+l.ry<=1&&l.alpha>=.034999&&l.alpha<=.110001),'light remains in painting');
  ck(JSON.stringify(light(id,t,true))===still,'static reduced light');
  for(let i=0;i<3;i++){
   const v=vapour(id,i,t),v0=vapour(id,i,0,true);
   if(id==='kitchen'||id==='destiny'){
    ck(v&&v.alpha>=0&&v.alpha<=.170001&&v.u-v.rx>=0&&v.u+v.rx<=1&&v.v-v.ry>=0&&v.v+v.ry<=1,'bounded smoke');
    ck(JSON.stringify(vapour(id,i,t,true))===JSON.stringify(v0),'static reduced smoke');
   }else ck(v===null,'no steam added where none is painted');
  }
 }
}
ck(light('unknown',0).length===0,'unknown room');
ck(light('kitchen',NaN).length===0,'invalid clock');
ck(vapour('kitchen',-1,0)===null,'invalid particle');
let depth=0,draws=0,clipped=0;
const ctx={save(){depth++},restore(){depth--},beginPath(){},rect(){},clip(){clipped++},translate(){},scale(){},createRadialGradient(){return{addColorStop(){}}},fillRect(){draws++}};
for(const id of ids){
 const before=draws,clipBefore=clipped;
 const count=air(ctx,id,{x:100,y:-145,w:600,h:1065.5},2,false,false);
 ck(count===draws-before&&count<=8,'bounded draws per backdrop');
 ck(depth===0&&clipped===clipBefore+1,'balanced drawing state and clip');
}
const before=draws;
ck(air(ctx,'kitchen',{x:0,y:0,w:100,h:100},1,false,true)===0&&draws===before,'hidden document skips drawing');
ck(air(ctx,'kitchen',{x:0,y:0,w:0,h:100},1)===0,'invalid plate');
console.log('PASS '+n+' scene atmosphere assertions; no rendered acceptance.');
