# Visual production asset manifest and audio direction
25 November 2026. First integrated art batch; original vector illustrations, not final painterly production approval.

## Committed assets
| ID | Asset | Native size | Layer / anchor | Status |
|---|---|---|---|---|
| fish | assets/visual/pier-courtyard.svg | 800 × 1400 | Portrait background, no baked player, labels or ritual props; authored world-space river foreground still controls shore/foot contact. | Integrated, screenshot pending |
| park | assets/visual/daydream-park.svg | 800 × 1400 | Portrait background, no baked cats or care props; independent cat, bowls, mat and toy. | Integrated, screenshot pending |
| ahMaIdle | assets/visual/ah-ma-seated.svg | 180 × 220 | Transparent seated pose, foot pivot (90,205), seat pivot (90,151). | Integrated, screenshot pending |
| ahMaScold | assets/visual/ah-ma-scold.svg | 180 × 220 | Same foot and seat pivot; expressive face and raised slipper in hand. | Integrated, screenshot pending |

Original authored SVG assets created for this project. No downloaded celebrity artwork. No exact likeness. Lazy loading, existing embedded art fallback; no new asset required for initial boot. Current stroke/pose drafts are not a replacement for final painted character sheets. Actual SVG rasterization and browser visual acceptance must be inspected, including mobile performance of grain/leaf detail and whether the pier backdrop aligns with the drawn waterfront foreground. No claim of desktop final visual approval; legacy artwork remains for desktop framing.

## Remaining production sets (ordered by dependency)
| Set | Required layers and poses |
|---|---|
| Four player identities | Original identity turnaround, front/back/side idle and walk cycles, seated/kneel/bow/reach/hold/throw/stir/drink/action poses with foot, wrist and seat anchors. Preserve identity and saves. |
| Worry-Free Pier | Finish animated host demonstration, slipper transfer and impact frames, paper deformation, folding note, cork, throw, landing/drift, shout pose, foreground railing/occlusion. |
| Daydream Park | Five distinct cat markings and turnaround, walk, idle, eat, drink, groom, crouch, pounce, sleep, irritated and friendly reactions; body and hand contact. |
| Fortune Temple | Portrait courtyard and door, altar, water basin, bell/striker, bamboo sticks, paper, moon blocks, incense, individual dynamic props; actual prayer poses. |
| Tarot House | Portrait reading room, seated reader, table camera, original coherent cards and backs, hand shuffle/deal/flip and reveal. |
| Destiny House | Portrait study, Master Yue's original seated/reading/pointing expressions, chart scroll and readable chart presentation. |
| Wishing Garden | Koi pond background, independent water/koi/ripple/coin/lantern sprites and collision geometry. |
| Tea and gossip | Distinct resident silhouettes, cup/pour actions, paper board, newspaper. |
| Office | Illustrated retro workplace, boss and tired workers, story-dependent poses. |
| Kitchen | Grandma and player, ingredient layers, utensils, chopping/pouring/stirring/steam/taste, transparent tea cup/pearls. |
| Arcade | Cabinets, claw rails/gripper/prizes, rhythm lane/dance animations, blind box wrapping/unboxing. |
| Discovery Station | Personality Lab, Soul Cat and motive archetype artwork, branching story environments, café only if distinctive. |
| Outdoor maps | Retain four portrait maps; align walk polygons, doors, foreground masks, depth sorting and independent lighting. |
| Everyday residents | Belly Uncle, Ah Zhai, Gossip Queen, Overtime Wang, and remaining cameo identities; original distinctive silhouettes and expressions, physical poses. |
| Hideout and UI | Furniture in one perspective, collectible display anchors, original decorations, portrait/profile, bag, passport, map/ticket, fairground wheel and stamp art. |

For each remaining set record asset paths, source/license, dimensions, coordinates, foot/hand anchors, intended draw order and camera, and screenshots. No artwork considered accepted without in-game review. Preserve no baked text/avatars in backgrounds. Do not add unrelated activities during this visual production phase.

## Audio policy
- Retire duplicate ambient9 timer and general button chime (cae490d).
- Contextual environmental noise only. Silent Master Yue, tarot, assessments, story/café/office, prayer and generic overlay. Outdoor wind/rain, restrained garden and waterfront ambience. No perpetual background music; rhythm game owns its actual gameplay notes.
- Dedicated short original synthesized action sound bus: paper/slipper impact, care, tea shaking and claw. Existing bell effects remain. Respect mute, visibility and autoplay limits. Quiet consultation suppresses generic feedback tones. Sound synthesis is a working draft, not recorded foley.
- b3fae19: combined JS syntax parsed, 13 isolated context policy assertions passed. No listening test on physical devices yet.
- ba7bc92: integrated four assets. Four asset dimensions/presence checks plus seat-to-stool anchor calculation passed. Combined JavaScript parsed. Browser/actual image acceptance, touch, frame rate, mobile Safari audio and live Pages deployment remain unverified.


## Batch 2: cats, signature interiors and character scale
- 479c26c / 99307f9: original five-coat cat atlas `assets/visual/park-cats-sheet.svg`, 1760 × 700, eight frames by five rows, cell 220 × 140, foot pivot (110,120). Idle/open eyes, blink, two walk poses, two head-down eating/drinking poses, curl/sleep and pounce. Render according to care state and movement, preserve old procedural fallback. After activity, walk back instead of teleporting; inputs remain locked until return. 423 frame-index/selection assertions passed. Not a final painted animation set; inspect bowl/mouth alignment and frame seams.
- 002ff3b / 8e9ffb5 / b330452 / 1a194d4: new native 800 × 1400 original SVG studies for Destiny House, Kitchen and Tarot House. Integrated lazy load and fallback; asynchronous Destiny page image refresh guarded against a closed page. Three dimension/presence checks passed. Portrait environment composition and prop alignment remain subject to actual screenshot review. Desktop retains legacy framing except updated Destiny consultation illustration.
- 4abf777 / 6992262: owner requested bigger walkaround actors. Increase base outdoor sprite scales ~18% subject to viewport cap; mobile target minimum player 62 CSS px, NPC 51 CSS px, indoor target 72–110 CSS px dependent on camera and scale bounds. Preserve foot coordinates, do not enlarge close-up ritual/action poses, adjust NPC interaction boxes and portrait labels, update Fortune camera clearance for larger player. 80 isolated scale cases passed; combined JS parsed. Real render, collisions, readable labels, stairs, small phone and desktop review remain pending. Targets are calibration values, not measured on-device results.
- Current artwork is authored vector draft, not a final hand-painted quality approval. Continue remaining room and character asset sets listed above; no claim of full release, CI or live deployment.
