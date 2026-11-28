'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),a=require('../src/rail-foreground.js');
for(const p of [a.carriage.path,...Object.values(a.sprites).map(s=>s.path),...Object.values(a.far)])assert.ok(fs.existsSync(path.resolve(__dirname,'..',p)));
for(const route of Object.keys(a.far)){
 let seen=new Set();
 for(let t=0;t<9;t+=.05){
  for(const p of a.frame(route,t,900,280)){
   seen.add(p.id);assert.ok(p.x<=900&&p.x+p.width>=0);assert.ok(p.y>=0&&p.y+p.height<=280);
   assert.ok(Math.abs(p.width/p.height-a.sprites[p.id].width/a.sprites[p.id].height)<1e-9);
  }
  assert.deepEqual(a.frame(route,t,900,280,true),a.frame(route,0,900,280,true))
 }
 assert.ok(seen.size>=2)
}
assert.equal(a.frame('bogus',0,900,280).length,0);
assert.equal(a.fit(0,600),null);
assert.deepEqual(a.cover(1000,500,500,500,1),{x:500,y:0,w:500,h:500});
const calls=[],transforms=[],lights=[],rects=[],positions=[];let depth=0,drawn=0;
const ctx={save(){depth++},restore(){depth--},translate(...v){positions.push(v)},transform(...v){transforms.push(v)},beginPath(){},rect(...v){rects.push(v)},clip(){},drawImage(im,...args){calls.push(im.id);drawn++},createLinearGradient(){return{addColorStop(){}}},fillRect(...v){lights.push({v,drawn})}};
const asset=id=>({id,naturalWidth:900,naturalHeight:500});
const assets={carriage:asset('carriage'),far:asset('far'),flowers:asset('flowers'),fence:asset('fence'),lantern:asset('lantern')};
assert.ok(a.draw(ctx,assets,'fortune',1,1000,600));assert.equal(calls[0],'far');assert.equal(calls.at(-1),'carriage');
assert.equal(a.draw(ctx,{},'fortune',0,1000,600),false);
console.log('Railway foreground, motion, clipping contract and path checks passed.');

let atmosphereChecks=0;const ck=v=>{assert.ok(v);atmosphereChecks++};
for(const route of Object.keys(a.far)){
 const still=a.atmosphere(route,0,true);
 for(let i=0;i<=900;i++){const q=a.atmosphere(route,i/100),r=a.atmosphere(route,i/100,true);
  ck(Math.abs(q.breeze)<=.027001&&q.light>=.025&&q.light<=.063001&&q.shade>=.012&&q.shade<=.037001);
  ck(JSON.stringify(r)===JSON.stringify(still)&&r.breeze===0)}
}
ck(a.atmosphere('bogus',0)===null);ck(a.atmosphere('fortune',NaN)===null);
ck(lights.length===1&&lights[0].drawn===1);ck(depth===0);
for(const v of transforms)ck(v[0]===1&&v[1]===0&&Math.abs(v[2])<=.027001&&v[3]===1&&v[4]===0&&v[5]===0);
calls.length=0;transforms.length=0;lights.length=0;drawn=0;
ck(a.draw(ctx,assets,'fortune',4,1000,600,true));ck(transforms.length===0);ck(depth===0);ck(calls.at(-1)==='carriage');
console.log('PASS '+atmosphereChecks+' railway atmosphere assertions; rendered visual acceptance pending.');

let portraitChecks=0;const pc=v=>{assert.ok(v);portraitChecks++};
pc(fs.existsSync(path.resolve(__dirname,'..',a.portrait.path)));
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1024,1536],[1920,1080]]){
 const box=a.fit(w,h,'portrait'),win=a.windowBox(box,'portrait');
 pc(box.x>=-1e-8&&box.y>=-1e-8&&box.x+box.width<=w+1e-8&&box.y+box.height<=h+1e-8);
 pc(Math.abs(box.width/box.height-2/3)<1e-9);
 pc(win.x<=119/1024*box.width&&win.y<=322/1536*box.height);
 pc(win.x+win.w>=906/1024*box.width&&win.y+win.h>=831/1536*box.height);
 for(const route of Object.keys(a.far))for(const reduced of [true,false]){
  calls.length=0;rects.length=0;positions.length=0;drawn=0;lights.length=0;transforms.length=0;
  const portrait={id:'portrait',naturalWidth:1024,naturalHeight:1536};
  pc(a.draw(ctx,{...assets,portrait},route,4,w,h,reduced,'portrait'));
  pc(calls[0]==='far'&&calls.at(-1)==='portrait'&&depth===0);
  pc(rects.length===2&&JSON.stringify(rects[1])===JSON.stringify([0,0,win.w,win.h]));
  pc(JSON.stringify(positions[1])===JSON.stringify([win.x,win.y]));
  pc(!reduced||transforms.length===0);
 }
}
pc(a.draw(ctx,assets,'fortune',1,390,844,false,'portrait')===false);
pc(a.draw(ctx,{...assets,portrait:asset('wrong')},'fortune',1,390,844,false,'portrait')===false);
pc(a.fit(390,844,'unknown')===null);
console.log('PASS '+portraitChecks+' portrait railway checks; runtime mounting and rendered acceptance remain pending.');

