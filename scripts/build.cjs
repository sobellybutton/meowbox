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
const scripts=['engine','extensions','release-fixes','town-polish','town-access','startup'].map(x=>read('src/'+x+'.js')),shell=read('src/shell.html');
require('./quality-checks.cjs')(scripts[1]);
const painted=JSON.parse(read('assets/visual/painted/runtime.json')),crypto=require('node:crypto');
if(painted.version!==1||!painted.residents||Array.isArray(painted.residents)||typeof painted.residents!=='object')throw Error('Invalid painted runtime manifest');
const allowedPainted=new Set(["temple-keeper","master-yue","fortune-teller","auntie-mei","wang-laoban","grandma","ah-ma","auntie-lin","auntie-hong","garden-keeper","boba-keeper","arcade-keeper","souvenir-keeper"]);
function webpSize(b){
 if(b.length<30||b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP'||b.readUInt32LE(4)+8!==b.length)throw Error('Invalid WebP');
 for(let o=12;o+8<=b.length;){
  const name=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4),i=o+8;if(i+n>b.length)throw Error('Broken WebP chunk');
  if(name==='VP8X'&&n>=10)return [1+b.readUIntLE(i+4,3),1+b.readUIntLE(i+7,3)];
  if(name==='VP8L'&&n>=5&&b[i]===47){const v=b.readUInt32LE(i+1);return [1+(v&16383),1+((v>>>14)&16383)]}
  if(name==='VP8 '&&n>=10&&b[i+3]===157&&b[i+4]===1&&b[i+5]===42)return [b.readUInt16LE(i+6)&16383,b.readUInt16LE(i+8)&16383];
  o=i+n+(n%2);
 }throw Error('Unsupported WebP dimensions');
}
let paintedCount=0;
for(const [key,entry] of Object.entries(painted.residents)){
 if(!allowedPainted.has(key))throw Error('Unexpected painted resident: '+key);
 if(!entry.standing||!entry.warm||Object.keys(entry).some(k=>!['standing','warm','seated','scolding'].includes(k)))throw Error('Invalid painted poses for '+key);
 for(const kind of Object.keys(entry)){
  const v=entry[kind],expected='assets/visual/painted/'+key+'/'+(kind==='standing'?'standing.webp':kind==='warm'?'expressions/warm.webp':'poses/'+kind+'.webp');
  if(v?.path!==expected||!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<1||v.height<1||v.width>2048||v.height>2048)throw Error('Invalid painted record '+expected);
  const raw=fs.readFileSync(path.join(root,expected));
  if(raw.subarray(0,4).toString()!=='RIFF'||raw.subarray(8,12).toString()!=='WEBP'||crypto.createHash('sha256').update(raw).digest('hex')!==v.sha256)throw Error('Painted artwork failed checksum: '+expected);
  const [w,h]=webpSize(raw);if(w!==v.width||h!==v.height)throw Error('Painted dimensions mismatch: '+expected);
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
