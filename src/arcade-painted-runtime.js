/* Arcade painted reveal, loaded after the base activity renderer.
   Purchase, reward, input, and save rules remain in their original functions. */
/* PAW_BLIND_PAINTED_RUNTIME_BEGIN */
let pawBlindPairCache=null,pawBlindPairVisit=null;
function pawBlindPreparePair(visit){
 if(typeof PawBlindReveal==='undefined')return pawBlindPairCache;
 // A failed download is not a permanent art decision. Retry on a new
 // shelf visit only, never every animation frame or halfway through a reveal.
 if(pawBlindPairCache&&(!pawBlindPairCache.failed||pawBlindPairVisit===visit))return pawBlindPairCache;
 pawBlindPairVisit=visit;
 const pair={images:{},decoded:false,failed:false};
 pawBlindPairCache=pair;
 const jobs=Object.entries(PawBlindReveal.assets).map(([key,path])=>new Promise((resolve,reject)=>{
  const im=new Image();pair.images[key]=im;im.decoding='async';
  im.onload=()=>{im.onload=im.onerror=null;Promise.resolve().then(()=>typeof im.decode==='function'?im.decode():undefined).then(resolve,reject)};
  im.onerror=()=>{im.onload=im.onerror=null;reject(Error('Carton artwork unavailable'))};im.src=path;
 }));
 Promise.all(jobs).then(()=>{pair.decoded=PawBlindReveal.ready(pair.images);pair.failed=!pair.decoded},()=>{pair.failed=true});
 return pair
}
function pawBlindPaintedReveal(run,stage,age,pair,reduced,drawFigure){
 if(!['opening','result'].includes(stage)||typeof PawBlindReveal==='undefined')return false;
 if(!Object.hasOwn(run,'pawPaintedCarton'))run.pawPaintedCarton=pair?.decoded&&!pair.failed?pair.images:null;
 if(!run.pawPaintedCarton)return false;
 const elapsed=stage==='result'?.98:Math.max(0,age)*.98/.95;
 if(PawBlindReveal.draw(ctx,run.pawPaintedCarton,400,515,1.15,elapsed,drawFigure,reduced))return true;
 boxArt(400,515,1.15,run.boxPick,poseEase(pawBoxReveal(age,reduced).lid),0);
 return true
}
/* PAW_BLIND_PAINTED_RUNTIME_END */
drawBlindShopStage=function(){
 const stage=state.boxStage,age=t-state.boxAt,portrait=W<H,stock=blindStockRemaining(),paintedPair=pawBlindPreparePair(state);
 // One authored shop sign, grounded shelves, and a work counter. The existing
 // room painting remains behind this vector staging draft.
 round(245,230,310,61,5,'#e9d8b6','#92734e');
 activityFitText(tr('The Little Keepsake Shop','小小收藏铺'),400,250,20,290,'#594a38');
 activityFitText(tr('40 Paw Coins / box · ','40爪爪币 / 盒 · ')+hideoutBalance()+tr(' in purse',' 可用'),400,274,15,285,'#52664f');
 if(stage==='choose'){
 if(portrait){blindShopCounter(326,400,148);blindShopCounter(237,582,326)}else blindShopCounter(202,538,396);
 for(let i=0;i<3;i++){
 const p=arcadeBoxSlot(i,portrait);boxArt(p.x,p.y,p.sc,i);
 if(blindShopCanOpen()){target(p.x-54*p.sc,p.y-85*p.sc,108*p.sc,98*p.sc,()=>boxSelect(i));label(tr('Choose','选这个'),p.x,p.y+32,()=>boxSelect(i))}
 }
 activityFitText(tr('Today’s stock ','今日库存 ')+stock+'/'+blindStock,400,portrait?470:600,16,290,'#fff0ce');
 if(!blindShopCanOpen())activityFitText(tr(...blindShopMessage()),400,portrait?635:634,14,330,'#fff0ce');
 label(tr('Collection','收藏册'),400,665,blindCollectionPage);return
 }
 const held=drag?.id==='boxShake'&&stage==='shake',x=held?Math.max(335,Math.min(465,drag.x)):400,y=held?Math.max(450,Math.min(535,drag.y)):515;
 const reveal=stage==='opening'?pawBoxReveal(age,residentReducedMotion.matches):stage==='result'?{lid:1,figure:1,done:true}:{lid:0,figure:0,done:false};
 const opening=poseEase(reveal.lid);
 drawRitualPose(270,560,1.15,{reach:held?{x:x-38,y:y-35}:null});
 blindShopCounter(245,525,310);
 if(stage==='opening'||stage==='result'){
 const v=boxPrizes[state.boxPrize];
 const painted=v&&pawBlindPaintedReveal(state,stage,age,paintedPair,residentReducedMotion.matches,(fx,fy,sc)=>drawBlindCollectible(fx,fy,v,sc));
 if(!painted){
  boxArt(332,515,.82,state.boxPick,opening,0);
  ellipse(458,522,48,8,'#5f49383c');round(408,507,100,17,4,'#d7bb8b','#98724e');
  if(v&&reveal.figure>0){ctx.save();ctx.globalAlpha*=poseEase(reveal.figure);drawBlindCollectible(458,508+(1-reveal.figure)*10,v,1.42);ctx.restore()}
 }
 if(stage==='opening'&&reveal.done&&!pawArcadeInputBlocked()){boxAward();if(v)toast(tr('Meet '+v[0],'遇见'+v[1]))}
 if(stage==='result'&&v){activityFitText(tr(...pawFigureRarity(v[4])),400,558,12,310,'#ffe5ad');activityFitText(tr(v[0],v[1]),400,584,19,310,'#fff1d0');activityFitText(tr(...blindFigureLore[state.boxPrize]),400,610,13,320,'#fff1d0');label(tr('Back to shelf','回到货架'),310,650,()=>start('blindBox'));label(tr('Collection','收藏册'),500,650,blindCollectionPage)}
 return
 }
 boxArt(x,y,1.15,state.boxPick,0,held?Math.sin(t*20)*.12:0);
 if(stage==='shake'){target(330,420,140,130,()=>{},'boxShake');activityFitText(tr('Shake ','摇动 ')+Math.round(state.boxShake)+'%',400,594,17,300,'#fff1d0');label(tr('Back to shelf','回到货架'),286,642,pawBlindCancel);label(tr('Shake','摇一摇'),514,642,()=>boxShake(70))}
 if(stage==='ready'){target(330,420,140,130,boxOpen);label(tr('Back to shelf','回到货架'),278,620,pawBlindCancel);label(tr('Open · 40','开盒 · 40币'),522,620,boxOpen)}
}
