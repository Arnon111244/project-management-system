# UI8 Submission Checklist — Neural

Use this folder when preparing your [UI8](https://ui8.net) product listing.

Reference guidelines:

- [Product Submission Requirements](https://ui8.notion.site/UI8-Product-Submission-Requirements-Guidelines-1b98fb02ab3d8047973aebdf54e442b3)
- [Design Quality Standards](https://ui8.notion.site/UI8-Submission-Success-Design-Quality-Standards-1a08fb02ab3d80b2bdcedb3367c81472)

---

## Before you submit

### Product package (ZIP)

- [ ] Full monorepo source code
- [ ] `README.md` (buyer setup guide) — root
- [ ] `LICENSE` — root
- [ ] `.env.example` files
- [ ] No `.env` secrets or node_modules in ZIP

### Live demo

- [ ] Deploy web app (e.g. Vercel)
- [ ] Set `NEXT_PUBLIC_DEMO_URL` in production env
- [ ] Demo login works: `monorepo@test.com` / `Native&Next99` / OTP `998654`
- [ ] `/documentation` accessible without login

### Preview images (required)

| Asset     | Size            | Content suggestion              |
| --------- | --------------- | ------------------------------- |
| Cover     | 1200×800 px min | Landing hero + Neural branding  |
| Preview 1 | 1200×800        | Marketing landing (full page)   |
| Preview 2 | 1200×800        | Banking dashboard /home         |
| Preview 3 | 1200×800        | Component showcase              |
| Preview 4 | 1200×800        | Form builder                    |
| Preview 5 | 1200×800        | Mobile app (iOS or Android)     |
| Preview 6 | 1200×800        | Dark mode view                  |
| Preview 7 | 1200×800        | Arabic RTL layout               |
| Preview 8 | 1200×800        | Architecture / monorepo diagram |

Place final PNG/JPG files in `marketplace/previews/` before zipping for UI8.

### Product description (English)

Suggested bullets for UI8 listing:

- Next.js 15 + Expo 54 monorepo starter
- 70%+ shared code between web and mobile
- 20+ cross-platform UI components
- Full auth flow (login, OTP, PIN, biometrics)
- i18n with RTL (English, Arabic, French)
- Vault banking demo dashboard with tables & charts
- Dark mode and semantic design tokens
- One-time purchase — full source code

### After UI8 approval

Set your store URL in environment variables:

```env
NEXT_PUBLIC_UI8_STORE_URL=https://ui8.net/your-product-url
```

The pricing section CTA will automatically show **Get on UI8**.

---

## Category

Submit as **Coded Template** (React / Next.js / React Native monorepo).

---

## Support email

Default: `abdallaharef65@gmail.com` — update in `.env.example` and `packages/shared_mono_app/constants/product.ts` if needed.
