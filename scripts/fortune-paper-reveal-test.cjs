'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const get=name=>s.split('/* PAW_'+name+'_BEGIN */')[1].split('/* PAW_'+name+'_END */')[0];
const api=new Function(get('SLIP_COUNTER')+get('PAINTED_SLIP_SKIN')+';return {pawSlipPose,pawSlipRevealLayers,pawSlipSkinBox}')();
const g={counter:{x:200,y:300},reading:{x:400,y:450},tie:{x:500,y:350},bag:{x:400,y:550}};
let n=0,prior=0;
for(let i=0;i<=1000;i++){
 const p=api.pawSlipPose('opening',.75*i/1000,g),l=api.pawSlipRevealLayers(p);
 assert(l.unfolded>=prior&&Math.abs(l.unfolded+l.folded-1)<1e-9&&l.words<=l.unfolded+1e-9&&l.foldedPose.w<=145&&l.foldedPose.h<=105);
 for(const [w,h,fold] of [[336,194,true],[317,473,false]]){
  const box=api.pawSlipSkinBox(fold?l.foldedPose:p,w,h,fold);
  assert(Math.abs(box.w/box.h-w/h)<1e-9);n++;
 }
 prior=l.unfolded;n++;
}
assert.equal(api.pawSlipRevealLayers(api.pawSlipPose('folded',0,g)).folded,1);
assert.equal(api.pawSlipRevealLayers(api.pawSlipPose('open',0,g)).words,1);
console.log('PASS '+n+' original fortune paper reveal and aspect checks');
