const fs=require('node:fs');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const begin=source.indexOf('/* MB5_ACTION_BEGIN'),end=source.indexOf('/* MB5_ACTION_END */');
if(begin<0||end<begin)throw Error('Missing action refinement block');
const harness="\nconst assert=(v,m)=>{if(!v)throw Error(m)};\nlet activity='hit',room='fish',state={count:0},t=10,talkOpen=false,transitioning=false,zh=false,continuityRoom='fish',continuityActivity=null,indoor={x:400,y:615,tx:400,ty:615,facing:'up',route:[]};\nconst noop=()=>{},el={hidden:false,style:{display:'none'},classList:{add:noop,remove:noop,contains:()=>false},querySelector:()=>null,replaceChildren:noop};\nconst $=()=>el,document={hidden:false,addEventListener:noop,createElement:()=>({}),head:{append:noop}},tr=(a)=>a,b=()=>({}),hint=noop,ctx={save:noop,translate:noop,scale:noop,restore:noop},poseEase=x=>x;\nconst pawArcadeInputBlocked=()=>document.hidden||talkOpen||transitioning||el.style.display==='block';\nlet paperRitualBusy=()=>!!state.paperAction,chooseStressTarget=()=>true,paperWorryAt=noop,paperRitualSyncButtons=noop,townActionPhase=()=> 'ready';\nlet refreshControls=noop,drawActivity=noop,drawRitualPose=(x,y,s,o)=>o,drawMeadowDeer=(x,y,p,b)=>b,deerBow=()=>{if(state.deerPhase==='greet')state.deerPhase='bow'};\nlet shakeCalls=0,scoopCalls=0,sipCalls=0,teaShake=()=>shakeCalls++,teaAddPearls=()=>scoopCalls++,teaSip=()=>sipCalls++;\nlet templeReleaseBell=noop,templeReleaseWater=noop,soupTaste=noop,indoorSafe=(x,y)=>x>0&&y>0,indoorReady=()=>true,start=id=>{activity=id;state={}},drawRoom=noop,enter=noop;\n/* PATCH */\nconst prepDuration=globalThis.PawAuntieRitualMotion?.preparationDuration??1.1;\nassert(mb5PrepProgress(10,10)===0&&Math.abs(mb5PrepProgress(10+prepDuration/2,10)-.5)<1e-8&&mb5PrepProgress(10+prepDuration+.001,10)===1,'paper progress');\nchooseStressTarget(1);assert(paperRitualBusy()&&!state.paperPrepared,'prep locks strike');t=10+prepDuration/2;mb5PrepareAdvance();assert(!state.paperPrepared&&paperRitualBusy(),'cannot skip paper preparation');t=10+prepDuration+.001;document.hidden=true;mb5PrepareAdvance();assert(!state.paperPrepared&&paperRitualBusy(),'covered preparation cannot complete');document.hidden=false;mb5PrepareAdvance();assert(state.paperPrepared&&!paperRitualBusy(),'paper ready');\nassert(mb5AssistSpec('templeBell',{bellAt:1},2).disabled&&mb5AssistSpec('templeBell',{bellAt:1},4).action==='bell','bell cooldown');\nassert(mb5AssistSpec('templeWater',{waterStage:0},t).action==='scoop'&&mb5AssistSpec('templeWater',{waterStage:1},t).action==='rinse'&&mb5AssistSpec('templeWater',{waterStage:2},t).disabled,'water sequence');\nassert(mb5AssistSpec('cook',{done:true},t).action==='taste'&&mb5AssistSpec('cook',{done:true,tasteAt:0},t).disabled&&mb5AssistSpec('cook',{done:true,tasted:true},t).action==='back','taste sequence');\nactivity='bubbleTea';state={teaStage:'seal',teaMix:100};teaShake(80);teaAddPearls();teaSip();assert(!shakeCalls&&!scoopCalls&&!sipCalls,'reject invalid food actions');state={teaStage:'mix',teaMix:50};teaShake(NaN);teaShake(0);teaShake(80);assert(shakeCalls===1,'one valid shake');state={teaStage:'pearls',teaTopping:0,teaToppingCount:0};teaAddPearls();state.teaTopping=1;teaAddPearls();state.teaToppingCount=2;teaAddPearls();assert(scoopCalls===1,'topping cap');state={teaStage:'ready',teaSealed:false};teaSip();state.teaSealed=true;teaSip();assert(sipCalls===1,'sealed drink only');\nstate={teaStage:'pouring',teaAt:10};mb5Visibility(true,10.4);mb5Visibility(false,15.4);assert(state.teaAt===15,'pause elapsed only');mb5Visibility(true,16);state={teaStage:'pouring',teaAt:20};mb5Visibility(false,30);assert(state.teaAt===20,'no stale pause on new cup');\nactivity='claw';state={dropping:true,clawAt:10};mb5Visibility(true,11);mb5Visibility(false,16);assert(state.clawAt===15,'pause active claw flight');state={dropping:false,clawAt:20};mb5Visibility(true,21);mb5Visibility(false,30);assert(state.clawAt===20,'no pause for idle claw');\nassert(mb5BowCurve(.5,.95,1.65)===0&&mb5BowCurve(1.7,.95,1.65)>.9&&mb5BowCurve(2.7,.95,1.65)===0,'deer response delay');\nactivity='deerVisit';state={deerPhase:'ready'};deerBow();assert(state.deerPhase==='bow','repeat bow without reward');\nassert(mb5Anchor('fish',indoor,indoorSafe).x===400&&!mb5Anchor('fish',{...indoor,tx:500},indoorSafe)&&!mb5Anchor('fish',{...indoor,x:NaN},indoorSafe),'safe station anchor');\nactivity=null;room='fish';start('hit');indoor.x=indoor.tx=510;activity=null;drawRoom();assert(indoor.x===400&&indoor.tx===400,'same station return');\nreturn 'PASS: focused action assertions including paper preparation guards';\n";
console.log(new Function(harness.replace('/* PATCH */',()=>source.slice(begin,end)))());

