import { useState } from "react"

import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation
} from "@/api"

import { filterOrders } from "../../../utils/utils"

type OrderStatus =
  | "on-hold"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled"

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

  const [updateStatus] =
    useUpdateOrderStatusMutation()

  // ✅ ОСНОВНОЙ ЗАПРОС
  const {
    data: ordersData = [],
    isLoading: ordersLoading,
    error: ordersError
  } = useGetOrdersQuery(
    {
      status: activeTab === "all" ? undefined : activeTab,
      search: searchQuery,
      page,
      per_page: 15,            // ✅ последние 15
      orderby: "date",         // ✅ сортировка
      order: "desc"
    },
    {
      pollingInterval: activeTab === "on-hold" ? 15000 : 0
    }
  )

  /**
   * ✅ Фильтрация (только поиск, статус уже с API)
   */
  const orders = filterOrders(ordersData, searchQuery)

  /**
   * ⚠️ Счётчики (пока по текущей странице)
   */
  const counts: Record<OrderStatus, number> = {
    "on-hold": 0,
    processing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0
  }

  ordersData.forEach(order => {
    const status = order.status as OrderStatus

    if (counts[status] !== undefined) {
      counts[status]++
    }
  })

  /**
   * 🔄 Обновление статуса
   */
  const handleStatusUpdate = async (
    id: number,
    status: string
  ) => {

    setProcessingIds(prev =>
      new Set(prev).add(id)
    )

    try {

      await updateStatus({
        id,
        status
      }).unwrap()

      if (
        ["processing", "ready", "completed"]
          .includes(status)
      ) {

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

    } catch {

      alert("Ошибка обновления")

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
    await handleStatusUpdate(orderId, status)
  }

  return {
    orders,
    ordersLoading,
    ordersError,

    counts,

    processingIds,
    removingOrderIds,

    expandedConfirmation,

    handleConfirmAction,
    handleConfirmStatusUpdate
  }
}