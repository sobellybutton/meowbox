'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const s=fs.readFileSync(path.resolve(__dirname,'../src/startup.js'),'utf8');
const extract=(a,b)=>{const start=s.indexOf(a),end=s.indexOf(b,start);assert.ok(start>=0&&end>start);return s.slice(start,end)};
const block=extract('/* PAW_PAINTED_GARDEN_BEGIN */','/* PAW_PAINTED_GARDEN_END */');
const walk=extract('/* PAW_GARDEN_WALK_BEGIN */','/* PAW_GARDEN_WALK_END */');
const api=new Function(block+walk+';return {pawRearGardenPlate,pawRearGardenNodes,pawRearGardenEdges,pawRearGardenTargets,pawRearGardenRoute,pawRearGardenPellet,pawGardenWalkTick}')();
const {pawRearGardenPlate:p,pawRearGardenNodes:n,pawRearGardenEdges:e,pawRearGardenTargets:t,pawRearGardenRoute:route,pawRearGardenPellet:pellet,pawGardenWalkTick:tick}=api;
assert.ok(fs.existsSync(path.resolve(__dirname,'../assets/visual/staging/2026-11-27/rooms/temple/garden.webp')));
assert.equal(p.h/p.w,1631/960);
for(const [key,point] of Object.entries(n))for(const action of Object.keys(t)){
 const steps=route(point,action);assert.ok(steps.length);assert.deepEqual(steps.at(-1),n[action]);
 let last=key;for(const v of steps){const next=Object.keys(n).find(k=>n[k][0]===v[0]&&n[k][1]===v[1]);assert.ok(next);assert.ok(next===last||e.some(([a,b])=>a===last&&b===next||a===next&&b===last));last=next}
 const q={painted:true,pos:point.slice(),route:steps.map(v=>v.slice()),action,last:0};let found=null;
 for(let i=1;i<1000&&!found;i++)found=tick(q,i*.05,false);
 assert.equal(found,action);assert.deepEqual(q.pos,n[action]);assert.equal(q.route.length,0);assert.equal(tick(q,51,false),null);
}
assert.equal(route([.1,.1],'feed'),null);assert.equal(route(n.entry,'__proto__'),null);
const paused={painted:true,pos:n.entry.slice(),route:route(n.entry,'feed'),action:'feed',last:0};
tick(paused,1,true);assert.deepEqual(paused.pos,n.entry);
for(let i=0;i<5;i++)for(let age=.01;age<.9;age+=.02){const pt=pellet(i,age);if(pt){assert.ok(pt[0]>=.31&&pt[0]<=.53);assert.ok(pt[1]>.52&&pt[1]<.65)}}
for(const [u,v,w,h] of Object.values(t))assert.ok(u-w/2>=0&&u+w/2<=1&&v-h/2>=0&&v+h/2<=1);
console.log('Painted garden route, contact targets, pause and feeding geometry passed.');