const extSource=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
const between=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<i)throw Error('Missing helper '+a);return s.slice(i,j)};
console.log(new Function("const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),poseEase=x=>x;"+between(extSource,'function pearlPreviousStage','function pearlStage')+between(extSource,'function clawTrayFlight','function clawCabinet')+between(source,'function mbFurnitureQuote','const mbFurnitureDetailBefore')+"\nconst assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nconst q={teaStage:'pourReady',teaBase:2,teaSugar:30,teaIce:3,teaTopping:1,teaOrder:{base:2}};\nassert(pearlRewindRecipe(q)==='topping'&&q.teaTopping===null&&q.teaIce===3&&q.teaOrder.base===2,'edit topping');\nq.teaStage='topping';assert(pearlRewindRecipe(q)==='ice'&&q.teaIce===null&&q.teaSugar===30,'edit ice');\nq.teaStage='sugar';assert(pearlRewindRecipe(q)==='base'&&q.teaBase===-1&&q.teaSugar===null&&q.teaIce===null,'edit base');\nq.teaStage='base';assert(pearlRewindRecipe(q)==='order'&&q.teaOrder===null,'return to order');\nfor(const phase of ['pouring','seasoning','pearls','mix','seal','ready','sip','done'])assert(pearlPreviousStage(phase)===null,'no changes after pour '+phase);\nassert(pearlPhaseNumber('order')===1&&pearlPhaseNumber('sugar')===2&&pearlPhaseNumber('pearls')===3&&pearlPhaseNumber('sealing')===4&&pearlPhaseNumber('done')===5,'recipe progress');\nconst a=clawTrayFlight(2.55),b=clawTrayFlight(3.15),m=clawTrayFlight(2.85);\nassert(a.x===286&&a.y===402&&Math.abs(b.x-302)<.001&&Math.abs(b.y-587)<.001&&m.y>a.y&&m.y<b.y,'claw contact and tray flight');\nassert(mbFurnitureQuote(200,75,false).remaining===125&&mbFurnitureQuote(30,75,false).shortage===45&&mbFurnitureQuote(30,75,true).remaining===30&&mbFurnitureQuote(NaN,75,false)===null,'balance quote');\nreturn 'PASS: recipe correction, progression, claw flight and furniture quote';")());

const pawExt=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
const pawSlice=(a,b)=>{const i=pawExt.indexOf(a),j=pawExt.indexOf(b,i);if(i<0||j<i)throw Error('Missing helper '+a);return pawExt.slice(i,j)};
console.log(new Function(pawSlice('function pawRitualPhase','function syncRitualBar')+pawSlice('function pawCatDirection','const catArtDraft')+pawSlice('function pawBoxReveal','function drawBlindShopStage')+"const assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nassert(pawRitualPhase('taking')===1&&pawRitualPhase('lighting')===2&&pawRitualPhase('bow')===3&&pawRitualPhase('placing')===4&&pawRitualPhase('bad')===0,'ritual stages');\nassert(pawCatDirection({phase:'feed'})===-1&&pawCatDirection({phase:'water'})===1&&pawCatDirection({phase:'return',returnFromX:452})===-1,'cat bowl facing');\nassert(pawCatDirection({phase:'play',assisted:true,x:410,pawPreviousX:420})===-1&&pawCatDirection({phase:'play',assisted:true,x:420,pawPreviousX:410})===1,'cat follows motion');\nassert(pawBoxReveal(.1).figure===0&&!pawBoxReveal(.1).done&&pawBoxReveal(.95).figure===1&&pawBoxReveal(.95).done&&pawBoxReveal(0,true).done,'box reveal timing');\nassert(pawFigureRarity('secret')[0]==='Secret'&&pawFigureRarity('rare')[1]==='稀有款','rarity');\nreturn 'PASS: five focused ritual, cat and box checks';")());
console.log(new Function("let activity='pet',state={care:{phase:'feed',at:10,tickAt:11}};const document={addEventListener(){}};"+pawSlice('let pawCareSleep','function careTick')+"pawCareVisibility(true,11);pawCareVisibility(false,16);if(state.care.at!==15||state.care.tickAt!==16)throw Error('cat pause');pawCareVisibility(true,17);state.care={phase:'feed',at:20};pawCareVisibility(false,30);if(state.care.at!==20)throw Error('stale cat pause');return 'PASS: cat pause and replacement';")());

