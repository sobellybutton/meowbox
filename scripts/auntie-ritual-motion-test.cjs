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
console.log('Ah Ma motion: '+checks+' assertions passed; geometry only, no rendered visual approval');
