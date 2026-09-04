# Missing flows and wiring audit

**Date:** 2026-09-01  
**Scope:** `apps/landing`, `apps/client`, `apps/admin`, `backend`  
**Method:** source review plus live checks on `https://www.thesimbolo.com/packages` (package grid + expanded-card click). No code was changed.

This is a findings report only. Items are ordered by user impact.

---

## How the intended purchase flow is supposed to work

1. Visitor opens `/packages` on the landing site.
2. Click a package card → expanded package modal.
3. **Buy Now** → `?auth=register&checkout=<slug>` (or login).
4. Landing `AuthModals` authenticates, stores checkout intent, redirects to the client app (`NEXT_PUBLIC_DASHBOARD_URL`) `/checkout?package=<slug>`.
5. Client checkout loads package + profile, creates order via `/api/checkout` → backend `POST /orders/checkout` + `POST /payments/create-order`, Razorpay, verify.
6. Client dashboard shows projects, orders, billing, documents.

Several of those steps are broken or incomplete.

---

## Blockers (user cannot complete the flow)

### B1. Expanded package modal never appears on `/packages`

**Flow:** Landing packages → checkout  
**Files:** `apps/landing/src/components/packages/ExpandedPackageModal.tsx`, `apps/landing/src/components/packages/PackagesPage.tsx`, `apps/landing/src/components/ui/ServiceCard.tsx`

Card click **does** set `selectedPackage`. The modal then renders with `isOpen=true`. The overlay is built with `createPortal(..., document.body)` and returned as a child of Framer Motion `AnimatePresence`.

`AnimatePresence` (framer-motion 12) only tracks direct motion children. A portal object is dropped, so `[role=dialog]` never mounts. **Buy Now** (the only path to `?auth=register&checkout=…` from this page) is unreachable.

Verified live: 13 cards render; Explore click leaves no dialog in the DOM.

---

### B2. CORS can empty `/packages` for disallowed origins

**Flow:** Landing packages fetch  
**Files:** `backend/src/main.ts` (CORS origin callback), Railway `FRONTEND_URLS`, `apps/landing/src/hooks/usePackages.ts`

Browser `GET /api/v1/packages` with a disallowed `Origin` returns **500 `Not allowed by CORS`**. `usePackages` has **no mock fallback**; on error the grid is empty.

`FRONTEND_URLS` was updated to include `https://thesimbolo.com` and `https://www.thesimbolo.com` (plus existing Vercel apps). Localhost ports used by landing (`3000` / `3050`) are **not** on that list unless added later.

---

### B3. Auth success still depends on `NEXT_PUBLIC_DASHBOARD_URL`

**Flow:** Login/register → checkout  
**Files:** `apps/landing/src/components/auth/auth-modals.tsx`, `apps/landing/.env.local`

After login, the landing app sends the user to `DASHBOARD_URL` (`process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002"`).

Local `.env.local` points at `http://localhost:3002`. If Vercel production does not bake in the real client URL (`simbolo-client.vercel.app` or `app.thesimbolo.com`), **Buy Now / Register dumps users onto localhost** even after the modal is fixed.

Google OAuth callback is Railway (`GOOGLE_CALLBACK_URL` on the backend). Landing Google buttons hit `${API_BASE_URL}/auth/google`. That path can work if backend + Google console match; it still needs the dashboard URL to be production.

---

### B4. Client dashboard 403 on orders (known contract)

**Flow:** Client `/dashboard` after login  
**Files:** `apps/client/src/app/dashboard/page.tsx`, `apps/client/src/services/api.ts` (`mockApi.orders.getAll` → `/api/proxy/orders?clientId=`), `backend/src/orders/orders.controller.ts`

Dashboard `Promise.all` includes `orders.getAll(clientId)`. `GET /orders` requires `orders.view` **or** `orders.manage`. Seed **does** give CLIENT `orders.view`. If production DB was never re-seeded after that permission was added, live clients get **403**, the whole dashboard error state (“API error: 403” + Retry), and no stats.

