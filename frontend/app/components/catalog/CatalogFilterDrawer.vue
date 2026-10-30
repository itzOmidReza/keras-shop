<!-- frontend/app/components/catalog/CatalogFilterDrawer.vue -->
<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '~/components/ui/sheet'
import type { FilterState } from '~/components/catalog/FilterPanel.vue'

defineProps<{
  open: boolean
  modelValue: FilterState
  totalItems: number
  minPrice: number
  maxPrice: number
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'update:modelValue', val: FilterState): void
  (e: 'reset'): void
}>()
</script>

<template>
  <Sheet :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <SheetContent
      v-if="open"
      side="start"
      class="w-full sm:max-w-md p-0 bg-white border-neutral-200 flex flex-col h-full shadow-2xl overflow-hidden"
    >
      <SheetTitle class="sr-only">فیلترهای کاتالوگ کراس</SheetTitle>
      <SheetDescription class="sr-only">
        پنل فیلتر کاتالوگ پوشاک و اکسسوری فروشگاه کراس
      </SheetDescription>

      <!-- پنل فیلتر همراه با هدر مینیمال، بدنه اسکرول‌پذیر و فوتر استیکی اعمال نتایج -->
      <FilterPanel
        :model-value="modelValue"
        :total-items="totalItems"
        :min-price="minPrice"
        :max-price="maxPrice"
        @update:model-value="val => emit('update:modelValue', val)"
        @reset="emit('reset')"
        @applied="emit('update:open', false)"
      />
    </SheetContent>
  </Sheet>
</template>
