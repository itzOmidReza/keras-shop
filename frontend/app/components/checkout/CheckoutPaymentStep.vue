<script setup lang="ts">
import {
  Truck,
  Zap,
  CreditCard,
  Building,
  ArrowRight,
  Lock,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useSiteSettings } from '~/composables/useSiteSettings'
import type { ShippingMethod, PaymentMethod } from '~/types/domain'

defineProps<{
  selectedShipping: ShippingMethod
  selectedPayment: PaymentMethod
  isFreeShipping: boolean
  isSubmittingOrder: boolean
  shippingAddressSummary: {
    fullName?: string
    phoneNumber?: string
    province?: string
    city?: string
    exactAddress?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:selectedShipping', val: ShippingMethod): void
  (e: 'update:selectedPayment', val: PaymentMethod): void
  (e: 'prevStep' | 'submit'): void
}>()

const { flatShippingFee, estimatedDispatchText } = useSiteSettings()

</script>

<template>
  <div class="space-y-6">
    <!-- کارت گزینه‌های شیوه ارسال -->
    <div class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-4">
      <div class="border-b border-sand/70 pb-3">
        <h2 class="text-lg font-bold text-ink">
          شیوه ارسال مرسوله
        </h2>
        <p class="text-xs text-muted-foreground mt-1">
          سفارش شما در بسته‌بندی امن و محافظ الیاف ورزشی کراس تحویل می‌گردد.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <!-- گزینه ۱: پست پیشتاز کشوری -->
        <div
          class="relative p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2"
          :class="[
            selectedShipping === 'standard'
              ? 'border-rose bg-rose/5 shadow-2xs'
              : 'border-sand bg-white hover:border-sand/80',
          ]"
          @click="emit('update:selectedShipping', 'standard')"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Truck
                class="w-5 h-5"
                :class="selectedShipping === 'standard' ? 'text-rose' : 'text-muted-foreground'"
              />
              <span class="text-xs font-bold text-ink">پست پیشتاز کشوری</span>
            </div>
            <span
              v-if="isFreeShipping"
              class="text-[11px] font-bold text-sage bg-sage/10 px-2 py-0.5 rounded-full"
            >
              رایگان
            </span>
            <span v-else class="text-xs font-bold text-ink">
              {{ formatToman(flatShippingFee) }}
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground leading-relaxed">
            {{ estimatedDispatchText || 'تحویل در تمام نقاط کشور طی ۲ الی ۴ روز کاری همراه با کد رهگیری پستی' }}
          </p>
        </div>

        <!-- گزینه ۲: پیک فوری کراس (مخصوص تهران) -->
        <div
          class="relative p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2"
          :class="[
            selectedShipping === 'express'
              ? 'border-rose bg-rose/5 shadow-2xs'
              : 'border-sand bg-white hover:border-sand/80',
          ]"
          @click="emit('update:selectedShipping', 'express')"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Zap
                class="w-5 h-5"
                :class="selectedShipping === 'express' ? 'text-rose' : 'text-muted-foreground'"
              />
              <span class="text-xs font-bold text-ink">پیک اختصاصی تهران</span>
            </div>
            <span class="text-xs font-bold text-ink">
              {{ formatToman(120000) }}
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground leading-relaxed">
            تحویل روز کاری بعد در محدوده مناطق ۲۲ گانه شهر تهران با هماهنگی تلفنی
          </p>
        </div>
      </div>
    </div>

    <!-- کارت گزینه‌های شیوه پرداخت -->
    <div class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-4">
      <div class="border-b border-sand/70 pb-3">
        <h2 class="text-lg font-bold text-ink">
          شیوه پرداخت وجه
        </h2>
        <p class="text-xs text-muted-foreground mt-1">
          کلیه تراکنش‌ها از بستر امن شاپرک با پروتکل رمزنگاری SSL پردازش می‌شوند.
        </p>
      </div>

      <div class="space-y-3 pt-2">
        <!-- درگاه آنلاین شاپرک -->
        <div
          class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between"
          :class="[
            selectedPayment === 'online_gateway'
              ? 'border-rose bg-rose/5 shadow-2xs'
              : 'border-sand bg-white hover:border-sand/80',
          ]"
          @click="emit('update:selectedPayment', 'online_gateway')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center text-rose shrink-0">
              <CreditCard class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-ink">
                  پرداخت آنلاین با کلیه کارت‌های شتاب
                </span>
                <span class="text-[10px] bg-rose text-white px-2 py-0.5 rounded-full font-bold">
                  توصیه شده
                </span>
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                اتصال آنی به درگاه الکترونیک شاپرک (بانک سامان / ملت)
              </p>
            </div>
          </div>

          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="selectedPayment === 'online_gateway' ? 'border-rose' : 'border-sand'"
          >
            <div
              v-if="selectedPayment === 'online_gateway'"
              class="w-2.5 h-2.5 rounded-full bg-rose"
            />
          </div>
        </div>

        <!-- کارت به کارت -->
        <div
          class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between"
          :class="[
            selectedPayment === 'card_to_card'
              ? 'border-rose bg-rose/5 shadow-2xs'
              : 'border-sand bg-white hover:border-sand/80',
          ]"
          @click="emit('update:selectedPayment', 'card_to_card')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sand/50 flex items-center justify-center text-ink shrink-0">
              <Building class="w-5 h-5" />
            </div>
            <div>
              <span class="text-xs font-bold text-ink">
                واریز کارت به کارت مستقیم
              </span>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                ثبت سفارش و واریز به حساب رسمی کراس با پشتیبانی واتس‌اپ
              </p>
            </div>
          </div>

          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="selectedPayment === 'card_to_card' ? 'border-rose' : 'border-sand'"
          >
            <div
              v-if="selectedPayment === 'card_to_card'"
              class="w-2.5 h-2.5 rounded-full bg-rose"
            />
          </div>
        </div>
      </div>

      <!-- خلاصه آدرس ثبت شده در مرحله ۱ -->
      <div class="rounded-xl bg-sand/30 p-3.5 border border-sand/70 text-xs text-ink space-y-1 mt-4">
        <div class="flex items-center justify-between">
          <span class="font-bold">تحویل‌گیرنده: {{ shippingAddressSummary.fullName }} ({{ shippingAddressSummary.phoneNumber }})</span>
          <button
            type="button"
            class="text-rose text-[11px] font-bold hover:underline cursor-pointer"
            @click="emit('prevStep')"
          >
            ویرایش آدرس
          </button>
        </div>
        <p class="text-[11px] text-muted-foreground leading-relaxed">
          {{ shippingAddressSummary.province }}، {{ shippingAddressSummary.city }}، {{ shippingAddressSummary.exactAddress }}
        </p>
      </div>

      <!-- دکمه‌های ناوبری مرحله ۲ -->
      <div class="pt-4 flex items-center justify-between border-t border-sand/70">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors cursor-pointer"
          @click="emit('prevStep')"
        >
          <ArrowRight class="w-4 h-4" />
          <span>مرحله قبل: ویرایش آدرس</span>
        </button>

        <Button
          size="lg"
          class="h-12 px-8 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
          :disabled="isSubmittingOrder"
          @click="emit('submit')"
        >
          <Lock v-if="!isSubmittingOrder" class="w-4 h-4" />
          <span v-if="isSubmittingOrder">در حال پردازش تراکنش...</span>
          <span v-else>ثبت نهایی سفارش و پرداخت</span>
        </Button>
      </div>
    </div>
  </div>
</template>
