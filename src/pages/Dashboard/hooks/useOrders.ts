import { useState } from "react"

import {
  useGetWooOrdersQuery,
  useUpdateWooOrderStatusMutation
} from "../../../app/services/wooCommerceApi"

import { filterOrders } from "../../../utils/utils"

export const useOrders = (
  activeTab: string,
  searchQuery: string
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
    useUpdateWooOrderStatusMutation()

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError
  } = useGetWooOrdersQuery(
    {
      status: activeTab,
      per_page: 100
    },
    {
      pollingInterval: 15000
    }
  )

  const orders =
    filterOrders(ordersData, searchQuery)

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

    processingIds,
    removingOrderIds,

    expandedConfirmation,

    handleConfirmAction,
    handleConfirmStatusUpdate

  }

}