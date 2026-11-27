const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const engine=process.env.MEOW_BROWSER==='webkit'?webkit:chromium;
 const browser=await engine.launch();fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,options] of [
   ['phone-360',{viewport:{width:360,height:640},isMobile:true,hasTouch:true}],
   ['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],
   ['tablet',{viewport:{width:768,height:1024},hasTouch:true}],
   ['desktop',{viewport:{width:1440,height:900}}]
  ]){
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
    await page.locator('#proposal .pawGateEnter').waitFor({timeout:60000});
    const gate=await page.evaluate(()=>{
     const root=proposal.getBoundingClientRect(),hero=proposal.querySelector('.hero').getBoundingClientRect(),button=proposal.querySelector('.pawGateEnter').getBoundingClientRect();
     return {cover:Math.abs(root.width-hero.width)<2&&Math.abs(root.height-hero.height)<2,ticket:!!proposal.querySelector('.pawReturnTicket,.shrine-ticket-reminder'),visible:button.top>=root.top&&button.bottom<=root.bottom,action:button.height>=44}
    });
    if(!gate.cover||gate.ticket||!gate.visible||!gate.action)throw Error('Returning gate composition: '+JSON.stringify(gate));
    await page.screenshot({path:'test-results/'+name+'-return-gateway.png'});
    await page.locator('#proposal .shrine-enter').click();
    await page.waitForFunction(()=>proposal.hidden&&valleyRevealAt<0,{},{timeout:15000});
    // Exercise the real movement integrator with an invalid skyline goal, then
    // sample every step. Restore the existing arrival state for the ritual tests.
    const ground=await page.evaluate(()=>{
     const prior={...p};let escaped=false;let moved=false;
     try{
      stopRoute();p.tx=500;p.ty=0;
      for(let i=0;i<800;i++){step(p,.05,330);const q=pawStairFoot(p.x,p.y);escaped||=Math.abs(q.x-p.x)>.01||Math.abs(q.y-p.y)>.01;moved||=Math.abs(p.y-prior.y)>10}
      return {escaped,moved,y:p.y}
     }finally{Object.assign(p,prior)}
    });
    if(ground.escaped||!ground.moved||ground.y<350)throw Error('Player escaped stair corridor: '+JSON.stringify(ground));
    // Room is set up as a test fixture; actions below use the actual pointer input.
    const props=new Set();
    await page.exposeFunction('recordPaintedTempleProp',name=>props.add(name));
    await page.evaluate(()=>{
     const draw=ctx.drawImage.bind(ctx),painted=new Set();
     ctx.drawImage=(im,...args)=>{
      const path=im?.currentSrc||im?.src||'';
      if((path.includes('/painted/temple/')||path.includes('/staging/2026-11-27/rooms/temple/purification.webp'))&&!painted.has(path)){
       painted.add(path);void recordPaintedTempleProp(path.split('/').at(-1));
      }
      return draw(im,...args)
     };
     room='temple';
    });
    await page.waitForFunction(()=>pawRoomImageReady(pawWaterArt()),{},{timeout:10000});
    await page.evaluate(()=>start('templeWater'));
    await page.waitForFunction(()=>activity==='templeWater'&&pawWaterPaintingActive()&&pics.templeLadlePaint.naturalWidth>0&&hit.some(h=>h.id==='templeLadle'),{},{timeout:10000});
    const waterTarget=()=>page.evaluate(()=>{const h=hit.find(h=>h.id==='templeLadle');if(!h)throw Error('Missing rendered ladle target');return {x:h.x+h.w/2,y:h.y+h.h/2}});
    // Independent calibration from the courtyard plate, not legacy vector basin coordinates.
    const plate={x:100,y:-145,w:600,h:600*1635/962};
    const point=(u,v)=>({x:plate.x+u*plate.w,y:plate.y+v*plate.h});
    const scoop=point(.383,.51),pour=point(.464,.545),miss=point(.25,.64);
    const dragLadle=async(dest)=>{const from=await waterTarget();await drag(from.x,from.y,dest.x,dest.y)};
    const screen=async(x,y)=>page.evaluate(([x,y])=>{const r=c.getBoundingClientRect();return {x:r.left+cam.ox+x*cam.scale,y:r.top+cam.oy+y*cam.scale}},[x,y]);
    const drag=async(x,y,toX,toY)=>{const a=await screen(x,y),b=await screen(toX,toY);if(options.hasTouch&&engine===chromium){const client=await page.context().newCDPSession(page);try{await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});for(let i=1;i<=15;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/15,y:a.y+(b.y-a.y)*i/15}]})}await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}finally{await client.detach()}}else{await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:15});await page.mouse.up()}};
    await page.screenshot({path:'test-results/'+name+'-water-empty.png'});
    await dragLadle(miss);
    if(await page.evaluate(()=>state.waterStage)!==0)throw Error('Accepted a drop away from basin');
    await dragLadle(scoop);
    await page.waitForFunction(()=>state.waterStage===1,{},{timeout:2500});
    await page.waitForTimeout(450);await page.screenshot({path:'test-results/'+name+'-water-filled.png'});
    await dragLadle(pour);
    await page.waitForFunction(()=>state.waterStage===2,{},{timeout:2500});
    if(await page.evaluate(()=>!!state.waterRewarded))throw Error('Water reward granted before rinse completed');
    await page.waitForTimeout(700);await page.screenshot({path:'test-results/'+name+'-water-pouring.png'});
    await page.waitForFunction(()=>state.waterStage===3,{},{timeout:3500});
    if(!await page.evaluate(()=>state.waterRewarded===true))throw Error('Completed rinse did not grant reward');
    await page.screenshot({path:'test-results/'+name+'-water-done.png'});
    await page.evaluate(()=>start('templeBell'));
    await page.waitForFunction(()=>pics.templeBronze.naturalWidth>0&&pics.templeStrikerPaint.naturalWidth>0&&hit.some(h=>h.id==='templeStriker'));
    await drag(277,467,225,467);
    await page.waitForFunction(()=>state.bellRung);
    const bellAt=await page.evaluate(()=>state.bellAt);
    await page.evaluate(()=>templeReleaseBell(100));
    if(await page.evaluate(()=>state.bellAt)!==bellAt)throw Error('Bell allowed a second overlapping strike');
    await page.waitForFunction(()=>hit.some(h=>h.id==='templeStriker'),{},{timeout:5000});
    await page.screenshot({path:'test-results/'+name+'-bell-ready.png'});
    await page.evaluate(()=>{start('prayer')});
    const bar=page.locator('#ritualActionBar');
    for(let n=0;n<3;n++)await bar.getByRole('button',{name:/Take a joss stick/}).click();
    await bar.getByRole('button',{name:'Light the three sticks',exact:true}).click();
    await bar.getByRole('button',{name:/^Bow/}).click();
    await page.waitForFunction(()=>state.prayerStage==='bow'&&state.prayerHeld===3&&state.prayerLit);
    await page.waitForTimeout(600);await page.screenshot({path:'test-results/'+name+'-grounded-bow.png'});
    await bar.getByRole('button',{name:'Bow 2/3',exact:true}).click();
    await bar.getByRole('button',{name:'Bow 3/3',exact:true}).click();
    await bar.getByRole('button',{name:'Place incense in burner',exact:true}).click();
    await page.waitForFunction(()=>state.prayerStage==='complete'&&state.prayerHeld===0&&state.prayerOffered===3&&state.prayerRewarded);
    await page.evaluate(()=>{room='park';activity=null;roomIntro();updateHUD();});
    await page.waitForTimeout(700);await page.screenshot({path:'test-results/'+name+'-park-hosts.png'});
    await page.evaluate(()=>{room='tea';activity=null;roomIntro();updateHUD();action('chat')});
    await page.locator('#choices').getByRole('button',{name:'Hear the latest gossip',exact:true}).click();
    await page.locator('#choices').getByRole('button',{name:'Wait, what happened?',exact:true}).click();
    if(!await page.evaluate(()=>parkProgress().beat===1))throw Error('Gossip did not progress');
    if(!props.has('purification.webp'))throw Error('The painted purification courtyard was never drawn');
    const bellAndLadle=await page.evaluate(()=>[pics.templeBronze,pics.templeStrikerPaint,pics.templeLadlePaint].map(im=>(im.currentSrc||im.src).split('/').at(-1)));
    if(!bellAndLadle.every(name=>props.has(name)))throw Error('Missing painted bell or ladle render: '+[...props].join(', '));
    if(errors.length)throw Error(errors.join('; '));
    console.log(name+': arrival, return gateway, actual water pointer drag, prayer and gossip passed');
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
