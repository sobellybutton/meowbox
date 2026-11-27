const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const engine=read('src/engine.js'),startup=read('src/startup.js');
function extract(s,key,symbol){
 const a=s.indexOf('/* '+key+'_BEGIN */'),b=s.indexOf('/* '+key+'_END */',a);
 assert.ok(a>=0&&b>a);return new Function(s.slice(a,b)+';return '+symbol)()
}
const resize=extract(engine,'PAW_CANVAS_RESIZE','pawCanvasResizePlan');
assert.equal(resize(0,844,3,1170,2532),null);
assert.equal(resize(390,0,3,1170,2532),null);
assert.equal(resize(NaN,844,3,1170,2532),null);
assert.equal(resize(390,844,3,1170,2532).reset,false);
assert.equal(resize(390,844,4,1170,2532).d,3);
assert.equal(resize(390,800,3,1170,2532).reset,true);
assert.deepEqual(resize(390,800,2,1170,2532),{width:390,height:800,d:2,w:780,h:1600,reset:true});
const valid=extract(startup,'PAW_FOOD_ADMISSION','pawFoodAdmissionValid');
const q={scene:'island',avatar:1,x:10,y:20},v={...q};
assert.ok(valid(q,q,v));
assert.equal(valid(q,{},v),false);
for(const patch of [{scene:'home'},{avatar:2},{room:'tea'},{activity:'cook'},{transitioning:true},{blocked:true},{pending:'door'},{x:23}])assert.equal(valid(q,q,{...v,...patch}),false);
assert.ok(startup.includes('Promise.all([pawReadyMap(destination),pawReadyTraveller(avatar??0)]).then(pawAdmissionReady)'));
assert.ok(startup.includes('pawDoorPushFadeBefore(()=>{clear();return fn()},kind,destination)'));
console.log('Scene readiness, stale admissions, door handoff wiring and resize regression passed');
