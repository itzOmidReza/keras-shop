import type { ProductDivision, ProductCategory, ProductSeason } from '~/types/domain'

export interface FilterState {
  season: ProductSeason | null
  division: ProductDivision | null
  categories: ProductCategory[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  line?: 'move' | 'calm' | null
  brand?: string | null
}

export interface SeasonOption {
  id: ProductSeason
  label: string
  badge?: string
}

export interface BrandOption {
  slug: string
  fa: string
  en: string
}

export interface DivisionOption {
  id: ProductDivision
  label: string
  count: number
}

export interface CategoryOption {
  slug: ProductCategory
  label: string
}

export interface ColorOption {
  name: string
  bgClass: string
  checkClass: string
}

export const AVAILABLE_SEASONS: SeasonOption[] = [
  { id: 'fall-1405', label: 'پاییز ۱۴۰۵', badge: 'جدید' },
  { id: 'winter-1405', label: 'زمستان ۱۴۰۵' },
  { id: 'spring-1406', label: 'بهار ۱۴۰۶', badge: 'پیش‌نمایش' },
  { id: 'summer-1405', label: 'تابستان ۱۴۰۵', badge: 'آرشیو' },
]

export const PARTNER_BRANDS: BrandOption[] = [
  { slug: 'keras-atelier', fa: 'کراس آتلیه', en: 'Keras Atelier' },
  { slug: 'toteme', fa: 'توتِم', en: 'Totême' },
  { slug: 'massimo-dutti', fa: 'ماسیمو دوتی', en: 'Massimo Dutti' },
  { slug: 'cos', fa: 'کاس', en: 'COS' },
  { slug: 'zara', fa: 'زارا', en: 'Zara' },
  { slug: 'mango', fa: 'منگو', en: 'Mango' },
]

export const AVAILABLE_DIVISIONS: DivisionOption[] = [
  { id: 'apparel', label: 'پوشاک', count: 16 },
  { id: 'accessories', label: 'اکسسوری', count: 8 },
]

export const APPAREL_CATEGORIES: CategoryOption[] = [
  { slug: 'shirts-blouses', label: 'پیراهن و شومیز' },
  { slug: 'knitwear', label: 'بافت و پلیور' },
  { slug: 'coats-jackets', label: 'پالتو و کاپشن' },
  { slug: 'pants', label: 'شلوار' },
  { slug: 'tops', label: 'تیشرت و تاپ' },
]

export const ACCESSORY_CATEGORIES: CategoryOption[] = [
  { slug: 'hair-accessories', label: 'اکسسوری مو (اسکرانچی و گیره)' },
  { slug: 'bandanas', label: 'دستمال سر' },
  { slug: 'scarves', label: 'اسکارف و شال' },
]

export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Free Size']

export const AVAILABLE_COLORS: ColorOption[] = [
  { name: 'مشکی موکا', bgClass: 'bg-ink', checkClass: 'text-white' },
  { name: 'سبز مریم‌گلی', bgClass: 'bg-sage', checkClass: 'text-ink' },
  { name: 'خاک رس', bgClass: 'bg-clay', checkClass: 'text-white' },
  { name: 'رز کراس', bgClass: 'bg-rose', checkClass: 'text-white' },
  { name: 'شنی نچرال', bgClass: 'bg-sand', checkClass: 'text-ink' },
  { name: 'عاجی روشن', bgClass: 'bg-paper border border-sand/80', checkClass: 'text-ink' },
]

export function getCategoryLabel(slug: string): string {
  const all = [...APPAREL_CATEGORIES, ...ACCESSORY_CATEGORIES]
  const found = all.find(c => c.slug === slug)
  return found ? found.label : slug
}

export function getSeasonLabel(season: ProductSeason): string {
  const found = AVAILABLE_SEASONS.find(s => s.id === season)
  return found ? found.label : season
}

export function getBrandLabel(brandSlug: string): string {
  const found = PARTNER_BRANDS.find(b => b.slug === brandSlug)
  return found ? found.fa : brandSlug
}

export function countActiveFilters(
  state: FilterState,
  minPrice: number,
  maxPrice: number,
): number {
  let count = 0
  if (state.season) count++
  if (state.division) count++
  if (state.brand) count++
  count += state.categories.length
  count += state.sizes.length
  count += state.colors.length
  if (state.priceRange[0] > minPrice || state.priceRange[1] < maxPrice) {
    count++
  }
  return count
}
