# Project-wide artwork reconciliation (10 batches attempted)

These are staging candidates, not finished game implementation. Artwork production has not fully completed. Keep original approved assets and all saves. The earlier 1–5 archive includes 31 artwork files (including strike frames and carriage). The current 6–10 archive contains 27 artwork files. Do not count variants, static frames or recovered low-resolution candidates as finished animation. Verify current main tree and manifest hashes before integration.

| Batch | Retain / candidate | Remaining artwork or contact work |
| --- | --- | --- |
| 1 Pier | storage tray, slipper, prior strike frames | identity-matched Ah Ma retrieval/return, writing board/paper states, seated handover, bottle folding/sealing/release, verify existing props |
| 2 Temple/gardens | existing altar, bell, incense, fortune slips, pond; six koi candidates | feed container/scoop, matched swim cycle, seated/throwing/feeding hand contact, wish writing/tie |
| 3 Readings | prepared Observatory/Curiosity host poses, Tarot deal, storyteller, cafe host | Yue writing motion, Tarot card handling, seated storytelling, cafe conversation/handover, matching walk/gesture transitions; check existing deck before generating |
| 4 Food | 49 original props + 4 storage props | matched Grandma and boba host action frames, ingredient retrieval, cooking/serving/tasting, recipe-specific food artwork only if missing |
| 5 Shops | claw/rhythm atlases; open blind box with front layer | matching closed carton/wrapping, tea seated/pour/drink, goldfish scoop props review, souvenir retrieval and NPC play |
| 6 Park | 16 candidates (cat poses and food/toy/storage) | coherent coat-specific motion, deer movement, scoop/feed states, player contact, cupboard matching |
| 7 Travellers | 48 registered walks, 24 prior pose candidates, 3 blond crouch frames | other three identities' reach/grip, sit/stand, drink/eat/cook/use poses, additional complete selectable identities (not arbitrary roster expansion) |
| 8 Residents | 13 named standing identities, 2 low-resolution visitor candidates | matched walking/idle/social/work/seat gestures, no static candidate presented as full motion |
| 9 Environment | existing entrance/maps/carriages, 15 modular props; 4 windsock frames | anchored vegetation and other missing scene-specific moving elements; runtime water/steam/light/weather and transition testing |
| 10 Home/UI | existing 11 imported furniture and 8 finishes, new portrait frame and cog | actual home expansion/projection/occlusion, navigation art inventory, remaining unique district signage and collectible art only where verified missing |

## Integration gates
- Preserve approved identities, separate furniture and moving props, align feet/hands/hips and perspective. No baked UI labels, fake readings or replacement identities.
- Review normal-input phone and desktop gameplay from approach through retrieval, interaction, reaction, return and departure. Respect reduced motion and hidden-tab pause.
- Reuse existing sources first, inspect actual alpha, compare hashes, reject unsuitable composites.
- Prioritize physical retrieval/contact and existing asset integration; no batch quota or additional round of duplicate artwork.
- Both owner uploads verified on main: 31 earlier and 27 later WebP blob hashes match the two original ZIP archives. Second upload commit dcf6b77 placed the files inside an extra package folder; PR #3 merge 0ddac9e copied all 40 files (27 artwork and 13 metadata) into canonical dated staging directories. All 27 destination blobs were independently verified after merge. Retain the nested source as upload evidence, not a second candidate inventory. No new artwork or runtime acceptance claimed.


## Next actionable integration order

1. Pier: review four Ah Ma strike candidates against original seated identity and grip. Calibrate empty tray plus independent red slipper, with stored/retrieved/returned state and front edge occlusion. Do not animate or show a duplicate slipper baked into an alternate pose. Missing dedicated retrieval/return and paper handover remain genuine art blockers.
2. Reading houses: inspect newly staged guides and Tarot deal pose against current room coordinates, original resident identity, desk, visitor seat and scale. Keep dialogue and computed results live, no static result board.
3. Park: inspect four cat walk poses for common scale and foot placement; keep coat-specific identities, test cupboard open/closed alignment before activating. Reuse food and toy props; no new animal roster without matched poses.
4. Kitchen, arcade, HUD and windsock: use staged storage objects and independent box foreground where aligned; inspect runtime state transitions. HUD frame must preserve selected face readability and touch area. Windsock ring stays fixed; no scene-wide motion.
5. Commission only verified missing pose sets or props after those checks, prioritizing all original four travellers' reach, grip, sit/stand and tool contact plus named hosts' matching service motions. Do not regenerate existing walks, furniture, finishes, carriage or food-prop inventory.

Coordination: independent staging work only. Inspect current workstream leases before modifying shared runtime files. Visual acceptance requires normal-input mobile and desktop playback.
