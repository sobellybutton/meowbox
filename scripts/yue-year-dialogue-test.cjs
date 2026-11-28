'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_YUE_YEAR_DIALOGUE_BEGIN \*\/([\s\S]*?)\/\* PAW_YUE_YEAR_DIALOGUE_END \*\//)[1];
const run=new Function('assert',`
let room='destiny',activity=null,talkOpen=false,pawYueChartObserver=null,choices=[],words='',hub=0,restart=0,lang=0;
const pane={style:{display:'block'},dataset:{pawYueDesk:'true',pawYueExpanded:'true'}};
function tr(a,b){return lang?b:a}function $(id){return pane}function closeTalk(){talkOpen=false}
function say(n,w,c){talkOpen=true;words=w;choices=c}function hint(){}function yueReadingHub(){hub++}function yueZodiacAlmanac(){restart++}
`+block+`
let n=0;function ck(v,m){assert(v,m);n++}
const node=textContent=>({textContent});
const make=(noteCount=2,topicCount=4)=>({querySelector:key=>node({'.yueReadingFront h2':'Animal title','.yueReadingYear':'Year',':scope > strong':'Relation','.yueReadingRoast':'Roast',':scope > small':'Privacy and folklore'}[key]),querySelectorAll:key=>key.includes('article')?Array.from({length:topicCount},(_,i)=>({querySelector:k=>node((k==='h3'?'Topic ':'Detail ')+i)})):Array.from({length:noteCount},(_,i)=>node('Note '+i))});
ck(!pawYueYearSnapshot(null),'empty');ck(!pawYueYearSnapshot(make(0)),'incomplete notes');ck(!pawYueYearSnapshot(make(1,3)),'incomplete topics');
for(lang=0;lang<2;lang++)for(const count of [1,2,5]){
 const result=pawYueYearSnapshot(make(count));ck(result.notes.length===count&&result.topics.length===4,'snapshot');
 ck(!Object.hasOwn(result,'date')&&!Object.hasOwn(result,'birth'),'no birth input');
 pane.style.display='block';ck(pawYueYearDialogue(result),'open');ck(pane.style.display==='none'&&words.includes('Relation')&&words.includes('Roast'),'overview');
 const old=choices[0][1];old();ck(words==='Note 0','first note');
 for(let i=1;i<count;i++){choices[0][1]();ck(words==='Note '+i,'exact note')}
 choices[0][1]();ck(choices.length===5,'topic menu');
 const next=choices[2][1];old();ck(choices[2][1]===next,'stale callback');
 for(let i=0;i<4;i++){choices[i][1]();ck(words.includes('Detail '+i),'exact topic');choices[0][1]()}
 choices[4][1]();ck(words.includes('Privacy and folklore')&&choices.length===3,'disclaimer');
 const done=choices[2][1],again=choices[0][1];done();ck(!talkOpen,'finish');again();ck(!talkOpen,'stale restart');
 ck(pawYueYearDialogue(result),'reopen');choices[2][1]();choices[0][1]();ck(restart>0,'another reading');
 ck(pawYueYearDialogue(result),'reopen hub');choices[2][1]();choices[1][1]();ck(hub>0,'host hub');
}
room='tea';ck(!pawYueYearDialogue(pawYueYearSnapshot(make())),'wrong room');
return n
`);
new Function(source);
console.log('PASS '+run(assert)+' Yue year dialogue checks');
