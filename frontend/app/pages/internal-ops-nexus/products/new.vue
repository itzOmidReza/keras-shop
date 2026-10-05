<!-- frontend/app/pages/internal-ops-nexus/products/new.vue -->
<script setup lang="ts">
import AdminProductStudioForm from '~/components/ops/AdminProductStudioForm.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'افزودن محصول جدید به کاتالوگ آتلیه | مرکز عملیات کراس', robots: 'noindex, nofollow' })
</script>

<template>
  <AdminProductStudioForm mode="new" />
</template>
