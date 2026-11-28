'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_RAIL_EDGE_PRESS_BEGIN \*\/([\s\S]*?)\/\* PAW_RAIL_EDGE_PRESS_END \*\//)[1];
const valid=new Function(block+';return pawRailEdgePressValid')();
let checks=0;const ck=(v,m)=>{assert.ok(v,m);checks++};
const press={id:2,scene:'island',x:100,y:100};
for(const scene of ['island','home'])for(const blocked of [true,false])for(const pointerId of [2,5])for(let x=60;x<=140;x+=2)for(let y=60;y<=140;y+=2){
 const got=valid(press,{scene,blocked},{pointerId,clientX:x,clientY:y});
 ck(got===(scene==='island'&&!blocked&&pointerId===2&&Math.hypot(x-100,y-100)<30),'captured tap only')
}
const a=source.indexOf('/* PAW_RAIL_EDGE_PRESS_BEGIN */'),b=source.indexOf('// A plaque can have a valid rectangle',a);
const handlers=new Function(`let scene='island',transitioning=false,room=null,activity=null,pending=null,proposal={hidden:true},drag={},now=10,walks=[],doc={},edge={},win={};
const performance={now:()=>now},document={hidden:false,addEventListener:(k,fn)=>doc[k]=fn},window={addEventListener:(k,fn)=>win[k]=fn},$=()=>({style:{display:'none'}}),walkDoor=id=>{walks.push(id);pending=id};
const p={x:100,y:100},maps={island:{st:[['station',100,100]]},home:{st:[['station',100,100]]}};
const pawRailEdge={hidden:false,addEventListener:(k,fn)=>edge[k]=fn,setPointerCapture:()=>{}};
/* PAW_RAIL_NEAR_STATION_BEGIN */
function pawRailNearStation(actor,station){
 return Array.isArray(station)&&station[0]==='station'&&[actor?.x,actor?.y,station[1],station[2]].every(Number.isFinite)&&Math.hypot(actor.x-station[1],actor.y-station[2])<=180
}
/* PAW_RAIL_NEAR_STATION_END */
`+source.slice(a,b)+`
return {edge,doc,win,walks,button:pawRailEdge,reset:()=>{pending=null;now+=500},change:()=>{scene='home'},far:()=>{p.x=500}};
`)();
const e=(x=100,y=100,id=2)=>({button:0,isPrimary:true,pointerId:id,clientX:x,clientY:y,detail:1,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
handlers.edge.pointerdown(e());handlers.doc.pointerup(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'one route, no duplicate click');
handlers.reset();handlers.edge.pointerdown(e());handlers.doc.pointerup(e(140));handlers.button.onclick(e());ck(handlers.walks.length===1,'drag does not route');
handlers.reset();handlers.edge.pointerdown(e());handlers.doc.pointercancel(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'cancel does not route');
handlers.reset();handlers.edge.pointerdown(e());handlers.change();handlers.doc.pointerup(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'no stale district route');
handlers.reset();handlers.button.onclick({...e(),detail:0});ck(handlers.walks.length===2,'keyboard accessible');
handlers.reset();handlers.edge.pointerdown(e());handlers.far();handlers.doc.pointerup(e());ck(handlers.walks.length===2,'distance rechecked on release');
ck(source.includes('if(pawRailEdgePress?.scene===scene&&!pawRailEdge.hidden)return result'),'hold edge layout during touch');
console.log('PASS '+checks+' railway touch ownership and route checks');
