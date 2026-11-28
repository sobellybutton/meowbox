'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const block=source.split('/* PAW_VISITOR_LIFECYCLE_BEGIN */')[1].split('/* PAW_VISITOR_LIFECYCLE_END */')[0];
const clear=source.slice(source.indexOf('function pawGuestClear('),source.indexOf('function pawGuestStationFeet('));
const api=new Function(clear+block+';return {pawVisitorDepart,pawVisitorReturn,pawVisitorVisible,pawVisitorPauseTimers,pawVisitorDoorClear}')();
let n=0;function ck(v){assert.ok(v);n++}
for(let avatar=0;avatar<4;avatar++)for(let cycle=0;cycle<20;cycle++){
 const t=100+cycle*100,a={id:'visitor-'+avatar,avatar,x:50,y:100,phase:'departing',walking:1,motionSpeed:20,route:[[50,100]],elapsed:40,identitySettled:true};
 api.pawVisitorDepart(a,t);
 ck(!api.pawVisitorVisible(a));ck(a.wait===t+12+avatar*4);ck(a.walking===0&&a.motionSpeed===0&&a.route.length===0);
 ck(!api.pawVisitorReturn(a,a.wait-.01));
 api.pawVisitorPauseTimers([a],30);
 ck(!api.pawVisitorReturn(a,a.wait-1));
 ck(api.pawVisitorReturn(a,a.wait));ck(a.phase==='waiting'&&!api.pawVisitorVisible(a));
 ck(a.id==='visitor-'+avatar&&a.x===50&&a.y===100&&a.identitySettled);
 ck(!api.pawVisitorReturn(a,a.wait+1));
 ck(!api.pawVisitorDoorClear([50,100],{x:50,y:100},[],40));
 ck(api.pawVisitorDoorClear([50,100],{x:150,y:100},[],40));
}
for(const prop of ['guest','visitingResident']){const a={phase:'gone',wait:10,[prop]:{id:'named'}};ck(!api.pawVisitorReturn(a,20))}
ck(source.includes("if(!route){pawVisitorDepart(a,t);continue}"));
ck(source.includes("if(a.phase==='departing'){pawVisitorDepart(a,t);continue}"));
ck(source.includes("if(!a.identitySettled||!clearDoor())"));
ck(source.includes("a.x=door[0];a.y=door[1]"));
console.log('PASS '+n+' recurrent visitor lifecycle and doorway assertions');
