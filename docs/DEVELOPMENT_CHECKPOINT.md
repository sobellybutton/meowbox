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


## Map, park and original directional art continuation (27 November 2026)

Seven further provisional implementation outcomes: 33/100 code-level tally (9 supplied accepted baseline + 24 implemented awaiting full acceptance). The original numbered ledger is still unavailable; this is not 33 fully accepted items. Preserve all earlier IDs.

| ID | Outcome | Evidence |
|---|---|---|
| MAP-NPC-01 | Pedestrians follow bends of traced walkable paths across four districts. | 450699f, targeted path checks |
| MAP-NPC-02 | Actual movement controls facing, with direction hysteresis and stable idle orientation. | 450699f, targeted orientation checks |
| NPC-04 | Conversation pauses preserve route; radial spacing and varied yielding reduce crowding. | 450699f, guest roster and ten combined pedestrian checks |
| UX-LABEL-01 | Valid displaced labels retain their anchor; invalid anchors use retry delay instead of frame-by-frame reset. | b87f294, code checks; visual review pending |
| PARK-01 | Six deer in scene including three distinct named encounters; selected foreground deer is not duplicated in herd. | b87f294, 221 combined identity/exchange assertions |
| PARK-02 | Old deer returns to its herd slot before new deer approaches; pause and reduced-motion behaviour retained. | b87f294, same suite; 202 existing deer geometry checks |
| ART-04 | Original pink-haired player front and right walking sequences, eight recovered WebP frames, mirrored left through existing renderer. Foot anchor uses measured silhouette bottom. | Original contact sheet inspected; workflow 45939339995, job 140309796937; deployed runtime manifest updated with original SHA256 values. Full motion acceptance pending. |

Browser regression for 5ee959c: shrine organic journeys, share exports and screenshot capture passed; main run stopped at obsolete Back selector. Selector and revised active assessment expectations corrected without skipping gameplay checks. Pages, entrance and consultation succeeded on 450699f. Subsequent deployment and full browser verification must be checked. Original candidate frames for other avatars remain blocked where clipping was detected. No new synthetic artwork, changes to save keys or claims of completed parallax. Continue remaining original artwork, physical room interactions and full visual acceptance.


## Follow-up: full browser regression and remaining traveller frame review

