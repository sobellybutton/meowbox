const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
const assert=(v,m)=>{if(!v)throw Error(m)};
(async()=>{
 const browser=await (process.env.MEOW_BROWSER==='webkit'?webkit:chromium).launch();
 fs.mkdirSync('test-results',{recursive:true});
 try{
 for(const [name,opts] of [['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]]){
  const p=await browser.newPage(opts),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const click=async locator=>opts.hasTouch?locator.tap({timeout:10000}):locator.click({timeout:10000});
  try{
   await p.goto('http://127.0.0.1:8770/index.html',{waitUntil:'domcontentloaded'});
   await p.waitForFunction(()=>typeof yueReadingHub==='function'&&typeof entryStory==='function',null,{timeout:45000});
   // Isolate the consultation; do not claim this verifies the journey to the house.
   await p.evaluate(()=>{proposal.hidden=true;scene='fortune';room='destiny';activity=null;zh=false;document.documentElement.lang='en';destinyConsultMenu()});
   await p.locator('.yueAlmanacForm').waitFor();
   await p.screenshot({path:'test-results/'+name+'-yue-welcome.png'});
   await click(p.locator('.yueChartTools').getByRole('button',{name:'Full birth chart',exact:true}));
   await p.locator('.astroForm').waitFor();
   assert(await p.locator('.destinyChamber').isHidden(),'Obsolete chamber consumes reading layout');
   assert(await p.locator('.roomArtWrap').count()===0,'Obsolete vector room still attached');
   const host=await p.locator('.yueCompactHost').boundingBox(),field=await p.locator('.astroForm input[type=date]').boundingBox();
   assert(host&&host.height<=110,'Host exceeds compact header budget');
   assert(field&&field.y+field.height<=opts.viewport.height,'Birth date is below initial viewport');
   await p.screenshot({path:'test-results/'+name+'-yue-before-chart.png'});
   await p.locator('.astroForm input[type=date]').fill('1990-06-15');
   await p.locator('.astroForm input[type=time]').fill('12:30');
   await p.locator('.astroForm details select').selectOption('0');
   await click(p.locator('.astroForm button[type=submit]'));
   await p.locator('.chartConsultation').waitFor();
   assert(await p.locator('.astroForm').isHidden(),'Form did not collapse');
   assert(await p.evaluate(()=>yueSessionProfiles.self.chart?.date==='1990-06-15'),'Own chart not retained');
   await click(p.locator('.chartTopics [data-topic="8"]'));
   assert(await p.locator('.chartTopics [data-topic="8"]').getAttribute('aria-pressed')==='true','Career topic not selected');
   await p.screenshot({path:'test-results/'+name+'-yue-chart.png'});
   const question=p.locator('.chartFollowForm input');
   await question.fill('How do I balance work and sleep?');
   await click(p.locator('.chartFollowForm button'));
   assert(await question.inputValue()==='', 'Private question retained after submission');
   assert(await p.locator('.chartFollowReply button').count()===2,'Ambiguous question should offer two topics');
   await click(p.locator('.chartFollowReply button').last());
   assert(await p.locator('.chartTopics [data-topic="10"]').getAttribute('aria-pressed')==='true','Rest topic not selected');
   await p.screenshot({path:'test-results/'+name+'-yue-follow-up.png'});

   await click(p.locator('.yueInlinePeople').getByRole('button',{name:'Someone else',exact:true}));
   assert(await p.locator('.astroForm input[type=date]').inputValue()==='','Other profile inherited own birth date');
   await p.locator('.astroForm input[type=date]').fill('1995-05-06');
   await p.locator('.astroForm input[type=time]').fill('08:45');
   await p.locator('.astroForm details select').selectOption('0');
   await click(p.locator('.astroForm button[type=submit]'));
   await p.locator('.chartConsultation').waitFor();
   assert(await p.evaluate(()=>yueSessionProfiles.other.chart?.date==='1995-05-06'),'Other chart not retained');
   await click(p.locator('.yueInlinePeople').getByRole('button',{name:'Me',exact:true}));
   await p.locator('.chartConsultation').waitFor();
   assert(await p.locator('.astroForm').isHidden(),'Switching back required form');
   assert(await p.evaluate(()=>yueSessionProfiles.self.chart?.date==='1990-06-15'),'Own chart changed');
   assert(await p.locator('.chartTopics [data-topic="10"]').getAttribute('aria-pressed')==='true','Own topic was not restored');

   await click(p.locator('.yueChartTools').getByRole('button',{name:'Zodiac & Tai Sui',exact:true}));
   await p.locator('.yueReadingFront').waitFor();
   assert(await p.locator('.yueAlmanacForm input[type=date]').inputValue()==='1990-06-15','Date not reused');
   assert(await p.locator('.yueAlmanacForm input[type=date]').isHidden(),'Almanac asked for DOB again');
   await p.screenshot({path:'test-results/'+name+'-yue-almanac.png'});
   await click(p.locator('#content .row button').first());
   await click(p.locator('.yueReadingMenu button').nth(2));
   await click(p.locator('.signNotebookGrid button').nth(2));
   assert(await p.locator('.signNotebookGrid button').nth(2).getAttribute('aria-pressed')==='true','Star sign did not select');
   await click(p.locator('#content .row button').last());
   assert(await p.locator('.signNotebookGrid button').nth(2).getAttribute('aria-pressed')==='true','Language switch lost sign');
   assert(await p.evaluate(()=>!JSON.stringify(localStorage).includes('1990-06-15')&&!JSON.stringify(localStorage).includes('1995-05-06')),'Birth details persisted');
   assert(errors.length===0,errors.join('; '));
   console.log(name+': Master Yue click-through PASS');
  }catch(e){await p.screenshot({path:'test-results/'+name+'-yue-failure.png'}).catch(()=>{});throw Error(name+': '+e.message+' | '+errors.join('; '))}
  finally{await p.close()}
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
