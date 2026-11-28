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
  // Render the actual repository binaries as a review sheet first. Staged
  // candidates remain unregistered until visual identity/contact review.
  const base='assets/visual/staging/';
  const candidates=[
   ...['compatibility-cafe','parallel-lives','personality-lab','destiny-study'].map(n=>[n,base+'2026-11-28-consolidated/room-alternates/'+n+'.webp']),
   ['journal-cover',base+'2026-11-28-project-batch10-interface/journal-cover.webp'],
   ['heart-cafe-serve',base+'2026-11-28-batch3-heart-cafe/standing-serve.webp'],
   ['heart-cafe-portrait',base+'2026-11-28-batch3-heart-cafe/warm-portrait.webp'],
   ['storyteller-book',base+'2026-11-28-batch1-storyteller/standing-book.webp'],
   ...['seated-explain','seated-idle','seated-notebook','standing-welcome'].map(n=>['observatory-'+n,base+'2026-11-28-batch1-observatory/'+n+'.webp']),
   ...['seated-listen','seated-point','standing-inspect','standing-welcome'].map(n=>['curiosity-'+n,base+'2026-11-28-batch1-curiosity/'+n+'.webp']),
   ['tarot-deal',base+'2026-11-28-batch1-tarot/seated-deal-extended.webp'],
   ...['avatar-frame-empty','bag','calendar','mail','map','menu','notification','settings-leaf-alternate','settings'].map(n=>['interface-'+n,base+'2026-11-28-composite-recovery/interface/'+n+'.webp'])
  ];
  for(let offset=0;offset<candidates.length;offset+=9){
   const group=candidates.slice(offset,offset+9);
   await page.setViewportSize({width:1040,height:980});
   await page.setContent('<html><body style="margin:0;background:#e6ded0;display:grid;grid-template-columns:repeat(3,320px);gap:14px;padding:14px;font:16px system-ui">'+group.map(([name,file])=>'<figure style="margin:0"><div style="height:290px;background:#ddd3c4;display:flex;align-items:center;justify-content:center"><img style="max-width:310px;max-height:280px;object-fit:contain" src="data:image/webp;base64,'+fs.readFileSync(file).toString('base64')+'"></div><figcaption>'+name+'</figcaption></figure>').join('')+'</body></html>');
   await page.evaluate(()=>Promise.all(Array.from(document.images,im=>im.decode())));
   await page.screenshot({path:path.join(out,'contact-assets-'+(offset/9+1)+'.jpg'),fullPage:true,type:'jpeg',quality:88});
  }
  await page.setViewportSize({width:390,height:844});
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
    
    ['cafe',['A quiet cup together','一起喝杯茶'],[['Good company. No agenda.','好好相处，不必列议程。']]],
    ['story',['A life by the sea','海边的另一种人生'],[['You chose the quiet coast and a slower life.','你选择了海边和慢一点的生活。']]]
   ])push(kind,{kind,title,lines});
   for(let i=0;i<townFortunes.length;i++){
    const theme=townFortunes[i];
    push('fortune-'+i,{kind:'fortune',title:theme.title,lines:[theme.work,theme.rest,['Lucky colour: Rice paper · 7','幸运色：米纸白 · 7']]});
   }
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
  assert.equal(fixtures.length,27);
  const manifest=[];
  for(const {key,data} of fixtures)for(const format of ['feed','xhs','story','square'])for(const cn of [false,true]){
   const result=await page.evaluate(async({data,format,cn})=>{
    await pawPrepareRecoveredShare(format,data);
    const paper=pawRecoveredImage('templates/paper_'+format+'.webp');
    const illustration=data.kind==='tarot'?readingArtwork():data.scoreRows?.length||data.kind==='zwds_chart'?null:pawRecoveredResultIllustration(data);
    if(data.kind==='fortune'){
     const expected=pawEditorialFortuneCharm(data,townFortunes,pawRecoveredCharmPath);
     if(!expected||!illustration?.src.endsWith(expected))throw Error('Fortune export does not match its illustrated charm');
    }
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
   await page.screenshot({path:path.join(out,'contact-'+format+'-'+locale+'.jpg'),fullPage:true,type:'jpeg',quality:76});
  }
  console.log('Exported '+manifest.length+' actual PNGs; eight phone-scale contact sheets. Renderer evidence only.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
