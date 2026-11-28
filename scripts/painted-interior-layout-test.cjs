'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('../assets/visual/painted/interior-layouts.js');
for(const [id,q] of Object.entries(api.rooms)){
 const bytes=fs.readFileSync(path.resolve(__dirname,'..',api.asset(id)));
 assert.equal(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),q.blob,'exact reviewed artwork '+id);
 const goals=[q.entry,q.arrival,...Object.values(q.stations).map(v=>v.approach)];
 for(const p of [...goals,q.host,...q.visitors])assert.ok(api.safe(id,p),id+' unsafe '+p);
 for(const a of goals)for(const b of goals){const route=api.route(id,a,b);assert.ok(route,id+' disconnected '+a+' '+b);let prev=a;for(const next of route){assert.ok(api.segment(id,prev,next));prev=next}assert.deepEqual(prev,b)}
 for(const [w,h] of [[360,780],[390,844],[430,932],[768,1024],[1280,720]]){
  const c=api.camera(w,h);assert.ok(c.s>0);
  for(const p of goals){const [x,y]=api.project(p,c);assert.ok(x>=0&&x<=w&&y>=0&&y<=h,id+' crop '+p)}
  if(w<h)assert.ok(c.w>=w-1e-8&&c.h>=h-1e-8&&c.oy<=1e-8&&c.oy+c.h>=h-1e-8);
 }
 assert.equal(api.route(id,[0,0],q.entry),null);
}
assert.equal(api.asset('__proto__'),null);assert.equal(api.camera(0,844),null);
console.log('Painted-room artwork hashes, connected safe lanes and camera checks passed.');

const source=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const start=source.indexOf('/* PAW_READING_LOBBIES_BEGIN */'),end=source.indexOf('/* PAW_READING_LOBBIES_END */');
assert.ok(start>=0&&end>start,'runtime integration missing');
const helpers=new Function(source.slice(start,end)+';return {pawReadingWorld,pawReadingNormalized,pawReadingSpec,pawReadingCamera,pawReadingCompatible,pawReadingDestination};')();
for(const id of ['tarot','destiny','quiz','story','match']){
 const spec=helpers.pawReadingSpec(api,id),points=[spec.entry,spec.arrival,...Object.values(spec.stations).map(v=>v.slice(2)),[spec.entry[0],spec.entry[1]-35]];
 assert.ok(helpers.pawReadingCompatible(api,id,[[id,'en','zh']]));
 assert.ok(!helpers.pawReadingCompatible(api,id,[[id],['unmapped']]));
 for(const a of points){
  assert.ok(a[0]>=145&&a[0]<=655&&a[1]>=565&&a[1]<=738,id+' legacy input bounds');
  assert.ok(api.safe(id,helpers.pawReadingNormalized(...a)),id+' mapped floor');
  for(const b of points)assert.ok(api.route(id,helpers.pawReadingNormalized(...a),helpers.pawReadingNormalized(...b)),id+' mapped route');
 }
 for(const [w,h] of [[320,640],[390,844],[430,932],[768,1024],[1280,720]]){
  const c=helpers.pawReadingCamera(api,w,h);
  for(const [px,py] of points.slice(0,3)){const x=c.ox+px*c.s,y=c.oy+py*c.s;assert.ok(x>=0&&x<=w&&y>=0&&y<=h,id+' mapped camera');}
 }
}
console.log('Five live reading-room coordinate adapters, entrances, exits and station anchors passed.');

