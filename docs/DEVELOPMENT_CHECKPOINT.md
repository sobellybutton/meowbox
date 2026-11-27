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


## Owner screenshot repair: ritual rendering and physical garden (27 November, 18:27 feedback)

The five supplied phone screenshots show the old duplicate altar, missing hand contact, giant flat fortune table and cup, floating outdoor bell, duplicated cartoon garden pond and bench, and clipped fortune-choice buttons. The recovered hall, approach and garden WebP originals were fetched from main and inspected directly. They are single paintings with existing furnishings, not blank stage backdrops.

- 95287be / 60e8dd7 / b66ac37 / 04354d6: one painted Guanyin altar; separate incense supply on the existing right counter, correct flame and offering anchors, carried sticks with visibly separated tips and sleeves meeting their grip, selected avatar's directional walking, and placement into the painted burner. Removed old prayer overlay from the effective path. Station signs now use short bilingual actions: Rinse hands/净手, Offer incense/上香祈福, Ring bell/敲钟, Draw a fortune/求签, Cast moon blocks/掷筊, Rear garden/后院.
- 2688475 / 60e8dd7: replace the giant generic table and cup in sticks/moon scenes with the painted hall at the same coordinate scale; use a small isolated texture from the original painted bamboo tube for the carried cup, number on fallen stick, pickup animation; moon blocks on painted right tabletop. Replace hanging bell in torii stair scene with a small supported stand on hall floor. Keep gesture IDs, ritual timers, outcomes, fortune numbers and save keys. This bell stand and hand/contact art are interim; dedicated painted bell pavilion, clean ritual closeups and original articulated character poses still required.
- b66ac37 / 04354d6: use the existing painted garden pond and bench, remove overlay fish/pond/bench, animate feed food and ripples, attach a small chime to existing eave, walk along authored paths to the three actions, hold same station on repeat feeds. Original painted koi remain static; independent painted animated koi and seating pose require further production. The garden paths have not been visually inspected in the running game.
- Latest pre-existing screenshot repair also stacked the two fortune buttons on narrow screens; a6a90f1 adds actual browser bounding-box checks and screenshot capture after each incense pickup. 088c508 checks garden actions via real controls instead of directly mutating state. 5cc9400 / a17e170 persist 920 stick/bell timing and 795 garden path assertions, with 1805 viewport/pond assertions updated. The complete action-refinement helper suite executed against current actual source in connector harness, source and two embedded browser scripts parsed. No new real browser result, screenshot inspection, or live Pages deployment confirmed: commit status and PR-filtered workflow lookup returned no checks. Do not mark the screenshots fixed in production or claim final art acceptance until visual evidence. The water station, fortune paper/rack visual composition, full map/entrance redesign and other app screens remain open.


## Mandatory owner acceptance rule and live journey check (27 November)

Owner requires end-user quality across entrance, all four maps, all rooms and activities, four dock tabs, and every nested interface. No NPC covering labels, overlapping/floating props or icons, clipped controls, mismatched or reused unfinished artwork. Implement, play through, visually inspect, fix and repeat; do not present code-only completion. c24fe89 installs this rule in AGENTS.md. Existing hourly development task was updated to apply it; cadence unchanged.

A separate live browser session at https://sobellybutton.github.io/meowbox/ used real visible controls to sign a ticket, choose traveller, choose visit motive, ride the arrival train, enter Fortune Valley, tap Fortune Temple, walk through the forecourt into the hall, collect three joss sticks, light them, bow three times, offer incense, return to hall and proceed to the folded fortune slip. It reported 1920x993 desktop viewport despite mobile request. This confirms reachable functional steps on the revision served to that session, not final canvas artwork, mobile, or exact latest deployment. No inspected rendered screenshots or measured frame motion from that session; number match and garden/full return were not independently confirmed. Do not claim these as accepted.

5ad5807 unifies actual station plaque and guide action names, adds localized native controls for open/keep/tie/read other fortunes/return, and clears stale resident arrival greetings at activity start. be3b6f4 persists 81 state/ownership checks; 9a49ae8 adds browser checks using real slip controls and viewport bounds. Entire action-refinement suite passed using current startup and extensions source in connector harness; latest full browser run/Pages status not verified. Four map artwork replacements, final dedicated ritual art and hand poses, remaining activity visuals, bottom-tab redesign, mobile/desktop screenshot review and owner acceptance remain open. No accepted count increase.


## Item 1 execution contract (owner requested)

Read [ITEM_1_WORLD_IMPLEMENTATION.md](ITEM_1_WORLD_IMPLEMENTATION.md) before changing entrance or outdoor maps. Commit 3dcc351 records verified current asset paths, base station coordinates, retired office doorway and still-active boba doorway, proposed per-map spatial/art requirements, effective source integration points, stable item-1 IDs and rendered acceptance gates. No new map artwork or runtime changes were delivered by the specification; all item-1 acceptance gates remain open. Existing entrance tests use reduced motion only; normal-motion playback and new map geometry require actual review. Prioritize matched gateway and Fortune Valley vertical slice, then three remaining district replacements. Preserve current save keys and reachable gameplay.


## Item 1 execution: first journey and map presentation (27 November)

