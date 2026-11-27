const fs=require('node:fs'),path=require('node:path');const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');const a=s.indexOf('/* PAW_ROOM_LIFE_AND_SCOOP_BEGIN */'),b=s.indexOf('/* PAW_ROOM_LIFE_AND_SCOOP_END */');if(a<0||b<a)throw Error('Missing helpers');console.log('PASS '+new Function(s.slice(a,b)+"let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};ck(pawScoopInside(400,458),'centre');ck(!pawScoopInside(550,458),'outside');ck(!pawScoopInside(NaN,458),'invalid');ck(pawScoopProject(NaN,0)===null,'invalid projection');ck(pawScoopProject(400,458).x===400,'centre fixed');for(const [x,y] of [[700,700],[0,0],[400,800],[200,458]]){const p=pawScoopProject(x,y);ck(pawScoopInside(p.x,p.y),'project within water')}ck(pawTypedCount('你好呀',0)===1,'Chinese type');ck(pawTypedCount('hello',1000)===5,'finish');ck(pawTypedCount('hello',0,true)===5,'reduced');ck(pawTypedCount('',0)===0,'empty');ck(pawWalkStep({x:0,y:0},[3,0],.08).arrived,'arrival');ck(pawWalkStep({x:0,y:0},[100,0],.08).x<5,'bounded step');ck(pawWalkStep({x:0,y:0},[100,0],-1).x===0,'negative time');for(const [p,d] of [[[10,0],'right'],[[-10,0],'left'],[[0,-10],'up'],[[0,10],'down']])ck(pawWalkFacing({x:0,y:0},p)===d,'direction');return n;")()+' room life and scoop checks');

const guest=s.match(/function pawGuestCount\([\s\S]*?\n\}/)?.[0];
if(!guest)throw Error('Missing guest rotation helper');
console.log(new Function(guest+`let n=0;for(const room of ['temple','tarot','destiny','wishes','tea','park','fish','kitchen','arcade','boba','mystery','quiz','story','match']){
 for(const max of [1,2]){
  const counts=Array.from({length:12},(_,i)=>pawGuestCount(max,i,room));
  if(counts.some(v=>v<0||v>max)||!counts.includes(0)||!counts.includes(1)||(max===2&&!counts.includes(2)))throw Error('Guest roster '+room);
  n++;
 }
}return 'PASS '+n+' guest variety and occupancy cases';`)());

const candidate=s.match(/function pawGuestRoomCandidates[^\n]+/)?.[0];
if(!candidate)throw Error('Missing indoor guest candidate helper');
console.log(new Function(candidate+`const p=[{id:'a',world:'fortune'},{id:'b',world:'fortune'},{id:'c',world:'home'},{id:'d',world:'fortune'}];
const select=(active,world,valid)=>pawGuestRoomCandidates(p,active,world,valid).map(g=>g.id).join(',');
if(select(['a'],'fortune',g=>g.id!=='d')!=='b')throw Error('Exclude outdoor identities and unavailable art');
if(select(['a','b','d'],'fortune',()=>true)!=='')throw Error('Do not duplicate outdoor guests');
if(select([],'home',()=>true)!=='c')throw Error('Respect district');
if(select([],'fortune',()=>false)!=='')throw Error('Missing artwork must not produce a named guest');
return 'PASS four indoor cameo selection cases';`)());

const clearance=s.slice(s.indexOf('function pawGuestClear'),s.indexOf('function pawGuestCount'));
console.log(new Function(clearance+`let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};const anchors=[[0,0],[100,100]];
ck(!pawGuestClear(0,0,anchors),'anchor');
ck(pawGuestClear(52,0,anchors),'boundary');
ck(!pawGuestClear(NaN,0,anchors),'invalid');
ck(!pawGuestSegment([-100,0],[100,0],anchors),'crossing');
ck(pawGuestSegment([-100,-60],[100,-60],anchors),'clear segment');
ck(!pawGuestSegment([0,0],[0,0],anchors),'zero unsafe');
ck(pawGuestSegment([60,0],[60,0],anchors),'zero safe');
ck(pawGuestWaypoints([[0,0],[60,0],[200,0]],anchors,(x)=>x<100).length===1,'combined filtering');
return 'PASS '+n+' guest clearance checks';`)());

