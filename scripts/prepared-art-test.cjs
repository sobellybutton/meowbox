'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p)),json=p=>JSON.parse(read(p));
const hash=(algorithm,buf)=>crypto.createHash(algorithm).update(buf).digest('hex');
const blob=buf=>hash('sha1',Buffer.concat([Buffer.from('blob '+buf.length+'\0'),buf]));
let count=0,checks=0;
const ck=(v,m)=>{assert(v,m);checks++};
function bounds(s,box,label){
 const [w,h]=s,[l,t,r,b]=box;
 ck(s.length===2&&s.every(n=>Number.isInteger(n)&&n>0),label+' canvas');
 ck(box.length===4&&box.every(Number.isInteger)&&0<=l&&0<=t&&l<r&&t<b&&r<=w&&b<=h,label+' alpha bounds');
}
function verify(p,s,sha,git,original){
 const buf=read(p);
 ck(hash('sha256',buf)===sha,p+' SHA256');
 ck(blob(buf)===git,p+' Git blob');
 ck(buf.equals(read(original)),p+' exact source bytes');
 if(p.endsWith('.png')){
  ck(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&buf.toString('ascii',12,16)==='IHDR',p+' PNG header');
  ck(buf.readUInt32BE(16)===s[0]&&buf.readUInt32BE(20)===s[1],p+' PNG dimensions');
  ck(buf[25]===6,p+' PNG RGBA');
 }else{
  ck(buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,16)==='WEBPVP8X',p+' WebP header');
  ck((buf[20]&16)!==0,p+' WebP alpha flag');
  ck(buf.readUIntLE(24,3)+1===s[0]&&buf.readUIntLE(27,3)+1===s[1],p+' WebP dimensions');
 }
 count++;
}
const dir='assets/visual/painted/food-props',food=json(dir+'/manifest.json'),original=json(food.source),seen=new Set();
ck(food.schema===1&&Object.keys(food.assets).length>=49,'food candidate inventory');
for(const [id,a] of Object.entries(food.assets)){
 const old=original.assets.find(x=>x.id===id);
 ck(old&&old.file===a.file&&old.sha256===a.sha256&&JSON.stringify(old.size)===JSON.stringify(a.size)&&JSON.stringify(old.alpha_bounds)===JSON.stringify(a.alphaBounds),id+' source correspondence');
 ck(/^[a-zA-Z0-9_-]+\.png$/.test(a.file)&&!seen.has(a.file),id+' unique filename');seen.add(a.file);
 bounds(a.size,a.alphaBounds,id);
 const [w,h]=a.size,[l,t,r,b]=a.alphaBounds;
 ck(a.groundAnchor.length===2&&Math.abs(a.groundAnchor[0]-(l+r)/2/w)<1e-9&&Math.abs(a.groundAnchor[1]-b/h)<1e-9,id+' ground anchor');
 verify(dir+'/'+a.file,a.size,a.sha256,a.sourceBlob,path.posix.dirname(food.source)+'/'+old.file);
}
const hosts=json('assets/visual/painted/host-pose-candidates.json'),hostSource=json(hosts.source);
let poses=0;
for(const [id,ch] of Object.entries(hosts.characters)){
 ck(blob(read('assets/visual/painted/'+id+'/standing.webp'))===ch.standingReference,id+' standing identity');
 for(const [pose,a] of Object.entries(ch.poses)){
  const old=hostSource.assets.find(x=>x.git_blob_sha1===a.sourceBlob);
  ck(old&&old.character===id&&old.pose===pose&&old.reference_blob===ch.standingReference&&old.sha256===a.sha256&&old.status.startsWith('reference-matched'),pose+' preferred source');
  ck(a.path==='assets/visual/painted/'+id+'/pose-candidates/'+pose+'.webp',pose+' candidate path');
  ck(a.canvas[0]===old.width&&a.canvas[1]===old.height&&JSON.stringify(a.visibleAlphaBounds)===JSON.stringify(old.visible_alpha_bbox),pose+' source geometry');
  bounds(a.canvas,a.visibleAlphaBounds,pose);
  verify(a.path,a.canvas,a.sha256,a.sourceBlob,old.path);poses++;
 }
}
ck(poses>=6&&hosts.excludedAlternatives===hostSource.alternative_count,'preferred pose inventory');
console.log('PASS '+checks+' prepared art integrity checks across '+count+' files; no gameplay visual acceptance');
