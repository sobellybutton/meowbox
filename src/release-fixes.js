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
  const axes=['EI','SN','TF','JP'];return axes.map((axis,i)=>{const score=result.scores[i];if(!Number.isFinite(score)||Math.abs(score)>4)throw Error('Invalid preference score');return {axis,first:(score+4)/2,second:(4-score)/2,tied:score===0}})
 }
 if(mode==='motive'){
  const scores=result.scores;if(scores.length!==9||scores.some(v=>!Number.isInteger(v)||v<0||v>6))throw Error('Invalid motive score');
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
 if(!['type','motive','soul'].includes(mode)||!Array.isArray(rows)||!Array.isArray(answers)||answers.some(v=>!Number.isInteger(v)))throw Error('Invalid assessment');
 if(mode==='type'||mode==='motive'){const count=mode==='type'?4:9;if(rows.some(q=>!Number.isInteger(q.dimension)||q.dimension<0||q.dimension>=count))throw Error('Invalid dimension')}
 else if(rows.some(q=>!Number.isInteger(q.id)||q.id<0||q.id>=soulQs.length))throw Error('Invalid soul question');
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
    element('p',tr(...prompt),item,'readingPrompt');
   });
  }else if(mode==='motive'&&balance){
   element('p',tr('Each motive has three statements. Where scores are close, read the themes side by side.','每种动力对应三道题。分数接近时，可以把它们放在一起看。'),body);
   const leaders=balance.flat?[]:balance.close;
   const list=element('ol','',body,'wonderMotiveScores');
   balance.ranked.forEach(({index,score})=>element('li',tr(...wonderMotives[index].slice(0,2))+' · '+score+'/6',list));
   if(balance.flat)element('p',tr(...result.desc),body);
   leaders.slice(0,3).forEach(({index})=>element('p',tr(...motiveReflectionPrompts[index]),body,'readingPrompt'));
  }else element('p',tr(...result.desc),body);
  b(body,tr('Share keepsake','分享纪念卡'),()=>wonderSceneShare(()=>openWonderResult(mode,result)));
  b(body,tr('Try again','再测一次'),()=>wonderSceneOpen(mode));
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
