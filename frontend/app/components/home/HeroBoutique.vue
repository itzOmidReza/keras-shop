<!-- frontend/app/components/home/HeroBoutique.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ArrowLeft,
} from '@lucide/vue'
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
    <!-- کادر اصلی بخش هیرو با گرادیان ملایم و حاشیه مینیمال -->
    <div class="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-sand/80 bg-gradient-to-b from-sand/30 via-paper to-white p-6 sm:p-10 lg:p-14 shadow-2xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- ستون متنی و اکشن‌ها (در RTL سمت راست) -->
        <div class="lg:col-span-7 space-y-6 text-start">
          <!-- برچسب دراپ فصلی و تیراژ محدود -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/60 border border-sand text-ink text-xs font-bold shadow-2xs">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>طراحی اختصاصی • تیراژ محدود پاییز ۱۴۰۵</span>
          </div>

          <!-- عنوان پرصلابت ادیتوریال -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.18] sm:leading-[1.15]">
            استایل منحصربه‌فرد
            <span class="text-rose"> پاییز </span>
            خود را بسازید
          </h1>

          <!-- توضیحات کوتاه با اشاره به الیاف طبیعی -->
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            تلفیق پارچه‌های الیاف طبیعی، بافت‌های مرینوس و ابریشم خالص با الگوهای مدرن برای بانوان آگاه.
          </p>

          <!-- دکمه‌های CTA و نشان اصالت دست‌دوز آتلیه کراس -->
          <div class="space-y-5 pt-2">
            <div class="flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/shop?season=fall-1405"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-7 py-3.5 text-xs sm:text-sm font-bold text-paper hover:bg-rose transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>مشاهده کالکشن پاییز</span>
                <ArrowLeft class="w-4 h-4" />
              </NuxtLink>

              <NuxtLink
                to="/shop?division=accessories"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/80 hover:bg-sand/30 px-6 py-3.5 text-xs sm:text-sm font-bold text-ink transition-all active:scale-95 cursor-pointer"
              >
                <span>اکسسوری و شال‌ها</span>
              </NuxtLink>
            </div>

            <!-- بج اصالت آتلیه کراس به جای سوشال پروف ساختگی -->
            <div class="flex items-center gap-2.5 pt-1 text-xs text-muted-foreground">
              <span class="w-2 h-2 rounded-full bg-rose animate-pulse" />
              <span class="font-medium text-ink">کالکشن دست‌دوز استودیو کراس • نسخه محدود پاییز ۱۴۰۵</span>
            </div>
          </div>
        </div>

        <!-- ستون بصری پرتره مدل با پس‌زمینه ارگانیک و استایل لوکس پاییزه (در RTL سمت چپ) -->
        <div class="lg:col-span-5 relative flex justify-center">
          <!-- قاب ارگانیک پشت تصویر مدل -->
          <div class="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[2.5rem] bg-sand/50 p-3 sm:p-4 border border-sand/80 shadow-sm">
            <div class="w-full h-full rounded-[2rem] overflow-hidden bg-white/70 relative">
              <NuxtImg
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
                alt="مدل کالکشن پاییز ۱۴۰۵ کراس با پالتوی پشمی و بافت لوکس"
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
    </div>
  </section>
</template>
