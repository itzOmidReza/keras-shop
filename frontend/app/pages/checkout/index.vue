<!-- frontend/app/pages/checkout.vue -->
<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import InlineCheckoutOtp from '~/components/checkout/InlineCheckoutOtp.vue'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'تسویه حساب و ثبت سفارش | کراس',
  description: 'تکمیل اطلاعات آدرس، انتخاب شیوه ارسال و پرداخت سفارش در کراس',
})

const cartStore = useCartStore()
const router = useRouter()

const {
  authStore,
  currentStep,
  isSubmittingOrder,
  acceptTerms,
  termsError,
  isInlineOtpOpen,
  errors,
  values,
  fullName,
  phoneNumber,
  province,
  city,
  postalCode,
  exactAddress,
  buildingNumber,
  unit,
  notes,
  selectedSavedAddressId,
  applySavedAddress,
  selectedShipping,
  selectedPayment,
  handleShippingChange,
  goToStep1,
  goToStep2,
  handleFinalSubmit,
  onInlineOtpSuccess,
} = useCheckoutFunnel()

// بررسی وضعیت سبد خرید و هدایت در صورت خالی بودن پس از هیدراتاسیون
watch(
  [() => cartStore.isHydrated, () => cartStore.items.length],
  ([hydrated, len]) => {
    if (hydrated && len === 0 && !isSubmittingOrder.value) {
      toast.info('سبد خرید شما خالی است.')
      router.replace('/cart')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- نشانگر مراحل ۲ گانه تسویه حساب -->
    <CheckoutSteps :current-step="currentStep" />

    <!-- بدنه اصلی فرآیند تسویه حساب -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- ستون فرم (راست در RTL) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- مرحله ۱: مشخصات و آدرس پستی -->
        <CheckoutShippingStep
          v-show="currentStep === 1"
          v-model:full-name="fullName"
          v-model:phone-number="phoneNumber"
          v-model:province="province"
          v-model:city="city"
          v-model:postal-code="postalCode"
          v-model:exact-address="exactAddress"
          v-model:building-number="buildingNumber"
          v-model:unit="unit"
          v-model:notes="notes"
          v-model:accept-terms="acceptTerms"
          :auth-addresses="authStore.addresses"
          :is-authenticated="authStore.isAuthenticated"
          :selected-saved-address-id="selectedSavedAddressId"
          :errors="errors"
          :terms-error="termsError"
          @apply-saved-address="applySavedAddress"
          @open-auth-modal="authStore.openAuthModal()"
          @submit="goToStep2"
        />

        <!-- مرحله ۲: شیوه ارسال و پرداخت -->
        <CheckoutPaymentStep
          v-show="currentStep === 2"
          :selected-shipping="selectedShipping"
          :selected-payment="selectedPayment"
          :is-free-shipping="cartStore.isFreeShipping"
          :is-submitting-order="isSubmittingOrder"
          :shipping-address-summary="values"
          @update:selected-shipping="handleShippingChange"
          @update:selected-payment="selectedPayment = $event"
          @prev-step="goToStep1"
          @submit="handleFinalSubmit"
        />
      </div>

      <!-- ستون خلاصه سفارش و قیمت زنده (چپ در RTL) -->
      <div class="lg:col-span-4 lg:sticky lg:top-24">
        <CheckoutOrderSummary />
      </div>
    </div>

    <!-- مدال تایید شماره موبایل درون‌برنامه‌ای مهمان -->
    <InlineCheckoutOtp
      v-model:open="isInlineOtpOpen"
      :phone-number="values.phoneNumber || ''"
      :full-name="values.fullName || ''"
      @success="onInlineOtpSuccess"
    />
  </div>
</template>
