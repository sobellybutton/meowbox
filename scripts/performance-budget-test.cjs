'use strict';
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.PAW_URL||'http://127.0.0.1:8776/index.html',kind=process.env.PAW_BROWSER||'chromium';
const dir='test-results/performance';fs.mkdirSync(dir,{recursive:true});
const profiles=[['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}],['desktop',{viewport:{width:1440,height:900},deviceScaleFactor:1}]];
async function observe(page,label){
 return page.evaluate(async label=>{
  const gaps=[];let previous=null;
  await new Promise(resolve=>{const start=performance.now();function tick(now){if(previous!==null)gaps.push(now-previous);previous=now;if(now-start>=2500)resolve();else requestAnimationFrame(tick)}requestAnimationFrame(tick)});
  const sorted=gaps.slice().sort((a,b)=>a-b),p=q=>Math.round((sorted[Math.min(sorted.length-1,Math.floor(sorted.length*q))]||0)*10)/10;
  const resources=performance.getEntriesByType('resource');
  return {label,frames:gaps.length,p50ms:p(.5),p95ms:p(.95),maxms:p(1),over50ms:gaps.filter(x=>x>50).length,domNodes:document.querySelectorAll('*').length,documentImages:document.images.length,canvasBytes:[...document.querySelectorAll('canvas')].reduce((n,c)=>n+c.width*c.height*4,0),heapBytes:performance.memory?.usedJSHeapSize??null,resources:resources.length,transferBytes:resources.reduce((n,r)=>n+r.transferSize,0),sourceRequests:resources.filter(r=>new URL(r.name).pathname.includes('/src/')).map(r=>({path:new URL(r.name).pathname,ms:Math.round(r.duration),bytes:r.transferSize})),visible:!document.hidden};
 },label);
}
(async()=>{
 const browser=await (kind==='webkit'?webkit:chromium).launch(),reports=[],failures=[];
 try{for(const [tag,opts] of profiles){
  const context=await browser.newContext(opts),page=await context.newPage(),errors=[],samples=[];
  const click=l=>opts.hasTouch?l.tap({timeout:15000}):l.click({timeout:15000});
  const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
  const shot=id=>page.screenshot({path:dir+'/'+tag+'-'+id+'.png'});
  page.on('pageerror',e=>errors.push(e.message));
  try{
   const start=Date.now();await page.goto(base,{waitUntil:'domcontentloaded'});await next.waitFor({state:'visible',timeout:45000});const initialReadyMs=Date.now()-start;
   samples.push(await observe(page,'entrance'));
   await click(proposal.locator('.languageChoice').getByRole('button',{name:'EN',exact:true}));await click(next);
   await proposal.locator('.rail-ticket input').fill('Pace Tester');await click(proposal.locator('.rail-ticket .ticket-confirm'));await click(next);await click(proposal.locator('footer .actions button').first());
   const arrive=proposal.locator('.rail-arrive'),gate=proposal.locator('.shrine-enter');
   await arrive.or(gate).first().waitFor({state:'visible',timeout:30000});if(await arrive.isVisible())await click(arrive);await gate.waitFor({state:'visible',timeout:30000});await click(gate);
   await page.waitForFunction(()=>proposal.hidden&&!transitioning&&!signRoot.hidden,null,{timeout:30000});
   samples.push(await observe(page,'first-map'));await shot('map');
   const door=page.locator('#worldSigns .worldSign[data-door="tarot"]');
   for(let i=0;i<3;i++){
    await door.waitFor({state:'visible',timeout:25000});await click(door);
    await page.locator('#game.pawInRoom.pawExitView #back').waitFor({state:'visible',timeout:30000});
    assert.equal(await page.evaluate(()=>room),'tarot');
    samples.push(await observe(page,'tarot-'+i));await click(page.locator('#back'));await door.waitFor({state:'visible',timeout:30000});
    samples.push(await observe(page,'return-map-'+i));
   }
   const warm=Date.now();await page.reload({waitUntil:'domcontentloaded'});await gate.waitFor({state:'visible',timeout:45000});const warmReadyMs=Date.now()-warm;
   assert.equal(await proposal.locator('.rail-ticket input:visible').count(),0);await click(gate);await page.waitForFunction(()=>proposal.hidden&&!transitioning&&!signRoot.hidden,null,{timeout:30000});
   samples.push(await observe(page,'warm-map'));await shot('warm-map');
   assert.deepEqual(errors,[]);assert.ok(samples.every(v=>v.frames>0&&v.visible),'Missing visible frame observation');
   const record={tag,build:process.env.GITHUB_SHA||'local',browser:browser.version(),initialReadyMs,warmReadyMs,samples};reports.push(record);console.log('PERFORMANCE_SAMPLE '+JSON.stringify({tag,initialReadyMs,warmReadyMs,samples:samples.map(({label,frames,p95ms,over50ms,domNodes,canvasBytes,heapBytes})=>({label,frames,p95ms,over50ms,domNodes,canvasBytes,heapBytes}))}));
  }catch(e){failures.push({tag,message:e.message,errors,samples});await shot('FAIL').catch(()=>{})}finally{await context.close()}
 }}finally{fs.writeFileSync(dir+'/evidence.json',JSON.stringify({kind,reports,failures,measurementNote:'rAF interval is presentation callback pacing, not GPU render time; canvas RGBA backing-store estimate excludes textures and decoded images; heap field optional and not total process memory. CI simulated profiles only.'},null,2));await browser.close()}
 if(failures.length)throw Error(JSON.stringify(failures.map(({tag,message})=>({tag,message}))));
})().catch(e=>{console.error(e);process.exitCode=1});
