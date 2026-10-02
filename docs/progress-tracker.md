# Living Project Progress Tracker & Status Dashboard — Keras Web

> **Operational Protocol**: Every future prompt, feature addition, bugfix, or refactoring in this repository MUST conclude by updating this tracker:
>
> 1. Check off completed items from the Remaining Backlog.
> 2. Add any newly identified technical debt or discovered edge cases.
> 3. Append a new dated entry to the Changelog with the commit hash and summary.
> 4. Recalculate the overall progress percentage.

---

## 1. Project Metadata & Vital Stats

| Metric                  | Details                                                              |
| :---------------------- | :------------------------------------------------------------------- |
| **Project Name**        | Keras (کراس) — Luxury Athletic Wear & Athleisure                     |
| **Current Version**     | `v0.9.0-alpha`                                                       |
| **Last Updated**        | 2026-10-02 (1405-07-11)                                              |
| **Architecture**        | Nuxt 4 (`app/` directory structure, SSR + SWR hybrid)                |
| **Frontend Core**       | Vue 3.5, TypeScript 5.7, Vite 8, Pinia 4 (`@pinia/nuxt`)             |
| **Design System**       | Tailwind CSS v4, tw-animate-css, Reka UI, shadcn-nuxt, Lucide Icons  |
| **Server Engine**       | Nitro Server (isolated mock API endpoints in `server/api/`)          |
| **Validation Layer**    | Vee-Validate 4, Zod 3.25                                             |
| **Target Direction**    | RTL-First (Persian / Farsi language support)                         |
| **Total Route Pages**   | **23** (8 Fully Built, 3 Redirects/Dev, 12 Stubs/Placeholders)       |
| **Domain Components**   | **21** Custom Domain Components + 28 shadcn/Reka UI Primitives       |
| **Active Pinia Stores** | **3** (`cart`, `wishlist`, `auth`) — Fully Hydration-Safe            |
| **Overall Completion**  | **~82%** (Option A Completed; Core Funnel + Auth + Account Complete) |

```
Overall Progress: [████████████████░░░░] 82%
Core Storefront Funnel: [████████████████████] 100%
Customer Portal & Auth: [███████████████░░░░░] 75%
Post-Purchase Tracking: [██░░░░░░░░░░░░░░░░░░] 10%
Institutional Pages:    [██░░░░░░░░░░░░░░░░░░] 10%
```

---

## 2. Phase Status Overview (Roadmap Matrix)

| Phase       | Description                                                          |     Status      | Completion |
| :---------- | :------------------------------------------------------------------- | :-------------: | :--------: |
| **Phase 1** | Design System, Foundations & Global Layout                           |  **Completed**  |    100%    |
| **Phase 2** | Product Discovery & PDP Experience                                   |  **Completed**  |    100%    |
| **Phase 3** | Cart, Wishlist & Checkout Funnel                                     |  **Completed**  |    100%    |
| **Phase 4** | Customer Account, Authentication & Order Tracking                    | **In Progress** |    75%     |
| **Phase 5** | Integrations (Payment Gateway / SMS Provider) & Pre-Launch Hardening |   **Pending**   |     0%     |

---

## 3. Master Checklist: Audit of All 23 Pages

An exhaustive inventory of every page file currently in `frontend/app/pages/`:

