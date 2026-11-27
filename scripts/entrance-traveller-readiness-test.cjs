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
 assert.ok(src.includes("pawReadyMap('fortune'),pawReadyPicture(gateArt),pawReadyTraveller(kind)"));
 console.log('Entrance painted traveller readiness regression passed');
})().catch(e=>{console.error(e);process.exitCode=1});
