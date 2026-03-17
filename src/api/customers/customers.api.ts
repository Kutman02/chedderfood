import { baseApi } from "../base/baseApi"
import type { Customer, Order, CustomerAddress } from "@/types"

export const customersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET REGISTERED CUSTOMERS
    // =========================
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

    // =========================
    // GET ALL CUSTOMERS
    // =========================
    getAllCustomers: builder.query<Customer[], { per_page?: number }>({

      async queryFn({ per_page = 100 }, _queryApi, _extraOptions, baseQuery) {

        const result = await baseQuery({
          url: `wc/v3/orders?per_page=${per_page}`,
          credentials: "omit"
        })

        if (result.error) {
          return { error: result.error }
        }

        const orders = (result.data || []) as Order[]

        const customersMap = new Map<string, Customer>()

        // ✅ ЖЕСТКАЯ нормализация под тип
        const normalizeAddress = (addr?: Partial<CustomerAddress>): CustomerAddress => ({
          first_name: addr?.first_name || "",
          last_name: addr?.last_name || "",
          email: addr?.email || "",
          phone: addr?.phone || "",
          address_1: addr?.address_1 || "",
          address_2: addr?.address_2 || "",
          city: addr?.city || "",
          postcode: addr?.postcode || "",
          country: addr?.country || "", // ✅ теперь всегда string
          company: addr?.company || ""
        })

        orders.forEach((order) => {

          const billing = order.billing

          if (!billing?.email) return

          const key = billing.email

          if (!customersMap.has(key)) {

            customersMap.set(key, {

              id: String(order.id), // ✅ FIX

              first_name: billing.first_name || "",
              last_name: billing.last_name || "",
              email: billing.email,

              username: billing.email.split("@")[0],

              date_created: order.date_created,
              date_modified: order.date_modified,

              billing: normalizeAddress(billing),
              shipping: normalizeAddress(order.shipping),

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

      providesTags: ["Customers"]

    }),

    // =========================
    // GET SINGLE CUSTOMER
    // =========================
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