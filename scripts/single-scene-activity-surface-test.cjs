'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const gate=source.split('const pawGateCompositionCSS=')[1].split('document.head.append(pawGateCompositionCSS);')[0];
const controls=source.split('/* PAW_SINGLE_ACTIVITY_SURFACE_BEGIN */')[1].split('/* PAW_SINGLE_ACTIVITY_SURFACE_END */')[0];
assert.ok(!gate.includes('url('),'Gateway image must not repeat behind the foreground painting');
assert.ok(gate.includes('object-fit:cover!important')&&gate.includes('object-fit:contain!important'));
assert.ok(gate.includes('.gate-traveller.pawGateGrounded'));
assert.ok(controls.includes('border:0!important;border-radius:0!important;box-shadow:none!important'));
assert.ok(controls.includes('min-height:44px!important'));
assert.ok(controls.includes('repeat(auto-fit,minmax(min(100%,130px),1fr))'));
assert.ok(controls.includes('@media(forced-colors:active)'));
const helpers=new Function(source.slice(source.indexOf('function pawGateFit('),source.indexOf('const pawGateCompositionCSS='))+';return {pawGateFit,pawGateGround}')();
for(const [w,h] of [[360,640],[390,844],[1440,900],[844,390],[768,1024],[280,450]]){
 const f=helpers.pawGateFit(w,h);
 for(let i=0;i<=100;i++){
  const p=helpers.pawGateGround(w,h,i/100);
  assert.ok(p.x>=f.left&&p.x<=f.left+f.width&&p.y<=f.top+f.height&&p.y-p.height>=f.top);
  if(i)assert.ok(p.y<helpers.pawGateGround(w,h,(i-1)/100).y);
 }
}
console.log('PASS single gateway painting, activity controls and original grounding geometry');
