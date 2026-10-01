<!-- frontend/app/pages/cart.vue -->
<script setup lang="ts">
import {
  ShoppingBag,
  Truck,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Tag,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import type { CouponValidationResponse } from '~/types/domain'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'سبد خرید | کراس',
  description: 'مدیریت و تسویه اقلام افزوده شده به سبد خرید پوشاک ورزشی کراس',
})

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
        <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
      </NuxtLink>
    </div>

    <!-- حالت وجود کالا در سبد -->
    <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
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
            <ArrowRight class="w-4 h-4 rtl:-scale-x-100" />
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
        <!-- کارت صورت‌حساب -->
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
            <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
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
