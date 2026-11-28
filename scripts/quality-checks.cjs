/* Focused logic regressions for canonical MeowBox source.
 * These are deliberately isolated tests; they do not replace browser gameplay
 * or the visual acceptance gates. Source ranges fail loudly if moved. */
module.exports=function runQualityChecks(s,log=console.log){
 const assert=(value,msg)=>{if(!value)throw Error(msg)};
 const range=(a,b)=>{const start=s.indexOf(a),end=s.indexOf(b,start+a.length);assert(start>=0&&end>start,'Missing quality-test range: '+a);return s.slice(start,end)};
 const clamp='const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));';
 const build=(body)=>new Function(clamp+body)();
 const results={};
 // 1. Verify all authored entry, arrival and approach positions are reachable.
 results.indoorRoutes=build(`let room='',activity=null,talkOpen=false,transitioning=false,proposal={hidden:true},avatar=0,t=0;let roomActions={};const hint=()=>{};`+range('const indoorStages=','function markIndoorStation')+`
 let count=0;for(const [id,spec] of Object.entries(indoorStages)){room=id;roomActions[id]=Object.keys(spec.stations).map(k=>[k]);const obs=indoorObstacles();const points=[spec.entry,spec.arrival,...Object.values(spec.stations).map(v=>v.slice(2))];for(const a of points)for(const b of points){if(!indoorPath(a,b,obs))throw Error('Unreachable '+id);count++}}if(indoorPath([NaN,0],[400,615]))throw Error('Accepted corrupt route');return count;`);
 // 2. Outdoor sprite dimensions are bounded on small, tall and wide screens.
 const sizes=build(range('function travellerOutdoorScale(','/* Independently drawn ritual objects')+';return {travellerOutdoorScale,travellerRoomScale}');
 let cases=0;for(const w of [320,390,844,1280,1920])for(const h of [320,640,844,1080])for(const camera of [.1,.4,1,2])for(const player of [true,false]){const v=sizes.travellerOutdoorScale(1.5,camera,w,h,player);assert(Number.isFinite(v)&&v>0&&v*94*camera<=Math.min(player?112:94,h*.25)+1e-6,'Sprite size');cases++}results.spriteSizes=cases;
 // 3. Interim pose geometry remains ordered across action combinations.
 const pose=build(range('function ritualSpritePose(','function drawRitualPose(')+';return ritualSpritePose');
 cases=0;for(const seat of [0,.25,.5,.75,1])for(const kneel of [0,.25,.5,.75,1])for(const bow of [0,.25,.5,.75,1])for(const reach of [null,{x:18,y:-42},{x:100,y:-20}]){const p=pose({seat,kneel,bow},reach);assert(p.hip.y<p.knee.y&&p.knee.y<0&&p.foot.y===0&&Number.isFinite(p.wrist.x)&&Number.isFinite(p.wrist.y),'Pose geometry');cases++}results.poses=cases;
 // 4. Portrait art cannot be selected for landscape crop.
 const wide=build(range('function wideSceneFit(','const landscapeSourceCache')+';return wideSceneFit');
 assert(wide(1600,900,1280,720)&&!wide(800,1400,1280,720)&&!wide(1600,900,390,844)&&!wide(NaN,900,1280,720),'Landscape fit');results.landscape=4;
 // 5. Bilingual identities do not depend on selected avatar.
 const resident=build(range('const paintedResidentNames=','function paintedResidentCell(')+';return paintedResidentIndex');
 for(const [name,expected] of [['Luna',2],['月见',2],['Astrologer',1],['命理师',1],['Grandma',5],['外婆',5],['unknown',-1]])assert(resident(name)===expected,'Resident '+name);results.identities=7;
 // 6. Long and mixed-language text has measured wrapping.
 const wrap=build(range('function shareTextLines(','/* Social cover direction')+';return shareTextLines');const m={measureText:x=>({width:Array.from(x).length*10})};
 const texts=['one two three','supercalifragilistic','小镇MeowBox太好玩啦','你好 world',''];for(const text of texts)assert(wrap(m,text,60).every(v=>m.measureText(v).width<=60),'Text width');results.textWrap=texts.length;
 // 7. Nonordinal answer reordering cannot change type scoring.
 const score=build("const wonderTypes=[['EI'],['SN'],['TF'],['JP']];"+range('function scoreWonder(','function wonderSceneFinish(')+';return scoreWonder');
 const rows=Array.from({length:4},(_,dimension)=>({dimension,opts:[['a','a',1],['b','b',0]]}));
 assert(score('type',rows,[0,1,0,1]).code==='ENTP','Assessment score');let invalid=false;try{score('type',rows,[0,1,0,7])}catch{invalid=true}assert(invalid,'Invalid assessment accepted');results.assessment=2;
 // 8. Cat care eligibility and bounded outcomes.
 const care=build("const careDefaults={hunger:0,thirst:0,happiness:0,trust:0,energy:0};"+range('function careAdjust(','function careIsActive(')+';return {careCan,careOutcome}');
 const cat={hunger:30,thirst:20,happiness:95,trust:95,energy:90};
 assert(care.careCan(cat,'play')&&!care.careCan({...cat,thirst:90},'play')&&!care.careCan(cat,'unknown'),'Cat eligibility');
 const fed=care.careOutcome(cat,'feed');assert(fed.hunger===0&&fed.happiness===100&&fed.trust===100,'Cat bounds');results.catCare=4;
 // 9. Bubble boards retain valid geometry and playable colours.
 results.bubbleBoards=build('let t=0;'+range('const nostalgiaCells=[]','function nostalgiaActive(')+`;for(let i=0;i<100;i++){const g=nostalgiaNew();if(g.board.size!==30||g.remaining!==24||!Array.from(g.board.values()).every(v=>v>=0&&v<4)||!Array.from(g.board.values()).includes(g.color))throw Error('Invalid bubble board')}return 100;`);
 // 10. Route watchdog must never teleport a stalled traveller.
 results.routeWatchdog=build(`let p={x:0,y:0,tx:100,ty:0,motionSpeed:5},doorAttempt=1,room=null,pending='temple',transitioning=false,talkOpen=false,document={hidden:false};let queue=[],stopped=0,entered=0;function $(id){return {style:{display:'none'}}}function setTimeout(fn){queue.push(fn)}function releaseWalkKeys(){}function stopRoute(){pending=null;stopped++}function hint(){}function enter(){entered++}`+range('function monitorDoorRoute(','const walkDoorStable')+`monitorDoorRoute(1,'temple');for(let i=0;i<8;i++){p.x+=2;queue.shift()()}if(stopped)throw Error('Moving route cancelled');document.hidden=true;for(let i=0;i<8;i++)queue.shift()();if(stopped)throw Error('Hidden route cancelled');document.hidden=false;for(let i=0;i<5;i++)queue.shift()();if(stopped!==1||entered!==0||p.tx!==p.x)throw Error('Unsafe route recovery');return 21;`);
 // 11. Standing prayer completes three visible, planted-foot bows.
 const prayer=build(range('function poseEase(','/* Use the actual illustrated side-view')+range('function prayerBowFrame(','function beginQuietBow(')+';return prayerBowFrame');
 for(let i=0;i<3;i++){const low=prayer(i*1.8),deep=prayer(i*1.8+.95),up=prayer(i*1.8+1.79);assert(low.bow<.01&&deep.bow>.99&&up.bow<.01&&deep.completed===i,'Prayer bow '+i);assert(pose({bow:deep.bow,praying:true}).angle>.6,'Visible torso bend')}
 assert(prayer(5.4).completed===3&&prayer(5.4).bow===0,'Prayer finish');results.prayerBows=7;

 // 12. Plaque and name layouts stay inside the screen, avoid occupied rectangles,
 // and never move far enough from the original door to misidentify another shop.
 const placeText=build(range('function meowPlaceText(','let meowTextFrameRects=')+';return meowPlaceText');
 const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
 let placements=0,hidden=0;
 for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390],[1280,720],[1920,1080]]){
  const bounds={left:6,right:width-6,top:Math.min(164,height*.25),bottom:height-100};
  for(const language of ['en','zh'])for(const actorOffset of [-36,0,36]){
   const occupied=[{left:width*.5-26,right:width*.5+26,top:height*.42+actorOffset,bottom:height*.42+actorOffset+90}];
   for(const [fx,fy] of [[.22,.32],[.76,.33],[.24,.51],[.75,.53],[.5,.64]]){
    const x=width*fx,y=height*fy,w=language==='en'?126:90,h=44,maxShift=Math.min(62,width*.16);
    const q=placeText(x,y,w,h,bounds,occupied,maxShift);
    if(!q){hidden++;continue}
    assert(q.rect.left>=bounds.left-1e-6&&q.rect.right<=bounds.right+1e-6&&q.rect.top>=bounds.top-1e-6&&q.rect.bottom<=bounds.bottom+1e-6,'Plaque escapes screen');
    assert(!occupied.some(b=>overlap(b,q.rect)),'Text overlap');
    assert(Math.hypot(q.x-x,q.y-y)<=maxShift+.02,'Plaque moved away from its building');occupied.push(q.rect);placements++;
   }
  }
 }
 assert(placements>0&&hidden>0,'Missing visible/hidden layout coverage');
 assert(!placeText(100,100,60,44,{left:0,right:200,top:0,bottom:200},[{left:0,right:200,top:0,bottom:200}],40),'Fully blocked text must be omitted');
 assert(!placeText(NaN,100,60,44,{left:0,right:200,top:0,bottom:200},[],40),'Invalid text coordinate accepted');
 results.textPlacements=placements;results.textHidden=hidden;

 // 13. Exercise the actual social-card renderer at the four export dimensions.
 const reveal=build(range('function shareTextLines(','/* Social cover direction')+
 "const shareFormats={feed:[1080,1350],xhs:[1080,1440],story:[1080,1920],square:[1080,1080]},shareKinds={tarot:['Tarot reflection','塔罗手记'],type:['Personality portrait','四维性格探索']},tarotDeck=[['Nine of Wands','权杖九','Persistence','坚持'],['Queen of Cups','圣杯皇后','Care','关怀'],['Nine of Cups','圣杯九','Contentment','满足']],pics=new Proxy({},{get:()=>({naturalWidth:350,naturalHeight:238})});class Path2D{constructor(d){this.path=d}}"+range('const socialCatCover=','/* Result-specific editorial copy')+
 range('function shareTarotMood(','function openMeowShare(')+';return {shareCardArt,shareTarotMood,socialLayout}');
 const tarot={kind:'tarot',title:['Three-card reflection','三张牌小记'],lines:[],accent:'#9a8295',cards:[{i:0,rev:false},{i:1,rev:true},{i:2,rev:false}]};
 assert(reveal.shareTarotMood(tarot.cards).title[0].includes('overdue'),'Reported tarot combination');
 const type={kind:'type',title:['INFP','INFP'],lines:[['A person who likes to imagine possibilities and recharge quietly.','喜欢探索各种可能性，也喜欢安静地给自己充电。']],accent:'#829a89',cards:[]};
 let exports=0;
 for(const format of ['feed','xhs','story','square'])for(const cn of [false,true])for(const data of [tarot,type]){
  const cv={};let painted=0,drawn=[],coverPaths=0;
  const g={font:'30px Georgia',textAlign:'center',measureText(v){const fs=Number(this.font.match(/(\\d+)px/)?.[1]||30);return {width:Array.from(v).reduce((sum,ch)=>sum+fs*(/[\\u3400-\\u9fff]/.test(ch)?1:.56),0)}},fillText(v,x,y,max){const fs=Number(this.font.match(/(\\d+)px/)?.[1]||30);const width=Math.min(max??Infinity,this.measureText(v).width);drawn.push({v,x,y,fs,width,align:this.textAlign})},createLinearGradient(){return {addColorStop(){}}},drawImage(){painted++},fill(p){if(p)coverPaths++},stroke(p){if(p)coverPaths++}};
  for(const k of ['fillRect','beginPath','roundRect','rect','save','restore','clip','moveTo','lineTo','translate','scale','rotate','ellipse'])g[k]=()=>{};
  cv.getContext=()=>g;reveal.shareCardArt(cv,data,format,cn);
  const L=reveal.socialLayout(format);assert(cv.width===L.w&&cv.height===L.h,'Share dimensions');
  assert(painted>=1&&drawn.length>=6&&(data.kind==='tarot'?coverPaths>0:painted>=2),'Missing actual cover drawing or result text');
  for(const v of drawn){const lo=v.align==='left'?v.x:v.x-v.width/2,hi=lo+v.width;assert(lo>=0&&hi<=cv.width+.1&&v.y-v.fs/2>=0&&v.y+v.fs/2<=cv.height+.1,'Share text outside export')}
  if(data.kind==='tarot')for(const name of cn?['权杖九','圣杯皇后','圣杯九']:['Nine of Wands','Queen of Cups','Nine of Cups'])assert(drawn.some(v=>v.v.includes(name)),'Missing actual tarot card '+name);
  exports++;
 }
 results.socialExports=exports;

 // 14. Actual board camera stays clear of its compact controls and keeps
 // 44px targets, including phone landscape. Geometry, not DOM screenshots.
 const camera=new Function('W','H',"const activity='woodenThree',room='arcade';"+range('function mobileRoomCamera(','/* Draw compact in-world placards')+';return mobileRoomCamera(1,0,0)');
 let boardFits=0;
 for(const [W,H] of [[320,568],[360,640],[390,844],[430,932],[768,1024],[1280,720],[844,390],[568,320]]){
  const c=camera(W,H),board={left:c.ox+286*c.s,right:c.ox+514*c.s,top:c.oy+388*c.s,bottom:c.oy+616*c.s};
  const controls=H<500&&W>H?{left:W-162,top:H-235,right:W,bottom:H-80}:{left:W/2-155,top:H-189,right:W/2+155,bottom:H};
  assert(!overlap(board,controls)&&board.left>=0&&board.right<=W&&board.top>=0&&board.bottom<=H&&76*c.s>=44,'Tic tac toe layout '+W+'x'+H);boardFits++;
 }
 results.boardFits=boardFits;
 // 15. Passerby timing: short pass does not flash; a sustained encounter
 // fades in, survives boundary oscillation, then fades out.
 const passer=build("let now=0,scene='fortune',p={x:0,y:0};const performance={now:()=>now};"+range('const meowPasserLabels=new WeakMap();','function drawMeowActorName(')+`
 const a={x:100,y:0},step=(ms,x)=>{now+=ms;a.x=x;return meowPasserOpacity(a)};let n=0;
 for(let i=0;i<4;i++){if(step(40,100)!==0)throw Error('Premature passer label');n++}
 step(40,220);if(step(40,220)!==0)throw Error('Short pass flashed');n++;
 for(let i=0;i<14;i++)step(40,100);if(step(40,100)<.95)throw Error('Sustained label failed');n++;
 for(let i=0;i<10;i++)if(step(40,i%2?170:140)<.95)throw Error('Boundary flicker');n+=10;
 for(let i=0;i<15;i++)step(40,260);if(step(40,260)!==0)throw Error('Label did not fade');n++;
 scene='island';if(step(40,100)!==0)throw Error('Map transition stale label');return n+1;`);
 results.passerTiming=passer;
 // 16. Park story is resumable and honours branching choice across visits.
 results.parkSerial=build("let stored=null,date='2026-11-25',room='park',last,friend=0;const day=()=>date,load=(k,d)=>stored??d,save=(k,v)=>{stored={...v}},tr=(a,b)=>a,closeTalk=()=>{},lifeFriend=()=>friend++,say=(speaker,line,opts)=>{last={speaker,line,opts}};"+range('const parkSerials=','const parkGossipAction=')+`
 parkSerialTalk();if(!last.line.includes('bench'))throw Error('Missing episode');
 last.opts[0][1]();if(stored.beat!==1)throw Error('Missing saved beat');
 parkSerialTalk();last.opts[1][1]();if(stored.choice!==1||stored.beat!==2||!last.line.includes('Evidence recovered'))throw Error('Branch not respected');
 parkSerialTalk();last.opts[0][1]();if(stored.beat!==3||friend!==2)throw Error('Completion missing');
 parkSerialTalk();if(stored.episode!==0)throw Error('Same day advanced');
 date='2026-11-26';parkSerialTalk();if(stored.episode!==1||stored.beat!==0)throw Error('Next day not advanced');
 stored={episode:-1,beat:2};if(parkProgress().episode!==0)throw Error('Corrupt progress');return 7;`);
 // 17. Paid draws, unique prizes, daily stock and repeatable town rewards.
 const prizeDefs=range('const boxPrizes=','function boxSelect(')+range('boxPrizes.push(','blindFigureLore.push(');
 const walletDefs=range('function hideoutBalance()','function hideoutThemeUnlocked(')+range('function pawWalletBreakdown()','const receiptWalletBefore=')+range('function blindShopLedger()','function blindShopExplain()')+range('function openPaidBlindBox()','const blindShopStartBefore=')+range('function townPawCategories()','let townPawNoticeTimer=')+range('function furnitureCatalogue()','if(load(\'komorebiLegacyOwnedV1\',null)===null)');
 results.blindBox=build(prizeDefs+`let activity='blindBox',state={boxStage:'ready'},t=0,day='2026-11-26',items=Array.from({length:20},(_,i)=>['earned'+i,'']);const store=new Map(),load=(k,d)=>store.get(k)??d,save=(k,v)=>store.set(k,v),hideoutPurchases=()=>[],dailyWheelRecord=()=>({total:0}),hideoutThemes=[],shrineClock=()=>({day}),addItem=(a,b)=>items.push([a,b]),updateHUD=()=>{},sound=()=>{},blindShopExplain=()=>{},$=()=>({classList:{remove(){}}});`+walletDefs+`
 const assert=(v,m)=>{if(!v)throw Error(m)};
 assert(boxPrizes.length===20&&new Set(boxPrizes.map(v=>v[0])).size===20,'Catalogue');
 const pool=blindUnowned(),seen=new Set();for(let i=0;i<10000;i++)seen.add(blindWeightedPick(pool,()=>(i+.5)/10000).i);
 assert(seen.size===20,'Unreachable collectible');
 assert(hideoutBalance()===200,'Initial balance');assert(openPaidBlindBox()&&hideoutBalance()===160,'Debit');assert(!openPaidBlindBox(),'Duplicate action');
 state.boxStage='ready';assert(openPaidBlindBox(),'Second draw');state.boxStage='ready';assert(openPaidBlindBox(),'Third draw');state.boxStage='ready';assert(!openPaidBlindBox(),'Daily cap');
 assert(hideoutBalance()===80&&new Set(blindShopLedger().map(v=>v.key)).size===3,'Unique charged purchases');
 const missing=blindShopLedger()[0].key;items=items.filter(v=>v[0]!==missing);recoverBlindPurchases();assert(items.some(v=>v[0]===missing)&&hideoutBalance()===80,'Recovery');
 const keys=['round:bubble','kitchen:soup','ritual:prayer','care:Mochi','friend:Mei','release:riverBottle'];for(const key of keys)assert(townPawClaim(key),'Earn '+key);
 assert(townPawToday().earned===40&&hideoutBalance()===120,'Daily earnings included');
 for(const key of [...keys,'round:three','kitchen:tea','friend:Yue','arcade:box','item:paid'])assert(!townPawClaim(key),'Duplicate or spending reward '+key);
 assert(!townPawClaim('round:bubble','2026-11-25'),'Clock rollback');
 day='2026-11-27';assert(blindStockRemaining()===3&&townPawToday().earned===0,'Daily reset');assert(townPawClaim('round:three')&&hideoutBalance()===128,'Next day earnings');
 assert(furnitureCatalogue().length===37,'Furniture catalogue');assert(furnitureOwned('futon')&&furnitureOwned('basicTable')&&furnitureOwned('lamp')&&!furnitureOwned('bed')&&!furnitureOwned('rug'),'Starter ownership');assert(buyFurniture('plant')&&hideoutBalance()===73,'Furniture debit');assert(!buyFurniture('plant'),'Duplicate furniture purchase');assert(!buyFurniture('recordPlayer'),'Insufficient funds');assert(furnitureOwned('plant')&&furniturePurchaseTotal()===55,'Persistent ownership');save('komorebiPurchasesV1',[...furniturePurchaseRecord(),{id:'shelf',cost:55}]);assert(furnitureOwned('shelf')&&furniturePurchaseTotal()===110,'Old purchase price retained');save('komorebiLegacyOwnedV1',['bed']);assert(furnitureOwned('bed'),'Legacy furniture preserved');save('townPawEarnedV1',{day,total:2000,keys:[]});assert(!buyFurniture('roomStudio'),'Expansion order');assert(buyFurniture('roomExtension')&&buyFurniture('roomStudio'),'Expansion purchase');assert(furnitureOwned('roomStudio'),'Expanded ownership');return {reachable:seen.size,earnings:48,purchases:3,furniture:37};`);
 // 18. Inventory catalogue and owned items merge without losing legacy rewards.
 results.bagInventory=build(prizeDefs+"const keepsakes=boxPrizes.map(p=>[p[0],p[1],'cat']);const items=[boxPrizes[0].slice(0,2),['Legacy postcard','旧明信片'],boxPrizes[5].slice(0,2),boxPrizes[0].slice(0,2)];const collectionKind=()=> 'stamp';"+range('function bagClass(','function bagFigureIcon(')+`
 const all=bagEntries();if(all.length!==21||all.filter(v=>v.owned).length!==3)throw Error('Duplicate or missing inventory');
 if(bagClass(items[2])!=='figures'||bagClass(items[1])!=='travel'||bagClass(['Milk tea recipe','奶茶配方'])!=='food')throw Error('Category mismatch');return 6;`);

 // 19. Exercise the live sign synchronization routine with instrumented DOM
 // doubles. Walking past a stationary camera must not mutate plaque positions.
 results.mapSignStability=build(`
 let now=0,scene='fortune',room=null,transitioning=false,avatar=0,quiet9=false,valleyRevealAt=-1,signPress=null,signsForScene=null,zh=false,W=390,H=844,p={x:0,y:0},cam={ox:0,oy:0,scale:1},syncSigns;
 let mutations=0,npc=[],peers=[];const sharedTownActors=()=>peers;const characterScreenBounds=(a,player)=>({left:cam.ox+a.x*cam.scale-24,right:cam.ox+a.x*cam.scale+24,top:cam.oy+a.y*cam.scale-76,bottom:cam.oy+a.y*cam.scale+8});const signButtons=new Map(),proposal={hidden:true},signRoot={hidden:true,classList:{remove(){}},replaceChildren(){},getBoundingClientRect(){return {left:0,top:0}}};
 const performance={now:()=>now},document={querySelectorAll:()=>[]},$=()=>({hidden:true,style:{display:'none'}}),tr=(a,b)=>zh?b:a,houseSignMaterial=()=> 'wood',directSignClick=()=>{};
 const maps=Object.fromEntries(['fortune','home','island','wonder'].map(k=>[k,{st:[['a',100,365,'Tea room','茶馆'],['b',290,445,'Park','公园'],['c',110,625,'Arcade','游戏厅']]}]));
 const signAnchorsProposal={};const speechOverlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
 function element(tag,label,parent,cls){if(tag==='span'){const child={textContent:''};parent.plaque=child;return child}let hidden=false;const style=new Proxy({setProperty(){}},{set(o,k,v){if(o[k]!==v)mutations++;o[k]=v;return true}});
 const node={style,dataset:{},offsetWidth:90,offsetHeight:44,attrs:{},querySelector:()=>node.plaque,replaceChildren(){node.plaque=null},setAttribute(k,v){node.attrs[k]=v},getAttribute(k){return node.attrs[k]}};Object.defineProperty(node,'hidden',{get:()=>hidden,set:v=>{if(v!==hidden)mutations++;hidden=v}});return node}
 `+range('function meowPlaceText(','let meowTextFrameRects=')+range('function housePlaqueAnchor(','function pearlTeaJars(')+range('let lastDoorLayoutAt=','/* Recurring villagers remember')+`
 let checks=0;
 for(const k of ['fortune','home','island','wonder']){
 scene=k;for(let i=0;i<8;i++){now+=40;syncSigns()}
 if(signButtons.size!==3||[...signButtons.values()].some(v=>v.hidden))throw Error('Missing map signs '+scene);
 const before=mutations;for(let i=0;i<40;i++){now+=40;p.x=10+i*.4;p.y=20+i*.2;syncSigns()}
 if(mutations!==before)throw Error('Stationary plaques moved while walking '+scene);checks+=40;
 // A passerby actually crossing a plaque must never cover its touch target.
 // Hiding the sign temporarily is legitimate; drifting far from the house is not.
 const a=signButtons.get('a'),x=parseFloat(a.style.left),y=parseFloat(a.style.top);
 for(const actors of ['local','shared']){
  const walker={x,y:y+22};npc=actors==='local'?[walker]:[];peers=actors==='shared'?[walker]:[];
  for(let i=0;i<8;i++){now+=40;syncSigns();for(const btn of signButtons.values()){
   if(btn.hidden)continue;const bx=parseFloat(btn.style.left),by=parseFloat(btn.style.top),body=characterScreenBounds(walker,false);
   const rect={left:bx-btn._signSize[0]/2,right:bx+btn._signSize[0]/2,top:by-btn._signSize[1]/2,bottom:by+btn._signSize[1]/2};
   if(speechOverlap(rect,body))throw Error('Sign overlaps '+actors+' actor in '+scene);
   if(!btn._signOffset||Math.hypot(btn._signOffset.x,btn._signOffset.y)>Math.min(62,W*.16)+.02)throw Error('Sign drifts away from its door');
  }checks++}
  npc=[];peers=[];for(let i=0;i<8;i++){now+=40;syncSigns()}
  if([...signButtons.values()].some(v=>v.hidden))throw Error('Sign failed to recover after actor left '+scene);
 }
 zh=!zh;now+=40;syncSigns();if([...signButtons.values()].some(v=>v.plaque.textContent!==tr(...maps[scene].st.find(d=>d[0]===v.dataset.door).slice(3))))throw Error('Language update failed');
 checks++;
 }return checks;`);
 // 20. Deer encounters use stable daily identities, safe saved records and once-daily care.
 results.deerMeadow=build(`let activity='deerVisit',t=0,day='2026-11-26',state={deerPhase:'greet'},awards=0,postcards=0;const store=new Map(),load=(k,d)=>store.get(k)??d,save=(k,v)=>store.set(k,v),shrineClock=()=>({day}),hash=s=>Array.from(s).reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0),addItem=()=>postcards++,lifeEarn=()=>awards++,refreshControls=()=>{},hint=(...lines)=>{if(lines.length!==2||lines.some(v=>typeof v!=='string'||!v.trim()))throw Error('Invalid deer reaction')},townDailySeed='quality-check';`+range('const townReactionCursor=','const auntieHitReplies=')+range('const deerProfiles=','const deerStartBefore=')+`
 const ok=(x,m)=>{if(!x)throw Error(m)};
 state.deerProfile=deerForDay(day);ok(deerForDay(day)===state.deerProfile,'Daily identity');ok(deerVisitRecord({day:'invalid',fed:true,met:['mugi','mugi','unknown']}).fed===false,'Invalid record');ok(deerVisitRecord({met:['mugi','mugi','unknown']}).met.length===1,'Valid memory IDs');
 deerBow();ok(state.deerPhase==='bow','Bow state');deerFeed();ok(state.deerPhase==='bow','Cannot interrupt bow');state.deerPhase='ready';deerFeed();ok(state.deerPhase==='feed','Feed state');deerVisitReward();ok(state.deerPhase==='done'&&deerVisitRecord().fed&&postcards===1,'Feed completion');deerVisitReward();ok(postcards===1&&awards===1,'No duplicate reward');
 day='2026-11-27';state.deerPhase='watch';deerVisitReward(false);ok(!deerVisitRecord().fed,'Observation does not consume cracker');state.deerPhase='ready';deerFeed();ok(state.deerPhase==='feed','Can feed after watching');return 10;`);
 log('PASS: MeowBox isolated quality checks '+JSON.stringify(results));return results
};
