'use strict';
const assert=require('node:assert/strict');
const api=require('../assets/visual/painted/interior-layouts.js');
const q=api.rooms.destiny;let n=0;
for(let i=0;i<=10;i++){
 const y=.50+i*.035,b=api.bounds('destiny',y);
 for(let j=0;j<=10;j++){
  const x=b[0]+(b[1]-b[0])*j/10,from=[x,y],to=q.stations.destiny.approach,path=api.route('destiny',from,to);
  assert(path&&path.every((v,k)=>api.segment('destiny',k?path[k-1]:from,v)),'unsafe chair-side approach');n++;
 }
}
for(const p of [[.24,.42],[.69,.42],[.24,.46],[.69,.46],[.5,.39]]){assert(!api.safe('destiny',p),'furniture is not walkable');n++}
assert(api.route('destiny',q.stations.destiny.approach,q.entry),'no return route');n++;
console.log('PASS '+n+' chair-side walking and exclusion checks');
