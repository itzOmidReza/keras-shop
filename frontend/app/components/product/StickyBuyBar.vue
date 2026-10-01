<!-- frontend/app/components/product/StickyBuyBar.vue -->
<script setup lang="ts">
import type { Variant } from '~/types/domain'
import { ShoppingBag } from '@lucide/vue'

const props = defineProps<{
  price: number
  compareAtPrice?: number
  variants: Variant[]
  selectedSize?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:selectedSize': [size: string]
  'add-to-cart': []
}>()

// ۱. فیلتر کردن موجودی و استخراج سایزهای کاملاً یکتا (بدون تکرار)
const availableSizes = computed(() => {
  const uniqueSizes = new Set<string>()

  for (const v of props.variants) {
    const hasStock = (v.stock - v.reserved) > 0
    if (hasStock) {
      uniqueSizes.add(v.size)
    }
  }

  return Array.from(uniqueSizes)
})

const isOutOfStock = computed(() => availableSizes.value.length === 0)
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-paper/95 p-3 backdrop-blur-md md:hidden">
    <div class="flex items-center justify-between gap-3">
      <!-- قیمت محصول -->
      <div class="shrink-0">
        <PriceTag :price="price" :compare-at-price="compareAtPrice" size="sm" />
      </div>

      <!-- کنترل انتخاب سایز و افزودن به سبد -->
      <div class="flex flex-1 items-center justify-end gap-2">
        <!-- دراپ‌داون سایزهای یکتا -->
        <div v-if="!isOutOfStock" class="w-24 shrink-0">
          <Select
:model-value="selectedSize || undefined"
            @update:model-value="(val) => emit('update:selectedSize', String(val))">
            <SelectTrigger class="h-11 text-xs rounded-xl border-sand bg-white text-ink font-bold">
              <SelectValue placeholder="سایز" />
            </SelectTrigger>
            <SelectContent class="bg-white border-sand rounded-xl shadow-lg">
              <SelectItem
v-for="size in availableSizes" :key="size" :value="size"
                class="text-xs font-bold py-2 cursor-pointer focus:bg-sand/40">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- دکمه خرید با رنگ اصلی برند (rose) و چینش استاندارد آیکون -->
        <Button
type="button"
          class="h-11 flex-1 gap-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
          :class="[
            selectedSize && !isOutOfStock
              ? 'bg-rose hover:bg-rose/90 text-white'
              : 'bg-sand/60 text-muted-foreground hover:bg-sand/80 cursor-not-allowed',
          ]" :disabled="isOutOfStock || !selectedSize || loading" @click="emit('add-to-cart')">
          <ShoppingBag class="h-4 w-4 shrink-0" />
          <span>{{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد' }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
