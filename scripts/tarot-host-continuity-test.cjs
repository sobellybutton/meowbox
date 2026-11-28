'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/painted-lobby-runtime.js'),'utf8');
const lobby=source.slice(source.indexOf('function pawTarotLobbyFrame'),source.indexOf('const pawTarotLobbyCameraBefore'));
const body=source.slice(source.indexOf('/* PAW_TAROT_HOST_CONTINUITY_BEGIN */'),source.indexOf("if(typeof document!=='undefined')queueMicrotask(pawInstallTarotHostContinuity)"));
const api=new Function(lobby+body+';return {pawTarotConsultationPlate,pawTarotLobbyFrame,pawReadingWideFrame}')();
let n=0;
for(const [w,h] of [[320,568],[320,900],[360,640],[390,844],[430,932],[768,1024],[844,390],[900,720],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440]])for(const z of [.3,.6,1,1.5,2.4]){
 const b={x:-123/z,y:75/z,w:w/z,h:h/z},p=api.pawTarotConsultationPlate(b,928,1648,z);
 assert.ok(Math.abs(p.w/p.h-928/1648)<1e-10);
 for(const a of [.018,.135,.855]){const x=(p.x+p.w*a-b.x)*z;assert.ok(x>=-.001&&x<=w+.001)}
 for(const a of [.337,.399,.61,.7,.89]){const y=(p.y+p.h*a-b.y)*z;assert.ok(y>=-.001&&y<=h+.001)}
 const q=api.pawTarotConsultationPlate({x:0,y:0,w,h},928,1648);
 assert.ok(Math.abs(p.h*z-q.h)<1e-8);
 if(w<h){
  const c=api.pawTarotLobbyFrame(w,h,{x:0,y:0,w:928,h:1648});
  assert.ok(Math.abs(q.h-1648*c.s)<1e-8&&Math.abs(q.x-c.ox)<1e-8&&Math.abs(q.y-c.oy)<1e-8);
  }else{
  const c=api.pawReadingWideFrame(w,h,{x:0,y:0,w:928,h:1648});
  if(c){
   assert.ok(Math.abs(q.h-1648*c.s)<1e-8&&Math.abs(q.x-c.ox)<1e-8&&Math.abs(q.y-c.oy)<1e-8);
   assert.ok(Math.abs((p.x-b.x)*z-c.ox)<1e-8&&Math.abs((p.y-b.y)*z-c.oy)<1e-8);
  }else assert.ok(q.h<=h+.001&&q.w<=w+.001);
 }
 n++;
}
assert.equal(api.pawTarotConsultationPlate({x:0,y:0,w:0,h:800},928,1648),null);
const make=new Function(lobby+body+`
let room='tarot',activity='tarot',pawReadingVisit='tarot',ready=true,calls=[],depth=0;
const im={naturalWidth:928,naturalHeight:1648};
const b={x:0,y:0,w:360,h:640},W=360;
let paintLivingBackdrop=()=>calls.push(['fallback']);
const pawReadingImage=()=>im,pawReadingAPI=()=>null,pawRoomImageReady=()=>ready,livingBounds=()=>b;
const ctx={save(){depth++},restore(){depth--},fillRect(){},beginPath(){},rect(){},clip(){},drawImage(i,...p){calls.push(['art',...p])}};
const pawSceneAirLive=(id,p)=>calls.push(['air',p]),pawDrawReadingSeated=(id,p)=>calls.push(['host',p]);
pawInstallTarotHostContinuity();
return {run:(r,a,v,ok)=>{room=r;activity=a;pawReadingVisit=v;ready=ok;calls=[];paintLivingBackdrop();return {calls,depth}}};
`)();
for(const a of ['tarot','love']){
 const q=make.run('tarot',a,'tarot',true);assert.equal(q.depth,0);
 assert.equal(q.calls.length,3);assert.equal(q.calls[0][0],'art');
 assert.equal(q.calls[1][1],q.calls[2][1]);
 assert.deepEqual(q.calls[0].slice(1),[q.calls[2][1].x,q.calls[2][1].y,q.calls[2][1].w,q.calls[2][1].h]);
}
for(const args of [['tarot',null,'tarot',true],['tarot','tarot','destiny',true],['tarot','tarot','tarot',false],['destiny','tarot','tarot',true]])assert.deepEqual(make.run(...args),{calls:[['fallback']],depth:0});
console.log('Tarot host continuity: '+n+' viewport/camera scenarios and six runtime cases passed');

