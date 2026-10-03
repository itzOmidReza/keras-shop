// frontend/app/composables/ops/useOpsFinance.ts
import { toast } from 'vue-sonner'

export interface ShaparakTx {
  id: string
  rrn: string
  cardNumber: string
  bankName: string
  orderNumber: string
  customerName: string
  amount: number
  fee: number
  status: 'settled' | 'pending' | 'failed'
  settledAt: string
}

const financeDateRange = ref<'today' | 'week' | 'month' | 'all'>('month')

const transactionsList = ref<ShaparakTx[]>([
  {
    id: 'tx_101',
    rrn: '982301449102',
    cardNumber: '6037-99**-****-1234',
    bankName: 'بانک ملی ایران',
    orderNumber: 'KERAS-104921',
    customerName: 'سارا ملکی',
    amount: 2340000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۲ - ۱۰:۱۵:۲۲',
  },
  {
    id: 'tx_102',
    rrn: '981423881903',
    cardNumber: '6104-33**-****-5678',
    bankName: 'بانک ملت',
    orderNumber: 'KERAS-208314',
    customerName: 'فرهاد احمدی',
    amount: 1450000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۱ - ۱۶:۴۰:۰۵',
  },
  {
    id: 'tx_103',
    rrn: '984511092834',
    cardNumber: '5892-10**-****-9012',
    bankName: 'بانک سپه',
    orderNumber: 'KERAS-309115',
    customerName: 'مریم کمالی',
    amount: 3890000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۰ - ۱۱:۲۲:۴۸',
  },
  {
    id: 'tx_104',
    rrn: '983391204856',
    cardNumber: '6221-06**-****-4321',
    bankName: 'بانک پارسیان',
    orderNumber: 'KERAS-401827',
    customerName: 'سارا رادمنش',
    amount: 1850000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۰۹ - ۰۹:۳۰:۱۴',
  },
  {
    id: 'tx_105',
    rrn: '985512948172',
    cardNumber: '5022-29**-****-8812',
    bankName: 'بانک پاسارگاد',
    orderNumber: 'KERAS-502918',
    customerName: 'نیلوفر رضایی',
    amount: 2650000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۰۸ - ۱۹:۱۴:۳۳',
  },
  {
    id: 'tx_106',
    rrn: '986623194850',
    cardNumber: '6274-12**-****-3399',
    bankName: 'بانک اقتصاد نوین',
    orderNumber: 'KERAS-609124',
    customerName: 'آیدا شمس',
    amount: 980000,
    fee: 4000,
    status: 'pending',
    settledAt: 'در صف تسویه پایا',
  },
])

export function useOpsFinance() {
  const financialKpis = computed(() => {
    const gross = transactionsList.value.reduce(
      (sum, t) => sum + (t.status === 'settled' ? t.amount : 0),
      0,
    )
    const totalFees = transactionsList.value.reduce(
      (sum, t) => sum + (t.status === 'settled' ? t.fee : 0),
      0,
    )
    const discountsAbsorbed = 1850000
    const estimatedShipping = 340000
    const net = gross - discountsAbsorbed - totalFees - estimatedShipping

    return {
      gross,
      net,
      discountsAbsorbed,
      totalFees,
      estimatedShipping,
    }
  })

  const exportFinanceCsv = () => {
    const headers = 'شماره ارجاع (RRN),شماره سفارش,بانک عامل,شماره کارت,خریدار,مبلغ (تومان),کارمزد شاپرک,وضعیت تسویه,تاریخ و زمان\n'
    const rows = transactionsList.value
      .map(
        (t) =>
          `"${t.rrn}","${t.orderNumber}","${t.bankName}","${t.cardNumber}","${t.customerName}",${t.amount},${t.fee},"${t.status === 'settled' ? 'تسویه‌شده' : 'در انتظار'}","${t.settledAt}"`,
      )
      .join('\n')

    const blob = new Blob(['\uFEFF' + headers + rows], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `keras-ledger-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('گزارش دفتر کل شاپرک با فرمت CSV دانلود گردید.')
  }

  const printFinanceSummary = () => {
    if (import.meta.client) {
      window.print()
    }
  }

  return {
    financeDateRange,
    transactionsList,
    financialKpis,
    exportFinanceCsv,
    printFinanceSummary,
  }
}
