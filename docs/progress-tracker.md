# Living Project Progress Tracker & Status Dashboard — Keras Web

> **Operational Protocol**: Every future prompt, feature addition, bugfix, or refactoring in this repository MUST conclude by updating this tracker:
> 1. Check off completed items from the Remaining Backlog.
> 2. Add any newly identified technical debt or discovered edge cases.
> 3. Append a new dated entry to the Changelog with the commit hash and summary.
> 4. Recalculate the overall progress percentage.

---

## 1. Project Metadata & Vital Stats

| Metric | Details |
| :--- | :--- |
| **Project Name** | Keras (کراس) — Luxury Athletic Wear & Athleisure |
| **Current Version** | `v0.8.0-alpha` |
| **Last Updated** | 2026-10-01 (1405-07-10) |
| **Architecture** | Nuxt 4 (`app/` directory structure, SSR + SWR hybrid) |
| **Frontend Core** | Vue 3.5, TypeScript 5.7, Vite 8, Pinia 4 (`@pinia/nuxt`) |
| **Design System** | Tailwind CSS v4, tw-animate-css, Reka UI, shadcn-nuxt, Lucide Icons |
| **Server Engine** | Nitro Server (isolated mock API endpoints in `server/api/`) |
| **Validation Layer** | Vee-Validate 4, Zod 3.25 |
| **Target Direction** | RTL-First (Persian / Farsi language support) |
| **Overall Completion** | **~75%** (Core E-Commerce & Storefront Journey Complete) |

```
Progress: [███████████████░░░░░] 75%
```

---

## 2. Phase Status Overview (Roadmap Matrix)

| Phase | Description | Status | Completion |
| :--- | :--- | :---: | :---: |
| **Phase 1** | Design System, Foundations & Global Layout | **Completed** | 100% |
| **Phase 2** | Product Discovery & PDP Experience | **Completed** | 100% |
| **Phase 3** | Cart, Wishlist & Checkout Funnel | **Completed** | 100% |
| **Phase 4** | Customer Account, Authentication & Order Tracking | **In Progress** | 15% |
| **Phase 5** | Integrations (Payment Gateway / SMS Provider) & Pre-Launch Hardening | **Pending** | 0% |

---

## 3. Detailed Completed Modules (What Works Today)

### 3.1 Design System & Foundations (Phase 1)
- **Design Tokens**: Standardized Keras palette (`ink: #3B2F2C`, `sand: #F1E7DC`, `paper: #FBF6F1`, `rose: #B8475F`, `sage: #56705B`, `clay: #C98F78`) defined in `app/assets/css/tailwind.css`.
- **RTL Logical Styling**: Strict enforcement of logical properties (`ms-*`, `ps-*`, `inset-s-*`, `inset-e-*`, `text-start`). Verified via `bun run lint:rtl`.
- **Token Linter**: Strict prohibition of hardcoded hex values in Vue templates. Verified via `bun run lint:tokens`.
- **Global Layout & Navigation**: Resilient `AppHeader.vue`, `AppFooter.vue`, and `MobileNav.vue` with explicit layout imports in `app/layouts/default.vue`.
- **Persian Formatting Utilities**: `toFa()`, `formatToman()`, and metric formatters in `app/utils/format.ts`.

### 3.2 Product Discovery & Catalog (`/shop`) (Phase 2)
- **Interactive Collection Page**: `app/pages/shop/index.vue` with responsive sidebar filter panel and product grid.
- **Two-Way URL Query Sync**: Filters (`line`, `category`, `size`, `color`, `sort`, `min_price`, `max_price`, `q`) reactively synchronize with browser query strings via `useRouter().replace`.
- **Components**: `FilterPanel.vue`, `SortSelect.vue`, `CatalogSkeleton.vue`, `CatalogEmptyState.vue`.
- **Nitro API Endpoint**: `GET /api/products` with dynamic query filtering, multi-criteria sorting, and price range evaluation.

