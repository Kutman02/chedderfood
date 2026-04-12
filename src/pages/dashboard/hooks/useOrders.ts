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
  page: number
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

    orders.forEach(order => {
      if (map[order.status as OrderStatus] !== undefined) {
        map[order.status as OrderStatus]++
      }
    })

    return map

  }, [orders])

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
