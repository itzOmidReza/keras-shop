<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import { formatToman, toFa } from '~/utils/format'
import { RotateCcw, X, SlidersHorizontal, Check } from '@lucide/vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import type { ProductDivision, ProductCategory, ProductSeason } from '~/types/domain'

export interface FilterState {
  season: ProductSeason | null
  division: ProductDivision | null
  categories: ProductCategory[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  line?: 'move' | 'calm' | null
  brand?: string | null
}

const props = withDefaults(
  defineProps<{
    modelValue: FilterState
    minPrice?: number
    maxPrice?: number
    apparelCount?: number
    accessoriesCount?: number
    categoryCounts?: Record<string, number>
  }>(),
  {
    minPrice: 300000,
    maxPrice: 5500000,
    apparelCount: 16,
    accessoriesCount: 8,
    categoryCounts: () => ({
      'shirts-blouses': 4,
      'knitwear': 4,
      'coats-jackets': 3,
      'pants': 3,
      'tops': 2,
      'hair-accessories': 3,
      'bandanas': 3,
      'scarves': 2,
    }),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
  'reset': []
}>()

// ۱. فصل‌ها و کالکشن‌ها
const availableSeasons: { id: ProductSeason; label: string; badge?: string }[] = [
  { id: 'fall-1405', label: 'پاییز ۱۴۰۵', badge: 'جدید' },
  { id: 'winter-1405', label: 'زمستان ۱۴۰۵' },
  { id: 'spring-1406', label: 'بهار ۱۴۰۶', badge: 'پیش‌نمایش' },
  { id: 'summer-1405', label: 'تابستان ۱۴۰۵', badge: 'آرشیو' },
]

// ۲. برندهای معتبر بین‌المللی و آتلیه کراس
const partnerBrands = [
  { slug: 'keras-atelier', fa: 'کراس آتلیه', en: 'Keras Atelier' },
  { slug: 'toteme', fa: 'توتِم', en: 'Totême' },
  { slug: 'massimo-dutti', fa: 'ماسیمو دوتی', en: 'Massimo Dutti' },
  { slug: 'cos', fa: 'کاس', en: 'COS' },
  { slug: 'zara', fa: 'زارا', en: 'Zara' },
  { slug: 'mango', fa: 'منگو', en: 'Mango' },
]

// ۳. شاخه‌های اصلی
const availableDivisions: { id: ProductDivision; label: string; count: number }[] = [
  { id: 'apparel', label: 'پوشاک', count: 16 },
  { id: 'accessories', label: 'اکسسوری', count: 8 },
]

// ۴. دسته‌بندی‌های پوشاک و اکسسوری
const apparelCategories: { slug: ProductCategory; label: string }[] = [
  { slug: 'shirts-blouses', label: 'پیراهن و شومیز' },
  { slug: 'knitwear', label: 'بافت و پلیور' },
  { slug: 'coats-jackets', label: 'پالتو و کاپشن' },
  { slug: 'pants', label: 'شلوار' },
  { slug: 'tops', label: 'تیشرت و تاپ' },
]

const accessoryCategories: { slug: ProductCategory; label: string }[] = [
  { slug: 'hair-accessories', label: 'اکسسوری مو (اسکرانچی و گیره)' },
  { slug: 'bandanas', label: 'دستمال سر' },
  { slug: 'scarves', label: 'اسکارف و شال' },
]

// ۵. سایزبندی لوکس
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free Size']

// ۶. رنگ‌بندی‌های طبیعی (بدون هگز ۶ رقمی خام)
const availableColors = [
  { name: 'مشکی موکا', bgClass: 'bg-ink', checkClass: 'text-white' },
  { name: 'سبز مریم‌گلی', bgClass: 'bg-sage', checkClass: 'text-ink' },
  { name: 'خاک رس', bgClass: 'bg-clay', checkClass: 'text-white' },
  { name: 'رز کراس', bgClass: 'bg-rose', checkClass: 'text-white' },
  { name: 'شنی نچرال', bgClass: 'bg-sand', checkClass: 'text-ink' },
  { name: 'عاجی روشن', bgClass: 'bg-paper border border-sand/80', checkClass: 'text-ink' },
]

// متدهای تغییر استیت
const setSeason = (season: ProductSeason | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    season,
  })
}

