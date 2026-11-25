const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {assembleMeowBox}=require('../src/assemble.js');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parts=Array.from({length:9},(_,i)=>{const s=read('preview-v9-1/part0'+i+'.js');return JSON.parse(s.slice(s.indexOf('(')+1,s.lastIndexOf(')')))});
const scripts=['engine','extensions','startup'].map(x=>read('src/'+x+'.js'));
const html=assembleMeowBox(read('src/shell.html'),scripts,parts);
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:'meowbox-assembled.js'});
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),html);
console.log('PASS: assembled '+html.length+' characters; JavaScript syntax valid.');
