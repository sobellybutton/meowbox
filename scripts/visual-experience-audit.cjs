/* Full visual evidence sweep. This is a staging/coverage check, not a
   substitute for a human review of the screenshot pixels or real user flows. */
const {chromium,webkit}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const {attachFrameAudit}=require('./paw-frame-audit.cjs');
const root=process.env.MB_AUDIT_URL||'http://127.0.0.1:8769/index.html',out='visual-review';
fs.mkdirSync(out,{recursive:true});
const jobs=[
 ['small-chromium',chromium,{viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1}],
 ['tall-webkit',webkit,{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1}],
 ['tablet-chromium',chromium,{viewport:{width:768,height:1024},hasTouch:true,deviceScaleFactor:1}],
 ['desktop-chromium',chromium,{viewport:{width:1440,height:900},deviceScaleFactor:1}]
];
// Local execution defaults to the full sweep. CI may shard by an exact
// device identifier; a typo must fail rather than silently test nothing.
const requestedDevice=process.env.MB_AUDIT_DEVICE||'';
const selectedJobs=requestedDevice?jobs.filter(([device])=>device===requestedDevice):jobs;
if(!selectedJobs.length)throw Error('Unknown visual audit device: '+requestedDevice);
const results=[],failures=[];
(async()=>{
 for(const [device,engine,options] of selectedJobs){
  const browser=await engine.launch();
  try{for(const language of ['en','zh']){
   const page=await browser.newPage(options),prefix=device+'-'+language;
   const frameAudit=await attachFrameAudit(page,out,prefix);
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
   const settle=()=>page.waitForTimeout(650);
   async function capture(name){
    const file=prefix+'-'+name+'.png',errorCount=errors.length;
    await settle();
    // These four screenshots exposed cut-off controls. Test the rendered
    // layout before capturing; never treat a merely existing DOM node as
    // proof that the player can use it. Intentional long content may scroll,
    // but these short conversation and filter groups should fit together.
    if(['home-tea-chat','wonder-quiz-quiz','wonder-match-match','bag'].includes(name)){
     const group=name==='bag'?'.travellerBagV2 .bagCategories':'#dialogue #choices';
     const fit=await page.evaluate(selector=>{
      const node=document.querySelector(selector);
      if(!node)return {missing:true};
      const parent=selector.includes('bagCategories')?node:document.getElementById('dialogue');
      const bounds=parent.getBoundingClientRect();
      const buttons=[...node.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled&&getComputedStyle(b).display!=='none');
      const invalid=buttons.flatMap(b=>{
       const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
       const clipped=r.left<Math.max(0,bounds.left)-1||r.right>Math.min(innerWidth,bounds.right)+1||r.top<Math.max(0,bounds.top)-1||r.bottom>Math.min(innerHeight,bounds.bottom)+1;
       const hit=document.elementFromPoint(x,y);
       return clipped||r.height<43||!hit||!(hit===b||b.contains(hit)||hit.contains(b))?[{label:b.textContent.trim(),clipped,height:r.height,hit:hit?.className||hit?.id||hit?.tagName}]:[];
      });
      return {count:buttons.length,invalid};
     },group);
     if(fit.missing||!fit.count||fit.invalid?.length)throw Error('Corrected control group is not fully reachable: '+JSON.stringify(fit));
    }
    await page.screenshot({path:path.join(out,file)});
    await frameAudit.flush(name);
    const data=await page.evaluate(()=>{
     const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return !e.hidden&&s.visibility!=='hidden'&&s.display!=='none'&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth};
     const pageOpen=$('page').style.display==='block',root=pageOpen?$('page'):$('game');
     const controls=[...root.querySelectorAll('button,input,select,textarea')].filter(e=>{
      if(!visible(e)||e.disabled||e.getAttribute('aria-hidden')==='true')return false;
      // The keyboard-only fallback is intentionally a one-pixel clipped
      // target while every native station plaque is reachable. A required
      // directory is still checked and must not be excluded.
      if(e.id==='pawRoomGuideToggle'&&e.dataset.showDirectory==='false'&&getComputedStyle(e).clipPath!=='none'&&!e.matches(':focus-visible'))return false;
      return true
     });
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
    // Capture the exposed assessments by choosing the current host's actual
    // bilingual dialogue. Do not open retired or misplaced modes directly.
    const assessments=[
     ['quiz','type','Four personality preferences','MBTI 启发的四组性格偏好'],
     ['quiz','motive','Enneagram-inspired · nine motives','九型人格 · 九种内在动力'],
     ['quiz','bigfive','Five personality tendencies','五大性格倾向'],
     ['story','priorities','Room for what matters','给重要的事留点位置'],
     ['match','values','Relationship values','关系价值观'],
     ['match','care','How I feel cared for','怎样的关心最打动我'],
     ['match','attachment','When closeness gets complicated','亲密关系里的小情绪']
    ];
    for(const [house,mode,en,cn] of assessments)await attempt(house+'-'+mode,async()=>{
     await prepare('wonder',house);
     await page.evaluate(id=>action(id),house);
     await page.locator('#choices').getByRole('button',{name:language==='zh'?cn:en,exact:true}).click({timeout:8000});
     await page.waitForFunction(({house,mode})=>scene==='wonder'&&room===house&&activity==='wonderScene'&&wonderSceneMode===mode,{house,mode},{timeout:5000});
    });
    await attempt('deer-bow',async()=>{await prepare('home','park');await page.evaluate(()=>action('deerVisit'));await page.locator('.deerMeadowButtons button').first().click();await page.waitForTimeout(450)});
    await attempt('deer-feed',async()=>{await prepare('home','park');await page.evaluate(()=>action('deerVisit'));await page.locator('.deerMeadowButtons button').nth(1).click();await page.waitForTimeout(450)});
    for(const [name,open] of [['bag','myRoom'],['passport','passport'],['today','todayHub'],['wallet','pawWalletPage'],['wheel','dailyWheelPage'],['home','hideoutPage'],['rail','rail']]){
     await attempt(name,async()=>{await prepare('fortune',null);await page.evaluate(id=>{const pages={myRoom,passport,todayHub,pawWalletPage,dailyWheelPage,hideoutPage,rail:()=>openRailStop('home')};pages[id]()},open)});
    }
   }catch(e){failures.push(prefix+' setup: '+e.message)}
   finally{await frameAudit.stop();for(const error of [...new Set(errors)])failures.push(prefix+' runtime: '+error);await page.close()}
  }}finally{await browser.close()}
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({results,failures},null,2));
 console.log('Captured '+results.length+' named visual states; '+failures.length+' runtime/entry failures. Inspect PNGs and reported control risks.');
 if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1});
