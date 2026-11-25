/* Import the original six painted residents from a validated, portable JSON bundle.
 * Usage: node scripts/import-painted.cjs /path/to/meowbox_painted_github_import.json
 * No dependencies, no network, no replacement of unrelated assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),input=process.argv[2];
if(!input)throw Error('Provide the painted resident JSON bundle');
const data=JSON.parse(fs.readFileSync(input,'utf8'));
const keys=['temple-keeper','master-yue','fortune-teller','auntie-mei','wang-laoban','grandma'];
if(data?.version!==1||!data.residents||Object.keys(data.residents).sort().join(',')!==[...keys].sort().join(','))throw Error('Invalid six-resident bundle');
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
const manifest={version:1,residents:{}},files=[];
for(const key of keys){
 manifest.residents[key]={};
 for(const kind of ['standing','warm']){
  const v=data.residents[key]?.[kind],p='assets/visual/painted/'+key+'/'+(kind==='standing'?'standing.webp':'expressions/warm.webp');
  if(v?.path!==p||typeof v.base64!=='string'||v.base64.length>1000000||!/^[A-Za-z0-9+/]+={0,2}$/.test(v.base64))throw Error('Invalid asset '+p);
  const b=Buffer.from(v.base64,'base64'),hash=crypto.createHash('sha256').update(b).digest('hex'),[w,h]=webpSize(b);
  if(b.toString('base64')!==v.base64||hash!==v.sha256||w!==v.width||h!==v.height||w>2048||h>2048)throw Error('Checksum or dimensions differ: '+p);
  files.push({p,b});manifest.residents[key][kind]={path:p,width:w,height:h,sha256:hash};
 }
}
// Validate all twelve assets before the first write. Manifest is written last.
for(const {p,b} of files){const dest=path.join(root,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b)}
fs.writeFileSync(path.join(root,'assets/visual/painted/runtime.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Imported '+files.length+' original painted assets; run node scripts/build.cjs before committing.');
