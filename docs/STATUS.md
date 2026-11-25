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
