<!-- frontend/app/components/ops/reviews/AdminReviewReplyModal.vue -->
<script setup lang="ts">
import type { ProductReview } from '~/types/domain'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import {
  Star,
  ShieldCheck,
  MessageSquareQuote,
  Sparkles,
} from '@lucide/vue'

interface Props {
  review: ProductReview | null
}

const props = defineProps<Props>()
const isOpen = defineModel<boolean>('open', { default: false })

const { replyToReview } = useAdminReviews()
const replyText = ref('')
const isSubmitting = ref(false)

watch(
  () => props.review,
  (rev) => {
    if (rev?.reply?.text) {
      replyText.value = rev.reply.text
    } else {
      replyText.value = ''
    }
  },
  { immediate: true },
)

const quickPresets = [
  'سپاس از حسن سلیقه و اعتماد شما به کیفیت آتلیه کراس. رضایت شما افتخار ماست.',
  'همراه گرامی، جهت پشتیبانی و راهنمایی سایزبندی، تیم آتلیه کراس همواره آماده پاسخگویی است.',
  'از بازخورد دقیق شما سپاسگزاریم، نکات مطرح‌شده جهت ارتقای استانداردهای تولید بررسی خواهد شد.',
]

const handleApplyPreset = (preset: string) => {
  replyText.value = preset
}

const handleSaveReply = async () => {
  if (!props.review) return
  if (!replyText.value.trim()) return

  try {
    isSubmitting.value = true
    await replyToReview(props.review.id, replyText.value)
    isOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-0 overflow-hidden">
      <!-- هدر مدال -->
      <DialogHeader class="p-5 border-b border-slate-100 bg-slate-50/70 text-start">
        <div class="flex items-center gap-2 text-rose">
          <MessageSquareQuote class="w-5 h-5" />
          <DialogTitle class="text-sm font-bold text-slate-900">
            پاسخ رسمی آتلیه به دیدگاه مشتری
          </DialogTitle>
        </div>
        <DialogDescription class="text-xs text-slate-500 mt-1">
          این پاسخ در زیر دیدگاه مشتری در صفحه محصول (PDP) برای تمامی کاربران نمایش داده خواهد شد.
        </DialogDescription>
      </DialogHeader>

      <div v-if="review" class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- کارت خلاصه دیدگاه مشتری -->
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3">
          <!-- اطلاعات محصول و خریدار -->
          <div class="flex items-start gap-3">
            <img
              :src="review.productThumbnail"
              :alt="review.productTitle"
              class="w-12 h-15 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
            >
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-slate-900 truncate">
                  {{ review.productTitle }}
                </span>
                <span class="text-[11px] text-slate-400 font-mono shrink-0">
                  {{ review.date }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-700">
                  {{ review.authorName }}
                </span>
                <span
                  v-if="review.isVerifiedBuyer"
                  class="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-bold"
                >
                  <ShieldCheck class="w-3 h-3" />
                  خریدار تاییدشده
                </span>
              </div>

              <!-- ستاره‌ها -->
              <div class="flex items-center gap-1 text-amber-400 pt-0.5">
                <Star
                  v-for="s in 5"
                  :key="s"
                  class="w-3 h-3"
                  :class="s <= review.rating ? 'fill-amber-400' : 'text-slate-200'"
                />
                <span class="text-[10px] text-slate-500 font-bold ms-1">
                  {{ review.rating }} از ۵
                </span>
              </div>
            </div>
          </div>

          <!-- متن دیدگاه مشتری -->
          <div class="pt-2 border-t border-slate-200/60">
            <p class="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/60">
              «{{ review.comment }}»
            </p>
          </div>
        </div>

        <!-- فرم نوشتن پاسخ -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>متن پاسخ آتلیه کراس</span>
            <span class="text-[11px] text-slate-400 font-normal">نام ارسال‌کننده: آتلیه کراس</span>
          </label>
          <textarea
            v-model="replyText"
            data-testid="review-reply-textarea"
            rows="4"
            placeholder="پاسخ محترمانه و دقیق خود را اینجا بنویسید..."
            class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors leading-relaxed"
          />
        </div>

        <!-- الگوهای سریع پاسخ -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>متن‌های آماده پیشنهادی:</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <button
              v-for="(preset, idx) in quickPresets"
              :key="idx"
              type="button"
              class="text-start text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200/70 transition-colors cursor-pointer"
              @click="handleApplyPreset(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </div>
      </div>

      <!-- پاورقی و دکمه‌ها -->
      <DialogFooter class="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="rounded-xl text-xs cursor-pointer"
          @click="isOpen = false"
        >
          انصراف
        </Button>
        <Button
          type="button"
          size="sm"
          data-testid="submit-review-reply-btn"
          :disabled="!replyText.trim() || isSubmitting"
          class="bg-ink text-white hover:bg-ink/90 rounded-xl text-xs font-bold px-4 cursor-pointer"
          @click="handleSaveReply"
        >
          <span v-if="isSubmitting">در حال ثبت...</span>
          <span v-else>ثبت و انتشار پاسخ</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
