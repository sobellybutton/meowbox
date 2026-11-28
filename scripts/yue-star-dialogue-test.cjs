'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const block=source.match(/\/\* PAW_YUE_STAR_DIALOGUE_BEGIN \*\/([\s\S]*?)\/\* PAW_YUE_STAR_DIALOGUE_END \*\//)[1];
const run=new Function('assert',`
let room='destiny',activity=null,talkOpen=false,pawYueChartObserver=null,choices=[],words='',visits=0,lang=0;
const pane={style:{display:'block'},dataset:{pawYueDesk:'true',pawYueExpanded:'true'}};
const signNotebook=Array.from({length:12},(_,i)=>({name:['Sign '+i,'星座'+i],dates:'date'+i,theme:['theme'+i,'主题'+i]}));
function tr(a,b){return lang?b:a}function $(id){return pane}function closeTalk(){talkOpen=false}
function say(n,w,c){talkOpen=true;words=w;choices=c}function hint(){}function yueReadingHub(){visits++}
function signReading(i){return {sign:signNotebook[i],line:['line'+i,'牌意'+i]}}
`+block+`
let n=0;function ck(v,m){assert(v,m);n++}
ck(pawYueStarGroups.flat().sort((a,b)=>a-b).join(',')===Array.from({length:12},(_,i)=>i).join(','),'complete signs');
ck(pawYueStarGroup(-1)===null,'invalid group');
for(lang=0;lang<2;lang++)for(let g=0;g<4;g++)for(let k=0;k<3;k++){
 room='destiny';activity=null;pane.style.display='block';
 ck(pawYueStarDialogue(),'opens');
 ck(pane.style.display==='none'&&choices.length===5,'no overlay');
 const old=choices[g][1];old();ck(choices.length===4,'three signs plus return');
 const cb=choices[k][1],i=pawYueStarGroup(g)[k];old();ck(choices[k][1]===cb,'stale group ignored');
 cb();ck(words.includes(lang?'牌意'+i:'line'+i),'exact supplied reading');
 ck(choices.length===3,'continuation options');
 const replay=choices[0][1],done=choices[2][1];done();ck(!talkOpen,'natural finish');replay();ck(!talkOpen,'stale replay ignored');
}
lang=1;ck(pawYueStarDialogue(5)&&words.includes('牌意5'),'direct selected route');
choices[0][1]();ck(choices.length===5,'read another sign');
choices[4][1]();ck(visits===1,'return to host hub');
room='tea';ck(!pawYueStarDialogue(),'room guard');
room='destiny';activity='other';ck(!pawYueStarDialogue(),'activity guard');
return n
`);
new Function(source);
console.log('PASS '+run(assert)+' Yue star dialogue checks');
