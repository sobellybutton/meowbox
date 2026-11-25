# MeowBox | 摸鱼盒

[Play the live game](https://sobellybutton.github.io/meowbox/). Bilingual Japanese illustrated browser life sim for short breaks.

## AI developer quick start
Read [AGENTS.md](AGENTS.md), [owner feedback and Work handover](docs/PRODUCT_REVIEW.md), and [development status](docs/STATUS.md). Query Graphify for relevant symbols, dependencies and tests; compare indexed commit with GitHub main. Retrieve only relevant lines; do not ingest legacy artwork or archived HTML. Graphify free plan indexes README among documents.

## Canonical source
- `src/engine.js`: base world engine, activity state and input, storage and core rendering.
- `src/extensions.js`: later refinements/overrides, entrance, portrait villages, NPCs and rituals. Locate the **last** assignment of a wrapped function before editing.
- `src/startup.js`: initialization after extensions.
- `src/shell.html`: HTML/CSS.
- `src/assemble.js`: shared browser/offline assembler.
- `index.html`: production loader.
- `preview-v9-1/part0*.js`: legacy artwork carriers; no gameplay edits.
- `assets/portrait/`: native portrait outdoor artwork.

Source extraction preserves the exact assembled HTML from 1b61bef. It is an AI-context improvement, not yet an artwork download-size improvement.

## Test and export
`node scripts/build.cjs` assembles and syntax checks. `node scripts/build.cjs meowbox-playable.html` also exports the assembled page (external assets must remain available). Run `python3 -m http.server 8765` from root and open index.html. GitHub Actions runs Playwright; inspect failures and screenshots before claiming completion.

## Artwork loading
Production uses `assets/art/000.webp` through `061.webp`, preserving the original illustrations. Canvas images and portrait destinations load on first use; the legacy chunks are retained for embedded exports only. `node scripts/build.cjs` verifies every extracted image against the original and parses both builds. No archive is deleted.
