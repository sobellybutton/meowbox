
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
  element('p',tr('New boxes contain unowned figures for 40 Paws. Any old exchange tokens can still unlock common or uncommon figures at three tokens each.','新盲盒40爪币一盒，不会抽到已收藏款。旧兑换券仍可用三枚兑换普通或特别款。'),wrap,'figureHelp');
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
parkSerialTalk=function(){
 if(room!=='park'&&room!=='tea')return;const q=parkProgress(),today=day();
 if(q.beat===3&&q.day!==today){q.episode=(q.episode+1)%parkSerials.length;q.beat=0;save('parkSerialV1',q)}
 const ep=parkSerials[q.episode],mei=['Auntie Mei','梅姨'],lin=['Auntie Lin','林姨'],leave=[tr('Continue later','下次接着聊'),closeTalk];
 const next=(beat,choice=q.choice)=>{save('parkSerialV1',{...q,beat,choice,day:beat===3?today:q.day});if(beat===3){lifeFriend(mei);lifeFriend(lin)}parkSerialTalk()};
 if(q.beat===0)say(tr(...mei),tr(...ep.opening),[[tr('Wait, what happened?','等等，怎么回事？'),()=>next(1)],leave]);
 else if(q.beat===1)say(tr(...lin),tr(...ep.twist),[...ep.choices.map((v,i)=>[tr(...v),()=>next(2,i)]),leave]);
 else if(q.beat===2)say(tr(...mei),tr(...ep.outcomes[q.choice]),[[tr('And then?','然后呢？'),()=>next(3)],leave]);
 else say(tr(...lin),tr(...ep.after),[[tr('See you tomorrow','明天见'),closeTalk]]);
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
  // Rear guests have stable feet; the table partly occludes their lower bodies.
  gatheringStool(x-48,y-10);gatheringStool(x+48,y-10);
  gatheringResident(['Auntie Mei','梅姨'],x-48,y-8,1.16,'right',0);
  gatheringResident(['Grandma','外婆'],x+48,y-8,1.16,'left',1);
  gatheringTeaTable(x,y);
  gatheringResident(['Wang Laoban','王老板'],x+116,y+32,.96,'left',2);
  gatheringStool(x-99,y+36);
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
   [tr('Daily guidance · 1 card','今日指引 · 一张牌'),()=>{closeTalk();start('tarot');tarotToneChoice(()=>{})}],
   [tr('Find some clarity · 3 cards','三牌解惑 · 三张牌'),()=>{closeTalk();start('love')}],
   [tr('Look a little deeper · 5 cards','深入解读 · 五张牌'),()=>{closeTalk();start('love');state.readSpreadSize=5}],
   [tr('Maybe later','待会儿再来'),closeTalk]
  ])
 }
 if(room==='quiz'&&id==='quiz'){
  closeTalk();return say(tr('Lab keeper','研究所店主'),tr('Three different lenses, not three versions of the same test. Which part of yourself are you curious about?','三种不同的自我探索，不是把同一份题做三遍。今天想认识自己的哪一面？'),[
   [tr('Soul Cat · playful character','猫灵 · 趣味性格'),()=>{closeTalk();wonderSceneOpen('soul')}],
   [tr('Four preferences · how I think','四种偏好 · 我怎样思考'),()=>{closeTalk();wonderSceneOpen('type')}],
   [tr('Inner motives · what matters to me','内在动力 · 我在乎什么'),()=>{closeTalk();wonderSceneOpen('motive')}],
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
 return {x:400+Math.cos(a)*111+Math.sin(a*1.7+i)*24,y:458+Math.sin(a*.84+i)*61,dir:-Math.sin(a)>=0?1:-1}
}
function festivalNewRound(now,seed=0){
 return {at:now,seed,x:400,y:458,paper:100,phase:'aim',caught:[],attempts:0,last:now,resultAt:0,feedback:['Aim the scoop, then dip.','先对准小鱼，再下网。']}
}
function festivalFishOutcome(game,now){
 const elapsed=now-game.last;
 if(game.phase!=='dip'||elapsed<.32)return null;
 let nearest=-1,distance=Infinity;
 for(let i=0;i<festivalFishKinds.length;i++){if(game.caught.includes(i))continue;const p=festivalFishPosition(i,now-game.at,game.seed),d=Math.hypot(p.x-game.x,p.y-game.y);if(d<distance){distance=d;nearest=i}}
 const gentle=elapsed<=1.2,hit=gentle&&distance<=29;
 const wear=Math.min(100,(hit?18:gentle?12:28)+Math.max(0,Math.floor((elapsed-1.2)*16)));
 return {caught:hit?nearest:-1,wear}
}
function festivalFinish(g){
 if(g.phase==='done')return;g.phase='done';g.resultAt=t;
 if(g.attempts)lifeEarn('round:goldfish',{skill:2,happiness:1},true);
 g.feedback=g.caught.length?['A little fish parade! All fish return safely to the tank.','小鱼巡游成功！小鱼们都安全回水池啦。']:['The fish have excellent evasive manoeuvres.','小鱼的闪避技能已经点满。'];
 refreshControls()
}
function festivalAim(x,y){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||g?.phase!=='aim'||!Number.isFinite(x)||!Number.isFinite(y))return;
 g.x=clamp(x,270,530);g.y=clamp(y,390,525)
}
function festivalDip(){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||g?.phase!=='aim'||g.paper<=0)return;
 g.phase='dip';g.last=t;g.feedback=['Lift gently while a fish is inside the ring.','小鱼游进圈里，轻轻捞起来。'];physicalFx('water',.6);refreshControls()
}
function festivalLift(){
 const g=state.festivalFish;if(activity!=='goldfishScoop'||g?.phase!=='dip')return;
 const result=festivalFishOutcome(g,t);if(!result)return;
 g.attempts++;g.paper=Math.max(0,g.paper-result.wear);g.phase='lift';g.last=t;
 if(result.caught>=0){const i=result.caught,k=festivalFishKinds[i];g.caught.push(i);addItem('Goldfish postcard: '+k.name[0],'金鱼明信片：'+k.name[1]);g.feedback=['A gentle catch! '+k.name[0]+' is going back in the water.','轻轻捞到了'+k.name[1]+'！一会儿放回水里。'];physicalFx('water',.8)}
 else{g.feedback=['That fish has seen your performance review.','这条鱼显然看过你的绩效考核。'];physicalFx('splash',.4)}
 refreshControls()
}
const festivalStartBefore=start;
start=function(id){
 festivalStartBefore(id);
 if(id==='goldfishScoop'){state.festivalFish=festivalNewRound(t,Math.random()*TAU);refreshControls();hint('Tap the water to aim, dip the paper ring, then lift gently.','点击水面瞄准，下网，再轻轻捞起。')}
};
activityTitle.goldfishScoop=['Goldfish scooping','捞金鱼'];
const festivalHintBefore=activityHint;
activityHint=function(){if(activity==='goldfishScoop'){hint('Aim, dip, then lift. Your paper wears out in water.','瞄准、下网、捞起。纸网泡久了会破。');return}return festivalHintBefore()};
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
 if(g.phase==='dip'&&t-g.last>=2.4)festivalLift();
 if(g.phase==='lift'&&t-g.last>=.65){if(g.paper<=0||g.caught.length===festivalFishKinds.length||g.attempts>=8)festivalFinish(g);else{g.phase='aim';refreshControls()}}
 ctx.save();paintLivingBackdrop(pics.arcade||pics.tea);
 const b=livingBounds(),shade=ctx.createLinearGradient(0,325,0,650);shade.addColorStop(0,'#332e2620');shade.addColorStop(1,'#4f382c9c');ctx.fillStyle=shade;ctx.fillRect(b.x,b.y,b.w,b.h);
 // The actual tank rests on its own wooden legs, with separate moving fish.
 festivalTank(400,458,1,g);
 const gx=g.x,gy=g.y,raise=g.phase==='lift'?Math.sin(Math.PI*clamp((t-g.last)/.65,0,1))*32:0;
 if(g.phase!=='done'){
  ctx.save();ctx.translate(gx,gy-raise);ctx.globalAlpha=g.phase==='dip'?.72:1;
  line(13,11,46,58,'#9d744d',8);line(15,9,46,56,'#d3b083',2);ellipse(0,0,24,20,g.paper>0?'#ece5ce80':'#00000000');
  ctx.beginPath();ctx.ellipse(0,0,24,20,0,0,TAU);ctx.strokeStyle='#cba26d';ctx.lineWidth=4;ctx.stroke();ctx.restore();
 }
 backHuman(228,575,avatar??0,false,'right',.86);
 if(g.phase==='aim')for(let ix=0;ix<5;ix++)for(let iy=0;iy<3;iy++){const x=280+ix*60,y=404+iy*54;target(x-30,y-27,60,54,()=>festivalAim(x,y))}
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
 if(g.phase==='done'){b(controls,tr('Try again','再玩一局'),()=>start('goldfishScoop'));return}
 if(g.phase==='aim'){
  for(const [label,cn,dx,dy] of [['Left','左',-30,0],['Right','右',30,0],['Up','上',0,-27],['Down','下',0,27]])b(controls,tr(label,cn),()=>festivalAim(g.x+dx,g.y+dy));
  b(controls,tr('Dip','下网'),festivalDip)
 }else if(g.phase==='dip')b(controls,tr('Lift gently','轻轻捞起'),festivalLift);
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
 const raw=load('fiveReadingJournalV1',[]);return Array.isArray(raw)?raw.filter(v=>typeof v?.date==='string'&&Array.isArray(v.cards)&&v.cards.length===5&&new Set(v.cards.map(c=>c.i)).size===5&&v.cards.every(c=>Number.isInteger(c.i)&&c.i>=0&&c.i<tarotDeck.length&&typeof c.rev==='boolean')).slice(0,40):[]
}
function fiveReadingSave(){
 if(state.readSaved||state.readCards.length!==5||!state.readFlip.every(v=>v>=0&&t-v>=.72))return;
 const entry={date:shrineClock().day,topic:state.readTopic,cards:state.readCards.map(v=>({...v}))};
 const archive=fiveReadingArchive(),key=JSON.stringify(entry);
 if(!archive.some(v=>JSON.stringify(v)===key))save('fiveReadingJournalV1',[entry,...archive].slice(0,40));
 state.readSaved=true;addItem('Five-card reading','五张牌占卜');lifeEarn('ritual:reading',{wisdom:2,calm:1},true);hint('All five cards are saved in your reading journal.','五张牌都已收入塔罗手记。')
}
function fiveReadingDetail(v,i){
 const d=tarotDeck[v.i];if(!d)return;
 say(tr(...fiveReadingPositions[i]),tr(d[0],d[1])+' · '+orient(v.rev)+'\n\n'+arcanaReading(d,v.rev)+'\n\n'+fiveReadingPrompt(state.readTopic,i)+(tarotCommentary(d[0],v.rev,state.readTopic,state.tarotTone)?'\n\n'+tr(...tarotCommentary(d[0],v.rev,state.readTopic,state.tarotTone)):''),[[tr('Back to the cards','回到牌桌'),closeTalk]])
}
function fiveReadingEntries(parent,entry){
 for(const [i,v] of entry.cards.entries()){
  const d=tarotDeck[v.i];if(!d)continue;const row=element('article','',parent,'fiveReadingEntry');
  element('small',(i+1)+'. '+tr(...fiveReadingPositions[i]),row);element('strong',tr(d[0],d[1])+' · '+orient(v.rev),row);element('p',arcanaReading(d,v.rev),row);element('p',fiveReadingPrompt(entry.topic,i),row,'fiveReadingPrompt')
 }
}
function fiveReadingResult(entry,back=null){
 page(tr('Five-card reflection','五张牌解读'),tr('Consider these five perspectives together. They are prompts, not predictions.','把五个角度放在一起慢慢想。它们是启发，不是预言。'),q=>{
  const wrap=element('section','',q,'fiveReadingBook');element('small',tr('A moment for yourself','给自己一点时间'),wrap);fiveReadingEntries(wrap,entry);element('h2',tr('Bring the reading together','把五张牌串起来'),wrap);element('p',tr('Which two cards seem to speak to each other? What would you do differently, even if you had never drawn these cards?','哪两张牌似乎在彼此呼应？就算没有抽到这些牌，你会想做出什么改变？'),wrap);element('small',tr('Keep what feels useful. Leave the rest. Your decisions are still yours.','有启发的就留下，其他的放一放。决定权始终在你手里。'),wrap);const snapshot=tarotShareSnapshot({...entry,tone:entry.tone||(!back?state.tarotTone:'gentle')});if(snapshot)b(wrap,tr('Make a keepsake card','制作纪念卡'),()=>tarotKeepsakePage(snapshot,()=>fiveReadingResult(entry,back)));
  b(wrap,back?tr('Back to the reading journal','返回塔罗手记'):tr('Back to the reading table','回到牌桌'),()=>{if(back)back();else $('page').style.display='none'});if(back){const close=q.querySelector('.row button:first-child');if(close)close.onclick=back}
  const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();fiveReadingResult(entry,back)}
 })
}
const fiveDealBefore=readingDeal;
readingDeal=function(){
 if(activity!=='love'||state.readSpreadSize!==5)return fiveDealBefore();
 if(state.readStage!=='deck'||!state.readShuffle)return;
 const cards=fiveReadingDraw(tarotDeck.length);if(cards.length!==5)return;
 state.readStage='deal';state.readAt=t;state.readCards=cards;state.readFlip=Array(5).fill(-1);state.readSaved=false;
 cards.forEach(v=>readingArtwork(v.i));sound(460)
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
 if(complete){fiveReadingSave();label(tr('Read all five','查看完整解读'),400,portrait?700:625,()=>fiveReadingResult({cards:state.readCards.map(v=>({...v})),topic:state.readTopic}));}
 ctx.restore()
};
const fiveCameraBefore=mobileRoomCamera;
mobileRoomCamera=function(s,ox,oy){
 if(activity!=='love'||state.readSpreadSize!==5||!['deal','cards'].includes(state.readStage))return fiveCameraBefore(s,ox,oy);
 const portrait=W<H,short=!portrait&&H<500,top=short?60:125,bottom=H-(short?74:120),left=portrait?210:170,right=portrait?590:630,u=portrait?305:405,d=portrait?735:665;
 const z=Math.max(.08,Math.min((W-16)/(right-left),Math.max(80,bottom-top)/(d-u)));return {s:z,ox:W/2-(left+right)/2*z,oy:(top+bottom)/2-(u+d)/2*z}
};
const fiveJournalBefore=openReadingJournal;
openReadingJournal=function(){
 fiveJournalBefore();const q=$('content'),archive=fiveReadingArchive();if(!archive.length)return;
 const wrap=element('section','',q,'fiveReadingBook');element('h2',tr('Five-card readings','五张牌手记'),wrap);
 for(const v of archive){const row=element('article','',wrap,'fiveReadingEntry');element('strong',v.date,row);element('p',v.cards.map(c=>tr(tarotDeck[c.i][0],tarotDeck[c.i][1])).join(' · '),row);b(row,tr('Read again','重温解读'),()=>fiveReadingResult(v,openReadingJournal))}
 const back=q.querySelector('.row button:first-child');const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();openReadingJournal()}
};
const fiveReadingStyle=document.createElement('style');fiveReadingStyle.textContent='.fiveReadingBook{background:#f2e4c9;color:#514638;border:3px double #a99168;padding:12px;margin:12px 0}.fiveReadingEntry{border-bottom:1px dashed #b49d77;padding:10px 0;overflow-wrap:anywhere}.fiveReadingEntry strong,.fiveReadingEntry small{display:block}.fiveReadingEntry strong{font:600 17px/1.4 Georgia,"Songti SC",serif;color:#53674e}.fiveReadingEntry p{line-height:1.6}.fiveReadingBook button{min-height:44px;white-space:normal}';document.head.append(fiveReadingStyle);

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
const tarotWordingStyle=document.createElement('style');tarotWordingStyle.textContent='.fiveReadingPrompt{border-left:2px solid #899577;padding-left:10px;color:#53674e;font-style:italic}.fiveReadingBook>small{display:block;line-height:1.5;margin:8px 0}';document.head.append(tarotWordingStyle);

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
const tarotCommentShowBefore=readingShow;
readingShow=function(i){
 const v=state.readCards?.[i];const result=tarotCommentShowBefore(i);
 if(!v||!talkOpen||state.readFlip?.[i]<0||t-state.readFlip[i]<.72)return result;
 const joke=tarotCommentary(tarotDeck[v.i]?.[0]||'',v.rev,state.readTopic,state.tarotTone);const line=$('line');
 if(joke&&line)line.textContent+='\n\n'+tr('A little cosmic side-eye: ','宇宙轻轻吐槽：')+tr(...joke);
 if(state.readCards?.length&&state.readFlip?.every(v=>v>=0&&t-v>=.72)){const snapshot=tarotShareSnapshot(state);if(snapshot)b($('choices'),tr('Make a keepsake card','制作纪念卡'),()=>tarotKeepsakePage(snapshot))}
 return result
};
function tarotShareSnapshot(source){
 const cards=source.readCards||source.cards;if(!Array.isArray(cards)||![1,3,5].includes(cards.length)||!cards.every(v=>Number.isInteger(v.i)&&tarotDeck[v.i]&&typeof v.rev==='boolean'))return null;
 return {cards:cards.map(v=>({i:v.i,rev:v.rev})),tone:source.tarotTone||source.tone||'gentle',topic:Number.isInteger(source.readTopic)?source.readTopic:Number.isInteger(source.topic)?source.topic:-1}
}
/* Keep headline, artwork, labels and footer in distinct reserved bands. */
function tarotEditorialLayout(w,h,count){
 if(![1,3,5].includes(count)||w<=0||h<=0)throw Error('Invalid keepsake geometry');
 const top=282, bottom=h-150, rows=count===5?[2,3]:[count], rowH=(bottom-top)/rows.length;
 const slots=[];let i=0;
 rows.forEach((n,row)=>{
  const step=n===1?Math.min(w-160,540):Math.min((w-152)/n,292);
  const cardH=Math.min(rowH-91,(step-36)/.58,count===1?650:count===3?440:340),cardW=cardH*.58;
  for(let j=0;j<n;j++){const cx=w/2+(j-(n-1)/2)*step,cy=top+row*rowH+(rowH-73)/2;
   slots.push({i:i++,cx,cy,w:cardW,h:cardH,labelY:cy+cardH/2+31,orientY:cy+cardH/2+61,step})
  }
 });
 return {top,bottom,slots,footer:h-88}
}

