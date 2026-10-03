<script setup lang="ts">
const { productsList } = useOpsProducts()
const {
  isManualOrderModalOpen,
  manualOrderCustomerMode,
  manualCustomerName,
  manualCustomerPhone,
  manualCustomerAddress,
  manualPaymentMethod,
  manualSelectedProductId,
  manualSelectedSize,
  addManualItem,
  manualOrderItems,
  removeManualItem,
  manualOrderTotal,
  submitManualOrder,
} = useOpsOrders()
</script>

<template>
  <!-- مودال ثبت سفارش دستی جدید -->
  <Dialog :open="isManualOrderModalOpen" @update:open="isManualOrderModalOpen = $event">
    <DialogContent class="sm:max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-slate-900">
          ثبت سفارش دستی جدید (فروش تلفنی / اینستاگرام)
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          انتخاب کالا از کاتالوگ، مشخصات خریدار و شیوه تسویه حساب
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-3 text-xs">
        <!-- مشخصات خریدار -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800 block">مشخصات تحویل‌گیرنده</span>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                class="px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer"
                :class="manualOrderCustomerMode === 'existing' ? 'bg-ink text-white' : 'bg-slate-200 text-slate-700'"
                @click="manualOrderCustomerMode = 'existing'; manualCustomerName = 'سارا رادمنش'; manualCustomerPhone = '09121112233'"
              >
                سارا رادمنش (پیش‌فرض)
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer"
                :class="manualOrderCustomerMode === 'new' ? 'bg-ink text-white' : 'bg-slate-200 text-slate-700'"
                @click="manualOrderCustomerMode = 'new'; manualCustomerName = ''; manualCustomerPhone = ''"
              >
                خریدار جدید
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 mb-1">نام کامل خریدار</label>
              <input
                v-model="manualCustomerName"
                type="text"
                class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200"
              >
            </div>
            <div>
              <label class="block text-slate-600 mb-1">شماره تماس (موبایل)</label>
              <input
                v-model="manualCustomerPhone"
                type="text"
                class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
          </div>
          <div>
            <label class="block text-slate-600 mb-1">نشانی دقیق پستی</label>
            <input
              v-model="manualCustomerAddress"
              type="text"
              class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200"
            >
          </div>
          <div>
            <label class="block text-slate-600 mb-1">شیوه تسویه و پرداخت</label>
            <select
              v-model="manualPaymentMethod"
              class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
            >
              <option value="card_to_card">کارت‌به‌کارت بانکی</option>
              <option value="gateway">درگاه پرداخت اینترنتی شاپرک</option>
              <option value="cod">پرداخت در محل (تهران)</option>
            </select>
          </div>
        </div>

        <!-- انتخاب کالا -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <span class="font-bold text-slate-800 block">افزودن اقلام به پیش‌فاکتور</span>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div class="sm:col-span-2">
              <label class="block text-slate-600 mb-1">انتخاب کالا</label>
              <select
                v-model="manualSelectedProductId"
                class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
              >
                <option v-for="p in productsList" :key="p.id" :value="p.id">
                  {{ p.title }} ({{ formatToman(p.price) }} ت)
                </option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 mb-1">سایز</label>
              <select
                v-model="manualSelectedSize"
                class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="Free">Free</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                type="button"
                class="w-full h-8 rounded-lg bg-ink text-white font-bold text-xs cursor-pointer hover:bg-ink/90"
                @click="addManualItem(productsList)"
              >
                + افزودن
              </button>
            </div>
          </div>

          <!-- جدول اقلام افزوده شده -->
          <div v-if="manualOrderItems.length > 0" class="mt-3 border-t border-slate-200 pt-2 space-y-1.5">
            <div
              v-for="(item, idx) in manualOrderItems"
              :key="idx"
              class="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
            >
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900">{{ item.title }}</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">سایز: {{ item.size }}</span>
                <span class="text-slate-500 font-mono">({{ formatToman(item.price) }} تومان)</span>
              </div>
              <button
                type="button"
                class="text-rose hover:underline font-bold"
                @click="removeManualItem(idx)"
              >
                حذف
              </button>
            </div>

            <div class="flex justify-between items-center pt-2 font-bold text-sm text-slate-900">
              <span>جمع کل سفارش:</span>
              <span class="font-mono">{{ formatToman(manualOrderTotal) }} تومان</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isManualOrderModalOpen = false"
        >
          انصراف
        </button>
        <button
          type="button"
          data-testid="submit-manual-order-btn"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
          @click="submitManualOrder"
        >
          ثبت نهایی سفارش
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
