<!-- frontend/app/components/auth/AuthModal.vue -->
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { Sparkles, X } from '@lucide/vue'
import { toFa } from '~/utils/format'
import { useAuthFlow } from '~/composables/auth/useAuthFlow'
import OtpPhoneStep from '~/components/auth/OtpPhoneStep.vue'
import OtpCodeStep from '~/components/auth/OtpCodeStep.vue'

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
      <!-- هدر اختصاصی و دکمه بستن -->
      <div class="flex items-center justify-between pb-4 border-b border-sand">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <Sparkles class="w-4 h-4" />
          </div>
          <div>
            <DialogTitle class="text-base font-bold text-ink">
              {{ step === 'phone' ? 'ورود به حساب کاربری' : 'تایید شماره موبایل' }}
            </DialogTitle>
            <DialogDescription class="text-2xs text-muted-foreground mt-0.5">
              {{ step === 'phone' ? 'ورود امن با شماره موبایل و کد یک‌بار مصرف' : `کد تایید ارسال‌شده به ${toFa(phoneNumber)}` }}
            </DialogDescription>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-full border border-sand flex items-center justify-center text-muted-foreground hover:text-ink hover:bg-sand/30 transition-colors cursor-pointer"
          aria-label="بستن"
          @click="authStore.closeAuthModal"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- مرحله ۱: دریافت شماره موبایل -->
      <div v-if="step === 'phone'" class="pt-4">
        <OtpPhoneStep
          v-model:phone-number="phoneNumber"
          :phone-error="phoneError"
          :is-loading="authStore.isLoading"
          :require-terms="false"
          demo-test-id="auth-modal-demo-btn"
          admin-test-id="auth-modal-admin-btn"
          phone-input-id="auth-modal-phone-input"
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
          demo-test-id="auth-modal-demo-btn-step2"
          admin-test-id="auth-modal-admin-btn-step2"
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
