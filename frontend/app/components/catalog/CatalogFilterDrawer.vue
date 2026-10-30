<!-- frontend/app/components/catalog/CatalogFilterDrawer.vue -->
<script setup lang="ts">
import { SlidersHorizontal } from '@lucide/vue'
import { toFa } from '~/utils/format'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
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
      class="w-full sm:max-w-md md:max-w-lg p-0 bg-paper border-sand overflow-y-auto overflow-x-hidden flex flex-col justify-between"
    >
      <div class="space-y-0">
        <SheetHeader class="text-start px-5 py-4 border-b border-sand bg-white/60 backdrop-blur-xs">
          <SheetTitle class="text-base font-bold text-ink flex items-center justify-between">
            <span class="flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-rose" />
              <span>فیلترهای کاتالوگ</span>
            </span>
            <span class="text-xs font-normal text-muted-foreground font-mono">
              {{ toFa(totalItems) }} کالا
            </span>
          </SheetTitle>
          <SheetDescription class="sr-only">
            پنل فیلتر پیشرفته کاتالوگ پوشاک و اکسسوری کراس
          </SheetDescription>
        </SheetHeader>

        <!-- پنل فیلتر همراه با نوار استیکی مشترک اعمال فیلترها و ریست -->
        <FilterPanel
          :model-value="modelValue"
          :min-price="minPrice"
          :max-price="maxPrice"
          @update:model-value="val => emit('update:modelValue', val)"
          @reset="emit('reset')"
          @applied="emit('update:open', false)"
        />
      </div>
    </SheetContent>
  </Sheet>
</template>
