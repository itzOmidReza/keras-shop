<!-- frontend/app/pages/cart.vue -->
<script setup lang="ts">
import {
  ShoppingBag,
  Truck,
  ArrowLeft,
  Trash2,
  Sparkles,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import CartItemRow from '~/components/cart/CartItemRow.vue'
import CartOrderSummary from '~/components/cart/CartOrderSummary.vue'

useSeoMeta({
  title: 'سبد خرید | کراس',
  description: 'مدیریت و تسویه اقلام افزوده شده به سبد خرید پوشاک ورزشی کراس',
})

const cartStore = useCartStore()
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- هدر صفحه و عنوان ادیتوریال -->
    <div class="mb-8 border-b border-sand pb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          سبد خرید شما
        </h1>
        <p class="text-xs sm:text-sm text-muted-foreground mt-1">
          بررسی نهایی، تغییر تعداد و اعمال کدهای تخفیف اختصاصی کراس
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="hidden sm:flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose transition-colors"
      >
        <span>ادامه خرید از کاتالوگ</span>
        <ArrowLeft class="w-4 h-4" />
      </NuxtLink>
    </div>

    <!-- وضعیت در حال هیدراتاسیون جهت جلوگیری از پرش صفحه -->
    <div v-if="!cartStore.isHydrated" class="py-20 text-center space-y-3">
      <div class="w-10 h-10 border-2 border-sand border-t-rose rounded-full animate-spin mx-auto" />
      <p class="text-xs text-muted-foreground font-medium">در حال بازیابی سبد خرید شما...</p>
    </div>

    <!-- حالت وجود کالا در سبد -->
    <div v-else-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- ستون راست: لیست اقلام سبد خرید -->
      <div class="lg:col-span-8 space-y-6">
        <!-- نوار پیشرفت ارسال رایگان -->
        <div class="rounded-2xl border border-sand bg-white p-4 sm:p-5 shadow-2xs space-y-3">
          <div class="flex items-center justify-between text-xs sm:text-sm">
            <div
              class="flex items-center gap-2 font-bold"
              :class="cartStore.isFreeShipping ? 'text-sage' : 'text-ink'"
            >
              <Truck
                class="w-5 h-5"
                :class="cartStore.isFreeShipping ? 'text-sage' : 'text-rose'"
              />
              <span v-if="cartStore.isFreeShipping">
                تبریک! سفارش شما مشمول ارسال رایگان سراسری شد 🎉
              </span>
              <span v-else>
                تنها {{ formatToman(cartStore.amountNeededForFreeShipping) }} دیگر تا ارسال رایگان کشوری
              </span>
            </div>
            <span class="text-xs font-bold text-muted-foreground">
              {{ cartStore.freeShippingProgress }}٪
            </span>
          </div>

          <div class="h-2 w-full rounded-full bg-sand/60 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="cartStore.isFreeShipping ? 'bg-sage' : 'bg-rose'"
              :style="{ width: `${cartStore.freeShippingProgress}%` }"
            />
          </div>
        </div>

        <!-- کارت فهرست اقلام -->
        <div class="rounded-2xl border border-sand bg-white p-4 sm:p-6 shadow-2xs divide-y divide-sand/60">
          <CartItemRow
            v-for="item in cartStore.items"
            :key="item.id"
            :item="item"
          />
        </div>

        <!-- کنترل‌های پایین لیست اقلام -->
        <div class="flex items-center justify-between pt-2">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-rose transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>افزودن محصولات بیشتر به سبد</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose transition-colors cursor-pointer"
            @click="cartStore.clearCart()"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>خالی کردن کل سبد</span>
          </button>
        </div>
      </div>

      <!-- ستون چپ (در RTL استیکی): خلاصه سفارش و ثبت کوپن -->
      <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        <CartOrderSummary />
      </div>
    </div>

    <!-- حالت خالی بودن سبد خرید -->
    <div
      v-else
      class="max-w-xl mx-auto rounded-3xl border border-sand bg-white p-8 sm:p-12 text-center space-y-6 shadow-xs my-8"
    >
      <div class="w-20 h-20 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-rose">
        <ShoppingBag class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-bold text-ink">
          سبد خرید شما در حال حاضر خالی است
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          محصولات تمرینی و کالکشن‌های اختصاصی آرامش و حرکت کراس را مشاهده کنید و استایل ورزشی خود را بسازید.
        </p>
      </div>

      <div class="pt-2">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 text-white font-bold text-sm h-12 px-8 rounded-xl shadow-xs transition-all"
        >
          <Sparkles class="w-4 h-4" />
          <span>مشاهده کاتالوگ فروشگاه</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