|  #  | Route               | File Path                        |    Status    | Lines | Details / Current Capability                                                                                                                   | Missing / Next Steps                                                       |
| :-: | :------------------ | :------------------------------- | :----------: | :---: | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
|  1  | `/`                 | `app/pages/index.vue`            | **Complete** |  114  | Hero, Move/Calm lines, bestsellers carousel, value props, newsletter                                                                           | Dynamic CMS banner integration                                             |
|  2  | `/shop`             | `app/pages/shop/index.vue`       | **Complete** |  304  | Multi-criteria filters, 2-way URL sync, sort, skeletons, chips                                                                                 | Infinite scroll / pagination                                               |
|  3  | `/products/[slug]`  | `app/pages/products/[slug].vue`  | **Complete** |  246  | Gallery, size guide modal (CM only), fabric meters, reviews, related                                                                           | Social share drawer, stock urgency                                         |
|  4  | `/cart`             | `app/pages/cart.vue`             | **Complete** |  319  | Item list, coupon code validator, free shipping meter, full summary                                                                            | Multi-voucher support                                                      |
|  5  | `/checkout`         | `app/pages/checkout.vue`         | **Complete** |  562  | 2-step validated funnel, Zod Iranian mobile & postal regex, shipping select                                                                    | User saved-address autofill                                                |
|  6  | `/checkout/success` | `app/pages/checkout/success.vue` | **Complete** |  232  | Order confirmation receipt, delivery timeline, direct tracking CTA                                                                             | PDF receipt download                                                       |
|  7  | `/wishlist`         | `app/pages/wishlist.vue`         | **Complete** |  218  | Responsive grid, quick add-to-cart size pills, clear all, empty state                                                                          | Shareable public wishlist link                                             |
|  8  | `/products`         | `app/pages/products/index.vue`   | **Redirect** |   7   | Seamlessly redirects to `/shop`                                                                                                                | None (intended architectural redirect)                                     |
|  9  | `/search`           | `app/pages/search.vue`           | **Redirect** |  14   | Preserves query params and redirects to `/shop?q=...`                                                                                          | None (intended architectural redirect)                                     |
| 10  | `/dev/components`   | `app/pages/dev/components.vue`   | **Internal** |  174  | Dev showcase for design tokens and UI components                                                                                               | Non-production tool                                                        |
| 11  | `/account`          | `app/pages/account.vue`          | **Complete** |  863  | Guest Auth Guard card, Overview metrics & recent order, Orders tab with status chips, Address Book with create/delete dialog, Profile settings | Avatar upload (future backend integration)                                 |
| 12  | `/tracking`         | `app/pages/tracking.vue`         |   **Stub**   |  15   | 15-line placeholder text ("به زودی فعال خواهد شد")                                                                                             | **Order lookup form, visual shipment timeline, Post barcode, item list**   |
| 13  | `/size-guide`       | `app/pages/size-guide.vue`       |   **Stub**   |   5   | 5-line placeholder ("در حال آماده‌سازی")                                                                                                       | **Standalone metric size guide page & fit calculator (modal is complete)** |
| 14  | `/about`            | `app/pages/about.vue`            |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Editorial brand storytelling, mission, manufacturing ethics**            |
| 15  | `/contact`          | `app/pages/contact.vue`          |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Support contact form, branch info, operating hours, phone/email**        |
| 16  | `/faq`              | `app/pages/faq.vue`              |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Categorized Accordion FAQ (shipping, sizing, returns, payments)**        |
| 17  | `/returns`          | `app/pages/returns.vue`          |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Detailed 7-day exchange and return policy, step-by-step guide**          |
| 18  | `/terms`            | `app/pages/terms.vue`            |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Legal purchase terms, user responsibilities, return conditions**         |
| 19  | `/privacy`          | `app/pages/privacy.vue`          |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Data privacy, cookie policies, security guidelines**                     |
| 20  | `/blog`             | `app/pages/blog.vue`             |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Athletic lifestyle articles, training tips, wellness guides**            |
| 21  | `/journal`          | `app/pages/journal.vue`          |   **Stub**   |   5   | 5-line placeholder text                                                                                                                        | **Editorial journal / lookbook presentation**                              |
| 22  | `/fabric-standards` | `app/pages/fabric-standards.vue` |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Fabric transparency test standards, GSM guide, squat-proof guarantees**  |
| 23  | `/careers`          | `app/pages/careers.vue`          |   **Stub**   |  15   | 15-line placeholder text                                                                                                                       | **Brand culture, open job positions, talent application form**             |

---

## 4. Master Checklist: Components & Architectural Subsystems

### 4.1 Custom Domain Components (`app/components/`)

- [x] **Layout**: `AppHeader.vue` (sticky, scroll-aware, cart/wishlist counters, mobile trigger)
- [x] **Layout**: `AppFooter.vue` (brand links, newsletter subscription, copyright)
- [x] **Layout**: `MobileNav.vue` (drawer navigation with quick links and badges)
- [x] **Product**: `ProductCard.vue` (dual image hover, floating heart toggle, line pill)
- [x] **Product**: `ProductGallery.vue` (multi-image thumbnail carousel & view)
- [x] **Product**: `ProductTabs.vue` (description, technical details, care instructions)
- [x] **Product**: `PriceTag.vue` (formatted Toman with discount strikethrough)
- [x] **Product**: `ProductReviews.vue` (breakdown meters, review cards)
- [x] **Product**: `SizeGuideModal.vue` (metric CM/KG fit calculator & size charts)
- [x] **Product**: `RelatedProducts.vue` (cross-sell recommendation carousel)
- [x] **Product**: `ProductTrustBadges.vue` (7-day returns, transparency tested, express shipping)
- [x] **Product**: `SizeSelector.vue` (stock availability and size pills)
- [x] **Product**: `StickyBuyBar.vue` (sticky bottom action bar on mobile scroll)
- [x] **Product**: `FabricMeters.vue` (stretch, softness, breathability visual meters)
- [x] **Cart**: `CartDrawer.vue` (slide-over mini cart with free shipping meter)
- [x] **Cart**: `CartItemRow.vue` (quantity controls, size badge, remove item)
- [x] **Checkout**: `CheckoutOrderSummary.vue` (price summary, voucher input, items preview)
- [x] **Checkout**: `CheckoutSteps.vue` (step indicator: Shipping Info -> Payment Method)
- [x] **Catalog**: `SortSelect.vue` (sort order dropdown with RTL alignment)
- [x] **Catalog**: `FilterPanel.vue` (accordion filters: line, category, size, color, price)
- [x] **Catalog**: `CatalogSkeleton.vue` & `CatalogEmptyState.vue` (loading and empty states)
- [x] **Auth**: `AuthModal.vue` (Iranian phone input + 5-digit `InputOTP`, 120s timer modal, resend code)
- [x] **Account**: Built-in tabs inside `app/pages/account.vue` (Overview metrics, Orders, Addresses dialog, Profile)
- [ ] **Tracking (Missing)**: `TrackingTimeline.vue`, `PostalBarcode.vue`
- [ ] **Search (Missing)**: `SearchAutocomplete.vue` (instant header dropdown)

