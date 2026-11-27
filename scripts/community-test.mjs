import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {handle,validatePresence} from '../community/worker.mjs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys=ON');
sqlite.exec(readFileSync('community/schema.sql','utf8'));
const db={
 prepare(sql){return {bind(...args){return {async all(){return {results:sqlite.prepare(sql).all(...args)}},async first(){return sqlite.prepare(sql).get(...args)??null},async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}}}}},async all(){return {results:sqlite.prepare(sql).all()}}}},
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
 assert.equal(validatePresence({...base,room:'destiny'}),null);
 assert.equal(validatePresence({...base,room:'tea',x:900}),null);
 assert.equal(validatePresence({...base,place:'fortune',room:'tea'}),null);
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
 console.log('PASS: SQLite Worker integration, five sessions, rooms, blocking, reports, moderation, expiry and reactions');
}finally{Date.now=realNow;sqlite.close()}
