import { configureStore } from "@reduxjs/toolkit"

import { baseApi } from "@/api"

import { authReducer } from "./slices/authSlice"
import { cartReducer } from "./slices/cartSlice"
import { receiptsReducer } from "./slices/receiptsSlice"
import { uiReducer } from "./slices/uiSlice"
import { persistenceMiddleware } from "./persistenceMiddleware"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    auth: authReducer,
    cart: cartReducer,
    receipts: receiptsReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      persistenceMiddleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch