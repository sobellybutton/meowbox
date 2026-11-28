'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/release-fixes.js'),'utf8');
const start=source.indexOf('/* PAW_DISCOVERY_ACTIVE_TURN_BEGIN */'),end=source.indexOf('/* PAW_DISCOVERY_ACTIVE_TURN_END */');
assert.ok(start>=0&&end>start);
const api=new Function(source.slice(start,end)+';return {pawCafeTurnElapsed,pawCafeTurnMatches};')();
for(const elapsed of [0,100,349,350])for(const dt of [-20,0,16,50,100,8000])for(const blocked of [false,true])assert.equal(api.pawCafeTurnElapsed(elapsed,100,100+dt,blocked),blocked?elapsed:elapsed+Math.min(50,Math.max(0,dt)));
const base={run:{},token:1,round:1,room:'match',activity:'match',scene:'wonder',phase:'turn'};
for(const delta of [{},{run:{}},{token:2},{round:2},{room:'story'},{activity:'story'},{scene:'fortune'},{phase:'question'}])assert.equal(api.pawCafeTurnMatches(base,{...base,...delta}),Object.keys(delta).length===0);
let elapsed=0,last=0;
for(const [now,blocked] of [[16,false],[32,false],[10000,true],[10016,true],[10032,false]]){elapsed=api.pawCafeTurnElapsed(elapsed,last,now,blocked);last=now}
assert.equal(elapsed,48,'background time cannot consume an active response');
assert.equal(api.pawCafeTurnElapsed(NaN,0,16,false),0);
assert.equal(api.pawCafeTurnElapsed(-1,0,16,false),0);
console.log('Café active response timing and stale interaction regression passed.');


const storyStart=source.indexOf('/* PAW_STORY_CHAPTER_TURN_BEGIN */'),storyEnd=source.indexOf('/* PAW_STORY_CHAPTER_TURN_END */');
assert.ok(storyStart>=0&&storyEnd>storyStart);
const story=new Function(source.slice(storyStart,storyEnd)+';return {pawStoryTurnMatches,pawStoryNextNode,pawStoryTurnReady};')();
const visit={run:{},token:1,node:'station',room:'story',activity:'story',scene:'wonder',turning:true};
for(const delta of [{},{run:{}},{token:2},{node:'other'},{room:'match'},{activity:'match'},{scene:'fortune'},{turning:false}])assert.equal(story.pawStoryTurnMatches(visit,{...visit,...delta}),Object.keys(delta).length===0);
for(const t of [0,419,420,1699,1700,10000])for(const ready of [true,false])for(const reduced of [true,false])for(const blocked of [true,false])assert.equal(story.pawStoryTurnReady(t,ready,reduced,blocked),!blocked&&(ready||t>=1700)&&(reduced||t>=420));
const scenes={station:{choices:[['a','甲','second'],['b','乙','end'],['c','丙','__proto__']]},second:{}},ends={end:[]};
for(const [i,want] of [[0,'second'],[1,'end'],[2,null],[-1,null],[3,null],[.5,null],['0',null]])assert.equal(story.pawStoryNextNode(scenes.station,i,scenes,ends),want);
console.log('Story chapter preparation, active turn and branch guards passed.');


