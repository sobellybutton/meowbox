'use strict';
// Pure registry mutations. Persist the entire returned JSON using the current
// GitHub blob SHA; a rejected write means re-read and retry, never proceed.
const STAGES=['outstanding','implemented','tested','visually_verified','accepted'];
function active(t,now){return !!t.lease&&t.lease.until>now}
function validate(reg){
 if(reg.schema!==1||!Array.isArray(reg.tasks)||!reg.lanes)throw Error('Invalid registry');
 const ids=new Set(reg.tasks.map(t=>t.id));
 if(ids.size!==reg.tasks.length)throw Error('Duplicate task IDs');
 for(const t of reg.tasks){
  if(!reg.lanes[t.lane]||!STAGES.includes(t.stage)||!Array.isArray(t.resources)||!t.resources.length||!Array.isArray(t.depends)||!Array.isArray(t.evidence))throw Error('Invalid task '+t.id);
  if(t.depends.some(d=>!ids.has(d)||d===t.id))throw Error('Invalid dependency '+t.id);
  if(t.lease&&(!t.lease.owner||!Number.isFinite(t.lease.until)))throw Error('Invalid lease '+t.id);
 }
 const done=new Set(),visiting=new Set(),byId=new Map(reg.tasks.map(t=>[t.id,t]));
 function visit(id){if(done.has(id))return;if(visiting.has(id))throw Error('Circular dependency '+id);visiting.add(id);for(const d of byId.get(id).depends)visit(d);visiting.delete(id);done.add(id)}
 for(const t of reg.tasks)visit(t.id);return reg
}
function eligible(reg,t,now){
 if(t.stage==='accepted'||active(t,now))return false;
 if(t.depends.some(id=>STAGES.indexOf(reg.tasks.find(v=>v.id===id).stage)<2))return false;
 return !reg.tasks.some(v=>v!==t&&active(v,now)&&v.resources.some(r=>t.resources.includes(r)))
}
function mutate(input,op){
 const reg=JSON.parse(JSON.stringify(validate(input))),now=op.now,owner=op.owner;
 if(!Number.isFinite(now)||!owner||typeof owner!=='string')throw Error('Explicit timestamp and runner ID required');
 const ttl=op.ttl??1800000;if(!Number.isFinite(ttl)||ttl<60000||ttl>3600000)throw Error('Lease must be 1–60 minutes');
 let t=reg.tasks.find(v=>v.id===op.id);
 if(op.action==='claim'){
  const options=reg.tasks.filter(v=>(!op.id||v.id===op.id)&&(!op.lane||v.lane===op.lane)&&eligible(reg,v,now)).sort((a,b)=>a.priority-b.priority||STAGES.indexOf(b.stage)-STAGES.indexOf(a.stage)||a.id.localeCompare(b.id));
  t=options[0];if(!t)return {registry:reg,claimed:null};
  t.lease={owner,until:now+ttl};return {registry:reg,claimed:t.id};
 }
 if(!t||!active(t,now)||t.lease.owner!==owner)throw Error('Task lease missing, expired or owned by another runner');
 if(op.action==='renew'){t.lease.until=now+ttl;return {registry:reg,claimed:t.id}}
 if(op.action==='release'){
  if(op.stage!==undefined){
   const from=STAGES.indexOf(t.stage),to=STAGES.indexOf(op.stage);
   if(to<from||to<0)throw Error('Invalid stage change');
   if(to>from&&(!Array.isArray(op.evidence)||!op.evidence.length||op.evidence.some(v=>typeof v!=='string'||!v.trim())))throw Error('Evidence required for advancement');
   if(to>=3&&to>from&&!op.visualEvidence)throw Error('Rendered visual evidence required');
   if(to===4&&to>from&&!op.releaseGateVerified)throw Error('Release gate confirmation required');
   t.stage=op.stage;
  }
  if(Array.isArray(op.evidence))t.evidence=[...new Set([...t.evidence,...op.evidence])];
  if(op.visualEvidence)t.visualEvidence=op.visualEvidence;
  if(op.blocker)t.blocker=op.blocker;else delete t.blocker;
  t.lease=null;return {registry:reg,released:t.id}
 }
 throw Error('Unknown action')
}
function selfTest(){
 let n=0;const ok=(v,m)=>{if(!v)throw Error(m);n++};
 const throws=(fn,m)=>{let yes=false;try{fn()}catch{yes=true}ok(yes,m)};
 const mk=(id,resources,depends=[],stage='outstanding')=>({id,lane:'world',priority:1,resources,depends,stage,evidence:[],lease:null});
 const input={schema:1,lanes:{world:'World'},tasks:[mk('A',['shared']),mk('B',['shared']),mk('C',['other']),mk('D',['different'],['A'])]};
 const at=(action,owner,id,more={})=>({action,owner,id,now:1000,...more});
 let r=mutate(input,at('claim','runner1','A'));ok(r.claimed==='A','claim');ok(!input.tasks[0].lease,'immutable input');
 ok(!mutate(r.registry,at('claim','runner2','A')).claimed,'exclusive task');
 ok(!mutate(r.registry,at('claim','runner2','B')).claimed,'exclusive resource');
 ok(!mutate(r.registry,at('claim','runner2','D')).claimed,'dependency blocked');
 let c=mutate(r.registry,at('claim','runner2','C'));ok(c.claimed==='C','independent work');
 throws(()=>mutate(c.registry,at('release','runner2','A')),'foreign release');
 throws(()=>mutate(c.registry,at('release','runner1','A',{stage:'tested'})),'missing evidence');
 throws(()=>mutate(c.registry,at('release','runner1','A',{stage:'accepted',evidence:['test']})),'visual gate');
 throws(()=>mutate(c.registry,at('release','runner1','A',{stage:'accepted',evidence:['test'],visualEvidence:'image'})),'acceptance gate');
 let released=mutate(c.registry,at('release','runner1','A',{stage:'tested',evidence:['commit/test']}));ok(released.registry.tasks[0].stage==='tested','tested evidence');
 ok(mutate(released.registry,at('claim','runner3','B')).claimed==='B','resource released');
 ok(mutate(released.registry,at('claim','runner3','D')).claimed==='D','dependency ready');
 let expired=mutate(r.registry,at('claim','runner3','A',{now:2000000}));ok(expired.claimed==='A','expired lease reclaim');
 throws(()=>mutate(expired.registry,at('renew','runner1','A',{now:2000000})),'old runner rejected');
 ok(mutate(r.registry,at('renew','runner1','A',{now:2000})).registry.tasks[0].lease.until>r.registry.tasks[0].lease.until,'renew');
 throws(()=>validate({...input,tasks:[mk('A',['x'],['B']),mk('B',['y'],['A'])]}),'cycle');
 return n
}
if(typeof module!=='undefined')module.exports={validate,eligible,mutate,selfTest};
if(typeof require!=='undefined'&&require.main===module){
 const fs=require('node:fs');
 if(process.argv[2]==='--self-test')console.log('Workstream registry: '+selfTest()+' assertions passed');
 else{
  const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const op=JSON.parse(process.argv[3]);
  const result=mutate(input,op);
  console.log(JSON.stringify(result,null,2));
 }
}
