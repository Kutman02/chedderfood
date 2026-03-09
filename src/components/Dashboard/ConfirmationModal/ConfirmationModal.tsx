

import type { ConfirmationModalProps } from "@/components/Dashboard/ConfirmationModal/types"
import { ConfirmationContent } from "@/components/Dashboard/ConfirmationModal/components"

export const ConfirmationModal = ({
  isOpen,
  ...props
}: ConfirmationModalProps) => {

  if (!isOpen) return null

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={props.onCancel}
    >

      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border-2 border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >

        <ConfirmationContent {...props} />

      </div>

    </div>

  )

}