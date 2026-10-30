<!-- frontend/app/pages/shop/index.vue -->
<script setup lang="ts">
import { SlidersHorizontal } from '@lucide/vue'
import {
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
} from '~/composables/catalog/useShopCatalog'
import type { ProductCategory } from '~/types/domain'

const route = useRoute()

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => {
        const page = route.query.page ? `?page=${route.query.page}` : ''
        return `https://kerass.ir/shop${page}`
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
  isFilterDrawerOpen,
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

// متدهای حذف تک‌تک معیارهای فیلتر فعال از نوار بالای گرید
const removeSeason = () => {
  filters.value.season = null
}
const removeDivision = () => {
  filters.value.division = null
}
const removeBrand = () => {
  clearBrand()
}
const removeCategory = (cat: ProductCategory) => {
  filters.value.categories = filters.value.categories.filter(c => c !== cat)
}
const removeSize = (size: string) => {
  filters.value.sizes = filters.value.sizes.filter(s => s !== size)
}
const removeColor = (color: string) => {
  filters.value.colors = filters.value.colors.filter(c => c !== color)
}
const resetPrice = () => {
  filters.value.priceRange = [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- هدر کاتالوگ و معرفی مجموعه ادیتوریال کراس -->
    <CatalogHeader :total-items="totalItems" />

    <!-- ستون اصلی محصولات (فول‌عرض بدون سایدبار سنگین دسکتاپ) -->
    <main class="w-full space-y-6">
      <!-- نوار اقدامات بالای گرید: دکمه فراخوانی دراور فیلترها و مرتب‌سازی -->
      <div class="border-b border-sand/70 pb-4 space-y-3">
        <div class="flex items-center justify-between gap-4">
          <!-- دکمه باز کردن دراور کشویی فیلترها به همراه بج تعداد فیلتر فعال -->
          <div class="flex items-center gap-3">
            <Button
              variant="outline"
              class="h-10 px-4 gap-2 text-xs font-bold rounded-xl border-sand bg-white text-ink hover:bg-sand/30 hover:border-sand/90 cursor-pointer shadow-2xs transition-all active:scale-98"
              @click="isFilterDrawerOpen = true"
            >
              <SlidersHorizontal class="w-4 h-4 text-rose" />
              <span>فیلترها</span>
              <span
                v-if="activeFilterCount > 0"
                class="rounded-full bg-rose text-white text-[10px] px-2 py-0.5 font-bold"
              >
                {{ toFa(activeFilterCount) }}
              </span>
            </Button>

            <span class="text-xs text-muted-foreground font-medium hidden sm:inline-block">
              نمایش {{ toFa(totalItems) }} کالا
            </span>
          </div>

          <!-- دراپ‌داون گزینه‌های مرتب‌سازی -->
          <div class="flex items-center gap-2 ms-auto">
            <SortSelect v-model="sort" />
          </div>
        </div>

        <!-- چیپ‌های فیلترهای فعال در بالای گرید با قابلیت حذف مستقل هر معیار -->
        <CatalogActiveFilters
          :filters="filters"
          :search-query="typeof route.query.q === 'string' ? route.query.q : null"
          :badge-query="typeof route.query.badge === 'string' ? route.query.badge : null"
          :brand-query="activeBrandQuery"
          :min-price="DEFAULT_MIN_PRICE"
          :max-price="DEFAULT_MAX_PRICE"
          :active-count="activeFilterCount"
          @remove-season="removeSeason"
          @remove-division="removeDivision"
          @remove-brand="removeBrand"
          @remove-category="removeCategory"
          @remove-size="removeSize"
          @remove-color="removeColor"
          @reset-price="resetPrice"
          @clear-search="clearSearch"
          @clear-badge="clearBadge"
          @reset-all="resetFilters"
        />
      </div>

      <!-- لودینگ اسکلتون -->
      <div
        v-if="pending"
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <CatalogSkeleton v-for="i in 12" :key="i" />
      </div>

      <!-- گرید محصولات کاتالوگ (فول‌عرض با فاصله و ترازبندی تنفس‌دار و ادیتوریال) -->
      <div
        v-else-if="paginatedProducts && paginatedProducts.length > 0"
        class="space-y-8"
      >
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

    <!-- دراور کشویی فیلترها (مشترک بین دسکتاپ و موبایل) -->
    <CatalogFilterDrawer
      v-model:open="isFilterDrawerOpen"
      v-model="filters"
      :total-items="totalItems"
      :min-price="DEFAULT_MIN_PRICE"
      :max-price="DEFAULT_MAX_PRICE"
      @reset="resetFilters"
    />
  </div>
</template>
