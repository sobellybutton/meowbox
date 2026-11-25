# Product review and ChatGPT Work handover

Owner feedback from 25 November 2026. Read this alongside [AGENTS.md](../AGENTS.md) and [STATUS.md](STATUS.md). This is the development brief, not a claim that the product is complete.

## Direct player feedback (open until visually verified)

| Area | Owner's observation / request | Required outcome |
| --- | --- | --- |
| Bronze bell | Bell appears too short. | Taller, substantial temple bell with suspended striker, convincing swing and resonance. |
| Water pavilion | Not clear how to play; animation looks odd. Asked how Japanese people perform the ritual and whether simple hand washing is sufficient. | Simplified, culturally informed temizu: scoop, rinse left and right hands, return ladle; clear guidance, graceful water motion. |
| Prayer altar / other activities | Weird object/overlay on the character when bowing; similarly awkward figures in minigames. | Replace awkward procedural poses and detached props with coherent illustrated character poses and quiet ritual animation. |
| Returning players | Unclear what the level means, whether it is necessary; later requested harder level progression. | Meaningful increasing XP milestones, distinct achievements and optional mastery challenges, no repetitive farming; preserve saves. |
| Tarot | Asked if three or five cards necessary; cards/presentation look odd. | One daily card, three-card deeper reading recommended; no five-card mode without benefit. Refine artwork, table, dealing, flip, readable text and closeup. |
| Destiny House | Unclear difference between Master Yue and Birth Chart. | Distinguish conversational guidance from technical chart generation; explain chart through character, review calculation limits. |
| Traveller's bag | Looks plain; improve graphics. | Illustrated keepsake pouch/scrapbook, categories, rarity, origin, stories, achievements, inspection; meaningful passport. |
| Entry and labels | Avatar covers words and starts in middle every time a house is entered. | Enter from appropriate doorway/foreground, approach stations naturally; labels never obscured; verify actual overlap. |
| Back navigation | Asked for better wording than Step Back. | Back outside / 出门逛逛; Back to room / 返回小屋; contextual labels. |
| Bilingual copy | Audit both languages, retain funny element. | Natural English and Chinese with culturally adapted jokes; one language at a time; no clipping. |
| Stress relief | Let Off Steam is unclear; does not know where to click. | Obvious paper target and explicit WHACK / 打走烦恼 action; satisfying feedback. |
| Rant Wall | Prepopulate messages. | Funny fictional town posts visibly present, private venting kept private; real shared community board separately. |
| Forgetful Pier | Wording unclear. | Worry-Free Pier / 忘忧码头; clear fishing and bench interactions. |
| NPC/celebrity cameos | Would like to chat with celebrity-inspired guests; questioned why anyone would enter a room just to chat with an NPC. | Surprise fictional parody encounters during actual activities; optional branching stories, useful clues, unique discoveries, rare cameos. Never pass scripted dialogue off as real celebrity responses. |
| Daydream Park | Better wording than pet a pet; next-stop label so players can travel to next map. | Make a furry friend / 找个毛茸茸的朋友, park activities and an obvious Next stop / 下一站 shortcut. |
| Bubble tea | Words too long and cannot see them. | Short readable labels, real mobile screenshot checks. |
| Grandma's Kitchen | Soup scoop too short. | Longer, properly proportioned ladle and convincing stirring/serving. |
| Claw machine | Still needs refinement. | Satisfying arcade experience, readable controls, skill and collectible variety. |
| All games | Some are lame; review whether each has a meaning. | Audit every game as a player; remove, merge or redesign weak activities; meaningful replayability over feature count. |

## Product direction

A mobile-first relaxing escape for working adults, not a set of websites or static panels. Mature Japanese watercolor illustration and continuous animated town exploration. Native portrait artwork for all maps and interiors, not cropped landscapes; current interior vectors are drafts and need substantial visual improvement. Existing selected avatar must remain consistent from front, back and side. Natural entry, movement and interactions; no floating props or detached limbs. New players enter through illustrated railway ticket, name and character choice; returning players still arrive through shrine entrance. Preserve existing saves, artwork, four destinations, Home / Passport / Bag / Map navigation.

Review all activities and every room for clarity, aesthetics, humor, satisfaction, purpose and replayability. Casual relaxation remains free of pressure; harder optional achievements offer depth. Do not treat a passed code test as evidence of attractive visuals.

## Implementation priorities

