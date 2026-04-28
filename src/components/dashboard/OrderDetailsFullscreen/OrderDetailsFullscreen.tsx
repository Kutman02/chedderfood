import { useEffect, useRef, useState } from "react"
import { FaPhone, FaRegClock, FaShare, FaTimes, FaUser } from "react-icons/fa"

import type { Order, OrderStatus, Product } from "@/types"

import {
  OrderDetailsContent,
  ShareMenu,
} from "@/components/dashboard/OrderDetailsModal/components"

import {
  OrderActions,
  OrderConfirmation,
  getStatusFromAction,
} from "@/components/dashboard/OrderCard/components"

type Props = {
  order: Order
  products: Product[]
  activeTab: OrderStatus
  isProcessing: boolean
  showConfirmation: boolean
  confirmationAction: string
  onConfirmAction: (orderId: number, action: string) => void
  onStatusUpdate: (orderId: number, status: string) => void
  onClose: () => void
}

const hasActionsForTab = (tab: OrderStatus) =>
  tab === "on-hold" || tab === "processing" || tab === "ready"

const getOrderTime = (dateValue?: string) => {
  if (!dateValue) {
    return "--:--"
  }

  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return "--:--"
  }

  return parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const OrderDetailsFullscreen = ({
  order,
  products,
  activeTab,
  isProcessing,
  showConfirmation,
  confirmationAction,
  onConfirmAction,
  onStatusUpdate,
  onClose,
}: Props) => {
  const orderNumber = order.number ?? order.id
  const shouldShowActionBar = showConfirmation || hasActionsForTab(activeTab)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const orderTypeValue = (order.order_type || "").trim().toLowerCase()
  const isPickup =
    orderTypeValue === "pickup" ||
    orderTypeValue === "local_pickup" ||
    orderTypeValue.includes("самовывоз") ||
    Boolean(order.pickup_address)
  const deliveryType = isPickup ? "Самовывоз" : "Доставка"
  const customerName = order.customer_name?.trim() || "Клиент"
  const phone = order.phone?.trim() || ""
  const orderTime = getOrderTime(order.date_created)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!showShareMenu) {
      return
    }

    const handleClickOutsideShareMenu = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutsideShareMenu)

    return () => {
      window.removeEventListener("mousedown", handleClickOutsideShareMenu)
    }
  }, [showShareMenu])

  return (
    <div
      className="fixed inset-0 z-80 flex items-stretch justify-center bg-slate-950/50 p-2 backdrop-blur-sm sm:p-4 lg:p-6"
      onClick={onClose}
    >
      <section
        onClick={(event) => {
          event.stopPropagation()
        }}
        className={`relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/45 bg-white/85 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.85)] backdrop-blur-xl transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <header className="shrink-0 border-b border-slate-200/80 bg-white/70 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-3 sm:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Детали заказа
              </p>

              <h2 className="mt-1 truncate text-2xl font-black leading-none text-slate-900 sm:text-3xl">
                #{orderNumber}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white">
                  {deliveryType}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 font-medium text-slate-700">
                  <FaRegClock size={12} />
                  {orderTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div ref={shareMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowShareMenu((prev) => !prev)}
                  aria-label="Поделиться заказом"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/95 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <FaShare />
                </button>

                {showShareMenu && <ShareMenu order={order} />}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть детали заказа"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/95 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/85 px-3 py-2 text-slate-700">
              <FaUser className="shrink-0 text-slate-500" size={13} />
              <span className="truncate">
                <span className="font-semibold text-slate-800">Клиент:</span>{" "}
                {customerName}
              </span>
            </div>

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50/90 px-3 py-2 font-semibold text-orange-700 transition-colors hover:bg-orange-100"
              >
                <FaPhone size={12} />
                {phone}
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/85 px-3 py-2 text-slate-500">
                <FaPhone size={12} />
                Номер не указан
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
          <div className="h-full overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-inner sm:px-5 sm:py-4">
            <OrderDetailsContent order={order} products={products} />
          </div>
        </div>

        {shouldShowActionBar && (
          <footer
            className={`shrink-0 border-t border-slate-200/80 bg-white/80 px-3 py-3 backdrop-blur sm:px-5 sm:py-4 ${
              isProcessing ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {showConfirmation ? (
              <OrderConfirmation
                action={confirmationAction}
                orderNumber={orderNumber}
                isProcessing={isProcessing}
                compact
                onCancel={() => onConfirmAction(order.id, "")}
                onConfirm={() => {
                  const status = getStatusFromAction(confirmationAction)

                  if (status) {
                    onStatusUpdate(order.id, status)
                  }
                }}
              />
            ) : (
              <OrderActions
                order={order}
                activeTab={activeTab}
                onConfirmAction={onConfirmAction}
              />
            )}
          </footer>
        )}
      </section>
    </div>
  )
}
