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
