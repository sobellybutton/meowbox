'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const grab=(a,b)=>s.split(a)[1].split(b)[0];
const stair=grab('function pawStairLane(y,points=pawPlayerStairs){','function pawStairFoot');
const geo=grab('/* PAW_DISTRICT_GROUND_BEGIN','/* PAW_DISTRICT_GROUND_END */');
const h=grab('/* PAW_NEW_DISTRICTS_BEGIN */','/* PAW_NEW_DISTRICTS_END */');
const {data,plan,foot}=new Function('function pawStairLane(y,points=pawPlayerStairs){'+stair+geo.slice(geo.indexOf('function pawDistrictFoot'))+h+';return {data:pawNewDistricts,plan:pawNewDistrictPlan,foot:pawDistrictFoot}')();
const expected={home:['fish','tea','park','station'],island:['mystery','arcade','kitchen','boba','station'],wonder:['quiz','story','match','station']};
for(const [key,v] of Object.entries(data)){
 assert.deepEqual(Object.keys(v.doors).sort(),expected[key].sort(),key+' preserves all room IDs');
 assert.equal(v.size.join('x'),'962x1635');
 assert.ok(fs.existsSync(path.join(__dirname,'../'+v.path)),key+' committed image exists');
 assert.ok(v.player.every((a,i)=>a[2]>0&&(!i||a[0]>v.player[i-1][0])));
 assert.deepEqual(foot(v.player,...v.spawn),{x:v.spawn[0],y:v.spawn[1]});
 for(const [id,d] of Object.entries(v.doors)){
  assert.ok(d.hit[0]>=0&&d.hit[1]>=0&&d.hit[0]+d.hit[2]<=1000&&d.hit[1]+d.hit[3]<=v.height);
  for(const [x,y] of [v.spawn,...v.player.filter((_,i)=>i%4===0).map(q=>[q[1],q[0]])]){
   const route=plan(key,id,{x,y});assert.ok(route?.length,key+' '+id);
   assert.deepEqual(route.at(-1),{x:d.approach[0],y:d.approach[1]});
   for(let i=1;i<route.length;i++)for(let f=0;f<=1;f+=.1){
    const a=route[i-1],b=route[i],x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f,q=foot(v.player,x,y);
    assert.ok(Math.hypot(q.x-x,q.y-y)<.05,key+' '+id+' lane')
   }
  }
 }
}
console.log('Three selected district geometry regressions PASS');
