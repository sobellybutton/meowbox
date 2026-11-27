'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/startup.js'),'utf8');
const get=name=>src.split('/* PAW_'+name+'_BEGIN */')[1].split('/* PAW_'+name+'_END */')[0];
const api=new Function(get('PURIFICATION_PAINT')+get('ALCOVE_PAINT')+get('SLIP_COUNTER')+';return {pawAlcoveGeometry,pawAlcoveStickPoint,pawAlcoveMoonPoint,pawSlipGeometry,pawSlipPose,pawSlipRackCamera,pawSlipPage}')();
for(const name of ['sticks','slip-counter'])assert.ok(fs.existsSync(path.join(root,'assets/visual/staging/2026-11-27/rooms/temple',name+'.webp')));
const g=api.pawAlcoveGeometry();
for(let i=0;i<=100;i++){const f=i/100,a=api.pawAlcoveStickPoint(g,{fall:f,picked:false,pick:0});assert.ok(a.x>=g.tubeTop.x&&a.x<=g.stickTray.x&&Number.isFinite(a.y))}
const landed=api.pawAlcoveStickPoint(g,{fall:1,picked:false,pick:0});assert.equal(landed.y,g.stickTray.y);assert.equal(landed.x,g.stickTray.x);
const held=api.pawAlcoveStickPoint(g,{fall:1,picked:true,pick:1});assert.equal(held.x,g.stickPickFoot.x+14);assert.equal(held.y,g.stickPickFoot.y-64);
for(let i=0;i<=100;i++){const f=i/100;for(let j=0;j<2;j++){const sign=j?1:-1,x=350+j*100+sign*Math.sin(Math.PI*f)*21,lift=Math.sin(Math.PI*f)*95,p=api.pawAlcoveMoonPoint(g,{x,lift});assert.ok(Math.abs(p.x-g.moonTray.x)<=19&&p.y<=g.moonTray.y)}}
const s=api.pawSlipGeometry();
for(const [stage,age,a] of [['folded',0,s.counter],['opening',.75,s.reading],['tied',.7,s.tie],['kept',.7,s.bag]]){const p=api.pawSlipPose(stage,age,s);assert.ok(Math.abs(p.x-a.x)<.001&&Math.abs(p.y-a.y)<.001);if(['kept','tied'].includes(stage))assert.equal(p.alpha,0)}
for(let i=0;i<=100;i++){const p=api.pawSlipPose('opening',i*.0075,s);assert.ok(p.w>=105&&p.w<=460&&p.h>=82&&p.h<=380)}
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1280,720],[1920,1080]]){const a=api.pawSlipRackCamera(w,h);for(const q of s.rows.flat())assert.ok(a.ox+q.x*a.s>=0&&a.ox+q.x*a.s<=w&&a.oy+q.y*a.s>=0&&a.oy+q.y*a.s<=h)}
const data=Array.from({length:44},(_,i)=>i);assert.equal(api.pawSlipPage(data,99).entries.length,2);assert.equal(api.pawSlipPage(data,-1).entries[0],0);assert.equal(api.pawSlipPage([],5).pages,1);
console.log('Painted ritual alcove and fortune counter checks passed.');
