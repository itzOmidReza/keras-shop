<!-- frontend/app/components/product/FabricMeters.vue -->
<script setup lang="ts">
import { fabricMeterLabels } from '~/data'

interface Props {
  stretch: number // 1 تا 5
  softness: number // 1 تا 5
  opacity: number // 1 تا 5
  composition?: string
  gsm?: number
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-5 rounded-2xl border border-sand bg-white/60 p-5">
    <!-- هدر بخش مشخصات فنی -->
    <div class="flex items-center justify-between border-b border-sand pb-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-ink">
        مشخصات فنی و حس بافت
      </h3>
      <span v-if="gsm" class="rounded-full bg-sand/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        {{ gsm }} GSM (تراکم بافت)
      </span>
    </div>

    <!-- میترها -->
    <div class="space-y-4">
      <!-- ۱. کشسانی -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-ink">{{ fabricMeterLabels.stretch.title }}</span>
          <span class="text-muted-foreground">{{ stretch }} از ۵</span>
        </div>
        <div class="flex gap-1.5">
          <div
v-for="i in 5" :key="`stretch-${i}`" class="h-1.5 flex-1 rounded-full transition-colors"
            :class="i <= stretch ? 'bg-rose' : 'bg-sand'" />
        </div>
        <p class="text-[10px] text-muted-foreground">
          {{ fabricMeterLabels.stretch.desc }}
        </p>
      </div>

      <!-- ۲. لطافت -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-ink">{{ fabricMeterLabels.softness.title }}</span>
          <span class="text-muted-foreground">{{ softness }} از ۵</span>
        </div>
        <div class="flex gap-1.5">
          <div
v-for="i in 5" :key="`softness-${i}`" class="h-1.5 flex-1 rounded-full transition-colors"
            :class="i <= softness ? 'bg-sage' : 'bg-sand'" />
        </div>
        <p class="text-[10px] text-muted-foreground">
          {{ fabricMeterLabels.softness.desc }}
        </p>
      </div>

      <!-- ۳. پوشش دید (عدم عبور نور) -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-ink">{{ fabricMeterLabels.opacity.title }}</span>
          <span class="text-muted-foreground">{{ opacity }} از ۵</span>
        </div>
        <div class="flex gap-1.5">
          <div
v-for="i in 5" :key="`opacity-${i}`" class="h-1.5 flex-1 rounded-full transition-colors"
            :class="i <= opacity ? 'bg-ink' : 'bg-sand'" />
        </div>
        <p class="text-[10px] text-muted-foreground">
          {{ fabricMeterLabels.opacity.desc }}
        </p>
      </div>
    </div>

    <!-- ترکیب الیاف -->
    <div v-if="composition" class="border-t border-sand pt-3 text-[11px] text-muted-foreground">
      <span class="font-bold text-ink">ترکیب الیاف:</span>
      <span class="ms-1.5">{{ composition }}</span>
    </div>
  </div>
</template>
