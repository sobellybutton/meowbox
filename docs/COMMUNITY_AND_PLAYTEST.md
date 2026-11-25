# MeowBox community and 20-lens product review

25 November 2026. This is a review rubric and implementation backlog, not the result of twenty independent human testers. The owner has asked for proactive critique rather than repeated feature delivery without end-user review. Apply the final product brief first.

## Community design

The shared Town Square must show only actual public messages, not generated human activity. The local Tea Chat is an explicitly fictional companion experience. The Noticeboard shows editorial jokes separately from personal notes. Do not use fabricated counts, presence indicators, timestamps or reviews. No automatic public submission of private wishes, notes, birth data, avatar names or chart results.

Public service is optional and currently unconfigured: a trusted HTTPS endpoint specified by window.MEOW_COMMUNITY_API must implement GET /messages (JSON {messages:[{id,name,text}]}), POST /messages (JSON {name,text}), POST /report (JSON {id}), using anonymous bearer tokens. The client sends an independently chosen community nickname only with a public message. Before enabling public writes, implement server-side validation, rate limits, anti-abuse, moderation queue, reporting, deletion/retention, privacy notices, exact origin allowlist and operational monitoring. Do not claim a service is deployed or users are connected until verified across two separate devices. Keep chat available when quiet through the separate Tea Chat, not fake participants. Add real shared board threads and reactions after chat moderation is operational.

## Twenty distinct review lenses and acceptance checks

| Lens | Current concern / required observable acceptance |
| --- | --- |
| First-time visitor | Understand why and how to move within 15 seconds; railway ticket, shrine arrival, one clear first destination. |
| Returning visitor | Preserve nickname, avatar and progress; shrine arrival without repetitive registration; provide a quick route to desired house. |
| Mobile one-thumb player | Joystick and tap-to-walk coexist; touch targets at least 44 CSS px; no overlap with dialogue, keyboard, bottom bar or safe areas. |
| Small-screen reader | Long English and Chinese labels wrap; no text cut off in bubble tea, assessment cards, chat or buttons. |
| Desktop player | Mouse and keyboard both usable; avatar and target remain visible at all room arrivals. |
| Navigation designer | Four maps, clear next stop only where appropriate, exit to actual doorway, no surprise teleport or conflicting Back behavior. |
| Environment artist | Native portrait painted composition; NPC feet follow authored stairs and paths; walkable geometry aligns visually, no floating figures. |
| Character animator | Same selected avatar across views; believable feet, sit, kneel, bow, push, reach and contact poses; no rectangular substitute body. |
| Interaction designer | User can identify actionable object, action, result and retry without reading a long manual. |
| Temple visitor | One culturally coherent sequence, clear physical gestures, optional steps, strength-based wish toss with visible landing. |
| Tarot reader | One daily or three topic cards; attractive original artwork, physical deal/flip, distinct readings, readable meaning. |
| Astrology enthusiast | Chart logic checked against independent references; explain limitations, chart-specific follow-ups and no unsupported AI claims. |
| Personality-test enthusiast | Distinct exercises, transparent scoring, meaningful differentiation, tie handling; no diagnostic claims. |
| Casual gamer | Cooking, tea, claw and rhythm feel different; skill improves success, meaningful feedback and no dead filler games. |
| Collector | Understand paw coins, stamps, ranks and actual uses; optional increasingly difficult achievements, no repeat-click farming. |
| Community newcomer | Discover Town Square from Today; understand public vs companion space, nickname, anonymous posting and real user messages. |
| Community regular | Useful threads, funny localized prompts, reactions, block/report, real conversation continuity; no deceptive simulated humans. |
| Bilingual player | Change language in context, original culturally adapted jokes, no mixed-language interface, no mistranslation of controls. |
| Privacy/accessibility reviewer | Clear shared/private boundary, keyboard navigation, live regions, readable contrast, reduced motion, private data never uploaded. |
| QA/reliability reviewer | Build, actual organic walkthrough on mobile and desktop, refresh/save, browser Back, slow connection, public service failure and screenshot inspection. |

For each release mark each relevant lens as pass, fail or not tested, with actual evidence. A syntax check is not a gameplay pass. A critique is incomplete unless it produces a fix or a recorded blocker. Do not add more activities before existing activities pass their relevant gates.

## Current changes

Commit b6a557d adds Town Square tabs, an optional real-chat client, public/private copy, conversation prompts and more topic replies, editable local traveller nickname and an explicit Paw coin label. It preserves existing items and avatar saves. Syntax parsing of extensions.js succeeded. No live service, public board, real online presence or actual browser/visual acceptance was verified in this batch. The existing wall remains editorial content and personal notes remain local. Older geometry and pose changes remain subject to image and device review.

Next: confirm latest CI; fix any UI regression; wire a moderated public service and test two independent devices; then audit all activity flows and finish art/pose production. Prioritize actual rendered screenshot evidence over additional generic content.
