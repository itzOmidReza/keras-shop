<script setup lang="ts">
const {
  isProductModalOpen,
  editingProduct,
  productForm,
  autoDiscountPercent,
  saveProduct,
} = useOpsProducts()
</script>

<template>
  <!-- مودال افزودن / ویرایش کالا -->
  <Dialog :open="isProductModalOpen" @update:open="isProductModalOpen = $event">
    <DialogContent class="sm:max-w-3xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-slate-900">
          {{ editingProduct ? 'ویرایش مشخصات کالا' : 'افزودن محصول جدید به کاتالوگ آتلیه' }}
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          اطلاعات پایه، تصاویر، گرماژ متریال و ماتریس موجودی سایزهای کالا
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-3 text-xs">
        <!-- بخش اول: عناوین و دسته‌بندی -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">عنوان فارسی کالا</label>
            <input
              v-model="productForm.title"
              type="text"
              placeholder="مثال: کت پشمی دبل‌برست پاییزه"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">شناسه یکتا (Slug)</label>
            <input
              v-model="productForm.slug"
              type="text"
              placeholder="double-breasted-wool-coat"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-ink outline-hidden"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">بخش اصلی</label>
            <select
              v-model="productForm.division"
              class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="apparel">پوشاک (Apparel)</option>
              <option value="accessories">اکسسوری (Accessories)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">دسته‌بندی</label>
            <select
              v-model="productForm.category"
              class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="shirts-blouses">شومیز و پیراهن</option>
              <option value="knitwear">بافت و پلیور</option>
              <option value="coats-jackets">پالتو و بارانی</option>
              <option value="pants">شلوار</option>
              <option value="scarves">شال و روسری</option>
              <option value="hair-accessories">اکسسوری مو</option>
              <option value="bandanas">باندانا</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">فصل و کالکشن</label>
            <select
              v-model="productForm.season"
              class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="fall-1405">پاییز ۱۴۰۵</option>
              <option value="winter-1405">زمستان ۱۴۰۵</option>
              <option value="spring-1406">بهار ۱۴۰۶</option>
              <option value="four-season">چهار فصل</option>
            </select>
          </div>
        </div>

        <!-- بخش دوم: قیمت‌گذاری -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <span class="font-bold text-slate-800 block">قیمت‌گذاری و تخفیف</span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-slate-600 mb-1">قیمت پایه (تومان)</label>
              <input
                v-model.number="productForm.basePrice"
                type="number"
                class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono outline-hidden"
              >
            </div>
            <div>
              <label class="block text-slate-600 mb-1">قیمت فروش نقدی (تومان)</label>
              <input
                v-model.number="productForm.salePrice"
                type="number"
                class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono outline-hidden"
              >
            </div>
            <div>
              <label class="block text-slate-600 mb-1">درصد تخفیف خودکار</label>
              <div class="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center font-mono font-bold text-amber-700">
                {{ autoDiscountPercent }}٪ تخفیف
              </div>
            </div>
          </div>
        </div>

        <!-- بخش سوم: تصاویر -->
        <div>
          <label class="block font-bold text-slate-700 mb-1">آدرس تصویر اصلی</label>
          <input
            v-model="productForm.mainImage"
            type="text"
            placeholder="https://..."
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
          >
        </div>

        <!-- بخش چهارم: مشخصات پارچه -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">گرماژ پارچه (GSM)</label>
            <input
              v-model.number="productForm.fabricGsm"
              type="number"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ترکیب الیاف</label>
            <input
              v-model="productForm.fabricComposition"
              type="text"
              placeholder="۸۰٪ پشم مرینوس، ۲۰٪ کشمیر"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
          </div>
        </div>

        <!-- بخش پنجم: ماتریس موجودی سایزها -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <span class="font-bold text-slate-800 block mb-2">موجودی انبار بر حسب سایز</span>
          <div v-if="productForm.division === 'apparel'" class="grid grid-cols-5 gap-2">
            <div>
              <label class="block text-center text-slate-500 mb-1">XS</label>
              <input
                v-model.number="productForm.stockXS"
                type="number"
                class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
            <div>
              <label class="block text-center text-slate-500 mb-1">S</label>
              <input
                v-model.number="productForm.stockS"
                type="number"
                class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
            <div>
              <label class="block text-center text-slate-500 mb-1">M</label>
              <input
                v-model.number="productForm.stockM"
                type="number"
                class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
            <div>
              <label class="block text-center text-slate-500 mb-1">L</label>
              <input
                v-model.number="productForm.stockL"
                type="number"
                class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
            <div>
              <label class="block text-center text-slate-500 mb-1">XL</label>
              <input
                v-model.number="productForm.stockXL"
                type="number"
                class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
          </div>
          <div v-else class="max-w-xs">
            <label class="block text-slate-500 mb-1">موجودی تک‌سایز (Free Size)</label>
            <input
              v-model.number="productForm.stockFree"
              type="number"
              class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200 font-mono"
            >
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isProductModalOpen = false"
        >
          انصراف
        </button>
        <button
          type="button"
          data-testid="save-product-btn"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
          @click="saveProduct"
        >
          ذخیره اطلاعات محصول
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
