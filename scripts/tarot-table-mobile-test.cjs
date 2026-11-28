'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
fs.mkdirSync('test-results/tarot-table',{recursive:true});
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=n=>page.screenshot({path:'test-results/tarot-table/'+n+'.png'});
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}).tap();
  await page.locator('#proposal footer button.next').tap();
  await page.locator('#proposal .rail-ticket input').fill('Tarot Tester');
  await page.locator('#proposal .ticket-confirm').tap();await page.locator('#proposal footer button.next').tap();await page.locator('#proposal footer .actions button').first().tap();
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({timeout:30000});if(await skip.isVisible())await skip.tap();
  await gate.tap({timeout:30000});await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0,null,{timeout:30000});
  // Room admission fixture; the wash, selection and flip use real input.
  await page.evaluate(()=>{closeTalk();$('page').style.display='none';room=null;activity=null;state={};transitioning=false;pending=null;enter('tarot')});
  await page.waitForFunction(()=>room==='tarot'&&!transitioning,null,{timeout:25000});
  await page.evaluate(()=>{closeTalk();start('tarot')});
  await page.waitForFunction(()=>state.readStage==='choose'&&state.readAt>t,null,{timeout:5000});
  assert(await page.evaluate(()=>!pawTarotFanSettled(state,t,false)));
  await shot('wash');
  await page.waitForFunction(()=>pawTarotFanSettled(state,t,false)&&hit.some(h=>h.id==='paw-pick-card-4'),null,{timeout:10000});
  await shot('spread');
  const pick=await page.evaluate(()=>{
   const h=hit.find(h=>h.id==='paw-pick-card-4'),r=c.getBoundingClientRect(),x=h.x+h.w/2,y=h.y+h.h/2;
   return {x:r.left+cam.ox+x*cam.scale,y:r.top+cam.oy+y*cam.scale,i:state.pawCardPool[4].i,rev:state.pawCardPool[4].rev}
  });
  await page.touchscreen.tap(pick.x,pick.y);
  await page.waitForFunction(()=>state.readStage==='cards',null,{timeout:5000});
  assert(await page.evaluate(p=>state.readCards.length===1&&state.readCards[0].i===p.i&&state.readCards[0].rev===p.rev,pick));
  const face=await page.evaluate(()=>{const q=readingActivitySlot(0,1,W<H),r=c.getBoundingClientRect();return {x:r.left+cam.ox+q.x*cam.scale,y:r.top+cam.oy+q.y*cam.scale}});
  await page.touchscreen.tap(face.x,face.y);
  await page.waitForFunction(()=>state.readFlip[0]>=0&&t-state.readFlip[0]>.73,null,{timeout:10000});
  await shot('revealed');
  assert.deepEqual(errors,[]);console.log('PASS mobile tabletop wash, fan, actual selection and flip');
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
