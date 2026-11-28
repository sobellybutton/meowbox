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
