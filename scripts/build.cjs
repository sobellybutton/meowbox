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
const external=assembleMeowBox(shell,scripts),embedded=assembleMeowBox(shell,scripts,parts);
for(const html of [external,embedded])new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:'meowbox-assembled.js'});
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),embedded);
console.log('PASS: all '+MEOW_ART_COUNT+' extracted images byte-identical ('+bytes+' bytes); external and embedded game syntax valid. External HTML '+Buffer.byteLength(external)+' bytes; embedded '+Buffer.byteLength(embedded)+' bytes.');