### 3.3 Product Detail Page (`/products/[slug]`) (Phase 2)
- **Editorial Presentation**: Dynamic PDP with hero image gallery (`ProductGallery.vue`), line badge, sticky buy bar (`StickyBuyBar.vue`), and size selection (`SizeSelector.vue`).
- **Interactive Metric Size Guide**: `SizeGuideModal.vue` with strict metric units only (CM/KG), interactive fit finder calculator, and visual measurement guide.
- **Fabric & Technical Specs**: Visual indicators for softness, stretch, and breathability (`FabricMeters.vue`).
- **Customer Reviews**: Rating overview, breakdown bars, and review list (`ProductReviews.vue`) backed by `GET /api/products/:slug/reviews`.
- **Cross-Sell & Related Products**: Curated line recommendations carousel (`RelatedProducts.vue`) backed by `GET /api/products/:slug/related`.

### 3.4 Cart & Shopping Bag System (Phase 3)
- **Slide-over Drawer**: `app/components/cart/CartDrawer.vue` with animated backdrop, item list, quantity updates, and free shipping progress bar.
- **Persistent Store**: `app/stores/cart.ts` using Pinia with hydration-safe `localStorage` persistence, error-tolerant storage checks, and subtotal calculations.
- **Value Proposition**: Dynamic free shipping meter with 1,500,000 Toman threshold (`FREE_SHIPPING_THRESHOLD`).
- **Full Cart Page**: `app/pages/cart.vue` with detailed line item management, discount voucher validation, and summary breakdown.
- **Coupon Engine**: `POST /api/cart/validate-coupon` verifying promotional vouchers (`KERAS10`, `WELCOME`, `MOVE20`).

### 3.5 Checkout & Order Funnel (Phase 3)
- **2-Step Checkout Page**: `app/pages/checkout.vue` with stepper (`CheckoutSteps.vue`) and live order summary (`CheckoutOrderSummary.vue`).
- **Form Validation**: Form handling using `vee-validate` and `@vee-validate/zod` with Iranian mobile regex (`09\d{9}`) and 10-digit postal code validation.
- **Shipping & Payment**: Support for standard/express shipping options and online gateway or card-to-card payment methods.
- **Order Generation**: `POST /api/checkout/orders` producing simulated order receipts with tracking identifiers (`KERAS-XXXXXX`).
- **Order Confirmation**: `app/pages/checkout/success.vue` displaying order receipt, delivery timeline, and direct tracking buttons.

### 3.6 Wishlist & Bookmarks System (Phase 3)
- **Dedicated Store**: `app/stores/wishlist.ts` with hydration-safe client persistence (`keras_wishlist_items`), reactive counts, and toast notifications.
- **UI Triggers**: Floating heart action button on `ProductCard.vue` and PDP action bar.
- **Live Badges**: Real-time reactive item count badge on desktop header (`AppHeader.vue`) and mobile menu (`MobileNav.vue`).
- **Full Wishlist Page**: `app/pages/wishlist.vue` featuring responsive product cards, direct size-picker add-to-cart pills (`quickAddToCart`), and empty state CTA.

---

## 4. Remaining Backlog & Pending Milestones

### 4.1 Phase 4: Customer Account, Authentication & Order Tracking
- [ ] **[P0 - Critical] SMS OTP Authentication**:
  - Modal / page for Iranian phone number input (`09...`).
  - OTP verification input with 5-digit code using `InputOTP` / countdown resend timer.
  - Pinia auth store (`useAuthStore`) storing auth tokens / mock user state.
  - Nitro endpoints: `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`.
- [ ] **[P0 - Critical] User Account Dashboard (`/account`)**:
  - Overview tab with recent orders, default shipping address, and loyalty points.
  - Profile settings tab with name, phone, and email update forms.
  - Address book management (add, edit, set default shipping address).
  - Order history tab listing previous purchases with status badges.
- [ ] **[P1 - High] Order Tracking Page (`/tracking`)**:
  - Order lookup input by tracking number (`KERAS-XXXXXX`) or mobile phone.
  - Visual status timeline (ثبت سفارش -> در حال پردازش -> تحویل به پست -> تحویل شده).

