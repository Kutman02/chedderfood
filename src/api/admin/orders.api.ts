import { baseApi } from "../base/baseApi"
import type {
  Order,
  OrdersResponse,
  OrderStatus,
  UpdateOrderStatusResponse,
} from "@/types"
import { normalizeOrdersResponse } from "./orders.normalizers"

/* =========================
   ADMIN ORDERS API
   Эндпоинты: GET /custom/v1/orders, PUT /custom/v1/orders/{id}
   Требует аутентификацию (Bearer token)
========================= */

export interface GetOrdersParams {
  page?: number
  per_page?: number
  scope?: "today" | "all"
  status?: OrderStatus
  search?: string
  date?: string
  date_from?: string
  date_to?: string
  fields?: string
}

const isOrdersDebugEnabled =
  import.meta.env.DEV ||
  String(import.meta.env.VITE_DEBUG_ORDERS_REQUESTS || "").toLowerCase() === "true"

const buildOrdersDebugUrl = (params?: GetOrdersParams): string => {
  const searchParams = new URLSearchParams()

  const entries = Object.entries(params || {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))

  for (const [key, value] of entries) {
    searchParams.set(key, String(value))
  }

  const query = searchParams.toString()
  return query
    ? `/custom/v1/orders?${query}`
    : "/custom/v1/orders"
}

/* =========================
   UPDATE STATUS
========================= */

export interface UpdateOrderRequest {
  id: number
  status: OrderStatus
  reason?: string
}

export interface UpdateOrderResponse {
  success: boolean
  id: number
  status: OrderStatus
  reason?: string | null
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
      query: (params) => {
        if (isOrdersDebugEnabled) {
          console.debug("[orders][request] GET", buildOrdersDebugUrl(params || undefined))
        }

        return {
          url: "/custom/v1/orders",
          method: "GET",
          params: params || {},
        }
      },

      transformResponse: normalizeOrdersResponse,

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
      query: ({ id, status, reason }) => ({
        url: `/custom/v1/orders/${id}`,
        method: "PUT",
        body: { status, reason },
      }),

      async onQueryStarted(
        { id, status, reason },
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
                order.reason = reason ?? null
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
