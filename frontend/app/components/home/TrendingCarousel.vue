<!-- frontend/app/components/home/TrendingCarousel.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from '@lucide/vue'
import ProductCard from '~/components/product/ProductCard.vue'
import type { ProductListItem } from '~/types/domain'

interface Props {
  products?: ProductListItem[]
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
})

const carouselRef = ref<HTMLElement | null>(null)
const activeCategoryTab = ref<'all' | 'shirts-blouses' | 'knitwear' | 'accessories'>('all')

const tabs = [
  { id: 'all', label: 'همه ترندها' },
  { id: 'shirts-blouses', label: 'شومیز و پیراهن' },
  { id: 'knitwear', label: 'بافت و پلیور' },
  { id: 'accessories', label: 'اکسسوری و شال' },
] as const

const filteredProducts = computed(() => {
  if (activeCategoryTab.value === 'shirts-blouses') {
    return props.products.filter((p) => p.category === 'shirts-blouses')
  }
  if (activeCategoryTab.value === 'knitwear') {
    return props.products.filter((p) => p.category === 'knitwear')
  }
  if (activeCategoryTab.value === 'accessories') {
    return props.products.filter((p) => p.division === 'accessories')
  }
  return props.products
})

const scroll = (direction: 'next' | 'prev') => {
  if (!carouselRef.value) return
  const scrollAmount = 300
  // در محیط RTL مرورگر، اسکرول به جلو در جهت منفی است
  const multiplier = direction === 'next' ? -1 : 1
  carouselRef.value.scrollBy({
    left: multiplier * scrollAmount,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-6 sm:space-y-8">
      <!-- هدر بخش ترندهای برتر به همراه تب‌های فیلتر و دکمه‌های ناوبری کاروسل -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>پرفروش‌ترین‌های پاییز ۱۴۰۵</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            ترندهای برتر سال
          </h2>
        </div>

        <!-- تب‌های انتخاب دسته‌بندی و دکمه‌های اسکرول -->
        <div class="flex flex-wrap items-center justify-between lg:justify-end gap-3">
          <!-- تب‌های فیلتر -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              :class="[
                activeCategoryTab === tab.id
                  ? 'bg-ink text-paper shadow-2xs'
                  : 'border border-sand bg-sand/20 hover:bg-sand/40 text-ink',
              ]"
              @click="activeCategoryTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- دکمه‌های ناوبری کاروسل -->
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="آیتم‌های قبلی"
              @click="scroll('prev')"
            >
              <ChevronRight class="w-4 h-4 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="آیتم‌های بعدی"
              @click="scroll('next')"
            >
              <ChevronLeft class="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>

      <!-- ردیف تک‌خطی کاروسل با اسکرول اسنپ بدون اسکرول‌بار -->
      <div
        ref="carouselRef"
        class="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="shrink-0 w-[220px] sm:w-[260px] snap-start"
        >
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- دکمه CTA زیر کاروسل برای مشاهده کل کاتالوگ -->
      <div class="pt-2 text-center">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white hover:bg-sand/30 px-8 py-3.5 text-xs sm:text-sm font-bold text-ink shadow-2xs hover:shadow-xs transition-all"
        >
          <span>مشاهده تمامی محصولات در کاتالوگ فروشگاه</span>
          <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
