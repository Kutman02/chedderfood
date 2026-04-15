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

    } catch (e) {
      console.error("Persistence error:", e)
    }

    return result
  }