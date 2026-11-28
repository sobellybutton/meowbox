'use strict';
const {chromium,webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const engine=process.env.PAW_BROWSER==='webkit'?webkit:chromium;
const width=Number(process.env.PAW_WIDTH||390),height=Number(process.env.PAW_HEIGHT||844),zhMode=process.env.PAW_LANGUAGE==='zh';
const base='http://127.0.0.1:8765/index.html',out='test-results/ritual-presentation';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await engine.launch(),page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=label=>page.screenshot({path:out+'/'+label+'.png'});
 const noPage=()=>page.evaluate(()=>$('page').style.display!=='block');
 async function chatGeometry(name,maxFraction=.36){
  const info=await page.locator('#dialogue[data-paw-chat-bar]').evaluate(n=>{const r=n.getBoundingClientRect(),style=getComputedStyle(n);return {top:r.top,bottom:r.bottom,height:r.height,width:r.width,background:style.backgroundImage,shadow:style.boxShadow,viewport:innerHeight}});
  assert(info.height<=info.viewport*maxFraction+2,name+' dialogue consumes too much of room '+JSON.stringify(info));
  assert(info.bottom<=info.viewport+2&&info.bottom>=info.viewport-20,name+' dialogue must stay at bottom '+JSON.stringify(info));
  assert.equal(info.shadow,'none',name+' still looks like a panel');
  console.log('CHAT_BAR_GEOMETRY '+name+' '+JSON.stringify(info));
 }

 const text=(en,cn)=>zhMode?cn:en;
 async function tapText(en,cn){await page.locator('#dialogue').getByRole('button',{name:text(en,cn),exact:true}).tap({timeout:8000})}
 async function captureYueExports(scope){
  const panel=page.locator('.meowSharePanel');
  await panel.waitFor({timeout:15000});
  const formats=[['feed',/4:5/,1080,1350],['xhs',/小红书/,1080,1440],['story',/9:16|TikTok/i,1080,1920],['square',/1:1/,1080,1080]];
  const language=panel.getByRole('button',{name:zhMode?'中文':'EN',exact:true});
  // The language button's accessible English label may be English rather than EN.
  if(await language.count())await language.tap();
  else if(!zhMode)await panel.getByRole('button',{name:'English',exact:true}).tap();
  for(const [format,label,w,h] of formats){
   const button=panel.getByRole('button',{name:label}).first();
   await button.tap();
   assert.equal(await button.getAttribute('aria-pressed'),'true');
   await page.waitForFunction(([w,h])=>{const c=document.querySelector('.meowSharePreview');return c?.width===w&&c?.height===h},[w,h]);
   await panel.locator('.meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:15000});
   const save=panel.getByRole('button',{name:/Save PNG|保存.*PNG/i});
   const [download]=await Promise.all([page.waitForEvent('download',{timeout:15000}),save.tap()]);
   assert.equal(await download.failure(),null);
   const path=out+'/'+scope+'-'+(zhMode?'zh':'en')+'-'+format+'.png';
   await download.saveAs(path);
   const bytes=fs.readFileSync(path);
   assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Invalid PNG signature '+path);
   assert.equal(bytes.toString('ascii',12,16),'IHDR');
   assert.equal(bytes.readUInt32BE(16),w,'Wrong exported width '+path);
   assert.equal(bytes.readUInt32BE(20),h,'Wrong exported height '+path);
   assert(bytes.length>5000,'Unexpectedly small export '+path);
   const decoded=await page.evaluate(async encoded=>{
    const img=new Image();img.src='data:image/png;base64,'+encoded;await img.decode();
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,c.width,c.height).data;
    let opaque=0,min=255,max=0;
    for(let i=0;i<pixels.length;i+=64){if(pixels[i+3]>0){opaque++;const lum=(pixels[i]+pixels[i+1]+pixels[i+2])/3;min=Math.min(min,lum);max=Math.max(max,lum)}}
    return {w:c.width,h:c.height,opaque,range:max-min};
   },bytes.toString('base64'));
   assert.equal(decoded.w,w);assert.equal(decoded.h,h);
   assert(decoded.opaque>w*h/32&&decoded.range>20,'Blank or mostly transparent export '+path);
   console.log('EXPORTED_PNG '+path+' '+bytes.length+' bytes '+w+'x'+h);
  }
 }
 async function setup(){
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('#proposal .languageChoice').getByRole('button',{name:zhMode?'中文':'EN',exact:true}).tap();
  await page.locator('#proposal footer button.next').tap();
  await page.locator('#proposal .rail-ticket input').fill('Ritual Tester');
  await page.locator('#proposal .ticket-confirm').tap();await page.locator('#proposal footer button.next').tap();await page.locator('#proposal footer .actions button').first().tap();
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({timeout:30000});if(await skip.isVisible())await skip.tap();
  await gate.tap({timeout:30000});await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0,null,{timeout:30000});
 }
 // Controlled room admission fixture: isolates presentation, not an end-to-end
 // walking test. Once admitted, all form/card controls are real browser input.
 async function fixture(id){
  await page.evaluate(id=>{closeTalk();$('page').style.display='none';room=null;activity=null;state={};transitioning=false;pending=null;enter(id)},id);
  await page.waitForFunction(id=>room===id&&!transitioning,id,{timeout:25000});
  await page.evaluate(()=>closeTalk());
 }
 try{
  await setup();
  await fixture('wishes');
  await page.evaluate(()=>{start('wishes');gardenWrite()});
  const paper=page.locator('#dialogue.pawWishWriting .pawWishPaper textarea');
  await paper.waitFor({timeout:10000});assert(await noPage(),'Wish opened external page');
  await chatGeometry('wish',.28);await shot('wish-blank');
  await paper.fill('A quiet day with a little sunshine');
  await tapText('Fold into a lantern','折进心愿灯');
  await page.waitForFunction(()=>state.gardenStage==='carry'&&!talkOpen);
  assert(await noPage());await shot('wish-carry');
  await fixture('tarot');
  // Known flipped card fixture: tests interpretation rather than random draw.
  await page.evaluate(()=>{start('tarot');state.readCards=[{i:0,rev:false}];state.readFlip=[t-2];state.readFocus=0;state.readStage='focus';state.readAt=t-1;readingFocusMeaning()});
  await page.locator('#dialogue[data-paw-tarot-conversation]').waitFor();assert(await noPage(),'Tarot opened external page');
  assert(await page.evaluate(()=>room==='tarot'&&state.readStage==='focus'&&state.readFocus===0));
  await chatGeometry('tarot');await page.waitForFunction(()=>readingArtwork().naturalWidth===1024&&readingArtwork().naturalHeight===2180);await shot('tarot-card-reading');
  const more=page.locator('#dialogue').getByRole('button',{name:text('Tell me more','再说说'),exact:true});if(await more.count()){await more.tap();await shot('tarot-next-thought')}
  await tapText('Back to the table','回到牌桌');await page.waitForFunction(()=>state.readStage==='cards'&&!talkOpen);
  await fixture('destiny');
  await page.evaluate(()=>{const q=pawReadingAPI().rooms.destiny.stations.destiny;const goal=pawReadingWorld(q.approach);if(!indoorDestination(...goal,()=>yueReadingHub(),'up'))throw Error('Cannot reach consultation chair')});
  await page.waitForFunction(()=>talkOpen&&t-pawYueVisitorLastDraw<.3,null,{timeout:15000});
  assert(await page.evaluate(()=>pawRoomWalkers().length===0),'Private study has unrelated visitors');
  const visibleChoices=await page.locator('#dialogue #choices').evaluate(e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll('button')].filter(b=>!b.hidden).every(b=>{const q=b.getBoundingClientRect();return q.width>=44&&q.height>=44&&q.left>=r.left-1&&q.right<=r.right+1})});
  assert(visibleChoices,'Consultation replies are horizontally clipped');
  await shot('yue-seated-welcome');
  await tapText('My birth chart','生辰命盘');await tapText('For me','看自己');
  const form=page.locator('#dialogue[data-paw-yue-question] .pawYueGuidedForm');
  await form.waitFor({timeout:10000});assert(await noPage(),'Birth questions opened external page');
  await chatGeometry('yue');await page.waitForFunction(()=>t-pawYueVisitorLastDraw<.3);await shot('yue-birth-question');await form.locator('input[type=date]').fill('1990-05-15');
  await tapText('Continue','继续');await form.locator('input[type=time]').fill('09:30');await chatGeometry('yue-time');await shot('yue-birth-time');
  await tapText('Continue','继续');await chatGeometry('yue-place');await shot('yue-birthplace');
  const place=form.locator('details select');if(!await place.isVisible())await form.locator('details summary').tap();
  const choice=await place.evaluate(e=>[...e.options].find(x=>/singapore/i.test(x.textContent)||x.textContent.includes('新加坡'))?.value);assert(choice,'Singapore birthplace option');
  await place.selectOption(choice);
  await form.locator('button[type=submit]').tap();
  await page.waitForFunction(()=>document.querySelector('.ziGrid article:not(.blank)')&&$('page').style.display==='block',null,{timeout:15000});
  assert.equal(await page.locator('#dialogue[data-paw-yue-question]').count(),0);
  await shot('yue-chart');
  const palace=page.locator('.chartTopics [data-topic="8"]');
  await palace.tap();
  assert.equal(await palace.getAttribute('aria-pressed'),'true');
  const share=page.locator('.pawZwdsShareButton');
  await share.scrollIntoViewIfNeeded();
  await share.tap();
  await page.locator('.meowShareStatus').waitFor({timeout:15000});
  await shot('yue-share');
  await captureYueExports('yue-palace');
  await page.locator('#content > .row button').first().tap();
  await page.waitForFunction(()=>room==='destiny'&&$('page').dataset.pawYueDesk==='true'&&document.querySelector('.chartTopics [data-topic="8"][aria-pressed="true"]'),null,{timeout:15000});
  await shot('yue-share-return');
  const full=page.locator('.pawFullChartSharing');
  await full.locator('summary').tap();
  await full.getByRole('button',{name:text('Preview twelve-palace card','预览十二宫纪念卡')}).tap();
  await captureYueExports('yue-full-chart');
  await page.locator('#content > .row button').first().tap();
  await page.waitForFunction(()=>room==='destiny'&&$('page').dataset.pawYueDesk==='true'&&document.querySelector('.chartTopics [data-topic="8"][aria-pressed="true"]'),null,{timeout:15000});
  await page.locator('#content > .row button').first().tap();
  assert(await noPage());assert.equal(await page.locator('#dialogue[data-paw-yue-question]').count(),0);
  await page.evaluate(()=>closeTalk());
  assert.deepEqual(errors,[]);console.log('PASS room-scoped ritual presentation '+width+'x'+height+' '+text('EN','ZH'));
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
