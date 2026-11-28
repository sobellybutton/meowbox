'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('src/compact-town-home.js','utf8');
new vm.Script(src);
const helper=src.split('// PAW_COMPACT_HELPERS_BEGIN')[1].split('// PAW_COMPACT_HELPERS_END')[0];
const api=new Function(helper+';return {pageWindow,residentLabel,residentHeading,residentDialogue,residentPortraitPath}')();
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
for(const p of ['index.html','scripts/build.cjs'])assert(fs.readFileSync(p,'utf8').includes('compact-town-home'),p+' loads new module');
console.log('PASS compact town/home helpers and source registration');
