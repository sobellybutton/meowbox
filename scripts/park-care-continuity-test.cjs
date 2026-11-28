'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.resolve(__dirname,'../src/extensions.js'),'utf8');
const begin=src.indexOf('let pawCareSleep=null;'),end=src.indexOf('const parkCareStartBefore=start;',begin);
assert.ok(begin>=0&&end>begin);
const body=src.slice(begin,end);
function fixture(phase,assisted=true){
 const a={phase,assisted,x:400,y:535,at:0,stroke:0,drag:null,fromX:400,fromY:535};
 const state={care:a},document={hidden:false,addEventListener(){}},completed=[],released=[];
 const api=new Function('state','document','c','clamp','poseEase','careComplete','careSync',
 'let t=0,activity="pet";'+body+';return {tick(v){t=v;careTick()},hide(v){t=v;document.hidden=true;pawCareVisibility(true,v)},show(v){t=v;document.hidden=false;pawCareVisibility(false,v)}}')
 (state,document,{hasPointerCapture:()=>true,releasePointerCapture:id=>released.push(id)},(v,min,max)=>Math.min(max,Math.max(min,v)),v=>v*v*(3-2*v),p=>{completed.push(p);a.phase='return';a.assisted=false;a.returnFromX=a.x;a.returnFromY=a.y;a.returnAt=a.tickAt},()=>{});
 return {a,api,completed,released};
}
let checks=0;const ck=(v,msg)=>{assert.ok(v,msg);checks++};
for(const [phase,duration] of [['pet',2.3],['play',3.2],['feed',3.101],['water',3.101],['rest',4.501]]){
 const {a,api,completed}=fixture(phase);
 api.tick(0);api.tick(1);api.hide(1);api.tick(61);
 ck(completed.length===0,'hidden activity cannot complete');
 api.show(61);api.tick(60+duration-.01);ck(completed.length===0,'no early completion after return');
 api.tick(60+duration+.01);ck(completed.length===1&&completed[0]===phase,'complete only after enough visible time');
 api.tick(60+duration+.9);ck(a.phase==='idle','natural return to idle');ck(completed.length===1,'no duplicate completion');
}
for(const phase of ['pet','play','idle']){
 const {a,api,completed,released}=fixture(phase,false);a.drag={id:17,x:320,y:515};a.stroke=100;a.x=350;
 api.hide(1);ck(a.drag===null&&a.stroke===0,'gesture cancelled');ck(released[0]===17,'capture released');
 ck(a.phase===(phase==='idle'?'idle':'return'),'safe phase');api.show(11);api.tick(12);
 ck(a.phase==='idle'&&completed.length===0,'no accidental reward after interrupted touch');
}
assert.ok(!src.includes("setTimeout(()=>{if(state===run&&careIsActive()&&a.phase===key)careComplete(key)"),'no independent wall-clock completion');
console.log('PASS '+checks+' park care continuity checks.');
