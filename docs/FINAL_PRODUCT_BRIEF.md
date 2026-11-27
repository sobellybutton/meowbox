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


## CEO product review and launch decision

The product is a prototype, not an approved public launch. This assessment is based on existing development evidence and owner feedback, not fresh external player research or device visual review. Positioning proposal: a little world away from work, for a short break, humour, reflection and unexpected discoveries. Asian workplace culture and bilingual 摸鱼 humour are the distinctive identity. Preserve the free, low-friction experience; do not turn it into an astrology portal or a collection of unrelated games.

### Product priorities
- First minute: player understands premise, selects identity with minimal friction, reaches the world quickly; returning gateway brief and skippable after arrival if repeated animation becomes tedious, while retaining the gateway experience. No mandatory long tutorial.
- First five minutes: optional clear recommendation of one satisfying experience, not forced chores; navigate naturally to a room, perform meaningful action, receive visible/funny outcome, return or explore. Short visits must feel complete, not like homework.
- Signature experiences: prioritize Worry-Free Pier (comic emotional release), Fortune Temple (calm tactile ritual) and Grandma's Kitchen (physical comforting activity). These three are proposed launch-quality pillars, not new destinations. Tarot and other retained activities must meet distinct quality gates; defer expansion rather than hide defects.
- Curation: freeze new features until indoor staging, animation/art and the existing core loop work. Review Office, Souvenir and Compatibility Café against distinct value; combine, improve or retire with save/link migration. Keep the four maps coherent and do not imply uncompleted rooms are final.
- Retention: optional daily variation, recurring resident callbacks, rare encounters, meaningful keepsakes, visible travel memories; no mandatory streaks, repetitive XP farming or pressure. Give satisfying endings and easy resume/exit, rather than maximizing time spent.
- Brand: consistent bilingual name/signage, original art style, recognizable avatar/residents, coherent illustrated HUD and passport. No inconsistent labels or references that imply actual celebrity interactions. Review art rights and third-party content/license provenance.
- Trust: private notes/birth inputs stay local and transient unless user explicitly saves; clear local save limitations. No fake AI chat, fake shared community, deterministic health/personality/fortune claims. Real shared noticeboard is a separately scoped moderated feature; do not block core launch on it.
- Accessibility and quality: reduced motion, mute, alternate controls, readable EN/ZH, touch/keyboard, stable performance on older phones. No forced payment, ads or sign-in introduced without owner direction. Avoid heavy external services and recurring cost without explicit budget.
- Validation: use a small pilot of new players who have not seen the design. Observe unassisted entry, first activity discovery/completion, where they hesitate, which scenes they skip, emotional response, voluntary intent to return and actual voluntary return if they consent. Suggested pilot 10–15 people, not statistically representative. Do not collect private notes or birth information as analytics. If telemetry is ever added, explicit opt-in, minimal aggregate events, no private content.
- Proposed internal launch targets (not measured facts): most pilot players reach a meaningful first interaction within 60–90 seconds; at least 8 of 10 can finish a chosen activity and find their way back unaided; no critical blocker, broken save, duplicate destination, unreadable text or avatar/prop collision across supported viewports. Visual review and organic gameplay evidence required, not only synthetic tests. Collect qualitative feedback and revisit targets.
- Roadmap: P0 room staging/camera/collision and core navigation; P1 complete one polished vertical slice with art, meaningful gameplay and bilingual flow; P2 extend signature experience standard to remaining retained houses; P3 pilot, fix observations, repeat, then public release. No percentage-complete claims without an explicit evaluated checklist. Do not introduce unrelated monetization or backend scope until the core is validated.

Success means a player willingly chooses a short enjoyable break and wants to revisit; time spent or feature count is not the primary objective. This review sets proposed product strategy and gates, not verified implementation or user acceptance.


## Replay variation and authored personality (owner feedback)

The player should experience intentional variety, not generic AI-generated filler or arbitrary changes. Keep rules fair and results explainable.

