// app/types/domain.ts
export type ActivityType = 'yoga' | 'running' | 'gym' | 'daily' | 'pilates';

export interface Variant {
  id: number;
  sku: string;
  color: string;
  color_hex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | 'Free';
  price_override?: number; // به تومان
  compare_at_price?: number; // به تومان
  stock: number;
  reserved: number;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  kind: 'photo' | 'motion' | 'transparency_test' | 'video';
  position: number;
}

export interface SizeChartEntry {
  height: [number, number];
  weight: [number, number];
  waist?: [number, number];
  hip?: [number, number];
}

export type SizeChart = Record<string, SizeChartEntry>;

export type ProductDivision = 'apparel' | 'accessories';

export type ApparelCategory =
  | 'shirts-blouses'
  | 'knitwear'
  | 'coats-jackets'
  | 'pants'
  | 'tops';

export type AccessoriesCategory =
  | 'hair-accessories'
  | 'bandanas'
  | 'scarves';

export type ProductCategory = ApparelCategory | AccessoriesCategory;

export type ProductSeason =
  | 'fall-1405'
  | 'winter-1405'
  | 'spring-1406'
  | 'summer-1405';

export interface ProductFabric {
  composition: string;
  gsm?: number;
  care: string;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  brand?: string;
  division: ProductDivision;
  category: ProductCategory;
  season: ProductSeason;
  price: number;
  base_price: number;
  compare_at_price?: number;
  images: ProductImage[];
  sizes: string[];
  available_sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  rating: number;
  rating_avg: number;
  reviewCount: number;
  rating_count: number;
  description: string;
  fabric: ProductFabric;
  fabric_composition?: string;
  fabric_gsm?: number;
  is_active: boolean;
  badge?: string;
  has_transparency_test?: boolean;
  stretch?: number;
  softness?: number;
  opacity?: number;
  line?: 'move' | 'calm';
  fit_note?: string;
}

export type ProductListItem = Product;

export interface ProductDetail extends Product {
  category_info?: { id: number; title: string; slug: string };
  activities?: ActivityType[];
  size_chart?: SizeChart;
  fit_note?: string;
  variants: Variant[];
}

export type FitFeedback = 'small' | 'true_to_size' | 'large' | 'runs_small' | 'runs_large';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ProductReviewReply {
  text: string;
  date: string;
  author: string;
}

export interface ProductReview {
  id: string | number;
  productSlug: string;
  productTitle: string;
  productThumbnail: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  fitFeedback?: 'true_to_size' | 'runs_small' | 'runs_large';
  isVerifiedBuyer: boolean;
  status: ReviewStatus;
  reply?: ProductReviewReply;
  // Optional backwards compatibility aliases
  author?: string;
  created_at?: string;
  verified_purchase?: boolean;
  fit_feedback?: FitFeedback;
  size_purchased?: string;
}

export type Review = ProductReview;

export interface ProductReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  fit_breakdown: {
    small: number;
    true_to_size: number;
    large: number;
  };
}

export interface ProductReviewsResponse {
  summary: ProductReviewSummary;
  reviews: ProductReview[];
}

export interface ProductFilters {
  q?: string;
  division?: ProductDivision;
  category?: string;
  season?: ProductSeason;
  brand?: string;
  line?: 'move' | 'calm';
  size?: string;
  color?: string;
  sort?: 'bestseller' | 'newest' | 'price_asc' | 'price_desc';
  min_price?: number;
  max_price?: number;
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
}

export interface CartItem {
  id: string; // کلید ترکیبی: `${product_id}-${variant_id || size}`
  productId: number;
  variantId?: number;
  title: string;
  slug: string;
  size: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxStock: number;
  image: string;
}

export interface CartSummary {
  subtotal: number;
  discountTotal: number;
  shippingEstimate: number;
  finalTotal: number;
  freeShippingRemaining: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string; // 09xxxxxxxxx
  province: string;
  city: string;
  postalCode: string; // 10 digits
  exactAddress: string;
  buildingNumber?: string;
  unit?: string;
  notes?: string;
}

export type PaymentMethod = 'online_gateway' | 'card_to_card';

