<script setup lang="ts">
import { ShieldCheck, Clock } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  sessionSeconds: number
}>()
</script>

<template>
  <header class="container mx-auto max-w-4xl bg-white border border-sand/70 rounded-2xl p-4 shadow-xs mb-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- عنوان و لوگوی شاپرک -->
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-ink">
              سامانه پرداخت الکترونیک شاپرک
            </h1>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
              پرداخت امن SSL
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-0.5">
            شبکه الکترونیکی پرداخت کارتی بانک مرکزی جمهوری اسلامی ایران
          </p>
        </div>
      </div>

      <!-- تایمر زمان اعتبار پرداخت -->
      <div class="flex items-center gap-2 bg-sand/30 border border-sand px-3 py-1.5 rounded-xl text-xs font-medium">
        <Clock class="w-4 h-4 text-rose animate-pulse" />
        <span class="text-muted-foreground">زمان باقی‌مانده:</span>
        <span class="font-mono font-bold text-rose text-sm">
          {{ toFa(Math.floor(sessionSeconds / 60)) }}:{{ toFa(String(sessionSeconds % 60).padStart(2, '0')) }}
        </span>
      </div>
    </div>
  </header>
</template>
