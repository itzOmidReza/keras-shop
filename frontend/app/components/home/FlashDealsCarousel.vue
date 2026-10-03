<!-- frontend/app/components/home/FlashDealsCarousel.vue -->
<script setup lang="ts">
import {
  Clock,
  Flame,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import type { ProductListItem } from '~/types/domain'

interface Props {
  products?: ProductListItem[]
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
})

const cartStore = useCartStore()
const carouselRef = ref<HTMLElement | null>(null)

// تایمر زنده ۲۴ ساعته حراج شتابان
const remainingSeconds = ref(14 * 3600 + 45 * 60 + 20)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      remainingSeconds.value = 24 * 3600
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const hours = computed(() => Math.floor(remainingSeconds.value / 3600))
const minutes = computed(() => Math.floor((remainingSeconds.value % 3600) / 60))
const seconds = computed(() => remainingSeconds.value % 60)

// محصولات دارای تخفیف
const dealProducts = computed(() => {
  if (props.products && props.products.length > 0) {
    return props.products.filter(
      (p) =>
        p.badge === 'حراج' ||
        p.badge === 'sale' ||
        (p.compare_at_price && p.compare_at_price > (p.price ?? p.base_price)),
    )
  }
  return []
})

// ناوبری اسکرول افقی Native Carousel با پشتیبانی کامل از جهت RTL
const scroll = (direction: 'next' | 'prev') => {
  if (!carouselRef.value) return
  const scrollAmount = 320
  // در محیط RTL مرورگر، اسکرول به سمت چپ منفی است
  const multiplier = direction === 'next' ? -1 : 1
  carouselRef.value.scrollBy({
    left: multiplier * scrollAmount,
    behavior: 'smooth',
  })
}

// افزودن سریع سایز به سبد خرید
const handleQuickAdd = (product: ProductListItem, size: string, event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  const price = product.price ?? product.base_price

  cartStore.addItem(
    {
      productId: product.id,
      title: product.title,
      slug: product.slug,
      size,
      price,
      compareAtPrice: product.compare_at_price,
      maxStock: 10,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      color: product.colors?.[0]?.name,
    },
    1,
  )
}

