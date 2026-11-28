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
const calls=[],transforms=[],lights=[];let depth=0,drawn=0;
const ctx={save(){depth++},restore(){depth--},translate(){},transform(...v){transforms.push(v)},beginPath(){},rect(){},clip(){},drawImage(im,...args){calls.push(im.id);drawn++},createLinearGradient(){return{addColorStop(){}}},fillRect(...v){lights.push({v,drawn})}};
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
