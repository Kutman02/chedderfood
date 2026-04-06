import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { API_BASE_URL } from "@/app/services/apiConfig"

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers) => {
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