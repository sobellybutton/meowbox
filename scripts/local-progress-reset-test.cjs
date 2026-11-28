'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const reset=new Function(src.split('/* PAW_LOCAL_RESET_BEGIN */')[1].split('/* PAW_LOCAL_RESET_END */')[0]+';return pawLocalReset')();
const prefix='meowbox-preview-';
const base={avatar:'2',playerName:'"Tester"',items:'[]',room:'{}',begun:'true',personality:'1',zh:'true',communitySessionV1:'"shared"'};
function store(failAt=Infinity){
 const m=new Map(Object.entries(base).map(([k,v])=>[prefix+k,v]));m.set('other-app','untouched');let count=0;
 return {m,get length(){return m.size},key:i=>[...m.keys()][i],getItem:k=>m.get(k)??null,removeItem:k=>{if(++count===failAt)throw Error('storage denied');m.delete(k)},setItem:(k,v)=>m.set(k,v)}
}
const a=store();assert.equal(reset(a),true);
assert.deepEqual([...a.m.entries()],[[prefix+'zh','true'],[prefix+'communitySessionV1','"shared"'],['other-app','untouched']]);
assert.equal(reset(a),true);
for(let i=1;i<=6;i++){const s=store(i),before=Object.fromEntries(s.m);assert.equal(reset(s),false);assert.deepEqual(Object.fromEntries(s.m),before)}
assert.equal(reset({get length(){throw Error('denied')}}),false);
assert.ok(src.includes('if(!townSettingsOpen||!townResetArmed)return;'));
assert.ok(src.includes('townResetConfirm.hidden=!townResetArmed;'));
assert.ok(src.includes('if(!townSettingsOpen){townResetArmed=false;townResetFailed=false}'));
assert.ok(src.includes("townResetCancel.onclick=()=>{townResetArmed=false"));
assert.ok(src.includes("if(ok){townResetArmed=false;townResetDo.disabled=true;location.reload()}"));
console.log('PASS 21 scoped reset, rollback and confirmation checks');
