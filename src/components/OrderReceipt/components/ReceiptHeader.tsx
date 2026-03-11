import type { FC } from "react"
import { FaTimes, FaCheckCircle, FaSync, FaClock } from "react-icons/fa"
import { MdRestaurant } from "react-icons/md"
import { IoFastFood } from "react-icons/io5"

interface ReceiptHeaderProps {
  status: string
  onClose: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

const getStatusUI = (status: string) => {
  switch (status) {
    case "pending":
      return {
        text: "Ожидает оплаты",
        icon: FaClock,
        bg: "bg-yellow-100",
        color: "text-yellow-700",
      }

    case "on-hold":
      return {
        text: "Ожидает подтверждения",
        icon: FaClock,
        bg: "bg-orange-100",
        color: "text-orange-700",
      }

    case "processing":
      return {
        text: "Ваш заказ готовится",
        icon: MdRestaurant,
        bg: "bg-blue-100",
        color: "text-blue-700",
      }

    case "ready":
      return {
        text: "Заказ готов",
        icon: IoFastFood,
        bg: "bg-green-100",
        color: "text-green-700",
      }

    case "completed":
      return {
        text: "Заказ завершён",
        icon: FaCheckCircle,
        bg: "bg-green-100",
        color: "text-green-700",
      }

    case "cancelled":
      return {
        text: "Заказ отменён",
        icon: FaTimes,
        bg: "bg-red-100",
        color: "text-red-700",
      }

    default:
      return {
        text: "Статус заказа",
        icon: FaClock,
        bg: "bg-slate-100",
        color: "text-slate-700",
      }
  }
}

export const ReceiptHeader: FC<ReceiptHeaderProps> = ({
  status,
  onClose,
  onRefresh,
  isRefreshing,
}) => {

  const ui = getStatusUI(status)
  const Icon = ui.icon

  return (
    <div className="shrink-0 bg-linear-to-r from-white to-orange-50 border-b border-slate-200 p-4 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className={`w-10 h-10 ${ui.bg} rounded-full flex items-center justify-center`}>
          <Icon size={20} className={ui.color} />
        </div>

        <div>
          <h2 className={`text-lg font-black ${ui.color}`}>
            {ui.text}
          </h2>

          <p className="text-xs text-slate-500">
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
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Закрыть"
        >
          <FaTimes size={20} />
        </button>

      </div>

    </div>
  )
}