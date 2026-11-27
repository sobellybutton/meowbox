const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=s.indexOf('/* PAW_VALUES_REFLECTION_BEGIN */'),b=s.indexOf('/* PAW_VALUES_REFLECTION_END */',a);
assert.ok(a>=0&&b>a);
const reflect=new Function(s.slice(a,b)+';return pawRelationshipReflection')();
for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++)for(let d=0;d<=6;d++){const out=reflect([a,b,c,d]);assert.equal(out.length,4);assert.ok(out.every(p=>p.length===2&&p.every(Boolean)))}
assert.equal(reflect([7,0,0,0]),null);assert.equal(reflect([0,0,0]),null);assert.equal(reflect([0,0,0,1.5]),null);
assert.ok(reflect([0,0,0,0])[0][0]!==reflect([6,0,0,0])[0][0]);
const menu=s.slice(s.indexOf('const curatedDiscoveryActionBefore='),s.indexOf('const curatedCafeQuestions='));
const lab=menu.slice(menu.indexOf("if(room==='quiz'"),menu.indexOf("if(scene==='wonder'&&room==='match'"));
const cafe=menu.slice(menu.indexOf("if(scene==='wonder'&&room==='match'"));
assert.ok(!lab.includes("wonderSceneOpen('values')"));assert.ok(cafe.includes("wonderSceneOpen('values')")&&cafe.includes("start('match')"));
console.log('Relationship values routing and reflection checks passed');
