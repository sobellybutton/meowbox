
/* Post-extension integration pass. All progress stays local and existing item
   identifiers are preserved. Loaded before the first scene starts. */
function figureCabinetIds(){
 const raw=load('figureCabinetV1',[]);
 return Array.isArray(raw)?[...new Set(raw.filter(id=>boxPrizes.some(p=>p[0]===id)&&items.some(i=>i[0]===id)))].slice(0,6):[]
}
function figureTokenCount(){const n=Number(load('figureTokensV1',0));return Number.isFinite(n)?Math.max(0,Math.min(99999,Math.floor(n))):0}
function creditFigureDuplicate(){save('figureTokensV1',Math.min(99999,figureTokenCount()+1))}
function exchangeFigure(id){
 const prize=boxPrizes.find(p=>p[0]===id);if(!prize||!['common','uncommon'].includes(prize[4])||items.some(v=>v[0]===id)||figureTokenCount()<3)return false;
 save('figureTokensV1',figureTokenCount()-3);addItem(prize[0],prize[1]);return true
}
function toggleFigureDisplay(id){
 if(!boxPrizes.some(p=>p[0]===id)||!items.some(i=>i[0]===id))return false;
 const ids=figureCabinetIds();
 if(ids.includes(id)){save('figureCabinetV1',ids.filter(v=>v!==id));return true}
 if(ids.length>=6){toast(tr('Six little friends fit here. Put one away first.','小柜子只能放六位小伙伴，先收起一只吧。'));return false}
 save('figureCabinetV1',[...ids,id]);return true
}
function fillFigureShelf(shelf){
 const ids=figureCabinetIds();
 for(let i=0;i<6;i++){const v=boxPrizes.find(p=>p[0]===ids[i]),slot=element('span','',shelf,'figureCubby');if(v){slot.innerHTML=bagFigureIcon(v);slot.title=tr(v[0],v[1])}}
}
function figureCabinetPage(back='room'){
 page(tr('Little treasure cabinet','小小手办展示柜'),tr('Every little friend has a place.','每个小伙伴都有自己的位置。'),q=>{
  const ids=figureCabinetIds(),n=figureTokenCount(),wrap=element('section','',q,'figureCabinetBook');
  fillFigureShelf(element('div','',wrap,'figureCabinetPreview'));
  element('p',ids.length+'/6 '+tr('on display','件展示中')+' · '+n+' '+tr('exchange tokens','兑换券'),wrap);
  element('p',tr('New boxes contain unowned figures for 40 Paw Coins. Any old exchange tokens can still unlock common or uncommon figures at three tokens each.','新盲盒40爪爪币一盒，不会抽到已收藏款。旧兑换券仍可用三枚兑换普通或特别款。'),wrap,'figureHelp');
  const grid=element('div','',wrap,'figureCabinetGrid');for(const v of boxPrizes){
   const owned=items.some(i=>i[0]===v[0]),shown=ids.includes(v[0]),secret=!owned&&v[4]==='secret',tile=element('article','',grid,'figureCabinetTile');tile.dataset.owned=String(owned);const im=element('div','',tile,'figureTileArt');im.innerHTML=secret?'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M11 53V28Q11 8 32 8Q53 8 53 28V53Z" fill="#8b806e"/><text x="32" y="42" fill="#f0e3ca" font-size="25" text-anchor="middle">?</text></svg>':bagFigureIcon(v);element('strong',secret?tr('Secret silhouette','隐藏款剪影'):tr(v[0],v[1]),tile);
   const eligible=['common','uncommon'].includes(v[4]);const btn=b(tile,owned?(shown?tr('Put away','收起'):tr('Display','摆放')):eligible?tr('Exchange 3','兑换 · 3券'):tr('Find in a box','盲盒限定'),()=>{if(owned?toggleFigureDisplay(v[0]):exchangeFigure(v[0]))figureCabinetPage(back)});btn.disabled=!owned&&(!eligible||n<3)||owned&&!shown&&ids.length>=6;
  }
  b(wrap,back==='bag'?tr('Back to bag','返回背包'):back==='arcade'?tr('Back to blind boxes','返回盲盒'):tr('Back to my room','返回小窝'),()=>{if(back==='bag')myRoom();else if(back==='arcade'){$('page').style.display='none';if(activity!=='blindBox')start('blindBox')}else hideoutPage()});
  const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();figureCabinetPage(back)}
 })
}
// Paid draws are unique and delivered before the reveal; do not credit a duplicate token for an already delivered purchase.
const cabinetAwardBefore=boxAward;
boxAward=function(){const was=activity==='blindBox'&&state.boxStage==='opening',v=boxPrizes[state.boxPrize];cabinetAwardBefore();if(was&&state.boxStage==='result'&&v?.[4]==='secret')hint('A secret little dragon! Even the universe wanted a day off.','隐藏小龙！连宇宙都想放个假。')};
// Keep the shop album and the room display cabinet distinct.
const cabinetRoomBefore=hideoutPage;
hideoutPage=function(){cabinetRoomBefore();const q=$('content'),stage=q.querySelector('.hideoutScene');if(!stage)return;const actions=q.querySelector('.hideoutPrimary');if(actions&&furnitureOwned('displayCabinet'))b(actions,tr('Display cabinet','手办展示柜'),()=>figureCabinetPage());
 if(!hideoutEditing&&furnitureOwned('displayCabinet')){
 const placed=stage.querySelector('img[data-furniture-id="displayCabinet"]');if(placed){
 const cabinet=element('button','',stage,'figureCabinetInRoom');cabinet.setAttribute('aria-label',tr('Figure display cabinet','手办展示柜'));
 cabinet.style.left=placed.style.left;cabinet.style.top=placed.style.top;cabinet.style.width=placed.style.width;cabinet.style.rotate=placed.style.rotate;cabinet.style.transform='translate(-50%,-84%)';
 cabinet.style.height='auto';cabinet.style.aspectRatio='1/1';fillFigureShelf(cabinet);cabinet.onclick=()=>figureCabinetPage();placed.replaceWith(cabinet)
 }
}
};
const bagReleaseBefore=myRoom;
myRoom=function(){bagReleaseBefore();const q=$('content'),wrap=q.querySelector('.travellerBagV2');if(!wrap)return;const foot=wrap.querySelector('.bagFooter');if(foot){b(foot,tr('Figure cabinet','手办展示柜'),()=>figureCabinetPage('bag'));b(foot,tr('Life journal','人生档案'),lifeProfile);b(foot,tr('Sound settings','声音设置'),meowSettingsPage)}
 const grid=wrap.querySelector('.bagSlots'),body=wrap.querySelector('.bagBody'),detail=wrap.querySelector('.bagDetail');
 if(grid&&body&&detail){
  const position=()=>{if(detail.parentNode===grid)body.append(detail);if(W<720&&!detail.hidden){const index=[...grid.children].findIndex(el=>el.getAttribute('aria-pressed')==='true');if(index>=0)grid.children[Math.min(grid.children.length-1,Math.floor(index/3)*3+2)]?.after(detail)}};
  position();wrap.addEventListener('click',e=>{if(e.target.closest('.bagSlot,.bagCategories,.bagModes')){position();if(W<720&&e.target.closest('.bagSlot'))detail.scrollIntoView({block:'nearest',behavior:'auto'})}});
  // The original renderer clears the grid when filtering, so restore the detail
  // to its parent before its own input/change/click handlers run.
  const detach=()=>{if(detail.parentNode===grid)body.append(detail)};
  wrap.addEventListener('click',detach,true);wrap.addEventListener('input',detach,true);wrap.addEventListener('change',detach,true);
  wrap.addEventListener('input',position);wrap.addEventListener('change',position);
 }
};
$('dockRoom').onclick=myRoom;$('profileHud').onclick=lifeProfile;
const figureStyle=document.createElement('style');figureStyle.textContent=`
.figureCabinetInRoom,.figureCabinetPreview{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:3px;padding:5px!important;background:linear-gradient(100deg,#997653,#d4b087 45%,#876243)!important;border:2px solid #765438!important;border-radius:4px!important;box-shadow:inset 0 0 0 2px #e7cfa5,2px 3px 5px #44312044}
.figureCabinetInRoom{position:absolute;left:71%;top:14%;width:25%;height:31%;z-index:1;box-sizing:border-box;cursor:pointer;min-width:0!important;min-height:44px!important}.figureCubby{display:grid;place-items:center;min-width:0;min-height:0;overflow:hidden;background:linear-gradient(#7d5c4044,#f8e2b855);border-bottom:3px solid #98734e;border-radius:2px}.figureCubby svg{width:100%;height:100%;display:block}
.figureCabinetPreview{width:min(200px,66%);height:238px;margin:10px auto}.figureCabinetGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:10px 0}.figureCabinetTile{display:flex;flex-direction:column;align-items:center;gap:5px;padding:6px 4px;background:#f8ead2;border:1px solid #bba17a;border-radius:6px;min-width:0;text-align:center}.figureTileArt{width:62px;height:62px}.figureTileArt svg{width:100%;height:100%}.figureCabinetTile[data-owned=false] .figureTileArt{filter:grayscale(1) brightness(.5);opacity:.5}.figureCabinetTile strong{font-size:12px;overflow-wrap:anywhere}.figureCabinetTile button{min-width:0!important;width:100%;min-height:44px;white-space:normal!important;font-size:11px!important;padding:4px!important;margin-top:auto!important}.figureHelp{font-size:13px;line-height:1.5}.bagFooter{flex-wrap:wrap}.bagFooter button{flex:1 1 42%}.bagSlots>.bagDetail{grid-column:1/-1;grid-row:auto;min-width:0}.bagDetail[hidden]{display:none!important}
@media(min-width:720px){.figureCabinetGrid{grid-template-columns:repeat(5,minmax(0,1fr))}}
`;document.head.append(figureStyle);

/* Saved gossip can continue from park to tea house. */
parkSerials.push(...[{"title":["The bubble tea audit","奶茶审计风波"],"opening":["Wang ordered zero sugar, then asked for extra pearls. Mei says the accounts do not balance.","王老板点了无糖奶茶，又要求双倍珍珠。梅姨说这账对不上。"],"twist":["He has categorised the pearls as business expenses. Grandma has requested the receipts.","他把珍珠列为办公支出。外婆要求出示发票。"],"choices":[["Audit the pearls","审计珍珠"],["Declare a tea break","宣布茶歇"]],"outcomes":[["The evidence was consumed. The auditor requests a refill.","证物已经被喝掉。审计员要求续杯。"],["The audit is suspended for tapioca-related reasons.","因珍珠相关原因，审计暂停。"]],"after":["The new policy: drinks are personal, gossip is a shared resource.","新规出台：奶茶自理，八卦共享。"]},{"title":["The unread message","未读消息悬案"],"opening":["Lin has left a message unread for 48 hours. Half the tea room has theories.","林姨有条消息两天没读。半个茶馆都在推理。"],"twist":["It turns out the message is from the delivery company. The parcel is a foot bath.","结果是快递公司的短信，包裹是个泡脚桶。"],"choices":[["Celebrate the delivery","庆祝收货"],["Investigate the sender","调查发件人"]],"outcomes":[["Everyone agrees warm feet beat mixed signals.","大家一致认为，脚暖比暧昧靠谱。"],["The delivery uncle has been cleared of romantic intentions.","快递阿叔已排除暧昧嫌疑。"]],"after":["Lin is soaking her feet. The group chat can wait.","林姨泡脚去了，群消息晚点再回。"]}]);
parkSerialTalk=function(){
 if(room!=='park'&&room!=='tea')return;const q=parkProgress(),today=shrineClock().day;
 if(q.beat===3&&q.day<today){q.episode=(q.episode+1)%parkSerials.length;q.beat=0;q.choice=0;save('parkSerialV1',q)}
 const ep=parkSerials[q.episode],mei=['Auntie Mei','梅姨'],lin=['Auntie Lin','林姨'],leave=[tr('Continue later','下次接着聊'),closeTalk];
 const next=(beat,choice=q.choice)=>{save('parkSerialV1',{...q,beat,choice,day:beat===3?today:q.day});if(beat===3){lifeFriend(mei);lifeFriend(lin)}parkSerialTalk()};
 if(q.beat===0)say(tr(...mei),tr(...ep.opening),[[tr('Wait, what happened?','等等，怎么回事？'),()=>next(1)],leave]);
 else if(q.beat===1)say(tr(...lin),tr(...ep.twist),[...ep.choices.map((v,i)=>[tr(...v),()=>next(2,i)]),leave]);
 else if(q.beat===2)say(tr(...mei),tr(...ep.outcomes[q.choice]),[[tr('And then?','然后呢？'),()=>next(3)],leave]);
 else say(tr(...lin),tr(...ep.after)+' '+tr('A new story tomorrow.','明天再来听新瓜。'),[[tr('Remind me what happened','回顾这个瓜'),()=>say(tr(...mei),tr(...ep.outcomes[q.choice]),[[tr('Back to the table','回茶桌'),closeTalk]])],[tr('See you tomorrow','明天见'),closeTalk]]);
};
const townContinuityBefore=action;
action=function(id){
 if(room==='tea'&&id==='chat'){closeTalk();const q=parkProgress();say(tr('Auntie Mei','梅姨'),q.beat?tr('Remember our park gossip? I have more to tell you.','公园那个瓜还记得吧？还有后续呢。'):tr('Tea first, gossip second. Actually, reverse that.','先喝茶再吃瓜。不对，先吃瓜。'),[[tr('Catch up on gossip','接着吃瓜'),parkSerialTalk],[tr('Just have tea','单纯喝茶'),()=>townContinuityBefore(id)],[tr('Keep wandering','继续逛'),closeTalk]]);return}
 return townContinuityBefore(id)
};
/* Separate ambience and effects, with immediate mute of buffered effects. */
let meowSoundPrefs=load('meowSoundPrefsV1',{ambience:true,effects:true});
if(!meowSoundPrefs||typeof meowSoundPrefs!=='object')meowSoundPrefs={ambience:true,effects:true};
function updateMeowAudioBuses(){
 if(!audio)return;const now=audio.currentTime;
 if(actionFxBus)actionFxBus.gain.setTargetAtTime(muted||document.hidden||meowSoundPrefs.effects===false?.0001:.48,now,.025);
 if(ambientBus&&meowSoundPrefs.ambience===false)ambientGain?.gain.setTargetAtTime(.0001,now,.04)
}
const settingsAmbientBefore=ambientTick;ambientTick=function(){settingsAmbientBefore();updateMeowAudioBuses()};
const settingsFxBefore=actionFxContext;actionFxContext=function(){if(meowSoundPrefs.effects===false)return false;const ok=settingsFxBefore();updateMeowAudioBuses();return ok};
const settingsSoundBefore=sound;sound=function(...a){if(meowSoundPrefs.effects!==false)return settingsSoundBefore(...a)};
const settingsMuteBefore=$('mute').onclick;$('mute').onclick=function(e){settingsMuteBefore.call(this,e);updateMeowAudioBuses()};
document.addEventListener('visibilitychange',updateMeowAudioBuses);
function meowSettingsPage(){
 page(tr('A quieter little town','安静一点的小镇'),tr('Your break, your pace.','摸鱼也要随自己的节奏。'),q=>{
 const wrap=element('section','',q,'meowSoundSettings');
 for(const [id,en,cn,descEn,descCn] of [['ambience','Nature and room ambience','环境音','Rain, river and village sounds','雨声、流水和小镇环境音'],['effects','Interaction sounds','互动音效','Taps, bells, splashes and arcade cues','点击、钟声、水声和游戏音效']]){
  const row=element('label','',wrap,'meowSettingRow');const info=element('span','',row);element('strong',tr(en,cn),info);element('small',tr(descEn,descCn),info);const input=element('input','',row);input.type='checkbox';input.checked=meowSoundPrefs[id]!==false;input.onchange=()=>{meowSoundPrefs[id]=input.checked;save('meowSoundPrefsV1',meowSoundPrefs);updateMeowAudioBuses()}
 }
 b(wrap,muted?tr('Turn all sound on','打开声音'):tr('Mute all sound','关闭所有声音'),()=>{$('mute').click();meowSettingsPage()});b(wrap,tr('Back to bag','返回背包'),myRoom);
 const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();meowSettingsPage()}
 })
}
const meowSettingsCSS=document.createElement('style');meowSettingsCSS.textContent='.meowSoundSettings{max-width:460px;margin:auto}.meowSettingRow{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid #bcaa89}.meowSettingRow span{flex:1;min-width:0}.meowSettingRow strong,.meowSettingRow small{display:block}.meowSettingRow small{font-size:12px;line-height:1.4;margin-top:3px}.meowSettingRow input{width:24px;height:24px;accent-color:#536d58;flex:none}.meowSoundSettings>button{display:block;width:100%;min-height:44px;margin-top:9px}';document.head.append(meowSettingsCSS);


/* Curated social hub: one story location, one community entrance.
   Preserve park serial progress, historical collections and existing room IDs. */
roomActions.park=(roomActions.park||[]).filter(a=>a[0]!=='chat');
const curatedOfficeDoor=maps.home.st.find(v=>v[0]==='office');
if(curatedOfficeDoor)maps.home.st=maps.home.st.filter(v=>v[0]!=='office');
function gatheringOfficeStory(){closeTalk();const finish=()=>{addItem('Meeting escape ticket','逃会车票');closeTalk()};say(tr('Wang Laoban','王老板'),tr('Quick meeting. Only five minutes. It starts at 5:58 PM.','开个短会，就五分钟。下午五点五十八开始。'),[[tr('Ask for an agenda','先问议程'),()=>say(tr('Wang Laoban','王老板'),tr('Excellent initiative. Please prepare the agenda.','很好，很主动。那你来准备议程吧。'),[[tr('I have a train to catch','我要赶车'),finish]])],[tr('Pretend the connection froze','假装网络卡了'),()=>say(tr('Wang Laoban','王老板'),tr('No problem. I recorded the meeting for you. All 97 minutes.','没关系，我录下来了。整整九十七分钟。'),[[tr('Clock out anyway','照常下班'),finish]])],[tr('Return to the table','回茶桌'),closeTalk]])}
roomActions.tea=[['chat','Join the table','来茶桌坐坐'],['board','Town noticeboard','小镇留言墙']];
const gatheringActionBefore=action;
action=function(id){
 if(room==='tea'&&id==='chat'){
  closeTalk();say(tr('Auntie Mei','梅姨'),tr('Pull up a chair. Good news, bad jokes, or a bit of quiet company?','来坐坐。有喜事、有冷笑话，还是想找个人陪陪？'),[
   [tr('Meet & chat','认识新朋友'),()=>{closeTalk();communityTab=communityURL()?'public':'lounge';townChatPage()}],
   [tr('Celebrate a good thing','庆祝小确幸'),()=>{closeTalk();communityTab='celebrate';townChatPage()}],
   [tr('Hear the latest gossip','听听最新的瓜'),parkSerialTalk],
   [tr('Chat with a regular','跟熟客聊聊'),()=>say(tr('Auntie Mei','梅姨'),tr('Who would you like to sit with?','想跟谁坐坐？'),[[tr('Auntie Mei','梅姨'),()=>residentConversation('auntie',{n:residentProfiles.auntie.name})],[tr('Wang Laoban','王老板'),()=>residentConversation('wang',{n:residentProfiles.wang.name})],[tr('Back to the table','回茶桌'),()=>action('chat')]])],
   [tr('Office comedy','职场小剧场'),gatheringOfficeStory],
   [tr('Play a table game','来局井字棋'),()=>{closeTalk();start('woodenThree')}],
   [tr('Keep wandering','继续逛'),closeTalk]
  ]);return
 }
 if(room==='park'&&id==='chat')return;
 if(room==='tea'&&id==='board'){closeTalk();communityTab='board';townChatPage();return}
 return gatheringActionBefore(id)
};
const gatheringWalkBefore=walkDoor;
walkDoor=function(id,x,y){if(scene==='home'&&id==='office'){const tea=maps.home.st.find(v=>v[0]==='tea');if(tea){hint('The office comedy has moved to the Tea Room.','职场小剧场搬到茶馆啦。');return gatheringWalkBefore(tea[0],tea[1],tea[2])}}return gatheringWalkBefore(id,x,y)};
const gatheringRoomIntroBefore=roomIntro;
roomIntro=function(){gatheringRoomIntroBefore();if(room==='park'&&!activity)hint('Meet the cats or visit the deer. The gossip has moved to the Tea Room.','陪陪小猫，看看小鹿。想吃瓜，去茶馆坐坐。');if(room==='tea'&&!activity)hint('Join the communal table for good news, gossip or company.','来长桌边坐坐，聊聊喜事、八卦，或者单纯找个伴。')};

/* Original native room compositions drawn directly in world coordinates.
   Characters, tables and station labels remain independent from the background.
   The floor from y=565 remains clear for existing walking and shared peers. */
function gatheringTeaBackdrop(){
 const b=livingBounds(),l=b.x,r=b.x+b.w,top=b.y,bottom=b.y+b.h,wide=W/H>=1.15;
 if(![l,r,top,bottom].every(Number.isFinite)||r<=l||bottom<=top)return false;
 ctx.save();
 const wall=ctx.createLinearGradient(0,top,0,510);wall.addColorStop(0,'#b7ad87');wall.addColorStop(.55,'#e5d4ac');wall.addColorStop(1,'#bd9b76');ctx.fillStyle=wall;ctx.fillRect(l,top,b.w,b.h);
 // Timber frame and garden-facing shoji windows; different compositions
 // in wide and vertical view, with clear centre rather than enlarged cropping.
 const start=wide?Math.max(l+26,20):Math.max(l+12,145),end=wide?Math.min(r-26,780):Math.min(r-12,655),span=end-start;
 const windowTop=Math.max(top+20,190),windowBottom=385,windowCount=wide?4:2;
 if(span>80&&windowBottom>windowTop+40){
  for(let i=0;i<windowCount;i++){
   const x=start+i*span/windowCount+8,w=span/windowCount-16,h=windowBottom-windowTop;
   round(x-4,windowTop-4,w+8,h+8,2,'#795c43','#624c39');
   const sky=ctx.createLinearGradient(0,windowTop,0,windowBottom);sky.addColorStop(0,'#bed3cd');sky.addColorStop(.55,'#d9dcc0');sky.addColorStop(1,'#8da58b');ctx.fillStyle=sky;ctx.fillRect(x,windowTop,w,h);
   ctx.save();ctx.beginPath();ctx.rect(x,windowTop,w,h);ctx.clip();
   for(let k=0;k<4;k++){const xx=x+w*(k*.33-.05);ctx.fillStyle=['#b0ba9f','#a0b295','#879d83','#75937d'][k];ctx.beginPath();ctx.moveTo(xx-w*.3,windowBottom);ctx.quadraticCurveTo(xx+w*.12,windowTop+h*(.38+k*.09),xx+w*.5,windowBottom);ctx.closePath();ctx.fill()}
   for(let k=0;k<22;k++){const xx=x+(k*43%Math.max(1,w)),yy=windowBottom-8-(k*19%Math.max(1,h*.38));ellipse(xx,yy,9+k%4*3,5+k%3,'#728a7155')}
   ctx.restore();line(x+w*.5,windowTop,x+w*.5,windowBottom,'#8e7456',4);line(x,windowTop+h*.55,x+w,windowTop+h*.55,'#8e7456',3);
   line(x,windowTop+2,x+w,windowTop+2,'#f1ddaf',2);
  }
 }
 const floor=ctx.createLinearGradient(0,400,0,bottom);floor.addColorStop(0,'#a48665');floor.addColorStop(.4,'#c1a27c');floor.addColorStop(1,'#8c7055');ctx.fillStyle=floor;ctx.fillRect(l,400,b.w,Math.max(0,bottom-400));
 line(l,400,r,400,'#72563f',9);line(l,408,r,408,'#dfc096',2);
 for(let i=-9;i<=9;i++){const bx=400+i*100;line(400+i*27,410,bx,bottom,'#765a433d',1.5)}
 for(let j=0;j<15;j++){const yy=455+j*j*2.1;if(yy>bottom)break;line(l,yy,r,yy,'#6d543b28',1)}
 // Ceiling beams and pendant lamps, outside the walkable floor.
 line(l,Math.max(top+10,174),r,Math.max(top+10,174),'#6f513c',10);
 for(const x of wide?[100,300,500,700]:[230,570]){
  const y=Math.max(top+28,235);if(x<l+15||x>r-15||y>350)continue;
  line(x,Math.max(top,174),x,y-25,'#785b43',2);
  const g=ctx.createRadialGradient(x,y,5,x,y,45);g.addColorStop(0,'#f8db9e75');g.addColorStop(1,'#f8db9e00');ctx.fillStyle=g;ctx.fillRect(x-45,y-45,90,90);
  ellipse(x,y,19,25,'#dba56e');ellipse(x,y,14,21,'#efd09a');line(x-12,y-20,x+12,y-20,'#926b4a',3);line(x-12,y+20,x+12,y+20,'#926b4a',3);for(const dx of [-8,0,8])line(x+dx,y-17,x+dx,y+17,'#b7885c77',1)
 }
 // Wall shelves: tea jars and pottery, kept well above the walking lane.
 for(const xx of [175,625]){if(xx<l+30||xx>r-30)continue;line(xx-35,421,xx+35,421,'#76553e',6);for(let j=0;j<3;j++){const cx=xx-22+j*22;round(cx-8,398-j%2*4,16,20+j%2*4,5,['#879582','#b48566','#e2c79a'][j],'#80684f');ellipse(cx,398-j%2*4,7,2,'#cfb28a')}}
 ctx.restore();return true
}
const gatheringPortraitBefore=paintPortraitInterior;
paintPortraitInterior=function(id,...args){if(id==='tea'&&gatheringTeaBackdrop())return true;return gatheringPortraitBefore(id,...args)};
const gatheringLandscapeBefore=paintLandscapeRoom;
paintLandscapeRoom=function(id,...args){if(id==='tea'&&W/H>=1.15&&gatheringTeaBackdrop())return true;return gatheringLandscapeBefore(id,...args)};
const gatheringPropBefore=prop;
function gatheringResident(name,x,y,scale,facing,kind){
 if(drawPaintedResident({x,y,n:name},scale,false,facing))return;
 backHuman(x,y,kind,false,facing,scale*.96)
}
function gatheringCup(x,y,c){
 ctx.save();ellipse(x+2,y+5,13,5,'#4c352832');ellipse(x,y+3,12,4.5,'#d7c6a3');ellipse(x,y+2,8,2.5,'#a58c6a');
 const gl=ctx.createLinearGradient(x-8,0,x+8,0);gl.addColorStop(0,'#ded4b8');gl.addColorStop(.45,c);gl.addColorStop(1,'#7d8067');
 ctx.fillStyle=gl;ctx.strokeStyle='#7a7057';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-8,y-8);ctx.quadraticCurveTo(x-7,y+2,x-3,y+3);ctx.quadraticCurveTo(x+7,y+5,x+8,y-8);ctx.closePath();ctx.fill();ctx.stroke();ellipse(x,y-8,8,3,'#cdbb98');ellipse(x,y-8,6,2,'#8d6848');ctx.restore()
}
function gatheringTeaTable(x,y){
 ctx.save();ctx.translate(x,y);
 ellipse(0,42,100,15,'#3b2c2342');
 // Rear legs, stretcher and nearer legs support the same tabletop.
 for(const [xx,yy,foot] of [[-65,-10,25],[65,-10,25],[-73,10,44],[73,10,44]]){line(xx,yy,xx+(xx<0?-4:4),foot,'#684c36',8);line(xx+2,yy+2,xx+(xx<0?-4:4)+2,foot-2,'#b18c65',2)}
 line(-72,34,72,34,'#795638',5);
 const edge=ctx.createLinearGradient(0,-8,0,19);edge.addColorStop(0,'#bd9264');edge.addColorStop(1,'#805936');
 ctx.beginPath();ctx.moveTo(-92,-12);ctx.bezierCurveTo(-94,6,-76,17,0,18);ctx.bezierCurveTo(76,17,94,6,92,-12);ctx.closePath();ctx.fillStyle=edge;ctx.fill();ctx.strokeStyle='#735239';ctx.lineWidth=1.5;ctx.stroke();
 const top=ctx.createLinearGradient(-75,-28,75,10);top.addColorStop(0,'#c3a276');top.addColorStop(.42,'#d4b48a');top.addColorStop(1,'#b68b5e');
 ellipse(0,-13,92,25,top);
 ctx.save();ctx.beginPath();ctx.ellipse(0,-13,91,24,0,0,TAU);ctx.clip();
 for(let j=0;j<8;j++){const yy=-34+j*6;ctx.strokeStyle=j%2?'#936a4745':'#ead0a37a';ctx.lineWidth=j%3===0?1.5:.7;ctx.beginPath();ctx.moveTo(-94,yy);ctx.bezierCurveTo(-33,yy-3,16,yy+5,95,yy-1);ctx.stroke()}
 ctx.restore();ctx.strokeStyle='#ebd1a0';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,-13,90,23,0,Math.PI*.07,Math.PI*.92);ctx.stroke();
 // Tea tray, small glazed cups and teapot; everything rests on the surface.
 ellipse(0,-14,36,10,'#8e765a');ellipse(0,-14,33,8,'#c1ac84');
 gatheringCup(-53,-10,'#a5aa88');gatheringCup(51,-10,'#b88c72');
 ellipse(1,-17,15,6,'#655b4344');
 const glaze=ctx.createRadialGradient(-4,-29,2,1,-22,15);glaze.addColorStop(0,'#b4b493');glaze.addColorStop(1,'#687a64');
 ellipse(1,-24,14,13,glaze);ellipse(1,-36,9,3,'#b6b598');ellipse(1,-39,2.5,2,'#63785f');
 ctx.beginPath();ctx.moveTo(12,-26);ctx.quadraticCurveTo(27,-25,24,-34);ctx.strokeStyle='#77866a';ctx.lineWidth=4;ctx.stroke();
 ctx.beginPath();ctx.ellipse(-13,-24,6,7,0,0,TAU);ctx.strokeStyle='#6a765d';ctx.lineWidth=2;ctx.stroke();
 if(!residentReducedMotion.matches){ctx.strokeStyle='#fff5d36b';ctx.lineWidth=1;for(let j=0;j<2;j++){const phase=(t*.35+j*.5)%1;ctx.globalAlpha=(1-phase)*.45;ctx.beginPath();ctx.moveTo(1+j*4,-39-phase*10);ctx.quadraticCurveTo(9+j*4,-46-phase*10,2+j*4,-52-phase*10);ctx.stroke()}ctx.globalAlpha=1}
 ctx.restore()
}
function gatheringStool(x,y){
 ctx.save();ctx.translate(x,y);ellipse(0,19,20,5,'#49352530');for(const dx of [-11,11]){line(dx,0,dx+(dx<0?-3:3),18,'#72553c',4);line(dx+1,1,dx+1,15,'#a98a60',1)}
 ellipse(0,0,20,8,'#97734f');ellipse(0,-3,20,7,'#c5a57b');ctx.strokeStyle='#8d6e4c80';ctx.lineWidth=.9;ctx.beginPath();ctx.ellipse(0,-3,14,4,0,0,TAU);ctx.stroke();ctx.restore()
}
prop=function(id,x,y){
 if(room!=='tea')return gatheringPropBefore(id,x,y);
 if(id==='chat'){
  ctx.save();
  // Keep standing illustrations on the floor, not floating over seats.
  // The table occludes the rear guests; both stools are visibly empty.
  gatheringResident(['Auntie Mei','梅姨'],x-53,y-10,1.06,'right',0);
  gatheringResident(['Grandma','外婆'],x+53,y-10,1.06,'left',1);
  gatheringTeaTable(x,y);
  gatheringResident(['Wang Laoban','王老板'],x+116,y+32,.96,'left',2);
  gatheringStool(x-102,y+38);gatheringStool(x+39,y+54);
  ctx.restore();return
 }
 if(id==='board'){gatheringPropBefore(id,x,y);gatheringResident(['Master Yue','月师傅'],x+90,y+3,.95,'left',3);return}
 return gatheringPropBefore(id,x,y)
};


/* Curation batch 2: one reading table, one self-discovery host, distinct
   relationship conversation and branching fiction. Keep legacy activity IDs. */
function curatedSingleStation(entries,id,en,cn){
 const match=(entries||[]).find(v=>v[0]===id);
 return match?[[id,en,cn]]:entries
}
roomActions.tarot=curatedSingleStation(roomActions.tarot,'tarot','Reading table','塔罗牌桌');
roomActions.quiz=curatedSingleStation(roomActions.quiz,'quiz','Discover yourself','认识自己');
roomActions.story=curatedSingleStation(roomActions.story,'story','Choose a different life','选择另一种人生');
roomActions.match=curatedSingleStation(roomActions.match,'match','Conversation cards','相处话题卡');
if(indoorStages.tarot?.stations?.tarot)indoorStages.tarot.stations.tarot=[400,440,400,615];
const curatedDiscoveryActionBefore=action;
action=function(id){
 if(room==='tarot'&&id==='tarot'){
  closeTalk();return say(tr('Fortune Teller','占卜师'),tr('Something on your mind? Take your time. The cards aren’t going anywhere.','心里有事？慢慢来，牌又不会跑。'),[
   [tr('Daily guidance · 1 card','今日指引 · 一张牌'),()=>{closeTalk();start('tarot')}],
   [tr('Find some clarity · 3 cards','三牌解惑 · 三张牌'),()=>{closeTalk();start('love')}],
   [tr('Keep exploring','继续逛逛'),closeTalk]
  ])
 }
 if(room==='quiz'&&id==='quiz'){
  closeTalk();return say(tr('Lab keeper','研究所店主'),tr('Choose a little discovery. Each is for self-reflection, not diagnosis.','选一个小小的自我探索。仅供自我反思，并非诊断。'),[
   [tr('MBTI-inspired preferences','MBTI 四种性格偏好'),()=>{closeTalk();wonderSceneOpen('type')}],
   [tr('Enneagram-inspired · nine motives','九型人格 · 九种内在动力'),()=>{closeTalk();wonderSceneOpen('motive')}],
   [tr('Five personality tendencies','五大性格倾向'),()=>{closeTalk();wonderSceneOpen('bigfive')}],
   [tr('Relationship values','关系价值观'),()=>{closeTalk();wonderSceneOpen('values')}],
   [tr('Keep exploring','继续逛逛'),closeTalk]
  ])
 }
 return curatedDiscoveryActionBefore(id)
};
/* The existing café's physical choice/turn animation stays. Replace the
   old generic outing questions with relational situations. Choice categories
   indicate ways to begin a conversation, never compatibility or worth. */
const curatedCafeQuestions=[
 [['Someone you care about has been quiet all day.','你在乎的人今天一直很安静。'],[['Ask if they would like space','问问对方是否想独处'],['Invite them for a short walk','约对方出去走走'],['Ask if they would like to talk','问问对方想不想聊聊']]],
 [['A friend cancels plans at the last minute.','朋友临时取消了约定。'],[['Take time before replying','先缓一缓再回复'],['Offer another day or plan','换个时间或安排'],['Ask kindly what happened','温和地问发生了什么']]],
 [['You disagree about something important.','你们在一件重要的事上意见不同。'],[['Pause and return when calm','先冷静一下再谈'],['Look for a practical compromise','一起找实际的折中方案'],['Listen to what each person needs','听听彼此真正需要什么']]],
 [['You want to show someone they matter.','你想让对方知道，自己很在乎他们。'],[['Respect their time and boundaries','尊重对方的时间和边界'],['Make time for something together','抽时间一起做点事'],['Tell them something you appreciate','说出你欣赏对方的地方']]]
];
const curatedCafeStyles=[
 ['Quiet Harbour','安静港湾','You tended to choose space and time. Ask what the other person needs rather than assuming.','你比较常选择留出空间和时间。别替对方猜，问问他们真正需要什么。','#92a89f'],
 ['Adventure Companion','冒险搭子','You tended to offer practical next steps. Remember that sometimes company is enough.','你比较常提出实际行动。有时候陪着对方，就已经足够。','#d6a36d'],
 ['Warm-hearted Listener','暖心倾听者','You tended to begin by listening. Remember that your own needs deserve room too.','你比较常先倾听。也别忘了给自己的需求留一点位置。','#c99a96']
];
if(typeof cafeQuestions!=='undefined'&&Array.isArray(cafeQuestions)&&cafeQuestions.length===4&&cafeQuestions.every(v=>Array.isArray(v)&&Array.isArray(v[1])&&v[1].length===3))cafeQuestions.splice(0,4,...curatedCafeQuestions);
if(typeof cafeKinds!=='undefined'&&Array.isArray(cafeKinds)&&cafeKinds.length===3&&cafeKinds.every(v=>Array.isArray(v)&&v.length>=5))for(let i=0;i<3;i++){cafeKinds[i][2]=curatedCafeStyles[i][2];cafeKinds[i][3]=curatedCafeStyles[i][3]}
// Do not infer a player's personality from the café result or introduce a second score.
const curatedDiscoveryIntroBefore=roomIntro;
roomIntro=function(){
 curatedDiscoveryIntroBefore();
 if(activity)return;
 if(room==='tarot')hint('One table. Choose one, three or five cards.','一张牌桌，选一张、三张或五张牌。');
 if(room==='quiz')hint('Find out more about yourself. No diagnosis, no homework.','认识自己，不贴标签，也不交作业。');
 if(room==='match')hint('Explore how you might respond to someone you care about. No compatibility score.','想想你会怎样回应在乎的人。不算缘分分数。');
 if(room==='story')hint('Follow a story, make choices and discover a different ending.','跟着故事走，自己做决定，探索不同结局。')
};


/* Curation batch 3: the existing wooden board moves to the social table;
   one genuinely different festival activity takes its former arcade slot. */
const festivalThreeSlot=(roomActions.arcade||[]).find(a=>a[0]==='woodenThree');
if(festivalThreeSlot){
 roomActions.arcade=roomActions.arcade.map(a=>a[0]==='woodenThree'?['goldfishScoop','Goldfish scooping','捞金鱼']:a);
 indoorStages.arcade.stations.goldfishScoop=[...(indoorStages.arcade.stations.woodenThree||[400,440,400,615])];
}
const festivalFishKinds=[
 {name:['Little Tangerine','小橘子'],color:'#db8a56',light:'#f4c78c',speed:1.07},
 {name:['Snowball','雪球'],color:'#e9d9b4',light:'#fff3d7',speed:.78},
 {name:['Inky','墨墨'],color:'#555d61',light:'#b3b4a4',speed:1.21},
 {name:['Peach Blossom','桃花'],color:'#cc8b89',light:'#f3c4ac',speed:.91},
 {name:['Golden Dumpling','金元宝'],color:'#d1a047',light:'#f3df9b',speed:1.36}
];
function festivalFishPosition(i,age,seed=0){
 const k=festivalFishKinds[i],a=age*.8*k.speed+i*1.73+seed;
 const pos=pawScoopProject(400+Math.cos(a)*111+Math.sin(a*1.7+i)*24,458+Math.sin(a*.84+i)*61);
 return {...pos,dir:-Math.sin(a)>=0?1:-1}
}
function festivalNewRound(now,seed=0){
 return {at:now,seed,x:400,y:458,paper:100,phase:'aim',caught:[],attempts:0,last:now,resultAt:0,feedback:['Hold in the water, follow a fish and release to lift.','按住水面，跟着小鱼移动，松手捞起。']}
}
function festivalFishOutcome(game,now){
 const elapsed=now-game.last;
 if(game.phase!=='dip'||!Number.isFinite(elapsed)||elapsed<0)return null;
 if(elapsed<.12)return {caught:-1,wear:4,tooQuick:true};
 let nearest=-1,distance=Infinity;
 for(let i=0;i<festivalFishKinds.length;i++){if(game.caught.includes(i))continue;const p=festivalFishPosition(i,now-game.at,game.seed),d=Math.hypot(p.x-game.x,p.y-game.y);if(d<distance){distance=d;nearest=i}}
 const gentle=mbFishTiming(elapsed)==='ready',hit=gentle&&distance<=39;
 const wear=Math.min(100,(hit?18:gentle?12:28)+Math.max(0,Math.floor((elapsed-2.0)*16)));
 return {caught:hit?nearest:-1,wear}
}
function festivalFinish(g){
 if(g.phase==='done')return;g.phase='done';g.resultAt=t;
 if(g.attempts)lifeEarn('round:goldfish',{skill:2,happiness:1},true);
 g.feedback=g.caught.length?['A little fish parade! All fish return safely to the tank.','小鱼巡游成功！小鱼们都安全回水池啦。']:['The fish have excellent evasive manoeuvres.','小鱼的闪避技能已经点满。'];
 refreshControls()
}
function festivalAim(x,y){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||!['aim','dip'].includes(g?.phase)||!Number.isFinite(x)||!Number.isFinite(y))return;
 const pos=pawScoopProject(x,y);if(pos){g.x=pos.x;g.y=pos.y}
}
function festivalDip(){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||g?.phase!=='aim'||g.paper<=0)return;
 g.phase='dip';g.last=t;g.feedback=['Lift gently while a fish is inside the ring.','小鱼游进圈里，轻轻捞起来。'];physicalFx('water',.6);refreshControls()
}
function festivalLift(){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||g?.phase!=='dip')return;
 const elapsed=t-g.last,result=festivalFishOutcome(g,t);if(!result)return;
 g.attempts++;g.paper=Math.max(0,g.paper-result.wear);g.phase='lift';g.last=t;
 if(result.caught>=0){const i=result.caught,k=festivalFishKinds[i];g.caught.push(i);addItem('Goldfish postcard: '+k.name[0],'金鱼明信片：'+k.name[1]);g.feedback=['A gentle catch! '+k.name[0]+' is going back in the water.','轻轻捞到了'+k.name[1]+'！一会儿放回水里。'];physicalFx('water',.8)}
 else{g.feedback=result.tooQuick?['Let the paper settle before lifting.','先让纸网稳一稳，再捞起来。']:elapsed>2.0?['The paper soaked too long. Lift a little sooner.','纸网泡太久了，下次早点捞起来。']:['The fish dodged the ring. Aim where it is swimming.','小鱼躲开了，试着瞄准它游去的方向。'];physicalFx('splash',.4)}
 refreshControls()
}
const festivalStartBefore=start;
start=function(id){
 festivalStartBefore(id);
 if(id==='goldfishScoop'){state.festivalFish=festivalNewRound(t,Math.random()*TAU);refreshControls();hint('Hold and drag in the water. Release to lift.','按住水面移动，松手捞鱼。')}
};
activityTitle.goldfishScoop=['Goldfish scooping','捞金鱼'];
const festivalHintBefore=activityHint;
activityHint=function(){if(activity==='goldfishScoop'){hint('Hold to dip. Drag gently. Release to lift.','按住下网，轻轻移动，松手捞起。');return}return festivalHintBefore()};
const festivalActionBefore=action;
action=function(id){if(room==='arcade'&&id==='goldfishScoop'){start(id);return}return festivalActionBefore(id)};
const festivalPawBefore=townPawCategory;
townPawCategory=function(key){return key==='round:goldfish'?'play':festivalPawBefore(key)};
function festivalDrawFish(x,y,k,dir,age,i,scale=1){
 ctx.save();ctx.translate(x,y);ctx.scale(dir*scale,scale);ctx.rotate(Math.sin(age*2+i)*.12);
 ctx.beginPath();ctx.moveTo(-16,0);ctx.quadraticCurveTo(-31,-12-Math.sin(age*5+i)*3,-34,-11);ctx.lineTo(-29,0);ctx.lineTo(-34,12);ctx.quadraticCurveTo(-20,7,-16,0);ctx.fillStyle=k.light;ctx.fill();
 const g=ctx.createLinearGradient(0,-10,0,10);g.addColorStop(0,k.light);g.addColorStop(.55,k.color);g.addColorStop(1,k.light);ellipse(0,0,20,10,g);ellipse(6,-3,7,4,k.light);ellipse(13,-2,2,2,'#413a33');ellipse(13.5,-2.5,.7,.7,'#fff4df');
 ctx.beginPath();ctx.moveTo(-3,2);ctx.quadraticCurveTo(-8,14,-15,9);ctx.lineTo(-5,-1);ctx.fillStyle=k.light;ctx.fill();ctx.restore()
}
function festivalTank(x,y,sc=1,game=null){
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
 ellipse(0,45,158,27,'#422d263d');
 for(const dx of [-121,121]){line(dx,23,dx,62,'#604738',8);line(dx+2,25,dx+2,59,'#b39472',2)}
 ellipse(0,10,155,91,'#a57e55');ellipse(0,0,155,89,'#ccb18a');ellipse(0,0,146,81,'#765c45');const water=ctx.createRadialGradient(-32,-29,4,0,0,156);water.addColorStop(0,'#b8c9aa');water.addColorStop(.45,'#79a49a');water.addColorStop(1,'#426b68');ellipse(0,0,138,74,water);
 ctx.save();ctx.beginPath();ctx.ellipse(0,0,137,73,0,0,TAU);ctx.clip();
 for(let i=0;i<15;i++){let xx=-124+(i*49%248),yy=-61+(i*33%122);ctx.globalAlpha=.18;ellipse(xx,yy,9+i%4*3,2,'#e7ead0')}
 ctx.globalAlpha=1;
 if(game){const age=t-game.at;for(let i=0;i<festivalFishKinds.length;i++){const p=festivalFishPosition(i,age,game.seed);festivalDrawFish(p.x-400,p.y-458,festivalFishKinds[i],p.dir,age,i,.72);if(game.caught.includes(i)){ctx.save();ctx.globalAlpha=.65;ellipse(p.x-400,p.y-458-13,2,2,'#f6e6ba');ctx.restore()}}}
 else for(let i=0;i<3;i++)festivalDrawFish(-70+i*68,Math.sin(t*.8+i)*24,festivalFishKinds[i],i%2?1:-1,t,i,.8);
 ctx.restore();ctx.restore()
}
const festivalPropBefore=prop;
prop=function(id,x,y){if(room==='arcade'&&id==='goldfishScoop'){festivalTank(x,y-21,.42);return}return festivalPropBefore(id,x,y)};
const festivalDrawBefore=drawActivity;
drawActivity=function(){
 if(activity!=='goldfishScoop'||!state.festivalFish)return festivalDrawBefore();
 const g=state.festivalFish,age=t-g.at;
 if(g.phase==='dip'&&t-g.last>=3.1)festivalLift();
 if(g.phase==='lift'&&t-g.last>=.4){if(g.paper<=0||g.caught.length===festivalFishKinds.length||g.attempts>=8)festivalFinish(g);else{g.phase='aim';refreshControls()}}
 ctx.save();paintLivingBackdrop(pics.arcade||pics.tea);
 const b=livingBounds(),shade=ctx.createLinearGradient(0,325,0,650);shade.addColorStop(0,'#332e2620');shade.addColorStop(1,'#4f382c9c');ctx.fillStyle=shade;ctx.fillRect(b.x,b.y,b.w,b.h);
 // The actual tank rests on its own wooden legs, with separate moving fish.
 festivalTank(400,458,1,g);
 const gx=g.x,gy=g.y,raise=g.phase==='lift'&&!residentReducedMotion.matches?Math.sin(Math.PI*clamp((t-g.last)/.4,0,1))*32:0;
 if(g.phase!=='done'){
  if(g.phase==='dip'&&!residentReducedMotion.matches){ctx.save();ctx.strokeStyle='#e7f4da88';ctx.lineWidth=1.4;for(let i=0;i<2;i++){const f=((t-g.last)*1.45+i*.5)%1;ctx.globalAlpha=(1-f)*.65;ctx.beginPath();ctx.ellipse(gx,gy,24+f*24,19+f*12,0,0,TAU);ctx.stroke()}ctx.restore()}
  ctx.save();ctx.translate(gx,gy-raise);ctx.globalAlpha=g.phase==='dip'?.78:1;
  line(13,11,46,58,'#9d744d',8);line(15,9,46,56,'#d3b083',2);ellipse(0,0,24,20,g.paper>0?'rgba(236,229,206,'+(.16+.58*Math.max(0,g.paper)/100)+')':'#00000000');
  ctx.beginPath();ctx.ellipse(0,0,24,20,0,0,TAU);ctx.strokeStyle='#cba26d';ctx.lineWidth=4;ctx.stroke();ctx.restore();
 }
 backHuman(228,575,avatar??0,false,'right',.86);
 // Direct pointer control is attached to the actual water surface.
 ctx.restore()
};
const festivalControlsBefore=refreshControls;
refreshControls=function(){
 festivalControlsBefore();const el=$('gameControls');if(!el)return;el.classList.toggle('festivalFishControls',activity==='goldfishScoop');
 if(activity!=='goldfishScoop'||!state.festivalFish)return;
 const g=state.festivalFish;el.hidden=false;el.replaceChildren();
 element('strong',tr('Paper ','纸网 ')+g.paper+'% · '+tr('Fish ','小鱼 ')+g.caught.length+'/5',el);
 element('small',tr(...g.feedback),el);
 const controls=element('div','',el,'festivalFishButtons');
 if(g.phase==='done'){b(controls,tr('Try again','再玩一局'),()=>start('goldfishScoop'));b(controls,tr('Back to arcade','返回游戏厅'),()=>{activity=null;state={};updateHUD();roomIntro()});return}
 if(g.phase==='aim'){
  for(const [label,cn,dx,dy] of [['Left','左',-30,0],['Right','右',30,0],['Up','上',0,-27],['Down','下',0,27]])b(controls,tr(label,cn),()=>festivalAim(g.x+dx,g.y+dy));
  b(controls,tr('Dip','下网'),festivalDip)
 }else if(g.phase==='dip'){for(const [en,cn,dx,dy] of [['Left','左',-20,0],['Right','右',20,0],['Up','上',0,-18],['Down','下',0,18]])b(controls,tr(en,cn),()=>festivalAim(g.x+dx,g.y+dy));b(controls,tr('Lift gently','轻轻捞起'),festivalLift)}
 else element('small',tr('Returning the fish…','让小鱼回水池……'),controls)
};
const festivalCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(activity!=='goldfishScoop')return festivalCameraBefore(s,ox,oy);
 const short=W>=H&&H<500,top=short?65:120,bottom=H-(short?80:180),usableW=W-(short?220:16);
 const z=Math.max(.08,Math.min(usableW/385,Math.max(70,bottom-top)/260));
 return {s:z,ox:(short?(W-210)/2:W/2)-400*z,oy:(top+bottom)/2-475*z}
};
const festivalStyle=document.createElement('style');festivalStyle.textContent='#game #gameControls.festivalFishControls:not([hidden]){display:flex;flex-direction:column;gap:4px;width:min(92vw,390px);padding:7px;background:#f0e2c7;color:#514638;border:3px double #b09a72;border-radius:5px}.festivalFishControls small{font-size:12px;line-height:1.35;text-align:center}.festivalFishButtons{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.festivalFishButtons button{min-width:44px!important;min-height:44px!important;padding:5px 8px!important;white-space:normal!important}@media(orientation:landscape) and (max-height:499px){#game #gameControls.festivalFishControls:not([hidden]){width:200px!important;left:auto!important;right:8px!important;transform:none!important}}';document.head.append(festivalStyle);


/* One deck and one table; five cards extend the existing topic/shuffle flow.
   Use a separate versioned archive for extended spreads so older journal
   validation cannot silently discard them. No private question is uploaded. */
const fiveReadingPositions=[['Situation','现状'],['Challenge','挑战'],['What helps','助力'],['A next step','下一步'],['Perspective','提醒']];
const fiveReadingQuestions=[
 // Preserve the four existing topic indices in historic journals.
 [
  ['What is happening in this relationship, beneath the surface?','这段关系的表面之下，正在发生什么？'],
  ['Which expectation, fear or boundary needs attention?','哪一种期待、顾虑或界限值得留意？'],
  ['What support or strength is available to you?','现在有哪些支持，或是你自身的力量，可以帮助你？'],
  ['What could you communicate or do without forcing an outcome?','不强求结果的前提下，你能沟通什么，做些什么？'],
  ['What perspective would help you treat yourself and others with care?','换个什么角度，能让你更温柔地对待自己和别人？']
 ],
 [
  ['Which part of your work deserves your attention right now?','眼下，工作中哪一部分最值得你关注？'],
  ['What is draining you, or standing in your way?','是什么在消耗你的精力，或阻碍你前进？'],
  ['Which skills, people or resources could help?','哪些能力、人或资源可以帮到你？'],
  ['What is one realistic action you could take next?','接下来，你能采取哪一个实际的行动？'],
  ['What matters to you beyond your job title?','除了工牌上的职位，还有什么对你很重要？']
 ],
 [
  ['What does stability mean to you at the moment?','此刻，安稳对你来说意味着什么？'],
  ['Which spending habit or financial concern deserves a closer look?','哪些消费习惯或财务顾虑值得重新审视？'],
  ['Which practical resources or habits could support you?','哪些实际资源或习惯能给你支持？'],
  ['What can you do based on your budget and the facts, not the cards?','根据预算和事实，而不是牌面，你能做些什么？'],
  ['What is enough, and what are you trying to make room for?','对你而言，怎样才算足够？你想给什么留出空间？']
 ],
 [
  ['What is really on your mind?','此刻，你心里真正放不下的是什么？'],
  ['Which assumption or uncertainty might be holding you back?','哪一种预设或不确定感，可能让你停在原地？'],
  ['What strength, resource or support have you overlooked?','有哪些力量、资源或支持，是你忽略了的？'],
  ['What is one manageable step you could choose?','你可以选择迈出怎样力所能及的一步？'],
  ['What would you like to remember when you look back on this moment?','将来回望这一刻，你希望自己记住什么？']
 ]
];
function fiveReadingPrompt(topic,i){
 const row=fiveReadingQuestions[Number.isInteger(topic)&&topic>=0&&topic<3?topic:3];return row[i]?tr(...row[i]):''
}
function fiveReadingDraw(poolLength,random=Math.random){
 const pool=Array.from({length:poolLength},(_,i)=>i),out=[];if(pool.length<5)return out;
 for(let i=0;i<5;i++){const index=Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)));out.push({i:pool.splice(index,1)[0],rev:random()<.5})}return out
}
function fiveReadingLayout(portrait){
 return portrait?[{x:330,y:385},{x:470,y:385},{x:260,y:565},{x:400,y:565},{x:540,y:565}].map(v=>({...v,w:82,h:125})):
 [220,310,400,490,580].map(x=>({x,y:480,w:76,h:119}))
}
function fiveReadingArchive(){
 const raw=load('fiveReadingJournalV1',[]);return Array.isArray(raw)?raw.filter(v=>typeof v?.date==='string'&&Array.isArray(v.cards)&&v.cards.length===5&&new Set(v.cards.map(c=>c?.i)).size===5&&v.cards.every(c=>Number.isInteger(c?.i)&&c.i>=0&&c.i<tarotDeck.length&&typeof c.rev==='boolean')).slice(0,40):[]
}
function fiveReadingSave(){
 if(state.readSaved||state.readCards.length!==5||!state.readFlip.every(v=>v>=0&&t-v>=.72))return;
 const entry={...tarotShareSnapshot(state),date:shrineClock().day};
 const archive=fiveReadingArchive(),key=JSON.stringify(entry);
 if(journalAutoSave()&&!archive.some(v=>JSON.stringify(v)===key))save('fiveReadingJournalV1',[entry,...archive].slice(0,40));
 state.readSaved=true;addItem('Five-card reading','五张牌占卜');lifeEarn('ritual:reading',{wisdom:2,calm:1},true);readingJournalHint()
}
function fiveReadingDetail(v,i){
 const d=tarotDeck[v.i];if(!d)return;
 say(tr(...fiveReadingPositions[i]),tr(d[0],d[1])+' · '+orient(v.rev)+'\n\n'+arcanaReading(d,v.rev)+'\n\n'+fiveReadingPrompt(state.readTopic,i)+(tarotCommentary(d[0],v.rev,state.readTopic,state.tarotTone)?'\n\n'+tr(...tarotCommentary(d[0],v.rev,state.readTopic,state.tarotTone)):''),[[tr('Back to the cards','回到牌桌'),closeTalk]])
}
const fiveDealBefore=readingDeal;
readingDeal=function(){
 if(activity!=='love'||state.readSpreadSize!==5)return fiveDealBefore();
 if(state.readStage!=='deck'||!state.readShuffle)return;
 const cards=fiveReadingDraw(tarotDeck.length);if(cards.length!==5)return;
 state.readStage='deal';state.readAt=t;state.readCards=cards;state.readFlip=Array(5).fill(-1);state.readSaved=false;
 sound(460)
};
const fiveDrawBefore=drawActivity;
drawActivity=function(){
 if(activity!=='love'||state.readSpreadSize!==5||!['deal','cards'].includes(state.readStage))return fiveDrawBefore();
 const age=t-state.readAt,portrait=W<H,slots=fiveReadingLayout(portrait),complete=state.readFlip.every(v=>v>=0&&t-v>=.72);
 if(state.readStage==='deal'&&age>=1.45){state.readStage='cards';state.readAt=t;hint('Turn the cards one at a time. Notice what each brings to mind.','一张一张翻，看看每张牌让你想起了什么。')}
 ctx.save();paintLivingBackdrop(pics.readingInterior||pics.tarot||pics.tea);table();
 for(const [i,slot] of slots.entries()){
  const v=state.readCards[i];if(!v)continue;const f=state.readStage==='deal'?clamp((age-i*.17)/.62,0,1):1,e=f*f*(3-2*f),x=400+(slot.x-400)*e,y=465+(slot.y-465)*e-12*Math.sin(Math.PI*e),flip=state.readFlip[i]<0?0:clamp((t-state.readFlip[i])/.72,0,1),face=flip>=.5,w=slot.w*(flip>0&&flip<1?Math.max(.045,Math.abs(Math.cos(Math.PI*flip))):1),h=slot.h;
  if(face)drawReadingCard(x-w/2,y-h/2,w,h,v.i,v.rev);else card(x-w/2,y-h/2,w,h,false);
  if(state.readStage==='cards'){target(slot.x-slot.w/2-5,slot.y-slot.h/2-4,slot.w+10,slot.h+8,()=>{if(state.readFlip[i]<0)readingReveal(i);else if(t-state.readFlip[i]>=.72)fiveReadingDetail(v,i)});activityFitText(tr(...fiveReadingPositions[i]),slot.x,slot.y+slot.h/2+15,12,portrait?110:85,'#fff0d2');if(face)activityFitText(orient(v.rev),slot.x,slot.y+slot.h/2+28,11,portrait?110:85,'#f3dfaf')}
 }
 if(complete){fiveReadingSave();label(tr('Read all five','查看完整解读'),400,portrait?700:625,()=>openTarotReading(tarotShareSnapshot(state)));}
 ctx.restore()
};
const fiveCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(activity!=='love'||state.readSpreadSize!==5||!['deal','cards'].includes(state.readStage))return fiveCameraBefore(s,ox,oy);
 const portrait=W<H,short=!portrait&&H<500,top=short?60:125,bottom=H-(short?74:120),left=portrait?210:170,right=portrait?590:630,u=portrait?305:405,d=portrait?735:665;
 const z=Math.max(.08,Math.min((W-16)/(right-left),Math.max(80,bottom-top)/(d-u)));return {s:z,ox:W/2-(left+right)/2*z,oy:(top+bottom)/2-(u+d)/2*z}
};
/* Clarify the established four topic choices without changing saved indices.
   Personal growth, life choices and private questions fit General guidance. */
if(typeof readingTopics!=='undefined'&&Array.isArray(readingTopics)&&readingTopics.length===4&&readingTopics.every(v=>Array.isArray(v)&&v.length>=2)){
 const names=[['Love & relationships','感情与关系'],['Career & work','事业与工作'],['Money & stability','金钱与安稳'],['General guidance','随缘指引']];
 for(let i=0;i<4;i++){readingTopics[i][0]=names[i][0];readingTopics[i][1]=names[i][1]}
}
const tarotTopicCopyBefore=readingTopic;
readingTopic=function(i){
 const was=state.readStage;const result=tarotTopicCopyBefore(i);
 if(was==='topic'&&state.readStage==='deck')hint('Hold your question in mind, then shuffle when you feel ready.','把问题放在心里，准备好了就洗牌。');
 return result
};

/* Tarot personality: choose a relatable private prompt and a tone, then keep
   actual meanings separate from optional, clearly playful commentary. */
const tarotMoodChoices=[
 [['He didn’t reply. Again.','他又没回消息。又。'],['Should I text or keep my dignity?','主动发消息，还是保住最后一点尊严？'],['My heart needs a little kindness.','今天想对自己的心温柔一点。']],
 [['Should I resign or am I just hungry?','我是真的想辞职，还是单纯饿了？'],['My workload and salary are not on speaking terms.','工作量和工资好像互不认识。'],['I need some clarity about work.','想理清工作上的烦恼。']],
 [['Why does money treat me like a transit station?','钱为什么把我当中转站？'],['My wallet would like a word.','我的钱包有意见。'],['I need to feel more secure.','我想多一点安稳。']],
 [['Is it intuition or overthinking?','这是直觉，还是我又脑补过头？'],['Just nosy about my own life.','纯粹想吃自己的瓜。'],['I need a quiet moment.','我想安静一会儿。']]
];
const tarotRoastMajor={
 'The Fool':[['A fresh start. No need to reopen the old chat.','新的开始，不必重开旧聊天框。'],['Check the ground before leaping. The group chat is not a safety net.','先看清脚下再跳，群聊可不是安全网。']],
 'The Magician':[['Use what you have. No need to buy another productivity app.','善用手中资源，不用再买一个效率软件。'],['One task at a time. Twenty open tabs are not a strategy.','一次做一件事，开二十个网页不算策略。']],
 'The High Priestess':[['Listen inward. Your notifications can sit this one out.','听听自己的心，通知栏先靠边站。'],['A feeling is not automatically a fact. Even at 2 am.','感受不一定是事实，凌晨两点也一样。']],
 'The Empress':[['Care for yourself too. You are not the town’s free pantry.','也照顾一下自己，你不是全镇免费茶水间。'],['Overgiving is not a subscription you must renew.','过度付出不是必须续费的会员。']],
 'The Emperor':[['Boundaries are allowed. Even without a calendar invite.','设立界限不用先发会议邀请。'],['Not everything needs a spreadsheet. The spreadsheet can rest.','不是所有事都要做表格，表格也该休息。']],
 'The Hierophant':[['Tradition has its uses. So does asking why.','经验有用，问一句为什么也有用。'],['An old rule is not automatically a good rule.','老规矩不一定是好规矩。']],
 'The Lovers':[['Choose with care. Your heart is not an automatic renewal.','认真选择，你的心又不是自动续费。'],['Check whether your choices and values agree. No committee required.','看看选择和价值观是否一致，不必开委员会。']],
 'The Chariot':[['Pick a direction. Running in circles is still cardio, not progress.','选个方向，原地转圈算运动，不算进度。'],['Slow down. You are not racing the last train.','慢一点，你又不是在追末班车。']],
 'Strength':[['Gentleness counts. Nobody asked you to wrestle the whole week.','温柔也算本事，没人让你跟整周生活摔跤。'],['Rest is allowed. You do not need a permission slip.','可以休息，不用请示批准。']],
 'The Hermit':[['A little solitude. Your phone can survive without supervision.','独处一会儿，手机没人监管也能活。'],['Quiet time is good. Going permanently offline is not the only option.','安静一下很好，不必直接永久下线。']],
 'Wheel of Fortune':[['Things change. Even the meeting agenda, apparently.','事情会变，会议议程尤其擅长。'],['You cannot control every turn. Save your energy for the brakes.','不是每个转弯都能控制，留点力气踩刹车。']],
 'Justice':[['Consider the facts. A dramatic playlist is not evidence.','看清事实，伤感歌单不算证据。'],['Check the assumptions. The evidence deserves a proper hearing.','核对一下预设，别让证据连发言机会都没有。']],
 'The Hanged Man':[['Try another angle. No actual hanging upside down required.','换个角度，不必真的倒挂。'],['Waiting and avoiding are not quite the same thing.','等待和逃避，还是有一点区别的。']],
 'Death':[['Some chapters end so others can begin.','有些章节结束了，新的章节才有空间开始。'],['Change can take time. You do not have to rush it.','改变需要时间，不必催自己。']],
 'Temperance':[['Balance. Three coffees do not count as a balanced breakfast.','讲究平衡，三杯咖啡不算均衡早餐。'],['Make room for the middle ground. All or nothing is exhausting.','给中间地带留点空间，非黑即白太累了。']],
 'The Devil':[['Notice what keeps you hooked. Autoplay is suspicious.','留意让你停不下来的东西，自动播放很可疑。'],['One small boundary can make a difference.','一个小小的界限，也能带来改变。']],
 'The Tower':[['When something feels uncertain, take it one step at a time.','当一切不太确定时，一步一步来。'],['You do not need to rebuild everything today.','不用今天就把一切重新搭好。']],
 'The Star':[['Keep a little hope. It does not require a performance review.','留一点希望，不用给它做绩效考核。'],['Hope can be quiet. It does not have to sparkle on demand.','希望可以很安静，不必随叫随闪。']],
 'The Moon':[['Uncertainty is not an invitation to write twelve imaginary endings.','不确定，不代表要脑补十二个结局。'],['Look for clarity before filling in the blanks.','先找清楚事实，别急着自己补剧情。']],
 'The Sun':[['Enjoy the good bit. No need to ask when the next problem starts.','好好享受开心的时刻，别急着问下个麻烦什么时候来。'],['A small joy is still joy. No fireworks required.','小小的快乐也是快乐，不用放烟花。']],
 'Judgement':[['Reflect, then move on. This is not an annual appraisal.','反思，然后往前走，这不是年度考核。'],['Your inner critic does not need a megaphone.','内心的批评家不需要扩音器。']],
 'The World':[['Something is complete. Resist the urge to add one more deliverable.','一件事完成了，忍住别再加一个交付项。'],['Unfinished does not mean failed. Leave room for the next chapter.','没完成不代表失败，给下一章留点空间。']]
};
const tarotRoastMinor={
 'Four of Swords':[['Rest. Not refresh the chat.','宇宙让你休息，不是让你刷新聊天记录。'],['You may need a proper break, not another five-minute scroll.','你可能需要真正休息，不是再刷五分钟手机。']],
 'Eight of Pentacles':[['Your dedication is admirable. Your salary should probably be informed.','你的努力值得肯定，建议也通知一下你的工资。'],['Doing more is not always doing better.','做得更多，不一定做得更好。']],
 'Two of Cups':[['Connection is a two-person job.','双向奔赴，至少需要两个人。'],['A mismatch is worth a conversation, not a detective agency.','有分歧就聊聊，不必成立侦探社。']],
 'Seven of Cups':[['Too many options. Even the bubble tea menu has fewer decisions.','选项太多，奶茶菜单都没这么难选。'],['Choose what matters. No need to open another seventeen tabs.','选真正重要的，不用再开十七个网页。']],
 'Ten of Wands':[['You can put something down. You are not the luggage trolley.','可以放下一点，你又不是行李推车。'],['Ask for help. Carrying everything is not a personality test.','试着求助，什么都自己扛不是人格测试。']],
 'Nine of Swords':[['Be kind to yourself when thoughts feel overwhelming.','思绪太多的时候，记得对自己温柔一点。'],['A difficult night does not define your whole life.','难熬的一晚，不代表整个人生。']],
 'Three of Swords':[['Give yourself time and room to feel what hurts.','给自己时间和空间，慢慢感受那些难过。'],['Healing does not need a deadline.','疗愈不需要截止日期。']],
 'Five of Cups':[['It is okay to feel disappointed.','感到失望也没关系。'],['Notice what remains, without dismissing what you lost.','看看还在的东西，也别否定失去的难过。']]
};
const tarotSensitiveNames=new Set(['Death','The Tower','Nine of Swords','Three of Swords','Five of Cups','Ten of Swords','Five of Pentacles']);
const tarotTopicRoasts={
 0:{
 'The Hermit':[['A little time alone. The last-seen timestamp can manage itself.','独处一会儿，最后上线时间不用你亲自看守。'],['Space can help. Silence alone cannot tell you what somebody feels.','留点空间也好，沉默本身不能说明对方的心意。']],
 'The Lovers':[['Love involves choices. You are not a subscription someone forgot to cancel.','感情需要选择，你不是对方忘了取消的会员。'],['Different values deserve a real conversation, not a poll in the group chat.','价值观不同值得好好聊聊，不必在群里投票。']],
 'Four of Swords':[['Rest. Not refresh the chat.','休息，不是刷新聊天记录。'],['Put the phone down for a moment. Your peace deserves a turn.','先放下手机，也轮到自己清静一会儿了。']]
 },
 1:{
 'Eight of Pentacles':[['Your dedication is admirable. Your salary should probably be informed.','你的努力值得肯定，建议也通知一下你的工资。'],['Perfecting that spreadsheet for the ninth time may not be the answer.','第九次优化那张表格，可能不是答案。']],
 'The Emperor':[['Set a boundary. The meeting invite can survive a decline.','设个界限，拒绝会议邀请不会让它心碎。'],['Micromanaging your own break is still micromanaging.','连休息都要微观管理，还是微观管理。']],
 'Ten of Wands':[['Your job description is not a moving company. Put something down.','你的岗位说明书不是搬家公司，放下一点吧。'],['Ask for help. Overtime is not a collectible.','试着求助，加班又不是集卡。']]
 },
 2:{
 'Temperance':[['Find balance. Your cart and your budget should meet sometime.','找找平衡，购物车和预算也该认识一下了。'],['Pause before another purchase. No cosmic discount code today.','买之前先等等，今天没有宇宙折扣码。']],
 'Seven of Cups':[['Many options. Your wallet would prefer a shortlist.','选项很多，你的钱包比较希望有个候选名单。'],['Check the facts before choosing. A shiny offer is still an offer.','选择前先核对事实，再闪亮的优惠也只是优惠。']]
 }
};
function tarotCommentary(name,rev,topic,tone='gentle'){
 if(tone!=='playful')return null;
 const exact=tarotTopicRoasts[topic]?.[name]||tarotRoastMinor[name]||tarotRoastMajor[name];if(exact)return exact[rev?1:0];
 if(tarotSensitiveNames.has(name))return ['Take the time you need.','给自己需要的时间。'];
 const suit=(name.match(/\b(Cups|Wands|Swords|Pentacles)\b/i)||[])[1]?.toLowerCase();
 const generic={
  cups:[['Feelings deserve room. They do not need a status report.','感受需要空间，不用写进度报告。'],['Pause before interpreting every little signal.','别急着解读每个小信号。']],
  wands:[['A little momentum is enough. No need to become a motivational poster.','有一点行动力就够了，不必把自己活成励志海报。'],['Pace yourself. Even enthusiasm needs lunch.','慢一点，热情也需要吃午饭。']],
  swords:[['Think clearly. Your brain can close a few tabs.','理清思路，脑内网页可以关几个了。'],['A thought is not automatically a fact.','一个念头不一定就是事实。']],
  pentacles:[['Small practical steps count. Your future self appreciates receipts.','小小的实际行动也算数，未来的你会感谢现在的记录。'],['Check your resources before making another commitment.','再答应一件事之前，先看看自己的余力。']]
 };
 return generic[suit]?.[rev?1:0]||null
}
function tarotToneChoice(next){
 say(tr('Fortune Teller','占卜师'),tr('A little cosmic side-eye, or a quiet reading? You choose.','想被宇宙轻轻吐槽一下，还是安静读牌？你选。'),[
 [tr('A gentle roast, please','轻轻吐槽一下'),()=>{closeTalk();state.tarotTone='playful';next()}],
 [tr('Be kind today','今天温柔一点'),()=>{closeTalk();state.tarotTone='gentle';next()}]
 ])
}
const tarotMoodTopicBefore=readingTopic;
readingTopic=function(i){
 if(state.readStage!=='topic'||!Number.isInteger(i)||i<0||i>3)return tarotMoodTopicBefore(i);
 const active=state,finish=(gentle)=>{if(state!==active)return;closeTalk();if(gentle){state.tarotTone='gentle';tarotMoodTopicBefore(i)}else tarotToneChoice(()=>{if(state===active)tarotMoodTopicBefore(i)})};
 return say(tr('Fortune Teller','占卜师'),tr('What brought you here? You can keep the details to yourself.','今天为什么来？细节可以留在心里。'),[
 ...tarotMoodChoices[i].map((v,j)=>[tr(...v),()=>finish(j===2)]),
 [tr('My own question, quietly','心里有自己的问题'),()=>finish(true)],
 [tr('Back to the topics','返回主题'),closeTalk]
 ])
};
function tarotShareSnapshot(source){
 const cards=source.readCards||source.cards;if(!Array.isArray(cards)||![1,3,5].includes(cards.length)||!cards.every(v=>Number.isInteger(v?.i)&&tarotDeck[v.i]&&typeof v.rev==='boolean'))return null;
 return {cards:cards.map(v=>({i:v.i,rev:v.rev})),tone:source.tarotTone||source.tone||'gentle',topic:Number.isInteger(source.readTopic)?source.readTopic:Number.isInteger(source.topic)?source.topic:-1}
}
/* Painted assets are scene objects, not background decorations. Six original
   residents already have transparent WebP standing and portrait assets.
   Do not substitute another resident or the player's avatar when loading. */
const residentArtworkRecords=[
 {id:'temple-keeper',names:['Temple keeper','庙祝'],height:112},
 {id:'master-yue',names:['Master Yue','月师傅','Astrologer','命理师'],height:116},
 {id:'fortune-teller',names:['Fortune Teller','占卜师','Luna','月见'],height:116},
 {id:'auntie-mei',names:['Auntie Mei','梅姨'],height:110},
 {id:'wang-laoban',names:['Wang Laoban','王老板'],height:119},
 {id:'grandma',names:['Grandma','外婆','奶奶'],height:106},
 {"id":"ah-ma","names":["Ah Ma","Grumpy Ah Ma","阿嬷","暴躁阿嬷","阿嫲","阿嬤","打小人阿姨","打小人阿婆"],"height":104,"optional":true},
 {"id":"auntie-lin","names":["Auntie Lin","林姨"],"height":110,"optional":true},
 {"id":"auntie-hong","names":["Auntie Hong","红姐","洪姨"],"height":110,"optional":true},
 {"id":"garden-keeper","names":["Garden keeper","守园人","Caretaker","管理员"],"height":112,"optional":true},
 {"id":"boba-keeper","names":["Boba keeper","奶茶店主","Barista","店员"],"height":110,"optional":true},
 {"id":"arcade-keeper","names":["Arcade keeper","Arcade host","游戏厅老板","游戏厅店主","Keeper","店主"],"height":112,"optional":true},
 {"id":"souvenir-keeper","names":["Souvenir keeper","手信店主","Furniture keeper","家具店主"],"height":110,"optional":true}
];
const residentArtworkCache=new Map(),residentInstalledArt=new Map();
const residentIdentityKey=v=>String(v??'').normalize('NFKC').trim().toLowerCase();
function residentArtworkRecord(name){const names=Array.isArray(name)?name:[name];return residentArtworkRecords.find(v=>(!v.optional||residentInstalledArt.has(v.id))&&names.some(n=>v.names.some(a=>residentIdentityKey(a)===residentIdentityKey(n))))||null}
function residentAssetPath(id,kind){return 'assets/visual/painted/'+id+'/'+(kind==='standing'?'standing.webp':kind==='warm'?'expressions/warm.webp':'poses/'+kind+'.webp')}
function registerResidentArtwork(data){
 if(data?.version!==1||!data.residents||typeof data.residents!=='object')return 0;
 let count=0;
 for(const r of residentArtworkRecords){const row=data.residents[r.id];if(!row)continue;const checked={};
  for(const kind of ['standing','warm','seated','scolding']){const v=row[kind];if(v?.path===residentAssetPath(r.id,kind)&&Number.isInteger(v.width)&&Number.isInteger(v.height)&&v.width>0&&v.height>0&&v.width<=2048&&v.height<=2048&&/^[a-f0-9]{64}$/.test(v.sha256||''))checked[kind]=v}
  if(checked.standing&&checked.warm){residentInstalledArt.set(r.id,checked);count++}
 }return count
}
// Optional characters are requested only after their validated manifest exists.
fetch('assets/visual/painted/runtime.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(data=>registerResidentArtwork(data)).catch(()=>{});
function residentArtworkImage(record,portrait=false){
 if(!record)return null;const kind=typeof portrait==='string'?portrait:portrait?'warm':'standing',meta=residentInstalledArt.get(record.id)?.[kind];
 if((record.optional||!['standing','warm'].includes(kind))&&!meta)return null;
 const key=record.id+':'+kind;
 if(!residentArtworkCache.has(key)){const im=new Image();im.decoding='async';residentArtworkCache.set(key,im);im.src=residentAssetPath(record.id,kind)}
 const im=residentArtworkCache.get(key);if(meta&&im.complete&&(im.naturalWidth!==meta.width||im.naturalHeight!==meta.height))return null;return im
}
function residentArtworkRect(record,im,x,y,scale){
 if(!record||!im?.naturalWidth||!im.naturalHeight||![x,y,scale].every(Number.isFinite)||scale<=0)return null;
 const h=record.height*scale,w=h*im.naturalWidth/im.naturalHeight;return {x:x-w/2,y:y-h,w,h}
}
function drawResidentRaster(im,x,y,height,facing='right',breath=0){
 if(!im?.complete||!im.naturalWidth||!im.naturalHeight||![x,y,height].every(Number.isFinite)||height<=0)return false;
 const w=height*im.naturalWidth/im.naturalHeight;
 ctx.save();try{ellipse(x,y+1,Math.min(25,w*.32),Math.max(2,height*.035),'#342e2540');ctx.translate(x,y);ctx.scale(facing==='left'?-1:1,1);const h=height*(1+Math.max(-.006,Math.min(.006,breath)));ctx.drawImage(im,-w/2,-h,w,h)}finally{ctx.restore()}return true
}
const residentOriginalMapDraw=drawPaintedResident;
drawPaintedResident=function(n,scale,moving,facing){
 const record=residentArtworkRecord(n?.n||[]);
 if(!record)return residentOriginalMapDraw(n,scale,moving,facing);
 const im=residentArtworkImage(record);
 if(facing==='left'||facing==='right')n.paintedFacing=facing;
 // A tiny anchored idle breath is not a walking animation.
 const breath=!moving&&!residentReducedMotion.matches?Math.sin(t*1.8+n.x*.013)*.004:0;
 if(drawResidentRaster(im,n.x,n.y,94*scale,n.paintedFacing||facing,breath))return true;
 // Existing raster atlas is the same identity and may finish loading first.
 if(residentOriginalMapDraw(n,scale,moving,facing))return true;
 // Existing optional hosts keep their interim rendering until original art loads.
 return !record.optional
};
function drawGatheringPainted(name,x,y,scale=1,facing='right'){
 const record=residentArtworkRecord(name),im=residentArtworkImage(record),rect=residentArtworkRect(record,im,x,y,scale);
 if(!im?.complete||!rect)return false;
 return drawResidentRaster(im,x,y,rect.h,facing)
}
const gatheringPaintedBefore=gatheringResident;
gatheringResident=function(name,x,y,scale,facing,kind){
 if(residentArtworkRecord(name)){if(drawGatheringPainted(name,x,y,scale,facing)||drawPaintedResident({x,y,n:name},scale,false,facing))return}
 return gatheringPaintedBefore(name,x,y,scale,facing,kind)
};
let residentPortraitRequest=0;
const paintedGatheringSayBefore=say;
say=function(name,...args){
 const request=++residentPortraitRequest;
 const result=paintedGatheringSayBefore(name,...args),record=residentArtworkRecord(name);
 if(!record)return result;const portrait=$('talkPortrait'),im=residentArtworkImage(record,true);if(!portrait)return result;
 if(!im){portrait.hidden=true;return result}
 const apply=()=>{if(request===residentPortraitRequest&&talkOpen&&dialogueSpeakerMatches($('speaker').textContent,{n:[String(name)]})&&im.complete&&im.naturalWidth){portrait.src=im.src;portrait.hidden=false;portrait.classList.add('paintedResidentPortrait');requestAnimationFrame(syncCharacterSpeech)}};
 portrait.hidden=true;if(im.complete){if(im.naturalWidth)apply()}else im.addEventListener('load',apply,{once:true});return result
};
// Indoor hosts stand clear of the work surface and approach lane. The same
// anchors are used for dialogue placement. All geometry is in room coordinates.
const roomResidentStations={
 tea:{station:'board',x:629,y:582,n:['Auntie Hong','红姐'],sc:.88,facing:'left'},
 park:{station:'pet',x:595,y:572,n:['Auntie Lin','林姨'],sc:.90,facing:'left'},
 wishes:{station:'wishes',x:155,y:565,n:['Garden keeper','守园人'],sc:.9,facing:'right'},
 boba:{station:'bubbleTea',x:245,y:579,n:['Boba keeper','奶茶店主'],sc:.94,facing:'right'},
 arcade:{station:'bubbleArcade',x:148,y:590,n:['Arcade keeper','游戏厅店主'],sc:.87,facing:'right'},
 mystery:{station:'mystery',x:582,y:590,n:['Souvenir keeper','手信店主'],sc:.92,facing:'left'}
};
function roomResidentActors(){
 if(activity)return [];
 if(room==='fish')return [{x:159,y:474,n:['Ah Ma','阿嬷'],sc:1.45}];
 const actor=roomResidentStations[room];
 return actor&&residentArtworkRecord(actor.n)?[actor]:[];
}
const roomResidentPropBefore=prop;
prop=function(id,x,y){
 const actor=roomResidentStations[room];
 if(actor?.station===id)drawGatheringPainted(actor.n,actor.x,actor.y,actor.sc,actor.facing);
 return roomResidentPropBefore(id,x,y);
};
const paintedGatheringIntroBefore=roomIntro;
roomIntro=function(){
 const residents={tea:['auntie-mei','auntie-lin','auntie-hong','grandma','wang-laoban','master-yue'],tarot:['fortune-teller'],destiny:['master-yue'],temple:['temple-keeper'],kitchen:['grandma'],office:['wang-laoban'],park:['auntie-mei','auntie-lin'],fish:['ah-ma'],wishes:['garden-keeper'],arcade:['arcade-keeper'],mystery:['souvenir-keeper'],boba:['boba-keeper','auntie-mei','grandma','wang-laoban','master-yue']}[room]||[];
 for(const key of residents){const record=residentArtworkRecords.find(v=>v.id===key);residentArtworkImage(record);residentArtworkImage(record,true);if(key==='ah-ma'){residentArtworkImage(record,'seated');residentArtworkImage(record,'scolding')}}
 return paintedGatheringIntroBefore()
};
// Only approved, dedicated seated/scolding artwork may replace the pier host.
// Keep the existing seated placeholder if the matching pose is not installed.
const originalAhMaPose=drawProductionAhMa;
drawProductionAhMa=function(x,y,scale=1){const r=residentArtworkRecord('Ah Ma'),mood=townAhMaMood(activity,t-stressSwingAt,t-(state?.riverAt??-100),stressCombo,state?.riverPhase);const seated=residentArtworkImage(r,'seated'),scolding=mood==='scold'&&residentArtworkImage(r,'scolding');if(drawResidentRaster(scolding,x,y,205*scale,'right')||drawResidentRaster(seated,x,y,205*scale,'right'))return true;return originalAhMaPose(x,y,scale)};



/* Destiny House: a reading subject is deliberately local to the open page.
   A date-only reading must not quietly invent a time or birthplace. */
function destinyBirthValid(date,min,today){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<min||date>today)return false;
 const v=new Date(date+'T12:00:00Z');return Number.isFinite(+v)&&v.toISOString().slice(0,10)===date
}
/* PAW_YUE_INPUT_BEGIN */
function destinyFullValid(v,today){
 if(!v||!destinyBirthValid(v.date,'1900-01-02',today)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time||'')||!/^(?:[0-7]|custom)$/.test(v.place||''))return false;
 const values=[v.offset,v.lat,v.lon];
 if(!values.every(n=>typeof n==='string'&&n.trim()!==''&&Number.isFinite(Number(n))))return false;
 const [offset,lat,lon]=values.map(Number);
 return offset>=-12&&offset<=14&&Number.isInteger(offset*4)&&lat>=-66&&lat<=66&&lon>=-180&&lon<=180
}
function pawYueDraftPlace(draftPlace,storedPlace,values,hasDraft){
 if(hasDraft)return /^(?:[0-7]|custom)$/.test(draftPlace||'')?draftPlace:'';
 if(storedPlace&&/^(?:[0-7]|custom)$/.test(storedPlace))return storedPlace;
 if(!values.every(n=>typeof n==='string'&&n.trim()!==''&&Number.isFinite(Number(n))))return '';
 const locations=[[8,1.35,103.82],[8,30.27,120.16],[8,31.23,121.47],[8,39.9,116.4],[8,22.32,114.17],[8,3.14,101.69],[8,25.03,121.57],[9,35.68,139.69]];
 const i=locations.findIndex(row=>row.every((v,k)=>v===Number(values[k])));
 return i<0?'custom':String(i)
}
/* PAW_YUE_INPUT_END */
const yueFriendsPalace=chartConsultTopics.find(v=>v.name?.[0]==='Friends & support');
if(yueFriendsPalace)yueFriendsPalace.k=7;
function destinySubjectControls(parent,subject,onSelect){
 const strip=element('section','',parent,'destinySubjectStrip');
 element('small',tr('Who are we reading for?','今天替谁看？'),strip);
 const row=element('div','',strip,'destinySubjectChoices');
 for(const [id,en,cn] of [['self','Myself','我自己'],['other','Someone else','其他人']]){
  const button=b(row,tr(en,cn),()=>{if(id!==subject)onSelect(id)});
  button.type='button';button.setAttribute('aria-pressed',String(id===subject));
 }
 element('small',subject==='other'?tr('Use their details only with permission. No names are needed.','请先征得对方同意，不需要填写姓名。'):tr('A private moment to explore your own chart.','给自己一点时间，私下探索自己的命盘。'),strip);
 return strip
}
function destinyChartValues(form){
 const date=form.querySelector('input[type=date]'),time=form.querySelector('input[type=time]'),place=form.querySelector('details select'),nums=[...form.querySelectorAll('input[type=number]')];
 return {date:date?.value||'',time:time?.value||'',place:place?.value||'',offset:nums[0]?.value||'',lat:nums[1]?.value||'',lon:nums[2]?.value||''}
}

// Direct controls on every consultation page; no need to return to the hub
// just to remove the current person's private details.
const pawYueReturnPrivacyBefore=yueReturnControls;
yueReturnControls=function(q,render,switchView=render){
 const result=pawYueReturnPrivacyBefore(q,render,switchView),strip=q.querySelector('.yueSubjectStrip');
 if(!strip)return result;
 const note=element('small',yueSubject==='other'?tr('Use their birth details only with permission. They stay in this open tab.','请先征得对方同意。生辰资料只暂存在此页面。'):tr('Birth details stay in this open tab.','生辰资料只暂存在此页面。'),strip,'pawYuePrivacy');
 const subject=yueSubject;
 const clear=b(strip,tr('Clear this reading','清除本次资料'),()=>{
  if(!strip.isConnected||yueSubject!==subject)return;
  yueClearProfile(subject);switchView()
 });
 clear.type='button';clear.className='pawYueClear';return result
};
/* Single authoritative reading session. Retain explicit birthplace selection
   and privacy, without rendering a second subject chooser or welcome panel. */
const destinyCompactChartBefore=destinyPage, destinyCompactAlmanacBefore=yueZodiacAlmanac;
function yueCompactPage(q,form,out){
 q.classList.add('yueCompactConsult');
 const intro=q.querySelector(':scope > p');if(intro)intro.classList.add('yueCompactIntro');
 // Keep the chamber node for existing chart styling, but remove the obsolete
 // full-height vector room and actor. The reading is the primary activity.
 const hero=q.querySelector('.destinyChamber');
 if(hero){hero.hidden=true;hero.querySelectorAll('.roomArtWrap,.yueActor').forEach(node=>node.remove())}
 const navRow=q.querySelector(':scope > .row');
 let title=q.querySelector(':scope > h1');
 if(!title){title=element('h1',tr('Master Yue · Birth chart','月师傅 · 生辰命盘'),q);navRow?.after(title)}
 if(hero)title.textContent=tr('Master Yue · Birth chart','月师傅 · 生辰命盘');
 const header=element('div','',q,'yueCompactHost'),im=element('img','',header);
 im.src=residentAssetPath('master-yue','warm');im.alt=tr('Master Yue','月师傅');im.width=120;im.height=98;im.onerror=()=>im.remove();
 const words=element('div','',header);element('strong',tr('Master Yue','月师傅'),words);
 element('small',residentNamedGreeting('Sit, have some tea. The stars can wait, unlike your boss.','坐下喝杯茶。星星不催你，老板就不一定了。'),words);
 const strip=q.querySelector('.yueSubjectStrip');if(strip){title.after(strip);strip.after(header)}else title.after(header);
 const nav=q.querySelector('.row');if(nav)nav.classList.add('yueStickyNav');
 const submit=form.querySelector('button[type=submit]');
 if(submit)submit.classList.add('yuePrimarySubmit');
 if(out)out.classList.add('yueReadingOutput');
 let manual=false;form.addEventListener('submit',()=>{if(!out?.querySelector('.ziGrid,.yueReadingFront'))return;if(!manual)return;requestAnimationFrame(()=>{if(out.isConnected)out.scrollIntoView({block:'start',behavior:residentReducedMotion.matches?'instant':'smooth'})})});
 if(submit)submit.addEventListener('click',()=>{manual=true});
 // Remove duplicate long introductory copy, not the chart or its disclaimer.
 if(intro&&intro.textContent.length>140)intro.hidden=true;
}
destinyPage=function(edit=false,selectedTopic=null,draft=null){
 let draftPlace=null;
 if(edit&&typeof edit==='object'){
  const opt=edit;if(opt.subject==='self'||opt.subject==='other')yueSubject=opt.subject;
  const d=opt.draft;draftPlace=d?.place??null;
  draft=d?[d.date||'',d.time||'',d.offset||'',d.lat||'',d.lon||'']:null;edit=!opt.render;selectedTopic=null
 }
 destinyCompactChartBefore(edit,selectedTopic,draft);
 const q=$('content'),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');if(!form)return;
 yueCompactPage(q,form,out);
 const profile=yueProfile(),subject=yueSubject,date=form.querySelector('input[type=date]'),time=form.querySelector('input[type=time]'),place=form.querySelector('details select'),nums=[...form.querySelectorAll('input[type=number]')];
 if(!date||!time||!place||nums.length!==3)return;
 const hasDraft=Array.isArray(draft)&&draft.length===5,detail=place.closest('details'),summary=detail?.querySelector('summary');
 if(!profile.chart&&!hasDraft){if(profile.date)date.value=profile.date;time.value='';nums.forEach(n=>n.value='')}
 const empty=element('option',tr('Select actual birthplace','选择实际出生地'),place);empty.value='';place.prepend(empty);place.required=true;
 place.value=pawYueDraftPlace(draftPlace,profile.chart?.place,nums.map(n=>n.value),hasDraft);
 const syncPlace=()=>{
  if(summary)summary.textContent=place.value?tr('Birthplace: ','出生地：')+(place.selectedOptions[0]?.textContent||''):tr('Birthplace','出生地');
 };
 syncPlace();if(detail&&(!profile.chart||hasDraft||!place.value))detail.open=true;
 const oldChange=place.onchange;
 place.onchange=function(e){
  if(place.value==='custom'||!place.value){nums.forEach(n=>n.value='');if(detail)detail.open=true}
  else if(oldChange)oldChange.call(place,e);
  syncPlace()
 };
 const note=element('small',tr('Use the actual local birth time and historical UTC offset. Preset cities are starting values.','请使用当地实际出生时间及当时的时区差。城市预设仅供参考。'),q,'yueSessionNote');form.after(note);
 const status=element('p','',form,'pawYueInputError');status.setAttribute('role','alert');status.hidden=true;
 function clearError(){status.hidden=true;status.textContent=''}
 form.addEventListener('input',clearError);form.addEventListener('change',clearError);
 // Capture before the legacy calculator and its submit listeners. Invalid
 // input never produces or replaces a chart, including synthetic submits.
 form.addEventListener('submit',e=>{
  if(!form.isConnected||yueSubject!==subject||yueProfile()!==profile||!destinyFullValid(destinyChartValues(form),shrineClock().day)){
   e.preventDefault();e.stopImmediatePropagation();
   status.hidden=false;status.textContent=tr('Enter a valid birth date, known local time, birthplace and historical UTC offset.','请填写有效出生日期、已知当地出生时间、出生地及当时的时区差。');
   if(detail)detail.open=true;return
  }
  clearError()
 },true);
 form.addEventListener('submit',()=>{
  if(profile.chart&&out?.querySelector('.ziGrid'))profile.chart.place=place.value
 });
 const language=q.querySelector('.row')?.lastElementChild;
 if(language)language.onclick=()=>{
  const d=form.hidden?null:destinyChartValues(form);
  zh=!zh;save('zh',zh);document.documentElement.lang=zh?'zh':'en';updateHUD();
  if(d)destinyPage({subject,draft:d});else destinyPage()
 };
 const editButton=[...q.querySelectorAll('.yueChartTools button')].find(v=>v.textContent===tr('Edit birth details','修改生辰资料'));
 if(editButton)editButton.addEventListener('click',()=>{if(out)out.replaceChildren()});
 if(yueSubject==='other'&&out?.querySelector('.ziGrid'))out.setAttribute('aria-label',tr('Reading for someone else, not a prediction','他人命盘，仅供反思'));
};
yueZodiacAlmanac=function(birth='',selection=null,options={}){
 if(options.subject==='self'||options.subject==='other')yueSubject=options.subject;
 destinyCompactAlmanacBefore(birth,selection);
 const q=$('content'),form=q.querySelector('.yueAlmanacForm'),out=q.querySelector('.yueAlmanacPaper');if(!form)return;
 yueCompactPage(q,form,out);
 const submit=form.querySelector('button[type=submit]');if(submit)submit.textContent=yueSubject==='other'?tr('Read their year','看看对方流年'):tr('Read my year','看看我的流年');
 const toolbar=q.querySelector('.yueChartTools');if(toolbar){b(toolbar,tr('Full birth chart','完整命盘'),()=>destinyPage());b(toolbar,tr('Weekly star signs','本周星座'),()=>starSignPage())}
};
destinyConsultMenu=function(){closeTalk();yueZodiacAlmanac()};
// Stable text, not a per-frame DOM rebuild. Full destination remains accessible.
const compactRailLabelBefore=travellerRailLabel;
travellerRailLabel=function(){
 const route=travellerSuggestedRoute,valid=route&&travellerRouteDoor(route),local=valid&&route.district===scene;
 const destination=local?travellerRouteName(route):tr(...maps[valid?route.district:railNextDistrict(scene)].n);
 return (local?tr('Explore','去探索'):tr('Next stop','下一站'))+'\n'+destination+' ›'
};
const compactRailHUDBefore=updateHUD;
updateHUD=function(){compactRailHUDBefore();const label=compactRailLabelBefore();if(nextStopButton.getAttribute('aria-label')!==label)nextStopButton.setAttribute('aria-label',label);nextStopButton.title=label};
const compactConsultPageBefore=page;
page=function(...args){$('content').classList.remove('yueCompactConsult');return compactConsultPageBefore(...args)};
const compactConsultStyle=document.createElement('style');compactConsultStyle.textContent=`
#content .pawYuePrivacy{flex-basis:100%;font-size:12px;line-height:1.45}
#content .pawYueClear{min-height:44px;font-size:12px;white-space:normal}
#content .pawYueInputError{margin:0;color:#843d32;font-size:13px;line-height:1.45}
#content .pawYueInputError[hidden]{display:none!important}

#content.yueCompactConsult .yueStickyNav{position:sticky;top:0;z-index:2;background:#f2e6cd;padding:5px 0;border-bottom:1px solid #b6a07b}
#content.yueCompactConsult>h1{font-size:clamp(22px,5.5vw,32px)!important;margin:8px 0 4px!important;line-height:1.2}
#content.yueCompactConsult>.yueCompactIntro{font-size:12px!important;line-height:1.35!important;margin:4px 0 8px!important}
.yueCompactHost{display:flex;gap:9px;align-items:center;padding:5px 0 8px;border-bottom:1px solid #b6a07b;margin:3px 0 7px;color:#455d4e}
.yueCompactHost img{width:68px;height:68px;max-width:24%;object-fit:contain;flex:none;mix-blend-mode:multiply}.yueCompactHost>div{min-width:0}.yueCompactHost strong,.yueCompactHost small{display:block;line-height:1.35}.yueCompactHost strong{font:600 16px Georgia,'Songti SC',serif}.yueCompactHost small{font-size:13px;overflow-wrap:anywhere}
#content.yueCompactConsult .destinyChamber,#content.yueCompactConsult .destinyChamber .roomArtWrap{display:none!important;height:0!important;min-height:0!important}
@media(max-width:480px){#content.yueCompactConsult{padding:10px!important}.yueCompactHost{margin:3px 0 5px;padding:4px 0 6px}.yueCompactHost img{width:60px;height:60px}#content.yueCompactConsult>h1{margin:5px 0 3px!important}.yueCompactConsult .yueChartTools button{flex:1 1 94px}}
#content.yueCompactConsult .yueSubjectStrip{padding:4px 7px;margin:5px 0!important;gap:4px}.yueCompactConsult .yueSubjectStrip button{min-height:44px}
#content.yueCompactConsult .yueChartTools{margin:5px 0!important;gap:5px}.yueCompactConsult .yueChartTools button{padding:6px 8px!important;font-size:12px!important;min-height:44px}
#content.yueCompactConsult .astroForm,#content.yueCompactConsult .yueAlmanacForm{margin:8px 0!important;padding:10px!important;gap:8px!important}
.yueCompactConsult .astroForm input,.yueCompactConsult .astroForm select,.yueCompactConsult .yueAlmanacForm input,.yueCompactConsult .yueAlmanacForm select{font-size:16px!important;min-height:44px;max-width:100%;box-sizing:border-box}
.yueCompactConsult .yuePrimarySubmit{min-height:48px;background:#425c4d!important;color:#fff0d0!important}
.yueCompactConsult .destinyChamber[hidden]{display:none!important}.yueReadingOutput{scroll-margin-top:68px}
#nextStopShortcut:not([hidden]){position:absolute!important;right:10px!important;top:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 122px)!important;max-width:132px!important;width:auto!important;min-height:44px!important;display:block!important;white-space:pre-line!important;text-align:left;background:#efe0bc!important;border:1px solid #a88b5e!important;border-radius:4px!important;padding:5px 8px!important;box-shadow:0 2px 8px #2c261e40!important;color:#3e5849!important}
#nextStopShortcut:not([hidden]){font:600 12px/1.2 Georgia,"Songti SC",serif!important;overflow-wrap:anywhere}
@media(max-height:500px) and (orientation:landscape){#nextStopShortcut:not([hidden]){bottom:68px!important;right:8px!important;max-width:120px!important}}
`;document.head.append(compactConsultStyle);


/* Resident recognition: local player name, contextual greetings, no fake
   shared presence or private birth-data references. One welcome per visit. */
const residentWelcomeProfiles=[
 {id:'temple',names:['Temple keeper','庙祝'],rooms:['temple','sticks','moon'],lines:[['Leave your worries by the door.','烦恼先放门口吧。'],['The incense is ready. Take your time.','香已备好，慢慢来。'],['No appointments with heaven today.','今天不用跟神明预约，慢慢来。'],['You can just breathe. No wish required.','不一定非要求什么，静静坐会儿也好。']]},
 {id:'tarot',names:['Fortune Teller','占卜师'],rooms:['tarot','daily'],lines:[['The cards are ready. Your inbox can wait.','牌都准备好了，工作消息先放一放。'],['What is on your mind today?','今天想问点什么呢？'],['Still waiting for that reply? Cards cannot read minds.','还在等那条消息吗？牌可不会读心术。'],['Career, love, or a mysterious desire for a nap?','事业、感情，还是那股神秘的午睡欲望？']]},
 {id:'yue',names:['Master Yue','月师傅','Astrologer','命理师'],rooms:['destiny'],lines:[['Come, have some tea. The stars can wait.','来，喝口茶，星星不催你。'],['Love, work, or a little clarity today?','今天想聊感情、工作，还是理理思绪？'],['The stars have no deadlines. A rare luxury.','星星没有截止日期，真是难得。'],['Read for yourself or someone else. Take your time.','看自己或别人都可以，慢慢来。']]},
 {id:'garden',names:['Garden keeper','守园人','Caretaker','管理员'],rooms:['wishes'],lines:[['There is room for another wish.','这里还有地方挂你的心愿。'],['No wish is too small.','小小的心愿也值得被记住。']]},
 {id:'grandma',names:['Grandma','外婆','奶奶'],rooms:['kitchen'],lines:[['Come eat. You look like someone who skipped lunch.','来吃饭啦。忙起来是不是又忘了吃饭？'],['I saved you a bowl.','给你留了一碗呢。'],['Soup first. Work problems can wait outside.','先喝汤，工作的烦心事在外面等着。'],['The only thing simmering here should be the soup.','在这里，只有汤需要慢慢熬。']]},
 {id:'mei',names:['Auntie Mei','梅姨'],rooms:['tea'],lines:[['Sit here. I have tea and possibly too much news.','来坐这边，有茶，还有一点点八卦。'],['Good to see you. How has your day been?','见到你真好，今天过得怎样？']]},
 {id:'hong',names:['Auntie Hong','红姐','洪姨'],rooms:[],lines:[['Come sit. I have a story for you.','来坐坐，有个故事跟你说。'],['What have I missed?','最近有什么新鲜事呀？']]},
 {id:'wang',names:['Wang Laoban','王老板'],rooms:['office'],lines:[['Relax. This meeting could have been an email.','放轻松，这个会本来发封邮件就行。'],['No performance review today. Promise.','今天不谈绩效，说好了。']]},
 {id:'ahma',names:['Ah Ma','阿嬷','阿嫲','阿嬤','打小人阿姨','打小人阿婆','Grumpy Ah Ma','暴躁阿嬷'],rooms:['fish'],lines:[['Who has been making your blood boil today?','今天又是谁惹你生气啦？'],['Sit down. We can leave the drama here.','来坐坐，把那些破事留在这里。'],['The slipper has office hours. Luckily, they are flexible.','拖鞋也有上班时间，不过可以弹性打卡。'],['No need to explain everything. The river can listen.','不用把来龙去脉都讲清楚，河水会听你说。']]},
 {id:'lin',names:['Auntie Lin','林姨'],rooms:['park'],lines:[['The animals are taking their sweet time. So can you.','小动物都慢悠悠的，你也可以。'],['Come see who is out in the meadow today.','来看看今天草地上有哪些小可爱。']]},
 {id:'arcade',names:['Keeper','店主','Arcade keeper','游戏厅老板','Arcade host','游戏厅店主'],rooms:['arcade'],lines:[['Ready to beat your own score?','今天要不要刷新自己的纪录？'],['The claw owes you nothing. But give it a go.','夹爪可不欠你的，不过试试嘛。']]},
 {id:'boba',names:['Boba keeper','奶茶店主','Pearl & Pause','珍珠摸鱼铺','Barista','店员'],rooms:['boba'],lines:[['A little tea break? You have earned one.','喝杯奶茶歇一歇吧。'],['Less ice, more peace?','少冰，多一点好心情？'],['The only thing we are shaking today is bubble tea.','今天只摇奶茶，不摇摆人生。'],['Your drink, your rules. No approval chain.','自己的奶茶自己做主，不用逐级审批。']]},
 {id:'souvenir',names:['Souvenir keeper','手信店主','Furniture keeper','家具店主'],rooms:['mystery'],lines:[['Come browse. No need to buy anything.','随便看看，不买也没关系。'],['Find something that makes you smile.','看看有没有让你会心一笑的小东西。']]},
 {id:'lab',names:['Lab keeper','研究所店主','Personality guide','人格向导','Researcher','研究员'],rooms:['quiz'],lines:[['Curious about yourself? No homework here.','想多了解自己？这里不交作业。'],['There is no perfect answer.','没有标准答案，做自己就好。']]},
 {id:'story',names:['Storyteller','说书人','故事向导'],rooms:[],lines:[['Another little adventure awaits.','又有一段小故事等着你。'],['What would you do differently this time?','这一次，你会怎么选呢？']]},
 {id:'cafe',names:['Café keeper','Cafe keeper','咖啡店主'],rooms:[],lines:[['Let us make some space for the heart.','给心里的人留一点时间吧。'],['Tea first, overthinking later.','先喝茶，晚点再胡思乱想。']]}
];
const residentWelcomeVisits=new Map(),residentWelcomeSpoken=new Set(),residentOutdoorWelcome=new Map();
const residentVisitorWelcome=new Map();
function residentPlayerDisplayName(){
 return Array.from(Array.from(String(playerName||'')).filter(ch=>ch.codePointAt(0)>=32&&ch.codePointAt(0)!==127).join('').trim()).slice(0,24).join('')
}
function residentNamedGreeting(en,cn){
 const name=residentPlayerDisplayName();return name?tr('Hi '+name+'! '+en,name+'，'+cn):tr(en,cn)
}
function residentWelcomeFor(name){
 const key=String(name).trim().toLowerCase();
 return residentWelcomeProfiles.find(v=>v.names.some(n=>n.toLowerCase()===key))||null
}
function residentWelcomeLine(profile,count){
 const pair=profile.lines[Math.max(0,count-1)%profile.lines.length];return residentNamedGreeting(...pair)
}

/* Small local hospitality history; never store chat text or birth details. */
const residentHospitalityKey='residentHospitalityV1';
const residentHospitalityRaw=load(residentHospitalityKey,{});
const residentHospitality={visits:Object.create(null),drink:null,soup:null};
function residentRecipeValid(v){
 return !!v&&Number.isInteger(v.base)&&v.base>=0&&v.base<teaChoices.length&&pearlSugar.some(a=>a[0]===v.sugar)&&pearlIce.some(a=>a[0]===v.ice)&&pearlToppings.some(a=>a[0]===v.topping)
}
if(residentHospitalityRaw&&typeof residentHospitalityRaw==='object'){
 for(const p of residentWelcomeProfiles){const n=residentHospitalityRaw.visits?.[p.id];if(Number.isInteger(n)&&n>0)residentHospitality.visits[p.id]=Math.min(n,9999)}
 if(residentRecipeValid(residentHospitalityRaw.drink))residentHospitality.drink=residentHospitalityRaw.drink;
 const soup=residentHospitalityRaw.soup;
 if(Array.isArray(soup)&&soup.length===2&&soup.every(v=>typeof v==='string'&&v.length<=60))residentHospitality.soup=soup;
}
function residentHospitalitySave(){save(residentHospitalityKey,residentHospitality)}
function residentDrinkSummary(v){
 if(!residentRecipeValid(v))return '';
 return [tr(...teaChoices[v.base].slice(0,2)),pearlLabel(pearlSugar,v.sugar),pearlLabel(pearlIce,v.ice),pearlLabel(pearlToppings,v.topping)].join(' · ')
}
function residentHospitalityWelcome(profile,visits,hour=new Date().getHours()){
 if(profile.id==='boba'&&residentHospitality.drink&&visits%2===0){
  const v=residentHospitality.drink,base=teaChoices[v.base];return residentNamedGreeting('Fancy your '+base[0]+' again?','上次喝的'+base[1]+'，今天还想来一杯吗？')
 }
 if(profile.id==='grandma'&&residentHospitality.soup&&visits%2===0){
  const [en,cn]=residentHospitality.soup;return residentNamedGreeting('Another bowl of '+en+' today?','今天还想喝'+cn+'吗？')
 }
 if(visits>1&&visits%3===0){
  if(profile.id==='wang')return residentNamedGreeting('Back again? I will pretend I did not see you clock out.','又见面啦？就当我没看见你溜出来摸鱼。');
  return residentNamedGreeting('Good to see you again. '+(hour<12?'A little break before lunch?':hour>=18?'Long day? Make yourself at home.':'Take your time today.'),hour<12?'又见面啦，午饭前偷个闲？':hour>=18?'回来啦，今天辛苦了，慢慢坐。':'又见面啦，今天慢慢来。')
 }
 return residentWelcomeLine(profile,visits)
}
const residentPearlFinishBefore=pearlAdvance;
pearlAdvance=function(){
 const q=state,wasSaved=q?.teaSaved,result=residentPearlFinishBefore();
 if(activity==='bubbleTea'&&q===state&&!wasSaved&&q.teaSaved&&!q.teaOrder){
  const v={base:q.teaBase,sugar:q.teaSugar,ice:q.teaIce,topping:q.teaTopping};if(residentRecipeValid(v)){residentHospitality.drink=v;residentHospitalitySave()}
 }
 return result
};
// Remember only a soup that was actually tasted, not an interrupted animation.
const residentTastedDrawBefore=drawActivity;
drawActivity=function(){
 const q=state,wasTasted=q?.tasted,result=residentTastedDrawBefore();
 if(activity==='cook'&&q===state&&!wasTasted&&q.tasted&&q.done&&Array.isArray(q.recipe)&&q.recipe.length===2){
  residentHospitality.soup=q.recipe.slice(0,2);residentHospitalitySave()
 }
 return result
};
const residentPearlPanelBefore=syncPearlPanel;
syncPearlPanel=function(){
 const result=residentPearlPanelBefore();
 if(pearlPanel.hidden||state.teaStage!=='order'||!residentRecipeValid(residentHospitality.drink)||pearlPanel.querySelector('.residentUsualDrink'))return result;
 const q=state,choice=residentHospitality.drink,group=element('div','',pearlPanel,'residentUsualDrink');
 element('small',tr('Last drink: ','上次喝的：')+residentDrinkSummary(choice),group);
 b(group,tr('Make my usual','再来上次那杯'),()=>{
  if(!pawFoodActionAllowed(q,state,'order',activity,pawArcadeInputBlocked())||!residentRecipeValid(choice))return;
  q.teaOrder=null;q.teaBase=choice.base;q.teaSugar=choice.sugar;q.teaIce=choice.ice;q.teaTopping=choice.topping;pearlStage('pourReady');sound(410);syncPearlPanel()
 });
 b(group,tr('Forget last drink','清除上次配方'),()=>{if(!pawFoodActionAllowed(q,state,'order',activity,pawArcadeInputBlocked()))return;residentHospitality.drink=null;residentHospitalitySave();group.remove()});
 return result
};
const residentHospitalityStyle=document.createElement('style');residentHospitalityStyle.textContent='.residentUsualDrink{border-top:1px solid #bd9e85;margin-top:7px;padding-top:4px;display:grid;grid-template-columns:1fr 1fr;gap:5px}.residentUsualDrink small{grid-column:1/-1}.residentUsualDrink button{min-height:44px;white-space:normal}';document.head.append(residentHospitalityStyle);

let residentEntryPending=null,residentLastWelcomeRoom=null,residentPendingWelcome=null;
const residentWelcomeEnterBefore=enter;
enter=function(id){residentPendingWelcome=null;if(id!=='station')residentEntryPending=id;return residentWelcomeEnterBefore(id)};
const residentPersonalIntroBefore=roomIntro;
roomIntro=function(){
 const result=residentPersonalIntroBefore();
 if(!room||activity)return result;
 clearTimeout(toastTimer);$('toast').classList.remove('on','residentArrival');
 const profile=residentWelcomeProfiles.find(v=>v.rooms.includes(room));if(!profile)return result;
 const fresh=residentEntryPending===room||residentLastWelcomeRoom!==room;
 if(!fresh)return result;
 residentEntryPending=null;residentLastWelcomeRoom=room;residentWelcomeSpoken.clear();
 const visits=Math.min(9999,(residentHospitality.visits[profile.id]||0)+1);residentHospitality.visits[profile.id]=visits;residentWelcomeVisits.set(profile.id,visits);residentHospitalitySave();
 // Keep the greeting for the first deliberate conversation, never overlay the room.
 residentPendingWelcome={room,id:profile.id,visits};return result
};
const residentPersonalSayBefore=say;
say=function(name,line,...rest){
 const profile=residentWelcomeFor(name),chosen=residentPlayerDisplayName(),now=Date.now();
 if(profile&&residentPendingWelcome?.room===room&&residentPendingWelcome.id===profile.id&&typeof line==='string'){
  const pending=residentPendingWelcome;residentPendingWelcome=null;residentWelcomeSpoken.add(profile.id);
  // Preserve the actual intentional conversation; avoid prepending a second scripted greeting.
   if(pending.visits>1&&pending.visits%4===0&&['grandma','boba'].includes(profile.id))line=residentHospitalityWelcome(profile,pending.visits)+'\n\n'+line;
 }
 if(profile&&chosen&&typeof line==='string'&&!line.startsWith('Hi '+chosen+'!')&&!line.startsWith(chosen+'，')){
  const already=room?residentWelcomeSpoken.has(profile.id):(now-(residentOutdoorWelcome.get(profile.id)||0)<300000);
  if(!already){if(room)residentWelcomeSpoken.add(profile.id);else residentOutdoorWelcome.set(profile.id,now)}
 }
 const result=residentPersonalSayBefore(name,line,...rest);
 // Generic avatar badges are not portraits of residents. Until the actual
 // host's painted asset is available, use a named, text-only conversation.
 if(profile&&!residentArtworkRecord(name)){
  const portrait=$('talkPortrait');if(portrait){portrait.hidden=true;portrait.classList.remove('paintedResidentPortrait')}
 }
 return result
};


/* A room hello is readable, temporary and never intercepts movement. */
const residentGreetingToastBefore=toast;
toast=function(message){$('toast').classList.remove('residentArrival');return residentGreetingToastBefore(message)};
function clearResidentGreeting(){
 const el=$('toast');if(!el.classList.contains('residentArrival'))return;
 clearTimeout(toastTimer);el.classList.remove('residentArrival','on')
}
function residentGreetingToast(message){
 toast(message);const el=$('toast');el.classList.add('residentArrival');el.setAttribute('role','status');el.setAttribute('aria-live','polite');
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>{el.classList.remove('on','residentArrival')},Math.min(6400,Math.max(3800,2200+Array.from(message).length*38)))
}
const residentGreetingStartBefore=start;
start=function(...args){clearResidentGreeting();return residentGreetingStartBefore(...args)};
const residentGreetingEnterBefore=enter;
enter=function(...args){clearResidentGreeting();return residentGreetingEnterBefore(...args)};
const residentGreetingSayBefore=say;
say=function(...args){clearResidentGreeting();return residentGreetingSayBefore(...args)};
const residentGreetingJourneyBefore=journey;
journey=function(...args){clearResidentGreeting();return residentGreetingJourneyBefore(...args)};
const residentGreetingBackBefore=$('back').onclick;
$('back').onclick=function(...args){clearResidentGreeting();return residentGreetingBackBefore.apply(this,args)};
const residentGreetingPageBefore=page;
page=function(...args){clearResidentGreeting();return residentGreetingPageBefore(...args)};
const residentGreetingCss=document.createElement('style');residentGreetingCss.textContent=`
#game #toast.residentArrival{max-width:min(82vw,360px)!important;width:max-content!important;box-sizing:border-box;white-space:normal!important;overflow-wrap:anywhere;line-height:1.45!important;font-size:13px!important;padding:8px 12px!important;pointer-events:none!important;text-align:center}
@media(max-width:480px){#game #toast.residentArrival{top:calc(env(safe-area-inset-top,0px) + 104px)!important;right:10px!important;left:auto!important;transform:none!important;max-width:calc(100vw - 130px)!important;font-size:12px!important}}
@media(prefers-reduced-motion:reduce){#game #toast.residentArrival{transition:none!important}}
`;document.head.append(residentGreetingCss);

// Fictional NPCs can recognise the local player. Never modify real peer dialogue.
const residentVisitorTalkBefore=npcTalk;
npcTalk=function(n){
 const result=residentVisitorTalkBefore(n);
 if(!n?.n||n.sharedPeer||n.kind===2||!talkOpen)return result;
 const name=tr(...n.n),chosen=residentPlayerDisplayName(),speaker=$('speaker')?.textContent,line=$('line');
 if(!chosen||residentWelcomeFor(name)||!line||!(speaker===name||speaker===name+' · '+tr('Guest','客串')))return result;
 const key=String(n.n[0]),now=Date.now();if(now-(residentVisitorWelcome.get(key)||0)<300000)return result;
 if(line.textContent.startsWith('Hi '+chosen+'!')||line.textContent.startsWith(chosen+'，'))return result;
 if(residentVisitorWelcome.size>=80&&!residentVisitorWelcome.has(key))residentVisitorWelcome.delete(residentVisitorWelcome.keys().next().value);
 residentVisitorWelcome.set(key,now);
 requestAnimationFrame(syncCharacterSpeech);return result
};


/* Use the actual installed sprite aspect ratio when reserving text space.
   These bounds cover the rendered image including its foot pivot. */
function paintedScreenEnvelope(bounds,im,height){
 if(!im?.complete||!im.naturalWidth||!im.naturalHeight||!Number.isFinite(height)||height<=0)return bounds;
 const center=(bounds.left+bounds.right)/2,half=Math.max(19,height*im.naturalWidth/im.naturalHeight/2)+7;
 return {...bounds,left:Math.min(bounds.left,center-half),right:Math.max(bounds.right,center+half)}
}
const residentBoundsBefore=characterScreenBounds;
characterScreenBounds=function(actor,player=false){
 const bounds=residentBoundsBefore(actor,player);
 if(player||actor?.kind===2||!actor?.n)return bounds;
 const record=residentArtworkRecord(actor.n),im=residentArtworkImage(record);
 return paintedScreenEnvelope(bounds,im,Math.max(0,bounds.bottom-bounds.top-14))
};
// Reserve real UI, door plaques and nearby actors for short outdoor bubbles.
// Long conversations stay in the normal dialogue panel.
syncCharacterSpeech=function(){
 const el=$('dialogue');if(!el)return;
 el.classList.remove('characterSpeech');el.querySelector('.washiSpeechArt')?.remove();
 for(const k of ['--speech-left','--speech-top','--speech-tail'])el.style.removeProperty(k);
 delete el.dataset.above;delete el.dataset.tailSide;
 if(!talkOpen||room||activity||!greetingNPC?.n)return;
 const speaker=$('speaker').textContent,identity=greetingNPC.n.some(n=>speaker===n||speaker===n+' · '+tr('Guest','客串'));
 if(!identity||$('line').textContent.length>160||$('choices').children.length>1)return;
 el.classList.add('characterSpeech');
 const w=el.offsetWidth,h=el.offsetHeight,root=$('game').getBoundingClientRect();
 const blocks=[];
 for(const node of document.querySelectorAll('#hud,#small,#dock,#back,#hint,#nextStopShortcut,#movePad,#moveGuide,#walkHelp,#lunarRibbon,#worldSigns .worldSign:not([hidden])')){
  if(node.hidden||!node.getClientRects().length)continue;
  const css=getComputedStyle(node);if(css.visibility==='hidden'||css.display==='none'||Number(css.opacity)<.05)continue;
  const b=node.getBoundingClientRect();if(b.width&&b.height)blocks.push({left:b.left-root.left,top:b.top-root.top,right:b.right-root.left,bottom:b.bottom-root.top})
 }
 for(const n of [...npc,...sharedTownActors()])if(n!==greetingNPC)blocks.push(characterScreenBounds(n));
 const pos=chooseSpeechPosition(w,h,W,H,characterScreenBounds(greetingNPC),characterScreenBounds(p,true),blocks);
 if(!pos){el.classList.remove('characterSpeech');return}
 el.style.setProperty('--speech-left',pos.left+'px');el.style.setProperty('--speech-top',pos.top+'px');el.style.setProperty('--speech-tail',pos.tailX+'px');el.dataset.above=String(pos.above);el.dataset.tailSide=pos.side;drawWashiSpeech(el,w,h,pos)
};


/* Room composition: keep entry, action stations and the walking lane inside
   a stable viewport. Do not alter activity-specific camera choreography. */
function roomExplorationFrame(width,height,bounds){
 const landscape=width>=height,short=landscape&&height<500;
 const top=short?78:landscape?98:142,bottom=height-(short?88:landscape?106:143);
 const [l,r,u,d]=bounds;
 const scale=Math.max(.05,Math.min(Math.max(40,width-24)/(r-l),Math.max(40,bottom-top)/(d-u)));
 return {s:scale,ox:width/2-(l+r)*scale/2,oy:(top+bottom)/2-(u+d)*scale/2}
}
const roomExplorationCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(!room||activity||!indoorStages[room])return roomExplorationCameraBefore(s,ox,oy);
 const bounds=room==='temple'?[108,704,235,750]:[110,690,300,750];
 return roomExplorationFrame(W,H,bounds)
};

// Keep the tea table's actual legs and front stools in the floor obstacle
// registry. Decorative objects above the walking lane need no extra collider.
const roomFootprintsBefore=indoorObstacles;
indoorObstacles=function(){
 const obs=roomFootprintsBefore();if(room!=='tea')return obs;
 const [x,y]=indoorStation('chat');
 // This footprint ends above the approach anchor at y=615.
 return [...obs,{l:x-104,r:x+105,u:y-35,d:y+78}]
};

// Short, readable station signs; the full activity name is retained elsewhere.
const roomPlaqueShortNames={
 temple:{templeWater:['Water basin','净手池'],templeBell:['Bell','敲钟'],sticks:['Fortune sticks','求签'],moon:['Moon blocks','掷筊'],prayer:['Prayer altar','祈愿']},
 kitchen:{cook:['Cook with Grandma','跟外婆煮汤']},
 boba:{bubbleTea:['Make bubble tea','摇杯奶茶']},
 mystery:{mystery:['Furniture & gifts','家具与手信']},
 story:{story:['A different life','另一种人生']},
 quiz:{quiz:['Discover yourself','认识自己']},
 match:{match:['Conversation cards','相处话题卡']},
 tea:{chat:['Join the table','来茶桌坐坐'],board:['Noticeboard','留言墙']},
 arcade:{goldfishScoop:['Scoop goldfish','捞金鱼'],claw:['Claw machine','抓娃娃'],rhythm:['Rhythm game','节奏游戏'],blindBox:['Blind boxes','抽盲盒'],bubbleArcade:['Bubble pop','戳泡泡'],woodenThree:['Wooden board game','木棋']},park:{deerVisit:['Feed & bow to deer','喂鹿与鞠躬'],pet:['Meet the cats','和猫咪玩']},
 fish:{riverShout:['Shout it out','喊走烦恼']}
};
const roomCompactPlaqueBefore=label;
label=function(name,x,y,fn){
 if(room&&!activity){
  const entry=(roomActions[room]||[]).find(v=>tr(v[1],v[2])===name),short=entry&&roomPlaqueShortNames[room]?.[entry[0]];
  if(short)name=tr(...short)
 }
 return roomCompactPlaqueBefore(name,x,y,fn)
};

/* Native keyboard/screen-reader access to authored stations. The compact
   guide becomes visible when focused, not as another permanent HUD button.
   Selecting a station uses the same path/arrival logic as a canvas tap. */
const roomGuide=document.createElement('section');roomGuide.id='roomStationGuide';roomGuide.hidden=true;roomGuide.setAttribute('aria-label','Room activities');$('game').append(roomGuide);
const roomGuideToggle=element('button','', $('game'));roomGuideToggle.id='pawRoomGuideToggle';roomGuideToggle.hidden=true;roomGuideToggle.setAttribute('aria-controls','roomStationGuide');roomGuideToggle.setAttribute('aria-expanded','false');
function closeRoomGuide(){roomGuide.classList.remove('pawGuideOpen');roomGuideToggle.setAttribute('aria-expanded','false')}
roomGuideToggle.onclick=()=>{const open=roomGuide.classList.toggle('pawGuideOpen');roomGuideToggle.setAttribute('aria-expanded',String(open));if(open)roomGuide.querySelector('button')?.focus()};
let roomGuideKey='';
function roomGuideEntries(){
 if(room==='temple')return [['templeWater','Water pavilion','手水亭'],['prayer','Prayer altar','祈愿香案'],['templeBell','Bronze bell','山寺钟声'],['sticks','Fortune sticks','求签'],['moon','Moon blocks','掷筊'],['secretGarden','Garden','后院']];
 return (roomActions[room]||[]).filter(a=>Array.isArray(a)&&a.length>=3&&a[1]&&a[2])
}
function syncRoomGuide(){
 const visible=!!room&&!activity&&!talkOpen&&!transitioning&&proposal.hidden&&$('page').style.display!=='block'&&avatar!==null;
 if(roomGuide.hidden===visible)roomGuide.hidden=!visible;
 roomGuideToggle.hidden=!visible;
 if(!visible){closeRoomGuide();roomGuideKey='';return}
 const guideName=tr('Activities','体验');if(roomGuideToggle.textContent!==guideName)roomGuideToggle.textContent=guideName;
 const entries=roomGuideEntries(),key=room+'|'+zh+'|'+entries.map(v=>v[0]).join(',');
 if(key===roomGuideKey)return;
 roomGuideKey=key;roomGuide.replaceChildren();roomGuide.setAttribute('aria-label',tr('Room activities','小屋体验'));
 element('strong',tr('Where to?','想去哪里？'),roomGuide);
 for(const [id,en,cn] of entries){
  const btn=b(roomGuide,tr(en,cn),()=>{
   if(!indoorReady())return;
   // Reuse a live authored hit function, including the walking guard.
   const target=hit.find(h=>h.stationId===id&&typeof h.fn==='function');
   if(target){closeRoomGuide();target.fn();btn.blur()}
   else hint('Tap the station when it comes into view.','等体验区进入视野后再点击。')
  });btn.dataset.station=id
 }
}
const roomGuideDrawBefore=drawRoom;
drawRoom=function(){const result=roomGuideDrawBefore();syncRoomGuide();return result};
const roomGuideStartBefore=start;start=function(...args){roomGuide.hidden=true;roomGuideKey='';return roomGuideStartBefore(...args)};
const roomGuideUIBefore=updateHUD;updateHUD=function(...args){const result=roomGuideUIBefore(...args);syncRoomGuide();return result};
const roomLayoutCss=document.createElement('style');roomLayoutCss.textContent=`
#roomStationGuide{position:absolute;z-index:5;left:12px;top:120px;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
#roomStationGuide:focus-within,#roomStationGuide.pawGuideOpen{clip-path:none;width:min(245px,74vw);height:auto;max-height:min(46dvh,350px);overflow:auto;padding:9px;background:#f2e5c9;border:1px solid #a48b64;box-shadow:0 3px 12px #38291d44;display:grid;gap:5px;white-space:normal;left:auto;right:12px;top:150px;z-index:9}
#pawRoomGuideToggle{position:absolute;z-index:5;right:max(12px,env(safe-area-inset-right,0px));top:calc(env(safe-area-inset-top,0px) + 103px);min-height:44px;padding:5px 11px!important;color:#f9ead1;background:#574b3de8;border:1px solid #bca480;border-radius:5px;box-shadow:0 2px 4px #38291d44;font:600 12px/1.2 Georgia,'Songti SC',serif}
#pawRoomGuideToggle[hidden]{display:none!important}
#roomStationGuide[hidden]{display:none!important}
#roomStationGuide button{min-height:44px;white-space:normal;overflow-wrap:anywhere;text-align:left;font:600 13px/1.35 Georgia,"Songti SC",serif}
@media(max-width:600px) and (orientation:portrait){
 #game #gameControls:not([hidden]):is(.parkCareControls,.riverControls,.festivalFishControls,.nostalgiaControls,.threeControls){max-height:min(34dvh,240px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
 #game #gameControls:not([hidden]) button{flex-shrink:0}
}
@media(max-height:500px) and (orientation:landscape){
 #game #gameControls:not([hidden]):is(.parkCareControls,.riverControls,.festivalFishControls,.nostalgiaControls,.threeControls){max-height:calc(100dvh - 166px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
}
`;document.head.append(roomLayoutCss);

/* Keep the daily fortune easy to discover, without opening the long secondary journal. */
const visibleDailyFortuneBefore=todayHub;
todayHub=function(){
 visibleDailyFortuneBefore();const q=$('content'),lead=q.querySelector('.journalCheckin');
 let slip=q.querySelector('.townFortuneSlip');if(!slip){renderTownFortune(q);slip=q.querySelector('.townFortuneSlip')}
 if(slip&&lead)lead.after(slip);
 const more=q.querySelector('.journalTownMore');if(more){
  const jump=b(q,tr('News & town chat','小镇日报与聊天'),()=>{more.open=true;more.scrollIntoView({block:'start',behavior:'auto'})});jump.className='journalTownJump';
  if(slip)slip.after(jump)
 }
 journalLanguage(todayHub)
};
$('dockScoop').onclick=()=>todayHub();
const latestResidentPassport=passport;
passport=function(){latestResidentPassport();const book=$('content').querySelector('.travelAlbum');if(book&&!book.querySelector('.townFortuneSlip')){renderTownFortune(book);const slip=book.lastElementChild;book.prepend(slip)}journalLanguage(passport)};
$('dockPassport').onclick=()=>passport();


/* Scenery-first HUD: preserve identity, true rank and spendable balance.
   Other visitors' private balances and local profile data are not exposed. */
function compactTownProfile(){
 const rank=lifeRank(),progress=$('hudProgress'),name=residentPlayerDisplayName()||tr('Traveller','旅人');
 $('hudName').textContent=name;progress.textContent=tr('Lv. ','等级 ')+(rank.index+1);
 progress.title=tr(...rank.label)+' · '+rank.total+' '+tr('life points','人生积分');
 $('profileHud').setAttribute('aria-label',name+' · '+progress.textContent+' · '+tr('Open profile','查看资料'));
}
const compactLifeRefreshBefore=lifeHUDRefresh;
lifeHUDRefresh=function(...args){const v=compactLifeRefreshBefore(...args);compactTownProfile();return v};
const townSettingsRoot=$('small'),townSettingsPanel=languageChoices.parentNode;
townSettingsPanel.classList.add('townSettingsPanel');townSettingsPanel.id='townSettingsPanel';
const townSettingsToggle=element('button','',townSettingsRoot,'townSettingsToggle');
townSettingsToggle.id='townSettingsToggle';townSettingsToggle.setAttribute('aria-controls','townSettingsPanel');townSettingsToggle.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4l.7 2.5 2 .9 2.3-1.2 2 3.5-1.8 1.9v2.8l1.8 1.9-2 3.5-2.3-1.2-2 .9L14 21h-4l-.7-2.5-2-.9L5 18.8l-2-3.5 1.8-1.9v-2.8L3 8.7l2-3.5 2.3 1.2 2-.9z"/><circle cx="12" cy="12" r="3.2"/></svg>';
const townSettingsExtra=element('div','',townSettingsPanel,'townSettingsExtra');
const townSoundSettings=element('button','',townSettingsExtra),townMapLabels=element('button','',townSettingsExtra),townHelp=element('button','',townSettingsExtra);
let townSettingsOpen=false;
function syncTownSettings(){
 townSettingsRoot.dataset.open=String(townSettingsOpen);
 townSettingsToggle.setAttribute('aria-label',tr('Settings','设置'));townSettingsToggle.title=tr('Settings','设置');townSettingsToggle.setAttribute('aria-expanded',String(townSettingsOpen));
 townSettingsPanel.hidden=!townSettingsOpen;
 townSoundSettings.textContent=muted?tr('Sound off','声音已关闭'):tr('Sound on','声音已开启');
 townSoundSettings.setAttribute('aria-pressed',String(!muted));
 townMapLabels.textContent=quiet9?tr('Show map signs','显示地图路牌'):tr('Hide map signs','隐藏地图路牌');
 townMapLabels.hidden=!!room||scene!=='fortune';
 townHelp.textContent=tr('Walking help','行走指南');townHelp.hidden=!!room||!isRoute();
}
function closeTownSettings(){townSettingsOpen=false;syncTownSettings()}
townSettingsToggle.onclick=()=>{townSettingsOpen=!townSettingsOpen;syncTownSettings()};
townSoundSettings.onclick=()=>{$('mute').click();syncTownSettings()};
townMapLabels.onclick=()=>{$('quietToggle').click();closeTownSettings()};
townHelp.onclick=()=>{closeTownSettings();walkHelp.click()};
for(const [,btn] of languageButtons)btn.addEventListener('click',closeTownSettings);
document.addEventListener('pointerdown',e=>{if(townSettingsOpen&&!townSettingsRoot.contains(e.target))closeTownSettings()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&townSettingsOpen){closeTownSettings();townSettingsToggle.focus()}});
const townSettingsHUDBefore=updateHUD;updateHUD=function(...args){
 const v=townSettingsHUDBefore(...args);compactTownProfile();
 if(!proposal.hidden||talkOpen||activity)townSettingsOpen=false;
 syncTownSettings();return v
};
const townSettingsPageBefore=page;page=function(...args){closeTownSettings();return townSettingsPageBefore(...args)};
const townSettingsEnterBefore=enter;enter=function(...args){closeTownSettings();return townSettingsEnterBefore(...args)};
const townSettingsSayBefore=say;say=function(...args){closeTownSettings();return townSettingsSayBefore(...args)};
$('profileHud').onclick=()=>{if(avatar!==null&&proposal.hidden&&!transitioning&&!talkOpen)lifeProfile()};
const townCalendarTodayBefore=todayHub;todayHub=function(...args){
 const v=townCalendarTodayBefore(...args),q=$('content'),after=q.querySelector('.journalTownJump')||q.querySelector('.townFortuneSlip');
 if(after){const link=b(q,tr('Lunar calendar','农历日历'),calendarPage);link.className='townCalendarLink';after.after(link)}
 journalLanguage(todayHub);return v
};$('dockScoop').onclick=()=>todayHub();
const townGateWordsBefore=proRender;proRender=function(...args){
 const v=townGateWordsBefore(...args),enterButton=proposal.querySelector('.shrine-enter');
 if(!enterButton)return v;
 enterButton.textContent=tr('Enter the valley','走进解忧谷');
 // Use the existing illustrated mountain approach, not an oversized vector door.
 const gate=proposal.querySelector('.gate');if(gate)gate.hidden=true;
 if(shrineReturning){
  const choices=proposal.querySelector('header .languageChoice');
  if(choices){const menu=document.createElement('details');menu.className='shrineLanguageMenu';const trigger=document.createElement('summary');trigger.textContent=tr('EN','中文')+' ▾';trigger.setAttribute('aria-label',tr('Change language','切换语言'));choices.before(menu);menu.append(trigger,choices)}
 }
 return v
};
const shrineArrivalStyle=document.createElement('style');shrineArrivalStyle.textContent=`
#proposal[data-shot="shrine"] .gate[hidden]{display:none!important}
#proposal[data-shot="shrine"] .hero{overflow:visible!important}
#proposal[data-shot="shrine"] .gate-traveller{height:clamp(66px,19dvh,144px)!important;width:32%!important;left:50%!important;bottom:3%!important;translate:-50% 0;filter:drop-shadow(0 4px 3px #18271e55)!important;transition:transform .26s ease,opacity .26s ease!important}
#proposal[data-shot="shrine"] .gate-traveller.go{transform:translateY(-12%) scale(.85)!important;opacity:0}
#proposal[data-shot="shrine"] footer{animation:none!important;gap:7px!important;padding:12px 14px max(12px,env(safe-area-inset-bottom,0px))!important;background:linear-gradient(transparent,#24362ce8 25%,#24362cf7);border-radius:0!important}
#proposal[data-shot="shrine"] footer .shrine-enter{min-height:48px}
#proposal[data-shot="shrine"] footer .shrine-ticket-reminder{font-size:10px;padding:4px 6px;opacity:.85}
#proposal[data-shot="shrine"] footer .rail-revisit{min-height:44px!important;background:transparent!important;font-size:12px!important}
#proposal .shrineLanguageMenu{position:relative;flex:none;z-index:8}
#proposal .shrineLanguageMenu summary{list-style:none;cursor:pointer;min-height:44px;display:flex;align-items:center;justify-content:center;padding:0 9px;border:1px solid #d1b989;background:#f2e1bc;color:#30483a;border-radius:5px;font-size:13px}
#proposal .shrineLanguageMenu summary::-webkit-details-marker{display:none}
#proposal .shrineLanguageMenu .languageChoice{position:absolute;right:0;top:calc(100% + 5px);background:#f2e1bc;padding:4px;border-radius:5px;box-shadow:0 3px 10px #1d292d66}
#proposal .shrineLanguageMenu:not([open]) .languageChoice{display:none!important}
@media(max-height:600px){#proposal[data-shot="shrine"] footer{gap:4px!important;padding:6px 10px!important}#proposal[data-shot="shrine"] footer .shrine-ticket-reminder{display:none}}
@media(prefers-reduced-motion:reduce){#proposal[data-shot="shrine"] .gate-traveller{transition:none!important}}
`;document.head.append(shrineArrivalStyle);
let townMapHintTimer=0;
const townHintBefore=hint;hint=function(...args){
 clearTimeout(townMapHintTimer);const el=$('hint');el.classList.remove('townHintRest');
 const v=townHintBefore(...args);
 if(!room&&!activity&&/^(Tap a doorway to walk inside|Tap a place to enter|Explore the valley at your own pace)/.test(String(args[0])))townMapHintTimer=setTimeout(()=>{if(!room&&!activity)el.classList.add('townHintRest')},4500);
 return v
};
const sceneryFirstStyle=document.createElement('style');sceneryFirstStyle.textContent=`
#game #lunarBtn,#game #quietToggle,#walkHelp,#game #small #mute{display:none!important}
#game #hud{justify-content:space-between!important;padding-right:51px!important;left:8px!important;right:8px!important;align-items:center}
#game #profileHud{min-height:44px!important;max-width:56%!important;padding:3px 6px 3px 4px!important;gap:5px!important}
#game #hudPortrait{width:31px!important;height:31px!important;flex:none}
#game #hudName{font-size:12px!important;max-width:96px!important}
#game #hudProgress{font-size:10px!important}
#game #hudStats{margin-left:auto;min-width:0}
#game #hudStats #hudCoins{white-space:nowrap;font-size:12px!important;padding:6px!important}
#game #small{top:calc(env(safe-area-inset-top,0px) + 8px)!important;left:auto!important;right:8px!important;display:flex;align-items:flex-start;gap:5px}
#game #small .townSettingsToggle{background:#f4e8d1!important;border:1px solid #ad9775!important;border-radius:6px!important;box-shadow:0 2px 4px #42331f30;min-height:44px!important;width:44px!important;display:grid!important;place-items:center;color:#65503a!important;font:600 11px/1.2 Georgia,"Songti SC",serif;padding:5px 3px!important}
#game #small .townSettingsPanel{position:absolute;right:0;top:calc(100% + 5px);width:190px;max-width:calc(100vw - 24px);display:grid!important;gap:6px;padding:8px;border:1px solid #ad9775;background:#f4e8d1;border-radius:6px;box-shadow:0 4px 15px #31281940;pointer-events:auto;overflow:visible}
#game #small .townSettingsPanel[hidden]{display:none!important}
#game #small .townSettingsExtra{display:grid;gap:3px;background:transparent;border:0;overflow:visible}
#game #small .townSettingsExtra button{min-height:44px!important;text-align:left;white-space:normal;font-size:13px;padding:6px 8px!important}
#game #small .townSettingsExtra button[hidden]{display:none!important}
#game #small .languageChoice{justify-content:center}
#game #hint.townHintRest{opacity:0!important;visibility:hidden!important}
.townCalendarLink{min-height:44px}
@media(max-width:380px){#game #hudName{max-width:64px!important}#game #hudStats #hudCoins{font-size:11px!important;padding:5px!important}}
`;document.head.append(sceneryFirstStyle);syncTownSettings();


/* Shared action clock, first used by the paper-worry ritual.
   Keep the established painted host and avatar art; dedicated arm/action
   frames are still required before visual approval. Time is the render clock. */
function townActionPhase(age,contact=.23,duration=.46){
 if(!Number.isFinite(age)||age<0||age>=duration)return 'ready';
 if(age<contact*.55)return 'anticipation';
 if(age<contact)return 'swing';
 if(age<contact+.065)return 'impact';
 return 'recovery'
}
const paperRitualImpactBefore=smack;
function paperRitualBusy(){return !!state?.paperAction}
function paperRitualAllowed(){return activity==='hit'&&room==='fish'&&!state.paperFinished&&!pawArcadeInputBlocked()}
function paperRitualSyncButtons(){
 const el=$('gameControls');if(!el||activity!=='hit')return;
 const busy=paperRitualBusy();
 for(const button of el.querySelectorAll('button'))button.disabled=busy;
}
function paperRitualCancel(){
 if(activity!=='hit'||!state.paperAction)return;
 state.paperAction=null;stressSwingAt=-10;paperRitualSyncButtons()
}
function paperRitualRequest(){
 if(!paperRitualAllowed()||paperRitualBusy())return false;
 state.paperAction={at:t,landed:false};
 stressSwingAt=t;paperRitualSyncButtons();return true
}
smack=function(){
 if(activity==='hit'&&room==='fish')return paperRitualRequest();
 return paperRitualImpactBefore()
};
function paperRitualAdvance(){
 if(activity!=='hit'||room!=='fish'||!state.paperAction)return;
 const move=state.paperAction,age=t-move.at;
 if(!paperRitualAllowed())return;
 if(!Number.isFinite(age)||age<0){paperRitualCancel();return}
 if(age>=.23&&!move.landed){
  move.landed=true;
  // Existing reward, sound, joke and paper-debris handlers run at contact.
  paperRitualImpactBefore();stressSwingAt=move.at;
 }
 if(age>=.46){
  state.paperAction=null;refreshControls()
 }
}
const paperRitualPaperBefore=paperWorryAt;
paperWorryAt=function(x,y,impact){
 if(activity==='hit'&&room==='fish'){
  const age=state.paperAction?.landed?t-state.paperAction.at-.23:-1;
  impact=age<0?0:Math.sin(age*29)*Math.exp(-age*11)*.65
 }
 return paperRitualPaperBefore(x,y,impact)
};
const paperRitualDrawBefore=drawActivity;
drawActivity=function(){paperRitualAdvance();return paperRitualDrawBefore()};
const paperRitualStartBefore=start;
start=function(id){
 const result=paperRitualStartBefore(id);
 if(id==='hit'&&room==='fish'){
  const name=String(playerName||'').trim().slice(0,24);
  const en=name?name+', take your time. Choose a worry or give the paper a tap.':'Take your time. Choose a worry or give the paper a tap.';
  const cn=(name?name+'，':'')+'慢慢来。选个烦恼，或者先拍拍纸小人。';
  hint('Ah Ma: '+en,'阿嬷：'+cn);refreshControls()
 }
 return result
};
const paperRitualChooseBefore=chooseStressTarget;
chooseStressTarget=function(index){
 if(room==='fish'&&activity==='hit'&&(paperRitualBusy()||state.paperFinished))return false;
 return paperRitualChooseBefore(index)
};
const paperRitualEndings=[
 ["Enough for today. The slipper is officially off duty. Go get some tea.","今天够啦。拖鞋正式下班，去喝口茶吧。"],
 ["The paper can keep the overtime. You can keep your evening.","加班留给纸小人，今晚留给你自己。"],
 ["No paperwork, no performance review. Just a little room to breathe.","不用填表，不用考核。给自己留点喘气的空间。"],
 ["The worries do not have to disappear for you to take a break.","烦恼不必全部消失，你也可以先休息一下。"]
];
function paperRitualFinish(){
 if(!paperRitualAllowed()||paperRitualBusy()||!state.count)return;
 state.paperFinished=true;
 const line=townReaction('paper-finish',paperRitualEndings);
 say(tr('Ah Ma','阿嬷'),tr(...line),[
  [tr('Another round','再来一轮'),()=>start('hit')],
  [tr('Back to pier','返回码头'),()=>{closeTalk();$('back').click()}]
 ]);
 refreshControls()
}
const paperRitualControlsBefore=refreshControls;
refreshControls=function(){
 const result=paperRitualControlsBefore();
 if(activity!=='hit'||room!=='fish')return result;
 const el=$('gameControls');if(!el)return result;
 if(state.paperFinished){
  el.replaceChildren();
  b(el,tr('Another round','再来一轮'),()=>start('hit'));
  b(el,tr('Back to pier','返回码头'),()=>{closeTalk();$('back').click()})
 }else if(state.count>0){
  // Keep the existing compact two-row layout on narrow phones.
  const options=el.querySelectorAll('button');
  if(options.length===3){const finish=b(el,tr('Finish for now','今天就到这'),paperRitualFinish);options[2].replaceWith(finish)}
 }
 paperRitualSyncButtons();return result
};
document.addEventListener('visibilitychange',()=>{if(activity==='hit'&&room==='fish')pawPaperSyncClock(performance.now()/1000)});


/* MB5_ACTION_BEGIN: five physical interaction slices, no new art. */
function mb5PrepProgress(now,started){return Number.isFinite(started)?Math.max(0,Math.min(1,(now-started)/.62)):1}
const mb5BusyBefore=paperRitualBusy;
paperRitualBusy=function(){return mb5BusyBefore()||Number.isFinite(state?.paperPrepAt)};
const mb5ChooseBefore=chooseStressTarget;
chooseStressTarget=function(index){
 const ok=mb5ChooseBefore(index);
 if(ok&&activity==='hit'&&room==='fish'){
  state.paperPrepAt=t;state.paperPrepared=false;
  hint('Ah Ma: Let me lay out a fresh sheet.','阿嬷：来，先铺好这张纸。');refreshControls()
 }
 return ok
};
function mb5PrepareAdvance(){
 if(activity!=='hit'||room!=='fish'||!Number.isFinite(state.paperPrepAt))return;
 if(pawArcadeInputBlocked())return;
 if(mb5PrepProgress(t,state.paperPrepAt)>=1){
  delete state.paperPrepAt;state.paperPrepared=true;
  hint('Ah Ma: Ready. Take your time.','阿嬷：准备好啦，慢慢来。');refreshControls()
 }
}
const mb5SheetBefore=paperWorryAt;
paperWorryAt=function(x,y,impact){
 if(activity!=='hit'||room!=='fish'||!Number.isFinite(state.paperPrepAt))return mb5SheetBefore(x,y,impact);
 const f=poseEase(mb5PrepProgress(t,state.paperPrepAt));
 ctx.save();try{ctx.translate(x,y);ctx.scale(.28+.72*f,.10+.90*f);ctx.translate(-x,-y);return mb5SheetBefore(x,y,0)}finally{ctx.restore()}
};
const mb5PaperControlBefore=paperRitualSyncButtons;
paperRitualSyncButtons=function(){
 mb5PaperControlBefore();if(activity!=='hit'||room!=='fish')return;
 const button=$('gameControls')?.querySelector('.paperWhack');if(!button)return;
 const phase=Number.isFinite(state.paperPrepAt)?'prepare':state.paperAction?townActionPhase(t-state.paperAction.at):'ready';
 const words={prepare:['Preparing the paper…','铺好纸小人……'],anticipation:['Raise the slipper…','举起拖鞋……'],swing:['Swing…','挥下拖鞋……'],impact:['Whack!','啪！'],recovery:['Ready in a moment…','稍等一下……'],ready:['Whack!','打走烦恼！']};
 const label=tr(...words[phase]);if(button.textContent!==label)button.textContent=label
};

/* Accessible alternatives to canvas controls; the same action handlers run. */
function mb5AssistSpec(kind,q,now){
 if(kind==='moon')return q.moonPending||q.tossUntil>now?{key:'moon-busy',label:['Let the blocks settle…','静候筊杯落定……'],disabled:true}:{key:'moon-ready',label:['Toss the moon blocks','掷筊'],action:'moon'};
 if(kind==='sticks'){
  if(q.drawing)return {key:'sticks-falling',label:['Let the stick fall…','静候签落下……'],disabled:true};
  if(q.stickPicked)return {key:'sticks-picking',label:['Collecting the fortune…','正在拾签……'],disabled:true};
  if(q.fallenStick)return {key:'sticks-pick',label:['Pick up the numbered stick','拾起落下的签'],action:'stick-pick'};
  return {key:'sticks-shake',label:['Shake the fortune sticks','摇签筒'],action:'stick-shake'}
 }
 if(kind==='templeBell'){
  const busy=Number.isFinite(q.bellAt)&&now-q.bellAt<2.5;
  return {key:busy?'bell-resonance':'bell-ready',label:busy?['Listen to the bell…','静听钟声……']:['Ring the bell','敲钟'],disabled:busy,action:'bell'}
 }
 if(kind==='templeWater'){
  if(q.waterStage===0)return {key:'water-scoop',label:['Scoop water','舀水'],action:'scoop'};
  if(q.waterStage===1)return {key:'water-rinse',label:['Pour water','倒水'],action:'rinse'};
  if(q.waterStage===2)return {key:'water-flow',label:['Let the water flow…','让清水流过手掌……'],disabled:true};
  if(q.waterStage===3)return {key:'water-done',label:['Back to temple','返回寺庙'],action:'back'}
 }
 if(kind==='cook'&&q.done){
  if(q.tasted)return {key:'soup-done',label:['Back to kitchen','返回厨房'],action:'back'};
  if(q.tasteAt!==undefined)return {key:'soup-tasting',label:['Enjoy the soup…','慢慢喝汤……'],disabled:true};
  return {key:'soup-taste',label:['Taste the soup','尝一口汤'],action:'taste'}
 }
 return null
}
function mb5AssistPerform(action){
 const spec=mb5AssistSpec(activity,state,t);
 if(!spec||spec.disabled||spec.action!==action||document.hidden||talkOpen||transitioning||$('page').style.display==='block')return;
 if(action==='moon')pawMoonToss(65,true);
 else if(action==='stick-shake')shakeFortuneStick();
 else if(action==='stick-pick')pickupFortuneStick();
 else if(action==='bell')templeReleaseBell(65);
 else if(action==='scoop')templeReleaseWater({x:440,y:486});
 else if(action==='rinse')templeReleaseWater({x:375,y:430});
 else if(action==='taste')soupTaste();
 else if(action==='back')$('back').click();
 mb5AssistSync()
}
let mb5AssistKey='',mb5AssistState=null;
function mb5AssistSync(force=false){
 const el=$('gameControls');if(!el)return;
 const spec=mb5AssistSpec(activity,state,t);
 if(!spec){
  if(el.classList.contains('mb5ActivityAssist')&&el.querySelector('.mb5ActivityButton')){el.replaceChildren();el.hidden=true}
  el.classList.remove('mb5ActivityAssist');mb5AssistKey='';mb5AssistState=null;return
 }
 el.classList.add('mb5ActivityAssist');
 if(talkOpen||transitioning||$('page').style.display==='block'){el.hidden=true;return}
 const key=spec.key+'|'+zh;
 if(!force&&key===mb5AssistKey&&state===mb5AssistState&&el.querySelector('.mb5ActivityButton')){el.hidden=false;return}
 mb5AssistKey=key;mb5AssistState=state;el.replaceChildren();el.hidden=false;
 const button=b(el,tr(...spec.label),()=>mb5AssistPerform(spec.action));button.className='mb5ActivityButton';button.disabled=!!spec.disabled
}
const mb5AssistCSS=document.createElement('style');
mb5AssistCSS.textContent='#game #gameControls.mb5ActivityAssist:not([hidden]){width:min(82vw,290px);padding:4px;border-radius:5px;background:#f2e5cce8;border:1px solid #ad9470}#game #gameControls.mb5ActivityAssist .mb5ActivityButton{width:100%;min-height:44px;white-space:normal;font-size:14px}';
document.head.append(mb5AssistCSS);

/* Reject out-of-stage inputs and pause active sequences on a hidden tab. */
const mb5ShakeBefore=teaShake;
teaShake=function(amount){
 if(activity!=='bubbleTea'||state.teaStage!=='mix'||!Number.isFinite(amount)||amount<=0||state.teaMix>=100)return;
 return mb5ShakeBefore(amount)
};
const mb5ScoopBefore=teaAddPearls;
teaAddPearls=function(){
 if(activity!=='bubbleTea'||state.teaStage!=='pearls'||state.teaTopping===0||state.teaToppingCount>=2)return;
 return mb5ScoopBefore()
};
const mb5SipBefore=teaSip;
teaSip=function(){
 if(activity!=='bubbleTea'||state.teaStage!=='ready'||state.teaSealed!==true)return;
 return mb5SipBefore()
};
function mb5ClockField(kind,q){
 if(kind==='moon'&&q.moonPending&&Number.isFinite(q.tossUntil))return 'tossUntil';
 if(kind==='sticks'&&q.drawing&&Number.isFinite(q.stickDrawAt))return 'stickDrawAt';
 if(kind==='sticks'&&q.stickPicked&&!q.stickDelivered&&Number.isFinite(q.stickPickAt))return 'stickPickAt';
 if(kind==='prayer'&&['approach','taking','lighting','walkMat','bow','placing','returnMat'].includes(q.prayerStage))return 'prayerAt';
 if(kind==='templeWater'&&q.waterStage===2)return 'waterAt';
 if(kind==='templeBell'&&Number.isFinite(q.bellAt)&&q.bellAt>=0)return 'bellAt';
 if(kind==='bubbleTea'&&['pouring','seasoning','sealing','sip'].includes(q.teaStage))return 'teaAt';
 if(kind==='cook'&&q.tasteAt!==undefined&&!q.tasted)return 'tasteAt';
 if(kind==='claw'&&q.dropping&&Number.isFinite(q.clawAt))return 'clawAt';
 if(kind==='blindBox'&&q.boxStage==='opening'&&Number.isFinite(q.boxAt))return 'boxAt';
 if(kind==='hit'&&Number.isFinite(q.paperPrepAt))return 'paperPrepAt';
 if(kind==='deerVisit'&&['bow','feed','watch'].includes(q.deerPhase))return 'deerAt';
 return null
}
let mb5Sleep=null;
function mb5Visibility(hidden,now){
 if(!Number.isFinite(now))return;
 if(hidden){
  const field=mb5ClockField(activity,state);
  mb5Sleep=field&&Number.isFinite(state[field])?{kind:activity,run:state,field,at:now}:null;
  return
 }
 const asleep=mb5Sleep;mb5Sleep=null;
 if(!asleep||asleep.run!==state||asleep.kind!==activity||mb5ClockField(activity,state)!==asleep.field)return;
 const elapsed=Math.max(0,now-asleep.at);state[asleep.field]+=elapsed;
 if(asleep.field==='stickDrawAt'&&Number.isFinite(state.shakeUntil))state.shakeUntil+=elapsed
}
document.addEventListener('visibilitychange',()=>{if(['bubbleTea','cook','claw','moon','sticks','prayer','templeWater','templeBell','blindBox'].includes(activity)){mb5Sleep=null;return}mb5Visibility(document.hidden,performance.now()/1000)});

/* Give the deer time to respond to the player instead of mirroring instantly. */
function mb5BowCurve(age,delay,duration){
 if(!Number.isFinite(age)||age<=delay||age>=delay+duration)return 0;
 return Math.sin(Math.PI*(age-delay)/duration)
}
const mb5PlayerPoseBefore=drawRitualPose;
drawRitualPose=function(x,y,scale,opts={}){
 if(activity==='deerVisit'&&state.deerPhase==='bow')opts={...opts,bow:mb5BowCurve(t-state.deerAt,0,1.45)};
 return mb5PlayerPoseBefore(x,y,scale,opts)
};
const mb5AnimalPoseBefore=drawMeadowDeer;
drawMeadowDeer=function(x,y,profile,bow=0,chew=0,scale=1){
 if(activity==='deerVisit'&&state.deerPhase==='bow'&&profile===state.deerProfile)bow=state.deerBows?.8*mb5BowCurve(t-state.deerAt,.95,1.65):0;
 return mb5AnimalPoseBefore(x,y,profile,bow,chew,scale)
};
const mb5BowBefore=deerBow;
deerBow=function(){
 if(activity==='deerVisit'&&state.deerPhase==='ready')state.deerPhase='greet';
 return mb5BowBefore()
};
function mb5DeerControls(){
 if(activity!=='deerVisit'||state.deerPhase!=='ready')return;
 const bow=$('gameControls')?.querySelector('.deerMeadowButtons button');if(bow)bow.disabled=false
}

/* Return to the exact safe visitor-side position, not a generic room spawn. */
function mb5Anchor(id,pos,safe){
 if(!id||!pos||!Number.isFinite(pos.x)||!Number.isFinite(pos.y)||!Number.isFinite(pos.tx)||!Number.isFinite(pos.ty)||Math.hypot(pos.x-pos.tx,pos.y-pos.ty)>3||!safe(pos.x,pos.y))return null;
 return {room:id,x:pos.x,y:pos.y,facing:['up','down','left','right'].includes(pos.facing)?pos.facing:'up'}
}
let mb5Return=null;
const mb5StartBefore=start;
start=function(id){
 if(room&&!activity&&continuityRoom===room&&indoorReady())mb5Return=mb5Anchor(room,indoor,indoorSafe);
 return mb5StartBefore(id)
};
const mb5RoomBefore=drawRoom;
drawRoom=function(){
 if(mb5Return&&!activity){
  const anchor=mb5Return;mb5Return=null;
  if(room===anchor.room&&continuityRoom===room&&indoorSafe(anchor.x,anchor.y)){
   Object.assign(indoor,{x:anchor.x,y:anchor.y,tx:anchor.x,ty:anchor.y,facing:anchor.facing,last:t,goal:null,route:[]});
   continuityActivity=null
  }
 }
 return mb5RoomBefore()
};
const mb5EnterBefore=enter;
enter=function(...args){mb5Return=null;return mb5EnterBefore(...args)};
const mb5RefreshBefore=refreshControls;
refreshControls=function(){const result=mb5RefreshBefore();mb5AssistSync(true);mb5DeerControls();return result};
const mb5DrawBefore=drawActivity;
drawActivity=function(){
 mb5PrepareAdvance();
 if(typeof pawRitualAdvance==='function')pawRitualAdvance();
 const result=mb5DrawBefore();
 if(activity==='hit'&&room==='fish')paperRitualSyncButtons();
 mb5AssistSync();mb5DeerControls();return result
};
/* MB5_ACTION_END */


/* MBART_VALIDATION_BEGIN */
function mbArtValidate(data){
 const out={version:1,players:{},rooms:{}};
 if(data?.version!==1)return out;
 function frame(v,expected,grip=false){
  if(!v||v.path!==expected||!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<16||v.height<16||v.width>2048||v.height>2048||!/^[a-f0-9]{64}$/.test(v.sha256||''))return null;
  function point(p){return Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=0&&p[0]<=v.width&&p[1]>=0&&p[1]<=v.height}
  if(!point(v.foot)||(grip&&!point(v.grip)))return null;
  return {path:v.path,width:v.width,height:v.height,sha256:v.sha256,foot:v.foot.slice(),...(grip?{grip:v.grip.slice()}: {})}
 }
 for(const id of ['0','1','2','3']){
  const raw=data.players?.[id],record={};if(!raw)continue;
  for(const direction of ['up','down','right']){
   const list=raw.walk?.[direction];
   if(!Array.isArray(list)||list.length<4||list.length>8)continue;
   const frames=list.map((v,i)=>frame(v,'assets/visual/painted/player-'+id+'/walk/'+direction+'-'+i+'.webp'));
   if(frames.every(Boolean))(record.walk??={})[direction]=frames
  }
  const phases=['ready','anticipation','swing','impact','recovery'];
  const strike=Object.fromEntries(phases.map(phase=>[phase,frame(raw.strike?.[phase],'assets/visual/painted/player-'+id+'/strike/'+phase+'.webp',true)]));
  if(Object.values(strike).every(Boolean))record.strike=strike;
  if(Object.keys(record).length)out.players[id]=record
 }
 for(const id of ['tea','park','arcade','fish','temple','kitchen','boba','tarot','destiny','wishes','mystery','quiz','story','match','secretGarden']){
  const record={};
  for(const orientation of ['portrait','landscape']){
   const v=data.rooms?.[id]?.[orientation],expected='assets/visual/painted/rooms/'+id+'/'+orientation+'.webp';
   if(v?.path!==expected||!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<320||v.height<320||v.width>2400||v.height>2400||!/^[a-f0-9]{64}$/.test(v.sha256||''))continue;
   if(orientation==='portrait'?v.height/v.width<1.35:v.width/v.height<1.35)continue;
   record[orientation]={path:v.path,width:v.width,height:v.height,sha256:v.sha256}
  }
  if(Object.keys(record).length)out.rooms[id]=record
 }
 return out
}
function mbArtFrameIndex(clock,count,reduced=false){
 if(!Number.isFinite(clock)||!Number.isInteger(count)||count<1||reduced)return 0;
 return ((Math.floor(clock*9)%count)+count)%count
}
function mbArtShortfall(cost,balance){
 return Math.max(0,Math.max(0,Number.isFinite(cost)?cost:0)-Math.max(0,Number.isFinite(balance)?balance:0))
}
function mbArtVisitRecord(raw,day){
 const good=raw&&typeof raw==='object'&&typeof raw.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.day);
 return {day:good?raw.day:day,total:good&&Number.isInteger(raw.total)?Math.max(0,Math.min(9999,raw.total)):0,today:good&&raw.day===day&&Number.isInteger(raw.today)?Math.max(0,Math.min(999,raw.today)):0}
}
/* MBART_VALIDATION_END */
let mbArtRegistry=mbArtValidate(null),mbArtRequested=false,mbArtRetryAt=0;
const mbArtImages=new Map(),mbArtFailures=new Map();
function mbArtLoad(){
 if(mbArtRequested||Date.now()<mbArtRetryAt)return;
 mbArtRequested=true;
 fetch('assets/visual/painted/action-runtime.json',{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Action artwork manifest');return r.json()}).then(data=>{
  mbArtRegistry=mbArtValidate(data);
  // Keep the mobile network available for district/room paintings. Sprite
  // frames are requested by the actors actually being drawn.
  const current=mbArtRegistry.players[avatar??0];
  for(const frames of Object.values(current?.walk||{}))for(const frame of frames)mbArtImage(frame)
 }).catch(()=>{mbArtRequested=false;mbArtRetryAt=Date.now()+15000})
}
function mbArtImage(record){
 if(!record)return null;
 if((mbArtFailures.get(record.path)||0)>Date.now())return null;
 if(!mbArtImages.has(record.path)){
  const im=new Image();im.decoding='async';mbArtImages.set(record.path,im);
  const failed=()=>{if(mbArtImages.get(record.path)===im){mbArtImages.delete(record.path);mbArtFailures.set(record.path,Date.now()+12000)}};
  im.addEventListener('error',failed,{once:true});
  im.addEventListener('load',()=>{if(im.naturalWidth!==record.width||im.naturalHeight!==record.height)failed();else mbArtFailures.delete(record.path)},{once:true});im.src=record.path
 }
 const im=mbArtImages.get(record.path);return im?.complete&&im.naturalWidth===record.width&&im.naturalHeight===record.height?im:null
}
function mbArtDrawFrame(record,im,x,y,scale,flip=false){
 const k=94*scale/record.height,dx=-record.foot[0]*k,dy=-record.foot[1]*k;
 ctx.save();try{
  ellipse(x,y,14*scale,3*scale,'#302a2438');ctx.translate(x,y);if(flip)ctx.scale(-1,1);
  ctx.drawImage(im,dx,dy,record.width*k,record.height*k)
 }finally{ctx.restore()}
 return record.grip?{x:x+(flip?-1:1)*(record.grip[0]-record.foot[0])*k,y:y+(record.grip[1]-record.foot[1])*k}:null
}
const mbArtWalkBefore=backHuman;
backHuman=function(x,y,kind,walking,facing,scale=1){
 if(walking){
  mbArtLoad();const frames=mbArtRegistry.players[kind]?.walk?.[facing==='left'?'right':facing];
  if(frames){
   const loaded=frames.map(mbArtImage);
   if(loaded.every(Boolean)){const i=mbArtFrameIndex(t,frames.length,actorReduce||residentReducedMotion.matches);mbArtDrawFrame(frames[i],loaded[i],x,y,scale,facing==='left');return}
  }
 }
 return mbArtWalkBefore(x,y,kind,walking,facing,scale)
};
const mbArtStrikeBefore=mirrorRitualPose;
mirrorRitualPose=function(x,y,scale,opts){
 if(activity==='hit'&&room==='fish'){
  mbArtLoad();const poses=mbArtRegistry.players[avatar??0]?.strike;
  if(poses){
   const loaded=Object.fromEntries(Object.entries(poses).map(([key,v])=>[key,mbArtImage(v)]));
   if(Object.values(loaded).every(Boolean)){
    const phase=state.paperAction?townActionPhase(t-state.paperAction.at):'ready';
    return mbArtDrawFrame(poses[phase],loaded[phase],x,y,scale,true)
   }
  }
 }
 return mbArtStrikeBefore(x,y,scale,opts)
};
/* PAW_DEVICE_ART_BEGIN */
function pawArtworkOrientation(width,height){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return 'portrait';
 return width/height>=1.15?'landscape':'portrait'
}
function pawArtworkRecord(records,width,height){
 return records?.[pawArtworkOrientation(width,height)]||null
}
function pawArtworkContain(iw,ih,w,h){
 if(![iw,ih,w,h].every(v=>Number.isFinite(v)&&v>0))return null;
 const scale=Math.min(w/iw,h/ih),width=iw*scale,height=ih*scale;
 return {w:width,h:height,dx:(w-width)/2,dy:(h-height)/2}
}
/* PAW_DEVICE_ART_END */
const pawWideArtworkMedia='(min-aspect-ratio: 23/20)';
function pawSyncArtworkOrientation(){
 const game=$('game'),width=game?.clientWidth||innerWidth,height=game?.clientHeight||innerHeight;
 const orientation=pawArtworkOrientation(width,height);
 document.documentElement.dataset.pawArtwork=orientation;
 if(game)game.dataset.pawArtwork=orientation;
 // Warm only the preferred room art when dimensions change, without changing
 // any scene, player coordinates, saved data, controls or gameplay state.
 if(typeof room==='string'&&room)mbArtImage(pawArtworkRecord(mbArtRegistry.rooms[activePortraitInterior()],width,height))
}
window.addEventListener('resize',pawSyncArtworkOrientation,{passive:true});
if(typeof ResizeObserver==='function'&&$('game'))new ResizeObserver(pawSyncArtworkOrientation).observe($('game'));
pawSyncArtworkOrientation();
/* The two native room compositions are independent. Only a verified matching
   raster may replace the current background; never stretch it or load a
   nonexistent guessed filename. */
const mbArtPortraitBefore=portraitInteriorImage;
portraitInteriorImage=function(id){
 mbArtLoad();return mbArtImage(mbArtRegistry.rooms[id]?.portrait)||mbArtPortraitBefore(id)
};
const mbArtLandscapeBefore=paintLandscapeRoom;
paintLandscapeRoom=function(id){
 if(pawArtworkOrientation(W,H)!=='landscape')return mbArtLandscapeBefore(id);
 mbArtLoad();const record=pawArtworkRecord(mbArtRegistry.rooms[id],W,H),im=mbArtImage(record);
 if(!im)return mbArtLandscapeBefore(id);
 const b=livingBounds(),fit=pawArtworkContain(im.naturalWidth,im.naturalHeight,b.w,b.h);
 if(!fit)return mbArtLandscapeBefore(id);
 ctx.save();try{
  ctx.fillStyle='#51493d';ctx.fillRect(b.x,b.y,b.w,b.h);
  ctx.drawImage(im,b.x+fit.dx,b.y+fit.dy,fit.w,fit.h);
 }finally{ctx.restore()}
 return true
};
/* Use the actual installed seated/scolding paintings at the correct stage.
   No pretend arm animation on the resident. */
const mbArtAhMaBefore=drawProductionAhMa;
drawProductionAhMa=function(x,y,scale=1){
 if(activity!=='hit'||room!=='fish')return mbArtAhMaBefore(x,y,scale);
 const phase=state.paperAction?townActionPhase(t-state.paperAction.at):'ready';
 const r=residentArtworkRecord('Ah Ma'),pose=phase==='impact'||phase==='recovery'?'scolding':'seated';
 const im=residentArtworkImage(r,pose)||residentArtworkImage(r,'seated');
 if(drawResidentRaster(im,x,y,205*scale,'right'))return true;
 return mbArtAhMaBefore(x,y,scale)
};
/* Remember only completed visits, never the symbolic grievance. */
const mbArtFinishBefore=paperRitualFinish;
paperRitualFinish=function(){
 const run=state,was=run.paperFinished,result=mbArtFinishBefore();
 if(activity==='hit'&&run===state&&!was&&run.paperFinished){
  const day=shrineClock().day,record=mbArtVisitRecord(load('paperVisitsV1',null),day);
  if(record.day<=day){record.day=day;record.total=Math.min(9999,record.total+1);record.today=Math.min(999,record.today+1);save('paperVisitsV1',record)}
 }
 return result
};
const mbArtStartBefore=start;
start=function(id){
 const result=mbArtStartBefore(id);
 if(id==='hit'&&room==='fish'){
  const day=shrineClock().day,record=mbArtVisitRecord(load('paperVisitsV1',null),day);
  if(record.total>0&&record.day<=day){
   const en=record.today?['Back already? My slipper has not even had lunch.','Another little break? No need to explain.']:['Good to see you again. The river saved you a seat.','Come sit. Some days are just a bit much.'];
   const cn=record.today?['又来啦？我的拖鞋还没吃午饭呢。','又来歇会儿？不用解释。']:['又见面啦，河边给你留了个位置。','来坐坐，有些日子就是挺烦人的。'];
   const i=record.total%2,name=residentPlayerDisplayName();
   hint('Ah Ma: '+(name?name+', ':'')+en[i],'阿嬷：'+(name?name+'，':'')+cn[i])
  }
 }
 return result
};
/* Restore slipper choice after the first strike without a larger permanent
   control panel. Put it in the existing symbolic worry chooser. */
const mbArtChoicesBefore=openStressChoices;
openStressChoices=function(){
 const result=mbArtChoicesBefore();
 if(activity!=='hit'||room!=='fish')return result;
 const book=$('content')?.querySelector('.stressChoiceBook');if(!book)return result;
 const group=element('section','',book,'mbArtSlipperChoice');
 element('strong',tr('Choose a slipper','选只拖鞋'),group);
 const row=element('div','',group,'mbArtSlipperButtons');
 for(const [index,en,cn] of [[0,'Rose slipper','玫红拖鞋'],[1,'Wood brown slipper','木棕拖鞋']]){
  const btn=b(row,tr(en,cn),()=>{if(paperRitualBusy()||state.paperFinished)return;stressTool=index;for(const [i,v] of [...row.querySelectorAll('button')].entries())v.setAttribute('aria-pressed',String(i===index))});btn.setAttribute('aria-pressed',String(index===stressTool))
 }
 book.prepend(group);return result
};
/* Show actual purchasing power without changing existing prices or saves. */
const mbArtShopBefore=furnitureMarket;
furnitureMarket=function(back='shop'){
 const result=mbArtShopBefore(back),shelf=$('content')?.querySelector('.komorebiBook');if(!shelf)return result;
 const balance=hideoutBalance(),catalogue=furnitureCatalogue(),grid=shelf.querySelector('.komorebiGrid');if(!grid)return result;
 const button=b(shelf,tr('Show items I can afford','只看买得起的'),()=>{mbArtAffordable=!mbArtAffordable;furnitureMarket(back)});
 button.setAttribute('aria-pressed',String(mbArtAffordable));grid.before(button);
 for(const tile of grid.querySelectorAll('.komorebiTile')){
  const name=tile.querySelector('strong')?.textContent,v=catalogue.find(v=>tr(v[1],v[2])===name);if(!v)continue;
  const owned=furnitureOwned(v[0]),short=mbArtShortfall(v[3],balance),locked=v[0]==='roomStudio'&&!furnitureOwned('roomExtension');
  if(!owned&&short)element('small',tr('Save ','还差 ')+short+tr(' more coins',' 爪爪币'),tile,'mbArtShortfall');
  if(!owned&&locked)element('small',tr('Reading room first','先扩建阅读小室'),tile,'mbArtShortfall');
  tile.hidden=mbArtAffordable&&(owned||short>0||locked);
 }
 if(mbArtAffordable&&![...grid.querySelectorAll('.komorebiTile')].some(tile=>!tile.hidden))element('p',tr('Nothing to buy in this section yet. Try another category or keep exploring.','这一区暂时没有买得起的物品。换个分类看看，或继续逛逛小镇。'),grid,'mbArtEmpty');
 return result
};
let mbArtAffordable=false;
const mbArtUi=document.createElement('style');mbArtUi.textContent='.mbArtSlipperChoice{padding:10px 0;border-bottom:1px solid #b99e74}.mbArtSlipperButtons{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.mbArtSlipperButtons button{min-height:44px;white-space:normal}.mbArtSlipperButtons button[aria-pressed=true]{background:#52674f;color:#fff3d8}.komorebiTile[hidden]{display:none!important}.mbArtShortfall{color:#70513b}.mbArtEmpty{grid-column:1/-1}';document.head.append(mbArtUi);


/* Shared desktop and mobile letter: no canvas-only choices or duplicate text. */
const parallelResponsiveLetterStyle=document.createElement('style');
parallelResponsiveLetterStyle.textContent=
 '#game #storyReadingSheet:not([hidden]){max-height:47dvh;overscroll-behavior:contain}' +
 '#game #storyReadingSheet[data-wide="true"][data-ending="false"]{left:auto;right:clamp(20px,6vw,100px);top:50%;bottom:auto;transform:translateY(-50%);width:min(40vw,460px);max-height:68dvh;padding:20px 24px;border:3px double #b0986b;box-shadow:0 8px 25px #2c241c50}' +
 '#game #storyReadingSheet[data-wide="true"] h3{font-size:clamp(19px,2vw,25px)}' +
 '#game #storyReadingSheet[data-wide="true"] p{font-size:16px;line-height:1.55}' +
 '#game #storyReadingSheet[data-ending="true"]{max-height:25dvh;width:min(90vw,390px);padding:6px 10px;display:grid;grid-template-columns:1fr 1fr;gap:6px}' +
 '#game #storyReadingSheet[data-ending="true"] small{grid-column:1/-1;text-align:center}' +
 '#game #storyReadingSheet[data-ending="true"] button{text-align:center;margin:0}' +
 '#game #storyReadingSheet button:focus-visible{outline:3px solid #52674f;outline-offset:2px}' +
 '@media(max-height:480px){#game #storyReadingSheet[data-wide="false"][data-ending="false"]{max-height:43dvh;padding:7px 10px}#game #storyReadingSheet[data-wide="false"] p{font-size:13px}}';
document.head.append(parallelResponsiveLetterStyle);


const mbHomeStyle=document.createElement('style');
mbHomeStyle.textContent='#content .hideoutScene{isolation:isolate}#content .hideoutPlaced[role="button"]{touch-action:none;cursor:grab}#content .hideoutPlaced[role="button"]:active{cursor:grabbing}#content .hideoutPlaced:focus-visible{outline:3px solid #f8d395;outline-offset:3px}#content .mbHomeSelection{font-size:13px;color:#70513b;margin:2px 0 8px}#content .mbHomeTransfer{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}#content .mbHomeTransfer button{min-height:44px;white-space:normal}#content .hideoutTools{flex-wrap:wrap}#content .hideoutTools button{min-width:72px}';
document.head.append(mbHomeStyle);


/* MBFISH_REFINEMENT_BEGIN */
function mbFishTiming(age){
 if(!Number.isFinite(age)||age<.12)return 'early';
 if(age<=2)return 'ready';
 if(age<3.1)return 'late';
 return 'expired'
}
function mbFishPauseGame(game,elapsed){
 if(!game||!Number.isFinite(elapsed)||elapsed<0)return false;
 if(Number.isFinite(game.at))game.at+=elapsed;
 if(Number.isFinite(game.last))game.last+=elapsed;
 if(Number.isFinite(game.resultAt)&&game.resultAt>0)game.resultAt+=elapsed;
 return true
}
/* MBFISH_REFINEMENT_END */
let mbFishSuspended=null;
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){
  mbFishSuspended=activity==='goldfishScoop'&&state.festivalFish?{game:state.festivalFish,at:performance.now()/1000}:null;return
 }
 const old=mbFishSuspended;mbFishSuspended=null;
 if(old&&activity==='goldfishScoop'&&state.festivalFish===old.game)mbFishPauseGame(old.game,Math.max(0,performance.now()/1000-old.at))
});
const mbFishDipBefore=festivalDip;
festivalDip=function(){
 if(document.hidden||talkOpen||transitioning||$('page').style.display==='block')return;
 return mbFishDipBefore()
};
const mbFishLiftBefore=festivalLift;
festivalLift=function(){
 if(document.hidden||talkOpen||transitioning||$('page').style.display==='block')return;
 return mbFishLiftBefore()
};
const mbFishControlsBefore=refreshControls;
refreshControls=function(){
 const result=mbFishControlsBefore();
 if(activity!=='goldfishScoop'||!state.festivalFish)return result;
 const controls=$('gameControls');if(!controls?.classList.contains('festivalFishControls'))return result;
 const g=state.festivalFish;
 if(g.phase==='dip'){
  const timing=element('small','',controls,'mbFishTiming');timing.setAttribute('role','status');timing.setAttribute('aria-live','polite');
  const track=element('progress','',controls,'mbFishProgress');track.max=2.4;track.value=0;track.setAttribute('aria-label',tr('Time in water','纸网入水时间'));
  controls.insertBefore(timing,controls.querySelector('.festivalFishButtons'));controls.insertBefore(track,controls.querySelector('.festivalFishButtons'));
  mbFishSyncTiming()
 }
 return result
};
function mbFishSyncTiming(){
 if(activity!=='goldfishScoop'||state.festivalFish?.phase!=='dip')return;
 const controls=$('gameControls'),g=state.festivalFish,timing=controls?.querySelector('.mbFishTiming'),progress=controls?.querySelector('.mbFishProgress'),button=controls?.querySelector('.festivalFishButtons button');
 if(!timing||!progress||!button)return;
 const age=Math.max(0,t-g.last),stage=mbFishTiming(age);
 const message=stage==='early'?tr('Let the paper settle…','先让纸网稳一稳……'):stage==='ready'?tr('Lift while a fish is inside the ring.','小鱼游进圈里就捞起。'):tr('Lift now before the paper tears.','快捞起，纸网快破了。');
 if(timing.textContent!==message)timing.textContent=message;
 timing.dataset.timing=stage;progress.max=3.1;progress.value=Math.min(3.1,age);button.disabled=false
}
const mbFishFrameBefore=drawActivity;
drawActivity=function(){
 const result=mbFishFrameBefore();
 if(activity==='goldfishScoop'&&state.festivalFish?.phase==='dip')mbFishSyncTiming();
 return result
};
const mbJourneyStyle=document.createElement('style');
mbJourneyStyle.textContent=
 '#content .railRouteNodes .mbRailDestination{border-color:#a76c47;color:#70492f;font-weight:700}'+
 '#content .railRouteNodes .mbRailStatus{display:block;padding-top:4px;font-size:10px;line-height:1.2}'+
 '#content .mbRailScenery{display:flex;gap:8px;align-items:center;justify-content:space-between;max-width:560px;margin:auto}'+
 '#content .mbRailScenery p{font-size:13px;line-height:1.45;margin:3px 0;flex:1;color:#69513e}'+
 '#content .mbRailPause{min-height:44px;max-width:42%;white-space:normal;font-size:12px}'+
 '#content .districtRailCabin[data-scenery-paused="true"] .districtRailWindow img,#content .districtRailCabin[data-scenery-paused="true"] .railPassingTrees{animation-play-state:paused!important}'+
 '#game .mbFishProgress{width:min(100%,210px);height:6px;margin:0 auto;accent-color:#71876c}'+
 '#game .mbFishTiming[data-timing="late"]{color:#8b4c37}'+
 '#game .mbFishTiming[data-timing="ready"]{color:#36583e}';
document.head.append(mbJourneyStyle);

const mbFriendJournalStyle=document.createElement('style');
mbFriendJournalStyle.textContent='#content .friendEntry .mbFriendJournal{grid-column:1/-1;width:100%;margin-top:4px;padding:6px 9px;background:#f7ecd4;border:1px solid #c7af87;border-radius:4px;box-sizing:border-box}#content .mbFriendJournal summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-size:13px;font-weight:600;color:#69513e}#content .mbFriendJournal small{display:block;margin:5px 0;white-space:normal}#content .mbFriendJournal p{font-size:13px;line-height:1.5;margin:8px 0 2px}';
document.head.append(mbFriendJournalStyle);


/* Keep the actual two visitor slots and the Today roster in agreement.
   Rotate offscreen or behind a full-page journal, never during a chat. */
let mbGuestDate='',mbGuestScene='',mbGuestCheck=-Infinity;
const mbGuestInitBefore=initNPC;
initNPC=function(...args){
 const result=mbGuestInitBefore(...args);mbGuestDate=shrineClock().day;mbGuestScene=scene;mbGuestCheck=t;return result
};
function mbGuestSync(force=false){
 if(!force&&t-mbGuestCheck<15)return false;
 mbGuestCheck=t;
 if(mbGuestScene!==scene)return false;
 const today=shrineClock().day,slots=npc.filter(n=>n.popGuest);
 const blocked=!!room||!!activity||talkOpen||transitioning||!proposal.hidden;
 const covered=$('page').style.display==='block';
 if(!mbGuestSafeRotate(mbGuestDate,today,blocked,covered,slots.map(n=>Math.hypot(n.x-p.x,n.y-p.y))))return false;
 // Update names and IDs together while preserving actor positions and walk paths.
 slots.forEach((n,i)=>{const g=popGuestFor(scene,i,today);if(g){n.popGuest=g.id;n.n=g.name}});
 mbGuestDate=today;return true
}
function mbGuestRoster(district){
 if(district===scene&&mbGuestScene===scene){
  mbGuestSync(true);
  const actual=npc.filter(n=>n.popGuest).map(n=>popGuestStories.find(g=>g.id===n.popGuest)).filter(Boolean);
  if(actual.length)return actual.filter((g,i)=>actual.findIndex(v=>v.id===g.id)===i)
 }
 const count=Math.min(2,popGuestPool(district).length);
 return Array.from({length:count},(_,i)=>popGuestFor(district,i)).filter(Boolean)
}
const mbGuestDrawMapBefore=drawMap;
drawMap=function(){mbGuestSync();return mbGuestDrawMapBefore()};
const mbGuestTodayBefore=todayHub;
todayHub=function(...args){
 const result=mbGuestTodayBefore(...args);
 const panel=$('content').querySelector('.guestVisitPanel');if(panel){
  const previous=panel.querySelector('p');
  if(previous)previous.textContent=tr('Fictional visitors rotate with the town calendar. A familiar face may remember your last conversation.','虚构客串角色随小镇日历轮换。熟面孔也许还记得上次的聊天。');
  const title=panel.querySelector('h2');
  if(title)title.textContent=tr('Who is around town?','今天谁来摸鱼？')
 }
 journalLanguage(todayHub);return result
};
const mbGuestUi=document.createElement('style');
mbGuestUi.textContent='#content .mbGuestLine{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:5px 0;font-size:14px}#content .mbGuestLine small{flex-shrink:0;font-size:11px}#content .mbGuestMemory{margin-top:7px;padding:4px 9px;border:1px solid #c5ae88;background:#f8ecd5;border-radius:4px}#content .mbGuestMemory summary{min-height:44px;display:flex;align-items:center;cursor:pointer;font-size:13px;color:#6d533a}#content .mbGuestMemory p{line-height:1.5}';
document.head.append(mbGuestUi);
const mbRailPostcardStyle=document.createElement('style');mbRailPostcardStyle.textContent=`
#content .districtRailCabin{padding:12px!important;background:#e7d2a9!important;border:1px solid #ac8a63!important;box-shadow:0 3px 9px #56452a33!important;border-radius:5px!important}
#content .districtRailCabin .railRouteCar{color:#68503c!important}
#content .districtRailCabin .mbRailPostcard{height:clamp(155px,29dvh,330px)!important;border:4px solid #faf0d9!important;border-radius:3px!important;background:#c7af85!important;box-shadow:0 2px 5px #5b463b40}
#content .districtRailCabin .mbRailPostcard img{object-position:50% 42%!important;animation:mbPostcardDrift 22s ease-in-out infinite alternate!important}
#content .districtRailCabin[data-scenery-paused="true"] .mbRailPostcard img{animation-play-state:paused!important}
@keyframes mbPostcardDrift{from{object-position:50% 32%}to{object-position:50% 62%}}
#content .districtRailCabin .districtRailSeat{height:auto!important;min-height:0!important;background:transparent!important;border:0!important;padding:6px!important;color:#5f4937!important}
#content .railJourneyActions{margin:8px 0!important;gap:5px!important}
#content .railAnchorNote{display:none}
#content .railRouteNodes{gap:4px!important}
#content .railRouteNodes>span{font-size:11px!important;overflow-wrap:anywhere}
#storyReadingSheet .mbStoryIntro{font-size:12px;line-height:1.4;color:#665642}
@media(prefers-reduced-motion:reduce){#content .districtRailCabin .mbRailPostcard img{animation:none!important}}
`;document.head.append(mbRailPostcardStyle);
const mbJournalFinish=document.createElement('style');mbJournalFinish.textContent=`
#content .mbPurseBook{background:var(--town-grain),#f1e2c5;border:1px solid #a48b65;padding:12px;border-radius:5px;box-shadow:2px 3px 0 #bba17b44}
#content .mbPursePocket{background:var(--town-grain),#927052;border:2px solid #77583d;outline:1px dashed #d7b98a;outline-offset:-6px;border-radius:12px 12px 19px 19px;color:#f9e8ca;text-align:center;padding:20px 10px;box-shadow:inset 0 -7px 0 #78533755}
#content .mbPursePocket h2{font:600 clamp(22px,5vw,34px)/1.2 var(--town-title);color:#fff2d4!important;margin:5px 0!important}
#content .mbPursePocket small{font:12px/1.4 system-ui}
#content .townPawLedger{background:var(--town-grain),#fff1d7;border:1px solid #b59a73;padding:10px 14px;border-radius:3px;box-shadow:2px 3px 0 #c0a47b30}
#content .townPawLedger summary{min-height:44px;align-content:center;cursor:pointer}
#storyReadingSheet,#wonderQuestionSheet{background:linear-gradient(90deg,#d8c19b55,transparent 8%),var(--town-grain),#f5e8cc!important;border:1px solid #a98b63!important;border-left:5px solid #ad8c60!important;box-shadow:0 4px 12px #30241955!important}
#storyReadingSheet button,#wonderQuestionSheet button{border-radius:3px!important;text-align:left;line-height:1.35}
#game #gameControls.deerMeadowControls:not([hidden]){box-sizing:border-box;padding:6px 8px!important}
`;document.head.append(mbJournalFinish);

/* Apply the traced path after all guest and map overrides. Only NPCs are
   constrained here; existing player and doorway route behaviour is unchanged. */
function mbGroundResident(n){
 if(!paintedResidentPaths[scene]||room)return;
 n.y=paintedResidentY(scene,n.y);n.ty=paintedResidentY(scene,n.ty);
 n.x=residentGround(scene,n.x,n.y);n.tx=residentGround(scene,n.tx,n.ty);
}
const mbPaintedPathInit=initNPC;initNPC=function(...args){const r=mbPaintedPathInit(...args);npc.forEach(mbGroundResident);return r};
const mbPaintedPathTarget=residentTarget;residentTarget=function(n,i){mbPaintedPathTarget(n,i);mbGroundResident(n);if(Math.abs(n.ty-n.y)<5&&paintedResidentPaths[scene]){n.walkDirection=-(n.walkDirection||1);n.ty=paintedResidentY(scene,n.y+n.walkDirection*75);n.tx=residentGround(scene,n.tx,n.ty)}};
const mbPaintedPathStep=step;step=function(n,dt,speed){if(n!==p)mbGroundResident(n);const r=mbPaintedPathStep(n,dt,speed);if(n!==p)mbGroundResident(n);return r};
// Frame the entire encounter above the actual action panel, including on
// short portrait screens. Use the same geometry for landscape.
const mbDeerCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(activity!=='deerVisit')return mbDeerCameraBefore(s,ox,oy);
 const controls=$('gameControls'),reserve=Math.max(175,(controls?.offsetHeight||100)+85);
 return shorePortraitFit(W,H,shorePortraitBounds.deerVisit,reserve)
};
/* MBVISUAL_FIT_BEGIN */
// Use authored stage bounds, never the visible animal/body centre alone.
// Shrink only as necessary to fit the ACTUAL control band.
function mbVisualFitStage(view,bounds,width,top,bottom){
 const [l,r,u,d]=bounds;
 if(![view.s,view.ox,view.oy,l,r,u,d,width,top,bottom].every(Number.isFinite)||bottom<=top||r<=l||d<=u||view.s<=0)return view;
 const actual={left:view.ox+l*view.s,right:view.ox+r*view.s,top:view.oy+u*view.s,bottom:view.oy+d*view.s};
 if(actual.left>=8&&actual.right<=width-8&&actual.top>=top&&actual.bottom<=bottom)return view;
 const scale=Math.min(view.s,(width-16)/(r-l),(bottom-top)/(d-u));
 if(scale<=0)return view;
 return {s:scale,ox:width/2-(l+r)/2*scale,oy:(top+bottom)/2-(u+d)/2*scale};
}
/* MBVISUAL_FIT_END */
const mbStageCameraBefore=mobileRoomCamera;
let mbStagePanelMeasure={key:'',at:0,top:0,bottom:0},mbLastStageCamera=null;
mobileRoomCamera=function(s,ox,oy){
 const ritual=activity==='templeBell'?[155,555,242,625]:activity==='templeWater'?[233,581,348,623]:null;
 const original=ritual&&W<H?shorePortraitFit(W,H,ritual,174):mbStageCameraBefore(s,ox,oy);
 if(!activity||W>=H||!room){mbLastStageCamera=null;return original}
 const bounds=ritual||(activity==='bubbleTea'?[180,610,310,635]:
 activity==='goldfishScoop'?[207,593,345,605]:
 activity==='bubbleArcade'?[217,583,258,680]:
 activity==='woodenThree'?[215,585,260,675]:
 activity==='love'&&['deal','cards'].includes(state.readStage)?[185,615,230,800]:
 shorePortraitBounds[activity]||portraitActivityBounds[activity]||foodArcadePortraitBounds[activity]);
 if(!bounds){mbLastStageCamera=null;return original}
 const key=activity+'|'+W+'|'+H+'|'+zh+'|'+bounds.join(',');
 // A touch gesture must retain the same world coordinate conversion.
 if((drag||state?.care?.drag)&&mbLastStageCamera?.key===key)return mbLastStageCamera.view;
 const clock=performance.now();
 if(mbStagePanelMeasure.key!==key||clock-mbStagePanelMeasure.at>120){
  const panels=meowVisibleRects('#gameControls,#ritualActionBar,#pearlRecipePanel,#threeBoardAccess');
  const bottomPanels=panels.filter(r=>r.left<W/2&&r.right>W/2&&r.top>H*.32);
  mbStagePanelMeasure={key,at:clock,top:H<680?95:115,bottom:Math.min(H-85,...bottomPanels.map(r=>r.top-8))};
 }
 const {top,bottom}=mbStagePanelMeasure;
 const view=bottom-top>=70?mbVisualFitStage(original,bounds,W,top,bottom):original;
 mbLastStageCamera={key,view};return view;
};

/* Keep initial town residents distributed along the walkable path.
   Do not teleport them after the map has become visible. */
function mbResidentSpawnY(desired,low,high,occupied,gap){
 const candidates=[Math.max(low,Math.min(high,desired))];
 for(let i=1;i<=Math.ceil((high-low)/gap)+1;i++){
  for(const sign of [-1,1])candidates.push(Math.max(low,Math.min(high,desired+sign*i*gap)));
 }
 candidates.sort((a,b)=>Math.abs(a-desired)-Math.abs(b-desired));
 return candidates.find(y=>occupied.every(v=>Math.abs(v-y)>=gap))??candidates.reduce((best,y)=>Math.min(...occupied.map(v=>Math.abs(v-y)))>Math.min(...occupied.map(v=>Math.abs(v-best)))?y:best,candidates[0])
}
const mbSpreadInitBefore=initNPC;
initNPC=function(...args){
 const r=mbSpreadInitBefore(...args);
 const path=scene==='fortune'?valleyNpcPath:paintedResidentPaths[scene];
 if(!path||room)return r;
 const low=Math.max(minY()+24,path[0][0]),high=Math.min(maxY()-24,path.at(-1)[0],scene==='fortune'?valleyResidentWalkLimit:Infinity);
 if(high<=low)return r;
 const gap=Math.min(160,(high-low)/Math.max(1,npc.length+1)),occupied=[p.y];
 for(const [i,n] of [...npc].sort((a,b)=>Math.abs(a.y-p.y)-Math.abs(b.y-p.y)).entries()){
  const y=mbResidentSpawnY(n.y,low,high,occupied,gap),lane=residentLane(scene,y);
  n.y=n.ty=y;n.x=n.tx=lane.x+(i%2?1:-1)*lane.half*.65;
  n.pathReady=false;n.pauseUntil=t+1.3+i*.45;occupied.push(y)
 }
 return r
};
const mbResidentSpacingStepBefore=step;
step=function(n,dt,speed){
 if(n===p||room||!npc.includes(n)||talkOpen)return mbResidentSpacingStepBefore(n,dt,speed);
 const before={x:n.x,y:n.y};
 const result=mbResidentSpacingStepBefore(n,dt,speed);
 // Avoid closing a small gap between residents; use an alternate direction
 // after yielding. The player's movement is never restricted by this rule.
 const crowded=npc.some(a=>a!==n&&pawPedestrianCrowd(before,n,a,n.kind===2||a.kind===2?37:72));
 if(crowded){
  n.x=before.x;n.y=before.y;n.tx=n.x;n.ty=n.y;n.walkDirection=-(n.walkDirection||1);n.pathReady=false;n.pauseUntil=t+.7+pawResidentTempo(pawPasserbyIdentity(n)).dwell*.25;return true
 }
 return result
};

/* Personal home access and contextual navigation. */
function mbHomePageBack(label,fn){const back=$('content').querySelector(':scope > .row button:first-child');if(back){back.textContent=label;back.onclick=fn}}
let mbHomeOrigin=null;
function mbHomeExit(){
 saveHideout();hideoutEditing=false;
 const origin=mbHomeOrigin;mbHomeOrigin=null;
 if(origin)origin.open();
 else{$('page').style.display='none';updateHUD()}
}
function mbOpenOwnHome(open=null,label=null){
 mbHomeOrigin=open?{open,label}:null;
 hideoutEditing=false;hideoutSelected=-1;hideoutPage()
}
const mbHomeNav=element('button','',$('dock'));mbHomeNav.id='dockOwnHome';mbHomeNav.type='button';mbHomeNav.innerHTML='<span class="dockIcon" aria-hidden="true"><svg viewBox="0 0 28 28" width="25" height="25" fill="none" stroke="#805c43" stroke-width="1.5"><path d="M3 13 14 4l11 9-3 1v11H6V14z" fill="#d3aa78"/><path d="M2 13 14 3l12 10M10 25V16h8v9M8 10v-5h3"/></svg></span><span></span>';$('dockValley').after(mbHomeNav);mbHomeNav.onclick=()=>mbOpenOwnHome();
const mbHomeHudBefore=updateHUD;updateHUD=function(...args){const r=mbHomeHudBefore(...args),label=tr('My home','小窝');mbHomeNav.lastElementChild.textContent=label;mbHomeNav.setAttribute('aria-label',label);const photo=$('hudPortrait'),src=ART['walker'+(avatar??0)+'0'];if(src&&photo.getAttribute('src')!==src)photo.src=src;return r};
const mbHomeViewBefore=hideoutPage;hideoutPage=function(...args){const r=mbHomeViewBefore(...args),q=$('content');if(q.querySelector('.hideoutScene')){mbHomePageBack(hideoutEditing?tr('‹ My room','‹ 返回小窝'):tr(...(mbHomeOrigin?.label||['‹ Town','‹ 返回小镇'])),()=>{if(hideoutEditing){saveHideout();hideoutEditing=false;hideoutPage()}else mbHomeExit()});const rewards=[...q.querySelectorAll('.hideoutPrimary button')].find(b=>b.textContent===tr('Stamps & rewards','印章与奖励'));if(rewards)rewards.onclick=()=>{hideoutClaimPage();mbHomePageBack(tr('‹ My room','‹ 返回小窝'),hideoutPage)}}return r};
const mbHomeMarketBefore=furnitureMarket;furnitureMarket=function(back='shop'){const r=mbHomeMarketBefore(back),q=$('content'),book=q.querySelector('.komorebiBook');if(!book)return r;mbHomePageBack(back==='room'?tr('‹ My room','‹ 返回小窝'):back==='wallet'?tr('‹ My purse','‹ 返回钱包'):tr('‹ Shop','‹ 返回店里'),()=>{if(back==='room')hideoutPage();else if(back==='wallet')pawWalletPage();else {$('page').style.display='none';updateHUD()}});const header=book.querySelector('.komorebiHead');if(header){const art=element('img','',header,'mbFurnitureShopArt');art.src=destinationPortrait('island');art.alt='';art.loading='lazy';header.prepend(art)}return r};
const mbHomeConfirmBefore=furnitureConfirm;furnitureConfirm=function(id,back='shop'){const r=mbHomeConfirmBefore(id,back);mbHomePageBack(tr('‹ Catalogue','‹ 返回家具目录'),()=>furnitureMarket(back));return r};
const mbHomeProfileBefore=hideoutProfilePage;hideoutProfilePage=function(draft=null){const origin=draft?.origin||lifeProfile,r=mbHomeProfileBefore(draft);mbHomePageBack(origin===hideoutPage?tr('‹ My room','‹ 返回小窝'):origin===renderTravellerBag?tr('‹ Bag','‹ 返回背包'):tr('‹ Profile','‹ 返回档案'),origin);return r};
const mbHomeProfileBookBefore=lifeProfile;lifeProfile=function(...args){const r=mbHomeProfileBookBefore(...args),book=$('content').querySelector('.journalProfileBook');if(book){const direct=b(book,tr('Visit my home','回我的小窝'),()=>mbOpenOwnHome(lifeProfile,['‹ Profile','‹ 返回档案']));direct.className='mbHomeDirect';book.querySelector('.journalQuickStats')?.after(direct)}return r};$('profileHud').onclick=lifeProfile;
$('dockRoom').onclick=myRoom;
const mbHomeReadability=document.createElement('style');mbHomeReadability.textContent=`
#game #dock{width:min(620px,calc(100% - 12px))!important;gap:2px!important}
#game #dock button{min-width:0!important;flex:1 1 0!important;white-space:normal!important;font-size:clamp(10px,2.7vw,13px)!important;line-height:1.2!important;padding:4px 1px!important}
#game #dockOwnHome .dockIcon{display:grid;place-items:center;height:25px}
#game #hudPortrait{object-fit:contain!important;object-position:center!important;border-radius:5px!important;background:#edddbd!important}
#content .mbHomeDirect{display:block;width:100%;min-height:48px;margin:9px 0!important;background:#526a55!important;color:#fff2db!important;border:1px solid #3f5944!important;font:600 15px/1.35 system-ui!important}
#content .hideoutRibbon .hideoutProfile img{width:56px!important;height:76px!important;object-fit:contain!important;border-radius:5px!important;background:#e8d8b9!important}
#content .journalIdentity>img,#content .travellerEditHeading>img,#content .travellerEditChoices img{object-fit:contain!important;object-position:center!important;border-radius:4px!important}
#content .travellerEditHeading>img{height:135px!important;width:100px!important}
#content .travellerEditChoices img{height:118px!important;width:100%!important}
#content .komorebiBook,#content .komorebiConfirm{box-sizing:border-box;width:100%;max-width:850px;margin:0 auto;padding:clamp(9px,2.6vw,18px)!important;color:#3d3328!important;background:#f3e6cf!important}
#content .komorebiHead{font:15px/1.45 system-ui!important;color:#40372b!important}
#content .komorebiHead strong{font-size:17px!important}
#content .komorebiHead small{font-size:13px!important}
#content .mbFurnitureShopArt{display:block;width:100%;height:clamp(76px,19vw,125px);object-fit:cover;object-position:50% 40%;border:3px solid #fff4dd;box-sizing:border-box;margin:0 0 9px;border-radius:3px}
#content .komorebiBook .journalFilterTabs{display:flex!important;flex-wrap:wrap!important;gap:5px!important;margin:10px 0!important}
#content .komorebiBook .journalFilterTabs button{flex:0 1 auto!important;min-width:0!important;min-height:44px!important;padding:6px 10px!important;white-space:normal!important;font:14px/1.3 system-ui!important;color:#4a3d2e!important;background:#fdf1da!important;border:1px solid #ab8d62!important}
#content .komorebiBook .journalFilterTabs button[aria-pressed=true]{color:#fff5df!important;background:#536c55!important}
#content .komorebiGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
#content .komorebiTile{min-width:0!important;height:auto!important;box-sizing:border-box;padding:9px!important;gap:7px!important;background:#fff5df!important;color:#3d3328!important}
#content .komorebiTile[hidden]{display:none!important}
#content .komorebiTile img{display:block;height:clamp(85px,23vw,125px)!important;object-fit:contain!important;width:100%!important}
#content .komorebiTile strong,#content .komorebiTile small{display:block!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;overflow-wrap:anywhere!important;font:14px/1.35 system-ui!important;color:#493b2e!important}
#content .komorebiTile strong{font-weight:650!important;font-size:15px!important}
#content .komorebiTile button,#content .komorebiConfirm button{min-height:44px!important;min-width:0!important;width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;font:600 14px/1.35 system-ui!important;padding:8px 5px!important;color:#fff3dc!important;background:#526a55!important;border:1px solid #3f5944!important}
#content .komorebiTile button:disabled,#content .komorebiConfirm button:disabled{background:#e4d6b9!important;color:#554c3c!important;opacity:1!important}
#content .hideoutRoomView .hideoutFurnitureTray button{flex:0 0 116px!important;min-height:108px!important;white-space:normal!important;overflow-wrap:anywhere!important;padding:6px!important;color:#3d3328!important}
#content .hideoutFurnitureTray small{font:14px/1.35 system-ui!important;color:#3d3328!important;display:block!important;white-space:normal!important}
#content .hideoutRoomView .hideoutTools{flex-wrap:wrap!important}
#content .hideoutRoomView .hideoutTools button,#content .komorebiRoomTabs button{font-size:14px!important;white-space:normal!important;min-height:44px!important}
@media(min-width:760px){#content .komorebiGrid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
`;document.head.append(mbHomeReadability);

/* Furniture catalogue: a physical swatch book rather than an unrelated map
   postcard. Retain the existing asset source, ownership and purchase handlers. */
function mbFurnitureMatches(name,query){
 const normalize=v=>String(v||'').normalize('NFKC').toLocaleLowerCase().trim();
 const q=normalize(query);return !q||normalize(name).includes(q)
}
let mbFurnitureQueryContext=null,mbFurnitureQuery='';
const mbCatalogueVisualBefore=furnitureMarket;
furnitureMarket=function(back='shop'){
 if(mbFurnitureQueryContext!==back){mbFurnitureQueryContext=back;mbFurnitureQuery=''}
 const result=mbCatalogueVisualBefore(back),book=$('content').querySelector('.komorebiBook');
 if(!book)return result;
 book.querySelector('.mbFurnitureShopArt')?.remove();
 const head=book.querySelector('.komorebiHead'),grid=book.querySelector('.komorebiGrid');
 if(!head||!grid)return result;
 const catalogue=furnitureCatalogue();
 const caption=element('p',tr('Choose a piece to see it up close before buying.','挑一件喜欢的家具，先看细节再决定。'),head,'mbCatalogueCaption');
 const filters=book.querySelectorAll('.journalFilterTabs');
 if(filters[0]){filters[0].setAttribute('role','group');filters[0].setAttribute('aria-label',tr('Furniture style','家具风格'))}
 if(filters[1]){filters[1].setAttribute('role','group');filters[1].setAttribute('aria-label',tr('Furniture category','家具分类'))}
 const searchRow=element('div','',book,'mbCatalogueSearch');
 const label=element('label',tr('Find furniture','找家具'),searchRow);label.htmlFor='mbFurnitureSearch';
 const input=element('input','',searchRow);input.id='mbFurnitureSearch';input.type='search';input.placeholder=tr('e.g. lamp, futon','例如：台灯、床铺');input.autocomplete='off';input.value=mbFurnitureQuery;
 const count=element('small','',searchRow,'mbCatalogueCount');count.setAttribute('aria-live','polite');
 grid.before(searchRow);
 const tiles=[...grid.querySelectorAll('.komorebiTile')].map(tile=>{
  const name=tile.querySelector('strong')?.textContent||'',v=catalogue.find(v=>tr(v[1],v[2])===name);
  const image=tile.querySelector('img');
  if(image){const mat=element('div','',tile,'mbFurnitureMat');image.before(mat);mat.append(image);image.loading='lazy';image.decoding='async';image.alt=name}
  if(v){tile.dataset.furnitureId=v[0];tile.dataset.owned=String(furnitureOwned(v[0]));const style=furnitureStyle(v[0]);if(style==='japanese'||style==='chinese'){const tag=element('small',style==='japanese'?tr('Japanese style','和风'):tr('Chinese style','中式'),tile,'mbFurnitureStyleTag');tile.querySelector('strong')?.after(tag)}}
  return {tile,hidden:tile.hidden,name:v?v[1]+' '+v[2]+' '+name:name};
 });
 const empty=element('p','',grid,'mbCatalogueNoResults');
 function filter(){
  let visible=0;for(const entry of tiles){entry.tile.hidden=entry.hidden||!mbFurnitureMatches(entry.name,input.value);if(!entry.tile.hidden)visible++}
  count.textContent=tr('Pieces shown: ','显示家具：')+visible;
  empty.hidden=visible>0||!input.value.trim();
  empty.textContent=tr('No matching furniture. Try a different name.','没找到这件家具，换个名字试试。');
  const existing=grid.querySelector('.mbArtEmpty');if(existing)existing.hidden=!!input.value.trim();
 }
 input.addEventListener('input',()=>{mbFurnitureQuery=input.value;filter()});filter();
 return result
};
function mbFurnitureQuote(balance,cost,owned){if(!Number.isFinite(balance)||!Number.isFinite(cost)||balance<0||cost<0)return null;return {remaining:owned?balance:Math.max(0,balance-cost),shortage:owned?0:Math.max(0,cost-balance)}}
const mbFurnitureDetailBefore=furnitureConfirm;
furnitureConfirm=function(id,back='shop'){
 const result=mbFurnitureDetailBefore(id,back),card=$('content').querySelector('.komorebiConfirm');
 if(!card)return result;
 const image=card.querySelector('img'),v=furnitureCatalogue().find(v=>v[0]===id);
 if(image){const mat=element('div','',card,'mbFurnitureDetailMat');image.before(mat);mat.append(image);image.alt=v?tr(v[1],v[2]):''}
 if(v){const note=element('p',v[4]==='extension'?tr('Adds a new room to your home.','给小窝扩建一个新房间。'):v[4]==='finish'||v[4]==='floor'?tr('Apply this finish in the room editor after purchase.','购买后可在小窝布置中更换。'):tr('Arrange this piece in your room after purchase.','购买后可在小窝里自由摆放。'),card,'mbFurnitureUseNote');card.querySelector('h2')?.after(note);
  const quote=mbFurnitureQuote(hideoutBalance(),v[3],furnitureOwned(id));if(quote&&!furnitureOwned(id)){const line=element('p',quote.shortage?tr('Still needed: ','还差：')+quote.shortage+' '+tr('Paw Coins','爪爪币'):tr('Balance after purchase: ','购买后余额：')+quote.remaining+' '+tr('Paw Coins','爪爪币'),card,'mbFurnitureQuote');line.dataset.shortage=String(quote.shortage>0);card.querySelector('h2')?.after(line)}
 }
 return result
};
const mbHomeVisualBefore=hideoutPage;
hideoutPage=function(...args){
 const result=mbHomeVisualBefore(...args),q=$('content'),sceneEl=q.querySelector('.hideoutScene');
 if(!sceneEl)return result;
 const view=q.querySelector('.hideoutRoomView');
 if(view){view.dataset.editing=String(!!hideoutEditing);const tools=view.querySelector('.hideoutTools');if(tools){tools.setAttribute('role','group');tools.setAttribute('aria-label',tr('Room editing tools','小窝布置工具'))}}
 return result
};
const pawNoticeStyle=document.createElement('style');pawNoticeStyle.textContent='#content .pawWeeklyNotice{padding:8px 10px;margin:8px 0;border-left:3px solid #809374;background:#e9e4cb;color:#514638;font:14px/1.5 Georgia,serif}';document.head.append(pawNoticeStyle);
const pawReturnPolish=document.createElement('style');pawReturnPolish.textContent='#content .pawFurnitureLocation{display:block;font:11px/1.3 system-ui;color:#65533d;overflow-wrap:anywhere}#content [data-furniture-tray][data-placed=true] .pawFurnitureLocation{color:#476146}#content .pawBagReset{grid-column:1/-1;min-height:44px}#content .pawPassportNext{padding:7px 10px;border-left:3px solid #819477;background:#e7e2cb;color:#514638}#content .pawPassportUnvisited{color:#735d46}';document.head.append(pawReturnPolish);
const mbCatalogueVisualStyle=document.createElement('style');
mbCatalogueVisualStyle.textContent=`
#content .komorebiBook .komorebiHead{padding:12px!important;border:1px solid #b69a70;border-left:4px solid #927354;background:var(--town-grain),#f6ead1!important}
#content .komorebiHead .mbCatalogueCaption{margin:6px 0 0;font:14px/1.5 system-ui;color:#594936}
#content .mbCatalogueSearch{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center;margin:12px 0}
#content .mbCatalogueSearch label{font:600 14px/1.4 system-ui;color:#4e3e2d}
#content .mbCatalogueSearch input{grid-column:1/-1;grid-row:2;box-sizing:border-box;width:100%;min-height:44px;border:1px solid #aa906b;border-radius:4px;background:#fff7e7;color:#372e22;font:16px/1.4 system-ui;padding:8px 12px}
#content .mbCatalogueCount{color:#594936;font:12px/1.35 system-ui}
#content .mbFurnitureMat,#content .mbFurnitureDetailMat{display:grid;place-items:center;background:radial-gradient(ellipse at 50% 80%,#d7c09c66,transparent 70%),var(--town-grain),#f2e5cc;border:1px solid #cdb48c;border-radius:3px;box-sizing:border-box;padding:6px}
#content .mbFurnitureMat{height:clamp(92px,26vw,150px)}
#content .komorebiTile .mbFurnitureMat img{width:100%!important;height:100%!important;max-height:138px;object-fit:contain!important}
#content .komorebiTile{align-content:start!important;box-shadow:0 2px 0 #a88d6725!important}
#content .komorebiTile[data-owned=true]{border-color:#8b987c!important}
#content .komorebiTile .mbFurnitureStyleTag{font-size:12px!important;color:#655741!important}
#content .mbCatalogueNoResults{grid-column:1/-1;line-height:1.5;padding:12px;color:#594936}
#content .mbCatalogueNoResults[hidden],#content .mbArtEmpty[hidden]{display:none!important}
#content .mbFurnitureDetailMat{min-height:180px;margin:0 0 12px}
#content .mbFurnitureQuote{color:#48604b;background:#e6e8ce;border-left:3px solid #8c9a73;padding:8px 10px;font:600 14px/1.4 system-ui}#content .mbFurnitureQuote[data-shortage=true]{color:#7b4838;background:#f1dfc8;border-color:#b68b69}
#content .komorebiConfirm .mbFurnitureDetailMat img{display:block;width:min(100%,340px)!important;height:clamp(170px,38dvh,310px)!important;object-fit:contain!important}
#content .mbFurnitureUseNote{font:14px/1.5 system-ui;color:#594936}
#content .hideoutRoomView[data-editing=true] .hideoutTools{padding:7px;background:var(--town-grain),#f3e5cb;border:1px solid #bea37b;border-radius:4px;gap:6px}
#content .hideoutRoomView .hideoutTools button{flex:1 1 auto}
#content .hideoutFurnitureTray{scroll-padding-inline:10px}
@media(min-width:760px){#content .mbFurnitureMat{height:150px}#content .mbCatalogueSearch{grid-template-columns:minmax(0,1fr) auto;max-width:560px}}
`;
document.head.append(mbCatalogueVisualStyle);


/* The short transfer is a station ticket, not an extra loading step.
   Preserve the existing journey and all arrival/save logic. */
const mbIdentityCopy=[
 ['Always planning the next escape.','上班的时候，心早就去旅行了。'],
 ['Powered by coffee and annual leave.','靠咖啡续命，靠年假撑下去。'],
 ['Collects experiences, not KPIs.','只收集快乐，不收集绩效。'],
 ['No rush. The best detours are unplanned.','不赶路，随心走。']
];
function mbAvatarStanding(i){return Number.isInteger(i)&&i>=0&&i<4?(ART['walker'+i+'0']||ART['portrait'+i]):null}
function mbTravellerImage(im,i){
 const src=mbAvatarStanding(i);if(!im||!src)return;
 if(im.getAttribute('src')!==src)im.src=src;
 im.alt=tr(...names[i]);im.classList.add('mbFullTraveller');
}
function mbProfileIndex(im){
 const src=im.getAttribute('src')||'';
 return [0,1,2,3].find(i=>[ART['portrait'+i],ART['walker'+i+'0'],ART['badge'+i]].includes(src))
}
function mbStyleTravellerChoices(root){
 if(!root)return;
 const choices=[...root.querySelectorAll('button')].filter(btn=>btn.querySelector('img'));
 if(choices.length!==4)return;
 choices.forEach((btn,index)=>{
  const im=btn.querySelector('img'),i=mbProfileIndex(im)??index;
  mbTravellerImage(im,i);btn.classList.add('mbTravellerChoice');
  if(!btn.querySelector('.mbTravellerCaption')){
   const old=btn.querySelector('small');
   if(old){old.textContent=tr(...mbIdentityCopy[i]);old.classList.add('mbTravellerCaption')}
   else element('small',tr(...mbIdentityCopy[i]),btn,'mbTravellerCaption')
  }
 });
}
const mbProfileVisualBefore=hideoutProfilePage;
hideoutProfilePage=function(...args){
 const result=mbProfileVisualBefore(...args),q=$('content'),choices=q.querySelector('.travellerEditChoices'),preview=q.querySelector('.travellerEditHeading img');
 if(!choices||!preview)return result;
 mbStyleTravellerChoices(choices);
 const buttons=[...choices.querySelectorAll('button')];
 function sync(){
  const index=buttons.findIndex(btn=>btn.getAttribute('aria-pressed')==='true');
  mbTravellerImage(preview,index>=0?index:(avatar??0))
 }
 sync();choices.addEventListener('click',sync);
 return result
};
const mbProfileIdentityBefore=lifeProfile;
lifeProfile=function(...args){
 const result=mbProfileIdentityBefore(...args),q=$('content'),identity=q.querySelector('.journalIdentity,.lifeIntro');
 if(!identity)return result;
 const i=avatar??0;mbTravellerImage(identity.querySelector('img'),i);
 const bio=identity.querySelector('div')||identity;
 if(!bio.querySelector('.mbIdentityCaption'))element('p',tr(...mbIdentityCopy[i]),bio,'mbIdentityCaption');
 return result
};
$('profileHud').onclick=()=>{if(avatar!==null&&proposal.hidden&&!transitioning&&!talkOpen&&!activity)lifeProfile()};
const mbRegistrationArtObserver=new MutationObserver(()=>{
 if(proposal.hidden)return;
 // Only upgrade an actual four-choice avatar group, never a personality quiz.
 const imgs=[...proposal.querySelectorAll('button img')];
 const buttons=imgs.filter(im=>mbProfileIndex(im)!==undefined).map(im=>im.closest('button'));
 if(buttons.length!==4||new Set(buttons).size!==4)return;
 const indices=buttons.map(btn=>mbProfileIndex(btn.querySelector('img')));
 if(new Set(indices).size!==4)return;
 const parent=buttons[0].parentElement;
 if(buttons.every(btn=>btn.parentElement===parent)){parent.classList.add('mbTravellerRoster');mbStyleTravellerChoices(parent)}
});
mbRegistrationArtObserver.observe(proposal,{childList:true,subtree:true,attributes:true,attributeFilter:['src','hidden']});
let mbTransferToken=0;
function mbTransferHolding(from,to){
 const token=++mbTransferToken,overlay=element('section','',$('game'),'mbTransferHolding');
 overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 const ticket=element('div','',overlay,'mbTransferTicket');
 element('small',tr('Pawradise railway · transfer ticket','Pawradise 铁路 · 换乘车票'),ticket,'mbTransferEyebrow');
 const portrait=element('img','',ticket,'mbTransferAvatar');mbTravellerImage(portrait,avatar??0);
 const route=element('div','',ticket,'mbTransferRoute');
 const departure=element('div','',route);element('small',tr('From','出发站'),departure);element('strong',tr(...maps[from].n),departure);
 const arrival=element('div','',route);element('small',tr('Next stop','下一站'),arrival);element('strong',tr(...maps[to].n),arrival);
 element('div','',ticket,'mbTransferLine');
 const status=element('p',tr('On our way. No emails allowed.','正在前往下一站，禁止回工作消息。'),ticket,'mbTransferStatus');
 const began=performance.now();
 function tick(){
  if(token!==mbTransferToken||!transitioning||performance.now()-began>12000){overlay.remove();return}
  if(scene===to&&status.dataset.arrived!=='true'){status.dataset.arrived='true';status.textContent=tr('Welcome to your next stop.','下一站到了，欢迎下车。')}
  requestAnimationFrame(tick)
 }
 requestAnimationFrame(tick)
}
const mbTransferBefore=journey;
journey=function(destination,...args){
 const from=scene,valid=!!maps[from]&&!!maps[destination]&&from!==destination&&!transitioning;
 const result=mbTransferBefore(destination,...args);
 if(valid&&transitioning&&!$('game').querySelector('.pawRailJourney')){$('game').querySelectorAll('.mbTransferHolding').forEach(el=>el.remove());mbTransferHolding(from,destination)}
 return result
};
const mbRailHoldingBefore=openRailStop;
openRailStop=function(...args){
 const result=mbRailHoldingBefore(...args),q=$('content'),cabin=q.querySelector('.districtRailCabin');
 if(!cabin)return result;
 const im=cabin.querySelector('.mbRailPostcard img');if(im){im.classList.add('mbUncroppedPostcard')}
 const route=q.querySelector('.railRouteTicket');if(route)route.classList.add('mbRailTicketRoute');
 return result
};
const mbIdentityVisualStyle=document.createElement('style');mbIdentityVisualStyle.textContent=`
#game .mbTransferHolding{position:absolute;inset:0;z-index:40;pointer-events:none;display:grid;place-items:center;padding:16px;background:var(--town-grain),radial-gradient(ellipse at 50% 30%,#c6d1ad,#80917a 55%,#495d50);animation:mbTransferReveal .18s ease-out}
#game .mbTransferTicket{box-sizing:border-box;display:grid;gap:8px;width:min(100%,480px);max-height:94%;padding:clamp(14px,4vw,27px);background:var(--town-grain),#f4e6cb;border:1px solid #b59b74;outline:1px solid #cab28b;outline-offset:-7px;border-radius:5px;box-shadow:0 5px 24px #26372b55;color:#4b4030;text-align:center}
#game .mbTransferEyebrow{font:600 12px/1.4 system-ui;color:#755c40}
#game .mbTransferAvatar{display:block;height:clamp(80px,25dvh,220px);max-width:100%;object-fit:contain;margin:0 auto}
#game .mbTransferRoute{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
#game .mbTransferRoute>div+div{border-left:1px dashed #bca47e;padding-left:10px}
#game .mbTransferRoute small{display:block;color:#755c40;font:12px/1.4 system-ui;margin-bottom:4px}
#game .mbTransferRoute strong{display:block;font:600 clamp(17px,4.1vw,25px)/1.25 var(--town-title);overflow-wrap:anywhere}
#game .mbTransferLine{height:4px;background:#b7a180;position:relative;border-radius:2px;overflow:hidden;margin:4px 0}
#game .mbTransferLine:after{content:'';position:absolute;inset:0 auto 0 0;width:35%;background:#657e60;animation:mbTransferMove .95s ease-in-out infinite}
#game .mbTransferStatus{margin:2px 0;font:14px/1.4 system-ui;color:#594b37}
@keyframes mbTransferReveal{from{opacity:0}to{opacity:1}}
@keyframes mbTransferMove{from{transform:translateX(-100%)}to{transform:translateX(290%)}}
#content .mbUncroppedPostcard{object-fit:contain!important;object-position:center!important;background:#e2d3b6;animation:mbWholePostcardDrift 22s ease-in-out infinite alternate!important}
@keyframes mbWholePostcardDrift{from{transform:scale(.97)}to{transform:scale(1)}}
#content .mbRailTicketRoute{font:600 14px/1.5 system-ui;color:#524735;overflow-wrap:anywhere;background:#f8ecd5;border:1px dashed #b39a72;padding:10px 12px;border-radius:3px;text-align:center}
#content .travellerEditChoices,#proposal .mbTravellerRoster{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
#content .mbTravellerChoice,#proposal .mbTravellerChoice{display:flex!important;flex-direction:column;align-items:center;justify-content:flex-start;min-width:0!important;padding:8px!important;gap:5px!important;border:1px solid #b89c72!important;border-radius:5px!important;background:var(--town-grain),#f7ead1!important;color:#493b2c!important;white-space:normal!important;box-shadow:0 2px 0 #947a5125!important}
#content .mbTravellerChoice[aria-pressed=true],#proposal .mbTravellerChoice[aria-pressed=true],#proposal .mbTravellerChoice.selected{outline:2px solid #667e63;outline-offset:-3px;background:var(--town-grain),#e5e7c8!important}
#content .mbTravellerChoice img,#proposal .mbTravellerChoice img{display:block;width:100%!important;height:clamp(96px,25vw,156px)!important;object-fit:contain!important;object-position:center!important;background:transparent!important;max-height:none!important}
#content .mbTravellerChoice strong,#proposal .mbTravellerChoice strong{font:600 14px/1.35 system-ui!important;overflow-wrap:anywhere}
#content .mbTravellerCaption,#proposal .mbTravellerCaption{display:block;font:12px/1.4 system-ui!important;color:#64533f!important;overflow-wrap:anywhere;text-align:center}
#content .travellerEditHeading .mbFullTraveller{width:100%!important;height:clamp(155px,30dvh,240px)!important;background:transparent!important;object-fit:contain!important}
#content .journalIdentity>.mbFullTraveller,#content .lifeIntro>.mbFullTraveller{width:clamp(70px,23vw,130px)!important;height:clamp(110px,32vw,190px)!important;object-fit:contain!important;background:transparent!important}
#content .mbIdentityCaption{font:13px/1.45 system-ui;color:#64533f}
@media(min-width:760px){#content .travellerEditChoices,#proposal .mbTravellerRoster{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
@media(prefers-reduced-motion:reduce){#game .mbTransferHolding,#game .mbTransferLine:after,#content .mbUncroppedPostcard{animation:none!important}}
`;document.head.append(mbIdentityVisualStyle);


/* Painted railway and gate plates. Routes, travelers and copy stay independent. */
function mbJourneyPainting(record,name,portrait){
 const expected='assets/visual/painted/journey/'+name+'.webp';
 if(record?.path!==expected||!Number.isInteger(record.width)||!Number.isInteger(record.height)||record.width<400||record.height<400||record.width>2048||record.height>2048)return null;
 return (portrait?record.height/record.width:record.width/record.height)>=1.35?record:null
}
function pawRailRouteRecord(raw,id){
 if(!['fortune','home','island','wonder'].includes(id))return null;
 const layers={};
 for(const kind of ['far','near']){
  const record=raw?.[kind],path='assets/visual/painted/journey/routes/'+id+'/'+kind+'.webp';
  if(record?.path!==path||!Number.isInteger(record.width)||!Number.isInteger(record.height)||record.width<1000||record.width>4096||record.height<280||record.height>1400||record.width/record.height<2.5||!/^[a-f0-9]{64}$/.test(record.sha256||''))return null;
  layers[kind]=record
 }
 return layers.far.width===layers.near.width&&layers.far.height===layers.near.height?layers:null
}
const pawRailRouteImages=new Map();
function pawRailRouteLoad(record){
 if(!record)return Promise.resolve(null);
 const key=record.path;
 if(!pawRailRouteImages.has(key)){
  const promise=new Promise(resolve=>{
   const im=new Image();im.decoding='async';
   const done=ok=>resolve(ok&&im.naturalWidth===record.width&&im.naturalHeight===record.height?im:null);
   im.onload=()=>done(true);im.onerror=()=>done(false);im.src=key;
  }).then(im=>{if(!im)pawRailRouteImages.delete(key);return im});
  pawRailRouteImages.set(key,promise)
 }
 return pawRailRouteImages.get(key)
}
let mbJourneyPaintingsPromise;
function mbJourneyPaintings(){
 if(!mbJourneyPaintingsPromise)mbJourneyPaintingsPromise=fetch('assets/visual/painted/journey-runtime.json',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(data=>{
  if(data?.version!==1)return null;
  const routes=Object.fromEntries(['fortune','home','island','wonder'].map(id=>[id,pawRailRouteRecord(data.routes?.[id],id)]).filter(([,v])=>v));
  return {portrait:mbJourneyPainting(data.rail?.portrait,'portrait',true),landscape:mbJourneyPainting(data.rail?.landscape,'landscape',false),gate:mbJourneyPainting(data.gate,'gate',true),routes}
 }).catch(()=>null).then(data=>{
  if(!data?.portrait||!data?.landscape)mbJourneyPaintingsPromise=null;
  return data
 });
 return mbJourneyPaintingsPromise
}

/* PAW_WINDOW_MOTION_BEGIN
   Window polygons are traced against the actual 880x1320 and 1440x810
   painted carriage files. The exterior samples are taken ONLY from glass.
   Keep the complete original painting underneath; no duplicate frame,
   divider, curtain, seat or village-map texture enters the moving layer. */
const pawRailWindows={
 portrait:{width:880,height:1320,panes:[
  {q:[[174,312],[565,392],[594,535],[98,504]],speed:1},
  {q:[[88,541],[598,562],[590,731],[104,778]],speed:1},
  {q:[[726,432],[776,449],[785,544],[710,542]],speed:.62},
  {q:[[713,569],[785,572],[788,645],[706,656]],speed:.62},
  {q:[[854,468],[867,475],[870,550],[853,550]],speed:.40},
  {q:[[854,574],[874,575],[874,642],[853,645]],speed:.40}
 ]},
 landscape:{width:1440,height:810,panes:[
  {q:[[144,100],[542,186],[558,330],[89,305]],speed:1},
  {q:[[72,343],[559,357],[553,516],[58,601]],speed:1},
  {q:[[705,235],[826,267],[839,346],[685,340]],speed:.74},
  {q:[[679,359],[838,365],[836,448],[665,455]],speed:.74},
  {q:[[920,285],[960,300],[965,355],[910,353]],speed:.50},
  {q:[[910,370],[965,374],[965,428],[909,435]],speed:.50},
  {q:[[1008,307],[1026,314],[1029,359],[1005,359]],speed:.35},
  {q:[[1005,372],[1030,374],[1030,415],[1003,416]],speed:.35}
 ]}
};
function pawRailQuad(q,u,v){
 const [a,b,c,d]=q,aa=(1-u)*(1-v),bb=u*(1-v),cc=u*v,dd=(1-u)*v;
 return [a[0]*aa+b[0]*bb+c[0]*cc+d[0]*dd,a[1]*aa+b[1]*bb+c[1]*cc+d[1]*dd]
}
function pawRailUV(q,x,y){
 // Invert the bilinear projection of each trapezoidal window.
 const [a,b,c,d]=q,ax=b[0]-a[0],ay=b[1]-a[1],bx=d[0]-a[0],by=d[1]-a[1],cx=a[0]-b[0]+c[0]-d[0],cy=a[1]-b[1]+c[1]-d[1];
 let u=.5,v=.5;
 for(let i=0;i<5;i++){
  const dx=a[0]+ax*u+bx*v+cx*u*v-x,dy=a[1]+ay*u+by*v+cy*u*v-y;
  const xu=ax+cx*v,yu=ay+cy*v,xv=bx+cx*u,yv=by+cy*u,det=xu*yv-xv*yu;
  if(Math.abs(det)<.00001)return null;
  u-=(dx*yv-dy*xv)/det;v-=(dy*xu-dx*yu)/det;
 }
 return Number.isFinite(u)&&Number.isFinite(v)?[u,v]:null
}
function pawRailReflect(value){
 if(!Number.isFinite(value))return 0;
 const f=((value%2)+2)%2;return f<=1?f:2-f
}
function pawRailPaneSize(q){
 const edge=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 return [Math.max(2,Math.ceil((edge(q[0],q[1])+edge(q[3],q[2]))*.5)),Math.max(2,Math.ceil((edge(q[0],q[3])+edge(q[1],q[2]))*.5))]
}
function pawRailTravel(elapsed,mode){
 const t=Math.max(0,Number.isFinite(elapsed)?elapsed:0);
 if(mode==='ride'||mode==='transfer'||mode==='entrance')return {a:Math.min(1,t/(mode==='entrance'?8.5:3.6))*.13,b:0,mix:0};
 const period=9,phase=t%period,travel=.13*Math.min(1,phase/8);
 if(phase<=8)return {a:travel,b:0,mix:0};
 const k=phase-8;return {a:.13,b:0,mix:k*k*(3-2*k)}
}
function pawRailLayerCrop(w,h,progress,speed,aspect=1.8){
 const ratio=Number.isFinite(aspect)?Math.max(.4,Math.min(2.4,aspect)):1.8;
 const span=Math.min(w,Math.max(1,h*ratio)),travel=Math.max(0,Math.min(1,progress))*Math.max(0,Math.min(1,speed));
 return {x:(w-span)*travel,width:span,height:h}
}
/* PAW_WINDOW_MOTION_END */
/* PAW_GLASS_PROJECTION_BEGIN */
const pawRailGlassOutlines={
 portrait:[
 [[165,305],[554,387],[580,396],[592,414],[596,439],[596,539],[96,509],[120,452],[144,381]],
 [[79,536],[600,560],[600,707],[596,723],[579,738],[101,782],[87,754],[54,628],[58,583]],
 [[724,426],[773,443],[781,452],[786,548],[708,545]],
 [[710,566],[787,570],[789,646],[706,654]],
 [[854,463],[865,471],[871,551],[851,552]],[[853,571],[874,574],[874,643],[852,647]]
 ],
 landscape:[
 [[139,95],[542,186],[552,195],[560,214],[560,334],[89,306],[110,244],[129,167]],
 [[73,343],[562,358],[562,504],[557,520],[543,532],[57,611],[24,467],[29,426]],
 [[700,231],[825,263],[836,274],[841,347],[684,340]],
 [[677,358],[840,366],[841,450],[664,456]],
 [[918,281],[959,296],[966,356],[910,354]],[[909,370],[966,374],[966,430],[908,436]],
 [[1007,305],[1026,312],[1030,360],[1004,359]],[[1004,372],[1031,375],[1031,415],[1003,419]]
 ]
};
function pawGlassExtent(outlines){
 const points=outlines.flat(),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const x=Math.min(...xs),y=Math.min(...ys);
 return {x,y,w:Math.max(...xs)-x,h:Math.max(...ys)-y}
}
function pawGlassCrop(iw,ih,w,h,progress,speed=1){
 if(![iw,ih,w,h].every(v=>Number.isFinite(v)&&v>0))return null;
 const scale=Math.max(w/iw,h/ih),sw=Math.min(iw,w/scale),sh=Math.min(ih,h/scale);
 const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0)),v=Math.max(0,Math.min(1,speed));
 return {x:(iw-sw)*(.08+.84*p*v),y:(ih-sh)*.5,w:sw,h:sh}
}
/* PAW_GLASS_PROJECTION_END */
const pawRailMotionJobs=new WeakMap();
// Travel is one-directional for the entire ride, including delayed map decoding.
function pawRailRideProgress(elapsed,duration=3.6){
 const t=Math.max(0,Number.isFinite(elapsed)?elapsed:0);
 const span=Number.isFinite(duration)&&duration>0?duration:3.6;
 // Approach the far end without reversing or visibly freezing during a slow arrival.
 return Math.min(1-Number.EPSILON,1-Math.exp(-t/(span*.65)))
}
function pawMountRouteGlass(stage,layout,host,layers){
 const cfg=pawRailWindows[layout],outlines=pawRailGlassOutlines[layout],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(!cfg||!outlines||!layers?.far||reduce.matches)return false;
 const box=pawGlassExtent(outlines),canvas=document.createElement('canvas'),ratio=Math.min(1,1200/cfg.width);
 canvas.width=Math.round(cfg.width*ratio);canvas.height=Math.round(cfg.height*ratio);
 canvas.className='pawMovingGlass';canvas.setAttribute('aria-hidden','true');
 const g=canvas.getContext('2d');if(!g)return false;
 g.scale(canvas.width/cfg.width,canvas.height/cfg.height);g.beginPath();
 for(const poly of outlines){g.moveTo(...poly[0]);for(const p of poly.slice(1))g.lineTo(...p);g.closePath()}
 g.clip();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 let raf=0,dead=false,last=null,elapsed=0,frames=0,lastDraw=-Infinity;
 const draw=()=>{g.clearRect(box.x,box.y,box.w,box.h);
  for(const [key,speed] of [['far',layers.near?.naturalWidth ? .32 : 1],['near',1]]){
   const im=layers[key];if(!im?.naturalWidth)continue;
   const c=pawGlassCrop(im.naturalWidth,im.naturalHeight,box.w,box.h,pawRailRideProgress(elapsed,Number(host.dataset.rideSeconds)||3.6),speed);
   if(c)g.drawImage(im,c.x,c.y,c.w,c.h,box.x,box.y,box.w,box.h)
  }
  canvas.dataset.frame=String(++frames);canvas.dataset.travel=elapsed.toFixed(3)
 };
 const stop=()=>{dead=true;cancelAnimationFrame(raf);canvas.remove()};
 const tick=now=>{
  if(dead||!stage.isConnected||stage.hidden||stage.dataset.layout!==layout||reduce.matches){stop();if(stage.isConnected)stage.dataset.railMotion='still';return}
  const dt=last===null?0:Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  if(!document.hidden&&host.dataset.sceneryPaused!=='true'){elapsed+=dt;if(now-lastDraw>=33){draw();lastDraw=now}}
  raf=requestAnimationFrame(tick)
 };
 draw();stage.append(canvas);stage.dataset.railMotion=layers.near?'route-parallax':'route-panorama';pawRailMotionJobs.set(stage,{stop});raf=requestAnimationFrame(tick);return true
}
function pawRailMakePane(pane,ratio,source,w,h){
 const q=pane.q.map(p=>p.map(v=>v*ratio)),[tw,th]=pawRailPaneSize(q);
 const texture=new Uint8ClampedArray(tw*th*4);
 // Rectify the painted glass to its own image strip once, before animation.
 // Samples can never come from outside this pane's original glass.
 for(let j=0;j<th;j++)for(let i=0;i<tw;i++){
  const [x,y]=pawRailQuad(q,i/(tw-1),j/(th-1));
  const at=(Math.min(h-1,Math.max(0,Math.floor(y)))*w+Math.min(w-1,Math.max(0,Math.floor(x))))*4;
  const to=(j*tw+i)*4;texture[to]=source[at];texture[to+1]=source[at+1];texture[to+2]=source[at+2];texture[to+3]=255
 }
 const left=Math.max(0,Math.floor(Math.min(...q.map(p=>p[0])))),right=Math.min(w-1,Math.ceil(Math.max(...q.map(p=>p[0]))));
 const top=Math.max(0,Math.floor(Math.min(...q.map(p=>p[1])))),bottom=Math.min(h-1,Math.ceil(Math.max(...q.map(p=>p[1]))));
 const pixels=[],cols=[],rows=[],alphas=[];
 for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
  const uv=pawRailUV(q,x+.5,y+.5);if(!uv)continue;
  const [u,v]=uv;if(u<0||u>1||v<0||v>1)continue;
  const edge=Math.min(u*(tw-1),(1-u)*(tw-1),v*(th-1),(1-v)*(th-1));
  if(edge<.15)continue;
  pixels.push((y*w+x)*4);cols.push(u*(tw-1));rows.push(Math.round(v*(th-1))*tw*4);
  alphas.push(Math.round(255*Math.min(1,edge/2.4)))
 }
 return {tw,texture,pixels:Int32Array.from(pixels),cols:Float32Array.from(cols),rows:Int32Array.from(rows),alphas:Uint8Array.from(alphas),speed:pane.speed}
}
function pawRailMountMotion(stage,im,layout,host,mode,routeLayers=null){
 const old=pawRailMotionJobs.get(stage);if(old){old.stop();pawRailMotionJobs.delete(stage)}
 stage.dataset.railMotion='still';
 const cfg=pawRailWindows[layout],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(!cfg||reduce.matches||!stage.isConnected||im.naturalWidth!==cfg.width||im.naturalHeight!==cfg.height)return;
 if((mode==='ride'||mode==='entrance')&&routeLayers?.far&&pawMountRouteGlass(stage,layout,host,routeLayers))return;
 let canvas,raf=0,dead=false,elapsed=0,last=null,lastDraw=-Infinity,frames=0,lastSample='';
 const stop=()=>{dead=true;cancelAnimationFrame(raf);canvas?.remove()};
 try{
  // Bounded raster work on mobile; the high resolution carriage stays sharp.
  const ratio=Math.min(1,640/cfg.width),w=Math.round(cfg.width*ratio),h=Math.round(cfg.height*ratio);
  const buffer=document.createElement('canvas');buffer.width=w;buffer.height=h;
  const bg=buffer.getContext('2d',{willReadFrequently:true});if(!bg)return;
  bg.drawImage(im,0,0,w,h);const source=bg.getImageData(0,0,w,h).data;
  const panes=cfg.panes.map(p=>pawRailMakePane(p,ratio,source,w,h)).filter(p=>p.pixels.length);
  if(!panes.length)return;
  canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.className='pawMovingGlass';canvas.setAttribute('aria-hidden','true');
  const g=canvas.getContext('2d');if(!g)return;
  const frame=g.createImageData(w,h),out=frame.data;
  // Optional true parallax: use independent painted landscape and transparent
  // foreground layers. Sample both through one global glass mask so split
  // panes share the same horizon. Never include furniture or carriage art.
  let routeMask=null,routeCanvas=null,routeG=null;
  if(routeLayers?.far){
   routeCanvas=document.createElement('canvas');routeCanvas.width=w;routeCanvas.height=h;routeG=routeCanvas.getContext('2d',{willReadFrequently:true});
   if(routeG){
    routeMask=new Uint8ClampedArray(w*h);
    for(const p of panes)for(let i=0;i<p.pixels.length;i++)routeMask[p.pixels[i]/4]=p.alphas[i]
   }
  }
  function drawRoute(progress){
   routeG.clearRect(0,0,w,h);
   for(const [key,speed] of [['far',.32],['near',1]]){
    const art=routeLayers[key];if(!art)continue;
    const crop=pawRailLayerCrop(art.naturalWidth,art.naturalHeight,progress,routeLayers.near?speed:.8,w/h);
    routeG.drawImage(art,crop.x,0,crop.width,crop.height,0,0,w,h)
   }
   const view=routeG.getImageData(0,0,w,h).data;
   for(let p=0;p<routeMask.length;p++){
    const i=p*4;
    out[i]=view[i];out[i+1]=view[i+1];out[i+2]=view[i+2];out[i+3]=Math.round(routeMask[p]*view[i+3]/255)
   }
  }
  function draw(){
   const motion=pawRailTravel(elapsed,mode),sample=motion.a.toFixed(5)+'|'+motion.mix.toFixed(4);
   if(sample===lastSample)return;lastSample=sample;
   if(routeMask&&mode==='ride')drawRoute(Math.min(1,elapsed/3.6));
   else for(const p of panes){
    const limit=p.tw-1,travel=motion.a*p.speed,reset=motion.b*p.speed;
    for(let i=0;i<p.pixels.length;i++){
     const base=.15+.70*(p.cols[i]/limit),u=(base-travel)*limit,k=Math.floor(u),f=u-k,ix=p.rows[i]+k*4,next=p.rows[i]+Math.min(limit,k+1)*4,to=p.pixels[i];
     if(motion.mix>0){
      const v=(base-reset)*limit,j=Math.floor(v),h=v-j,from=p.rows[i]+j*4,after=p.rows[i]+Math.min(limit,j+1)*4;
      for(let c=0;c<3;c++){const a=p.texture[ix+c]+(p.texture[next+c]-p.texture[ix+c])*f,b=p.texture[from+c]+(p.texture[after+c]-p.texture[from+c])*h;out[to+c]=a+(b-a)*motion.mix}
     }else{
      out[to]=p.texture[ix]+(p.texture[next]-p.texture[ix])*f;
      out[to+1]=p.texture[ix+1]+(p.texture[next+1]-p.texture[ix+1])*f;
      out[to+2]=p.texture[ix+2]+(p.texture[next+2]-p.texture[ix+2])*f
     }
     out[to+3]=p.alphas[i]
    }
   }
   g.putImageData(frame,0,0);canvas.dataset.frame=String(++frames);canvas.dataset.travel=elapsed.toFixed(3);
  }
  function tick(now){
   if(dead||!stage.isConnected||stage.dataset.layout!==layout||reduce.matches){stop();stage.dataset.railMotion='still';return}
   const dt=last===null?0:Math.min(.16,Math.max(0,(now-last)/1000));last=now;
   if(!document.hidden&&host.dataset.sceneryPaused!=='true'){
    elapsed+=dt;if(now-lastDraw>=42){draw();lastDraw=now}
   }
   raf=requestAnimationFrame(tick)
  }
  draw();stage.append(canvas);stage.dataset.railMotion=routeMask&&mode==='ride'?(routeLayers.near?'route-parallax':'route-panorama'):'painted-window';pawRailMotionJobs.set(stage,{stop});raf=requestAnimationFrame(tick)
 }catch(e){stop();stage.dataset.railMotion='still'}
}

// Original recovered district paintings are opaque panoramas, not parallax layers.
const pawRecoveredRailSizes={fortune:[1102,347],home:[1102,349],island:[1102,275],wonder:[1102,300]};
function pawRecoveredRailRoute(id){
 if(!Object.prototype.hasOwnProperty.call(pawRecoveredRailSizes,id))return Promise.resolve(null);
 const [width,height]=pawRecoveredRailSizes[id];
 return pawRailRouteLoad({path:'assets/visual/painted/recovered/candidate-railway/'+id+'/far.webp',width,height}).then(far=>far?{far}:null)
}
async function mbMountRailPainting(host,mode){
 if(!host||host.querySelector('.mbPaintedRail'))return;
 const art=await mbJourneyPaintings();
 if(!art?.portrait||!art.landscape||!host.isConnected||host.querySelector('.mbPaintedRail'))return;
 // Prefetch route layers while carriage artwork loads. A missing route never
 // blocks boarding; only a complete pair may replace the shared scenery.
 const destination=mode==='entrance'?'fortune':host.dataset.to;
 const route=['ride','entrance'].includes(mode)?art.routes?.[destination]:null;
 const routeReady=['ride','entrance'].includes(mode)?(route?Promise.all([pawRailRouteLoad(route.far),pawRailRouteLoad(route.near)]).then(([far,near])=>far&&near?{far,near}:pawRecoveredRailRoute(destination)):pawRecoveredRailRoute(destination)):null;
 let motionVersion=0;
 const stage=element('div','',host,'mbPaintedRail');
 stage.dataset.use=mode;stage.hidden=true;stage.setAttribute('aria-hidden','true');
 const picture=element('picture','',stage);
 const wide=element('source','',picture);wide.media=pawWideArtworkMedia;wide.srcset=art.landscape.path;
 const im=element('img','',picture);im.alt='';im.decoding='async';
 // The original carriage remains the stationary frame of the window animation.
 const verify=()=>{
  const layout=['portrait','landscape'].find(key=>art[key].width===im.naturalWidth&&art[key].height===im.naturalHeight);
  stage.hidden=!layout;host.dataset.paintedRail=String(!!layout);
  if(!layout)return;
  if(mode==='entrance')proposal.dataset.paintedShot='train';
  stage.dataset.layout=layout;
  stage.style.setProperty('--rail-aspect',String(im.naturalWidth/im.naturalHeight));
  stage.style.setProperty('--rail-painting','url("'+art[layout].path+'")');
  const version=++motionVersion;
  const mount=layers=>{
   if(version===motionVersion&&stage.isConnected&&!stage.hidden&&stage.dataset.layout===layout)pawRailMountMotion(stage,im,layout,host,mode,layers)
  };
  if(routeReady){
   // A short decode budget avoids switching landscapes mid-ride. A genuine
   // fallback still animates only the original carriage glass if assets fail.
   Promise.race([routeReady,new Promise(resolve=>setTimeout(()=>resolve(null),350))]).then(mount,()=>mount(null))
  }else mount(null)
 };
 im.addEventListener('load',verify);im.addEventListener('error',()=>{pawRailMotionJobs.get(stage)?.stop();stage.hidden=true;host.dataset.paintedRail='false'});
 im.src=art.portrait.path;
 host.prepend(stage);if(im.complete&&im.naturalWidth)verify()
}
function mbMountGatePainting(hero){
 if(!hero||hero.querySelector('.mbGatePainting'))return;
 // Same scene from first paint; no manifest round-trip or fallback image swap.
 const plate=new Image();
 plate.alt='';plate.className='mbGatePainting';plate.loading='eager';plate.fetchPriority='high';
 hero.dataset.paintedGate='true';proposal.dataset.paintedShot='shrine';
 plate.src='assets/visual/painted/journey/gate.webp';hero.prepend(plate);
}
const mbRailEntranceBefore=proRender;
proRender=function(...args){
 delete proposal.dataset.paintedShot;
 const r=mbRailEntranceBefore(...args);
 if(proStep===5)mbMountRailPainting(proposal.querySelector('.rail-cabin'),'entrance');
 if(proStep===3)mbMountGatePainting(proposal.querySelector('.hero'));
 return r
};
const mbPaintedRailPreviewBefore=openRailStop;
openRailStop=function(...args){
 const r=mbPaintedRailPreviewBefore(...args);
 mbMountRailPainting($('content').querySelector('.districtRailCabin'),'preview');return r
};
const mbPaintedRailTransferBefore=mbTransferHolding;
mbTransferHolding=function(...args){
 const r=mbPaintedRailTransferBefore(...args);
 mbMountRailPainting($('game').querySelector('.mbTransferHolding'),'transfer');return r
};
const mbRailArtworkStyle=document.createElement('style');mbRailArtworkStyle.textContent=`
.mbPaintedRail[hidden],.mbGatePainting[hidden]{display:none!important}
.mbPaintedRail{position:relative;overflow:hidden;isolation:isolate}
.mbPaintedRail picture,.mbPaintedRail picture img{display:block;width:100%;height:100%}
.mbPaintedRail .pawMovingGlass{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:1}
@media(prefers-reduced-motion:reduce){.mbPaintedRail .pawMovingGlass{display:none!important}}
.mbPaintedRail:not([data-use=transfer]){width:min(100%,calc(var(--rail-height) * var(--rail-aspect)));aspect-ratio:var(--rail-aspect);margin:auto}
.mbRailPane,.mbRailPane>span{position:absolute;inset:0;pointer-events:none}
.mbRailPane>span{background:var(--rail-painting) center/100% 100%;animation:mbRailPaneGlide 8s ease-in-out infinite alternate}
.mbRailPane[data-pane=upper]>span{transform-origin:30% 34%;animation-duration:12s}
.mbRailPane[data-pane=lower]>span{transform-origin:34% 49%}
.mbPaintedRail[data-layout=portrait] .mbRailPane[data-pane=upper]{clip-path:polygon(22% 24%,65% 30%,67% 33%,67% 40%,14.5% 37.5%)}
.mbPaintedRail[data-layout=portrait] .mbRailPane[data-pane=lower]{clip-path:polygon(10% 41.5%,68% 43.5%,68% 53.5%,66% 55.5%,12.5% 58.5%,7.7% 49%)}
.mbPaintedRail[data-layout=landscape] .mbRailPane[data-pane=upper]{clip-path:polygon(10% 9%,37% 22.5%,38% 26%,38.5% 40.5%,7.5% 37.5%)}
.mbPaintedRail[data-layout=landscape] .mbRailPane[data-pane=lower]{clip-path:polygon(6% 43%,38.5% 45.5%,38.5% 62%,37.5% 64%,4.5% 75.5%,2.5% 61%)}
@keyframes mbRailPaneGlide{from{transform:translateX(0) scale(1)}to{transform:translateX(-.85%) scale(1.035)}}
#proposal[data-painted-shot] .cinema-world{display:none}
#proposal[data-painted-shot=train]{background:#30362a}
#proposal[data-shot=train] .rail-cabin[data-painted-rail=true]{display:grid;place-items:center;container-type:size;border:0;max-width:1000px;height:100%!important;background:none}
#proposal .mbPaintedRail[data-use=entrance]{--rail-height:100cqh}
#proposal .rail-cabin[data-painted-rail=true] :is(.train-window,.rail-window-sill,.rail-seat,.rail-table,.rail-passenger){display:none}
#proposal .rail-cabin[data-painted-rail=true] .rail-car-number{display:none}
#content .districtRailCabin[data-painted-rail=true]{height:auto!important;max-height:none!important;aspect-ratio:auto!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
#content .mbPaintedRail[data-use=preview]{--rail-height:clamp(195px,31dvh,370px);border-radius:3px}
#content .districtRailCabin[data-painted-rail=true] :is(.mbRailPostcard,.districtRailSeat,.railRouteCar){display:none!important}
#content .districtRailCabin[data-scenery-paused=true] .mbRailPane>span{animation-play-state:paused}
#game .mbTransferHolding .mbPaintedRail[data-use=transfer]{position:absolute;inset:0;z-index:0}
#game .mbTransferHolding .mbPaintedRail[data-use=transfer] img{object-fit:cover;object-position:center}
#game .mbTransferHolding .mbTransferTicket{position:relative;z-index:1}
#game .mbTransferHolding[data-painted-rail=true]{animation:none}
#game .mbTransferHolding[data-painted-rail=true] .mbTransferTicket{width:min(100%,380px);align-self:end;margin-bottom:clamp(6px,3dvh,28px);box-shadow:0 3px 18px #2c231b77;background:#f4e6cbf5}
#game .mbTransferHolding[data-painted-rail=true] .mbTransferAvatar{height:clamp(64px,15dvh,120px)}
#proposal[data-shot=shrine] .hero[data-painted-gate=true]{container-type:size;width:100%;height:100%;min-height:0!important;align-self:stretch}
#proposal .mbGatePainting{position:absolute;inset:0;margin:auto;width:100%;height:100%;object-fit:contain;object-position:center;border-radius:3px}
#proposal .hero[data-painted-gate=true] .shrine-ambient-lantern{display:none}
#proposal[data-shot=shrine] .hero[data-painted-gate=true] .gate-traveller{height:clamp(54px,24cqh,118px)!important;bottom:5%!important;object-position:bottom}
#proposal[data-shot=shrine] .hero[data-painted-gate=true] .gate-traveller.go{transform:translateY(-80%) scale(.59)!important;opacity:0}
@media(min-width:760px) and (min-aspect-ratio:1/1){
 #game .mbTransferHolding[data-painted-rail=true] .mbTransferTicket{justify-self:end;margin-right:clamp(14px,4vw,65px)}
}
@media(prefers-reduced-motion:reduce){.mbRailPane{display:none}}
`;document.head.append(mbRailArtworkStyle);


/* Physical station staging: preserve existing prop art and input anchors.
   Furniture is a temporary in-world support layer pending painted replacements. */
const groundedStations={
 temple:{templeWater:['stone',-3,118,95],prayer:['altar',-7,126,100],templeBell:['bell',0,128,100],sticks:['table',40,104,98],moon:['table',0,120,98]},
 tarot:{tarot:['table',-10,168,98],love:['table',-10,168,98]},
 destiny:{destiny:['table',-2,150,98]},
 kitchen:{cook:['counter',21,250,100]},
 boba:{bubbleTea:['counter',-16,138,98]},
 arcade:{claw:['cabinet',30,132,98],rhythm:['cabinet',-15,114,98],blindBox:['counter',-16,116,98],woodenThree:['table',-8,132,98],goldfishScoop:['table',5,150,98],bubbleArcade:['cabinet',-1,118,98]},
 wishes:{wishes:['rack',0,120,98],coin:['stone',12,118,98]},
 fish:{hit:['ritual',26,112,75],pier:['table',38,112,98],riverShout:['rack',8,110,98]},
 tea:{board:['notice',28,172,95],news:['notice',28,172,95]},
 office:{officeSketch:['table',28,130,98]},
 quiz:{quiz:['table',28,138,98],soulcat:['table',28,138,98]},
 story:{story:['table',28,138,98]},
 match:{match:['table',28,138,98]}
};
function groundedStationSpec(roomId,id){return groundedStations[roomId]?.[id]||null}
function drawGroundedSupport(spec,x,y){
 const [kind,top,w,foot]=spec,hw=w/2,base=y+foot,surface=y+top;
 ctx.save();
 // All supports share the actual station coordinates and end at the floor.
 ellipse(x,base,hw+8,9,'#372c2838');
 const wood=ctx.createLinearGradient(x-hw,surface,x+hw,base);
 wood.addColorStop(0,'#a38662');wood.addColorStop(.48,'#79583f');wood.addColorStop(1,'#4d3c30');
 if(kind==='bell'||kind==='rack'||kind==='notice'){
  const high=kind==='bell'?y-(room==='temple'?100:121):kind==='rack'?y-113:y-110;
  for(const dx of [-hw+10,hw-10]){
   round(x+dx-5,high,10,base-high,2,wood,'#5d4938');
   line(x+dx-2,high+4,x+dx-2,base-5,'#c5a77b',1.5)
  }
  round(x-hw,high-5,w,12,3,wood,'#584638');
  if(kind==='bell'){
   line(x,high+6,x,y-(room==='temple'?72:95),'#6b5039',4);
   // Suspended striker beside the bell, not another floating icon.
   line(x+hw-12,high+7,x+hw-23,y+6,'#92734f',1.8);
   line(x+hw-40,y+6,x+hw-8,y+6,'#785137',8);
   line(x+hw-38,y+4,x+hw-10,y+4,'#b58a55',2)
  }
  if(kind==='rack'&&room==='wishes')line(x-hw+12,y-107,x+hw-12,y-107,'#8b6948',5);
 }else if(kind==='stone'){
  const stone=ctx.createLinearGradient(x-hw,surface,x+hw,base);stone.addColorStop(0,'#a6aa94');stone.addColorStop(1,'#656e61');
  round(x-hw*.64,surface,hw*1.28,Math.max(12,base-surface-6),5,stone,'#77796a');
  round(x-hw*.85,base-13,hw*1.7,13,3,'#8f9380','#686f62');
  ellipse(x,surface,hw*.85,9,'#a9ab94')
 }else if(kind==='ritual'){
  round(x-29,surface-3,58,base-surface,4,'#827664','#5c5143');
  line(x-24,surface+7,x+24,surface+7,'#a69a82',2)
 }else{
  // Small tables, counters and cabinet bases, not uniform menu tiles.
  const solid=['altar','counter','cabinet'].includes(kind);
  if(solid){
   round(x-hw+6,surface+2,w-12,Math.max(9,base-surface-6),4,wood,'#584638');
   if(kind!=='cabinet'){
    round(x-hw+15,surface+12,w-30,Math.max(8,base-surface-24),3,'#8f6b4c','#674b35');
    line(x,surface+14,x,base-13,'#674b35',1.5)
   }
  }else{
   for(const dx of [-hw+12,hw-12]){
    line(x+dx,surface+7,x+dx,base,'#604834',7);
    line(x+dx-1,surface+10,x+dx-1,base-2,'#aa8962',1.8)
   }
   line(x-hw+12,base-15,x+hw-12,base-15,'#75583e',5)
  }
  round(x-hw,surface-5,w,12,3,'#b59a71','#785b40');
  line(x-hw+7,surface-3,x+hw-7,surface-3,'#e1c39a',1.5)
 }
 ctx.restore()
}
const groundedPropBefore=prop;
function pawDeskBook(x,y,kind){
 const cover=kind==='story'?'#836c80':kind==='match'?'#af887a':'#718775';
 ctx.save();ellipse(x,y+1,47,7,'#49362830');
 round(x-42,y-27,84,27,3,cover,'#5d5042');
 round(x-39,y-30,78,24,2,'#e7d5b1','#9b8668');
 line(x,y-29,x,y-7,'#8e785b',1.6);
 for(const d of [-1,1])for(let j=0;j<3;j++)line(x+d*5,y-24+j*5,x+d*33,y-24+j*5,'#a49173',1.1);
 ctx.restore()
}
prop=function(id,x,y){
 const spec=!activity&&groundedStationSpec(room,id);
 if(spec)drawGroundedSupport(spec,x,y);
 if(!activity&&spec&&['quiz','story','match','officeSketch'].includes(id)){pawDeskBook(x,y+spec[1],id);return}
 if(!activity&&room==='fish'&&id==='riverShout'){
  ctx.save();line(x-46,y-76,x+46,y-76,'#72553c',5);round(x-37,y-76,74,36,3,'#986b4c','#5e4632');line(x-30,y-69,x+30,y-69,'#ceb087',2);ctx.restore();return
 }
 return groundedPropBefore(id,x,y)
};
/* Keep the collision footprint on the actual support's floor contact. */
const groundedObstaclesBefore=indoorObstacles;
indoorObstacles=function(){
 const obstacles=groundedObstaclesBefore();
 if(!room||activity)return obstacles;
 const ids=room==='temple'?Object.keys(indoorSpec().stations):(roomActions[room]||[]).map(v=>v[0]);
 for(const [i,id] of ids.entries()){
  const spec=groundedStationSpec(room,id);if(!spec)continue;
  const [x,y]=indoorStation(id,i,ids.length),w=spec[2],base=y+spec[3];
  obstacles.push({l:x-w*.35,r:x+w*.35,u:base-8,d:base+4})
 }
 return obstacles
};
/* Exploration first: no fixed next-stop CTA on the walking screen.
   Existing railway doorway and Map stay available; no progress gate. */
const explorationRailStyle=document.createElement('style');
explorationRailStyle.textContent=`
#game #nextStopShortcut,#nextStopShortcut{display:none!important}
#game #worldSigns .worldSign .doorPlaque{background:linear-gradient(165deg,#79634b,#554734)!important;border:1px solid #d2b881!important;color:#fff1d3!important;border-radius:4px!important;box-shadow:0 2px 3px #33281f55,inset 0 0 0 2px #edcb961f!important}
.pawExploreRail{padding:10px 12px;border:1px solid #b5a07a;background:#f3e6cd;color:#514737;margin:10px 0;line-height:1.4}
.pawExploreRail small{display:block;margin:4px 0 8px}.pawExploreRail button{min-height:44px;white-space:normal}
`;document.head.append(explorationRailStyle);
const explorationSignBefore=syncSigns;
syncSigns=function(){
 const result=explorationSignBefore();
 nextStopButton.hidden=true;
 const sign=signButtons.get('station');
 if(sign&&!signRoot.hidden&&!sign.hidden){
  const name=tr('Railway Station','火车站');
  const plaque=sign.querySelector('.doorPlaque');
  if(plaque&&plaque.textContent!==name)plaque.textContent=name;
  if(sign.getAttribute('aria-label')!==name)sign.setAttribute('aria-label',name);
  sign.title=tr('Optional train to ','随心搭车前往')+tr(...maps[railNextDistrict(scene)].n)
 }
 return result
};
const explorationHudBefore=updateHUD;
updateHUD=function(...args){const result=explorationHudBefore(...args);nextStopButton.hidden=true;return result};
const explorationTravelBefore=travel;
travel=function(...args){
 const result=explorationTravelBefore(...args);
 if(room||activity)return result;
 const q=$('content'),grid=q.querySelector('.portraitTravelGrid');
 if(!grid||q.querySelector('.pawExploreRail'))return result;
 const section=element('section','',q,'pawExploreRail');
 element('strong',tr('Explore at your own pace','慢慢逛，不着急'),section);
 element('small',tr('Visit the little shops here first if you like. The railway is at the far end of town, and you can travel any time.','可以先逛逛这里的小店。铁路在小镇尽头，想出发时再去。'),section);
 const station=maps[scene]?.st.find(s=>s[0]==='station');
 if(station)b(section,tr('Walk to the railway','步行去车站'),()=>{
  $('page').style.display='none';updateHUD();walkDoor(station[0],station[1],station[2])
 });
 grid.before(section);return result
};
$('travel').onclick=travel;$('dockTravel').onclick=travel;


/* Physical labels and visible foot pivots: use the same stage on phone and web. */
/* PAW_FOOT_BOUNDS_BEGIN */
function pawVisibleBounds(data,w,h){
 if(!data||data.length!==w*h*4||w<2||h<2)return null;
 let left=w,right=-1,top=h,bottom=-1;
 const rows=Array(h).fill(0),cols=Array(w).fill(0);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>=100){rows[y]++;cols[x]++}
 const rowMin=Math.max(2,Math.ceil(w*.012)),colMin=Math.max(2,Math.ceil(h*.012));
 for(let y=0;y<h;y++)if(rows[y]>=rowMin){top=Math.min(top,y);bottom=y}
 for(let x=0;x<w;x++)if(cols[x]>=colMin){left=Math.min(left,x);right=x}
 if(right<left||bottom<top||(bottom-top+1)<h*.35||(right-left+1)<w*.12)return null;
 return {left:Math.max(0,left-1),right:Math.min(w,right+2),top:Math.max(0,top-1),bottom:Math.min(h,bottom+2)}
}
/* PAW_FOOT_BOUNDS_END */
const pawResidentTrim=new WeakMap();
function pawResidentCrop(im){
 if(pawResidentTrim.has(im))return pawResidentTrim.get(im);
 let result=null;
 try{
  const max=256,ratio=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.max(2,Math.round(im.naturalWidth*ratio)),h=Math.max(2,Math.round(im.naturalHeight*ratio));
  const scan=document.createElement('canvas');scan.width=w;scan.height=h;const g=scan.getContext('2d',{willReadFrequently:true});
  g.drawImage(im,0,0,w,h);const bounds=pawVisibleBounds(g.getImageData(0,0,w,h).data,w,h);
  if(bounds&&(bounds.bottom<h-1||bounds.top>1||bounds.left>1||bounds.right<w-1)){
   const sx=im.naturalWidth/w,sy=im.naturalHeight/h;
   result={x:bounds.left*sx,y:bounds.top*sy,w:(bounds.right-bounds.left)*sx,h:(bounds.bottom-bounds.top)*sy}
  }
 }catch(e){/* Untainted local raster art is expected; preserve fallback if unavailable. */}
 pawResidentTrim.set(im,result);return result
}
const pawResidentRasterBefore=drawResidentRaster;
drawResidentRaster=function(im,x,y,height,facing='right',breath=0){
 if(!im?.complete||!im.naturalWidth||!im.naturalHeight||![x,y,height].every(Number.isFinite)||height<=0)return false;
 const crop=pawResidentCrop(im);
 if(!crop)return pawResidentRasterBefore(im,x,y,height,facing,breath);
 const w=height*crop.w/crop.h,h=height*(1+Math.max(-.006,Math.min(.006,breath)));
 ctx.save();try{
  ellipse(x,y+1,Math.min(25,w*.32),Math.max(2,height*.035),'#342e2540');
  ctx.translate(x,y);ctx.scale(facing==='left'?-1:1,1);
  ctx.drawImage(im,crop.x,crop.y,crop.w,crop.h,-w/2,-h,w,h)
 }finally{ctx.restore()}return true
};
// Avoid excessive transparent padding in existing full-size resident art.
// Do not change resident identity, movement coordinates, storage or pose assets.

let pawStationPlaque=null;
const pawVisibleStationLabels=new Set();
const pawPhysicalPropBefore=prop;
prop=function(id,x,y){
 const result=pawPhysicalPropBefore(id,x,y),spec=!activity&&groundedStationSpec(room,id);
 pawStationPlaque=spec?{room,id,x,y,spec,at:t}:null;
 return result
};
function pawStationPlaqueY(y,spec){
 const [kind,top,,foot]=spec;
 if(kind==='bell')return y+foot*.80;
 if(['rack','notice'].includes(kind))return y+foot*.57;
 return y+Math.min(foot-13,top+(foot-top)*.48)
}
const pawPhysicalLabelBefore=label;
label=function(name,x,y,fn){
 const station=pawStationPlaque;pawStationPlaque=null;
 if(!station||station.room!==room||station.at!==t||activity||Math.abs(station.x-x)>2||y<station.y||y>station.y+80)return pawPhysicalLabelBefore(name,x,y,fn);
 const {id,spec}=station,short=roomPlaqueShortNames[room]?.[id];
 if(short)name=tr(...short);
 const scale=Math.max(.08,cam.scale),cy=pawStationPlaqueY(station.y,spec),width=spec[2]-16;
 const font=Math.min(21,Math.max(14,12/scale));
 ctx.save();try{
  ctx.font='600 '+font+'px Georgia, "Songti SC", serif';
  const sep=name.includes(' ')?' ':'',tokens=sep?name.split(/ +/):Array.from(name);
  const rows=[];let lineText='';
  for(const token of tokens){const candidate=lineText?lineText+sep+token:token;if(lineText&&ctx.measureText(candidate).width>width-10){rows.push(lineText);lineText=token}else lineText=candidate}
  if(lineText)rows.push(lineText);if(rows.length>2)rows.splice(1,rows.length-1,rows.slice(1).join(sep));
  const w=Math.min(width,Math.max(56,...rows.map(v=>ctx.measureText(v).width+12))),h=rows.length*font*1.06+8;
  const hitW=Math.max(w,44/scale),hitH=Math.max(h,44/scale);
  const cx=cam.ox+x*scale,sy=cam.oy+cy*scale,bounds={left:5,right:W-5,top:4,bottom:H-4};
  const blockers=[...meowUIRects,...meowTextFrameRects];
  // Reserve the visible sign itself, not its much larger touch padding.
  // Nearby residents do not make an essential activity name disappear.
  const sw=Math.max(44,w*scale),sh=Math.max(19,h*scale);
  const place=pawFixedPlaque(cx,sy,sw,sh,bounds,blockers)||meowPlaceText(cx,sy,sw,sh,bounds,blockers,Math.min(85,W*.2));
  if(!place)return;
  const px=(place.x-cam.ox)/scale,py=(place.y-cam.oy)/scale;
  meowTextFrameRects.push(place.rect);pawVisibleStationLabels.add(id);
  ctx.translate(px-x,py-cy);
  // A bracket physically attaches frame signs to both upright posts.
  if(['bell','rack','notice'].includes(spec[0]))line(x-spec[2]/2+10,cy,x+spec[2]/2-10,cy,'#72553c',5);
  const painted=pawRecoveredPlaque(ctx,x-w/2,cy-h/2,w,h);
  if(!painted){round(x-w/2,cy-h/2,w,h,3,'#66513c','#d2b881');
   for(const dx of [-w/2+4,w/2-4])ellipse(x+dx,cy-h/2+4,1.3,1.3,'#d4b987')}
  ctx.fillStyle=painted?'#503622':'#fff1d4';ctx.textAlign='center';ctx.textBaseline='middle';
  rows.forEach((v,i)=>{ctx.font='600 '+font+'px Georgia, "Songti SC", serif';const size=Math.min(font,font*(w-(painted?16:10))/Math.max(1,ctx.measureText(v).width));ctx.font='600 '+size+'px Georgia, "Songti SC", serif';ctx.fillText(v,x,cy+(i-(rows.length-1)/2)*font*1.06)});
  target(px-hitW/2,py-hitH/2,hitW,hitH,fn)
 }finally{ctx.restore()}
};
// Use canonical names at source so the DOM sign does not alternate between
// an old Next Stop label and the replacement on each layout frame.
for(const map of Object.values(maps)){const station=map.st.find(v=>v[0]==='station');if(station){station[3]='Railway Station';station[4]='火车站'}}
const pawLocalMapBefore=travel;
travel=function(...args){
 const result=pawLocalMapBefore(...args);
 if(room||activity)return result;
 const panel=$('content').querySelector('.pawExploreRail');if(!panel||panel.querySelector('.pawLocalPlaces'))return result;
 const details=element('details','',panel,'pawLocalPlaces');details.open=true;
 element('summary',tr('Places in this town','这座小镇有什么'),details);
 const list=element('div','',details,'pawLocalDoors');
 for(const [id,x,y,en,cn] of maps[scene].st){
  if(id==='station')continue;
  b(list,tr(en,cn),()=>{$('page').style.display='none';updateHUD();walkDoor(id,x,y)})
 }
 const railway=panel.querySelector(':scope > button');
 if(railway)details.after(railway);
 if(railway){const caption=element('small',tr('Onward railway: ','下一班列车：')+tr(...maps[railNextDistrict(scene)].n),panel);railway.before(caption)}
 return result
};
$('travel').onclick=travel;$('dockTravel').onclick=travel;
const pawLocalMapCss=document.createElement('style');pawLocalMapCss.textContent=`
.pawLocalPlaces{margin:7px 0 12px;border-top:1px solid #c5ac86;padding-top:5px}
.pawLocalPlaces summary{min-height:44px;align-content:center;font-weight:600;cursor:pointer}
.pawLocalDoors{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.pawLocalDoors button{min-width:0;min-height:44px;white-space:normal;overflow-wrap:anywhere;text-align:left;line-height:1.25}
@media(min-width:760px){.pawLocalDoors{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:340px){.pawLocalDoors{grid-template-columns:1fr}}
`;document.head.append(pawLocalMapCss);


/* Fortune Valley: traced stair-only resident corridor on valleyClean (039).
   World coordinates are 1000 x 1777; the upper skyline is never walkable. */
const pawStairPath=[
 [350,740,13],[405,675,21],[490,650,23],[535,574,13],
 [590,517,11],[650,410,23],[715,420,18],[760,518,10],
 [805,580,15],[880,625,24],[960,590,22],[1020,535,18],
 [1090,390,28],[1170,380,32],[1300,400,34],[1370,425,34]
];
valleyNpcPath.splice(0,valleyNpcPath.length,...pawStairPath);
function pawStairY(y){return clamp(Number.isFinite(y)?y:pawStairPath[0][0],pawStairPath[0][0],pawStairPath.at(-1)[0])}
function pawStairResident(n){
 if(scene!=='fortune'||room||n===p)return;
 n.y=pawStairY(n.y);n.ty=pawStairY(n.ty);
 n.x=residentGround(scene,n.x,n.y);n.tx=residentGround(scene,n.tx,n.ty);
}
const pawStairInitBefore=initNPC;
initNPC=function(...args){const result=pawStairInitBefore(...args);if(scene==='fortune')npc.forEach(pawStairResident);return result};
const pawStairTargetBefore=residentTarget;
residentTarget=function(n,i){
 if(scene!=='fortune'||room)return pawStairTargetBefore(n,i);
 pawStairResident(n);
 const low=pawStairPath[0][0],high=pawStairPath.at(-1)[0];
 let direction=n.walkDirection===-1?-1:1;
 if(n.y<=low+12)direction=1;if(n.y>=high-12)direction=-1;
 n.walkDirection=direction;n.ty=pawStairY(n.y+direction*(75+12*(Math.max(0,i)%3)));
 const lane=residentLane('fortune',n.ty);n.tx=lane.x+(i%2?1:-1)*lane.half*.36
};
const pawStairStepBefore=step;
step=function(n,dt,speed){
 if(scene!=='fortune'||room||n===p)return pawStairStepBefore(n,dt,speed);
 pawStairResident(n);const result=pawStairStepBefore(n,dt,speed);pawStairResident(n);return result
};
/* The station is an intentional boarding action. Retain the existing Map
   preview for deliberate destination browsing and optional daily suggestions. */
const pawStationEnterBefore=enter;
enter=function(id){
 if(id!=='station')return pawStationEnterBefore(id);
 if(transitioning||room||!proposal.hidden)return;
 releaseWalkKeys();joystickReset();stopRoute();pending=null;walkQueue=[];p.tx=p.x;p.ty=p.y;
 travellerSuggestedRoute=null;journey(railNextDistrict(scene))
};
const pawRailFadeBefore=fade;
fade=function(fn,kind='gust',destination=null){
 if(kind!=='postcard'||!maps[destination]||destination===scene)return pawRailFadeBefore(fn,kind,destination);
 if(transitioning)return;
 transitioning=true;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const game=$('game'),rideTime=reduce?650:3600,arrivalFade=reduce?0:220;
 const destinationReady=pawReadyMap(destination);
 if(!reduce)pawRecoveredRailRoute(destination);
 const old=$('fade');old.className='';old.replaceChildren();old.style.opacity='';
 game.classList.add('pawRailJourneyActive');game.querySelectorAll('.mbTransferHolding').forEach(el=>el.remove());
 // Show the carriage in the same interaction, even if the painting is still decoding.
 mbTransferHolding(scene,destination);
 const overlay=game.querySelector('.pawRailJourney');if(overlay){overlay.dataset.riding='true';overlay.dataset.rideSeconds=String(rideTime/1000)}
 let arrived=false,timer;
 async function arrive(){
   if(arrived)return;arrived=true;clearTimeout(timer);
   const finish=()=>{game.classList.remove('pawRailJourneyActive');transitioning=false;game.querySelectorAll('.pawRailJourney').forEach(el=>el.remove());updateHUD()};
   const skip=overlay?.querySelector('.pawRailSkip'),label=overlay?.querySelector('.pawRailCaption small');
   if(skip){skip.disabled=true;skip.textContent=tr('Arriving…','即将抵达…')}
   if(label)label.textContent=tr('Approaching','即将到达');
   const ready=await destinationReady;
   if(!ready){finish();toast(tr('The next station is temporarily unavailable. Try boarding again.','下一站暂时无法抵达，请重新上车。'));return}
   try{fn()}catch(err){console.error('Rail arrival',err);finish();return}
   await new Promise(resolve=>{let done=false;const finishFrame=()=>{if(!done){done=true;resolve()}};setTimeout(finishFrame,250);requestAnimationFrame(()=>requestAnimationFrame(finishFrame))});
   if(overlay){overlay.dataset.arriving='true';if(label)label.textContent=tr('Arrived at','已抵达')}
   setTimeout(finish,arrivalFade)
  }
 overlay?.querySelector('.pawRailSkip')?.addEventListener('click',arrive,{once:true});
 timer=setTimeout(arrive,rideTime)
};
mbTransferHolding=function(from,to){
 const overlay=element('section','',$('game'),'mbTransferHolding pawRailJourney');
 overlay.dataset.to=to;
 overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 const caption=element('div','',overlay,'pawRailCaption');
 element('small',tr('Bound for','开往'),caption);
 element('strong',tr(...maps[to].n),caption);
 element('span',tr('Pawradise railway','Pawradise 铁路'),caption);
 const skip=element('button',tr('Skip ride','跳过旅程'),overlay,'pawRailSkip');skip.type='button';
 // A cached painted fallback fills the viewport before the responsive source
 // finishes decoding. The shared entrance renderer adds the moving panes.
 const fallback=element('div','',overlay,'pawRailFallback');fallback.setAttribute('aria-hidden','true');
 mbMountRailPainting(overlay,'ride');
};
mbJourneyPaintings().then(art=>{if(!art)return;for(const key of ['portrait','landscape'])if(art[key]){const im=new Image();im.src=art[key].path}});
const pawRailJourneyStyle=document.createElement('style');pawRailJourneyStyle.textContent=`
#game.pawRailJourneyActive #toast{visibility:hidden!important}
#game .pawRailJourney{padding:0!important;overflow:hidden;isolation:isolate;background:#303c36!important;animation:none!important;opacity:1;transition:opacity .48s ease-out,transform .48s ease-out}
#game .pawRailJourney{container-type:size;pointer-events:auto}
#game .pawRailJourney .pawRailFallback{position:absolute;inset:0;background:#303c36 url('assets/visual/painted/journey/portrait.webp') center/contain no-repeat}
@media(min-aspect-ratio:23/20){#game .pawRailJourney .pawRailFallback{background-image:url('assets/visual/painted/journey/landscape.webp')}}
#game .pawRailJourney[data-painted-rail=true] .pawRailFallback{display:none}
#game .pawRailJourney .mbPaintedRail{position:absolute;inset:auto;left:50%;top:50%;margin:0;transform:translate(-50%,-50%);width:min(100cqw,calc(100cqh * var(--rail-aspect,.667)))!important;height:auto!important;aspect-ratio:var(--rail-aspect,.667);max-width:none!important;max-height:none!important;border-radius:0!important}
#game .pawRailJourney .mbPaintedRail picture img{object-fit:fill}
#game .pawRailJourney .mbRailPane>span{animation:pawTravelWindow 2.1s linear infinite}#game .pawRailJourney .mbRailPane[data-pane=upper]>span{animation-duration:3.1s!important}#proposal .mbPaintedRail[data-use=entrance] .mbRailPane>span{animation: pawTrainScenery 5.5s linear infinite alternate}@keyframes pawTravelWindow{from{transform:translateX(8%) scale(1.24)}to{transform:translateX(-8%) scale(1.24)}}
#game .pawRailJourney .mbRailPane[data-pane=upper]>span,#proposal .mbPaintedRail[data-use=entrance] .mbRailPane[data-pane=upper]>span{animation-duration:7.5s}
@keyframes pawTrainScenery{from{transform:translateX(.45%) scale(1.015)}to{transform:translateX(-2.3%) scale(1.07)}}
#game .pawRailJourney[data-riding=true] .pawRailCaption{animation:pawRailCaptionIn .45s ease-out both}
@keyframes pawRailCaptionIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
#game .pawRailJourney .pawRailCaption{position:absolute;z-index:2;left:50%;bottom:max(8%,env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:max-content;max-width:88%;padding:12px 22px;text-align:center;color:#fff2d3;background:#343c32df;border:1px solid #c4ab7b;border-radius:4px;box-shadow:0 3px 18px #25271f60;box-sizing:border-box}
#game .pawRailJourney .pawRailCaption small,#game .pawRailJourney .pawRailCaption span{display:block;font:12px/1.4 Georgia,"Songti SC",serif}
#game .pawRailJourney .pawRailCaption strong{display:block;font:600 clamp(22px,5vw,38px)/1.25 Georgia,"Songti SC",serif;margin:4px 0 5px;overflow-wrap:anywhere}
#game .pawRailJourney .pawRailSkip{position:absolute;z-index:6;right:max(12px,env(safe-area-inset-right,0px));top:max(12px,env(safe-area-inset-top,0px));min-height:44px;padding:8px 15px;background:#364238ed;color:#fff0d2;border:1px solid #c9b187;border-radius:5px;font:600 14px Georgia,serif}#game .pawRailJourney[data-arriving=true]{opacity:0;transform:scale(1.02);pointer-events:none;transition-duration:.22s}
#game.pawRailJourneyActive :is(#hud,#dock,#small,#worldSigns,#movePad,#moveGuide,#hint,#back){visibility:hidden!important}
#game .pawRailJourney[data-arriving=true] .pawRailCaption{animation:none}
@media(prefers-reduced-motion:reduce){#game .pawRailJourney{transition:none!important}#game .pawRailJourney[data-arriving=true]{transform:none}#game .pawRailJourney .pawRailCaption{animation:none!important}}
`;document.head.append(pawRailJourneyStyle);
/* Map selection is a deliberate boarding action, too. Optional daily
 suggestions retain their separate preview so browsing never forces travel. */
const pawDirectMapBefore=travel;
travel=function(...args){
 const result=pawDirectMapBefore(...args);
 const keys=['fortune','home','island','wonder'];
 [...$('content').querySelectorAll('.portraitTravelGrid .portraitDestination')].forEach((button,i)=>{
  const key=keys[i];if(!key)return;
  button.onclick=()=>{if(transitioning)return;if(key===scene&&!room){$('page').style.display='none';return}journey(key)};
 });
 return result
};
$('travel').onclick=travel;$('dockTravel').onclick=travel;

/* One illustrated field journal replaces the map's duplicate destination grids.
   Keep old district visits and signature stamps, record new room visits on entry. */
const pawJournalKeys=['fortune','home','island','wonder'];
const pawJournalArt={tarot:'streetTarot',destiny:'streetDestiny',temple:'streetTemple',wishes:'streetWishes',tea:'street_tea',park:'street_park',fish:'street_fish',kitchen:'street_kitchen',arcade:'street_arcade'};
const pawJournalLines={fortune:['A little peace in the hills.','山间有一处清静。'],home:['Long chats and longer naps.','有说不完的话，也有睡不完的觉。'],island:['A day off, with snacks.','休息日，当然要有好吃的。'],wonder:['Somewhere to meet yourself again.','在这里，遇见另一个自己。']};
let pawJournalVisits=load('pawJournalPlacesV1',{});if(!pawJournalVisits||Array.isArray(pawJournalVisits)||typeof pawJournalVisits!=='object')pawJournalVisits={};
const pawJournalRoomBefore=drawRoom;
drawRoom=function(){
 const result=pawJournalRoomBefore();
 if(room&&!activity&&maps[scene]?.st.some(v=>v[0]===room)&&!pawJournalVisits[room]){pawJournalVisits[room]=shrineClock().day;save('pawJournalPlacesV1',pawJournalVisits)}
 return result
};
function pawJournalSeen(district,id){
 return !!(pawJournalVisits[id]||townAnchorPlaces[district]?.door===id&&townAnchorVisits()[district]||district===scene&&room===id)
}
function pawJournalPicture(id,district){
 const key=pawJournalArt[id]||id;
 if(ART[key])return ART[key];
 const im=portraitInteriorImage(id);return im?.src||destinationPortrait(district)
}
function pawJournalRender(district=scene){
 if(!maps[district])district='fortune';
 activePage='travel';page(tr('Travel sketchbook','旅行手账'),tr('Four little worlds, yours to discover.','四个小世界，慢慢去发现。'),q=>{
  const book=element('section','',q,'pawSketchbook'),rail=element('nav','',book,'pawSketchTabs');
  rail.setAttribute('aria-label',tr('Choose a district page','选择小镇书页'));
  pawJournalKeys.forEach((k,i)=>{
   const btn=b(rail,String(i+1).padStart(2,'0')+' '+tr(...maps[k].n),()=>pawJournalRender(k));
   btn.setAttribute('aria-current',k===district?'page':'false');btn.dataset.district=k
  });
  const spread=element('article','',book,'pawSketchSpread'),cover=element('div','',spread,'pawSketchCover');
  const im=element('img','',cover);im.src=destinationPortrait(district);im.alt=tr(...maps[district].n);
  const caption=element('div','',cover,'pawSketchCaption');element('small',tr('Pawradise railway · stop ','Pawradise 铁路 · 第 ')+(pawJournalKeys.indexOf(district)+1),caption);element('h2',tr(...maps[district].n),caption);
  const stamp=element('span',district===scene?tr('YOU ARE HERE','此刻在这里'):visited.includes(district)?tr('VISITED','已到访'):tr('TO EXPLORE','待探索'),cover,'pawSketchStamp');stamp.dataset.seen=String(district===scene||visited.includes(district));
  const info=element('div','',spread,'pawSketchNotes');element('p',tr(...pawJournalLines[district]),info);
  if(district!==scene)b(info,tr('Board train','上车'),()=>{if(!transitioning)journey(district)}).className='pawSketchBoard';
  else{
   element('small',tr('Choose a place to visit, or keep wandering.','点选一个地方，或继续随心漫步。'),info);
   const station=maps[scene].st.find(v=>v[0]==='station');
   if(station)b(info,tr('Walk to the railway station','走去火车站'),()=>{$('page').style.display='none';updateHUD();pawJournalWalkToDoor(station[0],station[1],station[2])}).className='pawRailWayfinding';
   else element('small',tr('Choose another district above to take the train.','想坐火车，选择上方的其他小镇。'),info)
  }
  const doors=maps[district].st.filter(v=>v[0]!=='station'),album=element('div','',spread,'pawSketchPlaces');
  element('h3',tr('Places to explore','可以逛逛的地方'),album);
  for(const [id,x,y,en,cn] of doors){
   const row=element('figure','',album,'pawSketchPlace'),pic=element('img','',row);pic.src=pawJournalPicture(id,district);pic.alt='';pic.loading='lazy';
   pic.onerror=()=>{pic.onerror=null;pic.src=destinationPortrait(district)};
   const copy=element('figcaption','',row);element('strong',tr(en,cn),copy);
   const seen=pawJournalSeen(district,id);const tag=element('small',seen?tr('✓ Visited','✓ 已到访'):tr('Yet to explore','尚未探索'),copy,'pawSketchVisited');tag.dataset.seen=String(seen);
   if(district===scene){const btn=b(copy,room===id?tr('Return to this room','返回这里'):tr('Visit ›','去逛逛 ›'),()=>{
    if(transitioning)return;$('page').style.display='none';
    if(room===id)return;pawJournalWalkToDoor(id,x,y)
   });btn.className='pawSketchGo'}
  }
  const foot=element('div','',book,'pawSketchFoot'),idx=pawJournalKeys.indexOf(district);
  const prev=b(foot,tr('‹ Previous page','‹ 上一页'),()=>pawJournalRender(pawJournalKeys[idx-1]));prev.disabled=idx===0;
  element('small',(idx+1)+' / '+pawJournalKeys.length,foot);
  const next=b(foot,tr('Next page ›','下一页 ›'),()=>pawJournalRender(pawJournalKeys[idx+1]));next.disabled=idx===pawJournalKeys.length-1;
 });
 journalLanguage(()=>pawJournalRender(district))
}
travel=function(){return pawJournalRender(scene)};
$('travel').onclick=travel;$('dockTravel').onclick=travel;
const pawSketchCss=document.createElement('style');pawSketchCss.textContent=`
#game #page:has(.pawSketchbook){background:radial-gradient(ellipse at top,#c6a984,#6b5944)!important;padding:12px 12px max(16px,env(safe-area-inset-bottom,0px))!important;box-sizing:border-box}
#game #content:has(.pawSketchbook){max-width:970px!important;margin:0 auto!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}
#game #content:has(.pawSketchbook)>.row button{background:#4f4835!important;color:#fff3d7!important;border:1px solid #ccac82!important;min-height:44px}
#game #content:has(.pawSketchbook)>h1{color:#fff2d6!important;font:600 clamp(23px,5vw,36px)/1.2 Georgia,serif!important;text-align:center;margin:7px 0!important}
#game #content:has(.pawSketchbook)>p{display:none}
.pawSketchbook{box-sizing:border-box;position:relative;padding:12px clamp(10px,3vw,24px) 8px;background:repeating-linear-gradient(0deg,#dfcead33 0 1px,transparent 1px 22px),linear-gradient(90deg,#e2c9a0,#fff1d4 8%,#f7e7c7 96%,#ddc39c);color:#53452f;box-shadow:0 4px 0 #b39970,0 7px 0 #e5caa0,0 10px 0 #866e50,0 12px 22px #33281e55;border-radius:3px 10px 10px 3px;border-left:5px solid #8c6d4e}
.pawSketchTabs{display:flex;gap:2px;overflow-x:visible;scrollbar-width:none;border-bottom:1px solid #bda783;padding-bottom:5px}
.pawSketchTabs button{flex:1 1 0;min-width:0;overflow-wrap:anywhere;min-height:44px;white-space:normal!important;font:600 11px/1.2 Georgia,"Songti SC",serif!important;background:transparent!important;color:#796244!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:4px 5px!important}
.pawSketchTabs button[aria-current=page]{border-bottom:2px solid #627956!important;color:#344d3c!important}
.pawSketchSpread{display:grid;gap:9px;padding:12px 0 0}
.pawSketchCover{position:relative;overflow:hidden;min-height:180px;aspect-ratio:1.4;border:5px solid #fff3d9;outline:1px solid #b5a17e;box-shadow:1px 3px 6px #58482c33;transform:rotate(-.45deg)}
.pawSketchCover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 44%}
.pawSketchCaption{position:absolute;bottom:0;left:0;right:0;padding:30px 9px 9px;color:#fff3d8;background:linear-gradient(transparent,#293b2fe8)}
.pawSketchCaption h2{font:600 clamp(21px,5vw,30px)/1.1 Georgia,serif!important;margin:3px 0!important;color:#fff3d8!important}.pawSketchCaption small{font:11px/1.2 system-ui}
.pawSketchStamp{position:absolute;right:6px;top:9px;max-width:50%;padding:5px 7px;color:#836b4c;background:#fff1d7e8;border:2px dashed currentColor;transform:rotate(5deg);font:700 10px/1.3 Georgia,serif;text-align:center}.pawSketchStamp[data-seen=true]{color:#586f4e}
.pawSketchNotes p{font:italic 16px/1.4 Georgia,"Songti SC",serif;margin:5px 0!important;color:#5b503a!important}.pawSketchNotes small{font-size:12px;color:#635b46}
.pawSketchBoard{min-height:44px;width:100%;background:#526a50!important;color:#fff1d6!important;border:1px solid #3f5944!important;border-radius:3px!important;box-shadow:none!important}
.pawSketchPlaces h3{font:600 18px Georgia,serif;margin:7px 0!important;color:#4d5b43}
.pawSketchPlace{display:grid;grid-template-columns:94px minmax(0,1fr);align-items:center;gap:11px;padding:9px 0;margin:0;border-bottom:1px dashed #bda783}
.pawSketchPlace img{width:94px;height:76px;object-fit:cover;border:3px solid #fff7e4;box-sizing:border-box;box-shadow:0 1px 3px #51432a33;transform:rotate(-2deg)}
.pawSketchPlace:nth-of-type(2n) img{transform:rotate(1.5deg)}
.pawSketchPlace figcaption{min-width:0}.pawSketchPlace strong{font:600 15px/1.25 Georgia,"Songti SC",serif;display:block;color:#4d4938;overflow-wrap:anywhere}
.pawSketchVisited{display:block;margin-top:3px;font:11px system-ui;color:#88765d}.pawSketchVisited[data-seen=true]{color:#53704e;font-weight:700}
.pawSketchGo,.pawSketchFoot button{border:0!important;box-shadow:none!important;background:transparent!important;color:#3c614f!important;min-height:44px;padding:4px 0!important;text-align:left;font:600 13px Georgia,serif!important;text-decoration:underline;text-underline-offset:3px}
.pawSketchFoot{display:flex;align-items:center;justify-content:space-between;margin-top:7px}.pawSketchFoot small{color:#806b4f}.pawSketchFoot button:disabled{opacity:.35}
@media(min-width:780px){.pawSketchSpread{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:34px;background:linear-gradient(90deg,transparent 49.7%,#9a7e5633 50%,transparent 50.3%)}.pawSketchCover{grid-column:1;grid-row:1;aspect-ratio:1.05}.pawSketchNotes{grid-column:1;grid-row:2}.pawSketchPlaces{grid-column:2;grid-row:1/span 2}.pawSketchTabs button{font-size:14px!important}.pawSketchPlace{grid-template-columns:120px minmax(0,1fr)}.pawSketchPlace img{width:120px;height:90px}}
@media(prefers-reduced-motion:reduce){.pawSketchCover,.pawSketchPlace img,.pawSketchStamp{transform:none}}
`;document.head.append(pawSketchCss);

/* PAW_TOPIC_LAYOUT_BEGIN */
function pawReadingTopicSlots(){
 return Array.from({length:4},(_,i)=>({x:305+(i%2)*190,cy:419+Math.floor(i/2)*148,w:58,h:82,captionY:488+Math.floor(i/2)*148,captionW:166,captionH:42}))
}
/* PAW_TOPIC_LAYOUT_END */
function drawPawReadingTopics(){
 txt(tr('What brings you here?','今天想问什么？'),400,354,22,'#fff0d0');
 for(const [i,slot] of pawReadingTopicSlots().entries()){
  const {x,cy,w,h,captionY,captionW,captionH}=slot;
  ctx.save();ctx.shadowColor='#1f232c55';ctx.shadowBlur=5;card(x-w/2,cy-h/2,w,h,false);ctx.restore();
  const name=tr(...readingTopics[i]);ctx.save();ctx.font='600 15px Georgia,"Songti SC",serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff0d0';
  const words=name.includes(' ')?name.split(/ +/):Array.from(name),sep=name.includes(' ')?' ':'';
  const rows=[];let row='';for(const word of words){const v=row?row+sep+word:word;if(row&&ctx.measureText(v).width>captionW-12){rows.push(row);row=word}else row=v}if(row)rows.push(row);
  const lines=rows.length>2?[rows[0],rows.slice(1).join(sep)]:rows;
  lines.forEach((v,j)=>ctx.fillText(v,x,captionY+(j-(lines.length-1)/2)*17,captionW-10));
  ctx.restore();
  target(x-captionW/2,cy-h/2,captionW,captionY+captionH/2-(cy-h/2),()=>readingTopic(i))
 }
}
const pawTopicCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 const base=pawTopicCameraBefore(s,ox,oy);
 if(activity==='love'&&state.readStage==='topic'&&W<H)return mbVisualFitStage(base,[210,590,335,670],W,H<680?100:124,H-132);
 return base
};
const pawTopicHintBefore=activityHint;
activityHint=function(){if(activity==='love'&&state.readStage==='topic'){hint('Choose a topic for your reading.','选择想占卜的主题。');return}return pawTopicHintBefore()};

/* Three scene-first layouts. Coordinates describe furniture contact and
   approach positions, not detached game icons. Existing activity IDs remain. */
/* PAW_ROOM_LAYOUT_BEGIN */
const pawTempleLayout={
 templeWater:[198,548,198,682],
 prayer:[375,335,375,492],
 templeBell:[532,413,492,543],
 sticks:[610,635,610,738],
 moon:[188,353,270,495],
 secretGarden:[641,330,640,490]
};
const pawArcadeLayout={
 bubbleArcade:[210,432,210,615],
 goldfishScoop:[400,432,400,615],
 blindBox:[590,432,590,615],
 claw:[210,432,210,615],rhythm:[400,432,400,615],woodenThree:[400,432,400,615]
};
/* PAW_ROOM_LAYOUT_END */
Object.assign(indoorStages.temple.stations,pawTempleLayout);
Object.assign(indoorStages.arcade.stations,pawArcadeLayout);
groundedStations.temple.prayer=['altar',-7,172,100];
groundedStations.temple.templeWater=['stone',-3,132,95];
groundedStations.temple.templeBell=['bell',0,102,86];
groundedStations.temple.sticks=['table',-12,112,80];
roomResidentStations.temple={station:'prayer',x:311,y:614,n:['Temple keeper','庙祝'],sc:1.03,facing:'right'};
groundedStations.arcade.bubbleArcade=['cabinet',28,168,98];
groundedStations.arcade.goldfishScoop=['table',52,164,98];
groundedStations.arcade.blindBox=['counter',12,164,98];
// The garden gate is scenery and a doorway, not a central floor obstruction.
const pawThreeObstaclesBefore=indoorObstacles;
indoorObstacles=function(){
 const result=pawThreeObstaclesBefore();
 if(room==='temple'&&!activity){
  const [x,y]=pawTempleLayout.secretGarden;
  return result.filter(o=>!(Math.abs((o.l+o.r)/2-x)<2&&Math.abs((o.u+o.d)/2-(y-9.5))<3))
 }
 return result
};
function pawSceneFloorShadow(x,y,w){
 ellipse(x,y,w,8,'#362c2840')
}
function pawTempleSanctuary(){
 // Main worship hall at the head of the central aisle. Keep the altar
 // reachable from its visitor side, with the washing basin by the entrance.
 const [x,y]=pawTempleLayout.prayer;
 ctx.save();
 const gold='#d4b17b',wood='#79513c';
 round(x-103,y-133,206,130,3,'#735342','#4d3b31');
 round(x-89,y-119,178,105,2,'#4e4940',gold);
 for(const dx of [-105,105]){
  round(x+dx-6,y-143,12,143,2,wood,'#5f4635');
  line(x+dx-2,y-139,x+dx-2,y-4,'#c79c6c',1.5)
 }
 round(x-115,y-146,230,15,2,'#a87c50','#644632');
 round(x-98,y-131,196,7,2,'#c2a16d');
 // An understated shrine niche and two candle stands; no baked lettering.
 round(x-37,y-108,74,77,2,'#6b5b46',gold);
 ellipse(x,y-78,19,23,'#bda175');
 round(x-26,y-47,52,13,3,'#a48455','#d0b17b');
 for(const dx of [-67,67]){
  line(x+dx,y-24,x+dx,y-47,'#a99062',5);
  round(x+dx-4,y-59,8,16,2,'#e6d3a2');
  ellipse(x+dx,y-63,3,6,'#f4c275')
 }
 const matY=y+137;round(x-48,matY-11,96,22,3,'#8b6e62','#ad9278');
 for(let j=0;j<5;j++)line(x-43,matY-7+j*3,x+43,matY-7+j*3,'#baa087',.7);
 ctx.restore()
}
function pawTempleSideGate(){
 const [x,y]=pawTempleLayout.secretGarden;
 // A visible opening to the garden, not a label at the edge of the room.
 ctx.save();
 const left=x-37,top=y-47,w=74,base=y+125;
 ctx.beginPath();ctx.moveTo(left,base);ctx.lineTo(left,top+19);ctx.quadraticCurveTo(left,top,x,top);ctx.quadraticCurveTo(x+w/2,top,x+w/2,top+19);ctx.lineTo(x+w/2,base);ctx.closePath();
 ctx.save();ctx.clip();
 const sky=ctx.createLinearGradient(x,top,x,base);sky.addColorStop(0,'#d9dcb2');sky.addColorStop(.45,'#91b39a');sky.addColorStop(1,'#526f57');ctx.fillStyle=sky;ctx.fillRect(left,top,w,base-top);
 for(let i=0;i<7;i++){const xx=left+9+(i*23)%60,yy=top+27+(i*11)%35;ellipse(xx,yy,11+i%3,14,['#607d59','#8b9d71','#a4b48b'][i%3]);line(xx,yy+6,xx,yy+25,'#716c4e',1.5)}
 ellipse(x-22,y+15,20,18,'#526f53');ellipse(x+25,y+10,21,25,'#678b61');
 ctx.beginPath();ctx.moveTo(x-6,y+30);ctx.lineTo(x+5,y+30);ctx.lineTo(x+30,base);ctx.lineTo(x-29,base);ctx.closePath();ctx.fillStyle='#d3c5a3';ctx.fill();
 ctx.restore();ctx.strokeStyle='#704b35';ctx.lineWidth=7;ctx.stroke();
 for(const dx of [-37,37]){line(x+dx,top+15,x+dx,base,'#805a3c',6);line(x+dx-1,top+17,x+dx-1,base-2,'#c9aa77',1)}
 round(x-44,top-8,88,9,2,'#956b49','#5e4734');round(x-42,base-1,84,7,2,'#ad9d7a','#776d55');
 ctx.restore()
}
const pawTempleBackdropBefore=templeRitualBackground;
templeRitualBackground=function(){
 pawTempleBackdropBefore();
 if(room==='temple'&&!activity){pawTempleSanctuary();pawTempleSideGate()}
};
const pawThreePropBefore=prop;
prop=function(id,x,y){
 if(room==='temple'&&!activity&&id==='templeBell'){
  const spec=groundedStationSpec(room,id);drawGroundedSupport(spec,x,y);
  templeBellArt(x,y-16,.37);pawStationPlaque={room,id,x,y,spec,at:t};return
 }
 if(activity)return pawThreePropBefore(id,x,y);
 const spec=groundedStationSpec(room,id);
 if(room==='arcade'&&['bubbleArcade','goldfishScoop','blindBox'].includes(id)&&spec){
  const foot=y+spec[3];pawSceneFloorShadow(x,foot,82);
  ctx.save();
  if(id==='bubbleArcade'){
   // Same cabinet used during play, scaled to its full standing footprint.
   ctx.translate(x,y+11);ctx.scale(.5,.5);nostalgiaCabinet(0,0,false);
   for(let j=0;j<5;j++)nostalgiaOrb(-72+j*35,-75+(j%2)*22,j%4,14);
   line(-56,129,-56,107,'#b4a17b',6);ellipse(-56,104,11,9,'#a95149');
   ellipse(65,123,14,9,'#d4af70')
  }else if(id==='goldfishScoop'){
   // Existing fish tank includes its own legs. No second table underneath.
   festivalTank(x,y+63,.54);
   line(x-57,y+36,x-20,y+10,'#b98f62',3);
   ellipse(x-18,y+8,13,10,'#eee5d499')
  }else{
   // A shelf of boxes, with the selected parcel resting on the counter.
   drawGroundedSupport(spec,x,y);
   round(x-72,y-99,144,106,3,'#805d42','#594335');
   round(x-63,y-90,126,81,2,'#b59870','#70533d');
   for(const yy of [y-49,y-9]){
    round(x-66,yy,132,7,2,'#c3a87b','#71543f');
    for(let j=0;j<3;j++)boxArt(x-42+j*42,yy-3,.37,(j+1)%3)
   }
   boxArt(x,y+6,.55,1)
  }
  ctx.restore();pawStationPlaque={room,id,x,y,spec,at:t};return
 }
 if(room==='wishes'&&id==='coin'&&spec){
  // Reuse the painted stone basin instead of the generic star tile.
  drawGroundedSupport(spec,x,y);
  ctx.save();ctx.translate(x,y-15);ctx.scale(.66,.66);templeBasin(0,0);ctx.restore();
  ctx.save();round(x-24,y+41,48,13,4,'#ba9868','#6b533d');ellipse(x,y+41,12,6,'#bc8f41');ellipse(x,y+40,9,4,'#e5bf66');ctx.restore();
  pawStationPlaque={room,id,x,y,spec,at:t};return
 }
 return pawThreePropBefore(id,x,y)
};
// Keep the room-scale bell below the roof lanterns; during the ritual keep the rim at striker height.
const pawBellFitBefore=templeBellArt;
templeBellArt=function(x,y,sc=1,angle=0){if(activity==='templeBell'&&sc>1){const small=.86,base=y+(sc-small)*52;ctx.save();line(x,y-104*sc,x,base-104*small,'#77614a',4);ctx.restore();return pawBellFitBefore(x,base,small,angle)}return pawBellFitBefore(x,y,sc,angle)};
// Make the existing painted keeper part of the shrine, with a clear floor position.
const pawShrineResidentDraw=drawRoom;
drawRoom=function(){
 const result=pawShrineResidentDraw();
 if(room==='temple'&&!activity&&indoorReady()){
  const actor=roomResidentStations.temple;
  if(actor&&residentArtworkImage(residentArtworkRecord(actor.n))?.complete){
   target(actor.x-24,actor.y-101,48,103,()=>{if(!indoorReady())return;indoorDestination(340,630,()=>{hint('The keeper welcomes you. The garden is through the right-hand doorway.','庙祝欢迎你。后院就在右边的小门。');residentGreetingToast(residentNamedGreeting('The garden is open. Take your time here.','后院开着呢，慢慢走。'))},'left')})
  }
 }
 return result
};
const pawGateLabelBefore=label;
label=function(name,x,y,fn){
 if(room==='temple'&&!activity&&Math.abs(x-pawTempleLayout.secretGarden[0])<2){
  const cy=pawTempleLayout.secretGarden[1]-65;
  ctx.save();round(x-45,cy-15,90,30,3,'#4e6048','#e1c58a');activityFitText(tr('Garden →','后院 →'),x,cy,16,80,'#fff2d6');ctx.restore();pawVisibleStationLabels.add('secretGarden');
  target(x-45,cy-18,90,208,fn);return
 }
 return pawGateLabelBefore(name,x,y,fn)
};
/* Arcade art is a full backdrop, with separately interactive cabinets. */
const pawArcadeArt=new Image();pawArcadeArt.src='assets/visual/arcade-interior-v2.svg';
function pawArcadeBackdrop(){
 const b=livingBounds();if(!pawArcadeArt.complete||!pawArcadeArt.naturalWidth)return false;
 ctx.save();cover(pawArcadeArt,b.x,b.y,b.w,b.h);
 // The old dark activity wash obscured the arcade. Keep warm peripheral light.
 const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);g.addColorStop(0,'#b99c6c12');g.addColorStop(1,'#614d3212');ctx.fillStyle=g;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.restore();return true
}
const pawArcadePortraitBefore=paintPortraitInterior;
paintPortraitInterior=function(id){if(id==='arcade'&&pawArcadeBackdrop())return;return pawArcadePortraitBefore(id)};
const pawArcadeLivingBefore=paintLivingBackdrop;
paintLivingBackdrop=function(im){if(room==='arcade'&&pawArcadeBackdrop())return;return pawArcadeLivingBefore(im)};
const pawArcadeWarmBefore=warmRoomArt;
warmRoomArt=function(id){if(id==='arcade'&&pawArcadeBackdrop())return true;return pawArcadeWarmBefore(id)};
const pawArcadeShadeBefore=shadeLivingBackdrop;
shadeLivingBackdrop=function(g){
 if(room==='arcade'&&activity&&typeof g==='string'&&/^#[0-9a-f]{8}$/i.test(g))g=g.slice(0,7)+'26';
 return pawArcadeShadeBefore(g)
};
/* Wishing garden: retain the actual aiming physics and koi simulation, but
   remove the cream document layout. Water, park art and controls coexist in
   a single full-viewport scene. The original garden composition is interim. */
const pawGardenPageBefore=wishPond9;
wishPond9=function(...args){
 const result=pawGardenPageBefore(...args),q=$('content'),stage=q.querySelector('.pawWishGarden'),pond=q.querySelector('.wishRitual');
 if(!stage||!pond)return result;
 const art=portraitInteriorImage('wishes');
 if(art?.src)stage.style.setProperty('--pawGardenArt','url("'+art.src+'")');
 const footer=element('div','',q,'pawGardenFooter');
 const message=stage.querySelector('.wishMessage'),power=stage.querySelector('.wishPower'),guide=stage.querySelector('.wishThrowGuide');
 if(message)footer.append(message);if(power)footer.append(power);
 if(guide){guide.textContent=tr('Swipe up from the coin, or toss gently.','从铜钱向上滑动，或轻轻投币。');footer.prepend(guide)}
 const actions=element('div','',footer,'pawGardenActions');
 for(const node of [...q.children])if(node.tagName==='DETAILS'||node.tagName==='BUTTON')actions.append(node);
 const tray=element('i','',pond,'pawCoinTray');tray.setAttribute('aria-hidden','true');
 const language=q.querySelector(':scope > .row button:last-child');if(language)language.onclick=()=>{zh=!zh;save('zh',zh);document.documentElement.lang=zh?'zh':'en';updateHUD();wishPond9()};
 return result
};
const pawThreeSceneCss=document.createElement('style');
pawThreeSceneCss.textContent=`
#game #page:has(.pawWishGarden){position:absolute!important;inset:0!important;width:100%!important;height:100%!important;box-sizing:border-box!important;padding:0!important;margin:0!important;overflow:hidden!important;background:#42594b!important}
#game #content:has(.pawWishGarden){position:relative!important;display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;isolation:isolate;color:#fff1d4!important}
#game #content:has(.pawWishGarden)>.row{position:absolute;z-index:4;top:max(8px,env(safe-area-inset-top,0px));left:12px;right:12px;margin:0!important;display:flex;justify-content:space-between}
#game #content:has(.pawWishGarden)>.row button{background:#35493eea!important;color:#fff1d4!important;border:1px solid #b69c71!important;min-height:44px}
#game #content:has(.pawWishGarden)>h1{position:absolute;z-index:2;top:61px;left:14px;right:14px;margin:0!important;text-align:center;color:#fff2d3!important;font:600 clamp(22px,5vw,34px)/1.2 Georgia,"Songti SC",serif;text-shadow:0 2px 5px #24382e;border:0!important;pointer-events:none}
#game #content:has(.pawWishGarden)>p{display:none!important}
#game #content .pawWishGarden{position:absolute!important;inset:0!important;display:grid!important;place-items:center;width:100%!important;height:100%!important;max-width:none!important;box-sizing:border-box!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:linear-gradient(#253a2d22,#283d3155),var(--pawGardenArt,url('assets/visual/daydream-park.svg')) center/cover no-repeat!important}
#game #content .pawWishGarden .wishRitual{box-sizing:border-box!important;width:min(97%,calc((100dvh - 162px) * .83),610px)!important;height:auto!important;max-height:none!important;min-height:0!important;aspect-ratio:4/5!important;transform:translateY(-12px);margin:0!important;border:clamp(7px,2vw,13px) solid #999781!important;border-radius:45% 45% 27% 27% / 19% 19% 17% 17%!important;box-shadow:0 10px 20px #263b2c80,inset 0 0 15px #203b31aa!important;background-color:#345f56!important}
#game #content .pawGardenFooter{position:absolute;z-index:3;left:0;right:0;bottom:0;padding:9px max(12px,env(safe-area-inset-left,0px)) max(10px,env(safe-area-inset-bottom,0px));box-sizing:border-box;background:linear-gradient(transparent,#263a30ed 28%);text-align:center;color:#fff0d1}
#game #content .pawGardenFooter .wishThrowGuide,#game #content .pawGardenFooter .wishMessage{margin:3px auto!important;padding:0!important;min-height:0!important;max-width:620px;color:#fff0d1!important;background:none!important;border:0!important;font:500 13px/1.35 Georgia,"Songti SC",serif!important;text-shadow:0 1px 3px #24342b}
#game #content .pawGardenFooter .wishPower{height:5px!important;width:min(45%,240px)!important;margin:5px auto!important}
#game #content .pawGardenActions{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
#game #content .pawGardenActions>button,#game #content .pawGardenActions summary{background:transparent!important;color:#fff0d1!important;border:0!important;border-radius:0!important;box-shadow:none!important;min-height:44px;padding:6px;text-decoration:underline;text-underline-offset:3px;font:500 13px/1.25 Georgia,"Songti SC",serif;cursor:pointer}
#game #content .pawGardenActions>button[hidden]{display:none!important}
#game #content .pawGardenActions details[open]{position:absolute;bottom:100%;left:12px;right:12px;background:#35493ef7;padding:8px;border:1px solid #b49a70;max-height:35dvh;overflow:auto}
#game #content .pawCoinTray{position:absolute;left:50%;top:86%;width:clamp(58px,18%,85px);height:clamp(28px,8%,40px);transform:translate(-50%,-50%);background:linear-gradient(165deg,#d2b88a,#967449);border:2px solid #7f684e;border-radius:45%;box-shadow:0 4px 6px #26382f66;z-index:2;pointer-events:none}
@media(orientation:landscape){#game #content .pawWishGarden{padding:0!important}#game #content .pawWishGarden .wishRitual{width:min(91%,calc((100dvh - 134px) * 1.77),980px)!important;aspect-ratio:16/9!important;transform:translateY(-9px)}#game #content:has(.pawWishGarden)>h1{top:12px;font-size:22px;left:90px;right:90px}}
#game #content .pawWishGarden .wishRitual,#game #content .pawWishGarden .ritualCoin{touch-action:none!important;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}#game #content .pawWishGarden .ritualCoin{z-index:8!important;pointer-events:auto!important;cursor:grab;position:absolute}#game #content .pawWishGarden .wishDragging .ritualCoin{cursor:grabbing}#game #content .pawWishGarden .waterLight,#game #content .pawWishGarden .livingKoi,#game #content .pawWishGarden .wishAim,#game #content .pawWishGarden .wishBowl,#game #content .pawWishGarden .floatingPetal,#game #content .pawWishGarden .fishWake{pointer-events:none!important}#game #content .pawWishGarden [hidden]{display:none!important}#game #content .pawGardenActions .pawGentleToss{border:1px solid #cbb487!important;border-radius:20px!important;padding:6px 14px!important;text-decoration:none!important;background:#344a3cd9!important}#game #content .pawGardenActions .pawGentleToss:disabled{opacity:.45;cursor:default}#game #content .pawGardenActions{gap:4px!important}#game #content .pawGardenActions summary{max-width:120px}#game #content .pawGardenFooter{pointer-events:none}#game #content .pawGardenFooter button,#game #content .pawGardenFooter details{pointer-events:auto}#game #content .pawWishGarden .wishAim{z-index:7!important}#game #content .pawGardenFooter .wishMessage{min-height:1.3em!important} @media(max-height:530px) and (orientation:portrait){#game #content .pawWishGarden{padding-top:0!important}#game #content:has(.pawWishGarden)>h1{font-size:19px;top:49px}#game #content .pawGardenFooter .wishThrowGuide{display:none!important}}
`;document.head.append(pawThreeSceneCss);

/* PAW_ROOM_CLARITY: the room itself is the menu. Keep native station
   accessibility, but no permanent duplicate Activities control. */
const pawPlaceName=element('div','',$('game'),'pawPlaceName');
pawPlaceName.id='pawPlaceName';pawPlaceName.hidden=true;
pawPlaceName.setAttribute('aria-hidden','true');
const pawRoomClarityBefore=syncRoomGuide;
syncRoomGuide=function(){
 const result=pawRoomClarityBefore();
 const visible=!roomGuideToggle.hidden;
 pawPlaceName.hidden=!visible;
 if(visible){
  const door=maps[scene]?.st.find(v=>v[0]===room);
  const name=room==='park'?tr('Daydream Park · Deer Grove','发呆公园 · 鹿苑'):room==='boba'?tr('Pearl & Pause','珍珠摸鱼铺'):door?tr(door[3],door[4]):'';
  if(pawPlaceName.textContent!==name)pawPlaceName.textContent=name;
  pawPlaceName.hidden=!name;
  const label=tr('Choose a station','选择体验地点');
  if(roomGuideToggle.textContent!==label)roomGuideToggle.textContent=label;
  roomGuideToggle.setAttribute('aria-label',label);
 }
 return result
};
// Use adult standing proportions for the two photographed rooms. The
// feet, approach anchors and identity-specific portraits stay unchanged.
roomResidentStations.park.sc=1.24;
roomResidentStations.boba.sc=1.25;
// Turn the existing social page into a town notebook without replacing
// the real/fictional post distinction, navigation, reply or posting logic.
const pawNotebookPageBefore=page;
page=function(title,sub,body){
 return pawNotebookPageBefore(title,sub,q=>{
  const result=body(q);
  const isSocial=title===tr('Town Square','摸鱼广场')||title==='Town Square';
  if(isSocial){
   const notebook=element('section','',q,'pawTownNotebook');
   // These are already direct children. Element.matches(':scope > ...')
   // scopes to each child, not q, and accidentally moves the page toolbar.
   const subtitle=[...q.children].find(n=>n.tagName==='P');
   const children=[...q.children].filter(n=>n!==notebook&&n!==subtitle&&!n.matches('.row,h1'));
   for(const child of children)notebook.append(child);
   const nav=[...notebook.querySelectorAll('div,nav,section')].find(el=>[...el.children].filter(v=>v.tagName==='BUTTON').length>=3);
   if(nav)nav.classList.add('pawTownNotebookTabs');
  }
  return result
 })
};
const pawRoomClarityStyle=document.createElement('style');pawRoomClarityStyle.textContent=`
#game #pawRoomGuideToggle:not([hidden]):not(:focus-visible){position:absolute!important;width:1px!important;height:1px!important;min-width:0!important;min-height:0!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important;padding:0!important;box-shadow:none!important;pointer-events:none!important}
#game #pawRoomGuideToggle:focus-visible{z-index:12!important;outline:2px solid #fff2cf;outline-offset:3px}
#game #pawPlaceName{position:absolute;z-index:3;top:calc(env(safe-area-inset-top,0px) + 106px);right:max(12px,env(safe-area-inset-right,0px));max-width:50%;box-sizing:border-box;pointer-events:none;color:#fff4d9;text-shadow:0 1px 3px #283c30,0 1px 6px #283c30;font:600 clamp(13px,3.7vw,19px)/1.25 Georgia,"Songti SC",serif;text-align:right;padding:4px 0;overflow-wrap:anywhere}
#game #pawPlaceName[hidden],#game.pawRailJourneyActive #pawPlaceName,#game:has(#roomStationGuide.pawGuideOpen) #pawPlaceName,#game:has(#pawRoomGuideToggle:focus-visible) #pawPlaceName{display:none!important}
#game #page:has(.pawTownNotebook){background:radial-gradient(ellipse at top,#d8c3a0,#9a805e)!important}
#game #content:has(.pawTownNotebook){max-width:820px!important;color:#514638}
#game #content:has(.pawTownNotebook)>h1{font-family:Georgia,"Songti SC",serif!important}
#game #content .pawTownNotebook{box-sizing:border-box;position:relative;min-width:0;padding:14px clamp(12px,4vw,27px) 24px;background:linear-gradient(90deg,#d9c7a5 0,#f9eed6 5%,#f5e7cd 95%,#e5d0ad);border-left:5px solid #8d7353;border-radius:2px 5px 5px 2px;box-shadow:0 3px 0 #b69b75,0 6px 0 #e8d3ad,0 9px 0 #9d815d,0 11px 17px #49382740}
#game #content .pawTownNotebookTabs{display:flex!important;flex-wrap:wrap!important;gap:0 12px!important;padding:0 0 6px!important;margin:0 0 14px!important;border-bottom:1px solid #bca585!important;background:none!important;box-shadow:none!important}
#game #content .pawTownNotebookTabs>button{flex:0 1 auto!important;width:auto!important;min-height:44px;min-width:0;padding:4px 1px!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;background:transparent!important;color:#5b5745!important;box-shadow:none!important;text-align:left;font:600 14px/1.35 Georgia,"Songti SC",serif!important}
#game #content .pawTownNotebookTabs>button:is([aria-selected=true],[aria-pressed=true],.active,.selected,.on){color:#365746!important;border-bottom-color:#547354!important}
#game #content .pawTownNotebook :is(article,.communityPost,.townPost,.boardPost){border:0!important;border-bottom:1px dashed #c3ac86!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;padding:12px 0!important;margin:0!important}
#game #content .pawTownNotebook :is(h2,h3){color:#4c6248!important;font-family:Georgia,"Songti SC",serif!important}
#game #content .pawTownNotebook summary{min-height:44px;align-content:center;color:#51624b}
@media(max-width:400px){#game #content .pawTownNotebookTabs{gap:0 9px!important}#game #content .pawTownNotebookTabs>button{font-size:13px!important}}
`;document.head.append(pawRoomClarityStyle);


/* PAW_TOWN_FRONT_DOOR: daily journal, map and community have separate jobs. */
let pawTownFromDock=false;
function pawOpenTownSpace(key){pawTownFromDock=true;communityTab=key;return townChatPage()}
function pawTownLink(parent,key,en,cn,detailEn,detailCn){
 const btn=b(parent,'',()=>pawOpenTownSpace(key));btn.className='pawTownLink';
 const copy=element('span','',btn);element('strong',tr(en,cn),copy);element('small',tr(detailEn,detailCn),copy);
 element('span','›',btn,'pawTownArrow').setAttribute('aria-hidden','true');return btn
}
function pawTownFront(){
 if(transitioning)return;
 pawTownFromDock=true;activePage='pawTownFront';
 page(tr('Town Square','摸鱼广场'),tr('Pull up a chair. There is always something to read or someone to talk to.','来坐坐吧，总有故事可看，也有话可聊。'),q=>{
  const front=element('section','',q,'pawTownFront');
  const photo=element('figure','',front,'pawTownFrontPhoto'),im=element('img','',photo);im.src=pawJournalPicture('tea','home');im.alt=tr('The Tea Room','吃瓜茶馆');element('figcaption',tr('A little company between adventures','逛累了，就来聊两句'),photo);
  const chat=element('section','',front,'pawTownSection');
  element('h2',tr('Come sit with us','来坐坐吧'),chat);
  pawTownLink(chat,'lounge','Tea chat','茶馆闲聊','Chat with fictional town residents, anytime.','随时跟小镇的虚构居民聊两句。');
  pawTownLink(chat,'public','Traveller lobby','旅人聊天室',communityURL()?'Chat with real visitors.':'Live chat is not open yet.',communityURL()?'和真实旅人聊聊天。':'真人聊天室尚未开放。');
  const news=element('section','',front,'pawTownSection pawTownPinned');
  element('h2',tr('On the noticeboard','留言墙上'),news);
  element('small',tr('From fictional town residents','来自虚构小镇居民'),news);
  element('p',tr(...pawWeekNote()),news,'pawTownWeek');
  const latest=townPublishedNotices().slice(0,2);
  for(const {thread:m} of latest){const note=element('article','',news,'pawTownPreview');element('strong',tr(...m[0]),note);element('p',tr(...m[1]),note);element('small',m[2].length+' '+tr('replies','条回复'),note)}
  b(news,tr('Read the noticeboard & replies ›','看看留言和回复 ›'),()=>pawOpenTownSpace('board')).className='pawTownTextLink';
  const more=element('section','',front,'pawTownSection');
  element('h2',tr('A little more company','还有这些小热闹'),more);
  pawTownLink(more,'celebrate','Good things','小确幸','Share a little win or celebrate privately.','分享小胜利，也可以自己庆祝。');
  pawTownLink(more,'stroll','Meet travellers','结伴散步','Optional shared walks, when available.','联机开放时，可自愿结伴散步。');
  const paper=b(more,tr('Town paper & private notes ›','小镇日报与私密留言 ›'),()=>todayScoopBefore.call($('dockScoop')));paper.className='pawTownTextLink';
 });
 const q=$('content'),back=q.querySelector(':scope > .row button:first-child');
 if(back)back.onclick=()=>{pawTownFromDock=false;$('page').style.display='none'};
 journalLanguage(pawTownFront)
}
const pawTownChatBefore=townChatPage;
townChatPage=function(...args){
 const result=pawTownChatBefore(...args),q=$('content');
 // The lounge renderer inserts its own header after page() completes.
 // Apply a notebook class without moving its transcript or compose form.
 q.querySelector('.communityTabs')?.classList.add('pawTownNotebookTabs');
 if(communityTab==='lounge')q.querySelector('.townChatTranscript')?.classList.add('pawTownLoungeLog');
 if(pawTownFromDock){
  const back=q.querySelector(':scope > .row button:first-child');
  if(back){back.textContent=tr('‹ Town','‹ 广场');back.onclick=pawTownFront}
 }
 return result
};
communityTabs=function(q){
 const tabs=element('nav','',q,'communityTabs pawTownNotebookTabs');tabs.setAttribute('aria-label',tr('Community spaces','社区空间'));
 for(const [key,en,cn] of [['lounge','Tea chat','茶馆闲聊'],['public','Lobby','旅人聊天'],['board','Noticeboard','留言墙']]){
  const btn=b(tabs,tr(en,cn),()=>{communityTab=key;townChatPage()});btn.setAttribute('aria-pressed',String(communityTab===key))
 }
 if(['celebrate','stroll'].includes(communityTab)){const key=communityTab;const selected=b(tabs,key==='celebrate'?tr('Good things','小确幸'):tr('Meet travellers','结伴散步'),()=>{});selected.setAttribute('aria-pressed','true');selected.disabled=true}
};
const pawTownTodayBefore=todayHub;
todayHub=function(...args){
 const result=pawTownTodayBefore(...args),q=$('content');
 // Keep daily check-in, tasks, fortune, calendar and mood suggestions.
 const secondary=q.querySelector('.journalTownMore');
 if(secondary){
  for(const el of [...secondary.children])if(el.matches('.townFortuneSlip,.townOccasion')){if(el.matches('.townOccasion')){el.querySelectorAll('button').forEach(b=>b.remove());q.append(el)}else q.append(el)}
  secondary.remove()
 }
 q.querySelectorAll('.journalTownJump,.goodCompanyInvitation,.communityWelcome,.guestVisitPanel').forEach(el=>el.remove());
 journalLanguage(todayHub);return result
};
$('dockScoop').onclick=()=>{pawTownFromDock=false;todayHub()};
const pawTownDock=$('dockValley');
pawTownDock.onclick=pawTownFront;
pawTownDock.querySelector('.dockIcon').innerHTML='<svg viewBox="0 0 28 28" aria-hidden="true"><g stroke="#775f48" stroke-width="1.2" stroke-linejoin="round"><path fill="#d5b58b" d="M2 5h18v12H9l-5 4v-4H2z"/><path fill="#e7d7b2" d="M11 12h15v11h-3v3l-5-3h-7z"/><path fill="none" d="M6 9h10M6 12h7m1 4h8m-8 3h8"/></g></svg>';
$('dockTravel').after(pawTownDock);
const pawTownHudBefore=updateHUD;
updateHUD=function(...args){
 const result=pawTownHudBefore(...args),label=tr('Town','广场');
 pawTownDock.lastElementChild.textContent=label;pawTownDock.setAttribute('aria-label',label);pawTownDock.classList.remove('active');return result
};
const pawTownFrontStyle=document.createElement('style');pawTownFrontStyle.textContent=`
#game #content:has(.pawTownFront){max-width:760px!important}
#game #content .pawTownFront{display:grid;gap:14px}
#game #content .pawTownFrontPhoto{position:relative;margin:0;overflow:hidden;aspect-ratio:2.5;border:4px solid #fff3d9;outline:1px solid #b9a17a;box-shadow:0 3px 6px #58452d26}
#game #content .pawTownFrontPhoto img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 42%}
#game #content .pawTownFrontPhoto figcaption{position:absolute;bottom:0;left:0;right:0;padding:19px 8px 6px;color:#fff2d5;background:linear-gradient(transparent,#304435e8);font:600 13px Georgia,"Songti SC",serif}
#game #content .pawTownSection{min-width:0;padding:8px 0;border-bottom:1px dashed #b6a17c}
#game #content .pawTownSection h2{font-size:clamp(20px,5vw,26px);margin:0 0 6px!important;color:#48624e}
#game #content .pawTownLink{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;width:100%;min-height:54px;white-space:normal;padding:9px 2px!important;border:0!important;border-bottom:1px solid #c6b18d!important;border-radius:0!important;background:none!important;box-shadow:none!important;color:#4d5c48!important}
#game #content .pawTownLink strong,#game #content .pawTownLink small{display:block;overflow-wrap:anywhere}
#game #content .pawTownLink strong{font:600 17px/1.3 Georgia,"Songti SC",serif}
#game #content .pawTownLink small{font:12px/1.4 system-ui;color:#675b49;margin-top:3px}
#game #content .pawTownArrow{font-size:24px}
#game #content .pawTownPinned{padding:12px 14px;background:linear-gradient(90deg,#e1cfaa,#f7ebd0 5%,#f3e2bc);border:1px solid #bba27a;box-shadow:0 3px 0 #c6ab80}
#game #content .pawTownWeek{font:italic 15px/1.5 Georgia,"Songti SC",serif;padding:7px 0;border-bottom:1px dashed #bba27a}
#game #content .pawTownPreview{padding:8px 0;border-bottom:1px dashed #c4ac83}
#game #content .pawTownPreview strong{color:#596d4d;font-size:13px}
#game #content .pawTownPreview p{margin:4px 0!important;font-size:14px}
#game #content .pawTownPreview small{color:#78674f;font-size:11px}
#game #content .pawTownTextLink{min-height:44px;background:transparent!important;border:0!important;box-shadow:none!important;color:#365d48!important;padding:5px 0!important;text-decoration:underline;text-underline-offset:3px;text-align:left}
#game #content .pawTownNotebookTabs{display:flex!important;flex-wrap:wrap!important;gap:0 12px!important;background:none!important;box-shadow:none!important;border-bottom:1px solid #bda783}
#game #content .pawTownNotebookTabs button{flex:0 1 auto!important;min-width:0!important;min-height:44px;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;background:none!important;box-shadow:none!important;color:#635846!important;padding:5px 2px!important}
#game #content .pawTownNotebookTabs button[aria-pressed=true]{color:#365d48!important;border-bottom-color:#547354!important}
#game #content .pawTownLoungeLog{min-height:clamp(170px,36dvh,380px)}
@media(min-width:680px){#game #content .pawTownFront{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;column-gap:22px}#game #content .pawTownFrontPhoto{grid-column:1/-1;aspect-ratio:3.7}#game #content .pawTownPinned{grid-column:2;grid-row:2/span 2}}
`;document.head.append(pawTownFrontStyle);


/* PAW_SINGLE_HOME: four navigation intentions. Existing saves and unlocks
   remain authoritative; legacy page functions are retained where useful. */
renderTravellerBag=function(){
 activePage='room';page(tr('My collection cabinet','我的收藏柜'),tr('Souvenirs, figures and little memories.','手信、手办和小小回忆。'),q=>{
  const wrap=element('section','',q,'travellerBagV2'),all=bagEntries().map(v=>({...v,chapter:bagChapterFor(v.item[0],bagClass(v.item))})),owned=all.filter(v=>v.owned),head=element('div','',wrap,'bagHeader');
  const pic=element('img','',head);pic.src=mbAvatarStanding(avatar??0);pic.alt='';
  const info=element('div','',head);element('strong',playerName||tr('Traveller','旅人'),info);element('small',owned.length+' '+tr('keepsakes','件收藏')+' · '+hideoutBalance()+' '+tr('paw coins','爪爪币'),info);
  const actions=element('div','',head,'bagHeaderActions');
  const profile=b(actions,tr('Profile','资料'),()=>hideoutProfilePage({origin:renderTravellerBag}));profile.className='bagProfileButton';
  const home=b(actions,tr('Visit my home','回我的小窝'),()=>mbOpenOwnHome(renderTravellerBag,['‹ Bag','‹ 返回背包']));home.className='mbHomeDirect';
  const tabs=element('div','',wrap,'bagModes');
  for(const [key,en,cn] of [['owned','Owned','已收藏'],['catalog','Collection','图鉴'],['favorites','Favourites','喜欢']]){const btn=b(tabs,tr(en,cn),()=>{bagMode=key;bagSelected=null;bagChapter=null;bagCategory='all';bagQuery='';search.value='';bagPageIndex=0;draw()});btn.dataset.mode=key}
  const category=element('div','',wrap,'bagCategories');
  for(const [key,en,cn] of bagCats){const btn=b(category,tr(en,cn),()=>{bagCategory=key;bagSelected=null;bagPageIndex=0;draw()});btn.dataset.category=key}
  const tools=element('div','',wrap,'bagTools'),search=element('input','',tools);search.type='search';search.placeholder=tr('Find a treasure','找一件宝贝');search.setAttribute('aria-label',search.placeholder);search.value=bagQuery;search.oninput=()=>{bagQuery=search.value;bagSelected=null;bagPageIndex=0;draw()};
  const sort=element('select','',tools);sort.setAttribute('aria-label',tr('Sort items','排序'));for(const [key,en,cn] of [['recent','Recent','最近'],['name','Name','名称']]){const opt=element('option',tr(en,cn),sort);opt.value=key}sort.value=bagSort;sort.onchange=()=>{bagSort=sort.value;bagPageIndex=0;draw()};
  const body=element('div','',wrap,'bagBody'),chapters=element('div','',body,'bagChapterShelf'),trail=element('div','',body,'bagChapterTrail'),grid=element('div','',body,'bagSlots'),detail=element('section','',body,'bagDetail'),pagination=element('div','',body,'bagPagination');
  const foot=element('div','',wrap,'bagFooter');b(foot,tr('My room','我的小窝'),hideoutPage);b(foot,tr('Passport','护照'),passport);b(foot,tr('Stamp rewards','印章奖励'),hideoutClaimPage);
  function draw(){
   tabs.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===bagMode)));
   category.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.category===bagCategory)));
   const query=pawBagNormalize(bagQuery),shelf=false,shown=all.filter(v=>(bagMode==='catalog'||v.owned)&&(bagMode!=='favorites'||bagFavorites.includes(v.item[0]))&&(bagCategory==='all'||bagClass(v.item)===bagCategory)&&pawBagSearchMatch(v,query,boxPrizes.some(p=>p[0]===v.item[0]&&p[4]==='secret')));
   const visibleName=v=>!v.owned&&boxPrizes.some(p=>p[0]===v.item[0]&&p[4]==='secret')?tr('Mystery figure','神秘手办'):tr(...v.item);
   shown.sort((a,b)=>bagSort==='name'?visibleName(a).localeCompare(visibleName(b)):b.order-a.order);
   if(!shown.some(v=>v.item[0]===bagSelected))bagSelected=null;
   const selected=shown.find(v=>v.item[0]===bagSelected),paged=bagPageSlice(shown,bagPageIndex);bagPageIndex=paged.page;
   chapters.replaceChildren();trail.replaceChildren();grid.replaceChildren();pagination.replaceChildren();
   chapters.hidden=!shelf;trail.hidden=shelf;grid.hidden=shelf||!!selected;pagination.hidden=shelf||!!selected||paged.pages<=1;
   if(shelf){
    for(const id of bagChapterIds){const count=bagChapterCounts(all,id),available=shown.filter(v=>v.chapter===id).length;
     const card=b(chapters,'',()=>{bagChapter=id;bagSelected=null;bagPageIndex=0;draw()});card.className='bagChapterCard';card.dataset.chapter=id;
     const art=element('img','',card);art.src=bagChapterImage(id);art.alt='';art.loading='lazy';
     const copy=element('div','',card,'bagChapterCopy');element('small',tr('Chapter ','章节 ')+(bagChapterIds.indexOf(id)+1),copy);element('strong',bagChapterName(id),copy);
     element('span',bagChapterDescription(id),copy);element('small',bagMode==='favorites'?available+' '+tr('favourites in this chapter','件本章喜欢的收藏'):count.owned+' / '+count.total+' '+tr('known keepsakes','件已知收藏'),copy);
     const meter=element('progress','',copy);meter.max=Math.max(1,bagMode==='favorites'?count.owned:count.total);meter.value=bagMode==='favorites'?available:count.owned;meter.setAttribute('aria-label',bagChapterName(id)+(bagMode==='favorites'?tr(' favourites',' 喜欢'):tr(' collection progress',' 收藏进度')));
    }
    detail.hidden=true;return
   }
   b(trail,tr('‹ Chapters','‹ 全部章节'),()=>{bagChapter=null;bagCategory='all';bagQuery='';search.value='';bagSelected=null;bagPageIndex=0;draw()});
   element('strong',bagChapter?bagChapterName(bagChapter):tr('Search & filters','搜索与筛选'),trail);
   if(!selected)for(const v of paged.rows){const button=b(grid,'',()=>{bagSelected=v.item[0];draw();detail.scrollIntoView({block:'nearest'})});button.className='bagSlot';button.dataset.owned=String(v.owned);button.setAttribute('aria-pressed',String(bagSelected===v.item[0]));button.setAttribute('aria-label',v.owned?tr(...v.item):tr('Undiscovered item','未发现的物品'));const art=element('span','',button,'bagSlotArt');art.innerHTML=bagArt(v);const prize=boxPrizes.find(p=>p[0]===v.item[0]);element('small',v.owned?tr(...v.item):prize?.[4]==='secret'?tr('Secret','隐藏款'):tr('Not found','未发现'),button);if(bagFavorites.includes(v.item[0]))element('span','★',button,'bagStar')}
   if(!shown.length){element('p',query?tr('No treasures match this search.','没找到符合搜索的宝贝。'):tr('Nothing in this pocket yet.','这个口袋还空空的。'),grid,'bagEmpty');if(query||bagCategory!=='all'){const clear=b(grid,tr('Clear search & filters','清除搜索和筛选'),()=>{bagQuery='';search.value='';bagCategory='all';bagSelected=null;bagPageIndex=0;draw()});clear.className='pawBagReset'}if(bagMode==='owned')b(grid,tr('See undiscovered keepsakes','看看待发现的收藏'),()=>{bagMode='catalog';bagPageIndex=0;draw()})}
   if(!selected&&paged.pages>1){const prev=b(pagination,tr('‹ Previous','‹ 上一页'),()=>{bagPageIndex--;draw()});prev.disabled=paged.page===0;element('span',(paged.page+1)+' / '+paged.pages,pagination);const next=b(pagination,tr('Next ›','下一页 ›'),()=>{bagPageIndex++;draw()});next.disabled=paged.page===paged.pages-1}
   detail.replaceChildren();const v=selected;detail.hidden=!v;if(!v)return;
   b(detail,tr('‹ Back to keepsakes','‹ 返回收藏'),()=>{bagSelected=null;draw()});
   const art=element('div','',detail,'bagHeroArt');art.innerHTML=bagArt(v);if(!v.owned)art.classList.add('bagUnknown');
   const prize=boxPrizes.find(p=>p[0]===v.item[0]),secret=!v.owned&&prize?.[4]==='secret';
   element('h2',secret?tr('Mystery figure','神秘手办'):tr(...v.item),detail);
   element('small',v.owned?tr('In your bag','已放入背包'):tr('Still to discover','等待发现'),detail);element('small',bagChapterName(v.chapter),detail);
   if(v.owned){const photo=element('img','',detail,'mbKeepsakeOrigin');photo.src=bagChapterImage(v.chapter);photo.alt='';photo.loading='lazy';element('small',tr('A glimpse of this chapter','这一章节的风景'),detail,'mbKeepsakeOriginCaption')}
   if(prize)element('small',tr(prize[4]==='secret'?'Secret':prize[4]==='rare'?'Rare':prize[4]==='uncommon'?'Uncommon':'Common',prize[4]==='secret'?'隐藏款':prize[4]==='rare'?'稀有款':prize[4]==='uncommon'?'特别款':'普通款'),detail,'bagRarity');
   element('p',tr(...(v.owned?keepsakeStory(v.item):secret?['A secret companion awaits in the blind box collection.','盲盒收藏里藏着一位神秘小伙伴。']:keepsakeClue(v.item))),detail);
   if(v.owned){const fav=b(detail,bagFavorites.includes(v.item[0])?tr('★ Remove favourite','★ 取消喜欢'):tr('☆ Keep as favourite','☆ 加入喜欢'),()=>{bagFavorites=bagFavorites.includes(v.item[0])?bagFavorites.filter(x=>x!==v.item[0]):[...bagFavorites,v.item[0]];save('bagFavoritesV1',bagFavorites);draw()});fav.setAttribute('aria-pressed',String(bagFavorites.includes(v.item[0])))}
   if(prize)element('small',boxPrizes.filter(p=>owned.some(o=>o.item[0]===p[0])).length+'/'+boxPrizes.length+' '+tr('figures collected','款手办已收集'),detail)
  }draw();
 });
 const q=$('content');q.querySelector('.bagHeader')?.remove();q.querySelector('.bagFooter')?.remove();q.querySelector('.bagChapterTrail')?.remove();mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage);journalLanguage(renderTravellerBag);
};
myRoom=function(){bagChapter=null;bagCategory='all';bagQuery='';bagSelected=null;bagPageIndex=0;bagMode='owned';renderTravellerBag()};
const pawHomeSingleBefore=hideoutPage;
hideoutPage=function(...args){
 const result=pawHomeSingleBefore(...args),q=$('content'),primary=q.querySelector('.hideoutPrimary');
 if(!primary)return result;
 q.querySelector('.hideoutProfile')?.remove();
 q.querySelector('.hideoutLibrary')?.remove();
 const reward=[...primary.querySelectorAll('button')].find(v=>v.textContent===tr('Stamps & rewards','印章与奖励'));
 if(reward){reward.textContent=tr('Display rewards','摆放奖励');reward.onclick=()=>{hideoutClaimPage();const content=$('content');content.querySelector('.hideoutStampGrid')?.remove();const heading=content.querySelector('h2');if(heading)heading.textContent=tr('Unlocked decorations','已解锁装饰');mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage)}}
 if(!hideoutEditing){b(primary,tr('My collections','我的收藏'),myRoom)}
 return result
};
const pawLegacyPassport=passport;
let pawMemoryDistrict=null,pawMemoryScroll=0;
function pawTravelMemories(){
 pawLegacyPassport();const q=$('content'),album=q.querySelector('.travelAlbum');
 if(album){
  album.querySelectorAll('.albumGrid,.albumProfile,.townFortuneSlip,.hideoutRewardCallout').forEach(n=>n.remove());
  for(const btn of [...album.querySelectorAll(':scope > button')])if([tr('Open my bag','打开背包'),tr('Travel map','旅行地图')].includes(btn.textContent))btn.remove();
 }
 q.querySelector('.townAnchorBook')?.remove();
 const h=q.querySelector('h1');if(h)h.textContent=tr('Travel memories','旅途回忆');
 mbHomePageBack(tr('‹ Explore','‹ 返回探索'),()=>{pawJournalRender(pawMemoryDistrict||scene);requestAnimationFrame(()=>{if($('content').querySelector('.pawSketchbook'))$('page').scrollTop=pawMemoryScroll})});journalLanguage(pawTravelMemories)
}
const pawJournalSingleBefore=pawJournalRender;
pawJournalRender=function(district=scene){
 const result=pawJournalSingleBefore(district),q=$('content'),book=q.querySelector('.pawSketchbook'),info=q.querySelector('.pawSketchNotes');
 if(book&&info){
  const signature=townAnchorPlaces[district],visitedHere=townAnchorVisits()[district];
  if(signature&&visitedHere)element('p',tr(...signature.memory),info,'pawJourneyMemory');
  const stamp=element('small',hideoutStampCount()+'/4 '+tr('railway stamps collected','枚铁路印章已收集'),info);
  const links=element('div','',book,'pawTravelMemoryLink');
  b(links,tr('Travel memories ›','旅途回忆 ›'),()=>{pawMemoryDistrict=district;pawMemoryScroll=$('page').scrollTop;pawTravelMemories()}).className='pawTownTextLink';
 }
 return result
};
passport=function(){return pawJournalRender(scene)};
travel=function(){return pawJournalRender(scene)};
$('dockTravel').onclick=travel;$('travel').onclick=travel;
const pawProfileSingleBefore=lifeProfile;
lifeProfile=function(...args){
 const result=pawProfileSingleBefore(...args),q=$('content');
 for(const link of q.querySelectorAll('.journalBookshelf .journalBookLink'))if(!['friends','life'].includes(link.dataset.book))link.remove();
 const stats=q.querySelector('.journalQuickStats');if(stats){for(const btn of [...stats.querySelectorAll('button')].slice(0,2)){const label=element('div','',stats,'pawProfileStat');label.innerHTML=btn.innerHTML;btn.remove()}}
 return result
};
const pawAchievementSingleBefore=achievementBook;
achievementBook=function(...args){
 const result=pawAchievementSingleBefore(...args),q=$('content');
 for(const el of q.querySelectorAll('.journalBookLink[data-book="passport"],.journalBookLink[data-book="decor"],.journalBookLink[data-book="figures"]'))el.remove();
 for(const h of q.querySelectorAll('h2'))if(h.textContent===tr('Other little milestones','其他小小里程碑'))h.remove();
 return result
};
const pawDiaryOpen=new Set(['fortune']);
function pawDiaryFold(q,node,key,title,subtitle=''){
 if(!node)return null;
 const fold=element('details','',q,'pawDiaryFold');node.before(fold);
 const summary=element('summary','',fold);element('strong',title,summary);if(subtitle)element('small',subtitle,summary);
 fold.open=pawDiaryOpen.has(key);fold.ontoggle=()=>{if(fold.open)pawDiaryOpen.add(key);else pawDiaryOpen.delete(key)};
 const h=node.querySelector(':scope > h2');if(h&&h.textContent===title)h.remove();fold.append(node);return fold
}
const pawGratitudeBefore=goodCompanyPage;
goodCompanyPage=function(q){const result=pawGratitudeBefore(q);const book=q.querySelector('.goodCompanyBook');if(book){book.querySelector('.goodCompanyBanner')?.remove();book.querySelector('.goodCompanyActions')?.remove()}return result};
const pawDiaryTodayBefore=todayHub;
todayHub=function(...args){
 const result=pawDiaryTodayBefore(...args),q=$('content'),day=townPawToday(),tasks=q.querySelector('.journalDailyTasks');
 pawDiaryFold(q,q.querySelector('.townFortuneSlip'),'fortune',tr('Today’s fortune','今日运势'));
 const fold=pawDiaryFold(q,tasks,'tasks',tr('Today’s tasks','今日小任务'),day.keys.length+'/'+townPawCategories().length+' '+tr('completed','已完成'));
 if(fold)fold.querySelector('.journalDailyTasks > h2')?.remove();
 const gratitude=element('section','',q,'pawDiaryGratitude');goodCompanyPage(gratitude);
 pawDiaryFold(q,gratitude,'gratitude',tr('One good thing','今日小确幸'),day.keys.includes('gratitude')?tr('Saved today','今日已记录'):tr('Optional private reflection','随心记录，仅自己可见'));
 const calendar=q.querySelector('.townCalendarLink'),occasion=q.querySelector('.townOccasion');
 if(calendar)calendar.remove();if(occasion)occasion.remove();
 q.querySelector('.travellerMoodBook')?.remove();
 journalLanguage(todayHub);return result
};
const pawDailyGuideBefore=journalDailyGuide;
journalDailyGuide=function(id){if(id==='gratitude'){pawDiaryOpen.add('gratitude');todayHub();$('content').querySelector('.pawDiaryGratitude')?.closest('details')?.scrollIntoView({block:'start'});return}return pawDailyGuideBefore(id)};
const pawCommunitySingleBefore=townChatPage;
townChatPage=function(...args){
 if(communityTab==='celebrate'){pawTownFromDock=false;pawDiaryOpen.add('gratitude');return todayHub()}
 const result=pawCommunitySingleBefore(...args),q=$('content');
 const tabs=q.querySelector('.communityTabs');if(tabs){
  const stroll=b(tabs,tr('Meet','结伴'),()=>{communityTab='stroll';townChatPage()});stroll.setAttribute('aria-pressed',String(communityTab==='stroll'))
  for(const el of [...tabs.querySelectorAll('button')])if(el.disabled)el.remove()
 }
 if(communityTab==='board'){
  q.querySelector('.townBoardPublicLink')?.remove();
  for(const btn of q.querySelectorAll('button'))if(btn.textContent===tr('Open my private notes','打开我的私密留言'))btn.remove()
 }
 return result
};
pawTownDock.onclick=()=>{if(transitioning)return;pawTownFromDock=false;communityTab='board';townChatPage()};
const pawFourDockBefore=updateHUD;
updateHUD=function(...args){
 const result=pawFourDockBefore(...args);
 const label=tr('Explore','探索');$('dockTravel').lastElementChild.textContent=label;$('dockTravel').setAttribute('aria-label',label);
 const home=tr('My Room','小窝');mbHomeNav.lastElementChild.textContent=home;mbHomeNav.setAttribute('aria-label',home);
 return result
};
$('dockRoom').hidden=true;$('dockPassport').hidden=true;
$('dock').append($('dockTravel'),$('dockScoop'),pawTownDock,mbHomeNav);
const pawFourDockCSS=document.createElement('style');pawFourDockCSS.textContent=`
#game #dock #dockRoom,#game #dock #dockPassport{display:none!important}
#game #dock{grid-template-columns:repeat(4,minmax(0,1fr))!important}
#game #dock>button:not([hidden]){flex:1 1 0;min-width:0}
#game #content .pawDiaryFold{margin:9px 0;padding:0 10px;background:transparent;border:0;border-bottom:1px solid #bfa882;box-shadow:none}
#game #content .pawDiaryFold>summary{min-height:48px;padding:8px 0;color:#50634b;cursor:pointer;font:600 17px/1.35 Georgia,"Songti SC",serif}
#game #content .pawDiaryFold>summary small{display:block;font:12px/1.4 system-ui;color:#77654e;margin:3px 0 0 15px}
#game #content .pawDiaryFold .goodCompanyBook{border:0;background:transparent;padding:4px 0;box-shadow:none}
#game #content .pawProfileStat{display:flex;flex-direction:column;justify-content:center;text-align:center;padding:6px 4px}
#game #content .pawTravelMemoryLink{text-align:center;border-top:1px dashed #bda783;margin-top:7px}
`;document.head.append(pawFourDockCSS);


/* PAW_NAV_REVIEW: no profile or map inside personal room. Preserve private
   notebooks and readings that previously lived on the room's mixed shelf. */
const pawPersonalRoomBefore=hideoutPage;
hideoutPage=function(...args){
 const result=pawPersonalRoomBefore(...args),q=$('content'),primary=q.querySelector('.hideoutPrimary');
 if(primary&&!hideoutEditing){
  const shelf=element('details','',q,'pawPersonalShelf');element('summary',tr('My private shelf','我的私人书架'),shelf);
  for(const [en,cn,fn] of [['Saved readings','收藏的解读',album9],['Private notes','私人便笺',myNotes9]]){
   b(shelf,tr(en,cn),()=>{fn();mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage)})
  }
 }
 return result
};
const pawProfileFinalBefore=lifeProfile;
lifeProfile=function(...args){
 const result=pawProfileFinalBefore(...args),q=$('content'),book=q.querySelector('.journalProfileBook');
 q.querySelectorAll('.mbHomeDirect,.pawProfileStat').forEach(n=>n.remove());
 if(book){
  const rank=lifeRank(),stats=book.querySelector('.journalQuickStats');
  if(stats){
   const xp=element('div','',stats,'pawProfileXP');element('strong',rank.total+' '+tr('XP','经验值'),xp);
   const floor=lifeRanks[rank.index][0],ceil=rank.next;
   const meter=element('progress','',xp);meter.max=ceil?ceil-floor:1;meter.value=ceil?Math.max(0,rank.total-floor):1;meter.setAttribute('aria-label',tr('Progress to next level','距离下一级的进度'));
   element('small',ceil?tr('Next level: ','下一级：')+ceil:tr('Maximum level','已满级'),xp)
  }
 }
 return result
};
$('profileHud').onclick=()=>{if(avatar!==null&&proposal.hidden&&!transitioning&&!talkOpen&&!activity)lifeProfile()};
const pawRoomCollectionBefore=renderTravellerBag;
renderTravellerBag=function(...args){
 const result=pawRoomCollectionBefore(...args),q=$('content');q.querySelectorAll('.mbKeepsakeOrigin,.mbKeepsakeOriginCaption').forEach(n=>n.remove());return result
};
// Board and lobby do not render the same public messages twice. The existing
// moderated public composer remains exclusively in the lobby.
const pawTownFinalBefore=townChatPage;
communityTabs=function(q){
 const tabs=element('nav','',q,'communityTabs pawTownNotebookTabs');tabs.setAttribute('aria-label',tr('Community spaces','社区空间'));
 for(const [key,en,cn] of [['board','Noticeboard','留言墙'],['lounge','Tea table','茶桌闲聊'],['public','Travellers','旅人聊天室'],['gratitude','Little Joys','小确幸墙']]){
  const btn=b(tabs,tr(en,cn),()=>{communityTab=key;townChatPage()});btn.setAttribute('aria-pressed',String(communityTab===key||key==='public'&&communityTab==='stroll'))
 }
};
townChatPage=function(...args){
 if(communityTab==='board'){
  ++communityView;++townChatGeneration;
  page(tr('Town Square','摸鱼广场'),tr('A little gossip never hurt anyone. Probably.','吃点小瓜，应该没什么大碍。'),q=>{communityTabs(q);renderResidentNoticeboard(q);q.querySelector('.townBoardPublicLink')?.remove()});
  journalLanguage(townChatPage);return
 }
 const result=pawTownFinalBefore(...args),q=$('content'),tabs=q.querySelector('.communityTabs');
 if(tabs){for(const btn of [...tabs.querySelectorAll('button')])if(btn.textContent===tr('Meet','结伴'))btn.remove()}
 if(communityTab==='public'){b(q,tr('Meet travellers for a walk ›','结伴散步 ›'),()=>{communityTab='stroll';townChatPage()}).className='pawTownTextLink'}
 return result
};
const pawGratitudeFinalBefore=goodCompanyPage;
goodCompanyPage=function(q){
 const result=pawGratitudeFinalBefore(q),book=q.querySelector('.goodCompanyBook');
 if(book){
  const share=b(book,tr('Share a good thing in the lobby ›','去旅人聊天室分享好事 ›'),()=>{goodCompanyPublic()});share.className='pawTownTextLink';
  book.addEventListener('click',()=>{const status=q.closest('details')?.querySelector(':scope > summary small');if(status&&townPawToday().keys.includes('gratitude'))status.textContent=tr('Saved today','今日已记录')});
 }
 return result
};
// Only one daily fortune entrance. Balance is visible, but no additional
// passport shortcut, profile mirror or wallet directory in the HUD.
$('luck').onclick=()=>{pawDiaryOpen.add('fortune');todayHub()};
$('hudStamps').tabIndex=-1;$('hudStamps').removeAttribute('role');$('hudStamps').onclick=null;$('hudStamps').onkeydown=null;
$('hudCoins').onclick=null;$('hudCoins').onkeydown=null;$('hudCoins').tabIndex=-1;$('hudCoins').removeAttribute('role');
const pawNavReviewStyle=document.createElement('style');pawNavReviewStyle.textContent=`
#game #hudStamps,#game #luck{display:none!important}
#game #hudCoins{cursor:default!important}
#game #content .pawProfileXP{min-width:0;display:grid;align-content:center;gap:4px;padding:5px 9px}
#game #content .pawProfileXP progress{width:100%;accent-color:#6d8461}
#game #content .journalQuickStats{grid-template-columns:minmax(0,1fr) minmax(0,2fr)!important}
#game #content .pawPersonalShelf{padding:8px 0;border-top:1px dashed #bba27a}
#game #content .pawPersonalShelf summary{min-height:44px;align-content:center;color:#50634b;cursor:pointer}
#game #content .pawPersonalShelf button{min-height:44px;margin:3px 6px 3px 0}
#game #content .mbKeepsakeOrigin,#game #content .mbKeepsakeOriginCaption{display:none!important}
`;document.head.append(pawNavReviewStyle);


/* PAW_ILLUSTRATED_INTERFACE: the existing painted world is part of each
   interface. The DOM still owns text, keyboard controls and scrolling. */
const pawVisualPageBefore=page;
function pawVisualTheme(q,title){
 if(q.querySelector('.hideoutScene,.hideoutRoomView'))return 'room';
 if(q.querySelector('.pawSketchbook,.travelAlbum'))return 'travel';
 if(q.querySelector('.communityTabs,.townWall,.townChatTranscript,.pawTownFront'))return 'town';
 if(q.querySelector('.journalCheckin,.journalDailyTasks,.goodCompanyBook,.townFortuneSlip'))return 'daily';
 if(q.querySelector('.journalProfileBook,.travellerEditBook'))return 'profile';
 if(q.querySelector('.travellerBagV2'))return 'collection';
 if(q.querySelector('.komorebiBook,.komorebiConfirm'))return 'shop';
 if(q.querySelector('.dailyWheelStage'))return 'daily';
 return 'paper'
}
function pawVisualImage(theme){
 if(theme==='town')return pawJournalPicture('tea','home');
 if(theme==='daily')return destinationPortrait('fortune');
 if(theme==='collection'||theme==='shop')return destinationPortrait('island');
 if(theme==='profile')return destinationPortrait('wonder');
 return destinationPortrait(scene)
}
function pawVisualHeader(q,theme){
 const h=q.querySelector(':scope > h1'),intro=q.querySelector(':scope > p');
 if(!h||!intro||['room','travel'].includes(theme))return;
 const art=pawVisualImage(theme);
 if(!art)return;
 const header=element('header','',q,'pawIllustratedHeading');h.before(header);
 const im=element('img','',header);im.src=art;im.alt='';im.decoding='async';
 im.onerror=()=>{im.onerror=null;header.classList.add('pawImageUnavailable');im.remove()};
 const text=element('div','',header,'pawIllustratedCaption');text.append(h,intro);
}
function pawVisualChatPortraits(q){
 const log=q.querySelector('.townChatTranscript');if(!log||communityTab!=='lounge')return;
 const decorate=()=>{
  for(const line of log.querySelectorAll('.townChatLine:not(.self)')){
   if(line.dataset.pawPortrait)continue;
   line.dataset.pawPortrait='true';const name=line.querySelector('strong')?.textContent;
   if(!name)continue;
   const src=paintedDialoguePortrait(name);
   if(!src)continue;
   const im=element('img','',line,'pawChatPortrait');im.src=src;im.alt='';im.onerror=()=>im.remove();line.prepend(im)
  }
 };
 decorate();const observer=new MutationObserver(decorate);observer.observe(log,{childList:true,subtree:true});
 const cleaner=new MutationObserver(()=>{if(!log.isConnected){observer.disconnect();cleaner.disconnect()}});
 cleaner.observe(q,{childList:true})
}
page=function(title,sub,body){
 const result=pawVisualPageBefore(title,sub,body),q=$('content');
 // The final decorators run after callers have moved or added content.
 const first=q.firstElementChild;
 queueMicrotask(()=>{
  if(first!==q.firstElementChild||!first?.isConnected)return;
  const theme=pawVisualTheme(q,title);q.dataset.pawVisualTheme=theme;
  pawVisualHeader(q,theme);if(theme==='town')pawVisualChatPortraits(q)
 });
 return result
};
const pawIllustratedCSS=document.createElement('style');pawIllustratedCSS.textContent=`
#game #content[data-paw-visual-theme]{--paw-paper:#f3e6c9;--paw-ink:#4c5746;--paw-wood:#876749}
#game #content[data-paw-visual-theme]>.row{position:relative;z-index:2;padding:0 0 6px}
#game #content .pawIllustratedHeading{position:relative;isolation:isolate;overflow:hidden;min-height:155px;margin:4px 0 16px;border:4px solid #f9efd8;outline:1px solid #b69b73;box-shadow:0 4px 10px #59432e33;background:#526852}
#game #content .pawIllustratedHeading>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 44%;z-index:-2}
#game #content .pawIllustratedHeading:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#263e30f2 0%,#273e30ad 42%,transparent 92%);z-index:-1}
#game #content .pawIllustratedCaption{padding:64px 13px 12px;color:#fff3d8;display:flex;flex-direction:column;justify-content:end;min-height:155px}
#game #content .pawIllustratedCaption h1{color:#fff3d8!important;border:0!important;padding:0!important;margin:0 0 5px!important;font-size:clamp(23px,6vw,36px);text-shadow:0 1px 3px #20342a}
#game #content .pawIllustratedCaption p{color:#fff3d8!important;margin:0!important;font-size:13px;line-height:1.4;text-shadow:0 1px 2px #20342a}
#game #content[data-paw-visual-theme="daily"]{background:linear-gradient(90deg,#bda17830,transparent 6%,transparent 94%,#bda17822),repeating-linear-gradient(0deg,transparent 0 29px,#a4875e0a 30px),#f5ead1;padding:10px 12px 18px;border:1px solid #c3ab83;box-shadow:0 3px 0 #d3bc95}
#game #content[data-paw-visual-theme="daily"] .journalCheckin{background:#e9ddbb!important;border:0!important;border-bottom:1px dashed #b9a079!important;box-shadow:none!important;border-radius:0!important}
#game #content[data-paw-visual-theme="daily"] .pawDiaryFold{background:transparent!important}
#game #content[data-paw-visual-theme="daily"] .pawDiaryFold>summary{padding:12px 0!important}
#game #content[data-paw-visual-theme="town"] .pawTownNotebook{background:transparent!important;padding:0!important;border:0!important;box-shadow:none!important}
#game #content[data-paw-visual-theme="town"] .townWall{background:repeating-linear-gradient(0deg,#795b3e12 0 1px,transparent 1px 68px),linear-gradient(98deg,#94714e,#c09c6d 45%,#a88459);border:6px solid #77583d;box-shadow:inset 0 0 9px #5f422c66,0 3px 7px #48362422;padding:12px!important;border-radius:3px;color:#fff2db}
#game #content[data-paw-visual-theme="town"] .townWall .board-heading{color:#fff3d8!important;text-shadow:0 1px 2px #5d412f}
#game #content[data-paw-visual-theme="town"] .wallIntro,#game #content[data-paw-visual-theme="town"] .wallDisclosure{color:#fff3d8!important}
#game #content[data-paw-visual-theme="town"] .pawWeeklyNotice{color:#58462f;background:#efdb9e;padding:10px;box-shadow:1px 2px 3px #4b332f44}
#game #content[data-paw-visual-theme="town"] .townResidentNote{position:relative;min-width:0;padding:15px 11px 10px!important;margin:10px 0 14px!important;border:0!important;border-radius:1px!important;background:linear-gradient(110deg,#f5e9ce,#fff3d9 65%,#eddec0)!important;color:#514331!important;box-shadow:2px 4px 5px #49311e50!important}
#game #content[data-paw-visual-theme="town"] .townResidentNote:nth-child(3n+2){background:linear-gradient(120deg,#e5e7cb,#f4efdb)!important}
#game #content[data-paw-visual-theme="town"] .townResidentNote:before{content:'';position:absolute;top:-5px;left:calc(50% - 21px);width:42px;height:13px;background:#e4cf9da8;box-shadow:0 1px 1px #59442d44;transform:rotate(-3deg);pointer-events:none}
#game #content[data-paw-visual-theme="town"] .townPostList{display:grid;gap:4px}
#game #content[data-paw-visual-theme="town"] .townResidentNote p{font-size:15px;line-height:1.55}
#game #content[data-paw-visual-theme="town"] .townPostNav{color:#fff3db}
#game #content[data-paw-visual-theme="town"] .townChatTranscript{background:linear-gradient(120deg,#eadfc1,#f5e9d0);border:1px solid #b59b74!important;border-radius:3px!important}
#game #content .townChatLine:has(.pawChatPortrait){display:grid;grid-template-columns:38px minmax(0,1fr);column-gap:8px;align-items:start}
#game #content .pawChatPortrait{grid-row:1/3;width:38px;height:44px;object-fit:contain;background:#e6d6b4;border:1px solid #b9a079;border-radius:3px}
#game #content .townChatLine:has(.pawChatPortrait)>strong,#game #content .townChatLine:has(.pawChatPortrait)>p{grid-column:2}
#game #content[data-paw-visual-theme="profile"] .journalProfileBook{background:linear-gradient(90deg,#d5bd9229,#f5ead2 5%,#f5ead2 95%,#d5bd9229);border:1px solid #b8a17a;border-radius:3px;box-shadow:0 3px 0 #cbb58c}
#game #content[data-paw-visual-theme="collection"] .bagSlots{background:repeating-linear-gradient(0deg,#7b593b11 0 2px,transparent 2px 92px),#b5966b;padding:8px;border:5px solid #795b3d;border-radius:3px}
#game #content[data-paw-visual-theme="collection"] .bagSlot{background:linear-gradient(#e9d8b5,#f5e9d0)!important;border-radius:2px!important;border:1px solid #a38860!important}
#game #content[data-paw-visual-theme="room"] .hideoutScene{border:5px solid #9f8058!important;box-shadow:0 3px 6px #4b372f33}
@media(min-width:700px){#game #content .pawIllustratedHeading{min-height:205px}#game #content .pawIllustratedCaption{min-height:205px;padding:90px 22px 16px}#game #content[data-paw-visual-theme="town"] .townPostList{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}}
@media(max-width:380px){#game #content .pawIllustratedHeading,#game #content .pawIllustratedCaption{min-height:128px}#game #content .pawIllustratedCaption{padding:45px 9px 10px}#game #content[data-paw-visual-theme="daily"]{padding:7px}#game #content[data-paw-visual-theme="town"] .townWall{padding:8px!important}}
`;document.head.append(pawIllustratedCSS);

/* Distance-driven animation. The existing rear walk drawings are retained.
   Front and profile fallbacks animate lower-body pixels from their painted
   standing source until dedicated frames are installed in action-runtime. */
let pawWalkDistance=0;const pawGaitTravel=new WeakMap(),pawIndoorGait={key:'',x:0,y:0,distance:0};
const pawWalkStepBefore=step;
step=function(n,dt,speed){
 const x=n.x,y=n.y,vertical=n===p&&Math.abs(n.ty-y)>Math.abs(n.tx-x);
 const result=pawWalkStepBefore(n,dt,n===p&&vertical?speed*.58:speed);
 const d=Math.hypot(n.x-x,n.y-y);if(Number.isFinite(d)&&d<100){pawGaitTravel.set(n,(pawGaitTravel.get(n)||0)+d);if(n===p)pawWalkDistance+=d}
 return result
};
const pawWalkRenderBefore=backHuman;
const pawScriptedGait={key:'',x:0,y:0,distance:0};
/* PAW_SCRIPTED_GAIT_BEGIN */
function pawTrackScriptedGait(q,key,x,y,walking){
 if(!walking||!key||!Number.isFinite(x)||!Number.isFinite(y)){
  q.key='';q.distance=0;return 0
 }
 const d=q.key===key?Math.hypot(x-q.x,y-q.y):Infinity;
 if(d>65||!Number.isFinite(d))q.distance=0;
 else if(d>.02)q.distance+=d;
 q.key=key;q.x=x;q.y=y;return q.distance
}
/* PAW_SCRIPTED_GAIT_END */
function pawGaitPhase(distance,scale){return Math.max(0,Number.isFinite(distance)?distance:0)/Math.max(34,52*(Number.isFinite(scale)?scale:1))*Math.PI}
function pawGaitStrength(speed,scale){
 const safe=Number.isFinite(speed)?Math.max(0,speed):0;
 const k=Math.max(.35,Number.isFinite(scale)?scale:1);
 return Math.max(0,Math.min(1,safe/(50*k)))
}
function pawPaintedGait(im,x,y,scale,facing,phase,strength=1){
 const sw=im.naturalWidth,sh=im.naturalHeight,h=94*scale,w=h*sw/sh;
 // Keep the body and head intact. The two lower body strips overlap the
 // waist seam; one planted foot remains on the actual world ground.
 const split=Math.round(sh*.76),legH=h*(sh-split)/sh,topH=h-legH,half=Math.floor(sw/2);
 const s=Math.sin(phase)*strength,a=Math.abs(s),side=facing==='left'||facing==='right';
 ctx.save();try{
  ellipse(x,y+1,Math.max(10,w*.31),Math.max(2,scale*4),'#302a2448');
  ctx.translate(x,y);if(facing==='left')ctx.scale(-1,1);
  const widthL=w*half/sw,widthR=w-widthL,overlap=Math.min(3,split),lift=(side?3:1.8)*scale;
  const hips=-legH-a*scale*.45;
  function lower(sx,ww,dx,dw,sign){
   const forward=sign*s,raising=Math.max(0,forward)*lift,shift=side?forward*3.0*scale:sign*a*.65*scale;
   ctx.save();ctx.translate(dx+dw/2,hips);ctx.rotate(side?forward*.10:sign*a*.018);
   const legHeight=legH+a*scale*.45-raising;
   ctx.drawImage(im,sx,split-overlap,ww,sh-split+overlap,-dw/2+shift,-overlap*h/sh,dw,legHeight+overlap*h/sh);ctx.restore()
  }
  if(side&&s>0){lower(half,sw-half,-w/2+widthL,widthR,1);lower(0,half,-w/2,widthL,-1)}
  else{lower(0,half,-w/2,widthL,-1);lower(half,sw-half,-w/2+widthL,widthR,1)}
  ctx.drawImage(im,0,0,sw,split,-w/2,hips-topH,w,topH+.35)
 }finally{ctx.restore()}
}
backHuman=function(x,y,kind,walking,facing,scale=1){
 if(!walking||kind<0||kind>3){
  if(activity&&kind===avatar&&!pawRenderedWalker&&!walking)pawTrackScriptedGait(pawScriptedGait,'',x,y,false);
  if(room&&!pawRenderedWalker&&kind===avatar&&Math.hypot(x-indoor.x,y-indoor.y)<4){pawIndoorGait.key=scene+'|'+room;pawIndoorGait.x=x;pawIndoorGait.y=y}
  return pawWalkRenderBefore(x,y,kind,walking,facing,scale)
 }
 mbArtLoad();const dir=facing==='left'?'right':facing,frames=mbArtRegistry.players[kind]?.walk?.[dir];
 const isPlayer=!room&&!pawRenderedWalker&&kind===avatar&&Math.hypot(x-p.x,y-p.y)<4;
 const actor=pawRenderedWalker||(!room&&!isPlayer?npc.find(n=>Math.hypot(x-n.x,y-n.y)<3):null);
 const indoorPlayer=!!room&&!actor&&kind===avatar&&Math.hypot(x-indoor.x,y-indoor.y)<4;
 if(indoorPlayer){const key=scene+'|'+room;const previous=pawIndoorGait;
  if(previous.key===key){const d=Math.hypot(x-previous.x,y-previous.y);if(d>.02&&d<60)previous.distance+=d}
  else previous.distance=0;
  previous.key=key;previous.x=x;previous.y=y
 }
 const scripted=!!activity&&!actor&&!isPlayer&&kind===avatar;
 const scriptedDistance=scripted?pawTrackScriptedGait(pawScriptedGait,scene+'|'+room+'|'+activity+'|'+kind,x,y,true):0;
 const phase=pawGaitPhase(scripted?scriptedDistance:indoorPlayer?pawIndoorGait.distance:actor?pawGaitTravel.get(actor)||0:isPlayer?pawWalkDistance:0,scale),reduced=actorReduce||residentReducedMotion.matches;
 if(frames){const loaded=frames.map(mbArtImage);if(loaded.every(Boolean)){const i=reduced?0:((Math.floor(phase/Math.PI*frames.length/2)%frames.length)+frames.length)%frames.length;mbArtDrawFrame(frames[i],loaded[i],x,y,scale,facing==='left');return}}
 const im=pics['walker'+kind+(dir==='up'?1:dir==='down'?0:2)];
 if(im?.naturalWidth&&im.naturalHeight&&!reduced&&(dir==='down'||dir==='right')){
  const strength=isPlayer&&Number.isFinite(p.motionSpeed)?pawGaitStrength(p.motionSpeed,scale):1;
  pawPaintedGait(im,x,y,scale,facing,phase,strength);return
 }
 return pawWalkRenderBefore(x,y,kind,walking,facing,scale)
};


/* PAW_PHYSICAL_UI_20: a first implementation batch. Original painted
   assets and all persistent IDs, prices, rewards and handlers remain. */
const pawCanonicalNames={
 tarot:['Moonlight Tarot','月光塔罗'],
 destiny:['Master Yue’s Study','月师傅的书房'],
 station:['Railway Station','火车站']
};
function pawApplyPlaceNames(world){
 for(const m of Object.values(world))for(const door of m.st||[]){
  const names=pawCanonicalNames[door[0]];
  if(names){door[3]=names[0];door[4]=names[1]}
 }
}
pawApplyPlaceNames(maps);
function pawDisplayPlaceText(value){
 const aliases=[['Tarot House','Moonlight Tarot'],['塔罗小屋','月光塔罗'],['Destiny House','Master Yue’s Study'],['命理小馆','月师傅的书房']];
 let result=value;
 for(const [oldName,newName] of aliases)if(typeof result==='string')result=result.split(oldName).join(newName);
 return result
}
const pawPhysicalPageBefore=page;
page=function(title,sub,body){
 return pawPhysicalPageBefore(pawDisplayPlaceText(title),pawDisplayPlaceText(sub),q=>{
  const r=body(q);
  // Generic back/language buttons remain real controls, with short context
  // labels only when the base page has not supplied a specific parent.
  const back=q.querySelector(':scope > .row button:first-child');
  if(back&&back.textContent===tr('‹ Back','‹ 返回'))back.textContent=tr('‹ Back to game','‹ 返回游戏');
  return r
 })
};
const pawPhysicalHeaderBefore=pawVisualHeader;
pawVisualHeader=function(q,theme){
 // A chapter postcard belongs in the travel book, not on the resident
 // identity card, diary, collection cabinet or furniture shelf.
 if(['shop','collection','daily','profile','paper'].includes(theme))return;
 return pawPhysicalHeaderBefore(q,theme)
};
function pawPageTurnDirection(oldIndex,newIndex){
 return oldIndex<0||newIndex<0||oldIndex===newIndex?'':newIndex>oldIndex?'forward':'back'
}
const pawPhysicalJournalBefore=pawJournalRender;
pawJournalRender=function(district=scene){
 const q=$('content'),old=q.querySelector('.pawSketchTabs button[aria-current="page"]');
 const oldIndex=old?Array.from(old.parentElement.children).indexOf(old):-1;
 const result=pawPhysicalJournalBefore(district);
 const spread=q.querySelector('.pawSketchSpread'),next=q.querySelector('.pawSketchTabs button[aria-current="page"]');
 const newIndex=next?Array.from(next.parentElement.children).indexOf(next):-1;
 const direction=pawPageTurnDirection(oldIndex,newIndex);
 if(spread&&direction)spread.dataset.pageTurn=direction;
 const info=q.querySelector('.pawSketchNotes'),station=maps[district]?.st.find(v=>v[0]==='station');
 if(info&&station&&district===scene&&!room&&!activity){
  const departure=element('section','',info,'pawJournalDeparture');
  element('small',tr('Next train','下一班列车'),departure);
  element('strong',tr(...maps[railNextDistrict(scene)].n),departure);
  const go=b(departure,tr('Walk to station','步行去车站'),()=>{
   if(transitioning||room||activity||scene!==district)return;
   $('page').style.display='none';updateHUD();walkDoor(station[0],station[1],station[2])
  });go.className='pawJournalStation';
 }
 return result
};
const pawPhysicalBagBefore=renderTravellerBag;
renderTravellerBag=function(...args){
 const result=pawPhysicalBagBefore(...args),q=$('content'),back=q.querySelector(':scope > .row button:first-child');
 if(back){
  const previous=back.onclick;
  back.onclick=function(...a){
   const detail=q.querySelector('.bagDetail');
   if(detail&&!detail.hidden){
    const close=detail.querySelector('button');if(close){close.click();return}
   }
   return previous?.apply(this,a)
  }
 }
 return result
};
const pawPhysicalHudBefore=updateHUD;
updateHUD=function(...args){
 const result=pawPhysicalHudBefore(...args);
 for(const [btn,en,cn] of [[$('dockScoop'),'Today','今日'],[pawTownDock,'Town Hall','小镇广场']]){
  const label=tr(en,cn);btn.lastElementChild.textContent=label;btn.setAttribute('aria-label',label)
 }
 return result
};
const pawPhysicalUI=document.createElement('style');
pawPhysicalUI.textContent=
 '#game #content[data-paw-visual-theme="shop"]>.row,#game #content[data-paw-visual-theme="collection"]>.row,#game #content[data-paw-visual-theme="daily"]>.row,#game #content[data-paw-visual-theme="profile"]>.row{margin-bottom:4px}'+
 '#game #content[data-paw-visual-theme="shop"]>h1,#game #content[data-paw-visual-theme="collection"]>h1,#game #content[data-paw-visual-theme="daily"]>h1,#game #content[data-paw-visual-theme="profile"]>h1{font:600 clamp(22px,5vw,32px)/1.2 Georgia,"Songti SC",serif;color:#4c5946;margin:5px 0 8px}'+
 '#game #content[data-paw-visual-theme="shop"] .komorebiGrid{gap:0 8px!important;padding:10px 8px 0;background:linear-gradient(90deg,#73563d,#b79769 7%,#bb9e74 93%,#73563d);border:5px solid #73563d;border-top:9px solid #836448;border-radius:2px;align-items:stretch}'+
 '#game #content[data-paw-visual-theme="shop"] .komorebiTile{min-width:0;position:relative;margin:0!important;padding:7px 4px 13px!important;background:#eadcbe!important;border:0!important;border-radius:0!important;border-bottom:9px solid #795a3c!important;box-shadow:0 4px 2px #4b352b50!important;color:#433729!important}'+
 '#game #content[data-paw-visual-theme="shop"] .komorebiTile .mbFurnitureMat{border:0;background:radial-gradient(ellipse at 50% 85%,#a88a5a35,transparent 65%);box-shadow:none;padding:3px}'+
 '#game #content[data-paw-visual-theme="shop"] .komorebiTile strong{overflow-wrap:anywhere;line-height:1.25}'+
 '#game #content[data-paw-visual-theme="collection"] .bagSlots{border-width:6px;border-top-width:10px;gap:8px}'+
 '#game #content[data-paw-visual-theme="collection"] .bagSlot{border-bottom:5px solid #8d6d4a!important;box-shadow:0 3px 2px #64492e30!important}'+
 '#game #content[data-paw-visual-theme="room"] .hideoutScene{margin-inline:auto;border:0!important;box-shadow:0 4px 10px #4b372f33;max-width:100%}'+
 '#game #content .pawSketchSpread[data-page-turn]{transform-origin:center left;animation:pawPaperNext .24s ease-out both}'+
 '#game #content .pawSketchSpread[data-page-turn="back"]{transform-origin:center right;animation-name:pawPaperPrev}'+
 '@keyframes pawPaperNext{from{opacity:.65;transform:perspective(1000px) rotateY(-8deg) translateX(4px)}to{opacity:1;transform:none}}'+
 '@keyframes pawPaperPrev{from{opacity:.65;transform:perspective(1000px) rotateY(8deg) translateX(-4px)}to{opacity:1;transform:none}}'+
 '#game #content .pawJournalDeparture{display:grid;gap:4px;padding:9px;margin-top:10px;border:3px solid #85674b;background:#405548;color:#fff3d9}'+
 '#game #content .pawJournalDeparture small,#game #content .pawJournalDeparture strong{color:#fff3d9;overflow-wrap:anywhere}'+
 '#game #content .pawJournalStation{min-height:44px;background:#f4e5c6!important;border:1px solid #b9a178!important;color:#3b5041!important}'+
 '@media(max-width:380px){#game #content[data-paw-visual-theme="shop"] .komorebiGrid{gap:0 5px!important;padding:6px 4px 0;border-width:4px}#game #content[data-paw-visual-theme="shop"] .komorebiTile{padding:4px 3px 9px!important}.pawSketchTabs button{font-size:11px!important;line-height:1.25!important}}'+
 '@media(prefers-reduced-motion:reduce){#game #content .pawSketchSpread[data-page-turn]{animation:none!important}}';
document.head.append(pawPhysicalUI);


/* PAW_AMBIENT_RESIDENTS: autonomous remarks, separate from intentional
   dialogue. Rendered residents only; never simulate a real online visitor. */
const pawAmbientLines={
 temple:[['incense','The incense has just been lit.','刚点上的香，闻起来很清淡。'],['leaves','I swept the courtyard this morning. The leaves had other plans.','早上才扫过院子，树叶又落了一地。'],['silence','The courtyard is lovely when nobody is in a hurry.','没人赶时间的时候，院子格外安静。'],['bell','I like the silence just after the bell fades.','我喜欢钟声散去后的那片安静。']],
 tarot:[['deck','I repaired the corners of this old deck yesterday.','昨天把这副旧牌的边角修好了。'],['window','The light by the window is lovely for reading.','窗边的光线很适合看牌。'],['angle','A card offers a new angle, not an answer to everything.','塔罗可以让人换个角度思考，但不是万能答案。'],['tea','My tea has gone cold again.','我的茶又放凉了。']],
 yue:[['stars','The sky was unusually clear last night.','昨晚的星空特别清亮。'],['note','I found a little note tucked inside an old almanac.','翻历书的时候，发现里面夹着一张旧字条。'],['time','Some questions become clearer with time.','有些问题，放一放反而更明白。'],['brush','This writing brush has served me well. It may be time to retire it.','这支毛笔陪了我好多年，也该退休了。']],
 garden:[['buds','There are new buds beside the stone path.','石径旁边冒出了新芽。'],['wind','The wind turned all the wish tags around.','风把祈愿牌都吹转了方向。'],['pond','The pond is especially lovely in the late afternoon.','傍晚的池塘特别好看。'],['ribbon','Someone tied a loose ribbon back onto the wishing rack. How thoughtful.','有人把松了的红绳重新系好了，真贴心。']],
 grandma:[['soup','The soup is nearly ready. A slow simmer makes all the difference.','汤快好了，慢慢熬才够味。'],['market','The market had lovely mushrooms this morning.','今天早市的菇特别新鲜。'],['bowl','My favourite bowl has a chip. I still cannot bear to throw it away.','我最喜欢的碗缺了个口，还是舍不得丢。'],['ginger','A little ginger makes this broth much warmer.','汤里放点姜，喝下去暖暖的。']],
 mei:[['seat','I moved to this seat. The breeze is nicer here.','我换到这边坐，风吹着舒服。'],['letter','A postcard from the coast came this morning.','今天早上收到一张海边寄来的明信片。'],['tea','The second pot of tea always tastes better.','第二泡茶总是更香。'],['flower','I brought a few flowers for the table.','我带了几枝花，给桌上添点颜色。']],
 hong:[['bouquet','Someone bought flowers and refused to say who they were for. Interesting.','有人买了花，却不肯说送给谁。有点意思。'],['umbrella','The station keeper found one very lonely umbrella.','站长捡到一把落单的雨伞。'],['cake','There was a cake in the tea room yesterday. Gone in six minutes.','昨天茶馆有蛋糕，六分钟就没了。'],['promise','I promised not to gossip today. It has been a difficult morning.','我答应今天不吃瓜，整个上午都很煎熬。']],
 wang:[['leave','I took annual leave today and still checked my email. A terrible habit.','今天休年假，我居然还在看邮件。坏习惯。'],['plant','My office plant is thriving. It has never attended a meeting.','办公室那盆植物长得很好，毕竟它不用开会。'],['lunch','I finally had lunch before three. A personal record.','今天终于在三点前吃上午饭，破纪录了。'],['tea','I came here for tea, not a networking opportunity.','我今天就来喝茶，不拓展人脉。']],
 ahma:[['slipper','I bought these slippers for comfort. They found a second career.','这双拖鞋本来是买来穿的，没想到还有第二份工作。'],['river','The river does not ask for an explanation. That is why I like it.','河水不会追问原因，我就喜欢这点。'],['chair','Sit if your feet are tired. Standing all day fixes nothing.','脚累了就坐，站一天也解决不了什么。'],['paper','There is spare paper if there is something you want to let go.','想放下什么的话，我这里还有纸。']],
 lin:[['deer','That deer has been watching the same tree for ages.','那只鹿盯着同一棵树看了好久。'],['cat','The cat chose the sunniest spot, as usual.','猫又抢到了阳光最好的位置。'],['grass','The grass smells lovely after the morning dew.','清晨露水过后的草地特别好闻。'],['bow','Sometimes the deer bows first. Sometimes it just wants a snack.','有时候鹿会先鞠躬，有时候只是想吃饼干。']],
 arcade:[['prize','The yellow prize has been surprisingly popular today.','今天黄色的奖品特别受欢迎。'],['repair','I tightened the cabinet controls this morning.','今天早上把游戏机的摇杆修紧了。'],['score','Someone left very mysterious initials on the score board.','排行榜上有个神秘的名字缩写。'],['sound','I love that little victory sound.','我最喜欢听过关时那一小段音乐。']],
 boba:[['pearls','Fresh pearls are ready. The first batch smells wonderful.','珍珠刚煮好，第一锅特别香。'],['warm','Someone ordered warm milk tea on a hot day. Fair enough.','大热天有人点了热奶茶，也挺有道理。'],['cup','I finally found cups that do not leak at the seam.','终于找到封口不漏的杯子了。'],['blend','I am trying a different tea blend this week.','这星期想试试新的拼配茶底。']],
 souvenir:[['postcard','The coastal postcards arrived this morning.','海边那批明信片今天早上到了。'],['box','This little wooden box took ages to polish.','这个小木盒打磨了好久。'],['shelf','I left the new pieces on the lower shelf.','新到的小东西放在下面那层了。'],['wrap','I like wrapping gifts, even the tiny ones.','我很喜欢包礼物，再小的也一样。']],
 lab:[['notes','Two people answered the same question in completely different ways.','同一道题，两个人给了完全不同的答案。'],['change','People change. That is the interesting part.','人是会变的，这才有意思。'],['pencil','I keep losing my favourite pencil.','我总是找不到那支最喜欢的铅笔。']],
 story:[['page','A loose page turned up between two old books.','两本旧书中间夹着一张散页。'],['ending','I like stories that leave a little room for the reader.','我喜欢给读者留点想象空间的故事。'],['letter','A letter can change the direction of a whole story.','一封信就能改变整个故事的走向。']],
 cafe:[['cup','These cups never quite match. I like them that way.','这些杯子都不成套，我倒挺喜欢。'],['table','There is space at the table by the window.','窗边那张桌子还有空位。'],['quiet','Two people can enjoy tea without filling every silence.','两个人喝茶，也不必一直找话说。']]
};
const pawAmbientKey='pawAmbientHistoryV1';
function pawAmbientRead(raw,now){
 return Array.isArray(raw)?raw.filter(v=>Array.isArray(v)&&typeof v[0]==='string'&&typeof v[1]==='string'&&Number.isFinite(v[2])&&v[2]<=now&&now-v[2]<86400000).slice(-80):[]
}
function pawAmbientPick(id,lines,history,now,rng=Math.random){
 if(!Array.isArray(lines)||!lines.length)return null;
 const recent=history.filter(v=>v[0]===id&&now-v[2]<86400000);
 const available=lines.filter(v=>!recent.some(h=>h[1]===v[0]));
 return available.length?available[Math.min(available.length-1,Math.max(0,Math.floor(rng()*available.length)))]:null
}
let pawAmbientHistory=pawAmbientRead(load(pawAmbientKey,[]),Date.now());
let pawAmbientIndoor=[],pawAmbientActive=null,pawAmbientNext=0,pawAmbientCheck=0,pawAmbientContext='';
let pawAmbientBudget=0;
const pawAmbientNode=element('div','',$('game'),'pawAmbientSpeech');pawAmbientNode.hidden=true;
pawAmbientNode.setAttribute('role','status');pawAmbientNode.setAttribute('aria-live','polite');pawAmbientNode.setAttribute('aria-atomic','true');
const pawAmbientName=element('strong','',pawAmbientNode),pawAmbientText=element('span','',pawAmbientNode);
const pawAmbientStyle=document.createElement('style');
pawAmbientStyle.textContent='#game .pawAmbientSpeech{position:absolute;z-index:8;box-sizing:border-box;max-width:min(220px,62%);padding:7px 10px;border:1px solid #9b815c;border-radius:9px;background:#fff3dcf7;color:#483d2e;box-shadow:0 2px 5px #443b2e33;pointer-events:none;line-height:1.35;font-size:clamp(12px,3.2vw,14px);overflow-wrap:anywhere}#game .pawAmbientSpeech[hidden]{display:none!important}#game .pawAmbientSpeech strong{display:block;font-size:.8em;color:#526a50;margin-bottom:2px}#game .pawAmbientSpeech span{display:block}';
document.head.append(pawAmbientStyle);
const pawAmbientDrawGathering=drawGatheringPainted;
drawGatheringPainted=function(name,x,y,scale=1,facing='right'){
 const result=pawAmbientDrawGathering(name,x,y,scale,facing);
 if(result&&room&&!activity){
  const record=residentArtworkRecord(name),im=residentArtworkImage(record),rect=residentArtworkRect(record,im,x,y,scale);
  if(rect)pawAmbientIndoor.push({n:Array.isArray(name)?name:[name,name],x,y,rect})
 }
 return result
};
const pawAmbientRoomDraw=drawRoom;
drawRoom=function(...args){pawAmbientIndoor=[];return pawAmbientRoomDraw(...args)};
function pawAmbientProfile(actor){
 if(!actor?.n||actor.sharedPeer||actor.kind===2)return null;
 return actor.n.map(residentWelcomeFor).find(v=>v&&pawAmbientLines[v.id])||null
}
function pawAmbientBounds(actor){
 if(!room)return characterScreenBounds(actor);
 const r=actor.rect,s=cam.scale;
 return {left:cam.ox+r.x*s,top:cam.oy+r.y*s,right:cam.ox+(r.x+r.w)*s,bottom:cam.oy+(r.y+r.h)*s}
}
function pawAmbientClear(){pawAmbientActive=null;pawAmbientNode.hidden=true}
function pawAmbientBlocked(){
 return document.hidden||avatar===null||!proposal.hidden||transitioning||talkOpen||!!activity||$('page').style.display==='block'||($('arrival')&&!$('arrival').hidden)
}
function pawAmbientPlace(actor,actors){
 const bounds=pawAmbientBounds(actor);
 if(!bounds||bounds.right<12||bounds.left>W-12||bounds.bottom<100||bounds.top>H-110)return false;
 const root=$('game').getBoundingClientRect(),blocks=[];
 for(const n of document.querySelectorAll('#hud,#small,#dock,#back,#hint,#gameControls,#movePad,#moveGuide,#walkHelp,#worldSigns .worldSign:not([hidden]),#pawPlaceName')){
  if(n.hidden||!n.getClientRects().length)continue;
  const css=getComputedStyle(n);if(css.visibility==='hidden'||css.display==='none'||Number(css.opacity)<.05)continue;
  const r=n.getBoundingClientRect();if(r.width&&r.height)blocks.push({left:r.left-root.left,top:r.top-root.top,right:r.right-root.left,bottom:r.bottom-root.top})
 }
 for(const n of actors)if(n!==actor)blocks.push(pawAmbientBounds(n));
 const player=room&&typeof indoor!=='undefined'&&Number.isFinite(indoor.x)?{left:cam.ox+(indoor.x-34)*cam.scale,top:cam.oy+(indoor.y-120)*cam.scale,right:cam.ox+(indoor.x+34)*cam.scale,bottom:cam.oy+indoor.y*cam.scale}:characterScreenBounds(p,true);
 const pos=chooseSpeechPosition(pawAmbientNode.offsetWidth,pawAmbientNode.offsetHeight,W,H,bounds,player,blocks);
 if(!pos)return false;
 pawAmbientNode.style.left=pos.left+'px';pawAmbientNode.style.top=pos.top+'px';
 pawAmbientNode.dataset.above=String(pos.above===true);pawAmbientNode.style.setProperty('--paw-tail-x',pawSpeechAnchor(Number(pos.tailX),pawAmbientNode.offsetWidth)+'px');return true
}
function pawAmbientTick(now){
 if(now<pawAmbientCheck)return;pawAmbientCheck=now+180;
 const context=scene+'|'+(room||'outside')+'|'+zh;
 if(context!==pawAmbientContext){pawAmbientContext=context;pawAmbientClear();pawAmbientNext=now+4500+Math.random()*4500}
 if(pawAmbientBlocked()){pawAmbientClear();pawAmbientNext=Math.max(pawAmbientNext,now+3000);return}
 const actors=room?pawAmbientIndoor:npc.filter(n=>!n.sharedPeer&&n.kind!==2);
 if(pawAmbientActive){
  const actor=actors.find(n=>pawAmbientProfile(n)?.id===pawAmbientActive.id);
  if(now>=pawAmbientActive.until||!actor||!pawAmbientPlace(actor,actors))pawAmbientClear();
  return
 }
 if(now<pawAmbientNext||pawAmbientBudget>=35)return;
 pawAmbientNext=now+7000+Math.random()*11000;
 const clock=Date.now();pawAmbientHistory=pawAmbientRead(pawAmbientHistory,clock);
 const origin=room&&typeof indoor!=='undefined'?indoor:p;
 const candidates=actors.filter(n=>Math.hypot(n.x-origin.x,n.y-origin.y)<270).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y));
 for(const actor of candidates){
  const profile=pawAmbientProfile(actor);if(!profile)continue;
  if(pawAmbientHistory.some(h=>h[0]===profile.id&&clock-h[2]<120000))continue;
  const line=pawAmbientPick(profile.id,pawAmbientLines[profile.id],pawAmbientHistory,clock);if(!line)continue;
  pawAmbientName.textContent=tr(...actor.n);pawAmbientText.textContent=tr(line[1],line[2]);pawAmbientNode.hidden=false;
  if(!pawAmbientPlace(actor,actors)){pawAmbientNode.hidden=true;continue}
  pawAmbientActive={id:profile.id,until:now+Math.min(9500,Math.max(4200,2400+Array.from(pawAmbientText.textContent).length*65))};
  pawAmbientHistory.push([profile.id,line[0],clock]);pawAmbientHistory=pawAmbientHistory.slice(-80);
  save(pawAmbientKey,pawAmbientHistory);pawAmbientBudget++;return
 }
}
const pawAmbientLoopBefore=loop;
loop=function(ms){
 const result=pawAmbientLoopBefore(ms);
 try{pawAmbientTick(ms)}catch(e){pawAmbientClear();pawAmbientNext=ms+30000;console.warn('Ambient speech skipped',e)}
 return result
};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pawAmbientClear()});
// Intentional conversation still has its existing choices; stop automatically
// prefixing every first meeting with the same name or a generic office joke.
residentNamedGreeting=function(en,cn){return tr(en,cn)};
residentHospitalityWelcome=function(profile,visits){
 if(profile.id==='boba'&&residentHospitality.drink&&visits>1&&visits%4===0){
  const base=teaChoices[residentHospitality.drink.base];return tr('I remember your '+base[0]+'.','我还记得你上次点的'+base[1]+'。')
 }
 if(profile.id==='grandma'&&residentHospitality.soup&&visits>1&&visits%4===0){
  const [en,cn]=residentHospitality.soup;return tr('Last time you had '+en+'.','上次你喝的是'+cn+'。')
 }
 const pair=profile.lines[Math.max(0,visits-1)%profile.lines.length];
 return tr(...pair)
};

/* PAW_OVERHEARD_BEGIN: fictional residents exchange brief remarks only if
   both are actually rendered and nearby. No simulated public user messages. */
const pawOverheard=[
 ['flowers','hong','mei','Someone left flowers by the station. No name on the card.','车站有人放了一束花，卡片上没署名。','Maybe they just wanted to brighten somebody’s day.','也许只是想让某个人今天开心一点。'],
 ['soup','grandma','mei','I made too much soup again.','汤又煮多了。','Bring it over. I have enough bowls for everyone.','端过来吧，我这儿的碗够大家用。'],
 ['postcard','mei','wang','Have you ever sent yourself a postcard?','你有没有给自己寄过明信片？','Not yet. At least I would finally get a pleasant email.','还没。总算能收到点工作以外的消息了。'],
 ['umbrella','hong','wang','There is an umbrella at the station waiting for its owner.','车站有把伞，还在等主人认领呢。','If it is blue, I have been wondering where mine went.','蓝色的话可能是我的，我找了好久。'],
 ['recipe','grandma','boba','Have you tried adding a little roasted rice to your tea?','茶里加点炒过的米试过吗？','Not yet. I will make you the first cup.','还没，第一杯留给您。'],
 ['nap','wang','grandma','I thought about going home for a nap.','本来想回家睡个午觉。','Eat first. You can nap properly on a full stomach.','先吃饭，吃饱了才能睡得香。'],
 ['ribbon','temple','garden','The wind loosened some of the wish tags.','风把几块祈愿牌吹松了。','I brought extra cord. We can tie them back.','我带了红绳，待会儿一起系好。'],
 ['book','yue','mei','I found an old travel diary in my cupboard.','柜子里翻出一本旧旅行日记。','Bring it to the tea room sometime. We would love to see it.','哪天带来茶馆吧，大家一定想看看。'],
 ['tea','hong','grandma','Did you hear the shopkeeper is trying a new blend?','听说店主要试一种新的茶底？','Then I had better bring some biscuits.','那我得带点饼干过来。'],
 ['plant','wang','mei','My plant has outgrown its little pot.','我那盆植物都快把花盆挤破了。','I have a spare one. Take it when you leave.','我有个闲置的花盆，走的时候拿去。'],
 ['cat','lin','mei','A cat followed me all the way to the park.','有只猫一路跟着我走到公园。','Perhaps it has decided you are its person.','说不定它已经认定你是它的人了。'],
 ['cup','boba','wang','You left your reusable cup here last time.','你上次把随行杯落在店里了。','That explains why my desk has been unusually tidy.','难怪我桌面最近格外整洁。']
];
function pawSocialPairReady(a,b,origin,maxPlayer=270,maxPair=260){
 return !!a&&!!b&&a!==b&&[a.x,a.y,b.x,b.y,origin?.x,origin?.y].every(Number.isFinite)&&Math.hypot(a.x-origin.x,a.y-origin.y)<maxPlayer&&Math.hypot(b.x-origin.x,b.y-origin.y)<maxPlayer&&Math.hypot(a.x-b.x,a.y-b.y)<=maxPair
}
function pawSocialOnscreen(bounds,w,h){
 return !!bounds&&[bounds.left,bounds.right,bounds.top,bounds.bottom,w,h].every(Number.isFinite)&&bounds.right>12&&bounds.left<w-12&&bounds.bottom>90&&bounds.top<h-90&&bounds.right>bounds.left&&bounds.bottom>bounds.top
}
function pawOverheardChoose(actors,origin,history,now,rng=Math.random){
 const close=actors.filter(a=>Math.hypot(a.x-origin.x,a.y-origin.y)<270);
 const possible=[];
 for(const e of pawOverheard){
  if(history.some(h=>h[0]==='exchange'&&h[1]===e[0]&&now-h[2]<86400000))continue;
  const a=close.find(v=>v.id===e[1]),b=close.find(v=>v.id===e[2]);
  if(!pawSocialPairReady(a,b,origin))continue;
  if(history.some(h=>(h[0]===a.id||h[0]===b.id)&&now-h[2]<120000))continue;
  possible.push({entry:e,a,b})
 }
 return possible.length?possible[Math.min(possible.length-1,Math.max(0,Math.floor(rng()*possible.length)))]:null
}
pawOverheard.push(...[
 [
  "guest-lyrics",
  "guest:jay-conclusion",
  "temple",
  "The bell has a lovely rhythm. Is there a quiet time to listen?",
  "这钟声真有节奏，什么时候来听最清静？",
  "Early morning, before everyone arrives.",
  "清晨人还没来齐的时候。"
 ],
 [
  "guest-rain",
  "guest:raincheck",
  "guest:traveller_03_kenji_dispatcher",
  "Would you wait for the light to change?",
  "你会等光线变一变再走吗？",
  "Only if you promise to catch the next train.",
  "可以，不过得说好坐下一班。"
 ],
 [
  "guest-noodles",
  "guest:gordon-ramen",
  "guest:traveller_01_sven_flatpack",
  "Is that a portable stool or a kitchen contraption?",
  "这是折叠凳，还是厨房新发明？",
  "A stool. Your noodles are much harder to assemble.",
  "是凳子。你的拉面可比它难组装多了。"
 ],
 [
  "guest-kopi",
  "guest:merlion-host",
  "guest:raincheck",
  "Kopi peng? The ice is melting already.",
  "冰咖啡要吗？冰都快化了。",
  "Then we had better enjoy the scene before the next one.",
  "那就趁下一幕还没开始，好好享受这一幕。"
 ],
 [
  "guest-taylor-tea",
  "guest:taylor-shift",
  "guest:dilitea",
  "I need a title for a song about ignoring notifications.",
  "我想给一首不回消息的歌取个名字。",
  "Read at 5:59, reply tomorrow.",
  "五点五十九已读，明天再回。"
 ],
 [
  "guest-rest",
  "guest:andy-leisure",
  "guest:jj-leave",
  "Do you have anything planned for the afternoon?",
  "下午有什么安排吗？",
  "No. I am quite proud of that.",
  "没有。我还挺为这件事骄傲的。"
 ]
]);
/* PAW_OVERHEARD_END */
let pawOverheardPending=null;
const pawOverheardClearBefore=pawAmbientClear;
pawAmbientClear=function(){pawOverheardPending=null;return pawOverheardClearBefore()};
function pawSpeechDuration(str){return Math.min(9500,Math.max(4200,2400+Array.from(str).length*65))}
function pawOverheardShow(actor,actors,text,id,now){
 pawAmbientName.textContent=tr(...actor.n);pawAmbientText.textContent=text;pawAmbientNode.hidden=false;
 if(!pawAmbientPlace(actor,actors)){pawAmbientNode.hidden=true;return false}
 pawAmbientActive={id,until:now+pawSpeechDuration(text)};return true
}
function pawRememberExchange(entry,clock){
 pawAmbientHistory.push(['exchange',entry[0],clock],[entry[1],'exchange:'+entry[0],clock],[entry[2],'exchange:'+entry[0],clock]);
 pawAmbientHistory=pawAmbientHistory.slice(-80);save(pawAmbientKey,pawAmbientHistory)
}
const pawSocialTickBefore=pawAmbientTick;
pawAmbientTick=function(now){
 // The original tick owns all blocking/context decisions and solo speech.
 if(pawAmbientBlocked()||pawAmbientContext!==scene+'|'+(room||'outside')+'|'+zh){pawAmbientClear();return pawSocialTickBefore(now)};
 const actors=room?pawAmbientIndoor:npc.filter(n=>!n.sharedPeer&&n.kind!==2),origin=room&&typeof indoor!=='undefined'?indoor:p;
 if(pawOverheardPending){
  if(now<pawAmbientCheck)return;
  pawAmbientCheck=now+180;
  const pending=pawOverheardPending,actor=actors.find(n=>pawAmbientProfile(n)?.id===pending.id),other=actors.find(n=>pawAmbientProfile(n)?.id===pending.other);
  if(!pawSocialPairReady(actor,other,origin)||!pawSocialOnscreen(pawAmbientBounds(actor),W,H)||!pawSocialOnscreen(pawAmbientBounds(other),W,H)){
   pawAmbientClear();pawAmbientNext=now+7000;return
  }
  if(now<pending.at){
   if(pawAmbientActive&&!pawAmbientPlace(other,actors))pawAmbientClear();
   return
  }
  pawOverheardPending=null;pawAmbientActive=null;
  if(!pawOverheardShow(actor,actors,pending.text,pending.id,now))pawAmbientClear();
  else {pawRememberExchange(pending.entry,Date.now());pawAmbientBudget++}
  pawAmbientNext=now+15000;return
 }
 if(!pawAmbientActive&&now>=pawAmbientCheck&&now>=pawAmbientNext&&pawAmbientBudget<=33&&Math.random()<.32){
  const clock=Date.now();pawAmbientHistory=pawAmbientRead(pawAmbientHistory,clock);
  const indexed=actors.filter(a=>pawSocialOnscreen(pawAmbientBounds(a),W,H)).map(a=>({id:pawAmbientProfile(a)?.id,x:a.x,y:a.y,actor:a})).filter(a=>a.id);
  const chosen=pawOverheardChoose(indexed,origin,pawAmbientHistory,clock);
  if(chosen){
   const e=chosen.entry;
   if(pawOverheardShow(chosen.a.actor,actors,tr(e[3],e[4]),e[1],now)){
    pawOverheardPending={id:e[2],other:e[1],text:tr(e[5],e[6]),at:pawAmbientActive.until,entry:e};
    // Only a successfully displayed second line consumes the exchange for the day.
    pawAmbientHistory.push([e[1],'exchange-start:'+e[0],clock]);pawAmbientHistory=pawAmbientHistory.slice(-80);save(pawAmbientKey,pawAmbientHistory);pawAmbientBudget++;return
   }
  }
 }
 return pawSocialTickBefore(now)
};
/* Return from a cabinet or private item to the room that opened it. */
const pawCabinetReturnBefore=figureCabinetPage;
figureCabinetPage=function(back='room'){
 const result=pawCabinetReturnBefore(back);
 mbHomePageBack(back==='bag'?tr('‹ Collections','‹ 返回收藏'):back==='arcade'?tr('‹ Blind boxes','‹ 返回盲盒'):tr('‹ My Room','‹ 返回小窝'),()=>{
  if(back==='bag')renderTravellerBag();
  else if(back==='arcade'){$('page').style.display='none';if(activity!=='blindBox')start('blindBox')}
  else hideoutPage()
 });return result
};
/* Preserve catalogue position after inspecting one piece. Save no additional
   purchase data and leave the existing filter and ownership logic intact. */
let pawCatalogueResume=null;
const pawCatalogueDetailBefore=furnitureConfirm;
furnitureConfirm=function(id,back='shop'){
 if($('content').querySelector('.komorebiGrid'))pawCatalogueResume={id,back,scroll:$('page').scrollTop};
 return pawCatalogueDetailBefore(id,back)
};
const pawCatalogueReturnBefore=furnitureMarket;
furnitureMarket=function(back='shop'){
 const result=pawCatalogueReturnBefore(back),resume=pawCatalogueResume;
 if(resume&&resume.back===back){
  pawCatalogueResume=null;
  const q=$('content'),tile=[...q.querySelectorAll('[data-furniture-id]')].find(n=>n.dataset.furnitureId===resume.id);
  requestAnimationFrame(()=>{if(!q.querySelector('.komorebiGrid'))return;$('page').scrollTop=resume.scroll;if(tile&&!tile.hidden)tile.focus({preventScroll:true})})
 }
 return result
};
const pawHomeObjectsBefore=hideoutPage;
hideoutPage=function(...args){
 const result=pawHomeObjectsBefore(...args),q=$('content'),stage=q.querySelector('.hideoutScene');
 if(!stage||hideoutEditing)return result;
 // Existing room objects already have actions; give their physical hit
 // targets keyboard semantics and contextual returns as well.
 for(const item of stage.querySelectorAll('.hideoutPlaced,.figureCabinetInRoom')){
  const id=item.dataset.furnitureId;
  if(typeof item.onclick!=='function'||item.tagName==='BUTTON')continue;
  if(!['board','frame','shelf','lamp','shojiLamp','retroTV','displayCabinet','bed','futon'].includes(id))continue;
  item.tabIndex=0;item.setAttribute('role','button');item.setAttribute('aria-label',item.alt||id);
  item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();item.click()}});
  if(['board','frame','shelf','retroTV','displayCabinet'].includes(id)){
   const old=item.onclick;item.onclick=function(...a){
    const r=old.apply(this,a);
    if(!$('content').querySelector('.hideoutScene'))mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage);
    return r
   }
  }
 }
 return result
};
const pawRoomAccessStyle=document.createElement('style');pawRoomAccessStyle.textContent='#content .hideoutScene [role=button]:focus-visible,#content .figureCabinetInRoom:focus-visible{outline:2px solid #f9e3ad;outline-offset:3px}#content .hideoutScene .hideoutPlaced[role=button]{cursor:pointer}#content .komorebiTile:focus-visible{outline:3px solid #526a50;outline-offset:-3px}';document.head.append(pawRoomAccessStyle);


/* A journal shortcut is a direction, not a teleport between interiors. */
let pawJournalWalkToken=0;
function pawJournalWalkToDoor(id,x,y){
 const token=++pawJournalWalkToken,district=scene,deadline=performance.now()+5000;
 let exits=0,lastRoom=room,lastActivity=activity,waiting=false;
 const proceed=()=>{
  if(token!==pawJournalWalkToken||scene!==district||$('page').style.display==='block'||document.hidden)return;
  if(performance.now()>deadline){hint('Choose a doorway to continue.','点选店门继续逛。');return}
  if(transitioning){requestAnimationFrame(proceed);return}
  if(!room){walkDoor(id,x,y);return}
  if(waiting&&room===lastRoom&&activity===lastActivity){requestAnimationFrame(proceed);return}
  if(exits>=2)return;
  lastRoom=room;lastActivity=activity;waiting=true;exits++;
  $('back').click();requestAnimationFrame(proceed)
 };
 proceed()
}
// Stop the animation without invoking a queued furniture action if the
// player leaves the room, switches tabs or hides the browser.
const pawHomeMotionPageBefore=page;
page=function(...args){pawHomeStop();pawJournalWalkToken++;return pawHomeMotionPageBefore(...args)};
document.addEventListener('visibilitychange',()=>{if(document.hidden){pawHomeStop();pawJournalWalkToken++}});
const pawHomeMotionJourneyBefore=journey;
journey=function(...args){pawHomeStop();pawJournalWalkToken++;return pawHomeMotionJourneyBefore(...args)};
const pawHomeMotionEnterBefore=enter;
enter=function(...args){pawHomeStop();return pawHomeMotionEnterBefore(...args)};
/* Existing ambient speech must fall silent if the listener walks away. */
const pawAmbientDistanceBefore=pawAmbientTick;
pawAmbientTick=function(now){
 if(pawAmbientActive&&now>=pawAmbientCheck&&!pawAmbientBlocked()){
  const origin=room&&typeof indoor!=='undefined'?indoor:p,actors=room?pawAmbientIndoor:npc;
  const actor=actors.find(n=>pawAmbientProfile(n)?.id===pawAmbientActive.id);
  if(!actor||Math.hypot(actor.x-origin.x,actor.y-origin.y)>300){pawAmbientClear();pawAmbientNext=now+7000}
 }
 return pawAmbientDistanceBefore(now)
};

/* PAW_AMBIENT_RESIDENTS_END */


/* PAW_HOME_WALK_BEGIN */
const pawHomeBounds={l:10,r:90,u:68,d:94};
function pawHomeSafe(point,blocks,bounds=pawHomeBounds){
 return Number.isFinite(point.x)&&Number.isFinite(point.y)&&point.x>=bounds.l&&point.x<=bounds.r&&point.y>=bounds.u&&point.y<=bounds.d&&!blocks.some(b=>point.x>b.l&&point.x<b.r&&point.y>b.u&&point.y<b.d)
}
function pawHomeSegment(a,b,blocks,bounds=pawHomeBounds){
 const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/.6));
 for(let i=0;i<=n;i++){const t=i/n;if(!pawHomeSafe({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t},blocks,bounds))return false}
 return true
}
function pawHomeGrid(blocks,bounds=pawHomeBounds){
 const grid=[];
 for(let y=bounds.u;y<=bounds.d;y+=2)for(let x=bounds.l;x<=bounds.r;x+=2){
  const p={x,y};if(pawHomeSafe(p,blocks,bounds))grid.push(p)
 }
 return grid
}
function pawHomeNearest(point,grid){
 return grid.reduce((best,p)=>!best||Math.hypot(p.x-point.x,p.y-point.y)<Math.hypot(best.x-point.x,best.y-point.y)?p:best,null)
}
function pawHomeRoute(start,goal,blocks,bounds=pawHomeBounds){
 if(!pawHomeSafe(start,blocks,bounds)||!Number.isFinite(goal.x)||!Number.isFinite(goal.y))return null;
 const grid=pawHomeGrid(blocks,bounds);if(!grid.length)return null;
 const end=pawHomeSafe(goal,blocks,bounds)?goal:pawHomeNearest(goal,grid);
 if(!end)return null;
 if(pawHomeSegment(start,end,blocks,bounds))return [end];
 const nodes=new Map(grid.map(v=>[v.x+','+v.y,v])),keys=[...nodes.keys()],near=keys.filter(k=>pawHomeSegment(start,nodes.get(k),blocks,bounds)).sort((a,b)=>Math.hypot(nodes.get(a).x-start.x,nodes.get(a).y-start.y)-Math.hypot(nodes.get(b).x-start.x,nodes.get(b).y-start.y));
 if(!near.length)return null;
 const parent=new Map(),queue=[];
 for(const k of near){parent.set(k,null);queue.push(k)}
 let found=null;
 for(let i=0;i<queue.length;i++){
  const k=queue[i],a=nodes.get(k);
  if(pawHomeSegment(a,end,blocks,bounds)){found=k;break}
  for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2],[2,2],[-2,2],[2,-2],[-2,-2]]){
   const next=(a.x+dx)+','+(a.y+dy),b=nodes.get(next);
   if(!b||parent.has(next)||!pawHomeSegment(a,b,blocks,bounds))continue;
   parent.set(next,k);queue.push(next)
  }
 }
 if(found===null)return null;
 const path=[end];for(let k=found;k!==null;k=parent.get(k))path.unshift(nodes.get(k));
 // Remove unnecessary turns while preserving tested clearance.
 const smooth=[];let at=start;
 for(let i=0;i<path.length;){let j=path.length-1;while(j>i&&!pawHomeSegment(at,path[j],blocks,bounds))j--;smooth.push(path[j]);at=path[j];i=j+1}
 return smooth
}
function pawHomeFootprint(x,y,width,kind,id,aspect=1){
 if(![x,y,width,aspect].every(Number.isFinite)||width<=0||kind==='wall'||kind==='floor'||kind==='finish'||id==='rug'||y<65)return null;
 const half=Math.min(46,Math.max(5,width*.43+3)),depth=Math.min(12,Math.max(3,width*.21*aspect));
 return {l:x-half,r:x+half,u:y-depth-2,d:y+3}
}
function pawHomeObjectApproach(start,anchor,blocks,bounds=pawHomeBounds){
 const offsets=[[0,8],[-10,6],[10,6],[-16,0],[16,0],[0,-8],[-16,10],[16,10]];
 const options=offsets.map(([x,y])=>({x:anchor.x+x,y:anchor.y+y})).filter(v=>pawHomeSafe(v,blocks,bounds)).sort((a,b)=>Math.hypot(a.x-start.x,a.y-start.y)-Math.hypot(b.x-start.x,b.y-start.y));
 return options.find(v=>pawHomeRoute(start,v,blocks,bounds))||null
}
function pawHomeDirection(a,b,aspect=1){
 const dx=(b.x-a.x)*aspect,dy=b.y-a.y;
 return Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')
}
/* PAW_HOME_WALK_END */
const pawHomePositions=new Map();
let pawHomeWalk=null;
function pawHomeStop(){if(pawHomeWalk){cancelAnimationFrame(pawHomeWalk.frame);pawHomeWalk=null}}
function pawHomeStageBlocks(stage){
 const aspect=stage.clientWidth/Math.max(1,stage.clientHeight),catalogue=furnitureCatalogue(),blocks=[];
 for(const im of stage.querySelectorAll('.hideoutPlaced,.figureCabinetInRoom')){
  const id=im.dataset.furnitureId||(im.classList.contains('figureCabinetInRoom')?'displayCabinet':'');
  if(!id||im.hidden)continue;
  const kind=catalogue.find(v=>v[0]===id)?.[4],x=parseFloat(im.style.left),y=parseFloat(im.style.top),width=im.style.width.endsWith('%')?parseFloat(im.style.width):im.offsetWidth/Math.max(1,stage.clientWidth)*100;
  const b=pawHomeFootprint(x,y,width,kind,id,aspect);if(b)blocks.push(b)
 }
 return blocks
}
function pawHomeActorPosition(player,stage,point){
 player.style.left=point.x+'%';player.style.top=point.y+'%';player.style.right='auto';player.style.bottom='auto';
 player.style.zIndex=String(pawHomeLayer(point.y));
}
function pawHomeActorArt(player,direction,walking,distance){
 const kind=avatar??0,dir=direction==='left'?'right':direction;
 let src=ART['walker'+kind+(dir==='up'?1:dir==='down'?0:2)]||mbAvatarStanding(kind);
 if(walking&&!residentReducedMotion.matches){
  mbArtLoad();const frames=mbArtRegistry.players[kind]?.walk?.[dir];
  if(frames?.length){
   const frame=frames[Math.floor(distance/2.1)%frames.length],im=mbArtImage(frame);
   if(im?.complete&&im.naturalWidth)src=im.src
  }
 }
 if(src&&player.getAttribute('src')!==src)player.src=src;
 player.style.setProperty('--paw-home-facing',direction==='left'?'-1':'1')
}
function pawHomeMoveTo(stage,player,point,key,goal,announce,onArrival=null){
 pawHomeStop();
 const blocks=pawHomeStageBlocks(stage),route=pawHomeRoute(point,goal,blocks);
 if(!route?.length)return false;
 const motion={frame:0,at:0,distance:0,direction:'down',point};
 pawHomeWalk=motion;const reduced=residentReducedMotion.matches;
 function finish(){
  pawHomeActorPosition(player,stage,point);pawHomeActorArt(player,motion.direction,false,motion.distance);
  pawHomePositions.set(key,{...point});if(pawHomeWalk===motion)pawHomeWalk=null;
  if(announce)announce.textContent='';if(typeof onArrival==='function'&&stage.isConnected&&!hideoutEditing)onArrival()
 }
 if(reduced){motion.direction=pawHomeDirection(point,route.at(-1),stage.clientWidth/Math.max(1,stage.clientHeight));Object.assign(point,route.at(-1));finish();return true}
 function frame(now){
  if(pawHomeWalk!==motion||!stage.isConnected||hideoutEditing||$('page').style.display!=='block'||document.hidden){if(pawHomeWalk===motion)pawHomeStop();return}
  const next=route[0];if(!next){finish();return}
  const aspect=stage.clientWidth/Math.max(1,stage.clientHeight),dx=next.x-point.x,dy=next.y-point.y,d=Math.hypot(dx*aspect,dy);
  if(d<.12){Object.assign(point,next);route.shift()}
  else{
   const dt=motion.at?Math.min(.05,(now-motion.at)/1000):.016,move=Math.min(d,22*dt);
   motion.direction=pawHomeDirection(point,next,aspect);point.x+=dx*move/d;point.y+=dy*move/d;motion.distance+=move;
  }
  motion.at=now;pawHomePositions.set(key,{...point});pawHomeActorPosition(player,stage,point);pawHomeActorArt(player,motion.direction,true,motion.distance);
  motion.frame=requestAnimationFrame(frame)
 }
 motion.frame=requestAnimationFrame(frame);return true
}
const pawHomeWalkPageBefore=hideoutPage;
hideoutPage=function(...args){
 pawHomeStop();const result=pawHomeWalkPageBefore(...args),q=$('content'),stage=q.querySelector('.hideoutScene'),player=stage?.querySelector('.hideoutPlayer');
 if(hideoutEditing||!stage||!player)return result;
 const key=String(komorebiZone),blocks=pawHomeStageBlocks(stage);
 const style=getComputedStyle(player),fallback={x:pawHomePixelPercent(player.style.left,style.left,stage.clientWidth,67),y:pawHomePixelPercent(player.style.top,style.top,stage.clientHeight,92)};
 const previous=pawHomePositions.get(key)||fallback,point=pawHomeSafe(previous,blocks)?{...previous}:pawHomeNearest(previous,pawHomeGrid(blocks));
 if(!point){const note=element('small',tr('Move a little furniture to make room for walking.','挪一挪家具，就有地方走动啦。'),q,'pawHomeWalkHint');stage.after(note);return result}
 stage.dataset.pawWalkable='true';player.classList.add('pawHomeWalker');pawHomeActorPosition(player,stage,point);
 // Keep the existing furniture and item click handlers. Only an empty floor
 // tap moves the player, and no saved furniture record is changed.
 for(const im of stage.querySelectorAll('.hideoutPlaced,.figureCabinetInRoom')){
  const id=im.dataset.furnitureId,y=parseFloat(im.style.top);
  if(Number.isFinite(y))im.style.zIndex=String(pawHomeLayer(y,id==='rug'?'rug':y<65?'wall':'floor'))
 }
 const shelf=stage.querySelector('.hideoutPlaced[data-furniture-id="shelf"]'),shelfY=parseFloat(shelf?.style.top);
 for(const display of stage.querySelectorAll('.hideoutDisplay')){const y=Number.isFinite(shelfY)?shelfY:parseFloat(display.style.top);if(Number.isFinite(y))display.style.zIndex=String(21+Math.round(y*4))}
 const note=element('small',tr('Tap the floor to walk around.','点地板，走走自己的小窝。'),q,'pawHomeWalkHint');stage.after(note);
 note.setAttribute('role','status');note.setAttribute('aria-live','polite');
 stage.tabIndex=0;stage.setAttribute('aria-label',tr('My room. Tap the floor or use arrow keys to walk.','我的小窝。点击地板或使用方向键行走。'));
 stage.addEventListener('click',e=>{
  if(e.target.closest('.hideoutPlaced,.hideoutDisplay,.figureCabinetInRoom,.hideoutPlayer,button,[role=button]'))return;
  const r=stage.getBoundingClientRect(),goal={x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100};
  if(goal.y<pawHomeBounds.u||goal.y>pawHomeBounds.d+3)return;
  if(!pawHomeMoveTo(stage,player,point,key,goal,note))note.textContent=tr('A piece of furniture is in the way.','这边被家具挡住啦。')
 });
 for(const item of stage.querySelectorAll('.hideoutPlaced[role=button],.figureCabinetInRoom')){
  const old=item.onclick;if(typeof old!=='function')continue;
  item.onclick=function(...args){
   const anchor={x:parseFloat(item.style.left),y:parseFloat(item.style.top)};
   if(!Number.isFinite(anchor.x)||!Number.isFinite(anchor.y)||anchor.y<pawHomeBounds.u||Math.hypot(anchor.x-point.x,anchor.y-point.y)<13){pawHomeStop();return old.apply(this,args)}
   const goal=pawHomeObjectApproach(point,anchor,pawHomeStageBlocks(stage));
   if(!goal||!pawHomeMoveTo(stage,player,point,key,goal,note,()=>old.apply(item,args))){pawHomeStop();return old.apply(this,args)}
  }
 }
 stage.addEventListener('keydown',e=>{
  if(e.target!==stage)return;const dir={ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]}[e.key];if(!dir)return;e.preventDefault();e.stopPropagation();
  pawHomeMoveTo(stage,player,point,key,{x:Math.max(pawHomeBounds.l,Math.min(pawHomeBounds.r,point.x+dir[0])),y:Math.max(pawHomeBounds.u,Math.min(pawHomeBounds.d,point.y+dir[1]))},note)
 });
 return result
};
const pawHomeWalkStyle=document.createElement('style');pawHomeWalkStyle.textContent='#content .hideoutScene[data-paw-walkable=true]{cursor:default}#content .hideoutScene .pawHomeWalker{position:absolute!important;transform:translate(-50%,-100%) scaleX(var(--paw-home-facing,1))!important;transform-origin:50% 100%!important;animation:none!important;transition:none!important;filter:drop-shadow(0 2px 1px #342d2844);object-fit:contain!important}#content .pawHomeWalkHint{display:block;font-size:12px;color:#64543e;margin:5px 0 8px}#content .hideoutScene:focus-visible{outline:2px solid #6c805d;outline-offset:2px}';document.head.append(pawHomeWalkStyle);
/* Keep generic ambient remarks out of the active game's conversation path
   and provide a single optional quiet setting in the existing settings menu. */
let pawAmbientEnabled=load('pawAmbientEnabledV1',true)!==false;
const pawAmbientQuietBefore=pawAmbientBlocked;
pawAmbientBlocked=function(){return !pawAmbientEnabled||pawAmbientQuietBefore()};
const pawAmbientToggle=element('button','',townSettingsExtra);
function pawAmbientSetting(){pawAmbientToggle.textContent=pawAmbientEnabled?tr('Resident chatter on','居民闲聊：开'):tr('Resident chatter off','居民闲聊：关');pawAmbientToggle.setAttribute('aria-pressed',String(pawAmbientEnabled))}
pawAmbientToggle.onclick=()=>{pawAmbientEnabled=!pawAmbientEnabled;save('pawAmbientEnabledV1',pawAmbientEnabled);pawAmbientClear();pawAmbientSetting()};
const pawAmbientSettingsBefore=syncTownSettings;
syncTownSettings=function(...args){const result=pawAmbientSettingsBefore(...args);pawAmbientSetting();return result};
pawAmbientSetting();
/* PAW_DIALOGUE_VARIETY_BEGIN */
const pawAmbientTopics={
 'hong:bouquet':'flowers','exchange:flowers':'flowers','mei:letter':'postcards','souvenir:postcard':'postcards','exchange:postcard':'postcards',
 'hong:umbrella':'umbrella','exchange:umbrella':'umbrella','grandma:soup':'soup','exchange:soup':'soup',
 'garden:ribbon':'wish-ribbons','exchange:ribbon':'wish-ribbons','boba:blend':'tea-blend','exchange:tea':'tea-blend',
 'lin:cat':'park-cat','exchange:cat':'park-cat','wang:plant':'plant','exchange:plant':'plant'
};
function pawTopicFor(resident,id){return pawAmbientTopics[resident+':'+id]||resident+':'+id}
function pawTopicSeen(resident,id,history,now){
 const topic=pawTopicFor(resident,id);
 return history.some(v=>now-v[2]<86400000&&pawTopicFor(v[0],v[1])===topic)
}
function pawTopicCandidates(resident,lines,history,now){return lines.filter(v=>!pawTopicSeen(resident,v[0],history,now))}
/* PAW_DIALOGUE_VARIETY_END */
const pawTopicSoloBefore=pawAmbientPick;
pawAmbientPick=function(id,lines,history,now,rng=Math.random){return Array.isArray(lines)?pawTopicSoloBefore(id,pawTopicCandidates(id,lines,history,now),history,now,rng):null};
const pawTopicExchangeBefore=pawOverheardChoose;
pawOverheardChoose=function(actors,origin,history,now,rng=Math.random){
 const suppressed=pawOverheard.filter(e=>pawTopicSeen('exchange',e[0],history,now)).map(e=>['exchange',e[0],now]);
 return pawTopicExchangeBefore(actors,origin,[...history,...suppressed],now,rng)
};
// More ordinary life and resident-specific details, not repeated boss jokes.
const pawAdditionalRemarks={
 temple:[['moss','Moss is growing along the old stone lantern.','旧石灯笼边上长出了一层青苔。'],['sandals','A visitor left their sandals neatly by the steps.','有位香客把鞋子整整齐齐地摆在台阶旁。']],
 tarot:[['journal','I keep a notebook of questions I want to think about.','我有本笔记，专门记那些值得慢慢想的问题。'],['shuffle','These cards are much older than this table.','这副牌的年纪可比这张桌子大多了。']],
 yue:[['calendar','The new almanac smells of fresh paper.','新历书带着一股纸墨香。'],['window','The swallows have returned to the roof.','屋檐下的燕子又回来了。']],
 garden:[['bridge','The little bridge creaks, but it is still quite sturdy.','小桥踩上去吱呀响，其实结实得很。'],['seed','I planted seeds by the gate. Now we wait.','门边撒了些种子，接下来就等它们发芽啦。']],
 grandma:[['rice','I washed enough rice for an unexpected guest.','米多淘了一碗，万一有人来吃饭呢。'],['pickle','The pickles should be ready by the weekend.','这坛腌菜周末应该就能吃了。']],
 mei:[['music','I found an old record at the market.','在集市淘到一张旧唱片。'],['knitting','I made one sleeve longer than the other. Back to the beginning.','毛衣一只袖子织长了，又得拆了重来。']],
 hong:[['ticket','Someone framed a train ticket. Must have been quite a journey.','有人把车票裱起来了，那趟旅程一定不一般。'],['secret','The shopkeeper learned to bake. Nobody knows who taught him.','店主居然学会烤面包了，不知道师傅是谁。']],
 wang:[['socks','I wore mismatched socks today. Nobody noticed.','今天两只袜子不一样，竟然没人发现。'],['window','My favourite part of the train is that nobody expects a reply.','最喜欢坐火车的时候，不用立刻回任何人的消息。']],
 ahma:[['fan','This old fan has survived three summers and countless complaints.','这把蒲扇陪我过了三个夏天，听了无数牢骚。'],['knot','Some things cannot be untied in a day.','有些心结，一天解不开也正常。']],
 lin:[['bird','A little bird keeps visiting the fence at the same hour.','有只小鸟每天差不多这个时候来栅栏上站一会儿。'],['bench','The bench under the tree is my favourite place to read.','树下那张长椅是我最喜欢的看书地方。']],
 arcade:[['token','I found an old arcade token while cleaning the floor.','扫地时捡到一枚以前的游戏币。'],['machine','The cabinet is older than some of my regular customers.','这台游戏机比我有些熟客的年纪还大。']],
 boba:[['straw','I keep finding straws in my apron pockets.','围裙口袋里老是莫名其妙多出几根吸管。'],['tea-leaves','The new tea leaves have a lovely roasted fragrance.','新茶叶有股很好闻的烘焙香。']],
 souvenir:[['wrapping','I saved a lovely scrap of wrapping paper. It is too pretty to waste.','留了一小块包装纸，花纹太好看了，舍不得扔。'],['clock','The little clock in the shop runs five minutes slow.','店里那只小钟慢了五分钟。']],
 lab:[['margin','The notes in the margin are often more interesting than the answers.','有时候，页边的笔记比答案还更有意思。'],['books','I have been rearranging the bookshelf by colour.','最近在按颜色重新排书架。']],
 story:[['station','An old timetable gave me an idea for a story.','看见一张旧时刻表，突然有了写故事的灵感。'],['ending-two','I wrote two endings and liked neither.','写了两个结局，结果哪个都不满意。']],
 cafe:[['spoon','The smallest spoon always disappears first.','店里最小的那把勺子总是第一个不见。'],['music','I turned the music down. The rain sounds nicer.','把音乐调小了，雨声其实更好听。']]
};
for(const [id,entries] of Object.entries(pawAdditionalRemarks))pawAmbientLines[id]?.push(...entries);


/* PAW_LIVING_POLISH_BEGIN */
// Stable, authored story IDs and ordered episodes. Fictional town notices
// are not user posts and never depend on a public community service.
const pawTownStories=[
 {id:'lost-umbrella',title:['The blue umbrella','那把蓝伞'],episodes:[
  ['Station keeper','站长','A blue umbrella is waiting at the station. It has a little bird charm on its handle.','车站有把蓝伞等人认领，伞柄上挂着一只小鸟。'],
  ['Auntie Hong','红姐','Three people claimed it. None could describe the charm. I am becoming invested in this umbrella.','三个人来认领，都说不出挂件长什么样。我已经开始追这把伞的连续剧了。'],
  ['Wang Laoban','王老板','It was mine. The bird charm was a gift from my daughter. Thank you for looking after it.','是我的。小鸟是女儿送的，谢谢大家帮我保管。']
 ]},
 {id:'tea-room-record',title:['A tune for the tea room','茶馆里的老唱片'],episodes:[
  ['Auntie Mei','梅姨','I found a record at the market. Does anyone remember the tune on the faded label?','集市淘到一张旧唱片，标签褪色了，还有人记得这首曲子吗？'],
  ['Grandma','外婆','I recognise it. We used to hear it on the radio while making dinner.','这首我认得。以前做晚饭时，收音机里常放。'],
  ['Auntie Mei','梅姨','We played it over tea. Nobody hurried home. I think that is the best kind of afternoon.','今天喝茶时放了那首歌，谁也没急着走。这样的下午真好。']
 ]},
 {id:'little-pot',title:['A plant outgrows its home','花盆不够大啦'],episodes:[
  ['Wang Laoban','王老板','My office plant is leaning out of its pot. It appears to be resigning.','办公室的植物都长出花盆了，看样子是准备辞职。'],
  ['Auntie Lin','林姨','I have a clay pot you can use. Leave it by the window, not beside the air conditioner.','我有个陶盆可以给你，摆窗边吧，别再放空调旁了。'],
  ['Wang Laoban','王老板','The plant has moved into a larger home. Its work-life balance is now better than mine.','植物搬进大房子了，现在它的生活质量比我还好。']
 ]},
 {id:'postcard',title:['A postcard to nowhere','寄给自己的明信片'],episodes:[
  ['Souvenir keeper','手信店主','There is a postcard at the counter with no address. Just the words: see you again, someday.','柜台有张没写地址的明信片，只写着：有一天再见。'],
  ['Master Yue','月师傅','Perhaps the person it is meant for is the one who wrote it.','或许这张明信片，本来就是写给自己看的。'],
  ['Souvenir keeper','手信店主','The owner came back and addressed it to their future self. I found them an envelope.','主人回来，把收件人写成了未来的自己。我给他找了个信封。']
 ]},
 {id:'soup-table',title:['An extra bowl','多出来的一碗汤'],episodes:[
  ['Grandma','外婆','I made too much mushroom soup again. Bring a bowl if you are passing.','蘑菇汤又煮多了，路过的话带个碗来。'],
  ['Auntie Hong','红姐','Someone brought three bowls. Apparently the neighbours were also invited.','有人带了三个碗，原来连邻居也叫上了。'],
  ['Grandma','外婆','The pot is empty. Next time I will make even more.','锅见底啦。下次我再多煮一点。']
 ]}
];
function pawTownDayNumber(date){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
 const n=Date.parse(date+'T00:00:00Z');
 return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===date?Math.floor(n/86400000):null
}
function pawTownEpisode(day,first,stories=pawTownStories){
 const a=pawTownDayNumber(day),b=pawTownDayNumber(first);
 if(a===null||b===null||!stories.length)return null;
 const age=Math.max(0,a-b),index=Math.floor(age/3)%stories.length;
 const story=stories[index],episode=age%3;
 return {story,episode,total:story.episodes.length,entry:story.episodes[episode]}
}
function pawHomeLayer(y,kind='floor'){
 if(kind==='rug')return 1;if(kind==='wall')return 2;
 return Number.isFinite(y)?20+Math.round(y*4):20
}
function pawHomePixelPercent(inline,computed,size,fallback){
 if(typeof inline==='string'&&inline.trim().endsWith('%')&&Number.isFinite(parseFloat(inline)))return parseFloat(inline);
 const px=parseFloat(computed);return Number.isFinite(px)&&Number.isFinite(size)&&size>0?px/size*100:fallback
}
function pawSpeechAnchor(value,width){
 return Math.max(12,Math.min(Math.max(12,width-12),Number.isFinite(value)?value:width/2))
}
/* PAW_LIVING_POLISH_END */
const pawTownStoryKey='pawTownStoryStartV1';
function pawTownStoryToday(){
 const today=day(),stored=load(pawTownStoryKey,null);
 // A first visit starts the story, not the installation date of the game.
 let first=pawTownDayNumber(stored)!==null&&stored<=today?stored:today;
 if(first!==stored)save(pawTownStoryKey,first);
 return pawTownEpisode(today,first)
}
const pawStoryBoardBefore=townChatPage;
townChatPage=function(...args){
 const result=pawStoryBoardBefore(...args),q=$('content');
 if(communityTab!=='board'||!q.querySelector('.communityTabs'))return result;
 const current=pawTownStoryToday();if(!current)return result;
 const {story,episode,total,entry}=current;
 const note=element('article','',q,'pawTownStoryNote');
 element('small',tr('Resident stories · fictional town','居民小故事 · 虚构小镇'),note,'pawStoryKicker');
 element('h2',tr(...story.title),note);
 element('small',tr('Part ','第 ')+(episode+1)+' / '+total,note,'pawStoryPart');
 const voice=element('p','',note,'pawStoryVoice');element('strong',tr(entry[0],entry[1]),voice);
 element('span',tr(entry[2],entry[3]),voice);
 if(episode>0){
  const earlier=element('details','',note,'pawStoryEarlier');element('summary',tr('Earlier in this story','前情回顾'),earlier);
  for(const v of story.episodes.slice(0,episode)){
   const p=element('p','',earlier);element('strong',tr(v[0],v[1])+': ',p);element('span',tr(v[2],v[3]),p)
  }
 }
 q.querySelector('.communityTabs').after(note);
 return result
};
const pawStoryCss=document.createElement('style');
pawStoryCss.textContent='#content .pawTownStoryNote{position:relative;background:#f5e8cb;color:#4c4334;padding:16px 13px 12px;margin:13px 0 18px;border:1px solid #c3ab82;border-radius:1px;box-shadow:2px 4px 5px #60452d26;overflow-wrap:anywhere}#content .pawTownStoryNote:before{content:"";position:absolute;top:-5px;left:calc(50% - 4px);width:8px;height:8px;border-radius:50%;background:#8c654b;box-shadow:0 2px 2px #47332155}#content .pawTownStoryNote h2{font:600 clamp(19px,5vw,26px)/1.25 Georgia,"Songti SC",serif;color:#4f644e;margin:6px 0}#content .pawStoryKicker,#content .pawStoryPart{font-size:11px;color:#74644c}#content .pawStoryVoice strong,#content .pawStoryVoice span{display:block}#content .pawStoryVoice strong{font-size:13px;margin:0 0 4px;color:#52684e}#content .pawStoryVoice{font-size:15px;line-height:1.55}#content .pawStoryEarlier{border-top:1px dashed #baa17a;padding-top:3px}#content .pawStoryEarlier summary{min-height:44px;align-content:center;color:#51654e;cursor:pointer}#content .pawStoryEarlier p{font-size:13px;line-height:1.5}#game .pawAmbientSpeech{overflow:visible}#game .pawAmbientSpeech:after{content:"";position:absolute;left:var(--paw-tail-x,50%);width:9px;height:9px;transform:translateX(-50%) rotate(45deg);background:#fff3dc;border:solid #9b815c;border-width:0 1px 1px 0;bottom:-5px}#game .pawAmbientSpeech[data-above=false]:after{top:-5px;bottom:auto;transform:translateX(-50%) rotate(225deg)}';
document.head.append(pawStoryCss);
// Canonical active dock state follows the actual screen, not the destination
// on the town map. Preserve the four existing nav buttons and actions.
/* PAW_DOCK_ROOT_BEGIN */
function pawDockRootChoice(flags){
 if(!flags.open||flags.room||flags.activity||flags.talk||flags.transition||flags.entrance||flags.editing||flags.homeOrigin||flags.draft||flags.typing)return '';
 if(flags.explore)return 'travel';
 if(flags.today)return 'today';
 if(flags.town)return 'town';
 if(flags.home)return 'home';
 return ''
}
/* PAW_DOCK_ROOT_END */
let pawDockRootKey='';
function pawDockButtons(){return [['travel',$('dockTravel')],['today',$('dockScoop')],['town',pawTownDock],['home',mbHomeNav]]}
function pawSyncDockSelection(){
 const q=$('content'),open=$('page').style.display==='block';
 const explore=!!q.querySelector('.pawSketchbook'),today=!!q.querySelector('.pawDiaryFold'),town=!!q.querySelector('.communityTabs')&&communityTab==='board',home=!!q.querySelector('.hideoutScene,.hideoutRoomView');
 // A root can switch tabs; nested pages retain their contextual Back.
 // Never abandon a draft, active keyboard, furniture edit or room visit.
 const fields=open?[...q.querySelectorAll('textarea,input:not([type]),input[type="text"],input[type="search"],[contenteditable="true"]')].filter(n=>!n.disabled&&!n.hidden):[];
 const draft=fields.some(n=>String(n.value??n.textContent??'').trim()!==''),typing=fields.includes(document.activeElement);
 pawDockRootKey=pawDockRootChoice({open,room:!!room,activity:!!activity,talk:talkOpen,transition:transitioning,entrance:!proposal.hidden,editing:!!hideoutEditing,homeOrigin:home&&!!mbHomeOrigin,draft,typing,explore,today,town,home});
 const selected=!open?'':explore||q.querySelector('.travelAlbum')?'travel':home||q.querySelector('.travellerBagV2,.komorebiBook,.komorebiConfirm,.figureCabinetBook,.pawPersonalShelf')?'home':q.querySelector('.communityTabs,.townWall,.townChatTranscript')?'town':today||q.querySelector('.journalDailyTasks,.goodCompanyBook')?'today':'';
 $('game').classList.toggle('pawDockRoot',!!pawDockRootKey);
 for(const [key,button] of pawDockButtons()){
  button.classList.toggle('pawDockSelected',selected===key);
  if(selected===key)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')
 }
}
const pawDockSyncBefore=updateHUD;
updateHUD=function(...args){const result=pawDockSyncBefore(...args);pawSyncDockSelection();return result};
const pawDockPageBefore=page;
page=function(...args){const result=pawDockPageBefore(...args);queueMicrotask(pawSyncDockSelection);return result};
const pawDockObserver=new MutationObserver(pawSyncDockSelection);pawDockObserver.observe($('page'),{attributes:true,attributeFilter:['style','hidden']});
const pawDockStateCss=document.createElement('style');pawDockStateCss.textContent='#game #dock>button.pawDockSelected{background:#d7d7b6!important;color:#36533f!important;border-color:#839274!important;box-shadow:inset 0 -2px 0 #829374!important}#game #dock>button:focus-visible{outline:2px solid #547056;outline-offset:1px}';
document.head.append(pawDockStateCss);
$('dock').setAttribute('aria-label',tr('Game navigation','小镇导航'));
for(const [key,button] of pawDockButtons()){
 const previous=button.onclick;
 button.onclick=function(event){
  if($('page').style.display==='block'){
   pawSyncDockSelection();
   if(!pawDockRootKey||pawDockRootKey===key)return;
  }
  const result=previous?.call(this,event);
  queueMicrotask(pawSyncDockSelection);
  return result
 };
}
$('content').addEventListener('input',pawSyncDockSelection);
$('content').addEventListener('focusin',pawSyncDockSelection);
$('content').addEventListener('focusout',()=>queueMicrotask(pawSyncDockSelection));
const pawDockRootObserve=new MutationObserver(()=>pawSyncDockSelection());
pawDockRootObserve.observe($('content'),{childList:true});
const pawDockRootHUD=updateHUD;
updateHUD=function(...args){
 const result=pawDockRootHUD(...args);
 const label=tr('Town Hall','小镇广场');pawTownDock.lastElementChild.textContent=label;pawTownDock.setAttribute('aria-label',label);
 $('dock').setAttribute('aria-label',tr('Game navigation','小镇导航'));
 return result
};
const pawDockRootStyle=document.createElement('style');
pawDockRootStyle.textContent=`
#game.pawDockRoot.pawFocusedView:not(.pawInRoom):not(.pawRailJourneyActive) #dock:not([hidden]){display:flex!important;z-index:7!important}
#game.pawDockRoot #page{padding-bottom:calc(max(8px,env(safe-area-inset-bottom,0px)) + 84px)!important;scroll-padding-bottom:calc(max(8px,env(safe-area-inset-bottom,0px)) + 84px)!important}
#game #dock>button:not([hidden]){border:1px solid transparent!important;border-radius:5px!important;box-shadow:none}
#game #dock>button.pawDockSelected{border-color:#839274!important;box-shadow:inset 0 -2px 0 #829374!important}
#game #dock>button:not([hidden])>span:last-child{font-size:clamp(10px,2.9vw,13px)!important;white-space:normal!important;text-align:center}
#game #dock{border-radius:8px!important}
`;document.head.append(pawDockRootStyle);

// Keyboard journal traversal moves focus to the selected tab after a rebuild.
const pawJournalKeysBefore=pawJournalRender;
pawJournalRender=function(district=scene){
 const result=pawJournalKeysBefore(district),nav=$('content').querySelector('.pawSketchTabs');
 if(!nav)return result;
 nav.addEventListener('keydown',e=>{
  const key=e.target?.dataset?.district,index=pawJournalKeys.indexOf(key);
  if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();
  const next=e.key==='Home'?0:e.key==='End'?pawJournalKeys.length-1:Math.max(0,Math.min(pawJournalKeys.length-1,index+(e.key==='ArrowLeft'?-1:1)));
  pawJournalRender(pawJournalKeys[next]);$('content').querySelector('.pawSketchTabs button[data-district="'+pawJournalKeys[next]+'"]')?.focus({preventScroll:true})
 });
 return result
};
// Keep interaction text tied to its actual scene. The existing scenery
// remains shared, pending original route-specific painted landscapes.
const pawRailRouteNotes={
 fortune:['Into the hills','开往山间'],home:['Towards the tea room district','开往茶香小镇'],island:['Towards the food and fun district','开往吃喝玩乐街'],wonder:['Towards the discovery district','开往奇遇驿站']
};
const pawRailContextBefore=mbTransferHolding;
mbTransferHolding=function(from,to){
 const result=pawRailContextBefore(from,to),overlay=$('game').querySelector('.pawRailJourney');
 if(overlay){
  overlay.dataset.from=from;overlay.dataset.to=to;
  const caption=overlay.querySelector('.pawRailCaption span');if(caption)caption.textContent=tr(...(pawRailRouteNotes[to]||['Pawradise railway','Pawradise 铁路']));
  const skip=overlay.querySelector('.pawRailSkip');if(skip)skip.setAttribute('aria-label',tr('Skip ride and arrive','跳过旅程，直接抵达'))
 }
 return result
};
// Route/story dates and progress remain local, and new interfaces use only
// existing visual primitives. No account, purchase or reward changes.


/* PAW_ENTRANCE_LAYOUT_REPAIR: separate ticket, character and journey stages.
   Old procedural coach and walking controls must never cover the ticket or
   character selector. Preserve the original name/avatar/persona save flow. */
const pawEntranceLayoutBefore=proRender;
proRender=function(...args){
 const result=pawEntranceLayoutBefore(...args),hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer');
 proposal.querySelectorAll('.rail-platform-coach').forEach(n=>n.remove());
 proposal.dataset.pawEntranceStep=String(proStep);
 if(!hero||!foot)return result;
 if(proStep===4){
  foot.hidden=true;
  const ticket=hero.querySelector('.rail-ticket');
  if(ticket){
   ticket.setAttribute('aria-label',tr('Pawradise railway ticket','Pawradise 铁路车票'));
   const input=ticket.querySelector('input');if(input){input.setAttribute('aria-label',tr('Passenger signature','旅客签名'));input.enterKeyHint='go';input.autocomplete='nickname'}
  }
 }
 if(proStep===1||proStep===2){
  hero.querySelectorAll('.platform-ui,.shadow').forEach(n=>n.remove());
  const player=hero.querySelector('.platform-player,.traveller');
  if(player){
   player.classList.add('pawEntranceAvatar');player.classList.remove('walking');
   player.removeAttribute('style');player.src=ART['walker'+proAvatar+(proStep===1?proDir:0)];
   player.alt=tr(...names[proAvatar]);
  }
  const title=foot.querySelector('h1');
  if(proStep===1){
   const choice=element('p',tr('Choose your traveller','选择你的旅人'),foot,'pawAvatarKicker');
   if(title)title.before(choice);
   const row=foot.querySelector('.actions');
   if(row){
    const turn=[...row.querySelectorAll('button')].find(n=>n.textContent===tr('Turn around','转身'));
    const gallery=element('div','',foot,'pawAvatarGallery');gallery.setAttribute('role','group');gallery.setAttribute('aria-label',tr('Four travellers','四位旅人'));
    for(let i=0;i<4;i++){
     const btn=element('button','',gallery,'pawAvatarOption');btn.type='button';btn.dataset.avatar=String(i);btn.setAttribute('aria-pressed',String(i===proAvatar));btn.setAttribute('aria-label',tr(...names[i]));
     const im=element('img','',btn);im.alt='';im.src=ART['walker'+i+'0'];
     const label=element('span',tr(...names[i]),btn);
     btn.onclick=()=>{if(proBusy)return;proAvatar=i;proDir=0;proRender();proposal.querySelector('.pawAvatarOption[data-avatar="'+i+'"]')?.focus({preventScroll:true})};
    }
    row.before(gallery);
    row.replaceChildren();if(turn)row.append(turn);row.classList.add('pawAvatarTurn');
   }
   const next=foot.querySelector('button.next');if(next)next.textContent=tr('This is me','就选这个旅人');
  }else{
   const name=element('p',tr(...names[proAvatar]),foot,'pawAvatarKicker');if(title)title.before(name);
   foot.querySelector('.actions')?.classList.add('pawPersonaChoices');
  }
 }
 return result
};
const pawEntranceLayoutCss=document.createElement('style');
pawEntranceLayoutCss.textContent=
 '#proposal .rail-platform-coach{display:none!important}'+
 '#proposal:not([hidden]){box-sizing:border-box;max-width:100vw;padding:max(10px,env(safe-area-inset-top,0px)) max(12px,env(safe-area-inset-right,0px)) max(10px,env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))!important}'+
 '#proposal>header{position:relative;z-index:5;min-width:0;gap:8px;align-items:center;grid-column:1/-1}'+
 '#proposal>header>span{min-width:0;line-height:1.4;overflow-wrap:anywhere}#proposal>header .languageChoice{flex-shrink:0}'+
 '#proposal:is([data-paw-entrance-step="4"],[data-paw-entrance-step="1"],[data-paw-entrance-step="2"]):not([hidden]){display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px;overflow-y:auto!important;overflow-x:hidden!important;background:radial-gradient(ellipse at 50% 40%,#52684d 0%,#304b3d 48%,#20352c 100%)!important}'+
 '#proposal:is([data-paw-entrance-step="4"],[data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.cinema-world,#proposal:is([data-paw-entrance-step="4"],[data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.speck{display:none!important}'+
 '#proposal[data-paw-entrance-step="4"]:not([hidden]){grid-template-rows:auto minmax(min-content,1fr)!important}'+
 '#proposal[data-paw-entrance-step="4"]:after,#proposal[data-paw-entrance-step="4"]>footer{display:none!important}'+
 '#proposal[data-paw-entrance-step="4"]>.hero{display:grid!important;place-items:center;min-height:0!important;height:auto!important;width:100%;padding:8px 0 16px;box-sizing:border-box;overflow:visible!important;animation:none!important}'+
 '#proposal[data-paw-entrance-step="4"] .rail-ticket{width:min(100%,440px)!important;max-width:100%;min-width:0;box-sizing:border-box;position:relative;z-index:4;margin:0;transform:none!important;translate:none!important;animation:none!important;clip-path:none!important;background:linear-gradient(110deg,#f6e9c9,#ead8ac);padding:clamp(16px,4vw,28px)!important;gap:clamp(10px,2vh,17px)!important;box-shadow:0 10px 32px #172c23a0,inset 0 0 0 5px #f8edcf,inset 0 0 0 6px #b9a077;border:1px solid #bda47a;color:#4d4535}'+
 '#proposal[data-paw-entrance-step="4"] .rail-ticket .route{font-size:clamp(24px,5vw,35px);overflow-wrap:anywhere;line-height:1.16}'+
 '#proposal[data-paw-entrance-step="4"] .rail-ticket label{min-width:0;gap:6px}'+
 '#proposal[data-paw-entrance-step="4"] .rail-ticket input{box-sizing:border-box;width:100%;max-width:100%;min-width:0;font-size:18px!important;min-height:48px}'+
 '#proposal[data-paw-entrance-step="4"] .ticket-stub{gap:12px;line-height:1.35;min-width:0}#proposal[data-paw-entrance-step="4"] .stampmark{flex:none;font-size:11px}'+
 '#proposal[data-paw-entrance-step="4"] .ticket-confirm{display:block;width:100%;min-height:48px!important;box-sizing:border-box;position:relative;z-index:5;color:#f9efd6;background:#4c644f;border:1px solid #3e5945;border-radius:3px;font-weight:600}'+
 '#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"]):not([hidden]){grid-template-rows:auto minmax(170px,1fr) auto!important}'+
 '#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.hero{position:relative!important;min-width:0;min-height:170px!important;max-height:100%;height:auto!important;width:100%;display:grid!important;place-items:center;overflow:hidden!important;isolation:isolate;animation:none!important}'+
 '#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.hero:before{content:"";position:absolute;z-index:-1;inset:5% 7% 0;background:radial-gradient(ellipse at 50% 90%,#d7c09243,transparent 56%);pointer-events:none}'+
 '#proposal .pawEntranceAvatar{position:relative!important;left:auto!important;bottom:auto!important;top:auto!important;right:auto!important;transform:none!important;translate:none!important;scale:1!important;max-width:92%;width:auto!important;height:min(100%,450px)!important;max-height:100%!important;min-height:0;object-fit:contain!important;object-position:center bottom!important;align-self:end;filter:drop-shadow(0 6px 5px #172d2466)!important;animation:none!important;transition:none!important}'+
 '#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>footer{position:relative;z-index:4;align-self:center;width:min(100%,480px);max-width:480px!important;box-sizing:border-box;gap:7px!important;padding:6px 0 3px!important;overflow:visible!important;animation:none!important;background:none!important}'+
 '#proposal .pawAvatarKicker{color:#e6d2a7;font:13px/1.3 Georgia,"Songti SC",serif!important;letter-spacing:.05em}'+
 '#proposal[data-paw-entrance-step="1"] footer h1,#proposal[data-paw-entrance-step="2"] footer h1{font-size:clamp(23px,5vw,34px)!important;line-height:1.2;overflow-wrap:anywhere}'+
 '#proposal .pawAvatarGallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:100%;padding:7px 3px 5px;box-sizing:border-box;background:#263e34;border-bottom:2px solid #ba9c70}'+
 '#proposal .pawAvatarOption{display:grid;grid-template-rows:minmax(0,1fr) auto;justify-items:center;align-items:end;gap:4px;min-width:0;min-height:84px!important;height:clamp(84px,14dvh,126px);padding:5px 2px!important;border:1px solid #73856b;border-radius:3px!important;background:#344c40!important;color:#f7e7c5!important;box-sizing:border-box}'+
 '#proposal .pawAvatarOption[aria-pressed=true]{border:2px solid #ebcd8d!important;background:#596b50!important;box-shadow:inset 0 0 0 1px #ad9667!important}'+
 '#proposal .pawAvatarOption img{width:100%;height:100%;min-height:0;object-fit:contain;object-position:center bottom;pointer-events:none}'+
 '#proposal .pawAvatarOption span{font:11px/1.2 system-ui,sans-serif;white-space:normal;overflow-wrap:anywhere;max-width:100%;pointer-events:none}'+
 '#proposal .pawAvatarTurn button{min-height:44px!important;flex:0 1 160px!important;font-size:14px!important}'+
 '#proposal .pawPersonaChoices{display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important}#proposal .pawPersonaChoices button{min-width:0;min-height:48px!important;overflow-wrap:anywhere}'+
 '#proposal :is(.pawAvatarOption,.ticket-confirm,input):focus-visible{outline:2px solid #e8c88b;outline-offset:2px}'+
 '#proposal[data-shot=station] .rail-platform-sign{top:8%;max-width:94%;white-space:normal;text-align:center}'+
 '@media(min-width:850px) and (min-height:480px),(orientation:landscape) and (max-height:479px){#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"]):not([hidden]){grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)!important;grid-template-rows:auto minmax(250px,1fr)!important;column-gap:clamp(12px,4vw,65px);padding-inline:clamp(16px,6vw,100px)!important}#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.hero{height:100%!important;min-height:250px!important;align-self:center}#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>footer{justify-self:start;align-self:center}#proposal .pawEntranceAvatar{height:min(90%,540px)!important;align-self:center}}'+
 '@media(max-height:520px){#proposal[data-paw-entrance-step="4"]>.hero{padding:2px 0 8px}#proposal[data-paw-entrance-step="4"] .rail-ticket{padding:12px 16px!important;gap:7px!important}#proposal[data-paw-entrance-step="4"] .rail-ticket .route{font-size:23px}#proposal[data-paw-entrance-step="4"] .rail-brand{padding-bottom:4px}#proposal[data-paw-entrance-step="4"] .ticket-stub{padding-top:5px}#proposal[data-paw-entrance-step="4"] .rail-ticket input,#proposal[data-paw-entrance-step="4"] .ticket-confirm{min-height:44px!important}#proposal .pawAvatarOption{height:84px}}'+
 '@media(prefers-reduced-motion:reduce){#proposal *{animation:none!important;transition:none!important}}';
document.head.append(pawEntranceLayoutCss);


/* PAW_ENTRANCE_ART_FIT_BEGIN */
function pawAvatarCropBounds(data,w,h){
 if(!data||data.length!==w*h*4||w<2||h<2)return null;
 const rows=new Uint32Array(h),cols=new Uint32Array(w);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>=72){rows[y]++;cols[x]++}
 const rowMin=Math.max(2,Math.ceil(w*.008)),colMin=Math.max(2,Math.ceil(h*.008));
 let l=w,r=-1,u=h,d=-1;
 for(let y=0;y<h;y++)if(rows[y]>=rowMin){u=Math.min(u,y);d=y}
 for(let x=0;x<w;x++)if(cols[x]>=colMin){l=Math.min(l,x);r=x}
 if(r-l<2||d-u<2)return null;
 const pad=Math.max(2,Math.ceil((d-u)*.035));
 l=Math.max(0,l-pad);u=Math.max(0,u-pad);r=Math.min(w,r+1+pad);d=Math.min(h,d+1+pad);
 return {x:l,y:u,w:r-l,h:d-u}
}
function pawAvatarArtSize(width,height,role){
 if(![width,height].every(v=>Number.isFinite(v)&&v>0))return 0;
 if(role==='option')return width<480?Math.max(48,Math.min(74,height*.12)):Math.max(72,Math.min(116,height*.14));
 if(width>=850)return Math.max(180,Math.min(520,height*.59));
 return Math.max(115,Math.min(340,height*.36))
}
/* PAW_ENTRANCE_ART_FIT_END */
const pawAvatarCropCache=new Map();
function pawCropEntranceImage(im){
 if(!im||!im.src)return;
 const original=im.getAttribute('src');
 if(!original||im.dataset.pawCropSource===original)return;
 im.dataset.pawCropSource=original;
 const apply=src=>{
  if(im.isConnected&&im.getAttribute('src')===original&&src){im.src=src;im.dataset.pawArtReady='true'}
 };
 if(!pawAvatarCropCache.has(original)){
  const ready=new Promise(resolve=>{
   const src=new Image();
   src.onload=()=>{
    try{
     const w=src.naturalWidth,h=src.naturalHeight,work=document.createElement('canvas');work.width=w;work.height=h;
     const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);
     const b=pawAvatarCropBounds(ctx.getImageData(0,0,w,h).data,w,h);
     if(!b||b.w===w&&b.h===h){resolve(original);return}
     const out=document.createElement('canvas');out.width=b.w;out.height=b.h;
     out.getContext('2d').drawImage(src,b.x,b.y,b.w,b.h,0,0,b.w,b.h);
     resolve(out.toDataURL('image/png'))
    }catch{resolve(original)}
   };
   src.onerror=()=>resolve(original);src.src=original;
  });
  pawAvatarCropCache.set(original,ready);
 }
 pawAvatarCropCache.get(original).then(apply)
}
function pawEntranceResize(){
 if(proposal.hidden)return;
 const w=proposal.clientWidth||innerWidth,h=proposal.clientHeight||innerHeight;
 proposal.style.setProperty('--paw-avatar-main',pawAvatarArtSize(w,h,'main')+'px');
 proposal.style.setProperty('--paw-avatar-thumb',pawAvatarArtSize(w,h,'option')+'px')
}
window.addEventListener('resize',pawEntranceResize,{passive:true});
const pawEntranceArtBefore=proRender;
proRender=function(...args){
 const result=pawEntranceArtBefore(...args),hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer');
 if(!hero||!foot)return result;
 pawEntranceResize();
 if(proStep===0){
  // Recovered matching native station paintings. Keep the train interior
  // for the actual ride; this scene is the station before boarding.
  hero.querySelector('.rail-platform-sign')?.remove();
  const preview=element('picture','',hero,'pawFirstRailPainting');
  const wide=element('source','',preview);wide.media=pawWideArtworkMedia;wide.srcset='assets/visual/painted/recovered/scenes/station_landscape.webp';
  const art=element('img','',preview);art.src='assets/visual/painted/recovered/scenes/station_portrait.webp';art.alt=tr('A nostalgic railway station, with a train waiting at the platform','怀旧火车站，列车正在站台等候');
  art.onerror=()=>{art.onerror=null;wide.srcset='assets/visual/painted/journey/landscape.webp';art.src='assets/visual/painted/journey/portrait.webp'};
  const heading=foot.querySelector('h1');if(heading){const tag=element('p',tr('Pawradise railway','Pawradise 铁路'),foot,'pawFirstRailLabel');heading.before(tag)}
 }
 if(proStep===1||proStep===2){
  const player=hero.querySelector('.pawEntranceAvatar');if(player)pawCropEntranceImage(player);
  for(const button of foot.querySelectorAll('.pawAvatarOption')){
   const im=button.querySelector('img'),name=button.querySelector('span');
   if(im&&name){button.replaceChildren(im,name);pawCropEntranceImage(im)}
  }
  if(proStep===1){
   const back=element('button',tr('‹ Ticket','‹ 车票'),foot,'pawEntranceBack');back.type='button';back.onclick=()=>{if(proBusy)return;proStep=4;proRender()};
   const turn=foot.querySelector('.pawAvatarTurn button');if(turn)turn.setAttribute('aria-label',tr('Turn around','转身'));
  }else{
   const back=element('button',tr('‹ Change traveller','‹ 更换旅人'),foot,'pawEntranceBack');back.type='button';back.onclick=()=>{if(proBusy)return;proStep=1;proDir=0;proRender()};
  }
 }
 return result
};
const pawEntranceFitStyle=document.createElement('style');
pawEntranceFitStyle.textContent=
 '#proposal[data-paw-entrance-step="0"]>.cinema-world,#proposal[data-paw-entrance-step="0"]>.speck{display:none!important}'+
 '#proposal[data-paw-entrance-step="0"]:not([hidden]){display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(170px,1fr) auto!important;gap:12px;background:radial-gradient(ellipse at 50% 40%,#52684d,#20352c 80%)!important;overflow:auto!important}'+
 '#proposal[data-paw-entrance-step="0"]>.hero{display:grid!important;place-items:center;min-height:170px!important;overflow:hidden!important;width:100%;height:100%!important}'+
 '#proposal .pawFirstRailPainting{display:block;height:100%;max-height:650px;width:100%;min-height:0;min-width:0;overflow:hidden}'+
 '#proposal .pawFirstRailPainting img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;max-width:100%;max-height:100%}'+
 '#proposal .pawFirstRailLabel{color:#e9d2a2;font:13px/1.3 Georgia,"Songti SC",serif!important;letter-spacing:.1em}'+
 '#proposal[data-paw-entrance-step="0"]>footer{max-width:460px!important;min-width:0;padding:6px 0 12px!important;gap:8px!important}'+
 '#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.hero{min-height:var(--paw-avatar-main,180px)!important;align-content:center!important}'+
 '#proposal .pawEntranceAvatar{display:block!important;width:auto!important;max-width:90%!important;height:var(--paw-avatar-main,180px)!important;max-height:var(--paw-avatar-main,180px)!important;align-self:center!important;justify-self:center!important;object-fit:contain!important;object-position:center!important}'+
 '#proposal .pawAvatarGallery{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;padding:4px!important;background:none!important;border-bottom:0!important}'+
 '#proposal .pawAvatarOption{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;gap:5px!important;height:auto!important;min-height:0!important;padding:8px 3px!important;border:1px solid #b69c70!important;background:#ead9b5!important;color:#3e4c3b!important;border-radius:3px!important;box-shadow:0 2px 4px #172d2444!important}'+
 '#proposal .pawAvatarOption[aria-pressed=true]{background:#fff0cc!important;border:2px solid #f0cd86!important;box-shadow:0 0 0 2px #a58a59!important}'+
 '#proposal .pawAvatarOption img{display:block!important;width:100%!important;height:var(--paw-avatar-thumb,64px)!important;min-height:var(--paw-avatar-thumb,64px)!important;max-height:var(--paw-avatar-thumb,64px)!important;object-fit:contain!important;object-position:center bottom!important;flex:none!important}'+
 '#proposal .pawAvatarOption span{display:block!important;color:#384d3c!important;font:600 11px/1.25 system-ui,sans-serif!important;text-align:center!important;min-height:2.5em;align-content:center;max-width:100%;overflow-wrap:anywhere!important}'+
 '#proposal .pawEntranceBack{justify-self:center!important;width:max-content!important;max-width:100%;min-height:44px!important;padding:6px 12px!important;background:transparent!important;color:#f1ddad!important;border:0!important;box-shadow:none!important;text-decoration:underline;text-underline-offset:3px;font:13px system-ui,sans-serif!important}'+
 '#proposal .pawAvatarTurn button{background:#3d5346!important;color:#fff1d0!important;border:1px solid #a99570!important}'+
 '#proposal .pawPersonaChoices button{background:#ead9b5!important;color:#394c3b!important;font-weight:600!important}'+
 '@media(min-width:850px) and (min-height:480px){#proposal[data-paw-entrance-step="0"]:not([hidden]){grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)!important;grid-template-rows:auto minmax(240px,1fr)!important;gap:20px;padding-inline:clamp(16px,5vw,90px)!important}#proposal[data-paw-entrance-step="0"]>footer{align-self:center;justify-self:start}#proposal .pawAvatarGallery{gap:8px!important}#proposal .pawAvatarOption span{font-size:13px!important}}'+
 '@media(max-height:660px) and (orientation:portrait){#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>footer{gap:4px!important}#proposal .pawAvatarOption{padding:5px 2px!important}#proposal .pawAvatarKicker{font-size:12px!important}}'+
 '@media(max-width:370px){#proposal .pawAvatarGallery{gap:4px!important;padding:2px!important}#proposal .pawAvatarOption span{font-size:10px!important}}';
document.head.append(pawEntranceFitStyle);
/* Desktop has keyboard movement, not a touch joystick. Avoid putting the
   introductory guide directly over the avatar on the central playable path. */
const pawGuideCopyBefore=movementUI;
movementUI=function(...args){
 const result=pawGuideCopyBefore(...args);
 if(!moveGuide.hidden&&guideStage===0){
  const touch='ontouchstart' in window||navigator.maxTouchPoints>0;
  moveCopy.textContent=touch?tr('Tap the glowing spot or use the joystick to walk.','点击光圈或使用摇杆行走。'):tr('Click the path or use arrow keys to walk.','点击小路或使用方向键行走。')
 }
 return result
};
const pawDesktopGuideStyle=document.createElement('style');
pawDesktopGuideStyle.textContent=
 '#game #dock:not([hidden]){bottom:max(8px,env(safe-area-inset-bottom,0px))!important;max-width:calc(100% - 16px)!important;box-sizing:border-box!important}'+
 '#game #dock>button:not([hidden]){min-height:50px!important;height:auto!important;gap:2px!important}'+
 '#game #dock>button:not([hidden])>span:last-child{display:block!important;line-height:1.15!important;max-width:100%;overflow-wrap:anywhere}'+
 '@media(min-width:1100px) and (min-aspect-ratio:3/2){#moveGuide:not([hidden]){left:14px!important;right:auto!important;bottom:24px!important;top:auto!important;transform:none!important;width:min(22vw,290px)!important;max-width:290px!important;font-size:13px!important}}';
document.head.append(pawDesktopGuideStyle);


/* Owner feedback: keep the temple keeper inside, not in the arrival street. */
const pawKeeperInitBefore=initNPC;
initNPC=function(...args){const result=pawKeeperInitBefore(...args);if(scene==='fortune')for(let i=npc.length-1;i>=0;i--)if(npc[i].n?.some(v=>v==='Temple keeper'||v==='庙祝'))npc.splice(i,1);return result};
function pawFocusView(){const open=$('page').style.display==='block';if(!open||room||activity||talkOpen||transitioning||!proposal.hidden){if(pawDockRootKey){pawDockRootKey='';$('game').classList.remove('pawDockRoot')}}$('game').classList.toggle('pawInRoom',!!room||!!activity);$('game').classList.toggle('pawFocusedView',!!room||!!activity||open||talkOpen||transitioning||!proposal.hidden);$('game').classList.toggle('pawExitView',!!room&&!activity&&!open&&!talkOpen&&!transitioning&&proposal.hidden)}
const pawFocusBefore=loop;
loop=function(...args){const result=pawFocusBefore(...args);pawFocusView();return result};
const pawFocusHUD=updateHUD;
updateHUD=function(...args){const result=pawFocusHUD(...args);pawFocusView();if(room&&!activity&&!$('back').hidden)$('back').textContent=tr('Step outside','走出门口');return result};
const pawPreloadDoor=walkDoor;
walkDoor=function(id,...args){
 try{
  mbArtLoad();
  const wide=pawArtworkOrientation(W,H)==='landscape';
  const ready=mbArtImage(pawArtworkRecord(mbArtRegistry.rooms[id],W,H));
  const preferred=ready||(wide?landscapeRoomImage(id):portraitInteriorImage(id));
  preferred?.decode?.().catch(()=>{});
 }catch{}
 return pawPreloadDoor(id,...args)
};
const pawMaterialSound=sound;
sound=function(f=420){if(activity==='moon'){if(!muted&&!document.hidden)physicalFx('wood',.72);return}if(activity==='sticks'){if(!muted&&!document.hidden)physicalFx('shake',.42);return}if(activity==='prayer'){if(!muted&&!document.hidden)physicalFx('paper',.28);return}return pawMaterialSound(f)};
const pawJoySeeds=[
 [['Auntie Mei','梅姨'],['My neighbour saved me the last red bean bun. We ate it together by the window.','邻居给我留了最后一个红豆包，我们坐在窗边一起吃。']],
 [['Grandma','外婆'],['Someone asked for my soup recipe today. Little things can be passed down.','今天有人问我汤的做法，原来这些小小的事情也能传下去。']],
 [['Wang Laoban','王老板'],['I took the long way home and noticed the sunset for the first time in weeks.','今天绕了点路回家，终于看了一次好久没留意的晚霞。']],
 [['Auntie Lin','林姨'],['The little cat that used to hide from me came to sit beside me today.','以前总躲着我的小猫，今天主动坐到了我旁边。']],
 [['Master Yue','月师傅'],['An old friend called just to ask how I was doing. No other reason.','老朋友打来电话，只是问问我最近过得怎样，没有别的事。']]
];
const pawJoyKey='pawLittleJoysLocalV1';
function pawJoyRead(){const v=load(pawJoyKey,[]);return Array.isArray(v)?v.filter(n=>n&&typeof n.text==='string'&&n.text.trim()&&typeof n.day==='string').slice(-30):[]}
const pawJoyPageBefore=townChatPage;
townChatPage=function(...args){
 if(communityTab!=='gratitude')return pawJoyPageBefore(...args);
 ++communityView;++townChatGeneration;
 page(tr('Town Hall','小镇广场'),tr('Little Joys','小确幸墙'),q=>{
  communityTabs(q);const wall=element('section','',q,'pawJoyWall');
  element('h2',tr('A little good in today','今天的一点小美好'),wall);
  element('p',tr('Leave something you are thankful for. No achievement is too small.','写下一件值得感恩的小事，再小也值得记住。'),wall);
  const form=element('form','',wall,'pawJoyForm'),input=element('textarea','',form);input.maxLength=240;input.required=true;input.rows=3;input.placeholder=tr('Today I am grateful for…','今天我很感恩……');input.setAttribute('aria-label',input.placeholder);
  const post=element('button',tr('Pin a private note','贴上私人便签'),form);post.type='submit';
  const status=element('small',tr('Your notes stay on this device. Resident examples are fictional.','便签仅保存在本设备。居民留言为虚构示例。'),form);status.setAttribute('role','status');
  const notes=element('div','',wall,'pawJoyNotes');
  function render(){notes.replaceChildren();for(const n of pawJoyRead().slice().reverse()){const a=element('article','',notes,'pawJoyNote');element('strong',tr('My note','我的便签'),a);element('small',n.day,a);element('p',n.text,a)}for(const [name,copy] of pawJoySeeds){const a=element('article','',notes,'pawJoyNote');element('strong',tr(...name),a);element('small',tr('Fictional resident','虚构居民'),a);element('p',tr(...copy),a)}}
  form.onsubmit=e=>{e.preventDefault();const value=input.value.trim().slice(0,240);if(!value)return;save(pawJoyKey,[...pawJoyRead(),{day:day(),text:value}].slice(-30));input.value='';render();status.textContent=tr('Pinned privately.','已贴上私人便签。')};
  b(wall,tr('Share a good thing with travellers','与旅人分享一件好事'),()=>goodCompanyPublic());render()
 });journalLanguage(townChatPage)
};
/* Readable editorial type, shared by both languages; no external font download. */
const pawFeedbackStyle=document.createElement('style');
pawFeedbackStyle.textContent=
 'html{--paw-body:"Avenir Next","Noto Sans","Segoe UI",system-ui,sans-serif;--paw-display:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}html[lang^="zh"]{--paw-body:"PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif;--paw-display:"Songti SC","Noto Serif CJK SC","STSong","SimSun",serif}body,#game,#proposal,button,input,textarea,select{font-family:var(--paw-body)!important}#content :is(h1,h2,h3),#proposal :is(h1,h2),#game .worldSign,#game #location,#game .pawPlaceName,#content .pawStoryVoice strong{font-family:var(--paw-display)!important;font-weight:600!important}#content p,#line,#content li{line-height:1.65}html[lang^="zh"] #content :is(h1,h2,h3),html[lang^="zh"] #proposal h1{letter-spacing:.035em}'+
 '#game.pawFocusedView #dock{display:none!important}#game.pawExitView #back:not([hidden]){position:fixed!important;top:auto!important;bottom:max(12px,env(safe-area-inset-bottom,0px))!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;min-height:44px!important;z-index:8!important}'+
 '#game.pawFocusedView #gameControls:not([hidden]){bottom:max(10px,env(safe-area-inset-bottom,0px))!important}#game #content .yueCompactHost img{width:108px!important;height:146px!important;max-width:33%!important;object-fit:contain!important;object-position:center bottom!important}'+
 '#game #content .komorebiTile{min-width:0;overflow:hidden}#game #content .komorebiTile img,#game #content .komorebiTile svg{max-width:100%!important;object-fit:contain!important;box-sizing:border-box}#game #content .komorebiTile strong,#game #content .komorebiTile small{min-width:0;overflow-wrap:anywhere;white-space:normal!important}'+
 '#content .pawJoyWall{margin:12px 0;padding:10px;background:#b59b73;color:#453d31;border:5px solid #876b48}#content .pawJoyForm{background:#f5e9c9;padding:12px;display:grid;gap:9px}#content .pawJoyForm textarea{width:100%;min-height:80px;box-sizing:border-box;font-size:16px}#content .pawJoyForm small{font-size:12px;line-height:1.5}#content .pawJoyNotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px;margin-top:13px}#content .pawJoyNote{position:relative;background:#f7e9c8;padding:14px 11px 10px;box-shadow:2px 4px 5px #5e482d44;overflow-wrap:anywhere}#content .pawJoyNote:before{content:"";position:absolute;top:3px;left:50%;width:6px;height:6px;background:#985e44;border-radius:50%}#content .pawJoyNote strong,#content .pawJoyNote small{display:block}#content .pawJoyNote small{font-size:11px;color:#756751}';
document.head.append(pawFeedbackStyle);
const pawYueYearBefore=yueZodiacAlmanac;
yueZodiacAlmanac=function(...args){const result=pawYueYearBefore(...args),q=$('content'),title=q.querySelector(':scope > h1'),intro=q.querySelector(':scope > p');if(title)title.textContent=tr('Chinese zodiac & year ahead','生肖与流年');if(intro){intro.hidden=false;intro.textContent=tr('Your birth-year animal and traditional yearly themes. For reflection, not a prediction.','出生年份的生肖与传统流年主题，仅供参考，并非预测。')}return result};


/* PAW_OWNER_REPAIR_2_BEGIN */
const pawRackResidents=[
 {id:'mei',name:['Auntie Mei','梅姨'],number:6},
 {id:'grandma',name:['Grandma','外婆'],number:9},
 {id:'wang',name:['Wang Laoban','王老板'],number:12},
 {id:'lin',name:['Auntie Lin','林姨'],number:11}
];
function pawRackNumbers(raw,max=12){return Array.isArray(raw)?raw.filter(v=>Number.isInteger(v)&&v>=1&&v<=max).slice(-21):[]}
function pawRackEntries(raw){
 return [...pawRackResidents.map(v=>({...v,fictional:true})),...(Array.isArray(raw)?raw.filter(v=>Number.isInteger(v)&&v>=1&&v<=12):[]).map((number,i)=>({id:'local-'+i,name:['My tied fortune','我的签纸'],number,fictional:false}))]
}
function pawRoomSpeechAllowed(room,activity,transitioning,pageOpen,talkOpen){return !!room&&!activity&&!transitioning&&!pageOpen&&!talkOpen}
/* PAW_OWNER_REPAIR_2_END */
function pawFortuneRackPage(){
 page(tr('Fortunes left behind','留在这里的签文'),tr('Unfold a little reminder from the town.','打开一张留在小镇的签纸。'),q=>{
  const rack=element('section','',q,'pawReadableRack');
  for(const entry of pawRackEntries(templeTies)){
   const fortune=shrinePaperLines[entry.number-1];if(!fortune)continue;
   const slip=element('details','',rack,'pawReadableSlip');
   const label=element('summary','',slip);
   element('strong',tr(...entry.name),label);
   element('small',tr('Fortune ','第 ')+entry.number+(zh?' 签':''),label);
   element('small',entry.fictional?tr('Fictional resident','虚构居民'):tr('Saved on this device','本设备记录'),slip);
   element('p',tr(...fortune),slip)
  }
  element('small',tr('These are fictional resident fortunes and your own local slips, not live traveller posts.','这里只展示虚构居民的签文和你在本设备留下的签纸，不是在线旅人的公开留言。'),q);
 });
 mbHomePageBack(tr('‹ Back to the fortune rack','‹ 返回签文架'),()=>{$('page').style.display='none';updateHUD()});
 journalLanguage(pawFortuneRackPage)
}
const pawRackArtBefore=drawTemplePaperRack;
drawTemplePaperRack=function(x,y,sc=1,hideLatest=0){
 const own=templeTies;
 try{templeTies=[...pawRackResidents.map(v=>v.number),...pawRackNumbers(own)].slice(-21);return pawRackArtBefore(x,y,sc,hideLatest)}
 finally{templeTies=own}
};
const pawRackDrawBefore=drawActivity;
drawActivity=function(...args){
 const result=pawRackDrawBefore(...args);
 if(activity==='templePaper'&&['open','kept','tied'].includes(state.paperStage)&&!talkOpen){
  target(535,350,100,108,pawFortuneRackPage);
  label(tr('Read the rack','看看签文架'),565,325,pawFortuneRackPage)
 }
 return result
};
// Use consistent adult standing heights, rather than each sprite's raw
// dimensions. Draw the existing shopkeeper as a separate person at the counter.
roomResidentStations.wishes.sc=.8;
const pawTeaPoseBefore=drawRitualPose;
drawRitualPose=function(x,y,sc,opts={}){
 if(activity==='bubbleTea'&&room==='boba'&&sc>1.25)sc=1.18;
 return pawTeaPoseBefore(x,y,sc,opts)
};
const pawTeaCounterBefore=drawFoodCounter;
drawFoodCounter=function(...args){
 const result=pawTeaCounterBefore(...args);
 if(room==='boba'&&activity==='bubbleTea'){
  const record=residentArtworkRecord('Boba keeper'),im=residentArtworkImage(record);
  if(im?.complete&&im.naturalWidth)drawResidentRaster(im,550,463,94,'left')
 }
 return result
};
// A small contextual speech cue uses the existing resident's actual
// painted bounds. It does not require the player to stop or respond.

const pawResidentCueBefore=drawRoom;
let pawRoomGreetingKey='',pawRoomGreetingPending=true;
drawRoom=function(...args){
 const result=pawResidentCueBefore(...args),key=scene+'|'+room+'|'+zh;
 if(key!==pawRoomGreetingKey){pawRoomGreetingKey=key;pawRoomGreetingPending=true}
 if(!pawRoomSpeechAllowed(room,activity,transitioning,$('page').style.display==='block',talkOpen)||!indoorReady())return result;
 for(const actor of pawAmbientIndoor){
  const profile=pawAmbientProfile(actor);if(!actor.rect||!profile||Math.hypot(actor.x-indoor.x,actor.y-indoor.y)>190)continue;
  // Show an actual sentence on the first suitable frame, not an ellipsis.
  if(pawRoomGreetingPending&&!pawAmbientActive){
   const now=Date.now(),line=pawAmbientPick(profile.id,pawAmbientLines[profile.id],pawAmbientRead(pawAmbientHistory,now),now)||pawAmbientLines[profile.id][0];
   if(line&&pawRoomRemark(actor,profile,line)){
    pawRoomGreetingPending=false;pawAmbientHistory.push([profile.id,line[0],now]);pawAmbientHistory=pawAmbientHistory.slice(-80);save(pawAmbientKey,pawAmbientHistory)
   }
  }
  // Character itself can be tapped to speak again. No floating icon.
  const rect=actor.rect;
  if(!hit.some(z=>z.stationId&&rect.x<z.x+z.w&&rect.x+rect.w>z.x&&rect.y<z.y+z.h&&rect.y+rect.h>z.y)){
   target(rect.x,rect.y,rect.w,rect.h,()=>{
    if(!indoorReady())return;
    const now=Date.now(),line=pawAmbientPick(profile.id,pawAmbientLines[profile.id],pawAmbientRead(pawAmbientHistory,now),now)||pawAmbientLines[profile.id][0];
    if(line&&pawRoomRemark(actor,profile,line)){pawAmbientHistory.push([profile.id,line[0],now]);pawAmbientHistory=pawAmbientHistory.slice(-80);save(pawAmbientKey,pawAmbientHistory)}
   },'paw-resident-speech:'+profile.id)
  }
 }
 return result
};
// Match the shared font direction in common canvas labels too.
const pawCanvasTextBefore=txt;
txt=function(value,x,y,size=18,color=C.ink,align='center'){
 ctx.save();
 try{
  ctx.font=String(size)+'px '+(zh?'"PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif':'"Avenir Next","Noto Sans","Segoe UI",system-ui,sans-serif');
  ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(String(value),x,y)
 }finally{ctx.restore()}
};
// Earlier independent rail-pane transforms moved a full carriage image
// beneath each mask at different speeds. Keep both parts in phase and
// restrict their motion to the existing window area. Dedicated scenery
// assets are still needed for a fully convincing continuous journey.
const pawOwnerFinishCss=document.createElement('style');
pawOwnerFinishCss.textContent=
 '#game #content .yueCompactHost{min-height:0!important;gap:9px!important;padding:3px 0 5px!important;align-items:center!important}#game #content .yueCompactHost img{width:78px!important;height:92px!important;max-width:28%!important;object-fit:contain!important;object-position:center bottom!important}#game #content .yueCompactHost small{font-size:12px!important;line-height:1.35!important}'+
 '#game .pawRailJourney .mbRailPane>span,#proposal .mbPaintedRail[data-use=entrance] .mbRailPane>span{animation:none!important;transform:none!important;background-repeat:no-repeat!important}'+
 '@keyframes pawTrainUnified{from{transform:translateX(0) scale(1.025)}to{transform:translateX(-1.4%) scale(1.045)}}'+
 '@media(prefers-reduced-motion:reduce){#game .pawRailJourney .mbRailPane>span,#proposal .mbPaintedRail .mbRailPane>span{animation:none!important}}'+
 '#content .pawReadableRack{display:grid;gap:10px;padding:14px 12px;background:repeating-linear-gradient(0deg,#b7996e 0px,#b7996e 6px,#bca37b 6px,#bca37b 8px);border:5px solid #866744}#content .pawReadableSlip{background:#f6e9ca;color:#4c4031;padding:6px 11px 10px;border:1px solid #b39a70;box-shadow:2px 3px 5px #58462c44}#content .pawReadableSlip summary{min-height:44px;cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px}#content .pawReadableSlip summary strong{font-family:var(--paw-display);flex:1 1 140px}#content .pawReadableSlip small{font-size:11px;color:#78664f}#content .pawReadableSlip p{font-family:var(--paw-display);font-size:16px;line-height:1.55;margin:7px 0}';
document.head.append(pawOwnerFinishCss);


/* PAW_ARRIVAL_GATE: reuse painted gate and admission callback, no repeat ticket. */
const pawArrivalTicketBefore=proRender;
proRender=function(...args){
 const result=pawArrivalTicketBefore(...args);
 if(proStep!==3)return result;
 const hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer'),enter=foot?.querySelector('.shrine-enter');
 if(!hero||!foot||!enter)return result;
 proposal.querySelectorAll('.rail-revisit,.shrine-speaker,.shrine-ticket-reminder,.speck').forEach(n=>n.remove());
 const painting=hero.querySelector('.mbGatePainting');
 if(painting){painting.alt=tr('A mountain gateway and stone path into Fortune Valley','通往解忧谷的山门与石板小路');painting.setAttribute('aria-hidden','false')}
 const traveller=hero.querySelector('.gate-traveller');
 if(traveller){traveller.alt='';pawCropEntranceImage(traveller)}
 const brand=proposal.querySelector('header>span');if(brand){brand.replaceChildren();element('strong','Pawradise',brand,'pawGateWordmark');element('small',tr('A LITTLE WORLD AWAY','偷得浮生半日闲'),brand,'pawGateMotto')}
 enter.textContent=tr('Step inside','进小镇');enter.classList.add('pawGateEnter');
 // The artwork and traveller occupy the scene; the footer is only a button.
 foot.replaceChildren(enter);return result
};
const pawArrivalTicketCss=document.createElement('style');
pawArrivalTicketCss.textContent=`
#proposal[data-paw-entrance-step="3"]:not([hidden]){display:block!important;position:absolute!important;inset:0!important;overflow:hidden!important;isolation:isolate;background:#293c32!important;padding:0!important}
#proposal[data-paw-entrance-step="3"]>.cinema-world,#proposal[data-paw-entrance-step="3"]>.speck,#proposal[data-paw-entrance-step="3"] .shrine-ambient-lantern,#proposal[data-paw-entrance-step="3"]:after{display:none!important}
#proposal[data-paw-entrance-step="3"]>header{position:absolute!important;inset:max(14px,env(safe-area-inset-top,0px)) 18px auto!important;z-index:6;display:flex!important;justify-content:space-between;align-items:flex-start;margin:0!important;min-height:44px;background:none!important;padding:0!important}
#proposal[data-paw-entrance-step="3"]>header>span{color:#fff2d7!important;text-shadow:0 2px 8px #17271e;display:grid;gap:3px}
#proposal .pawGateWordmark{font:500 clamp(27px,6vw,42px)/1.1 var(--paw-display,Georgia,serif);letter-spacing:.055em}
#proposal .pawGateMotto{font:500 9px/1.3 var(--paw-body,system-ui,sans-serif);letter-spacing:.16em}
#proposal[data-paw-entrance-step="3"] .shrineLanguageMenu summary{border:1px solid #f0dfb680!important;background:#273a31aa!important;color:#fff0d4!important;box-shadow:none!important;min-width:46px;border-radius:3px!important}
#proposal[data-paw-entrance-step="3"]>.hero{position:absolute!important;inset:0!important;isolation:isolate;display:block!important;container-type:size;height:100%!important;width:100%!important;min-height:0!important;max-height:none!important;max-width:none!important;overflow:hidden!important;background:#52604b url('assets/visual/painted/journey/gate.webp') center/cover no-repeat;border:0!important;border-radius:0!important;animation:none!important;box-shadow:none!important;margin:0!important}
#proposal[data-paw-entrance-step="3"] .mbGatePainting{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:50% 74%!important;border-radius:0!important;animation:none!important;opacity:1!important}
#proposal[data-paw-entrance-step="3"] .hero:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;background:linear-gradient(180deg,#15291f91 0%,transparent 23%,transparent 56%,#192b22c2 82%,#192b22f7 100%)}
#proposal[data-paw-entrance-step="3"] .gate-traveller{position:absolute!important;z-index:3!important;width:auto!important;max-width:24%!important;height:clamp(66px,15cqh,140px)!important;left:50%!important;bottom:29%!important;top:auto!important;translate:-50% 0!important;transform:none;object-fit:contain!important;object-position:bottom;filter:drop-shadow(0 4px 3px #24251c66)!important;transition:transform .36s ease-in,opacity .36s ease-in!important}
#proposal[data-paw-entrance-step="3"] .gate-traveller.go{transform:translateY(-55%) scale(.76)!important;opacity:0!important}
#proposal[data-paw-entrance-step="3"]>footer{position:absolute!important;z-index:5;inset:auto 0 max(18px,env(safe-area-inset-bottom,0px))!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;width:100%!important;max-width:none!important;min-width:0;gap:7px!important;padding:0 18px!important;box-sizing:border-box;background:none!important;overflow:visible!important;animation:none!important;border:0!important;text-align:center;box-shadow:none!important}
#proposal[data-paw-entrance-step="3"] .pawArrivalTitle{font:500 clamp(28px,6vw,52px)/1.08 var(--paw-display,Georgia,serif)!important;color:#fff0d3;margin:0;text-shadow:0 2px 9px #14261c}
#proposal[data-paw-entrance-step="3"] .pawArrivalSubtitle{font:clamp(12px,2.9vw,15px)/1.45 var(--paw-body,system-ui,sans-serif)!important;color:#f1e6cd;margin:0 0 10px}
#proposal[data-paw-entrance-step="3"] .pawGateEnter{display:block!important;box-sizing:border-box;min-height:48px!important;width:auto!important;min-width:150px;max-width:90%;border:1px solid #ead0a0!important;border-radius:3px!important;background:#efe1bd!important;color:#354437!important;font:600 17px/1.2 var(--paw-display,Georgia,serif)!important;box-shadow:0 3px 12px #16251b55,inset 0 0 0 3px #d2bb903c!important;padding:12px 30px!important;position:relative!important;z-index:5!important}
#proposal .pawGateEnter:focus-visible{outline:3px solid #f6dba2;outline-offset:4px}
#proposal .pawGateEnter:active{transform:translateY(1px)}
@media(min-aspect-ratio:1/1){#proposal[data-paw-entrance-step="3"] .mbGatePainting{object-fit:contain!important;background:#293c32b8;backdrop-filter:blur(12px)}#proposal[data-paw-entrance-step="3"]>.hero{background-position:center 65%}}
@media(max-height:480px){#proposal[data-paw-entrance-step="3"] .pawArrivalTitle{font-size:24px!important}#proposal[data-paw-entrance-step="3"] .pawArrivalSubtitle{margin-bottom:3px}#proposal[data-paw-entrance-step="3"]>footer{gap:3px!important}#proposal[data-paw-entrance-step="3"] .gate-traveller{bottom:37%!important}}
@media(prefers-reduced-motion:reduce){#proposal[data-paw-entrance-step="3"] .gate-traveller{transition:none!important}}
`;
document.head.append(pawArrivalTicketCss);

/* PAW_ROOM_LIFE_AND_SCOOP_BEGIN */
function pawScoopProject(x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 const dx=(x-400)/124,dy=(y-458)/63,k=Math.max(1,Math.hypot(dx,dy));
 return {x:400+dx/k*124,y:458+dy/k*63}
}
function pawScoopInside(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&Math.hypot((x-400)/138,(y-458)/74)<=1}
// Stable per-identity walking pace. No frame-by-frame random changes.
function pawResidentTempo(id){
 let h=2166136261;for(const ch of String(id||'visitor')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}
 const n=h>>>0;
 return {speed:27+n%14,dwell:1+(n>>>8)%5*.13}
}
function pawRoomVisitorLook(used,start=0){
 for(let i=0;i<4;i++){const id=(start+i)%4;if(!used.includes(id))return id}
 return null
}
function pawWalkStep(a,b,dt,speed=48){
 const dx=b[0]-a.x,dy=b[1]-a.y,d=Math.hypot(dx,dy);
 if(!Number.isFinite(d)||!Number.isFinite(dt)||dt<0)return {x:a.x,y:a.y,arrived:false};
 const f=d<.01?1:Math.min(1,Math.max(0,speed)*Math.min(.08,dt)/d);
 return {x:a.x+dx*f,y:a.y+dy*f,arrived:f===1}
}
function pawWalkFacing(a,b){const dx=b[0]-a.x,dy=b[1]-a.y;return Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')}
function pawTypedCount(text,elapsed,reduced=false){
 const n=Array.from(String(text)).length;
 return reduced?n:Math.min(n,Math.max(1,Math.floor(Math.max(0,elapsed)/34)+1))
}
/* PAW_ROOM_LIFE_AND_SCOOP_END */
let pawScoopPointer=null;
function pawScoopActive(){return activity==='goldfishScoop'&&state.festivalFish&&!document.hidden&&!talkOpen&&!transitioning&&$('page').style.display!=='block'}
function pawScoopCancel(){
 const a=pawScoopPointer;pawScoopPointer=null;if(!a)return;
 if(state.festivalFish===a.game&&a.game.phase==='dip'){
  a.game.phase='aim';a.game.last=t;a.game.feedback=['The scoop is dry. Try again when ready.','纸网已提起，准备好了再试。'];refreshControls()
 }
 try{if(c.hasPointerCapture(a.id))c.releasePointerCapture(a.id)}catch{}
}
const pawScoopStartBefore=start;
start=function(...args){pawScoopCancel();return pawScoopStartBefore(...args)};
c.addEventListener('pointerdown',e=>{
 if(!pawScoopActive()||e.button!==0||e.isPrimary===false)return;
 const a=point(e),g=state.festivalFish;if(!pawScoopInside(a.x,a.y)||g.phase!=='aim')return;
 e.preventDefault();e.stopImmediatePropagation();drag=null;
 festivalAim(a.x,a.y);festivalDip();if(g.phase!=='dip')return;
 pawScoopPointer={id:e.pointerId,game:g};try{c.setPointerCapture(e.pointerId)}catch{}
},true);
c.addEventListener('pointermove',e=>{
 if(!pawScoopActive())return;
 const g=state.festivalFish,a=point(e);
 if(pawScoopPointer?.id===e.pointerId&&pawScoopPointer.game===g){
  e.preventDefault();e.stopImmediatePropagation();if(g.phase==='dip')festivalAim(a.x,a.y);return
 }
 if(e.pointerType==='mouse'&&e.buttons===0&&g.phase==='aim'&&pawScoopInside(a.x,a.y))festivalAim(a.x,a.y)
},true);
c.addEventListener('pointerup',e=>{
 const a=pawScoopPointer;if(!a||a.id!==e.pointerId)return;
 e.preventDefault();e.stopImmediatePropagation();pawScoopPointer=null;
 if(pawScoopActive()&&a.game===state.festivalFish&&a.game.phase==='dip'){
  const pos=point(e);festivalAim(pos.x,pos.y);festivalLift()
 }
 try{if(c.hasPointerCapture(e.pointerId))c.releasePointerCapture(e.pointerId)}catch{}
},true);
for(const name of ['pointercancel','lostpointercapture'])c.addEventListener(name,e=>{if(pawScoopPointer?.id===e.pointerId)pawScoopCancel()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pawScoopCancel()});
window.addEventListener('blur',pawScoopCancel);
const pawScoopControlsBefore=refreshControls;
refreshControls=function(...args){
 const result=pawScoopControlsBefore(...args);
 if(activity!=='goldfishScoop'||!state.festivalFish)return result;
 const g=state.festivalFish,el=$('gameControls'),controls=el.querySelector('.festivalFishButtons');
 if(!controls||g.phase==='done')return result;
 const status=el.querySelector('strong');if(status)status.textContent=tr('Paper ','纸网 ')+g.paper+'% · '+tr('Caught ','捞到 ')+g.caught.length+'/5';
 controls.replaceChildren();
 if(g.phase==='aim'||g.phase==='dip'){
  const assist=b(controls,g.phase==='aim'?tr('Dip scoop','下网'):tr('Lift scoop','捞起'),()=>g.phase==='aim'?festivalDip():festivalLift());
  if(assist?.setAttribute)assist.setAttribute('aria-label',tr('Keyboard scoop action. Arrow keys move the ring.','键盘捞鱼操作，方向键移动纸网。'));
  element('small',tr('Keyboard: arrows + Space','键盘：方向键 + 空格'),controls,'pawScoopKeyGuide');
 }else element('small',tr('Back into the water…','小鱼回水池啦……'),controls);
 return result
};
document.addEventListener('keydown',e=>{
 if(!pawScoopActive()||e.repeat||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;
 const g=state.festivalFish,delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];
 if(delta&&['aim','dip'].includes(g.phase)){e.preventDefault();e.stopImmediatePropagation();festivalAim(g.x+delta[0],g.y+delta[1])}
 else if(e.code==='Space'&&!e.target?.closest?.('button')&&['aim','dip'].includes(g.phase)){e.preventDefault();e.stopImmediatePropagation();g.phase==='aim'?festivalDip():festivalLift()}
},true);
function pawRoomRemark(actor,profile,line){
 if(!actor?.rect||pawAmbientBlocked())return false;
 pawAmbientClear();const full=tr(line[1],line[2]);pawAmbientName.textContent=tr(...actor.n);pawAmbientText.textContent=full;pawAmbientNode.hidden=false;
 if(!pawAmbientPlace(actor,pawAmbientIndoor)){pawAmbientNode.hidden=true;return false}
 const now=performance.now();pawAmbientActive={id:profile.id,until:now+pawSpeechDuration(full)};pawAmbientNext=now+12000;return true
}
let pawTypedSpeech=null;
const pawTypedBefore=pawAmbientTick;
pawAmbientTick=function(now){
 const result=pawTypedBefore(now);
 if(!pawAmbientActive||pawAmbientNode.hidden){pawTypedSpeech=null;return result}
 if(pawTypedSpeech?.active!==pawAmbientActive){
  const full=pawAmbientText.textContent,letters=Array.from(full),shown=document.createElement('span'),pending=document.createElement('span');
  shown.style.display='inline';pending.style.display='inline';pending.style.visibility='hidden';pending.setAttribute('aria-hidden','true');
  pawAmbientText.replaceChildren(shown,pending);pawTypedSpeech={active:pawAmbientActive,full,letters,shown,pending,start:now,last:-1};
  pawAmbientText.setAttribute('aria-label',full)
 }
 const q=pawTypedSpeech,count=pawTypedCount(q.full,now-q.start,residentReducedMotion.matches);
 if(count!==q.last){q.last=count;q.shown.textContent=q.letters.slice(0,count).join('');q.pending.textContent=q.letters.slice(count).join('')}
 return result
};
/* Fictional visitors are rendered locally, never advertised as online users. */
/* Fictional guests: quiet, visit-specific rosters. Never claim these are online players. */
const pawRoomVisitorSpecs={
 temple:{count:2,points:[[185,680],[325,710],[605,680],[510,730],[230,615]]},
 tarot:{count:1,points:[[185,690],[610,700],[325,730]]},
 destiny:{count:1,points:[[190,700],[610,690],[350,730]]},
 wishes:{count:2,points:[[190,610],[390,600],[610,630],[490,700],[220,690]]},
 tea:{count:2,points:[[180,660],[365,630],[610,680],[465,720]]},
 park:{count:2,points:[[185,670],[380,610],[600,690],[335,720]]},
 fish:{count:1,points:[[180,680],[620,690],[390,730]]},
 kitchen:{count:1,points:[[180,680],[620,690],[400,730]]},
 arcade:{count:2,points:[[190,680],[400,710],[610,670],[520,730]]},
 boba:{count:1,points:[[190,680],[395,700],[615,680]]},
 mystery:{count:1,points:[[190,680],[620,700],[400,730]]},
 quiz:{count:1,points:[[190,700],[610,680],[400,730]]},
 story:{count:1,points:[[190,680],[620,700],[400,730]]},
 match:{count:1,points:[[190,700],[610,690],[400,730]]}
};
let pawVisitorContext='',pawLocalVisitors=[],pawVisitorAt=0,pawVisitSerial=0,pawRenderedWalker=null;
function pawGuestRoomCandidates(profiles,active,world,valid){return profiles.filter(g=>g.world===world&&!active.includes(g.id)&&valid(g))}
// The old guest atlas was removed from the live build. Resolve only actual
// identity-specific installed art; never request guessed files or reuse a host.
function pawGuestArt(g,resolve=residentArtworkRecord,loadImage=residentArtworkImage){
 if(!g||!Array.isArray(g.name))return null;
 const record=resolve(g.name);if(!record)return null;
 const im=loadImage(record);
 return im?.complete&&im.naturalWidth>0&&im.naturalHeight>0?im:null
}
function pawRoomGuestProfile(visit){const active=npc.filter(n=>n.popGuest).map(n=>n.popGuest),pool=pawGuestRoomCandidates(popGuestStories,active,scene,g=>!!pawGuestArt(g));return pool.length?pool[visit%pool.length]:null}
/* Guest feet must never occupy the doorway or the player's action anchors.
   Use existing room data; do not change player collision geometry. */
function pawGuestClear(x,y,anchors,clearance=52){
 return Number.isFinite(x)&&Number.isFinite(y)&&anchors.every(([ax,ay])=>!Number.isFinite(ax)||!Number.isFinite(ay)||Math.hypot(x-ax,y-ay)>=clearance)
}
function pawGuestStationFeet(spec,ids){
 return [...new Set(ids)].map(id=>spec.stations?.[id]).filter(v=>Array.isArray(v)&&v.length>=4&&v.slice(2,4).every(Number.isFinite)).map(v=>v.slice(2,4))
}
function pawGuestActiveFeet(){
 const spec=indoorSpec(),ids=room==='temple'?Object.keys(spec.stations||{}):(roomActions[room]||[]).map(v=>v[0]);
 return pawGuestStationFeet(spec,ids)
}
function pawGuestProtected(){
 const spec=indoorSpec(),entry=spec.entry;
 return [entry,[entry[0],entry[1]-35],spec.arrival,...pawGuestActiveFeet()].filter(v=>Array.isArray(v)&&v.length>=2)
}
function pawGuestWaypoints(points,anchors,safe,clearance=52){
 return points.filter(([x,y])=>safe(x,y)&&pawGuestClear(x,y,anchors,clearance))
}
function pawGuestSegment(a,b,anchors,clearance=52){
 const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;
 return anchors.every(([x,y])=>{
  if(!Number.isFinite(x)||!Number.isFinite(y))return true;
  const f=d?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d)):0;
  return Math.hypot(x-(a[0]+f*dx),y-(a[1]+f*dy))>=clearance
 })
}
function pawGuestSpaced(points,count,minDistance=68){
 const chosen=[];
 for(const point of points){
  if(chosen.length>=count)break;
  if(chosen.every(p=>Math.hypot(point[0]-p[0],point[1]-p[1])>=minDistance))chosen.push(point)
 }
 return chosen
}
function pawGuestCount(max,visit,roomId){
 const key=Array.from(String(roomId)).reduce((a,c)=>a+c.codePointAt(0),0);
 // Some visits are quiet, and some have an extra guest. Stable within a visit.
 return (key+visit)%4===0?0:Math.min(max,1+((key+visit)%3===0?1:0))
}
/* PAW_VISITOR_LIFECYCLE_BEGIN */
function pawVisitorDoorRoute(from,to,anchors,safe,path,clearance=52,segment=null){
 if(!Array.isArray(from)||!Array.isArray(to)||![...from,...to].every(Number.isFinite)||!safe(...from)||!safe(...to))return null;
 const point=v=>Array.isArray(v)&&v.length===2&&safe(...v)&&pawGuestClear(v[0],v[1],anchors,clearance);
 const valid=(route,start,end)=>Array.isArray(route)&&route.length&&route.every((v,i)=>point(v)&&pawGuestSegment(i?route[i-1]:start,v,anchors,clearance))&&Math.hypot(route.at(-1)[0]-end[0],route.at(-1)[1]-end[1])<.01;
 if(!point(from)||!point(to))return null;
 const direct=path(from,to);if(valid(direct,from,to))return direct;
 // If the ordinary room path crosses a reserved station, find a detour
 // around its clearance ring. Each edge still uses the physical pathfinder.
 // Bound graph size and search work: this is only run when choosing a route.
 const nodes=[from,to],seen=new Set(nodes.map(v=>v.join(','))),radius=clearance*1.18+2;
 for(const [x,y] of anchors.slice(0,12))for(let i=0;i<8;i++){
  const v=[Math.round(x+Math.cos(i*Math.PI/4)*radius),Math.round(y+Math.sin(i*Math.PI/4)*radius)],key=v.join(',');
  if(point(v)&&!seen.has(key)){seen.add(key);nodes.push(v)}
 }
 const dist=nodes.map(()=>Infinity),prev=nodes.map(()=>null),done=new Set();dist[0]=0;
 while(done.size<nodes.length&&done.size<24){
  let u=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(u<0||dist[i]<dist[u]))u=i;
  if(u<0||!Number.isFinite(dist[u]))break;
  if(u===1){const pieces=[];for(let at=1;at!==0;){const p=prev[at];if(!p)return null;pieces.unshift(p.route);at=p.from}return pieces.flat()}
  done.add(u);
  for(let v=1;v<nodes.length;v++){
   if(done.has(v)||!pawGuestSegment(nodes[u],nodes[v],anchors,clearance))continue;
   // In the live room, test the cheap straight physical segment rather than
   // nesting a full pathfinder inside every candidate graph edge.
   const edge=segment?(segment(nodes[u],nodes[v])?[nodes[v]]:null):path(nodes[u],nodes[v]);if(!valid(edge,nodes[u],nodes[v]))continue;
   const length=edge.reduce((sum,p,i)=>{const q=i?edge[i-1]:nodes[u];return sum+Math.hypot(p[0]-q[0],p[1]-q[1])},0);
   if(dist[u]+length<dist[v]){dist[v]=dist[u]+length;prev[v]={from:u,route:edge}}
  }
 }
 return null
}
function pawVisitorVisible(a){return a.phase!=='waiting'&&a.phase!=='gone'}
function pawVisitorHold(roster){for(const a of roster)a.walking=0;return roster}
function pawVisitorDoorClear(door,player,others,clearance=75){
 return pawGuestClear(door[0],door[1],[[player.x,player.y],...others.filter(pawVisitorVisible).map(a=>[a.x,a.y])],clearance)
}
/* PAW_VISITOR_LIFECYCLE_END */
function pawRoomWalkers(){
 const spec=pawRoomVisitorSpecs[room];if(!spec||activity)return [];
 const context=scene+'|'+room+'|'+avatar;
 if(!indoorReady()){pawVisitorAt=t;return context===pawVisitorContext?pawVisitorHold(pawLocalVisitors):[]}
 const obs=indoorObstacles(),protectedFeet=pawGuestProtected(),door=indoorSpec().entry,stationFeet=pawGuestActiveFeet();
 const safe=pawGuestWaypoints(spec.points,protectedFeet,(x,y)=>indoorSafe(x,y,obs));
 if(context!==pawVisitorContext){
  pawVisitorContext=context;pawVisitorAt=t;pawVisitSerial++;
  const residents=pawAmbientIndoor.map(a=>[a.x,a.y]),entry=indoorSpec().entry;
  const spawn=safe.filter(v=>pawGuestClear(v[0],v[1],[[indoor.x,indoor.y]],90)&&pawGuestClear(v[0],v[1],[entry],65)&&pawGuestClear(v[0],v[1],residents,68));
  const offset=spawn.length?pawVisitSerial%spawn.length:0,ordered=[...spawn.slice(offset),...spawn.slice(0,offset)];
  const used=[avatar??0];
  // Outdoor fallback looks may also appear indoors. Prefer a distinct look;
  // do not duplicate the selected player or another visitor in this room.
  const outdoor=[...pawPasserbyLooks().values()];
  pawLocalVisitors=pawGuestSpaced(ordered,pawGuestCount(spec.count,pawVisitSerial,room)).map((pos,i)=>{
   const start=((avatar??0)+1+i+pawVisitSerial%2)%4,look=pawRoomVisitorLook([...used,...outdoor],start)??pawRoomVisitorLook(used,start);
   if(look===null)return null;used.push(look);
   return {id:'fictional-visitor-'+i,fictionalVisitor:true,room,x:pos[0],y:pos[1],avatar:look,facing:'down',walking:0,index:safe.indexOf(pos),route:[],wait:t+2+i*2.5,phase:'waiting',destination:pos,elapsed:0}
  }).filter(Boolean);
  // Use existing original cameo identities, conversation branches and keepsakes.
  // Never duplicate an outdoor character or use unrelated portrait art.
  if(pawLocalVisitors.length&&pawVisitSerial%2===1){
   const g=pawRoomGuestProfile(pawVisitSerial);if(g){const a=pawLocalVisitors[0];a.guest=g;a.id=g.id;a.phase='stationary';a.facing=a.x<400?'right':'left'}
  }
 }
 const dt=Math.max(0,Math.min(.05,t-pawVisitorAt));pawVisitorAt=t;
 if(talkOpen||transitioning||document.hidden||$('page').style.display==='block')return pawVisitorHold(pawLocalVisitors);
 if(residentReducedMotion.matches){for(const a of pawLocalVisitors)if(a.phase==='waiting')a.phase='stationary';return pawVisitorHold(pawLocalVisitors)}
 for(const a of pawLocalVisitors){
  a.walking=0;if(a.guest||a.visitingResident||a.phase==='gone'||a.phase==='stationary'||t<a.wait)continue;
  const others=pawLocalVisitors.filter(b=>b!==a),clearDoor=()=>pawVisitorDoorClear(door,indoor,[...others,...pawAmbientIndoor]);
  const routeTo=(from,to)=>pawVisitorDoorRoute(from,to,stationFeet,(x,y)=>indoorSafe(x,y,obs),(f,d)=>indoorPath(f,d,obs),52,(f,d)=>indoorSegment(f,d,obs));
  if(a.phase==='waiting'){
   if(!a.identitySettled||!clearDoor()){a.wait=t+.7;continue}
   const route=routeTo(door,a.destination);
   if(!route){a.phase='gone';continue}
   a.x=door[0];a.y=door[1];a.facing=pawWalkFacing(a,route[0]);a.route=route;a.phase='arriving';a.elapsed=0;
  }
  if(a.phase==='roaming'){
   a.elapsed+=dt;
   if(a.elapsed>=35+((a.avatar+1)*7)&&clearDoor()&&t>=(a.exitRetry||0)){
    const route=routeTo([a.x,a.y],door);
    if(route){a.route=route;a.phase='departing'}else a.exitRetry=t+5
   }
  }
  if(!a.route.length){
   if(a.phase==='arriving'||a.phase==='departing'){a.route=routeTo([a.x,a.y],a.phase==='arriving'?a.destination:door)||[];if(!a.route.length){a.wait=t+2;continue}}
   if(a.route.length===0&&safe.length<2){a.wait=t+3;continue}
  }
  if(!a.route.length){
   // Try several quiet waypoints before waiting. Never take a shortcut
   // through a reserved interaction point just because its endpoints are safe.
   let found=null;
   for(let attempt=0;attempt<safe.length;attempt++){
    a.index=(a.index+1)%safe.length;const end=safe[a.index];
    if(Math.hypot(a.x-end[0],a.y-end[1])<10)continue;
    const route=pawVisitorDoorRoute([a.x,a.y],end,protectedFeet,(x,y)=>indoorSafe(x,y,obs),(f,d)=>indoorPath(f,d,obs),52,(f,d)=>indoorSegment(f,d,obs));
    if(route?.length){found=route;break}
   }
   if(!found){a.wait=t+5;continue}a.route=found
  }
  const tempo=pawResidentTempo(a.id+'|'+a.avatar),dest=a.route[0],next=pawWalkStep(a,dest,dt,tempo.speed);
  const transit=a.phase==='arriving'||a.phase==='departing';
  if(!indoorSafe(next.x,next.y,obs)||!pawGuestClear(next.x,next.y,transit?stationFeet:protectedFeet)||!pawGuestClear(next.x,next.y,pawAmbientIndoor.map(v=>[v.x,v.y]),60)){if(!transit)a.route=[];a.wait=t+2;continue}
  if(Math.hypot(next.x-indoor.x,next.y-indoor.y)<55||others.some(b=>pawVisitorVisible(b)&&Math.hypot(next.x-b.x,next.y-b.y)<50)){if(!transit)a.route=[];a.wait=t+1.1;continue}
  const distance=Math.hypot(next.x-a.x,next.y-a.y);
  if(distance>.01){a.facing=pawWalkFacing(a,dest);pawGaitTravel.set(a,(pawGaitTravel.get(a)||0)+distance);a.walking=1}
  a.x=next.x;a.y=next.y;
  if(next.arrived){a.route.shift();if(!a.route.length){a.walking=0;if(a.phase==='departing'){a.phase='gone';continue}if(a.phase==='arriving'){a.phase='roaming';a.elapsed=0}a.wait=t+(4+(a.avatar%3)*2)*tempo.dwell}}
 }
 return pawLocalVisitors
}
const pawVisitorEnterBefore=enter;
enter=function(...args){pawVisitorContext='';pawLocalVisitors=[];return pawVisitorEnterBefore(...args)};
const pawVisitorDrawBefore=drawSharedRoomActor;
drawSharedRoomActor=function(a,scale){
 if(a.fictionalVisitor){
  if(!pawVisitorVisible(a))return;
  if(a.guest){
   const height=94*scale,drawn=drawResidentRaster(pawGuestArt(a.guest),a.x,a.y,height,a.facing);
   if(drawn){
    if(indoorReady()&&Math.hypot(a.x-indoor.x,a.y-indoor.y)<150){
     const w=Math.max(36,44/Math.max(.2,cam.scale)),h=Math.max(height*.8,44/Math.max(.2,cam.scale));
     const x=a.x-w/2,y=a.y-h;
     // Station hit zones always win. A cameo never steals a gameplay tap.
     if(hit.some(z=>z.stationId&&x<z.x+z.w&&x+w>z.x&&y<z.y+z.h&&y+h>z.y))return;
     target(x,y,w,h,()=>{
      if(!indoorReady()||Math.hypot(a.x-indoor.x,a.y-indoor.y)>=150)return;
      releaseWalkKeys();joystickReset();indoor.goal=null;indoor.route=[];indoor.tx=indoor.x;indoor.ty=indoor.y;
      indoor.facing=pawWalkFacing(indoor,[a.x,a.y]);popGuestMeet(a.guest)
     },'paw-cameo:'+a.guest.id)
    }
    return
   }
  }
  pawRenderedWalker=a;try{backHuman(a.x,a.y,a.avatar,a.walking===1,a.facing,scale)}finally{pawRenderedWalker=null}return
 }
 pawRenderedWalker=a;try{return pawVisitorDrawBefore(a,scale)}finally{pawRenderedWalker=null}
};
const pawGardenScaleBefore=drawGatheringPainted;
drawGatheringPainted=function(name,x,y,scale=1,facing='right'){
 if(room==='wishes'&&!activity&&residentArtworkRecord(name)?.id==='garden-keeper'){
  const record=residentArtworkRecord(name);scale=94*travellerRoomScale(H,cam.scale)/record.height
 }
 return pawGardenScaleBefore(name,x,y,scale,facing)
};
const pawRoomLifeCss=document.createElement('style');
pawRoomLifeCss.textContent='#game #gameControls.festivalFishControls:not([hidden]){width:min(94vw,430px)!important;padding:9px 11px!important;gap:5px!important;background:#f2e5c8!important;border:1px solid #a9895d!important;border-radius:2px!important;box-shadow:0 4px 12px #30261d50!important}#game .festivalFishControls strong{font:600 15px/1.3 var(--paw-display,Georgia,serif)!important}#game .festivalFishControls progress{width:100%;height:7px;accent-color:#73865f}#game .festivalFishButtons{align-items:center}#game .festivalFishButtons button{min-height:44px!important;background:#e9d9b4;color:#3e523d;border-radius:2px!important}#game .pawScoopKeyGuide{font-size:11px!important;color:#6e634f}@media(pointer:coarse){#game .pawScoopKeyGuide{display:none!important}}@media(orientation:landscape) and (max-height:499px){#game #gameControls.festivalFishControls:not([hidden]){width:190px!important}}';
document.head.append(pawRoomLifeCss);

/* PAW_STAIR_ROUTING_BEGIN
   Player foot coordinates use the traced stair corridor rather than a fixed
   screen-centre rectangle. Extend the route to the existing arrival landing.
   These are conservative authored coordinates, pending device screenshot review. */
const pawPlayerStairs=[...pawStairPath,[1515,500,55],[1680,500,55]];
function pawStairLane(y,points=pawPlayerStairs){
 const yy=Math.max(points[0][0],Math.min(points.at(-1)[0],Number.isFinite(y)?y:points[0][0]));
 let i=1;while(i<points.length-1&&points[i][0]<yy)i++;
 const a=points[i-1],b=points[i],f=(yy-a[0])/(b[0]-a[0]);
 return {y:yy,x:a[1]+(b[1]-a[1])*f,half:(a[2]+(b[2]-a[2])*f)*1.5}
}
function pawStairFoot(x,y){
 const lane=pawStairLane(y);return{x:Math.max(lane.x-lane.half,Math.min(lane.x+lane.half,Number.isFinite(x)?x:lane.x)),y:lane.y}
}
function pawStairRoute(from,to){
 const start=pawStairFoot(from.x,from.y),end=pawStairFoot(to.x,to.y),dir=Math.sign(end.y-start.y);
 const knots=pawPlayerStairs.filter(q=>dir*(q[0]-start.y)>0&&dir*(end.y-q[0])>0);
 if(dir<0)knots.reverse();
 const path=[{x:pawStairLane(start.y).x,y:start.y},...knots.map(q=>({x:q[1],y:q[0]})),{x:pawStairLane(end.y).x,y:end.y},end];
 return path.filter((q,i)=>i===0||Math.hypot(q.x-path[i-1].x,q.y-path[i-1].y)>.1)
}
/* PAW_STAIR_ROUTING_END */

/* PAW_DISTRICT_GROUND_BEGIN
   Walkable centre lines already traced on the actual four portrait paintings.
   Limit feet, not the whole body rectangle, and route along every bend. */
function pawDistrictFoot(points,x,y){
 const lane=pawStairLane(y,points);
 return {x:Math.max(lane.x-lane.half,Math.min(lane.x+lane.half,Number.isFinite(x)?x:lane.x)),y:lane.y}
}
function pawDistrictRoute(points,from,to){
 const start=pawDistrictFoot(points,from.x,from.y),end=pawDistrictFoot(points,to.x,to.y),dir=Math.sign(end.y-start.y);
 const knots=points.filter(q=>dir*(q[0]-start.y)>.01&&dir*(end.y-q[0])>.01);
 if(dir<0)knots.reverse();
 const path=[{x:pawStairLane(start.y,points).x,y:start.y},...knots.map(q=>({x:q[1],y:q[0]})),{x:pawStairLane(end.y,points).x,y:end.y},end];
 return path.filter((q,i)=>i===0||Math.hypot(q.x-path[i-1].x,q.y-path[i-1].y)>.05)
}
function pawDistrictFacing(previous,dx,dy){
 if(Math.hypot(dx,dy)<.035)return previous||'down';
 const ax=Math.abs(dx),ay=Math.abs(dy);
 if(ax>ay*1.18)return dx<0?'left':'right';
 if(ay>ax*1.10)return dy<0?'up':'down';
 if(previous==='left'&&dx<0||previous==='right'&&dx>0||previous==='up'&&dy<0||previous==='down'&&dy>0)return previous;
 return ay>=ax?(dy<0?'up':'down'):(dx<0?'left':'right')
}
function pawDistrictAdvance(points,from,to,dt,speed,velocity=0,queued=false){
 const start=pawDistrictFoot(points,from.x,from.y),end=pawDistrictFoot(points,to.x,to.y);
 const dir=Math.sign(end.y-start.y);
 const knots=points.filter(q=>dir*(q[0]-start.y)>.02&&dir*(end.y-q[0])>.02);if(dir<0)knots.reverse();
 const next=knots.length?{x:knots[0][1],y:knots[0][0]}:end;
 const dx=next.x-start.x,dy=next.y-start.y,d=Math.hypot(dx,dy);
 if(d<=1.25)return {x:next.x,y:next.y,tx:end.x,ty:end.y,velocity:Math.hypot(end.x-next.x,end.y-next.y)>1.25?velocity:0,walking:Math.hypot(end.x-next.x,end.y-next.y)>1.25};
 const delta=Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0)),vertical=Math.abs(dy)>Math.abs(dx)*.8;
 const cap=queued?(vertical?190:205):(vertical?145:175);
 const wanted=Math.min(Number.isFinite(speed)&&speed>0?speed:cap,cap,Math.max(35,d*8));
 const current=Number.isFinite(velocity)?Math.max(0,velocity):0;
 const v=current+(wanted-current)*Math.min(1,delta*12),amount=Math.min(d,v*delta);
 const point=pawDistrictFoot(points,start.x+dx/d*amount,start.y+dy/d*amount);
 return {...point,tx:end.x,ty:end.y,velocity:v,walking:Math.hypot(end.x-point.x,end.y-point.y)>1.25||amount>.035}
}
/* PAW_DISTRICT_GROUND_END */
const pawDistrictSpines={fortune:pawPlayerStairs,home:paintedResidentPaths.home,island:paintedResidentPaths.island,wonder:paintedResidentPaths.wonder};
const pawGroundLimitBefore=minY,pawGroundMaxBefore=maxY;
minY=function(){const points=pawDistrictSpines[scene];return points&&!room?Math.max(pawGroundLimitBefore(),points[0][0]):pawGroundLimitBefore()};
maxY=function(){const points=pawDistrictSpines[scene];return points&&!room?Math.min(pawGroundMaxBefore(),points.at(-1)[0]):pawGroundMaxBefore()};
const pawGroundResetBefore=resetPosition;
resetPosition=function(...args){
 const result=pawGroundResetBefore(...args),points=pawDistrictSpines[scene];
 if(points&&!room){
  const q=pawDistrictFoot(points,p.x,p.y);Object.assign(p,{x:q.x,y:q.y,tx:q.x,ty:q.y,motionSpeed:0,pawFacing:'up'});cam.x=q.x;cam.y=q.y;
  pawWalkDistance=0;pawGaitTravel.set(p,0)
 }return result
};
/* PAW_PEDESTRIAN_BEGIN */
function pawPedestrianFace(prior,dx,dy,dt){
 const q=prior||{facing:'up',candidate:null,hold:0};
 if(![dx,dy,dt].every(Number.isFinite)||Math.hypot(dx,dy)<.035)return {...q,candidate:null,hold:0};
 const next=pawDistrictFacing(q.facing,dx,dy);
 if(next===q.facing)return {facing:q.facing,candidate:null,hold:0};
 const hold=(q.candidate===next?q.hold:0)+Math.max(0,Math.min(.05,dt));
 return hold>=.09?{facing:next,candidate:null,hold:0}:{facing:q.facing,candidate:next,hold}
}
function pawPedestrianCrowd(before,next,other,gap=58){
 if(!before||!next||!other||![before.x,before.y,next.x,next.y,other.x,other.y].every(Number.isFinite))return false;
 const a=Math.hypot(before.x-other.x,before.y-other.y),b=Math.hypot(next.x-other.x,next.y-other.y);
 return b<gap&&b<a-.005
}
function pawPedestrianLane(points,from,to){
 const a=pawDistrictFoot(points,from.x,from.y),b=pawDistrictFoot(points,to.x,to.y);
 const sign=Math.sign(b.y-a.y);
 const knot=sign>0?points.find(v=>v[0]>a.y+.02&&v[0]<b.y-.02):sign<0?[...points].reverse().find(v=>v[0]<a.y-.02&&v[0]>b.y+.02):null;
 return knot?{x:knot[1],y:knot[0]}:b
}
/* PAW_PEDESTRIAN_END */
const pawPedestrianFaces=new WeakMap();
function pawResidentFacing(n){return pawPedestrianFaces.get(n)?.facing||n.facing||n.paintedFacing||'up'}
const pawGroundStepBefore=step,pawResidentFootMotion=new WeakMap();
const pawResidentMovingBefore=residentMoving;
residentMoving=function(n){return pawResidentMovingBefore(n)&&(!pawResidentFootMotion.has(n)||pawResidentFootMotion.get(n))};
step=function(n,dt,speed){
 const points=pawDistrictSpines[scene];
 if(n!==p||room||!points){
  const x=n.x,y=n.y;
  const isResident=n!==p&&!room&&npc.includes(n);
  // Keep a speaker still during a real exchange; the player remains free.
  if(isResident){
   const id=pawAmbientProfile(n)?.id;
   if(id&&(pawAmbientActive?.id===id||pawOverheardPending?.id===id||pawOverheardPending?.other===id)){
    pawResidentFootMotion.set(n,false);return true
   }
  }
  if(isResident&&talkOpen){pawResidentFootMotion.set(n,false);return true}
  const tempo=isResident?pawResidentTempo(pawPasserbyIdentity(n)):null,oldPause=n.pauseUntil||0;
  const result=pawGroundStepBefore(n,dt,tempo?Math.min(speed,tempo.speed):speed);
  if(isResident&&n.pauseUntil>Math.max(t,oldPause)&&n.pauseUntil-t>1.5)n.pauseUntil=t+(n.pauseUntil-t)*tempo.dwell;
  if(n!==p){
   const dx=n.x-x,dy=n.y-y,moving=Math.hypot(dx,dy)>.035;pawResidentFootMotion.set(n,moving);
   if(isResident){const prior=pawPedestrianFaces.get(n)||{facing:n.facing||n.paintedFacing||(n.walkDirection<0?'up':'down'),candidate:null,hold:0};
    const face=pawPedestrianFace(prior,dx,dy,dt);pawPedestrianFaces.set(n,face);n.facing=face.facing}
  }
  return result
 }
 const start=pawDistrictFoot(points,n.x,n.y),goal=pawDistrictFoot(points,n.tx,n.ty);
 const next=pawDistrictAdvance(points,start,goal,dt,speed,n.motionSpeed,!!pending);
 n.x=next.x;n.y=next.y;n.tx=next.tx;n.ty=next.ty;n.motionSpeed=next.walking?next.velocity:0;
 const dx=n.x-start.x,dy=n.y-start.y,travel=Math.hypot(dx,dy);
 if(travel>.035){n.pawFacing=pawDistrictFacing(n.pawFacing||n.facing,dx,dy);n.facing=n.pawFacing;pawWalkDistance+=travel;pawGaitTravel.set(n,(pawGaitTravel.get(n)||0)+travel)}
 else if(n.pawFacing)n.facing=n.pawFacing;
 // Preserve the original grumpy resident's contextual bump joke.
 if(scene==='home'&&!transitioning&&!talkOpen&&proposal.hidden&&$('page').style.display!=='block'&&travel>.035&&t-grannyBumpAt>=7){
  const ma=npc.find(v=>v.grumpy);if(ma&&Math.hypot(n.x-ma.x,n.y-ma.y)<38){grannyBumpAt=t;ma.pauseUntil=t+1.6;toast(tr(...townReaction('granny-bump',grumpyBumps)))}
 }
 return next.walking
};
/* PAW_DOOR_REPLAN_BEGIN */
function pawDoorRepeat(id,pending,queue,room,transitioning){
 return !room&&!transitioning&&id===pending&&!!queue?.length
}
function pawDoorNeedsGround(previousQueue,newQueue,pending,points,room){
 return !!(points&&!room&&pending&&newQueue!==previousQueue&&newQueue?.length)
}
/* PAW_DOOR_REPLAN_END */
const pawGroundDoorBefore=walkDoor;
walkDoor=function(...args){
 // Repeated taps must not restart the route. Redirected legacy doors
 // may create a fresh queue for the same canonical destination.
 if(pawDoorRepeat(args[0],pending,walkQueue,room,transitioning))return;
 const previousQueue=walkQueue,result=pawGroundDoorBefore(...args),points=pawDistrictSpines[scene];
 if(pawDoorNeedsGround(previousQueue,walkQueue,pending,points,room)){
  const end=walkQueue.at(-1),start=pawDistrictFoot(points,p.x,p.y);
  walkQueue=pawDistrictRoute(points,start,end);
  if(walkQueue.length){p.tx=walkQueue[0].x;p.ty=walkQueue[0].y;p.motionSpeed=0}
 }
 return result
};
/* Equal screen-height targets for the same depth; no artificial player size bonus. */
const pawScaleBefore=travellerOutdoorScale;
travellerOutdoorScale=function(base,camera,width,height,player){
 const factor=scene==='fortune'&&player?1.22/1.65:1;
 return pawScaleBefore(base*factor,camera,width,height,false)
};
const pawVisualCleanStyle=document.createElement('style');
pawVisualCleanStyle.textContent=`
#game #worldSigns .worldSign .doorPlaque{font-size:clamp(11px,2.8vw,14px)!important;line-height:1.15!important;padding:4px 7px!important;max-width:120px!important;box-shadow:0 2px 4px #342a2044!important}
#game #worldSigns .worldSign{min-height:44px!important}
#game #hud{background:transparent!important}
#game #hint.townHintRest{opacity:0!important;pointer-events:none!important}
#game .pawRailJourney .pawRailCaption{background:#28392dc9;border:0;border-radius:2px;box-shadow:none;padding:9px 15px}
#game .pawRailJourney .pawRailSkip{background:#28392daa;border:1px solid #e6cf9b66;font:500 13px var(--paw-body,system-ui,sans-serif)}
`;document.head.append(pawVisualCleanStyle);
/* Keep the obsolete duplicate carriage layers disabled. The moving glass
   canvas is a separate, clipped exterior-only overlay. */
const pawRailSeamStyle=document.createElement('style');pawRailSeamStyle.textContent='#game .mbPaintedRail .mbRailPane,#proposal .mbPaintedRail .mbRailPane{display:none!important}';document.head.append(pawRailSeamStyle);
/* Visitor calendar belongs in Town Hall, not a fifth dock or a duplicate
   Today page. Only show existing scripted roster and earned conversation memory. */
const pawTownGuestBefore=townChatPage;
townChatPage=function(...args){
 const result=pawTownGuestBefore(...args);
 if(communityTab!=='board')return result;
 const q=$('content'),tabs=q.querySelector('.communityTabs');
 if(!tabs||q.querySelector('.pawGuestNotice'))return result;
 const note=element('details','',q,'pawGuestNotice');tabs.after(note);
 element('summary',tr('Around town today','今日小镇来客'),note);
 element('p',tr('Fictional visitors in '+maps[scene].n[0]+'. Meet them while exploring the district.',''+maps[scene].n[1]+'的虚构来客。逛小镇时可以遇见他们。'),note);
 const roster=mbGuestRoster(scene);
 for(const g of roster){
  const line=element('div','',note,'pawGuestNoticeLine');element('strong',tr(...g.name),line);
  const record=popGuestRecord(g);
  element('small',record?.choices?.length?tr('A memory you share','已有共同回忆'):record?.visits?tr('Met before','曾经见过'):tr('Yet to meet','还未见面'),line)
 }
 if(!roster.length)element('p',tr('A quiet day in this district.','今天这一站很安静。'),note);
 return result
};
const pawGuestNoticeCss=document.createElement('style');pawGuestNoticeCss.textContent='#game #content .pawGuestNotice{border-bottom:1px dashed #b9a27d;margin:0 0 10px;padding:0 5px 8px;color:#514534}#game #content .pawGuestNotice summary{min-height:44px;align-content:center;cursor:pointer;color:#51634e;font-weight:600}#game #content .pawGuestNotice p{font-size:13px;line-height:1.4;margin:5px 0}#game #content .pawGuestNoticeLine{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;padding:5px 0}#game #content .pawGuestNoticeLine small{color:#75634d;font-size:12px}';document.head.append(pawGuestNoticeCss);



/* PAW_GEMINI_VISITORS_BEGIN */
const pawGeminiVisitorRows=[
 [
  "celeb_parody_03_elon_meowsk",
  "island",
  "Elon Meowsk",
  "埃隆·马斯克喵",
  "I just bought your town's vending machine, renamed it 'X-Box', and laid off 80% of the drink buttons for maximum efficiency. You're welcome.",
  "我刚收购了你们镇口的自动贩卖机，把它改名叫‘X’，并裁掉了80%的饮料按钮以实现极致的降本增效。不用谢。",
  "Napping on a park bench isn't slacking—it's first-principles biological hardware optimization. Also, we are colonizing Mars with orange tabbies by Q4.",
  "在长椅上睡觉不叫摸鱼，这叫第一性原理的生物硬件优化。顺便一提，第四季度我们就会送第一批橘猫登陆火星。",
  "Offer a dried fish",
  "递上一条小鱼干",
  "This dried fish has tremendous upside potential. Can I pay you in a volatile meme coin that crashes whenever I tweet?",
  "这条小鱼干具有巨大的上升空间。我能用一种我一发推文就会暴跌的空气币跟你结算吗？"
 ],
 [
  "celeb_parody_05_uncle_rojen",
  "home",
  "Uncle Rojen",
  "罗杰叔叔",
  "Haiyaa! Why you look so stressed? Your boss promise you 'fast-paced learning environment' instead of pay raise? So weak! Put leg down from chair!",
  "哎呀！你怎么一脸苦相？老板给你画‘快速成长空间’的大饼代替涨薪？太弱了！我都气得把脚从凳子上放下来了！",
  "Working unpaid overtime is like draining cooked rice with a colander—you ruin the texture and get nothing out of it. Pure emotional damage!",
  "无偿加班就像用漏勺沥干煮熟的米饭——既毁了口感又捞不到半点好处，纯纯的精神内耗！",
  "Offer a bowl of fried rice",
  "递上一碗炒饭",
  "Fuiyoh! Now this has proper MSG—Make Salary Grow! You know how to treat yourself properly.",
  "哇哦！这才叫真正的味精——‘工资见涨精’！你总算学会怎么善待自己了。"
 ],
 [
  "celeb_parody_06_marie_clutter",
  "island",
  "Marie Clutter-No",
  "近藤麻理不理",
  "Hold this 2016 micro-USB cable in both hands. Ask yourself: does it spark joy, or does it just remind you of your old company laptop?",
  "双手捧起这根2016年的安卓旧数据线，问问自己：它让你心动了吗，还是只会让你想起前公司的破电脑？",
  "I tried to thank my inbox for its service before deleting 4,000 unread newsletters, and then I accidentally archived my own tax filing.",
  "我本来想在清空四千封未读邮件前对收件箱说声‘谢谢你的陪伴’，结果一不小心把自己的年度报税单也一起归档了。",
  "Offer a postcard",
  "送上一张明信片",
  "This sparks immediate joy! Mainly because it doesn't require assembly or a warranty registration form.",
  "这个瞬间就让我心动了！主要是因为它既不用自己动手组装，也不用填繁琐的保修登记表。"
 ],
 [
  "net_culture_01_chope_auntie",
  "home",
  "Tissue-Packet Linda",
  "纸巾占座林阿姨",
  "Excuse me ah, I already put one packet of 3-ply tissue on that park bench. Don't sit—I chope until Thursday afternoon.",
  "不好意思啊，那张长椅我已经放了一包三层抽纸占座了。千万别坐，我一路占到周四下午呢。",
  "Nowadays young people spend $8 on oat milk latte, then complain BTO take forever. Last time we only drink kopi-o kosong and queue outside HDB Hub at 5 AM!",
  "现在年轻人天天买三十多块的燕麦拿铁，转头又抱怨买房排队久。我们当年只喝不加糖的黑咖啡，凌晨五点就去售楼处门口排队了！",
  "Offer a packet of tissues",
  "递上一包纸巾",
  "Wah, so thoughtful! Keep this wet tissue packet—in case you drop curry puff on your office shirt before client presentation.",
  "哇，真懂事！这包湿纸巾你拿着——万一见客户前咖喱角掉在白衬衫上还能救急。"
 ],
 [
  "net_culture_02_moyu_master",
  "island",
  "Brother Moyu",
  "摸鱼宗师小王",
  "Shh! Keep your voice down. I have 42 minutes of pure freedom.",
  "嘘！小点声。我现在拥有整整42分钟的绝对自由。",
  "If you earn $30 an hour and spend 15 minutes every day staring at a stray cat on company time, that's $1,950 a year in feline mental health subsidies.",
  "按时薪两百算，每天带薪发呆看猫十五分钟，一年下来相当于从老板那里合法领取了一万三千块的‘精神抚慰金’。",
  "Offer a snack",
  "送上一包零食",
  "This goes straight into my desk drawer emergency stash, right next to my spare mechanical keyboard.",
  "这东西我直接锁进办公桌最深处的应急抽屉，就放在我的静音机械键盘旁边。"
 ],
 [
  "net_culture_03_mc_king",
  "home",
  "MC King Darren",
  "病假战神达伦",
  "Good morning! Don't tag me on Slack today. Fresh sea breeze is doctor's orders.",
  "早啊！今天千万别在工作群里艾特我。吹海风是医生嘱咐的。",
  "Public holiday on Tuesday means Monday is practically a bridge day. My calendar has other ideas.",
  "周二放假，周一就该拼假嘛。可我的日程表偏偏不这么想。",
  "Offer a cold drink",
  "递上一杯冰饮",
  "Steady lah! Just don't post me on your Instagram story—my manager follows three meme pages and has hawk eyes.",
  "够意思！千万别把我拍进你朋友圈——我直属领导天天视奸朋友圈，眼神比雷达还尖。"
 ],
 [
  "net_culture_04_buzzword_vivi",
  "fortune",
  "Ex-Big-Tech Vivi",
  "大厂毕业薇薇",
  "I quit 996 to heal my nervous system, so today I'm here to build a holistic cat-petting matrix and empower end-to-end dopamine delivery—wait, stop me!",
  "我辞掉996就是为了治愈精神内耗，所以今天我想打通撸猫的底层逻辑，赋能多巴胺的端到端交付——停！快把我的嘴缝上！",
  "My therapist told me to stop treating weekend naps like a Q3 deliverable. I still accidentally made a Gantt chart for my laundry.",
  "心理咨询师劝我别把周末睡懒觉当成第三季度核心KPI来推进，但我洗衣服时还是顺手画了个甘特图。",
  "Offer a little gift",
  "送上一份小礼物",
  "Zero alignment needed. Zero follow-up action items. Just a nice gift. My soul is healing.",
  "不需要对齐颗粒度，不需要输出复盘文档，就是一份纯粹的礼物。我的灵魂正在被治愈。"
 ],
 [
  "net_culture_05_kiasu_kenneth",
  "island",
  "Kiasu Kenneth",
  "怕输肯尼斯",
  "Eh, why nobody queuing here? Never mind, I stand first! Once three cats walk past, confirm got people join behind me, then I feel safe.",
  "哎，这里怎么没人排队？不管了，我先站第一个！只要等下有三只猫路过，肯定就会有人跟在我后面排，那样我才踏实。",
  "I brought three tote bags, two portable power banks, and a foldable stool. What am I waiting for? Don't know, but the discount looks limited!",
  "我带了三个环保袋、两个充电宝外加一把折叠凳。至于在等什么？不知道，但看架势肯定是限量抢购！",
  "Offer a free sample",
  "送上一份免费试吃",
  "Free one ah?! Confirm worth queuing 40 minutes for! Wait—is there a second one if I bring a friend?",
  "免费的啊？！那这四十分钟队排得太值了！等等——如果我拉个朋友一起来，能再领一份吗？"
 ],
 [
  "net_culture_06_void_deck_ahboy",
  "home",
  "Slipper Philosopher Ah Boy",
  "人字拖哲学家阿Boy",
  "Bro, why still wearing lanyard after 7 PM? Take it off lah. Once you step out of MRT gantry, your corporate title expire until tomorrow 9 AM.",
  "兄弟，晚上七点多了还挂着工牌干嘛？快摘了吧。只要走出地铁闸机，你的职场头衔就已经自动过期到明天早上九点了。",
  "Boss shout at you, you just say 'Noted with thanks.' Your CPF still earn interest every month, his hairline recede every week. Fair trade.",
  "老板冲你发火，你只需微笑回复‘收到，感谢指正’。你的公积金每个月照样涨利息，他的发际线可是每周都在后退，这买卖不亏。",
  "Offer a kopi peng",
  "请他喝杯冰咖啡",
  "Swee lah! Come sit on the curb—no KPI, no ERP, just sea wind and cold kopi peng.",
  "漂亮！来路边坐着吹吹海风——这里没有KPI，没有拥堵费，只有晚风和冰镇炼乳咖啡。"
 ],
 [
  "traveller_01_sven_flatpack",
  "island",
  "Sven Lindqvist",
  "斯文·林德奎斯特",
  "Hello. I quit my engineering job in Sweden after a single missing wooden dowel caused a 48-hour family feud. I now travel the world with only one Allen key.",
  "你好。因为在瑞典工作时漏装了一根小木榫引发了长达48小时的家庭冷战，我辞职了。现在我只带一把内六角扳手环游世界。",
  "I inspected your town's wooden pier. The builder used actual metal nails instead of cam-lock screws. Barbaric, yet surprisingly sturdy.",
  "我刚才检查了你们镇上的木栈道。建造者居然用了真铁钉而不是偏心轮螺丝，虽然野蛮，但意外地结实。",
  "Offer a ready-made snack",
  "送上一份现成点心",
  "Remarkable! Not a single cryptic wordless diagram required to enjoy this. I am deeply moved.",
  "太了不起了！享用这个居然不需要看任何一张没有文字的抽象安装说明书，我深受感动。"
 ],
 [
  "traveller_02_claire_auditor",
  "home",
  "Claire Moreau",
  "克莱尔·莫罗",
  "Bonjour. I left corporate tax auditing in Paris to judge pastries purely by emotional crunch—though I still log every receipt into a color-coded spreadsheet.",
  "你好。我辞掉了巴黎的税务审计工作，只为用‘灵魂酥脆度’来评判各地糕点——虽然我还是习惯把每张小票录入分色Excel表格。",
  "Your local convenience store melonpan scored 9.3 out of 10 on flakiness, with zero pretentiousness overhead. Truly tax-deductible joy.",
  "你们便利店的菠萝包在酥脆度上拿到了9.3的高分，而且完全没有溢价泡沫，属于纯纯的‘免税级快乐’。",
  "Offer a pastry",
  "送上一块糕点",
  "How do I categorize a gift of pure kindness in my expense tracker? Under 'Non-Recoverable Soul Assets,' I suppose.",
  "这份纯粹的善意在我的记账软件里该归哪一类呢？大概得算进‘不可折旧的灵魂资产’吧。"
 ],
 [
  "traveller_03_kenji_dispatcher",
  "wonder",
  "Kenji Takahashi",
  "高桥健二",
  "After 38 years managing Tokyo commuter schedules, I retired to slow down. Yet I still instinctively apologize when the ferry arrives 15 seconds early.",
  "在东京管了38年通勤列车时刻表后，我退休想过慢生活。结果渡轮哪怕早到15秒，我还是会条件反射地鞠躬道歉。",
  "Notice how that calico cat sits precisely behind the yellow platform line? Better commuter etiquette than the 8:15 AM Yamanote Line.",
  "看到那只三花猫端端正正坐在黄线后面了吗？它的乘车礼仪比早高峰八点十五分的山手线乘客还要规范。",
  "Offer a warm cup of tea",
  "递上一杯热茶",
  "Punctual, warm, and zero signal delays. Five-star service from Pawradise Station.",
  "准点、温暖、零信号故障。给猫岛车站打五星好评。"
 ],
 [
  "traveller_04_mateo_barista",
  "island",
  "Mateo Vargas",
  "马特奥·巴尔加斯",
  "I travel the globe testing mineral hardness in local tap water for pour-over coffee. Please don't tell anyone I keep 3-in-1 instant sachets in my camera bag.",
  "我环球旅行是为了测试各地自来水的矿物质硬度是否适合手冲咖啡。千万别告诉别人，我相机包里其实藏着三合一速溶咖啡。",
  "Sometimes at 3 PM, you don't want 'washed heirloom beans with bergamot notes.' You just want hot brown sugar water that keeps your eyelids open.",
  "有时候到了下午三点，打工人根本不需要什么‘水洗瑰夏配佛手柑尾韵’，你只想要一杯能撑住眼皮的热甜水。",
  "Offer a cookie",
  "递上一块饼干",
  "This pairs wonderfully with pretending I didn't just drink canned vending-machine coffee behind the shrine.",
  "这东西配着我刚才躲在神社后面偷喝的自动贩卖机罐装咖啡，风味简直绝配。"
 ],
 [
  "traveller_05_priya_actuary",
  "fortune",
  "Priya Nair",
  "普里亚·奈尔",
  "I ran a Monte Carlo risk model across 400 holiday destinations to find the lowest probability of bumping into my London coworkers. Pawradise won by 0.4%.",
  "我用蒙特卡洛风险模型测算了400个度假地，只为找出偶遇伦敦同事概率最低的地方。猫岛以0.4%的微弱优势胜出。",
  "According to my calculations, there is a 94% chance a seagull will steal your snack if you look at a work email on the pier.",
  "根据我的精算模型，如果你在码头边低头回工作邮件，零食被海鸥抢走的概率高达94%。",
  "Offer a snack",
  "送上一份点心",
  "Statistically, spontaneous generosity like this is an outlier—and the exact reason I took two weeks of unpaid leave.",
  "从统计学角度看，这种不求回报的慷慨属于异常值——也正是我请两周无薪假出来散心的原因。"
 ],
 [
  "traveller_06_tomas_lighthouse",
  "home",
  "Tomás Ferreira",
  "托马斯·费雷拉",
  "I spent four years alone on an Atlantic weather station. Frankly, three cats meowing at once here feels a bit like Friday rush hour in Shibuya.",
  "我在大西洋气象浮标站独自待了四年。说实话，你们这儿三只猫同时叫唤的场面，对我来说已经有点像周五晚高峰的涉谷十字路口了。",
  "Barometric pressure is dropping, which means two things: light drizzle by dusk, and a sudden urge to ignore everyone until tomorrow.",
  "气压正在下降，这意味着两件事：黄昏前会有小雨，以及人类会突然产生一种‘明天再回消息’的强烈冲动。",
  "Share a quiet moment",
  "安静地陪他坐一会儿",
  "Quiet company and no small talk about 'what do you do for a living.' You are a true sailor at heart.",
  "安静的陪伴，还不追问‘你是做什么工作的’。你骨子里就是个真正的航海家。"
 ]
];
function pawGeminiGuest(row){
 const [id,world,en,cn,introEn,introZh,idleEn,idleZh,offerEn,offerZh,replyEn,replyZh]=row;
 return {id,world,name:[en,cn],intro:[introEn,introZh],prompt:['A little conversation before we get back to doing nothing?','继续摸鱼之前，聊几句吧？'],choices:[[['Tell me more','再聊聊'],[idleEn,idleZh]],[[offerEn,offerZh],[replyEn,replyZh]]],tip:[idleEn,idleZh],gift:['Visitor postcard: '+en,'来客明信片：'+cn],source:'gemini-modules-01-03'}
}
function pawGeminiMerge(original,rows){
 const ids=new Set(original.map(g=>g.id)),names=new Set(original.map(g=>g.name[0].toLowerCase()));
 const added=[];
 for(const row of rows){
  if(row.length!==12||row.some(v=>typeof v!=='string'||!v.trim())||!['fortune','home','island','wonder'].includes(row[1]))continue;
  const guest=pawGeminiGuest(row);if(ids.has(guest.id)||names.has(guest.name[0].toLowerCase()))continue;
  ids.add(guest.id);names.add(guest.name[0].toLowerCase());added.push(guest)
 }return added
}
/* PAW_GEMINI_VISITORS_END */
// Extend the existing daily fictional roster, not the artwork registry or online presence.
// Offering a gift is a story choice only. No inventory or coins are charged.
popGuestStories.push(...pawGeminiMerge(popGuestStories,pawGeminiVisitorRows));


/* PAW_OWNER_TAROT_CHOICE_BEGIN */
function pawTarotPool(length,random=Math.random){
 const pool=Array.from({length},(_,i)=>i);
 for(let i=pool.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[pool[i],pool[j]]=[pool[j],pool[i]]}
 return pool.slice(0,Math.min(12,pool.length)).map(i=>({i,rev:random()<.5}))
}
function pawTarotPick(pool,chosen,index,count){
 if(!Array.isArray(pool)||!Array.isArray(chosen)||!Number.isInteger(index)||index<0||index>=pool.length||chosen.includes(index)||chosen.length>=count)return null;
 return [...chosen,index]
}
function pawTarotChoiceSlots(portrait){
 const cols=portrait?4:6,rows=12/cols,w=portrait?77:68,h=portrait?111:105,dx=portrait?91:80,dy=portrait?126:125;
 return Array.from({length:cols*rows},(_,i)=>({x:400+(i%cols-(cols-1)/2)*dx,y:portrait?388+Math.floor(i/cols)*dy:420+Math.floor(i/cols)*dy,w,h}))
}
function pawTarotFrameMatches(q,frame,portrait){
 return !!(q&&frame&&q.readStage==='choose'&&q.pawCardPool===frame.pool&&q.pawChoiceFrame===frame&&frame.portrait===portrait)
}
/* PAW_OWNER_TAROT_CHOICE_END */
function pawOpenCardChoice(){
 if(!['tarot','love'].includes(activity))return false;
 state.pawCardPool=pawTarotPool(tarotDeck.length);state.pawChoiceFrame=null;state.pawSelectedCards=[];state.readCards=[];state.readFlip=[];state.readSaved=false;
 state.readStage='choose';state.readAt=t;state.readShuffle=Math.max(1,state.readShuffle||0);
 const n=activity==='tarot'?1:state.readSpreadSize===5?5:3;
 hint(tr('Choose '+n+' '+(n===1?'card':'cards')+' that draw your attention.','凭直觉选 '+n+' 张牌。'),tr('Choose '+n+' cards.','凭直觉选 '+n+' 张牌。'));
 return true
}
function pawSelectTarotCard(index,frame=state.pawChoiceFrame){
 if(!['tarot','love'].includes(activity)||talkOpen||transitioning||document.hidden||!proposal.hidden||$('page').style.display==='block'||!pawTarotFrameMatches(state,frame,W<H))return false;
 const count=activity==='tarot'?1:state.readSpreadSize===5?5:3,chosen=pawTarotPick(state.pawCardPool,state.pawSelectedCards,index,count);
 if(!chosen)return false;
 state.pawSelectedCards=chosen;physicalFx('paper',.65);
 if(chosen.length===count){
  state.readCards=chosen.map(i=>state.pawCardPool[i]);state.readFlip=Array(count).fill(-1);
  state.readStage='deal';state.readAt=t;state.readSaved=false;
  hint('Turn your chosen cards over.','翻开你亲自选的牌。')
 }
 return true
}
const pawSelectStartBefore=start;
start=function(id,...args){
 const result=pawSelectStartBefore(id,...args);
 if(id==='tarot'&&activity==='tarot'){state.tarotTone='gentle';pawOpenCardChoice()}
 return result
};
const pawSelectDealBefore=readingDeal;
readingDeal=function(){
 if(['tarot','love'].includes(activity)&&state.readStage==='deck'&&state.readShuffle)return pawOpenCardChoice();
 return pawSelectDealBefore()
};
const pawSelectDrawBefore=drawActivity;
drawActivity=function(...args){
 if(!['tarot','love'].includes(activity)||state.readStage!=='choose')return pawSelectDrawBefore(...args);
 const count=activity==='tarot'?1:state.readSpreadSize===5?5:3,portrait=W<H,slots=pawTarotChoiceSlots(portrait),chosen=state.pawSelectedCards||[];
 // Keep the displayed pool identity stable across ordinary frames; invalidate
 // old hit callbacks if the deck is reshuffled or the viewport rotates.
 if(!pawTarotFrameMatches(state,state.pawChoiceFrame,portrait))state.pawChoiceFrame={pool:state.pawCardPool,portrait};
 const frame=state.pawChoiceFrame;
 ctx.save();try{
  paintLivingBackdrop(pics.readingInterior||pics.tarot||pics.tea);
  table();
  // Twelve individual face-down cards form a physical spread. No card is
  // assigned to the reading before the player selects it.
  for(const [i,q] of slots.entries()){
   const picked=chosen.includes(i);
   ctx.save();ctx.globalAlpha=picked?.34:1;
   if(picked){round(q.x-q.w/2,q.y-q.h/2,q.w,q.h,5,'#342a45','#bda16c');txt(String(chosen.indexOf(i)+1),q.x,q.y,27,'#eedcb2')}
   else{ctx.shadowColor='#1b152e65';ctx.shadowBlur=4;ctx.shadowOffsetY=3;card(q.x-q.w/2,q.y-q.h/2,q.w,q.h,false)}
   ctx.restore();
   if(!picked)target(q.x-q.w/2-3,q.y-q.h/2-3,q.w+6,q.h+6,()=>pawSelectTarotCard(i,frame),'paw-pick-card-'+i)
  }
  activityFitText(tr('Choose '+count+' '+(count===1?'card':'cards')+' · '+chosen.length+'/'+count,'选 '+count+' 张牌 · '+chosen.length+'/'+count),400,W<H?307:341,22,430,'#f6e6c8');
  if(!chosen.length)label(tr('Shuffle again','重新洗牌'),400,W<H?745:655,()=>{if(!pawTarotFrameMatches(state,frame,W<H)||pawArcadeInputBlocked())return;pawOpenCardChoice();physicalFx('paper',.6)})
 }finally{ctx.restore()}
};
const pawSelectCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(['tarot','love'].includes(activity)&&state.readStage==='choose'){
  const portrait=W<H,bounds=portrait?[215,585,290,780]:[155,645,320,690],top=44,bottom=H-64;
  const [l,r,u,d]=bounds,z=Math.max(.08,Math.min((W-20)/(r-l),(bottom-top)/(d-u)));
  return {s:z,ox:W/2-(l+r)/2*z,oy:(top+bottom)/2-(u+d)/2*z}
 }
 return pawSelectCameraBefore(s,ox,oy)
};
// Table cards rest on the tabletop, not suspended over a furniture drawing.
const pawTablePropBefore=prop;
prop=function(id,x,y){
 if(room==='tarot'&&!activity&&id==='tarot'){
  const spec=groundedStationSpec(room,id);if(spec){
   drawGroundedSupport(spec,x,y);const top=y+spec[1];
   ctx.save();
   for(let i=0;i<7;i++){ctx.save();ctx.translate(x+(i-3)*16,top-9-Math.abs(i-3)*.7);ctx.rotate((i-3)*.065);card(-15,-22,30,44,false);ctx.restore()}
   ctx.restore();pawStationPlaque={room,id,x,y,spec,at:t};return
  }
 }
 return pawTablePropBefore(id,x,y)
};
// One optional text cue in the travel journal, not an always-visible rail CTA.
// The first valley arrival is immediately walkable and uses actual map art.
const pawBeginValleyBefore=beginValleyReveal;
beginValleyReveal=function(...args){
 const result=pawBeginValleyBefore(...args),points=pawDistrictSpines[scene];
 if(points){
  const q=pawDistrictFoot(points,p.x,p.y);Object.assign(p,{x:q.x,y:q.y,tx:q.x,ty:q.y,motionSpeed:0,pawFacing:'up',facing:'up'});cam.x=q.x;cam.y=q.y;
  if(scene==='fortune'){
   // Arrival stays on the foot of the actual map path. No second forced
   // walk or camera pull immediately after the entrance transition.
   p.tx=q.x;p.ty=q.y;
   hint('Explore the shops, or open Explore to find the railway.','逛逛小店，或打开「探索」找到火车站。')
  }
 }
 return result
};
// Arrival image stays fully visible. Room HUD is restored automatically on exit.
const pawOwnerSceneCss=document.createElement('style');pawOwnerSceneCss.textContent=`
#game.pawInRoom #hud,#game.pawInRoom #small,#game.pawInRoom #profileHud,#game.pawInRoom #hudStats{display:none!important}
#game.pawInRoom #dock{display:none!important}
#proposal[data-paw-entrance-step="3"] .gate-traveller{z-index:5!important;height:clamp(78px,19cqh,168px)!important;bottom:max(96px,16%)!important;max-width:27%!important;opacity:1!important}
#proposal[data-paw-entrance-step="3"] .gate-traveller.go{transform:translateY(-55%) scale(.76)!important;opacity:0!important}
#proposal[data-paw-entrance-step="3"]>footer{inset:auto 0 max(18px,env(safe-area-inset-bottom,0px))!important;gap:0!important;padding:0 12px!important}
#proposal[data-paw-entrance-step="3"] .hero:after{background:linear-gradient(180deg,#15291f91 0%,transparent 24%,transparent 76%,#192b22c0 100%)!important}
#proposal[data-paw-entrance-step="3"] .pawGateMotto{display:none}
#game #content.yueCompactConsult .yueCompactHost{background:#e9dbc0!important;color:#3c493c!important;padding:9px 10px!important;border:1px solid #baa47d!important;align-items:center!important}
#game #content.yueCompactConsult .yueCompactHost img{width:84px!important;height:72px!important;max-width:30%!important;object-fit:cover!important;object-position:center!important;mix-blend-mode:normal!important;border-radius:3px!important}
#game #content.yueCompactConsult .yueCompactHost strong,#game #content.yueCompactConsult .yueCompactHost small{color:#394a3c!important}
#game #content.yueCompactConsult :is(.yueSubjectStrip,.destinySubjectStrip){background:#f2e5ca!important;color:#4b4235!important;border-color:#b8a17b!important}
#game #content.yueCompactConsult :is(.yueSubjectStrip,.destinySubjectStrip) :is(button,[role=button]){background:#f9efd8!important;color:#4c4031!important;border:1px solid #aa9069!important;font-weight:600!important;min-height:44px}
#game #content.yueCompactConsult :is(.yueSubjectStrip,.destinySubjectStrip) :is(button,[role=button])[aria-pressed="true"]{background:#435b4c!important;color:#fff5de!important;border-color:#435b4c!important}
#game #content.yueCompactConsult :is(.yueSubjectStrip,.destinySubjectStrip) :is(small,label){color:#524738!important}
#game #content .pawRailWayfinding{min-height:44px!important;background:#51634e!important;color:#fff2d5!important;border:1px solid #bda779!important;padding:8px 12px!important;margin:5px 0!important}
`;document.head.append(pawOwnerSceneCss);


/* PAW_PARK_ARCADE_RELEASE_BEGIN */
function pawMissingStations(entries,visible){return entries.filter(v=>!visible.has(v[0]))}
function pawFishTechnique(elapsed,distance,streak){
 const time=Math.max(.12,Number.isFinite(elapsed)?elapsed:0),movement=Math.max(0,Number.isFinite(distance)?distance:0),speed=movement/time;
 const steady=speed<=105,ideal=time>=.32&&time<=1.35&&steady;
 return {steady,ideal,bonus:ideal?Math.min(4,Math.max(0,streak))*5:0,extraWear:steady?0:Math.min(16,Math.ceil((speed-105)/18))}
}
function pawHerdSlots(){
 return [[206,407,.45],[295,389,.38],[390,411,.45],[506,392,.36],[572,455,.48],[332,473,.52]];
}
/* PAW_HERD_EXCHANGE_BEGIN */
function pawHerdRoster(profiles,offset){
 if(!Array.isArray(profiles)||profiles.length<3)return [];
 const start=((offset%profiles.length)+profiles.length)%profiles.length;
 return pawHerdSlots().map((slot,i)=>({slot:i,profile:profiles[(i+start)%profiles.length],named:i<3,position:slot}))
}
function pawHerdExchangePose(age,stage,oldSlot,newSlot){
 const sec=Math.max(0,Number.isFinite(age)?age:0),leaving=sec<.95,f=Math.max(0,Math.min(1,leaving?sec/.95:(sec-.95)/1.15)),p=f*f*(3-2*f);
 const a=leaving?stage:newSlot,b=leaving?oldSlot:stage;
 return {leg:leaving?'leave':'arrive',x:a.x+(b.x-a.x)*p,y:a.y+(b.y-a.y)*p,scale:a.scale+(b.scale-a.scale)*p,done:sec>=2.1}
}
/* PAW_HERD_EXCHANGE_END */
function pawHerdTemperament(id){
 return id==='koyo'?{en:'Curious and rather pushy. Give Koyo space if it crowds you.',zh:'枫枫好奇又有点急躁，靠得太近时就退一步。',bow:false}:id==='sora'?{en:'Shy. Sora prefers a little distance.',zh:'空空比较怕生，喜欢留一点距离。',bow:false}:{en:'Mugi is calm and often bows back.',zh:'麦麦很温顺，常常会回礼。',bow:true}
}
function pawResidentVisitPool(records,excluded,visit){
 const pool=records.filter(v=>!excluded.includes(v.id));
 if(!pool.length)return [];
 const offset=((visit%pool.length)+pool.length)%pool.length;
 return [...pool.slice(offset),...pool.slice(0,offset)]
}
/* PAW_PARK_ARCADE_RELEASE_END */
// Every room has a real activity directory as a fallback for signs hidden
// by a small screen or physical scene layout. No feature is omitted.
const pawAllLabelsBefore=drawRoom;
drawRoom=function(...args){
 pawVisibleStationLabels.clear();
 const result=pawAllLabelsBefore(...args);
 if(room&&!activity&&!talkOpen&&!transitioning&&proposal.hidden&&$('page').style.display!=='block'){
  const entries=roomGuideEntries(),missing=pawMissingStations(entries,pawVisibleStationLabels);
  roomGuideToggle.dataset.missing=String(missing.length);
  roomGuideToggle.dataset.showDirectory=String(missing.length>0);
  if(missing.length)roomGuideToggle.textContent=tr('Activities · ','体验 · ')+entries.length;
  roomGuideToggle.title=entries.map(v=>tr(v[1],v[2])).join(' · ');
 }
 return result
};
// Physical plaque in the viewport is primary; directory is only shown
// if any room action lacks a visible authored plaque.
const pawActivityDirectoryCss=document.createElement('style');
pawActivityDirectoryCss.textContent=`
#game #pawRoomGuideToggle[data-show-directory="true"]:not([hidden]){position:absolute!important;right:max(12px,env(safe-area-inset-right,0px));top:max(60px,calc(env(safe-area-inset-top,0px) + 60px));width:auto!important;height:auto!important;min-width:44px!important;min-height:44px!important;clip-path:none!important;overflow:visible!important;white-space:normal!important;pointer-events:auto!important;padding:7px 12px!important;background:#594b39f0!important;color:#fff1d4!important;border:1px solid #c9ad7c!important;z-index:10!important}
#game #roomStationGuide.pawGuideOpen{top:max(108px,calc(env(safe-area-inset-top,0px) + 108px));z-index:12!important}
#game .mbPaintedRail>canvas.pawMovingGlass,#proposal .mbPaintedRail>canvas.pawMovingGlass{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;z-index:4!important;opacity:1!important;visibility:visible!important;pointer-events:none!important;transform:none!important}
@media(prefers-reduced-motion:reduce){#game .mbPaintedRail>canvas.pawMovingGlass,#proposal .mbPaintedRail>canvas.pawMovingGlass{display:none!important}}
`;document.head.append(pawActivityDirectoryCss);

// Multiple painted deer, using the already installed independent deer poses.
const pawHerdImages=new Map();
for(const profile of deerProfiles)for(let i=0;i<3;i++){const im=new Image();im.decoding='async';im.src='assets/visual/painted/deer/'+profile.id+'-'+i+'.webp';pawHerdImages.set(profile.id+':'+i,im)}
let pawHerdDrawn=[];
function pawHerdSlotPose(entry){
 const [x,y,sc]=entry.position,im=pawHerdImages.get(entry.profile.id+':0');
 return {x,y,scale:132*sc/(Math.max(1,im?.naturalHeight||240)*townDeerScale)}
}
function pawHerdSelect(entry,run){
 if(activity!=='deerVisit'||state!==run||!entry.named||!['greet','ready','done'].includes(state.deerPhase)||pawArcadeInputBlocked()||entry.profile.id===state.deerProfile.id)return false;
 const old=pawHerdRoster(deerProfiles,state.pawHerdOffset||0).find(v=>v.named&&v.profile.id===state.deerProfile.id);
 if(!old)return false;
 state.pawHerdTravel={old:old.profile,next:entry.profile,from:pawHerdSlotPose(old),to:pawHerdSlotPose(entry),elapsed:0,last:t};
 state.deerPhase='approach';state.deerAt=t;hint('Give them a moment to change places.','给小鹿一点时间，让它们换个位置。');refreshControls();return true
}
function pawHerdTick(){
 const a=state.pawHerdTravel;if(activity!=='deerVisit'||state.deerPhase!=='approach'||!a)return;
 const dt=Math.max(0,Math.min(.05,t-a.last));a.last=t;if(pawArcadeInputBlocked())return;
 a.elapsed+=residentReducedMotion.matches?2.1:dt;
 if(a.elapsed>=.95&&state.deerProfile!==a.next){state.deerProfile=a.next;state.deerBows=pawHerdTemperament(a.next.id).bow}
 if(a.elapsed>=2.1){state.pawHerdTravel=null;state.deerPhase='greet';state.deerAt=t;const q=pawHerdTemperament(state.deerProfile.id);hint(q.en,q.zh);refreshControls()}
}
const pawHerdLayoutBefore=deerStageLayout;
deerStageLayout=function(bow,feed){
 const q=pawHerdLayoutBefore(bow,feed),a=state.pawHerdTravel;
 if(activity==='deerVisit'&&state.deerPhase==='approach'&&a){
  const p=pawHerdExchangePose(a.elapsed,{x:q.deerX,y:q.deerY,scale:q.deerScale},a.from,a.to);
  q.deerX=p.x;q.deerY=p.y;q.deerScale=p.scale;q.lower=0
 }return q
};
const pawHerdDrawBefore=drawActivity;
drawActivity=function(...args){if(activity==='deerVisit')pawHerdTick();return pawHerdDrawBefore(...args)};
const pawHerdBackdropBefore=paintLivingBackdrop;
paintLivingBackdrop=function(...args){
 const result=pawHerdBackdropBefore(...args);
 if(activity!=='deerVisit'||!state.deerProfile)return result;
 const age=Math.max(0,t-(state.pawHerdAt??t)),reduced=residentReducedMotion.matches,run=state;
 pawHerdDrawn=[];
 for(const entry of pawHerdRoster(deerProfiles,state.pawHerdOffset||0)){
  const {slot:i,profile:p,position:[baseX,baseY,sc],named}=entry;
  // The named individual in the foreground must not simultaneously appear in the herd.
  if(named&&p.id===state.deerProfile.id)continue;
  const phase=age*.48+i*1.45,frame=named||reduced?0:Math.sin(phase)>.42?2:Math.sin(phase)<-.6?1:0;
  const x=baseX+(named||reduced?0:Math.sin(phase*.58)*13),y=baseY+(named||reduced?0:Math.sin(phase*.39)*4),height=132*sc,im=pawHerdImages.get(p.id+':'+frame);
  if(!im?.complete||!im.naturalWidth)continue;
  if(named&&townDeerFrame(p,0)){const pose=pawHerdSlotPose(entry);drawMeadowDeer(x,y,p,0,0,pose.scale)}
  else if(!drawResidentRaster(im,x,y,height,i%2?'left':'right'))continue;
  pawHerdDrawn.push({id:named?p.id:'wild-'+i,x,y,named});
  if(named&&['greet','ready','done'].includes(state.deerPhase)){
   const w=Math.max(32,height*.78);
   target(x-w/2,y-height,w,height,()=>pawHerdSelect(entry,run),'paw-deer-'+i)
  }
 }
 return result
};
const pawHerdStartBefore=start;
start=function(id,...args){
 const result=pawHerdStartBefore(id,...args);
 if(id==='deerVisit'&&activity==='deerVisit'){
  state.pawHerdAt=t;state.pawHerdOffset=hash(shrineClock().day+'herd')%deerProfiles.length;
  state.deerBows=pawHerdTemperament(state.deerProfile.id).bow;
  hint('Meet the herd. Tap a deer to visit it, bow, or offer a cracker.','认识鹿群。点一只小鹿，鞠躬或喂鹿饼。')
 }
 if(id==='goldfishScoop'&&state.festivalFish){
  Object.assign(state.festivalFish,{score:0,streak:0,bestStreak:0,travel:0,perfect:0});refreshControls()
 }
 return result
};
const pawHerdFeedBefore=deerFeed;
deerFeed=function(){
 const result=pawHerdFeedBefore();
 if(activity==='deerVisit'&&state.deerPhase==='feed'&&state.deerProfile?.id==='koyo')hint('Koyo is rushing over for a cracker. Keep your space and offer it calmly.','枫枫急着跑来吃鹿饼。留一点距离，平静地递给它。');
 return result
};
// Resident hosts stay at their workplace. Existing illustrated neighbours
// can visit other rooms; their identity art is used only for themselves.
const pawSocialResidents=['auntie-mei','auntie-lin','auntie-hong','wang-laoban','grandma','master-yue','ah-ma','souvenir-keeper','boba-keeper','fortune-teller'];
for(const r of residentArtworkRecords)if(pawSocialResidents.includes(r.id))residentArtworkImage(r);
const pawSocialRoomBefore=pawRoomWalkers;
pawRoomWalkers=function(...args){
 const roster=pawSocialRoomBefore(...args);
 if(!roster.length||activity)return roster;
 const excluded=[...roomResidentActors().map(a=>residentArtworkRecord(a.n)?.id),...pawAmbientIndoor.map(a=>residentArtworkRecord(a.n)?.id),...npc.map(a=>residentArtworkRecord(a.n)?.id)].filter(Boolean);
 const pool=pawResidentVisitPool(residentArtworkRecords.filter(r=>pawSocialResidents.includes(r.id)&&(!r.optional||residentInstalledArt.has(r.id))),excluded,pawVisitSerial);
 for(const [i,a] of roster.entries()){
  // Make the visual identity decision once per visit. Late image loads
  // must never turn a visible generic walker into a different person.
  if(a.identitySettled)continue;a.identitySettled=true;
  if(a.guest||a.visitingResident||a.phase==='gone'||!pool[i])continue;
  const im=residentArtworkImage(pool[i]);
  if(im?.complete&&im.naturalWidth){a.visitingResident=pool[i];a.id='visiting-'+pool[i].id;a.phase='stationary';a.route=[];a.walking=0;a.wait=Number.MAX_SAFE_INTEGER;a.facing=a.x<400?'right':'left'}
 }
 return roster
};
const pawSocialDrawBefore=drawSharedRoomActor;
drawSharedRoomActor=function(a,scale){
 if(a.fictionalVisitor&&a.visitingResident){
  const r=a.visitingResident,im=residentArtworkImage(r),h=94*scale;
  if(drawResidentRaster(im,a.x,a.y,h,a.facing)){
   if(indoorReady()&&Math.hypot(a.x-indoor.x,a.y-indoor.y)<150){
    const w=Math.max(34,h*.62),x=a.x-w/2,y=a.y-h;
    if(!hit.some(z=>z.stationId&&x<z.x+z.w&&x+w>z.x&&y<z.y+z.h&&y+h>z.y)){
     const en=r.names[0],cn=r.names[1]||en;
     target(x,y,w,h,()=>{releaseWalkKeys();joystickReset();indoor.goal=null;indoor.route=[];indoor.tx=indoor.x;indoor.ty=indoor.y;say(tr(en,cn),tr('Even shopkeepers need a little break. I thought I would wander somewhere different today.','开店的人也要休息嘛。今天出来换个地方逛逛。'),[[tr('Enjoy your break','慢慢逛'),closeTalk]])},'paw-neighbour:'+r.id)
    }
   }
   return
  }
 }
 return pawSocialDrawBefore(a,scale)
};

// More satisfying paper-net game: track real scoop distance, timing, net
// wear, points and consecutive catches, while still returning all fish.
const pawFishAimBefore=festivalAim;
festivalAim=function(x,y){
 const g=state.festivalFish,old=g&&{x:g.x,y:g.y},result=pawFishAimBefore(x,y);
 if(g?.phase==='dip'&&old)g.travel=(g.travel||0)+Math.hypot(g.x-old.x,g.y-old.y);
 return result
};
const pawFishDipBefore=festivalDip;
festivalDip=function(...args){
 const g=state.festivalFish,wasAiming=activity==='goldfishScoop'&&g?.phase==='aim';
 const result=pawFishDipBefore(...args);
 if(wasAiming&&state.festivalFish===g&&g.phase==='dip')g.travel=0;
 return result
};
const pawFishOutcomeBefore=festivalFishOutcome;
festivalFishOutcome=function(g,now){
 const result=pawFishOutcomeBefore(g,now);if(!result)return result;
 const quality=pawFishTechnique(now-g.last,g.travel||0,g.streak||0);
 return {...result,wear:Math.min(100,Math.max(4,result.wear+(quality.ideal&&result.caught>=0?-7:0)+quality.extraWear)),quality}
};
const pawFishLiftBefore=festivalLift;
festivalLift=function(...args){
 const g=state.festivalFish;
 if(activity!=='goldfishScoop'||g?.phase!=='dip')return pawFishLiftBefore(...args);
 const at=g.caught.length,elapsed=t-g.last,quality=pawFishTechnique(elapsed,g.travel||0,g.streak||0);
 const result=pawFishLiftBefore(...args);
 if(state.festivalFish!==g||g.phase!=='lift')return result;
 if(g.caught.length>at){
  g.streak=(g.streak||0)+1;g.bestStreak=Math.max(g.bestStreak||0,g.streak);
  const rare=g.caught.at(-1)===4,points=10+(quality.ideal?10:0)+(rare?15:0)+Math.min(3,g.streak-1)*5;
  g.score=(g.score||0)+points;g.perfect=(g.perfect||0)+(quality.ideal?1:0);
  g.feedback=[(quality.ideal?'Perfect scoop! ':'Nice catch! ')+'+'+points+' points. '+(g.streak>1?g.streak+' in a row. ':'')+'Back to the water!',(quality.ideal?'完美捞鱼！':'捞到了！')+' +'+points+' 分。'+(g.streak>1?'连续 '+g.streak+' 次！':'')+'小鱼回水啦！'];
 }else{
  g.streak=0;if(!quality.steady)g.feedback=['Too much swishing! A steady scoop protects the paper.','纸网晃得太厉害啦！稳稳地捞，才不容易破。']
 }
 refreshControls();return result
};
const pawFishScoreControlsBefore=refreshControls;
refreshControls=function(...args){
 const result=pawFishScoreControlsBefore(...args),g=state.festivalFish;
 if(activity==='goldfishScoop'&&g){
  const status=$('gameControls').querySelector('strong');
  if(status)status.textContent=tr('Paper ','纸网 ')+g.paper+'% · '+tr('Fish ','小鱼 ')+g.caught.length+'/5 · '+tr('Score ','得分 ')+(g.score||0);
  if(g.phase==='done')element('small',tr('Best streak: ','最高连捞：')+(g.bestStreak||0)+tr(' · Perfect scoops: ',' · 完美捞鱼：')+(g.perfect||0),$('gameControls'),'pawFishRoundSummary')
 }
 return result
};


/* PAW_PASSERBY_IDENTITY_BEGIN */
function pawAssignPasserbyLooks(ids,player,previous=new Map()){
 const available=[0,1,2,3].filter(i=>i!==player),assigned=new Map(),unique=[...new Set(ids)];
 // Preserve every currently visible person's look before assigning a new arrival.
 for(const id of unique){
  const prior=previous.get(id),at=available.indexOf(prior);
  if(at>=0){assigned.set(id,prior);available.splice(at,1)}
 }
 for(const id of unique){
  if(assigned.has(id))continue;
  if(!available.length)break;
  let h=2166136261;for(const ch of String(id)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}
  assigned.set(id,available.splice((h>>>0)%available.length,1)[0])
 }
 return assigned
}
/* PAW_PASSERBY_IDENTITY_END */
const pawFallbackAppearanceBefore=stableResidentFallback;
let pawPasserbyLookCache={key:'',world:'',map:new Map()};
function pawPasserbyIdentity(n){return String(n.popGuest||n.n?.[0]||'traveller-'+npc.indexOf(n))}
function pawPasserbyLooks(){
 const candidates=npc.filter(n=>n.kind!==2&&!residentArtworkRecord(n.n)&&!n.grumpy),ids=candidates.map(pawPasserbyIdentity);
 const key=scene+'|'+avatar+'|'+ids.join('|');
 if(pawPasserbyLookCache.key!==key){
  const world=scene+'|'+avatar,previous=pawPasserbyLookCache.world===world?pawPasserbyLookCache.map:new Map();
  pawPasserbyLookCache={key,world,map:pawAssignPasserbyLooks(ids,avatar??0,previous)}
 }
 return pawPasserbyLookCache.map
}
stableResidentFallback=function(n){return pawPasserbyLooks().get(pawPasserbyIdentity(n))??pawFallbackAppearanceBefore(n)};
const pawDistinctNPCBefore=initNPC;
initNPC=function(...args){
 const result=pawDistinctNPCBefore(...args);pawPasserbyLookCache={key:'',world:'',map:new Map()};
 const unillustrated=npc.filter(n=>n.kind!==2&&!n.grumpy&&!residentArtworkRecord(n.n));
 const order=[...unillustrated.filter(n=>n.popGuest),...unillustrated.filter(n=>!n.popGuest)];
 const extras=new Set(order.slice(3).filter(n=>!n.popGuest));
 if(extras.size)for(let i=npc.length-1;i>=0;i--)if(extras.has(npc[i]))npc.splice(i,1);
 return result
};


/* PAW_PRESENTATION_REPAIR */
/* PAW_WORLD_ADMISSION_BEGIN */
const pawImageReadiness=new WeakMap();
function pawReadyPicture(im,limit=6500){
 if(!im)return Promise.resolve(false);
 if(pawImageReadiness.has(im))return pawImageReadiness.get(im);
 const task=new Promise(resolve=>{
  let settled=false,decoding=false,timer;
  const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);im.removeEventListener('load',onLoad);im.removeEventListener('error',onError);resolve(value)};
  const onError=()=>finish(false);
  const onLoad=()=>{
   if(!im.naturalWidth||!im.naturalHeight){finish(false);return}
   if(decoding||settled)return;decoding=true;
   if(typeof im.decode==='function')Promise.resolve().then(()=>im.decode()).then(()=>finish(im.naturalWidth>0&&im.naturalHeight>0),onError);
   else finish(true)
  };
  timer=setTimeout(onError,limit);
  im.addEventListener('load',onLoad);im.addEventListener('error',onError);
  if(im.complete){
   if(im.naturalWidth>0)onLoad();
   else if(im.src){const src=im.src;im.removeAttribute('src');im.src=src}
   else onError()
  }
 });
 pawImageReadiness.set(im,task);
 task.then(()=>{if(pawImageReadiness.get(im)===task)pawImageReadiness.delete(im)});
 return task
}
function pawReadyMap(key){
 if(!Object.hasOwn(maps,key))return Promise.resolve(false);
 return pawReadyPicture(key==='fortune'?pics.valleyClean:portraitImages[key])
}
/* PAW_WORLD_ADMISSION_END */
// The original plaque layout owns position and visibility. Do not overwrite it after each frame.
const pawPresentationCSS=document.createElement('style');
pawPresentationCSS.textContent=`
#game #worldSigns .worldSign,#game #worldSigns .doorPlaque{transition:none!important;animation:none!important}
#proposal[data-paw-entrance-step="0"]:not([hidden]){position:absolute!important;inset:0!important;isolation:isolate;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important;overflow:hidden!important;background:#27362f!important}
#proposal[data-paw-entrance-step="0"]>.hero{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;z-index:0!important;overflow:hidden!important;pointer-events:none}
#proposal[data-paw-entrance-step="0"] .pawFirstRailPainting{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important}
#proposal[data-paw-entrance-step="0"] .pawFirstRailPainting img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center}
#proposal[data-paw-entrance-step="0"]>.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#182a247d,transparent 22%,transparent 48%,#172923ec 100%);pointer-events:none}
#proposal[data-paw-entrance-step="0"]>header{z-index:3!important;grid-row:1}
#proposal[data-paw-entrance-step="0"]>footer{z-index:3!important;grid-row:3;position:relative!important;align-self:end!important;justify-self:center!important;width:min(100%,480px)!important;max-width:480px!important;padding:10px 0 max(12px,env(safe-area-inset-bottom,0px))!important;text-shadow:0 1px 5px #18241e}
#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>.hero{min-height:0!important;height:auto!important;max-height:none!important;overflow:hidden!important;padding:8px 0;box-sizing:border-box;display:grid!important;place-items:center!important}
#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"]) .pawEntranceAvatar{height:min(var(--paw-avatar-main,180px),100%)!important;max-height:100%!important;max-width:88%!important;align-self:center!important;justify-self:center!important;object-fit:contain!important}
#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"])>footer{align-self:end!important;min-height:0!important;position:relative!important;transform:none!important;margin:0!important}
@media(max-width:700px) and (orientation:portrait){#proposal:is([data-paw-entrance-step="1"],[data-paw-entrance-step="2"]):not([hidden]){grid-template-rows:auto minmax(150px,1fr) auto!important;overflow-y:auto!important;gap:8px!important}}
`;document.head.append(pawPresentationCSS);
const pawWarmDistricts=async()=>{await pawReadyMap(scene);mbArtLoad();for(const key of Object.keys(maps))if(key!==scene)await pawReadyMap(key)};
if(typeof requestIdleCallback==='function')requestIdleCallback(pawWarmDistricts,{timeout:2000});else setTimeout(pawWarmDistricts,800);


/* PAW_GATE_READINESS: preserve the actual admission callback and wait for
   the real Fortune Valley image before letting the gateway disappear. */
function pawGateFit(w,h){
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return null;
 const height=Math.min(h,w*1.5),width=height/1.5;
 return {width,height,left:(w-width)/2,top:(h-height)/2}
}
function pawGateGround(w,h,progress=0){
 const fit=pawGateFit(w,h);if(!fit)return null;
 const v=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));
 // Ground points traced on the actual 880x1320 gate painting: lower stone
 // paving to the foreground threshold, never the distant vanishing point.
 const x=.50-.012*v,y=.865-.135*v,height=.118-.018*v;
 return {x:fit.left+fit.width*x,y:fit.top+fit.height*y,height:fit.height*height}
}
const pawGateCompositionCSS=document.createElement('style');
pawGateCompositionCSS.textContent=`
#proposal[data-paw-entrance-step="3"]>.hero{background:#293c32!important;container-type:size}
#proposal[data-paw-entrance-step="3"] .mbGatePainting{object-fit:contain!important;object-position:center!important;backdrop-filter:none!important;background:none!important}
#proposal[data-paw-entrance-step="3"] .gate-traveller.pawGateGrounded{position:absolute!important;left:var(--paw-gate-x)!important;top:var(--paw-gate-y)!important;bottom:auto!important;width:auto!important;height:var(--paw-gate-height)!important;max-width:none!important;max-height:none!important;translate:var(--paw-gate-pivot-x,-50%) var(--paw-gate-pivot-y,-100%)!important;transform:none!important;transition:none!important;opacity:1!important;object-fit:contain!important;filter:none!important}
#proposal[data-paw-entrance-step="3"] .gate-traveller.pawGateGrounded.go{transform:none!important;translate:var(--paw-gate-pivot-x,-50%) var(--paw-gate-pivot-y,-100%)!important;opacity:0!important;transition:opacity .18s linear!important}
`;
document.head.append(pawGateCompositionCSS);
function pawGatePlace(hero,traveller,progress=0){
 const ground=pawGateGround(hero.clientWidth,hero.clientHeight,progress);if(!ground)return;
 traveller.classList.add('pawGateGrounded');
 traveller.style.setProperty('--paw-gate-x',ground.x+'px');
 traveller.style.setProperty('--paw-gate-y',ground.y+'px');
 traveller.style.setProperty('--paw-gate-height',ground.height+'px')
}
/* PAW_ITEM1_TRANSIT_BEGIN */
function pawTransitClock(clock,now,active,duration){
 if(!clock||!Number.isFinite(now)||!Number.isFinite(duration)||duration<=0)return 0;
 const dt=Number.isFinite(clock.last)?Math.max(0,Math.min(100,now-clock.last)):0;
 clock.last=now;
 if(active)clock.elapsed=Math.min(duration,(clock.elapsed||0)+dt);
 return (clock.elapsed||0)/duration
}
function pawTransitOwned(view,stage){
 return !!view&&view.stage===stage&&view.connected&&!view.hidden&&!view.proposalHidden
}
// Loading consumes visible, unpaused time only. Once a scenery choice is
// available, keep the journey clock independent of transient image swaps.
function pawFirstRailProgress(run,now,active,artReady,duration){
 const dt=Number.isFinite(run.last)?Math.max(0,Math.min(100,now-run.last)):0;
 if(!active){run.last=null;return 'held'}
 if(!run.artStarted){
  if(!artReady){
   run.last=now;run.loadElapsed=(run.loadElapsed||0)+dt;
   return run.loadElapsed>=5000?'unavailable':'loading'
  }
  run.artStarted=true;run.last=null
 }
 return pawTransitClock(run,now,true,duration)>=1?'arrived':'riding'
}
/* PAW_ITEM1_TRANSIT_END */
async function pawGateWalk(hero,traveller){
 if(!traveller||residentReducedMotion.matches)return true;
 mbArtLoad();const kind=proAvatar??avatar??0,frames=mbArtRegistry.players[kind]?.walk?.up;
 const loaded=frames?.map(mbArtImage),hasFrames=!!loaded?.length&&loaded.every(Boolean);
 // Keep the current art if the matching walk sequence has not been produced.
 // Do not fake walking by sliding a stationary cutout.
 if(!hasFrames)return true;
 return new Promise(resolve=>{
  let done=false,raf=0;const clock={elapsed:0,last:null};
  const finish=ok=>{if(done)return;done=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',onVisibility);resolve(ok)};
  const onVisibility=()=>{clock.last=null;if(document.hidden)finish(false)};
  document.addEventListener('visibilitychange',onVisibility);
  function tick(now){
   if(done)return;
   if(!pawTransitOwned({stage:proStep,connected:traveller.isConnected,hidden:document.hidden,proposalHidden:proposal.hidden},3)){finish(false);return}
   const v=pawTransitClock(clock,now,true,1200),i=Math.min(frames.length-1,Math.floor(v*frames.length*2)%frames.length);
   if(traveller.getAttribute('src')!==frames[i].path)traveller.src=frames[i].path;
   traveller.style.setProperty('--paw-gate-pivot-x',(-100*frames[i].foot[0]/frames[i].width)+'%');
   traveller.style.setProperty('--paw-gate-pivot-y',(-100*frames[i].foot[1]/frames[i].height)+'%');
   pawGatePlace(hero,traveller,v);
   if(v>=1){finish(true);return}raf=requestAnimationFrame(tick)
  }
  raf=requestAnimationFrame(tick)
 })
}
const pawDecodedGateBefore=proRender;
proRender=function(...args){
 const result=pawDecodedGateBefore(...args);
 if(proStep!==3)return result;
 const button=proposal.querySelector('.shrine-enter'),gate=proposal.querySelector('.gate');
 if(!button||typeof button.onclick!=='function')return result;
 const hero=proposal.querySelector('.hero'),traveller=hero?.querySelector('.gate-traveller');
 let waiting=false;
 if(hero&&traveller){
  pawGatePlace(hero,traveller);
  requestAnimationFrame(()=>{if(traveller.isConnected&&!waiting&&!traveller.classList.contains('go'))pawGatePlace(hero,traveller)});
  if(typeof ResizeObserver==='function'){
   const observer=new ResizeObserver(()=>{if(!hero.isConnected){observer.disconnect();return}if(!waiting)pawGatePlace(hero,traveller)});
   observer.observe(hero);
   // Unsubscribe when the onboarding scene is replaced.
   const cleanup=new MutationObserver(()=>{if(!hero.isConnected){observer.disconnect();cleanup.disconnect()}});
   cleanup.observe(proposal,{childList:true,subtree:true})
  }
 }
 const admit=button.onclick;
 const enter=async event=>{
  if(waiting||proBusy||document.hidden||!button.isConnected||proposal.hidden)return;
  waiting=true;const original=button.textContent;
  button.disabled=true;button.textContent=tr('Preparing the path…','正在准备山间小路…');
  const gateArt=hero?.querySelector('.mbGatePainting');
  const [mapReady,gateReady]=await Promise.all([pawReadyMap('fortune'),pawReadyPicture(gateArt)]);
  const ready=mapReady&&gateReady;
  if(!button.isConnected||proStep!==3||proposal.hidden)return;
  if(!ready||document.hidden){waiting=false;button.disabled=false;button.textContent=tr('Try again','再试一次');return}
  const originalSprite=traveller?.getAttribute('src'),originalPivotX=traveller?.style.getPropertyValue('--paw-gate-pivot-x'),originalPivotY=traveller?.style.getPropertyValue('--paw-gate-pivot-y');
  const walked=hero&&traveller?await pawGateWalk(hero,traveller):true;
  if(!button.isConnected||proStep!==3||proposal.hidden)return;
  waiting=false;button.disabled=false;button.textContent=original;
  if(!walked||document.hidden){if(hero&&traveller){if(originalSprite)traveller.src=originalSprite;traveller.style.setProperty('--paw-gate-pivot-x',originalPivotX||'-50%');traveller.style.setProperty('--paw-gate-pivot-y',originalPivotY||'-100%');pawGatePlace(hero,traveller)}return}
  admit.call(button,event)
 };
 button.onclick=enter;if(gate)gate.onclick=enter;return result
};
/* PAW_CURATED_CONTENT_BEGIN: adapted from supplied modules 06–10 and 11–25.
   Every entry is fictional. No actual news is asserted, no new locations
   or currency, and existing topic cooldowns and relationship memory apply. */
const pawFictionNotices=[
 ['monday-buffer',{days:[1]},'Monday buffer zone','周一缓冲区','Please spare tired travellers the weekend interrogation until 11:30. Pastries are an acceptable exception.','上午十一点半前，请勿追问旅人的周末过得如何。带点心来的除外。'],
 ['friday-eve',{days:[4]},'Friday is on its way','周五正在派送','The town has declared Thursday to be Friday eve. Extra pearls are optional; no need to refresh the calendar.','小镇宣布周四正式进入周五前夜。奶茶可以加料，日历不必反复刷新。'],
 ['cat-traffic',{hours:[12,18]},'Sunbeam congestion','阳光区发生拥堵','Several cats have adopted the croissant sleeping position along the garden path. Please give the little pastries some space.','花园石径上，几只猫摆出了同步牛角包睡姿。请给这些小面包留点空间。'],
 ['bench-etiquette',{days:[0,6]},'A note about chope etiquette','长椅占座温馨提醒','One tissue packet does not reserve an entire bench. Neither does an umbrella, a flowerpot or emotional baggage.','一包纸巾占不了整张长椅。雨伞、花盆和精神内耗也不算。'],
 ['sunday-bell',{days:[0],hours:[18,24]},'Tomorrow can wait','明天的事明天再说','The temple bell is ready for anyone whose thoughts have already wandered into Monday.','心思已经跑到周一的旅人，可以来寺里听一声钟。'],
 ['lost-lanyard',{},'Lost and found','失物招领','A blue office lanyard was found near the flowers. The town will not ask awkward questions.','花丛旁捡到一条蓝色工牌挂绳。小镇不会追问尴尬的问题。'],
 ['rain-reading',{weather:'rain'},'A quieter afternoon','下雨天，慢慢来','The tea room has a dry seat and a warm cup for anyone caught in the rain.','淋到雨的话，茶馆里有干爽的座位和一杯热茶。']
];
const pawFictionGazette=[
 ['biscuit','The lighter biscuit tin','饼干铁盒轻量化','A fictional biscuit maker has announced a tin with fewer biscuits and more premium mountain air. Grandma is unimpressed.','某虚构饼干商推出轻量版铁盒：饼干少了，山间空气多了。外婆表示不买账。'],
 ['iced-water','Artisanal water','手冲冰水','A visitor claims clockwise-stirred water tastes more expensive. The tea keeper offers them a normal glass instead.','有旅人坚称顺时针搅拌的水比较高级。茶馆店主递给他一杯普通的水。'],
 ['qr-bun','One bun, three QR codes','一个包子，三个二维码','A fictional food stall has invented a login screen for extra chilli. Grandma has responded by handing over the chilli jar.','某虚构小摊推出加辣登录流程。外婆的回应是把辣椒罐直接递过去。'],
 ['turnip','The rare turnip','隐藏款萝卜','A blind box collector claims a tiny turnip with sunglasses is a rare investment. The souvenir keeper says it is a very nice toy.','有盲盒玩家说戴墨镜的小萝卜很有投资价值。手信店主说，它就是个挺可爱的玩具。'],
 ['kettle','Kettle update','烧水壶正在更新','A traveller missed breakfast because their clever kettle insisted on updating first. The tea room still uses a perfectly ordinary kettle.','有旅人的智能水壶坚持先升级，结果错过了早餐。茶馆依旧用普通水壶。'],
 ['offline','The offline retreat','离线生活实录','A group visiting for a digital detox spent the afternoon filming how offline they were.','一群来戒手机的旅人，花了一整个下午拍摄自己有多离线。'],
 ['auntie-ai','The helpful auntie algorithm','安娣智能助手','A fictional helpdesk answers every question by asking whether the visitor has eaten and brought a cardigan.','某虚构智能助手无论听到什么问题，都先问吃饭了没、外套带了没。'],
 ['queue','A very popular queue','排队本身就是景点','A visitor joined a queue because it looked popular. It turned out to be the queue for the railway ticket office.','有旅人见队伍很长就跟着排，结果发现是火车站售票队。']
];
function pawFictionEdition(now,weather=''){
 const clock=new Date(now+8*3600000);
 if(!Number.isFinite(clock.getTime()))return [];
 const key=clock.toISOString().slice(0,10),weekday=clock.getUTCDay(),hour=clock.getUTCHours(),ordinal=Math.floor(clock.getTime()/86400000);
 const eligible=pawFictionNotices.filter(v=>{
  const r=v[1];return (!r.days||r.days.includes(weekday))&&(!r.hours||hour>=r.hours[0]&&hour<r.hours[1])&&(!r.weather||r.weather===weather)
 });
 const timely=eligible.filter(v=>Object.keys(v[1]).length),pool=timely.length?timely:eligible;
 const n=pool[((ordinal%pool.length)+pool.length)%pool.length],g=pawFictionGazette[((ordinal%pawFictionGazette.length)+pawFictionGazette.length)%pawFictionGazette.length];
 const stamp=Date.parse(key+'T00:00:00+08:00');
 return [
  {id:'fiction-notice-'+key+'-'+n[0],date:stamp,thread:[['Town notice · fictional','小镇公告 · 虚构'],[n[2]+': '+n[4],n[3]+'：'+n[5]],[]]},
  {id:'fiction-gazette-'+key+'-'+g[0],date:stamp,thread:[['Pawradise Gazette · satire','Pawradise 小镇日报 · 讽刺小品'],[g[1]+': '+g[3],g[2]+'：'+g[4]],[]]}
 ]
}
const pawFictionPublishedBefore=townPublishedNotices;
townPublishedNotices=function(now=Date.now()){
 const weather=typeof atmosphere==='object'?atmosphere.weather:'';
 return [...pawFictionEdition(now,weather),...pawFictionPublishedBefore(now)]
};
// Reuse the existing optional, proximity-limited exchange engine.
pawOverheard.push(
 ['gem-title','hong','lin','My nephew has a very impressive new job title.','我外甥最近升职了，头衔特别气派。','Aiyah, ask him whether the salary got promoted too.','哎呀，你倒是问问他的工资升了没有。'],
 ['gem-tarts','grandma','mei','You said you came for one bun. How did you end up with three egg tarts?','不是说只买一个包子吗，怎么还拿了三个蛋挞？','They looked lonely. I had to adopt them.','它们看起来太孤单了，只好全部领养回家。'],
 ['gem-travel-plug','wang','hong','I packed three charging cables and two power banks.','我带了三根充电线和两个充电宝。','Very good. Did you remember the plug?','准备得真齐全。插头呢？'],
 ['gem-queue','mei','lin','Someone spent an hour queuing for a bun today.','今天有人为了一个包子排了一小时。','The bun must have a very good marketing department.','这个包子的宣传部门一定很厉害。'],
 ['gem-cat-translation','lin','hong','A visitor says he can translate everything a cat says.','有位旅人说他听得懂所有猫语。','Then ask why mine wants a different dinner every day.','那请他帮我问问，为什么我家的猫每天都要换菜单。'],
 ['gem-umbrella-price','wang','mei','A visitor suggested raising umbrella prices whenever it rains.','有个旅人建议一下雨就提高雨伞价格。','Tell him the tea room lends them for free.','你告诉他，茶馆免费借伞。']
);
const pawCuratedRemarks={
 hong:[['gem-peach','I heard the vending machine has a secret peach tea. Even the rumour has a waiting list.','听说有台售货机藏着神秘桃茶。连这个传闻都要排队。'],['gem-sunset','Someone took forty-seven photos of the same sunset. Still choosing.','有人拍了四十七张一模一样的夕阳，还在选照片。']],
 lin:[['gem-chope','The tissue packet on the bench is not a land deed.','长椅上的纸巾不是地契。'],['gem-quiet','I came out for fresh air. The gossip was a bonus.','本来出门透透气，没想到还有瓜吃。']],
 mei:[['gem-unplug','A visitor came to switch off their phone. We have not heard a word from them all afternoon. Lovely.','有位旅人说要关手机，整个下午都没看消息。挺好。']],
 grandma:[['gem-cookie','The biscuit tin is getting bigger and the biscuits are getting smaller. I shall bake my own.','饼干盒越来越大，饼干越来越少。我还是自己烤吧。']],
 boba:[['gem-plain-tea','No need to invent a fancy name for water. It is already quite good.','水不用取什么高级名字，解渴就很好。']],
 wang:[['gem-kettle','My clever kettle asked for an update. I asked it for hot water. We are still negotiating.','智能水壶要求更新，我要求热水。双方还在协商。']]
};
for(const [id,lines] of Object.entries(pawCuratedRemarks))pawAmbientLines[id]?.push(...lines);
const pawRelationshipBefore=residentHospitalityWelcome;
residentHospitalityWelcome=function(profile,visits,...args){
 // Existing persisted actual visits, no invented affinity, orders or gifts.
 if(visits===7){
  const lines={mei:['You know where the cups are by now. Make yourself at home.','来这么多次了，杯子放哪儿你都知道啦，别客气。'],lin:['I am beginning to recognise your footsteps.','我现在都快认得你的脚步声了。'],hong:['A familiar face! I have saved the good stories for tea.','熟面孔来啦！好故事都留着喝茶时讲。'],wang:['You have become a regular. That is one title worth having.','你都成常客了，这个头衔才值得拥有。']};
  if(lines[profile.id])return tr(...lines[profile.id])
 }
 if(visits===5&&profile.id==='boba'&&residentRecipeValid(residentHospitality.drink))return tr('I remember your last drink. Shall we make that one again?','上次那杯我还记得，要不要再来一杯？');
 return pawRelationshipBefore(profile,visits,...args)
};
pawTownStories.push({id:'chope-bench',title:['The great tissue-packet debate','纸巾占座之争'],episodes:[
 ['Auntie Lin','林姨','I left one tissue packet on the shady bench. Someone says it only reserves one seat. What a complicated afternoon!','我在阴凉长椅上放了一包纸巾，有人说只能占一个座位。一个下午怎么变得这么复杂！'],
 ['Wang Laoban','王老板','I brought folding stools. The disputed bench has become a tiny tea gathering.','我搬来几把折叠凳，抢座的地方变成了小小茶话会。'],
 ['Auntie Hong','红姐','Four cats took over the bench this morning. Everyone agreed their nap came first.','今天早上四只猫占领了长椅。大家一致同意，猫咪午睡优先。']
]});
/* PAW_CURATED_CONTENT_END */


/* PAW_CURATED_RUNTIME_BEGIN */
const pawGuestWindows={
 'traveller_06_tomas_lighthouse':{every:2,hours:[17,24],weather:'rain'},
 'traveller_03_kenji_dispatcher':{every:4,hours:[6,12]},
 'traveller_04_mateo_barista':{every:3,hours:[7,12]},
 'traveller_05_priya_actuary':{every:3,hours:[12,18]},
 'lady-off':{every:3,hours:[18,24]},
 'jay-conclusion':{every:3,hours:[18,24]}
};
function pawStoryDate(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const ms=Date.parse(value+'T00:00:00Z');
 return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===value?Math.floor(ms/86400000):null
}
function pawGuestEligible(id,date,hour,weather,offset=0){
 const rule=pawGuestWindows[id];if(!rule)return true;
 const n=pawStoryDate(date);
 return n!==null&&Number.isFinite(hour)&&hour>=rule.hours[0]&&hour<rule.hours[1]&&(!rule.weather||rule.weather===weather)&&((n+offset)%rule.every+rule.every)%rule.every===0
}
function pawScheduledGuests(pool,date,hour,weather,offset=0){
 const n=pawStoryDate(date);if(n===null||!Array.isArray(pool)||!pool.length)return [];
 const unique=pool.filter((g,i)=>g&&typeof g.id==='string'&&pool.findIndex(v=>v?.id===g.id)===i);
 const eligible=unique.filter(g=>pawGuestEligible(g.id,date,hour,weather,offset));
 const regular=eligible.filter(g=>!pawGuestWindows[g.id]),base=regular.length?regular:eligible;
 if(!base.length)return [];
 const i=((n+offset)%base.length+base.length)%base.length,first=base[i];
 const rare=eligible.filter(g=>g.id!==first.id&&pawGuestWindows[g.id]);
 const second=rare.length?rare[((n+offset)%rare.length+rare.length)%rare.length]:base[(i+1)%base.length];
 return second&&second.id!==first.id?[first,second]:[first]
}
// Keep continuing identities in their original actor slots even when the
// calendar changes their order. Only truly replaced visitors need to be hidden.
function pawGuestKeepSlots(current,next){
 if(current.length!==next.length||new Set(current).size!==current.length||new Set(next.map(g=>g?.id)).size!==next.length||next.some(g=>!g?.id))return next;
 const byId=new Map(next.map(g=>[g.id,g])),out=current.map(id=>byId.get(id)||null),remaining=next.filter(g=>!current.includes(g.id));
 return out.map(g=>g||remaining.shift())
}
function pawGuestRotationAllowed(current,next,blocked,covered,distances,offscreen){
 if(blocked||current.length!==next.length||current.every((v,i)=>v===next[i]))return false;
 return covered||current.every((v,i)=>v===next[i]||Number.isFinite(distances[i])&&distances[i]>320&&offscreen[i]===true)
}
const pawBenchFirst=['lin','kenneth','share'],pawBenchSecond=['clear','stools'];
function pawBenchRead(raw,today){
 const n=pawStoryDate(today),empty={first:null,firstDay:null,second:null,secondDay:null,endingSeen:false};
 if(n===null||!raw||typeof raw!=='object'||!pawBenchFirst.includes(raw.first))return empty;
 const a=pawStoryDate(raw.firstDay);if(a===null||a>n)return empty;
 const record={...empty,first:raw.first,firstDay:raw.firstDay};
 const b=pawStoryDate(raw.secondDay);
 if(pawBenchSecond.includes(raw.second)&&b!==null&&b>a&&b<=n){record.second=raw.second;record.secondDay=raw.secondDay;record.endingSeen=raw.endingSeen===true&&n>b}
 return record
}
function pawBenchView(raw,today){
 const v=pawBenchRead(raw,today);
 if(!v.first)return {stage:'first',record:v};
 if(!v.second)return {stage:v.firstDay===today?'wait-first':'second',record:v};
 if(v.secondDay===today)return {stage:'wait-second',record:v};
 return {stage:'ending',record:v,ending:v.second==='clear'?'commons':v.first==='share'?'salon':'cats'}
}
function pawBenchChoose(raw,today,choice){
 const v=pawBenchView(raw,today);
 if(v.stage==='first'&&pawBenchFirst.includes(choice))return {...v.record,first:choice,firstDay:today};
 if(v.stage==='second'&&pawBenchSecond.includes(choice))return {...v.record,second:choice,secondDay:today};
 return null
}
function pawReviewedTopic(raw,today,known){
 const now=pawStoryDate(today);
 if(now===null||!Array.isArray(raw)||!Array.isArray(known))return null;
 const valid=raw.filter(v=>{
  if(!v||v.status!=='reviewed'||v.sensitivity!=='everyday'||typeof v.id!=='string'||!/^[-a-z0-9]{1,80}$/.test(v.id)||!known.includes(v.templateId))return false;
  if(typeof v.source!=='string'||!/^https:\/\/[^\s/]+\/[^\s]+$/.test(v.source)||v.source.length>600)return false;
  const p=pawStoryDate(v.publishedOn),r=pawStoryDate(v.reviewedOn),e=pawStoryDate(v.expiresOn);
  return p!==null&&r!==null&&e!==null&&p<=r&&r<=now&&now<e&&e>p&&e-p<=7
 });
 valid.sort((a,b)=>b.reviewedOn.localeCompare(a.reviewedOn)||b.publishedOn.localeCompare(a.publishedOn)||a.id.localeCompare(b.id));
 return valid[0]||null
}
/* PAW_CURATED_RUNTIME_END */


function pawGuestNow(date){
 const clock=shrineClock();if(clock.day!==date)return {hour:12,weather:'clear'};
 refreshAtmosphere();return {hour:clock.hour,weather:atmosphere.weather}
}
const pawRegularGuestBefore=popGuestFor;
popGuestFor=function(world,slot,date=shrineClock().day){
 if(slot!==0&&slot!==1)return pawRegularGuestBefore(world,slot,date);
 const c=pawGuestNow(date);
 return pawScheduledGuests(popGuestPool(world),date,c.hour,c.weather,hash(world))[slot]||null
};
mbGuestSync=function(force=false){
 if(!force&&t-mbGuestCheck<15)return false;mbGuestCheck=t;
 if(mbGuestScene!==scene)return false;
 const today=shrineClock().day,slots=npc.filter(n=>n.popGuest);
 if(!slots.length)return false;
 const planned=slots.map((n,i)=>popGuestFor(scene,i,today));if(planned.some(v=>!v))return false;
 const next=pawGuestKeepSlots(slots.map(n=>n.popGuest),planned);
 const blocked=!!room||!!activity||talkOpen||transitioning||!proposal.hidden,covered=$('page').style.display==='block';
 const d=slots.map(n=>Math.hypot(n.x-p.x,n.y-p.y));
 const offscreen=slots.map(n=>{
  const x=cam.ox+n.x*cam.scale,y=cam.oy+n.y*cam.scale;
  return Number.isFinite(x)&&Number.isFinite(y)&&(x<-130||x>W+130||y<-80||y>H+180)
 });
 if(!pawGuestRotationAllowed(slots.map(v=>v.popGuest),next.map(v=>v.id),blocked,covered,d,offscreen))return false;
 slots.forEach((n,i)=>{if(n.popGuest===next[i].id)return;n.popGuest=next[i].id;n.n=next[i].name;n.pathReady=false;n.pauseUntil=t+1; pawGaitTravel.set(n,0);pawResidentFootMotion.set(n,false)});mbGuestDate=today;return true
};
pawRoomGuestProfile=function(visit){
 const today=shrineClock().day,c=pawGuestNow(today),active=npc.filter(n=>n.popGuest).map(n=>n.popGuest);
 const pool=pawGuestRoomCandidates(popGuestStories,active,scene,g=>pawGuestEligible(g.id,today,c.hour,c.weather,hash(scene))&&!!pawGuestArt(g));
 return pool.length?pool[visit%pool.length]:null
};
// A three-visit story uses the existing featured Town Hall note, not a new menu.
const pawBenchKey='pawBenchStoryV1';
const pawBenchCopy={
 first:{body:['Auntie Lin left a tissue packet on the shaded bench. Kenneth insists it only reserves one seat. Both want your verdict.','林姨在阴凉长椅上放了一包纸巾，肯尼斯坚持说只能占一个位。两人都等你来评理。'],choices:[['lin','The whole bench is choped.','整张长椅都算占好了。'],['kenneth','One packet, one seat.','一包纸巾只占一个位。'],['share','Share morning shade and afternoon breeze.','上午乘凉、下午吹风，分时共享。']]},
 'wait-first':{body:['The debate has adjourned. Come back another day to see what happens.','争论暂时休庭。改天再来看看后续吧。']},
 second:{body:['The bench now has six tissue packets, an umbrella and a thermos guarding it. Three tired travellers have nowhere to sit.','长椅现在摆了六包纸巾、一把伞和一个保温杯，三位累坏的旅人却无处落座。'],choices:[['clear','Clear the props and invite the travellers to sit.','收起道具，请旅人先坐。'],['stools','Borrow folding stools from Wang Laoban.','找王老板借几把折叠凳。']]},
 'wait-second':{body:['The neighbours are working on your suggestion. The next chapter is for another day.','街坊们正在商量你的提议。下一集改天再看。']},
 commons:{body:['Lin and Kenneth apologise for turning rest into a competition. Their spare tissue packets become a free public supply.','林姨和肯尼斯为把休息搞成比赛道歉，多余的纸巾也变成了免费便民用品。']},
 salon:{body:['The shared bench and extra stools have become a little tea salon. Lin brings fruit and Kenneth tells visitors where there is no queue.','分时共享的长椅加上折叠凳，成了小茶会。林姨切水果，肯尼斯负责分享哪里不用排队。']},
 cats:{body:['Four cats occupy the whole bench. Lin and Kenneth silently agree that the sleeping cats outrank everyone.','四只猫咪横躺整张长椅。林姨和肯尼斯默默达成共识：睡觉的猫咪优先。']}
};
function pawRenderBench(note){
 if(!note?.isConnected)return;
 const today=shrineClock().day,view=pawBenchView(load(pawBenchKey,null),today);
 const copy=pawBenchCopy[view.ending||view.stage];if(!copy)return;
 note.replaceChildren();
 element('small',tr('Resident story · fictional town','居民小故事 · 虚构小镇'),note,'pawStoryKicker');
 element('h2',tr('The great tissue-packet debate','纸巾占座之争'),note);
 const chapter=view.stage==='first'?1:view.stage==='ending'||view.stage==='wait-second'?3:2;
 element('small',tr('Chapter ','第 ')+chapter+' / 3',note,'pawStoryPart');
 element('p',tr(...copy.body),note,'pawStoryVoice');
 if(copy.choices){
  const controls=element('div','',note,'pawBenchChoices');
  for(const [id,en,cn] of copy.choices)b(controls,tr(en,cn),()=>{
   const currentDay=shrineClock().day,next=pawBenchChoose(load(pawBenchKey,null),currentDay,id);
   if(next)save(pawBenchKey,next);pawRenderBench(note)
  });
 }
 if(view.stage==='ending'&&!view.record.endingSeen)save(pawBenchKey,{...view.record,endingSeen:true});
}
const pawBenchBoardBefore=townChatPage;
townChatPage=function(...args){
 const result=pawBenchBoardBefore(...args);
 if(communityTab!=='board')return result;
 const note=$('content').querySelector('.pawTownStoryNote');if(!note)return result;
 const today=shrineClock().day,view=pawBenchView(load(pawBenchKey,null),today),featured=pawTownStoryToday()?.story?.id==='chope-bench';
 const active=!!view.record.first&&!view.record.endingSeen;
 if(active||featured){pawRenderBench(note);return result}
 if(!view.record.first){
  const link=b(note,tr('Hear the bench dispute','听听长椅占座的瓜'),()=>pawRenderBench(note));link.className='pawBenchLink'
 }
 return result
};
const pawBenchCss=document.createElement('style');pawBenchCss.textContent='#content .pawBenchChoices{display:grid;gap:6px;margin-top:8px}#content .pawBenchChoices button{min-height:44px!important;text-align:left!important;white-space:normal!important;background:#e8d7b5!important;color:#3e4d3c!important;border:1px solid #b6a17f!important;font:14px/1.35 Georgia,"Songti SC",serif!important}#content .pawBenchLink{min-height:44px;color:#52694d;background:transparent;border:0;text-decoration:underline;text-underline-offset:3px}';document.head.append(pawBenchCss);
// Only reviewed, bounded-duration source metadata can select a prewritten
// fictional joke. Never display the source, publisher headline, or article.
let pawReviewedTopicFeed=[],pawTopicFetchAt=0,pawTopicFetchPending=false;
function pawRefreshTopicFeed(){
 const now=Date.now();
 if(pawTopicFetchPending||now-pawTopicFetchAt<600000)return;
 pawTopicFetchPending=true;pawTopicFetchAt=now;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3000);
 fetch('assets/content/pawradise-topical.json',{cache:'no-cache',credentials:'same-origin',signal:controller.signal})
  .then(r=>r.ok?r.json():null).then(v=>{if(v?.version===1&&Array.isArray(v.entries)&&v.entries.length<=50)pawReviewedTopicFeed=v.entries})
  .catch(()=>{}).finally(()=>{clearTimeout(timeout);pawTopicFetchPending=false})
}
const pawEvergreenEdition=pawFictionEdition;
pawFictionEdition=function(now,weather=''){
 const entries=pawEvergreenEdition(now,weather);if(entries.length!==2)return entries;
 const today=new Date(now+8*3600000).toISOString().slice(0,10),topic=pawReviewedTopic(pawReviewedTopicFeed,today,pawFictionGazette.map(v=>v[0]));
 if(topic){
  const g=pawFictionGazette.find(v=>v[0]===topic.templateId);
  entries[1]={id:'topic-fiction-'+today+'-'+topic.id,date:entries[1].date,thread:[['Pawradise Gazette · topical satire','Pawradise 小镇日报 · 时事讽刺小品'],[g[1]+': '+g[3],g[2]+'：'+g[4]],[]]}
 }
 return entries
};
const pawTopicBoardBefore=townChatPage;
townChatPage=function(...args){if(communityTab==='board')pawRefreshTopicFeed();return pawTopicBoardBefore(...args)};
if(typeof requestIdleCallback==='function')requestIdleCallback(pawRefreshTopicFeed,{timeout:3500});else setTimeout(pawRefreshTopicFeed,1800);

/* PAW_GUEST_PERSONALITY_BEGIN */
// Authored bilingual variants for the fifteen imported characters. Visit count
// and choice indices remain compatible with the existing guest journal.
const pawGuestPersonalityRows=[
 [
  "celeb_parody_03_elon_meowsk",
  "grand plans; fast speech; checks imaginary dashboard",
  [
   "Pitch me a vending machine upgrade",
   "说说你的售货机改造计划"
  ],
  [
   "Wang refused my subscription model. Apparently hot water is already a feature.",
   "王老板拒绝了我的订阅制。原来热水本身就是个功能。"
  ],
  [
   "I scheduled a nap for Q4. The nap has already missed its deadline.",
   "我把午睡排在第四季度，结果午睡也延期了。"
  ],
  [
   "The cats rejected my five-year plan by sitting on it.",
   "猫咪们直接坐在我的五年计划上，以示反对。"
  ],
  [
   "I came to test a silent mode. Nobody here needs my push notifications.",
   "我来测试静音模式。这里没人需要我的推送通知。"
  ]
 ],
 [
  "celeb_parody_05_uncle_rojen",
  "expressive; scrutinises food; loves kitchen gossip",
  [
   "Ask about fried rice",
   "请教炒饭秘诀"
  ],
  [
   "Grandma's wok has better uptime than the office server.",
   "奶奶的炒锅比公司的服务器还稳定。"
  ],
  [
   "If your boss says one more quick call, add one more egg. At least dinner improves.",
   "老板每说一次开个短会，你就多加一个蛋，至少晚饭有进步。"
  ],
  [
   "I inspected the rice. No spreadsheet required, just taste.",
   "我检查过米饭了。不用表格，尝一口就知道。"
  ],
  [
   "Even my imaginary rice cooker knows when to stop working.",
   "连我家的虚构电饭锅都知道什么时候下班。"
  ]
 ],
 [
  "celeb_parody_06_marie_clutter",
  "gentle; pauses to consider objects; tidy without pressure",
  [
   "Ask which keepsake to keep",
   "问问哪件纪念品值得留下"
  ],
  [
   "Keep the postcard that reminds you of today. The other nine can wait.",
   "留下让你想起今天的明信片吧，另外九张不急。"
  ],
  [
   "The bench has no drawers. How refreshing.",
   "这张长椅居然没有抽屉，真清爽。"
  ],
  [
   "I tried sorting my worries. They refused to fit into categories.",
   "我试着给烦恼分类，结果它们全不配合。"
  ],
  [
   "The best empty shelf is one you do not immediately have to fill.",
   "空出来的架子，不一定要立刻塞满。"
  ]
 ],
 [
  "net_culture_01_chope_auntie",
  "practical; sharp observer; protective of shared seats",
  [
   "Ask about bench etiquette",
   "问问长椅的占座规矩"
  ],
  [
   "Kenneth brought three tissue packets. I told him this is a bench, not an auction.",
   "肯尼斯带了三包纸巾。我跟他说，这是长椅，不是拍卖会。"
  ],
  [
   "I saved a seat for Grandma, not for my entire extended family.",
   "我给奶奶留了个座，不是给全家族包场。"
  ],
  [
   "Someone choped the shady seat with a receipt. At least use a clean tissue lah.",
   "有人拿小票占阴凉座，至少用包干净纸巾嘛。"
  ],
  [
   "Today I share the shade. Tomorrow we can negotiate the breeze.",
   "今天一起乘凉，明天再商量风归谁。"
  ]
 ],
 [
  "net_culture_02_moyu_master",
  "unhurried; dry wit; quietly watches the water",
  [
   "Learn a genuine rest technique",
   "请教真正的休息秘诀"
  ],
  [
   "My productivity trick is to stop calling every minute productive.",
   "我的效率秘诀就是别把每一分钟都叫做生产力。"
  ],
  [
   "Ah Boy and I held a meeting. Agenda: clouds. We finished early.",
   "我和阿Boy开了个会，议题是看云，提前散会。"
  ],
  [
   "I left my notifications on silent. The world continued, surprisingly.",
   "我把通知调成静音，没想到世界照常运转。"
  ],
  [
   "A good break does not need a certificate.",
   "摸鱼摸得好，不需要颁发证书。"
  ]
 ],
 [
  "net_culture_03_mc_king",
  "dramatic; exaggerated complaints; enjoys actual quiet",
  [
   "Ask how the recovery day is going",
   "问问休息日过得怎样"
  ],
  [
   "I have been diagnosed with chronic meeting fatigue. Rest is today's plan.",
   "我得了慢性会议疲劳症。今天的计划就是休息。"
  ],
  [
   "Grandma gave me soup. It did more than my calendar reminders.",
   "奶奶给我盛了碗汤，比日历提醒管用多了。"
  ],
  [
   "My out-of-office message is working harder than I am.",
   "我的离岗自动回复比我还勤奋。"
  ],
  [
   "Today I am genuinely resting. Please do not make it a group activity.",
   "今天是真的休息，请不要组织成团建。"
  ]
 ],
 [
  "net_culture_04_buzzword_vivi",
  "quick talker; catches own jargon; secretly enjoys plain language",
  [
   "Translate one office buzzword",
   "翻译一个职场黑话"
  ],
  [
   "Master Yue told me to circle back to the present moment. Fair enough.",
   "月师傅让我闭环到当下，倒也有道理。"
  ],
  [
   "I tried to align the incense with my quarterly objectives. The keeper just smiled.",
   "我想让香火和季度目标对齐，庙祝只是笑笑。"
  ],
  [
   "My new KPI is a warm cup of tea. No dashboard.",
   "我的新KPI是一杯热茶，不用仪表盘。"
  ],
  [
   "I have retired the phrase 'quick sync' for the afternoon.",
   "今天下午，‘快速对齐一下’这句话正式退休。"
  ]
 ],
 [
  "net_culture_05_kiasu_kenneth",
  "energetic; calculates queues; eventually laughs at himself",
  [
   "Ask where the shortest queue is",
   "打听哪边排队最短"
  ],
  [
   "Linda said the bench is free. I still calculated the opportunity cost.",
   "林阿姨说长椅免费，我还是算了下机会成本。"
  ],
  [
   "I arrived early for sunset. The sun did not appreciate my punctuality.",
   "我提前来等日落，太阳并没有表扬我准时。"
  ],
  [
   "I have a backup snack for my backup snack. Want one?",
   "我的备用零食还有备用零食，来一份吗？"
  ],
  [
   "Today I let someone go first. Nothing terrible happened.",
   "今天我让别人先走，居然什么坏事都没发生。"
  ]
 ],
 [
  "net_culture_06_void_deck_ahboy",
  "laid back; short observations; enjoys kopi and neighbours",
  [
   "Ask for void deck wisdom",
   "请教楼下凉亭的人生智慧"
  ],
  [
   "Moyu says nothing is urgent. I say the kopi is getting warm.",
   "摸鱼宗师说什么都不急，我说冰咖啡快变温了。"
  ],
  [
   "The cat sits wherever it wants. That is genuine seniority.",
   "猫想坐哪里就坐哪里，这才是真正的资历。"
  ],
  [
   "Some people bring work to the park. I bring slippers.",
   "有人把工作带到公园，我只带拖鞋。"
  ],
  [
   "If you cannot solve it today, at least finish your drink before the ice melts.",
   "今天解决不了的事，至少先在冰化之前把咖啡喝完。"
  ]
 ],
 [
  "traveller_01_sven_flatpack",
  "precise; inventive; amused by assembly instructions",
  [
   "Ask about his portable stool",
   "问问他的便携折叠凳"
  ],
  [
   "Wang lent me a stool. It had zero missing screws. A miracle.",
   "王老板借我一把凳子，一颗螺丝都没少，奇迹。"
  ],
  [
   "I built a shelf for my holiday souvenirs. Now the shelf needs a holiday.",
   "我给旅行纪念品搭了个架子，现在架子也需要放假。"
  ],
  [
   "The pier came fully assembled. My favourite kind of architecture.",
   "码头居然不用自己组装，是我最喜欢的建筑。"
  ],
  [
   "I packed one screwdriver. It is having a very peaceful vacation.",
   "我带了一把螺丝刀，它度过了一个相当清闲的假期。"
  ]
 ],
 [
  "traveller_02_claire_auditor",
  "observant; measured; notices small details",
  [
   "Ask about her bakery inspection",
   "问问她的糕点检查"
  ],
  [
   "Grandma's pastry accounts balance perfectly: one made, one eaten.",
   "奶奶的糕点账目完全平衡：做一块，吃一块。"
  ],
  [
   "I checked my holiday itinerary and removed three unnecessary appointments.",
   "我核对了度假行程，删掉了三个没必要的预约。"
  ],
  [
   "A cup of tea is the only receipt I need today.",
   "今天只需要一张热茶的收据。"
  ],
  [
   "The audit is complete. The town has an excellent surplus of calm.",
   "审计结束：小镇的宁静储备十分充足。"
  ]
 ],
 [
  "traveller_03_kenji_dispatcher",
  "punctual; soft spoken; attentive to trains",
  [
   "Ask about the next train",
   "问问下一班列车"
  ],
  [
   "I told the station attendant I am off duty. We watched a train leave without checking our watches.",
   "我告诉站务员今天休假，然后一起不看表地目送列车离站。"
  ],
  [
   "I like hearing the tracks settle after the last carriage passes.",
   "我喜欢末节车厢经过后，轨道慢慢安静下来的声音。"
  ],
  [
   "A timetable helps you arrive. It need not tell you how to enjoy the day.",
   "时刻表帮你到达，却不用规定你怎么享受一天。"
  ],
  [
   "The morning light is worth missing one train for.",
   "为了清晨的光线，错过一班列车也值得。"
  ]
 ],
 [
  "traveller_04_mateo_barista",
  "warm; curious about aromas; enjoys small rituals",
  [
   "Ask which coffee suits a slow morning",
   "问问慢悠悠的早晨适合喝什么咖啡"
  ],
  [
   "I asked the tea keeper about roasting leaves. We traded notes for half an hour.",
   "我向茶馆老板请教烘茶，交流心得聊了半小时。"
  ],
  [
   "The best coffee aroma is the one you have time to notice.",
   "最好的咖啡香，是你有空认真闻的那一杯。"
  ],
  [
   "I drew a leaf in my cup. The next one looked like a potato. Both tasted fine.",
   "我在杯里拉了一片叶子，下一杯像土豆。两杯都好喝。"
  ],
  [
   "No rush today. Let the first sip be a small ceremony.",
   "今天不赶时间，让第一口成为小小的仪式。"
  ]
 ],
 [
  "traveller_05_priya_actuary",
  "analytical; affectionate dry humour; likes probability puzzles",
  [
   "Ask about the odds of a good afternoon",
   "问问下午过得开心的概率"
  ],
  [
   "Master Yue and I agree that uncertainty is not a reason to skip lunch.",
   "月师傅和我一致认为，未来不确定不是不吃午饭的理由。"
  ],
  [
   "I calculated the expected value of a nap. Extremely favourable.",
   "我算过午睡的期望收益，十分可观。"
  ],
  [
   "A fortune slip is a reflection, not a statistically valid forecast.",
   "签文适合用来反思，不是统计上有效的预测。"
  ],
  [
   "My holiday risk register now has one entry: forgetting to relax.",
   "我的假期风险清单只剩一项：忘记放松。"
  ]
 ],
 [
  "traveller_06_tomas_lighthouse",
  "quiet; watches weather; comfortable with silence",
  [
   "Ask about a rainy evening at sea",
   "问问海上雨夜的故事"
  ],
  [
   "I told Grandma a fog story. She put another cup of tea on the table.",
   "我给奶奶讲了个雾夜的故事，她又端了一杯茶。"
  ],
  [
   "A rainy window is sometimes a better view than a clear horizon.",
   "有时雨水滑过的窗，比晴朗的地平线更好看。"
  ],
  [
   "I used to listen for the foghorn. Here I listen for the kettle.",
   "以前我听雾笛，在这里我听烧水壶。"
  ],
  [
   "You need not fill every silence. Some are very good company.",
   "不是每段沉默都要填满，有些沉默本身就是陪伴。"
  ]
 ]
];
pawGuestPersonalityRows.push(...[
 [
  "jay-conclusion",
  "soft-spoken; taps rhythms; observes rain",
  [
   "Rain on my keyboard",
   "键盘上的雨"
  ],
  [
   "The keeper rang the bell in perfect time. My inbox could learn from him.",
   "庙祝敲钟很有节奏感，我的邮箱该学学。"
  ],
  [
   "I heard a koi splash and accidentally wrote a chorus.",
   "听见锦鲤扑通一声，莫名其妙写了段副歌。"
  ],
  [
   "My notebook has twelve unfinished songs and one very finished lunch order.",
   "笔记本里有十二首没写完的歌，还有一份写得很完整的午餐订单。"
  ],
  [
   "The garden sounds lovely before anyone starts asking for an encore.",
   "没人喊返场的时候，花园的声音就很好听。"
  ]
 ],
 [
  "jj-leave",
  "cheerful; hums quietly; plans small outings",
  [
   "Annual leave world tour",
   "年假世界巡演"
  ],
  [
   "The train whistle hit a note I have been practising all week.",
   "火车鸣笛那个音，我练了整整一星期。"
  ],
  [
   "Master Yue said my schedule needed breathing room. Finally, vocal advice I can use.",
   "月师傅说我的日程需要喘口气。这条声乐建议倒是很实用。"
  ],
  [
   "I am practising saying no in three different keys.",
   "我正在练习用三个不同的调说不。"
  ],
  [
   "Today my only encore is another cup of tea.",
   "今天唯一的返场，就是再喝一杯茶。"
  ]
 ],
 [
  "andy-leisure",
  "courteous; deliberate stride; notices tired travellers",
  [
   "A nap on the scenic train",
   "观景列车上睡午觉"
  ],
  [
   "I helped the keeper straighten a mat. No cameras, very satisfying.",
   "帮庙祝摆正了垫子，没人拍照，反而很满足。"
  ],
  [
   "I used to rehearse every entrance. Now I am learning to leave on time.",
   "以前每次出场都要排练，现在正在学习准时退场。"
  ],
  [
   "My most difficult role is a man who finishes lunch before checking his phone.",
   "最难演的角色，是一个吃完午饭才看手机的人。"
  ],
  [
   "The station bench deserves a thank-you speech of its own.",
   "车站那张长椅，值得一段专属感谢词。"
  ]
 ],
 [
  "lady-off",
  "regal; dry wit; treats daily life as court ceremony",
  [
   "Send the eunuch",
   "派总管公公代劳"
  ],
  [
   "Auntie Mei has granted me a private audience with a pot of tea.",
   "梅姨准许本宫与一壶茶单独觐见。"
  ],
  [
   "The imperial calendar is full. I hereby declare an empty afternoon.",
   "御用日程已满，本宫特赐今日午后空白。"
  ],
  [
   "I have dismissed the court messenger. The cats may remain.",
   "传旨的人已被本宫遣退，猫咪可以留下。"
  ],
  [
   "No petition shall be read until the pastries are served.",
   "点心未上，奏折一律不阅。"
  ]
 ],
 [
  "taylor-shift",
  "wry; collects fragments of stories; listens before speaking",
  [
   "My calendar and I are taking a break",
   "我和日程表暂时分开"
  ],
  [
   "Auntie Hong heard my new title and immediately suggested three more verses.",
   "红姐听了我的新歌名，立刻贡献了三段歌词。"
  ],
  [
   "My notebook has an entire page titled Things I No Longer Need to Explain.",
   "笔记本有一整页叫作《不必再解释的事》。"
  ],
  [
   "I wrote down the sound of rain. It did not need a bridge.",
   "我记下雨声，发现它根本不需要过渡段。"
  ],
  [
   "The tea has gone cold because I forgot to look at the clock. A small victory.",
   "因为忘了看时间，茶都凉了。小小的胜利。"
  ]
 ],
 [
  "dilitea",
  "playful; discreet; enjoys tea and candid moments",
  [
   "No comment, extra pearls",
   "无可奉告，多加珍珠"
  ],
  [
   "Hong asked who I was meeting. I introduced her to my second cup of tea.",
   "红姐问我和谁约会，我把第二杯茶介绍给了她。"
  ],
  [
   "I ordered less ice and more peace. The shop understood half of that.",
   "我点了少冰多清净，店家听懂了一半。"
  ],
  [
   "The only filter I need today is the tea strainer.",
   "今天唯一需要的滤镜，就是茶滤。"
  ],
  [
   "A cat walked into my photo. Much better composition.",
   "一只猫闯进照片，构图突然高级了。"
  ]
 ],
 [
  "gordon-ramen",
  "energetic; precise about food; respects careful cooks",
  [
   "A pinch of salt",
   "一撮盐"
  ],
  [
   "Grandma and I agreed on one rule: taste first, argue later.",
   "我和外婆达成共识：先尝味道，再争论。"
  ],
  [
   "The noodles need room to breathe. So do the people waiting for them.",
   "面条需要空间，等面条的人也一样。"
  ],
  [
   "I timed the broth, not the person eating it.",
   "我给熬汤计时，不给吃饭的人计时。"
  ],
  [
   "The best compliment today is an empty bowl.",
   "今天最好的赞美，是一只空碗。"
  ]
 ],
 [
  "jackie-cant",
  "lively; observant; careful about safety",
  [
   "Rush home hour",
   "下班时刻"
  ],
  [
   "I tried the arcade. The machine beat me fairly, which is refreshing.",
   "我去玩了街机，机器光明正大赢了我，倒挺痛快。"
  ],
  [
   "My toughest stunt today was carrying tea without spilling it.",
   "今天最难的特技，是端茶不洒。"
  ],
  [
   "I gave way to a deer. It had a much better sense of direction.",
   "我给一只鹿让了路，它方向感比我好多了。"
  ],
  [
   "No stunt double needed for sitting quietly. I checked.",
   "安安静静坐一会儿，不需要替身，我确认过了。"
  ]
 ],
 [
  "eason-rest",
  "melancholy humour; hums between remarks; enjoys ordinary pleasures",
  [
   "One more pearl",
   "再来一颗珍珠"
  ],
  [
   "Mateo says the coffee has notes of chocolate. Mine has notes of Monday.",
   "马特奥说咖啡有巧克力风味，我这杯倒有周一的味道。"
  ],
  [
   "I found a song in the sound of the kettle. It was shorter than my commute.",
   "我在烧水声里找到一首歌，比通勤时间短多了。"
  ],
  [
   "Some afternoons do not need a dramatic chorus.",
   "有些下午，不需要轰轰烈烈的副歌。"
  ],
  [
   "I have decided that a quiet Friday deserves its own little melody.",
   "我决定，安静的周五也值得一小段旋律。"
  ]
 ],
 [
  "raincheck",
  "reflective; slow deliberate speech; notices light and weather",
  [
   "Two strangers share a coffee",
   "两个陌生人喝咖啡"
  ],
  [
   "Kenji told me when the train would arrive. I was more interested in the light on the platform.",
   "健二告诉我列车到站时间，我却更在意站台上的光。"
  ],
  [
   "A cup left on the windowsill tells a surprisingly complete story.",
   "窗台上一只没收走的杯子，居然能讲完一个故事。"
  ],
  [
   "The rain stopped before I finished my sentence. A very good edit.",
   "我话还没说完，雨先停了。剪辑得不错。"
  ],
  [
   "Today the ending can wait. The afternoon is still happening.",
   "今天结局可以慢一点，下午还没过完呢。"
  ]
 ],
 [
  "kpop-lunch",
  "upbeat ensemble; playful coordination; respects breaks",
  [
   "The Out of Officers",
   "离线打工人"
  ],
  [
   "The tea keeper asked for our formation. We formed a very orderly queue.",
   "茶馆老板问我们的队形，我们排成了一条非常整齐的队伍。"
  ],
  [
   "We rehearsed our greeting and forgot to order lunch. Never again.",
   "排练问候语排到忘了点午饭，下次绝不这样。"
  ],
  [
   "Our afternoon concept is comfortable shoes and no surprise rehearsals.",
   "下午的主题是舒服的鞋，以及没有临时排练。"
  ],
  [
   "The cats are our toughest audience. They slept through the entire rehearsal.",
   "猫咪是最难取悦的观众，整场排练都在睡。"
  ]
 ],
 [
  "merlion-host",
  "neighbourly; colloquial humour; appreciates practical comforts",
  [
   "A seat on the MRT",
   "地铁座位"
  ],
  [
   "Wang says the folding stool is free to borrow. Wah, premium service.",
   "王老板说折叠凳免费借。哇，这才叫高级服务。"
  ],
  [
   "I asked for kopi peng and a quiet afternoon. No need to upsize either.",
   "我点了冰咖啡和安静的下午，两样都不用加大。"
  ],
  [
   "Auntie Mei says the best seat is the one with a breeze. Correct lah.",
   "梅姨说最好的位子是有风吹来的那个，讲得对啦。"
  ],
  [
   "Today I walked without checking my step count. Still reached the coffee shop.",
   "今天走路没看步数，照样走到了咖啡店。"
  ]
 ]
]);
function pawGuestProfileMap(rows){
 const out=new Map();
 for(const [id,manner,topic,...lines] of rows){
  if(typeof id!=='string'||out.has(id)||typeof manner!=='string'||lines.length!==4||![topic,...lines].every(pair=>Array.isArray(pair)&&pair.length===2&&pair.every(v=>typeof v==='string'&&v.trim())))throw Error('Invalid guest personality: '+id);
  out.set(id,{manner,topic,lines});
 }
 return out
}
const pawGuestPersonalities=pawGuestProfileMap(pawGuestPersonalityRows);
function pawGuestVisitLine(g,visits){
 const profile=pawGuestPersonalities.get(g.id),pool=profile?[g.intro,...profile.lines]:[g.intro];
 const n=Number.isSafeInteger(visits)&&visits>0?visits:1;
 return pool[(n-1)%pool.length]
}
function pawGuestConversationPlan(g,visits){
 const profile=pawGuestPersonalities.get(g.id);
 // Every third visit is a brief remark, not another branching quiz.
 return {line:pawGuestVisitLine(g,visits),topic:profile?.topic||null,brief:!!profile&&visits>1&&visits%3===0}
}
/* PAW_GUEST_PERSONALITY_END */
for(const g of popGuestStories){
 const profile=pawGuestPersonalities.get(g.id);if(!profile)continue;
 g.choices[0][0]=profile.topic;
}
const pawCharacterMeetBefore=popGuestMeet;
popGuestMeet=function(g,n=null){
 if(!pawGuestPersonalities.has(g?.id))return pawCharacterMeetBefore(g,n);
 if(n){greetingNPC=n;greetingUntil=t+.9;stopRoute();p.tx=p.x;p.ty=p.y;p.facing=Math.abs(n.x-p.x)>Math.abs(n.y-p.y)?(n.x<p.x?'left':'right'):(n.y<p.y?'up':'down')}
 const rec=popGuestRecord(g)||{visits:0,choices:[]};
 rec.visits=(Number.isSafeInteger(rec.visits)&&rec.visits>=0?rec.visits:0)+1;
 popGuestMemory[g.id]=rec;save('popGuestMemoryV1',popGuestMemory);
 const plan=pawGuestConversationPlan(g,rec.visits);
 if(plan.brief){popGuestSay(g,tr(...plan.line),[]);return}
 const respond=i=>{
  if(!Array.isArray(rec.choices))rec.choices=[];
  if(!rec.choices.includes(i))rec.choices.push(i);
  popGuestMemory[g.id]=rec;save('popGuestMemoryV1',popGuestMemory);
  if(!items.some(x=>x[0]===g.gift[0]))addItem(...g.gift);
  popGuestSay(g,tr(...g.choices[i][1]),[[tr('See you around','下次见'),closeTalk]])
 };
 const greeting=tr(...plan.line)+(g.source==='gemini-modules-01-03'?'':'\n\n'+tr(...g.prompt));
 popGuestSay(g,greeting,[
  [tr(...plan.topic),()=>respond(0)],
  [tr(...g.choices[1][0]),()=>respond(1)],
  [tr('Keep exploring','继续逛逛'),closeTalk]
 ])
};
// Existing ambient speech scheduler supplies proximity, collision avoidance,
// language selection, cooldown and daily repetition limits; no new overlay.
for(const [id,profile] of pawGuestPersonalities){
 pawAmbientLines['guest:'+id]=profile.lines.map((pair,i)=>['guest-'+i,...pair]);
}
const pawGuestAmbientBefore=pawAmbientProfile;
pawAmbientProfile=function(actor){
 if(actor?.popGuest&&pawGuestPersonalities.has(actor.popGuest))return {id:'guest:'+actor.popGuest};
 return pawGuestAmbientBefore(actor)
};
// Rare guests have predictable local-hour windows. Keep ordinary visitors
// eligible at all hours so the existing two-slot roster can still fill.
Object.assign(pawGuestWindows,{
 'celeb_parody_03_elon_meowsk':{every:5,hours:[17,24]},
 'celeb_parody_05_uncle_rojen':{every:3,hours:[11,15]},
 'celeb_parody_06_marie_clutter':{every:4,hours:[9,15]},
 'net_culture_03_mc_king':{every:3,hours:[12,18]},
 'net_culture_04_buzzword_vivi':{every:3,hours:[17,24]},
 'traveller_01_sven_flatpack':{every:3,hours:[9,17]}
});


/* PAW_GUEST_PERSONALITY_RUNTIME_END */
/* PAW_ZWDS_SHARE_BEGIN */
const pawZwdsStarNames=Object.freeze({
 '紫微':'Zi Wei','天机':'Tian Ji','太阳':'Tai Yang','武曲':'Wu Qu','天同':'Tian Tong','廉贞':'Lian Zhen','天府':'Tian Fu','太阴':'Tai Yin','贪狼':'Tan Lang','巨门':'Ju Men','天相':'Tian Xiang','天梁':'Tian Liang','七杀':'Qi Sha','破军':'Po Jun'
});
function pawZwdsPublic(raw,topics=chartConsultTopics,themes=chartStarThemes){
 const topic=topics.find(v=>v.k===raw?.topicId);if(!topic)return null;
 const keys=Array.isArray(raw.starKeys)?[...new Set(raw.starKeys.filter(k=>typeof k==='string'&&Object.hasOwn(pawZwdsStarNames,k)))].slice(0,3):[];
 const stars=keys.length?[keys.map(k=>pawZwdsStarNames[k]).join(' · '),keys.join(' · ')]:['No main star in this palace','此宫无主星'];
 const lines=[stars,...keys.filter(k=>Array.isArray(themes[k])).slice(0,2).map(k=>[...themes[k]]),[...topic.practice]];
 return {kind:'zwds',title:[...topic.name],lines,accent:'#7c8c72',cards:[],takeaway:[...topic.question]};
}
function pawZwdsTopicSnapshot(chart,topicId,topics=chartConsultTopics){
 if(!chart||!Number.isInteger(chart.life)||chart.life<0||chart.life>11||!Array.isArray(chart.stars)||chart.stars.length!==12||!topics.some(v=>v.k===topicId))return null;
 const index=((chart.life-topicId)%12+12)%12,stars=chart.stars[index];
 if(!Array.isArray(stars))return null;
 return {kind:'zwds',topicId,starKeys:stars.filter(v=>Array.isArray(v)&&Object.hasOwn(pawZwdsStarNames,v[1])).map(v=>v[1])};
}
/* PAW_ZWDS_SHARE_END */
shareKinds.zwds=['Zi Wei Dou Shu reflection','紫微斗数小记'];
const pawSharePublicBefore=sharePublicData;
sharePublicData=function(raw){
 if(raw?.kind==='zwds')return pawZwdsPublic(raw)||pawSharePublicBefore({kind:'fortune',title:['A quiet moment','片刻清静'],lines:[]});
 return pawSharePublicBefore(raw)
};
const pawShareArtKeyBefore=sharePaintedKey;
sharePaintedKey=function(data){return data.kind==='zwds'?'readingInterior':pawShareArtKeyBefore(data)};
const pawShareCaptionBefore=meowSocialCaption;
meowSocialCaption=function(data,format,cn){
 if(data.kind!=='zwds')return pawShareCaptionBefore(data,format,cn);
 const i=Number(cn),title=data.title[i];
 return [cn?'Pawradise · 紫微斗数小记':'Pawradise · Zi Wei Dou Shu reflection',title,data.takeaway[i],...data.lines.map(v=>v[i]),cn?'传统文化与自我反思，不是预测。':'Traditional symbolism for reflection, not a forecast.',cn?'#Pawradise #紫微斗数 #自我探索':'#Pawradise #SelfReflection',...(format==='xhs'||format==='story'?[]:[meowShareUrl])].join('\n')
};
const pawShareCardBefore=shareCardArt;
shareCardArt=function(cv,data,format,cn){
 if(data.kind!=='zwds')return pawShareCardBefore(cv,data,format,cn);
 const L=socialLayout(format),{w,h,left,right,top,bottom}=L;cv.width=w;cv.height=h;
 const g=cv.getContext('2d'),i=Number(cn),width=w-left-right,cx=left+width/2,end=h-bottom,locale=v=>String(v?.[i]||'');
 const font=cn?'"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif':'Georgia,serif';
 g.fillStyle='#eaddc3';g.fillRect(0,0,w,h);
 g.strokeStyle='#9b896a';g.lineWidth=3;g.strokeRect(left,top,width,end-top);
 function line(text,y,size,weight='normal',color='#453b32'){
  g.font=weight+' '+size+'px '+font;g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;g.fillText(text,cx,y,width-70)
 }
 function block(text,y,size,maxLines,color='#453b32',weight='normal'){
  let rows;do{g.font=weight+' '+size+'px '+font;rows=shareTextLines(g,text,width-76);if(rows.length<=maxLines||size<=23)break;size-=2}while(true);
  if(rows.length>maxLines){rows=rows.slice(0,maxLines);let last=rows.at(-1);while(last.length&&g.measureText(last+'…').width>width-76)last=last.slice(0,-1);rows[rows.length-1]=last+'…'}
  const lh=size*1.28;rows.forEach((v,k)=>line(v,y+lh*(k+.5),size,weight,color));return y+rows.length*lh;
 }
 line('Pawradise · '+(cn?'月师傅小记':'MASTER YUE'),top+34,27,'bold','#55694f');
 const im=pics[sharePaintedKey(data)],artY=top+65,artH=Math.min(L.artH,Math.floor((end-top)*.26));
 let y=artY;
 if(im?.complete&&im.naturalWidth>0&&im.naturalHeight>0){
  const scale=Math.min((width-52)/im.naturalWidth,artH/im.naturalHeight),iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;
  g.drawImage(im,cx-iw/2,artY+(artH-ih)/2,iw,ih);y+=artH+16
 }
 y=block(locale(shareKinds.zwds),y,28,1,'#55694f','bold')+10;
 y=block(locale(data.title),y,format==='square'?44:52,2,'#453b32','bold')+8;
 y=block(locale(data.takeaway),y,32,2,'#805b46')+15;
 const floor=end-76;const remaining=Math.max(0,floor-y),n=data.lines.length;
 for(let k=0;k<n;k++){
  const rowH=Math.floor((floor-y)/(n-k));
  if(rowH<29)break;
  y=block(locale(data.lines[k]),y,format==='square'?26:30,Math.max(1,Math.min(3,Math.floor(rowH/39))),'#453b32',k===0?'bold':'normal')+Math.min(12,Math.max(0,rowH-42));
 }
 line(cn?'传统文化 · 自我反思 · 非预测':'Traditional symbolism · Reflection, not prediction',end-44,23,'normal','#55694f');
 line(cn?'不含生辰、时间或地点':'No birth date, time or birthplace included',end-17,21,'normal','#705e50')
};
const pawZwdsConsultBefore=renderChartConsultation;
renderChartConsultation=function(out,z){
 const result=pawZwdsConsultBefore(out,z),section=out.querySelector('.chartConsultation');
 if(!section||yueSubject!=='self')return result;
 const btn=b(section,tr('Share this palace reflection','分享此宫位小记'),()=>{
  if(yueSubject!=='self'||!section.isConnected)return;
  const selected=section.querySelector('.chartTopics button[data-topic][aria-pressed="true"]');
  if(!selected)return;
  const topic=Number(selected.dataset.topic),data=pawZwdsTopicSnapshot(z,topic);
  if(data)openMeowShare(data,()=>{destinyPage(false,topic)})
 });
 btn.className='pawZwdsShareButton';
 element('small',tr('Only this palace’s main stars and reflection are included. Birth details and the full chart stay private.','仅分享此宫位主星与反思小记，不包含生辰、出生地或完整命盘。'),section,'pawZwdsShareNote');
 return result
};


/* PAW_BUBBLE_INPUT_BEGIN */
function pawBubbleCanAct(game,blocked){
 return !blocked&&!!game&&game.status==='play'&&!game.flight&&Number.isInteger(game.remaining)&&game.remaining>0&&Number.isFinite(game.angle)
}
function pawBubbleCancelPointer(pointer,release){
 if(pointer===null||pointer===undefined)return false;
 release(pointer);return true
}
function pawBubblePause(game,now){
 if(!game||!Number.isFinite(now))return false;
 const gap=Math.max(0,now-(Number.isFinite(game.last)?game.last:now));
 if(Array.isArray(game.particles))for(const p of game.particles)if(Number.isFinite(p.at))p.at+=gap;
 game.last=now;return true
}
/* PAW_BUBBLE_INPUT_END */
function pawBubbleBlocked(){return document.hidden||talkOpen||transitioning||!proposal.hidden||$('page').style.display==='block'}
function pawReleaseBubblePointer(){
 const pointer=nostalgiaPointer;nostalgiaPointer=null;
 pawBubbleCancelPointer(pointer,id=>{try{if(c.hasPointerCapture(id))c.releasePointerCapture(id)}catch{}})
}
const pawBubbleFireBefore=nostalgiaFire;
nostalgiaFire=function(){
 if(!nostalgiaActive()||!pawBubbleCanAct(state.bubbleGame,pawBubbleBlocked()))return;
 state.bubbleGame.last=t;return pawBubbleFireBefore()
};
const pawBubbleTickBefore=nostalgiaTick;
let pawBubblePaused=false;
nostalgiaTick=function(g){
 if(pawBubbleBlocked()){pawBubblePaused=true;pawBubblePause(g,t);pawReleaseBubblePointer();return}
 if(pawBubblePaused){pawBubblePaused=false;pawBubblePause(g,t);return}
 return pawBubbleTickBefore(g)
};
const pawBubbleStartBefore=start;
start=function(...args){pawReleaseBubblePointer();pawBubblePaused=false;return pawBubbleStartBefore(...args)};
const pawBubbleNewBefore=nostalgiaNew;
nostalgiaNew=function(){pawReleaseBubblePointer();pawBubblePaused=false;return pawBubbleNewBefore()};
document.addEventListener('visibilitychange',()=>{if(document.hidden){pawBubblePaused=nostalgiaActive();pawReleaseBubblePointer()}});
window.addEventListener('blur',()=>{if(nostalgiaActive())pawReleaseBubblePointer()});
c.addEventListener('lostpointercapture',e=>{if(nostalgiaPointer===e.pointerId)nostalgiaPointer=null});
window.addEventListener('pointerdown',e=>{
 if(e.target!==c||!nostalgiaActive())return;
 if(e.button!==0||e.isPrimary===false||nostalgiaPointer!==null||pawBubbleBlocked()){
  e.preventDefault();e.stopPropagation()
 }
},true);
window.addEventListener('pointerup',e=>{
 if(nostalgiaPointer!==e.pointerId)return;
 if(!nostalgiaActive()||pawBubbleBlocked()){pawReleaseBubblePointer();e.stopPropagation()}
},true);


/* PAW_RECOVERED_ART_BEGIN */
// Recovered original illustrations. Dynamic labels and save IDs remain separate.
const pawRecoveredRoot='assets/visual/painted/recovered/';
const pawRecoveredFigures=Object.freeze({
 'Office escape cat':'black','Meeting survivor cat':'classic-white',
 'Annual leave cat':'sakura','Moonlight cat':'moonlight',
 'Golden payday cat':'gold','Strawberry mochi kitten':'pink-love','Toast loaf cat':'sleepy'
});
const pawRecoveredDailyCharms=['peace','safe-travels','health','peace','career','rest','happiness','rest','studies','health','rest','love'];
function pawRecoveredNineSlice(sw,sh,w,h,source=[94,96,118,71],target=[8,5,8,5]){
 if(![sw,sh,w,h,...source,...target].every(Number.isFinite)||sw<=source[0]+source[2]||sh<=source[1]+source[3]||w<=target[0]+target[2]||h<=target[1]+target[3])return [];
 const sx=[0,source[0],sw-source[2],sw],sy=[0,source[1],sh-source[3],sh],dx=[0,target[0],w-target[2],w],dy=[0,target[1],h-target[3],h],pieces=[];
 for(let j=0;j<3;j++)for(let i=0;i<3;i++)pieces.push([sx[i],sy[j],sx[i+1]-sx[i],sy[j+1]-sy[j],dx[i],dy[j],dx[i+1]-dx[i],dy[j+1]-dy[j]]);
 return pieces
}
function pawRecoveredFigurePath(name){return Object.hasOwn(pawRecoveredFigures,name)?'fortune-cats/'+pawRecoveredFigures[name]+'.webp':null}
function pawRecoveredCharmPath(index){return Number.isInteger(index)&&index>=0&&index<pawRecoveredDailyCharms.length?'blessing-charms/'+pawRecoveredDailyCharms[index]+'.webp':null}
/* PAW_RECOVERED_ART_END */
const pawRecoveredImages=new Map(),pawRecoveredFailures=new Map();
function pawRecoveredImage(path,ready=null){
 if(!path)return null;
 if((pawRecoveredFailures.get(path)||0)>Date.now())return null;
 let im=pawRecoveredImages.get(path);
 if(!im){im=new Image();im.decoding='async';pawRecoveredImages.set(path,im);im.addEventListener('error',()=>{if(pawRecoveredImages.get(path)===im){pawRecoveredImages.delete(path);pawRecoveredFailures.set(path,Date.now()+10000)}},{once:true});im.addEventListener('load',()=>pawRecoveredFailures.delete(path),{once:true});if(ready)im.addEventListener('load',ready,{once:true});im.src=pawRecoveredRoot+path}
 else if(ready){if(im.complete&&im.naturalWidth>0)ready();else if(!im.complete)im.addEventListener('load',ready,{once:true})}
 return im
}
function pawRecoveredPlaque(g,x,y,w,h){
 const im=pawRecoveredImage('signs/ornate_wood.webp');
 if(!im?.complete||!im.naturalWidth)return false;
 const parts=pawRecoveredNineSlice(im.naturalWidth,im.naturalHeight,w,h);
 if(!parts.length)return false;
 for(const [sx,sy,sw,sh,dx,dy,dw,dh] of parts)g.drawImage(im,sx,sy,sw,sh,x+dx,y+dy,dw,dh);
 return true
}
const pawRecoveredCss=document.createElement('style');
pawRecoveredCss.textContent=`
#game[data-recovered-plaque="true"]>#worldSigns>.worldSign .doorPlaque{
 background:transparent!important;border:solid transparent!important;border-width:9px 13px 8px!important;
 border-image: url("assets/visual/painted/recovered/signs/ornate_wood.webp") 96 118 71 94 fill stretch!important;
 color:#503622!important;text-shadow:none!important;box-shadow:none!important;border-radius:0!important;
 padding:2px 4px!important;line-height:1.15!important;max-width:132px!important
}
#game[data-recovered-plaque="true"]>#worldSigns>.worldSign .doorPlaque::before{display:none!important}
#game[data-recovered-speech="true"] .pawAmbientSpeech{
 background:transparent!important;border:solid transparent!important;border-width:12px 12px 16px 17px!important;
 border-image:url("assets/visual/painted/recovered/signs/speech_left.webp") 87 64 93 93 fill stretch!important;
 border-radius:0!important;box-shadow:none!important;padding:3px 4px!important;max-width:min(220px,62%)!important
}
#game .pawRecoveredFigure{width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;display:block}
#game .bagSlotArt .pawRecoveredFigure,#game .figureTileArt .pawRecoveredFigure{width:64px;height:64px;margin:auto}
#game .bagHeroArt .pawRecoveredFigure{width:140px;height:140px;margin:auto}
#game .figureCubby .pawRecoveredFigure{width:100%;height:100%;max-height:65px}
#game .townFortuneSlip .pawRecoveredCharm{float:right;width:58px;height:69px;object-fit:contain;margin:0 0 4px 10px;pointer-events:none}
#game .townFortuneSlip:after{content:"";display:block;clear:both}
`;document.head.append(pawRecoveredCss);
pawRecoveredImage('signs/ornate_wood.webp',()=>$('game').dataset.recoveredPlaque='true');
pawRecoveredImage('signs/speech_left.webp',()=>$('game').dataset.recoveredSpeech='true');
const pawRecoveredFigureIconBefore=bagFigureIcon;
bagFigureIcon=function(v){
 const path=pawRecoveredFigurePath(v?.[0]);if(!path)return pawRecoveredFigureIconBefore(v);
 return '<img class="pawRecoveredFigure" src="'+pawRecoveredRoot+path+'" alt="" loading="lazy" decoding="async">'
};
const pawRecoveredBagBefore=bagArt;
bagArt=function(v){
 const id=v?.item?.[0],path=id==='Temple cat blessing'?'fortune-cats/guardian.webp':id==='Keeper’s quiet blessing'?'blessing-charms/peace.webp':null;
 if(path)return '<img class="pawRecoveredFigure" src="'+pawRecoveredRoot+path+'" alt="" loading="lazy" decoding="async">';
 return pawRecoveredBagBefore(v)
};
const pawRecoveredDrawFigureBefore=drawBlindCollectible;
drawBlindCollectible=function(x,y,v,sc=1){
 const path=pawRecoveredFigurePath(v?.[0]),im=pawRecoveredImage(path);
 if(!im?.complete||!im.naturalWidth||!im.naturalHeight)return pawRecoveredDrawFigureBefore(x,y,v,sc);
 const scale=Math.min(60*sc/im.naturalWidth,68*sc/im.naturalHeight),w=im.naturalWidth*scale,h=im.naturalHeight*scale;
 ctx.drawImage(im,x-w/2,y-h*(v[0]==='Toast loaf cat'?.9589:.966),w,h)
};
const pawRecoveredDailyBefore=renderTownFortune;
renderTownFortune=function(book){
 const result=pawRecoveredDailyBefore(book),slip=book.lastElementChild;
 if(slip?.classList.contains('townFortuneSlip')){
  const path=pawRecoveredCharmPath(Number(slip.dataset.theme));
  if(path){const im=document.createElement('img');im.className='pawRecoveredCharm';im.src=pawRecoveredRoot+path;im.alt='';im.decoding='async';slip.prepend(im)}
 }
 return result
};


/* PAW_RECOVERED_SHARE_BEGIN */
const pawRecoveredShareFormats=Object.freeze({
 feed:[1080,1350,271,1119],xhs:[1080,1440,289,1195],
 story:[1080,1920,380,1598],square:[1080,1080,220,892]
});
function pawRecoveredShareBounds(format){
 const f=pawRecoveredShareFormats[format];if(!f)return null;
 return {width:f[0],height:f[1],top:f[2],bottom:f[3],left:84,right:format==='story'?142:84};
}
function pawRecoveredTarotLayout(box,count){
 if(![1,3,5].includes(count)||!box)return null;
 const width=box.width-box.left-box.right,space=18,maxW=(width-(count-1)*space)/count;
 const h=Math.min(box.height*.18,(box.bottom-box.top)*.34,maxW*218/128);
 const w=h*128/218,total=count*w+(count-1)*space;
 return {w,h,x:box.left+Math.max(0,(width-total)/2),step:w+space};
}
/* PAW_RECOVERED_SHARE_END */
/* Original blank overlays: only use layouts for result data the game actually produces. */
const pawRecoveredLayouts=Object.freeze({"spectrum4_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"score_rows":[[84,381,912,152.25],[84,542.25,912,152.25],[84,703.5,912,152.25],[84,864.75,912,152.25]]},"big_five_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"score_rows":[[84,381,912,120],[84,510,912,120],[84,639,912,120],[84,768,912,120],[84,897,912,120]]},"nine_motives_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"score_rows":[[84,381,912,62.666666666666664],[84,452.66666666666663,912,62.666666666666664],[84,524.3333333333333,912,62.666666666666664],[84,596,912,62.666666666666664],[84,667.6666666666666,912,62.666666666666664],[84,739.3333333333333,912,62.666666666666664],[84,811,912,62.666666666666664],[84,882.6666666666666,912,62.666666666666664],[84,954.3333333333333,912,62.666666666666664]]},"values_relationship_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"tiles":[[84,381,449,311],[547,381,449,311],[84,706,449,311],[547,706,449,311]]},"playful_result_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"illustration":[84,381,912,362.52],"summary":[84,757.52,912,259.48]},"tarot_1_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"cards":[[414.92,381,250.15999999999997,375.23999999999995]],"reading":[84,770.24,912,246.76000000000005]},"tarot_3_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"cards":[[152.76000000000005,381,250.15999999999997,375.23999999999995],[414.92,381,250.15999999999997,375.23999999999995],[677.0799999999999,381,250.15999999999997,375.23999999999995]],"reading":[84,770.24,912,246.76000000000005]},"tarot_5_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"cards":[[83.99999999999989,381,172.80000000000004,259.20000000000005],[268.79999999999995,381,172.80000000000004,259.20000000000005],[453.59999999999997,381,172.80000000000004,259.20000000000005],[638.4,381,172.80000000000004,259.20000000000005],[823.2,381,172.80000000000004,259.20000000000005]],"reading":[84,654.2,912,362.79999999999995]},"zi_wei_12_palaces_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"palace_cells":[[224,383,155,155],[383,383,155,155],[542,383,155,155],[701,383,155,155],[224,542,155,155],[701,542,155,155],[224,701,155,155],[701,701,155,155],[224,860,155,155],[383,860,155,155],[542,860,155,155],[701,860,155,155]],"chart_summary":[384,543,312,312]},"fortune_slip_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"illustration":[84,381,912,362.52],"summary":[84,757.52,912,259.48]},"story_ending_feed":{"title":[84,271,912,92],"footer":[84,1035,912,84],"illustration":[84,381,912,362.52],"summary":[84,757.52,912,259.48]},"spectrum4_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"score_rows":[[84,399,912,166.75],[84,574.75,912,166.75],[84,750.5,912,166.75],[84,926.25,912,166.75]]},"big_five_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"score_rows":[[84,399,912,131.6],[84,539.6,912,131.6],[84,680.2,912,131.6],[84,820.8,912,131.6],[84,961.4,912,131.6]]},"nine_motives_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"score_rows":[[84,399,912,69.11111111111111],[84,477.1111111111111,912,69.11111111111111],[84,555.2222222222222,912,69.11111111111111],[84,633.3333333333334,912,69.11111111111111],[84,711.4444444444445,912,69.11111111111111],[84,789.5555555555555,912,69.11111111111111],[84,867.6666666666667,912,69.11111111111111],[84,945.7777777777778,912,69.11111111111111],[84,1023.8888888888889,912,69.11111111111111]]},"values_relationship_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"tiles":[[84,399,449,340],[547,399,449,340],[84,753,449,340],[547,753,449,340]]},"playful_result_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"illustration":[84,399,912,395.58],"summary":[84,808.5799999999999,912,284.42]},"tarot_1_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"cards":[[403.5133333333333,399,272.9733333333333,409.46]],"reading":[84,822.46,912,270.54]},"tarot_3_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"cards":[[118.54000000000008,399,272.9733333333333,409.46],[403.5133333333334,399,272.9733333333333,409.46],[688.4866666666667,399,272.9733333333333,409.46]],"reading":[84,822.46,912,270.54]},"tarot_5_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"cards":[[83.99999999999989,399,172.80000000000004,259.20000000000005],[268.79999999999995,399,172.80000000000004,259.20000000000005],[453.59999999999997,399,172.80000000000004,259.20000000000005],[638.4,399,172.80000000000004,259.20000000000005],[823.2,399,172.80000000000004,259.20000000000005]],"reading":[84,672.2,912,420.79999999999995]},"zi_wei_12_palaces_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"palace_cells":[[195,401,169.5,169.5],[368.5,401,169.5,169.5],[542,401,169.5,169.5],[715.5,401,169.5,169.5],[195,574.5,169.5,169.5],[715.5,574.5,169.5,169.5],[195,748,169.5,169.5],[715.5,748,169.5,169.5],[195,921.5,169.5,169.5],[368.5,921.5,169.5,169.5],[542,921.5,169.5,169.5],[715.5,921.5,169.5,169.5]],"chart_summary":[369.5,575.5,341,341]},"fortune_slip_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"illustration":[84,399,912,395.58],"summary":[84,808.5799999999999,912,284.42]},"story_ending_xhs":{"title":[84,289,912,92],"footer":[84,1111,912,84],"illustration":[84,399,912,395.58],"summary":[84,808.5799999999999,912,284.42]},"spectrum4_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"score_rows":[[84,490,912,244.75],[84,743.75,912,244.75],[84,997.5,912,244.75],[84,1251.25,912,244.75]]},"big_five_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"score_rows":[[84,490,912,194],[84,693,912,194],[84,896,912,194],[84,1099,912,194],[84,1302,912,194]]},"nine_motives_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"score_rows":[[84,490,912,103.77777777777777],[84,602.7777777777778,912,103.77777777777777],[84,715.5555555555555,912,103.77777777777777],[84,828.3333333333333,912,103.77777777777777],[84,941.1111111111111,912,103.77777777777777],[84,1053.888888888889,912,103.77777777777777],[84,1166.6666666666665,912,103.77777777777777],[84,1279.4444444444443,912,103.77777777777777],[84,1392.2222222222222,912,103.77777777777777]]},"values_relationship_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"tiles":[[84,490,449,496],[547,490,449,496],[84,1000,449,496],[547,1000,449,496]]},"playful_result_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"illustration":[84,490,912,573.42],"summary":[84,1077.42,912,418.58000000000004]},"tarot_1_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"cards":[[342.1533333333333,490,395.6933333333333,593.54]],"reading":[84,1097.54,912,398.46000000000004]},"tarot_3_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"cards":[[84,490,296,444],[392,490,296,444],[700,490,296,444]],"reading":[84,948,912,548]},"tarot_5_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"cards":[[83.99999999999989,490,172.80000000000004,259.20000000000005],[268.79999999999995,490,172.80000000000004,259.20000000000005],[453.59999999999997,490,172.80000000000004,259.20000000000005],[638.4,490,172.80000000000004,259.20000000000005],[823.2,490,172.80000000000004,259.20000000000005]],"reading":[84,763.2,912,732.8]},"zi_wei_12_palaces_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"palace_cells":[[86,492,224,224],[314,492,224,224],[542,492,224,224],[770,492,224,224],[86,720,224,224],[770,720,224,224],[86,948,224,224],[770,948,224,224],[86,1176,224,224],[314,1176,224,224],[542,1176,224,224],[770,1176,224,224]],"chart_summary":[315,721,450,450],"reading":[84,1412,912,84]},"fortune_slip_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"illustration":[84,490,912,573.42],"summary":[84,1077.42,912,418.58000000000004]},"story_ending_story":{"title":[84,380,912,92],"footer":[84,1514,912,84],"illustration":[84,490,912,573.42],"summary":[84,1077.42,912,418.58000000000004]},"spectrum4_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"score_rows":[[84,318.64,912,113.61000000000001],[84,441.25,912,113.61000000000001],[84,563.86,912,113.61000000000001],[84,686.47,912,113.61000000000001]]},"big_five_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"score_rows":[[84,318.64,912,89.08800000000001],[84,416.728,912,89.08800000000001],[84,514.816,912,89.08800000000001],[84,612.904,912,89.08800000000001],[84,710.992,912,89.08800000000001]]},"nine_motives_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"score_rows":[[84,318.64,912,45.49333333333334],[84,373.1333333333333,912,45.49333333333334],[84,427.62666666666667,912,45.49333333333334],[84,482.12,912,45.49333333333334],[84,536.6133333333333,912,45.49333333333334],[84,591.1066666666667,912,45.49333333333334],[84,645.6,912,45.49333333333334],[84,700.0933333333334,912,45.49333333333334],[84,754.5866666666667,912,45.49333333333334]]},"values_relationship_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"tiles":[[84,318.64,449,233.72000000000003],[547,318.64,449,233.72000000000003],[84,566.36,449,233.72000000000003],[547,566.36,449,233.72000000000003]]},"playful_result_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"illustration":[84,318.64,912,274.4208],"summary":[84,607.0608,912,193.01920000000007]},"tarot_1_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"cards":[[445.3168,318.64,189.3664,284.0496]],"reading":[84,616.6895999999999,912,183.39040000000006]},"tarot_3_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"cards":[[243.9504,318.64,189.3664,284.0496],[445.3168,318.64,189.3664,284.0496],[646.6831999999999,318.64,189.3664,284.0496]],"reading":[84,616.6895999999999,912,183.39040000000006]},"tarot_5_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"cards":[[83.99999999999989,318.64,172.80000000000004,259.20000000000005],[268.79999999999995,318.64,172.80000000000004,259.20000000000005],[453.59999999999997,318.64,172.80000000000004,259.20000000000005],[638.4,318.64,172.80000000000004,259.20000000000005],[823.2,318.64,172.80000000000004,259.20000000000005]],"reading":[84,591.84,912,208.24]},"zi_wei_12_palaces_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"palace_cells":[[301.28,320.64,116.36000000000001,116.36000000000001],[421.64,320.64,116.36000000000001,116.36000000000001],[542,320.64,116.36000000000001,116.36000000000001],[662.36,320.64,116.36000000000001,116.36000000000001],[301.28,441,116.36000000000001,116.36000000000001],[662.36,441,116.36000000000001,116.36000000000001],[301.28,561.36,116.36000000000001,116.36000000000001],[662.36,561.36,116.36000000000001,116.36000000000001],[301.28,681.72,116.36000000000001,116.36000000000001],[421.64,681.72,116.36000000000001,116.36000000000001],[542,681.72,116.36000000000001,116.36000000000001],[662.36,681.72,116.36000000000001,116.36000000000001]],"chart_summary":[422.64,442,234.72000000000003,234.72000000000003]},"fortune_slip_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"illustration":[84,318.64,912,274.4208],"summary":[84,607.0608,912,193.01920000000007]},"story_ending_square":{"title":[84,220,912,80.64],"footer":[84,818.08,912,73.92],"illustration":[84,318.64,912,274.4208],"summary":[84,607.0608,912,193.01920000000007]}});
function pawRecoveredLayoutKey(data,format){
 if(!pawRecoveredShareBounds(format))return null;
 const kind=data?.kind==='tarot'&&[1,3,5].includes(data.cards?.length)?'tarot_'+data.cards.length:data?.kind==='fortune'?'fortune_slip':data?.kind==='story'?'story_ending':data?.kind==='type'&&data.scoreRows?.length===4?'spectrum4':data?.kind==='motive'&&data.scoreRows?.length===9?'nine_motives':data?.kind==='soul'||data?.kind==='cafe'?'playful_result':data?.kind==='zwds_chart'&&data.palaces?.length===12?'zi_wei_12_palaces':data?.kind==='bigfive'&&data.scoreRows?.length===5?'big_five':data?.kind==='values'&&data.scoreRows?.length===4?'values_relationship':null;
 const key=kind?kind+'_'+format:null;
 return key&&Object.hasOwn(pawRecoveredLayouts,key)?key:null
}
function pawRecoveredResultIllustration(data){
 if(data.kind==='fortune')return pawRecoveredImage('scenes/temple_approach_portrait.webp');
 return pics[sharePaintedKey(data)]
}
function pawPrepareRecoveredShare(format,data){
 if(!pawRecoveredShareBounds(format))return Promise.resolve();
 const images=[pawRecoveredImage('templates/paper_'+format+'.webp')],key=pawRecoveredLayoutKey(data,format);
 if(key)images.push(pawRecoveredImage('templates/'+key+'.svg'));
 if(data.kind==='tarot'&&data.cards?.length)images.push(readingArtwork());
 else if(key&&!data.scoreRows?.length&&!data.palaces?.length)images.push(pawRecoveredResultIllustration(data));
 const waits=images.filter(im=>im&&!im.complete).map(im=>im.decode().catch(()=>{}));
 return Promise.race([Promise.all(waits),new Promise(resolve=>setTimeout(resolve,1800))])
}
function pawDrawRecoveredLayout(cv,data,format,cn,box,paper){
 const key=pawRecoveredLayoutKey(data,format);if(!key)return false;
 const slots=pawRecoveredLayouts[key],overlay=pawRecoveredImage('templates/'+key+'.svg');
 if(!overlay?.complete||!overlay.naturalWidth||overlay.naturalWidth!==box.width||overlay.naturalHeight!==box.height)return false;
 const tarot=data.kind==='tarot',art=tarot?readingArtwork():pawRecoveredResultIllustration(data);
 if(!slots.score_rows&&!slots.tiles&&!slots.palace_cells&&(!art?.complete||!art.naturalWidth||!art.naturalHeight||(tarot&&(art.naturalWidth!==1024||art.naturalHeight!==2180))))return false;
 cv.width=box.width;cv.height=box.height;
 const g=cv.getContext('2d'),locale=v=>String(v?.[Number(cn)]||''),font=cn?'"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif':'Georgia,serif';
 const ink='#4d3a2c',accent='#795741',muted='#54684e';
 g.drawImage(paper,0,0,box.width,box.height);
 // Compress only the overlay and its coordinate system for social story safe margins.
 const scale=(box.width-box.left-box.right)/(box.width-168);
 g.save();g.translate(box.left,0);g.scale(scale,1);g.translate(-84,0);g.drawImage(overlay,0,0,box.width,box.height);
 function textIn(rect,values,initial=36,weight='normal',color=ink){
  const [x,y,w,h]=rect,pad=Math.min(16,h*.1),maxW=w-2*pad,maxH=h-2*pad;
  const v=values.filter(v=>typeof v==='string'&&v.trim());if(!v.length)return;
  let size=initial,rows=[],lh,total;
  for(;size>=16;size-=2){g.font=weight+' '+size+'px '+font;rows=v.flatMap(q=>shareTextLines(g,q,maxW));lh=size*1.22;total=rows.length*lh;if(total<=maxH||size<=17)break}
  const shrink=Math.min(1,maxH/Math.max(1,total));
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.translate(x+w/2,y+h/2);g.scale(1,shrink);g.font=weight+' '+size+'px '+font;g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;
  rows.forEach((q,i)=>g.fillText(q,0,(i-(rows.length-1)/2)*lh,maxW));g.restore()
 }
 textIn(slots.title,[locale(data.title)],format==='square'?38:46,'bold');
 if(tarot){
  const roles=data.cards.length===5?fiveReadingPositions:data.cards.length===3?[['Situation','现状'],['Notice','留意'],['Next step','下一步']]:[['Your card','今日之牌']];
  data.cards.forEach((card,i)=>{
   const [x,y,w,h]=slots.cards[i],captionH=Math.min(56,h*.22),maxH=h-captionH-12,ch=Math.min(maxH,(w-14)*218/128),cw=ch*128/218;
   g.save();g.translate(x+w/2,y+6+ch/2);if(card.rev)g.rotate(Math.PI);g.drawImage(art,(card.i%8)*128,Math.floor(card.i/8)*218,128,218,-cw/2,-ch/2,cw,ch);g.restore();
   textIn([x+2,y+h-captionH,w-4,captionH],[locale(roles[i]),locale(tarotDeck[card.i])+(card.rev?(cn?' 逆位':' · Reversed'):(cn?' 正位':' · Upright'))],data.cards.length===5?22:27,'normal',ink)
  });
  textIn(slots.reading,[locale(data.takeaway||socialResultQuote(data))],format==='square'?32:38,'normal',ink)
 }else if(slots.palace_cells){
  slots.palace_cells.forEach((rect,i)=>{
   const p=data.palaces[i],[x,y,w,h]=rect,head=h*.37;
   textIn([x,y,w,head],[locale(p.name)],22,'bold',muted);
   textIn([x,y+head,w,h-head],p.stars.length?p.stars.map(locale):[cn?'无主星':'No main star'],20,'normal',ink)
  });
  textIn(slots.chart_summary,[cn?'十四主星':'14 main stars',cn?'传统文化小记':'Traditional symbolism',cn?'仅供反思':'For reflection'],30,'normal',accent)
 }else if(slots.tiles){
  slots.tiles.forEach((rect,i)=>{const [x,y,w,h]=rect,r=data.scoreRows[i];
   textIn([x+10,y+5,w-20,h*.47],[locale(r.label)],30,'bold',muted);
   textIn([x+10,y+h*.48,w-20,h*.46],[locale(r.value)],36,'normal',accent)
  });
 }else if(slots.score_rows){
  slots.score_rows.forEach((rect,i)=>{
   const row=data.scoreRows[i],[x,y,w,h]=rect;
   const left=w*.61; textIn([x+8,y,left-12,h],[locale(row.label)],h<60?24:31,'normal',ink);
   const value=locale(row.value);textIn([x+left,y,w-left-8,h],[value],h<60?23:30,'bold',accent)
  });
 }else{
  const [x,y,w,h]=slots.illustration,sc=Math.min((w-20)/art.naturalWidth,(h-16)/art.naturalHeight),iw=art.naturalWidth*sc,ih=art.naturalHeight*sc;
  g.drawImage(art,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
  const lines=[locale(socialResultQuote(data)),...(data.lines||[]).map(locale)].filter((v,i,a)=>v&&a.indexOf(v)===i);
  textIn(slots.summary,lines,format==='square'?30:36)
 }
 textIn(slots.footer,['Pawradise · '+(cn?'趣味探索，仅供反思':'For fun and reflection')],27,'normal',muted);
 g.restore();return true
}
/* Share only the computed result, never individual answers or private input. */
/* PAW_EXTRA_DISCOVERY_BEGIN */
const pawExtraDiscoveries={
 bigfive:{title:['Five personality tendencies','五大性格倾向'],axes:[
  {name:['Openness','开放性'],questions:[[['I enjoy learning something unfamiliar.','我喜欢学习陌生的新事物。'],false],[['I would rather try a different route sometimes.','我有时喜欢尝试不同的路线。'],false],[['I usually avoid ideas that challenge my habits.','我通常回避挑战自己习惯的想法。'],true]]},
  {name:['Conscientiousness','尽责性'],questions:[[['I keep track of promises I make.','我会记住自己做过的承诺。'],false],[['I prepare before an important task.','重要任务之前，我会提前准备。'],false],[['I often leave simple tasks unfinished.','我经常让简单的事情半途而废。'],true]]},
  {name:['Extraversion','外向性'],questions:[[['I feel energised by friendly group conversations.','轻松的群体聊天会让我充满活力。'],false],[['I enjoy starting conversations with new people.','我喜欢主动与新认识的人交谈。'],false],[['After a social event, I prefer a long quiet break.','社交活动之后，我更喜欢长时间独处。'],true]]},
  {name:['Agreeableness','宜人性'],questions:[[['I try to understand other people before judging.','评价别人之前，我会试着理解对方。'],false],[['I look for a fair way to resolve disagreements.','意见不合时，我会寻找公平的解决办法。'],false],[['I rarely consider how my decisions affect others.','我很少考虑自己的决定对他人的影响。'],true]]},
  {name:['Emotional sensitivity','情绪敏感度'],questions:[[['Small uncertainties can stay on my mind.','小小的不确定也可能让我久久惦记。'],false],[['My feelings change noticeably under pressure.','压力大时，我的情绪变化会很明显。'],false],[['I generally remain calm when plans change.','计划改变时，我通常能保持平静。'],true]]}
 ]},
 values:{title:['Relationship values','关系价值观'],axes:[
  {name:['Connection','陪伴与连接'],questions:[[['I value regular time together.','我重视经常一起度过的时间。'],false],[['Small gestures help me feel connected.','小小的心意能让我感到亲近。'],false],[['Sharing ordinary daily experiences matters to me.','分享平凡的日常对我很重要。'],false]]},
  {name:['Autonomy','独立与空间'],questions:[[['I need time for my own interests.','我需要留时间给自己的兴趣。'],false],[['I value the freedom to make my own choices.','我重视自己做决定的自由。'],false],[['I feel comfortable asking for personal space.','我愿意坦然表达自己需要独处空间。'],false]]},
  {name:['Communication','坦诚沟通'],questions:[[['I value discussing needs openly.','我重视坦诚讨论彼此的需要。'],false],[['I prefer addressing misunderstandings calmly.','我希望平静地处理误会。'],false],[['I appreciate direct but kind feedback.','我欣赏直接但善意的反馈。'],false]]},
  {name:['Reliability','信任与可靠'],questions:[[['Keeping promises is important to me.','遵守承诺对我很重要。'],false],[['I value consistency in how people show up.','我重视对方持续而稳定的陪伴。'],false],[['I appreciate knowing what I can count on.','我希望清楚哪些事情可以彼此依靠。'],false]]}
 ]}
};
function pawExtraScore(mode,rows,answers){
 const cfg=pawExtraDiscoveries[mode];if(!cfg||!Array.isArray(rows)||!Array.isArray(answers)||rows.length!==cfg.axes.length*3||answers.length!==rows.length)return null;
 const counts=Array(cfg.axes.length).fill(0),scores=counts.slice(),seen=new Set();
 for(let i=0;i<rows.length;i++){const q=rows[i],v=answers[i];if(!Number.isInteger(q.dimension)||q.dimension<0||q.dimension>=counts.length||!Number.isInteger(q.id)||q.id<0||q.id>=rows.length||Math.floor(q.id/3)!==q.dimension||seen.has(q.id)||!Number.isInteger(v)||v<0||v>2)return null;seen.add(q.id);counts[q.dimension]++;scores[q.dimension]+=cfg.axes[q.dimension].questions[q.id%3][1]?2-v:v}
 return counts.every(v=>v===3)?scores:null
}
function pawExtraRows(mode,scores){
 const cfg=pawExtraDiscoveries[mode];if(!cfg||!Array.isArray(scores)||scores.length!==cfg.axes.length||scores.some(v=>!Number.isInteger(v)||v<0||v>6))return null;
 return scores.map((v,i)=>({label:cfg.axes[i].name,value:[v+' / 6',v+' / 6']}))
}
/* PAW_EXTRA_DISCOVERY_END */
for(const [mode,cfg] of Object.entries(pawExtraDiscoveries)){wonderSceneNames[mode]=cfg.title;shareKinds[mode]=cfg.title}
const pawExtraQuestionBefore=prepareWonderQuestions;
prepareWonderQuestions=function(mode){
 const cfg=pawExtraDiscoveries[mode];if(!cfg)return pawExtraQuestionBefore(mode);
 const rows=cfg.axes.flatMap((a,k)=>a.questions.map(([prompt],j)=>({prompt,dimension:k,id:k*3+j,opts:[['Not much like me','不太像我',0],['Sometimes','有时像我',1],['Very much like me','很像我',2]]})));
 for(let i=rows.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]]}return rows
};
const pawExtraFinishBefore=wonderSceneFinish;
wonderSceneFinish=function(){
 const mode=wonderSceneMode,cfg=pawExtraDiscoveries[mode];if(!cfg)return pawExtraFinishBefore();
 const scores=pawExtraScore(mode,wonderQuestionOrder,wonderSceneAnswers);if(!scores)return;
 wonderSaved[mode]={scores,version:1};save('wonderTestsV1',wonderSaved);
 wonderSceneResult={name:cfg.title,desc:mode==='values'?['Your priorities can coexist. None is a relationship grade.','不同的关系需求可以共存，这不是关系评分。']:['A snapshot of your tendencies today, not a fixed label.','此刻的性格倾向小画像，不是固定标签。'],color:'#92a79a'};
 wonderScenePhase='result';wonderSceneAt=t;sound(660)
};
const pawExtraResultBefore=openWonderResult;
openWonderResult=function(mode,result){
 const cfg=pawExtraDiscoveries[mode],rows=pawExtraRows(mode,wonderSaved[mode]?.scores);if(!cfg||!rows)return pawExtraResultBefore(mode,result);
 page(tr(...cfg.title),tr('Your illustrated reflection','你的自我探索小记'),q=>{
  const body=element('section','',q,'readingNotes');
  const im=element('img','',body,'pawExtraResultArt');im.src=ART.readingInterior;im.alt='';im.style.cssText='width:100%;max-height:24vh;object-fit:contain';
  element('p',tr(...result.desc),body);
  element('p',tr('Three statements per theme, scored from 0 to 6. This is an original informal reflection, not a validated psychological measure.','每项由三道题组成，分数为0至6。此为原创趣味探索，非经验证的心理量表。'),body);
  rows.forEach(row=>{const item=element('article','',body,'readingNote');element('h2',tr(...row.label),item);element('p',tr(...row.value),item)});
  b(body,tr('Share keepsake','分享纪念卡'),()=>wonderSceneShare(()=>openWonderResult(mode,result)));
  b(body,tr('Try again','再测一次'),()=>wonderSceneOpen(mode))
 });journalLanguage(()=>openWonderResult(mode,result))
};
const pawExtraQuoteBefore=socialResultQuote;
socialResultQuote=function(data){
 if(data.kind==='bigfive')return ['A personality is more than a number.','性格不止是一组数字。'];
 if(data.kind==='values')return ['There is room for both closeness and space.','亲密与空间，都值得被尊重。'];
 return pawExtraQuoteBefore(data)
};
const pawExtraCaptionBefore=meowSocialCaption;
meowSocialCaption=function(data,format,cn){
 if(!pawExtraDiscoveries[data.kind])return pawExtraCaptionBefore(data,format,cn);
 const i=Number(cn);return ['Pawradise · '+data.title[i],...(data.scoreRows||[]).map(r=>r.label[i]+' '+r.value[i]),socialResultQuote(data)[i],cn?'趣味探索，非心理诊断。':'Informal reflection, not a psychological assessment.'].join('\n')
};
function pawPublicWonderScores(kind,scores,labels){
 if(pawExtraDiscoveries[kind])return pawExtraRows(kind,scores);
 if(kind==='type'){
  if(!Array.isArray(scores)||scores.length!==4||scores.some(v=>!Number.isInteger(v)||v< -4||v>4||v%2!==0))return null;
  const axes=[['Social / quiet recharge','社交 / 独处'],['Details / possibilities','细节 / 可能性'],['Logic / values','逻辑 / 感受'],['Plans / flexibility','计划 / 随性']];
  return scores.map((v,i)=>{const a=(4+v)/2,b=4-a;return {label:axes[i],value:[a+' : '+b,a+' : '+b]}})
 }
 if(kind==='motive'){
  if(!Array.isArray(scores)||scores.length!==9||scores.some(v=>!Number.isInteger(v)||v<0||v>6)||!Array.isArray(labels)||labels.length!==9)return null;
  return scores.map((v,i)=>({label:labels[i].slice(0,2),value:[v+' / 6',v+' / 6']}))
 }
 return null
}
const pawChartPalaceNames=[['Life','命宫'],['Siblings','兄弟'],['Partner','夫妻'],['Children','子女'],['Wealth','财帛'],['Health','疾厄'],['Travel','迁移'],['Friends','交友'],['Career','官禄'],['Property','田宅'],['Fortune','福德'],['Parents','父母']];
const pawChartBranchOrder=[5,6,7,8,4,9,3,10,2,1,0,11];
function pawChartShareSnapshot(z){
 if(!z||!Number.isInteger(z.life)||z.life<0||z.life>11||!Array.isArray(z.stars)||z.stars.length!==12||!z.stars.every(Array.isArray))return null;
 return {kind:'zwds_chart',palaces:pawChartBranchOrder.map(i=>({index:(z.life-i+12)%12,stars:z.stars[i].map(v=>v?.[1]).filter(k=>Object.hasOwn(pawZwdsStarNames,k))}))}
}
function pawPublicChartShare(raw){
 if(!Array.isArray(raw?.palaces)||raw.palaces.length!==12||new Set(raw.palaces.map(v=>v?.index)).size!==12)return null;
 if(raw.palaces.some(v=>!Number.isInteger(v?.index)||v.index<0||v.index>11||!Array.isArray(v.stars)))return null;
 const palaces=raw.palaces.map(v=>({name:pawChartPalaceNames[v.index],stars:[...new Set(v.stars.filter(k=>typeof k==='string'&&Object.hasOwn(pawZwdsStarNames,k)))].slice(0,3).map(k=>[pawZwdsStarNames[k],k])}));
 return {kind:'zwds_chart',title:['Zi Wei · Twelve palaces','紫微斗数 · 十二宫'],lines:[],cards:[],palaces,accent:'#7c8c72'}
}
shareKinds.zwds_chart=['Twelve palace keepsake','十二宫纪念卡'];
const pawChartCaptionBefore=meowSocialCaption;
meowSocialCaption=function(data,format,cn){
 if(data.kind==='zwds_chart')return cn?'Pawradise · 十二宫纪念卡\n传统文化探索，仅供反思。':'Pawradise · Twelve palace keepsake\nTraditional symbolism, for reflection.';
 return pawChartCaptionBefore(data,format,cn)
};
const pawChartArtKeyBefore=sharePaintedKey;
sharePaintedKey=function(data){return data.kind==='zwds_chart'?'readingInterior':pawChartArtKeyBefore(data)};
const pawFullChartConsultBefore=renderChartConsultation;
renderChartConsultation=function(out,z){
 const result=pawFullChartConsultBefore(out,z),section=out.querySelector('.chartConsultation');
 if(!section||yueSubject!=='self')return result;
 const details=element('details','',section,'pawFullChartSharing');
 element('summary',tr('Optional: share all twelve palaces','可选：分享完整十二宫'),details);
 element('p',tr('The card contains your main-star placements. It omits name, birth date, time and location, but placements can still reveal clues about birth information. Only share if comfortable.','卡片包含你的主星分布，不含姓名、出生日期、时间及地点，但星曜分布仍可能透露部分生辰线索。请自行决定是否分享。'),details);
 b(details,tr('Preview twelve-palace card','预览十二宫纪念卡'),()=>{
  if(yueSubject!=='self'||!details.isConnected)return;const data=pawChartShareSnapshot(z);if(data)openMeowShare(data,()=>destinyPage(false))
 });
 return result
};
const pawScoresPublicBefore=sharePublicData;
sharePublicData=function(raw){
 if(raw?.kind==='zwds_chart')return pawPublicChartShare(raw)||pawScoresPublicBefore({kind:'fortune',title:['A quiet moment','片刻清静'],lines:[]});
 const data=pawScoresPublicBefore(raw);
 const rows=pawPublicWonderScores(data.kind,raw?.computedScores,wonderMotives);
 return rows?{...data,scoreRows:rows}:data
};
wonderSceneShare=function(back=null){
 const v=wonderSceneResult;if(!v)return;
 const mode=wonderSceneMode;let scores=pawExtraDiscoveries[mode]?pawExtraScore(mode,wonderQuestionOrder,wonderSceneAnswers):null;
 if((mode==='type'||mode==='motive')&&wonderQuestionOrder.length===wonderSceneAnswers.length){
  try{scores=scoreWonder(mode,wonderQuestionOrder,wonderSceneAnswers).scores}catch{}
 }
 openMeowShare({kind:mode,title:v.name,lines:[v.desc],accent:v.color,computedScores:scores},back)
};
const pawRecoveredShareBefore=shareCardArt;
shareCardArt=function(cv,data,format,cn){
 const box=pawRecoveredShareBounds(format),im=pawRecoveredImage('templates/paper_'+format+'.webp');
 if(!box||!im?.complete||im.naturalWidth!==box.width||im.naturalHeight!==box.height){
  if(data.kind==='zwds_chart'){cv.width=box?.width||1080;cv.height=box?.height||1350;const g=cv.getContext('2d');g.fillStyle='#efe1c5';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#4d3a2c';g.textAlign='center';g.font='34px Georgia,serif';g.fillText(cn?'命盘纪念卡 · 请重试':'Chart artwork unavailable · Please retry',cv.width/2,cv.height/2,cv.width-160);return}
  return pawRecoveredShareBefore(cv,data,format,cn)
 }
 if(pawDrawRecoveredLayout(cv,data,format,cn,box,im))return;
 if(data.kind==='zwds_chart'){
  // Never export a generic result if the chart overlay failed to load.
  cv.width=box.width;cv.height=box.height;const g=cv.getContext('2d');
  g.drawImage(im,0,0,cv.width,cv.height);g.textAlign='center';g.fillStyle='#4d3a2c';g.font='34px Georgia,serif';
  g.fillText(cn?'命盘纪念卡 · 请重试':'Chart artwork unavailable · Please retry',cv.width/2,cv.height/2,cv.width-160);return
 }
 const {width:w,height:h,top,bottom,left,right}=box,usable=w-left-right,cx=left+usable/2,locale=v=>String(v?.[Number(cn)]||'');
 cv.width=w;cv.height=h;const g=cv.getContext('2d'),font=cn?'"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif':'Georgia,serif';
 const ink='#4d3a2c',muted='#65765a',accent='#80593d';g.drawImage(im,0,0,w,h);
 function line(value,y,size,weight='normal',color=ink,maxW=usable-24,x=cx){
  g.font=weight+' '+size+'px '+font;g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;g.fillText(value,x,y,maxW)
 }
 // Fit live text as a group, with measured line breaks and no silently omitted result rows.
 function block(values,y,maxH,start=34,weight='normal',color=ink,maxW=usable-44){
  const text=values.filter(v=>typeof v==='string'&&v.trim());if(!text.length||maxH<=0)return y;
  let size=start,rows=[],lh=0,total=0;
  for(;size>=18;size-=2){
   g.font=weight+' '+size+'px '+font;rows=text.map(v=>shareTextLines(g,v,maxW));lh=size*1.26;
   total=rows.reduce((n,a)=>n+a.length,0)*lh+(rows.length-1)*size*.38;
   if(total<=maxH||size===18)break
  }
  const scale=Math.min(1,maxH/Math.max(1,total));
  g.save();g.translate(cx,y);g.scale(1,scale);
  let dy=0;for(const group of rows){for(const v of group){line(v,dy+lh/2,size,weight,color,maxW,0);dy+=lh}dy+=size*.38}
  g.restore();return y+total*scale
 }
 const footer=bottom-65;
 line('Pawradise · '+(cn?'偷得浮生半日闲':'A LITTLE ESCAPE'),top+20,27,'bold',muted);
 let y=top+51;line(locale(shareKinds[data.kind]),y+13,25,'normal',accent);y+=33;
 y=block([locale(data.title)],y,Math.min(120,(bottom-top)*.16),format==='square'?46:54,'bold',ink)+10;
 if(data.kind==='tarot'&&[1,3,5].includes(data.cards.length)){
  const layout=pawRecoveredTarotLayout(box,data.cards.length),atlas=readingArtwork(),usableAtlas=atlas.complete&&atlas.naturalWidth===1024&&atlas.naturalHeight===2180;
  const cardHeight=Math.min(layout.h,Math.max(70,footer-y-135)),cardWidth=cardHeight*128/218,gap=18,total=data.cards.length*cardWidth+(data.cards.length-1)*gap,cardX=cx-total/2;
  if(usableAtlas){
   data.cards.forEach((card,i)=>{const x=cardX+i*(cardWidth+gap),sx=(card.i%8)*128,sy=Math.floor(card.i/8)*218;g.save();g.translate(x+cardWidth/2,y+cardHeight/2);if(card.rev)g.rotate(Math.PI);g.drawImage(atlas,sx,sy,128,218,-cardWidth/2,-cardHeight/2,cardWidth,cardHeight);g.restore()});y+=cardHeight+13
  }
  const roles=data.cards.length===5?fiveReadingPositions:data.cards.length===3?[['Situation','现状'],['Notice','留意'],['Next step','下一步']]:[['Your card','今日之牌']];
  const names=data.cards.map((card,i)=>locale(roles[i])+' · '+locale(tarotDeck[card.i])+(card.rev?(cn?' · 逆位':' · Reversed'):(cn?' · 正位':' · Upright')));
  const remaining=Math.max(65,footer-y-6),nameH=Math.min(remaining*.54,145);
  y=block(names,y,nameH,format==='square'?26:30,'normal',ink)+9;
  block([locale(data.takeaway||socialResultQuote(data))],y,Math.max(38,footer-y-7),format==='square'?30:36,'bold',accent)
 }else{
  const quote=locale(data.kind==='zwds'?data.takeaway:socialResultQuote(data));
  const all=[quote,...data.lines.map(locale)].filter((v,i,a)=>v&&a.indexOf(v)===i);
  block(all,y+Math.min(30,Math.max(0,(footer-y)/12)),Math.max(60,footer-y-30),format==='square'?34:42,'normal',ink)
 }
 g.strokeStyle='#a99772';g.lineWidth=2;g.beginPath();g.moveTo(left+28,footer);g.lineTo(w-right-28,footer);g.stroke();
 line(cn?'趣味探索 · 仅供反思':'For fun and reflection · Pawradise',footer+24,23,'normal',muted);
 if(data.kind==='zwds')line(cn?'不含生辰、时间或地点':'No birth date, time or birthplace included',footer+48,21,'normal',accent)
 else line(cn?'给自己留一点摸鱼时光':'Make a little time for yourself',footer+48,22,'normal',accent)
};


/* Recovered blank ticket frame. Registration remains a real editable form;
   the saved ticket uses the wide illustration's measured slots. */
const pawRecoveredTicketCss=document.createElement('style');
pawRecoveredTicketCss.textContent=`
#proposal[data-paw-entrance-step="4"]:not([hidden]){background:linear-gradient(#1c30278c,#20342cb0),url("assets/visual/painted/recovered/scenes/station_portrait.webp") center/cover no-repeat!important}
@media(orientation:landscape){#proposal[data-paw-entrance-step="4"]:not([hidden]){background:linear-gradient(#1c302765,#20342c91),url("assets/visual/painted/recovered/scenes/station_landscape.webp") center/cover no-repeat!important}}
#proposal[data-paw-entrance-step="4"] .rail-ticket{background:#f4e6c6 url("assets/visual/painted/recovered/ui/paper_texture.webp") center/320px auto repeat!important}
#game #content .passportRailTicket.pawRecoveredTicket{position:relative!important;container-type:inline-size;aspect-ratio:1000/480;min-height:0!important;box-sizing:border-box;width:100%;padding:0!important;border:0!important;border-radius:0!important;background:#f3e5c7 url("assets/visual/painted/recovered/ui/rail_ticket.svg") center/100% 100% no-repeat!important;box-shadow:none!important;color:#4e3d2e;overflow:hidden}
#game .pawRecoveredTicket .pawTicketField{position:absolute;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;box-sizing:border-box;margin:0!important;padding:2px 4px;overflow-wrap:anywhere;line-height:1.12;color:#4e3d2e;text-shadow:none;text-align:left;font-size:clamp(10px,3cqw,17px);overflow:hidden}
#game .pawRecoveredTicket .pawTicketField strong{font-size:inherit;line-height:1.1;margin:0!important}
#game .pawRecoveredTicket .pawTicketField small{font-size:clamp(9px,2.2cqw,13px);line-height:1.1;margin:0!important}
#game .pawRecoveredTicket .pawTicketAvatar{position:absolute;left:6.4%;top:25.4%;width:16.5%;height:53.75%;object-fit:contain;object-position:center bottom}
#game .pawRecoveredTicket [data-ticket-field="heading"]{left:6.5%;top:11.46%;width:68%;height:12.08%;font-weight:bold}
#game .pawRecoveredTicket [data-ticket-field="name"]{left:26%;top:25.42%;width:47.3%;height:13.54%}
#game .pawRecoveredTicket [data-ticket-field="journey"]{left:26%;top:41.46%;width:47.3%;height:13.54%}
#game .pawRecoveredTicket [data-ticket-field="details"]{left:26%;top:57.5%;width:47.3%;height:13.54%;font-size:clamp(9px,2.45cqw,14px)}
#game .pawRecoveredTicket [data-ticket-field="stub"]{left:80%;top:13.54%;width:14.2%;height:43.75%;align-items:center;text-align:center;font-size:clamp(8px,2.2cqw,14px)}
#game .pawRecoveredTicket [data-ticket-field="stamp"]{left:81.1%;top:59.79%;width:11%;height:22.92%;align-items:center;text-align:center;color:#a04e3c;font-weight:bold;font-size:clamp(9px,2.6cqw,17px)}
`;document.head.append(pawRecoveredTicketCss);
const pawRecoveredRailKeepsakeBefore=renderRailKeepsake;
renderRailKeepsake=function(book){
 const data=load('originalRailTicketV1',null);
 if(!data||typeof data!=='object')return pawRecoveredRailKeepsakeBefore(book);
 const ticket=element('section','',book,'passportRailTicket pawRecoveredTicket');
 ticket.setAttribute('aria-label',tr('Your original Pawradise railway ticket','你的 Pawradise 初次入境车票'));
 function field(key,content,label=null){
  const node=element('div','',ticket,'pawTicketField');node.dataset.ticketField=key;
  if(label)element('small',label,node);element('strong',content,node);return node
 }
 field('heading',tr('Pawradise · Railway','Pawradise 铁路'));
 const avatarIndex=Number(data.avatar),portrait=element('img','',ticket,'pawTicketAvatar');
 portrait.src=ART['walker'+(Number.isInteger(avatarIndex)&&avatarIndex>=0&&avatarIndex<4?avatarIndex:0)+'0'];portrait.alt='';
 field('name',String(data.name||tr('Traveller','旅人')),tr('Passenger','旅客'));
 field('journey',tr('Reality → Fortune Valley','现实世界 → 解忧谷'));
 field('details',tr('Valid whenever you need a little escape.','有效期：每一个想摸鱼的瞬间。'));
 const stub=field('stub',String(data.number||'MB'),tr('Original ticket','初次车票'));
 element('small',String(data.issued||tr('Date unknown','日期未记录')),stub);
 field('stamp',tr('VALID','有效'));
};


/* PAW_RECOVERED_ROOM_PLATES: use recovered native portrait paintings only
   behind existing close-up gameplay. Do not replace walking geometry or
   stretch these images to imitate independent landscape compositions. */
/* Room background availability. Use the known original assets first and
   never substitute an unrelated district map for an indoor scene. */
const pawRoomFallbackKeys={
 temple:['streetTemple','sticks'],tarot:['readingInterior','tarot'],destiny:['readingInterior','streetDestiny'],
 wishes:['wishes'],secretGarden:['wishes','park'],tea:['tea'],office:['office'],park:['park'],
 fish:['fish'],kitchen:['kitchen'],boba:['tea','kitchen'],arcade:['arcade'],mystery:['arcade','tea'],
 quiz:['readingInterior','tea'],story:['readingInterior'],match:['tea']
};
const pawCloseupPaths={blindBox:'scenes/blind_box_portrait.webp',templePaper:'scenes/temple_hall_portrait.webp'};
const pawRoomAlias={daily:'tarot',news:'tea',sticks:'temple',moon:'temple'};
const pawRoomWarmJobs=new Map();
function pawRoomImageReady(im){return !!(im?.complete&&im.naturalWidth>0&&im.naturalHeight>0)}
function pawRoomKnownImage(id){return (pawRoomFallbackKeys[id]||[]).map(k=>pics[k]).find(pawRoomImageReady)||null}
function pawWarmRoomAssets(id){
 id=pawRoomAlias[id]||id;
 if(!Object.hasOwn(pawRoomFallbackKeys,id)||pawRoomWarmJobs.has(id))return;
 const images=new Set();
 const add=im=>{if(im)images.add(im)};
 try{
  add(portraitInteriorImage(id));add(landscapeRoomImage(id));
  if(productionVisualManifest[id]){productionVisual(id);add(productionVisualCache.get(id))}
  if(id==='arcade'){add(pawArcadeArt);add(pawRecoveredImage(pawCloseupPaths.blindBox))}
  if(id==='temple')add(pawRecoveredImage(pawCloseupPaths.templePaper));
  if(id==='wishes')add(pawRecoveredImage('scenes/wishing_garden_portrait.webp'));
  for(const k of pawRoomFallbackKeys[id])add(pics[k]);
 }catch{}
 const promises=[...images].filter(im=>!pawRoomImageReady(im)).map(im=>typeof im.decode==='function'?im.decode().catch(()=>{}):Promise.resolve());
 const job=Promise.race([Promise.all(promises),new Promise(resolve=>setTimeout(resolve,2200))]).finally(()=>pawRoomWarmJobs.delete(id));
 pawRoomWarmJobs.set(id,job)
}
function pawRoomPaintFallback(im){
 if(!pawRoomImageReady(im))return false;
 const b=livingBounds();ctx.save();try{cover(im,b.x,b.y,b.w,b.h)}finally{ctx.restore()}return true
}
// Boba was missing from both orientation registries, and its counter
// explicitly requested a null backdrop. Keep the existing tea painting
// while a dedicated boba room plate is not available.
landscapeRoomProfiles.boba={wall:'#a59b80',floor:'#9c7d5e',accent:'#b78c65',keys:['tea','kitchen'],kind:'tea'};
const pawStablePortraitBefore=paintPortraitInterior;
paintPortraitInterior=function(id){
 const im=portraitInteriorImage(id);
 if(!pawRoomImageReady(im)&&id!=='arcade'&&pawRoomPaintFallback(pawRoomKnownImage(id)))return;
 return pawStablePortraitBefore(id)
};
const pawStableWideBefore=paintLandscapeRoom;
paintLandscapeRoom=function(id){
 if(pawArtworkOrientation(W,H)!=='landscape'||!Object.hasOwn(landscapeRoomProfiles,id))return false;
 const profile=landscapeRoomProfiles[id],installed=mbArtImage(mbArtRegistry.rooms[id]?.landscape),generated=landscapeRoomImage(id);
 if(!installed&&!pawRoomImageReady(generated)&&!profile.keys.some(k=>pawRoomImageReady(pics[k]))){
  return pawRoomPaintFallback(pawRoomKnownImage(id))
 }
 return pawStableWideBefore(id)
};
const pawWarmOnDoorBefore=walkDoor;
walkDoor=function(id,...args){pawWarmRoomAssets(id);return pawWarmOnDoorBefore(id,...args)};
const pawWarmOnEnterBefore=enter;
enter=function(id,...args){pawWarmRoomAssets(id);return pawWarmOnEnterBefore(id,...args)};
const pawWarmOnActivityBefore=start;
start=function(id,...args){if(room)pawWarmRoomAssets(room);if(pawCloseupPaths[id])pawRecoveredImage(pawCloseupPaths[id]);return pawWarmOnActivityBefore(id,...args)};
let pawWarmedDistrict='';
function pawWarmNearbyRoom(){
 if(room||activity||transitioning||!proposal.hidden)return;
 const key=scene+'|'+Math.floor(p.y/280);if(key===pawWarmedDistrict)return;pawWarmedDistrict=key;
 const nearest=(maps[scene]?.st||[]).filter(v=>v[0]!=='station').map(v=>({id:v[0],d:Math.hypot(v[1]-p.x,v[2]-p.y)})).sort((a,b)=>a.d-b.d).slice(0,2);
 const work=()=>{for(const v of nearest)pawWarmRoomAssets(v.id)};
 if(typeof requestIdleCallback==='function')requestIdleCallback(work,{timeout:1000});else setTimeout(work,100)
}
const pawWarmLoopBefore=loop;
loop=function(...args){const result=pawWarmLoopBefore(...args);pawWarmNearbyRoom();return result};
const pawRecoveredRoomBackdropBefore=paintLivingBackdrop;
paintLivingBackdrop=function(...args){
 if(room==='boba'&&!args[0]){
  if(pawRoomPaintFallback(pawRoomKnownImage('boba')))return
 }
 if(W<H&&Object.hasOwn(pawCloseupPaths,activity)){
  const path=pawCloseupPaths[activity];
  const art=pawRecoveredImage(path);
  if(art?.complete&&art.naturalWidth>0&&art.naturalHeight>0){
   const bounds=livingBounds();ctx.save();cover(art,bounds.x,bounds.y,bounds.w,bounds.h);ctx.restore();return
  }
 }
 return pawRecoveredRoomBackdropBefore(...args)
};
const pawRecoveredWishPageBefore=wishPond9;
wishPond9=function(...args){
 const result=pawRecoveredWishPageBefore(...args),stage=$('content').querySelector('.pawWishGarden');
 if(stage){
  const path='scenes/wishing_garden_portrait.webp';
  const apply=()=>{if(stage.isConnected)stage.dataset.pawRecoveredGarden='true'};
  pawRecoveredImage(path,apply);
 }
 return result
};
const pawRecoveredGardenCss=document.createElement('style');
pawRecoveredGardenCss.textContent='@media (orientation:portrait){#game #content .pawWishGarden[data-paw-recovered-garden="true"]{background:linear-gradient(#253a2d22,#283d3155),url("assets/visual/painted/recovered/scenes/wishing_garden_portrait.webp") center/cover no-repeat!important}}';
document.head.append(pawRecoveredGardenCss);


/* PAW_TEMPLE_CONTACT_BEGIN */
function pawIncenseFrame(stage,age,held=0,reduced=false){
 const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
 const mix=(a,b,v)=>a+(b-a)*v,sc=1.65;
 const f=(duration)=>ease(age/duration);
 let x=228,y=557,bow=0,walking=false,dir='right',angle=0,pick=null,touch=false;
 if(stage==='approach'){x=mix(185,228,f(1.1));walking=age<1.1}
 if(stage==='walkMat'){x=mix(228,340,f(1.25));y=mix(557,573,f(1.25));walking=age<1.25}
 if(['hold','bow','offer','complete'].includes(stage)){x=340;y=573}
 if(stage==='bow'){const p=Math.max(0,Math.min(1,age/1.8));bow=p<.42?ease(p/.42):p<.58?1:ease((1-p)/.42)}
 // A single hand anchor travels with the torso. Both sleeves end at it.
 let grip={x:x+25+bow*27,y:y-68+bow*22};
 if(stage==='lighting'){
  const v=age<.65?ease(age/.65):age<1.05?1:ease((1.65-age)/.6);
  x=228+34*v;angle=.18*v;
  grip={x:mix(x+25,303-53*Math.sin(angle),v),y:mix(y-68,430+53*Math.cos(angle),v)};
 }
 if(stage==='placing'){
  const p=f(1.85);x=mix(340,480,p);y=mix(573,558,p);walking=age<1.45;
  grip={x:mix(365,510,p),y:mix(505,493,p)}
 }
 if(stage==='returnMat'){x=mix(480,340,f(1.1));y=mix(558,573,f(1.1));dir='left';walking=age<1.1;grip={x:x+25,y:y-68}}
 const bob=walking&&!reduced&&stage==='walkMat'?Math.abs(Math.sin(age*12))*1.6:0;
 grip.y-=bob;y-=bob;
 if(stage==='taking'){
  const rack={x:242+held*12,y:474};
  const reach=age<.32?ease(age/.32):1-ease((age-.32)/.4);
  pick={x:mix(grip.x,rack.x,reach),y:mix(grip.y,rack.y,reach)};
  touch=age>=.32;
 }
 return {x,y,sc,bow,walking,dir,angle,grip,pick,touch}
}
/* PAW_TEMPLE_CONTACT_END */
// Use the recovered original Guanyin painting, cropped above its baked-in
// incense burner. The actual interactive burner remains separate and empty.
function pawGuanyinAltar(x,y,w,h){
 const im=pawRecoveredImage('scenes/temple_hall_portrait.webp');
 if(!pawRoomImageReady(im))return false;
 const sx=im.naturalWidth*.31,sy=im.naturalHeight*.245,sw=im.naturalWidth*.38,sh=im.naturalHeight*.204;
 ctx.save();try{
  ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const k=Math.min(w/sw,h/sh),dw=sw*k,dh=sh*k;
  ctx.drawImage(im,sx,sy,sw,sh,x+(w-dw)/2,y+(h-dh)/2,dw,dh)
 }finally{ctx.restore()}return true
}
const pawTempleSanctuaryArtBefore=pawTempleSanctuary;
pawTempleSanctuary=function(){
 pawTempleSanctuaryArtBefore();
 const [x,y]=pawTempleLayout.prayer;
 pawGuanyinAltar(x-57,y-122,114,107)
};
function pawIncenseArm(shoulder,hand,scale,far=false,skin='#e7bb98'){
 const palette=[['#eee0c7','#957e68'],['#b0b8bc','#576575'],['#71859a','#485764'],['#bca78c','#78634f']];
 const [cloth,edge]=palette[((avatar??0)%4+4)%4];
 const elbow={x:shoulder.x+(hand.x-shoulder.x)*.46-3*scale,y:shoulder.y+(hand.y-shoulder.y)*.62+5*scale};
 const cuff={x:hand.x+(elbow.x-hand.x)*.17,y:hand.y+(elbow.y-hand.y)*.17};
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 const sleeve=(width,color)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(shoulder.x,shoulder.y);ctx.quadraticCurveTo(elbow.x,elbow.y,cuff.x,cuff.y);ctx.stroke()};
 sleeve(8.5*scale,edge);sleeve(6.7*scale,cloth);sleeve(2.0*scale,'#fff1ce44');
 ctx.strokeStyle='#98765d';ctx.lineWidth=5.2*scale;ctx.beginPath();ctx.moveTo(cuff.x,cuff.y);ctx.lineTo(hand.x,hand.y);ctx.stroke();
 ctx.strokeStyle=skin;ctx.lineWidth=4.2*scale;ctx.stroke();
 ellipse(hand.x,hand.y,3.4*scale,4*scale,skin);
 if(!far){ctx.strokeStyle='#a37a60';ctx.lineWidth=.65*scale;ctx.beginPath();ctx.moveTo(hand.x-2*scale,hand.y-1.5*scale);ctx.lineTo(hand.x+2*scale,hand.y-.7*scale);ctx.stroke()}
 ctx.restore()
}
function pawHeldIncense(q,held,lit){
 const {x,y,sc,bow,grip,pick,touch,angle}=q,shoulder={x:x+9*sc+bow*17,y:y-58*sc+bow*12};
 // First paint the body, then the rear sleeve, incense, and near fingers.
 // Thus the sticks visibly sit between two hands instead of over the face.
 if(q.walking)backHuman(x,y,avatar??0,true,q.dir,sc);
 else drawRitualPose(x,y,sc,{bow,praying:true});
 const backHand={x:grip.x-3,y:grip.y+2};
 if(held||pick){
  pawIncenseArm({x:shoulder.x-6,y:shoulder.y+3},backHand,sc,true);
  if(held)incenseBundle(grip.x,grip.y+2,held,angle,lit);
  if(pick&&touch)incenseStem(pick.x,pick.y+1,0,false,53);
  pawIncenseArm(shoulder,pick||grip,sc,false);
  if(held&&pick)ellipse(backHand.x,backHand.y,4.5,5.5,'#e7bb98');
 }
}
function pawTempleContinue(id){
 if(room!=='temple'||activity!=='prayer'||state.prayerStage!=='complete'||transitioning||talkOpen)return;
 const entry=roomGuideEntries().find(v=>v[0]===id);
 if(!entry)return;
 activity=null;state={};roomIntro();updateHUD();const returnState=state;
 // Restore the actual temple position first, then walk along the existing aisle.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(!indoorReady()||room!=='temple'||activity||transitioning||talkOpen||state!==returnState)return;
  const station=indoorStation(id);
  if(!station||!Number.isFinite(station[2])||!Number.isFinite(station[3]))return;
  const [, ,ax,ay]=station;
  if(indoorDestination(ax,ay,()=>{
   if(room==='temple'&&!activity&&!transitioning&&!talkOpen)start(id)
  },'up'))hint('Walking to '+entry[1]+'…','正在走向'+entry[2]+'……')
 }))
}
function pawPrayerStep(){
 const blocked=document.hidden||talkOpen||transitioning||$('page').style.display==='block'||!proposal.hidden;
 // The shared quiet-activity clock already excludes covered and hidden intervals.
 const next=blocked?null:incenseRitualTick(state,t);
 if(next&&incenseStagePrompts[next])hint(...incenseStagePrompts[next]);
 if(next==='walkMat')physicalFx('step',.45);
 if(next==='returnMat')physicalFx('wood',.42);
 if(next==='complete'&&!state.prayerRewarded){state.prayerRewarded=true;lifeEarn('ritual:prayer',{calm:2},true);lifeHUDRefresh()}
 const stage=state.prayerStage,age=Math.max(0,t-state.prayerAt),held=state.prayerHeld||0,lit=state.prayerLit||(stage==='lighting'&&age>=.82);
 const q=pawIncenseFrame(stage,age,held,residentReducedMotion.matches);
 ctx.save();
 paintLivingBackdrop(pics.streetTemple||pics.sticks);
 // Register the character and incense against the actual painted hall.
 // No second deity, table, burner, mat or furniture over the painting.
 if(pawRoomImageReady(pawHallArt())){
  const p=pawHallPlate,xy=(u,v)=>({x:p.x+p.w*u,y:p.y+p.h*v});
  const side=xy(.72,.64),front=xy(.50,.65),offering=xy(.50,.572),rack=xy(.79,.536),burner=xy(.50,.495);
  const blend=(a,b,v)=>({x:a.x+(b.x-a.x)*v,y:a.y+(b.y-a.y)*v});
  const ratio=duration=>poseEase(Math.max(0,Math.min(1,age/duration)));
  let foot=side,dir='right';
  if(stage==='approach'){foot=blend(xy(.51,.73),side,ratio(1.1));dir='right'}
  else if(stage==='walkMat'){foot=blend(side,front,ratio(1.25));dir='left'}
  else if(['hold','bow','offer','complete'].includes(stage)){foot=front;dir='up'}
  else if(stage==='placing'){foot=blend(front,offering,ratio(1.85));dir='up'}
  else if(stage==='returnMat'){foot=blend(offering,front,ratio(1.1));dir='down'}
  const sc=.91,hand={x:foot.x+(dir==='left'?-15:dir==='up'?9:17),y:foot.y-47+q.bow*9};
  // The right-side incense supply is separate from the red fortune tube on the left.
  const reach=stage==='taking'?Math.sin(Math.PI*Math.min(1,age/.72)):stage==='lighting'?Math.sin(Math.PI*Math.min(1,age/1.65)):0;
  const reaching=stage==='taking'&&age>=.32;
  const supply={x:rack.x,y:rack.y+10},flame={x:rack.x+18,y:rack.y-5};
  const lightAngle=stage==='lighting'?1.05*reach:0;
  const lightGrip={x:flame.x-Math.sin(lightAngle)*34,y:flame.y+Math.cos(lightAngle)*34};
  const grip=stage==='placing'?blend(hand,burner,poseEase(Math.max(0,Math.min(1,(age-1.25)/.65)))):stage==='lighting'?blend(hand,lightGrip,reach):blend(hand,supply,Math.min(1,reach*.82));
  const shown=stage==='placing'&&age>=1.98?0:Math.min(3,held+(reaching?1:0));
  // Small incense sticks rest on the painted right counter, never in a second floating table.
  if(['approach','collect','taking','lightReady','lighting'].includes(stage)){
   for(let j=held+(reaching?1:0);j<3;j++){ctx.save();ctx.translate(rack.x+j*3,rack.y+10);ctx.rotate(.14);incenseStem(0,0,.03,false,25);ctx.restore()}
   const candle={x:rack.x+18,y:rack.y+8};ellipse(candle.x,candle.y,5,2,'#5c4533');round(candle.x-2.4,candle.y-12,4.8,12,1,'#bc8053','#93633d');ellipse(candle.x,candle.y-13,2,4,'#ffcf81');
  }
  if(q.walking&&!shown)backHuman(foot.x,foot.y,avatar??0,true,dir,sc);
  else{
   // During the actual bow face the altar, rather than bowing towards
   // an invented side table. Keep the incense at the traveller's hands.
   if(stage!=='bow')backHuman(foot.x,foot.y,avatar??0,q.walking,dir,sc);
   else if(stage==='bow'){ctx.save();try{ctx.translate(foot.x,foot.y);ctx.scale(1,1-.14*q.bow);backHuman(0,0,avatar??0,false,'up',sc)}finally{ctx.restore()}}
   if(shown){
    const shoulder={x:foot.x+(dir==='left'?-6:7),y:foot.y-48+q.bow*9};
    ctx.save();try{
     pawIncenseArm(shoulder,grip,sc,true);
     for(let j=0;j<shown;j++)incenseStem(grip.x+(j-(shown-1)/2)*3.8,grip.y,lightAngle+(j-(shown-1)/2)*.065,lit,34,j===0);
     pawIncenseArm(shoulder,grip,sc,false)
    }finally{ctx.restore()}
   }
  }
  if(state.prayerOffered||stage==='placing'&&age>=1.98){for(let j=0;j<3;j++)incenseStem(burner.x+(j-1)*3,burner.y,0,true,25,j===1)}
  if(stage==='collect')target(rack.x-27,rack.y-40,54,65,()=>requestIncenseAction('take'));
  if(stage==='lightReady')target(rack.x-25,rack.y-35,65,80,()=>requestIncenseAction('light'));
  if(stage==='hold')target(front.x-32,front.y-90,64,100,beginQuietBow);
  if(stage==='offer')target(offering.x-36,offering.y-85,72,95,()=>requestIncenseAction('offer'));
 }else{
  // No duplicate pasted altar while an image is being decoded.
  pawHeldIncense(q,held,lit)
 }
 if(stage==='complete'){
  label(tr('Visit the garden','去后院走走'),400,608,()=>pawTempleContinue('secretGarden'));
  label(tr('Draw a fortune','求签'),310,650,()=>pawTempleContinue('sticks'));
  label(tr('Moon blocks','掷筊'),490,650,()=>pawTempleContinue('moon'))
 }
 ctx.restore();syncRitualBar()
}
/* The rack is a physical scene, not a list page. Preserve the current
 fortune slip so returning does not redraw or lose the player's reading. */
activityTitle.templeRack=['Fortune rack','签文架'];
let pawRackReturn=null;
const pawRackOpenBefore=pawFortuneRackPage;
pawFortuneRackPage=function(){
 if(room!=='temple'||activity!=='templePaper')return pawRackOpenBefore();
 pawRackReturn={activity,state};
 start('templeRack');state.rackSelected=null;state.rackPage=0;state.rackAt=t;
 hint('Tap a paper slip to unfold it.','点一张签纸，展开看看。')
};
function pawCloseTempleRack(){
 if(activity!=='templeRack')return false;
 const previous=pawRackReturn;pawRackReturn=null;
 if(previous){activity=previous.activity;state=previous.state}
 else{activity=null;state={}}
 closeTalk();updateHUD();activityHint();return true
}
const pawTempleRackBackBefore=$('back').onclick;
$('back').onclick=function(...args){if(activity==='templeRack'&&state.rackSelected!==null&&state.rackSelected!==undefined){state.rackSelected=null;return}if(pawCloseTempleRack())return;return pawTempleRackBackBefore.apply(this,args)};
function pawTempleRackDraw(){
 ctx.save();try{
  paintLivingBackdrop(pics.streetTemple||pics.sticks);
  const b=livingBounds(),veil=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);veil.addColorStop(0,'#34271d34');veil.addColorStop(1,'#2b241e9b');shadeLivingBackdrop(veil);
  const all=pawRackEntries(templeTies).filter(v=>Array.isArray(shrinePaperLines[v.number-1])).reverse();
  const pages=Math.max(1,Math.ceil(all.length/21));
  state.rackPage=Math.max(0,Math.min(pages-1,Number.isInteger(state.rackPage)?state.rackPage:0));
  const entries=all.slice(state.rackPage*21,state.rackPage*21+21),sel=entries[state.rackSelected],cx=400;
  // A wooden frame and real rows of tied paper, each with its own hit area.
  round(192,278,416,330,5,'#79593e','#b99b70');
  round(204,292,392,302,3,'#4d3a30','#c1a27b');
  for(let j=0;j<3;j++){
   const yy=338+j*82;line(215,yy,585,yy,'#b28f64',4);
   for(let i=0;i<7;i++){
    const idx=j*7+i,item=entries[idx];if(!item)continue;
    const x=242+i*52;
    ctx.save();ctx.translate(x,yy);ctx.rotate((i%3-1)*.055);
    line(0,-4,0,8,'#bd936e',2);
    round(-17,6,34,55,2,state.rackSelected===idx?'#f8e4a8':'#f0dfbe','#a88d69');
    txt(String(item.number),0,25,15,'#76543c');line(-9,40,9,40,'#a68860',1);line(-9,46,5,46,'#a68860',1);
    ctx.restore();
    if(!sel)target(x-24,yy-8,48,73,()=>{if(activity!=='templeRack'||talkOpen||transitioning)return;state.rackSelected=idx;state.rackAt=t;physicalFx('paper',.42)})
   }
  }
  if(sel){
   const f=residentReducedMotion.matches?1:poseEase((t-state.rackAt)/.25);
   ctx.save();ctx.translate(cx,447);ctx.scale(.7+.3*f,.15+.85*f);
   round(-172,-118,344,236,6,'#ead9b3','#a1845e');round(-159,-105,318,210,3,null,'#b39668');
   activityFitText(tr(...sel.name),0,-78,18,280,'#624b36');
   txt(tr('Fortune ','第 ')+sel.number+(zh?' 签':''),0,-47,18,'#8b6447');
   wonderSceneText(tr(...shrinePaperLines[sel.number-1]),0,-12,280,21,'#5e4937',4);
   activityFitText(sel.fictional?tr('Fictional resident','虚构居民'):tr('Saved on this device','本设备记录'),0,75,13,280,'#856b51');
   ctx.restore();
   label(tr('Fold the paper','收起签纸'),400,590,()=>{state.rackSelected=null})
  }else{
   txt(tr('Choose a fortune to unfold','选一张签纸展开'),400,625,16,'#fff2d6');
   if(pages>1){
    txt((state.rackPage+1)+' / '+pages,400,601,14,'#fff2d6');
    if(state.rackPage>0)label(tr('Previous','上一页'),245,601,()=>{state.rackPage--;state.rackSelected=null});
    if(state.rackPage<pages-1)label(tr('Next','下一页'),555,601,()=>{state.rackPage++;state.rackSelected=null});
   }
  }
  label(tr('Return to your fortune','返回自己的签文'),400,660,pawCloseTempleRack);
 }finally{ctx.restore()}
}
const pawPhysicalPrayerBefore=drawActivity;
drawActivity=function(...args){if(activity==='prayer')return pawPrayerStep();if(activity==='templeRack')return pawTempleRackDraw();return pawPhysicalPrayerBefore(...args)};
const pawTempleFlowGuideBefore=roomGuideEntries;
roomGuideEntries=function(){
 if(room==='temple')return [['templeWater','Purification basin','净手池'],['prayer','Incense & Guanyin altar','上香与观音殿'],['secretGarden','Rear garden','后院'],['sticks','Fortune sticks','求签'],['moon','Moon blocks','掷筊'],['templeBell','Bronze bell','敲钟']];
 return pawTempleFlowGuideBefore()
};

/* PAW_ARCADE_INPUT_BEGIN */
function pawArcadeRhythmClock(q,now,blocked){
 if(!q||q.rhythmStage!=='play'||!Number.isFinite(now)||!Number.isFinite(q.rhythmAt))return false;
 const prior=q.pawRhythmClock;
 if(prior&&Number.isFinite(prior.at)&&now>=prior.at&&(blocked||prior.blocked)){
  const elapsed=now-prior.at;q.rhythmAt+=elapsed;
  if(Number.isFinite(q.rhythmFlash)&&q.rhythmFlash>=0)q.rhythmFlash+=elapsed;
 }
 q.pawRhythmClock={at:now,blocked:!!blocked};return true
}
function pawRhythmInputAllowed(q,lane,now,blocked){
 if(blocked||!q||q.rhythmStage!=='play'||!Number.isInteger(lane)||lane<0||lane>3||!Number.isFinite(now)||!Number.isFinite(q.rhythmAt)||now-q.rhythmAt<-.29)return false;
 const prior=q.pawRhythmTap;
 if(prior&&prior.lane===lane&&now-prior.at<.08)return false;
 q.pawRhythmTap={lane,at:now};return true
}
function pawBlindCanCancel(q,blocked){
 return !blocked&&!!q&&['shake','ready'].includes(q.boxStage)
}
/* PAW_ARCADE_INPUT_END */
function pawArcadeInputBlocked(){return document.hidden||talkOpen||transitioning||!proposal.hidden||$('page').style.display==='block'}
const pawArcadeRhythmBeginBefore=rhythmBegin;
rhythmBegin=function(){
 if(activity!=='rhythm'||pawArcadeInputBlocked())return;
 const result=pawArcadeRhythmBeginBefore();
 if(state.rhythmStage==='play')pawArcadeRhythmClock(state,t,false);
 return result
};
const pawArcadeRhythmHitBefore=rhythmHit;
rhythmHit=function(lane){
 if(activity!=='rhythm'||!pawRhythmInputAllowed(state,lane,t,pawArcadeInputBlocked()))return;
 return pawArcadeRhythmHitBefore(lane)
};
function pawRhythmVisibility(){if(activity==='rhythm')pawArcadeRhythmClock(state,performance.now()/1000,pawArcadeInputBlocked())}
document.addEventListener('visibilitychange',pawRhythmVisibility);
const pawArcadeClockLoopBefore=loop;
loop=function(ms,...args){
 if(activity==='rhythm')pawArcadeRhythmClock(state,ms/1000,pawArcadeInputBlocked());
 return pawArcadeClockLoopBefore(ms,...args)
};
function pawBlindCancel(){
 if(activity!=='blindBox'||!pawBlindCanCancel(state,pawArcadeInputBlocked()))return false;
 drag=null;start('blindBox');return true
}
const pawBlindSelectBefore=boxSelect, pawBlindShakeBefore=boxShake, pawBlindOpenBefore=boxOpen;
boxSelect=function(i){if(!pawArcadeInputBlocked())return pawBlindSelectBefore(i)};
boxShake=function(amount){if(!pawArcadeInputBlocked())return pawBlindShakeBefore(amount)};
boxOpen=function(){if(pawArcadeInputBlocked())return false;return pawBlindOpenBefore()};
const pawBlindAssistSpecBefore=mb5AssistSpec;
mb5AssistSpec=function(kind,q,now){
 if(kind==='blindBox'){
  if(q.boxStage==='shake')return {key:'box-shake',label:['Shake the box','摇一摇盲盒'],action:'box-shake'};
  if(q.boxStage==='ready')return {key:'box-open',label:['Open for 40 Paw Coins','花40爪爪币开盒'],action:'box-open'};
  if(q.boxStage==='opening')return {key:'box-opening',label:['Opening your box…','正在打开盲盒……'],disabled:true}
 }
 return pawBlindAssistSpecBefore(kind,q,now)
};
const pawBlindAssistPerformBefore=mb5AssistPerform;
mb5AssistPerform=function(action){
 if(action!=='box-shake'&&action!=='box-open')return pawBlindAssistPerformBefore(action);
 if(activity!=='blindBox'||pawArcadeInputBlocked())return;
 const spec=mb5AssistSpec(activity,state,t);
 if(spec?.action!==action||spec.disabled)return;
 if(action==='box-shake')boxShake(70);else boxOpen();
 mb5AssistSync()
};

/* PAW_FOOD_CLOCK_BEGIN */
function pawFoodActionAllowed(rendered,current,stage,kind,blocked){
 return !blocked&&kind==='bubbleTea'&&rendered===current&&current?.teaStage===stage
}
function pawFoodClock(q,kind,now,blocked){
 if(!q||!Number.isFinite(now))return false;
 const phase=kind==='bubbleTea'?q.teaStage:kind==='cook'&&q.tasteAt!==undefined&&!q.tasted?'taste':null;
 const field=['pouring','seasoning','sealing','sip'].includes(phase)?'teaAt':phase==='taste'?'tasteAt':null;
 if(!field||!Number.isFinite(q[field])){delete q.pawFoodClock;return false}
 const prior=q.pawFoodClock;
 if(prior&&prior.phase===phase&&prior.field===field&&Number.isFinite(prior.at)&&now>=prior.at&&(blocked||prior.blocked))q[field]+=now-prior.at;
 q.pawFoodClock={at:now,phase,field,blocked:!!blocked};return true
}
/* PAW_FOOD_CLOCK_END */
const pawFoodLoopBefore=loop;
loop=function(ms,...args){
 if(activity==='bubbleTea'||activity==='cook')pawFoodClock(state,activity,ms/1000,pawArcadeInputBlocked());
 return pawFoodLoopBefore(ms,...args)
};
document.addEventListener('visibilitychange',()=>{if(activity==='bubbleTea'||activity==='cook')pawFoodClock(state,activity,performance.now()/1000,pawArcadeInputBlocked())});
const pawFoodAdvanceBefore=pearlAdvance;
pearlAdvance=function(...args){if(activity==='bubbleTea'&&!pawArcadeInputBlocked())return pawFoodAdvanceBefore(...args)};
const pawFoodBaseBefore=selectTeaBase,pawFoodPickBefore=pearlPick,pawFoodPourBefore=pearlPour,pawFoodSealBefore=pearlSeal,pawFoodPearlsBefore=teaAddPearls,pawFoodShakeBefore=teaShake,pawFoodSipBefore=teaSip,pawFoodTasteBefore=soupTaste;
selectTeaBase=function(...args){if(!pawArcadeInputBlocked())return pawFoodBaseBefore(...args)};
pearlPick=function(...args){if(!pawArcadeInputBlocked())return pawFoodPickBefore(...args)};
pearlPour=function(...args){if(!pawArcadeInputBlocked())return pawFoodPourBefore(...args)};
pearlSeal=function(...args){if(!pawArcadeInputBlocked())return pawFoodSealBefore(...args)};
teaAddPearls=function(...args){if(!pawArcadeInputBlocked())return pawFoodPearlsBefore(...args)};
teaShake=function(...args){if(!pawArcadeInputBlocked())return pawFoodShakeBefore(...args)};
teaSip=function(...args){if(!pawArcadeInputBlocked())return pawFoodSipBefore(...args)};
soupTaste=function(...args){if(!pawArcadeInputBlocked())return pawFoodTasteBefore(...args)};

document.addEventListener('keydown',event=>{
 if(activity!=='wonderScene'||wonderScenePhase!=='question'||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target?.matches?.('input,textarea,select,button,[contenteditable=true]')||pawArcadeInputBlocked())return;
 const frame=pawDiscoveryFrame();
 if(/^[1-4]$/.test(event.key)&&wonderSceneData()?.opts[Number(event.key)-1]){event.preventDefault();wonderSceneChoose(Number(event.key)-1,frame)}
 else if(event.key==='Backspace'&&wonderSceneAnswers.length){event.preventDefault();pawDiscoveryBack(frame)}
});

/* Noticeboard: explicit accessible reply disclosure, persistent per notice
   while on the board, and focus-safe refresh. Fictional posts stay separate. */
let pawNoticeDisclosureSerial=0;
const pawNoticeExpanded=new Set();
let pawNoticeShown=6;
function pawNoticeReplyState(button,panel,expanded){
 button.setAttribute('aria-expanded',String(expanded));
 panel.hidden=!expanded;
 button.closest('.wallReplies')?.toggleAttribute('open',expanded);
}
renderResidentNoticeboard=function(q){
 const wrap=element('section','',q,'townWall');
 element('h2',tr('Overheard in town','摸鱼留言墙'),wrap,'board-heading');
 element('p',tr('New town notices arrive over time. Old favourites stay in the archive.','小镇见闻陆续更新，旧瓜也能慢慢翻。'),wrap,'wallIntro');
 element('p',tr(...pawWeekNote()),wrap,'pawWeeklyNotice');
 element('small',tr('Written by the fictional town residents. Real visitor posts are in the shared square.','以下为虚构小镇居民的趣味留言，真人留言请到共享广场。'),wrap,'wallDisclosure');
 const publicBtn=b(wrap,communityURL()?tr('Read or leave a real visitor post','看看真人留言 / 留句话'):tr('Shared square · not open yet','共享广场 · 尚未开放'),()=>{communityTab='public';townChatPage()});publicBtn.className='townBoardPublicLink';
 const list=element('div','',wrap,'townPostList'),nav=element('div','',wrap,'townPostNav');
 let shown=pawNoticeShown,lastCount=-1,lastSignature='';
 function render(){
  const focused=document.activeElement?.closest?.('.wallReplyToggle');
  const focusId=focused&&list.contains(focused)?focused.closest('.wallReplies')?.dataset.noticeId:null;
  const moreFocused=nav.contains(document.activeElement),top=$('page').scrollTop;
  const entries=townPublishedNotices();lastCount=entries.length;lastSignature=entries.map(v=>v.id).join('|');
  list.replaceChildren();nav.replaceChildren();let restore=null;
  for(const {thread:m,date,id} of entries.slice(0,shown)){
   const post=element('article','',list,'townResidentNote');post.dataset.noticeId=id;
   element('strong',tr(...m[0]),post);
   if(date)element('small',new Date(date).toLocaleDateString(zh?'zh-CN':'en-SG',{month:'short',day:'numeric',timeZone:'Asia/Singapore'}),post,'townNoticeDate');
   element('p',tr(...m[1]),post);if(!m[2].length)continue;
   const replies=element('div','',post,'wallReplies');replies.dataset.noticeId=id;
   const toggle=element('button',tr('Read replies','看看楼下怎么说')+' ('+m[2].length+')',replies,'wallReplyToggle');toggle.type='button';
   const panel=element('div','',replies,'wallReplyGroup');panel.id='pawNoticeReplies-'+(++pawNoticeDisclosureSerial);toggle.setAttribute('aria-controls',panel.id);
   for(const reply of m[2]){const row=element('div','',panel,'wallReply');element('strong',tr(reply[0],reply[1]),row);element('p',tr(reply[2],reply[3]),row)}
   pawNoticeReplyState(toggle,panel,pawNoticeExpanded.has(id));
   toggle.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    if(!wrap.isConnected||$('page').style.display!=='block')return;
    const open=toggle.getAttribute('aria-expanded')!=='true';
    if(open)pawNoticeExpanded.add(id);else pawNoticeExpanded.delete(id);
    pawNoticeReplyState(toggle,panel,open)
   });
   if(id===focusId)restore=toggle;
  }
  element('span',Math.min(shown,entries.length)+' / '+entries.length+' '+tr('notices','条见闻'),nav);
  const more=b(nav,tr('Read older notices','翻翻以前的留言'),()=>{shown=pawNoticeShown=pawNoticePageSize(shown,entries.length,6);render()});more.type='button';more.disabled=shown>=entries.length;
  if(restore)restore.focus({preventScroll:true});else if(moreFocused&&!more.disabled)more.focus({preventScroll:true});
  $('page').scrollTop=top;
 }
 render();
 const timer=setInterval(()=>{
  if(!wrap.isConnected||$('page').style.display!=='block'){clearInterval(timer);return}
  const next=townPublishedNotices(),n=next.length;
  if(n!==lastCount||next.map(v=>v.id).join('|')!==lastSignature){shown=pawNoticeShown=pawNoticePageSize(shown,n,Math.max(0,n-lastCount));render()}
 },60000)
};
const pawNoticeDisclosureStyle=document.createElement('style');
pawNoticeDisclosureStyle.textContent='#game #content .wallReplyToggle{display:block;width:100%;min-height:44px;padding:8px 0;text-align:left;border:0;border-radius:0;background:transparent;color:#52684e;box-shadow:none;font:inherit;font-weight:600;touch-action:manipulation;transform:none}#game #content .wallReplyToggle:before{content:"▸";display:inline-block;margin-right:6px}#game #content .wallReplyToggle[aria-expanded=true]:before{content:"▾"}#game #content .wallReplyToggle:focus-visible{outline:2px solid #547056;outline-offset:2px}#game #content .wallReplyGroup[hidden]{display:none!important}#game #content .wallReplyGroup:not([hidden]){display:block!important}#game #page:has(.townWall){scroll-behavior:auto;overflow-anchor:none}';
document.head.append(pawNoticeDisclosureStyle);

/* PAW_CLAW_CONTROL_BEGIN */
function pawClawAllowed(rendered,current,kind,blocked){
 return !blocked&&kind==='claw'&&rendered===current&&!!current&&!current.dropping&&Number.isFinite(current.hook)
}
function pawClawMove(q,delta){
 if(!q||!Number.isFinite(q.hook)||!Number.isFinite(delta)||q.dropping)return false;
 q.hook=Math.max(0,Math.min(1,q.hook+delta));return true
}
function pawClawClock(q,now,blocked){
 if(!q||!Number.isFinite(now))return false;
 const active=q.dropping&&Number.isFinite(q.clawAt),result=q.clawResult&&Number.isFinite(q.clawResult.at);
 if(!active&&!result){delete q.pawClawClock;return false}
 const prior=q.pawClawClock;
 if(prior&&now>=prior.at&&(prior.blocked||blocked)){
  const elapsed=now-prior.at;
  if(active&&prior.active)q.clawAt+=elapsed;
  if(result&&prior.result===q.clawResult)q.clawResult.at+=elapsed
 }
 q.pawClawClock={at:now,blocked:!!blocked,active:!!active,result:result?q.clawResult:null};return true
}
function pawClawAlignment(q){
 if(!q||!Number.isFinite(q.hook))return null;
 const x=286+Math.max(0,Math.min(1,q.hook))*228;
 const positions=[296,400,504];let i=0;
 for(let j=1;j<positions.length;j++)if(Math.abs(positions[j]-x)<Math.abs(positions[i]-x))i=j;
 return {i,distance:Math.abs(positions[i]-x),x}
}
/* PAW_CLAW_CONTROL_END */
const pawClawDropBefore=doClaw;
doClaw=function(){
 if(!pawClawAllowed(state,state,activity,pawArcadeInputBlocked()))return false;
 const run=state,result=pawClawDropBefore();
 if(state===run&&run.dropping){pawClawClock(run,t,false);pawClawSync(true)}
 return result
};
const pawClawFinishBefore=clawFinish;
clawFinish=function(){
 if(activity!=='claw'||!state.dropping||pawArcadeInputBlocked())return;
 const result=pawClawFinishBefore();pawClawClock(state,t,false);pawClawSync(true);return result
};
const pawClawLoopBefore=loop;
loop=function(ms,...args){
 if(activity==='claw')pawClawClock(state,ms/1000,pawArcadeInputBlocked());
 return pawClawLoopBefore(ms,...args)
};
document.addEventListener('visibilitychange',()=>{
 if(activity==='claw')pawClawClock(state,performance.now()/1000,pawArcadeInputBlocked())
});
let pawClawRendered=null,pawClawLanguage=null;
function pawClawSync(force=false){
 const el=$('gameControls');if(!el)return;
 if(activity!=='claw'){
  el.classList.remove('pawClawControls');pawClawRendered=null;return
 }
 const run=state,blocked=pawArcadeInputBlocked();
 if(blocked){el.hidden=true;return}
 el.hidden=false;el.classList.add('pawClawControls');
 if(force||pawClawRendered!==run||pawClawLanguage!==zh||!el.querySelector('.pawClawButtons')){
  const old=document.activeElement?.dataset?.clawAction;
  pawClawRendered=run;pawClawLanguage=zh;el.replaceChildren();
  const status=element('small','',el,'pawClawStatus');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const buttons=element('div','',el,'pawClawButtons');
  const actions=[
   ['left',['Left','左移'],()=>pawClawMove(run,run.clawExpert?-.025:-.07)],
   ['drop',['Lower claw','下夹'],()=>doClaw()],
   ['right',['Right','右移'],()=>pawClawMove(run,run.clawExpert?.025:.07)]
  ];
  for(const [key,words,fn] of actions){const control=b(buttons,tr(...words),()=>{
    if(!pawClawAllowed(run,state,activity,pawArcadeInputBlocked()))return;
    fn();pawClawSync()
   });control.type='button';control.dataset.clawAction=key}
  const mode=b(el,'',()=>{
   if(!pawClawAllowed(run,state,activity,pawArcadeInputBlocked()))return;
   run.clawExpert=!run.clawExpert;run.clawResult=null;pawClawSync()
  });mode.type='button';mode.className='pawClawMode';mode.dataset.clawAction='mode';
  if(old)[...el.querySelectorAll('button')].find(v=>v.dataset.clawAction===old)?.focus({preventScroll:true})
 }
 for(const btn of el.querySelectorAll('button'))btn.disabled=!!run.dropping;
 const mode=el.querySelector('.pawClawMode'),modeText=run.clawExpert?tr('Precision mode: on','精准模式：开'):tr('Precision mode: off','精准模式：关');
 if(mode&&mode.textContent!==modeText){mode.textContent=modeText;mode.setAttribute('aria-pressed',String(!!run.clawExpert))}
 const readout=el.querySelector('.pawClawStatus'),aim=pawClawAlignment(run);
 const text=run.dropping?tr('Claw in motion…','抓取中……'):aim?tr('Nearest: ','最近的玩偶：')+tr(...clawPlushes[aim.i].slice(0,2))+' · '+(aim.distance<=5?tr('Centred','已对准'):aim.distance<=16?tr('Nearly centred','快对准了'):tr('Adjust aim','再调整一下')):'';
 if(readout&&readout.textContent!==text)readout.textContent=text
}
const pawClawControlsBefore=refreshControls;
refreshControls=function(...args){
 const result=pawClawControlsBefore(...args);pawClawSync();return result
};
const pawClawDrawBefore=drawActivity;
drawActivity=function(...args){
 const result=pawClawDrawBefore(...args);if(activity==='claw')pawClawSync();return result
};
document.addEventListener('keydown',event=>{
 if(!pawClawAllowed(state,state,activity,pawArcadeInputBlocked())||event.altKey||event.ctrlKey||event.metaKey||event.target?.matches?.('input,textarea,select,button,[contenteditable=true]'))return;
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
  event.preventDefault();pawClawMove(state,(event.key==='ArrowLeft'?-1:1)*(state.clawExpert?.025:.07));pawClawSync()
 }else if((event.key==='Enter'||event.key===' ')&&!event.repeat){event.preventDefault();doClaw()}
});
const pawClawCss=document.createElement('style');
pawClawCss.textContent='#game #gameControls.pawClawControls:not([hidden]){display:flex;flex-direction:column;gap:4px;width:min(84vw,310px);padding:6px;background:#f2e5ccee;border:1px solid #ad9470;border-radius:6px}#game #gameControls .pawClawButtons{display:flex;gap:4px;width:100%}#game #gameControls .pawClawButtons button{flex:1;min-width:0;min-height:44px;padding:5px}#game #gameControls .pawClawStatus{color:#4c5a47;text-align:center;line-height:1.35}#game #gameControls .pawClawMode{min-height:36px;padding:4px 8px;font-size:12px}';
document.head.append(pawClawCss);

/* PAW_RITUAL_PAUSE_BEGIN */
function pawQuietPhase(kind,q){
 if(!q)return null;
 if(kind==='moon'&&q.moonPending)return ['moon','tossUntil'];
 if(kind==='sticks'&&q.drawing)return ['fall','stickDrawAt','shakeUntil'];
 if(kind==='sticks'&&q.stickPicked&&!q.stickDelivered)return ['pick','stickPickAt'];
 if(kind==='prayer'&&['approach','taking','lighting','walkMat','bow','placing','returnMat'].includes(q.prayerStage))return [q.prayerStage,'prayerAt'];
 if(kind==='templeWater'&&q.waterStage===2)return ['rinse','waterAt'];
 if(kind==='templeBell'&&Number.isFinite(q.bellAt)&&q.bellAt>=0)return ['ring','bellAt'];
 if(kind==='blindBox'&&q.boxStage==='opening')return ['open','boxAt'];
 return null
}
function pawQuietClock(q,kind,now,blocked){
 if(!q||!Number.isFinite(now))return false;
 const phase=pawQuietPhase(kind,q),prior=q.pawQuietClock;
 if(!phase||!Number.isFinite(q[phase[1]])){delete q.pawQuietClock;return false}
 const key=kind+'|'+phase[0],primary=phase[1];
 if(prior&&prior.key===key&&prior.value===q[primary]&&now>=prior.at&&(blocked||prior.blocked)){
  const elapsed=now-prior.at;
  for(const field of phase.slice(1))if(Number.isFinite(q[field]))q[field]+=elapsed
 }
 q.pawQuietClock={key,at:now,value:q[primary],blocked:!!blocked};return true
}
function pawQuietActionMatches(rendered,current,kind,expectedKind,phase,expectedPhase,blocked){
 return !blocked&&!!current&&rendered===current&&kind===expectedKind&&phase===expectedPhase
}
/* PAW_RITUAL_PAUSE_END */
const pawQuietKinds=new Set(['moon','sticks','prayer','templeWater','templeBell','blindBox']);
const pawQuietLoopBefore=loop;
loop=function(ms,...args){
 if(pawQuietKinds.has(activity))pawQuietClock(state,activity,ms/1000,pawArcadeInputBlocked());
 return pawQuietLoopBefore(ms,...args)
};
document.addEventListener('visibilitychange',()=>{
 if(pawQuietKinds.has(activity))pawQuietClock(state,activity,performance.now()/1000,pawArcadeInputBlocked())
});
const pawQuietBellBefore=templeReleaseBell,pawQuietWaterBefore=templeReleaseWater;
templeReleaseBell=function(...args){
 if(activity!=='templeBell'||pawArcadeInputBlocked())return;
 return pawQuietBellBefore(...args)
};
templeReleaseWater=function(...args){
 if(activity!=='templeWater'||pawArcadeInputBlocked())return;
 return pawQuietWaterBefore(...args)
};
const pawQuietRitualBarBefore=syncRitualBar;
syncRitualBar=function(...args){
 const result=pawQuietRitualBarBefore(...args);
 if(activity!=='prayer'||ritualActionBar.hidden)return result;
 const control=ritualActionBar.querySelector('button');
 if(!control||control.dataset.pawQuietGuard)return result;
 control.dataset.pawQuietGuard='true';
 const run=state,stage=run.prayerStage,action=control.onclick;
 control.onclick=function(event){
  if(pawQuietActionMatches(run,state,activity,'prayer',state.prayerStage,stage,pawArcadeInputBlocked()))return action?.call(this,event)
 };
 return result
};
const pawQuietBoxAwardBefore=boxAward;
boxAward=function(...args){
 if(activity!=='blindBox'||state.boxStage!=='opening'||pawArcadeInputBlocked())return;
 return pawQuietBoxAwardBefore(...args)
};

/* PAW_PAPER_BOARD_BEGIN */
function pawPaperClock(run,now,blocked){
 if(!run||!Number.isFinite(now))return null;
 const action=run.paperAction,prep=Number.isFinite(run.paperPrepAt),owner=action||null;
 const start=action? action.at : prep?run.paperPrepAt:null;
 if(!Number.isFinite(start)){delete run.pawPaperClock;return null}
 const phase=action?'strike':'prep',prior=run.pawPaperClock;
 let shift=0;
 if(prior&&prior.phase===phase&&prior.owner===owner&&prior.start===start&&now>=prior.now&&(blocked||prior.blocked)){
  shift=now-prior.now;
  if(action)action.at+=shift;else run.paperPrepAt+=shift
 }
 run.pawPaperClock={phase,owner,start:start+shift,now,blocked:!!blocked};
 return action?{strikeAt:action.at,shift}:null
}
function pawNoticePageSize(shown,total,increment){
 return Math.max(6,Math.min(Math.max(0,total),Math.max(6,shown)+Math.max(0,increment)))
}
/* PAW_PAPER_BOARD_END */
function pawPaperSyncClock(now){
 const value=pawPaperClock(state,now,pawArcadeInputBlocked());
 if(value)stressSwingAt=value.strikeAt
}
const pawPaperLoopBefore=loop;
loop=function(ms,...args){
 if(activity==='hit'&&room==='fish')pawPaperSyncClock(ms/1000);
 return pawPaperLoopBefore(ms,...args)
};

/* PAW_CARE_CONTINUITY_BEGIN */
function pawCareActiveClock(a,now,blocked){
 if(!a||!Number.isFinite(now))return false;
 const field=a.phase==='return'?'returnAt':a.phase==='idle'?null:'at';
 if(!field||!Number.isFinite(a[field])){delete a.activeClock;return false}
 const prior=a.activeClock;
 if(prior&&prior.phase===a.phase&&prior.start===a[field]&&now>=prior.now&&(blocked||prior.blocked)){
  const gap=now-prior.now;a[field]+=gap;
  if(Number.isFinite(a.tickAt))a.tickAt+=gap
 }
 a.activeClock={phase:a.phase,start:a[field],now,blocked:!!blocked};return true
}
function pawCareControlAllowed(rendered,current,action,blocked){
 return !blocked&&!!current&&rendered===current&&current.phase==='idle'&&!current.drag&&['feed','water','pet','play','rest'].includes(action)
}
function pawCareAssistedReady(a,now,blocked){
 return !blocked&&!!a?.assisted&&Number.isFinite(a.at)&&Number.isFinite(now)&&
 ((a.phase==='pet'&&now-a.at>=2.3)||(a.phase==='play'&&now-a.at>=3.2))
}
function pawCareCancelDrag(a,now){
 if(!a?.drag)return null;
 const id=a.drag.id;a.drag=null;a.stroke=0;
 if((a.phase==='pet'||a.phase==='play')&&!a.assisted){
  a.phase='return';a.returnFromX=a.x;a.returnFromY=a.y;a.returnAt=now
 }
 return id
}
/* PAW_CARE_CONTINUITY_END */
function pawCareInterrupt(now){
 if(!careIsActive())return;
 const a=state.care,blocked=pawArcadeInputBlocked();
 if(blocked)pawCareDropPointer(a,now);
 pawCareActiveClock(a,now,blocked)
}
function pawCareDropPointer(a,now){
 const id=pawCareCancelDrag(a,now);
 if(id===null)return;
 try{if(c.hasPointerCapture(id))c.releasePointerCapture(id)}catch{}
 careSync()
}
// The existing visibility listener calls this dynamic function. One active
// clock now owns timing; no independent visibility shift or wall-clock reward.
pawCareVisibility=function(hidden,now){pawCareInterrupt(now)};
const pawCareLoopBefore=loop;
loop=function(ms,...args){pawCareInterrupt(ms/1000);return pawCareLoopBefore(ms,...args)};
const pawCareTickBefore=careTick;
careTick=function(){
 if(!careIsActive()||pawArcadeInputBlocked())return;
 const a=state.care;const result=pawCareTickBefore();
 if(state.care===a&&pawCareAssistedReady(a,t,false))careComplete(a.phase);
 return result
};
const pawCareStartActionBefore=careStart;
careStart=function(action){
 if(!careIsActive()||!pawCareControlAllowed(state.care,state.care,action,pawArcadeInputBlocked()))return;
 return pawCareStartActionBefore(action)
};
const pawCareCompleteBefore=careComplete;
careComplete=function(action){
 if(!careIsActive()||pawArcadeInputBlocked()||state.care.phase!==action||!careCan(state.care.values,action))return;
 const a=state.care,id=a.drag?.id,result=pawCareCompleteBefore(action);
 if(id!==undefined&&id!==null)try{if(c.hasPointerCapture(id))c.releasePointerCapture(id)}catch{}
 return result
};
const pawCareControlsBefore=refreshControls;
refreshControls=function(...args){
 const result=pawCareControlsBefore(...args);
 if(!careIsActive())return result;
 const rendered=state.care;
 for(const button of $('gameControls').querySelectorAll('[data-care]')){
  const action=button.dataset.care;
  button.onclick=()=>{
   if(!careIsActive()||!pawCareControlAllowed(rendered,state.care,action,pawArcadeInputBlocked())||!careCan(rendered.values,action))return;
   careStart(action);
   if(rendered.phase===action&&(action==='pet'||action==='play'))rendered.assisted=true
  }
 }
 return result
};
const pawCareCaptureBefore=careCapture;
careCapture=function(e){
 if(!careIsActive())return false;
 if(pawArcadeInputBlocked()){pawCareDropPointer(state.care,performance.now()/1000);return false}
 return pawCareCaptureBefore(e)
};
window.addEventListener('blur',()=>{if(careIsActive())pawCareDropPointer(state.care,performance.now()/1000)});
window.addEventListener('resize',()=>{if(careIsActive())pawCareDropPointer(state.care,performance.now()/1000)});
const pawCareStartRunBefore=start;
start=function(...args){
 if(careIsActive())pawCareDropPointer(state.care,performance.now()/1000);
 return pawCareStartRunBefore(...args)
};
const pawCareBackBefore=$('back').onclick;
$('back').onclick=function(...args){
 if(careIsActive())pawCareDropPointer(state.care,performance.now()/1000);
 return pawCareBackBefore.apply(this,args)
};


/* PAW_TAROT_CONTINUITY_BEGIN */
function pawTarotActive(q,kind){return !!q&&['tarot','love'].includes(kind)&&typeof q.readStage==='string'}
function pawTarotClock(q,now,blocked){
 if(!q||!Number.isFinite(now))return false;
 const prior=q.pawReadClock,flips=Array.isArray(q.readFlip)?q.readFlip:null;
 if(prior&&now>=prior.now&&(blocked||prior.blocked)){
  const gap=now-prior.now;
  if(prior.stage===q.readStage&&prior.start===q.readAt&&Number.isFinite(q.readAt))q.readAt+=gap;
  if(flips&&prior.flips===flips)for(let i=0;i<flips.length;i++){
   if(Number.isFinite(flips[i])&&flips[i]>=0&&flips[i]===prior.values[i]&&prior.now-flips[i]<.73)flips[i]+=gap
  }
 }
 q.pawReadClock={now,blocked:!!blocked,stage:q.readStage,start:q.readAt,flips,values:flips?flips.slice():[]};return true
}
function pawTarotActionAllowed(rendered,current,kind,expectedKind,stage,portrait,expectedPortrait,blocked){
 return !blocked&&pawTarotActive(current,kind)&&rendered===current&&kind===expectedKind&&current.readStage===stage&&portrait===expectedPortrait
}
function pawTarotKeyMove(index,key,portrait,chosen=[]){
 const cols=portrait?4:6,delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-cols,ArrowDown:cols}[key];
 if(!Number.isInteger(delta))return null;
 let next=Number.isInteger(index)&&index>=0&&index<12?index:0;
 for(let n=0;n<12;n++){
  next=(next+delta+12)%12;
  if(!chosen.includes(next))return next
 }
 return null
}
function pawTarotKeyFirst(chosen=[]){
 for(let i=0;i<12;i++)if(!chosen.includes(i))return i;
 return null
}
/* PAW_TAROT_CONTINUITY_END */
const pawTarotLoopBefore=loop;
loop=function(ms,...args){
 if(pawTarotActive(state,activity))pawTarotClock(state,ms/1000,pawArcadeInputBlocked());
 return pawTarotLoopBefore(ms,...args)
};
document.addEventListener('visibilitychange',()=>{
 if(pawTarotActive(state,activity))pawTarotClock(state,performance.now()/1000,pawArcadeInputBlocked())
});
// Capture the exact session, stage and viewport for rendered tarot hit areas.
const pawTarotTargetBefore=target;
target=function(x,y,w,h,fn,id){
 if(!pawTarotActive(state,activity)||typeof fn!=='function')return pawTarotTargetBefore(x,y,w,h,fn,id);
 const run=state,kind=activity,stage=run.readStage,portrait=W<H;
 return pawTarotTargetBefore(x,y,w,h,function(...args){
  if(pawTarotActionAllowed(run,state,activity,kind,stage,W<H,portrait,pawArcadeInputBlocked()))return fn.apply(this,args)
 },id)
};
const pawTarotShuffleGuard=readingShuffle,pawTarotDealGuard=readingDeal,pawTarotRevealGuard=readingReveal,pawTarotShowGuard=readingShow,pawTarotSaveGuard=readingSave;
readingShuffle=function(...args){if(pawTarotActive(state,activity)&&!pawArcadeInputBlocked())return pawTarotShuffleGuard(...args)};
readingDeal=function(...args){if(pawTarotActive(state,activity)&&!pawArcadeInputBlocked())return pawTarotDealGuard(...args)};
readingReveal=function(...args){if(pawTarotActive(state,activity)&&!pawArcadeInputBlocked())return pawTarotRevealGuard(...args)};
readingShow=function(...args){if(pawTarotActive(state,activity)&&!pawArcadeInputBlocked())return pawTarotShowGuard(...args)};
readingSave=function(...args){if(pawTarotActive(state,activity)&&!pawArcadeInputBlocked())return pawTarotSaveGuard(...args)};
const pawTarotKeyboard=new WeakMap();
document.addEventListener('keydown',event=>{
 if(!pawTarotActive(state,activity)||pawArcadeInputBlocked()||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target?.matches?.('input,textarea,select,button,[contenteditable=true]'))return;
 const q=state,key=event.key,stage=q.readStage;
 if(stage==='choose'){
  const frame=q.pawChoiceFrame,chosen=q.pawSelectedCards||[];
  if(!pawTarotFrameMatches(q,frame,W<H))return;
  let index=pawTarotKeyboard.get(q);
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)){
   event.preventDefault();
   index=index===undefined?pawTarotKeyFirst(chosen):pawTarotKeyMove(index,key,W<H,chosen);
   if(index!==null)pawTarotKeyboard.set(q,index);
  }else if(key==='Enter'||key===' '){
   event.preventDefault();
   const pick=index!==undefined&&!chosen.includes(index)?index:pawTarotKeyFirst(chosen);
   if(pick!==null&&pawSelectTarotCard(pick,frame)){
    const next=pawTarotKeyFirst(q.pawSelectedCards);if(next!==null)pawTarotKeyboard.set(q,next)
   }
  }
 }else if(stage==='deck'&&(key==='Enter'||key===' ')){
  event.preventDefault();if(q.readShuffle)readingDeal();else readingShuffle()
 }else if(stage==='cards'&&/^[1-3]$/.test(key)){
  const i=Number(key)-1;if(!q.readCards?.[i])return;
  event.preventDefault();if(q.readFlip[i]<0)readingReveal(i);else readingShow(i)
 }else if(stage==='focus'&&key==='Escape'){
  event.preventDefault();readingReturnSpread()
 }
});
const pawTarotKeyboardDrawBefore=drawActivity;
drawActivity=function(...args){
 const result=pawTarotKeyboardDrawBefore(...args);
 if(pawTarotActive(state,activity)&&state.readStage==='choose'&&pawTarotKeyboard.has(state)){
  const index=pawTarotKeyboard.get(state),q=pawTarotChoiceSlots(W<H)[index];
  if(q&&!state.pawSelectedCards?.includes(index)){
   ctx.save();try{ctx.strokeStyle='#fff3bf';ctx.lineWidth=3;ctx.strokeRect(q.x-q.w/2-5,q.y-q.h/2-5,q.w+10,q.h+10)}finally{ctx.restore()}
  }
 }
 return result
};

/* PAW_TEMPLE_SCENE_BEGIN */
// World-space registration traced from the recovered portrait hall, not
// from its former placeholder SVG. The painted cabinet, altar and door
// already exist in the plate; never draw another copy on top of them.
const pawHallPlate={x:100,y:-145,w:600,h:600*1648/928};
const pawHallStations={
 templeWater:[190,637,270,700],
 prayer:[400,399,400,495],
 templeBell:[610,629,530,700],
 sticks:[155,386,280,535],
 moon:[620,443,520,560],
 secretGarden:[598,359,540,495]
};
const pawHallFloorObstacles=[
 {l:100,r:243,u:430,d:628}, // left cabinet and flower stand
 {l:558,r:700,u:440,d:645}, // right table and stools
 {l:172,r:213,u:672,d:685}, // independent basin foot
 {l:578,r:642,u:679,d:690} // bell frame foot
];
const pawHallLabels={
 templeWater:[190,655,'Rinse hands','净手'],
 prayer:[400,429,'Offer incense','上香祈福'],
 templeBell:[610,650,'Ring bell','敲钟'],
 sticks:[160,416,'Draw a fortune','求签'],
 moon:[620,470,'Cast moon blocks','掷筊'],
 secretGarden:[598,333,'Rear garden →','后院 →']
};
function pawHallScreenRect(rect,view){
 const {x,y,w,h}=rect,{s,ox,oy}=view;
 if(![x,y,w,h,s,ox,oy].every(Number.isFinite)||s<=0||w<=0||h<=0)return null;
 return {left:ox+x*s,top:oy+y*s,right:ox+(x+w)*s,bottom:oy+(y+h)*s}
}
function pawHallOverlap(a,b){
 return !!a&&!!b&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top
}
function pawHallActorScale(height,reference,ratio=1){
 return Number.isFinite(height)&&height>0&&Number.isFinite(reference)&&reference>0?height/reference*Math.max(.75,Math.min(1.1,ratio)):1
}
/* PAW_TEMPLE_SCENE_END */
const pawHallArtPath='scenes/temple_hall_portrait.webp';
pawRecoveredImage(pawHallArtPath);
pawRecoveredImage('scenes/temple_approach_portrait.webp');
pawRecoveredImage('scenes/wishing_garden_portrait.webp');
let pawHallVisit=false;
function pawHallArt(){return pawRecoveredImage(pawHallArtPath)}
function pawHallEnabled(){return room==='temple'&&!activity&&pawHallVisit&&pawRoomImageReady(pawHallArt())}
const pawHallEnterBefore=enter;
enter=function(id,...args){
 if(id==='temple')pawHallVisit=pawRoomImageReady(pawHallArt());
 return pawHallEnterBefore(id,...args)
};
const pawHallSpecBefore=indoorSpec;
indoorSpec=function(){
 const spec=pawHallSpecBefore();
 if(pawHallEnabled())return {...spec,entry:[400,735],arrival:[400,700],stations:pawHallStations};
 return spec
};
const pawHallObstaclesBefore=indoorObstacles;
indoorObstacles=function(){
 if(pawHallEnabled())return pawHallFloorObstacles.map(v=>({...v}));
 return pawHallObstaclesBefore()
};
const pawHallBackgroundBefore=templeRitualBackground;
templeRitualBackground=function(){
 if(!pawHallEnabled())return pawHallBackgroundBefore();
 const art=pawHallArt(),b=livingBounds(),p=pawHallPlate;
 ctx.save();try{
  ctx.fillStyle='#493b30';ctx.fillRect(b.x,b.y,b.w,b.h);
  ctx.drawImage(art,p.x,p.y,p.w,p.h)
 }finally{ctx.restore()}
};
const pawHallPropBefore=prop;
prop=function(id,x,y){
 if(!pawHallEnabled()||!Object.hasOwn(pawHallStations,id))return pawHallPropBefore(id,x,y);
 pawStationPlaque={room,id,x,y,spec:groundedStationSpec(room,id),at:t};
 if(id==='prayer'){
  // The hall image already contains Guanyin and the incense burner.
  const a=roomResidentStations.temple;drawGatheringPainted(a.n,a.x,a.y,a.sc,a.facing);
 }else if(id==='templeWater'){
  ctx.save();try{ctx.translate(x,y);ctx.scale(.66,.66);drawGroundedSupport(['stone',0,100,65],0,0);templeBasin(0,-14);templeLadle(0,-45,-.1)}finally{ctx.restore()}
 }else if(id==='templeBell'){
  ctx.save();try{ctx.translate(x,y);ctx.scale(.70,.70);drawGroundedSupport(['bell',0,102,86],0,0);templeBellArt(0,-16,.37)}finally{ctx.restore()}
 }else if(id==='moon'){
  // Small wooden blocks on the already-painted side table.
  ctx.save();try{ctx.translate(x,y);ctx.scale(.43,.43);block(-31,0,0);block(31,0,.15)}finally{ctx.restore()}
 }
 // The fortune tube and garden doorway are already visible in the artwork.
};
const pawHallLabelBefore=label;
label=function(name,x,y,fn){
 if(!pawHallEnabled())return pawHallLabelBefore(name,x,y,fn);
 const id=pawStationPlaque?.id||(Math.abs(x-pawHallStations.secretGarden[0])<2?'secretGarden':null);
 const q=pawHallLabels[id];if(!q)return pawHallLabelBefore(name,x,y,fn);
 pawStationPlaque=null;
 const [anchorX,cy,en,cn]=q,scale=Math.max(.08,cam.scale),font=Math.min(19,Math.max(14,11/scale));
 ctx.save();try{
  ctx.font='600 '+font+'px Georgia,"Songti SC",serif';
  const value=tr(en,cn),w=Math.min(124,Math.max(55,ctx.measureText(value).width+12)),h=font+11;
  const minX=(5-cam.ox)/scale+w/2,maxX=(W-5-cam.ox)/scale-w/2,cx=Math.max(minX,Math.min(maxX,anchorX));
  const rect=pawHallScreenRect({x:cx-w/2,y:cy-h/2,w,h},{s:scale,ox:cam.ox,oy:cam.oy});
  // Keep signs near the painted station, not on a visitor's face.
  if(rect&&rect.left>=4&&rect.right<=W-4&&rect.top>=4&&rect.bottom<=H-4&&![...meowTextFrameRects,...meowFrameBlockers].some(b=>pawHallOverlap(rect,b))){
   round(cx-w/2,cy-h/2,w,h,3,'#503b2ce8','#d7ba83');
   activityFitText(value,cx,cy,font,w-8,'#fff1d7');
   meowTextFrameRects.push(rect);pawVisibleStationLabels.add(id);
  }
  const hitW=Math.max(w,44/scale),hitH=Math.max(h,44/scale);
  target(cx-hitW/2,cy-hitH/2,hitW,hitH,fn);
 }finally{ctx.restore()}
};
// A keeper is a person at the edge of the aisle, not a decoration attached
// to the basin. Preserve one optional visitor, with an uncluttered main path.
Object.assign(roomResidentStations.temple,{x:300,y:615,sc:.88,facing:'right'});
pawRoomVisitorSpecs.temple={count:1,points:[[480,625],[475,590],[325,675]]};
const pawHallGatherBefore=drawGatheringPainted;
drawGatheringPainted=function(name,x,y,scale=1,facing='right'){
 if(room==='temple'&&!activity){
  const record=residentArtworkRecord(name);
  if(record)scale=pawHallActorScale(94*travellerRoomScale(H,cam.scale),record.height,.95)
 }
 return pawHallGatherBefore(name,x,y,scale,facing)
};
const pawHallActorsBefore=roomResidentActors;
roomResidentActors=function(){
 const actors=pawHallActorsBefore();
 if(room!=='temple'||activity)return actors;
 return actors.map(a=>({...a,sc:pawHallActorScale(94*travellerRoomScale(H,cam.scale),residentArtworkRecord(a.n)?.height||112,.95)}))
};
// All rooms: reserve physical station hit regions and visible canvas labels
// when placing an ambient speech bubble; suppress it if no safe space exists.
const pawHallAmbientPlaceBefore=pawAmbientPlace;
pawAmbientPlace=function(actor,actors){
 if(!room)return pawHallAmbientPlaceBefore(actor,actors);
 if(activity||!indoorReady()||indoor.goal||Math.hypot(indoor.tx-indoor.x,indoor.ty-indoor.y)>3)return false;
 const root=$('game').getBoundingClientRect(),view={s:cam.scale,ox:cam.ox,oy:cam.oy};
 const stationary=hit.filter(v=>v.stationId).map(v=>pawHallScreenRect(v,view)).filter(Boolean);
 const visitors=pawLocalVisitors.filter(pawVisitorVisible).map(a=>meowIndoorActorBounds(a));
 const blocks=[...stationary,...meowTextFrameRects,...visitors];
 if(!pawHallAmbientPlaceBefore(actor,actors))return false;
 const r=pawAmbientNode.getBoundingClientRect(),rect={left:r.left-root.left,top:r.top-root.top,right:r.right-root.left,bottom:r.bottom-root.top};
 return !blocks.some(b=>pawHallOverlap(rect,b))
};
// Reuse an inspected original painting in the ritual close-ups rather than
// the flat SVG. It is an interim shared plate; individual clean stations and
// wide variants still need their own painting and contact-point calibration.
const pawHallPortraitBefore=paintPortraitInterior;
paintPortraitInterior=function(id){
 if(room==='temple'&&['sticks','moon'].includes(activity)&&pawRoomImageReady(pawHallArt())){
  const b=livingBounds();cover(pawHallArt(),b.x,b.y,b.w,b.h);return
 }
 return pawHallPortraitBefore(id)
};
const pawHallLivingBefore=paintLivingBackdrop;
paintLivingBackdrop=function(...args){
 if(room==='temple'&&['prayer','templePaper','templeRack','templeBell','templeWater'].includes(activity)){
  const outdoor=['templeBell','templeWater'].includes(activity),art=pawRecoveredImage(outdoor?'scenes/temple_approach_portrait.webp':pawHallArtPath);
  if(pawRoomImageReady(art)){const b=livingBounds();if(activity==='prayer'){const p=pawHallPlate;ctx.fillStyle='#493b30';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.drawImage(art,p.x,p.y,p.w,p.h)}else cover(art,b.x,b.y,b.w,b.h);return}
 }
 return pawHallLivingBefore(...args)
};
// Keep the agreed ritual order in the optional guide, without forcing
// players to repeat rituals or blocking the garden.
const pawHallGuideBefore=roomGuideEntries;
roomGuideEntries=function(){
 if(room!=='temple')return pawHallGuideBefore();
 return ['templeWater','templeBell','prayer','sticks','moon','secretGarden'].map(id=>[id,...pawHallLabels[id].slice(2).map(v=>v.replace(/\s*→$/,''))])
};

/* PAW_FORECOURT_BEGIN */
const pawForecourtPlate={x:100,y:-145,w:600,h:600*1648/928};
const pawForecourtStart=[.49,.82],pawForecourtLanding=[.47,.58],pawForecourtCat=[.57,.64];
function pawForecourtWorld(p){
 return [pawForecourtPlate.x+p[0]*pawForecourtPlate.w,pawForecourtPlate.y+p[1]*pawForecourtPlate.h]
}
function pawForecourtRoute(q,kind){
 if(!q||q.route?.length||!['cat','hall','exit'].includes(kind))return false;
 const [x,y]=q.pos;
 if(![x,y].every(Number.isFinite))return false;
 // The paving narrows towards the torii. Both destinations stay on the
 // actual stone steps, on the inside of the right-hand railing.
 const goal=kind==='cat'?pawForecourtCat:kind==='exit'?pawForecourtStart:pawForecourtLanding;
 const route=[];
 if(kind==='exit'){
  if(x>.52)route.push([.48,.64]);
  if(y<.73)route.push([.47,.73]);
 }else{
  if(y>.73)route.push([.47,.73]);
  if(kind==='hall'&&x>.52)route.push([.48,.64]);
 }
 route.push(goal.slice());
 q.route=route;q.destination=kind;return true
}
function pawForecourtTick(q,now,blocked,reduced=false){
 if(!q||!Number.isFinite(now))return null;
 const elapsed=Number.isFinite(q.last)?Math.max(0,Math.min(.05,now-q.last)):0;q.last=now;
 if(blocked||!q.route?.length)return null;
 const from=pawForecourtWorld(q.pos),next=q.route[0],to=pawForecourtWorld(next),d=Math.hypot(to[0]-from[0],to[1]-from[1]);
 const step=reduced?d:Math.min(d,elapsed*120);
 if(d>0)q.pos=[q.pos[0]+(next[0]-q.pos[0])*step/d,q.pos[1]+(next[1]-q.pos[1])*step/d];
 if(d<=step+.01){q.pos=next.slice();q.route.shift();if(!q.route.length){const kind=q.destination;q.destination=null;return kind}}
 return null
}
function pawForecourtCamera(w,h){
 const p=pawForecourtPlate;
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return null;
 const s=Math.min(w/p.w,h/p.h);
 return {s,ox:(w-p.w*s)/2-p.x*s,oy:(h-p.h*s)/2-p.y*s}
}
/* PAW_FORECOURT_END */
activityTitle.templeForecourt=['Lucky cat forecourt','招福猫参道'];
let pawForecourtPending=false;
const pawForecourtEnterBefore=enter;
enter=function(id,...args){
 pawForecourtPending=id==='temple'&&pawRoomImageReady(pawRecoveredImage('scenes/temple_approach_portrait.webp'));
 return pawForecourtEnterBefore(id,...args)
};
const pawForecourtIntroBefore=roomIntro;
roomIntro=function(...args){
 const result=pawForecourtIntroBefore(...args);
 if(!pawForecourtPending||room!=='temple'||activity)return result;
 pawForecourtPending=false;
 start('templeForecourt');state.pawForecourt={pos:pawForecourtStart.slice(),route:[],destination:null,last:t};
 hint('Follow the stone path. The lucky cat is on your right.','沿着石阶向前走，右侧是招福猫。');
 return result
};
function pawForecourtChoose(kind,run=state){
 if(activity!=='templeForecourt'||room!=='temple'||run!==state||pawArcadeInputBlocked())return;
 const q=run.pawForecourt;if(!pawForecourtRoute(q,kind))return;
 hint(...(kind==='cat'?['Walking over to the lucky cat.','走近招福猫。']:kind==='exit'?['Heading back down the stone path.','沿着石阶走回山门。']:['Follow the stone steps to the hall.','沿着石阶走进大殿。']))
}
const pawForecourtCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(...args){
 if(activity==='templeForecourt')return pawForecourtCamera(W,H)||pawForecourtCameraBefore(...args);
 return pawForecourtCameraBefore(...args)
};
const pawForecourtDrawBefore=drawActivity;
drawActivity=function(...args){
 if(activity!=='templeForecourt')return pawForecourtDrawBefore(...args);
 const art=pawRecoveredImage('scenes/temple_approach_portrait.webp'),q=state.pawForecourt;
 if(!q||!pawRoomImageReady(art))return;
 const run=state,p=pawForecourtPlate;
 const arrival=pawForecourtTick(q,t,pawArcadeInputBlocked(),residentReducedMotion.matches);
 if(arrival==='exit'){
  if(run===state){pawForecourtClearControls();activity=null;state={};pawForecourtPending=false;continuityRoom=null;pawForecourtBackBefore.call($('back'))}
  return
 }
 if(arrival==='hall'){
  // Preserve the actual hall visit and return to its real entrance point.
  if(run===state){pawForecourtClearControls();pawHallVisit=pawRoomImageReady(pawHallArt());activity=null;state={};continuityRoom=null;roomIntro();updateHUD()}
  return
 }
 if(arrival==='cat'){
  q.greeted=true;
  hint('The lucky cat wishes you a quiet, unhurried day.','招福猫祝你今天从容自在，不必匆忙。');
  if(!muted)physicalFx('wood',.25)
 }
 pawForecourtSyncControls(run);
 const b=livingBounds();
 ctx.save();try{
  ctx.fillStyle='#344338';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.drawImage(art,p.x,p.y,p.w,p.h);
  const [x,y]=pawForecourtWorld(q.pos),moving=q.route.length>0,d=q.route[0];
  const dir=moving?(Math.abs((d[0]-q.pos[0])*p.w)>Math.abs((d[1]-q.pos[1])*p.h)?(d[0]>q.pos[0]?'right':'left'):(d[1]<q.pos[1]?'up':'down')):(q.greeted?'right':'up');
  backHuman(x,y,avatar??0,moving&&!residentReducedMotion.matches,dir,.92+(q.pos[1]-.58)*1.05);
  if(!moving){
   const cat=pawForecourtWorld([.69,.34]),catEnd=pawForecourtWorld([.97,.55]);
   target(cat[0],cat[1],catEnd[0]-cat[0],catEnd[1]-cat[1],()=>pawForecourtChoose('cat',run),'paw-forecourt-cat');
   const landing=pawForecourtWorld([.47,.51]),left=pawForecourtWorld([.30,.46]),right=pawForecourtWorld([.65,.61]);
   target(left[0],left[1],right[0]-left[0],right[1]-left[1],()=>pawForecourtChoose('hall',run),'paw-forecourt-hall');
   // Compact directions live on the stair path, never on the cat or traveller.
   label(tr('Temple hall ↑','大殿 ↑'),landing[0],landing[1],()=>pawForecourtChoose('hall',run))
  }
 }finally{ctx.restore()}
};
document.addEventListener('keydown',event=>{
 if(activity!=='templeForecourt'||pawArcadeInputBlocked()||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target?.matches?.('input,textarea,select,button,[contenteditable=true]'))return;
 if(event.key==='Enter'||event.key==='ArrowUp'){event.preventDefault();pawForecourtChoose('hall')}
 if(event.key.toLowerCase()==='c'){event.preventDefault();pawForecourtChoose('cat')}
});
// Exit through the same approach and return down the actual stone path.
const pawForecourtBackBefore=$('back').onclick;
$('back').onclick=function(...args){
 if(activity==='templeForecourt'){
  if(!pawArcadeInputBlocked()&&!state.pawForecourt?.route?.length)pawForecourtChoose('exit');
  return
 }
 if(pawHallEnabled()&&indoorReady()&&continuityRoom==='temple'){
  if(indoor.goal)return;
  releaseWalkKeys();joystickReset();
  const [x,y]=indoorSpec().entry;
  const enterForecourt=()=>{
   if(room!=='temple'||activity)return;
   start('templeForecourt');state.pawForecourt={pos:pawForecourtLanding.slice(),route:[],destination:null,last:t,greeted:false,catVisited:true};
   hint('Walk down the path to return to Fortune Valley.','沿石阶走下去，回到福运谷。');
   updateHUD()
  };
  if(Math.hypot(indoor.x-x,indoor.y-y)<=4)enterForecourt();
  else if(indoorDestination(x,y,enterForecourt,'down'))hint('Heading back to the temple entrance…','正在走向寺庙入口……');
  return
 }
 return pawForecourtBackBefore.apply(this,args)
};
function pawForecourtControlModel(q,blocked){
 if(!q||!Array.isArray(q.route))return null;
 return {busy:!!q.route.length||!!blocked,greeted:!!q.greeted}
}
let pawForecourtControlsRun=null,pawForecourtControlsKey='';
function pawForecourtClearControls(){
 const el=$('gameControls');
 if(!el?.classList.contains('pawForecourtControls'))return;
 el.querySelectorAll('[data-paw-forecourt-control]').forEach(n=>n.remove());
 el.classList.remove('pawForecourtControls');
 if(!el.children.length)el.hidden=true;
 pawForecourtControlsRun=null;pawForecourtControlsKey=''
}
function pawForecourtSyncControls(run){
 const el=$('gameControls'),model=pawForecourtControlModel(run?.pawForecourt,pawArcadeInputBlocked());
 if(!el||run!==state||activity!=='templeForecourt'||!model){pawForecourtClearControls();return}
 if(pawArcadeInputBlocked()){if(el.classList.contains('pawForecourtControls'))el.hidden=true;return}
 const key=String(zh)+'|'+model.busy+'|'+model.greeted;
 if(pawForecourtControlsRun===run&&pawForecourtControlsKey===key&&el.querySelectorAll('[data-paw-forecourt-control]').length===3){el.hidden=false;return}
 el.replaceChildren();el.classList.remove('mb5ActivityAssist');el.classList.add('pawForecourtControls');el.hidden=false;
 pawForecourtControlsRun=run;pawForecourtControlsKey=key;
 for(const [id,en,cn] of [['cat',model.greeted?'Greet again':'Greet lucky cat',model.greeted?'再次招呼':'拜访招福猫'],['hall','Enter hall','进入大殿'],['exit','Return to valley','返回福运谷']]){
  const button=b(el,tr(en,cn),()=>pawForecourtChoose(id,run));button.dataset.pawForecourtControl=id;button.disabled=model.busy
 }
}
const pawForecourtControlCSS=document.createElement('style');
pawForecourtControlCSS.textContent=`
#game #gameControls.pawForecourtControls:not([hidden]){display:flex;flex-wrap:wrap;justify-content:center;gap:5px;width:max-content;max-width:calc(100% - 24px);padding:5px;border:1px solid #ad9470;border-radius:8px;background:#f3e5cfea}
#game #gameControls.pawForecourtControls button{font-size:clamp(12px,3vw,14px);min-height:44px;white-space:normal;padding:6px 8px;min-width:0}
@media (orientation:landscape) and (min-width:740px){#game #gameControls.pawForecourtControls:not([hidden]){left:auto;right:12px;transform:none;max-width:190px;flex-direction:column;align-items:stretch}}
`;
document.head.append(pawForecourtControlCSS);
const pawForecourtCleanupLoopBefore=loop;
loop=function(...args){
 if(activity!=='templeForecourt')pawForecourtClearControls();
 return pawForecourtCleanupLoopBefore(...args)
};

/* PAW_TEMPLE_JOURNEY_BEGIN */
function pawFortuneSlipNumber(v){return Number.isInteger(v)&&v>=1&&v<=12?v:null}
function pawFortuneNext(q,kind,now,blocked){
 if(blocked||!q||!pawFortuneSlipNumber(q.pawFortuneNumber))return null;
 if(kind==='sticks'&&q.stickDelivered)return 'choice';
 if(kind==='moon'&&!q.moonPending&&!(q.tossUntil>now))return q.count>0?'receive':'confirm';
 return null
}
function pawFortuneAction(q,current,kind,now,blocked,action){
 if(q!==current)return false;
 const next=pawFortuneNext(q,kind,now,blocked);
 return action==='receive'?['choice','receive','confirm'].includes(next):action==='confirm'&&next==='choice'
}
function pawTempleCatVisit(q){
 if(!q||q.catVisited)return false;
 q.catVisited=true;return true
}
function pawTemplePaperClock(q,now,blocked){
 if(!q||!Number.isFinite(now))return false;
 if(!['opening','kept','tied'].includes(q.paperStage)||!Number.isFinite(q.paperAt)){delete q.pawPaperPause;return false}
 const prev=q.pawPaperPause;
 if(prev&&prev.stage===q.paperStage&&prev.start===q.paperAt&&now>=prev.now&&(prev.blocked||blocked))q.paperAt+=now-prev.now;
 q.pawPaperPause={stage:q.paperStage,start:q.paperAt,now,blocked:!!blocked};return true
}
/* PAW_TEMPLE_JOURNEY_END */
// One meaningful encounter per forecourt visit, using the existing local
// cat memories and blessing keepsake. No second reward for repeated taps.
const pawForecourtBlessingTickBefore=pawForecourtTick;
pawForecourtTick=function(q,...args){
 const arrival=pawForecourtBlessingTickBefore(q,...args);
 if(arrival==='cat'&&pawTempleCatVisit(q))meetTempleCat();
 return arrival
};
// Keep the actual number picked up by the player. Confirmation is optional,
// not a new random draw and not a condition for receiving a fortune.
const pawOriginalFortunePaper=templePaperOpen;
templePaperOpen=function(n){
 if(room==='temple'&&activity==='sticks'&&state.stickDelivered&&pawFortuneSlipNumber(n)){
  state.pawFortuneNumber=n;
  hint('Your numbered stick is ready. Confirm with moon blocks, or receive the slip directly.','已拾到签号。可以掷筊确认，也可以直接领取签文。');
  mb5AssistSync(true);return
 }
 return pawOriginalFortunePaper(n)
};
function pawFortuneReceive(run=state){
 if(!pawFortuneAction(run,state,activity,t,pawArcadeInputBlocked(),'receive'))return false;
 const n=run.pawFortuneNumber;
 delete run.pawFortuneNumber;
 pawOriginalFortunePaper(n);return true
}
/* PAW_FORTUNE_WALK_BEGIN */
function pawFortuneWalkPhase(q,v){
 if(!q||v.room!=='temple'||v.activity||v.state!==q.hallState)return 'cancel';
 if(v.blocked||!v.ready)return 'wait';
 if(v.goal&&v.goal!==q.arrive)return 'cancel';
 if(v.goal===q.arrive)return 'walking';
 if(q.started)return v.moving?'wait':'restore';
 return 'route'
}
/* PAW_FORTUNE_WALK_END */
let pawFortuneWalk=null;
function pawFortuneRestoreWalk(q){
 if(pawFortuneWalk!==q||state!==q.hallState||room!=='temple'||activity)return;
 pawFortuneWalk=null;
 activity='sticks';state=q.run;updateHUD();mb5AssistSync(true);
 hint('Your numbered stick is safe. Continue to moon blocks, or receive the slip here.','签号已保留。可以继续前往筊杯处，也可以直接领取签文。')
}
function pawFortuneWalkTick(){
 const q=pawFortuneWalk;if(!q)return;
 const phase=pawFortuneWalkPhase(q,{room,activity,state,blocked:pawArcadeInputBlocked(),ready:indoorReady()&&continuityRoom==='temple'&&continuityActivity===null,goal:indoor.goal,moving:Math.hypot(indoor.tx-indoor.x,indoor.ty-indoor.y)>3});
 if(phase==='cancel'){pawFortuneWalk=null;return}
 if(phase==='restore'){pawFortuneRestoreWalk(q);return}
 if(phase!=='route')return;
 const station=indoorStation('moon');
 q.started=true;
 if(!indoorDestination(station[2],station[3],q.arrive,'up'))pawFortuneRestoreWalk(q)
}
function pawFortuneConfirm(run=state){
 if(!pawFortuneAction(run,state,activity,t,pawArcadeInputBlocked(),'confirm'))return false;
 const n=run.pawFortuneNumber;
 releaseWalkKeys();joystickReset();
 activity=null;state={};roomIntro();updateHUD();
 const q={run,hallState:state,started:false,arrive:null};
 q.arrive=()=>{
  if(pawFortuneWalk!==q||room!=='temple'||activity||state!==q.hallState||pawArcadeInputBlocked())return;
  pawFortuneWalk=null;start('moon');state.pawFortuneNumber=n;
  hint('If you wish, toss the moon blocks once. Your fortune is still yours regardless of the result.','可以掷一次筊杯确认。无论结果如何，都能领取自己的签文。');
  mb5AssistSync(true)
 };
 pawFortuneWalk=q;
 return true
}
const pawFortuneWalkLoopBefore=loop;
loop=function(...args){const result=pawFortuneWalkLoopBefore(...args);pawFortuneWalkTick();return result};
const pawFortuneAssistSpecBefore=mb5AssistSpec;
mb5AssistSpec=function(kind,q,now){
 const next=pawFortuneNext(q,kind,now,false);
 if(next==='choice')return {key:'fortune-confirm',label:['Confirm with moon blocks','掷筊确认'],action:'fortune-confirm'};
 if(next==='receive')return {key:'fortune-receive',label:['Receive your fortune slip','领取签文'],action:'fortune-receive'};
 return pawFortuneAssistSpecBefore(kind,q,now)
};
const pawFortuneAssistPerformBefore=mb5AssistPerform;
mb5AssistPerform=function(action){
 if(action==='fortune-confirm')return pawFortuneConfirm();
 if(action==='fortune-receive')return pawFortuneReceive();
 return pawFortuneAssistPerformBefore(action)
};
const pawFortuneAssistSyncBefore=mb5AssistSync;
mb5AssistSync=function(...args){
 const result=pawFortuneAssistSyncBefore(...args),el=$('gameControls'),run=state;
 if(!el)return result;
 const next=pawFortuneNext(run,activity,t,pawArcadeInputBlocked()),old=el.querySelector('[data-paw-fortune-skip]');
 if(!['choice','confirm'].includes(next)){old?.remove();return result}
 if(!old||old.pawRun!==run||old.pawLanguage!==zh){
  old?.remove();
  const skip=b(el,tr('Receive slip without confirmation','直接领取签文'),()=>pawFortuneReceive(run));
  skip.dataset.pawFortuneSkip='true';skip.pawRun=run;skip.pawLanguage=zh;skip.className='mb5ActivityButton'
 }
 return result
};
const pawFortuneMoonTossBefore=pawMoonToss;
pawMoonToss=function(...args){
 if(activity==='moon'&&pawFortuneSlipNumber(state.pawFortuneNumber)&&state.count>0)return false;
 return pawFortuneMoonTossBefore(...args)
};
// Pause the complete paper reveal and keep/tie motion during interruptions.
const pawTemplePaperLoopBefore=loop;
loop=function(ms,...args){
 if(activity==='templePaper')pawTemplePaperClock(state,ms/1000,pawArcadeInputBlocked());
 return pawTemplePaperLoopBefore(ms,...args)
};
document.addEventListener('visibilitychange',()=>{
 if(activity==='templePaper')pawTemplePaperClock(state,performance.now()/1000,pawArcadeInputBlocked())
});
const pawTemplePaperTapBefore=templePaperTap,pawTemplePaperKeepBefore=templePaperKeep;
templePaperTap=function(...args){if(activity==='templePaper'&&!pawArcadeInputBlocked())return pawTemplePaperTapBefore(...args)};
templePaperKeep=function(...args){if(activity==='templePaper'&&!pawArcadeInputBlocked())return pawTemplePaperKeepBefore(...args)};
// Use the recovered painted garden, rather than the generic park, on both
// mobile and desktop. The existing koi/chime/seat interaction coordinates
// remain unchanged; a clean independent garden plate is still needed.
const pawTempleGardenArt=pawRecoveredImage('scenes/wishing_garden_portrait.webp');
const pawTempleGardenBackdropBefore=paintLivingBackdrop;
paintLivingBackdrop=function(...args){
 if(room==='temple'&&activity==='secretGarden'&&pawRoomImageReady(pawTempleGardenArt)){
  const b=livingBounds();cover(pawTempleGardenArt,b.x,b.y,b.w,b.h);return
 }
 return pawTempleGardenBackdropBefore(...args)
};

/* PAW_TEMPLE_ADMISSION_BEGIN */
function pawTempleAdmissionValid(request,current,view){
 return !!request&&request===current&&request.scene===view.scene&&!view.room&&!view.activity&&!view.transitioning&&!view.blocked&&!view.pending&&
 Math.hypot(view.x-request.x,view.y-request.y)<=12
}
function pawTempleAssetsReady(approach,hall){
 return [approach,hall].every(im=>!!im&&im.complete&&im.naturalWidth>0&&im.naturalHeight>0)
}
/* PAW_TEMPLE_ADMISSION_END */
let pawTempleAdmission=null;
function pawTempleAdmissionView(){
 return {scene,room,activity,transitioning,blocked:pawArcadeInputBlocked(),pending,x:p.x,y:p.y}
}
function pawTempleDecode(im){
 if(!im)return Promise.resolve(false);
 if(im.complete)return Promise.resolve(im.naturalWidth>0);
 return new Promise(resolve=>{
  let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);im.removeEventListener('load',load);im.removeEventListener('error',error);resolve(ok)};
  const load=()=>finish(im.naturalWidth>0),error=()=>finish(false);
  const timer=setTimeout(error,6000);
  im.addEventListener('load',load);im.addEventListener('error',error);
  if(im.complete)load()
 })
}
const pawTempleDoorEnterBefore=enter;
enter=function(id,...args){
 if(id!=='temple'){pawTempleAdmission=null;return pawTempleDoorEnterBefore(id,...args)}
 if(room||activity||transitioning||pawArcadeInputBlocked())return;
 const approach=pawRecoveredImage('scenes/temple_approach_portrait.webp'),hall=pawHallArt();
 if(pawTempleAssetsReady(approach,hall)){pawTempleAdmission=null;return pawTempleDoorEnterBefore(id,...args)}
 if(pawTempleAdmissionValid(pawTempleAdmission,pawTempleAdmission,pawTempleAdmissionView()))return;
 const request={scene,x:p.x,y:p.y};pawTempleAdmission=request;
 releaseWalkKeys();joystickReset();stopRoute();pending=null;walkQueue=[];p.tx=p.x;p.ty=p.y;
 hint('Preparing the painted temple…','正在准备寺庙的画卷……');
 Promise.all([pawTempleDecode(approach),pawTempleDecode(hall)]).then(()=>{
  if(!pawTempleAdmissionValid(request,pawTempleAdmission,pawTempleAdmissionView())){
   if(pawTempleAdmission===request)pawTempleAdmission=null;return
  }
  pawTempleAdmission=null;
  if(pawTempleAssetsReady(approach,hall))pawTempleDoorEnterBefore(id,...args);
  else hint('The temple artwork could not load. Tap the doorway to try again.','寺庙画面暂未加载成功，请再次点击门口重试。')
 })
};
const pawTempleAdmissionLoopBefore=loop;
loop=function(...args){
 if(pawTempleAdmission&&!pawTempleAdmissionValid(pawTempleAdmission,pawTempleAdmission,pawTempleAdmissionView()))pawTempleAdmission=null;
 return pawTempleAdmissionLoopBefore(...args)
};


/* PAW_TEMPLE_SCREENSHOT_REPAIR_BEGIN */
function pawTempleFullCamera(w,h,plate){
 if(![w,h,plate?.w,plate?.h].every(Number.isFinite)||w<=0||h<=0||plate.w<=0||plate.h<=0)return null;
 const s=Math.max(w/plate.w,h/plate.h);
 return {s,ox:(w-plate.w*s)/2-plate.x*s,oy:(h-plate.h*s)/2-plate.y*s}
}
function pawGardenWaterPoint(i,time,feedAge){
 const f=Math.max(0,Math.min(1,1-feedAge/4)),angle=time*(.32+i*.04)+i*2.094;
 return [.57+Math.cos(angle)*.075*(1-f*.65),.444+Math.sin(angle)*.022*(1-f*.65)]
}
/* PAW_TEMPLE_SCREENSHOT_REPAIR_END */
const pawGardenPlate={...pawHallPlate};
const pawTempleFullCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(...args){
 if(room==='temple'&&W<H&&(pawHallEnabled()||activity==='prayer'||activity==='secretGarden')){
  return pawTempleFullCamera(W,H,activity==='secretGarden'?pawGardenPlate:pawHallPlate)||pawTempleFullCameraBefore(...args)
 }
 if(room==='temple'&&['prayer','secretGarden'].includes(activity)){
  const p=activity==='secretGarden'?pawGardenPlate:pawHallPlate,s=Math.min(W/p.w,H/p.h);return {s,ox:(W-p.w*s)/2-p.x*s,oy:(H-p.h*s)/2-p.y*s}
 }
 return pawTempleFullCameraBefore(...args)
};

/* PAW_GARDEN_WALK_BEGIN */
const pawGardenStations={feed:[.51,.55],seat:[.83,.64],chime:[.34,.61]};
function pawGardenRoute(q,action){
 if(!q||q.route?.length||!Object.hasOwn(pawGardenStations,action))return false;
 const dest=pawGardenStations[action],from=q.pos,route=[];
 if(Math.hypot(from[0]-dest[0],from[1]-dest[1])<.012){q.route=[dest.slice()];q.action=action;return true}
 if(from[0]>.68)route.push([.67,.69]);
 else if(from[1]<.60)route.push([.51,.61]);
 if(action==='seat')route.push([.67,.69],[.78,.68]);
 if(action==='chime')route.push([.43,.62]);
 if(action==='feed')route.push([.51,.61]);
 route.push(dest.slice());q.route=route;q.action=action;return true
}
function pawGardenWalkTick(q,now,blocked,reduced=false){
 if(!q||!Number.isFinite(now))return null;
 const dt=Number.isFinite(q.last)?Math.max(0,Math.min(.05,now-q.last)):0;q.last=now;
 if(blocked||!q.route?.length)return null;
 const goal=q.route[0],dx=(goal[0]-q.pos[0])*600,dy=(goal[1]-q.pos[1])*(600*1648/928),dist=Math.hypot(dx,dy),step=reduced?dist:Math.min(dist,dt*145);
 if(dist>0){q.pos[0]+=(goal[0]-q.pos[0])*step/dist;q.pos[1]+=(goal[1]-q.pos[1])*step/dist}
 if(dist<=step+.01){q.pos=goal.slice();q.route.shift();if(!q.route.length){const a=q.action;q.action=null;return a}}
 return null
}
/* PAW_GARDEN_WALK_END */
function pawGardenChoose(run,kind){
 if(run!==state||activity!=='secretGarden'||pawArcadeInputBlocked())return;
 const q=run.pawGardenWalk;if(!q||q.route.length)return;
 if(kind==='seat'&&run.gardenSitting){gardenSeat();return}
 if(run.gardenSitting){gardenSeat();if(run.gardenSitting)return}
 if(pawGardenRoute(q,kind))hint(...({feed:['Walking to the koi pond…','走向锦鲤池……'],seat:['Walking to the bench…','走向长椅……'],chime:['Walking to the wind chime…','走向风铃……']}[kind]))
}
const pawGardenDrawBefore=drawActivity;
drawActivity=function(...args){
 if(room!=='temple'||activity!=='secretGarden'||!pawRoomImageReady(pawTempleGardenArt))return pawGardenDrawBefore(...args);
 const run=state,p=pawGardenPlate,b=livingBounds(),xy=(u,v)=>[p.x+p.w*u,p.y+p.h*v];
 if(!run.pawGardenWalk)run.pawGardenWalk={pos:[.49,.72],route:[[.51,.61],[.51,.55]],action:null,last:t,dir:'up'};
 const q=run.pawGardenWalk,prior=q.pos.slice(),arrive=pawGardenWalkTick(q,t,pawArcadeInputBlocked(),residentReducedMotion.matches);
 if(arrive==='feed')gardenFeed();else if(arrive==='seat')gardenSeat();else if(arrive==='chime')gardenChime();
 const dx=(q.pos[0]-prior[0])*p.w,dy=(q.pos[1]-prior[1])*p.h;
 if(Math.hypot(dx,dy)>.01)q.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
 continuityActivity=activity;
 ctx.save();try{
  ctx.fillStyle='#344238';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.drawImage(pawTempleGardenArt,p.x,p.y,p.w,p.h);
  const feedAge=Math.max(0,t-run.gardenFeedAt),water=xy(.57,.444);
  // The water and koi silhouettes in the original painting remain visible.
  // Small moving surface ripples and food, not a second pond or flat fish.
  if(feedAge<3){
   for(let j=0;j<4;j++){
    const f=Math.max(0,Math.min(1,(feedAge-j*.12)/2.1));
    if(f>0&&f<1){ctx.strokeStyle='rgba(242,239,207,'+(.45*(1-f))+')';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(water[0]+j*5,water[1]+j%2*6,3+f*22,1+f*5,0,0,TAU);ctx.stroke()}
   }
   if(feedAge<.85)for(let j=0;j<5;j++){const f=Math.min(1,feedAge/.65);ellipse(water[0]-16+j*7,water[1]-(1-f)*32,1.6,1.6,'#d9c08d')}
  }
  const [x,y]=xy(...q.pos),moving=q.route.length>0;
  if(run.gardenSitting&&!moving)drawRitualPose(x,y,.85,{seat:1});
  else backHuman(x,y,avatar??0,moving&&!residentReducedMotion.matches,q.dir||'up',.9);
  // The wind chime is attached to the painted stall eave on the left.
  const [wx,wy]=xy(.205,.385);
  ctx.save();try{ctx.translate(wx,wy);ctx.scale(.30,.30);gardenWindChime(0,0)}finally{ctx.restore()}
  const [bx,by]=xy(.83,.625);
  if(!moving){
   target(bx-36,by-34,72,68,()=>pawGardenChoose(run,'seat'));
   target(water[0]-55,water[1]-20,110,40,()=>pawGardenChoose(run,'feed'));
   target(wx-32,wy-24,64,62,()=>pawGardenChoose(run,'chime'))
  }
 }finally{ctx.restore()}
 pawGardenControls(run)
};
let pawGardenControlsRun=null,pawGardenControlsKey='';
function pawGardenClearControls(){
 const el=$('gameControls');if(!el?.classList.contains('pawGardenControls'))return;
 el.querySelectorAll('[data-paw-garden-control]').forEach(v=>v.remove());el.classList.remove('pawGardenControls');if(!el.children.length)el.hidden=true;
 pawGardenControlsRun=null;pawGardenControlsKey=''
}
function pawGardenControls(run){
 const el=$('gameControls');if(!el||run!==state||activity!=='secretGarden')return;
 if(pawArcadeInputBlocked()){el.hidden=true;return}
 const busy=!!run.pawGardenWalk?.route.length,key=String(zh)+'|'+run.gardenSitting+'|'+busy;
 if(pawGardenControlsRun===run&&pawGardenControlsKey===key&&el.querySelectorAll('[data-paw-garden-control]').length===3){el.hidden=false;return}
 el.replaceChildren();el.classList.remove('mb5ActivityAssist');el.classList.add('pawGardenControls');el.hidden=false;pawGardenControlsRun=run;pawGardenControlsKey=key;
 for(const [name,en,cn] of [['feed','Feed koi','喂锦鲤'],['seat',run.gardenSitting?'Stand up':'Sit by pond',run.gardenSitting?'起身':'池边小坐'],['chime','Wind chime','听风铃']]){
  const button=b(el,tr(en,cn),()=>pawGardenChoose(run,name));button.dataset.pawGardenControl=name;button.disabled=busy
 }
}
const pawGardenCleanupBefore=loop;
loop=function(...args){if(activity!=='secretGarden')pawGardenClearControls();return pawGardenCleanupBefore(...args)};
const pawTempleLayoutCSS=document.createElement('style');
pawTempleLayoutCSS.textContent=`
#game #gameControls.mb5ActivityAssist:not([hidden]){display:grid!important;grid-template-columns:minmax(0,1fr)!important;box-sizing:border-box!important;width:min(92vw,360px)!important;max-width:calc(100% - 24px)!important;gap:5px!important}
@media(max-height:540px){#game #gameControls.mb5ActivityAssist:not([hidden]){grid-template-columns:repeat(auto-fit,minmax(120px,1fr))!important;width:min(80vw,430px)!important}}
#game #gameControls.mb5ActivityAssist .mb5ActivityButton{box-sizing:border-box!important;min-width:0!important;width:100%!important;white-space:normal!important;overflow-wrap:anywhere;font-size:clamp(12px,3.4vw,15px)!important}
#game #gameControls.pawGardenControls:not([hidden]){display:flex!important;flex-wrap:wrap;justify-content:center;max-width:calc(100% - 24px);box-sizing:border-box;width:max-content;gap:5px;border-radius:8px;background:#f1e4caed;border:1px solid #b69a70}
#game #gameControls.pawGardenControls button{min-width:0;min-height:44px;white-space:normal;font-size:clamp(12px,3.3vw,14px);padding:6px 9px}
`;
document.head.append(pawTempleLayoutCSS);


/* PAW_TEMPLE_PHYSICAL_SCENES_BEGIN */
function pawTemplePoint(plate,u,v){return [plate.x+u*plate.w,plate.y+v*plate.h]}
function pawTempleStickPose(q,now){
 const age=Math.max(0,now-(q.stickDrawAt??now)),picked=!!q.stickPicked,done=!!q.stickDelivered;
 const fall=q.fallenStick?1:Math.max(0,Math.min(1,(age-.38)/.87));
 const pick=picked?Math.max(0,Math.min(1,(now-q.stickPickAt)/.85)):0;
 return {fall,pick,picked,done,shake:!!q.drawing&&age<.38,show:!!(q.fallenStick||q.drawing&&age>=.38)}
}
function pawTempleBellMotion(q,now,dragged=0){
 const age=now-q.bellAt,pull=Math.min(45,Math.max(0,dragged)),strength=q.bellStrength||0;
 const swing=pull?-pull:age>=0&&age<.22?-34*strength*(1-age/.22):age>=.22&&age<1.5?-Math.abs(Math.sin((age-.22)*5))*18*strength*Math.exp(-age):0;
 return {age,swing,impact:age>=.22&&age<4?Math.sin((age-.22)*16)*Math.exp(-(age-.22)*1.7)*strength*.045:0}
}
/* PAW_TEMPLE_PHYSICAL_SCENES_END */
function pawTempleScenePlate(){
 const b=livingBounds(),p=pawHallPlate,im=pawHallArt();
 ctx.fillStyle='#493b30';ctx.fillRect(b.x,b.y,b.w,b.h);
 ctx.drawImage(im,p.x,p.y,p.w,p.h)
}
// Isolate a small portable painted bamboo tube from the existing original
// art, without a giant vector cup, invented foreground or detached table.
function pawTemplePortableTube(x,y,angle=0){
 const im=pawHallArt(),sx=im.naturalWidth,sy=im.naturalHeight;
 ctx.save();try{
  ctx.translate(x,y);ctx.rotate(angle);
  ctx.beginPath();ctx.moveTo(-16,-37);ctx.lineTo(15,-37);ctx.lineTo(15,-9);ctx.lineTo(17,18);ctx.quadraticCurveTo(0,24,-15,18);ctx.lineTo(-17,-9);ctx.closePath();ctx.clip();
  ctx.drawImage(im,sx*.032,sy*.451,sx*.095,sy*.106,-18,-39,36,61)
 }finally{ctx.restore()}
}
function pawTempleDrawStick(){
 const run=state,p=pawHallPlate,pose=pawTempleStickPose(run,t),held=drag?.id==='sticks';
 const [fx,fy]=pawTemplePoint(p,.26,.64),[landX,landY]=pawTemplePoint(p,.37,.66);
 const a=pose.picked?poseEase(Math.min(1,pose.pick/.45)):0;
 const ax=fx+(landX-15-fx)*a,ay=fy+(landY+4-fy)*a;
 const grip={x:ax-14,y:ay-46},cup={x:grip.x-7,y:grip.y-2};
 const tilt=held?Math.max(-.24,Math.min(.24,(drag.x-drag.sx)*.007)):pose.shake?Math.sin(t*24)*.18:0;
 const lift=pose.shake||held?Math.sin(t*24)*3:0;
 if(pose.picked&&pose.pick<.45)backHuman(ax,ay,avatar??0,true,'right',.96);
 else if(pose.picked&&!pose.done&&pose.pick<.8)drawRitualPose(ax,ay,.96,{bow:.3*Math.sin(Math.PI*pose.pick),kneel:.24*Math.sin(Math.PI*pose.pick),reach:{x:landX,y:landY-2}});
 else backHuman(ax,ay,avatar??0,false,pose.picked?'right':'left',.96);
 if(!pose.picked){
  pawTemplePortableTube(cup.x,cup.y+lift,tilt);
  pawIncenseArm({x:ax-7,y:ay-51},{x:cup.x+7,y:cup.y+6+lift},.80,false);
 }
 if(pose.show){
  const f=pose.fall,pick=pose.picked?poseEase(Math.max(0,(pose.pick-.45)/.55)):0;
  const end={x:ax+15,y:ay-43};
  const x=(cup.x+(landX-cup.x)*f)*(1-pick)+end.x*pick;
  const y=(cup.y-32+(landY-(cup.y-32))*f-Math.sin(f*Math.PI)*47)*(1-pick)+end.y*pick;
  ctx.save();try{
   ctx.translate(x,y);ctx.rotate((Math.PI*.46*f)*(1-pick)-.08*pick);
   round(-2.8,-21,5.6,42,1,'#d7b47c','#9c7447');line(-1,-19,-1,18,'#f0d9a3',.7);
   if(f>.9){ctx.fillStyle='#7f4437';ctx.font='bold 7px Georgia';ctx.textAlign='center';ctx.fillText(String(run.fallenStick||run.stickNumber),0,-12)}
  }finally{ctx.restore()}
  if(pose.picked&&pick>0)pawIncenseArm({x:ax+8,y:ay-48},end,.78,false)
 }
 if(!run.drawing&&!run.fallenStick)target(cup.x-36,cup.y-44,72,92,()=>{if(run===state)shakeFortuneStick()},'sticks');
 if(run.fallenStick&&!run.stickPicked&&!run.drawing)target(landX-30,landY-28,60,56,()=>{if(run===state)pickupFortuneStick()},'paw-temple-pick-stick');
}
function pawTempleDrawMoon(){
 const run=state,p=pawHallPlate,[x,y]=pawTemplePoint(p,.86,.535),[fx,fy]=pawTemplePoint(p,.70,.64);
 backHuman(fx,fy,avatar??0,false,'right',.96);
 const airborne=run.tossUntil>t,f=airborne?Math.max(0,Math.min(1,1-(run.tossUntil-t)/(run.moonDuration||.55))):1;
 const sc=.30;
 for(let i=0;i<2;i++){
  const flat=pawMoonFlat(run.result,i,run.count),m=pawMoonMotion(f,i,flat,run.moonHeight||95);
  const bx=x+(m.x-400)*sc,by=y+5-m.lift*sc;
  ellipse(bx,y+8,Math.max(3,9-m.lift*.036),2.5,'#342b2355');
  ctx.save();ctx.translate(bx,by);ctx.scale(sc,sc);templeMoon(0,0,m.angle,m.flat);ctx.restore()
 }
 if(!run.moonPending&&!(run.tossUntil>t))target(x-38,y-35,76,70,()=>{if(run===state)pawMoonToss(65,true)},'moon');
}
function pawTempleDrawBell(){
 const run=state,p=pawHallPlate,[x,floor]=pawTemplePoint(p,.72,.82),y=floor-63;
 const [ax,ay]=pawTemplePoint(p,.56,.83),m=pawTempleBellMotion(run,t,drag?.id==='templeStriker'?Math.abs(drag.x-drag.sx):0);
 if(m.age>=.22&&m.age<4&&!run.bellRung&&!pawArcadeInputBlocked()){
  run.bellRung=true;sound(146+(run.bellStrength||0)*12);
  if(!muted&&ambientBus){ambientTone(146.83,.065*(run.bellStrength||0),2.5,'sine');ambientTone(293.66,.025*(run.bellStrength||0),1.6,'sine',.04)}
 }
 // A small two-post wooden stand sits on the same hall floor; no beam
 // suspended above the torii or player feet on the stone railing.
 ctx.save();try{
  ellipse(x,floor+1,43,8,'#3d2e2444');
  for(const dx of [-37,37]){
   const wood=ctx.createLinearGradient(x+dx-4,0,x+dx+5,0);wood.addColorStop(0,'#6e4832');wood.addColorStop(.48,'#bd8b58');wood.addColorStop(1,'#65432c');
   ctx.fillStyle=wood;ctx.fillRect(x+dx-4,floor-140,9,140);line(x+dx-2,floor-135,x+dx-2,floor-5,'#e0b28355',1);
   ellipse(x+dx,floor+1,9,3,'#43342766')
  }
  round(x-46,floor-145,92,10,2,'#8a5b39','#64422c');line(x-42,floor-141,x+42,floor-141,'#c69b69',1.4);
  line(x,floor-135,x,y-42,'#6f6047',3);templeBellArt(x+10,y,.36,m.impact);
  const sx=x-42+m.swing*.40,sy=y+13-Math.abs(m.swing)*.08;
  line(x-34,floor-135,sx+5,sy,'#ab8e66',1.3);line(x-15,floor-135,sx+29,sy,'#ab8e66',1.3);
  if(pics.templeStrikerPaint?.naturalWidth)ctx.drawImage(pics.templeStrikerPaint,sx,sy-4,36,9);
  else round(sx,sy-4,36,9,4,'#9d7046','#68462f');
  backHuman(ax,ay,avatar??0,false,'right',.96);
  if(drag?.id==='templeStriker'||m.age<.6)pawIncenseArm({x:ax+9,y:ay-48},{x:sx+7,y:sy},.80,false);
  if(m.age>=2.5)target(sx-24,sy-29,80,58,()=>{if(run===state)templeReleaseBell(55)},'templeStriker');
 }finally{ctx.restore()}
}
const pawPhysicalTempleCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(...args){
 if(room==='temple'&&['sticks','moon','templeBell'].includes(activity)&&pawRoomImageReady(pawHallArt())){
  const p=pawHallPlate;if(W<H)return pawTempleFullCamera(W,H,p);
  const s=Math.min(W/p.w,H/p.h);return {s,ox:(W-p.w*s)/2-p.x*s,oy:(H-p.h*s)/2-p.y*s}
 }
 return pawPhysicalTempleCameraBefore(...args)
};
const pawPhysicalTempleDrawBefore=drawActivity;
drawActivity=function(...args){
 if(room!=='temple'||!['sticks','moon','templeBell'].includes(activity)||!pawRoomImageReady(pawHallArt()))return pawPhysicalTempleDrawBefore(...args);
 pawRitualAdvance();continuityActivity=activity;
 ctx.save();try{
  pawTempleScenePlate();
  if(activity==='sticks')pawTempleDrawStick();
  else if(activity==='moon')pawTempleDrawMoon();
  else if(activity==='templeBell')pawTempleDrawBell();
 }finally{ctx.restore()}
 mb5AssistSync()
};


/* PAW_TEMPLE_PAPER_ACCESS_BEGIN */
function pawTemplePaperActions(q,now){
 if(!q)return [];
 if(q.paperStage==='folded')return ['open'];
 if(q.paperStage==='opening')return [];
 if(q.paperStage==='open')return ['keep','tie','rack'];
 if(['kept','tied'].includes(q.paperStage)&&now-q.paperAt>=.8)return ['return','rack'];
 return []
}
function pawTemplePaperAllowed(q,current,kind,now,blocked,id){
 return !blocked&&kind==='templePaper'&&q===current&&pawTemplePaperActions(q,now).includes(id)
}
/* PAW_TEMPLE_PAPER_ACCESS_END */
let pawPaperControlRun=null,pawPaperControlKey='';
function pawPaperControlsClear(){
 const el=$('gameControls');
 if(!el?.classList.contains('pawTemplePaperControls'))return;
 el.querySelectorAll('[data-paw-paper-action]').forEach(v=>v.remove());el.classList.remove('pawTemplePaperControls');
 if(!el.children.length)el.hidden=true;
 pawPaperControlRun=null;pawPaperControlKey=''
}
function pawPaperControlsSync(){
 const el=$('gameControls'),run=state;
 if(!el)return;
 if(activity!=='templePaper'||room!=='temple'){pawPaperControlsClear();return}
 if(pawArcadeInputBlocked()){if(el.classList.contains('pawTemplePaperControls'))el.hidden=true;return}
 const actions=pawTemplePaperActions(run,t),key=actions.join('|')+'|'+zh;
 if(pawPaperControlRun===run&&pawPaperControlKey===key&&el.querySelectorAll('[data-paw-paper-action]').length===actions.length){el.hidden=!actions.length;return}
 el.replaceChildren();el.classList.remove('mb5ActivityAssist');el.classList.add('pawTemplePaperControls');
 pawPaperControlRun=run;pawPaperControlKey=key;el.hidden=!actions.length;
 const words={open:['Unfold fortune slip','展开签纸'],keep:['Keep in bag','收入背包'],tie:['Tie on rack','系上签纸'],rack:['Read other fortunes','看看其他签文'],return:['Back to hall','返回大殿']};
 const action={open:templePaperTap,keep:()=>templePaperKeep(false),tie:()=>templePaperKeep(true),rack:pawFortuneRackPage,return:()=>$('back').click()};
 for(const id of actions){const button=b(el,tr(...words[id]),()=>{
  if(pawTemplePaperAllowed(run,state,activity,t,pawArcadeInputBlocked(),id))action[id]()
 });button.dataset.pawPaperAction=id;button.type='button'}
}
const pawPaperControlsDrawBefore=drawActivity;
drawActivity=function(...args){const result=pawPaperControlsDrawBefore(...args);if(activity==='templePaper')pawPaperControlsSync();return result};
const pawPaperControlsLoopBefore=loop;
loop=function(...args){if(activity!=='templePaper')pawPaperControlsClear();return pawPaperControlsLoopBefore(...args)};
const pawPaperControlsCss=document.createElement('style');
pawPaperControlsCss.textContent=`
#game #gameControls.pawTemplePaperControls:not([hidden]){display:grid!important;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));width:min(92vw,390px);max-width:calc(100% - 24px);box-sizing:border-box;gap:5px;padding:5px;border:1px solid #ad9470;border-radius:7px;background:#f2e5ccea}
#game #gameControls.pawTemplePaperControls button{min-width:0;width:100%;min-height:44px;white-space:normal;overflow-wrap:anywhere;font-size:clamp(12px,3.4vw,15px);padding:6px}
`;
document.head.append(pawPaperControlsCss);
// Stale resident greetings must never compete with an activity instruction.
const pawQuietSceneStartBefore=start;
start=function(...args){clearResidentGreeting();pawAmbientClear();return pawQuietSceneStartBefore(...args)};

/* First arrival railway: advance after a complete visible journey, rather
   than requiring another confirmation. Pause and skip are genuine controls. */
let pawFirstRailState=null,pawFirstRailFrame=0;
function pawFirstRailDispose(){cancelAnimationFrame(pawFirstRailFrame);pawFirstRailFrame=0}
function pawFirstRailAttach(){
 pawFirstRailDispose();
 if(proStep!==5){pawFirstRailState=null;return}
 const cabin=proposal.querySelector('.rail-cabin'),arrive=proposal.querySelector('.rail-arrive'),foot=proposal.querySelector('footer');
 if(!cabin||!arrive||!foot)return;
 const run=pawFirstRailState??={elapsed:0,last:null,paused:false,completed:false,loadElapsed:0,artStarted:false};run.last=null;
 const original=arrive.onclick;if(typeof original!=='function')return;
 const reduced=residentReducedMotion.matches,duration=reduced?6500:8500;
 cabin.dataset.rideSeconds=String(duration/1000);
 const status=element('small','',foot,'pawFirstRailStatus');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const pause=element('button','',foot,'pawFirstRailPause');pause.type='button';
 function syncPause(){
  pause.textContent=run.paused?tr('Resume journey','继续旅程'):tr('Pause journey','暂停旅程');
  pause.setAttribute('aria-pressed',String(run.paused));
  cabin.classList.toggle('pawRailPaused',run.paused);
  cabin.dataset.sceneryPaused=String(run.paused);
  status.textContent=run.paused?tr('Journey paused','旅程已暂停'):run.phase==='unavailable'?tr('Scenery could not load. Continue to arrival, or wait for it to return.','窗外景色暂时无法加载，可以直接到站或稍候。'):run.phase==='loading'?tr('Preparing the railway scenery…','正在准备沿途风景…'):tr('Next stop: Fortune Valley','下一站：解忧谷')
 }
 function finish(event){
  if(run.completed||pawFirstRailState!==run||!pawTransitOwned({stage:proStep,connected:cabin.isConnected,hidden:document.hidden,proposalHidden:proposal.hidden},5))return;
  run.completed=true;pawFirstRailDispose();original.call(arrive,event)
 }
 arrive.textContent=tr('Skip to arrival','跳过旅程');arrive.onclick=finish;
 // Avoid announcing a stale loading state after changing language.
 run.phase=run.artStarted?'riding':run.loadElapsed>=5000?'unavailable':'loading';
 pause.onclick=()=>{if(pawFirstRailState!==run||run.completed)return;run.paused=!run.paused;run.last=null;syncPause()};
 syncPause();
 function tick(now){
  if(pawFirstRailState!==run||run.completed||proStep!==5||!cabin.isConnected||proposal.hidden)return;
  const active=!document.hidden&&!run.paused;
  const painting=cabin.querySelector('.mbPaintedRail:not([hidden]) img'),fallback=cabin.querySelector('.train-window img');
  const artReady=!!(painting?.complete&&painting.naturalWidth||fallback?.complete&&fallback.naturalWidth);
  const phase=pawFirstRailProgress(run,now,active,artReady,duration);
  if(phase==='arrived'){finish();return}
  if(phase!=='held'&&phase!==run.phase){run.phase=phase;syncPause()}
  pawFirstRailFrame=requestAnimationFrame(tick)
 }
 pawFirstRailFrame=requestAnimationFrame(tick)
}
const pawFirstRailRenderBefore=proRender;
proRender=function(...args){const result=pawFirstRailRenderBefore(...args);pawFirstRailAttach();return result};
document.addEventListener('visibilitychange',()=>{if(pawFirstRailState)pawFirstRailState.last=null});
const pawFirstRailCSS=document.createElement('style');pawFirstRailCSS.textContent=`
#proposal .pawFirstRailStatus{color:#f7e9ce;line-height:1.3;display:block;font-size:12px}
#proposal .pawFirstRailPause{min-height:44px;white-space:normal;max-width:100%;padding:7px 14px;color:#fff3db;background:#2c463ac9;border:1px solid #d1be9066;border-radius:4px}
#proposal[data-paw-entrance-step="5"] .train-window img{animation:trainLandscape 8.5s linear 1 both!important}
#proposal .rail-cabin.pawRailPaused *,#proposal .rail-cabin.pawRailPaused .mbRailPane>span{animation-play-state:paused!important}
@media(prefers-reduced-motion:reduce){#proposal[data-paw-entrance-step="5"] .train-window img{animation:none!important}}
`;document.head.append(pawFirstRailCSS);

// Keep registration in the same illustrated railway environment.
const pawStationChoiceRenderBefore=proRender;
proRender=function(...args){
 const result=pawStationChoiceRenderBefore(...args);
 if(![1,2].includes(proStep))return result;
 const hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer'),player=hero?.querySelector('.pawEntranceAvatar');
 if(!hero||!foot||!player)return result;
 const picture=element('picture','',hero,'pawChoiceStation');
 const wide=element('source','',picture);wide.media='(min-aspect-ratio: 6/5)';wide.srcset='assets/visual/painted/recovered/scenes/station_landscape.webp';
 const art=element('img','',picture);art.alt='';art.src='assets/visual/painted/recovered/scenes/station_portrait.webp';art.decoding='async';
 picture.setAttribute('aria-hidden','true');hero.prepend(picture);hero.classList.add('pawChoiceGrounded');
 if(proStep===2){
  const skip=element('button',tr('Just explore','随便逛逛'),foot,'pawIntentSkip');
  skip.type='button';skip.onclick=()=>{if(!proBusy&&proStep===2)proposalBoard()};
 }
 return result
};
const pawChoiceSceneCSS=document.createElement('style');pawChoiceSceneCSS.textContent=`
#proposal .pawChoiceGrounded{border-radius:4px;isolation:isolate}
#proposal .pawChoiceStation{position:absolute;inset:0;z-index:-1;display:block;pointer-events:none;overflow:hidden}
#proposal .pawChoiceStation img{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 94%}
#proposal .pawChoiceGrounded:before{display:none!important}
#proposal .pawChoiceGrounded .pawEntranceAvatar{position:absolute!important;left:50%!important;top:auto!important;bottom:8%!important;transform:translateX(-50%)!important;translate:none!important;height:min(var(--paw-avatar-main,180px),68%)!important;max-height:68%!important;filter:drop-shadow(0 5px 3px #372b244d)!important}
#proposal .pawIntentSkip{min-height:44px;max-width:100%;white-space:normal;padding:4px 12px;background:#2b4439;color:#fff3db;border:1px solid #bbac8b;border-radius:4px}
@media(max-height:670px) and (orientation:portrait){#proposal .pawChoiceGrounded .pawEntranceAvatar{height:min(var(--paw-avatar-main,130px),85%)!important;max-height:85%!important;bottom:4%!important}}
`;document.head.append(pawChoiceSceneCSS);
const pawMapSignFinishCss=document.createElement('style');
pawMapSignFinishCss.textContent=`
#game>#worldSigns>.worldSign{box-sizing:border-box!important;width:max-content!important;min-width:44px!important;max-width:min(148px,42vw)!important;padding:0!important;display:flex;justify-content:center;align-items:center;background:transparent!important;border:0!important;box-shadow:none!important}
#game>#worldSigns>.worldSign[hidden]{display:none!important}
#game>#worldSigns>.worldSign .doorPlaque,#game[data-recovered-plaque="true"]>#worldSigns>.worldSign .doorPlaque{box-sizing:border-box!important;display:block!important;width:max-content!important;max-width:100%!important;min-width:0!important;writing-mode:horizontal-tb!important;white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important;font-size:clamp(11px,2.7vw,13px)!important}
#game[data-recovered-plaque="true"]>#worldSigns>.worldSign .doorPlaque{border-width:6px 8px 6px!important;padding:3px 5px!important}
#game:not([data-recovered-plaque="true"])>#worldSigns>.worldSign .doorPlaque{padding:5px 7px!important}
`;document.head.append(pawMapSignFinishCss);
// Measure and apply the DOM plaques immediately after the canvas camera has
// been rendered. The separate legacy UI tick shares the cached projection.
const pawMapSignFrameBefore=loop;
loop=function(...args){const result=pawMapSignFrameBefore(...args);if(proposal.hidden&&!room&&!activity)syncSigns();return result};
/* PAW_OUTDOOR_YIELD_BEGIN */
// Score a tiny real walking step, not a relocation. A resident already
// inside a safety radius may move out, but may not close that gap further.
function pawOutdoorYield(current,candidates,obstacles){
 const near=obstacles.filter(o=>Math.hypot(current.x-o.x,current.y-o.y)<o.gap);
 if(!near.length)return {needed:false,point:null};
 const score=point=>Math.min(...near.map(o=>Math.hypot(point.x-o.x,point.y-o.y)/o.gap));
 const base=score(current);let best=null,bestScore=base;
 for(const q of candidates){
  if(!q||![q.x,q.y].every(Number.isFinite))continue;
  const safe=obstacles.every(o=>{
   const a=Math.hypot(current.x-o.x,current.y-o.y),b=Math.hypot(q.x-o.x,q.y-o.y);
   return a<o.gap?b>=a-.001:b>=o.gap
  });
  if(!safe)continue;
  const value=score(q);
  if(value>bestScore+.00001){best=q;bestScore=value}
 }
 return {needed:true,point:best}
}
function pawOutdoorYieldCandidates(y,x,low,high,amount,laneAt){
 if(![x,y,low,high,amount].every(Number.isFinite)||amount<=0||low>high)return [];
 const from=laneAt(y),fraction=Math.max(-.72,Math.min(.72,(x-from.x)/Math.max(1,from.half)));
 const result=[];
 for(const dir of [-1,1]){
  const destY=Math.max(low,Math.min(high,y+dir*amount)),lane=laneAt(destY);
  for(const fractionTo of [fraction,-.68,.68,0]){
   const dx=lane.x+lane.half*fractionTo-x,dy=destY-y,d=Math.hypot(dx,dy),ratio=d>0?Math.min(1,amount/d):0;
   const nextY=y+dy*ratio,nextLane=laneAt(nextY);
   const nextX=Math.max(nextLane.x-nextLane.half,Math.min(nextLane.x+nextLane.half,x+dx*ratio));
   if(Math.hypot(nextX-x,nextY-y)<=amount+.001)result.push({x:nextX,y:nextY})
  }
 }
 return result
}
/* PAW_OUTDOOR_YIELD_END */
const pawYieldStepBefore=step;
step=function(n,dt,speed){
 const spine=scene==='fortune'?pawStairPath:paintedResidentPaths[scene];
 if(n===p||room||!spine||!npc.includes(n))return pawYieldStepBefore(n,dt,speed);
 const id=pawAmbientProfile(n)?.id;
 if(talkOpen||transitioning||!proposal.hidden||document.hidden||$('page').style.display==='block'||id&&(pawAmbientActive?.id===id||pawOverheardPending?.id===id||pawOverheardPending?.other===id)){
  pawResidentFootMotion.set(n,false);return true
 }
 const animal=n.kind===2,obstacles=[{x:p.x,y:p.y,gap:animal?42:61},...npc.filter(o=>o!==n).map(o=>({x:o.x,y:o.y,gap:animal||o.kind===2?37:72}))];
 const amount=Math.min(42,Number.isFinite(speed)?Math.max(0,speed):0,pawResidentTempo(pawPasserbyIdentity(n)).speed)*Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0));
 const low=Math.max(minY(),spine[0][0]),high=Math.min(maxY(),spine.at(-1)[0]);
 const q=pawOutdoorYield(n,pawOutdoorYieldCandidates(n.y,n.x,low,high,amount,y=>residentLane(scene,y)),obstacles);
 if(!q.needed)return pawYieldStepBefore(n,dt,speed);
 if(!q.point){pawResidentFootMotion.set(n,false);return true}
 const dx=q.point.x-n.x,dy=q.point.y-n.y,travel=Math.hypot(dx,dy);
 n.x=q.point.x;n.y=q.point.y;n.tx=n.x;n.ty=n.y;n.pathReady=false;
 if(Math.abs(dy)>.005)n.walkDirection=dy<0?-1:1;
 n.pauseUntil=Math.max(n.pauseUntil||0,t+.25);
 pawResidentFootMotion.set(n,travel>.035);
 if(travel>.035){
  pawGaitTravel.set(n,(pawGaitTravel.get(n)||0)+travel);
  const prior=pawPedestrianFaces.get(n)||{facing:n.facing||n.paintedFacing||'up',candidate:null,hold:0};
  const face=pawPedestrianFace(prior,dx,dy,dt);pawPedestrianFaces.set(n,face);n.facing=face.facing
 }
 return true
};
if(!maps[scene])scene='fortune';if(!load('routeV5',false)){scene='fortune';save('scene',scene);save('routeV5',true)}resetPosition();initNPC();updateHUD();hint(isRoute()?'Tap a doorway to walk inside, or swipe to explore.':'Tap a place to enter, or the path to walk.',isRoute()?'点击门口走进去，或滑动探索。':'点击地点进入，点击道路行走。');entryStory();requestAnimationFrame(loop);
