<!-- frontend/app/pages/checkout/gateway.vue -->
<script setup lang="ts">
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Clock,
  RefreshCw,
  AlertCircle,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from '@lucide/vue'
import { toFa, toEn, formatToman } from '~/utils/format'
import type { PaymentSessionInfo } from '~/types/domain'

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'درگاه پرداخت اینترنتی شاپرک | پرداخت امن کراس',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()

const token = computed(() => {
  const t = route.query.token
  return (Array.isArray(t) ? t[0] : t) || 'keras_test_token_982301449102'
})

// اطلاعات نشست پرداخت
const sessionData = ref<PaymentSessionInfo | null>(null)
const isLoadingSession = ref(true)
const sessionError = ref<string | null>(null)

// فیلدهای فرم پرداخت کارت
const cardNumber = ref('')
const cvv2 = ref('')
const expMonth = ref('')
const expYear = ref('')
const otpCode = ref('')
const captchaInput = ref('')
const captchaValue = ref('8492')

// تایمرها
const sessionSeconds = ref(600) // ۱۰ دقیقه نشست درگاه
const otpSeconds = ref(0) // ۱۲۰ ثانیه رمز پویا
let sessionTimer: ReturnType<typeof setInterval> | null = null
let otpTimer: ReturnType<typeof setInterval> | null = null

// اعتبارسنجی و وضعیت‌های خطا
const formError = ref<string | null>(null)
const isSubmitting = ref(false)

// نگاشت پیش‌شماره کارت‌های بانکی عضو شتاب
const detectedBank = computed(() => {
  const digits = toEn(cardNumber.value.replace(/\s+/g, ''))
  if (digits.startsWith('603799')) return { name: 'بانک ملی ایران', color: 'text-amber-700' }
  if (digits.startsWith('610433')) return { name: 'بانک ملت', color: 'text-rose' }
  if (digits.startsWith('621986')) return { name: 'بانک سامان', color: 'text-blue-700' }
  if (digits.startsWith('622106')) return { name: 'بانک پارسیان', color: 'text-amber-600' }
  if (digits.startsWith('502229')) return { name: 'بانک پاسارگاد', color: 'text-yellow-600' }
  if (digits.startsWith('505416')) return { name: 'بلوبانک (سامان)', color: 'text-sky-600' }
  if (digits.startsWith('589463')) return { name: 'بانک رفاه کارگران', color: 'text-blue-800' }
  if (digits.startsWith('627412')) return { name: 'بانک اقتصاد نوین', color: 'text-purple-700' }
  if (digits.length >= 6) return { name: 'کارت شتابی معتبر', color: 'text-sage' }
  return null
})

// فرمت‌بندی شماره کارت ۴ رقم ۴ رقم
const handleCardInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = toEn(input.value.replace(/\D/g, '')).slice(0, 16)
  const grouped = raw.match(/.{1,4}/g)?.join(' ') || raw
  cardNumber.value = grouped
}

// رفرش کپچا
const refreshCaptcha = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString()
  captchaValue.value = randomNum
  captchaInput.value = ''
}

// درخواست رمز پویا
const requestOtp = () => {
  if (otpSeconds.value > 0) return
  const rawCard = toEn(cardNumber.value.replace(/\s+/g, ''))
  if (rawCard.length < 16) {
    formError.value = 'لطفاً ابتدا شماره ۱۶ رقمی کارت بانکی خود را وارد کنید.'
    return
  }

  formError.value = null
  otpSeconds.value = 120
  otpCode.value = '12345' // کد تست شبیه‌ساز

  if (otpTimer) clearInterval(otpTimer)
  otpTimer = setInterval(() => {
    if (otpSeconds.value > 0) {
      otpSeconds.value--
    } else if (otpTimer) {
      clearInterval(otpTimer)
    }
  }, 1000)
}

// دکمه‌های پر کردن سریع اطلاعات تستی
const fillTestCard = (prefix: string) => {
  cardNumber.value = `${prefix} 1234 5678 9012`
  cvv2.value = '345'
  expMonth.value = '08'
  expYear.value = '06'
  captchaInput.value = captchaValue.value
  otpCode.value = '12345'
  formError.value = null
}

