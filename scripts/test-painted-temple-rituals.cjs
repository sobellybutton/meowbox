'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const get=name=>src.split('/* PAW_'+name+'_BEGIN */')[1].split('/* PAW_'+name+'_END */')[0];
const api=new Function(get('PURIFICATION_PAINT')+get('ALCOVE_PAINT')+get('SLIP_COUNTER')+';return {pawAlcoveGeometry,pawAlcoveReach,pawAlcoveActorScale,pawAlcoveStickPoint,pawAlcoveMoonPoint,pawSlipGeometry,pawSlipPose,pawSlipRackCamera,pawSlipPage}')();
for(const name of ['sticks','slip-counter'])assert.ok(fs.existsSync(path.join(root,'assets/visual/staging/2026-11-27/rooms/temple',name+'.webp')));
const g=api.pawAlcoveGeometry();
for(let i=0;i<=100;i++){const f=i/100,a=api.pawAlcoveStickPoint(g,{fall:f,picked:false,pick:0});assert.ok(a.x>=g.tubeTop.x&&a.x<=g.stickTray.x&&Number.isFinite(a.y))}
const landed=api.pawAlcoveStickPoint(g,{fall:1,picked:false,pick:0});assert.equal(landed.y,g.stickTray.y);assert.equal(landed.x,g.stickTray.x);
const held=api.pawAlcoveStickPoint(g,{fall:1,picked:true,pick:1});const grip=api.pawAlcoveReach(g.stickPickFoot).grip;assert.equal(held.x,grip.x);assert.equal(held.y,grip.y);
for(let i=0;i<=100;i++){const u=i/100,pick=.45+.55*u,f=u*u*(3-2*u),p=api.pawAlcoveStickPoint(g,{fall:1,picked:true,pick});assert.ok(Math.abs(p.x-(g.stickTray.x+(grip.x-g.stickTray.x)*f))<1e-8&&Math.abs(p.y-(g.stickTray.y+(grip.y-g.stickTray.y)*f))<1e-8);}
for(const [foot,hand,side] of [[g.stickFoot,g.tubeGrip,1],[g.stickPickFoot,g.stickTray,1],[g.moonFoot,g.moonHand,1]]){const r=api.pawAlcoveReach(foot,side);assert.ok(Math.hypot(hand.x-r.shoulder.x,hand.y-r.shoulder.y)<=r.maxReach);assert.equal(r.sleeve,.72*api.pawAlcoveActorScale());}
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

{
 const fixes=fs.readFileSync(path.join(root,'src/release-fixes.js'),'utf8');
 const pure=fixes.split('/* PAW_CONTINUOUS_FORTUNE_BEGIN */')[1].split('/* PAW_CONTINUOUS_FORTUNE_END */')[0];
 const f=new Function(pure+';return {pawPairedNext,pawPairedWalkPlan,pawPairedWalkTick,pawPairedCamera,pawGardenEntryRest}')();
 let n=0;const ck=(v,m)=>{assert.ok(v,m);n++};
 for(let failures=0;failures<=3;failures++){
  const q={pawFortuneNumber:5,count:1,result:1,pawFortuneFailures:failures};
  ck(f.pawPairedNext(q,'moon',2,false)===(failures>=3?'finish':'retry'),'three failed casts');
  ck(f.pawPairedNext({...q,result:0},'moon',2,false)==='receive','confirmed only');
  ck(f.pawPairedNext({...q,moonPending:true},'moon',2,false)===null,'wait for landing');
  ck(f.pawPairedNext({...q,pawFortuneNumber:null},'moon',2,false)===null,'no independent cast');
  ck(f.pawPairedNext({...q,pawPairedWalk:{}},'moon',2,false)===null,'walk input locked');
 }
 const plate={x:100,y:-145,w:600,h:600*1635/962};
 const geom=api.pawAlcoveGeometry(plate);
 for(const from of ['sticks','moon'])for(const reduced of [false,true]){
  const q=f.pawPairedWalkPlan(from,true,geom,plate,0),start={...q.pos};
  ck(!f.pawPairedWalkTick(q,50,true,reduced)&&q.pos.x===start.x&&q.pos.y===start.y,'pause');
  let i=0;while(!f.pawPairedWalkTick(q,50+(++i)*.016,false,reduced)&&i<1000){ck(q.pos.y>=Math.min(geom.stickFoot.y,geom.moonFoot.y)-1e-7,'walk on lower aisle')}
  const dest=from==='sticks'?geom.moonFoot:geom.stickFoot;
  ck(q.path.length===0&&Math.hypot(q.pos.x-dest.x,q.pos.y-dest.y)<1e-7,'arrive physically');
 }
 for(const [w,h] of [[320,568],[390,844],[430,932],[320,932],[768,1024],[1440,900]]){
  const c=f.pawPairedCamera(w,h,plate);
  for(const p of [geom.stickFoot,geom.moonFoot,geom.tube,geom.moonTray])ck(c.ox+p.x*c.s>=0&&c.ox+p.x*c.s<=w&&c.oy+p.y*c.s>=0&&c.oy+p.y*c.s<=h,'both stations remain in frame')
 }
 const rest=f.pawGardenEntryRest({entry:[.48,.78]},10);ck(rest.route.length===0&&rest.action===null&&rest.pos[1]===.78,'garden entry waits for player');
 ck(fixes.includes('queueMicrotask(pawInstallContinuousFortune)'),'late runtime installation');
 console.log('PASS '+n+' paired ritual route, failure gate, shared camera and garden entry checks');
}

