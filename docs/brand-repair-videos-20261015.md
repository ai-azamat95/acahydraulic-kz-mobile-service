# Brand repair videos — 2026-10-15

## Scope

Add a visible video list and an on-demand player to the existing Hitachi, Hyundai, Komatsu, Wirtgen and Caterpillar repair pages. Titles, descriptions and direct links are rendered into the initial HTML by the existing static React renderer. A visitor opens the external player explicitly; the initial gallery does not request an embedded TikTok or YouTube player. Existing case/blog explanations and the paid diagnostics page remain available as next steps.

The selected inventory contains 14 videos across the five brand pages. It is in `shared/brand-repair-videos.json`; `client/src/components/BrandRepairVideos.tsx` presents it. This change prepares the pages for review. It does not establish Google/TikTok indexation, traffic, enquiries, paid orders or profit.

## Provenance

Previously confirmed TikTok sources were read from the repository's current `main` and existing public repair pages:

| Brand/model | TikTok video ID | Existing repository evidence |
| --- | --- | --- |
| Hitachi 330-5G, unstable pressure and jerky boom | `7529938314011380997` | `client/src/pages/Cases.tsx` and the corresponding diagnostic case |
| Hyundai R300LC-9S, engine speed dropped while travelling | `7548854684765687045` | `client/src/pages/brands/BrandHyundai.tsx` |
| Komatsu, work on site | `7487125515283827974` | `client/src/pages/brands/BrandKomatsu.tsx`; no more specific model claimed |
| CAT 330DL, power loss after warming up | `7648329720278289672` | `client/src/pages/Cases.tsx` and the corresponding diagnostic case |
| CAT 330D2L, recovery after flooding | `7630110235562085650` | `client/src/pages/Cases.tsx` |

TikTok URLs use the official account `https://www.tiktok.com/@acaservice01/video/{id}`. The previous Wirtgen W1500 TikTok source `7530533236984876344` remains in its existing page; the new gallery uses the verified YouTube video below.

The additional YouTube sources were checked against the ACA Hydraulic channel's current official public RSS feed on 2026-10-15:

`https://www.youtube.com/feeds/videos.xml?channel_id=UCqYD2yMjpOUvz7irDqBWfNA`

| Model/topic | YouTube video ID | Scope supported by the published title |
| --- | --- | --- |
| Hyundai HX300SL | `EmwYLJDrsh8` | Hydraulic repair, part 2 |
| Hyundai HX300SL | `hTdVBbP4r_s` | Repair on site, part 3 |
| Hyundai HX300SL | `okwuAcykkzs` | Hydraulic repair process |
| Hyundai HX300SL | `kEzSzcbIdA8` | Checking and handing the excavator over to the customer |
| Wirtgen 1500 | `QCoNajhkgnU` | No travel, hydraulic diagnosis and repair |
| CAT M318 | `Sk9HX4HzSoo` | Pilot distributor/manifold repair |

YouTube watch URLs are `https://www.youtube.com/watch?v={id}`. Display titles are concise Russian descriptions of those verified subjects. The four HX300SL videos and the R300LC-9S repair are separate model groups; they must not be presented as one machine or one continuous repair.

The current YouTube Studio content listing was also read on 2026-10-15: it showed 20 Shorts and one long video. That account view and the official public [ACA Hydraulic Shorts listing](https://www.youtube.com/@acahydraulic/shorts) supplied three further CAT M318 videos outside the current RSS window:

| Model/topic | Direct source | Scope supported by the published title |
| --- | --- | --- |
| CAT M318 | [spniTTX9ECI](https://www.youtube.com/watch?v=spniTTX9ECI) | No travel: hydraulic diagnosis, first part |
| CAT M318 | [ioaCaNVvlfo](https://www.youtube.com/watch?v=ioaCaNVvlfo) | Hydraulic diagnosis and repair, part 2 |
| CAT M318 | [ZW7GWSV3-BE](https://www.youtube.com/watch?v=ZW7GWSV3-BE) | Final check after repair, part 3 |

The Caterpillar gallery contains six videos. CAT M318, CAT 330DL and CAT 330D2L are distinct model groups; the gallery does not claim that all six videos show one repair. The separate pilot distributor video `Sk9HX4HzSoo` is not assigned a numbered phase of the three-part M318 sequence.

## Limits and validation

This is a selected inventory of confirmed sources, not an exhaustive audit of every account upload. No missing Hyundai part 1, exact chronology beyond the published part labels, complete diagnostic/repair/result phase mapping, model-specific measurements or outcome is inferred from a title alone. Existing video titles containing numbered parts are preserved without inventing the rest of a series.

`tests/brand-repair-videos.test.mjs` checks all five generated brand pages for gallery titles, explanatory text and direct source links before JavaScript; the confirmed Hitachi source and distinct Hyundai models; existing case/blog destinations; and absence of an initial external video iframe. A successful build and browser interaction checks are separate verification steps. Production publication requires the user's approval of the prepared change.

Local verification on 2026-10-15 passed: TypeScript, the production build and static route/feed generation, all 216 Node tests, and 13 contact-intent/analytics Vitest tests. Browser checks at a 390 px viewport confirmed no horizontal overflow, changing the selected Hyundai episode, moving focus to the player and loading the matching YouTube embed. The initial player is absent until clicked. External platform playback and anonymous TikTok availability remain platform-dependent and are not established by these application checks.