function tarotKeepsakePage(entry,back=null){
 page(tr('A little cosmic keepsake','宇宙寄来一张卡'),tr('Only the cards and a small takeaway. Your question stays private.','只分享牌面与一句提醒，私人的问题留给自己。'),q=>{
 const wrap=element('section','',q,'tarotKeepsake');const controls=element('div','',wrap,'tarotKeepsakeFormats');
 const canvas=element('canvas','',wrap,'tarotKeepsakeCanvas');canvas.setAttribute('aria-label',tr('Preview of your tarot keepsake','塔罗纪念卡预览'));
 let format='feed';const dims={feed:[1080,1350],xhs:[1080,1440],story:[1080,1920],square:[1080,1080]};
 const focus=entry.cards[entry.cards.length===1?0:entry.cards.length===3?2:3],joke=tarotCommentary(tarotDeck[focus.i][0],focus.rev,entry.topic,entry.tone);
 function render(useArt=true){
 const [w,h]=dims[format];canvas.width=w;canvas.height=h;const g=canvas.getContext('2d');
 const geo=tarotEditorialLayout(w,h,entry.cards.length),count=entry.cards.length;
 const night=g.createLinearGradient(0,0,w,h);night.addColorStop(0,'#253d3d');night.addColorStop(.55,'#354f48');night.addColorStop(1,'#243632');g.fillStyle=night;g.fillRect(0,0,w,h);
 const paper=g.createLinearGradient(0,0,w,h);paper.addColorStop(0,'#f8efd9');paper.addColorStop(.55,'#efe0bc');paper.addColorStop(1,'#dcc599');g.fillStyle=paper;g.fillRect(48,48,w-96,h-96);
 g.strokeStyle='#c4a46c';g.lineWidth=2;g.strokeRect(31,31,w-62,h-62);g.strokeStyle='#9e895d';g.strokeRect(60,60,w-120,h-120);
 // Quiet botanical corner ornaments, independent of card content.
 for(const [x,y,flip] of [[78,78,1],[w-78,78,-1],[78,h-78,1],[w-78,h-78,-1]]){g.save();g.translate(x,y);g.scale(flip, y>h/2?-1:1);g.strokeStyle='#7b8b6f';g.fillStyle='#a1aa83';g.lineWidth=2;
 for(let k=0;k<5;k++){const xx=8+k*13,yy=8+k*11;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(xx*.6,yy*.2,xx,yy);g.stroke();g.beginPath();g.ellipse(xx,yy,9,4,-.48,0,Math.PI*2);g.fill()}g.restore()}
 function font(size,weight=500){g.font=weight+' '+size+'px Georgia,"Noto Serif SC","Songti SC",serif';g.textAlign='center'}
 function line(value,y,size=30,color='#374e44',weight=500){font(size,weight);g.fillStyle=color;g.fillText(value,w/2,y,w-160)}
 function lines(value,maxWidth,size,maxLines=3){font(size,600);const units=zh?Array.from(value):String(value).split(/\s+/);const out=[];let cur='';for(const unit of units){const v=cur+(zh?'':cur?' ':'')+unit;if(cur&&g.measureText(v).width>maxWidth){out.push(cur);cur=unit}else cur=v}if(cur)out.push(cur);if(out.length>maxLines){out.length=maxLines;out[maxLines-1]=out[maxLines-1].replace(/[。.!?…]+$/,'')+'…'}return out}
 const title=joke?tr(...joke):tr('Take what helps you. Leave the rest.','有启发的就留下，其他的放一放。');
 line(tr('MEOWBOX  /  THE TAROT HOUSE','摸鱼小镇  /  塔罗小屋'),100,24,'#786847',600);
 const headline=lines(title,w-188,43,3),y0=153-(headline.length-1)*4;headline.forEach((v,i)=>line(v,y0+i*50,43,'#344b42',600));
 g.strokeStyle='#b39b69';g.lineWidth=1.3;g.beginPath();g.moveTo(130,264);g.lineTo(w/2-20,264);g.moveTo(w/2+20,264);g.lineTo(w-130,264);g.stroke();
 g.save();g.translate(w/2,264);g.rotate(Math.PI/4);g.fillStyle='#a98d57';g.fillRect(-6,-6,12,12);g.restore();
 for(const slot of geo.slots){
  const v=entry.cards[slot.i],cx=slot.cx,cy=slot.cy,cw=slot.w,ch=slot.h,x=cx-cw/2,y=cy-ch/2;
  g.save();g.shadowColor='#30291845';g.shadowBlur=16;g.shadowOffsetY=6;g.fillStyle='#465e50';g.fillRect(x-5,y-5,cw+10,ch+10);g.restore();g.strokeStyle='#b69d68';g.strokeRect(x-3,y-3,cw+6,ch+6);g.fillStyle='#eadbb5';g.fillRect(x,y,cw,ch);
  const im=useArt?readingArtwork(v.i):null;
  if(im?.complete&&im.naturalWidth&&im.naturalHeight){
   // Preserve aspect ratio instead of distorting the illustration.
   const scale=Math.min(cw/im.naturalWidth,ch/im.naturalHeight),iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;g.save();g.translate(cx,cy);if(v.rev)g.rotate(Math.PI);g.drawImage(im,-iw/2,-ih/2,iw,ih);g.restore()
  }else{
   g.save();g.translate(cx,cy);g.strokeStyle='#8e7b53';g.lineWidth=1.8;g.beginPath();g.arc(0,0,cw*.25,0,Math.PI*2);g.stroke();for(let j=0;j<12;j++){g.rotate(Math.PI/6);g.beginPath();g.moveTo(0,-cw*.30);g.lineTo(0,-cw*.39);g.stroke()}g.restore();font(Math.max(18,cw*.12),600);g.fillStyle='#6a5b41';g.fillText(String(v.i+1).padStart(2,'0'),cx,cy+7)
  }
  font(count===1?31:24,600);g.fillStyle='#374e44';g.fillText(tr(tarotDeck[v.i][0],tarotDeck[v.i][1]),cx,slot.labelY,slot.step-12);
  font(20,500);g.fillStyle='#77664d';g.fillText(orient(v.rev),cx,slot.orientY,slot.step-12);
 }
 const footerY=geo.footer;g.strokeStyle='#ad9665';g.beginPath();g.moveTo(130,footerY-48);g.lineTo(w-130,footerY-48);g.stroke();
 line(tr('A reflection, not a prediction.','一份启发，并非预言。'),footerY-15,23,'#79654a');
 line('MEOWBOX · '+tr('A SMALL TOWN FOR BIG FEELINGS','给心情留个小镇'),footerY+17,22,'#526759',600)
 }
 const formatButtons=[];for(const [id,label] of [['feed','4:5'],['xhs','3:4'],['story','9:16'],['square','1:1']]){const btn=b(controls,label,()=>{format=id;for(const [key,button] of formatButtons)button.setAttribute('aria-pressed',String(key===format));render()});btn.setAttribute('aria-pressed',String(id===format));formatButtons.push([id,btn])}
 render();const images=entry.cards.map(v=>readingArtwork(v.i)).filter(Boolean);for(const im of images)if(!im.complete)im.addEventListener('load',()=>{if(canvas.isConnected)render()},{once:true});
 b(wrap,tr('Save or share image','保存或分享图片'),async()=>{if(entry.cards.some(v=>{const im=readingArtwork(v.i);return !im?.complete||!im.naturalWidth})){toast(tr('The card illustrations are still loading. Please try again.','牌面插画尚未加载完成，请稍后再试。'));return}render(true);let blob;try{blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'))}catch(e){toast(tr('The illustrated card could not be exported.','暂时无法导出完整插画卡。'));return}if(!blob){toast(tr('Could not export image','暂时无法导出图片'));return}const file=new File([blob],'meowbox-tarot.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file]});return}catch(e){if(e.name==='AbortError')return}}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)});
 const returnTo=back||(()=>{$('page').style.display='none'});b(wrap,tr('Back','返回'),returnTo);const close=q.querySelector('.row button:first-child');if(close)close.onclick=returnTo;const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();tarotKeepsakePage(entry,back)}
 })
}
const tarotKeepsakeCSS=document.createElement('style');tarotKeepsakeCSS.textContent='.tarotKeepsake{display:flex;flex-direction:column;gap:10px;max-width:520px;margin:auto}.tarotKeepsakeCanvas{width:100%;height:auto;display:block;border:1px solid #9b8155;box-shadow:0 5px 18px #32271933}.tarotKeepsakeFormats{display:flex;gap:6px;justify-content:center}.tarotKeepsakeFormats button,.tarotKeepsake>button{min-height:44px}.tarotKeepsakeFormats button[aria-pressed=true]{background:#415b4f!important;color:#fff3d8!important;border-color:#344c42!important}.tarotKeepsakeFormats button{flex:1;min-width:44px}.tarotKeepsakeCanvas{max-height:68dvh;object-fit:contain;background:#253d3d}';document.head.append(tarotKeepsakeCSS);