- Daily layer: stable personal daily fortune, seasonal menu, town news, occasional resident appearances, weather and time-of-day. Reset by Singapore date; do not reroll a fortune on refresh. Daily theme is entertainment and not a prediction.
- Session layer: rotate curated dialogue and small environmental reactions without immediate repetition. Vary based on location, resident personality, prior encounters and physical action. Avoid repeatedly granting the same reward for different lines.
- Skill layer: input strength, timing, angle and choices should influence outcomes; chance may vary cosmetic events or rare discoveries, not secretly override skill.
- Assessment layer: vary question order or use equivalent balanced question forms only after scoring audit; same substantive answers should produce comparable results. Do not randomly change Zi Wei Dou Shu charts, personality classifications or fixed daily tarot to make them entertaining. Separate humorous presentation from results.
- Story layer: branches have real consequences, rare encounters have context and memory. NPC voice guide: Auntie is sharp and practical, Grandma warm and occasionally sarcastic, Wang Laoban absurdly corporate, temple keeper understated, Mochi mostly nonverbal. Original culturally natural EN and ZH, not translated templates.
- Visual layer: small natural variations in wind, light, weather, expressions and object reactions; original consistent illustrated art, no mixed AI styles, generic icons or visual noise. Draw individual native portrait backgrounds, props, character sheets and foreground layers against room staging. Review actual gameplay before approval. Never market as human-made if that is not true; quality and intentional design should speak for themselves.
- Example: same bottle throw strength may get a different Auntie comment or water reaction, but landing stays governed by the input. Same quiz answers should not randomly return another type.

Implementation e17dae1 and 255a5d6: optional Daily Luck paper slip in passport, 12 original bilingual themes with symbolic color/number, local random seed (not based on private data), consistent Singapore date, adjacent days rotate themes. Rotating Auntie hitting/shout/bottle reactions, with strength-aware pools and unchanged reward rules. No new destination, no forced travel, no network service. 7eb6730 adds browser regression coverage for daily consistency/rollover and reaction rotation. JavaScript parsed; actual CI/deployment and visual review not yet confirmed. Fortune slip is a styled HTML draft, not final painted artwork. Broader NPC, seasonal, question-bank and animation improvements remain pending.


## Owner direction: community gathering and gratitude (26 November)
Do not create a Happy Room, celebration house, pavilion, extra map or duplicate lobby. The existing Tea Room is the physical gathering point; Town Square is the shared posting and conversation interface. Good Company Club is a mode within these existing spaces, not a new destination. All visitors may gather, including people without good news. Offer optional celebration, quiet company, ordinary chat, encouragement and recognition of familiar travellers. Use existing residents as hosts, never as fake human users.

Celebrate promotions, family milestones, recovery, everyday gratitude, courage and kindness. Award 12 Paw Coins for the first valid gratitude reflection per Singapore day, private or public; no pressure to disclose, no extra reward for repeated messages, no streak penalty. Daily activity maximum becomes 52; existing wheel and balances remain unchanged. Do not use wellbeing notes as a clinical assessment. Sensitive notes stay local unless a player separately chooses public posting.

Visual production priorities: (1) native portrait and desktop Tea Room staging, a communal table and independent seats, warm lanterns, clear paths and an unobstructed conversation area; (2) 12–16 fully illustrated playable identities, including directional walking, sitting, clapping, greeting and activity-specific poses; use selected identity throughout; (3) animated celebration with grounded hands and natural reactions, varied residents who enter and leave, accessible reduced-motion behavior, no fake visitors; (4) illustrated gratitude keepsakes and optional share cards with explicit privacy choices; (5) real moderated community setup, append/paginate posts, opt-in presence, mutual friendship only with consent, no location tracking or private messaging at launch. A remembered face is local recognition, not mutual friendship. Prioritize full mobile/desktop screenshot and interaction tests over more destinations.


## Final art acceptance standard (26 November)
Owner rejects simple visible vector substitutes, even when gameplay works. Empty space in a room is welcome; lack of visual craft in the character, furniture, objects, games, collectible and result art is not. The required aesthetic is nostalgic, hand-painted Japanese animation-inspired watercolor/gouache, with tactile surfaces, coherent soft light, intentional composition and restrained typography. Use original painterly raster artwork for visible hero assets, layered transparent character/prop sprites for movement and contact, and appropriate native portrait and landscape arrangements. SVG/canvas geometry may implement invisible targets, effects or temporary fallbacks, but must not be counted as completed art.

Art production sequence: (1) distinctive avatar identity sheets with consistent full-body poses; (2) Tea Room actual seated groups, wood furniture, ceramics, apron/garment folds and natural light; (3) tarot table, deck, card faces/back, share keepsake illustrations and journal; (4) arcade machines, goldfish stall, prizes and grounded scoop gesture; (5) remaining anchor interiors, scenery and activity props. Reuse artwork only when silhouette, lighting and perspective fit. Review every exported result on actual phone-sized preview and full image, including 1/3/5 cards and EN/ZH. No final approval before actual rendered review. Stop accumulating procedural visual drafts in lieu of final artwork.


## Player experience refinement (owner approved, 27 November 2026)

