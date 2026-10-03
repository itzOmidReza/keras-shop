<!-- frontend/app/components/home/ShopTheLook.vue -->
<script setup lang="ts">
import { Sparkles, ShoppingBag, Check, Plus, Eye } from '@lucide/vue'
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

const looks: OutfitLook[] = [
  {
    id: 'look-autumn',
    title: 'استایل ادیتوریال پاییزه',
    subtitle: 'کالکشن جدید — پاییز ۱۴۰۵',
    description: 'ترکیب شومیز لینن اسلپ مدل کارن به همراه شلوار واید لینن پاییزه و دستمال سر ژاکارد نخ پنبه؛ هارمونی چشم‌نواز تنالیته شنی و خاکی برای استایل روزمره.',
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
    title: 'استایل لایه‌لایه زمستانه',
    subtitle: 'کالکشن زمستان ۱۴۰۵',
    description: 'هارمونی شیک پالتو فوتر پشمی آستردار با پلیور بافت کرکی یقه اسکی و شال بلند پشمی؛ گرما و وقار مینیمال در روزهای سرد سال.',
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
    subtitle: 'اکسسوری‌های دست‌ساز',
    description: 'هماهنگی شال بلند پشمی بافت ضخیم، اسکرانچی ابریشم طبیعی و دستمال سر ژاکارد نخ پنبه برای تکمیل لوک‌های روزمره و رسمی ادیتوریال.',
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

const activeLookId = ref('look-autumn')
const activeLook = computed(() => {
  return looks.find(l => l.id === activeLookId.value) || looks[0]!
})

// سایزهای انتخاب‌شده برای هر آیتم ست
const selectedSizes = reactive<Record<number, string>>({
  1: 'M',
  5: 'M',
  9: 'M',
  12: 'M',
  17: 'Free',
  20: 'Free',
  24: 'Free',
})

// هات‌اسپات فعال برای نمایش پاپ‌اور
const activeHotspotId = ref<number | null>(null)

const toggleHotspot = (itemId: number) => {
  if (activeHotspotId.value === itemId) {
    activeHotspotId.value = null
  } else {
    activeHotspotId.value = itemId
  }
}

// محاسبات تخفیف پکیج ست (۱۰٪ تخفیف باندل)
const regularTotal = computed(() => {
  return activeLook.value.items.reduce((sum, item) => sum + item.price, 0)
})

const bundleDiscount = computed(() => {
  return Math.round(regularTotal.value * 0.1) // ۱۰٪ تخفیف خرید یکجای ست
})

const bundleTotal = computed(() => {
  return regularTotal.value - bundleDiscount.value
})

// افزودن کل ست به سبد خرید با ۱۰٪ تخفیف
const addEntireBundleToCart = () => {
  activeLook.value.items.forEach((item) => {
    const size = selectedSizes[item.id] || item.sizes[0] || 'Free'
    cartStore.addItem(
      {
        productId: item.id,
        title: item.title,
        slug: item.slug,
        size,
        price: Math.round(item.price * 0.9), // اعمال ۱۰٪ تخفیف مستقیم ست
        compareAtPrice: item.price,
        maxStock: 10,
        image: item.image,
      },
      1,
    )
  })

  toast.success(`کل ست «${activeLook.value.title}» با ۱۰٪ تخفیف به سبد خرید اضافه شد!`)
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
    <div class="rounded-3xl border border-sand bg-white p-6 sm:p-10 shadow-xs space-y-8">
      <!-- هدر و انتخابگر چندگانه استایل‌ها (Multi-Look Switcher) -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/70 pb-6">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>خرید هوشمند پکیج ست (Bundle)</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            استایل تن مدل را بخرید (Shop The Look)
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            ست‌های هماهنگ با آزمون تن‌خور و هارمونی رنگی اختصاصی؛ خرید همزمان اقلام ست شامل ۱۰٪ تخفیف مستقیم می‌شود.
          </p>
        </div>

        <!-- تب‌های انتخاب استایل -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="look in looks"
            :key="look.id"
            type="button"
            class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="[
              activeLookId === look.id
                ? 'bg-ink text-paper shadow-xs'
                : 'border border-sand bg-sand/20 hover:bg-sand/40 text-ink',
            ]"
            @click="activeLookId = look.id; activeHotspotId = null"
          >
            {{ look.title }}
          </button>
        </div>
      </div>

      <!-- محتوای اصلی ۲ ستونه: تصویر تعاملی هات‌اسپات + سایدبار خلاصه ست -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- ستون سمت راست: تصویر عمودی مدل با هات‌اسپات‌های متحرک (۷ ستون) -->
        <div class="lg:col-span-7 relative aspect-3/4 sm:aspect-4/5 rounded-3xl overflow-hidden bg-sand/30 border border-sand shadow-xs">
          <NuxtImg
            :src="activeLook.image"
            :alt="activeLook.title"
            class="w-full h-full object-cover object-top transition-all duration-700"
            loading="lazy"
          />

          <!-- لایه گرادیان بسیار ملایم در پایین -->
          <div class="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />

          <!-- هات‌اسپات‌های تپنده روی لباس مدل -->
          <div
            v-for="item in activeLook.items"
            :key="item.id"
            class="absolute z-20"
            :style="{
              top: `${item.hotspot.top}%`,
              right: `${item.hotspot.right}%`,
            }"
          >
            <!-- نشانگر تپنده هات‌اسپات -->
            <button
              type="button"
              class="relative flex items-center justify-center w-8 h-8 rounded-full bg-white text-ink shadow-md border border-sand hover:scale-110 transition-transform cursor-pointer"
              :aria-label="`مشاهده اطلاعات ${item.title}`"
              @click="toggleHotspot(item.id)"
            >
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose/40 opacity-75" />
              <Plus v-if="activeHotspotId !== item.id" class="w-4 h-4 text-rose" />
              <Check v-else class="w-4 h-4 text-sage" />
            </button>

            <!-- پاپ‌اور تعاملی کالا (Hotspot Popover) -->
            <div
              v-if="activeHotspotId === item.id"
              class="absolute top-10 inset-s-0 sm:inset-s-auto sm:inset-e-0 z-30 w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sand shadow-lg text-start space-y-2 animate-in fade-in zoom-in-95 duration-200"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-12 h-14 rounded-lg overflow-hidden bg-sand/30 shrink-0">
                  <NuxtImg :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-ink truncate">
                    {{ item.title }}
                  </h4>
                  <p class="text-xs font-bold text-rose mt-0.5">
                    {{ formatToman(item.price) }}
                  </p>
                </div>
              </div>

              <NuxtLink
                :to="`/products/${item.slug}`"
                class="block w-full text-center py-1.5 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink text-[11px] font-bold transition-colors"
              >
                مشاهده جزئیات کالا
              </NuxtLink>
            </div>
          </div>

          <!-- زیرنویس تصویر -->
          <div class="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-md px-4 py-2.5 border border-sand/70 text-xs">
            <div class="flex items-center gap-2 text-ink font-bold">
              <Eye class="w-4 h-4 text-rose" />
              <span>روی نشانگرهای لباس بزنید</span>
            </div>
            <span class="text-muted-foreground text-[11px]">
              {{ activeLook.items.length }} قلم در این ست
            </span>
          </div>
        </div>

        <!-- ستون سمت چپ: کارت خلاصه اقلام ست، انتخاب سایزها و دکمه افزودن کل ست (۵ ستون) -->
        <div class="lg:col-span-5 space-y-6 text-start">
          <div class="space-y-2">
            <span class="text-xs font-bold text-rose">
              {{ activeLook.subtitle }}
            </span>
            <h3 class="text-xl sm:text-2xl font-bold text-ink">
              {{ activeLook.title }}
            </h3>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {{ activeLook.description }}
            </p>
          </div>

          <!-- لیست اقلام پوشیده شده توسط مدل با انتخاب سایز اختصاصی -->
          <div class="space-y-3.5 divide-y divide-sand/50">
            <div
              v-for="item in activeLook.items"
              :key="item.id"
              class="pt-3.5 first:pt-0 flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-14 h-16 rounded-xl overflow-hidden bg-sand/30 shrink-0 border border-sand/60">
                  <NuxtImg :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-1">
                  <NuxtLink :to="`/products/${item.slug}`" class="text-xs font-bold text-ink hover:text-rose transition-colors line-clamp-1">
                    {{ item.title }}
                  </NuxtLink>
                  <p class="text-xs font-bold text-ink">
                    {{ formatToman(item.price) }}
                  </p>
                </div>
              </div>

              <!-- انتخابگر سایز تکی -->
              <div class="flex flex-col items-end gap-1 shrink-0">
                <span class="text-[10px] text-muted-foreground font-medium">سایز:</span>
                <select
                  v-model="selectedSizes[item.id]"
                  class="h-8 px-2 rounded-lg border border-sand bg-sand/20 text-xs font-bold text-ink focus:outline-none focus:border-rose cursor-pointer"
                >
                  <option v-for="sz in item.sizes" :key="sz" :value="sz">
                    {{ sz }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- باکس خلاصه مالی و تخفیف ۱۰٪ باندل -->
          <div class="rounded-2xl bg-sand/25 border border-sand/60 p-4 space-y-2.5 text-xs">
            <div class="flex items-center justify-between text-muted-foreground">
              <span>مجموع قیمت تکی اقلام:</span>
              <span class="font-bold">{{ formatToman(regularTotal) }}</span>
            </div>

            <div class="flex items-center justify-between text-rose font-bold">
              <span>تخفیف ۱۰٪ خرید یکجای ست:</span>
              <span>{{ formatToman(bundleDiscount) }}-</span>
            </div>

            <div class="pt-2 border-t border-sand/60 flex items-center justify-between text-sm font-bold text-ink">
              <span>مبلغ نهایی کل ست:</span>
              <span class="text-base text-rose font-mono">{{ formatToman(bundleTotal) }}</span>
            </div>
          </div>

          <!-- دکمه CTA افزودن کل ست به سبد خرید -->
          <button
            type="button"
            class="w-full py-3.5 px-6 rounded-2xl bg-ink hover:bg-ink/90 text-paper font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            @click="addEntireBundleToCart"
          >
            <ShoppingBag class="w-4 h-4 text-rose" />
            <span>افزودن کل ست به سبد خرید با ۱۰٪ تخفیف</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
