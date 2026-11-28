'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
fs.mkdirSync('test-results/fortune-paper',{recursive:true});
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=n=>page.screenshot({path:'test-results/fortune-paper/'+n+'.png'});
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}).tap();
  await page.locator('#proposal footer button.next').tap();
  await page.locator('#proposal .rail-ticket input').fill('Fortune Tester');
  await page.locator('#proposal .ticket-confirm').tap();await page.locator('#proposal footer button.next').tap();await page.locator('#proposal footer .actions button').first().tap();
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({timeout:30000});if(await skip.isVisible())await skip.tap();
  await gate.tap({timeout:30000});await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0,null,{timeout:30000});
  // Controlled receipt fixture: exercise paper controls, not fortune draw.
  await page.evaluate(()=>{closeTalk();$('page').style.display='none';room='temple';activity=null;state={};pawOriginalFortunePaper(3)});
  await page.waitForFunction(()=>activity==='templePaper'&&state.paperStage==='folded'&&pawSlipCounterActive(),null,{timeout:12000});
  await page.waitForFunction(()=>pawRoomImageReady(pawPaintedSlipImage(state.paperNumber,true))&&pawRoomImageReady(pawPaintedSlipImage(state.paperNumber,false)),null,{timeout:10000});
  await shot('folded');
  await page.locator('[data-paw-paper-action="open"]').tap();
  await page.waitForFunction(()=>state.paperStage==='opening'&&t-state.paperAt>.15&&t-state.paperAt<.6,null,{timeout:5000});
  await shot('unfolding');
  await page.waitForFunction(()=>state.paperStage==='open',null,{timeout:5000});
  await shot('open');
  const controls=page.locator('[data-paw-paper-action]');
  assert.equal(await controls.count(),3);
  await page.locator('[data-paw-paper-action="rack"]').tap();
  await page.waitForFunction(()=>activity==='templeRack',null,{timeout:10000});
  await shot('rack');
  await page.locator('#gameControls').getByRole('button',{name:'Return to your fortune',exact:true}).tap();
  await page.waitForFunction(()=>activity==='templePaper'&&state.paperNumber===3&&state.paperStage==='open');
  await page.locator('[data-paw-paper-action="keep"]').tap();
  await page.waitForFunction(()=>state.paperStage==='kept');
  await page.locator('[data-paw-paper-action="return"]').tap({timeout:10000});
  await page.waitForFunction(()=>room==='temple'&&activity===null,null,{timeout:10000});
  assert.deepEqual(errors,[]);console.log('PASS compact mobile fortune unfold, rack return, keep and hall return');
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
