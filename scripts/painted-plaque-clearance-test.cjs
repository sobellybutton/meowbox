const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('function pawHallOverlap('),b=src.indexOf('function pawHallActorScale(',a);
assert.ok(a>=0&&b>a);
const place=new Function(src.slice(a,b)+';return pawPaintedPlaquePlacement')();
for(const [w,h] of [[360,640],[390,844],[768,1024],[1280,720],[1920,1080]]){
 for(const s of [.3,.6,1,1.5]){
  const view={s,ox:w/2-180*s,oy:h/2-300*s},screen={w,h};
  const p=place(180,300,30,20,view,screen);
  assert.ok(p&&p.hitW*s>=44-1e-8&&p.hitH*s>=44-1e-8);
  assert.equal(p.x,180);
  const blocker={left:w/2-10,right:w/2+10,top:h/2+17,bottom:h/2+40};
  const q=place(180,300,30,20,view,screen,[blocker]);
  if(q)assert.ok(q.rect.bottom<=blocker.top||q.rect.top>=blocker.bottom||q.rect.right<=blocker.left||q.rect.left>=blocker.right);
  assert.equal(place(180,300,30,20,view,screen,[{left:0,right:w,top:0,bottom:h}]),null);
 }
}
assert.equal(place(-100,300,30,20,{s:1,ox:0,oy:0},{w:360,h:640}),null);
assert.equal(place(180,300,30,20,{s:0,ox:0,oy:0},{w:360,h:640}),null);
assert.equal((src.match(/const place=pawPaintedPlaquePlacement\(/g)||[]).length,2);
console.log('Painted room plaque clearance regression passed');


// The station must remain usable while the map and its sign are moving.
// Other building plaques retain their cosmetic settle treatment.
{
 const polish=fs.readFileSync(path.join(__dirname,'../src/town-polish.js'),'utf8');
 const start=polish.indexOf('const townSignBefore='),end=polish.indexOf('parkSerials.push(',start);
 assert.ok(start>=0&&end>start);
 const make=()=>({hidden:false,_signOffset:{x:0,y:0},style:{opacity:'',pointerEvents:'auto',setProperty(k,v){this.pointerEvents=v}}});
 const station=make(),shop=make(),buttons=new Map([['station',station],['tarot',shop]]);
 let time=0,offset=0;
 const sync=new Function('signButtons','performance','syncSigns','zh',polish.slice(start,end)+';return syncSigns')(buttons,{now:()=>time},()=>{for(const b of buttons.values())b._signOffset={x:offset,y:0}},false);
 sync();
 for(let i=1;i<=20;i++){
  time=i*30;offset=i*14;sync();
  assert.equal(station.style.opacity,'');assert.equal(station.style.pointerEvents,'auto');
  assert.ok(shop.style.opacity==='0'&&shop.style.pointerEvents==='none');
 }
 time+=181;sync();assert.ok(shop.style.opacity===''&&shop.style.pointerEvents==='auto');
 station.hidden=true;sync();assert.ok(station.hidden);
 console.log('Station plaque cosmetic stability regression passed');
}
