'use strict';
// Deterministic completed-result fixtures with actual button input.
// This does not certify full approach/interaction/finish gameplay.
const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const engine=process.env.MEOW_BROWSER==='webkit'?'webkit':'chromium';
const url='http://127.0.0.1:8768/index.html';
const out='test-results/native-keepsakes-'+engine;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await ({chromium,webkit}[engine]).launch();
 try{
  for(const [device,opts] of [['phone',{viewport:{width:390,height:844},hasTouch:true,isMobile:true}],['desktop',{viewport:{width:1440,height:900}}]]){
   const page=await browser.newPage({...opts,acceptDownloads:true});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const click=x=>opts.hasTouch?x.tap():x.click();
   try{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof pawKeepsakeRoomRoute==='function'&&openMeowShare.toString().includes('pawKeepsakeRoomRoute'));
    for(const cn of [false,true])for(const kind of ['cafe','story','type','motive','bigfive','care','priorities','values','attachment','soul']){
     const prefix=device+'-'+kind+'-'+(cn?'zh':'en');
     await page.evaluate(({cn,kind})=>{
      closeTalk();proposal.hidden=true;$('arrival').hidden=true;$('page').style.display='none';
      avatar=0;zh=cn;document.documentElement.lang=cn?'zh':'en';
      scene='wonder';transitioning=false;activity=null;state={};
      if(kind==='cafe'){
       room='match';start('match');cafeAnswers=cafeQuestions.map((_,i)=>i%3);cafeRound=cafeQuestions.length;
       const scored=pawCafeAssess(cafeAnswers,cafeQuestions.length);cafeResult={index:scored.ties[0],ties:scored.ties};cafePhase='result';syncCafeQuestionSheet();
      }else if(kind==='story'){
       room='story';start('story');parallelTrail=[];parallelNode='station';for(let i=0;i<8&&parallelScenes[parallelNode];i++){const node=parallelNode;parallelTrail.push(node);parallelNode=parallelScenes[node].choices[0][2]}if(!parallelEndings[parallelNode])throw Error('Incomplete story fixture');parallelTurning=false;syncStorySheet();
      }else{
       room='quiz';wonderSceneOpen(kind);
       if(kind==='priorities'){
        wonderSceneAnswers=wonderQuestionOrder.map(q=>q.opts[0][2]);
       }else wonderSceneAnswers=wonderQuestionOrder.map(q=>kind==='soul'?q.opts[0][2]:kind==='type'?q.id%2:1);
       wonderSceneFinish();if(!wonderSceneResult||wonderScenePhase!=='result')throw Error('Invalid completed-result fixture: '+kind);openWonderResult(kind,wonderSceneResult);
      }
     },{cn,kind});
     const resultButton=kind==='cafe'?page.locator('[data-cafe-result="share"]'):kind==='story'?page.locator('[data-story-ending="share"]'):page.locator('#choices').getByRole('button',{name:cn?'制作纪念卡':'Make a keepsake',exact:true});
     await resultButton.waitFor({timeout:10000});
     if(kind==='cafe'||kind==='story')await page.evaluate(kind=>{
      const sheet=kind==='cafe'?cafeQuestionSheet:storySheet;
      sheet.querySelectorAll('details').forEach(d=>{d.open=true});
     },kind);
     await resultButton.scrollIntoViewIfNeeded();
     const before=await page.evaluate(()=>({room,activity,scene,token:activity==='match'?cafeToken:activity==='story'?parallelToken:wonderSceneToken,result:activity==='match'?cafeResult:activity==='story'?parallelNode:wonderSceneResult,line:$('line').textContent}));
     await click(resultButton);
     const panel=page.locator('#dialogue[data-paw-keepsake]');
     await panel.waitFor({timeout:10000});
     assert.equal(await page.locator('#page').isVisible(),false,'Unexpected detached share page');
     await panel.locator('.meowShareStatus').getByText(cn?'可以分享或保存啦。':'Ready to share or save.').waitFor({timeout:15000});
     await click(panel.getByRole('button',{name:/Story \/ TikTok/}));
     await click(panel.getByRole('button',{name:cn?'English':'中文',exact:true}));
     await panel.locator('.meowShareStatus').getByText(cn?'可以分享或保存啦。':'Ready to share or save.').waitFor({timeout:15000});
     assert.deepEqual(await panel.locator('canvas').evaluate(cv=>[cv.width,cv.height]),[1080,1920]);
     // Browser-controlled OS bridge: exercise the actual share button and
     // exact file delivery. It cannot certify external-app posting.
     if(kind==='cafe'){
      const share=panel.getByRole('button',{name:cn?'分享图片':'Share image',exact:true});
      const status=panel.locator('.meowShareStatus');
      await page.evaluate(()=>{
       window.__pawShareProbe={mode:'unsupported',calls:[]};
       Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>window.__pawShareProbe.mode!=='unsupported'});
       Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{
        const probe=window.__pawShareProbe,file=payload.files[0];
        const bytes=new Uint8Array(await file.arrayBuffer()),view=new DataView(bytes.buffer);
        probe.calls.push({name:file.name,type:file.type,size:file.size,width:view.getUint32(16),height:view.getUint32(20)});
        if(probe.mode==='cancel')throw new DOMException('cancelled','AbortError');
        if(probe.mode==='fail')throw new Error('delivery failed');
       }});
      });
      await click(share);await status.filter({hasText:cn?/请保存 PNG/:/Save the PNG/}).waitFor();
      for(const mode of ['success','cancel','fail']){
       await page.evaluate(mode=>window.__pawShareProbe.mode=mode,mode);
       await click(share);
       const expected=mode==='success'?(cn?/系统分享已结束/:/Share menu finished/):mode==='cancel'?(cn?/已取消分享/:/Sharing cancelled/):(cn?/请保存 PNG/:/Save the PNG/);
       await status.filter({hasText:expected}).waitFor();
       assert.equal(await share.isEnabled(),true);
       assert.equal(await panel.locator('canvas').isVisible(),true);
      }
      const calls=await page.evaluate(()=>window.__pawShareProbe.calls);
      assert.equal(calls.length,3);
      for(const file of calls){
       assert.equal(file.name,'pawradise-cafe-story.png');assert.equal(file.type,'image/png');assert.ok(file.size>10000);assert.deepEqual([file.width,file.height],[1080,1920]);
      }
      await page.evaluate(()=>{delete navigator.canShare;delete navigator.share;delete window.__pawShareProbe});
      // Every actual destination button renders the expected full-size PNG.
      for(const [name,dims] of [['IG / FB',[1080,1350]],['小红书',[1080,1440]],[cn?'微信':'WeChat',[1080,1080]],['Story / TikTok',[1080,1920]]]){
       await click(panel.getByRole('button',{name,exact:true}));
       await status.getByText(cn?'可以分享或保存啦。':'Ready to share or save.').waitFor({timeout:15000});
       assert.deepEqual(await panel.locator('canvas').evaluate(cv=>[cv.width,cv.height]),dims);
      }
     }
     const dl=page.waitForEvent('download');
     await click(panel.getByRole('button',{name:cn?'保存 PNG 图片':'Save PNG image',exact:true}));
     const saved=await dl;
     await saved.saveAs(out+'/'+prefix+'.png');
     const png=fs.readFileSync(out+'/'+prefix+'.png');
     assert.ok(png.length>10000);assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[1080,1920]);
     assert.match(saved.suggestedFilename(),new RegExp('^pawradise-'+kind+'-story\\.png$'));
     await click(panel.getByRole('button',{name:cn?'复制文案':'Copy caption',exact:true}));
     await panel.locator('.meowShareStatus').filter({hasText:cn?/文案已复制|请选择并复制/:/Caption copied|Select and copy/}).waitFor();
     await page.screenshot({path:out+'/'+prefix+'-preview.jpg',type:'jpeg',quality:80});
     await click(panel.getByRole('button',{name:cn?(kind==='cafe'?'返回心得':kind==='story'?'返回故事':'返回小记'):(kind==='cafe'?'Back to reflection':kind==='story'?'Back to the story':'Back to the notebook'),exact:true}));
     await resultButton.waitFor({timeout:10000});
     if(kind==='cafe'||kind==='story')assert.ok(await page.evaluate(kind=>{
      const sheet=kind==='cafe'?cafeQuestionSheet:storySheet;
      const details=Array.from(sheet.querySelectorAll('details'));
      return details.length>0&&details.every(d=>d.open)
     },kind),'Expanded result details lost after sharing');
     assert.equal(await page.locator('#page').isVisible(),false);
     const after=await page.evaluate(()=>({room,activity,scene,token:activity==='match'?cafeToken:activity==='story'?parallelToken:wonderSceneToken,result:activity==='match'?cafeResult:activity==='story'?parallelNode:wonderSceneResult,line:$('line').textContent}));
     for(const k of ['room','activity','scene','token','result'])assert.deepEqual(after[k],before[k],prefix+' changed '+k);
     if(kind!=='cafe'&&kind!=='story')assert.equal(after.line,before.line,'Notebook returned to wrong page');
     await page.screenshot({path:out+'/'+prefix+'-return.jpg',type:'jpeg',quality:80});
     console.log(prefix+': in-room preview, PNG, exact return passed');
    }
    assert.deepEqual(errors,[]);
   }catch(e){await page.screenshot({path:out+'/'+device+'-failure.png'}).catch(()=>{});throw e}
   finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
