<!-- frontend/app/components/catalog/filters/FilterColorSwatches.vue -->
<script setup lang="ts">
import { Check } from '@lucide/vue'
import { AVAILABLE_COLORS } from '~/composables/catalog/useCatalogFilters'
import { useTaxonomyStore } from '~/stores/taxonomy'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const taxonomyStore = useTaxonomyStore()
const hoveredColor = ref<string | null>(null)

const colorsList = computed(() => {
  if (taxonomyStore.colors && taxonomyStore.colors.length > 0) {
    return taxonomyStore.colors
  }
  return AVAILABLE_COLORS.map((c, i) => ({
    id: i,
    name: c.name,
    hex: c.name.includes('مشکی') ? '#1C1917' : c.name.includes('سبز') ? '#8DA399' : c.name.includes('خاک') ? '#C87D55' : c.name.includes('رز') ? '#B76E79' : c.name.includes('شنی') ? '#D8CBB9' : '#F5F2EB',
  }))
})

const selectedColorNames = computed(() => {
  if (props.modelValue.length === 0) return ''
  return props.modelValue.join('، ')
})

function isDarkColor(hex?: string): boolean {
  if (!hex || !hex.startsWith('#')) return false
  const c = hex.substring(1)
  const rgb = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luma < 150
}

function toggleColor(colorName: string) {
  const current = [...props.modelValue]
  const idx = current.indexOf(colorName)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(colorName)
  }
  emit('update:modelValue', current)
}
</script>

<template>
  <div class="space-y-3.5 border-t border-neutral-100 pt-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
        رنگ‌بندی
      </h3>
      <span class="text-[11px] text-neutral-500 font-medium transition-colors">
        {{ hoveredColor || selectedColorNames }}
      </span>
    </div>

    <div class="flex flex-wrap gap-3.5">
      <button
        v-for="color in colorsList"
        :key="color.id || color.name"
        type="button"
        class="w-8 h-8 rounded-full border border-neutral-200/90 shadow-2xs transition-all duration-200 cursor-pointer relative flex items-center justify-center"
        :style="{ backgroundColor: color.hex }"
        :class="[
          modelValue.includes(color.name)
            ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-xs'
            : 'hover:scale-110 hover:shadow-xs',
        ]"
        :title="color.name"
        :aria-label="color.name"
        @mouseenter="hoveredColor = color.name"
        @mouseleave="hoveredColor = null"
        @click="toggleColor(color.name)"
      >
        <Check
          v-if="modelValue.includes(color.name)"
          class="w-3.5 h-3.5 stroke-[2.5]"
          :class="isDarkColor(color.hex) ? 'text-white' : 'text-neutral-900'"
        />
      </button>
    </div>
  </div>
</template>
