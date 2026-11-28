'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const h=src.split('/* PAW_TAROT_SNAPSHOT_BEGIN */')[1]?.split('/* PAW_TAROT_SNAPSHOT_END */')[0];
assert.ok(h);
const {snapshot,key}=new Function(h+';return {snapshot:tarotShareSnapshot,key:pawTarotNumberAction}')();
const cards=Array.from({length:5},(_,i)=>({i,rev:i%2===0}));
assert.equal(snapshot({cards,tone:'playful',topic:2},78).tone,'playful');
assert.equal(snapshot({cards,tone:'bad',topic:99},78).topic,-1);
assert.equal(snapshot({cards:[cards[0],cards[0],cards[1]]},78),null);
assert.equal(snapshot({cards:[{i:78,rev:false}]},78),null);
assert.equal(snapshot(null,78),null);
for(const size of [1,3,5])for(let i=0;i<5;i++){
 const q={readStage:'cards',readCards:cards.slice(0,size),readFlip:Array(size).fill(-1)};
 assert.equal(key(q,String(i+1),1)?.action,i<size?'reveal':undefined);
 q.readFlip.fill(0);assert.equal(key(q,String(i+1),.3),null);
 assert.equal(key(q,String(i+1),1)?.action,i<size?size===5?'five-detail':'focus':undefined);
}
console.log('Tarot snapshot and keyboard regression PASS');

const liveBlock=src.split('/* PAW_LIVE_TAROT_READING_BEGIN */')[1]?.split('/* PAW_LIVE_TAROT_READING_END */')[0];
assert.ok(liveBlock);
const route=new Function(h+liveBlock+';return pawTarotReadingRoute')();
for(const size of [1,3,5])for(const kind of ['tarot','love']){
 const entry={cards:cards.slice(0,size),tone:'playful',topic:2};
 const q={readCards:entry.cards,readStage:'cards',readFlip:Array(size).fill(10),tarotTone:'playful',readTopic:2};
 assert.equal(route(entry,q,kind,'tarot',78,11,false),'live');
 assert.equal(route(entry,q,kind,'tarot',78,10.3,false),'wait');
 assert.equal(route(entry,q,kind,'tarot',78,11,true),'archive');
 assert.equal(route(entry,q,kind,'park',78,11,false),'ignore');
 assert.equal(route(entry,{...q,readStage:'deck'},kind,'tarot',78,11,false),'wait');
 assert.equal(route(entry,{...q,readFlip:Array(size).fill(-1)},kind,'tarot',78,11,false),'wait');
 assert.equal(route({...entry,topic:1},q,kind,'tarot',78,11,false),'wait');
 assert.equal(route(entry,null,null,null,78,11,true),'archive');
 assert.equal(route(null,q,kind,'tarot',78,11,true),'ignore');
 assert.equal(route(entry,q,kind,'tarot',78,NaN,false),'wait');
}
console.log('Live Tarot and archive route isolation PASS');

// Execute the exact live dialogue wrapper against a small mocked room.
// Keep separate records for close, spread return, finish and share callbacks.
const wrapper=src.slice(src.indexOf('const pawLiveTarotSessions='),src.indexOf('// Keep the established painting in the live consultation'));
const roomRuntime=new Function(h+liveBlock+wrapper+`
let room='tarot',activity='love',t=12,talkOpen=false,state=null,choices=[],words='',backCalls=0,saves=0,archiveCalls=0,returnCalls=0,shares=[],hints=[];
const tarotDeck=Array.from({length:78},(_,i)=>['Card '+i,'牌'+i]),readingPositions=[['Now','现在'],['Notice','留意'],['Next','下一步']],fiveReadingPositions=Array.from({length:5},()=>['Position','位置']);
const page={style:{display:'none'}},$=id=>id==='back'?{click(){backCalls++;activity=null;state={}}}:page;
const tr=(a,b)=>a,orient=r=>r?'Reversed':'Upright',arcanaReading=()=> 'Meaning',topicReflection=()=> 'Reflection',fiveReadingPrompt=()=> 'Reflection',tarotCommentary=()=>null,readingConnection=()=> 'Combined',journalAutoSave=()=>true,pawReadingNextHint=()=>['Continue','继续'],hint=(...a)=>hints.push(a),closeTalk=()=>{talkOpen=false},say=(name,w,c)=>{words=w;choices=c;talkOpen=true};
const readingReturnSpread=()=>{state.readStage='cards';returnCalls++},readingSave=()=>{saves++;state.readSaved=true},fiveReadingSave=readingSave,shareReadingResult=(entry,back)=>shares.push(back);
function openTarotReading(){archiveCalls++}
return {reset(n=3){room='tarot';activity=n===1?'tarot':'love';state={readStage:'cards',readCards:Array.from({length:n},(_,i)=>({i,rev:!!(i%2)})),readFlip:Array(n).fill(10),readSaved:false};choices=[];talkOpen=false},open(){openTarotReading(tarotShareSnapshot(state,78))},get choices(){return choices},get words(){return words},get state(){return state},get activity(){return activity},get shares(){return shares},get stats(){return {backCalls,saves,returnCalls,archiveCalls}},get talkOpen(){return talkOpen},close(){closeTalk()},focus(){state.readStage='focus'},archive(){openTarotReading({cards:[{i:1,rev:false}]},()=>{})}}
`)();
let transitions=0;
const ck=(v,m)=>{assert.ok(v,m);transitions++};
const click=(label)=>{const fn=roomRuntime.choices.find(x=>x[0]===label)?.[1];ck(typeof fn==='function','action '+label);fn();return fn};
for(const n of [1,3,5]){
 roomRuntime.reset(n);roomRuntime.open();ck(roomRuntime.words.includes('Card 0'),'first actual card');
 for(let i=0;i<n-1;i++){const old=click('Next card');const words=roomRuntime.words;old();ck(roomRuntime.words===words,'stale next callback ignored')}
 click(n===1?'A moment to reflect':'What does it mean together?');
 const prior=roomRuntime.stats;
 roomRuntime.focus();click('Review the spread');ck(roomRuntime.stats.returnCalls===prior.returnCalls+1&&roomRuntime.activity!==null,'review remains in activity');
 roomRuntime.open();for(let i=0;i<n-1;i++)click('Next card');click(n===1?'A moment to reflect':'What does it mean together?');
 const oldFinish=roomRuntime.choices.find(x=>x[0].startsWith('Finish reading'))[1];
 click('Make a keepsake');oldFinish();ck(roomRuntime.activity!==null,'stale finish cannot exit share preview');
 const back=roomRuntime.shares.at(-1);back();ck(roomRuntime.choices.some(x=>x[0]==='Review the spread'),'share returns exact summary');
 const finish=click('Finish reading · return to table');ck(roomRuntime.activity===null&&roomRuntime.stats.backCalls===prior.backCalls+1&&roomRuntime.stats.saves===prior.saves+1,'save once and return to room');
 finish();back();ck(roomRuntime.stats.backCalls===prior.backCalls+1&&!roomRuntime.talkOpen,'stale callbacks cannot reopen finished reading');
}
roomRuntime.reset();roomRuntime.open();const old=roomRuntime.choices[0][1];roomRuntime.open();const words=roomRuntime.words;old();ck(roomRuntime.words===words,'previous consultation session invalidated');
roomRuntime.archive();ck(roomRuntime.stats.archiveCalls===1,'archive route unchanged');
console.log('Live Tarot completion, replay and stale callbacks PASS ('+transitions+' checks)');
