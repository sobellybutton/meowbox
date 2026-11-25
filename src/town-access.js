
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
keepsakeClue=function(item){return boxPrizes.some(v=>v[0]===item?.[0])?['Find it in a 40-Paw blind box. Earn coins by exploring and playing.','去游戏厅用40爪币开盲盒，探索小镇和玩游戏都能攒爪币。']:townClueBefore(item)};
const townStoryBefore=keepsakeStory;
keepsakeStory=function(item){const i=boxPrizes.findIndex(v=>v[0]===item?.[0]);const stories=[['A tiny permit to leave before the meeting ends.','开会结束前合法消失的许可证。'],['Survived a meeting that could have been a message.','活着走出了本可发条消息解决的会议。'],['A holiday your manager cannot reject.','老板无权拒绝的小假期。'],['The moon never asks for overtime.','月亮从来不要求你加班。'],['Payday, before the bills arrive.','工资到账、账单未到的快乐。']];return stories[i]||townStoryBefore(item)};
const townBagCss=document.createElement('style');townBagCss.textContent='.bagTools .townClearSearch{flex:0 0 auto;font-size:12px;padding:5px 8px!important}.bagDetail{overflow-wrap:anywhere}.bagCategories{overscroll-behavior-inline:contain}.bagSlots>.bagDetail{grid-column:1/-1;min-width:0}';document.head.append(townBagCss);

