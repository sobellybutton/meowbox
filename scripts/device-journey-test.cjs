const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
const assert=(value,message)=>{if(!value)throw Error(message)};
(async()=>{
 const engine=process.env.MEOW_BROWSER==='webkit'?webkit:chromium;
 const browser=await engine.launch();fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,options,rotated] of [
   ['small-phone',{viewport:{width:360,height:640},isMobile:true,hasTouch:true}, {width:640,height:360}],
   ['tall-phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true},{width:844,height:390}],
   ['desktop',{viewport:{width:1440,height:900}}, {width:1024,height:768}]
  ]){
   const page=await browser.newPage(options);const errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))errors.push(m.text())});
   const click=async locator=>options.hasTouch?locator.tap({timeout:10000}):locator.click({timeout:10000});
   try{
    await page.goto('http://127.0.0.1:8768/index.html',{waitUntil:'domcontentloaded'});
    await click(page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}));
    await click(page.locator('#proposal footer button.next'));
    await page.locator('#proposal .rail-ticket input').fill('Device Tester');
    await click(page.locator('#proposal .ticket-confirm'));
    await click(page.locator('#proposal footer button.next'));
    await click(page.locator('#proposal footer .actions button').first());
    await click(page.locator('#proposal .shrine-enter'));
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden&&[...signButtons.values()].some(b=>!b.hidden&&b.dataset.door!=='station'),null,{timeout:20000});
    // Use the actual nearest visible sign, without relocating the player.
    const door=page.locator('#worldSigns .worldSign:not([hidden]):not([data-door="station"])').first();
    const id=await door.getAttribute('data-door');
    const before=await page.evaluate(()=>({x:p.x,y:p.y,avatar,playerName}));
    await click(door);await page.waitForFunction(id=>pending===id||room===id,id,{timeout:3000});
    await page.waitForFunction(id=>room===id&&!transitioning,id,{timeout:30000});
    await page.waitForFunction(()=>continuityRoom===room&&Math.hypot(indoor.tx-indoor.x,indoor.ty-indoor.y)<3,null,{timeout:10000});
    const arrival=await page.evaluate(()=>({safe:indoorSafe(indoor.x,indoor.y),avatar,playerName,scale:cam.scale}));
    assert(arrival.safe&&arrival.avatar===before.avatar&&arrival.playerName===before.playerName&&arrival.scale>0,'Arrival or identity mismatch '+JSON.stringify(arrival));
    await page.screenshot({path:'test-results/'+name+'-organic-room.png'});
    await page.setViewportSize(rotated);
    await page.waitForFunction(({width,height})=>W===width&&H===height&&cam.scale>0&&Number.isFinite(cam.ox)&&Number.isFinite(cam.oy),rotated,{timeout:10000});
    assert(await page.evaluate(()=>room!==null&&activity===null&&indoorSafe(indoor.x,indoor.y)),'Room lost on viewport resize');
    await page.screenshot({path:'test-results/'+name+'-rotated-room.png'});
    await page.setViewportSize(options.viewport);
    await page.waitForFunction(({width,height})=>W===width&&H===height,options.viewport);
    await click(page.locator('#small .languageChoice').getByRole('button',{name:'中文',exact:true}));
    assert(await page.evaluate(()=>zh===true&&document.documentElement.lang==='zh'),'Chinese switch failed');
    await click(page.locator('#small .languageChoice').getByRole('button',{name:'EN',exact:true}));
    assert(await page.evaluate(()=>zh===false&&document.documentElement.lang==='en'),'English switch failed');
    await click(page.locator('#back'));await page.waitForFunction(()=>room===null&&!transitioning,null,{timeout:15000});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#proposal .shrine-enter').waitFor({timeout:45000});
    assert(await page.evaluate(v=>avatar===v.avatar&&playerName===v.playerName,before),'Identity lost on reload');
    assert(errors.length===0,errors.join('; '));
    console.log(engine.name()+' '+name+' organic entry, resize, languages, exit and persistence PASS');
   }catch(e){await page.screenshot({path:'test-results/'+name+'-device-failure.png'}).catch(()=>{});throw Error(name+' '+e.message+' errors: '+errors.join('; '))}
   finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
