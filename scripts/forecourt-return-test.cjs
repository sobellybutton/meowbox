const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('/* PAW_FORECOURT_BEGIN */'),b=src.indexOf('/* PAW_FORECOURT_END */',a);
const m=src.indexOf('function pawForecourtControlModel('),n=src.indexOf('let pawForecourtControlsRun',m);
assert.ok(a>=0&&b>a&&m>=0&&n>m);
const {route,tick,model}=new Function(src.slice(a,b)+src.slice(m,n)+';return {route:pawForecourtRoute,tick:pawForecourtTick,model:pawForecourtControlModel}')();
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
