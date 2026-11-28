'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/extensions.js','utf8');
const fn=source.slice(source.indexOf('function journalBookLink('),source.indexOf('function journalLanguage('));
const api=new Function(fn+`
const nodes=[];
function element(tag,txt,parent,cls){const classes=new Set();const n={tag,textContent:txt,children:[],dataset:{},className:cls,attrs:{},classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)},setAttribute(k,v){this.attrs[k]=v},remove(){this.removed=true;parent.children=parent.children.filter(v=>v!==this)}};parent.children.push(n);nodes.push(n);return n}
function b(parent,txt,click){const n=element('button',txt,parent,'');n.click=click;return n}
return {link:journalBookLink,nodes}
`)();
let checks=0;const check=v=>{assert.ok(v);checks++};
for(const kind of ['daily','passport','friends','life','figures','decor']){
 const parent={children:[]};let clicked=0;const row=api.link(parent,'Title','Description',kind,()=>clicked++);
 check(parent.children.length===1&&row.dataset.book===kind);
 check(row.children.length===2&&row.children[1].children[0].textContent==='Title');
 row.click();check(clicked===1);
 const spine=row.children[0],image=spine.children[0];
 check(spine.attrs['aria-hidden']==='true');
 if(kind!=='life'){check(!image);continue}
 check(image.src.endsWith('/journal-cover.webp')&&image.alt==='');
 check(!row.classList.contains('pawHasRecoveredJournalCover'));
 image.naturalWidth=image.naturalHeight=544;image.onload();check(row.classList.contains('pawHasRecoveredJournalCover'));
 image.onerror();check(!row.classList.contains('pawHasRecoveredJournalCover')&&spine.children.length===0);
 const second=api.link(parent,'Title','Description','life',()=>{}),invalid=second.children[0].children[0];invalid.naturalWidth=1;invalid.naturalHeight=1;invalid.onload();
 check(invalid.removed&&!second.classList.contains('pawHasRecoveredJournalCover'));
}
check(source.includes('clip-path:polygon(10% 19%'));
console.log('PASS '+checks+' recovered journal cover and single-action fallback checks');
