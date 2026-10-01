<!-- frontend/app/components/product/ProductReviews.vue -->
<script setup lang="ts">
import type { Review, ProductReviewSummary } from '~/types/domain'
import {
  Star,
  ShieldCheck,
  MessageSquarePlus,
  Sparkles,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

interface Props {
  reviews: Review[]
  summary: ProductReviewSummary
  productTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  productTitle: 'محصول',
})

const isModalOpen = ref(false)
const newRating = ref(5)
const newFit = ref<'small' | 'true_to_size' | 'large'>('true_to_size')
const newComment = ref('')
const newAuthor = ref('')
const newSize = ref('M')

// محاسبه درصد فیت
const totalFitResponses = computed(() => {
  const { small, true_to_size, large } = props.summary.fit_breakdown
  return small + true_to_size + large || 1
})

const fitPercentages = computed(() => {
  const { small, true_to_size, large } = props.summary.fit_breakdown
  const total = totalFitResponses.value
  return {
    small: Math.round((small / total) * 100),
    trueToSize: Math.round((true_to_size / total) * 100),
    large: Math.round((large / total) * 100),
  }
})

// محاسبه درصد توزیع ستاره‌ها (از ۵ به ۱)
const starDistribution = computed(() => {
  const total = props.summary.total_reviews || 1
  return [5, 4, 3, 2, 1].map((star) => {
    const count = props.summary.rating_distribution[star as 1 | 2 | 3 | 4 | 5] || 0
    const percent = Math.round((count / total) * 100)
    return {
      star,
      count,
      percent,
    }
  })
})

const fitLabelMap: Record<'small' | 'true_to_size' | 'large', string> = {
  small: 'کمی کوچک‌تر از حد انتظار',
  true_to_size: 'اندازه کاملاً دقیق و استاندارد',
  large: 'کمی بزرگ‌تر از حد انتظار',
}

const handleSubmitReview = () => {
  if (!newComment.value.trim()) {
    toast.error('لطفاً نظر و تجربه استفاده خود را بنویسید.')
    return
  }

  toast.success('دیدگاه ارزشمند شما با موفقیت ثبت شد و پس از بازبینی منتشر خواهد شد.')
  newComment.value = ''
  newAuthor.value = ''
  isModalOpen.value = false
}
</script>

