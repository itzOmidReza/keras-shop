<!-- frontend/app/pages/blog.vue -->
<script setup lang="ts">
import { useBlogArticles } from '~/composables/blog/useBlogArticles'
import BlogHero from '~/components/blog/BlogHero.vue'
import BlogFeaturedCard from '~/components/blog/BlogFeaturedCard.vue'
import BlogArticleGrid from '~/components/blog/BlogArticleGrid.vue'
import BlogNewsletterSection from '~/components/blog/BlogNewsletterSection.vue'

useSeoMeta({
  title: 'مجله علمی و تخصصی ورزشی | کراس',
  description: 'مقالات مرجع در حوزه فیزیولوژی تمرین، علم الیاف و منسوجات، ذهن‌آگاهی و ریکاوری ورزشکاران کراس',
})

const {
  activeCategory,
  searchQuery,
  selectedArticle,
  newsletterEmail,
  filteredArticles,
  featuredArticle,
  handleSubscribe,
  selectArticle,
  closeArticleModal,
} = useBlogArticles()
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر مجله و فیلترها -->
    <BlogHero
      v-model:search-query="searchQuery"
      v-model:active-category="activeCategory"
    />

    <!-- مقاله برجسته شاخص -->
    <BlogFeaturedCard
      v-if="!searchQuery && activeCategory === 'all'"
      :article="featuredArticle"
      @select="selectArticle"
    />

    <!-- شبکه مقالات و وضعیت خالی -->
    <BlogArticleGrid
      :articles="filteredArticles"
      @select="selectArticle"
      @reset-filters="() => { searchQuery = ''; activeCategory = 'all' }"
    />

    <!-- مدال مطالعه سریع مقاله (Lazy loaded) -->
    <LazyBlogQuickReadModal
      :article="selectedArticle"
      @close="closeArticleModal"
    />

    <!-- بخش خبرنامه علمی کراس -->
    <BlogNewsletterSection
      v-model:email="newsletterEmail"
      @subscribe="handleSubscribe"
    />
  </div>
</template>
