<!-- frontend/app/components/ops/AdminProductStudioForm.vue -->
<script setup lang="ts">
import {
  ArrowRight,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
} from '@lucide/vue'
import { useAdminProducts, PRESET_COLORS } from '~/composables/ops/useAdminProducts'

const props = defineProps<{
  mode: 'new' | 'edit'
  productId?: number
}>()

const router = useRouter()
const {
  productForm,
  initNewProductForm,
  loadProductForEdit,
  saveProduct,
  addColor,
  removeColor,
  toggleSize,
} = useAdminProducts()

const presetColors = PRESET_COLORS

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free Size']
const newImageUrl = ref('')

onMounted(() => {
  if (props.mode === 'edit' && props.productId) {
    loadProductForEdit(props.productId)
  } else {
    initNewProductForm()
  }
})

const handleAddImage = () => {
  if (newImageUrl.value.trim()) {
    productForm.value.galleryImages.push(newImageUrl.value.trim())
    if (!productForm.value.mainImage) {
      productForm.value.mainImage = newImageUrl.value.trim()
    }
    newImageUrl.value = ''
  }
}

const handleRemoveImage = (index: number) => {
  productForm.value.galleryImages.splice(index, 1)
  if (productForm.value.galleryImages[0]) {
    productForm.value.mainImage = productForm.value.galleryImages[0]
  }
}

const handleSave = () => {
  const result = saveProduct()
  if (result) {
    router.push('/internal-ops-nexus/products')
  }
}

const handleSaveDraft = () => {
  productForm.value.isPublished = false
  saveProduct()
}

