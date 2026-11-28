/* MeowBox release fixes; load after extensions, before startup. */
const ziBeforeRelease=ziChart;
ziChart=function(date,hr){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(hr)||hr<0||hr>23)throw Error('Invalid birth date or hour');
 const ms=Date.parse(date+'T12:00:00Z');if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==date||date<'1900-01-02'||date>'2036-12-31')throw Error('Unsupported birth date');
 const z=ziBeforeRelease(date,hr);if(z.stars.flat().length!==14||new Set(z.stars.flat().map(v=>v[1])).size!==14||!Number.isInteger(z.bureau)||z.bureau<2||z.bureau>6)throw Error('Chart integrity');
 return z
};
const friendPalaceRelease=chartConsultTopics.find(v=>v.k===9);if(friendPalaceRelease)friendPalaceRelease.k=7;
let releaseSignViewport='';const releaseSignBefore=syncSigns;
syncSigns=function(){const key=W+'x'+H;if(key!==releaseSignViewport){releaseSignViewport=key;for(const btn of signButtons.values()){btn._signSize=null;btn._signOffset=null;btn._clearAt=0}lastDoorLayoutAt=-Infinity}return releaseSignBefore()};

/* Assessment scores are relative to the answered items, not probabilities. */
function releaseAssessmentBalance(mode,result){
 if(!result||!Array.isArray(result.scores))return null;
 if(mode==='type'){
  const axes=['EI','SN','TF','JP'];if(result.scores.length!==4||result.scores.some(v=>!Number.isInteger(v)||Math.abs(v)>4||v%2!==0))return null;
  return axes.map((axis,i)=>{const score=result.scores[i];return {axis,first:(score+4)/2,second:(4-score)/2,tied:score===0}})
 }
 if(mode==='motive'){
  const scores=result.scores;if(scores.length!==9||scores.some(v=>!Number.isInteger(v)||v<0||v>6))return null;
  const ranked=scores.map((score,index)=>({score,index})).sort((a,b)=>b.score-a.score||a.index-b.index);
  return {ranked,flat:ranked[0].score===ranked[8].score,close:ranked.filter(v=>ranked[0].score-v.score<=1)}
 }
 return null
}
const releaseWonderFinish= wonderSceneFinish;
wonderSceneFinish=function(){
 if(wonderSceneMode==='motive'){
  const result=scoreWonder('motive',wonderQuestionOrder,wonderSceneAnswers),balance=releaseAssessmentBalance('motive',result);
  if(balance.close.length>1){
   wonderSaved.motive={index:null,ties:result.ties,scores:result.scores,version:3,mixed:true,close:balance.close.map(x=>x.index)};
   save('wonderTestsV1',wonderSaved);addItem('Inner motives keepsake','内在动力纪念章');
   const name=balance.flat?['No clear preference','没有明显偏好']:['Several close motives','多种相近动力'];
   const desc=balance.flat?['All nine motives scored equally. No type assigned.','九种动力得分相同，不强行判定类型。']:[balance.close.slice(0,3).map(x=>wonderMotives[x.index][0]+' '+x.score+'/6').join(' · '),balance.close.slice(0,3).map(x=>wonderMotives[x.index][1]+' '+x.score+'/6').join(' · ')];
   wonderSceneResult={name,desc,color:'#c1ab8c'};wonderScenePhase='result';wonderSceneAt=t;sound(660);return
  }
 }
 releaseWonderFinish();
 if(!wonderSceneResult)return;
 if(wonderSceneMode==='type'){
  const v=releaseAssessmentBalance('type',wonderSaved.type);if(!v)return;
  const line=v.map(x=>x.axis[0]+':'+x.first+' '+x.axis[1]+':'+x.second).join(' · ');
  wonderSceneResult.desc=[line+'. X = tied. Answers, not fixed traits.',line+'。X为持平，仅反映本次回答。'];
 }else if(wonderSceneMode==='motive'){
  const v=releaseAssessmentBalance('motive',wonderSaved.motive);if(!v)return;
  if(v.flat){wonderSceneResult.name=['No clear preference','没有明显偏好'];wonderSceneResult.desc=['All nine motives scored equally. No type assigned.','九种动力得分相同，不强行判定类型。'];return}
  if(v.close.length>1){wonderSceneResult.name=['Several close motives','多种相近动力'];wonderSceneResult.desc=[v.close.slice(0,3).map(x=>wonderMotives[x.index][0]+' '+x.score+'/6').join(' · '),v.close.slice(0,3).map(x=>wonderMotives[x.index][1]+' '+x.score+'/6').join(' · ')];return}
  const lead=v.ranked[0],next=v.ranked[1],n=wonderMotives[lead.index],m=wonderMotives[next.index];
  wonderSceneResult.desc=[n[0]+' '+lead.score+'/6. Next: '+m[0]+' '+next.score+'/6. A reflection, not a diagnosis.',n[1]+' '+lead.score+'/6，次高：'+m[1]+' '+next.score+'/6。仅供自我探索。'];
 }
};

