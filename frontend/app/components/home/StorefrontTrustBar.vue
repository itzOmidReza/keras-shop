<!-- frontend/app/components/home/StorefrontTrustBar.vue -->
<script setup lang="ts">
import { RotateCcw, ShieldCheck, Truck, CreditCard } from '@lucide/vue'

const trustPillars = [
  {
    id: 'returns',
    icon: RotateCcw,
    title: '۷ روز ضمانت تعویض سایز و مرجوعی',
    description: 'بدون قید و شرط به همراه پشتیبانی کانسیرژ اختصاصی کراس',
    badge: 'آسودگی خرید',
  },
  {
    id: 'quality',
    icon: ShieldCheck,
    title: 'الیاف طبیعی و ضمانت کیفیت بافت',
    description: 'کنترل کیفی اصالت نخ، تراکم الیاف ارگانیک و دوخت مزونی',
    badge: 'تضمین متریال',
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'بسته‌بندی ادیتوریال و ارسال اکسپرس',
    description: 'تحویل در بسته‌بندی هدیه مینیمال و ارسال سریع سراسری',
    badge: 'ارسال سریع',
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'پرداخت امن شتاب با تاییدیه آنی شاپرک',
    description: 'تسویه مطمئن تحت شبکه شاپرک با صدور آنی کد رهگیری بانکی',
    badge: 'درگاه رسمی',
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="rounded-3xl border border-sand/80 bg-white p-6 sm:p-8 shadow-2xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse divide-sand/60">
        <div
          v-for="pillar in trustPillars"
          :key="pillar.id"
          class="flex flex-col items-center sm:items-start text-center sm:text-start gap-3 pt-6 sm:pt-0 sm:px-4 first:pt-0 first:px-0"
        >
          <div class="w-12 h-12 rounded-2xl bg-rose/10 text-rose flex items-center justify-center shrink-0 shadow-2xs">
            <component :is="pillar.icon" class="w-6 h-6" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h3 class="text-sm font-bold text-ink">
                {{ pillar.title }}
              </h3>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ pillar.description }}
            </p>
          </div>

          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand/40 text-ink/80">
            {{ pillar.badge }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
