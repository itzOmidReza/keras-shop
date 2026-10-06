<!-- frontend/app/components/ops/articles/AdminArticlesFilterBar.vue -->
<script setup lang="ts">
import { BookOpen, ExternalLink, Plus, Search } from '@lucide/vue'
import { ADMIN_ARTICLE_CATEGORIES } from '~/composables/admin/useAdminArticles'
import type { ArticleCategory } from '~/types/domain'

defineProps<{
  totalCount: number
  stats: { total: number; published: number; drafts: number }
  selectedStatus: 'all' | 'published' | 'draft'
  selectedCategory: string
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:selectedStatus': [value: 'all' | 'published' | 'draft']
  'update:selectedCategory': [value: string]
  'update:searchQuery': [value: string]
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- هدر بخش مدیریت مقالات -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600">
            <BookOpen class="w-5 h-5" />
          </div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900">
            مدیریت مجله و مقالات ادیتوریال
          </h1>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700">
            {{ totalCount }} مقاله
          </span>
        </div>
        <p class="text-xs text-slate-500">
          نگارش روایت‌های برند، راهنماهای استایل، اتصال لباس‌های کاتالوگ و انتشار در ویترین مجله
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/journal"
          target="_blank"
          class="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
          <span>مشاهده ویترین مجله</span>
        </NuxtLink>

        <NuxtLink
          to="/internal-ops-nexus/articles/new"
          data-testid="create-article-btn"
          class="px-4 py-2 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus class="w-4 h-4 text-amber-300" />
          <span>نگارش مقاله جدید</span>
        </NuxtLink>
      </div>
    </div>

    <!-- نوار فیلترها و جست‌وجوی سریع -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- تب‌های فیلتر وضعیت انتشار -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="[
            selectedStatus === 'all'
              ? 'bg-ink text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="emit('update:selectedStatus', 'all')"
        >
          همه ({{ stats.total }})
        </button>

        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="[
            selectedStatus === 'published'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="emit('update:selectedStatus', 'published')"
        >
          منتشرشده ({{ stats.published }})
        </button>

        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="[
            selectedStatus === 'draft'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="emit('update:selectedStatus', 'draft')"
        >
          پیش‌نویس ({{ stats.drafts }})
        </button>
      </div>

      <!-- جست‌وجو و انتخاب دسته‌بندی -->
      <div class="flex flex-col sm:flex-row items-center gap-2.5">
        <select
          :value="selectedCategory"
          class="w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden"
          @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value as ArticleCategory | 'all')"
        >
          <option value="all">
            تمام دسته‌بندی‌ها
          </option>
          <option
            v-for="cat in ADMIN_ARTICLE_CATEGORIES"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.label }}
          </option>
        </select>

        <div class="relative w-full sm:w-64">
          <input
            :value="searchQuery"
            type="text"
            data-testid="articles-search-input"
            placeholder="جست‌وجوی عنوان یا نویسنده..."
            class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl ps-9 pe-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          >
          <Search class="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  </div>
</template>
