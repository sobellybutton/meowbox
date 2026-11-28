/* Pure, scene-local food contact choreography. Caller owns state, clock,
 * hand pose, physical obstacles, layering, reduced-motion and input. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PawFoodContact=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const finite=Number.isFinite;
const pair=v=>Array.isArray(v)&&v.length===2&&v.every(finite);
const ease=x=>x*x*(3-2*x);
const mix=(a,b,u)=>a+(b-a)*u;
function landmarks(manifest,contacts,id){
 const a=manifest?.assets&&Object.hasOwn(manifest.assets,id)?manifest.assets[id]:null;
 const c=contacts?.schema===1&&contacts.assets&&Object.hasOwn(contacts.assets,id)?contacts.assets[id]:null;
 if(!a||!c||a.sourceBlob!==c.sourceBlob||!pair(a.size))return null;
 for(const k of ['grip','spout','receiver','workingTip']){
  if(c[k]!==undefined&&(!pair(c[k])||c[k][0]<0||c[k][1]<0||c[k][0]>a.size[0]||c[k][1]>a.size[1]))return null;
 }
 if(c.pourAngle!==undefined&&(!finite(c.pourAngle)||Math.abs(c.pourAngle)>Math.PI))return null;
 return c;
}
function create(placement,manifest,contacts){
 if(!placement||typeof placement.geometry!=='function')throw TypeError('placement API required');
 function pourPlan(spec){
  if(!spec||!pair(spec.rest)||!pair(spec.receiverBase)||![spec.vesselHeight,spec.receiverHeight,spec.gap].every(finite)||spec.vesselHeight<=0||spec.receiverHeight<=0||spec.gap<=0)return null;
  const v=landmarks(manifest,contacts,spec.vessel),cup=landmarks(manifest,contacts,spec.receiver);
  if(!v?.grip||!v.spout||!finite(v.pourAngle)||!cup?.receiver)return null;
  const rest=placement.geometry(manifest,spec.vessel,...spec.rest,spec.vesselHeight);
  const receive=placement.geometry(manifest,spec.receiver,...spec.receiverBase,spec.receiverHeight);
  if(!rest||!receive)return null;
  const startGrip=rest.point(...v.grip),endLip=receive.point(...cup.receiver);
  const local=placement.geometry(manifest,spec.vessel,0,0,spec.vesselHeight,{anchor:v.grip,angle:v.pourAngle});
  if(!local)return null;
  const offset=local.point(...v.spout),endGrip=[endLip[0]-offset[0],endLip[1]-spec.gap-offset[1]];
  return {vessel:spec.vessel,receiver:spec.receiver,vesselHeight:spec.vesselHeight,rest,receive,grip:v.grip.slice(),spout:v.spout.slice(),angle:v.pourAngle,startGrip,endGrip,endLip,gap:spec.gap};
 }
 function pourFrame(plan,progress,reduced=false){
  if(!plan||!finite(progress))return null;
  const p=Math.min(1,Math.max(0,progress)),pouring=p>=.35&&p<.70;
  const phase=p===0?'rest':p<.35?'lift':pouring?'pour':p<1?'return':'settled';
  const travel=p<.35?p/.35:pouring?1:(1-p)/.30;
  // Lift upright before reaching and tilting. Reverse the same path,
  // straighten away from the receiver, then lower onto the counter.
  const split=.45,u=Math.max(0,Math.min(1,travel));
  const lift=ease(Math.min(1,u/split)),reach=ease(Math.max(0,(u-split)/(1-split)));
  const raisedY=Math.min(plan.startGrip[1],plan.endGrip[1]);
  let grip=[mix(plan.startGrip[0],plan.endGrip[0],reach),mix(mix(plan.startGrip[1],raisedY,lift),plan.endGrip[1],reach)],angle=plan.angle*reach;
  if(reduced){const active=p!==0&&p!==1;grip=(active?plan.endGrip:plan.startGrip).slice();angle=active?plan.angle:0}
  const vessel=placement.geometry(manifest,plan.vessel,...grip,plan.vesselHeight,{anchor:plan.grip,angle});
  if(!vessel)return null;
  const stream=pouring?{from:vessel.point(...plan.spout),to:plan.endLip.slice()}:null;
  return {phase,vessel,receiver:plan.receive,grip,stream,progress:p};
 }
 function utensilPose(id,hand,height,angle=0){
  const c=landmarks(manifest,contacts,id);
  if(!c?.grip||!c.workingTip||!pair(hand))return null;
  const prop=placement.geometry(manifest,id,...hand,height,{anchor:c.grip,angle});
  return prop?{prop,hand:hand.slice(),tip:prop.point(...c.workingTip)}:null;
 }
 // A scene-local stirring path. The caller supplies actual gesture angle;
 // the spoon does not advance game progress on its own. Start/end return
 // to the identical painted counter anchor, with no jump or duplicate prop.
 function stirPlan(spec){
  if(!spec||!pair(spec.rest)||!pair(spec.center)||!pair(spec.radius)||!spec.radius.every(v=>v>0)||!finite(spec.height)||spec.height<=0||!finite(spec.clearance)||spec.clearance<0)return null;
  const c=landmarks(manifest,contacts,spec.id);
  if(!c?.grip||!c.workingTip)return null;
  const angle=spec.angle??.48;if(!finite(angle)||Math.abs(angle)>Math.PI)return null;
  const rest=placement.geometry(manifest,spec.id,...spec.rest,spec.height);
  if(!rest)return null;
  return {id:spec.id,height:spec.height,rest,center:spec.center.slice(),radius:spec.radius.slice(),clearance:spec.clearance,angle,grip:c.grip.slice(),tip:c.workingTip.slice()};
 }
 function stirFrame(plan,progress,gestureAngle=0,reduced=false){
  if(!plan||![progress,gestureAngle].every(finite))return null;
  const p=Math.max(0,Math.min(1,progress)),active=p>=.25&&p<=.75;
  const travel=p<.25?p/.25:p>.75?(1-p)/.25:1;
  const u=ease(travel),restTip=plan.rest.point(...plan.tip);
  const orbit=[plan.center[0]+Math.cos(gestureAngle)*plan.radius[0],plan.center[1]+Math.sin(gestureAngle)*plan.radius[1]];
  // Lift above the work surface during transfer. Reduced motion retains
  // exact endpoint/gesture contact without the decorative transfer arc.
  const desired=[mix(restTip[0],orbit[0],u),mix(restTip[1],orbit[1],u)-(reduced?0:Math.sin(Math.PI*u)*plan.clearance)];
  const angle=u*plan.angle;
  const probe=placement.geometry(manifest,plan.id,0,0,plan.height,{anchor:plan.grip,angle});
  if(!probe)return null;
  const offset=probe.point(...plan.tip),hand=[desired[0]-offset[0],desired[1]-offset[1]];
  const pose=utensilPose(plan.id,hand,plan.height,angle);
  return pose?{...pose,phase:p===0?'rest':p===1?'settled':active?'stir':p<.25?'lift':'return',active,progress:p}:null
 }
 return Object.freeze({pourPlan,pourFrame,utensilPose,stirPlan,stirFrame});
}
return Object.freeze({landmarks,create});
});
