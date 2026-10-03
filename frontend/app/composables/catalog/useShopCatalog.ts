import type { ProductFilters, ProductSeason, ProductDivision, ProductCategory } from '~/types/domain'
import type { FilterState } from '~/composables/catalog/useCatalogFilters'

export const DEFAULT_MIN_PRICE = 300000
export const DEFAULT_MAX_PRICE = 5500000
export const ITEMS_PER_PAGE = 12

export const BRAND_LABELS: Record<string, string> = {
  'keras-atelier': 'کراس آتلیه (Keras Atelier)',
  'toteme': 'توتِم (Totême)',
  'massimo-dutti': 'ماسیمو دوتی (Massimo Dutti)',
  'cos': 'کاس (COS)',
  'zara': 'زارا (Zara)',
  'mango': 'منگو (Mango)',
}

export function isFiltersEqual(a: FilterState, b: FilterState): boolean {
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

export async function useShopCatalog() {
  const route = useRoute()
  const router = useRouter()
  const { getProducts } = useProducts()

  const parseFiltersFromQuery = (): FilterState => {
    const q = route.query
    const season = q.season && typeof q.season === 'string' ? (q.season as ProductSeason) : null
    const division = q.division && typeof q.division === 'string' ? (q.division as ProductDivision) : null
    const line = q.line === 'move' || q.line === 'calm' ? q.line : null
    const brand = q.brand && typeof q.brand === 'string' ? q.brand : null
    const categories = q.category
      ? (String(q.category).split(',').filter(Boolean) as ProductCategory[])
      : []
    const sizes = q.size ? String(q.size).split(',').filter(Boolean) : []
    const colors = q.color ? String(q.color).split(',').filter(Boolean) : []
    const min = q.min_price ? Number(q.min_price) : DEFAULT_MIN_PRICE
    const max = q.max_price ? Number(q.max_price) : DEFAULT_MAX_PRICE

    return {
      season,
      division,
      line,
      brand,
      categories,
      sizes,
      colors,
      priceRange: [
        !isNaN(min) && min >= DEFAULT_MIN_PRICE ? min : DEFAULT_MIN_PRICE,
        !isNaN(max) && max <= DEFAULT_MAX_PRICE ? max : DEFAULT_MAX_PRICE,
      ],
    }
  }

  const parsePageFromQuery = (): number => {
    const p = parseInt(String(route.query.page || '1'), 10)
    return isNaN(p) || p < 1 ? 1 : p
  }

  const filters = ref<FilterState>(parseFiltersFromQuery())
  const sort = ref<string>(
    typeof route.query.sort === 'string' ? route.query.sort : 'bestseller',
  )
  const currentPage = ref<number>(parsePageFromQuery())
  const isMobileFilterOpen = ref(false)

  const apiFilters = computed<ProductFilters>(() => {
    const params: ProductFilters = {
      sort: (sort.value as ProductFilters['sort']) || 'bestseller',
    }
    if (route.query.q && typeof route.query.q === 'string' && route.query.q.trim()) {
      params.q = route.query.q.trim()
    }
    if (filters.value.season) params.season = filters.value.season
    if (filters.value.division) params.division = filters.value.division
    if (filters.value.line) params.line = filters.value.line
    if (route.query.badge && typeof route.query.badge === 'string') {
      params.badge = route.query.badge
    }
    if (filters.value.brand) {
      params.brand = filters.value.brand
    } else if (route.query.brand && typeof route.query.brand === 'string') {
      params.brand = route.query.brand
    }
    if (filters.value.categories.length > 0) params.category = filters.value.categories.join(',')
    if (filters.value.sizes.length > 0) params.size = filters.value.sizes.join(',')
    if (filters.value.colors.length > 0) params.color = filters.value.colors.join(',')
    if (filters.value.priceRange[0] > DEFAULT_MIN_PRICE) params.min_price = filters.value.priceRange[0]
    if (filters.value.priceRange[1] < DEFAULT_MAX_PRICE) params.max_price = filters.value.priceRange[1]

    return params
  })

  const activeFilterCount = computed(() => {
    let count = 0
    if (route.query.q) count++
    if (route.query.badge) count++
    if (filters.value.brand || route.query.brand) count++
    if (filters.value.season) count++
    if (filters.value.division) count++
    if (filters.value.line) count++
    count += filters.value.categories.length
    count += filters.value.sizes.length
    count += filters.value.colors.length
    if (
      filters.value.priceRange[0] > DEFAULT_MIN_PRICE ||
      filters.value.priceRange[1] < DEFAULT_MAX_PRICE
    ) {
      count++
    }
    return count
  })

  const syncToUrl = () => {
    const nextQuery: Record<string, string> = {}

    if (route.query.q && typeof route.query.q === 'string' && route.query.q.trim()) {
      nextQuery.q = route.query.q.trim()
    }
    if (route.query.badge && typeof route.query.badge === 'string') {
      nextQuery.badge = route.query.badge
    }
    if (filters.value.brand) {
      nextQuery.brand = filters.value.brand
    } else if (route.query.brand && typeof route.query.brand === 'string') {
      nextQuery.brand = route.query.brand
    }
    if (filters.value.season) nextQuery.season = filters.value.season
    if (filters.value.division) nextQuery.division = filters.value.division
    if (filters.value.line) nextQuery.line = filters.value.line
    if (filters.value.categories.length > 0) nextQuery.category = filters.value.categories.join(',')
    if (filters.value.sizes.length > 0) nextQuery.size = filters.value.sizes.join(',')
    if (filters.value.colors.length > 0) nextQuery.color = filters.value.colors.join(',')
    if (filters.value.priceRange[0] > DEFAULT_MIN_PRICE) nextQuery.min_price = String(filters.value.priceRange[0])
    if (filters.value.priceRange[1] < DEFAULT_MAX_PRICE) nextQuery.max_price = String(filters.value.priceRange[1])
    if (sort.value && sort.value !== 'bestseller') nextQuery.sort = sort.value

    currentPage.value = 1

    const currentQuery = route.query
    const isSame =
      Object.keys(nextQuery).length === Object.keys(currentQuery).length &&
      Object.entries(nextQuery).every(([k, v]) => currentQuery[k] === v)

    if (!isSame) {
      router.replace({ query: nextQuery })
    }
  }

  watch([filters, sort], () => {
    syncToUrl()
  }, { deep: true })

  watch(
    () => route.query,
    () => {
      const parsed = parseFiltersFromQuery()
      if (!isFiltersEqual(filters.value, parsed)) {
        filters.value = parsed
      }
      if (typeof route.query.sort === 'string') {
        sort.value = route.query.sort
      } else {
        sort.value = 'bestseller'
      }
      currentPage.value = parsePageFromQuery()
    },
    { deep: true },
  )

  const { data: rawProducts, pending } = await useAsyncData(
    'catalog-products',
    () => getProducts(apiFilters.value),
    {
      watch: [apiFilters],
    },
  )

  const products = computed(() => rawProducts.value || [])
  const totalItems = computed(() => products.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / ITEMS_PER_PAGE)))

  watch(
    [() => route.query.page, totalPages],
    () => {
      const p = parsePageFromQuery()
      currentPage.value = Math.min(Math.max(1, p), totalPages.value)
    },
    { immediate: true },
  )

  const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
  const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value))

  const paginatedProducts = computed(() => {
    return products.value.slice(startIndex.value, endIndex.value)
  })

  const changePage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages.value || pageNumber === currentPage.value) return
    currentPage.value = pageNumber
    const nextQuery = { ...route.query }
    if (pageNumber > 1) {
      nextQuery.page = String(pageNumber)
    } else {
      delete nextQuery.page
    }
    router.replace({ query: nextQuery })
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const paginationPages = computed<(number | 'ellipsis')[]>(() => {
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages: (number | 'ellipsis')[] = []
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', total)
    } else if (current >= total - 2) {
      pages.push(1, 'ellipsis', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total)
    }
    return pages
  })

  const clearSearch = () => {
    currentPage.value = 1
    const next = { ...route.query }
    delete next.q
    delete next.page
    router.replace({ query: next })
  }

  const clearBadge = () => {
    currentPage.value = 1
    const next = { ...route.query }
    delete next.badge
    delete next.page
    router.replace({ query: next })
  }

  const clearBrand = () => {
    currentPage.value = 1
    filters.value.brand = null
    const next = { ...route.query }
    delete next.brand
    delete next.page
    router.replace({ query: next })
  }

  const resetFilters = () => {
    filters.value = {
      season: null,
      division: null,
      line: null,
      brand: null,
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    }
    sort.value = 'bestseller'
    currentPage.value = 1
    isMobileFilterOpen.value = false
    const next: Record<string, string> = {}
    router.replace({ query: next })
  }

  return {
    filters,
    sort,
    currentPage,
    isMobileFilterOpen,
    pending,
    products,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    paginatedProducts,
    activeFilterCount,
    paginationPages,
    changePage,
    clearSearch,
    clearBadge,
    clearBrand,
    resetFilters,
  }
}