const autoGenerateSlug = () => {
  if (productForm.value.title) {
    productForm.value.slug = productForm.value.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-28 font-sans">
    <!-- هدر استودیو -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-200/80">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/internal-ops-nexus/products"
          class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          title="بازگشت به کاتالوگ محصولات"
        >
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {{ mode === 'edit' ? 'ویرایش محصول کاتالوگ آتلیه' : 'افزودن محصول جدید به کاتالوگ آتلیه' }}
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            ثبت اطلاعات پایه، قیمت، گالری، تنوع‌های رنگ و سایز و جدول اندازه‌گیری
          </p>
        </div>
      </div>
    </div>

    <!-- فرم بخش‌های ۶‌گانه در کانتینر مرتب -->
    <div class="space-y-6">
      <!-- ۱. اطلاعات پایه -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-ink" />
          <span>۱. اطلاعات پایه محصول</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- عنوان محصول -->
          <div class="space-y-1.5 sm:col-span-2">
            <label class="block text-xs font-bold text-slate-800">
              عنوان لباس / نام محصول: <span class="text-rose">*</span>
            </label>
            <input
              v-model="productForm.title"
              type="text"
              placeholder="مثال: کت پشمی پاییزه یا پالتو کشمیر لیمیتد"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-hidden focus:border-ink font-medium"
              @blur="autoGenerateSlug"
            >
          </div>

          <!-- اسلاگ -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-800">
                اسلاگ پیوند (URL Slug):
              </label>
              <button
                type="button"
                class="text-[11px] text-indigo-600 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                @click="autoGenerateSlug"
              >
                <Sparkles class="w-3 h-3" />
                <span>تولید خودکار</span>
              </button>
            </div>
            <input
              v-model="productForm.slug"
              type="text"
              placeholder="مثال: cashmere-coat-limited"
              dir="ltr"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
            >
          </div>

          <!-- دسته‌بندی -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">
              دسته‌بندی اصلی: <span class="text-rose">*</span>
            </label>
            <select
              v-model="productForm.category"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer"
            >
              <option value="coats-jackets">کت و پالتو (Coats & Jackets)</option>
              <option value="dresses">پیراهن و سرهمی (Dresses)</option>
              <option value="shirts-blouses">شومیز و بلوز (Shirts & Blouses)</option>
              <option value="pants-skirts">شلوار و دامن (Pants & Skirts)</option>
              <option value="knitwear">بافت و پلیور (Knitwear)</option>
              <option value="scarves-shawls">شال و روسری (Scarves)</option>
              <option value="accessories">اکسسوری و کیف (Accessories)</option>
            </select>
          </div>
        </div>
      </section>

      <!-- ۲. قیمت‌گذاری -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-emerald-600" />
          <span>۲. قیمت‌گذاری و فروش</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- قیمت اصلی -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">
              قیمت اصلی پایه (تومان): <span class="text-rose">*</span>
            </label>
            <input
              v-model.number="productForm.basePrice"
              type="number"
              placeholder="مثال: ۲۸۵۰۰۰۰"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
            >
          </div>

          <!-- قیمت با تخفیف -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">
              قیمت نهایی با تخفیف (تومان):
            </label>
            <input
              v-model.number="productForm.salePrice"
              type="number"
              placeholder="در صورت عدم تخفیف با قیمت اصلی یکسان بگذارید"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
            >
          </div>
        </div>
      </section>

      <!-- ۳. گالری تصاویر -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-sky-600" />
          <span>۳. گالری تصاویر محصول</span>
        </h2>

        <!-- ورودی آدرس تصویر یا آپلود مستقیم -->
        <div class="flex items-center gap-2">
          <input
            v-model="newImageUrl"
            type="text"
            placeholder="آدرس اینترنتی تصویر را وارد کنید (https://...)"
            dir="ltr"
            class="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
            @keydown.enter.prevent="handleAddImage"
          >
          <button
            type="button"
            class="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            @click="handleAddImage"
          >
            <Plus class="w-4 h-4" />
            <span>افزودن تصویر</span>
          </button>
        </div>

        <!-- گرید تصاویر اضافه شده -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div
            v-for="(img, idx) in productForm.galleryImages"
            :key="idx"
            class="relative rounded-xl border border-slate-200 overflow-hidden group aspect-3/4 bg-slate-100"
          >
            <img :src="img" alt="پیش‌نمایش تصویر" class="w-full h-full object-cover">
            <!-- برچسب تصویر اصلی -->
            <span
              v-if="idx === 0"
              class="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-ink/80 text-white text-[10px] font-bold"
            >
              تصویر اصلی
            </span>
            <!-- دکمه حذف -->
            <button
              type="button"
              class="absolute top-2 end-2 p-1.5 rounded-lg bg-white/90 text-rose hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="حذف تصویر"
              @click="handleRemoveImage(idx)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            v-if="productForm.galleryImages.length === 0"
            class="col-span-full p-8 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-xs space-y-1"
          >
            <ImageIcon class="w-8 h-8 text-slate-300 mx-auto" />
            <p>هنوز تصویری به گالری اضافه نشده است.</p>
          </div>
        </div>
      </section>

      <!-- ۴. تنوع رنگ و سایز (Variants) -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-purple-600" />
          <span>۴. تنوع رنگ و سایز (Variants Matrix)</span>
        </h2>

        <!-- انتخابگر سریع رنگ -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-800">
            انتخاب رنگ‌های موجود:
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in presetColors"
              :key="color.name"
              type="button"
              class="h-8 px-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              :class="productForm.selectedColors.some(c => c.name === color.name)
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              @click="productForm.selectedColors.some(c => c.name === color.name)
                ? removeColor(color.name)
                : addColor(color.name, color.hex)"
            >
              <span
                class="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                :style="{ backgroundColor: color.hex }"
              />
              <span>{{ color.name }}</span>
            </button>
          </div>
        </div>

        <!-- تیک زدن سایزها -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-800">
            سایزهای فعال:
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              class="h-8 px-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all"
              :class="productForm.selectedSizes.includes(size)
                ? 'bg-ink text-white border-ink shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              @click="toggleSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- جدول خودکار موجودی انبار برای هر رنگ و سایز -->
        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-slate-800">
            جدول موجودی انبار بر اساس رنگ و سایز:
          </label>
          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-start text-xs border-collapse">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                <tr>
                  <th class="p-2.5 text-start">رنگ</th>
                  <th class="p-2.5 text-start">سایز</th>
                  <th class="p-2.5 text-start">کد تنوع (SKU)</th>
                  <th class="p-2.5 text-center w-32">موجودی انبار (تعداد)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(variant, vIdx) in productForm.variants"
                  :key="vIdx"
                  class="hover:bg-slate-50/50"
                >
                  <td class="p-2.5">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="w-3 h-3 rounded-full border border-slate-300"
                        :style="{ backgroundColor: variant.colorHex }"
                      />
                      <span class="font-bold text-slate-800">{{ variant.color }}</span>
                    </div>
                  </td>
                  <td class="p-2.5 font-mono font-bold text-slate-900">
                    {{ variant.size }}
                  </td>
                  <td class="p-2.5 font-mono text-slate-500 text-[11px]">
                    {{ variant.sku }}
                  </td>
                  <td class="p-2.5 text-center">
                    <input
                      v-model.number="variant.stock"
                      type="number"
                      min="0"
                      class="w-20 h-8 px-2 text-center rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-white outline-hidden focus:border-ink"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ۵. مشخصات پارچه و شست‌وشو -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-amber-600" />
          <span>۵. مشخصات متریال و راهنمای نگهداری</span>
        </h2>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">
              جنس پارچه و ترکیب الیاف:
            </label>
            <input
              v-model="productForm.fabric"
              type="text"
              placeholder="مثال: ۱۰۰٪ لینن نچرال فرانسوی، بافت پنبه ارگانیک"
              class="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
            >
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">
              راهنمای نگهداری و شست‌وشو:
            </label>
            <textarea
              v-model="productForm.careInstructions"
              rows="3"
              placeholder="مثال: شست‌وشوی دستی با آب سرد ۳۰ درجه، از سفیدکننده استفاده نشود، اتوکشی ملایم..."
              class="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink resize-none leading-relaxed"
            />
          </div>
        </div>
      </section>

      <!-- ۶. راهنمای سایز (Size Guide) -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="w-2 h-2 rounded-full bg-rose" />
          <span>۶. راهنمای ابعاد و اندازه‌گیری (سانتی‌متر)</span>
        </h2>

        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-start text-xs border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
              <tr>
                <th class="p-2.5 text-start">سایز</th>
                <th class="p-2.5 text-center">دور سینه</th>
                <th class="p-2.5 text-center">دور کمر</th>
                <th class="p-2.5 text-center">دور باسن</th>
                <th class="p-2.5 text-center">قد لباس</th>
                <th class="p-2.5 text-center">قد آستین</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(m, mIdx) in productForm.sizeGuide"
                :key="mIdx"
                class="hover:bg-slate-50/50"
              >
                <td class="p-2.5 font-bold font-mono text-slate-900">
                  {{ m.size }}
                </td>
                <td class="p-2.5 text-center">
                  <input
                    v-model.number="m.chest"
                    type="number"
                    class="w-16 h-7 text-center rounded border border-slate-200 text-xs font-mono"
                  >
                </td>
                <td class="p-2.5 text-center">
                  <input
                    v-model.number="m.waist"
                    type="number"
                    class="w-16 h-7 text-center rounded border border-slate-200 text-xs font-mono"
                  >
                </td>
                <td class="p-2.5 text-center">
                  <input
                    v-model.number="m.hip"
                    type="number"
                    class="w-16 h-7 text-center rounded border border-slate-200 text-xs font-mono"
                  >
                </td>
                <td class="p-2.5 text-center">
                  <input
                    v-model.number="m.length"
                    type="number"
                    class="w-16 h-7 text-center rounded border border-slate-200 text-xs font-mono"
                  >
                </td>
                <td class="p-2.5 text-center">
                  <input
                    v-model.number="m.sleeve"
                    type="number"
                    class="w-16 h-7 text-center rounded border border-slate-200 text-xs font-mono"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- نوار ثابت اکشن پایین صفحه -->
    <div class="fixed bottom-14 lg:bottom-0 inset-x-0 lg:ps-60 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-lg flex items-center justify-between">
      <div class="text-xs text-slate-500 hidden sm:block">
        وضعیت: <strong class="text-slate-900">{{ productForm.isPublished ? 'آماده انتشار در فروشگاه' : 'پیش‌نویس' }}</strong>
      </div>

      <div class="flex items-center gap-2.5 ms-auto">
        <button
          type="button"
          class="h-9.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          @click="handleSaveDraft"
        >
          ذخیره پیش‌نویس
        </button>

        <button
          type="button"
          data-testid="save-product-btn"
          class="h-9.5 px-6 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          @click="handleSave"
        >
          <Save class="w-4 h-4 text-amber-300" />
          <span>ذخیره و انتشار محصول</span>
        </button>
      </div>
    </div>
  </div>
</template>
