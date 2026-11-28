const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const start=s.indexOf('/* PAW_SOCIAL_GUIDE_BEGIN */'),end=s.indexOf('/* PAW_SOCIAL_GUIDE_END */',start);
assert.ok(start>=0&&end>start);
const a=new Function(s.slice(start,end)+';return {pawIndoorSocialEligible,pawSocialResponseAllowed}')();
const p={x:0,y:0},actor={x:40,y:20},run={};
assert.ok(a.pawIndoorSocialEligible(actor,p,true));
for(const v of [{...actor,sharedPeer:true},{...actor,kind:2},{x:150,y:0},{x:NaN,y:0},null])assert.equal(a.pawIndoorSocialEligible(v,p,true),false);
assert.equal(a.pawIndoorSocialEligible(actor,p,false),false);
const v={run,scene:'home',originScene:'home',room:'tea',originRoom:'tea',talk:true};
assert.ok(a.pawSocialResponseAllowed(run,v,false));
for(const patch of [{run:{}},{scene:'fortune'},{room:'park'},{talk:false},{activity:'cook'},{transitioning:true}])assert.equal(a.pawSocialResponseAllowed(run,{...v,...patch},false),false);
assert.equal(a.pawSocialResponseAllowed(run,v,true),false);
console.log('Indoor social eligibility and explicit response guards checked');


const wave=new Function(s.split('/* PAW_TRAVELLER_GREETING_BEGIN */')[1].split('/* PAW_TRAVELLER_GREETING_END */')[0]+';return {pawTravellerWaveArt,pawTravellerGreetingFrame}')();
for(let i=0;i<4;i++){
 const r=wave.pawTravellerWaveArt[i];
 assert.ok(fs.existsSync(path.join(__dirname,'..',r.path)));
 assert.ok(r.foot[0]>0&&r.foot[0]<r.width);
 assert.ok(r.foot[1]<r.height&&r.foot[1]/r.height>.93);
 const g={place:'fortune',room:'',id:i,x:400,y:700,at:1};
 for(let j=0;j<120;j++){
  const now=1+j/100;
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'fortune','',i,400,700,false,true),now-1<.95);
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'fortune','',i,400,700,true,true),false);
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'home','',i,400,700,false,true),false);
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'fortune','tea',i,400,700,false,true),false);
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'fortune','',i,403,700,false,true),false);
  assert.equal(wave.pawTravellerGreetingFrame(g,now,'fortune','',i,400,700,false,false),false);
 }
}
console.log('Four illustrated greeting poses and scene/position/gesture guards checked');
