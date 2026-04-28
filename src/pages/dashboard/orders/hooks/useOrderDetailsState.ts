import { useMemo } from "react"
import { useGetAdminOrdersQuery } from "@/api"
import type { Order, OrderStatus } from "@/types"
import { ORDER_DETAILS_FIELDS } from "../orders.constants"
import { normalizeOrderStatus } from "../orders.utils"

type UseOrderDetailsStateArgs = {
  routeOrderId: number | null
  orders: Order[]
  activeTab: OrderStatus
  ordersLoading: boolean
}

export const useOrderDetailsState = ({
  routeOrderId,
  orders,
  activeTab,
  ordersLoading,
}: UseOrderDetailsStateArgs) => {
  const hasOrderInList = useMemo(
    () => routeOrderId !== null && orders.some((order) => order.id === routeOrderId),
    [orders, routeOrderId]
  )

  const orderLookupParams = routeOrderId !== null
    ? {
        page: 1,
        per_page: 1,
        search: String(routeOrderId),
        scope: "all" as const,
        fields: ORDER_DETAILS_FIELDS,
      }
    : undefined

  const { data: orderLookupResponse, isFetching: orderLookupFetching } =
    useGetAdminOrdersQuery(orderLookupParams, {
      skip: routeOrderId === null || hasOrderInList,
    })

  const lookupOrder = useMemo(() => {
    if (routeOrderId === null) {
      return null
    }

    return (
      orderLookupResponse?.data?.find((order) => order.id === routeOrderId) ??
      null
    )
  }, [orderLookupResponse?.data, routeOrderId])

  const selectedOrder = useMemo(() => {
    if (routeOrderId === null) return null
    return orders.find((order) => order.id === routeOrderId) ?? lookupOrder
  }, [lookupOrder, orders, routeOrderId])

  const detailsTab = useMemo(() => {
    if (!selectedOrder) return activeTab
    return normalizeOrderStatus(selectedOrder.status)
  }, [activeTab, selectedOrder])

  const isDetailsOpen = routeOrderId !== null
  const isDetailsLoading =
    isDetailsOpen && !selectedOrder && (ordersLoading || orderLookupFetching)

  return {
    selectedOrder,
    detailsTab,
    isDetailsOpen,
    isDetailsLoading,
  }
}
