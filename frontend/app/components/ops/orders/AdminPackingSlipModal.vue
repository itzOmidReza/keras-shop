<!-- frontend/app/components/ops/orders/AdminPackingSlipModal.vue -->
<script setup lang="ts">
import {
  Printer,
  Package,
  Truck,
} from '@lucide/vue'
import { useAdminOrders } from '~/composables/admin/useAdminOrders'
import { toFa } from '~/utils/format'

const {
  isPackingSlipOpen,
  selectedOrderForPackingSlip,
  closePackingSlip,
  printCurrentSlip,
} = useAdminOrders()

// تجزیه کد پستی به ۱۰ رقم منفرد جهت رندر در جعبه‌های استاندارد پست
const postalDigits = computed(() => {
  const code = selectedOrderForPackingSlip.value?.postalCode || '1965943211'
  const digits = code.replace(/\D/g, '').padEnd(10, '0').slice(0, 10).split('')
  return digits
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPackingSlipOpen && selectedOrderForPackingSlip"
      class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs font-sans overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0"
      role="dialog"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl border border-slate-200 my-2 sm:my-8 print:border-none print:shadow-none print:m-0 print:p-0 print:max-w-none"
      >
        <!-- نوار ابزار کنترل مودال (عدم نمایش در پرینت) -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div class="flex items-center gap-2">
            <Package class="w-5 h-5 text-slate-900" />
            <h3 class="text-sm font-bold text-slate-900">
              برگ ارسال مرسوله پستی (Packing Slip)
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              @click="printCurrentSlip"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>چاپ برگه (A5/A6)</span>
            </button>

            <button
              type="button"
              class="h-8.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              @click="closePackingSlip"
            >
              بستن
            </button>
          </div>
        </div>

        <!-- برگه آدرس و بارکد استاندارد پستی (A5/A6 Postal Box Label) -->
        <div class="border-2 border-black rounded-xl p-5 space-y-4 bg-white text-black print:border-2 print:border-black print:p-4 print:rounded-none">
          <!-- سربرگ فرستنده و متصدی ارسال -->
          <div class="border-b-2 border-black pb-3 flex items-start justify-between gap-4">
            <div class="space-y-0.5">
              <span class="text-[10px] font-bold text-slate-600 block uppercase">فرستنده (Sender):</span>
              <span class="text-sm font-black tracking-wider block">آتلیه طراحی و دوخت پوشاک کراس (KERAS Atelier)</span>
              <span class="text-xs block text-slate-800">تهران، خیابان فرشته، پلاک ۲۴، ساختمان کراس • پشتیبانی: ۰۲۱-۲۲۰۱۸۸۹۹</span>
              <span class="text-[11px] font-mono font-bold block pt-0.5 text-slate-700">کدپستی فرستنده: ۱۹۶۵۹۴۳۲۱۱</span>
            </div>

            <div class="text-end shrink-0">
              <span class="inline-block px-2.5 py-1 border border-black rounded-md text-[11px] font-bold bg-slate-100">
                {{ selectedOrderForPackingSlip.carrier || 'پست پیشتاز' }}
              </span>
              <div class="font-mono text-xs font-bold mt-1 text-slate-900">
                {{ selectedOrderForPackingSlip.orderNumber }}
              </div>
              <span class="text-[10px] text-slate-600 font-sans block mt-0.5">
                {{ selectedOrderForPackingSlip.createdAt }}
              </span>
            </div>
          </div>

          <!-- مشخصات گیرنده و نشانی کامل پستی -->
          <div class="border-2 border-black rounded-lg p-3.5 space-y-2 bg-slate-50/70 print:bg-transparent">
            <span class="text-[11px] font-bold text-slate-600 block uppercase">گیرنده مرسوله (Recipient):</span>
            <div class="text-sm font-black text-slate-950">
              {{ selectedOrderForPackingSlip.recipientName }}
            </div>
            <div class="text-xs text-slate-900 leading-relaxed font-medium">
              {{ selectedOrderForPackingSlip.shippingAddress }}
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-300 text-xs">
              <div class="font-mono font-bold text-slate-900">
                <span>تلفن تماس: </span>
                <span dir="ltr">{{ selectedOrderForPackingSlip.recipientPhone }}</span>
              </div>

              <!-- ۱۰ خانه تفکیکی کد پستی استاندارد باجه‌های پستی -->
              <div class="flex items-center gap-1">
                <span class="text-[10px] font-bold text-slate-600 me-1">کد پستی ۱۰ رقمی:</span>
                <div class="flex items-center gap-0.5 dir-ltr">
                  <div
                    v-for="(digit, i) in postalDigits"
                    :key="i"
                    class="w-5 h-6 border border-black flex items-center justify-center font-mono font-bold text-xs bg-white text-black"
                  >
                    {{ digit }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- بارکد ۲۴ رقمی پست با خطوط اسکن نوری شبیه‌سازی‌شده -->
          <div v-if="selectedOrderForPackingSlip.trackingCode" class="border border-black rounded-lg p-3 text-center space-y-1.5 bg-white">
            <div class="text-[10px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1">
              <Truck class="w-3 h-3 text-slate-600" />
              <span>بارکد رهگیری ۲۴ رقمی شرکت ملی پست جمهوری اسلامی ایران</span>
            </div>

            <!-- خطوط بارکد نوری شبیه‌سازی‌شده (Optical Barcode Stripes) -->
            <div class="flex justify-center items-end gap-0.5 h-12 py-1 px-4 max-w-sm mx-auto overflow-hidden">
              <span
                v-for="n in 52"
                :key="n"
                class="bg-black shrink-0"
                :class="[
                  n % 7 === 0 ? 'w-1 h-full' :
                  n % 3 === 0 ? 'w-0.5 h-full' :
                  n % 5 === 0 ? 'w-1.5 h-full' : 'w-0.5 h-5/6'
                ]"
              />
            </div>

            <!-- کد عددی ۲۴ رقمی با فاصله‌گذاری خوانا -->
            <div class="font-mono text-sm font-black tracking-widest dir-ltr text-black">
              {{ selectedOrderForPackingSlip.trackingCode.replace(/(\d{4})/g, '$1 ').trim() }}
            </div>
          </div>

          <!-- جدول اقلام داخل کارتن و برگه کنترل کیفیت (QC Packing Summary) -->
          <div class="space-y-1.5 pt-1">
            <span class="text-[11px] font-bold text-slate-700 block">محتویات کارتن و تطبیق بسته‌بندی:</span>
            <table class="w-full border-collapse border border-black text-xs text-start">
              <thead>
                <tr class="bg-slate-100 border-b border-black text-black font-bold text-[11px]">
                  <th class="p-1.5 border-e border-black text-center w-8">ردیف</th>
                  <th class="p-1.5 border-e border-black text-start">شرح لباس / محصول</th>
                  <th class="p-1.5 border-e border-black text-center w-16">سایز</th>
                  <th class="p-1.5 border-e border-black text-center w-20">رنگ</th>
                  <th class="p-1.5 border-e border-black text-center w-12">تعداد</th>
                  <th class="p-1.5 text-center w-14">چک QC</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, i) in selectedOrderForPackingSlip.items"
                  :key="i"
                  class="border-b border-black last:border-b-0"
                >
                  <td class="p-1.5 border-e border-black text-center font-mono font-bold">{{ toFa(i + 1) }}</td>
                  <td class="p-1.5 border-e border-black font-bold">{{ item.title }}</td>
                  <td class="p-1.5 border-e border-black text-center font-bold">{{ item.size }}</td>
                  <td class="p-1.5 border-e border-black text-center">{{ item.color || 'مشکی' }}</td>
                  <td class="p-1.5 border-e border-black text-center font-mono font-bold">{{ toFa(item.quantity) }}</td>
                  <td class="p-1.5 text-center text-slate-400 font-mono text-[10px]">✓ تایید</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- پانویس برگه -->
          <div class="flex items-center justify-between text-[10px] text-slate-600 pt-2 border-t border-black">
            <span>تحویل بدون آسیب فیزیکی به جعبه و نوار امنیتی کراس الزامی است.</span>
            <span class="font-bold">سایت رسمی: keras.style</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
