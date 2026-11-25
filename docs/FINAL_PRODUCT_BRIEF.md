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
