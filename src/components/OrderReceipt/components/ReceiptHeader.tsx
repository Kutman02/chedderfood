import type { FC } from "react"
import { FaTimes, FaCheckCircle, FaSync } from "react-icons/fa"

interface ReceiptHeaderProps {
  onClose: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

export const ReceiptHeader: FC<ReceiptHeaderProps> = ({
  onClose,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="shrink-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <FaCheckCircle
            className="text-green-600"
            size={20}
          />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-800">
            Заказ успешно оформлен!
          </h2>

          <p className="text-sm text-slate-600">
            Автообновление каждые 30 секунд
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
          title="Обновить статус"
        >
          <FaSync
            size={16}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </button>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FaTimes size={20} />
        </button>

      </div>

    </div>
  )
}