const focus=new Function(source.slice(source.indexOf('function pawConsultReadingFocus'),source.indexOf('/* PAW_NATIVE_CONSULT_END */'))+';return pawConsultReadingFocus')();
let focusChecks=0;
const check=(v)=>{assert.ok(v);focusChecks++};
const line=c=>'card '+c.i;
for(const count of [1,3,5]){
 const q={readStage:'focus',readCards:Array.from({length:count},(_,i)=>({i})),readFlip:Array.from({length:count},(_,i)=>i+1)};
 for(const language of ['Position','位置'])for(let i=0;i<count;i++){
  const words=language+' · '+(i+1)+'/'+count+'\n'+line(q.readCards[i])+'\n\nReflection';
  check(focus(q,words,['card'],line,10)===i);
  check(focus(q,words,['card'],line,q.readFlip[i]+.5)===null);
 }
 check(focus(q,'summary',['summary'],line,10)===-1);
 check(focus(q,'summary',['summary'],line,count+.5)===null);
 check(focus(q,'card 0',[],line,10)===null);
 check(focus({...q,readStage:'choose'},'card 0',['card'],line,10)===null);
}
const duplicates={readStage:'cards',readCards:[{i:1},{i:1},{i:3}],readFlip:[1,2,3]};
check(focus(duplicates,'Position · 2/3\ncard 1',['card'],line,5)===1);
check(focus(duplicates,'card 1',['card'],line,5)===null);
check(focus({readStage:'cards',readCards:[],readFlip:[]},'summary',['summary'],line,5)===null);
check(focus({...duplicates,readFlip:[1,2,NaN]},'summary',['summary'],line,5)===null);
console.log('Tarot host presentation: '+focusChecks+' focused reading and summary checks passed');

async function shareRegression(){
 const block=source.slice(source.indexOf(' const sharePrior=openMeowShare;'),source.indexOf(' const css=document.createElement'));
 const helpers=source.slice(source.indexOf('function pawKeepsakeFormatGuide'),source.indexOf('/* PAW_NATIVE_CONSULT_END */'));
 const make=new Function(helpers+block.replace(' const sharePrior=openMeowShare;',`
 let room='tarot',activity='tarot',state={},talkOpen=true,zh=false,openMeowShare=()=>{},backCalls=0;
 const tr=(a,b)=>zh?b:a,shareFormats={feed:[1080,1350],xhs:[1080,1440],story:[1080,1920],square:[1080,1080]};
 const pending=[],blobs=[],draws=[],controls=[],nodes=[];
 function node(){return {isConnected:true,hidden:false,style:{},attrs:{},children:[],setAttribute(k,v){this.attrs[k]=v},hasAttribute(k){return Object.hasOwn(this.attrs,k)},closest(){return this.isConnected?dialogue:null},prepend(v){this.children.unshift(v)},toBlob(cb){blobs.push(cb)}}}
 const dialogue=node(),choices=node(),page=node();page.style.display='none';
 const $=id=>({dialogue,choices,page}[id]);
 const element=(tag,text,parent,cls)=>{const n=node();n.className=cls;n.textContent=text;parent.children.push(n);nodes.push(n);return n};
 const b=(parent,text,click)=>{const n=node();n.textContent=text;n.click=click;parent.children.push(n);controls.push(n);return n};
 const sharePublicData=x=>x,closeTalk=()=>{talkOpen=false;for(const n of nodes)n.isConnected=false;delete dialogue.attrs['data-paw-keepsake']};
 let goBack;const say=(name,words,options)=>{talkOpen=true;goBack=options[0][1]};
 const pawPrepareRecoveredShare=()=>new Promise(resolve=>pending.push(resolve));
 const shareCardArt=(cv,data,format,cn)=>draws.push([format,cn]);
 const File=class{constructor(parts,name){this.name=name}};
 const navigator={canShare:()=>false},meowShareUrl='https://sobellybutton.github.io/meowbox/';
 `)+`
 openMeowShare({kind:'tarot',title:['A','甲'],cards:[{i:1}]},()=>backCalls++);
 return {pending,blobs,draws,controls,nodes,goBack:()=>goBack(),backCalls:()=>backCalls}
 `);
 const m=make(),preview=m.nodes.find(n=>n.className==='meowSharePreview'),save=m.controls.find(n=>n.textContent==='Save PNG image'),share=m.controls.find(n=>n.textContent==='Share image');
 assert.ok(preview.hidden&&save.disabled&&share.disabled);
 m.controls.find(n=>n.textContent==='小红书').click();
 m.controls.find(n=>n.textContent==='中文').click();
 m.pending[0]();m.pending[1]();await Promise.resolve();
 assert.equal(m.draws.length,0);
 m.pending[2]();await Promise.resolve();
 assert.deepEqual(m.draws,[['xhs',true]]);
 assert.ok(preview.hidden&&save.disabled);
 m.controls.find(n=>n.textContent==='Story / TikTok').click();
 m.blobs[0]({});assert.ok(preview.hidden&&save.disabled);
 m.pending[3]();await Promise.resolve();m.blobs[1]({});
 assert.ok(!preview.hidden&&!save.disabled&&!share.disabled);
 assert.ok(m.nodes.find(n=>n.className==='pawKeepsakeGuide').textContent.includes('1080 × 1920'));
 await share.click();assert.ok(m.nodes.find(n=>n.className==='meowShareStatus').textContent.includes('upload'));
 const copy=m.controls.find(n=>n.textContent==='Copy caption'),manual=m.nodes.find(n=>n.className==='pawKeepsakeCaption');
 await copy.click();assert.ok(!manual.hidden&&manual.value.includes('甲')&&!manual.value.includes('https://'));
 
 m.controls.find(n=>n.textContent==='IG / FB').click();
 assert.ok(preview.hidden&&save.disabled&&copy.disabled&&manual.hidden&&manual.value==='');
 m.goBack();m.goBack();assert.equal(m.backCalls(),1);
 m.pending[4]();await Promise.resolve();assert.equal(m.draws.length,2);
 console.log('Tarot share: stale format/language, export readiness and return lifecycle passed');
}
shareRegression().catch(e=>{console.error(e);process.exitCode=1});

