import { useState } from "react"
import { useUpdateOrderStatusMutation } from "@/api"
import { useToastStore } from "@/stores/toastStore"
import type { OrderStatus } from "@/types"

export const useOrderStatusActions = () => {
  const [processingIds, setProcessingIds] =
    useState<Set<number>>(new Set())

  const [removingOrderIds, setRemovingOrderIds] =
    useState<Set<number>>(new Set())

  const [expandedConfirmation, setExpandedConfirmation] = useState<{
    orderId: number | null
    action: string | null
  }>({
    orderId: null,
    action: null,
  })

  const addToast = useToastStore((state) => state.addToast)

  const [updateStatus] =
    useUpdateOrderStatusMutation()

  const handleStatusUpdate = async (
    id: number,
    status: OrderStatus
  ) => {
    setProcessingIds((prev) =>
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
        setRemovingOrderIds((prev) =>
          new Set(prev).add(id)
        )

        setTimeout(() => {
          setRemovingOrderIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        }, 600)
      }

      setExpandedConfirmation({
        orderId: null,
        action: null,
      })
    } catch (error) {
      console.error("❌ Status update error:", error)
      addToast("Ошибка обновления статуса", "error", 4000)
    } finally {
      setProcessingIds((prev) => {
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
      action,
    })
  }

  const handleConfirmStatusUpdate = async (
    orderId: number,
    status: string
  ) => {
    await handleStatusUpdate(orderId, status as OrderStatus)
  }

  return {
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate,
  }
}
