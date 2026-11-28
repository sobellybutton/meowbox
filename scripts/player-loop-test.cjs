'use strict';
// First vertical slice of the player-loop acceptance matrix: ordinary inputs only.
// Run against a local server, or set PAW_URL to an isolated deployment.
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.PAW_URL||'http://127.0.0.1:8768/index.html';
const engine=process.env.MEOW_BROWSER==='webkit'?webkit:chromium;
const strict=process.env.PAW_STRICT_VISUAL==='1';
const out=path.resolve('test-results/player-loop');
const sizes=[['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]];
const close=(a,b)=>Math.abs(a-b)<=2;
function full(rect,v){return rect&&close(rect.x,0)&&close(rect.y,0)&&close(rect.width,v.width)&&close(rect.height,v.height)}
async function frame(page){
 return page.evaluate(()=>({viewport:{width:innerWidth,height:innerHeight},canvas:document.querySelector('#c')?.getBoundingClientRect().toJSON(),gate:[...document.images].find(i=>i.src.includes('/gateway/'))?.getBoundingClientRect().toJSON(),rail:[...document.images].find(i=>i.src.includes('/journey/'))?.getBoundingClientRect().toJSON(),paint:performance.getEntriesByType('paint').map(p=>({name:p.name,ms:p.startTime}))}));
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await engine.launch();
 const report=[];
 try{
  for(const [device,options] of sizes)for(const language of ['EN','中文']){
   const page=await browser.newPage(options),tag=device+'-'+(language==='EN'?'en':'zh'),errors=[];
   const click=async locator=>options.hasTouch?locator.tap({timeout:12000}):locator.click({timeout:12000});
   page.on('pageerror',e=>errors.push(e.message));
   try{
    const t=Date.now();
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await click(page.locator('#proposal .languageChoice').getByRole('button',{name:language,exact:true}));
    await click(page.locator('#proposal footer button.next'));
    const name='Loop Tester';
    await page.locator('#proposal .rail-ticket input').fill(name);
    await click(page.locator('#proposal .ticket-confirm'));
    await click(page.locator('#proposal footer button.next'));
    await click(page.locator('#proposal footer .actions button').first());
    await page.locator('#proposal .rail-arrive').waitFor({state:'visible',timeout:20000});
    const rail=await frame(page);
    await page.screenshot({path:path.join(out,tag+'-rail.png')});
    await click(page.locator('#proposal .rail-arrive'));
    await page.locator('#proposal .shrine-enter').waitFor({state:'visible',timeout:20000});
    const gate=await frame(page);
    await page.screenshot({path:path.join(out,tag+'-gate.png')});
    const entry=Date.now();
    await click(page.locator('#proposal .shrine-enter'));
    await page.locator('#dockTravel').waitFor({state:'visible',timeout:20000});
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:20000});
    const map=await frame(page),entryMs=Date.now()-entry;
    const identity=await page.locator('#profileHud').innerText();
    assert.ok(identity.includes(name),'Identity missing after entrance');
    assert.ok(full(map.canvas,map.viewport),'Map canvas does not fill viewport');
    await page.screenshot({path:path.join(out,tag+'-map.png')});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#proposal .shrine-enter').waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('#proposal .rail-ticket input:visible').count(),0,'Returning user asked to register again');
    const returningGate=await frame(page);
    await click(page.locator('#proposal .shrine-enter'));
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:20000});
    assert.equal(await page.locator('#profileHud').innerText(),identity,'Returning identity changed');
    await page.screenshot({path:path.join(out,tag+'-return.png')});
    assert.deepEqual(errors,[],'Uncaught page errors');
    const coverage={rail:full(rail.rail,rail.viewport),gate:full(gate.gate,gate.viewport),returningGate:full(returningGate.gate,returningGate.viewport)};
    report.push({tag,entryMs,totalMs:Date.now()-t,coverage,rail,gate,map,returningGate});
    if(strict)assert.ok(Object.values(coverage).every(Boolean),tag+' incomplete artwork coverage '+JSON.stringify(coverage));
   }finally{await page.close()}
  }
 }finally{
  fs.writeFileSync(path.join(out,'entrance-report.json'),JSON.stringify(report,null,2));
  await browser.close();
 }
 console.log('Player loop entrance slice:',JSON.stringify(report.map(({tag,entryMs,coverage})=>({tag,entryMs,coverage}))));
})().catch(e=>{console.error(e);process.exitCode=1});
