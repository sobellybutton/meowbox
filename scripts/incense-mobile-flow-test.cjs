'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
fs.mkdirSync('test-results/incense',{recursive:true});
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=n=>page.screenshot({path:'test-results/incense/'+n+'.png'});
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}).tap();
  await page.locator('#proposal footer button.next').tap();
  await page.locator('#proposal .rail-ticket input').fill('Incense Tester');
  await page.locator('#proposal .ticket-confirm').tap();await page.locator('#proposal footer button.next').tap();await page.locator('#proposal footer .actions button').first().tap();
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({timeout:30000});if(await skip.isVisible())await skip.tap();
  await gate.tap({timeout:30000});await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0,null,{timeout:30000});
  // Controlled admission isolates the ritual; all ritual input below is real touch.
  await page.evaluate(()=>{closeTalk();$('page').style.display='none';room='temple';activity=null;state={};start('prayer')});
  await page.waitForFunction(()=>pawRoomImageReady(pawHallArt()),null,{timeout:15000});
  const bar=page.locator('#ritualActionBar');
  for(let n=1;n<=3;n++){
   await bar.getByRole('button',{name:/Take a joss stick/}).tap({timeout:10000});
   await page.waitForFunction(n=>state.prayerHeld===n,n,{timeout:5000});
  }
  await bar.getByRole('button',{name:'Light the three sticks',exact:true}).tap({timeout:10000});
  await page.waitForFunction(()=>state.prayerStage==='lighting'&&t-state.prayerAt>=.68&&t-state.prayerAt<=1.02,null,{timeout:5000});
  assert(await page.evaluate(()=>{const flame=pawIncenseSupply(pawHallPlate,3,'lighting',t-state.prayerAt).flame,q=pawIncenseLighting({x:400,y:500},flame,t-state.prayerAt);return Math.hypot(q.grip.x+39*Math.sin(q.angle)-flame.x,q.grip.y-39*Math.cos(q.angle)-flame.y)<.001}));
  await shot('flame-contact');
  await bar.getByRole('button',{name:/^Bow/}).tap({timeout:10000});
  await page.waitForFunction(()=>state.prayerStage==='bow'&&state.prayerHeld===3&&state.prayerLit);
  await shot('bow');
  await bar.getByRole('button',{name:'Bow 2/3',exact:true}).tap({timeout:10000});
  await bar.getByRole('button',{name:'Bow 3/3',exact:true}).tap({timeout:10000});
  await bar.getByRole('button',{name:'Place incense in burner',exact:true}).tap({timeout:10000});
  await page.waitForFunction(()=>state.prayerStage==='complete'&&state.prayerHeld===0&&state.prayerOffered===3&&state.prayerRewarded,null,{timeout:15000});
  await shot('offered');assert.deepEqual(errors,[]);
  console.log('PASS compact mobile incense pickup, ignition, bow and offering');
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
