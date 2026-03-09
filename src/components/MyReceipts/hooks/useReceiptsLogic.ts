import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { deleteReceipt } from "@/app/slices/receiptsSlice"

import type { ReceiptData } from "../../../types"

export const useReceiptsLogic = () => {

  const dispatch = useAppDispatch()

  const receipts = useAppSelector(
    (s) => s.receipts.receipts
  )

  const [selectedReceipt, setSelectedReceipt] =
    useState<ReceiptData | null>(null)

  const [deleteConfirm, setDeleteConfirm] =
    useState<{ isOpen: boolean; receiptId: number | null }>({
      isOpen: false,
      receiptId: null
    })

  const handleDeleteReceipt = (id: number, status: string) => {

    if (status !== "completed" && status !== "cancelled") return

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

  return {
    receipts,
    selectedReceipt,
    deleteConfirm,
    setSelectedReceipt,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    handleDeleteReceipt
  }
}