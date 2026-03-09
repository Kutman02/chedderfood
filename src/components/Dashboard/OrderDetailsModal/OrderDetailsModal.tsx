import { useState, useRef } from "react"
import type { Order } from "../../../types"

import { OrderDetailsHeader } from "./components/OrderDetailsHeader"
import { OrderDetailsContent } from "./components/OrderDetailsContent"

interface OrderDetailsModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
}

export const OrderDetailsModal = ({
  isOpen,
  order,
  onClose
}: OrderDetailsModalProps) => {

  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareMenuRef = useRef<HTMLDivElement | null>(null)

  if (!isOpen || !order) return null

  return (

    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">

      <div className="bg-white w-full h-screen flex flex-col overflow-hidden">

        <OrderDetailsHeader
          order={order}
          onClose={onClose}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          shareMenuRef={shareMenuRef}
        />

        <OrderDetailsContent
          order={order}
        />

      </div>

    </div>

  )

}