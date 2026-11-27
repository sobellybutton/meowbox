'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const block=source.split('/* PAW_DOCK_ROOT_BEGIN */')[1]?.split('/* PAW_DOCK_ROOT_END */')[0];
assert.ok(block,'dock root helper available');
const choose=new Function(block+';return pawDockRootChoice')();let checks=0;
for(const [flag,key] of [['explore','travel'],['today','today'],['town','town'],['home','home']]){
 const base={open:true,[flag]:true};
 assert.equal(choose(base),key);checks++;
 for(const guard of ['room','activity','talk','transition','entrance','editing','homeOrigin','draft','typing']){
  assert.equal(choose({...base,[guard]:true}),'',key+' '+guard);checks++;
 }
 assert.equal(choose({...base,open:false}),'');checks++;
}
assert.equal(choose({open:true}),'');checks++;
console.log('Dock root ownership: '+checks+' assertions passed');
