<script setup lang="ts">
import { Building2, Lock } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import type { PaymentSessionInfo } from '~/types/domain'

defineProps<{
  sessionData: PaymentSessionInfo | null
}>()
</script>

<template>
  <aside class="md:col-span-5 space-y-4">
    <div class="bg-white border border-sand/70 rounded-2xl p-5 shadow-xs space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-sand/50">
        <Building2 class="w-4 h-4 text-rose" />
        <h2 class="text-sm font-bold text-ink">
          اطلاعات پذیرنده و سفارش
        </h2>
      </div>

      <div class="space-y-3 text-xs">
        <div class="flex items-center justify-between py-1 border-b border-sand/30">
          <span class="text-muted-foreground">نام پذیرنده:</span>
          <span class="font-bold text-ink text-start">{{ sessionData?.merchantName || 'فروشگاه کراس' }}</span>
        </div>

        <div class="flex items-center justify-between py-1 border-b border-sand/30">
          <span class="text-muted-foreground">شماره سفارش:</span>
          <span class="font-mono font-bold text-rose">{{ sessionData?.orderNumber }}</span>
        </div>

        <div class="flex items-center justify-between py-1 border-b border-sand/30">
          <span class="text-muted-foreground">آدرس وب‌سایت:</span>
          <span class="font-mono text-muted-foreground dir-ltr">keras-store.ir</span>
        </div>

        <div class="flex items-center justify-between py-1 border-b border-sand/30">
          <span class="text-muted-foreground">شناسه ترمینال:</span>
          <span class="font-mono font-bold text-ink">۹۸۲۳۱۴۰۱</span>
        </div>

        <div class="rounded-xl bg-sand/30 p-3 mt-2 text-center">
          <div class="text-[11px] text-muted-foreground mb-1">
            مبلغ قابل پرداخت:
          </div>
          <div class="text-xl font-bold text-ink">
            {{ formatToman(sessionData?.amount || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- راهنمای امنیتی -->
    <div class="rounded-2xl border border-sand/60 bg-paper p-4 text-xs text-muted-foreground space-y-2">
      <div class="flex items-center gap-1.5 font-bold text-ink">
        <Lock class="w-3.5 h-3.5 text-sage" />
        <span>نکات امنیتی شاپرک:</span>
      </div>
      <ul class="list-disc ps-4 space-y-1 text-[11px] leading-relaxed">
        <li>آدرس صفحه درگاه حتماً باید دارای پروتکل امن https باشد.</li>
        <li>از صفحه کلید مجازی برای ورود رمزهای حساس استفاده کنید.</li>
        <li>هرگز اطلاعات کارت خود را در اختیار دیگران قرار ندهید.</li>
      </ul>
    </div>
  </aside>
</template>
