'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),api=require('../src/home-layout.js');
for(const id of api.layoutIds)assert.ok(fs.existsSync(path.resolve(__dirname,'..',api.shell(id))));
for(const id of api.furnitureIds)assert.ok(fs.existsSync(path.resolve(__dirname,'..',api.furniture(id))));
for(const [id,w,d,count] of [['starter',4,4,16],['side',7,4,28],['studio',7,7,40],['balcony',4,4,16]]){
 let found=0;
 for(let u=0;u<w;u++)for(let v=0;v<d;v++){
  if(!api.cellExists(id,u,v))continue;found++;
  const p=api.project(id,u+.5,v+.5);
  assert.ok(p.x>0&&p.x<1&&p.y>0&&p.y<1);
  assert.deepEqual(api.nearestCell(id,p.x,p.y),{u,v});
 }
 assert.equal(found,count);
 assert.equal(api.nearestCell(id,.5,.02),null);
 assert.equal(api.cellExists(id,w,0),false);
}
const bed={id:'single-bed',u:0,v:0,key:'bed'},chair={id:'wood-chair',u:3,v:3,key:'chair'};
assert.ok(api.canPlace('starter',bed));assert.ok(api.canPlace('starter',chair,[bed]));
assert.equal(api.canPlace('starter',{id:'wood-chair',u:1,v:1},[bed]),false);
assert.ok(api.canPlace('starter',{id:'woven-rug',u:0,v:0},[bed]));
assert.ok(api.canPlace('starter',{id:'single-bed',u:1,v:0,turn:1}));
assert.equal(api.canPlace('starter',{id:'single-bed',u:3,v:0}),false);
assert.equal(api.canPlace('studio',{id:'wood-chair',u:6,v:6}),false);
assert.equal(api.canPlace('starter',{id:'wall-shelf',u:2,v:2}),false);
assert.ok(api.canPlace('starter',{id:'wall-shelf',u:0,v:2}));
assert.ok(api.upgradeAllowed('starter','side',[bed,chair]));
assert.ok(api.upgradeAllowed('side','studio',[bed,chair]));
assert.equal(api.upgradeAllowed('starter','studio',[bed]),false);
assert.equal(api.upgradeAllowed('starter','side',[bed,{id:'wood-chair',u:0,v:0}]),false);
assert.equal(api.canPlace('starter',{id:'unknown',u:0,v:0}),false);
assert.ok(api.anchor('starter',bed).depth>api.anchor('starter',bed).y);
console.log('Modular home asset, projection, placement and upgrade checks passed.');
