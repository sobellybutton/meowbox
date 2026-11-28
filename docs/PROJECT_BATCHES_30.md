# Pawradise: 30 project-wide implementation batches

Owner correction, 28 November 2026. The thirty batches divide the ENTIRE outstanding game, not a single room or thirty iterations on Auntie. Prior local Whack Worries batches 1–5 are substeps within batch 12 only; they do not consume five project batches. The canonical register remains WORKSTREAMS.json. Every existing ID is assigned exactly once below; cross-cutting work also applies to relevant rooms. New tasks join the closest batch. Batch numbers are scope identifiers, not a claim of completion or a mandatory serial order.

For every continue, execute multiple independent actionable tasks spanning several batches when possible. Avoid repeatedly polishing one activity while other venues are untouched. Park missing artwork, visual test blockers and any leased resource with exact dependency; continue elsewhere. The hourly runner uses the same register and leases. Record actual commits and evidence; no count increase for planning or code-only tests. Final acceptance still requires the mandatory actual mobile and desktop playthrough and deployed revision.

1. **Entrance, loading and first playable frame**: `ENT-01`, `ENT-02`, `ENT-GROUND-02`, `ENT-ASSET-READY-01`, `PERF-01`.
2. **Fortune Valley map and routes**: `MAP-01`, `WORLD-INTEGRATION-FORTUNE`.
3. **Lazy Island map and routes**: `MAP-02`, `WORLD-INTEGRATION-HOME`.
4. **Munch & Play map and routes**: `MAP-03`, `WORLD-INTEGRATION-ISLAND`.
5. **Starlight Valley map and routes**: `MAP-04`, `WORLD-INTEGRATION-WONDER`, `MAP-05`, `WORLD-STORY-FLOW-01`.
6. **Railway travel, arrival and scenery**: `RAIL-04`, `RAIL-RECOVERY`, `RAIL-LIVE-01`, `RAIL-DIRECT-01`, `RAIL-DESTINATION-COPY-01`.
7. **Traveller sprites, proportions and pose library**: `ART-01`, `ART-02`.
8. **Resident identities, movement and occupancy**: `ART-03`, `NPC-01`, `NPC-02`, `NPC-03`, `LIFE-OCCUPANCY-01`.
9. **Temple rituals and bell, incense, sticks, moon blocks**: `ROOM-01`, `TEMPLE-ALCOVE-01`, `TEMPLE-SLIP-01`.
10. **Purification**: `TEMPLE-WATER-01`, `QA-WATER-02`.
11. **Rear garden, wishing garden and coin toss**: `ROOM-02`.
12. **Pier: Whack Worries, bottle and shout**: `ROOM-06`.
13. **Kitchen and boba preparation**: `ROOM-03`, `ROOM-FOOD-LIVE-01`.
14. **Arcade, distinct physical activities and replay**: `ROOM-04`, `GAME-01`, `GAME-DEPTH-01`.
15. **Park, animals and environmental discoveries**: `ROOM-05`, `DISCOVERY-01`.
16. **Moonlight Tarot and reading results**: `READ-03`.
17. **Master Yue study and ZWDS**: `READ-02`.
18. **Inner Observatory and Curiosity Club assessments**: `READ-01`, `DISCOVERY-ASSESSMENTS-01`.
19. **House of What If and branching stories**: `DISCOVERY-PARALLEL-LIVE-02`, `STORY-DEPTH-01`.
20. **Heart Café and relationships**: `DISCOVERY-CAFE-LIVE-02`, `LIFE-RELATIONSHIPS-01`.
21. **My Room art, placement and finishes**: `HOME-ASSET-01`, `HOME-LIVE-01`, `HOME-CATALOGUE-AUDIT-01`, `HOME-CATALOGUE-ART-02`, `HOME-CATALOGUE-LIVE-02`, `HOME-PREVIEW-03`, `HOME-FURNITURE-IMPORT-LIVE-01`.
22. **Paw Coins, daily tasks and social gestures**: `ECON-01`, `SOCIAL-DAILY-01`.
23. **Community board, human and NPC play**: `COMM-MIXED-LIVE-01`, `COMM-TOWN-LIFE-01`.
24. **HUD, four docks, signs and accessible controls**: `UX-01`, `UX-02`, `UX-COHESION-01`, `UX-SIGN-ART-01`, `UX-SIGN-LIVE-01`, `UX-SIGN-PREVIEW-02`.
25. **Bilingual copy and share/keepsake results**: `LOC-01`, `SHARE-01`, `CONTENT-RESIDENT-01`.
26. **Atmosphere, weather and audio**: `LIFE-AMBIENCE-01`, `SOUND-01`.
27. **Cross-room staging and asset integration**: `ART-INTEGRATION`, `SCENE-BLOCKING-01`, `QA-SPATIAL-01`.
28. **Native desktop, cameras, navigation and full activity flow**: `UX-DESKTOP-01`, `SCENE-CAMERA-01`, `UX-FLOW-01`, `UX-WAYFINDING-INTERACTION-01`.
29. **Build, regression and module integration**: `QA-BUILD-01`, `MODULE-LIVE-01`, `QA-RAIL-HOME-01`, `WORLD-VISITS-01`.
30. **End-to-end device, deployment and final acceptance**: `QA-01`, `QA-PLAYER-LOOP-01`.

