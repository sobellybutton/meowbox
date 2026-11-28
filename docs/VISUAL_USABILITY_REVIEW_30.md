# MeowBox visual and usability review: 30 lenses
25 November 2026. Source and development evidence review, not 30 actual testers. Live initial page returned HTTP 200 and accessible text was extracted; no verified interaction walkthrough or inspected screenshot in this review. Graphify index was stale at 0aa74d0, so relevant current GitHub source was checked. Latest assets are vector drafts; visual approval remains pending.

## 30 lenses and next repair
| Lens | Next change |
|---|---|
| 1 First impression | Clear short-break premise, railway ticket and brief shrine arrival. |
| 2 Loading | Measure cold/warm start, shrink initial payload, avoid artificial waiting. |
| 3 Discovery | One contextual cue, readable entrances and map route. |
| 4 Movement | Touch, keyboard and joystick cooperate; nearest safe floor on tap. |
| 5 Outdoor doors | Replace timer-based reposition/entry fallback with actual arrival or graceful recovery. Current portrait walkDoor still sets p.x/p.y and enters on timeout. |
| 6 Indoor staging | Validate authored room-specific anchors, obstacle footprints, actor scale, paths and door exit. |
| 7 Mobile reach | Confirm small viewport, safe area, thumb reach and unclipped touch controls. |
| 8 Discoverable actions | Prop motion/highlight and clear one-step prompts rather than hidden hit rectangles. |
| 9 Continuity | Cancel/exit/language change preserve location and appropriate state. |
| 10 HUD | Explain every counter, simplify navigation and resolve duplicate concepts. |
| 11 Art consistency | One original nostalgic Japanese illustrated aesthetic; reject visibly mismatched vector and painted scenes. |
| 12 Scale | Tune moderate outdoor and indoor sizes against actual doorway, path, room and camera screenshots, not one universal scale. |
| 13 Identity | Four selected avatars recognisable in front/back/side and all poses. |
| 14 NPC diversity | Distinct silhouettes, ages, clothing and movement; no generic cameo recolours. |
| 15 Action animation | Dedicated body poses with wrist/seat/foot anchors rather than current transitional sprite deformation. |
| 16 Depth | Foreground occlusion, foot sorting and grounded shadows. |
| 17 Interior architecture | Native portrait room-specific architecture, not repeated shelf/window templates. |
| 18 Camera | Purposeful room establish, approach, action closeup, return; no hidden render-only repositioning. |
| 19 Lighting | Believable local lights and restrained weather/ambient variation. |
| 20 Typography | Consistent EN/ZH typography, measured text and touch targets. |
| 21 Purpose | Distinct meaningful outcome for each activity; curate rather than expand. |
| 22 Feedback | Physical input affects actual visible outcomes, gestures and prop motion. |
| 23 Skill | Fair optional mastery and no repetitive XP farming. |
| 24 Residents | Individual routines, context, recognition, reactions and useful optional encounters. |
| 25 Humour | Physical comedy, original bilingual context-aware reactions and consequences. |
| 26 Payoff | Satisfying end, meaningful keepsake or reflection, no generic congratulations. |
| 27 Return | Authored daily variation, genuine discoveries, no mandatory streak. |
| 28 Rewards | Paws, stamps, rare souvenirs and hideout cosmetics connect transparently. |
| 29 Community | Genuine shared backend and moderation if launched, no fake human posts. |
| 30 Audio | Quiet consultations; event-specific effects, mute and visibility; actual listening test. |

## Concrete current source observations
- The portrait outdoor walkDoor timer still forcibly sets logical coordinates and calls enter. Treat that as a P0 continuity defect; remove teleport only after testing normal movement, timeout recovery and cancellation.
- The cat chase adjusts position by fixed increments per rendered frame, rather than elapsed time. At different refresh rates the chase can feel different. Fix with a capped dt and valid play-area input; provide understandable feedback on invalid food/water drops. Inspect actual mouth/bowl contact, stats panel clearance and returning walk.
- The new outdoor scale helper cap deliberately allows the existing base to win over the maximum pixel target. It is not an absolute cap; review against screenshots before changing, and preserve perspective, actor ground anchors and contact poses.
- New SVG assets load on demand with fallback, but build.cjs validates only the original 62 WebPs and combined syntax. Add production asset path/dimension/frame-origin checks, and browser image decode / missing-asset / error checks.
- The current portrait renderer uses contain fit into livingBounds. New art must align with actual gameplay coordinates, walkable floor and foreground, not merely share portrait aspect. Most desktop paths retain legacy backgrounds. Review real screenshot pairs.
- Public community API is unconfigured. Local authored conversations remain available; do not describe shared posting as operational.
- Do not claim live gameplay or final artwork verification based on HTTP 200, source parsing, isolated numerical tests or an initial page extraction.

