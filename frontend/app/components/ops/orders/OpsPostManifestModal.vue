<!-- frontend/app/components/ops/orders/OpsPostManifestModal.vue -->
<script setup lang="ts">
import {
  X,
  Printer,
  FileCheck2,
  Calendar,
  Truck,
  Building2,
} from '@lucide/vue'
import {
  useOpsShippingManifest,
} from '~/composables/ops/useOpsShippingManifest'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { toFa, formatToman } from '~/utils/format'

const {
  isPostManifestOpen,
  selectedManifestCarrier,
  manifestDate,
  CARRIER_CONFIGS,
} = useOpsShippingManifest()

const { enrichedOrders } = useOpsFulfillmentDesk()

const activeCarrierConfig = computed(() => {
  return CARRIER_CONFIGS[selectedManifestCarrier.value]
})

// مرسوله‌های آماده تحویل بر اساس شرکت حمل انتخابی
const manifestParcels = computed(() => {
  return enrichedOrders.value.filter((o) => {
    return o.carrierType === selectedManifestCarrier.value
  })
})

const totalWeightGrams = computed(() => {
  return manifestParcels.value.reduce((acc, curr) => acc + (curr.weightGrams || 500), 0)
})

const totalDeclaredValue = computed(() => {
  return manifestParcels.value.reduce((acc, curr) => acc + curr.totalAmount, 0)
})

