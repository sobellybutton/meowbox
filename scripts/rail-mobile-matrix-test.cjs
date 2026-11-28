'use strict';
const {chromium,webkit,firefox}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const profiles={
 'android-compact':{engine:'chromium',width:360,height:640,dpr:2},
 'android-tall':{engine:'chromium',width:393,height:873,dpr:2.75},
 'android-large':{engine:'chromium',width:412,height:915,dpr:3},
 'android-samsung-size':{engine:'chromium',width:384,height:854,dpr:3},
 'ios-compact':{engine:'webkit',width:320,height:568,dpr:2},
 'ios-tall':{engine:'webkit',width:390,height:844,dpr:3},
 'ios-large':{engine:'webkit',width:430,height:932,dpr:3},
 'android-firefox-size':{engine:'firefox',width:360,height:800,dpr:2},
 'touch-tablet':{engine:'webkit',width:768,height:1024,dpr:2}
};
const name=process.env.RAIL_PROFILE||'android-tall',p=profiles[name];
if(!p)throw Error('Unknown profile '+name);
const engine={chromium,webkit,firefox}[p.engine],base=process.env.RAIL_URL||'http://127.0.0.1:8771/';
const output='test-results/rail-mobile/'+name;
const visibleStation='.pawRailEdge:visible,button[data-door=station]:visible';
const routes=['home','island','wonder','fortune'];
// Resolve the physical plaque/edge handoff using ordinary touch. A locator
// that was visible at lookup can disappear while the camera settles after
// rotation. Never force a tap, inject a route, or bypass the railway.
// Keep actionable hit-test evidence when neither affordance can be used.
async function approachStation(page,records,leg){
 await page.waitForFunction(()=>proposal.hidden&&!transitioning&&!room&&!activity&&!pending&&!signRoot.hidden,null,{timeout:30000});
 const before=await page.evaluate(()=>({scene,x:p.x,y:p.y,near:pawRailNearStation(p,maps[scene].st.find(v=>v[0]==='station'))}));
 if(!before.near){
  assert.equal(await page.locator(visibleStation).count(),0,'Distant railway label should not preempt exploration');
  // Walk by real touch on the painted path. Read only camera and route
  // geometry; do not set player coordinates, keys, pending or route state.
  const samples=[],deadline=Date.now()+55000;
  while(Date.now()<deadline){
   const view=await page.evaluate(()=>{
    const station=maps[scene].st.find(v=>v[0]==='station'),points=pawDistrictSpines[scene],rect=$('c').getBoundingClientRect();
    const near=pawRailNearStation(p,station),direction=Math.sign(station[2]-p.y)||-1;
    const candidates=[];
    if(!near&&points&&cam.scale>0&&!pending&&!transitioning&&!room&&!activity&&!talkOpen){
     for(const distance of [180,140,100,70,40]){
      const y=Math.max(minY(),Math.min(maxY(),p.y+direction*distance)),lane=pawStairLane(y,points);
      for(const offset of [0,-.32,.32,-.7,.7]){
       const x=lane.x+lane.half*offset,sx=rect.left+cam.ox+x*cam.scale,sy=rect.top+cam.oy+y*cam.scale;
       if(sx<rect.left+8||sx>rect.right-8||sy<rect.top+8||sy>rect.bottom-8)continue;
       if(document.elementFromPoint(sx,sy)!==$('c'))continue;
       // A canvas point can still be an invisible door or resident hit area.
       // Only an actual unoccupied path tap counts as walking.
       if(at({x,y}))continue;
       // A resident can move between browser evaluation and the physical
       // tap. Reserve a small world-space margin around all existing hit
       // rectangles and the current residents' body/chat envelopes.
       if(hit.some(h=>x>=h.x-18&&x<=h.x+h.w+18&&y>=h.y-18&&y<=h.y+h.h+18))continue;
       if(npc.some(n=>Math.abs(x-n.x)<68&&y>=n.y-150&&y<=n.y+25))continue;
       if(Math.abs(y-p.y)<18)continue;
       candidates.push({sx,sy,x,y});
      }
     }
    }
    return {scene,x:p.x,y:p.y,near,pending,room,activity,talkOpen,transitioning,candidates};
   });
   samples.push({...view,candidates:view.candidates.slice(0,2)});
   if(view.scene!==before.scene||view.room||view.activity||view.pending||view.talkOpen){records.push({approachTrace:leg,samples});throw Error('Unexpected interaction during station approach: '+JSON.stringify(view))}
   if(view.near)break;
   const target=view.candidates[0];
   if(!target){await page.waitForTimeout(180);continue}
   await page.touchscreen.tap(target.sx,target.sy);
   await page.waitForTimeout(450);
   await page.waitForFunction(v=>Math.abs(p.y-v.y)>15||!!pending||!!room||!!activity||pawRailNearStation(p,maps[scene].st.find(s=>s[0]==='station')),view,{timeout:2500}).catch(()=>{});
  }
  records.push({approachTrace:leg,samples});
  const reached=await page.evaluate(()=>pawRailNearStation(p,maps[scene].st.find(v=>v[0]==='station')));
  assert(reached,'Real touch walking did not reach station: '+JSON.stringify(samples.slice(-4)));
 }
 const after=await page.evaluate(()=>({x:p.x,y:p.y,near:pawRailNearStation(p,maps[scene].st.find(v=>v[0]==='station'))}));
 assert(after.near,'Traveller must approach the station before boarding');
 if(!before.near)assert(after.y<before.y,'Traveller must actually walk up the district');
 records.push({approachLeg:leg,before,after});
}
async function tapReachableStation(page,records,leg){
 const deadline=Date.now()+15000,samples=[],origin=leg===0?'fortune':routes[leg-1];
 let attempts=0;
 while(Date.now()<deadline){
  const state=await page.evaluate(()=>{
   const g=document.querySelector('#game')?.getBoundingClientRect();
   const candidates=[...document.querySelectorAll('.pawRailEdge,button[data-door="station"]')].map(el=>{
    const r=el.getBoundingClientRect(),style=getComputedStyle(el),x=r.left+r.width/2,y=r.top+r.height/2;
    const inside=!!g&&r.width>0&&r.height>0&&r.left>=g.left-1&&r.right<=g.right+1&&r.top>=g.top-1&&r.bottom<=g.bottom+1;
    const hit=inside?document.elementFromPoint(x,y):null;
    return {edge:el.classList.contains('pawRailEdge'),hidden:el.hidden,display:style.display,visibility:style.visibility,rect:[r.left,r.top,r.width,r.height],point:[x,y],hit:hit?.className?.baseVal||String(hit?.className||''),ready:!el.hidden&&!el.disabled&&style.display!=='none'&&style.visibility==='visible'&&inside&&!!hit&&el.contains(hit)};
   });
   return {scene,pending,transitioning,ride:!!document.querySelector('.pawRailJourney'),candidates};
  });
  if(samples.length<80)samples.push(state);
  if(state.ride||state.pending==='station'||state.transitioning&&attempts>0){
   records.push({stationLeg:leg,origin,attempts,accepted:state,samples});return;
  }
  // If a touch already changed the scene, never tap the next station.
  // Non-reduced rides must still be observed by the caller's strict checks.
  if(state.scene!==origin){
   records.push({stationLeg:leg,origin,attempts,unexpectedScene:state.scene,samples});
   throw Error('Station touch changed district before its ride was observed: '+origin+' -> '+state.scene);
  }
  const candidate=state.candidates.find(v=>v.ready);
  if(candidate&&!state.transitioning&&!state.pending){
   // Real browser touch at the currently hit-tested target; unlike locator
   // stability polling this never waits for the animated map to stop moving.
   await page.touchscreen.tap(...candidate.point);attempts++;
   await page.waitForTimeout(120);
  }else await page.waitForTimeout(100);
 }
 records.push({stationLeg:leg,origin,attempts,failure:'No accepted railway touch',samples});
 throw Error('No accepted railway touch for leg '+leg+'; last state '+JSON.stringify(samples.at(-1)));
}
async function main(){
 fs.mkdirSync(output,{recursive:true});
 const browser=await engine.launch();
 const context=await browser.newContext({viewport:{width:p.width,height:p.height},deviceScaleFactor:p.dpr,hasTouch:true,...(p.engine==='firefox'?{}:{isMobile:true}),locale:'en-SG',reducedMotion:'no-preference'});
 const page=await context.newPage(),errors=[],records=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(r.status()+' '+r.url())});
 const tap=loc=>loc.tap({timeout:15000});
 const shot=id=>page.screenshot({path:output+'/'+id+'.png'});
 try{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await tap(page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}));
  await tap(page.locator('#proposal footer button.next'));
  await page.locator('#proposal .rail-ticket input').fill('Rail Tester');
  await tap(page.locator('#proposal .ticket-confirm'));
  await tap(page.locator('#proposal footer button.next'));
  await tap(page.locator('#proposal footer .actions button').first());
  // The first train can auto-arrive; proceed through the actual visible controls.
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({state:'visible',timeout:45000});
  if(await skip.isVisible())await tap(skip);
  await tap(gate);
  await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:45000});
  await shot('first-map');
  for(let i=0;i<routes.length;i++){
   // First and second journeys exercise portrait and landscape. Third uses
   // reduced motion and the fourth returns via the actual visible skip button.
   const landscape=i===1;
   await page.setViewportSize(landscape?{width:p.height,height:p.width}:{width:p.width,height:p.height});
   await page.emulateMedia({reducedMotion:i===2?'reduce':'no-preference'});
   await approachStation(page,records,i);
   await tapReachableStation(page,records,i);
   const ride=page.locator('.pawRailJourney');
   await ride.waitFor({state:'visible',timeout:45000});
   const expected=await page.evaluate(id=>maps[id].n[0],routes[i]);
   assert.equal(await ride.locator('.pawRailCaption strong').innerText(),expected);
   const shell=await ride.evaluate(el=>{const r=el.getBoundingClientRect(),g=document.querySelector('#game').getBoundingClientRect();return Math.abs(r.width-g.width)<3&&Math.abs(r.height-g.height)<3});
   assert(shell,'Ride must fill actual game viewport');
   const sample=()=>ride.evaluate(el=>{const s=el.querySelector('.mbPaintedRail'),c=el.querySelector('canvas.pawPaintedRailComposite');if(!s||!c)return null;const r=el.getBoundingClientRect(),b=c.getBoundingClientRect();return {layout:s.dataset.layout,motion:s.dataset.railMotion,frame:Number(c.dataset.frame),travel:Number(c.dataset.travel),duration:Number(c.dataset.rideDuration),cover:b.left<=r.left+3&&b.top<=r.top+3&&b.right>=r.right-3&&b.bottom>=r.bottom-3,ratio:b.width/b.height,sourceRatio:c.width/c.height}});
   if(i===2){
    // Short reduced-motion ride: capture the still composite if available.
    const still=await sample().catch(()=>null);
    if(still){assert.equal(still.motion,'still');assert.equal(still.travel,0);records.push({route:routes[i],still});}
    else records.push({route:routes[i],still:'short ride; composite not captured'});
   }else{
    await ride.locator('canvas.pawPaintedRailComposite').waitFor({state:'visible',timeout:3000});
    const first=await sample();assert(first&&first.cover,'Native canvas coverage');
    assert.equal(first.layout,landscape?'landscape':'portrait');
    assert(Math.abs(first.ratio-first.sourceRatio)<.025,'Carriage must not stretch');
    assert(first.duration>0,'Finite runtime braking duration missing');
    if(i!==3){
     await page.waitForFunction(n=>Number(document.querySelector('.pawRailJourney canvas.pawPaintedRailComposite')?.dataset.frame)>n+2,first.frame,{timeout:1800});
     const next=await sample();assert(next.travel>first.travel,'Travel time did not advance');
     records.push({route:routes[i],first,next});
     await shot('ride-'+routes[i]);
    }else{
     records.push({route:routes[i],first,skip:true});
     await tap(ride.locator('.pawRailSkip'));
    }
   }
   await ride.waitFor({state:'detached',timeout:20000});
   await page.waitForFunction(id=>scene===id&&!transitioning,routes[i],{timeout:10000});
   assert.equal(await page.locator('.pawRailJourney canvas').count(),0,'Leaked ride canvas');
   await shot('arrival-'+routes[i]);
  }
  assert.deepEqual(errors,[]);
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{
  fs.writeFileSync(output+'/evidence.json',JSON.stringify({profile:name,engine:p.engine,browserVersion:browser.version(),profileType:'simulated browser profile, not physical hardware or branded mobile browser',screen:p,build:process.env.GITHUB_SHA||'local',records,errors},null,2));
  await browser.close();
 }
}
main().catch(e=>{console.error(e);process.exitCode=1});
