'use strict';
const s=require('node:fs').readFileSync('src/startup.js','utf8');
const recoveredPart=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<=i)throw Error('Missing '+a);return s.slice(i,j)};

const recoveredChecks=new Function(
 recoveredPart('const pawRecoveredShareFormats=','function pawPrepareRecoveredShare')+
 recoveredPart('function pawDrawRecoveredLayout(','/* Share only the computed result')+
 recoveredPart('/* PAW_EXTRA_DISCOVERY_BEGIN */','/* PAW_EXTRA_DISCOVERY_END */')+
 `
let n=0;const ck=(v,m)=>{if(!v)throw Error(m);n++};
let size,strings,draws,depth,transform,stack,drawScales,textScales;
const g={font:'',save(){depth++;stack.push(transform.slice())},restore(){depth--;transform=stack.pop()},translate(){},scale(x,y){transform=[transform[0]*x,transform[1]*y]},beginPath(){},rect(){},clip(){},rotate(){},measureText(v){return {width:Array.from(v).length*25}},fillText(v){strings.push(v);textScales.push(transform.slice())},drawImage(){draws++;drawScales.push(transform.slice())}};
const cv={getContext(){return g}},atlas={complete:true,naturalWidth:1024,naturalHeight:2180};
function readingArtwork(){return atlas}
function pawRecoveredImage(){return {complete:true,naturalWidth:1080,naturalHeight:size}}
const pics={valleyClean:{complete:true,naturalWidth:1440,naturalHeight:810}};
// Real bilingual result labels are supplied by extensions.js in the browser.
// This isolated geometry harness supplies an explicit fixture, not a global dependency.
const soulCats=[['Cloud Poet','云朵诗人'],['Professional Napper','咸鱼猫'],['Rooftop Explorer','屋顶探险家'],['Midnight Stargazer','午夜观星猫'],['Matcha Companion','抹茶暖暖猫'],['Gossip Detective','吃瓜猫'],['Clear-eyed Cat','人间清醒猫'],['Lucky Opportunist','好运招财猫']];
const soulCharms=['sakura','sleepy','guardian','moonlight','pink-love','classic-white','black','gold'];
for(let i=0;i<soulCats.length;i++)ck(pawSoulShareArt({kind:'soul',title:soulCats[i]},soulCats)==='fortune-cats/'+soulCharms[i]+'.webp','correct soul charm');
ck(pawSoulShareArt({kind:'soul',title:['Mixed','并列']},soulCats)==='fortune-cats/classic-white.webp','neutral soul charm');
ck(pawSoulShareArt({kind:'cafe',title:soulCats[0]},soulCats)===null,'non-soul art unchanged');
function sharePaintedKey(){return 'valleyClean'}
function shareTextLines(g,v,w){return [v]}
const tarotDeck=Array.from({length:78},(_,i)=>['Card '+i,'牌 '+i]);
const fiveReadingPositions=Array.from({length:5},(_,i)=>['Position '+i,'位置 '+i]);
function socialResultQuote(){return ['Live reflection','真实结果']}
const scoreRows=count=>Array.from({length:count},(_,i)=>({label:['Theme '+i,'主题 '+i],value:['3 / 6','3 / 6']}));
const examples=[...[1,3,5].map(count=>({kind:'tarot',cards:Array.from({length:count},(_,i)=>({i,rev:i===1})),takeaway:['Actual reading','实际解读']})),{kind:'fortune',lines:[['Actual fortune','实际签文']]},{kind:'story',lines:[['Actual story','实际故事']]},{kind:'soul',lines:[['Actual cat','实际猫灵']]},{kind:'cafe',lines:[['Actual café','实际咖啡馆']]},{kind:'type',scoreRows:scoreRows(4)},{kind:'motive',scoreRows:scoreRows(9)},{kind:'bigfive',scoreRows:scoreRows(5)},{kind:'values',scoreRows:scoreRows(4)},{kind:'zwds_chart',palaces:Array.from({length:12},(_,i)=>({name:['Palace '+i,'宫位 '+i],stars:i%2?[['Zi Wei','紫微']]:[]}))}];
for(const format of Object.keys(pawRecoveredShareFormats)){
 const box=pawRecoveredShareBounds(format);size=box.height;
 for(const item of examples)for(const cn of [false,true]){
  const data={...item,title:['Actual title','实际标题']};strings=[];draws=0;depth=0;transform=[1,1];stack=[];drawScales=[];textScales=[];
  ck(pawDrawRecoveredLayout(cv,data,format,cn,box,{})===true,'draw '+format+' '+item.kind);
  ck(cv.width===1080&&cv.height===size&&depth===0,'canvas size and balanced context');
  ck(strings.join('').includes(cn?'实际标题':'Actual title'),'live title');
  ck(strings.join('').includes(cn?'实际':'Actual'),'live data');
  ck(draws===(item.kind==='tarot'?2+item.cards.length:item.scoreRows||item.palaces?2:3),'actual image slots');
  ck(textScales.every(([x,y])=>x===y),'no compressed text');
  ck(drawScales.every(([x,y],i)=>i===1||x===y),'only decorative overlay may adapt to safe margins');
 }
}
ck(pawRecoveredLayoutKey({kind:'zwds'},'feed')===null,'no full birth chart invented');
ck(pawRecoveredLayoutKey({kind:'type'},'feed')===null,'no score invented');
return n;`)();
console.log('PASS '+recoveredChecks+' exported layout and native scale checks');
