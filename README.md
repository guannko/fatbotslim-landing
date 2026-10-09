# FatBotSlim public website

The static marketing website at https://fatbotslim.fit/. English is the default; Russian uses separate `/ru/` URLs. The app is the primary product; Telegram is an alternative. Pricing, public app URLs and download/store links are added only after confirmation.

## Source recovery

This revision reproduces the published deployment `dpl_CyWTbeneB5kzZpoDBjm9rPJmCzPB` from 2026-09-14. `site/render.mjs`, `site/content.mjs`, `scripts/build.mjs`, `test/site.test.mjs` and `vercel.json` were recovered from its retained Vercel source on 2026-10-09. Matching local assets and ancillary scripts were preserved.

Later local privacy and terms changes are preserved separately on `feat/editorial-product-site`; they are not part of this production snapshot. Do not publish those additions merely as part of source synchronization.

## Commands

Node.js 22+; no dependencies need installation.

```sh
npm run build
npm run lint
npm test
npm run preview
node scripts/verify-production.mjs
```

Only `dist/` is published. Explicit route rewrites replace the legacy SPA catch-all. Google verification files are copied unchanged. Source app extraction is optional and read-only; existing fixtures are development UI, not a released native screenshot.

Keep CSP in `vercel.json` synchronized with the JSON-LD hash. Tests check header parity, localized routes, assets and genuine 404 behavior.
