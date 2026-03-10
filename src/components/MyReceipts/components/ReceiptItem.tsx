import { useGetPublicOrderQuery } from "@/app/services/publicApi"
import type { ReceiptData } from "@/types"
import { getOrderStatus } from "../utils/getOrderStatus"
import { OrderProgress } from "./OrderProgress"

interface ReceiptItemProps {
  receipt: ReceiptData
  onDelete: (id: number, status: string) => void
  onView: (receipt: ReceiptData) => void
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
      className="
        bg-white
        border
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
        flex
        flex-col
        justify-between
        gap-4
      "
    >

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            Заказ #{receipt.id}
          </h3>

          <p className="text-sm text-gray-500">
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
      <div className="text-sm text-gray-600 space-y-1">

        {currentOrderData.total && (
          <p>
            Сумма: <span className="font-medium">{currentOrderData.total} сом</span>
          </p>
        )}

        {currentOrderData.items?.length && (
          <p>
            Товаров: <span className="font-medium">{currentOrderData.items.length}</span>
          </p>
        )}

      </div>


      {/* Actions */}
      <div className="flex gap-2 pt-2">

        <button
          onClick={() => onView(receipt)}
          className="
            flex-1
            bg-gray-900
            text-white
            text-sm
            py-2
            rounded-lg
            hover:bg-black
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
            border
            text-sm
            py-2
            rounded-lg
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