const contextStart=source.indexOf('function pawStoryTurnContext()');
assert.ok(contextStart>storyEnd);
const simulate=new Function(source.slice(start,end)+source.slice(storyStart,storyEnd)+`
let state={},parallelToken=1,parallelNode='station',room='story',activity='story',scene='wonder',parallelTurning=false,parallelPick=-1,parallelAt=0,parallelTrail=[],parallelFound=[],t=0,clock=0,blocked=false,reduced=false;
const queue=[],items=[],saves=[],document={hidden:false},performance={now:()=>clock},requestAnimationFrame=fn=>queue.push(fn),matchMedia=()=>({matches:reduced}),pawArcadeInputBlocked=()=>blocked,sound=()=>{},actorGesture=()=>{},save=(...v)=>saves.push(v),addItem=(...v)=>items.push(v);
const parallelScenes={station:{choices:[['yes','好','end']]}},parallelEndings={end:['Ending','结局','','','endingArt']},pics={endingArt:{complete:false,naturalWidth:0}};
let parallelSelect;
`+source.slice(contextStart,source.indexOf('/* PAW_MAPPED_DISCOVERY_PLATE_BEGIN */',contextStart))+`
return {select:parallelSelect,step(ms){clock+=ms;t=clock/1000;queue.shift()?.(clock)},block(v){blocked=v},decode(){pics.endingArt.complete=true;pics.endingArt.naturalWidth=800},cancel(){parallelToken++},reduce(){reduced=true},view(){return {parallelNode,parallelTurning,trail:parallelTrail.slice(),items:items.slice(),saves:saves.slice(),queued:queue.length}}}
`)();
simulate.select(0);simulate.select(0);
for(let i=0;i<10;i++)simulate.step(16);
assert.equal(simulate.view().parallelNode,'station');assert.equal(simulate.view().trail.length,0);
simulate.block(true);simulate.step(10000);simulate.decode();simulate.step(16);
assert.equal(simulate.view().parallelNode,'station');assert.equal(simulate.view().items.length,0);
simulate.block(false);
for(let i=0;i<20;i++)simulate.step(16);
assert.equal(simulate.view().parallelNode,'end');assert.equal(simulate.view().trail.length,1);assert.equal(simulate.view().items.length,1);assert.equal(simulate.view().saves.length,1);
assert.equal(simulate.view().queued,0);
console.log('Exact runtime story transition mock passed (not browser playback).');

const plateStart=source.indexOf('/* PAW_MAPPED_DISCOVERY_PLATE_BEGIN */'),plateEnd=source.indexOf('/* PAW_MAPPED_DISCOVERY_PLATE_END */');
assert.ok(plateStart>contextStart&&plateEnd>plateStart);
const plate=new Function(source.slice(plateStart,plateEnd)+';return {pawDiscoveryPlateKind,pawDiscoveryPlateFrame};')();
for(const district of ['wonder','fortune'])for(const id of ['quiz','story','match','tarot'])for(const act of ['wonderScene','match','story',null])for(const visit of [id,'other'])for(const ready of [true,false]){
 const want=district==='wonder'&&visit===id&&ready?(['quiz','story','match'].includes(id)&&act==='wonderScene'?'wonder':id==='match'&&act==='match'?'cafe':id==='story'&&act==='story'?'story':null):null;
 assert.equal(plate.pawDiscoveryPlateKind(district,id,act,visit,ready),want)
}
for(const [w,h] of [[320,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]){
 const base={s:1.2,ox:-100,oy:-150},foot=[400,620],q=plate.pawDiscoveryPlateFrame(base,foot,w,h);
 assert.equal(q.s,base.s);
 assert.ok(w>=900&&w/h>=1.25?Math.abs(q.ox+foot[0]*q.s-w*.34)<1e-7:q.oy+foot[1]*q.s<=h*.47+1e-7)
}
console.log('Mapped discovery plate selection and six viewport anchor checks passed.');

const letterStart=source.indexOf('/* PAW_STORY_LETTER_ART_BEGIN */'),letterEnd=source.indexOf('/* PAW_STORY_LETTER_ART_END */');
assert.ok(letterStart>plateEnd&&letterEnd>letterStart);
const letter=new Function(source.slice(letterStart,letterEnd)+';return {pawStoryLetterArt,pawStoryLetterCurrent};')();
const chapters={station:{art:'stationArt'},town:{art:'townArt'}},ending={end:['Title','标题','Summary','简介','endingArt']};
for(const [id,want] of [['station','stationArt'],['town','townArt'],['end','endingArt'],['__proto__',null],['missing',null]])assert.equal(letter.pawStoryLetterArt(id,chapters,ending),want);
for(const delta of [{},{run:{}},{token:2},{node:'town'},{room:'match'},{activity:'match'},{scene:'fortune'}])assert.equal(letter.pawStoryLetterCurrent(visit,{...visit,...delta}),Object.keys(delta).length===0);
console.log('Story letter artwork identity and visit guards passed.');
