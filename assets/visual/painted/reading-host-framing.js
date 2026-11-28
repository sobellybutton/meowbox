/* Reading host framing. Eye landmarks are approximate source-pixel readings
 * from the inspected six original candidate poses, not semantic seat anchors.
 * Do not animate between these stills as if they are a motion sequence.
 * The scene author must supply a verified target eye position/span and draw
 * the actual chair, table, cards or chart in the proper depth order. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawReadingHost=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const landmarks={
  "master-yue": {
    "seated-welcome-explain": {
      "sha256": "8ed2fc0c58f69ae85e72bc214940355ba8904e3710732182c8b5ae851a0d2a96",
      "eyes": [
        [
          292,
          124
        ],
        [
          360,
          103
        ]
      ]
    },
    "seated-brush-held": {
      "sha256": "6502f9d601ccca4a5108e0b43dd896c812145de243abef224435c8f45368c929",
      "eyes": [
        [
          339,
          115
        ],
        [
          404,
          100
        ]
      ]
    },
    "seated-present-blank-parchment": {
      "sha256": "b3a7bb81ccaeee35f1ca16c33ab511a67da110bec89436f87b538ceb2580be9e",
      "eyes": [
        [
          330,
          115
        ],
        [
          390,
          98
        ]
      ]
    }
  },
  "fortune-teller": {
    "seated-idle": {
      "sha256": "7f58b019c90bd4866761f6dd23226e4df3abf2f7d1c92e118d3c84156a635c38",
      "eyes": [
        [
          354,
          123
        ],
        [
          404,
          108
        ]
      ]
    },
    "seated-shuffle-held": {
      "sha256": "9671da2bd200e277e7eb161f537b00e0e7fbf3167ce3176dad5478a44b8bf900",
      "eyes": [
        [
          338,
          123
        ],
        [
          389,
          110
        ]
      ]
    },
    "seated-present-card": {
      "sha256": "a07dcc9b259509d22ace03da2585bbd4b1fe8cfb3f27c922a7a0358693503c4b",
      "eyes": [
        [
          347,
          125
        ],
        [
          397,
          111
        ]
      ]
    }
  }
};
const finite=Number.isFinite;
const pair=v=>Array.isArray(v)&&v.length===2&&v.every(finite);
function frame(manifest,id,pose,eyeCenter,eyeSpan){
 if(!pair(eyeCenter)||!finite(eyeSpan)||eyeSpan<=0||eyeSpan>1000)return null;
 const a=Object.hasOwn(landmarks,id)&&Object.hasOwn(landmarks[id],pose)?landmarks[id][pose]:null;
 const p=manifest?.schema===1?manifest.characters?.[id]?.poses?.[pose]:null;
 if(!a||!p||a.sha256!==p.sha256||!pair(p.canvas)||p.canvas.some(n=>!Number.isInteger(n)||n<=0)||p.path!=='assets/visual/painted/'+id+'/pose-candidates/'+pose+'.webp')return null;
 const [l,r]=a.eyes,[w,h]=p.canvas,sourceSpan=Math.hypot(r[0]-l[0],r[1]-l[1]);
 if(!sourceSpan||a.eyes.some(([x,y])=>x<0||x>w||y<0||y>h))return null;
 const scale=eyeSpan/sourceSpan,mid=[(l[0]+r[0])/2,(l[1]+r[1])/2];
 const rect=[eyeCenter[0]-mid[0]*scale,eyeCenter[1]-mid[1]*scale,w*scale,h*scale];
 if(!rect.every(finite))return null;
 return {path:p.path,canvas:[w,h],rect,scale,eyeCenter:eyeCenter.slice(),eyeSpan,point:(x,y)=>[rect[0]+x*scale,rect[1]+y*scale]};
}
function draw(ctx,image,f){
 if(!ctx||!f||!image?.complete||image.naturalWidth!==f.canvas[0]||image.naturalHeight!==f.canvas[1])return false;
 ctx.drawImage(image,...f.rect);return true;
}
// Inset physical prop surfaces traced on the inspected candidate sprites.
// Card bounds deliberately avoid the decorative rim and gripping fingers.
const propLandmarks=Object.freeze({
 'master-yue':{
  'seated-brush-held':{grip:[329,308],tip:[371,375]},
  'seated-present-blank-parchment':{paper:[[276,272],[503,272],[276,410]]},
  'seated-welcome-explain':{palm:[550,232]}
 },
 'fortune-teller':{
  'seated-idle':{hands:[424,384]},
  'seated-shuffle-held':{upperDeck:[462,300],lowerDeck:[475,340]},
  'seated-present-card':{card:[[462,153],[509,157],[452,229]]}
 }
});
function contacts(manifest,id,pose,eyeCenter,eyeSpan){
 const f=frame(manifest,id,pose,eyeCenter,eyeSpan);
 if(!f)return null;
 const points=propLandmarks[id]?.[pose];if(!points)return null;
 const mapped={};
 for(const [k,v] of Object.entries(points))mapped[k]=pair(v)?f.point(...v):v.map(p=>f.point(...p));
 return {...f,contacts:mapped,id,pose};
}
// Map a unit square onto an inset held card or parchment. The fourth corner
// is inferred from the three safe interior landmarks; no hand is overpainted.
function surface(f,name){
 if(!f||!['card','paper'].includes(name))return null;
 const points=f.contacts?.[name];
 if(!Array.isArray(points)||points.length!==3||!points.every(pair))return null;
 const [o,x,y]=points,a=x[0]-o[0],b=x[1]-o[1],c=y[0]-o[0],d=y[1]-o[1];
 if(![a,b,c,d].every(finite)||a*d-b*c<=0)return null;
 return {matrix:[a,b,c,d,...o],corners:[o,x,[x[0]+y[0]-o[0],x[1]+y[1]-o[1]],y]};
}
function withSurface(ctx,f,name,paint){
 const s=surface(f,name);
 if(!ctx||!s||typeof paint!=='function')return false;
 ctx.save();try{
  ctx.transform(...s.matrix);ctx.beginPath();ctx.rect(0,0,1,1);ctx.clip();
  paint(ctx);return true
 }finally{ctx.restore()}
}
// The caller supplies the actual chosen card and its atlas rectangle,
// never a decorative substitute or a second random draw. Reverse in place.
function drawHeldCard(ctx,f,image,source,reversed=false){
 if(!f||f.id!=='fortune-teller'||f.pose!=='seated-present-card'||!image?.complete||!image.naturalWidth||!image.naturalHeight||!Array.isArray(source)||source.length!==4||!source.every(finite))return false;
 const [x,y,w,h]=source;
 if(x<0||y<0||w<=0||h<=0||x+w>image.naturalWidth||y+h>image.naturalHeight)return false;
 return withSurface(ctx,f,'card',g=>{
  if(reversed){g.translate(1,1);g.rotate(Math.PI)}
  g.drawImage(image,x,y,w,h,0,0,1,1)
 })
}
// Only the existing computed chart renderer may provide parchment contents.
// The normalized callback is clipped to the blank paper, not the host's hands.
function drawHeldParchment(ctx,f,paint){
 if(f?.id!=='master-yue'||f.pose!=='seated-present-blank-parchment')return false;
 return withSurface(ctx,f,'paper',paint)
}
// Read only the computed twelve-palace result, never input fields or birth data.
const palaceSlots=Object.freeze([0,1,2,3,4,7,8,11,12,13,14,15]);
function chartPalaces(grid){
 const cells=grid?.querySelectorAll?.('article:not(.blank)');
 if(!cells||cells.length!==12)return null;
 const result=Array.from(cells,(cell,i)=>{
  const name=cell.querySelector('strong')?.textContent?.trim();
  return {slot:palaceSlots[i],name,life:!!cell.classList?.contains('lifePalace')}
 });
 return result.every(c=>typeof c.name==='string'&&c.name.length>0&&c.name.length<=80)&&result.filter(c=>c.life).length===1?result:null
}
// A short ink reveal on the already-held paper. Caller supplies active time;
// no wall-clock timer, storage, chart recomputation or fabricated results.
function parchmentClock(q,now,blocked=false,reduced=false){
 if(!q||!finite(now))return 0;
 if(reduced){q.elapsed=.72;q.last=now;q.blocked=!!blocked;return 1}
 const prior=q.last;
 if(finite(prior)&&now>=prior&&!blocked&&!q.blocked)q.elapsed=Math.min(.72,(finite(q.elapsed)?q.elapsed:0)+Math.min(.1,now-prior));
 q.last=now;q.blocked=!!blocked;
 return Math.max(0,Math.min(1,(q.elapsed||0)/.72))
}
function paintChartPalaces(g,palaces,progress=1){
 if(!g||!Array.isArray(palaces)||palaces.length!==12||!finite(progress)||!palaces.every((v,i)=>v?.slot===palaceSlots[i]&&typeof v.name==='string'&&v.name.length>0)||palaces.filter(c=>c.life).length!==1)return false;
 const p=Math.max(0,Math.min(1,progress));
 g.save();try{
  g.beginPath();g.rect(0,0,1,p);g.clip();
  g.strokeStyle='#8e674b';g.fillStyle='#674e3b';g.lineWidth=.007;g.font='.056px Georgia,"Songti SC",serif';g.textAlign='center';g.textBaseline='middle';
  for(const c of palaces){
   const x=(c.slot%4)/4,y=Math.floor(c.slot/4)/4;
   if(c.life){g.fillStyle='#aa735333';g.fillRect(x,y,.25,.25);g.fillStyle='#674e3b'}
   g.strokeRect(x,y,.25,.25);g.fillText(c.name,x+.125,y+.125,.225)
  }
  g.strokeRect(.25,.25,.5,.5);
  g.beginPath();g.arc(.5,.5,.12,0,Math.PI*2);g.stroke();
  return true
 }finally{g.restore()}
}
return Object.freeze({frame,draw,contacts,surface,drawHeldCard,drawHeldParchment,chartPalaces,parchmentClock,paintChartPalaces});
});
