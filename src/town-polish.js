
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
  // Railway is a primary physical exit. The authoritative layout already
  // hides obstructed plaques; a cosmetic settle timer must not withdraw
  // a reachable station on every camera reprojection.
  if(id==='station')btn._townSettle=0;
  else if(a&&b&&Math.hypot(a.x-b.x,a.y-b.y)>10)btn._townSettle=now+180;
  const settling=(btn._townSettle||0)>now;
  if(settling&&!btn.hidden){if(btn.style.opacity!=='0')btn.style.opacity='0';if(btn.style.pointerEvents!=='none')btn.style.setProperty('pointer-events','none','important')}
  else{if(btn.style.opacity==='0')btn.style.opacity='';if(btn.style.pointerEvents!=='auto')btn.style.setProperty('pointer-events','auto','important')}
 }
};
parkSerials.push(
 {title:['The cat union','猫猫工会'],opening:['Mochi has filed a petition. Two meals a day is an exploitative contract, apparently.','麻薯提交请愿书：一天两顿涉嫌压榨猫咪。'],twist:['The union demands a third meal and paid sunbathing leave.','工会要求第三顿饭，还有带薪晒太阳假。'],choices:[['Negotiate a snack','谈判加餐'],['Offer a sunbeam','提供一块阳光']],outcomes:[['They agreed to a biscuit bonus. Now they are negotiating its size.','工会同意饼干奖金，现在开始谈饼干大小。'],['The entire union fell asleep. Meeting adjourned.','全体工会睡着了，一致通过散会。']],after:['Mochi appointed himself Chief Nap Officer.','麻薯任命自己为首席午睡官。']},
 {title:['The missing annual leave','消失的年假'],opening:['A leave form was abandoned on the bench. No signature, just a tiny tear stain.','长椅上有张年假申请，没签名，只有一小滴泪痕。'],twist:['Grandma stamped APPROVED with her soup ladle.','外婆用汤勺盖了个「批准」。'],choices:[['Frame the form','裱起来'],['Return it with soup','附上一碗汤送回去']],outcomes:[['It is now a sacred relic of the park. Bow respectfully.','它已成为公园圣物，请虔诚行礼。'],['The recipient asked if Grandma is hiring.','收件人问外婆还招不招人。']],after:['The park now has an unofficial leave approval service.','公园已开通非官方请假审批服务。']}
);

/* Original, shaded SVG resident illustrations. Interim art, with a common
   foot pivot and attached hands; no separate floating props. */
