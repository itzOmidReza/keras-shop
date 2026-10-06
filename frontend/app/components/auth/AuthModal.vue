<!-- frontend/app/components/auth/AuthModal.vue -->
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { Sparkles } from '@lucide/vue'

const {
  step,
  phoneNumber,
  otpCode,
  phoneError,
  otpError,
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
} = useAuthFlow({
  redirectUrl: '/account',
  requireTerms: false,
})

// پاک‌سازی فرم هنگام باز/بسته شدن مودال
watch(() => authStore.isAuthModalOpen, (isOpen) => {
  if (isOpen) {
    resetFlow()
  } else {
    resetFlow()
  }
})
</script>

<template>
  <Dialog :open="authStore.isAuthModalOpen" @update:open="(val: boolean) => authStore.isAuthModalOpen = val">
    <DialogContent class="sm:max-w-md p-6 sm:p-8 bg-paper border-sand rounded-3xl" dir="rtl">
      <!-- هدر اختصاصی -->
      <div class="flex items-center justify-between pb-4 border-b border-sand pe-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <Sparkles class="w-4 h-4" />
          </div>
          <div>
            <DialogTitle class="text-base font-bold text-ink">
              {{ step === 'phone' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل' }}
            </DialogTitle>
            <DialogDescription class="text-2xs text-muted-foreground mt-0.5">
              {{ step === 'phone' ? 'ورود امن با شماره موبایل و کد یک‌بار مصرف' : `کد تایید ارسال‌شده به ${toFa(phoneNumber)}` }}
            </DialogDescription>
          </div>
        </div>
      </div>

      <!-- مرحله ۱: دریافت شماره موبایل -->
      <div v-if="step === 'phone'" class="pt-4">
        <OtpPhoneStep
          v-model:phone-number="phoneNumber"
          :phone-error="phoneError"
          :is-loading="authStore.isLoading"
          :require-terms="false"
          demo-test-id="modal-demo-login-btn"
          admin-test-id="modal-admin-login-btn"
          phone-input-id="auth-phone-input"
          @submit="handleSendOtp"
          @demo-login="handleDemoLogin"
          @admin-login="handleAdminLogin"
        />
      </div>

      <!-- مرحله ۲: وارد کردن کد تایید ۵ رقمی -->
      <div v-else class="pt-4">
        <OtpCodeStep
          v-model:otp-code="otpCode"
          :otp-error="otpError"
          :is-loading="authStore.isLoading"
          :countdown="countdown"
          :formatted-countdown="formattedCountdown"
          otp-test-id="auth-modal-otp-input"
          demo-test-id="modal-demo-login-btn"
          admin-test-id="modal-admin-login-btn"
          @back-to-phone="handleBackToPhone"
          @verify="handleVerifyOtp"
          @resend="handleResendOtp"
          @demo-login="handleDemoLogin"
          @admin-login="handleAdminLogin"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
