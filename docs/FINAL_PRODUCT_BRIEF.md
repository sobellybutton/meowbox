# MeowBox final product and art brief

Owner direction, 25 November 2026. This supersedes tentative keep-all-activities decisions in VISUAL_PRODUCTION_BRIEF.md. MeowBox is an illustrated escape for working adults. Short, satisfying experiences in a living town, not a checklist of minigames. No duplicate destinations. Curation is explicitly authorized; keep previous earned items and save keys.

## 13 end-user design gates

1. Purpose: each destination answers a distinct player need (reflect, release, play, discover). Reject decoration-driven gameplay such as fishing merely because water exists.
2. First impression: illustrated railway ticket, chosen avatar, arrival gateway, walk into Fortune Valley. Returning players keep identity; no repeated registration.
3. Geography: exactly four existing maps; one temple, one pier; no subactivity rendered as a second destination. A station must be findable and physically plausible. Transportation is a route, not a minigame.
4. Journey: enter house, meet relevant character, choose meaningful action, complete dependent steps in the same house, then return or deliberately travel. No teleporting to get a result.
5. Visual direction: mature nostalgic Japanese animated-film-inspired watercolor/gouache; original artwork, atmospheric depth, distinct light/weather/materials per world, no generic AI collage or glossy UI.
6. Spatial depth: native portrait maps and interiors; actual walkable paths, independent props, foreground occlusion, foot-based sorting, grounded shadows and consistent avatar scale. No baked labels/characters or fake flat depth.
7. Characters: consistent chosen avatar in front/back/side views, clear silhouettes, illustrated body poses; residents have purpose. A grumpy Auntie leads villain hitting, never the target. No floating tools or detached limbs.
8. Interaction/animation: physical, purposeful input and visible outcome. Hands meet objects, prepare/throw/land/release. Responsive feedback and optional accessible controls; idle atmosphere is not a replacement for gameplay.
9. Activity curation: remove, merge or rebuild repetitions; each retained activity has a reason to exist and a different action. No fishing or bench-sitting as standalone pier activities. No duplicate stress rooms, tarot/astrology variants or personality destinations.
10. Writing and humour: language-specific English/Chinese, short visible labels, contextual workplace satire, rotating reactions and character relationships. One language at a time; no generic dialogue-only room.
11. Content quality: reflective tarot, chart-specific Zi Wei Dou Shu interpretation with transparent limits, clearly differentiated personality exercises; review scoring and assumptions; don't promise live AI without implementation. Private notes and birth data never uploaded without explicit permission.
12. Return value: unique memories, optional skill challenges, branching endings and rare encounters, no grinding, no pressure to level up, no reward farming for repeating a click. Preserve old fishing keepsakes and all saved progress.
13. Product testing: build/CI, organic mobile and desktop navigation, real touch/mouse/keyboard, both languages, privacy, returns, save/reload, screenshot review, FPS/load benchmarks. Code passing is not artwork acceptance. Stop expanding until a full slice feels good.

## Final curated world plan

| World and house | Keep / improve / consolidate |
| --- | --- |
| Fortune Valley / entrance | One arrival gateway; not a second temple. |
| Fortune Temple | One courtyard: bell, hand rinse, prayer, optional moon blocks and stick ritual; matching paper, read and keep/tie in same temple. Hidden retreat only if it adds atmosphere or discovery, not a separate game. |
| Tarot House | Daily one-card and topic-specific three-card reading. Deal, flip, interpret and save in place. |
| Destiny House | One consultation flow: Master Yue, birth data, chart, explanation and chart-related follow-ups. |
| Wishing Garden | Wish coin or plaque; no fishing or duplicated bottle venting. |
| Lazy Island / Worry-Free Pier | Consolidated emotional release courtyard by river: villain hitting guided by grumpy Auntie, private note bottle release with power/trajectory, shout with animated echo; consider breakable symbolic bottle targets as an optional distinct mode within the same stress zone, only after core playtest. Remove fishing and generic bench chat from playable choices. |
| Tea Room | Gossip/story/news, clearly labeled community noticeboard; no duplicate private rant wall. |
| Office | Workplace parody microstory, distinct branching comic outcomes, not another stress venue. Retire the office door if it cannot support worthwhile stories. |
| Daydream Park | Animal trust and unique interactions; passive sitting alone is not an activity. |
| Munch & Play / Kitchen | Different meaningful food and tea preparation mechanics, one kitchen. |
| Arcade | Skill-based claw and rhythm, blind boxes only if collectible design adds value. |
| Daily Souvenir | Retain only if daily curated artifact and story distinct from random rewards; otherwise migrate/remove door. |
| Discovery Station / Personality Lab | One selection point, curated Soul Cat, preference and motives exercises with honest scoring. Remove redundant quizzes. |
| Parallel Lives | Branching interactive stories with genuinely different endings; not another assessment. |
| Compatibility Café | Relational reflections; retain only if distinct from lab and astrology. |
| All maps / Next Stop | Same travel selector, clear next destination, seamless return. |

