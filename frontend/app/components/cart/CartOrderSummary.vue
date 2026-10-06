<!-- frontend/app/components/cart/CartOrderSummary.vue -->
<script setup lang="ts">
import {
  Tag,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import type { CouponValidationResponse } from '~/types/domain'
import { toast } from 'vue-sonner'

const cartStore = useCartStore()
const router = useRouter()

const couponInput = ref('')
const isValidatingCoupon = ref(false)

const handleApplyCoupon = async () => {
  const code = couponInput.value.trim()
  if (!code) {
    toast.error('لطفاً ابتدا کد تخفیف را وارد کنید.')
    return
  }

  isValidatingCoupon.value = true
  try {
    const res = await $fetch<CouponValidationResponse>('/api/coupons/validate', {
      method: 'POST',
      body: {
        code,
        subtotal: cartStore.subtotal,
      },
    })

    cartStore.applyCoupon({
      code: res.code,
      discountAmount: res.discountAmount,
      discountPercent: res.discountPercent,
    })
    couponInput.value = ''
  } catch (err: unknown) {
    const errorObj = err as { data?: { statusMessage?: string }; message?: string }
    const message =
      errorObj.data?.statusMessage || errorObj.message || 'کد تخفیف معتبر نمی‌باشد.'
    toast.error(message)
  } finally {
    isValidatingCoupon.value = false
  }
}

const handleRemoveCoupon = () => {
  cartStore.removeCoupon()
}

const proceedToCheckout = () => {
  if (cartStore.items.length === 0) {
    toast.error('سبد خرید شما خالی است.')
    return
  }
  router.push('/checkout')
}
</script>

<template>
  <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-5">
    <h2 class="text-base font-bold text-ink border-b border-sand/70 pb-3">
      صورت‌حساب سفارش
    </h2>

    <!-- فرم کد تخفیف -->
    <div class="space-y-2">
      <label for="coupon-code" class="text-xs font-medium text-ink flex items-center gap-1.5">
        <Tag class="w-3.5 h-3.5 text-rose" />
        <span>کد تخفیف یا کارت هدیه</span>
      </label>

      <div v-if="!cartStore.appliedCoupon" class="flex items-center gap-2">
        <input
          id="coupon-code"
          v-model="couponInput"
          type="text"
          placeholder="مثال: KERAS10 یا WELCOME"
          class="h-10 flex-1 rounded-xl border border-sand bg-sand/20 px-3 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
          :disabled="isValidatingCoupon"
          @keydown.enter.prevent="handleApplyCoupon"
        >
        <Button
          type="button"
          variant="outline"
          class="h-10 px-4 text-xs font-bold rounded-xl border-sand text-ink hover:bg-sand/40 hover:text-rose cursor-pointer shrink-0"
          :disabled="isValidatingCoupon || !couponInput.trim()"
          @click="handleApplyCoupon"
        >
          {{ isValidatingCoupon ? 'بررسی...' : 'اعمال' }}
        </Button>
      </div>

      <!-- بج کوپن اعمال شده -->
      <div
        v-else
        class="flex items-center justify-between rounded-xl bg-sage/10 border border-sage/20 p-2.5 text-xs text-sage font-medium"
      >
        <div class="flex items-center gap-1.5">
          <Tag class="w-4 h-4 text-sage" />
          <span>کد «{{ cartStore.appliedCoupon.code }}» فعال شد</span>
          <span class="font-bold">({{ formatToman(cartStore.couponDiscount) }}-)</span>
        </div>
        <button
          type="button"
          class="text-[11px] text-muted-foreground hover:text-rose transition-colors cursor-pointer"
          @click="handleRemoveCoupon"
        >
          حذف
        </button>
      </div>
    </div>

    <!-- تفکیک ارقام -->
    <div class="space-y-3 text-xs border-t border-sand/70 pt-4">
      <div class="flex items-center justify-between text-muted-foreground">
        <span>مجموع قیمت کالاها ({{ cartStore.itemCount }} کالا)</span>
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
        <span>تخفیف کوپن اختصاصی</span>
        <span>{{ formatToman(cartStore.couponDiscount) }}-</span>
      </div>

      <div class="flex items-center justify-between text-muted-foreground">
        <span>هزینه ارسال سراسری</span>
        <span v-if="cartStore.isFreeShipping" class="font-bold text-sage">
          رایگان
        </span>
        <span v-else>
          {{ formatToman(cartStore.shippingEstimate) }}
        </span>
      </div>

      <div class="border-t border-sand pt-3 flex items-center justify-between text-sm font-bold text-ink">
        <span>مبلغ نهایی قابل پرداخت</span>
        <PriceTag :price="cartStore.finalTotal" size="lg" />
      </div>
    </div>

    <!-- دکمه هدایت به صفحه تسویه حساب -->
    <Button
      size="lg"
      class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
      @click="proceedToCheckout"
    >
      <span>ادامه جهت تسویه حساب</span>
      <ArrowLeft class="w-4 h-4" />
    </Button>

    <!-- تضمین‌های کیفیت و خدمات -->
    <div class="space-y-2 pt-2 border-t border-sand/60 text-[11px] text-muted-foreground">
      <div class="flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-sage shrink-0" />
        <span>پرداخت ۱۰۰٪ امن از درگاه شاپرک با تمام کارتهای بانکی</span>
      </div>
      <div class="flex items-center gap-2">
        <RotateCcw class="w-4 h-4 text-rose shrink-0" />
        <span>ضمانت بی قید و شرط تعویض سایز تا ۷ روز کاری</span>
      </div>
    </div>
  </div>
</template>
