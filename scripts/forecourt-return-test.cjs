const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('/* PAW_FORECOURT_BEGIN */'),b=src.indexOf('/* PAW_FORECOURT_END */',a);
const m=src.indexOf('function pawForecourtControlModel('),n=src.indexOf('let pawForecourtControlsRun',m);
assert.ok(a>=0&&b>a&&m>=0&&n>m);
const {route,tick,model,entry}=new Function(src.slice(a,b)+src.slice(m,n)+';return {route:pawForecourtRoute,tick:pawForecourtTick,model:pawForecourtControlModel,entry:pawForecourtEntry}')();
for(const destination of ['cat','hall']){
 for(const frames of [0,5,25]){
  let q={pos:[.49,.82],route:[],destination:null,last:0};
  assert.ok(route(q,destination));
  for(let i=1;i<=frames;i++)tick(q,i*.05,false);
  const from=q.pos.slice();
  assert.equal(model(q,false).canReturn,true);
  assert.ok(route(q,'exit'));
  assert.deepEqual(q.pos,from);
  assert.equal(route(q,'exit'),false);
  assert.equal(route(q,'hall'),false);
  assert.equal(model(q,false).canReturn,false);
  let arrival=null;
  for(let i=frames+1;i<400&&!arrival;i++)arrival=tick(q,i*.05,false);
  assert.equal(arrival,'exit');
  assert.deepEqual(q.pos,[.49,.82]);
 }
}
const q={pos:[.47,.58],route:[],destination:null,last:0};
assert.ok(route(q,'exit'));
assert.equal(model(q,true).canReturn,false);
assert.equal(tick(q,1,true,true),null);
assert.deepEqual(q.pos,[.47,.58]);
assert.equal(tick(q,2,false,true),null);
assert.equal(tick(q,3,false,true),'exit');
assert.ok(src.includes("pawForecourtRoute(state.pawForecourt,'exit');"));
console.log('Temple forecourt return regression passed');

// One doorway tap automatically owns the approach; no secondary hall click.
for(const reduced of [false,true]){
 const q=entry(10);assert.equal(q.destination,'hall');assert.ok(q.route.length);
 assert.deepEqual(q.pos,[.49,.82]);assert.equal(model(q,false).busy,true);
 assert.equal(tick(q,10.05,true,reduced),null);assert.deepEqual(q.pos,[.49,.82]);
 let done=null;for(let i=2;i<400&&!done;i++)done=tick(q,10+i*.05,false,reduced);
 assert.equal(done,'hall');assert.deepEqual(q.pos,[.47,.58]);assert.equal(q.route.length,0);
 const cancelled=entry(20);tick(cancelled,20.05,false,reduced);assert.ok(route(cancelled,'exit'));
 let left=null;for(let i=2;i<400&&!left;i++)left=tick(cancelled,20+i*.05,false,reduced);
 assert.equal(left,'exit');assert.deepEqual(cancelled.pos,[.49,.82]);
}
assert.ok(src.includes("start('templeForecourt');state.pawForecourt=pawForecourtEntry(t);"));
assert.ok(src.includes('if(pawArcadeInputBlocked()||model.busy){pawForecourtClearControls();return}'));
console.log('Automatic temple hall arrival, blocked input, reduced motion and one-tap return passed');
