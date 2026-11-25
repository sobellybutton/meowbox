/* Optional Cloudflare Worker + D1 backend. Moderation is mandatory.
 * Never send private game notes, birth details, local save or NPC transcripts. */
const DAY=86400000, TTL=30*DAY;
const enc=new TextEncoder();
const hex=b=>Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
async function digest(v){return hex(await crypto.subtle.digest('SHA-256',enc.encode(v)))}
async function rateHash(secret,value){
 const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return hex(await crypto.subtle.sign('HMAC',key,enc.encode(value)))
}
function normalized(v,max){
 if(typeof v!=='string')return '';
 const s=v.normalize('NFKC').replace(/[\p{Cc}\p{Cf}]/gu,' ').replace(/\s+/gu,' ').trim();
 return s&&Array.from(s).length<=max?s:''
}
function validatePost(value){
 const name=normalized(value?.name,24),text=normalized(value?.text,180);
 if(!name||!text)return null;
 // Basic PII/link filter; manual moderation still required.
 if(/https?:\/\/|www\.|\b[^\s@]+@[^\s@]+\.[^\s@]+\b|(?:\+?\d[\s().-]*){8,}/iu.test(name+' '+text))return null;
 return {name,text}
}
function validId(v){return typeof v==='string'&&/^[a-f0-9-]{36}$/.test(v)}
function json(value,status=200,headers={}){
 return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})
}
async function readBody(req){
 if(!/^application\/json(?:;|$)/i.test(req.headers.get('Content-Type')||''))throw Error('content-type');
 if(Number(req.headers.get('Content-Length')||0)>4096)throw Error('size');
 const reader=req.body?.getReader();if(!reader)throw Error('empty');
 const chunks=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw Error('size')}chunks.push(value)}
 const buf=new Uint8Array(size);let at=0;for(const chunk of chunks){buf.set(chunk,at);at+=chunk.byteLength}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buf))
}
async function secureEqual(a,b){const x=await digest(a),y=await digest(b);let diff=0;for(let i=0;i<x.length;i++)diff|=x.charCodeAt(i)^y.charCodeAt(i);return diff===0}
async function handle(req,env){
 const u=new URL(req.url),origin=req.headers.get('Origin'),allowed=env.ALLOWED_ORIGIN||'https://sobellybutton.github.io';
 const cors=origin===allowed?{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Vary':'Origin'}:{};
 const reply=(value,status=200)=>json(value,status,cors);
 if(origin&&origin!==allowed)return reply({error:'origin'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(!env.DB||!env.RATE_SECRET||String(env.RATE_SECRET).length<32)return reply({error:'not configured'},503);
 const now=Date.now(),cutoff=now-TTL;
 const auth=req.headers.get('Authorization')||'',token=auth.startsWith('Bearer ')?auth.slice(7):'';
 const admin=u.pathname.startsWith('/moderation/');
 if(admin){
  // Admin calls are server-side CLI only; never expose the secret to a browser.
  if(origin||!env.MODERATOR_TOKEN||String(env.MODERATOR_TOKEN).length<32||!await secureEqual(token,env.MODERATOR_TOKEN))return reply({error:'forbidden'},403);
 }else if(!/^[a-f0-9]{48}$/.test(token))return reply({error:'invalid session'},401);
 const owner=await digest('session:'+token);
 const db=env.DB;
 if(req.method==='GET'&&u.pathname==='/messages'){
  const r=await db.prepare("SELECT id,name,text,created FROM messages WHERE status='approved' AND created>=? ORDER BY created DESC LIMIT 60").bind(cutoff).all();
  return reply({messages:r.results.reverse()});
 }
 if(req.method==='GET'&&u.pathname==='/mine'){
  const r=await db.prepare("SELECT id,name,text,created,status FROM messages WHERE owner=? AND created>=? ORDER BY created DESC LIMIT 60").bind(owner,cutoff).all();return reply({messages:r.results});
 }
 if(req.method==='POST'&&u.pathname==='/messages'){
  let value;try{value=validatePost(await readBody(req))}catch{return reply({error:'invalid body'},400)}
  if(!value)return reply({error:'invalid text or personal details'},400);
  const ip=req.headers.get('CF-Connecting-IP')||'unknown',rate=await rateHash(env.RATE_SECRET,ip+'|'+Math.floor(now/DAY)),id=crypto.randomUUID();
  // Atomic write condition enforces session and daily network limits.
  const r=await db.prepare("INSERT INTO messages(id,owner,rate_key,name,text,created,status) SELECT ?,?,?,?,?,?,'pending' WHERE (SELECT COUNT(*) FROM messages WHERE owner=? AND created>?)<5 AND (SELECT COUNT(*) FROM messages WHERE rate_key=? AND created>?)<20 AND (SELECT COUNT(*) FROM messages WHERE owner=? AND created>?)=0").bind(id,owner,rate,value.name,value.text,now,owner,now-DAY,rate,now-DAY,owner,now-15000).run();
  if(!r.meta.changes)return reply({error:'rate limited'},429);
  return reply({id,status:'pending'},201);
 }
 if(req.method==='DELETE'&&u.pathname==='/mine'){
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  if(!validId(body?.id))return reply({error:'invalid id'},400);
  await db.prepare('DELETE FROM messages WHERE id=? AND owner=?').bind(body.id,owner).run();return reply({ok:true})
 }
 if(req.method==='POST'&&u.pathname==='/report'){
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  if(!validId(body?.id))return reply({error:'invalid id'},400);
  const r=await db.prepare("INSERT OR IGNORE INTO reports(message_id,reporter,created) SELECT id,?,? FROM messages WHERE id=? AND status='approved' AND owner<>? AND (SELECT COUNT(*) FROM reports WHERE reporter=? AND created>?)<10").bind(owner,now,body.id,owner,owner,now-DAY).run();
  return reply({ok:true,recorded:!!r.meta.changes})
 }
 if(req.method==='GET'&&u.pathname==='/moderation/queue'){
  const r=await db.prepare("SELECT m.id,m.name,m.text,m.created,m.status,(SELECT COUNT(*) FROM reports WHERE message_id=m.id) AS reports FROM messages m WHERE m.created>=? AND (m.status='pending' OR EXISTS(SELECT 1 FROM reports WHERE message_id=m.id)) ORDER BY reports DESC,m.created ASC LIMIT 100").bind(cutoff).all();
  return reply({messages:r.results})
 }
 if(req.method==='POST'&&u.pathname==='/moderation/decide'){
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  if(!validId(body?.id)||!['approved','rejected'].includes(body?.status))return reply({error:'invalid decision'},400);
  await db.batch([db.prepare('UPDATE messages SET status=?,moderated=? WHERE id=? AND created>=?').bind(body.status,now,body.id,cutoff),db.prepare('DELETE FROM reports WHERE message_id=?').bind(body.id)]);return reply({ok:true})
 }
 return reply({error:'not found'},404)
}
async function purge(env){await env.DB.prepare('DELETE FROM messages WHERE created<?').bind(Date.now()-TTL).run()}
export {validatePost,normalized,validId,handle};
export default {async fetch(req,env){try{return await handle(req,env)}catch{return json({error:'temporarily unavailable'},503)}},async scheduled(event,env,ctx){ctx.waitUntil(purge(env))}};
