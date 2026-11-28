const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const start=src.indexOf('function pawVisitorStepClear('),end=src.indexOf('/* PAW_VISITOR_LIFECYCLE_END */',start);
assert.ok(start>=0&&end>start);
const {clear,pause}=new Function(src.slice(start,end)+';return {clear:pawVisitorStepClear,pause:pawVisitorPauseTimers}')();
const p={x:0,y:0};
for(let x=1;x<55;x++){
 assert.equal(clear({x,y:0},{x:x+1,y:0},[p],55),true);
 assert.equal(clear({x,y:0},{x:x-1,y:0},[p],55),false);
}
assert.equal(clear({x:10,y:0},{x:11,y:0},[p,{x:20,y:0}],55),false);
assert.equal(clear({x:60,y:0},{x:55,y:0},[p],55),true);
assert.equal(clear({x:60,y:0},{x:54,y:0},[p],55),false);
assert.equal(clear({x:NaN,y:0},{x:54,y:0},[p],55),false);
assert.equal(clear({x:60,y:0},{x:54,y:0},[{x:NaN,y:0}],55),false);
const roster=[{wait:2,exitRetry:4},{wait:5}];
pause(roster,9);assert.deepEqual(roster,[{wait:11,exitRetry:13},{wait:14}]);
pause(roster,-1);pause(roster,NaN);assert.deepEqual(roster,[{wait:11,exitRetry:13},{wait:14}]);
// Mapped paintings use a different logical world scale. Check the actual
// live clearance policy and exercise both distances, not an obsolete literal.
const gapStart=src.indexOf('function pawMappedGuestGaps('),gapEnd=src.indexOf('// Select a connected set',gapStart);
assert.ok(gapStart>=0&&gapEnd>gapStart);
const gaps=new Function(src.slice(gapStart,gapEnd)+';return pawMappedGuestGaps')();
assert.equal(gaps(false).player,55);assert.equal(gaps(true).player,40);
assert.equal(gaps(false).station,52);assert.equal(gaps(true).station,34);
for(const mapped of [false,true]){
 const g=gaps(mapped);
 for(let x=1;x<g.player;x++){
  assert.equal(clear({x,y:0},{x:x+1,y:0},[p],g.player),true);
  assert.equal(clear({x,y:0},{x:x-1,y:0},[p],g.player),false);
 }
 assert.equal(clear({x:g.player+1,y:0},{x:g.player-1,y:0},[p],g.player),false);
 assert.equal(clear({x:g.player+1,y:0},{x:g.player,y:0},[p],g.player),true);
}
assert.ok(src.includes('pawVisitorStepClear(a,next,[indoor],gaps.player)'));
assert.ok(src.includes('pawVisitorStepClear(a,next,others.filter(pawVisitorVisible),gaps.peer)'));
assert.ok(src.includes('pawGuestClear(next.x,next.y,transit?stationFeet:protectedFeet,gaps.station)'));
assert.ok(src.includes('pawVisitorPauseTimers(pawLocalVisitors,Math.max(0,elapsed-dt))'));
console.log('Indoor visitor clearance and dwell regression passed');
