const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const source=fs.readFileSync('src/startup.js','utf8'),b=source.indexOf('/* MBART_VALIDATION_BEGIN'),e=source.indexOf('/* MBART_VALIDATION_END */',b);
const m=new Function(source.slice(b,e)+'\nreturn mbArtValidate')()(JSON.parse(fs.readFileSync('assets/visual/painted/action-runtime.json','utf8')));
for(const id of [0,1,2]){const p=m.players[id].strike;assert(p);assert.equal(Object.keys(p).length,5);for(const v of Object.values(p)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(v.path)).digest('hex'),v.sha256);assert(v.grip[0]>v.foot[0]&&v.grip[1]<v.foot[1]);assert.deepEqual(v.foot,[112,286]);}assert(p.anticipation.grip[1]<p.ready.grip[1]);assert(p.impact.grip[0]>p.swing.grip[0]);}
console.log('Recovered paper interaction art verified');
