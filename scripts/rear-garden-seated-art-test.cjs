'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const api=new Function(source.split('/* PAW_REAR_SEATED_ART_BEGIN */')[1].split('/* PAW_REAR_SEATED_ART_END */')[0]+';return {pawRearSeatedBox,pawRearSeatedRecords}')();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/visual/staging/2026-11-27-extracted/manifest.json'),'utf8'));
const records=Object.values(manifest).find(x=>Array.isArray(x)&&x.some(y=>y.path?.endsWith('/seated.webp')));
let n=0;
for(let id=0;id<4;id++){
 const r=api.pawRearSeatedRecords[id],m=records.find(x=>x.path.endsWith('/players/'+id+'/seated.webp'));
 assert.equal(r.w,m.width);assert.equal(r.h,m.height);n+=2;
 assert(fs.existsSync(path.join(root,m.path)));n++;
 for(const scale of [1.35,1.72,2.25])for(const hip of [{x:200,y:320},{x:410,y:580}]){
  const b=api.pawRearSeatedBox(id,hip,scale);
  assert(Math.abs(b.x+b.w-b.hipX-hip.x)<1e-8);
  assert(Math.abs(b.y+b.hipY-hip.y)<1e-8);
  assert(Math.abs(b.w/b.h-r.w/r.h)<1e-8);
  assert(b.y+b.h>hip.y&&b.h<94*scale);n+=4;
 }
}
assert.equal(api.pawRearSeatedBox(99,{x:0,y:0},1),null);
assert.equal(api.pawRearSeatedBox(0,{x:0,y:0},0),null);
assert(source.includes('pawDrawRearSeated(im,id,a.hip,scale)'));
assert(source.includes('delete run.pawRearSeatArt'));
console.log('PASS '+(n+4)+' seat artwork identity, hip contact and visible leg geometry checks');
