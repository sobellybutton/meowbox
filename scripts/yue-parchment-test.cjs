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

 // A complete chart is actionable only during its own visible consultation.
const visitChecks=new Function(locationBlock+`
let room,activity,n=0;
for(const goodRoom of [true,false])for(const idle of [true,false])for(const desk of [true,false])for(const visible of [true,false])for(const outConnected of [true,false])for(const gridConnected of [true,false])for(const same of [true,false])for(const full of [true,false]){
 room=goodRoom?'destiny':'tea';activity=idle?null:'other';
 const grid={isConnected:gridConnected,querySelectorAll:()=>Array(full?12:11)};
 const out={isConnected:outConnected,querySelector:()=>same?grid:{}};
 const pane={dataset:{pawYueDesk:desk?'true':''},style:{display:visible?'block':'none'}};
 const actual=pawYueChartVisitActive(pane,out,grid),expected=goodRoom&&idle&&desk&&visible&&outConnected&&gridConnected&&same&&full;
 if(actual!==expected)throw Error('chart visit ownership mismatch');n++;
}
return n`)();
assert.equal(visitChecks,256);
assert.ok(source.includes('if(active())setExpanded(!expanded,true)'),'fold control guarded');
assert.ok(source.includes('if(lastGrid!==grid||!pawYueChartVisitActive(pane,out,grid))return'),'deferred board selection guarded');
console.log('PASS '+visitChecks+' chart visit ownership combinations and 2 runtime wiring assertions');

const foldChecks=new Function(locationBlock+`
let n=0;for(const requested of [true,false,null,undefined])for(const complete of [true,false,null,undefined]){const q=pawYueFoldState(requested,complete);if(q.expanded!==Boolean(requested&&complete)||q.folded!==Boolean(!requested&&complete)||q.expanded&&q.folded)throw Error('fold state');n++}return n`)();
assert.equal(foldChecks,16);
assert.ok(source.includes("out.toggleAttribute('data-paw-yue-folded',next.folded)"));
assert.ok(source.includes("const focusSurface=expanded?lastGrid:toolbar"));
assert.ok(source.includes('destiny-study-props.webp'));
console.log('PASS '+foldChecks+' folded chart state checks plus 3 wiring assertions');

const blocked=new Function(block+';return pawYueInkBlocked')();
let blockedCount=0;
for(const fold of [false,true])for(const hidden of [false,true])for(const cover of [false,true])for(const transition of [false,true]){
 assert.equal(blocked(fold,hidden,cover,transition),fold||hidden||cover||transition);
 blockedCount++;
}
const foldedClock={};api.parchmentClock(foldedClock,0);api.parchmentClock(foldedClock,.1);
const ink=foldedClock.elapsed;
for(let i=1;i<20;i++)assert.equal(api.parchmentClock(foldedClock,i,blocked(true,false,false,false),i%2===0),ink/.72);
assert.equal(api.parchmentClock(foldedClock,20,blocked(false,false,false,false),false),ink/.72);
assert.ok(source.includes("desk&&!folded,result"));
assert.ok(source.includes("!folded&&phase==='result'&&ink"));
console.log('PASS '+(blockedCount+20)+' fold pause checks plus 2 wiring assertions');
