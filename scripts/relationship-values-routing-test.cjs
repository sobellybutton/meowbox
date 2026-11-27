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

const start=s.indexOf('/* PAW_EXTRA_DISCOVERY_BEGIN */'),end=s.indexOf('/* PAW_EXTRA_DISCOVERY_END */',start);
const api=new Function(s.slice(start,end)+';return {pawExtraDiscoveries,pawExtraScore,pawExtraRows,pawCareReflection}')();
const care=api.pawExtraDiscoveries.care;
const rows=care.axes.flatMap((axis,k)=>axis.questions.map((q,j)=>({id:k*3+j,dimension:k})));
assert.equal(rows.length,15);
assert.ok(!lab.includes("wonderSceneOpen('care')")&&cafe.includes("wonderSceneOpen('care')"));
assert.ok(care.axes.every(a=>a.questions.filter(q=>q[1]).length===1&&a.questions.every(q=>q[0].length===2&&q[0].every(Boolean))));
const high=rows.map(r=>care.axes[r.dimension].questions[r.id%3][1]?0:2),low=high.map(v=>2-v);
assert.deepEqual(api.pawExtraScore('care',rows,high),[6,6,6,6,6]);
assert.deepEqual(api.pawExtraScore('care',rows,low),[0,0,0,0,0]);
assert.deepEqual(api.pawExtraScore('care',rows.slice().reverse(),high.slice().reverse()),[6,6,6,6,6]);
assert.equal(api.pawExtraScore('care',[null,...rows.slice(1)],high),null);
assert.equal(api.pawExtraScore('care',[rows[1],...rows.slice(1)],high),null);
assert.equal(api.pawExtraScore('care',rows,[3,...high.slice(1)]),null);
assert.equal(api.pawCareReflection([0,0,0,0,7]),null);
for(let k=0;k<16807;k++){
 let v=k;const scores=Array.from({length:5},()=>{const n=v%7;v=Math.floor(v/7);return n});
 const out=api.pawExtraRows('care',scores),prompts=api.pawCareReflection(scores);
 assert.equal(out.length,5);assert.equal(prompts.length,5);assert.ok(prompts.every(p=>p.length===2&&p.every(Boolean)));
}
assert.ok(api.pawCareReflection([0,0,0,0,0])[4][0]!==api.pawCareReflection([6,6,6,6,6])[4][0]);
console.log('Care preferences scoring, routing and reflection checks passed');

const attachment=new Function(s.slice(start,end)+';return {pawExtraDiscoveries,pawExtraScore,pawExtraRows,pawAttachmentReflection}')();
const bank=attachment.pawExtraDiscoveries.attachment;
const items=bank.axes.flatMap((axis,k)=>axis.questions.map((q,j)=>({id:k*3+j,dimension:k})));
assert.equal(items.length,12);
assert.ok(!lab.includes("wonderSceneOpen('attachment')")&&cafe.includes("wonderSceneOpen('attachment')"));
assert.ok(bank.axes.every(a=>a.questions.filter(q=>q[1]).length===1&&a.questions.every(q=>q[0].length===2&&q[0].every(Boolean))));
const top=items.map(r=>bank.axes[r.dimension].questions[r.id%3][1]?0:2);
assert.deepEqual(attachment.pawExtraScore('attachment',items,top),[6,6,6,6]);
assert.deepEqual(attachment.pawExtraScore('attachment',items,top.map(v=>2-v)),[0,0,0,0]);
assert.deepEqual(attachment.pawExtraScore('attachment',items.slice().reverse(),top.slice().reverse()),[6,6,6,6]);
assert.equal(attachment.pawExtraScore('attachment',[null,...items.slice(1)],top),null);
assert.equal(attachment.pawExtraScore('attachment',[items[1],...items.slice(1)],top),null);
assert.equal(attachment.pawExtraScore('attachment',items,[3,...top.slice(1)]),null);
assert.equal(attachment.pawAttachmentReflection([0,0,0,7]),null);
for(let k=0;k<2401;k++){
 let v=k;const scores=Array.from({length:4},()=>{const n=v%7;v=Math.floor(v/7);return n});
 const out=attachment.pawExtraRows('attachment',scores),prompts=attachment.pawAttachmentReflection(scores);
 assert.equal(out.length,4);assert.equal(prompts.length,4);assert.ok(prompts.every(p=>p.length===2&&p.every(Boolean)));
}
const lo=attachment.pawAttachmentReflection([0,0,0,0]),mid=attachment.pawAttachmentReflection([3,3,3,3]),hi=attachment.pawAttachmentReflection([6,6,6,6]);
assert.ok(lo[0][0].includes('easier')&&hi[0][0].includes('late reply'));
assert.ok(lo[2][0].includes('starting small')&&hi[2][0].includes('comfortable asking'));
assert.ok(lo.every((p,i)=>new Set([p[0],mid[i][0],hi[i][0]]).size===3));
console.log('Attachment reflection scoring, tiered responses and café routing checks passed');