Owner requested execution without further plan narration; internalize the steps, then commit and verify. Actual changes this session:
- 17bad269 / 8cf96ce8: visible-time initial railway journey, auto arrival, genuine pause/skip, pause the real canvas scenery, directional first railway panorama, cancel interrupted gateway walk rather than admit on hidden/stale screen.
- adc05bbd: station art in the traveller/intent screens, grounded full-body preview and optional travel intention. The station art is reused from existing recovered assets, not new map artwork.
- c17f701c / de070382: immediately reproject world plaques when camera moves, cache DOM blocker measurements, reserve actual actor bounds, remeasure after viewport/language changes, compact horizontal text and frame-synchronized plaque update. Latest rendered plaque change not yet verified.
- Concurrent main changes b2620cf7 / 76d27a77 observed; retained them. Normal/reduced-motion entrance regression extended by concurrent change. beb3a1d persists 1011 first-journey clock/direction/ownership assertions. Current startup and extensions parsed; rail-fish helper harness passed its eight basic checks, 3428 ground/window, 104056 motion, 2440 layer, 3010 scoop, 16232 direction and 1011 first journey assertions; nested arcade script was not executed by this harness. Full CI and latest deployed revision not verified.
- Actual browser, 390x844: inspected station, ticket, avatar, motive, train, gate, Fortune Valley and travelled via Explore journal/boarding controls to home, island and wonder; all four saved scene transitions worked, Chinese ticket name survived language switch, selected avatar 2 and name persisted, rail pause stopped canvas travel and resume auto arrived. Screenshots explicitly showed old map art, autumn gateway versus spring valley, vertical/cramped Chinese plaques, arrival overlays and other stray visual details. Later live fresh EN session showed station-backed avatar and optional motive screen, both inspected. At that fetch the live startup did not yet contain pawMapSignFinishCss; no claim that newest plaques, latest gate recovery or desktop have passed. Current live art assets inspected directly: all four older backgrounds and the mismatched gate remain.
- Still open: all four independent replacement map paintings, matching gate, new art-calibrated geometry/door thresholds/foreground masks, complete door-and-return paths, pedestrian safe lanes, camera and sign playback on newest revision, native device/desktop/bilingual full acceptance. No suitable independent new map paintings located in Library (concept/asset boards only). Container cannot resolve github.com for direct git transfer; connector text writes work. Do not substitute old or composite art as final. No accepted count increase.


## Manual continuation: initial railway loading recovery

Commit c1ae152 adds a five-second visible/unpaused scenery-loading threshold with bilingual recovery guidance and existing skip-to-arrival control. A decoded scenery selection starts the actual journey clock; transient scenery replacement no longer freezes its elapsed duration. Hidden and paused time is excluded. Source parsed and 143 focused assertions executed against the actual new helper in the connector harness. Actual browser replay and current CI/Pages deployment remain unverified; no visual acceptance or map art completion claimed. The replacement gateway and four map plates remain outstanding. Continue from latest main and coordinate with the hourly automation by checking current file SHAs and preserving concurrent commits.

## Shared runner handover (27 November 2026)

Owner clarified that all implemented and tested work should be committed promptly, so manual and scheduled sessions do not recreate it. AGENTS.md coordination rule committed in cca69f08. Hourly automation remains enabled at minute 11; manual continuation is additional, not a replacement. Initial railway recovery source c1ae152 confirmed in current main; the exact 143-assertion regression is now preserved in scripts/test-first-rail-recovery.cjs (6a5b7c1), executed successfully against current GitHub source in a connector harness. Run `node scripts/test-first-rail-recovery.cjs` in a checkout; CI integration, rendered browser replay and deployment verification are still pending. Do not redo the completed helper implementation or count this test/documentation as additional gameplay. Continue with unresolved entrance/map art and rendered acceptance. No additional artwork was created in this manual session. Do not advance accepted count.

## Doorway route continuity and Graphify handover

MAP-05: 6564b826 prevents repeated taps on the pending doorway from restarting the walk and uses fresh queue identity to re-ground redirected doorway routes even if their canonical pending ID is unchanged. 555edd9a persists 110 passing helper assertions in scripts/test-door-replan.cjs, source parsed. Both commits are on main. Browser/CI/Pages verification and new map artwork remain open; no accepted count increase. Graphify returned indexed bb86920, behind current main; use its small-budget dependency/caller/test queries to locate code, then check only the relevant current source and final overrides. Owner requested close collaboration with Graphify to reduce redundant repository reads. Record new durable engineering notes when useful, but GitHub main remains authoritative and Graphify memory intake is not a source commit or a published note.


## Dock root navigation continuation (27 November 2026)

UX-01: 12a0f891 changes the actual startup source so Explore, Today, Town Hall (noticeboard root) and My Room can switch directly using the existing four dock controls on safe root pages. The current tab is a no-op rather than rebuilding it. Nested pages, room/activity/entrance/transition states, editing, home opened from another parent, text focus and unfinished text drafts retain contextual navigation and suppress dock switching. Root pages reserve safe-area scroll space beneath the dock; labels now use Town Hall / 小镇广场, with provisional tighter dock styling. Source parsed and 45 pure ownership/guard assertions passed; 93ef6aa7 preserves scripts/test-dock-root.cjs. The live browser explicitly checked the served inline source and found no pawDockRootChoice, so it was an earlier deployment and no current rendered layout or user journey was verified. Commit status and PR-filtered workflow lookup had no results. UX-01 is tested at helper level only; final dock artwork, full nested interface presentation, actual mobile/desktop interactions and deployment remain open. Workstream leases released; hourly schedule unchanged. No accepted count increase. Next: recheck deployed script, then test root switching, draft protection, scroll bounds, keyboard and both languages before acceptance. The independent replacement gateway and four map paintings remain outstanding.


## Master Yue input and privacy continuation (27 November 2026)

