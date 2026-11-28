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
   await click(p.getByRole('button',{name:'Unfold the chart',exact:true}));
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
   await p.locator('.yueReadingFront').waitFor();
   assert(await p.locator('.yueAlmanacForm input[type=date]').inputValue()==='1990-06-15','Date not reused');
   assert(await p.locator('.yueAlmanacForm input[type=date]').isHidden(),'Almanac asked for DOB again');
   await p.screenshot({path:'test-results/'+name+'-yue-almanac.png'});
   await click(p.locator('#content .row button').first());
   await click(p.getByRole('button',{name:'Weekly star signs',exact:true}));
   await click(p.getByRole('button',{name:'For me',exact:true}));
   await click(p.locator('.signNotebookGrid button').nth(2));
   assert(await p.locator('.signNotebookGrid button').nth(2).getAttribute('aria-pressed')==='true','Star sign did not select');
   await openOptions();
   const readingLanguage=p.locator('.pawYueDeskOptions .yueReadingLanguage');
   assert(await readingLanguage.isVisible(),'Reading language control is not reachable');
   await click(readingLanguage);
   assert(await p.locator('html').getAttribute('lang')==='zh','Reading did not switch language');
   assert(await p.locator('.signNotebookGrid button').nth(2).getAttribute('aria-pressed')==='true','Language switch lost sign');
   assert(await p.evaluate(()=>!JSON.stringify(localStorage).includes('1990-06-15')&&!JSON.stringify(localStorage).includes('1995-05-06')),'Birth details persisted');
   // Regression: the consultation is owned by the study, even if an
   // external room transition bypasses its normal back control.
   // This is a lifecycle test, not proof of physical doorway traversal.
   await p.evaluate(()=>{window.__staleYueBack=document.querySelector('#content .row button').onclick;room=null;updateHUD()});
   await p.waitForFunction(()=>document.querySelector('#page').style.display==='none'&&!document.querySelector('#page').dataset.pawYueDesk);
   assert(await p.locator('#content .astroForm,#content .yueAlmanacForm,#content .signNotebookGrid').count()===0,'Consultation survived room departure');
   await p.evaluate(()=>{window.__staleYueBack();delete window.__staleYueBack});
   assert(await p.locator('#page').isHidden(),'Stale consultation reopened outside study');
   assert(await p.locator('.yueReadingMenu').count()===0,'Legacy reading menu reopened outside study');
   assert(errors.length===0,errors.join('; '));
   console.log(name+': Master Yue click-through PASS');
  }catch(e){await p.screenshot({path:'test-results/'+name+'-yue-failure.png'}).catch(()=>{});throw Error(name+': '+e.message+' | '+errors.join('; '))}
  finally{await p.close()}
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