### 4.2 Phase 5: Payment Gateway, Search & Hardening
- [ ] **[P1 - High] IPG (Shaparak) Gateway Callback Integration**:
  - Simulated payment gateway redirect page (`/checkout/payment-gateway`).
  - Callback verification endpoint (`POST /api/checkout/payment/callback`) handling success/failure states and transaction reference IDs.
- [ ] **[P1 - High] Live Search Autocomplete**:
  - Instant debounced search suggestions dropdown in `AppHeader.vue` showing top matching products and direct category links.
  - Nitro endpoint `GET /api/search/suggestions`.
- [ ] **[P2 - Polish] End-to-End Automated Testing**:
  - Playwright test suite for critical e-commerce flows (PDP -> Add to Cart -> Checkout -> Wishlist).
- [ ] **[P2 - Polish] Static & Editorial Pages**:
  - About Us (`/about`), Contact (`/contact`), FAQ (`/faq`), Terms & Conditions (`/terms`), Privacy Policy (`/privacy`).
- [ ] **[P2 - Polish] Production Deployment & CI/CD**:
  - Multi-stage Dockerfile for containerized deployment.
  - GitHub Actions CI pipeline for linting, typechecking, and build validation.

---

## 5. Technical Debt & Architecture Watchlist

1. **Server Order Persistence**:
   - Currently, orders generated in `server/api/orders/create.post.ts` return a receipt to the client and store it solely in client `sessionStorage`. There is no Nitro server-side registry or mock repository, meaning orders cannot currently be queried by ID from another session or from `/tracking`.
2. **Account Page Current State**:
   - `app/pages/account.vue` is currently an unauthenticated static navigation menu linking to informational pages with a banner noting that SMS OTP is coming soon.
3. **Tracking Page Current State**:
   - `app/pages/tracking.vue` is a 16-line placeholder stub, despite `/checkout/success.vue` and `AppFooter.vue` actively linking to it.
4. **Guest vs. Member Identity**:
   - Cart and wishlist hydration are safeguarded with `import.meta.client` in `localStorage` for guests. Once authentication is introduced, a guest-to-member cart/wishlist merge strategy is needed.
5. **SSR Route Rules**:
   - Non-cacheable user-specific routes (`/cart`, `/checkout/**`, `/account/**`) are explicitly marked as `ssr: false` in `nuxt.config.ts`. Once `/account` and `/tracking` are completed, maintain `ssr: false` or implement server session cookies.

---

## 6. Changelog & Activity Log

- **2026-10-01 (`ce4114c`)**: `docs: establish living project progress tracker and roadmap dashboard`
  - Created centralized living tracker at `docs/progress-tracker.md`.
- **2026-10-01 (`3700d69`)**: `fix(layout): restore AppHeader mounting, explicit imports, and harden store hydration`
  - Explicitly imported layout components in `default.vue`.
  - Added safe optional-chaining guards for store item counts in `AppHeader.vue` and `MobileNav.vue`.
  - Hardened client-side storage hydration in `stores/wishlist.ts` and `stores/cart.ts`.
- **2026-10-01 (`da6789d`)**: `feat(wishlist): implement reactive pinia wishlist store, ui triggers, and full wishlist page`
  - Defined `WishlistItem` in `types/domain.ts`.
  - Created `useWishlistStore` with `localStorage` persistence.
  - Added floating heart toggles in `ProductCard.vue` and PDP.
  - Built full editorial wishlist page (`/wishlist`) with quick add-to-cart size pills.
- **2026-10-01 (`ff6b673`)**: `feat(pdp): implement interactive metric size guide and smart fit calculator modal`
  - Created `SizeGuideModal.vue` with strict metric units only (CM/KG).
  - Integrated fit calculator with body measurement comparison.
- **2026-10-01 (`c351fbe`)**: `docs(audit): complete end-to-end audit, fix edge case bugs, and document in docs/report.md`
  - Audited full flow across storefront, catalog, cart, and checkout.
