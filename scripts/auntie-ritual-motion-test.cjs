'use strict';
const assert=require('node:assert/strict'),api=require('../assets/visual/painted/ah-ma/ritual-motion.js');
let checks=0;function ok(v){assert.ok(v);checks++}
const near=(a,b,t=.001)=>Math.hypot(a[0]-b[0],a[1]-b[1])<t;
for(const height of [125,150,190,220])for(const direction of [.2,.5,.8,1.1]){
 const spec=api.fit([350,476],height,direction);ok(spec);ok(api.layout(spec.foot,height,[350,476]));
 ok(near(api.frame(spec,.23).tip,[350,476]));ok(near(api.frame(spec,.24).tip,[350,476]));
 ok(api.frame(spec,.01).phase==='anticipation');ok(api.frame(spec,.15).phase==='swing');
 ok(api.frame(spec,.23).phase==='impact');ok(api.frame(spec,.32).phase==='recovery');
 ok(api.frame(spec,.22).strike===false);ok(api.frame(spec,.23).strike);
 ok(api.frame(spec,.46)===null);ok(api.frame(spec,-1)===null);
 ok(near(api.frame(spec,.23,true).tip,[350,476]));
 ok(api.layout(spec.foot,height,[900,900])===null);
}
ok(api.fit([NaN,0],190)===null);ok(api.fit([350,476],0)===null);
const spec=api.fit([350,476],190),pose=api.frame(spec,.23),calls=[];
const ctx=Object.fromEntries(['save','restore','translate','scale','beginPath','rect','moveTo','lineTo','closePath','clip','drawImage','rotate'].map(k=>[k,(...args)=>calls.push([k,...args])]));
ok(api.draw(ctx,{complete:true,naturalWidth:344,naturalHeight:510},spec,pose));
ok(calls.filter(v=>v[0]==='drawImage').length===2);ok(calls.filter(v=>v[0]==='save').length===calls.filter(v=>v[0]==='restore').length);
ok(calls.some(v=>v[0]==='clip'&&v[1]==='evenodd'));ok(api.draw(ctx,{complete:true,naturalWidth:347,naturalHeight:510},spec,pose)===false);
const live=api.sceneLayout();ok(live);ok(near(api.frame(live,api.timing.contact).tip,api.station.contact));
ok(live.foot[0]>300&&live.foot[0]<350&&live.foot[1]>560&&live.foot[1]<600);
ok(api.station.paper[0]>api.station.contact[0]&&api.station.paper[1]===api.station.contact[1]);
const layerCalls=[];const layerCtx=Object.fromEntries(['save','restore','translate','scale','beginPath','rect','moveTo','lineTo','closePath','clip','drawImage','rotate'].map(k=>[k,(...args)=>layerCalls.push([k,...args])]));
const painted={complete:true,naturalWidth:344,naturalHeight:510};
ok(api.drawBody(layerCtx,painted,live));ok(layerCalls.filter(v=>v[0]==='drawImage').length===1);ok(api.drawArm(layerCtx,painted,live,api.frame(live,.23)));ok(layerCalls.filter(v=>v[0]==='drawImage').length===2);ok(layerCalls.filter(v=>v[0]==='save').length===layerCalls.filter(v=>v[0]==='restore').length);
const prep0=api.preparationFrame(live,0),prep1=api.preparationFrame(live,1);
ok(prep0.phase==='position');ok(prep1.phase==='ready');ok(near(prep1.center,api.station.paper));ok(near(prep0.grip,prep1.grip));
for(let i=0;i<=100;i++){const f=api.preparationFrame(live,i/100);ok(f.sx>=.30&&f.sx<=1&&f.sy>=.28&&f.sy<=1);ok(near(f.grip,[f.center[0]-(api.station.paper[0]-f.grip[0])*f.sx,f.center[1]-(api.station.paper[1]-f.grip[1])*f.sy]));ok(f.center[0]>335&&f.center[0]<421&&f.center[1]>506&&f.center[1]<540)}
ok(near(api.preparationFrame(live,0,true).center,api.station.paper));ok(api.preparationFrame(live,NaN)===null);
ok(api.drawSeatedHand(layerCtx,{complete:true,naturalWidth:347,naturalHeight:510},live));
ok(layerCalls.filter(v=>v[0]==='save').length===layerCalls.filter(v=>v[0]==='restore').length);
ok(!api.drawSeatedHand(layerCtx,painted,live));
const {lead,tail,lowAngle}=api.roundTiming;
ok(api.roundFrame(live,-lead-.001,lead,tail)===null);
ok(api.roundFrame(live,-lead,lead,tail).phase==='lift');
ok(Math.abs(api.roundFrame(live,-lead,lead,tail).angle-lowAngle)<.001);
ok(Math.abs(api.roundFrame(live,-.00001,lead,tail).angle)<.001);
ok(api.roundFrame(live,.23,lead,tail).strike);
ok(near(api.roundFrame(live,.23,lead,tail).tip,api.station.contact));
ok(api.roundFrame(live,.46,lead,tail).phase==='lower');
ok(Math.abs(api.roundFrame(live,.46,lead,tail).angle)<.001);
ok(Math.abs(api.roundFrame(live,.46+tail-.00001,lead,tail).angle-lowAngle)<.001);
ok(api.roundFrame(live,.46+tail,lead,tail)===null);
ok(api.roundFrame(live,-.1,0,0)===null);ok(api.roundFrame(live,.46,0,0)===null);
ok(api.roundFrame(live,-lead,lead,tail,true).angle===0);
ok(api.roundFrame(live,.46,lead,tail,true).angle===lowAngle);
for(let i=0;i<100;i++){const f=api.roundFrame(live,-lead+lead*i/100,lead,tail),g=api.roundFrame(live,.46+tail*i/100,lead,tail);ok(!f.strike&&!g.strike);ok(f.angle>=lowAngle&&f.angle<=0&&g.angle>=lowAngle&&g.angle<=0);ok(Math.abs(Math.hypot(f.tip[0]-live.pivot[0],f.tip[1]-live.pivot[1])-Math.hypot(g.tip[0]-live.pivot[0],g.tip[1]-live.pivot[1]))<.001)}

