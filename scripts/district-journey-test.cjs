const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');

async function travelLoop(page,name,touch){
 const failures=[];
 page.on('pageerror',error=>failures.push(error.message));
 page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))failures.push(m.text())});
 page.on('response',r=>{
  if(r.status()>=400&&new URL(r.url()).origin==='http://127.0.0.1:8768')failures.push(r.status()+' '+r.url());
 });
 const press=locator=>touch?locator.tap({timeout:12000}):locator.click({timeout:12000});
 const shot=id=>page.screenshot({path:'test-results/'+name+'-district-'+id+'.png'});
 async function point(x,y){
  if(touch)await page.touchscreen.tap(x,y);
  else await page.mouse.click(x,y);
 }
 async function enterDoor(id){
  const sign=page.locator('#worldSigns [data-door="'+id+'"]');
  for(let walks=0;walks<5&&!await sign.isVisible();walks++){
   const {direction,from}=await page.evaluate(id=>{
    const y=maps[scene].st.find(v=>v[0]===id)[2]+110;
    return {direction:Math.sign(y-p.y)||1,from:p.y};
   },id);
   const waitForWalk=()=>page.waitForFunction(({direction,from,id})=>Math.abs(p.y-from)>160||!signButtons.get(id)?.hidden,{direction,from,id},{timeout:10000});
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
  await press(sign);
  await page.waitForFunction(id=>room===id&&!transitioning&&continuityRoom===id&&Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<4,id,{timeout:21000});
  assert(await page.evaluate(()=>indoorSafe(indoor.x,indoor.y)),'Arrival is outside walkable floor');
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
 await shot('train');
 await press(page.locator('#proposal .rail-arrive'));
 await page.locator('#proposal .mbGatePainting:visible').waitFor();
 await shot('gate');
 await press(page.locator('#proposal .shrine-enter'));
 await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0);
 await enterDoor('tarot');
 await station('tarot');
 await page.locator('#choices').getByRole('button',{name:/Daily guidance/}).waitFor();
 assert.match(await page.locator('#line').innerText(),/June/);
 await press(page.locator('#choices').getByRole('button',{name:/Daily guidance/}));
 await press(page.locator('#choices').getByRole('button',{name:/Be kind today/}));
 await page.waitForFunction(()=>activity==='tarot');
 await backOutside();
 await enterDoor('destiny');
 await station('destiny');
 await page.locator('.yueAlmanacForm').waitFor();
 await shot('yue-desk');
 await backOutside();

 for(const [district,doors] of [['home',['fish']],['island',['boba']],['wonder',['quiz','story','match']],['fortune',[]]]){
  await press(page.locator('#nextStopShortcut'));
  const scenery=page.locator('.districtRailCabin .mbRailPane > span').first();
  await scenery.waitFor();
  await press(page.locator('.mbRailPause'));
  assert.equal(await scenery.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await press(page.locator('.railJourneyActions button').first());
  await page.locator('.mbTransferHolding[data-painted-rail="true"]').waitFor();
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
 assert.equal(await page.evaluate(()=>playerName),'June');
 assert.deepEqual(failures,[]);
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
