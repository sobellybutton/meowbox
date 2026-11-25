# Twenty simulated player perspectives and daily luck audit

25 Nov 2026. These are hypothetical personas and heuristic observations grounded in source and prior owner playtest feedback, not 20 actual testers, fresh browser sessions, survey data or measured retention. Validate with real new players later.

| Persona | Expected friction or need | Response |
| --- | --- | --- |
| Time-poor worker | Wants release quickly | Short return gateway, discoverable optional shortcut via normal travel |
| New visitor | Unclear where to go | Clear door affordances and optional first suggestion |
| Illustration fan | Mixed art styles | Coherent art bible and native portrait layers |
| Mobile player | Tiny avatar, overlap | Authored room staging, safe approach anchors, readable camera |
| Tarot enthusiast | Generic readings | Contextual reflection, card-specific explanations |
| Astrology enthusiast | Chart without explanation | Chart-specific interpretation and follow-up, clear limits |
| Returning player | Same things every day | Daily town variation and daily fortune |
| Impatient player | Too much setup | Meaningful action quickly, no compulsory tutorial |
| Skill gamer | Rewards feel automatic | Physical skill, meaningful feedback and retries |
| Relaxed visitor | XP pressure | Optional progress, no grind |
| Chinese speaker | Literal translations | Original Chinese humour and readable localization |
| Singapore office worker | Generic jokes | Relatable Asian workplace satire |
| Personality enthusiast | Shallow scoring | Curate assessment items and explain uncertainty |
| Collector | Generic badges | Illustrated objects with stories |
| Animal lover | Repetitive petting | Recognition, mood and unique responses |
| Story lover | Static dialogue | Branches with distinct consequences |
| Accessibility-minded player | Small controls and words | Accessible control sizes, contrast, alternate input |
| Privacy-minded player | Private inputs | Local/transient data, clear disclosure |
| Social player | Unshareable outcomes | Optional illustrated share card without personal data |
| Sceptical player | No return reason | Coherent daily ritual and meaningful variation |

## Daily luck audit
Current main src/engine.js: updateHUD sets luck.hidden=true; no matching unhide in inspected extensions. Existing hidden handler computes 50+hash(day()+'luck')%50, same numerical score for everyone on a given local date, generic boss joke, and directly changes scene/room to tarot. This is not a personalized or well-integrated daily luck system. Existing dailyCard() selects a card by date, while orientation depends on date and avatar. Current extensions readingDeal() uses that daily card; readingSave() stores reading in journal/passport, with UTC date; check consistent date boundary and effective clue behavior before relying on the legacy clue implementation. Other daily content uses Singapore date. Do not describe hidden score as visible feature.

Proposal: one optional illustrated Daily Luck / 今日运势 slip in arrival gate or passport, a single daily source of truth with optional walk/travel to Tarot House for a deeper reading. No new house or duplicate tarot mechanics, no automatic teleport. Choose one defined date boundary (recommend Asia/Singapore for consistency with existing dailyLocal; owner has not explicitly chosen). Stable same-day result, no refresh rerolls, next-day variation; use local seed for individual variation without collecting birth data. Entertainment only, no claims of real prediction, financial or medical advice; avoid fake probability precision. Suggested fields: today's theme, playful workplace luck, lucky color/number as symbolic fun, small optional action or town discovery, optional share card stripped of personal inputs. Rotate curated original EN/ZH copy independently, preserve existing tarot reading journal. Daily luck should be readable in under 15 seconds. No streak penalties or obligatory tasks. Daily fortune card and deeper tarot must have distinct purpose and share coherent theme where possible. Explicitly mark as proposal, not implemented. Test same-day reload, date rollover, language, privacy, sharing and no duplicate reward or forced travel.

## Highest priorities
1. Indoor staging and navigation: organic entry, actual movement and camera, no avatar overlap.
2. First-session path: one clearly suggested, satisfying experience in a short visit; unobtrusive return shortcuts.
3. Complete polished Worry-Free Pier slice, then temple and kitchen; curate weak activities before art.
4. Daily luck and town variation as one return loop, not more destinations.
5. Localized humor, content integrity, private data, meaningful collectible art and independent pilot.

No gameplay changes in this review commit. No claim of real playtest or launch approval.
