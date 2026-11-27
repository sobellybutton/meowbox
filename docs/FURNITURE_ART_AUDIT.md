# Full Pawradise furniture art audit

Owner feedback, 27 November 2026: catalogue is inconsistent, with flat geometric icons beside watercolor furniture. The screenshot is an example, not the work scope. Review every item and every presentation. This audit is based on the current `furnitureCatalogue()` in src/extensions.js, the current home-layout.js mapping, the runtime wrappers in startup.js and the current repository tree. It is a code/asset inventory, not final visual acceptance.

## Findings

- 37 actual catalogue entries: 27 placeable objects, 8 finish materials and 2 room expansions.
- 13 placeable IDs currently map to existing painted assets; 14 still use procedural SVG art. The existing bookcase, glass cabinet and floor lantern are candidate matches, not automatically approved substitutes.
- Three newly generated chat candidates (board, frame, kotatsu) have not been transferred. New bookshelf is an alternative to the already staged bookcase; do not regenerate rug and fern unless the existing art fails review.
- Eight finish icons and room material patterns are still procedural. Expansion shell illustrations exist; the catalogue icon and actual room geometry are not consistently integrated. The current runtime applies decoded furniture on a later page render, so a cold first view can show fallback art.
- The actual room still uses a procedural backdrop and percentage placement with hardcoded reward shelf positions. Do not swap the shelf or display cabinet blindly: rewards must sit on their actual shelves. The catalogue screenshot also demonstrates art/text overlap; enforce a reserved image box and test narrow screens.

## Complete catalogue coverage

| ID | English | 中文 | Paw Coins | Category | Current art status | Required action |
| --- | --- | --- | ---: | --- | --- | --- |
| futon | Cotton floor futon | 日式棉布被褥 | 0 | rest | Mapped, visual QA pending | futon.webp; retain if composition and perspective pass. |
| bed | Linen bed | 亚麻小床 | 180 | rest | Mapped, visual QA pending | single-bed.webp; retain if composition and perspective pass. |
| lamp | Rice paper lamp | 和纸小灯 | 0 | light | Mapped, visual QA pending | paper-lamp.webp; retain if composition and perspective pass. |
| basicTable | Plain wooden table | 简约木桌 | 0 | storage | Mapped, visual QA pending | low-table.webp; retain if composition and perspective pass. |
| rug | Woven rug | 编织地毯 | 80 | rest | Mapped, visual QA pending | woven-rug.webp; retain if composition and perspective pass. |
| shelf | Oak bookshelf | 橡木书架 | 120 | storage | Existing candidate, unmapped | Existing painted bookcase; align empty display compartments and earned reward positions. |
| board | Cork memory board | 软木留言板 | 65 | wall | Chat candidate, not imported | New isolated memory board generated in chat; import and check wall plane. |
| plant | Little fern | 小蕨盆栽 | 55 | green | Mapped, visual QA pending | fern.webp; retain if composition and perspective pass. |
| frame | Scenic picture frame | 风景相框 | 85 | wall | Chat candidate, not imported | New isolated landscape frame generated in chat; import and check wall plane. |
| kotatsu | Kotatsu tea table | 暖桌 | 220 | rest | Chat candidate, not imported | New isolated kotatsu generated in chat; import and check floor perspective. |
| zabuton | Indigo floor cushion | 靛蓝坐垫 | 75 | rest | Mapped, visual QA pending | floor-cushion.webp; retain if composition and perspective pass. |
| teaCabinet | Tea cabinet | 茶具小柜 | 180 | storage | New art required | Create distinct low tea cabinet with usable shelf space. |
| shojiLamp | Shoji floor lantern | 障子落地灯 | 145 | light | Existing candidate, unmapped | Existing floor lantern; inspect against shoji design before mapping. |
| bonsai | Tiny bonsai | 迷你盆景 | 110 | green | New art required | Create distinct miniature bonsai and ceramic tray. |
| recordPlayer | Vintage record player | 复古唱片机 | 260 | storage | New art required | Create vintage record player with wood body and visible platter. |
| catBasket | Cat nap basket | 猫猫午睡篮 | 100 | rest | Mapped, visual QA pending | cat-bed.webp; retain if composition and perspective pass. |
| sakuraVase | Sakura ceramic vase | 樱花陶瓶 | 125 | green | Mapped, visual QA pending | flower-vase.webp; retain if composition and perspective pass. |
| lowDesk | Writing desk | 木作书桌 | 190 | storage | Mapped, visual QA pending | desk.webp; retain if composition and perspective pass. |
| retroTV | Showa television | 昭和小电视 | 320 | storage | Mapped, visual QA pending | retro-tv.webp; retain if composition and perspective pass. |
| displayCabinet | Glass collectible cabinet | 玻璃手办展示柜 | 240 | storage | Existing candidate, unmapped | Existing painted cabinet; calibrate collectible display and shelf hit areas. |
| readingChair | Velvet reading chair | 绒布阅读椅 | 220 | rest | New art required | Create velvet upholstered reading chair, not a renamed floral armchair. |
| wallLinen | Linen wallpaper | 亚麻纹壁纸 | 100 | finish | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| wallSakura | Sakura wallpaper | 樱花壁纸 | 160 | finish | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| wallMatcha | Matcha wallpaper | 抹茶壁纸 | 140 | finish | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| wallBlue | Indigo wallpaper | 靛蓝壁纸 | 150 | finish | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| floorOak | Honey oak flooring | 蜂蜜色橡木地板 | 130 | floor | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| floorTiles | Vintage ceramic tiles | 复古花砖 | 190 | floor | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| floorTatami | Tatami flooring | 榻榻米地板 | 180 | floor | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| floorChecker | Cream checker tiles | 奶油棋盘砖 | 170 | floor | Procedural finish | Paint matching material sample and perspective-correct room texture; preserve chosen finish in saved rooms. |
| chineseTeaTable | Elm tea table | 榆木茶桌 | 200 | storage | Mapped, visual QA pending | tea-table.webp; retain if composition and perspective pass. |
| chineseScreen | Lattice folding screen | 中式格栅屏风 | 260 | storage | New art required | Create painted Chinese lattice screen. |
| chineseLantern | Silk lantern | 中式绢灯 | 150 | light | New art required | Create silk hanging lantern with correct suspension. |
| porcelainVase | Blue and white porcelain | 青花瓷瓶 | 135 | green | New art required | Create distinct blue and white porcelain vessel. |
| chineseBench | Ming style bench | 明式木长凳 | 195 | rest | Mapped, visual QA pending | bench.webp; retain if composition and perspective pass. |
| moonShelf | Moon gate curio shelf | 月洞博古架 | 280 | storage | New art required | Create moon gate curio shelf with usable compartments. |
| roomExtension | Reading room extension | 扩建阅读小室 | 600 | extension | Painted shell staged; partial integration | Use side-extension.webp in catalogue, detail and actual expanded room; preserve placements. |
| roomStudio | Studio extension | 扩建收藏工作室 | 1000 | extension | Painted shell staged; partial integration | Use l-shaped-extension.webp in catalogue, detail and actual expanded room; preserve placements. |

