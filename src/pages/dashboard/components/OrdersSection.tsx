import { OrderCard } from "@/components/dashboard/OrderCard/OrderCard"

import { ORDER_TABS } from "../constants/dashboard.constants"

import type { Order, Product } from "@/types"

type Props = {
  orders: Order[]
  products: Product[]
  activeTab: string

  processingIds: Set<number>
  removingOrderIds: Set<number>

  expandedConfirmation: {
    orderId: number | null
    action: string | null
  }

  onConfirmAction: (orderId: number, action: string) => void
  onStatusUpdate: (orderId: number, status: string) => void

  expandedDetailsOrderId: number | null
  onToggleDetails: (orderId: number) => void
}

export const OrdersSection = ({
  orders,
  products,
  activeTab,

  processingIds,
  removingOrderIds,

  expandedConfirmation,

  onConfirmAction,
  onStatusUpdate,

  expandedDetailsOrderId,
  onToggleDetails,
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
    <div className="-mx-4 space-y-3 sm:mx-0">
      {orders.map(order => (

        <OrderCard
          key={order.id}

          order={order}
          products={products}

          activeTab={activeTab}
          activeTabData={activeTabData}

          isProcessing={processingIds.has(order.id)}
          isRemoving={removingOrderIds.has(order.id)}

          onStatusUpdate={(id, status) =>
            onStatusUpdate(id, status)
          }

          isDetailsOpen={expandedDetailsOrderId === order.id}
          onToggleDetails={onToggleDetails}

          onConfirmAction={onConfirmAction}

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
    </div>
  )
}