const lobby=extract('/* PAW_WISH_LOBBY_BEGIN */','/* PAW_WISH_LOBBY_END */');
const {pawWishLobbyPlate:plate,pawWishLobbyStations:stations,pawWishLobbyLabels:labels,pawWishLobbySafe:safe,pawWishLobbyCamera:camera,pawWishLobbyEntry:entry,pawWishLobbyArrival:arrival,pawWishLobbyHost:host,pawWishLobbyVisitors:visitors}=new Function(lobby+';return {pawWishLobbyPlate,pawWishLobbyStations,pawWishLobbyLabels,pawWishLobbySafe,pawWishLobbyCamera,pawWishLobbyEntry,pawWishLobbyArrival,pawWishLobbyHost,pawWishLobbyVisitors}')();
assert.ok(fs.existsSync(path.resolve(__dirname,'../assets/visual/painted/recovered/scenes/wishing_garden_portrait.webp')));
assert.deepEqual(Object.keys(stations),['wishes','coin']);
for(const pos of [entry,arrival,host,...visitors,...Object.values(stations).map(v=>v.slice(2))])assert.ok(safe(...pos));
for(const [a,b] of [[entry,arrival],...Object.values(stations).flatMap(v=>[[arrival,v.slice(2)],[v.slice(2),entry]])])for(let i=0;i<=100;i++){let f=i/100;assert.ok(safe(a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])))}
for(const [w,h] of [[320,568],[390,844],[430,932],[768,1024],[1280,720],[844,390]]){
 const c=camera(w,h);assert.ok(c.s>0);
 for(const pos of [entry,arrival,host,...visitors,...Object.values(stations).map(v=>v.slice(2)),...Object.values(labels).map(v=>v.slice(0,2))]){
  const x=pos[0]*c.s+c.ox,y=pos[1]*c.s+c.oy;
  assert.ok(x>=0&&x<=w&&y>=0&&y<=h);
 }
 if(w<h){assert.ok(plate.w*c.s>=w-.01);assert.ok(plate.h*c.s>=h-.01)}
}
assert.equal(safe(400,450),false);assert.equal(safe(250,650),false);assert.equal(safe(600,650),false);assert.equal(camera(0,800),null);
console.log('Wishing Garden painted lobby, clear floor routes and viewport coverage passed.');

const pool=new Function(extract('/* PAW_PAINTED_POOL_LAYOUT_BEGIN */','/* PAW_PAINTED_POOL_LAYOUT_END */')+';return pawPaintedPoolLayout')();
assert.ok(fs.existsSync(path.resolve(__dirname,'../assets/visual/painted/garden/wishing-pool.webp')));
for(const [w,h,f] of [[320,568,115],[390,844,120],[430,932,140],[768,1024,130],[1280,720,100],[1920,1080,105],[844,390,92],[360,900,160]]){
 const a=pool(w,h,f);assert.ok(a);
 assert.ok(a.ox<=0&&a.oy<=0&&a.ox+a.iw>=w-.01&&a.oy+a.ih>=h-.01);
 assert.ok(a.x>=0&&a.x+a.w<=w+.01&&a.w>=160);
 assert.ok(a.y+a.h*.39>=(w>h?48:90)-.01);
 assert.ok(a.y+a.h*.86<=h-Math.max(f,70)-24);
 assert.ok(Math.abs((a.y+a.h*.39-a.oy)/a.ih-(.333+.159*.39))<1e-8);
 assert.ok(Math.abs((a.y+a.h*.86-a.oy)/a.ih-(.333+.159*.86))<1e-8);
}
assert.equal(pool(0,844,100),null);assert.equal(pool(320,300,250),null);
console.log('Painted wishing-pool target, coin origin and viewport coverage passed.');

const wish=new Function(extract('/* PAW_WISH_INLINE_BEGIN */','/* PAW_WISH_INLINE_END */')+';return {pawWishInlineValid,pawWishInlineText,pawWishInlineSelection,pawPierPrivateActivity}')();
const current={gardenStage:'write'};
assert.ok(wish.pawWishInlineValid(current,current,'wishes','wishes','write'));
for(const args of [[current,{},'wishes','wishes','write'],[current,current,'fish','wishes','write'],[current,current,'wishes','riverShout','write'],[current,current,'wishes','wishes','carry']])assert.equal(wish.pawWishInlineValid(...args),false);
for(const value of ['', '  ',null,'x'.repeat(301)])assert.equal(wish.pawWishInlineText(value),null);
assert.equal(wish.pawWishInlineText('  希望平安  '),'希望平安');assert.equal(wish.pawWishInlineText('x'.repeat(300)).length,300);
const saved=[{id:1},{id:2},{id:3}];for(let i=-2;i<5;i++)assert.equal(wish.pawWishInlineSelection(saved,i).record.id,3-Math.max(0,Math.min(i,2)));
assert.equal(wish.pawWishInlineSelection([],0),null);
for(const kind of ['riverBottle','riverShout','hit',null])assert.equal(wish.pawPierPrivateActivity('fish',kind),['riverBottle','riverShout'].includes(kind));
assert.equal(wish.pawPierPrivateActivity('wishes','riverBottle'),false);
console.log('Inline wish validation, private lantern archive and pier host scope passed.');

