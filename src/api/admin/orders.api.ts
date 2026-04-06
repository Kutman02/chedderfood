import { baseApi } from "../base/baseApi"
import type {
  Order,
  OrdersResponse,
  OrderStatus,
} from "@/types"

/* =========================
   PARAMS
========================= */

export interface GetOrdersParams {
  page?: number
  per_page?: number
  status?: OrderStatus
  search?: string
}

/* =========================
   UPDATE STATUS
========================= */

export interface UpdateOrderRequest {
  id: number
  status: OrderStatus
}

export interface UpdateOrderResponse {
  success: boolean
  id: number
  status: OrderStatus
}

/* =========================
   API
========================= */

export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET ORDERS (ADMIN)
    ========================= */

    getOrders: builder.query<
      OrdersResponse,
      GetOrdersParams | void
    >({
      query: (params) => ({
        url: "/custom/v1/orders",
        method: "GET",
        params: params || {},
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((order: Order) => ({
                type: "Orders" as const,
                id: order.id,
              })),
              { type: "Orders" as const, id: "LIST" },
            ]
          : [{ type: "Orders" as const, id: "LIST" }],
    }),

    /* =========================
       UPDATE STATUS (ADMIN)
    ========================= */

    updateOrderStatus: builder.mutation<
      UpdateOrderResponse,
      UpdateOrderRequest
    >({
      query: ({ id, status }) => ({
        url: `/custom/v1/orders/${id}`,
        method: "PUT",
        body: { status },
      }),

      async onQueryStarted(
        { id, status },
        { dispatch, queryFulfilled }
      ) {

        const patchResult = dispatch(
          adminOrdersApi.util.updateQueryData(
            "getOrders",
            undefined,
            (draft: OrdersResponse) => {

              const order = draft.data.find(
                (o: Order) => o.id === id
              )

              if (order) {
                order.status = status
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders" as const, id },
        { type: "Orders" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = adminOrdersApi