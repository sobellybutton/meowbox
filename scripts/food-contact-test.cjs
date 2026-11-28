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
// Read the actual runtime clock rather than a duplicate implementation.
const startup=require('node:fs').readFileSync(require('node:path').join(__dirname,'../src/startup.js'),'utf8');
const liveBlock=startup.split('/* PAW_KITCHEN_LADLE_BEGIN */')[1]?.split('/* PAW_KITCHEN_LADLE_END */')[0];
ck(liveBlock,'live kitchen block');
const tick=new Function(liveBlock+';return pawKitchenLadleTick')();
const clock={travel:0,angle:0,last:0};
for(let i=1;i<=40;i++){tick(clock,i*.016,true,i*.2,false,false);ck(clock.travel>=0&&clock.travel<=.25,'bounded clock')}
ck(clock.travel===.25,'working position');
const angle=clock.angle;tick(clock,1,false,100,true,false);ck(clock.travel===.25&&clock.angle===angle,'paused');
for(let i=1;i<=40;i++)tick(clock,1+i*.016,false,0,false,false);
ck(clock.travel===0,'returns to counter');
tick(clock,2,true,1,false,true);ck(clock.travel===.25&&clock.angle===1,'reduced motion pickup');
tick(clock,3,false,0,false,true);ck(clock.travel===0,'reduced motion return');
const kitchen=motion.stirPlan({id:'kitchen_wooden_ladle',rest:[253,536],center:[400,481],radius:[27,10],height:92,clearance:24,angle:-1.68});
ck(kitchen,'live plan');
for(let i=0;i<360;i++){const a=i*Math.PI/180,f=motion.stirFrame(kitchen,.25,a);ck(near(f.tip,[400+27*Math.cos(a),481+10*Math.sin(a)]),'tip stays inside actual pot');ck(f.hand[0]<f.tip[0]&&f.hand[1]<f.tip[1],'grip faces cook')}
ck(!motion.stirPlan({id:'kitchen_wooden_ladle',rest:[253,536],center:[400,481],radius:[27,10],height:92,clearance:24,angle:4}),'invalid working angle');
const serveBlock=startup.split('/* PAW_KITCHEN_SERVE_BEGIN */')[1]?.split('/* PAW_KITCHEN_SERVE_END */')[0];
ck(serveBlock,'live serving block');
const serveMotion=new Function(serveBlock+';return pawKitchenServeMotion')();
const bowl=placement.geometry(manifest,'kitchen_small_bowl',510,437,34);
for(const reduced of [false,true]){
 let lastFill=0;
 for(let i=0;i<=220;i++){
  const q=serveMotion(i/100,reduced);
  ck(q.u>=0&&q.u<=1&&q.fill>=lastFill-1e-9&&q.fill<=1,'bounded serving and monotonic fill');
  ck(near(q.lip,bowl.point(44,24)),'stream ends at bowl opening');
  ck(q.stream===(q.phase==='pour'),'stream only while pouring');
  lastFill=q.fill;
 }
 const first=serveMotion(0,reduced),last=serveMotion(2.2,reduced);
 ck(first.u===0&&first.fill===0&&!first.done,'empty bowl and utensil at rest');
 ck(last.u===0&&last.fill===1&&last.done&&!last.stream,'filled bowl and utensil returned');
}
const clockBlock=startup.split('/* PAW_FOOD_CLOCK_BEGIN */')[1]?.split('/* PAW_FOOD_CLOCK_END */')[0];
ck(clockBlock,'food pause clock');
const foodClock=new Function(clockBlock+';return pawFoodClock')();
const serving={pawSoupServeAt:10};
foodClock(serving,'cook',10,false);foodClock(serving,'cook',11,true);foodClock(serving,'cook',15,true);foodClock(serving,'cook',16,false);
ck(serving.pawSoupServeAt===16,'serving clock freezes during interruption');
serving.pawSoupServed=true;serving.tasteAt=16;foodClock(serving,'cook',17,false);
ck(serving.pawFoodClock.phase==='taste','tasting resumes original clock');
const extension=require('node:fs').readFileSync(require('node:path').join(__dirname,'../src/extensions.js'),'utf8');

