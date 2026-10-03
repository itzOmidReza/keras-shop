<script setup lang="ts">
import { Check } from '@lucide/vue'
import { AVAILABLE_COLORS } from '~/composables/catalog/useCatalogFilters'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

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
        v-for="color in AVAILABLE_COLORS"
        :key="color.name"
        type="button"
        class="w-7 h-7 rounded-full border border-sand/70 shadow-2xs transition-all cursor-pointer relative flex items-center justify-center"
        :class="[
          color.bgClass,
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
          :class="color.checkClass"
        />
      </button>
    </div>
  </div>
</template>