## Waterfront visual and gameplay production

Keep room ID fish for compatibility, displayed as Worry-Free Pier. One connected weathered riverside courtyard: covered wooden ritual stall, Auntie on stool, paper target/slipper, writing bench with folded note and sealed virtual bottle, stone path to river, windsock and lookout. Water moves, reeds sway, distant scenery and small environmental reactions. The note bottle is an imaginary dissolving/vanishing vessel, not real-life advice to litter. Player moves toward each station. One house and three distinct release choices. The bottle note and shout text stay transient; clear on finish or exit; no microphone or recording. End with humorous response and return/retry.

Production asset list: native portrait exterior and inner courtyard; foreground/occlusion masks; full-body Auntie pose sheet (seated, pointing, reacting); same-avatar walking/throwing/whacking/shouting poses; paper target states, slipper, note fold, bottle seal/flight/splash/drift, wind and ripple layers; localizable UI text. Build individual assets against actual anchors, not an all-in-one image. Final art must be visually reviewed in actual gameplay.

## Implementation batch

- 164c15a: replaces visible pier fishing/bench entries with villain hitting, bottle release and shout; Office now has a short two-choice workplace satire rather than duplicate venting. Legacy fishing code/keepsakes retained for save compatibility; do not use as another visible game. New canvas scene includes animated avatar approach, bottle folding/sealing, flight, drifting/fading, water ripples, shout echo and grumpy Auntie draft. No final painterly art yet.
- cdeaafd / 224dc44: adjustable throw strength and trajectory, private shout echo, note clearing on exit, guide framing and visible strength label.
- 0ad54b7: attaches slipper to selected avatar's wrist during hit instead of rendering it as a free-floating tool in this venue.
- 860e70e: adds browser test setup for single stress venue, bottle strength, physical input, note privacy, echo, same-room return, and villain hitting. Tests use direct setup for room entry, then actual controls/taps; full organic journey and visual quality still pending.
- Modified source and embedded test JS parse successfully via JavaScript function parser. Actual build, new CI, deployment and real-device review are not independently confirmed. Animation and character are procedural drafts; the final illustrated asset pass and more organic gestures (including direct strength swipe) remain open.

## Work order

Complete one waterfront vertical slice, visually inspect and tune before adding more modes. Review all remaining houses against these 13 gates and curate before producing final art. Complete Fortune Valley as the visual standard for rituals/readings and arrival, then remaining map batches. Document each retired entry, keep its earned inventory, migrate links, and test the entire journey. Never equate number of commits or features with completion.


## Visual production specification and quality gates

Do not use the earlier concept boards as game backgrounds: their baked labels, characters and mixed geography conflict with real movement. The existing watercolor outdoor art and draft vector interiors are a functional baseline, not a final style approval. Build one cohesive original illustrated world, inspired by nostalgic Japanese animated-film scenery, with quieter detail, believable scale and an adult sensibility.

