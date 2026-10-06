<!-- frontend/app/components/journal/JournalHeroCover.vue -->
<script setup lang="ts">
import { Clock, Calendar, ArrowLeft, Sparkles } from '@lucide/vue'
import type { JournalArticle } from '~/types/domain'

defineProps<{
  article: JournalArticle | null
}>()
</script>

<template>
  <section v-if="article" class="relative my-6 lg:my-10" data-testid="journal-hero-cover">
    <NuxtLink
      :to="`/journal/${article.slug}`"
      class="group block relative overflow-hidden rounded-3xl bg-ink shadow-xl transition-all duration-500 hover:shadow-2xl"
    >
      <!-- تصویر کاور با گرادیانت ادیتوریال -->
      <div class="relative h-[420px] sm:h-[500px] lg:h-[580px] w-full overflow-hidden">
        <img
          :src="article.coverImage"
          :alt="article.title"
          class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="eager"
        >
        <!-- گرادیانت تاریک سینمایی جهت وضوح متون -->
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
        <div class="absolute inset-0 bg-ink/10" />
      </div>

      <!-- محتوای متنی روی کاور -->
      <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-white">
        <!-- بج‌ها و فراداده‌های بالایی -->
        <div class="flex flex-wrap items-center gap-2.5 mb-3 sm:mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose text-white shadow-xs">
            <Sparkles class="w-3.5 h-3.5" />
            روایت برگزیده سردبیر
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
            {{ article.categoryLabel }}
          </span>
          <span class="inline-flex items-center gap-1 text-xs text-white/80 font-mono ms-1">
            <Clock class="w-3.5 h-3.5" />
            {{ article.readTime }}
          </span>
        </div>

        <!-- تیتر اصلی مجله -->
        <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-sans leading-tight sm:leading-tight mb-3 sm:mb-4 text-white group-hover:text-amber-200 transition-colors">
          {{ article.title }}
        </h2>

        <!-- چکیده -->
        <p class="text-xs sm:text-base text-white/85 line-clamp-2 max-w-3xl leading-relaxed mb-6 font-sans">
          {{ article.excerpt }}
        </p>

        <!-- نوار اطلاعات نویسنده و دکمه مطالعه -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
          <div class="flex items-center gap-3">
            <img
              v-if="article.author.avatar"
              :src="article.author.avatar"
              :alt="article.author.name"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white/40"
            >
            <div class="text-start">
              <span class="text-xs sm:text-sm font-bold block text-white">{{ article.author.name }}</span>
              <span class="text-[11px] text-white/70 block">{{ article.author.role }}</span>
            </div>
          </div>

          <div class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
            <Calendar class="w-4 h-4 text-white/70" />
            <span>{{ article.date }}</span>
            <span class="mx-2 text-white/40">•</span>
            <span>مطالعه روایت کامل</span>
            <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>
