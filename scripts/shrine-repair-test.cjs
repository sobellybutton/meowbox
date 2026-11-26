const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const engine=process.env.MEOW_BROWSER==='webkit'?webkit:chromium;
 const browser=await engine.launch();fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,options] of [['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1280,height:800}}]]){
   const page=await browser.newPage(options);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/frame error|Room transition/i.test(m.text()))errors.push(m.text())});
   try{
    await page.goto('http://127.0.0.1:8768/index.html',{waitUntil:'domcontentloaded'});
    await page.locator('#proposal .languageChoice').getByRole('button',{name:'EN',exact:true}).click({timeout:60000});
    await page.locator('#proposal footer button.next').click();
    await page.locator('#proposal .rail-ticket input').fill('Ritual Tester');
    await page.locator('#proposal .ticket-confirm').click();
    await page.locator('#proposal footer button.next').click();
    await page.locator('#proposal footer .actions button').first().click();
    await page.locator('#proposal .rail-arrive').click({timeout:20000});
    await page.locator('#proposal .shrine-enter').click({timeout:20000});
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0&&!signRoot.hidden&&[...signButtons.values()].some(b=>!b.hidden),{},{timeout:15000});
    const entry=await page.evaluate(()=>({y:p.y,max:maxY(),nearest:Math.min(...npc.map(n=>Math.hypot(n.x-p.x,n.y-p.y))),signs:[...signButtons.values()].filter(b=>!b.hidden).length}));
    if(entry.y<entry.max-160||entry.nearest<130||!entry.signs)throw Error('Entrance crowd or framing: '+JSON.stringify(entry));
    await page.screenshot({path:'test-results/'+name+'-valley-arrival.png'});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#proposal .shrine-ticket-reminder').waitFor({timeout:60000});
    await page.screenshot({path:'test-results/'+name+'-return-ticket.png'});
    await page.locator('#proposal .shrine-enter').click();
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0,{},{timeout:15000});
    // Room is set up as a test fixture; actions below use the actual pointer input.
    await page.evaluate(()=>{room='temple';start('templeWater');});
    await page.waitForFunction(()=>activity==='templeWater'&&hit.some(h=>h.id==='templeLadle'),{},{timeout:10000});
    const screen=async(x,y)=>page.evaluate(([x,y])=>{const r=c.getBoundingClientRect();return {x:r.left+cam.ox+x*cam.scale,y:r.top+cam.oy+y*cam.scale}},[x,y]);
    const drag=async(x,y,toX,toY)=>{const a=await screen(x,y),b=await screen(toX,toY);if(options.hasTouch&&engine===chromium){const client=await page.context().newCDPSession(page);try{await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});for(let i=1;i<=15;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/15,y:a.y+(b.y-a.y)*i/15}]})}await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}finally{await client.detach()}}else{await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:15});await page.mouse.up()}};
    await page.screenshot({path:'test-results/'+name+'-water-empty.png'});
    await drag(400,426,250,486);
    if(await page.evaluate(()=>state.waterStage)!==0)throw Error('Accepted a drop away from basin');
    await drag(400,426,440,486);
    await page.waitForFunction(()=>state.waterStage===1,{},{timeout:2500});
    await page.waitForTimeout(450);await page.screenshot({path:'test-results/'+name+'-water-filled.png'});
    await drag(440,447,375,430);
    await page.waitForFunction(()=>state.waterStage===2,{},{timeout:2500});
    await page.waitForTimeout(700);await page.screenshot({path:'test-results/'+name+'-water-pouring.png'});
    await page.waitForFunction(()=>state.waterStage===3,{},{timeout:3500});
    await page.screenshot({path:'test-results/'+name+'-water-done.png'});
    await page.evaluate(()=>{start('prayer')});
    const bar=page.locator('#ritualActionBar');
    for(let n=0;n<3;n++)await bar.getByRole('button',{name:/Take a joss stick/}).click();
    await bar.getByRole('button',{name:'Light the three sticks',exact:true}).click();
    await bar.getByRole('button',{name:/^Bow/}).click();
    await page.waitForFunction(()=>state.prayerStage==='bow'&&state.prayerHeld===3&&state.prayerLit);
    await page.waitForTimeout(600);await page.screenshot({path:'test-results/'+name+'-grounded-bow.png'});
    await page.evaluate(()=>{room='park';activity=null;roomIntro();updateHUD();});
    await page.waitForTimeout(700);await page.screenshot({path:'test-results/'+name+'-park-hosts.png'});
    await page.evaluate(()=>{room='tea';activity=null;roomIntro();updateHUD();action('chat')});
    await page.locator('#choices').getByRole('button',{name:'Hear the latest gossip',exact:true}).click();
    await page.locator('#choices').getByRole('button',{name:'Wait, what happened?',exact:true}).click();
    if(!await page.evaluate(()=>parkProgress().beat===1))throw Error('Gossip did not progress');
    if(errors.length)throw Error(errors.join('; '));
    console.log(name+': arrival, return ticket, actual water pointer drag, prayer and gossip passed');
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
