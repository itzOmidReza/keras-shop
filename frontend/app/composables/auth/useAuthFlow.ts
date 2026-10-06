import { toast } from 'vue-sonner'

export interface UseAuthFlowOptions {
  onSuccess?: () => void
  redirectUrl?: string
  requireTerms?: boolean
}

export function useAuthFlow(options: UseAuthFlowOptions = {}) {
  const authStore = useAuthStore()

  const step = ref<'phone' | 'otp'>('phone')
  const phoneNumber = ref('')
  const otpCode = ref('')
  const phoneError = ref('')
  const otpError = ref('')
  const acceptTerms = ref(true)
  const countdown = ref(120)
  let timer: ReturnType<typeof setInterval> | null = null

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

    if (options.requireTerms && !acceptTerms.value) {
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
      if (options.onSuccess) {
        options.onSuccess()
      } else if (options.redirectUrl) {
        navigateTo(options.redirectUrl)
      }
    } else {
      otpError.value = 'کد تایید وارد شده صحیح نمی‌باشد (کد تستی: ۱۲۳۴۵ یا ۱۲۳۴).'
    }
  }

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

  const handleDemoLogin = () => {
    authStore.loginAsMockUser()
    if (options.onSuccess) {
      options.onSuccess()
    } else if (options.redirectUrl) {
      navigateTo(options.redirectUrl)
    }
  }

  const handleAdminLogin = () => {
    authStore.loginAsSuperAdmin()
    if (options.onSuccess) {
      options.onSuccess()
    } else if (options.redirectUrl) {
      navigateTo(options.redirectUrl)
    }
  }

  const resetFlow = () => {
    step.value = 'phone'
    phoneNumber.value = ''
    otpCode.value = ''
    phoneError.value = ''
    otpError.value = ''
    stopTimer()
  }

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

  return {
    step,
    phoneNumber,
    otpCode,
    phoneError,
    otpError,
    acceptTerms,
    countdown,
    formattedCountdown,
    authStore,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToPhone,
    handleDemoLogin,
    handleAdminLogin,
    resetFlow,
  }
}
