import { useState, useMemo } from "react"

import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation
} from "@/api"

import { filterOrders } from "@/shared/utils/utils"
import { useToastStore } from "@/stores/toastStore"
import type { OrderStatus } from "@/types"

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

  const dateParams = (() => {
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
  })()

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
    page,
    per_page: 15,
    ...dateParams,
    fields: "id,status,reason,changed_at,changed_by_user_id,total,customer_name,phone,address,pickup_address,pickup_map_url,pickup_2gis_url,apartment,floor,order_type,needs_cutlery,needs_napkins,line_items,status_history,meta_data,date_created",
  }, {
    pollingInterval: 1500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const {
    data: countsResult,
  } = useGetAdminOrdersQuery({
    page: 1,
    per_page: 1,
    ...dateParams,
    fields: "id,status",
  }, {
    pollingInterval: 1500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const orders = result?.data ?? []
  const totalPages = result?.totalPages ?? 1

  /* =========================
     FILTER
  ========================= */

  const filteredOrders = useMemo(() => {
    return filterOrders(orders, searchQuery)
  }, [orders, searchQuery])

  /* =========================
     COUNTS (🔥 ОДИН ИСТОЧНИК)
  ========================= */

  const countsRaw = useMemo(() => {
    const map: Record<"on-hold" | "processing" | "ready" | "completed" | "cancelled", number> = {
      "on-hold": 0,
      processing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    }

    const sourceCounts =
      dateFilter.mode === "today"
        ? countsResult?.status_counts_today ?? countsResult?.status_counts_range
        : countsResult?.status_counts_range ?? countsResult?.status_counts_today

    if (sourceCounts) {
      return {
        "on-hold": sourceCounts["on-hold"] ?? 0,
        processing: sourceCounts.processing ?? 0,
        ready: sourceCounts.ready ?? 0,
        completed: sourceCounts.completed ?? 0,
        cancelled: sourceCounts.cancelled ?? 0,
      }
    }

    orders.forEach(order => {
      if (map[order.status as OrderStatus] !== undefined) {
        map[order.status as OrderStatus]++
      }
    })

    return map

  }, [countsResult?.status_counts_range, countsResult?.status_counts_today, dateFilter.mode, orders])

  const formatCount = (count: number) => {
    return count >= 15 ? "15+" : count
  }

  const counts = {
    "on-hold": formatCount(countsRaw["on-hold"]),
    processing: formatCount(countsRaw.processing),
    ready: formatCount(countsRaw.ready),
    completed: formatCount(countsRaw.completed),
    cancelled: formatCount(countsRaw.cancelled)
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

    ordersLoading,
    ordersError,

    totalPages,

    counts,
    countsRaw,

    processingIds,
    removingOrderIds,

    expandedConfirmation,

    handleConfirmAction,
    handleConfirmStatusUpdate
  }
}