// محاسبه درصد تخفیف
const getDiscountPercent = (base: number, compare?: number): number => {
  if (!compare || compare <= base) return 0
  return Math.round(((compare - base) / compare) * 100)
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- کادر اصلی بخش فروش ویژه با زمینه ادیتوریال و بردر ملایم -->
    <div class="rounded-3xl border border-rose/30 bg-gradient-to-b from-rose/5 via-sand/20 to-paper p-5 sm:p-8 space-y-6 shadow-xs">
      <!-- هدر شتابان با تایمر زنده و دکمه‌های ناوبری کاروسل -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Flame class="w-4 h-4 text-rose animate-bounce" />
            <span>پیشنهادهای استثنایی پاییز ۱۴۰۵</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            فرصت‌های استثنایی پاییز
          </h2>
        </div>

        <!-- باکس تایمر شمارش معکوس و دکمه‌های کنترل کاروسل -->
        <div class="flex flex-wrap items-center justify-between md:justify-end gap-4">
          <!-- تایمر شمارش معکوس -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock class="w-4 h-4 text-rose" />
              <span>زمان باقی‌مانده:</span>
            </div>

            <div class="flex items-center gap-1 font-mono dir-ltr">
              <div class="flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-white border border-sand shadow-2xs">
                <span class="text-xs font-bold text-rose">{{ toFa(String(hours).padStart(2, '0')) }}</span>
              </div>
              <span class="text-rose font-bold">:</span>
              <div class="flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-white border border-sand shadow-2xs">
                <span class="text-xs font-bold text-rose">{{ toFa(String(minutes).padStart(2, '0')) }}</span>
              </div>
              <span class="text-rose font-bold">:</span>
              <div class="flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-white border border-sand shadow-2xs">
                <span class="text-xs font-bold text-rose">{{ toFa(String(seconds).padStart(2, '0')) }}</span>
              </div>
            </div>
          </div>

          <!-- دکمه‌های ناوبری اسکرول کاروسل -->
          <div class="flex items-center gap-2">
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

      <!-- ردیف کاروسل با اسکرول اسنپ روان و مخفی بودن اسکرول‌بار (Native CSS Scroll Snap) -->
      <div
        ref="carouselRef"
        class="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="product in dealProducts"
          :key="product.id"
          class="group relative flex flex-col shrink-0 w-[240px] sm:w-[270px] snap-start rounded-2xl bg-white border border-sand/70 p-3 shadow-2xs hover:shadow-md transition-all duration-300"
        >
          <!-- تصویر کالا و لایه هاور انتخاب سایز -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-sand/30 block"
          >
            <NuxtImg
              :src="product.images?.[0]?.url || '/placeholder.jpg'"
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <!-- بج درصد تخفیف -->
            <div
              v-if="getDiscountPercent(product.price ?? product.base_price, product.compare_at_price) > 0"
              class="absolute inset-s-2.5 top-2.5 z-10 rounded-lg bg-rose text-paper px-2 py-0.5 text-xs font-bold shadow-xs"
            >
              {{ toFa(getDiscountPercent(product.price ?? product.base_price, product.compare_at_price)) }}٪ تخفیف
            </div>

            <!-- لایه انتخاب سریع سایز در هاور کارت -->
            <div
              class="absolute inset-x-2 bottom-2 z-20 rounded-xl bg-white/95 backdrop-blur-md p-2 shadow-xs border border-sand/60 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0"
              @click.stop.prevent
            >
              <div class="text-[9px] font-bold text-muted-foreground mb-1 flex items-center justify-between">
                <span>انتخاب سریع سایز:</span>
                <ShoppingBag class="w-3 h-3 text-rose" />
              </div>
              <div class="flex items-center justify-center gap-1">
                <button
                  v-for="sz in (product.sizes || product.available_sizes || ['Free'])"
                  :key="sz"
                  type="button"
                  class="flex-1 py-1 px-1 rounded-md text-[10px] font-bold border border-sand bg-sand/20 hover:bg-rose hover:text-white hover:border-rose text-ink transition-colors cursor-pointer"
                  :title="`افزودن سایز ${sz} به سبد خرید`"
                  @click.stop.prevent="handleQuickAdd(product, sz, $event)"
                >
                  {{ sz }}
                </button>
              </div>
            </div>
          </NuxtLink>

          <!-- مشخصات متنی و قیمت محصول -->
          <div class="mt-3 flex flex-col gap-1 text-start">
            <NuxtLink
              :to="`/products/${product.slug}`"
              class="text-xs sm:text-sm font-bold text-ink hover:text-rose transition-colors line-clamp-1"
            >
              {{ product.title }}
            </NuxtLink>

            <div class="flex items-center justify-between pt-1">
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-bold text-ink">
                  {{ formatToman(product.price ?? product.base_price) }}
                </span>
                <span
                  v-if="product.compare_at_price"
                  class="text-[11px] text-muted-foreground line-through decoration-rose/60"
                >
                  {{ formatToman(product.compare_at_price) }}
                </span>
              </div>

              <!-- نشانگر شاخه کالا -->
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-md"
                :class="product.division === 'accessories' ? 'bg-sage/10 text-sage' : 'bg-rose/10 text-rose'"
              >
                {{ product.division === 'accessories' ? 'اکسسوری' : 'پوشاک' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- لینک پایین برای مشاهده همه پیشنهادهای تخفیف‌دار -->
      <div class="pt-2 text-center">
        <NuxtLink
          to="/shop?badge=sale"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose hover:underline"
        >
          <span>مشاهده تمامی پیشنهادهای دارای تخفیف کراس</span>
          <ArrowLeft class="w-3.5 h-3.5 rtl:-scale-x-100" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
