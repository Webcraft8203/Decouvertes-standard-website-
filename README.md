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
  vision-nano.html       Vision Nano — nano-class drone (illustrated; add real photos/specs when ready)
  sandesh-device.html    Sandesh communication device (illustrated; add real photos/specs when ready)

software/             Decouvertes Software — GCS, T12 Drone App, AI Vision App, Sandesh App
  index.html            Hub + per-app pages (gcs, t12-drone-app, ai-vision-app, sandesh-app)

careers/              Careers hub + one page per open role (each has a mailto Apply link)

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
    products/           Vision Nano and Sandesh Device illustrations (SVG) — swap for photos
    careers/            Team photo used on the careers page and homepage slider
    logo.png, logo-mark.png
  downloads/          Installers served by the Download buttons (GCS .exe, AI Vision .apk)

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
  fallback (`data-fallback`) if it fails to load. `blog.html`
  still uses Unsplash placeholder images and placeholder articles (`href="#"`) —
  replace with real posts and photos, or remove the page and its nav link.
- **Product specs:** the figures on `vision-1.html`, `vision-3.html`, `vision-4.html`
  and `payload-delivery-system.html` are indicative placeholders (Vision 2.0's
  are real, taken from the official spec-sheet poster). Update them once real
  numbers are confirmed.
- **Downloads:** the GCS and AI Vision buttons link straight to the files in
  `assets/downloads/`. To ship a new build, replace the file (keep the name, or
  update the `href` in `software/gcs.html` / `software/ai-vision-app.html`) and
  update the version/size shown beside the button. The T12 and Sandesh pages
  still use a request-by-email flow until their builds are available. Note the
  installers are large (~120 MB total) — host them on storage/CDN if your static
  host limits file size. The homepage documentary is a YouTube embed, which only
  plays from a hosted `https://` site (opened from disk it shows Error 153).
- **Social links:** the footer icons (YouTube, LinkedIn, Instagram) link to the
  company profiles — the same three links are repeated in every page footer.
- **Contact:** the site has no backend or forms — every enquiry path is a
  `mailto:hello@decouvertes.in` link with a pre-filled subject tag. `contact.html`
  embeds a Google Maps iframe by address — adjust the `q=` value to update it.
- **Legal pages:** the India-specific templates in `legal/` need review by
  qualified counsel before being relied on (see the note on each page).

## SEO

Every page has a unique title and description, a canonical URL, `hreflang="en-IN"`,
Open Graph / Twitter tags and JSON-LD structured data (Organization + WebSite +
FAQPage on the home page; Product, SoftwareApplication, JobPosting and
BreadcrumbList on the relevant pages). `sitemap.xml` and `robots.txt` sit at the
project root. All absolute URLs assume the site is served at
`https://www.decouvertes.in` — if the final domain differs, find-and-replace it
across the HTML files, `sitemap.xml` and `robots.txt`. After deploying, submit
the sitemap in Google Search Console and Bing Webmaster Tools.

## Content source

Copy and company details were taken from the existing site, https://www.decouvertes.in/
