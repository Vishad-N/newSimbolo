# Project Compile, API, and Form Validation Audit

Date: 2026-08-17

## Resolution Status

Implemented in this pass:

- Fixed the `apps/client` checkout/profile update contract so `stateCode` is typed and persisted through the client profile endpoint.
- Added frontend validation helpers for landing, admin, and client form flows.
- Added no-number name validation to landing contact, landing registration, admin manual client creation, and client checkout/profile paths.
- Enforced 10-digit local phone numbers, country codes, GST numbers, and state codes in the relevant user-facing forms.
- Added backend name/GST/state-code constants and applied DTO validation to registration, lead creation, manual client creation, user update, and client profile update.
- Added backend validation regression tests for names and phone numbers.
- Fixed stale backend spec providers/mocks.
- Made landing public API fetches skip external calls during production builds and changed package fetch revalidation from `0` to `300`.
- Added `dist/**` to admin ESLint ignores and added `dist/**` to Turbo build outputs for backend cacheability.

Verified after implementation:

- `npm run build --workspace apps/client` passes.
- `npm run build --workspace backend` passes.
- `npm run build --workspace apps/landing` passes.
- `npm run build --workspace apps/admin` passes.
- `npm test --workspace backend -- --runInBand` passes: 26 suites, 35 tests.

Known remaining work:

- Admin lint now ignores generated `dist/**`, but still reports existing source lint debt across CMS/admin files, mainly `any` types and React compiler `set-state-in-effect` rules. These are real refactor items, not generated-output noise.
- Landing service pages still have large first-load JS on several service detail routes; bundle splitting remains the next performance phase.
- Next 16 still reports the admin `middleware` convention deprecation; migrate it to `proxy.ts` in a focused routing change.

## Scope

This audit covers the frontend apps, backend APIs, production build health, lint/test baseline, and form data quality rules across:

- `apps/landing`
- `apps/admin`
- `apps/client`
- `backend`

The goal is to reduce page compile/build time, improve API build reliability, and make all form submissions store clean data: valid emails, exactly 10-digit local phone numbers, valid country codes, and name fields that do not accept numbers.

## Current Baseline

| Area | Command | Result | Time |
| --- | --- | --- | --- |
| Landing frontend | `npm run build --workspace apps/landing` | Passed, with API fallback warnings and dynamic rendering warnings | 41.3s |
| Admin frontend | `npm run build --workspace apps/admin` | Passed, with Next middleware deprecation warning | 35.35s |
| Client frontend | `npm run build --workspace apps/client` | Failed TypeScript check | 23.34s before failure |
| Backend API | `npm run build --workspace backend` | Passed | 51.59s |
| Backend tests | `npm test --workspace backend -- --runInBand` | Failed 6 suites, passed 19 suites | 54.28s |

## Immediate Blockers

### 1. Client App Production Build Fails

File: `apps/client/src/app/checkout/page.tsx`

The checkout page sends `stateCode` to `mockApi.profile.update`, but `ClientProfileUpdate` in `apps/client/src/services/api.ts` does not include `stateCode`.

Impact:

- `apps/client` cannot produce a clean production build.
- Compile-time optimization work is unreliable until the app builds.

Recommended fix:

- Add the missing typed profile fields only if the backend accepts and stores them.
- If backend does not support `stateCode` in the profile update endpoint yet, remove it from the update payload and store it through the correct company/profile endpoint.

### 2. Landing Build Performs External API Fetches

During `apps/landing` build, static generation tries to fetch backend data and falls back to mocks after network failure. The build logs show API connection failures and `DYNAMIC_SERVER_USAGE` warnings for package/service pages.

Impact:

- Build time depends on network/API availability.
- Static pages become slower and less predictable.
- Deployment can silently publish fallback content when the API is unavailable.

Recommended fix:

- Do not perform live external API calls during static builds unless the route intentionally uses ISR.
- Replace `revalidate: 0` on public content fetches with a stable ISR value such as `revalidate: 300` or `revalidate: 3600`.
- Add a build-safe content mode, for example `SKIP_BUILD_API_FETCH=true`, so production builds do not wait on backend calls.

### 3. Backend Tests Are Stale

Failing suites:

- `service-page-config.controller.spec.ts`: missing `ServicePageConfigService`
- `service-page-config.service.spec.ts`: missing `PrismaService`
- `leads.controller.spec.ts`: missing `LeadsService`
- `leads.service.spec.ts`: missing `PrismaService`
- `invoices.service.spec.ts`: constructor now needs `TaxService`
- `webhooks.service.spec.ts`: constructor now needs `InvoicesService`

