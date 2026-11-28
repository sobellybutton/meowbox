/* A mapped room has one backdrop authority. The old portrait-specific
   Tarot wrapper otherwise paints its geometric scene over the admitted
   watercolor plate on every narrow-screen frame. Preserve fallback only
   when the mapped visit is genuinely inactive. */
const pawRetiredTarotBackdrop=paintPortraitReadingRoom;
paintPortraitReadingRoom=function(...args){
 if(typeof pawReadingActive==='function'&&pawReadingActive()&&room==='tarot'&&pawReadingBackdrop())return true;
 return pawRetiredTarotBackdrop.apply(this,args)
};

/* Preserve the seated reader and the entire reviewed Tarot walking lane.
   A centered cover crop cuts off the reader on narrow phone screens.
   Fit the protected horizontal span when necessary; never distort art. */
function pawTarotLobbyFrame(w,h,p){
 if(!p||![w,h,p.x,p.y,p.w,p.h].every(Number.isFinite)||Math.min(w,h,p.w,p.h)<=0||w>=h)return null;
 const left=.018,right=.855,span=right-left;
 const s=Math.min(Math.max(w/p.w,h/p.h),w/(p.w*span));
 const pw=p.w*s,ph=p.h*s;
 const fraction=w/pw;
 const crop=Math.max(0,Math.min(left,1-fraction,right-fraction<left?left:1-fraction));
 const ox=pw<=w?(w-pw)/2:-pw*crop;
 const oy=ph<h?(h-ph)/2:Math.max(h-ph,Math.min(0,h*.5-ph*.58));
 return {s,ox:ox-p.x*s,oy:oy-p.y*s}
}
/* PAW_READING_WIDE_FRAME_BEGIN */
// Keep the entire horizontal painting, host and authored floor lane.
// Only trim the unused upper ceiling and lower edge of the portrait.
// Use a modest zoom on roomy landscape displays, not a wide cover crop.
function pawReadingWideFrame(w,h,p){
 if(!p||![w,h,p.x,p.y,p.w,p.h].every(Number.isFinite)||Math.min(w,h,p.w,p.h)<=0||w<900||w/h<1.25)return null;
 const top=.12,bottom=.98,span=bottom-top;
 const s=Math.min(h/(p.h*span),w/p.w);
 const pw=p.w*s,ph=p.h*s;
 const left=(w-pw)/2,oy=(h-ph*span)/2-ph*top;
 return {s,ox:left-p.x*s,oy:oy-p.y*s}
}
/* PAW_READING_WIDE_FRAME_END */
const pawTarotLobbyCameraBefore=pawReadingCamera;
pawReadingCamera=function(api,w,h,p=pawReadingPlate){
 if(room==='tarot'&&pawReadingActive()&&w<h){
  const frame=pawTarotLobbyFrame(w,h,p);if(frame)return frame
 }
 if(['tarot','destiny'].includes(room)&&pawReadingActive()){
  const frame=pawReadingWideFrame(w,h,p);if(frame)return frame
 }
 return pawTarotLobbyCameraBefore(api,w,h,p)
};

