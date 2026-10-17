<!-- frontend/app/components/ops/ProductStudioMedia.vue -->
<script setup lang="ts">
import {
  UploadCloud,
  ImagePlus,
  Link2,
  Trash2,
  Star,
  CheckCircle2,
  FileImage,
  ImageIcon,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

const props = withDefaults(
  defineProps<{
    galleryImages?: string[]
    mainImage?: string
  }>(),
  {
    galleryImages: () => [],
    mainImage: '',
  },
)

const emit = defineEmits<{
  (e: 'update:galleryImages', images: string[]): void
  (e: 'update:mainImage', image: string): void
  (e: 'filesSelected', files: File[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const showUrlInput = ref(false)
const newImageUrl = ref('')
const isProcessing = ref(false)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  // اگر از کانتینر اصلی دراپ خارج شد
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  if (
    e.clientX <= rect.left ||
    e.clientX >= rect.right ||
    e.clientY <= rect.top ||
    e.clientY >= rect.bottom
  ) {
    isDragging.value = false
  }
}

const processFiles = async (files: FileList | File[]) => {
  const fileArray = Array.from(files)
  if (fileArray.length === 0) return

  const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'))
  if (imageFiles.length === 0) {
    toast.error('لطفاً فقط فایل‌های تصویری معتبر (JPG, PNG, WEBP, AVIF) انتخاب کنید.')
    return
  }

  // بررسی حجم فایل‌ها (حداکثر ۱۰ مگابایت برای هر فایل)
  const MAX_SIZE = 10 * 1024 * 1024
  const oversized = imageFiles.find((f) => f.size > MAX_SIZE)
  if (oversized) {
    toast.error(`حجم تصویر «${oversized.name}» بیش از حد مجاز (۱۰ مگابایت) است.`)
    return
  }

  isProcessing.value = true
  emit('filesSelected', imageFiles)

  try {
    const readPromises = imageFiles.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        }),
    )

    const base64List = await Promise.all(readPromises)
    const updated = [...props.galleryImages, ...base64List]
    emit('update:galleryImages', updated)

    if (!props.mainImage && updated[0]) {
      emit('update:mainImage', updated[0])
    }

    toast.success(`${toFa(imageFiles.length)} تصویر با موفقیت به گالری محصول افزوده شد.`)
  } catch {
    toast.error('خطا در خواندن فایل‌های تصویری. لطفاً دوباره تلاش کنید.')
  } finally {
    isProcessing.value = false
    isDragging.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    await processFiles(e.dataTransfer.files)
  }
}

const onFileInputChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    await processFiles(input.files)
  }
}

const handleAddUrl = () => {
  const url = newImageUrl.value.trim()
  if (!url) return

  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image')) {
    toast.error('نشانی اینترنتی تصویر باید با http:// یا https:// آغاز شود.')
    return
  }

  const updated = [...props.galleryImages, url]
  emit('update:galleryImages', updated)
  if (!props.mainImage) {
    emit('update:mainImage', url)
  }
  newImageUrl.value = ''
  toast.success('تصویر از آدرس اینترنتی به گالری اضافه شد.')
}

const handleRemove = (index: number) => {
  const removed = props.galleryImages[index]
  const updated = props.galleryImages.filter((_, i) => i !== index)
  emit('update:galleryImages', updated)

  if (props.mainImage === removed) {
    emit('update:mainImage', updated[0] || '')
  }
}

const handleSetMain = (image: string) => {
  emit('update:mainImage', image)
  // همچنین می‌توان تصویر اصلی را به ابتدای آرایه منتقل کرد
  const filtered = props.galleryImages.filter((img) => img !== image)
  emit('update:galleryImages', [image, ...filtered])
  toast.success('تصویر منتخب به عنوان تصویر اصلی کاتالوگ تنظیم شد.')
}

const handleClearAll = () => {
  emit('update:galleryImages', [])
  emit('update:mainImage', '')
  toast.info('تمامی تصاویر از گالری حذف شدند.')
}
</script>

