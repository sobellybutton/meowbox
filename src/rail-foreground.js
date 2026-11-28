/* Painted railway foreground. The transparent carriage is a stationary
   overlay, not part of the scenery. No network or save side effects. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawRailForeground=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const base='assets/visual/staging/2026-11-27-b/railway/';
 const carriage={path:base+'carriage-landscape.webp',width:1672,height:941};
 const portrait={path:'assets/visual/staging/2026-11-28-rail-portrait/carriage-portrait-window.webp',width:1024,height:1536,window:[119,322,906,831]};
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
 // Integrate a smooth acceleration ramp: distance and velocity are continuous
 // at departure, then settle into the same width-scaled cruising speed.
 function travelDistance(seconds,duration){
  if(!Number.isFinite(seconds))return 0;
  const bounded=Number.isFinite(duration)&&duration>0;
  const t=Math.max(0,bounded?Math.min(seconds,duration):seconds);
  const ramp=bounded?Math.min(.65,duration/2):.65,u=Math.min(1,t/ramp);
  const start=ramp*(u*u*u-.5*u*u*u*u)+Math.max(0,t-ramp);
  if(!bounded)return start;
  // Integrate a smooth braking ramp, with zero velocity at the station.
  // Keep indefinite entrance previews independent of finite district rides.
  const brake=Math.min(.85,duration-ramp);
  const v=Math.max(0,Math.min(1,(t-(duration-brake))/brake));
  return start-brake*(v*v*v-.5*v*v*v*v);
 }
 function frame(route,seconds,w,h,reduced=false,duration){
  if(!Object.hasOwn(routes,route)||![seconds,w,h].every(Number.isFinite)||w<=0||h<=0)return [];
  const distance=reduced?0:travelDistance(seconds,duration);
  const items=routes[route].map(([id,offset,ratio])=>{
   const asset=sprites[id],height=h*ratio;
   return {id,offset,height,width:height*asset.width/asset.height}
  });
  // Allow even wide sprites to leave entirely before recycling. A shared
  // span preserves the spacing between props at every viewport aspect.
  const margin=Math.max(w*.22,...items.map(p=>p.width))+w*.02;
  const span=Math.max(w*1.5,w+margin+w*.02),result=[];
  for(const {id,offset,height,width} of items){
   const x=(((offset*span-distance*w*.57)%span+span)%span)-margin;
   if(x+width>=0&&x<=w)result.push({id,x,y:h*.99-height,width,height})
  }
  return result
 }
 function fit(w,h,layout='landscape'){if(![w,h].every(Number.isFinite)||w<=0||h<=0||!['landscape','portrait'].includes(layout))return null;const c=layout==='portrait'?portrait:carriage,s=Math.min(w/c.width,h/c.height);return {x:(w-c.width*s)/2,y:(h-c.height*s)/2,width:c.width*s,height:c.height*s}}
 function windowBox(box,layout='landscape'){
  if(!box||![box.width,box.height].every(Number.isFinite)||box.width<=0||box.height<=0)return null;
  if(layout==='landscape')return {x:0,y:0,w:box.width,h:box.height*.58};
  if(layout!=='portrait')return null;
  // A small overlap underneath the opaque painted frame prevents a seam.
  const [l,t,r,b]=portrait.window;
  return {x:(l-3)/portrait.width*box.width,y:(t-3)/portrait.height*box.height,w:(r-l+6)/portrait.width*box.width,h:(b-t+6)/portrait.height*box.height}
 }
 // Slow, route-specific daylight and breeze. No flash, full-screen tint,
 // random jumps, or moving the carriage itself. Fixed poses in reduced motion.
 function atmosphere(route,seconds,reduced=false){
  if(!Object.hasOwn(routes,route)||!Number.isFinite(seconds))return null;
  const phase={fortune:.2,home:1.5,island:2.8,wonder:4.1}[route];
  const t=reduced?0:Math.max(0,seconds);
  const slow=.5+.5*Math.sin(t*.48+phase);
  const breeze=reduced?0:.018*Math.sin(t*1.4+phase)+.009*Math.sin(t*.7+phase*2);
  return {breeze,light:.025+.038*slow,shade:.012+.025*(1-slow)};
 }
 function drawTrackside(ctx,image,p,air){
  // Only the flexible flower sprite responds to wind. Its base remains
  // planted on the original trackside ground line; fence/stone stay rigid.
  if(p.id!=='flowers'||!air.breeze){ctx.drawImage(image,p.x,p.y,p.width,p.height);return}
  ctx.save();try{
   ctx.translate(p.x,p.y+p.height);ctx.transform(1,0,air.breeze,1,0,0);
   ctx.drawImage(image,0,-p.height,p.width,p.height)
  }finally{ctx.restore()}
 }
 function windowDaylight(ctx,w,h,air){
  const wash=ctx.createLinearGradient(0,0,w,h);
  wash.addColorStop(0,'rgba(255,226,175,'+air.light+')');
  wash.addColorStop(.52,'rgba(255,235,202,0)');
  wash.addColorStop(1,'rgba(91,117,119,'+air.shade+')');
  ctx.fillStyle=wash;ctx.fillRect(0,0,w,h)
 }
 function draw(ctx,assets,route,seconds,w,h,reduced=false,layout='landscape',duration){
  const box=fit(w,h,layout),foreground=layout==='portrait'?assets?.portrait:assets?.carriage;
  if(!box||!foreground?.naturalWidth||!assets?.far?.naturalWidth||!Object.hasOwn(routes,route)||!Number.isFinite(seconds))return false;
  if(layout==='portrait'&&(foreground.naturalWidth!==portrait.width||foreground.naturalHeight!==portrait.height))return false;
  const im=assets.far,progress=reduced?.5:Math.min(1,travelDistance(seconds,duration)/travelDistance(9)),win=windowBox(box,layout);
  const glass=cover(im.naturalWidth,im.naturalHeight,win.w,win.h,progress);
  if(!glass)return false;
  ctx.save();try{
   ctx.translate(box.x,box.y);ctx.beginPath();ctx.rect(0,0,box.width,box.height);ctx.clip();
   ctx.save();try{
    ctx.translate(win.x,win.y);ctx.beginPath();ctx.rect(0,0,win.w,win.h);ctx.clip();
    ctx.drawImage(im,glass.x,glass.y,glass.w,glass.h,0,0,win.w,win.h);
    const air=atmosphere(route,seconds,reduced);windowDaylight(ctx,win.w,win.h,air);
    for(const p of frame(route,seconds,win.w,win.h,reduced,duration)){
     const sprite=assets[p.id];if(sprite?.naturalWidth)drawTrackside(ctx,sprite,p,air)
    }
   }finally{ctx.restore()}
   ctx.drawImage(foreground,0,0,box.width,box.height);
  }finally{ctx.restore()}
  return true
 }
 return Object.freeze({carriage,portrait,sprites,far,cover,fit,windowBox,frame,atmosphere,travelDistance,draw});
});
