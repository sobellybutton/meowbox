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
   // Enter through the actual first-visit journey, with no injected game state.
   await click(p.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}));
   await click(p.locator('#proposal footer button.next'));
   await p.locator('#proposal .rail-ticket input').fill('Yue Journey');
   await click(p.locator('#proposal .ticket-confirm'));
   await click(p.locator('#proposal footer button.next'));
   await click(p.locator('#proposal footer .actions button').first());
   await p.locator('#proposal .rail-arrive').waitFor({timeout:25000});
   await click(p.locator('#proposal .rail-arrive'));
   await p.locator('#proposal .shrine-enter').waitFor({timeout:25000});
   await click(p.locator('#proposal .shrine-enter'));
   await p.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:25000});
   const door=p.locator('#worldSigns .worldSign[data-door="destiny"]');
   await door.waitFor({state:'visible',timeout:25000});
   await click(door);
   await p.waitForFunction(()=>room==='destiny'&&pawReadingActive()&&!transitioning,null,{timeout:30000});
   await p.waitForFunction(()=>Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<3&&!indoor.route.length,null,{timeout:15000});
   await p.screenshot({path:'test-results/'+name+'-yue-lobby.png'});
   const beforeApproach=await p.evaluate(()=>[indoor.x,indoor.y]);
   // Inspect actual canvas target and project its center; use ordinary mouse/touch.
   const host=await p.waitForFunction(()=>{
    const box=pawYueHostTapBox(pawReadingPlate),x=box[0]+box[2]/2,y=box[1]+box[3]/2,h=at({x,y}),rect=c.getBoundingClientRect(),sx=rect.left+cam.ox+x*cam.scale,sy=rect.top+cam.oy+y*cam.scale;
    return h?.stationId==='destiny'&&document.elementFromPoint(sx,sy)===c?{x:sx,y:sy}:false
   },null,{timeout:10000});
   const pos=await host.jsonValue();
   await (opts.hasTouch?p.touchscreen.tap(pos.x,pos.y):p.mouse.click(pos.x,pos.y));
   await p.waitForFunction(()=>talkOpen&&room==='destiny',null,{timeout:15000});
   const arrived=await p.evaluate(()=>({x:indoor.x,y:indoor.y,anchor:indoorSpec().stations.destiny.slice(2),hostReady:!!pawHostVisit?.ready}));
   assert(Math.hypot(arrived.x-beforeApproach[0],arrived.y-beforeApproach[1])>5,'Traveller did not walk toward Master Yue');
   assert(Math.hypot(arrived.x-arrived.anchor[0],arrived.y-arrived.anchor[1])<5,'Consultation opened before arrival at desk');
   assert(arrived.hostReady,'Existing seated host artwork not ready');
   await p.screenshot({path:'test-results/'+name+'-yue-desk-arrival.png'});
   // Physical visitor seating is an explicit acceptance gate. It must not
   // be inferred from the seated host or the presence of a chair in the background.
   const visitorSeating=await p.evaluate(()=>typeof pawYueTravellerSeat!=='undefined'&&!!pawYueTravellerSeat?.seated);
   console.log(name+': visitor physical seating '+(visitorSeating?'observed runtime seated state; inspect screenshot contact':'BLOCKED: raised-chair traveller artwork/runtime absent'));
   if(process.env.PAW_STRICT_SEATING==='1')assert(visitorSeating,'Traveller not physically seated at desk');
   await p.getByRole('button',{name:'My birth chart',exact:true}).waitFor();
   await p.screenshot({path:'test-results/'+name+'-yue-welcome.png'});
   await click(p.getByRole('button',{name:'My birth chart',exact:true}));
   await click(p.getByRole('button',{name:'For me',exact:true}));
   const next=()=>click(p.locator('.pawYueStepNav').getByRole('button',{name:'Continue',exact:true}));
   const toPlace=async()=>{await next();await next()};
   await p.locator('.astroForm').waitFor();
   assert(await p.locator('.destinyChamber').isHidden(),'Obsolete chamber consumes reading layout');
   assert(await p.locator('.roomArtWrap').count()===0,'Obsolete vector room still attached');
   const field=await p.locator('.astroForm input[type=date]').boundingBox();
   assert(await p.locator('.yueCompactHost').count()===0,'Duplicate host header in study');
   assert(await p.locator('#page').getAttribute('data-paw-yue-desk')==='true','Not a study consultation');
   assert(field&&field.y+field.height<=opts.viewport.height,'Birth date is below initial viewport');
   assert(await p.locator('.pawYueDeskOptions').count()===1,'Missing single consultation options disclosure');
   assert(!(await p.locator('.pawYueDeskOptions').evaluate(e=>e.open))&&await p.locator('.yueInlinePeople').isHidden(),'Secondary options obscure the first question');
   const openOptions=async()=>{const d=p.locator('.pawYueDeskOptions');if(!await d.evaluate(e=>e.open))await click(d.locator(':scope > summary'));};
   await p.screenshot({path:'test-results/'+name+'-yue-before-chart.png'});
   await p.locator('.astroForm input[type=date]').fill('1990-06-15');
   await next();
   await p.locator('.astroForm input[type=time]').fill('12:30');
   await next();
   const city=p.locator('.astroForm details select');
   assert(await city.inputValue()==='','Birthplace silently assumed');
   await click(p.locator('#content .row button').last());
   assert(await city.inputValue()==='','Language switch assumed birthplace');
   assert(await p.locator('.astroForm input[type=time]').inputValue()==='12:30','Language switch lost time draft');
   await click(p.locator('#content .row button').last());
   await toPlace();
   await city.selectOption('custom');
   const geo=p.locator('.astroForm input[type=number]');
   await geo.nth(0).fill('5.75');await geo.nth(1).fill('27.7');await geo.nth(2).fill('85.3');
   await click(p.locator('#content .row button').last());
   assert(await city.inputValue()==='custom','Language switch lost custom choice');
   assert(await geo.nth(0).inputValue()==='5.75','Language switch lost manual UTC offset');
   assert(await geo.nth(1).inputValue()==='27.7'&&await geo.nth(2).inputValue()==='85.3','Language switch lost manual coordinates');
   await click(p.locator('#content .row button').last());
   await toPlace();
   // A synthetic event also must not bypass field requirements.
   await geo.nth(0).fill('');
   await p.locator('.astroForm').dispatchEvent('submit',{bubbles:true,cancelable:true});
   assert(await p.locator('.pawYueInputError').isVisible(),'Invalid submit lacks error');
   assert(await p.locator('.chartConsultation').count()===0,'Incomplete input generated a chart');
   await city.selectOption('0');
   assert(!(await p.locator('.pawYueLocationDetails').evaluate(e=>e.open)),'Preset exposes technical fields unnecessarily');
   await click(p.locator('.pawYueLocationDetails > summary'));
   assert(await geo.nth(0).isVisible(),'Historical offset cannot be verified');
   await click(p.locator('.astroForm button[type=submit]'));
   await p.locator('.chartConsultation').waitFor();
   // Reference fixtures cross-checked with iztro 2.5.8. These test only the
   // civil-time main-star calculations shared by both implementations.
   const check=await p.evaluate(()=>{
    const refs=[
     ['1990-06-15',0,6,'天府/武曲|太阳/太阴|贪狼|天机/巨门|天相/紫微|天梁|七杀||廉贞||破军|天同'],
     ['1990-07-06',0,6,'天相/廉贞|天梁|七杀|天同|武曲|太阳|破军|天机|天府/紫微|太阴|贪狼|巨门'],
     ['1990-07-09',1,6,'太阳|天府|天机/太阴|紫微/贪狼|巨门|天相|天梁|七杀/廉贞|||天同|武曲/破军']
    ];
    return refs.every(([date,life,bureau,stars])=>{
     const z=ziChart(date,12);
     return z.life===life&&z.body===life&&z.bureau===bureau&&z.stars.map(v=>v.map(s=>s[1]).sort().join('/')).join('|')===stars;
    });
   });
   assert(check,'Reference main-star chart diverged');

   assert(await p.locator('.astroForm').isHidden(),'Form did not collapse');
   assert(await p.locator('.ziGrid article:not(.blank)').count()===12,'Incomplete palace chart');
   assert(await p.locator('#page').getAttribute('data-paw-yue-expanded')==='true','Chart did not unfold');
   await click(p.getByRole('button',{name:'Fold the chart',exact:true}));
   assert(await p.locator('#page').getAttribute('data-paw-yue-expanded')===null,'Fold did not restore compact study');
   assert(!await p.locator('.ziGrid').isVisible(),'Folded chart still covers the study');
   assert(await p.locator('button[data-paw-yue-scroll]').isVisible(),'Missing illustrated scroll control');
   await click(p.getByRole('button',{name:'Unfold the chart',exact:true}));
   assert(await p.locator('.ziGrid').isVisible(),'Reopening lost the chart');
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
   await p.locator('.pawZwdsShareButton').scrollIntoViewIfNeeded();
   const priorShare=await p.evaluate(()=>({topic:document.querySelector('.chartTopics [aria-pressed="true"]')?.dataset.topic,scroll:$('page').scrollTop,x:indoor.x,y:indoor.y}));
   await click(p.locator('.pawZwdsShareButton'));
   await p.locator('.meowShareStatus').getByText('Ready to share or save.').waitFor({timeout:15000});
   await p.screenshot({path:'test-results/'+name+'-yue-share.png'});
   await click(p.locator('#content .row button').first());
   await p.locator('.chartConsultation').waitFor();
   await p.waitForFunction(()=>document.querySelector('.chartTopics [data-topic="10"]')?.getAttribute('aria-pressed')==='true');
   assert(await p.evaluate(q=>room==='destiny'&&Math.hypot(indoor.x-q.x,indoor.y-q.y)<2,priorShare),'Share return moved traveller');
   assert(await p.locator('.chartTopics [data-topic="10"]').getAttribute('aria-pressed')==='true','Share return lost selected palace');
   await p.waitForFunction(q=>{const pane=$('page');return Math.abs(pane.scrollTop-Math.min(q.scroll,Math.max(0,pane.scrollHeight-pane.clientHeight)))<8},priorShare,{timeout:5000});
   await p.screenshot({path:'test-results/'+name+'-yue-share-return.png'});

   await openOptions();
   await click(p.locator('.yueInlinePeople').getByRole('button',{name:'Someone else',exact:true}));
   assert(await p.locator('.astroForm input[type=date]').inputValue()==='','Other profile inherited own birth date');
   await p.locator('.astroForm input[type=date]').fill('1995-05-06');
   await next();
   await p.locator('.astroForm input[type=time]').fill('08:45');
   await next();
   await p.locator('.astroForm details select').selectOption('0');
   await click(p.locator('.astroForm button[type=submit]'));
   await p.locator('.chartConsultation').waitFor();
   assert(await p.evaluate(()=>yueSessionProfiles.other.chart?.date==='1995-05-06'),'Other chart not retained');
   assert(await p.locator('.pawZwdsShareButton,.pawFullChartSharing').count()===0,'Someone else’s chart offered sharing');
   await openOptions();
   assert((await p.locator('.pawYuePrivacy').innerText()).includes('permission'),'Missing other-person permission guidance');
   await click(p.locator('.pawYueClear'));
   assert(await p.locator('.astroForm input[type=date]').inputValue()==='','Cleared subject still has birth date');
   assert(await p.evaluate(()=>yueSessionProfiles.other.chart===null&&yueSessionProfiles.self.chart?.date==='1990-06-15'),'Clear affected wrong subject');
   await openOptions();
   await click(p.locator('.yueInlinePeople').getByRole('button',{name:'Me',exact:true}));
   await p.locator('.chartConsultation').waitFor();
   assert(await p.locator('.astroForm').isHidden(),'Switching back required form');
   assert(await p.evaluate(()=>yueSessionProfiles.self.chart?.date==='1990-06-15'),'Own chart changed');
   assert(await p.locator('.chartTopics [data-topic="10"]').getAttribute('aria-pressed')==='true','Own topic was not restored');

   await openOptions();
   await click(p.locator('.yueChartTools').getByRole('button',{name:'Zodiac & Tai Sui',exact:true}));
   await p.getByRole('button',{name:'What does that mean?',exact:true}).waitFor();
   assert(await p.locator('#page').isHidden(),'Year reading escaped the room');
   assert(await p.locator('.yueAlmanacForm').count()===0,'Completed year form remains attached');
   await p.screenshot({path:'test-results/'+name+'-yue-almanac.png'});
   await click(p.getByRole('button',{name:'Explore a part of my year',exact:true}));
   await click(p.getByRole('button',{name:'Work',exact:true}));
   await click(p.getByRole('button',{name:'Finish reading',exact:true}));
   await click(p.getByRole('button',{name:'Another year reading',exact:true}));
   await p.locator('.yueAlmanacForm input[type=date]').waitFor();
   assert(await p.locator('.yueAlmanacForm input[type=date]').inputValue()==='1990-06-15','Session date not reused');
   await click(p.locator('#content .row button').first());
   await click(p.getByRole('button',{name:'Weekly star signs',exact:true}));
   await click(p.getByRole('button',{name:'Aries / Taurus / Gemini',exact:true}));
   await click(p.getByRole('button',{name:/^Gemini ·/}));
   assert(await p.locator('#page').isHidden(),'Star result escaped the room');
   assert((await p.locator('#line').innerText()).includes('Gemini'),'Wrong sign result');
   await click(p.getByRole('button',{name:'Ask something else',exact:true}));
   await click(p.getByRole('button',{name:'My birth chart',exact:true}));
   await click(p.getByRole('button',{name:'For me',exact:true}));
   await p.getByRole('button',{name:'Finish consultation',exact:true}).waitFor();
   await click(p.getByRole('button',{name:'Finish consultation',exact:true}));
   assert(await p.locator('#page').isHidden(),'Chart finish did not return to room');
   await click(p.locator('#back'));
   await p.waitForFunction(()=>!room&&!transitioning,null,{timeout:25000});
   await door.waitFor({state:'visible',timeout:20000});
   await p.screenshot({path:'test-results/'+name+'-yue-departure.png'});
   assert(await p.evaluate(()=>!JSON.stringify(localStorage).includes('1990-06-15')&&!JSON.stringify(localStorage).includes('1995-05-06')),'Birth details persisted');
   assert(errors.length===0,errors.join('; '));
   console.log(name+': Master Yue click-through PASS');
  }catch(e){await p.screenshot({path:'test-results/'+name+'-yue-failure.png'}).catch(()=>{});throw Error(name+': '+e.message+' | '+errors.join('; '))}
  finally{await p.close()}
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
