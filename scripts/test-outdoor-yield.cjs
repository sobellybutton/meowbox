'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const h=s.split('/* PAW_OUTDOOR_YIELD_BEGIN */')[1]?.split('/* PAW_OUTDOOR_YIELD_END */')[0];
assert.ok(h,'outdoor yield helper');
const {yieldStep,candidates}=new Function(h+';return {yieldStep:pawOutdoorYield,candidates:pawOutdoorYieldCandidates}')();
const lane=y=>({x:300+y*.15,half:24});let n=0;
function ck(c,m){assert.ok(c,m);n++}
for(let y=10;y<=490;y+=10)for(const pos of [-.5,0,.5])for(const dt of [.25,1,2]){
 const cur={x:lane(y).x+pos*24,y},cs=candidates(y,cur.x,0,500,dt,lane);
 ck(cs.every(v=>v.y>=0&&v.y<=500&&Math.abs(v.x-lane(v.y).x)<=24.001&&Math.hypot(v.x-cur.x,v.y-cur.y)<=dt+.001),'ground and speed');
 for(const d of [-1,1]){
  const other={x:cur.x,y:y+d*30,gap:61},q=yieldStep(cur,cs,[other]);
  ck(q.needed,'needs yield');if(q.point)ck(Math.hypot(q.point.x-other.x,q.point.y-other.y)>30,'moves away');
 }
}
ck(!yieldStep({x:0,y:0},[{x:1,y:1}],[{x:100,y:100,gap:60}]).needed,'not crowded');
ck(yieldStep({x:0,y:0},[{x:0,y:1},{x:0,y:-1}],[{x:0,y:-5,gap:10},{x:0,y:5,gap:10}]).point===null,'no unsafe retreat');
ck(yieldStep({x:0,y:0},[{x:1,y:0}],[{x:-5,y:0,gap:10},{x:11,y:0,gap:11}]).point===null,'cannot enter another gap');
console.log('Outdoor grounded yield: '+n+' assertions passed');
