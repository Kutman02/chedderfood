import { baseApi } from "../base/baseApi"
import type { Order } from "@/types"

export const ordersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET ORDERS (CUSTOM API)
    // =========================
    getOrders: builder.query<
      { data: Order[]; totalPages: number },
      {
        page?: number
      }
    >({

      query: ({ page = 1 }) => {

        const params = new URLSearchParams({
          page: page.toString(),
        })

        return {
          url: `custom/v1/orders?${params.toString()}`,
        }
      },

      transformResponse: (response: any[]) => {
        return {
          data: response,
          totalPages: 1, // пока у тебя нет пагинации на backend
        }
      },

      providesTags: ["Orders"]

    }),

    // =========================
    // GET SINGLE ORDER
    // =========================
    getOrder: builder.query<Order, number>({

      query: (id) => ({
        url: `custom/v1/orders/${id}`, // 👉 позже сделаем endpoint
      }),

      providesTags: (_result, _error, id) => [
        { type: "Order", id }
      ]

    }),

    // =========================
    // CREATE ORDER (если добавишь)
    // =========================
    createOrder: builder.mutation<Order, any>({

      query: (body) => ({
        url: `custom/v1/orders`,
        method: "POST",
        body,
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
        url: `custom/v1/orders/${id}`,
        method: "PUT",
        body: { status },
      }),

      invalidatesTags: ["Orders", "Order"]

    }),

  }),

  overrideExisting: false

})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi