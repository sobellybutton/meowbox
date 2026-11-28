'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const code=src.split('/* PAW_TEMPLE_OWNER_CONTACT_BEGIN */')[1].split('/* PAW_TEMPLE_OWNER_CONTACT_END */')[0];
const lighting=new Function(code+';return pawIncenseLighting')();
let n=0;
for(const hand of [{x:200,y:400},{x:500,y:250}])for(const flame of [{x:300,y:300},{x:580,y:425}]){
 let prev=null;
 for(let i=0;i<=1650;i++){
  const age=i/1000,p=lighting(hand,flame,age);
  assert.ok(Number.isFinite(p.grip.x+p.grip.y+p.angle)&&p.reach>=0&&p.reach<=1);
  if(age>=.65&&age<=1.05)assert.ok(Math.hypot(p.grip.x+39*Math.sin(p.angle)-flame.x,p.grip.y-39*Math.cos(p.angle)-flame.y)<1e-7);
  if(i===0||i===1650)assert.ok(Math.hypot(p.grip.x-hand.x,p.grip.y-hand.y)<1e-7);
  if(prev)assert.ok(Math.hypot(p.grip.x-prev.grip.x,p.grip.y-prev.grip.y)<2);
  prev=p;n++;
 }
}
assert.ok(src.includes("pawIncenseLighting(hand,supply.flame,age)"));
assert.ok(src.includes("const lightAngle=lighting.angle"));
console.log('PASS '+n+' incense flame contact and continuous return frames');
