'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const block=src.split('/* PAW_PURIFICATION_PAINT_BEGIN */')[1].split('/* PAW_PURIFICATION_PAINT_END */')[0];
const api=new Function(block+';return {pawWaterGeometry,pawWaterDestination,pawWaterDropMatches,pawWaterProgress,pawWaterCamera,pawWaterPlate,pawWaterHitBox,pawWaterGripPoint}')();
const g=api.pawWaterGeometry(),p=api.pawWaterPlate;
assert.ok(fs.existsSync(path.join(root,'assets/visual/staging/2026-11-27/rooms/temple/purification.webp')));
for(const stage of [0,1]){
 const d=api.pawWaterDestination(stage,g);
 assert.ok(api.pawWaterDropMatches(stage,d.x,d.y,g));
 assert.ok(!api.pawWaterDropMatches(stage,d.x+26,d.y,g));
 assert.ok(!api.pawWaterDropMatches(stage,NaN,d.y,g));
}
assert.ok(!api.pawWaterDropMatches(2,g.pour.x,g.pour.y,g));
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1280,720],[1920,1080]]){
 const a=api.pawWaterCamera(w,h);
 const box=api.pawWaterHitBox(g.rest,a.s);
 assert.ok(box.w*a.s>=44-1e-8&&box.h*a.s>=44-1e-8);
 assert.equal(box.x+box.w/2,g.rest.x);
 assert.equal(box.y+box.h/2,g.rest.y);
 for(const [dx,dy] of [[0,0],[10,-8],[-12,9]]){
  const q=api.pawWaterGripPoint({x:g.scoop.x+dx,y:g.scoop.y+dy},{id:'templeLadle',h:box,sx:g.rest.x+dx,sy:g.rest.y+dy});
  assert.ok(api.pawWaterDropMatches(0,q.x,q.y,g));
 }
 assert.ok(a.s*p.w<=w+.001&&a.s*p.h<=h+.001);
 for(const q of Object.values(g))assert.ok(a.ox+q.x*a.s>=0&&a.ox+q.x*a.s<=w&&a.oy+q.y*a.s>=0&&a.oy+q.y*a.s<=h);
}
assert.ok(!api.pawWaterProgress({waterStage:2,waterAt:5},7,true));
assert.ok(!api.pawWaterProgress({waterStage:2,waterAt:5},6.99,false));
assert.ok(api.pawWaterProgress({waterStage:2,waterAt:5},7,false));
assert.ok(!api.pawWaterProgress({waterStage:3,waterAt:5},10,false));
console.log('Purification painting geometry and ritual phase checks passed.');
