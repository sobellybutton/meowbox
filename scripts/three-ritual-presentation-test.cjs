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
  await page.evaluate(()=>yueReadingHub());
  await tapText('My birth chart','生辰命盘');await tapText('For me','看自己');
  const form=page.locator('#dialogue[data-paw-yue-question] .pawYueGuidedForm');
  await form.waitFor({timeout:10000});assert(await noPage(),'Birth questions opened external page');
  await chatGeometry('yue');await shot('yue-birth-question');await form.locator('input[type=date]').fill('1990-05-15');
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
  await page.locator('#content > .row button').first().tap();
  await page.waitForFunction(()=>room==='destiny'&&$('page').dataset.pawYueDesk==='true'&&document.querySelector('.chartTopics [data-topic="8"][aria-pressed="true"]'),null,{timeout:15000});
  await shot('yue-share-return');
  await page.locator('#content > .row button').first().tap();
  assert(await noPage());assert.equal(await page.locator('#dialogue[data-paw-yue-question]').count(),0);
  await page.evaluate(()=>closeTalk());
  assert.deepEqual(errors,[]);console.log('PASS room-scoped ritual presentation '+width+'x'+height+' '+text('EN','ZH'));
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
