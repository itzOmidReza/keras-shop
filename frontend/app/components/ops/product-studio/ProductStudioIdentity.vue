<!-- frontend/app/components/ops/product-studio/ProductStudioIdentity.vue -->
<script setup lang="ts">
import { Sparkles, Layers, Plus, Trash2, Tag, BookOpen } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'
import OpsQuickAddAttributeModal from '~/components/ops/taxonomy/OpsQuickAddAttributeModal.vue'

const {
  title,
  slug,
  styleCode,
  division,
  category,
  season,
  badge,
  highlights,
  lookbookNotes,
  autoGenerateSlug,
} = useOpsProductStudio()

const { categoryTree, collectionDrops } = useOpsTaxonomy()

const isQuickAddOpen = ref(false)
const newHighlightInput = ref('')

const addHighlight = () => {
  if (newHighlightInput.value.trim()) {
    highlights.value.push(newHighlightInput.value.trim())
    newHighlightInput.value = ''
  }
}

const removeHighlight = (idx: number) => {
  highlights.value.splice(idx, 1)
}

const filteredCategories = computed(() => {
  return categoryTree.value.filter((c) => c.division === division.value)
})
</script>

<template>
  <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-sand-100 text-ink">
          <Layers class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            شناسنامه، رده‌بندی و هویت اثر (Identity & Codes)
          </h2>
          <p class="text-[11px] text-slate-500">
            عنوان رسمی، کد سبک آتلیه، دسته‌بندی و روایت ادیتوریال
          </p>
        </div>
      </div>
      <button
        type="button"
        class="text-xs text-ink hover:underline flex items-center gap-1 font-medium cursor-pointer"
        @click="isQuickAddOpen = true"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>تعریف دسته‌بندی جدید</span>
      </button>
    </div>

    <!-- ردیف عنوان و اسلاگ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          عنوان لباس / اثر در کاتالوگ <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="title"
          type="text"
          placeholder="مثال: کت پشمی دبل‌برست پاییزه"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden transition-colors"
          @blur="!slug && autoGenerateSlug()"
        >
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="font-bold text-slate-700">شناسه یکتای پیوند (Slug)</label>
          <button
            type="button"
            class="text-[11px] text-ink hover:underline flex items-center gap-1 font-medium cursor-pointer"
            @click="autoGenerateSlug"
          >
            <Sparkles class="w-3 h-3" />
            <span>تولید خودکار</span>
          </button>
        </div>
        <input
          v-model="slug"
          type="text"
          dir="ltr"
          placeholder="keras-coat-wool-tailored"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink transition-colors"
        >
      </div>
    </div>

    <!-- ردیف ۴ تایی: کد استایل، بخش، دسته‌بندی، فصل/دراپ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">کد مادر استایل (Style Code)</label>
        <input
          v-model="styleCode"
          type="text"
          dir="ltr"
          placeholder="KER-1405-BLZ"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink"
        >
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">بخش محصول</label>
        <select
          v-model="division"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option value="apparel">پوشاک آتلیه (Apparel)</option>
          <option value="accessories">اکسسوری و کیف (Accessories)</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">دسته‌بندی تخصصی</label>
        <select
          v-model="category"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option
            v-for="cat in filteredCategories"
            :key="cat.id"
            :value="cat.slug"
          >
            {{ cat.title }}
          </option>
          <option v-if="filteredCategories.length === 0" value="shirts-blouses">شومیز و پیراهن</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">کالکشن و دراپ فصلی</label>
        <select
          v-model="season"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option
            v-for="drop in collectionDrops"
            :key="drop.id"
            :value="drop.season"
          >
            {{ drop.title }}
          </option>
          <option value="fall-1405">پاییز ۱۴۰۵ (کویر شنی)</option>
          <option value="winter-1405">زمستان ۱۴۰۵</option>
          <option value="spring-1406">بهار ۱۴۰۶</option>
          <option value="summer-1406">تابستان ۱۴۰۶</option>
          <option value="permanent">کالکشن دائمی کراس</option>
        </select>
      </div>
    </div>

    <!-- بج و برچسب تجاری -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">نشان ویژه (Badge)</label>
        <div class="flex items-center gap-2">
          <input
            v-model="badge"
            type="text"
            placeholder="مثال: لیمیتد، جدید، دست‌دوز"
            class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
          >
          <div class="flex items-center gap-1">
            <button
              v-for="b in ['جدید', 'لیمیتد', 'دست‌دوز', 'سفارشی']"
              :key="b"
              type="button"
              class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
              :class="badge === b ? 'bg-ink text-white border-ink' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
              @click="badge = b"
            >
              {{ b }}
            </button>
          </div>
        </div>
      </div>

      <!-- افزودن نکات برجسته (Bullet Highlights) -->
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">ویژگی‌های برجسته محصول (Highlights)</label>
        <div class="flex items-center gap-2">
          <input
            v-model="newHighlightInput"
            type="text"
            placeholder="مثال: آسترکشی ابریشمی کامل"
            class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
            @keydown.enter.prevent="addHighlight"
          >
          <button
            type="button"
            class="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
            @click="addHighlight"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>افزودن</span>
          </button>
        </div>
      </div>
    </div>

    <!-- لیست هایلایت‌ها -->
    <div v-if="highlights.length > 0" class="flex flex-wrap gap-2 pt-1">
      <span
        v-for="(hl, idx) in highlights"
        :key="idx"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200/60"
      >
        <Tag class="w-3 h-3 text-slate-400" />
        <span>{{ hl }}</span>
        <button
          type="button"
          class="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          @click="removeHighlight(idx)"
        >
          <Trash2 class="w-3 h-3" />
        </button>
      </span>
    </div>

    <!-- یادداشت لوک‌بوک و روایت اثر -->
    <div class="text-xs">
      <label class="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
        <BookOpen class="w-3.5 h-3.5 text-slate-500" />
        <span>روایت اثر و یادداشت لوک‌بوک (Lookbook & Editorial Story)</span>
      </label>
      <textarea
        v-model="lookbookNotes"
        rows="3"
        placeholder="شرح متریال، فلسفه الگوسازی و تجربه لمس الیاف در این اثر..."
        class="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink transition-colors leading-relaxed"
      />
    </div>

    <!-- میکرو مودال تعریف دسته‌بندی سریع -->
    <OpsQuickAddAttributeModal
      v-model:open="isQuickAddOpen"
      default-type="category"
      @created="isQuickAddOpen = false"
    />
  </section>
</template>
