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
  await page.evaluate(()=>start('wishes'));
  await page.waitForFunction(()=>room==='wishes'&&activity==='wishes'&&!transitioning&&pawRoomImageReady(pawWishLobbyArt())&&state.gardenStage==='write'&&hit.some(h=>h.fn===gardenWrite),null,{timeout:15000});
  const tapWishPoint=async(point)=>{
   const pos=await page.evaluate(point=>{const im=pawWishLobbyArt(),plate=pawReadingCoverPlate(livingBounds(),im.naturalWidth,im.naturalHeight),q=pawWishGroundPoint(plate,point),r=document.querySelector('canvas').getBoundingClientRect();return {x:r.left+cam.ox+q.x*cam.scale,y:r.top+cam.oy+q.y*cam.scale}},point);
   await page.touchscreen.tap(pos.x,pos.y);
  };
  await tapWishPoint(await page.evaluate(()=>pawWishGroundPaper));
  const paper=page.locator('#dialogue.pawWishWriting .pawWishPaper textarea');
  await paper.waitFor({timeout:10000});assert(await noPage(),'Wish opened external page');
  await chatGeometry('wish',.28);await shot('wish-blank');
  await paper.fill('A quiet day with a little sunshine');
  await tapText('Fold into a lantern','折进心愿灯');
  await page.waitForFunction(()=>state.gardenStage==='carry'&&!talkOpen);
  assert(await noPage());await shot('wish-carry');
  const wishGeometry=await page.evaluate(()=>{const im=pawWishLobbyArt(),plate=pawReadingCoverPlate(livingBounds(),im.naturalWidth,im.naturalHeight);return {foot:pawWishGroundFoot,paper:pawWishGroundPaper,hook:pawWishRackPoint(0),plate:!!plate}});
  assert(wishGeometry.plate&&wishGeometry.foot[1]>wishGeometry.paper[1]&&wishGeometry.hook[0]>.7&&wishGeometry.hook[1]<.3,'Wish staging must follow the painted kiosk and rack');
  const count=await page.evaluate(()=>gardenWishes.length);
  await tapWishPoint(wishGeometry.hook);
  await page.waitForFunction(()=>!!state.pawWishWalk,null,{timeout:8000});
  await shot('wish-walking');
  await page.waitForFunction(count=>gardenWishes.length===count+1&&state.gardenStage==='write',count,{timeout:15000});
  assert(await page.evaluate(()=>!state.pendingGardenWish&&gardenWishes.at(-1).slot===0));
  await shot('wish-hung-returned');
  await fixture('tarot');
  // Known flipped card fixture: tests interpretation rather than random draw.
  await page.evaluate(()=>{start('tarot');state.readCards=[{i:0,rev:false}];state.readFlip=[t-2];state.readFocus=0;state.readStage='focus';state.readAt=t-1;readingFocusMeaning()});
  await page.locator('#dialogue[data-paw-tarot-conversation]').waitFor();assert(await noPage(),'Tarot opened external page');
  assert(await page.evaluate(()=>room==='tarot'&&state.readStage==='focus'&&state.readFocus===0));
  assert.match(await page.locator('#dialogue #line').textContent(),zhMode?/抽到的是/:/you've drawn/);
  await chatGeometry('tarot',.40);
  await page.waitForFunction(()=>state.pawTarotSeatDrawn===true,null,{timeout:12000});
  assert(await page.evaluate(()=>{const im=pawReadingImage(pawReadingAPI(),'tarot'),p=pawReadingCoverPlate(livingBounds(),im.naturalWidth,im.naturalHeight),q=pawTarotTravellerChair(p);return q.hip.x>p.x+p.w*.8&&q.hip.y>p.y+p.h*.5&&q.hip.y<p.y+p.h*.56}),'Traveller must sit on the actual right chair');
  assert(await page.locator('#dialogue #choices').evaluate(n=>n.scrollWidth<=n.clientWidth+2),'Tarot replies must fit the screen');await page.waitForFunction(()=>readingArtwork().naturalWidth===1024&&readingArtwork().naturalHeight===2180);await shot('tarot-card-reading');
  const more=page.locator('#dialogue').getByRole('button',{name:text('Tell me more','再说说'),exact:true});if(await more.count()){await more.tap();await shot('tarot-next-thought')}
  assert.match(await page.locator('#dialogue #line').textContent(),zhMode?/。|？/:/[.!?]/,'Card interpretation must be dialogue');
  await tapText('What about work?','事业呢？');assert(await noPage());await shot('tarot-work-reply');
  await tapText('Back to our reading','继续聊牌意');assert(await noPage());
  await tapText('Back to the table','回到牌桌');await page.waitForFunction(()=>state.readStage==='cards'&&!talkOpen);
  await fixture('destiny');
  await page.evaluate(()=>yueReadingHub());
  await tapText('My birth chart','生辰命盘');await tapText('For me','看自己');
  const form=page.locator('#dialogue[data-paw-yue-question] .pawYueGuidedForm');
  await form.waitFor({state:'attached',timeout:10000});assert(await noPage(),'Birth questions opened external page');
  assert.equal(await page.locator('#dialogue[data-paw-yue-reply] #line').textContent(),text('When were you born?','你是哪天出生的？'));
  assert.equal(await form.evaluate(n=>getComputedStyle(n).display),'contents','Internal form must not render a separate box');
  const reply=page.locator('#dialogue .pawYueTypedReply input'),send=page.locator('#dialogue .pawYueTypedReply button');
  await reply.waitFor();
  assert.equal(await page.locator('#dialogue input:visible,#dialogue select:visible').count(),1,'One typed reply only');
  assert.equal(await form.locator('button:visible').count(),0,'No duplicate continue and previous buttons');
  await chatGeometry('yue',.44);await shot('yue-birth-question');
  await reply.fill('02301990');await reply.press('Enter');
  assert(await page.locator('.pawYueReplyError').isVisible(),'Invalid date must stay in current turn');
  await reply.fill('05151990');await reply.press('Enter');
  assert.equal(await page.locator('#dialogue #line').textContent(),text('What time were you born?','你几点出生的？'));
  assert.equal(await page.locator('#dialogue input:visible,#dialogue select:visible').count(),1);
  await reply.fill('0930');await chatGeometry('yue-time',.44);await shot('yue-birth-time');await send.tap();
  assert.equal(await page.locator('#dialogue #line').textContent(),text('Where were you born?','你在哪里出生的？'));
  assert.equal(await page.locator('#dialogue input:visible,#dialogue select:visible').count(),1);
  await chatGeometry('yue-place',.44);await shot('yue-birthplace');
  await reply.fill(text('Singapore','新加坡'));
  assert.equal(await form.locator('input[type=number]:visible').count(),0,'Known birthplace must not expose technical fields');
  assert.deepEqual(await page.evaluate(()=>pawYueLocalBirth('0','1980-05-15','09:30')),[7.5,1.35,103.82]);
  await shot('yue-place-confirmed');await reply.press('Enter');
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
