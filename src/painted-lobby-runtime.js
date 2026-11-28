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
// Match the actual revealed card; a summary is not a card presentation.
// The position prefix disambiguates repeated card labels in a multi-card spread.
function pawConsultReadingFocus(q,words,labels,cardLine,now){
 if(!q||!['cards','focus'].includes(q.readStage)||typeof words!=='string'||!Array.isArray(labels)||!Array.isArray(q.readCards)||![1,3,5].includes(q.readCards.length)||!Array.isArray(q.readFlip)||q.readCards.length!==q.readFlip.length||!Number.isFinite(now))return null;
 if(labels.includes('summary')&&q.readFlip.every(v=>Number.isFinite(v)&&v>=0&&now-v>=.72))return -1;
 if(!labels.includes('card'))return null;
 const lines=words.split('\n'),matches=q.readCards.map((c,i)=>({i,line:cardLine(c),flip:q.readFlip[i]})).filter(v=>v.line&&lines.includes(v.line)&&Number.isFinite(v.flip)&&v.flip>=0&&now-v.flip>=.72);
 if(matches.length===1)return matches[0].i;
 const position=lines[0]?.match(/(?:^|\s)([1-5])\/([135])$/);
 if(position&&Number(position[2])===q.readCards.length){
  const i=Number(position[1])-1;if(matches.some(v=>v.i===i))return i
 }
 return null
}
// Destinations are suggestions for a PNG, not promises of direct posting.
function pawKeepsakeFormatGuide(format,cn,formats){
 const map={feed:['Instagram / Facebook feed · 4:5','Instagram / Facebook 动态 · 4:5'],xhs:['Xiaohongshu · 3:4','小红书 · 3:4'],story:['Instagram Stories / TikTok · 9:16','Instagram 限时动态 / TikTok · 9:16'],square:['WeChat / square posts · 1:1','微信 / 方形动态 · 1:1']};
 const dims=Object.hasOwn(map,format)&&formats?.[format];
 if(!Array.isArray(dims)||dims.length!==2||!dims.every(v=>Number.isInteger(v)&&v>0))return '';
 return map[format][Number(!!cn)]+' · '+dims.join(' × ')+' px'
}
function pawKeepsakeShareMode(nav,file){
 if(!file||typeof nav?.share!=='function'||typeof nav?.canShare!=='function')return false;
 try{return nav.canShare({files:[file]})===true}catch{return false}
}
// Route only completed, live in-room results. Deliberate archive shares
// keep their existing interface. Never return to a different visit.
function pawKeepsakeCaption(data,format,cn,url){
 const title=String(data?.title?.[Number(!!cn)]||'').trim();
 if(!title)return '';
 const rows=[(cn?'我在 Pawradise 的小记：':'My Pawradise keepsake: ')+title,cn?'给自己留一点时间。':'A little time for myself.',cn?'#Pawradise #摸鱼小镇':'#Pawradise #CozyGames'];
 if((format==='feed'||format==='square')&&typeof url==='string'&&url.startsWith('https://'))rows.push(url);
 return rows.join('\n')
}
function pawKeepsakeRoomRoute(v,resultKind,hasBack){
 if(!v||v.page)return null;
 if(v.room==='tarot'&&['tarot','love'].includes(v.activity)&&resultKind==='tarot'&&hasBack)return {id:'tarot',speaker:['Fortune Teller','占卜师'],back:['Back to reading','返回解读']};
 if(v.scene!=='wonder'||v.phase!=='result')return null;
 if(v.activity==='match'&&v.room==='match'&&resultKind==='cafe')return {id:'cafe',speaker:['Heart Café','心语咖啡馆'],back:['Back to reflection','返回心得']};
 if(v.activity==='story'&&v.room==='story'&&resultKind==='story')return {id:'story',speaker:['House of What If','如果人生馆'],back:['Back to the story','返回故事']};
 if(v.activity==='wonderScene'&&['quiz','curiosity','observatory'].includes(v.room)&&resultKind===v.mode&&hasBack&&v.result)return {id:'notebook',speaker:v.room==='curiosity'?['Curiosity Club','奇想俱乐部']:['Inner Observatory','心灵观星台'],back:['Back to the notebook','返回小记']};
 return null
}
function pawKeepsakeVisitOwns(origin,live){
 return !!origin&&!!live&&['room','activity','scene','phase','run','token','mode','result'].every(k=>origin[k]===live[k])&&!live.page
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
  if(room==='tarot'&&['tarot','love'].includes(activity)&&name===tr('Fortune Teller','占卜师')){
   const labels=choices.map(c=>c[0]===tr('Back to the table','回到牌桌')?'card':c[0]===tr('Finish reading · return to table','结束解读，回到牌桌')?'summary':'');
   const index=pawConsultReadingFocus(state,words,labels,c=>{const d=tarotDeck[c?.i];return d&&tr(d[0],d[1])+' · '+orient(c.rev)},t);
   if(index===-1){state.readStage='cards';state.readFocus=-1;state.readAt=t}
   else if(index!==null){state.readFocus=index;state.readStage='focus';state.readAt=t-.45}
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
  const visit=()=>{
   const base={room,activity,run:state,page:$('page').style.display==='block'};
   if(activity==='match')return {...base,scene,phase:cafePhase,token:cafeToken,result:cafeResult};
   if(activity==='story')return {...base,scene,phase:parallelEndings[parallelNode]&&!parallelTurning?'result':null,token:parallelToken,result:parallelNode};
   if(activity==='wonderScene')return {...base,scene,phase:wonderScenePhase,token:wonderSceneToken,mode:wonderSceneMode,result:wonderSceneResult};
   return base
  };
  const origin=visit(),route=pawKeepsakeRoomRoute(origin,raw?.kind,typeof back==='function');
  if(!route)return sharePrior(raw,back);
  const data=sharePublicData(raw);
  if(!data||data.kind!==raw.kind||route.id==='tarot'&&!data.cards?.length)return;
  let format=zh?'xhs':'feed',cn=zh,ready=null,version=0;
  const current=()=>pawKeepsakeVisitOwns(origin,visit())&&talkOpen&&panel.isConnected&&panel.closest('#dialogue')&&$('dialogue').hasAttribute('data-paw-keepsake');
  const returnTo=()=>{if(!current())return;closeTalk();if(back)back();else if(route.id==='cafe')syncCafeQuestionSheet();else if(route.id==='story')syncStorySheet()};
  say(tr(...route.speaker),tr('Choose a keepsake format. Only the result in the preview is shared.','选一个纪念卡尺寸。分享时只会包含预览中的结果。'),[[tr(...route.back),returnTo]]);
  $('dialogue').setAttribute('data-paw-keepsake','');
  const panel=element('section','',$('choices'),'pawTarotKeepsake'),preview=element('canvas','',panel,'meowSharePreview');
  preview.setAttribute('role','img');preview.hidden=true;
  const status=element('p','',panel,'meowShareStatus');status.setAttribute('role','status');
  const tabs=element('div','',panel,'meowShareTabs'),langs=element('div','',panel,'meowShareTabs');
  const guide=element('p','',panel,'pawKeepsakeGuide');
  const how=element('p','',panel,'pawKeepsakeGuide');
  const actions=element('div','',panel,'pawKeepsakeActions');
  tabs.setAttribute('role','group');tabs.setAttribute('aria-label',tr('Image format','图片尺寸'));
  langs.setAttribute('role','group');langs.setAttribute('aria-label',tr('Image language','图片语言'));
  const saveButton=b(actions,tr('Save PNG image','保存 PNG 图片'),()=>{
   if(!ready||!current())return;
   const url=URL.createObjectURL(ready),a=document.createElement('a');a.href=url;a.download='pawradise-'+data.kind+'-'+format+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)
  });
  const send=b(actions,tr('Share image','分享图片'),async()=>{
   if(!ready||!current())return;
   const token=version,file=ready;
   try{if(pawKeepsakeShareMode(navigator,file)){await navigator.share({files:[file],title:'Pawradise'});return}}catch(e){if(e?.name==='AbortError')return}
   if(current()&&token===version)status.textContent=tr('Save the PNG, then upload it in your chosen app.','请保存 PNG 图片，再到想分享的应用上传。')
  });
  const copy=b(actions,tr('Copy caption','复制文案'),async()=>{
   if(!ready||!current())return;
   const token=version,text=pawKeepsakeCaption(data,format,cn,meowShareUrl);
   if(!text)return;
   try{
    if(typeof navigator.clipboard?.writeText!=='function')throw Error('clipboard unavailable');
    await navigator.clipboard.writeText(text);
    if(current()&&token===version)status.textContent=tr('Caption copied.','文案已复制。');
   }catch{
    if(!current()||token!==version)return;
    manualCaption.value=text;manualCaption.hidden=false;manualCaption.focus?.();manualCaption.select?.();
    status.textContent=tr('Select and copy the caption below.','请选择并复制下方文案。');
   }
  });
  const manualCaption=element('textarea','',panel,'pawKeepsakeCaption');manualCaption.hidden=true;manualCaption.readOnly=true;
  manualCaption.setAttribute('aria-label',tr('Post caption','发布文案'));
  const keys=Object.keys(shareFormats),formatButtons=keys.map(k=>b(tabs,k==='feed'?'IG / FB':k==='xhs'?'小红书':k==='story'?'Story / TikTok':tr('WeChat','微信'),()=>{format=k;render()}));
  const languages=[b(langs,'English',()=>{cn=false;render()}),b(langs,'中文',()=>{cn=true;render()})];
  async function render(){
   const token=++version,selectedFormat=format,selectedLanguage=cn;ready=null;preview.hidden=true;panel.setAttribute('aria-busy','true');saveButton.disabled=send.disabled=copy.disabled=true;manualCaption.hidden=true;manualCaption.value='';
   formatButtons.forEach((x,i)=>x.setAttribute('aria-pressed',String(keys[i]===format)));languages.forEach((x,i)=>x.setAttribute('aria-pressed',String(i===Number(cn))));
   guide.textContent=pawKeepsakeFormatGuide(selectedFormat,zh,shareFormats);
   how.textContent=tr('Save the PNG, then add it to your post. If your device supports it, Share image opens the system share menu.','保存 PNG 后可在对应平台发布。如果设备支持，点击「分享图片」会打开系统分享菜单。');
   status.textContent=tr('Preparing your keepsake…','正在准备纪念卡……');
   try{
    await pawPrepareRecoveredShare(selectedFormat,data);if(!current()||token!==version)return;
    shareCardArt(preview,data,selectedFormat,selectedLanguage);preview.setAttribute('aria-label',data.title[Number(selectedLanguage)]);
    preview.toBlob(blob=>{if(!current()||token!==version)return;panel.setAttribute('aria-busy','false');if(!blob){status.textContent=tr('Try another format.','请换个尺寸重试。');return}ready=typeof File==='function'?new File([blob],'pawradise-'+data.kind+'-'+selectedFormat+'.png',{type:'image/png'}):blob;preview.hidden=false;saveButton.disabled=send.disabled=copy.disabled=false;status.textContent=tr('Ready to share or save.','可以分享或保存啦。')},'image/png')
   }catch{if(current()&&token===version){panel.setAttribute('aria-busy','false');status.textContent=tr('Try another format.','请换个尺寸重试。')}}
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
 #game #dialogue[data-paw-keepsake]{max-height:min(82dvh,calc(100dvh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 24px))!important;overflow-y:auto!important;overflow-x:hidden!important}
 #game #dialogue[data-paw-keepsake] #choices{grid-template-columns:minmax(0,1fr)!important}
 #game #dialogue[data-paw-keepsake] #choices>button{width:100%;text-align:center!important}
 #game #dialogue[data-paw-keepsake] :is(.meowShareStatus,.pawKeepsakeGuide){margin:0;font-size:13px;line-height:1.35;overflow-wrap:anywhere}
 #game #dialogue[data-paw-keepsake] .pawKeepsakeGuide{color:#5b5143}
 #game #dialogue[data-paw-keepsake] .pawTarotKeepsake{grid-column:1/-1;display:grid;gap:5px;min-width:0}
 #game #dialogue[data-paw-keepsake] .meowSharePreview{max-height:35dvh;width:auto;height:auto;max-width:100%;margin:auto;object-fit:contain}
 #game #dialogue[data-paw-keepsake] .meowSharePreview[hidden]{display:none!important}
 #game #dialogue[data-paw-keepsake] .meowShareTabs,#game #dialogue[data-paw-keepsake] .pawKeepsakeActions{display:flex;gap:4px;flex-wrap:wrap}
 #game #dialogue[data-paw-keepsake] .meowShareTabs button,#game #dialogue[data-paw-keepsake] .pawKeepsakeActions button{flex:1 1 110px;min-width:0;white-space:normal;overflow-wrap:anywhere;text-align:center!important}
 @media(min-width:900px) and (min-aspect-ratio:5/4){#game #dialogue[data-paw-keepsake]{left:auto!important;right:max(16px,env(safe-area-inset-right,0px))!important;transform:none!important;width:min(39vw,460px)!important;bottom:max(16px,env(safe-area-inset-bottom,0px))!important}#game #dialogue[data-paw-keepsake] .meowSharePreview{max-height:44dvh}}
 #game #dialogue[data-paw-keepsake] .pawKeepsakeCaption{width:100%;min-height:92px;box-sizing:border-box;resize:vertical;font:14px/1.4 Georgia,"Songti SC",serif;color:#463b35;background:#f6eddd;border:1px solid #b6a17e;padding:8px}\n #game #dialogue[data-paw-keepsake] .pawKeepsakeCaption[hidden]{display:none!important}\n #game #dialogue[data-paw-keepsake] .meowShareTabs button[aria-pressed=true]{background:#536955!important;color:#fff2d8!important}
 @media(orientation:landscape) and (max-height:550px){#game #dialogue[data-paw-keepsake] .meowSharePreview{max-height:26dvh}}
 `;document.head.append(css)
}
if(typeof document!=='undefined')queueMicrotask(pawInstallNativeConsultation);


/* PAW_TAROT_HOST_CONTINUITY_BEGIN */
function pawTarotConsultationPlate(b,iw,ih,screenScale=1){
 if(!b||![b.x,b.y,b.w,b.h,iw,ih].every(Number.isFinite)||Math.min(b.w,b.h,iw,ih)<=0||!Number.isFinite(screenScale)||screenScale<=0)return null;
 // Use the same physical framing as the lobby. Covering a wide screen
 // with a portrait painting enlarges the host independently of the room.
 if(b.w<b.h){
  const q=pawTarotLobbyFrame(b.w,b.h,{x:0,y:0,w:iw,h:ih});
  return q?{x:b.x+q.ox,y:b.y+q.oy,w:iw*q.s,h:ih*q.s}:null
 }
 const wide=pawReadingWideFrame(b.w*screenScale,b.h*screenScale,{x:0,y:0,w:iw,h:ih});
 if(wide)return {x:b.x+wide.ox/screenScale,y:b.y+wide.oy/screenScale,w:iw*wide.s/screenScale,h:ih*wide.s/screenScale};
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
    const b=livingBounds(),plate=pawTarotConsultationPlate(b,im.naturalWidth,im.naturalHeight,W/b.w);
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

/* PAW_EDITORIAL_SHARE_BEGIN */
// Share art is a souvenir, not the detailed in-game reading. Keep every
// actual card identity, but give the illustration and one takeaway room.
// Use the original paper's quiet interior texture, not its travel-specific
// decorative border on every result. Preserve social overlay safe margins.
function pawEditorialCanvasBox(box){
 if(!box)return null;
 const story=box.height>=1800,margin=story?84:68;
 return {...box,left:margin,right:story?142:margin,top:story?216:86,bottom:box.height-(story?300:86)}
}
function pawEditorialBackdrop(g,paper,box,surface){
 const w=box.width,h=box.height;
 g.drawImage(paper,Math.round(w*.12),Math.round(h*.27),Math.round(w*.76),Math.round(h*.44),0,0,w,h);
 g.globalAlpha=.79;g.fillStyle=surface;g.fillRect(0,0,w,h);g.globalAlpha=1
}
function pawEditorialScoreRatio(value){
 const match=/^\s*(\d+)\s*([/:])\s*(\d+)\s*$/.exec(String(value||''));
 if(!match)return null;
 const a=Number(match[1]),b=Number(match[3]),total=match[2]===':'?a+b:b;
 return total>0&&a<=total?{ratio:a/total,split:match[2]===':'}:null
}
function pawEditorialTarotPlan(box,count){
 if(!box||![1,3,5].includes(count)||![box.width,box.height,box.left,box.right,box.top,box.bottom].every(Number.isFinite))return null;
 const x=box.left+12,w=box.width-box.left-box.right-24,H=box.bottom-box.top;
 if(w<640||H<600)return null;
 const top=box.top,story=box.height>=1800,rows=story&&count===5?[3,2]:[count];
 const header=H>=900?148:116,footer=56,summary=Math.max(150,Math.min(224,H*.22)),gap=24;
 const area=H-header-footer-summary-gap*3,perRow=(area-(rows.length-1)*gap)/rows.length;
 const caption=126,slots=[];let y=top+header+gap;
 for(const n of rows){
  const cellW=(w-(n-1)*gap)/n,cardH=Math.min(perRow-caption-8,(cellW-12)*218/128, count===1?(story?660:590):(story?540:475)),cardW=cardH*128/218;
  if(cardH<100)return null;
  const groupW=n*cellW+(n-1)*gap;
  for(let i=0;i<n;i++){
   const cx=x+(w-groupW)/2+i*(cellW+gap)+cellW/2;
   const lift=Math.max(0,(perRow-cardH-caption-8)/2);
   slots.push({card:[cx-cardW/2,y+lift,cardW,cardH],label:[cx-cellW/2,y+lift+cardH+8,cellW,caption]})
  }
  y+=perRow+gap
 }
 const readingY=box.bottom-footer-summary-gap;
 return {title:[x,top,w,header],slots,reading:[x,readingY,w,summary],footer:[x,box.bottom-footer,w,footer]}
}
// Measured wrap with a real minimum type size, never distort glyphs vertically.
function pawEditorialTextFit(measure,text,width,height,start,min,maxLines,spacing=1.25){
 const chars=Array.from(String(text||'').trim());if(!chars.length)return {size:start,rows:[],lineHeight:start*spacing};
 function wrap(size){
  const lines=[];let row='';const parts=/[\u3400-\u9fff]/.test(chars.join(''))?chars:chars.join('').split(/\s+/);
  const sep=parts===chars?'':' ';
  for(const word of parts){
   let next=row?row+sep+word:word;
   if(measure(next,size)<=width){row=next;continue}
   if(row){lines.push(row);row=''}
   for(const ch of Array.from(word)){if(row&&measure(row+ch,size)>width){lines.push(row);row=''}row+=ch}
  }
  if(row)lines.push(row);return lines
 }
 for(let size=start;size>=min;size--){
  const rows=wrap(size),lineHeight=size*spacing,cap=Math.min(maxLines,Math.floor(height/lineHeight));
  if(rows.length<=cap)return {size,rows,lineHeight};
  if(size===min){
   const shown=rows.slice(0,Math.max(0,cap));
   if(shown.length){let tail=Array.from(shown.at(-1));while(tail.length&&measure(tail.join('')+'…',size)>width)tail.pop();shown[shown.length-1]=tail.join('')+'…'}
   return {size,rows:shown,lineHeight}
  }
 }
 return {size:min,rows:[],lineHeight:min*spacing}
}
function pawEditorialTarot(cv,data,format,cn,box,paper,atlas,deck,positions){
 if(data?.kind!=='tarot'||!Array.isArray(data.cards)||!data.cards.every(c=>Number.isInteger(c?.i)&&deck[c.i])||!paper?.complete||paper.naturalWidth!==box?.width||paper.naturalHeight!==box?.height||!atlas?.complete||atlas.naturalWidth!==1024||atlas.naturalHeight!==2180)return false;
 box=pawEditorialCanvasBox(box);
 const plan=pawEditorialTarotPlan(box,data.cards.length);if(!plan)return false;
 const locale=v=>String(v?.[Number(!!cn)]||''),font=cn?'"Songti SC","Noto Serif CJK SC","Microsoft YaHei",serif':'Georgia,serif';
 const ink='#443348',muted='#6e5367',gold='#9d7851';
 cv.width=box.width;cv.height=box.height;const g=cv.getContext('2d');if(!g)return false;
 pawEditorialBackdrop(g,paper,box,'#f0e5f0');
 function text(rect,value,start,min,maxLines,weight='normal',color=ink,spacing=1.23){
  const [x,y,w,h]=rect,measure=(v,size)=>{g.font=weight+' '+size+'px '+font;return g.measureText(v).width};
  const fit=pawEditorialTextFit(measure,value,w-8,h,start,min,maxLines,spacing);
  g.font=weight+' '+fit.size+'px '+font;g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;
  fit.rows.forEach((v,i)=>g.fillText(v,x+w/2,y+h/2+(i-(fit.rows.length-1)/2)*fit.lineHeight));
 }
 const [x,y,w,h]=plan.title;
 text([x,y,w,40],cn?'月光塔罗 · 摸鱼小镇':'MOONLIGHT TAROT  /  PAWRADISE',32,26,1,'normal',muted);
 text([x,y+42,w,h-42],locale(data.title),cn?60:68,42,2,'bold');
 data.cards.forEach((c,i)=>{
  const slot=plan.slots[i],[cx,cy,cw,ch]=slot.card,[lx,ly,lw,lh]=slot.label;
  g.save();try{
   g.shadowColor='#38233d45';g.shadowBlur=12;g.shadowOffsetY=5;g.fillStyle='#c4a27d';g.fillRect(cx-3,cy-3,cw+6,ch+6);
   g.shadowBlur=0;g.shadowOffsetY=0;g.translate(cx+cw/2,cy+ch/2);if(c.rev)g.rotate(Math.PI);
   g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(atlas,c.i%8*128,Math.floor(c.i/8)*218,128,218,-cw/2,-ch/2,cw,ch);
  }finally{g.restore()}
  const role=locale(positions[i]);
  text([lx,ly,lw,30],role,28,23,1,'normal',ink);
  text([lx,ly+30,lw,58],locale(deck[c.i]),data.cards.length===5?31:40,22,2,'bold');
  text([lx,ly+90,lw,36],c.rev?(cn?'逆位':'Reversed'):(cn?'正位':'Upright'),27,23,1,'normal',ink);
 });
 const [rx,ry,rw,rh]=plan.reading;
 g.strokeStyle='#bca17d';g.lineWidth=2;g.beginPath();g.moveTo(rx+rw*.38,ry);g.lineTo(rx+rw*.62,ry);g.stroke();
 text([rx+24,ry+12,rw-48,rh-12],locale(data.takeaway||socialResultQuote(data)),cn?42:44,32,4,'normal',ink,1.32);
 text(plan.footer,cn?'Pawradise · 给自己留一点时间 · 仅供反思':'Pawradise · A little time for yourself · For reflection',28,23,2,'normal',muted);
 return true
}

/* PAW_EDITORIAL_RESULTS_BEGIN */
// Shared export family: distinct palettes and real result structure, no
// generic boxed worksheet. All input is the existing sanitized public result.
const pawEditorialThemes=Object.freeze({
 soul:['#f8ecd9','#473c37','#a26452',['Cat charm','猫灵小记']],
 fortune:['#fff0d9','#594234','#a05b43',['Fortune Valley','福运谷']],
 cafe:['#f7e8d6','#4f3c35','#986449',['Heart Café','心动咖啡馆']],
 story:['#ede9ee','#403c56','#74617e',['Parallel life','平行人生']],
 type:['#eaf0e2','#354b3e','#607b65',['Personality portrait','四维性格探索']],
 motive:['#f3e9e2','#543e48','#946877',['Inner motives','九型动力探索']],
 bigfive:['#eaf0e2','#354b3e','#607b65',['Five tendencies','五大性格倾向']],
 care:['#faebe7','#543e48','#946877',['How I feel cared for','关心的方式']],
 priorities:['#eef0e4','#354b3e','#607b65',['What matters','重要的事']],
 values:['#faebe7','#543e48','#946877',['Relationship values','关系价值观']],
 attachment:['#f3e9e2','#543e48','#946877',['Relationship reflection','亲密关系小记']],
 zwds:['#f4ead5','#41483b','#747e58',['Master Yue','月师傅']],
 zwds_chart:['#f4ead5','#41483b','#747e58',['Master Yue','月师傅']]
});
function pawEditorialResultPlan(box,mode,count){
 if(!box||![box.width,box.height,box.left,box.right,box.top,box.bottom].every(Number.isFinite))return null;
 const x=box.left+18,w=box.width-box.left-box.right-36,H=box.bottom-box.top;
 if(w<640||H<600)return null;
 const top=box.top,head=H>=900?148:116,foot=56,gap=26;
 const title=[x,top,w,head],footer=[x,box.bottom-foot,w,foot],body=[x,top+head+gap,w,H-head-foot-gap*2];
 if(mode==='chart'){
  const chartW=Math.min(w,Math.max(body[3],w*.88)),chartH=Math.min(chartW,body[3]-12),cw=chartW/4,ch=chartH/4,ox=x+(w-chartW)/2,oy=body[1]+(body[3]-chartH)/2;
  const cells=[[0,0],[1,0],[2,0],[3,0],[0,1],[3,1],[0,2],[3,2],[0,3],[1,3],[2,3],[3,3]].map(([col,row])=>[ox+col*cw,oy+row*ch,cw,ch]);
  return {title,footer,body,cells,center:[ox+cw,oy+ch,2*cw,2*ch]}
 }
 if(mode==='scores'){
  if(!Number.isInteger(count)||count<1||count>9)return null;
  const cols=count>=7?2:1,rows=Math.ceil(count/cols),colW=(w-(cols-1)*34)/cols;
  const noteH=Math.min(150,Math.floor(body[3]*.19)),rowH=Math.min(184,(body[3]-noteH-24)/rows),oy=body[1]+Math.max(0,(body[3]-noteH-24-rowH*rows)/2);
  return {title,footer,body,note:[x,body[1]+body[3]-noteH,w,noteH],rows:Array.from({length:count},(_,i)=>[x+(i%cols)*(colW+34),oy+Math.floor(i/cols)*rowH,colW,rowH])}
 }
 const artH=Math.round(body[3]*(H>1000?.64:.55));
 return {title,footer,body,art:[x,body[1],w,artH],summary:[x,body[1]+artH+12,w,body[3]-artH-12]}
}
function pawEditorialOther(cv,data,format,cn,box,paper,art,quote){
 const theme=pawEditorialThemes[data?.kind];if(!theme||!box||!paper?.complete||paper.naturalWidth!==box.width||paper.naturalHeight!==box.height)return false;
 const chart=data.kind==='zwds_chart',scores=Array.isArray(data.scoreRows)&&data.scoreRows.length>0;
 if(chart&&(!Array.isArray(data.palaces)||data.palaces.length!==12||data.palaces.some(p=>!Array.isArray(p?.name)||!Array.isArray(p.stars))))return false;
 if(scores&&data.scoreRows.some(r=>!Array.isArray(r?.label)||!Array.isArray(r.value)))return false;
 box=pawEditorialCanvasBox(box);
 const mode=chart?'chart':scores?'scores':'illustrated',plan=pawEditorialResultPlan(box,mode,data.scoreRows?.length);if(!plan)return false;
 const [surface,ink,accent,category]=theme,locale=v=>String(v?.[Number(!!cn)]||''),font=cn?'"Songti SC","Noto Serif CJK SC","Microsoft YaHei",serif':'Georgia,serif';
 cv.width=box.width;cv.height=box.height;const g=cv.getContext('2d');if(!g)return false;
 pawEditorialBackdrop(g,paper,box,surface);
 function text(rect,value,start,min,maxLines,weight='normal',color=ink,align='center'){
  const [x,y,w,h]=rect,measure=(v,size)=>{g.font=weight+' '+size+'px '+font;return g.measureText(v).width};
  const fit=pawEditorialTextFit(measure,value,w-10,h,start,min,maxLines,1.23);
  g.font=weight+' '+fit.size+'px '+font;g.textAlign=align;g.textBaseline='middle';g.fillStyle=color;
  fit.rows.forEach((v,i)=>g.fillText(v,align==='left'?x+5:align==='right'?x+w-5:x+w/2,y+h/2+(i-(fit.rows.length-1)/2)*fit.lineHeight))
 }
 function rule(x,y,w){g.strokeStyle=accent;g.globalAlpha=.38;g.lineWidth=1.5;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();g.globalAlpha=1}
 const [x,y,w,h]=plan.title;
 text([x,y,w,40],locale(category)+'  ·  Pawradise',32,26,1,'normal',ink);
 text([x,y+42,w,h-42],locale(data.title),cn?60:68,42,2,'bold');
 if(chart){
  // The palace positions are meaningful. Retain the traditional chart
  // structure, but use fine ink rules instead of individual UI cards.
  plan.cells.forEach((rect,i)=>{
   const [a,b,c,d]=rect,p=data.palaces[i];
   g.strokeStyle=accent;g.lineWidth=1.5;g.strokeRect(a,b,c,d);
   text([a+3,b+4,c-6,d*.32],locale(p.name),30,22,2,'bold',ink);
   const names=p.stars.length?p.stars.map(locale).join(cn?'、':' / '):(cn?'无主星':'No main star');
   text([a+3,b+d*.35,c-6,d*.63-3],names,28,20,4,'normal',ink)
  });
  text(plan.center,cn?'十二宫\n传统文化小记':'Twelve palaces · Traditional symbolism',31,22,3,'normal',accent);
 }else if(scores){
  plan.rows.forEach((rect,i)=>{
   const [a,b,c,d]=rect,row=data.scoreRows[i],label=locale(row.label),value=locale(row.value);
   const split=c*.67,bar=pawEditorialScoreRatio(value),labelH=bar?d*.66:d-8;
   text([a,b,split-8,labelH],label,data.scoreRows.length>=7?36:44,28,2,'normal',ink,'left');
   text([a+split,b,c-split,labelH],value,40,24,2,'bold',ink,'right');
   if(bar){const bx=a+5,by=b+labelH+4,bw=c-10,bh=Math.min(18,d*.16);g.globalAlpha=.19;g.fillStyle=accent;g.fillRect(bx,by,bw,bh);g.globalAlpha=1;g.fillStyle=accent;if(bar.ratio>0)g.fillRect(bx,by,bw*bar.ratio,bh);if(bar.split){g.fillStyle=ink;g.globalAlpha=.35;g.fillRect(bx+bw/2-1,by-3,2,bh+6);g.globalAlpha=1}}
   else rule(a,b+d-2,c);
  });
  const note=locale(data.lines?.[0])||locale(quote)||(cn?'此刻的探索小记，不是固定标签。':'A snapshot for reflection, not a fixed label.');
  const [nx,ny,nw,nh]=plan.note;
  rule(nx+nw*.4,ny+4,nw*.2);
  text([nx+12,ny+16,nw-24,nh-16],note,cn?36:38,28,3,'normal',ink);
 }else{
  const [a,b,c,d]=plan.art;
  // Show existing illustration in its native proportions; no forced crop
  // of a character or scene. If art failed, give the real result more room.
  const ready=art?.complete&&art.naturalWidth>0&&art.naturalHeight>0;
  if(ready){
   const scale=Math.min((c-28)/art.naturalWidth,(d-10)/art.naturalHeight),iw=art.naturalWidth*scale,ih=art.naturalHeight*scale;
   g.drawImage(art,a+(c-iw)/2,b+(d-ih)/2,iw,ih)
  }
  const items=[locale(data.takeaway),locale(quote),...(data.lines||[]).map(locale)].filter((v,i,arr)=>v&&arr.indexOf(v)===i);
  const rect=ready?plan.summary:plan.body;
  const [sx,sy,sw,sh]=rect;
  rule(sx+sw*.38,sy,sw*.24);
  // One public result line and a short supporting excerpt. For a Zi Wei
  // reflection retain the actual main-star line before the takeaway.
  const lead=locale(data.lines?.[0])||items[0]||locale(data.title);
  const detail=(data.kind==='fortune'?locale(data.lines?.[1]):'')||items.find(v=>v!==lead)||'';
  const fortuneDetail=data.kind==='fortune'?locale(data.lines?.[2]):'';
  const hasFortuneDetail=!!fortuneDetail,contentH=hasFortuneDetail?sh-34:sh;
  const leadH=detail?contentH*.51:contentH-10;
  text([sx+14,sy+8,sw-28,leadH-8],lead,cn?42:44,29,3,'bold',ink);
  if(detail)text([sx+16,sy+leadH,sw-32,contentH-leadH],detail,cn?36:38,29,4);
  if(hasFortuneDetail)text([sx+12,sy+contentH,sw-24,34],fortuneDetail,30,24,1,'normal',ink)
 }
 text(plan.footer,cn?'Pawradise · 偷得浮生半日闲 · 仅供反思':'Pawradise · A little escape · For reflection',28,23,2,'normal',ink);
 return true
}
/* PAW_EDITORIAL_RESULTS_END */

// Reuse the exact public daily fortune theme's registered charm.
// Match both title strings rather than current day or private seed.
function pawEditorialFortuneCharm(data,themes,pathFor){
 if(data?.kind!=='fortune'||!Array.isArray(data.title)||!Array.isArray(themes))return null;
 const index=themes.findIndex(t=>t?.title?.[0]===data.title[0]&&t?.title?.[1]===data.title[1]);
 return index>=0?pathFor(index):null
}
function pawInstallEditorialShare(){
 const artBefore=pawRecoveredResultIllustration;
 pawRecoveredResultIllustration=function(data){
  const path=pawEditorialFortuneCharm(data,townFortunes,pawRecoveredCharmPath);
  // Export-only candidate illustrations, not active room/host replacements.
  // Inspect the rendered artwork before release; never return to the
  // unrelated labelled tea-house scene or Tarot host for Master Yue.
  const resultArt={cafe:'../../staging/2026-11-28-batch3-heart-cafe/standing-serve.webp',story:'../../staging/2026-11-28-batch1-storyteller/standing-book.webp',zwds:'../master-yue/standing.webp'};
  if(Object.hasOwn(resultArt,data?.kind))return pawRecoveredImage(resultArt[data.kind]);
  return (path&&pawRecoveredImage(path))||artBefore(data)
 };
 const prior=shareCardArt;
 shareCardArt=function(cv,data,format,cn){
  if(data?.kind==='tarot'){
   const box=pawRecoveredShareBounds(format),paper=pawRecoveredImage('templates/paper_'+format+'.webp'),atlas=readingArtwork(),count=data.cards?.length;
   const roles=count===5?fiveReadingPositions:count===3?[['Situation','现状'],['Notice','留意'],['Next step','下一步']]:[['Your card','今日之牌']];
   if(pawEditorialTarot(cv,data,format,cn,box,paper,atlas,tarotDeck,roles))return
  }
  if(Object.hasOwn(pawEditorialThemes,data?.kind)){
   const box=pawRecoveredShareBounds(format),paper=pawRecoveredImage('templates/paper_'+format+'.webp');
   const art=Array.isArray(data.scoreRows)&&data.scoreRows.length||data.kind==='zwds_chart'?null:pawRecoveredResultIllustration(data);
   const quote=data.kind==='zwds'||data.kind==='zwds_chart'?null:socialResultQuote(data);
   if(pawEditorialOther(cv,data,format,cn,box,paper,art,quote))return
  }
  return prior(cv,data,format,cn)
 }
 const prepare=pawPrepareRecoveredShare;
 pawPrepareRecoveredShare=function(format,data){
  const pending=prepare(format,data);
  if(!Object.hasOwn(pawEditorialThemes,data?.kind)||data.scoreRows?.length||data.kind==='zwds_chart')return pending;
  const art=pawRecoveredResultIllustration(data);
  return art&&!art.complete?Promise.all([pending,Promise.race([art.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1800))])]):pending
 }
}
/* PAW_EDITORIAL_SHARE_END */
if(typeof document!=='undefined')queueMicrotask(pawInstallEditorialShare);
