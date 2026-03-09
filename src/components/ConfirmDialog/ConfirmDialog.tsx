
import type { ConfirmDialogProps } from "@/components/ConfirmDialog/types"

import {
  ConfirmHeader,
  ConfirmContent,
  ConfirmActions
} from "@/components/ConfirmDialog/components"

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Да",
  cancelText = "Нет"
}: ConfirmDialogProps) => {

  if (!isOpen) return null

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">

        <ConfirmHeader title={title} />

        <ConfirmContent message={message} />

        <ConfirmActions
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmText={confirmText}
          cancelText={cancelText}
        />

      </div>

    </div>

  )

}