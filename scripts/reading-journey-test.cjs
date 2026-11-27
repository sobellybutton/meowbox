const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');

async function run(page,name,touch){
 const errors=[];
 page.on('pageerror',error=>{errors.push(error.message);console.error(error.message)});
 const goto=()=>page.goto('http://127.0.0.1:8767/index.html',{waitUntil:'domcontentloaded'});
 const click=locator=>touch?locator.tap():locator.click();
 const world=async(x,y)=>{
  const point=await page.evaluate(([x,y])=>{
   const rect=c.getBoundingClientRect();
   return [rect.left+cam.ox+x*cam.scale,rect.top+cam.oy+y*cam.scale];
  },[x,y]);
  await (touch?page.touchscreen.tap(...point):page.mouse.click(...point));
 };
 const shot=label=>page.screenshot({path:'test-results/'+name+'-'+label+'.png'});
 async function openAssessmentDetails(){
  await page.waitForFunction(()=>at({x:486,y:623})?.fn.toString().includes('openWonderResult'));
  await world(486,623);
  await page.locator('.readingNotes').waitFor({timeout:5000});
 }
 const showGame=()=>page.evaluate(()=>{
  proposal.hidden=true;$('arrival').hidden=true;$('page').style.display='none';
  avatar=0;zh=false;document.documentElement.lang='en';
 });
 await goto();
 await page.waitForFunction(()=>typeof openTarotReading==='function'&&typeof yueReadingHub==='function');
 await showGame();
 // Isolate the table with a deterministic spread; the actual flip and reading controls are used.
 await page.evaluate(()=>{
  scene='fortune';room='tarot';activity=null;start('love');
  Object.assign(state,{readTopic:1,tarotTone:'playful',readStage:'cards',readCards:[
   {i:1,rev:false},{i:2,rev:true},{i:4,rev:false}
  ],readFlip:[-1,-1,-1]});
 });
 await page.waitForFunction(()=>cam.scale>0&&activity==='love');
 const slots=await page.evaluate(()=>Array.from({length:3},(_,i)=>readingActivitySlot(i,3,W<H)));
 for(const [i,{x,y}] of slots.entries()){
  await page.waitForFunction(({x,y,i})=>{const h=at({x,y});return activity==='love'&&state.readStage==='cards'&&state.readFlip[i]<0&&h&&Math.abs(h.x+h.w/2-x)<8&&Math.abs(h.y+h.h/2-y)<8},{x,y,i});
  await world(x,y);
  await page.waitForFunction(i=>state.readFlip[i]>=0,i,{timeout:5000});
 }
 await page.waitForFunction(()=>state.readSaved);
 await page.waitForFunction(()=>readingArtwork().naturalWidth===1024&&readingArtwork().naturalHeight===2180);
 await shot('local-tarot-faces');
 await world(298,touch?755:650);
 await page.getByRole('heading',{name:'Put the cards together'}).waitFor();
 assert.equal(await page.locator('.readingNote').count(),3);
 assert.match(await page.locator('.readingAside').innerText(),/meeting invite/);
 await shot('work-reading');
 await click(page.locator('.readingNotes').getByRole('button',{name:'Share card',exact:true}));
 await page.locator('.meowShareStatus').getByText('Ready to share or save.').waitFor();
 assert.equal(await page.evaluate(()=>pics.tarotJournal?.naturalWidth),1200);
 const download=page.waitForEvent('download');
 await click(page.getByRole('button',{name:'Save PNG image'}));
 await (await download).saveAs('test-results/'+name+'-tarot-export.png');
 await click(page.locator('.meowShareTabs').getByRole('button',{name:'中文',exact:true}));
 await click(page.getByRole('button',{name:/WeChat/}));
 await page.locator('.meowShareStatus').getByText('Ready to share or save.').waitFor();
 const zhDownload=page.waitForEvent('download');
 await click(page.getByRole('button',{name:'Save PNG image'}));
 await (await zhDownload).saveAs('test-results/'+name+'-tarot-zh-square.png');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof openTarotReading==='function'&&typeof yueReadingHub==='function');
 await showGame();
 await page.evaluate(()=>openReadingJournal());
 await page.locator('.readingJournalArt').waitFor();
 assert.equal(await page.locator('.readingNote').count(),1);
 await shot('tarot-journal');
 await click(page.getByRole('button',{name:'Read again',exact:true}));
 assert.match(await page.locator('.readingAside').innerText(),/meeting invite/);
 await click(page.locator('#content .row').getByRole('button',{name:'中文'}));
 await page.locator('.readingAside').filter({hasText:/拒绝会议邀请/}).waitFor({timeout:5000});

 // Open the extended spread at the table and flip each card with actual input.
 await showGame();
 await page.evaluate(()=>{
  room='tarot';start('love');
  Object.assign(state,{readSpreadSize:5,readTopic:1,tarotTone:'playful',readStage:'cards',
   readCards:[0,1,2,4,5].map(i=>({i,rev:i===2})),readFlip:Array(5).fill(-1)});
 });
 const extendedSlots=await page.evaluate(()=>fiveReadingLayout(W<H));
 for(const [i,{x,y}] of extendedSlots.entries()){
  await page.waitForFunction(({x,y,i})=>{const h=at({x,y});return activity==='love'&&state.readSpreadSize===5&&state.readStage==='cards'&&state.readFlip[i]<0&&h&&Math.abs(h.x+h.w/2-x)<8&&Math.abs(h.y+h.h/2-y)<8},{x,y,i});
  await world(x,y);
  await page.waitForFunction(i=>state.readFlip[i]>=0,i,{timeout:5000});
 }
 await page.waitForFunction(()=>state.readSaved);
 await world(400,touch?700:625);
 await page.getByRole('heading',{name:'Put the cards together'}).waitFor();
 assert.equal(await page.locator('.readingNote').count(),5);
 await shot('five-reading');
 await click(page.getByRole('button',{name:'Share card',exact:true}));
 await click(page.getByRole('button',{name:/WeChat/}));
 await page.locator('.meowShareStatus').getByText('Ready to share or save.').waitFor();
 const extendedExport=page.waitForEvent('download');
 await click(page.getByRole('button',{name:'Save PNG image'}));
 await (await extendedExport).saveAs('test-results/'+name+'-five-card-square.png');

 await page.evaluate(()=>openReadingJournal());
 assert.equal(await page.locator('.readingNote').count(),2);
 const archive=page.locator('.readingNote').last();
 await click(archive.getByRole('button',{name:'Delete reading',exact:true}));
 await click(archive.getByRole('button',{name:'Keep it',exact:true}));
 assert.equal(await page.locator('.readingNote').count(),2);
 await click(archive.getByRole('button',{name:'Delete reading',exact:true}));
 await click(archive.getByRole('button',{name:'Delete this reading',exact:true}));
 assert(await page.evaluate(()=>fiveReadingArchive().length===0&&readingJournal.length===1));
 await click(page.getByRole('checkbox',{name:'Automatically save completed readings'}));
 await showGame();
 await page.evaluate(()=>{
  start('tarot');Object.assign(state,{readCards:[{i:15,rev:false}],readFlip:[t-1],readStage:'cards'});
 });
 await page.waitForFunction(()=>state.readSaved);
 assert(await page.evaluate(()=>readingJournal.length===1&&!journalAutoSave()));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof openReadingJournal==='function'&&typeof openWonderResult==='function');
 await showGame();
 await page.evaluate(()=>openReadingJournal());
 assert.equal(await page.locator('.readingNote').count(),1);
 assert.equal(await page.locator('.readingPrivacy input').isChecked(),false);

 // Exercise real scoring for an even split, then open the details on the table.
 await showGame();
 await page.evaluate(()=>{
  scene='wonder';room='quiz';activity=null;wonderSceneOpen('type');
  wonderSceneAnswers=wonderQuestionOrder.map(q=>q.id%2);
  wonderSceneFinish();
 });
 await page.waitForFunction(()=>wonderScenePhase==='result');
 await openAssessmentDetails();
 await page.getByRole('heading',{name:'Where you recharge'}).waitFor();
 const rows=await page.locator('.readingNote').allTextContents();
 assert.equal(rows.length,4);
 assert(rows.every(row=>row.includes('2/4')&&row.indexOf('2/4')!==row.lastIndexOf('2/4')));
 await shot('personality-breakdown');
 await click(page.locator('.readingNotes').getByRole('button',{name:'Share keepsake',exact:true}));
 await page.locator('.meowShareStatus').getByText('Ready to share or save.').waitFor();
 await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-personality-export-preview.png'});
 await showGame();
 await page.evaluate(()=>{
  wonderSceneOpen('motive');
  wonderSceneAnswers=wonderQuestionOrder.map(q=>q.dimension<2?2:0);
  wonderSceneFinish();
 });
 assert.equal(await page.evaluate(()=>wonderSaved.motive.index),null);
 await openAssessmentDetails();
 assert.equal(await page.locator('.wonderMotiveScores li').count(),9);
 assert.equal(await page.locator('.readingPrompt').count(),2);
 const valid=await page.evaluate(()=>{
  const rows=prepareWonderQuestions('type'),answers=rows.map(()=>0);
  const max=scoreWonder('type',rows,answers).scores.every(v=>v===4);
  const invalid=rows.slice();invalid[0]=invalid[1];
  try{scoreWonder('type',invalid,answers);return false}catch{return max}
 });
 assert(valid,'Inconsistent or duplicate assessment items accepted');

 assert.deepEqual(errors,[]);
}

(async()=>{
 const browser=await chromium.launch();
 fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,opts] of [['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]]){
   const page=await browser.newPage(opts);
   try{
    await run(page,name,!!opts.hasTouch);
    console.log(name+': reading, journal, PNG export and assessment details passed');
   }catch(error){
    await page.screenshot({path:'test-results/'+name+'-reading-failure.png'}).catch(()=>{});
    throw error;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
