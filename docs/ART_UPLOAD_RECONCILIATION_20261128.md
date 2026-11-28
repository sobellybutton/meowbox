# Artwork upload reconciliation — 28 November 2026

Inventory snapshot: tree f45d950e3af099eea6fbb6cc78e1e04589b5095f, complete recursive tree. 791 PNG/WebP/JPG/SVG image paths under assets/visual, 620 distinct Git blob hashes, 167 repeated-content groups, 171 redundant copies. Do not delete existing paths before dependency analysis; some duplicates are intentional share templates or staging copies. The latest eight folders contain 83 individual candidate images plus one incense source atlas; none of these 84 files shares a Git blob hash with another image in the snapshot. All eight manifests read. Local upload ZIP CRC passed and all 84 images were composited on neutral background and inspected as contact sheets. No claim of live visual acceptance.

## Selection and reuse (relative to assets/visual/staging/2026-11-28-)
- composite-recovery: 16 foliage/light variants, 3 painted water patches (not pure ripple overlays), 7 matching wooden interface buttons plus avatar frame and alternate cog, feeding station, 8 player-0 waist-up activity poses, 8 expressions, 1 alternate player-3 writing pose. Prefer settings.webp over settings-leaf-alternate.webp for a coherent HUD. Keep alternate cog archived. Use player-0 closeups only at suitable framing; do not display a different identity for other players. Alternate player-3 writing lacks original accessories; hold. Use water patches only where their painted water matches scene; otherwise procedural ripple. No new HUD art needed before integration.
- final-batch1-traveller: 2 crouch poses for specific identities; 3 moon-block poses and 4 pick/carry frames have low native resolution, map-scale trials only. Crate baked into carrying poses; not a generic inventory action. Use existing reach and seated assets for other identities without substitution.
- park-cat-recovery and park-cat-rest: eight pet response frames and one sleep pose; test actual ginger tabby identity, body scale and contact; keep existing other cats and deer. No need to generate these poses again.
- project-batch08-npcs: eight office worker walk frames. Local alpha compositing confirms apparent white RGB rectangle in raw preview is transparent (sample alpha 0); do not reject solely on raw preview. Check edge halos, stride and briefcase continuity in motion before promotion. No tourist motion included.
- project-batch09-effects: eight smoke frames, source atlas archive only; attach at burner emitter and stagger fade, not entire-room overlay. Reuse existing chimes and waterfall atlas; no duplicate requests.
- project-batch10-interface: journal cover candidate, separate from tarot journal. Earlier missing settings/avatar notes superseded by composite-recovery.
- traveller-writing: two full-body static writing poses for player-0 and player-1. Check furniture anchors; not a writing cycle. Other two identities still lack approved writing poses.

## Existing material to retain
Original four travellers, 24 gesture poses, reach/tap candidates, eight resident portraits, additional visitor candidates, six preferred reference-matched seated host poses (hold seven Yue alternatives), uploaded kitchen and boba props, home finishes and furniture, existing tarot faces, koi and deer, pier slipper/storage, blind box and rail assets. Do not regenerate based on old blocker notes; inspect actual runtime usage and current scene first.

## Next implementation order
1. HUD settings/avatar and matching controls, preserving accessible text, touch targets and actual selected avatar. 
2. Temple smoke, existing chimes and pond effects; compare live occlusion and anchors.
3. Pet reaction/rest and feeding station, preserving identity.
4. Seated writing and physical crouch/reach, then map-scale pick/carry and moon block poses if contact and resolution acceptable.
5. NPC walk and light/foliage variants, review motion and memory.
6. Remaining creative gaps only after runtime checks: matching player poses for all four identities, resident role-specific motion, physical host/item handoffs, pet eating/grooming/walk, genuinely missing independent foreground masks. Do not create decorative alternatives simply to fill a count.

No assets deleted, moved or activated by this audit. No new image generation requested. Use this register together with current development checkpoint; do not treat inventory counts as approved artwork counts.
