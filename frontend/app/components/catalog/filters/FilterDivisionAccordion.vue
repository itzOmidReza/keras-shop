<!-- frontend/app/components/catalog/filters/FilterDivisionAccordion.vue -->
<script setup lang="ts">
import { Check } from '@lucide/vue'
import { toFa } from '~/utils/format'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import {
  AVAILABLE_DIVISIONS,
  APPAREL_CATEGORIES,
  ACCESSORY_CATEGORIES,
} from '~/composables/catalog/useCatalogFilters'
import { useTaxonomyStore } from '~/stores/taxonomy'
import type { ProductDivision, ProductCategory } from '~/types/domain'

const props = defineProps<{
  division: ProductDivision | null
  categories: ProductCategory[]
  apparelCount: number
  accessoriesCount: number
  categoryCounts: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'update:division', val: ProductDivision | null): void
  (e: 'update:categories', val: ProductCategory[]): void
}>()

const taxonomyStore = useTaxonomyStore()

const apparelCategories = computed(() => {
  if (taxonomyStore.apparelCategories.length > 0) {
    return taxonomyStore.apparelCategories.map((c) => ({
      slug: c.slug as ProductCategory,
      label: c.name,
    }))
  }
  return APPAREL_CATEGORIES
})

const accessoryCategories = computed(() => {
  if (taxonomyStore.accessoryCategories.length > 0) {
    return taxonomyStore.accessoryCategories.map((c) => ({
      slug: c.slug as ProductCategory,
      label: c.name,
    }))
  }
  return ACCESSORY_CATEGORIES
})

function toggleCategory(slug: ProductCategory) {
  const current = [...props.categories]
  const idx = current.indexOf(slug)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(slug)
  }
  emit('update:categories', current)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
        دسته‌بندی‌ها
      </h3>
      <span class="text-[11px] text-neutral-400 font-mono">
        {{ toFa(apparelCount + accessoriesCount) }} کالا
      </span>
    </div>

    <!-- کنترل تب‌های شاخه اصلی با استایل مینیمال سوئیسی -->
    <div class="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1 border border-neutral-200/60">
      <button
        type="button"
        class="rounded-lg py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center"
        :class="[
          !division
            ? 'bg-white text-neutral-900 shadow-2xs font-bold'
            : 'text-neutral-500 hover:text-neutral-900',
        ]"
        @click="emit('update:division', null)"
      >
        همه
      </button>
      <button
        v-for="div in AVAILABLE_DIVISIONS"
        :key="div.id"
        type="button"
        class="rounded-lg py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1"
        :class="[
          division === div.id
            ? 'bg-white text-neutral-900 shadow-2xs font-bold'
            : 'text-neutral-500 hover:text-neutral-900',
        ]"
        @click="emit('update:division', division === div.id ? null : div.id)"
      >
        <span>{{ div.label }}</span>
        <span class="text-[10px] text-neutral-400 font-mono">({{ toFa(div.count) }})</span>
      </button>
    </div>

    <!-- لیست آکاردئونی بدون چک‌باکس‌های ضمخت -->
    <Accordion type="multiple" :default-value="['apparel', 'accessories']" class="w-full space-y-1">
      <!-- بخش پوشاک -->
      <AccordionItem
        v-if="!division || division === 'apparel'"
        value="apparel"
        class="border-b border-neutral-100 last:border-b-0"
      >
        <AccordionTrigger class="py-2.5 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:no-underline text-start">
          <div class="flex items-center gap-2">
            <span>پوشاک</span>
            <span class="text-[10px] text-neutral-400 font-mono">
              ({{ toFa(apparelCount) }})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="pt-1 pb-3 space-y-1">
          <button
            v-for="cat in apparelCategories"
            :key="cat.slug"
            type="button"
            class="w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-all cursor-pointer text-start group"
            :class="[
              categories.includes(cat.slug)
                ? 'bg-neutral-100 text-neutral-900 font-bold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-normal',
            ]"
            @click="toggleCategory(cat.slug)"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="w-4 h-4 rounded-xs border flex items-center justify-center transition-all shrink-0"
                :class="[
                  categories.includes(cat.slug)
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'border-neutral-300 bg-white group-hover:border-neutral-400',
                ]"
              >
                <Check v-if="categories.includes(cat.slug)" class="w-3 h-3 stroke-[2.5]" />
              </span>
              <span class="text-xs transition-colors">{{ cat.label }}</span>
            </div>
            <span class="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-600">
              ({{ toFa(categoryCounts[cat.slug] || 0) }})
            </span>
          </button>
        </AccordionContent>
      </AccordionItem>

      <!-- بخش اکسسوری -->
      <AccordionItem
        v-if="!division || division === 'accessories'"
        value="accessories"
        class="border-b border-neutral-100 last:border-b-0"
      >
        <AccordionTrigger class="py-2.5 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:no-underline text-start">
          <div class="flex items-center gap-2">
            <span>اکسسوری و شال‌ها</span>
            <span class="text-[10px] text-neutral-400 font-mono">
              ({{ toFa(accessoriesCount) }})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="pt-1 pb-3 space-y-1">
          <button
            v-for="cat in accessoryCategories"
            :key="cat.slug"
            type="button"
            class="w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-all cursor-pointer text-start group"
            :class="[
              categories.includes(cat.slug)
                ? 'bg-neutral-100 text-neutral-900 font-bold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-normal',
            ]"
            @click="toggleCategory(cat.slug)"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="w-4 h-4 rounded-xs border flex items-center justify-center transition-all shrink-0"
                :class="[
                  categories.includes(cat.slug)
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'border-neutral-300 bg-white group-hover:border-neutral-400',
                ]"
              >
                <Check v-if="categories.includes(cat.slug)" class="w-3 h-3 stroke-[2.5]" />
              </span>
              <span class="text-xs transition-colors">{{ cat.label }}</span>
            </div>
            <span class="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-600">
              ({{ toFa(categoryCounts[cat.slug] || 0) }})
            </span>
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
