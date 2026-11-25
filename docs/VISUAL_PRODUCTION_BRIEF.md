# MeowBox visual production brief

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
