<script setup lang="ts">
const {
  isArticleModalOpen,
  editingArticle,
  articleForm,
  saveArticle,
} = useOpsArticles()
</script>

<template>
  <!-- مودال نگارش / ویرایش مقاله ژورنال -->
  <Dialog :open="isArticleModalOpen" @update:open="isArticleModalOpen = $event">
    <DialogContent class="sm:max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-slate-900">
          {{ editingArticle ? 'ویرایش مقاله ژورنال' : 'نگارش مقاله جدید در مجله ادیتوریال کراس' }}
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          محتوای آموزشی، ترندهای استایل، علم الیاف و انتشار در بلاگ
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">عنوان مقاله</label>
          <input
            v-model="articleForm.title"
            type="text"
            placeholder="مثال: هنر لایه‌بندی ادیتوریال پاییز ۱۴۰۵"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
          >
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">نامک یکتا (Slug)</label>
            <input
              v-model="articleForm.slug"
              type="text"
              placeholder="autumn-layering-1405"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">دسته‌بندی موضوعی</label>
            <select
              v-model="articleForm.categoryLabel"
              class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
              <option value="استایلینگ و ترندها">استایلینگ و ترندها</option>
              <option value="علم متریال و الیاف">علم متریال و الیاف</option>
              <option value="فیزیولوژی تمرین">فیزیولوژی تمرین</option>
              <option value="پایداری و مراقبت">پایداری و مراقبت</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">نویسنده</label>
            <input
              v-model="articleForm.author"
              type="text"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">زمان مطالعه تخمینی</label>
            <input
              v-model="articleForm.readTime"
              type="text"
              placeholder="۵ دقیقه"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">آدرس تصویر کاور</label>
          <input
            v-model="articleForm.image"
            type="text"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
          >
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">خلاصه کوتاه مقاله (Excerpt)</label>
          <textarea
            v-model="articleForm.excerpt"
            rows="2"
            class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden resize-none"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">متن کامل مقاله</label>
          <textarea
            v-model="articleForm.content"
            rows="5"
            placeholder="پاراگراف‌های کامل مقاله..."
            class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isArticleModalOpen = false"
        >
          انصراف
        </button>
        <button
          type="button"
          data-testid="save-draft-article-btn"
          class="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
          @click="saveArticle(false)"
        >
          ذخیره به عنوان پیش‌نویس
        </button>
        <button
          type="button"
          data-testid="publish-article-btn"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
          @click="saveArticle(true)"
        >
          انتشار فوری در ژورنال
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
