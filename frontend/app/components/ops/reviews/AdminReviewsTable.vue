<!-- frontend/app/components/ops/reviews/AdminReviewsTable.vue -->
<script setup lang="ts">
import type { ProductReview } from '~/types/domain'
import {
  Check,
  X,
  CornerDownLeft,
  Trash2,
  Star,
  ShieldCheck,
  MessageSquareQuote,
  ExternalLink,
  MessageSquareOff,
} from '@lucide/vue'
import { useAdminReviews } from '~/composables/admin/useAdminReviews'

interface Props {
  reviews: ProductReview[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'reply', review: ProductReview): void
}>()

const { approveReview, rejectReview, deleteReview } = useAdminReviews()

const statusMap = {
  pending: {
    label: 'در انتظار بررسی',
    class: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  approved: {
    label: 'تاییدشده',
    class: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  rejected: {
    label: 'ردشده',
    class: 'bg-rose-50 text-rose-800 border-rose-200',
  },
}

const fitMap: Record<string, string> = {
  true_to_size: 'استاندارد',
  runs_small: 'کمی کوچک',
  small: 'کمی کوچک',
  runs_large: 'کمی آزاد',
  large: 'کمی آزاد',
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
    <!-- حالت خالی بودن لیست -->
    <div
      v-if="reviews.length === 0"
      class="py-16 px-4 text-center space-y-3"
      data-testid="reviews-empty-state"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <MessageSquareOff class="w-6 h-6" />
      </div>
      <h3 class="text-sm font-bold text-slate-800">
        هیچ دیدگاهی با فیلترهای جاری یافت نشد
      </h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        می‌توانید فیلتر وضعیت یا کلمات جستجو را تغییر دهید تا دیدگاه‌های دیگر نمایش داده شوند.
      </p>
    </div>

    <!-- جدول دیدگاه‌ها -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-start text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold">
            <th class="py-3 px-4 text-start font-bold">محصول</th>
            <th class="py-3 px-4 text-start font-bold">خریدار</th>
            <th class="py-3 px-3 text-start font-bold">امتیاز</th>
            <th class="py-3 px-4 text-start font-bold min-w-[260px]">متن دیدگاه و پاسخ آتلیه</th>
            <th class="py-3 px-3 text-start font-bold whitespace-nowrap">تاریخ ثبت</th>
            <th class="py-3 px-3 text-start font-bold">وضعیت</th>
            <th class="py-3 px-4 text-end font-bold whitespace-nowrap">عملیات مدیریت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="rev in reviews"
            :key="rev.id"
            :data-testid="`review-row-${rev.id}`"
            class="hover:bg-slate-50/70 transition-colors group"
          >
            <!-- ستون محصول -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-2.5 max-w-[220px]">
                <img
                  :src="rev.productThumbnail"
                  :alt="rev.productTitle"
                  class="w-10 h-13 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                >
                <div class="min-w-0">
                  <NuxtLink
                    :to="`/products/${rev.productSlug}`"
                    target="_blank"
                    class="font-bold text-slate-900 hover:text-rose transition-colors line-clamp-2 leading-tight flex items-center gap-1 group/link"
                  >
                    <span>{{ rev.productTitle }}</span>
                    <ExternalLink class="w-3 h-3 opacity-0 group-hover/link:opacity-100 shrink-0 text-slate-400" />
                  </NuxtLink>
                  <span class="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                    {{ rev.productSlug }}
                  </span>
                </div>
              </div>
            </td>

            <!-- ستون خریدار -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="space-y-1">
                <span class="font-bold text-slate-800 block">
                  {{ rev.authorName }}
                </span>
                <span
                  v-if="rev.isVerifiedBuyer"
                  class="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-bold"
                >
                  <ShieldCheck class="w-2.5 h-2.5" />
                  خریدار تاییدشده
                </span>
                <span
                  v-else
                  class="text-[10px] text-slate-400 block"
                >
                  کاربر عادی
                </span>
              </div>
            </td>

            <!-- ستون امتیاز -->
            <td class="py-3.5 px-3 whitespace-nowrap">
              <div class="flex items-center gap-0.5 text-amber-400">
                <Star
                  v-for="s in 5"
                  :key="s"
                  class="w-3.5 h-3.5"
                  :class="s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'"
                />
              </div>
              <span class="text-[10px] font-mono font-bold text-slate-500 block mt-0.5">
                {{ rev.rating }} از ۵
              </span>
            </td>

            <!-- ستون متن دیدگاه و پاسخ آتلیه -->
            <td class="py-3.5 px-4">
              <div class="space-y-2">
                <!-- فیدبک فیت اگر وجود داشته باشد -->
                <div v-if="rev.fitFeedback || rev.fit_feedback" class="flex items-center gap-1.5 text-[10px]">
                  <span class="text-slate-400">فیت:</span>
                  <span class="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                    {{ fitMap[rev.fitFeedback || rev.fit_feedback || ''] || 'استاندارد' }}
                  </span>
                  <span v-if="rev.size_purchased" class="text-slate-400 ms-1 font-mono">
                    (سایز {{ rev.size_purchased }})
                  </span>
                </div>

                <!-- متن نظر خریدار -->
                <p class="text-xs text-slate-800 leading-relaxed font-normal">
                  {{ rev.comment }}
                </p>

                <!-- پاسخ رسمی آتلیه (در صورت وجود) -->
                <div
                  v-if="rev.reply?.text"
                  class="rounded-lg border-s-2 border-rose bg-rose-50/40 p-2.5 space-y-1"
                >
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="font-bold text-rose flex items-center gap-1">
                      <MessageSquareQuote class="w-3 h-3" />
                      {{ rev.reply.author || 'پاسخ آتلیه کراس' }}
                    </span>
                    <span v-if="rev.reply.date" class="text-slate-400 font-mono">
                      {{ rev.reply.date }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-700 leading-relaxed">
                    {{ rev.reply.text }}
                  </p>
                </div>
              </div>
            </td>

            <!-- ستون تاریخ -->
            <td class="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
              {{ rev.date }}
            </td>

            <!-- ستون وضعیت -->
            <td class="py-3.5 px-3 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                :class="statusMap[rev.status]?.class"
                :data-testid="`review-status-${rev.id}`"
              >
                {{ statusMap[rev.status]?.label }}
              </span>
            </td>

            <!-- ستون دکمه‌های عملیاتی -->
            <td class="py-3.5 px-4 text-end whitespace-nowrap">
              <div class="inline-flex items-center gap-1 justify-end">
                <!-- تایید یک‌کلیکی -->
                <button
                  type="button"
                  title="تایید و انتشار دیدگاه"
                  data-testid="approve-review-btn"
                  :disabled="rev.status === 'approved'"
                  class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                  @click="approveReview(rev.id)"
                >
                  <Check class="w-4 h-4" />
                </button>

                <!-- رد یک‌کلیکی -->
                <button
                  type="button"
                  title="رد دیدگاه"
                  data-testid="reject-review-btn"
                  :disabled="rev.status === 'rejected'"
                  class="p-1.5 rounded-lg text-rose hover:bg-rose-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                  @click="rejectReview(rev.id)"
                >
                  <X class="w-4 h-4" />
                </button>

                <!-- پاسخ‌دهی به دیدگاه -->
                <button
                  type="button"
                  title="ثبت یا ویرایش پاسخ آتلیه"
                  data-testid="open-reply-modal-btn"
                  class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                  @click="emit('reply', rev)"
                >
                  <CornerDownLeft class="w-4 h-4" />
                </button>

                <!-- حذف دیدگاه -->
                <button
                  type="button"
                  title="حذف دیدگاه"
                  data-testid="delete-review-btn"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose hover:bg-rose-50 cursor-pointer transition-colors"
                  @click="deleteReview(rev.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