/* Batch 15A: assessment integrity, clear chart details and safer input. */
const releaseScoreBefore=scoreWonder;
scoreWonder=function(mode,rows,answers){
 const count={type:16,motive:27,soul:soulQs.length}[mode];
 if(!Number.isInteger(count)||!Array.isArray(rows)||!Array.isArray(answers)||rows.length!==count||answers.length!==count)throw Error('Incomplete assessment');
 const seen=new Set(),perDimension=mode==='type'?4:3;
 for(const [i,q] of rows.entries()){
  if(!Number.isInteger(q?.id)||q.id<0||q.id>=count||seen.has(q.id)||!Number.isInteger(answers[i]))throw Error('Invalid assessment item');
  seen.add(q.id);
  if(mode!=='soul'&&q.dimension!==Math.floor(q.id/perDimension))throw Error('Invalid assessment dimension');
  const optionCount=mode==='type'?2:mode==='motive'?3:soulQs[q.id][1].length;
  const values=Array.isArray(q.opts)?q.opts.map(o=>o?.[2]):[];
  if(values.length!==optionCount||new Set(values).size!==optionCount||values.some(v=>!Number.isInteger(v)||v<0||v>=optionCount)||answers[i]<0||answers[i]>=optionCount)throw Error('Invalid assessment choices');
 }
 return releaseScoreBefore(mode,rows,answers)
};
const releaseChartDetailsBefore=renderChartConsultation;
renderChartConsultation=function(out,z){
 releaseChartDetailsBefore(out,z);
 const section=out.querySelector('.chartConsultation');if(!section)return;
 const panel=element('div','',section,'releaseChartDetails');
 element('strong',tr('Understanding your chart','读懂你的命盘'),panel);
 element('p',tr('Life palace: ','命宫：')+branches[z.life]+' · '+tr('Body palace: ','身宫：')+branches[z.body],panel);
 const bureaus={2:['Water 2','水二局'],3:['Wood 3','木三局'],4:['Metal 4','金四局'],5:['Earth 5','土五局'],6:['Fire 6','火六局']};
 element('p',tr('Five-element bureau: ','五行局：')+tr(...bureaus[z.bureau]),panel);
 element('small',tr('Civil birth time; late Zi hour stays on the entered date. Leap months split after day 15. Main stars only, for cultural exploration.','采用民用出生时间，晚子时仍按输入日期，闰月以十五日分界。仅十四主星，供文化探索。'),panel);
 section.prepend(panel);
};
/* All playable results retain the original short reflective description on share. */
const preferenceResultAxes=[
 [['Where you recharge','如何恢复精力'],['With people','和别人相处'],['Quiet time','独处'],['Think of your last busy day. What actually helped you recover?','想想上一次忙完以后，做什么真的让你恢复了精力？']],
 [['What you notice','你先注意什么'],['Concrete details','具体细节'],['New possibilities','新的可能'],['With a new idea, do you want an example first or room to explore?','遇到新点子时，你想先看例子，还是先自己探索？']],
 [['How you decide','你怎么做决定'],['Consistent criteria','一致的标准'],['People and values','人和价值观'],['Recall a tricky decision. Which consideration was easiest to overlook?','回想一个难做的决定。当时最容易漏掉哪方面的考虑？']],
 [['How you make plans','你怎么安排事情'],['A clear plan','先定计划'],['Room to adapt','保留弹性'],['Where would a little structure help, and where would it get in your way?','哪些事有个计划会更轻松？哪些事留点弹性更好？']]
];
const motiveReflectionPrompts=[
 ['Pick one task that can be good enough today.','选一件今天做到够好就可以的事。'],
 ['Before offering help, ask yourself what support you need too.','帮忙之前，也问问自己需要什么支持。'],
 ['Name something you enjoyed even though nobody kept score.','想一件没人打分、你却做得开心的事。'],
 ['What did you enjoy recently without feeling the need to explain it?','最近有没有哪件事，你喜欢就喜欢，不用解释？'],
 ['Where would sharing one unfinished thought make something easier?','有没有哪件事，只要说出一个还没想完整的点子，就会轻松一点？'],
 ['Pick one uncertainty you can leave without a backup plan today.','挑一件今天可以不准备备用方案的事。'],
 ['What is one good option worth staying with for a little longer?','有没有一个还不错的选择，值得多试一会儿？'],
 ['Recall when you felt heard without having to push for it.','回想一次不用争取也有人认真听你说话的时候。'],
 ['Practise saying one preference before asking what everyone else wants.','在问大家想要什么之前，先说出自己的一个偏好。']
];
/* PAW_CORE_RESULT_BEGIN */
// The prompts describe today's answers; none assigns a fixed trait.
const pawPreferenceReflections=[
 [['Company seems to restore your energy today. Leave room for quieter breaks, too.','这次的回答偏向从相处中充电，也记得给自己留一点安静时间。'],['Both company and solitude may help, depending on the day.','有人陪伴和独处都可能让你恢复精力，要看当天的状态。'],['Quiet time seems restorative today. Company can still be welcome on your terms.','这次的回答偏向独处充电，也可以按自己的节奏享受陪伴。']],
 [['You leaned toward tangible details. Try connecting one detail to a bigger idea.','这次你更留意具体细节，可以试着把一个细节和更大的想法联系起来。'],['You made room for both evidence and possibilities.','你既留意具体事实，也愿意想象新的可能。'],['You leaned toward possibilities. Try grounding one promising idea in a small experiment.','这次你更关注新的可能，可以用一个小实验让好点子落地。']],
 [['You leaned toward consistent criteria. Check whose needs might be missed.','这次你更看重一致的标准，也可以留意谁的需要可能被忽略。'],['Both clear criteria and personal values informed your choices.','你的选择同时考虑了明确的标准和个人价值。'],['You leaned toward people and values. Check which shared criteria would help everyone.','这次你更关注人和价值观，也可以想想什么共同标准能帮助大家。']],
 [['You leaned toward a plan. Keep one small part of the day unscheduled.','这次你更喜欢提前安排，不妨给今天留一点空白。'],['You made room for structure and changes of plan.','你既需要一定的安排，也给变化留了空间。'],['You leaned toward flexibility. One simple anchor may make the day easier.','这次你更喜欢灵活安排，一个简单的小目标或许能让一天更轻松。']]
];
function pawPreferenceReflection(index,first,second){
 if(!Number.isInteger(index)||index<0||index>=4||!Number.isInteger(first)||!Number.isInteger(second)||first<0||second<0||first+second!==4)return null;
 return pawPreferenceReflections[index][first>second?0:first===second?1:2]
}
function pawSoulPortrait(saved,bank){
 if(!Array.isArray(bank)||!bank.length||!Array.isArray(saved?.scores)||saved.scores.length!==8)return null;
 const opportunities=Array(8).fill(0);
 for(const row of bank){if(!Array.isArray(row?.[1]))return null;for(const k of new Set(row[1].flatMap(v=>v[2]))){if(!Number.isInteger(k)||k<0||k>=8)return null;opportunities[k]++}}
 if(opportunities.some(v=>!v)||saved.scores.some((v,i)=>!Number.isInteger(v)||v<0||v>opportunities[i]))return null;
 const ranked=saved.scores.map((score,index)=>({index,score,opportunity:opportunities[index],rate:score/opportunities[index]})).sort((a,b)=>b.rate-a.rate||a.index-b.index);
 return {ranked,leaders:ranked.filter(v=>Math.abs(v.rate-ranked[0].rate)<1e-8)}
}
/* PAW_CORE_RESULT_END */
function openWonderResult(mode,result){
 page(tr(...wonderSceneNames[mode]),tr(...result.name),q=>{
  const body=element('section','',q,'readingNotes');
  const saved=wonderSaved[mode],balance=releaseAssessmentBalance(mode,saved);
  if(mode==='type'&&balance){
   element('p',tr('Each pair shows four answers from this visit. An even split can reflect different situations.','每一组来自这次的四个回答。两边持平，可能只是你在不同情境下会有不同做法。'),body);
   balance.forEach(({first,second},i)=>{
    const item=element('article','',body,'readingNote'),[title,a,b,prompt]=preferenceResultAxes[i];
    element('h2',tr(...title),item);
    element('p',tr(...a)+' '+first+'/4 · '+tr(...b)+' '+second+'/4',item);
    const reflection=pawPreferenceReflection(i,first,second);if(reflection)element('p',tr(...reflection),item);
    element('p',tr(...prompt),item,'readingPrompt');
   });
  }else if(mode==='motive'&&balance){
   element('p',tr('Each motive has three statements. Where scores are close, read the themes side by side.','每种动力对应三道题。分数接近时，可以把它们放在一起看。'),body);
   const leaders=balance.flat?[]:balance.close;
   const list=element('ol','',body,'wonderMotiveScores');
   balance.ranked.forEach(({index,score})=>element('li',tr(...wonderMotives[index].slice(0,2))+' · '+score+'/6',list));
   if(balance.flat)element('p',tr(...result.desc),body);
   leaders.slice(0,3).forEach(({index})=>element('p',tr(...motiveReflectionPrompts[index]),body,'readingPrompt'));
  }else if(mode==='soul'&&pawSoulPortrait(saved,soulQs)){
   const portrait=pawSoulPortrait(saved,soulQs);
   element('p',tr('Six little choices can point to more than one cat. Each match is counted relative to the opportunities for that cat. This is a playful reflection, not a psychological test.','六个小选择可能指向不止一种猫灵。每只猫灵按出现机会计算匹配次数。这只是趣味探索，并非心理测评。'),body);
   if(portrait.leaders.length>1)element('p',tr('These cats tied. There is no single winner.','这些猫灵并列，没有唯一答案。'),body);
   portrait.leaders.forEach(({index,score,opportunity})=>{const cat=soulCats[index],item=element('article','',body,'readingNote');element('h2',tr(cat[0],cat[1]),item);element('p',score+'/'+opportunity,item);element('p',tr(cat[2],cat[3]),item)});
  }else element('p',tr(...result.desc),body);
  const actions=element('nav','',body,'pawReadingActions');actions.setAttribute('aria-label',tr('Reading actions','解读操作'));
  b(actions,tr('Share keepsake','分享纪念卡'),()=>wonderSceneShare(()=>openWonderResult(mode,result)));
  b(actions,tr('Try again','再测一次'),()=>wonderSceneOpen(mode));
 });
 journalLanguage(()=>openWonderResult(mode,result));
}
wonderSceneShare=function(back=null){
 const result=wonderSceneResult,mode=wonderSceneMode;if(!result)return;
 let lines=[result.desc];
 if(mode==='type'){
  const balance=releaseAssessmentBalance(mode,wonderSaved.type);
  if(balance)lines=balance.map(({first,second},i)=>{
   const [,a,b]=preferenceResultAxes[i];
   return a.map((label,j)=>label+' '+first+'/4 · '+b[j]+' '+second+'/4');
  });
 }
 if(mode==='motive'){
  const balance=releaseAssessmentBalance(mode,wonderSaved.motive),lead=balance?.ranked[0];
  if(lead&&!balance.flat&&balance.close.length===1)lines=[wonderMotives[lead.index].slice(2,4),motiveReflectionPrompts[lead.index]];
 }
 openMeowShare({kind:mode,title:result.name,lines,accent:result.color},back);
};
const releaseChartStyle=document.createElement('style');releaseChartStyle.textContent='.releaseChartDetails{padding:12px;border:1px solid #b7a17c;border-radius:5px;background:#f6ead3;margin:0 0 14px;line-height:1.45}.releaseChartDetails p{margin:5px 0}.releaseChartDetails small{display:block;font-size:12px}';document.head.append(releaseChartStyle);