let kineticsChecks=0;
const kc=(v,msg)=>{assert.ok(v,msg);kineticsChecks++};
kc(a.travelDistance(0)===0,'stationary departure');
kc(a.travelDistance(.65)===.325,'smooth departure ramp');
kc(Math.abs(a.travelDistance(1.65)-1.325)<1e-9,'cruising distance');
for(const [w,h] of [[90,900],[240,500],[320,200],[390,258],[787,509],[900,280],[1920,700]])for(const route of Object.keys(a.far)){
 let prev=new Map(),seen=new Set();
 for(let i=0;i<=1800;i++){
  const t=i/100,now=new Map(a.frame(route,t,w,h).map(p=>[p.id,p]));
  for(const [id,p] of now){
   seen.add(id);kc(p.x<=w&&p.x+p.width>=0,'visible bounds');
   if(prev.has(id))kc(Math.abs(p.x-prev.get(id).x)<=w*.57*.01+1e-7,'no visible teleport');
   else if(i>0)kc(p.x>=w-w*.57*.01-1e-7,'enter from right');
  }
  for(const [id,p] of prev)if(!now.has(id))kc(p.x+p.width<=w*.57*.01+1e-7,'exit completely on left');
  kc(JSON.stringify(a.frame(route,t,w,h,true))===JSON.stringify(a.frame(route,0,w,h,true)),'reduced motion');
  prev=now;
 }
 kc(seen.size>=2,'route variety');
}
console.log('PASS '+kineticsChecks+' railway kinetics assertions; actual device rendering remains pending.');

let brakingChecks=0;
const bc=(v,msg)=>{assert.ok(v,msg);brakingChecks++};
for(const d of [.1,.65,1,2,3.6,6,9,30]){
 let prev=0;const dt=d/1000;
 for(let i=0;i<=1000;i++){
  const dist=a.travelDistance(i*dt,d);
  bc(dist>=prev-1e-10,'monotonic distance');bc(dist-prev<=dt+1e-10,'velocity cap');prev=dist;
 }
 const end=a.travelDistance(d,d),eps=d/10000;
 bc(end>0&&end<d,'bounded travel');
 bc(a.travelDistance(d+5,d)===end,'stationary at arrival');
 bc((end-a.travelDistance(d-eps,d))/eps<.001,'zero arrival velocity');
 bc(a.travelDistance(eps,d)/eps<.001,'zero departure velocity');
}
for(const d of [1,3.6,6])for(const route of Object.keys(a.far))for(const [w,h] of [[390,260],[900,280],[90,900]]){
 const end=a.frame(route,d,w,h,false,d);
 bc(JSON.stringify(end)===JSON.stringify(a.frame(route,d+2,w,h,false,d)),'no trackside drift after arrival');
 for(let i=0;i<100;i++)bc(JSON.stringify(a.frame(route,i*.05,w,h,true,d))===JSON.stringify(a.frame(route,0,w,h,true,d)),'reduced motion stable');
}
console.log('PASS '+brakingChecks+' railway braking assertions; finite ride integration and visual acceptance separate.');

