import type { FC } from "react"
import { FaPrint, FaShare } from "react-icons/fa"

interface ReceiptActionsProps {
  onPrint: () => void
  onShare: () => void
  onNewOrder: () => void
}

export const ReceiptActions: FC<ReceiptActionsProps> = ({
  onPrint,
  onShare,
  onNewOrder,
}) => {
  return (
    <div className="shrink-0 border-t border-slate-200 p-4 bg-white">
      <div className="flex gap-3">

        <button
          onClick={onPrint}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <FaPrint size={16} />
          Распечатать
        </button>

        <button
          onClick={onShare}
          className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-xl font-medium hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
        >
          <FaShare size={16} />
          Поделиться
        </button>

        <button
          onClick={onNewOrder}
          className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
        >
          Новый заказ
        </button>

      </div>
    </div>
  )
}