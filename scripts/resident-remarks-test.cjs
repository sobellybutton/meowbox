'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),api=require('../src/resident-remarks.js');
const src=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const marker=src.match(/const pawAmbientLines=(\{[\s\S]*?\});\s*const pawAmbientKey/);
assert.ok(marker);
const current=new Function('return '+marker[1])(),original=JSON.parse(JSON.stringify(current));
assert.equal(api.merge(current),96);
assert.equal(api.merge(current),0);
for(const id of api.profiles){
 assert.ok(original[id]);
 assert.deepEqual(current[id].slice(0,original[id].length),original[id]);
 const added=current[id].slice(original[id].length);
 assert.equal(added.length,6);
 assert.equal(new Set(current[id].map(r=>r[0])).size,current[id].length);
 assert.equal(new Set(added.map(r=>r[1])).size,6);
 assert.equal(new Set(added.map(r=>r[2])).size,6);
 for(const [key,en,cn] of added){
  assert.ok(key.startsWith('v2:')&&en.length<=110&&cn.length<=46&&/[一-鿿]/.test(cn));
  assert.ok(!original[id].some(r=>r[1]===en||r[2]===cn));
 }
}
assert.equal(api.merge({unknown:[]}),0);
console.log('Resident bilingual content, stable keys and idempotent merge passed');
