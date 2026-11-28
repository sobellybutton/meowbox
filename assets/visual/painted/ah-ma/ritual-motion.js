/* Interim articulation of the inspected original Ah Ma painting.
 * No generated geometry, duplicate slipper or player-held tool. Not live
 * until the room renderer and actual phone/desktop composition are verified.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawAuntieRitualMotion=api})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const art=Object.freeze({width:344,height:510,sha256:'c5ea077b800c72edcbb9059b1712326be11554b3a1b88def4de66334d30d5592'});
// Coordinates traced on the existing 344x510 raised-slipper image.
// The cut follows the outer sleeve and retains the shoulder seam.
const shoulder=Object.freeze([102,194]),tip=Object.freeze([45,34]);
const arm=Object.freeze([[0,0],[91,0],[91,139],[99,158],[114,179],[110,207],[98,238],[86,260],[0,265]].map(Object.freeze));
const timing=Object.freeze({contact:.23,duration:.46});
const finite=point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite);
const ease=f=>{f=Math.max(0,Math.min(1,f));return f*f*(3-2*f)};
const radius=Math.hypot(tip[0]-shoulder[0],tip[1]-shoulder[1]);
const baseAngle=Math.atan2(tip[1]-shoulder[1],tip[0]-shoulder[0]);
function layout(foot,height,contact,tolerance=3){
 if(!finite(foot)||!finite(contact)||!Number.isFinite(height)||height<=0||!Number.isFinite(tolerance)||tolerance<0)return null;
 const scale=height/art.height,left=foot[0]-art.width*scale/2,top=foot[1]-height;
 const pivot=[left+shoulder[0]*scale,top+shoulder[1]*scale];
 const dx=contact[0]-pivot[0],dy=contact[1]-pivot[1],error=Math.abs(Math.hypot(dx,dy)-radius*scale);
 if(error>tolerance)return null;
 let angle=Math.atan2(dy,dx)-baseAngle;
 while(angle<0)angle+=Math.PI*2;
 // Only a forward/downward swing from the raised tool, never a spin.
 if(dx<=0||dy<0||angle<Math.PI/3||angle>Math.PI*1.25)return null;
 return {left,top,scale,pivot,angle,error,contact:contact.slice(),foot:foot.slice(),height}
}
function fit(contact,height,direction=Math.PI/5){
 if(!finite(contact)||!Number.isFinite(height)||height<=0||!Number.isFinite(direction)||direction<0||direction>=Math.PI/2)return null;
 const scale=height/art.height;
 const pivot=[contact[0]-radius*scale*Math.cos(direction),contact[1]-radius*scale*Math.sin(direction)];
 const foot=[pivot[0]+(art.width/2-shoulder[0])*scale,pivot[1]+(art.height-shoulder[1])*scale];
 return layout(foot,height,contact,.001)
}
function frame(spec,age,reduced=false){
 if(!spec||!Number.isFinite(spec.angle)||!Number.isFinite(age)||age<0||age>=timing.duration)return null;
 const strike=age>=timing.contact,phase=age<.075?'anticipation':age<timing.contact?'swing':age<.275?'impact':'recovery';
 let angle=age<.075?-.07*ease(age/.075):age<timing.contact?-.07+(spec.angle+.07)*ease((age-.075)/.155):age<.275?spec.angle:spec.angle*(1-ease((age-.275)/.185));
 if(reduced)angle=strike?spec.angle:0;
 const a=baseAngle+angle,reach=radius*spec.scale;
 return {phase,angle,strike,tip:[spec.pivot[0]+Math.cos(a)*reach,spec.pivot[1]+Math.sin(a)*reach]}
}
function path(ctx,polygon){ctx.moveTo(polygon[0][0],polygon[0][1]);for(const p of polygon.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath()}
function draw(ctx,im,spec,pose){
 if(!ctx||!im?.complete||im.naturalWidth!==art.width||im.naturalHeight!==art.height||!spec||!pose||!Number.isFinite(pose.angle))return false;
 ctx.save();
 try{
  ctx.translate(spec.left,spec.top);ctx.scale(spec.scale,spec.scale);
  // Body remains grounded; only the original painted arm and attached tool move.
  ctx.save();try{ctx.beginPath();ctx.rect(0,0,art.width,art.height);path(ctx,arm);ctx.clip('evenodd');ctx.drawImage(im,0,0)}finally{ctx.restore()}
  ctx.save();try{ctx.translate(...shoulder);ctx.rotate(pose.angle);ctx.translate(-shoulder[0],-shoulder[1]);ctx.beginPath();path(ctx,arm);ctx.clip();ctx.drawImage(im,0,0)}finally{ctx.restore()}
 }finally{ctx.restore()}
 return true
}
return Object.freeze({art,shoulder,tip,timing,layout,fit,frame,draw})
});
