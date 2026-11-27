'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),api=require('../src/home-layout.js');
for(const id of api.layoutIds)assert.ok(fs.existsSync(path.resolve(__dirname,'..',api.shell(id))));
for(const id of api.furnitureIds)assert.ok(fs.existsSync(path.resolve(__dirname,'..',api.furniture(id))));
for(const [id,w,d,count] of [['starter',4,4,16],['side',7,4,28],['studio',7,7,40],['balcony',4,4,16]]){
 let found=0;
 for(let u=0;u<w;u++)for(let v=0;v<d;v++){
  if(!api.cellExists(id,u,v))continue;found++;
  const p=api.project(id,u+.5,v+.5);
  assert.ok(p.x>0&&p.x<1&&p.y>0&&p.y<1);
  assert.deepEqual(api.nearestCell(id,p.x,p.y),{u,v});
 }
 assert.equal(found,count);
 assert.equal(api.nearestCell(id,.5,.02),null);
 assert.equal(api.cellExists(id,w,0),false);
}
const bed={id:'single-bed',u:0,v:0,key:'bed'},chair={id:'wood-chair',u:3,v:3,key:'chair'};
assert.ok(api.canPlace('starter',bed));assert.ok(api.canPlace('starter',chair,[bed]));
assert.equal(api.canPlace('starter',{id:'wood-chair',u:1,v:1},[bed]),false);
assert.ok(api.canPlace('starter',{id:'woven-rug',u:0,v:0},[bed]));
assert.ok(api.canPlace('starter',{id:'single-bed',u:1,v:0,turn:1}));
assert.equal(api.canPlace('starter',{id:'single-bed',u:3,v:0}),false);
assert.equal(api.canPlace('studio',{id:'wood-chair',u:6,v:6}),false);
assert.equal(api.canPlace('starter',{id:'wall-shelf',u:2,v:2}),false);
assert.ok(api.canPlace('starter',{id:'wall-shelf',u:0,v:2}));
assert.ok(api.upgradeAllowed('starter','side',[bed,chair]));
assert.ok(api.upgradeAllowed('side','studio',[bed,chair]));
assert.equal(api.upgradeAllowed('starter','studio',[bed]),false);
assert.equal(api.upgradeAllowed('starter','side',[bed,{id:'wood-chair',u:0,v:0}]),false);
assert.equal(api.canPlace('starter',{id:'unknown',u:0,v:0}),false);
assert.ok(api.anchor('starter',bed).depth>api.anchor('starter',bed).y);
console.log('Modular home asset, projection, placement and upgrade checks passed.');

for(const id of api.legacyIds)assert.ok(fs.existsSync(path.resolve(__dirname,'..',api.legacyFurniture(id))));
assert.equal(api.legacyFurniture('unknown'),null);
assert.equal(api.legacyFurniture('shelf'),null);
assert.equal(api.legacyFurniture('displayCabinet'),null);
for(const [extension,studio] of [[false,false],[false,true],[true,false],[true,true]]){
 const plans=api.plans(extension,studio);
 assert.equal(plans[0].owned,true);
 assert.equal(plans[1].owned,extension);
 assert.equal(plans[2].available,extension);
 assert.equal(plans[2].owned,extension&&studio);
 assert.deepEqual(plans.map(p=>p.cells),[16,28,40]);
}

/* The live catalogue uses a direct painted URL on its first render.
   Preview-only candidates must not silently change interactive room geometry. */
const extensions=fs.readFileSync(path.resolve(__dirname,'../src/extensions.js'),'utf8');
const previewBlock=extensions.match(/\/\* PAW_FURNITURE_PREVIEW_BEGIN \*\/([\s\S]*?)\/\* PAW_FURNITURE_PREVIEW_END \*\//);
assert.ok(previewBlock);
const previews=new Function(previewBlock[1]+';return {pawFurniturePaintedPath,pawFurniturePainted,pawFurniturePreviewOnly}')();
for(const id of api.legacyIds){
 assert.equal(previews.pawFurniturePaintedPath(id),api.legacyFurniture(id));
 assert.ok(fs.existsSync(path.resolve(__dirname,'..',previews.pawFurniturePaintedPath(id))));
}
for(const id of ['shelf','displayCabinet','shojiLamp','roomExtension','roomStudio']){
 assert.equal(previews.pawFurniturePaintedPath(id),null);
 assert.ok(fs.existsSync(path.resolve(__dirname,'..',previews.pawFurniturePaintedPath(id,true))));
}
assert.equal(previews.pawFurniturePaintedPath('unknown',true),null);
assert.equal(previews.pawFurniturePaintedPath('__proto__',true),null);
assert.ok(extensions.includes('pawFurnitureSetImage(im,d.id)'));
assert.equal((extensions.match(/pawFurnitureSetImage\(im,id,true\)/g)||[]).length,3);
const shell=fs.readFileSync(path.resolve(__dirname,'../src/shell.html'),'utf8');
assert.ok(shell.includes('.komorebiTile>.mbFurnitureMat>img'));
assert.ok(shell.includes('.komorebiTile>strong'));
console.log('Painted furniture first-render and preview-path checks passed.');
