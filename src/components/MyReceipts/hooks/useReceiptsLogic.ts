import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { deleteReceipt, syncReceiptFromServer } from "@/app/slices/receiptsSlice"
import { useToastStore } from "@/stores/toastStore"
import { useLazyGetPublicOrderStatusQuery } from "@/api"

import type { ReceiptData } from "@/types"

const TERMINAL_RECEIPT_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "failed",
  "refunded",
  "trash",
])

export const useReceiptsLogic = () => {

  const dispatch = useAppDispatch()
  const addToast = useToastStore((state) => state.addToast)
  const [getPublicOrderStatus] = useLazyGetPublicOrderStatusQuery()
  const [isStatusSyncUnavailable, setIsStatusSyncUnavailable] = useState(false)
  const isSyncUnavailableToastShown = useRef(false)
  const isMissingPublicKeyToastShown = useRef(false)

  const receipts = useAppSelector(
    (s) => s.receipts.receipts
  )

  const activeSyncTargets = useMemo(() => {
    return receipts
      .filter((receipt) => {
        const normalizedStatus = String(receipt.status || "").trim().toLowerCase()
        return !TERMINAL_RECEIPT_STATUSES.has(normalizedStatus)
      })
      .map((receipt) => ({
        orderId: Number(receipt.id),
        publicKey: String(receipt.public_key || "").trim(),
      }))
      .filter((target) => Number.isFinite(target.orderId) && target.orderId > 0 && target.publicKey.length > 0)
  }, [receipts])

  const hasActiveReceiptsWithoutPublicKey = useMemo(() => {
    return receipts.some((receipt) => {
      const normalizedStatus = String(receipt.status || "").trim().toLowerCase()
      if (TERMINAL_RECEIPT_STATUSES.has(normalizedStatus)) {
        return false
      }

      const publicKey = String(receipt.public_key || "").trim()
      return publicKey.length === 0
    })
  }, [receipts])

  const [expandedReceiptId, setExpandedReceiptId] =
    useState<number | null>(null)

  const [deleteConfirmReceiptId, setDeleteConfirmReceiptId] =
    useState<number | null>(null)

  useEffect(() => {
    if (!activeSyncTargets.length || isStatusSyncUnavailable) {
      return
    }

    let isCancelled = false

    const syncStatuses = async () => {
      for (const target of activeSyncTargets) {
        const result = await getPublicOrderStatus(target, true)

        if ("error" in result && result.error) {
          const errorInfo = result.error as { status?: unknown; error?: unknown }
          const errorText = String(errorInfo.error || "")

          if (errorInfo.status === "CUSTOM_ERROR" && errorText.includes("not configured")) {
            setIsStatusSyncUnavailable(true)

            if (!isSyncUnavailableToastShown.current) {
              isSyncUnavailableToastShown.current = true
              addToast(
                "Автообновление статуса заказа пока недоступно: не настроен публичный endpoint",
                "info",
                6000
              )
            }

            break
          }

          continue
        }

        if (isCancelled || !result.data) {
          continue
        }

        dispatch(syncReceiptFromServer(result.data))
      }
    }

    syncStatuses()

    const intervalId = window.setInterval(syncStatuses, 15000)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [activeSyncTargets, addToast, dispatch, getPublicOrderStatus, isStatusSyncUnavailable])

  useEffect(() => {
    if (!hasActiveReceiptsWithoutPublicKey || isMissingPublicKeyToastShown.current) {
      return
    }

    isMissingPublicKeyToastShown.current = true
    addToast(
      "Для некоторых старых чеков автообновление статуса недоступно: отсутствует public_key",
      "info",
      6000
    )
  }, [addToast, hasActiveReceiptsWithoutPublicKey])

  const handleDeleteReceipt = (id: number, status: string) => {
    const normalizedId = Number(id)
    const normalizedStatus = String(status || "").trim().toLowerCase()

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      addToast("Невозможно удалить заказ: некорректный ID", "error", 3500)
      return
    }

    if (!TERMINAL_RECEIPT_STATUSES.has(normalizedStatus)) {
      addToast("Можно удалить только завершенный или отмененный заказ", "info", 3500)
      return
    }

    setDeleteConfirmReceiptId((currentId) =>
      currentId === normalizedId ? null : normalizedId
    )
  }

  const confirmDeleteReceipt = (receiptId: number) => {
    const normalizedId = Number(receiptId)

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      addToast("Невозможно удалить заказ: некорректный ID", "error", 3500)
      return
    }

    dispatch(deleteReceipt(normalizedId))
    addToast(`Заказ #${normalizedId} удален`, "success", 2500)
    setDeleteConfirmReceiptId((currentId) =>
      currentId === normalizedId ? null : currentId
    )
  }

  const cancelDeleteReceipt = () => {
    setDeleteConfirmReceiptId(null)
  }

  const toggleReceiptDetails = (receipt: ReceiptData) => {
    setExpandedReceiptId((prevId) =>
      prevId === receipt.id ? null : receipt.id
    )
  }

  return {
    receipts,
    expandedReceiptId,
    deleteConfirmReceiptId,
    toggleReceiptDetails,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    handleDeleteReceipt
  }
}