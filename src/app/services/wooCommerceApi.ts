import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import type { Order, Customer } from "@/types"
import {
  API_BASE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from "./apiConfig"

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers) => {

    if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
      const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
      const basicAuth = btoa(credentials)

      headers.set("Authorization", `Basic ${basicAuth}`)
    }

    return headers
  }
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 })

export const wooCommerceApi = createApi({
  reducerPath: "wooCommerceApi",
  baseQuery: baseQueryWithRetry,

  tagTypes: ["WooOrders", "WooProducts", "WooCustomers"],

  endpoints: (builder) => ({

    // =========================
    // ORDERS
    // =========================

    getWooOrders: builder.query<
      Order[],
      {
        status?: string
        search?: string
        per_page?: number
        orderby?: string
        order?: string
        page?: number
      }
    >({

      query: ({
        status = "on-hold",
        search = "",
        per_page = 20,
        orderby = "date",
        order = "desc",
        page = 1
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          page: page.toString(),
          ...(status !== "all" && { status }),
          ...(search && { search })
        })

        return `wc/v3/orders?${params.toString()}`
      },

      providesTags: ["WooOrders"],
      keepUnusedDataFor: 300
    }),

    // =========================
    // PRODUCTS
    // =========================

    getWooProducts: builder.query({

      query: ({
        search = "",
        per_page = 20,
        orderby = "date",
        order = "desc",
        status = "publish",
        page = 1
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          status,
          page: page.toString(),
          ...(search && { search })
        })

        return `wc/v3/products?${params.toString()}`
      },

      providesTags: ["WooProducts"],
      keepUnusedDataFor: 120
    }),

    // =========================
    // REGISTERED CUSTOMERS
    // =========================

    getWooCustomers: builder.query({

      query: ({
        search = "",
        per_page = 20,
        orderby = "registered_date",
        order = "desc",
        page = 1
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          page: page.toString(),
          ...(search && { search })
        })

        return `wc/v3/customers?${params.toString()}`
      },

      providesTags: ["WooCustomers"],
      keepUnusedDataFor: 300
    }),

    // =========================
    // ALL CUSTOMERS FROM ORDERS
    // =========================

    getAllWooCustomers: builder.query<Customer[], void>({
      async queryFn(_, _queryApi, _extraOptions, baseQuery) {

        let page = 1
        const per_page = 100
        let allOrders: Order[] = []

        while (true) {

          const result = await baseQuery(
            `wc/v3/orders?per_page=${per_page}&page=${page}`
          )

          if (result.error) return { error: result.error }

          const orders = result.data as Order[]

          allOrders = [...allOrders, ...orders]

          if (orders.length < per_page) break

          page++
        }

        const customersMap = new Map<string, Customer>()

        allOrders.forEach(order => {

          const billing = order.billing

          const phone = billing.phone?.replace(/\D/g, "")
          const key = phone || billing.email

          if (!key) return

          if (!customersMap.has(key)) {

            customersMap.set(key, {

              id: Math.abs(
                key
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0)
              ),

              first_name: billing.first_name || "",
              last_name: billing.last_name || "",
              email: billing.email,

              username: phone || billing.email || "guest",

              date_created: order.date_created,
              date_modified: order.date_modified,

              billing: {
                first_name: billing.first_name || "",
                last_name: billing.last_name || "",
                company: "",
                address_1: billing.address_1 || "",
                address_2: billing.address_2 || "",
                city: billing.city || "",
                postcode: "",
                country: "",
                email: billing.email,
                phone: billing.phone || ""
              },

              shipping: {
                first_name: order.shipping?.first_name || "",
                last_name: order.shipping?.last_name || "",
                company: order.shipping?.company || "",
                address_1: order.shipping?.address_1 || "",
                address_2: order.shipping?.address_2 || "",
                city: order.shipping?.city || "",
                postcode: order.shipping?.postcode || "",
                country: order.shipping?.country || ""
              },

              orders_count: 0,
              total_spent: "0",
              role: "customer"
            })
          }

          const customer = customersMap.get(key)!

          customer.orders_count += 1

          customer.total_spent = (
            parseFloat(customer.total_spent) +
            parseFloat(order.total || "0")
          ).toString()

        })

        return { data: Array.from(customersMap.values()) }
      },

      providesTags: ["WooCustomers"],
      keepUnusedDataFor: 300
    }),

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    updateWooOrderStatus: builder.mutation({

      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: "PUT",
        body: { status }
      }),

      invalidatesTags: ["WooOrders"]
    })

  })
})

export const {

  useGetWooOrdersQuery,
  useGetWooProductsQuery,
  useGetWooCustomersQuery,
  useGetAllWooCustomersQuery,
  useUpdateWooOrderStatusMutation

} = wooCommerceApi