READ-02: d92587d1 guards current full-chart submissions against incomplete/invalid birth date, time, selected birthplace, UTC offset and coordinates before legacy rendering. An unfinished form retains the explicit birthplace (including an intentionally empty selection), custom coordinates and time through language switches. New entries require known birth time and actual birthplace; no assumed noon/Singapore. Editing removes the old rendered chart while preserving the previous valid in-memory profile until a replacement succeeds. Added directly accessible clear-current-reading controls and private/permission notes in the consultation subject strip; the other person's profile remains separate and sharing of their chart stays disabled by existing rules. Source parsed and 38 focused helper checks passed. 3ca5e3d8 persists checks, cc9b848d extends phone/desktop browser regression, 8caa7e9c makes the workflow build current source and run the input checks before browser tests. Browser regression parsed but execution/CI result and latest Pages deployment not independently verified. Full chart conventions and artwork unchanged; no claim of astrological prediction or final visual acceptance. Workstream released as tested (helper level). No accepted count increase. Next: run Chromium/WebKit and inspect actual rendered phone/desktop consultation, verify draft privacy and layout, then continue independent world art/remaining activities.


## Grounded outdoor NPC yielding (27 November 2026)

NPC-01: c9bd1521 adds short, speed-limited, path-constrained retreat steps when a resident is already too close to the player or another NPC. Candidate movements must not decrease existing unsafe gaps or enter another actor's clearance radius; if no safe movement exists, the resident waits. The player remains unrestricted, and covered screens, transitions and conversations stop resident motion. 59325c23 preserves walking animation during actual yielding and avoids candidate sampling when no crowding exists. Current source parsed and 120d246b persists 2,208 passing geometry assertions, executed against the actual current helper source in a connector harness. These are not rendered gameplay tests. Final sprites, signage overlap, actual movement through all four districts, mobile/desktop review, build/CI and deployment remain unverified. Workstream released as tested at helper level; no accepted count increase. Continue with rendered NPC/label verification and the independent map replacement artwork.


## Physical activity input ownership (27 November 2026)

GAME-01: 3df167bd guards the actual accessible controls for moon blocks, fortune sticks, bell, water, soup and blind boxes against stale run/phase/action, detached DOM buttons, hidden controls, page/transition/talk/visibility blocking. Fortune slip bypass also requires a connected visible control; no duplicate award or altered physical rules. 7dc677bc persists the helper regression; current source parsed and focused ownership assertions passed. The live browser confirmed the previous dock, Yue and NPC helpers are present and no startup errors were observed, but the latest activity guard was not yet served. Browser returned 1920x993 despite mobile request; subsequent normal-control desktop journey timed out. Session closed; no rendered acceptance claimed. Workstream released at helper-tested stage. Keep current deployment/actual touch and mouse tests, artwork and full physical activity acceptance outstanding. Owner requests concise reports without test counts; retain details here rather than repeatedly reporting counts. Hourly cadence unchanged.


## Tarot keyboard and reading integrity (27 November 2026)

READ-03: b503e517 gives all five spread cards the same keyboard access as the single and three-card spreads. The number-key action respects reveal animation time; revealed five-card details use their correct existing positional interpretation instead of the legacy three-card focus flow. Saved/share snapshot rejects duplicate, out-of-range and malformed cards, normalizes topic and tone, and copies only card identifiers and orientation. Five-card archive/reward cannot run during a covered activity or before a valid complete spread. Source parsed and focused helper regression passed; 9dde6e38 persists it. Latest browser/deployment, artwork, history and share export visual acceptance remain open. Workstream released as helper-tested, no final acceptance claim. Owner prefers implementation over repeated test-count summaries; preserve detailed evidence here. Continue the outstanding art and gameplay workstreams on the existing hourly cadence.


## Selected world painting integration (27 November 2026)

Owner's 44-file ZIP transfer is confirmed by 9d71b834 and ad8b934b. Five selected map/gateway images independently recovered from the same local package and inspected with coordinate grids; f3b70d2b reconciles production tasks. 909e55c0 activates gateway and Fortune Valley art, with its actual aspect ratio, grounded entry walk, new main stair corridor, separate resident lane, arrival anchor and each doorway approach/zone/plaque. bb333138 activates Lazy Island's curved coastal promenade, 2d8eb003 Munch & Play's warm lantern street, 3743443a Discovery Station's observatory staircase; all use independent artwork and paths, matching preview thumbnails, existing district/activity IDs, actual shop hit regions, and narrower resident movement. 81e3ee7b and 751e1023 persist geometry regression scripts; source parsed and the actual helpers passed sampled route checks. All four integration records are helper-tested only. No full build, latest Pages runtime, visual or actual mobile/desktop journey has been accepted yet. Conservative door approaches are on connecting ground at the stair/patio bases; they still require actual traversal, foreground occlusion, scale and label checks against the rendered game. Do not recreate the 44 imported files. Prioritize real journey/return/boarding and art positioning verification, then integrate reviewed individual temple/room/actor candidates. No accepted-count increase. Owner wants short reports and continued execution.


## Room expansion, railway layers and exploration continuation (27 November 2026)

