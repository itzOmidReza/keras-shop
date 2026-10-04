// frontend/app/composables/ops/useOpsDraftStore.ts
export function useOpsDraftStore() {
  const saveDraft = <T>(key: string, data: T) => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(`keras_ops_draft_${key}`, JSON.stringify({
        timestamp: Date.now(),
        data,
      }))
    } catch {
      // localStorage may fail in quota exceeded or private mode
    }
  }

  const loadDraft = <T>(key: string): T | null => {
    if (!import.meta.client) return null
    try {
      const raw = localStorage.getItem(`keras_ops_draft_${key}`)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed.data as T
    } catch {
      return null
    }
  }

  const clearDraft = (key: string) => {
    if (!import.meta.client) return
    try {
      localStorage.removeItem(`keras_ops_draft_${key}`)
    } catch {
      // ignore
    }
  }

  return {
    saveDraft,
    loadDraft,
    clearDraft,
  }
}
