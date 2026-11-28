'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const ex=read('src/extensions.js'),st=read('src/startup.js');
new Function(ex);new Function(st);
function section(s,a,b){const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,a);return s.slice(i,j)}
const tea=section(ex,'const pearlPrompts=','function pearlPreviousStage');
const teaStage=section(ex,'function pearlStage(stage)','function pearlPick(');
const garden=section(ex,'function gardenChime()','function gardenKoi(');
const tarot=section(ex,'function readingReveal(i)','function readingSave()');
const release=section(ex,'const riverEchoReplies=','const riverBottleReplies=')+section(ex,'const riverBottleReplies=','\n};')+'\n};';
const rail=section(ex,'function mbRailCaption(k)','/* MBRAIL_REFINEMENT_END */');
const api=new Function(`
let activity='bubbleTea',state={},t=10,muted=true,ambientBus=false,events=[];
const hint=(...v)=>events.push(v),sound=()=>{},addItem=()=>{};
${tea}
${teaStage}
${garden}
${tarot}
${release}
${rail}
return {tea:stage=>{events=[];pearlStage(stage);return [state.teaStage,...events]},garden:()=>{activity='secretGarden';state={gardenChimeAt:-100,gardenFeedAt:-100,gardenFeedCount:0,gardenSeatAt:-100};events=[];gardenChime();gardenFeed();gardenSeat();return events},tarot:()=>{activity='tarot';state={readStage:'cards',readCards:[{},{}],readFlip:[-1,-1]};events=[];readingReveal(0);readingReveal(0);readingReveal(1);return {events,flips:state.readFlip}},echo:riverEchoReplies,bottle:riverBottleReplies,rail:mbRailCaption}
`)();
const pair=v=>assert.ok(Array.isArray(v)&&v.length===2&&v.every(s=>typeof s==='string'&&s.trim())&&/[^\x00-\x7F]/.test(v[1]));
for(const k of ['order','base','sugar','ice','topping','pourReady','pearls','mix','seal','ready']){const [stage,...events]=api.tea(k);assert.ok(stage===k);assert.ok(events.length===1);pair(events[0])}
const gardenEvents=api.garden();assert.ok(gardenEvents.length===3);gardenEvents.forEach(pair);
assert.ok(gardenEvents[0][0].includes('notification'));assert.ok(gardenEvents[1][0].includes('Attendance'));assert.ok(gardenEvents[2][0].includes('timesheet'));
const reading=api.tarot();assert.ok(reading.events.length===2);assert.ok(reading.flips.every(v=>v===10));reading.events.forEach(pair);assert.ok(reading.events[1][0].includes('Tap one'));
for(const v of [...api.echo,...Object.values(api.bottle).flat()]){pair(v);assert.ok(!/Auntie:|Ah Ma:|阿姨：|阿嬷：/.test(v.join(' ')))}
for(const k of ['fortune','home','island','wonder']){const c=api.rail(k);assert.ok(c.length===4);pair(c.slice(2))}
assert.ok(st.includes("if(changed&&q.phase==='done'){hint(...(pan?"));
assert.ok(st.includes('青菜吃完啦！'));
assert.ok(st.includes('心愿不用发邮件催进度'));
console.log('Activity humour: actual tea stage, garden, card reveal, private river and rail helpers passed; no browser approval.');
