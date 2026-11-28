/* Pawradise modular home floor geometry.
   Source: individually verified 27 Nov room shell artwork. No storage or
   economy mutations: the existing room purchase/placement controller owns
   those. Each logical cell persists across upgrades. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PawHomeLayout=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const base='assets/visual/staging/2026-11-27-b/room/';
 const layouts={
  starter:{width:4,depth:4,asset:'starter',origin:[.51,.44],left:[.065,.70],right:[.93,.70],front:[.50,.93]},
  side:{width:7,depth:4,asset:'side-extension',origin:[.68,.407],left:[.045,.70],right:[.96,.65],front:[.30,.935]},
  studio:{width:7,depth:7,asset:'l-shaped-extension',origin:[.56,.405],left:[.052,.748],right:[.96,.69],front:[.445,1.033],notch:[4,4]},
  balcony:{width:4,depth:4,asset:'balcony',origin:[.59,.40],left:[.05,.69],right:[.94,.60],front:[.45,.91]}
 };
 const catalog={
  futon:[2,3], 'single-bed':[2,3], sofa:[2,1], 'floral-armchair':[1,1], 'wood-chair':[1,1],
  'low-table':[2,1], 'tea-table':[2,1], desk:[2,1], bench:[2,1], bookcase:[1,1],
  'display-cabinet':[1,1], wardrobe:[1,1], nightstand:[1,1], 'retro-tv':[1,1],
  'floor-cushion':[1,1], 'paper-lamp':[1,1], 'floor-lantern':[1,1], fern:[1,1],
  'flower-vase':[1,1], 'cat-bed':[1,1], 'cat-tower':[1,1], 'woven-rug':[2,2],
  'wall-shelf':[1,1], curtains:[1,1], board:[1,1],frame:[1,1],kotatsu:[2,2],teaCabinet:[2,1],bonsai:[1,1],recordPlayer:[1,1],readingChair:[1,1],chineseScreen:[2,1],chineseLantern:[1,1],porcelainVase:[1,1],moonShelf:[2,1]
 };
 const imported=new Set(["board","frame","kotatsu","teaCabinet","bonsai","recordPlayer","readingChair","chineseScreen","chineseLantern","porcelainVase","moonShelf"]);
 const wall=new Set(['wall-shelf','curtains','board','frame','chineseLantern']);
 const flat=new Set(['woven-rug']);
 function spec(id){return Object.hasOwn(layouts,id)?layouts[id]:null}
 function shell(id){const l=spec(id);return l?base+'shells/'+l.asset+'.webp':null}
 function furniture(id){return imported.has(id)?'assets/visual/painted/home/furniture/'+id+'.webp':Object.hasOwn(catalog,id)?base+'furniture/'+id+'.webp':null}
 function project(id,u,v){
  const l=spec(id);if(!l||!Number.isFinite(u)||!Number.isFinite(v))return null;
  const a=u/l.width,b=v/l.depth;
  return {x:(1-a)*(1-b)*l.origin[0]+a*(1-b)*l.left[0]+(1-a)*b*l.right[0]+a*b*l.front[0],
          y:(1-a)*(1-b)*l.origin[1]+a*(1-b)*l.left[1]+(1-a)*b*l.right[1]+a*b*l.front[1]}
 }
 function cellExists(id,u,v){
  const l=spec(id);return !!l&&Number.isInteger(u)&&Number.isInteger(v)&&u>=0&&v>=0&&u<l.width&&v<l.depth&&(!l.notch||u<l.notch[0]||v<l.notch[1]);
 }
 function footprint(item){
  if(!item||!Object.hasOwn(catalog,item.id)||!Number.isInteger(item.u)||!Number.isInteger(item.v)||![0,1,2,3].includes(item.turn??0))return null;
  let [w,d]=catalog[item.id];if((item.turn??0)%2)[w,d]=[d,w];
  return {w,d,layer:wall.has(item.id)?'wall':flat.has(item.id)?'rug':'floor'};
 }
 function cells(item){const f=footprint(item);if(!f)return null;const out=[];for(let u=item.u;u<item.u+f.w;u++)for(let v=item.v;v<item.v+f.d;v++)out.push([u,v]);return out}
 function canPlace(layout,item,existing=[]){
  const f=footprint(item),c=cells(item);if(!f||!c||!c.every(([u,v])=>cellExists(layout,u,v)))return false;
  if(f.layer==='wall'&&item.u!==0&&item.v!==0)return false;
  const occupied=new Set();
  for(const x of existing){
   if(item.key!=null&&x.key===item.key)continue;
   const g=footprint(x);if(!g||g.layer!==f.layer)continue;
   for(const [u,v] of cells(x))occupied.add(u+','+v)
  }
  return c.every(([u,v])=>!occupied.has(u+','+v))
 }
 function cellPolygon(id,u,v){
  if(!cellExists(id,u,v))return null;
  return [project(id,u,v),project(id,u+1,v),project(id,u+1,v+1),project(id,u,v+1)];
 }
 function insideCell(poly,x,y){
  let positive=false,negative=false;
  for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length],cross=(b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x);
   if(cross>1e-10)positive=true;
   if(cross< -1e-10)negative=true;
   if(positive&&negative)return false
  }
  return true
 }
 function nearestCell(id,x,y){
  const l=spec(id);if(!l||!Number.isFinite(x)||!Number.isFinite(y))return null;
  let best=null;
  for(let u=0;u<l.width;u++)for(let v=0;v<l.depth;v++){
   const poly=cellPolygon(id,u,v);if(!poly||!insideCell(poly,x,y))continue;
   const p=project(id,u+.5,v+.5),distance=Math.hypot(p.x-x,p.y-y);
   // Shared edges choose the nearest centre deterministically. No exterior
   // radius: the painted wall, outside floor and L-shaped void cannot snap.
   if(!best||distance<best.distance-1e-12)best={u,v,distance}
  }
  return best?{u:best.u,v:best.v}:null
 }
 function anchor(id,item){
  const f=footprint(item);if(!f||!canPlace(id,item))return null;
  const p=project(id,item.u+f.w/2,item.v+f.d/2),front=project(id,item.u+f.w,item.v+f.d);
  return {x:p.x,y:p.y,depth:front.y,layer:f.layer};
 }
 function upgradeAllowed(from,to,items){
  if(![['starter','side'],['side','studio']].some(pair=>pair[0]===from&&pair[1]===to)||!Array.isArray(items))return false;
  return items.every((item,i)=>canPlace(from,item,items.filter((_,j)=>j!==i))&&canPlace(to,item,items.filter((_,j)=>j!==i)));
 }
 // Only map matching furniture identities. Keep cabinet/shelf and special
 // interactive fixtures on their current art until shelf contact is calibrated.
 const legacyArt={futon:'futon',bed:'single-bed',lamp:'paper-lamp',basicTable:'low-table',rug:'woven-rug',plant:'fern',zabuton:'floor-cushion',catBasket:'cat-bed',sakuraVase:'flower-vase',lowDesk:'desk',retroTV:'retro-tv',chineseTeaTable:'tea-table',chineseBench:'bench'};
 function legacyFurniture(id){return Object.hasOwn(legacyArt,id)?furniture(legacyArt[id]):null}
 function plans(extension,studio){
  const second=!!extension&&!!studio;
  return [{id:'starter',purchase:null,owned:true,available:true,cells:16},
          {id:'side',purchase:'roomExtension',owned:!!extension,available:true,cells:28},
          {id:'studio',purchase:'roomStudio',owned:second,available:!!extension,cells:40}];
 }
 // Material swatches are square, not room backgrounds. Reflect adjoining
 // tiles at their common edges and project floor depth before compositing.
 const finishIds={wall:['wallLinen','wallSakura','wallMatcha','wallBlue'],floor:['floorOak','floorTiles','floorTatami','floorChecker']};
 function finishSpec(kind,id){
  if(!Object.hasOwn(finishIds,kind)||!finishIds[kind].includes(id))return null;
  return {path:'assets/visual/painted/home/finishes/'+id+'.webp',width:640,height:kind==='wall'?480:320,box:kind==='wall'?[0,0,400,300]:[0,300,400,200]}
 }
 function floorSample(depth){
  if(!Number.isFinite(depth)||depth<0||depth>1)return null;
  const scale=.48+.52*depth,span=2.4/scale;
  return {left:3-span/2,span,v:.1+2.6*depth/scale}
 }
 function finishRaster(kind,id,source,makeCanvas){
  const spec=finishSpec(kind,id);if(!spec||!source||typeof makeCanvas!=='function')return null;
  const size=source.naturalWidth||source.width,height=source.naturalHeight||source.height;
  if(!Number.isInteger(size)||size<1||size!==height||size>2048)return null;
  const out=makeCanvas(spec.width,spec.height),g=out.getContext('2d');if(!g)return null;
  // The wall samples only 2.5 by 1.875 tiles; the floor samples at
  // most five across and 2.7 deep. Avoid allocating unused mirror tiles.
  // Bound oversized future imports to the output's practical resolution.
  const tile=Math.max(4,Math.min(512,size)),cols=kind==='wall'?3:6,rows=kind==='wall'?2:3;
  const atlas=makeCanvas(tile*cols,tile*rows),ag=atlas.getContext('2d');if(!ag)return null;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   ag.save();ag.translate((x+(x%2))*tile,(y+(y%2))*tile);ag.scale(x%2?-1:1,y%2?-1:1);ag.drawImage(source,0,0,tile,tile);ag.restore()
  }
  if(kind==='wall')g.drawImage(atlas,0,0,tile*2.5,tile*1.875,0,0,spec.width,spec.height);
  else for(let y=0;y<spec.height;y++){
   const p=floorSample((y+.5)/spec.height);
   // Integrate the complete projected source band for each output row.
   // Sampling a single source pixel skips paint at the distant edge and
   // creates stripes when the floor texture is compressed by perspective.
   const v0=floorSample(y/spec.height).v,v1=floorSample((y+1)/spec.height).v;
   g.drawImage(atlas,p.left*tile,v0*tile,p.span*tile,(v1-v0)*tile,0,y,spec.width,1)
  }
  return out
 }
 return Object.freeze({finishSpec,floorSample,finishRaster,shell,furniture,legacyFurniture,legacyIds:Object.keys(legacyArt),plans,project,cellExists,footprint,canPlace,nearestCell,anchor,upgradeAllowed,layoutIds:Object.keys(layouts),furnitureIds:Object.keys(catalog)});
});
