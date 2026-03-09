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
  activeTab,
  activeTabData,
  isProcessing,
  isRemoving,
  onStatusUpdate,
  onViewDetails,
  onConfirmAction,
  showConfirmation = false,
  confirmationAction = ""
}: OrderCardProps) => {
  
const getStatusFromAction = () => {
  if (confirmationAction === "принять") return "processing"
  if (confirmationAction === "завершить") return "completed"
  if (confirmationAction === "отменить") return "cancelled"
  return ""
}
  return (

    <div
      className={`bg-white rounded-2xl shadow-md border-2 ${activeTabData?.borderColor} p-5 transition-all duration-300 overflow-hidden
      ${isProcessing ? "opacity-60 pointer-events-none" : ""}
      ${isRemoving ? "animate-slide-out-up opacity-0" : ""}`}
    >

      <OrderCardHeader
        order={order}
        activeTabData={activeTabData}
      />

      <div className="space-y-3 mb-4">

        <OrderTypeBadge order={order} />

        <OrderAddress
          order={order}
          activeTabData={activeTabData}
        />

      </div>

      <button
        onClick={() => onViewDetails(order)}
        className="w-full bg-slate-100 text-slate-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors mb-4"
      >
        Просмотреть детали заказа
      </button>

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
    onCancel={() => onConfirmAction(order.id, "", "")}
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