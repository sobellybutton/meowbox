'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const get=n=>src.split('/* PAW_'+n+'_BEGIN */')[1].split('/* PAW_'+n+'_END */')[0];
const api=new Function(get('READING_SEATED_HOST')+get('YUE_DESK')+';return {pawReadingSeatPlan,pawYueDeskBox,pawYueHostTapBox,pawYueAdoptSeatedVisit}')();
let count=0;
for(const w of [320,360,390,600,900,1280])for(const h of [568,640,844,1065,1600])for(const phase of ['idle','question','result']){
 const p={x:100,y:-145,w,h},plan=api.pawReadingSeatPlan('destiny',p,phase),b=api.pawYueDeskBox(p),tap=api.pawYueHostTapBox(p);
 assert(Math.abs(plan.center[1]-(p.y+.365*h))<1e-8&&Math.abs(plan.clip[3]-.445*h)<1e-8&&b.clipBottom===p.y+.445*h&&tap[1]+tap[3]<=b.clipBottom+1e-8);count++;
}
for(const valid of [false,true])for(const blocked of [false,true])for(const busy of [null,'tarot'])for(const ready of [false,true]){
 const v=valid?{id:'destiny',ready:false}:null;
 assert.equal(api.pawYueAdoptSeatedVisit(v,'destiny',busy,blocked,()=>ready),!!(valid&&!blocked&&!busy&&ready));count++;
}
const layout=require('../assets/visual/painted/interior-layouts.js'),room=layout.rooms.destiny,goal=room.stations.destiny.approach;
assert.deepEqual(goal,[.43,.47]);
const bounds=layout.bounds('destiny',goal[1]);assert(goal[0]>=bounds[0]&&goal[0]<=bounds[1]);
assert(src.includes('pawYueHostTapBox(pawReadingPlate)'));
console.log('PASS '+count+' Master Yue desk, pose and visit ownership checks plus chair-side approach');
