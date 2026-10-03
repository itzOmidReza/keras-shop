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
import { Button } from '~/components/ui/button'
import FilterPanel, { type FilterState } from '~/components/catalog/FilterPanel.vue'

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
      side="start"
      class="w-full sm:max-w-md p-6 bg-paper border-sand overflow-y-auto flex flex-col justify-between"
    >
      <div class="space-y-6">
        <SheetHeader class="text-start pb-2 border-b border-sand">
          <SheetTitle class="text-base font-bold text-ink flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4 text-rose" />
            <span>فیلترهای کاتالوگ</span>
          </SheetTitle>
          <SheetDescription class="sr-only">
            پنل فیلتر کاتالوگ پوشاک و اکسسوری کراس
          </SheetDescription>
        </SheetHeader>

        <FilterPanel
          :model-value="modelValue"
          :min-price="minPrice"
          :max-price="maxPrice"
          @update:model-value="val => emit('update:modelValue', val)"
          @reset="emit('reset')"
        />
      </div>

      <div class="pt-6 border-t border-sand sticky bottom-0 bg-paper py-3 mt-4">
        <Button
          class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs cursor-pointer"
          @click="emit('update:open', false)"
        >
          مشاهده نتایج ({{ toFa(totalItems) }} محصول)
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