Any **one** failed call in that `Promise.all` fails the entire dashboard.

---

## High (broken or fake product surfaces)

### H1. Service-page pricing sections drop core packages

**Flow:** `/services/{seo,google-ads,meta-ads,website-design,ecommerce,video-editing}` pricing  
**File:** `apps/landing/src/lib/package-mapper.ts`

`fetchMappedPackages` keeps only `isAddon === true` **and** matching `service.slug`. Live API recently had **2–3 addons** (SEO, ecommerce). Call sites pass **`[]` as mock fallback**, so if no addon matches, the pricing block is empty (no mock, no core packages).

Core catalog packages (`isAddon: false`) never appear on service pages.

---

### H2. Package features and pricings are empty in the API

**Flow:** Pricing display, checkout amount  
**Files:** `backend/src/packages/packages.service.ts` (includes `features` / `pricings`), live `GET /api/v1/packages`

The backend **does** include relations. Live rows still return `features: []` and `pricings: []`. Landing `/packages` falls back to generic bullets and `basePrice`. Checkout uses `pricings` monthly else `basePrice`. Admin can attach features (`POST packages/features`, `POST packages/pricings`) but catalog data is not populated.

Impact: cards look generic; yearly toggle has nothing real to bind to; checkout price can be 0/`basePrice` only.

---

### H3. Client Messages page is hardcoded UI, not chat API

**Flow:** Client `/messages`  
**Files:** `apps/client/src/app/messages/page.tsx` vs `backend/src/chat/chat.controller.ts`

The page shows fake “FitLife Project Team” / “Glow Design Team” copy. It does not call `/chat/conversations`. Backend chat exists and is unused by this UI.

---

### H4. Client Support tickets are stubbed empty

**Flow:** Client `/support`  
**Files:** `apps/client/src/services/api.ts` (`support.getTickets` returns `[]`), `apps/client/src/app/support/page.tsx`

Comment in API: “Backend does not have tickets yet.” UI still looks like a ticket product. No create-ticket action wired to an API.

---

### H5. Client Reports page is static mock charts

**Flow:** Client `/reports`  
**File:** `apps/client/src/app/reports/page.tsx`

Hardcoded traffic/leads numbers. Export PDF button has no handler. Backend `reports` / `analytics` modules are not used.

---

### H6. Client Settings page is non-functional

**Flow:** Client `/settings`  
**File:** `apps/client/src/app/settings/page.tsx`

Dark-mode toggle and notification switches are decorative (no state, no API).

---

### H7. Dashboard “Schedule Meeting” / “New Project” do nothing

**Flow:** Client `/dashboard`  
**File:** `apps/client/src/app/dashboard/page.tsx`

Two primary CTAs are `<button>` with **no `onClick` / no `href`**.

---

### H8. Client tasks API path does not match backend

**Flow:** Client `/tasks` (if reachable)  
**Files:** `apps/client/src/services/api.ts` (`fetchProxy(\`tasks?clientId=${clientId}\`)`), `backend/src/tasks/tasks.controller.ts`

Backend list is `GET /tasks/project/:projectId`, not `GET /tasks?clientId=`. The client call hits the wrong route (`GET /tasks/:id` with a UUID that is not a task id, or 404). CLIENT role seed also has **no** `tasks.*` permission.

---

### H9. Client meetings require a permission clients do not have

**Flow:** Client `/meetings`  
**Files:** `apps/client/src/services/api.ts`, `backend/src/meetings/meetings.controller.ts`, `backend/prisma/seed.ts`

`GET /meetings` needs `meetings.read` or `meetings.manage`. CLIENT seed slugs: `services.view`, `packages.view`, `orders.view`, `orders.create`, `documents.read`, `documents.upload`, `dashboard.view`, `projects.read`. **No meetings permission** → 403 (caught only as `console.error` on the meetings page).

---

### H10. Landing blogs ignore the CMS API

**Flow:** `/blogs`  
**File:** `apps/landing/src/hooks/useBlogs.ts`

