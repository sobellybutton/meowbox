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
      const canvas=document.createElement('canvas');let checked=0;
      for(const raw of all)for(const format of Object.keys(shareFormats))for(const cn of [false,true]){
       const v=sharePublicData({...raw,name:'PRIVATE_NAME',birth:'PRIVATE_BIRTH',answers:['PRIVATE_ANSWER']});
       if(JSON.stringify(v).includes('PRIVATE'))throw Error('Private data copied');
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
    await panel.getByRole('button',{name:'小红书 · 3:4',exact:true}).click();
    await panel.getByRole('button',{name:'中文',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.meowSharePreview')?.height===1440);
    await panel.locator('.meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-xhs-soul-cat.png'});
    await panel.getByRole('button',{name:'TikTok / Story · 9:16',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.meowSharePreview')?.height===1920);
    await panel.locator('.meowShareStatus').getByText(/Ready to share|可以分享/).waitFor({timeout:10000});
    await page.locator('.meowSharePreview').screenshot({path:'test-results/'+name+'-tiktok-soul-cat.png'});
    assert.deepEqual(errors,[]);
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
