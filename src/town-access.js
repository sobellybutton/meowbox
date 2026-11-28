
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
 // Retain a valid displaced label rather than jumping between anchors every frame.
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
keepsakeClue=function(item){return boxPrizes.some(v=>v[0]===item?.[0])?['Find it in a 40-Paw blind box. Earn coins by exploring and playing.','去游戏厅用40爪爪币开盲盒，探索小镇和玩游戏都能攒爪爪币。']:townClueBefore(item)};
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
Object.assign(ART,{
 templeBronze:'assets/visual/painted/temple/bell.webp',
 templeStrikerPaint:'assets/visual/painted/temple/striker.webp',
 templeBasinPaint:'assets/visual/painted/temple/basin.webp',
 templeLadlePaint:'assets/visual/painted/temple/ladle.webp'
});
const townBronzeBefore=templeBellArt;
templeBellArt=function(x,y,sc=1,angle=0){
 const im=pics.templeBronze;
 if(!im.naturalWidth)return townBronzeBefore(x,y,sc,angle);
 ctx.save();ctx.translate(x,y-104*sc);ctx.scale(sc,sc);ctx.rotate(angle);
 ctx.drawImage(im,-84,0,168,156);ctx.restore()
};
const townBasinBefore=templeBasin;
templeBasin=function(x,y){
 const im=pics.templeBasinPaint;
 if(im.naturalWidth)ctx.drawImage(im,x-98,y-30,196,82);
 else townBasinBefore(x,y);
 if(activity==='templeWater'&&state.waterStage===1){
  const age=t-state.waterAt;
  if(age>=0&&age<.8){
   const f=age/.8;ctx.save();ctx.strokeStyle='rgba(238,246,222,'+((1-f)*.72)+')';ctx.lineWidth=1.8;
   ctx.beginPath();ctx.ellipse(x,y,12+f*58,4+f*14,0,0,TAU);ctx.stroke();ctx.restore()
  }
 }
};
const townLadleBefore=waterLadleArt;
waterLadleArt=function(x,y,a,filled){
 const im=pics.templeLadlePaint;
 if(!im.naturalWidth)return townLadleBefore(x,y,a,filled);
 ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.drawImage(im,-71,-12,118,26);
 if(filled){ellipse(35,-6,10,3,'#83a99f');line(29,-7,42,-7,'#d9e7d4',1)}
 ctx.restore()
};
const townDryLadleBefore=templeLadle;
templeLadle=function(x,y,a=0){
 if(!pics.templeLadlePaint.naturalWidth)return townDryLadleBefore(x,y,a);
 waterLadleArt(x,y,a,false)
};
/* Deer paintings share a hoof anchor. The mouth point moves with each pose. */
const townDeerMuzzles={
 mugi:[[-108,-161],[-139,-121],[-122,-57]],
 koyo:[[-110,-164],[-140,-129],[-115,-49]],
 sora:[[-111,-170],[-139,-129],[-115,-48]]
};
const townDeerScale=.8;
for(const [id,poses] of Object.entries(townDeerMuzzles)){
 for(let i=0;i<poses.length;i++)ART['meadowDeer-'+id+'-'+i]='assets/visual/painted/deer/'+id+'-'+i+'.webp';
}
function townDeerFrame(profile,bow){
 const positions=townDeerMuzzles[profile?.id];
 if(!positions)return null;
 const images=positions.map((_,i)=>pics['meadowDeer-'+profile.id+'-'+i]);
 if(!images.every(im=>im.naturalWidth))return null;
 const pose=clamp(Math.round(bow*2.25),0,2);
 return {image:images[pose],mouth:positions[pose]}
}
const townDeerLayoutBefore=deerStageLayout;
deerStageLayout=function(bow,feed){
 const layout=townDeerLayoutBefore(bow,feed),frame=townDeerFrame(state.deerProfile,layout.lower);
 if(!frame)return layout;
 const mouthX=frame.mouth[0]*townDeerScale*layout.deerScale;
 if(feed>0)layout.deerX=Math.max(layout.deerX-76*feed,layout.playerX+42-mouthX);
 layout.muzzleX=layout.deerX+mouthX;
 layout.muzzleY=layout.deerY+frame.mouth[1]*townDeerScale*layout.deerScale;
 return layout
};
const townDeerBefore=drawMeadowDeer;
drawMeadowDeer=function(x,y,profile,bow=0,chew=0,scale=1){
 const frame=townDeerFrame(profile,bow);
 if(!frame)return townDeerBefore(x,y,profile,bow,chew,scale);
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 ellipse(0,3,66,7,'#414c3438');
 const k=townDeerScale,{image}=frame;
 ctx.drawImage(image,-150*k,-215*k,image.naturalWidth*k,image.naturalHeight*k);
 ctx.restore()
};

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
 const w=portrait?560:800,h=portrait?700:450;
 const stones=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,x=w*.5+Math.cos(a)*w*.455,y=h*.5+Math.sin(a)*h*.461;return '<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(portrait?15:22)+'" ry="'+(portrait?23:15)+'" transform="rotate('+(a*180/Math.PI).toFixed(1)+' '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="'+['#a79b80','#c1b59a','#908b76'][i%3]+'" stroke="#776f5c" stroke-width="1.2"/>'}).join('');
 const ripples=Array.from({length:30},(_,i)=>{const x=w*.14+(i*73%(w*.72)),y=h*.12+(i*119%(h*.76));return '<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'q12 -3 26 0" fill="none" stroke="#c5d6b8" opacity=".14" stroke-width="1.2"/>'}).join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none"><defs><radialGradient id="water"><stop stop-color="#78998a"/><stop offset=".48" stop-color="#4c8078"/><stop offset="1" stop-color="#294f4b"/></radialGradient><linearGradient id="light" x2="1" y2="1"><stop stop-color="#f7e5b4" stop-opacity=".3"/><stop offset=".6" stop-color="#bfd8c1" stop-opacity="0"/></linearGradient></defs><rect width="'+w+'" height="'+h+'" fill="url(#water)"/><path d="M0 0L'+w+' 0L0 '+h+'Z" fill="url(#light)"/>'+ripples+'<g opacity=".67">'+stones+'</g></svg>'
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


/* Wishing pool interaction repair: one visible instruction, compact playable
   stage, one affected fish per collision. Original flight/strength mechanics
   retained. The art is still interim, not a finished painted pond. */
function wishFishCollision(fish,x,y){
 let best=null,score=1;
 for(const f of fish){const d=((f.x-x)/8)**2+((f.y-y)/5)**2;if(d<score){best=f;score=d}}
 return best
}
function wishFishGoal(f,age,impact){
 const normal={x:50+Math.cos(f.angle)*31,y:45+Math.sin(f.angle)*27};
 if(!impact||impact.fish!==f||age<0||age>1.15)return normal;
 const dx=f.x-impact.x,dy=f.y-impact.y,dist=Math.max(1,Math.hypot(dx,dy)),strength=16*(1-age/1.15);
 if(Math.abs(dx)+Math.abs(dy)<.01)return {x:normal.x+strength,y:normal.y};
 return {x:f.x+dx/dist*strength,y:f.y+dy/dist*strength}
}
function wishFishSpeech(pond,fish,full){
 pond.querySelectorAll('.wishFishSpeech').forEach(v=>v.remove());
 const bubble=element('div',full,pond,'wishFishSpeech');
 bubble.setAttribute('aria-hidden','true');
 bubble.style.left=Math.max(24,Math.min(76,fish.x))+'%';
 bubble.style.top=Math.max(13,Math.min(67,fish.y-11))+'%';
 setTimeout(()=>bubble.remove(),2800)
}
animateWishKoi=function(pond,visitCurrent=()=>pond.isConnected&&$('page').style.display!=='none'){
 pond.querySelectorAll('.v9koi').forEach(n=>n.remove());element('div','',pond,'waterLight');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fish=[];let impact=null,last=performance.now(),wake=last,frameId=null,stopped=false;
 function stop(){if(stopped)return;stopped=true;if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;impact=null}
 function schedule(){if(!stopped)frameId=requestAnimationFrame(tick)}
 const count=Math.random()<.12?4:3;
 for(let k=0;k<count;k++){const el=element('div','',pond,'livingKoi'+(k===3?' golden':''));const im=element('img','',el);im.src=art9.koi;im.alt='';im.style.animationDelay=(-k*.4)+'s';const angle=k*2*Math.PI/count;fish.push({el,x:50+Math.cos(angle)*29,y:43+Math.sin(angle)*24,angle,heading:angle*180/Math.PI+90,speed:.36+k*.045})}
 const petals=Array.from({length:5},(_,k)=>({el:element('i','',pond,'floatingPetal'),x:15+k*17,y:15+(k*29)%64,phase:k*1.9}));
 function tick(now){
  frameId=null;
  if(stopped||!visitCurrent()){stop();return}
  if(document.hidden){last=now;schedule();return}
  const dt=Math.min(.06,Math.max(0,(now-last)/1000));last=now;
  const age=impact?(now-impact.at)/1000:0;
  if(impact&&age>=1.15)impact=null;
  for(const f of fish){
   const prevX=f.x,prevY=f.y;f.angle+=dt*f.speed*(reduce?.35:1);
   const goal=wishFishGoal(f,age,impact),reacting=impact?.fish===f&&!reduce,ease=Math.min(1,dt*(reacting?3:1.4));
   const gx=reacting?goal.x:50+Math.cos(f.angle)*31,gy=reacting?goal.y:45+Math.sin(f.angle)*27;
   f.x=Math.max(9,Math.min(91,f.x+(gx-f.x)*ease));f.y=Math.max(12,Math.min(77,f.y+(gy-f.y)*ease));
   const dx=f.x-prevX,dy=f.y-prevY;
   if(Math.hypot(dx,dy)>.001){const desired=Math.atan2(dy*pond.clientHeight,dx*pond.clientWidth)*180/Math.PI;const delta=((desired-f.heading+540)%360)-180;f.heading+=delta*Math.min(1,dt*5)}
   f.el.style.left=f.x+'%';f.el.style.top=f.y+'%';f.el.style.transform='translate(-50%,-50%) rotate('+f.heading+'deg)';
  }
  if(!reduce&&now-wake>1900){wake=now;const f=fish[Math.floor(now/1900)%fish.length];const ripple=element('i','',pond,'fishWake');ripple.style.left=f.x+'%';ripple.style.top=f.y+'%';setTimeout(()=>ripple.remove(),1650)}
  for(const petal of petals){if(!reduce){petal.x+=dt*.5;petal.y+=dt*Math.sin(now/4000+petal.phase)*.2;if(petal.x>90)petal.x=10}petal.el.style.left=petal.x+'%';petal.el.style.top=petal.y+'%';petal.el.style.transform='rotate('+(Math.sin(now/3200+petal.phase)*35)+'deg)'}
  schedule()
 }
 schedule();
 return {stop,collision(x,y){return stopped?null:wishFishCollision(fish,x,y)},splash(x,y,hit,bumped){if(!stopped)impact=!hit&&bumped?{fish:bumped,x,y,at:performance.now()}:null},reset(){if(stopped)return;impact=null;pond.querySelectorAll('.wishFishSpeech').forEach(v=>v.remove())}}
};
/* PAW_WISH_VISIT_BEGIN */
function pawWishVisitCurrent(connected,display,visitRoom,currentRoom,visitActivity,currentActivity,visitState,currentState){
 return connected&&display!=='none'&&visitRoom===currentRoom&&visitActivity===currentActivity&&visitState===currentState
}
/* PAW_WISH_VISIT_END */
/* PAW_WISH_BANK_BEGIN */
function pawWishBankGeometry(stage,pond){
 if(!stage||!pond||![stage.width,stage.height,pond.x,pond.y,pond.w,pond.h].every(Number.isFinite)||Math.min(stage.width,stage.height,pond.w,pond.h)<=0)return null;
 const height=Math.max(58,Math.min(132,stage.height*.17,stage.width*.34)),x=pond.x+pond.w*.28,y=pond.y+pond.h+Math.max(4,height*.045);
 const entry={x:Math.max(height*.28,x-Math.min(pond.w*.22,height*.66)),y:Math.min(stage.height-4,y+height*.23)};
 return {height,foot:{x,y},entry,keeper:{x:pond.x+pond.w*.79,y},hand:{x:x+height*15/94,y:y-height*41/94}}
}
function pawWishCoinOrigin(bank,pond){
 return {x:(bank.hand.x-pond.x)/pond.w*100,y:(bank.hand.y-pond.y)/pond.h*100}
}
function pawWishApproach(age,reduced){
 return reduced?1:Math.max(0,Math.min(1,age/950))
}
/* PAW_WISH_BANK_END */
wishPond9=function(){page(tr('The wishing pool','锦鲤许愿池'),tr('Hold a wish in your heart. No need to tell anyone.','在心里默默许个愿，不必告诉任何人。'),q=>{
 const pond=pond9(q);pond.classList.add('wishRitual');const stage=element('section','',q,'pawWishGarden');pond.before(stage);stage.append(pond);const koiLife=animateWishKoi(pond,()=>current());element('div','',pond,'wishBowl');const aim=element('i','',pond,'wishAim');aim.hidden=true;const coin=element('img','',pond,'ritualCoin');coin.src='assets/visual/painted/interface/paw-coin-hud.webp';coin.alt=tr('Swipe the coin toward the centre bowl','将铜钱向中央许愿碗滑动');coin.draggable=false;
 const instruction=element('p',tr('Swipe up from the coin towards the bowl. A faster swipe throws farther.','从铜钱向许愿碗滑动，滑得越快，投得越远。'),q,'wishThrowGuide');pond.before(instruction);const powerBar=element('div','',q,'wishPower');const powerFill=element('i','',powerBar);powerBar.setAttribute('aria-label',tr('Throw strength','投币力度'));const message=element('p',tr('Ready? Aim for the small bowl in the centre.','准备好了吗？瞄准中央的小碗。'),q,'wishMessage');message.setAttribute('aria-live','polite');message.setAttribute('role','status');pond.before(message);pond.before(powerBar);
 const visitRoom=room,visitActivity=activity,visitState=state;
 const current=()=>pawWishVisitCurrent(pond.isConnected,$('page').style.display,visitRoom,room,visitActivity,activity,visitState,state);
 let busy=false,done=false,misses=0,origin=null,bankReady=false,held=false,bank=null,pondBox=null,throwAt=-Infinity,approachAt=null,previousPose='';
 const actor=element('canvas','',stage,'pawWishBankActors');actor.setAttribute('aria-hidden','true');
 const ag=actor.getContext('2d'),keeper=new Image();keeper.src='assets/visual/painted/garden-keeper/standing.webp';
 const k=((avatar??0)%4+4)%4;
 let gentle,takeCoin;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const syncToss=()=>{if(gentle)gentle.disabled=busy||done||!bankReady||!held;if(takeCoin){takeCoin.hidden=held||done;takeCoin.disabled=!bankReady||busy}pond.setAttribute('aria-busy',String(busy))};
 const source=()=>bank&&pondBox?pawWishCoinOrigin(bank,pondBox):{x:50,y:86};
 const home=()=>{const o=source();coin.style.left=o.x+'%';coin.style.top=o.y+'%';coin.style.opacity='1';coin.style.transform='translate(-50%,-50%)';coin.hidden=!bankReady||!held||done};
 coin.hidden=true;
 instruction.textContent=tr('Take a Paw Coin from your pocket, then swipe towards the bowl.','从口袋取出一枚爪爪币，再向许愿碗滑动。');
 message.textContent=tr('Walk down to the bank…','沿小路走到池边……');
 function drawBank(now){
  if(!current())return;
  const rect=stage.getBoundingClientRect(),p=pond.getBoundingClientRect();
  if(!ag||rect.width<=0||rect.height<=0||p.width<=0||p.height<=0){requestAnimationFrame(drawBank);return}
  if(!busy&&!origin){
   pondBox={x:p.left-rect.left,y:p.top-rect.top,w:p.width,h:p.height};
   bank=pawWishBankGeometry(rect,pondBox)
  }
  if(!bank){requestAnimationFrame(drawBank);return}
  const dpr=Math.min(2,window.devicePixelRatio||1),width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
  if(actor.width!==width||actor.height!==height){actor.width=width;actor.height=height}
  ag.setTransform(dpr,0,0,dpr,0,0);ag.clearRect(0,0,rect.width,rect.height);
  const H=bank.height,im=pics['walker'+k+'2'];
  mbArtLoad();const frames=mbArtRegistry.players[k]?.walk?.right||[];
  const images=frames.map(mbArtImage),artReady=im?.complete&&im.naturalWidth>0&&im.naturalHeight>0;
  if(keeper.complete&&keeper.naturalWidth){const kh=H*.93,kw=kh*keeper.naturalWidth/keeper.naturalHeight;ag.drawImage(keeper,bank.keeper.x-kw/2,bank.keeper.y-kh,kw,kh)}
  if(!artReady){bankReady=false;home();syncToss();requestAnimationFrame(drawBank);return}
  if(approachAt===null)approachAt=now;
  const f=pawWishApproach(now-approachAt,reduced),x=bank.entry.x+(bank.foot.x-bank.entry.x)*f,y=bank.entry.y+(bank.foot.y-bank.entry.y)*f;
  ag.save();ag.fillStyle='#302a2438';ag.beginPath();ag.ellipse(x,y,H*.14,H*.027,0,0,Math.PI*2);ag.fill();
  if(f<1&&frames.length&&images.every(Boolean)){
   const index=Math.floor(f*frames.length*2)%frames.length,frame=frames[index],q=H/frame.height;
   ag.drawImage(images[index],x-frame.foot[0]*q,y-frame.foot[1]*q,frame.width*q,frame.height*q)
  }else{
   const w=H*im.naturalWidth/im.naturalHeight,age=now-throwAt,lean=reduced||age<0||age>470?0:Math.sin(Math.PI*age/470)*.12;
   // Reuse the existing illustrated side pose and torso pivot. No separate arm.
   const split=68/94*im.naturalHeight,top=68/94*H,lower=H-top;
   ag.drawImage(im,0,split,im.naturalWidth,im.naturalHeight-split,x-w/2,y-lower,w,lower);
   ag.save();ag.translate(x,y-lower);ag.rotate(lean);ag.drawImage(im,0,0,im.naturalWidth,split,-w/2,-top,w,top);ag.restore()
  }
  ag.restore();
  if(f>=1&&!bankReady){bankReady=true;syncToss();home();message.textContent=tr('At the bank. Take out a Paw Coin.','到池边啦，取出一枚爪爪币吧。')}
  if(bankReady&&!busy&&!done&&!origin)home();
  requestAnimationFrame(drawBank)
 }
 requestAnimationFrame(drawBank);
 function cancelFlight(){if(!pond.isConnected)return;origin=null;aim.hidden=true;pond.classList.remove('wishDragging');busy=false;home();syncToss();powerFill.style.width='0%';if(!done)message.textContent=tr('Ready when you are. Aim for the bowl.','准备好了再投，瞄准小碗。')}
 const clampWish=(v,min,max)=>Math.max(min,Math.min(max,v));
 // A deliberate drag lands where the finger aims; a short quick flick gets a modest boost.
 const destination=(dx,dy,ms)=>{const w=Math.max(1,pond.clientWidth),h=Math.max(1,pond.clientHeight),dist=Math.hypot(dx,dy)/h,speed=dist/Math.max(.08,ms/1000),gain=1+Math.min(.85,Math.max(0,(speed-.55)*.55))*Math.max(0,1-dist/.48);const o=source(),x=clampWish(o.x+dx/w*100*gain,4,96),y=clampWish(o.y+dy/h*100*gain,5,94);return{x,y,power:Math.min(1,dist*gain)}};
 function throwWish(x,y){if(!current()||!bankReady||!held||busy||done)return;const from=source();throwAt=performance.now();busy=true;syncToss();aim.hidden=true;pond.querySelectorAll('.wishFishSpeech').forEach(v=>v.remove());message.textContent=tr('There goes your wish…','心愿飞出去了……');let hit=Math.pow((x-50)/8.4,2)+Math.pow((y-39)/6,2)<=1;let startTime=performance.now();sound(520);const distance=Math.hypot((x-from.x)*pond.clientWidth/pond.clientHeight,y-from.y),duration=460+distance*5,arc=8+distance*.26;const rim=!hit&&Math.pow((x-50)/13.8,2)+Math.pow((y-39)/9.6,2)<=1;const landingX=rim?clampWish(x+(x>=50?1:-1)*(8+distance*.045),5,95):x,landingY=rim?clampWish(y+(y>=39?7:-7),5,93):y;let bounced=false;function frame(now){if(!current()){cancelFlight();return;}let f=Math.min(1,(now-startTime)/duration);coin.style.left=(from.x+(x-from.x)*f)+'%';coin.style.top=(from.y+(y-from.y)*f-arc*Math.sin(Math.PI*f))+'%';coin.style.transform='translate(-50%,-50%) rotateY('+(f*720)+'deg) scale('+(1-.55*f)+')';if(f<1){requestAnimationFrame(frame);return}if(rim&&!bounced){bounced=true;sound(780);const bowl=pond.querySelector('.wishBowl');bowl.animate([{transform:'translate(-50%,-50%) rotate(0deg)'},{transform:'translate(-50%,-50%) rotate(3deg)'},{transform:'translate(-50%,-50%) rotate(-2deg)'},{transform:'translate(-50%,-50%) rotate(0deg)'}],{duration:260});const bounceAt=performance.now();function rebound(at){if(!current()){cancelFlight();return;}const u=Math.min(1,(at-bounceAt)/310);coin.style.left=(x+(landingX-x)*u)+'%';coin.style.top=(y+(landingY-y)*u-7*Math.sin(Math.PI*u))+'%';coin.style.transform='translate(-50%,-50%) rotate('+(u*420)+'deg) scale(.45)';if(u<1)requestAnimationFrame(rebound);else{x=landingX;y=landingY;finish()}}requestAnimationFrame(rebound);return}finish()}function finish(){if(!current()){cancelFlight();return;}coin.hidden=true;const bumped=!hit&&koiLife.collision(x,y);koiLife.splash(x,y,hit,bumped);sound(hit?660:bumped?410:280);wishLanding(pond,x,y,hit,bumped);for(let n=0;n<3;n++){setTimeout(()=>{if(!current())return;let ripple=element('i','',pond,'wishRipple'+(hit?' gold':''));ripple.style.left=x+'%';ripple.style.top=y+'%';setTimeout(()=>ripple.remove(),1100)},n*150)}if(hit){done=true;held=false;busy=false;syncToss();const settled=element('img','',pond,'settledWishCoin');settled.src='assets/visual/painted/interface/paw-coin-hud.webp';settled.alt='';settled.style.left=x+'%';settled.style.top=y+'%';settled.animate([{transform:'translate(-50%,-50%) scale(.9)',opacity:1},{transform:'translate(-50%,-50%) scale(.65)',opacity:.85}],{duration:450,fill:'forwards'});message.textContent=tr(...townReaction('koi-hit',koiComedy.hit));addItem('Wishing coin','许愿铜钱');again.hidden=false}else{misses++;let lines=[['A little closer. Your wish is still yours.','差一点点，心愿还在。'],['The koi are curious. Try aiming a little higher.','锦鲤都来看热闹了，再往中间瞄一点。'],['Even the koi are cheering for you now. Take your time.','锦鲤都在替你加油了，慢慢来。']];const outcome=bumped?'fish':rim?'rim':y>48?'short':y<31?'long':'miss';message.textContent=tr(...townReaction('koi-'+outcome,koiComedy[outcome]));if(bumped)wishFishSpeech(pond,bumped,message.textContent);setTimeout(()=>{if(!current()){cancelFlight();return}held=false;home();busy=false;syncToss();message.textContent+=tr(' Take another coin to try again.',' 再取一枚试试吧。')},650)}}requestAnimationFrame(frame)}
 // The whole lower bank is a generous touch target. Capture on the pond, not the image.
 pond.addEventListener('pointerdown',e=>{
  if(!current()||!bankReady||!held||busy||done||origin||e.isPrimary===false||(e.pointerType==='mouse'&&e.button!==0))return;
  const r=pond.getBoundingClientRect(),c=coin.getBoundingClientRect();
  const near=Math.hypot(e.clientX-(c.left+c.width/2),e.clientY-(c.top+c.height/2))<=Math.max(48,c.width);
  if(!near&&(e.clientY<r.top+r.height*.70||e.clientY>r.bottom))return;
  e.preventDefault();origin={x:e.clientX,y:e.clientY,at:performance.now(),id:e.pointerId};pond.classList.add('wishDragging');
  try{pond.setPointerCapture(e.pointerId)}catch{}
 });
 pond.addEventListener('pointermove',e=>{
  if(!current()||!origin||busy||origin.id!==e.pointerId)return;
  e.preventDefault();const v=destination(e.clientX-origin.x,e.clientY-origin.y,performance.now()-origin.at);
  aim.hidden=false;aim.style.left=v.x+'%';aim.style.top=v.y+'%';powerFill.style.width=Math.min(100,v.power*100)+'%';
 });
 function cancelWishDrag(e){if(!origin||origin.id!==e.pointerId)return;origin=null;aim.hidden=true;pond.classList.remove('wishDragging')}
 pond.addEventListener('pointerup',e=>{
  if(!origin||origin.id!==e.pointerId)return;
  if(!current()){cancelWishDrag(e);return}
  e.preventDefault();const dx=e.clientX-origin.x,dy=e.clientY-origin.y,elapsed=performance.now()-origin.at;
  cancelWishDrag(e);if(Math.hypot(dx,dy)<8||dy>=0){message.textContent=tr('Swipe up from the coin, or choose Toss gently.','从铜钱向上滑动，或选择轻轻投币。');return}
  const v=destination(dx,dy,elapsed);powerFill.style.width=Math.min(100,v.power*100)+'%';throwWish(v.x,v.y)
 });
 pond.addEventListener('pointercancel',cancelWishDrag);pond.addEventListener('lostpointercapture',cancelWishDrag);
 takeCoin=b(q,tr('Take a Paw Coin','取一枚爪爪币'),()=>{if(!current()||!bankReady||held||busy||done)return;held=true;home();syncToss();sound(440);message.textContent=tr('Hold a wish in your heart. Swipe from your coin towards the bowl.','心里默默许个愿，再从手中的铜钱向小碗滑动。')});
 gentle=b(q,tr('Toss gently','轻轻投币'),()=>throwWish(50,39));gentle.classList.add('pawGentleToss');syncToss();
 let keyboardAim=0,keyboardPower=47;const keyboard=element('details','',q);element('summary',tr('Alternative aiming controls','其他瞄准方式'),keyboard);const controls=element('div','',keyboard,'wishKeyboard');const readout=element('output','',controls);readout.setAttribute('aria-live','polite');function updateAim(){readout.textContent=tr('Angle ','角度 ')+keyboardAim+'° · '+tr('Power ','力度 ')+keyboardPower+'%';powerFill.style.width=keyboardPower+'%'};for(const [label,description,fn] of [['←',['Aim left','向左瞄准'],()=>keyboardAim=Math.max(-45,keyboardAim-5)],['→',['Aim right','向右瞄准'],()=>keyboardAim=Math.min(45,keyboardAim+5)],['−',['Less power','减小力度'],()=>keyboardPower=Math.max(10,keyboardPower-4)],['+',['More power','加大力度'],()=>keyboardPower=Math.min(90,keyboardPower+4)]]){const btn=b(controls,label,()=>{fn();updateAim()});btn.setAttribute('aria-label',tr(...description))}b(controls,tr('Throw','投币'),()=>{const a=keyboardAim*Math.PI/180;const o=source();throwWish(clampWish(o.x+Math.sin(a)*keyboardPower*pond.clientHeight/pond.clientWidth,4,96),clampWish(o.y-Math.cos(a)*keyboardPower,5,94))});updateAim();
let again=b(q,tr('Make another wish','再许一个愿'),()=>{if(!current()||busy)return;done=false;held=false;misses=0;syncToss();koiLife.reset();pond.querySelectorAll('.settledWishCoin').forEach(n=>n.remove());home();again.hidden=true;message.textContent=tr('Take another Paw Coin when you are ready.','准备好了，再取一枚爪爪币。')});again.hidden=true;
 const finishVisit=()=>{if(!current())return;koiLife.stop();cancelFlight();$('page').style.display='none';hint('Take your wish with you, or visit another spot in the garden.','带着心愿慢慢走，也可以去花园的其他地方看看。')};
 b(q,tr('Hang a private wish','挂心愿牌'),()=>{if(!current())return;koiLife.stop();cancelFlight();$('page').style.display='none';start('wishes')});
 b(q,tr('Return to the garden','回到花园'),finishVisit);
})};
const wishCompactVisual=document.createElement('style');wishCompactVisual.textContent=`
#content:has(.wishRitual) .wishRitual{width:min(100%,340px,calc(43dvh * 1.06))!important;aspect-ratio:4/5!important;max-height:50dvh!important;margin:6px auto!important;touch-action:none}
#content:has(.wishRitual) .wishThrowGuide{font:600 14px/1.4 system-ui,sans-serif;color:#40594f;margin:8px 0 4px;max-width:560px}
#content:has(.wishRitual) .wishMessage{font:500 14px/1.4 system-ui,sans-serif;color:#324d43;background:#e7e7d2;border-left:3px solid #83957b;padding:8px 10px;min-height:2.8em!important;margin:4px 0!important}
#content:has(.wishRitual) .wishPower{height:6px;width:min(100%,340px);margin:5px auto!important}
#content:has(.wishRitual) .wishRitual .livingKoi{width:16%;height:11%;filter:drop-shadow(0 2px 3px #102f3044)}
#content:has(.wishRitual) .livingKoi img{animation:none!important}
#content .wishFishSpeech{position:absolute;max-width:68%;width:max-content;transform:translate(-50%,-50%);background:#f9efd9;color:#344b42;border:1px solid #9d8969;border-radius:10px 10px 10px 2px;padding:6px 8px;font:600 12px/1.35 system-ui,sans-serif;box-shadow:0 2px 5px #203a3544;pointer-events:none;z-index:5;overflow-wrap:anywhere}
#content .wishRitual .wishAim{z-index:2;box-shadow:0 0 0 5px #ffedb230}
#content:has(.wishRitual) .wishRitual .ritualCoin{width:44px!important;height:44px!important}
@media(orientation:landscape){#content:has(.wishRitual) .wishRitual{width:min(100%,620px,110dvh)!important;aspect-ratio:16/9!important;max-height:62dvh!important}}
`;document.head.append(wishCompactVisual);


/* Master Yue: one consultation, two independent in-memory birth profiles.
   No localStorage, sessionStorage, network or public posts for birth details.
   Refreshing/closing this game tab clears them. Existing calculations stay. */
const yueSessionProfiles={self:{date:'',chart:null,year:null,sign:null,almanacReady:false},other:{date:'',chart:null,year:null,sign:null,almanacReady:false}};
let yueSubject='self';
function yueProfile(){return yueSessionProfiles[yueSubject]}
function yueValidDate(value,today){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-02'||value>today)return false;
 const d=new Date(value+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===value
}
function yueAcceptDate(profile,date,today){
 if(!yueValidDate(date,today))return false;
 if(profile.date!==date){profile.date=date;profile.chart=null;profile.sign=null;profile.almanacReady=false}
 return true
}
function yueAcceptChart(profile,values,today){
 const [date,time,tz,lat,lon]=values;
 if(!yueValidDate(date,today)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||[tz,lat,lon].some(v=>v===''||!Number.isFinite(Number(v)))||Number(tz)<-12||Number(tz)>14||Number(lat)<-66||Number(lat)>66||Math.abs(Number(lon))>180)return false;
 const same=profile.chart&&[date,time,tz,lat,lon].every((v,i)=>v===profile.chart[['date','time','tz','lat','lon'][i]]);
 const topic=same?profile.chart.topic:null;
 yueAcceptDate(profile,date,today);profile.chart={date,time,tz,lat,lon,topic};return true
}
function yueClearProfile(subject){if(!Object.hasOwn(yueSessionProfiles,subject))return;yueSessionProfiles[subject]={date:'',chart:null,year:null,sign:null,almanacReady:false}}
/* PAW_YUE_CONSULTATION_PRIVACY_BEGIN */
function yueClearAllowed(origin,current,connected){
 return connected===true&&['self','other'].includes(origin)&&origin===current
}
function yueAutoYearAllowed(profile,date,editing,valid){
 return !!profile?.almanacReady&&!!profile.date&&profile.date===date&&!editing&&valid===true
}
/* PAW_YUE_CONSULTATION_PRIVACY_END */
function yueSubjectName(){return yueSubject==='self'?tr('My reading','我的命盘'):tr('Someone else’s reading','帮别人看看')}
function yueReturnControls(q,render,switchView=render){
 const nav=q.querySelector('.row'),back=nav?.firstElementChild,language=nav?.lastElementChild;
 if(back){back.textContent=tr('‹ Master Yue','‹ 月师傅');back.onclick=yueReadingHub}
 if(language)language.onclick=()=>{zh=!zh;save('zh',zh);document.documentElement.lang=zh?'zh':'en';updateHUD();render()};
 const strip=element('div','',q,'yueSubjectStrip');element('strong',yueSubjectName(),strip);
 const people=element('div','',strip,'yueInlinePeople');for(const [id,en,cn] of [['self','Me','自己'],['other','Someone else','别人']]){const btn=b(people,tr(en,cn),()=>{if(yueSubject===id)return;yueSubject=id;switchView()});btn.setAttribute('aria-pressed',String(id===yueSubject))}
 const title=q.querySelector('h1');if(title)title.after(strip);
 // The native desk menu bypasses the old standalone hub. Keep the
 // privacy notice and per-person clearing on each actual consultation.
 const subject=yueSubject,privacy=element('details','',q,'yueDeskPrivacy');
 strip.after(privacy);
 element('summary',tr('Birth details & privacy','生辰资料与隐私'),privacy);
 element('p',tr('Birth details stay in this open game tab. For someone else, use only details they agree to share.','生辰资料仅暂存在当前游戏页面。替别人查看时，请使用对方同意提供的资料。'),privacy);
 const clear=b(privacy,tr('Clear this person’s details','清除该对象资料'),()=>{
  if(!yueClearAllowed(subject,yueSubject,privacy.isConnected)||!confirmRow.hidden)return;
  confirmRow.hidden=false;clear.hidden=true;cancel.focus({preventScroll:true})
 });clear.type='button';
 const confirmRow=element('div','',privacy,'yueClearConfirm');confirmRow.hidden=true;
 element('p',tr('Clear the current person’s details and any unfinished input? The other person’s details will stay.','清除当前对象的资料及未完成的输入？另一位对象的资料会保留。'),confirmRow);
 const cancel=b(confirmRow,tr('Keep details','保留资料'),()=>{if(!privacy.isConnected)return;confirmRow.hidden=true;clear.hidden=false;clear.focus({preventScroll:true})});cancel.type='button';
 const confirm=b(confirmRow,tr('Clear details','确认清除'),()=>{
  if(confirmRow.hidden||!yueClearAllowed(subject,yueSubject,privacy.isConnected))return;
  yueClearProfile(subject);switchView()
 });confirm.type='button'
}
function yueReadingHub(){
 page(tr('Master Yue’s reading room','月师傅的命理小馆'),tr('One visit, many questions. The heavens do not require duplicate paperwork.','来都来了，慢慢问。天庭不需要你重复填表。'),q=>{
  const profile=yueProfile(),mast=element('div','',q,'yueSessionMast'),img=element('img','',mast);img.src='assets/visual/painted/master-yue/expressions/warm.webp';img.alt='';
  const words=element('div','',mast);element('strong',tr('Master Yue','月师傅'),words);element('p',tr('Come, sit down. Have a cup of tea first. What is on your mind?','来来来，坐下先喝杯茶。今天想聊些什么？'),words);
  const choices=element('div','',q,'yueSubjectChoices');
  for(const [id,en,cn] of [['self','My reading','我的命盘'],['other','Someone else’s reading','帮别人看看']]){
   const btn=b(choices,tr(en,cn),()=>{yueSubject=id;yueReadingHub()});btn.setAttribute('aria-pressed',String(id===yueSubject))
  }
  if(profile.date)element('p',tr('I have your details for this visit. No need to fill them in again.','这次的生辰资料我记着呢，不用再填。'),q,'yueSessionNote');
  const list=element('div','',q,'yueReadingMenu');
  for(const [name,desc,fn] of [
   [profile.chart?['Continue the personal chart','继续查看个人命盘']:['Personal birth chart','个人生辰命盘'],['Zi Wei Dou Shu and Western Big Three; date, time and birthplace.','紫微斗数与西洋三大星座；需要出生日期、时间和地点。'],()=>destinyPage()],
   [['Chinese zodiac & Tai Sui','生肖流年 · 犯太岁'],['Explore a lunar year. Birth date only.','看看生肖流年，只需出生日期。'],()=>yueZodiacAlmanac()],
   [['Weekly star signs','本周十二星座'],['Choose a sun sign. No birth details needed.','直接选星座，无需填写生辰。'],()=>starSignPage()]
  ]){const btn=b(list,'',fn);element('strong',tr(...name),btn);element('small',tr(...desc),btn)}
  if(profile.date||profile.chart||profile.sign!==null)b(q,tr('Clear this person’s details','清除该对象资料'),()=>{yueClearProfile(yueSubject);yueReadingHub()});
  element('small',tr('Details stay in this open game tab only. They are never saved to your account or uploaded. For someone else, use only details they agree to share.','生辰资料仅暂存在当前游戏页面，不会保存到账号或上传。替别人查看时，请使用对方同意提供的资料。'),q,'yueSessionNote');
  const lang=q.querySelector('.row')?.lastElementChild;if(lang)lang.onclick=()=>{zh=!zh;save('zh',zh);document.documentElement.lang=zh?'zh':'en';updateHUD();yueReadingHub()}
 })
}
destinyConsultMenu=function(){closeTalk();yueReadingHub()};
const yueSessionChartBefore=destinyPage;
destinyPage=function(edit=false,selectedTopic=null,draft=null){
 yueSessionChartBefore();const q=$('content'),profile=yueProfile(),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');if(!form||!out)return;
 const fields=[form.querySelector('input[type=date]'),form.querySelector('input[type=time]'),...form.querySelectorAll('input[type=number]')];
 if(fields.length!==5||fields.some(v=>!v))return;
 fields[0].max=shrineClock().day;
 if(profile.date)fields[0].value=profile.date;
 if(profile.chart){const values=['date','time','tz','lat','lon'].map(k=>profile.chart[k]);fields.forEach((v,i)=>v.value=values[i])}
 if(Array.isArray(draft)&&draft.length===5)fields.forEach((v,i)=>v.value=draft[i]);
 const details=form.querySelector('details'),city=details?.querySelector('select');
 if((profile.chart||draft)&&city){
  const locations=[[8,1.35,103.82],[8,30.27,120.16],[8,31.23,121.47],[8,39.9,116.4],[8,22.32,114.17],[8,3.14,101.69],[8,25.03,121.57],[9,35.68,139.69]];
  const k=locations.findIndex(v=>v.every((n,i)=>Number(fields[i+2].value)===n));city.value=k<0?'custom':String(k);
  const summary=details.querySelector('summary');if(summary)summary.textContent=tr('Birthplace: ','出生地：')+(city.selectedOptions[0]?.textContent||tr('Saved coordinates','已填写经纬度'));
 }
 const toolbar=element('div','',q,'yueChartTools');form.before(toolbar);
 const editButton=b(toolbar,tr('Edit birth details','修改生辰资料'),()=>{form.hidden=false;editButton.hidden=true;fields[0].focus()});editButton.hidden=true;
 b(toolbar,tr('Zodiac & Tai Sui','生肖流年'),()=>yueZodiacAlmanac());b(toolbar,tr('Weekly star signs','每周星座'),()=>starSignPage());
 const remember=()=>{if(!out.querySelector('.ziGrid'))return;const values=fields.map(v=>v.value);if(!yueAcceptChart(profile,values,shrineClock().day))return;
  form.hidden=true;editButton.hidden=false;const illustration=q.querySelector('.destinyChamber');if(illustration)illustration.classList.add('yueChartReadMode');
  const topic=selectedTopic??profile.chart.topic;
  if(topic!=null)out.querySelector('.chartTopics [data-topic="'+topic+'"]')?.click()
 };
 form.addEventListener('submit',remember);
 out.addEventListener('click',e=>{
  const topic=e.target.closest('button[data-topic]')?.dataset.topic;
  if(profile.chart&&topic!==undefined)profile.chart.topic=topic;
 });
 yueReturnControls(q,()=>{destinyPage(!form.hidden,null,form.hidden?null:fields.map(v=>v.value))},()=>destinyPage());
 if(profile.chart&&!edit&&form.checkValidity()){form.requestSubmit()}else form.hidden=false
};
const yueSessionZodiacBefore=yueZodiacAlmanac;
yueZodiacAlmanac=function(birth='',selection=null){
 const profile=yueProfile();
 yueSessionZodiacBefore(birth||profile.date,selection??profile.year);
 const q=$('content'),form=q.querySelector('.yueAlmanacForm'),out=q.querySelector('.yueAlmanacPaper');if(!form||!out)return;
 const date=form.querySelector('input[type=date]'),year=form.querySelector('select');if(!date||!year)return;
 if(profile.date&&!birth)date.value=profile.date;
 date.min='1900-01-02';
 date.max=shrineClock().day;
 const toolbar=element('div','',q,'yueChartTools');form.before(toolbar);
 const edit=b(toolbar,tr('Change birth date','修改出生日期'),()=>{date.closest('label').hidden=false;edit.hidden=true;date.focus()});edit.hidden=true;
 function remember(){if(!out.querySelector('.yueReadingFront')||!yueAcceptDate(profile,date.value,shrineClock().day))return;profile.almanacReady=true;profile.year=Number(year.value);date.closest('label').hidden=true;edit.hidden=false}
 form.addEventListener('submit',remember);
 year.addEventListener('change',()=>{if(yueAutoYearAllowed(profile,date.value,!date.closest('label').hidden,form.checkValidity()))form.requestSubmit()});
 yueReturnControls(q,()=>yueZodiacAlmanac(date.value,Number(year.value)),()=>yueZodiacAlmanac());
 if(profile.date&&date.value===profile.date&&form.checkValidity())form.requestSubmit()
};
const yueSessionStarsBefore=starSignPage;
starSignPage=function(selected=null){
 const profile=yueProfile();yueSessionStarsBefore(selected??profile.sign);
 const q=$('content'),grid=q.querySelector('.signNotebookGrid');if(!grid)return;
 grid.querySelectorAll('button').forEach((btn,i)=>btn.addEventListener('click',()=>{profile.sign=i}));
 yueReturnControls(q,()=>starSignPage(profile.sign),()=>starSignPage())
};
const yueSessionStyle=document.createElement('style');yueSessionStyle.textContent=`
#game #content .yueDeskPrivacy{margin:7px 0;padding:5px 0;border-top:1px dashed #baa47f;color:#554b39;font-size:13px;line-height:1.5}
#game #content .yueDeskPrivacy summary{min-height:44px;display:flex;align-items:center;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
#game #content .yueDeskPrivacy p{margin:5px 0 8px;overflow-wrap:anywhere}
#game #content .yueDeskPrivacy button{min-height:44px;white-space:normal;margin:3px 5px 3px 0}
#game #content .yueDeskPrivacy [hidden]{display:none!important}
.yueSessionMast{display:flex;align-items:center;gap:15px;background:#e9dcc0;padding:12px;margin:14px 0;color:#384f43}
.yueSessionMast img{width:90px;height:100px;object-fit:contain;flex:none}.yueSessionMast p{margin:4px 0;line-height:1.4}
.yueSubjectChoices,.yueChartTools{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.yueSubjectChoices button,.yueChartTools button{flex:1 1 120px;min-height:44px;white-space:normal}
.yueSubjectChoices button[aria-pressed=true]{background:#385747!important;color:#fff1d3!important}
.yueReadingMenu{display:grid;gap:10px;margin:14px 0}.yueReadingMenu button{padding:14px;text-align:left;min-height:72px;white-space:normal}.yueReadingMenu strong,.yueReadingMenu small{display:block;line-height:1.4}.yueReadingMenu strong{font-family:Georgia,"Songti SC",serif;font-size:19px}.yueReadingMenu small{font-size:13px;margin-top:5px}
.yueSubjectStrip{display:flex;gap:10px;align-items:center;justify-content:space-between;background:#375347;color:#f8e8c9;padding:8px 12px;margin:8px 0}.yueSubjectStrip button{min-height:44px}.yueSessionNote{font-size:13px;line-height:1.5;display:block;margin:10px 0;color:#655943}
#content .astroForm[hidden],#content .yueAlmanacForm label[hidden],#content .yueChartTools button[hidden]{display:none!important}
#content .destinyChamber.yueChartReadMode .roomArtWrap{max-height:145px;overflow:hidden}#content .destinyChamber.yueChartReadMode .roomIllustration{height:145px!important;max-height:145px!important;object-fit:cover!important;aspect-ratio:auto!important}
`;document.head.append(yueSessionStyle);

const yueFriendlyCSS=document.createElement('style');yueFriendlyCSS.textContent=`.yueSessionMast{background:#f2e5ca!important;border:0!important;box-shadow:none!important;gap:12px;padding:10px 0!important}.yueSessionMast img{width:clamp(96px,29vw,145px);height:auto;aspect-ratio:120/98;object-fit:contain;mix-blend-mode:multiply}.yueSessionMast strong{font:600 22px Georgia,'Songti SC',serif}.yueSessionMast p{font-size:15px;line-height:1.5}.yueSubjectStrip{flex-wrap:wrap;gap:6px!important}.yueInlinePeople{display:flex;gap:4px;flex:1;justify-content:flex-end}.yueInlinePeople button{font-size:13px;min-height:44px;padding:6px 9px}.yueInlinePeople button[aria-pressed=true]{background:#f4e5c3!important;color:#314d40!important}.yueSubjectStrip>strong{font-size:13px}.yueReadingMenu button{border-radius:3px!important;background:#f3e6cc!important;color:#344d41!important;box-shadow:none!important}`;document.head.append(yueFriendlyCSS);

const pawWishGardenCss=document.createElement('style');pawWishGardenCss.textContent=`
#content:has(.pawWishGarden){background:linear-gradient(#f4e8d2f4,#eee1c8f5),url('assets/art/025.webp') center/cover!important;color:#493e30}
#content .pawWishGarden{position:relative;box-sizing:border-box;width:min(100%,740px);margin:12px auto;padding:clamp(10px,3vw,24px);background:linear-gradient(#342f2533,#393b2c50),url('assets/art/025.webp') center/cover;border:1px solid #977e58;border-radius:5px;box-shadow:0 4px 14px #3b302c3b}
#content:has(.pawWishGarden) .wishRitual{background-size:100% 100%!important;background-repeat:no-repeat!important;background-color:#345f56!important;border:clamp(6px,1.7vw,11px) solid #a99b7d!important;box-shadow:0 7px 15px #251f1c70,inset 0 0 16px #1c3b3688!important}
#content .pawWishGarden .wishRitual:before,#content .pawWishGarden .wishRitual:after{display:none!important}
#content .pawWishGarden .wishThrowGuide,#content .pawWishGarden .wishMessage{font:500 14px/1.4 Georgia,"Songti SC",serif!important;color:#f9edce!important;background:#354b3ee8!important;border:1px solid #bba278!important;border-radius:3px;padding:9px 11px!important;margin:0 auto 8px!important;max-width:620px;min-height:0!important}
#content .pawWishGarden .wishPower{background:#d7c9ac!important}
#content .pawWishGarden .wishRitual .ritualCoin{filter:drop-shadow(0 2px 1px #213d35bb)}
`;document.head.append(pawWishGardenCss);

const pawWishBankStyle=document.createElement('style');pawWishBankStyle.textContent=`
#game #content .pawWishGarden .pawWishBankActors{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
#game #content .pawWishGarden .wishRitual{overflow:visible!important;z-index:2}
#game #content .pawWishGarden .pawCoinTray{display:none!important}
#game #content .pawWishGarden .wishRitual .ritualCoin{width:clamp(14px,4vw,21px)!important;height:clamp(14px,4vw,21px)!important;object-fit:contain!important}
`;document.head.append(pawWishBankStyle);