/* PAW_DISCOVERY_ACTIVE_TURN_BEGIN */
function pawCafeTurnElapsed(elapsed,last,now,blocked){
 if(![elapsed,last,now].every(Number.isFinite)||elapsed<0)return 0;
 return blocked?elapsed:elapsed+Math.min(50,Math.max(0,now-last));
}
function pawCafeTurnMatches(origin,current){
 return !!origin&&!!current&&origin.run===current.run&&origin.token===current.token&&origin.round===current.round&&origin.room===current.room&&current.activity==='match'&&current.scene==='wonder'&&current.phase==='turn';
}
/* PAW_DISCOVERY_ACTIVE_TURN_END */
function pawCafeTurnContext(){
 return {run:state,token:cafeToken,round:cafeRound,room,activity,scene,phase:cafePhase};
}
// A response is acknowledged while the player is actually present, rather
// than completing on a background timeout. Keep the existing scoring and
// collection identifiers, including historical tied-style keepsakes.
cafeChoose=function(i){
 if(activity!=='match'||scene!=='wonder'||room!=='match'||cafePhase!=='question'||pawArcadeInputBlocked()||!Number.isInteger(i)||!cafeQuestions[cafeRound]?.[1]?.[i]||cafeAnswers.length!==cafeRound)return;
 cafePick=i;cafePhase='turn';cafeAt=t;sound(450+i*70);
 const origin=pawCafeTurnContext();let elapsed=0,last=performance.now();
 function acknowledge(now){
  if(!pawCafeTurnMatches(origin,pawCafeTurnContext()))return;
  const blocked=pawArcadeInputBlocked()||document.hidden;
  elapsed=pawCafeTurnElapsed(elapsed,last,now,blocked);last=now;
  if(blocked||elapsed<350&&!matchMedia('(prefers-reduced-motion: reduce)').matches){requestAnimationFrame(acknowledge);return}
  cafeAnswers.push(i);cafeRound++;cafePick=-1;cafeAt=t;
  if(cafeRound===cafeQuestions.length){
   const scores=[0,0,0];cafeAnswers.forEach(k=>scores[k]++);
   const max=Math.max(...scores),ties=scores.map((v,k)=>v===max?k:-1).filter(k=>k>=0);
   cafeResult={index:ties[0],ties};save('cafeStyleV1',cafeResult);
   addItem('Café discovery: '+cafeKinds[ties[0]][0],'缘分咖啡馆：'+cafeKinds[ties[0]][1]);
   cafePhase='result';sound(660)
  }else cafePhase='question';
 }
 requestAnimationFrame(acknowledge)
};
// Reading surfaces should turn to the top of each new question or chapter,
// without jumping while the same card is turning or a detail is expanded.
function pawReadingSurfaceKey(kind){
 if(kind==='wonder')return [wonderSceneToken,wonderSceneAnswers.length,zh].join('|');
 if(kind==='story')return [parallelToken,parallelNode,zh].join('|');
 return [cafeToken,cafeRound,zh].join('|')
}
function pawSyncReadingSurface(panel,kind,render,args){
 const first=panel.firstElementChild,oldKey=panel.dataset.pawReadingLeaf,focused=panel.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');
 const value=render(...args);
 if(panel.hidden)return value;
 const key=pawReadingSurfaceKey(kind);
 if(first!==panel.firstElementChild){
  panel.setAttribute('role','group');
  panel.setAttribute('aria-label',kind==='wonder'?tr('Discovery notebook','奇遇小记'):kind==='story'?tr('Story letter','故事来信'):tr('Conversation cards','相处话题卡'));
  panel.dataset.pawReadingLeaf=key;
  if(oldKey!==key)panel.scrollTop=0;
  if(focused&&oldKey!==key){
   const button=panel.querySelector('button:not([disabled])');
   if(button)button.focus({preventScroll:true})
  }
  if(kind==='cafe'){
   const origin=pawCafeTurnContext();
   for(const button of panel.querySelectorAll('button')){
    const callback=button.onclick;if(typeof callback!=='function')continue;
    button.onclick=function(...values){
     const current=pawCafeTurnContext();
     if(origin.run!==current.run||origin.token!==current.token||origin.round!==current.round||origin.room!==current.room||current.phase!=='question'||panel.hidden||!button.isConnected)return;
     return callback.apply(this,values)
    }
   }
  }
 }
 return value
}
const pawReleaseWonderSheet=syncWonderSheet,pawReleaseStorySheet=syncStorySheet,pawReleaseCafeSheet=syncCafeQuestionSheet;
syncWonderSheet=function(...args){return pawSyncReadingSurface(wonderQuestionSheet,'wonder',pawReleaseWonderSheet,args)};
syncStorySheet=function(...args){return pawSyncReadingSurface(storySheet,'story',pawReleaseStorySheet,args)};
syncCafeQuestionSheet=function(...args){return pawSyncReadingSurface(cafeQuestionSheet,'cafe',pawReleaseCafeSheet,args)};
const pawDiscoveryReadingStyle=document.createElement('style');
pawDiscoveryReadingStyle.textContent=`
/* PAW_DISCOVERY_SINGLE_LEAF_BEGIN */
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet){
 background:#f0e3c9 url('assets/visual/painted/recovered/ui/paper_texture.webp') center/auto 180px repeat!important;
 box-sizing:border-box!important;overflow-wrap:anywhere;overscroll-behavior:contain;scrollbar-width:thin;
 border:0!important;border-radius:7px!important;box-shadow:0 2px 9px #30291e35!important;
 padding:9px 12px!important;max-width:calc(100% - 24px)!important;overflow-y:auto!important;overflow-x:hidden!important;
}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet)>:is(p,small,strong){min-width:0;max-width:100%;overflow-wrap:anywhere;line-height:1.4;margin-block:4px}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) button{
 min-height:44px!important;min-width:0!important;white-space:normal!important;overflow-wrap:anywhere!important;max-width:100%!important;
 background:transparent!important;border:0!important;border-bottom:1px solid #b49d785e!important;border-radius:0!important;box-shadow:none!important;
 color:#405440!important;text-align:start!important;padding:6px 8px!important;font-size:14px!important;line-height:1.35!important;
}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) button[aria-pressed=true]{background:#dbe1cb!important;color:#395846!important}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) :is(button,summary):focus-visible{outline:2px solid #3c6654!important;outline-offset:-3px}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) button:disabled{opacity:.68}
html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet)[hidden]{display:none!important}
html #game #content .readingNotes{max-width:100%!important;min-width:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important}
html #game #content .readingNotes .readingNote{min-width:0!important;padding:10px 0!important;margin:0!important;background:none!important;border:0!important;border-bottom:1px solid #b49d785e!important;border-radius:0!important;box-shadow:none!important}
html #game #content .readingNotes .readingNote :is(h2,p){overflow-wrap:anywhere;line-height:1.45;margin-block:4px}
html #game #content .readingNotes .readingPrompt{background:none!important;border:0!important;box-shadow:none!important;padding:4px 0!important;color:#405440!important}
html #game #content .readingNotes .pawReadingActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:10px 0 0}
html #game #content .readingNotes .pawReadingActions button{min-width:0!important;min-height:44px!important;white-space:normal!important;overflow-wrap:anywhere!important;background:transparent!important;border:0!important;border-bottom:1px solid #b49d785e!important;box-shadow:none!important;border-radius:0!important;color:#405440!important}
html #game #content .readingNotes .pawReadingActions button:focus-visible{outline:2px solid #3c6654!important;outline-offset:-3px}
@media(max-width:480px){html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet)[data-paw-discovery-plate]{max-height:min(53dvh,380px)!important}}
@media(forced-colors:active){
 html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet){background:Canvas!important;color:CanvasText!important;border:1px solid CanvasText!important}
 html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) button,html #game #content .readingNotes .pawReadingActions button{color:ButtonText!important;border-bottom:1px solid ButtonText!important}
 html #game :is(#wonderQuestionSheet,#storyReadingSheet,#cafeQuestionSheet) button[aria-pressed=true]{background:Highlight!important;color:HighlightText!important}
}
/* PAW_DISCOVERY_SINGLE_LEAF_END */
`;document.head.append(pawDiscoveryReadingStyle);


/* PAW_STORY_CHAPTER_TURN_BEGIN */
function pawStoryTurnMatches(origin,current){
 return !!origin&&!!current&&origin.run===current.run&&origin.token===current.token&&origin.node===current.node&&origin.room===current.room&&current.activity==='story'&&current.scene==='wonder'&&current.turning===true;
}
function pawStoryNextNode(node,index,scenes,endings){
 if(!Number.isInteger(index)||index<0)return null;
 const next=node?.choices?.[index]?.[2];
 return typeof next==='string'&&(Object.hasOwn(scenes,next)||Object.hasOwn(endings,next))?next:null;
}
function pawStoryTurnReady(elapsed,ready,reduced,blocked){
 return !blocked&&(ready||elapsed>=1700)&&(reduced||elapsed>=420)
}
/* PAW_STORY_CHAPTER_TURN_END */
function pawStoryTurnContext(){
 return {run:state,token:parallelToken,node:parallelNode,room,activity,scene,turning:parallelTurning}
}
// Hold the current illustrated chapter while the next painting prepares.
// Do not push history or grant a keepsake until the actual chapter turns.
parallelSelect=function(i){
 if(activity!=='story'||scene!=='wonder'||room!=='story'||parallelTurning||pawArcadeInputBlocked())return;
 const next=pawStoryNextNode(parallelScenes[parallelNode],i,parallelScenes,parallelEndings);if(!next)return;
 const im=pics[parallelScenes[next]?.art||parallelEndings[next]?.[4]||'streetStation'];
 let ready=!im||!!(im.complete&&im.naturalWidth>0);
 if(!ready&&typeof im.decode==='function')im.decode().then(()=>ready=!!im.naturalWidth).catch(()=>{});
 parallelTurning=true;parallelPick=i;parallelAt=t;sound(490+i*80);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)actorGesture('wave',i===0?-1:1);
 const origin=pawStoryTurnContext();let elapsed=0,last=performance.now();
 function turn(now){
  if(!pawStoryTurnMatches(origin,pawStoryTurnContext()))return;
  const blocked=pawArcadeInputBlocked()||document.hidden;
  elapsed=pawCafeTurnElapsed(elapsed,last,now,blocked);last=now;
  if(!pawStoryTurnReady(elapsed,ready||!!im?.naturalWidth,matchMedia('(prefers-reduced-motion: reduce)').matches,blocked)){requestAnimationFrame(turn);return}
  parallelTrail.push(origin.node);parallelNode=next;parallelAt=t;parallelPick=-1;parallelTurning=false;
  if(Object.hasOwn(parallelEndings,next)){
   const end=parallelEndings[next];
   if(!parallelFound.includes(next)){parallelFound.push(next);save('parallelEndingsV1',parallelFound)}
   addItem('Parallel life: '+end[0],'平行人生：'+end[1]);sound(660)
  }
 }
 requestAnimationFrame(turn)
};