/* Physical feedback at existing contact points. */
const townPaperBefore=paperWorryAt;
paperWorryAt=function(x,y,impact){
 townPaperBefore(x,y,impact);const hits=Math.max(0,Math.min(20,Number(state.count)||0));if(hits<3)return;
 ctx.save();ctx.translate(x,y);ctx.rotate(impact*.34*stressSide);
 for(let i=0;i<Math.min(5,Math.floor(hits/3));i++){const a=i%2?-1:1,yy=-15+i*11;line(a*13,yy,a*7,yy+2,'#92704b88',1.2);line(a*7,yy+2,a*3,yy-1,'#92704b88',1.2)}
 if(hits>=12){line(-13,39,-7,30,'#98734e',1.5);line(-7,30,-3,34,'#98734e',1.5);line(-3,34,1,28,'#98734e',1.5)}ctx.restore()
};
const townBasinBefore=templeBasin;
templeBasin=function(x,y){townBasinBefore(x,y);ctx.save();for(let i=0;i<6;i++){const xx=x-52+i*19,yy=y+34+(i%2)*6;line(xx-7,yy-4,xx+7,yy,'#c8c5ac55',1)}
 if(activity==='templeWater'&&state.waterStage===1){const age=t-state.waterAt;if(age>=0&&age<.8){const f=age/.8;ctx.strokeStyle='rgba(238,246,222,'+((1-f)*.72)+')';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(x,y,12+f*58,4+f*14,0,0,TAU);ctx.stroke()}}ctx.restore()
};
const townLadleBefore=waterLadleArt;
waterLadleArt=function(x,y,a,filled){townLadleBefore(x,y,a,filled);if(!filled)return;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.strokeStyle='#e7efe0c0';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(34,-1,12,3,0,Math.PI*.1,Math.PI*.9);ctx.stroke();ctx.restore()};
const townTeaCupBefore=teaCup;
teaCup=function(x,y,sc=1,base=0,pearls=0,fill=1,angle=0){townTeaCupBefore(x,y,sc,base,pearls,fill,angle);if(activity!=='bubbleTea'||fill<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(-33,-70);ctx.lineTo(33,-70);ctx.lineTo(25,-3);ctx.lineTo(-25,-3);ctx.closePath();ctx.clip();const y0=-69*clamp(fill,0,1),slosh=clamp(-angle*38,-10,10);ctx.strokeStyle='#fff0d1b0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-27,y0-slosh);ctx.quadraticCurveTo(0,y0+(residentReducedMotion.matches?0:Math.sin(t*8)*Math.abs(slosh)*.25),27,y0+slosh);ctx.stroke();ctx.restore()};

/* Hand-finished prop detail and small physical feedback. */
const townPitcherBefore=teaPitcher;
teaPitcher=function(x,y,base,tilt=0){townPitcherBefore(x,y,base,tilt);ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ellipse(1,-15,11,8,'#f3e6ccaa');ellipse(1,-15,5,3,teaChoices[Math.max(0,base)]?.[2]||'#ad8869');ctx.restore()};
const townCounterBefore=drawFoodCounter;
drawFoodCounter=function(){townCounterBefore();ctx.save();for(let i=0;i<17;i++){const xx=329+i*10;line(xx,565,xx-1,569,'#d9c7a0aa',1.1)}ellipse(235,537,28,9,'#5f473a44');ellipse(235,533,26,8,'#aeae8e');ellipse(235,532,20,5,'#d7cfad');ctx.restore()};
const townCatArtBefore=careCatArt;
careCatArt=function(a){townCatArtBefore(a);if(!a||!Number.isFinite(a.x)||!Number.isFinite(a.y)||residentReducedMotion.matches)return;const age=t-a.at;if(a.phase!=='pet'||age<0||age>1.4)return;
 ctx.save();ctx.translate(a.x,a.y-103);for(let i=0;i<3;i++){const f=(age*.8+i*.27)%1,x=-22+i*22,y=-f*19;ctx.globalAlpha=(1-f)*.68;ctx.fillStyle='#efc2b4';ctx.beginPath();ctx.moveTo(x,y+4);ctx.bezierCurveTo(x-10,y-2,x-3,y-10,x,y-4);ctx.bezierCurveTo(x+3,y-10,x+10,y-2,x,y+4);ctx.fill()}ctx.restore()
};
const townRackBefore=drawTemplePaperRack;
drawTemplePaperRack=function(x,y,sc=1,hideLatest=0){townRackBefore(x,y,sc,hideLatest);ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);for(const sign of [-1,1]){const xx=sign*109;for(const yy of [-90,88]){ellipse(xx,yy,3,3,'#b99564');ellipse(xx-1,yy-1,1,1,'#e1cfa2')}}ctx.restore()};
const townScoopBefore=teaScoopArt;
teaScoopArt=function(x,y,tilt=0,loaded=false){townScoopBefore(x,y,tilt,loaded);ctx.save();ctx.translate(x,y);ctx.rotate(tilt);if(loaded)for(let i=0;i<5;i++)ellipse(-19+i*5,(i%2)*4-1,1.1,1,'#b0957f');ctx.restore()};

/* Wishing pool: dedicated vertical stage and a separate wide composition.
   Keep the original percentage-based physics, fish movement and bowl centre. */
function wishingPoolScene(portrait){
 const w=portrait?400:800,h=portrait?700:450;
 const stones=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,x=w*.5+Math.cos(a)*w*.455,y=h*.5+Math.sin(a)*h*.461;return '<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(portrait?15:22)+'" ry="'+(portrait?23:15)+'" transform="rotate('+(a*180/Math.PI).toFixed(1)+' '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="'+['#a79b80','#c1b59a','#908b76'][i%3]+'" stroke="#776f5c" stroke-width="1.2"/>'}).join('');
 const ripples=Array.from({length:30},(_,i)=>{const x=w*.14+(i*73%(w*.72)),y=h*.12+(i*119%(h*.76));return '<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'q12 -3 26 0" fill="none" stroke="#c5d6b8" opacity=".14" stroke-width="1.2"/>'}).join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><defs><radialGradient id="water"><stop stop-color="#78998a"/><stop offset=".48" stop-color="#4c8078"/><stop offset="1" stop-color="#294f4b"/></radialGradient><linearGradient id="light" x2="1" y2="1"><stop stop-color="#f7e5b4" stop-opacity=".3"/><stop offset=".6" stop-color="#bfd8c1" stop-opacity="0"/></linearGradient></defs><rect width="'+w+'" height="'+h+'" fill="url(#water)"/><path d="M0 0L'+w+' 0L0 '+h+'Z" fill="url(#light)"/>'+ripples+'<g opacity=".67">'+stones+'</g></svg>'
}
const wishPortraitCSS=document.createElement('style');
wishPortraitCSS.textContent=`
#content:has(.wishRitual) .wishRitual{box-sizing:border-box!important;display:block;width:min(100%,340px)!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:4/7!important;margin:8px auto!important;border:5px solid #b1a183!important;border-radius:46% 46% 24% 24% / 16% 16% 14% 14%!important;background-image:url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(wishingPoolScene(true))}")!important;background-size:100% 100%!important;box-shadow:inset 0 0 20px #193c386b,0 3px 8px #44382d30!important}
#content:has(.wishRitual) .wishBowl{width:28%;height:16%;top:39%;box-shadow:0 5px 11px #193e3a99,inset 0 3px 6px #ead6aa;border:1px solid #9f8b60}
#content:has(.wishRitual) .ritualCoin{width:clamp(44px,13vw,52px)!important;height:clamp(44px,13vw,52px)!important;top:86%}
#content:has(.wishRitual) .wishPower{margin:8px auto;max-width:340px}
#content:has(.wishRitual) .wishMessage{min-height:0!important;line-height:1.4!important;margin:8px 0!important}
#content:has(.wishRitual) .wishKeyboard{gap:4px}
#content:has(.wishRitual) .wishKeyboard button{min-width:44px;min-height:44px}
@media(orientation:landscape){#content:has(.wishRitual) .wishRitual{width:min(100%,640px,115dvh)!important;aspect-ratio:16/9!important;background-image:url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(wishingPoolScene(false))}")!important;border-radius:30% 30% 20% 20% / 32% 32% 20% 20%!important}#content:has(.wishRitual) .wishBowl{height:21%}}
@media(prefers-reduced-motion:reduce){#content .wishRipple,#content .fishWake{animation-duration:.3s!important}}
`;document.head.append(wishPortraitCSS);
