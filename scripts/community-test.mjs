import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker,{handle,validatePresence} from '../community/worker.mjs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys=ON');
sqlite.exec(readFileSync('community/schema.sql','utf8'));
const db={
 prepare(sql){const statement=(args=[])=>({bind(...values){return statement(values)},async all(){return {results:sqlite.prepare(sql).all(...args)}},async first(){return sqlite.prepare(sql).get(...args)??null},async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}}}});return statement()},
 async batch(ops){sqlite.exec('BEGIN');try{const out=[];for(const op of ops)out.push(await op.run());sqlite.exec('COMMIT');return out}catch(e){sqlite.exec('ROLLBACK');throw e}}
};
const env={DB:db,RATE_SECRET:'test-rate-secret'.repeat(4),MODERATOR_TOKEN:'test-admin-token'.repeat(4),ENABLE_PRESENCE:'true',ALLOWED_ORIGIN:'https://example.test'};
const tokens=Array.from({length:9},(_,i)=>(i+1).toString(16).repeat(48));
let now=Date.now();const realNow=Date.now;Date.now=()=>now;
const step=(ms=5000)=>{now+=ms};
async function call(path,token=tokens[0],body,method=body?'POST':'GET',admin=false){
 const headers={'Authorization':'Bearer '+(admin?env.MODERATOR_TOKEN:token),'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'};
 if(!admin)headers.Origin=env.ALLOWED_ORIGIN;
 const res=await handle(new Request('https://example.test'+path,{method,headers,...(body?{body:JSON.stringify(body)}:{})}),env);
 return {status:res.status,data:await res.json()};
}
const base={place:'home',room:'',x:520,y:680,avatar:1,facing:'up',walking:false,gesture:'none'};
try{
 assert.equal((await call('/health')).data.sharedRooms,true);
 // A district must be a string, not a coercible JSON array.
 for(const place of [['home'],{},null,42,'__proto__']){
  assert.equal(validatePresence({...base,place}),null);
  assert.equal((await call('/presence',tokens[0],{...base,place})).status,400);
 }
 // Validate the coordinates that peers actually receive, including
 // fractional inputs around the painted corridor boundaries.
 for(const [room,place] of [['tea','home'],['park','home'],['arcade','island'],['kitchen','island']]){
  for(let x=280;x<=540;x+=.37)for(let y=450;y<=780;y+=2.31){
   const q=validatePresence({...base,room,place,x,y});
   if(q)assert.ok(validatePresence({...base,room,place,x:q.x,y:q.y}),'Published point must remain valid');
  }
 }
 assert.equal(validatePresence({...base,room:'destiny'}),null);
 assert.equal(validatePresence({...base,room:'tea',x:900}),null);
 assert.equal(validatePresence({...base,place:'fortune',room:'tea'}),null);
 // Verify sampled current painted-room lanes, including points beyond
 // the old rectangle. The frontend sends rounded world coordinates.
 const painted={exports:{}};
 new Function('module',readFileSync('assets/visual/painted/interior-layouts.js','utf8'))(painted);
 for(const [room,place] of [['tea','home'],['park','home'],['arcade','island']]){
  const lane=painted.exports.rooms[room].lane;
  let extended=0;
  for(let i=1;i<lane.length;i++)for(let step=0;step<=20;step++){
   const f=step/20,[ay,al,ar]=lane[i-1],[by,bl,br]=lane[i];
   const ny=ay+(by-ay)*f,l=al+(bl-al)*f,r=ar+(br-ar)*f;
   for(const x0 of [l,(l+r)/2,r]){
    const x=Math.round(245+550*928/1648*x0),y=Math.round(235+550*ny);
    if(y<565||y>738)extended++;
    assert.ok(validatePresence({...base,place,room,x,y}),'Rejected mapped '+room+' '+x+','+y);
   }
  }
  assert.ok(extended>0);
  for(const [x,y] of [[5,450],[900,500],[400,20],[400,850]])assert.equal(validatePresence({...base,place,room,x,y}),null);
  assert.equal(validatePresence({...base,place:'fortune',room,x:400,y:680}),null);
 }
 assert.equal(validatePresence({...base,place:'island',room:'kitchen',x:400,y:500}),null);
 assert.equal(validatePresence({...base,place:'home',room:'wishes',x:400,y:680}),null);

 const people=[];
 for(const token of tokens.slice(0,5)){
  const result=await call('/presence',token,base);assert.equal(result.status,200);people.push(result.data.self);
 }
 assert.equal(new Set(people).size,5);
 step();let a=await call('/presence',tokens[0],base);assert.equal(a.data.peers.length,4);
 assert.ok(a.data.peers.every(p=>!('owner'in p)&&!('rate_key'in p)&&!('name'in p)));
 assert.equal((await call('/presence',tokens[0],base)).status,429);
 step();assert.equal((await call('/presence',tokens[1],{...base,room:'tea'})).data.peers.length,0);
 assert.equal((await call('/presence',tokens[0],{...base,room:'tea'})).data.peers.length,1);
 assert.equal((await call('/presence/block',tokens[0],{id:people[1],blocked:true})).status,200);
 step();assert.equal((await call('/presence',tokens[1],{...base,room:'tea'})).data.peers.length,0);
 assert.equal((await call('/presence',tokens[0],{...base,room:'tea'})).data.peers.length,0);
 assert.equal((await call('/presence/block',tokens[0],{id:people[1],blocked:false})).status,200);
 step();assert.equal((await call('/presence',tokens[0],{...base,room:'tea'})).data.peers.length,1);
 assert.equal((await call('/presence/report',tokens[0],{id:people[1],reason:'harassment'})).data.recorded,true);
 assert.equal((await call('/moderation/presence',tokens[0],undefined,'GET',true)).data.reports.length,1);
 assert.equal((await call('/moderation/presence',tokens[0],{id:people[1],hours:1},'POST',true)).status,200);
 step();assert.equal((await call('/presence',tokens[1],base)).status,403);
 assert.equal((await call('/presence',tokens[0],{...base,room:'tea'})).data.peers.length,0);
 assert.equal((await call('/presence',tokens[0],undefined,'DELETE')).status,200);
 step(19000);assert.equal((await call('/presence',tokens[2],base)).data.peers.length,0);
 assert.equal((await call('/report',tokens[0],{id:'-'.repeat(36)})).status,400);
 assert.equal((await call('/presence',tokens[0],[])).status,400);
 const post=await call('/messages',tokens[0],{name:'Tea Cat',text:'A little break',place:'square'});
 assert.equal(post.status,201);const id=post.data.id;
 assert.equal((await call('/reactions',tokens[2],{id,kind:'heart'})).status,429);
 assert.equal((await call('/moderation/decide',tokens[0],{id,status:'approved'},'POST',true)).status,200);
 assert.equal((await call('/reactions',tokens[2],{id,kind:'heart'})).status,200);
 assert.equal((await call('/reactions',tokens[2],{id,kind:'laugh'})).status,429);
 assert.equal((await call('/reactions',tokens[3],{id,kind:'heart'})).status,200);
 const feed=await call('/messages?place=square',tokens[2]);assert.equal(feed.data.messages[0].reactions.heart,2);assert.equal(feed.data.messages[0].myReaction,'heart');
 step();assert.equal((await call('/reactions',tokens[2],{id,kind:'laugh'})).status,200);
 const updated=await call('/messages?place=square',tokens[2]);assert.equal(updated.data.messages[0].reactions.heart,1);assert.equal(updated.data.messages[0].reactions.laugh,1);
 assert.equal((await call('/messages',tokens[4],{name:'Guest',text:'A reply elsewhere',place:'home',replyTo:id})).status,409);
 const reply=await call('/messages',tokens[4],{name:'Guest',text:'A reply here',place:'square',replyTo:id});
 assert.equal(reply.status,201);
 await call('/moderation/decide',tokens[0],{id:reply.data.id,status:'approved'},'POST',true);
 assert.equal((await call('/messages?place=square',tokens[2])).data.messages.find(m=>m.id===reply.data.id).replyName,'Tea Cat');
 step(31*86400000);
 assert.equal((await call('/report',tokens[2],{id})).data.recorded,false);
 assert.equal((await call('/messages?place=square',tokens[2])).data.messages.length,0);
 // Rolling network quota must survive UTC midnight. Prior posts have expired.
 now=(Math.floor(now/86400000)+1)*86400000-100000;
 for(let round=0;round<5;round++){
  for(const token of tokens.slice(0,4)){
   const post=await call('/messages',token,{name:'Tea Cat',text:'Quota test',place:'square'});
   assert.equal(post.status,201);
  }
  step(16000);
 }
 step(25000);
 assert.equal((await call('/messages',tokens[5],{name:'Guest',text:'After midnight',place:'square'})).status,429);
 step(86400000);
 assert.equal((await call('/messages',tokens[5],{name:'Guest',text:'After a full day',place:'square'})).status,201);
 // Simulate a moderator ban committed between the first read and write.
 const initial=await call('/presence',tokens[6],base);
 assert.equal(initial.status,200);
 const target=initial.data.self;
 step();
 const realPrepare=db.prepare;
 let injected=false;
 db.prepare=function(sql){
  if(!injected&&sql.startsWith('INSERT INTO presence(owner,')){
   injected=true;
   sqlite.prepare('INSERT INTO presence_bans(public_id,until) VALUES(?,?)').run(target,now+3600000);
   sqlite.prepare('DELETE FROM presence WHERE public_id=?').run(target);
  }
  return realPrepare.call(this,sql)
 };
 try{
  assert.equal((await call('/presence',tokens[6],base)).status,403);
  assert.ok(injected);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM presence WHERE public_id=?').get(target).n,0);
 }finally{db.prepare=realPrepare}
 // Scheduled privacy cleanup must still run when presence is disabled.
 const cleanup=async (override={})=>{let pending;await worker.scheduled({}, {...env,...override},{waitUntil(p){pending=p}});await pending};
 const countPositions=()=>sqlite.prepare('SELECT COUNT(*) AS n FROM presence').get().n;
 step(20000);const freshA=await call('/presence',tokens[7],base);assert.equal(freshA.status,200);
 step(20000);const freshB=await call('/presence',tokens[8],base);assert.equal(freshB.status,200);
 await cleanup();
 assert.equal(countPositions(),1);
 assert.equal(sqlite.prepare('SELECT public_id FROM presence').get().public_id,freshB.data.self);
 const activeBan='a'.repeat(24),expiredBan='b'.repeat(24);
 sqlite.prepare('INSERT INTO presence_bans(public_id,until) VALUES(?,?)').run(activeBan,now+3600000);
 sqlite.prepare('INSERT INTO presence_bans(public_id,until) VALUES(?,?)').run(expiredBan,now-1);
 sqlite.prepare('INSERT INTO presence_reports(reporter,target_id,reason,created) VALUES(?,?,?,?)').run('test-old-reporter',activeBan,'spam',now-31*86400000);
 sqlite.prepare('INSERT INTO presence_blocks(owner,target_id,created) VALUES(?,?,?)').run('test-block-owner',activeBan,now);
 await cleanup({ENABLE_PRESENCE:'false'});
 assert.equal(countPositions(),0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM presence_bans WHERE public_id=?').get(activeBan).n,1);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM presence_bans WHERE public_id=?').get(expiredBan).n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM presence_reports WHERE reporter=?').get('test-old-reporter').n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM presence_blocks WHERE owner=?').get('test-block-owner').n,1);
 sqlite.exec('DROP TABLE presence; DROP TABLE presence_reports; DROP TABLE presence_bans; DROP TABLE presence_blocks;');
 await cleanup({ENABLE_PRESENCE:'false'});
 console.log('PASS: SQLite Worker integration, five sessions, rooms, blocking, reports, moderation, expiry and reactions');
}finally{Date.now=realNow;sqlite.close()}
