import type { Middleware } from "@reduxjs/toolkit"
import { STORAGE_KEYS } from "@/shared/constants/storage"
import { storage } from "@/shared/lib/storage"

const LEGACY_RECEIPTS_KEYS = ["receipts", "orders_receipts"]
const LEGACY_CUSTOMER_DATA_KEYS = ["customer_data", "customerData"]

const setLocalStorageSafely = (key: string, value: unknown) => {
  storage.setJSON(key, value)
}

const removeLocalStorageSafely = (key: string) => {
  storage.remove(key)
}

export const persistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action)

    const state = store.getState()

    // 📄 receipts (order tracking)
    setLocalStorageSafely(
      STORAGE_KEYS.RECEIPTS,
      state.receipts.receipts
    )

    if (Array.isArray(state.receipts.deletedReceiptIds) && state.receipts.deletedReceiptIds.length > 0) {
      setLocalStorageSafely(
        STORAGE_KEYS.RECEIPTS_DELETED_IDS,
        state.receipts.deletedReceiptIds
      )
    } else {
      removeLocalStorageSafely(STORAGE_KEYS.RECEIPTS_DELETED_IDS)
    }

    // 🧹 prevent stale legacy payloads from restoring deleted receipts on next boot
    for (const key of LEGACY_RECEIPTS_KEYS) {
      removeLocalStorageSafely(key)
    }

    // 👤 customer info used for fast checkout restore
    if (state.receipts.customerData) {
      setLocalStorageSafely(
        STORAGE_KEYS.CUSTOMER_DATA,
        state.receipts.customerData
      )
    } else {
      removeLocalStorageSafely(STORAGE_KEYS.CUSTOMER_DATA)
    }

    for (const key of LEGACY_CUSTOMER_DATA_KEYS) {
      removeLocalStorageSafely(key)
    }

    // 🛒 cart
    setLocalStorageSafely(
      STORAGE_KEYS.CART,
      state.cart.items
    )

    return result
  }
