<!-- frontend/app/components/catalog/SortSelect.vue -->
<script setup lang="ts">
import { ArrowUpDown } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: 'bestseller',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sortOptions = [
  { value: 'bestseller', label: 'محبوب‌ترین و پرفروش' },
  { value: 'newest', label: 'جدیدترین‌ها' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
]
</script>

<template>
  <div class="flex items-center gap-2">
    <Select
      :model-value="props.modelValue"
      @update:model-value="(val) => emit('update:modelValue', String(val))"
    >
      <SelectTrigger class="h-10 w-44 gap-2 text-xs font-bold rounded-xl border-sand bg-white text-ink shadow-2xs cursor-pointer hover:border-sand/80 focus:ring-rose/20">
        <ArrowUpDown class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <SelectValue placeholder="مرتب‌سازی" />
      </SelectTrigger>
      <SelectContent class="rounded-xl border-sand bg-white shadow-xl">
        <SelectItem
          v-for="opt in sortOptions"
          :key="opt.value"
          :value="opt.value"
          class="text-xs font-medium cursor-pointer focus:bg-sand/40 focus:text-rose"
        >
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
