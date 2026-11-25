const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {assembleMeowBox,MEOW_ART_COUNT}=require('../src/assemble.js');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parts=Array.from({length:9},(_,i)=>{const s=read('preview-v9-1/part0'+i+'.js');return JSON.parse(s.slice(s.indexOf('(')+1,s.lastIndexOf(')')))});
const original=[...parts.join('').matchAll(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/g)];
if(original.length!==MEOW_ART_COUNT)throw Error('Unexpected original image count');
let bytes=0;
for(let i=0;i<original.length;i++){
 const name='assets/art/'+String(i).padStart(3,'0')+'.webp';
 const extracted=fs.readFileSync(path.join(root,name));
 if(!extracted.equals(Buffer.from(original[i][1],'base64')))throw Error('Artwork differs: '+name);
 bytes+=extracted.length;
}
const scripts=['engine','extensions','startup'].map(x=>read('src/'+x+'.js')),shell=read('src/shell.html');
require('./quality-checks.cjs')(scripts[1]);
const painted=JSON.parse(read('assets/visual/painted/runtime.json')),crypto=require('node:crypto');
if(painted.version!==1||!painted.residents||Array.isArray(painted.residents)||typeof painted.residents!=='object')throw Error('Invalid painted runtime manifest');
const allowedPainted=new Set(['temple-keeper','master-yue','fortune-teller','auntie-mei','wang-laoban','grandma']);
let paintedCount=0;
for(const [key,entry] of Object.entries(painted.residents)){
 if(!allowedPainted.has(key))throw Error('Unexpected painted resident: '+key);
 for(const kind of ['standing','warm']){
  const v=entry[kind],expected='assets/visual/painted/'+key+'/'+(kind==='standing'?'standing.webp':'expressions/warm.webp');
  if(v?.path!==expected||!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<1||v.height<1||v.width>2048||v.height>2048)throw Error('Invalid painted record '+expected);
  const raw=fs.readFileSync(path.join(root,expected));
  if(raw.subarray(0,4).toString()!=='RIFF'||raw.subarray(8,12).toString()!=='WEBP'||crypto.createHash('sha256').update(raw).digest('hex')!==v.sha256)throw Error('Painted artwork failed checksum: '+expected);
  paintedCount++;
 }
}
console.log('PASS: '+paintedCount+' optional full-size painted artworks checked (empty manifest retains existing atlas).');

// Validate the canonical registry before rendering or assigning later portrait anchors.
const mapDeclaration=scripts[0].match(/const maps=(\{[^\n]+\});/);
if(!mapDeclaration)throw Error('Canonical map registry not found');
const registry=new vm.Script('('+mapDeclaration[1]+')').runInNewContext({}, {timeout:1000});
const expectedWorlds=['fortune','home','island','wonder'];
if(Object.keys(registry).sort().join(',')!==expectedWorlds.sort().join(','))throw Error('Unexpected destination registry');
const stationOwners=new Map();
for(const [world,definition] of Object.entries(registry)){
 for(const [id,x,y,en,zh] of definition.st){
  if(stationOwners.has(id))throw Error('Duplicate station '+id+' in '+stationOwners.get(id)+' and '+world);
  if(!Number.isFinite(x)||!Number.isFinite(y)||!en||!zh)throw Error('Invalid station anchor or localized name: '+id);
  stationOwners.set(id,world);
 }
}
for(const [id,owner] of [['temple','fortune'],['station','fortune'],['fish','home']]){
 if(stationOwners.get(id)!==owner)throw Error('Station belongs in '+owner+': '+id);
}
console.log('PASS: four destinations, '+stationOwners.size+' unique base stations; temple and pier ownership correct.');
const external=assembleMeowBox(shell,scripts),embedded=assembleMeowBox(shell,scripts,parts);
for(const html of [external,embedded])new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:'meowbox-assembled.js'});
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),embedded);
console.log('PASS: all '+MEOW_ART_COUNT+' extracted images byte-identical ('+bytes+' bytes); external and embedded game syntax valid. External HTML '+Buffer.byteLength(external)+' bytes; embedded '+Buffer.byteLength(embedded)+' bytes.');
