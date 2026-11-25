/* MeowBox release fixes; load after extensions, before startup. */
const ziBeforeRelease=ziChart;
ziChart=function(date,hr){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(hr)||hr<0||hr>23)throw Error('Invalid birth date or hour');
 const ms=Date.parse(date+'T12:00:00Z');if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==date||date<'1900-01-02'||date>'2036-12-31')throw Error('Unsupported birth date');
 const z=ziBeforeRelease(date,hr);if(z.stars.flat().length!==14||new Set(z.stars.flat().map(v=>v[1])).size!==14||!Number.isInteger(z.bureau)||z.bureau<2||z.bureau>6)throw Error('Chart integrity');
 return z
};
const friendPalaceRelease=chartConsultTopics.find(v=>v.k===9);if(friendPalaceRelease)friendPalaceRelease.k=7;
const chartFollowRelease=chartFollowTopic;chartFollowTopic=function(v){const k=chartFollowRelease(v);return k===9?7:k};
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
const releaseWonderShareBefore=wonderSceneShare;
wonderSceneShare=function(){
 if(!wonderSceneResult||wonderSceneMode!=='type')return releaseWonderShareBefore();
 const data=releaseAssessmentBalance('type',wonderSaved.type);if(!data)return releaseWonderShareBefore();
 const lines=data.map(v=>[v.axis[0]+' '+v.first+'/4 · '+v.axis[1]+' '+v.second+'/4',v.axis[0]+' '+v.first+'/4 · '+v.axis[1]+' '+v.second+'/4']);
 openMeowShare({kind:'type',title:wonderSceneResult.name,lines,accent:wonderSceneResult.color})
};
/* Language-dependent chart topics: match complete English words instead
   of accidental substrings (e.g. networking is not work). */
chartFollowTopic=function(value){
 const v=String(value).trim().toLowerCase();if(!v||v.length>160)return null;
 const terms=[[8,/\b(career|jobs?|work|promotion|boss|office)\b|事业|工作|升职|老板/iu],[2,/\b(relationship|love|partner|marriage|dating)\b|爱情|感情|婚姻|对象/iu],[4,/\b(money|finance|salary|savings?|budget)\b|金钱|财运|薪水|存钱/iu],[6,/\b(travel|moving|move|relocat\w*)\b|旅行|搬家|迁移/iu],[7,/\b(friends?|friendship|support|networking)\b|朋友|人际|贵人/iu],[11,/\b(family|parents?)\b|家庭|父母|家人/iu],[10,/\b(rest|stress|sleep|wellbeing|relax)\b|休息|压力|睡眠|放松/iu],[0,/\b(character|personality|identity)\b|性格|自己|命宫/iu]];
 return terms.find(([,re])=>re.test(v))?.[0]??null
};
const releaseChartStyle=document.createElement('style');releaseChartStyle.textContent='.releaseChartDetails{padding:12px;border:1px solid #b7a17c;border-radius:5px;background:#f6ead3;margin:0 0 14px;line-height:1.45}.releaseChartDetails p{margin:5px 0}.releaseChartDetails small{display:block;font-size:12px}';document.head.append(releaseChartStyle);
