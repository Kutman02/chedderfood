import { baseApi } from "../base/baseApi"
import type {
  Order,
  OrdersResponse,
  OrderStatus,
  UpdateOrderStatusResponse,
} from "@/types"

/* =========================
   ADMIN ORDERS API
   Эндпоинты: GET /custom/v1/orders, PUT /custom/v1/orders/{id}
   Требует аутентификацию (Bearer token)
========================= */

export interface GetOrdersParams {
  page?: number
  per_page?: number
  status?: OrderStatus
  search?: string
}

const normalizeOrder = (order: Order): Order => ({
  ...order,
  items: Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.line_items)
      ? order.line_items
      : [],
})

const normalizeOrdersResponse = (response: OrdersResponse): OrdersResponse => ({
  ...response,
  data: Array.isArray(response.data)
    ? response.data.map(normalizeOrder)
    : [],
  total: response.total ?? 0,
  totalPages: response.totalPages ?? 1,
})

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

      transformResponse: (response: OrdersResponse) =>
        normalizeOrdersResponse(response),

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
      UpdateOrderStatusResponse,
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
