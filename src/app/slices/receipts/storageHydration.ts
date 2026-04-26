import type { CustomerData, ReceiptData } from "@/types"
import { storage } from "@/shared/lib/storage"
import {
  ACTIVE_RECEIPT_ID_KEY,
  CHECKOUT_FORM_KEY,
  CUSTOMER_DATA_KEY,
  LEGACY_CUSTOMER_DATA_KEYS,
  LEGACY_RECEIPTS_KEYS,
  RECEIPTS_DELETED_IDS_KEY,
  RECEIPTS_KEY,
} from "./constants"
import {
  dedupeReceipts,
  normalizeCustomerData,
  normalizeReceipt,
  parseOrderId,
} from "./normalizers"
import type { LegacyCustomerData } from "./types"

const cleanupLegacyReceiptKeys = () => {
  for (const key of LEGACY_RECEIPTS_KEYS) {
    storage.remove(key)
  }
}

const extractSource = (parsed: unknown): unknown[] => {
  if (Array.isArray(parsed)) return parsed

  if (!parsed || typeof parsed !== "object") {
    return []
  }

  const record = parsed as Record<string, unknown>

  if (Array.isArray(record.receipts)) return record.receipts
  if (Array.isArray(record.orders)) return record.orders
  if (Array.isArray(record.data)) return record.data

  const values = Object.values(record)

  if (values.length && values.every((item) => item && typeof item === "object")) {
    return values
  }

  return []
}

const readAndNormalizeReceipts = (
  key: string,
  deletedSet: Set<number>
): ReceiptData[] | null => {
  try {
    const raw = storage.getString(key)
    if (raw === null) return null

    const parsed = JSON.parse(raw) as unknown
    const source = extractSource(parsed)

    return source
      .map(normalizeReceipt)
      .filter(
        (receipt): receipt is ReceiptData =>
          receipt !== null && !deletedSet.has(receipt.id)
      )
  } catch {
    return []
  }
}

const parseCustomerData = (raw: string): CustomerData => {
  const parsed = JSON.parse(raw) as LegacyCustomerData
  return normalizeCustomerData(parsed)
}

export const loadDeletedReceiptIds = (): number[] => {
  try {
    const raw = storage.getString(RECEIPTS_DELETED_IDS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return Array.from(
      new Set(
        parsed
          .map((value) => parseOrderId(value))
          .filter((value) => Number.isFinite(value) && value > 0)
      )
    )
  } catch {
    return []
  }
}

export const loadReceipts = (deletedReceiptIds: number[]): ReceiptData[] => {
  const deletedSet = new Set(deletedReceiptIds)

  const currentReceipts = readAndNormalizeReceipts(RECEIPTS_KEY, deletedSet)
  if (currentReceipts !== null) {
    cleanupLegacyReceiptKeys()
    return dedupeReceipts(currentReceipts)
  }

  const migratedReceipts = dedupeReceipts(
    LEGACY_RECEIPTS_KEYS.flatMap(
      (key) => readAndNormalizeReceipts(key, deletedSet) ?? []
    )
  )

  cleanupLegacyReceiptKeys()

  if (migratedReceipts.length) {
    storage.setJSON(RECEIPTS_KEY, migratedReceipts)
    return migratedReceipts
  }

  return []
}

export const loadActiveReceiptId = (): number | null => {
  try {
    const raw = storage.getString(ACTIVE_RECEIPT_ID_KEY)
    if (!raw) return null

    const normalizedId = parseOrderId(raw)

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      return null
    }

    return normalizedId
  } catch {
    return null
  }
}

export const loadCustomerData = (): CustomerData | null => {
  try {
    const customerDataRaw = storage.getString(CUSTOMER_DATA_KEY)
    if (customerDataRaw) {
      return parseCustomerData(customerDataRaw)
    }

    for (const legacyKey of LEGACY_CUSTOMER_DATA_KEYS) {
      const legacyRaw = storage.getString(legacyKey)
      if (!legacyRaw) continue

      const normalizedLegacyCustomerData = parseCustomerData(legacyRaw)
      storage.setJSON(CUSTOMER_DATA_KEY, normalizedLegacyCustomerData)
      storage.remove(legacyKey)

      return normalizedLegacyCustomerData
    }

    const raw = storage.getString(CHECKOUT_FORM_KEY)

    if (!raw) return null

    return parseCustomerData(raw)
  } catch {
    return null
  }
}