console.log(new Function("let activity='moon',state={count:0},t=10,reactions=0,papers=0,talkOpen=false,transitioning=false;const document={hidden:false},proposal={hidden:true},$=()=>({style:{display:'none'}}),physicalFx=()=>{},sound=()=>{},hint=()=>{},addItem=()=>{},react=()=>reactions++,templePaperOpen=()=>papers++;"+pawSlice('/* PAW_RITUAL_CLOCK_BEGIN */','/* PAW_RITUAL_CLOCK_END */')+"const assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nassert(pawMoonFlat(0,0,1)&&!pawMoonFlat(0,1,1)&&!pawMoonFlat(1,0,1)&&pawMoonFlat(2,1,1),'true faces');\nfor(const flat of [true,false])for(const i of [0,1]){const m=pawMoonMotion(1,i,flat,95);assert(m.flat===flat&&Math.abs(m.lift)<.001&&Math.abs(m.x-(350+i*100))<.001,'settled block')}\nassert(pawMoonMotion(.5,0,true,95).lift>94,'flight apex');\nassert(pawMoonToss(65,true)&&state.moonPending&&!pawMoonToss(65,true),'single toss');\nt=state.tossUntil-.01;pawRitualAdvance();assert(state.moonPending&&!reactions,'no early reward');\nt+=.02;document.hidden=true;pawRitualAdvance();assert(state.moonPending,'hidden toss');document.hidden=false;pawRitualAdvance();assert(!state.moonPending&&reactions===1,'one landing');pawRitualAdvance();assert(reactions===1,'no duplicate');\nactivity='sticks';state={drawing:true,stickNumber:7,stickDrawAt:10};t=11;pawRitualAdvance();assert(state.drawing&&!state.fallenStick,'stick still falling');t=11.3;pawRitualAdvance();assert(state.fallenStick===7&&!state.drawing,'landed stick');state.stickPicked=true;state.stickPickAt=t;t+=.5;pawRitualAdvance();assert(!papers,'no early paper');t+=.4;pawRitualAdvance();assert(papers===1&&state.stickDelivered,'collect after pickup');pawRitualAdvance();assert(papers===1,'no double paper');\nreturn 'PASS: moon and fortune lifecycle, timing and landing';")());

console.log(new Function("const furnitureZone=d=>d.zone;"+pawSlice('function pawBagNormalize','function renderTravellerBag')+pawSlice('function pawChatNearEnd','function townChatPage')+pawSlice('function pawKeepsakeClue','function keepsakeClue')+pawSlice('function pawFurnitureLocation','function hideoutPage')+"const assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nassert(pawBagNormalize(' Ｔｅａ   CUP ')==='tea cup','normalized search');\nassert(pawBagSearchMatch({item:['Milk tea','经典奶茶'],owned:true},'奶茶'),'Chinese query');\nassert(pawBagSearchMatch({item:['Milk tea','经典奶茶'],owned:true},'ＭＩＬＫ'),'English fullwidth');\nconst secret={item:['Dragon figure','龙手办'],owned:false};assert(!pawBagSearchMatch(secret,'Dragon',true)&&pawBagSearchMatch(secret,'secret',true)&&pawBagSearchMatch({...secret,owned:true},'Dragon',true),'secret identity hidden');\nassert(pawChatNearEnd(100,100,220)&&!pawChatNearEnd(0,100,220),'preserve scroll');\nassert(pawKeepsakeClue('Fortune stick 7')&&pawKeepsakeClue('Parallel life: Lighthouse')&&!pawKeepsakeClue('Unknown'),'specific clues');\nassert(pawFurnitureLocation(null,0)[0]==='Put away'&&pawFurnitureLocation({zone:1},0)[0]==='In another room'&&pawFurnitureLocation({zone:0},0)[0]==='In this room','furniture location');\nreturn 'PASS: returning-player search, secret identity, scroll, clue and furniture checks';")());

console.log(new Function(pawSlice('function pawFixedPlaque','const roomPlaqueLabelBefore')+pawSlice('const pawNoticeSerial','function townPublishedNotices')+pawSlice('const pawWeekNotes','function renderResidentNoticeboard')+pawSlice('function townChatTopic','function townChatReply')+"const assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nconst bounds={left:0,right:400,top:0,bottom:500};\nassert(pawFixedPlaque(200,250,100,40,bounds,[]).x===200,'fixed anchor');\nassert(!pawFixedPlaque(200,250,100,40,bounds,[{left:190,right:210,top:230,bottom:270}])&&!pawFixedPlaque(10,50,100,40,bounds,[]),'hide not slide');\nassert(pawSerialPublished(pawSerialStart-1).length===0&&pawSerialPublished(pawSerialStart).length===1&&pawSerialPublished(pawSerialStart+2*86400000).length===3,'serial timing');\nassert(pawWeekNote(Date.UTC(2026,10,26,16))[0].startsWith('Friday'),'Singapore rollover');\nassert(townChatTopic('he did not reply')==='relationship'||townChatTopic('no reply')==='relationship','relationship');\nassert(townChatTopic('工资')==='payday'&&townChatTopic('weekend break')==='weekend','topical routing');\nreturn 'PASS: anchored plaques, serial dates and contextual humour';")());