const shareHelpers=new Function(source.slice(source.indexOf('function pawKeepsakeFormatGuide'),source.indexOf('/* PAW_NATIVE_CONSULT_END */'))+';return {pawKeepsakeFormatGuide,pawKeepsakeShareMode}')();
const sizes={feed:[1080,1350],xhs:[1080,1440],story:[1080,1920],square:[1080,1080]};
for(const [i,k] of Object.keys(sizes).entries())for(const cn of [false,true]){
 const text=shareHelpers.pawKeepsakeFormatGuide(k,cn,sizes);
 assert.ok(text.includes(['4:5','3:4','9:16','1:1'][i])&&text.includes(sizes[k].join(' × ')));
}
assert.equal(shareHelpers.pawKeepsakeFormatGuide('bad',false,sizes),'');
assert.equal(shareHelpers.pawKeepsakeShareMode({share(){},canShare(){return true}},{}),true);
assert.equal(shareHelpers.pawKeepsakeShareMode({share(){},canShare(){throw Error('unsupported')}},{}),false);
assert.equal(shareHelpers.pawKeepsakeShareMode({share(){}},{}),false);
console.log('Tarot share destination guide: eight locale/format cases and four invalid/support cases passed');

const editorial=new Function(source.slice(source.indexOf('/* PAW_EDITORIAL_SHARE_BEGIN */'),source.indexOf('/* PAW_EDITORIAL_SHARE_END */'))+';return {pawEditorialTarotPlan,pawEditorialTextFit,pawEditorialTarot}')();
const exportBoxes={feed:[1080,1350,271,1119],xhs:[1080,1440,289,1195],story:[1080,1920,380,1598],square:[1080,1080,220,892]};
let editorialCases=0;
for(const [format,[width,height,top,bottom]] of Object.entries(exportBoxes)){
 const box={width,height,top,bottom,left:84,right:format==='story'?142:84};
 for(const count of [1,3,5]){
  const plan=editorial.pawEditorialTarotPlan(box,count);
  assert.equal(plan.slots.length,count);
  for(const slot of plan.slots)for(const [x,y,w,h] of [slot.card,slot.label]){
   assert.ok(w>0&&h>0&&x>=box.left&&x+w<=width-box.right+.001&&y>=top&&y+h<=plan.reading[1]+.001);
  }
  assert.ok(plan.reading[1]+plan.reading[3]<=plan.footer[1]);
  for(const cn of [false,true]){
   const text=[],draws=[],rotations=[];
   const g={save(){},restore(){},translate(){},rotate(v){rotations.push(v)},drawImage(...v){draws.push(v)},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(v){text.push(v)},measureText(v){return {width:Array.from(v).length*Number(this.font.match(/(\d+)px/)[1])*(cn?.88:.56)}}};
   const cv={getContext:()=>g},paper={complete:true,naturalWidth:width,naturalHeight:height},atlas={complete:true,naturalWidth:1024,naturalHeight:2180};
   const deck=Array.from({length:count},(_,i)=>[['The Star','Knight of Pentacles','Wheel of Fortune','The High Priestess','Ten of Swords'][i],['星星','星币骑士','命运之轮','女祭司','宝剑十'][i]]);
   const cards=deck.map((_,i)=>({i,rev:i%2===1}));
   const roles=deck.map(()=>['Notice','留意']);
   const data={kind:'tarot',title:['Moonlight reflection','月光塔罗手记'],cards,takeaway:['Take some time to notice the things that matter. '.repeat(8),'给自己一点时间，慢慢看清眼前真正重要的事。'.repeat(10)]};
   assert.ok(editorial.pawEditorialTarot(cv,data,format,cn,box,paper,atlas,deck,roles));
   assert.equal(cv.width,width);assert.equal(cv.height,height);
   assert.equal(draws.filter(d=>d[0]===atlas).length,count);
   assert.equal(rotations.length,cards.filter(c=>c.rev).length);
   assert.ok(!text.some(v=>v.includes('undefined')));
   for(const card of deck){const name=card[Number(cn)];assert.ok(text.join(' ').includes(name)||text.join('').includes(name))}
    assert.equal(text.filter(v=>v===(cn?'逆位':'Reversed')).length,cards.filter(c=>c.rev).length);
    assert.equal(text.filter(v=>v===(cn?'正位':'Upright')).length,cards.filter(c=>!c.rev).length);
   editorialCases++;
  }
 }
}
console.log('Editorial Tarot exports: '+editorialCases+' format, spread and language cases passed with mocked canvas');

