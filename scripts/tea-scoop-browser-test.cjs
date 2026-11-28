'use strict';
// Actual browser input on the original kitchen/tea controls. Starts a room
// fixture, so approach and physical phone acceptance remain separate gates.
const {chromium,webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const engine=process.env.MEOW_BROWSER==='webkit'?'webkit':'chromium',out='test-results/tea-prep-'+engine;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await ({chromium,webkit}[engine]).launch();
 try{
  for(const [name,opts] of [['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]]){
   const page=await browser.newPage(opts),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const click=locator=>opts.hasTouch?locator.tap():locator.click();
   try{
    await page.goto('http://127.0.0.1:8768/index.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof pawTeaScoopFrame==='function'&&typeof pawFoodPropReady==='function');
    for(const cn of [false,true])for(const topping of [1,2]){
     const prefix=name+'-'+(cn?'zh':'en')+'-'+topping;
     await page.evaluate(cn=>{
      closeTalk();proposal.hidden=true;$('arrival').hidden=true;$('page').style.display='none';avatar=0;zh=cn;document.documentElement.lang=cn?'zh':'en';
      scene='island';room='boba';activity=null;transitioning=false;state={};pawWarmFoodProps('boba');start('bubbleTea')
     },cn);
     await page.waitForFunction(()=>pawFoodPropReady('boba_pearls_bowl')&&pawFoodPropReady('boba_jelly_bowl'));
     const panel=page.locator('#pearlRecipePanel'),buttons=panel.locator('.pearlRecipeChoices button');
     await click(panel.getByRole('button',{name:cn?'自己喝':'Make my own drink',exact:true}));
     for(const stage of ['base','sugar','ice']){
      await page.waitForFunction(stage=>state.teaStage===stage,stage);
      await click(buttons.first())
     }
     await page.waitForFunction(()=>state.teaStage==='topping');
     await click(panel.getByRole('button',{name:topping===1?(cn?'黑珍珠':'Tapioca pearls'):(cn?'椰果':'Coconut jelly'),exact:true}));
     await click(panel.getByRole('button',{name:cn?'倒茶':'Pour tea',exact:true}));
     await page.waitForFunction(()=>state.teaStage==='pearls'&&state.pawToppingBowlPainted===true);
     await page.screenshot({path:out+'/'+prefix+'-painted-bowl.jpg',type:'jpeg',quality:85});
     for(let scoop=0;scoop<2;scoop++){
      await click(buttons.first());
      await page.waitForFunction(()=>state.pawScoopPending===true);
      await page.waitForFunction(scoop=>state.teaToppingCount===scoop+1&&state.teaStage==='pearls'&&state.pawScoopPending,scoop);
      assert.equal(await buttons.first().isDisabled(),true);
      await page.screenshot({path:out+'/'+prefix+'-scoop-'+scoop+'.jpg',type:'jpeg',quality:82});
      await page.waitForFunction(scoop=>!state.pawScoopPending&&state.teaToppingCount===scoop+1&&state.teaStage===(scoop===1?'mix':'pearls'),scoop);
     }
     assert.equal(await page.evaluate(()=>state.teaPearls),10);
     for(let i=0;i<4;i++){if(await page.evaluate(()=>state.teaStage!=='mix'))break;await click(buttons.first())}
     await page.waitForFunction(()=>state.teaStage==='seal');
     await click(panel.getByRole('button',{name:cn?'按压封口':'Press to seal',exact:true}));
     await page.waitForFunction(()=>state.teaStage==='ready');
     await click(panel.getByRole('button',{name:cn?'喝一口':'Take a sip',exact:true}));
     await page.waitForFunction(()=>state.teaStage==='done'&&state.teaSaved);
     await page.screenshot({path:out+'/'+prefix+'-finished.jpg',type:'jpeg',quality:85});
     await click(panel.getByRole('button',{name:cn?'返回奶茶铺':'Back to shop',exact:true}));
     assert.ok(await page.evaluate(()=>activity===null&&room==='boba'));
     console.log(prefix+': actual bowl, two transfers, seal, drink and return passed');
    }
    assert.deepEqual(errors,[])
   }catch(e){await page.screenshot({path:out+'/'+name+'-failure.png'}).catch(()=>{});throw e}
   finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
