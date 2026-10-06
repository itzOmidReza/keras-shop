<script setup lang="ts">
import { Check } from '@lucide/vue'
import { useTaxonomyStore } from '~/stores/taxonomy'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const taxonomyStore = useTaxonomyStore()

function isDarkColor(hex: string): boolean {
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
  <div class="space-y-2.5 border-t border-sand/60 pt-4">
    <h4 class="text-xs font-bold text-ink">
      رنگ‌بندی طبیعی
    </h4>
    <div class="flex flex-wrap gap-2.5">
      <button
        v-for="color in taxonomyStore.colors"
        :key="color.id || color.name"
        type="button"
        class="w-7 h-7 rounded-full border border-sand/70 shadow-2xs transition-all cursor-pointer relative flex items-center justify-center"
        :style="{ backgroundColor: color.hex }"
        :class="[
          modelValue.includes(color.name)
            ? 'ring-2 ring-rose ring-offset-2 scale-105'
            : 'hover:scale-110',
        ]"
        :title="color.name"
        :aria-label="color.name"
        @click="toggleColor(color.name)"
      >
        <Check
          v-if="modelValue.includes(color.name)"
          class="w-3.5 h-3.5 stroke-[2.5]"
          :class="isDarkColor(color.hex) ? 'text-white' : 'text-ink'"
        />
      </button>
    </div>
  </div>
</template>
