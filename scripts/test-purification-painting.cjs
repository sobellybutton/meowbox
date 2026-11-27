'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const block=src.split('/* PAW_PURIFICATION_PAINT_BEGIN */')[1].split('/* PAW_PURIFICATION_PAINT_END */')[0];
const api=new Function(block+';return {pawWaterGeometry,pawWaterDestination,pawWaterDropMatches,pawWaterProgress,pawWaterCamera,pawWaterPlate}')();
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
 assert.ok(a.s*p.w<=w+.001&&a.s*p.h<=h+.001);
 for(const q of Object.values(g))assert.ok(a.ox+q.x*a.s>=0&&a.ox+q.x*a.s<=w&&a.oy+q.y*a.s>=0&&a.oy+q.y*a.s<=h);
}
assert.ok(!api.pawWaterProgress({waterStage:2,waterAt:5},7,true));
assert.ok(!api.pawWaterProgress({waterStage:2,waterAt:5},6.99,false));
assert.ok(api.pawWaterProgress({waterStage:2,waterAt:5},7,false));
assert.ok(!api.pawWaterProgress({waterStage:3,waterAt:5},10,false));
console.log('Purification painting geometry and ritual phase checks passed.');
