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

  // =========================
  // 🔥 ОСНОВНОЙ СПИСОК (ОБНОВЛЁН)
  // =========================
  const {
    data: result,
    isLoading: ordersLoading,
    error: ordersError
  } = useGetOrdersQuery(
    {
      status: activeTab === "all" ? undefined : activeTab,
      search: searchQuery,
      page,
      per_page: 15,
      orderby: "date",
      order: "desc"
    },
    {
      pollingInterval: activeTab === "on-hold" ? 15000 : 0
    }
  )

  const ordersData = result?.data ?? []
  const totalPages = result?.totalPages ?? 1

  const orders = filterOrders(ordersData, searchQuery)

  // =========================
  // 🔥 COUNTS (ТОЖЕ ОБНОВЛЁН)
  // =========================
  const { data: onHoldRes } = useGetOrdersQuery({ status: "on-hold", per_page: 15 })
  const { data: processingRes } = useGetOrdersQuery({ status: "processing", per_page: 15 })
  const { data: readyRes } = useGetOrdersQuery({ status: "ready", per_page: 15 })
  const { data: completedRes } = useGetOrdersQuery({ status: "completed", per_page: 15 })
  const { data: cancelledRes } = useGetOrdersQuery({ status: "cancelled", per_page: 15 })

  const onHold = onHoldRes?.data ?? []
  const processing = processingRes?.data ?? []
  const ready = readyRes?.data ?? []
  const completed = completedRes?.data ?? []
  const cancelled = cancelledRes?.data ?? []

  // =========================
  // 🔥 RAW COUNTS
  // =========================
  const countsRaw: Record<OrderStatus, number> = {
    "on-hold": onHold.length,
    processing: processing.length,
    ready: ready.length,
    completed: completed.length,
    cancelled: cancelled.length
  }

  // =========================
  // 🔥 UI COUNTS (15+)
  // =========================
  const formatCount = (count: number) => {
    return count >= 15 ? "15+" : count
  }

  const counts: Record<OrderStatus, number | string> = {
    "on-hold": formatCount(onHold.length),
    processing: formatCount(processing.length),
    ready: formatCount(ready.length),
    completed: formatCount(completed.length),
    cancelled: formatCount(cancelled.length)
  }

  // =========================
  // 🔄 ОБНОВЛЕНИЕ СТАТУСА
  // =========================
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

    totalPages, // 🔥 ВАЖНО для pagination

    counts,
    countsRaw,

    processingIds,
    removingOrderIds,

    expandedConfirmation,

    handleConfirmAction,
    handleConfirmStatusUpdate
  }
}