/* PAW_NATIVE_CONSULT_BEGIN */
function pawConsultActorScale(base,camScale,height){
 if(![base,camScale,height].every(Number.isFinite)||base<=0||camScale<=0||height<=0)return base;
 const desired=Math.min(height*.25,136),screen=94*base*camScale;
 return Math.max(base,Math.min(base*1.35,desired/(94*camScale),screen*1.35/(94*camScale)))
}
function pawConsultCardBox(x,y,w,h){
 if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)return null;
 const width=Math.min(w,h*128/218);
 return {x:x+(w-width)/2,y,w:width,h}
}
function pawConsultInputPlan(form,kind){
 if(!form||!['year','chart'].includes(kind))return [];
 const date=form.querySelector('input[type=date]');
 if(kind==='year'){
  const year=form.querySelector('select');return date&&year?[date,year]:[]
 }
 const time=form.querySelector('input[type=time]'),place=form.querySelector('details select'),nums=[...form.querySelectorAll('input[type=number]')];
 return date&&time&&place&&nums.length===3?[date,time,place,...nums]:[]
}
function pawConsultPresetReady(place,fields){
 return !!place&&place!=='custom'&&fields.length===3&&fields.every(f=>String(f.value).trim()!==''&&Number.isFinite(Number(f.value))&&f.checkValidity())
}
function pawConsultCurrent(origin,current){
 return !!origin&&!!current&&origin.room===current.room&&origin.form===current.form&&origin.subject===current.subject
}
/* PAW_NATIVE_CONSULT_END */
function pawInstallNativeConsultation(){
 const scalePrior=travellerRoomScale;
 travellerRoomScale=function(height,camera){
  const base=scalePrior(height,camera);
  return room==='tarot'&&pawReadingActive()?pawConsultActorScale(base,camera,height):base
 };
 const drawFacePrior=drawReadingCard;
 drawReadingCard=function(x,y,w,h,index,reversed){
  if(room!=='tarot'||!['tarot','love'].includes(activity))return drawFacePrior(x,y,w,h,index,reversed);
  const d=tarotDeck[index],box=pawConsultCardBox(x,y,w,h);if(!d||!box)return;
  const im=readingArtwork();
  if(!im?.complete||im.naturalWidth!==1024||im.naturalHeight!==2180){card(x,y,w,h,false);return}
  ctx.save();try{
   ctx.translate(box.x+box.w/2,box.y+box.h/2);
   if(reversed)ctx.rotate(Math.PI);
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   ctx.drawImage(im,index%8*128,Math.floor(index/8)*218,128,218,-box.w/2,-box.h/2,box.w,box.h)
  }finally{ctx.restore()}
 };
 // The existing resident conversation already owns the real choice callbacks.
 // Remove the detached portrait and make its question a single quiet speech strip.
 const sayPrior=say,closePrior=closeTalk;
 say=function(name,words,choices=[],...rest){
  if(room==='tarot'&&['tarot','love'].includes(activity)&&name===tr('Fortune Teller','占卜师')&&['cards','focus'].includes(state.readStage)&&typeof words==='string'&&choices.some(c=>c[0]===tr('Back to the table','回到牌桌'))){
   const index=state.readCards?.findIndex(c=>{const d=tarotDeck[c.i];return d&&words.split('\n').includes(tr(d[0],d[1])+' · '+orient(c.rev))});
   if(index>=0&&state.readFlip?.[index]>=0&&t-state.readFlip[index]>=.72){state.readFocus=index;state.readStage='focus';state.readAt=t-.45}
  }
  const v=sayPrior(name,words,choices,...rest),panel=$('dialogue');
  const consult=(room==='tarot'&&name===tr('Fortune Teller','占卜师'))||(room==='destiny'&&name===tr('Master Yue','月师傅'));
  panel.toggleAttribute('data-paw-desk-dialogue',consult);
  panel.removeAttribute('data-paw-keepsake');
  if(consult)$('talkPortrait').hidden=true;
  return v
 };
 closeTalk=function(...args){
  $('dialogue').removeAttribute('data-paw-desk-dialogue');$('dialogue').removeAttribute('data-paw-keepsake');
  return closePrior.apply(this,args)
 };
 const choicePrior=pawOpenCardChoice;
 pawOpenCardChoice=function(...args){
  const result=choicePrior(...args);
  if(result&&room==='tarot'){
   const n=activity==='tarot'?1:state.readSpreadSize===5?5:3;
   hint(n===1?'Choose a card, or shuffle again.':'Choose '+n+' cards, or shuffle again before choosing.',n===1?'选一张有感觉的牌，也可以重新洗牌。':'选 '+n+' 张牌，也可以先重新洗牌。')
  }
  return result
 };
 const actionPrior=action;
 action=function(id,...args){
  if(room!=='tarot'||activity||id!=='tarot')return actionPrior.call(this,id,...args);
  closeTalk();
  const pickTopic=()=>{
   closeTalk();start('love');const run=state;
   if(activity!=='love'||run.readStage!=='topic')return;
   say(tr('Fortune Teller','占卜师'),tr('What is on your mind? You can keep the details to yourself.','今天想问些什么？细节可以留在心里。'),[
    ...readingTopics.map((topic,i)=>[tr(...topic),()=>{if(state===run&&activity==='love')readingTopic(i)}]),
    [tr('Back to the table','回到牌桌'),()=>{if(state===run){closeTalk();$('back').click()}}]
   ])
  };
  say(tr('Fortune Teller','占卜师'),tr('Come, sit with me. Is there something you would like to ask, or just a little guidance for today?','来，坐吧。心里有什么想问的，还是想看看今天的指引？'),[
   [tr('Daily guidance · 1 card','今日指引 · 一张牌'),()=>{closeTalk();start('tarot')}],
   [tr('Find some clarity · 3 cards','三牌解惑 · 三张牌'),pickTopic],
   [tr('Just visiting','只是来坐坐'),closeTalk]
  ])
 };
 function yueAfterReading(words){
  if(room!=='destiny')return;
  $('page').style.display='none';
  say(tr('Master Yue','月师傅'),words||tr('Is there anything else you would like to look at?','还想看看别的吗？'),[
   [tr('My year ahead','生肖流年'),()=>pawYueDeskChoose('year')],
   [tr('My birth chart','生辰命盘'),()=>pawYueDeskChoose('chart')],
   [tr('Weekly star signs','本周星座'),()=>pawYueDeskChoose('stars')],
   [tr('Finish for now','今天先到这里'),()=>{closeTalk();hint('Take your time. Explore the room or head back to the valley.','慢慢来，可以继续逛逛，也可以返回福运谷。')}]
  ])
 }
 function yueResultNavigation(q,kind){
  if(room!=='destiny')return;
  const pane=$('page'),nav=element('nav','',q,'pawYueResultNav');
  nav.setAttribute('aria-label',tr('Reading navigation','问事导航'));q.prepend(nav);
  b(nav,tr('Ask Yue again','再问月师傅'),()=>yueAfterReading());
  b(nav,tr('Return to room','回到小屋'),()=>{pane.style.display='none';closeTalk();hint('Explore the room or head back to the valley.','继续逛逛，或返回福运谷。')});
  if(kind==='stars'){
   const grid=q.querySelector('.signNotebookGrid'),out=q.querySelector('.signNotebookResult');
   if(grid&&out)grid.addEventListener('click',e=>{
    if(!e.target.closest('button')||room!=='destiny'||!out.isConnected||!out.children.length)return;
    const words=[out.querySelector('h2')?.textContent,out.querySelector('small')?.textContent,out.querySelector('p')?.textContent].filter(Boolean).join('\n\n');
    pane.style.display='none';
    say(tr('Master Yue','月师傅'),words,[
     [tr('What else can we explore?','还能看看什么？'),()=>yueAfterReading()],
     [tr('Choose another sign','看看其他星座'),()=>{closeTalk();if(out.isConnected)pane.style.display='block'}],
     [tr('Finish for now','今天先到这里'),()=>{closeTalk();hint('Explore the room or head back to the valley.','继续逛逛，或返回福运谷。')}]
    ])
   })
  }
  // The original save handler owns the collectible. Offer next steps only
  // after it has actually disabled its successful collection button.
  q.addEventListener('click',e=>{
   const btn=e.target.closest('.destinySave');
   if(btn&&btn.disabled&&room==='destiny')yueAfterReading(tr('Your scroll is safely tucked away. Shall we explore something else?','卷轴已经收好啦。还想看看别的吗？'))
  });
 }
 // Keep the chart and its validation engine in place. Mirror one original
 // editable field per spoken question; all changes reach its real handlers.
 const deskPrior=pawYueDeskPresent;
 pawYueDeskPresent=function(kind){
  const result=deskPrior(kind);
  if(room!=='destiny')return result;
  const q=$('content');yueResultNavigation(q,kind);
  if(!['year','chart'].includes(kind))return result;
  const pane=$('page'),form=q.querySelector(kind==='year'?'.yueAlmanacForm':'.astroForm'),out=q.querySelector(kind==='year'?'.yueAlmanacPaper':'.astroResult');
  if(!form||form.hidden||out?.children.length||!form.classList.contains('pawYueGuidedForm'))return result;
  const fields=pawConsultInputPlan(form,kind);if(!fields.length)return result;
  const origin={room,form,subject:yueSubject};
  const valid=()=>form.isConnected&&pawConsultCurrent(origin,{room,form:$('content').querySelector(kind==='year'?'.yueAlmanacForm':'.astroForm'),subject:yueSubject});
  const prompts=kind==='year'?[['When were you born? Your birth date stays in this tab.','先告诉我出生日期。资料只留在本次页面。'],['Which year shall we look at?','想看看哪一年的流年？']]:[
   ['When were you born? Your details stay in this tab.','先告诉我出生日期。资料只留在本次页面。'],
   ['What was the local time when you were born?','你出生时，当地是几点？'],
   ['Where were you born?','你在哪里出生的？'],
   ['What was the UTC offset at the time? Check daylight saving if applicable.','出生当时的时区差是多少？如适用，请核对夏令时。'],
   ['What is the latitude of your birthplace?','出生地点的纬度是多少？'],
   ['And its longitude?','出生地点的经度呢？']
  ];
  function show(i,error=''){
   if(!valid())return;
   pane.style.display='none';const field=fields[i];let input;
   const sync=()=>{
    if(!input||!input.checkValidity()){input?.reportValidity();return false}
    if(field.value!==input.value){field.value=input.value;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}))}
    return field.checkValidity()
   };
   const next=()=>{
    if(!valid()||!sync())return;
    if(kind==='chart'&&i===2&&pawConsultPresetReady(field.value,fields.slice(3))){
     const city=field.selectedOptions[0]?.textContent||field.value;
     say(tr('Master Yue','月师傅'),tr('I have filled in the location details for '+city+'. Are these the usual local settings for your birth date?','已按'+city+'填好地点资料。出生当时用的是当地通常的时区吗？'),[
      [tr('Yes, use these details','是的，使用这些资料'),submitReading],
      [tr('Adjust birth details','核对或修改地点资料'),()=>show(3)],
      [tr('Choose another birthplace','重新选择出生地'),()=>show(2)]
     ]);return
    }
    if(i<fields.length-1){show(i+1);return}
    submitReading()
   };
   function submitReading(){
    if(!valid())return;
    closeTalk();pane.style.display='block';
    form.requestSubmit();
    if(!out?.querySelector('.ziGrid,.yueReadingFront')){
     const invalid=fields.findIndex(f=>!f.checkValidity());
     show(invalid>=0?invalid:i,tr('Please check these details.','请核对资料。'))
    }else{pane.scrollTop=0}
   }
   const choices=[[i===fields.length-1?tr('Ask Yue','请月师傅指点'):tr('Continue','继续'),next]];
   if(i>0)choices.push([tr('Previous','上一步'),()=>show(i-1)]);
   choices.push([tr('Back to Yue','返回问事'),()=>{if(valid())yueReadingHub()}]);
   say(tr('Master Yue','月师傅'),tr(...prompts[i])+(i===0&&origin.subject==='other'?'\n'+tr('Please use their details only with permission.','请先征得对方同意。'):'')+(error?'\n'+error:''),choices);
   const label=element('label','',$('choices'),'pawDeskField');input=field.cloneNode(true);
   input.removeAttribute('id');input.removeAttribute('name');input.removeAttribute('form');input.disabled=false;input.value=field.value;
   input.setAttribute('aria-label',tr(...prompts[i]));label.append(input);$('choices').prepend(label);
   input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();next()}});
  }
  show(0);return result
 };
 // Live tarot keepsake: use the same validated public data and PNG renderer
 // without entering the generic share page. Archive sharing stays unchanged.
 const sharePrior=openMeowShare;
 openMeowShare=function(raw,back=null){
  if(room!=='tarot'||!['tarot','love'].includes(activity)||raw?.kind!=='tarot'||$('page').style.display==='block')return sharePrior(raw,back);
  const data=sharePublicData(raw),run=state,kind=activity;
  if(!data?.cards?.length)return;
  let format=zh?'xhs':'feed',cn=zh,ready=null,version=0;
  const current=()=>room==='tarot'&&activity===kind&&state===run&&talkOpen&&panel.isConnected&&panel.closest('#dialogue')&&$('dialogue').hasAttribute('data-paw-keepsake');
  const returnTo=()=>{closeTalk();if(back)back()};
  say(tr('Fortune Teller','占卜师'),tr('A little keepsake from our reading.','把这次的牌意留作小小纪念。'),[[tr('Back to the table','回到牌桌'),returnTo]]);
  $('dialogue').setAttribute('data-paw-keepsake','');
  const panel=element('section','',$('choices'),'pawTarotKeepsake'),preview=element('canvas','',panel,'meowSharePreview');
  preview.setAttribute('role','img');
  const status=element('p','',panel,'meowShareStatus');status.setAttribute('role','status');
  const tabs=element('div','',panel,'meowShareTabs'),langs=element('div','',panel,'meowShareTabs');
  const actions=element('div','',panel,'pawKeepsakeActions');
  const saveButton=b(actions,tr('Save PNG image','保存 PNG 图片'),()=>{
   if(!ready||!current())return;
   const url=URL.createObjectURL(ready),a=document.createElement('a');a.href=url;a.download='pawradise-tarot-'+format+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)
  });
  const send=b(actions,tr('Share image','分享图片'),async()=>{
   if(!ready||!current())return;
   try{if(typeof File==='function'&&navigator.share&&navigator.canShare?.({files:[ready]})){await navigator.share({files:[ready],title:'Pawradise'});return}}catch(e){if(e?.name==='AbortError')return}
   if(current())status.textContent=tr('Save the image to share it in your app.','先保存图片，再到想分享的应用。')
  });
  const keys=Object.keys(shareFormats),formatButtons=keys.map(k=>b(tabs,k==='feed'?'IG / FB':k==='xhs'?'小红书':k==='story'?'Story / TikTok':tr('WeChat','微信'),()=>{format=k;render()}));
  const languages=[b(langs,'English',()=>{cn=false;render()}),b(langs,'中文',()=>{cn=true;render()})];
  async function render(){
   const token=++version;ready=null;saveButton.disabled=send.disabled=true;
   formatButtons.forEach((x,i)=>x.setAttribute('aria-pressed',String(keys[i]===format)));languages.forEach((x,i)=>x.setAttribute('aria-pressed',String(i===Number(cn))));
   status.textContent=tr('Preparing your keepsake…','正在准备纪念卡……');
   try{
    await pawPrepareRecoveredShare(format,data);if(!current()||token!==version)return;
    shareCardArt(preview,data,format,cn);preview.setAttribute('aria-label',data.title[Number(cn)]);
    preview.toBlob(blob=>{if(!current()||token!==version)return;if(!blob){status.textContent=tr('Try another format.','请换个尺寸重试。');return}ready=typeof File==='function'?new File([blob],'pawradise-tarot-'+format+'.png',{type:'image/png'}):blob;saveButton.disabled=send.disabled=false;status.textContent=tr('Ready to share or save.','可以分享或保存啦。')},'image/png')
   }catch{if(current()&&token===version)status.textContent=tr('Try another format.','请换个尺寸重试。')}
  }
  $('choices').prepend(panel);render()
 };
 const css=document.createElement('style');
 css.textContent=`
 #game #dialogue[data-paw-desk-dialogue]{bottom:max(12px,env(safe-area-inset-bottom,0px))!important;border-radius:3px!important;box-shadow:0 -2px 8px #2b251e30!important;width:min(calc(100% - 24px),570px)!important;max-height:48dvh!important}
 #game #dialogue[data-paw-desk-dialogue] #speaker{font:600 15px Georgia,"Songti SC",serif!important;color:#5b6550!important}
 #game #dialogue[data-paw-desk-dialogue] #choices{grid-template-columns:repeat(auto-fit,minmax(min(100%,125px),1fr))!important}
 #game #dialogue[data-paw-desk-dialogue] #choices button{font:500 14px/1.25 Georgia,"Songti SC",serif!important;text-align:start!important;border:0!important;border-bottom:1px solid #b6a17e70!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;min-height:44px!important}
 #game #dialogue .pawDeskField{grid-column:1/-1;display:block;min-width:0}
 #game #dialogue .pawDeskField :is(input,select){box-sizing:border-box;display:block;width:100%;min-height:44px;font-size:16px;background:#fff6e1;color:#493e31;border:1px solid #b3a17e;border-radius:3px;padding:7px}
 #game #page[data-paw-yue-desk] .pawYueResultNav{position:sticky;top:0;z-index:8;display:flex;justify-content:space-between;gap:6px;padding:5px;background:#f0e4ce;border-bottom:1px solid #b6a17e}
 #game #page[data-paw-yue-desk] .pawYueResultNav button{min-height:44px;flex:1;min-width:0;white-space:normal;background:transparent!important;border:0!important;border-bottom:1px solid #b6a17e70!important;border-radius:0!important;box-shadow:none!important;color:#405440!important}
 #game #dialogue[data-paw-desk-dialogue] #choices button:focus-visible,#game #page[data-paw-yue-desk] .pawYueResultNav button:focus-visible{outline:2px solid #39594d!important;outline-offset:-2px}
 @media(forced-colors:active){#game #dialogue[data-paw-desk-dialogue] #choices button,#game #page[data-paw-yue-desk] .pawYueResultNav button{color:ButtonText!important;border-bottom:1px solid ButtonText!important}}
 #game #dialogue[data-paw-keepsake]{max-height:78dvh!important}
 #game #dialogue[data-paw-keepsake] .pawTarotKeepsake{grid-column:1/-1;display:grid;gap:5px;min-width:0}
 #game #dialogue[data-paw-keepsake] .meowSharePreview{max-height:35dvh;width:auto;max-width:100%;margin:auto}
 #game #dialogue[data-paw-keepsake] .meowShareTabs,#game #dialogue[data-paw-keepsake] .pawKeepsakeActions{display:flex;gap:4px;flex-wrap:wrap}
 #game #dialogue[data-paw-keepsake] .meowShareTabs button,#game #dialogue[data-paw-keepsake] .pawKeepsakeActions button{flex:1;min-width:60px}
 #game #dialogue[data-paw-keepsake] .meowShareTabs button[aria-pressed=true]{background:#536955!important;color:#fff2d8!important}
 @media(orientation:landscape) and (max-height:550px){#game #dialogue[data-paw-keepsake] .meowSharePreview{max-height:26dvh}}
 `;document.head.append(css)
}
if(typeof document!=='undefined')queueMicrotask(pawInstallNativeConsultation);


