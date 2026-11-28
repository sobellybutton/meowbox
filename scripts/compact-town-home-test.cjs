'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('src/compact-town-home.js','utf8');
new vm.Script(src);
const helper=src.split('// PAW_COMPACT_HELPERS_BEGIN')[1].split('// PAW_COMPACT_HELPERS_END')[0];
const api=new Function(helper+';return {pageWindow,residentLabel,residentHeading,residentDialogue,residentPortraitPath,roomLampAnchor,roomLightState,cutawayPlan,cutawayFree,cutawayConnected,cutawayMove,cutawayRoute,cutawayApproach,cutawayArtPaths,cutawayArtReady,cutawayDepth,cutawayFootPivot,cutawayDragOwner}')();
assert.deepEqual(api.pageWindow(0,5,2),{page:0,pages:1,start:0,end:0});
assert.deepEqual(api.pageWindow(5,9,2),{page:2,pages:3,start:4,end:5});
assert.deepEqual(api.pageWindow(5,-1,2),{page:0,pages:3,start:0,end:2});
assert.deepEqual(api.pageWindow(5,2,1),{page:2,pages:5,start:2,end:3});
assert(api.residentLabel('Fictional resident'));assert(api.residentLabel('虚构居民'));
assert(!api.residentLabel('Auntie Mei'));assert(!api.residentLabel('2026-11-28'));
assert.equal(api.residentHeading('Town notice · fictional'),'Town notice');
assert.equal(api.residentHeading('小镇公告 · 虚构'),'小镇公告');
assert.equal(api.residentDialogue('Hello (Fictional guest)'),'Hello');
assert.equal(api.residentDialogue('你好 （虚构客串角色）'),'你好');
assert.equal(api.residentDialogue('3 / 5 · Fictional resident notices'),'3 / 5 · Town noticeboard');
assert.equal(api.residentDialogue('Auntie Mei'),'Auntie Mei');
const manifest=JSON.parse(fs.readFileSync('assets/visual/painted/runtime.json','utf8'));
for(const [en,cn,key] of [['Auntie Mei','梅姨','auntie-mei'],['Grandma','外婆','grandma'],['Master Yue','月师傅','master-yue'],['Auntie Lin','林姨','auntie-lin'],['Wang Laoban','王老板','wang-laoban'],['Auntie Hong','红姐','auntie-hong'],['Grumpy Ah Ma','暴躁阿嬷','ah-ma'],['Temple keeper','庙祝','temple-keeper'],['Fortune Teller','占卜师','fortune-teller']]){
 assert.equal(api.residentPortraitPath(en),manifest.residents[key].warm.path);
 assert.equal(api.residentPortraitPath(cn),manifest.residents[key].warm.path)
}
assert.equal(api.residentPortraitPath('Unknown traveller'),null);
assert(src.includes("if(communityTab==='lounge')dressTeaTable(q)"),'portraits only in authored tea chat');
assert.deepEqual(api.roomLampAnchor('chineseLantern',50,3.2,100,400),{x:50,y:15.7});
assert.deepEqual(api.roomLampAnchor('lamp',25,80,100,400),{x:25,y:71.25});
assert.equal(api.roomLampAnchor('lamp',50,80,0,400),null);
assert.equal(api.roomLampAnchor('lamp',NaN,80,100,400),null);
assert.equal(api.roomLampAnchor('bed',50,80,100,400),null);
assert.equal(api.roomLightState(0,false),'day');
assert.equal(api.roomLightState(1,false),'lit');
assert.equal(api.roomLightState(1,true),'dim');
const layout=require('../src/home-layout.js');
const source=[{id:'futon',x:29,y:81},{id:'lamp',x:77,y:72},{id:'basicTable',x:65,y:85}];
const before=JSON.stringify(source);
for(const room of ['starter','side','studio']){
 const plan=api.cutawayPlan(layout,room,source);
 assert(plan&&plan.length===source.length);
 assert(api.cutawayConnected(layout,room,plan));
 assert.equal(JSON.stringify(source),before);
 const free=api.cutawayFree(layout,room,plan);
 assert(free.length>0);
 assert(api.cutawayRoute(layout,room,plan,free[0],free.at(-1))!==null);
 assert.deepEqual(api.cutawayPlan(layout,room,source,plan),plan);
 assert.equal(api.cutawayMove(layout,room,plan,'lamp',{u:99,v:99},free[0]),null);
 assert.equal(api.cutawayMove(layout,room,plan,'missing',free[0],free[0]),null);
 for(const item of plan){
  const approach=api.cutawayApproach(layout,room,plan,item,free[0]);
  if(approach)assert(api.cutawayRoute(layout,room,plan,free[0],approach)!==null);
 }
 const lamp=plan.find(i=>i.key==='lamp');
 const turned=api.cutawayMove(layout,room,plan,'lamp',lamp,free[0],(lamp.turn+1)%4);
 assert(turned&&turned.find(i=>i.key==='lamp').turn===(lamp.turn+1)%4);
 assert(api.cutawayConnected(layout,room,turned));
 assert.equal(api.cutawayMove(layout,room,plan,'lamp',free[0],free[0]),null);
}
assert.equal(api.cutawayPlan(layout,'starter',[{id:'unknown'}]),null);
assert.equal(api.cutawayPlan(layout,'starter',[{id:'futon'},{id:'futon'}]),null);
assert.equal(api.cutawayPlan(layout,'starter',[{id:'futon'},{id:'bed'},{id:'basicTable'},{id:'lowDesk'},{id:'lamp'}]),null);
for(const p of ['index.html','scripts/build.cjs'])assert(fs.readFileSync(p,'utf8').includes('compact-town-home'),p+' loads new module');
const p=api.cutawayPlan(layout,'starter',source);
const paths=api.cutawayArtPaths(layout,'starter',p);
assert.equal(paths.length,4);
assert.equal(api.cutawayArtPaths(layout,'starter',[{id:'invalid'}]),null);
assert.deepEqual(api.cutawayArtPaths(layout,'starter',[p[0],p[0]]),[layout.shell('starter'),layout.furniture(p[0].id)]);
assert(src.includes("actorArt('down',false,0)"));
assert(src.includes("pawHomeActorArt(player,direction,walking,distance)"));
assert(src.includes("if(token!==epoch)return;"));
assert(src.includes("stop();position(point(actor));actorArt('down',false,0);editing=!editing"));
assert(src.includes("cutawayDepth(a.y,f.layer)"));
assert(src.includes("transform-origin:var(--paw-cutaway-foot-x,50%) var(--paw-cutaway-foot-y,100%)"));
const actions=JSON.parse(fs.readFileSync('assets/visual/painted/action-runtime.json','utf8'));
let poseChecks=0;
for(const player of Object.values(actions.players))for(const frames of Object.values(player.walk))for(const frame of frames){
 const p=api.cutawayFootPivot(frame);
 assert.equal(p.x,100*frame.foot[0]/frame.width);
 assert.equal(p.y,100*frame.foot[1]/frame.height);
 assert.deepEqual(api.cutawayFootPivot(frame,true),p);
 assert.ok(p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100);poseChecks+=4
}
assert.deepEqual(api.cutawayFootPivot(null),{x:50,y:100});
assert.deepEqual(api.cutawayFootPivot({width:0,height:200,foot:[0,100]}),{x:50,y:100});
assert.deepEqual(api.cutawayFootPivot({width:100,height:200,foot:[50,201]}),{x:50,y:100});
for(const room of ['starter','side','studio']){
 const plan=api.cutawayPlan(layout,room,source),free=api.cutawayFree(layout,room,plan);
 for(const item of plan){
  const a=layout.anchor(room,item);
  for(const cell of free){
   const p=layout.project(room,cell.u+.5,cell.v+.5);
   if(Math.abs(p.y-a.y)>.002)assert.equal(Math.sign(api.cutawayDepth(p.y)-api.cutawayDepth(a.y)),Math.sign(p.y-a.y));
   assert.ok(api.cutawayDepth(p.y)>api.cutawayDepth(a.y,'wall'));
   assert.ok(api.cutawayDepth(p.y)>api.cutawayDepth(a.y,'rug'));poseChecks+=2
  }
 }
}
console.log('PASS '+poseChecks+' manifest foot-pivot and cutaway depth checks');
assert(src.includes("persist();render();status.textContent=lights.has"));
assert(src.includes("observer.disconnect();document.removeEventListener('visibilitychange',onVisibility)"));
assert(src.includes("residentDialogue(name),words,...rest"));
(async()=>{
 const seen=[];
 assert(await api.cutawayArtReady(paths,async p=>{seen.push(p);return true}));
 assert.deepEqual(seen,paths);
 assert.equal(await api.cutawayArtReady(paths,async p=>p!==paths[1]),false);
 assert.equal(await api.cutawayArtReady(paths,async()=>{throw Error('decode failed')}),false);
 assert.equal(await api.cutawayArtReady(null,async()=>true),false);
 console.log('PASS compact town/home helpers, source registration and cutaway predecode');
})().catch(e=>{console.error(e);process.exitCode=1});

const drag=api.cutawayDragOwner(),evt=(pointerId,x=0,y=0,isPrimary=true)=>({pointerId,clientX:x,clientY:y,isPrimary,button:0});
assert(drag.begin('chair',evt(1)));
assert(!drag.begin('lamp',evt(2,0,0,false)));
assert(!drag.begin('lamp',evt(2)));
assert(!drag.end('lamp',evt(2,30,30)));
drag.cancel('chair',2);
assert(drag.end('chair',evt(1,9,0)));
assert(drag.begin('lamp',evt(3)));
drag.cancel('lamp',3);
assert(!drag.end('lamp',evt(3,40,0)));
assert(drag.begin('chair',evt(4)));
drag.clear();
assert(!drag.end('chair',evt(4,40,0)));
assert(drag.begin('chair',evt(5)));
assert(!drag.end('chair',evt(5,2,2)));
assert(drag.begin('lamp',evt(6)));
assert(drag.end('lamp',evt(6,0,8)));
console.log('PASS cutaway furniture single-pointer ownership and interrupted drag checks');
