# Development status | 25 November 2026

Baseline 1b61befb4bd1f41a01e81fc250dc6ed6dac147c4. Baseline deployment confirmed. Prior complete run on 02296bf: entrance/activity tests passed at three sizes; 40/56 doorway checks passed. Desktop canvas intercepted signs; small mobile Personality Lab and tall mobile Kitchen failed. 1b61bef addressed stacking and sign placement. Test run 45561937190 still running at extraction time; check it before claiming success.

## Next priorities
1. Confirm doorway regression and migration boot; fix actual failures.
2. Native portrait room illustrations, coherent camera and character full-body walking/reaching/kneeling/sitting/eating/drinking poses.
3. Temple and fortune stick collection, tarot art/reading, physical koi throws, cooking and bubble tea, arcade gameplay and NPC depth.
4. Relationships, rare events, passports and collectibles, real shared community noticeboard with moderation.
5. Extract embedded art into independent cacheable image files; load by scene. This refactor reduces AI context waste, not web payload.
6. Visual screenshot review and real touch/drag tests; many activity smoke tests call functions directly and cannot establish visual quality.

Canonical source is src; original legacy chunks only supply art. Preserve existing save format and visuals. Graphify may not index all symbols or infer dynamic calls. Test history: https://github.com/sobellybutton/meowbox/actions

## Doorway regression follow-up (25 November, 2.50 pm SGT)
- Browser run 45561937190: 47/56 doorway checks passed. Nine timeouts remained (360px Fortune tarot/destiny; 390px Island kitchen/arcade/mystery and Wonder quiz/story; tablet Wonder quiz/story). All desktop doors and three entrance/activity smoke-test viewports passed.
- Source extraction commit ecf79ea deployed successfully; its browser run 45563148079 was still in progress when checked.
- Commits 6f30467 and 9bed04d separate overlapping sign rectangles, avoid interactive HUD controls, prioritize the nearest door, and require a 44px minimum tap target. Commit 9e02e76 makes the test identify intercepted taps separately from route failures and uses exact door IDs.
- These changes are committed, not yet confirmed by completed browser tests. Inspect latest Actions results, including screenshots, before declaring the regression fixed. Watch for sign placement jitter and frame-time cost on slower devices; no visual approval yet.

## Stability and quality follow-up
- Deployment at 3a31d5c confirmed; latest full browser tests still running at time of review. Run 45563633484 had 46/56 doorway passes: 10 mobile/tablet taps failed to start their route after hit-target checks. Commit 9ce6f56 captures the pointer gesture by stable door identity, freezes placement during a press and limits DOM sign layout to ~30Hz. Requires fresh browser evidence.
- Fortune stick collection and topic-aware tarot changes at bdf436c / 3a31d5c passed combined JavaScript and test script parse checks, awaiting interaction results.
- Consolidate reading collectible naming and migrate older saved rewards without duplication. Reduce non-animation UI polling to 2–10Hz, avoiding repeated text writes. No measured FPS/load-time gain claimed; startup artwork extraction is still pending.

## Artwork loading refactor
- Extract all 62 original WebP images into assets/art; use external paths for production and preserve embedded export mode. Lazy cache for canvas images and three portrait destinations. Remove nine legacy chunk requests from startup. Build validates each image byte-for-byte and both game variants for syntax. Visual/interaction tests and real cold-load measurements remain outstanding until CI and live checks complete.

## Touch navigation and startup measurement follow-up
- Completed run 45565828367 on 28fa5c4: build and entrance/activity smoke tests passed at 360px, 390px and desktop; only 38/56 doorway tests passed. All 18 failures were touch routes not starting (6 small mobile, 9 tall mobile, 3 tablet); desktop 14/14. Deployment 45565827330 passed.
- e77d24e changes doorway gesture handling: preserve the native click fallback, suppress duplicate click only after successful activation, clear cancelled/lost captures, disable touch scrolling on the sign itself. No claim that the bug is fixed before browser CI.
- cc807c3 uses Playwright locator.tap (real touch with actionability/stability checks) instead of independently obtaining a potentially stale bounding box. Adds pointer-event traces on route failures and per-viewport cold entrance readiness and resource transfer measurements on the local CI server. These are CI measurements, not real-world mobile network benchmarks.
- Both modified JavaScript files/test scripts parsed before commit. Review latest workflow run and screenshots; full visual and device testing still outstanding. Do not start a broad art redesign until navigation is reliable.