const tea=helpers.pawReadingSpec(api,'tea'),teaEntries=[['chat','Join the table','来茶桌坐坐'],['board','Town noticeboard','小镇留言墙']];
assert.ok(helpers.pawReadingCompatible(api,'tea',teaEntries));
assert.ok(!helpers.pawReadingCompatible(api,'tea',[teaEntries[0],teaEntries[0]]));
assert.ok(!helpers.pawReadingCompatible(api,'tea',[teaEntries[0]]));
assert.ok(!helpers.pawReadingCompatible(api,'tea',[teaEntries[0],['unknown']]));
const teaPoints=[tea.entry,tea.arrival,...Object.values(tea.stations).map(v=>v.slice(2)),[tea.entry[0],tea.entry[1]-35]];
for(const a of teaPoints){
 assert.ok(a[0]>=145&&a[0]<=655&&a[1]>=565&&a[1]<=738,'tea input bounds');
 assert.ok(api.safe('tea',helpers.pawReadingNormalized(...a)));
 for(const b of teaPoints)assert.ok(api.route('tea',helpers.pawReadingNormalized(...a),helpers.pawReadingNormalized(...b)),'tea station route');
 for(const [w,h] of [[320,640],[390,844],[430,932],[768,1024],[1280,720]]){
  const c=helpers.pawReadingCamera(api,w,h),x=c.ox+a[0]*c.s,y=c.oy+a[1]*c.s;
  assert.ok(x>=0&&x<=w&&y>=0&&y<=h,'tea mapped camera');
 }
}
console.log('Tea room two-station compatibility, walkable approach, exit and viewport checks passed.');

const pier=helpers.pawReadingSpec(api,'fish');
assert.ok(helpers.pawReadingCompatible(api,'fish',[['hit'],['pier'],['riverShout']]));
assert.ok(!helpers.pawReadingCompatible(api,'fish',[['hit'],['bottle'],['riverShout']]));
assert.ok(!helpers.pawReadingCompatible(api,'fish',[['hit'],['pier']]));
const pierPoints=[pier.entry,pier.arrival,...Object.values(pier.stations).map(v=>v.slice(2))];
assert.ok(pier.stations.riverShout[3]<565,'pier must bypass legacy indoor y clamp');
for(const a of pierPoints){
 assert.ok(api.safe('fish',helpers.pawReadingNormalized(...a)));
 for(const b of pierPoints){
  const route=helpers.pawReadingDestination(api,'fish',a,...b);
  assert.ok(route?.length,'curved pier route');
  assert.ok(Math.hypot(route.at(-1)[0]-b[0],route.at(-1)[1]-b[1])<1e-7);
 }
 for(const [w,h] of [[320,640],[390,844],[430,932],[768,1024],[1280,720]]){
  const c=helpers.pawReadingCamera(api,w,h),x=c.ox+a[0]*c.s,y=c.oy+a[1]*c.s;
  assert.ok(x>=0&&x<=w&&y>=0&&y<=h,'pier mapped camera');
 }
}
assert.equal(helpers.pawReadingDestination(api,'fish',pier.entry,400,200),null);
console.log('Pier actual action IDs, curved path, legacy clamp bypass and camera checks passed.');

// Arcade art contains inactive claw and rhythm decorations. Only these three
// curated stations are eligible for interaction after runtime integration.
const arcade=api.rooms.arcade;
assert.deepEqual(Object.keys(arcade.stations),['bubbleArcade','goldfishScoop','blindBox']);
assert.ok(!api.safe('arcade',[.82,.65]),'do not walk inside the fish tank');
assert.ok(!api.safe('arcade',[.18,.52]),'do not walk inside the cabinets');
assert.ok(api.safe('arcade',arcade.entry));
for(const s of Object.values(arcade.stations))assert.ok(api.route('arcade',arcade.entry,s.approach));
console.log('Arcade painted floor, three curated stations and fixture exclusion checks passed.');

assert.ok(helpers.pawReadingCompatible(api,'arcade',[['bubbleArcade'],['goldfishScoop'],['blindBox']]));
assert.ok(!helpers.pawReadingCompatible(api,'arcade',[['claw'],['rhythm'],['blindBox']]));
const foodStart=source.indexOf('/* PAW_FOOD_PAINT_BEGIN */'),foodEnd=source.indexOf('/* PAW_FOOD_PAINT_END */'),exitStart=source.indexOf('/* PAW_MAPPED_EXIT_BEGIN */'),exitEnd=source.indexOf('/* PAW_MAPPED_EXIT_END */');
const exits=new Function(source.slice(foodStart,foodEnd)+source.slice(start,end)+source.slice(exitStart,exitEnd)+';return {pawMappedExitPlan,pawFoodExitPlan};')();
const arcadeSpec=helpers.pawReadingSpec(api,'arcade');
for(const p of [arcadeSpec.arrival,...Object.values(arcadeSpec.stations).map(v=>v.slice(2))])assert.ok(exits.pawMappedExitPlan(api,'arcade',p));
assert.equal(exits.pawMappedExitPlan(api,'arcade',arcadeSpec.entry).arrived,true);
for(const id of ['kitchen','boba']){
 for(const point of [[400,690],[400,675],[400,735]])assert.ok(exits.pawFoodExitPlan(id,point));
 assert.equal(exits.pawFoodExitPlan(id,[400,735]).arrived,true);
 assert.equal(exits.pawFoodExitPlan(id,[100,400]),null);
}
console.log('Arcade runtime compatibility and painted food shop exit plans passed.');

