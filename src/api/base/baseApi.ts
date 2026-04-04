import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { API_BASE_URL } from "@/app/services/apiConfig"

// БЕЗ авторизации, БЕЗ ключей
export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include", // если будешь использовать cookies
  }),

  tagTypes: [
    "Orders",
    "Order",
    "Products",
    "Product",
    "Customers",
    "Customer",
    "Profile"
  ],

  endpoints: () => ({}),
})