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
