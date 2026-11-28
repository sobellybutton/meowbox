#!/usr/bin/env python3
"""Measure existing painted traveller sprites, without altering images or runtime.
Requires Pillow. Run from anywhere; optional JSON report is suitable for CI.
Alpha bounds describe visible paint, not a semantic head, hand or seat anchor.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from statistics import median

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAINTED = ROOT / "assets/visual/painted"


def measure(alpha, foot):
    w, h = alpha.size
    boxes = {}
    for threshold in (32, 128):
        box = alpha.point(lambda v: 255 if v >= threshold else 0).getbbox()
        if box is None:
            raise ValueError("empty visible silhouette")
        boxes[str(threshold)] = list(box)
    l, t, r, b = boxes["32"]
    result = {
        "canvas": [w, h], "alphaBounds": boxes,
        "visibleWidth": r-l, "visibleHeight": b-t,
        "visibleHeightFraction": round((b-t)/h, 5),
        "visibleBottomFraction": round(b/h, 5),
    }
    if foot is not None:
        fx, fy = foot
        result.update({
            "registeredFoot": [fx, fy],
            "footMinusVisibleBottomPx": fy-b,
            "footMinusVisibleBottomFraction": round((fy-b)/h, 5),
            "footToVisibleTopPx": fy-t,
            "footToVisibleTopFraction": round((fy-t)/h, 5),
            "footMinusSilhouetteCenterPx": round(fx-(l+r)/2, 3),
        })
    return result


def inspect(record):
    rel = record["path"]
    path = (ROOT / rel).resolve()
    if not path.is_relative_to(PAINTED.resolve()):
        raise ValueError("unsafe path: " + rel)
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != record["sha256"]:
        raise ValueError("checksum mismatch: " + rel)
    with Image.open(path) as img:
        if img.size != (record["width"], record["height"]):
            raise ValueError("canvas mismatch: " + rel)
        if "A" not in img.getbands():
            raise ValueError("missing alpha channel: " + rel)
        alpha = img.getchannel("A")
        if alpha.getextrema()[0] != 0:
            raise ValueError("missing fully transparent pixels: " + rel)
        foot = record.get("foot")
        if not isinstance(foot, list) or len(foot) != 2 or not all(isinstance(v, (int, float)) and math.isfinite(v) for v in foot):
            raise ValueError("missing or invalid registered foot: " + rel)
        if not (0 <= foot[0] <= img.width and 0 <= foot[1] <= img.height):
            raise ValueError("registered foot outside canvas: " + rel)
        result = measure(alpha, foot)
    return {"path": rel, **result}


def inspect_candidate(root, record, *, size, anchor, anchor_kind):
    """Measure staging art without promoting it or inferring body contacts."""
    rel = record["path"]
    path = (root / rel).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError("unsafe candidate path: " + rel)
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if record.get("sha256") and digest != record["sha256"]:
        raise ValueError("candidate checksum mismatch: " + rel)
    with Image.open(path) as img:
        if list(img.size) != size or "A" not in img.getbands():
            raise ValueError("candidate dimensions or alpha mismatch: " + rel)
        alpha = img.getchannel("A")
        if alpha.getextrema()[0] != 0:
            raise ValueError("candidate lacks transparent pixels: " + rel)
        if not (0 <= anchor[0] < img.width and 0 <= anchor[1] < img.height):
            raise ValueError("candidate anchor outside canvas: " + rel)
        # A nominal seat/ground anchor is not a verified foot or hip.
        metrics = measure(alpha, None)
        box = metrics["alphaBounds"]["32"]
        metrics.update({
            "nominalAnchor": anchor, "anchorKind": anchor_kind,
            "nominalAnchorMinusAlphaBottomPx": anchor[1] - box[3],
            "nominalAnchorToAlphaTopPx": anchor[1] - box[1],
            "sha256": digest,
            "nativeComponentSize": record.get("component_native_size"),
            "candidateStatus": record.get("status", "candidate_not_integrated"),
        })
    return {"path": str(path.relative_to(ROOT)), **metrics}


def staging_candidates():
    staging = ROOT / "assets/visual/staging"
    rows = []
    for name in ("2026-11-28-final-batch1-traveller", "2026-11-28-traveller-writing"):
        root = staging / name
        manifest = json.loads((root / "manifest.json").read_text())
        for record in manifest["assets"]:
            rows.append(inspect_candidate(
                root, record,
                size=record.get("canvas", manifest.get("dimensions")),
                anchor=record.get("anchor", manifest.get("nominal_anchor")),
                anchor_kind="nominal_seated" if name.endswith("writing") else "nominal_ground",
            ))
    return rows


def summarize(rows):
    heights = [r["visibleHeightFraction"] for r in rows]
    foot_heights = [r["footToVisibleTopFraction"] for r in rows]
    # Equal canvas draw height is the diagnostic assumption only.
    # Do not treat these percentages as a recommended runtime scaling factor.
    return {
        "frames": len(rows),
        "canvasSizes": sorted(set(tuple(r["canvas"]) for r in rows)),
        "medianVisibleHeightFraction": round(median(heights), 5),
        "visibleHeightFractionSpread": round(max(heights)-min(heights), 5),
        "footToTopFractionSpread": round(max(foot_heights)-min(foot_heights), 5),
        "maxAbsFootBottomOffsetFraction": round(max(abs(r["footMinusVisibleBottomFraction"]) for r in rows), 5),
    }


def self_test():
    a = Image.new("L", (100, 200), 0)
    a.paste(255, (20, 30, 80, 180))
    a.putpixel((10, 20), 31)
    a.putpixel((15, 25), 64)
    v = measure(a, [50, 180])
    assert v["alphaBounds"] == {"32": [15, 25, 80, 180], "128": [20, 30, 80, 180]}
    assert v["visibleHeight"] == 155 and v["footMinusVisibleBottomPx"] == 0
    assert v["footToVisibleTopFraction"] == .775
    v2 = measure(a, [50, 175])
    assert v2["footMinusVisibleBottomPx"] == -5
    assert summarize([v, v2])["footToTopFractionSpread"] == .025
    try:
        measure(Image.new("L", (10, 10), 0), None)
    except ValueError:
        pass
    else:
        raise AssertionError("empty silhouette accepted")
    print("PASS synthetic alpha threshold, foot offset and spread checks")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    self_test()
    if args.self_test:
        return
    manifest = json.loads((PAINTED / "action-runtime.json").read_text())
    result = {
        "schema": 1,
        "interpretation": "Measured alpha bounds and registered-foot offsets only. Compare apparent head/body size and stance in a common rendered ground plane before changing runtime scale; shadows and extended limbs can affect bounds.",
        "players": {},
    }
    if set(manifest["players"]) != {"0", "1", "2", "3"}:
        raise ValueError("player inventory changed; reconcile calibration scope")
    for player, record in sorted(manifest["players"].items()):
        directions = record["walk"]
        if set(directions) != {"up", "down", "right"}:
            raise ValueError("direction inventory changed: " + player)
        data = {}
        for direction, frames in sorted(directions.items()):
            if len(frames) != 4:
                raise ValueError("expected four registered walk frames: " + player + "/" + direction)
            rows = [inspect(frame) for frame in frames]
            summary = summarize(rows)
            data[direction] = {"summary": summary, "frames": rows}
            print("PLAYER", player, direction, json.dumps(summary, separators=(",", ":")))
        all_rows = [r for v in data.values() for r in v["frames"]]
        result["players"][player] = {"directions": data, "combined": summarize(all_rows)}
    count = sum(v["combined"]["frames"] for v in result["players"].values())
    print(f"Measured {count} registered walk frames; no artwork or runtime modified.")
    result["stagedPoseCandidates"] = staging_candidates()
    print(f"Measured {len(result['stagedPoseCandidates'])} staged pose candidates; nominal anchors only, no art promoted.")
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