- **2026-10-01 (`6d721ad`)**: `feat(catalog): implement interactive shop page with two-way URL sync, filter panel, and skeleton loaders`
  - Dynamic filtering and sorting with Nitro API integration and URL sync.
- **2026-10-01 (`64a465f`)**: `feat(checkout): implement full cart page, 2-step checkout flow, and order confirmation`
  - Full `/cart`, `/checkout`, and `/checkout/success` funnel with Vee-Validate and Zod.
- **2026-10-01 (`3643c01`)**: `fix(cart): normalize store exports, hydration lifecycle, and navigation routes`
  - Fixed Pinia store export identifier mismatch and route warnings.
- **2026-10-01 (`06b38f0`)**: `feat(cart): implement Pinia cart store and editorial slide-over drawer`
  - Built `CartDrawer.vue` and `useCartStore` with free shipping progress meter.
- **2026-10-01 (`18a522b`)**: `feat(pdp): add product reviews and related products cross-sell sections`
  - Implemented `ProductReviews.vue` and `RelatedProducts.vue` on PDP.
- **2026-10-01 (`aee455a`)**: `refactor(frontend): decouple mock layer to Nitro server API and enforce strict domain typing`
  - Cleaned up mock data from `app/data` to Nitro server routes.

---

## 7. Proposed Next Strategic Steps (Awaiting Lead Approval)

Following our comprehensive repository inspection and dependency analysis, three concrete architectural paths have been formulated for the upcoming sprint. Each option addresses a distinct layer of the product journey.

---

### Option A [Priority: P0 — Critical Core]: Complete Customer Authentication (SMS OTP) & Account Dashboard

- **Core Focus**: User Identity, Customer Retention & Personalization
- **Architectural Rationale**: 
  Currently, clicking the User icon in `AppHeader.vue` or navigating to `/account` presents a placeholder screen. E-commerce platforms rely on user identity for customer lifetime value (LTV). Implementing SMS OTP authentication provides the missing identity layer that unlocks saved addresses for 1-click checkout autofill, personalized order histories, and seamless guest-to-member transitions.
- **Scope & Affected Files**:
  1. **Domain & Typing**:
     - `app/types/domain.ts`: Extend with `UserProfile`, `UserAddress`, `AuthSession`, `OtpRequest`, `OtpVerify`.
  2. **Pinia Store**:
     - `app/stores/auth.ts`: `useAuthStore` with token persistence, user state, address book actions, and login/logout methods.
  3. **Nitro Server Routes**:
     - `server/api/auth/otp/send.post.ts`: Validates Iranian mobile regex (`09\d{9}`) and dispatches simulated 5-digit OTP with 120s cooldown.
     - `server/api/auth/otp/verify.post.ts`: Verifies OTP token and returns authenticated session with mock user profile.
     - `server/api/auth/me.get.ts` & `server/api/auth/me.put.ts`: User profile retrieval and modification.
     - `server/api/auth/addresses.get.ts` & `server/api/auth/addresses.post.ts`: Address management.
  4. **UI Components**:
     - `app/components/auth/AuthModal.vue`: Slide-over/dialog featuring phone input step and 5-digit `InputOTP` step with timer.
     - `app/components/account/AddressCard.vue` & `AddressModal.vue`: Address book management.
     - `app/components/account/OrderHistoryItem.vue`: Expandable past order cards.
  5. **Page Overhaul**:
     - `app/pages/account.vue`: Full authenticated dashboard with tabs for Overview, Orders, Saved Addresses, and Profile Settings (with unauthenticated fallback to inline OTP prompt).
- **Dependencies Unlocked**: 
  - Autofill addresses in `/checkout.vue`.
  - Merging guest cart/wishlist into member accounts.
- **Estimated Impact on Completion**: **+12%** (Brings total project progress to **87%**).

---

### Option B [Priority: P0/P1 — High Flow]: Order Lifecycle, Server Persistence & Live Tracking Subsystem

