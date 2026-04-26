import type { ReceiptData } from "@/types"
import { TERMINAL_RECEIPT_STATUSES } from "./receipt.constants"

export const normalizeStatusForDelete = (status: string) => {
  const normalized = status.trim().toLowerCase()
  if (normalized === "canceled") return "cancelled"
  return normalized
}

export const hasReceiptById = (receipts: ReceiptData[], receiptId: number) =>
  receipts.some((receipt) => Number(receipt.id) === receiptId)

export const parseQueryReceiptId = (value: string | null): number | null => {
  if (!value) return null

  const normalizedId = Number(value)
  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return null
  }

  return normalizedId
}

export const buildActiveSyncTargets = (receipts: ReceiptData[]) => {
  return receipts
    .filter((receipt) => {
      const normalizedStatus = String(receipt.status || "").trim().toLowerCase()
      return !TERMINAL_RECEIPT_STATUSES.has(normalizedStatus)
    })
    .map((receipt) => ({
      orderId: Number(receipt.id),
      publicKey: String(receipt.public_key || "").trim(),
    }))
    .filter(
      (target) =>
        Number.isFinite(target.orderId) && target.orderId > 0 && target.publicKey.length > 0
    )
}

export const hasActiveReceiptsWithoutPublicKey = (receipts: ReceiptData[]) => {
  return receipts.some((receipt) => {
    const normalizedStatus = String(receipt.status || "").trim().toLowerCase()

    if (TERMINAL_RECEIPT_STATUSES.has(normalizedStatus)) {
      return false
    }

    const publicKey = String(receipt.public_key || "").trim()
    return publicKey.length === 0
  })
}
