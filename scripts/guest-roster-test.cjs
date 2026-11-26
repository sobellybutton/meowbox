const fs=require('node:fs'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8'),a=s.indexOf('/* MBGUEST_ROSTER_BEGIN'),b=s.indexOf('/* MBGUEST_ROSTER_END */');if(a<0||b<a)throw Error('Missing guest roster helpers');console.log(new Function(s.slice(a,b)+"\nconst assert=(ok,msg)=>{if(!ok)throw Error(msg)};\nconst d='2026-11-26',tomorrow='2026-11-27';\nassert(mbGuestOrdinal(tomorrow)===mbGuestOrdinal(d)+1,'calendar day');\nassert(mbGuestOrdinal('2026-02-30')===null&&mbGuestOrdinal('bad')===null,'invalid dates');\nassert(mbGuestIndex(d,3,0,5)!==mbGuestIndex(d,3,1,5),'two distinct guests');\nassert(mbGuestIndex(tomorrow,3,0,5)===mbGuestIndex(d,3,1,5),'daily rotation');\nassert(mbGuestIndex(d,-3,0,1)===0&&mbGuestIndex(d,3,0,0)===-1,'pool bounds');\nassert(!mbGuestSafeRotate(d,d,false,true,[500]),'same day no change');\nassert(!mbGuestSafeRotate(d,tomorrow,true,true,[500]),'no rotation during conversation');\nassert(!mbGuestSafeRotate(d,tomorrow,false,false,[500,100]),'nearby visitor protected');\nassert(mbGuestSafeRotate(d,tomorrow,false,false,[321,400])&&mbGuestSafeRotate(d,tomorrow,false,true,[0,10]),'safe rotation');\nreturn 'PASS: nine guest roster checks';\n")());

const startup=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const begin=startup.indexOf('/* PAW_GEMINI_VISITORS_BEGIN */'),end=startup.indexOf('/* PAW_GEMINI_VISITORS_END */');
if(begin<0||end<=begin)throw Error('Missing imported guest data');
const original=new Function(s.slice(s.indexOf('const popGuestStories='),s.indexOf('function popGuestPool'))+'return popGuestStories')();
console.log(new Function('original',startup.slice(begin,end)+`
const next=pawGeminiMerge(original,pawGeminiVisitorRows);
if(next.length!==15)throw Error('Expected 15 new guest profiles');
if(pawGeminiMerge([...original,...next],pawGeminiVisitorRows).length)throw Error('Repeated import duplicated visitors');
for(const g of next){if(g.choices.length!==2||g.name.length!==2||g.gift.length!==2||g.choices.some(v=>v.some(p=>p.length!==2)))throw Error('Incompatible bilingual guest '+g.id)}
return 'PASS: 15 imported guests, existing identities retained and repeat import safe';`)(original));
