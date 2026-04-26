import type { CustomerData, ReceiptData } from "@/types"
import type { LegacyCustomerData } from "./types"

export const parseOrderId = (value: unknown): number => {
  if (typeof value === "number") return value

  if (typeof value === "string") {
    const trimmed = value.trim()
    const numericDirect = Number(trimmed)

    if (Number.isFinite(numericDirect)) {
      return numericDirect
    }

    const digitsOnly = trimmed.match(/\d+/)?.[0]
    if (digitsOnly) {
      return Number(digitsOnly)
    }
  }

  return Number.NaN
}

export const normalizeReceiptStatus = (value: unknown): string => {
  const normalized = String(value || "on-hold").trim().toLowerCase()

  if (!normalized) return "on-hold"

  if (normalized === "pending") return "on-hold"
  if (normalized === "canceled") return "cancelled"

  if (normalized === "failed" || normalized === "refunded" || normalized === "trash") {
    return "cancelled"
  }

  if (
    normalized === "on-hold" ||
    normalized === "processing" ||
    normalized === "ready" ||
    normalized === "completed" ||
    normalized === "cancelled"
  ) {
    return normalized
  }

  return "on-hold"
}

export const normalizeReceipt = (value: unknown): ReceiptData | null => {
  if (!value || typeof value !== "object") return null

  const candidate = value as Partial<ReceiptData> & {
    id?: unknown
    number?: unknown
    status?: unknown
  }

  const idRaw = candidate.id ?? candidate.number
  const normalizedId = parseOrderId(idRaw)

  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return null
  }

  return {
    ...candidate,
    id: normalizedId,
    status: normalizeReceiptStatus(candidate.status),
  } as ReceiptData
}

export const dedupeReceipts = (receipts: ReceiptData[]): ReceiptData[] => {
  const map = new Map<number, ReceiptData>()

  for (const receipt of receipts) {
    map.set(receipt.id, receipt)
  }

  return Array.from(map.values())
}

export const normalizeCustomerData = (parsed: LegacyCustomerData): CustomerData => ({
  first_name: parsed.first_name ?? "",
  address: parsed.address ?? "",
  phone: parsed.phone ?? "",
  apartment_office: parsed.apartment_office ?? parsed.apartment ?? "",
  floor: parsed.floor ?? "",
})
