import { FaChevronRight, FaSpinner } from "react-icons/fa"

import {
  OrderCardHeader,
  OrderTypeBadge,
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

  return (

    <div
      className={`relative w-full overflow-visible border-y bg-white px-4 py-4 shadow-md transition-all duration-300 sm:overflow-hidden sm:rounded-2xl sm:border-2 sm:p-5 ${activeTabData?.borderColor}
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

      <div className="mb-4 space-y-3">

        <OrderTypeBadge order={order} />

        <OrderAddress
          order={order}
          activeTabData={activeTabData}
        />

      </div>

      {/* 🔥 ВАЖНО: передаём как есть (уже нормализован) */}
      <button
        type="button"
        onClick={() => onViewDetails(order.id)}
        className="group mb-4 flex min-h-14 w-full touch-manipulation select-none items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-700 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 active:translate-y-0 active:scale-[0.99] sm:min-h-12 sm:py-2 sm:text-sm"
      >
        <span>Посмотреть</span>
        <FaChevronRight
          size={14}
          className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-orange-600"
        />
      </button>

    </div>
  )
}