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
 const api=new Function('state','document','c','clamp','poseEase','careComplete','careSync',
 'let t=0,activity="pet";'+body+';return {tick(v){t=v;careTick()},hide(v){t=v;document.hidden=true;pawCareVisibility(true,v)},show(v){t=v;document.hidden=false;pawCareVisibility(false,v)}}')
 (state,document,{hasPointerCapture:()=>true,releasePointerCapture:id=>released.push(id)},(v,min,max)=>Math.min(max,Math.max(min,v)),v=>v*v*(3-2*v),p=>{completed.push(p);a.phase='return';a.assisted=false;a.returnFromX=a.x;a.returnFromY=a.y;a.returnAt=a.tickAt},()=>{});
 return {a,api,completed,released};
}
let checks=0;const ck=(v,msg)=>{assert.ok(v,msg);checks++};
for(const [phase,duration] of [['pet',2.3],['play',3.2],['feed',4.451],['water',4.451],['rest',4.501]]){
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
  const q=api.setup(kind,{x:310,y:570}),first=api.pose(q,0),end=api.pose(q,1.35);
  check(first.x===310&&first.y===570,'manual release starts at physical drop');
  check(end.x===q.home[0]&&end.y===q.home[1]&&end.tilt===0,'supply returns to home');
  check(api.pose(q,.675).pouring,'pour is visibly staged');
  check(api.age({phase:kind,at:0,supply:q},1.34)<0,'cat waits until preparation finishes');
  check(api.age({phase:kind,at:0,supply:q},1.35)===0,'cat approach begins at preparation end');
  for(let i=0;i<=135;i++){
   const t=i/100,p=api.pose(q,t),still=api.pose(q,t,true);
   check([p.x,p.y,p.tilt].every(Number.isFinite),'finite prop coordinates');
   check(still.x===q.home[0]&&still.y===q.home[1]&&!still.pouring,'reduced motion still');
  }
 }
 check(api.setup('play')===null,'other actions unchanged');
 console.log('PASS '+n+' physical preparation checks.');
}