/* Exercise the effective round handlers as well as the geometry module. */
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const segment=(a,b)=>{const i=source.indexOf(a),j=source.indexOf(b,i);assert.ok(i>=0&&j>i);return source.slice(i,j)};
const helpers=segment('function pawAuntieRoundRemaining','/* PAW_AUNTIE_ROUND_END */');
const handlers=segment('function pawAuntieBeginRound()','const paperRitualPaperBefore=paperWorryAt;');
const run={paperPrepared:true},events=[];
const runtime=new Function('state','events','api',`
let t=10,stressSwingAt=0,activity='hit',room='fish',smack,blocked=false;
const globalThis={PawAuntieRitualMotion:api};
function paperRitualAllowed(){return !blocked}
function paperRitualBusy(){return !!state.paperAction}
function openStressChoices(){events.push('choice')}
function paperRitualSyncButtons(){}
function paperRitualCancel(){state.paperAction=null;state.paperRoundRemaining=0;events.push('cancel')}
function paperRitualImpactBefore(){events.push('hit')}
function hint(){events.push('finished')}
function refreshControls(){}
${helpers}
${handlers}
return {begin:pawAuntieBeginRound,tick:x=>{t=x;paperRitualAdvance()},block:v=>blocked=v}
`)(run,events,api);
const hits=()=>events.filter(x=>x==='hit').length;
ok(runtime.begin());ok(!runtime.begin());ok(run.paperAction.lead===lead);ok(run.paperAction.tail===0);
runtime.tick(10.4);ok(events.length===0);runtime.tick(10.92);ok(hits()===1);runtime.tick(11);ok(hits()===1);
runtime.tick(11.15);ok(run.paperRoundRemaining===2);ok(run.paperAction.lead===0&&run.paperAction.tail===0);
runtime.tick(11.39);ok(hits()===2);runtime.tick(11.62);ok(run.paperRoundRemaining===1);ok(run.paperAction.tail===tail);
runtime.tick(11.86);ok(hits()===3);runtime.tick(12.1);ok(run.paperAction!==null);ok(!events.includes('finished'));
runtime.block(true);runtime.tick(12.9);ok(run.paperAction!==null);runtime.block(false);runtime.tick(12.91);
ok(run.paperAction===null);ok(run.paperRoundRemaining===0);ok(hits()===3);ok(events.filter(x=>x==='finished').length===1);
console.log('Ah Ma geometry and runtime: '+checks+' assertions passed; no rendered visual approval');

