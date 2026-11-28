'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const source=read('src/painted-lobby-runtime.js');
const make=new Function('active','id','paintedOK',`let room=id,old=0,paint=0;
 const pawReadingActive=()=>active,pawReadingBackdrop=()=>{paint++;return paintedOK};
 let paintPortraitReadingRoom=function(){old++;return 'fallback'};
 const pawReadingPlate={x:245,y:235,w:550*928/1648,h:550};
 let pawReadingCamera=()=>null;
 `+source+`
 return {draw:()=>paintPortraitReadingRoom(),counts:()=>[paint,old],camera:(w,h)=>pawReadingCamera(null,w,h),plate:pawReadingPlate};`);
for(const active of [false,true])for(const id of ['tarot','destiny',null])for(const paintedOK of [false,true]){
 const q=make(active,id,paintedOK),mapped=active&&id==='tarot';
 assert.equal(q.draw(),mapped&&paintedOK?true:'fallback');
 assert.deepEqual(q.counts(),[Number(mapped),Number(!mapped||!paintedOK)]);
}
const extensions=read('src/extensions.js'),startup=read('src/startup.js');
assert(extensions.includes("if(room==='tarot'&&W<H)paintPortraitReadingRoom();"));
assert(startup.includes('function pawReadingBackdrop(){'));
assert(startup.includes("function pawReadingActive(){return !activity"));
for(const p of ['index.html','scripts/build.cjs']){
 const s=read(p);assert(s.includes('painted-lobby-runtime'));
 assert(s.indexOf('painted-lobby-runtime')<s.lastIndexOf('startup'));
}
console.log('PASS mapped Tarot portrait backdrop priority, fallback and assembly');

for(const [w,h] of [[320,568],[320,900],[360,780],[390,844],[430,932],[412,915],[393,852],[768,1024]]){
 const q=make(true,'tarot',true),p=q.plate,c=q.camera(w,h);
 for(const x of [.018,.135,.42,.84,.855]){
  const xx=c.ox+(p.x+p.w*x)*c.s;assert.ok(xx>=-.001&&xx<=w+.001,'protected host/lane span');
 }
 for(const y of [.399,.69,.77,.89,.91]){
  const yy=c.oy+(p.y+p.h*y)*c.s;assert.ok(yy>=-.001&&yy<=h+.001,'protected vertical route');
 }
 assert.equal(make(false,'tarot',true).camera(w,h),null);
 assert.equal(make(true,'destiny',true).camera(w,h),null);
}
assert.equal(make(true,'tarot',true).camera(1440,900),null);
console.log('PASS Tarot mobile host and route framing across eight viewport classes');

{
 const body=source.split('/* PAW_NATIVE_CONSULT_BEGIN */')[1].split('/* PAW_NATIVE_CONSULT_END */')[0];
 const api=new Function(body+';return {pawConsultActorScale,pawConsultCardBox,pawConsultInputPlan,pawConsultCurrent}')();
 let n=0;const ck=(v,m)=>{assert.ok(v,m);n++};
 for(const height of [320,568,844,1024])for(const camera of [.5,1,1.6])for(const base of [.65,1,1.5]){
  const scale=api.pawConsultActorScale(base,camera,height);
  ck(scale>=base&&scale<=base*1.35+1e-8,'bounded actor scale')
 }
 for(let w=1;w<=180;w++){const box=api.pawConsultCardBox(10,20,w,218);ck(box.h===218&&box.w<=w&&box.x>=10&&Math.abs(box.x+box.w/2-(10+w/2))<1e-8,'full-height centered face through flip')}
 const date={},year={},time={},place={},nums=[{},{},{}];
 const f={querySelector:s=>({'input[type=date]':date,select:year,'input[type=time]':time,'details select':place})[s],querySelectorAll:()=>nums};
 ck(api.pawConsultInputPlan(f,'year').length===2,'two spoken year questions');
 ck(api.pawConsultInputPlan(f,'chart').length===6,'one field per chart question');
 ck(api.pawConsultInputPlan(f,'stars').length===0,'star reading untouched');
 const origin={room:'destiny',form:f,subject:'other'};
 ck(api.pawConsultCurrent(origin,{...origin}),'current consultation');
 ck(!api.pawConsultCurrent(origin,{...origin,subject:'self'}),'subject change invalidates question');
 ck(!api.pawConsultCurrent(origin,{...origin,form:{}}),'new form invalidates question');
 ck(!api.pawConsultCurrent(origin,{...origin,room:'tarot'}),'room change invalidates question');
 console.log('PASS '+n+' consultation input ownership, card geometry and scale checks');
}