const wishMath=between(extSource,'/* PAW_WISH_INPUT_BEGIN */','/* PAW_WISH_INPUT_END */'),kitchenMath=between(extSource,'/* PAW_KITCHEN_INPUT_BEGIN */','/* PAW_KITCHEN_INPUT_END */');
console.log(new Function(wishMath+kitchenMath+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const [w,h] of [[320,400],[900,500],[360,640]]){for(const angle of [-45,-15,0,15,45])for(const power of [10,47,90]){const p=pawWishAim(angle,power,w,h);ck(p.x>=4&&p.x<=96&&p.y>=5&&p.y<=94,'aim bounds')}const p=pawWishAim(0,47,w,h);ck(p.x===50&&p.y===39,'exact center');const a=pawWishDestination(0,-h*.3,300,w,h),b=pawWishDestination(0,-h*.3,600,w,h);ck(a.y<b.y,'faster throw travels farther')}
ck(pawWishDestination(0,-50,100,0,100)===null,'invalid dimensions');ck(!pawWishOwns({id:1},{pointerId:2}),'secondary pointer');ck(!pawWishCanStart(null,{isPrimary:false,button:0},false,false),'not primary');ck(pawWishCanStart(null,{isPrimary:true,button:0},false,false),'valid gesture');
for(const i of [-1,0,1,2,3,NaN])ck(pawKitchenCanAdd({ingredients:[1]},i)===[0,2].includes(i),'valid unique ingredients');
ck(!pawKitchenCanAdd({ingredients:[],done:true},0),'finished dish cannot change');ck(!pawKitchenCanAdd({ingredients:[],tasteAt:0},0),'tasting dish cannot change');
return 'PASS '+n+' wish aiming and kitchen state assertions';`)());

const serveMath=between(extSource,'/* PAW_TEA_SERVE_BEGIN */','/* PAW_TEA_SERVE_END */'),foodClock=between(source,'/* PAW_FOOD_CLOCK_BEGIN */','/* PAW_FOOD_CLOCK_END */');
console.log(new Function(serveMath+foodClock+`
let count=0;const ck=(v,m)=>{if(!v)throw Error(m);count++};
let prev=420;for(let i=0;i<=240;i++){const p=pawTeaDeliveryPose('sip',i/100,true);ck(p.x>=prev-1e-8&&p.x<=524&&p.fill===1,'cup travels to guest without returning');prev=p.x}
const done=pawTeaDeliveryPose('done',100,true);ck(done.x===524&&done.fill===1&&done.delivered,'guest keeps full drink');
ck(pawTeaDeliveryPose('sip',1,false)===null,'own drink keeps sip animation');
ck(pawTeaDeliveryPose('done',0,true,true).x===524,'reduced motion delivery');
let q={teaStage:'pouring',teaAt:10};pawFoodClock(q,'bubbleTea',10,false);pawFoodClock(q,'bubbleTea',10.5,true);pawFoodClock(q,'bubbleTea',30,true);pawFoodClock(q,'bubbleTea',31,false);ck(q.teaAt===31,'hidden or covered time frozen');pawFoodClock(q,'bubbleTea',32,false);ck(q.teaAt===31,'resume clock');
q.teaStage='seasoning';q.teaAt=32;pawFoodClock(q,'bubbleTea',32.5,false);ck(q.teaAt===32,'new phase resets pause');
const fresh={teaStage:'base'};ck(!pawFoodActionAllowed(q,fresh,'seasoning','bubbleTea',false),'old control cannot affect new cup');ck(!pawFoodActionAllowed(fresh,fresh,'order','bubbleTea',false),'stale stage');ck(!pawFoodActionAllowed(fresh,fresh,'base','bubbleTea',true),'covered control');ck(pawFoodActionAllowed(fresh,fresh,'base','bubbleTea',false),'live control');
const soup={tasteAt:5};pawFoodClock(soup,'cook',5,false);pawFoodClock(soup,'cook',6,true);pawFoodClock(soup,'cook',9,false);ck(soup.tasteAt===9,'soup tasting pause');
soup.tasted=true;ck(!pawFoodClock(soup,'cook',10,true)&&!soup.pawFoodClock,'no clock after tasting');
return 'PASS '+count+' guest delivery, preparation clock and stale control assertions';`)());

const discovery=between(extSource,'/* PAW_DISCOVERY_INPUT_BEGIN */','/* PAW_DISCOVERY_INPUT_END */');
console.log(new Function(discovery+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};const row={id:2},frame={token:4,index:2,row};
ck(pawDiscoveryCurrent(frame,4,2,row,'question',false),'current question');ck(!pawDiscoveryCurrent(frame,5,2,row,'question',false),'new assessment');ck(!pawDiscoveryCurrent(frame,4,3,row,'question',false),'next question');ck(!pawDiscoveryCurrent(frame,4,2,{id:2},'question',false),'different row');ck(!pawDiscoveryCurrent(frame,4,2,row,'turn',false),'double answer');ck(!pawDiscoveryCurrent(frame,4,2,row,'question',true),'covered question');
ck(pawDiscoveryStep(.2,100,101,true)===.2,'paused card');ck(pawDiscoveryStep(.2,100,1000,false)===.25,'bounded resume');ck(Math.abs(pawDiscoveryStep(.2,100,120,false)-.22)<1e-9,'visible progress');
return 'PASS '+n+' assessment input and turn timing assertions';`)());

