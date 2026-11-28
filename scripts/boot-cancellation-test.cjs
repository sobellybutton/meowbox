'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const code=html.slice(html.indexOf('async function fetchText('),html.indexOf('boot().catch('));
function setup(mode){
 const timers=new Set(),requests=[],marks=[],scripts=[],writes=[],meter={value:0,setAttribute(){}},progress={isConnected:true,textContent:''};
 const timer=()=>{const id={};timers.add(id);return id},clear=id=>timers.delete(id);
 const doc={querySelector:()=>progress,getElementById:()=>meter,createElement:()=>({remove(){this.removed=true}}),head:{append(s){scripts.push(s);if(mode==='assembler')Promise.resolve().then(()=>s.onerror?.());else if(mode==='success')Promise.resolve().then(()=>s.onload?.())}},open(){},write(v){writes.push(v)},close(){}};
 const fetch=(path,{signal})=>{
  requests.push({path,signal});
  const count=requests.filter(r=>r.path===path).length;
  if(mode==='source'&&path==='src/engine.js')return Promise.resolve({ok:false,status:404});
  if(mode==='success'){
   if(path==='src/engine.js'&&count===1)return Promise.resolve({ok:false,status:503});
   return Promise.resolve({ok:true,text:async()=>path});
  }
  return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted')),{once:true}));
 };
 const boot=new Function('document','fetch','setTimeout','clearTimeout','AbortController','bootMark','bootRetryable','bootStatus','bootZh','bootTr','assembleMeowBox',code+';return boot')(doc,fetch,timer,clear,AbortController,k=>marks.push(k),s=>s==null||s===408||s===425||s===429||s>=500,()=>'',false,(en)=>en,(shell,files)=>[shell,...files].join('|'));
 return {boot,timers,requests,marks,scripts,writes,meter};
}
async function main(){
 for(const mode of ['source','assembler']){
  const q=setup(mode);
  await assert.rejects(q.boot());
  await Promise.resolve();await Promise.resolve();
  assert.equal(q.requests.length,15,'all source requests started concurrently');
  assert.ok(q.requests.filter(x=>mode==='assembler'||x.path!=='src/engine.js').every(x=>x.signal.aborted),'pending sibling fetches cancelled');
  assert.equal(q.timers.size,0,'no outstanding retry or load timers');
  assert.equal(q.scripts.length,1);assert.equal(q.scripts[0].removed,true);
  assert.equal(q.scripts[0].onload,null);assert.equal(q.scripts[0].onerror,null);
  assert.equal(q.writes.length,0);assert.equal(q.meter.value,0);
 }
 const q=setup('success');await q.boot();
 assert.equal(q.requests.length,16,'one transient retry');
 assert.equal(q.requests.filter(x=>x.path==='src/engine.js').length,2);
 assert.equal(q.meter.value,16);assert.equal(q.writes.length,1);
 assert.equal(q.writes[0].split('|').length,15);
 assert.equal(q.timers.size,0);assert.ok(!q.scripts[0].removed);
 assert.ok(q.marks.includes('sources-ready')&&q.marks.includes('assembled'));
 console.log('Entrance failure cancellation and normal retry passed');
}
main().catch(e=>{console.error(e);process.exitCode=1});
