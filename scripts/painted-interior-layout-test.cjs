'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('../assets/visual/painted/interior-layouts.js');
for(const [id,q] of Object.entries(api.rooms)){
 const bytes=fs.readFileSync(path.resolve(__dirname,'..',api.asset(id)));
 assert.equal(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),q.blob,'exact reviewed artwork '+id);
 const goals=[q.entry,q.arrival,...Object.values(q.stations).map(v=>v.approach)];
 for(const p of [...goals,q.host,...q.visitors])assert.ok(api.safe(id,p),id+' unsafe '+p);
 for(const a of goals)for(const b of goals){const route=api.route(id,a,b);assert.ok(route,id+' disconnected '+a+' '+b);let prev=a;for(const next of route){assert.ok(api.segment(id,prev,next));prev=next}assert.deepEqual(prev,b)}
 for(const [w,h] of [[360,780],[390,844],[430,932],[768,1024],[1280,720]]){
  const c=api.camera(w,h);assert.ok(c.s>0);
  for(const p of goals){const [x,y]=api.project(p,c);assert.ok(x>=0&&x<=w&&y>=0&&y<=h,id+' crop '+p)}
  if(w<h)assert.ok(c.w>=w-1e-8&&c.h>=h-1e-8&&c.oy<=1e-8&&c.oy+c.h>=h-1e-8);
 }
 assert.equal(api.route(id,[0,0],q.entry),null);
}
assert.equal(api.asset('__proto__'),null);assert.equal(api.camera(0,844),null);
console.log('Seven painted-room artwork hashes, connected safe lanes and camera checks passed.');
