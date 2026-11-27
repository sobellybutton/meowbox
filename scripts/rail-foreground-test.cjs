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
const calls=[],ctx={save(){},restore(){},translate(){},beginPath(){},rect(){},clip(){},drawImage(im,...args){calls.push(im.id)}};
const asset=id=>({id,naturalWidth:900,naturalHeight:500});
const assets={carriage:asset('carriage'),far:asset('far'),flowers:asset('flowers'),fence:asset('fence'),lantern:asset('lantern')};
assert.ok(a.draw(ctx,assets,'fortune',1,1000,600));assert.equal(calls[0],'far');assert.equal(calls.at(-1),'carriage');
assert.equal(a.draw(ctx,{},'fortune',0,1000,600),false);
console.log('Railway foreground, motion, clipping contract and path checks passed.');
