<!-- frontend/app/components/ops/auth/OpsTwoFactorModal.vue -->
<script setup lang="ts">
import { Key, ShieldCheck, QrCode, Smartphone, X } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsRbacStore } from '~/stores/ops/authGuard'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const rbacStore = useOpsRbacStore()
const activeMethod = ref<'totp' | 'sms'>('totp')
const totpCode = ref('')
const isPending = ref(false)

const secretKey = 'KRS-1405-SEC-9982-ATELIER'

const handleVerify = () => {
  if (totpCode.value.length < 6) {
    toast.error('کد اعتبارسنجی باید حداقل ۶ رقم باشد')
    return
  }
  isPending.value = true
  setTimeout(() => {
    isPending.value = false
    rbacStore.toggle2Fa(true)
    toast.success('احراز هویت دو مرحله‌ای (2FA) با موفقیت فعال و تایید شد')
    emit('update:open', false)
    totpCode.value = ''
  }, 600)
}

const handleDisable = () => {
  rbacStore.toggle2Fa(false)
  toast.info('احراز هویت دو مرحله‌ای غیرفعال گردید')
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-rose/10 text-rose flex items-center justify-center">
            <Key class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">تنظیمات ورود دو مرحله‌ای (2FA)</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">حفاظت از دسترسی به اطلاعات مالی و کاتالوگ</p>
          </div>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-ink cursor-pointer p-1"
          @click="emit('update:open', false)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- تب‌های انتخاب روش -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-sand/30 rounded-xl">
          <button
            type="button"
            class="py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeMethod === 'totp' ? 'bg-white text-ink shadow-2xs' : 'text-muted-foreground hover:text-ink'"
            @click="activeMethod = 'totp'"
          >
            <QrCode class="w-3.5 h-3.5" />
            <span>نرم‌افزار احراز هویت (TOTP)</span>
          </button>
          <button
            type="button"
            class="py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeMethod === 'sms' ? 'bg-white text-ink shadow-2xs' : 'text-muted-foreground hover:text-ink'"
            @click="activeMethod = 'sms'"
          >
            <Smartphone class="w-3.5 h-3.5" />
            <span>پیامک امنیتی (SMS)</span>
          </button>
        </div>

        <div v-if="activeMethod === 'totp'" class="space-y-4">
          <div class="p-3 bg-paper rounded-xl border border-sand flex items-center justify-center flex-col gap-2">
            <!-- بارکد نمادین استاندارد -->
            <div class="w-36 h-36 bg-white border border-sand rounded-lg p-2 flex items-center justify-center shadow-2xs">
              <div class="text-center space-y-1">
                <QrCode class="w-20 h-20 text-ink mx-auto" />
                <span class="text-[9px] text-muted-foreground font-mono block">Google Authenticator</span>
              </div>
            </div>
            <div class="text-center space-y-0.5">
              <span class="text-2xs text-muted-foreground">کلید محرمانه اختصاصی:</span>
              <p class="text-xs font-mono font-bold text-ink bg-white px-2 py-1 rounded border border-sand select-all">
                {{ secretKey }}
              </p>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-ink">کد ۶ رقمی اپلیکیشن:</label>
            <input
              v-model="totpCode"
              type="text"
              maxlength="6"
              placeholder="123456"
              class="w-full h-10 px-3 rounded-xl border border-sand bg-paper text-center font-mono text-base font-bold text-ink focus:outline-hidden focus:border-ink"
            >
          </div>
        </div>

        <div v-else class="space-y-3 p-4 bg-sand/20 rounded-xl text-center">
          <Smartphone class="w-8 h-8 text-rose mx-auto" />
          <p class="text-xs text-ink leading-relaxed">
            کد یکبار مصرف امنیتی به شماره تلفن همراه متصل به حساب مدیر ارشد ارسال می‌گردد.
          </p>
          <input
            v-model="totpCode"
            type="text"
            maxlength="6"
            placeholder="کد پیامک‌شده"
            class="w-full h-10 px-3 rounded-xl border border-sand bg-white text-center font-mono text-sm font-bold text-ink focus:outline-hidden"
          >
        </div>
      </div>

      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-between gap-2">
        <button
          v-if="rbacStore.currentOperator.is2FaEnabled"
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="handleDisable"
        >
          غیرفعال‌سازی 2FA
        </button>
        <div v-else class="text-2xs text-muted-foreground">
          وضعیت فعلی: محافظت نشده
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-3 rounded-xl border border-sand bg-white text-xs font-bold text-ink hover:bg-sand/30 cursor-pointer"
            @click="emit('update:open', false)"
          >
            انصراف
          </button>
          <button
            type="button"
            :disabled="isPending"
            class="h-9 px-4 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            @click="handleVerify"
          >
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>{{ isPending ? 'در حال تایید...' : 'تایید و فعال‌سازی' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
