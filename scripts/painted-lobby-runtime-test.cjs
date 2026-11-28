'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const source=read('src/painted-lobby-runtime.js');
const make=new Function('active','id','paintedOK',`let room=id,old=0,paint=0;
 const pawReadingActive=()=>active,pawReadingBackdrop=()=>{paint++;return paintedOK};
 let paintPortraitReadingRoom=function(){old++;return 'fallback'};
 `+source+`
 return {draw:()=>paintPortraitReadingRoom(),counts:()=>[paint,old]};`);
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
