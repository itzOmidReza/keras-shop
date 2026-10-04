<!-- frontend/app/components/ops/product-studio/ProductStudioMedia.vue -->
<script setup lang="ts">
import { Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, Video, ExternalLink } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'

const {
  mediaList,
  reelsUrl,
  selectedColors,
} = useOpsProductStudio()

const newImageUrl = ref('')

const addImage = () => {
  if (!newImageUrl.value.trim()) return
  const nextId = mediaList.value.length ? Math.max(...mediaList.value.map((m) => m.id)) + 1 : 1
  mediaList.value.push({
    id: nextId,
    url: newImageUrl.value.trim(),
    colorName: selectedColors.value[0] || 'اصلی',
    kind: 'photo',
    position: mediaList.value.length + 1,
  })
  newImageUrl.value = ''
}

const removeMedia = (idx: number) => {
  mediaList.value.splice(idx, 1)
  // به‌روزرسانی پوزیشن‌ها
  mediaList.value.forEach((m, i) => {
    m.position = i + 1
  })
}

const moveUp = (idx: number) => {
  if (idx === 0) return
  const item = mediaList.value.splice(idx, 1)[0]
  if (item) {
    mediaList.value.splice(idx - 1, 0, item)
    mediaList.value.forEach((m, i) => {
      m.position = i + 1
    })
  }
}

const moveDown = (idx: number) => {
  if (idx === mediaList.value.length - 1) return
  const item = mediaList.value.splice(idx, 1)[0]
  if (item) {
    mediaList.value.splice(idx + 1, 0, item)
    mediaList.value.forEach((m, i) => {
      m.position = i + 1
    })
  }
}
</script>

<template>
  <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-rose-50 text-rose-700">
          <ImageIcon class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            گالری چندرسانه‌ای و ویدیوی ریلز (Multimedia & Reels)
          </h2>
          <p class="text-[11px] text-slate-500">
            بارگذاری تصاویر چندزاویه‌ای، اتصال تصویر به کالیته رنگ و ویدیوهای عمودی PDP
          </p>
        </div>
      </div>
      <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
        {{ mediaList.length }} تصویر
      </span>
    </div>

    <!-- ورودی افزودن تصویر جدید -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
      <input
        v-model="newImageUrl"
        type="url"
        dir="ltr"
        placeholder="https://images.unsplash.com/... یا آدرس فایل CDN"
        class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink transition-colors"
        @keydown.enter.prevent="addImage"
      >
      <button
        type="button"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        @click="addImage"
      >
        <Plus class="w-4 h-4" />
        <span>افزودن تصویر به گالری</span>
      </button>
    </div>

    <!-- کارت‌های تصاویر گالری -->
    <div v-if="mediaList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(item, idx) in mediaList"
        :key="item.id"
        class="relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50 flex flex-col group shadow-2xs"
      >
        <!-- پیش‌نمایش تصویر -->
        <div class="relative aspect-3/4 bg-slate-100 overflow-hidden">
          <img
            :src="item.url"
            :alt="`عکس ${idx + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          >
          <!-- نشان کاور اصلی -->
          <div
            v-if="idx === 0"
            class="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-ink/90 text-white text-[10px] font-bold backdrop-blur-xs"
          >
            کاور اصلی
          </div>
          <div class="absolute top-2 end-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono tabular-nums">
            #{{ idx + 1 }}
          </div>
        </div>

        <!-- کنترل‌ها و ارتباط با رنگ -->
        <div class="p-2.5 bg-white border-t border-slate-100 space-y-2 text-xs">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">اتصال به کالیته رنگ:</label>
            <select
              v-model="item.colorName"
              class="w-full h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] outline-hidden focus:border-ink"
            >
              <option value="">بدون انتساب (عمومی)</option>
              <option
                v-for="clr in selectedColors"
                :key="clr"
                :value="clr"
              >
                {{ clr }}
              </option>
            </select>
          </div>

          <!-- دکمه‌های جابجایی ترتیب و حذف -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-1">
              <button
                type="button"
                :disabled="idx === 0"
                class="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="انتقال به ابتدا"
                @click="moveUp(idx)"
              >
                <ArrowUp class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                :disabled="idx === mediaList.length - 1"
                class="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="انتقال به انتها"
                @click="moveDown(idx)"
              >
                <ArrowDown class="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              class="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="حذف تصویر"
              @click="removeMedia(idx)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <ImageIcon class="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p class="text-xs text-slate-500 font-medium">هیچ تصویری برای این کالا افزوده نشده است.</p>
      <p class="text-[11px] text-slate-400 mt-1">با درج لینک تصویر در کادر بالا، گالری را شکل دهید.</p>
    </div>

    <!-- بخش ویدیوی ریلز عمودی اینستاگرام / استودیو -->
    <div class="border-t border-slate-100 pt-4 text-xs">
      <div class="flex items-center gap-1.5 mb-1.5 font-bold text-slate-700">
        <Video class="w-4 h-4 text-rose-500" />
        <span>آدرس ویدیوی عمودی / ریلز تن‌خور (Editorial Reels Video URL)</span>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="reelsUrl"
          type="url"
          dir="ltr"
          placeholder="https://cdn.keras-studio.com/reels/fall1405-coat-movement.mp4"
          class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink transition-colors"
        >
        <a
          v-if="reelsUrl"
          :href="reelsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>مشاهده</span>
        </a>
      </div>
      <p class="text-[11px] text-slate-400 mt-1.5">
        این ویدیو در صفحه محصول (PDP) برای نمایش لختی پارچه و نحوه حرکت الیاف پخش خواهد شد.
      </p>
    </div>
  </section>
</template>
