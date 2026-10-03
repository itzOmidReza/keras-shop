<script setup lang="ts">
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
} from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import type { BankInfo } from '~/composables/checkout/useShaparakGateway'

defineProps<{
  captchaValue: string
  detectedBank: BankInfo | null
  otpSeconds: number
  formError: string | null
  isSubmitting: boolean
  amount: number
}>()

const emit = defineEmits<{
  (e: 'cardInput', ev: Event): void
  (e: 'refreshCaptcha' | 'requestOtp' | 'submit' | 'cancel'): void
}>()

const cardNumber = defineModel<string>('cardNumber', { default: '' })
const cvv2 = defineModel<string>('cvv2', { default: '' })
const expMonth = defineModel<string>('expMonth', { default: '' })
const expYear = defineModel<string>('expYear', { default: '' })
const otpCode = defineModel<string>('otpCode', { default: '' })
const captchaInput = defineModel<string>('captchaInput', { default: '' })
</script>

<template>
  <section class="md:col-span-7 bg-white border border-sand/70 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="flex items-center justify-between border-b border-sand/50 pb-3">
      <div class="flex items-center gap-2">
        <CreditCard class="w-5 h-5 text-rose" />
        <h2 class="text-base font-bold text-ink">
          ورود اطلاعات کارت بانکی
        </h2>
      </div>
      <span class="text-[11px] text-muted-foreground flex items-center gap-1">
        <HelpCircle class="w-3.5 h-3.5" />
        کلیه کارت‌های عضو شتاب
      </span>
    </div>

    <!-- هشدار خطا در صورت وجود -->
    <div
      v-if="formError"
      class="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive"
    >
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{{ formError }}</span>
    </div>

    <form class="space-y-4" @submit.prevent="emit('submit')">
      <!-- شماره کارت -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="gateway-card-num" class="text-xs font-bold text-ink">
            شماره کارت ۱۶ رقمی:
          </label>
          <span v-if="detectedBank" :class="detectedBank.color" class="text-xs font-bold flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5" />
            {{ detectedBank.name }}
          </span>
        </div>
        <div class="relative">
          <input
            id="gateway-card-num"
            v-model="cardNumber"
            type="text"
            dir="ltr"
            maxlength="19"
            placeholder="____ - ____ - ____ - ____"
            class="w-full text-center font-mono text-base tracking-widest rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
            @input="emit('cardInput', $event)"
          >
        </div>
      </div>

      <!-- CVV2 و تاریخ انقضا -->
      <div class="grid grid-cols-2 gap-4">
        <!-- CVV2 -->
        <div class="space-y-1.5">
          <label for="gateway-cvv2" class="text-xs font-bold text-ink">
            کد شناسایی دوم (CVV2):
          </label>
          <input
            id="gateway-cvv2"
            v-model="cvv2"
            type="password"
            dir="ltr"
            maxlength="4"
            placeholder="۳ یا ۴ رقم"
            class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
          >
        </div>

        <!-- تاریخ انقضا -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-ink">
            تاریخ انقضای کارت:
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="expMonth"
              type="text"
              dir="ltr"
              maxlength="2"
              placeholder="ماه"
              class="w-1/2 text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-2 focus:outline-none focus:border-rose transition-colors"
            >
            <span class="text-muted-foreground font-bold">/</span>
            <input
              v-model="expYear"
              type="text"
              dir="ltr"
              maxlength="2"
              placeholder="سال"
              class="w-1/2 text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-2 focus:outline-none focus:border-rose transition-colors"
            >
          </div>
        </div>
      </div>

      <!-- رمز پویا و دکمه درخواست -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="gateway-otp" class="text-xs font-bold text-ink">
            رمز دوم یکبار مصرف (رمز پویا):
          </label>
          <span v-if="otpSeconds > 0" class="text-[11px] text-muted-foreground font-mono">
            اعتبار رمز: {{ toFa(otpSeconds) }} ثانیه
          </span>
        </div>
        <div class="flex gap-2">
          <input
            id="gateway-otp"
            v-model="otpCode"
            type="password"
            dir="ltr"
            maxlength="8"
            placeholder="کد پیامک‌شده"
            class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
          >
          <button
            type="button"
            :disabled="otpSeconds > 0"
            class="shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-sand bg-sand/30 hover:bg-sand/60 text-ink disabled:opacity-50 transition-colors cursor-pointer"
            @click="emit('requestOtp')"
          >
            {{ otpSeconds > 0 ? `ارسال مجدد (${toFa(otpSeconds)})` : 'درخواست رمز پویا' }}
          </button>
        </div>
      </div>

      <!-- کد امنیتی کپچا -->
      <div class="space-y-1.5">
        <label for="gateway-captcha" class="text-xs font-bold text-ink">
          کد امنیتی تصویر:
        </label>
        <div class="flex items-center gap-3">
          <input
            id="gateway-captcha"
            v-model="captchaInput"
            type="text"
            dir="ltr"
            maxlength="4"
            placeholder="کد ۴ رقمی"
            class="w-full text-center font-mono text-sm rounded-xl border border-sand bg-white py-2.5 px-3 focus:outline-none focus:border-rose transition-colors"
          >
          <!-- باکس تصویر کپچا -->
          <div
            class="select-none bg-sand/50 border border-sand rounded-xl px-4 py-2 font-mono font-bold tracking-widest text-lg text-ink line-through decoration-rose/50"
          >
            {{ captchaValue }}
          </div>
          <button
            type="button"
            class="w-10 h-10 rounded-xl border border-sand flex items-center justify-center text-muted-foreground hover:text-ink hover:bg-sand/30 transition-colors cursor-pointer shrink-0"
            aria-label="تغییر کد امنیتی"
            @click="emit('refreshCaptcha')"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- دکمه‌های اصلی پرداخت و انصراف -->
      <div class="pt-4 border-t border-sand/40 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:flex-1 py-3 px-6 rounded-xl bg-sage hover:bg-sage/90 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>پرداخت و تایید نهایی ({{ formatToman(amount) }})</span>
        </button>

        <button
          type="button"
          class="w-full sm:w-auto py-3 px-5 rounded-xl border border-sand bg-transparent hover:bg-sand/30 text-muted-foreground hover:text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          @click="emit('cancel')"
        >
          <XCircle class="w-4 h-4" />
          <span>انصراف و بازگشت</span>
        </button>
      </div>
    </form>
  </section>
</template>
