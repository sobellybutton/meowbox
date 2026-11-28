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
 return Object.freeze({pourPlan,pourFrame,utensilPose});
}
return Object.freeze({landmarks,create});
});
