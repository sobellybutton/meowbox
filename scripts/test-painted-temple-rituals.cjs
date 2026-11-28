'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const get=name=>src.split('/* PAW_'+name+'_BEGIN */')[1].split('/* PAW_'+name+'_END */')[0];
const api=new Function(get('PURIFICATION_PAINT')+get('ALCOVE_PAINT')+get('SLIP_COUNTER')+';return {pawAlcoveGeometry,pawAlcoveStickPoint,pawAlcoveMoonPoint,pawSlipGeometry,pawSlipPose,pawSlipRackCamera,pawSlipPage}')();
for(const name of ['sticks','slip-counter'])assert.ok(fs.existsSync(path.join(root,'assets/visual/staging/2026-11-27/rooms/temple',name+'.webp')));
const g=api.pawAlcoveGeometry();
for(let i=0;i<=100;i++){const f=i/100,a=api.pawAlcoveStickPoint(g,{fall:f,picked:false,pick:0});assert.ok(a.x>=g.tubeTop.x&&a.x<=g.stickTray.x&&Number.isFinite(a.y))}
const landed=api.pawAlcoveStickPoint(g,{fall:1,picked:false,pick:0});assert.equal(landed.y,g.stickTray.y);assert.equal(landed.x,g.stickTray.x);
const held=api.pawAlcoveStickPoint(g,{fall:1,picked:true,pick:1});assert.equal(held.x,g.stickPickFoot.x+14);assert.equal(held.y,g.stickPickFoot.y-64);
for(let i=0;i<=100;i++){const f=i/100;for(let j=0;j<2;j++){const sign=j?1:-1,x=350+j*100+sign*Math.sin(Math.PI*f)*21,lift=Math.sin(Math.PI*f)*95,p=api.pawAlcoveMoonPoint(g,{x,lift});assert.ok(Math.abs(p.x-g.moonTray.x)<=19&&p.y<=g.moonTray.y)}}
const s=api.pawSlipGeometry();
for(const [stage,age,a] of [['folded',0,s.counter],['opening',.75,s.reading],['tied',.7,s.tie],['kept',.7,s.bag]]){const p=api.pawSlipPose(stage,age,s);assert.ok(Math.abs(p.x-a.x)<.001&&Math.abs(p.y-a.y)<.001);if(['kept','tied'].includes(stage))assert.equal(p.alpha,0)}
for(let i=0;i<=100;i++){const p=api.pawSlipPose('opening',i*.0075,s);assert.ok(p.w>=105&&p.w<=460&&p.h>=82&&p.h<=380)}
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1280,720],[1920,1080]]){const a=api.pawSlipRackCamera(w,h);for(const q of s.rows.flat())assert.ok(a.ox+q.x*a.s>=0&&a.ox+q.x*a.s<=w&&a.oy+q.y*a.s>=0&&a.oy+q.y*a.s<=h)}
const data=Array.from({length:44},(_,i)=>i);assert.equal(api.pawSlipPage(data,99).entries.length,2);assert.equal(api.pawSlipPage(data,-1).entries[0],0);assert.equal(api.pawSlipPage([],5).pages,1);
console.log('Painted ritual alcove and fortune counter checks passed.');

const skin=new Function(get('PAINTED_SLIP_SKIN')+';return {pawSlipGrades,pawSlipMessageGrades,pawSlipSkin,pawSlipSkinPath,pawSlipSkinBox}')();
for(const [words,grade] of Object.entries(skin.pawSlipMessageGrades))assert.equal(skin.pawSlipSkin(1,[[words,'']]),grade);
assert.equal(skin.pawSlipSkin(99,[]),'moderate');
assert.equal(skin.pawSlipSkin(1,[['unrecognized']]),'moderate');
for(const grade of Object.keys(skin.pawSlipGrades))for(const folded of [false,true]){
 const name=grade+'-'+(folded?'folded':'unfolded')+'.webp';assert.equal(skin.pawSlipSkinPath(grade,folded),'../temple/slips/'+name);assert.ok(fs.existsSync(path.join(root,'assets/visual/painted/temple/slips',name)));
 const iw=folded?336:317,ih=folded?194:473;const b=skin.pawSlipSkinBox({w:460,h:380},iw,ih,folded);assert.ok(b.w<=460&&b.h<=380*(folded?1:1.38)+1e-8);assert.ok(Math.abs(b.w/b.h-iw/ih)<1e-8);
}
assert.equal(skin.pawSlipSkinBox({w:0,h:10},1,1,false),null);

