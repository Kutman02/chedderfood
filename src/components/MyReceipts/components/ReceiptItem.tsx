import type { Order } from "@/types"
import { getOrderStatus } from "../utils/getOrderStatus"
import { OrderProgress } from "./OrderProgress"

interface ReceiptItemProps {
  receipt: Order
  onDelete: (id: number, status: string) => void
  onView: (receipt: Order) => void
}

const getOrderBorder = (status: string) => {
  switch (status) {
    case "on-hold":
      return "border-2 border-yellow-400 animate-pulse"

    case "processing":
      return "border-2 border-blue-400 animate-pulse"

    case "ready":
      return "border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"

    case "completed":
      return "border-2 border-yellow-900"

    case "cancelled":
      return "border-2 border-red-400"

    default:
      return "border border-slate-200"
  }
}

export const ReceiptItem = ({
  receipt,
  onDelete,
  onView
}: ReceiptItemProps) => {

  const statusValue = receipt.status || "on-hold"

  const status = getOrderStatus(statusValue)

  const canDelete = ["cancelled", "completed"].includes(statusValue)

  const itemsCount = receipt.items?.length || 0

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition
        flex
        flex-col
        justify-between
        gap-4
        ${getOrderBorder(statusValue)}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            Заказ #{receipt.number ?? receipt.id}
          </h3>

          <p className="text-sm text-slate-500">
            Детали заказа
          </p>
        </div>

        <span
          className={`
            text-xs
            font-medium
            px-3
            py-1
            rounded-full
            ${status.color}
          `}
        >
          {status.label}
        </span>
      </div>

      <OrderProgress status={statusValue} />

      <div className="text-sm text-slate-600 space-y-1">

        {receipt.total && (
          <p>
            Сумма:{" "}
            <span className="font-semibold text-orange-500">
              {receipt.total} сом
            </span>
          </p>
        )}

        {itemsCount > 0 && (
          <p>
            Товаров:{" "}
            <span className="font-medium">
              {itemsCount}
            </span>
          </p>
        )}

      </div>

      <div className="flex gap-2 pt-2">

        <button
          onClick={() => onView(receipt)}
          className="
            flex-1
            bg-orange-500
            text-white
            text-sm
            py-2
            rounded-lg
            hover:bg-orange-600
            transition
          "
        >
          Посмотреть
        </button>

        {canDelete && (
          <button
            onClick={() => onDelete(receipt.id, statusValue)}
            className="
              flex-1
              border border-slate-200
              text-sm
              py-2
              rounded-lg
              text-slate-600
              hover:bg-red-50
              hover:text-red-600
              transition
            "
          >
            Удалить
          </button>
        )}

      </div>
    </div>
  )
}