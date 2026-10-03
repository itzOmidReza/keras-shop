<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import { formatToman } from '~/utils/format'
import { RotateCcw, X, SlidersHorizontal } from '@lucide/vue'
import type { ProductDivision, ProductCategory, ProductSeason } from '~/types/domain'

export interface FilterState {
  season: ProductSeason | null
  division: ProductDivision | null
  categories: ProductCategory[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  line?: 'move' | 'calm' | null
}

const props = withDefaults(
  defineProps<{
    modelValue: FilterState
    minPrice?: number
    maxPrice?: number
  }>(),
  {
    minPrice: 300000,
    maxPrice: 5500000,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
  'reset': []
}>()

// فصل‌ها و کالکشن‌ها
const availableSeasons: { id: ProductSeason; label: string; badge?: string }[] = [
  { id: 'fall-1405', label: 'پاییز ۱۴۰۵', badge: 'جدید' },
  { id: 'winter-1405', label: 'زمستان ۱۴۰۵' },
  { id: 'spring-1406', label: 'بهار ۱۴۰۶', badge: 'پیش‌نمایش' },
  { id: 'summer-1405', label: 'تابستان ۱۴۰۵', badge: 'آرشیو' },
]

// شاخه‌های اصلی
const availableDivisions: { id: ProductDivision; label: string }[] = [
  { id: 'apparel', label: 'پوشاک' },
  { id: 'accessories', label: 'اکسسوری' },
]

// دسته‌بندی‌های پوشاک و اکسسوری
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

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free']

const availableColors = [
  { name: 'مشکی موکا', bgClass: 'bg-ink' },
  { name: 'سبز مریم‌گلی', bgClass: 'bg-sage' },
  { name: 'خاک رس', bgClass: 'bg-clay' },
  { name: 'رز کراس', bgClass: 'bg-rose' },
  { name: 'شنی نچرال', bgClass: 'bg-sand' },
  { name: 'عاجی روشن', bgClass: 'bg-paper' },
]

// ۱. تنظیم فصل و کالکشن
const setSeason = (season: ProductSeason | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    season,
  })
}

// ۲. تنظیم شاخه اصلی (پوشاک / اکسسوری)
const setDivision = (division: ProductDivision | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    division,
  })
}

// ۳. تغییر دسته‌بندی (چندگانه)
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

// ۴. تغییر سایز
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

// ۵. تغییر رنگ
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

// ۶. بازه قیمت
const updatePrice = (val: number[] | undefined) => {
  if (!val || val.length < 2) return
  const [min, max] = val
  if (typeof min !== 'number' || typeof max !== 'number') return
  emit('update:modelValue', {
    ...props.modelValue,
    priceRange: [min, max],
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

// تعداد کل فیلترهای فعال
const activeFilterCount = computed(() => {
  let count = 0
  if (props.modelValue.season) count++
  if (props.modelValue.division) count++
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
    <!-- هدر فیلتر و دکمه بازنشانی -->
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
          {{ activeFilterCount }}
        </span>
      </div>

      <button
        v-if="activeFilterCount > 0"
        type="button"
        class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-rose transition-colors cursor-pointer"
        @click="emit('reset')"
      >
        <RotateCcw class="h-3 w-3" />
        <span>پاک کردن همه</span>
      </button>
    </div>

    <!-- بج‌های فیلترهای فعال (Active Badges Bar) -->
    <div v-if="activeFilterCount > 0" class="flex flex-wrap gap-1.5 pb-2">
      <!-- بج فصل -->
      <span
        v-if="modelValue.season"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>فصل: {{ getSeasonName(modelValue.season) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer"
          @click="setSeason(null)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- بج شاخه اصلی -->
      <span
        v-if="modelValue.division"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>شاخه: {{ modelValue.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer"
          @click="setDivision(null)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- بج دسته‌بندی‌ها -->
      <span
        v-for="cat in modelValue.categories"
        :key="cat"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ getCategoryName(cat) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer"
          @click="toggleCategory(cat)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- بج سایزها -->
      <span
        v-for="size in modelValue.sizes"
        :key="size"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>سایز {{ size }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer"
          @click="toggleSize(size)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- بج رنگ‌ها -->
      <span
        v-for="color in modelValue.colors"
        :key="color"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ color }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer"
          @click="toggleColor(color)"
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

    <!-- ۲. شاخه اصلی (Division: پوشاک / اکسسوری) -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <h4 class="text-xs font-bold text-ink">
        شاخه اصلی
      </h4>
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
          class="rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer"
          :class="[
            modelValue.division === div.id
              ? 'bg-rose text-white shadow-2xs'
              : 'text-muted-foreground hover:text-ink',
          ]"
          @click="setDivision(modelValue.division === div.id ? null : div.id)"
        >
          {{ div.label }}
        </button>
      </div>
    </div>

    <!-- ۳. دسته‌بندی کالاها (پوشاک) -->
    <div
      v-if="!modelValue.division || modelValue.division === 'apparel'"
      class="space-y-2.5 border-t border-sand/60 pt-4"
    >
      <h4 class="text-xs font-bold text-ink">
        دسته‌بندی پوشاک
      </h4>
      <div class="space-y-2">
        <div
          v-for="cat in apparelCategories"
          :key="cat.slug"
          class="flex items-center gap-2"
        >
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
      </div>
    </div>

    <!-- ۴. دسته‌بندی اکسسوری -->
    <div
      v-if="!modelValue.division || modelValue.division === 'accessories'"
      class="space-y-2.5 border-t border-sand/60 pt-4"
    >
      <h4 class="text-xs font-bold text-ink">
        دسته‌بندی اکسسوری
      </h4>
      <div class="space-y-2">
        <div
          v-for="cat in accessoryCategories"
          :key="cat.slug"
          class="flex items-center gap-2"
        >
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
      </div>
    </div>

    <!-- ۵. پیل‌های سایزبندی -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <h4 class="text-xs font-bold text-ink">
        سایزبندی
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in availableSizes"
          :key="size"
          type="button"
          class="h-9 min-w-9 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center shadow-2xs"
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

    <!-- ۶. پالت رنگ‌ها -->
    <div class="space-y-2.5 border-t border-sand/60 pt-4">
      <h4 class="text-xs font-bold text-ink">
        رنگ‌بندی طبیعی
      </h4>
      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="color in availableColors"
          :key="color.name"
          type="button"
          class="w-7 h-7 rounded-full border border-sand/70 shadow-2xs transition-all cursor-pointer relative"
          :class="[
            color.bgClass,
            modelValue.colors.includes(color.name)
              ? 'ring-2 ring-rose ring-offset-2'
              : 'hover:scale-110',
          ]"
          :title="color.name"
          @click="toggleColor(color.name)"
        >
          <span class="sr-only">{{ color.name }}</span>
        </button>
      </div>
    </div>

    <!-- ۷. اسلایدر محدوده قیمت -->
    <div class="space-y-3 border-t border-sand/60 pt-4">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-ink">محدوده قیمت</span>
        <span class="text-muted-foreground text-[11px]">
          {{ formatToman(modelValue.priceRange[0]) }} تا {{ formatToman(modelValue.priceRange[1]) }}
        </span>
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
