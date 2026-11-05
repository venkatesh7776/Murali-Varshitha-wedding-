# QR standee card — Murali & Varshitha

Portrait (3:4) card for an **18 × 24 in** standee, one per event, in the wedding website's theme
(ivory paper + watercolour florals on top, burgundy kolam band below, gold zari seam, Ganesha at
the top centre). The QR sits in a dedicated white frame with gold corner brackets and "SCAN ME".

## Customise

Open `index.html` in Chrome with URL parameters:

```
index.html?event=Reception&date=Wednesday, 18 November 2026&qr=assets/qr-reception.png
```

| Param | What it sets | Default |
|---|---|---|
| `event` | Gold-bordered pill (event name) | Reception |
| `date` | Italic line under the event | Wednesday, 18 November 2026 |
| `qr` | QR image placed in the frame (PNG/SVG path or URL) | empty, dashed "Place QR here" slot |
| `site` | Website address in the footer | www.muralivarshitha.com (demo — replace) |

Use the QR PNG downloaded from the QR management app for each folder. A square QR with its own
small white margin works best; it is shown at 384 × 384 (≈ 5.5 in when printed).

## Export

- **PDF (print):** Chrome → Print → Save as PDF, paper size 18 × 24 in, margins none, background graphics on.
  The card zooms to fill the page exactly.
- **PNG:** screenshot the `#card` element at device scale 3 → 3600 × 4800 px (200 dpi at 18 × 24 in).

Ready-made exports for all four events (blank QR slot) plus a filled sample are in
`~/Desktop/Murali wedding /QR cards/`.

## Assets

- `assets/ganesha.png` — from `public/images/intro/ganesha.webp`
- `assets/floral-corner.png` — watercolour roses, jasmine and mango-leaf corner (generated for this card,
  background removed), mirrored for the left corner
- `assets/sample-qr.png` — demo QR pointing to /wedding-memories (replace with each folder's real QR)
