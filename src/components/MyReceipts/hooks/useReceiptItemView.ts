import type { Order } from "@/types"
import { getOrderStatus } from "../utils/getOrderStatus"
import {
  canDeleteReceipt,
  getOrderAccent,
  getReceiptCreatedMetaText,
  getReceiptItemsCount,
} from "../utils/receiptItem.utils"

type UseReceiptItemViewArgs = {
  receipt: Order
}

export const useReceiptItemView = ({
  receipt,
}: UseReceiptItemViewArgs) => {
  const statusValue = String(receipt.status || "on-hold").trim().toLowerCase()
  const accent = getOrderAccent(statusValue)
  const status = getOrderStatus(statusValue)

  const canDelete = canDeleteReceipt(receipt.id, statusValue)
  const createdMetaText = getReceiptCreatedMetaText(receipt)
  const itemsCount = getReceiptItemsCount(receipt)

  return {
    statusValue,
    accent,
    status,
    canDelete,
    createdMetaText,
    itemsCount,
  }
}