Owner's second artwork import is confirmed: 32/32 manifest files (28 room, 4 railway) matched paths, sizes and blob hashes on main. HOME-ASSET-01: 39875d96 + a13ca31c supply independent art-calibrated floor geometry, footprint and placement engine. RAIL-04 and RAIL-LIVE-01: 4caa3219, 3c152ffd and 845b8ee5 implement moving trackside artwork and transparent wide carriage in current railway lifecycle, with existing portrait fallback and helper verification. HOME-LIVE-01: a39375ab, 1fd6ddf0 and 05d75d5b connect 13 matching painted furniture identities and shell previews to existing room and catalogue/purchase flows without changing prices, balances, ownership, furniture coordinates or finishes. 291 source/asset/ownership assertions passed in connector harness. Actual painted floor placement editor is not activated; retain saved rooms, migrate positions only after art calibration; shelf/display cabinet anchors intentionally unchanged. WORLD-VISITS-01: f33b9633 and 38880b0f record actual entered rooms, show optional unvisited places in Explore and station departure, guard stale/hidden board/cancel input. Seventeen helper checks and source parse passed. QA-RAIL-HOME-01: a1677190 and 4fd9eea7 update real-input browser regressions for deliberate boarding and both railway renderers, plus register new helper tests in CI; browser test parses but run not verified. Live isolated browser timed out after 40 seconds. No new rendered acceptance, no accepted-count increase. Source lease now released; another runner owns temple source. Next independent tasks: full actual dollhouse floor editor and safe save migration, activity room artwork and actor integration, then current mobile/desktop gameplay and visual review. Hourly cadence unchanged.


## Painted purification courtyard (27 November 2026)

TEMPLE-WATER-01: 68a3dd0c activates the imported, independently inspected purification courtyard on a new water ritual run when loaded. Use the painted stone basin, spout and rack rather than a duplicate vector basin. The existing selected traveller stands on foreground stone; the ladle, hand, actual drag/drop zones and accessible scoop/pour controls share calibrated coordinates and retain original state, award, sound and quiet-clock logic. Stable old fallback for a cold/failed load. Source parsed, exact asset blob verified, geometry/phase regression executed; 16afa40c persists it. Actual browser input and current deployment not verified. Hand/ladle contact is interim, the other dedicated temple scene candidates and final pose art remain outstanding; do not mark temple accepted. Workstream released, no accepted-count increase.


## Independent economy, motion audio and resident content (27 November 2026)

39f30e29: ECON-01 provides read-only expansion quotes, prerequisites and optional remaining daily reward bounds derived from existing game ledger, without price changes or coin issuance. SOUND-01 provides original quiet stone/wood/sand/grass footsteps driven by distance, alternating gait, muted/hidden/overlay guards and train rhythm on the existing audio context/bus. Helper tests passed (17 economy, 25 mocked audio). 124e2b6d: CONTENT-RESIDENT-01 adds 48 distinct bilingual remarks for 16 existing fictional resident identities, stable IDs and idempotent merge tested against actual current startup content (148 assertions). All three modules and persistent test scripts are committed but not yet loaded into active gameplay. Shared runtime files remain owned by the temple workstream; next integration must respect registry lease, connect modules to current economy controls, sound preferences and ambient scheduler without creating new reward grants or timers. No rendered acceptance or new artwork upload. Hourly cadence unchanged.


## Painted fortune alcove and slip counter (27 November 2026)

TEMPLE-ALCOVE-01: 05a7ce7c activates the inspected alcove painting for the fortune-stick and moon-block rituals. Uses existing painted furniture, a small local shake of the original tube, numbered stick flight to the actual tray and pick-up, moon-block landing aligned to the second tray, and existing optional confirmation/fortune logic. TEMPLE-SLIP-01: 1c786137 activates the inspected matching counter and tied-paper rack. Folded fortune begins at the counter, opens into a readable foreground sheet, and animates to the rack or bag. Real rack paper locations, zoom, paging, accessible selection/return controls and retained original fortune state replace the duplicate rack. 4b170710 persists the combined geometry regression; source parsed and focused helper assertions passed. Actual browser visual, gestures, contact, text readability, mobile/desktop and current Pages deployment remain unverified. The imported altar lacks the agreed Guanyin statue and incense supply, so it was inspected but not activated; retain the existing hall. Bell pavilion, garden and original articulated poses still open. No final acceptance count increase. Concurrent CI repair claim preserved; temple lease released.


## Owner mobile railway feedback, 27 November 2026

- RAIL-DIRECT-01: `ecae54c4` removes the station holding page from the walking flow. A deliberate station approach now boards automatically; the Discovery Station return sign leads to the existing ring route. All four station approaches are at or beyond the last shop along the traced route. The offscreen station gets a contextual wayfinding sign when space permits. Ordinary doorway and railway approach use a short camera push, respecting reduced motion; the carriage and fallback fill the viewport without aspect distortion (intentional edge crop).
- `e432af08` updates the browser journey regression for one-action boarding and full-bleed fit; `8eaa474d` persists direct-boarding guard checks. Exact startup and test source parsed, 31 visit/boarding helper assertions executed, and all four station approaches and route order checked against the current path geometry. The actual mobile and desktop visuals, sign occlusion, camera continuity, full-screen crop and deployment remain unverified; existing artwork still lacks a visibly painted platform in some districts. Do not mark visually accepted. Progress remains in Explore rather than a station page.


## Entrance and painted purification regression continuation (27 November 2026)

ENT-GROUND-02: 4951355e explicitly allocates the station illustration stage in wide and short landscape layouts, with the header spanning both columns and the avatar stage and choices in the same row. The grounded avatar keeps its existing illustrated station, chosen identity and size cap. The stale gateway regression now checks the current selected 962×1635 painting's calibrated paving endpoints, monotonic size change and containment. Source and test parse; 2,441 focused extracted geometry/identity assertions passed. QA-WATER-02: 470aad94 updates the actual touch/mouse purification regression to load the painted courtyard, use the rendered ladle hit region and independently calibrated scoop/pour points, reject a miss and verify the painted courtyard, ladle and bell were actually drawn. Script parses; browser run not yet verified. Previous CI 46008690085 failed legacy water coordinates, gateway assertion and other browser journeys; 46008523993 reported undersized landscape avatar. Current Pages deployment, actual landscape and temple playthrough, other tarot/desktop/visual-suite failures and artwork acceptance remain open. No acceptance count increase. Both leases released. Hourly automation unchanged.