const handlePrint = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPostManifestOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200/80 my-8 max-h-[92vh] overflow-y-auto"
      >
        <!-- نوار کنترل بالای مودال (غیرقابل چاپ) -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <FileCheck2 class="w-5 h-5 text-ink" />
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                مانیفست رسمی واگذاری و تحویل به باجه پست و کوریر
              </h2>
              <p class="text-xs text-slate-500">
                صورت‌جلسه تجمیعی مرسوله‌های ترخیص‌شده جهت اخذ امضا و مهر مأمور تحویل‌گیرنده
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- انتخاب کوریر -->
            <select
              v-model="selectedManifestCarrier"
              class="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer"
            >
              <option value="post">پست پیشتاز جمهوری اسلامی</option>
              <option value="tipax">تیپاکس اکسپرس (Tipax)</option>
              <option value="chapar">کالارسان چاپار (Chapar)</option>
              <option value="courier">پیک اختصاصی آتلیه کراس</option>
            </select>

            <button
              type="button"
              class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              @click="handlePrint"
            >
              <Printer class="w-4 h-4" />
              <span>چاپ مانیفست رسمی</span>
            </button>

            <button
              type="button"
              class="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              @click="isPostManifestOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- برگه رسمی مانیفست (آماده پرینت و نمایش) -->
        <div class="border-2 border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 bg-white text-slate-900 print:border-black print:p-4">
          <!-- سربرگ رسمی با نشان تجاری و اطلاعات فرستنده -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xl font-black tracking-widest text-ink">KERAS ATELIER</span>
                <span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-600">هاب مرکزی توزیع</span>
              </div>
              <p class="text-xs text-slate-600">
                آتلیه طراحی و دوخت پوشاک فاخر کراس — تهران، الهیه، مریم شرقی، پلاک ۲۴
              </p>
              <p class="text-[11px] text-slate-500 font-mono">
                تلفن مرکز پشتیبانی و هماهنگی لجستیک: ۰۲۱-۲۲۰۱۸۸۹۹
              </p>
            </div>

            <div class="text-end space-y-1">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 font-mono font-bold text-xs text-slate-800">
                <Calendar class="w-3.5 h-3.5 text-slate-500" />
                <span>تاریخ تنظیم: {{ toFa(manifestDate) }}</span>
              </div>
              <div class="text-[11px] text-slate-500 font-mono">
                شماره مانیفست: MNF-{{ toFa(new Date().getFullYear()) }}-{{ toFa(manifestParcels.length) }}
              </div>
              <div class="text-[11px] font-bold text-slate-700">
                ناقل طرف قرارداد: {{ activeCarrierConfig.name }}
              </div>
            </div>
          </div>

          <!-- خلاصه آماری بار تحویلی -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            <div>
              <span class="text-slate-500 block text-[11px]">تعداد کل مرسوله‌ها:</span>
              <span class="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {{ toFa(manifestParcels.length) }} بسته
              </span>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">وزن ناخالص تجمیعی:</span>
              <span class="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {{ toFa((totalWeightGrams / 1000).toFixed(2)) }} کیلوگرم
              </span>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">ارزش ریالی اظهارشده:</span>
              <span class="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {{ formatToman(totalDeclaredValue) }} تومان
              </span>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">نوع سرویس ترخیص:</span>
              <span class="font-bold text-slate-900 text-sm mt-0.5 block">
                {{ activeCarrierConfig.shortName }} (پیشتاز)
              </span>
            </div>
          </div>

          <!-- جدول مرسوله‌ها -->
          <div class="overflow-x-auto">
            <table class="w-full text-start text-xs border-collapse">
              <thead>
                <tr class="bg-slate-100 border-y border-slate-300 font-bold text-slate-800 text-[11px]">
                  <th class="p-2.5 text-center w-8">ردیف</th>
                  <th class="p-2.5 text-start">شماره سفارش</th>
                  <th class="p-2.5 text-start">نام و نام خانوادگی گیرنده</th>
                  <th class="p-2.5 text-start">شهر و کدپستی مقصد</th>
                  <th class="p-2.5 text-start">بارکد ۲۴ رقمی / کد رهگیری</th>
                  <th class="p-2.5 text-center">وزن (g)</th>
                  <th class="p-2.5 text-end">ارزش اظهارشده (تومان)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr
                  v-for="(order, index) in manifestParcels"
                  :key="order.orderNumber"
                  class="text-[11px]"
                >
                  <td class="p-2.5 text-center font-mono text-slate-500">
                    {{ toFa(index + 1) }}
                  </td>
                  <td class="p-2.5 font-mono font-bold text-slate-900">
                    {{ order.orderNumber }}
                  </td>
                  <td class="p-2.5 font-bold text-slate-800">
                    {{ order.recipientName }}
                  </td>
                  <td class="p-2.5 text-slate-600">
                    <span class="block font-medium">تهران / منطقه شمیرانات</span>
                    <span class="block text-[10px] font-mono text-slate-400">{{ order.postalCode || '۱۹۶۵۹—' }}</span>
                  </td>
                  <td class="p-2.5 font-mono text-slate-900 font-bold">
                    {{ order.trackingCode || 'در انتظار تخصیص باجه' }}
                  </td>
                  <td class="p-2.5 text-center font-mono text-slate-700">
                    {{ toFa(order.weightGrams || 500) }}
                  </td>
                  <td class="p-2.5 text-end font-mono font-bold text-slate-900">
                    {{ formatToman(order.totalAmount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- جعبه تعهد، امضا و مهر مأمور باجه / کوریر -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-slate-300 rounded-xl p-5 text-xs bg-slate-50/50">
            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900">
                <Building2 class="w-4 h-4 text-slate-600" />
                <span>تحویل‌دهنده (سرپرست بسته‌بندی آتلیه کراس):</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">
                گواهی می‌شود کلیه مرسوله‌های مندرج در این صورت‌جلسه با بسته‌بندی لوکس استاندارد، الصاق برچسب حرارتی و تایید کنترل کیفی (QC) تحویل مأمور رسمی گردید.
              </p>
              <div class="pt-6 border-b border-dashed border-slate-400 w-48 text-center text-[10px] text-slate-400">
                امضا و مهر انبار مرکزی آتلیه
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900">
                <Truck class="w-4 h-4 text-slate-600" />
                <span>تحویل‌گیرنده (نماینده و سفیر رسمی {{ activeCarrierConfig.shortName }}):</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">
                اینجانب مأمور رسمی تحویل، تعداد {{ toFa(manifestParcels.length) }} بسته مرسوله فوق را به صورت صحیح و پلمپ تحویل گرفته و متعهد به توزیع در موعد مقرر می‌باشم.
              </p>
              <div class="pt-6 border-b border-dashed border-slate-400 w-48 text-center text-[10px] text-slate-400">
                امضا، اثر انگشت و کد شناسایی مأمور
              </div>
            </div>
          </div>

          <!-- یادداشت پایانی -->
          <div class="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-3">
            <span>سیستم لجستیک و توزیع اختصاصی Keras Fashion Backoffice</span>
            <span>نسخه چاپی رسمی — تاریخ استخراج: {{ toFa(new Date().toLocaleTimeString('fa-IR')) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
