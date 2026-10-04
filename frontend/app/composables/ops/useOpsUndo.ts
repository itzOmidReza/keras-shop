// frontend/app/composables/ops/useOpsUndo.ts
import { toast } from 'vue-sonner'

export interface UndoAction {
  id: string
  title: string
  undo: () => void
  timeoutMs?: number
}

export function useOpsUndo() {
  const triggerUndoableAction = (action: UndoAction) => {
    const timeout = action.timeoutMs ?? 6000

    toast(action.title, {
      duration: timeout,
      action: {
        label: 'بازگردانی (Undo)',
        onClick: () => {
          action.undo()
          toast.success('عملیات با موفقیت بازگردانی شد')
        },
      },
    })
  }

  return {
    triggerUndoableAction,
  }
}
