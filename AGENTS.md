# MeowBox development instructions

Use Graphify first, with small context budgets (1000-3000 tokens); compare its indexed commit to current main and verify relevant current source ranges. Read README, docs/PRODUCT_REVIEW.md (owner feedback and acceptance criteria), and docs/STATUS.md. Never repeatedly fetch embedded artwork or archived HTML. Dynamic overrides and shared globals mean graph edges may be incomplete; verify the last assignment and relevant callers. GitHub main is authoritative. Preserve concurrent changes. Record test evidence and blockers in docs/STATUS.md, and concise durable Graphify notes when useful.

- Mobile first, desktop supported; four native portrait maps, not cropped landscape backgrounds. Mature Japanese watercolor illustration, no emoji props or detached limbs.
- Shrine entry every visit. First visit: railway ticket, name, character selection, journey. Preserve saved character and directional walking; approach and enter buildings naturally. Home, Passport, Bag, Map and status visible.
- Natural English and Chinese, one selected language at a time, adapted humor; fit text inside cards and controls.
- Living animated rooms, no generic modal or flat minigame panel. Physical tarot deal/flip, incense/bow/fortune sticks/moon blocks, strength-based koi throws with landing animation, realistic cooking/drinks, arcade, NPC encounters and persistent collectibles.
- Community noticeboard must eventually support genuine shared posts; distinguish local storage from shared data. Personality tests for fun; reflective fortune readings, not predictions.
- Prioritize verified bugs then unfinished work; preserve artwork and save keys. Test new/returning entry, languages, all doors, touch/mouse, activities, collection and save/reload on small and tall mobile, tablet and desktop. Review screenshots. Never claim passes or deployment without evidence.
- Edit readable src files, not encoded legacy chunks. Run node scripts/build.cjs and browser tests. Batch related improvements into coherent commits and update status. Automated test success is not visual acceptance.

## Current product authority
Read [docs/FINAL_PRODUCT_BRIEF.md](docs/FINAL_PRODUCT_BRIEF.md) first for the owner-approved 13 design gates and curated activity plan. It supersedes older keep-every-game assumptions. Do not reintroduce visible fishing/bench games, duplicate stress rooms or subactivity destinations. Prioritize a complete playable, visually reviewed slice over further breadth; preserve existing progress and retired keepsakes.


## Non-negotiable art quality (owner, 26 November)
- Visible character, prop, furniture, collectible, result card, game cabinet and activity art must be individually illustrated, with a coherent nostalgic Japanese watercolor/gouache art direction. Simple procedural vector shapes, flat recolors, generic icon packs and geometric substitutes are temporary fallback art only, never a finished deliverable.
- Rooms may be intentionally sparse, but their lighting, architecture, materials and foreground/background composition still need to feel like the same painted world. Do not fill every empty area with decoration.
- Draw actual character poses, tool contact, feet pivots, seating and coherent shadows. Do not disguise missing animation with boxes or floating objects. Keep character size appropriate to each room and camera.
- Prioritize final raster assets, original painted portrait/landscape compositions and isolated transparent sprites, with documented anchors and load budgets; reuse existing illustrated assets when suitable. Code remains responsible for motion, hit areas, accessibility and responsive layout.
- Before accepting an activity, inspect actual mobile and desktop screenshots and an exported share image where applicable. Review art quality, composition, readability, character proportions and prop contact. Passing code tests never constitutes visual approval. Work in batches of five related improvements, record actual evidence and explicitly flag interim art.
