const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
const a=src.indexOf('/* MBVISUAL_FIT_BEGIN */'),b=src.indexOf('/* MBVISUAL_FIT_END */');
if(a<0||b<a)throw Error('Missing visual fit helper');
const check=new Function(src.slice(a,b)+`
let count=0;
for(const [w,h] of [[320,568],[360,640],[390,844],[430,932],[768,1024]]){
 for(const bounds of [[186,580,390,585],[155,640,335,660],[170,660,175,650],[205,595,220,690]]){
  for(const bottom of [h-90,h-180,h-235]){
   const top=95,view={s:1,ox:0,oy:0},v=mbVisualFitStage(view,bounds,w,top,bottom);
   const [l,r,u,d]=bounds;
   if(v.s>view.s||v.ox+l*v.s<7.999||v.ox+r*v.s>w-7.999||v.oy+u*v.s<top-.001||v.oy+d*v.s>bottom+.001)throw Error('Stage does not fit');
   count++;
  }
 }
}
const safe={s:.5,ox:0,oy:100};if(mbVisualFitStage(safe,[100,300,0,100],360,80,300)!==safe)throw Error('Safe camera needlessly changed');
return count+1;
`);console.log('PASS: '+check()+' camera fit checks');

const fa=src.indexOf('/* PAW_FOOT_BOUNDS_BEGIN */'),fb=src.indexOf('/* PAW_FOOT_BOUNDS_END */');
if(fa<0||fb<fa)throw Error('Missing visible-foot helper');
const footChecks=new Function(src.slice(fa,fb)+`
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
let checks=0;
for(const [w,h] of [[80,160],[128,128],[256,180]]){
 const rgba=new Uint8Array(w*h*4);
 const l=Math.floor(w*.25),r=Math.floor(w*.75),top=Math.floor(h*.1),bottom=Math.floor(h*.78);
 for(let y=top;y<bottom;y++)for(let x=l;x<r;x++)rgba[(y*w+x)*4+3]=255;
 rgba[((h-1)*w+1)*4+3]=255;
 const box=pawVisibleBounds(rgba,w,h);
 assert(box&&box.top===top-1&&box.bottom===bottom+1&&box.left===l-1&&box.right===r+1,'Transparent padding or isolated pixel');
 checks++;
}
assert(pawVisibleBounds(new Uint8Array(16*16*4),16,16)===null,'Blank image should not be cropped');checks++;
const opaque=new Uint8Array(16*16*4).fill(255),box=pawVisibleBounds(opaque,16,16);
assert(box.left===0&&box.top===0&&box.right===16&&box.bottom===16,'Opaque image should retain bounds');checks++;
return checks;
`);
console.log('PASS: '+footChecks()+' resident foot-pivot checks');

const ta=src.indexOf('/* PAW_TOPIC_LAYOUT_BEGIN */'),tb=src.indexOf('/* PAW_TOPIC_LAYOUT_END */');
if(ta<0||tb<ta)throw Error('Missing tarot topic layout');
const topicChecks=new Function(src.slice(ta,tb)+`
const slots=pawReadingTopicSlots();let count=0;
for(const a of slots){
 if(a.cy+a.h/2>=a.captionY-a.captionH/2)throw Error('Card touches its own caption');
 for(const b of slots){if(a===b)continue;
 const overlap=Math.abs(a.x-b.x)<(a.w+b.captionW)/2&&a.cy+a.h/2>b.captionY-b.captionH/2&&a.cy-a.h/2<b.captionY+b.captionH/2;
 if(overlap)throw Error('Card covers another caption');count++;
 }
}
return count+slots.length;
`);
console.log('PASS: '+topicChecks()+' tarot topic separation checks');

const ext=fs.readFileSync(path.join(__dirname,'../src/extensions.js'),'utf8');
function section(source,start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 if(a<0||b<a)throw Error('Missing scene geometry section '+start);
 return source.slice(a,b);
}
const sceneGeometry=new Function("let room=null,activity=null;const roomActions={arcade:[['bubbleArcade'],['goldfishScoop'],['blindBox']]};"+
 section(ext,'const indoorStages=','function indoorDestination')+
 section(src,'const groundedStations=','function drawGroundedSupport')+
 section(src,'const groundedObstaclesBefore=indoorObstacles;','/* Exploration first')+
 section(src,'/* PAW_ROOM_LAYOUT_BEGIN */','function pawSceneFloorShadow')+`
let count=0;
for(room of ['temple','arcade']){
 const spec=indoorStages[room],ids=room==='temple'?Object.keys(pawTempleLayout):['bubbleArcade','goldfishScoop','blindBox'];
 const points=[spec.entry,spec.arrival,...ids.map(id=>spec.stations[id].slice(2))];
 for(const a of points)for(const b of points){
  if(!indoorSafe(...a)||!indoorPath(a,b))throw Error(room+' blocked approach '+a+' to '+b);
  count++;
 }
}
return count;
`);
console.log('PASS: '+sceneGeometry()+' redesigned temple and arcade ordered routes');