export type ShippingMethod = 'standard' | 'express';

export interface OrderReceipt {
  orderNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  finalTotal: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discountAmount: number;
  discountPercent?: number;
  message: string;
}

export interface SizeMeasurement {
  size: string;
  waist: number; // دور کمر (CM)
  hips: number; // دور باسن (CM)
  bust?: number; // دور سینه (CM)
  inseam?: number; // قد داخل پا (CM)
}

export type FitPreference = 'snug' | 'regular' | 'relaxed';

export interface FitRecommendation {
  recommendedSize: string;
  confidence: number;
  fitNote: string;
}

export interface WishlistItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  primary_image: string;
  division?: ProductDivision;
  category: ProductCategory | string;
  season?: ProductSeason;
  line?: 'move' | 'calm';
  addedAt: string;
}

// -------------------------------------------------------------
// Auth & User Portal Contracts (FastAPI / Pydantic Schema Aligned)
// -------------------------------------------------------------

export interface User {
  id: string;
  phoneNumber: string; // strictly 09xxxxxxxxx
  fullName?: string;
  email?: string;
  role?: 'customer' | 'super_admin';
  createdAt: string;
}

export interface UserAddress {
  id: string;
  title: string; // e.g. 'منزل', 'محل کار'
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  postalCode: string; // 10 digits
  exactAddress: string;
  buildingNumber?: string;
  unit?: string;
  isDefault: boolean;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string; // 'bearer'
  expiresIn: number; // in seconds
}

export interface OtpSendRequest {
  phoneNumber: string;
}

export interface OtpSendResponse {
  success: boolean;
  expiresIn: number;
  message: string;
}

export interface OtpVerifyRequest {
  phoneNumber: string;
  code: string;
}

export interface OtpVerifyResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface UserProfileUpdateRequest {
  fullName?: string;
  email?: string;
}

export interface UserOrderSummary {
  orderNumber: string;
  createdAt: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusLabel: string;
  finalTotal: number;
  itemCount: number;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  trackingCode?: string;
}

// -------------------------------------------------------------
// Order Tracking Subsystem Contracts (FastAPI-Ready)
// -------------------------------------------------------------

export type OrderStatus =
  | 'pending'
  | 'registered'
  | 'processing'
  | 'shipped'
  | 'handed_over'
  | 'delivered'
  | 'canceled'
  | 'returned';

export type ShippingCarrierId = 'post' | 'tipax' | 'courier';