const guestArt=s.slice(s.indexOf('function pawGuestArt('),s.indexOf('function pawRoomGuestProfile('));
const gait=s.match(/function pawGaitPhase[^\n]+/)[0];
console.log(new Function(guestArt+gait+`let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};const g={name:['Guest','来客']},im={complete:true,naturalWidth:80,naturalHeight:120},record={id:'guest'};
ck(pawGuestArt(g,()=>null,()=>{throw Error('unexpected request')})===null,'absent art makes no request');
ck(pawGuestArt(g,()=>record,()=>({complete:false}))===null,'wait for decode');
ck(pawGuestArt(g,()=>record,()=>({complete:true,naturalWidth:0,naturalHeight:120}))===null,'failed art');
ck(pawGuestArt(g,()=>record,()=>im)===im,'valid identity art');
ck(pawGuestArt(null,()=>{throw Error('bad lookup')},()=>im)===null,'invalid profile');
ck(pawGaitPhase(0,1)===0,'no movement no phase');
ck(pawGaitPhase(NaN,1)===0,'invalid distance');
ck(pawGaitPhase(52,1)===Math.PI,'walk cadence');
ck(pawGaitPhase(104,2)===Math.PI,'scale-aware stride');
ck(pawGaitPhase(-10,1)===0,'negative distance');
return 'PASS '+n+' art availability and gait checks';`)());
if(/\bguestAtlasIndex\b|\bdrawGuestAtlasActor\b/.test(s))throw Error('Removed atlas dependency returned');

const pawSelectA=s.indexOf('/* PAW_OWNER_TAROT_CHOICE_BEGIN */'),pawSelectB=s.indexOf('/* PAW_OWNER_TAROT_CHOICE_END */');if(pawSelectA<0||pawSelectB<=pawSelectA)throw Error('Missing choice helpers');console.log('PASS '+new Function(s.slice(pawSelectA,pawSelectB)+"let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};for(const length of [22,78]){const p=pawTarotPool(length,()=>.4);ck(p.length===12&&new Set(p.map(v=>v.i)).size===12,'unique cards');for(const size of [1,3,5]){let picks=[];for(let i=0;i<size;i++)picks=pawTarotPick(p,picks,i,size);ck(picks.length===size,'correct spread size');ck(pawTarotPick(p,picks,11,size)===null,'limit');ck(pawTarotPick(p,[0],0,size)===null,'no duplicate card')}}for(const portrait of [true,false]){const slots=pawTarotChoiceSlots(portrait);ck(slots.length===12,'12 visible slots');ck(slots.every(a=>slots.every(b=>a===b||Math.abs(a.x-b.x)>=(a.w+b.w)/2||Math.abs(a.y-b.y)>=(a.h+b.h)/2)),'no overlapping cards')}return n;")()+' tarot selection cases');

const pawParkA=s.indexOf('/* PAW_PARK_ARCADE_RELEASE_BEGIN */'),pawParkB=s.indexOf('/* PAW_PARK_ARCADE_RELEASE_END */');if(pawParkA<0||pawParkB<=pawParkA)throw Error('Missing park/arcade helpers');console.log('PASS '+new Function(s.slice(pawParkA,pawParkB)+"let n=0;const ck=(ok,m)=>{if(!ok)throw Error(m);n++};ck(pawMissingStations([['a'],['b']],new Set(['a']))[0][0]==='b','missing activity visible in guide');ck(pawMissingStations([['a']],new Set(['a'])).length===0,'no redundant guide');ck(pawHerdSlots().length===6,'six background deer');ck(pawHerdSlots().every(p=>p.length===3&&p.every(Number.isFinite)),'valid herd slots');ck(pawHerdTemperament('mugi').bow&&!pawHerdTemperament('koyo').bow,'different temperament');ck(pawFishTechnique(.7,10,1).ideal,'steady scoop');ck(!pawFishTechnique(.7,300,1).steady&&pawFishTechnique(.7,300,1).extraWear>0,'fast movement damages net');ck(!pawFishTechnique(.15,0,0).ideal&&!pawFishTechnique(2,0,0).ideal,'timing matters');ck(pawFishTechnique(1,0,4).bonus===20,'bounded streak');ck(pawResidentVisitPool([{id:'a'},{id:'b'},{id:'c'}],['a'],1).map(v=>v.id).join(',')==='c,b','rotate non-host art');return n")()+' park, label, visitor and fish checks');

