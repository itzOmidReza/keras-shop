<!-- frontend/app/components/home/FlashDealsRow.vue -->
<script setup lang="ts">
import { Clock, Flame, ArrowLeft, ShoppingBag } from '@lucide/vue'
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

// تایمر شمارش معکوس زنده حراج شتابان (Flash Deal Countdown)
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

// فیلتر کالاهای دارای تخفیف
const dealProducts = computed(() => {
  if (props.products && props.products.length > 0) {
    return props.products.filter(p => p.compare_at_price && p.compare_at_price > p.base_price)
  }
  return []
})

// افزودن سریع بدون نیاز به ورود به صفحه محصول (Quick-Add)
const handleQuickAdd = (product: ProductListItem, size: string) => {
  cartStore.addItem(
    {
      productId: product.id,
      title: product.title,
      slug: product.slug,
      size,
      price: product.base_price,
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
    <!-- کادر اصلی بخش فروش ویژه با حاشیه و زمینه ادیتوریال -->
    <div class="rounded-3xl border border-rose/30 bg-gradient-to-b from-rose/5 via-sand/20 to-paper p-5 sm:p-8 space-y-6 shadow-xs">
      <!-- هدر شتابان با تایمر زنده -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Flame class="w-4 h-4 text-rose animate-bounce" />
            <span>آفرهای داغ و محدود ۲۴ ساعته</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            فرصت استثنایی خرید ست‌های برگزیده
          </h2>
        </div>

        <!-- باکس تایمر شمارش معکوس -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Clock class="w-4 h-4 text-rose" />
            <span>زمان باقی‌مانده:</span>
          </div>

          <div class="flex items-center gap-1.5 font-mono dir-ltr">
            <div class="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white border border-sand shadow-2xs">
              <span class="text-xs font-bold text-rose">{{ toFa(String(hours).padStart(2, '0')) }}</span>
              <span class="text-[9px] text-muted-foreground">ساعت</span>
            </div>
            <span class="text-rose font-bold">:</span>
            <div class="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white border border-sand shadow-2xs">
              <span class="text-xs font-bold text-rose">{{ toFa(String(minutes).padStart(2, '0')) }}</span>
              <span class="text-[9px] text-muted-foreground">دقیقه</span>
            </div>
            <span class="text-rose font-bold">:</span>
            <div class="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white border border-sand shadow-2xs">
              <span class="text-xs font-bold text-rose">{{ toFa(String(seconds).padStart(2, '0')) }}</span>
              <span class="text-[9px] text-muted-foreground">ثانیه</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ردیف کارت‌های تخفیف با اسکرول اسنپ و قابلیت Quick-Add -->
      <div
        class="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="product in dealProducts"
          :key="product.id"
          class="group relative flex flex-col shrink-0 w-[240px] sm:w-auto snap-start rounded-2xl bg-white border border-sand/70 p-3 shadow-2xs hover:shadow-md transition-all duration-300"
        >
          <!-- تصویر کالا و بج تخفیف -->
          <div class="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-sand/30">
            <NuxtImg
              :src="product.images?.[0]?.url || '/placeholder.jpg'"
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <!-- بج درصد تخفیف چشمگیر -->
            <div
              v-if="getDiscountPercent(product.base_price, product.compare_at_price) > 0"
              class="absolute inset-s-2.5 top-2.5 z-10 rounded-lg bg-rose text-paper px-2 py-0.5 text-xs font-bold shadow-xs"
            >
              {{ toFa(getDiscountPercent(product.base_price, product.compare_at_price)) }}٪ تخفیف
            </div>

            <!-- لایه تعاملی افزودن سریع سایز (Quick-Add Size Overlay) -->
            <div
              class="absolute inset-x-2 bottom-2 z-20 rounded-xl bg-white/95 backdrop-blur-md p-2.5 shadow-sm border border-sand/60 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0"
            >
              <div class="text-[10px] font-bold text-ink mb-1.5 flex items-center justify-between">
                <span>انتخاب سریع سایز:</span>
                <ShoppingBag class="w-3.5 h-3.5 text-rose" />
              </div>
              <div class="flex items-center justify-center gap-1.5">
                <button
                  v-for="sz in (product.available_sizes || ['S', 'M', 'L'])"
                  :key="sz"
                  type="button"
                  class="flex-1 py-1 px-1 rounded-lg text-xs font-bold border border-sand bg-sand/20 hover:bg-rose hover:text-white hover:border-rose text-ink transition-colors cursor-pointer"
                  :title="`افزودن سایز ${sz} به سبد خرید`"
                  @click.stop.prevent="handleQuickAdd(product, sz)"
                >
                  {{ sz }}
                </button>
              </div>
            </div>
          </div>

          <!-- مشخصات متنی و قیمت -->
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
                  {{ formatToman(product.base_price) }}
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

      <!-- لینک پایین بخش برای مشاهده تمام تخفیف‌ها -->
      <div class="pt-2 text-center">
        <NuxtLink
          to="/shop?badge=sale"
          class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
        >
          <span>مشاهده تمامی پیشنهادهای دارای تخفیف کراس</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
