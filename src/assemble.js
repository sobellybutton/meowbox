/* Shared browser and offline build assembler. Legacy chunks are only needed for the embedded export. */
const MEOW_ART_COUNT=62;
function assembleMeowBox(shell,scripts,legacyParts){
 const assets=legacyParts?legacyParts.join('').match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g)||[]:Array.from({length:MEOW_ART_COUNT},(_,i)=>'assets/art/'+String(i).padStart(3,'0')+'.webp');
 if(assets.length!==MEOW_ART_COUNT)throw Error('Unexpected artwork count '+assets.length);
 const used=new Set();
 const js=scripts.join('').replace(/__MEOW_ART_(\d{3})__/g,(_,id)=>{
  const i=Number(id);if(!assets[i])throw Error('Missing artwork '+id);used.add(i);return assets[i]
 });
 if(used.size!==assets.length)throw Error('Artwork references changed unexpectedly');
 if(!shell.includes('<!--MEOW_GAME_SCRIPT-->'))throw Error('Missing game script placeholder');
 return shell.replace('<!--MEOW_GAME_SCRIPT-->',()=>'<script>'+js+'</script>');
}
if(typeof module!=='undefined'&&module.exports)module.exports={assembleMeowBox,MEOW_ART_COUNT};
