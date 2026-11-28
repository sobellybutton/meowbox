'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('index.html','utf8');
const block=source.match(/\/\* PAW_BOOT_ART_BEGIN \*\/([\s\S]*?)\/\* PAW_BOOT_ART_END \*\//);
assert(block,'missing first entrance selection');
const pick=new Function(block[1]+';return bootEntranceArt')();
let n=0;
for(const value of [null,'null','0','1','2','3','invalid','']){
 for(const wide of [false,true]){
  const v=pick({getItem:()=>value},wide),ret=['0','1','2','3'].includes(value);
  assert.equal(v.kind,ret?'gate':'station');
  assert.equal(v.path,ret?'assets/visual/painted/worlds/gateway/scene.webp':'assets/visual/painted/recovered/scenes/station_'+(wide?'landscape':'portrait')+'.webp');
  assert(fs.existsSync(v.path),'selected painting missing');n+=3;
 }
}
for(const wide of [false,true]){
 assert.equal(pick({getItem(){throw Error('blocked storage')}},wide).kind,'station');n++;
}
for(const m of source.matchAll(/<script>([\s\S]*?)<\/script>/g)){new Function(m[1]);n++}
assert(source.includes("bootPreload.href=bootEntrance.path")&&source.includes("document.querySelector('.bootGate').src=bootEntrance.path"),'preload and displayed art diverge');n++;
console.log('PASS '+n+' first entrance painting assertions');
