import type { Middleware } from "@reduxjs/toolkit"
import { STORAGE_KEYS } from "@/shared/constants/storage"
import { storage } from "@/shared/lib/storage"

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

    // 👤 customer info used for fast checkout restore
    if (state.receipts.customerData) {
      setLocalStorageSafely(
        STORAGE_KEYS.CUSTOMER_DATA,
        state.receipts.customerData
      )
    } else {
      removeLocalStorageSafely(STORAGE_KEYS.CUSTOMER_DATA)
    }

    // 🛒 cart
    setLocalStorageSafely(
      STORAGE_KEYS.CART,
      state.cart.items
    )

    return result
  }
