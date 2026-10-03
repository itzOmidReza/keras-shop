<script setup lang="ts">
import { Slider } from '~/components/ui/slider'
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
  <div class="space-y-3 border-t border-sand/60 pt-4">
    <div class="flex items-center justify-between text-xs">
      <span class="font-bold text-ink">محدوده قیمت</span>
      <button
        v-if="modelValue[0] > minPrice || modelValue[1] < maxPrice"
        type="button"
        class="text-[10px] text-rose font-medium hover:underline cursor-pointer"
        @click="resetPrice"
      >
        بازنشانی قیمت
      </button>
    </div>

    <!-- باکس‌های نمایش مبالغ تومان -->
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="rounded-xl border border-sand/80 bg-sand/20 p-2 text-center">
        <span class="block text-[10px] text-muted-foreground font-medium mb-0.5">از حداقل</span>
        <span class="font-bold text-ink">{{ toFa(formatToman(modelValue[0])) }}</span>
      </div>
      <div class="rounded-xl border border-sand/80 bg-sand/20 p-2 text-center">
        <span class="block text-[10px] text-muted-foreground font-medium mb-0.5">تا حداکثر</span>
        <span class="font-bold text-ink">{{ toFa(formatToman(modelValue[1])) }}</span>
      </div>
    </div>

    <div class="pt-2 px-1">
      <Slider
        :model-value="[modelValue[0], modelValue[1]]"
        :min="minPrice"
        :max="maxPrice"
        :step="50000"
        @update:model-value="(val) => updatePrice(val as number[])"
      />
    </div>
  </div>
</template>
