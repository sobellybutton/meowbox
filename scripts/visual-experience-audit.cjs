/* Full visual evidence sweep. This is a staging/coverage check, not a
   substitute for a human review of the screenshot pixels or real user flows. */
const {chromium,webkit}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const root=process.env.MB_AUDIT_URL||'http://127.0.0.1:8769/index.html',out='visual-review';
fs.mkdirSync(out,{recursive:true});
const jobs=[
 ['small-chromium',chromium,{viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1}],
 ['tall-webkit',webkit,{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1}],
 ['tablet-chromium',chromium,{viewport:{width:768,height:1024},hasTouch:true,deviceScaleFactor:1}],
 ['desktop-chromium',chromium,{viewport:{width:1440,height:900},deviceScaleFactor:1}]
];
const results=[],failures=[];
(async()=>{
 for(const [device,engine,options] of jobs){
  const browser=await engine.launch();
  try{for(const language of ['en','zh']){
   const page=await browser.newPage(options),prefix=device+'-'+language;
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
   const settle=()=>page.waitForTimeout(650);
   async function capture(name){
    const file=prefix+'-'+name+'.png',errorCount=errors.length;
    await settle();
    await page.screenshot({path:path.join(out,file)});
    const data=await page.evaluate(()=>{
     const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return !e.hidden&&s.visibility!=='hidden'&&s.display!=='none'&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth};
     const pageOpen=$('page').style.display==='block',root=pageOpen?$('page'):$('game');
     const controls=[...root.querySelectorAll('button,input,select,textarea')].filter(e=>visible(e)&&!e.disabled&&e.getAttribute('aria-hidden')!=='true');
     const issues=[];
     for(const e of controls){
      const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
      if(x<0||x>=innerWidth||y<0||y>=innerHeight)continue;
      const hit=document.elementFromPoint(x,y);
      if(hit&&hit!==e&&!e.contains(hit)&&!hit.contains(e))issues.push({kind:'intercepted',label:(e.getAttribute('aria-label')||e.textContent||e.id||e.tagName).trim().slice(0,75)});
      if(r.left< -2||r.right>innerWidth+2)issues.push({kind:'horizontal clipping',label:(e.textContent||e.id||e.tagName).trim().slice(0,75)});
     }
     return {scene,room,activity,overlay:pageOpen,issues};
    });
    results.push({device,language,name,file,...data,errors:errors.slice(errorCount)});
    if(data.overlay){
     const scroll=await page.evaluate(()=>{const p=$('page');if(p.scrollHeight-p.clientHeight<80)return false;p.scrollTop=p.scrollHeight;return true});
     if(scroll){await page.screenshot({path:path.join(out,prefix+'-'+name+'-bottom.png')});await page.evaluate(()=>$('page').scrollTop=0)}
    }
   }
   async function attempt(name,fn){
    try{await fn();await capture(name)}catch(e){failures.push(prefix+' '+name+': '+e.message);await page.screenshot({path:path.join(out,prefix+'-'+name+'-failed.png')}).catch(()=>{})}
   }
   async function prepare(world,id){
    await page.evaluate(k=>{$('page').style.display='none';closeTalk();if(!transitioning)journey(k)},world);
    await page.waitForFunction(k=>scene===k&&!room&&!transitioning,world,{timeout:10000});
    if(id){await page.evaluate(k=>enter(k),id);await page.waitForFunction(k=>room===k&&!transitioning,id,{timeout:10000});await settle()}
   }
   try{
    await page.addInitScript(lang=>{localStorage.setItem('meowbox-preview-avatar','0');localStorage.setItem('meowbox-preview-zh',JSON.stringify(lang==='zh'))},language);
    await page.goto(root,{waitUntil:'domcontentloaded'});
    await page.locator('#proposal .shrine-enter').waitFor({timeout:45000});
    await capture('arrival');
    await page.locator('#proposal .shrine-enter').click();
    await page.locator('#proposal').waitFor({state:'hidden',timeout:15000});
    const registry=await page.evaluate(()=>Object.entries(maps).flatMap(([world,m])=>m.st.filter(s=>s[0]!=='station').map(([id])=>({world,id,actions:(roomActions[id]||[]).map(a=>a[0])}))));
    for(const world of ['fortune','home','island','wonder']){
     await attempt(world+'-map',()=>prepare(world,null));
     for(const {id,actions} of registry.filter(r=>r.world===world)){
      await attempt(world+'-'+id+'-room',async()=>{
       await prepare(world,id);
       // Actual scene rendering, not merely the source list of room actions.
       await page.waitForFunction(()=>continuityRoom===room&&roomGuideKey&&Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<4,null,{timeout:8000});
       const labels=await page.evaluate(()=>{
        const entries=roomGuideEntries(),guide=[...roomGuide.querySelectorAll('button[data-station]')],rendered=[...pawVisibleStationLabels],button=roomGuideToggle.getBoundingClientRect();
        const coverage=entries.map(([id,en,cn])=>({id,name:tr(en,cn),plaque:rendered.includes(id),directory:guide.some(b=>b.dataset.station===id&&b.textContent.trim()===tr(en,cn)),hit:hit.some(h=>h.stationId===id&&typeof h.fn==='function')}));
        const style=getComputedStyle(roomGuideToggle),fallback=!roomGuideToggle.hidden&&roomGuideToggle.dataset.showDirectory==='true'&&button.width>=44&&button.height>=44&&style.clipPath==='none'&&style.pointerEvents!=='none';
        return {coverage,fallback,missing:coverage.filter(v=>!v.plaque),expected:entries.length}
       });
       if(labels.coverage.some(v=>!v.directory||!v.hit)||labels.missing.length&&!labels.fallback)throw Error('Room activity label or live interaction missing: '+JSON.stringify(labels));
       if(id==='arcade'&&!['bubbleArcade','goldfishScoop','blindBox'].every(k=>labels.coverage.some(v=>v.id===k)))throw Error('Arcade activity labels absent');
       results.push({device,language,name:world+'-'+id+'-label-coverage',labels});
      });
      for(const act of actions)await attempt(world+'-'+id+'-'+act,async()=>{await prepare(world,id);await page.evaluate(a=>action(a),act)});
     }
    }
    for(const mode of ['type','motive','soul'])await attempt('lab-'+mode,async()=>{await prepare('wonder','quiz');await page.evaluate(m=>wonderSceneOpen(m),mode)});
    await attempt('deer-bow',async()=>{await prepare('home','park');await page.evaluate(()=>action('deerVisit'));await page.locator('.deerMeadowButtons button').first().click();await page.waitForTimeout(450)});
    await attempt('deer-feed',async()=>{await prepare('home','park');await page.evaluate(()=>action('deerVisit'));await page.locator('.deerMeadowButtons button').nth(1).click();await page.waitForTimeout(450)});
    for(const [name,open] of [['bag','myRoom'],['passport','passport'],['today','todayHub'],['wallet','pawWalletPage'],['wheel','dailyWheelPage'],['home','hideoutPage'],['rail','rail']]){
     await attempt(name,async()=>{await prepare('fortune',null);await page.evaluate(id=>{const pages={myRoom,passport,todayHub,pawWalletPage,dailyWheelPage,hideoutPage,rail:()=>openRailStop('home')};pages[id]()},open)});
    }
   }catch(e){failures.push(prefix+' setup: '+e.message)}
   finally{for(const error of [...new Set(errors)])failures.push(prefix+' runtime: '+error);await page.close()}
  }}finally{await browser.close()}
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({results,failures},null,2));
 console.log('Captured '+results.length+' named visual states; '+failures.length+' runtime/entry failures. Inspect PNGs and reported control risks.');
 if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1});
