import { useMemo } from "react"
import { useGetAdminOrdersQuery } from "@/api"
import { filterOrders } from "@/shared/utils/utils"
import type { OrderStatus } from "@/types"
import {
  buildDateParams,
  normalizeOrderStatus,
  ORDERS_LIST_FIELDS,
  supportsDateFiltersByStatus,
} from "./shared"
import type { OrdersDateFilter } from "./types"

type UseOrdersQueryParams = {
  activeTab: string
  searchQuery: string
  page: number
  dateFilter: OrdersDateFilter
}

export const useOrdersQuery = ({
  activeTab,
  searchQuery,
  page,
  dateFilter,
}: UseOrdersQueryParams) => {
  const supportsDateFilters = supportsDateFiltersByStatus(activeTab)
  const shouldPaginate = supportsDateFilters
  const ordersPerPage = shouldPaginate ? 15 : 100

  const dateParams = buildDateParams(dateFilter, supportsDateFilters)

  const {
    data: result,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    error: ordersError,
  } = useGetAdminOrdersQuery(
    {
      status: activeTab === "all" ? undefined : (activeTab as OrderStatus),
      search: searchQuery,
      page: shouldPaginate ? page : 1,
      per_page: ordersPerPage,
      ...dateParams,
      fields: ORDERS_LIST_FIELDS,
    },
    {
      pollingInterval: 1500,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const orders = result?.data ?? []
  const totalPages = result?.totalPages ?? 1

  const filteredOrders = useMemo(() => {
    const statusScopedOrders =
      activeTab === "all"
        ? orders
        : orders.filter(
            (order) => normalizeOrderStatus(order.status) === activeTab
          )

    const filtered = filterOrders(statusScopedOrders, searchQuery)

    if (!supportsDateFilters) {
      return [...filtered].sort((left, right) => {
        const leftDate = new Date(left.date_created).getTime()
        const rightDate = new Date(right.date_created).getTime()
        return rightDate - leftDate
      })
    }

    return filtered
  }, [activeTab, orders, searchQuery, supportsDateFilters])

  return {
    supportsDateFilters,
    shouldPaginate,
    orders: filteredOrders,
    ordersLoading,
    ordersFetching,
    ordersError,
    totalPages,
    resultTotal: result?.total,
  }
}