// Park retains distinct animal approach points; the painted fence, water,
// bench and feeder are not walkable ground.
const park=api.rooms.park;
assert.deepEqual(Object.keys(park.stations),['pet','deerVisit']);
assert.equal(api.safe('park',[.82,.47]),false);
assert.equal(api.safe('park',[.21,.36]),false);
assert.equal(api.safe('park',[.50,.22]),false);
const parkRoute=api.route('park',park.entry,park.stations.pet.approach);
assert.ok(parkRoute.length>2,'park path must follow the bend');
assert.ok(!api.segment('park',park.entry,park.stations.pet.approach));
assert.ok(api.route('park',park.stations.pet.approach,park.stations.deerVisit.approach));
console.log('Park path bend, animal approach and obstacle exclusions passed.');

assert.ok(helpers.pawReadingCompatible(api,'park',[['pet'],['deerVisit']]));
assert.ok(!helpers.pawReadingCompatible(api,'park',[['pet'],['deerVisit'],['chat']]));
const parkSpec=helpers.pawReadingSpec(api,'park');
for(const p of [parkSpec.entry,parkSpec.arrival,...Object.values(parkSpec.stations).map(v=>v.slice(2))]){
 for(const to of [parkSpec.entry,parkSpec.arrival,...Object.values(parkSpec.stations).map(v=>v.slice(2))])assert.ok(helpers.pawReadingDestination(api,'park',p,...to));
 assert.ok(exits.pawMappedExitPlan(api,'park',p));
}
const animalStart=source.indexOf('/* PAW_PARK_LOBBY_BEGIN */'),animalEnd=source.indexOf('/* PAW_PARK_LOBBY_END */');
assert.ok(animalStart>=0&&animalEnd>animalStart);
const animals=new Function(source.slice(animalStart,animalEnd)+';return pawParkLobbyAnimal')();
for(const id of ['pet','deerVisit']){const a=animals(id);assert.ok(a.scale>0&&a.scale<.3);assert.ok(a.foot.every(x=>x>0&&x<1))}
assert.equal(animals('chat'),null);
console.log('Park live admission, animal staging and threshold exit checks passed.');

