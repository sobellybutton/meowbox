# Painted player actions and room compositions

This contract enables actual original paintings to be imported without rebuilding movement and physical input. It does not claim any new paintings exist. The initial action-runtime.json is empty; existing artwork remains the fallback.

## Player asset batches

Four separate player identities (0–3), each matching the existing registration illustration and clothing. Do not recolor or redesign the identity. For each direction up, down, right, provide 4–8 equal-canvas walking frames in order. Left mirrors right; avoid asymmetric props that look wrong mirrored. Files: assets/visual/painted/player-ID/walk/DIRECTION-N.webp. Match body proportions and the foot contact location; no floating feet, detached limbs or text. Frame height controls display scale; keep canvas size consistent across frames.

For paper hitting, provide five complete right-facing poses in assets/visual/painted/player-ID/strike/PHASE.webp (ready, anticipation, swing, impact, recovery). Runtime mirrors them toward the paper. Paint the hand gripping an imaginary tool; do not bake the slipper into the hand. The grip anchor is the actual sleeve/hand contact location. The existing independent slipper renderer uses its established offset; inspect and calibrate the contact in gameplay before approving the pose. All five frames must be present before any replace the fallback. Do not introduce a body box or artificial arm to cover a missing frame.

Manifest structure: version 1; players keyed 0–3, optional walk keyed by direction arrays, optional strike keyed by the five phase names. Every asset is a transparent WebP with path, width, height, SHA-256 checksum and foot [x,y] in source pixels. Strike entries additionally require grip [x,y]. All image dimensions and checksums are verified by build. Load only required identity/direction on use; never substitute another identity on incomplete download.

## Room compositions

rooms keyed by canonical room ID, with portrait and landscape records containing path, width, height, sha256. File paths assets/visual/painted/rooms/ID/portrait.webp and landscape.webp. Native portrait aspect at least 1:1.35; native landscape at least 1.35:1. Prefer 800×1400 portrait and 1600×900 wide. Keep scenery, characters, signage, station props and occluders separate. Maintain walkable floor and existing station locations; review native camera fit and no cropping of important furniture. Unsupported fits retain current background. Initial priorities: Worry-Free Pier, Tea Room, Daydream Park, arcade, Grandma's Kitchen. The final drawings and visual tests are still open.
