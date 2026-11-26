# Pawradise visual production brief

## Permanent in-world identity (owner clarification, 26 November 2026)

Pawradise is the permanent name of the fictional world, irrespective of the eventual app or website brand. BrbLife is still under consideration as a possible app name, not an approved world name. Keep Pawradise consistent on in-world gateways, railway branding, passports, tickets, maps, welcome screens and signage when a world name is needed. A later app rename must not require repainting the world. Keep app branding, browser title, website logo and external marketing copy separate from the in-world identity. Prefer editable, localized text and removable sign layers for legibility and layout, but do not replace the permanent Pawradise identity with a future app name. Do not invent an approved Chinese world name or change the original four human avatars, existing district names, route IDs, asset paths, saved data, or repository name. Previous mockups using MeowBox or BrbLife as the world name are references only and are not approved production art.


Owner clarification, 25 November 2026: the nostalgic painted redesign must preserve the current four-map game and every existing station. Previous concept sheets are mood references only; do not use them as a flattened playable map or invent duplicate shrines.

## Canonical map inventory

Current source: src/engine.js maps, src/extensions.js portraitWorlds and later station/action overrides. IDs are stable; UI names are localized separately.

| Map ID | Current destination | Existing stations |
| --- | --- | --- |
| fortune | Fortune Valley / 解忧谷 | tarot (Tarot House), destiny (Destiny House), temple (Fortune Temple / 解忧庙), wishes (Wishing Garden), station (Next Stop) |
| home | Lazy Island / 咸鱼岛 | fish (Worry-Free Pier), tea (Tea Room), office (Office), park (Daydream Park) |
| island | Munch & Play / 吃喝玩乐街 | kitchen (Grandma's Kitchen), arcade (Arcade), mystery (Daily Souvenir) |
| wonder | Discovery Station / 奇遇驿站 | match (Compatibility Café), story (Parallel Lives), quiz (Personality Lab) |

Arrival shrine gate is an entrance sequence, not another Fortune Temple or extra gameplay station. Show a simple gateway/arrival path, then the single actual Fortune Temple in Fortune Valley. Next Stop is a transport connection, not a fifth map. Fishing belongs to Lazy Island, not Food Street. Keep all 14 activity doorways plus Fortune Valley travel station. Retain existing door IDs, order/anchors, route geometry, save keys, actions, progression and localized names. Verify final runtime overrides before implementing.

## Art direction and technical contract

Original nostalgic Japanese animated-film-inspired watercolor/gouache, weathered timber, soft atmospheric perspective, selective linework, natural proportions, calm colors. Avoid uniform decorative detail, artificial gloss, repeated flowers, gradients pretending to be depth, emoji objects, and identical room templates. Let different destinations have different silhouettes, light, materials and mood. Make all four village backgrounds native portrait, with clear continuous walkable paths, entry/exit anchors and enough negative space for signs. Retain desktop usability.

Separate distant landscape, architecture, movable props, foreground occluders, characters and animated lighting/weather into assets or depth-aware layers. Do not bake a player, NPC, readable text, interactive props or UI into a map background. Use foot-based depth sorting and consistent camera perspective; doors and prop hit targets must match the painted positions. Keep current collision and interaction behavior until replacement geometry is mapped and tested. Artwork should be lazy-loaded, compressed and independently replaceable. Respect reduced motion.

## Individual inner-scene production inventory

| Station | Distinct playable scene and activity art |
| --- | --- |
| tarot | Reading room with table, shuffle/deal/flip, readable card closeup, one-card and three-card reading |
| destiny | Astrologer's study, Master Yue conversation, birth chart entry, Zi Wei Dou Shu chart and interpretation, related existing reading flows |
| temple | Single temple courtyard; bronze bell and striker; water pavilion/ladle; prayer altar/incense; fortune stick cup, numbered stick pickup and paper; moon blocks; hidden garden path, koi feeding and chimes |
| wishes | Separate wishing garden with ema wall and strength-based coin toss pond; independent water, koi, coin, splash and target layers |
| fish | Waterfront pier, fishing line and catches, floating private worry bottle, bench encounter |
| tea | Tea room with seats, Auntie Mei, Daily Scoop and community board |
| office | Workplace parody room with rant wall and clearly interactive stress-relief target |
| park | Daydream Park with independent pets, petting/interaction and rest spots |
| kitchen | Grandma's kitchen; separate playable soup and bubble tea preparation stations with reachable ingredients, ladle, pearls, cup and pitcher |
| arcade | Vintage arcade interior; distinct physical claw cabinet, rhythm floor, blind box machine and prizes |
| mystery | Daily souvenir shop with shelves, counter and collectible inspection |
| quiz | Personality Lab, Soul Cat Sanctuary and existing personality tests with consistent typography and readable result screens |
| story | Parallel Lives illustrated branching story scenes |
| match | Compatibility Café with distinct reading/answer and results layouts |

Also redesign arrival ticket, avatar selection, travel map, bag, passport, personal room, settings and other existing DOM screens as appropriate. Every activity needs a native portrait scene or coherent in-room closeup, not just a new exterior. Preserve existing avatar choice; create matching front/back/side walking frames and action poses (kneel, bow, reach, sit, stir, drink). Render text through UI so only selected EN or 中文 appears. Keep names and routes consistent.

## Acceptance

Start with one complete vertical slice (arrival -> Fortune Valley -> Fortune Temple -> ritual -> return -> Next Stop), validate real mobile and desktop gameplay and inspect screenshots. Then replace remaining rooms and maps in batches. Compare pre/post station inventory, entrance, touch targets, path alignment, exit/return, activities, bilingual text and saved progress. Run build and browser suite; inspect screenshots at small/tall mobile and desktop. Do not merge a replacement that obscures a doorway or makes an activity harder to use. Prior draft vectors and concept sheets are not final painterly assets; no claim of implemented art or visual acceptance is made by this brief.


## Product curation amendment (owner approval, 25 Nov 2026)

Owner authorizes removing redundant or weak activities; the original inventory above is the baseline, not a requirement to preserve every game forever. No duplicate destinations. Preserve existing saves and earned items; plan migrations/redirects for any retired entry, rather than silently deleting progress. Do not create final art for an activity before deciding whether it belongs.

### Distinct purpose of each destination
- Fortune Valley: reflection, ritual and wishes. Mountain atmosphere, traditional architecture and quiet ritual spaces. Arrival gate is transit only. One Fortune Temple, one Wishing Garden, one Tarot House, one Destiny House.
- Lazy Island: emotional release, human connections, pets and rest. Coastal paths, weathered pier and relaxed local businesses. Fishing and worry bottles live at the same pier; cats belong in the park; gossip belongs in the Tea Room; workplace frustration belongs in the Office.
- Munch & Play: hands-on play, food and collecting. Retro market lane, warm kitchen and old arcade. Cooking and milk tea share one kitchen; claw, rhythm and blind box share one arcade. Daily Souvenir remains only if it offers a unique daily discovery and collectible story, not another random reward dispenser.
- Discovery Station: self-discovery and imagination. Observatory/library/railway-inspired setting; distinct Personality Lab, branching Parallel Lives and Compatibility Café. No fortune temple or tarot shop here. The transport shortcut called Next Stop is not another destination.

### Curation decisions before visual production
| Area | Decision and reason |
| --- | --- |
| Entry shrine vs Fortune Temple | Keep gate as brief arrival sequence; never depict a second playable shrine. |
| Temple rituals | Keep distinct physical rituals with a shared courtyard and optional short ritual journey. No standalone fortune-stick or moon-block destination; remove repetitive filler steps without purpose. |
| Tarot vs Destiny | Tarot is symbolic reflective reading (one daily card or three-card question); Destiny is optional birth-chart interpretation and Master Yue's chart-specific explanation. Do not duplicate daily luck readings or add a separate consultation shop. |
| Wishing Garden vs temple garden | Wishing Garden is for wishes/coin tossing; temple back garden is a quiet optional retreat with feeding/chimes. No second coin-toss game. If playtesting finds the retreat empty, fold its quiet interactions into the temple rather than create another map. |
| NPC chat | Embed in meaningful activity, approach, clue, story or relationship; no dedicated generic chat-only station. |
| Tea Room vs Office | Tea Room: social gossip and fictional town news, plus clearly identified community board. Office: personal private vent and satisfying physical stress relief. Avoid a duplicate rant wall or imply local posts are shared. |
| Pier vs pond | Pier: fishing skill, rare catches, worry bottle and bench encounters. Garden pond: wish toss or koi care, not another fishing game. |
| Kitchen | Cooking and bubble tea deserve different gestures and recipes but one physical location. Remove shallow tap-only variants if duplicative. |
| Arcade vs souvenir | Arcade rewards earned by play; shop offers a daily discovery/story. Consolidate random blind-box variants; if souvenir is only a duplicate reward dispenser, retire its separate door after migrating items and references. |
| Personality Lab | Curate a small distinct set; merge redundant workplace quizzes and cat personality labels into one playful result where appropriate. Retain only tests with meaningful scoring and clearly distinguish entertainment from validated assessment. |
| Compatibility Café | Keep only if it supports distinct paired/self-reflection prompts; no duplicated astrology or personality quiz presented as compatibility. |
| Parallel Lives | Keep if choices actually lead to distinct outcomes and replay; replace static quiz-like branches with short interactive stories. |
| Progression | Reward mastery, rare discoveries and meaningful collections rather than repeat clicks/chats. Optional daily tasks, no pressure. |

Use a product gate for every activity: what does the player do, why is it satisfying, why does it belong here, what differs from other activities, and why would someone return? Keep, improve, combine or retire based on actual touch playtest and screenshot review. Do not assume the tentative retirement candidates are already removed. Preserve four destinations and coherent Next Stop travel unless the owner later changes that structure.

### Asset acceptance
Treat the current artwork concepts as mood references only. Verify precise existing door locations, routes, interactions and final runtime overrides before drawing map-specific plates. Create production-ready map and interior scenes individually, with dynamic characters, props and foreground layers separated. No baked-in people, labels, second temples or stations from another map. Each asset must identify its map/station/activity ID and intended interactive anchors. Start with Fortune Valley vertical slice, compare actual mobile and desktop screenshots and test travel to every remaining map.


## End-user journey contract (25 November 2026)

A house is a complete experience, not a menu of disconnected websites. A dependent step stays in its parent house, preserves current state and returns to the previous logical stage. A different destination requires deliberate travel. Distinct optional activities can share a physical space without becoming separate doors. Do not draw or name subactivities as new destinations.

| House | Player journey and completion |
| --- | --- |
| Arrival | First visit: ticket, name, avatar, journey, gateway. Return: personalized gateway, same avatar and progress, no repeat registration. Gateway leads into Fortune Valley, not an extra temple. |
| Fortune Temple | Enter courtyard; optional bell and purification; prayer; optional moon blocks or draw stick; pick up matching stick; unfold its paper; keep or tie it as appropriate; return to temple. Quiet back garden reached only from temple; no second shrine or separate paper-reading house. Ritual steps remain optional, not forced for every visit. |
| Tarot House | Choose daily card or deeper question; shuffle, deal, flip, inspect, reflect, save if chosen; return to spread or room. No extra love-tarot house. Daily card remains stable; deeper reading has distinct purpose. |
| Destiny House | Consult Master Yue; enter birth details once; generate chart; read chart-specific explanations and ask follow-up questions from that result; return to study. Two UI entry points to one consultation may be retained for accessibility but must use the same name and destination. No promise of live AI unless actually implemented. Keep birth details private. |
| Wishing Garden | Choose coin wish or wish plaque; complete throw with visible outcome/retry, or write and hang a wish; optionally return to garden. No fortune-stick or fishing duplicate. |
| Worry-Free Pier | Choose fishing, private worry bottle, or quiet bench. After casting bottle optionally fish or meet resident at same pier; do not transport to another map. |
| Tea Room | Tea, gossip, fictional news and clearly labeled noticeboard. Not another private stress wall. |
| Office | Private vent then optional physical stress relief; no forced sharing; end with satisfying response and choice to leave. |
| Daydream Park | Meet animal, build trust, optional rest or encounter; no separate pet house. |
| Kitchen | Pick a recipe or drink, prepare, cook/mix, taste, finish, optionally start another from same kitchen. |
| Arcade | Choose machine, play, receive earned prize or retry, return to arcade floor. Keep blind boxes here; retire daily souvenir door only if testing shows it adds no independent story/discovery value. |
| Daily Souvenir | Distinct daily curated travel object and story, not random arcade box. Reassess after playtest. |
| Personality Lab | One in-room discovery entry, then Soul Cat, four preferences, or nine motives; answer, receive result and explanation, return to lab. No separate Soul Cat Sanctuary or Nine Motives Tea Room destination. |
| Parallel Lives | Choose a story, make consequential decisions, reach distinct endings, optionally replay from same house. |
| Compatibility Café | Separate relational reflection, not another personality classification or horoscope; retain only if it has unique value. |
| Travel | Finish or explicitly leave the current activity, return to room/outside or use Next Stop. Next Stop and map shortcuts share one travel selector; no invented travel destination. |

Player-facing review: can I predict the next step? Does the same avatar remain present? Do I understand what changed? Can I go back without losing a completed result? Does the location's name describe what I do? If two controls lead to the same experience, prefer a single canonical interaction with accessibility alternatives, not two separate locations or misleading labels.

Implementation 9b54ed5: one visible Personality Lab selection entry; all three modes retained, renamed as activities rather than separate houses; existing results/save keys unchanged. 60fb213: browser checks for unique final runtime station IDs/ownership and entry/return of all three lab modes via actual choice buttons. The test uses direct setup for room entry; full organic exploration remains to be tested. New CI results and visual approval are pending. Other flow decisions above are production requirements, not claims of completed redesign.
