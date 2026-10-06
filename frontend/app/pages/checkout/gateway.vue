<!-- frontend/app/pages/checkout/gateway.vue -->
<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'درگاه پرداخت اینترنتی شاپرک | پرداخت امن کراس',
  robots: 'noindex, nofollow',
})

const {
  sessionData,
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
} = useShaparakGateway()
</script>

<template>
  <div class="min-h-screen bg-sand/20 text-ink font-sans flex flex-col justify-between py-6 px-4" dir="rtl">
    <!-- هدر رسمی سامانه شاپرک -->
    <GatewayHeader :session-seconds="sessionSeconds" />

    <!-- کانتینر اصلی محتوا و فرم -->
    <main class="container mx-auto max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <!-- ستون اطلاعات پذیرنده و تراکنش -->
      <GatewayMerchantInfo :session-data="sessionData" />

      <!-- ستون فرم پرداخت کارت -->
      <GatewayPaymentForm
        v-model:card-number="cardNumber"
        v-model:cvv2="cvv2"
        v-model:exp-month="expMonth"
        v-model:exp-year="expYear"
        v-model:otp-code="otpCode"
        v-model:captcha-input="captchaInput"
        :captcha-value="captchaValue"
        :detected-bank="detectedBank"
        :otp-seconds="otpSeconds"
        :form-error="formError"
        :is-submitting="isSubmitting"
        :amount="sessionData?.amount || 0"
        @card-input="handleCardInput"
        @refresh-captcha="refreshCaptcha"
        @request-otp="requestOtp"
        @submit="submitPayment('success')"
        @cancel="submitPayment('cancel')"
      />
    </main>

    <!-- نوار شبیه‌ساز سریع محیط توسعه -->
    <GatewayDevToolbar
      @fill-test-card="fillTestCard"
      @simulate-success="submitPayment('success', true)"
      @simulate-fail="submitPayment('fail', true)"
    />
  </div>
</template>
