<!-- frontend/app/pages/checkout/callback.vue -->
<script setup lang="ts">
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from '@lucide/vue'
import { toFa } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import type { PaymentVerifyResponse } from '~/types/domain'

useSeoMeta({
  title: 'اعتبارسنجی پرداخت شاپرک | کراس',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

type VerificationStatus = 'verifying' | 'success' | 'failed' | 'cancelled'

const status = ref<VerificationStatus>('verifying')
const verifyData = ref<PaymentVerifyResponse | null>(null)
const errorMessage = ref<string>('')
const isRetrying = ref(false)

const token = computed(() => {
  const t = route.query.token
  return (Array.isArray(t) ? t[0] : t) || ''
})

const action = computed(() => {
  const a = route.query.action
  return ((Array.isArray(a) ? a[0] : a) as 'success' | 'fail' | 'cancel') || 'success'
})

const cardNumber = computed(() => {
  const c = route.query.card
  return (Array.isArray(c) ? c[0] : c) || undefined
})

// اجرای فرآیند تایید پرداخت در شاپرک
const runVerification = async () => {
  if (!token.value) {
    status.value = 'failed'
    errorMessage.value = 'توکن پرداخت نامعتبر یا یافت نشد.'
    return
  }

  status.value = 'verifying'

  try {
    const res = await $fetch<PaymentVerifyResponse>('/api/checkout/payment/verify', {
      method: 'POST',
      body: {
        paymentToken: token.value,
        action: action.value,
        cardNumber: cardNumber.value,
      },
    })

    verifyData.value = res

    if (res.success) {
      status.value = 'success'
      // ۱. خالی کردن سبد خرید پس از پرداخت قطعی
      cartStore.clearCart()

      // ۲. به‌روزرسانی تاریخچه سفارشات کاربر لاگین‌شده
      if (authStore.isAuthenticated) {
        authStore.fetchOrders()
      }

      // ۳. ذخیره رسید در نشست مرورگر
      if (import.meta.client) {
        sessionStorage.setItem('keras_last_payment_rrn', res.referenceId || '')
      }

      // ۴. هدایت نرم و خودکار به برگه رسید نهایی پس از ۱.۵ ثانیه
      setTimeout(() => {
        router.replace({
          path: '/checkout/success',
          query: {
            order: res.orderNumber,
            rrn: res.referenceId,
          },
        })
      }, 1500)
    } else {
      if (action.value === 'cancel') {
        status.value = 'cancelled'
      } else {
        status.value = 'failed'
      }
      errorMessage.value = res.errorMessage || 'تراکنش توسط درگاه بانک رد شد.'
    }
  } catch (err: unknown) {
    status.value = 'failed'
    const errorObj = err as { data?: { message?: string }; message?: string }
    errorMessage.value =
      errorObj.data?.message || errorObj.message || 'خطا در برقراری ارتباط با سرور شاپرک.'
  }
}

// تلاش مجدد برای پرداخت
const handleRetryPayment = async () => {
  isRetrying.value = true
  try {
    const orderNum = verifyData.value?.orderNumber || 'KERAS-208314'
    const amount = cartStore.finalTotal || 1450000

    const initiateRes = await $fetch<{ paymentToken: string; gatewayUrl: string }>(
      '/api/checkout/payment/initiate',
      {
        method: 'POST',
        body: {
          orderNumber: orderNum,
          amount,
          callbackUrl: '/checkout/callback',
        },
      }
    )

    router.push(initiateRes.gatewayUrl)
  } catch {
    router.push('/checkout')
  } finally {
    isRetrying.value = false
  }
}

onMounted(() => {
  runVerification()
})
</script>

<template>
  <div class="container mx-auto px-4 py-12 lg:py-20 max-w-2xl text-ink" dir="rtl">
    <!-- ۱. حالت در حال استعلام و اعتبارسنجی (Verifying State) -->
    <div
      v-if="status === 'verifying'"
      class="rounded-3xl border border-sand bg-white p-8 sm:p-12 text-center shadow-xs space-y-6"
    >
      <div class="w-16 h-16 rounded-full bg-rose/10 text-rose mx-auto flex items-center justify-center">
        <Loader2 class="w-8 h-8 animate-spin" />
      </div>

      <div class="space-y-2">
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          در حال اعتبارسنجی تراکنش بانکی
        </h1>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          لطفاً چند لحظه شکیبا باشید؛ سیستم در حال ارتباط با سامانه پرداخت الکترونیک شاپرک و تایید تراکنش شماست...
        </p>
      </div>

      <div class="inline-flex items-center gap-2 bg-sand/30 border border-sand px-3 py-1.5 rounded-full text-xs text-muted-foreground">
        <ShieldCheck class="w-4 h-4 text-sage" />
        <span>پروتکل امن تبادل داده شاپرک</span>
      </div>
    </div>

    <!-- ۲. حالت پرداخت موفق (Success State) -->
    <div
      v-else-if="status === 'success'"
      class="rounded-3xl border border-sage/40 bg-white p-8 sm:p-12 text-center shadow-xs space-y-6"
    >
      <div class="w-16 h-16 rounded-full bg-sage/15 text-sage mx-auto flex items-center justify-center animate-bounce">
        <CheckCircle2 class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-bold text-sage uppercase tracking-wider">
          تراکنش موفقیت‌آمیز
        </span>
        <h1 class="text-xl sm:text-2xl font-bold text-ink">
          پرداخت شما با موفقیت تایید شد
        </h1>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          سفارش شما در سامانه ثبت و وارد چرخه آماده‌سازی گردید. در حال انتقال به صفحه رسید سفارش...
        </p>
      </div>

      <!-- اطلاعات پیگیری شاپرک -->
      <div class="rounded-2xl border border-sand bg-sand/20 p-4 max-w-md mx-auto space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">شماره سفارش:</span>
          <span class="font-mono font-bold text-rose">{{ verifyData?.orderNumber }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">شماره مرجع بانکی (RRN):</span>
          <span class="font-mono font-bold text-ink">{{ toFa(verifyData?.referenceId || '') }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">کد پیگیری تراکنش:</span>
          <span class="font-mono font-bold text-ink">{{ toFa(verifyData?.transactionId || '') }}</span>
        </div>
      </div>

      <NuxtLink
        :to="`/checkout/success?order=${verifyData?.orderNumber}&rrn=${verifyData?.referenceId}`"
        class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
      >
        <span>انتقال فوری به رسید سفارش</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <!-- ۳. حالت خطا در پرداخت یا انصراف کاربر (Failed / Cancelled State) -->
    <div
      v-else
      class="rounded-3xl border border-destructive/30 bg-white p-8 sm:p-12 text-center shadow-xs space-y-6"
    >
      <div class="w-16 h-16 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
        <XCircle v-if="status === 'failed'" class="w-10 h-10" />
        <AlertTriangle v-else class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-bold text-destructive uppercase tracking-wider">
          {{ status === 'cancelled' ? 'انصراف از پرداخت' : 'خطا در پرداخت بانکی' }}
        </span>
        <h1 class="text-xl sm:text-2xl font-bold text-ink">
          {{ status === 'cancelled' ? 'فرآیند پرداخت لغو شد' : 'تراکنش بانکی به پایان نرسید' }}
        </h1>
        <p class="text-xs sm:text-sm text-destructive/90 max-w-md mx-auto leading-relaxed font-medium">
          {{ errorMessage }}
        </p>
      </div>

      <!-- حفظ سبد خرید -->
      <div class="rounded-2xl border border-sand bg-paper p-4 max-w-md mx-auto text-xs text-muted-foreground flex items-center gap-3 text-start">
        <ShoppingBag class="w-5 h-5 text-rose shrink-0" />
        <div>
          <span class="font-bold text-ink block">اقلام سبد خرید شما محفوظ است:</span>
          <span>هیچ مبلغی از حساب شما کسر نشده و سفارش شما برای اقدام مجدد در صف باقی مانده است.</span>
        </div>
      </div>

      <!-- دکمه‌های اکشن برای بازگشت یا تلاش مجدد -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          :disabled="isRetrying"
          class="w-full sm:w-auto py-3 px-6 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          @click="handleRetryPayment"
        >
          <RotateCcw class="w-4 h-4" :class="{ 'animate-spin': isRetrying }" />
          <span>تلاش مجدد برای پرداخت اینترنتی</span>
        </button>

        <NuxtLink
          to="/checkout"
          class="w-full sm:w-auto py-3 px-5 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>بازگشت به تسویه حساب</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
