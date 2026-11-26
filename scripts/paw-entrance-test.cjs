const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url=process.env.PAW_TEST_URL||'http://127.0.0.1:8772/index.html';
const engine=process.env.PAW_BROWSER==='webkit'?webkit:chromium;
const sizes=[[320,568],[360,640],[390,844],[768,1024],[844,390],[1280,720],[1440,900],[1792,864]];
fs.mkdirSync('test-results/entrance',{recursive:true});
(async()=>{
 const browser=await engine.launch();
 const failures=[];
 for(const [width,height] of sizes)for(const language of ['EN','中文']){
  const name=width+'x'+height+'-'+(language==='EN'?'en':'zh');
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<900,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const shot=stage=>page.screenshot({path:'test-results/entrance/'+name+'-'+stage+'.png'});
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
   for(let i=0;i<4;i++){
    const choice=choices.nth(i);await reachable(choice,'Avatar '+i);await choice.click();
    assert.equal(await choice.getAttribute('aria-pressed'),'true');
    assert(await page.evaluate(i=>proAvatar===i,i),'Wrong selected avatar');
    const image=proposal.locator('.pawEntranceAvatar');
    await image.evaluate(im=>im.decode());
    await image.evaluate(im=>im.decode());await page.waitForFunction(()=>document.querySelector('.pawEntranceAvatar')?.dataset.pawArtReady==='true');const bounds=await image.boundingBox();assert(bounds&&bounds.width>40&&bounds.height>=(width>=850?180:115),'Avatar not fully sized');const thumb=choice.locator('img');await thumb.evaluate(im=>im.decode());await page.waitForFunction(i=>document.querySelector('.pawAvatarOption[data-avatar="'+i+'"] img')?.dataset.pawArtReady==='true',i);const tb=await thumb.boundingBox();assert(tb&&tb.height>=48,'Avatar thumbnail undersized');
    assert(await proposal.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Character screen horizontal overflow');
    await shot('avatar-'+i);
   }
   const turn=proposal.locator('.pawAvatarTurn button');await reachable(turn,'Turn around');await turn.click();
   assert(await page.evaluate(()=>proDir===1),'Turn did not change view');
   await reachable(next,'Confirm avatar');await next.click();
   const persona=proposal.locator('.pawPersonaChoices button').first();await reachable(persona,'Persona');await shot('persona');await persona.click();
   const arrive=proposal.locator('.rail-arrive');await arrive.waitFor({timeout:20000});await reachable(arrive,'Arrive');
   await shot('train');await arrive.click();
   const gate=proposal.locator('.shrine-enter');await gate.waitFor({timeout:20000});await reachable(gate,'Enter valley');await shot('gate');
   await gate.click();await proposal.waitFor({state:'hidden',timeout:30000});
   assert(await page.evaluate(()=>avatar===3&&playerName==='Traveller 旅人'),'Player identity not preserved');
   await page.locator('#dock').waitFor({state:'visible'});await shot('first-walk');const dock=await page.locator('#dock').boundingBox();assert(dock&&dock.y>=0&&dock.y+dock.height<=height+1,'Dock clipped');assert.deepEqual(errors,[],'Page errors');
   console.log('PASS '+name);
  }catch(e){failures.push(name+': '+e.message);await shot('FAIL').catch(()=>{});console.error(name,e.message)}
  finally{await page.close()}
 }
 await browser.close();
 if(failures.length)throw Error(failures.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1});
