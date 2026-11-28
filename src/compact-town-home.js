/* Town Hall / My Room presentation. Loaded after startup so existing
   renderers, saved data, event handlers and contextual returns remain authoritative. */
(function(){
'use strict';
// PAW_COMPACT_HELPERS_BEGIN
function pageWindow(total,index,size){
 const pages=Math.max(1,Math.ceil(total/size)),page=Math.max(0,Math.min(pages-1,index));
 return {page,pages,start:page*size,end:Math.min(total,(page+1)*size)}
}
function residentLabel(text){return ['Fictional resident','虚构居民','Game character','游戏角色'].includes(text)}
function residentHeading(text){
 if(text==='Town notice · fictional')return 'Town notice';
 if(text==='小镇公告 · 虚构')return '小镇公告';
 if(text==='Fictional resident notices')return 'Town noticeboard';
 if(text==='虚构居民留言')return '小镇留言';
 return text
}
function residentDialogue(text){
 if(typeof text!=='string')return text;
 return text.replace(/\s*\(Fictional guest\)\s*$/,'').replace(/\s*（虚构客串角色）\s*$/,'').replace(/(\d+ \/ \d+ · )Fictional resident notices/g,'$1Town noticeboard').replace(/(\d+ \/ \d+ · )虚构居民留言/g,'$1小镇留言')
}
const residentPortraits=[
 ['Temple keeper','庙祝','temple-keeper'],['Master Yue','月师傅','master-yue'],['Fortune Teller','占卜师','fortune-teller'],
 ['Auntie Mei','梅姨','auntie-mei'],['Wang Laoban','王老板','wang-laoban'],['Grandma','外婆','grandma'],
 ['Grumpy Ah Ma','暴躁阿嬷','ah-ma'],['Auntie Lin','林姨','auntie-lin'],['Auntie Hong','红姐','auntie-hong']
];
function residentPortraitPath(name){
 const entry=residentPortraits.find(v=>v[0]===name||v[1]===name);
 return entry?'assets/visual/painted/'+entry[2]+'/expressions/warm.webp':null
}
function roomLampAnchor(id,left,top,height,stageHeight){
 if(!['lamp','shojiLamp','chineseLantern'].includes(id)||![left,top,height,stageHeight].every(Number.isFinite)||stageHeight<=0||height<=0||left<0||left>100||top<0||top>100)return null;
 const half=height/stageHeight*50;
 return {x:left,y:Math.max(0,Math.min(100,id==='chineseLantern'?top+half:top-half*.7))}
}
function roomLightState(lamps,dim){return lamps>0&&!dim?'lit':dim?'dim':'day'}

// The original rectangular room remains authoritative until the painted
// cutaway has passed visual and save-migration acceptance.
const cutawayIds={futon:'futon',bed:'single-bed',lamp:'paper-lamp',basicTable:'low-table',rug:'woven-rug',shelf:'bookcase',board:'board',plant:'fern',frame:'frame',kotatsu:'kotatsu',zabuton:'floor-cushion',teaCabinet:'teaCabinet',shojiLamp:'floor-lantern',bonsai:'bonsai',recordPlayer:'recordPlayer',catBasket:'cat-bed',sakuraVase:'flower-vase',lowDesk:'desk',retroTV:'retro-tv',displayCabinet:'display-cabinet',readingChair:'readingChair',chineseTeaTable:'tea-table',chineseScreen:'chineseScreen',chineseLantern:'chineseLantern',porcelainVase:'porcelainVase',chineseBench:'bench',moonShelf:'moonShelf'};
function cutawayCells(api,layout){
 const out=[];for(let u=0;u<7;u++)for(let v=0;v<7;v++)if(api.cellExists(layout,u,v))out.push({u,v});return out
}
function cutawayFree(api,layout,items){
 return cutawayCells(api,layout).filter(c=>!items.some(item=>{const f=api.footprint(item);return f?.layer==='floor'&&c.u>=item.u&&c.u<item.u+f.w&&c.v>=item.v&&c.v<item.v+f.d}))
}
function cutawayPlan(api,layout,source,saved){
 if(!Array.isArray(source))return null;
 const mapped=source.map((d,i)=>({id:cutawayIds[d.id],key:d.id,legacy:d,order:i,turn:Math.abs(Math.round((Number(d.r)||0)/90))%4}));
 if(mapped.some(d=>!d.id)||new Set(mapped.map(d=>d.key)).size!==mapped.length)return null;
 // Bounded backtracking keeps the largest objects first and searches for
 // a connected walkable floor, rather than trapping the avatar.
 mapped.sort((a,b)=>{const x=api.footprint({...a,u:0,v:0}),y=api.footprint({...b,u:0,v:0});return y.w*y.d-x.w*x.d||a.order-b.order});
 let budget=10000;
 function place(index,items){
  if(--budget<0)return null;
  if(index===mapped.length)return cutawayConnected(api,layout,items)?items:null;
  const item=mapped[index],base={id:item.id,key:item.key,turn:item.turn},old=Array.isArray(saved)?saved.find(x=>x?.key===item.key&&x.id===item.id):null;
  const x=Math.max(0,Math.min(1,Number(item.legacy.x)/100||.5)),y=Math.max(0,Math.min(1,Number(item.legacy.y)/100||.8));
  const choices=cutawayCells(api,layout).map(c=>({...base,...c})).filter(c=>api.canPlace(layout,c,items));
  choices.sort((a,b)=>{const p=api.anchor(layout,a),q=api.anchor(layout,b);return Math.hypot(p.x-x,p.y-y)-Math.hypot(q.x-x,q.y-y)});
  if(old&&api.canPlace(layout,old,items))choices.unshift({...old,key:item.key,id:item.id});
  for(const chosen of choices){if(budget<=0)return null;const result=place(index+1,[...items,chosen]);if(result)return result}
  return null
 }
 return place(0,[])
}
function cutawayConnected(api,layout,items){
 const free=cutawayFree(api,layout,items);
 return free.length>0&&free.every(c=>cutawayRoute(api,layout,items,free[0],c)!==null)
}
function cutawayRoute(api,layout,items,start,goal){
 const cells=cutawayFree(api,layout,items),key=c=>c.u+','+c.v,valid=new Set(cells.map(key));
 if(!start||!goal||!valid.has(key(start))||!valid.has(key(goal)))return null;
 const queue=[start],parents=new Map([[key(start),null]]);
 for(let i=0;i<queue.length;i++){
  const c=queue[i];if(key(c)===key(goal)){const out=[];for(let k=c;k;k=parents.get(key(k)))out.unshift(k);return out.slice(1)}
  for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={u:c.u+du,v:c.v+dv},k=key(n);if(valid.has(k)&&!parents.has(k)){parents.set(k,c);queue.push(n)}}
 }
 return null
}
// On a new tap during a walk, finish retracing the occupied edge to its
// last safe cell before following the new route. Never jump or cut through
// a furniture footprint; a seated actor starts at its safe approach cell.
function cutawayRetargetRoute(route,actor,foot,origin,seated=false){
 if(!Array.isArray(route)||!actor||!origin||![origin.x,origin.y].every(Number.isFinite))return null;
 const valid=!seated&&foot&&[foot.x,foot.y].every(Number.isFinite);
 const displaced=valid&&Math.hypot(foot.x-origin.x,foot.y-origin.y)>.0001;
 return {from:displaced?{x:foot.x,y:foot.y}:{x:origin.x,y:origin.y},route:displaced?[actor,...route]:route.slice()}
}
function cutawayMove(api,layout,items,key,cell,actor,turn=null){
 const item=items.find(i=>i.key===key);if(!item||!cell)return null;
 const next={...item,u:cell.u,v:cell.v,turn:turn===null?item.turn:turn};
 if(!api.canPlace(layout,next,items))return null;
 const changed=items.map(i=>i.key===key?next:i),free=cutawayFree(api,layout,changed);
 return cutawayConnected(api,layout,changed)&&(!actor||free.some(c=>c.u===actor.u&&c.v===actor.v))?changed:null
}
function cutawayApproach(api,layout,items,item,actor){
 const f=api.footprint(item);if(!f)return null;
 const candidates=cutawayFree(api,layout,items).filter(c=>{
  const dx=Math.max(item.u-c.u,0,c.u-(item.u+f.w-1)),dy=Math.max(item.v-c.v,0,c.v-(item.v+f.d-1));
  return dx+dy<=1
 });
 const routes=candidates.map(c=>({cell:c,route:cutawayRoute(api,layout,items,actor,c)})).filter(x=>x.route!==null);
 routes.sort((a,b)=>a.route.length-b.route.length);return routes[0]?.cell||null
}
function cutawayArtPaths(api,layout,items){
 const paths=[api.shell(layout),...items.map(i=>api.furniture(i.id))];
 if(paths.some(p=>typeof p!=='string'||!p))return null;
 return [...new Set(paths)]
}
async function cutawayArtReady(paths,decode){
 if(!Array.isArray(paths)||!paths.length)return false;
 try{return (await Promise.all(paths.map(path=>decode(path)))).every(Boolean)}catch{return false}
}
// Use the same visible bottom contact for both actors and furniture.
// Collision still uses the complete furniture footprint.
function cutawayDepth(y,layer='floor'){
 if(layer==='rug')return 2;if(layer==='wall')return 3;
 return Number.isFinite(y)?20+Math.round(y*1000):20
}
function cutawayDragOwner(){
 let press=null;
 return {
  begin(key,e){if(press||e.button!==0||e.isPrimary===false)return false;press={key,id:e.pointerId,x:e.clientX,y:e.clientY};return true},
  cancel(key,id){if(press?.key===key&&press.id===id)press=null},
  clear(){press=null},
  end(key,e){if(press?.key!==key||press.id!==e.pointerId)return false;const start=press;press=null;return Math.hypot(e.clientX-start.x,e.clientY-start.y)>=8}
 }
}
// Four existing extracted illustrations: low sitting, not raised-chair or sleeping poses.
const cutawaySeatArt=[
 {width:206,height:280,hip:[71,214]},
 {width:215,height:283,hip:[82,225]},
 {width:222,height:280,hip:[82,223]},
 {width:239,height:279,hip:[88,225]}
].map((p,i)=>Object.freeze({...p,path:'assets/visual/staging/2026-11-27-extracted/players/'+i+'/seated.webp'}));
function cutawaySeatFrame(index){return Number.isInteger(index)?cutawaySeatArt[index]||null:null}
// Use the actual contained image rather than the element's letterboxed area.
function cutawayContainedArt(box,width,height){
 if(!box||![box.left,box.top,box.width,box.height,width,height].every(Number.isFinite)||Math.min(box.width,box.height,width,height)<=0)return null;
 const k=Math.min(box.width/width,box.height/height),w=width*k,h=height*k;
 return {left:box.left+(box.width-w)/2,top:box.top+(box.height-h)/2,width:w,height:h}
}
// Reuse the same genuine low seated illustration on compatible surfaces.
const cutawaySeatSurfaces=Object.freeze({'floor-cushion':{x:.51,y:.43},futon:{x:.31,y:.64}});
function cutawaySeatSurface(id){return Object.hasOwn(cutawaySeatSurfaces,id)?cutawaySeatSurfaces[id]:null}
function cutawaySeatApproach(api,layout,items,item,actor){
 const f=api.footprint(item),anchor=api.anchor(layout,item);if(!f||!anchor)return null;
 // Prefer the aisle in front of the furniture, not the wall behind it.
 const options=cutawayFree(api,layout,items).filter(c=>{
  const dx=Math.max(item.u-c.u,0,c.u-(item.u+f.w-1)),dy=Math.max(item.v-c.v,0,c.v-(item.v+f.d-1));
  return dx+dy===1
 }).map(c=>({cell:c,p:api.project(layout,c.u+.5,c.v+.5),route:cutawayRoute(api,layout,items,actor,c)})).filter(c=>c.route!==null);
 options.sort((a,b)=>Number(b.p.y>=anchor.y)-Number(a.p.y>=anchor.y)||a.route.length-b.route.length);
 return options[0]?.cell||null
}
function cutawaySeatPlacement(stage,cushion,standingHeight,frame,mirrored=false,surface='floor-cushion'){
 if(!stage||!cushion||!frame||![stage.left,stage.top,stage.width,stage.height,cushion.left,cushion.top,cushion.width,cushion.height,standingHeight].every(Number.isFinite)||Math.min(stage.width,stage.height,cushion.width,cushion.height,standingHeight)<=0)return null;
 // Align the visible hip with the cushion's center seam. Match approximate
 // head scale to standing artwork; do not reuse the floor pose on a high bench.
 const seat=cutawaySeatSurface(surface);if(!seat)return null;
 const x=(cushion.left+cushion.width*(mirrored?1-seat.x:seat.x)-stage.left)/stage.width,y=(cushion.top+cushion.height*seat.y-stage.top)/stage.height;
 const width=standingHeight*.80*frame.width/frame.height/stage.width,height=standingHeight*.80/stage.height;
 const hx=frame.hip[0]/frame.width,hy=frame.hip[1]/frame.height;
 // Never crop the seated player's head or legs at the room edge.
 const edgeX=surface==='futon'&&mirrored?1-hx:hx;
 if(width<=0||width>.35||x-width*edgeX<0||x+width*(1-edgeX)>1||y-height*hy<0||y+height*(1-hy)>1)return null;
 return {x,y,width,hipX:hx*100,hipY:hy*100}
}
// Hidden and temporarily unmeasurable layouts are not proof of lost contact.
function cutawaySeatResume(hidden,stage,item,art,ratio){
 if(hidden||!stage||![stage.width,stage.height].every(Number.isFinite)||Math.min(stage.width,stage.height)<=0)return 'defer';
 if(!item||!Number.isFinite(ratio)||ratio<=0)return 'stand';
 if(!art||![art.width,art.height].every(Number.isFinite)||Math.min(art.width,art.height)<=0)return 'defer';
 return 'align'
}
function cutawayFootPivot(frame,mirrored=false){
 if(!frame||![frame.width,frame.height,...(frame.foot||[])].every(Number.isFinite)||frame.width<=0||frame.height<=0||frame.foot?.length!==2||frame.foot[0]<0||frame.foot[0]>frame.width||frame.foot[1]<0||frame.foot[1]>frame.height)return {x:50,y:100};
 // The transform origin stays on the real foot when mirroring.
 return {x:100*frame.foot[0]/frame.width,y:100*frame.foot[1]/frame.height}
}
// PAW_COMPACT_HELPERS_END
function replaceExact(root,selector,oldEN,oldZH,en,cn){
 for(const node of root.querySelectorAll(selector)){
  if(node.textContent===oldEN||node.textContent===oldZH)node.textContent=tr(en,cn)
 }
}
// Portraits are tied to authored names in local scenes only. Do not infer a
// human participant's avatar from their chosen name.
function addResidentPortrait(card){
 const name=card.querySelector(':scope > strong');
 if(!name||card.querySelector(':scope > .pawTownPortrait,:scope > .pawChatPortrait'))return;
 const path=residentPortraitPath(name.textContent);
 if(!path)return;
 const im=document.createElement('img');im.className='pawTownPortrait';im.alt='';im.decoding='async';im.loading='lazy';
 im.onerror=()=>{im.remove();card.classList.remove('pawTownWithPortrait')};
 card.prepend(im);card.classList.add('pawTownWithPortrait');im.src=path
}
function attachPager(list,selector,size,olderNav=null,clean=null,memory=null){
 if(!list||!list.parentNode)return;
 let index=memory?.page??0,count=0;
 const nav=element('nav','',list.parentNode,'pawCompactPager');list.after(nav);
 nav.setAttribute('aria-label',tr('Turn pages','翻页'));
 const prev=b(nav,tr('‹ Previous','‹ 上一页'),()=>{index--;paint()}),label=element('small','',nav),next=b(nav,tr('Next ›','下一页 ›'),()=>{index++;paint()});
 label.setAttribute('aria-live','polite');
 function paint(){
  if(!list.isConnected){observer.disconnect();return}
  const cards=[...list.querySelectorAll(selector)];if(clean)for(const card of cards)clean(card);
  const win=pageWindow(cards.length,index,size);index=win.page;count=cards.length;if(memory)memory.page=index;
  cards.forEach((card,i)=>{card.hidden=i<win.start||i>=win.end});
  prev.disabled=index===0;next.disabled=index>=win.pages-1;
  label.textContent=(index+1)+' / '+win.pages;nav.hidden=win.pages<=1;
  if(olderNav){const more=olderNav.querySelector('button');olderNav.hidden=index!==win.pages-1||!more||more.disabled}
 }
 const observer=new MutationObserver(()=>paint());observer.observe(list,{childList:true});
 if(olderNav)olderNav.addEventListener('click',e=>{if(e.target.closest('button')){const before=count;queueMicrotask(()=>{if(list.querySelectorAll(selector).length>before){index=Math.floor(before/size);paint()}})}},true);
 paint();return {reset(){index=0;paint()},disconnect(){observer.disconnect()}}
}
let boardSection='notices';
const boardPageMemory={page:0};
function compactBoard(q){
 const wall=q.querySelector('.townWall'),tabs=q.querySelector('.communityTabs');if(!wall||!tabs)return;
 const story=q.querySelector('.pawTownStoryNote'),guests=q.querySelector('.pawGuestNotice');
 const sections=[['notices','Noticeboard','留言',wall],['story','Town story','小镇故事',story],['guests','Around town','小镇来客',guests]].filter(v=>v[3]);
 const desk=element('section','',tabs.parentNode,'pawCompactBoard');tabs.after(desk);
 const rail=element('nav','',desk,'pawCompactSections');rail.setAttribute('aria-label',tr('Noticeboard sections','留言墙分类'));
 const panels=element('div','',desk,'pawCompactPanels');
 function select(key){
  boardSection=sections.some(v=>v[0]===key)?key:'notices';
  sections.forEach(([id,,,node])=>{node.hidden=id!==boardSection;if(id===boardSection&&node.tagName==='DETAILS')node.open=true});
  for(const btn of rail.children)btn.setAttribute('aria-pressed',String(btn.dataset.section===boardSection))
 }
 for(const [id,en,cn,node] of sections){const btn=b(rail,tr(en,cn),()=>select(id));btn.dataset.section=id;panels.append(node)}
 const disclosure=wall.querySelector('.wallDisclosure');if(disclosure)disclosure.textContent=tr('Catch up on the latest town news.','来看看小镇最近的新鲜事。');
 if(story){const refresh=()=>{replaceExact(story,'.pawStoryKicker','Resident stories · fictional town','居民小故事 · 虚构小镇','Town stories','小镇故事');replaceExact(story,'.pawStoryKicker','Resident story · fictional town','居民小故事 · 虚构小镇','Town story','小镇故事')};refresh();new MutationObserver(refresh).observe(story,{childList:true})}
 const roster=guests?.querySelector('p');if(roster)roster.textContent=tr('Meet these neighbours as you explore '+maps[scene].n[0]+'.','逛逛'+maps[scene].n[1]+'，也许就能遇见他们。');
 attachPager(wall.querySelector('.townPostList'),'.townResidentNote',2,wall.querySelector('.townPostNav'),card=>{const name=card.querySelector(':scope > strong');if(name){const clean=residentHeading(name.textContent);if(clean!==name.textContent)name.textContent=clean}addResidentPortrait(card)},boardPageMemory);select(boardSection);
}
function compactJoy(q){
 const wall=q.querySelector('.pawJoyWall'),list=wall?.querySelector('.pawJoyNotes'),form=wall?.querySelector('.pawJoyForm');if(!list||!form)return;
 const status=form.querySelector('small');if(status)status.textContent=tr('Your notes stay on this device.','便签仅保存在本设备。');
 const explanation=element('small',tr('Little joys from your neighbours.','小镇邻居的小确幸。'),wall,'pawCompactJoyDisclosure');list.before(explanation);
 const pager=attachPager(list,'.pawJoyNote',1,null,card=>{for(const label of card.querySelectorAll(':scope > small'))if(residentLabel(label.textContent))label.remove();addResidentPortrait(card)});
 form.addEventListener('submit',()=>queueMicrotask(()=>pager?.reset()));
}
// Only touch known authored interface labels. Never rewrite visitor or player messages.
function naturalTownLabels(q){
 replaceExact(q,'.communityTabs > button','Travellers','旅人聊天室','Square chat','广场聊天');
 replaceExact(q,'.pawTownLink strong','Traveller lobby','旅人聊天室','Square chat','广场聊天');
 replaceExact(q,'.pawTownLink small','Chat with real visitors.','和真实旅人聊聊天。','Say hello in the square.','去广场打个招呼。');
 replaceExact(q,'.pawTownLink small','Live chat is not open yet.','真人聊天室尚未开放。','The square chat is resting for now.','广场聊天室暂未开放。');
 replaceExact(q,'.pawTownLink small','Chat with fictional town residents, anytime.','随时跟小镇的虚构居民聊两句。','Pull up a chair and have a chat.','来坐坐，聊两句吧。');
 replaceExact(q,'.pawTownLink small','Pull up a chair and chat with the game’s residents.','找个座位，和小镇里的游戏角色聊两句。','Pull up a chair and have a chat.','来坐坐，聊两句吧。');
 replaceExact(q,'.pawTownPinned small','From fictional town residents','来自虚构小镇居民','Around town','小镇见闻');
 replaceExact(q,'.pawTownPinned small','Stories from the game’s residents','小镇角色的日常趣闻','Around town','小镇见闻');
 replaceExact(q,':scope > p','A chat with town characters · local play, not live players.','小镇角色聊天室 · 本地互动，非真人联机。','Pull up a chair.','来坐坐吧。');
 replaceExact(q,'.communityMuted','Tea chat · fictional town companions, private to this visit.','茶馆闲聊 · 虚构小镇伙伴，仅本次会话可见。','Tea table · private to this visit.','茶桌闲聊 · 仅本次会话可见。');
 for(const note of q.querySelectorAll('.pawResidentChatNote'))note.textContent=tr('This conversation is private to this visit.','这段聊天仅本次会话可见。');
}
// Online controls still use the genuine service and its actual connection state.
function townConnectionInfo(q){
 if(communityTab!=='public'||!q.querySelector('.communityTabs')||q.querySelector('.pawTownConnectionInfo'))return;
 const status=q.querySelector('.communityMuted[role=status]');
 if(!status)return;
 const info=element('details','',q,'pawTownConnectionInfo');
 element('summary',tr('About shared town life','关于小镇联机'),info);
 element('p',tr('Pawradise has authored residents and people who join the shared town. Everyday town encounters and notes can be part of the local game. Square chat publishes actual submitted messages when the connection is available.','小镇既有游戏设定的居民，也有加入联机的玩家。日常相遇和便签可以是本地游戏内容。广场聊天在联机服务可用时发布真实提交的留言。'),info);
 const refresh=()=>{
  if(!status.isConnected){observer.disconnect();return}
  const current=status.textContent;
  if(current==='Connected · real visitor posts · reviewed before publishing'||current==='已连接 · 真人留言 · 审核后公开')status.textContent=tr('Connected · messages reviewed before publishing','已连接 · 留言审核后公开');
  else if(current==='The shared square is not open yet. Messages here will appear only when a live community service is connected.'||current==='公共广场尚未开放，接入联机服务后才会显示真人留言。')status.textContent=tr('Square chat is not open yet. Come and sit at the tea table in the meantime.','广场聊天暂未开放，先到茶桌坐坐吧。');
 };
 const observer=new MutationObserver(refresh);observer.observe(status,{childList:true,characterData:true,subtree:true});refresh();
}
const pageBefore=page;
page=function(...args){$('content')?.classList.remove('pawCutawayOpen');const result=pageBefore(...args),q=$('content');naturalTownLabels(q);return result};
const sayBefore=say;
say=function(name,words,...rest){return sayBefore.call(this,residentDialogue(name),words,...rest)};
function dressTeaTable(q){
 const log=q.querySelector('.townChatTranscript');if(!log)return;
 const paint=()=>{for(const row of log.querySelectorAll('.townChatLine:not(.self)'))addResidentPortrait(row)};
 const observer=new MutationObserver(paint);observer.observe(log,{childList:true});paint()
}
const townBefore=townChatPage;
townChatPage=function(...args){
 const result=townBefore(...args),q=$('content');
 naturalTownLabels(q);
 if(communityTab==='board')compactBoard(q);
 if(communityTab==='gratitude')compactJoy(q);
 if(communityTab==='public')townConnectionInfo(q);
 if(communityTab==='lounge')dressTeaTable(q);
 return result
};
const goodBefore=goodCompanyPage;
goodCompanyPage=function(q,...args){
 const result=goodBefore(q,...args);
 for(const node of q.querySelectorAll('.goodCompanyBanner > small'))if(['Town residents · fictional companions','小镇居民 · 虚构伙伴'].includes(node.textContent))node.remove();
 const privacy=q.querySelector('.goodCompanyPrivacy');if(privacy)privacy.textContent=tr('Your note stays on this device. You can choose to share it in the square.','便签仅保存在本设备。你也可以选择分享到广场。');
 return result
};
// Lighting follows physical furniture, never an independent floating prop.
// Keep per-room preferences for this visit; the saved inventory is untouched.
const roomDimByZone=new Map();
function physicalRoomLight(stage,zone){
 const lamps=[...stage.querySelectorAll('.hideoutPlaced')].filter(im=>['lamp','shojiLamp','chineseLantern'].includes(im.dataset.furnitureId));
 if(!lamps.length)return;
 if(roomDimByZone.has(zone))stage.classList.toggle('dim',roomDimByZone.get(zone));
 const glows=lamps.map(im=>{
  const glow=element('div','',stage,'pawRoomLampGlow');glow.setAttribute('aria-hidden','true');return {im,glow}
 });
 function sync(){
  if(!stage.isConnected)return;
  const dim=stage.classList.contains('dim');roomDimByZone.set(zone,dim);
  stage.dataset.pawRoomLight=roomLightState(lamps.length,dim);
  for(const {im,glow} of glows){
   const anchor=roomLampAnchor(im.dataset.furnitureId,parseFloat(im.style.left),parseFloat(im.style.top),im.offsetHeight,stage.clientHeight);
   glow.hidden=!anchor;if(anchor){glow.style.left=anchor.x+'%';glow.style.top=anchor.y+'%'}
   im.setAttribute('aria-pressed',String(!dim));im.setAttribute('aria-label',dim?tr('Turn lamp on','开灯'):tr('Turn lamp off','关灯'))
  }
 }
 for(const {im} of glows){
  // Existing floor lamps retain their approach-to-object click handlers.
  // The ceiling lantern is reachable via tap/keyboard without an extra page.
  if(im.dataset.furnitureId==='chineseLantern'&&!im.hasAttribute('role')){
   im.tabIndex=0;im.setAttribute('role','button');
   im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();im.click()}}
  }
  im.addEventListener('load',sync,{once:true});
 }
 const observer=new MutationObserver(sync);observer.observe(stage,{attributes:true,attributeFilter:['class']});
 if(typeof ResizeObserver==='function'){
  const resize=new ResizeObserver(()=>{if(!stage.isConnected){resize.disconnect();observer.disconnect();return}sync()});resize.observe(stage);
 }
 sync();
}

