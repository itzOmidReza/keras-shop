<!-- frontend/app/pages/login.vue -->
<script setup lang="ts">
import {
  Phone,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Edit2,
} from '@lucide/vue'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '~/components/ui/input-otp'
import { useAuthStore } from '~/stores/auth'
import { toEn, toFa } from '~/utils/format'
import { iranianMobileRegex } from '~/utils/validation'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'ورود یا عضویت | استودیو مد و پوشاک کراس',
  description: 'ورود امن و سریع به باشگاه مشتریان کراس با شماره تلفن همراه و پیامک یک‌بار مصرف',
})

const authStore = useAuthStore()
const route = useRoute()

const redirectUrl = computed(() => {
  const target = route.query.redirect as string
  if (target && target.startsWith('/')) {
    return target
  }
  return '/account'
})

// هدایت خودکار در صورت لاگین بودن کاربر
onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo(redirectUrl.value)
  }
})

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    navigateTo(redirectUrl.value)
  }
})

const step = ref<'phone' | 'otp'>('phone')
const phoneNumber = ref('')
const otpCode = ref('')
const phoneError = ref('')
const otpError = ref('')
const acceptTerms = ref(true)
const countdown = ref(120)
let timer: ReturnType<typeof setInterval> | null = null

// خودکارسازی تبدیل ارقام فارسی و عربی به انگلیسی
watch(phoneNumber, (val) => {
  if (val) {
    const converted = toEn(val)
    if (converted !== val) {
      phoneNumber.value = converted
    }
    if (phoneError.value) {
      phoneError.value = ''
    }
  }
})

