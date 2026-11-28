'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/release-fixes.js'),'utf8');
const a=source.indexOf('/* PAW_DEER_ACTIVE_CLOCK_BEGIN */'),b=source.indexOf('/* PAW_DEER_ACTIVE_CLOCK_END */');
assert.ok(a>=0&&b>a);
const api=new Function(source.slice(a,b)+';return {pawDeerAdvanceClock,pawDeerControlCurrent};')();
for(const phase of ['bow','feed','watch']){
 let q={deerPhase:phase,deerAt:0};
 for(const [now,blocked,age] of [[.02,false,.02],[.04,false,.04],[10,true,.04],[11,true,.04],[12,false,.04],[12.016,false,.056],[30,false,.106]]){
  assert.ok(api.pawDeerAdvanceClock(q,now,blocked));assert.ok(Math.abs(now-q.deerAt-age)<1e-8)
 }
 q.deerPhase='ready';assert.equal(api.pawDeerAdvanceClock(q,31,false),false);assert.equal(q.pawDeerClock,undefined);
}
const base={run:{},profile:{},phase:'greet',room:'park',activity:'deerVisit'};
for(const action of ['bow','feed','watch','other'])for(const phase of ['greet','ready','done','feed'])for(const blocked of [true,false]){
 const q={...base,phase};assert.equal(api.pawDeerControlCurrent(base,q,action,blocked),!blocked&&phase==='greet'&&action!=='other');
}
for(const delta of [{run:{}},{profile:{}},{room:'tea'},{activity:'pet'}])assert.equal(api.pawDeerControlCurrent(base,{...base,...delta},'bow',false),false);
console.log('Deer active-time and stale controls passed.');