## Resident, movement sound and savings integration (27 November 2026)

MODULE-LIVE-01: 89e79176 loads the three previously prepared modules in both browser and offline build, merges all 48 new bilingual resident remarks into the existing ambient scheduler, replaces legacy time-based footsteps with surface-dependent distance-based footsteps on the existing effects bus, adds quiet train sounds during active journeys, and presents an optional savings note in the existing Paw Coin purse using actual balances and expansion prerequisites. No new currency, rewards, timers, save keys or duplicate navigation. 3462f651 guards paused/hidden/covered/muted play and date rollback, limits rail DOM queries to transition frames, and adds integrated and module regressions to CI. Source parses and extracted runtime wiring, actual resident merge, mock movement/overlay/rail controls and read-only economy tests passed. Previous Pages deployment 279e9def succeeded; latest source build, real browser playback/listening, wallet layout and NPC speech review are not yet verified. Earlier browser runs still pending at inspection. No accepted-count increase. Released lease; hourly automation unchanged.


## Imported furniture live integration (27 November 2026)

HOME-FURNITURE-IMPORT-LIVE-01: 89334473 and c8b056ac connect all 11 imported designs (board, frame, kotatsu, tea cabinet, bonsai, record player, reading chair, Chinese screen, silk lantern, porcelain vase and moon shelf) to shop, purchase confirmation, owned tray and placed room. Reviewed individual source cutouts; new floor and wall art uses bottom contact anchors, the silk lantern uses a fixed ceiling anchor and horizontal movement, with wall collision classification and mount spacing. The original catalogue IDs, prices, balances, saved items and stored positions remain unchanged on rendering; explicit player moves retain the existing save flow. Existing shelf/display cabinet/floor lantern room art retained because their physical contacts are not calibrated. Home layout projection, asset paths, placement anchors and source parse verified in connector harness. Actual mobile/desktop rendering, drag/rotate/return/interaction and deployment remain unverified. Finish textures and dollhouse shell remain outstanding. No final acceptance count increase; release task and retain hourly cadence.


## Dedicated rear garden (27 November 2026)

ROOM-02: c0afb1d1 activates inspected original 960×1631 rear-garden painting on a fresh garden visit if loaded. The actual paved route connects the foreground entrance to koi pond, bench, painted wind chime and lucky cat shrine. Existing feed/seat/chime actions, rewards and sound remain authoritative; new lucky cat visit is optional and grants no rewards. Real pond has feeding arc and ripples rather than duplicate fish; chime is part of original illustration. Uses separate contained camera, calibrated target areas, four bilingual accessible controls, route arrival and no mid-run art swap. Focused tests exercised each node/action route, pause, targets, and food animation; registered in CI. Retain old art fallback for load failure. Actual browser visual/gesture review, seat pose, current deployment and external wishing pool remain outstanding; no acceptance count increase. Released lease. Previous furniture revision d60fdea8 successfully deployed.


## Compact painted district signage (27 November 2026)

UX-SIGN-PREVIEW-02: 22101d9e uploads four inspected original wood/washi crops, with source rectangles and blob hashes. 310fb150 replaces the identical ornate plaque styling with compact Fortune Valley dark timber, Lazy Island cream/sea green, Munch & Play muted warm wood, Discovery Station indigo/brass, and distinct railway materials. Live text, stable door IDs, original wayfinding, and 44px targets remain intact. Controlled browser probes of exact new CSS at 360x640 and 1440x900 confirmed sample English/Chinese label fit and target dimensions; screenshot preview used fallback colors because new assets were not yet deployed. Pages run 46016588647 succeeded for 310fb150. Actual current in-world texture, anchor, actor clearance, all names and organic journeys still need rendered verification. Individual sign artwork and complete desktop/nested flow redesign remain outstanding. Do not count this interim design as final visual acceptance. Active garden workstream preserved; signage lease released.


## Painted kitchen and milk tea shop lobbies (27 November 2026)

ROOM-FOOD-LIVE-01: dbaa0f0a activates independently inspected 928×1648 kitchen and boba portraits during a loaded visit, with stable fallback, camera containment, actual aisle geometry, counter approach, grounded Grandma and Boba keeper, bilingual station labels, and existing visitor scheduling. Removes duplicate lobby furniture/props; existing cooking and drink activity lifecycle and earned recipes remain unchanged. Source parsed, assets verified in tree, and sampled path/counter/host/viewport checks executed and added to CI. Dedicated close-up cooking and tea preparation art, actual phone/desktop play, character contact, wide artwork and deployment verification remain open. ROOM-03 remains outstanding. No final acceptance increase. Lease released; concurrent signage work preserved.


## Visitor continuity (27 November 2026)

NPC-02: ddd0265d replaces eligible departed town guests independently when their own actor is offscreen and distant (or the map is fully covered). Continuing visitors retain their route and identity; duplicate identities and covered interactions remain guarded. 89ee7a97 adds the targeted rotation regression; current source syntax and helper checks passed in connector harness. Workstream released at tested stage. No real rendered visitor journey, artwork acceptance or latest deployment verified; no accepted count increase. Continue remaining room artwork, player flows and current browser verification. Hourly schedule unchanged.


## Indoor guest movement and dwell (27 November 2026)

