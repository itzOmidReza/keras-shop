<!-- frontend/app/pages/shop/index.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import type { FilterState } from '~/components/catalog/FilterPanel.vue'

useSeoMeta({
  title: 'فروشگاه و کاتالوگ محصولات | کراس',
  description: 'مجموعه پوشاک ورزشی و روزمره زنانه کراس - لاین‌های حرکت (Move) و آرامش (Calm).',
})

const route = useRoute()
const { getProducts } = useProducts()

const initialLine = typeof route.query.line === 'string' ? [route.query.line.toLowerCase()] : []

const filters = ref<FilterState>({
  lines: initialLine,
  categories: [],
  priceRange: [500000, 3500000],
})

const sort = ref('bestseller')

const { data: allProducts, pending: loading } = await useAsyncData(
  'shop-products',
  () => getProducts(),
)

const filteredProducts = computed(() => {
  let list: ProductListItem[] = allProducts.value ? [...allProducts.value] : []

  // فیلتر لاین
  if (filters.value.lines.length > 0) {
    const selectedLines = filters.value.lines.map((l) => l.toLowerCase())
    list = list.filter((p) => selectedLines.includes(p.line))
  }

  // فیلتر محدوده قیمت
  const [minPrice, maxPrice] = filters.value.priceRange
  list = list.filter((p) => p.base_price >= minPrice && p.base_price <= maxPrice)

  // مرتب‌سازی
  if (sort.value === 'price_asc') {
    list.sort((a, b) => a.base_price - b.base_price)
  } else if (sort.value === 'price_desc') {
    list.sort((a, b) => b.base_price - a.base_price)
  } else if (sort.value === 'newest') {
    list.sort((a, b) => b.id - a.id)
  } else {
    // bestseller
    list.sort((a, b) => b.rating_count - a.rating_count)
  }

  return list
})

const resetFilters = () => {
  filters.value = {
    lines: [],
    categories: [],
    priceRange: [500000, 3500000],
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- هدر کاتالوگ -->
    <header class="mb-8 border-b border-sand pb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        کاتالوگ محصولات کراس
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        طراحی‌شده برای تعادل میان عملکرد ورزشی و راحتی روزمره
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <!-- سایدبار فیلترها (دسکتاپ) -->
      <aside class="lg:col-span-1 rounded-2xl border border-sand bg-white/60 p-5 shadow-2xs">
        <FilterPanel
          v-model="filters"
          :min-price="500000"
          :max-price="3500000"
          @reset="resetFilters"
        />
      </aside>

      <!-- ستون محصولات -->
      <main class="lg:col-span-3 space-y-6">
        <!-- نوار کنترل بالای محصولات -->
        <div class="flex items-center justify-between border-b border-sand pb-4">
          <span class="text-xs font-medium text-muted-foreground">
            نمایش {{ filteredProducts.length }} محصول
          </span>

          <SortSelect v-model="sort" />
        </div>

        <!-- لودینگ -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div v-for="i in 6" :key="i" class="aspect-4/5 rounded-2xl bg-sand/40 animate-pulse" />
        </div>

        <!-- گرید محصولات -->
        <div
          v-else-if="filteredProducts.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 gap-5"
        >
          <ProductCard
            v-for="(product, idx) in filteredProducts"
            :key="product.id"
            :product="product"
            :priority="idx < 3"
          />
        </div>

        <!-- حالت خالی (بدون نتیجه) -->
        <div
          v-else
          class="rounded-2xl border border-dashed border-sand p-12 text-center space-y-3"
        >
          <p class="text-sm font-bold text-ink">
            هیچ محصولی با فیلترهای انتخابی یافت نشد.
          </p>
          <p class="text-xs text-muted-foreground">
            می‌توانید فیلترها را بازنشانی کرده یا محدوده قیمت را تغییر دهید.
          </p>
          <Button variant="outline" size="sm" class="mt-2" @click="resetFilters">
            پاک کردن فیلترها
          </Button>
        </div>
      </main>
    </div>
  </div>
</template>
