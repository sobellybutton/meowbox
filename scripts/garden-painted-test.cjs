'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const s=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const extract=(a,b)=>{const start=s.indexOf(a),end=s.indexOf(b,start);assert.ok(start>=0&&end>start);return s.slice(start,end)};
const block=extract('/* PAW_PAINTED_GARDEN_BEGIN */','/* PAW_PAINTED_GARDEN_END */');
const walk=extract('/* PAW_GARDEN_WALK_BEGIN */','/* PAW_GARDEN_WALK_END */');
const api=new Function(block+walk+';return {pawRearGardenPlate,pawRearGardenNodes,pawRearGardenEdges,pawRearGardenTargets,pawRearGardenRoute,pawRearGardenPellet,pawGardenWalkTick}')();
const {pawRearGardenPlate:p,pawRearGardenNodes:n,pawRearGardenEdges:e,pawRearGardenTargets:t,pawRearGardenRoute:route,pawRearGardenPellet:pellet,pawGardenWalkTick:tick}=api;
assert.ok(fs.existsSync(path.resolve(__dirname,'../assets/visual/staging/2026-11-27/rooms/temple/garden.webp')));
assert.equal(p.h/p.w,1631/960);
for(const [key,point] of Object.entries(n))for(const action of Object.keys(t)){
 const steps=route(point,action);assert.ok(steps.length);assert.deepEqual(steps.at(-1),n[action]);
 let last=key;for(const v of steps){const next=Object.keys(n).find(k=>n[k][0]===v[0]&&n[k][1]===v[1]);assert.ok(next);assert.ok(next===last||e.some(([a,b])=>a===last&&b===next||a===next&&b===last));last=next}
 const q={painted:true,pos:point.slice(),route:steps.map(v=>v.slice()),action,last:0};let found=null;
 for(let i=1;i<1000&&!found;i++)found=tick(q,i*.05,false);
 assert.equal(found,action);assert.deepEqual(q.pos,n[action]);assert.equal(q.route.length,0);assert.equal(tick(q,51,false),null);
}
assert.equal(route([.1,.1],'feed'),null);assert.equal(route(n.entry,'__proto__'),null);
const paused={painted:true,pos:n.entry.slice(),route:route(n.entry,'feed'),action:'feed',last:0};
tick(paused,1,true);assert.deepEqual(paused.pos,n.entry);
for(let i=0;i<5;i++)for(let age=.01;age<.9;age+=.02){const pt=pellet(i,age);if(pt){assert.ok(pt[0]>=.31&&pt[0]<=.53);assert.ok(pt[1]>.55&&pt[1]<.65)}}
for(const [u,v,w,h] of Object.values(t))assert.ok(u-w/2>=0&&u+w/2<=1&&v-h/2>=0&&v+h/2<=1);
console.log('Painted garden route, contact targets, pause and feeding geometry passed.');
