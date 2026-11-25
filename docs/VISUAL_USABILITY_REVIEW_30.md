# MeowBox visual and usability review: 30 lenses
25 November 2026. Source and development evidence review, not 30 actual testers. Live initial page returned HTTP 200 and accessible text was extracted; no verified interaction walkthrough or inspected screenshot in this review. Graphify index was stale at 0aa74d0, so relevant current GitHub source was checked. Latest assets are vector drafts; visual approval remains pending.

## 30 lenses and next repair
| Lens | Next change |
|---|---|
| 1 First impression | Clear short-break premise, railway ticket and brief shrine arrival. |
| 2 Loading | Measure cold/warm start, shrink initial payload, avoid artificial waiting. |
| 3 Discovery | One contextual cue, readable entrances and map route. |
| 4 Movement | Touch, keyboard and joystick cooperate; nearest safe floor on tap. |
| 5 Outdoor doors | Replace timer-based reposition/entry fallback with actual arrival or graceful recovery. Current portrait walkDoor still sets p.x/p.y and enters on timeout. |
| 6 Indoor staging | Validate authored room-specific anchors, obstacle footprints, actor scale, paths and door exit. |
| 7 Mobile reach | Confirm small viewport, safe area, thumb reach and unclipped touch controls. |
| 8 Discoverable actions | Prop motion/highlight and clear one-step prompts rather than hidden hit rectangles. |
| 9 Continuity | Cancel/exit/language change preserve location and appropriate state. |
| 10 HUD | Explain every counter, simplify navigation and resolve duplicate concepts. |
| 11 Art consistency | One original nostalgic Japanese illustrated aesthetic; reject visibly mismatched vector and painted scenes. |
| 12 Scale | Tune moderate outdoor and indoor sizes against actual doorway, path, room and camera screenshots, not one universal scale. |
| 13 Identity | Four selected avatars recognisable in front/back/side and all poses. |
| 14 NPC diversity | Distinct silhouettes, ages, clothing and movement; no generic cameo recolours. |
| 15 Action animation | Dedicated body poses with wrist/seat/foot anchors rather than current transitional sprite deformation. |
| 16 Depth | Foreground occlusion, foot sorting and grounded shadows. |
| 17 Interior architecture | Native portrait room-specific architecture, not repeated shelf/window templates. |
| 18 Camera | Purposeful room establish, approach, action closeup, return; no hidden render-only repositioning. |
| 19 Lighting | Believable local lights and restrained weather/ambient variation. |
| 20 Typography | Consistent EN/ZH typography, measured text and touch targets. |
| 21 Purpose | Distinct meaningful outcome for each activity; curate rather than expand. |
| 22 Feedback | Physical input affects actual visible outcomes, gestures and prop motion. |
| 23 Skill | Fair optional mastery and no repetitive XP farming. |
| 24 Residents | Individual routines, context, recognition, reactions and useful optional encounters. |
| 25 Humour | Physical comedy, original bilingual context-aware reactions and consequences. |
| 26 Payoff | Satisfying end, meaningful keepsake or reflection, no generic congratulations. |
| 27 Return | Authored daily variation, genuine discoveries, no mandatory streak. |
| 28 Rewards | Paws, stamps, rare souvenirs and hideout cosmetics connect transparently. |
| 29 Community | Genuine shared backend and moderation if launched, no fake human posts. |
| 30 Audio | Quiet consultations; event-specific effects, mute and visibility; actual listening test. |

## Concrete current source observations
- The portrait outdoor walkDoor timer still forcibly sets logical coordinates and calls enter. Treat that as a P0 continuity defect; remove teleport only after testing normal movement, timeout recovery and cancellation.
- The cat chase adjusts position by fixed increments per rendered frame, rather than elapsed time. At different refresh rates the chase can feel different. Fix with a capped dt and valid play-area input; provide understandable feedback on invalid food/water drops. Inspect actual mouth/bowl contact, stats panel clearance and returning walk.
- The new outdoor scale helper cap deliberately allows the existing base to win over the maximum pixel target. It is not an absolute cap; review against screenshots before changing, and preserve perspective, actor ground anchors and contact poses.
- New SVG assets load on demand with fallback, but build.cjs validates only the original 62 WebPs and combined syntax. Add production asset path/dimension/frame-origin checks, and browser image decode / missing-asset / error checks.
- The current portrait renderer uses contain fit into livingBounds. New art must align with actual gameplay coordinates, walkable floor and foreground, not merely share portrait aspect. Most desktop paths retain legacy backgrounds. Review real screenshot pairs.
- Public community API is unconfigured. Local authored conversations remain available; do not describe shared posting as operational.
- Do not claim live gameplay or final artwork verification based on HTTP 200, source parsing, isolated numerical tests or an initial page extraction.

## Room-by-room next work
- Temple: player pose, actual hand contact, accurate block faces, quiet prayer, paper reveal, no duplicate temple.
- Tarot: coherent original deck with correct card meanings, hand/deal/flip and readable result, one daily or three deeper.
- Destiny: seated Master Yue pose and chart scroll, chart-specific followup and independent calculation review; silent.
- Wishing Garden: koi motion, coin trajectory and landing, lantern/plaque meaning, true water boundary.
- Worry-Free Pier: seated Ah Ma demonstration, paper target feedback, wrist contact, note fold/throw/landing, roast variations.
- Tea and office: original distinct faces and posture, seated stories, punchlines, meaningful branches, avoid duplicated chat screens.
- Park: complete cat expressions and gestures, frame-rate-independent chase, feeding/drinking contact, optional later adoption.
- Kitchen: Grandma host, physical scoop/stir/pour, heat and actual recipe outcome, no redundant ingredients or clipped labels.
- Arcade: grip/release alignment, distinct prize art, fair timing, rhythm motion, no duplicate reward farm.
- Discovery: illustrated situations and results, distinct personality tests, branching scenes, honest scoring.
- Hideout: coherent furniture perspective, placement/occlusion, optional cat and reward display, profile and meaningful stamp access.

## Acceptance order
P0: actual mobile/desktop walkthrough, repair route/interaction blockers, no runtime errors, image decode and regression validation. P1: complete one full illustrated vertical slice (pier), then temple and kitchen with dedicated avatar poses. P2: finish other existing room art, NPC sheets, typography, inventory and hideout; QA on all four maps, both languages and supported screen sizes. P3: invited pilot, observe first minute without coaching, refine based on behaviour, verify deployed version. Do not add unrelated destinations or advertise unverified completion. Real shared community can be separately phased.
