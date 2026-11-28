'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/release-fixes.js'),'utf8');
const start=source.indexOf('/* PAW_DISCOVERY_ACTIVE_TURN_BEGIN */'),end=source.indexOf('/* PAW_DISCOVERY_ACTIVE_TURN_END */');
assert.ok(start>=0&&end>start);
const api=new Function(source.slice(start,end)+';return {pawCafeTurnElapsed,pawCafeTurnMatches};')();
for(const elapsed of [0,100,349,350])for(const dt of [-20,0,16,50,100,8000])for(const blocked of [false,true])assert.equal(api.pawCafeTurnElapsed(elapsed,100,100+dt,blocked),blocked?elapsed:elapsed+Math.min(50,Math.max(0,dt)));
const base={run:{},token:1,round:1,room:'match',activity:'match',scene:'wonder',phase:'turn'};
for(const delta of [{},{run:{}},{token:2},{round:2},{room:'story'},{activity:'story'},{scene:'fortune'},{phase:'question'}])assert.equal(api.pawCafeTurnMatches(base,{...base,...delta}),Object.keys(delta).length===0);
let elapsed=0,last=0;
for(const [now,blocked] of [[16,false],[32,false],[10000,true],[10016,true],[10032,false]]){elapsed=api.pawCafeTurnElapsed(elapsed,last,now,blocked);last=now}
assert.equal(elapsed,48,'background time cannot consume an active response');
assert.equal(api.pawCafeTurnElapsed(NaN,0,16,false),0);
assert.equal(api.pawCafeTurnElapsed(-1,0,16,false),0);
console.log('Café active response timing and stale interaction regression passed.');
