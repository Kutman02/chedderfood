import { useCallback, useEffect, useRef, useState } from "react"
import { FaPhone, FaRegClock, FaShare, FaUser } from "react-icons/fa"
import { IoIosArrowDown } from "react-icons/io"

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

const PANEL_ANIMATION_MS = 320
const SHEET_SWIPE_START_ZONE = 44
const SWIPE_MIN_RELEASE_DISTANCE = 42
const SWIPE_CLOSE_THRESHOLD = 170
const SWIPE_FLICK_DISTANCE = 130
const SWIPE_VELOCITY_THRESHOLD = 1.15
const CONTENT_PULL_INTENT_THRESHOLD = 16
const CONTENT_PULL_CLOSE_DISTANCE = 240
const CONTENT_PULL_FLICK_DISTANCE = 190
const CONTENT_PULL_VELOCITY_THRESHOLD = 1.05
const CONTENT_PULL_MAX_DISTANCE = 320

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
  const modalRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const sheetDragStartYRef = useRef(0)
  const sheetDragCurrentYRef = useRef(0)
  const sheetDragStartTimeRef = useRef(0)
  const sheetIsDraggingRef = useRef(false)

  const contentTouchStartYRef = useRef(0)
  const contentTouchStartTimeRef = useRef(0)
  const contentPullDistanceRef = useRef(0)
  const contentDraggingRef = useRef(false)
  const contentTouchPulledRef = useRef(false)
  const wheelPullDistanceRef = useRef(0)
  const wheelPullResetTimerRef = useRef<number | null>(null)

  const orderNumber = order.number ?? order.id
  const shouldShowActionBar = showConfirmation || hasActionsForTab(activeTab)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
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

  const requestClose = useCallback(() => {
    if (isClosing) {
      return
    }

    setIsClosing(true)
    setIsVisible(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = window.setTimeout(() => {
      onClose()
    }, PANEL_ANIMATION_MS)
  }, [isClosing, onClose])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const modal = modalRef.current

      if (modal) {
        modal.style.transition = ""
        modal.style.transform = ""
        modal.style.opacity = ""
      }

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
        requestClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [requestClose])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }

      if (wheelPullResetTimerRef.current !== null) {
        window.clearTimeout(wheelPullResetTimerRef.current)
      }
    }
  }, [])

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

  const handleSheetTouchStart = useCallback((event: React.TouchEvent<HTMLElement>) => {
    if (isClosing) return

    const modal = modalRef.current
    if (!modal) return

    const touchY = event.touches[0].clientY
    const modalRect = modal.getBoundingClientRect()
    const relativeY = touchY - modalRect.top

    // Старт свайпа только с верхней части панели, как в клиентской модалке.
    if (relativeY <= SHEET_SWIPE_START_ZONE) {
      sheetIsDraggingRef.current = true
      sheetDragStartYRef.current = touchY
      sheetDragCurrentYRef.current = touchY
      sheetDragStartTimeRef.current = performance.now()

      modal.style.transition = "none"
      modal.style.opacity = "1"
    }
  }, [isClosing])

  const handleSheetTouchMove = useCallback((event: React.TouchEvent<HTMLElement>) => {
    if (!sheetIsDraggingRef.current || isClosing) return

    const modal = modalRef.current
    if (!modal) return

    const currentY = event.touches[0].clientY
    sheetDragCurrentYRef.current = currentY

    const deltaY = currentY - sheetDragStartYRef.current

    if (deltaY > 0) {
      if (event.cancelable) {
        event.preventDefault()
      }

      const rawOffset = Math.max(0, deltaY)
      const offset =
        rawOffset <= 120
          ? rawOffset
          : 120 + (rawOffset - 120) * 0.35

      modal.style.transform = `translateY(${offset}px)`
      modal.style.opacity = `${Math.max(0.66, 1 - offset / 760)}`
    }
  }, [isClosing])

  const handleSheetTouchEnd = useCallback(() => {
    if (!sheetIsDraggingRef.current || isClosing) return

    const modal = modalRef.current
    if (!modal) return

    const deltaY = sheetDragCurrentYRef.current - sheetDragStartYRef.current
    const elapsedMs = Math.max(1, performance.now() - sheetDragStartTimeRef.current)
    const velocity = deltaY / elapsedMs

    const isIntentionalSwipe =
      deltaY >= SWIPE_CLOSE_THRESHOLD ||
      (deltaY >= SWIPE_FLICK_DISTANCE && velocity >= SWIPE_VELOCITY_THRESHOLD)

    modal.style.transition = "transform 280ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease-out"

    if (deltaY >= SWIPE_MIN_RELEASE_DISTANCE && isIntentionalSwipe) {
      modal.style.transform = "translateY(100%)"
      modal.style.opacity = "0"
      requestClose()
    } else {
      modal.style.transform = "translateY(0)"
      modal.style.opacity = "1"
    }

    sheetIsDraggingRef.current = false
  }, [isClosing, requestClose])

  const handleContentTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    contentTouchStartYRef.current = event.touches[0].clientY
    contentTouchStartTimeRef.current = performance.now()
    contentTouchPulledRef.current = false
    contentPullDistanceRef.current = 0
    contentDraggingRef.current = false
  }, [])

  const handleContentTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (isClosing) return

    const deltaY = event.touches[0].clientY - contentTouchStartYRef.current
    const atTop = event.currentTarget.scrollTop <= 2

    if (!contentTouchPulledRef.current && atTop && deltaY > CONTENT_PULL_INTENT_THRESHOLD) {
      contentTouchPulledRef.current = true
      contentDraggingRef.current = true
    }

    if (contentDraggingRef.current && atTop && deltaY > 0) {
      if (event.cancelable) {
        event.preventDefault()
      }
      event.stopPropagation()

      const modal = modalRef.current
      if (!modal) return

      const rawOffset = Math.min(deltaY, CONTENT_PULL_MAX_DISTANCE)
      const offset =
        rawOffset <= 140
          ? rawOffset
          : 140 + (rawOffset - 140) * 0.4

      contentPullDistanceRef.current = rawOffset

      modal.style.transition = "none"
      modal.style.transform = `translateY(${offset}px)`
      modal.style.opacity = `${Math.max(0.7, 1 - offset / 700)}`
    }
  }, [isClosing])

  const handleContentTouchEnd = useCallback(() => {
    const modal = modalRef.current
    const pulledDistance = contentPullDistanceRef.current
    const elapsedMs = Math.max(1, performance.now() - contentTouchStartTimeRef.current)
    const velocity = pulledDistance / elapsedMs

    const isIntentionalPull =
      pulledDistance >= CONTENT_PULL_CLOSE_DISTANCE ||
      (pulledDistance >= CONTENT_PULL_FLICK_DISTANCE && velocity >= CONTENT_PULL_VELOCITY_THRESHOLD)

    if (contentDraggingRef.current && modal && !isClosing) {
      modal.style.transition = "transform 280ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease-out"

      if (isIntentionalPull) {
        modal.style.transform = "translateY(100%)"
        modal.style.opacity = "0"
        requestClose()
      } else {
        modal.style.transform = "translateY(0)"
        modal.style.opacity = "1"
      }
    }

    contentTouchPulledRef.current = false
    contentDraggingRef.current = false
    contentPullDistanceRef.current = 0
  }, [isClosing, requestClose])

  const handleContentWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (isClosing) {
      return
    }

    const atTop = event.currentTarget.scrollTop <= 2

    if (!atTop) {
      wheelPullDistanceRef.current = 0
      return
    }

    // Для десктопа: тянем вниз в верхней точке списка и закрываем панель.
    if (event.deltaY < -8) {
      wheelPullDistanceRef.current += Math.abs(event.deltaY)

      if (wheelPullDistanceRef.current >= CONTENT_PULL_CLOSE_DISTANCE) {
        wheelPullDistanceRef.current = 0
        requestClose()
        return
      }

      if (wheelPullResetTimerRef.current !== null) {
        window.clearTimeout(wheelPullResetTimerRef.current)
      }

      wheelPullResetTimerRef.current = window.setTimeout(() => {
        wheelPullDistanceRef.current = 0
      }, 240)
      return
    }

    if (event.deltaY > 0) {
      wheelPullDistanceRef.current = 0
    }
  }, [isClosing, requestClose])

  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      requestClose()
    }
  }, [requestClose])

  return (
    <div
      className={`fixed inset-0 z-80 flex items-end justify-center bg-transparent p-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <section
        ref={modalRef}
        onClick={(event) => {
          event.stopPropagation()
        }}
        onTouchStart={handleSheetTouchStart}
        onTouchMove={handleSheetTouchMove}
        onTouchEnd={handleSheetTouchEnd}
        className={`relative flex h-full w-full max-w-none flex-col overflow-hidden bg-transparent backdrop-blur-xl transition-[transform,opacity] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-transparent px-4 pb-2 pt-2 sm:px-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={requestClose}
              aria-label="Закрыть детали заказа"
              className="pointer-events-auto inline-flex h-12 w-24 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
            >
              <IoIosArrowDown size={30} />
            </button>
          </div>
        </header>

        <div
          className="flex-1 min-h-0 overflow-y-auto bg-white/92 px-3 py-3 overscroll-contain sm:px-5 sm:py-4"
          onTouchStart={handleContentTouchStart}
          onTouchMove={handleContentTouchMove}
          onTouchEnd={handleContentTouchEnd}
          onWheel={handleContentWheel}
        >
          <div className="min-h-full">
            <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/90 p-3 sm:p-4">
              <div className="mb-3 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Детали заказа
                </p>

                <h2 className="mt-1 truncate text-2xl font-black leading-none text-slate-900 sm:text-3xl">
                  #{orderNumber}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <div ref={shareMenuRef} className="relative inline-flex">
                  <button
                    type="button"
                    onClick={() => setShowShareMenu((prev) => !prev)}
                    aria-label="Поделиться заказом"
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <FaShare size={13} />
                    Поделиться
                  </button>

                  {showShareMenu && <ShareMenu order={order} />}
                </div>

                <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white">
                  {deliveryType}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 font-medium text-slate-700">
                  <FaRegClock size={12} />
                  {orderTime}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
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
            </div>

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