## Room-by-room next work
- Temple: player pose, actual hand contact, accurate block faces, quiet prayer, paper reveal, no duplicate temple.
- Tarot: coherent original deck with correct card meanings, hand/deal/flip and readable result, one daily or three deeper.
- Destiny: seated Master Yue pose and chart scroll, chart-specific followup and independent calculation review; silent.
- Wishing Garden: koi motion, coin trajectory and landing, lantern/plaque meaning, true water boundary.
- Worry-Free Pier: seated Ah Ma demonstration, paper target feedback, wrist contact, note fold/throw/landing, roast variations.
- Tea and office: original distinct faces and posture, seated stories, punchlines, meaningful branches, avoid duplicated chat screens.
- Park: complete cat expressions and gestures, frame-rate-independent chase, feeding/drinking contact, optional later adoption.
- Kitchen: Grandma host, physical scoop/stir/pour, heat and actual recipe outcome, no redundant ingredients or clipped labels.
- Arcade: grip/release alignment, distinct prize art, fair timing, rhythm motion, no duplicate reward farm.
- Discovery: illustrated situations and results, distinct personality tests, branching scenes, honest scoring.
- Hideout: coherent furniture perspective, placement/occlusion, optional cat and reward display, profile and meaningful stamp access.

## Acceptance order
P0: actual mobile/desktop walkthrough, repair route/interaction blockers, no runtime errors, image decode and regression validation. P1: complete one full illustrated vertical slice (pier), then temple and kitchen with dedicated avatar poses. P2: finish other existing room art, NPC sheets, typography, inventory and hideout; QA on all four maps, both languages and supported screen sizes. P3: invited pilot, observe first minute without coaching, refine based on behaviour, verify deployed version. Do not add unrelated destinations or advertise unverified completion. Real shared community can be separately phased.

## Owner-approved story-led execution overlay (28 November 2026)

Use these eight execution packages to coordinate the fixed 39 batches and existing cross-cutting workstreams. All 85 IDs from the current register are covered; stage, lease, dependency, evidence and fixed batch numbering remain authoritative. Packages are not new workstream IDs or a progress tally. Check current main and current active claims before starting. The original 30 lenses remain the acceptance checks, not 30 additional tasks. Apply the full-scene rules in GAME_EXPERIENCE_STANDARD.md and INNER_ACTIVITY_EXPERIENCE_PLAN.md; PR #191 contains the first ritual dialogue implementation and owner clarification, pending integration. No feature expansion from illustrative sports examples.

