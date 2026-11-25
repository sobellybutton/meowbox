
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
hideoutPage=function(){cabinetRoomBefore();const q=$('content'),stage=q.querySelector('.hideoutScene');if(!stage)return;const actions=q.querySelector('.hideoutPrimary');if(actions)b(actions,tr('Display cabinet','手办展示柜'),()=>figureCabinetPage());
 if(figureCabinetIds().length&&!hideoutEditing){const cabinet=element('button','',stage,'figureCabinetInRoom');cabinet.setAttribute('aria-label',tr('Figure display cabinet','手办展示柜'));fillFigureShelf(cabinet);cabinet.onclick=()=>figureCabinetPage()}
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

if(!maps[scene])scene='fortune';if(!load('routeV5',false)){scene='fortune';save('scene',scene);save('routeV5',true)}resetPosition();initNPC();updateHUD();hint(isRoute()?'Tap a doorway to walk inside, or swipe to explore.':'Tap a place to enter, or the path to walk.',isRoute()?'点击门口走进去，或滑动探索。':'点击地点进入，点击道路行走。');entryStory();requestAnimationFrame(loop);