Reads/writes `localStorage` + `mock/blog`. Backend `blogs` controller and `landingApi.getBlogs` exist and are unused here. Admin blog edits will not show on the public site.

---

### H11. Landing `usePackages` mutators are no-ops

**File:** `apps/landing/src/hooks/usePackages.ts`

`addPackage` / `updatePackage` / `deletePackage` are empty functions. Harmless if unused; dangerous if any admin-on-landing UI still calls them.

---

## Medium (wrong URLs, incomplete wiring, env drift)

### M1. Production brand URLs still say `simbolo.ai`

**Files:** `apps/client/src/services/api.ts`, `apps/client/src/app/auth/callback/route.ts`

If `NEXT_PUBLIC_LANDING_URL` is unset in production, unauthenticated client users are sent to `https://simbolo.ai` instead of `https://thesimbolo.com`. Auth callback missing-token redirect uses the same default.

---

### M2. Client packages/checkout fetch the API from the browser (CORS)

**Files:** `apps/client/src/app/packages/page.tsx`, `apps/client/src/app/checkout/page.tsx`

Unlike orders/profile, these `fetch(`${apiUrl}/packages`)` directly. They depend on `FRONTEND_URLS` containing the client origin. Checkout **profile** correctly uses `/api/profile` (proxy). Package load does not.

---

### M3. Checkout fallback catalog is a stale slug map

**File:** `apps/client/src/app/checkout/page.tsx` (`packageData`)

If `GET /packages/:slug` fails, checkout uses a hardcoded map (`seo-basic`, `ads-starter`, …). Live slugs include `4peg`, `rocket`, etc. Unknown slugs become **Custom Package / price 0**. Landing `buttonLink` uses slug; mapper on service pages sometimes uses **package UUID** (`package-mapper.ts`), which checkout then looks up as a slug.

Mismatch: landing service “Choose Plan” → `?auth=register&checkout=<uuid>` vs checkout `GET /packages/:slug`.

---

### M4. Subscription lock vs empty client profile

**File:** `apps/client/src/components/SubscriptionGuard.tsx`

No `clientId` on profile → entire portal locked (except `/checkout` and `/packages`). New register → checkout can work; visiting `/dashboard` before a ClientProfile exists shows the paywall even if checkout is the next step.

---

### M5. Global search in client layout is a mock input

**File:** `apps/client/src/layouts/ClientLayout.tsx`  
Placeholder “Search projects, files, invoices...” has no submit handler. Backend `search` controller unused here.

---

### M6. AI generation endpoint is a placeholder

**File:** `backend/src/ai/ai.service.ts`  
`generate()` returns `{ message: 'Generation not implemented with Gemini yet.' }`. Landing AI search (`POST /ai/search`) is implemented; blog/content generation is not.

---

### M7. Video reel previews “coming soon”

**File:** `apps/landing/src/components/videoEditing/VideoPreviewModal.tsx`

---

### M8. Contact form CORS

**File:** `apps/landing/src/lib/api.ts` `submitContactForm` → `POST ${API_BASE_URL}/leads` from the browser. Same `FRONTEND_URLS` constraint as packages.

---

### M9. `api.thesimbolo.com` does not resolve

Custom API hostname is gone (Hostinger). Landing is baked to Railway `simbolobackend-production.up.railway.app`. Fine if Vercel env matches; any leftover `api.thesimbolo.com` env would  fail DNS.

---

### M10. Live leftover: `/services/ai-match` 404

Observed on production (RSC prefetch). Current landing source mascot links go to `/contact` and real service routes. Production bundle may still contain an old `/services/ai-match` href until the landing app is redeployed.

---

### M11. Admin default API port differs from backend

**File:** `apps/admin/src/services/api.ts` fallback `http://localhost:3000/api/v1`  
Backend default listen is **3001**. Local admin without `.env` talks to the wrong port.

---

### M12. Logged-in “skip register” cannot see dashboard cookies

**File:** `apps/landing/src/components/auth/auth-modals.tsx`

