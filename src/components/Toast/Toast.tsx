import React from "react"
import { useToastStore } from "@/stores/toastStore"
import { ToastItem } from "./components/ToastItem"

export const Toast: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
        />
      ))}
    </div>
  )
}