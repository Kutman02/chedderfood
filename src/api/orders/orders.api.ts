import { baseApi } from "../base/baseApi"
import type { Order } from "@/types"

export const ordersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET ORDERS
    // =========================
    getOrders: builder.query<
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
        status,
        search = "",
        per_page = 15,
        orderby = "date",
        order = "desc",
        page = 1
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          page: page.toString(),
          orderby,
          order,
          ...(status && status !== "all" ? { status } : {}),
          ...(search ? { search } : {})
        })

        return {
          url: `wc/v3/orders?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Orders"]

    }),

    // =========================
    // GET SINGLE ORDER
    // =========================
    getOrder: builder.query<Order, number>({

      query: (id) => ({
        url: `wc/v3/orders/${id}`,
        credentials: "omit"
      }),

      providesTags: (_result, _error, id) => [
        { type: "Order", id }
      ]

    }),

    // =========================
    // CREATE ORDER
    // =========================
    createOrder: builder.mutation<Order, any>({

      query: (body) => ({
        url: `wc/v3/orders`,
        method: "POST",
        body,
        credentials: "omit"
      }),

      invalidatesTags: ["Orders"]

    }),

    // =========================
    // UPDATE STATUS
    // =========================
    updateOrderStatus: builder.mutation<
      Order,
      { id: number; status: string }
    >({

      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: "PUT",
        body: { status },
        credentials: "omit"
      }),

      invalidatesTags: ["Orders", "Order"]

    }),

    // =========================
    // UPDATE ORDER
    // =========================
    updateOrder: builder.mutation<
      Order,
      { id: number } & Partial<Order>
    >({

      query: ({ id, ...body }) => ({
        url: `wc/v3/orders/${id}`,
        method: "PUT",
        body,
        credentials: "omit"
      }),

      invalidatesTags: ["Orders", "Order"]

    })

  }),

  overrideExisting: false

})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation
} = ordersApi