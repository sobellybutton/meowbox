# Pawradise development checkpoint

Updated 27 November 2026. Source revision: `0a5c2a24b1400d7deadbb8c65fb1b4edb25b4496`.

## Count and continuity

Owner supplied baseline: 9/100 accepted. The exact original numbered 100-item ledger was not found in the repository; do not fabricate its IDs or infer acceptance from the historical status log. This checkpoint assigns stable new IDs to the substantive changes below. Ten additional implementation outcomes are committed and have targeted verification; none is yet promoted to fully accepted against the visual/browser standard. Provisional code-level tally is 19/100 (9 baseline + 10 new), conditional on reconciling the original ledger. Accepted baseline remains 9/100; 91 acceptance items remain, including these ten. CI repair, documentation, reviews and commits are not counted as product improvements.

## Newly implemented, pending full acceptance

| ID | Player-facing outcome | Source commit | Verification |
|---|---|---|---|
| RAIL-02 | Recovered route panoramas move monotonically in one direction, including extended arrivals. | c6fc37f | 16,232 directional timing assertions |
| RAIL-03 | Select recovered panorama once within bounded load budget; keep existing carriage glass moving if unavailable, avoid midride switches. | c6fc37f | Rail/fish suite, source parse |
| ARCADE-01 | Rhythm countdown and beat timing survive covered and hidden game interruptions. | 70e6329 | Arcade clock tests |
| ARCADE-02 | Rhythm rejects invalid, repeated and premature input; keyboard respects focus and modifiers. | 70e6329 | Arcade input tests |
| BOX-01 | Return unopened selected/shaken box to shelf before any coin spending. | 70e6329 | Prepurchase cancellation tests |
| BOX-02 | Covered blind-box interactions are guarded; accessible shake/open controls follow stages and clear on exit. | 70e6329, 0a81d7d | Arcade checks and room-life suite; browser interaction pending |
| TAROT-01 | Selection binds to the exact displayed deck and orientation; stale callbacks cannot select a different card. | 0a81d7d | Five deck guards, room-life suite; exact-card browser regression pending |
| TAROT-02 | Expose only one-card and three-card tarot paths; old five-card data remains readable. | 0a81d7d | Source parse and reading flow regression pending |
| PERSONALITY-01 | Remove obsolete Soul Cat launch option without deleting historical results or saved data. | 0a81d7d | Source parse; visual menu verification pending |
| INPUT-01 | Generic canvas gestures track pointer and scene/activity/state ownership; secondary/right-click, lost capture, resize and interruption cannot finish stale gestures. Includes tea scoop, indoor walk and pet-care entry. | 0a5c2a2 | 13 ownership/context checks; actual browser pointer ordering pending |

## Verification evidence

