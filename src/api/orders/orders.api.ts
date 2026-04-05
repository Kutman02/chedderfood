import { baseApi } from "../base/baseApi"
import { normalizeOrder } from "@/entities/order/model/normalizeOrder"
import type { Order } from "@/entities/order/model/types"

export const ordersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET ORDERS
    // =========================
    getOrders: builder.query<
      { data: Order[]; totalPages: number },
      {
        page?: number
        status?: string
        search?: string
        per_page?: number
        orderby?: string
        order?: string
      }
    >({

      query: ({
        page = 1,
        status,
        search,
        per_page = 15,
        orderby = "date",
        order = "desc",
      }) => {

        const params = new URLSearchParams()

        params.append("page", page.toString())

        if (status) params.append("status", status)
        if (search) params.append("search", search)

        params.append("per_page", per_page.toString())
        params.append("orderby", orderby)
        params.append("order", order)

        return {
          url: `custom/v1/orders?${params.toString()}`,
        }
      },

      transformResponse: (response: any[]) => ({
        data: response.map(normalizeOrder),
        totalPages: 1,
      }),

      providesTags: ["Orders"],

    }),

    // =========================
    // CREATE ORDER 🔥 ДОБАВИЛИ
    // =========================
    createOrder: builder.mutation<any, any>({

      query: (body) => ({
        url: "custom/v1/orders",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Orders"],

    }),

    // =========================
    // UPDATE STATUS
    // =========================
    updateOrderStatus: builder.mutation<
      any,
      { id: number; status: string }
    >({

      query: ({ id, status }) => ({
        url: `custom/v1/orders/${id}`,
        method: "PUT",
        body: { status },
      }),

      invalidatesTags: ["Orders"],

    }),

  }),

})

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,      // ✅ ТЕПЕРЬ ЕСТЬ
  useUpdateOrderStatusMutation,
} = ordersApi