const other=new Function(source.slice(source.indexOf('function pawEditorialCanvasBox'),source.indexOf('function pawEditorialTarot('))+source.slice(source.indexOf('/* PAW_EDITORIAL_RESULTS_BEGIN */'),source.indexOf('/* PAW_EDITORIAL_RESULTS_END */'))+';return {pawEditorialThemes,pawEditorialOther,pawEditorialResultPlan,pawEditorialScoreRatio,pawEditorialCanvasBox}')();
let otherCases=0;
for(const [format,[width,height,top,bottom]] of Object.entries(exportBoxes)){
 const box={width,height,top,bottom,left:84,right:format==='story'?142:84};
 for(const kind of Object.keys(other.pawEditorialThemes)){
  const count=({type:4,motive:9,bigfive:5,care:5,priorities:4,values:4,attachment:4})[kind]||0;
  const mode=kind==='zwds_chart'?'chart':count?'scores':'illustrated',plan=other.pawEditorialResultPlan(box,mode,count);
  for(const [x,y,w,h] of [plan.title,plan.footer,plan.body,...(plan.rows||[]),...(plan.cells||[]),...(plan.art?[plan.art,plan.summary]:[])]){
   assert.ok(x>=box.left&&x+w<=width-box.right+.001&&y>=top&&y+h<=bottom+.001&&w>0&&h>0);
  }
  for(const cn of [false,true]){
   const printed=[],draws=[];
   const g={drawImage(...v){draws.push(v)},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(v){printed.push(v)},measureText(v){return {width:Array.from(v).length*Number(this.font.match(/(\d+)px/)[1])*(cn?.9:.56)}}};
   const cv={getContext:()=>g},paper={complete:true,naturalWidth:width,naturalHeight:height},art={complete:true,naturalWidth:800,naturalHeight:1200};
   const data={kind,title:['My actual outcome','我的实际结果'],lines:[['A public result line','公开的结果']],takeaway:['A moment of reflection','留一点时间给自己'],privateAnswer:'NEVER EXPORT'};
   if(count)data.scoreRows=Array.from({length:count},(_,i)=>({label:['Trait '+(i+1),'倾向 '+(i+1)],value:[i+' / 9',i+' / 9']}));
   if(mode==='chart')data.palaces=Array.from({length:12},(_,i)=>({name:['Palace '+(i+1),'宫 '+(i+1)],stars:i%2===0?[['Sun','太阳']]:[]}));
   assert.ok(other.pawEditorialOther(cv,data,format,cn,box,paper,art,['A playful quote','一句玩笑']));
   assert.equal(cv.width,width);assert.equal(cv.height,height);
   const result=printed.join(' ');
   assert.ok(!result.includes('NEVER EXPORT'));
   assert.ok(result.includes(data.title[Number(cn)])||printed.join('').includes(data.title[Number(cn)]));
   if(count)for(const row of data.scoreRows){assert.ok(result.includes(row.label[Number(cn)])||printed.join('').includes(row.label[Number(cn)]));assert.ok(result.includes(row.value[Number(cn)]))}
   if(mode==='chart')for(const p of data.palaces)assert.ok(result.includes(p.name[Number(cn)])||printed.join('').includes(p.name[Number(cn)]));
   if(mode==='illustrated'){assert.equal(draws.length,2);assert.ok(result.includes(data.lines[0][Number(cn)])||printed.join('').includes(data.lines[0][Number(cn)]))}
   otherCases++;
  }
 }
}
console.log('Editorial public result exports: '+otherCases+' result/format/language cases passed with mocked canvas');

