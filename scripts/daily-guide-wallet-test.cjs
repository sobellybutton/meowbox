const fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
function section(a,b){const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<i)throw Error('Missing test section');return s.slice(i,j)}
const checks=section('/* MBDAILY_GUIDE_BEGIN','/* MBDAILY_GUIDE_END */')+section('/* MBWALLET_TOTALS_BEGIN','/* MBWALLET_TOTALS_END */');
const run=new Function(checks+`
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const maps={fortune:{st:[['temple']]},home:{st:[['park'],['fish']]},island:{st:[['arcade'],['kitchen']]}};
let scene='fortune',transitioning=false,activity=null,room=null,proposal={hidden:true},communityTab='',events=[],page={style:{display:'block'}};
const hint=()=>events.push('hint'),townChatPage=()=>events.push('chat'),travellerFollowRoute=v=>events.push(v),$=()=>page;
assert(journalDailyRoute('play',scene,maps).door==='arcade','arcade route');
assert(journalDailyRoute('food',scene,maps).door==='kitchen','food route');
assert(journalDailyRoute('ritual',scene,maps).district==='fortune','ritual route');
assert(journalDailyRoute('care',scene,maps).door==='park'&&journalDailyRoute('release',scene,maps).door==='fish','park and pier');
assert(journalDailyRoute('social',scene,maps)===null&&journalDailyRoute('toString',scene,maps)===null&&journalDailyRoute('play',scene,{})===null,'unknown and missing route');
journalDailyGuide('play');assert(events.pop().district==='island'&&page.style.display==='block','rail route delegated without direct travel');
activity='prayer';journalDailyGuide('food');assert(events.pop()==='hint'&&page.style.display==='block','active ritual not interrupted');activity=null;
journalDailyGuide('gratitude');assert(communityTab==='celebrate'&&events.pop()==='chat','gratitude page');
journalDailyGuide('social');assert(page.style.display==='none'&&events.pop()==='hint','local resident hint');
const v={discoveries:100,checkin:20,activities:30,blind:40,furniture:50,themes:10},t=pawWalletTotals(v);
assert(t.earned===150&&t.spent===100&&t.balance===50,'receipt arithmetic');
assert(pawWalletTotals({...v,furniture:1000}).balance===0,'legacy nonnegative balance');
return 'PASS: eleven daily guide and wallet checks';
`);console.log(run());
