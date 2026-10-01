<!-- frontend/app/components/checkout/CheckoutSteps.vue -->
<script setup lang="ts">
import { MapPin, CreditCard, Check } from '@lucide/vue'

defineProps<{
  currentStep: 1 | 2
}>()
</script>

<template>
  <div class="w-full max-w-xl mx-auto mb-8 sm:mb-12">
    <div class="relative flex items-center justify-between">
      <!-- خط اتصال دو مرحله -->
      <div class="absolute top-1/2 inset-x-8 -translate-y-1/2 h-0.5 bg-sand z-0">
        <div
          class="h-full bg-rose transition-all duration-300"
          :class="currentStep === 2 ? 'w-full' : 'w-0'"
        />
      </div>

      <!-- مرحله ۱: آدرس و مشخصات تحویل -->
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
          :class="[
            currentStep > 1
              ? 'bg-sage text-white'
              : currentStep === 1
                ? 'bg-rose text-white ring-4 ring-rose/20'
                : 'bg-white border border-sand text-muted-foreground',
          ]"
        >
          <Check v-if="currentStep > 1" class="w-5 h-5" />
          <MapPin v-else class="w-5 h-5" />
        </div>
        <span
          class="text-xs font-bold transition-colors"
          :class="currentStep >= 1 ? 'text-ink' : 'text-muted-foreground'"
        >
          ۱. مشخصات و آدرس تحویل
        </span>
      </div>

      <!-- مرحله ۲: شیوه ارسال و پرداخت -->
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
          :class="[
            currentStep === 2
              ? 'bg-rose text-white ring-4 ring-rose/20'
              : 'bg-white border border-sand text-muted-foreground',
          ]"
        >
          <CreditCard class="w-5 h-5" />
        </div>
        <span
          class="text-xs font-bold transition-colors"
          :class="currentStep === 2 ? 'text-ink' : 'text-muted-foreground'"
        >
          ۲. شیوه ارسال و پرداخت
        </span>
      </div>
    </div>
  </div>
</template>
