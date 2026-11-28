const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
const x=ext.indexOf('const popGuestStories='),y=ext.indexOf('function popGuestPool',x);
if(x<0||y<=x)throw Error('Missing original guests');
const a=s.indexOf('/* PAW_GUEST_PERSONALITY_BEGIN */'),b=s.indexOf('/* PAW_GUEST_PERSONALITY_RUNTIME_END */',a);
if(a<0||b<=a)throw Error('Missing personality runtime');
const run=new Function('assert',ext.slice(x,y)+s.slice(s.indexOf('const pawGeminiVisitorRows='),s.indexOf('/* PAW_GEMINI_VISITORS_END */'))+`
popGuestStories.push(...pawGeminiMerge(popGuestStories,pawGeminiVisitorRows));
const pawAmbientLines={},pawGuestWindows={},popGuestMemory={},items=[];
let pawAmbientProfile=()=>null,popGuestMeet=()=>{},last=null,saves=0;
const friendships=[],lifeFriend=name=>friendships.push(name);
const popGuestRecord=g=>popGuestMemory[g.id]||null,save=()=>saves++,tr=(en)=>en,closeTalk=()=>{},addItem=(...p)=>items.push(p),popGuestSay=(g,line,opts)=>last={g,line,opts};
`+s.slice(a,b)+`
assert.equal(popGuestStories.length,27);
assert.equal(pawGuestPersonalities.size,27);
for(const g of popGuestStories){
 const profile=pawGuestPersonalities.get(g.id);assert.ok(profile);
 const variants=Array.from({length:5},(_,i)=>pawGuestVisitLine(g,i+1));
 assert.equal(new Set(variants.map(p=>p[0])).size,5);
 assert.equal(new Set(variants.map(p=>p[1])).size,5);
 assert.deepEqual(pawGuestVisitLine(g,6),variants[0]);
 assert.equal(pawAmbientProfile({popGuest:g.id}).id,'guest:'+g.id);
 assert.equal(pawAmbientLines['guest:'+g.id].length,4);
 const priorFriendships=friendships.length;
 popGuestMeet(g);assert.equal(friendships.length,priorFriendships);assert.equal(last.line,variants[0][0]+(g.source==='gemini-modules-01-03'?'':'\\n\\n'+g.prompt[0]));assert.equal(last.opts.length,3);
 last.opts[0][1]();assert.equal(friendships.length,priorFriendships+1);assert.equal(friendships.at(-1),g.name);assert.deepEqual(popGuestMemory[g.id].choices,[0]);
 assert.equal(last.line,g.choices[0][1][0]);
 popGuestMeet(g);last.opts[1][1]();assert.equal(friendships.length,priorFriendships+2);assert.deepEqual(popGuestMemory[g.id].choices,[0,1]);
 popGuestMeet(g);assert.equal(friendships.length,priorFriendships+2);assert.equal(last.opts.length,0);assert.equal(last.line,variants[2][0]);
 popGuestMeet(g);last.opts[0][1]();assert.equal(friendships.length,priorFriendships+3);assert.deepEqual(popGuestMemory[g.id].choices,[0,1]);
 assert.equal(items.filter(p=>p[0]===g.gift[0]).length,1);
}
assert.equal(pawAmbientProfile({popGuest:'unknown'}),null);
assert.equal(Object.keys(pawGuestWindows).length,6);
return 'PASS: 27 bilingual profiles, live dialogue routing, choice compatibility, brief encounters, ambient remarks and one-time keepsakes';
`);
console.log(run(assert));
