import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerData, ReceiptData } from '@/types';
import { STORAGE_KEYS } from "@/shared/constants/storage"

type ReceiptsState = {
  receipts: ReceiptData[];
  customerData: CustomerData | null;
};

const RECEIPTS_KEY = STORAGE_KEYS.RECEIPTS
const CUSTOMER_DATA_KEY = STORAGE_KEYS.CUSTOMER_DATA
const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM

const normalizeReceipt = (value: unknown): ReceiptData | null => {
  if (!value || typeof value !== "object") return null

  const candidate = value as Partial<ReceiptData>

  const idRaw = (candidate as { id?: unknown }).id
  const normalizedId =
    typeof idRaw === "number"
      ? idRaw
      : typeof idRaw === "string"
        ? Number(idRaw)
        : Number.NaN

  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return null
  }

  return {
    ...candidate,
    id: normalizedId,
  } as ReceiptData
}

const loadReceipts = (): ReceiptData[] => {
  try {
    const raw = localStorage.getItem(RECEIPTS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(normalizeReceipt)
      .filter((receipt): receipt is ReceiptData => receipt !== null)
  } catch {
    return []
  }
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
  try {
    const customerDataRaw = localStorage.getItem(CUSTOMER_DATA_KEY)

    if (customerDataRaw) {
      const parsed = JSON.parse(customerDataRaw) as Partial<CustomerData> & {
        apartment?: string
      }

      return normalizeCustomerData(parsed)
    }

    const raw = localStorage.getItem(CHECKOUT_FORM_KEY)

    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<CustomerData> & {
      apartment?: string
    }

    return normalizeCustomerData(parsed)
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
    deleteReceipt: (state, action: PayloadAction<number>) => {
      const receiptToDelete = state.receipts.find((r) => r.id === action.payload)
      const status = String(receiptToDelete?.status || "").trim().toLowerCase()

      if (status !== "completed" && status !== "cancelled") {
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
  deleteReceipt,
  clearReceipts,
  setCustomerData,
  clearCustomerData,
} = receiptsSlice.actions;

export const receiptsReducer = receiptsSlice.reducer;
