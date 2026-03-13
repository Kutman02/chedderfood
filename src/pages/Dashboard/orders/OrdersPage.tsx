import { OrderTabs } from "../components/OrderTabs"
import { OrdersSection } from "../components/OrdersSection"
import { OrderSkeleton } from "@/components/Skeleton/components"

import { useDashboardUI } from "../hooks/useDashboardUI"
import { useOrders } from "../hooks/useOrders"

const OrdersPage = () => {

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    handleViewDetails
  } = useDashboardUI()

  const {
    orders,
    ordersLoading,
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate
  } = useOrders(activeTab, searchQuery)

  if (ordersLoading) {
    return <OrderSkeleton count={5} />
  }

  return (
    <>
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <OrdersSection
        orders={orders}
        activeTab={activeTab}
        processingIds={processingIds}
        removingOrderIds={removingOrderIds}
        expandedConfirmation={expandedConfirmation}
        onConfirmAction={handleConfirmAction}
        onStatusUpdate={handleConfirmStatusUpdate}
        onViewDetails={handleViewDetails}
      />
    </>
  )
}

export default OrdersPage