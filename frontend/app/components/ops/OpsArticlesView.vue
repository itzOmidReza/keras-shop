<script setup lang="ts">
import { Plus, ExternalLink } from '@lucide/vue'

const {
  articlesList,
  openAddArticleModal,
  toggleArticleStatus,
} = useOpsArticles()
</script>

<template>
  <section data-testid="nexus-articles-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          مدیریت مقالات و ژورنال ادیتوریال
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          تولید محتوا، راهنمای استایلینگ پاییزه، علم الیاف و انتشار در بلاگ
        </p>
      </div>

      <button
        type="button"
        data-testid="create-article-btn"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
        @click="openAddArticleModal"
      >
        <Plus class="w-4 h-4" />
        <span>+ نگارش مقاله جدید</span>
      </button>
    </div>

    <!-- جدول مقالات -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">عنوان مقاله و کاور</th>
              <th class="p-3.5 text-start">دسته‌بندی</th>
              <th class="p-3.5 text-start">نویسنده</th>
              <th class="p-3.5 text-start">زمان مطالعه</th>
              <th class="p-3.5 text-start">وضعیت انتشار</th>
              <th class="p-3.5 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="article in articlesList"
              :key="article.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- عنوان و عکس -->
              <td class="p-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="article.image"
                    :alt="article.title"
                    class="w-12 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                  >
                  <div class="min-w-0 max-w-md">
                    <span class="font-bold text-slate-900 block truncate">{{ article.title }}</span>
                    <span class="text-[10px] text-slate-500 font-mono block mt-0.5">{{ article.slug }}</span>
                  </div>
                </div>
              </td>

              <!-- دسته -->
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                  {{ article.categoryLabel }}
                </span>
              </td>

              <!-- نویسنده -->
              <td class="p-3.5 text-slate-700">
                <span class="font-bold block">{{ article.author }}</span>
                <span class="text-[10px] text-slate-400 block mt-0.5">{{ article.authorRole }}</span>
              </td>

              <!-- زمان مطالعه -->
              <td class="p-3.5 text-slate-600 font-mono">
                {{ article.readTime }}
              </td>

              <!-- وضعیت -->
              <td class="p-3.5">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                  :class="article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                  @click="toggleArticleStatus(article)"
                >
                  {{ article.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
                </button>
              </td>

              <!-- عملیات -->
              <td class="p-3.5 text-end">
                <div class="flex items-center justify-end gap-1.5">
                  <NuxtLink
                    :to="`/blog`"
                    target="_blank"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="مشاهده در وبلاگ"
                  >
                    <ExternalLink class="w-4 h-4" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