let alphaChecks=0;
const ac=(v,msg)=>{assert.ok(v,msg);alphaChecks++};
for(const [w,h] of [[320,568],[390,844],[430,932],[720,1080],[1440,900],[1920,1080]])for(const layout of ['portrait','landscape']){
 const box=a.fit(w,h,layout),win=a.windowBox(box,layout),asset=layout==='portrait'?a.portrait:a.carriage;
 // Measured in decoded deployed WebP: portrait alpha < 255 and
 // landscape visible glass alpha < 240 (exclusive right/bottom).
 const measured=layout==='portrait'?[114,319,911,836]:[0,0,1672,551];
 ac(win.x<=measured[0]/asset.width*box.width+1e-8,'left alpha coverage');
 ac(win.y<=measured[1]/asset.height*box.height+1e-8,'top alpha coverage');
 ac(win.x+win.w>=measured[2]/asset.width*box.width-1e-8,'right alpha coverage');
 ac(win.y+win.h>=measured[3]/asset.height*box.height-1e-8,'bottom alpha coverage');
 ac(win.x>=0&&win.y>=0&&win.x+win.w<=box.width+1e-8&&win.y+win.h<=box.height+1e-8,'underpaint confined to frame');
}
console.log('PASS '+alphaChecks+' measured alpha coverage assertions.');

{
 const runtime=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
 const begin=runtime.indexOf('const pawPaintedRailClocks=new WeakMap();'),finish=runtime.indexOf('const pawPaintedRailMotionBefore',begin);
 assert.ok(begin>=0&&finish>begin);
 const exact=runtime.slice(begin,finish);
 let runtimeChecks=0,seq=0,calls=[],rafJobs=new Map(),jobs=new Map();
 const rc=(v,msg)=>{assert.ok(v,msg);runtimeChecks++};
 const renderer={portrait:{width:1024,height:1536},carriage:{width:1672,height:941},far:{fortune:'x',home:'x'},draw(...args){calls.push(args);return true}};
 const loaded={api:renderer,assets:{carriage:{}}},image={},reduce={matches:false};
 const doc={hidden:false,createElement(){return {dataset:{},setAttribute(){},getContext(){return {clearRect(){}}},remove(){this.removed=true}}}};
 const mount=new Function('pawPaintedRailLoaded','pawPaintedRailPortrait','document','matchMedia','requestAnimationFrame','cancelAnimationFrame','pawRailMotionJobs',exact+';return pawMountPaintedRailComposite;')(loaded,image,doc,()=>reduce,cb=>{rafJobs.set(++seq,cb);return seq},id=>rafJobs.delete(id),jobs);
 const tick=t=>{const entries=[...rafJobs.entries()];rc(entries.length===1,'one animation loop');rafJobs.delete(entries[0][0]);entries[0][1](t)};
 for(const mode of ['ride','entrance']){
  const host={dataset:{to:'home',rideSeconds:'3.6'}},picture={style:{}},style=new Map(),stage={isConnected:true,dataset:{layout:'portrait'},style:{getPropertyValue:k=>style.get(k)||'',setProperty:(k,v)=>style.set(k,v)},querySelector:()=>picture,append(c){this.canvas=c}};
  reduce.matches=false;calls=[];
  rc(mount(stage,'portrait',host,mode,{far:{}}),'mount');tick(100);tick(150);tick(200);
  const before=Number(stage.canvas.dataset.travel);rc(before>.09,'travel advanced');
  jobs.get(stage).stop();stage.dataset.layout='landscape';
  rc(mount(stage,'landscape',host,mode,{far:{}}),'rotated mount');
  rc(Number(stage.canvas.dataset.travel)===before,'rotation retained travel');
  rc(calls.at(-1)[8]===(mode==='ride'?3.6:undefined),'duration');
  tick(250);tick(300);const motionBefore=Number(stage.canvas.dataset.travel);
  reduce.matches=true;tick(350);
  rc(calls.at(-1)[6]===true&&stage.dataset.railMotion==='still','live reduced motion');
  rc(Number(stage.canvas.dataset.travel)===motionBefore,'no progress while switching');
  const frames=Number(stage.canvas.dataset.frame);tick(400);tick(450);
  rc(Number(stage.canvas.dataset.frame)===frames,'still frame stays');
  reduce.matches=false;tick(500);
  rc(calls.at(-1)[6]===false&&stage.dataset.railMotion==='painted-route-parallax','resume motion');
  tick(550);rc(Number(stage.canvas.dataset.travel)>motionBefore,'resume time');
  host.dataset.sceneryPaused='true';const paused=Number(stage.canvas.dataset.travel);tick(600);
  rc(Number(stage.canvas.dataset.travel)===paused,'pause held');
  reduce.matches=true;tick(650);rc(stage.dataset.railMotion==='still','accessibility update while paused');
  jobs.get(stage).stop();rc(stage.canvas.removed&&picture.style.visibility===''&&rafJobs.size===0,'cleanup');
 }
 console.log('PASS '+runtimeChecks+' exact runtime rotation/accessibility mock assertions.');
}
