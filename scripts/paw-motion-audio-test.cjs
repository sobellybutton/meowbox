'use strict';
const assert=require('node:assert/strict'),a=require('../src/paw-motion-audio.js');
const step=a.createStepper(40),p=(x,extra={})=>({x,y:0,context:'fortune',walking:true,enabled:true,surface:'stone',...extra});
assert.equal(step.update(p(0)),null);assert.equal(step.update(p(20)),null);
assert.deepEqual(step.update(p(40)),{foot:1,surface:'stone'});
assert.deepEqual(step.update(p(80)),{foot:0,surface:'stone'});
assert.equal(step.update(p(900)),null);assert.equal(step.update(p(940,{context:'home'})),null);
assert.equal(step.update(p(980,{walking:false})),null);assert.equal(step.update(p(1000)),null);
assert.equal(step.update(p(1040,{surface:'wood'})).surface,'wood');
assert.equal(step.update(p(1080,{enabled:false})),null);
const flags={enabled:true,muted:false,hidden:false,overlay:false,paused:false};
assert.equal(a.permitted(flags),true);for(const k of Object.keys(flags))assert.equal(a.permitted({...flags,[k]:!flags[k]}),false);
const log=[],filters=[],param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
const node=()=>({connect(){},disconnect(){}});
const ctx={state:'running',sampleRate:8000,currentTime:0,createBuffer:(_,n)=>({getChannelData:()=>new Float32Array(n)}),createBufferSource:()=>({...node(),start(t){log.push(t)},stop(){this.onended?.()}}),createBiquadFilter:()=>{const filter={...node(),frequency:{},Q:{}};filters.push(filter);return filter},createGain:()=>({...node(),gain:param})};
const player=a.createPlayer(ctx,{},()=>.5);
assert.equal(player.footstep({foot:0,surface:'stone'},flags),true);
assert.equal(player.footstep({foot:1,surface:'wood'},flags),false);
ctx.currentTime=.2;assert.equal(player.footstep({foot:1,surface:'wood'},flags),true);
assert.equal(player.railway(flags),true);ctx.currentTime=.3;assert.equal(player.railway(flags),false);
ctx.currentTime=.8;assert.equal(player.railway({...flags,hidden:true}),false);
assert.equal(player.railway(flags),true);ctx.state='suspended';assert.equal(player.railway(flags),false);
assert.equal(log.length,4);
assert.equal(filters[2].frequency.value,132);assert.equal(filters[3].frequency.value,168);
ctx.state='running';ctx.currentTime=2;player.reset();assert.equal(player.railway(flags),true);assert.equal(filters.at(-1).frequency.value,132);
console.log('Motion cadence, mute, surface and audio lifecycle checks passed');

 // A real source ends asynchronously. Scene transitions must silence the
 // existing footstep and rail pulses, including a late onended callback.
 {
  let disconnects=0,stops=0,starts=0;const voices=[];
  const liveNode=()=>({connect(){},disconnect(){disconnects++}});
  const live={...ctx,state:'running',currentTime:0,
   createBufferSource:()=>{const v={...liveNode(),start(){starts++},stop(at){if(at===undefined)stops++}};voices.push(v);return v},
   createBiquadFilter:()=>({...liveNode(),frequency:{},Q:{}}),
   createGain:()=>({...liveNode(),gain:param})};
  const p=a.createPlayer(live,{},()=>.5);
  assert.ok(p.footstep({surface:'stone',foot:0},flags));assert.ok(p.railway(flags));
  assert.equal(starts,2);assert.equal(disconnects,0);
  const late=voices[0].onended;p.reset();
  assert.equal(stops,2);assert.equal(disconnects,6);
  late();p.reset();assert.equal(disconnects,6);assert.equal(stops,2);
  assert.ok(p.railway(flags));voices[2].onended();
  assert.equal(disconnects,9);p.reset();assert.equal(stops,2);assert.equal(disconnects,9);
  assert.ok(p.footstep({surface:'wood',foot:1},flags));p.reset();
  assert.equal(stops,3);assert.equal(disconnects,12);
 }
 console.log('Movement audio cancellation and late-end cleanup checks passed');
