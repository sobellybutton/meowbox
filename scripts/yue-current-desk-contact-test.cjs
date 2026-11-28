'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const get=n=>src.split('/* PAW_'+n+'_BEGIN */')[1].split('/* PAW_'+n+'_END */')[0];
const api=new Function(get('READING_SEATED_HOST')+get('YUE_DESK')+';return {pawReadingSeatPlan,pawYueDeskBox,pawYueHostTapBox,pawYueAdoptSeatedVisit}')();
let count=0;
for(const w of [320,360,390,600,900,1280])for(const h of [568,640,844,1065,1600])for(const phase of ['idle','question','result']){
 const p={x:100,y:-145,w,h},plan=api.pawReadingSeatPlan('destiny',p,phase),b=api.pawYueDeskBox(p),tap=api.pawYueHostTapBox(p);
 assert(Math.abs(plan.center[1]-(p.y+.350*h))<1e-8&&Math.abs(plan.clip[3]-.447*h)<1e-8&&b.clipBottom===p.y+.447*h&&tap[1]+tap[3]<=b.clipBottom+1e-8);count++;
}
for(const valid of [false,true])for(const blocked of [false,true])for(const busy of [null,'tarot'])for(const ready of [false,true]){
 const v=valid?{id:'destiny',ready:false}:null;
 assert.equal(api.pawYueAdoptSeatedVisit(v,'destiny',busy,blocked,()=>ready),!!(valid&&!blocked&&!busy&&ready));count++;
}
const layout=require('../assets/visual/painted/interior-layouts.js'),room=layout.rooms.destiny,goal=room.stations.destiny.approach;
assert.deepEqual(goal,[.63,.575]);
const bounds=layout.bounds('destiny',goal[1]);assert(goal[0]>=bounds[0]&&goal[0]<=bounds[1]);
assert(src.includes('pawYueHostTapBox(pawReadingPlate)'));
assert(src.includes("if(id==='destiny')pawYueAdoptSeatedVisit(pawHostVisit,id,activity,transitioning"));
console.log('PASS '+count+' Master Yue desk, pose and visit ownership checks plus chair-side approach');

assert(room.lane.length&&layout.route('destiny',room.arrival,goal));
const seatApi=new Function('function pawReadingWorld(v,p){return [p.x+v[0]*p.w,p.y+v[1]*p.h]}\n'+get('YUE_VISITOR_SEAT').split('let pawYueVisitorLastDraw')[0]+';return pawYueVisitorSeat')();
for(let i=0;i<4;i++){const p={x:0,y:0,w:360,h:640},a=[200,370],r=seatApi(p,a,a,i,true,false);assert(r&&Math.abs(r.hip.x-246.6)<.001&&Math.abs(r.hip.y-342.4)<.001);assert.equal(seatApi(p,a,a,i,false,false),null);assert.equal(seatApi(p,a,a,i,true,true),null);assert.equal(seatApi(p,[0,0],a,i,true,false),null)}
