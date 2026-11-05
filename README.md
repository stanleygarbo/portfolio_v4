# stanleygarbo.com - v4

My portfolio, built with Next.js 16, React 19, TypeScript, styled-components, and Contentful.

[Website](https://stanleygarbo.com) | [Resume](https://stanleygarbo.com/StanleyGarboResume.pdf)

## Development

Use Node.js 26 LTS, pinned in `.nvmrc` and `package.json`.

```sh
nvm install
nvm use
npm ci
cp .env.example .env.local
```

Set `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` in `.env.local`, then run `npm run dev`.
Use a Contentful delivery token with access to the published portfolio content.
These variables are used only by server-side data fetching and must also be configured in the hosting provider before building or deploying.
The former `NEXT_PUBLIC_CONTENTFUL_*` names are no longer used.

## Content and rendering

The homepage and published project pages are generated at build time and revalidated every five minutes.
New project URLs are generated on their first request.
Missing projects return HTTP 404, while Contentful outages throw an error so failed regeneration preserves the last successful page.
Builds require working Contentful credentials and network access.
Requests have a ten-second timeout and retry transient network, rate-limit, and server failures up to three attempts.

Routes use the App Router, with Server Components for Contentful fetching and metadata.
The homepage and project layouts share the site shell, with project colors supplied on the server before the first paint.
Client Components handle the theme context, navigation menu, scroll effects, and animations.
Contentful requests are deduplicated across metadata, layouts, and pages during each server render.
Static route regeneration caches the validated page, while regeneration requests fresh CMS data without a separate fetch cache.

Styling uses the Next.js compiler, a streaming style registry, and transient styling props.
The existing `/page-not-found` URL and `/api/hello` endpoint are retained as an App Router page and Route Handler.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

Linting uses ESLint 10 with the official Next.js plugin, React Hooks rules, and TypeScript recommended rules.
TypeScript 5.9 is retained because the lint parser currently supports TypeScript versions below 6.1.
The `minimatch` override patches a denial-of-service advisory in the tooling dependency tree until upstream packages adopt version 11.0.1 or later.

Run the production browser tests with:

```sh
npx playwright install chromium
npm run test:e2e
```

The browser suite builds and starts the production site, then checks desktop and mobile rendering, client navigation, browser history, server-rendered project colors, case-study images, HTTP 404 responses, API compatibility, static cache headers, reduced motion, and rendering without JavaScript.
To test an already running local server, set `PLAYWRIGHT_BASE_URL`, for example `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npm run test:e2e`.
