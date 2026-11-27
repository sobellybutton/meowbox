const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=s.indexOf('/* PAW_CAFE_CONVERSATION_BEGIN */'),b=s.indexOf('/* PAW_CAFE_CONVERSATION_END */',a);
assert.ok(a>=0&&b>a);
const {assess,copy,extra}=new Function(s.slice(a,b)+';return {assess:pawCafeAssess,copy:pawCafeResultCopy,extra:pawCafeExtraQuestions}')();
const kinds=[['A','甲','Space','空间','#111'],['B','乙','Action','行动','#222'],['C','丙','Listen','倾听','#333']];
assert.equal(extra.length,5);
for(const q of extra){assert.equal(q[0].length,2);assert.equal(q[1].length,3);assert.ok(q[1].every(p=>p.length===2&&p.every(Boolean)))}
let visited=0;
function walk(answers=[]){
 if(answers.length<9){for(let i=0;i<3;i++)walk([...answers,i]);return}
 const result=assess(answers,9),out=copy(result,kinds);
 assert.equal(result.scores.reduce((a,b)=>a+b,0),9);
 assert.equal(out.lines.length,result.ties.length);assert.equal(out.prompts.length,result.ties.length);
 for(const i of result.ties)assert.equal(result.scores[i],Math.max(...result.scores));
 if(result.ties.length>1)assert.equal(out.title[0],'A blend of ways to connect');
 else assert.equal(out.title[0],kinds[result.index][0]);
 visited++;
}
walk();assert.equal(visited,19683);
assert.equal(assess([0],9),null);assert.equal(assess([3],1),null);assert.equal(copy({ties:[0,0]},kinds),null);
assert.equal(copy({ties:[5]},kinds),null);
console.log('Café conversation reflections: all 9-choice sequences checked');
