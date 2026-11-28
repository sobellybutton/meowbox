'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 const failures=[];
 try{for(const [name,width,height] of [['compact',360,640],['tall',390,844]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addInitScript(()=>{if(!sessionStorage.getItem('settings-test-seeded')){sessionStorage.setItem('settings-test-seeded','yes');localStorage.setItem('meowbox-preview-quiet9','true')}});
   await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'load'});
   await page.locator('#proposal footer button.next').waitFor({timeout:45000});
   await page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}).click();
   await page.locator('#proposal footer button.next').click();
   await page.locator('#proposal .rail-ticket input').fill('Settings Test');
   await page.locator('#proposal .ticket-confirm').click();
   await page.locator('#proposal footer button.next').click();
   await page.locator('#proposal footer .actions button').first().click();
   await page.locator('#proposal .rail-arrive').click({timeout:20000});
   await page.locator('#proposal .shrine-enter').click({timeout:20000});
   await page.locator('#proposal').waitFor({state:'hidden',timeout:30000});
   await page.waitForFunction(()=>!transitioning&&!room&&scene==='fortune');
   await page.waitForFunction(()=>[...document.querySelectorAll('#worldSigns .worldSign[data-door]')].some(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&r.left<innerWidth&&r.right>0&&r.top<innerHeight&&r.bottom>0&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>0}),null,{timeout:15000});
   assert.equal(await page.evaluate(()=>localStorage.getItem('meowbox-preview-quiet9')),'false');
   const cog=page.locator('#townSettingsToggle');await cog.waitFor({state:'visible'});
   assert.equal(await page.locator('#quietToggle').isVisible(),false);
   const style=await cog.evaluate(e=>({svg:[...e.querySelectorAll('svg')].filter(x=>getComputedStyle(x).display!=='none').length,images:e.querySelectorAll('img').length,before:getComputedStyle(e,'::before').content,after:getComputedStyle(e,'::after').content,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));
   assert.deepEqual([style.svg,style.images,style.before,style.after],[1,0,'none','none']);assert.ok(style.w>=44&&style.h>=44);
   // Actual rendered hierarchy, not merely existence of CSS strings.
   const mapStyle=await page.evaluate(()=>{
    const profile=document.querySelector('#profileHud'),name=document.querySelector('#hudName'),coin=document.querySelector('#hudCoins'),gear=document.querySelector('#townSettingsToggle'),dock=document.querySelector('#dock');
    const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    const art=e=>getComputedStyle(e).backgroundImage;
    const plaque=[...document.querySelectorAll('#worldSigns .worldSign[data-door] .doorPlaque')].find(e=>e.getClientRects().length&&!e.closest('[hidden]'));
    return {profile:rect(profile),name:name.textContent,nameFits:name.scrollWidth<=name.clientWidth+1,coin:rect(coin),gear:rect(gear),dock:rect(dock),profileArt:art(profile),coinArt:art(coin),gearArt:art(gear),dockArt:art(dock),plaque:plaque?{art:art(plaque),borderImage:getComputedStyle(plaque).borderImageSource,hit:rect(plaque.parentElement)}:null};
   });
   if(process.env.PAW_MAP_STATIONERY==='1'){
    assert(mapStyle.nameFits,'Normal-length traveller name should fit: '+JSON.stringify(mapStyle));
    assert(mapStyle.profile.right<=mapStyle.coin.left+1&&mapStyle.coin.right<=mapStyle.gear.left+1,'HUD surfaces overlap');
    assert(Math.abs(mapStyle.profile.top-mapStyle.gear.top)<=4,'Top corners should align');
    assert(mapStyle.gear.width>=44&&mapStyle.gear.height>=44,'Settings touch target');
    for(const art of [mapStyle.profileArt,mapStyle.coinArt,mapStyle.gearArt,mapStyle.dockArt])assert(art.includes('paper_texture.webp'),'Shared painted paper must render');
    assert(mapStyle.plaque&&mapStyle.plaque.borderImage==='none'&&mapStyle.plaque.hit.height>=44,'Slim plaque must retain accessible target');
   }
   await page.screenshot({path:'test-results/settings-'+name+'-map.png'});
   // Real mobile arrival and progressively disclosed destinations, without teleporting or mutating player state.
   const arrival=await page.evaluate(()=>({x:p.x,y:p.y,scene,scale:cam.scale}));
   assert.equal(arrival.scene,'fortune');
   assert.equal(await page.locator('.pawRailEdge:visible,button[data-door="station"]:visible').count(),0,'Railway should not compete with arrival');
   const dock=page.locator('#dock'), buttons=dock.locator('button:visible');
   assert.deepEqual(await buttons.evaluateAll(nodes=>nodes.map(n=>n.id)),['dockTravel','dockScoop','dockValley','dockOwnHome']);
   const boxes=await buttons.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {w:r.width,h:r.height,within:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}}));
   assert(boxes.every(b=>b.w>=44&&b.h>=44&&b.within),'Dock touch areas: '+JSON.stringify(boxes));
   assert(Math.max(...boxes.map(b=>b.w))-Math.min(...boxes.map(b=>b.w))<2,'Uneven dock buttons');
   for(const id of ['dockTravel','dockScoop','dockValley','dockOwnHome']){
    const before=await page.evaluate(()=>({x:p.x,y:p.y,scene}));
    await page.locator('#'+id).tap();
    await page.waitForFunction(()=>$('page').style.display==='block',null,{timeout:15000});
    await page.screenshot({path:'test-results/wayfinding-'+name+'-'+id+'.png'});
    const back=page.locator('#content > .row button').first();
    await back.waitFor({state:'visible',timeout:8000});await back.tap();
    await page.waitForFunction(()=>$('page').style.display!=='block',null,{timeout:15000});
    const after=await page.evaluate(()=>({x:p.x,y:p.y,scene}));
    assert.equal(after.scene,before.scene);assert(Math.hypot(after.x-before.x,after.y-before.y)<3,'Dock moved traveller');
   }
   // Direct tab changes must retain a recoverable private note, without moving the traveller.
   const rootStart=await page.evaluate(()=>({x:p.x,y:p.y,scene}));
   await page.locator('#dockScoop').tap();
   const note=page.locator('#goodCompanyNote'),fold=page.locator('.pawDiaryFold').filter({has:note});
   if(!await fold.evaluate(e=>e.open))await fold.locator('summary').first().tap();
   await note.fill('A quiet moment in the valley');
   await note.blur();
   await page.waitForFunction(()=>document.getElementById('game').classList.contains('pawDockRoot'));
   await page.locator('#dockTravel').tap();
   await page.waitForFunction(()=>document.querySelector('.pawSketchbook')&&document.getElementById('dockTravel').getAttribute('aria-current')==='page');
   await page.locator('#dockScoop').tap();
   await page.waitForFunction(()=>document.getElementById('dockScoop').getAttribute('aria-current')==='page');
   assert.equal(await page.locator('#goodCompanyNote').inputValue(),'A quiet moment in the valley','Private draft lost during direct tab return');
   await page.locator('#dockValley').tap();
   await page.waitForFunction(()=>document.querySelector('.pawPavilionScene')&&document.getElementById('dockValley').getAttribute('aria-current')==='page');
   await page.locator('#dockOwnHome').tap();
   await page.waitForFunction(()=>document.querySelector('.hideoutScene')&&document.getElementById('dockOwnHome').getAttribute('aria-current')==='page');
   await page.locator('#content > .row button').first().tap();
   await page.waitForFunction(()=>$('page').style.display!=='block');
   const rootEnd=await page.evaluate(()=>({x:p.x,y:p.y,scene}));
   assert.equal(rootEnd.scene,rootStart.scene);assert(Math.hypot(rootEnd.x-rootStart.x,rootEnd.y-rootStart.y)<3,'Direct tab switching moved traveller');
   console.log('PASS direct tab switching with private draft '+name);
   // A real touch on an in-view local plaque must cause a physical approach.
   const plaqueProbe=()=>[...document.querySelectorAll('#worldSigns .worldSign[data-door]')].map(e=>{
    const r=e.getBoundingClientRect(),s=getComputedStyle(e),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    return {id:e.dataset.door,hidden:e.hidden,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom,hit:hit?.id||hit?.className,reachable:e.dataset.door!=='station'&&!e.hidden&&r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&s.visibility!=='hidden'&&s.display!=='none'&&e.contains(hit)};
   });
   let chosen;
   // Returning from the dock can legitimately need the existing 125ms sign
   // clearance window. Wait for that real UI; then walk if a sign is not in view.
   for(let attempt=0;attempt<5&&!chosen;attempt++){
    await page.waitForTimeout(350);
    const signs=await page.evaluate(plaqueProbe);chosen=signs.find(v=>v.reachable)?.id;
    console.log('Map plaque probe',name,attempt,JSON.stringify(signs));
    if(chosen)break;
    const before=await page.evaluate(()=>({x:p.x,y:p.y}));
    const target=await page.evaluate(()=>{
     const r=c.getBoundingClientRect(),goalY=p.y-150,points=pawFortunePainting.player;
     const point=points.reduce((a,b)=>Math.abs(a[0]-goalY)<Math.abs(b[0]-goalY)?a:b);
     const x=r.left+cam.ox+point[1]*cam.scale,y=r.top+cam.oy+point[0]*cam.scale;
     return {x,y,clear:document.elementFromPoint(x,y)===c};
    });
    if(target.clear)await page.touchscreen.tap(target.x,target.y);
    else {await page.keyboard.down('ArrowUp');await page.waitForTimeout(650);await page.keyboard.up('ArrowUp')}
    await page.waitForFunction(prev=>Math.hypot(p.x-prev.x,p.y-prev.y)>8,before,{timeout:8000});
    await page.waitForFunction(()=>!p.walk&&!transitioning,null,{timeout:8000});
   }
   assert(chosen,'No reachable local building plaque after map settles and normal walking');
   const beforeWalk=await page.evaluate(()=>({x:p.x,y:p.y}));
   await page.locator('#worldSigns .worldSign[data-door="'+chosen+'"]').tap();
   await page.waitForFunction(before=>Math.hypot(p.x-before.x,p.y-before.y)>8,beforeWalk,{timeout:12000});
   await page.screenshot({path:'test-results/wayfinding-'+name+'-approach.png'});
   await page.waitForFunction(()=>!!room,null,{timeout:30000});
   await page.screenshot({path:'test-results/wayfinding-'+name+'-room.png'});
   assert.deepEqual(errors,[]);console.log('PASS real dock returns and first-map touch approach '+name);
  }catch(e){await page.screenshot({path:'test-results/settings-'+name+'-failure.png'}).catch(()=>{});failures.push(name+': '+e.message);console.error(name,e)}finally{await page.close()}
 }}finally{await browser.close()}
 if(failures.length)throw Error(failures.join('\\n'));
})().catch(e=>{console.error(e);process.exitCode=1});
