'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const language=process.env.PAW_LANGUAGE||'EN',cn=language!=='EN',size=process.env.PAW_VIEWPORT||'390x844';
const [width,height]=size.split('x').map(Number);
fs.mkdirSync('test-results/pond',{recursive:true});
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const tap=loc=>loc.tap({timeout:15000}),shot=name=>page.screenshot({path:'test-results/pond/'+size+'-'+(cn?'zh':'en')+'-'+name+'.png'});
 try{
 await page.goto('http://127.0.0.1:8772/index.html',{waitUntil:'domcontentloaded'});
 const proposal=page.locator('#proposal'),next=proposal.locator('footer button.next');
 await next.waitFor({timeout:45000});
 await tap(proposal.locator('.languageChoice').getByRole('button',{name:language,exact:true}));
 await tap(next);await proposal.locator('.rail-ticket input').fill('Traveller 旅人');
 await tap(proposal.locator('.ticket-confirm'));await tap(next);
 await tap(proposal.locator('footer .actions button').first());await tap(proposal.locator('.rail-arrive'));
 await proposal.locator('.shrine-enter').waitFor({state:'visible',timeout:20000});await tap(proposal.locator('.shrine-enter'));
 await proposal.waitFor({state:'hidden',timeout:30000});
 await page.waitForFunction(()=>!transitioning&&!room&&!activity&&scene==='fortune'&&valleyRevealAt<0&&!signRoot.hidden,null,{timeout:30000});
 // Controlled room admission: this isolates the pond's own normal visible interactions.
 await page.evaluate(()=>{room='wishes';activity=null;action('coin')});
 const pond=page.locator('.wishRitual'),actor=page.locator('.pawWishBankActors'),coin=pond.locator('.ritualCoin');
 await pond.waitFor({timeout:12000});await actor.waitFor({state:'visible'});
 const take=page.getByRole('button',{name:cn?'取一枚爪爪币':'Take a Paw Coin',exact:true});
 await tap(take);await coin.waitFor({state:'visible'});await shot('coin-held');
 await tap(page.locator('.wishKeyboard').locator('..').locator('summary'));
 const throwButton=page.locator('.wishKeyboard').getByRole('button',{name:cn?'投币':'Throw',exact:true});
 await tap(throwButton);
 await page.waitForFunction(()=>document.querySelector('.wishRitual')?.getAttribute('aria-busy')==='true',null,{timeout:5000});
 await shot('throw-flight');
 await page.waitForFunction(()=>document.querySelector('.wishRitual')?.getAttribute('aria-busy')==='false',null,{timeout:10000});
 assert.equal(await coin.isVisible(),false);await shot('throw-result');
 const back=page.getByRole('button',{name:cn?'回到花园':'Return to the garden',exact:true});
 await tap(back);await page.locator('#page').waitFor({state:'hidden'});await shot('returned');
 assert.deepEqual(errors,[]);console.log('PASS pond pickup, actual accessible throw and departure '+size+' '+language);
 }catch(e){await shot('failure').catch(()=>{});throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