1. Fix actual regressions, room entry / label overlap, unreadable text, temple figures and confusing controls. Inspect screenshots at small and tall mobile sizes and desktop.
2. Redesign rituals (bell, water, prayer, sticks, moon blocks, wishing pond). Koi toss retains strength-dependent trajectory, visible landing, swimming koi and funny misses. No real currency. Keep fortune content reflective rather than deterministic.
3. Tarot: improve card artwork, proportions, shuffling, dealing, flip and reading. Daily 1 card; deeper 3 cards. Destiny House: separate Ask Master Yue from Generate Birth Chart; check Zi Wei Dou Shu and Western astrology assumptions and clearly disclose limits.
4. Improve cooking, bubble tea, claw, blind box, rhythm and fishing. Actual ingredient recipes, long ladle, realistic food/drink gestures, vegetarian option on lunar first/fifteenth, skill-based arcade, collectible sets, rare catches and feedback. Review existing minigames for enjoyment and meaningful goals.
5. Introduce optional fictional celebrity-inspired encounters (e.g. palace-drama parody Lady Clocked Out / 甄摸鱼, Mr Raincheck / 王家卫班, Uncle Offchip / 黄不忙), recurring jokes, clues, story branches, affinity, memorable keepsakes, natural fishing/tea/bench encounters rather than generic chat rooms.
6. Progression: higher levels substantially harder; achievements across diverse activities, rare discoveries, mastery and set completion. Avoid repeat chat/tap XP farming. Unlock meaningful cosmetics, rare items, secrets and stories. Existing saves must not be reset. Current XP draft derives from unique inventory and visited maps; verify balance and add meaningful unlocks.
7. Redesign bag/passport as illustrated travel memories with categories, real item artwork, locked clues, rarity, provenance, stories and milestone records. Avoid bland generic grid.
8. Full bilingual localization audit: natural EN and 中文, Singaporean/Chinese workplace humor, pop-culture parody, clear instructions; verify switch in every active page, not only initial menu. Improve titles/labels wherever awkward.
9. Rant Wall and community: starter fictional posts plus local private venting exist. Genuine shared anonymous noticeboard requires backend, moderation/reporting, privacy and abuse safeguards. Do not misrepresent local notes as shared. Explore free hosting/backend; disclose limits. Never upload private wishes, unsaved rants or birth details.
10. Replayability: rotating dialogue, weather, seasons, optional daily activities, rare encounters and collectible combinations without grind.

## Current implementation snapshot

At source commit f302231 (25 Nov 2026), previous work is already on main:
- Physical cooking/tea gestures, claw animation, NPC friendship memory, repaired temple rituals and fortune pickup, tarot enlargement/return.
- All 15 listed main portrait room views have dedicated vector drafts for mobile; desktop art retained. Portrait batch browser run 45586194189 passed, Pages run 45586221530 succeeded. Separate DOM experiences and final hand-painted art remain unfinished.
- ef52255: revised bilingual room names, stress relief target/WHACK button, six starter Rant Wall notes, fictional cameo topic choices and revisit memory, soft navigation.
- 6d2c3f5: added tests for bilingual labels, rants, stress tap, travel shortcut and cameo dialogue.
- 37620ca: Next stop shown in rooms as well as villages (hidden during activities); deferred HUD setup to startup. Pages deployment succeeded.
- f302231: short kitchen placards, longer stir ladle, off-center entry and approach spacing, optional tighter precision claw mode with mastery collectible, escalating XP ranks (0, 40, 110, 220, 380, 600), progress in HUD and collection pages. XP is recalculated from unique items and visited destinations, excluding cameo meetings and arrival-item duplicates. This restores a visible level with harder requirements; meaningful unlocks, progression tuning and fuller tests are outstanding. Pages run 45589448372 succeeded; browser run 45589449596 still in progress at handover. Do not claim these newer features are visually accepted or fully tested.

## Acceptance / working procedure

- Start with Graphify (small scoped budgets 1000–3000 tokens), compare indexed commit to main, confirm current effective function and later overrides. Read source, not legacy encoded artwork. Respect concurrent commits and preserve save keys.
- Test actual user flows: new/returning entrance, every doorway, small/tall iPhone-sized, Android-sized, tablet and desktop; real touch/mouse actions; language switch; clear labels, save/reload and game completion.
- Inspect rendered screenshots rather than relying on syntax or automated state tests. Check no clipped text, overlaps, detached limbs, inconsistent art, slow transitions or missing buttons. Measure startup and resource transfer; emulated performance is not a real device/network measurement.
- Build with node scripts/build.cjs and run browser CI. Confirm actual results and Pages deployment. Record screenshots/evidence and explicit blockers. Keep [STATUS.md](STATUS.md) current.
- Batch coherent work, commit progressively, avoid asking for routine approval. The product must be enjoyable, polished and cohesive, not merely functional. Do not report unverified work as complete.
