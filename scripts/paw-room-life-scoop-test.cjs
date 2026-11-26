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
 ck(f.left>=0&&f.top>=0&&f.width<=w&&f.height<=h,'fit gateway');
 for(let i=0;i<=100;i++){
  const p=pawGateGround(w,h,i/100);
  ck(p.x>=f.left&&p.x<=f.left+f.width&&p.y<=f.top+f.height&&p.y-p.height>=f.top,'grounded character inside artwork');
  if(i)ck(p.y<pawGateGround(w,h,(i-1)/100).y,'forward approach');
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
