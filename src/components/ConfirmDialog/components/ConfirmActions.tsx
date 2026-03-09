interface Props {
  onConfirm: () => void
  onCancel: () => void
  confirmText: string
  cancelText: string
}

export const ConfirmActions = ({
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}: Props) => {

  return (

    <div className="px-4 pb-4">

      <div className="flex gap-3">

        <button
          onClick={onCancel}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          {confirmText}
        </button>

      </div>

    </div>

  )

}