import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import {
  API_BASE_URL,
  WORDPRESS_USERNAME,
  WORDPRESS_APP_PASSWORD
} from "@/app/services/apiConfig"

// 🔑 Генерация Basic Auth из env
const getAuthHeader = () => {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    console.warn("❌ WP credentials not provided")
    return null
  }

  // WP иногда даёт пароль с пробелами
  const cleanPassword = WORDPRESS_APP_PASSWORD.replace(/\s+/g, "")

  return `Basic ${btoa(`${WORDPRESS_USERNAME}:${cleanPassword}`)}`
}

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers) => {
      const authHeader = getAuthHeader()

      if (authHeader) {
        headers.set("Authorization", authHeader)
      }

      return headers
    }
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

  endpoints: () => ({})
})