/* PAW_MAPPED_DISCOVERY_PLATE_BEGIN */
function pawDiscoveryPlateKind(district,id,act,visit,ready){
 if(district!=='wonder'||id!==visit||!ready)return null;
 if(['quiz','story','match'].includes(id)&&act==='wonderScene')return 'wonder';
 if(id==='match'&&act==='match')return 'cafe';
 if(id==='story'&&act==='story')return 'story';
 return null
}
function pawDiscoveryPlateFrame(base,foot,width,height){
 if(!base||!foot||![base.s,base.ox,base.oy,width,height,...foot].every(Number.isFinite)||base.s<=0)return base;
 if(width>=900&&width/height>=1.25)return {...base,ox:width*.34-foot[0]*base.s};
 return {...base,oy:base.oy-Math.max(0,base.oy+foot[1]*base.s-height*.47)}
}
/* PAW_MAPPED_DISCOVERY_PLATE_END */
function pawDiscoveryPlateActive(){
 // These mapped-room helpers are defined by startup before the first frame.
 if(!['quiz','story','match'].includes(room)||scene!=='wonder'||!['wonderScene','match','story'].includes(activity))return null;
 const api=pawReadingAPI(),im=api&&pawReadingImage(api,room);
 return pawDiscoveryPlateKind(scene,room,activity,pawReadingVisit,pawRoomImageReady(im))
}
function pawDiscoveryPlateFoot(){
 const api=pawReadingAPI(),anchor=mb5Return;
 if(anchor?.room===room&&api.safe(room,pawReadingNormalized(anchor.x,anchor.y)))return [anchor.x,anchor.y];
 return pawReadingSpec(api,room)?.stations[room]?.slice(2)||null
}
const pawDiscoveryPlateCameraPrior=mobileRoomCamera;
mobileRoomCamera=function(...args){
 if(pawDiscoveryPlateActive()){
  const base=pawReadingCamera(pawReadingAPI(),W,H);
  return pawDiscoveryPlateFrame(base,pawDiscoveryPlateFoot(),W,H)||pawDiscoveryPlateCameraPrior(...args)
 }
 return pawDiscoveryPlateCameraPrior(...args)
};
function pawDrawDiscoveryPlate(){
 const im=pawReadingImage(pawReadingAPI(),room),plate=pawReadingPlate,view=livingBounds(),foot=pawDiscoveryPlateFoot();
 ctx.save();try{
  ctx.fillStyle='#42433c';ctx.fillRect(view.x,view.y,view.w,view.h);
  ctx.drawImage(im,plate.x,plate.y,plate.w,plate.h);
  pawSceneAirLive(room,plate,im);
  if(foot&&Number.isInteger(avatar))backHuman(...foot,avatar,false,'up',travellerRoomScale(H,cam.scale))
 }finally{ctx.restore()}
}
function pawDiscoveryPlatePanel(panel,key,title,prompt){
 if(panel.dataset.pawDiscoveryPlateKey===key&&!panel.hidden)return false;
 panel.dataset.pawDiscoveryPlateKey=key;panel.dataset.pawDiscoveryPlate='true';panel.hidden=false;panel.replaceChildren();
 panel.setAttribute('role','group');panel.setAttribute('aria-label',title);
 panel.scrollTop=0;element('small',title,panel);
 element('p',prompt,panel).setAttribute('aria-live','polite');return true
}
function pawDiscoveryPlateClear(panel){
 if(!panel.hasAttribute('data-paw-discovery-plate'))return;
 panel.removeAttribute('data-paw-discovery-plate');delete panel.dataset.pawDiscoveryPlateKey;panel.hidden=true
}
const pawPlateWonderPrior=syncWonderSheet,pawPlateCafePrior=syncCafeQuestionSheet;
syncWonderSheet=function(...args){
 const panel=wonderQuestionSheet;
 if(pawDiscoveryPlateActive()!=='wonder'){pawDiscoveryPlateClear(panel);return pawPlateWonderPrior(...args)}
 if(pawArcadeInputBlocked()){panel.hidden=true;return}
 const token=wonderSceneToken,run=state,phase=wonderScenePhase,mode=wonderSceneMode,index=wonderSceneAnswers.length;
 const current=()=>pawDiscoveryPlateActive()==='wonder'&&run===state&&token===wonderSceneToken&&phase===wonderScenePhase&&index===wonderSceneAnswers.length&&!pawArcadeInputBlocked();
 const title=tr(...wonderSceneNames[mode]),key=[token,index,phase,zh].join('|');
 if(phase==='welcome'){
  if(pawDiscoveryPlatePanel(panel,key,title,tr('Take your time. Open the notebook when you are ready.','慢慢来，准备好就翻开小记吧。')))b(panel,tr('Begin our conversation','开始我们的对话'),()=>{if(current()){wonderScenePhase='question';wonderSceneAt=t;sound(480)}});
 }else if(phase==='result'&&wonderSceneResult){
  const result=wonderSceneResult;
  if(pawDiscoveryPlatePanel(panel,key,title,tr(...result.name)+' · '+tr(...result.desc))){
   b(panel,tr('View details','看看解读'),()=>{if(current())openWonderResult(mode,result)});
   b(panel,tr('Share keepsake','分享纪念卡'),()=>{if(current())wonderSceneShare()});
   b(panel,tr('Try again','再试一次'),()=>{if(current())wonderSceneOpen(mode)})
  }
 }else if(['question','turn'].includes(phase)){
  const d=wonderSceneData();if(!d){panel.hidden=true;return}
  if(!pawDiscoveryPlatePanel(panel,key,title+' · '+(index+1)+' / '+d.total,tr(...d.prompt)))return;
  const frame=pawDiscoveryFrame();
  d.opts.forEach((o,i)=>{const btn=b(panel,tr(o[0],o[1]),()=>{if(current())wonderSceneChoose(i,frame)});btn.disabled=phase!=='question';if(wonderScenePick===i)btn.classList.add('selected')});
  if(index&&phase==='question')b(panel,tr('Previous','上一题'),()=>{if(current())pawDiscoveryBack(frame)})
 }else panel.hidden=true
};
syncCafeQuestionSheet=function(...args){
 const panel=cafeQuestionSheet;
 if(pawDiscoveryPlateActive()!=='cafe'){pawDiscoveryPlateClear(panel);return pawPlateCafePrior(...args)}
 if(pawArcadeInputBlocked()){panel.hidden=true;return}
 const token=cafeToken,run=state,round=cafeRound,phase=cafePhase,key=[token,round,phase,zh].join('|');
 const current=()=>pawDiscoveryPlateActive()==='cafe'&&state===run&&cafeToken===token&&cafeRound===round&&cafePhase===phase&&!pawArcadeInputBlocked();
 // Startup owns the result and sharing controls.
 if(phase==='result'){panel.dataset.pawDiscoveryPlate='true';return pawPlateCafePrior(...args)}
 const title=tr('A cup of tea together','一起喝杯茶');
 if(phase==='welcome'){
  if(pawDiscoveryPlatePanel(panel,key,title,tr('Take a moment at the table. What kind of company feels right today?','在茶桌旁歇一歇，今天想要怎样的陪伴？')))b(panel,tr('Join me for tea','一起喝杯茶'),()=>{if(current()){cafePhase='question';cafeAt=t;sound(490)}});
 }else if(['question','turn'].includes(phase)){
  const q=cafeQuestions[round];if(!q){panel.hidden=true;return}
  if(!pawDiscoveryPlatePanel(panel,key,title+' · '+(round+1)+' / '+cafeQuestions.length,tr(...q[0])))return;
  q[1].forEach((o,i)=>{const btn=b(panel,tr(...o),()=>{if(current())cafeChoose(i)});btn.disabled=phase!=='question';btn.setAttribute('aria-pressed',String(cafePick===i))})
 }else panel.hidden=true
};
/* PAW_STORY_LETTER_ART_BEGIN */
function pawStoryLetterArt(node,scenes,endings){
 if(Object.hasOwn(scenes,node))return scenes[node]?.art||null;
 if(Object.hasOwn(endings,node))return endings[node]?.[4]||null;
 return null
}
function pawStoryLetterCurrent(origin,live){
 return !!origin&&!!live&&origin.run===live.run&&origin.token===live.token&&origin.node===live.node&&live.room==='story'&&live.activity==='story'&&live.scene==='wonder'
}
/* PAW_STORY_LETTER_ART_END */
const pawPlateStoryPrior=syncStorySheet;
syncStorySheet=function(...args){
 const panel=storySheet,active=pawDiscoveryPlateActive()==='story';
 if(!active){pawDiscoveryPlateClear(panel);return pawPlateStoryPrior(...args)}
 const value=pawPlateStoryPrior(...args);
 if(panel.hidden)return value;
 panel.dataset.pawDiscoveryPlate='true';
 const origin=pawStoryTurnContext(),art=pawStoryLetterArt(parallelNode,parallelScenes,parallelEndings);
 const existing=panel.querySelector('.pawStoryLetterIllustration');
 if(existing&&existing.dataset.chapter===parallelNode)return value;
 if(existing)existing.remove();
 const im=art&&pics[art];
 if(!im?.naturalWidth||!im.src)return value;
 const picture=element('img','',panel,'pawStoryLetterIllustration');
 picture.alt='';picture.src=im.src;picture.dataset.chapter=parallelNode;
 const heading=panel.querySelector('h3');if(heading)heading.after(picture);
 if(!pawStoryLetterCurrent(origin,pawStoryTurnContext()))picture.remove();
 return value
};
const pawDiscoveryPlateDrawPrior=drawActivity;
drawActivity=function(...args){
 const kind=pawDiscoveryPlateActive();
 if(!kind)return pawDiscoveryPlateDrawPrior(...args);
 pawDrawDiscoveryPlate();continuityActivity=activity;
 syncWonderSheet();syncCafeQuestionSheet();syncStorySheet()
};
// The later café result renderer invokes these two helpers directly.
const pawDiscoveryPlateCafeRoomPrior=cafeRoom,pawDiscoveryPlateObjectPrior=wonderSceneObject;
cafeRoom=function(...args){if(pawDiscoveryPlateActive()==='cafe'){pawDrawDiscoveryPlate();return}return pawDiscoveryPlateCafeRoomPrior(...args)};
wonderSceneObject=function(...args){if(pawDiscoveryPlateActive()==='cafe'&&cafePhase==='result')return;return pawDiscoveryPlateObjectPrior(...args)};
const pawDiscoveryPlateStyle=document.createElement('style');
pawDiscoveryPlateStyle.textContent=`
#game :is(#wonderQuestionSheet,#cafeQuestionSheet,#storyReadingSheet)[data-paw-discovery-plate]{max-height:42dvh;bottom:calc(env(safe-area-inset-bottom,0px) + 65px);box-sizing:border-box}
@media(min-width:900px) and (min-aspect-ratio:5/4){#game :is(#wonderQuestionSheet,#cafeQuestionSheet,#storyReadingSheet)[data-paw-discovery-plate]{left:auto;right:clamp(16px,4vw,65px);top:50%;bottom:auto;transform:translateY(-50%);width:min(39vw,440px);max-height:70dvh}}
#game #storyReadingSheet[data-paw-discovery-plate]{display:block;max-height:47dvh}
#game #storyReadingSheet[data-paw-discovery-plate][hidden]{display:none!important}
#game #storyReadingSheet[data-paw-discovery-plate] .pawStoryLetterIllustration{display:block;width:100%;height:clamp(72px,12dvh,130px);object-fit:cover;object-position:center 45%;border:1px solid #b9a27c;box-sizing:border-box;border-radius:3px;margin:5px 0 8px;animation:pawLetterReveal .32s ease-out both}
@keyframes pawLetterReveal{from{opacity:.3;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
@media(min-width:900px) and (min-aspect-ratio:5/4){#game #storyReadingSheet[data-paw-discovery-plate]{max-height:70dvh;display:block}}
@media(prefers-reduced-motion:reduce){#game #storyReadingSheet .pawStoryLetterIllustration{animation:none}}
`;document.head.append(pawDiscoveryPlateStyle);


