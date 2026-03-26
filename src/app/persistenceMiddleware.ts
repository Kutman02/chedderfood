import type { Middleware } from "@reduxjs/toolkit"

const STORAGE_KEYS = {
  CART: "kutmenu_cart",
  RECEIPTS: "kutmenu_receipts",
  CUSTOMER_DATA: "kutmenu_customer_data",
}

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

      // 🧾 receipts
      localStorage.setItem(
        STORAGE_KEYS.RECEIPTS,
        JSON.stringify(state.receipts.receipts)
      )

      // 👤 customer data
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