# PixelRoot Studio

## SEO-first static homepage

This project is configured so the homepage is fully static and server-rendered only.

- No client components are used on the homepage.
- `app/page.tsx` is forced static with:
  - `dynamic = "force-static"`
  - `revalidate = false`
  - `fetchCache = "force-cache"`

## SEO components included

- Global metadata in `app/layout.tsx`:
  - canonical URL
  - robots directives
  - Open Graph metadata
  - Twitter metadata
- Structured data (JSON-LD) via `seo/json-ld.tsx`.
- SEO data source from `data/seo.json`.
- SEO routes:
  - `app/robots.ts`
  - `app/sitemap.ts`

## Update SEO data

Edit `data/seo.json` with your real production values:

- `siteUrl`
- `title`
- `description`
- `keywords`
- organization and social handle fields

## Run locally

```bash
npm install
npm run dev
```