### Batch 13 owner-approved kitchen expansion (28 November 2026)

Keep Grandma's Kitchen as one continuous neighbourhood eatery, not a soup-only activity or five new destinations. Owner authorizes broader food experiences when they suit continuous gameplay. Extend existing ROOM-03 and ROOM-FOOD-LIVE-01 acceptance, without creating artificial workstream counts. Prioritize one complete native cooking and dining slice before broadening recipes; retain existing soup and saved progress. The following design choices are implementation direction, not a claim of completed or imported artwork.

- Physical counter menu: cook with Grandma, order/eat, help prepare and serve, pack a dish for home or a resident, or sit and chat. These are contextual interactions at appropriate in-room stations, not mandatory web-style tabs or separate pages. An optional daily special and recipe collection can reuse existing keepsake/coin systems without grind.
- Reuse the owner-provided Grandma/Pearl & Pause food artwork where separable and suitable; audit manifests/staging and original source first. Candidate dishes: egg noodles, curry rice (confirm plate identity against source), chicken rice, kaya toast, soft eggs, steamed buns, ondeh ondeh, egg tarts, red bean soup, alongside current soup. Group into distinct preparation patterns (boil/stir, chop/plate, toast/spread, wrap/steam, roll/coat, fill/bake); meaningful ingredient and heat/timing choices, recoverable mistakes, and dish-specific final art. Avoid nine copies of the stirring mechanic. Do not add recipes with missing assets by substituting floating generic icons; stage actual dependencies and move on to other ready slices.
- In-room flow: approach menu/counter; Grandma greets; player walks to work side or dining stool; tools and ingredients have visible storage and retrieval/return; Grandma demonstrates and performs relevant motions; player handles the appropriate gestures; food is visibly plated, carried and placed on a real table; seated player eats and reacts; Grandma responds; replay or return to room without resetting location. Order-only guests can sit and be served. Optional helping uses NPC arrivals, order, wait, serve, collection and departure at a calm pace. Pack gifts only through existing bounded inventory/resident systems and avoid mandatory errands.
- Keep player/Grandma full-height proportions, feet/furniture alignment, hand grip and prop occlusion, live NPC motion with safe kitchen aisles, steam/sizzle/chop sounds, and stable closeups on genuine phone and native desktop. Natural bilingual contextual labels and authored Grandma dialogue; e.g. EN: "I measure garlic with my heart. The recipe is merely a suggestion." ZH: "蒜放多少？看心情，食谱只是参考。" Avoid repetitive jokes and unnecessary panels.
- Pearl & Pause follows the same physical service and preparation principles; audit illustrated drink variants and use existing tea customization rather than creating a redundant activity.
- Acceptance: distinct tested recipe mechanics and valid final dish art, real ingredient/utensil/hand contact, correct seated eating and serving, no second web interface, save/replay/back transitions, actual phone and desktop visual evidence in both languages. Existing release priorities remain; optional breadth must not stall core room quality. No acceptance advancement for this design note.
