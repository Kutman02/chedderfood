import { useState, useMemo } from "react"

import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation
} from "@/api"

import { filterOrders } from "@/shared/utils/utils"
import { useToastStore } from "@/stores/toastStore"
import type { OrderStatus } from "@/types"

const supportsDateFiltersByStatus = (status: string) =>
  status === "completed" || status === "cancelled"

/* =========================
   ORDERS HOOK
   Управление заказами в админ панели
   Включает фильтрацию, сортировку и обновление статуса
========================= */

export const useOrders = (
  activeTab: string,
  searchQuery: string,
  page: number,
  dateFilter: {
    mode: "today" | "all" | "day" | "range"
    date?: string
    date_from?: string
    date_to?: string
  }
) => {

  const supportsDateFilters = supportsDateFiltersByStatus(activeTab)
  const shouldPaginate = supportsDateFilters
  const ordersPerPage = shouldPaginate ? 15 : 100

  const [processingIds, setProcessingIds] =
    useState<Set<number>>(new Set())

  const [removingOrderIds, setRemovingOrderIds] =
    useState<Set<number>>(new Set())

  const [expandedConfirmation, setExpandedConfirmation] = useState<{
    orderId: number | null
    action: string | null
  }>({
    orderId: null,
    action: null
  })

  const addToast = useToastStore((state) => state.addToast)

  const [updateStatus] =
    useUpdateOrderStatusMutation()

  const buildDateParams = (allowDateFilters: boolean) => {
    if (!allowDateFilters) {
      return { scope: "all" as const }
    }

    if (dateFilter.mode === "today") {
      return { scope: "today" as const }
    }

    if (dateFilter.mode === "all") {
      return { scope: "all" as const }
    }

    if (dateFilter.mode === "day") {
      return dateFilter.date ? { date: dateFilter.date } : {}
    }

    return {
      ...(dateFilter.date_from ? { date_from: dateFilter.date_from } : {}),
      ...(dateFilter.date_to ? { date_to: dateFilter.date_to } : {}),
    }
  }

  const dateParams = buildDateParams(supportsDateFilters)

  /* =========================
     GET ORDERS
  ========================= */

  const {
    data: result,
    isLoading: ordersLoading,
    error: ordersError
  } = useGetAdminOrdersQuery({
    status: activeTab === "all" ? undefined : (activeTab as OrderStatus),
    search: searchQuery,
    page: shouldPaginate ? page : 1,
    per_page: ordersPerPage,
    ...dateParams,
    fields: "id,status,reason,changed_at,changed_by_user_id,total,customer_name,phone,address,pickup_address,pickup_map_url,pickup_2gis_url,apartment,floor,order_type,needs_cutlery,needs_napkins,line_items,status_history,meta_data,date_created",
  }, {
    pollingInterval: 1500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const countQueryOptions = {
    pollingInterval: 1500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  }

  const getCountParams = (status: OrderStatus) => ({
    page: 1,
    per_page: 1,
    status,
    ...buildDateParams(supportsDateFiltersByStatus(status)),
    fields: "id,status",
  })

  const { data: onHoldCountResult } = useGetAdminOrdersQuery(
    getCountParams("on-hold"),
    countQueryOptions
  )

  const { data: processingCountResult } = useGetAdminOrdersQuery(
    getCountParams("processing"),
    countQueryOptions
  )

  const { data: readyCountResult } = useGetAdminOrdersQuery(
    getCountParams("ready"),
    countQueryOptions
  )

  const { data: completedCountResult } = useGetAdminOrdersQuery(
    getCountParams("completed"),
    countQueryOptions
  )

  const { data: cancelledCountResult } = useGetAdminOrdersQuery(
    getCountParams("cancelled"),
    countQueryOptions
  )

  const { data: todayFilteredCountResult } = useGetAdminOrdersQuery({
    page: 1,
    per_page: 1,
    status: activeTab as OrderStatus,
    scope: "today",
    fields: "id,status",
  }, {
    ...countQueryOptions,
    skip: !supportsDateFilters,
  })

  const { data: allFilteredCountResult } = useGetAdminOrdersQuery({
    page: 1,
    per_page: 1,
    status: activeTab as OrderStatus,
    scope: "all",
    fields: "id,status",
  }, {
    ...countQueryOptions,
    skip: !supportsDateFilters,
  })

  const orders = result?.data ?? []
  const totalPages = result?.totalPages ?? 1

  /* =========================
     FILTER
  ========================= */

  const filteredOrders = useMemo(() => {
    const filtered = filterOrders(orders, searchQuery)

    if (!supportsDateFilters) {
      return [...filtered].sort((left, right) => {
        const leftDate = new Date(left.date_created).getTime()
        const rightDate = new Date(right.date_created).getTime()
        return rightDate - leftDate
      })
    }

    return filtered
  }, [orders, searchQuery, supportsDateFilters])

  /* =========================
     COUNTS (🔥 ОДИН ИСТОЧНИК)
  ========================= */

  const countsRaw = useMemo(() => {
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

  const counts = {
    "on-hold": countsRaw["on-hold"],
    processing: countsRaw.processing,
    ready: countsRaw.ready,
    completed: countsRaw.completed,
    cancelled: countsRaw.cancelled,
  }

  const filterCounts = {
    today: todayFilteredCountResult?.total ?? 0,
    all: allFilteredCountResult?.total ?? 0,
    day:
      dateFilter.mode === "day" && dateFilter.date
        ? result?.total ?? 0
        : 0,
    range:
      dateFilter.mode === "range" && (dateFilter.date_from || dateFilter.date_to)
        ? result?.total ?? 0
        : 0,
  }

  /* =========================
     UPDATE STATUS
  ========================= */

  const handleStatusUpdate = async (
    id: number,
    status: OrderStatus
  ) => {

    setProcessingIds(prev =>
      new Set(prev).add(id)
    )

    try {

      await updateStatus({ id, status }).unwrap()

      addToast(
        `Заказ #${id} → ${status}`,
        "success",
        3000
      )

      if (["processing", "ready", "completed"].includes(status)) {

        setRemovingOrderIds(prev =>
          new Set(prev).add(id)
        )

        setTimeout(() => {
          setRemovingOrderIds(prev => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        }, 600)
      }

      setExpandedConfirmation({
        orderId: null,
        action: null
      })

    } catch (error) {
      console.error("❌ Status update error:", error)
      addToast("Ошибка обновления статуса", "error", 4000)
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleConfirmAction = (
    orderId: number,
    action: string
  ) => {
    if (!action) {
      setExpandedConfirmation({
        orderId: null,
        action: null,
      })
      return
    }

    setExpandedConfirmation({
      orderId,
      action
    })
  }

  const handleConfirmStatusUpdate = async (
    orderId: number,
    status: string
  ) => {
    await handleStatusUpdate(orderId, status as OrderStatus)
  }

  return {
    orders: filteredOrders,
    supportsDateFilters,
    shouldPaginate,

    ordersLoading,
    ordersError,

    totalPages,

    counts,
    countsRaw,
    filterCounts,

    processingIds,
    removingOrderIds,

    expandedConfirmation,

    handleConfirmAction,
    handleConfirmStatusUpdate
  }
}
