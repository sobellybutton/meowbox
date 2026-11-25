# 50-lens product audit and acceptance backlog
25 November 2026. Source-level product critique, not fifty independent playtests. The latest owner feedback is the authority. Status refers to observed source changes or unresolved acceptance, not visual approval. Use alongside FINAL_PRODUCT_BRIEF.md and COMMUNITY_AND_PLAYTEST.md.

## Release rule
A feature is not finished merely because its button works. Each lens needs a meaningful interaction, a coherent visual, a natural reason to return and evidence from actual play. Mark runtime and screenshot acceptance separately. Prioritize the full arrival → first activity → collectible → passport → hideout → return journey before adding new houses.

| # | Lens | Critique and required fix/acceptance | Status |
|---|---|---|---|
| 1 | First impression | Railway ticket must feel like an invitation, not a form. Measure time to start walking. | Device review |
| 2 | Returning player | Shrine arrival must be brief and preserve identity and progress. | Device review |
| 3 | First goal | New player must know where to walk and what they can do, without a wall of instructions. | Review |
| 4 | Navigation | Four maps, physical exits, obvious next stop, no duplicate destinations. | Review |
| 5 | Mobile joystick | One-thumb travel without accidental taps, overlaps or stuck movement. | Device review |
| 6 | Tap-to-walk | Tap signs and paths, actual collision geometry, no unreachable doorway. | Device review |
| 7 | Small mobile | All content, controls and Chinese text fit at 320–390 CSS px. | Device review |
| 8 | Desktop | Keyboard and mouse, reliable camera and readable labels. | Device review |
| 9 | Back behavior | Return to same station/door, browser Back and language changes keep context. | Review |
| 10 | Loading | Measure initial load and lazy artwork, avoid unnecessary giant downloads. | Benchmark |
| 11 | Portrait composition | Every map composed natively for portrait; no landscape zoom. | Art review |
| 12 | Path alignment | Player and residents stand on actual stairs/ground, not roofs or water. | Screenshot review |
| 13 | Occlusion | Characters pass behind foreground correctly, feet and shadows aligned. | Art review |
| 14 | Character identity | Four avatars recognizable from every direction and after changing profile. | Art review |
| 15 | Walking | Grounded directional strides, no sliding seated character. Ah Ma now has separate standing gait. | Source change; visual pending |
| 16 | Body posing | Kneeling, pushing, sitting, pouring and reaching without fake torso boxes. | Art review |
| 17 | Angry ritual host | Distinct stern face, bun, cardigan, slipper, hand contact and seated pose. | Canvas draft revised; painted art pending |
| 18 | Collision humour | One street Ah Ma scolds on close approach, seven-second cooldown; not every resident. | Source change; device pending |
| 19 | Temple rinse | Ladle and water visibly meet the hands, instructions match steps. | Review |
| 20 | Bell | Tall bell and striker, physically convincing swing and sound. | Review |
| 21 | Prayer | One coherent ritual, no generic pose overlays, optional quiet pause. | Review |
| 22 | Fortune sticks | Shake, fall, retrieve, open matching paper. | Review |
| 23 | Moon blocks | Tumble and display correct orientations and outcome. | Review |
| 24 | Wishing pond | Strength matters, visible trajectory/landing, swimming fish and funny misses. | Review |
| 25 | Tarot | Attractive original deck, proper flip, one or three cards, readable meanings. | Art/content review |
| 26 | Zi Wei Dou Shu | Verify independent chart references, limitations, meaningful follow-up. | External validation pending |
| 27 | Personality | Distinct original quizzes, meaningful scores/ties and clear entertainment framing. | Review |
| 28 | Stories | Branches feel consequential; no filler dialogue. | Playtest |
| 29 | Villain hitting | Clearly visible target, response timing, escalating reactions, auntie coaches, never targets real people. | Source humour/art draft improved; playtest |
| 30 | Bottle/shout | Private input, satisfying visible release and clear return. | Playtest |
| 31 | Cooking | Ingredient selection, actual stirring, convincing ladle and final meal. | Playtest |
| 32 | Bubble tea | Readable labels, meaningful preparation choices, distinct animation. | Playtest |
| 33 | Claw | Fair skill, readable controls, mastery reward earns room trophy. | Reward wired; playtest |
| 34 | Rhythm | Timing, difficulty curve and replayability; not repetitive tapping. | Playtest |
| 35 | Animal trust | Individual temperament and recognition, optional gentle gestures. | Playtest |
| 36 | Cameo recognizability | Original celebrity-inspired silhouette, distinct mannerisms, no actual likeness or endorsement. | Dialogue added; unique art pending |
| 37 | Cameo variety | Different location, time and context; rotating guest jokes and repeat recognition. | Daily rotation implemented; deeper variants pending |
| 38 | Comedy writing | More sharp punchlines, less polite filler; EN/中文 culturally adapted. | New Ah Ma, weather/civic/office roasts; remaining scripts audit |
| 39 | Topical humour | Match in-game weather and daily context; fictional civic satire, no invented current real-world claims. | Weather-context source change; real-news system absent |
| 40 | Noticeboard | Editorial comedy distinct from public posts and private notes; avoid fake users. | Six new threads; real service pending |
| 41 | Chat | Natural, contextual, funny, clear companion/public distinction. | New topics; public backend pending |
| 42 | Profile | Editable nickname and avatar without clearing save or replaying intro. | Source change; device pending |
| 43 | My Hideout | Actual furniture placement, rotate/remove, editable atmosphere and private links. | Source change; visual pending |
| 44 | Bag | Collection distinct from room; clear origin, rarity and useful display. | Room link added; art/content review |
| 45 | Stamps | Four visually distinct stamps; tap opens rewards; locked destinations have travel link. | Source change; device pending |
| 46 | Paw currency | Real optional cosmetic use, understandable balance, no real money or duplicate spend. | Source change; logic checks passed |
| 47 | Progression | Increasing achievement difficulty with genuine rewards and no repetitive XP farming. | Seven decoration unlocks; tune and playtest |
| 48 | Accessibility | Readable touch targets, focus, keyboard, reduced motion, safe areas, no trapped overlays. | Partial source controls; device pending |
| 49 | Privacy/safety | Private notes and birth data never silently shared; public chat moderated before launch. | Backend pending |
| 50 | Regression QA | Combined JS parse, actual organic desktop/mobile flows, reload, screenshot review, deployment. | Parse/isolated logic only, newest live result unverified |