- **Core Focus**: Post-Purchase Journey & Fulfillment Trust
- **Architectural Rationale**: 
  Right now, when a customer places an order, the receipt is stored purely in client-side `sessionStorage` within `cartStore`. If the user opens a new tab or refreshes after the session expires, the order is lost. Crucially, `/checkout/success.vue` provides a prominent CTA button to `/tracking`, but `app/pages/tracking.vue` is an empty 16-line stub. Closing this gap ensures every order generated has persistent server-side lookup and delivers a best-in-class tracking experience.
- **Scope & Affected Files**:
  1. **Server Repository**:
     - `server/mock/orders.ts`: In-memory persistent order store seeded with realistic past orders and dynamic runtime order appending.
  2. **Nitro Server Routes**:
     - `server/api/orders/create.post.ts`: Update to persist the created order in `server/mock/orders.ts`.
     - `server/api/orders/[orderNumber].get.ts`: Lookup order details by order ID (`KRS-XXXXXX`).
     - `server/api/orders/track.post.ts`: Query orders by order ID + customer phone number with detailed fulfillment timeline events.
  3. **Domain & Typing**:
     - `app/types/domain.ts`: Extend with `TrackingTimelineEvent`, `OrderStatus` (`registered` -> `processing` -> `dispatched` -> `delivered`), `PostalTrackingInfo`.
  4. **Page & Component Implementation**:
     - `app/pages/tracking.vue`: Full rebuild featuring tracking code search bar, phone verification, active status stepper, simulated Iran Post tracking code (`18-digit`), and parcel items breakdown.
     - `app/components/tracking/TrackingTimeline.vue`: Visual milestone timeline with timestamps and fulfillment statuses.
- **Dependencies Unlocked**:
  - Seamless redirection from `/checkout/success.vue` to `/tracking?code=KRS-XXXXXX`.
  - Reusable order lookup component for both guest tracking and member account order history.
- **Estimated Impact on Completion**: **+8%** (Brings total project progress to **83%**).

---

### Option C [Priority: P1 — Commercial Polish]: Instant Search Autocomplete, IPG Gateway Simulation & Brand Pages

- **Core Focus**: Conversion Optimization, Payment Realism & Brand Completeness
- **Architectural Rationale**: 
  The core buying funnel is functional, but lacks key commercial polish that creates luxury store credibility:
  1. The header search bar currently only triggers on full Enter submission to `/shop?q=...` without instant live suggestions.
  2. The checkout flow immediately creates a completed order without simulating the actual Iranian online payment gateway (Shaparak) redirect, callback verification, and potential payment failure recovery.
  3. Informational footer pages (`/about`, `/contact`, `/faq`, `/returns`, `/terms`, `/privacy`) have placeholder copy.
- **Scope & Affected Files**:
  1. **Search Autocomplete**:
     - `server/api/search/suggestions.get.ts`: Fast prefix/fuzzy matching returning top product cards, matching categories, and price tags.
     - `app/components/layout/AppHeader.vue`: Integration of debounced live dropdown with thumbnail previews and arrow-key navigation.
  2. **IPG Gateway Simulation**:
     - `app/pages/checkout/gateway.vue`: Dedicated Shaparak simulated banking gateway interface with card number inputs, CVV2, captcha, dynamic OTP request, and success/cancel action buttons.
     - `server/api/checkout/payment/callback.post.ts`: Transaction verification endpoint that receives gateway callback and marks order as paid or failed.
     - `app/pages/checkout.vue`: Redirecting to gateway on 'online_gateway' selection, with handling for returned error callbacks.
  3. **Editorial Brand Pages**:
     - `app/pages/about.vue`, `app/pages/contact.vue`, `app/pages/faq.vue`, `app/pages/returns.vue`, `app/pages/terms.vue`, `app/pages/privacy.vue`: Full editorial copy, accordion FAQ, contact inquiry form, and return policy details.
- **Dependencies Unlocked**:
  - Realistic end-to-end payment testing (success, user-cancelled, declined card).
  - High-converting search discoverability directly from the header.
- **Estimated Impact on Completion**: **+7%** (Brings total project progress to **82%**).