// ارسال فرم یا شبیه‌سازی
const submitPayment = (action: 'success' | 'fail' | 'cancel') => {
  if (action !== 'cancel') {
    const rawCard = toEn(cardNumber.value.replace(/\s+/g, ''))
    if (rawCard.length < 16) {
      formError.value = 'شماره کارت بانکی باید ۱۶ رقم کامل باشد.'
      return
    }
    if (toEn(cvv2.value).length < 3) {
      formError.value = 'کد CVV2 کارت نامعتبر است.'
      return
    }
    if (toEn(captchaInput.value) !== captchaValue.value) {
      formError.value = 'کد امنیتی تصویر صحیح نیست.'
      refreshCaptcha()
      return
    }
  }

  isSubmitting.value = true
  const rawCard = toEn(cardNumber.value.replace(/\s+/g, ''))
  const maskedCard = rawCard.length >= 16
    ? `${rawCard.slice(0, 6)}******${rawCard.slice(12)}`
    : '603799******1234'

  router.push({
    path: '/checkout/callback',
    query: {
      token: token.value,
      action,
      card: maskedCard,
    },
  })
}

// بارگذاری نشست پرداخت
onMounted(async () => {
  try {
    const data = await $fetch<PaymentSessionInfo>('/api/checkout/payment/session', {
      query: { token: token.value },
    })
    sessionData.value = data
  } catch {
    sessionError.value = 'نشست درگاه پرداخت یافت نشد یا زمان پرداخت پایان یافته است.'
    // برای تجربه کاربری و سناریوی تست مستقل، آبجکت پیش‌فرض می‌سازیم
    sessionData.value = {
      token: token.value,
      orderNumber: 'KERAS-208314',
      amount: 1450000,
      merchantName: 'فروشگاه اینترنتی پوشاک ورزشی کراس (Keras)',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      status: 'pending',
    }
  } finally {
    isLoadingSession.value = false
  }

  // تایمر ۱۰ دقیقه‌ای درگاه
  sessionTimer = setInterval(() => {
    if (sessionSeconds.value > 0) {
      sessionSeconds.value--
    } else {
      if (sessionTimer) clearInterval(sessionTimer)
      submitPayment('cancel')
    }
  }, 1000)

  refreshCaptcha()
})

onUnmounted(() => {
  if (sessionTimer) clearInterval(sessionTimer)
  if (otpTimer) clearInterval(otpTimer)
})
</script>