const clawControl=between(source,'/* PAW_CLAW_CONTROL_BEGIN */','/* PAW_CLAW_CONTROL_END */');
console.log(new Function(clawControl+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
const q={hook:.5};ck(pawClawAllowed(q,q,'claw',false),'current claw');ck(!pawClawAllowed(q,{},'claw',false),'stale');ck(!pawClawAllowed(q,q,'claw',true),'covered');ck(!pawClawAllowed(q,q,'cook',false),'other game');
for(let i=0;i<100;i++){pawClawMove(q,-.07);ck(q.hook>=0,'left clamp')}ck(q.hook===0,'left stop');
for(let i=0;i<100;i++){pawClawMove(q,.025);ck(q.hook<=1,'right clamp')}ck(q.hook===1,'right stop');
for(const [i,x] of [296,400,504].entries()){q.hook=(x-286)/228;const a=pawClawAlignment(q);ck(a.i===i&&a.distance<1e-8,'actual plush position')}
q.dropping=true;q.clawAt=5;ck(!pawClawMove(q,.1),'no moving during drop');ck(!pawClawAllowed(q,q,'claw',false),'no duplicate drop');
pawClawClock(q,5,false);pawClawClock(q,5.2,true);pawClawClock(q,25,true);pawClawClock(q,26,false);ck(q.clawAt===26,'covered flight frozen');pawClawClock(q,27,false);ck(q.clawAt===26,'resume');
q.dropping=false;q.clawResult={at:27};pawClawClock(q,27,false);pawClawClock(q,28,true);pawClawClock(q,30,false);ck(q.clawResult.at===30,'tray result remains visible after pause');
ck(!pawClawMove(q,NaN),'reject invalid aim');
return 'PASS '+n+' claw input, alignment and pause assertions';`)());

const quietClock=between(source,'/* PAW_RITUAL_PAUSE_BEGIN */','/* PAW_RITUAL_PAUSE_END */');
console.log(new Function(quietClock+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
const cases=[
 ['moon',{moonPending:true,tossUntil:11},'tossUntil'],
 ['sticks',{drawing:true,stickDrawAt:10,shakeUntil:11},'stickDrawAt'],
 ['sticks',{stickPicked:true,stickDelivered:false,stickPickAt:10},'stickPickAt'],
 ['prayer',{prayerStage:'bow',prayerAt:10},'prayerAt'],
 ['templeWater',{waterStage:2,waterAt:10},'waterAt'],
 ['templeBell',{bellAt:10},'bellAt'],
 ['blindBox',{boxStage:'opening',boxAt:10},'boxAt']
];
for(const [kind,run,field] of cases){
 const original=run[field],shake=run.shakeUntil;
 ck(pawQuietClock(run,kind,10,false),'active '+kind);
 pawQuietClock(run,kind,10.5,true);pawQuietClock(run,kind,20,true);pawQuietClock(run,kind,21,false);
 ck(run[field]===original+11,'pause '+kind);
 if(shake!==undefined)ck(run.shakeUntil===shake+11,'secondary stick clock');
 pawQuietClock(run,kind,22,false);ck(run[field]===original+11,'resume '+kind);
 run[field]=40;pawQuietClock(run,kind,23,true);ck(run[field]===40,'new attempt is not shifted '+kind)
}
const q={prayerStage:'hold',prayerAt:10};ck(!pawQuietClock(q,'prayer',10,true),'idle stage not paused');
ck(pawQuietActionMatches(q,q,'prayer','prayer','hold','hold',false),'live ritual control');
ck(!pawQuietActionMatches(q,{},'prayer','prayer','hold','hold',false),'stale ritual control');
ck(!pawQuietActionMatches(q,q,'prayer','prayer','offer','hold',false),'wrong stage');
ck(!pawQuietActionMatches(q,q,'prayer','prayer','hold','hold',true),'covered ritual');
ck(!pawQuietActionMatches(q,q,'claw','prayer','hold','hold',false),'wrong activity');
return 'PASS '+n+' quiet ritual and blind box timing assertions';`)());

const paperBoard=between(source,'/* PAW_PAPER_BOARD_BEGIN */','/* PAW_PAPER_BOARD_END */');
console.log(new Function(paperBoard+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
let q={paperAction:{at:10,landed:false}};
pawPaperClock(q,10,false);pawPaperClock(q,10.1,true);pawPaperClock(q,20,true);pawPaperClock(q,21,false);
ck(q.paperAction.at===21,'preserve strike time');ck(!q.paperAction.landed,'no impact while covered');
pawPaperClock(q,22,false);ck(q.paperAction.at===21,'resume');
q.paperAction={at:22,landed:true};pawPaperClock(q,23,true);ck(q.paperAction.at===22,'new strike unchanged');ck(q.paperAction.landed,'no duplicate impact');
q={paperPrepAt:5};pawPaperClock(q,5,false);pawPaperClock(q,6,true);pawPaperClock(q,8,false);ck(q.paperPrepAt===8,'preserve preparation');
delete q.paperPrepAt;ck(pawPaperClock(q,9,false)===null&&!q.pawPaperClock,'clear finished clock');
ck(pawNoticePageSize(6,20,6)===12,'page more');ck(pawNoticePageSize(12,13,6)===13,'bounded archive');ck(pawNoticePageSize(12,30,1)===13,'retain old notices after publication');ck(pawNoticePageSize(6,2,6)===6,'minimum page');
return 'PASS '+n+' paper ritual and notice archive checks';`)());

const careContinuity=between(source,'/* PAW_CARE_CONTINUITY_BEGIN */','/* PAW_CARE_CONTINUITY_END */');
console.log(new Function(careContinuity+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const phase of ['feed','water','rest','pet','play','return']){
 let a={phase,at:10,returnAt:10,tickAt:10,assisted:true};const k=phase==='return'?'returnAt':'at';
 pawCareActiveClock(a,10,false);pawCareActiveClock(a,10.5,true);pawCareActiveClock(a,20,true);pawCareActiveClock(a,21,false);
 ck(a[k]===21,'pause '+phase);ck(a.tickAt===21,'tick '+phase);
 pawCareActiveClock(a,22,false);ck(a[k]===21,'resume '+phase);
 a[k]=40;pawCareActiveClock(a,23,true);ck(a[k]===40,'new action '+phase)
}
let a={phase:'idle'};ck(pawCareControlAllowed(a,a,'feed',false),'fresh');
ck(!pawCareControlAllowed(a,{},'feed',false),'stale');ck(!pawCareControlAllowed(a,a,'bad',false),'invalid');ck(!pawCareControlAllowed(a,a,'feed',true),'covered');
a.drag={id:7};ck(!pawCareControlAllowed(a,a,'feed',false),'dragging');
a.phase='pet';a.x=400;a.y=535;ck(pawCareCancelDrag(a,10)===7&&a.phase==='return'&&a.returnAt===10&&!a.drag,'cancel drag without reward');
ck(pawCareCancelDrag(a,11)===null,'idempotent');
ck(!pawCareAssistedReady({phase:'pet',at:10,assisted:true},12,false),'early');
ck(pawCareAssistedReady({phase:'pet',at:10,assisted:true},12.4,false),'pet ready');
ck(!pawCareAssistedReady({phase:'play',at:10,assisted:true},15,true),'covered no award');
ck(pawCareAssistedReady({phase:'play',at:10,assisted:true},13.3,false),'play ready');
return 'PASS '+n+' cat care clock, control and cancellation assertions';`)());

