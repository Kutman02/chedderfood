import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { API_BASE_URL } from "@/app/services/apiConfig"

const PUBLIC_ENDPOINTS = new Set([
  "login",
  "getPublicProducts",
  "getPublicCategories",
  "getRestaurantHoursStatus",
  "createOrder",
])

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers, { endpoint }) => {
      if (PUBLIC_ENDPOINTS.has(endpoint)) {
        headers.delete("Authorization")
        return headers
      }

      const token = localStorage.getItem("token")

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }

      return headers
    },
  }),

  tagTypes: [
    "Orders",
    "Products",
    "Categories",
    "Customers",
    "Profile",
  ],

  endpoints: () => ({}),
})