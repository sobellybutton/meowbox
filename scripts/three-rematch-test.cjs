'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/release-fixes.js'),'utf8');
const a=source.indexOf('/* PAW_THREE_REMATCH_BEGIN */'),b=source.indexOf('/* PAW_THREE_REMATCH_END */');
assert.ok(a>=0&&b>a);
const api=new Function(source.slice(a,b)+';return {pawThreeTurnCurrent,pawThreeThinkClock,pawThreeRematchStarter}')();
for(const opponent of ['cat','auntie']){
 for(const [prev,want] of [[null,1],[{opponent,result:null},1],[{opponent,result:{who:1},pawStarter:1},2],[{opponent,result:{who:'draw'},pawStarter:2},1],[{opponent:opponent==='cat'?'auntie':'cat',result:{who:2}},1]])assert.equal(api.pawThreeRematchStarter(prev,opponent),want)
}
let g={thinking:true,thinkAt:.55,result:null};
for(const [now,blocked,left] of [[0,false,.55],[.04,false,.51],[10,true,.51],[20,false,.51],[20.04,false,.47],[30,false,.42]]){
 assert.ok(api.pawThreeThinkClock(g,now,blocked));assert.ok(Math.abs(g.thinkAt-now-left)<1e-7)
}
for(const thinking of [true,false])for(const result of [null,{}])for(const blocked of [true,false]){
 const x={thinking,result};assert.equal(api.pawThreeTurnCurrent(x,x,blocked),!thinking&&!result&&!blocked);assert.equal(api.pawThreeTurnCurrent(x,{...x},blocked),false)
}
g.thinking=false;assert.equal(api.pawThreeThinkClock(g,31,false),false);assert.equal(g.pawThinkClock,undefined);
console.log('Board rematch and active thinking clock passed.');
