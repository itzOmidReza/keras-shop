<!-- frontend/app/components/product/FabricMeters.vue -->
<script setup lang="ts">
import { Info } from '@lucide/vue'

defineProps<{
  stretch?: number // 1 تا 5
  softness?: number // 1 تا 5
  opacity?: number // 1 تا 5
  composition?: string // جنس پارچه
  gsm?: number // گرماژ پارچه
}>()

const stretchLabels: Record<number, string> = {
  1: 'بدون کشسانی',
  2: 'کشسانی اندک',
  3: 'کشسانی متوسط',
  4: 'کشسانی بالا',
  5: 'کشسانی چهارطرفه فوق‌العاده',
}

const opacityLabels: Record<number, string> = {
  1: 'بسیار نازک و بدن‌‌نما',
  2: 'نیمه‌شفاف',
  3: 'پوشش استاندارد',
  4: 'پوشش بالا (ضد دید)',
  5: '۱۰۰٪ ضد دید در حرکت (Squat-Proof)',
}

const softnessLabels: Record<number, string> = {
  1: 'بافت محکم و شق',
  2: 'بافت معمولی',
  3: 'نرم',
  4: 'بسیار نرم و لطیف',
  5: 'حس پوست دوم (بسیار لطیف)',
}
</script>

<template>
  <div class="rounded-card border border-sand bg-paper p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-sand/60 pb-3">
      <h3 class="text-sm font-bold text-ink">
        مشخصات فنی پارچه و الیاف
      </h3>
      <span v-if="gsm" class="text-xs text-muted">
        وزن پارچه: {{ gsm }} گرم بر متر مربع
      </span>
    </div>

    <!-- متریال تشکیل‌دهنده -->
    <div v-if="composition" class="text-xs text-ink/80 flex items-center gap-1.5">
      <span class="font-medium text-muted">ترکیب الیاف:</span>
      <span>{{ composition }}</span>
    </div>

    <div class="space-y-3 pt-1">
      <!-- سنجه کشسانی -->
      <div v-if="stretch" class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-ink">میزان کشسانی</span>
          <span class="text-muted">{{ stretchLabels[stretch] || `${stretch} از ۵` }}</span>
        </div>
        <div
role="meter" :aria-valuenow="stretch" aria-valuemin="1" aria-valuemax="5" aria-label="کشسانی پارچه"
          class="flex h-2 w-full gap-1.5 overflow-hidden rounded-full">
          <div
v-for="i in 5" :key="i" class="h-full flex-1 rounded-full transition-colors"
            :class="i <= stretch ? 'bg-coral' : 'bg-sand'" />
        </div>
      </div>

      <!-- سنجه عدم شفافیت و پوشانندگی -->
      <div v-if="opacity" class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-ink flex items-center gap-1">
            میزان پوشش و دید (Opacity)
          </span>
          <span class="text-muted">{{ opacityLabels[opacity] || `${opacity} از ۵` }}</span>
        </div>
        <div
role="meter" :aria-valuenow="opacity" aria-valuemin="1" aria-valuemax="5" aria-label="پوشانندگی پارچه"
          class="flex h-2 w-full gap-1.5 overflow-hidden rounded-full">
          <div
v-for="i in 5" :key="i" class="h-full flex-1 rounded-full transition-colors"
            :class="i <= opacity ? 'bg-sage' : 'bg-sand'" />
        </div>
      </div>

      <!-- سنجه لطافت و نرمی -->
      <div v-if="softness" class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-ink">میزان نرمی و لطافت</span>
          <span class="text-muted">{{ softnessLabels[softness] || `${softness} از ۵` }}</span>
        </div>
        <div
role="meter" :aria-valuenow="softness" aria-valuemin="1" aria-valuemax="5" aria-label="نرمی پارچه"
          class="flex h-2 w-full gap-1.5 overflow-hidden rounded-full">
          <div
v-for="i in 5" :key="i" class="h-full flex-1 rounded-full transition-colors"
            :class="i <= softness ? 'bg-clay' : 'bg-sand'" />
        </div>
      </div>
    </div>

    <!-- یادداشت تست شفافیت -->
    <div class="flex items-center gap-1.5 rounded-lg bg-sand/40 p-2.5 text-[11px] text-muted">
      <Info class="w-4 h-4 shrink-0 text-coral" />
      <span>تمام پارچه‌ها در حرکات کششی عمیق و زوایای مختلف نوری تست شده‌اند[cite: 3].</span>
    </div>
  </div>
</template>
