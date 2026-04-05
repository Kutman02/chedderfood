import { baseApi } from "../base/baseApi"
import type {
  Customer,
  CustomerAddress
} from "@/entities/customer/model/types"

export const customersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    /* =========================
       GET REGISTERED CUSTOMERS
    ========================= */

    getCustomers: builder.query<
      Customer[],
      {
        search?: string
        per_page?: number
        orderby?: string
        order?: string
      }
    >({

      query: ({
        search = "",
        per_page = 100,
        orderby = "registered_date",
        order = "desc"
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(search && { search })
        })

        return {
          url: `wc/v3/customers?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Customers"]

    }),

    /* =========================
       GET ALL CUSTOMERS (🔥 FIXED)
    ========================= */

    getAllCustomers: builder.query<Customer[], { per_page?: number }>({

      async queryFn({ per_page = 100 }, _queryApi, _extraOptions, baseQuery) {

        const result = await baseQuery({
          url: `custom/v1/orders?per_page=${per_page}`, // 🔥 твой API
          credentials: "include"
        })

        if (result.error) {
          return { error: result.error }
        }

        const orders = (result.data || []) as any[]

        const customersMap = new Map<string, Customer>()

        const createAddress = (order: any): CustomerAddress => ({
          first_name: order.customer_name || "",
          last_name: "",
          email: order.billing?.email || "",
          phone: order.phone || "",
          address_1: order.address || "",
          address_2: "",
          city: "",
          postcode: "",
          country: "",
          company: ""
        })

        orders.forEach((order) => {

          const email = order.billing?.email || ""
          const phone = order.phone || ""

          // 🔥 ключ: email → fallback phone → fallback id
          const key = email || phone || `order-${order.id}`

          if (!customersMap.has(key)) {

            customersMap.set(key, {

              id: order.id,

              first_name: order.customer_name || "Клиент",
              last_name: "",
              email,

              date_created: order.date_created || "",
              date_modified: order.date_modified || "",

              billing: createAddress(order),
              shipping: createAddress(order),

              orders_count: 0,
              total_spent: "0",

              role: "customer"

            })

          }

          const customer = customersMap.get(key)!

          customer.orders_count += 1

          const prev = parseFloat(customer.total_spent || "0")
          const current = parseFloat(order.total || "0")

          customer.total_spent = (prev + current).toString()

        })

        return {
          data: Array.from(customersMap.values())
        }

      },

      providesTags: ["Customers"]

    }),

    /* =========================
       GET SINGLE CUSTOMER
    ========================= */

    getCustomer: builder.query<Customer, number>({

      query: (id) => ({
        url: `wc/v3/customers/${id}`,
        credentials: "omit"
      }),

      providesTags: (_result, _error, id) => [
        { type: "Customer", id }
      ]

    })

  }),

  overrideExisting: false

})

export const {
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomerQuery
} = customersApi