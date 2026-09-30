<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import { Slider } from '~/components/ui/slider'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { formatToman } from '~/utils/format'
import { RotateCcw } from '@lucide/vue'

export interface FilterState {
  lines: string[]
  categories: string[]
  priceRange: [number, number]
}

const props = defineProps<{
  modelValue: FilterState
  minPrice?: number
  maxPrice?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
  'reset': []
}>()

const defaultMin = props.minPrice ?? 500000
const defaultMax = props.maxPrice ?? 3500000

const toggleLine = (line: string) => {
  const current = [...props.modelValue.lines]
  const idx = current.indexOf(line)
  if (idx > -1) {
    current.splice(idx, 1)
  }
  else {
    current.push(line)
  }
  emit('update:modelValue', { ...props.modelValue, lines: current })
}

const updatePrice = (val: number[] | undefined) => {
  if (!val || val.length < 2) return

  const [min, max] = val
  if (typeof min !== 'number' || typeof max !== 'number') return

  emit('update:modelValue', {
    ...props.modelValue,
    priceRange: [min, max],
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- هدر فیلتر -->
    <div class="flex items-center justify-between border-b border-sand pb-3">
      <h3 class="text-sm font-bold text-ink">
        فیلترها
      </h3>
      <button
type="button"
        class="inline-flex items-center gap-1 text-xs text-muted hover:text-coral transition-colors cursor-pointer"
        @click="emit('reset')">
        <RotateCcw class="h-3 w-3" />
        <span>پاک کردن</span>
      </button>
    </div>

    <!-- فیلتر خط تولید -->
    <div class="space-y-3">
      <h4 class="text-xs font-bold text-ink">
        خط تولید
      </h4>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <Checkbox
id="line-move" :checked="modelValue.lines.includes('Move')"
            @update:checked="() => toggleLine('Move')" />
          <Label for="line-move" class="text-xs font-medium cursor-pointer">
            Move (عملکردی / تمرینی)
          </Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
id="line-calm" :checked="modelValue.lines.includes('Calm')"
            @update:checked="() => toggleLine('Calm')" />
          <Label for="line-calm" class="text-xs font-medium cursor-pointer">
            Calm (روزمره / راحتی)
          </Label>
        </div>
      </div>
    </div>

    <!-- فیلتر بازه قیمت با اسلایدر -->
    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-ink">محدوده قیمت</span>
        <span class="text-muted text-[11px]">
          {{ formatToman(modelValue.priceRange[0]) }} تا {{ formatToman(modelValue.priceRange[1]) }}
        </span>
      </div>
      <div class="pt-2 px-1">
        <Slider
:model-value="[modelValue.priceRange[0], modelValue.priceRange[1]]" :min="defaultMin" :max="defaultMax"
          :step="50000" @update:model-value="(val) => updatePrice(val as number[])" />
      </div>
    </div>
  </div>
</template>