/* PAW_DEER_ACTIVE_CLOCK_BEGIN */
function pawDeerAdvanceClock(run,now,blocked){
 if(!run||!Number.isFinite(now)||!Number.isFinite(run.deerAt))return false;
 const phase=run.deerPhase,active=['bow','feed','watch'].includes(phase);
 if(!active){delete run.pawDeerClock;return false}
 const prior=run.pawDeerClock;
 if(prior&&prior.phase===phase&&prior.start===run.deerAt&&now>=prior.now){
  const gap=now-prior.now,advance=blocked||prior.blocked?0:Math.min(.05,gap);
  run.deerAt+=gap-advance
 }else if(now>run.deerAt+.05){
  run.deerAt=now-(blocked?0:.05)
 }
 run.pawDeerClock={phase,start:run.deerAt,now,blocked:!!blocked};
 return true
}
function pawDeerControlCurrent(origin,live,action,blocked){
 if(blocked||!origin||!live||origin.run!==live.run||origin.profile!==live.profile||origin.phase!==live.phase||live.room!=='park'||live.activity!=='deerVisit')return false;
 return action==='bow'?['greet','ready'].includes(live.phase):action==='feed'?['greet','ready'].includes(live.phase):action==='watch'?['greet','ready','done'].includes(live.phase):false
}
/* PAW_DEER_ACTIVE_CLOCK_END */
function pawDeerControlContext(){return {run:state,profile:state.deerProfile,phase:state.deerPhase,room,activity}}
const pawDeerClockLoopPrior=loop;
loop=function(ms,...args){
 if(room==='park'&&activity==='deerVisit')pawDeerAdvanceClock(state,ms/1000,pawArcadeInputBlocked());
 return pawDeerClockLoopPrior(ms,...args)
};
const pawDeerRewardPrior=deerVisitReward;
deerVisitReward=function(...args){
 if(room!=='park'||activity!=='deerVisit'||pawArcadeInputBlocked())return;
 return pawDeerRewardPrior(...args)
};
const pawDeerControlPrior=refreshControls;
refreshControls=function(...args){
 const value=pawDeerControlPrior(...args);
 if(room!=='park'||activity!=='deerVisit'||!state.deerProfile)return value;
 const origin=pawDeerControlContext(),buttons=$('gameControls')?.querySelectorAll('.deerMeadowButtons button');
 if(buttons?.length!==3)return value;
 ['bow','feed','watch'].forEach((action,i)=>{
  const button=buttons[i],fn=button.onclick;
  if(typeof fn!=='function')return;
  button.onclick=function(...values){
   if(!button.isConnected||button.disabled||!pawDeerControlCurrent(origin,pawDeerControlContext(),action,pawArcadeInputBlocked()))return;
   return fn.apply(this,values)
  }
 });
 return value
};
const pawDeerActionStyles=document.createElement('style');
pawDeerActionStyles.textContent=`
#game #gameControls.deerMeadowControls{background:#efe3c9 url('assets/visual/painted/recovered/ui/paper_texture.webp') center/auto 180px repeat!important;border:1px solid #b8a17d!important;color:#514936!important;border-radius:9px!important;box-sizing:border-box}
#game #gameControls.deerMeadowControls .deerMeadowButtons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
#game #gameControls.deerMeadowControls .deerMeadowButtons button{white-space:normal;overflow-wrap:anywhere;min-width:0;min-height:44px;padding:6px 5px!important;line-height:1.25}
#game #gameControls.deerMeadowControls .deerMeadowButtons button:focus-visible{outline:2px solid #3b6653;outline-offset:-3px}
@media(max-width:350px){#game #gameControls.deerMeadowControls .deerMeadowButtons button{font-size:12px}}
`;document.head.append(pawDeerActionStyles);


