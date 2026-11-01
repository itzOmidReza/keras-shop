<!-- frontend/app/pages/internal-ops-nexus/lookbooks/new.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'طراحی ست جدید استایل | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="font-sans" dir="rtl">
    <AdminLookbookForm :is-edit-mode="false" />
  </div>
</template>

