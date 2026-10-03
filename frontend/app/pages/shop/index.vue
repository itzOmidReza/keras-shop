<!-- frontend/app/pages/shop/index.vue -->
<script setup lang="ts">
import {
  SlidersHorizontal,
  Sparkles,
  X,
} from '@lucide/vue'
import type { ProductFilters, ProductSeason, ProductDivision, ProductCategory } from '~/types/domain'
import type { FilterState } from '~/components/catalog/FilterPanel.vue'

useSeoMeta({
  title: 'کاتالوگ و فروشگاه چهارفصل پوشاک و اکسسوری | کراس',
  description: 'مجموعه پوشاک ادیتوریال، بافت، پالتو، شومیز و اکسسوری‌های دست‌ساز چهارفصل کراس.',
})

const route = useRoute()
const router = useRouter()
const { getProducts } = useProducts()

const DEFAULT_MIN_PRICE = 300000
const DEFAULT_MAX_PRICE = 5500000

// تجزیه پارامترهای URL به استیت فیلترها
const parseFiltersFromQuery = (): FilterState => {
  const q = route.query
  const season = q.season && typeof q.season === 'string' ? (q.season as ProductSeason) : null
  const division = q.division && typeof q.division === 'string' ? (q.division as ProductDivision) : null
  const line = q.line === 'move' || q.line === 'calm' ? q.line : null
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
    categories,
    sizes,
    colors,
    priceRange: [
      !isNaN(min) && min >= DEFAULT_MIN_PRICE ? min : DEFAULT_MIN_PRICE,
      !isNaN(max) && max <= DEFAULT_MAX_PRICE ? max : DEFAULT_MAX_PRICE,
    ],
  }
}

const filters = ref<FilterState>(parseFiltersFromQuery())
const sort = ref<string>(
  typeof route.query.sort === 'string' ? route.query.sort : 'bestseller',
)
const isMobileFilterOpen = ref(false)

// تبدیل فیلترها به پارامترهای درخواست API
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
  if (route.query.brand && typeof route.query.brand === 'string') {
    params.brand = route.query.brand
  }
  if (filters.value.categories.length > 0) params.category = filters.value.categories.join(',')
  if (filters.value.sizes.length > 0) params.size = filters.value.sizes.join(',')
  if (filters.value.colors.length > 0) params.color = filters.value.colors.join(',')
  if (filters.value.priceRange[0] > DEFAULT_MIN_PRICE) params.min_price = filters.value.priceRange[0]
  if (filters.value.priceRange[1] < DEFAULT_MAX_PRICE) params.max_price = filters.value.priceRange[1]

  return params
})

