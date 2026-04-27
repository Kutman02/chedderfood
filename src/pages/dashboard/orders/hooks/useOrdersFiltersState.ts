import { useEffect, useMemo, useState } from "react"
import type { OrderStatus } from "@/types"
import type { OrdersDateMode } from "../orders.types"
import { buildDateFilter, supportsDateFilters as supportsDateFiltersByStatus } from "../orders.utils"

type UseOrdersFiltersStateArgs = {
  activeTab: OrderStatus
  searchQuery: string
}

export const useOrdersFiltersState = ({
  activeTab,
  searchQuery,
}: UseOrdersFiltersStateArgs) => {
  const [page, setPage] = useState(1)
  const [dateMode, setDateMode] = useState<OrdersDateMode>("today")
  const [selectedDate, setSelectedDate] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const supportsDateFilters = supportsDateFiltersByStatus(activeTab)

  const dateFilter = useMemo(
    () =>
      buildDateFilter(
        supportsDateFilters,
        dateMode,
        selectedDate,
        dateFrom,
        dateTo
      ),
    [dateFrom, dateMode, dateTo, selectedDate, supportsDateFilters]
  )

  useEffect(() => {
    setPage(1)
  }, [activeTab, dateFilter, searchQuery])

  return {
    page,
    setPage,

    dateMode,
    setDateMode,
    selectedDate,
    setSelectedDate,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,

    supportsDateFilters,
    dateFilter,
  }
}