NPC-03: 9e8c2e8c allows indoor visitors to retreat from existing player/resident/visitor proximity without worsening any unsafe gap. Room visitor waiting and departure retry deadlines are preserved when dialogue, overlays, transitions or suspended rendering interrupt play. 8ca85242 persists focused geometry and active dwell regression, executed against current source in a connector harness; source parsed. No actual rendered playthrough or deployment verification; local container cannot resolve GitHub. Art, contact and full phone/desktop verification remain open. Released lease; no acceptance increase. Hourly schedule unchanged.


## Painted indoor plaque clearance (27 November 2026)

QA-SPATIAL-01 partial: 5dcd182f makes painted temple, kitchen and boba labels avoid existing actor, HUD and label bounds using the entire minimum 44px touch rectangle. A blocked plaque no longer creates an invisible tap target; original station body and directory access remain. Movement is limited to small nearby offsets to preserve station association. 8a433040 adds geometry regressions across five viewport sizes and four scales; source parsed and focused helper checks passed in connector harness. Actual deployed visual and normal-input verification remains outstanding, as do other scenes and full spatial acceptance. Released claim without marking task complete. Hourly schedule unchanged.


## Room activity directory lifecycle (27 November 2026)

UX-02 partial: ed9fd2ea hides closed directory content from focus order, provides Escape and focus restoration, rejects stale room/language or detached controls, preserves focused station on language rebuild, and unifies bilingual toggle labels. Existing authored station walking/arrival callbacks are unchanged. f61bcee5 adds focused lifecycle tests executed against current source in connector harness; source parsed. Actual rendered keyboard, touch, assistive technology, layout and deployment verification remain open. Released claim without marking entire accessibility task complete. Hourly schedule unchanged.


## Continuous temple return (27 November 2026)

UX-WAYFINDING-INTERACTION-01 partial: 1cc2b251 removes the second exit tap after walking out of the hall, continuing down the authored forecourt route. Return interrupts an in-progress cat/hall approach from the current location without triggering its arrival or changing position abruptly. Repeated return commands are rejected; accessible Return remains available while approaching. 463a5c5a persists focused route interruption, blocked-state and reduced-motion regression tests, executed against current source in a connector harness; source parsed. Actual deployed phone/desktop journey, visual alignment, all other public room exits and full acceptance remain open. Released claim; hourly schedule unchanged.


## Entrance first-frame traveller readiness (27 November 2026)

ENT-ASSET-READY-01 partial: e8c17843 warms the selected traveller's directional base paintings during onboarding and railway travel, prioritizes Fortune Valley, and requires all three directional base sprites, the current map and gate painting to decode before entry. Failed readiness keeps the gate visible and offers a retry; optional action frames are warmed without requiring absent production artwork. 1e8a9977 persists asynchronous readiness and retry regressions, exercised in connector harness; source parsed. No actual cold/warm network frame capture or latest deployed verification. Resident/sign admission, later scene transitions, final directional art and complete first-frame acceptance remain open. Lease released; hourly schedule unchanged.


## Daily social task guidance (27 November 2026)

SOCIAL-DAILY-01 partial: cf700a19 identifies a nearby named fictional resident from the current outdoor roster (excluding animals and actual shared peers), gives a bilingual tap-and-converse instruction, and restores lifeFriend credit only on a chosen response in the extended fictional guest dialogue. Existing daily category cap, reward ledger and saves are unchanged. 4f1d41d5 persists the candidate and credit regression; source parsed and extracted helper checks executed. Actual human consent and shared endpoint, visible physical gestures, indoor social navigation and rendered phone/desktop verification remain open. Released claim; no acceptance increase.


## Parallel Lives decision consequences (27 November 2026)

DISCOVERY-PARALLEL-LIVE-02 partial: efc3917c strengthens eight final decision scenes with concrete tradeoffs and adds optional, distinct bilingual reflection for each of the sixteen existing endings, based on a validated four-choice route. Existing ending IDs, keepsakes, share actions, privacy and saves are preserved. 92f6f059 adds an all-branch regression, executed against current source in connector harness; source parsed. The short-film visual staging, new alternative-life experiences, full assessment redistribution and actual rendered mobile/desktop testing remain outstanding. Released claim; no acceptance increase.


## Café conversation depth and balanced result (27 November 2026)

DISCOVERY-CAFE-LIVE-02 partial: 1c673bf4 extends the existing four relational conversations to nine bilingual situations, validates input and displays all tied styles, with practical follow-up prompts, in one accessible paper reflection. Share and replay are explicit and token-guarded. Legacy collection IDs and save format remain unchanged; ties no longer present one style as the sole conclusion in the live reflection. cad793710d adds exhaustive nine-answer helper regression, executed against the current source in connector harness; source parsed. Native café illustration and staging, other relationship assessment banks, mutual consent and comparison, actual rendered gameplay and share export remain outstanding. The result-stage wrapper still requires browser review. Released claim; no acceptance increase.


## Relationship assessment venue redistribution (27 November 2026)

DISCOVERY-ASSESSMENTS-01 partial: d76e5fcf removes relationship values from the Personality Lab selection and makes it a distinct option at the café's conversation station, alongside the expanded conversation cards. Existing assessment saves and share identifiers remain unchanged. Four score-dependent, independently written bilingual reflection prompts supplement the numeric relationship priorities. da3db0c2 persists the venue-routing and score-range regression; source parsed and helper checks executed in connector harness. Complete assessment inventory, further distinct assessments, native staging and actual rendered gameplay remain outstanding. Released claim; no acceptance increase.

## Care preferences at Compatibility Café (27 November 2026)

