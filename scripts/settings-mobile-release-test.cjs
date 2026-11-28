'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
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
   const cog=page.locator('#townSettingsToggle'),profile=page.locator('#profileHud');
   assert.equal(await page.locator('#quietToggle').isVisible(),false);
   const directCog=await cog.isVisible();
   if(directCog){
    const style=await cog.evaluate(e=>({svg:[...e.querySelectorAll('svg')].filter(x=>getComputedStyle(x).display!=='none').length,images:e.querySelectorAll('img').length,before:getComputedStyle(e,'::before').content,after:getComputedStyle(e,'::after').content,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));
    assert.deepEqual([style.svg,style.images,style.before,style.after],[1,0,'none','none']);assert.ok(style.w>=44&&style.h>=44);
   }else{assert.equal(await cog.count(),0,'Detached map gear must not remain in DOM');await profile.waitFor({state:'visible'});}
   await page.screenshot({path:'test-results/settings-'+name+'-map.png'});
   await page.evaluate(()=>{localStorage.setItem('meowbox-preview-resetProbe','keep until confirmed');localStorage.setItem('other-app-settings-test','preserve')});
   const language=await page.evaluate(()=>localStorage.getItem('meowbox-preview-zh'));
   if(directCog)await cog.tap();else{await profile.tap();await page.locator('.pawProfileSettingsEntry').tap();}
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