const setDivision = (division: ProductDivision | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    division,
  })
}

const setBrand = (brand: string | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    brand,
  })
}

const toggleCategory = (slug: ProductCategory) => {
  const current = [...props.modelValue.categories]
  const idx = current.indexOf(slug)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(slug)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    categories: current,
  })
}

const toggleSize = (size: string) => {
  const current = [...props.modelValue.sizes]
  const idx = current.indexOf(size)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(size)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    sizes: current,
  })
}

const toggleColor = (colorName: string) => {
  const current = [...props.modelValue.colors]
  const idx = current.indexOf(colorName)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(colorName)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    colors: current,
  })
}

const updatePrice = (val: number[] | undefined) => {
  if (!val || val.length < 2) return
  const [min, max] = val
  if (typeof min !== 'number' || typeof max !== 'number') return
  emit('update:modelValue', {
    ...props.modelValue,
    priceRange: [min, max],
  })
}

const resetPrice = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    priceRange: [props.minPrice, props.maxPrice],
  })
}

const getCategoryName = (slug: string): string => {
  const all = [...apparelCategories, ...accessoryCategories]
  const found = all.find(c => c.slug === slug)
  return found ? found.label : slug
}

const getSeasonName = (season: ProductSeason): string => {
  const found = availableSeasons.find(s => s.id === season)
  return found ? found.label : season
}

const getBrandName = (brandSlug: string): string => {
  const found = partnerBrands.find(b => b.slug === brandSlug)
  return found ? found.fa : brandSlug
}

// تعداد کل فیلترهای فعال
const activeFilterCount = computed(() => {
  let count = 0
  if (props.modelValue.season) count++
  if (props.modelValue.division) count++
  if (props.modelValue.brand) count++
  count += props.modelValue.categories.length
  count += props.modelValue.sizes.length
  count += props.modelValue.colors.length
  if (
    props.modelValue.priceRange[0] > props.minPrice ||
    props.modelValue.priceRange[1] < props.maxPrice
  ) {
    count++
  }
  return count
})
</script>

