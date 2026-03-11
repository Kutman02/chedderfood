import { useGetPublicOrderQuery } from "@/app/services/publicApi"
import type { ReceiptData } from "@/types"
import { getOrderStatus } from "../utils/getOrderStatus"
import { OrderProgress } from "./OrderProgress"

interface ReceiptItemProps {
  receipt: ReceiptData
  onDelete: (id: number, status: string) => void
  onView: (receipt: ReceiptData) => void
}

const getOrderBorder = (status: string) => {
  switch (status) {

    case "pending":
      return "border-2 border-yellow-400 animate-pulse"

    case "on-hold":
      return "border-2 border-orange-400 animate-pulse"

    case "processing":
      return "border-2 border-blue-400 animate-pulse"

    case "ready":
      return "border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"

    case "completed":
      return "border-2 border-yellow-900"

    case "cancelled":
    case "refunded":
    case "failed":
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

  const { data: latestOrder } =
    useGetPublicOrderQuery(receipt.id.toString(), {
      pollingInterval: 15000
    })

  const currentOrderData = latestOrder || receipt
  const status = getOrderStatus(currentOrderData.status)

  const canDelete =
    currentOrderData.status === "cancelled" ||
    currentOrderData.status === "completed"

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        hover:-translate-y-[2px]
        transition
        flex
        flex-col
        justify-between
        gap-4
        ${getOrderBorder(currentOrderData.status)}
      `}
    >

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            Заказ #{receipt.id}
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

      <OrderProgress status={currentOrderData.status} />

      {/* Info */}
      <div className="text-sm text-slate-600 space-y-1">

        {currentOrderData.total && (
          <p>
            Сумма:{" "}
            <span className="font-semibold text-orange-500">
              {currentOrderData.total} сом
            </span>
          </p>
        )}

        {currentOrderData.items?.length > 0 && (
          <p>
            Товаров:{" "}
            <span className="font-medium">
              {currentOrderData.items.length}
            </span>
          </p>
        )}

      </div>

      {/* Actions */}
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
            onClick={() => onDelete(receipt.id, currentOrderData.status)}
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