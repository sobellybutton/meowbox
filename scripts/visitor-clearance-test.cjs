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
assert.ok(src.includes('pawVisitorStepClear(a,next,[indoor],55)'));
assert.ok(src.includes('pawVisitorPauseTimers(pawLocalVisitors,Math.max(0,elapsed-dt))'));
console.log('Indoor visitor clearance and dwell regression passed');