const startTimer = () => {
  stopTimer()
  countdown.value = 120
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onUnmounted(() => {
  stopTimer()
})

const formattedCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${toFa(minutes)}:${toFa(seconds.toString().padStart(2, '0'))}`
})

// مرحله ۱: ارسال کد تایید پیامکی
const handleSendOtp = async () => {
  phoneError.value = ''
  const cleanPhone = toEn(phoneNumber.value.trim())

  if (!cleanPhone) {
    phoneError.value = 'لطفاً شماره تلفن همراه خود را وارد کنید.'
    return
  }

  if (!iranianMobileRegex.test(cleanPhone)) {
    phoneError.value = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: ۰۹۱۲۳۴۵۶۷۸۹).'
    return
  }

  if (!acceptTerms.value) {
    phoneError.value = 'پذیرش شرایط و قوانین جهت عضویت در کراس الزامی است.'
    return
  }

  try {
    await authStore.sendOtp(cleanPhone)
    step.value = 'otp'
    otpCode.value = ''
    otpError.value = ''
    startTimer()
  } catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    phoneError.value = fetchErr?.data?.statusMessage || 'خطا در ارسال کد تایید.'
  }
}

// مرحله ۲: بررسی و تایید کد
const handleVerifyOtp = async () => {
  if (authStore.isLoading) return
  otpError.value = ''
  const cleanPhone = toEn(phoneNumber.value.trim())
  const cleanCode = toEn(otpCode.value.trim())

  if (cleanCode.length < 4 || cleanCode.length > 6) {
    otpError.value = 'لطفاً کد تایید معتبر وارد کنید (کد تستی: ۱۲۳۴ یا ۱۲۳۴۵).'
    return
  }

  const success = await authStore.verifyOtp(cleanPhone, cleanCode)
  if (success) {
    toast.success('ورود به حساب کاربری با موفقیت انجام شد.')
    navigateTo(redirectUrl.value)
  } else {
    otpError.value = 'کد تایید وارد شده صحیح نمی‌باشد (کد تستی: ۱۲۳۴۵ یا ۱۲۳۴).'
  }
}

const handleDemoLogin = () => {
  authStore.loginAsMockUser()
  navigateTo(redirectUrl.value)
}

// گوش دادن به تکمیل خودکار کد OTP
watch(otpCode, (newVal) => {
  if (newVal) {
    const converted = toEn(newVal)
    if (converted !== newVal) {
      otpCode.value = converted
      return
    }
    if (otpError.value) {
      otpError.value = ''
    }
    if ((converted.length === 5 || converted.length === 6) && !authStore.isLoading) {
      handleVerifyOtp()
    }
  }
})

const handleResendOtp = async () => {
  if (countdown.value > 0 || authStore.isLoading) return
  otpError.value = ''
  try {
    const cleanPhone = toEn(phoneNumber.value.trim())
    await authStore.sendOtp(cleanPhone)
    otpCode.value = ''
    startTimer()
  } catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    otpError.value = fetchErr?.data?.statusMessage || 'خطا در ارسال مجدد کد تایید.'
  }
}

const handleBackToPhone = () => {
  stopTimer()
  step.value = 'phone'
  otpCode.value = ''
  otpError.value = ''
  phoneError.value = ''
}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] flex flex-col justify-center">
    <div class="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-sand bg-white shadow-xs overflow-hidden items-stretch">
        <!-- ستون A (سمت راست در RTL): تصویر کمپین لوکس و پیام برند -->
        <div class="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-sand/30 overflow-hidden flex-col justify-between p-10 xl:p-12 text-white">
          <NuxtImg
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
            alt="استودیو مد و فشن کراس"
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />

          <!-- نشان تجاری و تگ فصلی بالای تصویر -->
          <div class="relative z-10 flex items-center justify-between">
            <NuxtLink to="/" class="font-serif text-2xl font-bold tracking-widest text-white">
              KERAS
            </NuxtLink>
            <span class="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
              کالکشن چهار فصل • پاییز ۱۴۰۵
            </span>
          </div>

          <!-- پیام فلسفه برند در پایین تصویر -->
          <div class="relative z-10 space-y-3">
            <blockquote class="text-xl xl:text-2xl font-bold leading-relaxed text-paper">
              «خلوص در فرم، ظرافت پایدار و همنشینی اصیل با الیاف طبیعی»
            </blockquote>
            <p class="text-xs text-paper/80 leading-relaxed max-w-md">
              عضویت در باشگاه مشتریان کراس به شما امکان دسترسی اولویت‌دار به دراپ‌های محدود، رهگیری اختصاصی مرسولات و خدمات کنسیرژ استایل را هدیه می‌دهد.
            </p>
          </div>
        </div>

        <!-- ستون B (سمت چپ در RTL): کارت اختصاصی ورود و ثبت‌نام -->
        <div class="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 xl:p-12 flex flex-col justify-center bg-white text-ink">
          <!-- هدر فرم ورود -->
          <div class="space-y-2 text-start">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold w-fit">
              <Sparkles class="w-3.5 h-3.5" />
              <span>باشگاه مشتریان کراس</span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {{ step === 'phone' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل' }}
            </h1>

            <p class="text-xs text-muted-foreground leading-relaxed">
              <template v-if="step === 'phone'">
                شماره موبایل خود را وارد نمایید تا رمز یک‌بار مصرف برای شما پیامک شود.
              </template>
              <template v-else>
                کد تایید ارسال‌شده به شماره
                <span class="font-bold text-ink font-mono px-1">{{ toFa(phoneNumber) }}</span>
                را وارد فرمایید.
              </template>
            </p>
          </div>

          <!-- مرحله ۱: دریافت شماره موبایل -->
          <form v-if="step === 'phone'" class="mt-8 space-y-4" @submit.prevent="handleSendOtp">
            <div class="space-y-1.5">
              <label for="login-phone-input" class="text-xs font-bold text-ink flex items-center justify-between">
                <span>شماره تلفن همراه</span>
                <span class="text-[10px] text-muted-foreground">فرمت: ۰۹xxxxxxxxx</span>
              </label>

              <div class="relative">
                <div class="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Phone class="w-4 h-4" />
                </div>

                <input
                  id="login-phone-input"
                  v-model="phoneNumber"
                  type="tel"
                  inputmode="numeric"
                  dir="ltr"
                  placeholder="09123456789"
                  maxlength="11"
                  autofocus
                  class="w-full h-12 rounded-xl border border-sand bg-white ps-10 pe-4 text-sm font-mono text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all text-start"
                  :class="{ 'border-destructive focus:border-destructive focus:ring-destructive': phoneError }"
                >
              </div>

              <p v-if="phoneError" class="text-[11px] text-destructive font-medium pt-0.5">
                {{ phoneError }}
              </p>
            </div>

            <!-- چک‌باکس پذیرش قوانین -->
            <div class="pt-1">
              <label class="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  v-model="acceptTerms"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 rounded border-sand text-rose focus:ring-rose/40 cursor-pointer accent-rose"
                >
                <span class="leading-relaxed">
                  <NuxtLink to="/terms" target="_blank" class="text-rose font-bold hover:underline">شرایط و مقررات</NuxtLink>
                  و
                  <NuxtLink to="/privacy" target="_blank" class="text-rose font-bold hover:underline">حریم خصوصی</NuxtLink>
                  خرید از کراس را مطالعه نموده و می‌پذیرم.
                </span>
              </label>
            </div>

            <button
              type="submit"
              :disabled="authStore.isLoading || !acceptTerms"
              class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <template v-else>
                <span>دریافت کد تایید</span>
                <ArrowLeft class="w-4 h-4" />
              </template>
            </button>

            <!-- جداکننده یا -->
            <div class="relative flex items-center justify-center my-4">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-sand" />
              </div>
              <span class="relative px-3 bg-white text-[11px] text-muted-foreground font-medium">یا</span>
            </div>

            <!-- دکمه ورود سریع آزمایشی برای توسعه‌دهنده -->
            <button
              type="button"
              data-testid="login-demo-btn"
              class="w-full h-11 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
              @click="handleDemoLogin"
            >
              <Sparkles class="w-3.5 h-3.5 text-rose" />
              <span>ورود سریع آزمایشی (اکانت دمو)</span>
            </button>

            <!-- تضمین امنیتی -->
            <div class="pt-3 border-t border-sand/60 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck class="w-4 h-4 text-sage shrink-0" />
              <span>ورود امن بدون نیاز به رمز عبور همراه با پیامک یک‌بار مصرف</span>
            </div>
          </form>

          <!-- مرحله ۲: وارد کردن کد تایید OTP -->
          <div v-else class="mt-8 space-y-5">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-ink">کد تایید ۵ رقمی</span>
                <button
                  type="button"
                  class="text-[11px] font-bold text-rose hover:underline inline-flex items-center gap-1 cursor-pointer"
                  @click="handleBackToPhone"
                >
                  <Edit2 class="w-3 h-3" />
                  <span>ویرایش شماره</span>
                </button>
              </div>

              <!-- ورودی ۵ رقمی OTP -->
              <div class="flex justify-center py-2" dir="ltr">
                <InputOTP
                  v-model="otpCode"
                  :maxlength="5"
                  autofocus
                  data-testid="login-otp-input"
                >
                  <InputOTPGroup class="gap-2 sm:gap-2.5">
                    <InputOTPSlot :index="0" class="w-10 sm:w-11 h-12 text-lg rounded-xl border border-sand bg-white text-ink font-bold text-center shadow-2xs focus:border-rose" />
                    <InputOTPSlot :index="1" class="w-10 sm:w-11 h-12 text-lg rounded-xl border border-sand bg-white text-ink font-bold text-center shadow-2xs focus:border-rose" />
                    <InputOTPSlot :index="2" class="w-10 sm:w-11 h-12 text-lg rounded-xl border border-sand bg-white text-ink font-bold text-center shadow-2xs focus:border-rose" />
                    <InputOTPSlot :index="3" class="w-10 sm:w-11 h-12 text-lg rounded-xl border border-sand bg-white text-ink font-bold text-center shadow-2xs focus:border-rose" />
                    <InputOTPSlot :index="4" class="w-10 sm:w-11 h-12 text-lg rounded-xl border border-sand bg-white text-ink font-bold text-center shadow-2xs focus:border-rose" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p v-if="otpError" class="text-[11px] text-destructive text-center font-medium pt-1">
                {{ otpError }}
              </p>

              <p class="text-[11px] text-muted-foreground text-center">
                کد تستی جهت ارزیابی سیستم: <span class="font-mono font-bold text-rose">12345</span> یا <span class="font-mono font-bold text-rose">1234</span>
              </p>
            </div>

            <button
              type="button"
              :disabled="authStore.isLoading || otpCode.length < 4"
              class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleVerifyOtp"
            >
              <span v-if="authStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <template v-else>
                <CheckCircle2 class="w-4 h-4" />
                <span>تایید و ورود به حساب</span>
              </template>
            </button>

            <!-- دکمه ورود سریع آزمایشی در استپ ۲ -->
            <div class="relative flex items-center justify-center my-1">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-sand" />
              </div>
              <span class="relative px-3 bg-white text-[11px] text-muted-foreground font-medium">یا</span>
            </div>

            <button
              type="button"
              data-testid="login-demo-btn-step2"
              class="w-full h-11 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
              @click="handleDemoLogin"
            >
              <Sparkles class="w-3.5 h-3.5 text-rose" />
              <span>ورود سریع آزمایشی (اکانت دمو)</span>
            </button>

            <!-- تایمر ارسال مجدد -->
            <div class="flex items-center justify-center text-xs text-muted-foreground pt-1">
              <div v-if="countdown > 0" class="flex items-center gap-1.5 font-medium">
                <span>امکان ارسال مجدد کد تا</span>
                <span class="font-bold font-mono text-ink">{{ formattedCountdown }}</span>
                <span>دیگر</span>
              </div>

              <button
                v-else
                type="button"
                class="text-rose font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                :disabled="authStore.isLoading"
                @click="handleResendOtp"
              >
                <RefreshCw class="w-3.5 h-3.5" />
                <span>ارسال مجدد کد تایید</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
