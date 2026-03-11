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
        icon: <FaClock className="text-yellow-600" size={20} />,
        bg: "bg-yellow-100",
        color: "text-yellow-700",
      }

    case "on-hold":
      return {
        text: "Ожидает подтверждения",
        icon: <FaClock className="text-orange-600" size={20} />,
        bg: "bg-orange-100",
        color: "text-orange-700",
      }

    case "processing":
      return {
        text: "Ваш заказ готовится",
        icon: <MdRestaurant className="text-blue-600 animate-pulse" size={22} />,
        bg: "bg-blue-100",
        color: "text-blue-700",
      }

    case "ready":
      return {
        text: "Заказ готов",
        icon: <IoFastFood className="text-green-600" size={22} />,
        bg: "bg-green-100",
        color: "text-green-700",
      }

    case "completed":
      return {
        text: "Заказ завершён",
        icon: <FaCheckCircle className="text-green-600" size={20} />,
        bg: "bg-green-100",
        color: "text-green-700",
      }

    case "cancelled":
      return {
        text: "Заказ отменён",
        icon: <FaTimes className="text-red-600" size={20} />,
        bg: "bg-red-100",
        color: "text-red-700",
      }

    default:
      return {
        text: "Статус заказа",
        icon: <FaClock className="text-slate-500" size={20} />,
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

  return (
    <div className="shrink-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className={`w-10 h-10 ${ui.bg} rounded-full flex items-center justify-center`}>
          {ui.icon}
        </div>

        <div>
          <h2 className={`text-xl font-black ${ui.color}`}>
            {ui.text}
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