## Recurring villager relationships
- d3c7d7c: Four recurring villagers (Temple keeper, Auntie Mei, Wang Laoban and Mochi) have individual bilingual greetings, three conversation choices, remembered topics, returning-player dialogue and unique keepsakes. Their friendship progress is stored locally and shown in the passport; repeated topics do not increase friendship. Existing rotating cameo encounters remain intact.
- 2a94a7e: Browser tests exercise actual dialogue buttons, duplicate reward prevention, passport display and persistence after reload on two mobile sizes and desktop. Syntax checks passed, browser results still pending. NPC placement/appearance and physical conversation staging have not been visually approved.

## Verified navigation and physical food preparation
- Browser run 45570975236 on 2a94a7e: 56/56 door taps passed across 360px, 390px, tablet and desktop; all three entrance/activity/NPC smoke test viewports passed. Deployment 45570988318 passed. Tests use actionable locator taps, with test setup positioning the player near each door; long free exploration and real device browser checks still outstanding.
- Cold entrance readiness on local CI: 265ms (360px), 229ms (390px), 247ms (tablet), 249ms (desktop); 19 resource requests, 14 artwork requests, 1,591,865 resource transfer bytes. Not a production network benchmark.
- 253c43c: animated tea pitcher and pour, draggable pearl scoop with cup target and tap alternative, live shake feedback and kitchen backdrop. c8300fd and 83838cf together render recognizable produce in ingredient dishes while preserving drag targets and vegetarian substitutions.
- b0bf83d and 3ec44dd: browser CI now uses actual touch/mouse gestures to select tea, drag pearls, shake, sip, drag ingredients and stir soup. Source/test syntax passed; latest build, interaction results and visual approval pending. Do not assume earlier pass covers new changes.

## Claw cabinet refinement
- d72ae1d: Claw machine now has distinct aiming, lowering, closing, lifting, carriage travel and release phases. Prize selection matches displayed plush locations with a 21 world-unit tolerance; unsuccessful attempts award nothing and get escalating bilingual reactions. Collection happens after the chute delivery. Existing plush save keys retained; no paid currency.
- a13ff7c: Browser CI now tests a missed grab, successful centered grab, visible lift phase, no premature prize and a single delivered prize using real touch/mouse aiming and the lower-claw button. Source and test scripts parsed, latest browser tests and screenshots still require verification.
- Food update 180d5d5 deployed successfully; the 3ec44dd navigation regression step passed. Full physical food smoke test outcome must be checked separately. Graphify was indexed at 253c43c before this edit; current GitHub source was checked for later overrides.

## Verified physical gameplay and temple character pose
- 3ec44dd run 45574457032 passed the full suite, including physical tea and soup gestures. a13ff7c run 45575324373 passed all doorway and activity steps, including actual claw aim, miss, lift and delivery on mobile-small, mobile-tall and desktop. Claw deployment 45575354784 succeeded.
- 0297bec fixes a concrete animation disconnect: prayer computed kneeling, bow and reach values but rendered a standing side-view sprite instead. Prayer now uses the articulated pose with those values; the held incense follows the returned wrist position. Shared pose renderer clamps reach to a plausible arm length, with connected elbow and rounded joints. Existing avatar head/identity preserved. This is a procedural pose correction, not a new illustrated sprite sheet.
- 29ba9fc uses actual taps for incense and bow, tests the incense prerequisite and captures reach/bow screenshots. Syntax parsed; latest full browser run and visual review remain pending. Portrait interior art, authentic illustrated character poses and other visual requirements remain unfinished.

