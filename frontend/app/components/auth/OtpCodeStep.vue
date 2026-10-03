<script setup lang="ts">
import {
  Edit2,
  CheckCircle2,
  Sparkles,
  Terminal,
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
    demoTestId?: string
    adminTestId?: string
  }>(),
  {
    otpTestId: 'login-otp-input',
    demoTestId: 'login-demo-btn-step2',
    adminTestId: 'login-admin-bypass-step2',
  },
)

const emit = defineEmits<{
  (e: 'backToPhone' | 'verify' | 'resend' | 'demoLogin' | 'adminLogin'): void
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

      <p class="text-[11px] text-muted-foreground text-center">
        کد تستی جهت ارزیابی سیستم: <span class="font-mono font-bold text-rose">12345</span> یا <span class="font-mono font-bold text-rose">1234</span>
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

    <!-- دکمه ورود سریع آزمایشی در استپ ۲ -->
    <div class="relative flex items-center justify-center my-1">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-sand" />
      </div>
      <span class="relative px-3 bg-white text-[11px] text-muted-foreground font-medium">یا</span>
    </div>

    <div class="space-y-2">
      <button
        type="button"
        :data-testid="demoTestId"
        class="w-full h-11 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
        @click="emit('demoLogin')"
      >
        <Sparkles class="w-3.5 h-3.5 text-rose" />
        <span>ورود سریع آزمایشی (اکانت دمو)</span>
      </button>

      <button
        type="button"
        :data-testid="adminTestId"
        class="w-full h-11 rounded-xl border border-amber-500/30 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
        @click="emit('adminLogin')"
      >
        <Terminal class="w-3.5 h-3.5 text-amber-400" />
        <span>ورود مدیریت ارشد (Super Admin HQ)</span>
      </button>
    </div>

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