<template>
  <div class="space-y-4">
    <!-- بخش درگ اند دراپ لوکس و مدرن -->
    <div
      class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-6 sm:p-8 text-center"
      :class="[
        isDragging
          ? 'border-ink bg-slate-100/90 ring-4 ring-ink/10 scale-[1.008]'
          : 'border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50',
      ]"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif"
        class="hidden"
        @change="onFileInputChange"
      >

      <div class="max-w-md mx-auto space-y-3 pointer-events-none">
        <div
          class="w-13 h-13 mx-auto rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center transition-transform"
          :class="isDragging ? 'scale-110 text-ink' : 'text-slate-600'"
        >
          <UploadCloud v-if="!isProcessing" class="w-6 h-6" />
          <div v-else class="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
        </div>

        <div>
          <h3 class="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
            تصاویر را به اینجا بکشید و رها کنید
          </h3>
          <p class="text-[11px] text-slate-500 mt-1">
            یا برای انتخاب از پوشه‌های دستگاه، <span class="text-ink font-bold underline underline-offset-4">اینجا کلیک کنید</span>
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-400 font-medium">
          <span class="inline-flex items-center gap-1">
            <FileImage class="w-3 h-3 text-slate-400" />
            JPG, PNG, WEBP, AVIF
          </span>
          <span>•</span>
          <span>حداکثر ۱۰ مگابایت برای هر فریم</span>
        </div>
      </div>
    </div>

    <!-- نوار تاگل و ورودی آدرس اینترنتی (Direct URL Mode) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
          @click="showUrlInput = !showUrlInput"
        >
          <Link2 class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ showUrlInput ? 'بستن ورودی لینک مستقیم' : 'یا وارد کردن نشانی اینترنتی تصویر (URL)' }}</span>
        </button>

        <span v-if="galleryImages.length > 0" class="text-[11px] font-bold text-slate-500">
          {{ toFa(galleryImages.length) }} فریم بارگذاری‌شده
        </span>
      </div>

      <!-- باکس ورودی URL پیوند -->
      <div
        v-if="showUrlInput"
        class="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 animate-in fade-in zoom-in-98 duration-150"
      >
        <div class="relative flex-1">
          <input
            v-model="newImageUrl"
            type="url"
            placeholder="https://images.unsplash.com/..."
            dir="ltr"
            class="w-full h-9.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-ink text-start"
            @keydown.enter.prevent="handleAddUrl"
          >
        </div>
        <button
          type="button"
          class="h-9.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
          @click="handleAddUrl"
        >
          <ImagePlus class="w-4 h-4" />
          <span>افزودن پیوند</span>
        </button>
      </div>
    </div>

    <!-- گرید گالری پیش‌نمایش فریم‌ها -->
    <div v-if="galleryImages.length > 0" class="space-y-3 pt-2">
      <div class="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
        <span class="font-bold text-slate-700">فریم‌های موجود در گالری:</span>
        <button
          v-if="galleryImages.length > 1"
          type="button"
          class="text-[11px] font-bold text-rose hover:text-rose/80 transition-colors cursor-pointer"
          @click="handleClearAll"
        >
          حذف تمام فریم‌ها
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          v-for="(img, idx) in galleryImages"
          :key="idx"
          class="relative rounded-2xl border border-slate-200 overflow-hidden group aspect-3/4 bg-slate-100 shadow-2xs transition-all hover:shadow-md"
        >
          <img
            :src="img"
            alt="پیش‌نمایش گالری لباس"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          >

          <!-- شید تیره در حالت هاور برای دکمه‌ها -->
          <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          <!-- نشان تصویر اصلی یا انتخاب به عنوان اصلی -->
          <div class="absolute top-2.5 start-2.5 z-10">
            <span
              v-if="idx === 0 || mainImage === img"
              class="px-2.5 py-1 rounded-lg bg-ink text-amber-300 text-[10px] font-black flex items-center gap-1 shadow-xs"
            >
              <Star class="w-3 h-3 fill-amber-300" />
              <span>تصویر اصلی</span>
            </span>
            <button
              v-else
              type="button"
              class="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer flex items-center gap-1"
              title="تنظیم به عنوان کاور اصلی"
              @click="handleSetMain(img)"
            >
              <CheckCircle2 class="w-3 h-3 text-slate-600" />
              <span>انتخاب اصلی</span>
            </button>
          </div>

          <!-- شمارنده فریم -->
          <span class="absolute bottom-2.5 start-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono font-bold">
            {{ toFa(idx + 1) }}
          </span>

          <!-- دکمه حذف فریم -->
          <button
            type="button"
            class="absolute top-2.5 end-2.5 p-1.5 rounded-xl bg-white/95 text-rose hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            title="حذف تصویر از گالری"
            @click="handleRemove(idx)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- حالت خالی گالری -->
    <div
      v-else
      class="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs space-y-1.5 bg-slate-50/40"
    >
      <ImageIcon class="w-7 h-7 text-slate-300 mx-auto" />
      <p class="font-bold text-slate-600">هنوز تصویری به گالری این محصول اضافه نشده است.</p>
      <p class="text-[11px] text-slate-400">
        حداقل ۱ تصویر به عنوان کاور اصلی برای نمایش در کاتالوگ و صفحه محصول الزامی است.
      </p>
    </div>
  </div>
</template>
