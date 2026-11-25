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
