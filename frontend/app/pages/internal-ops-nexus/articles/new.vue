<!-- frontend/app/pages/internal-ops-nexus/articles/new.vue -->
<script setup lang="ts">
import AdminArticleForm from '~/components/ops/articles/AdminArticleForm.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'نگارش مقاله جدید در ژورنال ادیتوریال | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <AdminArticleForm mode="new" />
</template>