## Fortune stick interaction continuity
- 230d3c4: selected avatar is drawn beside the bamboo cup with a reachable grip while the player shakes; cup responds to drag direction, and the launch has a distinct shake then fall sequence. Removed the disconnected floating-prop feel without replacing the existing artwork.
- 9a9b915: tapping the fallen stick now starts a short approach and pickup animation before opening the matching paper. The reward is granted only after pickup, with a state guard if the player leaves. No changes to fortune numbering or save keys.
- b0d96c8: browser checks verify the pickup stage and absence of premature reward, and capture a pickup screenshot. Syntax checks passed; the latest temple and stick browser runs are pending, as is visual inspection. The earlier prayer deployment 45576497163 succeeded. This is still procedural animation, not new hand-painted character art.

## Temple regression repair and tarot inspection
- Temple runs 45576461293, 45576918962 and 45576940364 failed; all 56 doorway cases still passed. Activity errors included a frame TypeError reading x during incense reach. Source inspection found a later drawRitualPose assignment replaced the articulated renderer and returned undefined. d9cb373 removes that stale override and guards the incense wrist coordinate access. Latest repair requires browser confirmation; do not report the earlier failed prayer/fortune suite as passing.
- eae7bfa increases the spread and single-card sizes and adds an animated in-room focus state for inspecting a revealed card, with meaning and return controls. Returning preserves the spread, flipped cards and journal. Existing externally loaded classic tarot artwork and local fallback are unchanged; no claim of new artwork or verified remote availability.
- 603f9ef adds physical card focus and return tests and screenshots. Source and test JavaScript parsed; latest browser and visual results pending. Native portrait interiors and newly illustrated sprites remain outstanding.

## Confirmed temple and tarot interactions; first portrait interior
- 603f9ef browser run 45577813208 passed all doorway and activity suites, including the prayer regression repair, physical stick pickup and tarot focus/return. Pages deployment 45577833077 succeeded.
- 4ce8024 adds an original 800x1400 SVG reading-room composition with landscape-view window, curtains, bookshelves, floor and lanterns. Mobile Tarot House room and activity backdrops use the full image with contain framing; desktop retains existing artwork. The SVG is inline and lazily requested, requiring no external image fetch. This is a first vector draft, not final painterly artwork. No other room backgrounds are replaced.
- 8327ba4 checks the actual portrait image dimensions/load and captures mobile screenshots. Source/test scripts parsed. Latest browser tests and visual review pending. The remaining rooms, all-direction illustrated character sprites and visual consistency still require substantial work.

## Temple and Destiny House portrait drafts
- 8327ba4 browser run 45581334659 passed all steps, including portrait Tarot House load and tarot interactions. Pages deployment 45581358229 succeeded. Visual inspection remains outstanding.
- be2c176 adds distinct 800x1400 original SVG compositions for temple and Destiny House. Both are lazily loaded inline, use full-image mobile framing, and retain existing desktop art. Temple ritual backdrops (except the separate secret garden) use the new art; Destiny House form hero also uses the portrait composition on narrow screens. Existing chart calculation and data handling unchanged. These are vector drafts rather than final painterly illustrations.
- f79e6a5 adds mobile image dimension/load assertions and a Destiny House room screenshot to browser tests. Source/test syntax passed; latest test and deployment results not yet confirmed. The form hero itself was not independently tested in this change. Graphify index was behind main, so the effective source was verified directly.

## Batch portrait coverage
- c91ef58 adds twelve native 800x1400 vector compositions for wishes, park, secretGarden, fish, kitchen, arcade, tea, office, mystery, quiz, story and match. These use the existing portrait cache and full-image framing; all existing desktop art and gameplay controls are retained. Room and activity draw wrappers provide the portrait backdrops, including fallback paths without a dedicated background painter. All twelve are draft vector art, not final hand-painted illustrations. Existing DOM-only experiences (e.g. wishing pool and other pages) retain their own layout.
- b79aa2a adds mobile load/dimension assertions and screenshots for all twelve. Source and CI JavaScript syntax checks passed. Latest actual browser outcomes, performance, visual inspection and deployment require confirmation. The previous temple/destiny Pages deployment 45585180501 succeeded; its full browser tests were still pending when checked.
