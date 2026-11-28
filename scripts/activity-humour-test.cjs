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

const cafeHumour=section(ex,'/* PAW_GAMEPLAY_CAFE_HUMOUR_BEGIN */','/* PAW_GAMEPLAY_CAFE_HUMOUR_END */');
const furnitureHumour=section(ex,'/* PAW_GAMEPLAY_FURNITURE_HUMOUR_BEGIN */','/* PAW_GAMEPLAY_FURNITURE_HUMOUR_END */');
const cafeHandler=section(ex,'function cafeChoose(i){','function cafeRoom(){');
const interaction=new Function(`
let cafePhase='question',cafeRound=0,cafeAnswers=[],cafeQuestions=Array(8).fill(null),cafePick=-1,cafeAt=0,t=10,cafeToken=1,cafeResult=null,activity='match',scene='wonder',pending=[],hints=[],awards=[],saved=[];
const cafeKinds=[['Quiet','静'],['Adventure','探索'],['Listener','倾听']];
const setTimeout=f=>pending.push(f),sound=()=>{},hint=(...v)=>hints.push(v),save=(...v)=>saved.push(v),addItem=(...v)=>awards.push(v);
${cafeHumour}
${cafeHandler}
${furnitureHumour}
return {choose:cafeChoose,flush:()=>pending.shift()?.(),leave:()=>{cafeToken++},state:()=>({phase:cafePhase,round:cafeRound,answers:cafeAnswers.slice(),hints:hints.slice(),awards:awards.slice(),saved:saved.slice(),result:cafeResult}),furniture:pawFurnitureActionWords,cafe:pawCafeChoiceWords}
`)();
interaction.choose(1);interaction.choose(2);assert.ok(interaction.state().hints.length===0);interaction.flush();
assert.ok(interaction.state().answers.join(',')==='1');pair(interaction.state().hints[0]);
for(const answer of [0,2,1,1,0,2,1]){interaction.choose(answer);interaction.flush()}
const cafeEnd=interaction.state();assert.ok(cafeEnd.phase==='result'&&cafeEnd.round===8&&cafeEnd.hints.length===8);
assert.ok(cafeEnd.result.index===1&&cafeEnd.result.ties.join(',')==='1'&&cafeEnd.awards.length===1&&cafeEnd.saved.length===1);
cafeEnd.hints.forEach(pair);assert.ok(cafeEnd.hints[7][1].includes('成绩单'));interaction.choose(0);interaction.flush();assert.ok(interaction.state().hints.length===8);
for(let i=0;i<8;i++)pair(interaction.cafe(i,false));assert.ok(interaction.cafe(-1,false)===null);
for(const category of ['extension','finish','floor','storage'])pair(interaction.furniture('purchase','',category));
const placed=['bed','plant','lamp','shelf'].map(id=>interaction.furniture('place',id));placed.forEach(pair);assert.ok(new Set(placed.map(v=>v[0])).size===4);
for(const kind of ['save','putAway'])pair(interaction.furniture(kind));assert.ok(interaction.furniture('unknown')===null);
assert.ok(ex.includes("if(buyFurniture(id)){toast(tr(...pawFurnitureActionWords('purchase',id,v[4])))"));
assert.ok(ex.includes("saveHideout();render();toast(tr(...pawFurnitureActionWords('place',id)))"));
assert.ok(ex.includes("if(wasEditing)toast(tr(...pawFurnitureActionWords('save')))"));
assert.ok(ex.includes("wonderScenePhase==='result'&&wonderSceneResult"));
console.log('Café accepted-answer and score preservation, decorating feedback, and discovery completion wiring passed.');

const shell=read('src/shell.html');
for(const id of ['hint','toast']){
 assert.ok(shell.includes('id="'+id+'" role="status" aria-live="polite" aria-atomic="true"'));
}
const feedbackStyle=section(shell,'/* PAW_GAMEPLAY_FEEDBACK_BEGIN */','/* PAW_GAMEPLAY_FEEDBACK_END */');
assert.ok(feedbackStyle.includes('orientation:landscape'));
assert.ok(feedbackStyle.includes('body:not(.meow-dialogue)'));
assert.ok(feedbackStyle.includes(':not(.pawRailJourneyActive)'));
assert.ok(!feedbackStyle.includes(':not(.meowHintBlocked)'));
const yueHumour=section(st,'/* PAW_YUE_DESK_HUMOUR_BEGIN */','/* PAW_YUE_DESK_HUMOUR_END */');
const yueQuestions=new Function(yueHumour+'return pawYueDeskQuestions')();
assert.ok(yueQuestions('year').length===2&&yueQuestions('chart').length===3);
for(const kind of ['year','chart'])yueQuestions(kind).forEach(pair);
assert.ok(yueQuestions('chart')[2][0].includes('time zone'));
assert.ok(yueQuestions('chart')[1][0].includes('local birth time'));
assert.ok(yueQuestions('unknown').length===0);
assert.ok(st.includes("const questions=pawYueDeskQuestions(kind);if(questions.length!==steps.length)return;"));
assert.ok(st.includes("pawCafeChoiceWords(cafeRound-1,false)"));
assert.ok(st.includes("!cafeQuestionSheet.querySelector('.pawCafeReaction')"));
assert.ok(st.includes("pawCafeChoiceWords(cafeQuestions.length-1,true)"));
console.log('Guided consultation copy, short landscape guards, accessible status markup and inline café reaction wiring passed.');
