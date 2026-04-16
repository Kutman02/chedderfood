import type { Middleware } from "@reduxjs/toolkit"
import { STORAGE_KEYS } from "@/shared/constants/storage"

export const persistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action)

    const state = store.getState()

    try {
      // 🛒 cart
      localStorage.setItem(
        STORAGE_KEYS.CART,
        JSON.stringify(state.cart.items)
      )

      // 📄 receipts (order tracking)
      localStorage.setItem(
        STORAGE_KEYS.RECEIPTS,
        JSON.stringify(state.receipts.receipts)
      )

      // 👤 customer info used for fast checkout restore
      if (state.receipts.customerData) {
        localStorage.setItem(
          STORAGE_KEYS.CUSTOMER_DATA,
          JSON.stringify(state.receipts.customerData)
        )
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER_DATA)
      }

    } catch (e) {
      console.error("Persistence error:", e)
    }

    return result
  }