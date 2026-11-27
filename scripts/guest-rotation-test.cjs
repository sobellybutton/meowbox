const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const start=src.indexOf('function pawGuestRotationIndices(');
const end=src.indexOf('const pawBenchFirst=',start);
assert.ok(start>=0&&end>start);
const rotate=new Function(src.slice(start,end)+';return pawGuestRotationIndices')();
const cases=[
 [['a','b'],['c','d'],false,false,[350,150],[true,false],[0]],
 [['c','b'],['c','d'],false,false,[50,400],[false,true],[1]],
 [['a','b'],['b','a'],false,true,[],[],[]],
 [['a','b'],['c','d'],true,true,[],[],[]],
 [['a','b'],['c','d'],false,true,[],[],[0,1]],
 [['a','b'],['c','d'],false,false,[NaN,321],[true,false],[]],
 [['a','b'],['c','c'],false,true,[],[],[]],
 [['a','b'],['a','b'],false,true,[],[],[]],
 [['a','b'],['c'],false,true,[],[],[]],
 [['a','a'],['c','d'],false,true,[],[],[]],
 [['a','b'],['c','d'],false,false,[320,321],[true,true],[1]],
 [['a','b'],['a','d'],false,false,[400,400],[true,true],[1]]
];
for(const c of cases)assert.deepEqual(rotate(...c.slice(0,-1)),c.at(-1));
assert.ok(src.includes('for(const i of replacements){const n=slots[i]'));
console.log('Independent guest rotation passed');
