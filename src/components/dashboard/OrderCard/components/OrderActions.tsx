import { FaTimes, FaCheckCircle } from "react-icons/fa"
import type { Order } from "@/types"
import { IoFastFood } from "react-icons/io5";


export const OrderActions = ({
  order,
  activeTab,
  onConfirmAction
}: {
  order: Order
  activeTab: string
  onConfirmAction: (id: number, action: string) => void
}) => {
  const orderNumber = order.number ?? order.id

  if (activeTab === "on-hold") {

    return (
      <div className="flex gap-2">

        <button
          onClick={() => onConfirmAction(order.id, "принять")}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-sm sm:min-h-0 sm:text-base"
        >
          <IoFastFood />
          Принять #{orderNumber}
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="min-h-14 rounded-xl bg-red-50 px-5 text-red-600 sm:min-h-0"
        >
          <FaTimes />
        </button>

      </div>
    )
  }

  if (activeTab === "processing") {

    return (
      <div className="flex gap-2">

        <button
          onClick={() => onConfirmAction(order.id, "готов")}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white shadow-sm sm:min-h-0 sm:text-base"
        >
          <FaCheckCircle />
          Готов #{orderNumber}
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="min-h-14 rounded-xl bg-red-50 px-5 text-red-600 sm:min-h-0"
        >
          <FaTimes />
        </button>

      </div>
    )
  }

  if (activeTab === "ready") {

    return (
      <div className="flex gap-2">

        <button
          onClick={() => onConfirmAction(order.id, "завершить")}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-base font-bold text-white shadow-sm sm:min-h-0 sm:text-base"
        >
          <FaCheckCircle />
          Завершить #{orderNumber}
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="min-h-14 rounded-xl bg-red-50 px-5 text-red-600 sm:min-h-0"
        >
          <FaTimes />
        </button>

      </div>
    )
  }

  return null
}