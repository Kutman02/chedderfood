import { FaExclamationTriangle } from "react-icons/fa"
import type { ConfirmationContentProps } from "../types"
import { ConfirmationActions } from "./ConfirmationActions"

export const ConfirmationContent = ({
  title,
  message,
  type = "warning",
  confirmText = "Да",
  cancelText = "Нет",
  onConfirm,
  onCancel
}: ConfirmationContentProps) => {

  const iconBg =
    type === "danger"
      ? "bg-red-100"
      : "bg-amber-100"

  const iconColor =
    type === "danger"
      ? "text-red-600"
      : "text-amber-600"

  return (

    <>
      <div className="flex items-center gap-3 mb-4">

        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          <FaExclamationTriangle className={iconColor}/>
        </div>

        <h3 className="text-xl font-black text-slate-900">
          {title}
        </h3>

      </div>

      <p className="text-slate-600 mb-6 text-base leading-relaxed">
        {message}
      </p>

      <ConfirmationActions
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        type={type}
      />
    </>

  )

}