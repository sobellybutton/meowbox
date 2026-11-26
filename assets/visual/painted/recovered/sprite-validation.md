# Pawradise visual staging report

## Actual files
128 extracted candidate frames (four original avatar designs, eight directions, four poses per direction). True transparent WebP, 152 x 244 pixels, nominal foot anchor (76, 231). The source sheet is low resolution relative to final sprites; enlargement does not add detail. This is an art review pack, not a replacement for the current runtime manifest. Gait timing, planted foot identity and character silhouette consistency have not been approved in motion.

4 separate candidate railway far panoramas. Foreground art in the source sheets is opaque; transparent foreground layers and actual parallax composition remain outstanding.

3 concept-only references for district style, entrance and individual room experiences. They contain baked-in people or composite scenes, and are not valid interactive background plates. Existing game maps, routes, room geometry and saved progress have not been changed.

## Automated validation
PASS: 128 image files decoded, alpha channel present, transparent pixels present, common dimensions, nonempty content, manifest hashes.
REVIEW: 56 source cell boundaries have possible clipping; all frames require visual motion review.

- player-1/down-0: foreground reaches original crop boundary; check possible clipping
- player-1/down-2: foreground reaches original crop boundary; check possible clipping
- player-1/down-3: foreground reaches original crop boundary; check possible clipping
- player-1/down-right-0: foreground reaches original crop boundary; check possible clipping
- player-1/down-right-1: foreground reaches original crop boundary; check possible clipping
- player-1/down-right-3: foreground reaches original crop boundary; check possible clipping
- player-1/right-0: foreground reaches original crop boundary; check possible clipping
- player-1/right-3: foreground reaches original crop boundary; check possible clipping
- player-1/up-right-0: foreground reaches original crop boundary; check possible clipping
- player-1/up-right-1: foreground reaches original crop boundary; check possible clipping
- player-1/up-right-2: foreground reaches original crop boundary; check possible clipping
- player-1/up-right-3: foreground reaches original crop boundary; check possible clipping
- player-1/up-0: foreground reaches original crop boundary; check possible clipping
- player-1/up-1: foreground reaches original crop boundary; check possible clipping
- player-1/up-2: foreground reaches original crop boundary; check possible clipping
- player-1/up-3: foreground reaches original crop boundary; check possible clipping
- player-1/up-left-0: foreground reaches original crop boundary; check possible clipping
- player-1/up-left-2: foreground reaches original crop boundary; check possible clipping
- player-1/up-left-3: foreground reaches original crop boundary; check possible clipping
- player-1/left-0: foreground reaches original crop boundary; check possible clipping
- player-1/left-3: foreground reaches original crop boundary; check possible clipping
- player-1/down-left-0: foreground reaches original crop boundary; check possible clipping
- player-1/down-left-2: foreground reaches original crop boundary; check possible clipping
- player-1/down-left-3: foreground reaches original crop boundary; check possible clipping
- player-2/down-2: foreground reaches original crop boundary; check possible clipping
- player-2/down-3: foreground reaches original crop boundary; check possible clipping
- player-2/down-right-2: foreground reaches original crop boundary; check possible clipping
- player-2/down-right-3: foreground reaches original crop boundary; check possible clipping
- player-2/right-2: foreground reaches original crop boundary; check possible clipping
- player-2/right-3: foreground reaches original crop boundary; check possible clipping
- player-2/up-right-2: foreground reaches original crop boundary; check possible clipping
- player-2/up-right-3: foreground reaches original crop boundary; check possible clipping
- player-2/up-2: foreground reaches original crop boundary; check possible clipping
- player-2/up-3: foreground reaches original crop boundary; check possible clipping
- player-2/up-left-2: foreground reaches original crop boundary; check possible clipping
- player-2/up-left-3: foreground reaches original crop boundary; check possible clipping
- player-2/left-2: foreground reaches original crop boundary; check possible clipping
- player-2/left-3: foreground reaches original crop boundary; check possible clipping
- player-2/down-left-2: foreground reaches original crop boundary; check possible clipping
- player-2/down-left-3: foreground reaches original crop boundary; check possible clipping
- player-3/down-2: foreground reaches original crop boundary; check possible clipping
- player-3/down-3: foreground reaches original crop boundary; check possible clipping
- player-3/down-right-2: foreground reaches original crop boundary; check possible clipping
- player-3/down-right-3: foreground reaches original crop boundary; check possible clipping
- player-3/right-2: foreground reaches original crop boundary; check possible clipping
- player-3/right-3: foreground reaches original crop boundary; check possible clipping
- player-3/up-right-2: foreground reaches original crop boundary; check possible clipping
- player-3/up-right-3: foreground reaches original crop boundary; check possible clipping
- player-3/up-2: foreground reaches original crop boundary; check possible clipping
- player-3/up-3: foreground reaches original crop boundary; check possible clipping
- player-3/up-left-2: foreground reaches original crop boundary; check possible clipping
- player-3/up-left-3: foreground reaches original crop boundary; check possible clipping
- player-3/left-2: foreground reaches original crop boundary; check possible clipping
- player-3/left-3: foreground reaches original crop boundary; check possible clipping
- player-3/down-left-2: foreground reaches original crop boundary; check possible clipping
- player-3/down-left-3: foreground reaches original crop boundary; check possible clipping

## Not completed
Wave, sit, stand and interaction poses; geometry-aligned individual district art, separate boarding/gate plates and transparent near railway layers, individual room background plates. No GitHub upload, deployment or browser test performed. Do not import concept-only artwork as live game assets.
