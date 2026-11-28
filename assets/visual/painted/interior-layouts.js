/* Reviewed portrait room geometry; normalized to original painting. Standalone runtime module awaiting shared-source integration. No save changes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawPaintedInteriors=api})(typeof globalThis==='object'?globalThis:this,function(){'use strict';
const rooms={
  "tarot": {
    "file": "tarot",
    "blob": "079e5d35b65129a9d2c06c0e7380ac794528ac5d",
    "lane": [
      [
        0.69,
        0.42,
        0.78
      ],
      [
        0.77,
        0.43,
        0.84
      ],
      [
        0.85,
        0.47,
        0.83
      ],
      [
        0.91,
        0.51,
        0.8
      ]
    ],
    "entry": [
      0.63,
      0.89
    ],
    "arrival": [
      0.6,
      0.79
    ],
    "host": [
      0.73,
      0.73
    ],
    "visitors": [
      [
        0.77,
        0.8
      ]
    ],
    "stations": {
      "tarot": {
        "object": [
          0.5,
          0.48
        ],
        "approach": [
          0.54,
          0.7
        ],
        "label": [
          0.5,
          0.44
        ]
      }
    }
  },
  "destiny": {
    "file": "destiny",
    "blob": "58812987d8393ce86cd448b1a92c02c556ed2418",
    "lane": [
      [
        0.65,
        0.39,
        0.68
      ],
      [
        0.72,
        0.29,
        0.75
      ],
      [
        0.8,
        0.26,
        0.72
      ],
      [
        0.9,
        0.26,
        0.64
      ]
    ],
    "entry": [
      0.45,
      0.88
    ],
    "arrival": [
      0.47,
      0.78
    ],
    "host": [
      0.65,
      0.7
    ],
    "visitors": [
      [
        0.36,
        0.75
      ]
    ],
    "stations": {
      "destiny": {
        "object": [
          0.54,
          0.45
        ],
        "approach": [
          0.5,
          0.66
        ],
        "label": [
          0.54,
          0.42
        ]
      }
    }
  },
  "quiz": {
    "file": "quiz",
    "blob": "d5c0646f5c88733f9e5f4c608551a696cc578edb",
    "lane": [
      [
        0.65,
        0.41,
        0.72
      ],
      [
        0.73,
        0.36,
        0.77
      ],
      [
        0.83,
        0.26,
        0.74
      ],
      [
        0.91,
        0.23,
        0.72
      ]
    ],
    "entry": [
      0.53,
      0.89
    ],
    "arrival": [
      0.53,
      0.78
    ],
    "host": [
      0.67,
      0.7
    ],
    "visitors": [
      [
        0.44,
        0.75
      ]
    ],
    "stations": {
      "quiz": {
        "object": [
          0.72,
          0.47
        ],
        "approach": [
          0.61,
          0.66
        ],
        "label": [
          0.72,
          0.43
        ]
      }
    }
  },
  "story": {
    "file": "story",
    "blob": "af4485bad303849e53f616e05fbff54e65786827",
    "lane": [
      [
        0.64,
        0.34,
        0.66
      ],
      [
        0.71,
        0.24,
        0.77
      ],
      [
        0.8,
        0.23,
        0.77
      ],
      [
        0.91,
        0.23,
        0.77
      ]
    ],
    "entry": [
      0.5,
      0.89
    ],
    "arrival": [
      0.5,
      0.77
    ],
    "host": [
      0.64,
      0.71
    ],
    "visitors": [
      [
        0.34,
        0.74
      ]
    ],
    "stations": {
      "story": {
        "object": [
          0.5,
          0.46
        ],
        "approach": [
          0.5,
          0.65
        ],
        "label": [
          0.5,
          0.4
        ]
      }
    }
  },
  "match": {
    "file": "match",
    "blob": "8c8e73d01bdfa22de3a51bc88b50557d0b783c05",
    "lane": [
      [
        0.6,
        0.29,
        0.42
      ],
      [
        0.67,
        0.3,
        0.58
      ],
      [
        0.75,
        0.35,
        0.68
      ],
      [
        0.83,
        0.39,
        0.68
      ],
      [
        0.91,
        0.38,
        0.65
      ]
    ],
    "entry": [
      0.52,
      0.89
    ],
    "arrival": [
      0.5,
      0.79
    ],
    "host": [
      0.38,
      0.65
    ],
    "visitors": [
      [
        0.6,
        0.79
      ]
    ],
    "stations": {
      "match": {
        "object": [
          0.74,
          0.54
        ],
        "approach": [
          0.51,
          0.68
        ],
        "label": [
          0.69,
          0.58
        ]
      }
    }
  },
  "tea": {
    "file": "tea",
    "blob": "4a17875a5dd55b2997150620682fb31b7b000342",
    "lane": [
      [
        0.44,
        0.67,
        0.74
      ],
      [
        0.52,
        0.61,
        0.71
      ],
      [
        0.62,
        0.49,
        0.7
      ],
      [
        0.72,
        0.4,
        0.72
      ],
      [
        0.83,
        0.29,
        0.66
      ],
      [
        0.91,
        0.28,
        0.65
      ]
    ],
    "entry": [
      0.47,
      0.89
    ],
    "arrival": [
      0.48,
      0.76
    ],
    "host": [
      0.63,
      0.61
    ],
    "visitors": [
      [
        0.46,
        0.72
      ]
    ],
    "stations": {
      "chat": {
        "object": [
          0.34,
          0.47
        ],
        "approach": [
          0.56,
          0.62
        ],
        "label": [
          0.34,
          0.43
        ]
      },
      "board": {
        "object": [
          0.51,
          0.33
        ],
        "approach": [
          0.68,
          0.62
        ],
        "label": [
          0.51,
          0.3
        ]
      }
    }
  },
  "fish": {
    "file": "pier",
    "blob": "31bb36094587d0818f5905824a543487df980a09",
    "lane": [
      [
        0.35,
        0.55,
        0.66
      ],
      [
        0.43,
        0.38,
        0.57
      ],
      [
        0.51,
        0.18,
        0.44
      ],
      [
        0.62,
        0.16,
        0.4
      ],
      [
        0.72,
        0.2,
        0.47
      ],
      [
        0.81,
        0.27,
        0.58
      ],
      [
        0.91,
        0.29,
        0.7
      ]
    ],
    "entry": [
      0.49,
      0.89
    ],
    "arrival": [
      0.42,
      0.78
    ],
    "host": [
      0.25,
      0.53
    ],
    "visitors": [
      [
        0.36,
        0.69
      ]
    ],
    "stations": {
      "hit": {
        "object": [
          0.19,
          0.36
        ],
        "approach": [
          0.25,
          0.51
        ],
        "label": [
          0.2,
          0.31
        ]
      },
      "pier": {
        "object": [
          0.69,
          0.44
        ],
        "approach": [
          0.48,
          0.44
        ],
        "label": [
          0.67,
          0.39
        ]
      },
      "riverShout": {
        "object": [
          0.72,
          0.28
        ],
        "approach": [
          0.6,
          0.36
        ],
        "label": [
          0.7,
          0.24
        ]
      }
    }
  },
  "arcade": {
    "file": "arcade",
    "blob": "6c902bd9e7e51d1f0702d0e2f77a82ae9c2ee92e",
    "lane": [
      [
        0.48,
        0.42,
        0.55
      ],
      [
        0.53,
        0.36,
        0.59
      ],
      [
        0.58,
        0.29,
        0.57
      ],
      [
        0.65,
        0.23,
        0.49
      ],
      [
        0.72,
        0.23,
        0.51
      ],
      [
        0.8,
        0.21,
        0.61
      ],
      [
        0.88,
        0.24,
        0.76
      ],
      [
        0.95,
        0.2,
        0.85
      ]
    ],
    "entry": [
      0.47,
      0.93
    ],
    "arrival": [
      0.43,
      0.83
    ],
    "host": [
      0.31,
      0.71
    ],
    "visitors": [
      [
        0.34,
        0.78
      ],
      [
        0.58,
        0.87
      ]
    ],
    "stations": {
      "bubbleArcade": {
        "object": [
          0.75,
          0.43
        ],
        "approach": [
          0.54,
          0.54
        ],
        "label": [
          0.73,
          0.37
        ]
      },
      "goldfishScoop": {
        "object": [
          0.82,
          0.65
        ],
        "approach": [
          0.46,
          0.67
        ],
        "label": [
          0.77,
          0.59
        ]
      },
      "blindBox": {
        "object": [
          0.51,
          0.37
        ],
        "approach": [
          0.48,
          0.49
        ],
        "label": [
          0.51,
          0.32
        ]
      }
    }
  },
  "park": {
    "file": "park",
    "blob": "07025c111e38e1a522f4729c4fdb3ff87ca6b552",
    "lane": [
      [
        0.43,
        0.38,
        0.49
      ],
      [
        0.47,
        0.26,
        0.46
      ],
      [
        0.51,
        0.13,
        0.25
      ],
      [
        0.55,
        0.16,
        0.28
      ],
      [
        0.59,
        0.26,
        0.47
      ],
      [
        0.64,
        0.44,
        0.78
      ],
      [
        0.7,
        0.51,
        0.84
      ],
      [
        0.77,
        0.36,
        0.81
      ],
      [
        0.85,
        0.16,
        0.68
      ],
      [
        0.93,
        0.1,
        0.57
      ],
      [
        0.96,
        0.12,
        0.52
      ]
    ],
    "entry": [
      0.31,
      0.94
    ],
    "arrival": [
      0.47,
      0.83
    ],
    "host": [
      0.43,
      0.45
    ],
    "visitors": [
      [
        0.53,
        0.72
      ],
      [
        0.28,
        0.87
      ]
    ],
    "stations": {
      "pet": {
        "object": [
          0.21,
          0.36
        ],
        "approach": [
          0.37,
          0.46
        ],
        "label": [
          0.22,
          0.32
        ]
      },
      "deerVisit": {
        "object": [
          0.82,
          0.47
        ],
        "approach": [
          0.65,
          0.64
        ],
        "label": [
          0.81,
          0.43
        ]
      }
    }
  }
};
const base='assets/visual/staging/2026-11-27/rooms/';
const point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
function bounds(id,y){const q=Object.hasOwn(rooms,id)?rooms[id]:null;if(!q||!Number.isFinite(y)||y<q.lane[0][0]||y>q.lane.at(-1)[0])return null;for(let i=1;i<q.lane.length;i++){const a=q.lane[i-1],b=q.lane[i];if(y<=b[0]){const f=(y-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]}}return null}
function safe(id,p){if(!point(p))return false;const b=bounds(id,p[1]);return !!b&&p[0]>=b[0]-1e-9&&p[0]<=b[1]+1e-9}
function segment(id,a,b){if(!safe(id,a)||!safe(id,b))return false;const q=rooms[id],dy=b[1]-a[1];if(Math.abs(dy)<1e-12)return true;for(const [y] of q.lane){const f=(y-a[1])/dy;if(f>0&&f<1&&!safe(id,[a[0]+f*(b[0]-a[0]),y]))return false}return true}
// Use the reviewed lane as a visibility graph, not a mandatory trip down
// every cross-section centre. Choose a short, clear route with comfortably
// inset turn points; preserve the existing centre-line path as a fallback.
function route(id,a,b){
 if(!safe(id,a)||!safe(id,b))return null;
 if(segment(id,a,b))return [b.slice()];
 const q=rooms[id],dir=Math.sign(b[1]-a[1]);
 const rows=q.lane.filter(([y])=>(y-a[1])*dir>0&&(b[1]-y)*dir>0).sort((a,b)=>(a[0]-b[0])*dir);
 const nodes=[a,...rows.flatMap(([y,l,r])=>[.2,.35,.5,.65,.8].map(f=>[l+(r-l)*f,y])),b];
 // Distances are in the painting's aspect ratio, matching live world units.
 const distance=(p,q)=>Math.hypot((p[0]-q[0])*928/1648,p[1]-q[1]);
 const best=Array(nodes.length).fill(Infinity),prev=Array(nodes.length).fill(-1);
 best[0]=0;
 for(let i=1;i<nodes.length;i++)for(let j=0;j<i;j++){
  if((nodes[i][1]-nodes[j][1])*dir<=0||!Number.isFinite(best[j]))continue;
  const cost=best[j]+distance(nodes[j],nodes[i])+(j===0?0:.004);
  if(cost+1e-10<best[i]&&segment(id,nodes[j],nodes[i])){best[i]=cost;prev[i]=j}
 }
 if(prev.at(-1)>=0){
  const out=[];for(let i=nodes.length-1;i>0;i=prev[i])out.unshift(nodes[i].slice());
  return out
 }
 const out=[...rows.map(([y,l,r])=>[(l+r)/2,y]),b.slice()];
 let last=a;for(const n of out){if(!segment(id,last,n))return null;last=n}return out
}
function camera(w,h,iw=928,ih=1648){if(![w,h,iw,ih].every(Number.isFinite)||Math.min(w,h,iw,ih)<=0)return null;const s=w<h?Math.max(w/iw,h/ih):Math.min(w/iw,h/ih),pw=iw*s,ph=ih*s;return {s,ox:(w-pw)/2,oy:w<h?Math.max(h-ph,Math.min(0,h*.5-ph*.58)):(h-ph)/2,w:pw,h:ph}}
function project(p,c){return point(p)&&c?[c.ox+c.w*p[0],c.oy+c.h*p[1]]:null}
function asset(id){return Object.hasOwn(rooms,id)?base+rooms[id].file+'/portrait.webp':null}
return {rooms,bounds,safe,segment,route,camera,project,asset}
});
