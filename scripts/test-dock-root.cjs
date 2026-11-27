'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const block=source.split('/* PAW_DOCK_ROOT_BEGIN */')[1]?.split('/* PAW_DOCK_ROOT_END */')[0];
assert.ok(block,'dock root helper available');
const choose=new Function(block+';return pawDockRootChoice')();let checks=0;
for(const [flag,key] of [['explore','travel'],['today','today'],['town','town'],['home','home']]){
 const base={open:true,[flag]:true};
 assert.equal(choose(base),key);checks++;
 for(const guard of ['room','activity','talk','transition','entrance','editing','homeOrigin','draft','typing']){
  assert.equal(choose({...base,[guard]:true}),'',key+' '+guard);checks++;
 }
 assert.equal(choose({...base,open:false}),'');checks++;
}
assert.equal(choose({open:true}),'');checks++;
console.log('Dock root ownership: '+checks+' assertions passed');

const paint=source.split('/* PAW_DOCK_PAINT_BEGIN */')[1]?.split('/* PAW_DOCK_PAINT_END */')[0];
assert.ok(paint,'painted dock artwork selector available');
const artwork=new Function(paint+';return pawTownSceneArtwork')();
const hall='assets/visual/staging/2026-11-27/interfaces/town-hall/portrait.webp';
const tea='assets/visual/staging/2026-11-27/rooms/tea/portrait.webp';
assert.equal(artwork('lounge'),tea);
for(const space of ['hall','board','public','gratitude','stroll',undefined])assert.equal(artwork(space),hall);
for(const file of [hall,tea,'assets/visual/painted/recovered/ui/paper_texture.webp'])assert.ok(fs.statSync(path.join(__dirname,'..',file)).size>0,'Missing artwork '+file);
assert.ok(source.includes('const art=pawVisualImage(theme,q)'),'page passes actual scene');
assert.ok(source.includes("q.querySelector('.pawTownFrontPhoto'))return"),'no duplicate town scene header');
console.log('Painted town scene selection and asset availability verified.');