Latest prior commit 0fc5771: Pages and entrance passed. Browser run [45939588481](https://github.com/sobellybutton/meowbox/actions/runs/45939588481) passed visual capture, Chromium/WebKit shrine and share jobs; main browser failed on noticeboard replies on all three viewports. Added explicit native disclosure activation and keyboard/touch regression checks; browser confirmation is pending. Extended recovered sprite review workflow to all four original travellers, with per-frame edge flags, measured sole anchors and contact sheets. These are staging and verification changes; no unreviewed frame activated and no new art accepted. Provisional 33/100 remains unchanged until outcomes are verified. Review the new workflow artifacts and correct flagged original crops before installing any remaining front/side sequence.

## Original traveller and claw continuation (27 November)

- ART-05/06: integrated 16 original front/right frames for the cap-wearing and blond travellers, f6619dc. Contact sheets inspected, all sixteen alpha bounds clear, per-frame sole anchors and original hashes retained. Existing left mirroring and back frames preserved. Pages deployed. Bespectacled traveller withheld: first side frame faces the wrong way and other frames show visually cut hair; no replacement or motion acceptance claimed.
- BOARD-01: 4f1a922 replaces failing notice reply disclosure with native buttons, aria-expanded, session expansion by notice ID, and refresh focus/scroll preservation; Pages and entrance regression succeeded. Full browser run 45961770598 queued at inspection.
- CLAW-01/02/03: pause claw animation and prize-tray clock for hidden/covered screens without double shifting; reject stale/covered drops and moves; add precise aim steps, nearest plush readout, native controls and keyboard aiming/drop. Targeted pure helper checks passed; physical cabinet art and browser touch/keyboard review pending. No new art created in this batch.
- Count remains provisional: original 100-item ledger unavailable; 39/100 code-level tally (9 baseline + 30 implementation outcomes), not 39 accepted. All six new outcomes await full visual/browser acceptance. Do not treat test-only or documentation work as completed product features.


## Quiet ritual and collectible timing continuation

- RITUAL-01: shared active clock for moon blocks, fortune stick fall and pickup, keeps visible animation intervals across hidden tabs and covered views; stick shake deadline moves with its fall clock.
- RITUAL-02: incense prayer clock replaces duplicated pause logic, binds accessible controls to exact run and stage, and retains normal ritual sequence and reward.
- RITUAL-03: bell and rinse timers pause, guard inputs against covered or wrong activity.
- BOX-03: blind box reveal clock pauses and award is guarded by active opening and visible game, retains existing purchase and prize rules.
- 35 focused clock and action ownership checks passed; source and test scripts parse. Full browser verification, visual rituals and character art remain pending. Provisional tally 43/100, baseline 9 accepted, original ledger unavailable. No new painted art or acceptance claimed.


## Paper ritual, notice archive and Town Square toolbar continuation (27 November 2026)

Provisional implementation tally: 46/100 (9 owner-supplied baseline + 37 committed outcomes); fully accepted baseline remains 9/100. Original numbered ledger is still unavailable. Three further outcomes await real-browser and visual acceptance.

| ID | Outcome | Evidence |
|---|---|---|
| PAPER-01 | Paper preparation and strike animation preserve active elapsed time across hidden tabs, dialogs, transitions and other overlays; existing impact/reward occurs once, and the new run cannot inherit an old pause. | e537cd8; 11 combined focused assertions passed; persisted tests 3f9ca00. |
| BOARD-02 | Previously loaded notice archive depth persists through language changes and returning to the board; bounds apply when more notices arrive. | e537cd8; focused paging assertions; browser archive-depth regression d593595. |
| BOARD-03 | Keep actual page toolbar, title and subtitle outside the illustrated Town Square notebook, restoring direct-child language/back controls rather than silently moving them into the notebook. | db0cfee; focused header-placement check passed; direct toolbar and language regression 4c8f560. |

Prior run [45961770598](https://github.com/sobellybutton/meowbox/actions/runs/45961770598): all 15 helper/build steps and the four-village doorway test succeeded; visual capture, share exports, WebKit and Chromium shrine/organic journeys succeeded. Main browser smoke failed on the direct-child language selector on three viewports after notice expansion and keyboard controls had passed. The notebook wrapper used Element.matches with :scope against each individual child, not the parent, so the toolbar was incorrectly reparented. The new browser tests use exact accessible language buttons and verify the direct toolbar remains in place.

New startup and test scripts parsed; two embedded workflow JS blocks parsed. The 11 new pure helper checks and one mocked header-placement check passed; the first 16 existing action-refinement checks also passed in the connector harness. Full local helper run was blocked by an empty connector response for src/extensions.js (large file); no complete local build or new browser/deployment pass claimed. Push-triggered Actions are not exposed by the current commit workflow lookup, and combined status returned no checks. Inspect latest main CI and screenshots before acceptance.

No new artwork integrated in this continuation. Preserve the three reviewed travellers' existing frames. Remaining bespectacled traveller crops, distinct resident/cameo art, physical pose art and independent railway foreground layers still require recovery/repair and actual visual inspection. Do not advance the accepted count from automated results alone.


## Cat care continuity and original sprite archive inspection

Provisional implementation tally: 49/100 (9 owner-supplied baseline + 40 committed outcomes), not reconciled to the missing original numbered ledger. Fully accepted baseline remains 9/100.

| ID | Outcome | Evidence |
|---|---|---|
| CAT-01 | Feed, water, rest, petting, play and return motion use a shared active clock rather than advancing during covered or hidden gameplay. | d7962ef; 24 phase/clock assertions. |
| CAT-02 | Accessible stroke and feather alternatives complete only after visible active play, not a background timeout; stale buttons cannot initiate a new session. | d7962ef; focused ownership/timing assertions, persisted 62ca49f. |
| CAT-03 | Cancel interrupted physical drags without reward, clear pointer capture on interruption, resize, blur, exit or replacement, return the animal to its resting position when appropriate. | d7962ef, b09238f; cancellation assertions. |

All 35 new cat-care helper assertions passed. Recovered the complete extensions source via its Git blob (the file-content endpoint returned empty), enabling the full action-refinement helper suite to run successfully in the connector harness. The room-life/scoop, visual-stage-fit and painted-action helper scripts also passed; startup and extensions parse. The browser smoke now checks a detached care control, a real overlay during assisted petting and resumption (8b3898c); its execution is not yet verified. No local browser/build or new Pages result claimed.

Inspected all four original down and four alternate left frames from player-1-batch-1.zip. Alternate left-facing sequence has a visibly cropped fourth hair silhouette, and the fourth front frame has a flattened hair top. Do not activate these sequences or substitute copied frames without a corrected source and motion review. Existing player 1 back sequence and other three travellers' installed art are preserved; no new artwork was integrated. Remaining illustrated poses, room staging, visitor art, railway foreground layers and actual screenshot/playback acceptance stay open.


## Owner escalation: entrance/map visual mismatch and tarot continuity

Owner reports the entrance image looks wrong, traveller zooms towards the middle/sky rather than walking along the path, and all four maps still appear old. Directly inspected the actual repository raster images: entrance is an autumn timber mountain gateway, while Fortune Valley is a vivid spring cherry-blossom shrine village and the other three district scenes are the prior painted coastal village, food street and observatory village. Confirmed the active source still selects the following legacy map assets:
- Fortune Valley: assets/art/039.webp (ART.valleyClean)
- Home: assets/portrait/salted-fish-island.webp
- Island: assets/portrait/food-and-fun-street.webp
- Wonder: assets/portrait/wonder-valley.webp

The recovered redesign concept boards are not production map layers. Library search located the existing Multi-Device Visual Blueprint, World Journey and production/asset boards; do not crop a board or a UI mockup as a playable background. Four new independent clean map paintings and a matching entrance are still outstanding. For each, trace physical path/door footprints, spawn/exit anchors and signs, camera extents and foreground occlusion before switching active artwork. Keep the four existing district IDs, activities, save keys, and routes. Prioritize this owner escalation above further unrelated gameplay breadth; no visual acceptance until actual device screenshots/playback have been inspected.

| ID | Outcome | Evidence |
|---|---|---|
| TAROT-03 | Keep deal, shuffle, close-up and active flip timing across interruptions; do not save a covered reading. | 5177e3f, targeted tests. |
| TAROT-04 | Bind all drawn card targets to current session, stage and orientation. | 5177e3f. |
| TAROT-05 | Keyboard navigation/selection with drawn selection outline, number-key reveal and focus escape. | 5177e3f; 32 combined focused tests. |
| ENT-03 | Trace a shorter approach on the foreground stone paving, moderate size change, disable inherited CSS zoom on departure, remove second forced map walk. | cf8a6e9; 606 added gate path samples across six viewports. |

Persisted tests in 022cecd and e453442. Full action-refinement and room-life/scoop helper scripts passed in connector harness; 32 tarot checks, 1829 gate/identity/movement checks including 606 new gate samples. New browser CI/Pages unavailable via commit lookup at inspection; actual entrance playback still unverified. No new map or gate artwork integrated. Provisional tally 53/100 (9 baseline + 44 committed outcomes), still not reconciled to original ledger. Accepted baseline 9/100 unchanged. Do not count source artwork inspection as a new artwork deliverable.


## Owner correction: Fortune Temple, lucky cat forecourt and ritual scenery

Owner screenshot showed mixed flat and painted artwork, oversized ritual objects, visitor overlap with activity stations, a speech bubble obscuring the temple and inconsistent actor scale. The owner reiterated the agreed scene-first Japanese temple journey and game references (Shin chan: Shiro and the Coal Town, Animal Crossing, Classic Pokémon, MapleStory and other spatial games). Canonical temple sequence from the recovered design boards: gate → lucky cat forecourt → purification → incense offering → Guanyin hall → fortune sticks → moon blocks → fortune slips → tie or keep → quiet garden. No mandatory forced completion of optional rituals. Every nested scene must be individually considered, not a generic background with floating objects.

| ID | Outcome | Evidence |
|---|---|---|
| TEMPLE-01 | Use the recovered original painted hall as the room itself on decoded-art visits; register its actual altar, cabinet and doorway, eliminate duplicate painted objects, revise physical footprints, approach points and compact station plaques. | 2fe69b3, 68 focused checks. |
| TEMPLE-02 | Normalize keeper height to player-relative scale, limit temple visitors to one with quiet floor waypoints, and reject ambient speech overlapping stations, labels or visitors; suppress automatic speech while approaching an activity. | 2fe69b3, 809a5bc. |
| TEMPLE-03 | Replace flat inner scenery with existing inspected temple hall/approach paintings for sticks, moon blocks, prayer, slips, rack, bell and basin. This is provisional shared art, not final dedicated clean ritual plates; overlays and actual hand/prop contact still need visual inspection. | 2fe69b3. |
| TEMPLE-04 | Connect actual temple entrance to recovered lucky cat approach with separate optional cat greeting and physical step-by-step hall arrival. Pause movement during interruptions; preserve actual hall entrance and existing visit/save keys. | 809a5bc, 336 focused route/camera assertions. |

Tests persisted in 3ea2f8c; full action refinement, room life/scoop, stage geometry and painted-art helper suites passed in connector harness; both large sources parse. d43501b adds actual doorway, cat approach, hall arrival and screenshot browser regression. Latest full browser run and deployment not verified. Recovered paintings were visually inspected as files, not rendered game screenshots. Forecourt/hall uses existing portrait art; dedicated landscape compositions and complete clean ritual plates are still required. A slow artwork load can still use the old entrance/hall fallback. Actual temple/garden/fortune-stick sequence visual acceptance remains outstanding, including walking and sitting poses, tool contact and uncluttered garden placement. Do not declare the full shrine flow finished.

Provisional outcome tally 57/100 (9 baseline + 48 committed outcomes); original numbered ledger unavailable. Accepted baseline remains 9/100. All four district maps are still older production art and need independent new map layers and door/path registration; prioritize this and the remaining temple/garden visual work over adding unrelated game breadth.


## Temple journey continuation and admission reliability

New main commits 1ab8336, 0fbdb60, e942f1b, c0ce038 and eef7dfe extend the previously installed painted hall and lucky-cat forecourt.
- TEMPLE-06: first cat encounter per forecourt visit now calls the existing persistent cat-memory and blessing system. Repeated taps in the same visit cannot count as multiple visits; existing reward threshold and save keys unchanged.
- TEMPLE-07: after the player picks up the numbered stick, the same number is retained through optional moon-block confirmation. Walk to the moon-block station in the hall; receive the matching fortune after one settled toss, or skip confirmation. No result prevents receipt. Existing standalone moon ritual stays available.
- TEMPLE-08: paper opening, tying and keeping use active time across interruption; guarded paper actions.
- TEMPLE-09: reuse the recovered painted wishing-garden background in the rear garden rather than the generic park. This is an interim shared painting, not a new dedicated rear-garden plate. Existing koi, seating and chime coordinates have not received visual acceptance.
- TEMPLE-10: wait for both recovered forecourt and hall paintings before admitting the player at the actual village doorway; a failed load allows retry and a stale request cannot force entry after the player walks away or changes scene. No silent fallback to the old flat temple on ordinary doorway entry.

137 journey/cat/paper and 14 admission helper assertions passed; full action-refinement suite passed using actual current startup and extensions Git blob in connector harness. Source syntax and both embedded browser test scripts parsed. Browser smoke now tests same fortune number after optional confirmation or direct receipt and no repeated forecourt cat credit. Browser execution and live Pages deployment not verified in this session. No new commissioned scene artwork, cat unboxing packaging, or four-map replacements installed. Dedicated fortune-stick/moon/paper/rack plates, independent garden art, painted hand poses, actual in-game mobile/desktop screenshots and owner acceptance remain open. Provisional tally 62/100 (57 prior plus 5 outcomes); owner accepted baseline remains 9/100, original ledger unavailable.


## Owner recheck: physical temple return and visual acceptance (27 November)

Owner reiterated that repeated code-level completion reports did not match visible gameplay. Re-read the current main source, controlling product brief, game experience standard and status; Graphify was indexed at bb86920, older than main be894e8 at inspection. Main source, not the index, was used for edits.

- c132075: forecourt has visible bilingual native alternatives for greeting lucky cat, entering the hall, and returning to the valley. The hall Back control walks the avatar to the hall entrance, restores the same forecourt at the upper landing, and allows an actual reverse route along the traced steps. Route ownership, cover handling and controls are scoped to the current visit. Existing per-visit cat reward rules are preserved.
- 06ee406: numbered fortune handoff no longer disappears if an overlay interrupts the two-frame handoff to the moon-block station. Queue only when the hall is ready; if an active route is interrupted and stops, restore the same original sticks state and number, allowing confirmation or direct receipt. Deliberately entering another activity cancels the route.
- 85f055d and 7539884 persist 728 route/interrupt assertions and 11 handoff assertions; complete action-refinement helper suite passed against current startup and extensions source in a connector harness; both JS sources parsed. b3bdb0c extends the existing organic doorway browser regression to native controls, reverse temple exit, and screenshot capture. Actual browser execution, visual inspection, and Pages deployment on these commits are not verified.
- No new map paintings or clean ritual close-ups installed. Search of prior artwork located reference boards and UI concept compositions, not a verified clean complete set of the four playable map plates. Do not crop reference boards or pretend older runtime maps are the redesign. The existing entrance/map mismatch, all four map replacements, dedicated temple ritual art, physical poses, interface artwork, other room art, real mobile/desktop visual review and owner acceptance remain open. These are the next priority over isolated helper counts. Preserve user data and four destinations. Keep the provisional implementation count separate from acceptance; original numbered ledger still unavailable.
