
/* Five original collectible cats now carry their own recognisable accessories. */
const townFigureBefore=bagFigureIcon;
bagFigureIcon=function(v){
 const art=townFigureBefore(v);if(v[5])return art;
 const decorations=[
 '<path d="M16 43l13 5-2 9-14-4z" fill="#a9b9a4" stroke="#657761"/><path d="M19 46l6 2" stroke="#f8f2d8"/>',
 '<path d="M38 44h15l-2 12H40z" fill="#b99773" stroke="#765c43"/><path d="M42 47h8M42 50h6" stroke="#fff2d9"/>',
 '<path d="M40 43l14 3-2 10-14-3z" fill="#e8ce8e" stroke="#987b54"/><path d="M43 47l8 2" stroke="#9b7c5d"/>',
 '<path d="M40 13a9 9 0 1 0 11 12a8 8 0 0 1-11-12" fill="#eed393" stroke="#c79f65"/>',
 '<path d="M22 15l5-8 5 7 6-7 4 9-3 6H25z" fill="#e7c269" stroke="#9e7945"/><circle cx="32" cy="18" r="2" fill="#b8675d"/>'
 ];
 return art.replace('</svg>',(decorations[boxPrizes.findIndex(p=>p[0]===v[0])]||'')+'</svg>')
};
const townNameBefore=drawMeowActorName;
drawMeowActorName=function(a,value,indoorScale=null){
 if(!a||!Number.isFinite(a.x)||!Number.isFinite(a.y))return;
 const q=meowPasserLabels.get(a);if(q?.offset&&Math.hypot(q.offset.x,q.offset.y)>25)q.offset=null;
 return townNameBefore(a,value,indoorScale)
};
const townThreeBefore=threeMove;
threeMove=function(board,expert,random=Math.random){
 if(expert)return townThreeBefore(board,true,random);
 const free=board.flatMap((v,i)=>v?[]:[i]);if(!free.length||threeWinner(board))return -1;
 for(const i of free){board[i]=2;const win=threeWinner(board)?.who===2;board[i]=0;if(win)return i}
 if(random()<.45)return free[Math.min(free.length-1,Math.floor(random()*free.length))];
 return townThreeBefore(board,true,random)
};
const townFinishCss=document.createElement('style');townFinishCss.textContent=`
#page .figureCabinetTile strong{line-height:1.25;min-height:2.5em}
#page .figureCabinetTile button:focus-visible,#page .bagSlot:focus-visible,#game .worldSign:focus-visible{outline:3px solid #d5a55e!important;outline-offset:2px}
#page .bagSlot small{line-height:1.25}
#game #dialogue #choices button{min-height:44px}
#page input[type=search],#page input[type=text],#page textarea{font-size:16px}
@media(prefers-reduced-motion:reduce){#game .worldSign,#game #dialogue,#page .bagSlot,#page .figureCabinetTile{transition:none!important;animation:none!important}}
`;document.head.append(townFinishCss);

/* Bag fixes: the startup wrapper remains responsible for extra navigation. */
const townBagBefore=myRoom;
myRoom=function(){
 townBagBefore();const q=$('content'),wrap=q.querySelector('.travellerBagV2');if(!wrap)return;
 const lang=q.querySelector('.row button:nth-child(2)');if(lang)lang.onclick=()=>{toggleLang();myRoom()};
 const grid=wrap.querySelector('.bagSlots'),body=wrap.querySelector('.bagBody'),detail=wrap.querySelector('.bagDetail');
 const position=()=>{if(!wrap.isConnected||!grid||!body||!detail)return;if(detail.parentNode===grid)body.append(detail);if(W<720&&!detail.hidden){const index=[...grid.children].findIndex(el=>el.getAttribute('aria-pressed')==='true');if(index>=0)grid.children[Math.min(grid.children.length-1,Math.floor(index/3)*3+2)]?.after(detail)}};
 wrap.addEventListener('click',()=>queueMicrotask(position));wrap.addEventListener('change',()=>queueMicrotask(position));wrap.addEventListener('input',()=>queueMicrotask(position));
 if(typeof ResizeObserver==='function'){const observer=new ResizeObserver(position);observer.observe(wrap);const cleanup=new MutationObserver(()=>{if(!wrap.isConnected){observer.disconnect();cleanup.disconnect()}});cleanup.observe(q,{childList:true})}
 const search=wrap.querySelector('input[type=search]');if(search){const clear=b(search.parentNode,tr('Clear','清空'),()=>{search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()});clear.classList.add('townClearSearch');clear.setAttribute('aria-label',tr('Clear item search','清空收藏搜索'))}
};
const townToneBefore=ambientTone;
ambientTone=function(...args){if(meowSoundPrefs.effects!==false&&!document.hidden)return townToneBefore(...args)};
window.addEventListener('blur',()=>{joystickReset()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)joystickReset()});
const townClueBefore=keepsakeClue;
keepsakeClue=function(item){return boxPrizes.some(v=>v[0]===item?.[0])?['Find it in a free arcade blind box. Some figures can be exchanged for duplicate tokens.','去游戏厅开免费盲盒。部分手办可用重复款兑换券换取。']:townClueBefore(item)};
const townStoryBefore=keepsakeStory;
keepsakeStory=function(item){const i=boxPrizes.findIndex(v=>v[0]===item?.[0]);const stories=[['A tiny permit to leave before the meeting ends.','开会结束前合法消失的许可证。'],['Survived a meeting that could have been a message.','活着走出了本可发条消息解决的会议。'],['A holiday your manager cannot reject.','老板无权拒绝的小假期。'],['The moon never asks for overtime.','月亮从来不要求你加班。'],['Payday, before the bills arrive.','工资到账、账单未到的快乐。']];return stories[i]||townStoryBefore(item)};
const townBagCss=document.createElement('style');townBagCss.textContent='.bagTools .townClearSearch{flex:0 0 auto;font-size:12px;padding:5px 8px!important}.bagDetail{overflow-wrap:anywhere}.bagCategories{overscroll-behavior-inline:contain}.bagSlots>.bagDetail{grid-column:1/-1;min-width:0}';document.head.append(townBagCss);
