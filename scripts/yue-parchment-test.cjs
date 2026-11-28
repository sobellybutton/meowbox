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
// The visibilitychange listener can run with reduced motion enabled.
const hidden={};ck(api.parchmentClock(hidden,1,true,true)===0,'hidden first frame does not reveal');
ck(api.parchmentClock(hidden,60,true,true)===0,'hidden clock stays paused');
ck(api.parchmentClock(hidden,61,false,true)===1,'reduced motion reveals when visible');
const partial={};api.parchmentClock(partial,0);
for(let i=1;i<=3;i++)api.parchmentClock(partial,i/10);
const held=partial.elapsed;
for(let i=1;i<=100;i++)ck(api.parchmentClock(partial,1+i,true,i%2===0)===held/.72,'hidden setting changes do not consume ink');
ck(api.parchmentClock(partial,102,false,false)===held/.72,'resume keeps previous ink');
ck(api.parchmentClock(partial,101,false,false)===held/.72&&partial.last===102,'stale frame ignored');
ck(api.parchmentClock(partial,102,false,false)===held/.72,'no duplicated elapsed time');
ck(api.parchmentClock(partial,103,false,true)===1,'visible reduced motion completes');
ck(api.parchmentClock(partial,104,false,false)===1,'completed ink does not rewind');
for(const invalid of [NaN,Infinity,-1]){const q={elapsed:invalid};ck(api.parchmentClock(q,0)===0,'invalid elapsed normalized')}
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
