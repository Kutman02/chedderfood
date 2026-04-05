import { baseApi } from "../base/baseApi"

import { normalizeOrder } from "@/entities/order/model/normalizeOrder"
import { normalizeProduct } from "@/entities/product/model/normalizeProduct"

import type { Order } from "@/entities/order/model/types"
import type { Product } from "@/entities/product/model/types"

import { format, subDays } from "date-fns"

export const analyticsApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // SALES STATS
    // =========================
    getStats: builder.query<any, void>({

      query: () => ({
        url: "wc/v3/reports/sales",
        method: "GET",
        credentials: "omit"
      }),

      providesTags: ["Orders"]

    }),

    // =========================
    // ANALYTICS SUMMARY
    // =========================
    getAnalytics: builder.query<
      any,
      { days?: number }
    >({

      query: ({ days = 30 }) => {

        const after = format(subDays(new Date(), days), "yyyy-MM-dd")
        const before = format(new Date(), "yyyy-MM-dd")

        const params = new URLSearchParams({
          after,
          before,
          per_page: "100"
        })

        return {
          url: `wc/v3/reports/sales?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Orders"]

    }),

    // =========================
    // ANALYTICS ORDERS (🔥 FIX)
    // =========================
    getAnalyticsOrders: builder.query<
      Order[],
      { after?: string; before?: string; per_page?: number }
    >({

      query: ({ after, before, per_page = 100 }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString()
        })

        if (after) params.append("after", `${after}T00:00:00`)
        if (before) params.append("before", `${before}T23:59:59`)

        return {
          url: `wc/v3/orders?${params.toString()}`, // 🔥 ВАЖНО: не wc-analytics
          credentials: "omit"
        }

      },

      transformResponse: (res: any[]) =>
        res.map(normalizeOrder),

      providesTags: ["Orders"]

    }),

    // =========================
    // ANALYTICS PRODUCTS (🔥 FIX)
    // =========================
    getAnalyticsProducts: builder.query<
      Product[],
      { per_page?: number }
    >({

      query: ({ per_page = 100 }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString()
        })

        return {
          url: `wc/v3/products?${params.toString()}`, // 🔥 FIX
          credentials: "omit"
        }

      },

      transformResponse: (res: any[]) =>
        res.map(normalizeProduct),

      providesTags: ["Products"]

    })

  }),

  overrideExisting: false

})

export const {
  useGetStatsQuery,
  useGetAnalyticsQuery,
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} = analyticsApi