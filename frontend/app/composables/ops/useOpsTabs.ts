// frontend/app/composables/ops/useOpsTabs.ts
import { ref } from 'vue'

export interface OpsWorkspaceTab {
  id: string
  title: string
  view: string
  isPinned: boolean
  isClosable: boolean
  badge?: string
}

const DEFAULT_TABS: OpsWorkspaceTab[] = [
  { id: 'tab_analytics', title: 'دیده‌بان اجرایی', view: 'analytics', isPinned: true, isClosable: false },
  { id: 'tab_products', title: 'محصولات و انبار', view: 'products', isPinned: false, isClosable: true },
  { id: 'tab_orders', title: 'میز سفارش‌ها', view: 'fulfillment', isPinned: false, isClosable: true, badge: '۳' },
]

export function useOpsTabs() {
  const tabs = ref<OpsWorkspaceTab[]>([...DEFAULT_TABS])
  const activeTabId = ref<string>('tab_analytics')

  const openTab = (tab: Omit<OpsWorkspaceTab, 'isPinned' | 'isClosable'> & { isPinned?: boolean; isClosable?: boolean }) => {
    const existing = tabs.value.find(t => t.id === tab.id || (t.view === tab.view && !tab.id.startsWith('entity_')))
    if (existing) {
      activeTabId.value = existing.id
      return
    }

    const newTab: OpsWorkspaceTab = {
      ...tab,
      isPinned: tab.isPinned ?? false,
      isClosable: tab.isClosable ?? true,
    }
    tabs.value.push(newTab)
    activeTabId.value = newTab.id
  }

  const closeTab = (id: string) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx === -1) return

    const wasActive = activeTabId.value === id
    tabs.value.splice(idx, 1)

    if (wasActive && tabs.value.length > 0) {
      const fallbackTab = tabs.value[Math.max(0, idx - 1)]
      if (fallbackTab) {
        activeTabId.value = fallbackTab.id
      }
    }
  }

  const togglePin = (id: string) => {
    const tab = tabs.value.find(t => t.id === id)
    if (tab) {
      tab.isPinned = !tab.isPinned
    }
  }

  return {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    togglePin,
  }
}
