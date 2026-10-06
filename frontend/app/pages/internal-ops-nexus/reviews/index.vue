<!-- frontend/app/pages/internal-ops-nexus/reviews/index.vue -->
<script setup lang="ts">
import { MessageSquareQuote, ShieldAlert, RefreshCw } from '@lucide/vue'
import type { ProductReview } from '~/types/domain'
definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const {
  filteredReviews,
  pendingCount,
  isLoading,
  fetchReviews,
} = useAdminReviews()

const selectedReviewForReply = ref<ProductReview | null>(null)
const isReplyModalOpen = ref(false)

const handleOpenReplyModal = (review: ProductReview) => {
  selectedReviewForReply.value = review
  isReplyModalOpen.value = true
}

const handleRefresh = () => {
  fetchReviews(true)
}
</script>

<template>
  <div class="space-y-6" data-testid="nexus-reviews-page">
    <!-- هدر بخش میز نظرات و دیدگاه‌ها -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center shadow-2xs">
            <MessageSquareQuote class="w-4 h-4 text-amber-300" />
          </div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            میز بررسی و مدیریت نظرات خریداران
          </h1>
        </div>
        <p class="text-xs text-slate-500">
          بررسی، تایید، رد و پاسخگویی رسمی آتلیه به ارزیابی‌ها و تجربیات واقعی خرید.
        </p>
      </div>

      <!-- کنترل‌های هدر -->
      <div class="flex items-center gap-2.5 self-start sm:self-auto">
        <!-- نشانگر دیدگاه‌های نیازمند بررسی -->
        <div
          v-if="pendingCount > 0"
          data-testid="pending-reviews-indicator"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
        >
          <ShieldAlert class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{{ pendingCount }} نظر در انتظار بررسی</span>
        </div>

        <!-- دکمه تازه‌سازی -->
        <button
          type="button"
          data-testid="refresh-reviews-btn"
          :disabled="isLoading"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors"
          @click="handleRefresh"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
          <span>تازه‌سازی</span>
        </button>
      </div>
    </header>

    <!-- نوار فیلتر و جستجو -->
    <AdminReviewsFilterBar />

    <!-- جدول لیست دیدگاه‌ها -->
    <AdminReviewsTable
      :reviews="filteredReviews"
      @reply="handleOpenReplyModal"
    />

    <!-- مدال ثبت/ویرایش پاسخ آتلیه -->
    <AdminReviewReplyModal
      v-model:open="isReplyModalOpen"
      :review="selectedReviewForReply"
    />
  </div>
</template>