/* PAW_TEA_NATIVE_BOARD_BEGIN */
function pawTeaNoticeSnapshot(rows){
 if(!Array.isArray(rows))return [];
 const seen=new Set();
 const pair=v=>Array.isArray(v)&&v.length>=2&&v.slice(0,2).every(x=>typeof x==='string');
 return rows.filter(v=>{
  if(!v||typeof v.id!=='string'||!v.id||seen.has(v.id)||!Array.isArray(v.thread)||!pair(v.thread[0])||!pair(v.thread[1])||!Array.isArray(v.thread[2]))return false;
  seen.add(v.id);return true
 }).map(v=>({id:v.id,date:v.date,author:v.thread[0].slice(0,2),body:v.thread[1].slice(0,2),replies:v.thread[2].filter(q=>pair(q)&&pair(q.slice(2))).map(q=>q.slice(0,4))}))
}
function pawTeaNoticeIndex(rows,id){
 if(!Array.isArray(rows)||!rows.length)return -1;
 const i=rows.findIndex(v=>v.id===id);return i<0?0:i
}
function pawTeaVisitCurrent(origin,live){
 return !!origin&&!!live&&origin.room==='tea'&&live.room===origin.room&&origin.scene===live.scene&&origin.visit===live.visit&&live.activity===null&&!live.transitioning&&!live.page
}
/* PAW_TEA_NATIVE_BOARD_END */
let pawTeaBoardVisit=0;
const pawTeaBoardEnterPrior=enter;
enter=function(...args){pawTeaBoardVisit++;return pawTeaBoardEnterPrior(...args)};
function pawTeaBoardContext(){return {room,scene,visit:pawTeaBoardVisit,activity,transitioning,page:$('page').style.display==='block'}}
function pawTeaReadBoard(){
 closeTalk();pawRefreshTopicFeed();
 const origin=pawTeaBoardContext(),rows=pawTeaNoticeSnapshot(townPublishedNotices());
 let sequence=0;const serial=++pawTeaConversationSerial;
 const current=()=>pawTeaVisitCurrent(origin,pawTeaBoardContext());
 function display(index=0,reply=-1){
  if(!current())return;
  const id=++sequence,entry=rows[index],choices=[];
  const choice=(en,zh,fn)=>[tr(en,zh),()=>{if(current()&&serial===pawTeaConversationSerial&&sequence===id&&talkOpen)fn()}];
  if(!entry){
   say(tr('Town noticeboard','小镇留言墙'),tr('Nothing pinned yet. Come back for another cup of tea.','暂时没有留言，下次喝茶再来看看。'),[choice('Step away','离开留言墙',closeTalk)]);return
  }
  const body=reply>=0?entry.replies[reply]:null;
  const author=body?tr(body[0],body[1]):tr(...entry.author);
  const words=body?tr(body[2],body[3]):tr(...entry.body);
  const heading=(index+1)+' / '+rows.length+' · '+tr('Fictional resident notices','虚构居民留言');
  if(body){
   if(reply+1<entry.replies.length)choices.push(choice('Next reply','下一条回复',()=>display(index,reply+1)));
   choices.push(choice('Back to notice','回到原留言',()=>display(index)))
  }else{
   if(entry.replies.length)choices.push(choice('Read replies ('+entry.replies.length+')','看看回复（'+entry.replies.length+'）',()=>display(index,0)));
   if(index+1<rows.length)choices.push(choice('Older notice','上一张旧留言',()=>display(index+1)));
   if(index>0)choices.push(choice('Newer notice','下一张新留言',()=>display(index-1)));
   choices.push(choice('Shared traveller posts','真人旅人留言',()=>{closeTalk();communityTab='public';townChatPage()}))
  }
  choices.push(choice('Step away','离开留言墙',closeTalk));
  say(tr('Town noticeboard','小镇留言墙'),heading+'\n\n'+author+'\n'+words,choices)
 }
 display()
}
// The assembled game loads startup after this file. Its tea station
// dispatcher must finish installing before we wrap the final action.
function pawInstallTeaNativeAction(){
 const prior=action;
 action=function(id,...args){
  if(room==='tea'&&!activity&&!transitioning&&$('page').style.display!=='block'){
   if(id==='board')return pawTeaReadBoard();
   if(id==='chat')return pawTeaJoinTable()
  }
  return prior.call(this,id,...args)
 }
}
let pawTeaConversationSerial=0;
function pawTeaJoinTable(){
 closeTalk();
 const origin=pawTeaBoardContext(),serial=++pawTeaConversationSerial;
 const option=(en,cn,fn)=>[tr(en,cn),()=>{if(serial===pawTeaConversationSerial&&talkOpen&&pawTeaVisitCurrent(origin,pawTeaBoardContext()))fn()}];
 say(tr('Auntie Mei','梅姨'),tr('Come over. The tea is hot and the gossip is fresh. No meeting agenda required.','过来喝茶吧。茶是热的，瓜是新鲜的，不用准备会议议程。'),[
  option('Hear the latest gossip','听听最新的瓜',parkSerialTalk),
  option('Chat with Auntie Mei','跟梅姨聊聊',()=>residentConversation('auntie',{n:residentProfiles.auntie.name})),
  option('Chat with Wang Laoban','跟王老板聊聊',()=>residentConversation('wang',{n:residentProfiles.wang.name})),
  option('Office comedy','职场小剧场',gatheringOfficeStory),
  option('Play a table game','来局井字棋',()=>{closeTalk();start('woodenThree')}),
  option('Meet other travellers','认识其他旅人',()=>{closeTalk();communityTab=communityURL()?'public':'lounge';townChatPage()}),
  option('Share a little joy','分享小确幸',()=>{closeTalk();communityTab='gratitude';townChatPage()}),
  option('Keep wandering','继续逛',closeTalk)
 ])
}
queueMicrotask(pawInstallTeaNativeAction);
const pawTeaBoardSayPrior=say;
say=function(name,words,choices=[],...args){
 const result=pawTeaBoardSayPrior(name,words,choices,...args),panel=$('dialogue');
 panel.toggleAttribute('data-paw-tea-board',room==='tea'&&name===tr('Town noticeboard','小镇留言墙'));
 return result
};
const pawTeaBoardClosePrior=closeTalk;
closeTalk=function(...args){$('dialogue').removeAttribute('data-paw-tea-board');return pawTeaBoardClosePrior(...args)};
const pawTeaBoardStyle=document.createElement('style');
pawTeaBoardStyle.textContent=`
#game #dialogue[data-paw-tea-board]{background:#f1e3c8 url('assets/visual/painted/recovered/ui/paper_texture.webp') center/auto 180px repeat!important;border:1px solid #af956d!important;color:#514332!important;border-radius:7px!important;box-sizing:border-box;width:min(calc(100% - 24px),510px)!important;max-height:48dvh;overflow-y:auto;overscroll-behavior:contain}
#game #dialogue[data-paw-tea-board] #line{white-space:pre-wrap;line-height:1.5}
#game #dialogue[data-paw-tea-board] #choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,145px),1fr));gap:5px}
#game #dialogue[data-paw-tea-board] button{min-height:44px;white-space:normal;overflow-wrap:anywhere;color:#524332;background:#f6e9ce;border:1px solid #baa17b}
#game #dialogue[data-paw-tea-board] button:focus-visible{outline:2px solid #46634e;outline-offset:-3px}
`;document.head.append(pawTeaBoardStyle);


/* PAW_THREE_REMATCH_BEGIN */
function pawThreeTurnCurrent(origin,live,blocked){
 return !blocked&&!!origin&&origin===live&&!live.result&&!live.thinking
}
function pawThreeThinkClock(g,now,blocked){
 if(!g||!g.thinking||g.result||!Number.isFinite(now)||!Number.isFinite(g.thinkAt)){if(g)delete g.pawThinkClock;return false}
 const prior=g.pawThinkClock;
 if(prior&&prior.due===g.thinkAt&&now>=prior.now){
  const gap=now-prior.now,step=blocked||prior.blocked?0:Math.min(.05,gap);
  g.thinkAt+=gap-step
 }
 g.pawThinkClock={now,due:g.thinkAt,blocked:!!blocked};return true
}
function pawThreeRematchStarter(previous,opponent){
 return previous?.result&&previous.opponent===opponent&&previous.pawStarter!==2?2:1
}
/* PAW_THREE_REMATCH_END */
const pawThreePlayPrior=threePlay;
threePlay=function(i){
 if(!threeActive()||!pawThreeTurnCurrent(state.threeGame,state.threeGame,pawArcadeInputBlocked()))return;
 return pawThreePlayPrior(i)
};
const pawThreeAdvancePrior=threeAdvance;
threeAdvance=function(g){
 if(!threeActive()||state.threeGame!==g)return;
 const blocked=pawArcadeInputBlocked();pawThreeThinkClock(g,t,blocked);
 if(blocked)return;
 return pawThreeAdvancePrior(g)
};
function pawThreeRematch(g,opponent){
 if(!threeActive()||state.threeGame!==g||pawArcadeInputBlocked())return;
 const starter=pawThreeRematchStarter(g,opponent),next=threeNew(opponent);
 next.pawStarter=starter;state.threeGame=next;
 if(starter===2){next.thinking=true;next.thinkAt=t+.55;threeSay(next,'turn')}
 refreshControls()
}
const pawThreeControlsPrior=refreshControls;
refreshControls=function(...args){
 const value=pawThreeControlsPrior(...args);
 if(!threeActive())return value;
 const g=state.threeGame,el=$('gameControls'),buttons=el.querySelectorAll('button');
 if(buttons.length!==2)return value;
 const [opponent,restart]=buttons;
 if(g.pawConfirmRestart&&!g.result)restart.textContent=tr('Confirm new round','确认重新开局');
 opponent.onclick=()=>{if(!opponent.disabled&&opponent.isConnected)pawThreeRematch(g,g.opponent==='cat'?'auntie':'cat')};
 restart.onclick=()=>{
  if(!restart.isConnected||!threeActive()||state.threeGame!==g||pawArcadeInputBlocked())return;
  if(!g.result&&g.board.some(Boolean)&&!g.pawConfirmRestart){
   g.pawConfirmRestart=true;restart.textContent=tr('Confirm new round','确认重新开局');
   return
  }
  pawThreeRematch(g,g.opponent)
 };
 const status=el.querySelector('[role=status]');
 if(status&&!g.board.some(Boolean)&&g.thinking)status.textContent=tr('Opponent goes first','这局对手先下');
 return value
};
const pawThreePlayConfirmationPrior=threePlay;
threePlay=function(i){
 if(threeActive()&&pawThreeTurnCurrent(state.threeGame,state.threeGame,pawArcadeInputBlocked()))delete state.threeGame.pawConfirmRestart;
 return pawThreePlayConfirmationPrior(i)
};

