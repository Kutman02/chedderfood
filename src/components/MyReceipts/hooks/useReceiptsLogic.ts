import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { deleteReceipt } from "@/app/slices/receiptsSlice"

import type { ReceiptData } from "@/types"

export const useReceiptsLogic = () => {

  const dispatch = useAppDispatch()

  const receipts = useAppSelector(
    (s) => s.receipts.receipts
  )

  const [expandedReceiptId, setExpandedReceiptId] =
    useState<number | null>(null)

  const [deleteConfirm, setDeleteConfirm] =
    useState<{ isOpen: boolean; receiptId: number | null }>({
      isOpen: false,
      receiptId: null
    })

  const handleDeleteReceipt = (id: number, status: string) => {
    const normalizedStatus = String(status || "").trim().toLowerCase()

    if (normalizedStatus !== "completed" && normalizedStatus !== "cancelled") return

    setDeleteConfirm({
      isOpen: true,
      receiptId: id
    })
  }

  const confirmDeleteReceipt = () => {

    if (deleteConfirm.receiptId) {
      dispatch(deleteReceipt(deleteConfirm.receiptId))
    }

    setDeleteConfirm({
      isOpen: false,
      receiptId: null
    })
  }

  const cancelDeleteReceipt = () => {

    setDeleteConfirm({
      isOpen: false,
      receiptId: null
    })
  }

  const toggleReceiptDetails = (receipt: ReceiptData) => {
    setExpandedReceiptId((prevId) =>
      prevId === receipt.id ? null : receipt.id
    )
  }

  return {
    receipts,
    expandedReceiptId,
    deleteConfirm,
    toggleReceiptDetails,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    handleDeleteReceipt
  }
}