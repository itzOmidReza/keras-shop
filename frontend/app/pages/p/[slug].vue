<!-- frontend/app/pages/p/[slug].vue -->
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const route = useRoute()
const { getProductBySlug } = useProducts()

const slug = computed(() => String(route.params.slug))
const product = await getProductBySlug(slug.value)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="product" class="space-y-4">
      <h1 class="text-2xl font-bold text-ink">{{ product.title }}</h1>
      <p class="text-muted text-sm">{{ product.description }}</p>
    </div>
    <div v-else class="text-center py-12 text-muted">
      محصول مورد نظر یافت نشد.
    </div>
  </div>
</template>
