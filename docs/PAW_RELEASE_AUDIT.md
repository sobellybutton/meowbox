# Pawradise 30-lens release audit
Baseline 380a215, 26 November 2026. Pages deployment ca5bda1 passed; browser b2c230f failed at obsolete Town Hall navigation across three viewport sizes; shrine-repair Chromium/WebKit passed. Comprehensive later audits pending. Remote interactive runtime lacks Playwright and local runtime cannot resolve GitHub. No completed frame-by-frame live review claimed.

| # | Lens | Release requirement |
|---|---|---|
| 1 | Entrance | Character visible without text occlusion. |
| 2 | Arrival | Smooth map reveal, no redundant holding screen. |
| 3 | Outdoor foot contact | Sample feet on all routes and staircases. |
| 4 | Indoor foot contact | Verify all furniture obstacles and station paths. |
| 5 | Rear animation | Review limb continuity in actual painted frames. |
| 6 | Front/side gait | Replace procedural strip animation with original directional art. |
| 7 | Actor identity | Fix repeated pink-haired look; distinct cameo illustrations still needed. |
| 8 | NPC routines | Varied arrivals, seating, departure; avoid clones. |
| 9 | Scale | Same ground-plane scale, appropriate depth. |
| 10 | Occlusion | Feet, faces, furniture and signs correctly ordered. |
| 11 | Stray artifacts | Investigate red dot; source not yet verified. |
| 12 | Activity signs | Every room, both languages; visible plaque or guide and live target. |
| 13 | Wayfinding | Discoverable railway and shortcut via Explore. |
| 14 | Enter/exit | Actual door and return to prior approach. |
| 15 | HUD | Profile/coins/settings map only. |
| 16 | Physical interaction | Hands connect to tools, props and cards. |
| 17 | Tarot | Exact chosen cards, reveal, inspect, journal, return. |
| 18 | Yue study | Same portrait, readable controls, new original study painting. |
| 19 | Nara | Herd movement and behavior, safe feeding and bowing. |
| 20 | Cat care | Original painted cats and resting/stroking poses. |
| 21 | Goldfish | Fair timing, skill, paper wear, scores and fish release. |
| 22 | Railway | Pixel movement only through windows; route-specific panorama. |
| 23 | Arcade | Physical cabinet interactions and reachable controls. |
| 24 | Nested navigation | Immediate parent, scroll/filter/location restored. |
| 25 | Responsive layout | 360,390,tablet,landscape,1440; clipping and hit targets. |
| 26 | Typography/bilingual | Readable contrast, natural Chinese, canonical names. |
| 27 | Performance | 100ms samples, flag >250ms gaps and stalls. |
| 28 | Loading/failure | Slow art, errors, 404, retries, responsive exit. |
| 29 | Save/accessibility | Returning saves, privacy, reduced motion, keyboard/audio/touch. |
| 30 | Launch integrity | Latest deployment, browser suites, screenshots/video, human playtest. |

100ms sampler attaches to broad fixture-based visual sweep and actual input district journeys, exports timestamped JSON and capped anomaly screenshots. It does not capture or visually inspect every frame, and cannot prove aesthetic quality. Actual intervals may drift; records include elapsed time. Review coverage and gaps before claiming release readiness.
