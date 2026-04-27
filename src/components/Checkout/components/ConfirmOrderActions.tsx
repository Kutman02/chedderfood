type ConfirmOrderActionsProps = {
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmOrderActions = ({
  isSubmitting,
  onConfirm,
  onCancel,
}: ConfirmOrderActionsProps) => {
  return (
    <div className="shrink-0 border-t border-slate-200 p-4">
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition"
        >
          Отменить
        </button>

        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Создание...
            </>
          ) : (
            "Подтвердить"
          )}
        </button>
      </div>
    </div>
  )
}
