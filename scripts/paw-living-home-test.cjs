const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../src/startup.js'),'utf8');
function part(a,b){const i=s.indexOf(a),j=s.indexOf(b,i+a.length);if(i<0||j<i)throw Error('Missing '+a);return s.slice(i,j)}
const cases=new Function(part('/* PAW_HOME_WALK_BEGIN */','/* PAW_HOME_WALK_END */')+part('/* PAW_DIALOGUE_VARIETY_BEGIN */','/* PAW_DIALOGUE_VARIETY_END */')+`
let n=0;const check=(ok,name)=>{if(!ok)throw Error(name);n++};
const a={x:15,y:90},b={x:85,y:90},block={l:42,r:58,u:80,d:94};
check(pawHomeSafe(a,[]),'open floor');
check(!pawHomeSafe({x:15,y:60},[]),'not wall');
check(!pawHomeSafe({x:5,y:80},[]),'left boundary');
check(!pawHomeSafe({x:95,y:80},[]),'right boundary');
check(!pawHomeSafe({x:15,y:97},[]),'bottom boundary');
check(!pawHomeSafe({x:NaN,y:80},[]),'finite coordinates');
check(!pawHomeSafe({x:50,y:90},[block]),'occupied footprint');
check(pawHomeSegment(a,b,[]),'open segment');
check(!pawHomeSegment(a,b,[block]),'crossing blocked');
let r=pawHomeRoute(a,b,[block]);check(r&&r.length>1,'route around furniture');
let prev=a;for(const p of r){check(pawHomeSegment(prev,p,[block]),'clear route segment');prev=p}
check(r.at(-1).x===b.x,'correct endpoint');
check(pawHomeRoute(a,b,[]).length===1,'direct open walk');
check(pawHomeRoute(a,b,[{l:40,r:60,u:60,d:100}])===null,'unreachable room');
check(pawHomeRoute({x:50,y:90},b,[block])===null,'occupied start');
check(pawHomeRoute(a,{x:NaN,y:90},[])===null,'invalid goal');
r=pawHomeRoute(a,{x:50,y:90},[block]);check(r&&pawHomeSafe(r.at(-1),[block]),'nearest safe target');
check(pawHomeFootprint(50,80,20,'wall','frame')===null,'wall art nonblocking');
check(pawHomeFootprint(50,80,20,'rest','rug')===null,'rug walkable');
check(pawHomeFootprint(50,80,20,'rest','bed')!==null,'bed blocks');
check(pawHomeFootprint(50,80,NaN,'rest','bed')===null,'invalid geometry');
check(pawHomeDirection(a,b)==='right','right facing');
check(pawHomeDirection(b,a)==='left','left facing');
check(pawHomeDirection(a,{x:15,y:80})==='up','up facing');
check(pawHomeDirection(a,{x:15,y:94})==='down','down facing');
const approach=pawHomeObjectApproach(a,{x:50,y:82},[{l:40,r:60,u:76,d:88}]);check(!!approach,'object approach found');check(pawHomeSafe(approach,[{l:40,r:60,u:76,d:88}]),'approach clear');check(!!pawHomeRoute(a,approach,[{l:40,r:60,u:76,d:88}]),'approach reachable');check(pawHomeObjectApproach(a,{x:50,y:82},[{l:0,r:100,u:60,d:100}])===null,'unreachable furniture');check(pawHomeObjectApproach(a,{x:NaN,y:82},[])===null,'invalid furniture position');
const now=100000000;
check(pawTopicSeen('exchange','flowers',[['hong','bouquet',now-1]],now),'semantic topic across dialogue modes');
check(!pawTopicSeen('exchange','flowers',[['hong','bouquet',now-86400001]],now),'topic expires');
check(!pawTopicSeen('exchange','flowers',[['hong','cake',now-1]],now),'unrelated topic allowed');
check(pawTopicCandidates('hong',[['bouquet','a','b'],['cake','c','d']],[['exchange','flowers',now-1]],now).length===1,'candidate suppression');
return n;`);
console.log('PASS: '+cases()+' home walking and dialogue variety checks');