/* Off-centre grips must follow the same illustrated ladle point during
   drag and release. Assist input has no drag and uses the authored target. */
const water=new Function(get('PURIFICATION_PAINT')+';return {pawWaterGeometry,pawWaterGripPoint,pawWaterDropMatches,pawWaterDestination}')();
const waterGeo=water.pawWaterGeometry();
for(const stage of [0,1])for(const dx of [-35,0,35])for(const dy of [-15,0,15]){
 const h={x:300,y:400,w:82,h:40},gesture={id:'templeLadle',h,sx:341+dx,sy:420+dy};
 const dest=water.pawWaterDestination(stage,waterGeo);
 const p=water.pawWaterGripPoint({x:dest.x+dx,y:dest.y+dy},gesture);
 assert.ok(Math.hypot(p.x-dest.x,p.y-dest.y)<1e-8);
 assert.ok(water.pawWaterDropMatches(stage,p.x,p.y,waterGeo));
 const miss=water.pawWaterGripPoint({x:dest.x+dx+70,y:dest.y+dy},gesture);
 assert.equal(water.pawWaterDropMatches(stage,miss.x,miss.y,waterGeo),false);
}
assert.deepEqual(water.pawWaterGripPoint(waterGeo.scoop,null),waterGeo.scoop);
assert.equal(water.pawWaterDropMatches(2,waterGeo.pour.x,waterGeo.pour.y,waterGeo),false);
console.log('Painted water grip and drop alignment checks passed.');

const contact=new Function(get('TEMPLE_OWNER_CONTACT')+get('PAINTED_GARDEN')+';return {pawTempleContactScale,pawIncenseSupply,pawIncensePickup,pawRearBenchPose,pawRearGardenSway,pawRearGardenPlate}')();
const hall={x:100,y:-145,w:600,h:600*1648/928};
for(let held=0;held<3;held++){
 const before=contact.pawIncenseSupply(hall,held,'taking',.31),after=contact.pawIncenseSupply(hall,held,'taking',.32);
 assert.equal(before.remaining.length,3-held);assert.equal(after.remaining.length,2-held);
 const hand={x:1,y:2},picked=contact.pawIncensePickup(hand,after.pick,.32),end=contact.pawIncensePickup(hand,after.pick,.72);
 assert.ok(Math.hypot(picked.x-after.pick.x,picked.y-after.pick.y)<1e-6);
 assert.ok(Math.hypot(end.x-hand.x,end.y-hand.y)<1e-6);
}
for(const c of [.45,.55,.65,.75,1.2]){
 const scale=contact.pawTempleContactScale(c,1.72),pose=contact.pawRearBenchPose(contact.pawRearGardenPlate,scale);
 assert.ok(scale>=1.72&&scale<=2.15);
 assert.ok(Math.abs(pose.y-32*scale-pose.hip.y)<1e-8);
 assert.ok(Math.abs(pose.x+9*scale-pose.hip.x)<1e-8);
}
for(const kind of ['chime','cats']){
 assert.notEqual(contact.pawRearGardenSway(.3,false,kind),0);
 assert.equal(contact.pawRearGardenSway(4,false,kind),0);
 assert.equal(contact.pawRearGardenSway(.3,true,kind),0);
}
console.log('Temple incense supply, character scale, bench contact and garden reaction checks passed.');

const fixes=new Function(get('TEMPLE_OWNER_CONTACT')+get('PAINTED_GARDEN')+';return {pawIncenseReturnFoot,pawRearCatChoice,pawRearCatFigurines}')();
const plate={x:100,y:-145,w:600,h:600*1648/928};
for(let i=0;i<=100;i++){const a=fixes.pawIncenseReturnFoot(plate,i*.011);assert.ok(a.x>=400-1e-8&&a.x<=466+1e-8);assert.ok(a.y>=plate.y+plate.h*.572-1e-8);}
const q={};for(let i=0;i<6;i++){assert.equal(fixes.pawRearCatChoice(q,i).length,2);assert.equal(q.pawCatChoice,i)}assert.equal(fixes.pawRearCatChoice(q,6),null);
console.log('Retreat and six ceramic figurine choices passed.');

/* A rejected gesture cannot leave a moving pickup target in the previous
   frame. A fresh pointer waits for the resting tool to be registered. */
