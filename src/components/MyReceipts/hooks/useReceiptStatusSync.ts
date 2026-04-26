import { useEffect, useMemo, useRef, useState } from "react"
import { useLazyGetPublicOrderStatusQuery } from "@/api"
import { useAppDispatch } from "@/app/hooks"
import { syncReceiptFromServer } from "@/app/slices/receiptsSlice"
import { useToastStore } from "@/stores/toastStore"
import type { ReceiptData } from "@/types"
import {
  MISSING_PUBLIC_KEY_TOAST,
  STATUS_SYNC_INTERVAL_MS,
  STATUS_SYNC_UNAVAILABLE_TOAST,
} from "./receipt.constants"
import {
  buildActiveSyncTargets,
  hasActiveReceiptsWithoutPublicKey,
} from "./receipt.utils"

export const useReceiptStatusSync = (receipts: ReceiptData[]) => {
  const dispatch = useAppDispatch()
  const addToast = useToastStore((state) => state.addToast)
  const [getPublicOrderStatus] = useLazyGetPublicOrderStatusQuery()
  const [isStatusSyncUnavailable, setIsStatusSyncUnavailable] = useState(false)
  const isSyncUnavailableToastShown = useRef(false)
  const isMissingPublicKeyToastShown = useRef(false)

  const activeSyncTargets = useMemo(
    () => buildActiveSyncTargets(receipts),
    [receipts]
  )

  const hasReceiptsWithoutPublicKey = useMemo(
    () => hasActiveReceiptsWithoutPublicKey(receipts),
    [receipts]
  )

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
              addToast(STATUS_SYNC_UNAVAILABLE_TOAST, "info", 6000)
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

    const intervalId = window.setInterval(syncStatuses, STATUS_SYNC_INTERVAL_MS)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [
    activeSyncTargets,
    addToast,
    dispatch,
    getPublicOrderStatus,
    isStatusSyncUnavailable,
  ])

  useEffect(() => {
    if (!hasReceiptsWithoutPublicKey || isMissingPublicKeyToastShown.current) {
      return
    }

    isMissingPublicKeyToastShown.current = true
    addToast(MISSING_PUBLIC_KEY_TOAST, "info", 6000)
  }, [addToast, hasReceiptsWithoutPublicKey])
}
