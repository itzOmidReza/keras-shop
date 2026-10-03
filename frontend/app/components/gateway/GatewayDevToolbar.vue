<script setup lang="ts">
import { Sparkles } from '@lucide/vue'

const emit = defineEmits<{
  (e: 'fillTestCard', prefix: string): void
  (e: 'simulateSuccess' | 'simulateFail'): void
}>()
</script>

<template>
  <footer class="container mx-auto max-w-4xl mt-6">
    <div class="rounded-2xl border border-sand bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles class="w-4 h-4 text-rose" />
        <span class="font-bold text-ink">ابزار شبیه‌سازی درگاه (ویژه آزمایش):</span>
        <span>پر کردن خودکار کارت:</span>
        <button
          type="button"
          class="text-[11px] text-rose font-bold hover:underline cursor-pointer"
          @click="emit('fillTestCard', '6104 33')"
        >
          ملت
        </button>
        <span>/</span>
        <button
          type="button"
          class="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
          @click="emit('fillTestCard', '6219 86')"
        >
          سامان
        </button>
        <span>/</span>
        <button
          type="button"
          class="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
          @click="emit('fillTestCard', '5054 16')"
        >
          بلوبانک
        </button>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          class="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-sage/20 text-sage hover:bg-sage/30 text-xs font-bold transition-colors cursor-pointer"
          @click="emit('simulateSuccess')"
        >
          تست پرداخت موفق
        </button>

        <button
          type="button"
          class="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-bold transition-colors cursor-pointer"
          @click="emit('simulateFail')"
        >
          تست خطای موجودی
        </button>
      </div>
    </div>
  </footer>
</template>