## Production and release rules

- One mature Japanese-inspired watercolor/gouache art direction, with compatible traditional Chinese furniture, warm timber, indigo, subdued greens and dusty rose. Distinct item identities, not recolored duplicates. Do not add the unmapped staged furniture to the catalogue merely to use an asset.
- Reuse existing art after inspecting it in context. New art: isolated transparent sprites for placeable objects, coherent wall/floor projection, measured anchor and size. Match catalogue, owned tray, purchase preview, actual placed furniture and collection display. Do not use front-facing catalogue art as an isometric floor sprite without checking perspective.
- For missing catalogue pieces, use the intended runtime path under assets/visual/painted/home/furniture/{id}.webp after import and alpha inspection. Keep previous IDs, prices, ledger, saved positions and earned items. Finish swatches and room textures need separate material assets and floor/wall masks. Review all existing 24 staged furniture sprites before commissioning duplicates.
- Cold load: no permanent geometric fallback; show a bounded loading placeholder and replace it in-place without losing scroll, selection, purchase or drag state. Reserve a fixed art region so no image overlaps labels or buttons.
- Inspect every item on mobile and desktop: all categories/styles, search, owned/unowned/unaffordable, detail, purchase, placement, movement, rotation, wall alignment, reward shelf and cabinet, wallpaper/floor changes and expansions. Both languages; saved state reload. Record screenshot evidence per group and actual deployed revision. No final acceptance on code inventory or image generation alone.
- The active runtime integration runner owns startup.js; do not overwrite that lease. Implement the missing art and renderer integration as coordinated separate tasks.