// تعداد فیلترهای فعال برای بج دکمه موبایل
const activeFilterCount = computed(() => {
  let count = 0
  if (route.query.q) count++
  if (route.query.badge) count++
  if (route.query.brand) count++
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

// همگام‌سازی تغییرات فیلتر با کوئری‌های URL
const syncToUrl = () => {
  const nextQuery: Record<string, string> = {}

  if (route.query.q && typeof route.query.q === 'string' && route.query.q.trim()) {
    nextQuery.q = route.query.q.trim()
  }
  if (route.query.badge && typeof route.query.badge === 'string') {
    nextQuery.badge = route.query.badge
  }
  if (route.query.brand && typeof route.query.brand === 'string') {
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
    filters.value = parseFiltersFromQuery()
    if (typeof route.query.sort === 'string') {
      sort.value = route.query.sort
    } else {
      sort.value = 'bestseller'
    }
  },
  { deep: true },
)

// واکشی داده‌ها از نیترو با ری‌اکتیویتی خودکار
const { data: products, pending } = await useAsyncData(
  'catalog-products',
  () => getProducts(apiFilters.value),
  {
    watch: [apiFilters],
  },
)

const clearSearch = () => {
  const next = { ...route.query }
  delete next.q
  router.replace({ query: next })
}

const clearBadge = () => {
  const next = { ...route.query }
  delete next.badge
  router.replace({ query: next })
}

const brandLabels: Record<string, string> = {
  'keras-atelier': 'کراس آتلیه (Keras Atelier)',
  'toteme': 'توتِم (Totême)',
  'massimo-dutti': 'ماسیمو دوتی (Massimo Dutti)',
  'cos': 'کاس (COS)',
  'zara': 'زارا (Zara)',
  'mango': 'منگو (Mango)',
}

const clearBrand = () => {
  const next = { ...route.query }
  delete next.brand
  router.replace({ query: next })
}

const resetFilters = () => {
  filters.value = {
    season: null,
    division: null,
    line: null,
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
  }
  sort.value = 'bestseller'
  isMobileFilterOpen.value = false
  const next: Record<string, string> = {}
  router.replace({ query: next })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- هدر کاتالوگ و معرفی مجموعه -->
    <header class="mb-8 border-b border-sand pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-bold uppercase tracking-wider text-rose flex items-center gap-1">
            <Sparkles class="w-3.5 h-3.5" />
            کالکشن چهارفصل کراس (Keras Four-Season)
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          فروشگاه پوشاک و اکسسوری لایف‌استایل
        </h1>
        <p class="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
          طراحی‌شده برای چهارفصل سال با الیاف طبیعی لینن، بافت کشمیر و پشم مرینوس، و اکسسوری‌های دست‌ساز.
        </p>

        <!-- بج جست‌وجوی فعال با امکان حذف -->
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <div v-if="route.query.q" class="inline-flex items-center gap-2 rounded-xl bg-sand/60 px-3 py-1.5 text-xs text-ink">
            <span>نتایج جست‌وجو برای: <strong class="text-rose font-bold">«{{ route.query.q }}»</strong></span>
            <button
              type="button"
              class="text-muted-foreground hover:text-rose cursor-pointer"
              aria-label="حذف جست‌وجو"
              @click="clearSearch"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <div v-if="route.query.badge" class="inline-flex items-center gap-2 rounded-xl bg-rose/10 px-3 py-1.5 text-xs text-rose font-bold">
            <span>فیلتر: <strong>{{ route.query.badge === 'sale' ? 'حراج فصل' : route.query.badge }}</strong></span>
            <button
              type="button"
              class="text-rose hover:text-ink cursor-pointer"
              aria-label="حذف فیلتر نشان"
              @click="clearBadge"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <div v-if="route.query.brand" class="inline-flex items-center gap-2 rounded-xl bg-sand/80 border border-sand px-3 py-1.5 text-xs text-ink font-medium">
            <span>برند: <strong>{{ brandLabels[String(route.query.brand)] || route.query.brand }}</strong></span>
            <button
              type="button"
              class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
              aria-label="حذف فیلتر برند"
              @click="clearBrand"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div class="text-xs text-muted-foreground font-medium">
        <span>نمایش </span>
        <span class="font-bold text-ink">{{ products?.length || 0 }}</span>
        <span> کالا در کاتالوگ کراس</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- سایدبار فیلترها (دسکتاپ استیکی) -->
      <aside class="hidden lg:block lg:col-span-3 rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs sticky top-24">
        <FilterPanel
          v-model="filters"
          :min-price="DEFAULT_MIN_PRICE"
          :max-price="DEFAULT_MAX_PRICE"
          @reset="resetFilters"
        />
      </aside>

      <!-- ستون محصولات -->
      <main class="lg:col-span-9 space-y-6">
        <!-- نوار کنترل بالای محصولات (مرتب‌سازی و دکمه موبایل) -->
        <div class="flex items-center justify-between border-b border-sand/70 pb-4">
          <!-- دکمه فیلتر در موبایل -->
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              class="lg:hidden h-10 px-3.5 gap-2 text-xs font-bold rounded-xl border-sand text-ink hover:bg-sand/30 cursor-pointer shadow-2xs"
              @click="isMobileFilterOpen = true"
            >
              <SlidersHorizontal class="w-4 h-4 text-rose" />
              <span>فیلترها</span>
              <span
                v-if="activeFilterCount > 0"
                class="rounded-full bg-rose text-white text-[10px] px-1.5 py-0.2 font-bold"
              >
                {{ activeFilterCount }}
              </span>
            </Button>

            <span class="text-xs text-muted-foreground hidden sm:inline-block">
              نمایش {{ products?.length || 0 }} محصول
            </span>
          </div>

          <!-- دراپ‌داون مرتب‌سازی ادیتوریال -->
          <SortSelect v-model="sort" />
        </div>

        <!-- لودینگ اسکلتون (هنگام تغییر فیلتر و بارگذاری بدون پرش چیدمان) -->
        <div
          v-if="pending"
          class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <CatalogSkeleton v-for="i in 6" :key="i" />
        </div>

        <!-- گرید محصولات کاتالوگ -->
        <div
          v-else-if="products && products.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <ProductCard
            v-for="(product, idx) in products"
            :key="product.id"
            :product="product"
            :priority="idx < 3"
          />
        </div>

        <!-- وضعیت عدم تطابق فیلترها (Empty State) -->
        <CatalogEmptyState
          v-else
          @reset="resetFilters"
        />
      </main>
    </div>

    <!-- دراور کشویی فیلترها در موبایل -->
    <Sheet :open="isMobileFilterOpen" @update:open="(val: boolean) => isMobileFilterOpen = val">
      <SheetContent
        side="start"
        class="w-full sm:max-w-md p-6 bg-paper border-sand overflow-y-auto flex flex-col justify-between"
      >
        <div class="space-y-6">
          <SheetHeader class="text-start pb-2 border-b border-sand">
            <SheetTitle class="text-base font-bold text-ink flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-rose" />
              <span>فیلترهای کاتالوگ</span>
            </SheetTitle>
            <SheetDescription class="sr-only">
              پنل فیلتر کاتالوگ پوشاک و اکسسوری کراس
            </SheetDescription>
          </SheetHeader>

          <FilterPanel
            v-model="filters"
            :min-price="DEFAULT_MIN_PRICE"
            :max-price="DEFAULT_MAX_PRICE"
            @reset="resetFilters"
          />
        </div>

        <div class="pt-6 border-t border-sand sticky bottom-0 bg-paper py-3 mt-4">
          <Button
            class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs cursor-pointer"
            @click="isMobileFilterOpen = false"
          >
            مشاهده نتایج ({{ products?.length || 0 }} محصول)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