| Priority | Execution package | Fixed queue IDs | Existing cross-cutting IDs to reverify | Required deliverable |
|---|---|---|---|---|
| P0 | First impression | ENT-01, ENT-ASSET-READY-01, PERF-01 | ENT-02, ENT-GROUND-02, RAIL-04, RAIL-RECOVERY, RAIL-LIVE-01, RAIL-DIRECT-01 | Ticket and selection in world; decoded first frame, train arrival, first movement; no flash or redundant confirmation. |
| P0 | World navigation | WORLD-STORY-FLOW-01, UX-SIGN-ART-01, UX-SIGN-LIVE-01, UX-WAYFINDING-INTERACTION-01, SCENE-CAMERA-01 | MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, WORLD-INTEGRATION-FORTUNE, WORLD-INTEGRATION-HOME, WORLD-INTEGRATION-ISLAND, WORLD-INTEGRATION-WONDER, WORLD-VISITS-01, UX-SIGN-PREVIEW-02, RAIL-DESTINATION-COPY-01 | Four maps, approachable real doors and stations, no premature labels; coherent dock routes, immediate parent and physical departure. |
| P0 | Story and interaction | UX-FLOW-01, STORY-DEPTH-01, DISCOVERY-PARALLEL-LIVE-02, DISCOVERY-CAFE-LIVE-02 | CONTENT-RESIDENT-01, NPC-01, NPC-02, NPC-03, READ-01, READ-02, READ-03 | Tap-only narration, nonblocking ambient remarks, real choice points, typed replies, optional host reaction and late farewells; reusable dialogue lifecycle. |
| P1 | Physical gameplay | ROOM-01, ROOM-03, ROOM-04, ROOM-05, ROOM-06, GAME-DEPTH-01, SCENE-BLOCKING-01, DISCOVERY-ASSESSMENTS-01 | ROOM-02, GAME-01, ROOM-FOOD-LIVE-01, TEMPLE-WATER-01, TEMPLE-ALCOVE-01, TEMPLE-SLIP-01, ROOM-TAROT-PORTRAIT-FIX | Complete every retained room/inner activity: approach, pose, physical input, contact, result, recover, repeat and walk out. |
| P1 | Artwork and animation | ART-01, ART-02, ART-03, ART-INTEGRATION, LIFE-AMBIENCE-01, LIFE-OCCUPANCY-01 | HOME-ASSET-01, HOME-CATALOGUE-ART-02, HOME-FURNITURE-IMPORT-LIVE-01 | Inspect real assets before generating; register exact path, crop, seat/foot/grip/occlusion anchors; integrate unused suitable layers and inspect motion. |
| P1 | In-world interfaces | HOME-CATALOGUE-LIVE-02, UX-COHESION-01, UX-DESKTOP-01, UX-02, LOC-01 | UX-01, HOME-LIVE-01, HOME-PREVIEW-03, HOME-CATALOGUE-AUDIT-01, SHARE-01 | Themed physical objects for detailed pages only; coherent HUD, bilingual typography, accessible controls and independent actual export inspection in all supported formats. |
| P1 | Living world | DISCOVERY-01, LIFE-RELATIONSHIPS-01, SOCIAL-DAILY-01, COMM-TOWN-LIFE-01, COMM-MIXED-LIVE-01 | ECON-01, SOUND-01 | Optional varied resident encounters, contextual humour, living ambience, transparent rewards, genuine opted-in community, no fabricated human posts. |
| P0 continuous | Release and testing | QA-SPATIAL-01, QA-PLAYER-LOOP-01, QA-01 | QA-RAIL-HOME-01, QA-BUILD-01, QA-WATER-02, MODULE-LIVE-01 | Actual input and rendering before/during/after, both languages, small/tall phones first, desktop, exports, reload, interruptions, live revision. Keep stable release lane. |

### All 30 lenses mapped to implementation and acceptance

