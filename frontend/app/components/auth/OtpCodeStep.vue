<script setup lang="ts">
import {
  Edit2,
  CheckCircle2,
  RefreshCw,
} from '@lucide/vue'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '~/components/ui/input-otp'

withDefaults(
  defineProps<{
    otpError: string
    isLoading: boolean
    countdown: number
    formattedCountdown: string
    otpTestId?: string
  }>(),
  {
    otpTestId: 'login-otp-input',
  },
)

const emit = defineEmits<{
  (e: 'backToPhone' | 'verify' | 'resend'): void
}>()

const otpCode = defineModel<string>('otpCode', { default: '' })
</script>

<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-ink">کد تایید ۵ رقمی</span>
        <button
          type="button"
          class="text-[11px] font-bold text-rose hover:underline inline-flex items-center gap-1 cursor-pointer"
          @click="emit('backToPhone')"
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
          :data-testid="otpTestId"
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
    </div>

    <button
      type="button"
      :disabled="isLoading || otpCode.length < 4"
      class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('verify')"
    >
      <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        :disabled="isLoading"
        @click="emit('resend')"
      >
        <RefreshCw class="w-3.5 h-3.5" />
        <span>ارسال مجدد کد تایید</span>
      </button>
    </div>
  </div>
</template>
