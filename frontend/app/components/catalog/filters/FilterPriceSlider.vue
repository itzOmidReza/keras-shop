<!-- frontend/app/components/catalog/filters/FilterPriceSlider.vue -->
<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { formatToman, toFa } from '~/utils/format'

const props = defineProps<{
  modelValue: [number, number]
  minPrice: number
  maxPrice: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: [number, number]): void
}>()

function updatePrice(val: number[] | undefined) {
  if (!val || val.length < 2) return
  const [min, max] = val
  if (typeof min !== 'number' || typeof max !== 'number') return
  emit('update:modelValue', [min, max])
}

function resetPrice() {
  emit('update:modelValue', [props.minPrice, props.maxPrice])
}
</script>

<template>
  <div class="space-y-4 border-t border-neutral-100 pt-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
        محدوده قیمت
      </h3>
      <button
        v-if="modelValue[0] > minPrice || modelValue[1] < maxPrice"
        type="button"
        class="text-[11px] text-neutral-500 hover:text-rose transition-colors cursor-pointer"
        @click="resetPrice"
      >
        بازنشانی قیمت
      </button>
    </div>

    <!-- اسلایدر با ترک نازک خنثی و دکمه‌های اسلاید باوقار -->
    <div class="pt-3 pb-1 px-1">
      <SliderRoot
        :model-value="[modelValue[0], modelValue[1]]"
        :min="minPrice"
        :max="maxPrice"
        :step="50000"
        class="relative flex w-full touch-none select-none items-center"
        @update:model-value="(val) => updatePrice(val as number[])"
      >
        <SliderTrack class="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-200">
          <SliderRange class="absolute h-full bg-neutral-900" />
        </SliderTrack>
        <SliderThumb
          v-for="(_, key) in [modelValue[0], modelValue[1]]"
          :key="key"
          class="block h-4 w-4 rounded-full border-2 border-neutral-900 bg-white shadow-xs transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing"
        />
      </SliderRoot>
    </div>

    <!-- مبالغ با تایپوگرافی تمیز و خلوت ادیتوریال -->
    <div class="flex items-center justify-between text-xs text-neutral-600 font-medium font-mono">
      <span>از {{ toFa(formatToman(modelValue[0])) }}</span>
      <span class="text-neutral-400 text-[11px]">تا</span>
      <span>{{ toFa(formatToman(modelValue[1])) }}</span>
    </div>
  </div>
</template>
