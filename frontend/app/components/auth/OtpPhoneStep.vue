<script setup lang="ts">
import { Phone, ArrowLeft, Sparkles, Terminal, ShieldCheck } from '@lucide/vue'

withDefaults(
  defineProps<{
    phoneError: string
    isLoading: boolean
    requireTerms?: boolean
    demoTestId?: string
    adminTestId?: string
    phoneInputId?: string
  }>(),
  {
    requireTerms: false,
    demoTestId: 'login-demo-btn',
    adminTestId: 'login-admin-bypass',
    phoneInputId: 'login-phone-input',
  },
)

const emit = defineEmits<{
  (e: 'submit' | 'demoLogin' | 'adminLogin'): void
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

    <!-- جداکننده یا -->
    <div class="relative flex items-center justify-center my-4">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-sand" />
      </div>
      <span class="relative px-3 bg-white text-[11px] text-muted-foreground font-medium">یا</span>
    </div>

    <!-- دکمه‌های ورود سریع آزمایشی برای توسعه‌دهنده -->
    <div class="space-y-2">
      <button
        type="button"
        :data-testid="demoTestId"
        class="w-full h-11 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
        @click="emit('demoLogin')"
      >
        <Sparkles class="w-3.5 h-3.5 text-rose" />
        <span>ورود سریع آزمایشی (اکانت دمو سارا رادمنش)</span>
      </button>

      <button
        type="button"
        :data-testid="adminTestId"
        class="w-full h-11 rounded-xl border border-amber-500/30 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
        @click="emit('adminLogin')"
      >
        <Terminal class="w-3.5 h-3.5 text-amber-400" />
        <span>ورود مستقیم مدیریت ارشد (Super Admin HQ Nexus)</span>
      </button>
    </div>

    <!-- تضمین امنیتی -->
    <div class="pt-3 border-t border-sand/60 flex items-center gap-2 text-[11px] text-muted-foreground">
      <ShieldCheck class="w-4 h-4 text-sage shrink-0" />
      <span>ورود امن بدون نیاز به رمز عبور همراه با پیامک یک‌بار مصرف</span>
    </div>
  </form>
</template>
