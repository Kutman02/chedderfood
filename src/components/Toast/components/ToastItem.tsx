import React from "react"
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa"
import { useToastStore } from "../../../stores/toastStore"
import type { ToastType } from "../types"

interface ToastItemProps {
  toast: ToastType
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast)

  const iconMap = {
    success: <FaCheckCircle className="text-green-500" size={20} />,
    error: <FaTimesCircle className="text-red-500" size={20} />,
    info: <FaInfoCircle className="text-blue-500" size={20} />,
  }

  const bgColorMap = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }

  const type = toast.type || "success"

  return (
    <div
      className={`${bgColorMap[type]} border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-300px max-w-500px animate-in slide-in-from-right-full duration-300`}
    >
      {iconMap[type]}

      <span className="flex-1 text-sm font-medium text-slate-800">
        {toast.message}
      </span>

      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <FaTimes size={14} />
      </button>
    </div>
  )
}