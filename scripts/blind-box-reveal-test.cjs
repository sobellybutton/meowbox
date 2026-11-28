'use strict';
const assert=require('node:assert/strict'),api=require('../src/blind-box-reveal.js');
let n=0;const ck=(v,m)=>{assert.ok(v,m);n++};
for(const scale of [.6,.82,1,1.15,1.25,2]){let prev=null;for(let i=0;i<=120;i++){
 const p=api.placement(400,515,scale,i/100);
 ck(Math.abs(p.box.y+p.box.h-515)<1e-8,'box bottom stays grounded');
 ck(p.rise>=0&&p.rise<=1,'bounded rise');
 ck(!prev||p.figure.y<=prev.figure.y+1e-8,'no downward jumps');
 prev=p;
}}
const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')},drawImage(im,...v){calls.push([im.id,...v])}};
const asset=id=>({id,naturalWidth:896,naturalHeight:671}),images={open:asset('open'),front:asset('front')};
const prize=(...v)=>calls.push(['prize',...v]);
ck(!api.draw(ctx,images,400,515,1.15,.1,prize),'closed box remains until open pair needed');
ck(api.draw(ctx,images,400,515,1.15,.7,prize),'painted reveal');
ck(calls[1][0]==='open'&&calls[2][0]==='prize'&&calls[3][0]==='front','correct occlusion order');
ck(JSON.stringify(calls[1].slice(1))===JSON.stringify(calls[3].slice(1)),'identical mask registration');
ck(calls[0]==='save'&&calls[4]==='restore','canvas state balanced');
ck(!api.draw(ctx,{open:images.open},400,515,1.15,1,prize),'missing pair falls back');
ck(!api.draw(ctx,{...images,front:{naturalWidth:100,naturalHeight:100}},400,515,1.15,1,prize),'wrong artwork dimensions fall back');
ck(api.pose(0,true).done&&api.pose(0,true).rise===1,'reduced motion complete');
ck(api.placement(400,515,-1,0)===null,'invalid geometry');
console.log('PASS '+n+' blind-box placement, reveal and layer assertions.');

 const fs=require('node:fs'),path=require('node:path');
 const source=fs.readFileSync(path.resolve(__dirname,'../src/arcade-painted-runtime.js'),'utf8');
 const block=source.match(/\/\* PAW_BLIND_PAINTED_RUNTIME_BEGIN \*\/([\s\S]*?)\/\* PAW_BLIND_PAINTED_RUNTIME_END \*\//);
 assert.ok(block);
 const drawn=[],boxCalls=[];
 const scene=new Function('PawBlindReveal','ctx','boxArt','poseEase','pawBoxReveal',block[1]+';return pawBlindPaintedReveal;')(api,ctx,(...args)=>boxCalls.push(args),x=>x,age=>({lid:age/.95}));
 const pair={decoded:true,failed:false,images},late={decoded:false,failed:false,images};
 const locked={boxPick:1};
 ck(scene(locked,'opening',.05,pair,false,(...a)=>drawn.push(a)),'opening remains at counter');
 ck(boxCalls[0][0]===400&&boxCalls[0][1]===515,'closed carton at same counter anchor');
 ck(scene(locked,'opening',.7,late,false,(...a)=>drawn.push(a)),'decoded pair remains selected');
 ck(scene(locked,'result',0,late,false,(...a)=>drawn.push(a)),'result retains same carton');
 ck(drawn.length===2,'figure rises then remains visible');
 const fallback={};
 ck(!scene(fallback,'opening',.1,late,false,()=>{}),'pending pair uses original renderer');
 ck(!scene(fallback,'result',0,pair,false,()=>{}),'late art cannot replace fallback');
 ck(scene({},'opening',0,pair,true,()=>{}),'reduced motion immediately reveals');
 ck(!scene({},'choose',0,pair,false,()=>{}),'shelf untouched');
 ck(source.includes('painted=v&&pawBlindPaintedReveal(state,stage,age,paintedPair'),'live draw call');
 ck(source.includes("stage==='opening'&&reveal.done&&!pawArcadeInputBlocked()"),'existing reward gate retained');
 for(const p of ['index.html','scripts/build.cjs']){
  const assembly=fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
  ck(assembly.includes('blind-box-reveal')&&assembly.includes('arcade-painted-runtime'),'assembly '+p);
 }
 console.log('PASS '+n+' total blind-box render, runtime lock and assembly assertions.');
