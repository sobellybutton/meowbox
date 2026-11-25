/* Shared browser and offline build assembler. */
function assembleMeowBox(shell, scripts, legacyParts) {
  const assets = legacyParts.join('').match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g) || [];
  if (assets.length !== 62) throw new Error('Expected 62 legacy images, got '+assets.length);
  const used = new Set();
  const js = scripts.join('').replace(/__MEOW_ART_(\d{3})__/g, (_, id) => {
    const index = Number(id);
    if (!assets[index]) throw new Error('Missing artwork '+id);
    used.add(index); return assets[index];
  });
  if (used.size !== assets.length) throw new Error('Artwork references changed unexpectedly');
  if (!shell.includes('<!--MEOW_GAME_SCRIPT-->')) throw new Error('Missing game script placeholder');
  return shell.replace('<!--MEOW_GAME_SCRIPT-->', () => '<script>'+js+'</script>');
}
if (typeof module !== 'undefined' && module.exports) module.exports = {assembleMeowBox};