const reflect=new Function(extract('/* PAW_NATIVE_REFLECTION_BEGIN */','/* PAW_NATIVE_REFLECTION_END */')+';return {pawReflectionOwns,pawReflectionStep,pawStressGroupPage,pawReflectionRoomTitle}')();
const view={run:{},token:5,mode:'type',result:{},room:'quiz',activity:'wonderScene',phase:'result'};
assert.ok(reflect.pawReflectionOwns(view,{...view}));
for(const [key,value] of Object.entries({run:{},token:6,mode:'care',result:{},room:'story',activity:'hit',phase:'question'}))assert.equal(reflect.pawReflectionOwns(view,{...view,[key]:value}),false);
assert.equal(reflect.pawReflectionOwns(null,view),false);
for(let count=1;count<15;count++)for(let i=0;i<count;i++)for(const d of [-1,0,1])assert.equal(reflect.pawReflectionStep(count,i,d),Math.max(0,Math.min(count-1,i+d)));
const stressFixture=[{targets:[1,2,3,4,5]},{targets:[6,7,8]},{targets:[9]}];
assert.equal(reflect.pawStressGroupPage(stressFixture,0,0).entries.length,4);
assert.equal(reflect.pawStressGroupPage(stressFixture,0,1).entries[0].index,4);
assert.equal(reflect.pawStressGroupPage(stressFixture,1,0).entries[2].index,7);
assert.equal(reflect.pawStressGroupPage(stressFixture,2,0).entries[0].index,8);
assert.equal(reflect.pawStressGroupPage(stressFixture,0,2),null);
assert.equal(reflect.pawStressGroupPage(stressFixture,-1,0),null);
assert.ok(reflect.pawStressGroupPage(stressFixture,0,0).next);
assert.ok(reflect.pawStressGroupPage(stressFixture,0,1).previous);
assert.equal(reflect.pawReflectionRoomTitle('match')[0],'The Heart Café');
console.log('Live reflection ownership, page bounds and contextual worry slip indices passed.');

const localTV=new Function(extract('/* PAW_LOCAL_HOME_TV_BEGIN */','/* PAW_LOCAL_HOME_TV_END */')+';return {pawHomeTVChannel,pawWheelReturnKind}')();
for(let count=1;count<12;count++)for(let i=0;i<count;i++)for(let d=-5;d<=5;d++)assert.equal(localTV.pawHomeTVChannel(count,i,d),((i+d)%count+count)%count);
for(const [w,t,p,expected] of [[true,false,null,'wallet'],[false,true,'wallet','today'],[false,false,'wallet','wallet'],[false,false,null,'today']])assert.equal(localTV.pawWheelReturnKind(w,t,p),expected);
assert.equal(localTV.pawHomeTVChannel(0,0,1),0);
console.log('Local television channel bounds and daily wheel parent resolution passed.');

const discoveryReturn=new Function(extract('/* PAW_DISCOVERY_RETURN_BEGIN */','/* PAW_DISCOVERY_RETURN_END */')+';return {pawDiscoveryReturnMatches,pawDiscoveryScroll}')();
const storyOrigin={kind:'story',room:'story',run:{},token:3,result:'endTea',district:'wonder',finished:true};
assert.ok(discoveryReturn.pawDiscoveryReturnMatches(storyOrigin,{...storyOrigin}));
for(const [key,value] of Object.entries({kind:'cafe',room:'match',run:{},token:4,result:'endNap',district:'home',finished:false}))assert.equal(discoveryReturn.pawDiscoveryReturnMatches(storyOrigin,{...storyOrigin,[key]:value}),false);
for(const sh of [0,100,400,1000])for(const ch of [0,80,600])for(const y of [-100,0,50,500,1500])assert.equal(discoveryReturn.pawDiscoveryScroll(y,sh,ch),Math.max(0,Math.min(y,Math.max(0,sh-ch))));
assert.equal(discoveryReturn.pawDiscoveryScroll(NaN,100,20),0);
console.log('Discovery share return ownership and scroll restoration bounds passed.');

