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
          0.46
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
      "bottle": {
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
  }
};
const base='assets/visual/staging/2026-11-27/rooms/';
const point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
function bounds(id,y){const q=Object.hasOwn(rooms,id)?rooms[id]:null;if(!q||!Number.isFinite(y)||y<q.lane[0][0]||y>q.lane.at(-1)[0])return null;for(let i=1;i<q.lane.length;i++){const a=q.lane[i-1],b=q.lane[i];if(y<=b[0]){const f=(y-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]}}return null}
function safe(id,p){if(!point(p))return false;const b=bounds(id,p[1]);return !!b&&p[0]>=b[0]-1e-9&&p[0]<=b[1]+1e-9}
function segment(id,a,b){if(!safe(id,a)||!safe(id,b))return false;const q=rooms[id],dy=b[1]-a[1];if(Math.abs(dy)<1e-12)return true;for(const [y] of q.lane){const f=(y-a[1])/dy;if(f>0&&f<1&&!safe(id,[a[0]+f*(b[0]-a[0]),y]))return false}return true}
function route(id,a,b){if(!safe(id,a)||!safe(id,b))return null;if(segment(id,a,b))return [b.slice()];const q=rooms[id],dir=Math.sign(b[1]-a[1]),nodes=q.lane.filter(([y])=>(y-a[1])*dir>0&&(b[1]-y)*dir>0).sort((a,b)=>(a[0]-b[0])*dir).map(([y,l,r])=>[(l+r)/2,y]);const out=[...nodes,b.slice()];let last=a;for(const n of out){if(!segment(id,last,n))return null;last=n}return out}
function camera(w,h,iw=928,ih=1648){if(![w,h,iw,ih].every(Number.isFinite)||Math.min(w,h,iw,ih)<=0)return null;const s=w<h?Math.max(w/iw,h/ih):Math.min(w/iw,h/ih),pw=iw*s,ph=ih*s;return {s,ox:(w-pw)/2,oy:w<h?Math.max(h-ph,Math.min(0,h*.5-ph*.58)):(h-ph)/2,w:pw,h:ph}}
function project(p,c){return point(p)&&c?[c.ox+c.w*p[0],c.oy+c.h*p[1]]:null}
function asset(id){return Object.hasOwn(rooms,id)?base+rooms[id].file+'/portrait.webp':null}
return {rooms,bounds,safe,segment,route,camera,project,asset}
});
