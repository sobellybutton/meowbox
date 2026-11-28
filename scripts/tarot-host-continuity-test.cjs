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
 const make=new Function(block.replace(' const sharePrior=openMeowShare;',`
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
 m.controls.find(n=>n.textContent==='IG / FB').click();
 assert.ok(preview.hidden&&save.disabled);
 m.goBack();m.goBack();assert.equal(m.backCalls(),1);
 m.pending[4]();await Promise.resolve();assert.equal(m.draws.length,2);
 console.log('Tarot share: stale format/language, export readiness and return lifecycle passed');
}
shareRegression().catch(e=>{console.error(e);process.exitCode=1});