If `?auth=register&checkout=` and landing sees `accessToken` in **landing** cookies, it sends the user to the dashboard **without** putting tokens on the URL. Landing and dashboard are different origins, so that cookie almost never exists. Returning buyers always get the register/login modal. If the check ever fired, they would hit checkout unauthenticated.

---

### M13. Affiliate “Join” is a fake paid SKU

**Files:** `apps/landing/src/components/affiliate/AffiliateHero.tsx`, `BottomCTA.tsx`

`href="?auth=register&checkout=affiliate"`. Checkout has no `affiliate` package → ₹0 Custom. Marketing assets link `/dashboard/affiliate/assets` on the **landing** origin (404). Page copy is static `data/affiliate.ts`.

---

### M14. Help Center is a shell

**Files:** `apps/landing/src/data/helpCenter.ts`, Help Center components

Category/KB/resource links are `href="#"`. Search and “Popular” chips have no handlers. `landingApi.getHelpCenter` / `getFooter` are unused. Admin has no Help/Footer CMS screens even though backend CMS routes exist.

---

### M15. Case study list vs detail

List falls back to mocks when the API is empty; detail uses live mapper and `notFound()` if the slug is missing. Clicking a mock card 404s. Mapper also drops gallery, timeline, testimonial, related.

---

### M16. `GET /service-page-config/:slug` is not public

**File:** `backend/src/service-page-config/service-page-config.controller.ts`

No `@Public()`. Global JWT guard → landing unauthenticated fetch **401** → mock service-page config. Admin JWT can still edit.

---

### M17. Admin Packages never writes pricings or `isAddon`

**Files:** `apps/admin/src/app/packages/page.tsx`, `PricingTiersEditor.tsx`

Admin **Packages** creates cores (`isAddon` omitted → false) and can attach features, but does not call `upsertPricing`. **PricingTiersEditor** (per-service) creates addons. That is why `/packages` and service pages show two different catalogs, and why `pricings[]` is empty.

---

### M18. Admin screens that do not persist

| Page | Behavior |
|------|----------|
| Admin dashboard | Hardcoded stats; ignores `GET /dashboard/admin` |
| Industries / Technologies | In-memory mock; API methods point at `/settings/technologies` and `/settings/industries` which **do not exist** |
| Services overview | Editors with no load/save |
| Blogs / FAQs / portfolio / testimonials lists | Public GETs default to published only → **drafts vanish from admin** |
| Invoices / payments | **No admin UI** at all |

---

### M19. Google OAuth redirect uses backend `DASHBOARD_URL`

**File:** `backend/src/auth/auth.controller.ts`

After Google, Nest redirects using `DASHBOARD_URL` or `FRONTEND_URLS.split(',')[1]` — not landing’s `NEXT_PUBLIC_DASHBOARD_URL`. Wrong index → landing 404 and lost checkout. `DASHBOARD_URL` is optional in env validation.

---

### M20. Register discards company; Remember me is decorative

**File:** `apps/landing/src/components/auth/auth-modals.tsx`

`companyName` is collected and never sent (`RegisterDto` has no field). Remember-me checkbox does nothing.

---

### M21. Homepage featured prices are placeholders

**File:** `apps/landing/src/data/landing.ts` — `price: "₹X,999"`. Cards go to `/packages`, not checkout. Hero mic has no handler.

---

### M22. Unscoped FAQs

Almost every landing page calls `fetchMappedFaqs([])` with no `serviceId`, so the first global FAQ list can replace page-specific mocks.

---

### M23. Redis / RazorpayX / webhooks not required in prod validation

Without `REDIS_URL`, BullMQ jobs (`queued: false`), cache is in-memory, Socket.IO adapter skipped. Affiliate payday / invoice PDF / email queues silently no-op. `RAZORPAYX_*` missing keeps payouts mock.

---

### M24. Access/refresh tokens are placed on the query string

**Files:** `auth-modals.tsx`, `backend/src/auth/auth.controller.ts`, `apps/client/src/app/auth/callback/route.ts`

