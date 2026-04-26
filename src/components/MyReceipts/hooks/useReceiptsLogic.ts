import { useState } from "react"
import { useAppSelector } from "@/app/hooks"
import { useReceiptDeleteFlow } from "./useReceiptDeleteFlow"
import { useReceiptQuerySync } from "./useReceiptQuerySync"
import { useReceiptStatusSync } from "./useReceiptStatusSync"

export const useReceiptsLogic = () => {
  const receipts = useAppSelector((s) => s.receipts.receipts)

  const activeReceiptId = useAppSelector((s) => s.receipts.activeReceiptId)

  const [deleteConfirmReceiptId, setDeleteConfirmReceiptId] =
    useState<number | null>(null)

  useReceiptQuerySync({
    receipts,
    activeReceiptId,
    setDeleteConfirmReceiptId,
  })

  useReceiptStatusSync(receipts)

  const {
    handleDeleteReceipt,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    toggleReceiptDetails,
  } = useReceiptDeleteFlow({
    receipts,
    activeReceiptId,
    setDeleteConfirmReceiptId,
  })

  const expandedReceiptId = activeReceiptId

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