export interface CarrierInquiryCheckpoint {
  title: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface CarrierInquiryResult {
  barcode: string;
  carrierName: string;
  status: string;
  lastUpdate: string;
  destination: string;
  checkpoints: CarrierInquiryCheckpoint[];
}

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface TrackOrderResponse {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  statusLabel: string;
  recipientName: string;
  recipientPhone?: string;
  shippingAddress: string;
  trackingCode: string;
  carrier: string;
  estimatedDelivery: string;
  timeline: TrackingEvent[];
  items: {
    title: string;
    size: string;
    color?: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  postalCode?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface TrackOrderRequest {
  query: string;
}

// -------------------------------------------------------------
// Live Search Autocomplete Contracts (FastAPI-Ready)
// -------------------------------------------------------------

export interface SearchSuggestionItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  primary_image: string;
  division: ProductDivision;
  category: ProductCategory | string;
  season: ProductSeason;
  line?: 'move' | 'calm';
  inStock: boolean;
}

export interface SearchCategorySuggestion {
  name: string;
  slug: string;
  count: number;
}

export interface SearchSuggestionsResponse {
  query: string;
  products: SearchSuggestionItem[];
  categories: SearchCategorySuggestion[];
  totalMatches: number;
}

// -------------------------------------------------------------
// Shaparak IPG Payment Gateway Contracts (FastAPI-Ready)
// -------------------------------------------------------------

export interface PaymentInitiateRequest {
  orderNumber: string;
  amount: number;
  callbackUrl: string;
}

export interface PaymentInitiateResponse {
  paymentToken: string;
  gatewayUrl: string;
}

export interface PaymentVerifyRequest {
  paymentToken: string;
  cardNumber?: string;
  action: 'success' | 'fail' | 'cancel';
}

export interface PaymentVerifyResponse {
  success: boolean;
  orderNumber: string;
  transactionId?: string;
  referenceId?: string;
  paidAt?: string;
  errorMessage?: string;
}

export interface PaymentSessionInfo {
  token: string;
  orderNumber: string;
  amount: number;
  merchantName: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'settled' | 'failed' | 'cancelled';
}

// -------------------------------------------------------------
// Journal & Editorial Article Contracts
// -------------------------------------------------------------

export type ArticleCategory = 'style-guide' | 'fabric-care' | 'drop-story';

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface LinkedGarment {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string;
  badge?: string;
}

export interface ArticleSection {
  heading?: string;
  content: string;
  pullQuote?: string;
  image?: string;
  imageCaption?: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  slug: string;
  category: ArticleCategory;
  categoryLabel: string;
  readTime: string;
  date: string;
  author: ArticleAuthor;
  coverImage: string;
  excerpt: string;
  featured?: boolean;
  status: 'published' | 'draft';
  sections: ArticleSection[];
  linkedProductSlugs?: string[];
  linkedProducts?: LinkedGarment[];
}

// -------------------------------------------------------------
// Store Settings & Site Configuration Contracts
// -------------------------------------------------------------

export interface SiteBrandingSettings {
  brandNameFa: string;
  brandNameEn: string;
  tagline: string;
  subTagline: string;
  logoUrl: string;
  faviconUrl: string;
  metaDescription: string;
}

export interface SiteContactSettings {
  supportPhone: string;
  supportPhoneRaw: string;
  inquiryMobile: string;
  whatsappNumber: string;
  officialEmail: string;
  atelierAddress: string;
  workingHours: string;
}

export interface SiteShippingSettings {
  freeShippingThreshold: number; // به تومان
  flatShippingFee: number; // به تومان
  estimatedDispatchText: string;
  announcementBarText: string;
  announcementBarHighlight: string;
  announcementBarVisible: boolean;
}

export interface SiteCheckoutRules {
  minCartTotal: number; // به تومان
  maxItemQuantityPerCart: number;
  reservationTimeoutMinutes: number;
  returnPolicyDays: number;
  holidayModeEnabled: boolean;
  holidayNoticeText: string;
}

export interface SiteSocialSettings {
  instagram: string;
  telegram: string;
  pinterest: string;
  youtube: string;
}

export interface SiteIntegrationsSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  enamadCode: string;
  samandehiCode: string;
  smsProviderSender: string;
  smsProviderBalance: number;
}

export interface SiteSettings {
  branding: SiteBrandingSettings;
  contact: SiteContactSettings;
  shipping: SiteShippingSettings;
  checkoutRules: SiteCheckoutRules;
  social: SiteSocialSettings;
  integrations: SiteIntegrationsSettings;
  updatedAt?: string;
}

// ============================================================================
// Taxonomy & Attributes Hub Contracts
// ============================================================================
export interface CustomColor {
  id: string;
  name: string;
  hex: string;
  slug: string;
  isSystemDefault?: boolean;
}

export interface CustomSize {
  id: string;
  name: string;
  group: 'alpha' | 'numeric' | 'accessory' | 'free';
  order: number;
  isSystemDefault?: boolean;
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  slug: string;
  division: 'apparel' | 'accessories';
  iconName?: string;
  isActive: boolean;
}

export interface TaxonomyBrand {
  id: string;
  name: string;
  slug: string;
  logoSvg?: string;
  isFeatured: boolean;
}

export interface TaxonomySeason {
  id: string;
  name: string;
  slug: string;
  isCurrentDrop: boolean;
  isActive: boolean;
}

export interface StoreTaxonomy {
  colors: CustomColor[];
  sizes: CustomSize[];
  categories: TaxonomyCategory[];
  brands: TaxonomyBrand[];
  seasons: TaxonomySeason[];
}

export type TaxonomyDomain = 'colors' | 'sizes' | 'categories' | 'brands' | 'seasons';


