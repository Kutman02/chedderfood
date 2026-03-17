import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/app/store"
import {
  API_BASE_URL,
  WORDPRESS_USERNAME,
  WORDPRESS_APP_PASSWORD
} from "@/app/services/apiConfig"

// 🔑 Application Password
const createAuthHeader = () => {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) return null

  const cleanPassword = WORDPRESS_APP_PASSWORD.replace(/\s+/g, "")
  return `Basic ${btoa(`${WORDPRESS_USERNAME}:${cleanPassword}`)}`
}

export const baseApi = createApi({

  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({

    baseUrl: API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {

      const token = (getState() as RootState).auth.token

      // ✅ 1. WordPress App Password (основа)
      const authHeader = createAuthHeader()

      if (authHeader) {
        headers.set("Authorization", authHeader)
      }

      // ✅ 2. fallback JWT (если вдруг используешь)
      if (token && token !== "app_password_authenticated") {
        headers.set("authorization", `Bearer ${token}`)
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