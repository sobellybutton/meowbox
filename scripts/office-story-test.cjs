'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8'),a=src.indexOf('/* PAW_OFFICE_STORIES_BEGIN */'),b=src.indexOf('/* PAW_OFFICE_STORIES_END */');
assert(a>=0&&b>a);
let n=0;
const ck=(v,m)=>{assert(v,m);n++};
for(const language of [0,1]){
 const api=new Function('language',`let current=null,closed=0;const collected=new Set();
 const tr=(en,cn)=>language?cn:en;
 const say=(speaker,line,choices)=>{current={speaker,line,choices}};
 const closeTalk=()=>{current=null;closed++};
 const addItem=(en,cn)=>collected.add(en);
 `+src.slice(a,b)+`
 return {stories:pawOfficeStories,open:gatheringOfficeStory,current:()=>current,closed:()=>closed,collected,choose:i=>current.choices[i][1]()};`)(language);
 const endingText=new Set();
 const names=new Set();
 for(const [i,story] of api.stories.entries()){
  ck(!names.has(story.id),'unique story');names.add(story.id);
  for(let j=0;j<story.choices.length;j++)for(let k=0;k<story.choices[j].choices.length;k++){
   api.open();ck(api.current().choices.length===4,'three stories and leave');
   api.choose(i);ck(api.current().line===story.opening[language],'actual selected premise');
   api.choose(j);ck(api.current().line===story.choices[j].reply[language],'actual selected response');
   api.choose(k);const result=api.current().line;
   ck(result===story.choices[j].choices[k].ending[language],'actual branch ending');
   ck(!endingText.has(result),'distinct ending');endingText.add(result);
   api.choose(0);ck(api.current()===null,'finish returns to room');
   ck(api.collected.size===1&&api.collected.has('Meeting escape ticket'),'same single keepsake');
  }
 }
 ck(endingText.size===12,'twelve endings in each language');
 for(let depth=0;depth<4;depth++){
  api.open();for(let i=0;i<depth;i++)api.choose(0);
  api.collected.clear();api.choose(api.current().choices.length-1);
  ck(api.current()===null&&api.collected.size===0,'leave at every depth without award');
 }
}
console.log('PASS '+n+' bilingual office story branch and return checks');
