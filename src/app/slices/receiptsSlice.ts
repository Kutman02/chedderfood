import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerData, ReceiptData } from '@/types';
import { STORAGE_KEYS } from "@/shared/constants/storage"
import { storage } from "@/shared/lib/storage"

type ReceiptsState = {
  receipts: ReceiptData[];
  customerData: CustomerData | null;
};

type ReceiptServerSyncPayload = {
  id: number
  status?: string
  reason?: string | null
  changed_at?: string | null
  date_created_human?: string
  date_created_unix?: number
  date_created?: string
}

const RECEIPTS_KEY = STORAGE_KEYS.RECEIPTS
const CUSTOMER_DATA_KEY = STORAGE_KEYS.CUSTOMER_DATA
const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM
const LEGACY_RECEIPTS_KEYS = ["receipts", "orders_receipts"]
const LEGACY_CUSTOMER_DATA_KEYS = ["customer_data", "customerData"]
const TERMINAL_RECEIPT_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "failed",
  "refunded",
  "trash",
])

const normalizeReceiptStatus = (value: unknown): string => {
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

const parseOrderId = (value: unknown): number => {
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

const normalizeReceipt = (value: unknown): ReceiptData | null => {
  if (!value || typeof value !== "object") return null

  const candidate = value as Partial<ReceiptData>

  const idRaw = (candidate as { id?: unknown; number?: unknown }).id
    ?? (candidate as { number?: unknown }).number
  const normalizedId = parseOrderId(idRaw)

  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return null
  }

  return {
    ...candidate,
    id: normalizedId,
    status: normalizeReceiptStatus((candidate as { status?: unknown }).status),
  } as ReceiptData
}

const loadReceipts = (): ReceiptData[] => {
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

  const readAndNormalizeReceipts = (key: string): ReceiptData[] | null => {
    try {
      const raw = storage.getString(key)
      if (raw === null) return null

      const parsed = JSON.parse(raw) as unknown
      const source = extractSource(parsed)
      return source
        .map(normalizeReceipt)
        .filter((receipt): receipt is ReceiptData => receipt !== null)
    } catch {
      return []
    }
  }

  const currentReceipts = readAndNormalizeReceipts(RECEIPTS_KEY)
  if (currentReceipts !== null) {
    return currentReceipts
  }

  for (const key of LEGACY_RECEIPTS_KEYS) {
    const normalizedReceipts = readAndNormalizeReceipts(key)
    if (!normalizedReceipts || !normalizedReceipts.length) {
      continue
    }

    storage.setJSON(RECEIPTS_KEY, normalizedReceipts)
    storage.remove(key)

    return normalizedReceipts
  }

  return []
}

const normalizeCustomerData = (
  parsed: Partial<CustomerData> & { apartment?: string }
): CustomerData => ({
  first_name: parsed.first_name ?? "",
  address: parsed.address ?? "",
  phone: parsed.phone ?? "",
  apartment_office: parsed.apartment_office ?? parsed.apartment ?? "",
  floor: parsed.floor ?? "",
})

const loadCustomerData = (): CustomerData | null => {
  const parseCustomerData = (raw: string): CustomerData | null => {
    const parsed = JSON.parse(raw) as Partial<CustomerData> & {
      apartment?: string
    }

    return normalizeCustomerData(parsed)
  }

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

const initialState: ReceiptsState = {
  receipts: loadReceipts(),
  customerData: loadCustomerData(),
};

export const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    addReceipt: (state, action: PayloadAction<ReceiptData>) => {
      const receipt = action.payload;
      const normalized = normalizeReceipt(receipt)

      if (!normalized) {
        return
      }

      state.receipts = [normalized, ...state.receipts.filter(r => r.id !== normalized.id)].slice(0, 50);
    },
    syncReceiptFromServer: (state, action: PayloadAction<ReceiptServerSyncPayload>) => {
      const id = Number(action.payload.id)
      if (!Number.isFinite(id) || id <= 0) return

      const currentReceipt = state.receipts.find((r) => r.id === id)
      if (!currentReceipt) return

      const nextStatus = normalizeReceiptStatus(action.payload.status ?? currentReceipt.status)

      currentReceipt.status = nextStatus as ReceiptData["status"]

      if (action.payload.reason !== undefined) {
        currentReceipt.reason = action.payload.reason
      }

      if (action.payload.changed_at !== undefined) {
        currentReceipt.changed_at = action.payload.changed_at
      }

      if (action.payload.date_created_human !== undefined) {
        currentReceipt.date_created_human = action.payload.date_created_human
      }

      if (action.payload.date_created_unix !== undefined) {
        currentReceipt.date_created_unix = action.payload.date_created_unix
      }

      if (action.payload.date_created !== undefined) {
        currentReceipt.date_created = action.payload.date_created
      }
    },
    deleteReceipt: (state, action: PayloadAction<number>) => {
      const receiptToDelete = state.receipts.find((r) => r.id === action.payload)
      const status = normalizeReceiptStatus(receiptToDelete?.status)

      if (!TERMINAL_RECEIPT_STATUSES.has(status)) {
        return
      }

      state.receipts = state.receipts.filter(r => r.id !== action.payload);
    },
    clearReceipts: (state) => {
      state.receipts = [];
    },
    setCustomerData: (state, action: PayloadAction<CustomerData>) => {
      state.customerData = action.payload;
    },
    clearCustomerData: (state) => {
      state.customerData = null;
    },
  },
});

export const {
  addReceipt,
  syncReceiptFromServer,
  deleteReceipt,
  clearReceipts,
  setCustomerData,
  clearCustomerData,
} = receiptsSlice.actions;

export const receiptsReducer = receiptsSlice.reducer;
