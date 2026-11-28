'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const s=read('src/home-placement-runtime.js'),ext=read('src/extensions.js');
const start=ext.indexOf('/* MBHOME_PLACEMENT_BEGIN'),end=ext.indexOf('/* MBHOME_PLACEMENT_END */');
assert.ok(start>=0&&end>start);
const make=new Function('editing','id','zone',ext.slice(start,end)+`
 let hideoutEditing=editing,hideoutSelected=0,komorebiZone=0,hideoutFurniture=[{id,x:20,y:80,zone}];
 function furnitureZone(d){return d.zone}
 function furnitureWidth(){return 20}
 function mbHomeKind(id){return id==='frame'?'wall':'storage'}
 function mbHomeObjects(z,excluded){if(z!==0||excluded!==0)throw Error('wrong room');return [{id:'desk',x:50,y:80,width:20,kind:'storage'}]}
 let pawFurniturePlacement=(id,x,y)=>({x,y});
 let pawFurnitureSuggested=(id)=>pawFurniturePlacement(id,50,80);
 `+s+`
 return {place:(x,y)=>pawFurniturePlacement(id,x,y),suggest:()=>pawFurnitureSuggested(id),set:(x,y)=>Object.assign(hideoutFurniture[0],{x,y})};
`);
const q=make(true,'bed',0);
assert.deepEqual(q.place(50,80),{x:20,y:80});
assert.deepEqual(q.place(30,80),{x:30,y:80});
assert.deepEqual(q.place(50,91),{x:50,y:91});
q.set(37,80);
assert.deepEqual(q.place(50,80),{x:37,y:80});
assert.deepEqual(q.place(35,80),{x:35,y:80});
assert.deepEqual(q.suggest(),{x:50,y:80});
for(const [editing,id,zone] of [[false,'bed',0],[true,'rug',0],[true,'frame',0],[true,'bed',1]])
 assert.deepEqual(make(editing,id,zone).place(50,80),{x:50,y:80});
assert(ext.includes('const pos=pawFurniturePlacement(d.id,x,y);d.x=pos.x;d.y=pos.y'));
for(const p of ['index.html','scripts/build.cjs'])assert(read(p).includes('home-placement-runtime'));
console.log('PASS live home furniture collision and old save recovery');
