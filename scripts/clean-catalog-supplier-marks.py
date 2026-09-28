#!/usr/bin/env python3
"""Remove OCR-confirmed supplier text from real catalogue photos.

This uses OpenCV's classical Telea inpainting. It does not generate or replace
the product photo; only the OCR bounding boxes recorded by the audit are
retouched. Run against a preview directory first, then use --in-place after a
visual review.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path

import cv2
import numpy as np


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def rectangle_for(box: dict[str, float], width: int, height: int) -> tuple[int, int, int, int]:
    box_height = max(1.0, box["height"] * height)
    horizontal_padding = max(6.0, box_height * 0.28)
    vertical_padding = max(4.0, box_height * 0.24)

    left = box["x"] * width - horizontal_padding
    top = (1.0 - box["y"] - box["height"]) * height - vertical_padding
    right = (box["x"] + box["width"]) * width + horizontal_padding
    bottom = (1.0 - box["y"]) * height + vertical_padding

    return (
        max(0, int(round(left))),
        max(0, int(round(top))),
        min(width, int(round(right))),
        min(height, int(round(bottom))),
    )


def merge_nearby_rectangles(rectangles: list[dict[str, object]]) -> list[dict[str, object]]:
    groups: list[dict[str, object]] = []
    for rectangle in sorted(rectangles, key=lambda item: (item["top"], item["left"])):
        merged = False
        for group in groups:
            horizontal_overlap = max(
                0,
                min(group["right"], rectangle["right"]) - max(group["left"], rectangle["left"]),
            )
            narrow_width = max(1, min(group["right"] - group["left"], rectangle["right"] - rectangle["left"]))
            vertical_gap = max(0, rectangle["top"] - group["bottom"], group["top"] - rectangle["bottom"])
            max_height = max(group["bottom"] - group["top"], rectangle["bottom"] - rectangle["top"])
            if horizontal_overlap / narrow_width >= 0.55 and vertical_gap <= max_height:
                group["left"] = min(group["left"], rectangle["left"])
                group["top"] = min(group["top"], rectangle["top"])
                group["right"] = max(group["right"], rectangle["right"])
                group["bottom"] = max(group["bottom"], rectangle["bottom"])
                group["texts"].append(rectangle["text"])
                group["force_methods"].append(rectangle.get("forceMethod"))
                merged = True
                break
        if not merged:
            groups.append(
                {
                    "left": rectangle["left"],
                    "top": rectangle["top"],
                    "right": rectangle["right"],
                    "bottom": rectangle["bottom"],
                    "texts": [rectangle["text"]],
                    "force_methods": [rectangle.get("forceMethod")],
                }
            )
    return groups


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit", required=True, type=Path)
    parser.add_argument("--report", required=True, type=Path)
    destination = parser.add_mutually_exclusive_group(required=True)
    destination.add_argument("--in-place", action="store_true")
    destination.add_argument("--output-root", type=Path)
    parser.add_argument("--limit", type=int)
    parser.add_argument("--quality", type=int, default=82)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    audit = json.loads(args.audit.read_text(encoding="utf-8"))
    findings = audit.get("matches", [])
    if args.limit:
        findings = findings[: args.limit]

    cleaned: list[dict[str, object]] = []
    failures: list[dict[str, str]] = []

    for finding in findings:
        source = Path(finding["path"])
        image = cv2.imread(str(source), cv2.IMREAD_COLOR)
        if image is None:
            failures.append({"path": str(source), "error": "OpenCV could not decode image"})
            continue

        height, width = image.shape[:2]
        mask = np.zeros((height, width), dtype=np.uint8)
        cleaned_image = image.copy()
        raw_rectangles: list[dict[str, object]] = []
        for match in finding.get("matches", []):
            left, top, right, bottom = rectangle_for(match["box"], width, height)
            raw_rectangles.append(
                {
                    "text": match["text"],
                    "forceMethod": match.get("forceMethod"),
                    "left": left,
                    "top": top,
                    "right": right,
                    "bottom": bottom,
                }
            )

        rectangles: list[dict[str, object]] = []
        for rectangle in merge_nearby_rectangles(raw_rectangles):
            left = rectangle["left"]
            top = rectangle["top"]
            right = rectangle["right"]
            bottom = rectangle["bottom"]
            margin = max(10, int(round((bottom - top) * 0.8)))
            outer_left = max(0, left - margin)
            outer_top = max(0, top - margin)
            outer_right = min(width, right + margin)
            outer_bottom = min(height, bottom + margin)
            surrounding = image[outer_top:outer_bottom, outer_left:outer_right]
            surrounding_mask = np.ones(surrounding.shape[:2], dtype=bool)
            surrounding_mask[
                top - outer_top : bottom - outer_top,
                left - outer_left : right - outer_left,
            ] = False
            surrounding_pixels = surrounding[surrounding_mask]
            white_background = bool(
                surrounding_pixels.size
                and np.mean(np.all(surrounding_pixels >= 242, axis=1)) >= 0.72
            )
            sample_bottom = min(height, bottom + max(12, (bottom - top) * 2))
            below = image[bottom:sample_bottom, left:right]
            below_pixels = below.reshape(-1, 3) if below.size else np.empty((0, 3))
            below_median = np.median(below_pixels, axis=0) if below_pixels.size else np.zeros(3)
            light_area_below = bool(
                below_pixels.size
                and (
                    np.mean(np.all(below_pixels >= 220, axis=1)) >= 0.38
                    or np.min(below_median) >= 185
                )
            )
            force_inpaint = "telea-inpaint" in rectangle["force_methods"]
            if (white_background or light_area_below) and not force_inpaint:
                fill_color = below_median if light_area_below else np.array([255, 255, 255])
                cleaned_image[top:bottom, left:right] = fill_color.astype(np.uint8)
                method = "sampled-light-fill" if light_area_below else "white-fill"
            else:
                cv2.rectangle(mask, (left, top), (right, bottom), 255, thickness=-1)
                method = "telea-inpaint"
            rectangles.append(
                {
                    "text": rectangle["texts"],
                    "method": method,
                    "pixels": {"left": left, "top": top, "right": right, "bottom": bottom},
                }
            )

        if not rectangles:
            failures.append({"path": str(source), "error": "Audit finding has no OCR boxes"})
            continue

        changed_mask = mask.copy()
        for rectangle in rectangles:
            pixels = rectangle["pixels"]
            cv2.rectangle(
                changed_mask,
                (pixels["left"], pixels["top"]),
                (pixels["right"], pixels["bottom"]),
                255,
                thickness=-1,
            )
        changed_ratio = float(np.count_nonzero(changed_mask)) / float(width * height)
        if changed_ratio > 0.20:
            failures.append({"path": str(source), "error": f"Refusing oversized cleanup mask: {changed_ratio:.3f}"})
            continue

        output = source
        if args.output_root:
            product_id = source.parent.name
            output = args.output_root / product_id / source.name
            output.parent.mkdir(parents=True, exist_ok=True)

        before_hash = sha256(source)
        if np.any(mask):
            cleaned_image = cv2.inpaint(cleaned_image, mask, 9, cv2.INPAINT_TELEA)
        before_std = float(np.std(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)))
        after_std = float(np.std(cv2.cvtColor(cleaned_image, cv2.COLOR_BGR2GRAY)))
        if before_std >= 8 and after_std < max(3, before_std * 0.35):
            failures.append({"path": str(source), "error": f"Refusing low-detail output: {before_std:.2f} -> {after_std:.2f}"})
            continue

        encoded_ok, encoded = cv2.imencode('.webp', cleaned_image, [cv2.IMWRITE_WEBP_QUALITY, args.quality])
        if not encoded_ok:
            failures.append({"path": str(source), "error": f"OpenCV could not encode {output}"})
            continue
        temporary_output = output.with_name(f"{output.name}.tmp-{os.getpid()}")
        temporary_output.write_bytes(encoded.tobytes())
        temporary_output.replace(output)

        cleaned.append(
            {
                "path": str(source),
                "output": str(output),
                "beforeSha256": before_hash,
                "afterSha256": sha256(output),
                "bytes": output.stat().st_size,
                "changedRatio": changed_ratio,
                "rectangles": rectangles,
            }
        )

    report = {"cleaned": cleaned, "failures": failures}
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Cleaned {len(cleaned)} images; {len(failures)} failures")
    print(f"Report: {args.report.resolve()}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