console.log(new Function(clearance+`let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const limit of [0,1,2,3])for(const space of [30,68,100])for(const points of [[],[[0,0]],[[0,0],[20,0],[100,0]],[[0,0],[0,0],[80,0],[160,0]]]){
 const picked=pawGuestSpaced(points,limit,space);
 ck(picked.length<=limit,'visitor occupancy');
 ck(picked.every((p,i)=>picked.slice(0,i).every(q=>Math.hypot(p[0]-q[0],p[1]-q[1])>=space)),'visitors never spawn on each other');
 ck(picked.every(p=>points.includes(p)),'use authored waypoints')
}
return 'PASS '+n+' initial visitor separation checks';`)());

const gateStart=s.indexOf('function pawGateFit('),gateEnd=s.indexOf('const pawGateCompositionCSS',gateStart);
const lookStart=s.indexOf('/* PAW_PASSERBY_IDENTITY_BEGIN */'),lookEnd=s.indexOf('/* PAW_PASSERBY_IDENTITY_END */',lookStart);
const strengthStart=s.indexOf('function pawGaitStrength('),strengthEnd=s.indexOf('function pawPaintedGait(',strengthStart);
if([gateStart,gateEnd,lookStart,lookEnd,strengthStart,strengthEnd].some(v=>v<0))throw Error('Missing movement helpers');
console.log(new Function(s.slice(gateStart,gateEnd)+s.slice(lookStart,lookEnd)+s.slice(strengthStart,strengthEnd)+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const [w,h] of [[360,640],[390,844],[1440,900],[844,390],[768,1024],[280,450]]){
 const f=pawGateFit(w,h);
 ck(w<h?f.left<=1e-8&&f.top<=1e-8&&f.width>=w-1e-8&&f.height>=h-1e-8:f.left>=0&&f.top>=0&&f.width<=w+1e-8&&f.height<=h+1e-8,'fit gateway');
 for(let i=0;i<=100;i++){
  const p=pawGateGround(w,h,i/100);
  ck(p.x>=f.left&&p.x<=f.left+f.width&&p.y<=f.top+f.height&&p.y-p.height>=f.top,'grounded character inside artwork');
  if(i)ck(p.y<pawGateGround(w,h,(i-1)/100).y,'forward approach');
  const nx=(p.x-f.left)/f.width,ny=(p.y-f.top)/f.height,nh=p.height/f.height;
  ck(nx>=.495&&nx<=.501&&ny>=.699&&ny<=.866&&nh>=.082&&nh<=.103,'trace current gateway paving and perspective scale');
  if(i===0)ck(Math.abs(ny-.865)<1e-9&&Math.abs(nh-.102)<1e-9,'start at lower stone paving');
  if(i===100)ck(Math.abs(ny-.700)<1e-9&&Math.abs(nh-.083)<1e-9,'finish at calibrated threshold');
  if(i){const previous=pawGateGround(w,h,(i-1)/100);ck(p.height<previous.height,'perspective reduces silhouette size')}
 }
}
for(let player=0;player<4;player++){
 const a=pawAssignPasserbyLooks(['a','b','c'],player),b=pawAssignPasserbyLooks(['b','c','d'],player,a);
 ck(a.get('b')===b.get('b')&&a.get('c')===b.get('c'),'keep visible identities during guest rotation');
 ck(new Set(b.values()).size===3&&!Array.from(b.values()).includes(player),'unique appearances');
}
ck(pawGaitStrength(0,1)===0,'stationary');
ck(pawGaitStrength(25,1)===.5,'gradual stride');
ck(pawGaitStrength(500,1)===1,'cap stride');
return 'PASS '+n+' gate grounding, identity continuity and movement assertions';`)());

const curatedA=s.indexOf('/* PAW_CURATED_RUNTIME_BEGIN */'),curatedB=s.indexOf('/* PAW_CURATED_RUNTIME_END */');
if(curatedA<0||curatedB<=curatedA)throw Error('Missing guest schedule helpers');
const tempoTests=new Function(s.slice(a,b)+s.slice(curatedA,curatedB)+`
let n=0;const check=(v,m)=>{if(!v)throw Error(m);n++};
const speeds=new Set();
for(let i=0;i<150;i++){
 const id='character-'+i,v=pawResidentTempo(id);
 check(v.speed>=27&&v.speed<=40,'pace range');
 check(v.dwell>=1&&v.dwell<=1.52,'pause range');
 check(JSON.stringify(v)===JSON.stringify(pawResidentTempo(id)),'stable tempo');speeds.add(v.speed);
}
check(speeds.size>8,'varied pace');
for(let p=0;p<4;p++)for(let start=0;start<4;start++){
 const a=pawRoomVisitorLook([p],start),b=pawRoomVisitorLook([p,a],start);
 check(a!==p&&b!==p&&b!==a,'unique indoor looks');
}
check(pawRoomVisitorLook([0,1,2,3],0)===null,'no capacity');
const g=id=>({id});
for(const current of [['a','b'],['b','a']])for(const next of [['b','c'],['c','b'],['a','b'],['b','a'],['c','d']]){
 const v=pawGuestKeepSlots(current,next.map(g)).map(x=>x.id);
 check(new Set(v).size===2&&next.every(x=>v.includes(x)),'same membership');
 for(let i=0;i<2;i++)if(next.includes(current[i]))check(v[i]===current[i],'retained actor');
}
return n;`)();
console.log('PASS '+tempoTests+' resident pace, dwell, look and slot continuity checks');

const lifeA=s.indexOf('/* PAW_VISITOR_LIFECYCLE_BEGIN */'),lifeB=s.indexOf('/* PAW_VISITOR_LIFECYCLE_END */');
if(lifeA<0||lifeB<=lifeA)throw Error('Missing visitor lifecycle');
const lifeCount=new Function(clearance+s.slice(lifeA,lifeB)+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
const safe=(x,y)=>x>=0&&y>=0&&x<=800&&y<=800,path=(a,b)=>[b];
ck(!!pawVisitorDoorRoute([100,100],[200,200],[],safe,path),'direct');
ck(!pawVisitorDoorRoute([100,100],[200,200],[[150,150]],(x,y)=>x===y,path),'station blocks sole corridor');
ck(!pawVisitorDoorRoute([-1,100],[200,200],[],safe,path),'invalid start');
ck(!pawVisitorDoorRoute([100,100],[200,200],[],safe,()=>[[199,199]]),'wrong endpoint');
ck(!pawVisitorDoorRoute([100,100],[200,200],[],safe,()=>[[NaN,100]]),'invalid waypoint');
ck(!pawVisitorDoorRoute([100,100],[200,200],[],safe,()=>null),'no route');
ck(!pawVisitorDoorClear([100,100],{x:120,y:100},[]),'player at entrance');
ck(!pawVisitorDoorClear([100,100],{x:200,y:200},[{x:100,y:100,phase:'roaming'}]),'visitor at entrance');
ck(pawVisitorDoorClear([100,100],{x:200,y:200},[{x:100,y:100,phase:'waiting'}]),'hidden visitor not blocking');
for(const phase of ['waiting','gone','stationary','roaming','arriving','departing'])ck(pawVisitorVisible({phase})===!['waiting','gone'].includes(phase),'visibility');
const list=[{walking:1,phase:'arriving'}];ck(pawVisitorHold(list)===list&&list[0].walking===0,'preserve actor references');
for(let i=0;i<12;i++){
 const anchor=[300+i*4,300],from=[100,300],to=[600,300],route=pawVisitorDoorRoute(from,to,[anchor],safe,path);
 ck(route&&route.length>1,'station detour');
 ck(route.every((v,j)=>pawGuestSegment(j?route[j-1]:from,v,[anchor])),'entire detour clear');
 ck(route.at(-1).join()===to.join(),'exact destination');
}
ck(pawGuestStationFeet({stations:{a:[0,0,1,2],b:[0,0,3,4]}},['a','a','removed']).join()==='1,2','active station anchors only');
for(let i=0;i<30;i++){
 let calls=0;const path=(a,b)=>{calls++;return [b]},anchor=[300+i,300],from=[100,300],to=[600,300];
 const route=pawVisitorDoorRoute(from,to,[anchor],safe,path,52,()=>true);
 ck(route&&calls===1&&route.every((v,k)=>pawGuestSegment(k?route[k-1]:from,v,[anchor])),'bounded physical pathfinder');
}
return n;`)();
console.log('PASS '+lifeCount+' visitor doorway, route, visibility and pause checks');

