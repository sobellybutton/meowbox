'use strict';
const assert=require('node:assert/strict'),placement=require('../assets/visual/painted/food-props/placement.js'),manifest=require('../assets/visual/painted/food-props/manifest.json'),contacts=require('../assets/visual/painted/food-props/contact-candidates.json'),api=require('../assets/visual/painted/food-props/contact.js');
let n=0;const ck=(v,m)=>{assert(v,m);n++},near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-7;
const motion=api.create(placement,manifest,contacts);
for(const id of Object.keys(contacts.assets))ck(api.landmarks(manifest,contacts,id),id+' source identity and bounds');
for(const vessel of ['boba_milk_pitcher','boba_tea_pot','kitchen_kettle'])for(const receiver of ['boba_cup_empty','kitchen_mixing_bowl','kitchen_stock_pot'])for(const h of [50,90]){
 const spec={vessel,receiver,rest:[450,400],receiverBase:[310,400],vesselHeight:h,receiverHeight:55,gap:18};
 const plan=motion.pourPlan(spec);ck(plan,'plan');
 for(const reduced of [false,true]){
  const start=motion.pourFrame(plan,0,reduced),end=motion.pourFrame(plan,1,reduced);
  ck(near(start.vessel.point(0,0),plan.rest.point(0,0))&&near(end.vessel.point(0,0),plan.rest.point(0,0)),'exact rest and return');
  ck(!start.stream&&!end.stream,'no stream at rest');
  for(let i=0;i<=100;i++){
   const p=i/100,q=motion.pourFrame(plan,p,reduced);
   ck(q&&near(q.vessel.point(...plan.grip),q.grip),'tool follows grip');
   ck(!!q.stream===(p>=.35&&p<.70),'stream only during pour');
   if(q.stream){
    ck(near(q.stream.from,q.vessel.point(...plan.spout)),'stream starts at actual lip');
    ck(near(q.stream.to,plan.endLip),'stream ends in receiver opening');
    ck(Math.abs(q.stream.from[0]-q.stream.to[0])<1e-7&&Math.abs(q.stream.to[1]-q.stream.from[1]-spec.gap)<1e-7,'downward stream');
   }
  }
 }
}
for(const id of ['kitchen_wooden_ladle','kitchen_wooden_spatula','kitchen_small_ladle'])for(const a of [-1,0,1]){
 const q=motion.utensilPose(id,[200,300],75,a);
 ck(q&&near(q.prop.point(...contacts.assets[id].grip),q.hand),'hand grip locked');
 ck(near(q.tip,q.prop.point(...contacts.assets[id].workingTip)),'working tip derived from same transform');
}
// Exact live boba counter coordinates from pawFoodPourFrame. Preserve
// upright vertical lift and upright lowering before/after lateral reach.
const lip=placement.geometry(manifest,'boba_cup_empty',420,525,82).point(...contacts.assets.boba_cup_empty.receiver);
const live=motion.pourPlan({vessel:'boba_tea_pot',receiver:'boba_cup_empty',rest:[530,516],receiverBase:[840-lip[0],970-lip[1]],vesselHeight:70,receiverHeight:82,gap:34});
ck(live,'actual counter plan');
for(let i=0;i<=1000;i++){
 const p=i/1000,q=motion.pourFrame(live,p);
 ck(q&&near(q.vessel.point(...live.grip),q.grip),'actual pot grip');
 if(p<=.35*.45||p>=1-.30*.45){
  ck(Math.abs(q.vessel.angle)<1e-7,'lift/lower upright');
  ck(Math.abs(q.grip[0]-live.startGrip[0])<1e-7,'vertical lift/lower at original counter');
  ck(q.vessel.visibleAABB[0]>live.receive.visibleAABB[2],'upright vessel stays clear of cup');
 }
 if(q.stream)ck(near(q.stream.to,[420,445])&&Math.abs(q.stream.from[0]-420)<1e-7&&Math.abs(q.stream.to[1]-q.stream.from[1]-34)<1e-7,'actual cup lip contact');
}
ck(!motion.pourPlan({}),'invalid plan');
ck(!motion.utensilPose('unknown',[0,0],10,0),'unknown tool');
ck(!api.landmarks(manifest,{...contacts,assets:{boba_tea_pot:{sourceBlob:'wrong',grip:[1,1]}}},'boba_tea_pot'),'stale artwork');
// Stirring uses the actual gesture angle, keeps the working tip inside
// the recipe's pot ellipse, and returns to the same counter anchor.
for(const id of ['kitchen_wooden_ladle','kitchen_small_ladle','kitchen_wooden_spatula'])for(const height of [45,75,105])for(const reduced of [false,true]){
 const p=motion.stirPlan({id,rest:[540,545],center:[400,481],radius:[49,13],height,clearance:28});
 ck(p,'stir plan');
 for(let i=0;i<=100;i++){
  const progress=i/100,a=i*.31,q=motion.stirFrame(p,progress,a,reduced);
  ck(q&&near(q.prop.point(...p.grip),q.hand),'stir grip');
  ck(near(q.tip,q.prop.point(...p.tip)),'stir working tip');
  if(q.active)ck(near(q.tip,[400+49*Math.cos(a),481+13*Math.sin(a)]),'gesture follows pot orbit');
  if(i===0||i===100)ck(near(q.prop.point(0,0),p.rest.point(0,0)),'exact utensil rest and return');
 }
}
ck(!motion.stirPlan({}),'invalid stir plan');
console.log('PASS '+n+' food contact geometry, phase and source assertions; no rendered contact acceptance');
