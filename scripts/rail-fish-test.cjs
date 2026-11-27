const fs=require('node:fs'),path=require('node:path');
function block(file,name){const s=fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),a=s.indexOf('/* '+name+'_BEGIN'),b=s.indexOf('/* '+name+'_END */');if(a<0||b<a)throw Error('Missing '+name);return s.slice(a,b)}
console.log(new Function(block('extensions.js','MBRAIL_REFINEMENT')+block('startup.js','MBFISH_REFINEMENT')+"\nconst assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nassert(mbRailStops('fortune','wonder',['fortune','home']).map(v=>v.id).join(',')==='fortune,home,island,wonder','route order');\nassert(mbRailStops('fortune','wonder',['fortune','home']).filter(v=>v.destination)[0].id==='wonder','target distinct');\nassert(mbRailCanArrive('fortune','wonder',null,false,false)&&!mbRailCanArrive('fortune','wonder',null,true,false)&&!mbRailCanArrive('fortune','wonder',null,false,true),'arrival guard');\nassert(!mbRailCanArrive('fortune','fortune',null,false,false)&&mbRailCanArrive('fortune','fortune','tea',false,false),'same stop');\nassert(['fortune','home','island','wonder'].every(k=>mbRailCaption(k).length===4)&&!mbRailCaption('unknown'),'bilingual route copy');\nassert([0,.119,.12,2,2.001,3.1].map(mbFishTiming).join(',')==='early,early,ready,ready,late,expired','scoop timing');\nconst game={at:1,last:2,resultAt:0};assert(mbFishPauseGame(game,3)&&game.at===4&&game.last===5&&game.resultAt===0,'pause active scoop');\nassert(!mbFishPauseGame(game,-1)&&game.last===5,'invalid pause');\nreturn 'PASS: eight rail and goldfish interaction checks';\n")());

const pawStartup=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const pawExtensions=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
function pawSlice(s,a,b){const i=s.indexOf(a),j=s.indexOf(b,i+1);if(i<0||j<=i)throw Error('Missing '+a);return s.slice(i,j)}
const pawWindowMath=pawSlice(pawStartup,'const pawRailWindows=','/* PAW_WINDOW_MOTION_END */');
const pawStairData=pawSlice(pawStartup,'const pawStairPath=','valleyNpcPath.splice');
const pawStairMath=pawSlice(pawStartup,'const pawPlayerStairs=','/* PAW_STAIR_ROUTING_END */');
const pawGroundMath=pawSlice(pawStartup,'function pawDistrictFoot(','/* PAW_DISTRICT_GROUND_END */');
const pawOtherSpines=pawSlice(pawExtensions,'const paintedResidentPaths=','function paintedResidentY');
const pawGroundChecks=new Function([pawWindowMath,pawStairData,pawStairMath,pawGroundMath,pawOtherSpines,"\nlet n=0;function ck(x,m){if(!x)throw Error(m);n++}\nfor(const [layout,cfg] of Object.entries(pawRailWindows)){\n for(const pane of cfg.panes){\n  const q=pane.q;ck(q.every(p=>p[0]>=0&&p[0]<cfg.width&&p[1]>=0&&p[1]<cfg.height),'glass inside artwork '+layout);\n  for(const u of [0,.2,.5,.85,1])for(const v of [0,.3,.65,1]){\n   const [x,y]=pawRailQuad(q,u,v),uv=pawRailUV(q,x,y);ck(uv&&Math.abs(uv[0]-u)<.0001&&Math.abs(uv[1]-v)<.0001,'window projection '+layout)\n  }\n }\n}\nfor(const x of [-10.2,-2,-1,0,.7,1,2.3,8.6])ck(pawRailReflect(x)>=0&&pawRailReflect(x)<=1,'reflection bounded');\nck(Math.abs(pawRailReflect(.9999)-pawRailReflect(1.0001))<.001,'no seam at turn');\nconst spines={fortune:pawPlayerStairs,...paintedResidentPaths};\nfor(const [world,points] of Object.entries(spines)){\n const start=pawDistrictFoot(points,-200,99999),end=pawDistrictFoot(points,3000,-400);\n ck(start.y===points.at(-1)[0]&&end.y===points[0][0],'world vertical bounds '+world);\n for(const [from,to] of [[start,end],[end,start]]){\n  const path=pawDistrictRoute(points,from,to);let prev=from;\n  for(const p of path){for(let i=0;i<=16;i++){const f=i/16,x=prev.x+(p.x-prev.x)*f,y=prev.y+(p.y-prev.y)*f,q=pawDistrictFoot(points,x,y);ck(Math.hypot(x-q.x,y-q.y)<.0001,'door route contained '+world)}prev=p}\n  let actor={...from,velocity:0},walked=0;\n  for(let i=0;i<2200;i++){const next=pawDistrictAdvance(points,actor,to,.05,330,actor.velocity);const q=pawDistrictFoot(points,next.x,next.y);ck(Math.hypot(q.x-next.x,q.y-next.y)<.0001,'free feet bounded '+world);walked+=Math.hypot(actor.x-next.x,actor.y-next.y);actor=next;if(!next.walking)break}\n  ck(Math.hypot(actor.x-to.x,actor.y-to.y)<2&&walked>100,'complete full path '+world);\n }\n}\nck(pawDistrictFacing('up',.01,0)==='up','zero-motion facing');\nck(pawDistrictFacing('down',2,2)==='down','diagonal facing stable');\nck(pawDistrictFacing('down',20,-1)==='right','clear turn');\nreturn n;\n"].join('\n'))();
console.log('PASS '+pawGroundChecks+' painted-window and four-district ground assertions');

