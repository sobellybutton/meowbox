'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const src=fs.readFileSync('src/startup.js','utf8');
const api=new Function(src.split('/* PAW_YUE_SHARE_RETURN_BEGIN */')[1].split('/* PAW_YUE_SHARE_RETURN_END */')[0]+';return {pawYueShareReturnMatches,pawYueShareScroll}')();
const origin={scene:'fortune',room:'destiny',activity:null,subject:'self',profile:{},chart:{},visit:{},page:'destiny'};
let n=0;
for(let mask=0;mask<256;mask++){
 const c={...origin,page:'meowShare'},changes={scene:'wonder',room:'tarot',activity:'love',subject:'other',profile:{},chart:{},visit:{},page:'room'};
 Object.keys(changes).forEach((k,i)=>{if(mask&(1<<i))c[k]=changes[k]});
 assert.equal(api.pawYueShareReturnMatches(origin,c),mask===0);n++;
}
for(const x of [-100,0,10,500,10000,NaN])for(const h of [0,300,1500,NaN])for(const c of [0,640,NaN]){
 const v=api.pawYueShareScroll(x,h,c);assert(Number.isFinite(v)&&v>=0&&(!Number.isFinite(h)||!Number.isFinite(c)||v<=Math.max(0,h-c)));n++;
}
assert(src.includes('pawYueShareFromChart(data,topic,section)')&&src.includes('pawYueShareFromChart(data,null,section)'));
console.log('PASS '+n+' share return ownership and scroll cases');
