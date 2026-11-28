'use strict';
// Renderer evidence, not organic gameplay acceptance. Uses real game data,
// real decoded art, real browser fonts and actual full-resolution PNG bytes.
const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const engine=process.env.MEOW_BROWSER==='webkit'?'webkit':'chromium';
const out=path.join('test-results','editorial-'+engine);
const url=process.env.MEOW_TEST_URL||'http://127.0.0.1:8768/index.html';
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await ({chromium,webkit}[engine]).launch();
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof pawEditorialOther==='function'&&typeof shareCardArt==='function'&&shareCardArt.toString().includes('pawEditorialOther'));
  const fixtures=await page.evaluate(()=>{
   const rows=[];
   const push=(key,raw)=>{const data=sharePublicData(raw);if(data.kind!==raw.kind)throw Error('Wrong public kind '+key);rows.push({key,data})};
   for(const count of [1,3,5]){
    const cards=Array.from({length:count},(_,i)=>({i:[2,15,43,62,77][i],rev:i%2===1}));
    push('tarot-'+count,{kind:'tarot',title:count===1?tarotDeck[cards[0].i].slice(0,2):[count+'-card reflection',count+' 张牌小记'],cards,takeaway:readingTakeaway(cards),lines:cards.map(c=>tarotDeck[c.i].slice(0,2))});
   }
   for(const [kind,title,lines] of [
    ['soul',soulCats[0],[['A moment to enjoy your own company.','给自己一点独处的时间。']]],
    ['fortune',['A little good luck','今日小幸运'],[['Make time for something that makes you smile.','给让你微笑的小事留一点时间。']]],
    ['cafe',['A quiet cup together','一起喝杯茶'],[['Good company. No agenda.','好好相处，不必列议程。']]],
    ['story',['A life by the sea','海边的另一种人生'],[['You chose the quiet coast and a slower life.','你选择了海边和慢一点的生活。']]]
   ])push(kind,{kind,title,lines});
   push('type',{kind:'type',title:['INFP','INFP'],lines:[],computedScores:[-2,2,-4,0]});
   push('motive',{kind:'motive',title:wonderMotives[0].slice(0,2),lines:[],computedScores:[6,3,1,5,2,3,4,0,2]});
   for(const [kind,cfg] of Object.entries(pawExtraDiscoveries)){
    push(kind,{kind,title:cfg.title,lines:[],computedScores:kind==='priorities'?[4,3,3,2]:cfg.axes.map((_,i)=>i+1)});
   }
   const keys=Object.keys(pawZwdsStarNames);
   push('zwds',{kind:'zwds',topicId:chartConsultTopics[0].k,starKeys:keys.slice(0,3)});
   push('zwds_chart',{kind:'zwds_chart',palaces:Array.from({length:12},(_,i)=>({index:i,stars:i%3===0?keys.slice(0,3):i%3===1?[keys[i%keys.length]]:[]}))});
   return rows
  });
  assert.equal(fixtures.length,16);
  const manifest=[];
  for(const {key,data} of fixtures)for(const format of ['feed','xhs','story','square'])for(const cn of [false,true]){
   const result=await page.evaluate(async({data,format,cn})=>{
    await pawPrepareRecoveredShare(format,data);
    const paper=pawRecoveredImage('templates/paper_'+format+'.webp');
    const illustration=data.kind==='tarot'?readingArtwork():data.scoreRows?.length||data.kind==='zwds_chart'?null:pawRecoveredResultIllustration(data);
    for(const im of [paper,illustration].filter(Boolean))if(!im.complete)await im.decode();
    if(!paper?.naturalWidth||illustration&&!illustration.naturalWidth)throw Error('Missing production art: '+data.kind);
    await document.fonts.ready;
    const cv=document.createElement('canvas'),reference=document.createElement('canvas');
    const box=pawRecoveredShareBounds(format);
    const roles=data.cards?.length===5?fiveReadingPositions:data.cards?.length===3?[['Situation','现状'],['Notice','留意'],['Next step','下一步']]:[['Your card','今日之牌']];
    const ok=data.kind==='tarot'?pawEditorialTarot(reference,data,format,cn,box,paper,illustration,tarotDeck,roles):pawEditorialOther(reference,data,format,cn,box,paper,illustration,data.kind.startsWith('zwds')?null:socialResultQuote(data));
    if(!ok)throw Error('Editorial renderer rejected '+data.kind);
    shareCardArt(cv,data,format,cn);
    const png=cv.toDataURL('image/png');
    if(png!==reference.toDataURL('image/png'))throw Error('Effective renderer differs from editorial candidate');
    return {png:png.split(',')[1],width:cv.width,height:cv.height}
   },{data,format,cn});
   const dims={feed:[1080,1350],xhs:[1080,1440],story:[1080,1920],square:[1080,1080]}[format];
   assert.deepEqual([result.width,result.height],dims);
   const file=key+'-'+format+'-'+(cn?'zh':'en')+'.png',bytes=Buffer.from(result.png,'base64');
   assert.ok(bytes.length>10000,'Blank or incomplete PNG');
   assert.equal(bytes.readUInt32BE(16),dims[0]);assert.equal(bytes.readUInt32BE(20),dims[1]);
   fs.writeFileSync(path.join(out,file),bytes);
   manifest.push({key,format,locale:cn?'zh':'en',file,bytes:bytes.length,width:dims[0],height:dims[1]});
  }
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
  // Contact sheets at 320px image width, alongside the untouched originals.
  // Inspect these at normal phone viewing scale, not just enlarged exports.
  for(const format of ['feed','xhs','story','square'])for(const locale of ['en','zh']){
   const files=manifest.filter(v=>v.format===format&&v.locale===locale);
   await page.setContent('<html><body style="margin:0;background:#e8e2d8;display:grid;grid-template-columns:repeat(3,320px);gap:16px;padding:16px;font:14px system-ui">'+files.map(v=>'<figure style="margin:0"><img style="width:320px;display:block" src="data:image/png;base64,'+fs.readFileSync(path.join(out,v.file)).toString('base64')+'"><figcaption>'+v.key+'</figcaption></figure>').join('')+'</body></html>');
   await page.setViewportSize({width:1040,height:900});
   await page.evaluate(()=>Promise.all(Array.from(document.images,im=>im.decode())));
   await page.screenshot({path:path.join(out,'contact-'+format+'-'+locale+'.png'),fullPage:true});
  }
  console.log('Exported '+manifest.length+' actual PNGs; eight phone-scale contact sheets. Renderer evidence only.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