const tasteMotion=new Function(serveBlock+';return pawKitchenTasteMotion')();
const assistBlock=startup.slice(startup.indexOf('function mb5AssistSpec('),startup.indexOf('function mb5AssistPerform('));
const assist=new Function(assistBlock+';return mb5AssistSpec')();
const meal={done:true,pawSoupServeMode:true};
ck(assist('cook',meal,0).action==='serve-soup','offer serving before tasting');
meal.pawSoupServeAt=0;ck(assist('cook',meal,1).disabled,'no duplicate action while serving');
meal.pawSoupServed=true;ck(assist('cook',meal,2.2).action==='taste','taste after serve');
meal.tasteAt=2.3;ck(assist('cook',meal,3).disabled,'no duplicate tasting');
meal.tasted=true;ck(assist('cook',meal,5).action==='back','return after tasting');
ck(assist('cook',{done:true},0).action==='taste','legacy fallback remains playable');
for(let i=0;i<=270;i++){
 const f=tasteMotion(i/100),r=tasteMotion(i/100,true);
 ck(f.x>=344&&f.x<=510&&f.y>=377&&f.y<=437,'bounded sip motion');
 ck(f.fill>=.3-1e-8&&f.fill<=1,'bounded soup fill');
 ck(r.x===510&&r.y===437&&r.reach===null,'reduced motion stays grounded');
}
ck(tasteMotion(0).x===510&&tasteMotion(0).y===437,'starts at served bowl anchor');
ck(tasteMotion(2.7).x===510&&tasteMotion(2.7).y===437,'returns to same anchor');
ck(tasteMotion(2.7).done,'taste completes');
ck(tasteMotion(1.3).x===344&&tasteMotion(1.3).y===377,'sip dwell');
ck(extension.includes('const pose=pawKitchenTasteMotion(age,residentReducedMotion.matches);'),'live tasting motion used');
ck(extension.includes('drawRitualPose(290,495,1.35,{reach:pose.reach});'),'same actor scale as serving');
ck(startup.includes("else if(action==='serve-soup')pawKitchenServeRequest();"),'assist uses real serving action');


const steamBlock=startup.split('/* PAW_KITCHEN_STEAM_BEGIN */')[1].split('function pawKitchenSteamAvailable')[0];
const steam=new Function(steamBlock+';return {pawKitchenSteamAdvance,pawKitchenSteamSpec,pawKitchenSteamPlate}')();
const meal2={phase:'prep',age:0,last:0};let steamNow=0;
ck(!steam.pawKitchenSteamAdvance(meal2,0,false,'steam-cook'),'cannot skip preparation');
ck(steam.pawKitchenSteamAdvance(meal2,0,false,'steam-load'),'load vegetables');
ck(steam.pawKitchenSteamSpec(meal2).disabled,'loading input locked');
for(let i=0;i<20;i++){steamNow+=.1;steam.pawKitchenSteamAdvance(meal2,steamNow,true);ck(meal2.phase==='loading'&&meal2.age===0,'pause holds preparation')}
for(let i=0;i<9;i++){steamNow+=.1;steam.pawKitchenSteamAdvance(meal2,steamNow,false)}
ck(meal2.phase==='loaded','vegetables loaded');
ck(steam.pawKitchenSteamAdvance(meal2,steamNow,false,'steam-cook'),'start steaming');
for(let i=0;i<41;i++){steamNow+=.1;steam.pawKitchenSteamAdvance(meal2,steamNow,false)}
ck(meal2.phase==='ready','steaming complete');
ck(steam.pawKitchenSteamAdvance(meal2,steamNow,false,'steam-serve'),'serve vegetables');
for(let i=0;i<10;i++){steamNow+=.1;steam.pawKitchenSteamAdvance(meal2,steamNow,false)}
ck(meal2.phase==='served','served vegetables');
ck(steam.pawKitchenSteamAdvance(meal2,steamNow,false,'steam-taste'),'taste vegetables');
for(let i=0;i<16;i++){steamNow+=.1;steam.pawKitchenSteamAdvance(meal2,steamNow,false)}
ck(meal2.phase==='done','meal complete');
ck(steam.pawKitchenSteamSpec(meal2).action==='back','return to same kitchen');
for(const phase of ['prep','loading','loaded','steaming','ready','serving','served','eating','done'])for(let i=0;i<=150;i++)for(const reduced of [false,true]){
 const a=steam.pawKitchenSteamPlate({phase,age:i/100},reduced);
 ck(Number.isFinite(a.x)&&Number.isFinite(a.y)&&a.x>=344&&a.x<=530&&a.y>=377&&a.y<=600,'bounded vegetable plate motion');
}
ck(startup.includes("pawPaintFoodProp('kitchen_bamboo_steamer',400,535,112);"),'actual painted steamer');
ck(extension.includes('if(!state.pawSteam&&!state.done&&(W<H||ladle))'),'no duplicated avatar');
ck(startup.includes("if(kind==='cook'&&q.pawSteam)return pawKitchenSteamSpec(q.pawSteam);"),'live alternate recipe control');


