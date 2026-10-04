<!-- frontend/app/components/ops/taxonomy/OpsCategoryTreeManager.vue -->
<script setup lang="ts">
import { Plus, Trash2, Folder, FolderOpen } from '@lucide/vue'
import { useOpsTaxonomy, type CategoryNode } from '~/composables/ops/useOpsTaxonomy'

const { categoryTree, deleteCategoryNode } = useOpsTaxonomy()

const emit = defineEmits<{
  (e: 'openAddCategory'): void
}>()

const rootCategories = computed(() => {
  return categoryTree.value.filter((c) => !c.parentId)
})

const getChildren = (parentId: string): CategoryNode[] => {
  return categoryTree.value.filter((c) => c.parentId === parentId)
}
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <h3 class="text-sm font-bold text-slate-900">
          درخت سلسله‌مراتبی دسته‌بندی‌های کاتالوگ
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          تعریف دسته‌های والد و فرزند برای پوشاک و اکسسوری به همراه فیلدهای الزامی
        </p>
      </div>

      <button
        type="button"
        class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        @click="emit('openAddCategory')"
      >
        <Plus class="w-4 h-4" />
        <span>افزودن دسته‌بندی جدید</span>
      </button>
    </div>

    <!-- ساختار درختی -->
    <div class="space-y-3">
      <div
        v-for="root in rootCategories"
        :key="root.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3"
      >
        <!-- ریشه / شاخه والد -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <FolderOpen class="w-4 h-4 text-ink" />
            <span class="text-xs font-black text-slate-900">{{ root.title }}</span>
            <span class="text-[10px] font-mono text-slate-400">({{ root.slug }})</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              {{ root.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[11px] font-mono text-slate-500 tabular-nums">
              {{ root.inUseCount }} محصول فعال
            </span>
          </div>
        </div>

        <!-- فرزندان دسته‌بندی -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 ps-4 border-s-2 border-slate-100">
          <div
            v-for="child in getChildren(root.id)"
            :key="child.id"
            class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Folder class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div class="min-w-0">
                <span class="text-xs font-bold text-slate-800 block truncate">{{ child.title }}</span>
                <span class="text-[10px] font-mono text-slate-400 block mt-0.5 truncate">{{ child.slug }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                {{ child.inUseCount }}
              </span>
              <button
                type="button"
                class="p-1 rounded text-rose hover:bg-rose-50 cursor-pointer"
                title="حذف دسته‌بندی"
                @click="deleteCategoryNode(child.id)"
              >
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