### World and room composition
- All maps and interiors composed in portrait at native dimensions; retain desktop framing and avoid landscape crops. Plan door coordinates and clear walkable areas before drawing. Existing map IDs/room IDs remain stable; record every revised anchor and collision/occlusion region. The entrance gate is transit, not a second temple.
- Fortune Valley: warm weathered wood, moss, muted vermilion, mountain mist; four distinct buildings and a transport exit. Temple courtyard, reading room, astrologer's study and wishing garden have different architectural silhouettes and camera framing. Ritual objects are independent sprites.
- Lazy Island: breezy coastal village, soft teal water, limestone and aged timber. Worry-Free Pier is a connected release courtyard (Auntie's sheltered stall -> writing bench -> path -> river lookout); remove fishing rods and game signage from newly produced art, but decorative fish may remain. Office is workplace parody, tea room is social gossip, park is animal interaction. Do not commission final Office art until the story earns its place.
- Munch & Play: faded retro signs, warm amber shop light, contrasting machine colors. Kitchen has a real preparation counter and stove; arcade has individual cabinets and space to operate them. Do not commission final souvenir shop art until it has a distinct daily-discovery purpose.
- Discovery Station: old observatory/library/café, indigo and warm lamplight. One Personality Lab with multiple assessments, one branching-story house and one relationship café only if its distinct experience is validated.
- Build static art without characters, readable labels, moving props or baked lighting effects. Separate backplate, midground, foreground occlusion, interactive objects, shadows and atmospheric overlays. Maintain common vanishing point/scale. Use foot-based depth sorting for walking characters. Do not hide entrances behind decorative foliage.

### Characters and animation
- Use consistent identity sheets for the four existing avatar choices before drawing variants. Match hair, clothing, silhouette, palette and body proportions in portrait, front/back/side walk, idle and activity poses. Four-direction walking, feet anchored, believable arm reaches and tool contact. No detached heads/limbs, bouncing cutout walk or floating props.
- Recurring NPCs need unique silhouettes and purposeful roles: Auntie (stern brows, practical clothes, bun, stool, slipper; not the target), Grandma cook (warm kitchen apron), temple keeper, Master Yue, other residents only where useful. Avoid reusing the same face with a different label. Aim for subtle idle cycles, expressions and reactions.
- Waterfront slice: seated/pointing/reacting Auntie, player approach and whack poses, paper target deformation, note fold/seal, controlled bottle throw, strength-dependent landing/ripples/drift, shout pose/echo/reeds/birds. Existing procedural drafts are not final animation assets. The bottle is virtual; no real littering encouragement. Avoid extra modes until this sequence is satisfying.
- Temple: proper ladle/water contact, bow/kneel/incense pose, swinging bell striker, stick shake/fall/pickup, moon blocks tumble and matching fortune paper reveal. Tarot: consistent card proportions and coherent original/appropriately licensed deck, hand/deal/flip closeups. Kitchen: correct hand-to-tool contact and ingredient motion. Arcade: physical machine mechanisms. Animal interactions: breathing, posture change and response.
- Keep ambient movement subtle and asynchronous; avoid looping identical particles everywhere. Respect reduced-motion settings. Sound is optional and does not substitute for visual feedback.

### Interface and visual hierarchy
- HUD minimal and consistent; location, player identity, necessary contextual back control and four bottom navigation items (Home, Passport, Bag, Map). Next Stop is a route shortcut, not a second destination. Avoid stacked competing buttons, excessive floating labels, oversized title overlays, translucent cards covering character or scenery. Only selected language shown, with real typography, readable EN and Chinese glyphs, short labels, accessible contrast and minimum 44px touch targets.
- Use diegetic design where helpful: ticket for entry, sign for doorway, card for tarot, folded paper for fortune, notebook for results, travel journal and illustrated bag. Do not turn every activity into an identical rounded rectangle. Text entry and accessible controls may be conventional, but integrated visually and never obscure primary gameplay. Do not bake text into background art.
- Enter from doorway, walk to action, camera follows or pushes in, then return to prior room position. No slideshow feel or unnecessary waiting. Keep a simple escape/back path and preserve completed results.

### Asset manifest and review requirements
For each asset record map/room/activity ID, file path, dimensions, intended camera bounds, layer type, anchor, draw order, animation frames/pose and license/origin. Use optimized WebP for backgrounds, alpha-preserving WebP/PNG for foreground and sprites; load per scene and preserve existing fallback until verified. Avoid enormous embedded base64 assets. Use consistent relative sprite dimensions, foot pivots and hit boxes.

Acceptance per vertical slice: screenshot of map spawn, walk toward door, interior entrance, approach, input, visible reaction, result and return; inspect small/tall phone, tablet and desktop at both language settings. Review animation playback and touch targets in actual browser, check no clipped text, overlapping HUD, disappearing avatar, broken occlusion, incorrect prop contacts, duplicated destinations, or dead-end transitions. Compare cold load and animation performance to existing baseline; record measured values, not guesses. Do not approve a new map based only on pretty concept art or CI.

Production sequence: establish art/character style and complete the Worry-Free Pier slice first, then Fortune Valley (arrival and temple first), remaining retained interiors map by map, then global UI, collection art and polish. Curation precedes expensive art. Existing code changes are committed but final illustrated artwork and real-device visual acceptance remain outstanding.


## Mandatory room staging redesign (owner repeated feedback)

Owner reports that on entering houses, the avatar appears tiny, in the middle of nowhere, and sometimes overlaps the game item. This is a priority visual/gameplay defect, not an optional polish item. Do not solve it by globally increasing avatar scale or changing the same spawn coordinate for all rooms.

### Technical diagnosis
Current src/extensions.js indoor exploration uses a generic entrance derived from livingBounds(), fixed x coordinates, a generic approach computed from each hit rectangle, a 3.5-second timeout that may invoke an action before the player actually arrives, and render-time clamping of the avatar separate from its true movement coordinates. mobileRoomCamera() uses generic room/activity framing. These do not guarantee the player is on a walkable surface, clear of furniture, properly scaled to the room, or visibly approaching the right side of an item. Verify current effective overrides before editing.

### Required architecture
Define a room staging manifest for every retained room, with room-specific entrance/exit anchors, arrival facing, floor/walkable polygon or navigation graph, solid obstacle footprints, station-specific approach anchors/facing, interaction distances, actor foot pivot, perspective scale range, camera safe bounds, foreground occlusion and optional activity staging. Use the same coordinate transform for art, player, pathfinding, hit testing and camera. Do not derive a standing position from a button or item hit rectangle. Keep logical world and rendered foot position identical; camera follows the actor instead of secretly clamping the rendered avatar. Resolve paths around solid furniture with clearance for the actor; taps outside walkable space should resolve to a nearby safe floor point or be ignored. Never let a timeout initiate a game before arrival; recover to a reachable anchor with an understandable prompt if route fails.

### Player-visible sequence
1. Approach the outdoor door and cross the threshold with a short continuous transition.
2. Appear just inside the actual doorway on a clearly visible floor, facing inward; walk a few steps to a safe arrival point. No spawn in center, behind counters or over interactive props.
3. Camera establishes the room and keeps the character readable. Suggested starting calibration: standing full-body sprite roughly 12–18% of usable scene height on mobile near entry, adjusted to painted perspective and tested per room; not a universal mandatory size. Preserve real proportions and contact shadows; on desktop no tiny avatar floating in oversized room.
4. Player taps an object or walks. Route to its authored approach point on the correct side (customer side of counter, front of altar, beside river), stop and face it. Only when actually within reach may interaction begin.
5. Camera smoothly reframes to the station. Keep the same avatar visible in a believable action pose where appropriate; hands meet objects, no overlap with furniture or floating tools. For closeups like tarot or birth chart, use purposeful over-the-shoulder/table framing or a clear hand view rather than shrink avatar in the middle of a card.
6. On activity completion or cancellation, return to the same station's safe standing position in the same room, not the entrance or center. Preserve completed results. On exit, walk toward door and return outside at correct doorway, not another map.

### Example authored layouts
- Temple: entrance at lower stone path; bell approach beside striker; basin approach in front of ladle; prayer on mat facing altar; fortune draw beside cup; paper reveal at counter. Never stand inside altar or basin.
- Tarot: enter near lower aisle, approach visitor side of reading table; seated/standing reading pose, closeup on cards, then return beside table.
- Destiny: enter study aisle, approach Master Yue's consultation desk on visitor side; chart and follow-up stay in that room.
- Kitchen: enter through side doorway; approach work side of prep counter/stove or tea station; face and reach utensil; return to safe prep position after tasting.
- Arcade: enter aisle, stand directly in front of chosen cabinet with sufficient clearance; never overlap machine or prize chute.
- Worry-Free Pier: enter covered courtyard; approach Auntie's paper target, writing table or river lookout along path. Land/water boundary is solid to the avatar; throwing and shout animate from riverbank, not in water.
- Remaining rooms must each define their own anchors and camera composition, not reuse a generic middle-floor template.

### Acceptance criteria (must inspect actual rendered gameplay)
For every house at 360x640, 390x844, tablet and desktop: capture immediately after entry, arrival, approach to every retained station, interaction and return. Both languages; same selected avatar throughout. Assert feet lie on walkable floor and outside obstacles; body does not obscure labels or interactive item; actor's screen size is legible and proportional; tap targets remain usable; no forced action until actual arrival; cancel/move/back works; no unexpected teleport after returning from closeup. Check route from entry to farthest station using normal input, not only test repositioning. Inspect screenshots and video; reject if technically passing but visually floating, tiny or overlapping. Update staging/asset manifest together before replacing any room art. This is an implementation requirement, not a claim the defect has been fixed.