/* PAW_CONTINUOUS_FORTUNE_BEGIN */
function pawPairedFailures(q){return Number.isInteger(q?.pawFortuneFailures)?Math.max(0,Math.min(3,q.pawFortuneFailures)):0}
function pawPairedNext(q,kind,now,blocked){
 if(blocked||!q||!Number.isInteger(q.pawFortuneNumber)||q.pawFortuneNumber<1||q.pawFortuneNumber>12||q.pawPairedWalk)return null;
 if(kind==='sticks'&&q.stickDelivered)return 'confirm';
 if(kind==='moon'&&!q.moonPending&&!(q.tossUntil>now)){
  if(q.count===0)return 'toss';
  if(q.count===1){
   if(q.result!==0&&Number.isFinite(q.pawFortuneSettledAt)&&now-q.pawFortuneSettledAt<1.2)return null;
   return q.result===0?'receive':pawPairedFailures(q)>=3?'finish':'retry'
  }
 }
 return null
}
function pawPairedCamera(w,h,p){
 if(![w,h,p?.w,p?.h].every(Number.isFinite)||Math.min(w,h,p.w,p.h)<=0)return null;
 // Cover portrait screens without losing either station on unusually tall phones.
 const s=w<h?Math.min(Math.max(w/p.w,h/p.h),w/(p.w*.70)):Math.min(w/p.w,h/p.h);
 return {s,ox:(w-p.w*s)/2-p.x*s,oy:(h-p.h*s)/2-p.y*s}
}
function pawPairedWalkPlan(from,painted,g,p,now){
 const point=(u,v)=>({x:p.x+u*p.w,y:p.y+v*p.h});
 const stick=painted?g.stickFoot:point(.26,.64);
 const pickup=painted?g.stickPickFoot:{x:point(.37,.66).x-15,y:point(.37,.66).y+4};
 const moon=painted?g.moonFoot:point(.70,.64);
 const origin=from==='sticks'?pickup:moon,dest=from==='sticks'?moon:stick;
 const lane=Math.max(origin.y,dest.y)+12;
 return {to:from==='sticks'?'moon':'sticks',pos:{...origin},path:[{x:origin.x,y:lane},{x:dest.x,y:lane},{...dest}],last:now,dir:dest.x>origin.x?'right':'left'}
}
function pawPairedWalkTick(q,now,blocked,reduced){
 const dt=Math.max(0,Math.min(.05,now-q.last));q.last=now;
 if(blocked)return false;
 let budget=reduced?Infinity:145*dt;
 while(q.path.length){
  const next=q.path[0],dx=next.x-q.pos.x,dy=next.y-q.pos.y,d=Math.hypot(dx,dy);
  if(d>.01)q.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
  if(d<=budget+.001){q.pos={...next};q.path.shift();budget-=d}
  else{q.pos.x+=dx/d*budget;q.pos.y+=dy/d*budget;break}
 }
 return q.path.length===0
}
function pawGardenEntryRest(nodes,now){
 return {painted:true,pos:nodes.entry.slice(),route:[],action:null,last:now,dir:'up'}
}
/* PAW_CONTINUOUS_FORTUNE_END */
// Install after startup has installed all native activity and camera wrappers.
function pawInstallContinuousFortune(){
 let exhausted=false,transfer=false;
 const active=()=>room==='temple'&&['sticks','moon'].includes(activity)&&!!state.pawPairedRitual;
 const entryPrior=enter;
 enter=function(id,...args){if(id==='temple')exhausted=false;return entryPrior.call(this,id,...args)};
 const startPrior=start;
 start=function(id,...args){
  if(room==='temple'&&['sticks','moon'].includes(id)){
   if(exhausted&&!transfer){hint('Three attempts are enough for today. Come back another time.','今天三次未得圣杯，先随缘，下次再来吧。');return false}
   if(!transfer)id='sticks';
   const art=pawRoomImageReady(pawAlcoveArt()),hall=pawRoomImageReady(pawHallArt());
   if(!art&&!hall){hint('The fortune alcove is getting ready. Try again in a moment.','求签处正在准备，稍后再试。');return false}
   const result=startPrior.call(this,id,...args);
   if(activity===id){state.pawPairedRitual=true;state.pawAlcovePainting=art;state.pawFortuneFailures=0}
   return result
  }
  const result=startPrior.call(this,id,...args);
  if(room==='temple'&&id==='secretGarden'&&state.pawRearGarden){
   state.pawGardenWalk=pawGardenEntryRest(pawRearGardenNodes,t);
   hint('Take a moment here, then choose where to walk.','先在入口歇一歇，再选想去的地方。')
  }
  return result
 };
 const guidePrior=roomGuideEntries;
 roomGuideEntries=function(...args){const v=guidePrior.apply(this,args);return room==='temple'?v.filter(x=>x[0]!=='moon').map(x=>x[0]==='sticks'?['sticks','Draw and confirm a fortune','求签与掷筊']:x):v};
 const labelPrior=label;
 label=function(...args){
  if(room==='temple'&&!activity&&pawStationPlaque?.id==='moon'){pawStationPlaque=null;return}
  return labelPrior.apply(this,args)
 };
 const roomPrior=drawRoom;
 drawRoom=function(...args){const v=roomPrior.apply(this,args);if(room==='temple'&&!activity)hit=hit.filter(h=>h.stationId!=='moon');return v};
 const cameraPrior=mobileRoomCamera;
 mobileRoomCamera=function(...args){return active()?pawPairedCamera(W,H,state.pawAlcovePainting?pawWaterPlate:pawHallPlate)||cameraPrior(...args):cameraPrior(...args)};
 const nextPrior=pawFortuneNext;
 pawFortuneNext=function(q,kind,now,blocked){return q?.pawPairedRitual?pawPairedNext(q,kind,now,blocked):nextPrior(q,kind,now,blocked)};
 const movePrior=pawFortuneMove;
 pawFortuneMove=function(action,run=state){
  if(!active())return movePrior(action,run);
  if(run!==state||!['confirm','retry'].includes(action)||pawPairedNext(run,activity,t,pawArcadeInputBlocked())!==action)return false;
  releaseWalkKeys();joystickReset();
  run.pawPairedWalk=pawPairedWalkPlan(activity,run.pawAlcovePainting,pawAlcoveGeometry(),pawHallPlate,t);
  hint(...(action==='confirm'?['Walk over to the moon blocks with your stick.','拿着签，走到旁边掷筊。']:['Return the unconfirmed stick and walk back to the holder.','这支签还未确认，放回去，再走到签筒前。']));
  mb5AssistSync(true);return true
 };
 const ritualPrior=pawRitualAdvance;
 pawRitualAdvance=function(...args){
  if(active()&&state.pawPairedWalk)return;
  const run=state,settling=active()&&activity==='moon'&&run.moonPending;
  const v=ritualPrior.apply(this,args);
  if(settling&&run===state&&!run.moonPending&&run.count===1&&run.result!==0){
   run.pawFortuneFailures=Math.min(3,pawPairedFailures(run)+1);
   if(run.pawFortuneFailures===3){
    exhausted=true;$('toast').classList.remove('on');
    hint('Three casts without Sheng Bei. Leave the stick here and come back another time.','三次未得圣杯，今天就先到这里吧。把签放回去，下次再来。')
   }else hint('No Sheng Bei ('+run.pawFortuneFailures+'/3). Draw another stick.','未得圣杯（'+run.pawFortuneFailures+'/3），请重新求签。')
  }
  return v
 };
 const tossPrior=pawMoonToss;
 pawMoonToss=function(...args){if(active()&&(state.pawPairedWalk||pawPairedNext(state,activity,t,pawArcadeInputBlocked())!=='toss'))return false;return tossPrior.apply(this,args)};
 const shakePrior=shakeFortuneStick,pickPrior=pickupFortuneStick;
 shakeFortuneStick=function(...args){return active()&&state.pawPairedWalk?false:shakePrior.apply(this,args)};
 pickupFortuneStick=function(...args){return active()&&state.pawPairedWalk?false:pickPrior.apply(this,args)};
 const specPrior=mb5AssistSpec;
 mb5AssistSpec=function(kind,q,now){
  if(q?.pawPairedRitual&&q.pawPairedWalk)return {key:'paired-walking',label:['Walking to the next station…','走向旁边的体验区……'],disabled:true};
  if(q?.pawPairedRitual&&pawPairedNext(q,kind,now,false)==='finish')return {key:'paired-finish',label:['Leave the stick. Try another day.','放回签，下次再来'],action:'paired-finish'};
  return specPrior(kind,q,now)
 };
 const performPrior=mb5AssistPerform;
 mb5AssistPerform=function(action){
  if(action==='paired-finish'){
   if(!active()||pawPairedNext(state,activity,t,pawArcadeInputBlocked())!=='finish')return false;
   delete state.pawFortuneNumber; $('back').click();return true
  }
  return performPrior(action)
 };
 const drawPrior=drawActivity;
 drawActivity=function(...args){
  if(!active()||!state.pawPairedWalk)return drawPrior.apply(this,args);
  const run=state,q=run.pawPairedWalk,done=pawPairedWalkTick(q,t,pawArcadeInputBlocked(),residentReducedMotion.matches);
  continuityActivity=activity;
  ctx.save();try{
   if(run.pawAlcovePainting)pawAlcoveScene();else pawTempleScenePlate();
   if(run.pawAlcovePainting&&q.to==='sticks'){
    const g=pawAlcoveGeometry();for(let i=0;i<2;i++){const m=pawMoonMotion(1,i,pawMoonFlat(run.result,i,run.count),95),pt=pawAlcoveMoonPoint(g,m);ellipse(pt.x,g.moonTray.y+5,9,2.5,'#342b2355');ctx.save();ctx.translate(pt.x,pt.y);ctx.scale(.30,.30);templeMoon(0,0,m.angle,m.flat);ctx.restore()}
   }
   backHuman(q.pos.x,q.pos.y,avatar??0,!done&&!pawArcadeInputBlocked()&&!residentReducedMotion.matches,q.dir,run.pawAlcovePainting?pawAlcoveActorScale():.96);
   if(q.to==='moon'){const grip=run.pawAlcovePainting?pawAlcoveReach(q.pos).grip:{x:q.pos.x+8*.96,y:q.pos.y-48*.96};ctx.save();ctx.translate(grip.x,grip.y);round(-2.8,-17,5.6,34,1,'#d7b47c','#9c7447');line(-1,-15,-1,15,'#f1dba6',.7);ctx.restore()}
  }finally{ctx.restore()}
  if(done&&run===state&&!pawArcadeInputBlocked()){
   const n=run.pawFortuneNumber,failures=pawPairedFailures(run),painted=run.pawAlcovePainting;
   transfer=true;try{start(q.to)}finally{transfer=false}
   if(activity===q.to&&state!==run){
    state.pawPairedRitual=true;state.pawAlcovePainting=painted;state.pawFortuneFailures=failures;
    if(q.to==='moon'){state.pawFortuneNumber=n;hint('Cast the blocks to confirm your numbered stick.','掷筊确认手中的签。')}
    else hint('Shake the holder for a new stick.','重新摇签筒，求一支新签。')
   }
  }
  mb5AssistSync()
 };
 // Keep garden visits player-led. Until the upper artwork is revalidated,
 // stop at the lower path viewpoints, not the former upper scenery nodes.
 Object.assign(pawRearGardenNodes,{cats:[.58,.49],chime:[.70,.49]});
 pawRearGardenEdges.splice(0,pawRearGardenEdges.length,...[['entry','bend'],['bend','fork'],['fork','feed'],['fork','seat'],['fork','chime'],['fork','cats']]);
}
queueMicrotask(pawInstallContinuousFortune);

