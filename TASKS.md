# FatBotSlim marketing website

## Product direction — 2026-09-14

- Each BIX product needs an independent visual identity, layout and voice. Do not reuse the BIX portfolio composition with a different palette. A small Brain Index ownership credit is sufficient.
- App-first positioning: web and Android releases are being prepared. Telegram is an optional alternative. Do not promise feature/account/history parity.
- No published pricing or trial. Do not invent release dates, store URLs, public web app URLs or APK downloads.
- App repository `/Users/borisboris/diskD/FatBotSlim` is being redesigned separately. Treat it as read-only for this website task.

## VERIFIED — local preview

- Source: `site/`; build/dev scripts: `scripts/`; output: `dist/`.
- Ten EN/RU content routes built; syntax checks and sixteen HTTP tests passed after allowing the local test server through the sandbox.
- Independent centered editorial hero, wide food visual, app preview, concise use-case walkthrough; removed repeated portfolio-style blocks.
- Desktop menu button hidden; mobile menu opening and Escape closing checked in browser. EN at 390px and RU at 320px have no horizontal overflow; RU expanded menu also checked at 320px.
- Development HomeScreen rendered read-only from app source with fictional fixtures, not a released native screenshot. Provenance is in `site/assets/app-home-preview.provenance.json`.

## VERIFIED — production deployment, 2026-09-14

- Published to https://fatbotslim.fit/ through the existing Vercel project `prj_du3fCIbcbuoF85gJwkroZPEnsIwY` (annoris/fatbotslim).
- Deployment `dpl_CyWTbeneB5kzZpoDBjm9rPJmCzPB`, status Ready, production URL https://fatbotslim-nr63xiljj-annoris.vercel.app.
- Previous deployment retained for rollback: `dpl_825GSifyNwV6oJAhbXk3UpyZGtTs`, https://fatbotslim-cv4l353ay-annoris.vercel.app.
- Replaced legacy catch-all rewrite with explicit content routes. Published directory is `dist`, not the source tree.
- Build, syntax checks and 17 local tests passed. `node scripts/verify-production.mjs` passed against the actual domain: ten content routes, five assets, two byte-identical Google verification files, sitemap with ten URLs, robots.txt and genuine 404 responses.
- Browser verified the published EN and RU pages, mobile navigation opening and closing on link selection, and FAQ expansion. The app preview still uses development UI with fictional data.
- The production source was recovered from this deployment's retained Vercel files on 2026-10-09. It preserves the published five-route EN/RU site; later local app privacy and terms changes remain separate. Seventeen tests passed for the recovered source.

## PARTIAL — follow-up

- Finish visual/content review, asset provenance and SEO audit documentation. No ranking or GEO citation guarantees.
- Replace development UI when the app design is final; verify the public web app URL and signed Android release before enabling access/download buttons.
- Telegram link is present; end-to-end bot behavior has not been tested in this task.
- Search Console indexing and sitemap submission were not performed as part of this deployment. Preserved verification files do not by themselves prove current Search Console account status.
