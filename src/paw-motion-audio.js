/* Original, quiet procedural movement effects. Uses the game's already
   unlocked AudioContext and effects bus. No samples, autoplay or new audio
   context. Movement distance is supplied in logical world units. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawMotionAudio=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const surfaces={stone:[820,.034,.085],wood:[380,.032,.095],sand:[460,.025,.13],grass:[1150,.019,.09]};
 function createStepper(stride=42){
  if(!Number.isFinite(stride)||stride<8)throw Error('Invalid stride');
  let carried=0,last=null,foot=0;
  return {reset(){carried=0;last=null},update(sample){
   if(!sample||!sample.enabled||!sample.walking||!Number.isFinite(sample.x)||!Number.isFinite(sample.y)||typeof sample.context!=='string'){this.reset();return null}
   const point={x:sample.x,y:sample.y,context:sample.context};
   if(!last||last.context!==point.context){carried=0;last=point;return null}
   const d=Math.hypot(point.x-last.x,point.y-last.y);last=point;
   // Never turn a teleport, large stalled frame or map change into footfalls.
   if(d>stride*2){carried=0;return null}
   carried+=d;if(carried<stride)return null;
   carried%=stride;foot=1-foot;return {foot,surface:Object.hasOwn(surfaces,sample.surface)?sample.surface:'stone'}
  }};
 }
 function permitted(flags){return !!flags?.enabled&&!flags.muted&&!flags.hidden&&!flags.overlay&&!flags.paused}
 function createPlayer(context,bus,random=Math.random){
  let last=-Infinity,trainLast=-Infinity,buffer=null;
  function ready(flags){return permitted(flags)&&context?.state==='running'&&bus&&Number.isFinite(context.currentTime)}
  function noise(){
   if(buffer)return buffer;
   const length=Math.ceil(context.sampleRate*.18);buffer=context.createBuffer(1,length,context.sampleRate);
   const data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<length;i++){smooth=(smooth+(random()*2-1)*.45)*.72;data[i]=smooth}
   return buffer
  }
  function pulse(frequency,volume,duration,filterType='bandpass'){
   const t=context.currentTime,source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
   source.buffer=noise();filter.type=filterType;filter.frequency.value=frequency;filter.Q.value=.75;
   gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(volume,t+.009);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
   source.connect(filter);filter.connect(gain);gain.connect(bus);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};source.start(t);source.stop(t+duration+.005);
  }
  function footstep(step,flags){
   if(!ready(flags)||!step||!Object.hasOwn(surfaces,step.surface)||context.currentTime-last<.12)return false;
   const [f,v,d]=surfaces[step.surface];try{pulse(f*(step.foot?.91:1.05),v,d);last=context.currentTime;return true}catch{return false}
  }
  function railway(flags,speed=1){
   if(!ready(flags)||!Number.isFinite(speed)||speed<=0)return false;
   const s=Math.min(1,Math.max(.25,speed)),period=.39/s;
   if(context.currentTime-trainLast<period)return false;
   try{pulse(145,.024*s,.16,'lowpass');trainLast=context.currentTime;return true}catch{return false}
  }
  return {footstep,railway,reset(){last=-Infinity;trainLast=-Infinity}}
 }
 return Object.freeze({createStepper,createPlayer,permitted,surfaceNames:Object.keys(surfaces)});
});