Impact:

- API changes cannot be validated safely.
- DTO validation changes would lack a trustworthy regression baseline.

Recommended fix:

- Update test module providers and mocks.
- Add tests for invalid names, invalid phone numbers, invalid country codes, and email normalization.

### 4. Lint Baseline Is Not Clean

Admin lint currently scans generated output under `apps/admin/dist/**`.

Recommended fix:

- Add `dist/**` to the admin ESLint ignore list.
- Then fix remaining source-level lint issues separately.

Landing and client lint also have many source errors, mainly:

- `no-explicit-any`
- unused imports
- unescaped apostrophes
- invalid or stale inline ESLint disables
- React compiler rule violations in client

## Compile-Time Audit

### Landing App

Main risks:

- Static pages fetch backend content during build.
- Some public service pages have large first-load JavaScript sizes, especially service detail pages.
- `next.config.ts` ignores TypeScript and ESLint failures during builds.
- Client-heavy sections use animation and rich UI dependencies broadly.

Recommended actions:

1. Make content fetching build-safe.
2. Use ISR for public CMS content instead of fully dynamic fetches.
3. Dynamically import heavy client-only components such as auth modals, animated sections, markdown renderers, and package comparison UI.
4. Remove `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` after lint/type fixes.
5. Run bundle analysis after the build is clean and target the largest route chunks first.

### Admin App

Main risks:

- Many admin pages are form/table-heavy client components.
- Build succeeds, but lint is polluted by generated `dist`.
- Next 16 warns that `middleware` should migrate to `proxy`.

Recommended actions:

1. Ignore generated `dist/**` in ESLint.
2. Migrate `middleware.ts` to the current Next `proxy.ts` convention.
3. Split large pages into server shells plus focused client form/table islands.
4. Lazy-load modals, rich editors, media pickers, and preview panels.
5. Reuse one admin form validation utility instead of repeating inline checks.

### Client App

Main risks:

- Production build is blocked by a type mismatch.
- `checkout/page.tsx` uses `any` for package data and pricing.
- Dashboard/reporting libraries such as `recharts` should be isolated to the routes that need them.
- Profile and checkout validation logic is repeated inline.

Recommended actions:

1. Fix the `ClientProfileUpdate` contract mismatch.
2. Replace `any` in checkout package/pricing code with explicit interfaces.
3. Dynamically import chart-heavy components.
4. Create shared client-side validation helpers for name, phone, country code, GST, and state code.

### Backend API

Main risks:

- Backend build takes 51.59s and runs Prisma generation as part of the build path.
- Test modules are stale.
- DTO validation exists globally through `CustomValidationPipe`, but several DTOs do not define strict name rules or length limits.
- API response normalization is inconsistent across frontends; code frequently checks `res.data || res || []`.

Recommended actions:

1. Make Prisma generation cacheable and only rerun when the schema changes.
2. Fix stale tests and add validation tests.
3. Add central name/GST/state-code constants next to `phone.constant.ts`.
4. Apply DTO validation consistently at API boundaries.
5. Standardize API response envelopes so frontend services do not need defensive shape guessing.

## Form Validation Audit

### Existing Good Pattern

File: `apps/landing/src/components/ui/PhoneNumberFields.tsx`

This component already enforces:

- Country code starts with `+`
- Country code has 1 to 3 digits
- Local phone number strips non-digits
- Local phone number is limited to exactly 10 digits

This should become the standard pattern for all public, admin, and client phone fields.

### Forms Found

| App | Form | Current Risk |
| --- | --- | --- |
| Landing | `components/contact/ContactForm.tsx` | Phone uses good shared component; first and last names need no-number validation |
| Landing | `components/auth/auth-modals.tsx` | Phone uses good shared component; registration names need no-number validation |
| Landing | `components/blog/detail/CommentSection.tsx` | Needs submit validation if comments are stored |
| Landing | `components/shared/LeadForm.tsx` | Appears incomplete; should either wire validation and submit handling or remove from active UI |
| Admin | `app/users/page.tsx` | Phone is digit-limited; first and last names need no-number validation |
| Admin | `components/TopNavbar.tsx` | Login should normalize email and validate required fields |
| Admin | CMS forms for blogs, FAQs, case studies, portfolio, SEO, team, testimonials, packages | Need length limits and consistent required-field handling |
| Client | `app/profile/page.tsx` | Phone is validated; state/stateCode/name-like fields need stricter checks |
| Client | `app/checkout/page.tsx` | Build-blocking type mismatch; names and state code need stricter validation |
| Client | `components/documents/CreateFolderModal.tsx` | Folder name needs length and character validation |

