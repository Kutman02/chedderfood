interface Props {
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  type: "warning" | "danger"
}

export const ConfirmationActions = ({
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type
}: Props) => {

  const confirmColor =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700"

  return (

    <div className="flex gap-3">

      <button
        onClick={onCancel}
        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
      >
        {cancelText}
      </button>

      <button
        onClick={onConfirm}
        className={`flex-1 px-4 py-3 ${confirmColor} text-white rounded-xl font-bold transition-colors active:scale-95`}
      >
        {confirmText}
      </button>

    </div>

  )

}