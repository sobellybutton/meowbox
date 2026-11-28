const fs=require('node:fs'),path=require('node:path');const s=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');const start=s.indexOf('/* MBDEER_STAGE_BEGIN */'),end=s.indexOf('/* MBDEER_STAGE_END */');if(start<0||end<start)throw Error('Missing deer geometry');const check=new Function(s.slice(start,end)+`for(let i=0;i<=100;i++){const v=i/100;for(const [b,f] of [[v*.8,0],[0,v]]){const q=deerStageLayout(b,f);if(q.deerX-q.playerX<171||q.muzzleX-q.playerX<68||q.deerScale>.9)throw Error('deer crowding');}}return 'PASS: 202 sampled deer stage positions'`);console.log(check());
const startup=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');const i=startup.indexOf('function pawHerdSlots()'),j=startup.indexOf('/* PAW_HERD_EXCHANGE_END */',i);if(i<0||j<i)throw Error('Missing herd geometry');console.log(new Function(startup.slice(i,j)+`
const profiles=[{id:'mugi'},{id:'koyo'},{id:'sora'}];let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
for(let i=-3;i<=3;i++){const herd=pawHerdRoster(profiles,i);ck(herd.length===6&&new Set(herd.filter(v=>v.named).map(v=>v.profile.id)).size===3,'six slots, three distinct named deer')}
const stage={x:508,y:554,scale:.84},old={x:206,y:407,scale:.3},next={x:390,y:411,scale:.28};
const a=pawHerdExchangePose(0,stage,old,next),b=pawHerdExchangePose(.95,stage,old,next),c=pawHerdExchangePose(2.1,stage,old,next);
ck(a.x===stage.x&&a.y===stage.y&&a.leg==='leave','start at front');ck(b.x===next.x&&b.y===next.y&&b.leg==='arrive','next deer starts in herd');ck(c.x===stage.x&&c.y===stage.y&&c.done,'finish at front');
for(let k=0;k<=210;k++){const p=pawHerdExchangePose(k/100,stage,old,next);ck(p.x>=old.x&&p.x<=stage.x&&p.y>=old.y&&p.y<=stage.y&&p.scale>=.28&&p.scale<=.84+1e-9,'bounded pose')}
return 'PASS '+n+' herd identity and continuous exchange checks';`)());

const offerStart=s.indexOf('/* PAW_DEER_OFFER_BEGIN */'),offerEnd=s.indexOf('/* PAW_DEER_OFFER_END */',offerStart);
if(offerStart<0||offerEnd<=offerStart)throw Error('Missing deer offering choreography');
console.log(new Function(s.slice(start,end)+s.slice(offerStart,offerEnd)+`
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
let prev=null;
for(let i=0;i<=380;i++){
 const t=i/100,q=pawDeerOfferPose(t),g=deerStageLayout(0,q.feed);
 ck(q.retrieve>=0&&q.retrieve<=1&&q.kneel>=0&&q.kneel<=1,'bounded actor movement');
 ck(q.feed>=0&&q.feed<=1,'bounded animal approach');
 ck(!(q.stock&&q.held),'no duplicate cracker');
 ck(t>=1.3||q.feed===0,'deer waits for retrieval');
 ck(g.deerX-(g.playerX+30*q.retrieve)>=171,'safe separation throughout');
 if(prev)ck(Math.abs(q.retrieve-prev.retrieve)<=.05&&Math.abs(q.kneel-prev.kneel)<=.08,'continuous pose');
 prev=q;
 const still=pawDeerOfferPose(t,true);ck(still.retrieve===0&&still.kneel===0&&!still.walking,'reduced motion actor stable');
}
ck(pawDeerOfferPose(0).stock&&!pawDeerOfferPose(0).held,'cracker starts in tray');
ck(pawDeerOfferPose(.65).held&&!pawDeerOfferPose(.65).stock,'one cracker taken');
ck(pawDeerOfferPose(2.65).feed>.9&&!pawDeerOfferPose(2.65).held,'consumption during closest approach');
ck(pawDeerOfferPose(3.8).done&&Math.abs(pawDeerOfferPose(3.8).feed)<1e-8,'return to neutral');
return 'PASS '+n+' deer retrieval, offer, spacing and reduced motion checks';
`)());
