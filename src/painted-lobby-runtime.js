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
const pawTarotLobbyCameraBefore=pawReadingCamera;
pawReadingCamera=function(api,w,h,p=pawReadingPlate){
 if(room==='tarot'&&pawReadingActive()&&w<h){
  const frame=pawTarotLobbyFrame(w,h,p);if(frame)return frame
 }
 return pawTarotLobbyCameraBefore(api,w,h,p)
};
