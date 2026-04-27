import { baseApi } from "../base/baseApi"
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  ShippingMethodsRequest,
  ShippingMethodsResponse,
} from "@/types"
import {
  normalizePublicOrderStatus,
  normalizeShippingMethodsResponse,
  type PublicOrderStatusPayload,
} from "./orders.transformers"

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

/* =========================
   PUBLIC ORDERS API
   Эндпоинт: POST /custom/v1/orders
   Открытый доступ для создания заказов (checkout)
========================= */

export const publicOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET SHIPPING METHODS (CLIENT)
    ========================= */

    getShippingMethods: builder.mutation<
      ShippingMethodsResponse,
      ShippingMethodsRequest
    >({
      query: (body) => ({
        url: "/custom/v1/shipping-methods",
        method: "POST",
        body,
      }),

      transformResponse: normalizeShippingMethodsResponse,
    }),

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
  useGetShippingMethodsMutation,
  useLazyGetPublicOrderStatusQuery,
  useCreateOrderMutation,
} = publicOrdersApi