- Pages deployments: [c6fc37f](https://github.com/sobellybutton/meowbox/actions/runs/45927578015), [70e6329](https://github.com/sobellybutton/meowbox/actions/runs/45927711179), [0a81d7d](https://github.com/sobellybutton/meowbox/actions/runs/45927894420), all successful.
- Entrance visual regression workflows [c6fc37f](https://github.com/sobellybutton/meowbox/actions/runs/45927578556) and [70e6329](https://github.com/sobellybutton/meowbox/actions/runs/45927712211) succeeded. Chromium entrance job on [0a81d7d](https://github.com/sobellybutton/meowbox/actions/runs/45927895067) succeeded; WebKit in progress at inspection.
- [Master Yue consultation](https://github.com/sobellybutton/meowbox/actions/runs/45927712142) succeeded at 70e6329.
- All changed source/test scripts parsed. Actual source helper suites executed in connector runtime with mocked filesystem/DOM interfaces as appropriate. All 27 existing guest personality profiles passed after fixing the test extraction boundary; no new guest art or personalities counted. Rail/fish and room-life helper suites passed; arcade 26 and shared pointer 13 checks passed.
- Previous smoke runs reported obsolete guest extraction, old rail motion expectations, and a tarot selected-card mismatch. Corrected extraction, motion expectations and rendered-card coordinates; do not mark full smoke suite green without a completed run on the latest source.
- [Latest source browser workflow](https://github.com/sobellybutton/meowbox/actions/runs/45928123077) and [Pages deployment](https://github.com/sobellybutton/meowbox/actions/runs/45928122583) were pending at inspection. Multiple earlier smoke jobs were superseded. No independently inspected new screenshots or actual multi-touch run; no full visual acceptance claimed.

## Remaining workstream IDs

The original 91 individual IDs are unavailable; these are newly assigned stable workstream identifiers, not a substitute numeric count. Resolve the ten pending acceptance rows above first when corresponding CI finishes. Then continue the outstanding owner-directed work below, preserving existing implementations and checking current source before edits.

| ID | Remaining acceptance outcome |
|---|---|
| ENT-01 | Verify ticket/name entry, mobile fit, desktop fit, gate arrival and returning identity visually. |
| ENT-02 | Cohesive doorway and arrival transition using approved artwork, with no static interstitial. |
| MAP-01 | Fortune map walkability, stairs, anchors, labels and visual alignment. |
| MAP-02 | Home map walkability, entrances, label and resident alignment. |
| MAP-03 | Island map walkability, entrances, label and resident alignment. |
| MAP-04 | Wonder map walkability, entrances, label and resident alignment. |
| ART-01 | Recover and review original directional character candidates; correct the 56/128 potentially clipped frames; test silhouette, foot pivot and cycle continuity. |
| ART-02 | Integrate original matching seated, standing, waving and gesture artwork with consistent sizing. |
| ART-03 | Integrate distinct approved cameo and resident sprites; never substitute geometric placeholders. |
| NPC-01 | Natural resident movement, dwell timing, varied identities and nonintrusive dialogue. |
| NPC-02 | Occasional visitor diversity and route continuity; test appearance/departure across all four maps. |
| NPC-03 | Physical NPC interaction/contact, speech placement and room continuity. |
| ROOM-01 | Temple courtyard and altar props, visual contact, ritual sequence and natural sound. |
| ROOM-02 | Garden and wishing pool layout, physical toss and landing feedback. |
| ROOM-03 | Kitchen and boba utensils, ingredient contact, preparation animations and completion feedback. |
| ROOM-04 | Arcade cabinet and fish scoop spatial layout, physical play and visible station signs. |
| ROOM-05 | Nara park/animal encounters with distinct deer/cat art, movement and behaviour. |
| ROOM-06 | Pier, discovery and reading rooms with coherent artwork, walk paths and aligned props. |
| RAIL-04 | Recover real independent transparent near scenery layers where available; calibrate true parallax and review motion seams. |
| GAME-01 | Full touch/keyboard/desktop testing of physical activities, including restart and overlay transitions. |
| READ-01 | Validate revised personality test questions, scoring, branching and bilingual output. |
| READ-02 | Validate ZWDS inputs, result display, privacy and share export on both device classes. |
| READ-03 | Tarot rendered-deck accuracy, interpretation, share template and history regression. |
| SHARE-01 | Visually inspect all active share templates, downloaded previews, ticket and text fit in both languages. |
| LOC-01 | Bilingual typography, humour, dialogue diversity, font legibility and consistent labels. |
| UX-01 | Remove redundant navigation, verify four docks, profile and all room exits. |
| UX-02 | Keyboard, focus, accessible equivalent controls, reduced motion and safe-area review. |
| PERF-01 | Measure loading, image memory, animation frame pacing and mobile rendering; avoid unverified optimizations. |
| QA-01 | Complete Chromium/WebKit organic journeys and activity tests on current main; inspect screenshots; verify current deployment. |

## Constraints

Use existing original recovered assets and manifests rather than recreate satisfactory art. No independent near railway layers were recovered; current route art is a single panorama, not true parallax. Do not activate unreviewed clipped sprite frames. Keep the Pawradise name, repository URL, save keys and historical results; BrbLife is undecided. The local execution environment cannot clone GitHub directly or run a real browser against the repository, so connector unit tests are not equivalent to visual review. Preserve existing progress and do not count test-only changes.

## Continuation: 27 November 2026

The prior source revision 0a5c2a24 deployed successfully. Its browser run [45928123077](https://github.com/sobellybutton/meowbox/actions/runs/45928123077) passed both shrine repair browser jobs (including Chromium organic four-district journey and exact selected tarot card), share exports and visual capture. The main browser job stopped at an outdated DOM mock, not a completed gameplay failure. Fixed that mock and reran the complete action-refinement helper suite successfully. Entrance regression and Master Yue consultation also succeeded. Screenshot appearance remains unreviewed.

Seven additional player-facing implementation outcomes, targeted tests passed, pending full visual acceptance. Provisional code-level count 26/100 (9 baseline + 17 new, original ledger still unavailable). No additional fully visually accepted items claimed. The previous 10 and these 7 remain tracked until acceptance.

| ID | Outcome | Verification |
|---|---|---|
| WISH-01 | Live landing preview for flick and alternative aiming, bounded physics, readable strength meter. | 63 combined wish/kitchen assertions; d1e2970 |
| WISH-02 | Single pointer, canceled stale gestures, pause across hidden intervals, reduced motion landing and koi, no artificial post-miss delay. | Same helper suite; d1e2970; real motion review pending |
| COOK-01 | Reject repeated, invalid and post-completion ingredients; reset stirring for a changed unfinished recipe. | Same suite; d1e2970 |
| TEA-01 | Ordered drink moves to guest and stays full at guest location, with visible guest through service/result. | 253 combined delivery/clock/input checks; 5ed2af1; artwork/prop hand contact unapproved |
| FOOD-01 | Pause pouring, seasoning, sealing, sipping and soup tasting on interruptions; stale recipe actions cannot mutate another cup. | Same suite; 5ed2af1 |
| DISC-01 | Assessment answer bound to exact question/session; interrupted card-turn waits for visible play, no double answers. | 9 focused assessment guards in current source; browser pending |
| DISC-02 | Previous question on desktop as well as mobile, number keys and Backspace while answering, stale previous controls rejected. | Same focused checks; browser keyboard and visual review pending |

All source changes preserve branding, save keys, existing user results, original art and URL. No new painted art produced. Remaining workstream IDs above remain open, with WISH/COOK/TEA/FOOD/DISC IDs awaiting acceptance. Do not count the CI mock repair as product work. Full browser suite for d1e2970/5ed2af1/current commit is not yet verified; earlier tests were superseded by subsequent commits. Continue with current CI failure review, actual screenshot/playback review, then original asset recovery, character art and geometry alignment; do not activate unreviewed clipped sprite frames.
