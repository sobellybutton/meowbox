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
return Object.freeze({frame,draw});
});
