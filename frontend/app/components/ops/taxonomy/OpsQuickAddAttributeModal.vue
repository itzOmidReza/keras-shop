<!-- frontend/app/components/ops/taxonomy/OpsQuickAddAttributeModal.vue -->
<script setup lang="ts">
import { Plus, X, Check, Palette, FolderTree, Award } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsTaxonomy, DEFAULT_COLOR_HEX } from '~/composables/ops/useOpsTaxonomy'

const props = withDefaults(
  defineProps<{
    open?: boolean
    modelValue?: boolean
    defaultType?: 'color' | 'category' | 'brand'
    initialType?: 'color' | 'category' | 'brand'
  }>(),
  {
    open: false,
    modelValue: false,
    defaultType: undefined,
    initialType: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'update:modelValue', val: boolean): void
  (e: 'created', payload: { type: 'color' | 'category' | 'brand'; item: unknown }): void
}>()

const isModalOpen = computed({
  get: () => Boolean(props.open || props.modelValue),
  set: (val: boolean) => {
    emit('update:open', val)
    emit('update:modelValue', val)
  },
})

const activeType = ref<'color' | 'category' | 'brand'>('color')

watch(
  () => props.defaultType || props.initialType,
  (val) => {
    if (val) activeType.value = val
  },
  { immediate: true },
)

const { addColorSwatch, addCategoryNode, addBrandItem } = useOpsTaxonomy()

// فرم رنگ
const colorForm = ref({
  name: '',
  enName: '',
  hex: DEFAULT_COLOR_HEX,
  family: 'مشکی و طوسی',
})

// فرم دسته‌بندی
const categoryForm = ref({
  title: '',
  slug: '',
  division: 'apparel' as 'apparel' | 'accessories',
  parentId: null as string | null,
})

// فرم برند
const brandForm = ref({
  name: '',
  slug: '',
  origin: 'تهران، ایران',
  bio: '',
})

const handleSave = () => {
  if (activeType.value === 'color') {
    if (!colorForm.value.name.trim()) {
      toast.error('لطفاً عنوان فارسی رنگ را وارد کنید.')
      return
    }
    const item = addColorSwatch({
      name: colorForm.value.name.trim(),
      enName: colorForm.value.enName.trim() || colorForm.value.name.trim(),
      hex: colorForm.value.hex,
      family: colorForm.value.family,
    })
    emit('created', { type: 'color', item })
    colorForm.value = { name: '', enName: '', hex: DEFAULT_COLOR_HEX, family: 'مشکی و طوسی' }
  } else if (activeType.value === 'category') {
    if (!categoryForm.value.title.trim()) {
      toast.error('لطفاً عنوان دسته‌بندی را وارد کنید.')
      return
    }
    const slug = categoryForm.value.slug.trim() || `cat-${Date.now().toString().slice(-4)}`
    const item = addCategoryNode({
      title: categoryForm.value.title.trim(),
      slug,
      division: categoryForm.value.division,
      parentId: categoryForm.value.parentId,
      mandatoryFields: ['sizes'],
    })
    emit('created', { type: 'category', item })
    categoryForm.value = { title: '', slug: '', division: 'apparel', parentId: null }
  } else if (activeType.value === 'brand') {
    if (!brandForm.value.name.trim()) {
      toast.error('لطفاً نام برند یا طراح را وارد کنید.')
      return
    }
    const slug = brandForm.value.slug.trim() || `brand-${Date.now().toString().slice(-4)}`
    const item = addBrandItem({
      name: brandForm.value.name.trim(),
      slug,
      origin: brandForm.value.origin.trim(),
      bio: brandForm.value.bio.trim(),
    })
    emit('created', { type: 'brand', item })
    brandForm.value = { name: '', slug: '', origin: 'تهران، ایران', bio: '' }
  }

  isModalOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isModalOpen">
    <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200/90 rounded-2xl shadow-xl font-sans">
      <DialogHeader>
        <DialogTitle class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <Plus class="w-4 h-4 text-ink" />
          <span>تعریف آنی ویژگی جدید در سیستم</span>
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          افزودن و گزینش بدون خروج از استودیو محصول
        </DialogDescription>
      </DialogHeader>

      <!-- انتخاب نوع ویژگی -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="activeType === 'color' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeType = 'color'"
        >
          <Palette class="w-3.5 h-3.5" />
          <span>رنگ / سواچ</span>
        </button>

        <button
          type="button"
          class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="activeType === 'category' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeType = 'category'"
        >
          <FolderTree class="w-3.5 h-3.5" />
          <span>دسته‌بندی</span>
        </button>

        <button
          type="button"
          class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="activeType === 'brand' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeType = 'brand'"
        >
          <Award class="w-3.5 h-3.5" />
          <span>طراح / برند</span>
        </button>
      </div>

      <!-- ۱. فرم رنگ -->
      <div v-if="activeType === 'color'" class="space-y-3 py-2 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">نام فارسی رنگ</label>
          <input
            v-model="colorForm.name"
            type="text"
            placeholder="مثال: زرشکی درباری"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">کد هگز / پالت</label>
            <div class="flex items-center gap-2">
              <input
                v-model="colorForm.hex"
                type="color"
                class="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
              >
              <input
                v-model="colorForm.hex"
                type="text"
                class="flex-1 h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden"
              >
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">خانواده رنگی</label>
            <select
              v-model="colorForm.family"
              class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
              <option value="مشکی و طوسی">مشکی و طوسی</option>
              <option value="سفید و کرم">سفید و کرم</option>
              <option value="قهوه‌ای و شتری">قهوه‌ای و شتری</option>
              <option value="آبی و سرمه‌ای">آبی و سرمه‌ای</option>
              <option value="سبز و زیتونی">سبز و زیتونی</option>
              <option value="زرشکی و صورتی">زرشکی و صورتی</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ۲. فرم دسته‌بندی -->
      <div v-else-if="activeType === 'category'" class="space-y-3 py-2 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">عنوان دسته‌بندی</label>
          <input
            v-model="categoryForm.title"
            type="text"
            placeholder="مثال: جلیقه و سارافون"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">بخش اصلی</label>
            <select
              v-model="categoryForm.division"
              class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
              <option value="apparel">پوشاک (Apparel)</option>
              <option value="accessories">اکسسوری (Accessories)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">شناسه یکتا (Slug)</label>
            <input
              v-model="categoryForm.slug"
              type="text"
              placeholder="vests-pinafores"
              class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
            >
          </div>
        </div>
      </div>

      <!-- ۳. فرم برند -->
      <div v-else class="space-y-3 py-2 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">نام برند / استودیو</label>
          <input
            v-model="brandForm.name"
            type="text"
            placeholder="مثال: آتلیه طراحی شیدا"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
          >
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">خاستگاه و شهر</label>
          <input
            v-model="brandForm.origin"
            type="text"
            placeholder="تهران، ایران"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
          >
        </div>
      </div>

      <DialogFooter class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          @click="emit('update:open', false)"
        >
          <X class="w-3.5 h-3.5" />
          <span>انصراف</span>
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          @click="handleSave"
        >
          <Check class="w-3.5 h-3.5" />
          <span>ثبت و انتخاب در فرم</span>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