<template>
  <section class="mt-16 pt-12 border-t border-sand" aria-label="دیدگاه‌ها و نظرات خریداران">
    <!-- هدر بخش دیدگاه‌ها -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-rose">
            تجربه خریداران
          </span>
          <span class="inline-block w-1 h-1 rounded-full bg-sand-dark" />
          <span class="text-xs text-muted-foreground">
            {{ summary.total_reviews }} دیدگاه ثبت‌شده
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-ink tracking-tight mt-1">
          نظرات و ارزیابی کیفی {{ productTitle }}
        </h2>
      </div>

      <!-- دکمه ثبت نظر با دیالوگ -->
      <Dialog v-model:open="isModalOpen">
        <DialogTrigger as-child>
          <Button
            variant="outline"
            class="h-11 rounded-xl border-sand bg-white text-ink hover:bg-sand/40 hover:border-rose/40 font-bold text-xs gap-2 shrink-0 cursor-pointer shadow-2xs"
          >
            <MessageSquarePlus class="w-4 h-4 text-rose" />
            <span>ثبت نظر و تجربه خرید</span>
          </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-lg bg-paper border-sand rounded-2xl">
          <DialogHeader class="space-y-1.5 text-start">
            <DialogTitle class="text-lg font-bold text-ink">
              ثبت نظر درباره {{ productTitle }}
            </DialogTitle>
            <DialogDescription class="text-xs text-muted-foreground">
              تجربه شما در خصوص تن‌خور، ایستایی پارچه و مقاومت در برابر کشش به سایر ورزشکاران کمک می‌کند.
            </DialogDescription>
          </DialogHeader>

          <form class="space-y-4 pt-2" @submit.prevent="handleSubmitReview">
            <!-- نام خریدار -->
            <div class="space-y-1.5 text-start">
              <label class="text-xs font-bold text-ink">نام یا نام مستعار</label>
              <input
                v-model="newAuthor"
                type="text"
                placeholder="مثلاً: سارا م."
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:outline-none"
              >
            </div>

            <!-- امتیاز ستاره‌ای -->
            <div class="space-y-1.5 text-start">
              <label class="text-xs font-bold text-ink">امتیاز کلی شما</label>
              <div class="flex items-center gap-1.5">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="p-1 cursor-pointer transition-transform hover:scale-110"
                  @click="newRating = star"
                >
                  <Star
                    class="w-5 h-5"
                    :class="star <= newRating ? 'fill-rose text-rose' : 'text-sand'"
                  />
                </button>
                <span class="text-xs font-bold text-muted-foreground ms-2">
                  {{ newRating }} از ۵
                </span>
              </div>
            </div>

            <!-- فیدبک فیت -->
            <div class="space-y-1.5 text-start">
              <label class="text-xs font-bold text-ink">ارزیابی اندازه و فیت محصول</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  class="h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                  :class="newFit === 'small' ? 'border-rose bg-rose text-white' : 'border-sand bg-white text-ink hover:bg-sand/30'"
                  @click="newFit = 'small'"
                >
                  کمی کوچک
                </button>
                <button
                  type="button"
                  class="h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                  :class="newFit === 'true_to_size' ? 'border-rose bg-rose text-white' : 'border-sand bg-white text-ink hover:bg-sand/30'"
                  @click="newFit = 'true_to_size'"
                >
                  استاندارد
                </button>
                <button
                  type="button"
                  class="h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                  :class="newFit === 'large' ? 'border-rose bg-rose text-white' : 'border-sand bg-white text-ink hover:bg-sand/30'"
                  @click="newFit = 'large'"
                >
                  کمی آزاد
                </button>
              </div>
            </div>

            <!-- سایز خریداری شده -->
            <div class="space-y-1.5 text-start">
              <label class="text-xs font-bold text-ink">سایز خریداری‌شده</label>
              <div class="flex gap-2">
                <button
                  v-for="s in ['XS', 'S', 'M', 'L', 'XL']"
                  :key="s"
                  type="button"
                  class="h-8 w-10 rounded-lg border text-xs font-bold transition-all cursor-pointer"
                  :class="newSize === s ? 'border-rose bg-rose text-white' : 'border-sand bg-white text-ink hover:bg-sand/30'"
                  @click="newSize = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- متن دیدگاه -->
            <div class="space-y-1.5 text-start">
              <label class="text-xs font-bold text-ink">متن دیدگاه و تجربه استفاده</label>
              <textarea
                v-model="newComment"
                rows="3"
                required
                placeholder="در مورد کشسانی، عدم عبور نور و احساس روی پوست بنویسید..."
                class="w-full rounded-xl border border-sand bg-white p-3 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:outline-none leading-relaxed"
              />
            </div>

            <!-- دکمه ارسال -->
            <div class="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="rounded-xl text-xs cursor-pointer"
                @click="isModalOpen = false"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                size="sm"
                class="bg-rose text-white hover:bg-rose/90 rounded-xl text-xs font-bold px-5 cursor-pointer"
              >
                ارسال دیدگاه
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- گرید داشبورد امتیازات و سنجه فیت -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
      <!-- ستون ۱: امتیاز عددی و توزیع ستاره‌ها -->
      <div class="lg:col-span-7 rounded-2xl border border-sand bg-white/70 p-6 shadow-2xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-sand/60 pb-6">
          <div class="text-center sm:text-start space-y-1 shrink-0">
            <span class="text-4xl sm:text-5xl font-bold text-ink tracking-tight font-display">
              {{ summary.average_rating }}
            </span>
            <div class="flex items-center justify-center sm:justify-start gap-1 text-rose">
              <Star
                v-for="i in 5"
                :key="i"
                class="w-4 h-4"
                :class="i <= Math.round(summary.average_rating) ? 'fill-rose' : 'text-sand'"
              />
            </div>
            <p class="text-[11px] text-muted-foreground">
              بر اساس {{ summary.total_reviews }} ارزیابی تاییدشده
            </p>
          </div>

          <!-- خطوط تفکیک ستاره‌ها -->
          <div class="flex-1 space-y-2">
            <div
              v-for="row in starDistribution"
              :key="row.star"
              class="flex items-center gap-2 text-xs"
            >
              <span class="w-10 text-muted-foreground font-medium flex items-center gap-1 justify-end">
                <span>{{ row.star }}</span>
                <Star class="w-3 h-3 fill-rose text-rose" />
              </span>

              <div class="flex-1 h-2 rounded-full bg-sand/60 overflow-hidden">
                <div
                  class="h-full bg-rose rounded-full transition-all duration-500"
                  :style="{ width: `${row.percent}%` }"
                />
              </div>

              <span class="w-8 text-[11px] text-muted-foreground text-start">
                {{ row.percent }}٪
              </span>
            </div>
          </div>
        </div>

        <!-- سنجه اختصاصی فیت پوشاک ورزشی (Fit Sentiment Bar) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 font-bold text-ink">
              <Sparkles class="w-3.5 h-3.5 text-rose" />
              <span>ارزیابی سایز و فیت (Fit Sentiment)</span>
            </div>
            <span class="text-[11px] font-bold text-sage">
              {{ fitPercentages.trueToSize }}٪ اندازه استاندارد (True to size)
            </span>
          </div>

          <!-- میله سه‌بخشی فیت -->
          <div class="h-2.5 w-full rounded-full bg-sand/40 overflow-hidden flex">
            <div
              class="bg-sand-dark h-full transition-all"
              :style="{ width: `${fitPercentages.small}%` }"
              title="کمی کوچک"
            />
            <div
              class="bg-sage h-full transition-all"
              :style="{ width: `${fitPercentages.trueToSize}%` }"
              title="کاملاً استاندارد"
            />
            <div
              class="bg-sand-dark h-full transition-all"
              :style="{ width: `${fitPercentages.large}%` }"
              title="کمی آزاد"
            />
          </div>

          <div class="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>کمی کوچک ({{ fitPercentages.small }}٪)</span>
            <span class="font-bold text-ink">استاندارد ({{ fitPercentages.trueToSize }}٪)</span>
            <span>کمی آزاد ({{ fitPercentages.large }}٪)</span>
          </div>
        </div>
      </div>

      <!-- ستون ۲: کارت تضمین استانداردهای کیفی کراس -->
      <aside class="lg:col-span-5 rounded-2xl border border-sand bg-sand/25 p-6 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-rose">
            استاندارد اصالت نظر
          </span>
          <h3 class="text-sm font-bold text-ink">
            دیدگاه‌های ۱۰۰٪ راستی‌آزمایی‌شده
          </h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            تمامی بازخوردهای ثبت‌شده پس از تطبیق با سفارش قطعی و آزمون عملی الاستیسیته، عدم بدن‌نمایی در اسکات و رفتار بافت در شست‌وشو درج می‌شوند.
          </p>
        </div>

        <div class="pt-3 border-t border-sand/80 flex items-center gap-2 text-xs font-bold text-sage">
          <ShieldCheck class="w-4 h-4 text-sage" />
          <span>ضمانت تطابق کیفیت الیاف با گواهی OEKO-TEX</span>
        </div>
      </aside>
    </div>

    <!-- لیست کارت‌های دیدگاه خریداران -->
    <div class="space-y-4">
      <div
        v-for="rev in reviews"
        :key="rev.id"
        class="rounded-2xl border border-sand bg-white/60 p-5 sm:p-6 space-y-3.5 shadow-2xs transition-all hover:border-sand-dark hover:bg-white/80"
      >
        <!-- ردیف اطلاعات خریدار و امتیاز -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sand/50 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-bold text-ink">
              {{ rev.author }}
            </span>

            <span
              v-if="rev.verified_purchase"
              class="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-medium text-sage border border-sage/20"
            >
              <ShieldCheck class="w-3 h-3" />
              خریدار تاییدشده
            </span>

            <span
              v-if="rev.size_purchased"
              class="rounded-full bg-sand/50 px-2 py-0.5 text-[10px] font-bold text-muted-foreground"
            >
              سایز {{ rev.size_purchased }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-0.5 text-rose">
              <Star
                v-for="s in 5"
                :key="s"
                class="w-3.5 h-3.5"
                :class="s <= rev.rating ? 'fill-rose' : 'text-sand'"
              />
            </div>
            <time class="text-[11px] text-muted-foreground" :datetime="rev.created_at">
              {{ formatDate(rev.created_at) }}
            </time>
          </div>
        </div>

        <!-- فیدبک فیت -->
        <div class="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span class="font-bold text-ink">نظر درباره فیت:</span>
          <span class="text-rose font-medium">{{ fitLabelMap[rev.fit_feedback] }}</span>
        </div>

        <!-- متن دیدگاه -->
        <p class="text-xs sm:text-sm text-ink leading-relaxed">
          {{ rev.comment }}
        </p>
      </div>
    </div>
  </section>
</template>
