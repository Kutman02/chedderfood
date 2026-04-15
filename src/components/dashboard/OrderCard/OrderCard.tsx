import { FaChevronDown } from "react-icons/fa"

import { OrderDetailsContent } from "@/components/dashboard/OrderDetailsModal/components"

import {
  OrderCardHeader,
  OrderTypeBadge,
  OrderAddress,
  OrderActions,
  OrderConfirmation
} from "./components"

import type { OrderCardProps } from "./types/orderCard.types"

export const OrderCard = ({
  order,
  products,
  activeTab,
  activeTabData,
  isProcessing,
  isRemoving,
  onStatusUpdate,
  isDetailsOpen,
  onToggleDetails,
  onConfirmAction,
  showConfirmation = false,
  confirmationAction = ""
}: OrderCardProps) => {

  /* ===============================
     ACTION → STATUS
  =============================== */

  const getStatusFromAction = () => {
    if (confirmationAction === "принять") return "processing"
    if (confirmationAction === "готов") return "ready"
    if (confirmationAction === "завершить") return "completed"
    if (confirmationAction === "отменить") return "cancelled"
    return ""
  }

  return (

    <div
      className={`w-full overflow-visible border-y bg-white px-4 py-4 shadow-md transition-all duration-300 sm:overflow-hidden sm:rounded-2xl sm:border-2 sm:p-5 ${activeTabData?.borderColor}
      ${isProcessing ? "opacity-60 pointer-events-none" : ""}
      ${isRemoving ? "animate-slide-out-up opacity-0" : ""}`}
    >

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
        onClick={() => onToggleDetails(order.id)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-sm font-bold text-slate-700 transition-all duration-300 ease-out hover:bg-slate-200"
      >
        <span>{isDetailsOpen ? "Скрыть детали заказа" : "Просмотреть детали заказа"}</span>
        <FaChevronDown
          size={12}
          className={`transition-transform duration-300 ease-out ${isDetailsOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDetailsOpen ? "mb-4 grid-rows-[1fr] opacity-100" : "mb-0 grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mx-0 border-t border-slate-200 bg-linear-to-b from-slate-50 to-stone-100 px-3 py-4 text-slate-900 sm:rounded-2xl sm:border sm:px-4 sm:py-4">
            <OrderDetailsContent
              order={order}
              products={products}
            />
          </div>
        </div>
      </div>

      {!showConfirmation && (
        <OrderActions
          order={order}
          activeTab={activeTab}
          onConfirmAction={onConfirmAction}
        />
      )}

      {showConfirmation && (
        <OrderConfirmation
          action={confirmationAction}

          // 🔥 FIX
          onCancel={() =>
            onConfirmAction(order.id, "")
          }

          onConfirm={() => {
            const status = getStatusFromAction()

            if (status) {
              onStatusUpdate(order.id, status)
            }
          }}
        />
      )}

    </div>
  )
}