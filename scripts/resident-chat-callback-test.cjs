const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const part=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);assert.ok(i>=0&&j>i);return s.slice(i,j)};
const a=new Function(part('/* PAW_RESIDENT_CHAT_MEMORY_BEGIN */','/* PAW_RESIDENT_CHAT_MEMORY_END */')+part('const pawResidentChatCallbacks=','function residentRecipeValid')+';return {pawResidentChatDate,pawResidentChatRow,pawResidentChatAdvance,pawResidentChatReply,pawResidentChatCallbacks,pawResidentChatLater}')();
for(const day of ['2024-02-29','2026-11-28','2000-02-29'])assert.ok(a.pawResidentChatDate(day));
for(const day of ['2026-02-29','2026-02-31','2026-04-31','2026-13-01','bad',null])assert.ok(!a.pawResidentChatDate(day));
assert.deepEqual(Object.keys(a.pawResidentChatCallbacks).sort(),Object.keys(a.pawResidentChatLater).sort());
for(const id of Object.keys(a.pawResidentChatCallbacks)){
 const first=a.pawResidentChatAdvance(null,'2026-11-26'),second=a.pawResidentChatAdvance(first.row,'2026-11-27'),third=a.pawResidentChatAdvance(second.row,'2026-11-28');
 assert.equal(a.pawResidentChatReply(id,first),null);
 for(const memory of [second,third])assert.ok(a.pawResidentChatReply(id,memory).every(v=>typeof v==='string'&&v.trim()));
 assert.notEqual(a.pawResidentChatReply(id,second)[0],a.pawResidentChatReply(id,third)[0]);
 assert.notEqual(a.pawResidentChatReply(id,second)[1],a.pawResidentChatReply(id,third)[1]);
 for(const day of ['2026-11-28','2026-11-27'])assert.equal(a.pawResidentChatReply(id,a.pawResidentChatAdvance(third.row,day)),null);
}
assert.equal(a.pawResidentChatRow({days:2,last:'2026-02-31'}),null);
assert.equal(a.pawResidentChatReply('__proto__',{returning:true,row:{days:2}}),null);
console.log('Resident callback rotation and calendar validation passed');
