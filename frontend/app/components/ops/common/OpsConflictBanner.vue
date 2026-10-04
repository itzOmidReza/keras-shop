<!-- frontend/app/components/ops/common/OpsConflictBanner.vue -->
<script setup lang="ts">
import { AlertCircle, RefreshCw, X } from '@lucide/vue'

defineProps<{
  show: boolean
  operatorName?: string
  updatedTime?: string
}>()

const emit = defineEmits<{
  (e: 'dismiss' | 'reload'): void
}>()
</script>

<template>
  <div
    v-if="show"
    class="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-200"
  >
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
        <AlertCircle class="w-4 h-4" />
      </div>
      <div>
        <span class="font-bold text-amber-950 block">هشدار همزمانی ویرایش (Concurrent Edit Conflict)</span>
        <span class="text-2xs text-amber-800">
          این سند در ساعت {{ updatedTime || '۱۰:۴۲' }} توسط «{{ operatorName || 'رضا کمالی (انبار مرکزی)' }}» ویرایش شده است. برای مشاهده آخرین داده‌ها، جدول را همگام‌سازی کنید.
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        type="button"
        class="h-7 px-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-2xs flex items-center gap-1 cursor-pointer"
        @click="emit('reload')"
      >
        <RefreshCw class="w-3 h-3" />
        <span>همگام‌سازی داده‌ها</span>
      </button>
      <button
        type="button"
        class="text-amber-800 hover:text-amber-950 p-1 cursor-pointer"
        @click="emit('dismiss')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
