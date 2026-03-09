import type { FC } from "react"
import { getStatusColor, getStatusText } from "../utils/orderStatus"

interface OrderStatusProps {
  status: string
  latestOrder?: boolean
}

export const OrderStatus: FC<OrderStatusProps> = ({
  status,
  latestOrder,
}) => {
  const statusColor = getStatusColor(status)
  const statusText = getStatusText(status)

  const indicatorColor =
    status === "completed"
      ? "bg-green-600"
      : status === "processing"
      ? "bg-blue-600"
      : status === "cancelled"
      ? "bg-red-600"
      : "bg-yellow-600"

  return (
    <div className="mt-6 text-center">

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}
      >
        <div
          className={`w-2 h-2 rounded-full animate-pulse ${indicatorColor}`}
        />

        <span className="font-medium">
          Статус: {statusText}
        </span>
      </div>

      {latestOrder && (
        <p className="text-xs text-slate-500 mt-2">
          Обновлено: {new Date().toLocaleTimeString()}
        </p>
      )}

    </div>
  )
}