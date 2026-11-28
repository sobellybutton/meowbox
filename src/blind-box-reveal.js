/* Same-carton reveal: the open carton and matching foreground mask must
   decode as a pair. The renderer never owns purchases or inventory. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawBlindReveal=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const root='assets/visual/staging/2026-11-28-project-art-b05/';
 const assets=Object.freeze({open:root+'blind-box-open.webp',front:root+'blind-box-front-occlusion.webp'});
 const size=Object.freeze([896,671]);
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease=x=>{const u=clamp(x);return u*u*(3-2*u)};
 function pose(age,reduced=false){
  const t=Math.max(0,Number.isFinite(age)?age:0);
  const open=reduced?1:ease(t/.34);
  const rise=reduced?1:ease((t-.34)/.64);
  return {open,rise,done:reduced||t>=.98};
 }
 function placement(x,y,scale,age,reduced=false){
  if(![x,y,scale,age].every(Number.isFinite)||scale<=0)return null;
  const p=pose(age,reduced),w=112*scale,h=w*size[1]/size[0];
  // Both layers use exactly the same pixel transform. The box is rooted
  // at the previous carton contact line; its front edge occludes the prize.
  const left=x-w/2,top=y-h;
  return {...p,box:{x:left,y:top,w,h},figure:{x:x+2*scale,y:y-9*scale-42*scale*p.rise,scale:.78*scale}};
 }
 function ready(images){
  return ['open','front'].every(key=>{const im=images?.[key];return im?.naturalWidth===size[0]&&im?.naturalHeight===size[1]});
 }
 function draw(ctx,images,x,y,scale,age,drawFigure,reduced=false){
  if(!ctx||typeof drawFigure!=='function'||!ready(images))return false;
  const q=placement(x,y,scale,age,reduced);if(!q||q.open<1)return false;
  const b=q.box,f=q.figure;
  ctx.save();try{
   ctx.drawImage(images.open,b.x,b.y,b.w,b.h);
   if(q.rise>0)drawFigure(f.x,f.y,f.scale);
   ctx.drawImage(images.front,b.x,b.y,b.w,b.h);
  }finally{ctx.restore()}
  return true;
 }
 return Object.freeze({assets,size,pose,placement,ready,draw});
});