/* PAW_TAROT_HOST_CONTINUITY_BEGIN */
function pawTarotConsultationPlate(b,iw,ih){
 if(!b||![b.x,b.y,b.w,b.h,iw,ih].every(Number.isFinite)||Math.min(b.w,b.h,iw,ih)<=0)return null;
 // Use the same physical framing as the lobby. Covering a wide screen
 // with a portrait painting enlarges the host independently of the room.
 if(b.w<b.h){
  const q=pawTarotLobbyFrame(b.w,b.h,{x:0,y:0,w:iw,h:ih});
  return q?{x:b.x+q.ox,y:b.y+q.oy,w:iw*q.s,h:ih*q.s}:null
 }
 const s=Math.min(b.w/iw,b.h/ih),w=iw*s,h=ih*s;
 return {x:b.x+(b.w-w)/2,y:b.y+(b.h-h)/2,w,h}
}
/* PAW_TAROT_HOST_CONTINUITY_END */
function pawInstallTarotHostContinuity(){
 const prior=paintLivingBackdrop;
 paintLivingBackdrop=function(...args){
  if(room==='tarot'&&pawReadingVisit==='tarot'&&['tarot','love'].includes(activity)){
   const im=pawReadingImage(pawReadingAPI(),'tarot');
   if(pawRoomImageReady(im)){
    const b=livingBounds(),plate=pawTarotConsultationPlate(b,im.naturalWidth,im.naturalHeight);
    if(plate){
     ctx.save();try{
      ctx.fillStyle='#42433c';ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.beginPath();ctx.rect(b.x,b.y,b.w,b.h);ctx.clip();
      ctx.drawImage(im,plate.x,plate.y,plate.w,plate.h);
      pawSceneAirLive('tarot',plate,im);
      pawDrawReadingSeated('tarot',plate);
     }finally{ctx.restore()}
     return
    }
   }
  }
  return prior.apply(this,args)
 }
}
if(typeof document!=='undefined')queueMicrotask(pawInstallTarotHostContinuity);
