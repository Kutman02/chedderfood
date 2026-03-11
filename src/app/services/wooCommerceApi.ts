import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import type { Order, Customer } from '@/types'
import {
  API_BASE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from './apiConfig'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'omit',
  prepareHeaders: (headers) => {

    if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
      const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
      const basicAuth = btoa(credentials)

      headers.set('Authorization', `Basic ${basicAuth}`)
    }

    return headers
  }
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 })

export const wooCommerceApi = createApi({
  reducerPath: 'wooCommerceApi',
  baseQuery: baseQueryWithRetry,

  tagTypes: ['WooOrders', 'WooProducts', 'WooCustomers'],

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
        status = 'on-hold',
        search = '',
        per_page = 20,
        orderby = 'date',
        order = 'desc',
        page = 1
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          page: page.toString(),
          ...(status !== 'all' && { status }),
          ...(search && { search })
        })

        return `wc/v3/orders?${params.toString()}`
      },

      providesTags: ['WooOrders'],

      keepUnusedDataFor: 300,

      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.error('WooCommerce Orders API Error:', response)
        return response
      }
    }),

    // =========================
    // PRODUCTS
    // =========================

    getWooProducts: builder.query({

      query: ({
        search = '',
        per_page = 20,
        orderby = 'date',
        order = 'desc',
        status = 'publish',
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

      providesTags: ['WooProducts'],

      keepUnusedDataFor: 120
    }),

    // =========================
    // CUSTOMERS
    // =========================

    getWooCustomers: builder.query({

      query: ({
        search = '',
        per_page = 20,
        orderby = 'registered_date',
        order = 'desc',
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

      providesTags: ['WooCustomers'],

      keepUnusedDataFor: 300
    }),

    // =========================
    // ALL CUSTOMERS (FROM ORDERS)
    // =========================

    getAllWooCustomers: builder.query<
      Customer[],
      { per_page?: number }
    >({

      query: ({ per_page = 50 }) =>
        `wc/v3/orders?per_page=${per_page}`,

      transformResponse: (orders: Order[]) => {

        const customersMap = new Map<string, Customer>()

        orders.forEach(order => {

          const billing = order.billing

          if (!billing?.email) return

          const key = billing.email

          if (!customersMap.has(key)) {

            customersMap.set(key, {

              id: Math.abs(
                billing.email
                  .split('')
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0)
              ),

              first_name: billing.first_name || '',
              last_name: billing.last_name || '',
              email: billing.email,

              username: billing.email.split('@')[0],

              date_created: order.date_created,
              date_modified: order.date_modified,

              billing: {
                first_name: billing.first_name || '',
                last_name: billing.last_name || '',
                company: '',
                address_1: billing.address_1 || '',
                address_2: billing.address_2 || '',
                city: billing.city || '',
                postcode: '',
                country: '',
                email: billing.email || '',
                phone: billing.phone || ''
              },

            shipping: {
  first_name: order.shipping?.first_name || '',
  last_name: order.shipping?.last_name || '',
  company: order.shipping?.company || '',
  address_1: order.shipping?.address_1 || '',
  address_2: order.shipping?.address_2 || '',
  city: order.shipping?.city || '',
  postcode: order.shipping?.postcode || '',
  country: order.shipping?.country || ''
},

              orders_count: 0,

              total_spent: '0',

              role: 'customer'
            })
          }

          const customer = customersMap.get(key)!

          customer.orders_count += 1

          customer.total_spent = (
            parseFloat(customer.total_spent) +
            parseFloat(order.total || '0')
          ).toString()

        })

        return Array.from(customersMap.values())
      },

      providesTags: ['WooCustomers'],

      keepUnusedDataFor: 300
    }),

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    updateWooOrderStatus: builder.mutation({

      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body: { status }
      }),

      invalidatesTags: ['WooOrders']
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