import { OrderCard } from "@/components/dashboard/OrderCard/OrderCard"

import { ORDER_TABS } from "../constants/dashboard.constants"

import type { Order } from "@/types"

type Props = {
  orders: Order[]
  activeTab: string

  processingIds: Set<number>
  removingOrderIds: Set<number>

  expandedConfirmation: {
    orderId: number | null
    action: string | null
  }

  onConfirmAction: (orderId: number, action: string) => void
  onStatusUpdate: (orderId: number, status: string) => void

  onViewDetails: (order: Order) => void
}

export const OrdersSection = ({
  orders,
  activeTab,

  processingIds,
  removingOrderIds,

  expandedConfirmation,

  onConfirmAction,
  onStatusUpdate,

  onViewDetails
}: Props) => {

  const activeTabData = ORDER_TABS.find(t => t.id === activeTab)

  if (orders.length === 0) {
    return (
      <p className="text-center py-10 text-slate-500">
        Заказы не найдены
      </p>
    )
  }

  return (
    <>
      {orders.map(order => (

        <OrderCard
          key={order.id}

          order={order}

          activeTab={activeTab}
          activeTabData={activeTabData}

          isProcessing={processingIds.has(order.id)}
          isRemoving={removingOrderIds.has(order.id)}

          onStatusUpdate={(id, status) =>
            onStatusUpdate(id, status)
          }

          onViewDetails={onViewDetails}

          onConfirmAction={(orderId, _status, action) =>
            onConfirmAction(orderId, action)
          }

          showConfirmation={
            expandedConfirmation.orderId === order.id
          }

          confirmationAction={
            expandedConfirmation.orderId === order.id
              ? expandedConfirmation.action || ""
              : ""
          }
        />

      ))}
    </>
  )
}