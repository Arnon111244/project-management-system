# Monorepo Starter

**One repo. Web and mobile.**

Free ThemeWagon build of a Turborepo monorepo with **Next.js 15** (web) and **Expo 54** (mobile). Shared packages, a landing page, and workspace scripts — no dashboard or auth screens in this release.

- **Free demo:** run locally with `yarn web` → http://localhost:3000
- **Full product (premium):** https://react-native-next-theme-web.vercel.app
- **License:** See [LICENSE](./LICENSE)

---

## What's included (free build)

| Package                    | Purpose                          |
| -------------------------- | -------------------------------- |
| `apps/web`                 | Next.js 15 App Router            |
| `apps/mobile`              | Expo Router (iOS & Android)      |
| `packages/shared_mono_app` | Landing feature (`entryFeature`) |
| `packages/ui`              | Cross-platform UI library        |
| `packages/state`           | Zustand global store             |
| `packages/api`             | TanStack Query + HTTP layer      |

**This free version ships:** monorepo landing page, shared package layout, Neural dark theme (fixed), English-only UI, and Android APK download from the web demo.

**Premium version adds:** full dashboard, auth (OTP / PIN / biometrics), light/dark toggle, multi-language UI, extended component library, AI Studio, and documentation.

Use **Get the Full Version** on the landing page to open the premium product page.

---

## Requirements

- Node.js **18+**
- Yarn **1.22+**
- For mobile: Expo CLI, Android Studio and/or Xcode

---

## Quick start

```bash
yarn install
cp .env.example .env.local   # optional
yarn web
yarn android                 # Windows
yarn android:mac             # macOS / Linux (adb reverse)
```

Open http://localhost:3000 for the landing page.

---

## Scripts

| Command                  | Description                    |
| ------------------------ | ------------------------------ |
| `yarn web`               | Start Next.js dev server       |
| `yarn build:web`         | Production web build           |
| `yarn start-web`         | Build and start production web |
| `yarn android`           | Start Expo Android (Windows)   |
| `yarn android:mac`       | Start Expo Android with adb    |
| `yarn ios`               | Start Expo iOS                 |
| `yarn api [feature]`     | Scaffold feature API layer     |
| `yarn del-api [feature]` | Remove feature API scaffold    |

---

## Environment variables

See `.env.example`. The free landing page works without extra configuration.

---

## Deploy the web demo to GitHub Pages

GitHub Pages serves **static files** at:

`https://<github-user-or-org>.github.io/<repo-name>/`

Example: `https://themewagon.github.io/inapp/` means organization `themewagon` and repository `inapp`.

This template is a **Yarn monorepo**. The Next.js app lives in `apps/web`, not at the repo root. GitHub Pages cannot run `next start`, so the demo is a **static export** (`output: "export"`) produced by CI.

Local `yarn web` is unchanged. Pages-only flags are applied when `GITHUB_PAGES=true`.

### 1. Push the project to GitHub

```bash
git remote add origin https://github.com/<user-or-org>/<repo-name>.git
git branch -M main
git push -u origin main
```

The last path segment of the live URL **must match the repository name**. If the repo is `inapp`, the site is `/inapp/`.

Do not commit `node_modules`, `.next`, or secret `.env` files (already listed in `.gitignore`).

### 2. Enable GitHub Pages

In the repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
3. Leave **Custom domain** empty unless you own a domain. The default host is `https://<user-or-org>.github.io`.
4. Do not use GitHub’s stock “Configure Next.js” workflow as-is. That sample assumes Next.js at the **repository root**. This repo must build with Yarn workspaces from the root (`yarn build:web`) and upload `apps/web/out`.

### 3. Workflow file (already in this repo)

The file [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) deploys on every push to `main`, and can be run by hand from the **Actions** tab (`workflow_dispatch`).

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUSKY: "0"
      GITHUB_PAGES: "true"
      NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: yarn
      - uses: actions/configure-pages@v5
      - name: Disable API routes (not supported by static export)
        run: rm -rf apps/web/app/api-proxy apps/web/app/api
      - name: Install
        run: yarn install --frozen-lockfile
      - name: Build
        run: yarn build:web
      - name: Add .nojekyll
        run: touch apps/web/out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./apps/web/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**What each part does**

