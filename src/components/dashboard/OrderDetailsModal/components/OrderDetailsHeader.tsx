import { FaTimes, FaShare } from "react-icons/fa"
import type { Order } from "@/entities/order/model/types"

import { ShareMenu } from "./index"

interface Props {
  order: Order
  onClose: () => void
  showShareMenu: boolean
  setShowShareMenu: (v: boolean) => void
  shareMenuRef: React.RefObject<HTMLDivElement | null>
}

export const OrderDetailsHeader = ({
  order,
  onClose,
  showShareMenu,
  setShowShareMenu,
  shareMenuRef
}: Props) => {

  /* ===============================
     TIME
  =============================== */

  const orderTime = order.date_created
    ? new Date(order.date_created).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : null

  /* ===============================
     DELIVERY TYPE (🔥 FIX)
  =============================== */

  const deliveryType =
    order.order_type === "pickup"
      ? "Самовывоз"
      : "Доставка"

  /* ===============================
     SAFE CLOSE (🔥 FIX SCROLL BUG)
  =============================== */

  const handleClose = () => {
    // 🔥 гарантируем восстановление скролла
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""

    onClose()
  }

  return (

    <div className="shrink-0 bg-white border-b border-slate-200 p-4 md:p-6 flex justify-between items-center">

      <div>

        <h2 className="text-xl md:text-2xl font-black text-slate-900">
          Заказ # {order.number}
        </h2>

        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">

          <span className="font-semibold">
            {deliveryType}
          </span>

          {orderTime && (
            <>
              <span>•</span>
              <span>{orderTime}</span>
            </>
          )}

        </p>

      </div>

      <div className="flex items-center gap-2 relative">

        <div ref={shareMenuRef} className="relative">

          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-label="Поделиться заказом"
            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <FaShare />
          </button>

          {showShareMenu && (
            <ShareMenu order={order} />
          )}

        </div>

        <button
          onClick={handleClose}
          aria-label="Закрыть детали заказа"
          className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <FaTimes />
        </button>

      </div>

    </div>

  )
}