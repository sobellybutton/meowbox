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
// Five existing painted station/room plaque renderers use the clearance helper.
assert.ok((src.match(/const place=pawPaintedPlaquePlacement\(/g)||[]).length>=5);
console.log('Painted room plaque clearance regression passed');


// Clear, reprojected plaques stay visible during walking. The underlying
// layout alone decides visibility and pointer guards, for every doorway.
{
 const polish=fs.readFileSync(path.join(__dirname,'../src/town-polish.js'),'utf8');
 const start=polish.indexOf('const townSignBefore='),end=polish.indexOf('parkSerials.push(',start);
 assert.ok(start>=0&&end>start);
 const make=()=>({hidden:false,_signOffset:{x:0,y:0},style:{opacity:'',pointerEvents:'auto',setProperty(k,v){this.pointerEvents=v}}});
 const buttons=new Map(['station','tarot','temple','wishes','destiny'].map(id=>[id,make()]));
 let offset=0,blocked=false;
 const sync=new Function('signButtons','syncSigns','zh',polish.slice(start,end)+';return syncSigns')(buttons,()=>{
  for(const [id,b] of buttons){b._signOffset={x:offset,y:0};b.hidden=blocked&&id==='tarot'}
  return 'layout-result'
 },false);
 sync();
 for(let i=1;i<=60;i++){
  offset=(i%2)*14;
  assert.equal(sync(),'layout-result');
  for(const b of buttons.values()){assert.equal(b.hidden,false);assert.equal(b.style.opacity,'');assert.equal(b.style.pointerEvents,'auto')}
 }
 blocked=true;sync();assert.ok(buttons.get('tarot').hidden);
 blocked=false;buttons.get('tarot').style.pointerEvents='none';sync();
 assert.equal(buttons.get('tarot').style.pointerEvents,'none');
 console.log('All doorway plaques preserve authoritative layout and input guards');
}

// Close-by doorway plaques may move a little farther within the same scene
// when the primary placement is blocked. Never overlap the HUD or actors.
{
 const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
 const a=ext.indexOf('function meowPlaceText('),b=ext.indexOf('let meowTextFrameRects=',a);
 const c=ext.indexOf('function pawNearbyDoorPlaque('),d=ext.indexOf('let lastDoorLayoutAt=',c);
 assert.ok(a>=0&&b>a&&c>=0&&d>c);
 const api=new Function('const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const speechOverlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;'+ext.slice(a,b)+ext.slice(c,d)+';return {meowPlaceText,pawNearbyDoorPlaque}')();
 const bounds={left:6,right:354,top:112,bottom:510},blocked=[{left:0,right:360,top:112,bottom:202}];
 assert.equal(api.meowPlaceText(180,160,110,44,bounds,blocked,57.6),null);
 const q=api.pawNearbyDoorPlaque(180,160,110,44,bounds,blocked,true,360);
 assert.ok(q&&q.rect.top>=202&&q.rect.bottom<=510);
 assert.equal(api.pawNearbyDoorPlaque(180,160,110,44,bounds,blocked,false,360),null);
 assert.equal(api.pawNearbyDoorPlaque(180,160,110,44,bounds,[{left:0,right:360,top:0,bottom:640}],true,360),null);
 console.log('Nearby doorway plaque clearance: pass');
}

// Roof anchor can be clipped while the player stands on the final landing.
{
 const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
 const a=ext.indexOf('function meowPlaceText('),b=ext.indexOf('let meowTextFrameRects=',a),c=ext.indexOf('function pawNearbyDoorPlaque('),d=ext.indexOf('let lastDoorLayoutAt=',c);
 const place=new Function('const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const speechOverlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;'+ext.slice(a,b)+ext.slice(c,d)+';return pawNearbyDoorPlaque')();
 for(const w of [320,360,390,430]){
  const bounds={left:6,right:w-6,top:112,bottom:510},blocked=[{left:0,right:w,top:0,bottom:202},{left:w*.54,right:w*.84,top:202,bottom:295}];
  for(const y of [100,115,125,140]){
   const q=place(w*.74,y,110,44,bounds,blocked,true,w,[w*.73,190]);
   assert.ok(q&&q.rect.top>=202&&q.rect.bottom<=510);
   assert.ok(blocked.every(v=>q.rect.right<=v.left||q.rect.left>=v.right||q.rect.top>=v.bottom||q.rect.bottom<=v.top));
  }
  assert.equal(place(w*.74,125,110,44,bounds,[{left:0,right:w,top:0,bottom:640}],true,w,[w*.73,190]),null);
 }
 console.log('Landing-local doorway placement passed');
}

/* Stable architectural anchor after a passing character or transient HUD
   obstruction. Existing safe offset stays until the authored point is clear. */
{
 const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
 const a=ext.indexOf('function pawArchitecturalPlaqueHome('),b=ext.indexOf('let lastDoorLayoutAt=',a);
 assert.ok(a>=0&&b>a);
 const home=new Function(ext.slice(a,b)+';return pawArchitecturalPlaqueHome')();
 const exact={x:100,y:100,rect:{}};
 let n=0;const ck=v=>{assert.ok(v);n++};
 for(let t=0;t<1000;t+=10){
  const q={hidden:false,_signOffset:{x:14,y:0}};
  ck(home(q,exact,t)===null);ck(home(q,exact,t+349)===null);
  ck(home(q,exact,t+350)===exact);ck(q._anchorClearAt===null);
  ck(home(q,null,t+351)===null);ck(home(q,exact,t+400)===null);
  ck(home(q,null,t+600)===null);ck(home(q,exact,t+700)===null);
  ck(home(q,exact,t+1050)===exact);
 }
 ck(home({_signOffset:{x:0,y:0}},exact,0)===exact);
 ck(home({hidden:true,_signOffset:{x:20,y:0}},exact,0)===exact);
 assert.ok(ext.includes('let choice=pawArchitecturalPlaqueHome(btn,exact,now);'));
 console.log('PASS '+n+' architectural anchor recovery assertions');
}
