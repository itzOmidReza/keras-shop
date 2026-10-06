// frontend/app/composables/ops/useOpsModals.ts

const is2FaOpen = ref(false)
const isSessionsOpen = ref(false)
const isAuditOpen = ref(false)
const isCommandPaletteOpen = ref(false)
const isMatrixOpen = ref(false)
const isTransferOpen = ref(false)
const isPackingScanOpen = ref(false)
const isRmaOpen = ref(false)
const isSpreadsheetOpen = ref(false)
const isConflictBannerVisible = ref(false)
const isQuickPeekOpen = ref(false)
export interface QuickPeekPayload {
  type: 'order' | 'product' | 'customer'
  id: string
  title: string
  subtitle: string
  details: { label: string; value: string }[]
  tags?: string[]
}

const quickPeekData = ref<QuickPeekPayload | null>(null)

export function useOpsModals() {
  const openQuickPeek = (data: QuickPeekPayload) => {
    quickPeekData.value = data
    isQuickPeekOpen.value = true
  }

  const closeQuickPeek = () => {
    isQuickPeekOpen.value = false
    quickPeekData.value = null
  }

  return {
    is2FaOpen,
    isSessionsOpen,
    isAuditOpen,
    isCommandPaletteOpen,
    isMatrixOpen,
    isTransferOpen,
    isPackingScanOpen,
    isRmaOpen,
    isSpreadsheetOpen,
    isConflictBannerVisible,
    isQuickPeekOpen,
    quickPeekData,
    openQuickPeek,
    closeQuickPeek,
  }
}
