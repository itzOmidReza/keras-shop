<!-- frontend/app/components/auth/AuthModal.vue -->
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '~/components/ui/input-otp'
import {
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Edit2,
  X,
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { toEn, toFa } from '~/utils/format'
import { iranianMobileRegex } from '~/utils/validation'

const authStore = useAuthStore()

const step = ref<'phone' | 'otp'>('phone')
const phoneNumber = ref('')
const otpCode = ref('')
const phoneError = ref('')
const otpError = ref('')
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

// پاک‌سازی فرم هنگام باز/بسته شدن
watch(() => authStore.isAuthModalOpen, (isOpen) => {
  if (isOpen) {
    step.value = 'phone'
    phoneNumber.value = ''
    otpCode.value = ''
    phoneError.value = ''
    otpError.value = ''
    stopTimer()
  } else {
    stopTimer()
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

// مرحله ۲: بررسی و تایید کد ۵ رقمی
const handleVerifyOtp = async () => {
  if (authStore.isLoading) return
  otpError.value = ''
  const cleanPhone = toEn(phoneNumber.value.trim())
  const cleanCode = toEn(otpCode.value.trim())

  if (cleanCode.length !== 5) {
    otpError.value = 'لطفاً کد تایید ۵ رقمی را به طور کامل وارد کنید.'
    return
  }

  const success = await authStore.verifyOtp(cleanPhone, cleanCode)
  if (!success) {
    otpError.value = 'کد وارد شده صحیح نمی‌باشد (کد تستی: ۱۲۳۴۵).'
  }
}

// گوش دادن به تکمیل خودکار کد OTP و پاک‌سازی ارقام غیر انگلیسی
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
    if (converted.length === 5 && !authStore.isLoading) {
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
  <Dialog :open="authStore.isAuthModalOpen" @update:open="(val: boolean) => !val && authStore.closeAuthModal()">
    <DialogContent
      class="max-w-md w-[calc(100%-2rem)] rounded-3xl border border-sand bg-paper p-6 sm:p-8 shadow-xl text-ink"
      dir="rtl"
    >
      <!-- دکمه بستن سفارشی ادیتوریال -->
      <button
        type="button"
        class="absolute inset-e-4 top-4 w-8 h-8 rounded-full bg-sand/30 hover:bg-sand/60 text-ink/70 hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
        aria-label="بستن"
        @click="authStore.closeAuthModal()"
      >
        <X class="w-4 h-4" />
      </button>

      <DialogHeader class="space-y-2 text-start">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose/10 text-rose text-[11px] font-bold w-fit">
          <Sparkles class="w-3.5 h-3.5" />
          <span>باشگاه مشتریان کراس</span>
        </div>

        <DialogTitle class="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          {{ step === 'phone' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل' }}
        </DialogTitle>

        <DialogDescription class="text-xs text-muted-foreground leading-relaxed">
          <template v-if="step === 'phone'">
            برای ورود یا عضویت در کراس، شماره موبایل خود را وارد نمایید.
          </template>
          <template v-else>
            کد تایید ۵ رقمی ارسال‌شده به شماره
            <span class="font-bold text-ink font-mono px-1">{{ toFa(phoneNumber) }}</span>
            را وارد کنید.
          </template>
        </DialogDescription>
      </DialogHeader>

      <!-- مرحله اول: دریافت شماره تلفن همراه -->
      <form v-if="step === 'phone'" class="mt-6 space-y-4" @submit.prevent="handleSendOtp">
        <div class="space-y-1.5">
          <label for="auth-phone-input" class="text-xs font-bold text-ink flex items-center justify-between">
            <span>شماره تلفن همراه</span>
            <span class="text-[10px] text-muted-foreground">فرمت: ۰۹xxxxxxxxx</span>
          </label>

          <div class="relative">
            <div class="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Phone class="w-4 h-4" />
            </div>

            <input
              id="auth-phone-input"
              v-model="phoneNumber"
              type="tel"
              inputmode="numeric"
              dir="ltr"
              placeholder="09123456789"
              maxlength="11"
              autofocus
              class="w-full h-12 rounded-xl border border-sand bg-white ps-10 pe-4 text-sm font-mono text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all"
              :class="{ 'border-destructive focus:border-destructive focus:ring-destructive': phoneError }"
            >
          </div>

          <p v-if="phoneError" class="text-[11px] text-destructive font-medium pt-0.5">
            {{ phoneError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="authStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <template v-else>
            <span>دریافت کد تایید</span>
            <ArrowRight class="w-4 h-4 rtl:-scale-x-100" />
          </template>
        </button>

        <!-- نکات امنیتی و حریم خصوصی -->
        <div class="pt-2 border-t border-sand/60 flex items-center gap-2 text-[10px] text-muted-foreground">
          <ShieldCheck class="w-4 h-4 text-sage shrink-0" />
          <span>ورود امن و سریع بدون نیاز به رمز عبور با پیامک یک‌بار مصرف</span>
        </div>
      </form>

      <!-- مرحله دوم: وارد کردن کد تایید OTP -->
      <div v-else class="mt-6 space-y-5">
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
            کد تستی جهت ارزیابی سیستم: <span class="font-mono font-bold text-rose">12345</span>
          </p>
        </div>

        <button
          type="button"
          :disabled="authStore.isLoading || otpCode.length !== 5"
          class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleVerifyOtp"
        >
          <span v-if="authStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <template v-else>
            <CheckCircle2 class="w-4 h-4" />
            <span>تایید و ورود به حساب</span>
          </template>
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
    </DialogContent>
  </Dialog>
</template>