const tarotContinuity=between(source,'/* PAW_TAROT_CONTINUITY_BEGIN */','/* PAW_TAROT_CONTINUITY_END */');
console.log(new Function(tarotContinuity+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const stage of ['shuffle','deal','focus','cards']){
 const q={readStage:stage,readAt:10,readFlip:[10,-1,8]};
 pawTarotClock(q,10.2,false);pawTarotClock(q,10.3,true);pawTarotClock(q,20,true);pawTarotClock(q,21,false);
 ck(Math.abs(q.readAt-20.8)<1e-8,'stage pause');ck(Math.abs(q.readFlip[0]-20.8)<1e-8,'flip pause');
 ck(q.readFlip[1]===-1&&q.readFlip[2]===8,'untouched and settled');
 pawTarotClock(q,22,false);ck(Math.abs(q.readAt-20.8)<1e-8,'resume');
 q.readStage='deck';q.readAt=22;pawTarotClock(q,23,true);ck(q.readAt===22,'new stage')
}
const q={readStage:'cards'};
ck(pawTarotActionAllowed(q,q,'love','love','cards',true,true,false),'current');
ck(!pawTarotActionAllowed(q,{},'love','love','cards',true,true,false),'stale');
ck(!pawTarotActionAllowed(q,q,'tarot','love','cards',true,true,false),'different activity');
ck(!pawTarotActionAllowed(q,q,'love','love','focus',true,true,false),'stage');
ck(!pawTarotActionAllowed(q,q,'love','love','cards',true,false,false),'rotation');
ck(!pawTarotActionAllowed(q,q,'love','love','cards',true,true,true),'blocked');
ck(pawTarotKeyFirst([0,1])===2,'first');ck(pawTarotKeyMove(0,'ArrowRight',true,[1,2])===3,'skip');
ck(pawTarotKeyMove(0,'ArrowDown',true)===4,'portrait');ck(pawTarotKeyMove(0,'ArrowDown',false)===6,'wide');
ck(pawTarotKeyMove(0,'ArrowLeft',true)===11,'wrap');ck(pawTarotKeyMove(0,'bad',true)===null,'invalid');
return 'PASS '+n+' tarot active clock, hit ownership and keyboard navigation checks';`)());

console.log('PASS: '+new Function(between(source,'/* PAW_TEMPLE_JOURNEY_BEGIN */','/* PAW_TEMPLE_JOURNEY_END */')+"let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};for(let i=1;i<=12;i++){const q={pawFortuneNumber:i,stickDelivered:true};ck(pawFortuneNext(q,'sticks',0,false)==='confirm','confirmation required');ck(!pawFortuneAction(q,q,'sticks',0,false,'receive'),'no bypass');ck(pawFortuneAction(q,q,'sticks',0,false,'confirm'),'confirm');q.count=0;ck(pawFortuneNext(q,'moon',0,false)==='toss','first toss');q.count=1;q.moonPending=true;q.result=0;ck(pawFortuneNext(q,'moon',0,false)===null,'pending');q.moonPending=false;q.tossUntil=1;ck(pawFortuneNext(q,'moon',0,false)===null,'airborne');for(const result of [0,1,2]){q.result=result;const next=result===0?'receive':'retry';ck(pawFortuneNext(q,'moon',2,false)===next,'outcome');ck(pawFortuneAction(q,q,'moon',2,false,'receive')===(result===0),'confirmed only');ck(pawFortuneAction(q,q,'moon',2,false,'retry')===(result!==0),'must redraw');ck(!pawFortuneAction(q,{},'moon',2,false,next),'stale');ck(!pawFortuneAction(q,q,'moon',2,true,next),'blocked')}delete q.pawFortuneNumber;ck(!pawFortuneAction(q,q,'moon',2,false,'receive'),'consumed')}for(const v of [0,13,NaN,1.2,'1',null])ck(pawFortuneSlipNumber(v)===null,'invalid');let cat={};ck(pawTempleCatVisit(cat),'first visit');ck(!pawTempleCatVisit(cat),'duplicate');for(const paperStage of ['opening','kept','tied']){let q={paperStage,paperAt:10};pawTemplePaperClock(q,10,false);pawTemplePaperClock(q,11,true);pawTemplePaperClock(q,20,true);pawTemplePaperClock(q,21,false);ck(q.paperAt===21,'pause');pawTemplePaperClock(q,22,false);ck(q.paperAt===21,'resume');q.paperStage='folded';ck(!pawTemplePaperClock(q,23,true)&&!q.pawPaperPause,'reset')}return n;")()+' mandatory temple fortune confirmation, redraw and paper clock assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_TEMPLE_ADMISSION_BEGIN */','/* PAW_TEMPLE_ADMISSION_END */')+"let n=0;const ck=(x,m)=>{if(!x)throw Error(m);n++};let q={scene:'fortune',x:400,y:500},v={scene:'fortune',x:400,y:500,room:null,activity:null,transitioning:false,blocked:false,pending:null};ck(pawTempleAdmissionValid(q,q,v),'ready');ck(!pawTempleAdmissionValid(q,{},v),'stale');for(const [k,value] of Object.entries({scene:'home',room:'tea',activity:'sticks',transitioning:true,blocked:true,pending:'tarot',x:415}))ck(!pawTempleAdmissionValid(q,q,{...v,[k]:value}),'invalid '+k);ck(pawTempleAdmissionValid(q,q,{...v,x:410}),'near threshold');let im={complete:true,naturalWidth:928,naturalHeight:1648};ck(pawTempleAssetsReady(im,im),'both ready');ck(!pawTempleAssetsReady(im,null),'missing');ck(!pawTempleAssetsReady(im,{...im,complete:false}),'loading');ck(!pawTempleAssetsReady(im,{...im,naturalWidth:0}),'failed');return n")()+' temple artwork admission assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_FORECOURT_BEGIN */','/* PAW_FORECOURT_END */')+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const pos of [pawForecourtStart,pawForecourtLanding,pawForecourtCat])for(const kind of ['cat','hall','exit'])for(const reduced of [true,false]){
 const q={pos:pos.slice(),route:[],last:0};ck(pawForecourtRoute(q,kind),'route');
 ck(!pawForecourtRoute(q,'cat')&&!pawForecourtRoute(q,'hall'),'cannot replace active walk with another visit');
 if(kind==='exit')ck(!pawForecourtRoute(q,'exit'),'cannot replace active return');
 else {const interrupt={pos:q.pos.slice(),route:q.route.map(v=>v.slice()),destination:q.destination,last:q.last};ck(pawForecourtRoute(interrupt,'exit'),'return can interrupt an approach');ck(!pawForecourtRoute(interrupt,'exit'),'cannot replace interrupted return')}
 const held=q.pos.slice();pawForecourtTick(q,.016,true,reduced);ck(q.pos.every((v,i)=>v===held[i]),'covered path frozen');
 let result;for(let i=2;i<5000&&!result;i++){result=pawForecourtTick(q,i*.016,false,reduced);ck(q.pos.every(Number.isFinite)&&q.pos[0]>=.45&&q.pos[0]<=.58&&q.pos[1]>=.57&&q.pos[1]<=.83,'on traced stone path')}
 ck(result===kind,'arrival');const goal=kind==='cat'?pawForecourtCat:kind==='hall'?pawForecourtLanding:pawForecourtStart;
 ck(q.pos.every((v,i)=>v===goal[i]),'same endpoint');
}
return n;`)()+' two-way forecourt route assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_FORTUNE_WALK_BEGIN */','/* PAW_FORTUNE_WALK_END */')+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};const hallState={},arrive=()=>{},q={hallState,arrive,started:false},v={room:'temple',activity:null,state:hallState,blocked:false,ready:true,goal:null,moving:false};
ck(pawFortuneWalkPhase(q,v)==='route','route');
for(const p of [{blocked:true},{ready:false}])ck(pawFortuneWalkPhase(q,{...v,...p})==='wait','wait');
for(const p of [{room:'tea'},{activity:'sticks'},{state:{}},{goal:()=>{}}])ck(pawFortuneWalkPhase(q,{...v,...p})==='cancel','cancel');
q.started=true;ck(pawFortuneWalkPhase(q,{...v,goal:arrive})==='walking','walking');ck(pawFortuneWalkPhase(q,{...v,blocked:true})==='wait','covered');ck(pawFortuneWalkPhase(q,{...v,moving:true})==='wait','moving');ck(pawFortuneWalkPhase(q,v)==='restore','restore number');
return n;`)()+' fortune walk handoff assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_TEMPLE_SCREENSHOT_REPAIR_BEGIN */','/* PAW_TEMPLE_SCREENSHOT_REPAIR_END */')+`let n=0;const ck=(x,m)=>{if(!x)throw Error(m);n++};const p={x:100,y:-145,w:600,h:600*1648/928};for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1280,720]]){let q=pawTempleFullCamera(w,h,p);ck(q.s*p.w+1e-6>=w&&q.s*p.h+1e-6>=h,'full camera');}for(let i=0;i<3;i++)for(let t=0;t<30;t+=.05){let [x,y]=pawGardenWaterPoint(i,t,t);ck(x>=.49&&x<=.65&&y>=.42&&y<=.47,'fish stays in painted water')}return n`)()+' painted temple viewport and garden water coordinate assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_TEMPLE_PHYSICAL_SCENES_BEGIN */','/* PAW_TEMPLE_PHYSICAL_SCENES_END */')+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};let q={drawing:true,stickDrawAt:10};
for(let i=0;i<160;i++){let t=10+i/100,p=pawTempleStickPose(q,t);ck(p.fall>=0&&p.fall<=1,'fall');ck(p.show===(t-10>=.38),'show')}
q={fallenStick:7,stickPicked:true,stickPickAt:10};for(let i=0;i<150;i++){const p=pawTempleStickPose(q,10+i/100);ck(p.pick>=0&&p.pick<=1&&p.fall===1,'pickup')}
for(let i=0;i<450;i++){let m=pawTempleBellMotion({bellAt:10,bellStrength:1},10+i/100);ck(Number.isFinite(m.swing)&&Math.abs(m.swing)<=45&&Math.abs(m.impact)<=.045,'bell')}
return n;`)()+' painted hall stick and bell motion assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_GARDEN_WALK_BEGIN */','/* PAW_GARDEN_WALK_END */')+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const from of Object.values(pawGardenStations))for(const action of Object.keys(pawGardenStations))for(const reduced of [true,false]){
 const q={pos:from.slice(),route:[],last:0};ck(pawGardenRoute(q,action),'route');
 ck(!pawGardenRoute(q,action),'owned route');const before=q.pos.slice();
 pawGardenWalkTick(q,.01,true,reduced);ck(q.pos.every((v,i)=>v===before[i]),'covered');
 let arrive;for(let i=2;i<5000&&!arrive;i++){arrive=pawGardenWalkTick(q,i*.016,false,reduced);ck(q.pos[0]>=.33&&q.pos[0]<=.84&&q.pos[1]>=.54&&q.pos[1]<=.70,'walkway bounds')}
 ck(arrive===action&&q.pos.every((v,i)=>v===pawGardenStations[action][i]),'station arrival');
}
return n;`)()+' garden route and station-arrival assertions');

console.log('PASS: '+new Function(between(source,'/* PAW_TEMPLE_PAPER_ACCESS_BEGIN */','/* PAW_TEMPLE_PAPER_ACCESS_END */')+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(const [stage,expected] of [['folded',['open']],['opening',[]],['open',['keep','tie','rack']],['kept',['return','rack']],['tied',['return','rack']]]){
 const q={paperStage:stage,paperAt:0};ck(JSON.stringify(pawTemplePaperActions(q,1))===JSON.stringify(expected),stage);
 for(const id of ['open','keep','tie','rack','return']){ck(pawTemplePaperAllowed(q,q,'templePaper',1,false,id)===expected.includes(id),'action');ck(!pawTemplePaperAllowed(q,{},'templePaper',1,false,id),'stale');ck(!pawTemplePaperAllowed(q,q,'templePaper',1,true,id),'covered')}
}
ck(pawTemplePaperActions({paperStage:'kept',paperAt:0},.2).length===0,'animation');
return n;`)()+' accessible fortune paper state assertions');

