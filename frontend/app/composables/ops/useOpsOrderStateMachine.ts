import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

export type OpsOrderStatus = 'registered' | 'paid' | 'packing' | 'shipped' | 'delivered' | 'canceled'

export interface StateMachineOrder {
  id: string
  customerName: string
  phone: string
  totalPrice: number
  status: OpsOrderStatus
  invoiceNumber?: string
  iranPostTrackingCode?: string
  packingVerifiedAt?: string
  items: {
    sku: string
    title: string
    quantity: number
    scanned: boolean
  }[]
  timeline: {
    status: OpsOrderStatus
    timestamp: string
    operator: string
    note: string
  }[]
}

const ALLOWED_TRANSITIONS: Record<OpsOrderStatus, OpsOrderStatus[]> = {
  registered: ['paid', 'canceled'],
  paid: ['packing', 'canceled'],
  packing: ['shipped', 'canceled'],
  shipped: ['delivered', 'canceled'],
  delivered: [],
  canceled: [],
}

export function useOpsOrderStateMachine() {
  const canTransition = (from: OpsOrderStatus, to: OpsOrderStatus): boolean => {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false
  }

  const transitionOrder = (
    order: StateMachineOrder,
    nextStatus: OpsOrderStatus,
    operator = 'سارا رادمنش (مدیر ارشد)',
  ): boolean => {
    if (!canTransition(order.status, nextStatus)) {
      toast.error(`انتقال وضعیت از "${order.status}" به "${nextStatus}" مجاز نیست`)
      return false
    }

    order.status = nextStatus

    const now = new Date()
    const timeStr = `${toFa(now.getHours())}:${toFa(now.getMinutes())}`

    // افکت‌های جانبی خودکار (Automated Side-Effects)
    let note = ''
    if (nextStatus === 'paid') {
      order.invoiceNumber = `INV-1405-${Math.floor(1000 + Math.random() * 9000)}`
      note = `صدور خودکار فاکتور تجاری ${order.invoiceNumber} و تخصیص موجودی انبار`
      toast.success(`فاکتور ${order.invoiceNumber} به صورت خودکار صادر شد`)
    } else if (nextStatus === 'packing') {
      note = 'سفارش جهت اسکن فیزیکی بارکد اقلام وارد میز بسته‌بندی شد'
    } else if (nextStatus === 'shipped') {
      if (!order.iranPostTrackingCode) {
        order.iranPostTrackingCode = `18939631110000${Math.floor(1000000000 + Math.random() * 9000000000)}`
      }
      note = `تحویل به مامور پست و ارسال پیامک رهگیری به ${order.phone}`
      toast.success(`پیامک رهگیری پستی به شماره ${order.phone} با موفقیت مخابره شد`)
    } else if (nextStatus === 'delivered') {
      note = 'تایید تحویل به گیرنده از سوی وب‌سرویس رهگیری شرکت ملی پست'
      toast.success('سفارش با موفقیت تحویل مشتری گردید')
    } else if (nextStatus === 'canceled') {
      note = 'لغو سفارش و بازگشت خودکار اقلام به موجودی خالص انبار'
      toast.info('سفارش لغو و موجودی‌های رزروشده آزاد شدند')
    }

    order.timeline.unshift({
      status: nextStatus,
      timestamp: `امروز، ${timeStr}`,
      operator,
      note,
    })

    return true
  }

  return {
    canTransition,
    transitionOrder,
  }
}
