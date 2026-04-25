import { useEffect, useMemo, useRef, useState } from "react"
import { FaPhone } from "react-icons/fa"

import type { Order, OrderStatus, Product } from "@/types"

import {
  OrderDetailsContent,
  OrderDetailsHeader,
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

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

const parseDateTimestamp = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000
  }

  if (typeof value !== "string") {
    return null
  }

  const raw = value.trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) {
    const numeric = Number(raw)
    if (Number.isFinite(numeric)) {
      return numeric > 1e12 ? numeric : numeric * 1000
    }
  }

  const directParsed = Date.parse(raw)
  if (!Number.isNaN(directParsed)) {
    return directParsed
  }

  const normalized = raw.replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2")
  const normalizedParsed = Date.parse(normalized)

  if (!Number.isNaN(normalizedParsed)) {
    return normalizedParsed
  }

  return null
}

const resolveCreatedTimestamp = (order: any): number | null => {
  const firstHistoryDate = Array.isArray(order?.status_history)
    ? order.status_history
        .map((entry: any) => entry?.changed_at)
        .find((value: unknown) => typeof value === "string" && value.trim().length > 0)
    : null

  const candidates: unknown[] = [
    order?.date_created_unix,
    order?.date_created,
    order?.date_created_gmt,
    order?.created_at,
    order?.changed_at,
    firstHistoryDate,
  ]

  for (const candidate of candidates) {
    const timestamp = parseDateTimestamp(candidate)
    if (timestamp !== null) {
      return timestamp
    }
  }

  return null
}

const hasActionsForTab = (tab: OrderStatus) =>
  tab === "on-hold" || tab === "processing" || tab === "ready"

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
  const customerName = order.customer_name || "Клиент"
  const phone = order.phone || ""
  const createdTimestamp = useMemo(
    () => resolveCreatedTimestamp(order as any),
    [
      order?.date_created_unix,
      order?.date_created,
      order?.date_created_gmt,
      order?.created_at,
      order?.changed_at,
      order?.date_created_human,
      order?.status_history,
    ]
  )
  const isCompletedOrder = order.status === "completed" || order.status === "cancelled"
  const createdTime = createdTimestamp === null
    ? "--:--"
    : timeFormatter.format(new Date(createdTimestamp))
  const elapsedFromBackend =
    typeof order.date_created_human === "string" && order.date_created_human.trim()
      ? order.date_created_human.trim()
      : null
  const elapsed = isCompletedOrder ? null : elapsedFromBackend

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      className={`relative flex h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <OrderDetailsHeader
        order={order}
        onClose={onClose}
        showShareMenu={showShareMenu}
        setShowShareMenu={setShowShareMenu}
        shareMenuRef={shareMenuRef}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Клиент
              </p>
              <h3 className="mt-1 truncate text-xl font-black text-slate-950">
                {customerName}
              </h3>
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="mt-2 inline-flex items-center gap-2 break-all text-base font-bold text-orange-600"
                >
                  <FaPhone size={12} />
                  {phone}
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-400">Нет номера</p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Заказ пришёл
              </p>
              <p className="mt-1 text-base font-black text-slate-700">
                {createdTime}
                {elapsed ? ` • ${elapsed}` : ""}
              </p>
            </div>
          </div>
        </div>

        <OrderDetailsContent order={order} products={products} />
      </div>

      {shouldShowActionBar && (
        <div
          className={`shrink-0 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 ${
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
        </div>
      )}
    </section>
  )
}
