const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('function pawAdmissionTravellerKeys('),b=src.indexOf('/* PAW_WORLD_ADMISSION_END */',a);
assert.ok(a>=0&&b>a);
const images={},seen=[];
for(let i=0;i<4;i++)for(let j=0;j<3;j++)images['walker'+i+j]={ready:true,key:'walker'+i+j};
const {keys,ready,traveller}=new Function('pics','pawReadyPicture',src.slice(a,b)+';return {keys:pawAdmissionTravellerKeys,ready:pawAdmissionReady,traveller:pawReadyTraveller}')(images,im=>{seen.push(im?.key);return Promise.resolve(im?.ready===true)});
(async()=>{
 for(let i=0;i<4;i++){assert.deepEqual(keys(i),[0,1,2].map(j=>'walker'+i+j));assert.equal(await traveller(i),true)}
 assert.equal(seen.length,12);
 images.walker21.ready=false;assert.equal(await traveller(2),false);
 images.walker21.ready=true;assert.equal(await traveller(2),true);
 delete images.walker32;assert.equal(await traveller(3),false);
 assert.equal(await traveller(-1),false);
 assert.equal(ready([]),false);assert.equal(ready([true,false]),false);assert.equal(ready([true,true,true]),true);
 assert.ok(src.includes("pawReadyMap('fortune'),pawReadyPicture(gateArt),pawReadyTraveller(kind),pawReadyEntranceWalk(kind)"));
 console.log('Entrance painted traveller readiness regression passed');
})().catch(e=>{console.error(e);process.exitCode=1});

// Boot records must match the actual current artwork manifest exactly.
{
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/visual/painted/action-runtime.json'),'utf8'));
 const records=JSON.parse(src.match(/const pawBootWalkManifest=(\{[^\n]+\});/)[1]);
 const start=src.indexOf('/* PAW_BOOT_CURRENT_ART_BEGIN */'),end=src.indexOf('/* PAW_BOOT_CURRENT_ART_END */');
 const api=new Function('pawBootWalkManifest',src.slice(start,end)+';return {pawEntranceRecord,pawEntranceWalkRecords,pawEntranceDirection}')(records);
 let n=0;for(let id=0;id<4;id++){assert.deepEqual(records.players[id].walk,manifest.players[id].walk);for(const [i,dir] of ['down','up','right'].entries()){assert.equal(api.pawEntranceDirection(i),dir);assert.deepEqual(api.pawEntranceRecord(id,dir),manifest.players[id].walk[dir][0]);n+=2}assert.equal(api.pawEntranceWalkRecords(id).length,12);n++}
 assert.equal(api.pawEntranceRecord(-1,'up'),null);assert.equal(api.pawEntranceWalkRecords(9).length,0);
 assert.ok(src.includes('pawTransitClock(clock,now,true,600)'));
 console.log('PASS '+(n+3)+' current painted entrance selection and timing checks');
}
