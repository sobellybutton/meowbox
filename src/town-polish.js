
/* Keep sign relocations from flashing during camera motion. */
const townSignBefore=syncSigns;
let townPlaqueLang=null;
syncSigns=function(){
 if(townPlaqueLang!==zh){townPlaqueLang=zh;for(const btn of signButtons.values()){btn._signSize=null;btn._signOffset=null;btn._clearAt=0}}
 const before=new Map([...signButtons].map(([id,btn])=>[id,btn._signOffset]));
 townSignBefore();
 const now=performance.now();
 for(const [id,btn] of signButtons){
  const a=before.get(id),b=btn._signOffset;
  if(a&&b&&Math.hypot(a.x-b.x,a.y-b.y)>10)btn._townSettle=now+180;
  const settling=(btn._townSettle||0)>now;
  if(settling&&!btn.hidden){if(btn.style.opacity!=='0')btn.style.opacity='0';if(btn.style.pointerEvents!=='none')btn.style.setProperty('pointer-events','none','important')}
  else{if(btn.style.opacity==='0')btn.style.opacity='';if(btn.style.pointerEvents!=='auto')btn.style.setProperty('pointer-events','auto','important')}
 }
};
parkSerials.push(
 {title:['The cat union','猫猫工会'],opening:['Mochi has filed a petition. Two meals a day is an exploitative contract, apparently.','麻薯提交请愿书：一天两顿涉嫌压榨猫咪。'],twist:['The union demands a third meal and paid sunbathing leave.','工会要求第三顿饭，还有带薪晒太阳假。'],choices:[['Negotiate a snack','谈判加餐'],['Offer a sunbeam','提供一块阳光']],outcomes:[['They agreed to a biscuit bonus. Now they are negotiating its size.','工会同意饼干奖金，现在开始谈饼干大小。'],['The entire union fell asleep. Meeting adjourned.','全体工会睡着了，一致通过散会。']],after:['Mochi appointed himself Chief Nap Officer.','麻薯任命自己为首席午睡官。']},
 {title:['The missing annual leave','消失的年假'],opening:['A leave form was abandoned on the bench. No signature, just a tiny tear stain.','长椅上有张年假申请，没签名，只有一小滴泪痕。'],twist:['Grandma stamped APPROVED with her soup ladle.','外婆用汤勺盖了个「批准」。'],choices:[['Frame the form','裱起来'],['Return it with soup','附上一碗汤送回去']],outcomes:[['It is now a sacred relic of the park. Bow respectfully.','它已成为公园圣物，请虔诚行礼。'],['The recipient asked if Grandma is hiring.','收件人问外婆还招不招人。']],after:['The park now has an unofficial leave approval service.','公园已开通非官方请假审批服务。']}
);