const pickup=new Function(get('PURIFICATION_PAINT')+';return {pawWaterGeometry,pawWaterPickupBox,pawWaterGripPoint,pawWaterDropMatches,pawWaterCamera}')();
const pg=pickup.pawWaterGeometry();
for(const [w,h] of [[320,568],[360,640],[390,844],[768,1024],[1440,900]])for(const stage of [0,1]){
 const scale=pickup.pawWaterCamera(w,h).s;
 for(const dx of [-20,0,20])for(const dy of [-10,0,10]){
  const box=pickup.pawWaterPickupBox(stage,false,pg.rest,scale),gesture={id:'templeLadle',h:box,sx:pg.rest.x+dx,sy:pg.rest.y+dy};
  assert.ok(box.w*scale>=44-1e-8&&box.h*scale>=44-1e-8);
  assert.equal(pickup.pawWaterPickupBox(stage,true,pg.basin,scale),null);
  const dest=stage===0?pg.scoop:pg.pour,q=pickup.pawWaterGripPoint({x:dest.x+dx,y:dest.y+dy},gesture);
  assert.ok(pickup.pawWaterDropMatches(stage,q.x,q.y,pg));
  assert.ok(!pickup.pawWaterDropMatches(stage,q.x-65,q.y+65,pg));
  assert.deepEqual(pickup.pawWaterPickupBox(stage,false,pg.rest,scale),box);
  assert.equal(pickup.pawWaterPickupBox(2,false,dest,scale),null);
  assert.equal(pickup.pawWaterPickupBox(3,false,dest,scale),null);
 }
}
assert.ok(src.includes('const gripBox=pawWaterPickupBox(stage,held,at,cam.scale);'));
assert.ok(src.includes("if(gripBox)target(gripBox.x,gripBox.y,gripBox.w,gripBox.h,()=>{},'templeLadle');"));
console.log('Resting ladle retry and exclusive held-tool ownership checks passed.');

/* Painted smoke is anchored to the actual lit-stick tip and stays subtle
   through the final-to-first frame transition, with a fixed reduced-motion pose. */
{
 const code=get('PAINTED_INCENSE_SMOKE');
 const art=Array.from({length:8},(_,i)=>({complete:true,naturalWidth:256,naturalHeight:256,id:i}));
 const api=new Function('pawRecoveredImage','roomIntro','start',code+';return {layers:pawSmokeLayers,draw:pawDrawPaintedSmoke,paths:pawSmokePaths,images:pawSmokeImages}')(()=>null,()=>{},()=>{});
 let n=0;const check=(v,m)=>{assert.ok(v,m);n++};
 for(const strength of [.82,1])for(let i=0;i<720;i++){
  const layers=api.layers(400,420,i*.01,strength);
  check(layers.every(p=>p.frame>=0&&p.frame<8&&Math.abs(p.y+p.h*.98-420)<1e-7&&Math.abs(p.x+p.w*.5-400)<1e-7),'emitter stays registered');
  check(Math.abs(layers.reduce((z,p)=>z+p.alpha,0)-.35*strength)<1e-7,'crossfade opacity bounded');
 }
 check(JSON.stringify(api.layers(400,420,0,1,true))===JSON.stringify(api.layers(400,420,500,1,true)),'reduced motion fixed');
 check(api.layers(400,420,NaN,1).length===0,'invalid time rejected');
 check(api.layers(400,420,0,0).length===0,'zero strength rejected');
 const calls=[],stack=[],g={globalAlpha:.5,save(){stack.push(this.globalAlpha)},restore(){this.globalAlpha=stack.pop()},drawImage(...v){calls.push([this.globalAlpha,...v])}};
 check(api.draw(g,art,400,420,1,1),'painted smoke drawn');
 check(g.globalAlpha===.5&&stack.length===0,'canvas alpha restored');
 check(calls.every(c=>c[0]<=.175),'existing canvas alpha preserved');
 check(!api.draw(g,art.slice(1),400,420,1,1),'incomplete frame set falls back');
 check(!api.draw(g,art.map((v,i)=>i===3?{...v,naturalWidth:128}:v),400,420,1,1),'wrong dimensions fall back');
 check(api.images()===null,'unavailable images do not lock a partial set');
 for(const p of api.paths)check(fs.existsSync(path.resolve(root,'assets/visual/painted/recovered',p)),'uploaded frame exists');
 check(src.includes("if(pawDrawPaintedSmoke(ctx,state.pawSmokeArt,x,y,t,strength,residentReducedMotion.matches))return;"),'actual emitter calls painted renderer');
 check(src.includes('if(lit&&smoke)pawVisibleSmoke('),'unlit sticks do not emit smoke');
 console.log('PASS '+n+' painted incense smoke registration, frame, opacity and fallback assertions.');
}

