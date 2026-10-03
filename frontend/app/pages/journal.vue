<!-- frontend/app/pages/journal.vue -->
<script setup lang="ts">
import { useJournalLookbook } from '~/composables/journal/useJournalLookbook'
import JournalHero from '~/components/journal/JournalHero.vue'
import JournalLookbookGrid from '~/components/journal/JournalLookbookGrid.vue'
import JournalManifesto from '~/components/journal/JournalManifesto.vue'

useSeoMeta({
  title: 'ژورنال و لوک‌بوک ادیتوریال | کراس',
  description: 'لوک‌بوک اختصاصی کالکشن‌های پوشاک ورزشی کراس؛ پیوند طراحی مینیمال، هنر عکاسی و عملکرد ورزشی',
})

const {
  activeCollection,
  selectedFrame,
  filteredItems,
  selectFrame,
  closeFrameModal,
} = useJournalLookbook()
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر ژورنال ادیتوریال -->
    <JournalHero v-model:active-collection="activeCollection" />

    <!-- گالری لوک‌بوک و مانیفست برند -->
    <main class="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
      <JournalLookbookGrid
        :items="filteredItems"
        @select="selectFrame"
      />

      <JournalManifesto />
    </main>

    <!-- مدال لایت‌باکس جزئیات فریم (Lazy loaded) -->
    <LazyJournalLightboxModal
      :item="selectedFrame"
      @close="closeFrameModal"
    />
  </div>
</template>