## Required Data Rules

These rules should be implemented in shared frontend helpers and mirrored in backend DTO constants.

| Field | Rule |
| --- | --- |
| Email | Trim, lowercase, valid email format |
| First name | Required, trim, letters/spaces/apostrophe/dot/hyphen only, no digits |
| Last name | Required, trim, letters/spaces/apostrophe/dot/hyphen only, no digits |
| Phone | Exactly 10 digits, stored without country code |
| Country code | `+` followed by 1 to 3 digits, default `+91` where appropriate |
| GST number | Optional, uppercase, valid 15-character GST pattern |
| State code | Indian GST state code should be exactly 2 digits when used |
| Free text/message | Trim, max length, reject empty content after trim |
| Folder/title/name fields | Trim, min/max length, reject only-symbol names |

Recommended constants:

```ts
export const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{0,49}$/;
export const LOCAL_PHONE_PATTERN = /^\d{10}$/;
export const COUNTRY_CODE_PATTERN = /^\+[1-9]\d{0,2}$/;
export const GST_NUMBER_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const INDIAN_STATE_CODE_PATTERN = /^\d{2}$/;
```

## Phased Plan

### Phase 0: Make the Baseline Trustworthy

1. Fix `apps/client` build by resolving the `stateCode` profile update contract.
2. Add `dist/**` to admin ESLint ignores.
3. Fix stale backend test providers and mocks.
4. Capture clean baseline timings again for all apps.

Exit criteria:

- All production builds pass.
- Backend tests run without stale dependency failures.
- Lint output points only to real source issues.

### Phase 1: Centralize Validation

1. Add shared validation constants/helpers.
2. Reuse the existing phone-field behavior across admin and client.
3. Add no-number name validation to:
   - landing contact form
   - landing registration form
   - admin manual user creation form
   - client checkout/profile where editable
4. Add backend name constants and `@Matches` decorators to:
   - `RegisterDto`
   - `CreateLeadDto`
   - `CreateClientWithPlanDto`
   - update DTOs that accept user names
5. Add max length rules for message, title, folder, CMS, and package fields.

Exit criteria:

- Users cannot type more than 10 local phone digits.
- Users cannot submit a name containing numbers.
- Backend rejects invalid values even if frontend checks are bypassed.

### Phase 2: Reduce Frontend Compile and Route Cost

1. Remove build-time live API fetches from landing static generation.
2. Use ISR for CMS-backed public pages.
3. Lazy-load client-only heavy UI:
   - auth modals
   - animated marketing sections
   - markdown rendering
   - chart/report components
   - media pickers and rich editors
4. Split oversized admin/client pages into route shells plus focused components.
5. Run route-level bundle analysis and optimize largest chunks first.

Exit criteria:

- Landing build no longer waits on unavailable backend API calls.
- Service page first-load JS is reduced.
- Admin/client route chunks only load page-specific heavy dependencies.

### Phase 3: Improve API Build and Runtime Reliability

1. Cache Prisma generation based on `backend/prisma/schema.prisma`.
2. Standardize API response envelopes.
3. Remove frontend `res.data || res || []` response guessing once APIs are consistent.
4. Add DTO tests for validation.
5. Add API integration tests for lead creation, registration, manual client creation, and profile update.

Exit criteria:

- Backend build time is repeatable and cache-friendly.
- Frontend services use typed response contracts.
- Form submission paths have API-level tests.

### Phase 4: Guardrails

1. Add CI checks for builds, lint, backend tests, and type checks.
2. Add a lightweight form-validation test suite.
3. Track build timings per app on every deployment.
4. Fail deployment if the landing build uses fallback content unexpectedly.

Exit criteria:

- Regressions are caught before deployment.
- Build-time and form-quality improvements stay enforced.

## Recommended First Implementation Order

1. Fix `apps/client/src/services/api.ts` and `apps/client/src/app/checkout/page.tsx` contract mismatch.
2. Fix backend test wiring.
3. Add shared validation constants and apply them to the four highest-risk user-input flows:
   - landing contact
   - landing registration
   - admin manual client creation
   - client checkout/profile
4. Make landing static builds skip live backend fetches.
5. Run bundle analysis and optimize the largest route chunks.
