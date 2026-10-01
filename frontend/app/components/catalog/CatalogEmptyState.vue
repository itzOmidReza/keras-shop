<!-- frontend/app/components/catalog/CatalogEmptyState.vue -->
<script setup lang="ts">
import { FilterX, RotateCcw } from '@lucide/vue'

defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="rounded-3xl border border-dashed border-sand bg-white/70 p-8 sm:p-14 text-center space-y-5">
    <div class="w-16 h-16 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-rose/80">
      <FilterX class="w-8 h-8" />
    </div>

    <div class="space-y-1.5">
      <h3 class="text-base sm:text-lg font-bold text-ink">
        محصولی با فیلترهای انتخابی یافت نشد
      </h3>
      <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        ترکیب فیلترهای اعمال شده نتیجه‌ای در بر نداشت. می‌توانید فیلترها را حذف کرده یا محدوده قیمت را تغییر دهید.
      </p>
    </div>

    <Button
      variant="outline"
      size="sm"
      class="rounded-xl border-sand text-ink hover:text-rose hover:bg-sand/30 font-bold text-xs h-10 px-5 gap-2 cursor-pointer shadow-2xs"
      @click="$emit('reset')"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>پاک کردن همه فیلترها</span>
    </Button>
  </div>
</template>