/* Painted assets are scene objects, not background decorations. Six original
   residents already have transparent WebP standing and portrait assets.
   Do not substitute another resident or the player's avatar when loading. */
const residentArtworkRecords=[
 {id:'temple-keeper',names:['Temple keeper','庙祝'],height:112},
 {id:'master-yue',names:['Master Yue','月师傅','Astrologer','命理师'],height:116},
 {id:'fortune-teller',names:['Fortune Teller','占卜师'],height:116},
 {id:'auntie-mei',names:['Auntie Mei','梅姨'],height:110},
 {id:'wang-laoban',names:['Wang Laoban','王老板'],height:119},
 {id:'grandma',names:['Grandma','外婆'],height:106}
];
const residentArtworkCache=new Map();
function residentArtworkRecord(name){const names=Array.isArray(name)?name:[name];return residentArtworkRecords.find(v=>names.some(n=>v.names.some(a=>a.toLowerCase()===String(n).trim().toLowerCase())))||null}
function residentArtworkImage(record,portrait=false){
 if(!record)return null;const key=record.id+(portrait?':portrait':':stand');
 if(!residentArtworkCache.has(key)){const im=new Image();im.decoding='async';im.src='assets/visual/painted/'+record.id+'/'+(portrait?'expressions/warm.webp':'standing.webp');residentArtworkCache.set(key,im)}
 return residentArtworkCache.get(key)
}
function residentArtworkRect(record,im,x,y,scale){
 if(!record||!im?.naturalWidth||!im.naturalHeight||![x,y,scale].every(Number.isFinite)||scale<=0)return null;
 const h=record.height*scale,w=h*im.naturalWidth/im.naturalHeight;return {x:x-w/2,y:y-h,w,h}
}
function drawGatheringPainted(name,x,y,scale=1){
 const record=residentArtworkRecord(name),im=residentArtworkImage(record),rect=residentArtworkRect(record,im,x,y,scale);
 if(!im?.complete||!rect)return false;
 ctx.save();ellipse(x,y+1,Math.min(20,rect.w*.32),4,'#342e2540');ctx.drawImage(im,rect.x,rect.y,rect.w,rect.h);ctx.restore();return true
}
const gatheringPaintedBefore=gatheringResident;
gatheringResident=function(name,x,y,scale,facing,kind){
 if(residentArtworkRecord(name)){drawGatheringPainted(name,x,y,scale);return}
 return gatheringPaintedBefore(name,x,y,scale,facing,kind)
};
const paintedGatheringSayBefore=say;
say=function(name,...args){
 const result=paintedGatheringSayBefore(name,...args),record=residentArtworkRecord(name);
 if(!record)return result;const portrait=$('talkPortrait'),im=residentArtworkImage(record,true);if(!portrait||!im)return result;
 const apply=()=>{if(talkOpen&&$('speaker').textContent===String(name)&&im.complete&&im.naturalWidth){portrait.src=im.src;portrait.hidden=false;portrait.classList.add('paintedResidentPortrait');requestAnimationFrame(syncCharacterSpeech)}};
 if(im.complete){if(im.naturalWidth)apply();else portrait.hidden=true}else{portrait.hidden=true;im.addEventListener('load',apply,{once:true})}return result
};
const paintedGatheringIntroBefore=roomIntro;
roomIntro=function(){
 if(room==='tea'){for(const key of ['auntie-mei','grandma','wang-laoban','master-yue'])residentArtworkImage(residentArtworkRecords.find(v=>v.id===key))}
 if(room==='tarot')residentArtworkImage(residentArtworkRecords.find(v=>v.id==='fortune-teller'),true);
 return paintedGatheringIntroBefore()
};


