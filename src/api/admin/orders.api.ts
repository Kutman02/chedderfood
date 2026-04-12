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
  scope?: "today" | "all"
  status?: OrderStatus
  search?: string
  date?: string
  date_from?: string
  date_to?: string
  fields?: string
}

type RawOrderMeta = {
  key?: string
  value?: unknown
}

type RawOrder = Order & {
  billing?: {
    first_name?: string
    last_name?: string
    phone?: string
    email?: string
    address_1?: string
    address_2?: string
    city?: string
    postcode?: string
  }
  meta_data?: RawOrderMeta[]
  line_items?: Order["line_items"]
}

const readMetaString = (
  metaData: RawOrderMeta[] | undefined,
  key: string
): string | undefined => {
  const found = metaData?.find((item) => item?.key === key)
  if (!found?.value) return undefined

  const value = String(found.value).trim()
  return value || undefined
}

const readMetaBoolean = (
  metaData: RawOrderMeta[] | undefined,
  key: string
): boolean | undefined => {
  const found = metaData?.find((item) => item?.key === key)
  if (typeof found?.value === "boolean") return found.value
  if (typeof found?.value === "number") return found.value === 1
  if (typeof found?.value === "string") {
    const normalized = found.value.trim().toLowerCase()
    if (["1", "true", "yes"].includes(normalized)) return true
    if (["0", "false", "no"].includes(normalized)) return false
  }
  return undefined
}

const normalizeStatus = (status: string): OrderStatus => {
  if (status === "pending") return "on-hold"
  if (
    status === "on-hold" ||
    status === "processing" ||
    status === "ready" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return status
  }
  return "on-hold"
}

const normalizeOrder = (order: RawOrder): Order => {
  const metaData = Array.isArray(order.meta_data) ? order.meta_data : undefined
  const billing = order.billing

  const orderTypeMeta = readMetaString(metaData, "order_type")
  const normalizedOrderType =
    order.order_type === "pickup" || orderTypeMeta === "pickup"
      ? "pickup"
      : "delivery"

  const addressFromBilling = billing?.address_1?.trim() || undefined

  return {
    ...order,
    status: normalizeStatus(order.status),

    customer_name:
      order.customer_name?.trim() ||
      [billing?.first_name, billing?.last_name].filter(Boolean).join(" ").trim() ||
      "Без имени",

    phone: order.phone?.trim() || billing?.phone?.trim() || "",
    email: order.email || billing?.email,
    first_name: order.first_name || billing?.first_name,
    last_name: order.last_name || billing?.last_name,

    address: order.address || addressFromBilling,
    address_2: order.address_2 || billing?.address_2,
    city: order.city || billing?.city,
    postcode: order.postcode || billing?.postcode,
    apartment: order.apartment || readMetaString(metaData, "apartment"),
    floor: order.floor || readMetaString(metaData, "floor"),

    order_type: normalizedOrderType,
    needs_cutlery:
      order.needs_cutlery ?? readMetaBoolean(metaData, "needs_cutlery"),
    needs_napkins:
      order.needs_napkins ?? readMetaBoolean(metaData, "needs_napkins"),

    items: Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.line_items)
        ? order.line_items
        : [],
  }
}

const emptyStatusCounts = () => ({
  "on-hold": 0,
  processing: 0,
  ready: 0,
  completed: 0,
  cancelled: 0,
})

const normalizeOrdersResponse = (response: OrdersResponse): OrdersResponse => {
  const data = Array.isArray(response.data)
    ? response.data.map(normalizeOrder)
    : []

  const statusCountsFallback = data.reduce((acc, order) => {
    acc[order.status] += 1
    return acc
  }, emptyStatusCounts())

  return {
    ...response,
    data,
    total: response.total ?? 0,
    totalPages: response.totalPages ?? 1,
    status_counts_today: response.status_counts_today ?? statusCountsFallback,
    status_counts_range: response.status_counts_range ?? statusCountsFallback,
  }
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
