import { FaSpinner } from "react-icons/fa"

import {
  OrderCardHeader,
  OrderAddress
} from "./components"

import type { OrderCardProps } from "./types/orderCard.types"

export const OrderCard = ({
  order,
  activeTabData,
  isProcessing,
  isRemoving,
  onViewDetails
}: OrderCardProps) => {

  const shouldIgnoreCardActivation = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return false
    }

    return Boolean(target.closest("a, button, input, textarea, select, label, [data-order-card-interactive='true']"))
  }

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldIgnoreCardActivation(event.target)) {
      return
    }

    onViewDetails(order.id)
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }

    if (shouldIgnoreCardActivation(event.target)) {
      return
    }

    if (event.key === " ") {
      event.preventDefault()
    }

    onViewDetails(order.id)
  }

  return (

    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`Открыть заказ #${order.number ?? order.id}`}
      className={`relative w-full overflow-visible border-y bg-white px-4 py-4 shadow-md transition-all duration-300 sm:overflow-hidden sm:rounded-2xl sm:border-2 sm:p-5 ${activeTabData?.borderColor}
      hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300
      ${isProcessing ? "opacity-75 pointer-events-none" : ""}
      ${isRemoving ? "animate-slide-out-up opacity-0" : ""}`}
    >

      {isProcessing && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/65 backdrop-blur-[1px]">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <FaSpinner className="animate-spin text-orange-500" />
            Загузка...
          </div>
        </div>
      )}

      <OrderCardHeader
        order={order}
        activeTabData={activeTabData}
      />

      <div className="mb-4">
        <OrderAddress
          order={order}
        />
      </div>

    </div>
  )
}