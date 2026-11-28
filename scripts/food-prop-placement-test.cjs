'use strict';
const assert=require('node:assert/strict'),api=require('../assets/visual/painted/food-props/placement.js'),manifest=require('../assets/visual/painted/food-props/manifest.json');
let n=0;
const ck=(v,m)=>{assert(v,m);n++};
const near=(a,b)=>Math.abs(a-b)<1e-8;
for(const [id,v] of Object.entries(manifest.assets)){
 const a=api.record(manifest,id);
 ck(a&&a.path.endsWith('/'+v.file),id+' record');
 for(const height of [28,64,120])for(const [x,y] of [[180,200],[420,530]]){
  const g=api.geometry(manifest,id,x,y,height);
  const [l,t,r,b]=a.bounds;
  ck(near(g.visibleAABB[3],y),id+' visible base at counter');
  ck(near((g.visibleAABB[0]+g.visibleAABB[2])/2,x),id+' centred on counter');
  ck(near(g.visibleAABB[3]-g.visibleAABB[1],height),id+' visible height');
  ck(near(g.draw[2]/g.draw[3],a.size[0]/a.size[1]),id+' no stretching');
  const point=g.point(...a.ground);ck(near(point[0],x)&&near(point[1],y),id+' fixed anchor');
  const grip=[(l+r)/2,(t+b)/2],rot=api.geometry(manifest,id,x,y,height,{anchor:grip,angle:Math.PI/3});
  const pivot=rot.point(...grip);ck(near(pivot[0],x)&&near(pivot[1],y),id+' explicit moving pivot stays fixed');
 }
}
const id='boba_cup_empty',a=api.record(manifest,id);
ck(!api.geometry(manifest,'../bad',0,0,50),'unknown source');
ck(!api.geometry(manifest,id,NaN,0,50),'invalid position');
ck(!api.geometry(manifest,id,0,0,0),'zero height');
ck(!api.geometry(manifest,id,0,0,50,{anchor:[-1,0]}),'invalid grip');
ck(!api.geometry(manifest,id,0,0,50,{angle:NaN}),'invalid rotation');
const calls=[],ctx=Object.fromEntries(['save','restore','translate','rotate','drawImage'].map(k=>[k,(...args)=>calls.push([k,...args])]));
const pending={complete:false,naturalWidth:0,naturalHeight:0},g=api.geometry(manifest,id,100,200,40);
ck(!api.draw(ctx,pending,g)&&calls.length===0,'never paint pending image');
ck(!api.draw(ctx,{complete:true,naturalWidth:1,naturalHeight:1},g),'reject wrong source dimensions');
let requests=0;
const registry=api.create(manifest,()=>{requests++;return pending});
ck(requests===0,'no eager preload');
ck(registry.request([id,id,'invalid']).length===1&&requests===1,'bounded deduplicated room request');
ck(!registry.paint(ctx,id,100,200,40)&&requests===1,'reuse pending asset');
Object.assign(pending,{complete:true,naturalWidth:a.size[0],naturalHeight:a.size[1]});
ck(registry.paint(ctx,id,100,200,40),'draw after ready');
ck(calls.map(v=>v[0]).join(',')==='save,translate,rotate,drawImage,restore','balanced canvas state');
ck(registry.forget(id)&&registry.image(id)===pending&&requests===2,'explicit retry');
registry.clear();registry.image(id);ck(requests===3,'release room cache');
console.log('PASS '+n+' painted food prop placement, readiness and source checks');
