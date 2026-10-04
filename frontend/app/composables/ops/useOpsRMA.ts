// frontend/app/composables/ops/useOpsRMA.ts
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { formatToman } from '~/utils/format'

export interface RmaRequest {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  items: {
    sku: string
    title: string
    price: number
    reason: string
    hygienePassed: boolean
    tagsIntact: boolean
    approved: boolean
  }[]
  refundMethod: 'wallet' | 'bank_gateway'
  totalRefundAmount: number
  status: 'pending_inspection' | 'approved_refunded' | 'rejected'
  createdDate: string
  inspectorNotes?: string
}

export function useOpsRMA() {
  const rmaRequests = ref<RmaRequest[]>([
    {
      id: 'RMA-1405-771',
      orderId: 'KRS-1405-9921',
      customerName: 'سارا رادمنش',
      customerPhone: '09121112233',
      items: [
        {
          sku: 'KRS-BLS-SLK-FS',
          title: 'شومیز ابریشم سیلک طبیعی',
          price: 2450000,
          reason: 'عدم تطابق سایز با بالاتنه',
          hygienePassed: true,
          tagsIntact: true,
          approved: true,
        },
      ],
      refundMethod: 'wallet',
      totalRefundAmount: 2450000,
      status: 'pending_inspection',
      createdDate: 'دیروز، ساعت ۱۵:۲۰',
    },
  ])

  const approveRma = (rmaId: string, method: 'wallet' | 'bank_gateway', notes: string) => {
    const found = rmaRequests.value.find(r => r.id === rmaId)
    if (!found) return

    found.status = 'approved_refunded'
    found.refundMethod = method
    found.inspectorNotes = notes

    const targetDesc = method === 'wallet' ? 'کیف پول کاربری مشتری' : 'حساب بانکی مبدا از طریق شاپرک'
    toast.success(`مرجوعی ${found.id} تایید شد؛ مبلغ ${formatToman(found.totalRefundAmount)} تومان به ${targetDesc} واریز گردید`)
  }

  const rejectRma = (rmaId: string, reason: string) => {
    const found = rmaRequests.value.find(r => r.id === rmaId)
    if (!found) return

    found.status = 'rejected'
    found.inspectorNotes = reason
    toast.error(`درخواست مرجوعی ${found.id} به علت عدم تطابق شرایط بهداشتی رد شد`)
  }

  return {
    rmaRequests,
    approveRma,
    rejectRma,
  }
}