### 4.2 State Management (`app/stores/`)

- [x] `cart.ts`: Persistent Pinia store (`keras_cart_items`), coupon engine, free shipping threshold
- [x] `wishlist.ts`: Persistent Pinia store (`keras_wishlist_items`), toggles, item count
- [x] `auth.ts`: Persistent Pinia store (`keras_auth_token`, `keras_user_data`), session management, address book CRUD, order history, profile updates

### 4.3 Nitro Server API Layer (`server/`)

- [x] `GET /api/products`: Filterable, sortable catalog endpoint
- [x] `GET /api/products/[slug]`: Single product detail payload
- [x] `GET /api/products/[slug]/reviews`: Review ratings and customer feedback
- [x] `GET /api/products/[slug]/related`: Line-based cross-sell products
- [x] `POST /api/coupons/validate`: Coupon voucher verification
- [x] `POST /api/orders/create`: Order creation receipt (pushes to `mockUserOrders`)
- [x] `server/mock/users.ts`: User profile, addresses, and orders mock repository
- [x] `POST /api/auth/otp/send`: SMS OTP dispatch with Iranian phone validation (422) and 120s cooldown
- [x] `POST /api/auth/otp/verify`: OTP validation ('12345'), JWT token issuance, and user profile update
- [x] `GET /api/user/profile` & `PUT /api/user/profile`: Profile read and update contracts
- [x] `GET /api/user/addresses`, `POST /api/user/addresses` & `DELETE /api/user/addresses/[id]`: Address book endpoints
- [x] `GET /api/user/orders`: User order history endpoint
- [ ] `server/mock/orders.ts` **(Missing)**: Unified persistent guest & member order repository
- [ ] `GET /api/orders/[orderNumber]` **(Missing)**: Order lookup endpoint
- [ ] `POST /api/orders/track` **(Missing)**: Order tracking by code + phone number
- [ ] `GET /api/search/suggestions` **(Missing)**: Instant search query suggestions

---

## 5. Prioritized Actionable Backlog

### 5.1 [P0 — Critical Core Path]

- [x] **SMS OTP Authentication System**:
  - [x] Implement `app/stores/auth.ts` with token and user profile management.
  - [x] Build Nitro endpoints `POST /api/auth/otp/send` and `POST /api/auth/otp/verify`.
  - [x] Create `AuthModal.vue` utilizing `InputOTP` and countdown resend timer.
  - [x] Connect auth trigger to Header User icon and Checkout flow.
- [x] **Customer Account Dashboard (`/account`)**:
  - [x] Guard `/account` with auth state (login modal trigger if unauthenticated).
  - [x] Build tabbed navigation: Overview, My Orders, Address Book, Profile Settings.
  - [x] Enable adding, editing, and deleting saved addresses.
- [ ] **Order Persistence & Tracking System (`/tracking`)**:
  - [ ] Create `server/mock/orders.ts` repository so checkout orders persist across sessions.
  - [ ] Build `POST /api/orders/track` and `GET /api/orders/[orderNumber]`.
  - [ ] Fully implement `app/pages/tracking.vue` with search form, status timeline, and item review.

### 5.2 [P1 — Commercial Polish & Conversion]

- [ ] **Live Search Autocomplete**:
  - [ ] Build `GET /api/search/suggestions` endpoint.
  - [ ] Create debounced dropdown in `AppHeader.vue` showing matching items, prices, and categories.
