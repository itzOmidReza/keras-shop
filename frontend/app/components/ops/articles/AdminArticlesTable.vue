<!-- frontend/app/components/ops/articles/AdminArticlesTable.vue -->
<script setup lang="ts">
import {
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  Sparkles,
  FileText,
} from '@lucide/vue'
import type { JournalArticle } from '~/types/domain'

defineProps<{
  articles: JournalArticle[]
}>()

const emit = defineEmits<{
  toggleStatus: [id: number]
  delete: [id: number]
  resetFilters: []
}>()

const confirmDeleteId = ref<number | null>(null)

const handleDelete = (id: number) => {
  if (confirmDeleteId.value === id) {
    emit('delete', id)
    confirmDeleteId.value = null
  } else {
    confirmDeleteId.value = id
    setTimeout(() => {
      if (confirmDeleteId.value === id) {
        confirmDeleteId.value = null
      }
    }, 4000)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs text-slate-700" data-testid="articles-table">
        <thead class="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80">
          <tr>
            <th scope="col" class="py-3 px-4 text-start">
              کاور
            </th>
            <th scope="col" class="py-3 px-4 text-start">
              عنوان و چکیده مقاله
            </th>
            <th scope="col" class="py-3 px-4 text-start">
              دسته‌بندی
            </th>
            <th scope="col" class="py-3 px-4 text-start">
              نویسنده
            </th>
            <th scope="col" class="py-3 px-4 text-start">
              زمان مطالعه / تاریخ
            </th>
            <th scope="col" class="py-3 px-4 text-center">
              وضعیت انتشار
            </th>
            <th scope="col" class="py-3 px-4 text-end">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="article in articles"
            :key="article.id"
            :data-testid="`article-row-${article.id}`"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <!-- تصویر کاور کوچک -->
            <td class="py-3.5 px-4 w-16">
              <div class="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                >
              </div>
            </td>

            <!-- عنوان و چکیده -->
            <td class="py-3.5 px-4 max-w-sm">
              <div class="space-y-1">
                <span class="font-bold text-slate-900 block leading-snug hover:text-amber-600 transition-colors">
                  {{ article.title }}
                </span>
                <p class="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                  {{ article.excerpt }}
                </p>
                <span v-if="article.linkedProducts?.length" class="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono">
                  <Sparkles class="w-3 h-3" />
                  {{ article.linkedProducts.length }} قطعه لباس متصل
                </span>
              </div>
            </td>

            <!-- دسته‌بندی موضوعی -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {{ article.categoryLabel }}
              </span>
            </td>

            <!-- نویسنده -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <img
                  v-if="article.author.avatar"
                  :src="article.author.avatar"
                  :alt="article.author.name"
                  class="w-6 h-6 rounded-full object-cover"
                >
                <span class="font-medium text-slate-800">{{ article.author.name }}</span>
              </div>
            </td>

            <!-- زمان مطالعه و تاریخ -->
            <td class="py-3.5 px-4 whitespace-nowrap text-slate-500">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1 text-[11px] font-mono">
                  <Clock class="w-3 h-3 text-slate-400" />
                  <span>{{ article.readTime }}</span>
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ article.date }}
                </div>
              </div>
            </td>

            <!-- سوئیچ تاگل وضعیت انتشار -->
            <td class="py-3.5 px-4 text-center whitespace-nowrap">
              <button
                type="button"
                :data-testid="`toggle-status-${article.id}`"
                class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                :class="[
                  article.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200',
                ]"
                @click="emit('toggleStatus', article.id)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'"
                />
                <span>{{ article.status === 'published' ? 'منتشرشده' : 'پیش‌نویس' }}</span>
              </button>
            </td>

            <!-- عملیات -->
            <td class="py-3.5 px-4 text-end whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <NuxtLink
                  :to="`/journal/${article.slug}`"
                  target="_blank"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="مشاهده زنده در سایت"
                >
                  <ExternalLink class="w-4 h-4" />
                </NuxtLink>

                <NuxtLink
                  :to="`/internal-ops-nexus/articles/${article.id}/edit`"
                  :data-testid="`edit-article-${article.id}`"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="ویرایش مقاله"
                >
                  <Edit class="w-4 h-4" />
                </NuxtLink>

                <button
                  type="button"
                  :data-testid="`delete-article-${article.id}`"
                  class="p-1.5 rounded-lg transition-colors cursor-pointer"
                  :class="[
                    confirmDeleteId === article.id
                      ? 'bg-rose-50 text-rose font-bold text-[10px] px-2'
                      : 'text-slate-400 hover:text-rose hover:bg-rose-50',
                  ]"
                  :title="confirmDeleteId === article.id ? 'کلیک دوباره جهت تایید حذف' : 'حذف مقاله'"
                  @click="handleDelete(article.id)"
                >
                  <span v-if="confirmDeleteId === article.id">تایید حذف؟</span>
                  <Trash2 v-else class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- وضعیت خالی نبود مقاله در فیلتر -->
    <div v-if="articles.length === 0" class="p-12 text-center space-y-3">
      <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
        <FileText class="w-5 h-5" />
      </div>
      <p class="text-xs font-bold text-slate-600">
        مقاله‌ای با این مشخصات یافت نشد
      </p>
      <button
        type="button"
        class="text-xs text-amber-600 hover:underline font-bold cursor-pointer"
        @click="emit('resetFilters')"
      >
        پاک کردن فیلترها
      </button>
    </div>
  </div>
</template>
