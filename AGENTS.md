# MeowBox development instructions

Use Graphify first, with small context budgets (1000-3000 tokens); compare its indexed commit to current main and verify relevant current source ranges. Read README, docs/PRODUCT_REVIEW.md (owner feedback and acceptance criteria), and docs/STATUS.md. Never repeatedly fetch embedded artwork or archived HTML. Dynamic overrides and shared globals mean graph edges may be incomplete; verify the last assignment and relevant callers. GitHub main is authoritative. Preserve concurrent changes. Record test evidence and blockers in docs/STATUS.md, and concise durable Graphify notes when useful.

- Mobile first, desktop supported; four native portrait maps, not cropped landscape backgrounds. Mature Japanese watercolor illustration, no emoji props or detached limbs.
- Shrine entry every visit. First visit: railway ticket, name, character selection, journey. Preserve saved character and directional walking; approach and enter buildings naturally. Home, Passport, Bag, Map and status visible.
- Natural English and Chinese, one selected language at a time, adapted humor; fit text inside cards and controls.
- Living animated rooms, no generic modal or flat minigame panel. Physical tarot deal/flip, incense/bow/fortune sticks/moon blocks, strength-based koi throws with landing animation, realistic cooking/drinks, arcade, NPC encounters and persistent collectibles.
- Community noticeboard must eventually support genuine shared posts; distinguish local storage from shared data. Personality tests for fun; reflective fortune readings, not predictions.
- Prioritize verified bugs then unfinished work; preserve artwork and save keys. Test new/returning entry, languages, all doors, touch/mouse, activities, collection and save/reload on small and tall mobile, tablet and desktop. Review screenshots. Never claim passes or deployment without evidence.
- Edit readable src files, not encoded legacy chunks. Run node scripts/build.cjs and browser tests. Batch related improvements into coherent commits and update status. Automated test success is not visual acceptance.
