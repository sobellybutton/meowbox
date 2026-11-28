'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.resolve(__dirname,'../src/extensions.js'),'utf8');
const begin=src.indexOf('let pawCareSleep=null;'),end=src.indexOf('const parkCareStartBefore=start;',begin);
assert.ok(begin>=0&&end>begin);
const body=src.slice(begin,end);
function fixture(phase,assisted=true){
 const a={phase,assisted,x:400,y:535,at:0,stroke:0,drag:null,fromX:400,fromY:535};
 if(['feed','water'].includes(phase))a.supply={kind:phase};
 const state={care:a},document={hidden:false,addEventListener(){}},completed=[],released=[];
 const api=new Function('state','document','c','clamp','poseEase','careComplete','careSync','residentReducedMotion',
 'let t=0,activity="pet";'+body+';return {tick(v){t=v;careTick()},hide(v){t=v;document.hidden=true;pawCareVisibility(true,v)},show(v){t=v;document.hidden=false;pawCareVisibility(false,v)}}')
 (state,document,{hasPointerCapture:()=>true,releasePointerCapture:id=>released.push(id)},(v,min,max)=>Math.min(max,Math.max(min,v)),v=>v*v*(3-2*v),p=>{completed.push(p);a.phase='return';a.assisted=false;a.returnFromX=a.x;a.returnFromY=a.y;a.returnAt=a.tickAt},()=>{},{matches:false});
 return {a,api,completed,released};
}
let checks=0;const ck=(v,msg)=>{assert.ok(v,msg);checks++};
for(const [phase,duration] of [['pet',2.3],['play',3.2],['feed',5.101],['water',5.101],['rest',4.501]]){
 const {a,api,completed}=fixture(phase);
 api.tick(0);api.tick(1);api.hide(1);api.tick(61);
 ck(completed.length===0,'hidden activity cannot complete');
 api.show(61);api.tick(60+duration-.01);ck(completed.length===0,'no early completion after return');
 api.tick(60+duration+.01);ck(completed.length===1&&completed[0]===phase,'complete only after enough visible time');
 api.tick(60+duration+.9);ck(a.phase==='idle','natural return to idle');ck(completed.length===1,'no duplicate completion');
}
for(const phase of ['pet','play','idle']){
 const {a,api,completed,released}=fixture(phase,false);a.drag={id:17,x:320,y:515};a.stroke=100;a.x=350;
 api.hide(1);ck(a.drag===null&&a.stroke===0,'gesture cancelled');ck(released[0]===17,'capture released');
 ck(a.phase===(phase==='idle'?'idle':'return'),'safe phase');api.show(11);api.tick(12);
 ck(a.phase==='idle'&&completed.length===0,'no accidental reward after interrupted touch');
}
assert.ok(!src.includes("setTimeout(()=>{if(state===run&&careIsActive()&&a.phase===key)careComplete(key)"),'no independent wall-clock completion');
console.log('PASS '+checks+' park care continuity checks.');

{
 const a=src.indexOf('const pawParkCareProps=Object.freeze('),b=src.indexOf('function careBowl(',a);
 const d=src.indexOf('const pawParkCareHome=Object.freeze('),e=src.indexOf('// Dedicated canvas gestures.',d);
 assert.ok(a>=0&&b>a&&d>=0&&e>d);
 const calls=[],images={parkCareFilledBowl:{naturalWidth:130,naturalHeight:92},parkCareFeather:{naturalWidth:110,naturalHeight:131}};
 const api=new Function('ctx','productionVisual',src.slice(a,b)+src.slice(d,e)+';return {box:pawParkCarePropBox,draw:pawDrawParkCareProp,grab:pawParkCareGrab,point:pawParkCareDragPoint}')({drawImage(...v){calls.push(v)}},id=>images[id]);
 let n=0;const check=(v,msg)=>{assert.ok(v,msg);n++};
 for(const [kind,hx,hy] of [['feed',285,620],['water',400,620],['play',510,615],['pet',400,500]]){
  for(const dx of [-20,0,20])for(const dy of [-20,0,20]){
   const q={x:hx+dx,y:hy+dy},g=api.grab(kind,q,7,100);
   check(g.x===(kind==='pet'?q.x:hx)&&g.y===(kind==='pet'?q.y:hy),'no pickup snap');
   const p=api.point(g,{x:q.x+32,y:q.y-25});
   check(p.x===g.x+32&&p.y===g.y-25,'tool retains touch offset');
  }
 }
 const bowl=api.box('foodBowl',295,548);
 check(Math.abs(bowl.x+bowl.w/2-295)<1e-9&&Math.abs(bowl.y+bowl.h-570)<1e-9,'bowl bottom at ground contact');
 check(api.draw('foodBowl',295,548)&&api.draw('feather',510,615)&&calls.length===2,'painted props draw');
 delete images.parkCareFeather;check(!api.draw('feather',510,615),'unavailable artwork falls back');
 check(api.box('missing',0,0)===null&&api.box('feather',NaN,0)===null,'invalid input');
 console.log('PASS '+n+' painted prop placement and grab offset checks.');
}

