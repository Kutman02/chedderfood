import { useOrderStatusActions } from "./orders/useOrderStatusActions"
import { useOrdersCounts } from "./orders/useOrdersCounts"
import { useOrdersQuery } from "./orders/useOrdersQuery"
import type { OrdersDateFilter } from "./orders/types"

/* =========================
   ORDERS HOOK
   Управление заказами в админ панели
   Включает фильтрацию, сортировку и обновление статуса
========================= */

export const useOrders = (
  activeTab: string,
  searchQuery: string,
  page: number,
  dateFilter: OrdersDateFilter
) => {
  const query = useOrdersQuery({
    activeTab,
    searchQuery,
    page,
    dateFilter,
  })

  const countsData = useOrdersCounts({
    activeTab,
    dateFilter,
    supportsDateFilters: query.supportsDateFilters,
    resultTotal: query.resultTotal,
  })

  const actions = useOrderStatusActions()

  return {
    orders: query.orders,
    supportsDateFilters: query.supportsDateFilters,
    shouldPaginate: query.shouldPaginate,

    ordersLoading: query.ordersLoading,
    ordersFetching: query.ordersFetching,
    ordersError: query.ordersError,

    totalPages: query.totalPages,
    foundTotal: query.resultTotal ?? query.orders.length,
    activeTabTotal: countsData.activeTabTotal,

    counts: countsData.counts,
    countsRaw: countsData.countsRaw,
    filterCounts: countsData.filterCounts,

    processingIds: actions.processingIds,
    removingOrderIds: actions.removingOrderIds,

    expandedConfirmation: actions.expandedConfirmation,

    handleConfirmAction: actions.handleConfirmAction,
    handleConfirmStatusUpdate: actions.handleConfirmStatusUpdate,
  }
}
