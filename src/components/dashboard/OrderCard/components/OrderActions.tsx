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

  if (activeTab === "on-hold") {

    return (
      <div className="flex gap-2">

        <button
          onClick={() => onConfirmAction(order.id, "принять")}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <IoFastFood />
          Принять
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="px-4 bg-red-50 text-red-600 rounded-xl"
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
          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <FaCheckCircle />
          Готов
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="px-4 bg-red-50 text-red-600 rounded-xl"
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
          className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <FaCheckCircle />
          Завершить
        </button>

        <button
          onClick={() => onConfirmAction(order.id, "отменить")}
          aria-label="Отменить заказ"
          className="px-4 bg-red-50 text-red-600 rounded-xl"
        >
          <FaTimes />
        </button>

      </div>
    )
  }

  return null
}