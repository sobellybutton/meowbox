'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const api=new Function(source.split('/* PAW_REAR_SEATED_ART_BEGIN */')[1].split('/* PAW_REAR_SEATED_ART_END */')[0]+';return {pawRearSeatedBox,pawRearSeatedRecords}')();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/visual/staging/2026-11-27-extracted/manifest.json'),'utf8'));
const records=Object.values(manifest).find(x=>Array.isArray(x)&&x.some(y=>y.path?.endsWith('/seated.webp')));
let n=0;
for(let id=0;id<4;id++){
 const r=api.pawRearSeatedRecords[id],m=records.find(x=>x.path.endsWith('/players/'+id+'/seated.webp'));
 assert.equal(r.w,m.width);assert.equal(r.h,m.height);n+=2;
 assert(fs.existsSync(path.join(root,m.path)));n++;
 for(const scale of [1.35,1.72,2.25])for(const hip of [{x:200,y:320},{x:410,y:580}]){
  const b=api.pawRearSeatedBox(id,hip,scale);
  assert(Math.abs(b.x+b.w-b.hipX-hip.x)<1e-8);
  assert(Math.abs(b.y+b.hipY-hip.y)<1e-8);
  assert(Math.abs(b.w/b.h-r.w/r.h)<1e-8);
  assert(b.y+b.h>hip.y&&b.h<94*scale);n+=4;
 }
}
assert.equal(api.pawRearSeatedBox(99,{x:0,y:0},1),null);
assert.equal(api.pawRearSeatedBox(0,{x:0,y:0},0),null);
assert(source.includes('pawDrawRearSeated(im,id,a.hip,scale)'));
assert(source.includes('delete run.pawRearSeatArt'));
console.log('PASS '+(n+4)+' seat artwork identity, hip contact and visible leg geometry checks');

{
 const seat=source.slice(source.indexOf('function pawRearGardenSeatAmount('),source.indexOf('/* PAW_REAR_BENCH_QUEUE_BEGIN */'));
 const block=source.split('/* PAW_REAR_BENCH_QUEUE_BEGIN */')[1].split('/* PAW_REAR_BENCH_QUEUE_END */')[0];
 const next=new Function(seat+block+';return pawRearBenchNext')();
 let checks=0;
 const eq=(v,w)=>{assert.equal(v,w);checks++};
 for(const reduced of [true,false])for(const intent of ['seat','feed','chime','cats'])for(const blocked of [true,false])for(const atBench of [true,false]){
  const q={pawAfterStand:intent},r={gardenSitting:true,gardenSeatAt:10};
  for(let i=0;i<=100;i++){
   const now=10+i/100;
   eq(next(r,q,now,reduced,atBench,blocked),blocked||!atBench||i<75?null:'stand');
  }
  r.gardenSitting=false;r.gardenSeatAt=20;
  for(let i=0;i<=100;i++){
   const now=20+i/100,waiting=!reduced&&i<45;
   eq(next(r,q,now,reduced,atBench,blocked),blocked||!atBench||waiting?null:intent==='seat'?'clear':'route');
  }
 }
 const q={pawAfterStand:'cats'},run={gardenSitting:false,gardenSeatAt:0};
 eq(next(run,q,1,false,true,false),'route');q.pawAfterStand='seat';eq(next(run,q,1,false,true,false),'clear');
 eq(next(run,{},1,false,true,false),null);
 assert(source.includes('q.pawAfterStand=kind;'));
 assert(source.includes("if(benchNext==='stand')gardenSeat();"));
 console.log('PASS '+checks+' retained garden bench intent, cooldown and stand-before-route assertions');
}

{
 const start=source.indexOf('const pawRearSeatedImages=new Map();'),end=source.indexOf('function pawDrawRearSeated',start);
 const setup=new Function('records',`let calls=[],loaded=new Set(),created=0;class Image{constructor(){created++}};const pawRearSeatedRecords=records,pawPictureDecoded=im=>loaded.has(im),pawReadyPicture=(im,limit)=>calls.push({im,limit});`+source.slice(start,end)+`;return {warm:pawWarmRearSeated,calls,loaded,count:()=>created}`);
 const a=setup(api.pawRearSeatedRecords);let n=0;
 for(let id=0;id<4;id++){
  const im=a.warm(id);assert(im.src.endsWith('/'+id+'/seated.webp'));assert.equal(a.calls.at(-1).limit,4500);assert.equal(a.count(),id+1);
  a.loaded.add(im);const prev=a.calls.length;assert.equal(a.warm(id),im);assert.equal(a.calls.length,prev);n+=5;
 }
 assert.equal(a.warm(99),null);n++;
 assert(source.includes('decode(pawRearGardenArt());pawWarmRearSeated(avatar??0);return'));n++;
 assert(source.includes('if(state.pawRearGarden)pawWarmRearSeated(avatar??0);'));n++;
 assert(source.includes('r&&pawPictureDecoded(im)&&im.naturalWidth===r.w&&im.naturalHeight===r.h'));n++;
 console.log('PASS '+n+' early seated-art decode, identity and stable admission checks');
}
