'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('src/compact-town-home.js','utf8');
new vm.Script(src);
const helper=src.split('// PAW_COMPACT_HELPERS_BEGIN')[1].split('// PAW_COMPACT_HELPERS_END')[0];
const api=new Function(helper+';return {pageWindow,residentLabel,residentHeading,residentDialogue,residentPortraitPath,roomLampAnchor,roomLightState,cutawayPlan,cutawayFree,cutawayConnected,cutawayMove,cutawayRoute}')();
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
 assert.equal(api.cutawayMove(layout,room,plan,'lamp',free[0],free[0]),null);
}
assert.equal(api.cutawayPlan(layout,'starter',[{id:'unknown'}]),null);
assert.equal(api.cutawayPlan(layout,'starter',[{id:'futon'},{id:'futon'}]),null);
assert.equal(api.cutawayPlan(layout,'starter',[{id:'futon'},{id:'bed'},{id:'basicTable'},{id:'lowDesk'},{id:'lamp'}]),null);
for(const p of ['index.html','scripts/build.cjs'])assert(fs.readFileSync(p,'utf8').includes('compact-town-home'),p+' loads new module');
console.log('PASS compact town/home helpers and source registration');
