const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url=process.env.PAW_TEST_URL||'http://127.0.0.1:8772/index.html';
const engine=process.env.PAW_BROWSER==='webkit'?webkit:chromium;
const sizes=process.env.PAW_VIEWPORT?[process.env.PAW_VIEWPORT.split('x').map(Number)]:[[320,568],[360,640],[390,844],[768,1024],[844,390],[1280,720],[1440,900],[1792,864]];
const languages=process.env.PAW_LANGUAGE?[process.env.PAW_LANGUAGE]:['EN','中文'],motions=process.env.PAW_MOTION?[process.env.PAW_MOTION]:['reduce','no-preference'];
fs.mkdirSync('test-results/entrance',{recursive:true});
(async()=>{
 const browser=await engine.launch();
 const failures=[];
 for(const [width,height] of sizes)for(const language of languages)for(const motion of motions){
  const name=width+'x'+height+'-'+(language==='EN'?'en':'zh')+'-'+motion;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<900,reducedMotion:motion});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const shot=async stage=>{
   if(process.env.PAW_FOUNDATION==='1'){
    const words=await page.locator('body').innerText();
    assert(!/\bNPCs?\b|non.player character|fictional (?:residents?|guests?|visitors?|characters?)|虚构(?:居民|来客|角色|客串角色)|非玩家角色|电脑对手/i.test(words),'Out-of-world wording visible at '+stage);
   }
   await page.screenshot({path:'test-results/entrance/'+name+'-'+stage+'.png'});
  };
  async function reachable(locator,label){
   await locator.scrollIntoViewIfNeeded();
   const result=await locator.evaluate(el=>{
    const r=el.getBoundingClientRect(),at=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    return {width:r.width,height:r.height,hit:el.contains(at),inView:r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1}
   });
   assert(result.width>=44&&result.height>=44&&result.hit&&result.inView,label+' obstructed: '+JSON.stringify(result));
  }
  try{
   await page.goto(url,{waitUntil:'domcontentloaded'});
   const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
   await next.waitFor({timeout:45000});
   await proposal.locator('.languageChoice').getByRole('button',{name:language,exact:true}).click();
   await proposal.locator('.pawFirstRailPainting img').evaluate(im=>im.decode());assert.equal(await proposal.locator('.cinema-world').isVisible(),false,'Passport backdrop still visible');await shot('station');await next.click();
   const ticket=proposal.locator('.rail-ticket'),input=ticket.locator('input'),go=ticket.locator('.ticket-confirm');
   await ticket.waitFor();
   assert.equal(await proposal.locator('.rail-platform-coach').count(),0,'Legacy coach present');
   assert.equal(await proposal.locator('.cinema-world').isVisible(),false,'Map art visible behind ticket');
   await reachable(input,'Ticket signature');await input.fill('Traveller 旅人');
   await reachable(go,'Collect ticket');
   assert(await proposal.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Horizontal overflow');
   await shot('ticket');await go.click();
   await proposal.locator('.pawAvatarGallery').waitFor();
   const choices=proposal.locator('.pawAvatarOption');assert.equal(await choices.count(),4);
   const chosenFamily=await proposal.locator('.pawEntranceAvatar').getAttribute('data-paw-crop-family');
   assert.equal(chosenFamily,'painted','Use current painted family from first frame');
   for(let i=0;i<4;i++){
    const choice=choices.nth(i);await reachable(choice,'Avatar '+i);await choice.click();
    assert.equal(await choice.getAttribute('aria-pressed'),'true');
    assert(await page.evaluate(i=>proAvatar===i,i),'Wrong selected avatar');
    const image=proposal.locator('.pawEntranceAvatar');
    await image.evaluate(im=>im.decode());
    await image.evaluate(im=>im.decode());await page.waitForFunction(()=>document.querySelector('.pawEntranceAvatar')?.dataset.pawArtReady==='true');const bounds=await image.boundingBox();assert(bounds&&bounds.width>40&&bounds.height>=(width>=850?180:115),'Avatar not fully sized');const thumb=choice.locator('img');await thumb.evaluate(im=>im.decode());await page.waitForFunction(i=>document.querySelector('.pawAvatarOption[data-avatar="'+i+'"] img')?.dataset.pawArtReady==='true',i);const tb=await thumb.boundingBox();assert(tb&&tb.height>=48,'Avatar thumbnail undersized');
    assert(await proposal.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Character screen horizontal overflow');
    assert.equal(await image.getAttribute('data-paw-crop-family'),chosenFamily,'Family changed during selection');
    assert.equal(await thumb.getAttribute('data-paw-crop-family'),chosenFamily,'Thumbnail family differs');
    const source=await image.getAttribute('src');
    assert(/^assets\/visual\/painted\/player-[0-3]\/walk\//.test(source),'Legacy avatar source');
    await page.evaluate(async()=>{if(pawEntranceWarmJob)await pawEntranceWarmJob});
    assert.equal(await image.getAttribute('src'),source,'Displayed avatar was replaced by late crop');
    await shot('avatar-'+i);
   }
   const backTicket=proposal.locator('.pawEntranceBack');await reachable(backTicket,'Back to ticket');await backTicket.click();assert.equal(await input.inputValue(),'Traveller 旅人','Ticket signature lost');await go.click();await choices.nth(3).waitFor();assert.equal(await choices.nth(3).getAttribute('aria-pressed'),'true','Avatar lost on back');
   const turn=proposal.locator('.pawAvatarTurn button');await reachable(turn,'Turn around');await turn.click();
   assert(await page.evaluate(()=>proDir===1),'Turn did not change view');
   const turned=proposal.locator('.pawEntranceAvatar');
   await turned.evaluate(im=>im.decode());
   const turnFamily=await turned.getAttribute('data-paw-crop-family');
   assert.equal(await proposal.locator('.pawAvatarOption[data-avatar="3"] img').getAttribute('data-paw-crop-family'),turnFamily,'Turn changed artwork family');

   await reachable(next,'Confirm avatar');await next.click();
   const persona=proposal.locator('.pawPersonaChoices button').first();await reachable(persona,'Persona');await shot('persona');if(motion==='no-preference'){const skip=proposal.locator('.pawIntentSkip');await reachable(skip,'Optional travel intention');await skip.click()}else await persona.click();
   const arrive=proposal.locator('.rail-arrive');await arrive.waitFor({timeout:20000});await reachable(arrive,'Arrive');
   await shot('train');
   const pause=proposal.locator('.pawFirstRailPause');await reachable(pause,'Pause journey');await pause.click();
   assert.equal(await pause.getAttribute('aria-pressed'),'true');const elapsed=await page.evaluate(()=>pawFirstRailState.elapsed);
   await page.waitForTimeout(800);assert(await page.evaluate(before=>pawFirstRailState.paused&&Math.abs(pawFirstRailState.elapsed-before)<1,elapsed),'Paused train clock advanced');
   await shot('train-paused');await pause.click();assert.equal(await pause.getAttribute('aria-pressed'),'false');
   if(motion==='no-preference'){await page.waitForTimeout(600);await shot('train-moving');await proposal.locator('.shrine-enter').waitFor({timeout:30000})}else await arrive.click();
   const gate=proposal.locator('.shrine-enter');await gate.waitFor({timeout:20000});await reachable(gate,'Enter valley');await proposal.locator('.mbGatePainting').evaluate(im=>im.decode());assert.equal(await proposal.locator('.cinema-world').isVisible(),false,'Old entrance artwork still visible');assert.equal(await proposal.locator('.rail-revisit,.shrine-speaker').count(),0,'Redundant gate content');const sceneBounds=await proposal.locator('.hero').boundingBox();assert(sceneBounds&&sceneBounds.height>=height*.28,'Gate illustration too small');assert(await proposal.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Gate horizontal overflow');await shot('gate');
   assert(/^assets\/visual\/painted\/player-[0-3]\/walk\/up-0\.webp$/.test(await proposal.locator('.gate-traveller').getAttribute('src')),'Gate shows current sprite');
   await gate.click();if(motion==='no-preference'){await page.waitForTimeout(450);await shot('gate-walk')}await proposal.waitFor({state:'hidden',timeout:30000});
   assert(await page.evaluate(()=>avatar===3&&playerName==='Traveller 旅人'),'Player identity not preserved');
   await page.locator('#dock').waitFor({state:'visible'});await shot('first-walk');const dock=await page.locator('#dock').boundingBox();assert(dock&&dock.y>=0&&dock.y+dock.height<=height+1,'Dock clipped');assert.deepEqual(errors,[],'Page errors');
   if(process.env.PAW_FOUNDATION==='1'){
    await page.waitForFunction(()=>!transitioning&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:30000});
    const dockRoot=page.locator('#dock'),buttons=dockRoot.locator('button:visible');
    assert.equal(await buttons.count(),4,'Exactly four dock choices');
    const ids=['dockTravel','dockScoop','dockValley','dockOwnHome'];
    assert.deepEqual(await buttons.evaluateAll(nodes=>nodes.map(n=>n.id)),ids);
    const dimensions=await buttons.evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,label:n.getAttribute('aria-label')})));
    assert(dimensions.every(v=>v.w>=44&&v.h>=50&&v.label),'Dock buttons clipped or unlabelled');
    assert(Math.max(...dimensions.map(v=>v.w))-Math.min(...dimensions.map(v=>v.w))<2,'Uneven dock widths');
    await page.waitForFunction(()=>[...document.querySelectorAll('#worldSigns .worldSign[data-door]')].some(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0&&getComputedStyle(e).visibility!=='hidden'}),null,{timeout:15000});
    await shot('mobile-foundation-map');
    // Start each root through real dock input on the first map. The explicit
    // page close control must return to the same scene and player position.
    for(const id of ids){
     const before=await page.evaluate(()=>({scene,x:p.x,y:p.y}));
     const nav=page.locator('#'+id);await reachable(nav,id);await nav.tap();
     await page.waitForFunction(()=>$('page').style.display==='block',null,{timeout:15000});
     await shot('dock-'+id);
     const back=page.locator('#content > .row button').first();
     await back.waitFor({state:'visible',timeout:8000});
     await back.tap();
     await page.waitForFunction(()=>$('page').style.display!=='block',null,{timeout:15000});
     const after=await page.evaluate(()=>({scene,x:p.x,y:p.y}));
     assert.equal(after.scene,before.scene,'Dock return changed district');
     assert(Math.hypot(after.x-before.x,after.y-before.y)<3,'Dock return moved traveller');
    }
   }
   await page.reload({waitUntil:'domcontentloaded'});const returnGate=proposal.locator('.shrine-enter');await returnGate.waitFor({timeout:45000});await proposal.locator('.mbGatePainting').evaluate(im=>im.decode());assert.equal(await proposal.locator('.rail-revisit,.shrine-speaker').count(),0,'Return screen still has redundant controls');assert.equal(await proposal.locator('.cinema-world').isVisible(),false,'Return shows fallback art');await reachable(returnGate,'Return ticket entry');await shot('return-ticket');await returnGate.click();await proposal.waitFor({state:'hidden',timeout:20000});assert(await page.evaluate(()=>avatar===3&&playerName==='Traveller 旅人'),'Return identity changed');assert.deepEqual(errors,[],'Return page errors');console.log('PASS '+name);
  }catch(e){failures.push(name+': '+e.message);await shot('FAIL').catch(()=>{});console.error(name,e.message)}
  finally{await page.close()}
 }
 await browser.close();
 if(failures.length)throw Error(failures.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1});
