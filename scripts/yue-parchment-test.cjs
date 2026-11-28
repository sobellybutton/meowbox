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
