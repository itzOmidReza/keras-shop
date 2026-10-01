// app/types/domain.ts
export type ActivityType = 'yoga' | 'running' | 'gym' | 'daily' | 'pilates';

export interface Variant {
  id: number;
  sku: string;
  color: string;
  color_hex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';
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

export interface ProductListItem {
  id: number;
  slug: string;
  title: string;
  line: 'move' | 'calm';
  base_price: number; // به تومان
  compare_at_price?: number; // به تومان (قیمت قبل از تخفیف)
  images: ProductImage[];
  colors: { name: string; hex: string }[];
  rating_avg: number;
  rating_count: number;
  is_active: boolean;
  has_transparency_test: boolean;
  stretch: number;
  opacity: number;
  available_sizes: string[];
}

export interface ProductDetail extends ProductListItem {
  description: string;
  category: { id: number; title: string; slug: string };
  fabric_composition: string;
  fabric_gsm?: number;
  softness: number;
  activities: ActivityType[];
  size_chart: SizeChart;
  fit_note: string;
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
  line?: 'move' | 'calm';
  category?: string;
  size?: string;
  color?: string;
  sort?: 'bestseller' | 'newest' | 'price_asc' | 'price_desc';
  min_price?: number;
  max_price?: number;
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

