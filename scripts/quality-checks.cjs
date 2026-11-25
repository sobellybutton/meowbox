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
 log('PASS: MeowBox isolated quality checks '+JSON.stringify(results));return results
};
