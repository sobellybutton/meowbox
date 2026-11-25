# MeowBox: launch creative direction and execution order
25 November 2026. Owner asks for a connected product, memorable satire, visually dimensional original art, rapid launch without compromising details. Use this alongside DEEP_PRODUCT_AUDIT.md and FINAL_PRODUCT_BRIEF.md. No invented test passes.

## Product premise
MeowBox / 摸鱼小镇 is an illustrated town where adults briefly escape adulthood. The core experience is a short visit with a funny or warm story, a satisfying physical interaction, a souvenir and a reason to return. “现实世界打工，小镇里面做人” is a candidate tagline, not a locked brand decision.

## Core player loop
1. Illustrated railway ticket and shrine arrival. Returning visitors retain their identity.
2. A single visible invitation to move, with a nearby optional surprising resident.
3. Visit a retained destination; use one clear physical interaction; receive an amusing outcome.
4. Earn a distinct collectible, stamp, or virtual paws. Explain the real cosmetic use.
5. Passport shows discovery; personal hideout displays the reward, with optional themes and furniture.
6. Today offers daily fortune, free wheel, new gossip and daily guest rotation; public chat only when genuine shared service exists.
7. Share a spoiler-free funny result or postcard, optionally invite a friend. No personal information in default share payload.

## Story and character direction
Use distinct silhouettes and mannerisms, not a population of polite generic avatars.
- Grumpy Ah Ma: street shopping bag, deliberate feet and expression; near-bump scolding, cooldown, optional apology. The pier ritual host is a seated stool-side specialist with slipper in hand, paper target on a low stand, animated pointing/whacking guidance. The host is never the target.
- Belly Uncle / 摸肚叔: round silhouette, loose shirt, comic belly pat, heat complaint, then a snack recommendation. Body comedy should be affectionate, not cruel.
- Ah Zhai / 待业阿仔: between jobs, self-deprecating jokes about interview loops and applications; optional small story with meaningful choice. No shaming unemployed people.
- Kaypoh auntie, overdressed office worker, delivery rider off duty, sleepy commuter, dramatic palace visitor, student, retired uncle. Everyday personalities give the town more range than celebrity parodies alone.
- Cameos: rotate original fictional celebrity-inspired characters; unique hand-painted sprites, outfit and mannerism, two meaningful comic branches. No exact likeness, voice, lyrics, endorsement or copied franchise costume. Review names before public launch.
- Sample punchlines: “没长眼睛啊？眼睛也请年假了？”; “老板说公司是家。那我能穿拖鞋来吗？”; “今天的天气：出门蒸，回家烤。”; “开会讨论如何减少会议，讨论得非常成功。” English and Chinese should be written separately for natural humour.
- Daily newspaper: original fictional town satire, weather reacts to in-game weather, transport/cost of living/bureaucracy and work culture. Real topical satire needs verified timely facts, editorial review and clear fiction framing. Do not invent today's real government news. Real shared chat/board requires moderation and backend.

## Visual production, not flat UI
- Native portrait layered scenes: background, middle ground, walkable geometry, foreground occlusion, ground shadows, animated props, subtle light/weather.
- Use original hand-painted nostalgic Japanese-animation-inspired environment art, cohesive palettes, no baked labels or characters. Four maps remain fixed; no more destination expansion until core slice is accepted.
- Produce priority assets: seated Ah Ma full pose sheet (idle, scold, point, lift slipper, strike, recover), street Ah Ma four-direction walk/stop/turn, paper target deformation, stool, ritual table, slippers. Follow with avatar front/back/side walk, kneel, bow, sit, reach and grab; then temple, kitchen, tarot and arcade props.
- Hideout: illustrated floor/wall perspective, separate movable furniture with anchors and depth sorting. Real editable identity and furniture, collectible display locations, different unlocked room palettes, artwork quality reviewed in actual screenshots.
- Stamps: four unique destination motifs; reward callout, click stamp to inspect, unlocked rewards linked to room. Distinguish Paws (virtual spendable cosmetics), travel stamps (exploration) and XP (achievement).
- Daily wheel: wooden fairground wheel with pointer and animated turn; guaranteed free virtual reward, one claim per Singapore day. No ads, stakes, paid spins or penalties for absence. Current SVG is a functional draft, not final illustration.

## Launch sequence (dependency order, not an estimated date)
A. Core slice: load, entrance, avatar, path movement, temple or pier, reward, passport, hideout, reload. Fix every blocking error, overlap, confusing input or visual discontinuity found. Test 320–390 CSS px mobile, taller device, tablet and desktop with real input; inspect screenshots.
B. Signature art and comedy: illustrated Ah Ma ritual + one polished environment, original walking/action poses, distinct cameo silhouettes, sharper bilingual jokes. Verify character feet, hands, prop contact, seated stool and response animation. Test both languages.
C. Remaining curated activities: audit each from fun/clarity/replay value. Refine or retire weak entries, preserve earned keepsakes. Validate chart logic and transparent assessment interpretation; no unsupported prediction claims.
D. Return loop: daily wheel, daily fortune, cameo rotation, collectible unlocks, decorate/profile, funny local news, sharing; confirm reload/save, no duplicate reward or accidental paid mechanism. Genuine public social service is a separate launch gate; may launch as explicitly single-player/local companion beta if not ready.
E. Release: actual browser CI and live Pages deployment; check cold load, mobile Safari, desktop Chrome, keyboard, touch, safe areas, back navigation, private data and network failure. Only announce features that have passed. Do not publish unfinished art as final. Use DEEP_PRODUCT_AUDIT.md as evidence matrix.

## Current source changes and limitations
- 2e10327 and 15c5c21: restore hideout, furniture and avatar editing, stamp/decor reward flow, cosmetic balance, Ah Ma distinct seated/standing canvas drafts, bump banter, weather/civic jokes. Combined JS parses and 26 isolated checks pass.
- 8c172ab: 50-lens critique backlog.
- 2f4d264: free daily wheel integrated into Today and Paws balance. Eight equal segments, 10–30 virtual paws, claim persisted before animation, same-day and earlier-day repeat blocked; six isolated claim checks passed and combined JS parses. No real money. Local browser save, not server-authoritative.
- New everyday-character concepts above are design backlog, not implemented. Painterly original assets, final avatar contact poses, actual device walkthrough and deployed result remain unverified. Do not call this release complete.
