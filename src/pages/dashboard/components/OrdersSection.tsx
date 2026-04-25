import { OrderCard } from "@/components/dashboard/OrderCard/OrderCard"

import { ORDER_TABS } from "../constants/dashboard.constants"

import type { Order } from "@/types"

type Props = {
  orders: Order[]
  activeTab: string

  processingIds: Set<number>
  removingOrderIds: Set<number>

  onViewDetails: (orderId: number) => void
}

export const OrdersSection = ({
  orders,
  activeTab,

  processingIds,
  removingOrderIds,
  onViewDetails,
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
          activeTabData={activeTabData}

          isProcessing={processingIds.has(order.id)}
          isRemoving={removingOrderIds.has(order.id)}

          onViewDetails={onViewDetails}
        />

      ))}
    </div>
  )
}