Callback is `/auth/callback?accessToken=…&refreshToken=…`. Tokens land in history, logs, and possible `Referer`. Cookies after that are httpOnly, but the secret already leaked.

---

### M25. Renew / repeat checkout passes package UUID as a slug

**Files:** `SubscriptionGuard.tsx`, `StickyRenewCard.tsx`, `subscription/page.tsx`, `checkout/page.tsx`

Billing APIs expose `package.id` (UUID). Checkout `GET /packages/:slug` looks up by **slug**. Renew 404s → mock Custom ₹0 → `POST /orders/checkout` rejects non-UUID. `repeat=true` is never read. Sticky renew also calls `subscription.get()` with **no clientId** (always `null`) and compares `"Active"` vs `"ACTIVE"`.

---

### M26. Checkout 401 does not send the user to login

Dedicated routes (`/api/profile`, `/api/checkout`, `/api/verify`) do **not** use `fetchProxy`’s 401 → landing `returnUrl` path. No `middleware.ts` on the client app. Empty billing form, then Pay fails with `"No token"`. Checkout/verify also **do not refresh** the access token (proxy does).

---

### M27. Google OAuth drops `returnUrl`

Google button only forwards `?checkout=`. Email/password honors `returnUrl`. Expired checkout session + Google → always `/dashboard`, purchase abandoned.

---

### M28. Checkout UI amount ≠ amount Razorpay charges

Checkout page shows **monthly `pricings` + 18% GST**. Backend `POST /orders/checkout` uses **`basePrice` + `pkg.gstRate`**. Razorpay is bound to the server `order_id`. If monthly ≠ basePrice, the Pay button and the sheet disagree.

---

### M29. Checkout prefill maps the wrong profile fields

Reads `clientProfile.companyName` and `clientProfile.address`. Schema has `company.name` and `billingAddress`. `onBeforePayment` does not persist name/company/phone. Profile “Legal Entity Name” / “State” are not in `UpdateClientProfileDto`.

---

### M30. Role isolation is a spoofable cookie, not middleware

`userRole` is a non-httpOnly cookie. Affiliates can still open `/dashboard` and `/checkout`. No server-side route guard.

---

### M31. Payments / orders UI leftovers

`payments/page.tsx`: “Last Payment” hardcoded `₹24,999` / `05 June 2026`; outstanding always ₹0. `orders/page.tsx`: Download / external-link icons have no handlers. `/api/orders` exists unused.

---

## Low

| ID | Issue | Where |
|----|--------|--------|
| L1 | `mockApi` name is misleading; it is a live proxy | `apps/client/src/services/api.ts` |
| L2 | Dashboard maps `invoicesDue` from `openTickets` | `stats.getDashboard` |
| L3 | Landing admin-on-site editors (`AdminPackageEditor` etc.) vs real admin app — confirm they are unused in production routes | `apps/landing/src/components/admin/` |
| L4 | Razorpay checkout branding image `https://thesimbolo.com/logo.png` (may 404; logo is `/assets/logo1.png`) | `apps/client/src/components/checkout/RazorpayCheckout.tsx` |
| L5 | Graphic design service page does not use `fetchMappedPackages` (static data only) | `GraphicDesignPage.tsx` |
| L6 | Debug `console.log` currently in packages modal/page (dev noise; not on Vercel until deployed) | `PackagesPage.tsx`, `ExpandedPackageModal.tsx` |

---

## Client portal page map

