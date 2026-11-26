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