{
 const fixes=fs.readFileSync(path.join(root,'src/release-fixes.js'),'utf8');
 const code=fixes.split('/* PAW_TEMPLE_AUTO_ARRIVAL_BEGIN */')[1].split('/* PAW_TEMPLE_AUTO_ARRIVAL_END */')[0];
 const a=new Function(code+';return {pawTempleAutoArrival,pawGardenSeatAtNode}')();
 const q={route:[],pos:[.49,.82],destination:null};
 assert.ok(a.pawTempleAutoArrival(q,false));
 for(const patch of [{pawAutoArrival:true},{destination:'exit'},{route:[[.47,.73]]},{greeted:true},{catVisited:true}])assert.ok(!a.pawTempleAutoArrival({...q,...patch},false));
 assert.ok(!a.pawTempleAutoArrival(q,true));
 assert.ok(a.pawGardenSeatAtNode({route:[],pos:[.78,.475]},[.78,.475]));
 assert.ok(!a.pawGardenSeatAtNode({route:[],pos:[.48,.78]},[.78,.475]));
 assert.ok(!a.pawGardenSeatAtNode({route:[[.78,.475]],pos:[.78,.475]},[.78,.475]));
 console.log('PASS 10 temple auto-arrival and garden seated ownership checks');
}

/* The traveller must reach the tray before the hand touches the stick.
   Throughout retrieval, including the last frame, the prop and hand share
   one point. No arm is painted during the approach. */
{
 const a=new Function(get('PURIFICATION_PAINT')+get('ALCOVE_PAINT')+';return {pawAlcoveGeometry,pawAlcoveStickPoint,pawAlcoveStickContact}')();
 const g=a.pawAlcoveGeometry();
 let n=0;const ck=v=>{assert.ok(v);n++};
 for(let i=0;i<=1000;i++){
  const pick=i/1000,p={picked:true,fall:1,pick},c=a.pawAlcoveStickContact(g,p),pt=a.pawAlcoveStickPoint(g,p);
  ck(c.scale===1.92);ck(c.foot.x>=g.stickFoot.x&&c.foot.x<=g.stickPickFoot.x);
  if(pick<.45){ck(c.hand===null);ck(pt.x===g.stickTray.x&&pt.y===g.stickTray.y)}
  else{ck(!c.walking);ck(c.hand&&Math.hypot(c.hand.x-pt.x,c.hand.y-pt.y)<1e-9);ck(Math.hypot(c.hand.x-c.reach.shoulder.x,c.hand.y-c.reach.shoulder.y)<=c.reach.maxReach)}
 }
 ck(a.pawAlcoveStickContact(g,{picked:false,shake:false},false).hand===null);
 ck(a.pawAlcoveStickContact(g,{picked:false,shake:true}).hand===g.tubeGrip);
 console.log('PASS '+n+' alcove approach, reach and stick contact assertions');
}



// Physical contact: the mirrored rotation is identical for the painted
// ladle, the gripping hand and the stream origin, with bounded arm reach.
const physicalWater=new Function(get('PURIFICATION_PAINT')+';return {pawWaterGeometry,pawWaterLadlePoint,pawWaterShoulder,pawWaterDragCentre,pawWaterDestination,pawWaterDropMatches}')();
const wg=physicalWater.pawWaterGeometry(),ws=1.92,wsh=physicalWater.pawWaterShoulder(wg,ws);
for(let i=0;i<=100;i++){
 const angle=.58*i/100,p=physicalWater.pawWaterLadlePoint(wg.pour,angle,-25,1),b=physicalWater.pawWaterLadlePoint(wg.pour,angle,35,6);
 assert.ok(Math.abs(Math.hypot(p.x-b.x,p.y-b.y)-.65*Math.hypot(60,5))<1e-7);
 assert.ok(Math.hypot(p.x-wsh.x,p.y-wsh.y)<42*ws);
 if(i)assert.ok(b.y>physicalWater.pawWaterLadlePoint(wg.pour,0,35,6).y);
}
for(let x=240;x<=470;x+=5)for(let y=300;y<=520;y+=5){
 const p=physicalWater.pawWaterDragCentre({x,y},wg,ws),h=physicalWater.pawWaterLadlePoint(p,0,-25,1);
 assert.ok(Math.hypot(h.x-wsh.x,h.y-wsh.y)<=42*ws+1e-7);
}
for(const stage of [0,1]){
 const p=physicalWater.pawWaterDestination(stage,wg),q=physicalWater.pawWaterDragCentre(p,wg,ws);
 assert.ok(Math.hypot(p.x-q.x,p.y-q.y)<1e-7);
 assert.ok(physicalWater.pawWaterDropMatches(stage,q.x,q.y,wg));
}
assert.ok(src.includes('at=pawWaterDragCentre(pawWaterGripPoint(drag,drag),g,pawTemplePaintedActorScale())'));
assert.ok(src.includes('const bowl=pawWaterLadlePoint(at,angle,35,6)'));
console.log('Purification ladle contact and bounded reach checks passed.');
