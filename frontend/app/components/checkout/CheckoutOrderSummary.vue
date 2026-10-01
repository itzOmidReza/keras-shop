<!-- frontend/app/components/checkout/CheckoutOrderSummary.vue -->
<script setup lang="ts">
import { ShieldCheck, RotateCcw, PackageCheck } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-5">
    <div class="flex items-center justify-between border-b border-sand/70 pb-3">
      <h2 class="text-base font-bold text-ink">
        خلاصه سفارش
      </h2>
      <span class="text-xs font-bold text-rose bg-rose/10 px-2 py-0.5 rounded-full">
        {{ cartStore.itemCount }} کالا
      </span>
    </div>

    <!-- پیش‌نمایش اقلام سفارش -->
    <div class="max-h-60 overflow-y-auto divide-y divide-sand/50 pe-1 space-y-3">
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="flex items-center gap-3 pt-3 first:pt-0"
      >
        <div class="relative aspect-4/5 w-12 h-15 rounded-lg overflow-hidden bg-sand/30 shrink-0 border border-sand/60">
          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <span
            class="absolute top-0.5 inset-s-0.5 min-w-4 h-4 px-1 rounded-full bg-ink/80 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ item.quantity }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-ink truncate">
            {{ item.title }}
          </h4>
          <p class="text-[11px] text-muted-foreground mt-0.5">
            سایز: {{ item.size }}
            <span v-if="item.color"> | {{ item.color }}</span>
          </p>
          <p class="text-xs font-bold text-ink mt-1">
            {{ formatToman(item.price * item.quantity) }}
          </p>
        </div>
      </div>
    </div>

    <!-- مبالغ و صورت‌حساب نهایی -->
    <div class="space-y-3 text-xs border-t border-sand/70 pt-4">
      <div class="flex items-center justify-between text-muted-foreground">
        <span>مجموع اقلام</span>
        <span>{{ formatToman(cartStore.subtotal) }}</span>
      </div>

      <div
        v-if="cartStore.discountTotal > 0"
        class="flex items-center justify-between text-rose font-medium"
      >
        <span>تخفیف محصولات</span>
        <span>{{ formatToman(cartStore.discountTotal) }}-</span>
      </div>

      <div
        v-if="cartStore.couponDiscount > 0"
        class="flex items-center justify-between text-sage font-medium"
      >
        <span>تخفیف کوپن ({{ cartStore.appliedCoupon?.code }})</span>
        <span>{{ formatToman(cartStore.couponDiscount) }}-</span>
      </div>

      <div class="flex items-center justify-between text-muted-foreground">
        <span>هزینه ارسال</span>
        <span v-if="cartStore.shippingEstimate === 0" class="font-bold text-sage">
          رایگان
        </span>
        <span v-else>
          {{ formatToman(cartStore.shippingEstimate) }}
        </span>
      </div>

      <div class="border-t border-sand pt-3 flex items-center justify-between text-sm font-bold text-ink">
        <span>مبلغ نهایی سفارش</span>
        <PriceTag :price="cartStore.finalTotal" size="lg" />
      </div>
    </div>

    <!-- ضمانت‌های اصالت -->
    <div class="border-t border-sand/60 pt-4 space-y-2 text-[11px] text-muted-foreground">
      <div class="flex items-center gap-2">
        <PackageCheck class="w-4 h-4 text-sage shrink-0" />
        <span>بسته‌بندی ویژه و اختصاصی کراس با الیاف دوستدار محیط‌زیست</span>
      </div>
      <div class="flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-rose shrink-0" />
        <span>تضمین امنیت پرداخت و حفظ حریم اطلاعات خریداران</span>
      </div>
      <div class="flex items-center gap-2">
        <RotateCcw class="w-4 h-4 text-ink shrink-0" />
        <span>ضمانت ۷ روزه تعویض بدون قید و شرط سایز</span>
      </div>
    </div>
  </div>
</template>