{
 const api=new Function('document',body+';return {setup:pawCareSupplySetup,pose:pawCareSupplyPose,age:pawCareActionAge}')({addEventListener(){}});
 let n=0;const check=(v,msg)=>{assert.ok(v,msg);n++};
 for(const kind of ['feed','water']){
  const q=api.setup(kind,{x:310,y:570}),first=api.pose(q,0),end=api.pose(q,2);
  check(first.x===310&&first.y===570,'manual release starts at physical drop');
  check(end.x===q.home[0]&&end.y===q.home[1]&&end.tilt===0,'supply returns to home');
  check(api.pose(q,1.325).pouring,'pour is visibly staged');
  check(api.age({phase:kind,at:0,supply:q},1.99)<0,'cat waits until preparation finishes');
  check(api.age({phase:kind,at:0,supply:q},2)===0,'cat approach begins at preparation end');
  for(let i=0;i<=200;i++){
   const t=i/100,p=api.pose(q,t),still=api.pose(q,t,true);
   check([p.x,p.y,p.tilt].every(Number.isFinite),'finite prop coordinates');
   check(still.x===q.home[0]&&still.y===q.home[1]&&!still.pouring,'reduced motion still');
  }
 }
 check(api.setup('play')===null,'other actions unchanged');
 console.log('PASS '+n+' physical preparation checks.');
}

{
 const api=new Function('document',body+';return {step:pawCareActorStep,target:pawCareActorTarget}')({addEventListener(){}});
 let n=0;const check=(v,msg)=>{assert.ok(v,msg);n++};
 for(const phase of ['feed','water','pet','play','rest']){
  const a={phase},target=api.target(phase);let previous=api.step(a,0),last=[previous.x,previous.y];
  for(let i=0;i<100;i++){const p=api.step(a,.016);
   check(Math.hypot(p.x-last[0],p.y-last[1])<=260*.016+1e-7,'bounded walking speed');
   check(p.kneel>=0&&p.kneel<=.68,'grounded pose range');
   last=[p.x,p.y];
  }
  check(Math.hypot(last[0]-target[0],last[1]-target[1])<1e-6&&!a.traveller.moving&&a.traveller.kneel>0,'approach reaches target and settles');
  a.phase='return';for(let i=0;i<100;i++)api.step(a,.016);
  check(a.traveller.x===400&&a.traveller.y===657&&a.traveller.kneel===0,'returns to rest position');
  const reduced=api.step({phase},0,true);check(reduced.x===target[0]&&reduced.y===target[1]&&!reduced.moving,'reduced motion pose');
 }
 console.log('PASS '+n+' park traveller movement checks.');
}

{
 const block=src.match(/\/\* PAW_KAYA_PAINTED_BEGIN \*\/([\s\S]*?)\/\* PAW_KAYA_PAINTED_END \*\//);
 assert.ok(block);
 const images=Array.from({length:9},(_,i)=>({naturalWidth:480,naturalHeight:480,id:i}));
 const manifest={},ctx={save(){},restore(){},translate(){},scale(){},drawImage(...v){this.last=v}};
 let ready=true;
 const api=new Function('productionVisualManifest','productionVisual','roomIntro','ctx','ellipse','t',block[1]+';return {frame:pawKayaFrame,box:pawKayaBox,draw:pawDrawKaya,prepare:pawKayaPrepare}')(manifest,id=>ready?images[id==='parkKayaSleep'?8:Number(id.slice(-1))]:null,()=>{},ctx,()=>{},1);
 let n=0;const check=(v,m)=>{assert.ok(v,m);n++};
 let last=0;
 for(let i=0;i<500;i++){
  const age=i/100,fr=api.frame('pet',age,true),box=api.box(400,535,8,age);
  check(fr>=last&&fr<=7,'one-shot frames never restart');last=fr;
  check(Math.abs(box.y+box.h*440/480-535)<1e-8,'breathing retains ground anchor');
 }
 check(api.frame('pet',.6,false)===0,'wait for physical approach');
 check(api.frame('pet',0,true,true)===4,'reduced-motion pet expression');
 check(api.frame('rest',0,false)===8,'sleep pose');
 const a={x:400,y:535,traveller:{moving:false,kneel:.5}};
 for(const kind of [1,2,3,4])check(!api.draw(a,kind,'pet',0,1,false),'no identity substitution');
 check(api.draw(a,0,'pet',0,1,false)&&ctx.last[0].id===0,'initial pet');
 check(api.draw(a,0,'pet',.6,1,false)&&ctx.last[0].id===4,'physical response');
 check(api.draw(a,0,'pet',2,1,false)&&ctx.last[0].id===7,'one shot settles');
 check(api.draw(a,0,'rest',0,1,false)&&ctx.last[0].id===8,'sleep');
 for(const phase of ['feed','water','play'])check(!api.draw(a,0,phase,1,1,false),'preserve existing motion atlas');
 ready=false;const fallback={};check(!api.draw(fallback,0,'idle',0,1,false),'missing set falls back');
 ready=true;check(!api.draw(fallback,0,'pet',1,1,false),'no artwork swap during visit');
 check(Object.keys(manifest).length===9,'all uploaded pose paths registered');
 check(src.includes('if(pawDrawKaya(a,kind,phase,age,dir,residentReducedMotion.matches))return;'),'actual care renderer calls new pose selector');
 console.log('PASS '+n+' painted ginger tabby timing, contact, fallback and identity assertions.');
}