DISCOVERY-ASSESSMENTS-01 partial: ceae5d20 adds a distinct bilingual care preferences reflection at the café with 15 balanced statements across five independent dimensions, reverse scoring, non-ranking results, consent-sensitive contact prompts and a five-row keepsake layout. Existing relationship values, personality lab and save formats are preserved. b37dc632 extends the persistent regression; source parsed and all 16,807 possible result profiles plus routing and malformed-input guards exercised in a connector harness. Actual rendered menu, assessment, export, native staging and deployment are not verified; attachment and general life priorities remain open. No accepted-count increase. Hourly schedule unchanged.

## Attachment-inspired reflection at Compatibility Café (27 November 2026)

DISCOVERY-ASSESSMENTS-01 partial: fd4fb68a adds twelve bilingual scenario statements covering uncertainty, withdrawal under stress, seeking support and reconnecting after tension. Balanced reverse scoring, three response bands per dimension, contextual safety and consent language, no diagnostic types, optional private retention and explicit four-row keepsake sharing. Existing café exercises and saves preserved. ce08c360 extends the durable regression; source parsed and all 2,401 possible result profiles, shuffled scoring, invalid inputs and distinct prompt bands exercised in the connector harness. Real browser menu capacity, rendered results, share export, deployment and complete historical inventory remain unverified. General life priorities and other curated assessments remain outstanding. No accepted-count increase. Hourly cadence unchanged.

## Parallel Lives priorities and three-workstream manual batches (27 November 2026)

DISCOVERY-ASSESSMENTS-01 partial: 05988bd1 implements twelve bilingual paired life-priority scenarios at the Parallel Lives letter station, separate from the café and existing branching story. Each of four themes appears six times and every pair appears twice; scores retain ties and total twelve. Includes four reflective prompts, result explanation and four-row keepsake routing. 0a7b0a2b persists regression covering every possible choice sequence, shuffled row order, malformed inputs and venue routing; source parsed and focused tests executed in connector harness. Native story staging, remaining historical assessment inventory, browser interaction, export and deployment remain unverified. No accepted-count increase. Owner requested three distinct actionable workstreams per manual continuation when session capacity permits; f0496ab9 records this in AGENTS.md, preserving lease coordination and hourly cadence. This interrupted continuation advanced one implementation workstream, not three.

## Three-workstream social development batch (27 November 2026)

- COMM-MIXED-LIVE-01 partial: f7345e1e hardens moderated community submissions, strict UUID/object validation, atomic same-place reply admission and expired report exclusion; 9c0c07e6 adds integration regressions. Source parses and UUID helper exercised; full SQLite Worker workflow and actual staging service not verified, endpoint remains blank.
- COMM-TOWN-LIFE-01 partial: 64235160 adds twelve authored fictional bilingual resident threads with named replies, three publication slots per Singapore day and bounded rolling history. Preserves original fictional notices and clear separation from real visitors; board refresh tracks new IDs even when count stays constant. 3820f535 adds and exercises deterministic archive and bilingual structure checks in connector harness. Source parsed; actual scroll, focus, rendering and deployment remain unverified.
- SOCIAL-DAILY-01 partial: abad3290 and 2136b4c9 enable explicit indoor resident and visiting-neighbour conversation responses to count through the existing daily friend ledger; guide works indoors, proximity gates and station priority preserved, real peers excluded. c9994a1b persists helper checks, executed against current source. Physical gesture art, actual rendered conversation and real-player consent still pending.

Three distinct workstreams advanced in this continuation. No workstream is claimed fully accepted and no accepted-count increase. Hourly cadence unchanged.


## Discovery and tarot editorial refinement (27 November 2026)

LOC-01 partial: seven targeted EN/ZH lines revised for natural humour and clarity. Existing assessment logic, IDs, saved progress and role aliases retained. Source parsed in connector harness; rendered text fit, full bilingual review and deployment unverified. Good existing dialogue preserved. No acceptance-count increase.

## Three-workstream scene transition and frame continuity batch (27 November 2026)

- ENT-ASSET-READY-01 partial: 7fdcfb2a checks selected traveller directional art before railway arrival, and preserves outdoor scenes until the actual kitchen or boba painting is decoded. Stale admission requests are canceled and failures give a contextual retry. Other rooms and actual device frame capture remain outstanding.
- SCENE-CAMERA-01 partial: cbae8dbb sequences a visible doorway camera push before the existing interior transition and removes its canvas transform at handoff, with reduced-motion and stale-context guards. Actual zoom continuity, upper-map framing and complete painted coverage still require visual review.
- PERF-01 partial: e6908e2a prevents unnecessary canvas backing-store resets when dimensions are unchanged or transiently zero, a possible contributor to mobile browser pauses. 5baafcce persists focused regression tests across all three changes; source parsed and extracted guards exercised in connector harness. The original iPhone blank-screen cause has not been reproduced or established; WebKit tests, actual frame timing and deployment remain unverified.

Three distinct workstreams advanced. No final visual acceptance or accepted-count increase. Hourly cadence unchanged.

## Valley camera, compact HUD and build regression (27 November 2026)

- SCENE-CAMERA-01 partial: be041feb clamps the Valley camera to actual vertical artwork coverage, including tall portrait screens, after character visibility correction. Source parsed and focused boundary cases exercised. Actual top/bottom composition and mobile/desktop visual acceptance still pending.
- UX-COHESION-01 partial: f34982b6 switches compact HUD from a miniature full-body sprite to existing selected-avatar indexed head artwork, with a circular frame and accessible actual wallet balance label. Painted paw coin icon, artwork identity and visual fit remain unverified.
- QA-BUILD-01 tested: exact current extensions blob 41bb6bf2 and quality-checks blob 7de2729f passed the unmodified isolated quality-check suite in connector harness, including map sign stability. No test weakening or unnecessary rewrite. Complete build/deployment CI still unverified. 2391a716 records status and releases claim.

