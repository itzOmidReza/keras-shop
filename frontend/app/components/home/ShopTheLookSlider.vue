<!-- frontend/app/components/home/ShopTheLookSlider.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowLeft,
} from '@lucide/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types'
import { formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import { toast } from 'vue-sonner'

interface LookItem {
  id: number
  slug: string
  title: string
  price: number
  compareAtPrice?: number
  image: string
  hotspot: { top: number; right: number }
  sizes: string[]
}

interface OutfitLook {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  items: LookItem[]
}

const cartStore = useCartStore()
const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const looks: OutfitLook[] = [
  {
    id: 'look-autumn',
    title: 'استایل ادیتوریال پاییزه',
    subtitle: 'کالکشن جدید — پاییز ۱۴۰۵',
    description: 'ترکیب شومیز لینن اسلپ مدل کارن، شلوار واید لینن پاییزه و دستمال سر ژاکارد؛ هارمونی چشم‌نواز تنالیته شنی و خاکی برای استایل روزمره ادیتوریال.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 1,
        slug: 'karen-slub-linen-blouse',
        title: 'شومیز لینن اسلپ مدل کارن',
        price: 1850000,
        compareAtPrice: 2200000,
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 38, right: 48 },
        sizes: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 12,
        slug: 'wide-leg-autumn-linen-pants',
        title: 'شلوار واید لینن پاییزه',
        price: 1950000,
        compareAtPrice: 2350000,
        image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 72, right: 48 },
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 20,
        slug: 'cotton-jacquard-bandana',
        title: 'دستمال سر ژاکارد نخ پنبه',
        price: 390000,
        compareAtPrice: 480000,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 16, right: 50 },
        sizes: ['Free'],
      },
    ],
  },
  {
    id: 'look-winter',
    title: 'استایل لایه‌لایه گرم زمستانه',
    subtitle: 'کالکشن زمستان ۱۴۰۵',
    description: 'هارمونی شیک پالتو فوتر پشمی آستردار با پلیور بافت کرکی یقه اسکی و شال پشمی ضخیم؛ گرما، راحتی و وقار مینیمال در روزهای خنک.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 9,
        slug: 'long-lined-wool-fouter-coat',
        title: 'پالتو فوتر پشمی بلند آستردار',
        price: 4850000,
        compareAtPrice: 5600000,
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 40, right: 50 },
        sizes: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 5,
        slug: 'fluffy-turtleneck-knit-sweater',
        title: 'پلیور بافت کرکی یقه اسکی',
        price: 2450000,
        compareAtPrice: 2850000,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 60, right: 48 },
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 24,
        slug: 'thick-knit-wool-long-scarf',
        title: 'شال بلند پشمی بافت ضخیم',
        price: 1250000,
        compareAtPrice: 1550000,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 22, right: 52 },
        sizes: ['Free'],
      },
    ],
  },
  {
    id: 'look-accessories',
    title: 'ست اکسسوری و شال مکمل',
    subtitle: 'اکسسوری‌های دست‌ساز کراس',
    description: 'هماهنگی شال بلند پشمی بافت ضخیم، اسکرانچی ابریشم طبیعی و دستمال سر ژاکارد برای تکمیل استایل‌های پاییزی و روزمره.',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 17,
        slug: 'natural-silk-autumn-scrunchie',
        title: 'اسکرانچی ابریشم طبیعی پالت پاییزه',
        price: 280000,
        compareAtPrice: 350000,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 20, right: 52 },
        sizes: ['Free'],
      },
      {
        id: 24,
        slug: 'thick-knit-wool-long-scarf',
        title: 'شال بلند پشمی بافت ضخیم',
        price: 1250000,
        compareAtPrice: 1550000,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 46, right: 48 },
        sizes: ['Free'],
      },
      {
        id: 20,
        slug: 'cotton-jacquard-bandana',
        title: 'دستمال سر ژاکارد نخ پنبه',
        price: 390000,
        compareAtPrice: 480000,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 72, right: 50 },
        sizes: ['Free'],
      },
    ],
  },
]

// سایزهای انتخاب‌شده برای هر آیتم
const selectedSizes = reactive<Record<number, string>>({
  1: 'M',
  5: 'M',
  9: 'M',
  12: 'M',
  17: 'Free',
  20: 'Free',
  24: 'Free',
})

// هات‌اسپات فعال برای پاپ‌اور
const activeHotspotId = ref<number | null>(null)

const toggleHotspot = (itemId: number) => {
  // متوقف کردن اتوپلی در زمان تعامل کاربر با هات‌اسپات
  swiperInstance.value?.autoplay?.stop()
  if (activeHotspotId.value === itemId) {
    activeHotspotId.value = null
  } else {
    activeHotspotId.value = itemId
  }
}

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.realIndex ?? swiper.activeIndex
  activeHotspotId.value = null
}

