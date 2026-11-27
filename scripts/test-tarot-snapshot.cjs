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
