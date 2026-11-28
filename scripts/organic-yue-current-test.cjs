'use strict';
const {chromium,webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const engine=process.env.PAW_BROWSER==='webkit'?webkit:chromium;
const width=Number(process.env.PAW_WIDTH||390),height=Number(process.env.PAW_HEIGHT||844),zhMode=process.env.PAW_LANGUAGE==='zh';
const base=process.env.PAW_TEST_URL||'http://127.0.0.1:8765/index.html',out='test-results/organic-yue';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await engine.launch(),page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=label=>page.screenshot({path:out+'/'+label+'.png'});
 const noPage=()=>page.evaluate(()=>$('page').style.display!=='block');
 async function chatGeometry(name,maxFraction=.36){
  const info=await page.locator('#dialogue[data-paw-chat-bar]').evaluate(n=>{const r=n.getBoundingClientRect(),style=getComputedStyle(n);return {top:r.top,bottom:r.bottom,height:r.height,width:r.width,background:style.backgroundImage,shadow:style.boxShadow,viewport:innerHeight}});
  assert(info.height<=info.viewport*maxFraction+2,name+' dialogue consumes too much of room '+JSON.stringify(info));
  assert(info.bottom<=info.viewport+2&&info.bottom>=info.viewport-20,name+' dialogue must stay at bottom '+JSON.stringify(info));
  assert.equal(info.shadow,'none',name+' still looks like a panel');
  console.log('CHAT_BAR_GEOMETRY '+name+' '+JSON.stringify(info));
 }

 const text=(en,cn)=>zhMode?cn:en;
 async function tapText(en,cn){await page.locator('#dialogue').getByRole('button',{name:text(en,cn),exact:true}).tap({timeout:8000})}
 async function setup(){
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('#proposal .languageChoice').getByRole('button',{name:zhMode?'中文':'EN',exact:true}).tap();
  await page.locator('#proposal footer button.next').tap();
  await page.locator('#proposal .rail-ticket input').fill('Ritual Tester');
  await page.locator('#proposal .ticket-confirm').tap();await page.locator('#proposal footer button.next').tap();await page.locator('#proposal footer .actions button').first().tap();
  const skip=page.locator('#proposal .rail-arrive'),gate=page.locator('#proposal .shrine-enter');
  await skip.or(gate).first().waitFor({timeout:30000});if(await skip.isVisible())await skip.tap();
  await gate.tap({timeout:30000});await page.waitForFunction(()=>proposal.hidden&&!transitioning&&valleyRevealAt<0,null,{timeout:30000});
 }
 async function approach(){
  const door=page.locator('#worldSigns .worldSign[data-door="destiny"]');
  const reachable=()=>door.evaluate(e=>{const r=e.getBoundingClientRect();return r.width>=40&&r.height>=40&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))}).catch(()=>false);
  for(let attempt=0;attempt<18&&!await reachable();attempt++){
   const point=await page.evaluate(()=>{
    const d=pawFortunePainting.doors.destiny;if(!d)return null;
    const [gx,gy]=d.approach,r=c.getBoundingClientRect(),dx=gx-p.x,dy=gy-p.y,len=Math.hypot(dx,dy)||1;
    for(const dist of [130,90,65,40])for(const shift of [0,-25,25,-50,50]){
     const q=pawDistrictFoot(pawFortunePainting.player,p.x+dx/len*dist-dy/len*shift,p.y+dy/len*dist+dx/len*shift);
     const x=r.left+cam.ox+q.x*cam.scale,y=r.top+cam.oy+q.y*cam.scale;
     if(x>10&&x<innerWidth-10&&y>70&&y<innerHeight-85&&document.elementFromPoint(x,y)===c&&!at(q)&&Math.hypot(q.x-p.x,q.y-p.y)>12)return {x,y,before:{x:p.x,y:p.y}};
    }
    return null
   });
   assert(point,'No safe visible path towards study');
   await page.touchscreen.tap(point.x,point.y);
   await page.waitForFunction(b=>Math.hypot(p.x-b.x,p.y-b.y)>8,point.before,{timeout:12000});
   await page.waitForFunction(()=>!p.walk&&!transitioning,null,{timeout:12000});
   assert(await page.evaluate(()=>!room&&scene==='fortune'));
  }
  assert(await reachable(),'Study door never discovered through normal walking');
  await door.tap();
  await page.waitForFunction(()=>room==='destiny'&&pawReadingActive()&&!transitioning,null,{timeout:35000});
  await page.waitForFunction(()=>!indoor.route.length&&Math.hypot(indoor.x-indoor.tx,indoor.y-indoor.ty)<3,null,{timeout:15000});
  await shot('study-arrival');
  const before=await page.evaluate(()=>[indoor.x,indoor.y]);
  const target=await page.waitForFunction(()=>{
   const box=pawYueHostTapBox(pawReadingPlate),x=box[0]+box[2]/2,y=box[1]+box[3]/2,h=at({x,y}),rect=c.getBoundingClientRect(),sx=rect.left+cam.ox+x*cam.scale,sy=rect.top+cam.oy+y*cam.scale;
   return h&&document.elementFromPoint(sx,sy)===c?{x:sx,y:sy}:false
  },null,{timeout:15000});
  const screen=await target.jsonValue();await page.touchscreen.tap(screen.x,screen.y);
  await page.waitForFunction(()=>talkOpen&&room==='destiny',null,{timeout:15000});
  const arrived=await page.evaluate(()=>({x:indoor.x,y:indoor.y,anchor:indoorSpec().stations.destiny.slice(2),hostReady:!!pawHostVisit?.ready}));
  assert(Math.hypot(arrived.x-before[0],arrived.y-before[1])>5,'Traveller did not approach desk');
  assert(Math.hypot(arrived.x-arrived.anchor[0],arrived.y-arrived.anchor[1])<5,'Consultation before arrival');
  assert(arrived.hostReady,'Painted host pose family not ready');
  await shot('desk-arrival');
  console.log('Visitor physical seating remains unverified; test verifies actual walking and seated host only.');
 }
 try{
  await setup();
  await approach();
  await tapText('My birth chart','生辰命盘');await tapText('For me','看自己');
  const form=page.locator('#dialogue[data-paw-yue-question] .pawYueGuidedForm');
  await form.waitFor({timeout:10000});assert(await noPage(),'Birth questions opened external page');
  await chatGeometry('yue');await shot('yue-birth-question');await form.locator('input[type=date]').fill('1990-05-15');
  await tapText('Continue','继续');await form.locator('input[type=time]').fill('09:30');await chatGeometry('yue-time');await shot('yue-birth-time');
  await tapText('Continue','继续');await chatGeometry('yue-place');await shot('yue-birthplace');
  const place=form.locator('details select');if(!await place.isVisible())await form.locator('details summary').tap();
  const choice=await place.evaluate(e=>[...e.options].find(x=>/singapore/i.test(x.textContent)||x.textContent.includes('新加坡'))?.value);assert(choice,'Singapore birthplace option');
  await place.selectOption(choice);
  await form.locator('button[type=submit]').tap();
  await page.waitForFunction(()=>document.querySelector('.ziGrid article:not(.blank)')&&$('page').style.display==='block',null,{timeout:15000});
  assert.equal(await page.locator('#dialogue[data-paw-yue-question]').count(),0);
  await shot('yue-chart');
  const palace=page.locator('.chartTopics [data-topic="8"]');
  await palace.tap();
  assert.equal(await palace.getAttribute('aria-pressed'),'true');
  const share=page.locator('.pawZwdsShareButton');
  await share.scrollIntoViewIfNeeded();
  await share.tap();
  await page.locator('.meowShareStatus').waitFor({timeout:15000});
  await shot('yue-share');
  await page.locator('#content > .row button').first().tap();
  await page.waitForFunction(()=>room==='destiny'&&$('page').dataset.pawYueDesk==='true'&&document.querySelector('.chartTopics [data-topic="8"][aria-pressed="true"]'),null,{timeout:15000});
  await shot('yue-share-return');
  await page.locator('#content > .row button').first().tap();
  assert(await noPage());assert.equal(await page.locator('#dialogue[data-paw-yue-question]').count(),0);

  await page.evaluate(()=>closeTalk());
  await page.locator('#back').tap({timeout:10000});
  await page.waitForFunction(()=>!room&&!activity&&!transitioning&&scene==='fortune',null,{timeout:30000});
  await shot('study-departure');
  assert.deepEqual(errors,[]);console.log('PASS normal-input study entrance, host approach, chart share return and departure '+width+'x'+height+' '+text('EN','ZH'));
 }catch(e){await shot('failure').catch(()=>{});throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
