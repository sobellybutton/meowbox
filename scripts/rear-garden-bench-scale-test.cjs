'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('function pawRearBenchPose'),b=src.indexOf('const pawRearCatFigurines=',a);
assert.ok(a>=0&&b>a);
const api=new Function('const pawRearGardenNodes={seat:[.78,.60]};'+src.slice(a,b)+';return {pawRearBenchPose,pawRearGardenActorScale,pawRearGardenSeatAmount,pawRearGardenAtBench}')();
const p={x:100,y:-145,w:600,h:600*1631/960},scale=api.pawRearGardenActorScale(p),pose=api.pawRearBenchPose(p,scale);
assert.ok(scale>=1.35&&scale<=2.25);
assert.ok(Math.abs(pose.y-(p.y+p.h*.60))<1e-8);
assert.ok(Math.abs(pose.y-32*scale-pose.hip.y)<1e-8);
assert.ok(Math.abs(pose.x+9*scale-pose.hip.x)<1e-8);
const at={pos:[.78,.60],route:[]};
assert.ok(api.pawRearGardenAtBench(at));
assert.ok(!api.pawRearGardenAtBench({...at,route:[[.6,.48]]}));
assert.ok(!api.pawRearGardenAtBench({pos:[.6,.48],route:[]}));
let prior=0;
for(let i=0;i<=100;i++){
 const now=10+i*.0045;
 const sitting=api.pawRearGardenSeatAmount({gardenSeatAt:10,gardenSitting:true},now,false,true);
 const rising=api.pawRearGardenSeatAmount({gardenSeatAt:10,gardenSitting:false},now,false,true);
 assert.ok(Math.abs(sitting+rising-1)<1e-8&&sitting>=prior&&sitting<=1);prior=sitting;
 assert.equal(api.pawRearGardenSeatAmount({gardenSeatAt:10,gardenSitting:true},now,false,false),0);
}
assert.equal(api.pawRearGardenSeatAmount({gardenSeatAt:10,gardenSitting:true},10,true,true),1);
assert.equal(api.pawRearGardenSeatAmount({gardenSeatAt:10,gardenSitting:false},10,true,true),0);
assert.equal(api.pawRearGardenSeatAmount({gardenSeatAt:-100,gardenSitting:false},10,false,true),0);
const c=src.indexOf('pawGardenChoose=function(run,kind)',b),d=src.indexOf('// Deform a small region',c);
assert.ok(c>b&&d>c);
const targets=src.slice(src.indexOf('const pawRearGardenTargets='),src.indexOf('function pawRearGardenRoute('));
assert.ok(targets.startsWith('const pawRearGardenTargets=')&&!targets.includes('cats:'));
const make=new Function(targets+src.slice(a,b)+`
const pawRearGardenNodes={seat:[.78,.60]},state={pawRearGarden:true,gardenSeatAt:0,gardenSitting:true,pawGardenWalk:{pos:[.78,.60],route:[]}};
let t=1,blocked=false,room='temple',activity='secretGarden',calls=[];
const residentReducedMotion={matches:false},pawRearGardenActive=()=>true,pawArcadeInputBlocked=()=>blocked;
let pawGardenChoose=()=>{},pawRearGardenChooseBefore=()=>{};
const gardenSeat=()=>{if(t-state.gardenSeatAt>=.75){state.gardenSeatAt=t;state.gardenSitting=!state.gardenSitting}};
const pawGardenRoute=(q,kind)=>{calls.push(kind);return true},hint=()=>{};
`+src.slice(c,d)+`
return {state,calls,set:(time,stop=false,reduced=false)=>{t=time;blocked=stop;residentReducedMotion.matches=reduced},choose:kind=>pawGardenChoose(state,kind)};
`)();
make.choose('feed');
assert.equal(make.state.gardenSitting,false);
assert.equal(make.state.pawGardenWalk.pawAfterStand,'feed');
assert.equal(make.calls.length,0);
make.set(1.2);make.choose('cats');assert.equal(make.state.pawGardenWalk.pawAfterStand,'feed');assert.equal(make.calls.length,0);
make.set(1.5);make.choose('feed');assert.deepEqual(make.calls,['feed']);assert.equal(make.state.pawGardenWalk.pawAfterStand,undefined);
assert.ok(src.includes('scale=pawRearGardenActorScale(p)'));
assert.ok(src.includes('delete q.pawAfterStand;pawGardenChoose(run,next)'));
console.log('Rear garden bench scale, 101 pose pairs, and deferred route checks passed');
