<!-- frontend/app/pages/internal-ops-nexus/articles/[id]/edit.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const route = useRoute()
const articleId = computed(() => Number(route.params.id))

useSeoMeta({
  title: 'ویرایش مقاله ژورنال ادیتوریال | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <AdminArticleForm mode="edit" :article-id="articleId" />
</template>
