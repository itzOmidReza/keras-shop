// frontend/app/composables/ops/useOpsAudit.ts
import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

export type OpsAuditSeverity = 'info' | 'warning' | 'critical'

export interface OpsAuditEntry {
  id: string
  operatorId: string
  operatorName: string
  action: string
  actionTitle: string
  targetType: 'product' | 'order' | 'inventory' | 'finance' | 'security'
  targetId: string
  timestamp: string
  severity: OpsAuditSeverity
  details: string
  diff?: {
    before: string
    after: string
  }
}

const INITIAL_LOGS: OpsAuditEntry[] = [
  {
    id: 'aud_108',
    operatorId: 'op_1405_hq',
    operatorName: 'سارا رادمنش',
    action: 'CHANGE_STATUS',
    actionTitle: 'ارتقای وضعیت سفارش به بسته‌بندی',
    targetType: 'order',
    targetId: 'KRS-1405-9921',
    timestamp: 'امروز، ۱۰:۴۲',
    severity: 'info',
    details: 'سفارش پرداخت‌شده وارد خط فیزیکی آتلیه شد',
    diff: { before: 'پرداخت‌شده (paid)', after: 'در حال بسته‌بندی (packing)' },
  },
  {
    id: 'aud_107',
    operatorId: 'op_1405_hq',
    operatorName: 'سارا رادمنش',
    action: 'TRANSFER_STOCK',
    actionTitle: 'حواله بین‌انباری پالتو کشمیر',
    targetType: 'inventory',
    targetId: 'SKU-COAT-KSH-M',
    timestamp: 'امروز، ۰۹:۱۵',
    severity: 'warning',
    details: 'انتقال ۵ عدد از انبار مرکزی شریعتی به آتلیه نیاوران',
    diff: { before: 'انبار مرکزی: ۱۲ عدد', after: 'انبار مرکزی: ۷ عدد (+۵ نیاوران)' },
  },
  {
    id: 'aud_106',
    operatorId: 'op_wh_tehran',
    operatorName: 'رضا کمالی (انباردار)',
    action: 'UPDATE_PRICE',
    actionTitle: 'تغییر قیمت فروش شومیز سیلک',
    targetType: 'product',
    targetId: 'prd_silk_blouse',
    timestamp: 'دیروز، ۱۸:۳۰',
    severity: 'critical',
    details: 'اعمال تخفیف کمپین پاییزه بر روی قیمت نهایی',
    diff: { before: '۲,۸۵۰,۰۰۰ تومان', after: '۲,۴۵۰,۰۰۰ تومان' },
  },
  {
    id: 'aud_105',
    operatorId: 'op_1405_hq',
    operatorName: 'سارا رادمنش',
    action: 'RMA_REFUND',
    actionTitle: 'تایید بازگشت کالا و عودت به کیف پول',
    targetType: 'finance',
    targetId: 'RMA-7741',
    timestamp: 'دیروز، ۱۶:۱۰',
    severity: 'warning',
    details: 'بررسی فیزیکی سلامت بافت تایید شد؛ شارژ کیف پول کاربر',
    diff: { before: 'در انتظار بازرسی', after: 'عودت کامل ۱,۹۵۰,۰۰۰ تومان' },
  },
  {
    id: 'aud_104',
    operatorId: 'op_sec_sentinel',
    operatorName: 'سامانه امنیت هسته',
    action: 'REVOKE_SESSION',
    actionTitle: 'خاتمه اجباری نشست کاربری مشکوک',
    targetType: 'security',
    targetId: 'sess_unrecog_9',
    timestamp: 'دیروز، ۱۲:۰۲',
    severity: 'critical',
    details: 'تغییر IP ناگهانی از موقعیت ناشناس مسدود شد',
  },
]

export function useOpsAudit() {
  const auditLogs = ref<OpsAuditEntry[]>([...INITIAL_LOGS])
  const searchQuery = ref('')
  const selectedSeverity = ref<string>('all')

  const filteredLogs = computed(() => {
    return auditLogs.value.filter((log) => {
      const matchSearch =
        !searchQuery.value ||
        log.targetId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        log.operatorName.includes(searchQuery.value) ||
        log.actionTitle.includes(searchQuery.value) ||
        log.details.includes(searchQuery.value)

      const matchSeverity =
        selectedSeverity.value === 'all' || log.severity === selectedSeverity.value

      return matchSearch && matchSeverity
    })
  })

  const logOperation = (entry: Omit<OpsAuditEntry, 'id' | 'timestamp'>) => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const mins = String(now.getMinutes()).padStart(2, '0')
    const newEntry: OpsAuditEntry = {
      ...entry,
      id: `aud_${Date.now().toString().slice(-4)}`,
      timestamp: `امروز، ${toFa(hours)}:${toFa(mins)}`,
    }
    auditLogs.value.unshift(newEntry)
  }

  const exportAuditCsv = () => {
    const headers = ['شناسه رخداد', 'نام اپراتور', 'عملیات', 'شناسه هدف', 'شدت', 'زمان', 'شرح']
    const rows = filteredLogs.value.map(l => [
      l.id,
      l.operatorName,
      l.actionTitle,
      l.targetId,
      l.severity,
      l.timestamp,
      `"${l.details.replace(/"/g, '""')}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `keras-audit-trail-${Date.now()}.csv`
    link.click()
    toast.success('دفتر رخدادهای امنیتی با موفقیت دانلود شد')
  }

  return {
    auditLogs,
    searchQuery,
    selectedSeverity,
    filteredLogs,
    logOperation,
    exportAuditCsv,
  }
}