/* PAW_TEMPLE_AUTO_ARRIVAL_BEGIN */
function pawTempleAutoArrival(q,blocked){
 return !!q&&!blocked&&!q.pawAutoArrival&&!q.destination&&!q.route?.length&&!q.greeted&&!q.catVisited
}
function pawGardenSeatAtNode(q,seat){
 return !!q&&!q.route?.length&&Array.isArray(q.pos)&&q.pos.length===2&&q.pos.every(Number.isFinite)&&Math.hypot(q.pos[0]-seat[0],q.pos[1]-seat[1])<.002
}
/* PAW_TEMPLE_AUTO_ARRIVAL_END */
function pawInstallTempleArrival(){
 const prior=drawActivity;
 drawActivity=function(...args){
  if(room==='temple'&&activity==='templeForecourt'){
   const q=state.pawForecourt;
   if(pawTempleAutoArrival(q,pawArcadeInputBlocked())){
    if(pawForecourtRoute(q,'hall')){q.pawAutoArrival=true;hint('Follow the stone steps into the temple.','沿着石阶走进大殿。')}
   }
   const value=prior.apply(this,args);
   if(activity==='templeForecourt'&&state.pawForecourt===q&&q?.pawAutoArrival){
    const el=$('gameControls');
    // The existing Back button still permits an immediate turn around.
    if(el?.classList.contains('pawForecourtControls'))el.hidden=true
   }
   return value
  }
  if(room==='temple'&&activity==='secretGarden'&&state.pawRearGarden&&state.gardenSitting&&!pawGardenSeatAtNode(state.pawGardenWalk,pawRearGardenNodes.seat)){
   // A stale seated flag must never pull the actor away from its actual node.
   state.gardenSitting=false
  }
  return prior.apply(this,args)
 };
 const seatPrior=gardenSeat;
 gardenSeat=function(...args){
  if(room==='temple'&&activity==='secretGarden'&&state.pawRearGarden&&!state.gardenSitting&&!pawGardenSeatAtNode(state.pawGardenWalk,pawRearGardenNodes.seat))return false;
  return seatPrior.apply(this,args)
 }
}
queueMicrotask(pawInstallTempleArrival);


/* PAW_INDOOR_STANDING_SCALE_BEGIN */
function pawIndoorStandingScale(playerScale,reference,ratio){
 if(![playerScale,reference,ratio].every(Number.isFinite)||playerScale<=0||reference<=0||ratio<=0)return null;
 return 94*playerScale*Math.max(.82,Math.min(1.05,ratio))/reference
}
function pawIndoorStandingBounds(x,y,worldHeight,aspect,view){
 if(![x,y,worldHeight,aspect,view?.s,view?.ox,view?.oy].every(Number.isFinite)||worldHeight<=0||aspect<=0||view.s<=0)return null;
 const h=worldHeight*view.s,w=Math.max(30,h*aspect),fx=view.ox+x*view.s,fy=view.oy+y*view.s;
 return {left:fx-w/2-5,right:fx+w/2+5,top:fy-h-5,bottom:fy+6}
}
/* PAW_INDOOR_STANDING_SCALE_END */
function pawInstallIndoorStandingScale(){
 // Only legacy standing station hosts. Painted rooms already have their own
 // staging; seated hosts and contact poses must retain their authored anchors.
 const legacyRooms=new Set(['tea','park','boba','arcade','mystery']);
 const legacyActor=()=>!activity&&legacyRooms.has(room)?roomResidentStations[room]:null;
 const normalized=(a,r)=>pawIndoorStandingScale(travellerRoomScale(H,cam.scale),r.height,a.sc);
 const drawPrior=drawGatheringPainted;
 drawGatheringPainted=function(name,x,y,scale=1,facing='right'){
  const a=legacyActor(),r=residentArtworkRecord(name);
  if(a&&r&&r.id===residentArtworkRecord(a.n)?.id&&a.x===x&&a.y===y&&a.sc===scale){
   scale=normalized(a,r)??scale
  }
  return drawPrior.call(this,name,x,y,scale,facing)
 };
 const actorsPrior=roomResidentActors;
 roomResidentActors=function(...args){
  const actors=actorsPrior.apply(this,args),legacy=legacyActor();
  return actors.map(a=>{
   const r=a===legacy&&residentArtworkRecord(a.n);
   return r?{...a,sc:normalized(a,r)??a.sc}:a
  })
 };
 const boundsPrior=meowIndoorActorBounds;
 meowIndoorActorBounds=function(a,scale){
  // Station NPCs use their individual reference height, not the player's 94.
  // Use the same trimmed aspect as drawResidentRaster, including broad bodies.
  if(!activity&&!['fish','destiny','tarot'].includes(room)&&a?.n&&Number.isFinite(a.sc)&&scale===a.sc){
   const r=residentArtworkRecord(a.n),im=r&&residentArtworkImage(r);
   if(r&&im?.complete&&im.naturalWidth&&im.naturalHeight){
    const crop=pawResidentCrop(im),aspect=crop?crop.w/crop.h:im.naturalWidth/im.naturalHeight;
    const rect=pawIndoorStandingBounds(a.x,a.y,r.height*scale,aspect,{s:cam.scale,ox:cam.ox,oy:cam.oy});
    if(rect)return rect
   }
  }
  return boundsPrior.call(this,a,scale)
 }
}
queueMicrotask(pawInstallIndoorStandingScale);

/* PAW_HOUSE_LABEL_RECOVERY_BEGIN */
// House plaques are navigational controls, not optional decoration. Migrate
// the former global quiet-map preference without disturbing other saved data.
function pawRestoreHouseLabels(wasQuiet,root,persist){
 root.classList.remove('quiet');
 if(wasQuiet)try{persist(false)}catch{} // storage failure must not hide doors
 return false
}
quiet9=pawRestoreHouseLabels(quiet9,signRoot,value=>save('quiet9',value));
// The assembled runtime initializes startup synchronously before this runs.
// Remove the obsolete hide-label control from both settings and the old HUD.
queueMicrotask(()=>{
 townMapLabels.remove();
 $('quietToggle').remove();
 quiet9=pawRestoreHouseLabels(quiet9,signRoot,value=>save('quiet9',value));
 syncTownSettings();
 syncSigns()
});
/* PAW_HOUSE_LABEL_RECOVERY_END */
