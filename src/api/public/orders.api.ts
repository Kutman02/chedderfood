import { baseApi } from "../base/baseApi"
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types"

/* =========================
   PUBLIC ORDERS API
   Эндпоинт: POST /custom/v1/orders
   Открытый доступ для создания заказов (checkout)
========================= */

export const publicOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

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
  useCreateOrderMutation,
} = publicOrdersApi
