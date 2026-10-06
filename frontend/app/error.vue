<!-- frontend/app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'
import { ArrowLeft, Compass, BookOpen, ShoppingBag, Home } from '@lucide/vue'
import { toFa } from '~/utils/format'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => {
  if (is404.value) {
    return 'صفحه مورد نظر در آتلیه کراس یافت نشد'
  }
  return 'خطایی در پردازش درخواست رخ داده است'
})

const description = computed(() => {
  if (is404.value) {
    return 'مسیری که به دنبال آن هستید ممکن است تغییر کرده، حذف شده یا موقتاً در دسترس نباشد. برای ادامه کاوش، می‌توانید به بخش‌های زیر سر بزنید.'
  }
  return props.error.statusMessage || props.error.message || 'متأسفانه در اتصال به سامانه مشکلی پیش آمده است. لطفاً لحظاتی دیگر تلاش فرمایید.'
})

const handleClear = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink flex flex-col justify-between selection:bg-rose/20 selection:text-rose font-sans" dir="rtl">
    <!-- هدر مینیمال -->
    <header class="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-sand/40">
      <NuxtLink to="/" class="inline-flex items-center gap-2 group cursor-pointer">
        <span class="w-8 h-8 rounded-xl bg-sand/50 text-rose border border-sand flex items-center justify-center font-bold text-sm tracking-widest shadow-2xs group-hover:scale-105 transition-transform">
          ک
        </span>
        <span class="text-base font-bold text-ink tracking-tight font-display">
          کراس <span class="text-xs text-muted-foreground font-mono font-normal">| Keras</span>
        </span>
      </NuxtLink>

      <button
        type="button"
        class="text-xs font-bold text-muted-foreground hover:text-rose transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        @click="handleClear"
      >
        <Home class="w-3.5 h-3.5" />
        <span>صفحه نخست</span>
      </button>
    </header>

    <!-- کادر اصلی بازیابی خطا -->
    <main class="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-2xl text-center space-y-8">
      <!-- نشانگر خطای ادیتوریال -->
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/40 text-rose border border-sand text-xs font-bold shadow-2xs">
          <Compass class="w-3.5 h-3.5" />
          <span>راهنمای ناوبری آتلیه کراس</span>
        </div>

        <div class="relative py-2">
          <div class="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-sand/60 select-none">
            {{ toFa(error.statusCode || 404) }}
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-2">
            {{ title }}
          </h1>
        </div>

        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          {{ description }}
        </p>
      </div>

      <!-- دکمه‌های اقدام و ریکاوری -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <NuxtLink
          to="/shop"
          class="w-full sm:w-auto h-12 px-7 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
        >
          <ShoppingBag class="w-4 h-4" />
          <span>مشاهده تمامی محصولات</span>
          <ArrowLeft class="w-3.5 h-3.5 opacity-80" />
        </NuxtLink>

        <NuxtLink
          to="/journal"
          class="w-full sm:w-auto h-12 px-6 rounded-xl border border-sand bg-white hover:bg-sand/30 text-ink font-bold text-xs inline-flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <BookOpen class="w-4 h-4 text-rose" />
          <span>مطالعه ژورنال و روایات استایل</span>
        </NuxtLink>

        <button
          type="button"
          class="w-full sm:w-auto h-12 px-5 rounded-xl border border-sand/70 bg-sand/20 hover:bg-sand/50 text-ink font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          @click="handleClear"
        >
          <Home class="w-4 h-4 text-sand" />
          <span>بازگشت به خانه</span>
        </button>
      </div>

      <!-- راه‌های پشتیبانی و تماس -->
      <div class="pt-8 border-t border-sand/60 text-xs text-muted-foreground">
        <span>نیاز به راهنمایی بیشتر دارید؟ </span>
        <NuxtLink to="/contact" class="font-bold text-rose hover:underline underline-offset-4">
          ارتباط با پشتیبانی و امور مشتریان
        </NuxtLink>
      </div>
    </main>

    <!-- فوتر مینیمال -->
    <footer class="container mx-auto px-4 sm:px-6 py-6 text-center text-[11px] text-muted-foreground/80 border-t border-sand/40">
      <span>© تمامی حقوق متعلق به کراس است. طراحی و توسعه تخصصی آتلیه مد و سبک زندگی.</span>
    </footer>
  </div>
</template>
