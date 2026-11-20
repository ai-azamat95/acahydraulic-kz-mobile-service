# Equipment selection: owner photographs

The existing homepage `/#calculator` equipment grid is rendered by
`client/src/components/CostCalculator.tsx`. All nine equipment IDs, labels,
selection transitions and surrounding layout are preserved.

Only these existing cards replace generated illustrations:

| Existing ID | Owner-supplied file | First-party WebP |
| --- | --- | --- |
| excavator | img_e2db68d81146.jpg | owner-excavator.webp |
| bulldozer | img_7671d7725b1e.jpg | owner-bulldozer.webp |
| milling | img_fedbad6fe281.jpg | owner-road-milling.webp |
| piling | img_83c7377809bd.jpg | owner-drilling-rig.webp |

The drilling photograph belongs to the already existing «Буровая / сваебойная»
card, not the HDD or loader card. No card, model, service, route or claim of
completed work is added. Subject/brand descriptions come from the owner;
no model is inferred from photographs.

Images are EXIF-transposed, converted to RGB, stripped of source metadata and
encoded as WebP (quality 84, method 6), longest edge at most 960px, without
upscaling. Dimensions are declared per image. The original 4:3 mobile / 3:2
desktop image boxes stay unchanged. Owner photographs use centered `contain`
so the narrow portrait photos are not aggressively cropped; the existing dark
card background remains visible beside them. Unmatched cards retain their
original assets, alt text and cover behavior.

Acceptance: typecheck, full Pages build/run-step pipeline, unit tests and
Chromium DOM checks at 360, 390 and 1440px. Screenshots were captured, but the
configured vision service rejected the model; this is not visual sign-off.
DOM checks verify nine loaded images, original box ratios, no horizontal
overflow and all four changed-card transitions. No real inquiry was sent.
