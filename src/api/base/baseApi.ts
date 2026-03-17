import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import {
  API_BASE_URL,
  WORDPRESS_USERNAME,
  WORDPRESS_APP_PASSWORD,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from "@/app/services/apiConfig"


// helper для WordPress Application Password
const createAppPasswordAuth = () => {

  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    return null
  }

  const cleanPassword = WORDPRESS_APP_PASSWORD.replace(/\s+/g, "")

  const credentials = `${WORDPRESS_USERNAME}:${cleanPassword}`

  return `Basic ${btoa(credentials)}`
}


// helper для WooCommerce Basic Auth
const createWooAuth = () => {

  if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
    return null
  }

  const credentials =
    `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`

  return `Basic ${btoa(credentials)}`
}


export const baseApi = createApi({

  reducerPath: "api",

  baseQuery: fetchBaseQuery({

    baseUrl: API_BASE_URL,

    credentials: "include",

    prepareHeaders: (headers, { endpoint }) => {

      const endpointName = String(endpoint).toLowerCase()


      // endpoints WordPress
      const isWordPressEndpoint =
        endpointName === "uploadimage" ||
        endpointName === "getprofile" ||
        endpointName === "updateprofile"


      if (isWordPressEndpoint) {

        const auth = createAppPasswordAuth()

        if (auth) {
          headers.set("Authorization", auth)
        }

      } else {

        const auth = createWooAuth()

        if (auth) {
          headers.set("Authorization", auth)
        }

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