## Concrete changes in this batch
- The engine's older room decorator had been superseded by a later Bag override. Restore separate My Hideout via profile HUD and Bag, preserve avatar and item saves, keep old furniture as migration source. Furniture can be dragged, moved by keyboard, rotated, added and removed, with five room themes, profile editing, private notes and saved reading links.
- Four distinct stamp illustrations, tap-to-open stamp HUD, seven achievement decoration unlocks, visible clues, display/put-away actions, two optional Paw-paid themes (70 and 120 virtual paws). Existing earned coins are the base; purchase IDs are stored once so repeat selection does not charge again. No daily grind, no paid currency.
- Add one street Ah Ma in Lazy Island within the existing path corridor, a standing gait distinct from the seated ritual host, six close-approach lines with cooldown, six general roast topics and in-game weather-sensitive lines. Revise the ritual host's canvas art with stronger face, bun, apron, seated legs and wrist-held slipper. Add seven ritual reactions, six bilingual board threads, weather and fictional civic satire chat topics.
- Commits 2e10327 and 15c5c21; combined engine/extensions/startup JS parsed. 26 isolated reward, balance, bilingual and weather checks passed. This is not a rendered browser test. No actual current-world government/weather commentary feed is wired. Draft vector/canvas art is not final painted artwork.

## Next release priorities
Run the organic hideout/rewards/arrival walkthrough, capture screenshots at small mobile and desktop, test drag and profile changes after reload, ensure HUD does not overflow, and tune collision on real path geometry. Add original painted Ah Ma and cameo sprite sets, then complete ritual/kitchen/arcade art. Keep each critique open until evidence supports a pass. Do not report this document as a finished 50-person review.
