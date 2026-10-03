<script setup lang="ts">
import { toFa } from '~/utils/format'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import {
  AVAILABLE_DIVISIONS,
  APPAREL_CATEGORIES,
  ACCESSORY_CATEGORIES,
} from '~/composables/catalog/useCatalogFilters'
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
  <div class="space-y-3 border-t border-sand/60 pt-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xs font-bold text-ink">
        شاخه و دسته‌بندی‌ها
      </h4>
      <span class="text-[10px] text-muted-foreground">شامل {{ toFa(apparelCount + accessoriesCount) }} کالا</span>
    </div>

    <!-- کنترل تب شاخه اصلی -->
    <div class="grid grid-cols-3 gap-1 rounded-xl bg-sand/30 p-1 border border-sand/60">
      <button
        type="button"
        class="rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer"
        :class="[
          !division
            ? 'bg-white text-ink shadow-2xs'
            : 'text-muted-foreground hover:text-ink',
        ]"
        @click="emit('update:division', null)"
      >
        همه
      </button>
      <button
        v-for="div in AVAILABLE_DIVISIONS"
        :key="div.id"
        type="button"
        class="rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
        :class="[
          division === div.id
            ? 'bg-rose text-white shadow-2xs'
            : 'text-muted-foreground hover:text-ink',
        ]"
        @click="emit('update:division', division === div.id ? null : div.id)"
      >
        <span>{{ div.label }}</span>
        <span class="text-[10px] opacity-80">({{ toFa(div.count) }})</span>
      </button>
    </div>

    <!-- آکاردئون اختصاصی پوشاک و اکسسوری با شمارنده‌های زنده -->
    <Accordion type="multiple" :default-value="['apparel', 'accessories']" class="w-full">
      <!-- بخش پوشاک -->
      <AccordionItem
        v-if="!division || division === 'apparel'"
        value="apparel"
        class="border-b border-sand/50"
      >
        <AccordionTrigger class="py-2.5 text-xs font-bold text-ink hover:no-underline text-start">
          <div class="flex items-center gap-2">
            <span>پوشاک (Apparel)</span>
            <span class="rounded-full bg-sand/60 text-muted-foreground px-2 py-0.5 text-[10px] font-bold">
              {{ toFa(apparelCount) }} کالا
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="pt-1 pb-3 space-y-2">
          <div
            v-for="cat in APPAREL_CATEGORIES"
            :key="cat.slug"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <Checkbox
                :id="`cat-${cat.slug}`"
                :checked="categories.includes(cat.slug)"
                @update:checked="() => toggleCategory(cat.slug)"
              />
              <Label
                :for="`cat-${cat.slug}`"
                class="text-xs font-medium cursor-pointer text-ink select-none"
              >
                {{ cat.label }}
              </Label>
            </div>
            <span class="text-[10px] text-muted-foreground font-medium">
              {{ toFa(categoryCounts[cat.slug] || 0) }}
            </span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <!-- بخش اکسسوری -->
      <AccordionItem
        v-if="!division || division === 'accessories'"
        value="accessories"
        class="border-b border-sand/50"
      >
        <AccordionTrigger class="py-2.5 text-xs font-bold text-ink hover:no-underline text-start">
          <div class="flex items-center gap-2">
            <span>اکسسوری و شال‌ها (Accessories)</span>
            <span class="rounded-full bg-sand/60 text-muted-foreground px-2 py-0.5 text-[10px] font-bold">
              {{ toFa(accessoriesCount) }} کالا
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="pt-1 pb-3 space-y-2">
          <div
            v-for="cat in ACCESSORY_CATEGORIES"
            :key="cat.slug"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <Checkbox
                :id="`cat-${cat.slug}`"
                :checked="categories.includes(cat.slug)"
                @update:checked="() => toggleCategory(cat.slug)"
              />
              <Label
                :for="`cat-${cat.slug}`"
                class="text-xs font-medium cursor-pointer text-ink select-none"
              >
                {{ cat.label }}
              </Label>
            </div>
            <span class="text-[10px] text-muted-foreground font-medium">
              {{ toFa(categoryCounts[cat.slug] || 0) }}
            </span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
