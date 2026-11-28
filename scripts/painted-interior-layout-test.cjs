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
