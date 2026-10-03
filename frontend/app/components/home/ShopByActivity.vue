<!-- frontend/app/components/home/ShopByActivity.vue -->
<script setup lang="ts">
import { ArrowLeft, Sparkles, Wind, Coffee, Shirt } from '@lucide/vue'

interface ActivityCard {
  id: string
  title: string
  subtitle: string
  techBadge: string
  href: string
  image: string
  icon: typeof Sparkles
}

const activities: ActivityCard[] = [
  {
    id: 'fall-editorial',
    title: 'استایل ادیتوریال پاییزه',
    subtitle: 'پالتوهای فوتر، ترنچ کت‌های بارانی و شلوارهای واید لینن برای پاییز',
    techBadge: 'پاییز ۱۴۰۵ • کالکشن جدید',
    href: '/shop?season=fall-1405',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
  },
  {
    id: 'winter-warmth',
    title: 'بافت و لایه‌لایه زمستانه',
    subtitle: 'پلیورهای پشمی، ژاکت‌های بافت کشمیر و پالتوهای گرم برای زمستان',
    techBadge: 'زمستان ۱۴۰۵ • الیاف پشمی و کشمیر',
    href: '/shop?season=winter-1405',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    icon: Wind,
  },
  {
    id: 'accessories-craft',
    title: 'اکسسوری، اسکرانچی و شال',
    subtitle: 'دستمال سرهای ژاکارد، اسکرانچی‌های ابریشم طبیعی و شال‌های دست‌دوز',
    techBadge: 'اکسسوری • دست‌دوز و ابریشم طبیعی',
    href: '/shop?division=accessories',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    icon: Coffee,
  },
  {
    id: 'minimal-everyday',
    title: 'شومیز و استایل روزمره',
    subtitle: 'شومیزهای لینن اسلپ، تیشرت‌های پنبه سوپر شانه و پیراهن‌های دکمه‌دار',
    techBadge: 'پوشاک پایه • لینن اسلپ و پنبه ارگانیک',
    href: '/shop?category=shirts-blouses',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
    icon: Shirt,
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="space-y-8">
      <!-- هدر بخش تناسب موقعیت و فصل -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-rose">
            انتخاب هوشمند بر اساس موقعیت و فصل
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            خرید بر اساس فصل و سبک استایل
          </h2>
        </div>

        <p class="text-xs sm:text-sm text-muted-foreground max-w-md text-start leading-relaxed">
          تلفیق پارچه‌های الیاف طبیعی، برش‌های ارگونومیک و اکسسوری‌های مکمل برای هر فصل از سال.
        </p>
      </div>

      <!-- شبکه ۴ تایی کارت‌های فعالیت -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <NuxtLink
          v-for="act in activities"
          :key="act.id"
          :to="act.href"
          class="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-sand/60 shadow-xs flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-md"
        >
          <!-- تصویر پس‌زمینه با افکت زوم هاور -->
          <NuxtImg
            :src="act.image"
            :alt="act.title"
            class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          <!-- گرادیان عمودی برای تضمین کنتراست متن -->
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

          <!-- محتوای کارت روی تصویر -->
          <div class="relative z-10 space-y-3 text-start">
            <!-- بج فنی پارچه -->
            <div class="inline-flex items-center gap-1.5 rounded-full bg-paper/20 backdrop-blur-md px-3 py-1 border border-paper/30 text-[10px] font-bold text-paper">
              <component :is="act.icon" class="w-3.5 h-3.5 text-rose" />
              <span>{{ act.techBadge }}</span>
            </div>

            <!-- عنوان فعالیت -->
            <h3 class="text-lg font-bold text-paper leading-snug group-hover:text-rose transition-colors">
              {{ act.title }}
            </h3>

            <!-- توضیح فیزیولوژیک -->
            <p class="text-xs text-sand/80 leading-relaxed line-clamp-2">
              {{ act.subtitle }}
            </p>

            <!-- لینک و پیکان اقدام -->
            <div class="pt-1 flex items-center gap-1.5 text-xs font-bold text-paper group-hover:text-rose transition-colors">
              <span>مشاهده محصولات این دسته‌بندی</span>
              <ArrowLeft class="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
