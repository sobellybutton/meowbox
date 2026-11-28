const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {attachFrameAudit}=require('./paw-frame-audit.cjs');

async function travelLoop(page,name,touch){
 const failures=[];
 const frameAudit=await attachFrameAudit(page,'test-results',name+'-organic');
 page.on('pageerror',error=>failures.push(error.message));
 page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))failures.push(m.text())});
 page.on('response',r=>{
  if(r.status()>=400&&new URL(r.url()).origin==='http://127.0.0.1:8768')failures.push(r.status()+' '+r.url());
 });
 const press=locator=>touch?locator.tap({timeout:12000}):locator.click({timeout:12000});
 const shot=async id=>{await page.screenshot({path:'test-results/'+name+'-district-'+id+'.png'});await frameAudit.flush(id)};
 async function point(x,y){
  const rect=await page.locator('canvas#cv,canvas#c,#game canvas').first().boundingBox();
  if(!rect)throw Error('Game canvas unavailable');
  if(touch)await page.touchscreen.tap(x+rect.x,y+rect.y);
  else await page.mouse.click(x+rect.x,y+rect.y);
 }
 async function enterDoor(id){
  const sign=page.locator('#worldSigns [data-door="'+id+'"]');
  // A full-length painted district can require more than five walking
  // steps. Keep real joystick/keyboard input and require actual progress.
  for(let walks=0;walks<15&&!await sign.isVisible();walks++){
   const {direction,from,distance}=await page.evaluate(id=>{
    const row=maps[scene].st.find(v=>v[0]===id);
    const goal=Math.max(minY(),Math.min(maxY(),row[2]));
    const delta=goal-p.y;
    return {direction:Math.sign(delta)||-1,from:p.y,distance:Math.max(18,Math.min(160,Math.abs(delta)))};
   },id);
   const waitForWalk=()=>page.waitForFunction(({direction,from,id,distance})=>direction*(p.y-from)>=distance-3||!signButtons.get(id)?.hidden,{direction,from,id,distance},{timeout:10000});
   if(touch){
    await page.locator('#movePad').waitFor();
    const box=await page.locator('#movePad').boundingBox();
    const session=await page.context().newCDPSession(page);
    try{
     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2+direction*23}]});
     await waitForWalk();
    }finally{
     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
     await session.detach();
    }
   }else{
    const key=direction<0?'ArrowUp':'ArrowDown';
    await page.keyboard.down(key);
    try{await waitForWalk();}finally{await page.keyboard.up(key);}
   }
  }
  if(!await sign.isVisible()){
   const detail=await page.evaluate(id=>{
    const row=maps[scene].st.find(v=>v[0]===id),btn=signButtons.get(id);
    return {scene,player:[p.x,p.y],approach:row.slice(1,3),anchor:housePlaqueAnchor(scene,id,row[1],row[2]),camera:{scale:cam.scale,ox:cam.ox,oy:cam.oy},viewport:[W,H],hidden:btn?.hidden,size:btn?._signSize,offset:btn?._signOffset};
   },id);
   throw Error('Doorway plaque unreachable by actual walking: '+id+' '+JSON.stringify(detail));
  }
  await press(sign);
  if(id==='temple'){
   // One doorway tap must initiate the walk without a second hall tap.
   await page.waitForFunction(()=>room==='temple'&&!transitioning&&(activity==='templeForecourt'||(!activity&&continuityRoom==='temple')),null,{timeout:21000});
   if(await page.evaluate(()=>activity==='templeForecourt'))await shot('temple-forecourt');
  }
  await page.waitForFunction(id=>room===id&&!activity&&!transitioning&&continuityRoom===id&&Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<4,id,{timeout:21000});
  assert(await page.evaluate(()=>indoorSafe(indoor.x,indoor.y)),'Arrival is outside walkable floor');
  // Inspect actual rendered room actors, not an artificial guest count.
  const visitors=await page.evaluate(()=>{
   const reserved=pawGuestProtected(),stations=pawGuestActiveFeet(),obs=indoorObstacles(),gap=pawMappedGuestGaps(pawReadingActive()).station;
   return pawLocalVisitors.map(a=>{
    const transit=a.phase==='arriving'||a.phase==='departing';
    return {id:a.id,phase:a.phase,gap,clear:pawGuestClear(a.x,a.y,transit?stations:reserved,gap),safe:indoorSafe(a.x,a.y,obs),duplicate:!!a.guest&&npc.some(n=>n.popGuest===a.guest.id)}
   })
  });
  assert(visitors.every(a=>a.clear&&a.safe&&!a.duplicate),'Room visitor blocked a station, floor or existing identity: '+JSON.stringify(visitors));
  assert.equal(new Set(visitors.map(a=>a.id)).size,visitors.length,'Duplicate indoor visitor IDs');
  await shot(id);
 }
 async function station(id){
  const target=await page.waitForFunction(id=>{
   const h=hit.find(t=>t.stationId===id);
   if(h)return [cam.ox+(h.x+h.w/2)*cam.scale,cam.oy+(h.y+h.h/2)*cam.scale];
  },id);
  await point(...await target.jsonValue());
 }
 async function backOutside(){
  if(await page.locator('#page').isVisible())await press(page.locator('#content .row button').first());
  if(await page.locator('#page').isVisible())await press(page.locator('#content .row button').first());
  if(await page.locator('#dialogue').isVisible()){
   const done=await page.evaluate(()=>[...document.querySelectorAll('#choices button')].at(-1)?.textContent);
   if(done)await press(page.locator('#choices').getByRole('button',{name:done,exact:true}));
  }
  if(await page.evaluate(()=>!!activity)){
   await press(page.locator('#back'));
   await page.waitForFunction(()=>!!room&&!activity);
  }
  await press(page.locator('#back'));
  await page.waitForFunction(()=>!room&&!transitioning);
 }
 await page.goto('http://127.0.0.1:8768/index.html');
 await press(page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}));
 await press(page.locator('#proposal footer button.next'));
 await page.locator('#proposal .rail-ticket input').fill('June');
 await press(page.locator('#proposal .ticket-confirm'));
 await press(page.locator('#proposal footer button.next'));
 await press(page.locator('#proposal footer .actions button').first());
 const layout=touch?'portrait':'landscape';
 await page.locator('#proposal .rail-cabin .mbPaintedRail[data-layout="'+layout+'"]:visible').waitFor();
 const glass=page.locator('#proposal .mbPaintedRail :is(.pawMovingGlass,.pawPaintedRailComposite)');
 await glass.waitFor({state:'visible',timeout:5000});
 const firstFrame=Number(await glass.getAttribute('data-frame'));
 await page.waitForFunction(n=>Number(document.querySelector('#proposal .mbPaintedRail :is(.pawMovingGlass,.pawPaintedRailComposite)')?.dataset.frame)>n,firstFrame,{timeout:3000});
 if(await glass.evaluate(el=>el.classList.contains('pawMovingGlass')))assert(await glass.evaluate(el=>{const p=el.getContext('2d').getImageData(0,0,1,1).data;return p[3]===0}),'Carriage foreground must remain transparent in moving layer');
 await shot('train');
 await press(page.locator('#proposal .rail-arrive'));
 await page.locator('#proposal .mbGatePainting:visible').waitFor();
 await shot('gate');
 await press(page.locator('#proposal .shrine-enter'));
 await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0);
 await press(page.locator('#dockTravel'));
 const local=page.locator('.pawSketchPlaces');await local.waitFor();
 assert.equal(await local.locator('.pawSketchGo').count(),await page.evaluate(()=>maps[scene].st.filter(v=>v[0]!=='station').length));
 await shot('local-map-guide');
 await press(local.locator('.pawSketchPlace').filter({has:page.getByText('Moonlight Tarot',{exact:true})}).getByRole('button',{name:'Visit ›',exact:true}));
 await page.waitForFunction(()=>room==='tarot'&&!transitioning&&continuityRoom==='tarot'&&Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<4,null,{timeout:21000});
 await shot('tarot');
 await station('tarot');
 await page.locator('#choices').getByRole('button',{name:/Daily guidance/}).waitFor();
 assert.equal(await page.evaluate(()=>playerName),'June','Selected name persists');
 assert((await page.locator('#line').innerText()).trim().length>0,'Reading has a contextual opening');
 await press(page.locator('#choices').getByRole('button',{name:/Daily guidance/}));
 await page.waitForFunction(()=>activity==='tarot'&&pawTarotFanSettled(state,t,residentReducedMotion.matches));
 assert.equal(await page.locator('#hud').isVisible(),false,'Room hides profile and coins');
 assert.equal(await page.locator('#small').isVisible(),false,'Room hides settings');
 const chosenCard=await page.waitForFunction(()=>{
  const h=hit.find(v=>v.id==='paw-pick-card-7');
  if(!h||!pawTarotFrameMatches(state,state.pawChoiceFrame,W<H))return false;
  const p={x:h.x+h.w/2,y:h.y+h.h/2};
  if(at(p)!==h)return false;
  return {point:[cam.ox+p.x*cam.scale,cam.oy+p.y*cam.scale],value:state.pawCardPool[7]}
 });
 const chosen=await chosenCard.jsonValue();
 await point(...chosen.point);
 await page.waitForFunction(()=>state.readStage==='cards');
 assert.deepEqual(await page.evaluate(()=>state.readCards[0]),chosen.value,'Reading must use the exact chosen card');
 await backOutside();
 await enterDoor('temple');
 // Validate the active painted hall or fallback registration against its own obstacles.
 const approaches=await page.evaluate(()=>{
  const spec=indoorSpec(),obstacles=indoorObstacles();
  return {painted:pawHallEnabled(),stations:Object.entries(spec.stations).map(([id,v])=>({
   id,point:v.slice(2,4),safe:indoorSafe(v[2],v[3],obstacles),
   reachable:!!indoorPath([indoor.x,indoor.y],v.slice(2,4),obstacles)
  }))};
 });
 assert.deepEqual(approaches.stations.map(s=>s.id).sort(),['moon','prayer','secretGarden','sticks','templeBell','templeWater'].sort(),'All six temple stations must remain available');
 assert(approaches.stations.every(s=>s.safe&&s.reachable),'Temple station approach failure: '+JSON.stringify(approaches));
 await shot('temple-sanctuary');
 await backOutside();
 await enterDoor('wishes');
 await station('coin');
 const garden=page.locator('#content .pawWishGarden');
 await garden.waitFor();
 assert(await garden.evaluate(el=>{const r=el.getBoundingClientRect(),g=document.querySelector('#game').getBoundingClientRect();return r.width>=g.width-2&&r.height>=g.height-2}),'Garden must fill the game viewport');
 assert(await page.locator('.pawGardenFooter').isVisible(),'Wishing controls belong to the garden');
 await shot('wishing-garden');
 await backOutside();
 await enterDoor('destiny');
 await station('destiny');
 await press(page.getByRole('button',{name:'My birth chart',exact:true}));
 await press(page.getByRole('button',{name:'For me',exact:true}));
 // Native consultation: each question is spoken by Yue, not displayed in
 // a second page. Complete the real inputs and verify the chart and exit.
 const birth=page.locator('#choices .pawDeskField input[type=date]');
 await birth.waitFor({state:'visible'});
 assert.equal(await page.locator('#page').isVisible(),false,'Birth question opened a separate page');
 assert.equal(await page.locator('.astroForm').isVisible(),false,'Old birth form must not cover the study');
 assert.equal(await page.evaluate(()=>room),'destiny');
 await shot('yue-desk');
 await birth.fill('1990-06-15');
 await press(page.locator('#choices').getByRole('button',{name:'Continue',exact:true}));
 const birthTime=page.locator('#choices .pawDeskField input[type=time]');
 await birthTime.waitFor({state:'visible'});
 assert.equal(await page.locator('#page').isVisible(),false);
 await birthTime.fill('12:30');
 await press(page.locator('#choices').getByRole('button',{name:'Continue',exact:true}));
 const place=page.locator('#choices .pawDeskField select');
 await place.waitFor({state:'visible'});
 assert.equal(await place.inputValue(),'','Birthplace must not be assumed');
 await place.selectOption('0');
 await press(page.locator('#choices').getByRole('button',{name:'Continue',exact:true}));
 await press(page.locator('#choices').getByRole('button',{name:'Yes, use these details',exact:true}));
 await page.locator('.chartConsultation').waitFor({state:'visible'});
 assert.equal(await page.locator('.ziGrid article:not(.blank)').count(),12,'The chart must contain twelve palaces');
 assert.equal(await page.locator('#page').getAttribute('data-paw-yue-desk'),'true','Consultation result stays anchored to the study');
 assert.equal(await page.evaluate(()=>room),'destiny');
 assert(await page.evaluate(()=>!JSON.stringify(localStorage).includes('1990-06-15')),'Private birth data must not persist');
 await shot('yue-chart');
 await press(page.locator('.pawYueResultNav').getByRole('button',{name:'Return to room',exact:true}));
 await page.waitForFunction(()=>room==='destiny'&&!activity&&document.getElementById('page').style.display==='none');
 await backOutside();

 for(const [district,doors] of [['home',['fish']],['island',['boba','arcade']],['wonder',['quiz','story','match']],['fortune',[]]]){
  assert.equal(await page.locator('#nextStopShortcut').isVisible(),false,'No permanent next-stop shortcut');
  await press(page.locator('#dockTravel'));
  await page.locator('.pawSketchbook').waitFor();
  assert(await page.locator('.pawSketchPlaces .pawSketchGo').count()>0,'Local shops are available before travel');
  await press(page.locator('.pawSketchTabs button').nth(['fortune','home','island','wonder'].indexOf(district)));
  assert.equal(await page.locator('.pawSketchSpread').getAttribute('data-page-turn'),district==='fortune'?'back':'forward');
  await press(page.locator('.pawSketchBoard'));
  const ride=page.locator('.pawRailJourney[data-painted-rail="true"]');
  await ride.waitFor();
  assert.equal(await page.locator('.districtRailCabin').isVisible(),false,'Map selection boards directly');
  assert.equal(await ride.locator('.mbRailPane').count(),0,'Do not reintroduce broken composite windows');
  assert(await ride.locator('.mbPaintedRail img').evaluate(im=>im.complete&&im.naturalWidth>0),'Painted carriage loaded');
  const moving=ride.locator(':is(.pawMovingGlass,.pawPaintedRailComposite)');
  await moving.waitFor({timeout:2000});
  assert.equal(await moving.count(),1,'One railway motion layer');
  const motion=await ride.locator('.mbPaintedRail').getAttribute('data-rail-motion');
  assert(['route-panorama','route-parallax','painted-route-parallax'].includes(motion),'Installed district scenery must be used: '+motion);
  const frame=await moving.evaluate(el=>({frame:Number(el.dataset.frame),pixels:el.toDataURL()}));
  await page.waitForFunction(n=>Number(document.querySelector('.pawRailJourney :is(.pawMovingGlass,.pawPaintedRailComposite)')?.dataset.frame)>n+2,frame.frame,{timeout:1400});
  assert.notEqual(await moving.evaluate(el=>el.toDataURL()),frame.pixels,'Window pixels must visibly change, not just frame counter');
  const fit=await ride.evaluate(el=>{
    const r=el.getBoundingClientRect(),g=document.querySelector('#game').getBoundingClientRect(),a=el.querySelector('.mbPaintedRail').getBoundingClientRect(),im=el.querySelector('.mbPaintedRail img');
    const ratio=im.naturalWidth/im.naturalHeight;
    return {shell:Math.abs(r.width-g.width)<=3&&Math.abs(r.height-g.height)<=3,
      cover:a.left<=r.left+3&&a.right>=r.right-3&&a.top<=r.top+3&&a.bottom>=r.bottom-3,
      aspect:Math.abs(a.width/a.height-ratio)<.025,
      fitted:Math.abs(a.width-r.width)<=3||Math.abs(a.height-r.height)<=3,
      centered:Math.abs((a.left+a.right-r.left-r.right)/2)<=3&&Math.abs((a.top+a.bottom-r.top-r.bottom)/2)<=3};
  });
  assert(fit.shell&&fit.cover&&fit.aspect&&fit.fitted&&fit.centered,'Carriage covers the viewport without distortion or letterboxing: '+JSON.stringify(fit));
  await shot(district+'-transfer');
  await page.waitForFunction(d=>scene===d&&!transitioning,district,{timeout:15000});
  await shot(district+'-arrival');
  for(const id of doors){
   await enterDoor(id);
   if(id==='quiz'){
    await station('quiz');
    await page.locator('#choices').getByRole('button',{name:'MBTI-inspired preferences',exact:true}).waitFor();
    await press(page.locator('#choices').getByRole('button',{name:/Keep exploring/}));
   }
   await backOutside();
  }
 }
 // A deliberate station tap walks to the platform and boards in one action.
 await press(page.locator('#dockTravel'));
 assert(await page.evaluate(()=>pawRoomVisitProgress(maps.fortune,pawRoomVisitMemory.fortune).count>=4),'Physical room visits were not recorded');
 assert(await page.locator('.pawVisitProgress progress').isVisible(),'Optional exploration progress stays in the travel journal');
 await press(page.locator('.pawJournalDeparture').getByRole('button',{name:'Walk to station',exact:true}));
 await page.locator('.pawRailJourney').waitFor({state:'visible',timeout:24000});
 assert.equal(await page.locator('.pawStationPlatform').count(),0,'Station must not open a holding page');
 assert.equal(await page.locator('.districtRailCabin').isVisible(),false,'Boarding must not open the obsolete preview');
 assert.equal(await page.locator('.pawRailCaption strong').innerText(),await page.evaluate(()=>maps.home.n[0]));
 await shot('direct-railway');
 await page.waitForFunction(()=>scene==='home'&&!transitioning,null,{timeout:12000});
 assert.equal(await page.evaluate(()=>playerName),'June');
 assert.deepEqual(failures,[]);
 await frameAudit.stop();
 console.log(name+': real entrance, doors, reading stations and four district rail loop PASS');
}

(async()=>{
 const browser=await chromium.launch();
 fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,options] of [['mobile-360',{viewport:{width:360,height:640},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]]){
   const page=await browser.newPage(options);
   try{await travelLoop(page,name,options.hasTouch);}
   catch(error){await page.screenshot({path:'test-results/'+name+'-district-failure.png'}).catch(()=>{});throw error;}
   finally{await page.close();}
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
