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
const previews=new Function(previewBlock[1]+';return {pawFurniturePaintedPath,pawFurniturePainted,pawFurniturePreviewOnly,pawFurnitureImported,pawFurnitureRoomPose}')();
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

const imported=["board","frame","kotatsu","teaCabinet","bonsai","recordPlayer","readingChair","chineseScreen","chineseLantern","porcelainVase","moonShelf"];
assert.deepEqual([...previews.pawFurnitureImported],imported);
for(const id of imported){
 const expected='assets/visual/painted/home/furniture/'+id+'.webp';
 assert.equal(previews.pawFurniturePaintedPath(id),expected);
 assert.equal(previews.pawFurniturePaintedPath(id,true),expected);
 assert.equal(api.furniture(id),expected);
 assert.ok(fs.existsSync(path.resolve(__dirname,'..',expected)));
 const pose=previews.pawFurnitureRoomPose(id,45,78,30);
 assert.equal(pose.left,45);
 assert.equal(pose.anchor,id==='chineseLantern'?'top':'bottom');
 if(id==='chineseLantern'){
  assert.equal(pose.top,3.2);assert.equal(pose.logicalY,35);assert.equal(pose.rotation,0);
  assert.equal(api.footprint({id,u:0,v:0}).layer,'wall');
 }else if(id==='board'||id==='frame'){
  assert.equal(pose.top,54);assert.ok(pose.maxHeight<=pose.top-4);
  assert.equal(api.footprint({id,u:0,v:0}).layer,'wall');
 }else{
  assert.equal(pose.top,78);assert.equal(pose.rotation,30);
  assert.equal(api.footprint({id,u:0,v:0}).layer,'floor');
 }
}
assert.equal(previews.pawFurnitureRoomPose('shelf',30,80,15).anchor,'legacy');
assert.equal(previews.pawFurnitureRoomPose('board',50,18).maxHeight,14);
assert.equal(previews.pawFurnitureRoomPose('chineseLantern',0,90).left,12);
assert.equal(previews.pawFurnitureRoomPose('chineseLantern',100,90).left,88);
assert.ok(extensions.includes('d.x=old.x;d.y=old.y;pawFurnitureApplyRoomPose(im,d)'));
assert.ok(extensions.includes("id==='chineseLantern'?'wall'"));
console.log('Imported furniture paths and placement anchors verified.');

for(const [kind,ids] of [['wall',['wallLinen','wallSakura','wallMatcha','wallBlue']],['floor',['floorOak','floorTiles','floorTatami','floorChecker']]]){
 for(const id of ids){
  const spec=api.finishSpec(kind,id);assert.ok(fs.existsSync(path.resolve(__dirname,'..',spec.path)));
  assert.equal(spec.box[1],kind==='wall'?0:300);assert.equal(spec.box[3],kind==='wall'?300:200);
  assert.equal(api.finishSpec(kind==='wall'?'floor':'wall',id),null);
  const canvases=[],source={naturalWidth:344,naturalHeight:344};
  const result=api.finishRaster(kind,id,source,(width,height)=>{
   const calls=[],c={width,height,calls,getContext:()=>({save(){},restore(){},translate(){},scale(){},drawImage(...args){calls.push(args)}})};canvases.push(c);return c
  });
  assert.equal(result,canvases[0]);assert.equal(canvases[1].calls.length,24);
  assert.equal(result.calls.length,kind==='wall'?1:320);
  for(const [im,x,y,w,h] of result.calls)assert.ok(x>=0&&y>=0&&x+w<=im.width+1e-6&&y+h<=im.height+1e-6);
 }
}
for(let i=0;i<=1000;i++){
 const q=api.floorSample(i/1000);assert.ok(q.left>=0&&q.left+q.span<=6&&q.v>=0&&q.v<4);
 if(i){const prior=api.floorSample((i-1)/1000);assert.ok(q.span<prior.span&&q.v>prior.v)}
}
assert.equal(api.finishSpec('wall','__proto__'),null);assert.equal(api.finishSpec('floor','plain'),null);
assert.equal(api.floorSample(-1),null);assert.equal(api.floorSample(NaN),null);
console.log('Eight home finish paths, mirror tiling, floor sampling and surface bounds verified.');
