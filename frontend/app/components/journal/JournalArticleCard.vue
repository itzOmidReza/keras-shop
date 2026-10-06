<!-- frontend/app/components/journal/JournalArticleCard.vue -->
<script setup lang="ts">
import { Clock, Calendar, ArrowLeft } from '@lucide/vue'
import type { JournalArticle } from '~/types/domain'

defineProps<{
  article: JournalArticle
}>()
</script>

<template>
  <article
    class="group flex flex-col h-full bg-white rounded-3xl border border-sand/60 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300"
    data-testid="journal-article-card"
  >
    <NuxtLink :to="`/journal/${article.slug}`" class="block overflow-hidden relative aspect-4/5 bg-sand/20">
      <!-- تصویر عمودی با نسبت ۴:۵ و انیمیشن زوم هاور -->
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      >

      <!-- گرادیانت لطیف برای خوانایی بهتر نشان‌ها -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- بج دسته‌بندی موضوعی در گوشه بالا -->
      <div class="absolute top-3.5 start-3.5">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-ink shadow-xs">
          {{ article.categoryLabel }}
        </span>
      </div>

      <!-- زمان مطالعه در گوشه مقابل -->
      <div class="absolute top-3.5 end-3.5">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-ink/75 backdrop-blur-md text-white">
          <Clock class="w-3 h-3 text-amber-300" />
          {{ article.readTime }}
        </span>
      </div>
    </NuxtLink>

    <!-- محتوای متنی کارت -->
    <div class="p-5 sm:p-6 flex flex-col flex-1 justify-between">
      <div>
        <!-- فراداده تاریخ و نویسنده -->
        <div class="flex items-center justify-between text-xs text-ink/50 mb-2.5">
          <span class="font-medium text-ink/70">{{ article.author.name }}</span>
          <span class="inline-flex items-center gap-1">
            <Calendar class="w-3 h-3" />
            {{ article.date }}
          </span>
        </div>

        <!-- عنوان مقاله -->
        <h2 class="text-base sm:text-lg font-bold font-sans text-ink group-hover:text-rose transition-colors line-clamp-2 leading-snug mb-2">
          <NuxtLink :to="`/journal/${article.slug}`">
            {{ article.title }}
          </NuxtLink>
        </h2>

        <!-- خلاصه -->
        <p class="text-xs sm:text-sm text-ink/70 line-clamp-2 leading-relaxed font-sans mb-4">
          {{ article.excerpt }}
        </p>
      </div>

      <!-- لینک اقدام به مطالعه -->
      <div class="pt-4 border-t border-sand/40 flex items-center justify-between">
        <NuxtLink
          :to="`/journal/${article.slug}`"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-rose transition-colors"
        >
          <span>مطالعه روایت</span>
          <ArrowLeft class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </NuxtLink>

        <span v-if="article.linkedProducts?.length" class="text-[11px] text-ink/40 font-mono">
          {{ article.linkedProducts.length }} قطعه استایل
        </span>
      </div>
    </div>
  </article>
</template>