let panNow=0,panMeal={method:'pan',phase:'prep',age:0,last:0,turns:0};
const panAdvance=(action,blocked=false)=>steam.pawKitchenSteamAdvance(panMeal,panNow,blocked,action);
const panTick=(count,blocked=false)=>{for(let i=0;i<count;i++){panNow+=.1;panAdvance(undefined,blocked)}};
ck(!panAdvance('pan-turn'),'cannot turn before loading tofu');
ck(panAdvance('pan-load'),'load tofu');panTick(8);
ck(panMeal.phase==='loaded','tofu prepared');
for(let i=1;i<=3;i++){
 ck(steam.pawKitchenSteamSpec(panMeal).key==='tofu-loaded-'+i,'distinct turn count');
 ck(panAdvance('pan-turn'),'deliberate turn');
 ck(!panAdvance('pan-turn'),'no overlapping turn');
 ck(!panAdvance('pan-serve'),'cannot serve early');
 panTick(15,true);ck(panMeal.age===0,'interruption holds turn');
 panTick(12);ck(panMeal.turns===i,'one turn counted');
 ck(panMeal.phase===(i===3?'ready':'loaded'),'three required turns');
}
ck(panAdvance('pan-serve'),'serve tofu');panTick(9);
ck(panMeal.phase==='served','tofu served');
ck(panAdvance('pan-taste'),'taste tofu');panTick(15);
ck(panMeal.phase==='done','tofu finished');
ck(steam.pawKitchenSteamSpec(panMeal).action==='back','back to kitchen');
const panFunction=startup.slice(startup.indexOf('function pawKitchenPanTurn('),startup.indexOf('function pawKitchenPanTofu('));
const panTurn=new Function(panFunction+';return pawKitchenPanTurn')();
for(let i=0;i<=110;i++){
 const a=panTurn({phase:'turning',age:i/100}),r=panTurn({phase:'turning',age:i/100},true);
 ck(a.progress>=0&&a.progress<=1&&a.lift>=0&&a.lift<=14,'bounded turn animation');
 ck(r.lift===0,'reduced motion');
}
ck(startup.includes("pawPaintFoodProp('kitchen_frying_pan',400,535,92);"),'painted frying pan drawn');
ck(startup.includes("pawKitchenSteamAction('pan-select',run)"),'second native recipe choice');
ck(startup.includes("if(tool)pawFoodLive.placement.draw(ctx,pawFoodLive.cache.image('kitchen_wooden_spatula'),tool.prop)"),'painted spatula drawn');


const stockBlock=startup.split('/* PAW_KITCHEN_STOCK_BEGIN */')[1].split('/* PAW_KITCHEN_STOCK_END */')[0];
const stock=new Function(stockBlock+';return {pawKitchenStockArt,pawKitchenStockGeometry,pawKitchenPickupFrame,pawKitchenPickupTick,pawKitchenPickupAllowed}')();
for(const spec of Object.values(stock.pawKitchenStockArt)){
 const g=stock.pawKitchenStockGeometry(spec);
 ck(Math.abs(g.y+spec.bounds[3]*g.z-spec.base[1])<1e-8,'stock grounded on counter');
 for(const [x,y] of spec.outline)ck(x>=0&&x<=spec.size[0]&&y>=0&&y<=spec.size[1],'silhouette bounded');
}
for(let i=0;i<3;i++){
 const q={i,x:270+i*130,y:610,age:0,last:0};
 for(let j=0;j<=65;j++){q.age=j/100;for(const reduced of [false,true]){
  const f=stock.pawKitchenPickupFrame(q,reduced);
  ck(f.x>=270&&f.x<=530&&f.y>=454&&f.y<=610,'bounded ingredient travel');
 }}
 q.age=0;
 for(let j=1;j<=20;j++){stock.pawKitchenPickupTick(q,j*.1,true);ck(q.age===0,'pause preserves pickup')}
 for(let j=21;j<=28;j++)stock.pawKitchenPickupTick(q,j*.1,false);
 ck(q.age>=.65-1e-8,'pickup completes');
 ck(stock.pawKitchenPickupAllowed({ingredients:[]},i),'available ingredient');
 ck(!stock.pawKitchenPickupAllowed({ingredients:[i]},i),'cannot add twice');
 ck(!stock.pawKitchenPickupAllowed({ingredients:[],pawStockPickup:q},i),'cannot overlap pickup');
 ck(!stock.pawKitchenPickupAllowed({ingredients:[],pawSteam:{}},i),'cannot mix cooking modes');
}
ck(extension.includes("if(typeof pawKitchenStockPaint==='function')pawKitchenStockPaint();"),'stock integrated into counter');
ck(extension.includes("const id=used||pending?'empty':"),'no duplicate food plate');
ck(extension.includes('!q.pawSteam&&!q.pawStockPickup&&!q.done'),'drag path guarded');
ck(startup.includes('pawKitchenStockRequest(run,i)'),'stock pickup connected');

console.log('PASS '+n+' food contact geometry, phase and source assertions; no rendered contact acceptance');
