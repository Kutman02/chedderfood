import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "@/api"

// если у тебя уже есть reducers — добавим позже
export const store = configureStore({

  reducer: {
    [baseApi.reducerPath]: baseApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)

})


// типы (очень важно для TS)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch