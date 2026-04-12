import type { FC } from "react"

interface ReceiptHeaderProps {
  status: string
  onClose: () => void
}

export const ReceiptHeader: FC<ReceiptHeaderProps> = ({
  status,
  onClose,
}) => {

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "on-hold":
        return "Ожидает"
      case "processing":
        return "Готовится"
      case "completed":
        return "Готов"
      case "cancelled":
        return "Отменён"
      case "ready":
        return "Готов"
      default:
        return status
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Статус заказа
        </h2>

        <p className="text-sm text-orange-600 font-semibold">
          {getStatusLabel(status)}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-800 text-xl"
      >
        ✕
      </button>

    </div>
  )
}