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
// PAW_COMPACT_HELPERS_END
function replaceExact(root,selector,oldEN,oldZH,en,cn){
 for(const node of root.querySelectorAll(selector)){
  if(node.textContent===oldEN||node.textContent===oldZH)node.textContent=tr(en,cn)
 }
}
function attachPager(list,selector,size,olderNav=null,clean=null){
 if(!list||!list.parentNode)return;
 let index=0,count=0;
 const nav=element('nav','',list.parentNode,'pawCompactPager');list.after(nav);
 nav.setAttribute('aria-label',tr('Turn pages','翻页'));
 const prev=b(nav,tr('‹ Previous','‹ 上一页'),()=>{index--;paint()}),label=element('small','',nav),next=b(nav,tr('Next ›','下一页 ›'),()=>{index++;paint()});
 label.setAttribute('aria-live','polite');
 function paint(){
  if(!list.isConnected){observer.disconnect();return}
  const cards=[...list.querySelectorAll(selector)];if(clean)for(const card of cards)clean(card);
  const win=pageWindow(cards.length,index,size);index=win.page;count=cards.length;
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
 const disclosure=wall.querySelector('.wallDisclosure');if(disclosure)disclosure.textContent=tr('News from around town. Online visitor posts are under Travellers.','小镇里的新鲜事。联机旅人的留言请到旅人聊天室。');
 if(story){const refresh=()=>{replaceExact(story,'.pawStoryKicker','Resident stories · fictional town','居民小故事 · 虚构小镇','Town stories','小镇故事');replaceExact(story,'.pawStoryKicker','Resident story · fictional town','居民小故事 · 虚构小镇','Town story','小镇故事')};refresh();new MutationObserver(refresh).observe(story,{childList:true})}
 const roster=guests?.querySelector('p');if(roster)roster.textContent=tr('Meet these neighbours as you explore '+maps[scene].n[0]+'.','逛逛'+maps[scene].n[1]+'，也许就能遇见他们。');
 attachPager(wall.querySelector('.townPostList'),'.townResidentNote',2,wall.querySelector('.townPostNav'),card=>{const name=card.querySelector(':scope > strong');if(name){const clean=residentHeading(name.textContent);if(clean!==name.textContent)name.textContent=clean}});select(boardSection);
}
function compactJoy(q){
 const wall=q.querySelector('.pawJoyWall'),list=wall?.querySelector('.pawJoyNotes'),form=wall?.querySelector('.pawJoyForm');if(!list||!form)return;
 const status=form.querySelector('small');if(status)status.textContent=tr('Your notes stay on this device.','便签仅保存在本设备。');
 const explanation=element('small',tr('Little joys from your neighbours.','小镇邻居的小确幸。'),wall,'pawCompactJoyDisclosure');list.before(explanation);
 const pager=attachPager(list,'.pawJoyNote',1,null,card=>{for(const label of card.querySelectorAll(':scope > small'))if(residentLabel(label.textContent))label.remove()});
 form.addEventListener('submit',()=>queueMicrotask(()=>pager?.reset()));
}
// Only touch known authored interface labels. Never rewrite visitor or player messages.
function naturalTownLabels(q){
 replaceExact(q,'.pawTownLink small','Chat with fictional town residents, anytime.','随时跟小镇的虚构居民聊两句。','Pull up a chair and have a chat.','来坐坐，聊两句吧。');
 replaceExact(q,'.pawTownLink small','Pull up a chair and chat with the game’s residents.','找个座位，和小镇里的游戏角色聊两句。','Pull up a chair and have a chat.','来坐坐，聊两句吧。');
 replaceExact(q,'.pawTownPinned small','From fictional town residents','来自虚构小镇居民','Around town','小镇见闻');
 replaceExact(q,'.pawTownPinned small','Stories from the game’s residents','小镇角色的日常趣闻','Around town','小镇见闻');
 replaceExact(q,':scope > p','A chat with town characters · local play, not live players.','小镇角色聊天室 · 本地互动，非真人联机。','Pull up a chair.','来坐坐吧。');
 replaceExact(q,'.communityMuted','Tea chat · fictional town companions, private to this visit.','茶馆闲聊 · 虚构小镇伙伴，仅本次会话可见。','Tea table · private to this visit.','茶桌闲聊 · 仅本次会话可见。');
 for(const note of q.querySelectorAll('.pawResidentChatNote'))note.textContent=tr('This conversation is private to this visit.','这段聊天仅本次会话可见。');
}
const pageBefore=page;
page=function(...args){const result=pageBefore(...args),q=$('content');naturalTownLabels(q);return result};
const sayBefore=say;
say=function(name,words,...rest){return sayBefore.call(this,residentDialogue(name),residentDialogue(words),...rest)};
const townBefore=townChatPage;
townChatPage=function(...args){
 const result=townBefore(...args),q=$('content');
 naturalTownLabels(q);
 if(communityTab==='board')compactBoard(q);
 if(communityTab==='gratitude')compactJoy(q);
 return result
};
const goodBefore=goodCompanyPage;
goodCompanyPage=function(q,...args){
 const result=goodBefore(q,...args);
 for(const node of q.querySelectorAll('.goodCompanyBanner > small'))if(['Town residents · fictional companions','小镇居民 · 虚构伙伴'].includes(node.textContent))node.remove();
 const privacy=q.querySelector('.goodCompanyPrivacy');if(privacy)privacy.textContent=tr('Your note stays on this device. Share with online travellers only if you choose.','便签仅保存在本设备。想分享给联机旅人时，再选择公开发布。');
 return result
};
const homeBefore=hideoutPage;
hideoutPage=function(...args){
 const result=homeBefore(...args),q=$('content'),stage=q.querySelector('.hideoutScene');
 if(!stage||hideoutEditing)return result;
 stage.classList.add('pawRoomFirst');
 const ribbon=q.querySelector('.hideoutRibbon'),tabs=q.querySelector('.komorebiRoomTabs');
 // Keep the scene's parent, hit geometry, furniture transforms and existing controls.
 const caption=q.querySelector('.hideoutRoomCaption'),hint=q.querySelector('.pawHomeWalkHint');
 let anchor=hint||caption||stage;
 if(ribbon){anchor.after(ribbon);anchor=ribbon}
 if(tabs){anchor.after(tabs);anchor=tabs}
 const expansion=q.querySelector('.pawHomeExpansion');
 if(expansion){
  const fold=element('details','',q,'pawRoomExpansionFold');element('summary',tr('Room expansions','小窝扩建'),fold);expansion.before(fold);fold.append(expansion)
 }
 return result
};
const style=document.createElement('style');style.textContent=`
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
