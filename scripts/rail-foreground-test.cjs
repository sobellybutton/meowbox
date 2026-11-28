'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),a=require('../src/rail-foreground.js');
for(const p of [a.carriage.path,...Object.values(a.sprites).map(s=>s.path),...Object.values(a.far)])assert.ok(fs.existsSync(path.resolve(__dirname,'..',p)));
for(const route of Object.keys(a.far)){
 let seen=new Set();
 for(let t=0;t<9;t+=.05){
  for(const p of a.frame(route,t,900,280)){
   seen.add(p.id);assert.ok(p.x<=900&&p.x+p.width>=0);assert.ok(p.y>=0&&p.y+p.height<=280);
   assert.ok(Math.abs(p.width/p.height-a.sprites[p.id].width/a.sprites[p.id].height)<1e-9);
  }
  assert.deepEqual(a.frame(route,t,900,280,true),a.frame(route,0,900,280,true))
 }
 assert.ok(seen.size>=2)
}
assert.equal(a.frame('bogus',0,900,280).length,0);
assert.equal(a.fit(0,600),null);
assert.deepEqual(a.cover(1000,500,500,500,1),{x:500,y:0,w:500,h:500});
const calls=[],transforms=[],lights=[],rects=[],positions=[];let depth=0,drawn=0;
const ctx={save(){depth++},restore(){depth--},translate(...v){positions.push(v)},transform(...v){transforms.push(v)},beginPath(){},rect(...v){rects.push(v)},clip(){},drawImage(im,...args){calls.push(im.id);drawn++},createLinearGradient(){return{addColorStop(){}}},fillRect(...v){lights.push({v,drawn})}};
const asset=id=>({id,naturalWidth:900,naturalHeight:500});
const assets={carriage:asset('carriage'),far:asset('far'),flowers:asset('flowers'),fence:asset('fence'),lantern:asset('lantern')};
assert.ok(a.draw(ctx,assets,'fortune',1,1000,600));assert.equal(calls[0],'far');assert.equal(calls.at(-1),'carriage');
assert.equal(a.draw(ctx,{},'fortune',0,1000,600),false);
console.log('Railway foreground, motion, clipping contract and path checks passed.');

let atmosphereChecks=0;const ck=v=>{assert.ok(v);atmosphereChecks++};
for(const route of Object.keys(a.far)){
 const still=a.atmosphere(route,0,true);
 for(let i=0;i<=900;i++){const q=a.atmosphere(route,i/100),r=a.atmosphere(route,i/100,true);
  ck(Math.abs(q.breeze)<=.027001&&q.light>=.025&&q.light<=.063001&&q.shade>=.012&&q.shade<=.037001);
  ck(JSON.stringify(r)===JSON.stringify(still)&&r.breeze===0)}
}
ck(a.atmosphere('bogus',0)===null);ck(a.atmosphere('fortune',NaN)===null);
ck(lights.length===1&&lights[0].drawn===1);ck(depth===0);
for(const v of transforms)ck(v[0]===1&&v[1]===0&&Math.abs(v[2])<=.027001&&v[3]===1&&v[4]===0&&v[5]===0);
calls.length=0;transforms.length=0;lights.length=0;drawn=0;
ck(a.draw(ctx,assets,'fortune',4,1000,600,true));ck(transforms.length===0);ck(depth===0);ck(calls.at(-1)==='carriage');
console.log('PASS '+atmosphereChecks+' railway atmosphere assertions; rendered visual acceptance pending.');

let portraitChecks=0;const pc=v=>{assert.ok(v);portraitChecks++};
pc(fs.existsSync(path.resolve(__dirname,'..',a.portrait.path)));
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1024,1536],[1920,1080]]){
 const box=a.fit(w,h,'portrait'),win=a.windowBox(box,'portrait');
 pc(box.x>=-1e-8&&box.y>=-1e-8&&box.x+box.width<=w+1e-8&&box.y+box.height<=h+1e-8);
 pc(Math.abs(box.width/box.height-2/3)<1e-9);
 pc(win.x<=119/1024*box.width&&win.y<=322/1536*box.height);
 pc(win.x+win.w>=906/1024*box.width&&win.y+win.h>=831/1536*box.height);
 for(const route of Object.keys(a.far))for(const reduced of [true,false]){
  calls.length=0;rects.length=0;positions.length=0;drawn=0;lights.length=0;transforms.length=0;
  const portrait={id:'portrait',naturalWidth:1024,naturalHeight:1536};
  pc(a.draw(ctx,{...assets,portrait},route,4,w,h,reduced,'portrait'));
  pc(calls[0]==='far'&&calls.at(-1)==='portrait'&&depth===0);
  pc(rects.length===2&&JSON.stringify(rects[1])===JSON.stringify([0,0,win.w,win.h]));
  pc(JSON.stringify(positions[1])===JSON.stringify([win.x,win.y]));
  pc(!reduced||transforms.length===0);
 }
}
pc(a.draw(ctx,assets,'fortune',1,390,844,false,'portrait')===false);
pc(a.draw(ctx,{...assets,portrait:asset('wrong')},'fortune',1,390,844,false,'portrait')===false);
pc(a.fit(390,844,'unknown')===null);
console.log('PASS '+portraitChecks+' portrait railway checks; runtime mounting and rendered acceptance remain pending.');

let kineticsChecks=0;
const kc=(v,msg)=>{assert.ok(v,msg);kineticsChecks++};
kc(a.travelDistance(0)===0,'stationary departure');
kc(a.travelDistance(.65)===.325,'smooth departure ramp');
kc(Math.abs(a.travelDistance(1.65)-1.325)<1e-9,'cruising distance');
for(const [w,h] of [[90,900],[240,500],[320,200],[390,258],[787,509],[900,280],[1920,700]])for(const route of Object.keys(a.far)){
 let prev=new Map(),seen=new Set();
 for(let i=0;i<=1800;i++){
  const t=i/100,now=new Map(a.frame(route,t,w,h).map(p=>[p.id,p]));
  for(const [id,p] of now){
   seen.add(id);kc(p.x<=w&&p.x+p.width>=0,'visible bounds');
   if(prev.has(id))kc(Math.abs(p.x-prev.get(id).x)<=w*.57*.01+1e-7,'no visible teleport');
   else if(i>0)kc(p.x>=w-w*.57*.01-1e-7,'enter from right');
  }
  for(const [id,p] of prev)if(!now.has(id))kc(p.x+p.width<=w*.57*.01+1e-7,'exit completely on left');
  kc(JSON.stringify(a.frame(route,t,w,h,true))===JSON.stringify(a.frame(route,0,w,h,true)),'reduced motion');
  prev=now;
 }
 kc(seen.size>=2,'route variety');
}
console.log('PASS '+kineticsChecks+' railway kinetics assertions; actual device rendering remains pending.');
