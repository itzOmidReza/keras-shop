// app/types/domain.ts
export type ActivityType = 'yoga' | 'running' | 'gym' | 'daily' | 'pilates';

export interface Variant {
  id: number;
  sku: string;
  color: string;
  color_hex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';
  price_override?: number; // به تومان
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
