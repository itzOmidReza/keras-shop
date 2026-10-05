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
}

export type ProductListItem = Product;

export interface ProductDetail extends Product {
  category_info?: { id: number; title: string; slug: string };
  activities?: ActivityType[];
  size_chart?: SizeChart;
  fit_note?: string;
  variants: Variant[];
}

export type FitFeedback = 'small' | 'true_to_size' | 'large';

export interface Review {
  id: number;
  author: string;
  rating: number;
  created_at: string;
  comment: string;
  verified_purchase: boolean;
  size_purchased?: string;
  fit_feedback: FitFeedback;
}

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
  reviews: Review[];
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

export type OrderStatus = 'registered' | 'processing' | 'handed_over' | 'delivered' | 'canceled';

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


