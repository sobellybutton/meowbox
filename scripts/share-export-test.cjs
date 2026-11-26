const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const [name,options] of [['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1280,height:800}}]]){
   const page=await browser.newPage(options);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto('http://127.0.0.1:8767/index.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof openMeowShare==='function'&&typeof socialLayout==='function',{},{timeout:60000});
    // Direct fixture entry, not a claim of completing the personality test by touch.
    const cases=await page.evaluate(async()=>{
      const all=[...soulCats.map(v=>({kind:'soul',title:v.slice(0,2),lines:[v.slice(2,4)],accent:v[4]})),...wonderMotives.map(v=>({kind:'motive',title:v.slice(0,2),lines:[v.slice(2,4)]})),{kind:'type',title:['INFP','INFP'],lines:[['A preference portrait','偏好小画像']]},{kind:'tarot',title:['The Moon','月亮'],lines:[['A moment of reflection','片刻自省']]},{kind:'fortune',title:['Take it easy','慢慢来'],lines:[['No rush','不用着急']]},{kind:'cafe',title:['Quiet Harbour','安静港湾'],lines:[['Time to breathe','给自己一点空间']]},{kind:'story',title:['Tea Shop Keeper','茶馆主人'],lines:[['A new life','新生活']]}];
      // The ZWDS exporter accepts only a canonical selected palace and main-star IDs.
      all.push({kind:'zwds',topicId:0,starKeys:['紫微','天府','PRIVATE_INVALID']},{kind:'zwds',topicId:8,starKeys:[]});
      const canvas=document.createElement('canvas');let checked=0;
      for(const raw of all)for(const format of Object.keys(shareFormats))for(const cn of [false,true]){
       const v=sharePublicData({...raw,name:'PRIVATE_NAME',birth:'PRIVATE_BIRTH',answers:['PRIVATE_ANSWER']});
       if(JSON.stringify(v).includes('PRIVATE'))throw Error('Private data copied');
       if(raw.kind==='zwds'){
        if(v.kind!=='zwds'||v.lines[0][1]!== (raw.starKeys.length?'紫微 · 天府':'此宫无主星'))throw Error('Wrong palace reflection data');
        const caption=meowSocialCaption(v,format,cn);
        if(caption.includes('PRIVATE')||!caption.includes(v.title[Number(cn)]))throw Error('Invalid ZWDS caption');
       }
       shareCardArt(canvas,v,format,cn);
       const [w,h]=shareFormats[format];
       if(canvas.width!==w||canvas.height!==h)throw Error('Wrong dimensions '+format);
       const pix=canvas.getContext('2d').getImageData(0,0,w,h).data;
       if(!pix[3]||pix.every((n,i)=>i%4===3||n===0))throw Error('Blank render');
       const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
       if(!blob||blob.size<5000||blob.type!=='image/png')throw Error('PNG encoding failed');
       checked++;
      }
      return checked;
    });
    console.log(name+': rendered and encoded '+cases+' card combinations');
    await page.evaluate(()=>{proposal.hidden=true;$('arrival').hidden=true;openMeowShare({kind:'soul',title:['Professional Napper','咸鱼猫'],lines:[['A master of conserving energy for genuinely important things.','把精力留给真正重要的事，比如睡觉。']],accent:'#c6a276'})});
    const panel=page.locator('.meowSharePanel');
    const xhs=panel.getByRole('button',{name:/小红书/});
    await xhs.click();assert.equal(await xhs.getAttribute('aria-pressed'),'true');
    await panel.getByRole('button',{name:'中文',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.meowSharePreview')?.height===1440);
    await panel.locator('.meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-xhs-soul-cat.png'});
    const story=panel.getByRole('button',{name:/TikTok.*Story|Story.*TikTok/i});
    await story.click();assert.equal(await story.getAttribute('aria-pressed'),'true');
    await page.waitForFunction(()=>document.querySelector('.meowSharePreview')?.height===1920);
    await panel.locator('.meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-tiktok-soul-cat.png'});
    // Verify the actual ZWDS share preview, language and PNG preparation.
    await page.evaluate(()=>openMeowShare({kind:'zwds',topicId:0,starKeys:['紫微','天府'],birth:'PRIVATE_BIRTH',name:'PRIVATE_NAME'}));
    await page.locator('.meowSharePanel .meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    await page.locator('.meowSharePanel').getByRole('button',{name:'中文',exact:true}).click();
    await page.locator('.meowSharePanel .meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    assert.equal(await page.locator('.meowSharePreview').getAttribute('aria-label'),'命宫与性格');
    await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-zwds-reflection.png'});
    assert.deepEqual(errors,[]);
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
