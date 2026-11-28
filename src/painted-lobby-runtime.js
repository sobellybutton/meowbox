/* A mapped room has one backdrop authority. The old portrait-specific
   Tarot wrapper otherwise paints its geometric scene over the admitted
   watercolor plate on every narrow-screen frame. Preserve fallback only
   when the mapped visit is genuinely inactive. */
const pawRetiredTarotBackdrop=paintPortraitReadingRoom;
paintPortraitReadingRoom=function(...args){
 if(typeof pawReadingActive==='function'&&pawReadingActive()&&room==='tarot'&&pawReadingBackdrop())return true;
 return pawRetiredTarotBackdrop.apply(this,args)
};
