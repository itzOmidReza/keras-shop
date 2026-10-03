<!-- frontend/app/components/home/BentoCategoryGrid.vue -->
<script setup lang="ts">
import { ArrowLeft, Sparkles } from '@lucide/vue'

interface BentoCard {
  id: string
  title: string
  subtitle: string
  ctaText: string
  href: string
  image: string
  bgClass: string
}

// ۴ کارت فرعی در بخش شبکه راست (یا چپ در LTR)
const smallCards: BentoCard[] = [
  {
    id: 'shirts-blouses',
    title: 'پیراهن و شومیز',
    subtitle: 'لینن اسلپ و کتان شسته',
    ctaText: 'خرید شومیز',
    href: '/shop?category=shirts-blouses',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
    bgClass: 'bg-sand/30 border-sand/70',
  },
  {
    id: 'knitwear',
    title: 'بافت و پلیور',
    subtitle: 'کشمیر و بافت بوکله',
    ctaText: 'مشاهده بافت‌ها',
    href: '/shop?category=knitwear',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    bgClass: 'bg-paper border-sand/80',
  },
  {
    id: 'scarves',
    title: 'اسکارف و دستمال سر',
    subtitle: 'ابریشم طبیعی و ژاکارد',
    ctaText: 'خرید اسکارف',
    href: '/shop?category=scarves',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    bgClass: 'bg-sand/20 border-sand/60',
  },
  {
    id: 'hair-accessories',
    title: 'اکسسوری‌های مو',
    subtitle: 'اسکرانچی ابریشم و گیره سلولز',
    ctaText: 'مشاهده اکسسوری مو',
    href: '/shop?category=hair-accessories',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    bgClass: 'bg-rose/5 border-rose/20',
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="space-y-6 sm:space-y-8">
      <!-- هدر بخش بنتو گرید با لینک مشاهده همه -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-4">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>دسته‌بندی‌های برگزیده پاییز</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            کشف کالکشن بر اساس دسته‌بندی
          </h2>
        </div>

        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-ink hover:text-rose transition-colors"
        >
          <span>مشاهده تمامی محصولات</span>
          <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
        </NuxtLink>
      </div>

      <!-- ساختار شبکه نامتقارن بنتو (Asymmetric Bento Grid) مطابق تصویر رفرنس Luxora -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        <!-- کارت بزرگ شاخص (اسپن ۲ ردیف) — پوشاک و دراپ پاییز -->
        <NuxtLink
          to="/shop?division=apparel"
          class="group relative lg:col-span-5 lg:row-span-2 min-h-[420px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-sand/80 shadow-xs flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:shadow-md cursor-pointer"
        >
          <!-- تصویر تمام قد مدل -->
          <NuxtImg
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
            alt="پوشاک و دراپ پاییز کراس"
            class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <!-- گرادیان عمودی محافظ خوانایی متن -->
          <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent group-hover:from-ink/95 transition-colors" />

          <!-- محتوای کارت بزرگ -->
          <div class="relative z-10 space-y-3 text-start text-paper">
            <span class="inline-block px-3 py-1 rounded-full bg-paper/20 backdrop-blur-md border border-paper/30 text-[11px] font-bold">
              دراپ فعال پاییز ۱۴۰۵
            </span>

            <h3 class="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-sand transition-colors">
              پوشاک و دراپ پاییز
            </h3>

            <p class="text-xs sm:text-sm text-sand/90 leading-relaxed max-w-sm">
              پالتوهای فوتر، ترنچ کت‌های بارانی، شومیزهای اسلپ و شلوارهای واید لینن برای پاییز معتدل.
            </p>

            <div class="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-paper group-hover:text-rose transition-colors">
              <span>مشاهده کالکشن پوشاک</span>
              <ArrowLeft class="w-4 h-4 rtl:-scale-x-100 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </NuxtLink>

        <!-- ۴ کارت دسته‌بندی فرعی در چیدمان ۲ در ۲ (سمت دیگر بنتو) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <NuxtLink
            v-for="card in smallCards"
            :key="card.id"
            :to="card.href"
            class="group relative rounded-3xl border p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 min-h-[230px] sm:min-h-[240px] cursor-pointer"
            :class="card.bgClass"
          >
            <!-- بخش متنی بالای کارت -->
            <div class="space-y-1.5 text-start relative z-10 max-w-[65%]">
              <h3 class="text-base sm:text-lg font-bold text-ink group-hover:text-rose transition-colors leading-snug">
                {{ card.title }}
              </h3>

              <p class="text-xs text-muted-foreground leading-relaxed">
                {{ card.subtitle }}
              </p>

              <div class="pt-2 flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-rose transition-colors">
                <span>{{ card.ctaText }}</span>
                <ArrowLeft class="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform group-hover:-translate-x-0.5" />
              </div>
            </div>

            <!-- تصویر محصول گوشه پایین کارت به سبک رفرنس Luxora -->
            <div class="absolute bottom-2 inset-e-2 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden pointer-events-none">
              <NuxtImg
                :src="card.image"
                :alt="card.title"
                class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
