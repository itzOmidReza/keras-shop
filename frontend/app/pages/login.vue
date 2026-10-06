<!-- frontend/app/pages/login.vue -->
<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
useSeoMeta({
  title: 'ورود یا عضویت | استودیو مد و پوشاک کراس',
  description: 'ورود امن و سریع به باشگاه مشتریان کراس با شماره تلفن همراه و پیامک یک‌بار مصرف',
})

const route = useRoute()

const redirectUrl = computed(() => {
  const target = route.query.redirect as string
  if (target && target.startsWith('/')) {
    return target
  }
  return '/account'
})

const {
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
} = useAuthFlow({
  redirectUrl: redirectUrl.value,
  requireTerms: true,
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
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] flex flex-col justify-center">
    <div class="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-sand bg-white shadow-xs overflow-hidden items-stretch">
        <!-- ستون A: تصویر کمپین لوکس و پیام برند -->
        <AuthBrandingHero />

        <!-- ستون B: کارت اختصاصی ورود و ثبت‌نام -->
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
          <div v-if="step === 'phone'" class="mt-8">
            <OtpPhoneStep
              v-model:phone-number="phoneNumber"
              v-model:accept-terms="acceptTerms"
              :phone-error="phoneError"
              :is-loading="authStore.isLoading"
              :require-terms="true"
              demo-test-id="login-demo-btn"
              admin-test-id="login-admin-bypass"
              phone-input-id="login-phone-input"
              @submit="handleSendOtp"
              @demo-login="handleDemoLogin"
              @admin-login="handleAdminLogin"
            />
          </div>

          <!-- مرحله ۲: وارد کردن کد تایید OTP -->
          <div v-else class="mt-8">
            <OtpCodeStep
              v-model:otp-code="otpCode"
              :otp-error="otpError"
              :is-loading="authStore.isLoading"
              :countdown="countdown"
              :formatted-countdown="formattedCountdown"
              otp-test-id="login-otp-input"
              demo-test-id="login-demo-btn-step2"
              admin-test-id="login-admin-bypass-step2"
              @back-to-phone="handleBackToPhone"
              @verify="handleVerifyOtp"
              @resend="handleResendOtp"
              @demo-login="handleDemoLogin"
              @admin-login="handleAdminLogin"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
