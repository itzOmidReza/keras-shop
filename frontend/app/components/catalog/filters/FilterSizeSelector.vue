<!-- frontend/app/components/catalog/filters/FilterSizeSelector.vue -->
<script setup lang="ts">
import { AVAILABLE_SIZES } from '~/composables/catalog/useCatalogFilters'
import { useTaxonomyStore } from '~/stores/taxonomy'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const taxonomyStore = useTaxonomyStore()

const sizesList = computed(() => {
  if (taxonomyStore.sizes && taxonomyStore.sizes.length > 0) {
    return taxonomyStore.sizes.map(s => s.name)
  }
  return AVAILABLE_SIZES
})

function toggleSize(size: string) {
  const current = [...props.modelValue]
  const idx = current.indexOf(size)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(size)
  }
  emit('update:modelValue', current)
}
</script>

<template>
  <div class="space-y-3 border-t border-neutral-100 pt-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
        سایزبندی
      </h3>
      <span v-if="modelValue.length > 0" class="text-[11px] text-neutral-500 font-medium font-mono">
        {{ modelValue.join('، ') }}
      </span>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
      <button
        v-for="size in sizesList"
        :key="size"
        type="button"
        class="h-10 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border flex items-center justify-center tracking-wide"
        :class="[
          modelValue.includes(size)
            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs font-bold'
            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50',
        ]"
        @click="toggleSize(size)"
      >
        {{ size }}
      </button>
    </div>
  </div>
</template>
