// frontend/app/composables/ops/useOpsWarehouses.ts
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

export interface WarehouseInfo {
  id: string
  name: string
  code: string
  location: string
  manager: string
  isPrimary: boolean
  activeSkus: number
  totalCapacity: number
}

export interface StratifiedStockItem {
  id: string
  sku: string
  title: string
  size: string
  color: string
  warehouseId: string
  warehouseName: string
  onHand: number // موجودی فیزیکی کل
  reserved: number // رزرو شده در سفارش‌های در حال پردازش
  available: number // خالص قابل فروش
  reorderPoint: number // آستانه بحرانی سفارش‌گذاری مجدد
}

export interface WarehouseTransferDocket {
  id: string
  docketNumber: string
  date: string
  fromWarehouseId: string
  fromWarehouseName: string
  toWarehouseId: string
  toWarehouseName: string
  sku: string
  productTitle: string
  quantity: number
  notes: string
  operatorName: string
  status: 'completed' | 'in_transit' | 'draft'
}

export function useOpsWarehouses() {
  const warehouses = ref<WarehouseInfo[]>([
    {
      id: 'wh-tehran',
      name: 'انبار مرکزی تهران',
      code: 'WH-THR-01',
      location: 'تهران، خیابان شریعتی، نبش ظفر',
      manager: 'رضا کمالی',
      isPrimary: true,
      activeSkus: 142,
      totalCapacity: 1200,
    },
    {
      id: 'wh-atelier',
      name: 'آتلیه تخصصی کراس',
      code: 'WH-ATL-02',
      location: 'تهران، نیاوران، سه راه یاسر',
      manager: 'سارا رادمنش',
      isPrimary: false,
      activeSkus: 48,
      totalCapacity: 350,
    },
    {
      id: 'wh-tajrish',
      name: 'مرکز پردازش اکسپرس تجریش',
      code: 'WH-TJR-03',
      location: 'تهران، میدان تجریش، مجتمع تندیس',
      manager: 'مهدی خسروی',
      isPrimary: false,
      activeSkus: 64,
      totalCapacity: 500,
    },
  ])

  const stratifiedStocks = ref<StratifiedStockItem[]>([
    {
      id: 'stk_1',
      sku: 'KRS-COAT-KSH-M',
      title: 'پالتو پشمی کشمیر دست‌دوز',
      size: 'M',
      color: 'مشکی موکا',
      warehouseId: 'wh-tehran',
      warehouseName: 'انبار مرکزی تهران',
      onHand: 14,
      reserved: 3,
      available: 11,
      reorderPoint: 5,
    },
    {
      id: 'stk_2',
      sku: 'KRS-COAT-KSH-S',
      title: 'پالتو پشمی کشمیر دست‌دوز',
      size: 'S',
      color: 'مشکی موکا',
      warehouseId: 'wh-atelier',
      warehouseName: 'آتلیه تخصصی کراس',
      onHand: 4,
      reserved: 2,
      available: 2,
      reorderPoint: 4,
    },
    {
      id: 'stk_3',
      sku: 'KRS-BLS-SLK-38',
      title: 'شومیز ابریشم سیلک طبیعی',
      size: 'Free Size',
      color: 'شنی نچرال',
      warehouseId: 'wh-tehran',
      warehouseName: 'انبار مرکزی تهران',
      onHand: 22,
      reserved: 6,
      available: 16,
      reorderPoint: 8,
    },
    {
      id: 'stk_4',
      sku: 'KRS-PNT-WOL-L',
      title: 'شلوار پشمی راسته آتلیه',
      size: 'L',
      color: 'خاک رس',
      warehouseId: 'wh-tajrish',
      warehouseName: 'مرکز پردازش اکسپرس تجریش',
      onHand: 3,
      reserved: 2,
      available: 1,
      reorderPoint: 4,
    },
  ])

  const transferHistory = ref<WarehouseTransferDocket[]>([
    {
      id: 'trn_101',
      docketNumber: 'TRN-1405-884',
      date: 'امروز، ساعت ۱۰:۳۰',
      fromWarehouseId: 'wh-tehran',
      fromWarehouseName: 'انبار مرکزی تهران',
      toWarehouseId: 'wh-atelier',
      toWarehouseName: 'آتلیه تخصصی کراس',
      sku: 'KRS-COAT-KSH-M',
      productTitle: 'پالتو پشمی کشمیر دست‌دوز',
      quantity: 5,
      notes: 'تامین سفارشات پرو حضوری مشتریان ویژه آتلیه',
      operatorName: 'سارا رادمنش',
      status: 'completed',
    },
  ])

  // هشدارهای کسری موجودی بحرانی
  const lowStockAlerts = computed(() => {
    return stratifiedStocks.value.filter(s => s.available <= s.reorderPoint)
  })

  // ثبت حواله انتقال بین‌انباری
  const transferStock = (
    fromWhId: string,
    toWhId: string,
    sku: string,
    qty: number,
    notes: string,
  ) => {
    const fromWh = warehouses.value.find(w => w.id === fromWhId)
    const toWh = warehouses.value.find(w => w.id === toWhId)
    const item = stratifiedStocks.value.find(s => s.sku === sku && s.warehouseId === fromWhId)

    if (!fromWh || !toWh) {
      toast.error('انبار مبدا یا مقصد معتبر نیست')
      return false
    }

    if (!item || item.available < qty) {
      toast.error(`موجودی آزاد در ${fromWh.name} برای انتقال ${toFa(qty)} عدد کافی نیست`)
      return false
    }

    // کسر از مبدا
    item.onHand -= qty
    item.available = item.onHand - item.reserved

    // افزودن به مقصد (یا ثبت رکورد جدید)
    let destItem = stratifiedStocks.value.find(s => s.sku === sku && s.warehouseId === toWhId)
    if (destItem) {
      destItem.onHand += qty
      destItem.available = destItem.onHand - destItem.reserved
    } else {
      destItem = {
        id: `stk_${Date.now()}`,
        sku,
        title: item.title,
        size: item.size,
        color: item.color,
        warehouseId: toWhId,
        warehouseName: toWh.name,
        onHand: qty,
        reserved: 0,
        available: qty,
        reorderPoint: item.reorderPoint,
      }
      stratifiedStocks.value.push(destItem)
    }

    // ثبت در تاریخچه حواله‌ها
    const docket: WarehouseTransferDocket = {
      id: `trn_${Date.now()}`,
      docketNumber: `TRN-1405-${Math.floor(100 + Math.random() * 900)}`,
      date: 'امروز، هم‌اکنون',
      fromWarehouseId: fromWhId,
      fromWarehouseName: fromWh.name,
      toWarehouseId: toWhId,
      toWarehouseName: toWh.name,
      sku,
      productTitle: item.title,
      quantity: qty,
      notes,
      operatorName: 'سارا رادمنش (مدیر ارشد)',
      status: 'completed',
    }
    transferHistory.value.unshift(docket)

    toast.success(`حواله انتقال ${toFa(qty)} عدد به ${toWh.name} با شماره ${docket.docketNumber} صادر شد`)
    return true
  }

  return {
    warehouses,
    stratifiedStocks,
    transferHistory,
    lowStockAlerts,
    transferStock,
  }
}
