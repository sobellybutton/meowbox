const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/release-fixes.js'),'utf8');
const begin=src.indexOf('/* PAW_INDOOR_STANDING_SCALE_BEGIN */'),end=src.indexOf('queueMicrotask(pawInstallIndoorStandingScale);',begin);
assert.ok(begin>=0&&end>begin);
const api=new Function(src.slice(begin,end)+';return {pawIndoorStandingScale,pawIndoorStandingBounds}')();
let checks=0;
for(const player of [.65,.8,1,1.4,2,2.4,3.2])for(const ref of [104,106,110,112,119])for(const ratio of [.87,.88,.9,.92,.94])for(const cam of [.2,.45,.75,1,1.5,2]){
 const s=api.pawIndoorStandingScale(player,ref,ratio),h=ref*s*cam;
 assert.ok(Math.abs(h-94*player*cam*ratio)<1e-9);
 const rect=api.pawIndoorStandingBounds(400,600,ref*s,.9,{s:cam,ox:20,oy:-30});
 assert.ok(Math.abs(rect.bottom-(600*cam-30+6))<1e-9);
 assert.ok(Math.abs(rect.bottom-rect.top-h-11)<1e-9);checks++;
}
assert.equal(api.pawIndoorStandingScale(1,0,.9),null);
assert.equal(api.pawIndoorStandingScale(NaN,110,.9),null);
assert.equal(api.pawIndoorStandingBounds(0,0,100,.8,{s:0,ox:0,oy:0}),null);
const fake=new Function(src.slice(begin,end)+`
let room='mystery',activity=null,H=640,cam={scale:.5,ox:0,oy:0},playerScale=1.6;
const actor={n:['Souvenir keeper','手信店主'],x:582,y:590,sc:.92},record={id:'souvenir',height:110};
const roomResidentStations={mystery:actor};
let current=actor,drawn;
function residentArtworkRecord(n){return n===actor.n?record:null}
function residentArtworkImage(){return {complete:true,naturalWidth:200,naturalHeight:300}}
function pawResidentCrop(){return {w:140,h:250}}
function travellerRoomScale(){return playerScale}
let drawGatheringPainted=(n,x,y,s)=>{drawn=s;return s},roomResidentActors=()=>[current],meowIndoorActorBounds=()=>({legacy:true});
pawInstallIndoorStandingScale();
return {actor,record,set:(v,a,p,c)=>{room=v;activity=a;playerScale=p;current=c},render:()=>drawGatheringPainted(actor.n,actor.x,actor.y,actor.sc),actors:()=>roomResidentActors(),bounds:(a,s)=>meowIndoorActorBounds(a,s)};
`)();
for(const p of [.65,1,2.4]){
 fake.set('mystery',null,p,fake.actor);
 const a=fake.actors()[0],s=fake.render();
 assert.equal(a.sc,s);
 assert.ok(Math.abs(s*110-94*p*.92)<1e-9);
 const r=fake.bounds(a,s);assert.ok(Math.abs(r.bottom-r.top-110*s*.5-11)<1e-9);
 assert.equal(fake.actor.sc,.92);
}
fake.set('mystery','blindBox',2,fake.actor);assert.equal(fake.render(),.92);assert.equal(fake.actors()[0],fake.actor);
fake.set('tarot',null,2,fake.actor);assert.equal(fake.render(),.92);assert.deepEqual(fake.bounds(fake.actor,.92),{legacy:true});
const authored={...fake.actor,sc:.75};fake.set('mystery',null,2,authored);assert.equal(fake.actors()[0],authored);
console.log('Indoor standing actor scale: '+checks+' geometry scenarios and runtime wrapper regressions passed');
