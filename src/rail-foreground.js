/* Painted railway foreground. The transparent carriage is a stationary
   overlay, not part of the scenery. No network or save side effects. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawRailForeground=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const base='assets/visual/staging/2026-11-27-b/railway/';
 const carriage={path:base+'carriage-landscape.webp',width:1672,height:941};
 const sprites={
  flowers:{path:base+'foreground/hydrangea-rocks.webp',width:195,height:137},
  fence:{path:base+'foreground/vine-fence.webp',width:181,height:128},
  lantern:{path:base+'foreground/stone-lantern.webp',width:103,height:132}
 };
 // Existing four distinct distant panoramas remain the destination authority.
 const far=Object.fromEntries(['fortune','home','island','wonder'].map(id=>[id,'assets/visual/painted/recovered/candidate-railway/'+id+'/far.webp']));
 const routes={
  fortune:[['flowers',.08,.13],['lantern',.39,.19],['fence',.67,.16]],
  home:[['flowers',.18,.12],['fence',.57,.14]],
  island:[['fence',.04,.16],['flowers',.46,.14],['lantern',.82,.13]],
  wonder:[['lantern',.18,.15],['flowers',.70,.12]]
 };
 function cover(iw,ih,w,h,progress){
  if(![iw,ih,w,h,progress].every(Number.isFinite)||Math.min(iw,ih,w,h)<=0)return null;
  const scale=Math.max(w/iw,h/ih),sw=w/scale,sh=h/scale;
  return {x:(iw-sw)*Math.max(0,Math.min(1,progress)),y:(ih-sh)*.5,w:sw,h:sh}
 }
 function frame(route,seconds,w,h,reduced=false){
  if(!Object.hasOwn(routes,route)||![seconds,w,h].every(Number.isFinite)||w<=0||h<=0)return [];
  const t=reduced?0:Math.max(0,seconds),span=w*1.5;
  const result=[];
  for(const [id,offset,ratio] of routes[route]){
   const asset=sprites[id],height=h*ratio,width=height*asset.width/asset.height;
   // Width-scaled track speed stays independent of the far panorama.
   const x=(((offset*span-t*w*.57)%span+span)%span)-w*.22;
   if(x+width>=0&&x<=w)result.push({id,x,y:h*.99-height,width,height})
  }
  return result
 }
 function fit(w,h){if(![w,h].every(Number.isFinite)||w<=0||h<=0)return null;const s=Math.min(w/carriage.width,h/carriage.height);return {x:(w-carriage.width*s)/2,y:(h-carriage.height*s)/2,width:carriage.width*s,height:carriage.height*s}}
 function draw(ctx,assets,route,seconds,w,h,reduced=false){
  const box=fit(w,h);if(!box||!assets?.carriage?.naturalWidth||!assets?.far?.naturalWidth||!Object.hasOwn(routes,route))return false;
  const im=assets.far,progress=reduced?.5:Math.max(0,Math.min(1,seconds/9));
  const crop=cover(im.naturalWidth,im.naturalHeight,box.width,box.height,progress);
  if(!crop)return false;
  ctx.save();try{
   ctx.translate(box.x,box.y);ctx.beginPath();ctx.rect(0,0,box.width,box.height);ctx.clip();
   // Landscape and foreground are drawn only in the top window band.
   const windowHeight=box.height*.58;
   const glass=cover(im.naturalWidth,im.naturalHeight,box.width,windowHeight,progress);
   ctx.drawImage(im,glass.x,glass.y,glass.w,glass.h,0,0,box.width,windowHeight);
   for(const p of frame(route,seconds,box.width,windowHeight,reduced)){
    const sprite=assets[p.id];if(sprite?.naturalWidth)ctx.drawImage(sprite,p.x,p.y,p.width,p.height)
   }
   ctx.drawImage(assets.carriage,0,0,box.width,box.height);
  }finally{ctx.restore()}
  return true
 }
 return Object.freeze({carriage,sprites,far,cover,fit,frame,draw});
});
