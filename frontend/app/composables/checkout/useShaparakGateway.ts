import { toEn } from '~/utils/format'
import type { PaymentSessionInfo } from '~/types/domain'

export interface BankInfo {
  name: string
  color: string
}

export function detectBankFromCardNumber(cardDigits: string): BankInfo | null {
  const digits = toEn(cardDigits.replace(/\s+/g, ''))
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
}

export function useShaparakGateway() {
  const route = useRoute()
  const router = useRouter()

  const token = computed(() => {
    const t = route.query.token
    return (Array.isArray(t) ? t[0] : t) || 'keras_test_token_982301449102'
  })

  const sessionData = ref<PaymentSessionInfo | null>(null)
  const isLoadingSession = ref(true)
  const sessionError = ref<string | null>(null)

  const cardNumber = ref('')
  const cvv2 = ref('')
  const expMonth = ref('')
  const expYear = ref('')
  const otpCode = ref('')
  const captchaInput = ref('')
  const captchaValue = ref('8492')

  const sessionSeconds = ref(600)
  const otpSeconds = ref(0)
  let sessionTimer: ReturnType<typeof setInterval> | null = null
  let otpTimer: ReturnType<typeof setInterval> | null = null

  const formError = ref<string | null>(null)
  const isSubmitting = ref(false)

  const detectedBank = computed(() => detectBankFromCardNumber(cardNumber.value))

  const handleCardInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const raw = toEn(input.value.replace(/\D/g, '')).slice(0, 16)
    const grouped = raw.match(/.{1,4}/g)?.join(' ') || raw
    cardNumber.value = grouped
  }

  const refreshCaptcha = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000).toString()
    captchaValue.value = randomNum
    captchaInput.value = ''
  }

  const requestOtp = () => {
    if (otpSeconds.value > 0) return
    const rawCard = toEn(cardNumber.value.replace(/\s+/g, ''))
    if (rawCard.length < 16) {
      formError.value = 'لطفاً ابتدا شماره ۱۶ رقمی کارت بانکی خود را وارد کنید.'
      return
    }

    formError.value = null
    otpSeconds.value = 120
    otpCode.value = '12345'

    if (otpTimer) clearInterval(otpTimer)
    otpTimer = setInterval(() => {
      if (otpSeconds.value > 0) {
        otpSeconds.value--
      } else if (otpTimer) {
        clearInterval(otpTimer)
      }
    }, 1000)
  }

  const fillTestCard = (prefix: string) => {
    cardNumber.value = `${prefix} 1234 5678 9012`
    cvv2.value = '345'
    expMonth.value = '08'
    expYear.value = '06'
    captchaInput.value = captchaValue.value
    otpCode.value = '12345'
    formError.value = null
  }

  const submitPayment = (action: 'success' | 'fail' | 'cancel', isSimulated = false) => {
    if (action !== 'cancel') {
      if (isSimulated && (!cardNumber.value || toEn(cardNumber.value.replace(/\s+/g, '')).length < 16)) {
        fillTestCard('6104 33')
      }
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

  onMounted(async () => {
    try {
      const data = await $fetch<PaymentSessionInfo>('/api/checkout/payment/session', {
        query: { token: token.value },
      })
      sessionData.value = data
    } catch {
      sessionError.value = 'نشست درگاه پرداخت یافت نشد یا زمان پرداخت پایان یافته است.'
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

  return {
    token,
    sessionData,
    isLoadingSession,
    sessionError,
    cardNumber,
    cvv2,
    expMonth,
    expYear,
    otpCode,
    captchaInput,
    captchaValue,
    sessionSeconds,
    otpSeconds,
    formError,
    isSubmitting,
    detectedBank,
    handleCardInput,
    refreshCaptcha,
    requestOtp,
    fillTestCard,
    submitPayment,
  }
}