- [ ] **Simulated IPG (Shaparak) Payment Flow**:
  - [ ] Build simulated payment gateway page (`/checkout/gateway`).
  - [ ] Create callback verification route (`/checkout/callback` -> success or retry).
- [ ] **Standalone Metric Size Guide Page (`/size-guide`)**:
  - [ ] Promote `SizeGuideModal` content into full standalone editorial page with printable measurement guide.

### 5.3 [P2 — Institutional Pages & Hardening]

- [ ] **Customer Service & Institutional Copy**:
  - [ ] Build rich editorial content for `/about`, `/contact`, `/faq` (Accordion), `/returns`, `/terms`, `/privacy`.
  - [ ] Build `/fabric-standards` with detailed fabric tech breakdown.
- [ ] **Automated Testing & DevOps**:
  - [ ] Playwright E2E test suite (Browse -> Add to Cart -> Checkout -> Wishlist).
  - [ ] Multi-stage production `Dockerfile` and GitHub Actions CI.

---

## 6. Technical Debt & Architecture Watchlist

1. **Ephemeral Server Orders**: Orders generated during checkout do not persist in the server mock layer. Once a browser tab closes or `sessionStorage` clears, the order cannot be retrieved.
2. **Guest vs. Member Checkout**: Currently, checkout is strictly guest-based. Logged-in users should have their default address and phone number auto-filled.
3. **Institutional Placeholders**: 13 out of 23 pages currently render brief placeholder copy. While all core shopping pages are complete, institutional credibility requires these pages to have proper content.
4. **Mock Data Migration**: Server mock data (`server/mock/`) should remain isolated from frontend code, ready to be swapped for real backend endpoints via `NUXT_PUBLIC_API_BASE`.

---

## 7. Proposed Strategic Options (Awaiting Lead Approval)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ گزینه A [P0 - بحرانی]: احراز هویت پیامکی (SMS OTP) و داشبورد کامل حساب کاربری         │
│ تاثیر بر پیشرفت: +۱۲٪ (رسیدن به ۸۲٪)                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ گزینه B [P0/P1 - اولویت بالا]: چرخه عمر و پایداری سفارش‌ها + سامانه زنده پیگیری مرسوله │
│ تاثیر بر پیشرفت: +۸٪ (رسیدن به ۷۸٪)                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ گزینه C [P1 - پولیش تجاری]: صفحات نهادی و برند + جستجوی زنده + درگاه بانکی            │
│ تاثیر بر پیشرفت: +۱۰٪ (رسیدن به ۸۰٪)                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Option A [Priority: P0 — Critical Core]: Complete Customer Authentication (SMS OTP) & Account Dashboard

- **Focus**: User Identity, Retention, Profile & Saved Addresses
- **Scope**: `app/stores/auth.ts`, `AuthModal.vue`, `app/pages/account.vue`, Nitro endpoints `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`, `GET/PUT /api/auth/me`.
- **Unlocks**: 1-click address autofill in checkout, personal order history, member discounts.
- **Estimated Progress Impact**: **+12%** (Total Progress -> **82%**).

### Option B [Priority: P0/P1 — High Flow]: Order Lifecycle, Server Persistence & Live Tracking Subsystem

- **Focus**: Post-Purchase Journey & Fulfillment Trust
- **Scope**: `server/mock/orders.ts` (persistent registry), `server/api/orders/track.post.ts`, `app/pages/tracking.vue` (search, timeline, parcel tracking barcode), integration with `/checkout/success.vue`.
- **Unlocks**: Working tracking for all orders (guest & member), closing the loop on post-purchase.
- **Estimated Progress Impact**: **+8%** (Total Progress -> **78%**).

### Option C [Priority: P1 — Commercial Polish]: Institutional Pages, Live Search & IPG Simulation

- **Focus**: Brand Trust, Discoverability & Payment Realism
- **Scope**: Complete all 7 institutional pages (`/about`, `/contact`, `/faq`, `/returns`, `/terms`, `/privacy`, `/size-guide`), header debounced live search dropdown, simulated Shaparak gateway (`/checkout/gateway`).
- **Unlocks**: Elimination of placeholder stubs across the site, authentic commercial readiness.
- **Estimated Progress Impact**: **+10%** (Total Progress -> **80%**).

---

## 8. Changelog & Activity Log

