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
