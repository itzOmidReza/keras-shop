// frontend/app/composables/ops/useOpsRFM.ts
import { ref } from 'vue'

export interface RfmSegment {
  id: string
  name: string
  nameEn: string
  colorBadge: string
  customerCount: number
  percentage: string
  avgSpend: number
  description: string
  recommendedAction: string
}

export function useOpsRFM() {
  const rfmSegments = ref<RfmSegment[]>([
    {
      id: 'champions',
      name: 'قهرمانان برند (VIP)',
      nameEn: 'Champions',
      colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      customerCount: 48,
      percentage: '۱۴٪',
      avgSpend: 14200000,
      description: 'خرید مکرر در کمتر از ۱۴ روز گذشته با بالاترین رقم سبد خرید',
      recommendedAction: 'ارسال دعوت‌نامه اختصاصی پیش‌نمایش کالکشن زمستان و هدایای آتلیه',
    },
    {
      id: 'loyalists',
      name: 'مشتریان وفادار',
      nameEn: 'Loyalists',
      colorBadge: 'bg-blue-100 text-blue-800 border-blue-300',
      customerCount: 86,
      percentage: '۲۵٪',
      avgSpend: 7850000,
      description: 'ثبت حداقل ۳ سفارش موفق در ۹۰ روز گذشته',
      recommendedAction: 'پیشنهاد تخفیف‌های هدفمند و ارتقای سطح باشگاه مشتریان',
    },
    {
      id: 'at_risk',
      name: 'در معرض ریزش',
      nameEn: 'At Risk',
      colorBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      customerCount: 62,
      percentage: '۱۸٪',
      avgSpend: 4200000,
      description: 'مشتریان باارزش که بیش از ۶۰ روز سفارش جدیدی ثبت نکرده‌اند',
      recommendedAction: 'مخابره پیامک اختصاصی بازگشت با ووچر ۱۵ درصدی لیمیتد',
    },
    {
      id: 'hibernating',
      name: 'راکد و خوابیده',
      nameEn: 'Hibernating',
      colorBadge: 'bg-slate-100 text-slate-700 border-slate-300',
      customerCount: 148,
      percentage: '۴۳٪',
      avgSpend: 1950000,
      description: 'بیش از ۱۲۰ روز بدون فعالیت و میانگین خرید پایین',
      recommendedAction: 'کمپین‌های ری‌تارگتینگ فصلی برای بیدارباش و معرفی ترندها',
    },
  ])

  return {
    rfmSegments,
  }
}
