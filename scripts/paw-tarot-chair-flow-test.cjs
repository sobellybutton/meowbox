'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const size=process.env.PAW_VIEWPORT||'390x844',language=process.env.PAW_LANGUAGE||'EN',cn=language!=='EN';
const [width,height]=size.split('x').map(Number);
fs.mkdirSync('test-results/tarot-chair',{recursive:true});
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const tap=loc=>loc.tap({timeout:15000}),wait=(fn,arg=null,timeout=30000)=>page.waitForFunction(fn,arg,{timeout}),shot=name=>page.screenshot({path:'test-results/tarot-chair/'+size+'-'+name+'.png'});
 try{
 await page.goto('http://127.0.0.1:8772/index.html',{waitUntil:'domcontentloaded'});
 const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
 await next.waitFor({timeout:45000});await tap(proposal.locator('.languageChoice').getByRole('button',{name:language,exact:true}));await tap(next);
 await proposal.locator('.rail-ticket input').fill('Traveller 旅人');await tap(proposal.locator('.ticket-confirm'));await tap(next);await tap(proposal.locator('footer .actions button').first());await tap(proposal.locator('.rail-arrive'));
 await proposal.locator('.shrine-enter').waitFor({state:'visible',timeout:20000});await tap(proposal.locator('.shrine-enter'));await proposal.waitFor({state:'hidden',timeout:30000});
 await wait(()=>!transitioning&&!room&&!activity&&scene==='fortune'&&valleyRevealAt<0&&!signRoot.hidden);
 // Controlled outdoor admission only. All indoor walk and seat actions use the real game.
 await page.evaluate(()=>enter('tarot'));
 await wait(()=>room==='tarot'&&!activity&&pawReadingActive()&&continuityRoom==='tarot');
 await shot('arrival');
 await wait(()=>c.dataset.pawTarotSeat==='seated'&&pawTarotChairAt(indoor.x,indoor.y,pawReadingPlate)&&!indoor.route.length);
 await shot('seated');assert(await page.evaluate(()=>pawRoomImageReady(pawTarotChairImage(avatar??0))));
 // Actual directory control if table plaque isn't reachable on this viewport.
 const guide=page.locator('#pawRoomGuideToggle');await tap(guide);
 await tap(page.locator('#roomStationGuide [data-station="tarot"]'));
 await wait(()=>room==='tarot'&&(['tarot','love'].includes(activity)||talkOpen));
 await shot('consultation');
 if(await page.evaluate(()=>talkOpen))await page.evaluate(()=>closeTalk());
 if(await page.evaluate(()=>!!activity)){
  await wait(()=>c.dataset.pawTarotSeat==='seated');
  await shot('reading-seat');
  await tap(page.locator('#back'));await wait(()=>room==='tarot'&&!activity);
 }
 await tap(page.locator('#back'));await wait(()=>!room&&!activity&&!transitioning);
 await shot('departed');assert.deepEqual(errors,[]);console.log('PASS Tarot indoor approach, rendered seat, consultation and return');
 }catch(e){await shot('failure').catch(()=>{});throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
