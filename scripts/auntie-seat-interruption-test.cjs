'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const start=source.indexOf('/* PAW_AUNTIE_SEAT_BEGIN */'),end=source.indexOf('/* PAW_FOOD_LIVE_PROPS_BEGIN */',start);
assert.ok(start>=0&&end>start);
const make=new Function('phase','reduced',`
 let t=0,room='fish',activity='hit',state={pawAuntieVisit:{phase,age:0,last:0}},blocked=false,back=0,paint=0,refresh=0;
 const residentReducedMotion={matches:reduced};
 const pawArcadeInputBlocked=()=>blocked;
 let start=()=>{},paperRitualBusy=()=>false,drawActivity=()=>{paint++};
 const backButton={onclick:()=>{back++}},$=()=>backButton;
 const refreshControls=()=>{refresh++},hint=()=>{};
 `+source.slice(start,end)+`
 return {tick:(at,covered)=>{t=at;blocked=covered;drawActivity();return {phase:state.pawAuntieVisit.phase,age:state.pawAuntieVisit.age,back,paint,refresh}},age:n=>{state.pawAuntieVisit.age=n}};
`);
for(const phase of ['arrival','departure'])for(const reduced of [false,true]){
 const q=make(phase,reduced);
 q.age(phase==='arrival'?1.22:1.18);
 for(const at of [1,2,100]){const v=q.tick(at,true);assert.equal(v.phase,phase);assert.equal(v.back,0);assert.equal(v.refresh,0)}
 const v=q.tick(100.01,false);
 assert.equal(v.phase,phase==='arrival'?'seated':'departure');
 assert.equal(v.back,phase==='departure'?1:0);
 assert.equal(v.refresh,phase==='arrival'?1:0);
}
const paused=make('arrival',false);
 paused.tick(0.04,false);
 for(const at of [5,50,500])assert.equal(paused.tick(at,true).age,.04);
 const resumed=paused.tick(500.01,false);
 assert.ok(resumed.age>.04&&resumed.age<.051);
 assert.equal(resumed.phase,'arrival');
console.log('PASS Ah Ma seating lifecycle: 54 source assertions');
