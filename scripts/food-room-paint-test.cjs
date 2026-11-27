'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const a=s.indexOf('/* PAW_FOOD_PAINT_BEGIN */'),b=s.indexOf('/* PAW_FOOD_PAINT_END */',a);
assert.ok(a>=0&&b>a);
const {pawFoodRoomSpecs:rooms,pawFoodPlate:p,pawFoodSafe:safe,pawFoodCamera:camera,pawFoodRoomAsset:asset}=new Function(s.slice(a,b)+';return {pawFoodRoomSpecs,pawFoodPlate,pawFoodSafe,pawFoodCamera,pawFoodRoomAsset}')();
for(const [id,q] of Object.entries(rooms)){
 assert.ok(fs.existsSync(path.resolve(__dirname,'../assets/visual/painted/recovered',asset(id))));
 for(const pos of [q.entry,q.arrival,q.anchor.slice(2),q.resident,...q.visitors])assert.ok(safe(id,...pos));
 for(const [a,b] of [[q.entry,q.arrival],[q.arrival,q.anchor.slice(2)],[q.anchor.slice(2),q.entry]])for(let i=0;i<=100;i++){const f=i/100;assert.ok(safe(id,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f))}
 for(const [w,h] of [[320,568],[390,844],[768,1024],[1280,720],[844,390],[1920,1080]]){
  const c=camera(w,h);assert.ok(c.s>0);
  for(const pos of [q.entry,q.arrival,q.anchor.slice(2),q.resident,[q.anchor[0],q.labelY]]){
   const [x,y]=[pos[0]*c.s+c.ox,pos[1]*c.s+c.oy];assert.ok(x>=0&&x<=w&&y>=0&&y<=h)
  }
 }
 assert.equal(safe(id,100,650),false);assert.equal(safe(id,700,650),false);assert.equal(safe(id,400,450),false);
}
assert.equal(asset('__proto__'),null);assert.equal(camera(0,100),null);
console.log('Food shop painted paths, resident feet, counter approach and camera checks passed.');
