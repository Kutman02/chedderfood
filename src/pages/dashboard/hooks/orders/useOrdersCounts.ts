import { useMemo } from "react"
import { useGetAdminOrdersQuery } from "@/api"
import type { OrderStatus } from "@/types"
import {
  buildDateParams,
  COUNT_QUERY_OPTIONS,
  ORDERS_COUNT_FIELDS,
  supportsDateFiltersByStatus,
} from "./shared"
import type {
  OrdersCounts,
  OrdersCountsRaw,
  OrdersDateFilter,
  OrdersFilterCounts,
} from "./types"

type UseOrdersCountsParams = {
  activeTab: string
  dateFilter: OrdersDateFilter
  supportsDateFilters: boolean
  resultTotal?: number
}

export const useOrdersCounts = ({
  activeTab,
  dateFilter,
  supportsDateFilters,
  resultTotal,
}: UseOrdersCountsParams) => {
  const getCountParams = (status: OrderStatus) => ({
    page: 1,
    per_page: 1,
    status,
    ...buildDateParams(dateFilter, supportsDateFiltersByStatus(status)),
    fields: ORDERS_COUNT_FIELDS,
  })

  const { data: onHoldCountResult } = useGetAdminOrdersQuery(
    getCountParams("on-hold"),
    COUNT_QUERY_OPTIONS
  )

  const { data: processingCountResult } = useGetAdminOrdersQuery(
    getCountParams("processing"),
    COUNT_QUERY_OPTIONS
  )

  const { data: readyCountResult } = useGetAdminOrdersQuery(
    getCountParams("ready"),
    COUNT_QUERY_OPTIONS
  )

  const { data: completedCountResult } = useGetAdminOrdersQuery(
    getCountParams("completed"),
    COUNT_QUERY_OPTIONS
  )

  const { data: cancelledCountResult } = useGetAdminOrdersQuery(
    getCountParams("cancelled"),
    COUNT_QUERY_OPTIONS
  )

  const { data: todayFilteredCountResult } = useGetAdminOrdersQuery(
    {
      page: 1,
      per_page: 1,
      status: activeTab as OrderStatus,
      scope: "today",
      fields: ORDERS_COUNT_FIELDS,
    },
    {
      ...COUNT_QUERY_OPTIONS,
      skip: !supportsDateFilters,
    }
  )

  const { data: allFilteredCountResult } = useGetAdminOrdersQuery(
    {
      page: 1,
      per_page: 1,
      status: activeTab as OrderStatus,
      scope: "all",
      fields: ORDERS_COUNT_FIELDS,
    },
    {
      ...COUNT_QUERY_OPTIONS,
      skip: !supportsDateFilters,
    }
  )

  const countsRaw = useMemo<OrdersCountsRaw>(() => {
    return {
      "on-hold": onHoldCountResult?.total ?? 0,
      processing: processingCountResult?.total ?? 0,
      ready: readyCountResult?.total ?? 0,
      completed: completedCountResult?.total ?? 0,
      cancelled: cancelledCountResult?.total ?? 0,
    }
  }, [
    cancelledCountResult?.total,
    completedCountResult?.total,
    onHoldCountResult?.total,
    processingCountResult?.total,
    readyCountResult?.total,
  ])

  const counts: OrdersCounts = {
    "on-hold": countsRaw["on-hold"],
    processing: countsRaw.processing,
    ready: countsRaw.ready,
    completed: countsRaw.completed,
    cancelled: countsRaw.cancelled,
  }

  const activeTabTotal =
    activeTab in countsRaw
      ? countsRaw[activeTab as keyof OrdersCountsRaw]
      : 0

  const filterCounts: OrdersFilterCounts = {
    today: todayFilteredCountResult?.total ?? 0,
    all: allFilteredCountResult?.total ?? 0,
    day:
      dateFilter.mode === "day" && dateFilter.date
        ? resultTotal ?? 0
        : 0,
    range:
      dateFilter.mode === "range" && (dateFilter.date_from || dateFilter.date_to)
        ? resultTotal ?? 0
        : 0,
  }

  return {
    counts,
    countsRaw,
    activeTabTotal,
    filterCounts,
  }
}
