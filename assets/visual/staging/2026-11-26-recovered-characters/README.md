# Pawradise recovered character assets

Contains 24 original transparent WebP candidates at isolated staging paths. No live files are overwritten. Player 1 right-walking frames are candidates to replace the missing painted direction; 20 reaching/tapping frames are not validated wave, slap or ritual poses. Original rear-walking sheet is referenced in the manifest, not duplicated as those frames are already registered.

All files preserve original illustrated figures, with detached alpha specks removed and common canvas/ground anchors. No image generation used. Review gait, pose identity, grip/hand contact and motion before activation. Existing IDs and existing runtime manifest remain unchanged.

To import: extract into a fresh checkout of the latest main, preserve other changes, run `python3 verify_recovered_characters.py` at the repository root, then commit the staged assets. Integrate the appropriate validated candidates with the current runtime and build/browser tests separately.
