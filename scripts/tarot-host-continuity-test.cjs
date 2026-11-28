'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/painted-lobby-runtime.js'),'utf8');
const lobby=source.slice(source.indexOf('function pawTarotLobbyFrame'),source.indexOf('const pawTarotLobbyCameraBefore'));
const body=source.slice(source.indexOf('/* PAW_TAROT_HOST_CONTINUITY_BEGIN */'),source.indexOf("if(typeof document!=='undefined')queueMicrotask(pawInstallTarotHostContinuity)"));
const api=new Function(lobby+body+';return {pawTarotConsultationPlate,pawTarotLobbyFrame,pawReadingWideFrame}')();
let n=0;
for(const [w,h] of [[320,568],[320,900],[360,640],[390,844],[430,932],[768,1024],[844,390],[900,720],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440]])for(const z of [.3,.6,1,1.5,2.4]){
 const b={x:-123/z,y:75/z,w:w/z,h:h/z},p=api.pawTarotConsultationPlate(b,928,1648,z);
 assert.ok(Math.abs(p.w/p.h-928/1648)<1e-10);
 for(const a of [.018,.135,.855]){const x=(p.x+p.w*a-b.x)*z;assert.ok(x>=-.001&&x<=w+.001)}
 for(const a of [.337,.399,.61,.7,.89]){const y=(p.y+p.h*a-b.y)*z;assert.ok(y>=-.001&&y<=h+.001)}
 const q=api.pawTarotConsultationPlate({x:0,y:0,w,h},928,1648);
 assert.ok(Math.abs(p.h*z-q.h)<1e-8);
 if(w<h){
  const c=api.pawTarotLobbyFrame(w,h,{x:0,y:0,w:928,h:1648});
  assert.ok(Math.abs(q.h-1648*c.s)<1e-8&&Math.abs(q.x-c.ox)<1e-8&&Math.abs(q.y-c.oy)<1e-8);
  }else{
  const c=api.pawReadingWideFrame(w,h,{x:0,y:0,w:928,h:1648});
  if(c){
   assert.ok(Math.abs(q.h-1648*c.s)<1e-8&&Math.abs(q.x-c.ox)<1e-8&&Math.abs(q.y-c.oy)<1e-8);
   assert.ok(Math.abs((p.x-b.x)*z-c.ox)<1e-8&&Math.abs((p.y-b.y)*z-c.oy)<1e-8);
  }else assert.ok(q.h<=h+.001&&q.w<=w+.001);
 }
 n++;
}
assert.equal(api.pawTarotConsultationPlate({x:0,y:0,w:0,h:800},928,1648),null);
const make=new Function(lobby+body+`
let room='tarot',activity='tarot',pawReadingVisit='tarot',ready=true,calls=[],depth=0;
const im={naturalWidth:928,naturalHeight:1648};
const b={x:0,y:0,w:360,h:640},W=360;
let paintLivingBackdrop=()=>calls.push(['fallback']);
const pawReadingImage=()=>im,pawReadingAPI=()=>null,pawRoomImageReady=()=>ready,livingBounds=()=>b;
const ctx={save(){depth++},restore(){depth--},fillRect(){},beginPath(){},rect(){},clip(){},drawImage(i,...p){calls.push(['art',...p])}};
const pawSceneAirLive=(id,p)=>calls.push(['air',p]),pawDrawReadingSeated=(id,p)=>calls.push(['host',p]);
pawInstallTarotHostContinuity();
return {run:(r,a,v,ok)=>{room=r;activity=a;pawReadingVisit=v;ready=ok;calls=[];paintLivingBackdrop();return {calls,depth}}};
`)();
for(const a of ['tarot','love']){
 const q=make.run('tarot',a,'tarot',true);assert.equal(q.depth,0);
 assert.equal(q.calls.length,3);assert.equal(q.calls[0][0],'art');
 assert.equal(q.calls[1][1],q.calls[2][1]);
 assert.deepEqual(q.calls[0].slice(1),[q.calls[2][1].x,q.calls[2][1].y,q.calls[2][1].w,q.calls[2][1].h]);
}
for(const args of [['tarot',null,'tarot',true],['tarot','tarot','destiny',true],['tarot','tarot','tarot',false],['destiny','tarot','tarot',true]])assert.deepEqual(make.run(...args),{calls:[['fallback']],depth:0});
console.log('Tarot host continuity: '+n+' viewport/camera scenarios and six runtime cases passed');
