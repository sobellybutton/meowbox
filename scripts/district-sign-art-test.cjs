'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const block=src.split('/* PAW_DISTRICT_SIGN_MATERIAL_BEGIN */')[1].split('/* PAW_DISTRICT_SIGN_MATERIAL_END */')[0];
let priorCalls=0,writes=0,scene='fortune';
const game={dataset:{},style:{setProperty(k,v){writes++;this[k]=v}}},document={createElement:()=>({}),head:{append(){}}};
const api=new Function('syncSigns','document','$','scene',block+';return {sync:syncSigns,material:pawDistrictSignMaterial,vars:pawDistrictSignVars,apply:pawApplyDistrictSignMaterial,css:pawDistrictSignStyle.textContent}')(()=>priorCalls++,document,()=>game,scene);
let n=0;const check=(v,m)=>{assert.ok(v,m);n++};
api.sync();check(priorCalls===1,'existing sign projection retained');
const palettes=new Set();
for(const id of ['fortune','home','island','wonder']){
 const mat=api.material(id),vars=api.vars(mat);
 palettes.add(mat.wash);
 api.apply(game,id);check(game.dataset.pawSignMaterial===id,'correct district');
 const before=writes;check(!api.apply(game,id)&&writes===before,'no repeated style mutation');
 check(fs.existsSync(path.resolve(__dirname,'../assets/visual/painted/signage',mat.grain)),'existing texture');
 check(vars['--paw-sign-ink']===mat.ink,'live label ink');
 check(api.material(id,true)===api.material('fortune',true),'common railway family');
}
check(palettes.size===4,'distinct district tint');
check(api.material('unknown')===api.material('fortune'),'safe default');
check(fs.existsSync(path.resolve(__dirname,'../assets/visual/painted/signage',api.material('home',true).grain)),'rail texture exists');
check(api.css.includes('border-image:none!important'),'ornate frame removed');
check(api.css.includes('min-height:44px'),'edge target retained');
check(api.css.split('@media(forced-colors:active)')[1].includes('data-paw-wayfinding="railway"'),'railway forced-colors specificity');
check(api.css.includes('ButtonText!important'),'contrast fallback');
check(!/animation:|transition:|pointer-events:|display:/.test(api.css),'no ownership or motion changes');
console.log('PASS '+n+' district material, asset, projection and accessibility assertions.');
