<!-- frontend/app/components/ops/settings/AdminSettingsShippingTab.vue -->
<script setup lang="ts">
import {
  Truck,
  Sparkles,
  ShoppingBag,
  Calendar,
  AlertCircle,
} from '@lucide/vue'
import type { SiteShippingSettings, SiteCheckoutRules } from '~/types/domain'

const shipping = defineModel<SiteShippingSettings>('shipping', { required: true })
const checkoutRules = defineModel<SiteCheckoutRules>('checkoutRules', { required: true })
</script>

<template>
  <div class="space-y-6">
    <!-- بخش ۱: حمل‌ونقل و نوار اعلان -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
          <Truck class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            سیاست‌های حمل‌ونقل و بار اعلان
          </h3>
          <p class="text-xs text-muted-foreground">
            تنظیم حد نصاب‌های ارسال رایگان، نرخ استاندارد و پیام نوار بالای فروشگاه
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="shipping-threshold" class="text-xs font-bold text-ink">
            حد نصاب ارسال رایگان کشوری (تومان)
          </label>
          <input
            id="shipping-threshold"
            v-model.number="shipping.freeShippingThreshold"
            type="number"
            min="0"
            step="50000"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            سفارش‌های با مبلغ بالاتر از این عدد مشمول ارسال رایگان خواهند بود.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="shipping-fee" class="text-xs font-bold text-ink">
            هزینه ثابت ارسال استاندارد (تومان)
          </label>
          <input
            id="shipping-fee"
            v-model.number="shipping.flatShippingFee"
            type="number"
            min="0"
            step="5000"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            هزینه پست پیشتاز کشوری برای سفارش‌های کمتر از حد نصاب رایگان.
          </p>
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="shipping-dispatch-text" class="text-xs font-bold text-ink">
            متن بازه زمانی تحویل مرسوله
          </label>
          <input
            id="shipping-dispatch-text"
            v-model="shipping.estimatedDispatchText"
            type="text"
            placeholder="مثال: ارسال ۲ تا ۴ روز کاری با پست پیشتاز و تیپاکس"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            در صفحه تسویه حساب و دراور سبد خرید به خریدار نمایش داده می‌شود.
          </p>
        </div>
      </div>

      <!-- نوار اعلان سربرگ -->
      <div class="pt-4 border-t border-sand/70 space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <label class="text-xs font-bold text-ink flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-rose" />
              <span>نمایش نوار اعلان بالای سایت (Announcement Bar)</span>
            </label>
            <p class="text-[11px] text-muted-foreground">
              فعال‌سازی نوار ظریف اطلاع‌رسانی در بالاترین بخش هدر فروشگاه
            </p>
          </div>
          <Switch
            :checked="shipping.announcementBarVisible"
            @update:checked="(val: boolean) => shipping.announcementBarVisible = val"
          />
        </div>

        <div v-if="shipping.announcementBarVisible" class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="space-y-1.5">
            <label for="announcement-text" class="text-xs font-bold text-ink">
              متن اصلی اعلان
            </label>
            <input
              id="announcement-text"
              v-model="shipping.announcementBarText"
              type="text"
              placeholder="مثال: ارسال رایگان برای تمام سفارش‌های بالای ۱٫۵۰۰٫۰۰۰ تومان"
              class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
            >
          </div>

          <div class="space-y-1.5">
            <label for="announcement-highlight" class="text-xs font-bold text-ink">
              متن نشان ویژه / هایلایت
            </label>
            <input
              id="announcement-highlight"
              v-model="shipping.announcementBarHighlight"
              type="text"
              placeholder="مثال: ضمانت تعویض تا ۷ روز کاری"
              class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- بخش ۲: قوانین سبد خرید و تسویه حساب -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center text-sage">
          <ShoppingBag class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            قوانین سبد خرید و ثبت نهایی سفارش
          </h3>
          <p class="text-xs text-muted-foreground">
            محدودیت‌های حداقل خرید، تعداد مجاز و مهلت زمان خدمات پس از فروش
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="min-cart-total" class="text-xs font-bold text-ink">
            حداقل مبلغ مجاز برای ثبت سفارش (تومان)
          </label>
          <input
            id="min-cart-total"
            v-model.number="checkoutRules.minCartTotal"
            type="number"
            min="0"
            step="10000"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            اگر مجموع سبد خرید کمتر از این مبلغ باشد، دکمه تسویه حساب فعال نخواهد شد.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="max-item-quantity" class="text-xs font-bold text-ink">
            حداکثر تعداد مجاز از یک کالا در هر سفارش
          </label>
          <input
            id="max-item-quantity"
            v-model.number="checkoutRules.maxItemQuantityPerCart"
            type="number"
            min="1"
            max="50"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            جلوگیری از خریدهای عمده غیرمجاز و احتکار موجودی در دراپ‌ها.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="reservation-timeout" class="text-xs font-bold text-ink">
            زمان رزرو سبد خرید در درگاه پرداخت (دقیقه)
          </label>
          <input
            id="reservation-timeout"
            v-model.number="checkoutRules.reservationTimeoutMinutes"
            type="number"
            min="5"
            max="60"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            مدت زمانی که موجودی کالا برای کاربر در فرآیند پرداخت شاپرک نگه‌داشته می‌شود.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="return-policy-days" class="text-xs font-bold text-ink">
            مهلت ضمانت تعویض و بازگشت (روز)
          </label>
          <input
            id="return-policy-days"
            v-model.number="checkoutRules.returnPolicyDays"
            type="number"
            min="1"
            max="30"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            در فوتر، جزئیات محصول (PDP) و فاکتور به مشتری اعلام می‌گردد.
          </p>
        </div>
      </div>
    </div>

    <!-- بخش ۳: حالت تعطیلات و تعلیق فروشگاه -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-5">
      <div class="flex items-center justify-between border-b border-sand/70 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-clay/15 flex items-center justify-center text-clay">
            <Calendar class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">
              وضعیت تعطیلات و توقف موقت سفارش‌گیری (Holiday Mode)
            </h3>
            <p class="text-xs text-muted-foreground">
              تعلیق موقت ثبت سفارش در ایام تعطیلات رسمی، انبارگردانی یا شرایط اضطراری
            </p>
          </div>
        </div>
        <Switch
          :checked="checkoutRules.holidayModeEnabled"
          @update:checked="(val: boolean) => checkoutRules.holidayModeEnabled = val"
        />
      </div>

      <div v-if="checkoutRules.holidayModeEnabled" class="space-y-2 pt-1">
        <div class="flex items-center gap-2 text-xs font-bold text-clay">
          <AlertCircle class="w-4 h-4" />
          <span>پیام هشدار بنر بالای سایت برای اطلاع خریداران</span>
        </div>
        <input
          v-model="checkoutRules.holidayNoticeText"
          type="text"
          placeholder="مثال: فروشگاه به دلیل انبارگردانی تا ۱۵ فروردین امکان ارسال سفارش ندارد."
          class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
        >
      </div>
    </div>
  </div>
</template>

