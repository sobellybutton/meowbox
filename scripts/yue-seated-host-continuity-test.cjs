'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const a=src.indexOf('/* PAW_YUE_SEATED_CONTINUITY_BEGIN */'),b=src.indexOf('/* PAW_YUE_SEATED_CONTINUITY_END */');
assert.ok(a>=0&&b>a);
const api=new Function(src.slice(a,b)+';return {pawReadingVisitPhase,pawReadingVisibleRect}')();
const plan=new Function(src.slice(src.indexOf('function pawReadingSeatPlan'),src.indexOf('function pawReadingHostPhase'))+';return pawReadingSeatPlan')();
const host=require('../assets/visual/painted/reading-host-framing.js');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/visual/painted/host-pose-candidates.json'),'utf8'));
let checks=0;
for(const id of ['destiny','tarot','tea'])for(const ready of [false,true])for(const idleReady of [false,true])for(const phase of ['idle','question','result','focus']){
 const visit={id,ready,idleReady};
 assert.equal(api.pawReadingVisitPhase(visit,id,phase),ready?phase:['destiny','tarot'].includes(id)&&idleReady?'idle':null);checks++;
}
assert.equal(api.pawReadingVisitPhase({id:'tarot',ready:true},'destiny','result'),null);
for(const h of [275,550,1100])for(const phase of ['idle','question','result']){
 const p={x:20,y:30,w:h*928/1648,h},q=plan('destiny',p,phase),f=host.contacts(manifest,q.host,q.pose,q.center,q.span),r=api.pawReadingVisibleRect(f,manifest.characters[q.host].poses[q.pose].visibleAlphaBounds,q.clip);
 assert.ok(r&&r.bottom<=p.y+p.h*.306+1e-8&&r.top<q.center[1]&&r.left<q.center[0]&&r.right>q.center[0]);
 assert.ok(Math.abs(q.span-h*.017)<1e-8);
 checks++;
}
assert.equal(api.pawReadingVisibleRect({point:(x,y)=>[x,y]},[0,0,10,10],[20,20,5,5]),null);
assert.equal(api.pawReadingVisibleRect({point:(x,y)=>[x,y]},[0,0,10,10],[2,3,5,6]).bottom,9);
assert.ok(src.includes("idleReady:pawReadingIdleReady(id)"));
assert.ok(src.includes("const selected=pawReadingVisitPhase(pawHostVisit,id,phase)"));
assert.ok(src.includes("if(id==='destiny'&&phase==='result'&&grid)"));
console.log('Master Yue seated visit admission and visible silhouette: '+checks+' cases passed');
