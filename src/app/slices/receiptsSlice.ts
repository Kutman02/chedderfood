import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CustomerData, ReceiptData } from "@/types"
import { DELETABLE_RECEIPT_STATUSES } from "./receipts/constants"
import {
  normalizeReceipt,
  normalizeReceiptStatus,
  parseOrderId,
} from "./receipts/normalizers"
import {
  loadActiveReceiptId,
  loadCustomerData,
  loadDeletedReceiptIds,
  loadReceipts,
} from "./receipts/storageHydration"
import type { ReceiptServerSyncPayload, ReceiptsState } from "./receipts/types"

const initialDeletedReceiptIds = loadDeletedReceiptIds()
const initialReceipts = loadReceipts(initialDeletedReceiptIds)
const initialActiveReceiptId = loadActiveReceiptId()

const initialState: ReceiptsState = {
  receipts: initialReceipts,
  deletedReceiptIds: initialDeletedReceiptIds,
  activeReceiptId:
    initialActiveReceiptId !== null && initialReceipts.some((receipt) => receipt.id === initialActiveReceiptId)
      ? initialActiveReceiptId
      : null,
  customerData: loadCustomerData(),
}

export const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    addReceipt: (state, action: PayloadAction<ReceiptData>) => {
      const receipt = action.payload
      const normalized = normalizeReceipt(receipt)

      if (!normalized) {
        return
      }

      if (state.deletedReceiptIds.includes(normalized.id)) {
        return
      }

      state.receipts = [normalized, ...state.receipts.filter((r) => r.id !== normalized.id)].slice(0, 50)
      state.activeReceiptId = normalized.id
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
      const normalizedId = Number(action.payload)
      if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
        return
      }

      const existingReceipt = state.receipts.find((receipt) => {
        const receiptId = parseOrderId(
          (receipt as { id?: unknown; number?: unknown }).id
            ?? (receipt as { number?: unknown }).number
        )

        return receiptId === normalizedId
      })

      if (!existingReceipt) {
        return
      }

      const normalizedStatus = normalizeReceiptStatus(existingReceipt.status)

      if (!DELETABLE_RECEIPT_STATUSES.has(normalizedStatus)) {
        return
      }

      state.receipts = state.receipts.filter((receipt) => {
        const receiptId = parseOrderId(
          (receipt as { id?: unknown; number?: unknown }).id
            ?? (receipt as { number?: unknown }).number
        )

        return receiptId !== normalizedId
      })

      if (state.activeReceiptId === normalizedId) {
        state.activeReceiptId = null
      }

      if (!state.deletedReceiptIds.includes(normalizedId)) {
        state.deletedReceiptIds = [...state.deletedReceiptIds, normalizedId].slice(-500)
      }
    },
    clearReceipts: (state) => {
      state.receipts = []
      state.deletedReceiptIds = []
      state.activeReceiptId = null
    },
    setActiveReceiptId: (state, action: PayloadAction<number | null>) => {
      const nextId = action.payload

      if (nextId === null) {
        state.activeReceiptId = null
        return
      }

      const normalizedId = Number(nextId)

      if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
        state.activeReceiptId = null
        return
      }

      state.activeReceiptId = normalizedId
    },
    setCustomerData: (state, action: PayloadAction<CustomerData>) => {
      state.customerData = action.payload
    },
    clearCustomerData: (state) => {
      state.customerData = null
    },
  },
})

export const {
  addReceipt,
  syncReceiptFromServer,
  deleteReceipt,
  clearReceipts,
  setActiveReceiptId,
  setCustomerData,
  clearCustomerData,
} = receiptsSlice.actions

export const receiptsReducer = receiptsSlice.reducer
