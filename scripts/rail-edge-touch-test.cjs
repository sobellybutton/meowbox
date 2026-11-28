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
const a=source.indexOf('/* PAW_RAIL_NEAR_STATION_BEGIN */'),b=source.indexOf('// A plaque can have a valid rectangle',a);
const handlers=new Function(`let scene='island',transitioning=false,room=null,activity=null,pending=null,proposal={hidden:true},drag={},now=10,walks=[],doc={},edge={},win={};
let p={x:550,y:400};const maps={island:{st:[['station',550,373]]},home:{st:[['station',515,400]]}};
const performance={now:()=>now},document={hidden:false,addEventListener:(k,fn)=>doc[k]=fn},window={addEventListener:(k,fn)=>win[k]=fn},$=()=>({style:{display:'none'}}),walkDoor=id=>{walks.push(id);pending=id};
const pawRailEdge={hidden:false,addEventListener:(k,fn)=>edge[k]=fn,setPointerCapture:()=>{}};
`+source.slice(a,b)+`
return {edge,doc,win,walks,button:pawRailEdge,reset:()=>{pending=null;now+=500},change:()=>{scene='home'},far:()=>{p.y=1500}};
`)();
const e=(x=100,y=100,id=2)=>({button:0,isPrimary:true,pointerId:id,clientX:x,clientY:y,detail:1,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
handlers.edge.pointerdown(e());handlers.doc.pointerup(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'one route, no duplicate click');
handlers.reset();handlers.edge.pointerdown(e());handlers.doc.pointerup(e(140));handlers.button.onclick(e());ck(handlers.walks.length===1,'drag does not route');
handlers.reset();handlers.edge.pointerdown(e());handlers.doc.pointercancel(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'cancel does not route');
handlers.reset();handlers.edge.pointerdown(e());handlers.change();handlers.doc.pointerup(e());handlers.button.onclick(e());ck(handlers.walks.length===1,'no stale district route');
handlers.reset();handlers.button.onclick({...e(),detail:0});ck(handlers.walks.length===2,'keyboard accessible');
ck(source.includes('if(pawRailEdgePress?.scene===scene&&!pawRailEdge.hidden)return result'),'hold edge layout during touch');
handlers.reset();handlers.far();handlers.edge.pointerdown(e());handlers.doc.pointerup(e());handlers.button.onclick({...e(),detail:0});ck(handlers.walks.length===2,'distant station rejects touch and keyboard');
const near=new Function(source.match(/\/\* PAW_RAIL_NEAR_STATION_BEGIN \*\/([\s\S]*?)\/\* PAW_RAIL_NEAR_STATION_END \*\//)[1]+';return pawRailNearStation')();
for(const [x,y] of [[568,365],[515,400],[551,373],[707,461]])for(let dx=-400;dx<=400;dx+=10)for(let dy=-400;dy<=400;dy+=10)ck(near({x:x+dx,y:y+dy},['station',x,y])===(Math.hypot(dx,dy)<=280),'station proximity');
ck(!near({x:375,y:702},['station',568,365]),'Fortune temple is before railway reveal');
ck(!near({x:NaN,y:400},['station',515,400]),'invalid position rejected');
console.log('PASS '+checks+' railway touch ownership and route checks');
