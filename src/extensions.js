
follower=function(){};
const proposalStyle=document.createElement('style');
proposalStyle.textContent= '#proposal{position:fixed;inset:0;z-index:100;background:#22352d;color:#fff7e5;display:grid;grid-template-rows:auto minmax(0,1fr) auto;padding: max(14px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));overflow:hidden;isolation:isolate;font-family:Georgia,"Songti SC",serif}#proposal[hidden]{display:none}#proposal .scenery{position:absolute;inset:0;z-index:-3;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.83}#proposal:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#192e29a0,transparent 30%,transparent 56%,#172a25ed 96%);pointer-events:none}#proposal header{display:flex;justify-content:space-between;align-items:center;gap:10px}#proposal header span{letter-spacing:.12em;font-size:13px}#proposal button{min-height:44px;background:#fff4dce9;color:#384c3b;border:1px solid #c8b28b;border-radius:8px;padding:10px 16px;box-shadow:none}#proposal .hero{min-height:0;position:relative;display:flex;align-items:flex-end;justify-content:center;overflow:visible}#proposal .traveller{height:90%;max-height:500px;width:82%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 10px 5px #152b2860);animation:quietBreath 3s ease-in-out infinite alternate;z-index:1}#proposal .shadow{position:absolute;bottom:2%;width:30%;height:3%;border-radius:50%;background:#172a2560;filter:blur(4px)}#proposal footer{max-width:480px;width:100%;justify-self:center;text-align:center;display:grid;gap:10px;padding-top:10px}#proposal h1{font-weight:normal;font-size:clamp(27px,6vw,49px);margin:0;line-height:1.12}#proposal p{font:15px/1.45 system-ui,sans-serif;margin:0;text-wrap:pretty}#proposal .actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}#proposal .actions button{flex:1;min-width:44px}#proposal input{font:16px Georgia,serif;padding:12px;background:#fff2db;color:#334a39;border:1px solid #d4be96;border-radius:5px;width:100%;min-height:44px}#proposal .next{background:#e6d0a6;font-weight:bold;width:100%}#proposal .speck{position:absolute;top:20%;left:20%;width:5px;height:5px;background:#fff5be;border-radius:50%;animation:drift 7s linear infinite;pointer-events:none}#proposal .speck:nth-of-type(2){left:70%;animation-delay:-3s}#proposal .speck:nth-of-type(3){left:40%;animation-delay:-5s}@keyframes drift{from{transform:translate(0,15vh);opacity:0}30%{opacity:.8}to{transform:translate(45px,-22vh);opacity:0}}@keyframes quietBreath{to{transform:translateY(-3px)}}#proposal.boarding .traveller{animation:boardWalk .8s ease-in forwards}@keyframes boardWalk{to{transform:translateY(-18px) scale(.75);opacity:0}}@media(min-width:800px){#proposal footer{max-width:440px}#proposal .traveller{max-height:62vh}}@media(max-height:480px){#proposal{grid-template-columns:1fr 1fr;grid-template-rows:auto minmax(0,1fr)}#proposal header{grid-column:1/-1}#proposal footer{align-self:center;max-height:100%;overflow:auto}#proposal .hero{height:100%}}@media(prefers-reduced-motion:reduce){#proposal *{animation:none!important;transition:none!important}}';
document.head.append(proposalStyle);
let proposal=document.createElement('section');proposal.id='proposal';proposal.hidden=true;document.body.append(proposal);
let proStep=0,proAvatar=avatar??0,proDir=0,proName=playerName||'',proPersona=personality??0,proBusy=false;
function proButton(parent,txt,fn,cls){let e=document.createElement('button');e.textContent=txt;e.onclick=fn;if(cls)e.className=cls;parent.append(e);return e}
function proRender(){
 for(const node of [...proposal.children])if(!node.classList.contains('cinema-world'))node.remove();proposal.classList.remove('boarding');proposal.hidden=false;
 let bg=element('img','',proposal,'scenery');bg.alt='';bg.src=ART[proStep===3?'valleyClean':'streetStation']||ART.valleyClean;
 for(let i=0;i<3;i++)element('i','',proposal,'speck');
 let head=element('header','',proposal);element('span',tr('MEOWBOX · A LITTLE WORLD AWAY','摸鱼盒 · 偷得浮生半日闲'),head);const languages=element('div','',head,'languageChoice');for(const [cn,label] of [[false,'EN'],[true,'中文']]){const choice=proButton(languages,label,()=>{if(proBusy||zh===cn)return;zh=cn;save('zh',zh);document.documentElement.lang=zh?'zh':'en';proRender()});choice.setAttribute('aria-pressed',String(zh===cn));choice.disabled=proBusy}
 let hero=element('div','',proposal,'hero');
 if(proStep===1||proStep===2){element('div','',hero,'shadow');let im=element('img','',hero,'traveller');im.src=ART['walker'+proAvatar+proDir];im.alt=tr(...names[proAvatar]);let startX=0;hero.ontouchstart=e=>startX=e.changedTouches[0].clientX;hero.ontouchend=e=>{let delta=e.changedTouches[0].clientX-startX;if(proStep===1&&Math.abs(delta)>40){proAvatar=(proAvatar+(delta<0?1:3))%4;proRender()}}}
 let foot=element('footer','',proposal);
 if(proStep===0){element('h1',tr('The last train out of reality','逃离现实的末班车'),foot);element('p',avatar===null?tr('No deadlines beyond this platform. Your ticket is waiting.','站台之外，不再有截止日期。你的车票已经准备好了。'):tr('Welcome back. The mountain gate is waiting for you.','欢迎回来，山门还在等你。'),foot);proButton(foot,avatar===null?tr('Sign my ticket','签下车票'):tr('Return to the valley','重返解忧谷'),()=>{proStep=avatar===null?4:3;proRender()},'next')}
 if(proStep===1){element('h1',tr(...names[proAvatar]),foot);let a=element('div','',foot,'actions');proButton(a,'‹',()=>{proAvatar=(proAvatar+3)%4;proRender()});proButton(a,tr('Turn around','转身'),()=>{proDir=(proDir+1)%3;proRender()});proButton(a,'›',()=>{proAvatar=(proAvatar+1)%4;proRender()});proButton(foot,tr('This is me','就选这个旅人'),()=>{proStep=2;proDir=1;proRender()},'next')}
 if(proStep===2){element('h1',tr('What brings you here?','今天为何而来？'),foot);let opts=[['A little peace','找点清静'],['A little luck','求点好运'],['Something delicious','找点好吃的'],['Just avoiding work','单纯摸鱼']];let a=element('div','',foot,'actions');opts.forEach((v,i)=>proButton(a,tr(...v),()=>{proPersona=i;proposalBoard()}));}
 if(proStep===3){element('h1',tr('Fortune Valley','解忧谷'),foot);element('p',tr('The keeper smiles. “Take your time. Nobody clocks in here.”','庙祝笑了笑：“慢慢走，这里不用打卡。”'),foot);/* Arrival advances automatically. */}
}
function proposalBoard(){if(proBusy)return;proBusy=true;proposal.classList.add('boarding');setTimeout(()=>{proBusy=false;proStep=3;proRender()},850)}
function finishProposal(){recordShrineArrival();avatar=proAvatar;playerName=proName.trim();personality=proPersona;save('avatar',avatar);save('playerName',playerName);save('personality',personality);save('begun',true);scene='fortune';save('scene',scene);room=null;activity=null;resetPosition();initNPC();visit(scene);updateHUD();$('arrival').hidden=true;$('page').style.display='none';$('dock').hidden=false;$('hud').style.visibility='';$('small').style.visibility='';$('hint').style.visibility='';proposal.style.transition='opacity .45s';proposal.style.opacity='0';proposal.style.pointerEvents='none';setTimeout(()=>{proposal.hidden=true;proposal.style.opacity='';proposal.style.pointerEvents=''},470)}
immigration=function(){proStep=1;proAvatar=avatar??0;proDir=0;proName=playerName||'';proRender()};
entryStory=function(){shrineReturning=avatar!==null;shrineVisitSnapshot=readShrineVisits();shrineArrivalRecorded=false;proStep=shrineReturning?3:0;proAvatar=avatar??0;proName=playerName||'';proPersona=personality??0;proBusy=false;proRender()};

const valleyStyle=document.createElement('style');valleyStyle.textContent='#worldSigns .worldSign{font-size:13px!important;line-height:1.2;max-width:140px;white-space:normal;min-height:44px;padding:8px 12px;background:#efe3c9ed;color:#344737;border:1px solid #8c8a68;border-radius:6px;box-shadow:0 3px 8px #273b3240}#worldSigns .valleyTitle{display:none}#proposal .gate{position:absolute;inset:8% 0 0;display:flex;overflow:hidden;pointer-events:none}#proposal .gate i{width:50%;background:repeating-linear-gradient(90deg,#634b35 0 4px,#91704c 4px 34px,#78583e 34px 38px);border:6px solid #4a3829;box-shadow:inset 0 0 28px #33271988;transition:transform .75s cubic-bezier(.3,.1,.2,1)}#proposal .gate.open i:first-child{transform:translateX(-105%)}#proposal .gate.open i:last-child{transform:translateX(105%)}@media(prefers-reduced-motion:reduce){#proposal .gate i{transition:none}}';document.head.append(valleyStyle);
const originalProRender=proRender;proRender=function(){originalProRender();if(proStep===3){let gate=element('div','',proposal.querySelector('.hero'),'gate');element('i','',gate);element('i','',gate)}};
const originalFinishProposal=finishProposal;finishProposal=function(){if(proBusy)return;proBusy=true;let gate=proposal.querySelector('.gate');if(gate)gate.classList.add('open');setTimeout(()=>{proBusy=false;originalFinishProposal();hint('Tap a shop to walk inside. Tarot House is just ahead.','点击店铺，旅人会走进去。塔罗小屋就在前方。')},matchMedia('(prefers-reduced-motion: reduce)').matches?0:780)};
let signButtons=new Map();syncSigns=function(){let visible=scene==='fortune'&&!room&&!transitioning&&$('page').style.display!=='block'&&avatar!==null&&proposal.hidden&&$('arrival').hidden;signRoot.hidden=!visible;if(!visible)return;if(signButtons.size===0){signRoot.replaceChildren();for(let [id,x,y,en,cn] of maps.fortune.st){let e=element('button','',signRoot,'worldSign');e.onclick=()=>walkDoor(id,x,y);signButtons.set(id,e)}}for(let [id,x,y,en,cn] of maps.fortune.st){let e=signButtons.get(id),sx=cam.ox+x*cam.scale,sy=cam.oy+(y-90)*cam.scale;e.textContent=tr(en,cn);e.style.left=Math.max(66,Math.min(W-66,sx))+'px';e.style.top=sy+'px';e.hidden=sy<85||sy>H-135||sx<-45||sx>W+45;}};

const gatePolish=document.createElement('style');gatePolish.textContent='#proposal .gate{inset:0;pointer-events:auto;cursor:pointer;z-index:2}#proposal .gate i{position:relative;border:5px solid #463424;background:repeating-linear-gradient(90deg,#65472e 0 3px,#947653 3px 29px,#795638 29px 32px)}#proposal .gate i:before,#proposal .gate i:after{content:"";position:absolute;left:0;right:0;height:12px;background:#4e3727;box-shadow:0 2px 3px #241b16;top:25%}#proposal .gate i:after{top:75%}#proposal .gate.open{pointer-events:none}#proposal .gate-traveller{position:absolute;bottom:0;height:44%;width:38%;object-fit:contain;z-index:3;pointer-events:none;filter:drop-shadow(0 6px 4px #172a2560);transform-origin:center bottom;transition:transform 1.15s ease-in,opacity .35s .85s}#proposal .gate-traveller.go{transform:translateY(-24%) scale(.45);opacity:0}#proposal .gate-handle{position:absolute;width:16px;height:30px;border:3px solid #d3b581;border-radius:50%;top:52%;right:12px}#proposal .gate i:last-child .gate-handle{left:12px;right:auto}';document.head.append(gatePolish);
const previousProGate=proRender;
proRender=function(){previousProGate();if(proStep!==3)return;let foot=proposal.querySelector('footer'),gate=proposal.querySelector('.gate'),hero=proposal.querySelector('.hero');foot.querySelector('h1').textContent=shrineReturning?tr('Welcome home','欢迎回来'):tr('The mountain gate','解忧谷山门');const welcome=foot.querySelector('p');welcome.textContent=shrineWelcome();welcome.classList.add('shrine-welcome');element('span',tr('Temple keeper','庙祝'),foot,'shrine-speaker');gate.querySelectorAll('i').forEach(el=>element('span','',el,'gate-handle'));gate.setAttribute('aria-hidden','true');let im=element('img','',hero,'gate-traveller');im.src=ART['walker'+proAvatar+'1'];im.alt='';let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;proBusy=false;const enterGate=()=>{if(proBusy)return;proBusy=true;gate.onclick=null;enter.disabled=true;proposal.querySelectorAll('header button').forEach(b=>b.disabled=true);gate.classList.add('open');sound(440);setTimeout(()=>{im.classList.add('go');setTimeout(()=>{proBusy=false;originalFinishProposal();beginValleyReveal();hint('Explore the valley at your own pace.','慢慢逛，不用赶时间。')},reducedMotion?0:1100)},reducedMotion?0:600)};const enter=proButton(foot,tr('Open the shrine gate','推开山门'),enterGate,'next shrine-enter');gate.onclick=enterGate;paintShrineWeather(hero);};
const proDrawActivity=drawActivity;
drawActivity=function(){proDrawActivity();if(activity==='wishes'&&state.wish){ctx.save();let elapsed=Math.max(0,t-(state.lanternAt??t));if(state.lanternAt===undefined)state.lanternAt=t;let rise=Math.min(1,elapsed/1.5);ctx.translate(400+Math.sin(t*1.7)*9,445-115*rise);ctx.rotate(Math.sin(t*1.7)*.07);glow(0,0,64,1);line(0,-46,0,-29,'#b29b69',2);round(-25,-28,50,57,13,'#edab5b','#9e5c38');for(let x of [-14,0,14])line(x,-22,x,23,'#bf783e',1);round(-15,-32,30,7,3,'#634b38');round(-15,27,30,6,3,'#634b38');ctx.restore()}};

let valleyRevealAt=-1;
function beginValleyReveal(){valleyRevealAt=performance.now();p.x=p.tx=500;p.y=p.ty=Math.max(minY(),maxY()-180);p.facing='up';cam.y=p.y;stopRoute();let dock=$('dock');dock.style.visibility='hidden';$('hud').style.visibility='hidden';$('small').style.visibility='hidden';$('hint').style.visibility='hidden';setTimeout(()=>{if(valleyRevealAt<0)return;p.ty=Math.max(minY(),p.y-230)},1600);setTimeout(()=>{valleyRevealAt=-1;dock.style.visibility='';$('hud').style.visibility='';$('small').style.visibility='';$('hint').style.visibility=''},2900)}
const oldSyncCinematic=syncSigns;syncSigns=function(){if(valleyRevealAt>=0){signRoot.hidden=true;return}oldSyncCinematic()};
const suits78=[['Wands','权杖','island'],['Cups','圣杯','home'],['Swords','宝剑','fortune'],['Pentacles','星币','wonder']];
const ranks78=[['Ace','王牌'],['Two','二'],['Three','三'],['Four','四'],['Five','五'],['Six','六'],['Seven','七'],['Eight','八'],['Nine','九'],['Ten','十'],['Page','侍从'],['Knight','骑士'],['Queen','王后'],['King','国王']];
const minor78=[
[['Inspiration and a fresh opportunity','灵感与新机会','A stalled beginning or lack of direction','起步受阻或缺少方向'],['Planning and looking ahead','规划与展望','Fear of stepping beyond the familiar','害怕走出舒适区'],['Progress and expanding horizons','进展与拓展视野','Delays or limited perspective','延误或眼界受限'],['Celebration and a stable foundation','庆祝与稳定的基础','Tension at home or a private celebration','家庭紧张或低调庆祝'],['Competition and differing opinions','竞争与意见分歧','Avoiding conflict or resolving tension','回避冲突或缓解矛盾'],['Recognition and confidence','认可与自信','Self doubt or seeking approval','自我怀疑或过度寻求认可'],['Standing your ground','坚守立场','Feeling overwhelmed by pressure','压力过大'],['Rapid movement and messages','快速进展与消息','Delays and scattered energy','延迟与精力分散'],['Resilience and boundaries','韧性与界限','Exhaustion or defensiveness','疲惫或过度防备'],['Responsibility and heavy burdens','责任与重担','Releasing or delegating burdens','放下或分担负担'],['Curiosity and creative exploration','好奇与创意探索','Restlessness or unfinished ideas','浮躁或想法未落实'],['Bold action and adventure','勇敢行动与冒险','Haste and inconsistency','急躁与反复'],['Warm confidence and independence','热情自信与独立','Insecurity or jealousy','不安或嫉妒'],['Vision and leadership','远见与领导力','Impulsiveness or excessive control','冲动或过度控制']],
[['Emotional openness and compassion','情感开放与关怀','Blocked emotions or self care needs','情绪阻塞或需要自我照顾'],['Mutual connection and partnership','相互理解与伙伴关系','Imbalance or disconnection','失衡或疏离'],['Friendship and shared joy','友谊与共同喜悦','Social tension or overindulgence','社交紧张或过度享乐'],['Contemplation and missed opportunities','沉思与错过机会','Renewed interest and awareness','重新投入与觉察'],['Loss and disappointment','失落与失望','Acceptance and gradual recovery','接受与逐渐恢复'],['Nostalgia and kindness','怀旧与善意','Living in the past','沉溺过去'],['Choices and imagination','选择与想象','Clarity after confusion','迷茫后的清晰'],['Leaving what no longer fulfills you','离开不再满足内心的事','Fear of moving on','害怕放下'],['Contentment and gratitude','满足与感恩','Superficial satisfaction','表面的满足'],['Harmony and emotional fulfillment','和谐与情感圆满','Strained relationships or expectations','关系紧张或期待落差'],['Sensitivity and a creative message','敏感与创意消息','Emotional immaturity or insecurity','情绪不成熟或不安'],['Romance and following the heart','浪漫与听从内心','Unrealistic expectations','不切实际的期待'],['Empathy and emotional wisdom','同理心与情感智慧','Emotional overwhelm','情绪负荷过重'],['Emotional balance and compassion','情绪平衡与慈悲','Moodiness or emotional manipulation','情绪波动或情感操控']],
[['Clarity and a breakthrough','清晰与突破','Confusion or miscommunication','困惑或沟通不良'],['A difficult choice or stalemate','艰难选择或僵局','Indecision or emerging clarity','犹豫或逐渐明朗'],['Heartache and painful truth','心痛与残酷的真相','Healing and forgiveness','疗愈与宽恕'],['Rest and recovery','休息与恢复','Burnout or restless recovery','倦怠或无法安心休息'],['Conflict and hollow victories','冲突与空洞的胜利','Reconciliation or lingering resentment','和解或残留怨气'],['Transition towards calmer conditions','走向平静的过渡','Resistance to change','抗拒变化'],['Strategy and discretion','策略与谨慎','Confession or self deception','坦白或自我欺骗'],['Feeling trapped by assumptions','被自身想法困住','Releasing limiting beliefs','摆脱限制性信念'],['Anxiety and sleepless worry','焦虑与夜间忧虑','Seeking support and relief','寻求支持与缓解'],['A painful ending and closure','痛苦的结束与告别','Recovery or resistance to closure','恢复或抗拒结束'],['Curiosity and alert observation','好奇与敏锐观察','Hasty words or gossip','言语草率或流言'],['Determination and swift action','决心与迅速行动','Recklessness or impatience','鲁莽或不耐烦'],['Clear boundaries and discernment','清晰界限与判断力','Harsh judgment or bitterness','严苛判断或怨愤'],['Reason and fair judgment','理性与公正判断','Misuse of authority or rigidity','滥用权威或僵化']],
[['A practical opportunity','实际的新机会','Missed opportunity or poor planning','错失机会或计划不足'],['Balancing competing priorities','平衡多重事务','Overcommitment or imbalance','承担过多或失衡'],['Teamwork and craftsmanship','合作与技艺','Poor coordination or uneven effort','协调不足或付出不均'],['Security and holding on','安全感与守护','Fear of loss or excessive attachment','害怕失去或过度执着'],['Hardship and need for support','困境与对支持的需要','Recovery and accepting help','恢复与接受帮助'],['Generosity and reciprocity','慷慨与互惠','Unequal giving or hidden conditions','付出不均或附带条件'],['Patience and assessing progress','耐心与检视进展','Impatience or unproductive effort','急躁或无效努力'],['Practice and dedication','练习与专注投入','Perfectionism or lack of focus','完美主义或缺乏专注'],['Independence and earned comfort','独立与努力所得的舒适','Overwork or dependence on appearances','过度工作或依赖外在评价'],['Long term security and legacy','长期稳定与传承','Family or financial instability','家庭或财务不稳'],['Learning and practical ambition','学习与务实目标','Procrastination or lack of planning','拖延或缺乏计划'],['Reliability and steady effort','可靠与稳定努力','Stagnation or excessive routine','停滞或过度循规蹈矩'],['Practical care and resourcefulness','务实照顾与善用资源','Neglecting yourself or imbalance','忽略自己或失衡'],['Stability and responsible stewardship','稳定与负责任的管理','Materialism or stubbornness','物质主义或固执']]
];
for(let s=0;s<4;s++)for(let i=0;i<14;i++){let n=ranks78[i],u=suits78[s],m=minor78[s][i];tarotDeck.push([n[0]+' of '+u[0],u[1]+n[1],m[0],m[1]]);arcanaMeanings.push([m[0]+'. Consider how this applies to your situation.',m[1]+'。想想这与你目前的处境有什么关联。',m[2]+'. Consider what needs attention.',m[3]+'。想想哪些地方值得留意。',u[2]])}
const oldTarotArt78=tarotArt;
tarotArt=function(x,y,w,h,i,rev=false){if(i<22)return oldTarotArt78(x,y,w,h,i,rev);let s=Math.floor((i-22)/14),n=(i-22)%14;ctx.save();ctx.translate(x,y);if(rev){ctx.translate(w,h);ctx.rotate(Math.PI)}ctx.scale(w/100,h/120);let colors=['#af7751','#557f83','#767a91','#7e9463'];round(0,0,100,120,3,colors[s]);round(4,4,92,112,2,null,'#eed6a0');let count=n<10?n+1:1;for(let j=0;j<count;j++){let cols=count===1?1:count<=4?2:3,rows=Math.ceil(count/cols),xx=(j%cols+.5)*80/cols+10,yy=(Math.floor(j/cols)+.5)*80/rows+15;ctx.save();ctx.translate(xx,yy);if(s===0){line(-6,10,6,-12,'#f3d291',4);line(3,-6,11,-12,'#d2e2ad',2)}else if(s===1){ctx.fillStyle='#f4dba2';ctx.beginPath();ctx.moveTo(-9,-9);ctx.quadraticCurveTo(-8,5,0,5);ctx.quadraticCurveTo(8,5,9,-9);ctx.fill();line(0,4,0,12,'#f4dba2',2);line(-6,12,6,12,'#f4dba2',2)}else if(s===2){line(0,-13,0,10,'#e7e4d1',4);line(-7,5,7,5,'#e5bb75',3)}else{ellipse(0,0,10,10,'#e7bf67');ctx.strokeStyle='#785b39';ctx.beginPath();for(let k=0;k<6;k++){let z=k%5*4*Math.PI/5-Math.PI/2;let a=Math.cos(z)*7,b=Math.sin(z)*7;k?ctx.lineTo(a,b):ctx.moveTo(a,b)}ctx.stroke()}ctx.restore()}if(n>=10)txt(['P','N','Q','K'][n-10],50,100,17,'#fff0c9');ctx.restore()};

const playStyle=document.createElement('style');playStyle.textContent='#dialogue{border-radius:9px!important;max-height:32dvh!important;line-height:1.5;background:#fff4dfed!important}#dialogue #line{white-space:pre-line}#hint{max-width:88%;font-size:13px;line-height:1.4}#dock button{min-height:48px}#page .astroForm{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#page .astroForm label{display:flex;flex-direction:column;gap:6px;min-width:0}#page .astroForm input{width:100%;min-width:0;min-height:44px;font-size:16px}#page .astroForm button{grid-column:1/-1;min-height:48px}#page .ziGrid article{overflow-wrap:anywhere;min-width:0;font-size:12px}#page .ziGrid article strong{font-size:12px}@media(max-width:370px){#page .astroForm{grid-template-columns:1fr}#page .ziGrid article{font-size:10px}}';document.head.append(playStyle);
const startPolished=start;let activityZoomAt=-1;
start=function(a){startPolished(a);activityZoomAt=performance.now();if(a==='tarot'||a==='love'){state.shuffleUntil=t+.85;hint('The reader is shuffling your cards…','占卜师正在洗牌……');let run=state;setTimeout(()=>{if(state===run)activityHint()},850)}};
const drawPolished=drawActivity;
drawActivity=function(){if((activity==='tarot'||activity==='love')&&state.shuffleUntil>t){table();let f=1-(state.shuffleUntil-t)/.85;for(let i=0;i<9;i++){ctx.save();ctx.translate(400+(i-4)*24*Math.sin(f*Math.PI),470+Math.sin(f*10+i)*12);ctx.rotate((i-4)*.085*Math.sin(f*Math.PI));card(-55,-85,110,170,false);ctx.restore()}return}drawPolished();if(activity==='cook'){for(let i=0;i<5;i++){let x=338+i*30,y=448-((t*31+i*14)%78);ctx.save();ctx.globalAlpha=.23*(1-((t*31+i*14)%78)/78);ellipse(x+Math.sin(t*2+i)*10,y,8,16,'#fff4d4');ctx.restore()}}if(activity==='sticks'&&state.drawing){ctx.save();let f=Math.max(0,Math.min(1,1-(state.shakeUntil-t)/.65));ctx.translate(400+f*95,420-f*120+f*f*160);ctx.rotate(f*2.8);round(-4,-45,8,90,2,'#e4c080','#98744d');ctx.restore()}};
const oldRoomTable=table;table=function(){if(activity==='tarot'||activity==='love'){ctx.save();let g=ctx.createLinearGradient(0,340,0,700);g.addColorStop(0,'#453b4a');g.addColorStop(1,'#242d38');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(90,340);ctx.lineTo(710,340);ctx.lineTo(940,720);ctx.lineTo(-140,720);ctx.closePath();ctx.fill();ctx.strokeStyle='#a78c60';ctx.lineWidth=2;ctx.stroke();for(let i=0;i<22;i++){let x=150+(i*97)%500,y=355+(i*37)%300;ellipse(x,y,1.2,1.2,'#d9c39966')}ctx.restore();return}oldRoomTable()};
const oldDestinyPolish=destinyPage;destinyPage=function(){oldDestinyPolish();let form=$('content').querySelector('.astroForm');if(!form)return;let labels=[...form.querySelectorAll('label')];if(labels.length<5)return;let locationDetails=document.createElement('details');locationDetails.style.cssText='grid-column:1/-1;padding:12px;border:1px solid #c9b18a;border-radius:8px;background:#fff6e5';element('summary',tr('Birthplace: Singapore · change location','出生地：新加坡 · 更改地点'),locationDetails);let country=element('select','',locationDetails);country.style.cssText='width:100%;min-height:44px;margin:10px 0;font:inherit';let cities=[['Singapore','新加坡',8,1.35,103.82],['Hangzhou','杭州',8,30.27,120.16],['Shanghai','上海',8,31.23,121.47],['Beijing','北京',8,39.9,116.4],['Hong Kong','香港',8,22.32,114.17],['Kuala Lumpur','吉隆坡',8,3.14,101.69],['Taipei','台北',8,25.03,121.57],['Tokyo','东京',9,35.68,139.69]];cities.forEach((city,i)=>{let op=element('option',tr(city[0],city[1]),country);op.value=i});let custom=element('option',tr('Other / manual coordinates','其他地点 / 手动输入'),country);custom.value='custom';labels.slice(2,5).forEach(l=>locationDetails.append(l));country.onchange=()=>{if(country.value==='custom')return;let city=cities[Number(country.value)];labels.slice(2,5).forEach((l,i)=>l.querySelector('input').value=city[i+2]);locationDetails.querySelector('summary').textContent=tr('Birthplace: '+city[0],'出生地：'+city[1])};form.insertBefore(locationDetails,form.querySelector('button'));};

const ticketStyle=document.createElement('style');ticketStyle.textContent='#proposal .rail-ticket{align-self:center;width:min(92%,430px);background:#f3e6c7;color:#504836;position:relative;border:1px solid #a99165;padding:22px 22px 18px;box-shadow:0 14px 40px #15261b88;transform:rotate(-2deg);font-family:Georgia,"Songti SC",serif;display:grid;gap:13px;clip-path:polygon(0 0,100% 0,100% 45%,97% 50%,100% 55%,100% 100%,0 100%,0 55%,3% 50%,0 45%)}#proposal .rail-ticket .rail-brand{font:11px/1.3 system-ui;letter-spacing:.14em;border-bottom:1px solid #ad9978;padding-bottom:8px}#proposal .rail-ticket .route{font-size:clamp(24px,6vw,36px);line-height:1.1}#proposal .rail-ticket .rail-sub{font:12px/1.5 system-ui;color:#76674d}#proposal .rail-ticket label{display:grid;gap:4px;font-size:13px}#proposal .rail-ticket input{border:0;border-bottom:1px solid #85785c;border-radius:0;background:transparent;padding:7px 1px;font-size:23px;min-height:44px}#proposal .rail-ticket .ticket-stub{border-top:1px dashed #aa9770;padding-top:9px;display:flex;justify-content:space-between;align-items:center;font:11px system-ui;letter-spacing:.08em}#proposal .rail-ticket .stampmark{border:2px solid #9d5d45;color:#9d5d45;border-radius:50%;padding:8px;transform:rotate(-10deg)}#proposal .rail-ticket .ticket-confirm{border:1px solid #a69471;background:#e1d0a7;min-height:44px}#proposal .train-window{position:absolute;inset:10% 3%;overflow:hidden;border:12px solid #524337;border-radius:25px;background:#a1b6a2;box-shadow:0 0 0 3px #b8a081,inset 0 0 20px #342c22}#proposal .train-window img{width:145%;height:100%;object-fit:cover;animation:trainLandscape 3s linear forwards}#proposal .train-window:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,#ffefc425,transparent 40%,#f4e7b522 60%,transparent);pointer-events:none}@keyframes trainLandscape{from{transform:translateX(0)}to{transform:translateX(-30%)}}#proposal .scenery{transition:opacity .5s}#proposal .actions button{background:#f8edda20;color:#fff5df;border-color:#f3e5c67a;backdrop-filter:blur(8px)}#proposal header button{border-radius:50%;padding:8px;min-width:44px}#proposal .next{border-radius:4px}#proposal .ticket-stage footer{display:none}#worldSigns .worldSign{background:#e8d5adf0!important;border:1px solid #8e7654!important;color:#443b2a!important;border-radius:3px!important;font-family:Georgia,"Songti SC",serif!important;font-size:13px!important}#dialogue{background:#263a32ed!important;color:#fff3dc!important;border:1px solid #b0a382!important;box-shadow:0 5px 20px #18282055!important}#dialogue #speaker{color:#e6c990!important}#dialogue #choices button{background:transparent!important;color:#fff3dc!important;border:1px solid #d4c4a880!important;box-shadow:none!important;border-radius:4px!important}#hint{background:#24372cd9!important;color:#fff4db!important;border:0!important;box-shadow:none!important}';
document.head.append(ticketStyle);
const ticketBaseRender=proRender;proRender=function(){ticketBaseRender();if(proStep===4){let hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer');foot.replaceChildren();let ticket=element('form','',hero,'rail-ticket');element('div',tr('MEOWBOX RAILWAY · ONE WAY','摸鱼铁路 · 单程车票'),ticket,'rail-brand');element('div',tr('Reality → Fortune Valley','现实世界 → 解忧谷'),ticket,'route');element('div',tr('Valid for a much needed break.','有效期：直到你想回去为止。'),ticket,'rail-sub');let lab=element('label',tr('Passenger signature','旅客签名'),ticket);let input=element('input','',lab);input.type='text';input.maxLength=24;input.autocomplete='off';input.placeholder=tr('Your name','你的名字');input.value=proName;input.oninput=()=>proName=input.value;let stub=element('div','',ticket,'ticket-stub');element('span',tr('PLATFORM 01 · FREE SEAT','01号站台 · 自由席'),stub);element('span',tr('VALID','准予入境'),stub,'stampmark');let go=element('button',tr('Collect ticket','领取车票'),ticket,'ticket-confirm');go.type='submit';ticket.onsubmit=e=>{e.preventDefault();proStep=1;proRender()}}if(proStep===5){let hero=proposal.querySelector('.hero'),foot=proposal.querySelector('footer');let window=element('div','',hero,'train-window');let scenery=element('img','',window);scenery.src=ART.valleyClean;scenery.alt='';element('p',tr('Next stop, Fortune Valley.','下一站，解忧谷。'),foot);setTimeout(()=>{proBusy=false;proStep=3;proRender()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:1600)}};
proposalBoard=function(){if(proBusy)return;proBusy=true;proposal.classList.add('boarding');setTimeout(()=>{proStep=5;proRender()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:400)};

const cinemaCSS=document.createElement('style');cinemaCSS.textContent='#proposal .cinema-world{position:absolute;inset:0;z-index:-3;overflow:hidden;background:#293d33}#proposal .cinema-world img{position:absolute;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform 1.25s cubic-bezier(.22,.61,.36,1),opacity .85s ease;will-change:transform,opacity}#proposal .cinema-world img.station{transform:scale(1.06)}#proposal[data-shot="ticket"] .cinema-world img.station{transform:scale(1.25) translate(-5%,4%)}#proposal[data-shot="platform"] .cinema-world img.station{transform:scale(1.1) translate(3%,-1%)}#proposal[data-shot="train"] .cinema-world img.station{transform:scale(1.35) translate(-8%,0);opacity:0}#proposal .cinema-world img.valley{opacity:0;transform:scale(1.12)}#proposal[data-shot="train"] .cinema-world img.valley{opacity:1;transform:scale(1.05)}#proposal[data-shot="shrine"] .cinema-world img.valley{opacity:1;transform:scale(1)}#proposal[data-shot="shrine"] .cinema-world img.station{opacity:0}#proposal .scene-content{display:contents}#proposal .hero,#proposal footer{animation:cinemaIn .45s ease both}@keyframes cinemaIn{from{opacity:0;translate:0 7px}to{opacity:1;translate:0 0}}#proposal .rail-ticket{animation:ticketSlide .7s cubic-bezier(.22,.61,.36,1) both}@keyframes ticketSlide{from{opacity:0;transform:translateY(35px) rotate(2deg)}to{opacity:1;transform:translateY(0) rotate(-2deg)}}@media(prefers-reduced-motion:reduce){#proposal .cinema-world img{transition:none}}';document.head.append(cinemaCSS);
let cinematicWorld=null;
const beforeCinemaRender=proRender;
proRender=function(){let oldWorld=cinematicWorld;beforeCinemaRender();proposal.querySelector('.scenery')?.remove();if(!oldWorld){oldWorld=document.createElement('div');oldWorld.className='cinema-world';for(let [cls,key] of [['station','streetStation'],['valley','valleyClean']]){let im=document.createElement('img');im.className=cls;im.alt='';im.src=ART[key]||ART.valleyClean;oldWorld.append(im)}}cinematicWorld=oldWorld;if(oldWorld.parentNode!==proposal)proposal.prepend(oldWorld);proposal.dataset.shot=({0:'station',4:'ticket',1:'platform',2:'platform',5:'train',3:'shrine'})[proStep]||'station'};

const smoothStyle=document.createElement('style');smoothStyle.textContent='#proposal .hero,#proposal footer{animation:none}#proposal .cinema-world img{transition:transform 1.1s cubic-bezier(.25,.65,.35,1),opacity .7s ease}#proposal .traveller{animation:quietBreath 3s ease-in-out infinite alternate}#proposal.boarding .traveller{animation:boardWalk .8s ease-in forwards}#game canvas{display:block}#game .worldSign{transition:opacity .15s linear}#game #fade.door,#game #fade.curtain,#game #fade.gust{background:#24332c;transition:opacity .32s ease}#game #fade .doorPanel,#game #fade.gust i{display:none!important}';document.head.append(smoothStyle);
const cinematicFade=fade;
fade=function(fn,kind='gust',destination=null){if(kind==='postcard')return cinematicFade(fn,kind,destination);if(transitioning)return;transitioning=true;let overlay=$('fade');overlay.replaceChildren();overlay.className='';overlay.style.background='#26342c';overlay.style.transition='opacity .32s ease';overlay.style.opacity='0';let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;requestAnimationFrame(()=>{overlay.style.opacity='1';setTimeout(()=>{try{fn()}catch(e){console.error(e)}finally{requestAnimationFrame(()=>{overlay.style.opacity='0';setTimeout(()=>{overlay.style.opacity='';overlay.style.background='';overlay.style.transition='';transitioning=false},reduce?0:340)})}},reduce?0:330)})};

const crowdStyle=document.createElement('style');crowdStyle.textContent='#proposal .station-crowd{position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .35s;z-index:-1}#proposal[data-shot="station"] .station-crowd,#proposal[data-shot="platform"] .station-crowd,#proposal[data-shot="ticket"] .station-crowd{opacity:1}#proposal .station-walker{position:absolute;bottom:26%;left:-12%;width:13%;height:22%;animation:stationCross 12s linear infinite;filter:drop-shadow(0 5px 3px #20342866)}#proposal .station-walker img{width:100%;height:100%;object-fit:contain;object-position:center bottom;animation:stationBob .42s ease-in-out infinite alternate}#proposal .station-walker.reverse{bottom:36%;width:10%;height:17%;animation-direction:reverse;animation-duration:16s}#proposal .station-walker.reverse img{transform:scaleX(-1)}@keyframes stationCross{0%{translate:-20vw 0}100%{translate:125vw 0}}@keyframes stationBob{to{translate:0 -3px}}#proposal[data-shot="ticket"] .station-crowd{opacity:.6}#proposal .gate i{transition-duration:.5s}#proposal .gate-traveller{transition:transform .7s ease-in,opacity .2s .5s}#proposal .cinema-world img{transition-duration:.65s,.45s}@media(prefers-reduced-motion:reduce){#proposal .station-walker,#proposal .station-walker img{animation:none!important}}';document.head.append(crowdStyle);
const crowdRender=proRender;proRender=function(){crowdRender();if(!cinematicWorld.querySelector('.station-crowd')){let crowd=element('div','',cinematicWorld,'station-crowd');for(let i=0;i<3;i++){let w=element('div','',crowd,'station-walker'+(i===1?' reverse':''));w.style.animationDelay=(-i*4-2)+'s';let im=element('img','',w);im.src=ART['walker'+((i+1)%4)+'2'];im.alt=''}}};
const villageInit=initNPC;initNPC=function(){villageInit();if(!isRoute())return;for(let i=0;i<4;i++){let y=480+i*285,x=435+(i%2)*100;npc.push({x,y,tx:x+30,ty:y-40,kind:0,visitor:i,n:[['Mina','阿敏'],['Jun','小俊'],['Ren','阿仁'],['Hana','小花']][i]})}};
const villageDraw=drawRoute;drawRoute=function(){villageDraw();for(let n of npc){if(n.visitor===undefined)continue;let moving=Math.hypot(n.tx-n.x,n.ty-n.y)>3,dir=Math.abs(n.ty-n.y)>Math.abs(n.tx-n.x)?(n.ty<n.y?'up':'down'):(n.tx<n.x?'left':'right');backHuman(n.x,n.y,n.visitor,moving,dir,1.18*(.72+n.y/routeHeight*.55));if(Math.hypot(n.x-p.x,n.y-p.y)<160)target(n.x-24,n.y-110,48,115,()=>npcTalk(n))}};
const villageTalk=npcTalk;npcTalk=function(n){if(n?.visitor===undefined)return villageTalk(n);let lines=[['I came for a fortune. Stayed for the snacks.','本来是来求签的，结果吃了一路。'],['My calendar says I’m in a meeting. Technically, I’m meeting you.','日历显示我在开会。严格来说，我确实在见你。'],['The view up there is worth the stairs. Probably.','山上的风景值得爬楼梯。应该吧。'],['I asked the cards about my career. They suggested a nap.','我问塔罗事业如何，它建议我先睡一觉。']];let k=(n.visitor+(n.chats||0))%lines.length;n.chats=(n.chats||0)+1;say(tr(...n.n),tr(...lines[k]))};

const moveStyle=document.createElement('style');moveStyle.textContent='#moveGuide{position:fixed;z-index:5;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 94px);width:min(88%,360px);display:flex;align-items:center;gap:10px;padding:10px 14px;background:#283c32f0;border:1px solid #b8a985;color:#fff1d5;border-radius:8px;box-shadow:0 4px 18px #17251c55;font:14px/1.4 system-ui}#moveGuide[hidden],#movePad[hidden]{display:none!important}#moveGuide button{margin-left:auto;background:transparent;color:#fff1d5;border:0;box-shadow:none;padding:7px;min-width:44px;min-height:44px}#movePad{position:fixed;z-index:4;left:14px;bottom:calc(env(safe-area-inset-bottom,0px) + 88px);display:grid;grid-template-columns:repeat(3,38px);grid-template-rows:repeat(2,38px);gap:2px;touch-action:none}#movePad button{min-width:38px;min-height:38px;padding:0;background:#263a32b8;color:#fff4dc;border:1px solid #eee0bc80;border-radius:50%;box-shadow:none;font-size:20px;touch-action:none}#movePad button:active{background:#d5b885;color:#2b3e34}#movePad .up{grid-column:2}#movePad .left{grid-row:2;grid-column:1}#movePad .down{grid-row:2;grid-column:2}#movePad .right{grid-row:2;grid-column:3}@media(max-height:480px){#moveGuide{bottom:80px;left:auto;right:14px;transform:none;width:240px}}';document.head.append(moveStyle);
let moveGuide=element('div','',document.body);moveGuide.id='moveGuide';moveGuide.hidden=true;let moveCopy=element('span','',moveGuide);let moveDismiss=element('button','×',moveGuide);moveDismiss.setAttribute('aria-label','Dismiss movement hint');let movePad=element('div','',document.body);movePad.id='movePad';movePad.hidden=true;let guideDismissed=load('movementTutorialDone',false),guideStage=0,guideOrigin=null,guideTarget=null,guideStartedAt=0;
moveDismiss.onclick=()=>{guideDismissed=true;save('movementTutorialDone',true);moveGuide.hidden=true};
for(let [cl,key,arrow] of [['up','ArrowUp','↑'],['left','ArrowLeft','←'],['down','ArrowDown','↓'],['right','ArrowRight','→']]){let btn=element('button',arrow,movePad,cl);btn.setAttribute('aria-label','Move '+cl);btn.onpointerdown=e=>{e.preventDefault();btn.setPointerCapture(e.pointerId);keys[key]=true};btn.onpointerup=btn.onpointercancel=btn.onlostpointercapture=()=>{keys[key]=false};btn.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();keys[key]=true}};btn.onkeyup=()=>{keys[key]=false}}
const previousMoveReveal=beginValleyReveal;beginValleyReveal=function(){previousMoveReveal();guideStage=0;guideOrigin=null;guideTarget=null;guideStartedAt=0};
function movementUI(){let visible=proposal.hidden&&avatar!==null&&!activity&&!transitioning&&$('page').style.display!=='block'&&valleyRevealAt<0;movePad.hidden=!visible||!('ontouchstart' in window||navigator.maxTouchPoints>0);if(!visible||room||!isRoute()){moveGuide.hidden=true;requestAnimationFrame(movementUI);return}if(!guideOrigin){guideOrigin={x:p.x,y:p.y};guideTarget={x:p.x,y:Math.max(minY(),p.y-105)};guideStartedAt=performance.now()}if(!guideDismissed){let dist=Math.hypot(p.x-guideOrigin.x,p.y-guideOrigin.y);if(guideStage===0&&dist>65){guideStage=1;guideStartedAt=performance.now()}if(guideStage===1&&(pending||performance.now()-guideStartedAt>8500)){guideDismissed=true;save('movementTutorialDone',true)}moveGuide.hidden=guideDismissed;moveCopy.textContent=guideStage===0?tr('Tap the glowing spot on the path to walk. You can also use the joystick.','点击小路上的光圈前进，也可以使用摇杆。'):tr('Now tap a shop sign. Your traveller will walk inside.','现在点击店铺招牌，旅人会自己走进去。')}else moveGuide.hidden=true;requestAnimationFrame(movementUI)}
requestAnimationFrame(movementUI);
const drawGuideRoute=drawRoute;drawRoute=function(){drawGuideRoute();if(guideDismissed||guideStage!==0||!guideTarget||valleyRevealAt>=0||!proposal.hidden)return;let x=guideTarget.x,y=guideTarget.y,pulse=(Math.sin(t*3)+1)/2;ctx.save();ctx.strokeStyle='rgba(255,230,155,'+(.65+pulse*.3)+')';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y,23+pulse*7,12+pulse*4,0,0,TAU);ctx.stroke();ctx.fillStyle='#fff2bb';ctx.beginPath();ctx.moveTo(x,y-23);ctx.lineTo(x-8,y-36);ctx.lineTo(x+8,y-36);ctx.closePath();ctx.fill();ctx.restore();target(x-38,y-40,76,75,()=>{stopRoute();p.tx=x;p.ty=y})};

const livingEntranceStyle=document.createElement('style');livingEntranceStyle.textContent='#proposal .platform-ui{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:center;gap:12px;z-index:5}#proposal .platform-ui button{min-height:44px;min-width:44px;background:#263b32d9;color:#fff3d9;border-color:#d2bd8a;border-radius:50%}#proposal .living-lights{position:absolute;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse at 75% 24%,#ffdda52b,transparent 45%);animation:lightDrift 7s ease-in-out infinite alternate}#proposal .platform-player{position:absolute;left:50%;bottom:8%;width:min(55%,250px);height:78%;object-fit:contain;object-position:center bottom;transform:translateX(-50%);transition:left .7s ease,bottom .7s ease,scale .7s ease;filter:drop-shadow(0 8px 5px #17291e66)}#proposal .platform-player.walking{animation:stepBob .28s ease-in-out infinite alternate}#proposal .rail-ticket{transform-origin:center bottom}#proposal .train-window img{animation-duration:1.6s}#proposal .cinema-world img{transition-duration:.65s,.45s}@keyframes stepBob{to{translate:0 -4px}}@keyframes lightDrift{to{opacity:.4;transform:translateX(-4%)}}';document.head.append(livingEntranceStyle);
const livingRender=proRender;let platformX=50,platformY=8,platformTimer;
proRender=function(){livingRender();if(!cinematicWorld.querySelector('.living-lights'))element('div','',cinematicWorld,'living-lights');if(proStep!==1&&proStep!==2)return;let hero=proposal.querySelector('.hero'),im=hero.querySelector('.traveller');if(!im)return;im.classList.remove('traveller');im.classList.add('platform-player');im.style.left=platformX+'%';im.style.bottom=platformY+'%';let foot=proposal.querySelector('footer');if(proStep===1){let control=element('div','',hero,'platform-ui');for(let [dx,arrow] of [[-14,'‹'],[14,'›']]){let btn=element('button',arrow,control);btn.setAttribute('aria-label',dx<0?tr('Walk left','向左走'):tr('Walk right','向右走'));btn.onclick=()=>{platformX=Math.max(22,Math.min(78,platformX+dx));im.style.left=platformX+'%';im.src=ART['walker'+proAvatar+'2'];im.style.transform='translateX(-50%) scaleX('+(dx<0?-1:1)+')';im.classList.add('walking');clearTimeout(platformTimer);platformTimer=setTimeout(()=>{im.classList.remove('walking');im.style.transform='translateX(-50%)';im.src=ART['walker'+proAvatar+'0']},720)}}}};
const priorBoardLiving=proposalBoard;proposalBoard=function(){let im=proposal.querySelector('.platform-player');if(im&&!proBusy){im.classList.add('walking');im.style.left='76%';im.style.bottom='35%';im.style.scale='.48';im.src=ART['walker'+proAvatar+'1'];setTimeout(()=>{if(!proBusy)priorBoardLiving()},650)}else priorBoardLiving()};
const cameoNamesLiving=[['Master Payrise','周薪驰'],['Lady Clocked Out','甄摸鱼'],['Mr. Raincheck','王家卫班'],['Dragon King Meow','龙傲喵'],['Uncle Offchip','黄不忙'],['Auntie Hong','红姐'],['Chef Grumbles','暴躁大厨'],['Uncle Wok','锅叔'],['Emily in Payroll','薪水博主'],['Kim Out-of-Office','金总'],['Mr. Been-on-Leave','休假先生'],['Miss Holiday','李佳期'],['Mystery Box Merchant','盲盒奸商']];
const cameoLinesLiving=[['I came to ask for a raise. The gods suggested annual leave.','我来求加薪，神明建议我先请假。'],['One shall not be summoned to a meeting after five.','本宫绝不参加五点后的会议。'],['Some deadlines are like rain. They arrive when you forget your umbrella.','有些截止日期像雨，偏偏在没带伞时出现。'],['The entire valley is mine. Except the bills.','整座解忧谷都是我的，除了账单。'],['Fishing? No, I am conducting aquatic research.','摸鱼？我是在进行水生研究。'],['Have you heard? The boss booked a fortune reading.','听说了吗？老板也来求签了。'],['This soup needs salt, not another committee.','这锅汤需要盐，不需要再开会。'],['The wok is hot. Your inbox can wait.','锅已经热了，邮件等一等。'],['Payroll says happiness is not a reimbursable expense.','财务说快乐不能报销。'],['My out-of-office reply has its own out-of-office reply.','我的自动回复也设置了自动回复。'],['I took leave to recover from planning my leave.','我请假是为了休息一下，毕竟计划休假也很累。'],['I have three trips planned and no annual leave left.','我计划了三趟旅行，年假却没了。'],['A mysterious box. No PowerPoint inside, I promise.','神秘盲盒，保证里面没有PPT。']];
const initCameoLiving=initNPC;initNPC=function(){initCameoLiving();if(!isRoute())return;let daily=Math.floor(Date.now()/86400000)%cameoNamesLiving.length;npc.filter(n=>n.visitor!==undefined).forEach((n,i)=>{n.cameo=(daily+i*3)%cameoNamesLiving.length;n.n=cameoNamesLiving[n.cameo]})};
const talkCameoLiving=npcTalk;npcTalk=function(n){if(n?.cameo===undefined)return talkCameoLiving(n);let line=cameoLinesLiving[n.cameo];n.chats=(n.chats||0)+1;let follow=n.chats%2===0?tr(' Anyway, if anyone asks, we are networking.',' 对了，有人问就说我们在拓展人脉。'):'';say(tr(...n.n),tr(...line)+follow);if(typeof addItem==='function')addItem('Met '+n.n[0],'偶遇'+n.n[1])};

const lunarMenu=()=>{let l=lunarInfo();return !!l&&(l.d===1||l.d===15)};
const dailyLocal=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const pickDaily=(arr,key)=>arr[hash(dailyLocal()+key)%arr.length];
const lunarNoteStyle=document.createElement('style');lunarNoteStyle.textContent='#lunarRibbon{position:fixed;top:calc(env(safe-area-inset-top,0px) + 65px);left:50%;transform:translateX(-50%);z-index:4;background:#38483aeb;color:#fff2cd;border:1px solid #b6a47c;padding:7px 12px;border-radius:4px;font:13px Georgia,serif;max-width:75%;text-align:center;box-shadow:0 3px 8px #19251c44}#lunarRibbon[hidden]{display:none!important}';document.head.append(lunarNoteStyle);
let lunarRibbon=element('button','',document.body);lunarRibbon.id='lunarRibbon';lunarRibbon.hidden=true;lunarRibbon.onclick=()=>calendarPage();
function lunarTick(){let on=lunarMenu()&&proposal.hidden&&!room&&scene==='fortune'&&valleyRevealAt<0&&$('page').style.display!=='block';lunarRibbon.hidden=!on;if(on){let l=lunarInfo();lunarRibbon.textContent=tr('Lunar day '+l.d+' · Vegetarian day', (l.d===1?'初一':'十五')+' · 今日宜吃素')}setTimeout(lunarTick,1000)}lunarTick();
const seasonalGreetings={
tarot:[['The cards are ready. Your emails can wait.','牌已经洗好了，邮件先放一边。'],['Ask about love, work or whatever keeps you awake.','问感情、事业，或让你睡不着的事。'],['Take a seat. There is no rush to know everything.','坐吧，不用急着知道所有答案。']],
temple:[['A sincere wish is enough. No appointment needed.','心诚就好，不用预约。'],['The gods are listening. Unlike some group chats.','神明在听，不像有些群聊。'],['One question at a time, please. Heaven has a queue.','一次问一件事，天庭也要排队。']],
kitchen:[['Come hungry. Leave the work talk outside.','饿了就来，工作的话留在门外。'],['Today we cook slowly. No performance appraisal.','今天慢慢煮，不用做绩效考核。'],['Wash your hands. Your boss cannot help with this one.','先洗手，这件事老板帮不了你。']],
wishes:[['A lantern for the things you cannot put into words.','说不出口的心愿，就交给这盏灯。'],['Write a wish. No need to CC the universe.','写个心愿，不用抄送宇宙。'],['The wind is gentle today. Stay a little longer.','今天风很轻，多待一会儿吧。']],
arcade:[['The machine is in a good mood. Or so it claims.','机器说自己今天心情不错。'],['Aim carefully. These plushies have no deadlines.','慢慢瞄准，玩偶没有截止日期。']],
destiny:[['Your birth chart is a map, not a prison.','命盘是一张地图，不是一座牢笼。'],['Let us look at your stars before your inbox.','先看看星星，再看收件箱。']]
};
const prevSeasonIntro=roomIntro;roomIntro=function(){prevSeasonIntro();if(room==='temple'&&lunarMenu()){toast(tr('It is lunar day '+lunarInfo().d+'. Vegetarian meals are available at Grandma’s today.', '今天农历'+(lunarInfo().d===1?'初一':'十五')+'，有吃素习惯的旅人，外婆今天准备了素食。'));return}if(room==='kitchen'&&lunarMenu()){toast(tr('Grandma: Mushroom, greens and tofu today. Come eat!','外婆：今天初一十五，香菇青菜豆腐汤，来吃饭啦！'));return}let pool=seasonalGreetings[room];if(pool)toast(tr(...pickDaily(pool,room)))};
const prevSeasonStart=start;start=function(id){prevSeasonStart(id);if(id==='cook'){state.vegetarian=lunarMenu();state.recipe=state.vegetarian?['Mushroom and tofu soup','香菇豆腐汤']:pickDaily([['Tomato and egg soup','番茄蛋汤'],['Tomato and greens soup','番茄青菜汤'],['Grandma’s comfort soup','外婆暖心汤']],'recipe');hint(tr('Today’s recipe: '+state.recipe[0]+'. Drag ingredients into the pot.','今日菜谱：'+state.recipe[1]+'。把食材拖入锅中。'),'今日菜谱：'+state.recipe[1]+'。把食材拖入锅中。')}};
const priorSeasonDraw=drawActivity;drawActivity=function(){priorSeasonDraw();if(activity==='cook'&&state.recipe){ctx.save();txt(tr(...state.recipe),400,350,18,'#fff1c8');ctx.restore()}};
const oldFortuneVariation=arcanaReading;arcanaReading=function(d,rev){let base=oldFortuneVariation(d,rev);let lines=[['Give yourself a moment before responding to anything urgent.','遇到急事，先给自己一点思考的时间。'],['Notice what you can change, and what you can leave alone.','分清哪些事能改变，哪些事可以放下。'],['One small practical step is enough for today.','今天先做好一件小事就够了。']];return base+' '+tr(...pickDaily(lines,d[0]+rev))};

/* Proposal polish: a single depth-sorted world pass, reliable signs and contextual interaction. */
const proposalPolish=document.createElement('style');proposalPolish.textContent='#proposal .cinema-world{background:#34493b}#proposal .cinema-world img{object-fit:contain;background:#34493b}#proposal[data-shot="ticket"] .cinema-world img.station{transform:scale(1.08)}#proposal[data-shot="platform"] .cinema-world img.station{transform:scale(1.04)}#proposal .gate{max-width:520px;left:50%;width:100%;transform:translateX(-50%)}#proposal .gate-traveller{height:38%}#proposal footer{padding-bottom:4px}#worldSigns{z-index:2;pointer-events:none}#worldSigns .worldSign{pointer-events:auto!important;touch-action:manipulation;white-space:nowrap!important;max-width:calc(100vw - 16px)!important;min-height:44px!important;padding:7px 10px!important;font-size:12px!important;letter-spacing:.02em;box-shadow:0 2px 5px #322b2150!important}#moveGuide{bottom:calc(env(safe-area-inset-bottom,0px) + 158px);font-size:13px}#movePad{grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,44px)}#movePad button{min-width:44px;min-height:44px}#dialogue{max-height:42dvh!important;overflow:auto!important}#dialogue #choices{display:flex;flex-wrap:wrap;gap:6px}#dialogue #choices button{min-height:44px}#page .astroResult{overflow-wrap:anywhere}#page .astroForm details label{margin-top:10px}#page .v9scene{border-radius:5px!important}#gameControls button{min-height:44px}#fade{pointer-events:none!important}@media(max-height:480px){#moveGuide{bottom:80px;right:12px;left:auto;max-width:45vw;transform:none}#proposal .rail-ticket{padding:12px;gap:6px}}';document.head.append(proposalPolish);
const signAnchorsProposal={tarot:[560,488],destiny:[300,715],temple:[680,943],wishes:[495,1190],station:[660,323]};
syncSigns=function(){let show=scene==='fortune'&&!room&&!transitioning&&$('page').style.display!=='block'&&avatar!==null&&proposal.hidden&&$('arrival').hidden&&valleyRevealAt<0&&!quiet9;signRoot.hidden=!show;if(!show)return;if(signButtons.size!==maps.fortune.st.length){signRoot.replaceChildren();signButtons.clear();for(let [id,x,y,en,cn] of maps.fortune.st){let e=element('button','',signRoot,'worldSign');e.onclick=()=>walkDoor(id,x,y);signButtons.set(id,e)}}for(let [id,x,y,en,cn] of maps.fortune.st){let e=signButtons.get(id),[ax,ay]=signAnchorsProposal[id]||[x,y-90],sx=cam.ox+ax*cam.scale,sy=cam.oy+ay*cam.scale;if(e.textContent!==tr(en,cn))e.textContent=tr(en,cn);e.hidden=sy<Math.min(145,H*.22)||sy>H-115||sx<0||sx>W;if(!e.hidden){const half=Math.min(W/2-8,(e.offsetWidth||100)/2+8);e.style.left=Math.max(half,Math.min(W-half,sx))+'px';e.style.top=sy+'px'}}};
drawRoute=function(){if(pics.valleyClean?.naturalWidth)ctx.drawImage(pics.valleyClean,0,0,1000,routeHeight);for(let [x,y,r,i] of [[108,1280,36,0],[130,912,35,1],[475,918,36,2],[620,664,36,3],[960,594,30,4],[306,407,33,5],[855,267,35,6]])glow(x,y,r,i);for(let i=0;i<18;i++){let x=((i*91-t*(8+i%7))%1000+1000)%1000,y=(i*83+t*(14+i%8))%routeHeight;petal(x,y,3+i%4,i)}for(let [id,x,y] of maps.fortune.st){let z=doorZones[id];if(z)target(z[0],z[1],z[2],z[3],()=>walkDoor(id,x,y))}for(let n of [...npc,p].sort((a,b)=>a.y-b.y)){let sc=.72+n.y/routeHeight*.55;if(n===p){continue}let dx=n.tx-n.x,dy=n.ty-n.y,moving=Math.hypot(dx,dy)>3,dir=Math.abs(dy)>Math.abs(dx)?dy<0?'up':'down':dx<0?'left':'right';if(n.kind===2&&n.visitor===undefined){cat(n.x,n.y,0,moving,.65*sc)}else backHuman(n.x,n.y,n.visitor??1,moving,dir,1.22*sc);if(Math.hypot(n.x-p.x,n.y-p.y)<170&&valleyRevealAt<0){let label=n.visitor===undefined?tr(...n.n):'···';ctx.save();ctx.font='14px Georgia';let w=Math.max(34,ctx.measureText(label).width+16);round(n.x-w/2,n.y-111,w,24,5,'#fff0d9e8','#b39a70');txt(label,n.x,n.y-99,13);ctx.restore();target(n.x-36,n.y-115,72,115,()=>npcTalk(n))}}const playerScale=Math.max(1.65*(.72+p.y/routeHeight*.55),54/(85*Math.max(.01,cam.scale)));ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';backHuman(p.x,p.y,avatar??0,p.walk,p.facing||'up',playerScale);ctx.restore();if(!guideDismissed&&guideStage===0&&guideTarget&&valleyRevealAt<0&&proposal.hidden){let {x,y}=guideTarget,f=(Math.sin(t*3)+1)/2;ctx.save();ctx.strokeStyle='rgba(255,230,155,'+(.65+f*.3)+')';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y,23+f*7,12+f*4,0,0,TAU);ctx.stroke();ctx.restore();target(x-40,y-40,80,80,()=>{stopRoute();p.tx=x;p.ty=y})}};
let lanternMemories=load('proposalLanternCount',0);
const worldActivityDraw=drawActivity;drawActivity=function(){worldActivityDraw();if(activity==='wishes'){for(let i=0;i<Math.min(lanternMemories,7);i++){let x=185+i*66,y=295+(i%3)*28;ctx.save();ctx.translate(x+Math.sin(t*.9+i)*3,y);ctx.rotate(Math.sin(t*.9+i)*.04);glow(0,0,38,i);line(0,-35,0,-18,'#a68a61',1.5);round(-14,-18,28,35,8,'#db9b51','#875534');line(-5,-15,-5,14,'#ad6d3a');line(5,-15,5,14,'#ad6d3a');ctx.restore()}}};
const finalGuideStart=start;start=function(id){finalGuideStart(id);if(id==='wishes')state.lanternAt=undefined};
window.addEventListener('blur',()=>{for(let k in keys)keys[k]=false;drag=null});c.addEventListener('pointercancel',()=>{drag=null});
const dayReadings=tarotDetails;tarotDetails=function(d,rev){dayReadings(d,rev);let opts=$('choices');for(let [en,cn,advice,adviceZh] of [['Love','感情','Consider how the card relates to mutual understanding, boundaries and what you need from a relationship.','想想这张牌与你的相处方式、界限，以及感情需求有什么关联。'],['Career','事业','Consider the choices you can make at work and what is outside your control.','想想工作中有哪些选择是你能掌握的，哪些并非你能控制。'],['Money','财运','Reflect on spending habits and practical priorities; this is not financial advice.','想想消费习惯与实际需要；这不是投资建议。']]){let btn=element('button',tr(en,cn),opts);btn.onclick=()=>say(tr('Luna','月见'),tr(d[0],d[1])+' · '+orient(rev)+'\n'+arcanaReading(d,rev)+'\n'+tr(advice,adviceZh),[[tr('Back to reading','返回解读'),()=>tarotDetails(d,rev)],[tr('Close','关闭'),closeTalk]])}};

const destinyChamberStyle=document.createElement('style');
destinyChamberStyle.textContent=`
#content:has(.destinyChamber){color:#f4e6c7;background:linear-gradient(150deg,#182e36,#293d40 55%,#473e36);border:1px solid #a58b60;padding:clamp(12px,4vw,30px);border-radius:3px}
#content:has(.destinyChamber)>h1,#content:has(.destinyChamber)>p{display:none}
#content:has(.destinyChamber) .row button{color:#f4e6c7;background:#203638;border:1px solid #a58b60}
.destinyChamber{position:relative;isolation:isolate;min-height:185px;overflow:hidden;text-align:center;padding:22px 12px 16px;background:radial-gradient(ellipse at 50% 12%,#b6a16b38,transparent 65%);border-bottom:1px solid #a58b6070}
.destinyChamber svg{width:100%;max-width:440px;height:140px;display:block;margin:auto}
.destinyChamber h1{font:normal clamp(25px,6vw,42px) Georgia,serif;margin:0;color:#f7dfaa}
.destinyChamber p{color:#e5d7b8;font:15px/1.6 Georgia,serif;margin:10px auto;max-width:440px}
.destinyChamber .star{animation:destinyTwinkle 3s ease-in-out infinite alternate}
@keyframes destinyTwinkle{from{opacity:.25}to{opacity:1}}
@keyframes destinyOrbit{to{transform:rotate(360deg)}}
.destinyChamber .orbit{transform-origin:220px 70px;animation:destinyOrbit 65s linear infinite}
#content:has(.destinyChamber) .astroForm{margin:18px 0;padding:16px;background:#f0e2c8;color:#514333;border:1px solid #b29b71;border-radius:2px;box-shadow:0 5px 22px #0d202e55}
#content:has(.destinyChamber) .astroForm input,#content:has(.destinyChamber) .astroForm select{background:#fff5e0;color:#463e30;border:0;border-bottom:1px solid #a58b60;border-radius:0;box-sizing:border-box}
#content:has(.destinyChamber) .astroForm button{background:#8a513d;color:#fff2d6;border:1px solid #6f4433;border-radius:2px}
#content:has(.destinyChamber) .astroResult h2{color:#f5dcab;font:normal 24px Georgia,serif;margin-top:25px}
#content:has(.destinyChamber) .astroThree article{background:#e8d9b8;color:#534334;border:1px solid #b4a079}
#content:has(.destinyChamber) .ziGrid{position:relative;gap:4px;grid-template-columns:repeat(4,minmax(0,1fr));margin:12px 0}
#content:has(.destinyChamber) .ziGrid article:not(.blank){background:#e9d9b5;color:#483d30;border:1px solid #a68a58;border-radius:2px;padding:7px 4px;cursor:pointer;min-height:70px;animation:destinyReveal .55s both;animation-delay:calc(var(--i)*60ms)}
#content:has(.destinyChamber) .ziGrid article.lifePalace{background:#d3a76c;border:2px solid #f6d891}
#content:has(.destinyChamber) .ziGrid article[aria-pressed=true]{outline:2px solid #eec678;outline-offset:1px}
#content:has(.destinyChamber) .ziGrid article.blank{background:transparent;border:0;visibility:hidden}
#content:has(.destinyChamber) .destinyCenter{position:absolute;inset:25% 25%;display:grid;place-content:center;text-align:center;pointer-events:none;color:#e6c98b;font:normal clamp(12px,3vw,21px) Georgia,serif;line-height:1.6;background:radial-gradient(circle,#c6a35d20,transparent 65%)}
#content:has(.destinyChamber) .destinyReflection{background:#f0e2c8;color:#514333;border-left:4px solid #b89a5e;padding:14px;margin:12px 0;line-height:1.6}
#content:has(.destinyChamber) .destinySave{min-height:44px;background:#d6b77e;color:#47372a;border:1px solid #9f8356;width:100%}
@keyframes destinyReveal{from{opacity:0;transform:translateY(6px) scale(.94)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.destinyChamber .star,.destinyChamber .orbit,#content:has(.destinyChamber) .ziGrid article{animation:none!important}}
`;document.head.append(destinyChamberStyle);
const destinyBeforeChamber=destinyPage;
destinyPage=function(){
 destinyBeforeChamber();
 let q=$('content'),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');if(!form||!out)return;
 let hero=document.createElement('section');hero.className='destinyChamber';
 let stars=Array.from({length:32},(_,i)=>'<circle class="star" cx="'+(15+(i*97)%410)+'" cy="'+(7+(i*53)%126)+'" r="'+(i%4===0?1.8:.8)+'" fill="#f7e5b4" style="animation-delay:-'+(i%7)*.4+'s"/>').join('');
 hero.innerHTML='<svg viewBox="0 0 440 140" aria-hidden="true"><defs><radialGradient id="destinyMoon"><stop stop-color="#fff0bc"/><stop offset="1" stop-color="#c0a273"/></radialGradient></defs>'+stars+'<g class="orbit" stroke="#bca16c" fill="none" opacity=".7"><circle cx="220" cy="70" r="58"/><ellipse cx="220" cy="70" rx="105" ry="38" transform="rotate(-25 220 70)"/><ellipse cx="220" cy="70" rx="105" ry="38" transform="rotate(25 220 70)"/><path d="M220 12v116M162 70h116" stroke-dasharray="2 7"/></g><circle cx="220" cy="70" r="27" fill="url(#destinyMoon)"/><circle cx="231" cy="63" r="23" fill="#263b40"/><g stroke="#dbbf81" stroke-width="1.3" fill="none"><path d="M36 38l43 24 38-35 38 28M292 31l42 33 36-25 33 35"/></g><g fill="#e7cf97"><circle cx="36" cy="38" r="3"/><circle cx="79" cy="62" r="3"/><circle cx="117" cy="27" r="3"/><circle cx="155" cy="55" r="3"/><circle cx="292" cy="31" r="3"/><circle cx="334" cy="64" r="3"/><circle cx="370" cy="39" r="3"/><circle cx="403" cy="74" r="3"/></g></svg>';
 element('h1',tr('The Observatory','星月命理小馆'),hero);
 element('p',tr('Astrologer · The stars have been waiting. Your emails can wait a little longer.','命理师：星星等你很久了。至于工作消息，再等等也无妨。'),hero);
 element('small',tr('A birth chart for reflection, not a prediction. Your birth details are not saved.','命盘仅供自我探索，并非预言。生辰资料不会保存。'),hero);
 q.insertBefore(hero,form);
 let row=q.querySelector('.row');if(row&&row.lastElementChild)row.lastElementChild.onclick=()=>{zh=!zh;save('zh',zh);updateHUD();destinyPage()};
 let birthTime=form.querySelector('input[type=time]');if(birthTime)birthTime.value='';
 let dateField=form.querySelector('input[type=date]');if(dateField)dateField.max=new Date().toLocaleDateString('en-CA');
 const prompts=[
 ['Life','命宫','What part of yourself deserves more attention?','最近，你最想好好照顾自己的哪一面？'],
 ['Siblings','兄弟','Who makes you feel understood?','谁能让你感觉被理解？'],
 ['Partner','夫妻','What makes a relationship feel safe and kind?','怎样的关系会让你安心自在？'],
 ['Children','子女','What are you creating or nurturing?','你正在用心培育什么？'],
 ['Wealth','财帛','What spending choices reflect your real priorities?','怎样花钱才更符合你真正的需要？'],
 ['Health','疾厄','What ordinary habit helps you rest?','什么日常习惯能让你好好休息？'],
 ['Travel','迁移','Where would you go with a free afternoon?','如果有半天空闲，你想去哪里？'],
 ['Friends','交友','Which friendships feel reciprocal?','哪些朋友让你感觉彼此珍惜？'],
 ['Career','官禄','What work feels worthwhile to you?','什么样的工作让你觉得有意义？'],
 ['Property','田宅','What makes a place feel like home?','什么能让一个地方有家的感觉？'],
 ['Fortune','福德','What brings you peace without needing to achieve anything?','不必完成任何任务，什么也能让你感到快乐？'],
 ['Parents','父母','What values have you chosen to carry forward?','有哪些价值观是你愿意继续传承的？']];
 form.addEventListener('submit',()=>{
 let grid=out.querySelector('.ziGrid');if(!grid)return;
 let note=element('p',tr('Tap any palace to explore a reflection question. The chart follows the existing main-star calculation; interpretations are reflective, not a verified reading.','点击任意宫位，探索对应的自我反思问题。命盘沿用现有十四主星算法，解读仅供反思，未经专业验证。'),out);
 out.insertBefore(note,grid);
 let center=element('div',tr('Twelve Palaces','十二宫')+' · '+tr('Star map','星图'),grid,'destinyCenter');
 let panel=element('section',tr('Choose a palace. The astrologer is listening.','选一宫吧，命理师在听。'),out,'destinyReflection');panel.setAttribute('aria-live','polite');
 grid.after(panel);
 [...grid.querySelectorAll('article:not(.blank)')].forEach((a,i)=>{
 a.style.setProperty('--i',i);a.tabIndex=0;a.setAttribute('role','button');a.setAttribute('aria-pressed','false');
 let choose=()=>{let title=a.querySelector('strong')?.textContent||'',p=prompts.find(x=>title.startsWith(tr(x[0],x[1])));if(!p)return;grid.querySelectorAll('[aria-pressed]').forEach(el=>el.setAttribute('aria-pressed','false'));a.setAttribute('aria-pressed','true');panel.replaceChildren();element('strong',tr(p[0],p[1]),panel);element('p',a.querySelector('span')?.textContent||'',panel);element('p',tr(p[2],p[3]),panel);sound(440+i*18)};
 a.onclick=choose;a.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}};
 });
 let saveScroll=b(out,tr('Tie the destiny scroll and keep it','系好命理卷轴，收入背包'),()=>{addItem('Observatory destiny scroll','星月命理卷轴');saveScroll.textContent=tr('Scroll collected','卷轴已收藏');saveScroll.disabled=true;sound(660)});saveScroll.className='destinySave';
 });
};

const destinyRoomArtStyle=document.createElement('style');
destinyRoomArtStyle.textContent=`
#content:has(.destinyChamber){background:#d8c5a1 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath d='M0 0h120v100H0z' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E");color:#514335;border:0;padding:clamp(10px,3vw,24px);box-shadow:inset 0 0 36px #77553740}
#content:has(.destinyChamber) .row button{background:#f2e3c5;color:#614b37;border:1px solid #9b8059}
.destinyChamber{min-height:0;padding:0 0 13px;background:#eee0c4;border:1px solid #a68b65;overflow:hidden}
.destinyChamber .roomIllustration{display:block;width:100%;height:auto;max-height:320px;object-fit:cover;object-position:50% 45%;aspect-ratio:16/9}
.destinyChamber .roomArtWrap{position:relative;overflow:hidden;background:#74634c}
.destinyChamber .roomArtWrap:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,#4a302c55,transparent 40%),radial-gradient(ellipse at 80% 45%,#ffe8a655,transparent 42%);animation:roomGlow 3.5s ease-in-out infinite alternate}
@keyframes roomGlow{to{opacity:.35}}
.destinyChamber .roomArtWrap svg{position:absolute;inset:0;width:100%;height:100%;max-width:none;pointer-events:none}
.destinyChamber h1{color:#5f4934;margin:15px 10px 0;font-size:clamp(25px,5vw,35px)}
.destinyChamber p{color:#674f3b;padding:0 12px;margin:8px auto}
.destinyChamber small{display:block;color:#856e54;padding:0 12px;font-size:12px}
.destinyChamber .keeperNote{border-top:1px solid #c9b38c;margin:10px 16px 0;padding:10px 0 0;text-align:left}
.destinyChamber .keeperNote strong{color:#9b543d;font:normal 13px Georgia,serif}
#content:has(.destinyChamber) .astroForm{background:#f4e7cb;box-shadow:0 4px 10px #72513340;border:1px solid #b39871;position:relative}
#content:has(.destinyChamber) .astroResult h2{color:#634a36}
#content:has(.destinyChamber) .destinyScrollStage{position:relative;padding:20px 10px;background:repeating-linear-gradient(2deg,#926b4c 0px,#a47c56 3px,#9e7652 6px,#9e7652 15px);box-shadow:inset 0 2px 12px #49302160;border-radius:4px}
#content:has(.destinyChamber) .destinyScroll{position:relative;padding:17px 10px;background:radial-gradient(ellipse at center,#fff0cf,#e1c89a);color:#624a32;border:1px solid #ae8e59;box-shadow:0 5px 11px #51382166;animation:scrollUnfurl .9s ease-out both;transform-origin:top center}
#content:has(.destinyChamber) .destinyScroll:before,#content:has(.destinyChamber) .destinyScroll:after{content:"";position:absolute;left:-5px;right:-5px;height:11px;background:linear-gradient(#71533e,#b28b5f 35%,#7f5738);border-radius:5px;box-shadow:0 2px 4px #4e362c55}
.destinyScroll:before{top:-6px}.destinyScroll:after{bottom:-6px}
@keyframes scrollUnfurl{from{clip-path:inset(0 0 96% 0);opacity:.65}to{clip-path:inset(0 -6px -8px -6px);opacity:1}}
#content:has(.destinyChamber) .ziGrid{gap:0;margin:6px 0;border:1px solid #987b50;background:transparent}
#content:has(.destinyChamber) .ziGrid article:not(.blank){background:transparent;border:0;border-right:1px solid #b1986b;border-bottom:1px solid #b1986b;border-radius:0;color:#63492e;padding:6px 3px;font-family:Georgia,"Songti SC",serif;min-height:78px}
#content:has(.destinyChamber) .ziGrid article.lifePalace{background:#bc765329;box-shadow:inset 0 0 0 2px #a45c40;border:0}
#content:has(.destinyChamber) .ziGrid article[aria-pressed=true]{background:#e3b66c70;outline:2px solid #ad6945;outline-offset:-2px}
#content:has(.destinyChamber) .destinyCenter{color:#936642;background:none;font-size:clamp(11px,3vw,20px);letter-spacing:.04em}
#content:has(.destinyChamber) .destinyReflection{background:#f3e4c6;border-left:3px solid #a36a4a;color:#604a36;box-shadow:0 2px 8px #5f402c22}
#content:has(.destinyChamber) .destinySave{background:#8c5c45;color:#fff0d4;border-color:#754c37}
.destinyScrollTitle{color:#916144;font:normal 18px Georgia,serif;text-align:center;letter-spacing:.12em;margin:0 0 8px}
@media(max-width:420px){#content:has(.destinyChamber) .destinyScrollStage{padding:15px 5px}#content:has(.destinyChamber) .destinyScroll{padding:12px 3px}#content:has(.destinyChamber) .ziGrid article:not(.blank){font-size:10px;min-height:70px;overflow-wrap:anywhere}#content:has(.destinyChamber) .ziGrid article strong{font-size:11px}}
@media(prefers-reduced-motion:reduce){.destinyScroll,.roomArtWrap:after{animation:none!important}}
`;document.head.append(destinyRoomArtStyle);
const destinyPriorIllustration=destinyPage;
destinyPage=function(){
 destinyPriorIllustration();let q=$('content'),hero=q.querySelector('.destinyChamber'),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');if(!hero||!form||!out)return;
 const oldSvg=hero.querySelector('svg');if(oldSvg)oldSvg.remove();
 let wrap=document.createElement('div');wrap.className='roomArtWrap';let im=document.createElement('img');im.className='roomIllustration';im.alt=tr('Illustrated fortune reading room','手绘命理小馆');im.src=ART.readingInterior||ART.streetDestiny;wrap.append(im);
 wrap.insertAdjacentHTML('beforeend','<svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="#fff2c7"><circle class="star" cx="98" cy="69" r="2"/><circle class="star" cx="318" cy="55" r="1.5"/><circle class="star" cx="487" cy="113" r="2"/><circle class="star" cx="425" cy="64" r="1.5"/></g><g transform="translate(515 24)"><path d="M0 0v25" stroke="#5e4538" stroke-width="2"/><path d="M-15 31Q0 19 15 31L19 54Q0 67-19 54Z" fill="#e1a55d" stroke="#79513a" stroke-width="2"/><path d="M-7 29Q-11 46-7 58M7 29Q11 46 7 58" stroke="#ae7443" fill="none"/><path d="M-10 27h20M-10 60h20M0 61v15" stroke="#624536" stroke-width="3"/><ellipse class="star" cx="0" cy="45" rx="11" ry="16" fill="#ffe9a5" opacity=".5"/></g><g fill="none" stroke="#e9d8b5" stroke-width="2" opacity=".55"><path d="M82 278q-20-17 0-37t-3-30"><animate attributeName="opacity" values=".1;.7;.1" dur="5s" repeatCount="indefinite"/></path><path d="M89 279q16-22 0-35t7-36"><animate attributeName="opacity" values=".6;.1;.6" dur="6s" repeatCount="indefinite"/></path></g></svg>');
 hero.prepend(wrap);let h=hero.querySelector('h1');if(h)h.textContent=tr('Destiny House','星月命理小馆');let p=hero.querySelector('p');if(p){p.className='keeperNote';p.replaceChildren();element('strong',tr('Master Yue · ','月师傅：'),p);p.append(document.createTextNode(tr('Come, sit. The tea is warm. Let us see what the stars have to say before your next meeting.','来，坐。茶还热着呢。开会之前，先听听星星怎么说。')))}
 let submit=form.querySelector('button[type=submit]');if(submit)submit.textContent=tr('Unroll my birth chart','展开我的命盘');
 let date=form.querySelector('input[type=date]');if(date){let now=new Date(),pad=x=>String(x).padStart(2,'0');date.max=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())}
 form.addEventListener('submit',()=>{let grid=out.querySelector('.ziGrid');if(!grid)return;let stage=document.createElement('div');stage.className='destinyScrollStage';let scroll=document.createElement('div');scroll.className='destinyScroll';grid.before(stage);stage.append(scroll);element('div',tr('NATAL STAR SCROLL','紫微命盘'),scroll,'destinyScrollTitle');scroll.append(grid);let c=grid.querySelector('.destinyCenter');if(c){c.innerHTML='<svg viewBox="0 0 80 55" width="64" aria-hidden="true"><circle cx="40" cy="27" r="21" fill="none" stroke="#ae8855" stroke-width=".8"/><path d="M10 32L23 17 40 25 57 12 70 34" fill="none" stroke="#a97848"/><g fill="#a97848"><circle cx="10" cy="32" r="2"/><circle cx="23" cy="17" r="2"/><circle cx="40" cy="25" r="3"/><circle cx="57" cy="12" r="2"/><circle cx="70" cy="34" r="2"/></g></svg>';c.append(document.createTextNode(tr('Twelve Palaces','十二宫')))}
 });
};

const yueStyle=document.createElement('style');yueStyle.textContent=`
#content .roomArtWrap .yueActor{position:absolute;bottom:0;right:5%;width:37%;height:85%;z-index:2;overflow:visible;filter:drop-shadow(2px 4px 3px #392a2650);pointer-events:none}
.yueActor .yueBody{transform-origin:100px 210px;animation:yueBreath 4s ease-in-out infinite}
.yueActor .yueEyes{transform-origin:100px 68px;animation:yueBlink 6s infinite}
.yueActor .yueArm{transform-origin:133px 117px;transition:transform .45s ease}
.yueActor.pointing .yueArm{transform:rotate(27deg)}
@keyframes yueBreath{50%{transform:translateY(-2px) rotate(-.5deg)}}
@keyframes yueBlink{0%,46%,49%,100%{transform:scaleY(1)}47%,48%{transform:scaleY(.1)}}
.yueTopic{display:flex;align-items:center;gap:12px;margin:12px 0;color:#674b32;font:15px/1.5 Georgia,serif}
.yueTopic svg{flex:0 0 48px;width:48px;height:48px}
.yueTopic p{margin:0}
#content .ziGrid .starSeal{width:15px;height:15px;display:block;margin:0 auto 3px;opacity:.8}
#content .destinyReflection .yueReply{font-style:italic;border-top:1px solid #cbb38e;padding-top:10px}
@media(prefers-reduced-motion:reduce){.yueActor .yueBody,.yueActor .yueEyes{animation:none}.yueActor .yueArm{transition:none}}
`;document.head.append(yueStyle);
const yuePortrait='<svg viewBox="0 0 200 240" class="yueActor" aria-hidden="true"><defs><linearGradient id="yueRobe" x2=".8" y2="1"><stop stop-color="#79877e"/><stop offset="1" stop-color="#3b5855"/></linearGradient><linearGradient id="yueSkin" x2=".5" y2="1"><stop stop-color="#f1d6ad"/><stop offset="1" stop-color="#d5a27c"/></linearGradient></defs><g class="yueBody" stroke="#594b41" stroke-width="1.6" stroke-linejoin="round"><path d="M59 106Q37 123 32 177L23 223Q102 246 177 221L163 152Q156 120 139 106" fill="url(#yueRobe)"/><path d="M71 111L101 147L128 110L142 129L101 172L61 130Z" fill="#d9c49a"/><path d="M98 148L86 225M49 174L42 214M148 169L160 214" fill="none" opacity=".55"/><path d="M77 99L77 119Q100 135 123 119L123 99" fill="url(#yueSkin)"/><path d="M62 47Q57 14 99 10Q140 9 144 48L137 92L64 90Z" fill="#514b49"/><path d="M87 15Q79 -2 101 1Q123 5 115 17" fill="#68605b"/><path d="M69 45Q66 65 70 84Q76 110 100 114Q126 111 134 84L135 44Q105 52 83 33Q80 45 69 45Z" fill="url(#yueSkin)"/><path d="M65 62Q54 54 58 74Q60 84 72 84M134 62Q145 53 142 73Q141 83 130 84" fill="#e4b58c"/><path d="M65 53Q76 36 83 33Q111 52 137 43L135 24Q92 4 69 27Z" fill="#514b49"/><path d="M70 44Q83 15 111 20M122 22Q139 30 139 43" stroke="#a69c91" fill="none" stroke-width="2"/><g class="yueEyes" fill="#473b34" stroke="none"><ellipse cx="85" cy="67" rx="2.6" ry="4"/><ellipse cx="116" cy="67" rx="2.6" ry="4"/></g><path d="M77 59Q85 55 92 59M108 59Q116 55 123 59M100 68L97 78L102 79M92 91Q100 96 109 90" fill="none" stroke-linecap="round"/><path d="M76 85Q84 88 90 86M111 86Q119 89 126 85" fill="none" stroke="#c48d72" opacity=".7"/><path d="M66 117Q38 137 45 169L81 185L89 166L65 151Z" fill="#73877b"/><path d="M79 175Q94 162 105 173L104 182Q94 190 82 186" fill="#eac29a"/><g class="yueArm"><path d="M137 116Q163 128 170 154L142 181L130 166L148 148L124 131Z" fill="#7d8c7c"/><path d="M133 166Q120 168 116 180Q118 188 127 185L142 177Z" fill="#eac29a"/><path d="M121 180L93 188" stroke="#795038" stroke-width="3" stroke-linecap="round"/></g><path d="M49 207Q100 216 152 207L154 222Q100 231 46 222Z" fill="#b38d5d"/><path d="M93 210Q100 202 107 210L108 224L92 224Z" fill="#e0c591"/></g></svg>';
const beforeYue=destinyPage;
destinyPage=function(){beforeYue();let q=$('content'),wrap=q.querySelector('.roomArtWrap'),form=q.querySelector('.astroForm'),out=q.querySelector('.astroResult');if(!wrap||!form||!out)return;wrap.insertAdjacentHTML('beforeend',yuePortrait);let actor=wrap.querySelector('.yueActor');
const replies=[
['The stars can suggest a question. You still get to write the answer.','星星可以提问，答案还是由你来写。'],
['A good companion is worth more than a perfectly arranged chart.','有人懂你，比命盘排得漂亮还重要。'],
['Even the moon has phases. Relationships need room to change.','月亮都有阴晴圆缺，感情也需要一点空间。'],
['Not everything you nurture needs to become a side hustle.','用心栽培的东西，不一定都要变成副业。'],
['A budget is more dependable than a lucky number. Tea is on the house.','预算比幸运数字靠谱。今天这杯茶我请。'],
['Rest is a habit, not a reward for exhaustion.','休息不是累到极限后的奖励，而是日常。'],
['A short walk counts as an adventure. No leave form required.','出门散个步也算旅行，不必填请假单。'],
['Keep the friends who let you finish your tea in peace.','珍惜那些让你安心喝完一杯茶的朋友。'],
['Your job title is not your entire destiny.','你的职位不是你全部的命运。'],
['Home is somewhere your shoulders can finally relax.','家是一个能让肩膀终于放松的地方。'],
['Doing nothing can be a perfectly respectable plan.','什么都不做，也可以是很正经的计划。'],
['Some traditions are worth keeping; others you may gently question.','有些传统值得传承，有些也可以温柔地重新思考。']];
const palaceNames=['Life','Siblings','Partner','Children','Wealth','Health','Travel','Friends','Career','Property','Fortune','Parents'],palaceZh=['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];
form.addEventListener('submit',()=>{let grid=out.querySelector('.ziGrid'),panel=out.querySelector('.destinyReflection');if(!grid||!panel)return;let guide=element('p',tr('Master Yue · Choose a palace to begin our conversation.','月师傅：选一宫，我们慢慢聊。'),panel);guide.className='yueReply';
[...grid.querySelectorAll('article:not(.blank)')].forEach(a=>{let label=a.querySelector('strong')?.textContent||'',k=palaceNames.findIndex((x,i)=>label.startsWith(tr(x,palaceZh[i])));if(k<0)return;let stamp=document.createElement('span');stamp.innerHTML='<svg viewBox="0 0 24 24" class="starSeal" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="#a5794b"/><path d="M12 3Q13 10 21 12Q13 13 12 21Q11 13 3 12Q11 10 12 3" fill="#b48250"/><circle cx="12" cy="12" r="2" fill="#f3dfae"/></svg>';a.prepend(stamp);let reactYue=()=>{actor?.classList.add('pointing');setTimeout(()=>actor?.classList.remove('pointing'),1100);let old=panel.querySelector('.yueReply');if(old)old.remove();element('p',tr('Master Yue: ','月师傅：')+tr(...replies[k]),panel,'yueReply');};a.addEventListener('click',reactYue);a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')reactYue()});});
let first=grid.querySelector('.lifePalace');if(first)first.click();
});};

const tarotOriginalCard=card;
card=function(x,y,w,h,front,name=''){
 if((activity!=='tarot'&&activity!=='love')||w<22)return tarotOriginalCard(x,y,w,h,front,name);
 ctx.save();ctx.translate(x,y);ctx.shadowColor='#271e1d55';ctx.shadowBlur=8;ctx.shadowOffsetY=4;
 round(0,0,w,h,5,front?'#f6e4bf':'#596b65','#a88959');ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 if(front){round(w*.045,h*.035,w*.91,h*.93,3,null,'#b89b6b');txt(name,w/2,h*.81,Math.min(14,w/6.5),'#634d37');}
 else{ctx.save();ctx.scale(w/100,h/155);round(5,5,90,145,3,null,'#e1c68d');round(9,9,82,137,3,null,'#a69e79');ctx.strokeStyle='#d4b97f';ctx.lineWidth=1;for(let j=0;j<4;j++){ctx.save();ctx.translate(j%2?88:12,j<2?12:143);ctx.rotate(j*Math.PI/2);ctx.beginPath();ctx.moveTo(0,14);ctx.quadraticCurveTo(1,1,14,0);ctx.moveTo(0,9);ctx.quadraticCurveTo(9,9,9,0);ctx.stroke();ctx.restore()}
 ellipse(50,77,28,35,'#405b57');ctx.strokeStyle='#d5bb83';ctx.beginPath();ctx.ellipse(50,77,28,35,0,0,TAU);ctx.stroke();ellipse(50,73,17,17,'#e5c98e');ellipse(58,67,15,15,'#405b57');for(let i=0;i<9;i++){let a=i*TAU/9,xx=50+Math.cos(a)*34,yy=77+Math.sin(a)*43;line(xx-2,yy,xx+2,yy,'#e6cb96',.8);line(xx,yy-2,xx,yy+2,'#e6cb96',.8)}ctx.restore()}
 ctx.restore();
};
const tarotOriginalTable=table;
table=function(){if(activity!=='tarot'&&activity!=='love')return tarotOriginalTable();ctx.save();let g=ctx.createLinearGradient(0,335,0,730);g.addColorStop(0,'#b3916c');g.addColorStop(.5,'#92694e');g.addColorStop(1,'#78533e');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(100,335);ctx.lineTo(700,335);ctx.lineTo(930,740);ctx.lineTo(-130,740);ctx.closePath();ctx.fill();ctx.clip();for(let i=0;i<34;i++){let yy=342+i*12;ctx.strokeStyle=i%3===0?'#5f402c40':'#e4bd8825';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-130,yy);ctx.bezierCurveTo(120,yy+Math.sin(i)*4,660,yy-4,950,yy+2);ctx.stroke()}ctx.beginPath();ctx.moveTo(185,345);ctx.lineTo(615,345);ctx.lineTo(765,706);ctx.lineTo(35,706);ctx.closePath();ctx.fillStyle='#4c6761';ctx.fill();ctx.strokeStyle='#b59a6e';ctx.lineWidth=2;ctx.stroke();for(let i=0;i<20;i++){let yy=355+i*17;line(183-i*6.5,yy,190-i*6.5,yy+4,'#d1bc8a70',1);line(617+i*6.5,yy,610+i*6.5,yy+4,'#d1bc8a70',1)}ctx.restore();
 // Warm little tea cup stays on the table while the cards move.
 ctx.save();ellipse(196,406,27,12,'#463c3060');ellipse(195,402,24,9,'#e1c79f');round(180,377,30,24,5,'#cbb68e','#816a4c');ellipse(195,378,15,6,'#9a6e49');for(let i=0;i<2;i++){ctx.strokeStyle='#fff3d98c';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(190+i*9,374);ctx.quadraticCurveTo(182+i*9+Math.sin(t*1.8+i)*6,362,194+i*9,348);ctx.stroke()}ctx.restore();
};
const tarotBeforeStart=start;
start=function(a){tarotBeforeStart(a);if(a==='tarot'||a==='love'){state.shuffleUntil=0;state.ritual='waiting';state.shuffleCount=0;hint('Tap the deck to shuffle. Then choose your card.','点击牌堆洗牌，然后选牌。')}};
const tarotBeforeDraw=drawActivity;
drawActivity=function(){
 if((activity!=='tarot'&&activity!=='love')||!state.ritual)return tarotBeforeDraw();
 if(state.ritual==='ready')return tarotBeforeDraw();
 table();let shuffling=state.ritual==='shuffling',f=shuffling?Math.max(0,Math.min(1,(t-state.ritualStart)/1.15)):0;
 if(shuffling&&f>=1){state.ritual=state.shuffleCount>=2?'ready':'waiting';hint(state.ritual==='ready'?'Turn over your card when you are ready.':'One more shuffle, or deal the cards. ',state.ritual==='ready'?'准备好了就翻牌吧。':'再洗一次，或者直接发牌。');return}
 for(let i=0;i<10;i++){let spread=shuffling?Math.sin(f*Math.PI):0,dir=i<5?-1:1;ctx.save();ctx.translate(400+dir*80*spread+(i-4.5)*3,463+Math.sin(f*TAU+i)*spread*9-i*1.4);ctx.rotate((i-4.5)*.012+dir*spread*.16);card(-50,-74,100,148,false);ctx.restore()}
 let shuffle=()=>{if(state.ritual!=='waiting')return;state.shuffleCount++;state.ritual='shuffling';state.ritualStart=t;sound(360);hint('The deck is being shuffled…','洗牌中……')};
 target(325,365,150,186,shuffle);txt(shuffling?tr('Shuffling…','洗牌中……'):tr('Tap the deck to shuffle','点击牌堆洗牌'),400,564,19,'#fff3d8');
 if(!shuffling&&state.shuffleCount>0){label(tr('Deal the cards','发牌'),400,607,()=>{state.ritual='ready';hint('Turn over your card when ready.','准备好了就翻牌吧。');sound(530)})}
 txt(tr('Take your time. No one is timing you.','慢慢来，又没人给你计时。'),400,642,13,'#f1dbb9');
};
const tarotBeforeDetails=tarotDetails;
tarotDetails=function(d,rev){tarotBeforeDetails(d,rev);let lineEl=$('line');if(lineEl){let phrases=[['The card is not your manager. You can disagree.','牌卡又不是老板，你当然可以不同意。'],['A little reflection, then back to your tea.','想一想，再喝口茶。'],['The future is not a deadline.','未来又不是截止日期。']];lineEl.textContent+='\n\n'+tr(...phrases[hash(d[0]+day())%phrases.length])}};

function templeMoon(x,y,angle,flat){ctx.save();ctx.translate(x,y);ctx.rotate(angle);let g=ctx.createLinearGradient(-35,-24,30,28);g.addColorStop(0,flat?'#f1c191':'#d17e55');g.addColorStop(.45,flat?'#d5a16e':'#a74635');g.addColorStop(1,flat?'#b57750':'#743d32');ctx.beginPath();ctx.moveTo(-33,-11);ctx.bezierCurveTo(-37,28,18,42,34,-10);ctx.bezierCurveTo(16,6,-11,8,-33,-11);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#784b35';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(-30,-11);ctx.bezierCurveTo(-8,8,18,5,32,-10);ctx.strokeStyle=flat?'#f3d4a0':'#e5a27b';ctx.stroke();if(flat){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-20+i*5,10+i*3);ctx.quadraticCurveTo(0,24+i*2,21-i*3,10+i*3);ctx.strokeStyle='#a8784b55';ctx.lineWidth=.8;ctx.stroke()}}ctx.restore()}
const shrineBeforeDraw=drawActivity;
drawActivity=function(){
 if(activity!=='moon'&&activity!=='sticks')return shrineBeforeDraw();
 if(W<H&&room==='temple')paintPortraitInterior('temple');
 table();ctx.save();let g=ctx.createRadialGradient(400,470,20,400,470,210);g.addColorStop(0,'#d4a56d');g.addColorStop(1,'#986747');ellipse(400,482,179,122,'#62412b70');ellipse(400,475,175,119,g);ctx.strokeStyle='#e4c18b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(400,475,163,109,0,0,TAU);ctx.stroke();ctx.restore();
 if(activity==='moon'){
 let airborne=state.tossUntil>t,f=airborne?Math.max(0,Math.min(1,1-(state.tossUntil-t)/(state.moonDuration||.55))):1,lift=airborne?Math.sin(f*Math.PI)*(state.moonHeight||95):0;
 for(let i=0;i<2;i++){let x=350+i*100+(i?1:-1)*Math.sin(f*Math.PI)*21;let bounce=airborne&&f>.76?Math.abs(Math.sin((f-.76)/.24*Math.PI*2))*11*(1-f):0;ellipse(x,499,Math.max(8,30-lift*.12),7,'#52352455');let flat=state.count===0||state.result===2||(state.result===0&&i===0);templeMoon(x,480-lift-bounce,airborne?(i?1:-1)*f*TAU*(i?1.7:1.2):((i?1:-1)*.25),airborne?Math.cos(f*TAU)>0:flat)}
 let name=state.count?tr(...[['Holy blocks · Yes','圣杯 · 一阴一阳'],['No · both rounded','阴杯 · 两个凸面'],['Laughing blocks · ask again','笑杯 · 两个平面']][state.result]):tr('Ask a question quietly','在心里默念一个问题');
 txt(airborne?tr('Listening…','静候回应……'):name,400,603,18,'#fff2d8');txt(tr('Tosses: ','次数：')+state.count,400,633,13,'#fff2d8');target(270,390,260,160,()=>{},'moon');
 }else{
 let held=drag?.id==='sticks',shaking=(state.shakeUntil||0)>t;
 const movement=held?clamp((drag.x-drag.sx)*.45,-35,35):shaking?Math.sin(t*24)*17:0;
 const xx=400+movement,lift=held?14:shaking?8:0,tilt=held?clamp(movement*.008,-.20,.20):shaking?Math.sin(t*22)*.12:0;
 const activeGrip=held||shaking,picking=Boolean(state.stickPicked),pickProgress=picking?poseEase((t-state.stickPickAt)/.8):0;
 const actorX=picking?332+108*poseEase((t-state.stickPickAt)/.34):activeGrip?xx-68:332,actorY=552;
 const grip=picking?{x:502,y:524-37*pickProgress}:activeGrip?{x:xx-39,y:490-lift}:null;
 let stickHand=null;
 if(picking&&t-state.stickPickAt<.34)backHuman(actorX,actorY,avatar??0,true,'right',1.55);
 else stickHand=drawRitualPose(actorX,actorY,1.55,{reach:grip,kneel:picking?.28*(1-pickProgress):.08,bow:picking?.4*(1-pickProgress):activeGrip?.12:0});
 ctx.save();ctx.translate(xx,476-lift);ctx.rotate(tilt);ellipse(0,67,53,12,'#56352166');ellipse(0,-24,48,13,'#6d4a32');for(let i=0;i<(state.fallenStick?11:12);i++){ctx.save();ctx.translate(-36+i*6.5,-27);ctx.rotate((i-5)*.035+(shaking?Math.sin(t*20+i)*.12:0));let yy=-75-(i%4)*6+(shaking?Math.sin(t*27+i)*7:0);round(-3,yy,6,106,2,'#e3bd80','#a67a47');line(-2,yy+4,2,yy+4,'#a54e3d',2);ctx.restore()}
 let wood=ctx.createLinearGradient(-45,0,45,0);wood.addColorStop(0,'#925d37');wood.addColorStop(.5,'#c99356');wood.addColorStop(1,'#805137');ctx.beginPath();ctx.moveTo(-47,-24);ctx.lineTo(-39,60);ctx.lineTo(-19,72);ctx.lineTo(20,72);ctx.lineTo(39,60);ctx.lineTo(47,-24);ctx.lineTo(23,-14);ctx.lineTo(-23,-14);ctx.closePath();ctx.fillStyle=wood;ctx.fill();ctx.strokeStyle='#69452f';ctx.stroke();for(let [x1,x2,shade] of [[-47,-23,'#69452f35'],[23,47,'#51372455']]){ctx.beginPath();ctx.moveTo(x1,-24);ctx.lineTo(x2,-14);ctx.lineTo(x2*.84,71);ctx.lineTo(x1*.84,60);ctx.closePath();ctx.fillStyle=shade;ctx.fill()}line(-23,-14,-19,72,'#e9bf7955',1.5);line(23,-14,20,72,'#583b2a80',1.5);line(-39,54,-19,65,'#e1b279',2);line(-19,65,20,65,'#e1b279',2);line(20,65,39,54,'#e1b279',2);txt('籤',0,19,31,'#f9e0ad');ctx.restore();
 if(state.drawing||state.fallenStick){
 const age=Math.max(0,t-(state.stickDrawAt??t)),f=state.fallenStick?1:clamp((age-.38)/.83,0,1);
 if(age>=.38||state.fallenStick){
  const pickupLift=picking&&stickHand?poseEase((t-state.stickPickAt-.34)/.46):0;const sx=((state.stickLaunchX??400)*(1-f)+510*f)*(1-pickupLift)+(stickHand?.x??510)*pickupLift,sy=(382-92*Math.sin(Math.PI*f)+f*142)*(1-pickupLift)+(stickHand?.y??524)*pickupLift;
  ellipse(sx,527,18+20*f,4,'#56352155');
  ctx.save();ctx.translate(sx,sy);ctx.rotate(f*1.37+Math.sin(f*Math.PI)*.24);
  let grain=ctx.createLinearGradient(-6,0,6,0);grain.addColorStop(0,'#b68b51');grain.addColorStop(.45,'#f3d69e');grain.addColorStop(1,'#d1a56d');
  round(-6,-52,12,104,2,grain,'#a57743');line(-4,-45,4,-45,'#ad4f3d',2);line(-2,-32,-2,45,'#b38d5d55',.8);
  if(f>.88){ctx.fillStyle='#8d4938';ctx.font='bold 10px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(state.fallenStick||state.stickNumber||''),0,-30)}
  ctx.restore();
 }
}
 txt(state.drawing?tr('A stick is falling…','签文落下来了……'):state.stickPicked?tr('Collecting your fortune…','正在拾签……'):state.fallenStick?tr('Pick up the numbered stick','拾起落下的签'):tr('Shake or tap the bamboo cup','左右摇动或点击签筒'),400,603,17,'#fff2d8');if(!state.fallenStick&&!state.drawing){target(315,345,160,220,shakeFortuneStick,'sticks');label(tr('Shake the cup','摇签筒'),400,645,shakeFortuneStick)}if(state.fallenStick&&!state.drawing&&!state.stickPicked){target(450,498,125,52,pickupFortuneStick);label(tr('Pick up stick','拾签'),510,575,pickupFortuneStick)}
 }
};
const templeStart=start;start=function(a){templeStart(a);if(a==='moon')hint('Think of a yes-or-no question. Swipe the blocks upwards and release.','默念一个是非问题，向上滑动筊杯再松手。');if(a==='sticks')hint('Drag the cup from side to side to draw a fortune stick.','左右拖动签筒，摇出一支签。')};
const shrineReact=react;react=function(en,cn){if(activity==='moon'&&state.count>0&&!(state.tossUntil>t)){let r=state.result,streak=state.noStreak||0;let lines=r===0?[['A yes! Even heaven approves of your tea break.','圣杯！连神明都批准你去喝茶。'],['A little encouragement, not a guarantee.','给你一点鼓励，不是保证哦。']]:r===2?[['Heaven is smiling. Perhaps rephrase that question.','神明笑了，要不换个问法？'],['Even the gods need context.','神明也需要一点前情提要。']]:streak>=3?[['Three refusals or more. The temple keeper quietly offers you a seat.','都被拒三次以上了，庙祝默默搬来一张椅子。'],['Perhaps stop interrogating heaven. Have a biscuit.','别审问天庭了，来块饼干吧。']]:streak===2?[['Two noes. No need to send a follow-up email.','连续两个阴杯，不必再发跟进邮件了。']]:[['Not this time. Your luck is not your worth.','这次不行，运气可不代表你的价值。']];let l=lines[(state.count-1)%lines.length];return shrineReact(...l)}return shrineReact(en,cn)};

let gardenWishes=load('gardenWishesV1',[]);if(!Array.isArray(gardenWishes))gardenWishes=[];
const gardenColors=['#dca15d','#c87962','#e4c17c','#a3ab8b','#b69aa7'];
function gardenLantern(x,y,i,sc=1){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(Math.sin(t*1.35+i)*.045);glow(0,0,48,i);line(0,-47,0,-27,'#94704c',1.5);let g=ctx.createRadialGradient(-7,-8,1,0,0,35);g.addColorStop(0,'#fff0bd');g.addColorStop(.5,gardenColors[i%5]);g.addColorStop(1,'#916144');ctx.beginPath();ctx.moveTo(-18,-28);ctx.bezierCurveTo(-37,-12,-29,22,-15,29);ctx.lineTo(15,29);ctx.bezierCurveTo(29,22,37,-12,18,-28);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#92613e';ctx.stroke();for(let j of [-13,0,13]){ctx.beginPath();ctx.moveTo(j*.8,-26);ctx.quadraticCurveTo(j*1.6,0,j*.8,27);ctx.strokeStyle='#a6764c88';ctx.stroke()}round(-16,-32,32,6,2,'#78553e');round(-15,28,30,6,2,'#78553e');line(0,34,0,46,'#ab7352',2);ctx.restore()}
function gardenPosition(i){return {x:205+(i%6)*78,y:337+Math.floor(i/6)*68+Math.sin(i*1.8)*15}}
function gardenWishBook(){
 page(tr('Letters to the evening sky','寄给夜空的信'),tr('Your wishes are stored only on this device.','心愿仅保存在这台设备上。'),q=>{if(!gardenWishes.length)element('p',tr('Your garden is waiting for its first lantern.','花园还在等第一盏灯。'),q);gardenWishes.slice().reverse().forEach(w=>{let a=element('article','',q);a.style.cssText='padding:14px;margin:10px 0;background:#f3e4c6;color:#654b36;border-left:3px solid #b78254';element('small',w.date,a);let p=element('p',w.text,a);p.style.whiteSpace='pre-wrap';b(a,tr('Remove this wish','取下这盏灯'),()=>{gardenWishes=gardenWishes.filter(v=>v.id!==w.id);save('gardenWishesV1',gardenWishes);gardenWishBook()})});b(q,tr('Return to the garden','回到花园'),()=>{$('page').style.display='none'})})
}
function gardenWrite(){page(tr('A little wish','写一份小小心愿'),tr('Write something for yourself. No one else can read it here.','写给自己的一句话，这里不会公开给别人。'),q=>{let ta=element('textarea','',q);ta.maxLength=300;ta.placeholder=tr('Dear universe…','亲爱的宇宙……');ta.style.cssText='width:100%;min-height:125px;background:#f4e7cb;color:#654b36;padding:14px;font:16px Georgia,serif;border:1px solid #b6976c;box-sizing:border-box';b(q,tr('Fold the wish into a lantern','把心愿折进灯里'),()=>{let v=ta.value.trim();if(!v){ta.focus();return}state.pendingGardenWish=v;state.gardenStage='carry';$('page').style.display='none';hint('Tap a lantern hook to hang your wish.','点击挂钩，把心愿灯挂起来。')})})}
const gardenBeforeStart=start;start=function(a){gardenBeforeStart(a);if(a==='wishes'){state.gardenStage='write';hint('Tap the blank wish paper, then choose where to hang your lantern.','点击空白心愿纸，再选个地方挂灯。')}};
const gardenBeforeDraw=drawActivity;drawActivity=function(){if(activity!=='wishes')return gardenBeforeDraw();
 ctx.save();for(let i=0;i<22;i++){let x=175+(i*71)%455,y=285+(i*37)%330;ctx.globalAlpha=.25+.2*Math.sin(t*.8+i);ellipse(x+Math.sin(t*.65+i)*6,y,1.6,1.6,'#ffe6a6')}ctx.restore();

 let recent=gardenWishes.slice(state.gardenStage==='carry'?-11:-12);let assigned=new Set(),display=recent.map(w=>{let slot=Number.isInteger(w.slot)&&w.slot>=0&&w.slot<12&&!assigned.has(w.slot)?w.slot:Array.from({length:12},(_,i)=>i).find(i=>!assigned.has(i));assigned.add(slot);return {w,slot}});
 for(let row=0;row<2;row++){let y=290+row*68;ctx.beginPath();ctx.moveTo(170,y);ctx.quadraticCurveTo(400,y+27,630,y);ctx.strokeStyle='#71543c';ctx.lineWidth=2;ctx.stroke()}
 display.forEach(({w,slot},i)=>{let pos=gardenPosition(slot),isNew=state.gardenStage==='rise'&&i===display.length-1;if(isNew)return;gardenLantern(pos.x,pos.y,slot,.82);if(state.gardenStage!=='carry')target(pos.x-28,pos.y-30,56,65,()=>gardenWishBook())});
 if(state.gardenStage==='carry'){gardenLantern(400,525,0,1);for(let n=0;n<12;n++){if(assigned.has(n))continue;let pos=gardenPosition(n);ctx.save();ctx.strokeStyle='#ffe9b7';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pos.x,pos.y-37,7+Math.sin(t*3+n)*2,0,TAU);ctx.stroke();ctx.restore();target(pos.x-23,pos.y-55,46,50,()=>{if(!state.pendingGardenWish)return;gardenWishes.push({id:Date.now()+'-'+Math.random().toString(36).slice(2),text:state.pendingGardenWish,date:new Date().toLocaleDateString(),slot:n});save('gardenWishesV1',gardenWishes);state.pendingGardenWish='';state.gardenStage='rise';state.gardenRise=t;state.gardenSlot=n;addItem('Wishing lantern','许愿灯');sound(660);hint('Your wish has found its place.','心愿找到自己的位置了。')})}txt(tr('Choose any glowing hook','选一个喜欢的发光挂钩'),400,597,18,'#fff0d5');
 }else if(state.gardenStage==='rise'){let f=Math.min(1,(t-state.gardenRise)/1.6),e=f*f*(3-2*f),i=state.gardenSlot??display[display.length-1]?.slot??0,pos=gardenPosition(i);gardenLantern(400+(pos.x-400)*e,525+(pos.y-525)*e,i,1-.18*e);ctx.save();ctx.globalAlpha=Math.sin(f*Math.PI)*.8;for(let k=0;k<9;k++)ellipse(400+(pos.x-400)*e+Math.cos(k*2.4+t)*27,525+(pos.y-525)*e+Math.sin(k*2.4+t)*38,2,2,'#ffe9aa');ctx.restore();if(f>=1){state.gardenStage='write';react('A little light for whatever matters to you.','为你在乎的事，留一盏小小的灯。')}}

 else{ctx.save();ctx.translate(400,498);ctx.rotate(-.06);round(-52,-62,104,124,3,'#f6e6c2','#b99a67');for(let i=0;i<5;i++)line(-35,-30+i*14,34,-30+i*14,'#cfb98f',.8);txt('願',0,-39,22,'#9d5e44');ctx.restore();target(340,430,120,142,gardenWrite);txt(tr('Write a wish','写下心愿'),400,584,19,'#fff0d5')}
 label(tr('My lanterns','我的心愿灯')+' · '+gardenWishes.length,400,635,gardenWishBook);
};

let encounterMemory=load('encounterMemoryV1',{});if(!encounterMemory||typeof encounterMemory!=='object')encounterMemory={};
const encounterTalk=npcTalk;npcTalk=function(n){if(!n||!n.n)return encounterTalk(n);if(scene!=='fortune'||n.cameo===undefined)return encounterTalk(n);stopRoute();p.tx=p.x;p.ty=p.y;let id=n.n[0],count=(encounterMemory[id]||0)+1;encounterMemory[id]=count;save('encounterMemoryV1',encounterMemory);let greetings=cameoLinesLiving[n.cameo]||['Lovely weather for a break.','今天适合摸鱼。'];let follow=[['You look like someone who deserves a day off.','一看你就是该放假的人。'],['We meet again. This valley has better networking than LinkedIn.','又见面了。这解忧谷的人脉比职场还广。'],['At this point we should start a tea club.','都这么熟了，不如成立喝茶协会。']];say(tr(...n.n),tr(...greetings)+' '+tr(...follow[Math.min(2,count-1)]),[[tr('Ask for a local tip','问问附近有什么好玩的'),()=>say(tr(...n.n),tr(...[['Try the wishing pool. The koi are terrible at keeping secrets, so make your wish silently.','去锦鲤池试试吧。锦鲤不擅长保守秘密，心愿默念就好。'],['Visit the reading house. The cards have fewer meetings than we do.','去占卜小屋坐坐吧，牌卡的会议比我们少多了。'],['Hang a lantern in the garden. There is always room for a little hope.','去花园挂盏灯，总有地方留给一点希望。']][(n.cameo+count)%3]),[[tr('Thank you','谢谢你'),closeTalk]])],[tr('How is your day?','今天过得怎么样？'),()=>cameoHeart(n,count)],[tr('Exchange a travel stamp','交换旅行印章'),()=>{addItem('Met '+id,'偶遇'+n.n[1]);closeTalk()}],[tr('See you around','回头见'),closeTalk]]);};
const villageWalkBefore=walkDoor;walkDoor=function(id,x,y){if(!room&&!transitioning&&pending===id)return;villageWalkBefore(id,x,y)};
const albumStyle=document.createElement('style');albumStyle.textContent=`
.travelAlbum{background:linear-gradient(115deg,#d6ba87,#f7e8c9 9%,#ead6ad 49%,#b99b6e 50%,#f3e3c3 51%,#e5ce9e);padding:16px 12px;color:#614832;border:1px solid #9e8056;border-radius:3px;box-shadow:0 5px 12px #533c3333}
.travelAlbum h2{font:normal 22px Georgia,serif;margin:12px 0}
.albumGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.albumCard{position:relative;overflow:hidden;min-height:110px;background:#f5e7cb;color:#614832;border:1px solid #ac8c62;padding:9px;text-align:center;display:grid;justify-items:center;align-content:center;gap:6px}
.albumCard img{width:100%;height:75px;object-fit:cover}
.albumCard svg{width:60px;height:60px}
.albumCard.locked{opacity:.56;filter:saturate(.25)}
.albumCard strong{font:600 13px/1.3 Georgia,serif;overflow-wrap:anywhere}
.albumCard small{font:11px system-ui;color:#8e6d50}
.albumCard button{min-height:44px}
.albumProfile{display:flex;gap:12px;align-items:center;margin:0 0 14px}
.albumProfile img{width:72px;height:72px;object-fit:contain}
.albumTabs{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.albumTabs button{min-height:44px;flex:1}
.albumStamp{border:2px solid #ad674d;color:#ad674d;padding:4px 9px;transform:rotate(-5deg);font:11px Georgia,serif;letter-spacing:.07em}
@media(min-width:680px){.albumGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;document.head.append(albumStyle);
/* Migrate the old reading collectible without duplicating existing rewards. */
function migrateReadingKeepsake(list){
 if(!Array.isArray(list)||!list.some(v=>Array.isArray(v)&&v[0]==='Love reading'))return list;
 let seen=false;return list.flatMap(v=>{
  if(!Array.isArray(v)||!['Love reading','Three-card reading'].includes(v[0]))return [v];
  if(seen)return [];seen=true;return [['Three-card reading','三张牌占卜']]
 })
}
const migratedReadingItems=migrateReadingKeepsake(items);
if(migratedReadingItems!==items){items=migratedReadingItems;save('items',items)}
const keepsakes=[['Observatory destiny scroll','星月命理卷轴','scroll'],['Three-card reading','三张牌占卜','card'],['Heaven’s approval','圣杯祝福','moon'],['Wishing lantern','许愿灯','lantern'],['Cat friendship','猫咪友谊','cat'],['Soul Cat keepsake','猫灵纪念章','cat']];
function albumIcon(kind){let art={scroll:'<path d="M15 12h33v42H15z" fill="#f1d9a6" stroke="#8f704a"/><path d="M10 10h43M10 56h43" stroke="#946847" stroke-width="5"/><path d="M22 22h20m-20 8h20m-20 8h14" stroke="#a58c60"/>',card:'<rect x="17" y="7" width="31" height="49" rx="3" fill="#607b70" stroke="#b79967"/><circle cx="32" cy="30" r="10" fill="#e8c785"/><circle cx="37" cy="26" r="8" fill="#607b70"/>',moon:'<path d="M9 25Q10 51 31 27Q18 33 9 25M34 21Q37 48 57 24Q45 30 34 21" fill="#b65f43" stroke="#80503a"/>',lantern:'<path d="M32 4v9m0 39v8" stroke="#84603e"/><path d="M20 15Q6 32 20 49h24q14-17 0-34z" fill="#e4ae65" stroke="#95633f"/><path d="M25 15q-8 17 0 34m14-34q8 17 0 34" fill="none" stroke="#b77947"/><path d="M20 13h24m-24 38h24" stroke="#79573f" stroke-width="4"/>',cat:'<path d="M13 27L15 8 28 19H38L50 8 52 30Q54 49 32 51Q9 49 13 27Z" fill="#d7ad77" stroke="#866345"/><path d="M23 33h2m14 0h2m-12 7q3 3 6 0" stroke="#674c3c" stroke-width="2" fill="none"/>',stamp:'<circle cx="32" cy="32" r="24" fill="#d8b78a" stroke="#a77a4e"/><path d="M13 42l12-17 9 8 11-16 10 25z" fill="#718879"/><circle cx="20" cy="19" r="4" fill="#f4db9e"/>'};return '<svg viewBox="0 0 64 64" aria-hidden="true">'+(art[kind]||art.stamp)+'</svg>'}
function albumProfile(q){let a=element('div','',q,'albumProfile');let im=element('img','',a);im.src=ART['badge'+(avatar??0)];let info=element('div','',a);element('strong',playerName||tr('Traveller','旅人'),info);element('p',tr('Level ','等级 ')+(1+Math.floor(items.length/5))+' · '+items.length+' '+tr('discoveries','份回忆'),info)}
function collectionKind(item){let n=item[0];return /Tarot|reading/.test(n)?'card':/lantern/i.test(n)?'lantern':/scroll|Fortune stick|Fortune paper/.test(n)?'scroll':/cat/i.test(n)?'cat':/approval/.test(n)?'moon':'stamp'}
function keepsakeDetails(item){page(tr('A little memory','一份小回忆'),tr('Every discovery has a story.','每份收藏都有一段故事。'),q=>{let a=element('div','',q,'albumCard');let im=element('div','',a);im.innerHTML=albumIcon(collectionKind(item));element('strong',tr(...item),a);element('span',tr('Collected','已收藏'),a,'albumStamp');let story=keepsakeStory(item);element('p',tr(...story),q,'memoryStory');b(q,tr('Back to my bag','返回背包'),myRoom)})}
let albumTab='all';
myRoom=function(){activePage='room';page(tr('Traveller’s bag','旅人的背包'),tr('Little things from your travels.','把旅途的小小回忆都收起来。'),q=>{let book=element('section','',q,'travelAlbum');albumProfile(book);let tabs=element('div','',book,'albumTabs');for(let [id,en,cn] of [['all','All','全部'],['collected','Collected','已收藏'],['locked','To discover','待发现']]){let btn=b(tabs,tr(en,cn),()=>{albumTab=id;myRoom()});btn.setAttribute('aria-pressed',String(albumTab===id))}let g=element('div','',book,'albumGrid');let entries=keepsakes.map(k=>({item:k.slice(0,2),kind:k[2],owned:items.some(x=>x[0]===k[0])}));for(let item of items)if(!entries.some(x=>x.item[0]===item[0]))entries.push({item,kind:collectionKind(item),owned:true});for(let v of entries.filter(x=>albumTab==='all'||(albumTab==='collected'?x.owned:!x.owned))){let a=element('article','',g,'albumCard'+(v.owned?'':' locked'));let im=element('div','',a);im.innerHTML=albumIcon(v.kind);element('strong',v.owned?tr(...v.item):tr('Undiscovered keepsake','未发现的手信'),a);element('small',v.owned?tr('Collected','已收藏'):tr(...keepsakeClue(v.item)),a);if(v.owned)b(a,tr('Inspect','看看'),()=>keepsakeDetails(v.item))}b(book,tr('Open passport','打开护照'),passport)})};
passport=function(){activePage='passport';page(tr('Traveller passport','旅人护照'),tr('Visa free. No annual leave required.','免签，不用请年假。'),q=>{let book=element('section','',q,'travelAlbum');albumProfile(book);renderRailKeepsake(book);let g=element('div','',book,'albumGrid');for(let k of ['fortune','home','island','wonder']){let a=element('article','',g,'albumCard'+(visited.includes(k)?'':' locked'));let im=element('img','',a);im.src=destinationPortrait(k);im.alt=tr(...maps[k].n);im.loading='lazy';element('strong',tr(...maps[k].n),a);element('span',visited.includes(k)?tr('ARRIVED','已入境'):tr('UNDISCOVERED','未发现'),a,'albumStamp')}element('h2',tr('People I met','旅途偶遇'),book);let friends=Object.entries(encounterMemory).sort((a,b)=>Number(friendFavourites.includes(b[0]))-Number(friendFavourites.includes(a[0])));if(!friends.length)element('p',tr('Say hello to a fellow traveller.','跟路上的旅人打个招呼吧。'),book);for(let [name,count] of friends){let n=cameoNamesLiving.find(x=>x[0]===name)||[name,name];let entry=element('div','',book,'friendEntry');element('strong',tr(...n),entry);element('small',count+' '+tr('encounters','次相遇')+' · '+tr(...(count>=5?['Old friend','老朋友']:count>=3?['Familiar face','熟面孔']:['New acquaintance','新朋友'])),entry);const fav=b(entry,friendFavourites.includes(name)?tr('★ Favourite','★ 喜欢的旅伴'):tr('☆ Favourite','☆ 收藏旅伴'),()=>{friendFavourites=friendFavourites.includes(name)?friendFavourites.filter(x=>x!==name):[...friendFavourites,name];save('friendFavouritesV1',friendFavourites);passport()});fav.setAttribute('aria-pressed',String(friendFavourites.includes(name)))}cluePanel(book);b(book,tr('Open my bag','打开背包'),myRoom);b(book,tr('Travel map','旅行地图'),travel)})};
$('dockRoom').onclick=myRoom;$('profileHud').onclick=myRoom;$('dockPassport').onclick=passport;
const albumHUD=updateHUD;updateHUD=function(){albumHUD();$('dockRoom').lastElementChild.textContent=tr('Bag','背包');$('dockValley').lastElementChild.textContent=tr('Home','主页');$('dockTravel').lastElementChild.textContent=tr('Map','地图')};

maps.wonder.n=['Wonder Valley','奇遇谷'];
const soulCats=[
['Cloud Poet','云朵诗人','Imaginative, gentle and excellent at staring out of windows.','浪漫又细腻，擅长望着窗外发呆。','#a9a2bb'],
['Professional Napper','咸鱼猫','A master of conserving energy for genuinely important things.','把精力留给真正重要的事，比如睡觉。','#c6a276'],
['Rooftop Explorer','屋顶探险家','Curiosity takes you places your calendar never planned.','好奇心带你去计划表以外的地方。','#b98058'],
['Midnight Stargazer','午夜观星猫','A thoughtful observer with an entire universe in your head.','安静观察世界，脑袋里住着整个宇宙。','#737e9b'],
['Matcha Companion','抹茶暖暖猫','You make ordinary moments feel like home.','你能把平凡的日子过出家的温度。','#8eaa86'],
['Gossip Detective','吃瓜猫','You notice the tiny details everybody else misses.','别人错过的细节，都逃不过你的眼睛。','#cb9980'],
['Clear-eyed Cat','人间清醒猫','Independent, grounded and resistant to unnecessary meetings.','独立清醒，对无效会议有天然免疫力。','#9ba8a0'],
['Lucky Opportunist','好运招财猫','You spot little possibilities and enjoy making them happen.','善于发现小机会，也愿意付诸行动。','#d4b06b']];
const soulQs=[
[['A rainstorm interrupts your valley stroll. Where do you go?','山谷突然下雨，你会去哪儿？'],[['Write by the window','靠窗写写画画',[0,3]],['Curl up with a blanket','裹着毯子睡觉',[1,4]],['Explore a covered alley','探索有屋檐的小巷',[2,7]],['Ask the shopkeeper for stories','听店主讲故事',[5,6]]]],
[['A mysterious parcel appears at the inn. What do you do?','旅馆出现一个神秘包裹，你会？'],[['Imagine its backstory','想象它的来历',[0,2]],['Check the label carefully','仔细查看标签',[3,6]],['Find its owner','帮忙找失主',[4,5]],['Ask whether there is a reward','问问有没有奖励',[7,1]]]],
[['Your tea gets cold during a long chat.','聊天聊到茶都凉了。'],[['Order another cup for everyone','给大家再点一杯',[4,7]],['Enjoy the conversation anyway','继续开心聊天',[5,0]],['Find a quiet seat','找个安静位置',[3,1]],['Politely end the chat','礼貌结束聊天',[6,2]]]],
[['The souvenir shop has one shelf left.','手信店只剩最后一架商品。'],[['An old illustrated notebook','一本旧插画笔记本',[0,3]],['A ridiculously soft cushion','一个超软抱枕',[1,4]],['A map with hidden paths','一张藏着小路的地图',[2,5]],['A practical little travel kit','一套实用旅行用品',[6,7]]]],
[['Your friend cannot decide which train to take.','朋友纠结该搭哪班车。'],[['Look at the scenery together','一起看看风景',[0,4]],['Compare the routes','认真比较路线',[3,6]],['Take the unexpected train','选一班意想不到的车',[2,7]],['Ask the other passengers','问问其他旅客',[5,1]]]],
[['The valley lantern festival is almost over.','山谷灯会快结束了。'],[['Keep a little memory in a diary','把回忆写进日记',[0,3]],['Head home for a good sleep','回家好好睡一觉',[1,6]],['Help the keeper tidy up','帮店主收拾',[4,7]],['Find one last little adventure','再找一个小小奇遇',[2,5]]]]
];
let soulResult=load('soulCatV1',null),soulAnswers=[];
const soulStyle=document.createElement('style');soulStyle.textContent=`
.soulScene{background:#eee0c6;border:1px solid #ad9270;color:#624c38;padding:14px;box-shadow:0 4px 12px #54402c25}
.soulScene img{display:block;width:100%;height:clamp(120px,30vw,240px);object-fit:cover}
.soulScene h2{font:normal 24px Georgia,serif}
.soulScene button{width:100%;min-height:48px;margin:5px 0;text-align:left;background:#f7ead0;color:#624c38;border:1px solid #bca27a}
.soulResultCard{text-align:center;padding:22px;background:radial-gradient(ellipse at 50% 28%,#fff0d0,#e6cba0);border:double 4px #ae8756}
.soulResultCard svg{width:min(100%,170px);height:155px}
.soulResultCard h2{font:normal 28px Georgia,serif}
`;document.head.append(soulStyle);
function soulCatArt(color){return '<svg viewBox="0 0 180 160" aria-hidden="true"><circle cx="90" cy="75" r="65" fill="#f5dfb1" stroke="#b28c59"/><path d="M25 127Q50 95 90 125T155 127" fill="#a0aa8e"/><path d="M61 104Q42 132 85 138Q137 141 129 109" fill="'+color+'" stroke="#705849" stroke-width="2"/><path d="M57 61L52 26Q57 19 77 42Q91 36 103 42L127 24Q131 22 125 61Q137 99 90 105Q45 100 57 61Z" fill="'+color+'" stroke="#705849" stroke-width="2"/><path d="M62 46l-3-13 15 13m34 0 14-13-4 13" fill="#d7a59a"/><path d="M70 72q6-5 12 0m16 0q6-5 12 0" stroke="#594638" stroke-width="2" fill="none"/><path d="M86 81l8 0-4 4z" fill="#9f6b60"/><path d="M90 85q-3 7-8 3m8-3q3 7 8 3" fill="none" stroke="#594638"/><path d="M124 125q35-4 25-29" stroke="'+color+'" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="37" cy="38" r="3" fill="#c09558"/><circle cx="145" cy="51" r="3" fill="#c09558"/></svg>'}
function soulResultPage(){if(!Number.isInteger(soulResult)||!soulCats[soulResult])return soulIntro();let c=soulCats[soulResult];page(tr('Your Soul Cat','你的猫灵'),tr('A little keepsake from Wonder Valley.','来自奇遇谷的一份小纪念。'),q=>{let card=element('section','',q,'soulResultCard');let art=element('div','',card);art.innerHTML=soulCatArt(c[4]);element('small',playerName||tr('Traveller','旅人'),card);element('h2',tr(c[0],c[1]),card);element('p',tr(c[2],c[3]),card);element('small','MeowBox · Wonder Valley',card);element('p',tr('For fun, not a psychological assessment.','趣味测试，并非心理测评。'),q);b(q,tr('Share my Soul Cat','分享我的猫灵'),async()=>{let message=tr('My Soul Cat is ','我的猫灵是：')+tr(c[0],c[1])+' · MeowBox';let url='https://sobellybutton.github.io/meowbox/';try{if(navigator.share){await navigator.share({title:'MeowBox',text:message,url});return}if(navigator.clipboard){await navigator.clipboard.writeText(message+' '+url);toast(tr('Copied!','已复制！'));return}}catch(e){if(e?.name==='AbortError')return}toast(tr('You can screenshot your keepsake above.','可以截图保存上方纪念卡。'))});b(q,tr('Take the quiz again','再测一次'),()=>{soulAnswers=[];soulQuestion()});b(q,tr('Back to Wonder Valley','返回奇遇谷'),()=>{$('page').style.display='none'})})}
function soulQuestion(){let i=soulAnswers.length;if(i>=soulQs.length){let scores=Array(8).fill(0);soulAnswers.forEach((choice,j)=>soulQs[j][1][choice][2].forEach(k=>scores[k]++));soulResult=scores.indexOf(Math.max(...scores));save('soulCatV1',soulResult);addItem('Soul Cat keepsake','猫灵纪念章');addItem('Soul Cat: '+soulCats[soulResult][0],'猫灵：'+soulCats[soulResult][1]);return soulResultPage()}let v=soulQs[i];page(tr('Soul Cat Sanctuary','猫灵小屋'),(i+1)+' / '+soulQs.length,q=>{let a=element('section','',q,'soulScene');let im=element('img','',a);im.src=ART[['streetStation','readingInterior','tea','kitchen','streetStation','streetWishes'][i]]||ART.park;element('small',tr('Cat keeper','猫灵守护者'),a);element('h2',tr(...v[0]),a);v[1].forEach((opt,j)=>b(a,tr(opt[0],opt[1]),()=>{soulAnswers.push(j);sound(440+j*40);soulQuestion()}));if(i)b(q,tr('Previous question','上一题'),()=>{soulAnswers.pop();soulQuestion()});let lang=q.querySelector('.row')?.lastElementChild;if(lang)lang.onclick=()=>{zh=!zh;save('zh',zh);updateHUD();soulQuestion()}})}
function soulIntro(){page(tr('Soul Cat Sanctuary','猫灵小屋'),tr('Six little encounters. One hidden cat personality.','六个小小奇遇，找到你的隐藏猫灵。'),q=>{let a=element('section','',q,'soulScene');let art=element('div','',a);art.style.cssText='width:140px;margin:auto';art.innerHTML=soulCatArt('#a5ad8b');element('p',tr('Come in, traveller. You do not need to be a cat to have a cat soul.','进来吧旅人，不是猫也可以有一颗猫灵之心。'),a);b(a,tr('Discover my Soul Cat','寻找我的猫灵'),()=>{soulAnswers=[];soulQuestion()});if(soulResult!==null)b(a,tr('See my last result','查看上次结果'),soulResultPage)})}
roomActions.quiz=[['soulcat','Soul Cat Sanctuary','猫灵小屋'],['quiz','Workplace alter ego','职场隐藏人格']];
const soulAction=action;action=function(id){if(id==='soulcat'&&scene==='wonder'){closeTalk();return soulIntro()}return soulAction(id)};
const soulProp=prop;prop=function(id,x,y){if(id==='soulcat'){cat(x,y-30,0,false,2.4);return}soulProp(id,x,y)};

const wonderTypes=[
[['E','I'],[['At the village festival, what draws you in?','山谷庆典开始了，什么最吸引你？'],['Joining a lively table','加入热闹的一桌'],['Finding a quiet lantern-lit corner','找个灯火温柔的安静角落']],[['After a long day, how do you recharge?','忙了一整天，你会怎么充电？'],['Chat with a friend over tea','找朋友喝茶聊天'],['Enjoy some time on my own','享受独处时光']]],
[['S','N'],[['An old map has a mysterious mark. What interests you?','旧地图上有个神秘记号，你更好奇什么？'],['What is actually at that spot','那个地方究竟有什么'],['The story it might be hiding','它可能藏着什么故事']],[['A souvenir catches your eye. What matters more?','一件手信吸引了你，什么更重要？'],['Its craftsmanship and usefulness','做工与实用性'],['The ideas and memories it inspires','它带来的想象与回忆']]],
[['T','F'],[['Two travellers disagree about a route. What helps?','两位旅人对路线有分歧，你会怎么帮忙？'],['Compare the options fairly','客观比较不同路线'],['Understand what each person hopes for','了解每个人的期待']],[['A shopkeeper asks for advice on a new menu.','店主请你给新菜单提建议。'],['Explain which choices work best','分析哪些选择最合理'],['Consider what makes guests feel welcome','考虑怎样让客人感到温暖']]],
[['J','P'],[['Your train leaves tomorrow. How do you prepare?','明天就要搭火车了，你会怎么准备？'],['Make a little plan tonight','今晚先列个小计划'],['Leave room for surprises','留一点空间给惊喜']],[['A whole afternoon opens up unexpectedly.','突然多出一个空闲下午。'],['Choose one place and enjoy it','选个地方好好逛'],['Wander and see where I end up','随心走走，看看会遇见什么']]]];
const wonderMotives=[['The Improver','认真改进家','Make little things better','把小事做得更好'],['The Helper','暖心帮忙猫','Make others feel cared for','让别人感到被照顾'],['The Achiever','目标行动派','Finish something satisfying','完成一件有成就感的事'],['The Dreamer','浪漫梦想家','Create something uniquely mine','创造属于自己的东西'],['The Observer','安静观察者','Understand how things work','弄懂事情背后的道理'],['The Guardian','安心守护者','Make sure everyone is prepared','让大家都安心有准备'],['The Explorer','快乐探险家','Discover an unexpected adventure','发现意外的小冒险'],['The Protector','勇敢守护猫','Stand up for what matters','守护自己在意的东西'],['The Peacemaker','和平摸鱼家','Keep things calm and comfortable','让一切平静又舒服']];
const wonderMotivationQs=[
[['The inn is planning a festival. What would you enjoy most?','旅馆准备办庆典，你最想做什么？'],[0,1,2]],
[['A whole room is yours to decorate. What is your priority?','有个房间任你布置，你最在意什么？'],[3,4,5]],
[['Your friends have a free afternoon. What would you suggest?','朋友们有空闲下午，你会建议什么？'],[6,7,8]],
[['The village needs volunteers. Which contribution appeals to you?','小镇需要志愿者，你更愿意贡献什么？'],[0,4,8]],
[['A travelling merchant invites you to help with a project.','旅行商人邀请你帮忙做个项目。'],[1,5,6]],
[['At the end of a good day, what feels most rewarding?','美好的一天结束时，什么最让你满足？'],[2,3,7]]];
let wonderSaved=load('wonderTestsV1',{});if(!wonderSaved||typeof wonderSaved!=='object')wonderSaved={};
let wonderMode='type',wonderAnswers=[],wonderScreen='intro',wonderBusy=false;
const wonderStyle=document.createElement('style');wonderStyle.textContent=`
.wonderJourney{position:relative;background:#eee1c5;color:#604b39;border:1px solid #b39772;padding:clamp(12px,3vw,22px);box-shadow:0 8px 24px #352a2533}
.wonderJourney img{width:100%;height:clamp(100px,25vh,230px);object-fit:cover;border-radius:2px}
.wonderJourney .wonderProgress{height:4px;background:#cbb898;margin:14px 0}
.wonderJourney .wonderProgress span{display:block;height:4px;background:#718c77;transition:width .25s}
.wonderJourney .wonderChoice{display:block;width:100%;min-height:48px;text-align:left;margin:8px 0;background:#f6ead3;color:#614c37;border:1px solid #c3a77e;white-space:normal}
.wonderJourney .wonderChoice:active{background:#d7dfc5}
.wonderJourney h2{font:normal clamp(20px,4vw,28px)/1.35 Georgia,serif}
.wonderJourney .wonderBeat{animation:wonderArrival .25s ease-out both}
@keyframes wonderArrival{from{opacity:.35;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.wonderJourney .wonderBeat{animation:none}}
`;document.head.append(wonderStyle);
function wonderName(){return wonderMode==='type'?['Personality Lab','人格研究所']:['Nine Inner Motives','九型茶馆']}
function wonderShell(q){let a=element('section','',q,'wonderJourney');let im=element('img','',a);im.src=ART[wonderMode==='type'?'readingInterior':'tea']||ART.park;let body=element('div','',a,'wonderBeat');return body}
function wonderExit(){wonderBusy=false;$('page').style.display='none';activePage='';closeTalk();hint('Explore the other discoveries in Wonder Valley.','继续探索奇遇谷的其他小秘密。')}
function wonderLanguage(q){let btn=q.querySelector('.row')?.lastElementChild;if(btn)btn.onclick=()=>{zh=!zh;save('zh',zh);updateHUD();wonderRender()};let back=q.querySelector('.row')?.firstElementChild;if(back)back.onclick=()=>{if(wonderScreen==='questions'&&wonderAnswers.length){wonderAnswers.pop();wonderRender()}else wonderExit()}}
function wonderRender(){let title=wonderName();page(tr(...title),tr('A little conversation with yourself.','与自己进行一场小小对话。'),q=>{let a=wonderShell(q);if(wonderScreen==='intro'){element('h2',tr('Welcome, traveller','欢迎你，旅人'),a);element('p',wonderMode==='type'?tr('Eight everyday choices explore four playful personality preferences.','八道日常情境题，探索四种性格偏好。'):tr('Six little choices explore nine different inner motivations.','六道小小情境题，探索九种内在动力。'),a);element('p',tr('Inspired by familiar personality frameworks, for fun only.','灵感来自常见人格理论，仅供娱乐。'),a);b(a,tr('Take a seat','坐下来聊聊'),()=>{wonderAnswers=[];wonderScreen='questions';wonderRender()});if(wonderSaved[wonderMode])b(a,tr('Revisit my result','看看上次的结果'),()=>{wonderScreen='result';wonderRender()});}
else if(wonderScreen==='questions'){let i=wonderAnswers.length,total=wonderMode==='type'?8:6;let bar=element('div','',a,'wonderProgress'),fill=element('span','',bar);fill.style.width=(i/total*100)+'%';element('small',(i+1)+' / '+total,a);let v=wonderMode==='type'?wonderTypes[Math.floor(i/2)][1+i%2]:wonderMotivationQs[i];element('h2',tr(...v[0]),a);let opts=wonderMode==='type'?v.slice(1).map((o,j)=>[o[0],o[1],j]):v[1].map(k=>[wonderMotives[k][2],wonderMotives[k][3],k]);opts.forEach(o=>{let btn=b(a,tr(o[0],o[1]),()=>{if(wonderBusy)return;wonderBusy=true;wonderAnswers.push(o[2]);sound(430+i*30);btn.style.background='#c8d5b7';setTimeout(()=>{wonderBusy=false;if($('page').style.display!=='block')return;if(wonderAnswers.length===total)wonderFinish();else wonderRender()},160)});btn.className='wonderChoice'});}
else{let result=wonderSaved[wonderMode];if(!result){wonderScreen='intro';return}let art=element('div','',a);art.className='soulResultCard';let drawing=element('div','',art);drawing.innerHTML=soulCatArt(wonderMode==='type'?'#93a99d':'#d4b17b');element('small',playerName||tr('Traveller','旅人'),art);element('h2',wonderMode==='type'?result.code:tr(...wonderMotives[result.index].slice(0,2)),art);element('p',wonderMode==='type'?result.code.split('').map((x,i)=>tr(...({E:['Social energy','社交充电'],I:['Quiet energy','独处充电'],S:['Practical details','实际细节'],N:['Imagination','想象探索'],T:['Logical choices','理性选择'],F:['Personal values','重视感受'],J:['Planning','喜欢计划'],P:['Flexibility','灵活随心']}[x]))).join(' · '):tr(...wonderMotives[result.index].slice(2,4)),art);element('small','MeowBox · Wonder Valley',art);if(result.ties?.length)element('p',tr('Some preferences were tied or close. You can be a little of both.','有些偏好不分高低或十分接近，你可以同时拥有不同的一面。'),a);element('p',tr('A playful snapshot, not an official assessment.','趣味性格小画像，并非正式测评。'),a);b(a,tr('Share my discovery','分享我的发现'),async()=>{let msg='MeowBox · '+(wonderMode==='type'?result.code:tr(...wonderMotives[result.index].slice(0,2)));let url='https://sobellybutton.github.io/meowbox/';try{if(navigator.share)await navigator.share({text:msg,url});else if(navigator.clipboard){await navigator.clipboard.writeText(msg+' '+url);toast(tr('Copied!','已复制！'))}}catch(e){if(e?.name!=='AbortError')toast(tr('Screenshot your keepsake to save it.','截图保存纪念卡吧。'))}});b(a,tr('Try again','再测一次'),()=>{wonderAnswers=[];wonderScreen='questions';wonderRender()});b(a,tr('Return to the village','回到小镇'),wonderExit)}
wonderLanguage(q)})}
function wonderFinish(){if(wonderMode==='type'){let code='',ties=[];for(let i=0;i<4;i++){let a=wonderAnswers[i*2],b=wonderAnswers[i*2+1];if(a!==b)ties.push(i);code+=wonderTypes[i][0][a===b?a:a]}wonderSaved.type={code,ties};addItem('Personality Lab: '+code,'人格研究所：'+code)}else{let scores=Array(9).fill(0);wonderAnswers.forEach(k=>scores[k]++);let max=Math.max(...scores),indices=scores.map((v,i)=>v===max?i:-1).filter(i=>i>=0);let index=indices[0];wonderSaved.motive={index,ties:indices.length>1?indices:[]};addItem('Inner motive: '+wonderMotives[index][0],'内在动力：'+wonderMotives[index][1])}save('wonderTestsV1',wonderSaved);wonderScreen='result';wonderRender()}
function openWonder(mode){wonderMode=mode;wonderScreen='intro';wonderAnswers=[];wonderBusy=false;wonderRender()}
const wonderPriorAction=action;action=function(id){if(scene==='wonder'&&id==='quiz'){return say(tr('Lab keeper','研究所店主'),tr('A few little questions, no homework. Which discovery shall we try?','几个小问题，没有作业。想探索哪一面？'),[[tr('Soul Cat','猫灵测试'),soulIntro],[tr('Four personality preferences','四维性格探索'),()=>openWonder('type')],[tr('Nine inner motives','九型动力探索'),()=>openWonder('motive')]])}return wonderPriorAction(id)};
roomActions.quiz=[['quiz','Choose a discovery','选择性格探索']];

/* Wonder Valley: continuous canvas interaction, no quiz page overlay. */
activityTitle.wonderScene=['Inner discoveries','心灵奇遇'];
let wonderSceneMode='soul',wonderSceneAnswers=[],wonderScenePhase='welcome',wonderSceneAt=0,wonderScenePick=-1,wonderSceneResult=null,wonderSceneToken=0;
const wonderSceneNames={soul:['Soul Cat','猫灵测试'],type:['Personality preferences','四维性格探索'],motive:['Nine Inner Motives','九型动力探索']};
const wonderSceneBeforeHint=activityHint;activityHint=function(){if(activity==='wonderScene'){hint('Choose an object on the table. Back to room returns to the Personality Lab.','点击桌上的物品。返回小屋可回到人格研究所。');return}return wonderSceneBeforeHint()};
function wonderSceneOpen(mode){wonderSceneToken++;wonderSceneMode=mode;wonderSceneAnswers=[];wonderQuestionOrder=prepareWonderQuestions(mode);wonderScenePhase='welcome';wonderScenePick=-1;wonderSceneAt=t;wonderSceneResult=null;$('page').style.display='none';start('wonderScene');hint('Choose a little discovery on the table.','选一件桌上的小小奇遇。')}
const preferenceExtras=[
 [[['A friend invites you out after a busy week.','忙了一周，朋友约你出门。'],['I would enjoy seeing people','想见见朋友，聊聊近况'],['I would rather recharge alone','更想自己安静充电']],[['You arrive early at a new class.','第一次上课，你提前到了。'],['Start a conversation','主动聊几句'],['Settle in and observe first','先坐好，观察一下']]],
 [[['You are learning to cook a new dish.','学做一道新菜。'],['Follow the exact recipe first','先按食谱一步步做'],['Imagine interesting alternatives','想想还能怎么搭配']],[['Someone describes their holiday.','朋友讲起旅行经历。'],['Ask what they actually did','问问具体去了哪里'],['Explore what the trip meant to them','聊聊这趟旅程的感受与可能性']]],
 [[['A colleague asks you to review a draft.','同事请你帮忙看一份初稿。'],['Focus on consistency and evidence','先看逻辑和依据'],['Consider their situation and feelings','先考虑对方的处境与感受']],[['Choosing a solution under pressure, you usually…','时间紧迫，需要做决定时，你通常……'],['Apply consistent criteria','按统一标准判断'],['Weigh how each person is affected','权衡对每个人的影响']]],
 [[['You have a free weekend in a new city.','在陌生城市有两天空闲。'],['Reserve a few things in advance','提前订好几个想去的地方'],['Decide as I explore','边走边决定']],[['A personal project has no deadline.','一个自己的小项目没有截止日期。'],['Set milestones to keep myself on track','设几个小目标推进'],['Work on it when inspiration arrives','有灵感时再做']]]
];
const motiveStatements=[
 [['I notice what could be improved, even when nobody asks.','即使没人要求，我也会留意哪里还能做得更好。'],['It is difficult to let go when something feels incorrect.','觉得事情不够妥当时，我很难放下。'],['I want my actions to match my principles.','我希望自己的行动符合原则。']],
 [['I notice what others need before they say it.','别人还没开口，我常常就察觉到他们的需要。'],['Being useful to people matters deeply to me.','能为别人提供帮助，对我很重要。'],['I sometimes put my own needs aside to care for others.','为了照顾别人，我有时会把自己的需要放到一边。']],
 [['I feel energised by visible progress.','看得见的进展会让我更有动力。'],['I want my efforts to be recognised.','我希望自己的努力得到认可。'],['I sometimes measure my worth by what I accomplish.','我有时会用完成了多少事来衡量自己的价值。']],
 [['I want to express what is uniquely mine.','我想表达真正属于自己的东西。'],['I often look for deeper personal meaning.','我常常寻找事情对自己的深层意义。'],['I feel uneasy when I cannot be myself.','不能做真实的自己时，我会不自在。']],
 [['I need time to understand something before joining in.','参与一件事之前，我需要时间弄清楚它。'],['Protecting my time and energy feels important.','保护自己的时间与精力对我很重要。'],['I prefer to observe before deciding what to share.','我更喜欢先观察，再决定分享什么。']],
 [['I feel better when I have a backup plan.','有备用方案时，我会更安心。'],['I look for trustworthy people and reliable information.','我会寻找值得信赖的人和可靠的资讯。'],['I often consider what might go wrong before acting.','行动前，我经常考虑可能出现的问题。']],
 [['I like keeping several possibilities open.','我喜欢保留多种可能性。'],['New experiences help me feel energised.','新鲜体验能给我带来活力。'],['I sometimes distract myself from uncomfortable feelings with plans.','我有时会用新计划转移不舒服的情绪。']],
 [['I speak up when I think something is unfair.','遇到不公平的事，我愿意站出来说话。'],['I want to make my own decisions.','我希望自己掌握决定权。'],['I dislike feeling controlled by other people.','我不喜欢被别人控制的感觉。']],
 [['I try to reduce tension when people disagree.','别人意见不合时，我会试着缓和气氛。'],['Comfort and stability matter more than winning an argument.','舒服安稳比争论输赢更重要。'],['I sometimes delay my own decision to keep the peace.','为了维持和气，我有时会推迟自己的决定。']]
];
let wonderQuestionOrder=[];
function prepareWonderQuestions(mode){
 const rows=mode==='type'?wonderTypes.flatMap((axis,k)=>[axis[1],axis[2],...preferenceExtras[k]].map((v,j)=>({prompt:v[0],opts:v.slice(1).map((o,n)=>[o[0],o[1],n]),dimension:k,id:k*4+j}))):mode==='motive'?motiveStatements.flatMap((group,k)=>group.map((prompt,j)=>({prompt,opts:[['Not much like me','不太像我',0],['Sometimes','有时像我',1],['Very much like me','很像我',2]],dimension:k,id:k*3+j}))):soulQs.map((v,i)=>({prompt:v[0],opts:v[1].map((o,j)=>[o[0],o[1],j]),id:i}));
 // Shuffle questions, not scoring. Random order avoids obvious repeated patterns.
 for(let i=rows.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]]}
 return rows
}
function wonderSceneData(){const q=wonderQuestionOrder[wonderSceneAnswers.length];return q&&{...q,total:wonderQuestionOrder.length}}
function scoreWonder(mode,rows,answers){
 if(rows.length!==answers.length||!rows.length)throw Error('Incomplete discovery');
 if(mode==='type'){const scores=[0,0,0,0];rows.forEach((q,i)=>scores[q.dimension]+=answers[i]===0?1:-1);return {scores,code:scores.map((v,i)=>v===0?'X':wonderTypes[i][0][v>0?0:1]).join(''),ties:scores.map((v,i)=>v===0?i:-1).filter(i=>i>=0)}}
 if(mode==='motive'){const scores=Array(9).fill(0);rows.forEach((q,i)=>scores[q.dimension]+=answers[i]);const max=Math.max(...scores);return {scores,ties:scores.map((v,i)=>v===max?i:-1).filter(i=>i>=0)}}
 const scores=Array(8).fill(0),opportunity=Array(8).fill(0);
 rows.forEach((q,i)=>{const choices=soulQs[q.id][1];for(const k of new Set(choices.flatMap(o=>o[2])))opportunity[k]++;for(const k of choices[answers[i]][2])scores[k]++});
 const rates=scores.map((v,i)=>opportunity[i]?v/opportunity[i]:0),max=Math.max(...rates);return {scores,rates,ties:rates.map((v,i)=>Math.abs(v-max)<1e-8?i:-1).filter(i=>i>=0)}
}
function wonderSceneFinish(){
 const mode=wonderSceneMode,result=scoreWonder(mode,wonderQuestionOrder,wonderSceneAnswers);
 const tied=result.ties.length>1;
 if(mode==='type'){
  wonderSaved.type={code:result.code,ties:result.ties,scores:result.scores,version:2};save('wonderTestsV1',wonderSaved);
  wonderSceneResult={name:[result.code,result.code],desc:result.ties.length?['X means an even split. Preferences can depend on the situation.','X 表示偏好持平，不同情境下可能不同。']:['Your everyday preferences, not a fixed personality label.','日常偏好小画像，不是固定人格标签。'],color:'#92a79a'};
  addItem('Personality Lab: '+result.code,'人格研究所：'+result.code)
 }else{
  const catalog=mode==='soul'?soulCats:wonderMotives,top=result.ties[0],c=catalog[top];
  if(mode==='soul'){if(!tied){soulResult=top;save('soulCatV1',top)}wonderSaved.soul={ties:result.ties,scores:result.scores,version:2};addItem('Soul Cat keepsake','猫灵纪念章')}
  else{wonderSaved.motive={index:tied?null:top,ties:result.ties,scores:result.scores,version:2};addItem('Inner motives keepsake','内在动力纪念章')}
  save('wonderTestsV1',wonderSaved);
  if(tied){const pair=result.ties.slice(0,2).map(k=>catalog[k]);wonderSceneResult={name:['A mixed portrait','多面小画像'],desc:[pair.map(v=>v[0]).join(' / ')+(result.ties.length>2?' + others':'')+'. Equal scores.',''+pair.map(v=>v[1]).join(' / ')+(result.ties.length>2?' 等':'')+'。得分相同。'],color:'#c1ab8c'}}
  else{wonderSceneResult={name:c.slice(0,2),desc:c.slice(2,4),color:mode==='soul'?c[4]:'#d4b17b'};addItem((mode==='soul'?'Soul Cat: ':'Inner motive: ')+c[0],(mode==='soul'?'猫灵：':'内在动力：')+c[1])}
 }
 wonderScenePhase='result';wonderSceneAt=t;sound(660)
}
function wonderSceneChoose(j){if(wonderScenePhase!=='question')return;let d=wonderSceneData();if(!d||!d.opts[j])return;wonderScenePick=j;wonderScenePhase='turn';wonderSceneAt=t;sound(430+j*70);let token=wonderSceneToken,answer=d.opts[j][2];setTimeout(()=>{if(activity!=='wonderScene'||token!==wonderSceneToken||wonderScenePhase!=='turn')return;wonderSceneAnswers.push(answer);wonderScenePick=-1;if(wonderSceneAnswers.length===d.total)wonderSceneFinish();else{wonderScenePhase='question';wonderSceneAt=t}},330)}
function wonderSceneText(s,x,y,maxW,size=18,color='#fff1d7',maxLines=3){ctx.save();ctx.font=size+'px Georgia, serif';let parts=/[\u3400-\u9fff]/.test(s)?Array.from(s):s.split(/\s+/),sep=/[\u3400-\u9fff]/.test(s)?'':' ',lines=[],cur='';for(let part of parts){let n=cur?cur+sep+part:part;if(cur&&ctx.measureText(n).width>maxW){lines.push(cur);cur=part}else cur=n}if(cur)lines.push(cur);lines.slice(0,maxLines).forEach((v,i)=>txt(v,x,y+i*(size+5),size,color));ctx.restore()}
function wonderSceneObject(x,y,j,kind,chosen){ctx.save();ctx.translate(x,y+(chosen?-14:Math.sin(t*1.7+j)*2));ctx.rotate(chosen?.08:Math.sin(t*.8+j)*.018);ellipse(0,35,44,9,'#47362e66');if(kind==='motive'){ellipse(0,26,48,12,'#e7d0a3');let g=ctx.createLinearGradient(-32,0,32,0);g.addColorStop(0,'#a5b09a');g.addColorStop(.5,'#f5e6c8');g.addColorStop(1,'#a69d81');ctx.beginPath();ctx.moveTo(-32,-18);ctx.quadraticCurveTo(-29,24,0,24);ctx.quadraticCurveTo(29,24,32,-18);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#877357';ctx.stroke();ellipse(0,-18,32,10,'#d5bf96');ellipse(0,-18,27,7,'#957a4e');for(let n=0;n<2;n++){ctx.strokeStyle='#fff3db99';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8+n*14,-25);ctx.quadraticCurveTo(-17+n*14+Math.sin(t*2+n)*7,-40,-4+n*14,-57);ctx.stroke()}}else{let color=['#77968a','#b28472','#9d99b3','#c4a266'][j%4];round(-38,-48,76,85,4,'#f6e4bf','#ab895d');round(-33,-43,66,54,2,color,'#c5a778');ctx.save();ctx.translate(0,-15);if(kind==='soul'){cat(0,24,j%4,false,.8)}else{ellipse(0,-3,17,17,'#ead6aa');for(let n=0;n<4;n++){let a=n*Math.PI/2+t*.12;line(0,-3,Math.cos(a)*22,-3+Math.sin(a)*22,'#f4e5bc',1.4)}ellipse(0,-3,5,5,'#7d715b')}ctx.restore();line(-24,22,24,22,'#ba9871',1);line(-15,28,15,28,'#cbb18a',1)}ctx.restore()}
async function wonderSceneShare(){let v=wonderSceneResult;if(!v)return;let msg=tr('My MeowBox discovery: ','我的摸鱼小镇奇遇：')+tr(...v.name),url='https://sobellybutton.github.io/meowbox/journey-preview.html';try{if(navigator.share)await navigator.share({text:msg,url});else if(navigator.clipboard){await navigator.clipboard.writeText(msg+' '+url);toast(tr('Copied!','已复制！'))}else toast(tr('Take a screenshot of your keepsake.','截图保存纪念卡吧。'))}catch(e){if(e?.name!=='AbortError')toast(tr('Take a screenshot of your keepsake.','截图保存纪念卡吧。'))}}
const wonderCanvasPrior=drawActivity;drawActivity=function(){if(activity!=='wonderScene')return wonderCanvasPrior();
 let mode=wonderSceneMode,phase=wonderScenePhase;ctx.save();let bg=pics[mode==='motive'?'tea':'readingInterior'];paintLivingBackdrop(bg);let veil=ctx.createLinearGradient(0,225,0,680);veil.addColorStop(0,'#293e3970');veil.addColorStop(.55,'#3b34292a');veil.addColorStop(1,'#49372f8c');ctx.fillStyle=veil;shadeLivingBackdrop(veil);
 for(let i=0;i<12;i++){let x=187+(i*73)%421,y=235+(i*43)%175;ctx.globalAlpha=.25+.2*Math.sin(t+i);ellipse(x+Math.sin(t*.8+i)*4,y,1.8,1.8,'#ffe5a5')}ctx.globalAlpha=1;glow(218,278,56,1);glow(582,275,52,2);
 if(mode==='soul')cat(400,372+Math.sin(t*2)*1.5,0,false,2);else human(400,383,mode==='type'?2:0,false,1,1.55);
 let wood=ctx.createLinearGradient(0,395,0,670);wood.addColorStop(0,'#ae8761');wood.addColorStop(1,'#72513b');ctx.beginPath();ctx.moveTo(211,399);ctx.lineTo(589,399);ctx.lineTo(780,1800);ctx.lineTo(20,1800);ctx.closePath();ctx.fillStyle=wood;ctx.fill();ctx.strokeStyle='#c4a071';ctx.stroke();for(let i=0;i<12;i++)line(188,416+i*20,612,418+i*20,'#e5bc8922',1);
 txt(tr(...wonderSceneNames[mode]),400,251,21,'#fff1d5');
 if(phase==='welcome'){wonderSceneText(tr('Take your time. Answer as you are, not as you wish to be.','慢慢来，按真实的自己作答就好。'),400,420,385,19);wonderSceneObject(400,516,0,mode,false);label(tr('Begin our conversation','开始我们的对话'),400,606,()=>{wonderScenePhase='question';wonderSceneAt=t;sound(480)});txt(tr('For fun, at your own pace.','趣味探索，慢慢来。'),400,644,13,'#f8e4c6')}
 else if(phase==='result'){let v=wonderSceneResult,f=Math.min(1,Math.max(0,(t-wonderSceneAt)/.65));ctx.save();ctx.translate(400,493);ctx.scale(Math.max(.02,f),1);round(-147,-103,294,207,4,'#f5e3ba','#b88b5e');round(-139,-95,278,191,2,null,'#b88b5e');if(mode==='soul')cat(0,-15,0,false,1.35);else{ellipse(0,-55,28,28,v.color);ctx.strokeStyle='#b28c5b';ctx.beginPath();ctx.arc(0,-55,35,0,TAU);ctx.stroke()}wonderSceneText(tr(...v.name),0,-1,260,23,'#654b39',2);wonderSceneText(tr(...v.desc),0,29,262,16,'#654b39',4);ctx.restore();label(tr('Share keepsake','分享纪念卡'),330,623,wonderSceneShare);label(tr('Try again','再测一次'),486,623,()=>wonderSceneOpen(mode));txt(tr('Back to lab · for fun only','返回研究所 · 仅供娱乐'),400,655,13,'#fff1d5')}
 else{let d=wonderSceneData();if(d){let n=d.opts.length;let f=Math.min(1,Math.max(0,(t-wonderSceneAt)/.3));ctx.globalAlpha=phase==='turn'?1:Math.max(.15,f);wonderSceneText(tr(...d.prompt),400,402,395,21,'#fff1d5',3);for(let j=0;j<n;j++){let x=n===4?250+j*100:n===3?278+j*122:327+j*146,y=528;wonderSceneObject(x,y,j,mode,phase==='turn'&&wonderScenePick===j);wonderSceneText(tr(d.opts[j][0],d.opts[j][1]),x,579,n===4?93:117,16,'#fff5df',4);if(phase==='question')target(x-48,470,96,160,()=>wonderSceneChoose(j))}ctx.globalAlpha=1;txt((wonderSceneAnswers.length+1)+' / '+d.total,400,654,14,'#fff1d5')}}
 ctx.restore();
};
const wonderCanvasAction=action;action=function(id){if(scene==='wonder'&&id==='soulcat')return wonderSceneOpen('soul');if(scene==='wonder'&&id==='quiz')return say(tr('Lab keeper','研究所店主'),tr('Which little discovery shall we explore?','今天想探索哪一个小秘密？'),[[tr('Four personality preferences','四维性格探索'),()=>wonderSceneOpen('type')],[tr('Nine inner motives','九型动力探索'),()=>wonderSceneOpen('motive')],[tr('Soul Cat','猫灵测试'),()=>wonderSceneOpen('soul')]]);return wonderCanvasAction(id)};

/* The café lives on the game canvas, with a conversation rather than a compatibility score. */
let cafeRound=0,cafeAnswers=[],cafePhase='welcome',cafeAt=0,cafePick=-1,cafeToken=0,cafeResult=null;
const cafeQuestions=[
[['A friend arrives with a whole afternoon free.','朋友来啦，今天下午都有空。'],[['Find a quiet window seat','找个安静的靠窗位'],['Discover a new street','一起探索新街道'],['Order tea and catch up','点杯茶慢慢聊']]],
[['Your friend has had a difficult day.','朋友今天过得不太顺心。'],[['Give them space','给对方一点空间'],['Suggest a change of scenery','提议出去换换心情'],['Listen without rushing','耐心听对方说']]],
[['You both have different dinner ideas.','你们想吃的晚餐不一样。'],[['Make a simple compromise','找个简单折中方案'],['Try both places','两家都去试试'],['Ask what matters to them','问问对方最在意什么']]],
[['The last train is approaching.','末班车快到了。'],[['Plan a comfortable trip home','安排舒服的回家路线'],['Find one last little adventure','再找个小小奇遇'],['Make plans to meet again','约好下次见面']]]];
const cafeKinds=[
['Quiet Harbour','安静港湾','You enjoy companionship with room to breathe.','你喜欢有陪伴，也有自在空间的相处方式。','#92a89f'],
['Adventure Companion','冒险搭子','You enjoy discovering small surprises together.','你喜欢和别人一起发现生活里的小惊喜。','#d6a36d'],
['Warm-hearted Listener','暖心倾听者','You value time, attention and mutual understanding.','你重视陪伴、倾听与相互理解。','#c99a96']];
const cafePriorHint=activityHint;activityHint=function(){if(activity==='match'&&scene==='wonder'){hint('Choose a cup. Every choice tells the host a little more.','选一杯茶，每个选择都是一段小故事。');return}return cafePriorHint()};
const cafePriorStart=start;start=function(a){cafePriorStart(a);if(a==='match'&&scene==='wonder'){cafeToken++;cafeRound=0;cafeAnswers=[];cafePhase='welcome';cafeAt=t;cafeResult=null;cafePick=-1}};
function cafeChoose(i){if(cafePhase!=='question')return;cafePick=i;cafePhase='turn';cafeAt=t;let token=cafeToken;sound(450+i*70);setTimeout(()=>{if(activity!=='match'||scene!=='wonder'||cafeToken!==token||cafePhase!=='turn')return;cafeAnswers.push(i);cafeRound++;cafePick=-1;cafeAt=t;if(cafeRound===cafeQuestions.length){let scores=[0,0,0];cafeAnswers.forEach(k=>scores[k]++);let max=Math.max(...scores),ties=scores.map((v,k)=>v===max?k:-1).filter(k=>k>=0);cafeResult={index:ties[0],ties};save('cafeStyleV1',cafeResult);addItem('Café discovery: '+cafeKinds[ties[0]][0],'缘分咖啡馆：'+cafeKinds[ties[0]][1]);cafePhase='result';sound(660)}else cafePhase='question'},350)}
function cafeRoom(){let im=pics.tea||pics.readingInterior;paintLivingBackdrop(im);let veil=ctx.createLinearGradient(0,220,0,675);veil.addColorStop(0,'#2f38363b');veil.addColorStop(1,'#30261d8b');ctx.fillStyle=veil;shadeLivingBackdrop(veil);glow(218,265,60,1);glow(570,270,65,2);for(let i=0;i<10;i++){ctx.save();ctx.globalAlpha=.24+.18*Math.sin(t+i);ellipse(185+(i*73)%425+Math.sin(t+i)*3,243+(i*39)%148,1.5,1.5,'#ffefba');ctx.restore()}human(400,382,0,false,1,1.6);let g=ctx.createLinearGradient(0,392,0,660);g.addColorStop(0,'#bc976d');g.addColorStop(1,'#76533b');ctx.beginPath();ctx.moveTo(218,394);ctx.lineTo(582,394);ctx.lineTo(780,1800);ctx.lineTo(20,1800);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#bda073';ctx.stroke();for(let i=0;i<12;i++)line(190,418+i*20,610,420+i*20,'#e6c39325',1);txt(tr('Compatibility Café','缘分咖啡馆'),400,250,22,'#fff4dd')}
const cafePriorDraw=drawActivity;drawActivity=function(){if(activity!=='match'||scene!=='wonder')return cafePriorDraw();ctx.save();cafeRoom();
 if(cafePhase==='welcome'){wonderSceneText(tr('Pull up a chair. Let us find your favourite way to connect.','坐下来，看看你最喜欢怎样与人相处。'),400,420,390,18);wonderSceneObject(400,525,0,'motive',false);label(tr('Join me for tea','一起喝杯茶'),400,605,()=>{cafePhase='question';cafeAt=t;sound(490)});txt(tr('A friendly conversation, not a match prediction.','轻松聊聊，并非缘分预测。'),400,647,13,'#fff1d8')}
 else if(cafePhase==='result'){let v=cafeKinds[cafeResult.index],f=Math.min(1,(t-cafeAt)/.65);ctx.save();ctx.translate(400,495);ctx.scale(Math.max(.03,f),1);round(-155,-100,310,205,4,'#f2dfbb','#a67f53');round(-147,-92,294,189,2,null,'#b39161');wonderSceneObject(0,-42,cafeResult.index,'motive',false);wonderSceneText(tr(v[0],v[1]),0,9,280,22,'#624938',2);wonderSceneText(tr(v[2],v[3]),0,40,275,14,'#624938',3);ctx.restore();if(cafeResult.ties.length>1)txt(tr('You have more than one favourite style.','你也有其他同样喜欢的相处方式。'),400,609,13,'#fff1d8');label(tr('Share','分享'),323,637,async()=>{let msg='MeowBox · '+tr(v[0],v[1]),url='https://sobellybutton.github.io/meowbox/journey-preview.html';try{if(navigator.share)await navigator.share({text:msg,url});else if(navigator.clipboard){await navigator.clipboard.writeText(msg+' '+url);toast(tr('Copied!','已复制！'))}}catch(e){if(e?.name!=='AbortError')toast(tr('Screenshot your keepsake.','截图保存纪念卡。'))}});label(tr('Try again','再玩一次'),480,637,()=>start('match'))}
 else{let q=cafeQuestions[cafeRound];if(q){let f=Math.min(1,Math.max(.15,(t-cafeAt)/.3));ctx.globalAlpha=cafePhase==='turn'?1:f;wonderSceneText(tr(...q[0]),400,414,390,18,'#fff1d7',3);q[1].forEach((opt,i)=>{let x=278+i*122;wonderSceneObject(x,525,i,'motive',cafePhase==='turn'&&cafePick===i);wonderSceneText(tr(...opt),x,581,112,14,'#fff5dd',3);if(cafePhase==='question')target(x-58,465,116,155,()=>cafeChoose(i))});ctx.globalAlpha=1;txt((cafeRound+1)+' / '+cafeQuestions.length,400,651,14,'#fff1d8')}}
 ctx.restore()};
const soulAwareTalk=npcTalk;npcTalk=function(n){soulAwareTalk(n);if(!n?.n||!talkOpen||!Number.isInteger(soulResult)||!soulCats[soulResult])return;let lineEl=$('line');if(!lineEl)return;let remarks=[['A fellow daydreamer! The clouds are particularly good today.','原来也是发呆同好！今天的云特别好看。'],['I know a bench with excellent nap potential.','我知道一张特别适合午睡的长椅。'],['There is a little street you probably have not explored yet.','有条小巷，你可能还没探索过。'],['The night sky here is worth staying up for.','这里的夜空值得晚一点睡。'],['You have the kind of company that makes tea taste better.','有你陪着喝茶，茶都更香了。'],['You did not hear this from me, but the boss is on holiday.','别说是我说的，老板偷偷去度假了。'],['Finally, someone else who dislikes pointless meetings.','终于遇见另一个讨厌无效会议的人。'],['The souvenir merchant might have something special today.','今天手信店可能有点特别的东西。']];if(hash(day()+n.n[0])%2===0)lineEl.textContent+=' '+tr(...remarks[soulResult])};

/* Parallel Lives: a miniature branching journey, rendered in the same living canvas. */
const parallelScenes={
station:{art:'streetStation',host:2,title:['The letter without an address','没有地址的信'],text:['A conductor hands you a letter. The destination says: somewhere you have never been.','列车长递给你一封信，目的地写着：一个你从未去过的地方。'],choices:[['Board the mysterious train','搭上神秘列车','train'],['Ask the conductor about the letter','问问列车长信的来历','post']]},
train:{art:'streetStation',host:2,title:['A ticket to nowhere','一张没有终点的车票'],text:['The conductor offers a coastal ticket and a mountain ticket. Neither needs annual leave.','列车长拿出海边和山间的车票，两张都不用请年假。'],choices:[['Follow the ocean','去看海','coast'],['Follow the mountain mist','追着山间的雾','mountain']]},
post:{art:'readingInterior',host:0,title:['The lost letter office','失物邮局'],text:['The postmistress says the letter belongs to a version of you who made a different choice.','邮局店主说，这封信属于另一个做了不同选择的你。'],choices:[['Deliver it to the café','把信送去咖啡馆','cafe'],['Open your own tiny bookshop','开一家自己的小书店','books']]},
coast:{art:'island',host:3,title:['The seaside tomorrow','海边的明天'],text:['A little shop has a vacancy: lighthouse keeper or postcard artist. The salary is mostly sunshine.','海边小店正在招聘灯塔守护人和明信片画师，工资主要是阳光。'],choices:[['Keep the lighthouse','守护灯塔','endLight'],['Paint the postcards','画明信片','endArt']]},
mountain:{art:'valleyClean',host:2,title:['The mountain station','山间小站'],text:['A cat sits beside a forgotten bench. A trail leads towards a hidden observatory.','一只猫坐在被遗忘的长椅旁，小路通向一座隐藏的观星台。'],choices:[['Stay with the cat','留下陪猫咪','endNap'],['Walk to the observatory','走去观星台','endStars']]},
cafe:{art:'tea',host:0,title:['A café in another life','另一个人生的咖啡馆'],text:['The owner offers you the keys. There is only one rule: no meetings before breakfast.','店主把钥匙交给你，只有一条规矩：早餐前不准开会。'],choices:[['Open a quiet tea shop','开一家安静茶馆','endTea'],['Start a gossip club','开个吃瓜俱乐部','endGossip']]},
books:{art:'readingInterior',host:1,title:['The bookshop after hours','深夜书店'],text:['A dusty notebook contains two possible lives. Which page do you turn?','一本落满灰尘的笔记本写着两种人生，你会翻向哪一页？'],choices:[['Write stories for travellers','为旅人写故事','endWriter'],['Send postcards to future me','寄明信片给未来的自己','endLetters']]}
};
const parallelEndings={
endLight:['Lighthouse Keeper','灯塔守护人','You became the little light somebody needed.','你成为了某个人需要的那一点光。','island'],
endArt:['Seaside Artist','海边画师','Your biggest deadline is the sunset.','你最大的截止时间，是日落。','island'],
endNap:['Professional Bench Warmer','长椅专业户','The cat has promoted you to full-time companion.','猫咪正式聘请你当全职陪伴员。','park'],
endStars:['Midnight Astronomer','午夜观星人','The stars never schedule unnecessary meetings.','星星从来不开无效会议。','readingInterior'],
endTea:['Tea Shop Keeper','茶馆主人','You finally have a meeting worth attending: afternoon tea.','终于有一场值得参加的会议：下午茶。','tea'],
endGossip:['Chief Gossip Officer','首席吃瓜官','The tea is hot and the news is even hotter.','茶很热，瓜更热。','tea'],
endWriter:['Story Collector','故事收藏家','Every traveller leaves you a little story.','每个旅人都留给你一段小故事。','readingInterior'],
endLetters:['Future Postmaster','未来邮局店长','Your future self says to take more breaks.','未来的你说：记得多休息。','streetStation']
};
let parallelNode='station',parallelAt=0,parallelPick=-1,parallelToken=0,parallelTurning=false,parallelTrail=[];
let parallelFound=load('parallelEndingsV1',[]);if(!Array.isArray(parallelFound))parallelFound=[];
const parallelPriorStart=start;start=function(a){parallelPriorStart(a);if(a==='story'&&scene==='wonder'){parallelToken++;parallelNode='station';parallelAt=t;parallelPick=-1;parallelTurning=false;parallelTrail=[];hint('Follow the letter and choose your own path.','跟随这封信，选择属于你的路。')}};
function parallelSelect(i){let node=parallelScenes[parallelNode];if(!node||parallelTurning||!node.choices[i])return;parallelTurning=true;parallelPick=i;parallelAt=t;let next=node.choices[i][2],token=parallelToken;parallelTrail.push(parallelNode);sound(490+i*80);setTimeout(()=>{if(activity!=='story'||scene!=='wonder'||token!==parallelToken)return;parallelNode=next;parallelAt=t;parallelPick=-1;parallelTurning=false;if(parallelEndings[next]){let end=parallelEndings[next];if(!parallelFound.includes(next)){parallelFound.push(next);save('parallelEndingsV1',parallelFound)}addItem('Parallel life: '+end[0],'平行人生：'+end[1]);sound(660)}},420)}
function parallelPaper(x,y,j,selected){ctx.save();ctx.translate(x,y+(selected?-13:Math.sin(t*1.5+j)*2));ctx.rotate(selected?.1:j===0?-.06:.06);ellipse(0,32,48,8,'#30272066');round(-57,-40,114,74,3,'#eed9af','#9e8056');ctx.strokeStyle='#b69b72';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-57,-40);ctx.lineTo(0,2);ctx.lineTo(57,-40);ctx.moveTo(-57,34);ctx.lineTo(-15,-5);ctx.moveTo(57,34);ctx.lineTo(15,-5);ctx.stroke();ellipse(0,0,10,10,j===0?'#a75f4c':'#738d75');ctx.strokeStyle='#e8c79a';ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.stroke();ctx.restore()}
const parallelPriorDraw=drawActivity;drawActivity=function(){if(activity!=='story'||scene!=='wonder')return parallelPriorDraw();let n=parallelScenes[parallelNode],end=parallelEndings[parallelNode],art=n?.art||end?.[4]||'streetStation';ctx.save();let im=pics[art]||pics.readingInterior;paintLivingBackdrop(im);let shade=ctx.createLinearGradient(0,222,0,675);shade.addColorStop(0,'#34423e45');shade.addColorStop(.55,'#3c312a66');shade.addColorStop(1,'#463228b0');ctx.fillStyle=shade;shadeLivingBackdrop(shade);glow(218,280,60,1);glow(580,270,55,2);for(let i=0;i<14;i++){ctx.save();ctx.globalAlpha=.18+.18*Math.sin(t+i);ellipse(180+(i*71)%440+Math.sin(t*.7+i)*4,240+(i*31)%170,1.5,1.5,'#ffe7b0');ctx.restore()}
 if(n){human(400,385,n.host,false,1,1.65);txt(tr('Parallel Lives','平行人生'),400,250,22,'#fff2d7');let wood=ctx.createLinearGradient(0,395,0,670);wood.addColorStop(0,'#b58b61');wood.addColorStop(1,'#75513a');ctx.beginPath();ctx.moveTo(215,395);ctx.lineTo(585,395);ctx.lineTo(780,1800);ctx.lineTo(20,1800);ctx.closePath();ctx.fillStyle=wood;ctx.fill();ctx.strokeStyle='#bd986c';ctx.stroke();for(let i=0;i<13;i++)line(190,415+i*20,610,417+i*20,'#e2bc8725',1);let f=Math.min(1,Math.max(.1,(t-parallelAt)/.3));ctx.globalAlpha=parallelTurning?1:f;wonderSceneText(tr(...n.title),400,412,385,21,'#fff0d5',2);wonderSceneText(tr(...n.text),400,448,390,15,'#fff2d8',4);for(let i=0;i<2;i++){let x=300+i*200;parallelPaper(x,553,i,parallelTurning&&parallelPick===i);wonderSceneText(tr(n.choices[i][0],n.choices[i][1]),x,602,175,15,'#fff4df',3);if(!parallelTurning)target(x-82,510,164,127,()=>parallelSelect(i))}ctx.globalAlpha=1;txt(tr('Discoveries: ','已发现：')+parallelFound.length+' / 8',400,656,13,'#f8e4c5')}
 else if(end){let f=Math.min(1,Math.max(.03,(t-parallelAt)/.7));ctx.save();ctx.translate(400,468);ctx.rotate((1-f)*-.12);ctx.scale(f,1);round(-166,-112,332,224,3,'#f3dfb6','#9d784f');round(-158,-104,316,208,2,null,'#b39766');let img=pics[end[4]];if(img?.naturalWidth)cover(img,-140,-92,280,84);wonderSceneText(tr(end[0],end[1]),0,13,292,23,'#604b37',2);wonderSceneText(tr(end[2],end[3]),0,47,285,15,'#604b37',3);ctx.restore();txt(tr('Parallel life collected','平行人生已收藏')+' · '+parallelFound.length+'/8',400,600,15,'#fff1d5');label(tr('Another life','再试一种人生'),310,639,()=>start('story'));label(tr('Share memory','分享回忆'),490,639,async()=>{let msg='MeowBox · '+tr(end[0],end[1]),url='https://sobellybutton.github.io/meowbox/journey-preview.html';try{if(navigator.share)await navigator.share({text:msg,url});else if(navigator.clipboard){await navigator.clipboard.writeText(msg+' '+url);toast(tr('Copied!','已复制！'))}}catch(e){if(e?.name!=='AbortError')toast(tr('Screenshot your postcard.','截图保存明信片吧。'))}})}
 ctx.restore()};

/* Shared stage polish: world-sized backgrounds and a short illustrated crossfade. */
function livingBounds(){let sc=Math.max(.01,cam.scale);return {x:-cam.ox/sc,y:-cam.oy/sc,w:W/sc,h:H/sc}}
function paintLivingBackdrop(im){let b=livingBounds();if(im?.naturalWidth)cover(im,b.x,b.y,b.w,b.h);else{ctx.fillStyle='#526357';ctx.fillRect(b.x,b.y,b.w,b.h)}}
function shadeLivingBackdrop(g){let b=livingBounds();ctx.fillStyle=g;ctx.fillRect(b.x,b.y,b.w,b.h)}
const motionStageStyle=document.createElement('style');motionStageStyle.textContent=`
#sceneCrossfade{position:absolute;inset:0;width:100%;height:100%;z-index:28;pointer-events:none;object-fit:fill;opacity:1;transition:opacity .32s ease}
#game[data-living="true"] #hint{background:#33483fe8;color:#f8ecd1;border:1px solid #b6a17a;max-width:min(88%,580px);padding:7px 13px}
#game[data-living="true"] #location{background:#f1e4c9e8;color:#514438}
#game[data-living="true"] #dock{background:#f4e7cfe8;border-color:#bba47c}
#game[data-living="true"] #back{min-height:44px}
@media(max-height:500px){#game[data-living="true"] #hint{display:none}}
@media(prefers-reduced-motion:reduce){#sceneCrossfade{transition:none}}
`;document.head.append(motionStageStyle);
const stageHUD=updateHUD;updateHUD=function(){stageHUD();$('game').dataset.living=String(scene==='wonder'&&!!activity&&['wonderScene','story','match'].includes(activity))};
const priorStageFade=fade;
fade=function(fn,kind='gust',destination=null){if(kind==='postcard')return priorStageFade(fn,kind,destination);if(transitioning)return;let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){fn();return}transitioning=true;let snapshot=document.createElement('canvas');snapshot.id='sceneCrossfade';snapshot.width=c.width;snapshot.height=c.height;try{snapshot.getContext('2d').drawImage(c,0,0);$('game').append(snapshot)}catch(e){transitioning=false;return priorStageFade(fn,kind,destination)}
 try{fn()}catch(e){snapshot.remove();transitioning=false;throw e}
 requestAnimationFrame(()=>requestAnimationFrame(()=>{snapshot.style.opacity='0';setTimeout(()=>{snapshot.remove();transitioning=false},350)}))
};

/* Character motion: preserve illustrated heads, animate bodies and host responses. */
let actorGestureUntil=-1,actorGestureDirection=1,actorGestureKind='wave';
let greetingNPC=null,greetingUntil=-1;
const actorReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function actorGesture(kind='wave',direction=1){if(actorReduce)return;actorGestureKind=kind;actorGestureDirection=direction;actorGestureUntil=t+.85}
const actorOriginalHuman=human;
human=function(x,y,kind,walking,dir,scale=1){
 let host=room&&activity&&scene==='wonder'&&Math.abs(x-400)<2&&y>350&&y<400;
 let greet=!room&&greetingNPC&&Math.hypot(x-greetingNPC.x,y-greetingNPC.y)<3&&t<greetingUntil;
 let acting=!actorReduce&&!walking&&((host&&t<actorGestureUntil)||greet);
 if(!acting)return actorOriginalHuman(x,y,kind,walking,dir,scale);
 let f=host?Math.max(0,Math.min(1,(actorGestureUntil-t)/.85)):Math.max(0,Math.min(1,(greetingUntil-t)/.9));
 let lift=Math.sin(f*Math.PI),side=host?actorGestureDirection:1;
 ctx.save();ctx.translate(x,y);ctx.rotate(lift*.045*side);
 actorOriginalHuman(0,-lift*2,kind,false,dir,scale);
 ctx.scale(scale,scale);let shirt=['#ead1a5','#e7e8e3','#425c77','#82986d'][kind%4]||'#e7e8e3';
 let sx=side*14,ex=side*(22+lift*4),ey=-37-lift*20;
 if(host&&actorGestureKind==='nod'){ctx.restore();return}
 line(sx,-41,side*22,-36-lift*7,shirt,9);line(side*22,-36-lift*7,ex,ey,shirt,8);ellipse(ex,ey,4.2,5.1,'#efc8a7');
 ctx.restore()
};
const actorOriginalCat=cat;
cat=function(x,y,kind=0,walking=false,sc=1){
 let host=scene==='wonder'&&room&&activity==='wonderScene'&&wonderSceneMode==='soul'&&Math.abs(x-400)<3&&y>350&&y<390;
 let active=host&&!actorReduce&&t<actorGestureUntil;
 let f=active?Math.max(0,Math.min(1,(actorGestureUntil-t)/.85)):0;
 let lift=Math.sin(f*Math.PI)*5;
 actorOriginalCat(x,y-lift,kind,walking,sc);
 if(!walking&&!actorReduce&&((t+kind*.67+x*.005)%4.8)<.13){
 ctx.save();ctx.translate(x,y-lift);ctx.scale(sc,sc);
 let fur=['#d89858','#ece1c6','#44434a','#d1a077','#9399a2'][kind%5];for(let k of [-7,7]){ellipse(k,-27,3.3,4.2,fur);line(k-2.4,-26,k+2.4,-26,kind===2?'#f5d376':'#45352e',1.25)}
 ctx.restore()}
};
const actorPriorBack=backHuman;
backHuman=function(x,y,kind,walking,facing,sc){
 if(!['up','down','left','right'].includes(facing))facing='down';
 if(!Number.isFinite(kind))kind=0;kind=((kind%4)+4)%4;
 if(facing==='down')return human(x,y,kind,walking,1,sc);
 if(actorReduce||!walking)return actorPriorBack(x,y,kind,walking,facing,sc);
 ctx.save();ctx.translate(x,y);let sway=Math.sin(t*12)*.018;ctx.rotate(sway);actorPriorBack(0,0,kind,walking,facing,sc);ctx.restore()
};
const actorPriorTalk=npcTalk;
npcTalk=function(n){if(n&&!room){greetingNPC=n;greetingUntil=t+.9;stopRoute();p.tx=p.x;p.ty=p.y;if(Math.abs(n.x-p.x)>Math.abs(n.y-p.y))p.facing=n.x<p.x?'left':'right';else p.facing=n.y<p.y?'up':'down'}return actorPriorTalk(n)};
const actorPriorWonderChoose=wonderSceneChoose;
wonderSceneChoose=function(j){if(wonderScenePhase==='question')actorGesture(j%2?'wave':'nod',j%2?1:-1);return actorPriorWonderChoose(j)};
const actorPriorCafeChoose=cafeChoose;
cafeChoose=function(j){if(cafePhase==='question')actorGesture(j===1?'wave':'nod',j===0?-1:1);return actorPriorCafeChoose(j)};
const actorPriorParallelSelect=parallelSelect;
parallelSelect=function(i){if(!parallelTurning)actorGesture('wave',i===0?-1:1);return actorPriorParallelSelect(i)};
const actorPriorStart=start;
start=function(a){actorPriorStart(a);if(scene==='wonder'&&['wonderScene','match','story'].includes(a))actorGesture('wave',1)};
/* Extend directional motion to the other maps without replacing their art or interactive targets. */
const actorPriorMap=drawMap;
drawMap=function(){if(isRoute())return actorPriorMap();let original=human;human=function(x,y,kind,walking,dir,sc=1){if(Math.abs(x-p.x)<.01&&Math.abs(y-p.y)<.01){if(p.facing==='down')return original(x,y,kind,walking,dir,sc);let front=human;human=original;try{return backHuman(x,y,kind,walking,p.facing||'down',sc)}finally{human=front}}return original(x,y,kind,walking,dir,sc)};try{actorPriorMap()}finally{human=original}};

/* Food & Fun Street: tactile feedback without additional panels. */
let arcadeFeedback=null,streetSparks=[],streetObservedState=null,streetIngredientCount=0,streetStirAmount=0,streetCookDone=false;
function streetBurst(x,y,count,color){for(let i=0;i<count;i++){let angle=Math.random()*TAU,speed=25+Math.random()*65;streetSparks.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-40,at:t,color})}if(streetSparks.length>80)streetSparks.splice(0,streetSparks.length-80)}
const streetStartBefore=start;start=function(a){streetStartBefore(a);streetSparks=[];arcadeFeedback=null;streetObservedState=state;streetIngredientCount=0;streetStirAmount=0;streetCookDone=false;if(a==='cook')hint('Drag ingredients into the soup, then stir with your finger.','把食材拖进汤锅，再用手指搅拌。')};
const streetClawBefore=doClaw;doClaw=function(){if(activity!=='claw'||state.dropping)return;streetClawBefore();let run=state,grab=state.grab;arcadeFeedback=null;refreshControls();setTimeout(()=>{if(activity!=='claw'||state!==run)return;arcadeFeedback={at:t,grab};if(grab>=0){streetBurst(400,555,16,'#f3cd83');sound(660)}refreshControls()},1380)};
const streetFishBefore=doFish;doFish=function(){if(activity!=='fish')return;let was=state.fish;streetFishBefore();if(was===0&&state.fish===1){state.castAnimAt=t;streetBurst(468,462,9,'#d5ede0')}if(was===2&&state.fish===0){streetBurst(468,480,18,'#c8e4dc');sound(620)}};
const streetControlBefore=refreshControls;refreshControls=function(){streetControlBefore();if(activity==='claw'&&state.dropping){let e=$('gameControls');if(e)for(let b of e.querySelectorAll('button'))b.disabled=true}};
const streetPotBefore=pot;pot=function(x,y){if(activity!=='cook')return streetPotBefore(x,y);ctx.save();let heat=state.done?.28:.75;ellipse(x,y+50,100,20,'#3e3830');for(let i=0;i<7;i++){let xx=x-66+i*22,h=(16+Math.sin(t*9+i)*7)*heat;ctx.fillStyle='#d68743';ctx.beginPath();ctx.moveTo(xx-8,y+53);ctx.quadraticCurveTo(xx-10,y+38,xx+Math.sin(t*7+i)*3,y+32-h);ctx.quadraticCurveTo(xx+12,y+42,xx+8,y+53);ctx.fill();ellipse(xx,y+48,4,6,'#f5cb78')}streetPotBefore(x,y);if(state.ingredients?.length){ctx.save();ctx.beginPath();ctx.ellipse(x,y-10,77,20,0,0,TAU);ctx.clip();for(let i=0;i<9;i++){let f=(t*.55+i*.137)%1,xx=x+Math.sin(i*2.4+t*.6)*62,yy=y-10+Math.cos(i*1.7)*13;ctx.globalAlpha=(1-f)*.65;ctx.strokeStyle='#ffebbd';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(xx,yy,2+f*5,0,TAU);ctx.stroke()}ctx.restore()}ctx.restore()};
const streetMachineBefore=machine;machine=function(x,y,hook,drop){streetMachineBefore(x,y,hook,drop);if(activity!=='claw')return;ctx.save();ctx.strokeStyle='#f8e3b6';ctx.lineWidth=2;for(let i=0;i<6;i++){let xx=x-93+i*37;ellipse(xx,y-90,3,3,Math.sin(t*3+i)>.1?'#fff0b9':'#b58a86')}ctx.globalAlpha=.28;line(x-94,y-69,x-37,y+53,'#fffdf2',4);line(x-80,y-69,x-23,y+53,'#fffdf2',2);ctx.globalAlpha=1;ctx.restore()};
const streetDrawBefore=drawActivity;drawActivity=function(){streetDrawBefore();if(!['cook','claw','fish','pet','hit'].includes(activity))return;ctx.save();
 if(activity==='cook'){if(streetObservedState!==state){streetObservedState=state;streetIngredientCount=0;streetStirAmount=0;streetCookDone=false}let n=state.ingredients?.length||0;if(n>streetIngredientCount){streetBurst(400,473,10,'#e7c87c');streetIngredientCount=n}if(state.done&&!streetCookDone){streetBurst(400,430,15,'#f6db9b');streetCookDone=true}if(!state.done)streetCookDone=false;let stir=Math.max(0,Math.min(1,(state.coins||0)/150));if(n){ctx.strokeStyle='#e9d0a1';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(400,477,105,32,0,Math.PI,Math.PI+TAU*stir*.5);ctx.stroke();if(drag?.id==='stir'){ctx.save();ctx.translate(400,479);ctx.rotate(Math.atan2(drag.y-479,drag.x-400)+Math.PI*.5);line(0,0,0,-103,'#76553d',8);line(-2,-5,-2,-98,'#c19b6d',2);ellipse(0,5,15,9,'#966c47');ellipse(0,2,12,5,'#d8b081');ctx.restore()}txt(state.done?tr('Ready to serve','可以上桌啦'):tr('Stir the soup','搅拌汤锅')+' '+Math.round(stir*100)+'%',400,548,14,'#fff0d1')}}
 if(activity==='claw'&&arcadeFeedback&&t-arcadeFeedback.at<2){let f=Math.min(1,(t-arcadeFeedback.at)*3);ctx.save();ctx.translate(400,566);ctx.scale(f,f);if(arcadeFeedback.grab>=0){ellipse(0,14,32,8,'#402d2d55');cat(0,7,arcadeFeedback.grab,false,1.15);txt(tr('Your new plush!','新玩偶到手！'),0,30,14,'#fff0d1')}else{txt(tr('So close. Try another angle!','差一点！换个角度吧。'),0,0,15,'#fff0d1')}ctx.restore()}
 if(activity==='fish'&&state.fish){let f=(t*1.3)%1;ctx.strokeStyle='#e3f5e3aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(468,466,8+f*36,3+f*11,0,0,TAU);ctx.stroke();if(state.castAnimAt&&t-state.castAnimAt<.5){let f=Math.min(1,(t-state.castAnimAt)*2);ellipse(405+63*f,345+118*f-30*Math.sin(f*Math.PI),5,8,'#edb47f')}}
 if(activity==='pet'&&drag?.id==='pet'){let x=drag.x,y=drag.y;if(t-streetStirAmount>.13){streetStirAmount=t;streetBurst(x,y,2,'#efd1a2')}}
 streetSparks=streetSparks.filter(p=>t-p.at<1.05);for(let p of streetSparks){let dt=Math.max(0,t-p.at);ctx.globalAlpha=Math.max(0,1-dt);ellipse(p.x+p.vx*dt,p.y+p.vy*dt+40*dt*dt,2.2,2.2,p.color)}ctx.restore()
};

/* Ambient village atmosphere. Local daylight, fictional weather, no gameplay penalties. */
let atmosphereLast=-Infinity,atmosphere={hour:12,weather:'clear',season:11};
function refreshAtmosphere(){if(t-atmosphereLast<30)return;atmosphereLast=t;let parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Singapore',hour:'2-digit',hourCycle:'h23',month:'numeric',day:'numeric'}).formatToParts(new Date());let get=k=>Number(parts.find(v=>v.type===k)?.value||0);let hour=get('hour'),month=get('month'),date=get('day');let roll=hash(day()+'sky'+Math.floor(hour/3))%10;atmosphere={hour,season:month,weather:roll<2?'rain':roll<4?'mist':'clear'};}
const atmosphereReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function villageAtmosphere(){refreshAtmosphere();let h=atmosphere.hour,w=1000,height=isRoute()?routeHeight:600,night=h>=19||h<6,dusk=h>=17&&h<19,dawn=h>=6&&h<8;ctx.save();if(night||dusk||dawn){let light=ctx.createLinearGradient(0,0,0,height);light.addColorStop(0,night?'#2238554d':dusk?'#b36b452f':'#e8ac5626');light.addColorStop(1,night?'#20394b29':'#d5ad6c10');ctx.fillStyle=light;ctx.fillRect(0,0,w,height)}
 if(atmosphere.weather==='mist'){let fog=ctx.createLinearGradient(0,0,0,height);fog.addColorStop(0,'#e9e5d938');fog.addColorStop(.55,'#e0e6d710');fog.addColorStop(1,'#eff0e61a');ctx.fillStyle=fog;ctx.fillRect(0,0,w,height)}
 if(!atmosphereReduced){let drift=atmosphere.weather==='rain';if(drift){ctx.strokeStyle='#e1ebea66';ctx.lineWidth=1.2;for(let i=0;i<78;i++){let x=((i*113-t*35)%w+w)%w,y=((i*97+t*310)%height+height)%height;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+23);ctx.stroke()}for(let i=0;i<8;i++){let f=(t*.8+i*.17)%1,x=310+(i*71)%370,y=height-45-(i*83)%(height*.55);ctx.strokeStyle='rgba(225,240,230,'+(.35*(1-f))+')';ctx.beginPath();ctx.ellipse(x,y,3+f*18,1+f*5,0,0,TAU);ctx.stroke()}}else if(night){for(let i=0;i<27;i++){let x=60+(i*131)%880+Math.sin(t*.5+i)*12,y=140+(i*83)%(height-160)+Math.sin(t*.8+i)*9;ctx.globalAlpha=.35+.28*Math.sin(t*1.6+i);ellipse(x,y,2.2,2.2,'#f6e8a5')}}else{for(let i=0;i<13;i++){let x=((i*97+t*14)%w+w)%w,y=80+(i*73)%(height-90)+Math.sin(t*.7+i)*13;ctx.globalAlpha=.45;petal(x,y,3+i%3,i)}}}
 ctx.restore()
}
const atmosphereMapBefore=drawMap;drawMap=function(){atmosphereMapBefore();villageAtmosphere()};
const atmosphereRoomBefore=drawRoom;drawRoom=function(){atmosphereRoomBefore();if(!atmosphereReduced){ctx.save();for(let i=0;i<9;i++){let x=190+(i*67)%430+Math.sin(t*.6+i)*6,y=220+(i*37)%155;ctx.globalAlpha=.18+.13*Math.sin(t+i);ellipse(x,y,1.8,1.8,'#ffe4ac')}ctx.restore()}};
const weatherIndicator=document.createElement('span');weatherIndicator.id='weatherIndicator';weatherIndicator.style.cssText='display:block;font:10px system-ui;opacity:.9;letter-spacing:.03em;margin-top:2px';let lastSkyLabel='';function atmosphereHUD(){if(!$('location'))return;refreshAtmosphere();let h=atmosphere.hour,label=atmosphere.weather==='rain'?tr('Passing shower','阵雨'):atmosphere.weather==='mist'?tr('Gentle mist','薄雾'):h>=19||h<6?tr('Starlit evening','星夜'):tr('Clear skies','晴空');if(!room&&!activity&&proposal.hidden){if(weatherIndicator.parentNode!==$('location'))$('location').append(weatherIndicator);if(label!==lastSkyLabel){weatherIndicator.textContent=label;lastSkyLabel=label}}else if(weatherIndicator.parentNode)weatherIndicator.remove();setTimeout(atmosphereHUD,500)}
setTimeout(atmosphereHUD,0);

/* Original procedural ambience; no external audio or autoplay before interaction. */
let ambientBus=null,ambientNoise=null,ambientFilter=null,ambientGain=null,ambientTimer=null,ambientNext=0,ambientStep=0,ambientKey='',ambientUnlocked=false,ambientLastFoot=0;
const ambientProfiles={fortune:{notes:[220,261.63,293.66,329.63,392],cutoff:480,noise:.012},home:{notes:[196,246.94,293.66,329.63,392],cutoff:340,noise:.008},island:{notes:[261.63,293.66,349.23,392,440],cutoff:720,noise:.019},wonder:{notes:[220,261.63,329.63,349.23,440],cutoff:560,noise:.011}};
function ambientContext(){if(muted||!ambientUnlocked)return false;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});if(!ambientBus){ambientBus=audio.createGain();ambientBus.gain.value=.0001;ambientBus.connect(audio.destination);let n=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate),d=n.getChannelData(0),v=0;for(let i=0;i<d.length;i++){v=(v+Math.random()*.04-.02)/1.02;d[i]=v*3}ambientNoise=audio.createBufferSource();ambientNoise.buffer=n;ambientNoise.loop=true;ambientFilter=audio.createBiquadFilter();ambientFilter.type='lowpass';ambientFilter.frequency.value=500;ambientGain=audio.createGain();ambientGain.gain.value=.008;ambientNoise.connect(ambientFilter).connect(ambientGain).connect(ambientBus);ambientNoise.start()}return true}catch(e){return false}}
function ambientTone(f,vol=.018,dur=1.4,type='sine',when=0){if(!ambientBus||!audio||audio.state!=='running'||muted)return;let now=audio.currentTime+when,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),now+.045);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g).connect(ambientBus);o.start(now);o.stop(now+dur+.02)}
function ambientTick(){if(!ambientBus||!audio)return;if(muted||document.hidden){ambientBus.gain.setTargetAtTime(.0001,audio.currentTime,.12);return}ambientBus.gain.setTargetAtTime(.42,audio.currentTime,.4);let profile=ambientProfiles[scene]||ambientProfiles.fortune,key=scene+':'+(room||'outdoor');if(key!==ambientKey){ambientKey=key;ambientStep=0;ambientNext=audio.currentTime+.3}let rainy=!room&&atmosphere.weather==='rain';ambientFilter.frequency.setTargetAtTime(rainy?1050:room?240:profile.cutoff,audio.currentTime,.8);ambientGain.gain.setTargetAtTime(rainy?.045:room?.005:profile.noise,audio.currentTime,.8);if(audio.state!=='running'||audio.currentTime<ambientNext)return;let seq=[0,2,1,4,2,3,0,1],note=profile.notes[seq[ambientStep%seq.length]];ambientTone(note,.026,2.1,'sine');if(ambientStep%4===0)ambientTone(profile.notes[0]/2,.015,3.1,'sine');ambientStep++;ambientNext=audio.currentTime+(room?2.2:1.65)}
function ambientUnlock(){if(muted)return;ambientUnlocked=true;if(ambientContext()){if(!ambientTimer)ambientTimer=setInterval(ambientTick,250);ambientTick()}}
document.addEventListener('pointerdown',ambientUnlock,{passive:true});document.addEventListener('keydown',ambientUnlock);
const ambientMuteBefore=$('mute').onclick;$('mute').onclick=function(e){ambientMuteBefore.call(this,e);if(muted){if(ambientBus&&audio)ambientBus.gain.setTargetAtTime(.0001,audio.currentTime,.03)}else ambientUnlock()};
document.addEventListener('visibilitychange',()=>{if(ambientBus)ambientTick()});
const ambientSoundBefore=sound;sound=function(f=420){if(muted)return;/* keep the game's existing short cues, softened where procedural audio is available */if(!ambientBus||!audio||audio.state!=='running')return ambientSoundBefore(f);ambientTone(Math.max(100,Math.min(1200,f)),.045,.16,'sine');if(f>=620)ambientTone(f*1.25,.014,.32,'sine',.065)};
const ambientDrawBefore=drawMap;drawMap=function(){ambientDrawBefore();if(ambientBus&&!muted&&!room&&p.walk&&t-ambientLastFoot>.34){ambientLastFoot=t;ambientTone(85+Math.random()*24,.016,.09,'triangle')}};
const ambientReactBefore=react;react=function(en,cn){ambientReactBefore(en,cn);if(muted||!ambientBus)return;if(activity==='cook'){ambientTone(130,.02,.18,'triangle');ambientTone(250,.012,.25,'sine',.08)}else if(activity==='fish'){ambientTone(180,.02,.3,'sine');ambientTone(270,.015,.28,'sine',.1)}else if(activity==='pet'){ambientTone(105,.022,.55,'sine')}else if(activity==='moon'||activity==='sticks'){ambientTone(350,.025,.12,'triangle',.03)}};

/* A playful fictional paper-villain ritual, with no real-person targets. */
let stressTarget=0,stressSwingAt=-10,stressSide=1,stressCombo=0,stressLast=-10,stressPieces=[],stressTool=0;
const stressTargets=[['Unnecessary meetings','无效会议'],['Monday blues','周一综合征'],['Endless emails','回不完的邮件'],['Overthinking','想太多']];
const stressStartBefore=start;start=function(a){stressStartBefore(a);if(a==='hit'){stressSwingAt=-10;stressLast=-10;stressCombo=0;stressPieces=[];hint('Tap the paper figure or press WHACK! No actual colleagues were harmed.','点击纸人，或按「打走烦恼」。同事们毫发无伤。')}};
const stressSmackBefore=smack;smack=function(){if(activity!=='hit')return;stressCombo=t-stressLast<.65?stressCombo+1:1;stressLast=t;stressSwingAt=t;stressSide*=-1;stressSmackBefore();for(let i=0;i<7;i++)stressPieces.push({at:t,x:400+(Math.random()-.5)*55,y:465+(Math.random()-.5)*65,vx:(Math.random()-.5)*140,vy:-30-Math.random()*80,angle:Math.random()*TAU});if(stressPieces.length>70)stressPieces.splice(0,stressPieces.length-70);if(ambientBus&&!muted)ambientTone(100,.035,.13,'triangle');if(stressCombo===5)react('Even the paper wants annual leave.','纸人都想请年假了。');if(state.count===25)addItem('Certified worry shredder','认证烦恼粉碎机')};
function stressSlipper(x,y,angle){ctx.save();ctx.translate(x,y);ctx.rotate(angle);let g=ctx.createLinearGradient(-20,0,22,0);g.addColorStop(0,stressTool?'#8b6541':'#a65d58');g.addColorStop(.5,stressTool?'#d3a976':'#d7a18a');g.addColorStop(1,stressTool?'#916b47':'#98544e');ctx.beginPath();ctx.moveTo(-16,41);ctx.bezierCurveTo(-28,10,-27,-44,-9,-50);ctx.bezierCurveTo(15,-56,26,-29,22,4);ctx.quadraticCurveTo(18,47,-16,41);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#684b39';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#f0d0a4';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-20,-16);ctx.quadraticCurveTo(0,-4,20,-16);ctx.stroke();ctx.restore()}
const stressDrawBefore=drawActivity;drawActivity=function(){if(activity!=='hit')return stressDrawBefore();ctx.save();paintLivingBackdrop(room==='fish'?pics.fish:(pics.office||pics.tea));let b=livingBounds(),g=ctx.createLinearGradient(0,280,0,700);g.addColorStop(0,'#372e2820');g.addColorStop(1,'#3b2927ae');shadeLivingBackdrop(g);if(room==='fish')riverAuntie(400,385,.82);else human(400,377,0,false,1,1.55);let wood=ctx.createLinearGradient(0,390,0,700);wood.addColorStop(0,'#b99067');wood.addColorStop(1,'#76513d');ctx.fillStyle=wood;ctx.beginPath();ctx.moveTo(215,390);ctx.lineTo(585,390);ctx.lineTo(790,1600);ctx.lineTo(10,1600);ctx.closePath();ctx.fill();for(let j=0;j<14;j++)line(185,408+j*20,615,410+j*20,'#dfb98a33',1);
 txt(tr('Paper Worry Ritual','打小烦恼'),400,258,23,'#fff0d2');
 let f=Math.max(0,Math.min(1,(t-stressSwingAt)/.46)),impact=(1-f)*Math.sin(f*13);ctx.save();ctx.translate(400,491);ctx.rotate(impact*.48*stressSide);ctx.translate(impact*13,0);let paper=ctx.createLinearGradient(-50,-80,50,75);paper.addColorStop(0,'#f2d7a5');paper.addColorStop(1,'#d5b17b');ctx.fillStyle=paper;ctx.beginPath();ctx.moveTo(-25,-68);ctx.lineTo(25,-68);ctx.lineTo(31,-28);ctx.lineTo(62,-13);ctx.lineTo(47,15);ctx.lineTo(27,5);ctx.lineTo(23,66);ctx.lineTo(1,56);ctx.lineTo(-23,66);ctx.lineTo(-27,5);ctx.lineTo(-47,15);ctx.lineTo(-62,-13);ctx.lineTo(-31,-28);ctx.closePath();ctx.fill();ctx.strokeStyle='#a27a4b';ctx.stroke();line(-16,-45,-4,-40,'#78543c',2);line(16,-45,4,-40,'#78543c',2);line(-8,-28,8,-28,'#78543c',2);wonderSceneText(tr(...stressTargets[stressTarget]),0,-9,55,11,'#86563b',4);ctx.restore();
 let swing=Math.sin(Math.min(1,f)*Math.PI);if(room==='fish'){const wrist=drawRitualPose(491,554,1.38,{reach:{x:498-60*swing,y:497-22*swing},bow:.18*swing});stressSlipper(wrist.x-8*swing,wrist.y-8,.45-1.55*swing)}else stressSlipper(520-108*swing,511-45*swing,.3-1.4*swing);target(310,392,180,178,()=>{},'hit');target(474,433,90,120,()=>{},'hit');
 stressPieces=stressPieces.filter(v=>t-v.at<.65);for(let v of stressPieces){let d=t-v.at;ctx.save();ctx.globalAlpha=1-d/.65;ctx.translate(v.x+v.vx*d,v.y+v.vy*d+100*d*d);ctx.rotate(v.angle+d*4);ctx.fillStyle='#f0d8a3';ctx.fillRect(-3,-2,6,4);ctx.restore()}
 txt(tr('Worries released: ','烦恼已打走：')+state.count,400,568,15,'#fff0d4');label(tr('WHACK!','打走烦恼！'),400,603,()=>smack());label(tr('Change worry','换个烦恼'),302,642,()=>{stressTarget=(stressTarget+1)%stressTargets.length;stressCombo=0;sound(430)});label(tr('Change slipper','换只拖鞋'),500,642,()=>{stressTool=1-stressTool;sound(430)});ctx.restore()
};

const movementHelpStyle=document.createElement('style');
movementHelpStyle.textContent='#walkHelp{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:calc(90px + env(safe-area-inset-bottom,0px));z-index:5;border:1px solid #c3ad80;background:#31483ddd;color:#fff4d5;border-radius:50%;width:44px;height:44px;font:22px Georgia;box-shadow:0 3px 10px #172a2540}#walkHelp[hidden]{display:none!important}#movePad button{touch-action:none;user-select:none;-webkit-user-select:none}#movePad button:active{background:#e7d4a8;color:#334a3c}';
document.head.append(movementHelpStyle);
const walkHelp=element('button','?',document.body);walkHelp.id='walkHelp';walkHelp.hidden=true;
walkHelp.onclick=()=>{guideDismissed=false;guideStage=0;guideOrigin=null;guideTarget=null;guideStartedAt=0;save('movementTutorialDone',false)};
function releaseWalkKeys(){for(const key of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'])keys[key]=false}
window.addEventListener('blur',releaseWalkKeys);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseWalkKeys()});
let walkWasVisible=false;
function walkHelpTick(){const visible=proposal.hidden&&avatar!==null&&!room&&!transitioning&&$('page').style.display!=='block'&&valleyRevealAt<0&&isRoute();walkHelp.hidden=!visible||!guideDismissed;walkHelp.setAttribute('aria-label',tr('Show walking instructions','查看行走指南'));if(walkWasVisible&&!visible)releaseWalkKeys();walkWasVisible=visible;setTimeout(walkHelpTick,200)}
walkHelpTick();

function keepsakeClue(item){const clues={'Observatory destiny scroll':['Visit the observatory','到星月观去看看'],'Three-card reading':['Turn the cards in the reading house','到占卜小屋翻牌'],'Heaven’s approval':['Try the wooden moon blocks','试试掷筊'],'Wishing lantern':['Leave a wish in the garden','在花园留下一份心愿'],'Cat friendship':['Spend time with a valley cat','陪山谷的小猫玩一会儿'],'Soul Cat keepsake':['Discover your Soul Cat in Wonder Valley','到奇遇谷寻找你的猫灵']};return clues[item[0]]||['Explore to unlock','探索解锁']}
function keepsakeStory(item){const stories={'Observatory destiny scroll':['A little reminder that your future is still yours to write.','未来的故事，仍由你自己书写。'],'Three-card reading':['A memory of the cards you turned and the questions you carried.','记下那天翻过的牌，还有心里的疑问。'],'Heaven’s approval':['Even the wooden moon blocks decided to give you a break.','连筊杯都决定让你松一口气。'],'Wishing lantern':['Somewhere in the valley, a little light carries your wish.','山谷的某盏小灯，藏着你的心愿。'],'Cat friendship':['You earned a cat’s trust. More impressive than getting a reply from HR.','你赢得了猫咪的信任，比等到人事部回信还难得。'],'Soul Cat keepsake':['A small portrait of the way you see the world.','一幅小小的画像，记下你眼里的世界。']};return stories[item[0]]||(/^Met /.test(item[0])?['A familiar face from a day away from ordinary life.','平凡日子之外，偶遇的一张熟悉面孔。']:['A small souvenir of the time you spent here.','把在这里度过的时光，收成一份小小的纪念。'])}
const memoryBookStyle=document.createElement('style');memoryBookStyle.textContent='.memoryStory{font:17px/1.65 Georgia,serif;padding:16px;color:inherit}.friendEntry{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:12px 4px;border-bottom:1px dashed #ac8c62}.friendEntry small{font-size:12px;color:#79583d}.albumCard small{line-height:1.4}.albumTabs button[aria-pressed=true]{outline:2px solid #a77a4e;outline-offset:-3px}';document.head.append(memoryBookStyle);

const langChoiceStyle=document.createElement('style');langChoiceStyle.textContent='.languageChoice{display:inline-flex;gap:3px;align-items:center;white-space:nowrap}#proposal .languageChoice button,#small .languageChoice button{min-width:44px;min-height:40px;padding:5px 9px;border:1px solid #b9a77d;background:#34483c;color:#fff0d1;border-radius:6px;font:13px system-ui}#proposal .languageChoice button[aria-pressed=true],#small .languageChoice button[aria-pressed=true]{background:#f1dfb4;color:#304337;font-weight:700}';document.head.append(langChoiceStyle);
const oldLanguageButton=$('language');const languageChoices=element('span','',oldLanguageButton.parentNode,'languageChoice');oldLanguageButton.hidden=true;oldLanguageButton.style.display='none';const languageButtons=[];
for(const [cn,label] of [[false,'EN'],[true,'中文']]){const btn=element('button',label,languageChoices);btn.onclick=()=>{if(Boolean(zh)!==cn)toggleLang();refreshLanguageChoice()};languageButtons.push([cn,btn])}
function refreshLanguageChoice(){for(const [cn,btn] of languageButtons)btn.setAttribute('aria-pressed',String(zh===cn));document.documentElement.lang=zh?'zh':'en'}
const languageHUD=updateHUD;updateHUD=function(){languageHUD();refreshLanguageChoice()};refreshLanguageChoice();

const wishingPoolStyle=document.createElement('style');wishingPoolStyle.textContent='.wishRitual{position:relative;isolation:isolate;min-height:330px;height:min(56vh,480px);overflow:hidden;background:radial-gradient(ellipse at 50% 42%,#527e70,#254d4c 60%,#173e38);border:8px solid #ad9672;border-radius:45% 45% 18% 18% / 24% 24% 12% 12%;box-shadow:inset 0 0 35px #112f2d88;touch-action:none}.wishRitual .v9koi{pointer-events:none}.wishBowl{position:absolute;left:50%;top:39%;width:29%;height:21%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(ellipse,#31564c 0 48%,#a68b58 51%,#e0c69a 62%,#756444 76%);box-shadow:0 8px 15px #163b37aa,inset 0 3px 8px #e8d8b6;pointer-events:none}.wishRitual .ritualCoin{position:absolute;width:52px;height:52px;object-fit:contain;left:50%;top:86%;transform:translate(-50%,-50%);touch-action:none;cursor:grab;z-index:3;filter:drop-shadow(0 5px 5px #142f2a88)}.wishRipple{position:absolute;border:2px solid #d9f1d8;border-radius:50%;width:28px;height:14px;pointer-events:none;animation:wishRippleOut 1s ease-out forwards}.wishRipple.gold{border-color:#ffe2a0;box-shadow:0 0 16px #ffe0a0}.wishMessage{min-height:3em;font:16px/1.5 Georgia,serif}.wishRitual .wishAim{position:absolute;width:8px;height:8px;border-radius:50%;background:#ffedb2;box-shadow:0 0 9px #fff0bb;pointer-events:none}.wishRitual .wishAim[hidden]{display:none}@keyframes wishRippleOut{from{transform:translate(-50%,-50%) scale(.5);opacity:1}to{transform:translate(-50%,-50%) scale(7);opacity:0}}';document.head.append(wishingPoolStyle);
wishPond9=function(){page(tr('The wishing pool','锦鲤许愿池'),tr('Hold a wish in your heart. No need to tell anyone.','在心里默默许个愿，不必告诉任何人。'),q=>{
 const pond=pond9(q);pond.classList.add('wishRitual');const koiLife=animateWishKoi(pond);element('div','',pond,'wishBowl');const aim=element('i','',pond,'wishAim');aim.hidden=true;const coin=element('img','',pond,'ritualCoin');coin.src=art9.coin;coin.alt=tr('Swipe the coin toward the centre bowl','将铜钱向中央许愿碗滑动');coin.draggable=false;
 const powerBar=element('div','',q,'wishPower');const powerFill=element('i','',powerBar);powerBar.setAttribute('aria-label',tr('Throw strength','投币力度'));const message=element('p',tr('Make a wish, then flick the coin. Direction and strength matter.','默默许愿，再滑动铜钱。方向和力度都很重要。'),q,'wishMessage');message.setAttribute('aria-live','polite');
 let busy=false,done=false,misses=0,origin=null;const home=()=>{coin.style.left='50%';coin.style.top='86%';coin.style.opacity='1';coin.style.transform='translate(-50%,-50%)';coin.hidden=false};
 const clampWish=(v,min,max)=>Math.max(min,Math.min(max,v));
 const destination=(dx,dy,ms)=>{const w=pond.clientWidth,h=pond.clientHeight,dist=Math.hypot(dx,dy)/h,velocity=dist/Math.max(.09,ms/1000),power=clampWish(dist*.65+velocity*.24,0,1.15),angle=Math.atan2(dy,dx);return {x:clampWish(50+Math.cos(angle)*power*100*h/w,4,96),y:clampWish(86+Math.sin(angle)*power*100,5,94),power}};
 function throwWish(x,y){if(busy||done)return;busy=true;aim.hidden=true;let hit=Math.pow((x-50)/6.2,2)+Math.pow((y-39)/4.8,2)<=1;let startTime=performance.now();sound(520);const distance=Math.hypot((x-50)*pond.clientWidth/pond.clientHeight,y-86),duration=460+distance*5,arc=8+distance*.26;const rim=!hit&&Math.pow((x-50)/13.8,2)+Math.pow((y-39)/9.6,2)<=1;const landingX=rim?clampWish(x+(x>=50?1:-1)*(8+distance*.045),5,95):x,landingY=rim?clampWish(y+(y>=39?7:-7),5,93):y;let bounced=false;function frame(now){if(!pond.isConnected)return;let f=Math.min(1,(now-startTime)/duration);coin.style.left=(50+(x-50)*f)+'%';coin.style.top=(86+(y-86)*f-arc*Math.sin(Math.PI*f))+'%';coin.style.transform='translate(-50%,-50%) rotateY('+(f*720)+'deg) scale('+(1-.55*f)+')';if(f<1){requestAnimationFrame(frame);return}if(rim&&!bounced){bounced=true;sound(780);const bowl=pond.querySelector('.wishBowl');bowl.animate([{transform:'translate(-50%,-50%) rotate(0deg)'},{transform:'translate(-50%,-50%) rotate(3deg)'},{transform:'translate(-50%,-50%) rotate(-2deg)'},{transform:'translate(-50%,-50%) rotate(0deg)'}],{duration:260});const bounceAt=performance.now();function rebound(at){if(!pond.isConnected)return;const u=Math.min(1,(at-bounceAt)/310);coin.style.left=(x+(landingX-x)*u)+'%';coin.style.top=(y+(landingY-y)*u-7*Math.sin(Math.PI*u))+'%';coin.style.transform='translate(-50%,-50%) rotate('+(u*420)+'deg) scale(.45)';if(u<1)requestAnimationFrame(rebound);else{x=landingX;y=landingY;finish()}}requestAnimationFrame(rebound);return}finish()}function finish(){if(!pond.isConnected)return;coin.hidden=true;const bumped=!hit&&koiLife.collision(x,y);koiLife.splash(x,y,hit,bumped);sound(hit?660:bumped?410:280);wishLanding(pond,x,y,hit,bumped);for(let n=0;n<3;n++){setTimeout(()=>{if(!pond.isConnected)return;let ripple=element('i','',pond,'wishRipple'+(hit?' gold':''));ripple.style.left=x+'%';ripple.style.top=y+'%';setTimeout(()=>ripple.remove(),1100)},n*150)}if(hit){done=true;busy=false;const settled=element('img','',pond,'settledWishCoin');settled.src=art9.coin;settled.alt='';settled.style.left=x+'%';settled.style.top=y+'%';settled.animate([{transform:'translate(-50%,-50%) scale(.9)',opacity:1},{transform:'translate(-50%,-50%) scale(.65)',opacity:.85}],{duration:450,fill:'forwards'});message.textContent=tr('Your coin found the centre. May your wish find its way, too.','铜钱落入碗心。愿你的心愿，也慢慢找到归处。');addItem('Wishing coin','许愿铜钱');again.hidden=false}else{misses++;let lines=[['A little closer. Your wish is still yours.','差一点点，心愿还在。'],['The koi are curious. Try aiming a little higher.','锦鲤都来看热闹了，再往中间瞄一点。'],['Even the koi are cheering for you now. Take your time.','锦鲤都在替你加油了，慢慢来。']];message.textContent=bumped&&bumped.el.classList.contains('golden')?tr('Golden koi: I grant good luck, not refunds.','金锦鲤：我负责好运，不负责退币。'):rim?tr('Clink! The coin bounced off the rim. Even wishes take a little practice.','叮！铜钱碰到碗沿弹出去了。许愿也要练练手。'):bumped?tr(...[['Koi: Excuse me, I am not the wishing bowl!','锦鲤：喂，我不是许愿碗！'],['Koi: Please direct all wishes to the management.','锦鲤：许愿请找池中央，不要找我。'],['Koi: I accept compliments, not flying coins.','锦鲤：我收赞美，不收飞来的铜钱。']][(misses-1)%3]):tr(...(y>48?['A little more strength. Your coin fell short.','再用一点力，铜钱还没飞到碗边。']:y<31?['A little gentler. Your coin flew past the bowl.','轻一点，铜钱飞过头啦。']:lines[Math.min(2,misses-1)]));setTimeout(()=>{if(!pond.isConnected)return;home();busy=false},650)}}requestAnimationFrame(frame)}
 coin.onpointerdown=e=>{if(busy||done)return;e.preventDefault();origin={x:e.clientX,y:e.clientY,at:performance.now()};coin.setPointerCapture(e.pointerId)};
 coin.onpointermove=e=>{if(!origin||busy)return;let v=destination(e.clientX-origin.x,e.clientY-origin.y,performance.now()-origin.at);aim.hidden=true;powerFill.style.width=Math.min(100,v.power*100)+'%'};
 coin.onpointerup=e=>{if(!origin)return;let dx=e.clientX-origin.x,dy=e.clientY-origin.y,elapsed=performance.now()-origin.at;origin=null;aim.hidden=true;if(Math.hypot(dx,dy)<12){message.textContent=tr('Swipe upward to send your coin toward the bowl.','向上滑动铜钱，让它飞向许愿碗。');return}let v=destination(dx,dy,elapsed);powerFill.style.width=Math.min(100,v.power*100)+'%';throwWish(v.x,v.y)};
 coin.onpointercancel=()=>{origin=null;aim.hidden=true};
 let keyboardAim=0,keyboardPower=36;const keyboard=element('details','',q);element('summary',tr('Alternative aiming controls','其他瞄准方式'),keyboard);const controls=element('div','',keyboard,'wishKeyboard');const readout=element('output','',controls);function updateAim(){readout.textContent=tr('Angle ','角度 ')+keyboardAim+'° · '+tr('Power ','力度 ')+keyboardPower+'%';powerFill.style.width=keyboardPower+'%'};for(const [label,fn] of [['←',()=>keyboardAim=Math.max(-45,keyboardAim-5)],['→',()=>keyboardAim=Math.min(45,keyboardAim+5)],['−',()=>keyboardPower=Math.max(10,keyboardPower-4)],['+',()=>keyboardPower=Math.min(90,keyboardPower+4)]])b(controls,label,()=>{fn();updateAim()});b(controls,tr('Throw','投币'),()=>{const a=keyboardAim*Math.PI/180;throwWish(clampWish(50+Math.sin(a)*keyboardPower*pond.clientHeight/pond.clientWidth,4,96),clampWish(86-Math.cos(a)*keyboardPower,5,94))});updateAim();
let again=b(q,tr('Make another wish','再许一个愿'),()=>{done=false;misses=0;koiLife.reset();pond.querySelectorAll('.settledWishCoin').forEach(n=>n.remove());home();again.hidden=true;message.textContent=tr('Hold another wish in your heart, then toss.','再默默许个愿，然后投币。')});again.hidden=true;
 b(q,tr('Hang a private wish','挂心愿牌'),()=>{$('page').style.display='none';start('wishes')});
})};

const koiLifeCSS=document.createElement('style');koiLifeCSS.textContent='.wishRitual .livingKoi{position:absolute;width:19%;height:13%;pointer-events:none;transform-origin:center;z-index:0;filter:drop-shadow(0 4px 4px #102f3066);opacity:.9}.livingKoi img{width:100%;height:100%;object-fit:contain;animation:koiFinMotion 1.2s ease-in-out infinite alternate;transform-origin:50% 50%}.livingKoi.golden img{filter:sepia(.8) saturate(1.8) brightness(1.16)}.wishRitual .waterLight{position:absolute;inset:0;pointer-events:none;z-index:0;background:repeating-linear-gradient(115deg,transparent 0 25px,#d9edd416 29px,transparent 34px 58px);mask-image:radial-gradient(ellipse,#000 20%,transparent 80%);animation:pondLightDrift 11s ease-in-out infinite alternate}.wishRitual .floatingPetal{position:absolute;width:9px;height:5px;border-radius:70% 30% 65% 35%;background:#ead1be;opacity:.8;pointer-events:none}.wishRitual .fishWake{position:absolute;width:24px;height:12px;border:1px solid #cae9d380;border-radius:50%;pointer-events:none;animation:wishRippleOut 1.6s ease-out forwards;z-index:0}@keyframes koiFinMotion{from{transform:scaleY(.92) skewY(-4deg)}to{transform:scaleY(1.06) skewY(4deg)}}@keyframes pondLightDrift{to{transform:translate(8%,4%) rotate(7deg);opacity:.55}}@media(prefers-reduced-motion:reduce){.livingKoi img,.wishRitual .waterLight{animation:none}}';document.head.append(koiLifeCSS);
function animateWishKoi(pond){
 pond.querySelectorAll('.v9koi').forEach(n=>n.remove());element('div','',pond,'waterLight');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fish=[];let event=null,last=performance.now(),wake=last;
 const count=Math.random()<.12?4:3;
 for(let k=0;k<count;k++){const el=element('div','',pond,'livingKoi'+(k===3?' golden':''));const im=element('img','',el);im.src=art9.koi;im.alt='';im.style.animationDelay=(-k*.4)+'s';const angle=k*2*Math.PI/count;fish.push({el,x:50+Math.cos(angle)*29,y:43+Math.sin(angle)*24,angle,heading:angle*180/Math.PI+90,speed:.36+k*.045})}
 const petals=Array.from({length:5},(_,k)=>({el:element('i','',pond,'floatingPetal'),x:15+k*17,y:15+(k*29)%64,phase:k*1.9}));
 function tick(now){if(!pond.isConnected)return;if($('page').style.display==='none'){last=now;requestAnimationFrame(tick);return}const dt=Math.min(.06,Math.max(0,(now-last)/1000));last=now;const age=event?(now-event.at)/1000:0;const active=event&&age<4.5;for(let k=0;k<fish.length;k++){const f=fish[k];let prevX=f.x,prevY=f.y;f.angle+=dt*f.speed*(reduce?.35:1);let gx=50+Math.cos(f.angle)*31,gy=45+Math.sin(f.angle)*27;if(active){if(event.hit&&age>.7){gx=50+Math.cos(f.angle+k*.22)*20;gy=39+Math.sin(f.angle+k*.22)*16}else if(!event.hit&&age<1.5){const dx=f.x-event.x,dy=f.y-event.y,dist=Math.max(1,Math.hypot(dx,dy));if(dist<42){gx=f.x+dx/dist*24;gy=f.y+dy/dist*24}}}const ease=Math.min(1,dt*(active&&!event.hit&&age<1.5?3:1.4));f.x=Math.max(9,Math.min(91,f.x+(gx-f.x)*ease));f.y=Math.max(12,Math.min(77,f.y+(gy-f.y)*ease));const dx=f.x-prevX,dy=f.y-prevY;if(Math.hypot(dx,dy)>.001){const desired=Math.atan2(dy*pond.clientHeight,dx*pond.clientWidth)*180/Math.PI;const delta=((desired-f.heading+540)%360)-180;f.heading+=delta*Math.min(1,dt*5)}f.el.style.left=f.x+'%';f.el.style.top=f.y+'%';f.el.style.transform='translate(-50%,-50%) rotate('+f.heading+'deg)';}
 if(!reduce&&now-wake>1700){wake=now;const f=fish[Math.floor(now/1700)%fish.length];const ripple=element('i','',pond,'fishWake');ripple.style.left=f.x+'%';ripple.style.top=f.y+'%';setTimeout(()=>ripple.remove(),1650)}
 for(const petal of petals){if(!reduce){petal.x+=dt*.5;petal.y+=dt*Math.sin(now/4000+petal.phase)*.2;if(petal.x>90)petal.x=10}petal.el.style.left=petal.x+'%';petal.el.style.top=petal.y+'%';petal.el.style.transform='rotate('+(Math.sin(now/3200+petal.phase)*35)+'deg)'}
 requestAnimationFrame(tick)}
 requestAnimationFrame(tick);return {collision(x,y){return fish.find(f=>Math.pow((f.x-x)/8,2)+Math.pow((f.y-y)/5,2)<1)||null},splash(x,y,hit,bumped){event={x,y,hit,at:performance.now()};if(bumped){bumped.el.animate([{opacity:1,filter:'brightness(1.7)'},{opacity:.7,filter:'brightness(1)'}],{duration:500});}},reset(){event=null}};
}

const wishImpactCSS=document.createElement('style');wishImpactCSS.textContent='.wishPower{height:8px;border-radius:6px;background:#28433d55;overflow:hidden;margin:12px 0 4px}.wishPower i{display:block;width:0;height:100%;background:linear-gradient(90deg,#afc6a0,#e8c57d,#bd7156);transition:width .08s}.wishImpact{position:absolute;z-index:2;width:7px;height:12px;background:#e2f4df;border-radius:70%;pointer-events:none;transform:translate(-50%,-50%)}.wishImpact.gold{background:#ffe4a1;box-shadow:0 0 12px #ffdb86}.wishImpact.fish{background:#fff4dd}';document.head.append(wishImpactCSS);
function wishLanding(pond,x,y,hit,bumped){for(let k=0;k<12;k++){const drop=element('i','',pond,'wishImpact'+(hit?' gold':bumped?' fish':''));drop.style.left=x+'%';drop.style.top=y+'%';const angle=k*Math.PI*2/12,dx=Math.cos(angle)*(18+k%3*8),dy=Math.sin(angle)*17;const anim=drop.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:'translate('+dx+'px,'+(dy-30)+'px) scale(1)',opacity:1,offset:.4},{transform:'translate('+(dx*1.6)+'px,'+(dy+10)+'px) scale(.25)',opacity:0}],{duration:650+k%4*50,easing:'ease-out'});anim.onfinish=()=>drop.remove()}}

/* Quiet, contextual feedback for repeated activities, without adding another task or timer. */
const ritualExperienceStart=start;
start=function(a){ritualExperienceStart(a);if(a==='fish')hint('Cast your line, watch the float, and reel in when it dips. No rush.','抛下鱼线，看看浮标，等它沉下去再收线。不用赶。');if(a==='cook')hint('Choose a few ingredients, drop them in the pot and stir slowly.','挑几样食材放进锅里，慢慢搅拌。');if(a==='pet')hint('Gently stroke the cat. Let it decide when it trusts you.','轻轻摸摸小猫，让它慢慢熟悉你。')};
const ritualExperienceFish=doFish;
doFish=function(){if(activity!=='fish')return ritualExperienceFish();const before=state.fish;ritualExperienceFish();if(before===0&&state.fish===1)hint('The float is on the water. Enjoy the quiet.','浮标已经入水，安静等一会儿吧。');else if(before===2&&state.fish===0)hint('A little discovery from the water. Cast again whenever you like.','水里捞起一份小惊喜。想钓就再抛一竿。')};
const quietGardenStyle=document.createElement('style');quietGardenStyle.textContent='.wishPower:before{content:"";display:block;position:absolute;left:36%;width:2px;height:8px;background:#fff0cb99}.wishPower{position:relative}.wishRitual .wishBowl{box-shadow:0 8px 15px #163b37aa,inset 0 3px 8px #e8d8b6}.wishMessage{overflow-wrap:anywhere}';document.head.append(quietGardenStyle);

/* Small screen polish: keep scrollable forms and the scene controls usable. */
const compactGameStyle=document.createElement('style');compactGameStyle.textContent='@media(max-width:480px){#proposal header>span{font-size:10px;letter-spacing:.07em}#proposal .languageChoice{flex-shrink:0}#proposal .rail-ticket{box-sizing:border-box;width:94%;padding:14px;gap:9px}#proposal .rail-ticket input,#content input,#content textarea,#content select{font-size:16px!important}#content .albumCard{min-width:0}#content .albumCard strong{overflow-wrap:anywhere}#content .wishRitual{box-sizing:border-box;min-height:250px;height:clamp(250px,45dvh,420px)}#content .wishMessage{font-size:15px}#content .wishRitual .ritualCoin{width:48px;height:48px}#content .astroForm{min-width:0}#content .astroForm input,#content .astroForm select{max-width:100%;min-width:0;box-sizing:border-box}}@media(max-height:650px){#proposal footer{gap:5px}#proposal footer p{font-size:13px}#proposal h1{font-size:clamp(23px,6vw,38px)}#proposal .actions{gap:5px}#proposal .rail-ticket{gap:7px;padding:12px}}';
document.head.append(compactGameStyle);
const priorKoiPage=wishPond9;wishPond9=function(){priorKoiPage();const pond=$('content').querySelector('.wishRitual');if(pond){pond.setAttribute('aria-label',tr('Wishing pool with a small bowl in the centre','中央有许愿碗的锦鲤池'));const power=$('content').querySelector('.wishPower');if(power){const guide=element('small',tr('Short flick = short throw. A stronger flick travels farther.','轻滑投得近，用力滑投得远。'),$('content'));power.before(guide)}}};

/* Make the wishing ritual accessible without bypassing its aiming challenge. */
const wishKeyboardStyle=document.createElement('style');wishKeyboardStyle.textContent='.wishKeyboard{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:8px 0}.wishKeyboard button{min-height:44px;min-width:44px}.wishKeyboard output{font:13px system-ui;min-width:110px;text-align:center}';document.head.append(wishKeyboardStyle);

function cameoHeart(n,count){let stories=[['I escaped a meeting that could have been an email. I am celebrating with tea.','我逃过了一场本来可以发邮件解决的会议，正在喝茶庆祝。'],['I came here to make a wish. I think I forgot how to rest without feeling guilty.','我来这里许愿，好像已经忘了怎么毫无负担地休息。'],['The best part of today is that nobody asked me for a status update.','今天最开心的是没人催我汇报进度。'],['I am practising the art of doing absolutely nothing. Progress is excellent.','我正在练习什么都不做的艺术，进展非常好。']];let v=stories[(n.cameo+count-1)%stories.length];if(count>=3&&Math.random()<.28)v=trShareStory(n);say(tr(...n.n),tr(...v),[[tr('Stay and chat','陪你聊一会儿'),()=>{let k=n.n[0];let shared=load('cameoSharedV1',{});if(!shared||typeof shared!=='object')shared={};shared[k]=(shared[k]||0)+1;save('cameoSharedV1',shared);say(tr(...n.n),tr('That was nice. No agenda, no minutes to write. Come find me again.','真舒服。不用议程，也不用写会议记录。下次再来找我。'),[[tr('See you soon','下次见'),closeTalk]]);if(shared[k]===3)addItem('Tea with '+k,'和'+n.n[1]+'喝茶的回忆');if(shared[k]===5)addItem('A letter from '+k,'来自'+n.n[1]+'的信')}],[tr('Enjoy your break','好好休息'),closeTalk]])}

const wishPhysicsStyle=document.createElement('style');wishPhysicsStyle.textContent='.settledWishCoin{position:absolute;width:23px;height:23px;object-fit:contain;pointer-events:none;z-index:2;filter:drop-shadow(0 2px 2px #172d26aa);transform:translate(-50%,-50%) scale(.65)}';document.head.append(wishPhysicsStyle);

/* Gesture-sensitive activities and optional memories. */
let friendFavourites=load('friendFavouritesV1',[]);if(!Array.isArray(friendFavourites))friendFavourites=[];
function trShareStory(n){return [
 ['I left a little note inside my old train ticket. It says: you are allowed to have a good day for no reason.','我在旧车票里夹了一张纸条：没有任何理由，也可以开心一天。'],
 ['One night I saw a golden koi. I wished for fewer emails. The koi looked deeply offended.','有晚看见金锦鲤，我许愿少收邮件。它看起来相当不满。'],
 ['The last train once stopped for a cat sleeping on the platform. Nobody complained. That is my kind of town.','有次末班车为了站台上睡觉的猫停了一会儿，居然没人投诉。我就喜欢这样的小镇。'],
 ['Someone left an empty seat for me at the tea shop. I still remember how that felt.','有人曾在茶馆给我留了一个空位。那种感觉，我到现在还记得。']
 ][n.cameo%4]}
function kitchenActualRecipe(){let i=state.ingredients||[],veg=state.vegetarian;if(veg)return i.includes(0)&&i.includes(2)?['Mushroom and tofu soup','香菇豆腐汤']:i.includes(1)?['Garden greens soup','田园青菜汤']:['Simple vegetarian broth','清淡素汤'];if(i.includes(0)&&i.includes(2))return ['Tomato and egg soup','番茄蛋汤'];if(i.includes(0)&&i.includes(1))return ['Tomato and greens soup','番茄青菜汤'];return i.includes(2)?['Silky egg soup','滑蛋汤']:i.includes(1)?['Garden greens soup','田园青菜汤']:['Slow cooked tomato soup','慢炖番茄汤']}
const deeperPot=pot;pot=function(x,y){deeperPot(x,y);if(activity!=='cook'||!state.ingredients?.length)return;ctx.save();ctx.beginPath();ctx.ellipse(x,y-10,77,20,0,0,TAU);ctx.clip();let energy=Math.max(0,1-(t-(state.stirAt||-10))*1.3),rotation=(state.stirAngle||0)+t*.12+energy*t*.22;for(let i of state.ingredients){for(let j=0;j<3;j++){let angle=i*2.1+j*.7+rotation;ctx.save();ctx.translate(x+Math.cos(angle)*54,y-10+Math.sin(angle)*12);ctx.rotate(angle);round(-7,-3,14,6,2,(state.vegetarian?['#947256','#92ad69','#eee0b4']:['#cf7956','#92ad69','#f0dd99'])[i]);ctx.restore()}}ctx.restore()};
const deeperStart=start;start=function(a){deeperStart(a);if(a==='cook')hint('Drop your favourite ingredients in the pot. Stir in gentle circles.','选喜欢的食材下锅，再轻轻画圈搅拌。');if(a==='pet'){state.petKind=Math.floor(Math.random()*5);hint('Slow strokes help the cat trust you. Fast swipes may startle it.','慢慢摸，小猫会更信任你。太快可能会吓到它。')}};
const deeperDraw=drawActivity;drawActivity=function(){deeperDraw();if(activity==='pet'){ctx.save();let f=Math.min(1,(state.pet||0)/100);txt(state.done?tr('You have been adopted.','你已经被猫领养啦。'):state.petAlarmUntil>t?tr('A little slower, please.','请摸慢一点嘛。'):tr('Trust','信任')+' '+Math.round(f*100)+'%',400,623,15,'#fff1d0');ctx.restore()}};
const deeperFish=doFish;doFish=function(){let before=state?.fish;deeperFish();if(activity==='fish'&&before===2&&state.fish===0){let g=state.catchName;if(g?.[0]==='Moonlit postcard')hint('A rare postcard! Someone wrote a wish on the back.','稀有明信片！背面有人写了一份心愿。');else if(g?.[0]==='Sealed train ticket')hint('An old ticket to a place that no longer appears on maps.','一张旧车票，目的地早已从地图上消失。')}};

/* Temple visit: quiet, optional gestures in the existing illustrated room. */
activityTitle.prayer=['A moment at the altar','静心祈愿'];
roomActions.temple=[['sticks','Draw a fortune','求签'],['prayer','Offer a quiet prayer','静心祈愿'],['moon','Ask with moon blocks','掷筊']];
const templePrayerStart=start;start=function(id){templePrayerStart(id);if(id==='prayer'){state.prayerStage='approach';state.prayerAt=t;state.incense=false;state.bows=0;hint('Walk up to the altar. Take a moment for yourself.','走到香案前，给自己一点安静的时间。')}};
function templeIncense(x,y,lit){ctx.save();ellipse(x,y+15,39,9,'#35292366');let g=ctx.createLinearGradient(x-32,y,x+32,y);g.addColorStop(0,'#72533d');g.addColorStop(.45,'#b99a60');g.addColorStop(1,'#72533d');ctx.beginPath();ctx.moveTo(x-34,y-8);ctx.quadraticCurveTo(x-34,y+25,x,y+25);ctx.quadraticCurveTo(x+34,y+25,x+34,y-8);ctx.fillStyle=g;ctx.fill();ellipse(x,y-8,34,9,'#b8a27c');ellipse(x,y-7,27,5,'#7d6b50');for(let i=-1;i<=1;i++){line(x+i*8,y-9,x+i*12,y-65+(i%2)*6,'#8d493b',2.8);if(lit){ellipse(x+i*12,y-65+(i%2)*6,2.5,2.5,'#f7aa60');for(let j=0;j<4;j++){let f=(t*.45+j*.25+i*.13+1)%1;ctx.globalAlpha=(1-f)*.24;ellipse(x+i*12+Math.sin(t*1.4+j+i)*f*19,y-68-f*74,3+f*11,4+f*14,'#f3e7cc')}ctx.globalAlpha=1}}ctx.restore()}
function templePrayerFigure(x,y,bow,praying,walking,kneel=0,reach=null){if(walking){backHuman(x,y,avatar??0,true,'right',2.45);return}drawRitualPose(x,y,2.45,{bow,kneel,praying,reach})}
const prayerProp=prop;prop=function(id,x,y){if(id==='prayer'){templeIncense(x,y-32,true);return}return prayerProp(id,x,y)};
function beginQuietBow(){if(activity!=='prayer'||!['ready','complete'].includes(state.prayerStage))return;if(!state.incense){hint('Light the incense first.','先点燃香，再开始祈愿。');return;}state.prayerStage='kneel';state.prayerAt=t;state.bows=0;hint('Hands together. Breathe slowly.','双手合十，慢慢呼吸。');sound(330)}
const prayerDraw=drawActivity;drawActivity=function(){if(activity!=='prayer')return prayerDraw();ctx.save();paintLivingBackdrop(pics.streetTemple||pics.temple||pics.sticks);let b=livingBounds(),shade=ctx.createLinearGradient(0,260,0,760);shade.addColorStop(0,'#493c2820');shade.addColorStop(1,'#2b30276e');shadeLivingBackdrop(shade);
 const g=ctx.createLinearGradient(0,445,0,555);g.addColorStop(0,'#aa815b');g.addColorStop(1,'#654737');ctx.beginPath();ctx.moveTo(435,445);ctx.lineTo(580,445);ctx.lineTo(610,520);ctx.lineTo(410,520);ctx.closePath();ctx.fillStyle=g;ctx.fill();line(423,520,423,571,'#624536',12);line(592,520,592,571,'#624536',12);
 templeIncense(510,455,state.incense);for(let i=0;i<2;i++){let xx=458+i*105;round(xx-4,410,8,34,2,'#e1c290','#8b6e4c');ctx.globalAlpha=.75+.2*Math.sin(t*6+i);ellipse(xx,407,3.5,8,'#f8d18a');ctx.globalAlpha=1}
 ellipse(335,576,75,16,'#5f493c80');round(275,555,118,22,8,'#ae906e','#70543b');line(286,566,383,566,'#dac19b',1.5);
 let elapsed=t-state.prayerAt,stage=state.prayerStage,walk=stage==='approach',bow=0,x=walk?245+Math.min(1,elapsed/1.2)*90:335;if(walk&&elapsed>=1.2){state.prayerStage='ready';state.prayerAt=t;hint('Tap the incense to light it, then tap your character or the mat to bow.','点击香炉上香，再点击角色或蒲团鞠躬。')}
 if(stage==='kneel'&&elapsed>.65){state.prayerStage='bow';state.prayerAt=t}if(stage==='bow'){if(elapsed<3.9){let phase=(elapsed/1.3)%1;bow=Math.sin(Math.PI*phase)**1.6;state.bows=Math.min(3,Math.floor(elapsed/1.3));}else{state.bows=3;state.prayerStage='silent';state.prayerAt=t;hint('Keep your wish to yourself. Take a few quiet breaths.','心愿留在心里，安静地呼吸几次。')}}
 if(stage==='silent'&&elapsed>4){state.prayerStage='rise';state.prayerAt=t}if(stage==='rise'&&elapsed>.72){state.prayerStage='complete';state.prayerAt=t;hint('Take your time. Draw a fortune whenever you are ready.','不用着急，准备好了再去求签。')}
 let kneel=stage==='kneel'?poseEase(elapsed/.65):['bow','silent'].includes(stage)?1:stage==='rise'?1-poseEase(elapsed/.72):0;let lightAge=t-(state.incenseAt??-100),reaching=stage==='ready'&&lightAge<1.05;let f=reaching?Math.sin(Math.PI*clamp(lightAge/1.05,0,1)):0;let reach=reaching?{x:390+55*f,y:455}:null;if(walk){backHuman(x,553,avatar??0,true,'right',1.65)}else{let hand=drawRitualPose(x+32*f,553,1.65,{kneel,bow,praying:['kneel','bow','silent','rise'].includes(stage),reach});if(reaching&&hand&&Number.isFinite(hand.x)&&Number.isFinite(hand.y)){line(hand.x,hand.y,hand.x+12*f,hand.y-42,'#9b6943',2);ellipse(hand.x+12*f,hand.y-42,2,2,'#efb270')}}target(465,355,95,140,lightTempleIncense);target(260,330,150,250,beginQuietBow);
 if(stage==='ready'){label(tr('Light incense','上香'),510,545,lightTempleIncense);label(tr('Bow and pray','合十祈愿'),335,612,beginQuietBow)}else if(stage==='bow'){txt(tr('Bow ','鞠躬 ')+Math.min(3,state.bows+1)+' / 3',400,622,18,'#fff2d5')}else if(stage==='silent'){txt(tr('A quiet moment','片刻静心'),400,622,20,'#fff2d5')}else if(stage==='complete'){label(tr('Draw a fortune','求签'),300,620,()=>start('sticks'));label(tr('Ask with moon blocks','掷筊'),505,620,()=>start('moon'))}
 ctx.restore()};

/* Temple courtyard: every ritual remains in the illustrated scene. */
activityTitle.templeBell=['The bronze bell','山寺钟声'];
activityTitle.templeWater=['Water pavilion','手水亭'];
activityTitle.templePaper=['Fortune paper','展开签文'];
const shrinePaperLines=[
 ['A little patience goes a long way.','耐心一点，自有转机。'],['Good fortune favours a break.','今日宜休息。'],['A new opportunity may appear.','新的机会或许就在前方。'],['Seek a trusted friend.','不妨与可信的人聊聊。'],['Finish one thing before starting another.','先完成一件，再开始下一件。'],['A quiet day can be a good day.','平平淡淡也是福。'],['Be generous without exhausting yourself.','待人慷慨，也别累坏自己。'],['Wait until the path is clear.','路未明时，且慢行。'],['Small efforts add up.','积少成多，水滴石穿。'],['Kind words can open a door.','良言一句，或能开一扇门。'],['Make room for unexpected joy.','给意外的小欢喜留个位置。'],['Do not mistake hurry for progress.','忙碌不一定等于前进。']];
let templeTies=load('templeTiesV1',[]);if(!Array.isArray(templeTies))templeTies=[];
const templeMoreStart=start;start=function(a){templeMoreStart(a);if(a==='templeBell'){state.bellAt=-100;state.bellStrength=0;hint('Pull the wooden striker back, then release.','把木槌向后拉，再松手。')}if(a==='templeWater'){state.waterAt=-100;state.waterStage=0;hint('Drag the bamboo ladle down to the water to fill it.','将竹勺拖入水中舀水。')}if(a==='templePaper'){state.paperAt=-100;state.paperStage='folded';state.paperNumber=1;hint('Tap the folded paper to open it.','点击折叠的签纸，将它展开。')}};
function templePaperOpen(n){start('templePaper');state.paperNumber=Math.max(1,Math.min(12,n||1));}
function templePaperTap(){if(state.paperStage!=='folded')return;state.paperAt=t;state.paperStage='opening';sound(410);hint('Read your fortune, then keep it or leave it here.','慢慢读签文，可以收藏，也可以留在这里。')}
function templePaperKeep(tie){if(state.paperStage!=='open')return;state.paperStage=tie?'tied':'kept';state.paperAt=t;if(tie){templeTies.push(state.paperNumber);templeTies=templeTies.slice(-28);save('templeTiesV1',templeTies);hint('Leave the paper, take the peace.','留下签纸，带走平静。')}else{addItem('Fortune paper '+state.paperNumber,'签文纸 '+state.paperNumber);hint('A little reminder for another day.','把这一份提醒留给以后的自己。')}sound(530)}
function templeBellArt(x,y,sc=1,angle=0){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(angle);let g=ctx.createLinearGradient(-75,0,80,0);g.addColorStop(0,'#554c3b');g.addColorStop(.27,'#8e8562');g.addColorStop(.53,'#b3a378');g.addColorStop(.8,'#71664f');g.addColorStop(1,'#4b493e');round(-12,-104,24,27,7,'#8d805e','#514a38');ctx.beginPath();ctx.moveTo(-29,-80);ctx.bezierCurveTo(-62,-79,-62,-20,-77,35);ctx.quadraticCurveTo(0,55,77,35);ctx.bezierCurveTo(62,-20,62,-79,29,-80);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#4d493b';ctx.lineWidth=3;ctx.stroke();ellipse(0,37,78,13,'#57513e');ellipse(0,35,70,8,'#343a34');for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,-52+j*24,46+j*7,7,0,0,Math.PI);ctx.strokeStyle='#cab88a90';ctx.lineWidth=2;ctx.stroke()}for(let j=0;j<6;j++)ellipse(-36+j*14,-48,3,3,'#c2b28a');ctx.restore()}
function templeLadle(x,y,a=0){ctx.save();ctx.translate(x,y);ctx.rotate(a);line(-68,0,24,0,'#97734b',9);line(-66,-2,22,-2,'#d8bc80',3);ellipse(35,1,23,12,'#8d714b');ellipse(35,-2,21,10,'#d2bc86');ellipse(35,-2,15,6,'#72948c');ctx.restore()}
function templeBasin(x,y){ctx.save();let g=ctx.createLinearGradient(0,y,0,y+85);g.addColorStop(0,'#a9aa91');g.addColorStop(1,'#616d61');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-94,y);ctx.lineTo(x+94,y);ctx.lineTo(x+69,y+65);ctx.quadraticCurveTo(x,y+88,x-69,y+65);ctx.closePath();ctx.fill();ellipse(x,y,96,32,'#a6ad94');ellipse(x,y,82,25,'#526f68');ellipse(x,y,76,20,'#75948b');for(let i=0;i<5;i++){let f=(t*.38+i*.19)%1;ctx.strokeStyle='rgba(227,237,214,'+(1-f)*.55+')';ctx.beginPath();ctx.ellipse(x+22,y,8+f*48,2+f*13,0,0,TAU);ctx.stroke()}ctx.restore()}
function templeRitualBackground(){paintLivingBackdrop(pics.streetTemple||pics.temple||pics.sticks);let g=ctx.createLinearGradient(0,270,0,680);g.addColorStop(0,'#243b3020');g.addColorStop(1,'#26392fa0');shadeLivingBackdrop(g)}
function templeReleaseBell(moved){if(activity!=='templeBell'||t-state.bellAt<1.0)return;state.bellStrength=Math.max(.15,Math.min(1,moved/120));state.bellAt=t;state.bellRung=false;hint('Listen as the sound travels through the valley.','听钟声慢慢传向山谷。')}
function templeReleaseWater(a){if(activity!=='templeWater'||t-state.waterAt<1)return;if(state.waterStage===0){if(a.y>425&&a.y<560){state.waterStage=1;state.waterAt=t;hint('Lift the filled ladle towards your hands.','把盛满水的竹勺提到手边。')}else hint('Lower the ladle into the basin.','把竹勺放入水盆。')}else if(state.waterStage===1){if(a.x<385){state.waterStage=2;state.waterAt=t;sound(490);hint('Let the water flow over your hands.','让水缓缓流过双手。')}else hint('Move the ladle towards your hands on the left.','把竹勺移向左边的双手。')}}
const templeProps=prop;prop=function(id,x,y){if(id==='templeBell'){templeBellArt(x,y-35,.57);return}if(id==='templeWater'){ctx.save();ctx.translate(x,y-32);ctx.scale(.56,.56);templeBasin(0,0);templeLadle(0,-35,-.1);ctx.restore();return}return templeProps(id,x,y)};
const templeRoom=drawRoom;drawRoom=function(){if(room!=='temple')return templeRoom();ctx.save();templeRitualBackground();let locations=[['templeWater','Water pavilion','手水亭'],['prayer','Prayer altar','祈愿香案'],['templeBell','Bronze bell','山寺钟声'],['sticks','Fortune sticks','求签'],['moon','Moon blocks','掷筊']];for(let [id,en,cn] of locations){const [x,y,ax,ay]=indoorStation(id),first=hit.length;prop(id,x,y);label(tr(en,cn),x,y+34,()=>start(id));target(x-65,y-105,130,115,()=>start(id));markIndoorStation(id,first,[ax,ay])}ctx.restore()};
const templeRitualDraw=drawActivity;drawActivity=function(){
 if(!['templeBell','templeWater','templePaper'].includes(activity))return templeRitualDraw();ctx.save();templeRitualBackground();
 if(activity==='templeBell'){let age=t-state.bellAt,held=drag?.id==='templeStriker',pull=held?Math.min(85,Math.abs(drag.x-drag.sx)):0,impact=age>.22&&age<4?Math.sin((age-.22)*16)*Math.exp(-(age-.22)*1.7)*state.bellStrength*.045:0;if(age>=.22&&age<4&&!state.bellRung){state.bellRung=true;sound(146+state.bellStrength*12);if(!muted&&ambientBus){ambientTone(146.83,.065*state.bellStrength,2.5,'sine');ambientTone(293.66,.025*state.bellStrength,1.6,'sine',.04)}}line(270,315,530,315,'#6c5239',16);line(400,315,400,348,'#5f5542',12);templeBellArt(400,438,1.05,impact);let swing=held?-pull:age<.22?-85*state.bellStrength*(1-age/.22):age<1.5?-Math.abs(Math.sin((age-.22)*5))*40*state.bellStrength*Math.exp(-age):0;let sx=285+swing;line(300,320,sx,474,'#9a825d',3);line(355,320,sx+85,474,'#9a825d',3);ctx.save();ctx.translate(sx,474);round(-8,-10,108,20,10,'#a8855b','#654c38');line(6,-4,87,-4,'#d0b082',2);ctx.restore();target(180,440,210,65,()=>templeReleaseBell(55),'templeStriker');if(age>.22&&age<3){for(let j=0;j<3;j++){let f=(age-.22-j*.28)/2.3;if(f>0&&f<1){ctx.strokeStyle='rgba(246,221,158,'+(1-f)*.4*state.bellStrength+')';ctx.beginPath();ctx.ellipse(400,490,80+f*130,19+f*30,0,0,TAU);ctx.stroke()}}}drawRitualPose(211,570,1.8,{reach:held||age<1?{x:sx+8,y:474}:null,bow:held?.10:0});txt(tr('Pull the striker and let go','拉动木槌，再松手'),400,616,17,'#fff1d6');}
 if(activity==='templeWater'){let age=t-state.waterAt;templeBasin(475,486);let lx=drag?.id==='templeLadle'?drag.x:state.waterStage===1?473:state.waterStage===2?337:455,ly=drag?.id==='templeLadle'?drag.y:state.waterStage===1?420:state.waterStage===2?437:456;let using=drag?.id==='templeLadle'||state.waterStage===2;templePrayerFigure(305,565,using?.10:0,false,false,0,using?{x:lx-49,y:ly}:null);templeLadle(lx,ly,state.waterStage===2?.55:-.12);if(state.waterStage===2&&age<2){for(let j=0;j<12;j++){let f=(age*2+j*.12)%1;ellipse(365+Math.sin(j*2)*6,450+f*62,2,5,'#cde8df')}}if(state.waterStage===2&&age>2){state.waterStage=3;hint('Ready to visit the altar, or stay a little longer.','可以去祈愿，也可以在这里多待一会儿。')}if(state.waterStage<2){target(lx-80,ly-35,150,70,()=>{},'templeLadle');txt(state.waterStage===0?tr('Scoop water','舀水'):tr('Lift and pour','提起竹勺，缓缓倒水'),400,620,17,'#fff2db')}else if(state.waterStage===3){label(tr('Visit the altar','前往香案'),400,620,()=>start('prayer'))}}
 if(activity==='templePaper'){let age=t-state.paperAt;drawTemplePaperRack(565,410,.62,state.paperStage==='tied'&&age<.65?1:0);if(state.paperStage==='opening'&&age>.75)state.paperStage='open';let open=state.paperStage!=='folded';let f=state.paperStage==='opening'?Math.min(1,age/.75):open?1:0;let w=72+f*178,h=65+f*133;let cx=400,cy=472;if(state.paperStage==='tied'){let u=Math.min(1,age/.65);cx=400+165*u;cy=472-62*u;w*=1-u*.94;h*=1-u*.88}if(state.paperStage==='kept'){let u=Math.min(1,age/.7);cy+=85*u;w*=1-u*.6;h*=1-u*.6;ctx.globalAlpha=1-u*.75}ctx.save();ctx.translate(cx,cy);ctx.rotate(state.paperStage==='tied'?Math.sin(t*1.8)*.07:0);ctx.shadowColor='#3a322a88';ctx.shadowBlur=10;round(-w/2,-h/2,w,h,3,'#eadcb9','#ad986f');ctx.shadowBlur=0;line(-w/2+9,0,w/2-9,0,'#b9a37a70',1);if(f>.92&&['open','opening'].includes(state.paperStage)){txt(tr('Fortune No. ','第 ')+state.paperNumber+(zh?' 签':''),0,-58,20,'#70503d');let words=tr(...shrinePaperLines[state.paperNumber-1]);let chunks=zh?[words]:words.match(/.{1,24}(?:\s|$)|\S+?(?:\s|$)/g)||[words];chunks.slice(0,4).forEach((v,i)=>txt(v.trim(),0,-17+i*22,16,'#594c39'));txt(tr('A reflection, not a promise','签文仅供自我反思'),0,69,12,'#84694c')}else if(!open)txt('籤',0,0,24,'#a16e49');ctx.restore();ctx.globalAlpha=1;if(state.paperStage==='folded'){target(335,420,130,110,templePaperTap);label(tr('Unfold your fortune','展开签纸'),400,620,templePaperTap)}if(state.paperStage==='open'){label(tr('Keep in bag','收入背包'),300,620,()=>templePaperKeep(false));label(tr('Tie on rack','系上签纸'),500,620,()=>templePaperKeep(true))}if(['kept','tied'].includes(state.paperStage)&&age>.8){label(tr('Return to temple','回到寺庙'),400,620,()=>{activity=null;state={};updateHUD();roomIntro()})}}
 ctx.restore()
};

const mandatoryGateStyle=document.createElement('style');mandatoryGateStyle.textContent='#proposal .gate i{transition-duration:.75s}#proposal .gate-traveller.go{transition:transform 1.05s ease-in,opacity .25s .8s;transform:translateY(-32%) scale(.38)}#proposal[data-shot="shrine"] .gate{max-width:530px}#proposal[data-shot="shrine"] .shrine-enter{position:relative;z-index:4}';document.head.append(mandatoryGateStyle);

/* Homecoming: greetings use local visit history, not a new registration form. */
let shrineReturning=false,shrineVisitSnapshot={},shrineArrivalRecorded=false;
function readShrineVisits(){const value=load('shrineVisitsV1',{});return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
function shrineClock(){const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Singapore',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'});const parts=Object.fromEntries(fmt.formatToParts(new Date()).map(v=>[v.type,v.value]));return {day:parts.year+'-'+parts.month+'-'+parts.day,weekday:parts.weekday,hour:Number(parts.hour)}}
function shrineWelcome(){const clock=shrineClock(),v=shrineVisitSnapshot,who=proName.trim(),prefix=who?who+'，':'',enName=who?who+', ':'';if(!shrineReturning)return tr('Welcome, '+(who||'traveller')+'. Leave the busy world outside. This valley is yours to explore.','欢迎你，'+(who||'旅人')+'。把忙碌留在山门外，慢慢逛吧。');let lines;if(lunarMenu())lines=[['It is a vegetarian day. Grandma has warm vegetable soup waiting.','今日宜吃素，也宜摸鱼。外婆备好素汤啦。']];else if(v.day===clock.day&&Number(v.today)>0)lines=[['Back again today? That meeting must be fascinating.','今天又来啦？看来那个会相当精彩。'],['Your usual place is waiting. No need to explain where you have been.','老位置给你留着，不用解释刚才去了哪里。'],['Another little escape? Your secret is safe with the temple cat.','又来偷偷摸鱼啦？庙里的猫会替你保密。']];else if(v.lastAt&&Date.now()-v.lastAt>7*86400000)lines=[['Even the temple cat was wondering where you went.','连庙里的猫都在念叨你去哪儿了。']];else if(clock.hour>=22||clock.hour<5)lines=[['The world can wait until tomorrow. Take a quiet walk.','世界可以等到明天，今晚慢慢走吧。']];else if(clock.weekday==='Fri'&&clock.hour>=16)lines=[['Congratulations on surviving another week.','恭喜你，又成功熬过一个星期。']];else if(clock.weekday==='Mon'&&clock.hour<12)lines=[['Back already? It is only Monday.','这么快就回来啦？今天才周一呢。']];else lines=[['Good to see you. I saved you a quiet moment.','又见面啦，给你留了一小段清静时光。'],['Nothing urgent on this side of the gate.','山门这一边，没有什么十万火急的事。'],['The koi have been behaving. Mostly.','锦鲤今天很乖。大概吧。'],['Your little world has been waiting for you.','你的小小世界一直在等你回来。']];const pick=lines[(Number(v.total)||0)%lines.length];return tr(enName+pick[0],prefix+pick[1])}
function recordShrineArrival(){if(shrineArrivalRecorded)return;shrineArrivalRecorded=true;const old=readShrineVisits(),clock=shrineClock();save('shrineVisitsV1',{day:clock.day,today:old.day===clock.day?(Number(old.today)||0)+1:1,total:(Number(old.total)||0)+1,lastAt:Date.now()});const ticket=load('originalRailTicketV1',null);if(!ticket||typeof ticket!=='object'){save('originalRailTicketV1',{name:proName.trim(),avatar:proAvatar,issued:shrineReturning?null:clock.day,number:'MB-'+String(hash(proName.trim()+'|'+proAvatar)%1000000).padStart(6,'0')})}}
function renderRailKeepsake(book){const data=load('originalRailTicketV1',null);if(!data||typeof data!=='object')return;let ticket=element('section','',book,'passportRailTicket');element('small',tr('MEOWBOX RAILWAY · ORIGINAL TICKET','摸鱼铁路 · 初次入境车票'),ticket);let route=element('strong',tr('Reality → Fortune Valley','现实世界 → 解忧谷'),ticket);let row=element('div','',ticket,'passportRailPassenger');let info=element('div','',row);element('span',tr('Passenger','旅客'),info);element('p',data.name||tr('Traveller','旅人'),info);let portrait=element('img','',row);portrait.src=ART['badge'+(Number(data.avatar)||0)];portrait.alt='';let stub=element('div','',ticket,'passportRailStub');element('span',data.number||'MB',stub);element('span',data.issued||tr('First journey · date unknown','初次旅程 · 日期未记录'),stub);element('p',tr('Valid whenever you need a little escape.','有效期：每一个想摸鱼的瞬间。'),ticket);}
function paintShrineWeather(hero){refreshAtmosphere();const clock=shrineClock(),night=clock.hour>=19||clock.hour<6,dusk=clock.hour>=17&&clock.hour<19;const sky=element('div','',hero,'shrine-sky');sky.dataset.light=night?'night':dusk?'dusk':'day';sky.dataset.weather=atmosphere.weather;sky.setAttribute('aria-hidden','true');if(atmosphere.weather==='rain'){for(let i=0;i<21;i++){const drop=element('i','',sky,'shrine-rain');drop.style.left=((i*37)%100)+'%';drop.style.animationDelay=(-i*.18)+'s';drop.style.animationDuration=(.7+(i%5)*.14)+'s'}}else if(night){for(let i=0;i<11;i++){const spark=element('i','',sky,'shrine-firefly');spark.style.left=((i*37)%94+3)+'%';spark.style.top=((i*29)%75+8)+'%';spark.style.animationDelay=(-i*.47)+'s'}}for(let i=0;i<2;i++){let lantern=element('div','',hero,'shrine-ambient-lantern '+(i?'right':'left'));lantern.setAttribute('aria-hidden','true');element('i','',lantern)}}
const homecomingStyle=document.createElement('style');homecomingStyle.textContent=`
#proposal[data-shot="shrine"] footer{gap:5px}
#proposal .shrine-speaker{order:-1;color:#efd1a0;font:12px Georgia,serif;letter-spacing:.08em}
#proposal .shrine-welcome{font-size:clamp(13px,2.8vw,16px);line-height:1.45}
#proposal .shrine-sky{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden}
#proposal .shrine-sky[data-light="night"]{background:linear-gradient(#182e4e28,#152a4035)}
#proposal .shrine-sky[data-light="dusk"]{background:linear-gradient(#ce925d30,transparent)}
#proposal .shrine-sky[data-weather="mist"]{box-shadow:inset 0 -55px 65px #e3e4d22a}
#proposal .shrine-rain{position:absolute;top:-30%;width:1px;height:30px;background:linear-gradient(transparent,#e4f0ed85);transform:rotate(12deg);animation:shrineRain 1s linear infinite}
#proposal .shrine-firefly{position:absolute;width:3px;height:3px;border-radius:50%;background:#fbe5a3;box-shadow:0 0 8px #ffe5a7;animation:shrineFirefly 3s ease-in-out infinite alternate}
#proposal .shrine-ambient-lantern{position:absolute;z-index:5;top:11%;width:24px;height:32px;border-radius:42%;background:radial-gradient(ellipse at 42% 40%,#ffe2a2,#c77b49 67%,#89543a);border:1px solid #8e5c3f;box-shadow:0 0 24px #f6c56b55;transform-origin:50% -18px;animation:shrineSway 3.6s ease-in-out infinite alternate;pointer-events:none}
#proposal .shrine-ambient-lantern.left{left:calc(50% - min(40%,220px))}
#proposal .shrine-ambient-lantern.right{right:calc(50% - min(40%,220px));animation-delay:-1.4s}
#proposal .shrine-ambient-lantern:before{content:"";position:absolute;width:1px;height:18px;top:-19px;left:50%;background:#bba27c}
#proposal .shrine-ambient-lantern:after{content:"";position:absolute;left:4px;right:4px;bottom:-3px;height:4px;background:#76523b}
#proposal .shrine-ambient-lantern i{position:absolute;inset:1px 6px;border-left:1px solid #b47c4a88;border-right:1px solid #b47c4a88;border-radius:50%}
@keyframes shrineRain{to{top:115%;translate:-16px 0}}
@keyframes shrineFirefly{from{opacity:.2;translate:0 0}to{opacity:.85;translate:8px -12px}}
@keyframes shrineSway{from{rotate:-5deg}to{rotate:5deg}}
.passportRailTicket{margin:12px 0 18px;background:#f1dfb7;color:#674f38;border:1px solid #a78b60;border-radius:4px;padding:12px;box-shadow:0 3px 8px #5b452a25}
.passportRailTicket>small{display:block;letter-spacing:.08em;font-size:11px}
.passportRailTicket>strong{display:block;font:20px Georgia,serif;margin:8px 0}
.passportRailPassenger{display:flex;justify-content:space-between;align-items:center;gap:10px}
.passportRailPassenger span{font-size:11px}.passportRailPassenger p{margin:3px 0;font-size:17px;overflow-wrap:anywhere}
.passportRailPassenger img{width:44px;height:44px;object-fit:contain}
.passportRailStub{border-top:1px dashed #9d845e;margin-top:8px;padding-top:7px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px;font-size:11px}
.passportRailTicket>p{font-size:12px;margin:8px 0 0}
`;document.head.append(homecomingStyle);

/* Courtyard details, optional encounters and physical fortune rack. */
function drawTemplePaperRack(x,y,sc=1,hideLatest=0){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ellipse(0,100,116,12,'#39332a55');for(let sign of [-1,1]){let xx=sign*109;line(xx,-103,xx,99,'#694d38',12);line(xx-2,-101,xx-2,96,'#b08b62',3)}line(-121,-105,121,-105,'#6c4a35',13);line(-118,-108,118,-108,'#c2a17a',3);for(let j=0;j<3;j++){let yy=-72+j*59;line(-104,yy,104,yy,'#8d7455',3);for(let i=0;i<7;i++){let idx=j*7+i;let papers=templeTies.slice(-21-hideLatest,hideLatest?-hideLatest:undefined);if(idx>=papers.length)continue;let xx=-88+i*29;ctx.save();ctx.translate(xx,yy);ctx.rotate(Math.sin(t*1.4+idx)*.12);ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(0,-4);ctx.lineTo(8,0);ctx.lineTo(10,24);ctx.lineTo(1,29);ctx.lineTo(-9,23);ctx.closePath();ctx.fillStyle=['#e5d5b4','#f2e4c8','#d9c8a4'][idx%3];ctx.fill();line(-5,8,6,12,'#9c735d99',1);line(-4,15,6,19,'#9c735d66',1);ctx.restore()}}ctx.restore()}
let templeCatVisits=Number(load('templeCatVisitsV1',0))||0,templeCatTouchedAt=-100;
const templeCatLines=[['The cat stares at you. Apparently, your offering was not a snack.','猫盯着你看。看来你供奉的不是零食。'],['It sits on the edge of your sleeve. You have been chosen as furniture.','它坐在你的袖口上。恭喜，你被选中当家具了。'],['The temple cat has declared your afternoon officially free.','庙猫宣布：今天下午正式准假。'],['It remembers you. Or possibly the snacks you might be carrying.','它记得你。也可能只是记得你身上或许有零食。']];
function meetTempleCat(){if(t-templeCatTouchedAt<1.5)return;templeCatTouchedAt=t;let v=templeCatLines[templeCatVisits%templeCatLines.length];templeCatVisits++;save('templeCatVisitsV1',templeCatVisits);react(...v);if(templeCatVisits===3)addItem('Temple cat blessing','庙猫的祝福')}
const courtyardDetailDraw=drawRoom;drawRoom=function(){courtyardDetailDraw();if(room!=='temple')return;ctx.save();drawTemplePaperRack(620,545,.42);let x=185+Math.sin(t*.16)*19,y=542+Math.sin(t*.32)*3;cat(x,y,1,false,.82);if(t-templeCatTouchedAt<1.2){ellipse(x,y-47,2.5,2.5,'#f3d4a0')}target(x-29,y-44,58,49,meetTempleCat);ctx.restore()};
const originalTempleStory=keepsakeStory;keepsakeStory=function(item){if(/^Fortune paper /.test(item[0])){const n=Number(item[0].split(' ').at(-1));return shrinePaperLines[n-1]||originalTempleStory(item)}if(item[0]==='Temple cat blessing')return ['A resident cat decided you were welcome. No application form required.','庙猫认定你可以留下，不用填申请表。'];return originalTempleStory(item)};

/* Shared character pose renderer: preserve the selected identity and articulate joints. */
function poseEase(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)}
function drawRitualPose(x,y,sc,opts={}){
 const k=((avatar??0)%4+4)%4,shirt=['#ead1a5','#e7e8e3','#425c77','#82986d'][k],pants=['#514b45','#4b5260','#465563','#777464'][k],skin='#efc8a7';
 const kn=clamp(opts.kneel||0,0,1),angle=clamp(opts.bow||0,0,1)*.70,breath=actorReduce?0:Math.sin(t*2.2)*.40;
 const hip={x:-10*kn,y:-24+13*kn},knee={x:3+17*kn,y:-11+9*kn},ankle={x:2-16*kn,y:-2};
 const trp=(a,b)=>({x:hip.x+a*Math.cos(angle)-b*Math.sin(angle),y:hip.y+a*Math.sin(angle)+b*Math.cos(angle)+breath});
 const shoulder=trp(2,-22);
 let hand=opts.reach?{x:(opts.reach.x-x)/sc,y:(opts.reach.y-y)/sc}:opts.praying?trp(20,-29):trp(11,-4);
 // Keep the wrist within the natural reach of the upper and lower arm.
 let dx=hand.x-shoulder.x,dy=hand.y-shoulder.y,d=Math.hypot(dx,dy);
 if(d>28){hand={x:shoulder.x+dx/d*28,y:shoulder.y+dy/d*28};dx=hand.x-shoulder.x;dy=hand.y-shoulder.y;d=28}
 const bend=Math.sqrt(Math.max(0,15*15-(d*.5)**2)),elbow={x:(shoulder.x+hand.x)*.5-dy/Math.max(1,d)*bend,y:(shoulder.y+hand.y)*.5+dx/Math.max(1,d)*bend};
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
 ellipse(3,2,19+kn*6,5,'#342d2855');
 for(const side of [-1,1]){
  line(hip.x+side*3,hip.y,knee.x+side*3,knee.y,pants,8);
  line(knee.x+side*3,knee.y,ankle.x+side*3,ankle.y,pants,7);
  line(ankle.x+side*3-3,ankle.y,ankle.x+side*3+5,0,'#494038',5);
 }
 ctx.save();ctx.translate(hip.x,hip.y+breath);ctx.rotate(angle);ctx.translate(0,22);
 round(-11,-48,23,31,6,shirt,'#59473c');round(-17,-44,12,22,4,'#a5815a','#59473c');
 ctx.save();ctx.beginPath();ctx.rect(-31,-108,68,59);ctx.clip();backHuman(0,0,k,false,'right',1);ctx.restore();ctx.restore();
 ctx.lineCap='round';ctx.lineJoin='round';
 line(shoulder.x-3,shoulder.y,elbow.x-2,elbow.y,shirt,7);
 line(elbow.x-2,elbow.y,hand.x-2,hand.y,shirt,6);
 line(shoulder.x,shoulder.y,elbow.x+2,elbow.y,shirt,8);
 line(elbow.x+2,elbow.y,hand.x,hand.y,shirt,7);
 ctx.save();ctx.translate(hand.x,hand.y);ctx.rotate(opts.praying?-.24:Math.atan2(hand.y-elbow.y,hand.x-elbow.x)+Math.PI*.5);
 ellipse(0,0,3.4,5.2,skin);if(opts.praying)line(-.5,-4,-.5,3,'#bd8e77',.7);ctx.restore();ctx.restore();
 return {x:x+hand.x*sc,y:y+hand.y*sc};
}
function lightTempleIncense(){if(activity!=='prayer'||state.incense||state.prayerStage!=='ready')return;state.incense=true;state.incenseAt=t;sound(350);hint('The incense is lit. Tap the mat to offer your prayer.','香已点燃，点击蒲团静心祈愿。')}

/* Food Street release: prepare, serve, taste and keep the finished recipe. */
activityTitle.bubbleTea=['Bubble tea','手摇奶茶'];
roomActions.kitchen=[['cook','Grandma’s soup','外婆煮汤'],['bubbleTea','Bubble tea','手摇奶茶']];
const foodReleaseStart=start;start=function(id){foodReleaseStart(id);if(id==='bubbleTea'){state.teaStage='base';state.teaBase=-1;state.teaPearls=0;state.teaMix=0;state.teaAt=t;hint('Choose a tea, then add pearls and shake.','选茶底，加珍珠，再摇匀。')}};
const teaChoices=[['Milk tea','经典奶茶','#b68965'],['Jasmine milk tea','茉莉奶茶','#d7c59b'],['Brown sugar tea','黑糖奶茶','#976843']];
function teaCup(x,y,sc=1,base=0,pearls=0,fill=1,angle=0){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(-36,-74);ctx.lineTo(36,-74);ctx.lineTo(26,0);ctx.lineTo(-26,0);ctx.closePath();ctx.fillStyle='#e6e3cf';ctx.fill();ctx.save();ctx.clip();let level=-69*Math.max(0,Math.min(1,fill));ctx.fillStyle=teaChoices[Math.max(0,base)][2];ctx.fillRect(-38,level,76,75);for(let i=0;i<Math.min(16,pearls);i++){let xx=-20+(i*17)%42,yy=-5-Math.floor(i/5)*7+Math.sin(t*6+i)*Math.min(3,Math.abs(angle)*12);ellipse(xx,yy,4.2,4.2,'#4b342e')}ctx.restore();ctx.strokeStyle='#c8b999';ctx.lineWidth=2;ctx.stroke();ellipse(0,-74,37,7,'#eee1c7');line(9,-78,16,-110,'#a66357',5);line(-24,-63,-19,-12,'#fff3da66',3);ctx.restore()}
function selectTeaBase(i){if(activity!=='bubbleTea'||state.teaStage!=='base')return;state.teaBase=i;state.teaStage='pearls';state.teaAt=t;sound(440);hint('Scoop the pearls into your cup.','把珍珠舀进杯里。')}
function teaAddPearls(){if(activity!=='bubbleTea'||state.teaStage!=='pearls')return;state.teaPearls+=5;state.teaAt=t;sound(280+state.teaPearls*12);if(state.teaPearls>=10){state.teaStage='mix';hint('Drag the cup from side to side to shake it.','左右拖动杯子，把奶茶摇匀。')}}
function teaShake(amount){if(activity!=='bubbleTea'||state.teaStage!=='mix')return;state.teaMix=Math.min(100,state.teaMix+Math.min(50,Math.max(0,amount*.55)));state.teaAt=t;if(state.teaMix>=100){state.teaStage='ready';sound(630);hint('Your drink is ready. Take a sip!','奶茶做好啦，喝一口吧！')}}
function teaSip(){if(activity!=='bubbleTea'||state.teaStage!=='ready')return;state.teaStage='sip';state.teaAt=t;sound(380)}
function drawFoodCounter(){paintLivingBackdrop(pics.kitchen||pics.streetKitchen||pics.tea||pics.sticks);let g=ctx.createLinearGradient(0,410,0,690);g.addColorStop(0,'#a8835b');g.addColorStop(1,'#654c39');ctx.beginPath();ctx.moveTo(180,466);ctx.lineTo(620,466);ctx.lineTo(690,690);ctx.lineTo(110,690);ctx.closePath();ctx.fillStyle=g;ctx.fill();for(let i=0;i<5;i++)line(175-i*12,482+i*39,625+i*12,482+i*39,'#e0b98230',2)}
const foodReleaseProp=prop;prop=function(id,x,y){if(id==='bubbleTea'){teaCup(x,y-16,.85,0,10);return}return foodReleaseProp(id,x,y)};
/* A real counter sequence: pour, scoop, shake and drink. */
function teaPitcher(x,y,base,tilt=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(tilt);
 ctx.beginPath();ctx.moveTo(-23,-55);ctx.lineTo(22,-55);ctx.lineTo(34,-66);ctx.lineTo(29,-44);ctx.lineTo(27,4);ctx.quadraticCurveTo(0,16,-28,4);ctx.closePath();
 ctx.fillStyle='#e5dcc8';ctx.fill();ctx.strokeStyle='#ae9271';ctx.lineWidth=2;ctx.stroke();
 ctx.save();ctx.clip();ctx.fillStyle=teaChoices[Math.max(0,base)][2];ctx.fillRect(-30,-35,67,48);ctx.restore();
 ctx.beginPath();ctx.ellipse(-29,-22,13,21,0,Math.PI/2,Math.PI*1.5);ctx.strokeStyle='#a88c6c';ctx.lineWidth=5;ctx.stroke();
 ellipse(0,-55,23,5,'#bba389');line(-17,-45,-14,-5,'#fff2df80',2);ctx.restore();
}
function teaScoopArt(x,y,tilt=0,loaded=false){
 ctx.save();ctx.translate(x,y);ctx.rotate(tilt);
 line(0,0,50,-29,'#765f45',8);line(1,-2,48,-31,'#d1ad79',3);
 ellipse(-8,5,22,12,'#ad936b');ellipse(-8,2,18,8,'#e2c697');
 if(loaded)for(let i=0;i<5;i++)ellipse(-18+i*5,1+(i%2)*4,4,4,'#4b342e');
 ctx.restore();
}
function teaScoopRelease(a){
 if(activity!=='bubbleTea'||state.teaStage!=='pearls')return;
 if(Math.hypot(a.x-420,a.y-480)<65){teaAddPearls();return}
 hint('Tip the scoop into the cup.','把珍珠倒进奶茶杯里。');
}
c.addEventListener('pointerup',e=>{
 if(activity!=='bubbleTea'||drag?.id!=='teaPearlScoop')return;
 const d=drag,a=point(e);drag=null;e.preventDefault();e.stopImmediatePropagation();
 if(d.moved<12)teaAddPearls();else teaScoopRelease(a);
},true);
const foodReleaseDraw=drawActivity;drawActivity=function(){
 if(activity!=='bubbleTea')return foodReleaseDraw();
 ctx.save();drawFoodCounter();
 let stage=state.teaStage,age=Math.max(0,t-state.teaAt),cx=420,cy=525,angle=0,fill=state.teaBase<0?0:stage==='pearls'&&state.teaPearls===0?Math.min(1,Math.max(0,(age-.18)/.75)):1;
 if(stage==='mix'&&drag?.id==='teaMix'){cx=clamp(drag.x,315,505);cy=clamp(drag.y,465,550);angle=clamp((drag.x-drag.sx)/250,-.32,.32)+Math.sin(t*15)*.05}
 if(stage==='sip'){let f=Math.sin(Math.PI*Math.min(1,age/2.4));cx=420-104*f;cy=525-100*f;angle=-.12*f;fill=Math.max(.35,1-age*.25);if(age>=2.4){state.teaStage='done';state.teaAt=t;let v=teaChoices[state.teaBase];addItem(v[0]+' recipe',v[1]+'配方');react('The perfect amount of sugar is none of my boss’s business.','几分糖，轮不到老板来管。')}}
 if(stage==='done')fill=.35;
 const pouring=stage==='pearls'&&state.teaPearls===0&&age<1.1;
 const scooping=stage==='pearls'&&drag?.id==='teaPearlScoop';
 drawRitualPose(270,480,1.8,{kneel:.35,reach:stage==='sip'||drag?.id==='teaMix'?{x:cx-25,y:cy-35}:null});
 teaCup(cx,cy,1.15,state.teaBase,state.teaPearls,fill,angle);
 if(pouring){
  const f=poseEase(age/.25),px=495-48*f,py=421-30*f;teaPitcher(px,py,state.teaBase,-.72*f);
  if(age>.18&&age<.98){ctx.save();ctx.strokeStyle=teaChoices[state.teaBase][2];ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(px-19,py-35);ctx.quadraticCurveTo(420,py+5,420,450);ctx.stroke();ctx.restore()}
 }
 if(stage==='base')teaChoices.forEach((v,i)=>{let x=265+i*135;teaPitcher(x,596,i);label(tr(v[0],v[1]),x,635,()=>selectTeaBase(i));target(x-38,530,76,76,()=>selectTeaBase(i))});
 if(stage==='pearls'){
  ellipse(530,540,36,15,'#e5caa0');ellipse(530,537,30,10,'#986b53');
  for(let i=0;i<12;i++)ellipse(511+(i*13)%39,532+(i%3)*5,4,4,'#50362e');
  if(scooping)teaScoopArt(drag.x,drag.y,-.13,true);
  else if(age<.52&&state.teaPearls){let f=poseEase(age/.52);teaScoopArt(530-110*f,521-63*Math.sin(f*Math.PI),-.6*f,false);for(let i=0;i<5;i++)ellipse(530-110*f+i*3,530-83*Math.sin(f*Math.PI)+f*15,4,4,'#4b342e')}
  else teaScoopArt(530,520,0,true);
  target(487,480,90,80,()=>{},'teaPearlScoop');
  label(tr('Scoop pearls','舀珍珠'),530,610,teaAddPearls);
  txt(tr('Drag the scoop to the cup','把珍珠舀进杯里'),400,570,15,'#fff3d9');
 }
 if(stage==='mix'){
  target(325,415,185,145,()=>{},'teaMix');
  let live=state.teaMix+(drag?.id==='teaMix'?Math.min(50,Math.max(0,drag.moved*.55)):0);
  txt(tr('Shake the cup','摇匀奶茶')+' '+Math.round(Math.min(100,live))+'%',400,612,17,'#fff3d9');
  label(tr('Shake gently','轻轻摇晃'),400,646,()=>teaShake(60));
 }
 if(stage==='ready'){target(365,420,110,125,teaSip);label(tr('Take a sip','喝一口'),420,620,teaSip)}
 if(stage==='sip')txt(tr('A well deserved break','这一口，值得'),400,620,18,'#fff4dd');
 if(stage==='done'){label(tr('Make another','再做一杯'),310,620,()=>start('bubbleTea'));label(tr('Back to kitchen','回到厨房'),500,620,()=>{activity=null;state={};updateHUD();roomIntro()})}
 ctx.restore();
};
function soupTaste(){if(activity!=='cook'||!state.done||state.tasteAt!==undefined)return;state.tasteAt=t;sound(390);closeTalk();hint('Careful, it is hot.','慢慢喝，小心烫。')}
const foodTasteDraw=drawActivity;drawActivity=function(){foodTasteDraw();if(activity!=='cook'||!state.done)return;ctx.save();let age=t-(state.tasteAt??-100),active=state.tasteAt!==undefined&&age<2.7,f=active?Math.sin(Math.PI*Math.min(1,age/2.7)):0;let bx=510-130*f,by=422-33*f;drawRitualPose(290,495,1.6,{kneel:.4,reach:active?{x:bx-25,y:by}:null});ellipse(bx,by+9,32,10,'#58483c66');ellipse(bx,by,32,13,'#e7d8b9');ellipse(bx,by-2,27,8,'#ac8050');if(age>=2.7&&state.tasteAt!==undefined&&!state.tasted){state.tasted=true;react('Grandma: Eat properly. The emails can wait.','外婆：好好吃饭，邮件等会儿再回。')}if(state.tasteAt===undefined){label(tr('Taste the soup','尝一口汤'),510,390,soupTaste);target(478,397,64,42,soupTaste)}ctx.restore()};

/* Fortune Valley: a quiet garden beyond the temple courtyard. */
activityTitle.secretGarden=['Behind the temple','寺后小径'];
let gardenVisits=Number(load('secretGardenVisitsV1',0))||0;
const gardenStart=start;start=function(id){gardenStart(id);if(id==='secretGarden'){gardenVisits++;save('secretGardenVisitsV1',gardenVisits);state.gardenAt=t;state.gardenSeatAt=-100;state.gardenChimeAt=-100;state.gardenFeedAt=-100;state.gardenFeedCount=0;state.gardenSitting=false;hint('Follow the path. Listen to the wind or feed the koi.','沿着小径走走，听风铃，或喂喂锦鲤。')}};
function gardenChime(){if(activity!=='secretGarden'||t-state.gardenChimeAt<.6)return;state.gardenChimeAt=t;sound(690);if(!muted&&ambientBus){ambientTone(659.25,.028,1.9,'sine');ambientTone(987.77,.018,1.4,'sine',.17)}hint('Even the wind has nothing urgent to say.','连风都没有什么急事要说。')}
function gardenFeed(x=435,y=480){if(activity!=='secretGarden'||t-state.gardenFeedAt<.8)return;state.gardenFeedAt=t;state.gardenFeedX=Math.max(320,Math.min(570,x));state.gardenFeedY=Math.max(430,Math.min(545,y));state.gardenFeedCount++;sound(320);if(state.gardenFeedCount===3){addItem('Quiet garden postcard','静谧后院明信片');hint('The keeper left a little postcard for you.','庙祝给你留了一张小小的明信片。')}else hint(...(state.gardenFeedCount%2?['The koi have spotted lunch. You are now their favourite person.','锦鲤发现午餐了，你现在是它们最爱的人。']:['One koi is clearly running the buffet.','有一条锦鲤显然承包了整个自助餐。']))}
function gardenSeat(){if(activity!=='secretGarden'||t-state.gardenSeatAt<.75)return;state.gardenSitting=!state.gardenSitting;state.gardenSeatAt=t;hint(...(state.gardenSitting?['Sit as long as you like. No countdown here.','想坐多久就坐多久，这里没有倒计时。']:['Take the quiet with you.','把这一份清静带走吧。']))}
function gardenKoi(x,y,angle,kind){ctx.save();ctx.translate(x,y);ctx.rotate(angle);let col=['#d99b62','#e4d9ba','#d16b48','#e2bf75'][kind%4];ctx.globalAlpha=.88;ctx.beginPath();ctx.moveTo(-17,0);ctx.quadraticCurveTo(-30,Math.sin(t*6+kind)*9-7,-36,-12);ctx.lineTo(-29,0);ctx.lineTo(-36,12);ctx.quadraticCurveTo(-28,7,-17,0);ctx.fillStyle=col;ctx.fill();ellipse(0,0,23,9,col);ellipse(2,0,15,6,kind===1?'#c66b48':'#f2dbb7');ellipse(-6,2,6,4,col);ellipse(16,-3,1.6,1.6,'#514638');ellipse(16,3,1.6,1.6,'#514638');ctx.restore()}
function gardenWindChime(x,y){let age=t-state.gardenChimeAt,ang=Math.sin(t*1.4)*.07+(age<3?Math.sin(age*12)*.35*Math.exp(-age*1.4):0);ctx.save();ctx.translate(x,y);line(0,-65,0,-22,'#ad9470',2);ctx.rotate(ang);let g=ctx.createLinearGradient(-20,0,20,0);g.addColorStop(0,'#829e9b80');g.addColorStop(.48,'#e5eddbcc');g.addColorStop(1,'#648f8d90');ctx.beginPath();ctx.arc(0,0,19,Math.PI,0);ctx.lineTo(19,11);ctx.quadraticCurveTo(0,21,-19,11);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#a8c3ad';ctx.stroke();line(0,5,0,40,'#bca681',1.5);ellipse(0,12,3,4,'#d8b47a');ctx.rotate(Math.sin(t*1.9)*.14);round(-8,40,16,40,1,'#d9bd89','#8e7856');line(-4,48,4,66,'#a8644a',1);ctx.restore()}
const gardenRoomDraw=drawRoom;drawRoom=function(){gardenRoomDraw();if(room!=='temple')return;ctx.save();let [x,y,ax,ay]=indoorStation('secretGarden'),first=hit.length;line(x-55,y-25,x-55,y+12,'#75543e',6);line(x+55,y-25,x+55,y+12,'#75543e',6);round(x-76,y-50,152,31,3,'#a48760','#634b37');txt(tr('Garden path →','后院小径 →'),x,y-34,15,'#fff0d0');target(x-85,y-60,170,74,()=>start('secretGarden'));markIndoorStation('secretGarden',first,[ax,ay]);ctx.restore()};
const gardenDraw=drawActivity;drawActivity=function(){if(activity!=='secretGarden')return gardenDraw();ctx.save();paintLivingBackdrop(pics.park||pics.streetTemple||pics.temple);let shade=ctx.createLinearGradient(0,280,0,690);shade.addColorStop(0,'#304b3030');shade.addColorStop(1,'#27392d80');shadeLivingBackdrop(shade);
let age=t-state.gardenAt,walk=age<1.2,seatAge=t-state.gardenSeatAt,seat=state.gardenSitting?poseEase(seatAge/.75):seatAge<.75?1-poseEase(seatAge/.75):0;
ellipse(438,501,148,78,'#636d57');ellipse(438,492,141,75,'#436f6b');ellipse(438,492,133,67,'#668c81');ctx.save();ctx.beginPath();ctx.ellipse(438,492,133,67,0,0,TAU);ctx.clip();for(let i=0;i<5;i++){let f=(t*.25+i*.2)%1;ctx.beginPath();ctx.ellipse(445,491,25+f*114,9+f*49,0,0,TAU);ctx.strokeStyle='rgba(220,239,216,'+(.2*(1-f))+')';ctx.stroke()}
let feedAge=t-state.gardenFeedAt;for(let i=0;i<5;i++){let theta=t*(.23+i*.035)+i*1.26,xx=438+Math.cos(theta)*(82+i*7),yy=492+Math.sin(theta)*44,dx=-Math.sin(theta)*90,dy=Math.cos(theta)*44;if(feedAge<5){let attraction=poseEase(feedAge/1.1)*Math.min(1,(5-feedAge)/1.4)*.75;xx+=(state.gardenFeedX-xx)*attraction;yy+=(state.gardenFeedY-yy)*attraction;dx=state.gardenFeedX-xx;dy=state.gardenFeedY-yy}gardenKoi(xx,yy,Math.atan2(dy,dx),i)}if(feedAge<1.5){for(let i=0;i<6;i++){let f=Math.min(1,feedAge*2);ellipse(state.gardenFeedX-15+i*6,state.gardenFeedY-(1-f)*60+Math.sin(i)*6,2.5,2.5,'#ddc294')}ctx.beginPath();ctx.ellipse(state.gardenFeedX,state.gardenFeedY,8+feedAge*20,4+feedAge*10,0,0,TAU);ctx.strokeStyle='rgba(245,238,208,'+(1-feedAge/1.5)*.75+')';ctx.stroke()}ctx.restore();
for(let i=0;i<7;i++){let xx=325+i*36,yy=540+Math.sin(i)*17;ellipse(xx,yy,22,9,'#8c9180');ellipse(xx-3,yy-3,17,5,'#aab09b')}line(580,310,580,405,'#78583e',9);line(580,310,527,310,'#78583e',8);gardenWindChime(527,371);target(499,320,62,105,gardenChime);txt(tr('Wind chime','风铃'),527,420,14,'#fff1d2');
round(206,540,100,15,3,'#9f7953','#674e38');line(215,555,215,582,'#694d37',6);line(298,555,298,582,'#694d37',6);if(walk){backHuman(200+poseEase(age/1.2)*55,555,avatar??0,true,'right',1.5)}else drawRitualPose(253,seat>0?555+seat*6:555,1.5,{kneel:seat*.75,reach:feedAge<.45?{x:315,y:460}:null});target(205,505,102,77,gardenSeat);
label(tr(state.gardenSitting?'Stand up':'Sit awhile',state.gardenSitting?'起身':'坐一会儿'),253,610,gardenSeat);label(tr('Feed the koi','喂锦鲤'),450,610,()=>gardenFeed());target(321,435,240,105,()=>gardenFeed());label(tr('Temple','回寺庙'),400,659,()=>{activity=null;state={};updateHUD();roomIntro()});
ctx.restore()};
const gardenKeepsakeStory=keepsakeStory;keepsakeStory=function(item){if(item[0]==='Quiet garden postcard')return ['A little garden where even the koi have time for lunch.','一个连锦鲤都能慢慢吃午饭的小后院。'];return gardenKeepsakeStory(item)};

/* Slackade: a complete short rhythm round and a physical blind-box opening. */
activityTitle.rhythm=['After-hours rhythm','下班节拍'];
activityTitle.blindBox=['Lucky little boxes','摸鱼盲盒'];
roomActions.arcade=[['claw','Claw machine','夹娃娃'],['rhythm','Rhythm floor','节奏舞台'],['blindBox','Blind boxes','摸鱼盲盒']];
const arcadeReleaseStart=start;start=function(id){arcadeReleaseStart(id);if(id==='rhythm'){state.rhythmStage='intro';state.rhythmScore=0;state.rhythmCombo=0;state.rhythmBest=0;state.rhythmMiss=0;state.rhythmNotes=[];state.rhythmFlash=-100;hint('Follow the beat. Tap a lane when a note reaches the line.','跟着节奏，音符到达判定线时点击对应位置。')}if(id==='blindBox'){state.boxStage='choose';state.boxPick=-1;state.boxAt=t;state.boxShake=0;hint('Pick a sealed box. Give it a little shake.','选一个密封盲盒，轻轻摇一摇。')}};
const rhythmArrows=['←','↓','↑','→'],rhythmFreq=[261.63,329.63,392,440],rhythmColor=['#c99182','#a4bda0','#d8b77c','#8ba8bb'];
function rhythmBegin(){if(activity!=='rhythm'||state.rhythmStage!=='intro')return;state.rhythmStage='play';state.rhythmAt=t+1.8;state.rhythmNotes=Array.from({length:24},(_,i)=>({lane:(i*3+Math.floor(i/4)+Math.floor(Math.random()*2))%4,at:i*.56,status:0}));hint('No pressure. Missing a beat is part of the fun.','别紧张，漏拍也是摸鱼的一部分。')}
function rhythmHit(lane){if(activity!=='rhythm'||state.rhythmStage!=='play')return;let elapsed=t-state.rhythmAt;let n=state.rhythmNotes.filter(n=>n.status===0&&n.lane===lane&&Math.abs(n.at-elapsed)<=.29).sort((a,b)=>Math.abs(a.at-elapsed)-Math.abs(b.at-elapsed))[0];state.rhythmLane=lane;state.rhythmFlash=t;if(n){n.status=1;let perfect=Math.abs(n.at-elapsed)<.13;state.rhythmScore+=perfect?100:60;state.rhythmCombo++;state.rhythmBest=Math.max(state.rhythmBest,state.rhythmCombo);state.rhythmResult=perfect?['Perfect!','完美！']:['Nice!','不错！'];sound(rhythmFreq[lane])}else{state.rhythmResult=['A little early or late','早了一点或晚了一点'];state.rhythmCombo=0;sound(170)}}
function rhythmFinish(){if(state.rhythmStage!=='play')return;state.rhythmStage='result';state.rhythmEnd=t;let best=Number(load('rhythmHighV1',0))||0;save('rhythmHighV1',Math.max(best,state.rhythmScore));addItem('After-hours rhythm ticket','下班节拍门票');if(state.rhythmScore>=1600)addItem('Golden rhythm badge','金色节拍徽章');hint(...(state.rhythmScore>=1600?['Your boss cannot compete with those moves.','老板可比不上你的舞步。']:['You survived the dance floor. That counts.','成功存活于舞池，这就算赢了。']))}
document.addEventListener('keydown',e=>{if(activity!=='rhythm'||state.rhythmStage!=='play'||e.repeat||e.target.matches?.('input,textarea,select'))return;const l=['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'].indexOf(e.key);if(l>=0){e.preventDefault();rhythmHit(l)}});
const boxPrizes=[['Office escape cat','逃班猫','#d89858',0,'common'],['Meeting survivor cat','开会幸存猫','#ece1c6',1,'common'],['Annual leave cat','请假猫','#9399a2',4,'uncommon'],['Moonlight cat','月光猫','#44434a',2,'rare'],['Golden payday cat','金薪猫','#d1a077',3,'rare']];
function boxSelect(i){if(activity!=='blindBox'||state.boxStage!=='choose')return;state.boxPick=i;state.boxStage='shake';state.boxAt=t;sound(400);hint('Shake the box sideways, then open it.','左右摇动盒子，再打开看看。')}
function boxShake(amount){if(activity!=='blindBox'||state.boxStage!=='shake')return;state.boxShake=Math.min(100,state.boxShake+Math.max(0,Math.min(50,amount*.65)));state.boxAt=t;sound(280);if(state.boxShake>=100){state.boxStage='ready';hint('Something is rattling inside. Open it!','里面有东西在响，打开看看！')}}
function boxOpen(){if(activity!=='blindBox'||state.boxStage!=='ready')return;state.boxStage='opening';state.boxAt=t;let q=Math.random();state.boxPrize=q<.035?4:q<.13?3:q<.35?2:q<.68?1:0;sound(520)}
function boxAward(){if(state.boxStage!=='opening')return;state.boxStage='result';state.boxAt=t;let v=boxPrizes[state.boxPrize],duplicate=items.some(x=>x[0]===v[0]);addItem(v[0],v[1]);let count=Number(load('blindBoxOpenedV1',0))||0;save('blindBoxOpenedV1',count+1);hint(...(duplicate?['A familiar face! This one can keep the other one company.','又是熟面孔！正好给上一只作伴。']:v[4]==='rare'?['Rare find! The universe finally approved your leave.','稀有款！宇宙终于批准你休假了。']:['A tiny companion for your next escape.','下次摸鱼，又多了一个小伙伴。']))}
function boxArt(x,y,sc=1,i=0,open=0,tilt=0){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(tilt);let col=['#cba58a','#91aba3','#b3a2bd'][i%3];ellipse(0,9,49,11,'#292c2744');ctx.beginPath();ctx.moveTo(-44,-72);ctx.lineTo(28,-72);ctx.lineTo(44,-58);ctx.lineTo(44,0);ctx.lineTo(-28,9);ctx.lineTo(-44,-5);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#695548';ctx.stroke();ctx.beginPath();ctx.moveTo(28,-72);ctx.lineTo(28,0);ctx.lineTo(44,0);ctx.lineTo(44,-58);ctx.closePath();ctx.fillStyle='#4b443b35';ctx.fill();round(-46,-76-open*37,92,16,3,'#e8d5ad','#826a4c');line(-36,-66-open*37,35,-66-open*37,'#a7895c',2);txt('?',-8,-25,32,'#fff0cc');line(-29,-8,15,-8,'#f4e1bd',2);ctx.restore()}
const arcadeReleaseProp=prop;prop=function(id,x,y){if(id==='blindBox'){boxArt(x,y-23,.8,1);return}if(id==='rhythm'){ctx.save();ctx.translate(x,y-45);round(-50,-56,100,83,5,'#3d5350','#c9aa77');for(let i=0;i<4;i++){round(-43+i*23,-15,20,32,3,rhythmColor[i]);txt(rhythmArrows[i],-33+i*23,1,18,'#443b33')}for(let i=0;i<3;i++)ellipse(-22+i*22,-35,6,6,'#ead3a0');ctx.restore();return}return arcadeReleaseProp(id,x,y)};
const arcadeReleaseDraw=drawActivity;drawActivity=function(){if(!['rhythm','blindBox'].includes(activity))return arcadeReleaseDraw();ctx.save();paintLivingBackdrop(pics.arcade||pics.tea||pics.streetKitchen);let shade=ctx.createLinearGradient(0,280,0,700);shade.addColorStop(0,'#293e3f40');shade.addColorStop(1,'#282b32b0');shadeLivingBackdrop(shade);
if(activity==='rhythm'){let stage=state.rhythmStage,elapsed=t-(state.rhythmAt??t);if(stage==='play'){for(let n of state.rhythmNotes){if(!n.status&&elapsed-n.at>.31){n.status=2;state.rhythmMiss++;state.rhythmCombo=0}}if(elapsed>14)rhythmFinish()}let left=258,top=326,bottom=566;for(let i=0;i<4;i++){let x=left+i*71;round(x,top,65,bottom-top+45,5,'#243834a8','#bda37d');for(let j=0;j<5;j++)line(x+3,top+j*48,x+62,top+j*48,'#e9d8b528',1);round(x,bottom,65,45,5,state.rhythmLane===i&&t-state.rhythmFlash<.18?'#f5e2b1':rhythmColor[i],'#e7d2a4');txt(rhythmArrows[i],x+32,bottom+21,28,'#423a32');if(stage==='play')target(x,bottom-28,65,92,()=>rhythmHit(i))}if(stage==='play'){for(let n of state.rhythmNotes){let delta=n.at-elapsed;if(!n.status&&delta<1.8&&delta>-.31){let y=bottom+22-delta*135;ctx.save();ctx.beginPath();ctx.rect(left,top,278,285);ctx.clip();round(left+n.lane*71+7,y-18,51,36,5,rhythmColor[n.lane],'#fff0d1');txt(rhythmArrows[n.lane],left+n.lane*71+32,y,22,'#403b32');ctx.restore()}}txt(String(state.rhythmScore)+'  ·  '+tr('Combo ','连击 ')+state.rhythmCombo,400,292,18,'#fff1d2');if(elapsed<0)txt(String(Math.max(1,Math.ceil(-elapsed))),400,435,48,'#fff0bf');if(state.rhythmResult&&t-state.rhythmFlash<.6)txt(tr(...state.rhythmResult),400,638,17,'#fff1d0')}else if(stage==='intro'){txt(tr('A short dance break','来一段下班舞曲'),400,295,20,'#fff0d1');label(tr('Start the beat','开始节拍'),400,640,rhythmBegin)}else{txt(tr('Score ','得分 ')+state.rhythmScore+'  ·  '+tr('Best combo ','最高连击 ')+state.rhythmBest,400,290,17,'#fff1d2');label(tr('Play again','再来一次'),400,640,()=>start('rhythm'))}}
if(activity==='blindBox'){let stage=state.boxStage,age=t-state.boxAt;if(stage==='choose'){for(let i=0;i<3;i++){let x=270+i*130;boxArt(x,530,.9,i);target(x-48,438,96,105,()=>boxSelect(i));label(tr('Box ','盲盒 ')+(i+1),x,570,()=>boxSelect(i))}}else{let held=drag?.id==='boxShake',x=held?Math.max(290,Math.min(510,drag.x)):400,y=held?Math.max(440,Math.min(535,drag.y)):515,opening=stage==='opening'?poseEase(age/.95):stage==='result'?1:0;drawRitualPose(275,555,1.45,{reach:held?{x:x-38,y:y-35}:null});boxArt(x,y,1.15,state.boxPick,opening,held?Math.sin(t*20)*.16:age<.3&&stage==='shake'?Math.sin(age*28)*.1:0);if(stage==='opening'&&age>=.95)boxAward();if(stage==='opening'||stage==='result'){let v=boxPrizes[state.boxPrize];ctx.save();ctx.globalAlpha=Math.max(.1,opening);cat(400,450-35*opening,v[3],false,1.8);ctx.restore();if(stage==='result'){txt(tr(v[0],v[1]),400,590,19,'#fff2d1');txt(tr(v[4]==='rare'?'RARE':v[4]==='uncommon'?'UNCOMMON':'COMMON',v[4]==='rare'?'稀有款':v[4]==='uncommon'?'特别款':'普通款'),400,615,13,'#f2d49d');label(tr('Pick another','再选一个'),400,650,()=>start('blindBox'))}}if(stage==='shake'){target(330,420,140,130,()=>{},'boxShake');txt(tr('Shake ','摇动 ')+Math.round(state.boxShake)+'%',400,602,17,'#fff1d0');label(tr('Shake gently','轻轻摇晃'),400,642,()=>boxShake(70))}if(stage==='ready'){target(330,420,140,130,boxOpen);label(tr('Open the box','打开盲盒'),400,620,boxOpen)}}}ctx.restore()};
const arcadeStory=keepsakeStory;keepsakeStory=function(item){if(boxPrizes.some(v=>v[0]===item[0]))return ['A little figure from the arcade. Its only job is to keep you company.','来自游戏厅的小手办，唯一的工作就是陪你摸鱼。'];return arcadeStory(item)};

/* Reading house: a physical spread with topic choices, card handling and a saved journal. */
activityTitle.tarot=['Daily tarot','今日塔罗'];activityTitle.love=['Three-card reading','三张牌占卜'];
roomActions.tarot=[['tarot','Daily tarot','今日塔罗'],['love','Ask the cards','问问塔罗']];
const readingTopics=[['Love','感情'],['Work','事业'],['Money','财运'],['Life','生活']];
const readingPositions=[['Situation','现状'],['What needs attention','需要留意'],['A next step','下一步']];
const readingPrompts=[
 [['What feels comfortable or uncertain in your relationships?','感情里，什么让你安心，什么又让你犹豫？'],['Which needs or boundaries deserve a conversation?','有哪些需求或界限值得好好谈一谈？'],['Choose one small, kind action without forcing an outcome.','做一件小小的温柔的事，不必强求结果。']],
 [['Which part of work is taking most of your energy?','工作中，哪一部分最消耗你的精力？'],['Notice what is within your control and what is not.','分清哪些事是你能改变的，哪些不是。'],['Try one practical next step, even if it is a small one.','试着迈出实际的一小步，慢一点也没关系。']],
 [['How do your spending choices reflect your priorities?','你的消费习惯反映了怎样的生活重心？'],['Consider which commitments deserve a closer look.','想想哪些支出或承诺值得重新审视。'],['Make one realistic choice based on your budget, not the cards.','根据实际预算做一个务实的选择，而不是靠牌面决定。']],
 [['What is occupying your thoughts lately?','最近有什么事一直放在心上？'],['What might you be overlooking in your daily life?','日常生活中，有没有什么被你忽略了？'],['Choose a manageable change that feels right for you.','选一个适合自己、力所能及的小改变。']]
];
function topicReflection(topic,position){const prompt=readingPrompts[topic]?.[position];return prompt?tr(...prompt):''}
let readingJournal=load('readingJournalV1',[]);if(!Array.isArray(readingJournal))readingJournal=[];
const readingStart=start;start=function(id){readingStart(id);if(id==='tarot'||id==='love'){state.readStage=id==='love'?'topic':'deck';state.readTopic=id==='love'?null:-1;state.readShuffle=0;state.readAt=t;state.readCards=[];state.readFlip=[];state.readSaved=false;hint(...(id==='love'?['What is on your mind today?','今天想问些什么？']:['Touch the deck, or drag it sideways to shuffle.','轻触牌堆，或左右拖动洗牌。']))}};
function readingTopic(i){if(state.readStage!=='topic')return;state.readTopic=i;state.readStage='deck';state.readAt=t;hint('Shuffle the deck as much as you like.','想洗几次都可以。')}
function readingShuffle(){if(state.readStage!=='deck')return;state.readStage='shuffle';state.readShuffle++;state.readAt=t;sound(350);hint('Two halves of the deck come together.','两叠牌慢慢合在一起。')}
function readingDeal(){if(state.readStage!=='deck'||!state.readShuffle)return;state.readStage='deal';state.readAt=t;let count=activity==='love'?3:1,pool=tarotDeck.map((_,i)=>i);if(activity==='tarot'){let d=dailyCard();state.readCards=[{i:Math.max(0,tarotDeck.indexOf(d)),rev:tarotReversed('daily')}]}
else{state.readCards=Array.from({length:count},()=>{let j=Math.floor(Math.random()*pool.length);return {i:pool.splice(j,1)[0],rev:Math.random()<.5}})}state.readFlip=Array(count).fill(-1);state.readCards.forEach(v=>readingArtwork(v.i));sound(460)}
function readingReveal(i){if(state.readStage!=='cards'||!state.readCards[i]||state.readFlip[i]>=0)return;state.readFlip[i]=t;sound(490+i*90);hint('The card has a thought for you.','这张牌，有句话想对你说。')}
function readingSave(){if(state.readSaved||!state.readCards.length||!state.readFlip.every(v=>v>=0&&t-v>.6))return;state.readSaved=true;let entry={date:new Date().toISOString().slice(0,10),topic:state.readTopic,cards:state.readCards.map(v=>({...v}))};let key=JSON.stringify(entry);if(!readingJournal.some(v=>JSON.stringify(v)===key)){readingJournal.unshift(entry);readingJournal=readingJournal.slice(0,40);save('readingJournalV1',readingJournal)}if(activity==='tarot'){let d=tarotDeck[state.readCards[0].i];addItem('Daily Tarot: '+d[0],'今日塔罗：'+d[1])}else addItem('Three-card reading','三张牌占卜');hint('Your reading is tucked into your passport.','这份牌意已经收进旅人护照。')}
function readingShow(i){
 let v=state.readCards[i];if(!v||state.readFlip[i]<0||t-state.readFlip[i]<.72)return;
 state.readFocus=i;state.readStage='focus';state.readAt=t;
 hint('Study the card, then read its meaning or return to the spread.','慢慢看看牌面，再读牌意，或回到牌阵。');
}
function readingFocusMeaning(){
 const i=state.readFocus,v=state.readCards[i];if(!v)return;
 tarotDetails(tarotDeck[v.i],v.rev);const prompt=topicReflection(state.readTopic,i);if(prompt)$('line').textContent+='\n\n'+prompt;
}
function readingReturnSpread(){
 closeTalk();state.readStage='cards';state.readAt=t;
 hint('Turn the remaining cards over, or revisit any revealed card.','可以继续翻牌，也可以再看看已经翻开的牌。');
}
const readingDraw=drawActivity;drawActivity=function(){if(!['tarot','love'].includes(activity)||!state.readStage)return readingDraw();ctx.save();paintLivingBackdrop(pics.readingInterior||pics.tarot||pics.tea);let g=ctx.createLinearGradient(0,250,0,690);g.addColorStop(0,'#40373220');g.addColorStop(1,'#2a332c50');shadeLivingBackdrop(g);table();let stage=state.readStage,age=t-state.readAt;
if(stage==='topic'){txt(tr('What brings you here?','今天想问什么？'),400,365,23,'#fff0d0');readingTopics.forEach((v,i)=>{let x=305+(i%2)*190,y=455+Math.floor(i/2)*100;ctx.save();ctx.translate(x,y-28);ctx.rotate((i%2?1:-1)*.05);card(-33,-46,66,92,false);ctx.restore();label(tr(...v),x,y+39,()=>readingTopic(i));target(x-55,y-75,110,110,()=>readingTopic(i))})}
else if(stage==='deck'||stage==='shuffle'){let f=stage==='shuffle'?Math.min(1,age/1.45):0,split=Math.sin(f*Math.PI),held=drag?.id==='readShuffle',offset=held?Math.max(-45,Math.min(45,(drag.x-drag.sx)*.4)):0;for(let i=0;i<12;i++){let dir=i<6?-1:1,x=400+dir*split*83+(i-5.5)*1.8+offset,y=475-i*1.2+Math.sin(f*TAU+i)*split*7;ctx.save();ctx.translate(x,y);ctx.rotate(dir*split*.17+(held?offset*.003:0));card(-46,-68,92,136,false);ctx.restore()}if(stage==='shuffle'&&age>=1.45){state.readStage='deck';state.readAt=t;hint('Deal when you feel ready.','准备好了就发牌。')}if(stage==='deck'){target(321,381,158,173,readingShuffle,'readShuffle');label(tr('Shuffle','洗牌'),300,605,readingShuffle);if(state.readShuffle)label(tr('Deal cards','发牌'),500,605,readingDeal)}else txt(tr('Shuffling…','正在洗牌……'),400,600,20,'#fff0d2')}
else if(stage==='focus'){
 const i=state.readFocus,v=state.readCards[i];
 if(!v){readingReturnSpread();ctx.restore();return}
 const f=poseEase(age/.45),w=110+65*f,h=180+95*f;
 ctx.save();ctx.shadowColor='#29282288';ctx.shadowBlur=12;drawReadingCard(400-w/2,456-h/2,w,h,v.i,v.rev);ctx.restore();
 readingPositionCaption(state.readCards.length===3?tr(...readingPositions[i]):tr('Daily reflection','今日自省'),400,302,260);
 txt(orient(v.rev),400,607,15,'#f8e9cc');
 label(tr('Read meaning','查看牌意'),310,647,readingFocusMeaning);
 label(tr('Back to spread','返回牌阵'),490,647,readingReturnSpread);
}
else if(stage==='deal'||stage==='cards'){let n=state.readCards.length;for(let i=0;i<n;i++){let endX=n===1?400:274+i*126,sc=n===1?1.55:1.12,deal=stage==='deal'?poseEase((age-i*.22)/.65):1,x=400+(endX-400)*deal,y=465-18*Math.sin(Math.PI*deal),flip=state.readFlip[i]<0?0:Math.min(1,(t-state.readFlip[i])/.72),face=flip>=.5,w=92*sc*(flip>0&&flip<1?Math.max(.045,Math.abs(Math.cos(Math.PI*flip))):1),h=145*sc,v=state.readCards[i],d=tarotDeck[v.i];ctx.save();ctx.translate(x,y);ctx.rotate((1-deal)*.14*(i-1));if(face){drawReadingCard(-w/2,-h/2,w,h,v.i,v.rev)}else card(-w/2,-h/2,w,h,false);ctx.restore();if(stage==='cards'){target(endX-(n===1?80:60),y-h/2,n===1?160:120,h,()=>state.readFlip[i]<0?readingReveal(i):readingShow(i));if(n===3)readingPositionCaption(tr(...readingPositions[i]),endX,565,118);if(face)txt(orient(v.rev),endX,n===1?593:597,13,'#f1ddad')}}
if(stage==='deal'&&age>.65+(n-1)*.22){state.readStage='cards';state.readAt=t;hint('Turn the cards over one by one.','一张一张慢慢翻开。')}let complete=state.readFlip.every(v=>v>=0&&t-v>.72);if(stage==='cards'&&complete){if(!state.readSaved)readingSave();txt(tr('Tap a revealed card for a closer look','轻触已翻开的牌，放大查看'),400,618,13,'#f8e9cc');label(tr('Read the cards','查看牌意'),400,650,()=>{let lines=state.readCards.map((v,i)=>{let d=tarotDeck[v.i];return (n===3?tr(...readingPositions[i])+': ':'')+tr(d[0],d[1])+' · '+orient(v.rev)+'\n'+arcanaReading(d,v.rev)+(topicReflection(state.readTopic,i)?'\n'+topicReflection(state.readTopic,i):'')});say(tr('Fortune Teller','占卜师'),lines.join('\n\n')+'\n\n'+tr('The future is not a deadline.','未来又不是截止日期。'))})}else if(stage==='cards')txt(tr('Choose a card to turn','点击牌面翻开'),400,622,16,'#fff0d2')}
ctx.restore()};
function openReadingJournal(){activePage='readingJournal';page(tr('Reading journal','塔罗手记'),tr('Reflections from your visits, not predictions.','每次来访的心情记录，并非预言。'),q=>{let book=element('section','',q,'travelAlbum');if(!readingJournal.length)element('p',tr('Your first reading will appear here.','第一次占卜之后，手记会出现在这里。'),book);for(let v of readingJournal){let a=element('article','',book,'albumCard');element('strong',v.date+' · '+(v.topic<0||v.topic===null?tr('Daily tarot','今日塔罗'):tr(...(readingTopics[v.topic]||readingTopics[3]))),a);for(let [i,d] of (v.cards||[]).entries()){let cardData=tarotDeck[d.i];if(!cardData)continue;let item=element('div','',a);element('p',tr(cardData[0],cardData[1])+' · '+orient(d.rev),item);element('small',arcanaReading(cardData,d.rev),item);const prompt=topicReflection(v.topic,i);if(prompt)element('p',prompt,item)}}b(book,tr('Back to passport','返回护照'),passport)})}
const readingPassport=passport;passport=function(){readingPassport();let book=$('content').querySelector('.travelAlbum');if(book)b(book,tr('Reading journal','塔罗手记')+' ('+readingJournal.length+')',openReadingJournal)};$('dockPassport').onclick=passport;
const collectionMore=[['Quiet garden postcard','静谧后院明信片','stamp'],['Temple cat blessing','庙猫的祝福','cat'],['After-hours rhythm ticket','下班节拍门票','stamp'],['Golden rhythm badge','金色节拍徽章','stamp'],...boxPrizes.map(v=>[v[0],v[1],'cat']),...teaChoices.map(v=>[v[0]+' recipe',v[1]+'配方','stamp'])];for(let item of collectionMore)if(!keepsakes.some(v=>v[0]===item[0]))keepsakes.push(item);
const collectionClue=keepsakeClue;keepsakeClue=function(item){let n=item[0];if(boxPrizes.some(v=>v[0]===n))return ['Open a blind box in the arcade','去游戏厅开盲盒'];if(/recipe$/.test(n))return ['Make a drink with Grandma','跟外婆做一杯奶茶'];if(n==='Quiet garden postcard')return ['Feed the koi in the hidden garden','去后院喂锦鲤'];if(n==='Temple cat blessing')return ['Befriend the temple cat','和庙猫做朋友'];if(n.includes('rhythm'))return ['Try the arcade rhythm floor','试试游戏厅节奏舞台'];return collectionClue(item)};


/* Authored room staging. Coordinates are in the same world space as props and camera.
   Floor footprints are conservative for the current draft artwork; revise with final art. */
const indoorStages={
 tarot:{entry:[190,730],arrival:[225,685],stations:{tarot:[270,440,270,615],love:[530,440,530,615]}},
 destiny:{entry:[190,730],arrival:[240,685],stations:{destiny:[400,440,400,615]}},
 wishes:{entry:[615,730],arrival:[580,680],stations:{wishes:[270,440,270,615],coin:[530,440,530,615]}},
 fish:{entry:[180,730],arrival:[220,680],stations:{hit:[215,478,215,615],pier:[400,478,400,615],riverShout:[585,478,585,615]}},
 tea:{entry:[610,730],arrival:[575,680],stations:{chat:[270,440,270,615],board:[530,440,530,615],news:[400,440,400,615]}},
 office:{entry:[190,730],arrival:[230,685],stations:{officeSketch:[400,440,400,615]}},
 park:{entry:[610,730],arrival:[575,680],stations:{pet:[270,440,270,615],chat:[530,440,530,615]}},
 kitchen:{entry:[190,730],arrival:[235,680],stations:{cook:[270,440,270,615],bubbleTea:[530,440,530,615]}},
 arcade:{entry:[610,730],arrival:[580,680],stations:{claw:[215,430,215,615],rhythm:[400,430,400,615],blindBox:[585,430,585,615]}},
 mystery:{entry:[190,730],arrival:[235,680],stations:{mystery:[400,440,400,615]}},
 quiz:{entry:[190,730],arrival:[235,680],stations:{quiz:[400,440,400,615]}},
 story:{entry:[610,730],arrival:[575,680],stations:{story:[400,440,400,615]}},
 match:{entry:[610,730],arrival:[575,680],stations:{match:[400,440,400,615]}},
 temple:{entry:[400,735],arrival:[400,700],stations:{
  templeWater:[215,380,215,505],prayer:[400,380,400,520],templeBell:[585,380,585,505],
  sticks:[200,570,200,710],moon:[600,570,600,710],secretGarden:[400,610,400,730]
 }}
};
let continuityRoom=null,continuityActivity=null;
let indoor={x:400,y:700,tx:400,ty:700,facing:'up',last:0,goal:null,route:[]};
function indoorReady(){return !!room&&!activity&&!transitioning&&proposal.hidden&&$('page').style.display!=='block'&&avatar!==null}
function indoorSpec(){return indoorStages[room]||{entry:[190,730],arrival:[235,680],stations:{}}}
function indoorStation(id,index=0,count=1){
 const spec=indoorSpec(),known=spec.stations[id];if(known)return known;
 const x=count===1?400:count===2?270+260*index:215+185*(index%3);
 return [x,440,x,615]
}
function indoorObstacles(){
 const spec=indoorSpec(),ids=room==='temple'?Object.keys(spec.stations):(roomActions[room]||[]).map(v=>v[0]);
 return ids.map((id,i)=>{const [x,y]=indoorStation(id,i,ids.length);return {l:x-48,r:x+48,u:y-44,d:y+25}})
}
function indoorSafe(x,y,obstacles=indoorObstacles()){
 return x>=145&&x<=655&&y>=(room==='temple'?480:565)&&y<=738&&!obstacles.some(o=>x>o.l-13&&x<o.r+13&&y>o.u-12&&y<o.d+12)
}
function indoorSegment(a,b,obstacles){
 const steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/12));
 for(let i=1;i<=steps;i++){const f=i/steps;if(!indoorSafe(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,obstacles))return false}
 return true
}
function indoorPath(from,to,obstacles=indoorObstacles()){
 if(!indoorSafe(...to,obstacles))return null;
 if(indoorSegment(from,to,obstacles))return [to];
 // Small deterministic visibility graph around prop footprints, never time-trigger an action.
 const nodes=[from,to];for(const o of obstacles)for(const x of [o.l-18,o.r+18])for(const y of [o.u-17,o.d+17])if(indoorSafe(x,y,obstacles))nodes.push([x,y]);
 for(const x of [145,320,400,480,655])for(const y of [500,550,600,660,730])if(indoorSafe(x,y,obstacles))nodes.push([x,y]);
 const d=nodes.map(()=>Infinity),prev=nodes.map(()=>-1),used=new Set();d[0]=0;
 while(used.size<nodes.length){
  let u=-1;for(let i=0;i<nodes.length;i++)if(!used.has(i)&&(u<0||d[i]<d[u]))u=i;
  if(u<0||!Number.isFinite(d[u]))break;if(u===1){const out=[];for(let j=1;j>0;j=prev[j])out.unshift(nodes[j]);return out}
  used.add(u);for(let v=1;v<nodes.length;v++){if(used.has(v)||!indoorSegment(nodes[u],nodes[v],obstacles))continue;const nd=d[u]+Math.hypot(nodes[u][0]-nodes[v][0],nodes[u][1]-nodes[v][1]);if(nd<d[v]){d[v]=nd;prev[v]=u}}
 }return null
}
function indoorDestination(x,y,goal=null,facing=null){
 const obs=indoorObstacles();x=clamp(x,145,655);y=clamp(y,room==='temple'?480:565,738);
 if(!indoorSafe(x,y,obs)){if(goal){hint('Try the clear path beside the station.','请从体验区旁边的小路过去。');return false}return false}
 const route=indoorPath([indoor.x,indoor.y],[x,y],obs);
 if(!route){if(goal)hint('Try the clear path beside the station.','请从体验区旁边的小路过去。');return false}
 indoor.route=route;[indoor.tx,indoor.ty]=route.shift();indoor.goal=goal;indoor.goalFacing=facing;return true
}
function markIndoorStation(id,from,anchor){
 for(const h of hit.slice(from)){h.stationId=id;h.approach=anchor}
}
const continuityRoomDraw=drawRoom;
drawRoom=function(){
 const first=hit.length;if(room==='fish'){riverSceneBackdrop();riverAuntie(147,466,.78)}continuityRoomDraw();
 if(!room||avatar===null)return;
 if(continuityRoom!==room){continuityRoom=room;const spec=indoorSpec();indoor={x:spec.entry[0],y:spec.entry[1],tx:spec.entry[0],ty:spec.entry[1],facing:'up',last:t,goal:null,route:[]};indoorDestination(...spec.arrival)}
 if(continuityActivity!==null){continuityActivity=null;indoor.last=t;indoor.goal=null;indoor.route=[];indoor.tx=indoor.x;indoor.ty=indoor.y}
 const delta=Math.max(0,Math.min(.05,t-indoor.last));indoor.last=t;
 for(let h of hit.slice(first)){
  const fn=h.fn;
  // Unmarked ambient objects (e.g. the temple cat) remain optional, not a teleport.
  const a=h.approach||[clamp(h.x+h.w/2,145,655),room==='temple'?520:615];
  h.fn=()=>{if(!indoorReady())return;if(indoorDestination(a[0],a[1],fn,'up'))hint('Walking over…','走过去看看……')};
 }
 if(indoorReady()){
  let dx=Number(!!(keys.ArrowRight||keys.d))-Number(!!(keys.ArrowLeft||keys.a)),dy=Number(!!(keys.ArrowDown||keys.s))-Number(!!(keys.ArrowUp||keys.w));
  if(dx||dy){let norm=Math.hypot(dx,dy);indoorDestination(indoor.x+dx/norm*45,indoor.y+dy/norm*45)}
  let vx=indoor.tx-indoor.x,vy=indoor.ty-indoor.y,dist=Math.hypot(vx,vy);
  if(dist>2){indoor.facing=Math.abs(vy)>Math.abs(vx)?(vy<0?'up':'down'):(vx<0?'left':'right');let amount=Math.min(dist,delta*Math.min(235,Math.max(65,dist*5)));indoor.x+=vx/dist*amount;indoor.y+=vy/dist*amount}
  if(dist<=3){
   indoor.x=indoor.tx;indoor.y=indoor.ty;
   if(indoor.route.length){[indoor.tx,indoor.ty]=indoor.route.shift()}
   else if(indoor.goal){const fn=indoor.goal,expectedRoom=room;indoor.goal=null;indoor.facing=indoor.goalFacing||'up';if(indoorReady()&&room===expectedRoom)fn()}
  }
  if(dist>5){ctx.save();ctx.globalAlpha=.4;ellipse(indoor.tx,indoor.ty,9,3,'#ead3a4');ctx.restore()}
 }
 const usable=Math.max(160,H-230),screenHeight=clamp(usable*.16,60,90),scale=clamp(screenHeight/(94*Math.max(.1,cam.scale)),1.08,2.1);
 ctx.save();backHuman(indoor.x,indoor.y,avatar,Math.hypot(indoor.tx-indoor.x,indoor.ty-indoor.y)>3,indoor.facing,scale);ctx.restore();
};
c.addEventListener('pointerup',e=>{if(!indoorReady()||!drag||drag.moved>30||drag.h)return;const a=point(e);indoorDestination(a.x,a.y)},true);
const indoorControlStyle=document.createElement('style');indoorControlStyle.textContent='#movePad[data-indoor="true"]{bottom:calc(env(safe-area-inset-bottom,0px) + 76px);z-index:4}';document.head.append(indoorControlStyle);
function indoorControls(){const mode=String(indoorReady());if(movePad.dataset.indoor!==mode)movePad.dataset.indoor=mode;if(!room)continuityRoom=null;setTimeout(indoorControls,100)}setTimeout(indoorControls,0);
const continuityActivityDraw=drawActivity;
drawActivity=function(){
 continuityActivityDraw();
 continuityActivity=activity;
 if(!activity||avatar===null)return;
 // Activities with articulated player poses already render their own traveller.
 if(['prayer','sticks','templeBell','templeWater','secretGarden','blindBox','bubbleTea','wonderScene','tarot','love','story','match','fish','cook','pet','hit','riverBottle','riverShout','claw','rhythm','moon','templePaper','wishes'].includes(activity))return;
 const b=livingBounds(),x=Math.max(b.x+65,Math.min(250,b.x+b.w-65)),y=Math.max(b.y+130,Math.min(550,b.y+b.h-100));
 ctx.save();backHuman(x,y,avatar,false,'right',1.05);ctx.restore();
};

/* Mobile HUD: independent rows prevent language controls covering counters. */
const mobileHudLayout=document.createElement('style');
mobileHudLayout.textContent=`
@media(max-width:600px){
 #hud{top:calc(env(safe-area-inset-top,0px) + 8px)!important;left:8px!important;right:8px!important;padding:0!important;display:flex!important;justify-content:space-between!important;align-items:center!important;gap:6px!important;min-height:44px!important}
 #profileHud{max-width:49%!important;min-width:0!important;flex:0 1 auto!important;padding:4px 8px 4px 4px!important}
 #hudName{max-width:80px!important}
 #hudStats{position:static!important;display:flex!important;flex:0 0 auto!important;gap:4px!important;margin:0!important}
 #hudStats span{padding:5px 7px!important;font-size:11px!important}
 #small{top:calc(env(safe-area-inset-top,0px) + 62px)!important;right:8px!important;left:auto!important;z-index:4!important}
 #small .languageChoice button{min-height:44px!important;min-width:44px!important;padding:5px 7px!important}
 #hud #location{top:54px!important;left:8px!important;transform:none!important;max-width:calc(100% - 175px)!important;overflow:hidden;text-overflow:ellipsis}
 #lunarBtn{top:calc(env(safe-area-inset-top,0px) + 112px)!important;right:8px!important}
 #quietToggle{top:calc(env(safe-area-inset-top,0px) + 156px)!important;right:8px!important}
 #back{top:calc(env(safe-area-inset-top,0px) + 112px)!important;left:8px!important}
}
`;document.head.append(mobileHudLayout);

/* Compact analogue-style touch control and explicit language state. */
const controlPolish=document.createElement('style');controlPolish.textContent=`
#small .languageChoice button[aria-pressed="true"],#proposal .languageChoice button[aria-pressed="true"]{background:#34483c!important;color:#fff2d9!important;outline:2px solid #e3ca99;outline-offset:-3px}
#small .languageChoice button[aria-pressed="false"],#proposal .languageChoice button[aria-pressed="false"]{background:#f1dfb4!important;color:#304337!important;outline:none}
#movePad{width:88px;height:88px;display:block!important;border-radius:50%;background:#263a3266;border:1px solid #f1dfb488;touch-action:none;z-index:4;user-select:none}
#movePad[hidden]{display:none!important}
#movePad button{display:none!important}
#movePad .joystickThumb{position:absolute;left:50%;top:50%;width:36px;height:36px;border-radius:50%;background:#f1dfb4dd;border:1px solid #fff4db;transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 2px 6px #263a3255}
#movePad .joystickCompass{position:absolute;inset:0;display:grid;place-items:center;color:#fff4dca0;font:12px system-ui;pointer-events:none}
#moveGuide{pointer-events:none!important;max-width:calc(100vw - 30px)}
#moveGuide button{pointer-events:auto}
`;document.head.append(controlPolish);
const joystickThumb=element('span','',movePad,'joystickThumb');element('span','✦',movePad,'joystickCompass');
movePad.setAttribute('aria-label',tr('Movement joystick','移动摇杆'));let joystickPointer=null;
function joystickReset(){joystickPointer=null;releaseWalkKeys();joystickThumb.style.transform='translate(-50%,-50%)'}
function joystickMove(e){let rect=movePad.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,len=Math.hypot(dx,dy),f=Math.min(1,25/Math.max(1,len));joystickThumb.style.transform='translate(calc(-50% + '+dx*f+'px),calc(-50% + '+dy*f+'px))';keys.ArrowLeft=dx<-8;keys.ArrowRight=dx>8;keys.ArrowUp=dy<-8;keys.ArrowDown=dy>8}
movePad.addEventListener('pointerdown',e=>{if(movePad.hidden)return;e.preventDefault();joystickPointer=e.pointerId;movePad.setPointerCapture(e.pointerId);joystickMove(e)});
movePad.addEventListener('pointermove',e=>{if(joystickPointer===e.pointerId)joystickMove(e)});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])movePad.addEventListener(ev,e=>{if(joystickPointer===e.pointerId)joystickReset()});
window.addEventListener('blur',joystickReset);
/* Shared movement integrator. */
step=function(n,dt,speed){
 dt=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;
 if(n===p&&isRoute()&&!room&&!pending){n.tx=clamp(n.tx,405,595);if(Math.abs(n.ty-n.y)>35)speed=Math.min(speed,250)}
 if(n!==p&&isRoute()&&!room&&Math.hypot(n.x-p.x,n.y-p.y)<58){let side=n.x<p.x?-1:1;if(Math.abs(n.x-p.x)<12)side=p.x<500?1:-1;n.tx=clamp(p.x+side*80,395,605);n.ty=n.y}
 const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);
 if(!Number.isFinite(d)){if(n===p)resetPosition();return false}
 if(d<=2){n.x=n.tx;n.y=n.ty;n.motionSpeed=0;return false}
 const wanted=n===p?Math.min(speed,Math.max(40,d*7)):speed;
 n.motionSpeed=n===p?(n.motionSpeed||0)+(wanted-(n.motionSpeed||0))*Math.min(1,dt*12):wanted;
 const amount=Math.min(d,n.motionSpeed*dt);n.x+=dx/d*amount;n.y+=dy/d*amount;return true
};
const stairRoomIntro=roomIntro;
roomIntro=function(){stairRoomIntro();if(room&&!activity)hint('Walk around, or tap a station to approach it.','自由走动，或点击体验区走过去。')};

/* Recover corrupt coordinates before the camera is calculated, never reposition for ordinary camera lag. */
function ensureTravellerCoordinates(){if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(p.tx)||!Number.isFinite(p.ty)){resetPosition();p.motionSpeed=0}}

/* A reachable consultation control in Destiny House, independent of canvas hit testing. */
const destinyAccess=element('button','',document.body);destinyAccess.id='destinyAccess';destinyAccess.hidden=true;
destinyAccess.style.cssText='position:fixed;z-index:5;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 145px);min-height:44px;max-width:70vw;background:#ead9b5;color:#453b2f;border:1px solid #9b805e;font:14px Georgia,serif';
destinyAccess.onclick=()=>{if(!indoorReady()||room!=='destiny')return;releaseWalkKeys();const a=indoorStation('destiny').slice(2);indoorDestination(a[0],a[1],()=>{try{destinyPage()}catch(err){console.error('Destiny consultation:',err);$('page').style.display='none';hint('The consultation could not open. Try again or step outside.','命理咨询暂时无法打开，请重试或先出门。')}},'up')};
function destinyAccessTick(){const hide=!(room==='destiny'&&!activity&&!transitioning&&proposal.hidden&&$('page').style.display!=='block');if(destinyAccess.hidden!==hide)destinyAccess.hidden=hide;if(!hide){const label=tr('Consult Master Yue','请月师傅看命盘');if(destinyAccess.textContent!==label)destinyAccess.textContent=label}setTimeout(destinyAccessTick,100)}setTimeout(destinyAccessTick,0);

/* Recover from a failed transition and retain a usable exit in all houses. */
const houseBack=$('back'),houseBackBefore=houseBack.onclick;
houseBack.onclick=function(e){releaseWalkKeys();indoor.goal=null;indoor.route=[];indoor.tx=indoor.x;indoor.ty=indoor.y;if(room&&!activity&&indoorReady()&&continuityRoom===room){const spec=indoorSpec();if(Math.hypot(indoor.x-spec.entry[0],indoor.y-spec.entry[1])>4){if(indoorDestination(spec.entry[0],spec.entry[1],()=>houseBackBefore.call(houseBack,e),'down')){hint('Heading outside…','走到门口……');return}}}return houseBackBefore.call(this,e)};
const originalHouseEnter=enter;
enter=function(id){releaseWalkKeys();joystickReset();continuityRoom=null;continuityActivity=null;indoor.goal=null;return originalHouseEnter(id)};
const houseFade=fade;
fade=function(fn,kind='gust',destination=null){
 const began=performance.now();const result=houseFade(fn,kind,destination);
 setTimeout(()=>{if(transitioning&&performance.now()-began>=2400){$('game').querySelectorAll('#sceneCrossfade').forEach(n=>n.remove());const overlay=$('fade');overlay.className='';overlay.style.opacity='';transitioning=false;updateHUD()}},2500);return result
};

/* Optional recovery navigation, accessible even when the world canvas fails. */
const recoveryStyle=document.createElement('style');recoveryStyle.textContent='#journeyRecovery{position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);z-index:27;min-height:44px;background:#ead9b5;color:#453b2f;border:1px solid #9b805e;border-radius:8px;padding:8px 12px;font:13px Georgia,serif}#journeyRecovery[hidden]{display:none!important}';document.head.append(recoveryStyle);
const journeyRecovery=element('button','',document.body);journeyRecovery.id='journeyRecovery';journeyRecovery.hidden=true;
journeyRecovery.onclick=()=>{releaseWalkKeys();stopRoute();indoor.goal=null;activity=null;room=null;state={};transitioning=false;continuityRoom=null;continuityActivity=null;document.querySelectorAll('#sceneCrossfade').forEach(n=>n.remove());$('fade').className='';$('fade').style.opacity='';$('page').style.display='none';closeTalk();resetPosition();updateHUD();hint('Back on the village path. Tap a doorway to explore.','已回到村庄小路，点击门口继续探索。')};
let lastHealthyFrame=performance.now(),frameFault=null;
const originalSafeLoop=loop;
loop=function(ms){try{ctx.setTransform(c.width/Math.max(1,W),0,0,c.height/Math.max(1,H),0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';originalSafeLoop(ms);lastHealthyFrame=performance.now();frameFault=null}catch(err){if(!frameFault)console.error('MeowBox frame error',err);frameFault=err;ctx.setTransform(c.width/Math.max(1,W),0,0,c.height/Math.max(1,H),0,0);requestAnimationFrame(loop)}};
function recoveryTick(){const stalled=performance.now()-lastHealthyFrame>1500||!!frameFault,hide=!proposal.hidden||!stalled;if(journeyRecovery.hidden!==hide)journeyRecovery.hidden=hide;if(!hide){const label=tr('Return to path','返回小路');if(journeyRecovery.textContent!==label)journeyRecovery.textContent=label}setTimeout(recoveryTick,150)}setTimeout(recoveryTick,0);

/* Route taps intercepted by the canvas to the visible sign at that screen position. */
const touchSignStyle=document.createElement('style');touchSignStyle.textContent='#worldSigns{z-index:3!important;pointer-events:none!important}#worldSigns .worldSign{pointer-events:auto!important;touch-action:manipulation!important}';document.head.append(touchSignStyle);
let signPress=null,signClickSuppressedUntil=0,signClickSuppressedDoor=null;
function signAtScreen(x,y){if(room||transitioning||!proposal.hidden||signRoot.hidden)return null;for(const el of signButtons.values()){if(el.hidden)continue;const r=el.getBoundingClientRect();if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return el}return null}
document.addEventListener('pointerdown',e=>{
 if(e.button!==0||room||transitioning||!proposal.hidden||signRoot.hidden||signPress)return;
 const el=e.target.closest?.('.worldSign')||(e.target===c?signAtScreen(e.clientX,e.clientY):null);
 const door=el?.dataset.door,station=maps[scene].st.find(v=>v[0]===door);
 if(!el||el.hidden||!station)return;
 // Preserve the selected door and allow a native button click as a fallback.
 signPress={el,id:e.pointerId,x:e.clientX,y:e.clientY,scene,station};
 drag=null;
 if(e.target===c){e.preventDefault();e.stopImmediatePropagation()}
 try{el.setPointerCapture(e.pointerId)}catch{}
},true);
document.addEventListener('pointerup',e=>{
 const a=signPress;if(!a||a.id!==e.pointerId)return;
 signPress=null;drag=null;
 if(a.scene!==scene||room||transitioning||Math.hypot(e.clientX-a.x,e.clientY-a.y)>=30){
  signClickSuppressedDoor=a.station[0];signClickSuppressedUntil=performance.now()+400;return;
 }
 const [id,x,y]=a.station;
 directSignClick(id,x,y);
 if(pending===id||room===id){
  signClickSuppressedDoor=id;signClickSuppressedUntil=performance.now()+400;
 }
},true);
document.addEventListener('pointercancel',e=>{if(signPress?.id===e.pointerId)signPress=null},true);
document.addEventListener('lostpointercapture',e=>{if(signPress?.id===e.pointerId)signPress=null},true);
window.addEventListener('blur',()=>{signPress=null});
/* Bound the walking-to-door sequence so mobile navigation cannot strand a player. */
let doorAttempt=0;
const walkDoorStable=walkDoor;
walkDoor=function(id,x,y){
 if(room||transitioning)return;
 if(pending===id)return;releaseWalkKeys();guideDismissed=true;moveGuide.hidden=true;save('movementTutorialDone',true);const token=++doorAttempt;
 walkDoorStable(id,x,y);
 setTimeout(()=>{if(token!==doorAttempt||room||pending!==id)return;releaseWalkKeys();stopRoute();p.tx=p.x;p.ty=p.y;p.motionSpeed=0;enter(id)},6500)
};
const cleanMobileFade=fade;
fade=function(fn,kind='gust',destination=null){
 if(kind==='postcard')return cleanMobileFade(fn,kind,destination);
 if(transitioning)return;
 transitioning=true;
 document.querySelectorAll('#sceneCrossfade').forEach(n=>n.remove());
 const overlay=$('fade');overlay.className='';overlay.style.opacity='0';overlay.style.pointerEvents='none';
 try{fn()}catch(err){console.error('Room transition',err)}finally{transitioning=false;overlay.style.opacity='';updateHUD()}
};
const screenCleanStyle=document.createElement('style');screenCleanStyle.textContent='#sceneCrossfade{display:none!important}#worldSigns .worldSign{font-size:clamp(12px,3.3vw,16px)!important;padding:6px 10px!important;min-height:44px!important}';document.head.append(screenCleanStyle);

/* Keep mobile HUD clear of the path and avoid repeated layout updates. */
const valleyInterface=document.createElement('style');valleyInterface.textContent=`
@media(max-width:600px){
 #worldSigns .worldSign{background:#f2e3c7ed!important;border:1px solid #a58b62!important;border-radius:4px!important;box-shadow:0 2px 5px #30291e33!important;font:600 12px/1.15 Georgia,serif!important;padding:5px 9px!important;max-width:125px!important;min-height:44px!important}
 #movePad{width:78px!important;height:78px!important;left:12px!important}
 #moveGuide{bottom:calc(env(safe-area-inset-bottom,0px) + 180px)!important}
 #journeyRecovery{font:12px system-ui!important;min-height:44px!important}
 #profileHud{max-width:55%!important}
 #hudName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
}
`;document.head.append(valleyInterface);
const originalRouteFrame=drawRoute;
drawRoute=function(){ctx.save();try{originalRouteFrame()}finally{ctx.restore()}};

/* A single non-recursive illustrated traveller renderer for every direction. */
backHuman=function(x,y,kind,walking,facing,sc=1){
 const k=Number.isFinite(kind)?((kind%4)+4)%4:0;
 const direction=['up','down','left','right'].includes(facing)?facing:'down';
 const im=pics['walker'+k+(direction==='up'?1:direction==='down'?0:2)];
 if(!im?.naturalWidth){return human9(x,y,k,walking,direction==='left'?-1:1,sc)}
 ctx.save();try{
  ctx.translate(x,y);ctx.scale(sc,sc);ellipse(0,0,14,3,'#302a2438');
  const bob=walking?Math.abs(Math.sin(t*13))*1.6:0;
  ctx.translate(0,-bob);if(direction==='left')ctx.scale(-1,1);
  const h=94,w=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,-w/2,-h,w,h)
 }finally{ctx.restore()}
};
const singleActorProps=prop;
prop=function(id,x,y){
 if(id==='chat'){
  ctx.save();round(x-38,y-29,76,14,4,'#ae8b66','#73553c');line(x-29,y-15,x-29,y+7,'#73553c',5);line(x+29,y-15,x+29,y+7,'#73553c',5);ctx.restore();return
 }
 if(id==='destiny'){
  ctx.save();round(x-48,y-68,96,66,5,'#b08c64','#674c3c');round(x-39,y-61,77,49,2,'#f1dfb5','#a78559');
  ellipse(x,y-37,19,19,'#d4bd8b');ctx.strokeStyle='#8b6a52';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y-37,17,0,TAU);ctx.stroke();for(let i=0;i<8;i++){let ang=i*TAU/8;line(x+7*Math.cos(ang),y-37+7*Math.sin(ang),x+17*Math.cos(ang),y-37+17*Math.sin(ang),'#8b6a52',1)}ctx.restore();return
 }
 return singleActorProps(id,x,y)
};

/* Portrait rooms: give the player a consistent floor-level stage. */
const portraitRoomStyle=document.createElement('style');portraitRoomStyle.textContent=`
@media(max-width:600px){
 #hint{max-width:calc(100vw - 118px)!important;left:calc(50% + 34px)!important;font-size:12px!important;white-space:normal!important}
 #destinyAccess{bottom:calc(env(safe-area-inset-bottom,0px) + 150px)!important;font-size:12px!important;padding:7px 12px!important}
}
`;document.head.append(portraitRoomStyle);
const portraitRoomDraw=drawRoom;
drawRoom=function(){
 if(W<H&&room!=='temple'){
  // A single floor wash keeps stations and the traveller legible on busy illustrations.
  const b=livingBounds();ctx.save();let g=ctx.createLinearGradient(0,500,0,b.y+b.h);g.addColorStop(0,'#473b2b00');g.addColorStop(1,'#453b2b55');ctx.fillStyle=g;ctx.fillRect(b.x,500,b.w,Math.max(0,b.y+b.h-500));ctx.restore();
 }
 portraitRoomDraw()
};

/* Make station labels readable and avoid overlapping adjacent touch targets. */
const roomStationLabel=label;
label=function(name,x,y,fn){
 if(!room||activity)return roomStationLabel(name,x,y,fn);
 ctx.save();try{
 const size=Math.max(14,12/Math.max(.1,cam.scale));ctx.font='600 '+size+'px Georgia,serif';
 const maxWidth=room==='temple'?160:roomActions[room]?.length>=3?155:245,w=Math.min(maxWidth,ctx.measureText(name).width+20);
 const h=Math.max(30,32/Math.max(.2,cam.scale));round(x-w/2,y-h/2,w,h,7,'#f3e5ccf0','#a78d68');
 ctx.save();ctx.beginPath();ctx.rect(x-w/2+4,y-h/2,w-8,h);ctx.clip();let words=name.split(' '),lines=[name];if(ctx.measureText(name).width>w-12&&words.length>1){let split=Math.ceil(words.length/2);lines=[words.slice(0,split).join(' '),words.slice(split).join(' ')]}for(let i=0;i<lines.length;i++)txt(lines[i],x,y+(i-(lines.length-1)/2)*size*.95,Math.min(size,(w-10)/Math.max(1,ctx.measureText(lines[i]).width)*size),'#514333');ctx.restore();
 target(x-w/2,y-h/2,w,h,fn);
 }finally{ctx.restore()}
};
const refinedHUDStyle=document.createElement('style');refinedHUDStyle.textContent=`
@media(max-width:600px){
 #hud{gap:4px!important}
 #profileHud{max-width:52%!important}
 #small{right:8px!important}
 #hint{bottom:calc(env(safe-area-inset-bottom,0px) + 82px)!important}
 #movePad{bottom:calc(env(safe-area-inset-bottom,0px) + 88px)!important}
 #dock button{min-width:0!important}
 #dock button span{font-size:11px!important}
}
`;document.head.append(refinedHUDStyle);

/* Reading card typography is bounded to a dedicated footer; illustrations never cover text. */
function drawReadingCard(x,y,w,h,index,reversed){
 const d=tarotDeck[index];if(!d)return;
 ctx.save();try{
 round(x,y,w,h,5,'#f4e7c9','#ad9366');
 if(w<24)return;
 round(x+3,y+3,w-6,h-6,3,null,'#c1a477');
 const inset=5,artH=h*.70;
 paintReadingArtwork(x+inset,y+inset,w-inset*2,artH,index,reversed);
 line(x+inset,y+artH+9,x+w-inset,y+artH+9,'#ba9a70',.8);
 const name=tr(d[0],d[1]),max=w-12;
 ctx.beginPath();ctx.rect(x+5,y+artH+10,w-10,h-artH-14);ctx.clip();
 ctx.font='11px Georgia,serif';let words=name.split(' '),lines=[],row='';
 for(const word of words){let test=row?row+' '+word:word;if(row&&ctx.measureText(test).width>max){lines.push(row);row=word}else row=test}if(row)lines.push(row);
 if(lines.length>2)lines=[name];
 const center=y+artH+10+(h-artH-14)/2;
 lines.forEach((v,j)=>{ctx.font='11px Georgia,serif';let measured=ctx.measureText(v).width;let size=Math.min(11,11*max/Math.max(1,measured));ctx.font=size+'px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#594535';ctx.fillText(v,x+w/2,center+(j-(lines.length-1)/2)*11,max)});
 }finally{ctx.restore()}
}
/* The shared articulated pose above is authoritative; callers use its returned wrist coordinates. */

/* Authentic public-domain Rider–Waite–Smith art, sourced from the verified 78-card set.
   Lazy load only dealt cards; retain a local symbolic fallback if offline.
   Pamela Colman Smith, 1909. Source: https://github.com/sixseeds/tarot-api */
const readingImageFiles={"The Fool":"ar00.jpg","The Magician":"ar01.jpg","The High Priestess":"ar02.jpg","The Empress":"ar03.jpg","The Emperor":"ar04.jpg","The Hierophant":"ar05.jpg","The Lovers":"ar06.jpg","The Chariot":"ar07.jpg","Strength":"ar08.jpg","The Hermit":"ar09.jpg","Wheel of Fortune":"ar10.jpg","Justice":"ar11.jpg","The Hanged Man":"ar12.jpg","Death":"ar13.jpg","Temperance":"ar14.jpg","The Devil":"ar15.jpg","The Tower":"ar16.jpg","The Star":"ar17.jpg","The Moon":"ar18.jpg","The Sun":"ar19.jpg","Judgement":"ar20.jpg","The World":"ar21.jpg","Ace of Wands":"wa01.jpg","Two of Wands":"wa02.jpg","Three of Wands":"wa03.jpg","Four of Wands":"wa04.jpg","Five of Wands":"wa05.jpg","Six of Wands":"wa06.jpg","Seven of Wands":"wa07.jpg","Eight of Wands":"wa08.jpg","Nine of Wands":"wa09.jpg","Ten of Wands":"wa10.jpg","Page of Wands":"wa11.jpg","Knight of Wands":"wa12.jpg","Queen of Wands":"wa13.jpg","King of Wands":"wa14.jpg","Ace of Cups":"cu01.jpg","Two of Cups":"cu02.jpg","Three of Cups":"cu03.jpg","Four of Cups":"cu04.jpg","Five of Cups":"cu05.jpg","Six of Cups":"cu06.jpg","Seven of Cups":"cu07.jpg","Eight of Cups":"cu08.jpg","Nine of Cups":"cu09.jpg","Ten of Cups":"cu10.jpg","Page of Cups":"cu11.jpg","Knight of Cups":"cu12.jpg","Queen of Cups":"cu13.jpg","King of Cups":"cu14.jpg","Ace of Swords":"sw01.jpg","Two of Swords":"sw02.jpg","Three of Swords":"sw03.jpg","Four of Swords":"sw04.jpg","Five of Swords":"sw05.jpg","Six of Swords":"sw06.jpg","Seven of Swords":"sw07.jpg","Eight of Swords":"sw08.jpg","Nine of Swords":"sw09.jpg","Ten of Swords":"sw10.jpg","Page of Swords":"sw11.jpg","Knight of Swords":"sw12.jpg","Queen of Swords":"sw13.jpg","King of Swords":"sw14.jpg","Ace of Pentacles":"pe01.jpg","Two of Pentacles":"pe02.jpg","Three of Pentacles":"pe03.jpg","Four of Pentacles":"pe04.jpg","Five of Pentacles":"pe05.jpg","Six of Pentacles":"pe06.jpg","Seven of Pentacles":"pe07.jpg","Eight of Pentacles":"pe08.jpg","Nine of Pentacles":"pe09.jpg","Ten of Pentacles":"pe10.jpg","Page of Pentacles":"pe11.jpg","Knight of Pentacles":"pe12.jpg","Queen of Pentacles":"pe13.jpg","King of Pentacles":"pe14.jpg"};
const readingImages=new Map();
function readingArtwork(index){
 const name=tarotDeck[index]?.[0],file=readingImageFiles[name];if(!file)return null;
 if(!readingImages.has(file)){const im=new Image();im.crossOrigin='anonymous';im.decoding='async';im.src='https://raw.githubusercontent.com/sixseeds/tarot-api/main/cards/'+file;readingImages.set(file,im)}
 return readingImages.get(file)
}
function paintReadingArtwork(x,y,w,h,i,rev){
 const im=readingArtwork(i);if(!im?.naturalWidth)return tarotArt(x,y,w,h,i,rev);
 ctx.save();try{
 ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle='#e7d6b3';ctx.fillRect(x,y,w,h);
 ctx.translate(x+w/2,y+h/2);if(rev)ctx.rotate(Math.PI);
 const scale=Math.min(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*scale,ih=im.naturalHeight*scale;
 ctx.drawImage(im,-iw/2,-ih/2,iw,ih);
 }finally{ctx.restore()}
}
function readingPositionCaption(name,x,y,w){
 ctx.save();try{ctx.font='13px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f8e9cc';
 const words=name.split(' ');if(ctx.measureText(name).width<=w||words.length<2){ctx.fillText(name,x,y,w);return}
 const k=Math.ceil(words.length/2);ctx.fillText(words.slice(0,k).join(' '),x,y-5,w);ctx.fillText(words.slice(k).join(' '),x,y+9,w)
 }finally{ctx.restore()}
}
function shakeFortuneStick(){
 if(activity!=='sticks'||state.drawing||state.fallenStick)return;
 const run=state;state.shakeUntil=t+.38;state.stickDrawAt=t;state.stickLaunchX=400;state.drawing=true;
 state.stickNumber=1+Math.floor(Math.random()*12);
 sound(350);hint('One stick is finding its way out…','一支签正在慢慢落下……');
 setTimeout(()=>{if(activity!=='sticks'||state!==run)return;state.drawing=false;state.fallenStick=state.stickNumber;sound(480);hint('Pick up the numbered stick to receive your fortune paper.','拾起落下的签，领取签文。')},1250)
}
function pickupFortuneStick(){
 if(activity!=='sticks'||state.drawing||!state.fallenStick||state.stickPicked)return;
 state.stickPicked=true;state.stickPickAt=t;const n=state.fallenStick,run=state;
 sound(420);hint('Pick up the stick and take it to the fortune paper.','拾起签文，慢慢展开签纸。');
 setTimeout(()=>{if(activity!=='sticks'||state!==run)return;addItem('Fortune stick '+n,'签文 '+n);sound(520);templePaperOpen(n)},850)
}

/* Original portrait-composed destinations. All coordinates refer to the new artwork,
   never to the old landscape photographs. NPCs remain independent of the scenery. */
const portraitWorlds={
 home:{file:'salted-fish-island.webp',h:1516,spawn:[630,1370],route:[[0,710],[450,680],[850,570],[1516,630]],stations:{fish:[270,1090],tea:[750,850],office:[285,610],park:[765,495]}},
 island:{file:'food-and-fun-street.webp',h:1527,spawn:[510,1380],route:[[0,670],[450,570],[850,510],[1527,510]],stations:{kitchen:[265,910],arcade:[785,530],mystery:[300,410]}},
 wonder:{file:'wonder-valley.webp',h:1519,spawn:[525,1380],route:[[0,710],[450,660],[900,500],[1519,525]],stations:{quiz:[790,360],story:[260,950],match:[790,1110]}}
};
function portraitMap(){return portraitWorlds[scene]||null}
function mapWorldHeight(){return portraitMap()?.h||(isRoute()?routeHeight:600)}
const portraitImages=new Proxy(Object.create(null),{get(cache,key){
 if(typeof key==='string'&&!Object.hasOwn(cache,key)&&Object.hasOwn(portraitWorlds,key)){
  const im=new Image();im.decoding='async';cache[key]=im;im.src='assets/portrait/'+portraitWorlds[key].file;
 }return cache[key];
}});
for(const [key,data] of Object.entries(portraitWorlds)){
 const seen=new Set();maps[key].st=maps[key].st.filter(a=>{if(seen.has(a[0]))return false;seen.add(a[0]);return true}).map(a=>{const pos=data.stations[a[0]];return pos?[a[0],pos[0],pos[1],a[3],a[4]]:a})
}
function portraitPathX(y){const world=portraitMap();if(!world)return 500;const route=world.route;for(let i=1;i<route.length;i++){if(y<=route[i][0]){const a=route[i-1],b=route[i],f=clamp((y-a[0])/(b[0]-a[0]),0,1);return a[1]+(b[1]-a[1])*f}}return route[route.length-1][1]}
const oldMapMin=minY,oldMapMax=maxY,oldMapReset=resetPosition,oldPortraitInit=initNPC;
minY=function(){return portraitMap()?250:oldMapMin()};
maxY=function(){return portraitMap()?portraitMap().h-85:oldMapMax()};
resetPosition=function(){oldMapReset();const w=portraitMap();if(!w)return;p.x=p.tx=w.spawn[0];p.y=p.ty=w.spawn[1];p.motionSpeed=0;p.facing='up';cam.x=p.x;cam.y=p.y;petPos={x:p.x,y:p.y+40}};
initNPC=function(){oldPortraitInit();const w=portraitMap();if(!w)return;npc.forEach((n,i)=>{n.y=n.ty=510+i*310;n.x=n.tx=portraitPathX(n.y)+(i%2?85:-85);n.motionSpeed=0})};
const originalPortraitStep=step;
step=function(n,dt,speed){if(portraitMap()&&!room){
 if(n===p&&!pending){n.ty=clamp(n.ty,minY(),maxY());let x=portraitPathX(n.ty);n.tx=clamp(n.tx,x-125,x+125)}
 if(n!==p){n.ty=clamp(n.ty,minY(),maxY());let x=portraitPathX(n.ty);n.tx=clamp(n.tx,x-95,x+95)}
 }return originalPortraitStep(n,dt,speed)};
const formerDoorRoute=walkDoor;
walkDoor=function(id,x,y){
 if(!portraitMap())return formerDoorRoute(id,x,y);
 if(room||transitioning||pending===id)return;
 releaseWalkKeys();closeTalk();stopRoute();pending=id;lastDoor={x,y};let token=++doorAttempt;
 let endY=clamp(y+45,minY(),maxY()),center=portraitPathX(endY);
 let arrivalX=clamp(x,center-155,center+155);
 walkQueue=[{x:portraitPathX(p.y),y:p.y},{x:center,y:endY},{x:arrivalX,y:endY}];
 p.tx=walkQueue[0].x;p.ty=walkQueue[0].y;p.motionSpeed=0;hint('Walking to '+roomName(id)[0]+'…','正在前往'+roomName(id)[1]+'…');sound(380);
 let ms=Math.min(13000,Math.max(4500,Math.abs(p.y-endY)/240*1000+3200));
 setTimeout(()=>{if(token!==doorAttempt||room||pending!==id)return;stopRoute();releaseWalkKeys();p.x=p.tx=arrivalX;p.y=p.ty=endY;p.motionSpeed=0;enter(id)},ms)
};
const formerMapDraw=drawMap;
drawMap=function(){
 const world=portraitMap();if(!world)return formerMapDraw();
 ctx.save();try{
 const im=portraitImages[scene];if(im?.naturalWidth)ctx.drawImage(im,0,0,1000,world.h);
 else{let g=ctx.createLinearGradient(0,0,0,world.h);g.addColorStop(0,'#9ab7b6');g.addColorStop(1,'#d4bb93');ctx.fillStyle=g;ctx.fillRect(0,0,1000,world.h);txt(tr('Preparing the village…','正在准备小镇……'),500,world.h*.5,22,'#314438')}
 for(let i=0;i<18;i++){let xx=(i*143+t*(4+i%4))%1000,yy=(i*97+t*(5+i%4))%world.h;ctx.globalAlpha=.50;petal(xx,yy,2.5,i);ctx.globalAlpha=1}
 for(const n of [...npc,p].sort((a,b)=>a.y-b.y)){
  const sc=Math.max(.95,(.8+n.y/world.h*.45));
  if(n===p){backHuman(n.x,n.y,avatar??0,n.walk,n.facing||'up',Math.max(sc,48/(94*Math.max(.1,cam.scale))));continue}
  const moving=Math.hypot(n.tx-n.x,n.ty-n.y)>2;
  if(n.kind===2){cat(n.x,n.y,0,moving,.65*sc);continue}
  const dir=Math.abs(n.ty-n.y)>Math.abs(n.tx-n.x)?(n.ty<n.y?'up':'down'):(n.tx<n.x?'left':'right');
  backHuman(n.x,n.y,((avatar??0)+1+n.kind)%4,moving,dir,sc*.83);
  if(Math.hypot(n.x-p.x,n.y-p.y)<150){target(n.x-36,n.y-100,72,110,()=>npcTalk(n))}
 }
 for(const [id,x,y] of maps[scene].st){target(x-85,y-110,170,150,()=>walkDoor(id,x,y))}
 if(ambientBus&&!muted&&p.walk&&t-ambientLastFoot>.34){ambientLastFoot=t;ambientTone(85+Math.random()*24,.016,.09,'triangle')}
 }finally{ctx.restore()}
};
let signsForScene=null;
const formerSignSync=syncSigns;
syncSigns=function(){
 if(signsForScene!==scene){signsForScene=scene;signButtons.clear();signRoot.replaceChildren()}
 if(!portraitMap()){signRoot.classList.toggle('quiet',quiet9);return formerSignSync()}
 signRoot.classList.remove('quiet');
 let visible=proposal.hidden&&!room&&!transitioning&&avatar!==null&&$('page').style.display!=='block'&&$('arrival').hidden;
 signRoot.hidden=!visible;if(!visible)return;
 if(!signButtons.size){for(const [id,x,y,en,cn] of maps[scene].st){let e=element('button','',signRoot,'worldSign');e.onclick=()=>walkDoor(id,x,y);signButtons.set(id,e)}}
 for(const [id,x,y,en,cn] of maps[scene].st){const e=signButtons.get(id);if(!e)continue;const name=tr(en,cn);if(e.textContent!==name)e.textContent=name;
  const sx=cam.ox+x*cam.scale,sy=cam.oy+(y-65)*cam.scale;
  e.hidden=sy<138||sy>H-120||sx<-20||sx>W+20;if(!e.hidden){let half=Math.min(W/2-6,(e.offsetWidth||95)/2+7);e.style.left=clamp(sx,half,W-half)+'px';e.style.top=sy+'px'}
 }
};

/* Portrait navigation: keep the actual doorway and its sign together. */
for(const [id,x,y] of maps.fortune.st)signAnchorsProposal[id]=[x,y-95];
/* Fishing belongs to Salted Fish Island; do not reuse landscape coordinates on Food Street. */
maps.island.st=maps.island.st.filter(st=>st[0]!=='fish');
const portraitDoorV2=walkDoor;
walkDoor=function(id,x,y){
 if(!portraitMap())return portraitDoorV2(id,x,y);
 if(room||transitioning||pending===id)return;
 portraitDoorV2(id,x,y);
 if(pending!==id)return;
 const end=walkQueue[walkQueue.length-1];if(!end)return;
 const path=[{x:portraitPathX(p.y),y:p.y}];
 const direction=Math.sign(end.y-p.y);
 for(let yy=p.y+direction*125;direction&&direction*(end.y-yy)>0;yy+=direction*125)path.push({x:portraitPathX(yy),y:yy});
 path.push({x:portraitPathX(end.y),y:end.y},end);
 walkQueue=path;p.tx=path[0].x;p.ty=path[0].y;
 guideDismissed=true;moveGuide.hidden=true;
};
/* Swipe/wheel navigation on every portrait village, not just Fortune Valley. */
c.addEventListener('wheel',e=>{
 if(!portraitMap()||room||transitioning||!proposal.hidden||$('page').style.display==='block')return;
 e.preventDefault();stopRoute();releaseWalkKeys();
 p.ty=clamp(p.ty+Math.max(-350,Math.min(350,e.deltaY))*.85,minY(),maxY());p.tx=portraitPathX(p.ty);
},{passive:false});

/* The travel journal uses the same portrait illustrations as the actual world. */
function destinationPortrait(k){return k==='fortune'?ART.valleyClean:'assets/portrait/'+portraitWorlds[k].file}
const travelPortraitStyle=document.createElement('style');
travelPortraitStyle.textContent=`
#content .portraitTravelGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
#content .portraitDestination{display:block;position:relative;isolation:isolate;width:100%;aspect-ratio:2/3;min-width:0;padding:0!important;overflow:hidden;border:1px solid #af9470;border-radius:7px;text-align:left;background:#3c534a;box-shadow:0 3px 10px #352c2233}
#content .portraitDestination img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
#content .portraitDestination:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 32%,#24362b35 49%,#203129f5 100%);z-index:-1;pointer-events:none}
#content .portraitDestination .destinationCaption{position:absolute;bottom:0;left:0;right:0;padding:12px;color:#fff4dc;display:grid;gap:4px}
#content .portraitDestination strong{font:600 clamp(15px,4vw,21px)/1.18 Georgia,serif;overflow-wrap:anywhere}
#content .portraitDestination small{font:12px/1.35 system-ui,sans-serif;color:#f0dfc1;overflow-wrap:anywhere}
#content .portraitDestination .destinationStatus{font:10px/1.2 system-ui,sans-serif;letter-spacing:.05em;color:#f4d89a}
#content .portraitDestination:focus-visible{outline:3px solid #efbe72;outline-offset:2px}
#content .travelAlbum .albumCard>img{width:100%;height:auto;aspect-ratio:2/3;object-fit:cover;object-position:center}
@media(max-width:390px){#content .portraitTravelGrid{gap:8px}#content .portraitDestination .destinationCaption{padding:8px}#content .portraitDestination small{font-size:11px}}
`;document.head.append(travelPortraitStyle);
travel=function(){
 activePage='travel';
 page(tr('Where shall we go?','下一站去哪里？'),tr('Four little worlds, one railway ticket.','一张车票，四个小世界。'),q=>{
  const grid=element('div','',q,'portraitTravelGrid');
  const desc={fortune:['Tarot, temple and wishes','塔罗、庙宇与心愿'],home:['Tea, gossip and letting off steam','喝茶、吃瓜、河边解压'],island:['Cooking, arcade and souvenirs','美食、游戏与手信'],wonder:['Personality, stories and connections','性格、故事与缘分']};
  for(const k of ['fortune','home','island','wonder']){
   const button=element('button','',grid,'portraitDestination');button.type='button';button.setAttribute('aria-label',tr(...maps[k].n));
   const im=element('img','',button);im.src=destinationPortrait(k);im.alt='';im.loading='lazy';im.decoding='async';
   const caption=element('span','',button,'destinationCaption');
   element('span',k===scene&&!room?tr('YOU ARE HERE','你在这里'):visited.includes(k)?tr('REVISIT','重游'):tr('UNDISCOVERED','尚未探索'),caption,'destinationStatus');
   element('strong',tr(...maps[k].n),caption);element('small',tr(...desc[k]),caption);
   button.onclick=()=>{if(transitioning)return;$('page').style.display='none';journey(k)};
  }cluePanel(q);
 });
};
$('travel').onclick=travel;$('dockTravel').onclick=travel;

/* Fit the playable stage between the HUD and dock, including the lowest controls. */
function mobileRoomCamera(s,ox,oy){
 if(W>=H)return {s,ox,oy};
 const top=room&&!activity?155:135,bottom=H-122;
 const span=activity?(['wonderScene','story','match'].includes(activity)?[185,615,255,695]:['tarot','love'].includes(activity)?[195,605,265,685]:[170,630,265,690]):[110,690,300,750];
 const [l,r,u,d]=span,fit=Math.max(.08,Math.min((W-16)/(r-l),Math.max(80,bottom-top)/(d-u)));
 const base=Math.max(.08,Math.min(W/720,Math.max(80,bottom-top)/450));
 const f=activity&&activityZoomAt>=0?poseEase(Math.min(1,(performance.now()-activityZoomAt)/550)):1;
 const z=activity?base+(fit-base)*f:fit;
 return {s:z,ox:W/2-(l+r)/2*z,oy:(top+bottom)/2-(u+d)/2*z}
}
/* Draw compact in-world placards; measure every line instead of clipping card text. */
const priorInteriorLabel=label;
label=function(name,x,y,fn){
 if(!room)return priorInteriorLabel(name,x,y,fn);
 const scale=Math.max(.08,cam.scale),size=Math.min(32,Math.max(18,14/scale));
 const limit=activity?205:room==='temple'||roomActions[room]?.length>=3?165:235;
 ctx.save();try{
  ctx.font='600 '+size+'px Georgia,serif';
  const tokens=name.includes(' ')?name.split(/ +/):Array.from(name);
  const sep=name.includes(' ')?' ':'';
  let rows=[],row='';
  for(const token of tokens){const candidate=row?row+sep+token:token;if(row&&ctx.measureText(candidate).width>limit-16){rows.push(row);row=token}else row=candidate}
  if(row)rows.push(row);
  if(rows.length>2)rows=[rows[0],rows.slice(1).join(sep)];
  const w=Math.min(limit,Math.max(75,...rows.map(v=>ctx.measureText(v).width+16))),h=Math.max(32,rows.length*size*1.14+12);
  round(x-w/2,y-h/2,w,h,5,'#f3e5ccf5','#a78d68');
  ctx.fillStyle='#514333';ctx.textAlign='center';ctx.textBaseline='middle';
  rows.forEach((v,i)=>{ctx.font='600 '+size+'px Georgia,serif';let fs=Math.min(size,size*(w-12)/Math.max(1,ctx.measureText(v).width));ctx.font='600 '+fs+'px Georgia,serif';ctx.fillText(v,x,y+(i-(rows.length-1)/2)*size*1.1)});
  const hitW=Math.min(limit+12,Math.max(w,44/scale)),hitH=Math.max(h,44/scale);
  target(x-hitW/2,y-hitH/2,hitW,hitH,fn);
 }finally{ctx.restore()}
};

/* Make world signs real interactive elements above the canvas on every device. */
const accessibleSigns=document.createElement('style');
accessibleSigns.textContent=`
#game{isolation:isolate}
#game>canvas#c{position:absolute!important;inset:0!important;z-index:0!important}
#game>#worldSigns{position:absolute!important;inset:0!important;z-index:6!important;pointer-events:none!important}
#game>#worldSigns[hidden]{display:none!important}
#game>#worldSigns>.worldSign{position:absolute!important;pointer-events:auto!important;touch-action:none!important;user-select:none!important;-webkit-user-select:none!important;transform:translate(-50%,-50%)!important;transition:none!important;min-width:44px!important;min-height:44px!important;white-space:normal!important}
#game>#hud,#game>#small,#game>#dock,#game>#dialogue,#game>#gameControls{z-index:8!important}
#game>#page{z-index:20!important}
#game>#fade{z-index:21!important;pointer-events:none!important}
`;document.head.append(accessibleSigns);
/* Native click for mouse, touch and keyboard. The canvas fallback remains available. */
function directSignClick(id,x,y){
 if(room||transitioning||!proposal.hidden||$('page').style.display==='block')return;
 walkDoor(id,x,y);
}
let lastDoorLayoutAt=-Infinity,lastDoorLayoutLanguage=null;
syncSigns=function(){
 const show=proposal.hidden&&!room&&!transitioning&&avatar!==null&&$('page').style.display!=='block'&&$('arrival').hidden&&valleyRevealAt<0&&!quiet9;
 const wasHidden=signRoot.hidden;signRoot.hidden=!show;if(!show)return;
 if(signPress?.scene===scene&&signPress.el.isConnected)return;
 const changed=signsForScene!==scene||signButtons.size!==maps[scene].st.length;
 const now=performance.now();
 // The canvas remains full frame rate; DOM measurements need not run 60 times a second.
 if(!changed&&!wasHidden&&lastDoorLayoutLanguage===zh&&now-lastDoorLayoutAt<32)return;
 lastDoorLayoutAt=now;lastDoorLayoutLanguage=zh;
 if(changed){
  signsForScene=scene;signButtons.clear();signRoot.replaceChildren();
  for(const [id,x,y,en,cn] of maps[scene].st){
   const btn=element('button','',signRoot,'worldSign');btn.type='button';btn.dataset.door=id;
   btn.style.setProperty('pointer-events','auto','important');
   btn.onclick=e=>{if(e.detail!==0&&signClickSuppressedDoor===id&&performance.now()<signClickSuppressedUntil)return;directSignClick(id,x,y)};
   signButtons.set(id,btn)
  }
 }
 signRoot.classList.remove('quiet');
 const top=Math.min(164,H*.25),bottom=H-130;
 // Reserve real interactive UI and give each sign its own touch target.
 // Clamping independently made neighbouring doors share the same screen position.
 const blockers=[],placed=[],items=[];
 const rootRect=signRoot.getBoundingClientRect();
 for(const el of document.querySelectorAll('#hud button,#small button,#dock,#gameControls,#movePad,#dialogue button,#lunarBtn')){
  if(el.hidden||!el.getClientRects().length)continue;
  const b=el.getBoundingClientRect(),style=getComputedStyle(el);
  if(style.visibility==='hidden'||style.display==='none'||style.pointerEvents==='none'||!b.width||!b.height)continue;
  blockers.push({left:b.left-rootRect.left-6,right:b.right-rootRect.left+6,top:b.top-rootRect.top-6,bottom:b.bottom-rootRect.top+6});
 }
 for(const [id,x,y,en,cn] of maps[scene].st){
  const btn=signButtons.get(id),name=tr(en,cn);
  if(btn.textContent!==name)btn.textContent=name;
  const [ax,ay]=scene==='fortune'?(signAnchorsProposal[id]||[x,y-95]):[x,y-65];
  const sx=cam.ox+ax*cam.scale,sy=cam.oy+ay*cam.scale;
  const inView=sx>=-30&&sx<=W+30&&sy>=top-125&&sy<=bottom+70;
  btn.hidden=!inView;if(!inView)continue;
  items.push({btn,sx,sy,w:Math.max(44,btn.offsetWidth),h:Math.max(44,btn.offsetHeight),distance:Math.hypot(x-p.x,y-p.y)});
 }
 // Keep the nearest doorway closest to its artwork; move other labels only
 // as far as necessary to avoid an overlapping sign or navigation control.
 items.sort((a,b)=>a.distance-b.distance);
 for(const item of items){
  const {btn,sx,sy,w,h}=item,half=w/2+7,halfH=h/2+5;
  const cx=clamp(sx,half,W-half),cy=clamp(sy,top,bottom);
  const options=[],seen=new Set();
  for(const dy of [0,-h-8,h+8,-2*(h+8),2*(h+8),-3*(h+8),3*(h+8)]){
   for(const dx of [0,-w-8,w+8,-(w+8)/2,(w+8)/2]){
    const x=clamp(cx+dx,half,W-half),y=clamp(cy+dy,Math.max(halfH,top),Math.min(H-halfH,bottom));
    const key=Math.round(x)+':'+Math.round(y);if(seen.has(key))continue;seen.add(key);
    const rect={left:x-w/2-4,right:x+w/2+4,top:y-h/2-4,bottom:y+h/2+4};
    if([...blockers,...placed].some(b=>rect.left<b.right&&rect.right>b.left&&rect.top<b.bottom&&rect.bottom>b.top))continue;
    options.push({x,y,rect,score:Math.abs(x-cx)*1.15+Math.abs(y-cy)});
   }
  }
  options.sort((a,b)=>a.score-b.score);
  const choice=options[0];
  if(!choice){btn.hidden=true;continue}
  btn.style.left=choice.x+'px';btn.style.top=choice.y+'px';placed.push(choice.rect);
 }
};

/* Recurring villagers remember distinct conversations rather than rewarding repeated taps. */
const residentProfiles={
 keeper:{name:['Temple keeper','庙祝'],reward:['Keeper’s quiet blessing','庙祝的静心福签'],greeting:['The incense is ready. Your inbox can wait.','香已经备好了，工作消息可以晚点再回。'],returning:['Welcome back. The bell missed you. It has been very dramatic about it.','又来了啊。钟都想你了，刚才还闹着要响。'],topics:[
  {label:['Ask about the temple','问问庙里的事'],reply:['Light incense, bow quietly, then try the fortune sticks. You can keep a slip or tie it in the garden.','先上香，再静心行礼，然后去求签。签纸可以带走，也可以系在庭院里。']},
  {label:['Share a little worry','聊聊最近的烦恼'],reply:['You do not need to solve everything before sunset. Even the incense burns one moment at a time.','不用赶在日落前把所有烦恼解决。你看，香也是一点一点烧的。']},
  {label:['Ask for a quiet spot','找个清静的地方'],reply:['There is a little garden behind the temple. Sit by the chimes. Nobody will ask for your quarterly goals.','庙后面有个小庭院，去风铃旁坐坐吧。那里没人问你季度目标。']}
 ]},
 auntie:{name:['Auntie Mei','梅姨'],reward:['Auntie Mei’s tea invitation','梅姨的茶席邀约'],greeting:['Come, sit. The tea is hot and the gossip is hotter.','来来来，坐下。茶是热的，瓜更新鲜。'],returning:['Ah, my regular! I have kept your seat. Not for your boss, of course.','哎呀，熟客来了！位子给你留着呢，当然没有老板的份。'],topics:[
  {label:['Any fresh gossip?','今天有什么新瓜？'],reply:['Someone booked a meeting to discuss reducing meetings. I nearly spilled my tea.','有人专门开会讨论怎么减少开会。我差点把茶喷出来。']},
  {label:['Ask about this village','问问附近有什么好玩的'],reply:['At Daydream Park, nobody checks your productivity. The ducks are setting an excellent example.','发呆公园不查绩效，那几只鸭子就是我们的榜样。']},
  {label:['Ask how Auntie is doing','关心一下梅姨'],reply:['My knees complain, my kettle sings, and my tea is still better than the office pantry. Thank you for asking.','膝盖爱抱怨，水壶爱唱歌，茶还是比公司茶水间的好喝。谢谢你关心我。']}
 ]},
 wang:{name:['Wang Laoban','王老板'],reward:['Wang’s official rest permit','王老板的摸鱼许可证'],greeting:['I am conducting an important experiment in doing nothing.','我正在进行一项重要实验，研究如何什么都不做。'],returning:['My favourite colleague! Our unofficial rest committee is now in session.','我的摸鱼搭子来了！非正式休息委员会现在开会。'],topics:[
  {label:['Complain about meetings','吐槽开会'],reply:['I propose an agenda with one item: cancel the agenda. Motion carried.','我提议今天只有一项议程：取消议程。全票通过。']},
  {label:['Ask for a break idea','问问怎么休息'],reply:['Try the fishing pond. Even when you catch nothing, you have successfully avoided work.','去摸鱼池试试。就算一条鱼都没钓到，也成功摸鱼了。']},
  {label:['Ask about his dream job','问问他的理想职业'],reply:['Professional bench inspector. Excellent work-life balance, although the benches keep falling asleep on duty.','专业长椅体验员。工作生活很平衡，就是长椅上容易睡着。']}
 ]},
 mochi:{name:['Mochi','麻薯'],reward:['Mochi’s trusted human badge','麻薯认证铲屎官徽章'],greeting:['Mrrp. I see you have two hands. Excellent.','喵。我看见你有两只手。不错。'],returning:['Mrrp! You came back. I was absolutely not waiting.','喵！你回来了。我才没有特意等你。'],topics:[
  {label:['Offer an imaginary snack','请它吃虚拟小零食'],reply:['Sniff. Acceptable. My compliments to the imaginary chef.','闻闻。勉强合格。替我夸夸那位不存在的厨师。']},
  {label:['Scratch behind the ears','挠挠耳朵后面'],reply:['Prrrrr. Your performance review has improved significantly.','呼噜噜。你的绩效考核大幅提升。']},
  {label:['Sit quietly together','一起安静坐一会儿'],reply:['Mochi settles beside you. For once, neither of you has anything urgent to do.','麻薯在你旁边趴下了。难得你们两个都没有什么急事。']}
 ]}
};
const residentIds={'Temple keeper':'keeper','Auntie Mei':'auntie','Wang Laoban':'wang','Mochi':'mochi'};
let residentMemory=load('residentMemoryV1',{});
if(!residentMemory||typeof residentMemory!=='object'||Array.isArray(residentMemory))residentMemory={};
function residentRecord(id){
 const r=residentMemory[id];const topics=Array.isArray(r?.topics)?[...new Set(r.topics.filter(x=>Number.isInteger(x)&&x>=0&&x<3))]:[];
 return {topics,last:Number.isInteger(r?.last)&&topics.includes(r.last)?r.last:null,visits:Math.max(0,Number(r?.visits)||0),lastDay:typeof r?.lastDay==='string'?r.lastDay:''};
}
function residentStatus(r){return r.topics.length===3?['Trusted friend','知心好友']:r.topics.length>=1?['Familiar face','熟面孔']:['New acquaintance','新朋友']}
function residentTip(id){
 if(id==='keeper'||id==='mochi')return null;
 if(scene==='island')return ['Grandma’s Kitchen is just down the street. Try bubble tea or make a bowl of soup.','外婆厨房就在前面，试试做奶茶或者煮碗汤吧。'];
 if(scene==='wonder')return ['The Personality Lab is for fun. Nobody needs to fit inside a personality box.','人格研究所就是图个开心，人不需要被一种性格框住。'];
 return null;
}
function residentReply(id,n,index){
 const profile=residentProfiles[id],record=residentRecord(id),fresh=!record.topics.includes(index);
 if(fresh)record.topics.push(index);
 record.last=index;residentMemory[id]=record;save('residentMemoryV1',residentMemory);
 const reply=index===1&&id!=='keeper'&&id!=='mochi'&&id==='auntie'?(residentTip(id)||profile.topics[index].reply):index===1&&id==='wang'?(residentTip(id)||profile.topics[index].reply):profile.topics[index].reply;
 let extra='';
 if(fresh&&record.topics.length===3){
  extra=' '+tr('Here, keep this little reminder of our chats.','来，把这份聊天的小纪念收好。');
  addItem(...profile.reward);
 }else if(!fresh)extra=' '+tr('We have talked about this before. Still a good topic.','这个我们聊过啦，不过再聊一次也挺好。');
 say(tr(...n.n),tr(...reply)+extra,[[tr('Chat a little more','再聊一会儿'),()=>residentConversation(id,n,false)],[tr('See you around','下次见'),closeTalk]]);
}
function residentConversation(id,n,arrived=true){
 const profile=residentProfiles[id],record=residentRecord(id);
 if(arrived){record.visits++;record.lastDay=day();residentMemory[id]=record;save('residentMemoryV1',residentMemory)}
 const welcome=arrived&&record.visits===1?profile.greeting:profile.returning;
 const remembered=arrived&&record.last!==null?' '+tr('I remember our last chat.','上次聊的事我还记得呢。'):'';
 const options=profile.topics.map((topic,index)=>[tr(...topic.label),()=>residentReply(id,n,index)]);
 options.push([tr('Keep exploring','继续逛逛'),closeTalk]);
 say(tr(...n.n),tr(...welcome)+remembered,options);
}
const previousResidentTalk=npcTalk;
npcTalk=function(n){
 const id=n?.cameo===undefined&&n?.n&&Object.hasOwn(residentIds,n.n[0])?residentIds[n.n[0]]:null;
 if(!id||room)return previousResidentTalk(n);
 greetingNPC=n;greetingUntil=t+.9;stopRoute();p.tx=p.x;p.ty=p.y;
 if(Math.abs(n.x-p.x)>Math.abs(n.y-p.y))p.facing=n.x<p.x?'left':'right';else p.facing=n.y<p.y?'up':'down';
 residentConversation(id,n);
};
const residentPassport=passport;
passport=function(){
 residentPassport();const book=$('content').querySelector('.travelAlbum');if(!book)return;
 element('h2',tr('Village friendships','小镇友谊'),book);
 for(const [id,profile] of Object.entries(residentProfiles)){
  const record=residentRecord(id),entry=element('div','',book,'friendEntry');
  element('strong',record.visits?tr(...profile.name):tr('Someone to meet','待相遇的朋友'),entry);
  element('small',record.visits?tr(...residentStatus(record))+' · '+record.topics.length+'/3 '+tr('stories shared','段聊天回忆'):tr('Meet a resident on the village path.','去小镇路上认识新朋友吧。'),entry);
 }
};
$('dockPassport').onclick=passport;

/* Recognisable illustrated ingredients, preserving the original hit boxes. */
function kitchenIngredientArt(x,y,i,veg,used=false){
 ctx.save();ctx.translate(x,y);ctx.globalAlpha=used?.62:1;
 ellipse(0,3,37,15,'#76604750');ellipse(0,0,36,15,'#e9d7b1');ellipse(0,-2,31,11,'#f8e7c8');ctx.save();ctx.translate(0,-8);
 if(i===0&&veg){
  for(let j=0;j<3;j++){const px=-16+j*16,py=(j%2)*5;round(px-3,py-1,6,15,2,'#e2cba2','#a98c6b');ctx.beginPath();ctx.moveTo(px-12,py+1);ctx.quadraticCurveTo(px-13,py-17,px,py-18);ctx.quadraticCurveTo(px+12,py-17,px+13,py+1);ctx.quadraticCurveTo(px,py+5,px-12,py+1);ctx.fillStyle='#947052';ctx.fill();ctx.strokeStyle='#6d503d';ctx.stroke()}
 }else if(i===0){
  for(let j=0;j<3;j++){let px=-14+j*14,py=(j%2)*5;ellipse(px,py,12,11,'#c86447');ellipse(px-3,py-4,4,3,'#e99a70');line(px,py-10,px+5,py-12,'#577c4a',3);line(px,py-10,px-5,py-12,'#577c4a',3)}
 }else if(i===1){
  for(let j=0;j<5;j++){ctx.save();ctx.translate(-18+j*9,2);ctx.rotate((j-2)*.27);ctx.beginPath();ctx.moveTo(0,9);ctx.bezierCurveTo(-16,-3,-14,-22,0,-25);ctx.bezierCurveTo(13,-19,14,-1,0,9);ctx.fillStyle=j%2?'#739758':'#91ae6d';ctx.fill();line(0,8,0,-17,'#d1d5a3',1.5);ctx.restore()}
 }else if(veg){
  for(let j=0;j<3;j++){const px=-15+j*13,py=(j%2)*5;round(px-7,py-8,15,15,2,'#f1e3be','#b9a986');line(px-5,py-5,px+5,py-5,'#fff8df',2)}
 }else{
  for(let j=0;j<2;j++){ctx.save();ctx.translate(-10+j*18,0);ctx.rotate((j?1:-1)*.35);ellipse(0,0,10,16,'#d8b38b');ellipse(-2,-5,6,9,'#ecd0a8');ctx.restore()}
 }
 ctx.restore();ctx.restore();
}

/* Claw cabinet: aim, lower, close, lift, travel to the chute and release. */
const clawPlushes=[
 ['Mochi plush','麻薯玩偶',296,0],
 ['Latte plush','拿铁玩偶',400,1],
 ['Midnight plush','乌龙玩偶',504,2]
];
const clawNextStart=start;
start=function(id){
 clawNextStart(id);
 if(id==='claw'){state.hook=.5;state.clawPhase='aim';state.clawStreak=0;state.clawResult=null;state.clawExpert=false;hint('Slide the claw directly over a plush. Aim carefully!','把夹爪移到玩偶正上方，瞄准再下夹！')}
};
function clawAimX(){return 286+clamp(state.hook,0,1)*228}
doClaw=function(){
 if(activity!=='claw'||state.dropping)return;
 const x=clawAimX(),dist=clawPlushes.map(v=>Math.abs(v[2]-x)),i=dist.indexOf(Math.min(...dist));
 state.clawTarget=dist[i]<=(state.clawExpert?8:21)?i:-1;state.clawStartX=x;state.clawAt=t;state.clawPhase='lower';state.clawResult=null;state.dropping=true;state.count++;
 refreshControls();sound(310);hint('Here goes…','下夹啦……');
};
function clawFinish(){
 if(!state.dropping)return;
 const i=state.clawTarget;state.dropping=false;state.clawPhase='aim';state.clawResult={i,at:t};state.hook=0;state.drop=0;
 if(i>=0){state.clawStreak=0;let v=clawPlushes[i],owned=items.some(x=>x[0]===v[0]);addItem(v[0],v[1]);if(state.clawExpert)addItem('Precision claw champion','精准夹娃娃冠军');sound(660);
  hint(...(owned?['A twin! Your plush has acquired a colleague.','又来一只！玩偶也有同事啦。']:['A new plush is waiting in the prize tray.','新玩偶已落入出货口，快来看看！']));
 }else{state.clawStreak=(state.clawStreak||0)+1;const lines=[['Empty claws. They are practising minimalism.','夹了个寂寞。夹爪正在实践极简主义。'],['Even the plushies are avoiding responsibility. Try a little closer.','连玩偶都在逃避责任。再瞄准一点。'],['The claw has filed for annual leave. Please try again.','夹爪已申请年假。请再试一次。']];hint(...lines[Math.min(2,state.clawStreak-1)]);sound(210)}
 refreshControls();
}
function clawCabinet(){
 const age=state.dropping?Math.max(0,t-state.clawAt):0,hitIndex=state.clawTarget??-1;
 let x=clawAimX(),y=369,open=1,carry=false,fall=0;
 if(state.dropping){
  x=state.clawStartX;
  if(age<.75){state.clawPhase='lower';y+=113*poseEase(age/.75)}
  else if(age<1.05){state.clawPhase='grip';y=482;open=1-poseEase((age-.75)/.30)}
  else if(age<1.85){state.clawPhase='lift';y=482-113*poseEase((age-1.05)/.80);open=0;carry=hitIndex>=0}
  else if(age<2.55){state.clawPhase='travel';x=state.clawStartX+(286-state.clawStartX)*poseEase((age-1.85)/.70);open=0;carry=hitIndex>=0}
  else if(age<3.15){state.clawPhase='release';x=286;open=poseEase((age-2.55)/.18);fall=poseEase((age-2.55)/.6)}
  else clawFinish();
 }
 ctx.save();paintLivingBackdrop(pics.arcade||pics.tea);shadeLivingBackdrop('#27352d72');
 const body=ctx.createLinearGradient(240,340,560,610);body.addColorStop(0,'#c58f79');body.addColorStop(.55,'#ac736a');body.addColorStop(1,'#835b62');
 round(232,302,336,313,13,body,'#563e42');round(246,315,308,40,6,'#e7c69a','#9f7b5c');
 txt(tr('AFTER HOURS ARCADE','下班游戏厅'),400,335,17,'#614a3e');
 round(248,358,304,181,5,'#92aaa8','#514e50');
 ctx.save();ctx.beginPath();ctx.rect(250,360,300,176);ctx.clip();
 let glass=ctx.createLinearGradient(250,365,550,530);glass.addColorStop(0,'#dce4cb');glass.addColorStop(.55,'#a3c1b8');glass.addColorStop(1,'#71958c');ctx.fillStyle=glass;ctx.fillRect(250,360,300,178);
 ellipse(400,518,151,21,'#687d71');
 for(let i=0;i<3;i++){
  const v=clawPlushes[i];if(state.dropping&&hitIndex===i&&age>=1.05)continue;
  ellipse(v[2],518,25,6,'#4d5f5760');cat(v[2],515,v[3],false,1.05);
 }
 line(266,361,534,361,'#667574',9);
 line(x,363,x,y,'#504c4a',3);round(x-9,y-9,18,14,4,'#b8b3a0','#726b61');
 const spread=5+open*19;
 for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+side*spread,y+7,x+side*spread,y+18);ctx.lineTo(x+side*(spread-6),y+24);ctx.strokeStyle='#5d6461';ctx.lineWidth=5;ctx.lineCap='round';ctx.stroke()}
 if(carry)cat(x,y+43,clawPlushes[hitIndex][3],false,1.05);
 if(state.dropping&&hitIndex>=0&&state.clawPhase==='release'&&fall<1)cat(286,412+fall*128,clawPlushes[hitIndex][3],false,1.05);
 ctx.globalAlpha=.19;line(265,366,310,475,'#fffbed',5);line(278,366,323,475,'#fffbed',2);ctx.restore();
 round(250,544,300,57,5,'#d3b18a','#865f52');
 round(264,552,77,40,5,'#584e47','#f1d4a2');
 if(state.clawResult?.i>=0&&t-state.clawResult.at<6)cat(302,587,clawPlushes[state.clawResult.i][3],false,.65);
 round(358,559,174,33,7,state.dropping?'#aa9983':'#b76856','#7a5146');
 txt(state.dropping?tr('In motion…','抓取中……'):tr('LOWER CLAW','下夹'),445,575,15,'#fff0db');
 if(!state.dropping){target(252,358,296,178,()=>{},'claw');target(354,550,184,49,doClaw)}
 txt(state.clawResult?state.clawResult.i>=0?tr('Prize delivered!','玩偶到手啦！'):tr('Try a little closer','再瞄准一点'):tr('Slide to aim','左右滑动瞄准'),400,621,15,'#fff1d8');if(!state.dropping){label(state.clawExpert?tr('Precision mode: ON','精准模式：开'):tr('Try precision mode','挑战精准夹取'),400,655,()=>{state.clawExpert=!state.clawExpert;state.clawResult=null;hint(...(state.clawExpert?['Expert mode: aim at the exact centre.','高手模式：对准玩偶正中心。']:['Casual mode. Take your time.','休闲模式，慢慢来。']))});}
 ctx.restore();
}
const previousClawDraw=drawActivity;
drawActivity=function(){
 if(activity!=='claw')return previousClawDraw();
 continuityActivity=activity;clawCabinet();
};

/* Portrait-native reading room composition. Full source framing, not a landscape crop. */
const readingRoomPortrait=new Image();
readingRoomPortrait.decoding='async';
const readingRoomPortraitSource="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"1400\" viewBox=\"0 0 800 1400\">\n<defs>\n<linearGradient id=\"wall\" x2=\".15\" y2=\"1\"><stop stop-color=\"#bca88c\"/><stop offset=\".58\" stop-color=\"#dbc9aa\"/><stop offset=\"1\" stop-color=\"#a78b70\"/></linearGradient>\n<linearGradient id=\"floor\" x2=\"0\" y2=\"1\"><stop stop-color=\"#b89b73\"/><stop offset=\"1\" stop-color=\"#70513e\"/></linearGradient>\n<linearGradient id=\"sky\" x2=\"0\" y2=\"1\"><stop stop-color=\"#809a9a\"/><stop offset=\".75\" stop-color=\"#d8d2aa\"/><stop offset=\"1\" stop-color=\"#ede1b7\"/></linearGradient>\n<radialGradient id=\"light\"><stop stop-color=\"#ffe3a1\" stop-opacity=\".8\"/><stop offset=\"1\" stop-color=\"#ffe3a1\" stop-opacity=\"0\"/></radialGradient>\n<linearGradient id=\"wood\" x2=\"1\" y2=\".1\"><stop stop-color=\"#634b3e\"/><stop offset=\".5\" stop-color=\"#987451\"/><stop offset=\"1\" stop-color=\"#664b3a\"/></linearGradient>\n<filter id=\"paper\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".75\" numOctaves=\"3\" stitchTiles=\"stitch\"/><feColorMatrix type=\"saturate\" values=\"0\"/><feComponentTransfer><feFuncA type=\"linear\" slope=\".11\"/></feComponentTransfer><feBlend in=\"SourceGraphic\" mode=\"multiply\"/></filter>\n<clipPath id=\"window\"><path d=\"M190 490V233Q190 130 400 118Q610 130 610 233V490Z\"/></clipPath>\n</defs>\n<g filter=\"url(#paper)\">\n<path fill=\"url(#wall)\" d=\"M0 0H800V1400H0Z\"/>\n<path fill=\"url(#floor)\" d=\"M0 747Q405 698 800 747V1400H0Z\"/>\n<path fill=\"#655043\" d=\"M0 0H800V67Q400 98 0 67Z\"/>\n<path fill=\"#8f765c\" d=\"M0 75Q400 112 800 75L800 103Q400 135 0 103Z\"/>\n<path fill=\"#785c46\" d=\"M30 80L63 79L82 752L43 776Z M737 79L770 80L757 776L718 752Z\"/>\n<path fill=\"#785c46\" d=\"M0 719Q400 680 800 719V752Q400 712 0 752Z\"/>\n<path d=\"M165 509V233Q165 110 400 94Q635 110 635 233V509Z\" fill=\"url(#wood)\" stroke=\"#5e5141\" stroke-width=\"4\"/>\n<g clip-path=\"url(#window)\">\n<path fill=\"url(#sky)\" d=\"M187 114H615V493H187Z\"/>\n<circle cx=\"505\" cy=\"214\" r=\"51\" fill=\"#f2dfab\" opacity=\".84\"/>\n<path fill=\"#b7c3aa\" d=\"M175 345Q214 304 265 318Q301 241 352 265Q395 315 444 277Q509 216 625 293V500H175Z\"/>\n<path fill=\"#8fa79a\" d=\"M170 391Q232 348 294 369Q337 304 395 331Q490 366 528 308Q568 282 629 341V500H170Z\"/>\n<path fill=\"#607d75\" d=\"M180 456Q228 416 279 429Q334 364 390 399Q457 439 508 382Q560 351 630 398V500H180Z\"/>\n<g stroke=\"#506b63\" stroke-width=\"4\" fill=\"none\"><path d=\"M210 490Q224 380 205 307M218 420L248 373M214 398L192 361M580 491Q568 403 589 334M575 438L547 395M580 401L607 368\"/></g>\n<path fill=\"#47675e\" d=\"M180 352Q191 314 203 306Q213 286 224 318Q244 333 238 360Q253 372 246 390Q203 397 177 376Z M551 380Q553 347 576 331Q584 306 599 337Q622 345 624 381Q608 403 564 397Z\"/>\n<path stroke=\"#e2d7ad\" stroke-width=\"2\" opacity=\".65\" fill=\"none\" d=\"M238 448Q400 435 558 448M264 464Q402 453 526 464\"/>\n</g>\n<path d=\"M190 490V233Q190 130 400 118Q610 130 610 233V490Z\" fill=\"none\" stroke=\"#765b44\" stroke-width=\"12\"/>\n<path d=\"M400 120V490M190 305H610M287 153V490M513 153V490\" stroke=\"#8a6a4b\" stroke-width=\"7\"/>\n<path d=\"M159 505Q399 513 640 505L655 530Q402 548 145 530Z\" fill=\"#8b6747\"/>\n<path fill=\"#6f8880\" d=\"M128 112Q171 131 187 180L175 427Q139 471 79 494Q122 402 111 282Z M672 112Q629 131 613 180L625 427Q661 471 721 494Q678 402 689 282Z\"/>\n<g stroke=\"#476960\" stroke-width=\"3\" opacity=\".42\" fill=\"none\"><path d=\"M140 125Q159 313 131 449M154 142Q170 306 153 421M660 125Q641 313 669 449M646 142Q630 306 647 421\"/></g>\n<g fill=\"#7d6449\" stroke=\"#654d3a\" stroke-width=\"3\"><path d=\"M88 565Q145 556 212 561L217 698H83Z\"/><path d=\"M589 560Q650 552 714 566L719 698H584Z\"/></g>\n<path fill=\"#a78962\" d=\"M82 559Q150 552 218 557L225 575Q144 580 76 575Z M582 557Q650 552 718 559L724 575Q650 580 575 575Z\"/>\n<g stroke=\"#634b37\" stroke-width=\"2\">\n<path fill=\"#bf9f6a\" d=\"M98 619L102 582H122L125 619Z M129 619L128 586L147 583L152 619Z M156 619L160 578L178 581L182 619Z M185 619L187 590L203 589L204 619Z\"/>\n<path fill=\"#7d9790\" d=\"M104 674L106 635H130L132 674Z M137 674L135 643L158 639L162 674Z M165 674L169 634L187 637L188 674Z\"/>\n<path fill=\"#a28069\" d=\"M596 622L602 586L627 582L630 622Z M635 622L639 589L657 585L662 622Z M667 622L670 579L690 584L694 622Z\"/>\n<path fill=\"#c5b17f\" d=\"M599 674L604 640H626L630 674Z M636 674L635 637L659 638L661 674Z M667 674L674 641L696 642L695 674Z\"/>\n</g>\n<path stroke=\"#e8cfa2\" stroke-width=\"2\" fill=\"none\" d=\"M110 592V612M139 591V612M169 586V614M611 590V613M682 589V615\"/>\n<g>\n<path stroke=\"#785d47\" stroke-width=\"3\" d=\"M99 167V247M701 167V247\"/>\n<path fill=\"#c38c58\" stroke=\"#926342\" stroke-width=\"3\" d=\"M75 247Q48 284 77 319Q99 329 121 319Q150 284 123 247Z M677 247Q650 284 679 319Q701 329 723 319Q752 284 725 247Z\"/>\n<path stroke=\"#e5b980\" stroke-width=\"2\" fill=\"none\" d=\"M91 248Q72 284 91 320M107 248Q126 284 107 320M693 248Q674 284 693 320M709 248Q728 284 709 320\"/>\n<circle cx=\"99\" cy=\"284\" r=\"85\" fill=\"url(#light)\"/><circle cx=\"701\" cy=\"284\" r=\"85\" fill=\"url(#light)\"/>\n</g>\n<g fill=\"none\" stroke=\"#785941\" opacity=\".58\">\n<path d=\"M0 815Q400 774 800 815M0 895Q400 847 800 895M0 1010Q400 963 800 1010M0 1152Q400 1105 800 1152M0 1332Q400 1270 800 1332\" stroke-width=\"3\"/>\n<path d=\"M158 754L-86 1400M290 738L190 1400M400 734V1400M510 738L610 1400M642 754L886 1400\" stroke-width=\"2\"/>\n</g>\n<path d=\"M267 791Q400 772 533 791L644 1315Q400 1360 156 1315Z\" fill=\"#53756a\" opacity=\".82\" stroke=\"#c4a675\" stroke-width=\"4\"/>\n<path d=\"M287 812Q400 796 513 812L611 1296Q400 1332 189 1296Z\" fill=\"none\" stroke=\"#d4bd88\" stroke-width=\"3\"/>\n<g fill=\"#d1bc87\" opacity=\".68\"><path d=\"M400 849L412 871L400 894L388 871Z M400 1005L418 1031L400 1057L382 1031Z M400 1190L423 1220L400 1250L377 1220Z\"/></g>\n<path fill=\"#6e533e\" d=\"M93 758Q106 729 137 732Q170 736 177 759L163 799H106Z M623 759Q632 736 663 732Q694 729 707 758L694 799H637Z\"/>\n<g stroke=\"#59785d\" stroke-width=\"4\" fill=\"none\"><path d=\"M136 752Q122 699 91 683M136 752Q155 696 177 670M136 750Q134 704 139 660M665 752Q652 699 621 683M665 752Q684 696 706 670M665 750Q663 704 668 660\"/></g>\n<g fill=\"#739374\"><path d=\"M91 683Q64 662 72 650Q103 650 117 700Z M177 670Q202 637 211 657Q197 687 155 700Z M139 660Q115 626 141 621Q159 644 139 683Z M621 683Q594 662 602 650Q633 650 647 700Z M706 670Q731 637 740 657Q726 687 684 700Z M668 660Q644 626 670 621Q688 644 668 683Z\"/></g>\n</g></svg>";
let readingPortraitRequested=false;
function requestReadingRoomPortrait(){
 if(!readingPortraitRequested){readingPortraitRequested=true;readingRoomPortrait.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(readingRoomPortraitSource)}
 return readingRoomPortrait
}
function paintPortraitReadingRoom(){
 const b=livingBounds(),im=requestReadingRoomPortrait();
 const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);g.addColorStop(0,'#b6a187');g.addColorStop(1,'#70513e');ctx.fillStyle=g;ctx.fillRect(b.x,b.y,b.w,b.h);
 if(!im.naturalWidth)return;
 const sc=Math.min(b.w/im.naturalWidth,b.h/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc;
 ctx.drawImage(im,b.x+(b.w-w)/2,b.y+(b.h-h)/2,w,h);
}
const previousPortraitBackdrop=paintLivingBackdrop;
paintLivingBackdrop=function(im){
 if(room==='tarot'&&W<H){paintPortraitReadingRoom();return}
 return previousPortraitBackdrop(im)
};
const previousReadingRoomDraw=drawRoom;
drawRoom=function(){
 if(room==='tarot'&&W<H)paintPortraitReadingRoom();
 return previousReadingRoomDraw()
};

/* Independent portrait artwork for the temple and Destiny House. */
const portraitInteriorSources={temple:"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"1400\" viewBox=\"0 0 800 1400\"><defs>\n<linearGradient id=\"sky\" x2=\"0\" y2=\"1\"><stop stop-color=\"#9eb6b5\"/><stop offset=\"1\" stop-color=\"#e6d4aa\"/></linearGradient><linearGradient id=\"stone\" x2=\"0\" y2=\"1\"><stop stop-color=\"#bcb69e\"/><stop offset=\"1\" stop-color=\"#777d70\"/></linearGradient><linearGradient id=\"pillar\" x2=\"1\" y2=\"0\"><stop stop-color=\"#704c3c\"/><stop offset=\".45\" stop-color=\"#b17e59\"/><stop offset=\"1\" stop-color=\"#795443\"/></linearGradient><radialGradient id=\"glow\"><stop stop-color=\"#f5cf83\" stop-opacity=\".8\"/><stop offset=\"1\" stop-color=\"#f5cf83\" stop-opacity=\"0\"/></radialGradient>\n<filter id=\"grain\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".68\" numOctaves=\"3\" stitchTiles=\"stitch\"/><feColorMatrix type=\"saturate\" values=\"0\"/><feComponentTransfer><feFuncA type=\"linear\" slope=\".10\"/></feComponentTransfer><feBlend in=\"SourceGraphic\" mode=\"multiply\"/></filter>\n</defs><g filter=\"url(#grain)\">\n<rect width=\"800\" height=\"1400\" fill=\"url(#sky)\"/>\n<path fill=\"#b0bca7\" d=\"M0 335Q96 235 174 302Q244 155 348 286Q426 207 494 255Q600 133 800 277V778H0Z\"/>\n<path fill=\"#8ba497\" d=\"M0 451Q112 305 205 407Q276 316 355 389Q493 285 581 393Q715 304 800 375V770H0Z\"/>\n<path fill=\"#698a79\" d=\"M0 527Q124 400 223 489Q345 437 425 510Q537 401 640 492Q745 425 800 451V790H0Z\"/>\n<path fill=\"#4e7164\" d=\"M0 368Q58 346 85 393Q143 394 147 465Q201 491 177 558L0 607Z M800 345Q740 334 716 398Q659 390 653 465Q598 475 626 552L800 606Z\"/>\n<path stroke=\"#435f55\" stroke-width=\"12\" fill=\"none\" d=\"M48 766Q69 550 38 399M752 765Q730 548 759 397\"/>\n<path fill=\"#ded0ac\" d=\"M0 605Q400 558 800 605V809H0Z\"/>\n<path fill=\"url(#stone)\" d=\"M0 759Q400 699 800 759V1400H0Z\"/>\n<g stroke=\"#676c60\" fill=\"none\" opacity=\".62\"><path stroke-width=\"3\" d=\"M0 818Q400 772 800 818M0 920Q400 868 800 920M0 1050Q400 988 800 1050M0 1207Q400 1142 800 1207M0 1390Q400 1315 800 1390\"/><path stroke-width=\"2\" d=\"M118 750L-118 1400M256 734L153 1400M400 725V1400M544 734L647 1400M682 750L918 1400\"/></g>\n<path fill=\"#94745a\" d=\"M0 670H800V717H0Z\"/><path fill=\"#c3a681\" d=\"M0 661H800V677H0Z\"/>\n<path fill=\"#624d41\" d=\"M0 0H800V64Q400 90 0 64Z\"/>\n<path fill=\"#795f4c\" d=\"M0 75Q400 110 800 75V117Q400 152 0 117Z\"/>\n<path fill=\"#3f534b\" d=\"M0 124Q400 197 800 124L800 160Q400 227 0 160Z\"/>\n<path fill=\"#99714f\" d=\"M0 171Q400 244 800 171V198Q400 268 0 198Z\"/>\n<g fill=\"url(#pillar)\" stroke=\"#765443\" stroke-width=\"3\"><path d=\"M48 175L112 186L104 724L37 754Z\"/><path d=\"M688 186L752 175L763 754L696 724Z\"/></g>\n<path fill=\"#c3b39a\" d=\"M23 730L114 711L132 749L18 779Z M686 711L777 730L782 779L668 749Z\"/>\n<g stroke=\"#78513b\" stroke-width=\"4\"><path d=\"M210 210V318M590 210V318\"/></g>\n<g fill=\"#b97949\" stroke=\"#81583e\" stroke-width=\"3\"><path d=\"M180 316Q147 361 182 404Q210 417 238 404Q273 361 240 316Z\"/><path d=\"M560 316Q527 361 562 404Q590 417 618 404Q653 361 620 316Z\"/></g>\n<g stroke=\"#e4b578\" stroke-width=\"2\" fill=\"none\"><path d=\"M196 318Q177 360 196 405M224 318Q243 360 224 405M576 318Q557 360 576 405M604 318Q623 360 604 405\"/></g>\n<circle cx=\"210\" cy=\"360\" r=\"100\" fill=\"url(#glow)\"/><circle cx=\"590\" cy=\"360\" r=\"100\" fill=\"url(#glow)\"/>\n<path fill=\"#83694f\" d=\"M291 219Q400 227 509 219L505 285Q400 291 295 285Z\"/><path d=\"M307 234H493V273H307Z\" fill=\"#d3b681\" stroke=\"#98764e\" stroke-width=\"2\"/>\n<g fill=\"#73513b\"><text x=\"400\" y=\"262\" font-size=\"26\" text-anchor=\"middle\" font-family=\"serif\" letter-spacing=\"6\">静 心</text></g>\n<g fill=\"#617d62\"><path d=\"M0 790Q15 746 54 767Q81 727 111 764Q138 743 157 784L157 821H0Z M800 790Q785 746 746 767Q719 727 689 764Q662 743 643 784L643 821H800Z\"/></g>\n<path fill=\"#9b8364\" opacity=\".35\" d=\"M220 901Q400 860 580 901L701 1351Q400 1393 99 1351Z\"/>\n<path d=\"M240 921Q400 887 560 921L674 1328Q400 1364 126 1328Z\" fill=\"none\" stroke=\"#d1bb8f\" stroke-width=\"3\" opacity=\".6\"/>\n</g></svg>",destiny:"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"1400\" viewBox=\"0 0 800 1400\"><defs>\n<linearGradient id=\"wall\" x2=\"0\" y2=\"1\"><stop stop-color=\"#4e6265\"/><stop offset=\".65\" stop-color=\"#9c947b\"/><stop offset=\"1\" stop-color=\"#ae8e6b\"/></linearGradient><linearGradient id=\"floor\" x2=\"0\" y2=\"1\"><stop stop-color=\"#a68b69\"/><stop offset=\"1\" stop-color=\"#624d46\"/></linearGradient><radialGradient id=\"light\"><stop stop-color=\"#f6d48f\" stop-opacity=\".83\"/><stop offset=\"1\" stop-color=\"#f6d48f\" stop-opacity=\"0\"/></radialGradient><filter id=\"grain\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".7\" numOctaves=\"3\" stitchTiles=\"stitch\"/><feColorMatrix type=\"saturate\" values=\"0\"/><feComponentTransfer><feFuncA type=\"linear\" slope=\".10\"/></feComponentTransfer><feBlend in=\"SourceGraphic\" mode=\"multiply\"/></filter>\n</defs><g filter=\"url(#grain)\">\n<rect width=\"800\" height=\"1400\" fill=\"url(#wall)\"/><path fill=\"url(#floor)\" d=\"M0 759Q400 704 800 759V1400H0Z\"/>\n<path fill=\"#54483f\" d=\"M0 0H800V70Q400 105 0 70Z\"/><path fill=\"#a38b66\" d=\"M0 81Q400 117 800 81V110Q400 148 0 110Z\"/>\n<path fill=\"#725c49\" d=\"M26 106L61 106L81 748L40 775Z M739 106L774 106L760 775L719 748Z\"/>\n<circle cx=\"400\" cy=\"344\" r=\"228\" fill=\"#725b48\" stroke=\"#b69b70\" stroke-width=\"9\"/><circle cx=\"400\" cy=\"344\" r=\"210\" fill=\"#3d5962\" stroke=\"#d5b67e\" stroke-width=\"3\"/><circle cx=\"400\" cy=\"344\" r=\"178\" fill=\"none\" stroke=\"#bda476\" stroke-width=\"2\"/>\n<circle cx=\"400\" cy=\"344\" r=\"130\" fill=\"none\" stroke=\"#d4bb87\" stroke-width=\"1.5\"/><circle cx=\"400\" cy=\"344\" r=\"74\" fill=\"none\" stroke=\"#c4af83\" stroke-width=\"1.5\"/>\n<g stroke=\"#c5ae7f\" stroke-width=\"2\" opacity=\".75\"><path d=\"M400 134V554M190 344H610M251 195L549 493M549 195L251 493\"/><path d=\"M295 162L505 526M218 239L582 449M505 162L295 526M582 239L218 449\"/></g>\n<g fill=\"#f1dbac\"><circle cx=\"400\" cy=\"344\" r=\"17\"/><circle cx=\"316\" cy=\"280\" r=\"5\"/><circle cx=\"491\" cy=\"393\" r=\"6\"/><circle cx=\"427\" cy=\"221\" r=\"4\"/><circle cx=\"267\" cy=\"371\" r=\"5\"/><circle cx=\"536\" cy=\"309\" r=\"5\"/><circle cx=\"366\" cy=\"465\" r=\"4\"/></g>\n<path d=\"M316 280L427 221L536 309L491 393L366 465L267 371Z\" fill=\"none\" stroke=\"#e6cd97\" stroke-width=\"2\" opacity=\".8\"/>\n<path d=\"M95 198V324M705 198V324\" stroke=\"#7b634b\" stroke-width=\"3\"/>\n<g fill=\"#b48554\" stroke=\"#765b43\" stroke-width=\"3\"><path d=\"M69 324Q43 359 68 398Q95 413 122 398Q147 359 121 324Z M679 324Q653 359 678 398Q705 413 732 398Q757 359 731 324Z\"/></g>\n<circle cx=\"95\" cy=\"362\" r=\"99\" fill=\"url(#light)\"/><circle cx=\"705\" cy=\"362\" r=\"99\" fill=\"url(#light)\"/>\n<path fill=\"#665241\" d=\"M79 554L223 550L226 735H75Z M577 550L721 554L725 735H574Z\"/><path fill=\"#b39671\" d=\"M69 548L233 544V570L69 574Z M567 544L731 548V574L567 570Z\"/>\n<g fill=\"#c3af83\" stroke=\"#8f785a\" stroke-width=\"2\"><path d=\"M91 602Q115 585 145 602V625H91Z M154 586H209V626H154Z M91 649H120V704H91Z M129 645H152V704H129Z M162 654H211V704H162Z M588 586H620V625H588Z M630 595H704V626H630Z M590 648H620V704H590Z M627 639H658V704H627Z M666 652H707V704H666Z\"/></g>\n<path d=\"M0 719Q400 684 800 719V750Q400 715 0 750Z\" fill=\"#6f5849\"/>\n<g stroke=\"#6c5242\" opacity=\".55\" fill=\"none\"><path stroke-width=\"3\" d=\"M0 833Q400 783 800 833M0 948Q400 896 800 948M0 1086Q400 1031 800 1086M0 1253Q400 1181 800 1253M0 1400Q400 1327 800 1400\"/><path stroke-width=\"2\" d=\"M140 745L-90 1400M274 730L171 1400M400 724V1400M526 730L629 1400M660 745L890 1400\"/></g>\n<path d=\"M258 808Q400 787 542 808L660 1336Q400 1387 140 1336Z\" fill=\"#635f75\" stroke=\"#bfaa83\" stroke-width=\"4\"/><path d=\"M279 830Q400 811 521 830L629 1318Q400 1360 171 1318Z\" fill=\"none\" stroke=\"#d0b98a\" stroke-width=\"3\"/>\n<g stroke=\"#c9b28c\" fill=\"none\" opacity=\".68\"><circle cx=\"400\" cy=\"1080\" r=\"73\" stroke-width=\"3\"/><path d=\"M400 994L473 1080L400 1166L327 1080Z\" stroke-width=\"2\"/><circle cx=\"400\" cy=\"1080\" r=\"35\" stroke-width=\"2\"/></g>\n</g></svg>"};
const portraitInteriorCache=new Map();
function portraitInteriorImage(id){
 if(!Object.hasOwn(portraitInteriorSources,id))return null;
 if(!portraitInteriorCache.has(id)){const im=new Image();im.decoding='async';im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(portraitInteriorSources[id]);portraitInteriorCache.set(id,im)}
 return portraitInteriorCache.get(id)
}
function paintPortraitInterior(id){
 const b=livingBounds(),im=portraitInteriorImage(id);
 let g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);g.addColorStop(0,id==='temple'?'#a6b4a1':'#59656a');g.addColorStop(1,id==='temple'?'#777d70':'#624d46');ctx.fillStyle=g;ctx.fillRect(b.x,b.y,b.w,b.h);
 if(!im?.naturalWidth)return;
 const scale=Math.min(b.w/im.naturalWidth,b.h/im.naturalHeight),w=im.naturalWidth*scale,h=im.naturalHeight*scale;
 ctx.drawImage(im,b.x+(b.w-w)/2,b.y+(b.h-h)/2,w,h)
}
const roomPortraitBackdropBefore=paintLivingBackdrop;
paintLivingBackdrop=function(im){
 if(W<H&&((room==='temple'&&activity!=='secretGarden')||room==='destiny')){paintPortraitInterior(room);return}
 return roomPortraitBackdropBefore(im)
};
const roomPortraitDrawBefore=drawRoom;
drawRoom=function(){
 if(W<H&&room==='destiny')paintPortraitInterior('destiny');
 return roomPortraitDrawBefore()
};
const destinyPortraitPageBefore=destinyPage;
destinyPage=function(){
 destinyPortraitPageBefore();
 if(W>=H)return;
 const q=$('content'),wrap=q?.querySelector('.roomArtWrap'),im=wrap?.querySelector('.roomIllustration');
 if(!im)return;
 im.src=portraitInteriorImage('destiny').src;
 wrap.classList.add('portraitDestinyIllustration');
};
const destinyPortraitStyle=document.createElement('style');
destinyPortraitStyle.textContent='.destinyChamber .portraitDestinyIllustration .roomIllustration{aspect-ratio:4/7;max-height:none;object-fit:contain;width:100%;height:auto}.destinyChamber .portraitDestinyIllustration{max-width:340px;margin-inline:auto}.destinyChamber .portraitDestinyIllustration .yueActor{height:60%;width:36%;right:6%}';
document.head.append(destinyPortraitStyle);

/* Remaining portrait interiors, each composed independently for a tall viewport.
   Decorative artwork deliberately contains no interactive controls or labels. */
function portraitComposition(top,bottom,floor,detail,open=false){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1400" viewBox="0 0 800 1400"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="'+top+'"/><stop offset="1" stop-color="'+bottom+'"/></linearGradient><linearGradient id="ground" x2="0" y2="1"><stop stop-color="'+floor+'"/><stop offset="1" stop-color="#655b4d"/></linearGradient><radialGradient id="light"><stop stop-color="#ffdda0" stop-opacity=".65"/><stop offset="1" stop-color="#ffdda0" stop-opacity="0"/></radialGradient><filter id="paper"><feTurbulence baseFrequency=".67" numOctaves="3" stitchTiles="stitch" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".085"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><g filter="url(#paper)"><path fill="url(#sky)" d="M0 0H800V1400H0Z"/><path fill="url(#ground)" d="M0 810Q400 720 800 810V1400H0Z"/>'+(open?'':'<path fill="#645044" d="M0 0H800V75Q400 113 0 75Z M0 768Q400 719 800 768V793Q400 744 0 793Z"/><path fill="#8d7056" d="M23 80L53 80L68 800L32 813Z M747 80L777 80L768 813L732 800Z"/>')+'<g fill="none" stroke="#574c3c" opacity=".30"><path d="M0 900Q400 840 800 900M0 1020Q400 954 800 1020M0 1180Q400 1107 800 1180M0 1380Q400 1300 800 1380" stroke-width="3"/><path d="M145 789L-88 1400M275 775L173 1400M400 770V1400M525 775L627 1400M655 789L888 1400" stroke-width="2"/></g>'+detail+'</g></svg>'
}
function roomWindow(x,y,w,h,night=false){
 return '<g transform="translate('+x+' '+y+')"><path d="M0 '+h+'V'+(w*.42)+'Q0 0 '+w/2+' 0Q'+w+' 0 '+w+' '+w*.42+'V'+h+'Z" fill="'+(night?'#526d79':'#b7c9ba')+'" stroke="#775a42" stroke-width="12"/><circle cx="'+w*.72+'" cy="'+h*.25+'" r="'+w*.13+'" fill="#f4dfab"/><path d="M7 '+h*.66+'Q'+w*.28+' '+h*.34+' '+w*.5+' '+h*.65+'Q'+w*.75+' '+h*.34+' '+(w-7)+' '+h*.57+'V'+(h-7)+'H7Z" fill="#8ba698"/><path d="M7 '+h*.84+'Q'+w*.25+' '+h*.59+' '+w*.5+' '+h*.8+'Q'+w*.77+' '+h*.57+' '+(w-7)+' '+h*.73+'V'+(h-7)+'H7Z" fill="#648779"/><path d="M'+w/2+' 4V'+h+'M6 '+h*.55+'H'+(w-6)+'" stroke="#94714e" stroke-width="7"/></g>'
}
function roomLantern(x,y,col='#b88456'){
 return '<g transform="translate('+x+' '+y+')"><path d="M0 -110V-43" stroke="#765a42" stroke-width="3"/><path d="M-26 -43Q-52 -4 -26 36Q0 47 26 36Q52 -4 26 -43Z" fill="'+col+'" stroke="#785744" stroke-width="3"/><path d="M-12 -41Q-26 -4 -12 37M12 -41Q26 -4 12 37" fill="none" stroke="#e4bb79" stroke-width="2"/><circle r="90" fill="url(#light)"/></g>'
}
function roomPlant(x,y,s=1){
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-35 0Q0 -16 35 0L25 48H-25Z" fill="#a1805e" stroke="#70513d" stroke-width="3"/><path d="M0 3Q-5 -49 -34 -70M0 3Q15 -54 35 -78M0 0V-100" fill="none" stroke="#4a6955" stroke-width="4"/><g fill="#6f9470"><path d="M-34 -70Q-75 -96 -60 -111Q-32 -109 -12 -53Z M35 -78Q74 -116 83 -97Q71 -67 16 -53Z M0 -100Q-28 -138 0 -145Q24 -132 3 -75Z"/></g></g>'
}
function roomShelf(x,y,w,h,colors){
 let books='';for(let row=0;row<2;row++)for(let i=0;i<6;i++){const bx=13+i*(w-26)/6,by=24+row*h*.43,bh=43+(i*17%25);books+='<path d="M'+bx+' '+(by+65-bh)+'h'+((w-42)/6)+'v'+bh+'h-'+((w-42)/6)+'Z" fill="'+colors[(i+row)%colors.length]+'" stroke="#715a45" stroke-width="1.5"/>'}
 return '<g transform="translate('+x+' '+y+')"><path d="M0 0H'+w+'V'+h+'H0Z" fill="#705746" stroke="#564538" stroke-width="4"/><path d="M8 8H'+(w-8)+'V'+(h-8)+'H8Z" fill="#987d5e"/>'+books+'<path d="M0 '+h*.49+'H'+w+'M0 '+h*.93+'H'+w+'" stroke="#6d503c" stroke-width="9"/></g>'
}
function portraitGardenScene(pool){
 return '<path fill="#adc0a5" d="M0 345Q114 175 240 332Q342 231 421 303Q604 138 800 293V800H0Z"/><path fill="#779a82" d="M0 510Q112 353 240 469Q400 345 523 448Q681 339 800 434V836H0Z"/><g fill="#50775f"><path d="M0 190Q120 165 173 300Q230 338 196 461L0 602Z M800 190Q680 165 627 300Q570 338 604 461L800 602Z"/></g><path d="M50 670Q77 409 49 241M750 670Q723 409 751 241" stroke="#695846" stroke-width="15" fill="none"/><path d="M150 323Q400 395 650 323" stroke="#765a42" stroke-width="3" fill="none"/>'+roomLantern(195,380)+roomLantern(400,411)+roomLantern(605,380)+'<path d="M0 790Q145 696 271 790L0 1020Z M800 790Q655 696 529 790L800 1020Z" fill="#67886c"/>'+ (pool?'<ellipse cx="400" cy="1045" rx="260" ry="190" fill="#a19a7e" stroke="#d5c29a" stroke-width="17"/><ellipse cx="400" cy="1045" rx="239" ry="169" fill="#537f7d"/><path d="M215 1002Q400 930 585 1002M244 1098Q400 1140 556 1098" stroke="#b9cbbb" opacity=".6" stroke-width="3" fill="none"/>':'<path d="M256 1000Q400 950 544 1000L678 1370Q400 1410 122 1370Z" fill="#b7a584" stroke="#c9ba94" stroke-width="4"/>')+roomPlant(110,874,1.15)+roomPlant(690,874,1.15)
}
const additionalPortraits={
 wishes:portraitComposition('#9eb8aa','#e2d4ac','#9eab8b',portraitGardenScene(true),true),
 park:portraitComposition('#b5c8b5','#e1d5b1','#a2ae8a',portraitGardenScene(false)+'<path d="M112 730H288V757H112Z M125 757V808M275 757V808" stroke="#6c5542" stroke-width="9" fill="#ac8b65"/>',true),
 secretGarden:portraitComposition('#92aeaa','#c9d3aa','#8d9e7f',portraitGardenScene(false),true),
 fish:portraitComposition('#a3c0b6','#ddd8b5','#a4af8d','<path fill="#8ba896" d="M0 475Q140 241 309 435Q470 255 800 405V820H0Z"/><path fill="#597f79" d="M0 665Q400 567 800 665V1400H0Z"/><g fill="none" stroke="#b6d0c4" opacity=".65" stroke-width="3"><path d="M30 800Q170 774 320 800M440 900Q590 874 770 900M80 1110Q300 1075 530 1110M460 1270Q650 1245 800 1270"/></g><path d="M0 1090Q300 976 423 1400H0Z" fill="#a48c6c" stroke="#77644e" stroke-width="6"/>'+roomPlant(83,940,1.5),true),
 kitchen:portraitComposition('#c9b294','#ead9b5','#ae9069',roomWindow(238,155,324,392)+roomLantern(115,275)+roomLantern(685,275)+roomShelf(80,545,210,195,['#ba9c70','#879e89','#b47e64'])+'<path d="M480 563H717V747H480Z" fill="#967355" stroke="#6e5341" stroke-width="4"/><path d="M468 554H731V582H468Z" fill="#c19f70"/><g fill="#b7a080" stroke="#77604b" stroke-width="3"><path d="M508 538Q482 478 523 456Q566 476 543 538Z"/><path d="M594 538Q574 492 607 477Q644 493 627 538Z"/></g><path d="M129 448V518M170 448V518M212 448V518" stroke="#6e5541" stroke-width="5"/><g fill="#a9aba0"><ellipse cx="129" cy="527" rx="15" ry="25"/><ellipse cx="170" cy="527" rx="16" ry="22"/><ellipse cx="212" cy="527" rx="13" ry="25"/></g>'+roomPlant(695,788,.8)),
 arcade:portraitComposition('#625b70','#b5a08d','#93816f','<path d="M85 170Q400 132 715 170V228Q400 190 85 228Z" fill="#8a6069" stroke="#d0ae78" stroke-width="5"/><g fill="#eac588"><circle cx="140" cy="191" r="8"/><circle cx="205" cy="182" r="8"/><circle cx="270" cy="176" r="8"/><circle cx="530" cy="176" r="8"/><circle cx="595" cy="182" r="8"/><circle cx="660" cy="191" r="8"/></g><g fill="#9d736d" stroke="#674f56" stroke-width="5"><path d="M77 305H243L258 720H62Z"/><path d="M557 305H723L738 720H542Z"/></g><g fill="#779a99" stroke="#e2c69c" stroke-width="4"><path d="M95 347H225V530H95Z"/><path d="M575 347H705V530H575Z"/></g><g fill="#e9c492"><circle cx="133" cy="578" r="15"/><circle cx="185" cy="578" r="15"/><circle cx="613" cy="578" r="15"/><circle cx="665" cy="578" r="15"/></g>'+roomLantern(400,285,'#aa775f')+'<path d="M300 395H500V708H300Z" fill="#6c7776" stroke="#a89178" stroke-width="5"/><path d="M317 412H483V607H317Z" fill="#a9c1b7"/><path d="M330 640H470V683H330Z" fill="#dbc394"/>'),
 tea:portraitComposition('#b8a28a','#e0ccb0','#af916c',roomWindow(190,135,420,425)+roomLantern(108,292)+roomLantern(692,292)+roomShelf(85,578,208,180,['#be9b76','#79928a','#b7ad80'])+'<path d="M535 570H714V751H535Z" fill="#856a4e" stroke="#604a3a" stroke-width="4"/><path d="M523 560H727V588H523Z" fill="#c6a57a"/><g fill="#c4c7a0" stroke="#766953" stroke-width="3"><path d="M551 545Q535 505 572 502Q609 505 593 545Z"/><path d="M622 545Q608 512 639 507Q670 512 656 545Z"/></g>'+roomPlant(693,806,.9)),
 office:portraitComposition('#a5aca9','#d5c8b4','#a39a86',roomWindow(238,130,324,380)+'<path d="M100 550H310V733H100Z M490 550H700V733H490Z" fill="#957d65" stroke="#635849" stroke-width="4"/><path d="M89 540H321V567H89Z M479 540H711V567H479Z" fill="#bba587"/><g fill="#515f60" stroke="#7c7160" stroke-width="4"><path d="M137 408H262V528H137Z"/><path d="M532 408H657V528H532Z"/></g><g fill="#a5bfbc"><path d="M148 420H251V510H148Z"/><path d="M543 420H646V510H543Z"/></g><circle cx="400" cy="613" r="65" fill="#dfceb0" stroke="#806c52" stroke-width="5"/><path d="M400 613V571M400 613L430 632" stroke="#665846" stroke-width="4"/>'+roomPlant(708,781,.9)),
 mystery:portraitComposition('#a49aa7','#d8bca3','#a69074',roomWindow(275,145,250,333,true)+roomLantern(150,280)+roomLantern(650,280)+roomShelf(85,520,230,240,['#a58488','#c6a96c','#809b96'])+roomShelf(485,520,230,240,['#c0a17b','#8a9592','#ad7a74'])+'<path d="M325 570H475V747H325Z" fill="#9a7b5e" stroke="#6d5340" stroke-width="4"/><path d="M310 558H490V580H310Z" fill="#c5a677"/>'),
 quiz:portraitComposition('#93a8a8','#ddd0af','#a1a18a',roomWindow(190,135,420,420)+roomShelf(80,565,210,183,['#a99b7a','#779d92','#a2869c'])+roomShelf(510,565,210,183,['#ab8b79','#8b9f8d','#c1ac7c'])+'<circle cx="400" cy="641" r="85" fill="#bcb5a2" stroke="#927e63" stroke-width="6"/><path d="M362 630Q400 580 438 630Q438 681 400 690Q362 681 362 630Z" fill="#738e80"/>'+roomPlant(710,802,.75)),
 story:portraitComposition('#8996a9','#d4bba4','#978776',roomWindow(155,105,490,455,true)+roomLantern(104,275)+roomLantern(696,275)+'<path d="M92 598Q182 578 279 598V727H92Z M521 598Q618 578 708 598V727H521Z" fill="#9a776d" stroke="#6e574f" stroke-width="5"/><path d="M100 690H270M530 690H700" stroke="#d2ac83" stroke-width="6"/>'+roomPlant(702,796,.8)),
 match:portraitComposition('#b8a09b','#e7cfb6','#a89478',roomWindow(170,122,460,425)+roomLantern(95,268,'#c29879')+roomLantern(705,268,'#c29879')+'<path d="M92 568Q180 552 268 568V727H92Z M532 568Q620 552 708 568V727H532Z" fill="#9e7772" stroke="#73564c" stroke-width="5"/><path d="M104 684H256M544 684H696" stroke="#d8b395" stroke-width="7"/>'+roomPlant(400,760,.85)),
};
Object.assign(portraitInteriorSources,additionalPortraits);
function activePortraitInterior(){
 if(activity==='secretGarden')return 'secretGarden';
 if(room==='daily')return 'tarot';
 if(room==='news')return 'tea';
 if(room==='sticks'||room==='moon')return 'temple';
 return room;
}
const batchPortraitBackdropBefore=paintLivingBackdrop;
paintLivingBackdrop=function(im){
 const id=activePortraitInterior();
 if(W<H&&Object.hasOwn(additionalPortraits,id)){paintPortraitInterior(id);return}
 return batchPortraitBackdropBefore(im)
};
const batchPortraitRoomBefore=drawRoom;
drawRoom=function(){
 const id=activePortraitInterior();
 if(W<H&&Object.hasOwn(additionalPortraits,id))paintPortraitInterior(id);
 return batchPortraitRoomBefore()
};
const batchPortraitActivityBefore=drawActivity;
drawActivity=function(){
 const id=activePortraitInterior();
 if(W<H&&Object.hasOwn(additionalPortraits,id))paintPortraitInterior(id);
 return batchPortraitActivityBefore()
};

/* Friendly navigation, locally written jokes and conversational cameos. */
for(const st of maps.home.st)if(st[0]==='fish'){st[3]='Worry-Free Pier';st[4]='忘忧码头'}
roomActions.fish=[['hit','Whack worries','打小人'],['pier','Bottle it up','烦恼漂流瓶'],['riverShout','Shout it out','河边喊一喊']];
roomActions.park=[['pet','Meet the cats','认识小猫'],['chat','Park gossip','树下吃瓜']];
roomActions.office=[['officeSketch','Escape the meeting','逃离无效会议']];
roomActions.tea=[['chat','Tea & gossip','喝茶吃瓜'],['board','The Daily Scoop','摸鱼日报']];
activityTitle.hit=['Whack your worries','打走烦恼'];
activityTitle.pet=['Make a furry friend','和毛孩子做朋友'];
const nextStopButton=element('button','',$('back').parentNode);
nextStopButton.id='nextStopShortcut';nextStopButton.onclick=()=>travel();
const nextStopStyle=document.createElement('style');
nextStopStyle.textContent='#nextStopShortcut{position:fixed;right:12px;top:calc(env(safe-area-inset-top,0px) + 110px);z-index:6;max-width:46vw;font:13px system-ui;padding:10px 12px;border:1px solid #b99c73;border-radius:14px;background:#f7ead1;color:#584534;box-shadow:0 2px 6px #2c261e30}#nextStopShortcut[hidden]{display:none!important}@media(max-height:500px){#nextStopShortcut{top:86px}}';
document.head.append(nextStopStyle);
const copyHUD=updateHUD;updateHUD=function(){
 copyHUD();
 if(room)$('back').textContent=activity?tr('‹ Back to room','‹ 返回小屋'):tr('‹ Back outside','‹ 出门逛逛');
 $('hudProgress').textContent=tr('Traveller','摸鱼旅人')+' · '+items.length+tr(' keepsakes',' 件纪念品');
 nextStopButton.textContent=tr('Next stop ›','下一站 ›');nextStopButton.hidden=avatar===null||!!activity||!proposal.hidden||!!room||$('page').style.display==='block';
};
const copyAlbumProfile=albumProfile;
albumProfile=function(q){copyAlbumProfile(q);const a=q.querySelector('.albumProfile p');if(a)a.textContent=items.length+tr(' little discoveries',' 份小小回忆')};
pier9=function(){page(tr('Worry-Free Pier','忘忧码头'),tr('No deadlines beyond this point. Even the fish are off duty.','过了这条线，烦恼就下班。鱼早就摸鱼去了。'),q=>{
 pond9(q);privateNote9(q,'bottle');
 b(q,tr('Go fishing','正经摸鱼'),()=>{$('page').style.display='none';start('fish')});
 b(q,tr('Share a bench','找个搭子聊聊'),()=>{$('page').style.display='none';cameo9('home')});
 b(q,tr('Next stop','下一站'),travel)
})};
const townWallNotes=[
 ['Auntie Hong','红姐','The group chat has 283 unread messages. I have chosen inner peace.','群里283条未读。我选择了与世无争。'],
 ['Office Intern','实习生','My boss said think outside the box. So I went outside.','老板说跳出框架思考，我直接下楼了。'],
 ['Uncle Offchip','黄不忙','Caught zero fish. Avoided three meetings. Excellent morning.','鱼没钓到一条，会倒是躲了三个。上午圆满。'],
 ['Lady Clocked Out','甄摸鱼','This palace can keep its drama. I have a dinner reservation.','后宫的戏你们慢慢演，本宫约了晚饭。'],
 ['Mr. Been on Leave','休假先生','I am currently away from my inbox, physically and spiritually.','本人身心均已离开邮箱，勿念。'],
 ['Mochi','麻薯','They called it a performance review. I knocked the form off the table.','听说要绩效考核。我把表格推下桌了。']
];
rant9=function(){page(tr('The Rant Wall','吐槽墙'),tr('The wall has heard worse. No names, no screenshots, no HR.','这面墙见过大场面。不点名，不截图，不惊动人事。'),q=>{
 element('h2',tr('Already on the wall','墙上已有的吐槽'),q);
 let wall=element('div','',q,'townRantWall');
 for(const n of townWallNotes){const note=element('article','',wall,'townRantNote');element('small',tr(n[0],n[1])+tr(' · Fictional resident',' · 虚构居民'),note);element('p',tr(n[2],n[3]),note)}
 element('h2',tr('Leave a worry here','把烦恼留在这里'),q);privateNote9(q,'rant');b(q,tr('Visit the community noticeboard','去摸鱼留言板'),board)
})};
const rantPaperStyle=document.createElement('style');rantPaperStyle.textContent='.townRantWall{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;padding:16px 10px;background:#a58b67;border:7px solid #795a42;border-radius:5px}.townRantNote{position:relative;min-width:0;background:#f6e5b5;color:#5a4737;padding:16px 10px 9px;box-shadow:1px 4px 7px #392b3444;transform:rotate(-1deg);overflow-wrap:anywhere}.townRantNote:nth-child(2n){background:#e6c4ba;transform:rotate(1deg)}.townRantNote:nth-child(3n){background:#d9dfbd}.townRantNote:before{content:"";position:absolute;top:4px;left:48%;width:6px;height:6px;border-radius:50%;background:#a96850}.townRantNote small{font-size:11px}.townRantNote p{font-size:14px;line-height:1.5;margin:8px 0}';document.head.append(rantPaperStyle);
const cameoTopics=[
 [['Work','上班那点事'],['My calendar has more meetings than I have will to attend them.','日程表上的会，比我上班的意愿还多。']],
 [['Life lately','最近过得怎样'],['I tried to become a morning person. We are no longer on speaking terms.','我试着早起养生，现在跟早晨绝交了。']],
 [['Something funny','讲个新瓜'],['Someone brought a laptop to the beach. Even the crabs looked disappointed.','有人带电脑去海边，螃蟹看了都摇头。']],
 [['Just sit together','就安静坐一会儿'],['No need to fill the silence. This is not a networking event.','不用硬找话题，又不是商务社交局。']]
];
const cameoPersonal={
 'Uncle Offchip':[['Fish do not need an appraisal. Neither do you, for the next five minutes.','鱼不用做绩效。这五分钟，你也不用。'],['The tide goes in and out. My emails should learn from it.','潮水知道涨退，我的邮件怎么只进不出。']],
 'Lady Clocked Out':[['The emperor may summon me after six. He will receive an automated reply.','皇上六点后召见？请查收本宫的自动回复。'],['I have retired from palace politics. My new ambition is a full night of sleep.','本宫退出宫斗，现阶段目标是睡个整觉。']],
 'Mr. Raincheck':[['At 5:59 the rain began. At 6:00 I was already on the train.','五点五十九分下雨，六点整我已在地铁上。'],['Some people wait for love. I wait for the kettle.','有人等爱情，我等水开。']],
 'Auntie Hong':[['I never spread gossip. I merely provide context with excellent timing.','我从不传八卦，我只是适时补充背景资料。'],['Tea first. The plot twist can wait until the second cup.','先喝茶，反转等第二杯再说。']],
 'Kim Out of Office':[['My fishing report is confidential. Mainly because there are no fish.','摸鱼报告保密，主要是因为没摸到鱼。'],['A good strategy needs patience. And a comfortable chair.','好战略需要耐心，还需要一张舒服的椅子。']]
};
let cameoChats=load('cameoChatsV1',{});
if(!cameoChats||typeof cameoChats!=='object'||Array.isArray(cameoChats))cameoChats={};
function cameoOpenConversation(a,continuing=false){
 const key=a[0],rec=cameoChats[key]||{visits:0,topics:[]};
 if(!continuing){rec.visits++;cameoChats[key]=rec;save('cameoChatsV1',cameoChats);addItem('Met '+a[0],'遇见'+a[1])}
 const intro=continuing?tr('Another cup? Or another story?','再喝一杯，还是再聊一段？'):rec.visits>1?tr('You again! I kept the seat beside me free.','又见面啦！旁边的位子给你留着呢。'):tr(a[3],a[4]);
 const opts=cameoTopics.map((topic,i)=>[tr(...topic[0]),()=>{
 if(!rec.topics.includes(i))rec.topics.push(i);cameoChats[key]=rec;save('cameoChatsV1',cameoChats);
 const variants=localCameoReplies[key]?.[i];const reply=variants?townReaction('cameo:'+key+':'+i,variants):(cameoPersonal[key]?.[i]||townReaction('cameo:general:'+i,internationalTopicReplies[i]));
 say(tr(a[0],a[1]),tr(...reply),[[tr('Keep chatting','再聊会儿'),()=>cameoOpenConversation(a,true)],[tr('See you around','下次见'),closeTalk]])
 }]);
 opts.push([tr('See you around','下次见'),closeTalk]);
 say(tr(a[0],a[1]),intro+' '+tr('(Fictional guest)','（虚构客串角色）'),opts)
}
cameo9=function(place=scene){
 const pool=cast9.filter(a=>a[2]===place),list=pool.length?pool:cast9;
 const n=Number(load('cameoCount',0))||0,a=list[(hash(day()+place)+n)%list.length];
 save('cameoCount',n+1);cameoOpenConversation(a)
};

/* Progress rewards unique achievements, not repeated low-effort actions.
   Recalculate from existing saves to avoid reset or duplicate migration awards. */
const travellerRanks=[
 [0,'Wandering novice','初来乍到'],
 [40,'Weekend wanderer','周末旅人'],
 [110,'Certified slacker','持证摸鱼人'],
 [220,'Master of doing less','摸鱼大师'],
 [380,'Legend of the valley','解忧谷传说'],
 [600,'Grandmaster of rest','摸鱼宗师']
];
function travellerProgress(){
 const unique=[...new Set(items.map(v=>v[0]))];let xp=0;
 for(const name of unique){
  if(/^Met |^Arrival:/.test(name))continue;
  if(name==='Precision claw champion'||name==='Certified worry shredder')xp+=35;
  else if(/recipe|reading|friendship|blessing|badge|ticket|permit|plush|fortune stick|fortune paper|keepsake|postcard|chart/i.test(name))xp+=10;
  else xp+=4;
 }
 xp+=new Set(visited).size*12;
 let index=0;for(let i=1;i<travellerRanks.length;i++)if(xp>=travellerRanks[i][0])index=i;
 return {xp,level:index+1,rank:travellerRanks[index],next:travellerRanks[index+1]||null};
}
const progressionHUD=updateHUD;
updateHUD=function(){progressionHUD();const v=travellerProgress();$('hudProgress').textContent=tr('Lv. ','等级 ')+v.level+' · '+tr(v.rank[1],v.rank[2]);$('hudProgress').title=v.xp+' XP'+(v.next?' / '+v.next[0]:'');};
const progressionAlbum=albumProfile;
albumProfile=function(q){
 progressionAlbum(q);const v=travellerProgress(),p=q.querySelector('.albumProfile p');
 if(p)p.textContent=tr('Lv. ','等级 ')+v.level+' · '+tr(v.rank[1],v.rank[2]);
 const box=element('section','',q,'travellerProgress');
 element('strong',v.xp+' XP'+(v.next?' / '+v.next[0]:''),box);
 const bar=element('progress','',box);bar.max=v.next?v.next[0]-v.rank[0]:1;bar.value=v.next?v.xp-v.rank[0]:1;
 element('small',v.next?tr('Next: ','下一称号：')+tr(v.next[1],v.next[2]):tr('Maximum rank. Time for tea.','已达最高称号，喝茶去吧。'),box);
 element('p',tr('Discover new places, finish recipes and earn unique keepsakes. Repeating a chat does not earn XP.','探索新地点、完成配方、收藏不同的纪念品。重复聊天不加经验。'),box)
};
const rankStyle=document.createElement('style');rankStyle.textContent='.travellerProgress{padding:12px 15px;margin:0 0 15px;border:1px solid #b69a70;border-radius:8px;background:#efdfbf;color:#554438}.travellerProgress progress{width:100%;height:12px;accent-color:#698a75;display:block;margin:8px 0}.travellerProgress p{font-size:12px;line-height:1.4;margin:6px 0 0}.travellerProgress small{display:block}';document.head.append(rankStyle);


/* Worry-Free Pier: a single emotional-release venue. Keep the legacy fish room ID
   and earned items for saved travellers. Fishing is no longer a player-facing activity. */
activityTitle.riverBottle=['Let it drift','烦恼漂流瓶'];
activityTitle.riverShout=['Shout into the wind','河边喊一喊'];
const riverIsActive=()=>activity==='riverBottle'||activity==='riverShout';
const riverNotes=[
 ['Not another meeting!','别再开会啦！'],
 ['I am going on leave!','我要放假！'],
 ['That was not a quick call!','说好的五分钟呢！'],
 ['Tomorrow can wait!','明天的事明天说！']
];
function riverAuntie(x,y,sc=1){
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ellipse(0,3,38,9,'#322c2855');
 ctx.fillStyle='#68675e';ctx.beginPath();ctx.moveTo(-29,-31);ctx.quadraticCurveTo(-42,-80,-18,-94);ctx.lineTo(18,-94);ctx.quadraticCurveTo(42,-77,29,-31);ctx.closePath();ctx.fill();
 round(-27,-64,54,43,10,'#a16e58','#6d5142');round(-19,-29,14,25,4,'#56483f');round(5,-29,14,25,4,'#56483f');
 ellipse(0,-101,31,31,'#77716a');ellipse(15,-128,16,15,'#77716a');ellipse(0,-96,25,24,'#dcb99b');
 line(-19,-105,-6,-101,'#654e40',2.8);line(19,-105,6,-101,'#654e40',2.8);
 ellipse(-11,-96,2.3,2.8,'#4e443b');ellipse(11,-96,2.3,2.8,'#4e443b');line(-5,-84,6,-83,'#8f5e52',2);
 let sw=activity==='hit'?Math.sin(Math.min(1,Math.max(0,(t-stressSwingAt)/.46))*Math.PI)*13:Math.sin(t*1.9)*2;
 line(-23,-60,-37,-43,'#a16e58',12);line(-37,-43,-22,-35,'#dcb99b',8);
 line(23,-60,38,-45-sw,'#a16e58',12);line(38,-45-sw,39,-33-sw,'#dcb99b',8);
 ctx.restore()
}
function riverBottleArt(x,y,angle=0,scale=1,sealed=true){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
 let glass=ctx.createLinearGradient(-13,0,14,0);glass.addColorStop(0,'#507f71');glass.addColorStop(.25,'#b0d6b3');glass.addColorStop(.65,'#7aa997');glass.addColorStop(1,'#4d756c');
 ctx.fillStyle=glass;ctx.strokeStyle='#46695e';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(-6,-25);ctx.lineTo(6,-25);ctx.lineTo(7,-13);ctx.quadraticCurveTo(14,-8,14,2);ctx.lineTo(14,19);ctx.quadraticCurveTo(0,25,-14,19);ctx.lineTo(-14,2);ctx.quadraticCurveTo(-14,-8,-7,-13);ctx.closePath();ctx.fill();ctx.stroke();
 line(-8,-4,-8,16,'#edf2c7bb',2);round(-7,0,14,12,2,'#efdfb9','#a78d68');if(sealed)round(-7,-30,14,6,2,'#ab8057');ctx.restore()
}
function riverBankY(x){return 400+14*Math.sin((x-150)/150)}
function riverLanding(power){const p=clamp(power,15,100),x=380+p*1.65;return {x,y:riverBankY(x)-19-p*.36}}
function riverSceneBackdrop(){
 // Fixed world-space river edge: both the room and close-up share the same shore.
 // The landscape art remains behind this interactive foreground.
 paintLivingBackdrop(pics.fish);
 const b=livingBounds(),water=ctx.createLinearGradient(0,240,0,425);
 water.addColorStop(0,'#9bb6ad');water.addColorStop(.55,'#7c9e9b');water.addColorStop(1,'#507d7e');
 const left=b.x,right=b.x+b.w;
 ctx.save();ctx.fillStyle=water;ctx.beginPath();ctx.moveTo(left,285);ctx.quadraticCurveTo(400,265,right,280);ctx.lineTo(right,riverBankY(right));
 for(let x=right;x>left;x-=12)ctx.lineTo(x,riverBankY(x));ctx.lineTo(left,riverBankY(left));ctx.closePath();ctx.fill();
 // Reflections: restrained, irregular lengths, never a grid.
 ctx.save();ctx.clip();for(let i=0;i<38;i++){let x=left+((i*83+t*(3+i%4))%Math.max(1,b.w)),y=290+(i*29)%116;ctx.globalAlpha=.09+.10*(.5+.5*Math.sin(t*.9+i));line(x,y,x+14+(i%6)*8,y,'#f0e4b7',1.4)}
 ctx.restore();
 const ground=ctx.createLinearGradient(0,400,0,800);ground.addColorStop(0,'#b7a27b');ground.addColorStop(.45,'#a18d69');ground.addColorStop(1,'#786a56');
 ctx.fillStyle=ground;ctx.beginPath();ctx.moveTo(left,riverBankY(left));for(let x=left;x<right;x+=12)ctx.lineTo(x,riverBankY(x));ctx.lineTo(right,riverBankY(right));ctx.lineTo(right,Math.max(b.y+b.h,800));ctx.lineTo(left,Math.max(b.y+b.h,800));ctx.closePath();ctx.fill();
 // Stone embankment, shadow and worn boardwalk, drawn independently of the background.
 ctx.beginPath();for(let x=left;x<=right;x+=10){if(x===left)ctx.moveTo(x,riverBankY(x));else ctx.lineTo(x,riverBankY(x))}ctx.strokeStyle='#5f6655';ctx.lineWidth=7;ctx.stroke();
 for(let i=0;i<36;i++){let x=left+(i*97)%Math.max(1,b.w),y=riverBankY(x)+9+(i%3)*6;ellipse(x,y,9+i%4*3,4,'#c4b08b88')}
 ctx.fillStyle='#9e7957';ctx.beginPath();ctx.moveTo(155,465);ctx.lineTo(630,465);ctx.lineTo(710,790);ctx.lineTo(90,790);ctx.closePath();ctx.fill();
 for(let i=0;i<11;i++){let y=475+i*29;line(155-(y-465)*.2,y,630+(y-465)*.25,y,'#6c563e88',1.4);line(155-(y-465)*.2,y+2,630+(y-465)*.25,y+2,'#d4b38c66',1)}
 for(const x of [145,655]){for(let i=0;i<8;i++){const xx=x+i*3-10,yy=riverBankY(xx)+8;line(xx,yy+15,xx+Math.sin(t*.9+i)*6,yy-25-i%3*8,'#607655',2.5)}}
 ctx.restore()
}
function riverRing(x,y,age,max=55){
 if(age<0||age>1.5)return;ctx.save();ctx.strokeStyle='rgba(224,245,222,'+Math.max(0,1-age/1.5)*.75+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,9+max*age,3+max*.28*age,0,0,TAU);ctx.stroke();ctx.restore()
}
function riverBegin(mode){
 if(room!=='fish')return;
 start(mode);state.riverPhase='ready';state.riverAt=t;state.riverNote='';state.riverMode=mode;state.riverStrength=60;
 hint(...(mode==='riverBottle'?['Write a private note, set throw strength, then let it go.','写下私人纸条，调整力度，再把烦恼放走。']:['Choose what to shout. No microphone needed.','想喊什么就喊什么，不需要麦克风。']));
 refreshControls()
}
function riverPerform(){
 if(!riverIsActive()||state.riverPhase!=='ready')return;
 const input=$('riverPrivateNote');if(input){state.riverNote=input.value.slice(0,100);input.value='';input.blur()}
 if(activity==='riverShout'&&!state.riverNote)state.riverNote=tr(...townReaction('riverPrompt',riverNotes));
 state.riverPhase='walk';state.riverAt=t;state.count=(state.count||0)+1;refreshControls();sound(420);
 hint(...(activity==='riverBottle'?['Fold it, seal it, and walk to the water.','折好纸条，封好瓶子，走到河边。']:['Walk to the riverbank and let it out.','走到河边，把烦恼喊出去。']))
}
function riverReset(){
 if(!riverIsActive())return;state.riverNote='';state.riverPhase='ready';state.riverAt=t;refreshControls()
}
const riverControlsBefore=refreshControls;
refreshControls=function(){
 riverControlsBefore();const el=$('gameControls');if(!el)return;el.classList.toggle('riverControls',riverIsActive());
 if(!riverIsActive()){if(state&&Object.hasOwn(state,'riverNote'))state.riverNote='';return;}
 el.replaceChildren();el.hidden=false;
 if(state.riverPhase==='ready'){
  const inp=element('input','',el);inp.id='riverPrivateNote';inp.type='text';inp.maxLength=100;
  inp.placeholder=activity==='riverBottle'?tr('A worry (optional)','写下烦恼（选填）'):tr('What would you shout?','想喊些什么？');
  inp.setAttribute('aria-label',inp.placeholder);inp.autocomplete='off';inp.value=state.riverNote||'';
  inp.oninput=()=>{if(riverIsActive())state.riverNote=inp.value};
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();riverPerform()}};
  if(activity==='riverBottle'){const powerLabel=element('label',tr('Strength','力度'),el,'riverPowerLabel');powerLabel.htmlFor='riverThrowPower';const power=element('input','',el);power.id='riverThrowPower';power.type='range';power.min=15;power.max=100;power.value=state.riverStrength||60;power.setAttribute('aria-label',tr('Throw strength','投掷力度'));power.oninput=()=>{state.riverStrength=Number(power.value)}}
  b(el,activity==='riverBottle'?tr('Seal & release','封瓶放走'):tr('Shout!','大声喊！'),riverPerform)
 }else if(state.riverPhase==='done'){
  b(el,tr('Again','再来一次'),riverReset);
  b(el,tr('Back to pier','返回码头'),()=>{$('back').click()})
 }else{const status=element('span',activity==='riverBottle'?tr('Letting it go…','烦恼漂走了……'):tr('Let it out…','把烦恼喊出去……'),el);status.setAttribute('role','status')}
};
const riverControlStyle=document.createElement('style');riverControlStyle.textContent='#gameControls.riverControls{width:min(92vw,420px);max-width:92vw;display:flex;flex-wrap:wrap;justify-content:center;border-radius:8px;background:#eee2c9f5;padding:8px;gap:6px}#gameControls.riverControls input{min-width:0;flex:1 1 130px;width:100%;border:1px solid #b69a72;border-radius:5px;background:#fff7e5;padding:10px;font:14px system-ui;min-height:44px}#gameControls.riverControls .riverPowerLabel{font-size:11px;color:#63543e}#gameControls.riverControls input[type=range]{flex:0 1 90px;width:90px;min-height:44px;accent-color:#697c65;padding:0;background:transparent}#gameControls.riverControls button{font-size:13px;white-space:normal;min-height:44px}#gameControls.riverControls span{font-size:13px;padding:9px}';document.head.append(riverControlStyle);
const riverActivityBefore=drawActivity;
drawActivity=function(){
 if(!riverIsActive())return riverActivityBefore();
 riverSceneBackdrop();
 const bottleMode=activity==='riverBottle',phase=state.riverPhase||'ready',age=Math.max(0,t-(state.riverAt??t)),walking=phase==='walk'&&age<1.1;
 const power=clamp(state.riverStrength||60,15,100),{x:landX,y:landY}=riverLanding(power);
 let walk=phase==='ready'?0:Math.min(1,age/1.1),px=265+walk*65,py=610-walk*102;
 if(phase==='ready'||walking)backHuman(px,py,avatar??0,walking,'up',1.35);
 else drawRitualPose(px,py,1.4,{reach:{x:px+26,y:py-75},bow:phase==='walk'?.12:0});
 riverAuntie(205,488,.78);
 if(bottleMode){
  if(phase==='ready'){round(275,465,68,13,3,'#ad8860','#74583e');round(290,448,23,12,2,'#f0e1ba');riverBottleArt(330,445,.05,.75,false)}
  else if(age<.55){riverBottleArt(330,445,0,.85,age>.3);round(319,422+age*45,15,9,2,'#f1dfad')}
  else if(age<1.1)riverBottleArt(px+15,py-70,.1,.75);
  else if(age<1.85){const f=(age-1.1)/.75;riverBottleArt(px+24+(landX-px-24)*f,py-70+(landY-py+70)*f-(28+power*.62)*Math.sin(Math.PI*f),Math.PI*f,.8)}
  else {const drift=Math.min(1,(age-1.85)/2.5);if(drift<1){ctx.save();ctx.globalAlpha=1-drift;riverBottleArt(landX+75*drift,landY-18*drift+Math.sin(t*4)*2,1.2,.72);ctx.restore()}riverRing(landX,landY,age-1.85,48)}
 }else if(age>1.1&&phase!=='ready'){
  for(let i=0;i<3;i++)riverRing(375,riverBankY(375)-25,age-1.1-i*.25,80);
  if(age<2.85)wonderSceneText(state.riverNote||tr('AAAAAH!','啊啊啊！'),450,354-(age-1.1)*12,240,19,'#fff4d5',3)
 }
 if(phase==='walk'&&age>(bottleMode?4.35:3.1)){
  state.riverNote='';state.riverPhase='done';
  if(bottleMode){addItem('Let it drift keepsake','烦恼随风纪念章');hint(...townReaction(power<35?'bottleSoft':power>85?'bottleStrong':'bottleMedium',power<35?riverBottleReplies.soft:power>85?riverBottleReplies.strong:riverBottleReplies.medium))}
  else{addItem('River echo keepsake','河边回声纪念章');hint(...townReaction('riverEcho',riverEchoReplies))}
  refreshControls();sound(530)
 }
};
const riverPropBefore=prop;
prop=function(id,x,y){
 if(id==='riverShout'){ctx.save();line(x-35,y+8,x-35,y-76,'#785c45',5);line(x-35,y-76,x+32,y-76,'#785c45',4);ctx.fillStyle='#b97561';ctx.beginPath();ctx.moveTo(x-28,y-73);ctx.quadraticCurveTo(x+Math.sin(t*3)*8,y-65,x+35,y-70);ctx.lineTo(x+24,y-45);ctx.lineTo(x-28,y-48);ctx.closePath();ctx.fill();ctx.restore();return}
 if(room==='fish'&&id==='pier'){ctx.save();round(x-47,y-9,94,20,3,'#ac8661','#77583d');line(x-35,y+10,x-35,y+38,'#77583d',5);line(x+35,y+10,x+35,y+38,'#77583d',5);round(x-25,y-21,28,16,2,'#f1dfb8','#a78b6c');riverBottleArt(x+24,y-29,.04,.9,false);ctx.restore();return}
 if(id==='officeSketch')return riverPropBefore('rant',x,y);
 return riverPropBefore(id,x,y)
};
const riverActionBefore=action;
action=function(id){
 if(room==='fish'&&id==='pier')return riverBegin('riverBottle');
 if(room==='fish'&&id==='riverShout')return riverBegin('riverShout');
 if(room==='fish'&&id==='hit'){start('hit');hint('Auntie: Hit the paper worry, not a person.','阿姨：打的是烦恼纸人，不是真人。');return}
 if(room==='office'&&id==='officeSketch'){
  closeTalk();return say(tr('Wang Laoban','王老板'),tr('Quick meeting. Only five minutes. It starts at 5:58 PM.','开个短会，就五分钟。下午五点五十八开始。'),[
   [tr('Ask for an agenda','先问议程'),()=>say(tr('Wang Laoban','王老板'),tr('Excellent initiative. Please prepare the agenda.','很好，很主动。那你来准备议程吧。'),[[tr('I have a train to catch','我要赶车'),()=>{addItem('Meeting escape ticket','逃会车票');closeTalk()}]])],
   [tr('Pretend my connection froze','假装网络卡了'),()=>say(tr('Wang Laoban','王老板'),tr('No problem. I recorded the meeting for you. All 97 minutes.','没关系，我录下来了。整整九十七分钟。'),[[tr('Clock out anyway','照常下班'),()=>{addItem('Meeting escape ticket','逃会车票');closeTalk()}]])]
  ])
 }
 return riverActionBefore(id)
};


/* Daily editorial content: stable personal fortune, changing reactions.
   No birth details, name, private notes, network or paid service involved. */
let townDailySeed=load('townDailySeedV1',null);
if(typeof townDailySeed!=='string'||!/^[a-z0-9]{8,40}$/.test(townDailySeed)){
 townDailySeed=Array.from(crypto.getRandomValues(new Uint32Array(3)),n=>n.toString(36).padStart(7,'0')).join('');
 save('townDailySeedV1',townDailySeed)
}
const townFortunes=[
 {title:['The quiet inbox','邮箱难得清静'],work:['If nobody says “quick call”, take the win.','没人喊你开个短会，就是今天的福气。'],rest:['Make a cup of something before opening another tab.','先喝口水，别急着开第十八个网页。'],place:'island'},
 {title:['A small detour','今日宜绕路'],work:['The printer can have its own personal crisis.','打印机卡纸，让它自己冷静一下。'],rest:['Take the scenic route to the kitchen.','绕个路去外婆家，顺便蹭口汤。'],place:'island'},
 {title:['Protect your lunch','午饭保卫战'],work:['A meeting at noon is a crime against noodles.','中午开会，面条都替你委屈。'],rest:['Eat something you actually enjoy.','今天吃点自己喜欢的，别再随便对付。'],place:'island'},
 {title:['No need to explain','今日宜少解释'],work:['“Noted” is a complete sentence in this town.','在摸鱼小镇，回复“收到”就够了。'],rest:['Let Auntie handle the imaginary paperwork.','把烦恼交给码头阿姨，她专治加班。'],place:'home'},
 {title:['A little bravery','胆量加一格'],work:['You are allowed to ask when the meeting ends.','勇敢一点，问问这个会到底几点结束。'],rest:['Try a machine you have not mastered.','试试那台还没拿下的游戏机。'],place:'island'},
 {title:['The cat approves','猫猫已批准'],work:['Today’s imaginary supervisor is a cat. It is asleep.','今天的虚拟领导是只猫，正在睡觉。'],rest:['Give yourself the same patience as a shy cat.','对自己也像对怕生的小猫一样耐心。'],place:'home'},
 {title:['An ordinary good day','平平常常也很好'],work:['No grand achievement required. Showing up counts.','不用每天干出大事，平安下班也算赢。'],rest:['Visit the temple if you feel like a quiet minute.','想清静一分钟，就去庙里走走。'],place:'fortune'},
 {title:['Leave it for tomorrow','明天再说'],work:['The spreadsheet has not developed feelings overnight.','表格不会因为你今晚不改它而伤心。'],rest:['Send one imaginary worry down the river.','挑一个烦恼，送它去河里出差。'],place:'home'},
 {title:['A curious little clue','今日有点小好奇'],work:['Not every mystery requires a follow-up email.','不是每个谜团都需要邮件追进度。'],rest:['Explore a different story at Discovery Station.','去奇遇驿站，看看人生还有什么剧本。'],place:'wonder'},
 {title:['A warm bowl','热汤比大道理实在'],work:['Some problems are easier after lunch.','有些事情吃饱了再想，真的会容易一点。'],rest:['Grandma has an opinion about instant noodles.','外婆对泡面当晚餐这件事很有意见。'],place:'island'},
 {title:['The right to do less','今天少做一点'],work:['Your calendar does not need another personality.','你的日历已经够满了，不必再培养一个分身。'],rest:['A short walk counts as a whole little holiday.','走一小段路，也算给自己放个小假。'],place:'fortune'},
 {title:['Unexpected small joys','小开心正在路上'],work:['The group chat can wait until the tea is ready.','群聊先放着，奶茶摇完再说。'],rest:['Follow your curiosity, not the task list.','今天跟着好奇心走，不跟着待办清单。'],place:'wonder'}
];
const townColours=[['Sage green','鼠尾草绿','#8d9d81'],['Tea brown','奶茶棕','#b38d68'],['River blue','河水蓝','#729ba4'],['Persimmon','柿子橙','#c78658'],['Plum','梅子紫','#94758c'],['Rice paper','米纸白','#e5d6b5'],['Moss','苔藓绿','#6e8361'],['Evening pink','晚霞粉','#c9918c']];
function townFortuneFor(date=shrineClock().day,seed=townDailySeed){
 // A rotating editorial sequence guarantees adjacent days have different themes.
 const ordinal=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
 const n=hash(seed+'theme')%townFortunes.length;
 const themeIndex=((ordinal+n)%townFortunes.length+townFortunes.length)%townFortunes.length;
 return {date,themeIndex,theme:townFortunes[themeIndex],colour:townColours[hash(seed+date+'colour')%townColours.length],number:1+hash(seed+date+'number')%9}
}
function renderTownFortune(book){
 const f=townFortuneFor(),slip=element('section','',book,'townFortuneSlip');slip.dataset.date=f.date;slip.dataset.theme=String(f.themeIndex);
 element('small',f.date+' · '+tr('DAILY LUCK · A NOTE FROM THE VALLEY','今日运势 · 解忧谷小签'),slip,'fortuneDate');
 element('h2',tr(...f.theme.title),slip);
 element('p',tr(...f.theme.work),slip,'fortuneWork');
 element('p',tr(...f.theme.rest),slip);
 const row=element('div','',slip,'fortuneDetails'),swatch=element('span','',row,'fortuneSwatch');swatch.style.backgroundColor=f.colour[2];
 element('span',tr(...f.colour.slice(0,2))+' · '+tr('Lucky number ','幸运数字 ')+f.number,row);
 element('small',tr('For fun, not a prediction.','摸鱼趣签，仅供娱乐。'),slip);
 // No automatic travel, no new collectible or reroll button.
}
const townFortuneStyle=document.createElement('style');
townFortuneStyle.textContent='.townFortuneSlip{position:relative;margin:14px 0 20px;padding:17px 19px;background:#f2e5c7;color:#594634;border:1px solid #bca17c;border-radius:3px;box-shadow:2px 4px 0 #cfba92;font-family:Georgia,"Songti SC",serif}.townFortuneSlip:before{content:"";position:absolute;inset:5px;border:1px solid #bca17c88;pointer-events:none}.townFortuneSlip h2{margin:8px 0!important;font-size:clamp(20px,5vw,26px);line-height:1.25;color:#4c6253}.townFortuneSlip p{margin:7px 0;line-height:1.5;font-size:14px;overflow-wrap:anywhere}.townFortuneSlip small{font-size:11px;color:#725c45}.townFortuneSlip .fortuneDetails{display:flex;gap:9px;align-items:center;margin:11px 0;font-size:13px}.fortuneSwatch{display:inline-block;flex:none;width:22px;height:22px;border-radius:50%;border:1px solid #927c60}.fortuneDate{letter-spacing:.02em}';
document.head.append(townFortuneStyle);
const townFortunePassport=passport;
passport=function(){townFortunePassport();const book=$('content').querySelector('.travelAlbum');if(book){renderTownFortune(book);const slip=book.lastElementChild,profile=book.querySelector('.albumProfile');if(profile&&profile.parentNode===book)profile.after(slip);else book.prepend(slip)}};
$('dockPassport').onclick=passport;

// Reactions rotate without immediately repeating. Attempts are session-local;
// personality scores, daily readings, skill outcomes and private text are untouched.
const townReactionCursor=new Map();
function townReaction(key,lines){
 const count=townReactionCursor.get(key)||0;townReactionCursor.set(key,count+1);
 return lines[(hash(shrineClock().day+townDailySeed+key)%lines.length+count)%lines.length]
}
const auntieHitReplies=[
 ['Auntie: That one was for the meeting about the meeting.','阿姨：这一下，打给那个讨论要不要开会的会。'],
 ['Auntie: Slow down. The slipper also has working hours.','阿姨：慢点，拖鞋也是有下班时间的。'],
 ['Auntie: Very good. Now unclench your jaw.','阿姨：很好。现在把牙关松开。'],
 ['Auntie: Nobody needs a PowerPoint for this.','阿姨：这件事不用做汇报PPT。'],
 ['Auntie: Your paper worry has requested a transfer.','阿姨：纸小人已经申请调部门了。'],
 ['Auntie: One more? Up to you. I charge imaginary money.','阿姨：还打不打随你，反正收的是空气钱。']
];
const auntieSmackBefore=smack;
smack=function(){
 if(activity!=='hit'||room!=='fish')return auntieSmackBefore();
 auntieSmackBefore();
 if(state.count!==10&&state.count!==25&&state.count!==50&&stressCombo!==5)hint(...townReaction('auntieHit',auntieHitReplies))
};

const riverEchoReplies=[
 ['Auntie: Even the fish heard you.','阿姨：不错，连鱼都听见了。'],
 ['Auntie: Louder next time? No, I live here.','阿姨：下次再大声点？算了，我还住这儿。'],
 ['Auntie: The river is not taking minutes.','阿姨：放心，这条河不用写会议纪要。'],
 ['Auntie: Better out here than in the group chat.','阿姨：在这儿喊，总比发到工作群强。']
];
const riverBottleReplies={
 soft:[['Auntie: Small throw, big relief.','阿姨：扔得不远，烦恼照样下班。'],['Auntie: No need for an Olympic record.','阿姨：不用拿奥运冠军，能放下就行。']],
 medium:[['Auntie: That worry is officially out of office.','阿姨：这个烦恼正式下班了。'],['Auntie: No forwarding address. Excellent.','阿姨：没留新地址，很好，不许退件。'],['Auntie: The river accepts resignations.','阿姨：这条河接受烦恼辞职。']],
 strong:[['Auntie: Wah, that one must have been a long meeting.','阿姨：哇，这一定开了很久的会。'],['Auntie: A bit more and it would need a passport.','阿姨：再远一点，瓶子都要办护照了。'],['Auntie: Save some strength for opening your lunch.','阿姨：留点力气，等会儿还要开饭盒。']]
};


/* Fictional international guests. Character voices are authored separately in each language. */
const internationalTopicReplies=[
 [
  ['My boss says “quick one”. I have learned to bring a charger.','领导说“简单讲两句”，我已经开始找充电器了。'],
  ['I tried to clear my inbox. It took that personally.','刚清完未读，群里又来了个@所有人。'],
  ['They asked me to think outside the box. I went to get kopi.','领导让我跳出舒适圈，我跳去楼下买奶茶了。']
 ],
 [
  ['I left my laptop at home. First holiday in years.','出门没带电脑，终于有点旅游的感觉了。'],
  ['My weekend plans are very ambitious. Breakfast, nap, repeat.','周末行程排得很满：吃饭、睡觉、醒来再吃。'],
  ['I bought an umbrella. Naturally, it stopped raining.','刚买了把伞，雨就停了。老天挺会做生意。']
 ],
 [
  ['Someone choped a seat with a tissue packet here. The temple cat sat on it.','有人拿纸巾占座，庙猫直接坐上去了。'],
  ['The town introduced a meeting-free Friday. There is a meeting about it.','小镇推行周五不开会，结果先开会讨论这事。'],
  ['The souvenir shop has a mug marked “urgent”. It is empty.','手信店有个写着“紧急”的杯子，里面啥都没有。']
 ],
 [
  ['No networking. No icebreakers. Just tea.','不破冰，不自我介绍，喝茶就行。'],
  ['This is the only queue I have joined without checking how long it is.','今天唯一没催进度的一件事，就是喝茶。']
 ]
];
const localCameoReplies={
 'Master Payrise':[
  [['I asked for a pay rise. They gave me a bigger spreadsheet.','我求的是加薪，领导给我升了个表格版本。'],['Apparently exposure is a form of compensation. Can I pay rent with it?','领导说这是成长机会。房东收成长值吗？']],
  [['I bought economy. The gods upgraded me to standing room.','拜完财神，地铁还是站票。']],
  [['I have a new kung fu move: dodge the 6pm calendar invite.','我新练了一招：六点前闪避会议邀请。']],
  [['Even a comedy needs an intermission.','喜剧也得有中场休息嘛。']]
 ],
 'Lady Clocked Out':[
  [['If the emperor wants a status update, he may consult the eunuch.','皇上若问进度，请去找总管公公。'],['My palace has a strict no-meeting-after-six policy.','本宫宫规第一条：六点以后不接旨。']],
  [['The court can keep its promotions. I want sleep.','晋封什么的让给别人吧，本宫想睡个整觉。']],
  [['A concubine tried to poison my tea. It was decaf.','有人给本宫下毒，竟然换了无咖啡因奶茶。']],
  [['Stay. No one here needs to win favour.','坐吧，这儿不用争宠。']]
 ],
 'Auntie Hong':[
  [['You heard nothing from me, hor.','这事你可不是从我这儿听说的啊。'],['I am not kaypoh. I am maintaining situational awareness.','我不叫八卦，我叫掌握一手资讯。']],
  [['I only went downstairs for kopi. Came back with a whole season of drama.','下楼买杯咖啡，回来已经听完一整部连续剧。']],
  [['The tissue packet was there first. In Singapore, that is basically property law.','在新加坡，纸巾先到，人后到。懂的都懂。']],
  [['Drink first. The tea is hot, and so is the gossip.','先喝茶，瓜还烫着呢。']]
 ],
 'Dragon King Meow':[
  [['I own nine imaginary companies. None will pay my cat food bill.','本喵坐拥九大虚构集团，猫粮还得自己买。']],
  [['My assistant booked me a nap. Finally, competent management.','助理给本喵安排了午睡，终于会办事了。']],
  [['You have entered my territory. Admission fee: one compliment.','此乃本喵地盘，入场费一句夸奖。']],
  [['You may sit beside me. Do not make it a strategic partnership.','准你坐旁边，别谈战略合作。']]
 ],
 'Mr. Raincheck':[
  [['In my film, the last train leaves at exactly six.','我的电影里，末班车永远六点准时开。']],
  [['I waited for a message for 2046 seconds. It was a work notification.','我等了2046秒，结果来的是工作通知。']],
  [['The rain fell on my umbrella. The deadline fell on me.','雨落在伞上，截止日期落在我头上。']],
  [['We can be quiet. No subtitles necessary.','就这样坐着，不必加字幕。']]
 ],
 'Kim Out of Office':[
  [['Today I have a strategic objective: finish lunch while it is hot.','今日战略目标：趁热吃完午饭。']],
  [['My annual leave has been approved by absolutely nobody in this fictional town.','我在虚构小镇休假，无需任何领导批准。']],
  [['The river has rejected my meeting request. I respect its boundaries.','河流拒绝了我的会议邀请，尊重它的边界。']],
  [['No minutes will be circulated.','不发会议纪要。']]
 ],
 'MRT Uncle':[
  [['I stood on the MRT for eight stops. That counts as a standing desk.','地铁站了八站，今天的站立办公完成。']],
  [['Kopi o kosong. My calendar is the only thing with extra sugar.','咖啡不加糖，只有老板画的饼够甜。']],
  [['The escalator broke. Suddenly everyone discovered exercise.','电扶梯坏了，全站的人突然开始健身。']],
  [['Sit lah. We are not rushing for the last train.','坐啦，不赶末班车。']]
 ],
 'Hotpot Commissioner':[
  [['A hotpot has less pointless discussion than my Monday meeting.','火锅局都比周一例会有实际产出。']],
  [['I am healing my inner child with a second bowl of noodles.','再加一份面，今日的精神补偿。']],
  [['Someone ordered mild spice and then requested three cups of milk.','有人点了微辣，最后喝了三杯牛奶。']],
  [['No need to clock in here.','这儿不用打卡，放心吃。']]
 ],
 'The Crossing Guard':[
  [['I missed my train at Shibuya. For once, the calendar lost.','涩谷错过一班车，今天终于不是我输给日历。']],
  [['A convenience store egg sandwich fixed my entire afternoon.','一份便利店蛋三明治，治愈了整个下午。']],
  [['Someone bowed to the vending machine. It gave them nothing.','有人对自动贩卖机鞠躬，它还是不给优惠。']],
  [['Listen to the trains. No rush.','听听列车的声音，慢慢来。']]
 ],
 'Eurostar Nap Club':[
  [['My train was delayed. I called it a wellness break.','列车晚点，我宣布这是身心疗愈时间。']],
  [['I crossed three time zones to take the exact same nap.','跨了三个时区，还是睡同款午觉。']],
  [['My passport has more stamps than my laptop has stickers.','护照盖章比电脑贴纸还多。']],
  [['A window seat is enough.','靠窗就好。']]
 ]
};
for(const guest of [
 ['MRT Uncle','地铁阿叔','home','Kopi first. Then we discuss your problems.','先喝咖啡，再讨论你的烦恼。'],
 ['Hotpot Commissioner','火锅委员','island','The only agenda today is what goes into the pot.','今天唯一议程：下什么菜。'],
 ['The Crossing Guard','路口守望人','wonder','The crossing has turned green. The inbox can wait.','路口绿灯了，未读消息先放着。'],
 ['Eurostar Nap Club','欧洲睡神','wonder','I came for the scenery. Slept through the Alps.','我来看风景，结果睡过了阿尔卑斯山。']
])if(!cast9.some(a=>a[0]===guest[0]))cast9.push(guest);


/* Chart consultation: private in-page follow-up, based on computed palaces.
   Original reflection prompts, not predictions or a claimed full traditional reading. */
const chartStarThemes={
 '紫微':['leadership and responsibility','责任与主导'],
 '天机':['planning and adaptability','思考与应变'],
 '太阳':['visibility and contribution','表达与付出'],
 '武曲':['discipline and practical resources','执行力与资源管理'],
 '天同':['comfort and ease','安稳与自在'],
 '廉贞':['principles and boundaries','原则与界限'],
 '天府':['stability and stewardship','稳定与积累'],
 '太阴':['reflection and inner security','内省与安全感'],
 '贪狼':['curiosity and desire','好奇与欲望'],
 '巨门':['discussion and discernment','沟通与辨析'],
 '天相':['cooperation and balance','合作与平衡'],
 '天梁':['support and judgement','照顾与判断'],
 '七杀':['independence and decisiveness','独立与决断'],
 '破军':['change and rebuilding','改变与重整']
};
const chartConsultTopics=[
 {k:0,name:['Life & character','命宫与性格'],question:['What do I want to be known for?','我希望自己成为什么样的人？'],practice:['Think of a recent decision that felt true to you. What made it feel right?','想一想最近一次让你觉得很符合自己的决定。为什么？']},
 {k:8,name:['Career & direction','官禄宫与事业'],question:['How can I find a better direction at work?','事业上怎样找到更适合自己的方向？'],practice:['Name one skill you enjoy using, and one condition that helps you do your best work.','列出一项你喜欢发挥的能力，以及一种让你工作更顺心的条件。']},
 {k:2,name:['Relationships','夫妻宫与关系'],question:['What matters to me in a relationship?','在亲密关系中，我真正重视什么？'],practice:['Consider one need you can express clearly instead of hoping someone will guess it.','想一想有什么需要可以直接表达，而不是期待对方猜中。']},
 {k:4,name:['Money habits','财帛宫与金钱习惯'],question:['How do I think about money?','我可以怎样看待自己的金钱习惯？'],practice:['Review a real budget or savings goal. A chart cannot predict investment returns.','看看真实预算或储蓄目标。命盘不能预测投资收益。']},
 {k:6,name:['Travel & change','迁移宫与变化'],question:['What helps me adjust to a new place?','什么能帮助我适应新的环境？'],practice:['Choose one practical step that makes an upcoming change feel manageable.','找一个实际可行的小步骤，让接下来的变化更容易面对。']},
 {k:10,name:['Rest & wellbeing','福德宫与休息'],question:['What helps me genuinely unwind?','怎样才能真正放松下来？'],practice:['Try a small break that does not depend on achieving something.','试试不以完成任务为目标的一小段休息。']}
];
function chartConsultData(z,topic){
 const index=mod(z.life-topic.k,12),stars=z.stars[index]||[];
 return {index,stars:stars.map(st=>tr(...st)),themes:stars.map(st=>chartStarThemes[st[1]]).filter(Boolean).map(v=>tr(...v))}
}
function renderChartConsultation(out,z){
 const section=element('section','',out,'chartConsultation');
 element('h2',tr('A conversation with Master Yue','与月师傅聊聊'),section);
 element('p',tr('Choose a topic. The explanation uses the stars in your actual chart, with questions for reflection. This is a small main-star interpretation, not an AI adviser or a forecast.','选一个想了解的主题。这里结合你命盘中的主星，提供简要解读和反思问题。仅为十四主星趣味解读，不是 AI 咨询或未来预测。'),section);
 const topics=element('div','',section,'chartTopics'),answer=element('article','',section,'chartReply');
 answer.setAttribute('aria-live','polite');
 const show=topic=>{
  const data=chartConsultData(z,topic);answer.replaceChildren();
  element('h3',tr(...topic.question),answer);
  element('p',tr('Your palace: ','你的宫位：')+tr(...topic.name)+' · '+branches[data.index],answer);
  element('p',data.stars.length?tr('Main stars: ','主星：')+data.stars.join(' · '):tr('No main star in this palace. A fuller reading would consider the opposite palace and other factors. No missing-star judgement is made here.','此宫无主星。完整解读还需参考对宫和其他因素，这里不据此判断吉凶。'),answer);
  if(data.themes.length)element('p',tr('Symbolic themes for reflection: ','可供反思的象征主题：')+data.themes.join(' / '),answer);
  element('p',tr(...topic.practice),answer,'chartPractice');
  for(const button of topics.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.topic===String(topic.k)));
 };
 for(const topic of chartConsultTopics){const button=b(topics,tr(...topic.name),()=>show(topic));button.dataset.topic=String(topic.k);button.setAttribute('aria-pressed','false')}
 show(chartConsultTopics[0])
}
const consultStyle=document.createElement('style');consultStyle.textContent='.chartConsultation{margin:24px 0;padding:17px;border-top:2px solid #a38a61;background:#eee3ca;color:#544436}.chartConsultation h2,.chartConsultation h3{font-family:Georgia,"Songti SC",serif}.chartConsultation h3{font-size:19px;line-height:1.4;margin:4px 0 10px}.chartTopics{display:flex;flex-wrap:wrap;gap:6px}.chartTopics button{flex:1 1 125px;min-height:44px;font-size:14px;white-space:normal}.chartTopics button[aria-pressed=true]{background:#536b5a;color:#fff5de}.chartReply{margin:16px 0 0;border-top:1px solid #bdab8b;padding:14px 0 0;overflow-wrap:anywhere}.chartPractice{font-style:italic;color:#4f634e}';document.head.append(consultStyle);
