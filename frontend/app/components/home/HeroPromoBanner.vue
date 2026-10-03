<!-- frontend/app/components/home/HeroPromoBanner.vue -->
<script setup lang="ts">
import { Sparkles, ArrowLeft, Copy, Check, ShieldCheck, Zap } from '@lucide/vue'
import { toast } from 'vue-sonner'

const promoCode = 'KERAS-PRO'
const isCopied = ref(false)

const copyVoucher = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(promoCode)
    }
    isCopied.value = true
    toast.success('کد تخفیف کپی شد')
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch {
    toast.error('امکان کپی خودکار فراهم نشد.')
  }
}
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl bg-ink text-paper border border-sand/30 shadow-sm mx-4 sm:mx-6 lg:mx-8 my-6">
    <!-- پس‌زمینه تصویر و گرادیان پوششی -->
    <div class="absolute inset-0 z-0">
      <NuxtImg
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80"
        alt="کالکشن تخصصی چهارفصل و اکسسوری کراس"
        class="h-full w-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
        loading="eager"
        fetchpriority="high"
      />
      <!-- لایه‌های گرادیان برای تضمین خوانایی متن در حالت RTL -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent sm:bg-gradient-to-e sm:from-ink sm:via-ink/80 sm:to-transparent" />
    </div>

    <!-- محتوای متنی و تعاملی بنر -->
    <div class="relative z-10 container mx-auto px-6 py-16 sm:py-24 lg:py-28 max-w-5xl">
      <div class="max-w-2xl space-y-6 text-start">
        <!-- بج معرفی دراپ فصلی -->
        <div class="inline-flex items-center gap-2 rounded-full bg-paper/10 backdrop-blur-md px-3.5 py-1.5 border border-paper/20 shadow-xs">
          <Sparkles class="h-3.5 w-3.5 text-rose" />
          <span class="text-xs font-bold text-paper">دراپ پاییز ۱۴۰۵ | کالکشن جدید ادیتوریال</span>
        </div>

        <!-- عنوان اصلی کمپین -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper leading-[1.15] sm:leading-[1.15]">
          تلاقی ظرافت مدرن و استایل چهارفصل
        </h1>

        <!-- توضیحات کوتاه -->
        <p class="text-sm sm:text-base leading-relaxed text-sand/90 max-w-xl">
          کالکشن جدید کراس با تلفیق شومیزهای لینن، بافت‌های چندلایه پشمی، پالتوهای فوتر و اکسسوری‌های دست‌ساز؛ امضای استایل مینیمال شما برای تمام فصول.
        </p>

        <!-- باکس کوپن تخفیف تعاملی (Interactive Voucher Pill) -->
        <div class="pt-1">
          <div class="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-paper/15 backdrop-blur-md border border-paper/25 p-2 sm:p-2.5 shadow-xs">
            <div class="flex items-center gap-2 px-2 text-xs text-sand">
              <Zap class="w-4 h-4 text-rose animate-pulse" />
              <span>کد تخفیف ۱۵٪ اولین خرید:</span>
            </div>

            <div class="flex items-center gap-1.5 bg-paper text-ink px-3 py-1.5 rounded-xl font-mono font-bold text-xs">
              <span>{{ promoCode }}</span>
              <button
                type="button"
                class="ms-1 p-1 rounded-md text-ink hover:text-rose hover:bg-sand/30 transition-colors cursor-pointer"
                :title="isCopied ? 'کپی شد' : 'کپی کد تخفیف'"
                @click="copyVoucher"
              >
                <Check v-if="isCopied" class="w-3.5 h-3.5 text-sage" />
                <Copy v-else class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- دکمه‌های فراخوان به اقدام ۲ گانه (Dual CTA Buttons) -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <NuxtLink
            to="/shop?season=fall-1405"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-rose px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-rose/90 transition-all cursor-pointer active:scale-95"
          >
            <span>کالکشن جدید (پاییز ۱۴۰۵)</span>
            <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
          </NuxtLink>

          <NuxtLink
            to="/shop?division=accessories"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-paper/40 bg-paper/10 backdrop-blur-xs px-6 py-3.5 text-xs sm:text-sm font-bold text-paper hover:bg-paper hover:text-ink transition-all cursor-pointer active:scale-95"
          >
            <span>اکسسوری و شال</span>
          </NuxtLink>
        </div>

        <!-- شاخص‌های اعتماد زیر دکمه‌ها -->
        <div class="flex flex-wrap items-center gap-5 pt-4 text-[11px] text-sand/80 border-t border-paper/15">
          <div class="flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-sage" />
            <span>پارچه‌های طبیعی و دوخت مزونی</span>
          </div>
          <span class="text-paper/30">•</span>
          <div class="flex items-center gap-1.5">
            <span>ارسال اکسپرس سراسری</span>
          </div>
          <span class="text-paper/30">•</span>
          <div class="flex items-center gap-1.5">
            <span>۷ روز ضمانت تعویض و مرجوعی</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
