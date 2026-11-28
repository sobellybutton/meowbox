'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8');
const a=s.indexOf('/* PAW_PORTRAIT_DOCK_CAMERA_BEGIN */'),z=s.indexOf('/* PAW_PORTRAIT_DOCK_CAMERA_END */');
assert.ok(a>=0&&z>a);
const fn=new Function(s.slice(a,z)+';return pawPortraitDockOffset')();
let n=0;
for(const H of [568,640,844,932,1024,900])for(const W of [320,360,390,430,768,1440]){
 const scale=W<H?Math.max(W/1000,H/1777):Math.min(W/1000,H/1777);
 for(let foot=461;foot<=1685;foot+=9){
  const oy=(H-1777*scale)/2,dock=H-70,v=fn(H,1777,scale,oy,foot,dock);
  assert.ok(v<=oy+1e-8,'only move camera up');
  assert.ok(v+1777*scale>=Math.min(dock,oy+1777*scale)-1e-8,'do not uncover artwork above dock');
  if(foot*scale+oy<=dock-10)assert.equal(v,oy,'no unnecessary camera movement');
  else assert.ok(foot*scale+v<=Math.max(dock-10,foot*scale+oy-Math.max(0,1777*scale+oy-dock))+1e-8,'keep feet clear when physically possible');
  n++;
 }
}
assert.equal(fn(640,1777,640/1777,0,1640,570)+1640*640/1777,560);
assert.equal(fn(640,1777,.36,0,1640,Infinity),0,'hidden dock');
assert.ok(s.includes('oy=pawPortraitDockOffset(H,worldH,scale,oy,p.y,pawReadPortraitDockTop())'),'effective map camera uses policy');
console.log('PASS '+n+' portrait dock camera cases');
