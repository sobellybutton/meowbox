'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/startup.js','utf8');
const desk=source.match(/\/\* PAW_YUE_DESK_BEGIN \*\/([\s\S]*?)\/\* PAW_YUE_DESK_END \*\//)[1];
const air=source.match(/\/\* PAW_SCENE_AMBIENCE_BEGIN \*\/([\s\S]*?)\/\* PAW_SCENE_AMBIENCE_END \*\//)[1];
const checks=new Function(desk+air+`
let n=0;
for(const p of [{x:245,y:235,w:310,h:550},{x:-40,y:12,w:390,h:844},{x:0,y:0,w:1440,h:900}]){
 const [x,y,w,h]=pawYueHostTapBox(p);
 if(x<p.x||y<p.y||x+w>p.x+p.w||y+h>p.y+p.h||!(x<p.x+p.w*.581&&x+w>p.x+p.w*.581&&y<p.y+p.h*.337&&y+h>p.y+p.h*.337))throw Error('host target');
 n++;
}
for(const bad of [null,{}, {x:0,y:0,w:0,h:1},{x:NaN,y:0,w:1,h:1}]){if(pawYueHostTapBox(bad)!==null)throw Error('invalid target');n++}
for(let i=0;i<3;i++)for(let t=-10;t<10;t+=.125){
 const q=pawYueCascadeFrame(i,t),r=pawYueCascadeFrame(i,t,true),r2=pawYueCascadeFrame(i,0,true);
 if(q.u<.8||q.u>.83||q.v<.33||q.v>.35600001||q.alpha<0||q.alpha>.12||JSON.stringify(r)!==JSON.stringify(r2))throw Error('cascade');n++;
}
return n`)();
assert.equal(checks,487);
assert.ok(source.includes('if(hostBox)target(...hostBox,fn);'));
assert.ok(source.includes('const q=pawYueCascadeFrame(i,now,reduced);'));
console.log('PASS '+checks+' desk and cascade checks plus 2 wiring assertions');
