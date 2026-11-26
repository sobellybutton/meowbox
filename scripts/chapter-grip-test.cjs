const fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
const section=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<i)throw Error('Missing test section');return s.slice(i,j)};
const run=new Function(section('/* MBCHAPTER_BEGIN','/* MBCHAPTER_END */')+section('/* MBINCENSE_GRIP_BEGIN','/* MBINCENSE_GRIP_END */')+`
const assert=(x,msg)=>{if(!x)throw Error(msg)};
assert(bagChapterFor('Fortune stick 10','fortune')==='fortune','fortune');
assert(bagChapterFor('River echo keepsake','memory')==='home','pier');
assert(bagChapterFor('Brown sugar tea recipe','food')==='island','food');
assert(bagChapterFor('Soul Cat: Dreamer','memory')==='wonder','lab');
assert(bagChapterFor('Arrival: Fortune Valley','travel')==='travel','travel');
assert(bagChapterFor('Legacy unclassified item','memory')==='travel','preserve unknown');
const entries=[{chapter:'fortune',owned:true},{chapter:'fortune',owned:false},{chapter:'home',owned:true}];const count=bagChapterCounts(entries,'fortune');assert(count.owned===1&&count.total===2,'count');
const rows=Array.from({length:20},(_,i)=>i);assert(bagPageSlice(rows,0).rows.length===9&&bagPageSlice(rows,2).rows.length===2&&bagPageSlice(rows,99).page===2,'pagination');
const pose={wrist:{x:12,y:-30}},a=incensePlacementActor(510,493,1.65,pose),g=incenseGripPosition(a.x,a.y,1.65,pose);
assert(Math.abs(g.x-510)<.00001&&Math.abs(g.y-493)<.00001,'placement grip touches burner');
assert(incenseGripPosition(100,200,2,pose).x===124,'hand follows avatar');
return 'PASS: ten chapter and grip checks';
`);console.log(run());
