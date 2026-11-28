'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const size=process.env.PAW_VIEWPORT||'390x844',language=process.env.PAW_LANGUAGE||'EN';
const [width,height]=size.split('x').map(Number),touch=width<900;
const tag=size+'-'+(language==='EN'?'en':'zh');
fs.mkdirSync('test-results/organic-flow',{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const click=loc=>touch?loc.tap({timeout:15000}):loc.click({timeout:15000});
 const wait=(fn,arg=null,timeout=30000)=>page.waitForFunction(fn,arg,{timeout});
 const shot=async label=>{
  const visible=await page.locator('body').innerText();
  assert(!/\bNPCs?\b|non.player character|fictional (?:residents?|guests?|visitors?|characters?)|虚构(?:居民|来客|角色)|非玩家角色/i.test(visible),'Out-of-world wording: '+label);
  await page.screenshot({path:'test-results/organic-flow/'+tag+'-'+label+'.png'});
 };
 try{
  await page.goto('http://127.0.0.1:8772/index.html',{waitUntil:'domcontentloaded'});
  const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
  await next.waitFor({timeout:45000});
  await click(proposal.locator('.languageChoice').getByRole('button',{name:language,exact:true}));
  await click(next);await proposal.locator('.rail-ticket input').fill('Traveller 旅人');
  await click(proposal.locator('.ticket-confirm'));await click(next);
  await click(proposal.locator('footer .actions button').first());
  await click(proposal.locator('.rail-arrive'));
  await proposal.locator('.shrine-enter').waitFor({state:'visible',timeout:20000});
  await proposal.locator('.mbGatePainting').evaluate(im=>im.decode());
  await shot('gate');await click(proposal.locator('.shrine-enter'));
  await proposal.waitFor({state:'hidden',timeout:30000});
  await wait(()=>!transitioning&&!room&&!activity&&scene==='fortune'&&valleyRevealAt<0&&!signRoot.hidden);
  await shot('arrival');
  assert.equal(await page.locator('.pawRailEdge:visible,button[data-door="station"]:visible').count(),0);
  const temple=page.locator('#worldSigns .worldSign[data-door="temple"]');
  const reachable=()=>page.evaluate(()=>{
   const e=document.querySelector('#worldSigns .worldSign[data-door="temple"]');if(!e||e.hidden)return false;
   const r=e.getBoundingClientRect(),s=getComputedStyle(e);
   return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&s.visibility==='visible'&&e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2));
  });
  for(let i=0;i<14&&!await reachable();i++){
   const before=await page.evaluate(()=>({x:p.x,y:p.y}));
   // Project a real point on the traced stone route into the visible canvas.
   // Never set player, room, or activity state from the test.
   const point=await page.evaluate(()=>{
    const r=c.getBoundingClientRect();
    for(const delta of [160,120,90,65,40])for(const shift of [0,-18,18,-35,35]){
     const target=pawDistrictFoot(pawFortunePainting.player,p.x+shift,p.y-delta);
     const x=r.left+cam.ox+target.x*cam.scale,y=r.top+cam.oy+target.y*cam.scale;
     // DOM hit testing alone cannot see a resident or door's canvas target.
     if(x>10&&x<innerWidth-10&&y>70&&y<innerHeight-85&&document.elementFromPoint(x,y)===c&&!at(target))return {x,y,world:target};
    }
    return null;
   });
   assert(point,'No unobstructed walking path to the temple');
   if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
   try{await wait(prev=>p.y<prev.y-8,before,12000)}catch(error){
    console.error('Walk input diagnostic',JSON.stringify(await page.evaluate(({before,screen})=>({before,screen,now:{x:p.x,y:p.y,tx:p.tx,ty:p.ty,walk:p.walk},scene,room,activity,pending,talkOpen,transitioning,hit:at(screen.world)?.id||null,camera:{x:cam.x,y:cam.y,scale:cam.scale},blocked:pawCanvasBlocked()}),{before,screen:point})));
    throw error;
   }
   await wait(()=>!p.walk&&!transitioning,null,12000);
   assert(await page.evaluate(()=>!room&&scene==='fortune'),'Ordinary path tap entered an unrelated room');
   await page.waitForTimeout(250);
  }
  assert(await reachable(),'Temple never became reachable through normal walking');
  await shot('temple-discovered');
  const before=await page.evaluate(()=>({x:p.x,y:p.y}));
  await click(temple);
  await wait(prev=>Math.hypot(p.x-prev.x,p.y-prev.y)>8,before,12000);
  await shot('temple-approach');
  await wait(()=>room==='temple'&&activity==='templeForecourt',null,35000);
  assert(await page.evaluate(()=>state.pawForecourt?.destination==='hall'),'Forecourt stopped and requested another admission');
  assert.equal(await page.locator('[data-paw-forecourt-control="cat"]:visible').count(),0,'Unnecessary cat greeting');
  await shot('forecourt-walking');
  // No click from the forecourt into the hall.
  await wait(()=>room==='temple'&&!activity&&!transitioning&&pawHallEnabled(),null,20000);
  await shot('hall');
  const back=page.locator('#back');await back.waitFor({state:'visible',timeout:10000});
  await click(back);
  await wait(()=>activity==='templeForecourt'&&state.pawForecourt?.destination==='exit',null,20000);
  await shot('temple-departure');
  await wait(()=>!room&&!activity&&!transitioning&&scene==='fortune',null,30000);
  const returnPos=await page.evaluate(()=>({x:p.x,y:p.y,door:pawFortunePainting.doors.temple.approach}));
  assert(Math.hypot(returnPos.x-returnPos.door[0],returnPos.y-returnPos.door[1])<200,'Returned away from the temple doorway: '+JSON.stringify(returnPos));
  await shot('valley-return');
  assert.deepEqual(errors,[]);console.log('PASS real arrival, physical approach, automatic hall admission and physical departure '+tag);
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
