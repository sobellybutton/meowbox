/* Optional Cloudflare Worker + D1 backend. Moderation is mandatory.
 * Never send private game notes, birth details, local save or NPC transcripts. */
const DAY=86400000, TTL=30*DAY;

const PRESENCE_TTL=18000, PRESENCE_MIN_INTERVAL=2500;
const worldHeights={fortune:1777,home:1516,island:1527,wonder:1519};
const gestures=['none','wave','cheer','tea'];
const socialRooms={home:['tea','park'],island:['kitchen','arcade']};
const validTraveller=v=>typeof v==='string'&&/^[a-f0-9]{24}$/.test(v);
function validatePresence(v){
 if(!v||!Object.hasOwn(worldHeights,v.place)||!Number.isInteger(v.avatar)||v.avatar<0||v.avatar>3||!Number.isFinite(v.x)||!Number.isFinite(v.y)||v.x<0||v.x>1000||v.y<0||v.y>worldHeights[v.place]||!['up','down','left','right'].includes(v.facing)||typeof v.walking!=='boolean'||!gestures.includes(v.gesture))return null;
 const room=v.room??'';if(typeof room!=='string'||(room&&(!(socialRooms[v.place]||[]).includes(room)||v.x<145||v.x>655||v.y<565||v.y>738)))return null;
 return {room,place:v.place,x:Math.round(v.x),y:Math.round(v.y),avatar:v.avatar,facing:v.facing,walking:Number(v.walking),gesture:v.gesture};
}
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
 const replyTo=value?.replyTo??null;if(replyTo!==null&&!validId(replyTo))return null;
 const place=value?.place??'square';if(!['square','fortune','home','island','wonder'].includes(place))return null;
 return {name,text,replyTo,place}
}
function validId(v){return typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(v)}
function json(value,status=200,headers={}){
 return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})
}
async function readBody(req){
 if(!/^application\/json(?:;|$)/i.test(req.headers.get('Content-Type')||''))throw Error('content-type');
 if(Number(req.headers.get('Content-Length')||0)>4096)throw Error('size');
 const reader=req.body?.getReader();if(!reader)throw Error('empty');
 const chunks=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw Error('size')}chunks.push(value)}
 const buf=new Uint8Array(size);let at=0;for(const chunk of chunks){buf.set(chunk,at);at+=chunk.byteLength}
 const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buf));if(!value||typeof value!=='object'||Array.isArray(value))throw Error('object required');return value
}
async function secureEqual(a,b){const x=await digest(a),y=await digest(b);let diff=0;for(let i=0;i<x.length;i++)diff|=x.charCodeAt(i)^y.charCodeAt(i);return diff===0}
async function handle(req,env){
 const u=new URL(req.url),origin=req.headers.get('Origin'),allowed=env.ALLOWED_ORIGIN||'https://sobellybutton.github.io';
 const cors=origin===allowed?{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Vary':'Origin'}:{};
 const reply=(value,status=200)=>json(value,status,cors);
 if(origin&&origin!==allowed)return reply({error:'origin'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(!env.DB||!env.RATE_SECRET||String(env.RATE_SECRET).length<32||!env.MODERATOR_TOKEN||String(env.MODERATOR_TOKEN).length<32)return reply({error:'not configured'},503);
 if(req.method==='GET'&&u.pathname==='/health'){
  await env.DB.prepare('SELECT reply_to,place FROM messages LIMIT 0').all();await env.DB.prepare('SELECT id FROM submission_events LIMIT 0').all();await env.DB.prepare('SELECT message_id FROM reports LIMIT 0').all();
  let presence=false;if(env.ENABLE_PRESENCE==='true'){try{await env.DB.prepare('SELECT public_id,room FROM presence LIMIT 0').all();await env.DB.prepare('SELECT target_id FROM presence_blocks LIMIT 0').all();await env.DB.prepare('SELECT target_id FROM presence_reports LIMIT 0').all();await env.DB.prepare('SELECT public_id FROM presence_bans LIMIT 0').all();presence=true}catch{}}
  let reactions=false;try{await env.DB.prepare('SELECT kind FROM reactions LIMIT 0').all();reactions=true}catch{}
  return reply({service:'meowbox-community',version:1,moderated:true,replies:true,places:true,presence,reactions,sharedRooms:presence,presenceModeration:presence});
 }
 const now=Date.now(),cutoff=now-TTL;
 const auth=req.headers.get('Authorization')||'',token=auth.startsWith('Bearer ')?auth.slice(7):'';
 const admin=u.pathname.startsWith('/moderation/');
 if(admin){
  // Admin calls are server-side CLI only; never expose the secret to a browser.
  if(origin||!env.MODERATOR_TOKEN||String(env.MODERATOR_TOKEN).length<32||!await secureEqual(token,env.MODERATOR_TOKEN))return reply({error:'forbidden'},403);
 }else if(!/^[a-f0-9]{48}$/.test(token))return reply({error:'invalid session'},401);
 const owner=await digest('session:'+token);
 const db=env.DB;

 if(u.pathname==='/presence/block'||u.pathname==='/presence/report'){
  if(env.ENABLE_PRESENCE!=='true'||req.method!=='POST')return reply({error:'unavailable'},503);
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  const self=(await rateHash(env.RATE_SECRET,'public|'+owner)).slice(0,24);
  if(!validTraveller(body?.id)||body.id===self)return reply({error:'invalid traveller'},400);
  if(u.pathname.endsWith('/block')){
   if(typeof body.blocked!=='boolean')return reply({error:'invalid action'},400);
   if(!body.blocked){await db.prepare('DELETE FROM presence_blocks WHERE owner=? AND target_id=?').bind(owner,body.id).run();return reply({ok:true})}
   const result=await db.prepare("INSERT OR IGNORE INTO presence_blocks(owner,target_id,created) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM presence_blocks WHERE owner=?)<100").bind(owner,body.id,now,owner).run();
   if(!result.meta.changes&&!await db.prepare('SELECT 1 FROM presence_blocks WHERE owner=? AND target_id=?').bind(owner,body.id).first())return reply({error:'block limit'},429);
   return reply({ok:true});
  }
  if(!['harassment','spam','other'].includes(body.reason))return reply({error:'invalid reason'},400);
  const result=await db.prepare("INSERT OR IGNORE INTO presence_reports(reporter,target_id,reason,created) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM presence WHERE public_id=? AND updated>=?) AND (SELECT COUNT(*) FROM presence_reports WHERE reporter=? AND created>=?)<10").bind(owner,body.id,body.reason,now,body.id,now-PRESENCE_TTL,owner,now-DAY).run();
  return reply({ok:true,recorded:!!result.meta.changes});
 }
 if(req.method==='GET'&&u.pathname==='/moderation/presence'){
  const result=await db.prepare("SELECT target_id AS id,reason,COUNT(*) AS reports,MAX(created) AS lastReported FROM presence_reports GROUP BY target_id,reason ORDER BY lastReported DESC LIMIT 100").all();return reply({reports:result.results});
 }
 if(req.method==='POST'&&u.pathname==='/moderation/presence'){
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  if(!validTraveller(body?.id)||!Number.isInteger(body.hours)||body.hours<0||body.hours>720)return reply({error:'invalid decision'},400);
  if(body.hours===0)await db.prepare('DELETE FROM presence_bans WHERE public_id=?').bind(body.id).run();
  else await db.batch([db.prepare("INSERT INTO presence_bans(public_id,until) VALUES(?,?) ON CONFLICT(public_id) DO UPDATE SET until=excluded.until").bind(body.id,now+body.hours*3600000),db.prepare('DELETE FROM presence WHERE public_id=?').bind(body.id)]);
  return reply({ok:true});
 }

 if(u.pathname==='/presence'){
  if(env.ENABLE_PRESENCE!=='true')return reply({error:'presence disabled'},503);
  if(req.method==='DELETE'){await db.prepare('DELETE FROM presence WHERE owner=?').bind(owner).run();return reply({ok:true})}
  if(req.method!=='POST')return reply({error:'method'},405);
  let value;try{value=validatePresence(await readBody(req))}catch{return reply({error:'invalid body'},400)}
  if(!value)return reply({error:'invalid presence'},400);
  const since=now-PRESENCE_TTL,rate=await rateHash(env.RATE_SECRET,'presence|'+(req.headers.get('CF-Connecting-IP')||'unknown')),id=(await rateHash(env.RATE_SECRET,'public|'+owner)).slice(0,24);
  // Stable pseudonym derived server-side; do not expose bearer token, owner hash or IP.
  if(await db.prepare('SELECT 1 FROM presence_bans WHERE public_id=? AND until>?').bind(id,now).first())return reply({error:'presence restricted'},403);
  const written=await db.prepare("INSERT INTO presence(owner,public_id,rate_key,place,room,x,y,avatar,facing,walking,gesture,updated) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM presence WHERE rate_key=? AND updated>=? AND owner<>?)<8 AND (SELECT COUNT(*) FROM presence WHERE updated>=? AND owner<>?)<100 ON CONFLICT(owner) DO UPDATE SET place=excluded.place,room=excluded.room,x=excluded.x,y=excluded.y,avatar=excluded.avatar,facing=excluded.facing,walking=excluded.walking,gesture=excluded.gesture,updated=excluded.updated,rate_key=excluded.rate_key WHERE presence.updated<=?").bind(owner,id,rate,value.place,value.room,value.x,value.y,value.avatar,value.facing,value.walking,value.gesture,now,rate,since,owner,since,owner,now-PRESENCE_MIN_INTERVAL).run();
  if(!written.meta.changes)return reply({error:'presence rate limited'},429);
  const result=await db.prepare("SELECT p.public_id AS id,p.place,p.room,p.x,p.y,p.avatar,p.facing,p.walking,p.gesture,p.updated FROM presence p WHERE p.updated>=? AND p.place=? AND p.room=? AND p.owner<>? AND NOT EXISTS(SELECT 1 FROM presence_blocks b WHERE (b.owner=? AND b.target_id=p.public_id) OR (b.owner=p.owner AND b.target_id=?)) AND NOT EXISTS(SELECT 1 FROM presence_bans z WHERE z.public_id=p.public_id AND z.until>?) ORDER BY p.updated DESC LIMIT 30").bind(since,value.place,value.room,owner,owner,id,now).all();
  return reply({self:id,peers:result.results});
 }
 if(req.method==='GET'&&u.pathname==='/messages'){
  const place=u.searchParams.get('place')||'square';if(!['square','fortune','home','island','wonder'].includes(place))return reply({error:'invalid place'},400);
  const r=await db.prepare("SELECT m.id,m.name,m.text,m.created,m.reply_to AS replyTo,p.name AS replyName FROM messages m LEFT JOIN messages p ON p.id=m.reply_to AND p.status='approved' AND p.created>=? AND p.place=m.place WHERE m.status='approved' AND m.created>=? AND m.place=? ORDER BY m.created DESC LIMIT 60").bind(cutoff,cutoff,place).all();
  const messages=r.results.reverse();
  try{
   const reactions=await db.prepare("SELECT r.message_id,r.kind,COUNT(*) AS count,MAX(CASE WHEN r.owner=? THEN 1 ELSE 0 END) AS mine FROM reactions r JOIN messages m ON m.id=r.message_id WHERE m.status='approved' AND m.created>=? AND m.place=? GROUP BY r.message_id,r.kind").bind(owner,cutoff,place).all();
   const byId=new Map(messages.map(m=>[m.id,m]));for(const v of reactions.results){const m=byId.get(v.message_id);if(!m)continue;m.reactions??={};m.reactions[v.kind]=Number(v.count);if(v.mine)m.myReaction=v.kind}
  }catch{/* old schema remains readable until migration */}
  return reply({messages});
 }

 if(req.method==='POST'&&u.pathname==='/reactions'){
  let body;try{body=await readBody(req)}catch{return reply({error:'invalid body'},400)}
  if(!validId(body?.id)||!['laugh','heart','same'].includes(body?.kind))return reply({error:'invalid reaction'},400);
  const r=await db.prepare("INSERT INTO reactions(message_id,owner,kind,created) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM messages WHERE id=? AND status='approved' AND created>=?) AND ((SELECT COUNT(*) FROM reactions WHERE owner=? AND created>=?)<30 OR EXISTS(SELECT 1 FROM reactions WHERE message_id=? AND owner=?)) ON CONFLICT(message_id,owner) DO UPDATE SET kind=excluded.kind,created=excluded.created WHERE reactions.created<=?").bind(body.id,owner,body.kind,now,body.id,cutoff,owner,now-DAY,body.id,owner,now-3000).run();
  if(!r.meta.changes)return reply({error:'reaction unavailable or rate limited'},429);
  return reply({ok:true});
 }
 if(req.method==='GET'&&u.pathname==='/mine'){
  const r=await db.prepare("SELECT id,name,text,created,status,place FROM messages WHERE owner=? AND created>=? ORDER BY created DESC LIMIT 60").bind(owner,cutoff).all();return reply({messages:r.results});
 }
 if(req.method==='POST'&&u.pathname==='/messages'){
  let value;try{value=validatePost(await readBody(req))}catch{return reply({error:'invalid body'},400)}
  if(!value)return reply({error:'invalid text or personal details'},400);
  if(value.replyTo&&!await db.prepare("SELECT id FROM messages WHERE id=? AND status='approved' AND created>=? AND place=?").bind(value.replyTo,cutoff,value.place).first())return reply({error:'reply unavailable'},409);
  const ip=req.headers.get('CF-Connecting-IP')||'unknown',rate=await rateHash(env.RATE_SECRET,ip+'|'+Math.floor(now/DAY)),id=crypto.randomUUID();
  // Atomic write condition enforces session and daily network limits.
  const [limit,r]=await db.batch([
   db.prepare("INSERT INTO submission_events(id,owner,rate_key,created) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM submission_events WHERE owner=? AND created>?)<5 AND (SELECT COUNT(*) FROM submission_events WHERE rate_key=? AND created>?)<20 AND (SELECT COUNT(*) FROM submission_events WHERE owner=? AND created>?)=0 AND (? IS NULL OR EXISTS(SELECT 1 FROM messages WHERE id=? AND status='approved' AND created>=? AND place=?))").bind(id,owner,rate,now,owner,now-DAY,rate,now-DAY,owner,now-15000,value.replyTo,value.replyTo,cutoff,value.place),
   db.prepare("INSERT INTO messages(id,owner,rate_key,name,text,created,status,reply_to,place) SELECT ?,?,?,?,?,?,'pending',?,? WHERE EXISTS(SELECT 1 FROM submission_events WHERE id=?)").bind(id,owner,rate,value.name,value.text,now,value.replyTo,value.place,id)
  ]);
  if(!limit.meta.changes||!r.meta.changes){if(value.replyTo&&!await db.prepare("SELECT id FROM messages WHERE id=? AND status='approved' AND created>=? AND place=?").bind(value.replyTo,cutoff,value.place).first())return reply({error:'reply unavailable'},409);return reply({error:'rate limited'},429)}
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
  const r=await db.prepare("INSERT OR IGNORE INTO reports(message_id,reporter,created) SELECT id,?,? FROM messages WHERE id=? AND status='approved' AND created>=? AND owner<>? AND (SELECT COUNT(*) FROM reports WHERE reporter=? AND created>?)<10").bind(owner,now,body.id,cutoff,owner,owner,now-DAY).run();
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
async function purge(env){const now=Date.now();if(env.ENABLE_PRESENCE==='true')await env.DB.batch([env.DB.prepare('DELETE FROM presence WHERE updated<?').bind(now-PRESENCE_TTL),env.DB.prepare('DELETE FROM presence_reports WHERE created<?').bind(now-TTL),env.DB.prepare('DELETE FROM presence_bans WHERE until<=?').bind(now)]);await env.DB.batch([env.DB.prepare('DELETE FROM messages WHERE created<?').bind(now-TTL),env.DB.prepare('DELETE FROM submission_events WHERE created<?').bind(now-DAY),env.DB.prepare('DELETE FROM reports WHERE created<?').bind(now-TTL)])}
export {validatePost,normalized,validId,validatePresence,handle};
export default {async fetch(req,env){try{return await handle(req,env)}catch{return json({error:'temporarily unavailable'},503)}},async scheduled(event,env,ctx){ctx.waitUntil(purge(env))}};
