import {
  FaBell,
  FaUserTie,
  FaCheckCircle,
  FaTimes,
  FaBox,
  FaUsers,
  FaShoppingBag
} from "react-icons/fa"

import type { TabConfig } from "../../../types"


export const ORDER_TABS: TabConfig[] = [

  {
    id: "on-hold",
    label: "Новые",
    icon: FaBell,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200"
  },

  {
    id: "processing",
    label: "В работе",
    icon: FaUserTie,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },

  {
    id: "ready",
    label: "Готовые",
    icon: FaCheckCircle,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },

  {
    id: "completed",
    label: "Завершён",
    icon: FaCheckCircle,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },

  {
    id: "cancelled",
    label: "Отменённые",
    icon: FaTimes,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  }

]


export const MAIN_SECTIONS = [

  {
    id: "orders",
    label: "Заказы",
    icon: FaShoppingBag,
    color: "from-orange-500 to-orange-600"
  },

  {
    id: "products",
    label: "Товары",
    icon: FaBox,
    color: "from-blue-500 to-blue-600"
  },

  {
    id: "customers",
    label: "Клиенты",
    icon: FaUsers,
    color: "from-purple-500 to-purple-600"
  }

]