const fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=s.indexOf('/* PAW_ARCADE_INPUT_BEGIN */'),b=s.indexOf('/* PAW_ARCADE_INPUT_END */',a);
if(a<0||b<=a)throw Error('Missing arcade input runtime');
console.log(new Function(s.slice(a,b)+`
let count=0;const ck=(ok,m)=>{if(!ok)throw Error(m);count++};
const q={rhythmStage:'play',rhythmAt:11.8,rhythmFlash:11};
ck(pawArcadeRhythmClock(q,10,false),'initial clock');
pawArcadeRhythmClock(q,10.5,false);ck(q.rhythmAt===11.8,'active clock progresses naturally');
pawArcadeRhythmClock(q,11,true);pawArcadeRhythmClock(q,41,true);
ck(Math.abs(q.rhythmAt-42.3)<.00001,'covered time shifts countdown');
pawArcadeRhythmClock(q,42,false);ck(Math.abs(q.rhythmAt-43.3)<.00001,'resume preserves note time');
pawArcadeRhythmClock(q,43,false);ck(Math.abs(q.rhythmAt-43.3)<.00001,'resumed clock no longer shifts');
ck(!pawRhythmInputAllowed(q,1,42,false),'no countdown miss');
ck(!pawRhythmInputAllowed(q,1,44,true),'covered input rejected');
for(const lane of [-1,4,1.5,NaN,null])ck(!pawRhythmInputAllowed(q,lane,44,false),'invalid lane');
ck(pawRhythmInputAllowed(q,1,44,false),'first note');
ck(!pawRhythmInputAllowed(q,1,44.03,false),'duplicate input ignored');
ck(pawRhythmInputAllowed(q,2,44.03,false),'distinct lane allowed');
ck(pawRhythmInputAllowed(q,1,44.12,false),'later lane allowed');
for(const stage of ['choose','shake','ready','opening','result']){
 ck(pawBlindCanCancel({boxStage:stage},false)===['shake','ready'].includes(stage),'cancel only before purchase');
 ck(!pawBlindCanCancel({boxStage:stage},true),'covered cancel rejected')
}
return 'PASS '+count+' arcade clock, input and pre-purchase cancellation checks';
`)());

const engine=fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8');
const p=engine.indexOf('/* PAW_CANVAS_INPUT_BEGIN */'),q=engine.indexOf('/* PAW_CANVAS_INPUT_END */',p);
if(p<0||q<=p)throw Error('Missing canvas input runtime');
console.log(new Function(engine.slice(p,q)+`
let count=0;const ck=(ok,m)=>{if(!ok)throw Error(m);count++};
const event={pointerId:3,isPrimary:true,button:0},state={coins:0},active={pointerId:3,room:'kitchen',activity:'cook',state,scene:'home'};
ck(pawCanvasCanStart(event,null,false),'primary tap');
ck(!pawCanvasCanStart({...event,isPrimary:false},null,false),'secondary finger');
ck(!pawCanvasCanStart({...event,button:2},null,false),'right click');
ck(!pawCanvasCanStart(event,active,false),'existing drag');
ck(!pawCanvasCanStart(event,null,true),'covered canvas');
ck(pawCanvasOwns(active,event),'same pointer');
ck(!pawCanvasOwns(active,{...event,pointerId:4}),'other finger cannot release');
ck(!pawCanvasOwns(null,event),'missing drag');
ck(pawCanvasSameContext(active,'kitchen','cook',state,'home'),'original activity');
ck(!pawCanvasSameContext(active,'kitchen','cook',{},'home'),'restarted activity');
ck(!pawCanvasSameContext(active,'temple','cook',state,'home'),'room transition');
ck(!pawCanvasSameContext(active,'kitchen','tea',state,'home'),'activity transition');
ck(!pawCanvasSameContext(active,'kitchen','cook',state,'wonder'),'district transition');
return 'PASS '+count+' shared canvas ownership and context checks';`)());
