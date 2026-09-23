# Decouvertes — Website

A restrained corporate marketing site for **Decouvertes Future Tech Private Limited**.
Typeface: **Roboto** (the font adanidefence.com uses). White pages with cool
grey-cyan section bands, solid orange corner accents, a dark charcoal hero, a
hamburger + left slide-out menu, and a grey column footer. Brand accent is
Decouvertes orange (`#F26A21`). Layout structure follows adanidefence.com.

Motion is deliberately minimal — a gentle fade-in as sections scroll into view,
the header condensing slightly on scroll, and the stat count-up. Nothing in the
hero animates.

Design tokens live at the top of `assets/css/styles.css` — font stacks, colours
and the `--r-card` / `--r-img` / `--r-btn` radii. Change them there to retune globally.

## Structure

```
index.html          Home (hero slider, stats, recognition, capabilities, partners, CTA)
about.html           Story, mission/vision, timeline, leadership, roadmap
solutions.html        Mission-profile capabilities (surveillance, mapping, inspection, disaster, R&D)
gallery.html          Field journal image grid
blog.html             Media & Insights — articles listing
contact.html          Contact details, direct-line tiles and map

products/             The Vision drone family + mission payload
  index.html            Hub — all 5 products, cards linking to each detail page
  vision-1.html          Vision 1.0 — first fielded platform
  vision-2.html          Vision 2.0 — heavy-lift foldable quadcopter (real specs/photos)
  vision-3.html          Vision 3.0 — VTOL hybrid
  vision-4.html          Vision 4.0 — coaxial platform
  payload-delivery-system.html   Aerial delivery / release module

legal/                Compliance pages (India-specific templates — have counsel review before relying on them)
  privacy.html
  terms.html
  disclaimer.html

assets/
  css/styles.css      Single shared stylesheet (design tokens at the top)
  js/main.js           Header state, mobile nav, sliders (hero/caps/partners/cards),
                        scroll reveals, stat count-up
  img/
    hero/               Hero-slider photography
    gallery/            Field-journal photos, the Vision 2.0 spec-sheet poster
    certificates/       DPIIT / startup recognition
    partners/           Partner & client logos
    logo.png, logo-mark.png

logo/                 Original/source logo + partner artwork (not referenced by the live site)
README.md
```

**Path depth matters:** pages inside `products/` and `legal/` reference assets as
`../assets/...` and link to root pages as `../about.html` etc. — the flat pages at
the project root use plain `assets/...` and `about.html`. If you add a new page,
match this pattern based on where you put it. All internal links were verified
automatically after the last restructure (every `href`/`src` resolves to a real
file on disk).

No build step. Open `index.html` directly (double-click works — everything uses
relative paths), or deploy the whole folder to any static host (Netlify, Vercel,
GitHub Pages, S3, nginx…) — the URL structure matches the folder structure
(e.g. `/products/vision-2.html`, `/legal/privacy.html`).

## Customising

- **Colours / fonts / spacing:** edit the `:root` tokens at the top of `assets/css/styles.css`.
- **Photos:** drop files into the matching `assets/img/` subfolder and point the
  `src`/`style="background-image:url(...)"` there. Every `<img>` has a gradient
  fallback (`data-fallback`) if it fails to load. `solutions.html` and `blog.html`
  still use Unsplash placeholder URLs for some section images — swap those for
  real photos the same way when you have them.
- **Product specs:** the figures on `vision-1.html`, `vision-3.html`, `vision-4.html`
  and `payload-delivery-system.html` are indicative placeholders (Vision 2.0's
  are real, taken from the official spec-sheet poster). Update them once real
  numbers are confirmed.
- **Contact:** the site has no backend or forms — every enquiry path is a
  `mailto:hello@decouvertes.in` link with a pre-filled subject tag. `contact.html`
  embeds a Google Maps iframe by address — adjust the `q=` value to update it.
- **Legal pages:** the India-specific templates in `legal/` need review by
  qualified counsel before being relied on (see the note on each page).

## Content source

Copy and company details were taken from the existing site, https://www.decouvertes.in/
