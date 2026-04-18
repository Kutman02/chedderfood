import { baseApi } from "../base/baseApi"
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types"

type PublicOrderStatusPayload = {
  id: number
  status: string
  reason?: string | null
  changed_at?: string | null
  date_created_human?: string
  date_created_unix?: number
  date_created?: string
}

type GetPublicOrderStatusArgs = {
  orderId: number
  publicKey: string
}

const DEFAULT_PUBLIC_ORDER_STATUS_ENDPOINT = "/custom/v1/public/orders/{id}/status"

const configuredOrderStatusEndpoints = (() => {
  const multi = String(import.meta.env.VITE_PUBLIC_ORDER_STATUS_ENDPOINTS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)

  const single = String(import.meta.env.VITE_PUBLIC_ORDER_STATUS_ENDPOINT || "").trim()

  if (single && !multi.includes(single)) {
    multi.push(single)
  }

  if (!multi.includes(DEFAULT_PUBLIC_ORDER_STATUS_ENDPOINT)) {
    multi.push(DEFAULT_PUBLIC_ORDER_STATUS_ENDPOINT)
  }

  return multi
})()

const buildOrderStatusUrls = (orderId: number): string[] => {
  return configuredOrderStatusEndpoints
    .map((template) => template.replaceAll("{id}", String(orderId)))
    .filter(Boolean)
}

const parseOrderId = (value: unknown): number | null => {
  const numeric = Number(value)
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric
  }

  if (typeof value === "string") {
    const digits = value.match(/\d+/)?.[0]
    if (digits) {
      const parsed = Number(digits)
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed
      }
    }
  }

  return null
}

const readNumberField = (value: unknown): number | undefined => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const normalizeStatus = (value: unknown): string | null => {
  const normalized = String(value || "").trim().toLowerCase()
  if (!normalized) return null

  if (normalized === "pending") return "on-hold"
  if (normalized === "canceled") return "cancelled"

  if (normalized === "failed" || normalized === "refunded" || normalized === "trash") {
    return "cancelled"
  }

  return normalized
}

const toPayload = (candidate: unknown, fallbackOrderId: number): PublicOrderStatusPayload | null => {
  if (!candidate || typeof candidate !== "object") return null

  const source = candidate as Record<string, unknown>
  const id = parseOrderId(source.id ?? source.number) ?? fallbackOrderId
  const status = normalizeStatus(source.status)

  if (!status) return null

  return {
    id,
    status,
    reason: (source.reason as string | null | undefined) ?? undefined,
    changed_at: (source.changed_at as string | null | undefined) ?? undefined,
    date_created_human: (source.date_created_human as string | undefined) ?? undefined,
    date_created_unix: readNumberField(source.date_created_unix),
    date_created: (source.date_created as string | undefined) ?? undefined,
  }
}

const normalizePublicOrderStatus = (
  raw: unknown,
  fallbackOrderId: number
): PublicOrderStatusPayload | null => {
  if (!raw || typeof raw !== "object") return null

  const source = raw as Record<string, unknown>

  const direct = toPayload(source, fallbackOrderId)
  if (direct) return direct

  const nestedOrder = toPayload(source.order, fallbackOrderId)
  if (nestedOrder) return nestedOrder

  const nestedData = source.data

  if (Array.isArray(nestedData)) {
    const byId = nestedData.find((item) => {
      if (!item || typeof item !== "object") return false

      const itemSource = item as Record<string, unknown>
      const itemId = parseOrderId(itemSource.id ?? itemSource.number)
      return itemId === fallbackOrderId
    })

    const fromArray = toPayload(byId ?? nestedData[0], fallbackOrderId)
    if (fromArray) return fromArray
  } else {
    const nestedDataPayload = toPayload(nestedData, fallbackOrderId)
    if (nestedDataPayload) return nestedDataPayload
  }

  return null
}

/* =========================
   PUBLIC ORDERS API
   Эндпоинт: POST /custom/v1/orders
   Открытый доступ для создания заказов (checkout)
========================= */

export const publicOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET ORDER STATUS (CLIENT)
    ========================= */

    getPublicOrderStatus: builder.query<
      PublicOrderStatusPayload,
      GetPublicOrderStatusArgs
    >({
      queryFn: async (args, _api, _extraOptions, fetchWithBQ) => {
        const normalizedId = Number(args.orderId)
        const publicKey = String(args.publicKey || "").trim()

        if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Invalid order id",
            },
          }
        }

        if (!publicKey) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Missing public key",
            },
          }
        }

        const candidates = buildOrderStatusUrls(normalizedId)

        if (!candidates.length) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Order status endpoint is not configured",
            },
          }
        }

        for (const url of candidates) {
          const result = await fetchWithBQ({
            url,
            method: "GET",
            params: {
              public_key: publicKey,
            },
          })

          if (result.error) {
            continue
          }

          const payload = normalizePublicOrderStatus(result.data, normalizedId)

          if (payload) {
            return { data: payload }
          }
        }

        return {
          error: {
            status: "CUSTOM_ERROR",
            error: "Order status is unavailable",
          },
        }
      },

      providesTags: (_result, _error, args) => [
        { type: "Orders" as const, id: args.orderId },
      ],
    }),

    /* =========================
       CREATE ORDER (CLIENT)
    ========================= */

    createOrder: builder.mutation<
      CreateOrderResponse,
      CreateOrderRequest
    >({
      query: (body) => ({
        url: "/custom/v1/orders",
        method: "POST",
        body,
      }),

      transformResponse: (response: CreateOrderResponse) => response,

      async onQueryStarted(
        _arg,
        { queryFulfilled }
      ) {
        try {
          await queryFulfilled
        } catch (error) {
          console.error("Create order error:", error)
        }
      },
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useLazyGetPublicOrderStatusQuery,
  useCreateOrderMutation,
} = publicOrdersApi
