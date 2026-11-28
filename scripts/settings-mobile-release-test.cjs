'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 const profiles=[['compact',360,640],['tall',390,844]];
 const selected=process.env.PAW_MAP_PROFILE;
 if(selected&&!profiles.some(([name])=>name===selected))throw Error('Unknown mobile profile '+selected);
 try{for(const [name,width,height] of profiles.filter(([name])=>!selected||name===selected)){
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
   await page.locator('#proposal .shrine-enter').waitFor({state:'visible',timeout:20000});
   if(process.env.PAW_VALLEY_CONTINUITY==='1')await page.screenshot({path:'test-results/entrance-'+name+'-gate.png'});
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
   if(process.env.PAW_VALLEY_CONTINUITY==='1'){
    const journey=await page.evaluate(()=>{
     const station=maps.fortune.st.find(v=>v[0]==='station');
     const visible=e=>!!e&&!e.hidden&&getComputedStyle(e).visibility==='visible'&&e.getClientRects().length>0;
     const dock=document.querySelector('#dock'),bounds=dock.getBoundingClientRect();
     const buttons=[...dock.querySelectorAll('button:not([hidden])')].filter(visible).map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,icon:e.querySelector('.dockIcon svg')?.getBoundingClientRect().width}));
     return {early:pawFortuneRailNearby('fortune',p,station.slice(1,3)),edge:visible(document.querySelector('.pawRailEdge')),sign:visible(signButtons.get('station')),near:pawFortuneRailNearby('fortune',{x:station[1],y:station[2]},station.slice(1,3)),other:pawFortuneRailNearby('home',{x:0,y:0},station.slice(1,3)),guide:!moveGuide.hidden,hint:getComputedStyle(document.querySelector('#hint')).visibility,dock:{left:bounds.left,right:bounds.right,height:bounds.height},buttons};
    });
    assert.equal(journey.early,false,'Arrival must be distant from railway');
    assert.equal(journey.edge,false,'No premature railway shortcut');
    assert.equal(journey.sign,false,'No premature railway plaque');
    assert.equal(journey.near,true);assert.equal(journey.other,true);
    if(journey.guide)assert.equal(journey.hint,'hidden','Movement guide and hint must not compete');
    assert(journey.buttons.length>=4&&journey.buttons.every(b=>b.width>=44&&b.height>=44&&b.icon>=20&&b.icon<=25),'Dock touch targets and icons: '+JSON.stringify(journey));
    assert(journey.dock.left>=0&&journey.dock.right<=width+1&&journey.dock.height<=76,'Dock footprint: '+JSON.stringify(journey));
   }
   await page.screenshot({path:'test-results/settings-'+name+'-map.png'});
   await page.evaluate(()=>{localStorage.setItem('meowbox-preview-resetProbe','keep until confirmed');localStorage.setItem('other-app-settings-test','preserve')});
   const language=await page.evaluate(()=>localStorage.getItem('meowbox-preview-zh'));
   await cog.tap();
   const reset=page.getByRole('button',{name:'Reset data',exact:true});
   await reset.tap();await page.getByRole('button',{name:'Keep my progress',exact:true}).tap();
   assert.equal(await page.locator('#pawResetConfirm').isVisible(),false);
   assert.equal(await page.evaluate(()=>localStorage.getItem('meowbox-preview-resetProbe')),'keep until confirmed');
   await reset.tap();
   await page.screenshot({path:'test-results/settings-'+name+'-confirm.png'});
   await Promise.all([page.waitForNavigation({waitUntil:'load',timeout:30000}),page.getByRole('button',{name:'Erase local progress',exact:true}).tap()]);
   await page.locator('#proposal footer button.next').waitFor({timeout:45000});
   const after=await page.evaluate(()=>[localStorage.getItem('meowbox-preview-resetProbe'),localStorage.getItem('other-app-settings-test'),localStorage.getItem('meowbox-preview-zh')]);
   assert.deepEqual(after,[null,'preserve',language]);
   assert.deepEqual(errors,[]);console.log('PASS organic mobile settings and labels '+name);
  }catch(e){await page.screenshot({path:'test-results/settings-'+name+'-failure.png'}).catch(()=>{});throw e}finally{await page.close()}
 }}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
