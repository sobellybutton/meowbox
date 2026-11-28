const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
function section(a,b){const i=s.indexOf(a),j=s.indexOf(b,i);assert(i>=0&&j>i);return s.slice(i+a.length,j)}
const code=section('/* PAW_WORLD_ADMISSION_BEGIN */','/* PAW_WORLD_ADMISSION_END */')+section('/* PAW_ITEM1_TRANSIT_BEGIN */','/* PAW_ITEM1_TRANSIT_END */');
const run=new Function('assert','setTimeout','clearTimeout',code+`
return (async()=>{
 const mock=(complete=true,ok=true)=>({complete,naturalWidth:ok?880:0,naturalHeight:ok?1320:0,src:'gate.webp',events:new Map(),addEventListener(k,fn){this.events.set(k,fn)},removeEventListener(k){this.events.delete(k)},removeAttribute(){},decode(){this.decoded=(this.decoded||0)+1;return Promise.resolve()}});
 let a=mock(),r=pawReadyPicture(a);assert.equal(r,pawReadyPicture(a));assert(await r);assert.equal(a.decoded,1);assert.equal(a.events.size,0);
 a=mock();a.decode=()=>Promise.reject(Error('decode'));assert(!(await pawReadyPicture(a)));
 a=mock(false,false);r=pawReadyPicture(a);a.naturalWidth=880;a.naturalHeight=1320;a.events.get('load')();assert(await r);
 a=mock(false,false);r=pawReadyPicture(a);a.events.get('error')();assert(!(await r));
 a=mock(false,false);assert(!(await pawReadyPicture(a,1)));assert.equal(a.events.size,0);assert(!(await pawReadyPicture(null)));
 const clock={elapsed:0,last:null};assert.equal(pawTransitClock(clock,0,true,1000),0);assert.equal(pawTransitClock(clock,100,true,1000),.1);assert.equal(pawTransitClock(clock,9999,false,1000),.1);assert.equal(pawTransitClock(clock,10099,true,1000),.2);
 for(const stage of [3,5])for(const connected of [false,true])for(const hidden of [false,true])for(const proposalHidden of [false,true])assert.equal(pawTransitOwned({stage,connected,hidden,proposalHidden},3),stage===3&&connected&&!hidden&&!proposalHidden);
 return 'PASS: decode, retry cleanup, transit ownership and visible-time clocks';
})()`);
run(assert,setTimeout,clearTimeout).then(console.log,err=>{console.error(err);process.exitCode=1});

{
 const src=require('node:fs').readFileSync(require('node:path').join(__dirname,'../src/startup.js'),'utf8');
 const a=src.indexOf('/* PAW_RECOVERED_RETRY_BEGIN */'),z=src.indexOf('/* PAW_RECOVERED_RETRY_END */');
 if(a<0||z<=a)throw Error('Missing image retry guard');
 const mayRequest=new Function(src.slice(a,z)+';return pawRecoveredMayRequest')();
 for(const [until,now,retry,want] of [[0,1000,false,true],[10000,0,false,false],[10000,749,true,false],[10000,750,true,true],[10000,1000,false,false],[10000,10000,false,true],[10000,9500,true,true]]){
  if(mayRequest(until,now,retry)!==want)throw Error('Unexpected image retry permission');
 }
 console.log('Explicit image retry and background cooldown checks passed');
}


// Download completion is not proof that the current image is decoded.
const templeCode=section('/* PAW_TEMPLE_ADMISSION_BEGIN */','/* PAW_TEMPLE_ADMISSION_END */');
const decodeCode=section('/* PAW_WORLD_ADMISSION_BEGIN */','/* PAW_WORLD_ADMISSION_END */');
const verifyDecoded=new Function('assert','setTimeout','clearTimeout',decodeCode+templeCode+`
return (async()=>{
 const im=src=>({src,complete:true,naturalWidth:800,naturalHeight:1200,events:new Map(),addEventListener(k,fn){let a=this.events.get(k)||new Set();a.add(fn);this.events.set(k,a)},removeEventListener(k,fn){this.events.get(k)?.delete(fn)},decode(){this.calls=(this.calls||0)+1;return Promise.resolve()}});
 const approach=im('approach.webp'),hall=im('hall.webp');
 assert.equal(pawTempleAssetsReady(approach,hall),false);
 assert.equal(pawPictureDecoded(approach),false);
 assert(await pawReadyPicture(approach));
 assert.equal(pawTempleAssetsReady(approach,hall),false);
 assert(await pawReadyPicture(hall));
 assert(pawTempleAssetsReady(approach,hall));
 assert(await pawReadyPicture(approach));assert.equal(approach.calls,1);
 hall.src='different.webp';
 assert.equal(pawTempleAssetsReady(approach,hall),false);
 assert(await pawReadyPicture(hall));
 assert(pawTempleAssetsReady(approach,hall));
 const delayed=im('old.webp');let release;
 delayed.decode=()=>new Promise(resolve=>{release=resolve});
 const old=pawReadyPicture(delayed);await Promise.resolve();
 delayed.src='new.webp';release();assert.equal(await old,false);
 assert.equal(pawPictureDecoded(delayed),false);
 delayed.decode=()=>Promise.resolve();assert(await pawReadyPicture(delayed));assert(pawPictureDecoded(delayed));
 const waiting=im('prior.webp');waiting.complete=false;waiting.naturalWidth=waiting.naturalHeight=0;
 const stale=pawReadyPicture(waiting);
 waiting.src='next.webp';waiting.naturalWidth=800;waiting.naturalHeight=1200;waiting.complete=true;
 for(const fn of [...waiting.events.get('load')])fn();
 assert.equal(await stale,false);assert.equal(waiting.calls,undefined);
 assert(await pawReadyPicture(waiting));assert.equal(waiting.calls,1);
 const broken=im('broken.webp');broken.decode=()=>Promise.reject(Error('decode failure'));
 assert.equal(await pawReadyPicture(broken),false);assert.equal(pawTempleAssetsReady(approach,broken),false);
 return 'PASS: exact-source decode, temple pair admission and stale source rejection';
})()`);
verifyDecoded(assert,setTimeout,clearTimeout).then(console.log,e=>{console.error(e);process.exitCode=1});