| Part                                           | Why it is required                                                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `on.push` / `workflow_dispatch`                | Deploy when `main` is updated, or trigger the job manually.                                                                |
| `permissions`                                  | `pages: write` and `id-token: write` let the job publish to Pages.                                                         |
| `concurrency`                                  | Avoids two deploys overlapping on the same site.                                                                           |
| `HUSKY: "0"`                                   | Skips git hooks during `yarn install` on CI.                                                                               |
| `GITHUB_PAGES: "true"`                         | Turns on static export in `apps/web/next.config.js` (`output: "export"`, `trailingSlash`, unoptimized images, `basePath`). |
| `NEXT_PUBLIC_BASE_PATH`                        | Set to `/<repo-name>` so CSS, JS, and links work under `username.github.io/repo-name/` (same pattern as ThemeWagon demos). |
| `actions/checkout`                             | Checks out this repository.                                                                                                |
| `actions/setup-node` + `cache: yarn`           | Node 20 and Yarn cache.                                                                                                    |
| `actions/configure-pages`                      | Applies GitHub Pages defaults.                                                                                             |
| Remove `api-proxy` / `api`                     | Next.js **Route Handlers are not allowed** with `output: "export"`. They are only needed for local proxying.               |
| `yarn install --frozen-lockfile`               | Installs the monorepo from the **root** (workspaces).                                                                      |
| `yarn build:web`                               | Builds `apps/web` and writes static files to `apps/web/out`.                                                               |
| `.nojekyll`                                    | Stops GitHub’s Jekyll from ignoring Next’s `_next` folder.                                                                 |
| `upload-pages-artifact` `path: ./apps/web/out` | Publishes the static export, not the repo root.                                                                            |
| `deploy` job                                   | Publishes the artifact to GitHub Pages.                                                                                    |

If you recreate the file in the GitHub UI (**Settings → Pages → Configure**), replace the generated YAML with the file above. A root-level `next build` will fail in this monorepo.

### 4. How Next.js is configured for Pages

When `GITHUB_PAGES=true`, `apps/web/next.config.js` enables:

- `output: "export"` — HTML/CSS/JS only (no Node server)
- `basePath` / `assetPrefix` — from `NEXT_PUBLIC_BASE_PATH`
- `images.unoptimized` — image optimization needs a server
- `trailingSlash: true` — folder-style URLs on Pages

App Router icon routes (`app/icon.tsx`, `app/apple-icon.tsx`) set `export const dynamic = "force-static"` so they can be generated at build time.

### 5. Check the deployment

1. Open the repo **Actions** tab and wait for **Deploy Next.js site to Pages**.
2. A green check means the site is live.
3. Open **Settings → Pages** for the URL, typically:

`https://<user-or-org>.github.io/<repo-name>/`

First publish can take one or two minutes after the workflow succeeds.

### Limits

- GitHub Pages is a **static landing demo**, not a Node host. API routes are stripped in CI.
- For a full Next.js server (SSR, API routes), use a Node host such as Vercel instead of Pages.

---

## Mobile development (Android)

### macOS / Linux

From the repo root:

```bash
yarn android:mac
```

### Windows

```bash
yarn android
```

### Connection issues

```bash
yarn android:fix-connection
```

Then set the dev server host in **Expo Dev Settings** to `127.0.0.1:8081`.

---

## Mobile build (EAS)

Run from `apps/mobile`:

```bash
cd apps/mobile
eas build --platform android --profile preview
```

---

## Author

Design and development by **Aref Abdallah**.

- **LinkedIn:** https://www.linkedin.com/in/aref-abdallah-4a4b11210/
- **Email:** abdallaharef65@gmail.com

---

## Support

Email **abdallaharef65@gmail.com** for questions about this template or the premium product.

---

## License

See [LICENSE](./LICENSE). Distributed via [ThemeWagon](https://themewagon.com).