/* Destiny House: a reading subject is deliberately local to the open page.
   A date-only reading must not quietly invent a time or birthplace. */
function destinyBirthValid(date,min,today){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<min||date>today)return false;
 const v=new Date(date+'T12:00:00Z');return Number.isFinite(+v)&&v.toISOString().slice(0,10)===date
}
function destinyFullValid(v,today){
 return destinyBirthValid(v.date,'1900-01-02',today)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time||'')&&!!v.place&&
 [v.offset,v.lat,v.lon].every(n=>typeof n==='string'&&n.trim()!==''&&Number.isFinite(Number(n)))&&
 Number(v.offset)>=-12&&Number(v.offset)<=14&&Number(v.lat)>=-66&&Number(v.lat)<=66&&Number(v.lon)>=-180&&Number(v.lon)<=180
}
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
const destinySubjectPageBefore=destinyPage;
destinyPage=function(options={}){
 const subject=options?.subject==='other'?'other':'self',draft=options?.draft||{},today=shrineClock().day;
 destinySubjectPageBefore();
 const q=$('content'),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');
 if(!form||!out)return;
 const strip=destinySubjectControls(q,subject,next=>destinyPage({subject:next}));form.before(strip);
 const dates=form.querySelector('input[type=date]'),time=form.querySelector('input[type=time]'),location=form.querySelector('details'),place=location?.querySelector('select'),nums=[...form.querySelectorAll('input[type=number]')];
 if(!dates||!time||!location||!place||nums.length!==3)return;
 dates.max=today;dates.value=draft.date||'';time.value=draft.time||'';
 const empty=element('option',tr('Select actual birthplace','选择实际出生地'),place);empty.value='';place.prepend(empty);place.required=true;place.value='';
 const oldChange=place.onchange;
 function summary(){
  const label=place.selectedOptions[0]?.textContent||'';
  location.querySelector('summary').textContent=place.value?tr('Birthplace: ','出生地：')+label:tr('Choose a birthplace to continue','请选择出生地');
 }
 function clearNumbers(){for(const n of nums)n.value=''}
 place.onchange=function(e){
  if(!place.value){clearNumbers();summary();return}
  if(place.value==='custom'){clearNumbers();summary();location.open=true;return}
  if(typeof oldChange==='function')oldChange.call(this,e);summary()
 };
 clearNumbers();
 if(draft.place&&[...place.options].some(v=>v.value===draft.place)){
  place.value=draft.place;if(draft.place!=='custom')place.onchange();
  [draft.offset,draft.lat,draft.lon].forEach((v,i)=>{if(typeof v==='string')nums[i].value=v})
 }
 summary();location.open=true;
 const submit=form.querySelector('button[type=submit]');
 if(submit)submit.textContent=subject==='other'?tr('Unroll their birth chart','展开对方的命盘'):tr('Unroll my birth chart','展开我的命盘');
 const note=element('small',tr('Use the actual local birth time and historical UTC offset. City presets are starting values, not historical time-zone verification. If the birth time is unknown, use the date-only almanac instead.','请使用实际当地出生时间及当时的时区差。城市预设仅供起始参考，并未核验历史时区。若不清楚出生时间，请使用仅需生日的生肖小册。'),q,'destinyBirthNote');form.before(note);
 let rendered=false;
 function invalidate(){if(out.childElementCount){out.replaceChildren();element('p',tr('Birth details changed. Unroll a fresh chart.','生辰资料已更改，请重新排盘。'),out)}rendered=false}
 form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
 form.addEventListener('submit',e=>{
  if(!destinyFullValid(destinyChartValues(form),today)){
   e.preventDefault();e.stopImmediatePropagation();out.replaceChildren();element('p',tr('Enter a valid birth date, known local birth time and birthplace.','请填写有效出生日期、已知的当地出生时间及出生地。'),out);return
  }
 },true);
 form.addEventListener('submit',()=>{
  rendered=!!out.querySelector('.ziGrid');
  if(!rendered)return;
  const context=element('p',subject==='other'?tr('Reading for someone else. These themes are prompts, not knowledge of their feelings or future.','正在查看他人的命盘。以下仅为反思主题，并不能读出对方的真实感受或未来。'):tr('Your birth chart · a moment of reflection','我的命盘 · 自我探索'),out,'destinyBirthNote');out.prepend(context);
  if(subject==='other'){
   const follow=out.querySelector('.chartFollowForm input');if(follow)follow.placeholder=tr('Choose a chart topic to explore','想了解命盘中的哪个主题？')
  }
 });
 const alternate=b(q,tr('Birth time unknown? Explore the date-only almanac','不知道出生时间？查看生肖流年小册'),()=>yueZodiacAlmanac(dates.value,null,{subject}));
 alternate.type='button';form.after(alternate);
 const clear=b(q,tr('Start a different reading','清空资料，重新查看'),()=>destinyPage({subject}));clear.type='button';
 const row=q.querySelector('.row');
 if(row?.lastElementChild)row.lastElementChild.onclick=()=>{const d=destinyChartValues(form),done=rendered;zh=!zh;save('zh',zh);updateHUD();destinyPage({subject,draft:d,render:done})};
 if(options?.render&&destinyFullValid(destinyChartValues(form),today)&&form.checkValidity())form.requestSubmit()
};
const destinySubjectAlmanacBefore=yueZodiacAlmanac;
yueZodiacAlmanac=function(birth='',selection=null,options={}){
 const subject=options?.subject==='other'?'other':'self',today=shrineClock().day;
 destinySubjectAlmanacBefore(destinyBirthValid(birth,'1901-01-01',today)?birth:'',selection);
 const q=$('content'),form=q.querySelector('.yueAlmanacForm'),out=q.querySelector('.yueAlmanacPaper');
 if(!form||!out)return;
 const date=form.querySelector('input[type=date]'),year=form.querySelector('select');
 if(!date||!year)return;
 const strip=destinySubjectControls(q,subject,next=>yueZodiacAlmanac('',null,{subject:next}));form.before(strip);
 const note=element('small',tr('Birth date only. No birth time is assumed, and no Moon, Rising or Zi Wei palace chart is calculated.','仅需出生日期。不假设出生时间，也不计算月亮、上升星座或紫微十二宫命盘。'),q,'destinyBirthNote');form.before(note);
 let rendered=false;
 function invalidate(){if(out.childElementCount)out.replaceChildren();rendered=false}
 form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
 form.addEventListener('submit',e=>{if(!destinyBirthValid(date.value,'1901-01-01',today)){e.preventDefault();e.stopImmediatePropagation();out.replaceChildren();element('p',tr('Please enter a valid birth date.','请输入有效出生日期。'),out)}},true);
 form.addEventListener('submit',()=>{rendered=!!out.querySelector('.yueReadingFront');if(rendered&&subject==='other'){const v=element('small',tr('Reading for someone else · folklore, not personal predictions','为他人查看 · 民俗趣味提示，并非个人预测'),out,'destinyBirthNote');out.prepend(v)}});
 const row=q.querySelector('.row');
 if(row?.lastElementChild)row.lastElementChild.onclick=()=>{const d=date.value,y=Number(year.value),done=rendered;zh=!zh;save('zh',zh);updateHUD();yueZodiacAlmanac(d,y,{subject,render:done})};
 const link=[...q.querySelectorAll('button')].find(v=>v.textContent===tr('Personal birth chart','个人生辰命盘'));
 if(link){link.textContent=tr('Full chart with known birth time','知道出生时间？查看完整命盘');link.onclick=()=>destinyPage({subject,draft:{date:date.value}})}
 b(q,tr('Start a different reading','清空资料，重新查看'),()=>yueZodiacAlmanac('',null,{subject}));
 if(options?.render&&form.checkValidity())form.requestSubmit()
};
destinyConsultMenu=function(){
 closeTalk();say(tr('Master Yue','月师傅'),tr('For yourself or someone else? A birthday is enough for the zodiac almanac. A full chart needs a known birth time and place.','想看自己，还是替别人看？生肖流年只需要生日；完整命盘则需要准确出生时间和地点。'),[
 [tr('Date only · Zodiac & Tai Sui','只知道生日 · 生肖与太岁'),()=>{closeTalk();yueZodiacAlmanac()}],
 [tr('Birth date, time & place · Personal chart','生辰与出生地 · 完整命盘'),()=>{closeTalk();destinyPage()}],
 [tr('Weekly star signs','本周十二星座'),()=>{closeTalk();starSignPage()}],
 [tr('Maybe later','改天再聊'),closeTalk]
 ])
};
const destinySubjectStyle=document.createElement('style');destinySubjectStyle.textContent='.destinySubjectStrip{margin:12px 0;padding:12px 0;border-block:1px solid #b6a17d}.destinySubjectStrip small,.destinyBirthNote{display:block;line-height:1.5;overflow-wrap:anywhere;margin:8px 0;color:#62553d}.destinySubjectChoices{display:flex;gap:8px;margin:8px 0}.destinySubjectChoices button{flex:1;min-height:44px;white-space:normal}.destinySubjectChoices button[aria-pressed=true]{background:#536b5a;color:#fff5de}.astroForm details select{width:100%;min-height:44px}.astroForm input{font-size:16px;max-width:100%;box-sizing:border-box}';document.head.append(destinySubjectStyle);

if(!maps[scene])scene='fortune';if(!load('routeV5',false)){scene='fortune';save('scene',scene);save('routeV5',true)}resetPosition();initNPC();updateHUD();hint(isRoute()?'Tap a doorway to walk inside, or swipe to explore.':'Tap a place to enter, or the path to walk.',isRoute()?'点击门口走进去，或滑动探索。':'点击地点进入，点击道路行走。');entryStory();requestAnimationFrame(loop);
