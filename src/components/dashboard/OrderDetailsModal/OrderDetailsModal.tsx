import { useState, useRef, useEffect } from "react"
import type { Order } from "@/types"

import {
  OrderDetailsHeader,
  OrderDetailsContent,
} from "./components"

interface OrderDetailsModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
}

export const OrderDetailsModal = ({
  isOpen,
  order,
  onClose,
}: OrderDetailsModalProps) => {

  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareMenuRef = useRef<HTMLDivElement | null>(null)

  /**
   * Блокируем скролл страницы
   */
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  /**
   * Закрытие по ESC
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 backdrop-blur-sm">

      <div className="bg-white w-full h-full flex flex-col overflow-hidden">

        <OrderDetailsHeader
          order={order}
          onClose={onClose}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          shareMenuRef={shareMenuRef}
        />

        <div className="flex-1 overflow-y-auto">

          <OrderDetailsContent
            order={order}
          />

        </div>

      </div>

    </div>
  )
}