const scrollToSlide = (index: number) => {
  swiperInstance.value?.slideToLoop(index)
}

const nextSlide = () => {
  swiperInstance.value?.slideNext()
}

const prevSlide = () => {
  swiperInstance.value?.slidePrev()
}

// محاسبات تخفیف پکیج ست (۱۰٪ تخفیف باندل)
const getRegularTotal = (look: OutfitLook) => {
  return look.items.reduce((sum, item) => sum + item.price, 0)
}

const getBundleTotal = (look: OutfitLook) => {
  return Math.round(getRegularTotal(look) * 0.9)
}

// افزودن تمام آیتم‌های ست به سبد خرید با ۱۰٪ تخفیف
const addEntireOutfitToCart = (look: OutfitLook) => {
  for (const item of look.items) {
    const size = selectedSizes[item.id] || item.sizes[0] || 'Free'
    const bundleDiscountedPrice = Math.round(item.price * 0.9)

    cartStore.addItem(
      {
        productId: item.id,
        title: item.title,
        slug: item.slug,
        size,
        price: bundleDiscountedPrice,
        compareAtPrice: item.price,
        maxStock: 10,
        image: item.image,
        color: 'رنگ ست ادیتوریال',
      },
      1,
    )
  }

  toast.success(
    `ست کامل «${look.title}» با ۱۰٪ تخفیف باندل به سبد خرید شما افزوده شد!`,
  )
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-6 sm:space-y-8">
      <!-- هدر بخش خرید ست با استایل ادیتوریال -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>پیشنهاد استایلیست‌های کراس</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            خرید ست کامل (Shop The Look)
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            استایل‌های هماهنگ پاییز با ۱۰٪ تخفیف ویژه پکیج بر روی مجموع آیتم‌ها
          </p>
        </div>

        <!-- دکمه‌های ناوبری اسلایدر و شاخص شماره اسلاید (در RTL: قبلی راست، بعدی چپ) -->
        <div class="flex items-center gap-3 self-end sm:self-auto">
          <!-- ایندیکیتورهای دایره‌ای اسلایدها -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="(_, idx) in looks"
              :key="idx"
              type="button"
              class="h-2 rounded-full transition-all cursor-pointer"
              :class="activeIndex === idx ? 'w-6 bg-rose' : 'w-2 bg-sand hover:bg-sand/80'"
              :aria-label="`اسلاید شماره ${idx + 1}`"
              @click="scrollToSlide(idx)"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="ست قبلی"
              @click="prevSlide"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="ست بعدی"
              @click="nextSlide"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- اسلایدر Swiper لوک‌های ادیتوریال همراه با اتوپلی نرم و سوایپ لمسی -->
      <Swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :loop="true"
        :speed="600"
        dir="rtl"
        :autoplay="{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }"
        class="w-full rounded-3xl"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="look in looks"
          :key="look.id"
          class="!h-auto"
        >
          <div class="w-full rounded-3xl border border-sand/80 bg-white p-5 sm:p-8 shadow-xs">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <!-- ستون سمت راست بصری: تصویر مدل با هات‌اسپات‌های تعاملی پالس‌دار -->
              <div
                class="lg:col-span-7 relative rounded-2xl bg-sand/30 aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[520px]"
                @click="activeHotspotId = null"
              >
                <!-- کانتینر اختصاصی تصویر همراه با لبه‌های گرد -->
                <div class="absolute inset-0 rounded-2xl overflow-hidden">
                  <NuxtImg
                    :src="look.image"
                    :alt="look.title"
                    class="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <!-- گرادیان ملایم برای جلوه ادیتوریال -->
                  <div class="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>

                <!-- هات‌اسپات‌های تعاملی روی تصویر (بیرون از overflow-hidden برای جلوگیری از هرگونه برش پاپ‌اور) -->
                <div
                  v-for="item in look.items"
                  :key="item.id"
                  class="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  :style="{ top: `${item.hotspot.top}%`, right: `${item.hotspot.right}%` }"
                >
                  <!-- دکمه هات‌اسپات با افکت پینگ -->
                  <button
                    type="button"
                    class="relative group/hotspot flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-rose shadow-md border-2 border-white cursor-pointer active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-rose/40"
                    :aria-label="`مشاهده آیتم ${item.title}`"
                    @click.stop="toggleHotspot(item.id)"
                  >
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose/60 opacity-75 pointer-events-none" />
                    <span class="w-2.5 h-2.5 rounded-full bg-rose relative z-10 pointer-events-none" />
                  </button>

                  <!-- پاپ‌اور گلس‌مورفیسم اطلاعات محصول با جهت‌یابی هوشمند (بالا یا پایین هات‌اسپات) -->
                  <div
                    v-if="activeHotspotId === item.id"
                    class="absolute z-50 w-56 sm:w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sand shadow-2xl text-start pointer-events-auto space-y-2.5 animate-in fade-in zoom-in-95 duration-200"
                    :class="item.hotspot.top <= 35 ? 'top-full mt-2.5' : 'bottom-full mb-2.5'"
                    style="left: 50%; transform: translateX(-50%);"
                    @click.stop
                  >
                    <div class="flex items-center gap-2.5">
                      <img
                        :src="item.image"
                        :alt="item.title"
                        class="w-12 h-14 rounded-xl object-cover bg-sand/30 shrink-0 border border-sand/50"
                      >
                      <div class="space-y-0.5 overflow-hidden">
                        <h4 class="text-xs font-bold text-ink truncate">
                          {{ item.title }}
                        </h4>
                        <p class="text-xs font-bold text-rose">
                          {{ formatToman(item.price) }}
                        </p>
                      </div>
                    </div>

                    <NuxtLink
                      :to="`/products/${item.slug}`"
                      class="block text-center py-1.5 rounded-xl bg-ink text-paper hover:bg-rose text-[11px] font-bold transition-colors shadow-2xs"
                    >
                      <span>مشاهده و خرید محصول</span>
                    </NuxtLink>
                  </div>
                </div>

                <!-- بج راهنمای کلیک روی هات‌اسپات‌ها -->
                <div class="absolute bottom-3 inset-s-3 z-20 rounded-xl bg-white/85 backdrop-blur-md px-3 py-1.5 border border-sand/60 text-[10px] font-bold text-ink shadow-2xs flex items-center gap-1.5 pointer-events-none">
                  <Eye class="w-3.5 h-3.5 text-rose" />
                  <span>برای جزئیات، روی نقاط بزنید</span>
                </div>
              </div>

              <!-- ستون سمت چپ: تفکیک آیتم‌های ست، انتخاب سایز و دکمه خرید باندل -->
              <div class="lg:col-span-5 space-y-5 text-start">
                <div>
                  <span class="text-xs font-bold text-rose uppercase tracking-wider">
                    {{ look.subtitle }}
                  </span>
                  <h3 class="text-xl sm:text-2xl font-bold text-ink mt-0.5">
                    {{ look.title }}
                  </h3>
                  <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {{ look.description }}
                  </p>
                </div>

                <!-- لیست ۳ آیتم تشکیل‌دهنده ست به همراه سلکتور سایز اختصاصی -->
                <div class="space-y-2.5 divide-y divide-sand/60 border-y border-sand/60 py-2.5">
                  <div
                    v-for="item in look.items"
                    :key="item.id"
                    class="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <img
                        :src="item.image"
                        :alt="item.title"
                        class="w-11 h-13 rounded-xl object-cover bg-sand/30 shrink-0 border border-sand/50"
                      >
                      <div class="space-y-0.5 min-w-0">
                        <NuxtLink
                          :to="`/products/${item.slug}`"
                          class="text-xs font-bold text-ink hover:text-rose transition-colors truncate block"
                        >
                          {{ item.title }}
                        </NuxtLink>
                        <span class="text-xs font-bold text-rose block">
                          {{ formatToman(item.price) }}
                        </span>
                      </div>
                    </div>

                    <!-- انتخابگر سایز این محصول از ست -->
                    <div class="flex items-center gap-1 shrink-0">
                      <button
                        v-for="sz in item.sizes"
                        :key="sz"
                        type="button"
                        class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
                        :class="[
                          selectedSizes[item.id] === sz
                            ? 'bg-rose text-white border-rose shadow-2xs'
                            : 'border-sand bg-sand/20 hover:bg-sand/50 text-ink',
                        ]"
                        @click="selectedSizes[item.id] = sz"
                      >
                        {{ sz }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- محاسبه قیمت پکیج و دکمه خرید ۱-کلیک کل ست -->
                <div class="rounded-2xl bg-sand/30 border border-sand/70 p-4 space-y-3">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground">مجموع قیمت تکی آیتم‌ها:</span>
                    <span class="line-through text-muted-foreground font-mono">
                      {{ formatToman(getRegularTotal(look)) }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs font-bold text-ink block">قیمت ویژه پکیج ست (۱۰٪ کسر):</span>
                      <span class="text-xs text-sage font-medium">سود شما از خرید ست: {{ formatToman(getRegularTotal(look) - getBundleTotal(look)) }}</span>
                    </div>
                    <span class="text-base sm:text-lg font-black text-rose font-mono">
                      {{ formatToman(getBundleTotal(look)) }}
                    </span>
                  </div>

                  <button
                    type="button"
                    class="w-full py-3 px-4 rounded-xl bg-rose hover:bg-rose/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
                    @click="addEntireOutfitToCart(look)"
                  >
                    <ShoppingBag class="w-4 h-4" />
                    <span>افزودن کل ست به سبد خرید با ۱۰٪ تخفیف</span>
                    <ArrowLeft class="w-4 h-4 ms-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
