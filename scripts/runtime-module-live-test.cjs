'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const s=read('src/startup.js'),a=s.indexOf('/* PAW_RUNTIME_MODULES_BEGIN'),b=s.indexOf('/* PAW_RUNTIME_MODULES_END */');
assert(a>=0&&b>a);
const code=s.slice(a,b),ambientStart=s.indexOf('const pawAmbientLines='),ambientEnd=s.indexOf('\n};',ambientStart)+3;
const api=new Function('PawResidentRemarks','PawEconomy','PawMotionAudio',s.slice(ambientStart,ambientEnd)+`
let ambientLastFoot=0,indoorStepAt=0,loop=()=>{},pawWalletPage=()=>{};
const document={createElement:()=>({}),head:{append(){}}};
const furnitureCatalogue=()=>[['roomExtension','Reading room','阅读小室',600,'extension'],['roomStudio','Studio','工作室',1000,'extension']];
const furnitureOwned=id=>id==='roomExtension';const hideoutBalance=()=>450;
const shrineClock=()=>({day:'2026-11-27'}),townPawRecord=()=>({day:'2026-11-27',keys:['food']}),townPawCategories=()=>[{id:'food',amount:10},{id:'play',amount:20}],dailyWheelPrizes=[10,30],dailyWheelRecord=()=>({day:'2026-11-26'});
`+code+`return {pawLiveRemarkCount,pawLiveSurface,pawLiveEconomySnapshot,ambientLastFoot,indoorStepAt};`)(require('../src/resident-remarks'),require('../src/paw-economy'),require('../src/paw-motion-audio'));
assert.equal(api.pawLiveRemarkCount,48);assert.equal(api.pawLiveSurface('home',null),'sand');assert.equal(api.pawLiveSurface('fortune','temple'),'stone');assert.equal(api.pawLiveSurface('island','boba'),'wood');
assert.equal(api.ambientLastFoot,Infinity);assert.equal(api.indoorStepAt,Infinity);
const q=api.pawLiveEconomySnapshot();assert.equal(q.goals[0].owned,true);assert.equal(q.goals[1].needed,550);assert.equal(q.goals[1].available,true);assert.equal(q.earn.possible,50);
for(const name of ['resident-remarks','paw-motion-audio','paw-economy']){assert(read('index.html').includes('src/'+name+'.js'));assert(read('scripts/build.cjs').includes("'"+name+"'"))}
console.log('PASS live module wiring, resident merge, surfaces and read-only ledger');