const townResidentDefs='<defs><linearGradient id="skin" x2=".7" y2="1"><stop stop-color="#f4d8b6"/><stop offset="1" stop-color="#c08d75"/></linearGradient><linearGradient id="coat" x2="1" y2="1"><stop stop-color="#c2a3a6"/><stop offset=".55" stop-color="#927781"/><stop offset="1" stop-color="#6e5b6b"/></linearGradient><linearGradient id="green" x2="1" y2="1"><stop stop-color="#d8d4aa"/><stop offset="1" stop-color="#818d6c"/></linearGradient><linearGradient id="pants" x2="1" y2="1"><stop stop-color="#a3aba0"/><stop offset="1" stop-color="#62716b"/></linearGradient></defs>';
function townResidentArt(kind,face=false){
 const lin=kind==='lin',laugh=kind==='laugh'||lin,scold=kind==='scold',coat=lin?'url(#green)':'url(#coat)',hair=lin?'#69645e':'#a8a39b';
 const head='<path d="M53 56Q45 37 59 23Q68 7 89 10Q109 5 122 25L129 55L117 78Q91 92 68 78Z" fill="'+hair+'" stroke="#695a50" stroke-width="1.6"/><path d="M71 19Q58 27 55 48M81 14Q68 26 64 42M91 13Q85 23 83 31M100 14Q112 28 115 43M109 17Q125 36 121 53" fill="none" stroke="#efe4d0" stroke-opacity=".65" stroke-width="2" stroke-linecap="round"/><path d="M61 46Q66 34 77 32Q84 38 92 28Q101 40 118 43L118 60Q115 80 93 83Q72 83 64 67Z" fill="url(#skin)" stroke="#a77d66"/><ellipse cx="63" cy="58" rx="4" ry="7" fill="#d6ad91"/><ellipse cx="118" cy="58" rx="4" ry="7" fill="#d6ad91"/><path d="'+(scold?'M72 48l13 4m14 0l13-4':'M72 49q7-5 13 0m14 0q7-5 13 0')+'" fill="none" stroke="#62554c" stroke-width="1.7" stroke-linecap="round"/><path d="'+(laugh?'M73 55q5 5 10 0m17 0q5 5 10 0':'M78 53v5m26-5v5')+'" fill="none" stroke="#403f3b" stroke-width="2.3" stroke-linecap="round"/><path d="M91 55q-4 8 1 9M67 61l3 2m44-2l-3 2M70 70l4 1m36-1l-4 1" fill="none" stroke="#b0806d"/><ellipse cx="73" cy="65" rx="6" ry="3.4" fill="#c87b78" opacity=".5"/><ellipse cx="110" cy="65" rx="6" ry="3.4" fill="#c87b78" opacity=".5"/><path d="'+(scold?'M84 72q9-8 16 0':laugh?'M82 70q10 15 20 0Z':'M85 72q7 5 14-1')+'" fill="'+(laugh?'#8e544c':'none')+'" stroke="#935f53" stroke-width="1.5"/>'+(!lin?'<g fill="none" stroke="#665d51" stroke-width="1.5"><ellipse cx="78" cy="55" rx="12" ry="9"/><ellipse cx="105" cy="55" rx="12" ry="9"/><path d="M90 54h3M66 53l-5-3m56 3l4-3"/></g>':'');
 const legs=lin?'M72 130L73 196L88 199L94 151L101 198L117 198L115 129Z':'M73 130Q63 145 66 170L77 193Q86 197 95 190L94 164L103 189Q113 193 121 185L116 147L108 132Z';
 const body='<path d="'+legs+'" fill="url(#pants)" stroke="#596462" stroke-width="1.4"/><path d="M75 183Q61 190 62 201Q75 205 91 200L94 191M105 181Q100 194 103 201Q120 204 130 198L119 187" fill="#544b45" stroke="#3e413b"/><path d="M77 78L76 91L92 102L106 88L105 76" fill="url(#skin)" stroke="#a77d66"/><path d="M74 86Q53 89 47 106L57 143Q85 154 117 143L131 106Q123 91 105 86Q91 98 74 86Z" fill="'+coat+'" stroke="#64555e" stroke-width="1.5"/><path d="M75 88L91 102L107 88M91 102L90 144M65 98Q58 115 66 137M116 98Q124 116 116 138" fill="none" stroke="#ebc8ad" stroke-width="1.4"/><path d="M68 120Q79 114 89 122T110 121M67 129Q78 123 89 130T113 129M72 138Q82 134 92 139T109 137" fill="none" stroke="#e8ceb0" stroke-width="1.2" opacity=".45"/><path d="M56 101Q45 108 48 124L68 138Q77 141 82 133L66 120L68 107" fill="'+coat+'" stroke="#6d5662"/><path d="M75 130q8-5 14 1l3 8q-6 6-14 1Z" fill="url(#skin)" stroke="#9f7663"/><path d="'+(scold?'M117 98Q130 88 136 73L146 83Q139 112 121 126L109 118':'M119 98Q131 109 124 124L106 139Q96 141 92 134L109 119L107 108')+'" fill="'+coat+'" stroke="#6d5662"/>'+(scold?'<path d="M135 75Q131 65 139 62Q146 61 150 72L146 84Z" fill="url(#skin)" stroke="#a77d66"/><path d="M140 70Q128 40 145 29Q153 25 159 34Q165 45 149 70Z" fill="#bda179" stroke="#665347"/><path d="M143 44l13-4m-11 9l10-4" stroke="#e9d0a2" stroke-width="2"/>':'<path d="M96 131q-8-4-12 2l-2 6q8 5 16-1Z" fill="url(#skin)" stroke="#9f7663"/>')+(lin?'<path d="M82 115h23l-3 18H85Z" fill="#eee0bc" stroke="#907557"/><path d="M103 119q12-2 9 7q-2 4-8 3" fill="none" stroke="#9b7a57" stroke-width="2"/>':'');
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+(face?96:180)+'" height="'+(face?96:220)+'" viewBox="'+(face?'43 4 96 96':'0 0 180 220')+'">'+townResidentDefs+(face?'':body)+head+'</svg>'
}
const townResidentImages=new Map();
function townResidentImage(kind,face=false){
 const key=kind+':'+face;if(!townResidentImages.has(key)){const im=new Image();im.decoding='async';townResidentImages.set(key,im);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(townResidentArt(kind,face))}
 return townResidentImages.get(key)
}
function townAhMaMood(game,age,releaseAge,combo,phase){
 if(game==='hit'&&age>=0&&age<.36)return 'scold';
 if(game==='hit'&&age>=.36&&age<1.6&&combo>=2)return 'laugh';
 if(game==='riverShout'&&phase==='walk'&&releaseAge>1.1&&releaseAge<2.8)return 'scold';
 return 'idle'
}
const townAhMaBefore=drawProductionAhMa;
drawProductionAhMa=function(x,y,sc=1){
 const mood=townAhMaMood(activity,t-stressSwingAt,t-(state?.riverAt??-100),stressCombo,state?.riverPhase),im=townResidentImage(mood);
 if(!im.complete||!im.naturalWidth)return townAhMaBefore(x,y,sc);
 ctx.save();ellipse(x,y+2,35*sc,7*sc,'#3b322842');ctx.drawImage(im,x-90*sc,y-205*sc,180*sc,220*sc);ctx.restore();return true
};
for(const kind of ['idle','scold','laugh'])townResidentImage(kind);