<template>
  <div class="min-h-screen bg-sand/20 text-ink font-sans flex flex-col justify-between py-6 px-4" dir="rtl">
    <!-- هدر رسمی سامانه شاپرک -->
    <header class="container mx-auto max-w-4xl bg-white border border-sand/70 rounded-2xl p-4 shadow-xs mb-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- عنوان و لوگوی شاپرک -->
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-bold text-ink">
                سامانه پرداخت الکترونیک شاپرک
              </h1>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
                پرداخت امن SSL
              </span>
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">
              شبکه الکترونیکی پرداخت کارتی بانک مرکزی جمهوری اسلامی ایران
            </p>
          </div>
        </div>

        <!-- تایمر زمان اعتبار پرداخت -->
        <div class="flex items-center gap-2 bg-sand/30 border border-sand px-3 py-1.5 rounded-xl text-xs font-medium">
          <Clock class="w-4 h-4 text-rose animate-pulse" />
          <span class="text-muted-foreground">زمان باقی‌مانده:</span>
          <span class="font-mono font-bold text-rose text-sm">
            {{ toFa(Math.floor(sessionSeconds / 60)) }}:{{ toFa(String(sessionSeconds % 60).padStart(2, '0')) }}
          </span>
        </div>
      </div>
    </header>

    <!-- کانتینر اصلی محتوا و فرم -->
    <main class="container mx-auto max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <!-- ستون اطلاعات پذیرنده و تراکنش (۴ ستون) -->
      <aside class="md:col-span-5 space-y-4">
        <div class="bg-white border border-sand/70 rounded-2xl p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-sand/50">
            <Building2 class="w-4 h-4 text-rose" />
            <h2 class="text-sm font-bold text-ink">
              اطلاعات پذیرنده و سفارش
            </h2>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-sand/30">
              <span class="text-muted-foreground">نام پذیرنده:</span>
              <span class="font-bold text-ink text-start">{{ sessionData?.merchantName || 'فروشگاه کراس' }}</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-sand/30">
              <span class="text-muted-foreground">شماره سفارش:</span>
              <span class="font-mono font-bold text-rose">{{ sessionData?.orderNumber }}</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-sand/30">
              <span class="text-muted-foreground">آدرس وب‌سایت:</span>
              <span class="font-mono text-muted-foreground dir-ltr">keras-store.ir</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-sand/30">
              <span class="text-muted-foreground">شناسه ترمینال:</span>
              <span class="font-mono font-bold text-ink">۹۸۲۳۱۴۰۱</span>
            </div>

            <div class="rounded-xl bg-sand/30 p-3 mt-2 text-center">
              <div class="text-[11px] text-muted-foreground mb-1">
                مبلغ قابل پرداخت:
              </div>
              <div class="text-xl font-bold text-ink">
                {{ formatToman(sessionData?.amount || 0) }}
              </div>
            </div>
          </div>
        </div>

        <!-- راهنمای امنیتی -->
        <div class="rounded-2xl border border-sand/60 bg-paper p-4 text-xs text-muted-foreground space-y-2">
          <div class="flex items-center gap-1.5 font-bold text-ink">
            <Lock class="w-3.5 h-3.5 text-sage" />
            <span>نکات امنیتی شاپرک:</span>
          </div>
          <ul class="list-disc ps-4 space-y-1 text-[11px] leading-relaxed">
            <li>آدرس صفحه درگاه حتماً باید دارای پروتکل امن https باشد.</li>
            <li>از صفحه کلید مجازی برای ورود رمزهای حساس استفاده کنید.</li>
            <li>هرگز اطلاعات کارت خود را در اختیار دیگران قرار ندهید.</li>
          </ul>
        </div>
      </aside>

      <!-- ستون فرم پرداخت کارت (۷ ستون) -->
      <section class="md:col-span-7 bg-white border border-sand/70 rounded-2xl p-6 shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-sand/50 pb-3">
          <div class="flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-rose" />
            <h2 class="text-base font-bold text-ink">
              ورود اطلاعات کارت بانکی
            </h2>
          </div>
          <span class="text-[11px] text-muted-foreground flex items-center gap-1">
            <HelpCircle class="w-3.5 h-3.5" />
            کلیه کارت‌های عضو شتاب
          </span>
        </div>

        <!-- هشدار خطا در صورت وجود -->
        <div
          v-if="formError"
          class="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive"
        >
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ formError }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="submitPayment('success')">
          <!-- شماره کارت -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="gateway-card-num" class="text-xs font-bold text-ink">
                شماره کارت ۱۶ رقمی:
              </label>
              <span v-if="detectedBank" :class="detectedBank.color" class="text-xs font-bold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" />
                {{ detectedBank.name }}
              </span>
            </div>
            <div class="relative">
              <input
                id="gateway-card-num"
                v-model="cardNumber"
                type="text"
                dir="ltr"
                maxlength="19"
                placeholder="____ - ____ - ____ - ____"
                class="w-full text-center font-mono text-base tracking-widest rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
                @input="handleCardInput"
              >
            </div>
          </div>

          <!-- CVV2 و تاریخ انقضا -->
          <div class="grid grid-cols-2 gap-4">
            <!-- CVV2 -->
            <div class="space-y-1.5">
              <label for="gateway-cvv2" class="text-xs font-bold text-ink">
                کد شناسایی دوم (CVV2):
              </label>
              <input
                id="gateway-cvv2"
                v-model="cvv2"
                type="password"
                dir="ltr"
                maxlength="4"
                placeholder="۳ یا ۴ رقم"
                class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
              >
            </div>

            <!-- تاریخ انقضا -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-ink">
                تاریخ انقضای کارت:
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="expMonth"
                  type="text"
                  dir="ltr"
                  maxlength="2"
                  placeholder="ماه"
                  class="w-1/2 text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-2 focus:outline-none focus:border-rose transition-colors"
                >
                <span class="text-muted-foreground font-bold">/</span>
                <input
                  v-model="expYear"
                  type="text"
                  dir="ltr"
                  maxlength="2"
                  placeholder="سال"
                  class="w-1/2 text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-2 focus:outline-none focus:border-rose transition-colors"
                >
              </div>
            </div>
          </div>

          <!-- رمز پویا و دکمه درخواست -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="gateway-otp" class="text-xs font-bold text-ink">
                رمز دوم یکبار مصرف (رمز پویا):
              </label>
              <span v-if="otpSeconds > 0" class="text-[11px] text-muted-foreground font-mono">
                اعتبار رمز: {{ toFa(otpSeconds) }} ثانیه
              </span>
            </div>
            <div class="flex gap-2">
              <input
                id="gateway-otp"
                v-model="otpCode"
                type="password"
                dir="ltr"
                maxlength="8"
                placeholder="کد پیامک‌شده"
                class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
              >
              <button
                type="button"
                :disabled="otpSeconds > 0"
                class="shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-sand bg-sand/30 hover:bg-sand/60 text-ink disabled:opacity-50 transition-colors cursor-pointer"
                @click="requestOtp"
              >
                {{ otpSeconds > 0 ? `ارسال مجدد (${toFa(otpSeconds)})` : 'درخواست رمز پویا' }}
              </button>
            </div>
          </div>

          <!-- کد امنیتی کپچا -->
          <div class="space-y-1.5">
            <label for="gateway-captcha" class="text-xs font-bold text-ink">
              کد امنیتی تصویر:
            </label>
            <div class="flex items-center gap-3">
              <input
                id="gateway-captcha"
                v-model="captchaInput"
                type="text"
                dir="ltr"
                maxlength="4"
                placeholder="کد ۴ رقمی"
                class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
              >
              <!-- باکس تصویر کپچا -->
              <div
                class="select-none bg-sand/50 border border-sand rounded-xl px-4 py-2 font-mono font-bold tracking-widest text-lg text-ink line-through decoration-rose/50"
              >
                {{ captchaValue }}
              </div>
              <button
                type="button"
                class="w-10 h-10 rounded-xl border border-sand flex items-center justify-center text-muted-foreground hover:text-ink hover:bg-sand/30 transition-colors cursor-pointer shrink-0"
                aria-label="تغییر کد امنیتی"
                @click="refreshCaptcha"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- دکمه‌های اصلی پرداخت و انصراف -->
          <div class="pt-4 border-t border-sand/40 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:flex-1 py-3 px-6 rounded-xl bg-sage hover:bg-sage/90 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>پرداخت و تایید نهایی ({{ formatToman(sessionData?.amount || 0) }})</span>
            </button>

            <button
              type="button"
              class="w-full sm:w-auto py-3 px-5 rounded-xl border border-sand bg-transparent hover:bg-sand/30 text-muted-foreground hover:text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              @click="submitPayment('cancel')"
            >
              <XCircle class="w-4 h-4" />
              <span>انصراف و بازگشت</span>
            </button>
          </div>
        </form>
      </section>
    </main>

    <!-- نوار شبیه‌ساز سریع محیط توسعه (Dev Simulation Toolbar) -->
    <footer class="container mx-auto max-w-4xl mt-6">
      <div class="rounded-2xl border border-sand bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles class="w-4 h-4 text-rose" />
          <span class="font-bold text-ink">ابزار شبیه‌سازی درگاه (ویژه آزمایش):</span>
          <span>پر کردن خودکار کارت:</span>
          <button
            type="button"
            class="text-[11px] text-rose font-bold hover:underline cursor-pointer"
            @click="fillTestCard('6104 33')"
          >
            ملت
          </button>
          <span>/</span>
          <button
            type="button"
            class="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
            @click="fillTestCard('6219 86')"
          >
            سامان
          </button>
          <span>/</span>
          <button
            type="button"
            class="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
            @click="fillTestCard('5054 16')"
          >
            بلوبانک
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            class="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-sage/20 text-sage hover:bg-sage/30 text-xs font-bold transition-colors cursor-pointer"
            @click="submitPayment('success')"
          >
            تست پرداخت موفق
          </button>

          <button
            type="button"
            class="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-bold transition-colors cursor-pointer"
            @click="submitPayment('fail')"
          >
            تست خطای موجودی
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
