'use strict';
const assert=require('node:assert/strict'),api=require('../assets/visual/painted/reading-host-framing.js');
let n=0;const ck=(v,m)=>{assert(v,m);n++};
const cells=Array.from({length:12},(_,i)=>({querySelector:()=>({textContent:'Palace '+i}),classList:{contains:k=>k==='lifePalace'&&i===3}}));
const data=api.chartPalaces({querySelectorAll:()=>cells});
ck(data.length===12,'valid');ck(data[3].life,'life');ck(data.map(v=>v.slot).join()==='0,1,2,3,4,7,8,11,12,13,14,15','perimeter');
ck(api.chartPalaces({querySelectorAll:()=>cells.slice(0,11)})===null,'incomplete');
let ops=[];const g=Object.fromEntries(['save','restore','beginPath','rect','clip','fillRect','strokeRect','fillText','arc','stroke'].map(k=>[k,(...a)=>ops.push([k,...a])]));
for(const p of [0,.25,.5,1]){
 ops=[];ck(api.paintChartPalaces(g,data,p),'render');
 ck(ops.find(x=>x[0]==='rect')[4]===p,'reveal');
 ck(ops.filter(x=>x[0]==='fillText').map(x=>x[1]).join()===data.map(x=>x.name).join(),'names');
 ck(ops.filter(x=>x[0]==='fillRect').length===1,'one life');
 ck(ops[0][0]==='save'&&ops.at(-1)[0]==='restore','balanced');
}
const q={};ck(api.parchmentClock(q,0)===0,'begin');
for(let i=1;i<=4;i++)api.parchmentClock(q,i*.1);
const before=q.elapsed;api.parchmentClock(q,1,true);api.parchmentClock(q,20,false);ck(q.elapsed===before,'pause and resume');
ck(api.parchmentClock(q,21,false,true)===1,'reduced');
console.log('PASS '+n+' parchment clock and computed palace surface checks');

const source=require('node:fs').readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_YUE_INK_RUNTIME_BEGIN \*\/([\s\S]*?)\/\* PAW_YUE_INK_RUNTIME_END \*\//)[1];
const state=new Function(block+';return pawYueInkState')();
let calls=0;
const mock={chartPalaces:g=>{calls++;return g.valid?[1]:null},parchmentClock:(c,n,b,r)=>{c.n=n;return r?1:b?0:.5}};
const cache=new WeakMap(),first={valid:true},second={valid:true};
ck(state(cache,first,mock,0,false,false).progress===.5,'initial');
ck(state(cache,first,mock,1,false,true).progress===1&&calls===1,'reuse');
ck(state(cache,second,mock,1,false,false).progress===.5&&calls===2,'new chart');
ck(state(cache,{valid:false},mock,1,false,false)===null,'invalid chart');
ck(state(cache,null,mock,1,false,false)===null,'no chart');
ck(state(cache,first,{},1,false,false)===null,'old library');
console.log('PASS '+n+' combined parchment and runtime cache checks');

const locationBlock=source.match(/\/\* PAW_YUE_PARCHMENT_BEGIN \*\/([\s\S]*?)\/\* PAW_YUE_PARCHMENT_END \*\//)[1];
const locationMode=new Function(locationBlock+';return pawYueLocationMode')();
let locationChecks=0;
for(const place of ['0','1','2','3','4','5','6','7','custom','',null,'99']){
 for(const [values,valid] of [[['8','1.35','103.82'],true],[['5.75','27.7','85.3'],true],[['','1','1'],false],[['8.1','1','1'],false],[['14.25','1','1'],false],[['8','67','1'],false],[['8','1','181'],false],[['8','0','0'],true]]){
  const expected=/^[0-7]$/.test(place||'')&&valid?'preset':'manual';
  assert.equal(locationMode(place,values),expected);locationChecks++
 }
}
console.log('PASS '+locationChecks+' birthplace disclosure mode checks');