const zwdsA=s.indexOf('/* PAW_ZWDS_SHARE_BEGIN */'),zwdsB=s.indexOf('/* PAW_ZWDS_SHARE_END */');
if(zwdsA<0||zwdsB<=zwdsA)throw Error('Missing ZWDS privacy helpers');
const zwdsChecks=new Function(s.slice(zwdsA,zwdsB)+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
const topics=Array.from({length:12},(_,k)=>({k,name:['Palace '+k,'宫'+k],question:['Question','问题'],practice:['Reflect','反思']}));
const themes=Object.fromEntries(Object.keys(pawZwdsStarNames).map(k=>[k,['Theme','主题']]));
for(let life=0;life<12;life++)for(let k=0;k<12;k++){
 const keys=Object.keys(pawZwdsStarNames),stars=Array.from({length:12},(_,i)=>[['PRIVATE_BIRTH',keys[i]],['PRIVATE_TIME','PRIVATE_PLACE']]);
 const raw=pawZwdsTopicSnapshot({life,stars,date:'PRIVATE_DATE',time:'PRIVATE_TIME'},k,topics);
 const data=pawZwdsPublic({...raw,title:['PRIVATE','PRIVATE'],lines:[['PRIVATE','PRIVATE']],name:'PRIVATE'},topics,themes);
 ck(data.lines[0][1]===keys[(life-k+12)%12],'actual palace');
 ck(!JSON.stringify(data).includes('PRIVATE'),'private data excluded');
 ck(data.title[0]==='Palace '+k,'actual topic');
}
ck(pawZwdsTopicSnapshot(null,0,topics)===null,'missing chart');
ck(pawZwdsPublic({topicId:99},topics,themes)===null,'unknown topic');
ck(pawZwdsPublic({topicId:0,starKeys:['fake']},topics,themes).lines[0][0]==='No main star in this palace','empty palace');
return n;`)();
console.log('PASS '+zwdsChecks+' ZWDS selected palace and privacy checks');

const bubbleA=s.indexOf('/* PAW_BUBBLE_INPUT_BEGIN */'),bubbleB=s.indexOf('/* PAW_BUBBLE_INPUT_END */');
if(bubbleA<0||bubbleB<=bubbleA)throw Error('Missing bubble input helpers');
const bubbleChecks=new Function(s.slice(bubbleA,bubbleB)+`
let n=0;const ck=(x,m)=>{if(!x)throw Error(m);n++};
const g={status:'play',remaining:24,angle:0,flight:null,last:1,particles:[{at:.5}]};
ck(pawBubbleCanAct(g,false),'ready');ck(!pawBubbleCanAct(g,true),'blocked');
for(const patch of [{status:'won'},{remaining:0},{angle:NaN},{flight:{}},{remaining:1.2}])ck(!pawBubbleCanAct({...g,...patch},false),'invalid shot');
ck(!pawBubbleCanAct(null,false),'missing game');
ck(pawBubblePause(g,11)&&g.last===11&&g.particles[0].at===10.5,'paused age');
ck(!pawBubblePause(g,NaN),'invalid time');
let released=[];
ck(!pawBubbleCancelPointer(null,id=>released.push(id)),'empty pointer');
ck(pawBubbleCancelPointer(0,id=>released.push(id))&&released[0]===0,'valid zero pointer');
return n;`)();
console.log('PASS '+bubbleChecks+' bubble shot, pause and pointer guards');

const recoveredPart=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<=i)throw Error('Missing '+a);return s.slice(i,j)};

const recoveredChecks=new Function(
 recoveredPart('const pawRecoveredShareFormats=','function pawPrepareRecoveredShare')+
 recoveredPart('function pawDrawRecoveredLayout(','/* Share only the computed result')+
 recoveredPart('/* PAW_SCRIPTED_GAIT_BEGIN */','/* PAW_SCRIPTED_GAIT_END */')+
 recoveredPart('/* PAW_GLASS_PROJECTION_BEGIN */','/* PAW_GLASS_PROJECTION_END */')+
 recoveredPart('/* PAW_EXTRA_DISCOVERY_BEGIN */','/* PAW_EXTRA_DISCOVERY_END */')+
 `
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
let size,strings,draws,depth;
const g={font:'',save(){depth++},restore(){depth--},translate(){},scale(){},beginPath(){},rect(){},clip(){},rotate(){},measureText(v){return {width:Array.from(v).length*25}},fillText(v){strings.push(v)},drawImage(){draws++}};
const cv={getContext(){return g}},atlas={complete:true,naturalWidth:1024,naturalHeight:2180};
function readingArtwork(){return atlas}
function pawRecoveredImage(){return {complete:true,naturalWidth:1080,naturalHeight:size}}
const pics={valleyClean:{complete:true,naturalWidth:1440,naturalHeight:810}};
function sharePaintedKey(){return 'valleyClean'}
function shareTextLines(g,v,w){return [v]}
const tarotDeck=Array.from({length:78},(_,i)=>['Card '+i,'牌 '+i]);
const fiveReadingPositions=Array.from({length:5},(_,i)=>['Position '+i,'位置 '+i]);
function socialResultQuote(){return ['Live reflection','真实结果']}
const scoreRows=count=>Array.from({length:count},(_,i)=>({label:['Theme '+i,'主题 '+i],value:['3 / 6','3 / 6']}));
const examples=[...[1,3,5].map(count=>({kind:'tarot',cards:Array.from({length:count},(_,i)=>({i,rev:i===1})),takeaway:['Actual reading','实际解读']})),{kind:'fortune',lines:[['Actual fortune','实际签文']]},{kind:'story',lines:[['Actual story','实际故事']]},{kind:'soul',lines:[['Actual cat','实际猫灵']]},{kind:'cafe',lines:[['Actual café','实际咖啡馆']]},{kind:'type',scoreRows:scoreRows(4)},{kind:'motive',scoreRows:scoreRows(9)},{kind:'bigfive',scoreRows:scoreRows(5)},{kind:'values',scoreRows:scoreRows(4)},{kind:'zwds_chart',palaces:Array.from({length:12},(_,i)=>({name:['Palace '+i,'宫位 '+i],stars:i%2?[['Zi Wei','紫微']]:[]}))}];
for(const format of Object.keys(pawRecoveredShareFormats)){
 const box=pawRecoveredShareBounds(format);size=box.height;
 for(const item of examples)for(const cn of [false,true]){
  const data={...item,title:['Actual title','实际标题']};strings=[];draws=0;depth=0;
  ck(pawDrawRecoveredLayout(cv,data,format,cn,box,{})===true,'draw '+format+' '+item.kind);
  ck(cv.width===1080&&cv.height===size&&depth===0,'canvas size and balanced context');
  ck(strings.join('').includes(cn?'实际标题':'Actual title'),'live title');
  ck(strings.join('').includes(cn?'实际':'Actual'),'live data');
  ck(draws===(item.kind==='tarot'?2+item.cards.length:item.scoreRows||item.palaces?2:3),'actual image slots');
 }
}
ck(pawRecoveredLayoutKey({kind:'zwds'},'feed')===null,'no full birth chart invented');
ck(pawRecoveredLayoutKey({kind:'type'},'feed')===null,'no score invented');
const q={key:'',x:0,y:0,distance:0};
ck(pawTrackScriptedGait(q,'prayer',10,10,true)===0,'start');
ck(pawTrackScriptedGait(q,'prayer',13,14,true)===5,'distance');
ck(pawTrackScriptedGait(q,'prayer',13,14,true)===5,'stationary');
ck(pawTrackScriptedGait(q,'prayer',16,18,true)===10,'continuous');
ck(pawTrackScriptedGait(q,'prayer',200,200,true)===0,'teleport');
ck(pawTrackScriptedGait(q,'paper',204,203,true)===0,'new activity');
ck(pawTrackScriptedGait(q,'paper',207,207,true)===5,'new motion');
ck(pawTrackScriptedGait(q,'paper',207,207,false)===0,'idle');
ck(pawTrackScriptedGait(q,'paper',NaN,4,true)===0,'invalid input');
for(const [key,p] of Object.entries(pawRailGlassOutlines)){
 const box=pawGlassExtent(p),dims=key==='portrait'?[880,1320]:[1440,810];
 ck(box.w>500&&box.h>300,'glass extent');
 ck(p.flat().every(([x,y])=>x>=0&&y>=0&&x<=dims[0]&&y<=dims[1]),'mask bounds');
 for(const [iw,ih] of [[1102,347],[1102,349],[1102,275],[1102,300],[1800,800]])for(let i=0;i<=36;i++){
  const c=pawGlassCrop(iw,ih,box.w,box.h,i/36);
  ck(c.x>=0&&c.y>=0&&c.x+c.w<=iw+1e-6&&c.y+c.h<=ih+1e-6,'source bounds');
  ck(Math.abs(c.w/c.h-box.w/box.h)<1e-8,'no stretching')
 }
}
for(const mode of Object.keys(pawExtraDiscoveries)){
 const rows=pawExtraDiscoveries[mode].axes.flatMap((a,k)=>a.questions.map((q,j)=>({dimension:k,id:k*3+j})));
 const scores=pawExtraScore(mode,rows,rows.map(()=>1));
 ck(scores.every(v=>v===3),'balanced answers');
 ck(pawExtraRows(mode,scores).length===rows.length/3,'result rows');
 ck(pawExtraScore(mode,rows,rows.map(()=>3))===null,'invalid answer');
 ck(pawExtraScore(mode,rows.slice(1),rows.map(()=>1))===null,'incomplete');
 const answers=rows.map(q=>pawExtraDiscoveries[mode].axes[q.dimension].questions[q.id%3][1]?0:2);
 ck(pawExtraScore(mode,rows,answers).every(v=>v===6),'reverse scores');
}
return n;`)();
console.log('PASS '+recoveredChecks+' recovered artwork, railway projection and scripted gait checks');

const pawFrameSelectSource=s.slice(pawSelectA,pawSelectB);
console.log(new Function(pawFrameSelectSource+`
const pool=pawTarotPool(78,()=>.4),frame={pool,portrait:true};
const q={readStage:'choose',pawCardPool:pool,pawChoiceFrame:frame};
const ck=(v,m)=>{if(!v)throw Error(m)};
ck(pawTarotFrameMatches(q,frame,true),'rendered frame accepted');
ck(!pawTarotFrameMatches(q,frame,false),'rotated frame rejected');
ck(!pawTarotFrameMatches({...q,pawCardPool:pawTarotPool(78,()=>.5)},frame,true),'reshuffled pool rejected');
ck(!pawTarotFrameMatches({...q,pawChoiceFrame:{pool,portrait:true}},frame,true),'retired frame rejected');
ck(!pawTarotFrameMatches({...q,readStage:'deal'},frame,true),'completed choice rejected');
return 'PASS 5 rendered tarot selection guards';
`)());

const mainGait=new Function(s.split('/* PAW_MAIN_GAIT_BEGIN */')[1].split('/* PAW_MAIN_GAIT_END */')[0]+';return pawMainGaitAdvance')();
{const q={};let a=mainGait(q,'map','up',0,1,false);if(a.ready)throw Error('unexpected loaded mode');a=mainGait(q,'map','up',20,1,true);if(a.ready||!(a.cycle>0))throw Error('mid-stride sprite swap');let old=a.cycle;a=mainGait(q,'map','up',20,2,true);if(a.cycle!==old)throw Error('camera scale changed stride without movement');a=mainGait(q,'map','right',25,2,true);if(!a.ready||a.cycle<=old)throw Error('direction transition');a=mainGait(q,'room','right',0,1,true);if(!a.ready||a.cycle!==0)throw Error('room stride reset');}
