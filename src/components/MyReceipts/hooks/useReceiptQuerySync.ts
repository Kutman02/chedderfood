import { useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { setActiveReceiptId } from "@/app/slices/receiptsSlice"
import type { ReceiptData } from "@/types"
import { hasReceiptById, parseQueryReceiptId } from "./receipt.utils"

type UseReceiptQuerySyncParams = {
  receipts: ReceiptData[]
  activeReceiptId: number | null
  setDeleteConfirmReceiptId: React.Dispatch<React.SetStateAction<number | null>>
}

export const useReceiptQuerySync = ({
  receipts,
  activeReceiptId,
  setDeleteConfirmReceiptId,
}: UseReceiptQuerySyncParams) => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeReceiptIdRef = useRef<number | null>(activeReceiptId)

  const queryReceiptId = useMemo(
    () => parseQueryReceiptId(searchParams.get("order")),
    [searchParams]
  )

  useEffect(() => {
    activeReceiptIdRef.current = activeReceiptId
  }, [activeReceiptId])

  useEffect(() => {
    if (queryReceiptId === null) {
      return
    }

    const hasQueryReceipt = hasReceiptById(receipts, queryReceiptId)

    if (!hasQueryReceipt || activeReceiptIdRef.current === queryReceiptId) {
      return
    }

    dispatch(setActiveReceiptId(queryReceiptId))
  }, [dispatch, queryReceiptId, receipts])

  useEffect(() => {
    if (queryReceiptId === null) {
      return
    }

    const hasQueryReceipt = hasReceiptById(receipts, queryReceiptId)

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

    const hasActiveReceipt = hasReceiptById(receipts, activeReceiptId)

    if (hasActiveReceipt) {
      return
    }

    dispatch(setActiveReceiptId(null))
    setDeleteConfirmReceiptId((currentId) =>
      currentId === activeReceiptId ? null : currentId
    )
  }, [activeReceiptId, dispatch, receipts, setDeleteConfirmReceiptId])

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
}
