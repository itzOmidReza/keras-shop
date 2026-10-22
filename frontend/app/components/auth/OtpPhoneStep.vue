<script setup lang="ts">
import { Phone, ArrowLeft, ShieldCheck } from '@lucide/vue'

withDefaults(
  defineProps<{
    phoneError: string
    isLoading: boolean
    requireTerms?: boolean
    phoneInputId?: string
  }>(),
  {
    requireTerms: false,
    phoneInputId: 'login-phone-input',
  },
)

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const phoneNumber = defineModel<string>('phoneNumber', { default: '' })
const acceptTerms = defineModel<boolean>('acceptTerms', { default: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent="emit('submit')">
    <div class="space-y-1.5">
      <label :for="phoneInputId" class="text-xs font-bold text-ink flex items-center justify-between">
        <span>شماره تلفن همراه</span>
        <span class="text-[10px] text-muted-foreground">فرمت: ۰۹xxxxxxxxx</span>
      </label>

      <div class="relative">
        <div class="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Phone class="w-4 h-4" />
        </div>

        <input
          :id="phoneInputId"
          v-model="phoneNumber"
          type="tel"
          inputmode="numeric"
          dir="ltr"
          placeholder="09123456789"
          maxlength="11"
          autofocus
          class="w-full h-12 rounded-xl border border-sand bg-white ps-10 pe-4 text-sm font-mono text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all text-start"
          :class="{ 'border-destructive focus:border-destructive focus:ring-destructive': phoneError }"
        >
      </div>

      <p v-if="phoneError" class="text-[11px] text-destructive font-medium pt-0.5">
        {{ phoneError }}
      </p>
    </div>

    <!-- چک‌باکس پذیرش قوانین (اختیاری) -->
    <div v-if="requireTerms" class="pt-1">
      <label class="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
        <input
          v-model="acceptTerms"
          type="checkbox"
          class="mt-0.5 h-4 w-4 rounded border-sand text-rose focus:ring-rose/40 cursor-pointer accent-rose"
        >
        <span class="leading-relaxed">
          <NuxtLink to="/terms" target="_blank" class="text-rose font-bold hover:underline">شرایط و مقررات</NuxtLink>
          و
          <NuxtLink to="/privacy" target="_blank" class="text-rose font-bold hover:underline">حریم خصوصی</NuxtLink>
          خرید از کراس را مطالعه نموده و می‌پذیرم.
        </span>
      </label>
    </div>

    <button
      type="submit"
      :disabled="isLoading || (requireTerms && !acceptTerms)"
      class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <template v-else>
        <span>دریافت کد تایید</span>
        <ArrowLeft class="w-4 h-4" />
      </template>
    </button>

    <!-- تضمین امنیتی -->
    <div class="pt-3 border-t border-sand/60 flex items-center gap-2 text-[11px] text-muted-foreground">
      <ShieldCheck class="w-4 h-4 text-sage shrink-0" />
      <span>ورود امن بدون نیاز به رمز عبور همراه با پیامک یک‌بار مصرف</span>
    </div>
  </form>
</template>