Three workstreams advanced, two source changes and one targeted regression verified. Registry: 41 outstanding, 40 tested, 3 implemented. No final visual acceptance increase. Concurrent edits preserved; hourly schedule unchanged.


## Wishing Garden painted lobby integration (28 November 2026 SGT)

ROOM-02: 4211b656 activates the inspected recovered portrait painting in the actual Wishing Garden lobby, removes duplicate flat pond/rack geometry, adds traced central walkable lane, entry/exit and both station anchors, resident/visitor placement, painted-context labels, readiness-gated admission and portrait camera coverage. Existing coin toss and wish mechanics and saves remain untouched. fdb912f6 adds durable floor-route, bounds and six-viewport regression tests; extracted existing and new test logic passed 1,267 assertions in the connector harness (file existence independently checked through GitHub; harness stubs filesystem). Actual live source still lacked the new marker when checked; newer Pages deployment was in progress and prior runs were superseded. Need actual rendered entry, both stations, return, WebKit/touch and landscape review; landscape still uses portrait-fit fallback, activity pond itself still uses interim geometry. No final acceptance increase.


## Reviewed seven-room painted geometry (28 November 2026 SGT)

ROOM-06 partial: fc01bfeb implements standalone portrait room geometry and route/camera helpers in assets/visual/painted/interior-layouts.js for tarot, destiny, tea, pier (fish), quiz, story and match, based on individually inspected exact existing 928×1648 paintings. Includes traced safe lanes, entrance/arrival, resident/visitor feet, physical object/approach/label anchors and cover-clamped portrait framing. 244 in-memory geometry assertions passed; initial tablet crop was corrected. c969747a adds durable regression covering artwork Git blob checksums, route connectivity and viewport coverage; its filesystem-backed execution remains pending. The staged mystery artwork depicts a blind-box shop, not Komorebi Living; do not register it as the furniture showroom. No new art generated. Source integration and browser testing could not proceed while another runner owns startup/extensions/shell/browser; new module is not loaded by live game. Need verify effective station IDs (especially pier), actual contact and all activity-specific artwork, native landscape layout and deployed playthrough. No accepted-count increase.


## Five painted reading-room runtime integrations (28 November 2026 SGT)

ROOM-06 partial: 342be13ed45ad1cbde4d12811974e5b6acc92afd wires the reviewed Tarot, Destiny, Personality Lab, Parallel Lives and Compatibility Café portrait plates into startup, with lazy room admission, mapped floor/entry/exit routes, camera, host/visitor anchors and removal of duplicate geometric furniture. Existing station activities and saves retained. Exact startup source parses; 220 focused mapped-route, legacy input-bound and viewport checks passed in connector harness; c3827cc adds durable regression to scripts/painted-interior-layout-test.cjs. Actual rendered phone/desktop input, current deployment and nested activities not verified; native wide art remains unintegrated. Tea and pier need separate multi-station geometry and pier ID reconciliation; only the five reviewed single-station lobbies are wired. Keep ROOM-06 outstanding, no final acceptance increase. Pages run for the implementation was superseded; newer deployment pending at inspection.


## Painted Town Hall and dock paper surfaces (28 November 2026 SGT)

UX-COHESION-01 partial: 6982ac4c activates the individually inspected original pavilion painting (blob 4b302987) for the Town Hall page and community notices, uses the inspected separate tea painting (4a17875a) for fictional tea chat, preserves the existing live text/compose/reply/navigation logic, suppresses a duplicate front-page illustration, and uses the existing original paper texture for Today, Explore, profile and collection paper surfaces. Full-page scenery sits behind readable paper content. Source parsed and five scene selector cases executed; d72ac9c9 adds durable selector/asset checks to the existing dock regression. Dedicated additional Today/My Room backgrounds, landscape composition, actual deployed phone/desktop appearance and scroll/navigation remain open. The preceding five-room integration was included in successful Pages run 46034400830; no rendered room acceptance claimed. Current Town Hall deployment pending at inspection. No workstream acceptance increase.


## Consolidated 28 November owner artwork import and integration

All 44 owner-uploaded assets matched manifest paths, Git SHA-1 and byte counts on main; local archive independently decoded every WebP and matched SHA-256, blob SHA-1, dimensions and mode. The artwork source package is complete, not a blanket approval of every atlas or room alternative. UX-COHESION-01: 64c95ef6 integrates an optimized 48×48 painted coin (1278 bytes) in the real wallet HUD with live balance, bilingual label and decode fallback. TEMPLE-SLIP-01: 94834d40 installs ten folded/unfolded painted slips at runtime paths and displays five editorial fortune grades based on existing authored reflection messages, without changing draws, saved fortune or keep/tie mechanics; aspect-fit and live text remain. HOME-CATALOGUE-ART-02: 81dcbdae imports all eight material swatches with exact manifest IDs; room surface masks and applied perspective remain. ROOM-02: a33e1f42 aligns the existing coin-toss plane to the approved painted water and stone rim, preserves hit physics, removes duplicate geometric pond/tray, adds a localized waterfall highlight animation and reduced-motion support; 254d0294 persists layout regression. Current source parsed and targeted helper checks executed in connector; full browser run failed (browser tool unavailable to execute requested interaction), so actual deployment, physical phone and desktop visual acceptance remain outstanding. Existing lobby/alternate room artwork unchanged, no global walking-speed change. All claimed leases released; registry remains 41 outstanding, 40 tested, 3 implemented. Next: verify deployed game, exact pool input/resize and fortune legibility, home room masks, import cropped props from existing atlas files. No accepted-count increase.
