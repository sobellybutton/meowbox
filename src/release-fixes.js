/* MeowBox release fixes; load after extensions, before startup. */
const ziBeforeRelease=ziChart;
ziChart=function(date,hr){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(hr)||hr<0||hr>23)throw Error('Invalid birth date or hour');
 const ms=Date.parse(date+'T12:00:00Z');if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==date||date<'1900-01-02'||date>'2036-12-31')throw Error('Unsupported birth date');
 const z=ziBeforeRelease(date,hr);if(z.stars.flat().length!==14||new Set(z.stars.flat().map(v=>v[1])).size!==14||!Number.isInteger(z.bureau)||z.bureau<2||z.bureau>6)throw Error('Chart integrity');
 return z
};
const friendPalaceRelease=chartConsultTopics.find(v=>v.k===9);if(friendPalaceRelease)friendPalaceRelease.k=7;
const chartFollowRelease=chartFollowTopic;chartFollowTopic=function(v){const k=chartFollowRelease(v);return k===9?7:k};
let releaseSignViewport='';const releaseSignBefore=syncSigns;
syncSigns=function(){const key=W+'x'+H;if(key!==releaseSignViewport){releaseSignViewport=key;for(const btn of signButtons.values()){btn._signSize=null;btn._signOffset=null;btn._clearAt=0}lastDoorLayoutAt=-Infinity}return releaseSignBefore()};