const pawPreviewChecks=new Function(pawWindowMath+"let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};\nfor(const mode of ['entrance','preview','ride','transfer'])for(let i=0;i<=2000;i++){\n const v=pawRailTravel(i*.01,mode);\n ck(v.a>=0&&v.a<=.13&&v.mix>=0&&v.mix<=1,'travel bounds');\n for(const speed of [1,.74,.62,.35])for(const x of [0,.5,1])ck(.15+.70*x-v.a*speed>=0&&.15+.70*x-v.a*speed<=1,'sample stays inside glass')\n}\nck(pawRailTravel(3.6,'ride').a===pawRailTravel(30,'ride').a,'stop drawing once ride crop reaches limit');\nck(pawRailTravel(4,'preview').a!==pawRailTravel(5,'preview').a,'preview stays moving');\nck(pawRailTravel(8.9999,'preview').mix>.999,'blend reset');\nck(pawRailTravel(9,'preview').a===0,'loop restart');\nreturn n;")();
console.log('PASS '+pawPreviewChecks+' rail motion bounds and preview continuity checks');

const pawRouteValidation=pawSlice(pawStartup,'function pawRailRouteRecord(','const pawRailRouteImages');
const pawLayerMath=pawSlice(pawStartup,'function pawRailLayerCrop(','/* PAW_WINDOW_MOTION_END */');
console.log(new Function(pawRouteValidation+pawLayerMath+`let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const id of ['fortune','home','island','wonder']){
 const layer=k=>({path:'assets/visual/painted/journey/routes/'+id+'/'+k+'.webp',width:2400,height:800,sha256:'a'.repeat(64)});
 const far=layer('far'),near=layer('near');
 ck(!!pawRailRouteRecord({far,near},id),'valid layers');
 ck(!pawRailRouteRecord({far},id),'reject missing foreground');
 ck(!pawRailRouteRecord({far,near:{...near,width:2200}},id),'reject mismatched dimensions');
 ck(!pawRailRouteRecord({far,near:{...near,path:'assets/art/map.webp'}},id),'reject unrelated map');
 for(const aspect of [2/3,16/9,1])for(let i=0;i<=100;i++){
  const t=i/100,a=pawRailLayerCrop(2400,800,t,.32,aspect),b=pawRailLayerCrop(2400,800,t,1,aspect);
  ck(a.x<=b.x&&b.x+b.width<=2400&&a.x>=0,'parallax bounded');
  ck(Math.abs(a.width/a.height-aspect)<.00001,'undistorted scenery');
 }
}
return 'PASS '+n+' independent route artwork and parallax assertions';`)());

const fishSource=pawSlice(pawStartup,'const festivalFishKinds=','function festivalFinish(');
const scoopMath=pawSlice(pawStartup,'function pawScoopProject(','function pawResidentTempo(');
const fishTiming=pawSlice(pawStartup,'function mbFishTiming(','function mbFishPauseGame(');
console.log(new Function(fishSource+scoopMath+fishTiming+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(let i=0;i<5;i++)for(let t=0;t<60;t+=.1){const p=festivalFishPosition(i,t,0);ck(pawScoopInside(p.x,p.y),'fish inside reach')}
const g=festivalNewRound(0,0);g.phase='dip';g.last=1;
const p=festivalFishPosition(0,1.01,g.seed);g.x=p.x;g.y=p.y;
ck(festivalFishOutcome(g,1.01).caught===-1,'no premature catch');
ck(festivalFishOutcome(g,1.01).wear===4,'light early wear');
ck(festivalFishOutcome(g,0)===null,'negative time');
ck([0,.119,.12,2,2.001,3.1].map(mbFishTiming).join(',')==='early,early,ready,ready,late,expired','matching timing');
for(const age of [.12,.5,1.35,2,2.001,3.1]){
 const p=festivalFishPosition(0,1+age,g.seed);g.x=p.x;g.y=p.y;
 ck((festivalFishOutcome(g,1+age).caught>=0)===(age>=.12&&age<=2),'actual catch window');
}
return 'PASS '+n+' goldfish position and timing checks';`)());

const routeProgressSource=pawSlice(pawStartup,'function pawRailRideProgress(','function pawMountRouteGlass(');
console.log(new Function(routeProgressSource+`
let count=0;
const check=(condition,message)=>{if(!condition)throw Error(message);count++};
for(const duration of [.65,3.6,8,30]){
 let prev=-1;
 for(let i=0;i<=3000;i++){
  const progress=pawRailRideProgress(i*.01,duration);
  check(progress>=prev&&progress>=0&&progress<1,'one-way bounded motion');
  if(i>0&&i<=Math.ceil(duration*100))check(progress>prev,'moving throughout the normal ride');
  prev=progress;
 }
}
check(pawRailRideProgress(NaN)===0&&pawRailRideProgress(-1)===0,'invalid time');
check(pawRailRideProgress(4)>pawRailRideProgress(3.6),'continues past normal arrival during decoding');
check(pawRailRideProgress(16)>pawRailRideProgress(8),'no turnaround on extended ride');
return 'PASS '+count+' directional ride timing assertions';
`)());

require('./arcade-input-test.cjs');
