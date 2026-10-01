<!-- frontend/app/components/product/SizeSelector.vue -->
<script setup lang="ts">
import type { Variant } from '~/types/domain'
import { Ruler } from '@lucide/vue'

export interface VariantItem {
  id?: number | string
  size: string
  stock?: number
  reserved?: number
  is_available?: boolean
}

const props = defineProps<{
  modelValue: string | null
  variants?: (Variant | VariantItem)[]
  sizes?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'openSizeGuide': []
}>()

// استخراج سایزهای یکتا و بررسی موجودی واقعی (stock - reserved)
const sizeList = computed(() => {
  // ۱. اگر variants وجود داشته باشد، موجودی واقعی را محاسبه می‌کنیم
  if (props.variants && props.variants.length > 0) {
    const stockMap = new Map<string, number>()

    for (const v of props.variants) {
      const availableCount = (v.stock ?? 0) - (v.reserved ?? 0)
      const current = stockMap.get(v.size) ?? 0
      stockMap.set(v.size, current + Math.max(0, availableCount))
    }

    return Array.from(stockMap.entries()).map(([size, stock]) => ({
      size,
      inStock: stock > 0,
    }))
  }

  // ۲. اگر آرایه ساده sizes پاس داده شده باشد
  if (props.sizes && props.sizes.length > 0) {
    return props.sizes.map((size) => ({
      size,
      inStock: true,
    }))
  }

  return []
})

const selectSize = (size: string, inStock: boolean) => {
  if (!inStock) return
  emit('update:modelValue', size)
}
</script>

<template>
  <div v-if="sizeList.length > 0" class="space-y-3">
    <!-- عنوان سایز و دکمه راهنما -->
    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-1.5 font-bold text-ink">
        <span>سایز:</span>
        <span v-if="modelValue" class="text-rose font-bold">{{ modelValue }}</span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-ink transition-colors cursor-pointer"
        @click="emit('openSizeGuide')"
      >
        <Ruler class="w-3.5 h-3.5 text-rose" />
        <span>راهنمای سایز</span>
      </button>
    </div>

    <!-- دکمه‌های سایز با استایل ادیتوریال -->
    <div class="flex flex-wrap gap-2.5">
      <button
        v-for="item in sizeList"
        :key="item.size"
        type="button"
        :disabled="!item.inStock"
        class="min-w-14 h-11 px-4 flex items-center justify-center rounded-xl border text-sm font-bold transition-all"
        :class="[
          !item.inStock
            ? 'border-sand/60 bg-sand/20 text-muted-foreground/40 cursor-not-allowed line-through'
            : modelValue === item.size
              ? 'border-rose bg-rose text-white shadow-xs'
              : 'border-sand bg-white text-ink hover:border-rose/50 hover:bg-sand/30 cursor-pointer',
        ]"
        @click="selectSize(item.size, item.inStock)"
      >
        {{ item.size }}
      </button>
    </div>
  </div>
</template>
