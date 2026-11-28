'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),api=require('../assets/visual/painted/npc-walk.js');
async function main(){
const images=Array.from({length:8},(_,i)=>({complete:true,naturalWidth:448,naturalHeight:464,id:i,decode:()=>Promise.resolve()}));
let n=0;const check=(v,m)=>{assert.ok(v,m);n++};
check(!api.ready(images),'downloads alone cannot admit walking art');
check(await api.decodeSequence(images)&&api.ready(images),'all frames decoded');
const requests=[];
class FakeImage{set src(path){this.path=path;requests.push(this)} decode(){return Promise.resolve()}}
const prepare=api.createLoader(FakeImage);
const first=prepare(1);
check(prepare(1)===first&&requests.length===8,'one pending request per sequence');
check(!await first.promise&&first.status==='failed','invalid dimensions reject sequence');
check(prepare(1)===first&&requests.length===8,'no failure retry within visit');
const next=prepare(2);
for(const im of next.images)Object.assign(im,{complete:true,naturalWidth:448,naturalHeight:464});
check(await next.promise&&api.ready(next.images),'retry on new visit succeeds');
check(prepare(3)===next&&requests.length===16,'decoded sequence reused');
const bad=images.map((im,i)=>i===4?{...im,decode:()=>Promise.reject(Error('decode failure'))}:im);
check(!await api.decodeSequence(bad)&&!api.ready(bad),'one failed decode blocks entire set');
for(const h of [45,72,94,150,225]){
 const stride=h*.65;
 for(let i=0;i<400;i++){
  const d=i*stride/80,b=api.box(400,535,h),f=api.frame(d,h);
  check(f>=0&&f<8,'frame bounds');
  check(Math.abs(b.x+b.w*224/448-400)<1e-8&&Math.abs(b.y+b.h*454/464-535)<1e-8,'fixed ground anchor');
  check(api.frame(d,h,true)===2,'reduced motion fixed');
 }
 for(let i=0;i<8;i++)check(api.frame((i+.5)*stride/8,h)===i,'all poses in sequence');
}
const actor={identity:'office-worker',facing:'right',walking:true,x:400,y:535,distance:20};
const calls=[],ctx={drawImage(...v){calls.push(v)}};
check(api.draw(ctx,actor,images,94),'valid matching actor draws');
check(calls.length===1,'no duplicate figure');
for(const patch of [{identity:'tourist'},{facing:'left'},{facing:'up'},{walking:false},{distance:NaN},{x:NaN}]){
 check(!api.draw(ctx,{...actor,...patch},images,94),'unsupported actor or state uses current fallback');
}
check(!api.draw(ctx,actor,images.slice(1),94),'partial sequence never draws');
check(!api.draw(ctx,actor,images.map((v,i)=>i===4?{...v,naturalWidth:1}:v),94),'wrong size falls back');
check(!api.draw(ctx,actor,images,0),'invalid scale');
for(const p of api.assets)check(fs.existsSync(path.resolve(__dirname,'..',p)),'uploaded asset exists');
console.log('PASS '+n+' office-worker artwork geometry and identity checks; candidate only.');

}
main().catch(e=>{console.error(e);process.exitCode=1});
