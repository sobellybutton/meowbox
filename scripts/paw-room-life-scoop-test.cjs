const fs=require('node:fs'),path=require('node:path');const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');const a=s.indexOf('/* PAW_ROOM_LIFE_AND_SCOOP_BEGIN */'),b=s.indexOf('/* PAW_ROOM_LIFE_AND_SCOOP_END */');if(a<0||b<a)throw Error('Missing helpers');console.log('PASS '+new Function(s.slice(a,b)+"let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};ck(pawScoopInside(400,458),'centre');ck(!pawScoopInside(550,458),'outside');ck(!pawScoopInside(NaN,458),'invalid');ck(pawScoopProject(NaN,0)===null,'invalid projection');ck(pawScoopProject(400,458).x===400,'centre fixed');for(const [x,y] of [[700,700],[0,0],[400,800],[200,458]]){const p=pawScoopProject(x,y);ck(pawScoopInside(p.x,p.y),'project within water')}ck(pawTypedCount('你好呀',0)===1,'Chinese type');ck(pawTypedCount('hello',1000)===5,'finish');ck(pawTypedCount('hello',0,true)===5,'reduced');ck(pawTypedCount('',0)===0,'empty');ck(pawWalkStep({x:0,y:0},[3,0],.08).arrived,'arrival');ck(pawWalkStep({x:0,y:0},[100,0],.08).x<5,'bounded step');ck(pawWalkStep({x:0,y:0},[100,0],-1).x===0,'negative time');for(const [p,d] of [[[10,0],'right'],[[-10,0],'left'],[[0,-10],'up'],[[0,10],'down']])ck(pawWalkFacing({x:0,y:0},p)===d,'direction');return n;")()+' room life and scoop checks');

const guest=s.match(/function pawGuestCount\([\s\S]*?\n\}/)?.[0];
if(!guest)throw Error('Missing guest rotation helper');
console.log(new Function(guest+`let n=0;for(const room of ['temple','tarot','destiny','wishes','tea','park','fish','kitchen','arcade','boba','mystery','quiz','story','match']){
 for(const max of [1,2]){
  const counts=Array.from({length:12},(_,i)=>pawGuestCount(max,i,room));
  if(counts.some(v=>v<0||v>max)||!counts.includes(0)||!counts.includes(1)||(max===2&&!counts.includes(2)))throw Error('Guest roster '+room);
  n++;
 }
}return 'PASS '+n+' guest variety and occupancy cases';`)());