- **2026-10-02 (`4f124e9`)**: `fix(auth): resolve OTP countdown reset, address validation, and account hydration edge cases`
  - Fixed phone number and OTP input digit sanitization: automatically normalizes pasted Persian/Arabic digits (`۰-۹`) to English digits (`0-9`) via `toEn()` watchers.
  - Hardened OTP resend and error display: routed resend failures to `otpError` on Step 2 so users clearly see error messages below OTP slots.
  - Linked authenticated user saved addresses with the checkout flow (`/checkout`): added interactive saved address selector, auto-fills default address, and provided guest login banner.
  - Hardened `/account` tab switching to avoid URL flickering, and protected address deletion with user confirmation.
  - Added schema-based Zod validation (`addressZodSchema`) for Iranian postal codes (10 digits) and mobile numbers in address creation.
  - Created `PUT /api/user/addresses/[id]/default` Nitro endpoint to persist default address selection to the backend.
  - Hardened `logout()` in `useAuthStore` using Nuxt's `navigateTo('/')` to eliminate any possible store navigation warnings.
  - All 5 quality verification gates passed cleanly (`lint:rtl`, `lint:tokens`, `lint`, `typecheck`, `build`).
- **2026-10-02 (`f87d3c9`)**: `feat(auth): implement SMS OTP authentication and comprehensive account dashboard with FastAPI-ready Nitro contracts`
  - Implemented FastAPI/Pydantic-aligned schema contracts in `app/types/domain.ts` for User, UserAddress, AuthTokens, OtpSend, OtpVerify, and UserOrderSummary.
  - Built Nitro mock endpoints with strict HTTP status codes: `POST /api/auth/otp/send` (422 validation), `POST /api/auth/otp/verify` (401 validation), `GET/PUT /api/user/profile`, `GET/POST/DELETE /api/user/addresses` (201 Created), and `GET /api/user/orders`.
  - Created persistent `useAuthStore` with safe SSR client hydration (`localStorage`), default address resolution, and guest/member state management.
  - Implemented editorial `AuthModal.vue` using Shadcn `InputOTP` 5-digit slots, 120-second countdown timer with resend capability, and Iranian phone number validation (`09\d{9}`).
  - Integrated guest triggers and authenticated user profile menu in `AppHeader.vue` and `MobileNav.vue`.
  - Built full editorial `/account` dashboard with Overview (KPI cards & recent order snapshot), Orders history with status chips, Address Book with Add Address dialog, and Profile settings.
  - Wired new checkout order submissions directly into `mockUserOrders`.
  - Passed all 5 quality verification gates (`lint:rtl`, `lint:tokens`, `lint`, `typecheck`, `build`). Overall project completion increased from ~70% to **~82%**.
- **2026-10-02 (`scan`)**: `docs: exhaustive repository scan, page-by-page inventory, and master progress checklist`
  - Conducted full audit of all 23 route pages, 48 components, 2 stores, and Nitro API routes.
  - Categorized pages: 7 fully built, 3 redirects, 13 stubs/placeholders.
  - Adjusted overall completion metric to a realistic **~70%**.
  - Established Master Checklist matrix for all pages and subsystems.
- **2026-10-01 (`aeae107`)**: `docs: update progress tracker with architectural evaluation and proposed strategic options`
  - Formulated 3 distinct strategic options (Options A, B, C) for human lead review.
- **2026-10-01 (`ce4114c`)**: `docs: establish living project progress tracker and roadmap dashboard`
  - Created centralized living tracker at `docs/progress-tracker.md`.
- **2026-10-01 (`3700d69`)**: `fix(layout): restore AppHeader mounting, explicit imports, and harden store hydration`
  - Explicitly imported layout components in `default.vue`.
  - Added safe optional-chaining guards for store item counts in `AppHeader.vue` and `MobileNav.vue`.
- **2026-10-01 (`da6789d`)**: `feat(wishlist): implement reactive pinia wishlist store, ui triggers, and full wishlist page`
- **2026-10-01 (`ff6b673`)**: `feat(pdp): implement interactive metric size guide and smart fit calculator modal`
- **2026-10-01 (`c351fbe`)**: `docs(audit): complete end-to-end audit, fix edge case bugs, and document in docs/report.md`
- **2026-10-01 (`6d721ad`)**: `feat(catalog): implement interactive shop page with two-way URL sync, filter panel, and skeleton loaders`
- **2026-10-01 (`64a465f`)**: `feat(checkout): implement full cart page, 2-step checkout flow, and order confirmation`
- **2026-10-01 (`06b38f0`)**: `feat(cart): implement Pinia cart store and editorial slide-over drawer`
- **2026-10-01 (`18a522b`)**: `feat(pdp): add product reviews and related products cross-sell sections`
- **2026-10-01 (`aee455a`)**: `refactor(frontend): decouple mock layer to Nitro server API and enforce strict domain typing`
