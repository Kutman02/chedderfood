import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { API_BASE_URL } from "@/app/services/apiConfig"
import { authStorage } from "@/shared/lib/storage"

const PUBLIC_ENDPOINTS = new Set([
  "login",
  "getPublicOrderStatus",
  "getPublicProducts",
  "getPublicCategories",
  "getRestaurantHoursStatus",
  "getSiteFooter",
  "getAboutPage",
  "getContactsPage",
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

      const token = authStorage.getToken()

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
    "Tags",
    "Customers",
    "Profile",
    "SiteFooter",
    "AboutPage",
    "ContactsPage",
  ],

  endpoints: () => ({}),
})