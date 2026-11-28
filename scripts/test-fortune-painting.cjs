'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const grab=(a,b)=>s.split(a)[1].split(b)[0];
const stair=grab('function pawStairLane(y,points=pawPlayerStairs){','function pawStairFoot');
const geo=grab('/* PAW_DISTRICT_GROUND_BEGIN','/* PAW_DISTRICT_GROUND_END */');
const h=grab('/* PAW_FORTUNE_PAINTING_BEGIN */','/* PAW_FORTUNE_PAINTING_END */');
const {data,plan,foot}=new Function('function pawStairLane(y,points=pawPlayerStairs){'+stair+geo.slice(geo.indexOf('function pawDistrictFoot'))+h+';return {data:pawFortunePainting,plan:pawFortuneDoorPlan,foot:pawDistrictFoot}')();
assert.equal(data.size.join('x'),'962x1635');
assert.ok(data.player.every((a,i)=>a[2]>0&&(!i||a[0]>data.player[i-1][0])));
for(const [id,d] of Object.entries(data.doors))for(const [x,y] of [data.spawn,[500,800],[568,365],[505,1135]]){
 const route=plan(id,{x,y});assert.ok(route?.length,id);
 assert.deepEqual(route.at(-1),{x:d.approach[0],y:d.approach[1]});
 for(let i=1;i<route.length;i++)for(let f=0;f<=1;f+=.1){
  const a=route[i-1],b=route[i],x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f,q=foot(data.player,x,y);
  assert.ok(Math.hypot(q.x-x,q.y-y)<.05,id+' route remains on traced lane')
 }
}
console.log('Fortune selected painting geometry PASS');

const near=new Function(grab('/* PAW_FIRST_MAP_RAIL_BEGIN */','/* PAW_FIRST_MAP_RAIL_END */')+';return pawFortuneRailNearby')();
const station=data.doors.station.approach;
for(const id of ['tarot','destiny','temple','wishes']){
 const [x,y]=data.doors[id].approach;
 assert.equal(near('fortune',{x,y},station),false,id+' must not promote railway prematurely');
}
assert.equal(near('fortune',{x:data.spawn[0],y:data.spawn[1]},station),false);
assert.equal(near('fortune',{x:548,y:605},station),true);
assert.equal(near('fortune',{x:station[0],y:station[1]},station),true);
assert.equal(near('fortune',{x:NaN,y:365},station),false);
assert.equal(near('home',{x:0,y:0},station),true);
console.log('Fortune railway discovery distance PASS');
