<!-- frontend/app/components/home/PromoBannerTwo.vue -->
<script setup lang="ts">
import { ArrowLeft, ShieldCheck, Feather } from '@lucide/vue'
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <!-- کادر اصلی بنر با طراحی دو ستونه الهام‌گرفته از رفرنس ChicWave -->
    <div class="relative overflow-hidden rounded-3xl border border-sand/80 bg-gradient-to-r from-paper via-sand/20 to-paper p-6 sm:p-10 lg:p-12 shadow-2xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- ستون بصری بافت پارچه طبیعی و استایل (در RTL سمت راست) -->
        <div class="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[4/3] bg-sand/40 border border-sand/70 shadow-xs">
          <NuxtImg
            src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80"
            alt="بافت‌های طبیعی و منسوجات پاییزه کراس"
            class="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />

          <!-- پلاک شناور اصالت متریال -->
          <div class="absolute bottom-3 inset-s-3 rounded-xl bg-paper/90 backdrop-blur-md px-3 py-1.5 border border-sand/70 text-[10px] font-bold text-ink shadow-2xs flex items-center gap-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-sage" />
            <span>گواهی اصالت الیاف OEKO-TEX</span>
          </div>
        </div>

        <!-- ستون متن و فلسفه پارچه (در RTL سمت چپ) -->
        <div class="lg:col-span-7 space-y-5 text-start">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 border border-sand text-ink text-xs font-bold shadow-2xs">
            <Feather class="w-3.5 h-3.5 text-rose" />
            <span>فلسفه دوخت و الیاف طبیعی</span>
          </div>

          <div class="space-y-2">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight leading-snug">
              هنر دوخت و پارچه‌های تنفس‌پذیر — پاییز ۱۴۰۵
            </h2>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              تمامی قطعات کالکشن پاییز کراس از الیاف ۱۰۰٪ طبیعی لینن اسلپ، پشم مرینوس ارگانیک و ابریشم خالص بافته شده‌اند. ساختار متراکم و در عین حال تنفس‌پذیر منسوجات کراس، دوام مادام‌العمر و لطافت بی‌نظیر را به پوست شما هدیه می‌دهد.
            </p>
          </div>

          <!-- مشخصه‌های متمایز کننده الیاف -->
          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-sand/70 max-w-md">
            <div class="space-y-0.5">
              <span class="text-xs font-bold text-ink">تنفس‌پذیری طبیعی</span>
              <p class="text-[11px] text-muted-foreground">جلوگیری از تعریق و حساسیت پوستی</p>
            </div>
            <div class="space-y-0.5">
              <span class="text-xs font-bold text-ink">دوخت مزونی مقاوم</span>
              <p class="text-[11px] text-muted-foreground">دوخت تمیز دو ردیفه بدون پرزدهی</p>
            </div>
          </div>

          <!-- دکمه CTA به صفحه استانداردهای پارچه -->
          <div class="pt-2">
            <NuxtLink
              to="/fabric-standards"
              class="inline-flex items-center gap-2 rounded-2xl border border-sand bg-white hover:bg-sand/30 px-6 py-3 text-xs sm:text-sm font-bold text-ink transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <span>بررسی استانداردهای پارچه و دوخت</span>
              <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