| Route | Wired to backend? | Notes |
|-------|-------------------|--------|
| `/dashboard` | Partial | Profile + dashboard + projects + subscription + **orders**; one 403 fails all. Dead CTAs. |
| `/projects` | Likely | `projects?clientId=` + `projects.read` |
| `/orders` | Likely | `orders.view` if seed applied |
| `/checkout` | Yes (proxy) | Order + Razorpay; package fetch is direct CORS |
| `/packages` | Direct API | CORS; then routes to `/checkout?package=` |
| `/documents` | Yes | `documents/my` |
| `/payments` | Yes | `payments/my` (no extra permission decorator) |
| `/profile` | Yes | `/api/profile` |
| `/meetings` | Broken | Permission + possible empty data |
| `/tasks` | Broken | Wrong URL + missing permission |
| `/messages` | **Fake** | Static HTML |
| `/reports` | **Fake** | Static charts |
| `/support` | **Stub** | Always `[]` |
| `/settings` | **Fake** | No handlers |
| `/notifications` | Partial | `GET /notifications` if JWT has access |
| `/affiliate` | Separate | Affiliate role; not client checkout |

---

## Landing page map

| Route | Data source | Gap |
|-------|-------------|-----|
| `/packages` | Live API | Modal/portal blocker; empty nested pricing |
| `/services/*` pricing | Live addons only, fallback `[]` | Core packages hidden |
| `/blogs` | `landingApi.getBlogs` + mock fallback | Comments/share dead; unused `useBlogs` writes localStorage |
| `/help-center` | Static `data/helpCenter.ts` | Links `#`; CMS unused |
| `/affiliate-program` | Static | Join uses fake `checkout=affiliate` |
| `/contact` | `POST /leads` | CORS |
| `/case-studies` | `landingApi` + mappers | Falls back to mock if API fails (by design) |
| Home AI search | `POST /ai/search` | Experts/packages depend on search payload + `usePackages` |
| Auth modals | Live auth | Dashboard URL env; checkout query |

---

## What was verified live vs inferred from code

**Verified**

- `GET https://simbolobackend-production.up.railway.app/api/v1/packages` → 200, ~15 packages, empty `features`/`pricings`.
- `www.thesimbolo.com/packages` renders cards after CORS allowlist.
- Card click does not mount `[role=dialog]`.
- CORS without allowlisted origin → 500 `Not allowed by CORS`.

**Inferred from source (not fully exercised in a logged-in client session this pass)**

- Dashboard 403 if CLIENT lacks `orders.view` in the live DB.
- Meetings/tasks permission and path mismatches.
- Fake messages/reports/support/settings.
- Vercel env values for `NEXT_PUBLIC_DASHBOARD_URL` / `NEXT_PUBLIC_LANDING_URL` (not read from Vercel; local files still point at localhost / `simbolo.ai`).

---

## Suggested fix order (not done)

1. Portal/AnimatePresence on `ExpandedPackageModal` so Buy Now exists.
2. Confirm Vercel `NEXT_PUBLIC_DASHBOARD_URL` and `NEXT_PUBLIC_LANDING_URL` are production domains; add localhost origins to Railway `FRONTEND_URLS` for local landing.
3. Align checkout identifier (slug vs UUID) end-to-end.
4. Populate package `features` / `pricings` (or stop including empty arrays and mapping as if they exist).
5. Service pages: show core packages for the service, not only addons; do not pass `[]` as the only fallback.
6. Client dashboard: don’t fail the whole page on one 403; confirm CLIENT permissions in production.
7. Replace stub client pages (messages, support, reports, settings, dashboard CTAs) or hide them from nav until wired.
8. Point blogs comments/share at real APIs (list already uses `landingApi.getBlogs`).
9. Fix `tasks` URL and CLIENT `meetings.read` (or hide those nav items).
10. Mark `GET /service-page-config/:slug` public; lock PUT.
11. Admin: persist pricings + `isAddon`, list drafts, add invoices UI or hide the ops gap.
12. Set backend `DASHBOARD_URL` for Google OAuth; stop using `FRONTEND_URLS[1]`.
13. Help Center / affiliate join: real routes, not `#` / fake SKU.
14. Stop putting JWTs on the query string.
15. Checkout: slug-or-UUID lookup, 401 → login `returnUrl`, charge the same amount the UI shows, refresh tokens on `/api/checkout`.
16. Pass `returnUrl` through Google OAuth `state`.

---

*End of report. No application code was modified for this audit besides this document.*