const visitorStart=source.indexOf('/* PAW_MAPPED_VISITORS_BEGIN */'),visitorEnd=source.indexOf('/* PAW_MAPPED_VISITORS_END */');
const guestStart=source.indexOf('function pawGuestClear('),guestEnd=source.indexOf('function pawGuestStationFeet(');
assert.ok(visitorStart>=0&&visitorEnd>visitorStart&&guestStart>=0&&guestEnd>guestStart);
const segmentStart=source.indexOf('function pawGuestSegment('),segmentEnd=source.indexOf('function pawGuestSpaced(');
const routeStart=source.indexOf('function pawVisitorDoorRoute('),routeEnd=source.indexOf('function pawVisitorVisible(');
assert.ok(segmentStart>=0&&segmentEnd>segmentStart&&routeStart>=0&&routeEnd>routeStart);
const visitor=new Function(source.slice(start,end)+source.slice(guestStart,guestEnd)+source.slice(segmentStart,segmentEnd)+source.slice(routeStart,routeEnd)+source.slice(visitorStart,visitorEnd)+';return {pawMappedGuestGaps,pawMappedVisitorPoints,pawReadingNormalized,pawReadingSpec,pawGuestClear,pawGuestSegment,pawVisitorDoorRoute,pawReadingDestination,pawReadingWorld,pawChooseConnectedGuestPoints};')();
const gap=visitor.pawMappedGuestGaps(true),legacyGap=visitor.pawMappedGuestGaps(false);
assert.equal(legacyGap.station,52);assert.equal(legacyGap.spawn,90);
for(const id of Object.keys(api.rooms)){
 const spec=visitor.pawReadingSpec(api,id),points=visitor.pawMappedVisitorPoints(api,id);
 assert.ok(points.length>0&&points.length<=8,id+' room has safe guest candidates');
 assert.deepEqual(points,visitor.pawMappedVisitorPoints(api,id),'stable guest candidates');
 const safe=(x,y)=>api.safe(id,visitor.pawReadingNormalized(x,y));
 const segment=(a,b)=>api.segment(id,visitor.pawReadingNormalized(...a),visitor.pawReadingNormalized(...b));
 const route=(a,b)=>visitor.pawReadingDestination(api,id,a,...b);
 const stations=Object.values(spec.stations).map(v=>v.slice(2));
 const reserved=[spec.entry,[spec.entry[0],spec.entry[1]-35],spec.arrival,...stations];
 const host=['quiz','story','match'].includes(id)?[]:[visitor.pawReadingWorld(id==='destiny'?[.58,.446]:api.rooms[id].host)];
 assert.ok(visitor.pawVisitorDoorRoute(spec.entry,points[0],stations,safe,route,gap.station,segment),id+' guest seed can enter and leave');
 for(let i=1;i<points.length;i++){
  assert.ok(points.slice(0,i).some(p=>segment(p,points[i])&&visitor.pawGuestSegment(p,points[i],reserved,gap.station)&&visitor.pawGuestSegment(p,points[i],host,gap.host)),id+' connected guest stops');
  assert.ok(visitor.pawGuestClear(...points[i],points.slice(0,i),18),id+' spread walking stops');
 }

 for(const p of points){
  assert.ok(api.safe(id,visitor.pawReadingNormalized(...p)),id+' guest floor');
  assert.ok(visitor.pawGuestClear(...p,[spec.entry],gap.entry),id+' threshold clearance');
  assert.ok(visitor.pawGuestClear(...p,[spec.arrival],gap.spawn),id+' player arrival clearance');
  assert.ok(visitor.pawGuestClear(...p,Object.values(spec.stations).map(v=>v.slice(2)),gap.station),id+' station clearance');
 }
}
assert.ok(source.includes("room==='arcade'?['Arcade keeper','游戏厅店主']"));
assert.ok(source.includes("room==='arcade'?'bubbleArcade':room,n:name"));
console.log('Mapped public-room visitor candidates and arcade keeper registration passed.');

// Direct joystick movement must not follow an indirect route around a wall,
// nor use the old rectangular room limits. Test eight directions near edges.
const manual=new Function(source.slice(start,end)+';return {pawReadingWorld,pawReadingNormalized,pawReadingManualStep};')();
let manualMoves=0,manualBlocked=0;
for(const id of Object.keys(api.rooms))for(let i=0;i<=100;i+=2){
 const y=i/100,b=api.bounds(id,y);if(!b)continue;
 for(const f of [0,.01,.25,.5,.75,.99,1]){
  const point=[b[0]+(b[1]-b[0])*f,y],from=manual.pawReadingWorld(point);
  for(const [dx,dy] of [[45,0],[-45,0],[0,45],[0,-45],[31.82,31.82],[-31.82,31.82],[31.82,-31.82],[-31.82,-31.82]]){
   const to=manual.pawReadingManualStep(api,id,from,dx,dy);
   if(!to){manualBlocked++;continue}
   manualMoves++;
   const n=manual.pawReadingNormalized(...to);
   assert.ok(api.safe(id,n),id+' manual floor');
   assert.ok(api.segment(id,point,n),id+' manual segment');
   assert.ok(Math.hypot(to[0]-from[0],to[1]-from[1])<=Math.hypot(dx,dy)+.001,id+' manual distance');
   assert.ok((to[0]-from[0])*dx+(to[1]-from[1])*dy>0,id+' manual direction');
  }
 }
}
assert.ok(manualMoves>8000&&manualBlocked>0);
console.log('Mapped room manual walking: '+manualMoves+' safe steps, '+manualBlocked+' blocked steps.');
