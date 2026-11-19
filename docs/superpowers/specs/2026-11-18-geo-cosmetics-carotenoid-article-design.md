# GEO article: natural carotenoids in cosmetics and personal care

- **Date**: 2026-11-18
- **Site**: earthhue.net (Next.js 16 App Router, 7 locales, SQLite content store)
- **Status**: implemented and live

## Goal

Add one new GEO (Generative Engine Optimization) article to the site's Articles
column, written to the site's own product positioning, and make sure the
machine-readable surfaces the site already exposes pick it up.

## Topic selection

The site positions itself in `src/lib/llms.ts` and the home page copy as a
manufacturer of **fermentation-derived natural carotenoids** (astaxanthin,
lutein, lycopene, beta-carotene, zeaxanthin) for food, nutraceutical, cosmetic
and pharmaceutical formulators.

All eight articles previously published on the site are food and beverage
focused. Cosmetics and personal care are named as target markets but had zero
coverage. The topic chosen was therefore:

> Natural carotenoids in cosmetics and personal care — how to specify one for
> skin care, sun care and colour cosmetic formulations.

It fills a real gap, maps onto products that exist in the catalogue
(`eh-astaxanthin-yeast-110`, `eh-lycopene-ferment-130`,
`eh-lycopene-blakeslea-131`, `eh-betacarotene-ferment-140`,
`eh-lutein-ferment-120`), and does not duplicate any existing article.

## Editorial source of truth

The site's GEO editorial spec is the `writing_template:earthhue` prompt stored in
the GEO publishing system at `/opt/geo-publisher` (key `writing_template:earthhue`
in `data/geo.db`). It fixes the regulatory facts that must not be improvised
(E-number map, the EU novel-food track for astaxanthin, the US GRAS route, the
absence of a single FDA phase-out deadline, the 2021 price anchors) and the
article structure.

The article follows that template:

1. H1 written as the buyer's actual question
2. Answer-first paragraph that stands alone
3. Comparison table of the four carotenoids against eleven parameters
4. Specification table with twelve rows
5. Depth sections, including the two colour-degradation mechanisms
6. "Regulatory status" section covering EU, US, Japan and Korea
7. Route comparison table (fermentation / botanical-algal / petrochemical)
8. "Frequently asked questions" with six buyer questions
9. Short conclusion with a plain mention of the fermentation series and links
   to the catalogue and the contact page

No health or therapeutic claim is made, and every regulatory statement is
limited to what the template's verified fact list supports.

## Languages

English and Chinese were written in full.

The site's fallback chain was `zh > en`, which meant a reader landing on
`/ja`, `/ko`, `/es`, `/fr` or `/de` for an article that only had English and
Chinese got the **Chinese** text on a non-Chinese page. The chain was inverted
to `en > zh` in `src/lib/i18n.ts`, so untranslated locales now fall back to
English, matching what the eight older articles already did. English is the
site's declared default locale (`DEFAULT_LOCALE` in `src/lib/seo.ts`) and the
language the source material is authored in.

## Supporting fixes required for the article to work

Two defects in the article renderer blocked the GEO payload. Both were found
while verifying the new article against the live site.

### FAQ extraction never matched the house format

`extractFaq()` in `src/app/[locale]/articles/[slug]/page.tsx` only recognised a
question written as `### Q: ...`, `**Q: ...**` or `- **...**`. The format the
editorial template and every existing article actually use — a plain question
heading, `### Is it heat stable?` — did not match. The consequence was that
**no existing article rendered a FAQ accordion and none emitted `FAQPage`
structured data**, verified on the live site as zero `<details>` elements and
zero `FAQPage` blocks.

The extractor now accepts the plain question heading form and a bare bold
question line, and the FAQ section heading is matched in every published
locale so the Chinese article emits its own structured data.

### The FAQ accordion heading was hardcoded in English

The accordion heading rendered as `Frequently asked questions` on every
locale. It is now a per-locale map, following the same pattern the codebase
already uses for the per-locale page titles.

## Delivery mechanics

The article is inserted directly into the `articles` table rather than pushed
through the GEO publishing system's site-sync, because the publishing system's
payload shape does not match this site's ingestion endpoint. See "Follow-up
work" below.

- Database backed up with `better-sqlite3`'s `db.backup()` before the write
- The insert is a single parameterised statement, guarded by a slug-exists
  check and by assertions that both bodies carry the expected H1 and a
  recognisable FAQ heading
- The article page is `force-dynamic`, so the new row is live without a
  rebuild; the code changes did require `npm run build` and a PM2 restart
- Cover image generated to match the house style (high-key product photography
  on marble), cropped to 1920x1080 and written to `public/uploads/articles/`

## Verification performed

- All 18 routes return HTTP 200; error log growth zero
- New article: 6 `FAQPage` questions, 6 `<details>` accordions, 3 tables,
  1 `<h1>`, correct canonical, 8 `hrefLang` alternates, 10 internal product
  links, in both `/en` and `/zh`
- `/ja` renders the English body, confirming the inverted fallback
- All eight older articles now emit `FAQPage` structured data and accordions
  that they previously did not
- `llms.txt` lists the article (12 entries), `llms-full.txt` contains the body,
  `sitemap.xml` lists all seven locale URLs, and the `/md/{locale}/...` mirror
  serves both languages

## Follow-up work (not part of this change)

1. **Site sync is not configured for EarthHue.** `site_push_earthhue` is absent
   from the GEO publishing system's settings, so the eight articles it generated
   between 2026-10-25 and 2026-11-13 went to dev.to and Mastodon but never
   reached earthhue.net. Configuring it requires adapting
   `/api/articles` to the publisher's payload shape and adding the
   `x-article-secret` check it assumes.
2. **The content API has no authentication.** Every write route
   (`/api/articles`, `/api/products`, `/api/about/content`, `/api/upload`,
   `/api/home/images`, `/api/about/images`) accepts POST, PUT and DELETE from
   anyone. The admin password is a client-side check only. Anyone on the
   internet can rewrite the About page or delete products and articles.
3. **Eight articles still have no translation** beyond English, and the eight
   that do have `en` + `zh` are missing the other five locales.
4. **33 images carry no alt text** (30 product images, 3 home images) and
   `about_images` is empty.
