import { useCallback } from "react"
import { useAppDispatch } from "@/app/hooks"
import { deleteReceipt, setActiveReceiptId } from "@/app/slices/receiptsSlice"
import { useToastStore } from "@/stores/toastStore"
import type { ReceiptData } from "@/types"
import { DELETABLE_RECEIPT_STATUSES } from "./receipt.constants"
import { normalizeStatusForDelete } from "./receipt.utils"

type UseReceiptDeleteFlowParams = {
  receipts: ReceiptData[]
  activeReceiptId: number | null
  setDeleteConfirmReceiptId: React.Dispatch<React.SetStateAction<number | null>>
}

export const useReceiptDeleteFlow = ({
  receipts,
  activeReceiptId,
  setDeleteConfirmReceiptId,
}: UseReceiptDeleteFlowParams) => {
  const dispatch = useAppDispatch()
  const addToast = useToastStore((state) => state.addToast)

  const handleDeleteReceipt = useCallback((id: number, status: string) => {
    const normalizedId = Number(id)
    const normalizedStatus = normalizeStatusForDelete(String(status || ""))

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      addToast("Невозможно удалить заказ: некорректный ID", "error", 3500)
      return
    }

    if (!DELETABLE_RECEIPT_STATUSES.has(normalizedStatus)) {
      addToast(
        "Удаление доступно только для завершённых и отменённых заказов",
        "info",
        3500
      )
      return
    }

    setDeleteConfirmReceiptId((currentId) =>
      currentId === normalizedId ? null : normalizedId
    )
  }, [addToast, setDeleteConfirmReceiptId])

  const confirmDeleteReceipt = useCallback((receiptId: number) => {
    const normalizedId = Number(receiptId)

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      addToast("Невозможно удалить заказ: некорректный ID", "error", 3500)
      return
    }

    const receipt = receipts.find((item) => Number(item.id) === normalizedId)

    const receiptStatus = normalizeStatusForDelete(String(receipt?.status || ""))

    if (!DELETABLE_RECEIPT_STATUSES.has(receiptStatus)) {
      addToast(
        "Удаление доступно только для завершённых и отменённых заказов",
        "info",
        3500
      )
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
  }, [activeReceiptId, addToast, dispatch, receipts, setDeleteConfirmReceiptId])

  const cancelDeleteReceipt = useCallback(() => {
    setDeleteConfirmReceiptId(null)
  }, [setDeleteConfirmReceiptId])

  const toggleReceiptDetails = useCallback((receipt: ReceiptData) => {
    dispatch(setActiveReceiptId(activeReceiptId === receipt.id ? null : receipt.id))

    setDeleteConfirmReceiptId((currentId) =>
      currentId === receipt.id && activeReceiptId === receipt.id
        ? null
        : currentId
    )
  }, [activeReceiptId, dispatch, setDeleteConfirmReceiptId])

  return {
    handleDeleteReceipt,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    toggleReceiptDetails,
  }
}
