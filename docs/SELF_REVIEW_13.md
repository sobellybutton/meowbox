# Thirteen-angle self-review and production gates

25 November 2026. Review based on current source, owner playtest feedback, concept art and recorded browser checks, not a fresh hands-on visual playtest. Current art boards are mood references, not finished playable scenes. See VISUAL_PRODUCTION_BRIEF.md for canonical geography and activity curation.

| Angle | Criticism | Acceptance / next work |
| --- | --- | --- |
| 1 Art direction | Painted outdoor scenes, draft vector interiors and generic DOM UI feel inconsistent. | Original nostalgic Japanese painted visual language; distinct palettes per map, coherent typography/materials; approve a complete visual slice before producing all art. |
| 2 World geography | Concept boards merge four destinations and risk duplicate shrines; legacy registry needed deduplication. | Keep four distinct maps, one temple, one pier; entrance gate is not a destination. Verify every exterior against actual door anchors and runtime IDs. |
| 3 Depth and staging | Painted perspective does not guarantee spatial interaction; figures risk looking pasted on. | Separate background, architecture, foreground occlusion and dynamic props; foot-based depth ordering and consistent camera. |
| 4 Characters | Portrait and procedural action poses are not visually consistent. | Match selected avatar front, back and side; illustrated sprite/action poses, silhouette, proportions and clothing remain consistent. |
| 5 Animation | Correct state transitions can still look mechanically awkward. | Hands contact props, natural kneeling/bowing, movement acceleration, believable object arcs; inspect recordings rather than only state tests. |
| 6 Navigation | Door tests previously required repeated repair; near-door taps do not prove long exploration. | Start-to-destination real touch journeys, clear doors, natural entry/exit, back and Next Stop, no hidden controls or blocked signs. |
| 7 Interiors | Draft portrait vectors are not finished painterly art; reused layout reduces identity. | Each retained station and activity has its own native portrait scene or closeup. Design prop placement and interaction first; no baked labels or characters. |
| 8 Gameplay | Too many thin interactions and automatic rewards. | Audit each activity for purpose, satisfying input, distinction and return value. Improve, combine or retire weak games with save migration. |
| 9 Reading/quiz content | Tarot, Zi Wei Dou Shu and personality tests need review of scoring, explanation and validity. | Clearly differentiate reflective entertainment from evidence-based assessment. Audit algorithms and explain limits; avoid deterministic claims and duplicate readings. |
| 10 Language/humour | Shorter labels help, but literal translation and stale jokes weaken identity. | One language at a time, original culturally appropriate humour, inspect every screen for clipping; recurring jokes and contextual reactions. |
| 11 NPCs/story | Affinity is implemented for four residents but dialogue can still feel transactional. | Embed encounters in activities, meaningful branching choices, recurring routines, clues and rare keepsakes. No generic chat-only destination. |
| 12 Progression | XP thresholds exist but mastery/unlocks and long-term balance remain unfinished. | Optional challenges, meaningful collectibles, harder rank progression without farming or pressure. Keep prior saves. |
| 13 Engineering | Multiple function overrides complicate maintenance; CI does not prove art quality or real network performance. | Unique canonical registry, preserve builds and tests, simplify overrides incrementally, verify actual browser screenshots, load and touch metrics. |

## Work sequence

P0: validate source and build station uniqueness; keep current game working. Latest recorded handover browser run 45589449596 is now confirmed successful (build, all doorway step, entrance/responsive activities). This applies to that run, not new commits.

P1: complete one coherent Fortune Valley vertical slice: railway/arrival gate -> walkable portrait map -> one Fortune Temple -> water, bell, prayer, sticks, moon blocks -> back outside -> Next Stop. Render art without baked characters/text; map exact paths and interactive anchors. Review screenshots and video for real contact and depth. Then complete Tarot House, Destiny House and Wishing Garden; audit their content. Do not create another map or temple.

P2: Lazy Island, then Munch & Play, then Discovery Station. Curate weak activities before commissioning their art. Prioritize distinct interactions and atmosphere rather than count. Each map is a coherent batch with its interiors, activity closeups, characters, transitions and localization.

P3: Bag/passport, personal room, rare encounters, progression, balanced rewards, accessibility, performance and full regression across actual touch, mouse and keyboard. Real shared noticeboard remains a separate backend/privacy task.

Definition of done: clear world identity; no duplicate destinations; all retained activity art and controls work; no inaccessible doors or cropped text; save/reload verified; screenshot review and build/browser test evidence recorded; no assertion of final visual quality without seeing the result.

## First implementation
- 57a723d: consolidated fishing station into Lazy Island's base map registry, removed duplicate legacy insertions. Final existing portrait anchors and gameplay actions are unchanged by intent.
- 95e2c75: build guard checks four base destinations, global uniqueness, finite coordinates, bilingual names, and ownership of temple, transport station and pier. This checks base declarations, not every runtime mutation; add actual runtime regression coverage as next engineering task.
- Both edits committed on main; new CI/build/deployment not independently confirmed at writing. No game deleted, no painted assets replaced, no visual approval claimed.