for(const [v,ratio,split] of [['0 / 6',0,false],['6 / 6',1,false],['1 : 3',.25,true],['4 : 0',1,true],['2 : 2',.5,true]])assert.deepEqual(other.pawEditorialScoreRatio(v),{ratio,split});
for(const v of ['7 / 6','0 : 0','0 / 0','not a score','-1 / 6'])assert.equal(other.pawEditorialScoreRatio(v),null);
console.log('Editorial exact score graphics: 10 valid and invalid cases passed');

const liveRoutes=new Function(source.slice(source.indexOf('function pawKeepsakeRoomRoute'),source.indexOf('/* PAW_NATIVE_CONSULT_END */'))+';return {pawKeepsakeRoomRoute,pawKeepsakeVisitOwns}')();
const routeCases=[
 [{room:'tarot',activity:'tarot'},'tarot',true,'tarot'],
 [{room:'tarot',activity:'love'},'tarot',true,'tarot'],
 [{room:'match',activity:'match',scene:'wonder',phase:'result'},'cafe',false,'cafe'],
 [{room:'story',activity:'story',scene:'wonder',phase:'result'},'story',false,'story'],
 ...['quiz','curiosity','observatory'].flatMap(room=>['type','motive','bigfive','care','values','attachment','priorities'].map(mode=>[{room,activity:'wonderScene',scene:'wonder',phase:'result',mode,result:{}},mode,true,'notebook']))
];
for(const [v,kind,back,id] of routeCases){
 assert.equal(liveRoutes.pawKeepsakeRoomRoute(v,kind,back)?.id,id);
 assert.equal(liveRoutes.pawKeepsakeRoomRoute({...v,page:true},kind,back),null);
 assert.equal(liveRoutes.pawKeepsakeRoomRoute(v,'unrelated',back),null);
 const origin={...v,run:{},token:7,page:false};
 assert.ok(liveRoutes.pawKeepsakeVisitOwns(origin,{...origin}));
 for(const key of ['room','activity','scene','phase','run','token','mode','result','page'])assert.equal(liveRoutes.pawKeepsakeVisitOwns(origin,{...origin,[key]:key==='page'?true:Symbol(key)}),false);
}
for(const [v,kind,back] of [[{room:'match',activity:'match',scene:'wonder',phase:'question'},'cafe',false],[{room:'story',activity:'story',scene:'wonder',phase:'turn'},'story',false],[{room:'quiz',activity:'wonderScene',scene:'wonder',phase:'result',mode:'type',result:{}},'type',false],[{room:'tarot',activity:'tarot'},'tarot',false]])assert.equal(liveRoutes.pawKeepsakeRoomRoute(v,kind,back),null);
console.log('Live keepsake routes: '+routeCases.length+' valid routes, archive fallbacks and stale visit guards passed');

const caption=new Function(source.slice(source.indexOf('function pawKeepsakeCaption'),source.indexOf('function pawKeepsakeRoomRoute'))+';return pawKeepsakeCaption')();
for(const format of ['feed','xhs','story','square'])for(const cn of [false,true]){
 const result=caption({title:['A real result','实际结果'],private:'PRIVATE'},format,cn,'https://example.org/');
 assert.ok(result.includes(cn?'实际结果':'A real result')&&!result.includes('PRIVATE'));
 assert.equal(result.includes('https://'),format==='feed'||format==='square');
}
console.log('Native public caption: eight format/language cases and manual clipboard fallback passed');