/* Core assessments: execute actual question banks and scoring, not invented
   fixtures. All possible preference and Soul Cat choices preserve ties. */
{
 const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
 const release=fs.readFileSync(path.join(__dirname,'../src/release-fixes.js'),'utf8');
 const take=(str,a,b)=>{const i=str.indexOf(a),j=str.indexOf(b,i+a.length);if(i<0||j<0)throw Error('Missing '+a);return str.slice(i,j)};
 const base=take(ext,'const soulQs=[','let soulResult=')+take(ext,'const wonderTypes=[','const wonderMotives=')+take(ext,'const preferenceExtras=[','let wonderQuestionOrder=')+take(ext,'function prepareWonderQuestions(mode){','function wonderSceneData()')+take(ext,'function scoreWonder(mode,rows,answers){','function wonderSceneFinish(){');
 const bits=take(release,'function releaseAssessmentBalance(mode,result){','const releaseWonderFinish=')+take(release,'const releaseScoreBefore=scoreWonder;','const releaseChartDetailsBefore=')+take(release,'/* PAW_CORE_RESULT_BEGIN */','/* PAW_CORE_RESULT_END */');
 const api=new Function(base+bits+';return {soulQs,prepareWonderQuestions,scoreWonder,releaseAssessmentBalance,pawPreferenceReflection,pawSoulPortrait}')();
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const rows=api.prepareWonderQuestions('type').sort((a,b)=>a.id-b.id);
 for(let mask=0;mask<65536;mask++){
  const answers=rows.map(q=>(mask>>q.id)&1),score=api.scoreWonder('type',rows,answers),balance=api.releaseAssessmentBalance('type',score);
  ok(balance.every((q,i)=>q.first+q.second===4&&q.first===answers.slice(i*4,i*4+4).filter(x=>x===0).length&&!!api.pawPreferenceReflection(i,q.first,q.second)),'Preference count or reflection mismatch');
 }
 const cats=api.prepareWonderQuestions('soul').sort((a,b)=>a.id-b.id);
 for(let mask=0;mask<4096;mask++){
  const answers=cats.map(q=>(mask>>(q.id*2))&3),score=api.scoreWonder('soul',cats,answers),portrait=api.pawSoulPortrait(score,api.soulQs);
  ok(portrait.leaders.map(x=>x.index).sort((a,b)=>a-b).join()===score.ties.join(),'Soul Cat ties misrepresented');
 }
 const motives=api.prepareWonderQuestions('motive');
 for(let v=0;v<3;v++){
  const score=api.scoreWonder('motive',motives,motives.map(()=>v)),balance=api.releaseAssessmentBalance('motive',score);
  ok(balance.flat&&balance.ranked.every(x=>x.score===v*3),'Flat motives assigned a type');
 }
 const invalid=rows.map(q=>({...q,opts:q.opts.map(o=>[...o])}));invalid[0].opts[0][2]=2;
 let rejected=false;try{api.scoreWonder('type',invalid,invalid.map(()=>0))}catch{rejected=true}ok(rejected,'Invalid choice accepted');
 ok(api.releaseAssessmentBalance('type',{scores:[1,2,4,0]})===null,'Malformed preference scores accepted');
 ok(api.pawSoulPortrait({scores:[100,0,0,0,0,0,0,0]},api.soulQs)===null,'Malformed Soul Cat scores accepted');
 console.log('Core preference, motive and Soul Cat assessment checks passed.');
}