| Lens | Canonical IDs | Required evidence/check |
|---|---|---|
| 1. First impression | ENT-01, ENT-ASSET-READY-01 | Show coherent entrance and first enjoyable action. |
| 2. Loading | PERF-01, ENT-ASSET-READY-01 | Measure cold/warm, decoded art, slow/failure retry. |
| 3. Discovery | UX-SIGN-LIVE-01, DISCOVERY-01 | Recognizable prop/door, contextual labels; no premature destination. |
| 4. Movement | ART-01, SCENE-BLOCKING-01 | Touch/keyboard movement, obstacle routing, grounded approach. |
| 5. Outdoor doors | UX-WAYFINDING-INTERACTION-01 | Physical threshold entry/exit and return. |
| 6. Indoor staging | SCENE-BLOCKING-01, ROOM-06 | Actual chair/table/door geometry and contact. |
| 7. Mobile reach | UX-02, QA-SPATIAL-01 | Safe areas, reachable controls, keyboard, 44px targets. |
| 8. Discoverable actions | GAME-DEPTH-01, UX-SIGN-LIVE-01 | Recognizable physical object and immediate feedback. |
| 9. Continuity | UX-FLOW-01, QA-PLAYER-LOOP-01 | Tap beats, meaningful choices, input, interrupt/return, no stale overlay. |
| 10. HUD | UX-COHESION-01, UX-FLOW-01 | Four dock roots, themed nested sheets, no duplicate controls. |
| 11. Art consistency | ART-INTEGRATION, UX-COHESION-01 | Inspect existing assets, use coherent illustrated materials. |
| 12. Scale | SCENE-BLOCKING-01, QA-SPATIAL-01 | Actual perspective, body/door/furniture proportions. |
| 13. Identity | ART-01, ART-02 | Selected avatar remains recognizable in all poses. |
| 14. NPC diversity | ART-03, LIFE-OCCUPANCY-01 | Distinct residents, purposeful placement and routines. |
| 15. Action animation | ART-02, GAME-DEPTH-01 | Grip, seat, feet, action and recovery; no duplicate props. |
| 16. Depth | SCENE-BLOCKING-01, QA-SPATIAL-01 | Foreground masks, occlusion, shadows and depth sorting. |
| 17. Interior architecture | ROOM-01, ROOM-03, ROOM-04, ROOM-05, ROOM-06 | Real scene-specific rooms and props, not generic pages. |
| 18. Camera | SCENE-CAMERA-01, UX-DESKTOP-01 | Establish, approach, close-up and continuous return. |
| 19. Lighting | LIFE-AMBIENCE-01 | Local light, weather, water, smoke, reduced motion. |
| 20. Typography | LOC-01, UX-COHESION-01 | Natural EN/ZH, themed readable text and no clipping. |
| 21. Purpose | GAME-DEPTH-01, DISCOVERY-ASSESSMENTS-01 | Distinct retained activities, meaningful choices only. |
| 22. Feedback | GAME-DEPTH-01, UX-FLOW-01 | Input affects visible outcome and resident reaction. |
| 23. Skill | GAME-DEPTH-01 | Fair optional mastery; no filler or repetitive farming. |
| 24. Residents | LIFE-RELATIONSHIPS-01, LIFE-OCCUPANCY-01, SOCIAL-DAILY-01 | Distinct voice, optional conversation and recognition. |
| 25. Humour | LOC-01, STORY-DEPTH-01 | Natural, varied bilingual jokes and physical reactions. |
| 26. Payoff | GAME-DEPTH-01, STORY-DEPTH-01, SHARE-01 | Satisfying result, late farewell, coherent keepsake/export. |
| 27. Return | DISCOVERY-01, LIFE-RELATIONSHIPS-01, QA-PLAYER-LOOP-01 | Shorter repeat visits, saved state, variation. |
| 28. Rewards | ECON-01, GAME-DEPTH-01 | No duplicate rewards or unclear spending. |
| 29. Community | COMM-TOWN-LIFE-01, COMM-MIXED-LIVE-01 | Genuine moderated human activity, distinguish fictional residents. |
| 30. Audio | SOUND-01, LIFE-AMBIENCE-01 | Timed contact sound, gentle ambience, mute and visibility. |

### Required per-scene to-do (use existing workstream evidence, no separate backlog)

For every reachable entrance, map, doorway, room, inner activity, dock tab, nested sheet, result and share format: (1) identify current runtime route and existing art file paths; (2) lay out full scene entry/approach/facing/seat or standing pivot/host/props/camera and exit; (3) author short tap-to-advance story beats and optional nonblocking ambient lines; (4) only offer choices that actually change topic/action/result or obtain consent, with a single typed reply where necessary; (5) implement physical contact, anticipation/action/reaction/recovery, themed readable results and natural farewell; (6) integrate suitable existing assets, identify exact missing artwork only when necessary; (7) build and test by actual input, both languages, mobile first and desktop, interruption/replay/reload, actual exported file inspection; (8) record tested SHA, rendered evidence, blockers and integration/deployment revision. Use existing branch scope and guard concurrent changes. If one eligible mobile release passes, follow the release coordinator gate rather than waiting for unrelated desktop work; desktop remains outstanding. Do not mark complete based on code, a document or a successful isolated fixture alone. Do not repeatedly redesign already satisfactory scenes. Preserve save data. Continue independent work if a dependency blocks one scene.

### Priority sequence

First integrate and verify current entrance/dock/first-map and Fortune Valley candidates (including #191); keep stable release lane. Next finish existing rooms as full vertical slices: temple and garden, Tarot/Master Yue, pier, tea house, kitchen/drinks, arcade/park, discovery houses, home and railway. Reuse the same resident dialogue and physical scene conventions throughout. Close detailed pages and exports within the corresponding canonical UX/share workstreams. Then consolidate compatible branches, test and verify the actual live deployment. Work in parallel on unclaimed scopes where possible; do not treat all eight packages as sequential release blockers.
