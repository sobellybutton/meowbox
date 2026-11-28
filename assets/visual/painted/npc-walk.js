/* Original staged office-worker walk sequence. Candidate only until a
 * matching live cameo is registered and its alpha/scale checked in scene.
 * No movement, route, collision, identity or save state is owned here. */
;(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawNpcWalk=api})(typeof globalThis==='undefined'?this:globalThis,function(){
'use strict';
const assets=Object.freeze(Array.from({length:8},(_,i)=>'assets/visual/staging/2026-11-28-project-batch08-npcs/npcs/office-worker/walk/right-'+String(i).padStart(2,'0')+'.png'));
const size=Object.freeze([448,464]),foot=Object.freeze([224,454]);
// Provisional 8fps at a normal walking speed. The caller supplies actual
// travelled ground distance and apparent body height, not wall-clock time.
function frame(distance,height,reduced=false){
 if(!Number.isFinite(distance)||distance<0||!Number.isFinite(height)||height<=0)return null;
 if(reduced)return 2;
 const stride=height*.65;
 return Math.floor((distance%stride)/stride*assets.length)%assets.length
}
function box(x,y,height){
 if(![x,y,height].every(Number.isFinite)||height<=0)return null;
 // The inspected poses occupy roughly 420 source pixels vertically.
 // This is a provisional visual-height estimate, not a semantic head/foot match.
 const scale=height/420;
 return {x:x-foot[0]*scale,y:y-foot[1]*scale,w:size[0]*scale,h:size[1]*scale}
}
// Require the entire sequence to be decoded before switching from fallback.
const decodedSets=new WeakSet();
function dimensions(images){
 return Array.isArray(images)&&images.length===assets.length&&images.every(im=>im?.complete&&im.naturalWidth===size[0]&&im.naturalHeight===size[1])
}
function ready(images){return dimensions(images)&&decodedSets.has(images)}
async function decodeSequence(images){
 if(!Array.isArray(images)||images.length!==assets.length)return false;
 try{
  await Promise.all(images.map(im=>typeof im?.decode==='function'?im.decode():Promise.reject(Error('Missing decoder'))));
  if(!dimensions(images))return false;
  decodedSets.add(images);return true
 }catch{return false}
}
function createLoader(ImageCtor){
 let entry=null;
 return function prepare(visit){
  if(entry&&(entry.status!=='failed'||entry.visit===visit))return entry;
  const current={visit,status:'loading',images:[]};entry=current;
  try{
   current.images=assets.map(path=>{const im=new ImageCtor();im.decoding='async';im.src=path;return im});
   current.promise=decodeSequence(current.images).then(ok=>{current.status=ok?'ready':'failed';return ok})
  }catch{current.status='failed';current.promise=Promise.resolve(false)}
  return current
 }
}
function plan(actor,images,height,reduced=false){
 // The candidate sheet is right-facing only. Do not reflect the briefcase
 // onto the other hand or substitute this identity for generic visitors.
 if(actor?.identity!=='office-worker'||actor.facing!=='right'||!actor.walking||!ready(images))return null;
 const index=frame(actor.distance,height,reduced),bounds=box(actor.x,actor.y,height);
 return index===null||!bounds?null:{index,bounds}
}
function draw(ctx,actor,images,height,reduced=false){
 const q=plan(actor,images,height,reduced);if(!q||!ctx)return false;
 const b=q.bounds;ctx.drawImage(images[q.index],b.x,b.y,b.w,b.h);return true
}
return Object.freeze({assets,size,foot,frame,box,ready,decodeSequence,createLoader,plan,draw})
});
