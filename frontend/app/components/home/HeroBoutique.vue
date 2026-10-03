<!-- frontend/app/components/home/HeroBoutique.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ArrowLeft,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from '@lucide/vue'

const trustBadges = [
  {
    icon: Truck,
    title: 'ارسال اکسپرس',
    description: 'تحویل سریع سراسری',
  },
  {
    icon: RotateCcw,
    title: '۷ روز ضمانت بازگشت',
    description: 'تعویض بدون قید و شرط',
  },
  {
    icon: ShieldCheck,
    title: 'پرداخت امن شاپرک',
    description: 'تاییدیه آنی بانکی',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی کانسیرژ',
    description: 'مشاوره استایلینگ',
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
    <!-- کادر اصلی بخش هیرو با گرادیان ملایم و حاشیه مینیمال -->
    <div class="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-sand/80 bg-gradient-to-b from-sand/30 via-paper to-white p-6 sm:p-10 lg:p-14 shadow-2xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- ستون متنی و اکشن‌ها (در RTL سمت راست) -->
        <div class="lg:col-span-7 space-y-6 text-start">
          <!-- برچسب دراپ فصلی -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/60 border border-sand text-ink text-xs font-bold shadow-2xs">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>کالکشن جدید پاییز ۱۴۰۵</span>
          </div>

          <!-- عنوان پرصلابت ادیتوریال -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.18] sm:leading-[1.15]">
            استایل منحصربه‌فرد
            <span class="text-rose"> پاییز </span>
            خود را بسازید
          </h1>

          <!-- توضیحات کوتاه با اشاره به الیاف طبیعی -->
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            کالکشن پاییز ۱۴۰۵ کراس؛ تلفیق وقار، دوخت مینیمال و لطافت منسوجات طبیعی لینن اسلپ، بافت‌های چندلایه کشمیر و ابریشم خالص برای زنانی که به اصالت پوشش اهمیت می‌دهند.
          </p>

          <!-- دکمه CTA و سوشال پروف -->
          <div class="space-y-6 pt-2">
            <div class="flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/shop?season=fall-1405"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-7 py-3.5 text-xs sm:text-sm font-bold text-paper hover:bg-rose transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>مشاهده و خرید کالکشن</span>
                <ArrowLeft class="w-4 h-4" />
              </NuxtLink>

              <NuxtLink
                to="/shop?division=accessories"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/80 hover:bg-sand/30 px-6 py-3.5 text-xs sm:text-sm font-bold text-ink transition-all active:scale-95 cursor-pointer"
              >
                <span>اکسسوری و شال‌ها</span>
              </NuxtLink>
            </div>

            <!-- ویجت تایید اجتماعی (Social Proof Widget) بر اساس رفرنس Luxora & ChicWave -->
            <div class="flex items-center gap-4 pt-1">
              <!-- کلاستر آواتار خریداران -->
              <div class="flex items-center -space-x-2 rtl:space-x-reverse">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="مشتری راضی کراس"
                  class="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
                >
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="مشتری راضی کراس"
                  class="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
                >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="مشتری راضی کراس"
                  class="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
                >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="مشتری راضی کراس"
                  class="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
                >
              </div>

              <!-- ریتینگ و تعداد مشتریان -->
              <div class="space-y-0.5 text-start">
                <div class="flex items-center gap-1">
                  <div class="flex items-center text-amber-400">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      class="w-3.5 h-3.5 fill-amber-400"
                    />
                  </div>
                  <span class="text-xs font-bold text-ink">۴.۹</span>
                </div>
                <p class="text-xs text-muted-foreground font-medium">
                  بیش از ۲۰ هزار مشتری راضی
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ستون بصری پرتره مدل با پس‌زمینه ارگانیک (در RTL سمت چپ) -->
        <div class="lg:col-span-5 relative flex justify-center">
          <!-- قاب ارگانیک پشت تصویر مدل -->
          <div class="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[2.5rem] bg-sand/50 p-3 sm:p-4 border border-sand/80 shadow-sm">
            <div class="w-full h-full rounded-[2rem] overflow-hidden bg-white/70 relative">
              <NuxtImg
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                alt="مدل کالکشن پاییز ۱۴۰۵ کراس"
                class="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                loading="eager"
                fetchpriority="high"
              />

              <!-- نشانگر ادیتوریال فصلی گوشه تصویر -->
              <div class="absolute bottom-4 inset-s-4 rounded-xl bg-paper/90 backdrop-blur-md px-3.5 py-2 border border-sand/70 text-start shadow-xs">
                <span class="block text-[10px] text-muted-foreground font-medium">طراحی کپسولی</span>
                <span class="block text-xs font-bold text-ink">پاییز ۱۴۰۵ • Fall Drop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- نوار اطمینان کوچک زیر هیرو (Trust Micro-Bar بر اساس رفرنس Luxora) -->
      <div class="mt-8 sm:mt-12 pt-6 border-t border-sand/70">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="badge in trustBadges"
            :key="badge.title"
            class="flex items-center gap-3 text-start"
          >
            <div class="w-10 h-10 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
              <component :is="badge.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-ink">
                {{ badge.title }}
              </h3>
              <p class="text-[11px] text-muted-foreground">
                {{ badge.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
