<!-- frontend/app/pages/internal-ops-nexus/attributes/index.vue -->
<script setup lang="ts">
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsColorSwatchesManager from '~/components/ops/taxonomy/OpsColorSwatchesManager.vue'
import OpsCategoryTreeManager from '~/components/ops/taxonomy/OpsCategoryTreeManager.vue'
import OpsBrandsManager from '~/components/ops/taxonomy/OpsBrandsManager.vue'
import OpsCollectionsManager from '~/components/ops/taxonomy/OpsCollectionsManager.vue'
import OpsSizeTemplatesManager from '~/components/ops/taxonomy/OpsSizeTemplatesManager.vue'
import OpsQuickAddAttributeModal from '~/components/ops/taxonomy/OpsQuickAddAttributeModal.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'ویژگی‌ها و دسته‌بندی | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const activeSubTab = ref<'colors' | 'categories' | 'brands' | 'collections' | 'sizes'>('colors')
const subNavTabs = [
  { id: 'colors', label: 'رنگ‌ها و پترن‌ها' },
  { id: 'categories', label: 'درخت دسته‌بندی' },
  { id: 'brands', label: 'برندها و طراحان' },
  { id: 'collections', label: 'کالکشن‌ها و دراپ‌ها' },
  { id: 'sizes', label: 'قالب‌های راهنمای سایز' },
]

const isQuickAddOpen = ref(false)
const quickAddType = ref<'color' | 'category' | 'brand'>('color')

const openQuickAdd = (type: 'color' | 'category' | 'brand') => {
  quickAddType.value = type
  isQuickAddOpen.value = true
}
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans" data-testid="nexus-attributes-view">
    <!-- تب‌های افقی سطح دوم ناوبری ویژگی‌ها (44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <!-- بخش‌های زیرمجموعه -->
    <OpsColorSwatchesManager
      v-if="activeSubTab === 'colors'"
      @open-add-color="openQuickAdd('color')"
    />

    <OpsCategoryTreeManager
      v-else-if="activeSubTab === 'categories'"
      @open-add-category="openQuickAdd('category')"
    />

    <OpsBrandsManager
      v-else-if="activeSubTab === 'brands'"
      @open-add-brand="openQuickAdd('brand')"
    />

    <OpsCollectionsManager v-else-if="activeSubTab === 'collections'" />

    <OpsSizeTemplatesManager v-else-if="activeSubTab === 'sizes'" />

    <!-- میکرو مودال ایجاد آنی صفت -->
    <OpsQuickAddAttributeModal
      v-model:open="isQuickAddOpen"
      :default-type="quickAddType"
      @created="() => {}"
    />
  </div>
</template>