const cutawayDecoded=new Map();
function decodeCutawayArt(path,expected=null){
 const key=expected?path+'|'+expected.width+'x'+expected.height:path;
 if(cutawayDecoded.has(key))return cutawayDecoded.get(key);
 const job=new Promise(resolve=>{
  const im=new Image();let done=false;
  function finish(ok){if(done)return;done=true;clearTimeout(timer);im.onload=im.onerror=null;resolve(ok)}
  const timer=setTimeout(()=>finish(false),8000);
  im.onerror=()=>finish(false);
  const valid=()=>im.naturalWidth>0&&im.naturalHeight>0&&(!expected||im.naturalWidth===expected.width&&im.naturalHeight===expected.height);
  im.onload=()=>{if(typeof im.decode==='function')im.decode().then(()=>finish(valid()),()=>finish(false));else finish(valid())};
  im.src=path
 }).then(ok=>{if(!ok)cutawayDecoded.delete(key);return ok});
 cutawayDecoded.set(key,job);return job
}
function mountCutaway(q,legacyStage){
 const launch=element('div','',q,'pawCutawayLaunch');legacyStage.before(launch);
 const button=b(launch,tr('Cutaway room','立体小窝'),open);
 let opened=false;
 async function open(){
  if(opened)return;opened=true;button.disabled=true;button.textContent=tr('Opening your room…','正在打开小窝…');
  const active=()=>q.contains(legacyStage)&&legacyStage.isConnected&&$('page').style.display==='block';
  const reset=()=>{opened=false;button.disabled=false;button.textContent=tr('Cutaway room','立体小窝')};
  const api=await pawLoadHomePaintings();
  if(!active()){reset();return}
  if(!api){reset();toast(tr('The painted room could not load. Your original room is unchanged.','立体小窝暂时无法载入，原本的小窝不会改变。'));return}
  const zone=komorebiZone,layout=['starter','side','studio'][zone]||'starter';
  const source=hideoutFurniture.filter(d=>furnitureZone(d)===zone);
  const store=load('pawHomeCutawayV1',{}),fingerprint=JSON.stringify(source.map(d=>[d.id,d.x,d.y,d.r]));
  const saved=store?.[zone]?.fingerprint===fingerprint?store[zone].items:null;
  let items=api&&cutawayPlan(api,layout,source,saved);
  if(!items){reset();toast(tr('This furniture arrangement needs more floor space. Your original room is safe.','这个布局需要更多空间，原本的小窝不会改变。'));return}
  const ready=await cutawayArtReady(cutawayArtPaths(api,layout,items),decodeCutawayArt);
  if(!active()||komorebiZone!==zone){reset();return}
  if(!ready){reset();toast(tr('The painted room could not load. Your original room is unchanged.','立体小窝暂时无法载入，原本的小窝不会改变。'));return}
  const panel=element('section','',q,'pawCutawayPanel');launch.after(panel);
  const stage=element('div','',panel,'pawCutawayStage'),shell=element('img','',stage,'pawCutawayShell');
  shell.alt='';shell.src=api.shell(layout);
  const controls=element('div','',panel,'pawCutawayControls');
  const status=element('small','',panel,'pawCutawayStatus');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const oldHidden=legacyStage.hidden;
  function close(){
   stop();drag.clear();seatResize?.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);panel.remove();legacyStage.hidden=oldHidden;q.classList.remove('pawCutawayOpen');reset();if(button.isConnected&&$('page').style.display==='block')button.focus({preventScroll:true})
  }
  function fail(){if(!panel.isConnected)return;close();toast(tr('The painted room could not load. Your original room is unchanged.','立体小窝暂时无法载入，原本的小窝不会改变。'))}
  shell.onerror=fail;shell.onload=()=>{if(shell.naturalWidth&&shell.naturalHeight)stage.style.aspectRatio=shell.naturalWidth+'/'+shell.naturalHeight};
  if(shell.complete&&shell.naturalWidth)shell.onload();
  b(controls,tr('Return to original room','返回原本小窝'),close);
  const edit=b(controls,tr('Move furniture','移动家具'),()=>{stop();position(point(actor));actorArt('down',false,0);editing=!editing;selected=null;edit.textContent=editing?tr('Finish arranging','完成布置'):tr('Move furniture','移动家具');render();sayStatus()});
  let editing=false,selected=null,actor=cutawayFree(api,layout,items).at(-1),raf=0,epoch=0;
  const drag=cutawayDragOwner();
  let seatedKey=null,seatStandingRatio=0,seatResize=null,visibleFoot=null;
  const seatFrame=cutawaySeatFrame(avatar??0);let seatReady=false;
  const lampKeys=items.filter(i=>['lamp','shojiLamp','chineseLantern'].includes(i.key)).map(i=>i.key);
  const savedLights=store?.[zone]?.fingerprint===fingerprint?store[zone].lights:null;
  const lights=new Set(Array.isArray(savedLights)?lampKeys.filter(id=>savedLights.includes(id)):lampKeys);
  const player=element('img','',stage,'pawCutawayActor');player.alt=tr('Your avatar','你的角色');actorArt('down',false,0);
  const stop=()=>{epoch++;cancelAnimationFrame(raf);raf=0};
  const onVisibility=()=>{
   if(document.hidden){drag.clear();stop();if(!seatedKey){position(point(actor));actorArt('down',false,0)}}
   else if(seatedKey)syncSeat()
  };
  const observer=new MutationObserver(()=>{if(!panel.isConnected||$('page').style.display!=='block')close()});
  observer.observe($('page'),{attributes:true,attributeFilter:['style','hidden']});observer.observe(q,{childList:true});
  document.addEventListener('visibilitychange',onVisibility);
  const point=c=>api.project(layout,c.u+.5,c.v+.5);
  function position(p){visibleFoot={x:p.x,y:p.y};player.style.left=p.x*100+'%';player.style.top=p.y*100+'%';player.style.zIndex=String(cutawayDepth(p.y))}
  function actorArt(direction,walking,distance){
   seatedKey=null;seatStandingRatio=0;player.style.removeProperty('width');player.style.removeProperty('max-height');delete player.dataset.seated;
   pawHomeActorArt(player,direction,walking,distance);
   const dir=direction==='left'?'right':direction,frames=mbArtRegistry.players[avatar??0]?.walk?.[dir];
   const frame=walking&&frames?.length?frames[Math.floor(distance/2.1)%frames.length]:null;
   const im=frame&&mbArtImage(frame),actual=im?.complete&&im.naturalWidth&&player.getAttribute('src')===im.src?frame:null;
   const pivot=cutawayFootPivot(actual,direction==='left');
   player.style.setProperty('--paw-cutaway-foot-x',pivot.x+'%');player.style.setProperty('--paw-cutaway-foot-y',pivot.y+'%')
  }
  function alignSeat(item,standingRatio){
   if(!seatReady||!seatFrame)return false;
   const cushion=Array.from(stage.querySelectorAll('.pawCutawayFurniture')).find(n=>n.dataset.furnitureKey===item.key);
   const bounds=stage.getBoundingClientRect();
   const visible=cushion&&cutawayContainedArt(cushion.getBoundingClientRect(),cushion.naturalWidth,cushion.naturalHeight);
   const p=cutawaySeatPlacement(bounds,visible,standingRatio*bounds.height,seatFrame,item.turn%2===1,item.id);
   if(!p)return false;
   seatedKey=item.key;seatStandingRatio=standingRatio;player.dataset.seated='true';
   if(player.getAttribute('src')!==seatFrame.path)player.src=seatFrame.path;
   player.style.width=p.width*100+'%';player.style.maxHeight='none';
   player.style.setProperty('--paw-home-facing',item.id==='futon'&&item.turn%2===1?'-1':'1');
   player.style.setProperty('--paw-cutaway-foot-x',p.hipX+'%');player.style.setProperty('--paw-cutaway-foot-y',p.hipY+'%');
   position(p);player.style.zIndex=String(Math.max(cutawayDepth(p.y),Number(cushion.style.zIndex)+1));
   return true
  }
  function sitOnFurniture(item){
   const h=stage.getBoundingClientRect().height;
   if(!h||!alignSeat(item,player.getBoundingClientRect().height/h)){
    status.textContent=tr('I need a little more space to sit.','这里得留点空间才能坐下。');return
   }
   status.textContent=item.id==='futon'?tr('A quiet moment on the futon. Tap it again to stand.','在被褥上歇一会儿。再点一下就起身。'):tr('A moment to do absolutely nothing. Tap the cushion again to stand.','什么也不做，舒服一下。再点坐垫就起身。');
  }
  function syncSeat(){
   if(!seatedKey||!panel.isConnected)return;
   const item=items.find(i=>i.key===seatedKey),im=item&&Array.from(stage.querySelectorAll('.pawCutawayFurniture')).find(n=>n.dataset.furnitureKey===item.key);
   const bounds=stage.getBoundingClientRect(),art=im&&cutawayContainedArt(im.getBoundingClientRect(),im.naturalWidth,im.naturalHeight);
   const decision=cutawaySeatResume(document.hidden,bounds,item,art,seatStandingRatio);
   if(decision==='defer')return;
   if(decision==='stand'||!alignSeat(item,seatStandingRatio)){actorArt('down',false,0);position(point(actor));sayStatus()}
  }
  if(typeof ResizeObserver==='function'){
   seatResize=new ResizeObserver(syncSeat);seatResize.observe(stage)
  }
  function sayStatus(){status.textContent=editing?selected?tr('Tap an empty floor space to place the selected piece.','点击空地摆放选中的家具。'):tr('Tap a piece of furniture to move it.','点击家具开始移动。'):tr('Tap the floor to walk.','点击地板走动。')}
  function persist(){const previous=load('pawHomeCutawayV1',{});save('pawHomeCutawayV1',{...(previous&&typeof previous==='object'?previous:{}),[zone]:{fingerprint,items,lights:[...lights]}})}
  function move(cell){
   const changed=cutawayMove(api,layout,items,selected,cell,actor);
   if(!changed){status.textContent=tr('There is not enough room there.','那里没有足够空间。');return}
   items=changed;persist();render();sayStatus()
  }
  function walk(goal,arrive=null){
   const route=cutawayRoute(api,layout,items,actor,goal);if(!route){status.textContent=tr('The furniture is in the way.','家具挡住了去路。');return}
   const nextWalk=cutawayRetargetRoute(route,actor,visibleFoot,point(actor),!!seatedKey);
   if(!nextWalk)return;
   const steps=nextWalk.route;
   stop();const token=epoch;let from=nextWalk.from,started=null,distance=0;
   const first=steps[0]&&point(steps[0]);
   actorArt(first?pawHomeDirection(from,first,stage.clientWidth/Math.max(1,stage.clientHeight)):'down',false,0);position(from);
   function step(now){
    if(token!==epoch)return; // An obsolete callback must not cancel a newer walk.
    if(!panel.isConnected||document.hidden||$('page').style.display!=='block'){stop();position(point(actor));actorArt('down',false,0);return}
    const next=steps[0];if(!next){position(point(actor));actorArt('down',false,distance);raf=0;if(typeof arrive==='function')arrive();return}
    const to=point(next),length=Math.hypot(to.x-from.x,to.y-from.y),duration=Math.max(160,length*3400);
    if(started===null)started=now;
    const t=residentReducedMotion.matches?1:Math.min(1,(now-started)/duration);
    const p={x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t};position(p);
    actorArt(pawHomeDirection({x:from.x,y:from.y},{x:to.x,y:to.y},stage.clientWidth/Math.max(1,stage.clientHeight)),t<1,distance+t*length*100);
    if(t===1){actor=steps.shift();from=to;started=null;distance+=length*100}raf=requestAnimationFrame(step)
   }
   raf=requestAnimationFrame(step)
  }
  function use(item){
   if(cutawaySeatSurface(item.id)&&seatedKey===item.key){actorArt('down',false,0);position(point(actor));sayStatus();return}
   const goal=cutawaySeatSurface(item.id)?cutawaySeatApproach(api,layout,items,item,actor):cutawayApproach(api,layout,items,item,actor);
   if(!goal){status.textContent=tr('I need a little more space to get there.','这里得留点空间才能走过去。');return}
   walk(goal,()=>{
    if(cutawaySeatSurface(item.id)){sitOnFurniture(item);return}
    if(['lamp','shojiLamp','chineseLantern'].includes(item.key)){
     if(lights.has(item.key))lights.delete(item.key);else lights.add(item.key);
     persist();render();status.textContent=lights.has(item.key)?tr('A little warmth for the room.','小窝又暖和了一点。'):tr('Time for a quiet evening.','享受安静的夜晚吧。');return
    }
    if(item.key==='board'){close();myNotes9();mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage)}
    else if(item.key==='frame'){close();album9();mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage)}
    else if(item.key==='shelf'){close();hideoutClaimPage();mbHomePageBack(tr('‹ My Room','‹ 返回小窝'),hideoutPage)}
    else if(item.key==='displayCabinet'){close();figureCabinetPage()}
    else if(item.key==='retroTV'){close();komorebiTVPage()}
   })
  }
  const turnButton=b(controls,tr('Turn furniture','转动家具'),()=>{
   if(!editing||!selected)return;
   const item=items.find(i=>i.key===selected);
   const changed=cutawayMove(api,layout,items,selected,item,actor,(item.turn+1)%4);
   if(!changed){status.textContent=tr('Not enough space to turn this piece.','这里没有足够空间转动家具。');return}
   items=changed;persist();render();sayStatus()
  });
  function render(){
   drag.clear();
   turnButton.hidden=!editing;turnButton.disabled=!selected;
   stage.querySelectorAll('.pawCutawayFurniture,.pawCutawayGlow').forEach(n=>n.remove());
   for(const item of items){
    const a=api.anchor(layout,item),f=api.footprint(item),im=element('img','',stage,'pawCutawayFurniture');
    im.alt=roomNames9[item.key]?tr(...roomNames9[item.key]):item.key;im.dataset.furnitureKey=item.key;im.src=api.furniture(item.id);im.onerror=fail;im.draggable=false;im.addEventListener('load',()=>{if(seatedKey===item.key)syncSeat()},{once:true});
    im.style.left=a.x*100+'%';im.style.top=(a.y-(f.layer==='wall'?.14:0))*100+'%';
    im.style.width=Math.min(46,Math.max(12,furnitureWidth(item.key)*(layout==='starter'?1:.78)))+'%';
    im.style.zIndex=String(cutawayDepth(a.y,f.layer));
    // The same illustrated cutout can be mirrored, never rotated onto its side.
    im.style.setProperty('--paw-cutaway-facing',item.turn%2?' -1':'1');
    if(lights.has(item.key)){const glow=element('div','',stage,'pawCutawayGlow');glow.style.left=a.x*100+'%';glow.style.top=(a.y-(f.layer==='wall'?.14:.06))*100+'%';glow.setAttribute('aria-hidden','true')}
    if(!editing&&(['lamp','shojiLamp','chineseLantern','board','frame','shelf','displayCabinet','retroTV'].includes(item.key)||cutawaySeatSurface(item.id)&&seatReady)){
     im.tabIndex=0;im.setAttribute('role','button');if(['lamp','shojiLamp','chineseLantern'].includes(item.key))im.setAttribute('aria-pressed',String(lights.has(item.key)));
     im.onclick=e=>{e.stopPropagation();use(item)};im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();use(item)}}
    }
    im.classList.toggle('selected',selected===item.key);im.dataset.layer=f.layer;im.style.touchAction=editing?'none':'';
    if(editing){im.tabIndex=0;im.setAttribute('role','button');im.setAttribute('aria-pressed',String(selected===item.key));
     const choose=()=>{selected=item.key;turnButton.disabled=false;for(const n of stage.querySelectorAll('.pawCutawayFurniture')){n.classList.toggle('selected',n===im);n.setAttribute('aria-pressed',String(n===im))}sayStatus()};
     im.onclick=e=>{e.stopPropagation();if(e.isPrimary===false)return;choose()};im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();stage.focus({preventScroll:true})}};
     im.onpointerdown=e=>{if(!drag.begin(item.key,e))return;try{im.setPointerCapture(e.pointerId)}catch{drag.cancel(item.key,e.pointerId)}};
     im.onpointercancel=im.onlostpointercapture=e=>drag.cancel(item.key,e.pointerId);
     im.onpointerup=e=>{if(!drag.end(item.key,e)||!editing||!im.isConnected)return;choose();const rect=stage.getBoundingClientRect();move(api.nearestCell(layout,(e.clientX-rect.left)/rect.width,(e.clientY-rect.top)/rect.height))}
    }
   }
   position(point(actor))
  }
  stage.tabIndex=0;stage.setAttribute('aria-label',tr('Walkable cutaway room','可行走的立体小窝'));
  stage.onclick=e=>{if(e.target.closest('.pawCutawayFurniture,.pawCutawayActor'))return;const rect=stage.getBoundingClientRect(),cell=api.nearestCell(layout,(e.clientX-rect.left)/rect.width,(e.clientY-rect.top)/rect.height);if(!cell)return;if(editing&&selected)move(cell);else if(!editing)walk(cell)};
  stage.onkeydown=e=>{if(e.target!==stage)return;const d={ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!d)return;e.preventDefault();e.stopPropagation();if(editing&&selected){const i=items.find(v=>v.key===selected);move({u:i.u+d[0],v:i.v+d[1]})}else if(!editing)walk({u:actor.u+d[0],v:actor.v+d[1]})};
  pawHomeStop();render();sayStatus();legacyStage.hidden=true;q.classList.add('pawCutawayOpen');stage.focus({preventScroll:true});
  if(seatFrame&&items.some(i=>cutawaySeatSurface(i.id)))decodeCutawayArt(seatFrame.path,seatFrame).then(ok=>{
   if(!ok||!panel.isConnected||!active())return;seatReady=true;
   // Upgrade just the cushion input, without rerendering or interrupting a walk.
   for(const item of items.filter(i=>cutawaySeatSurface(i.id))){
    const im=Array.from(stage.querySelectorAll('.pawCutawayFurniture')).find(n=>n.dataset.furnitureKey===item.key);
    if(!im||editing)continue;im.tabIndex=0;im.setAttribute('role','button');
    im.onclick=e=>{e.stopPropagation();use(item)};
    im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();use(item)}}
   }
  });
 }
}
const homeBefore=hideoutPage;
let pawRoomMaterialsOpen=false;
hideoutPage=function(...args){
 const result=homeBefore(...args),q=$('content'),stage=q.querySelector('.hideoutScene');
 if(!stage)return result;
 stage.classList.add('pawRoomFirst');stage.dataset.roomEditing=String(!!hideoutEditing);
 const ribbon=q.querySelector('.hideoutRibbon'),tabs=q.querySelector('.komorebiRoomTabs');
 // Keep the scene's parent, hit geometry, furniture transforms and existing controls.
 const caption=q.querySelector('.hideoutRoomCaption'),hint=q.querySelector('.pawHomeWalkHint');
 let anchor=hint||caption||stage;
 if(ribbon){anchor.after(ribbon);anchor=ribbon}
 if(tabs){anchor.after(tabs);anchor=tabs}
 if(hideoutEditing){
  // Keep the selection and movement controls next to the room. Only secondary
  // renovation materials are tucked away; the owned furniture tray stays open.
  const tools=q.querySelector('.hideoutTools'),selection=q.querySelector('.mbHomeSelection');
  if(tools){stage.after(tools);if(selection)tools.after(selection)}
  const materials=[...q.querySelectorAll('.komorebiBook')].find(n=>n.querySelector('.komorebiFinishChoices'));
  if(materials){
   const fold=element('details','',q,'pawRoomExpansionFold pawRoomMaterialsFold');
   const summary=element('summary',tr('Wallpaper & flooring','墙纸与地板'),fold);
   fold.open=pawRoomMaterialsOpen;
   summary.addEventListener('click',event=>{event.preventDefault();pawRoomMaterialsOpen=!fold.open;fold.open=pawRoomMaterialsOpen});
   materials.before(fold);fold.append(materials)
  }
  return result
 }
 pawRoomMaterialsOpen=false;
 // Keep a compact room-side tray for optional collections and purchases.
 const primary=q.querySelector('.hideoutPrimary');
 if(primary){
  const buttons=[...primary.querySelectorAll(':scope > button')];
  const decorate=buttons.find(v=>v.textContent===tr('Decorate room','布置小窝'));
  const collections=buttons.find(v=>v.textContent===tr('My collections','我的收藏'));
  const extras=buttons.filter(v=>v!==decorate&&v!==collections);
  if(decorate&&extras.length){
   const fold=element('details','',primary,'pawRoomExtras');element('summary',tr('Room belongings','小窝物品'),fold);
   const tray=element('div','',fold,'pawRoomExtraTray');extras.forEach(btn=>tray.append(btn))
  }
 }
 physicalRoomLight(stage,String(komorebiZone));
 mountCutaway(q,stage);
 const expansion=q.querySelector('.pawHomeExpansion');
 if(expansion){
  const fold=element('details','',q,'pawRoomExpansionFold');element('summary',tr('Room expansions','小窝扩建'),fold);expansion.before(fold);fold.append(expansion)
 }
 return result
};
const style=document.createElement('style');style.textContent=`
#game #content .pawCutawayLaunch{display:flex;justify-content:center;margin:4px 0}
#game #content .pawCutawayLaunch button,#game #content .pawCutawayControls button{min-height:44px}
#game #content .pawCutawayPanel{margin:0 auto;width:min(100%,530px)}
#game #content .pawCutawayStage{position:relative;width:100%;aspect-ratio:1;isolation:isolate;overflow:hidden;background:#eadfc8}
#game #content .pawCutawayShell{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none}
#game #content .pawCutawayFurniture,#game #content .pawCutawayActor{position:absolute;transform:translate(-50%,-100%);object-fit:contain;max-height:40%;filter:drop-shadow(0 2px 2px #503e3040)}
#game #content .pawCutawayActor{width:12%;max-height:28%;pointer-events:none;transform-origin:var(--paw-cutaway-foot-x,50%) var(--paw-cutaway-foot-y,100%);transform:translate(calc(0% - var(--paw-cutaway-foot-x,50%)),calc(0% - var(--paw-cutaway-foot-y,100%))) scaleX(var(--paw-home-facing,1))}
#game #content .pawCutawayFurniture{transform:translate(-50%,-100%) scaleX(var(--paw-cutaway-facing,1))}
#game #content .pawCutawayGlow{position:absolute;z-index:4;pointer-events:none;width:32%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(ellipse,#ffe6a76b,transparent 72%)}
#game #content .pawCutawayControls button[hidden]{display:none!important}
#game #content .pawCutawayFurniture.selected{outline:2px dashed #526a50}
#game #content .pawCutawayControls{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:5px 0}
#game #content .pawCutawayStatus{display:block;text-align:center;margin:6px 0;color:#675943}
#game #content.pawCutawayOpen .hideoutScene[hidden],#game #content.pawCutawayOpen .pawHomeWalkHint,#game #content.pawCutawayOpen .hideoutRibbon,#game #content.pawCutawayOpen .komorebiRoomTabs,#game #content.pawCutawayOpen .pawRoomExpansionFold,#game #content.pawCutawayOpen .pawPersonalShelf,#game #content.pawCutawayOpen .pawCutawayLaunch,#game #content.pawCutawayOpen .hideoutPrimary,#game #content.pawCutawayOpen .hideoutRoomCaption{display:none!important}
#game #content .pawRoomLampGlow{position:absolute;z-index:4;width:44%;aspect-ratio:1;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(ellipse at center,#ffe7a659 0%,#f9d48a22 38%,transparent 72%);opacity:0;transition:opacity .4s}
#game #content .pawRoomLampGlow[hidden]{display:none!important}
#game #content .pawRoomFirst[data-paw-room-light=lit] .pawRoomLampGlow{opacity:1}
#game #content .pawRoomFirst[data-paw-room-light=dim] .pawRoomLampGlow{opacity:0}
@media(prefers-reduced-motion:reduce){#game #content .pawRoomLampGlow{transition:none}}
#game #content .pawTownWithPortrait.pawTownWithPortrait{position:relative;min-height:64px;padding-left:62px!important;box-sizing:border-box}
#game #content .pawTownPortrait{position:absolute;top:12px;left:8px;width:44px;height:44px;object-fit:cover;object-position:center 35%;border-radius:50%;background:#e8d9bb;border:1px solid #ae9774;box-sizing:border-box}
#game #content .pawTownWithPortrait>strong{min-height:20px}
#game #content .pawRoomExtras{flex:1 1 120px;min-width:0}
#game #content .pawRoomExtras summary{min-height:44px;align-content:center;text-align:center;cursor:pointer;background:#e7d8b8;border:1px solid #b6a17d;color:#4b5e48;padding:4px 8px;box-sizing:border-box;border-radius:4px}
#game #content .pawRoomExtraTray{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
#game #content .pawRoomExtraTray button{min-height:44px;flex:1 1 120px}
#game #content .pawRoomFirst[data-room-editing=true]{width:min(100%,clamp(200px,calc(72dvh - 130px),530px))!important}

#game #content .pawTownConnectionInfo{margin:12px 0 0;border-top:1px dashed #bda582;padding-top:6px;font-size:12px;color:#675943}
#game #content .pawTownConnectionInfo summary{cursor:pointer;min-height:44px;align-content:center}
#game #content .pawCompactBoard{margin:6px 0 0}
#game #content .pawCompactSections{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid #bca57e;padding:3px 0 6px}
#game #content .pawCompactSections button{flex:1 1 0;min-width:0;min-height:44px;white-space:normal!important;padding:5px!important;font-size:13px!important}
#game #content .pawCompactSections button[aria-pressed=true]{background:#556b50!important;color:#fff2d5!important}
#game #content .pawCompactPanels>[hidden],#game #content .townResidentNote[hidden],#game #content .pawJoyNote[hidden],#game #content .pawCompactPager[hidden],#game #content .townPostNav[hidden]{display:none!important}
#game #content .pawCompactPager{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;min-width:0}
#game #content .pawCompactPager button{min-height:44px;white-space:normal!important}
#game #content .pawCompactPager small{white-space:nowrap}
#game #content .pawCompactJoyDisclosure{display:block;font-size:12px;line-height:1.45;margin-top:12px}
#game #content .pawJoyNotes{display:block!important}
#game #content .pawJoyNote{margin:6px 0}
#game #content .pawRoomFirst{width:min(100%,clamp(200px,calc(80dvh - 190px),530px))!important;aspect-ratio:4/5!important;max-height:none!important;margin:4px auto!important}
#game #content:has(.pawRoomFirst)>.hideoutIntro{display:none!important}
#game #content:has(.pawRoomFirst) .hideoutRibbon{margin:5px 0!important;justify-content:center}
#game #content:has(.pawRoomFirst) .hideoutPrimary{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin:3px 0!important}
#game #content:has(.pawRoomFirst) .hideoutPrimary button{min-height:44px;flex:1 1 120px;white-space:normal!important;padding:6px!important}
#game #content .pawRoomExpansionFold{border-top:1px dashed #bda582;padding:5px 0;margin:5px 0}
#game #content .pawRoomExpansionFold summary{min-height:44px;align-content:center;cursor:pointer;color:#4c6248}
#game #content .pawRoomExpansionFold .pawHomeExpansion{margin:0!important}
@media(max-height:480px) and (orientation:landscape){#game #content .pawRoomFirst{width:min(100%,300px)!important}}
`;document.head.append(style);
})();
