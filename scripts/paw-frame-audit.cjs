/* 100 ms runtime evidence sampler; no production instrumentation. */
const fs=require('node:fs'),path=require('node:path');
async function attachFrameAudit(page,out,prefix){
 fs.mkdirSync(out,{recursive:true});
 const findings=new Map(),samples=[],shots=new Set();
 const file=path.join(out,prefix+'-100ms.json');
 await page.addInitScript(()=>{
  const records=[],errors=[];let last=performance.now(),lastRAF=last,frames=0,alive=true;
  function heartbeat(now){if(!alive)return;lastRAF=now;frames++;requestAnimationFrame(heartbeat)}
  requestAnimationFrame(heartbeat);
  const visible=e=>{if(!e||e.hidden||!e.getClientRects().length)return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>2&&r.height>2};
  const timer=setInterval(()=>{
   const now=performance.now(),gap=Math.round(now-last);last=now;
   try{
    if(typeof scene==='undefined'||typeof p==='undefined'||typeof proposal==='undefined')return;
    const overlay=visible(document.getElementById('page')),intro=visible(proposal),g=document.getElementById('game').getBoundingClientRect();
    const issues=[],mode=intro?'entrance':overlay?'page':activity?'activity':room?'room':'map';
    const q=room&&typeof indoor!=='undefined'?indoor:p;
    if(![q.x,q.y,q.tx,q.ty,cam.scale].every(Number.isFinite))issues.push('non-finite-position');
    if(!intro&&!overlay&&!transitioning&&!activity&&!room&&typeof pawDistrictSpines!=='undefined'&&pawDistrictSpines[scene]){
     const f=pawDistrictFoot(pawDistrictSpines[scene],p.x,p.y);
     if(Math.hypot(f.x-p.x,f.y-p.y)>1.5)issues.push('outdoor-foot-outside-path')
    }
    if(!intro&&!overlay&&!transitioning&&!activity&&room&&continuityRoom===room&&!indoorSafe(indoor.x,indoor.y))issues.push('indoor-foot-outside-path');
    const walkers=!room&&!intro&&!overlay?npc.filter(n=>n.kind!==2&&!n.grumpy&&!residentArtworkRecord(n.n)).map(n=>({name:n.n?.[0],kind:stableResidentFallback(n),x:Math.round(n.x),y:Math.round(n.y)})):[];
    if(walkers.some(a=>a.kind===avatar))issues.push('npc-player-copy');
    for(let i=0;i<walkers.length;i++)for(let j=i+1;j<walkers.length;j++)if(walkers[i].kind===walkers[j].kind&&Math.hypot(walkers[i].x-walkers[j].x,walkers[i].y-walkers[j].y)<240)issues.push('nearby-identical-walkers');
    const labels=room&&!activity&&!overlay&&!intro&&!transitioning&&!talkOpen&&typeof roomGuideEntries==='function'?roomGuideEntries().map(v=>v[0]):[];
    const missing=labels.filter(id=>!hit.some(h=>h.stationId===id&&typeof h.fn==='function'));
    if(missing.length)issues.push('missing-station-target:'+missing.join(','));
    const painted=typeof pawVisibleStationLabels!=='undefined'?[...pawVisibleStationLabels]:[];
    if(labels.some(id=>!painted.includes(id))&&!visible(document.getElementById('pawRoomGuideToggle')))issues.push('missing-activity-directory');
    if(room&&!intro&&!overlay&&!transitioning&&visible(document.getElementById('hud')))issues.push('room-map-hud-visible');
    const controls=[...document.querySelectorAll('#proposal:not([hidden]) button,#game #page button,#game #gameControls button,#game #dialogue button,#game #back,#game #dock button')].filter(e=>visible(e)&&!e.disabled);
    let blocked=0;const relevant=controls.filter(e=>intro?proposal.contains(e):overlay?document.getElementById('page').contains(e):talkOpen?document.getElementById('dialogue').contains(e):!proposal.contains(e)&&!document.getElementById('page').contains(e));
    for(const e of relevant){const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;if(x<g.left||x>=g.right||y<g.top||y>=g.bottom)continue;const h=document.elementFromPoint(x,y);if(h&&h!==e&&!e.contains(h)&&!h.contains(e))blocked++}
    if(blocked&&!transitioning)issues.push('intercepted-visible-controls:'+blocked);
    const rail=document.querySelector('.mbPaintedRail:not([hidden]) .pawMovingGlass'),railData=rail?{frame:Number(rail.dataset.frame||0),travel:Number(rail.dataset.travel||0),visible:visible(rail),mode:rail.closest('.mbPaintedRail')?.dataset.use}:null;
    if(rail&&!visible(rail)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)issues.push('rail-canvas-hidden');
    if(gap>250&&!document.hidden)issues.push('sample-gap-over-250ms');
    if(now-lastRAF>250&&!document.hidden)issues.push('render-stall-over-250ms');
    records.push({ms:Math.round(now),gap,frames,mode,scene,room,activity,transitioning:!!transitioning,dialogue:!!talkOpen,x:Math.round(q.x),y:Math.round(q.y),tx:Math.round(q.tx),ty:Math.round(q.ty),facing:q.facing,scale:cam.scale,walkers,labels,painted,missing,rail:railData,issues:[...new Set(issues)]});
    if(records.length>12000)records.shift();
   }catch(e){errors.push({ms:Math.round(now),error:String(e)})}
  },100);
  window.__pawFrameAudit={drain(){return {records:records.splice(0),errors:errors.splice(0)}},stop(){alive=false;clearInterval(timer)}};
 });
 async function flush(stage){
  const data=await page.evaluate(()=>window.__pawFrameAudit?.drain()||{records:[],errors:[]}).catch(()=>({records:[],errors:[]}));
  for(const row of data.records){
   row.stage=stage;samples.push(row);
   for(const issue of row.issues){const key=[row.mode,row.scene,row.room,row.activity,issue].join('|');let f=findings.get(key);if(!f){f={key,firstMs:row.ms,lastMs:row.ms,count:0,issue,scene:row.scene,room:row.room,activity:row.activity};findings.set(key,f)}f.count++;f.lastMs=row.ms}
  }
  for(const e of data.errors){const key='sampler:'+e.error;const f=findings.get(key)||{key,issue:'sampler-error',count:0,...e};f.count++;findings.set(key,f)}
  const latest=data.records.at(-1);
  if(latest?.issues.length&&shots.size<18){const key=[latest.mode,latest.scene,latest.room,latest.activity,latest.issues[0]].join('|');if(!shots.has(key)){shots.add(key);await page.screenshot({path:path.join(out,prefix+'-anomaly-'+shots.size+'.png')}).catch(()=>{})}}
  fs.writeFileSync(file,JSON.stringify({intervalTargetMs:100,scope:'sampled runtime; screenshot review still required',sampleCount:samples.length,findings:[...findings.values()],samples}));
 }
 return {flush,async stop(){await flush('final');await page.evaluate(()=>window.__pawFrameAudit?.stop()).catch(()=>{})}};
}
module.exports={attachFrameAudit};
