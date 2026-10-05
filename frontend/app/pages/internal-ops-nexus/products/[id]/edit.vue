<!-- frontend/app/pages/internal-ops-nexus/products/[id]/edit.vue -->
<script setup lang="ts">
import AdminProductStudioForm from '~/components/ops/AdminProductStudioForm.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const route = useRoute()
const productId = computed(() => Number(route.params.id))

useSeoMeta({ title: 'ویرایش محصول کاتالوگ | مرکز عملیات کراس', robots: 'noindex, nofollow' })
</script>

<template>
  <AdminProductStudioForm mode="edit" :product-id="productId" />
</template>
