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
// Desktop framing protects all actual station and lane positions.
const layouts=require('../assets/visual/painted/interior-layouts.js');
let desktopChecks=0;
for(const id of ['tarot','destiny'])for(const [w,h] of [[900,720],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440]]){
 const q=make(true,id,true),p=q.plate,c=q.camera(w,h),spec=layouts.rooms[id];
 assert.ok(c&&c.s>h/p.h&&c.s<=h/(p.h*.86)+1e-8);desktopChecks++;
 const points=[spec.entry,spec.arrival,spec.host,...spec.visitors,...Object.values(spec.stations).flatMap(v=>[v.object,v.approach,v.label]),...spec.lane.flatMap(([y,l,r])=>[[l,y],[r,y]]),id==='tarot'?[.135,.399]:[.581,.337]];
 for(const [x,y] of points){
  const xx=c.ox+(p.x+p.w*x)*c.s,yy=c.oy+(p.y+p.h*y)*c.s;
  assert.ok(xx>=0&&xx<=w&&yy>=0&&yy<=h,id+' protected anchor');desktopChecks++;
 }
 assert.equal(make(false,id,true).camera(w,h),null);desktopChecks++;
}
assert.equal(make(true,'tarot',true).camera(844,390),null);
console.log('PASS '+desktopChecks+' reading room wide framing checks');
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

{
 const body=source.split('/* PAW_NATIVE_CONSULT_BEGIN */')[1].split('/* PAW_NATIVE_CONSULT_END */')[0];
 const api=new Function(body+';return {pawConsultPresetReady}')();
 const field=(value,valid=true)=>({value,checkValidity:()=>valid});
 const values=[field('8'),field('1.35'),field('103.82')];
 assert(api.pawConsultPresetReady('singapore',values));
 assert(!api.pawConsultPresetReady('custom',values));
 assert(!api.pawConsultPresetReady('',values));
 assert(!api.pawConsultPresetReady('singapore',[field(''),...values.slice(1)]));
 assert(!api.pawConsultPresetReady('singapore',[field('NaN'),...values.slice(1)]));
 assert(!api.pawConsultPresetReady('singapore',[field('8',false),...values.slice(1)]));
 // The tabletop fan intentionally overlaps card artwork; guidance names
 // the settling animation and the available choice count.
 assert(source.includes("When the cards settle, choose one, or shuffle again."));
 assert(source.includes("When the cards settle, choose '+n+', or shuffle again before choosing."));
 assert(source.includes("...readingTopics.map((topic,i)"));
 assert(source.includes("btn&&btn.disabled&&room==='destiny'"));
 assert(source.includes("pawConsultPresetReady(field.value,fields.slice(3))"));
 console.log('PASS 11 preset birthplace and next-step wiring checks');
}
