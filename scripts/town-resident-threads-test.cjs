const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=s.indexOf('/* PAW_TOWN_THREADS_BEGIN */'),b=s.indexOf('/* PAW_TOWN_THREADS_END */',a);
assert.ok(a>=0&&b>a);
const run=new Function(s.slice(a,b)+';return pawTownResidentThreads')();
const start=Date.parse('2026-11-27T00:00:00+08:00');
for(let d=0;d<10;d++)for(let h=0;h<24;h++){
 const now=start+d*86400000+h*3600000,rows=run(now);
 assert.equal(rows.length,12);assert.equal(new Set(rows.map(r=>r.id)).size,12);
 assert.deepEqual(rows,run(now));
 assert.ok(rows.every((r,i)=>r.date<=now&&(!i||rows[i-1].date>r.date)&&r.thread[0].length===2&&r.thread[1].length===2&&r.thread[2].every(reply=>reply.length===4&&reply.every(Boolean))));
}
for(const h of [8,13,19]){
 const now=start+h*3600000,before=run(now-1),after=run(now);
 assert.equal(after[0].date,now);assert.notEqual(after[0].id,before[0].id);assert.equal(after[1].id,before[0].id);
}
assert.deepEqual(run(NaN),[]);
console.log('Town resident threads: bounded archive, release times and bilingual content checked');
