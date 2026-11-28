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

{
 const begin=startup.indexOf('function pawRoomActivityArtKeys'),end=startup.indexOf('function pawRoomPaintFallback',begin);
 assert.ok(begin>=0&&end>begin);
 const keys=Array.from({length:8},(_,i)=>'parkKayaPet'+i);
 const requested=[],decoded=[],cache=new Map(),jobs=new Map();
 const create=id=>({complete:false,naturalWidth:0,naturalHeight:0,decode(){decoded.push(id);return Promise.resolve()}});
 const manifest=Object.fromEntries(['park','parkCats','parkCareFilledBowl','parkCareFeather',...keys,'parkKayaSleep','tea'].map(k=>[k,{}]));
 const api=new Function('pawRoomAlias','pawRoomFallbackKeys','pawRoomWarmJobs','productionVisualManifest','productionVisualCache','productionVisual','pawKayaKeys','portraitInteriorImage','landscapeRoomImage','pics','pawRoomImageReady','setTimeout',startup.slice(begin,end)+';return {keys:pawRoomActivityArtKeys,warm:pawWarmRoomAssets}')({}, {park:[],tea:[]},jobs,manifest,cache,id=>{requested.push(id);if(!cache.has(id))cache.set(id,create(id))},keys,()=>null,()=>null,{},()=>false,()=>{});
 assert.deepEqual(api.keys('park',keys),['parkCats','parkCareFilledBowl','parkCareFeather',...keys,'parkKayaSleep']);
 for(const id of ['tea','tarot','quiz','home',''])assert.deepEqual(api.keys(id,keys),[]);
 assert.equal(api.warm('park'),undefined,'optional art must not delay room entry');
 const expected=['park',...api.keys('park',keys)];
 assert.deepEqual(requested,expected);
 assert.deepEqual(decoded,expected);
 api.warm('park');assert.deepEqual(requested,expected,'coalesce in-flight requests');
 api.warm('tea');assert.deepEqual(requested,[...expected,'tea']);
 assert.ok(jobs.has('park')&&jobs.has('tea'));
 console.log('Park admission: 12 existing activity assets warmed before entry, no blocking or duplicate in-flight requests');
}