Pawradise should become more alive and cohesive, not bigger. Extend the existing curated destinations rather than adding new maps, repetitive games, currencies, obligatory tasks or generic menu screens. The owner has approved making the following concrete implementation priorities part of the standing continue workflow, subject to the existing hard release gates.

- **Living scenery (LIFE-AMBIENCE-01):** distinct environmental motion and lighting appropriate to each existing district/room; passing travellers, shopkeepers preparing or serving, quiet seated guests, seasonal variations. Reuse painted assets where appropriate; keep independent motion layers and real depth, subtle timing, reduced motion and performance constraints.
- **Resident attachment (LIFE-RELATIONSHIPS-01):** optional authored bilingual interactions with local, bounded memory of player choices and earlier encounters. Grandma may remember a favourite drink, Auntie may recall a prior generic workplace complaint, a familiar traveller may return. Never persist private vent or birth text for banter; fictional residents are clearly fictional. No pressure to chat or grind affinity.
- **Distinct activities (GAME-DEPTH-01, STORY-DEPTH-01, READ-01):** prioritize fully playable temple, Worry-Free Pier and kitchen slices before expanding. Temple is a coherent ritual journey; pier has responsive physical input and humorous outcomes; kitchen has meaningful recipe choices, feedback and mistakes; arcade has fair skill-based prizes; park has distinctive animal behavior and trust; My Room has satisfying placement and expressive furnishing; assessments have understandable nonrandom scoring; Parallel Lives has truly distinct endings. Do not revive retired activities or add new destinations. Keep the existing curated game plan authoritative.
- **Optional discovery (DISCOVERY-01):** subtle surprises, rare authored fictional encounters, hidden cats or keepsakes and seasonal/environmental variations in existing accessible locations. Tie meaningful discoveries to the existing collection/passport systems. No compulsory secret hunt, streak penalty, fake visitor, arbitrary reward loop or paid service.
- **Coherent interface (UX-COHESION-01, UX-DESKTOP-01, UX-SIGN-ART-01, UX-SIGN-LIVE-01, UX-FLOW-01):** all visible states belong to the same painterly world. Choose independent mobile and desktop compositions and appropriate controls, not enlarged mobile cards. Reuse quieter painted materials and commission missing assets only after inspecting the existing repository. Include nested menus, all results, purchases, empty/loading/error states, navigation, dialogue, labels and typography. Eliminate redundant clicks and restore the actual prior room or parent state.
- **Player-loop acceptance (QA-PLAYER-LOOP-01):** review full normal-input first and repeat visits, not just isolated functions. Inspect actual rendered scenes with both languages and supported viewport sizes; assess visual coherence, discoverability, interaction clarity, meaningful outcomes, emotional tone, persistence and repeat value. Record screenshot evidence, defects and fixes. Continue until existing activities meet the standard; do not confuse asset import, code checks or deployment with final acceptance.

Keep all existing IDs, saved items and progress. Prioritize actual implementation and visual verification over expanding the task count. New tasks supplement, not replace, existing actor, room, signage, furniture, desktop, localization and QA workstreams. Maintain the existing hourly schedule and cooperative resource leases. Where a scene or asset is blocked, continue another independent actionable task.


## Connected holiday journey and world continuity (27 November 2026)

The four existing districts form an optional circular railway holiday, not four unrelated levels. The suggested emotional progression is: leave reality and work behind at the station; settle and reflect in Fortune Valley; let go of stress and find company on Lazy Island; enjoy food, play and ordinary comforts in Munch & Play; explore perspectives and possibilities at Discovery Station; return to Fortune Valley or visit a favourite place again. This is environmental and character-led storytelling, not a mandatory quest sequence. A traveller may stay, skip, revisit, or go to My Room without finishing all activities. Do not make the story depend on a private disclosure, belief or assessment result.

WORLD-STORY-FLOW-01 must reconcile names and route directions across signs, station, Explore, passport, dialogue, arrival notices, keepsakes and saved visits. Each station belongs after the last main attraction along its authored route; name the actual destination before boarding, show a continuous train journey with recognizable scenery, and arrive at a believable grounded entrance. Distinguish returning to the valley from leaving the game; make returning to a favourite room or district discoverable. No second holding page or mandatory all-shops gate. Connect local activities through natural entrances, resident guidance and callbacks rather than arbitrary extra menus. If a destination, activity, sign or narrative transition makes no sense, redesign, consolidate or retire it within the existing curated product and preserve all saved items, IDs and progress. Review complete normal-input journeys in both languages and across devices, including voluntary detours, cancellations, return and repeat; fix visual and story discontinuity before acceptance. Keep the permanent scene direction and overlap rules in GAME_EXPERIENCE_STANDARD.md.
