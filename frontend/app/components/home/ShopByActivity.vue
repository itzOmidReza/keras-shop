<!-- frontend/app/components/home/ShopByActivity.vue -->
<script setup lang="ts">
import { ArrowLeft, Dumbbell, Sparkles, Wind, Coffee } from '@lucide/vue'

interface ActivityCard {
  id: string
  title: string
  subtitle: string
  techBadge: string
  href: string
  image: string
  icon: typeof Dumbbell
}

const activities: ActivityCard[] = [
  {
    id: 'heavy-training',
    title: 'تمرینات سنگین و بدنسازی',
    subtitle: 'نگه‌دارندگی حداکثری عضلات در اسکات، ددلیفت و تمرینات پرفشار بدنسازی',
    techBadge: 'Move Line • ۳۰۰ گرمی ضد دید (Squat-Proof)',
    href: '/shop?line=move',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    icon: Dumbbell,
  },
  {
    id: 'yoga-pilates',
    title: 'یوگا، پیلاتس و ریکاوری',
    subtitle: 'بافت بدون درز با حس سبکی و لطافت ابریشمی برای جریان آزاد حرکات کششی',
    techBadge: 'Calm Line • ۲۲۰ گرمی حس پوست دوم',
    href: '/shop?line=calm',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
  },
  {
    id: 'running-cardio',
    title: 'دویدن و تمرینات هوازی',
    subtitle: 'انتقال سریع حرارت و رطوبت با ساختار مهندسی‌شده الیاف تنفس‌پذیر میکروفیبر',
    techBadge: 'High Breathability • تخلیه فوق سریع رطوبت',
    href: '/shop?category=running',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    icon: Wind,
  },
  {
    id: 'lifestyle-athleisure',
    title: 'استایل ورزشی شهری و روزمره',
    subtitle: 'زیبایی مینیمال ادیتوریال مناسب خیابان، کافه و ریکاوری با حداکثر راحتی',
    techBadge: 'Athleisure • طراحی ارگونومیک تمام روز',
    href: '/shop?category=lifestyle',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    icon: Coffee,
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="space-y-8">
      <!-- هدر بخش تناسب فیزیولوژیک و رشته ورزشی -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-rose">
            انتخاب هوشمند بر اساس نوع تمرین
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            خرید بر اساس فعالیت ورزشی
          </h2>
        </div>

        <p class="text-xs sm:text-sm text-muted-foreground max-w-md text-start leading-relaxed">
          هر بافت و گرماژ پارچه در کراس برای هدف مکانیکی مشخصی مهندسی شده است. بر اساس رشته ورزشی خود بپوشید.
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
              <span>مشاهده محصولات این رشته</span>
              <ArrowLeft class="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
