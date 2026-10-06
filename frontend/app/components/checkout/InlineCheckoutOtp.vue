<!-- frontend/app/components/checkout/InlineCheckoutOtp.vue -->
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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  X,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  phoneNumber: string
  fullName?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'success'): void
}>()

const authStore = useAuthStore()

const otpCode = ref('')
const otpError = ref('')
const countdown = ref(120)
let timer: ReturnType<typeof setInterval> | null = null

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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      otpCode.value = ''
      otpError.value = ''
      startTimer()
      // ارسال اولیه OTP در صورت داشتن شماره
      const cleanPhone = toEn((props.phoneNumber || '').trim())
      if (cleanPhone) {
        authStore.sendOtp(cleanPhone).catch(() => {
          // در محیط توسعه کدهای تستی پیش‌فرض ۱۲۳۴۵ و ۱۲۳۴ فعال هستند
        })
      }
    } else {
      stopTimer()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  stopTimer()
})

const formattedCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${toFa(minutes)}:${toFa(seconds.toString().padStart(2, '0'))}`
})

// تایید کد OTP درون فرآیند تسویه حساب
const handleVerifyOtp = async () => {
  if (authStore.isLoading) return
  otpError.value = ''
  const cleanPhone = toEn((props.phoneNumber || '').trim())
  const cleanCode = toEn(otpCode.value.trim())

  if (cleanCode.length < 4 || cleanCode.length > 6) {
    otpError.value = 'لطفاً کد تایید ۵ رقمی را وارد کنید (کد تستی: ۱۲۳۴ یا ۱۲۳۴۵).'
    return
  }

  const success = await authStore.verifyOtp(cleanPhone, cleanCode)
  if (success) {
    if (props.fullName && (!authStore.user?.fullName || authStore.user.fullName !== props.fullName)) {
      authStore.updateProfile({ fullName: props.fullName }).catch(() => {})
    }
    toast.success('شماره همراه شما با موفقیت تایید شد.')
    emit('update:open', false)
    emit('success')
  } else {
    otpError.value = 'کد وارد شده صحیح نمی‌باشد (کد تستی: ۱۲۳۴۵ یا ۱۲۳۴).'
  }
}

const handleDemoLogin = () => {
  authStore.loginAsMockUser()
  emit('update:open', false)
  emit('success')
}

// گوش دادن به تکمیل کد ۵ یا ۶ رقمی
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
    const cleanPhone = toEn((props.phoneNumber || '').trim())
    await authStore.sendOtp(cleanPhone)
    otpCode.value = ''
    startTimer()
    toast.info('کد تایید مجدداً ارسال گردید.')
  } catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    otpError.value = fetchErr?.data?.statusMessage || 'خطا در ارسال مجدد کد تایید.'
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <DialogContent
      data-testid="checkout-otp-dialog"
      class="max-w-md w-[calc(100%-2rem)] rounded-3xl border border-sand bg-paper p-6 sm:p-8 shadow-xl text-ink"
      dir="rtl"
    >
      <button
        type="button"
        class="absolute inset-e-4 top-4 w-8 h-8 rounded-full bg-sand/30 hover:bg-sand/60 text-ink/70 hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
        aria-label="بستن"
        @click="emit('update:open', false)"
      >
        <X class="w-4 h-4" />
      </button>

      <DialogHeader class="space-y-2 text-start">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose/10 text-rose text-[11px] font-bold w-fit">
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>تایید شماره و عضویت در باشگاه کراس</span>
        </div>

        <DialogTitle class="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          تایید شماره همراه جهت پرداخت
        </DialogTitle>

        <DialogDescription class="text-xs text-muted-foreground leading-relaxed">
          جهت صدور فاکتور رسمی و پیگیری مرسوله، کد ۵ رقمی ارسال‌شده به شماره
          <span class="font-bold text-ink font-mono px-1">{{ toFa(phoneNumber) }}</span>
          را وارد کنید.
        </DialogDescription>
      </DialogHeader>

      <div class="mt-6 space-y-4">
        <!-- ورودی ۵ رقمی OTP -->
        <div class="flex justify-center py-2" dir="ltr">
          <InputOTP
            v-model="otpCode"
            :maxlength="5"
            autofocus
            data-testid="checkout-otp-input"
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

        <p v-if="otpError" class="text-[11px] text-destructive text-center font-medium">
          {{ otpError }}
        </p>

        <p class="text-[11px] text-muted-foreground text-center">
          کد تستی جهت ارزیابی سیستم: <span class="font-mono font-bold text-rose">12345</span> یا <span class="font-mono font-bold text-rose">1234</span>
        </p>

        <button
          type="button"
          data-testid="checkout-otp-submit"
          :disabled="authStore.isLoading || otpCode.length < 4"
          class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleVerifyOtp"
        >
          <span v-if="authStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <template v-else>
            <CheckCircle2 class="w-4 h-4" />
            <span>تایید و ادامه پرداخت</span>
          </template>
        </button>

        <!-- جداکننده یا -->
        <div class="relative flex items-center justify-center my-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-sand" />
          </div>
          <span class="relative px-3 bg-paper text-[11px] text-muted-foreground font-medium">یا</span>
        </div>

        <!-- دکمه ورود سریع آزمایشی برای توسعه‌دهنده -->
        <button
          type="button"
          data-testid="checkout-otp-bypass"
          class="w-full h-11 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
          @click="handleDemoLogin"
        >
          <Sparkles class="w-3.5 h-3.5 text-rose" />
          <span>ورود سریع آزمایشی (اکانت دمو)</span>
        </button>

        <!-- تایمر ارسال مجدد -->
        <div class="flex items-center justify-center text-xs text-muted-foreground pt-1">
          <div v-if="countdown > 0" class="flex items-center gap-1.5 font-medium">
            <span>ارسال مجدد کد تا</span>
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
