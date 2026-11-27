// Regression for initial railway loading recovery (c1ae152).
// Run: node scripts/test-first-rail-recovery.cjs
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const begin=source.indexOf('/* PAW_ITEM1_TRANSIT_BEGIN */');
const end=source.indexOf('/* PAW_ITEM1_TRANSIT_END */',begin);
if(begin<0||end<=begin)throw Error('Missing first railway helper markers');
const checks=new Function(source.slice(begin,end)+"\nlet checks=0;\nfunction ok(value,message){if(!value)throw Error(message);checks++}\nlet r={elapsed:0,last:null};\nok(pawFirstRailProgress(r,0,true,false,8500)==='loading','initial');\nfor(let i=1;i<=49;i++)ok(pawFirstRailProgress(r,i*100,true,false,8500)==='loading','loading bound');\nok(pawFirstRailProgress(r,5000,true,false,8500)==='unavailable','bounded error');\nok(r.elapsed===0,'no phantom motion');\nok(pawFirstRailProgress(r,5100,false,false,8500)==='held','pause');\nok(pawFirstRailProgress(r,100000,true,true,8500)==='riding'&&r.elapsed===0,'recovered no jump');\nfor(let i=1;i<=40;i++)ok(pawFirstRailProgress(r,100000+i*100,true,i%2===0,8500)==='riding','transient image replacement');\nok(r.elapsed===4000,'elapsed preserved');\nok(pawFirstRailProgress(r,104100,false,false,8500)==='held','hidden');\nok(pawFirstRailProgress(r,200000,true,true,8500)==='riding'&&r.elapsed===4000,'resume no jump');\nfor(let i=1;i<45;i++)ok(pawFirstRailProgress(r,200000+i*100,true,true,8500)==='riding','remaining trip');\nok(pawFirstRailProgress(r,204500,true,true,8500)==='arrived','arrival');\nlet p={elapsed:0,last:null};\npawFirstRailProgress(p,0,true,false,6500);\npawFirstRailProgress(p,100,true,false,6500);\npawFirstRailProgress(p,200,false,false,6500);\npawFirstRailProgress(p,90000,true,false,6500);\nok(p.loadElapsed===100,'paused loading excluded');\nreturn checks;")();
console.log('First railway loading recovery: '+checks+' assertions passed');
