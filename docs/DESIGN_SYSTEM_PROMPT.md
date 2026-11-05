# Design System Prompt — Murali & Varshitha Wedding

Use this prompt to restyle the QR Photo Management app so it looks like a native part of the
wedding invitation website (https://murali-varshitha-wedding.vercel.app). Keep all existing
functionality (folders, QR generation, guest uploads, notes, voice notes, reactions) and the
Supabase backend unchanged — this is a visual re-skin only.

---

## 1. The couple and the wedding

- **Groom:** Murali N. (B.E., M.S.) — Son of Smt. Manjula K. & Sri Narayanaswamy M. — Karnataka, India
- **Bride:** Varshitha D. S. (B.Sc.) — Daughter of Smt. Bharathi S. & Sri Santhosh M. — Karnataka, India
- **Display order:** always groom first — "Murali N. & Varshitha D. S." (short form: "Murali & Varshitha")
- **Invocation** (top of key screens, above the names, with a small Ganesha icon): *Om Shri Ganeshaya Namah*
- **Language:** English only. A few romanised Sanskrit touches are fine ("Shubha Vivaha").

| Event | Date | Time (IST) | Venue |
|---|---|---|---|
| Reception (main event) | Wed, 18 Nov 2026 | 6:30 pm onwards | Sri Phoolchand Jain Convention Hall, Mulbagal |
| Muhurtham | Thu, 19 Nov 2026 | 4:30 – 5:30 am | Sri Phoolchand Jain Convention Hall, Mulbagal |
| Haldi | Mon, 16 Nov 2026 | 2:00 pm onwards | Murali Home, Doddamadenahalli |
| Mehendi | Tue, 17 Nov 2026 | 11:00 am onwards | Murali Home, Doddamadenahalli |

Display order on the site is Reception → Muhurtham → Haldi → Mehendi (Reception is the headline event).

---

## 2. Theme

**"Royal Indian Heritage × Modern Luxury."** A South Indian temple-wedding feel — warm ivory paper,
deep burgundy, antique gold, marigold and jasmine — executed with the restraint of a luxury
stationery studio: generous whitespace, thin gold hairlines, soft shadows, slow silky motion.
Never loud, glossy, neon or cluttered.

Light sections (ivory) alternate with dark sections (burgundy with a faint gold kolam pattern).
Dark sections have a scalloped "arch edge" top and bottom where they meet light sections.

---

## 3. Colour tokens

```css
--maroon:       #651E2B;  /* headings on light, primary buttons */
--burgundy:     #48141F;  /* dark section background, deepest tone */
--ivory:        #FAF5EC;  /* page background */
--ivory-deep:   #F3EAD9;  /* cards, placeholders */
--blush:        #F5E9E4;  /* soft light section (RSVP) */
--rose:         #E8D4CF;
--gold:         #C5A15B;  /* accents, hairlines, gold buttons */
--gold-muted:   #DCC58E;  /* labels on dark, hover of gold buttons */
--temple-green: #354C3B;  /* rare accent */
--charcoal:     #302723;  /* body text */
--ink-muted:    charcoal 68% mixed into ivory;   /* secondary text */
--gold-line:    gold at 55% opacity;  --gold-hair: gold at 28% opacity
```

Folder cards (memories): back panel **warm sand** `#DCC8A3 → #CDB68C`, front pocket **cream paper**
`#F7EFE0 → #EFE3CB` with a `#D9C49D` border; text in maroon; labels in antique gold `#9A7535`.

Selection colour: gold-muted background with burgundy text. Focus ring: 2px gold, 3px offset.

---

## 4. Typography

| Role | Font | Style |
|---|---|---|
| Display / headings / names | **Cormorant Garamond** (Google Fonts, 300–600, italic) | Regular weight 400, tight leading (~1.0–1.1), slight negative tracking on names |
| Body / UI | **Inter** | 16–17px, line-height 1.7 |
| Labels / eyebrows | Inter 500 | 12px (10–11px small), UPPERCASE, letter-spacing 0.22em, gold |
| Lead / taglines | Cormorant Garamond *italic* | 18–22px, muted ink |

Fluid scale:
- Couple names: `clamp(2.25rem, 1.4rem + 4.2vw, 4.5rem)`
- H2: `clamp(2.125rem, 1.6rem + 2.4vw, 3.5rem)`
- H3: `clamp(1.5rem, 1.3rem + 0.9vw, 2rem)`
- Lead: `clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)`

Pattern for every section header: **gold eyebrow label → Cormorant heading → small lotus divider →
italic lead line.** The "&" between names is Cormorant italic in gold.

---

## 5. Shapes, ornaments and components

- **Arch frame:** images sit in temple-arch frames — `border-radius: 999px 999px 4px 4px`,
  often with an offset thin gold outline behind and a small lotus at the apex.
- **Lotus divider:** a tiny gold line-art lotus between two fading gold hairlines.
- **Kolam texture:** a repeating 64px line pattern (circle + diamond + corner curls) in soft gold,
  at 5–7% opacity on burgundy; ~20% on sand.
- **Mandala watermark:** large line mandala at 5–7% opacity behind content.
- **Zari band:** twin 1px gold rules with a row of small diamonds and dots between (woven sari border).
- **Toranam / garlands, gopuram, mandap, kalash:** used as hero/closing artwork only.
- **Buttons:** 2px radius, Inter 14px 500, letter-spacing 0.06em, min-height 44px.
  - Gold: gold bg, burgundy text, hover gold-muted.
  - Maroon: maroon bg, ivory text, hover burgundy.
  - Ghost: 1px gold-line border, hover gold tint.
  - Text links: maroon text with a gold underline border that turns maroon on hover.
  - Pill (back buttons): rounded-full, gold/50 border, fills maroon on hover.
- **Cards:** ivory/70 with a 1px gold/35 border, 2px radius, generous padding; shadows are soft and
  warm (`0 24px 50px -28px rgba(72,20,31,0.55)`).
- **Polaroid prints:** ivory border (3% padding, larger bottom), slight rotation (±2–8°), soft shadow,
  italic Cormorant caption.
- **Folder card (memories):** tab + sand back panel with faint kolam; 1–2 photo prints peeking out,
  rotated; cream front pocket with one faded zari line, mandala whisper, folder name (Cormorant,
  maroon), "N PHOTOS · DATE" label, small round arrow button. Hover: prints lift, mandala turns.
- **Floating dock:** round 48px burgundy/90 buttons with a gold/50 border, bottom-right (music mute/unmute).
- **Viewer / modals:** solid deep burgundy `#1F0A0F` backdrop for photos; ivory dialogs with gold border
  and burgundy/70 blurred backdrop for forms.

---

## 6. Illustration style (for any generated artwork)

> A hand-painted Indian heritage illustration in fine gouache and transparent watercolour on warm
> ivory cotton-rag paper with a subtle visible paper grain. Delicate hand-applied gold-leaf highlights
> on edges, finials and ornament only, never flat metallic. Inspired by Tanjore and Mysore paintings
> and Mughal-Rajput miniatures, but with the restraint, calm negative space and soft edges of a modern
> luxury wedding stationery studio. Soft, warm, natural light with gentle atmospheric haze and soft
> shadows. Palette strictly limited to deep maroon #651E2B, royal burgundy #48141F, warm ivory
> #FAF5EC, antique gold #C5A15B, muted gold #DCC58E, temple green #354C3B and soft rose #E8D4CF,
> with small accents of muted marigold orange. Slightly desaturated, warm, elegant grade.
> AVOID: people and faces (for artwork), text, letters, numbers, logos, watermarks, frames,
> glossy 3D render look, neon or saturated colours, lens flare, clutter, cartoon/clip-art.

Subjects used: temple gopuram at golden hour, mango-leaf toranam with jasmine and red rose garlands
and brass bells, brass lamps and diyas, kalash, haldi bowls with marigolds, mehendi cones and henna
bowls, homa fire and coconut for the Muhurtham, reception stage with a carved gold sofa and floral
backdrop. Couple portraits are illustrated (maroon backdrop, ivory sherwani / ivory-and-maroon saree).

**Exception — guest photo examples:** where the UI needs "photos guests took", use candid,
photorealistic smartphone-style shots (group selfies at haldi, guests filming the reception stage on
phones, guests photographing mehendi) shown as Polaroid prints — so it clearly reads as guest-captured.

Icons: thin line icons (1.2–1.5px stroke), currentColor, rounded caps. The Ganesha icon is a small
watercolour Ganesha (transparent PNG/WebP) shown at ~48–80px above the invocation.

---

## 7. Motion

- Easing "silk": `cubic-bezier(0.22, 0.61, 0.36, 1)`; "veil": `cubic-bezier(0.65, 0, 0.35, 1)`.
- Durations: 300ms (hover), 600ms (reveal), 1100ms (hero).
- Content fades/rises in on scroll (staggered 80–150ms); images reveal with a soft scale.
- Photos shimmer (ivory → faint gold → ivory) while loading, then fade in.
- Respect `prefers-reduced-motion` (shorten or disable animations).

---

## 8. Voice & copy

Warm, gracious, family-first, English. Short sentences. Examples used on the site:

- "With the blessings of our elders, we cordially invite you and your family…"
- "Two souls, one beautiful journey, forever intertwined."
- "Every Moment, A Memory" / eyebrow "CAPTURE. SHARE. RELIVE."
- "Scan the QR codes placed at each wedding event and upload the beautiful moments you capture."
- Empty states are gentle: "No photos or folders are available yet."
- Credits: "Shared by {guest name}", "Shared by the couple".

---

## 9. Layout & responsiveness

- Content max-width 70rem; side gutter `clamp(1rem, 0.5rem + 2.5vw, 2.5rem)`; section padding
  `clamp(5rem, 3rem + 9vw, 10rem)` top and bottom.
- Two-column layouts collapse to one column on phones (visual first, then text, centred).
- Touch targets ≥ 44px. No horizontal scroll at 360px.
- Light and dark sections alternate; every dark section uses the kolam texture + arch edges.

---

## 10. Site structure (wedding website)

Homepage, in order:
1. **Intro cover** — temple-arch painting, Ganesha icon, invocation, names, "EXPLORE OUR WEDDING" (starts music)
2. **Hero** — gopuram at sunset, garlands, Ganesha, names, tagline, "Wednesday, 18 November 2026"
3. **Meet the Couple** — arch portraits, qualifications, parents (names in bold maroon), "Karnataka, India"
4. **Countdown** (dark) — to the Reception, 18 Nov 2026 6:30 pm IST
5. **The Celebrations** — Reception, Muhurtham, Haldi, Mehendi cards (arch artwork, IST + EST for
   Reception/Muhurtham, Get Directions, Add to calendar)
6. **Venue** (dark) — Sri Phoolchand Jain Convention Hall, Get Directions
7. **RSVP** (blush) — reception only, "Submit RSVP" opens a dialog form
8. **Every Moment, A Memory** (dark) — Polaroid collage + CTA to `/wedding-memories`
9. **Event Organiser & Photography** — Photography: Unscripted Stories by Santhosh Vemula
   (Instagram @unscriptedstoriesbysv); organiser details to come
10. **Closing / Blessings** (dark) — message, names, date, "Shower blessings" (rice & petal animation), mandap art

Memories pages (read-only, data from the QR app's Supabase):
- `/wedding-memories` — burgundy header (Ganesha, "EVERY MOMENT, A MEMORY", "Wedding Memories",
  names, lotus) then left-aligned grid of folder cards (2 per row on phones, ~280px on desktop)
- `/wedding-memories/[folderId]` — slim sticky ivory bar ("All Albums" pill + folder name), photo
  count, masonry grid; tiles show note/voice/reaction badges and "Shared by…"; full-screen viewer with
  a details panel (who/when, note in Cormorant italic, voice-note player, reactions)

---

## 11. Data structure (shared Supabase project — source of truth is the QR app)

- `memory_folders` — `id` (text), `name`, `event_date` (date), `event_type`, `created_at`
- `memories` — `id`, `folder_id` → memory_folders, `source` ('guest' | 'couple'), `photo_name`,
  `message` (≤1000), `guest_name` (≤60), `reactions` (jsonb emoji → count), `voice_name`, `created_at`
- `memory_folder_summaries` (view) — folder + `photo_count` + `preview_names` (latest 2 photos)
- Storage bucket `memories` (private) — files at `{folderId}/{name}`, served via short-lived signed URLs
- RLS on with no public policies; both apps read/write server-side with the service-role key only.

---

## 12. Instruction for the QR management app

Restyle every screen of the QR Photo Management app (dashboard, folder view, QR card designer,
guest upload page, memory viewer) using the tokens, typography, ornaments, motion and copy voice
above, so it feels like the same product as the wedding website. Specifically:

- Dashboard folders use the **folder card** design from §5.
- The guest upload page (QR destination) opens with the Ganesha icon, invocation, "Murali N. &
  Varshitha D. S.", the folder/event name in Cormorant, and a gold primary "Share your photos" button.
- QR cards: ivory paper with a fine gold border and zari band, Ganesha icon, the couple's names,
  the event name and date, the QR code centred in a thin gold frame, and the line
  "Scan to share your photos with us".
- The memory viewer matches the website's viewer (burgundy backdrop, details side panel).
- Keep all existing functionality, routes, APIs and the Supabase schema exactly as they are.
