<!-- frontend/app/components/product/StickyBuyBar.vue -->
<script setup lang="ts">
import type { Variant } from '~/types/domain'
import PriceTag from '~/components/product/PriceTag.vue'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
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

const availableSizes = computed(() => {
  return props.variants
    .filter(v => (v.stock - v.reserved) > 0)
    .map(v => v.size)
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

      <!-- کنترل سایز و افزودن به سبد -->
      <div class="flex flex-1 items-center justify-end gap-2">
        <div v-if="!isOutOfStock" class="w-24 shrink-0">
          <Select
:model-value="selectedSize || undefined"
            @update:model-value="(val) => emit('update:selectedSize', String(val))">
            <SelectTrigger class="h-10 text-xs">
              <SelectValue placeholder="سایز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in availableSizes" :key="size" :value="size">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
type="button" class="h-10 flex-1 gap-1.5 text-xs font-bold"
          :disabled="isOutOfStock || !selectedSize || loading" @click="emit('add-to-cart')">
          <ShoppingBag class="h-4 w-4" />
          <span>{{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد' }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
