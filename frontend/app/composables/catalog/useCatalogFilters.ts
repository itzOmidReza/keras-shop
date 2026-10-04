import type { ProductDivision, ProductCategory, ProductSeason } from '~/types/domain'
import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

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

export function cloneFilterState(state: FilterState): FilterState {
  return {
    season: state.season,
    division: state.division,
    line: state.line,
    brand: state.brand,
    categories: [...state.categories],
    sizes: [...state.sizes],
    colors: [...state.colors],
    priceRange: [state.priceRange[0], state.priceRange[1]],
  }
}

export function areFiltersEqual(a: FilterState, b: FilterState): boolean {
  if (a.season !== b.season) return false
  if (a.division !== b.division) return false
  if (a.line !== b.line) return false
  if (a.brand !== b.brand) return false
  if (a.categories.length !== b.categories.length) return false
  if (!a.categories.every((c, i) => c === b.categories[i])) return false
  if (a.sizes.length !== b.sizes.length) return false
  if (!a.sizes.every((s, i) => s === b.sizes[i])) return false
  if (a.colors.length !== b.colors.length) return false
  if (!a.colors.every((c, i) => c === b.colors[i])) return false
  if (a.priceRange[0] !== b.priceRange[0] || a.priceRange[1] !== b.priceRange[1]) return false
  return true
}

export interface UseCatalogFiltersOptions {
  modelValue: Ref<FilterState>
  minPrice?: number
  maxPrice?: number
  onApply?: (filters: FilterState) => void
  onReset?: () => void
}

export function useCatalogFilters(options: UseCatalogFiltersOptions) {
  const {
    modelValue,
    minPrice = 300000,
    maxPrice = 5500000,
    onApply,
    onReset,
  } = options

  // حالت پیش‌نویس موقت فیلترها قبل از اعمال قطعی
  const draftFilters = ref<FilterState>(cloneFilterState(modelValue.value))

  // همگام‌سازی پیش‌نویس با تغییرات خارجی (مانند تغییر URL، یا پاک کردن فیلترها از بیرون)
  watch(
    modelValue,
    (newVal) => {
      if (!areFiltersEqual(draftFilters.value, newVal)) {
        draftFilters.value = cloneFilterState(newVal)
      }
    },
    { deep: true },
  )

  // تعداد فیلترهای فعال در حالت پیش‌نویس
  const draftActiveCount = computed(() =>
    countActiveFilters(draftFilters.value, minPrice, maxPrice),
  )

  // بررسی وجود تغییرات اعمال‌نشده بین پیش‌نویس و حالت فعال فعلی
  const hasUnappliedChanges = computed(() =>
    !areFiltersEqual(draftFilters.value, modelValue.value),
  )

  // ویرایشگرهای فیلدها در پیش‌نویس
  const setSeason = (val: ProductSeason | null) => {
    draftFilters.value.season = val
  }

  const setDivision = (val: ProductDivision | null) => {
    draftFilters.value.division = val
  }

  const setBrand = (val: string | null) => {
    draftFilters.value.brand = val
  }

  const setCategories = (val: ProductCategory[]) => {
    draftFilters.value.categories = [...val]
  }

  const setSizes = (val: string[]) => {
    draftFilters.value.sizes = [...val]
  }

  const setColors = (val: string[]) => {
    draftFilters.value.colors = [...val]
  }

  const setPriceRange = (val: [number, number]) => {
    draftFilters.value.priceRange = [val[0], val[1]]
  }

  // متدهای حذف آیتم‌های تکی در پیش‌نویس
  const removeSeason = () => {
    draftFilters.value.season = null
  }

  const removeDivision = () => {
    draftFilters.value.division = null
  }

  const removeBrand = () => {
    draftFilters.value.brand = null
  }

  const removeCategory = (slug: ProductCategory) => {
    draftFilters.value.categories = draftFilters.value.categories.filter(c => c !== slug)
  }

  const removeSize = (size: string) => {
    draftFilters.value.sizes = draftFilters.value.sizes.filter(s => s !== size)
  }

  const removeColor = (color: string) => {
    draftFilters.value.colors = draftFilters.value.colors.filter(c => c !== color)
  }

  const resetPrice = () => {
    draftFilters.value.priceRange = [minPrice, maxPrice]
  }

  // اعمال پیش‌نویس فیلترها (Commit Draft to Active)
  const applyFilters = () => {
    const committed = cloneFilterState(draftFilters.value)

    if (onApply) {
      onApply(committed)
    }

    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const count = draftActiveCount.value
    if (count > 0) {
      toast.success(`${toFa(count)} فیلتر با موفقیت اعمال شد`)
    } else {
      toast.info('تمامی فیلترها پاک شدند')
    }
  }

  // بازنشانی کامل (Reset All)
  const resetAllFilters = () => {
    const emptyState: FilterState = {
      season: null,
      division: null,
      line: null,
      brand: null,
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [minPrice, maxPrice],
    }
    draftFilters.value = cloneFilterState(emptyState)

    if (onReset) {
      onReset()
    } else if (onApply) {
      onApply(emptyState)
    }

    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    toast.info('تمامی فیلترها بازنشانی شدند')
  }

  return {
    draftFilters,
    draftActiveCount,
    hasUnappliedChanges,
    setSeason,
    setDivision,
    setBrand,
    setCategories,
    setSizes,
    setColors,
    setPriceRange,
    removeSeason,
    removeDivision,
    removeBrand,
    removeCategory,
    removeSize,
    removeColor,
    resetPrice,
    applyFilters,
    resetAllFilters,
  }
}
