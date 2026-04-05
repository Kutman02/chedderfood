import { useState, useRef, useEffect, useMemo } from "react"

import type { Order } from "@/entities/order/model/types"
import type { Product } from "@/entities/product/model/types"

import { normalizeOrder } from "@/entities/order/model/normalizeOrder"
import { useScrollLockStore } from "@/stores/scrollLockStore"

import {
  OrderDetailsHeader,
  OrderDetailsContent,
} from "./components"

interface OrderDetailsModalProps {
  isOpen: boolean
  order: any | null
  products: Product[]
  onClose: () => void
}

export const OrderDetailsModal = ({
  isOpen,
  order,
  products,
  onClose,
}: OrderDetailsModalProps) => {

  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareMenuRef = useRef<HTMLDivElement | null>(null)

  const lock = useScrollLockStore((s) => s.lock)
  const unlock = useScrollLockStore((s) => s.unlock)

  /* ===============================
     NORMALIZE
  =============================== */

  const normalizedOrder: Order | null = useMemo(
    () => (order ? normalizeOrder(order) : null),
    [order]
  )

  /* ===============================
     SCROLL LOCK (🔥 FIX)
  =============================== */

  useEffect(() => {
    if (!isOpen) return

    lock()

    return () => {
      unlock()
    }
  }, [isOpen, lock, unlock])

  /* ===============================
     ESC CLOSE
  =============================== */

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  /* ===============================
     GUARD
  =============================== */

  if (!isOpen || !normalizedOrder) return null

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 backdrop-blur-sm">

      <div className="bg-white w-full h-full flex flex-col overflow-hidden">

        <OrderDetailsHeader
          order={normalizedOrder}
          onClose={onClose}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          shareMenuRef={shareMenuRef}
        />

        <div className="flex-1 overflow-y-auto">

          <OrderDetailsContent
            order={normalizedOrder}
            products={products}
          />

        </div>

      </div>

    </div>
  )
}