/* One physical ladle centre for both rendering and release, and the four
   existing illustrated seated traveller poses at the cushion contact. */
{
 const a=new Function(get('PURIFICATION_PAINT')+get('REAR_SEATED_ART')+';return {pawWaterGeometry,pawWaterActorScale,pawWaterDragCentre,pawWaterLadlePoint,pawWaterShoulder,pawWaterDropMatches,pawRearSeatedBox,pawRearSeatedRecords}')();
 const g=a.pawWaterGeometry(),scale=a.pawWaterActorScale(),shoulder=a.pawWaterShoulder(g,scale);
 let checks=0;
 for(let x=200;x<=450;x+=5)for(let y=300;y<=500;y+=5){
  const v=a.pawWaterDragCentre({x,y},g,scale),hand=a.pawWaterLadlePoint(v,0,-25,1);
  assert.ok(Math.hypot(hand.x-shoulder.x,hand.y-shoulder.y)<=42*scale+1e-8);checks++
 }
 for(const [stage,d] of [[0,g.scoop],[1,g.pour]]){
  const v=a.pawWaterDragCentre(d,g,scale);assert.ok(a.pawWaterDropMatches(stage,v.x,v.y,g));checks++
 }
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/visual/staging/2026-11-27-extracted/manifest.json'),'utf8'));
 const records=Object.values(manifest).find(x=>Array.isArray(x)&&x.some(y=>y.path?.endsWith('/seated.webp')));
 for(let id=0;id<4;id++){
  const r=a.pawRearSeatedRecords[id],m=records.find(x=>x.path.endsWith('/players/'+id+'/seated.webp'));
  assert.equal(r.w,m.width);assert.equal(r.h,m.height);assert.ok(fs.existsSync(path.join(root,m.path)));
  for(const sc of [1.35,1.72,2.25])for(const hip of [{x:200,y:320},{x:410,y:580}]){
   const q=a.pawRearSeatedBox(id,hip,sc);
   assert.ok(Math.abs(q.x+q.w-q.hipX-hip.x)<1e-8&&Math.abs(q.y+q.hipY-hip.y)<1e-8&&Math.abs(q.w/q.h-r.w/r.h)<1e-8);checks++
  }
 }
 assert.ok(src.includes("a=pawWaterDragCentre(a,g,pawWaterActorScale())"));
 assert.ok(src.includes("at=pawWaterDragCentre(pawWaterGripPoint(drag,drag),g,pawWaterActorScale())"));
 assert.ok(src.includes("pawDrawRearSeated(im,id,a.hip,scale)"));
 console.log('PASS '+checks+' ladle reach, drop and seated pose geometry cases');
}

/* Reach only after the traveller arrives; hand follows the exact prop. */
{
 const a=new Function(get('PURIFICATION_PAINT')+get('ALCOVE_PAINT')+';return {pawAlcoveGeometry,pawAlcoveStickPoint,pawAlcoveStickContact}')();
 const g=a.pawAlcoveGeometry();let n=0;
 for(let i=0;i<=1000;i++){
  const pick=i/1000,p={picked:true,fall:1,pick},c=a.pawAlcoveStickContact(g,p),pt=a.pawAlcoveStickPoint(g,p);
  assert.ok(c.foot.x>=g.stickFoot.x&&c.foot.x<=g.stickPickFoot.x);n++;
  if(pick<.45){assert.equal(c.hand,null);assert.equal(pt.x,g.stickTray.x);assert.equal(pt.y,g.stickTray.y);n+=3}
  else{assert.equal(c.walking,false);assert.deepEqual(c.hand,pt);assert.ok(Math.hypot(c.hand.x-c.shoulder.x,c.hand.y-c.shoulder.y)<=c.maxReach);n+=3}
 }
 assert.equal(a.pawAlcoveStickContact(g,{picked:false,shake:false}).hand,null);
 assert.deepEqual(a.pawAlcoveStickContact(g,{picked:false,shake:true}).hand,g.tubeGrip);
 console.log('PASS '+(n+2)+' physical stick approach and contact checks');
}
