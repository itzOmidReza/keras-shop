<!-- frontend/app/pages/journal/index.vue -->
<script setup lang="ts">
import { useJournalArticles } from '~/composables/journal/useJournalArticles'
import JournalHeroCover from '~/components/journal/JournalHeroCover.vue'
import JournalCategoryTabs from '~/components/journal/JournalCategoryTabs.vue'
import JournalArticleCard from '~/components/journal/JournalArticleCard.vue'
import JournalDigestRibbon from '~/components/journal/JournalDigestRibbon.vue'
import { Sparkles, RefreshCw } from '@lucide/vue'

useSeoMeta({
  title: 'ژورنال و روایات ادیتوریال | کراس',
  description: 'مجله تخصصی مد، هنر استایلینگ، دانش الیاف طبیعی و داستان دراپ‌های آتلیه کراس',
})

const {
  featuredArticle,
  activeCategory,
  searchQuery,
  newsletterEmail,
  filteredArticles,
  handleSubscribe,
} = useJournalArticles()

// وقتی کاربر در تب «همه» است و جست‌وجو نکرده، مقاله کاور را از گرید پایینی جدا می‌کنیم تا تکرار نشود
const gridArticles = computed(() => {
  if (activeCategory.value === 'all' && !searchQuery.value.trim() && featuredArticle.value) {
    return filteredArticles.value.filter(a => a.id !== featuredArticle.value?.id)
  }
  return filteredArticles.value
})

const resetFilters = () => {
  activeCategory.value = 'all'
  searchQuery.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20 font-sans" dir="rtl">
    <main class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- هدر ادیتوریال مجله -->
      <header class="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sand/70 text-ink border border-sand">
          <Sparkles class="w-3.5 h-3.5 text-rose" />
          گاهنامه ادیتوریال آتلیه کراس
        </div>
        <h1 class="text-3xl sm:text-5xl font-black font-sans tracking-tight text-ink">
          روایت‌های استایل، فرم و الیاف
        </h1>
        <p class="text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
          پیوند هنر عکاسی، فلسفه طراحی پایدار و راهنماهای دقیق استایلینگ برای آن‌هایی که به اصالت پوشش باور دارند.
        </p>
      </header>

      <!-- مقاله برجسته سرتیتر (Hero Cover Story) -->
      <JournalHeroCover
        v-if="!searchQuery.trim() && activeCategory === 'all' && featuredArticle"
        :article="featuredArticle"
      />

      <!-- فیلتر دسته‌بندی‌ها و جست‌وجوی سریع -->
      <JournalCategoryTabs
        v-model:active-category="activeCategory"
        v-model:search-query="searchQuery"
      />

      <!-- شبکه کارت‌های مقالات ادیتوریال -->
      <section v-if="gridArticles.length > 0" class="my-8" data-testid="journal-grid">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <JournalArticleCard
            v-for="article in gridArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </section>

      <!-- وضعیت عدم یافتن نتیجه -->
      <div
        v-else
        class="py-16 text-center space-y-4 bg-white/60 rounded-3xl border border-sand/70 p-8 max-w-lg mx-auto my-8"
        data-testid="journal-empty-state"
      >
        <div class="w-12 h-12 rounded-full bg-sand/50 text-ink/60 mx-auto flex items-center justify-center">
          <RefreshCw class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-ink">روایتی با این مشخصات یافت نشد</h3>
        <p class="text-xs text-ink/60">
          لطفاً کلمات کلیدی دیگری را جست‌وجو نمایید یا فیلتر دسته‌بندی را به حالت پیش‌فرض بازگردانید.
        </p>
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-ink text-white text-xs font-bold hover:bg-ink/90 transition-colors cursor-pointer"
          @click="resetFilters"
        >
          مشاهده تمام مقالات
        </button>
      </div>

      <!-- ریبون عضویت در گاهنامه تحلیلی -->
      <JournalDigestRibbon
        v-model:email="newsletterEmail"
        @subscribe="handleSubscribe"
      />
    </main>
  </div>
</template>
