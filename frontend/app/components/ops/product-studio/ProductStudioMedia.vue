<!-- frontend/app/components/ops/product-studio/ProductStudioMedia.vue -->
<script setup lang="ts">
import { Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, Video, UploadCloud, GripVertical, Play } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { toFa } from '~/utils/format'
import { toast } from 'vue-sonner'

const {
  title,
  mediaList,
  reelsUrl,
  selectedColors,
  markDirty,
} = useOpsProductStudio()

const newImageUrl = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDraggingOverDropzone = ref(false)
const draggedIdx = ref<number | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) {
      toast.error(`فایل ${file.name} فرمت تصویر معتبر نیست.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        const nextId = mediaList.value.length ? Math.max(...mediaList.value.map((m) => m.id)) + 1 : 1
        mediaList.value.push({
          id: nextId,
          url: result,
          alt: `${title.value || 'اثر آتلیه کراس'} - زاویه ${toFa(mediaList.value.length + 1)}`,
          colorName: selectedColors.value[0] || '',
          kind: 'photo',
          position: mediaList.value.length + 1,
        })
        markDirty()
      }
    }
    reader.readAsDataURL(file)
  })

  // ریست اینپوت فایل جهت امکان انتخاب مجدد همان فایل
  target.value = ''
  toast.success('تصاویر با موفقیت به گالری اثر افزوده شدند.')
}

const addImageUrl = () => {
  if (!newImageUrl.value.trim()) return
  const nextId = mediaList.value.length ? Math.max(...mediaList.value.map((m) => m.id)) + 1 : 1
  mediaList.value.push({
    id: nextId,
    url: newImageUrl.value.trim(),
    alt: `${title.value || 'اثر آتلیه کراس'} - زاویه ${toFa(mediaList.value.length + 1)}`,
    colorName: selectedColors.value[0] || '',
    kind: 'photo',
    position: mediaList.value.length + 1,
  })
  newImageUrl.value = ''
  markDirty()
  toast.success('تصویر جدید با موفقیت درج گردید.')
}

const removeMedia = (idx: number) => {
  mediaList.value.splice(idx, 1)
  mediaList.value.forEach((m, i) => {
    m.position = i + 1
  })
  markDirty()
}

const moveUp = (idx: number) => {
  if (idx === 0) return
  const item = mediaList.value.splice(idx, 1)[0]
  if (item) {
    mediaList.value.splice(idx - 1, 0, item)
    mediaList.value.forEach((m, i) => {
      m.position = i + 1
    })
    markDirty()
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
    markDirty()
  }
}

// Drag and drop reordering
const onDragStart = (idx: number) => {
  draggedIdx.value = idx
}

const onDrop = (targetIdx: number) => {
  if (draggedIdx.value === null || draggedIdx.value === targetIdx) return
  const item = mediaList.value.splice(draggedIdx.value, 1)[0]
  if (item) {
    mediaList.value.splice(targetIdx, 0, item)
    mediaList.value.forEach((m, i) => {
      m.position = i + 1
    })
    markDirty()
  }
  draggedIdx.value = null
}
</script>

<template>
  <section id="section-media" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-rose-50 text-rose-700">
          <ImageIcon class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            تصاویر، گالری و ویدیوی تن‌خور
          </h2>
          <p class="text-[11px] text-slate-500">
            مدیریت تصاویر چندزاویه‌ای، اتصال تصویر به کالیته رنگ و فایل ویدیویی ریلز
          </p>
        </div>
      </div>
      <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
        {{ toFa(mediaList.length) }} تصویر
      </span>
    </div>

    <!-- اینپوت فایل مخفی -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileUpload"
    >

    <!-- ردیف ورودی درج لینک دستی -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
      <input
        v-model="newImageUrl"
        type="url"
        dir="ltr"
        placeholder="https://images.unsplash.com/... یا آدرس فایل اینترنتی"
        class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink transition-colors"
        @keydown.enter.prevent="addImageUrl"
      >
      <button
        type="button"
        class="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        @click="addImageUrl"
      >
        <Plus class="w-4 h-4" />
        <span>درج با لینک</span>
      </button>

      <button
        type="button"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        @click="triggerFileInput"
      >
        <UploadCloud class="w-4 h-4" />
        <span>انتخاب فایل از دستگاه</span>
      </button>
    </div>

    <!-- شبکه تصاویر گالری با دراپ‌زون در انتها -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(item, idx) in mediaList"
        :key="item.id"
        draggable="true"
        class="relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50 flex flex-col group shadow-2xs transition-all"
        :class="draggedIdx === idx ? 'opacity-40 ring-2 ring-ink' : ''"
        @dragstart="onDragStart(idx)"
        @dragover.prevent
        @drop="onDrop(idx)"
      >
        <!-- پیش‌نمایش تصویر و کنترل درگ -->
        <div class="relative aspect-3/4 bg-slate-100 overflow-hidden cursor-move">
          <img
            :src="item.url"
            :alt="item.alt || `عکس ${idx + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          >
          <div
            v-if="idx === 0"
            class="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-ink/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs"
          >
            کاور اصلی
          </div>
          <div class="absolute top-2 end-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono tabular-nums flex items-center gap-1">
            <GripVertical class="w-2.5 h-2.5 opacity-70" />
            <span>#{{ toFa(idx + 1) }}</span>
          </div>
        </div>

        <!-- کنترل‌ها، متن جایگزین و ارتباط با رنگ -->
        <div class="p-2.5 bg-white border-t border-slate-100 space-y-2 text-xs">
          <!-- متن جایگزین (Alt) -->
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">متن Alt تصویر:</label>
            <input
              v-model="item.alt"
              type="text"
              placeholder="شرح تصویر برای سئو و دسترس‌پذیری"
              class="w-full h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] outline-hidden focus:bg-white focus:border-ink"
              @input="markDirty"
            >
          </div>

          <!-- اتصال به کالیته رنگ -->
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">اتصال به کالیته رنگ:</label>
            <select
              v-model="item.colorName"
              class="w-full h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] outline-hidden focus:border-ink"
              @change="markDirty"
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

      <!-- کارت تعاملی دراپ‌زون در انتهای لیست (Dropzone Card) -->
      <div
        class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all"
        :class="isDraggingOverDropzone ? 'border-ink bg-sand-100/40' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'"
        @dragover.prevent="isDraggingOverDropzone = true"
        @dragleave="isDraggingOverDropzone = false"
        @drop.prevent="isDraggingOverDropzone = false; handleFileUpload($event)"
        @click="triggerFileInput"
      >
        <div class="p-3 rounded-full bg-slate-100 mb-2 text-slate-600 group-hover:scale-110 transition-transform">
          <UploadCloud class="w-6 h-6" />
        </div>
        <span class="text-xs font-bold text-slate-800 block mb-0.5">افزودن تصویر جدید</span>
        <span class="text-[11px] text-slate-400 block">فایل‌ها را بکشید یا کلیک کنید</span>
      </div>
    </div>

    <!-- بخش ویدیوی ریلز عمودی با پیش‌نمایش پلیر -->
    <div class="border-t border-slate-100 pt-4 text-xs space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-slate-700">
        <Video class="w-4 h-4 text-rose-500" />
        <span>آدرس ویدیوی عمودی تن‌خور و استایلینگ</span>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          v-model="reelsUrl"
          type="url"
          dir="ltr"
          placeholder="https://cdn.keras-studio.com/reels/fall1405-coat-movement.mp4"
          class="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink transition-colors"
          @input="markDirty"
        >
      </div>

      <!-- پلیر پیش‌نمایش ویدیوی عمودی -->
      <div v-if="reelsUrl" class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <div class="w-12 h-16 rounded-lg bg-black/10 overflow-hidden flex items-center justify-center shrink-0">
          <Play class="w-5 h-5 text-slate-500" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-xs font-bold text-slate-800 block truncate">فایل ویدیویی متصل شد</span>
          <span class="text-[11px] text-slate-500 font-mono truncate block" dir="ltr">{{ reelsUrl }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
