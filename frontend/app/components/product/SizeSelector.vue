<!-- frontend/app/components/product/SizeSelector.vue -->
<script setup lang="ts">
import type { Variant } from '~/types/domain'
import { Ruler } from '@lucide/vue'

const props = defineProps<{
  variants: Variant[]
  modelValue?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [size: string]
  'open-size-guide': []
}>()

const sizes = computed(() => {
  const sizeMap = new Map<string, { size: string; inStock: boolean; stock: number }>()

  for (const v of props.variants) {
    const existing = sizeMap.get(v.size)
    const hasStock = (v.stock - v.reserved) > 0
    if (!existing) {
      sizeMap.set(v.size, {
        size: v.size,
        inStock: hasStock,
        stock: Math.max(0, v.stock - v.reserved),
      })
    }
    else {
      existing.inStock = existing.inStock || hasStock
      existing.stock += Math.max(0, v.stock - v.reserved)
    }
  }

  return Array.from(sizeMap.values())
})

const selectSize = (item: { size: string; inStock: boolean }) => {
  if (!item.inStock) return
  emit('update:modelValue', item.size)
}
</script>

<template>
  <div class="space-y-3">
    <!-- هدر بخش سایز -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-ink">انتخاب سایز</span>
        <span v-if="modelValue" class="text-xs font-bold text-rose bg-rose/10 px-2.5 py-0.5 rounded-full">
          {{ modelValue }}
        </span>
      </div>

      <!-- دکمه راهنمای اندازه‌گیری -->
      <button
type="button"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-ink transition-colors cursor-pointer"
        @click="emit('open-size-guide')">
        <Ruler class="w-3.5 h-3.5 text-rose" />
        <span>راهنمای اندازه‌گیری</span>
      </button>
    </div>

    <!-- دکمه‌های سایز -->
    <div role="radiogroup" aria-label="انتخاب سایز محصول" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
      <button
v-for="item in sizes" :key="item.size" type="button" role="radio" :aria-checked="modelValue === item.size"
        :aria-disabled="!item.inStock" :disabled="!item.inStock"
        class="relative flex h-11 items-center justify-center rounded-btn border text-sm font-bold transition-all"
        :class="[
          !item.inStock
            ? 'border-sand bg-sand/30 text-muted-foreground/40 cursor-not-allowed line-through'
            : modelValue === item.size
              ? 'border-ink bg-ink text-paper shadow-sm'
              : 'border-sand bg-white text-ink hover:border-ink hover:bg-sand/30 cursor-pointer'
        ]" @click="selectSize(item)">
        <span>{{ item.size }}</span>

        <span v-if="item.inStock && item.stock <= 2" class="absolute -top-1 -end-1 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
          <span class="relative inline-flex rounded-full h-2 w-2 bg-rose" />
        </span>
      </button>
    </div>

    <p v-if="!modelValue" class="text-[11px] text-muted-foreground font-medium">
      لطفاً پیش از افزودن به سبد، سایز خود را مشخص کنید.
    </p>
  </div>
</template>