<template>
  <div class="space-y-6">
    <!-- هدر فیلتر و دکمه بازنشانی (Active Filter Chips Bar Header) -->
    <div class="flex items-center justify-between border-b border-sand pb-4">
      <div class="flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-rose" />
        <h3 class="text-sm font-bold text-ink">
          فیلترهای کاتالوگ
        </h3>
        <span
          v-if="activeFilterCount > 0"
          class="rounded-full bg-rose/10 text-rose px-2 py-0.5 text-[10px] font-bold"
        >
          {{ toFa(activeFilterCount) }}
        </span>
      </div>

      <button
        v-if="activeFilterCount > 0"
        type="button"
        class="inline-flex items-center gap-1 text-xs font-medium text-rose hover:text-rose/80 transition-colors cursor-pointer"
        @click="emit('reset')"
      >
        <RotateCcw class="h-3 w-3" />
        <span>پاک کردن همه فیلترها</span>
      </button>
    </div>

    <!-- چیپ‌های فیلترهای فعال (Active Filter Chips Bar) -->
    <div v-if="activeFilterCount > 0" class="flex flex-wrap gap-1.5 pb-2 border-b border-sand/60">
      <!-- چیپ فصل -->
      <span
        v-if="modelValue.season"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>فصل: {{ getSeasonName(modelValue.season) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر فصل"
          @click="setSeason(null)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ شاخه اصلی -->
      <span
        v-if="modelValue.division"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>شاخه: {{ modelValue.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر شاخه"
          @click="setDivision(null)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ برند -->
      <span
        v-if="modelValue.brand"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>برند: {{ getBrandName(modelValue.brand) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر برند"
          @click="setBrand(null)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ دسته‌بندی‌ها -->
      <span
        v-for="cat in modelValue.categories"
        :key="cat"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ getCategoryName(cat) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر ${getCategoryName(cat)}`"
          @click="toggleCategory(cat)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ سایزها -->
      <span
        v-for="size in modelValue.sizes"
        :key="size"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>سایز {{ size }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر سایز ${size}`"
          @click="toggleSize(size)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ رنگ‌ها -->
      <span
        v-for="color in modelValue.colors"
        :key="color"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ color }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر رنگ ${color}`"
          @click="toggleColor(color)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ بازه قیمت -->
      <span
        v-if="modelValue.priceRange[0] > minPrice || modelValue.priceRange[1] < maxPrice"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>قیمت: {{ toFa(formatToman(modelValue.priceRange[0])) }} تا {{ toFa(formatToman(modelValue.priceRange[1])) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر قیمت"
          @click="resetPrice"
        >
          <X class="w-3 h-3" />
        </button>
      </span>
    </div>

    <!-- ۱. فصل و کالکشن (Seasons) -->
    <div class="space-y-2.5">
      <h4 class="text-xs font-bold text-ink">
        فصل و کالکشن
      </h4>
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="s in availableSeasons"
          :key="s.id"
          type="button"
          class="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-all cursor-pointer border"
          :class="[
            modelValue.season === s.id
              ? 'border-rose bg-rose text-white shadow-xs'
              : 'border-sand bg-white text-ink hover:bg-sand/20',
          ]"
          @click="setSeason(modelValue.season === s.id ? null : s.id)"
        >
          <span>{{ s.label }}</span>
          <span
            v-if="s.badge"
            class="text-[9px] px-1.5 py-0.2 rounded-full"
            :class="modelValue.season === s.id ? 'bg-white/20 text-white' : 'bg-rose/10 text-rose'"
          >
            {{ s.badge }}
          </span>
        </button>
      </div>
    </div>

    <!-- ۲. شاخه اصلی و آکاردئون دسته‌بندی‌ها (Collections & Division Accordion) -->
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
            !modelValue.division
              ? 'bg-white text-ink shadow-2xs'
              : 'text-muted-foreground hover:text-ink',
          ]"
          @click="setDivision(null)"
        >
          همه
        </button>
        <button
          v-for="div in availableDivisions"
          :key="div.id"
          type="button"
          class="rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
          :class="[
            modelValue.division === div.id
              ? 'bg-rose text-white shadow-2xs'
              : 'text-muted-foreground hover:text-ink',
          ]"
          @click="setDivision(modelValue.division === div.id ? null : div.id)"
        >
          <span>{{ div.label }}</span>
          <span class="text-[10px] opacity-80">({{ toFa(div.count) }})</span>
        </button>
      </div>

      <!-- آکاردئون اختصاصی پوشاک و اکسسوری با شمارنده‌های زنده -->
      <Accordion type="multiple" :default-value="['apparel', 'accessories']" class="w-full">
        <!-- بخش پوشاک -->
        <AccordionItem
          v-if="!modelValue.division || modelValue.division === 'apparel'"
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
              v-for="cat in apparelCategories"
              :key="cat.slug"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <Checkbox
                  :id="`cat-${cat.slug}`"
                  :checked="modelValue.categories.includes(cat.slug)"
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
          v-if="!modelValue.division || modelValue.division === 'accessories'"
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
              v-for="cat in accessoryCategories"
              :key="cat.slug"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <Checkbox
                  :id="`cat-${cat.slug}`"
                  :checked="modelValue.categories.includes(cat.slug)"
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

    <!-- ۳. فیلتر برندهای همکار (Partner Brands) -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold text-ink">
          برندهای همکار و آتلیه
        </h4>
        <span
          v-if="modelValue.brand"
          class="text-[10px] text-rose font-medium cursor-pointer"
          @click="setBrand(null)"
        >
          حذف فیلتر برند
        </span>
      </div>
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="b in partnerBrands"
          :key="b.slug"
          type="button"
          class="flex flex-col items-start rounded-xl px-2.5 py-2 text-start transition-all cursor-pointer border"
          :class="[
            modelValue.brand === b.slug
              ? 'border-rose bg-rose text-white shadow-xs font-bold'
              : 'border-sand bg-white text-ink hover:border-sand/80 hover:bg-sand/20',
          ]"
          @click="setBrand(modelValue.brand === b.slug ? null : b.slug)"
        >
          <span class="text-xs font-bold">{{ b.fa }}</span>
          <span
            class="text-[10px] tracking-wider transition-colors"
            :class="modelValue.brand === b.slug ? 'text-white/80' : 'text-muted-foreground'"
          >
            {{ b.en }}
          </span>
        </button>
      </div>
    </div>

    <!-- ۴. پیل‌های سایزبندی لوکس -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <h4 class="text-xs font-bold text-ink">
        سایزبندی
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in availableSizes"
          :key="size"
          type="button"
          class="h-9 min-w-9 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center shadow-2xs"
          :class="[
            modelValue.sizes.includes(size)
              ? 'border-rose bg-rose text-white shadow-xs'
              : 'border-sand bg-white text-ink hover:border-sand/80 hover:bg-sand/20',
          ]"
          @click="toggleSize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- ۵. پالت رنگ‌های طبیعی با چک‌مارک و تولتیپ -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <h4 class="text-xs font-bold text-ink">
        رنگ‌بندی طبیعی
      </h4>
      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="color in availableColors"
          :key="color.name"
          type="button"
          class="w-7 h-7 rounded-full border border-sand/70 shadow-2xs transition-all cursor-pointer relative flex items-center justify-center"
          :class="[
            color.bgClass,
            modelValue.colors.includes(color.name)
              ? 'ring-2 ring-rose ring-offset-2 scale-105'
              : 'hover:scale-110',
          ]"
          :title="color.name"
          :aria-label="color.name"
          @click="toggleColor(color.name)"
        >
          <Check
            v-if="modelValue.colors.includes(color.name)"
            class="w-3.5 h-3.5 stroke-[2.5]"
            :class="color.checkClass"
          />
        </button>
      </div>
    </div>

    <!-- ۶. اسلایدر و باکس‌های قیمت تومان -->
    <div class="space-y-3 border-t border-sand/60 pt-4">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-ink">محدوده قیمت</span>
        <button
          v-if="modelValue.priceRange[0] > minPrice || modelValue.priceRange[1] < maxPrice"
          type="button"
          class="text-[10px] text-rose font-medium hover:underline cursor-pointer"
          @click="resetPrice"
        >
          بازنشانی قیمت
        </button>
      </div>

      <!-- باکس‌های نمایش مبالغ تومان -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="rounded-xl border border-sand/80 bg-sand/20 p-2 text-center">
          <span class="block text-[10px] text-muted-foreground font-medium mb-0.5">از حداقل</span>
          <span class="font-bold text-ink">{{ toFa(formatToman(modelValue.priceRange[0])) }}</span>
        </div>
        <div class="rounded-xl border border-sand/80 bg-sand/20 p-2 text-center">
          <span class="block text-[10px] text-muted-foreground font-medium mb-0.5">تا حداکثر</span>
          <span class="font-bold text-ink">{{ toFa(formatToman(modelValue.priceRange[1])) }}</span>
        </div>
      </div>

      <div class="pt-2 px-1">
        <Slider
          :model-value="[modelValue.priceRange[0], modelValue.priceRange[1]]"
          :min="minPrice"
          :max="maxPrice"
          :step="50000"
          @update:model-value="(val) => updatePrice(val as number[])"
        />
      </div>
    </div>
  </div>
</template>