const catalogueReturn=new Function(extract('/* PAW_CATALOGUE_RETURN_BEGIN */','/* PAW_CATALOGUE_RETURN_END */')+';return {pawCatalogueReturnMatches,pawCollectionReturnMatches}')();
const catalogueOrigin={id:'futon',back:'room',category:'rest',style:'japanese',scroll:120};
assert.ok(catalogueReturn.pawCatalogueReturnMatches(catalogueOrigin,'room','rest','japanese'));
for(const [a,b,c] of [['shop','rest','japanese'],['room','all','japanese'],['room','rest','all']])assert.equal(catalogueReturn.pawCatalogueReturnMatches(catalogueOrigin,a,b,c),false);
assert.equal(catalogueReturn.pawCatalogueReturnMatches({...catalogueOrigin,scroll:NaN},'room','rest','japanese'),false);
assert.equal(catalogueReturn.pawCatalogueReturnMatches(null,'room','rest','japanese'),false);
const collectionOrigin={run:{},room:'mystery',district:'island',activity:'blindBox'};
assert.ok(catalogueReturn.pawCollectionReturnMatches(collectionOrigin,{...collectionOrigin}));
for(const [key,value] of Object.entries({run:{},room:'arcade',district:'home',activity:'claw'}))assert.equal(catalogueReturn.pawCollectionReturnMatches(collectionOrigin,{...collectionOrigin,[key]:value}),false);
assert.equal(catalogueReturn.pawCollectionReturnMatches(collectionOrigin,null),false);
console.log('Catalogue return and blind box scene ownership passed.');

assert.deepEqual(Object.keys(t),['feed','seat']);
assert.equal(route(n.entry,'cats'),null);assert.equal(route(n.entry,'chime'),null);
assert.ok(n.feed[1]>=.60&&n.seat[1]>=.59&&n.fork[1]>=.60,'Feet stay on foreground paving');
assert.ok(s.includes('pawRearGardenWarp(pawRearGardenArt(),p,[.75,.30,.81,.37],breeze)'),'Ambient wind without interaction');
assert.ok(!s.includes("'paw-rear-cat-'+i"),'No individual cat hit targets');

/* A throw belongs to the exact active pond visit, even while the old DOM
   remains attached behind the room or a newer activity. */
{
 const src=fs.readFileSync(path.resolve(__dirname,'../src/town-access.js'),'utf8');
 const guard=new Function(src.split('/* PAW_WISH_VISIT_BEGIN */')[1].split('/* PAW_WISH_VISIT_END */')[0]+';return pawWishVisitCurrent')();
 let count=0;
 for(const connected of [true,false])for(const display of ['block','none'])for(const sameRoom of [true,false])for(const sameActivity of [true,false])for(const sameState of [true,false]){
  const run={};assert.equal(guard(connected,display,'wishes',sameRoom?'wishes':'park',null,sameActivity?null:'wishes',run,sameState?run:{}),connected&&display==='block'&&sameRoom&&sameActivity&&sameState);count++
 }
 for(const callback of ['function frame(now)','function rebound(at)','function finish()'])assert.ok(src.includes(callback+'{if(!current()){cancelFlight();return;}'));
 assert.ok(src.includes("tr('Return to the garden','回到花园')"));
 console.log('PASS '+count+' wishing-pool visit ownership combinations and 4 runtime wiring checks');
}

