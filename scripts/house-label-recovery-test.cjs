const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/release-fixes.js'),'utf8');
const block=source.split('/* PAW_HOUSE_LABEL_RECOVERY_BEGIN */')[1]?.split('/* PAW_HOUSE_LABEL_RECOVERY_END */')[0];
assert.ok(block,'house label recovery block exists');
let cases=0;
for(const initial of [true,false,null,undefined,'true',0])for(const fail of [true,false]){
 const run=new Function('initial','fail',`
 let quiet9=initial,queued=[],writes=[],quietRemoved=0,mapRemoved=0,hudRemoved=0,settingsSynced=0,signsSynced=0;
 const signRoot={classList:{remove(k){if(k!=='quiet')throw Error(k);quietRemoved++}}};
 const save=(k,v)=>{writes.push([k,v]);if(fail)throw Error('storage denied')};
 const townMapLabels={remove(){mapRemoved++}};
 const $=id=>{if(id!=='quietToggle')throw Error(id);return {remove(){hudRemoved++}}};
 const queueMicrotask=fn=>queued.push(fn);
 const syncTownSettings=()=>settingsSynced++;
 const syncSigns=()=>signsSynced++;
 `+block+`
 const before=quiet9;
 queued.forEach(fn=>fn());
 return {before,quiet9,writes,quietRemoved,mapRemoved,hudRemoved,settingsSynced,signsSynced};
 `);
 const result=run(initial,fail);
 assert.deepEqual(result,{before:false,quiet9:false,writes:initial?[['quiet9',false]]:[],quietRemoved:2,mapRemoved:1,hudRemoved:1,settingsSynced:1,signsSynced:1});
 cases++;
}
console.log('House label recovery: '+cases+' saved preference and storage failure scenarios passed.');
