# Asso

The site for Asso, a Stockholm-based design studio: a full-screen, looping
Are.na-powered image wall on the homepage, and a Markdown-driven About page.

## Features

- **Are.na image wall**: the homepage streams images from an Are.na channel
  into a continuously scrolling wall with drag/scroll navigation and
  animated captions.
- **About page**: content is authored in `src/content/about.md` and rendered
  with `react-markdown`.
- **Manual revalidation**: Are.na data is cached indefinitely and only
  refreshed on demand via `/api/revalidate-arena`, with a companion
  `/api/publish` endpoint for triggering that revalidation on a separate
  production deployment (see "Preview & publish" below).

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS
- Framer Motion
- `are.na` API client
- `react-markdown`

## Quick start

1. **Install dependencies**
```shell
npm install
```

2. **Set up environment variables**

Create a `.env.local` with:
```shell
ARENA_ACCESS_TOKEN=<your-are.na-personal-access-token>
```

No CMS credentials are required beyond the Are.na token. Are.na content is
cached indefinitely and can be manually refreshed through
`/api/revalidate-arena`.

3. **Start the development server**
```shell
npm run dev
```

4. **Build for production**
```shell
npm run build
npm start
```

## Preview & publish

Create a second deployment (e.g. on Netlify) for a preview branch and point
a preview subdomain to it. Configure these variables on the preview
deployment:

```shell
PREVIEW_MODE=true
PUBLISH_TOKEN=<a-long-random-secret>
PRODUCTION_REVALIDATE_URL=https://asso.gd/api/revalidate-arena
```

Configure the same secret on the production deployment as
`REVALIDATE_TOKEN`. The preview deployment then fetches Are.na with
`no-store` on every page load, so editors always see the latest channel
content. Its **Publish** button (`/api/publish`) calls the production
`/api/revalidate-arena` endpoint to refresh the cached Are.na data and
homepage once changes are ready to go live.

## Content

- `src/content/about.md` — About page copy (Markdown).
- `src/content/site.json` — site-wide metadata (SEO titles/descriptions,
  address entries, etc.) consumed by `src/lib/about.js`.
