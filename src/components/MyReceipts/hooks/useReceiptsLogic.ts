import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  deleteReceipt,
  setActiveReceiptId,
  syncReceiptFromServer,
} from "@/app/slices/receiptsSlice"
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
  const [searchParams, setSearchParams] = useSearchParams()
  const addToast = useToastStore((state) => state.addToast)
  const [getPublicOrderStatus] = useLazyGetPublicOrderStatusQuery()
  const [isStatusSyncUnavailable, setIsStatusSyncUnavailable] = useState(false)
  const isSyncUnavailableToastShown = useRef(false)
  const isMissingPublicKeyToastShown = useRef(false)

  const receipts = useAppSelector(
    (s) => s.receipts.receipts
  )

  const activeReceiptId = useAppSelector(
    (s) => s.receipts.activeReceiptId
  )

  const activeReceiptIdRef = useRef<number | null>(activeReceiptId)

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

  const [deleteConfirmReceiptId, setDeleteConfirmReceiptId] =
    useState<number | null>(null)

  const queryReceiptId = useMemo(() => {
    const raw = searchParams.get("order")
    if (!raw) return null

    const normalizedId = Number(raw)
    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      return null
    }

    return normalizedId
  }, [searchParams])

  const expandedReceiptId = activeReceiptId

  useEffect(() => {
    activeReceiptIdRef.current = activeReceiptId
  }, [activeReceiptId])

  useEffect(() => {
    if (queryReceiptId === null) {
      return
    }

    const hasQueryReceipt = receipts.some(
      (receipt) => Number(receipt.id) === queryReceiptId
    )

    if (!hasQueryReceipt || activeReceiptIdRef.current === queryReceiptId) {
      return
    }

    dispatch(setActiveReceiptId(queryReceiptId))
  }, [dispatch, queryReceiptId, receipts])

  useEffect(() => {
    if (queryReceiptId === null) {
      return
    }

    const hasQueryReceipt = receipts.some(
      (receipt) => Number(receipt.id) === queryReceiptId
    )

    if (hasQueryReceipt) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete("order")
    setSearchParams(nextParams, { replace: true })
  }, [queryReceiptId, receipts, searchParams, setSearchParams])

  useEffect(() => {
    if (activeReceiptId === null) {
      return
    }

    const hasActiveReceipt = receipts.some(
      (receipt) => Number(receipt.id) === activeReceiptId
    )

    if (hasActiveReceipt) {
      return
    }

    dispatch(setActiveReceiptId(null))
    setDeleteConfirmReceiptId((currentId) =>
      currentId === activeReceiptId ? null : currentId
    )
  }, [activeReceiptId, dispatch, receipts])

  useEffect(() => {
    if (activeReceiptId === queryReceiptId) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)

    if (activeReceiptId !== null) {
      nextParams.set("order", String(activeReceiptId))
    } else {
      nextParams.delete("order")
    }

    setSearchParams(nextParams, { replace: true })
  }, [activeReceiptId, queryReceiptId, searchParams, setSearchParams])

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

    if (activeReceiptId === normalizedId) {
      dispatch(setActiveReceiptId(null))
    }

    setDeleteConfirmReceiptId((currentId) =>
      currentId === normalizedId ? null : currentId
    )
  }

  const cancelDeleteReceipt = () => {
    setDeleteConfirmReceiptId(null)
  }

  const toggleReceiptDetails = (receipt: ReceiptData) => {
    dispatch(setActiveReceiptId(
      activeReceiptId === receipt.id ? null : receipt.id
    ))

    setDeleteConfirmReceiptId((currentId) =>
      currentId === receipt.id && activeReceiptId === receipt.id
        ? null
        : currentId
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