import type { FC } from "react"
import { getStatusColor, getStatusText } from "../utils/orderStatus"

interface OrderStatusProps {
  status: string
  isUpdated?: boolean
}

export const OrderStatus: FC<OrderStatusProps> = ({
  status,
  isUpdated,
}) => {
  const statusColor = getStatusColor(status)
  const statusText = getStatusText(status)

  return (
    <div className="mt-6 text-center">

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}
      >

        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />

        <span className="font-medium">
          Статус: {statusText}
        </span>

      </div>

      {isUpdated && (
        <p className="text-xs text-slate-500 mt-2">
          Обновлено {new Date().toLocaleTimeString()}
        </p>
      )}

    </div>
  )
}