'use strict';
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.PAW_URL||'http://127.0.0.1:8775/index.html';
const browserName=process.env.PAW_BROWSER||'chromium',engine=browserName==='webkit'?webkit:chromium;
const out='test-results/entry-recovery';
fs.mkdirSync(out,{recursive:true});
const profiles=[
 ['phone-en',{viewport:{width:390,height:844},isMobile:true,hasTouch:true},'EN'],
 ['desktop-zh',{viewport:{width:1440,height:900}},'中文']
];
async function metrics(page){
 return page.evaluate(()=>({paint:performance.getEntriesByType('paint').map(e=>({name:e.name,ms:Math.round(e.startTime)})),nav:performance.getEntriesByType('navigation').map(e=>({type:e.type,dom:Math.round(e.domContentLoadedEventEnd),bytes:e.transferSize})),resources:performance.getEntriesByType('resource').filter(e=>e.name.includes('/src/')).map(e=>({path:new URL(e.name).pathname,ms:Math.round(e.duration),bytes:e.transferSize})),marks:performance.getEntriesByType('mark').filter(e=>e.name.startsWith('paw:')).map(e=>({name:e.name,ms:Math.round(e.startTime)}))}));
}
async function enterMap(page,click){
 const start=Date.now();
 await click(page.locator('#proposal .shrine-enter'));
 await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden&&!transitioning,null,{timeout:30000});
 const state=await page.evaluate(()=>({avatar,name:playerName,scene,room,coins:typeof coins==='number'?coins:null,x:p.x,y:p.y}));
 assert.equal(state.scene,'fortune');assert.equal(state.room,null);
 const canvas=await page.locator('#c').boundingBox(),vp=page.viewportSize();
 assert.ok(canvas&&Math.abs(canvas.width-vp.width)<3&&Math.abs(canvas.height-vp.height)<3,'Map does not fill viewport');
 return {ms:Date.now()-start,state};
}
async function firstMovement(page,click){
 // Walk through ordinary visible station/door inputs, never modify the game
 // state. The closest Tarot plaque is also an observable first discovery.
 const door=page.locator('#worldSigns .worldSign[data-door="tarot"]');
 await door.waitFor({state:'visible',timeout:20000});
 const before=await page.evaluate(()=>({x:p.x,y:p.y}));
 const t=Date.now();await click(door);
 await page.waitForFunction(v=>Math.hypot(p.x-v.x,p.y-v.y)>4||room==='tarot',before,{timeout:12000});
 const movementMs=Date.now()-t;
 await page.locator('#game.pawInRoom.pawExitView #back').waitFor({state:'visible',timeout:25000});
 assert.equal(await page.evaluate(()=>room),'tarot');
 const discoveryMs=Date.now()-t;
 await click(page.locator('#back'));
 await door.waitFor({state:'visible',timeout:25000});
 return {movementMs,discoveryMs};
}
(async()=>{
 const browser=await engine.launch(),reports=[],failures=[];
 try{
 for(const [tag,options,lang] of profiles){
  const context=await browser.newContext({...options,reducedMotion:'reduce'}),page=await context.newPage();
  const click=loc=>options.hasTouch?loc.tap({timeout:15000}):loc.click({timeout:15000});
  const shot=name=>page.screenshot({path:out+'/'+tag+'-'+name+'.png'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.message)));
  let attempts=0,mode='transient';
  const filter='**/src/engine.js';
  try{
   // Simulate a failed first source transfer and a short slow-network retry.
   // Route only the network request; no game globals or saves are injected.
   await page.route(filter,async route=>{
    attempts++;
    if(mode==='fail'||mode==='transient'&&attempts===1)return route.fulfill({status:503,body:'Temporary test outage'});
    if(mode==='transient')await new Promise(r=>setTimeout(r,650));
    return route.continue();
   });
   const coldStart=Date.now();await page.goto(base,{waitUntil:'domcontentloaded'});
   const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
   await next.waitFor({state:'visible',timeout:45000});
   assert.equal(attempts,2,'Boot source retry did not recover exactly once');
   const coldReadyMs=Date.now()-coldStart,coldMetrics=await metrics(page);
   await shot('cold-ready');
   await click(proposal.locator('.languageChoice').getByRole('button',{name:lang,exact:true}));
   await click(next);
   const ticket=proposal.locator('.rail-ticket'),name='Entry Recovery';
   await ticket.locator('input').fill(name);await click(ticket.locator('.ticket-confirm'));
   await click(next);await click(proposal.locator('footer .actions button').first());
   await click(proposal.locator('.rail-arrive'));
   await proposal.locator('.mbGatePainting').evaluate(im=>im.decode());
   await shot('first-gate');
   const first=await enterMap(page,click);
   assert.equal(first.state.name,name);
   await shot('first-map');
   const action=await firstMovement(page,click);
   const before=await page.evaluate(()=>({name:playerName,avatar}));
   // A complete source failure must offer retry and retain the existing save.
   mode='fail';attempts=0;
   await page.reload({waitUntil:'domcontentloaded'});
   const retry=page.locator('main button');
   await retry.waitFor({state:'visible',timeout:45000});
   assert.equal(attempts,2,'Failure must terminate after bounded retries');
   assert.match(await retry.innerText(),/Try again|重试/);
   await shot('recoverable-error');
   mode='normal';await page.unroute(filter);
   const warmStart=Date.now();await click(retry);
   await proposal.locator('.shrine-enter').waitFor({state:'visible',timeout:45000});
   const warmReadyMs=Date.now()-warmStart,warmMetrics=await metrics(page);
   assert.equal(await proposal.locator('.rail-ticket input:visible').count(),0,'Returning player forced to register again');
   await proposal.locator('.mbGatePainting').evaluate(im=>im.decode());
   await shot('return-gate');
   const returning=await enterMap(page,click);
   assert.equal(returning.state.name,before.name);assert.equal(returning.state.avatar,before.avatar);
   await shot('return-map');
   assert.deepEqual(errors,[],'Uncaught runtime errors');
   const result={tag,browser:browser.version(),build:process.env.GITHUB_SHA||'local',profile:'simulated browser, not physical device',coldReadyMs,warmReadyMs,first,returning,action,coldMetrics,warmMetrics};
   reports.push(result);console.log('ENTRY_RECOVERY_PASS '+JSON.stringify({tag,coldReadyMs,warmReadyMs,firstMs:first.ms,returnMs:returning.ms,...action}));
  }catch(e){failures.push({tag,message:String(e.message),errors});console.error('ENTRY_RECOVERY_FAIL '+tag+' '+e.message);await shot('FAIL').catch(()=>{})}
  finally{await context.close()}
 }
 }finally{fs.writeFileSync(out+'/evidence.json',JSON.stringify({browserName,reports,failures},null,2));await browser.close()}
 if(failures.length)throw Error(failures.length+' entry recovery scenarios failed');
})().catch(e=>{console.error(e);process.exitCode=1});
