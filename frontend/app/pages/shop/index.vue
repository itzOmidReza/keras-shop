<!-- frontend/app/pages/shop/index.vue -->
<script setup lang="ts">
import { SlidersHorizontal } from '@lucide/vue'
import {
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
} from '~/composables/catalog/useShopCatalog'

const route = useRoute()

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => {
        const page = route.query.page ? `?page=${route.query.page}` : ''
        return `https://keras.ir/shop${page}`
      },
    },
  ],
})

useSeoMeta({
  title: 'کاتالوگ و فروشگاه چهارفصل پوشاک و اکسسوری | کراس',
  description: 'مجموعه پوشاک ادیتوریال، بافت، پالتو، شومیز و اکسسوری‌های دست‌ساز چهارفصل کراس.',
  ogTitle: 'کاتالوگ و فروشگاه چهارفصل پوشاک و اکسسوری | کراس',
  ogDescription: 'مجموعه پوشاک ادیتوریال، بافت، پالتو، شومیز و اکسسوری‌های دست‌ساز چهارفصل کراس.',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
})

const {
  filters,
  sort,
  currentPage,
  isMobileFilterOpen,
  pending,
  totalItems,
  totalPages,
  paginatedProducts,
  activeFilterCount,
  paginationPages,
  changePage,
  clearSearch,
  clearBadge,
  clearBrand,
  resetFilters,
} = await useShopCatalog()
const activeBrandQuery = computed<string | null>(() => {
  if (typeof filters.value.brand === 'string') return filters.value.brand
  if (typeof route.query.brand === 'string') return route.query.brand
  return null
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- هدر کاتالوگ و معرفی مجموعه -->
    <CatalogHeader
      :search-query="typeof route.query.q === 'string' ? route.query.q : null"
      :badge-query="typeof route.query.badge === 'string' ? route.query.badge : null"
      :brand-query="activeBrandQuery"
      :total-items="totalItems"
      @clear-search="clearSearch"
      @clear-badge="clearBadge"
      @clear-brand="clearBrand"
    />

    <div class="flex flex-col lg:flex-row gap-8 items-start">
      <!-- سایدبار فیلترها (دسکتاپ استیکی) -->
      <aside class="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-sand bg-white shadow-2xs">
        <FilterPanel
          v-model="filters"
          :min-price="DEFAULT_MIN_PRICE"
          :max-price="DEFAULT_MAX_PRICE"
          @reset="resetFilters"
        />
      </aside>

      <!-- ستون اصلی محصولات و صفحه‌بندی -->
      <main class="flex-1 min-w-0 space-y-6">
        <!-- نوار کنترل بالای محصولات -->
        <div class="flex items-center justify-between border-b border-sand/70 pb-4">
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
              {{ toFa(activeFilterCount) }}
            </span>
          </Button>

          <!-- دراپ‌داون مرتب‌سازی -->
          <SortSelect v-model="sort" class="ms-auto" />
        </div>

        <!-- لودینگ اسکلتون -->
        <div
          v-if="pending"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <CatalogSkeleton v-for="i in 12" :key="i" />
        </div>

        <!-- گرید محصولات کاتالوگ -->
        <div
          v-else-if="paginatedProducts && paginatedProducts.length > 0"
          class="space-y-8"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard
              v-for="(product, idx) in paginatedProducts"
              :key="product.id"
              :product="product"
              :priority="idx < 4"
            />
          </div>

          <!-- کنترل‌های صفحه‌بندی -->
          <CatalogPagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :pagination-pages="paginationPages"
            @change-page="changePage"
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
    <LazyCatalogMobileFilterSheet
      v-model:open="isMobileFilterOpen"
      v-model="filters"
      :total-items="totalItems"
      :min-price="DEFAULT_MIN_PRICE"
      :max-price="DEFAULT_MAX_PRICE"
      @reset="resetFilters"
    />
  </div>
</template>
