<!-- frontend/app/pages/account.vue -->
<script setup lang="ts">
import {
  User,
  Package,
  ShoppingBag,
  Ruler,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from '@lucide/vue'

useSeoMeta({
  title: 'حساب کاربری | کراس',
  description: 'مدیریت حساب، مشاهده تاریخچه سفارش‌ها و دسترسی به خدمات مشتریان کراس',
})

const accountLinks = [
  {
    title: 'پیگیری سفارش‌ها',
    description: 'رهگیری وضعیت مرسوله پستی و سفارش‌های جاری',
    href: '/tracking',
    icon: Package,
  },
  {
    title: 'سبد خرید من',
    description: 'مشاهده اقلام آماده پرداخت و نهایی‌سازی سفارش',
    href: '/cart',
    icon: ShoppingBag,
  },
  {
    title: 'راهنمای اندازه‌گیری و سایز',
    description: 'جدول ابعاد دقیق بدن برای انتخاب سایز متناسب',
    href: '/size-guide',
    icon: Ruler,
  },
  {
    title: 'رویه بازگشت و تعویض ۷ روزه',
    description: 'شرایط تعویض آسان سایز و عودت کالا',
    href: '/returns',
    icon: RotateCcw,
  },
  {
    title: 'پرسش‌های متداول',
    description: 'پاسخ به سوالات پرتکرار درباره جنس، ارسال و ضمانت',
    href: '/faq',
    icon: HelpCircle,
  },
]
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
    <!-- هدر صفحه -->
    <div class="mb-8 border-b border-sand pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-sand/50 text-ink flex items-center justify-center border border-sand">
          <User class="w-7 h-7 text-rose" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            حساب کاربری
          </h1>
          <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
            دسترسی سریع به سفارش‌ها، خدمات مشتریان و تنظیمات کاربری
          </p>
        </div>
      </div>

      <NuxtLink
        to="/shop"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose transition-colors"
      >
        <span>مشاهده فروشگاه</span>
        <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
      </NuxtLink>
    </div>

    <!-- بنر ورود / عضویت به زودی -->
    <div class="rounded-2xl border border-sand bg-white p-6 shadow-2xs space-y-3 mb-8">
      <div class="flex items-center gap-2 text-rose">
        <Sparkles class="w-4 h-4" />
        <h2 class="text-sm font-bold text-ink">
          باشگاه مشتریان و سیستم ورود پیامکی (OTP)
        </h2>
      </div>
      <p class="text-xs text-muted-foreground leading-relaxed max-w-2xl">
        احراز هویت پیامکی و پنل جامع تاریخچه سفارش‌ها در فاز بعدی راه‌اندازی خواهد شد. در حال حاضر می‌توانید از خدمات و بخش‌های زیر استفاده فرمایید.
      </p>
    </div>

    <!-- شبکه‌ای از لینک‌های کاربردی -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="item in accountLinks"
        :key="item.href"
        :to="item.href"
        class="group rounded-2xl border border-sand bg-white p-5 shadow-2xs hover:border-rose/50 hover:shadow-xs transition-all flex items-start gap-3.5"
      >
        <div class="w-10 h-10 rounded-xl bg-sand/30 flex items-center justify-center text-ink group-hover:bg-rose/10 group-hover:text-rose transition-colors shrink-0">
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xs font-bold text-ink group-hover:text-rose transition-colors">
            {{ item.title }}
          </h3>
          <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            {{ item.description }}
          </p>
        </div>
        <ArrowLeft class="w-4 h-4 text-muted-foreground group-hover:text-rose rtl:-scale-x-100 shrink-0 self-center transition-colors" />
      </NuxtLink>
    </div>
  </div>
</template>
