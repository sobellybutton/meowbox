'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const h=s.split('/* PAW_ASSIST_OWNERSHIP_BEGIN */')[1]?.split('/* PAW_ASSIST_OWNERSHIP_END */')[0];
assert.ok(h);const allow=new Function(h+';return pawAssistActionAllowed')();
const run={},spec={key:'bell-ready',action:'bell'};
for(let bits=0;bits<128;bits++){
 const [same,kind,key,act,enabled,open,connected]=Array.from({length:7},(_,i)=>!!(bits&(1<<i)));
 assert.equal(allow(run,same?run:{},'templeBell',kind?'templeBell':'moon',key?'bell-ready':'other',act?'bell':'moon',{...spec,disabled:!enabled},!open,connected),bits===127,'guard combination '+bits)
}
assert.equal(allow(run,run,'moon','moon','moon-busy',null,null,false,true),false);
console.log('Accessible activity control ownership PASS');
