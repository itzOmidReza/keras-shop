<!-- frontend/app/components/ui/PriceTag.vue -->
<script setup lang="ts">
import { formatToman } from '~/utils/format'

withDefaults(
  defineProps<{
    price: number
    compareAtPrice?: number
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    compareAtPrice: undefined,
    size: 'md',
  },
)
</script>

<template>
  <div class="flex items-center gap-2 font-sans">
    <!-- قیمت نهایی فروش -->
    <span
class="font-bold text-ink" :class="{
      'text-sm': size === 'sm',
      'text-base': size === 'md',
      'text-xl': size === 'lg',
    }">
      {{ formatToman(price) }}
    </span>

    <!-- قیمت قبل از تخفیف (در صورت وجود) -->
    <span
v-if="compareAtPrice && compareAtPrice > price" class="text-xs text-muted line-through"
      :class="{ 'text-sm': size === 'lg' }">
      {{ formatToman(compareAtPrice) }}
    </span>
  </div>
</template>
