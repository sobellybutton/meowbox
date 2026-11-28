/* Painted food props: exact source registration, visible-size placement and
 * lazy, room-local image preparation. No game state, timers or global preload.
 * Caller owns the counter geometry, grip, animation and input hit region. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PawFoodProps=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const base='assets/visual/painted/food-props/';
const finite=Number.isFinite;
function record(manifest,id){
 const v=manifest?.schema===1&&Object.hasOwn(manifest.assets||{},id)?manifest.assets[id]:null;
 if(!v||!Array.isArray(v.size)||v.size.length!==2||!v.size.every(n=>Number.isInteger(n)&&n>0)||!Array.isArray(v.alphaBounds)||v.alphaBounds.length!==4||!v.alphaBounds.every(Number.isInteger)||!Array.isArray(v.groundAnchor)||v.groundAnchor.length!==2||!v.groundAnchor.every(n=>finite(n)&&n>=0&&n<=1)||typeof v.file!=='string'||!(/^[a-z0-9_]+\.png$/).test(v.file)||v.file!==id+'.png')return null;
 const [w,h]=v.size,[l,t,rr,bb]=v.alphaBounds;
 if(l<0||t<0||rr>w||bb>h||l>=rr||t>=bb||Math.abs(v.groundAnchor[0]-(l+rr)/2/w)>1e-8||Math.abs(v.groundAnchor[1]-bb/h)>1e-8)return null;
 return {path:base+v.file,size:v.size.slice(),bounds:v.alphaBounds.slice(),ground:[(l+rr)/2,bb]};
}
function geometry(manifest,id,x,y,visibleHeight,options={}){
 const a=record(manifest,id);
 if(!a||![x,y,visibleHeight].every(finite)||visibleHeight<=0||!options||typeof options!=='object')return null;
 const [l,t,r,b]=a.bounds,[w,h]=a.size,scale=visibleHeight/(b-t);
 // For a moving prop, only accept an explicit calibrated source point.
 // The stationary bottom centre is not a hand or spout anchor.
 const anchor=options.anchor===undefined?a.ground:options.anchor;
 const angle=options.angle===undefined?0:options.angle;
 if(!Array.isArray(anchor)||anchor.length!==2||!anchor.every(finite)||anchor[0]<0||anchor[0]>w||anchor[1]<0||anchor[1]>h||!finite(angle))return null;
 const dx=-anchor[0]*scale,dy=-anchor[1]*scale;
 const point=(px,py)=>{
  const u=dx+px*scale,v=dy+py*scale,c=Math.cos(angle),s=Math.sin(angle);
  return [x+c*u-s*v,y+s*u+c*v]
 };
 const corners=[[l,t],[r,t],[r,b],[l,b]].map(v=>point(...v));
 return {path:a.path,sourceSize:a.size,world:[x,y],anchor:anchor.slice(),angle,scale,draw:[dx,dy,w*scale,h*scale],visibleCorners:corners,visibleAABB:[Math.min(...corners.map(v=>v[0])),Math.min(...corners.map(v=>v[1])),Math.max(...corners.map(v=>v[0])),Math.max(...corners.map(v=>v[1]))],point};
}
function ready(image,s){
 return !!image&&image.complete===true&&image.naturalWidth===s[0]&&image.naturalHeight===s[1];
}
function draw(ctx,image,placement){
 if(!ctx||!placement||!ready(image,placement.sourceSize))return false;
 ctx.save();
 try{
  ctx.translate(...placement.world);
  ctx.rotate(placement.angle);
  ctx.drawImage(image,...placement.draw);
 }finally{ctx.restore()}
 return true;
}
function create(manifest,makeImage){
 if(typeof makeImage!=='function')throw TypeError('image factory required');
 const cache=new Map();
 function image(id){
  const a=record(manifest,id);
  if(!a)return null;
  if(cache.has(id))return cache.get(id);
  const v=makeImage(a.path);
  if(!v)return null;
  cache.set(id,v);return v
 }
 function request(ids){
  if(!Array.isArray(ids))return [];
  return [...new Set(ids)].filter(id=>record(manifest,id)).map(id=>({id,image:image(id)}))
 }
 function paint(ctx,id,x,y,height,options){
  const g=geometry(manifest,id,x,y,height,options);
  if(!g)return false;
  return draw(ctx,image(id),g)
 }
 function forget(id){return cache.delete(id)}
 function clear(){cache.clear()}
 return Object.freeze({request,image,paint,forget,clear,geometry:(...args)=>geometry(manifest,...args)})
}
return Object.freeze({record,geometry,ready,draw,create});
});