{
 const source=fs.readFileSync(path.resolve(__dirname,'../src/town-access.js'),'utf8');
 const f=new Function(source.split('/* PAW_WISH_BANK_BEGIN */')[1].split('/* PAW_WISH_BANK_END */')[0]+';return {pawWishBankGeometry,pawWishCoinOrigin,pawWishApproach}')();
 let n=0;
 for(const [width,height] of [[320,568],[390,844],[430,932],[768,1024],[1440,900],[844,390]]){
  const pond={x:width*.13,y:height*.3,w:width*.74,h:height*.24},g=f.pawWishBankGeometry({width,height},pond),o=f.pawWishCoinOrigin(g,pond);
  assert.ok(g.foot.y>pond.y+pond.h);assert.ok(g.keeper.y>pond.y+pond.h);
  assert.ok(Math.abs(pond.x+o.x*pond.w/100-g.hand.x)<1e-8);
  assert.ok(Math.abs(pond.y+o.y*pond.h/100-g.hand.y)<1e-8);n+=4
 }
 for(const [age,reduced,want] of [[-1,false,0],[475,false,.5],[950,false,1],[1500,false,1],[0,true,1]]){assert.equal(f.pawWishApproach(age,reduced),want);n++}
 for(const needle of ["!bankReady||!held||busy||done","coin.hidden=!bankReady||!held||done","tr('Take a Paw Coin','取一枚爪爪币')","from.x+(x-from.x)*f","from.y+(y-from.y)*f","garden-keeper/standing.webp"]){assert.ok(source.includes(needle));n++}
 console.log('PASS '+n+' bank anchor, approach, pickup and launch checks');
}


// Every throw input shares the same pickup/flight/completion state.
{
 const source=fs.readFileSync(path.resolve(__dirname,'../src/town-access.js'),'utf8');
 const sync=source.split('const syncToss=()=>{')[1].split('};')[0];
 const apply=new Function('busy','done','bankReady','held','gentle','takeCoin','keyboardButtons','pond',sync);
 let n=0;
 for(const busy of [false,true])for(const done of [false,true])for(const bankReady of [false,true])for(const held of [false,true]){
  const gentle={},takeCoin={},keyboardButtons=Array.from({length:5},()=>({})),pond={setAttribute(k,v){this[k]=v}};
  apply(busy,done,bankReady,held,gentle,takeCoin,keyboardButtons,pond);
  const unavailable=busy||done||!bankReady||!held;
  assert.equal(gentle.disabled,unavailable);n++;
  for(const button of keyboardButtons){assert.equal(button.disabled,unavailable);n++}
  assert.equal(takeCoin.hidden,held||done);assert.equal(takeCoin.disabled,!bankReady||busy);assert.equal(pond['aria-busy'],String(busy));n+=3
 }
 assert.ok(source.includes("keyboardButtons.push(btn)"));
 assert.ok(source.includes("keyboardButtons.push(b(controls,tr('Throw','投币')"));
 console.log('PASS '+n+' pickup/throw control state checks and keyboard wiring');
}

// Wish writing retains the garden's painting and coin throws retain a planted
// full sprite. No artificial torso split or switch to a generic background.
{
 const e=fs.readFileSync(path.resolve(__dirname,'../src/extensions.js'),'utf8');
 const a=fs.readFileSync(path.resolve(__dirname,'../src/town-access.js'),'utf8');
 assert.ok(s.includes("room==='wishes'&&activity==='wishes'&&pawRoomImageReady(pawWishLobbyArt())"));
 assert.ok(s.includes('pawWishPaintedActivity()?pawWishLobbyCamera(W,H)'));
 assert.ok(s.includes('ctx.drawImage(pawWishLobbyArt(),p.x,p.y,p.w,p.h)'));
 assert.ok(e.includes('function gardenPaperAnchor()'));
 const lean=new Function(a.split('/* PAW_WISH_BANK_BEGIN */')[1].split('/* PAW_WISH_BANK_END */')[0]+';return pawWishThrowLean')();
 for(let age=-10;age<500;age++){assert.ok(Math.abs(lean(age,false))<=.1400001);assert.equal(lean(age,true),0)}
 assert.ok(lean(235,false)>.13);assert.equal(lean(0,false),0);assert.equal(lean(480,false),0);
 assert.ok(a.includes('ag.translate(x,y);ag.rotate(lean);ag.drawImage(im,-fx,-fy,w,H)'));
 assert.ok(!a.includes('const split=68/94*im.naturalHeight'));
 console.log('Painted wish scene and planted coin toss checks passed');
}
