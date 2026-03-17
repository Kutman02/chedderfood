import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from '@/api'
import { publicApi } from './services/publicApi'
import { customAuthApi } from './services/customAuth'

import { authReducer } from './slices/authSlice'
import { cartReducer } from './slices/cartSlice'
import { receiptsReducer } from './slices/receiptsSlice'
import { uiReducer } from './slices/uiSlice'
import { persistenceMiddleware } from "./persistenceMiddleware"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [customAuthApi.reducerPath]: customAuthApi.reducer,

    auth: authReducer,
    cart: cartReducer,
    receipts: receiptsReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      publicApi.middleware,
      customAuthApi.middleware,
      persistenceMiddleware
    ),
})