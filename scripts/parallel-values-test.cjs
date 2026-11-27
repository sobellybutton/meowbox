const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../src',p),'utf8');
const ext=read('extensions.js'),s=read('startup.js');
const a=ext.indexOf("const parallelScenes={"),b=ext.indexOf("let parallelNode='station'",a),c=s.indexOf('/* PAW_PARALLEL_VALUES_BEGIN */'),d=s.indexOf('/* PAW_PARALLEL_VALUES_END */',c);
assert.ok(a>=0&&b>a&&c>=0&&d>c);
const {scenes,ends,reflect,stakes}=new Function(ext.slice(a,b)+s.slice(c,d)+';return {scenes:parallelScenes,ends:parallelEndings,reflect:pawParallelReflection,stakes:pawParallelStakes}')();
const found=new Set(),wording=new Set();
function walk(id,trail=[]){
 if(ends[id]){const value=reflect(trail,id,scenes,ends);assert.ok(value?.length===2&&value.every(v=>typeof v==='string'&&v.length>20));assert.ok(stakes[trail.at(-1)]?.every(Boolean));found.add(id);wording.add(value[0]);return}
 for(const choice of scenes[id].choices)walk(choice[2],[...trail,id]);
}
walk('station');assert.equal(found.size,16);assert.equal(wording.size,16);
assert.equal(reflect(['station'],'endLight',scenes,ends),null);
assert.equal(reflect(['station','post','books','booksLetters'],'endLight',scenes,ends),null);
assert.equal(reflect(['station','train','coast','coastStorm'],'missing',scenes,ends),null);
console.log('Parallel Lives choice reflection regression passed');
