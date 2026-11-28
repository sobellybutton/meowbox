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
 // Fallback must retain the shake/ready carton centre, size and identity.
 const fallbackCalls=[],fallbackCtx={globalAlpha:1,save(){fallbackCalls.push(['save']);this.saved=this.globalAlpha},restore(){fallbackCalls.push(['restore']);this.globalAlpha=this.saved}};
 const fallbackRender=new Function('ctx','boxArt','poseEase',block[1]+';return pawBlindFallbackReveal;')(fallbackCtx,(...v)=>fallbackCalls.push(['box',...v]),x=>x);
 let lastY=Infinity;
 for(let i=0;i<=100;i++){
  fallbackCalls.length=0;
  fallbackRender({boxPick:2},{figure:i/100,lid:i/100},(...v)=>fallbackCalls.push(['figure',...v]));
  const carton=fallbackCalls.at(-1);
  ck(carton[0]==='box'&&carton[1]===400&&carton[2]===515&&carton[3]===1.15&&carton[4]===2,'unchanged carton anchor, size and identity');
  if(i>0){const figure=fallbackCalls[1];ck(figure[0]==='figure'&&figure[1]===400&&figure[2]<=lastY,'figure rises from same carton behind its wall');lastY=figure[2];ck(fallbackCtx.globalAlpha===1,'canvas alpha restored')}
 }
 ck(source.includes('if(!painted)pawBlindFallbackReveal(state,reveal'),'fallback connected to active stage');
 ck(!source.includes('boxArt(332,515,.82'),'retired sideways jump removed');
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

 // Network or decode failures must not permanently disable uploaded art.
 async function checkPaintedPairRetry(){
  const requests=[];
  class FakeImage{
   set src(path){this.path=path;requests.push(this)}
   decode(){return Promise.resolve()}
  }
  const prepare=new Function('PawBlindReveal','Image',block[1]+';return pawBlindPreparePair;')(api,FakeImage);
  const first={},second={},third={};
  const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve()};
  const a=prepare(first);
  ck(requests.length===2&&prepare(first)===a,'initial pair requested only once');
  requests[0].onerror();await flush();
  ck(a.failed&&prepare(first)===a&&requests.length===2,'no repeated failed requests during a visit');
  ck(prepare(second,false)===a&&requests.length===2,'no retry after leaving shelf');
  const b=prepare(second,true);
  ck(b!==a&&requests.length===4,'next shelf visit retries');
  for(const im of requests.slice(2)){im.naturalWidth=896;im.naturalHeight=671;im.onload()}
  await flush();
  ck(b.decoded&&!b.failed,'matching retry decoded');
  ck(prepare(third)===b&&requests.length===4,'reuse successful pair on later visits');
  console.log('PASS '+n+' total assertions including painted asset retry.');
 }
 checkPaintedPairRetry().catch(e=>{console.error(e);process.exitCode=1});
