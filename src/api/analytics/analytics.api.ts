import { baseApi } from "../base/baseApi"
import type { Order, Product, AnalyticsResponse } from "@/types"

import { format, subDays } from "date-fns"

export const analyticsApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // Общая статистика продаж
    getStats: builder.query({

      query: () => ({
        url: "wc/v3/reports/sales",
        method: "GET",
        credentials: "omit"
      }),

      providesTags: ["Orders"]

    }),


    // Аналитика за N дней
    getAnalytics: builder.query<
      AnalyticsResponse,
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


    // Заказы для аналитики
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
          url: `wc-analytics/orders?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Orders"]

    }),


    // Товары для аналитики
    getAnalyticsProducts: builder.query<
      Product[],
      { per_page?: number }
    >({

      query: ({ per_page = 100 }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString()
        })

        return {
          url: `wc-analytics/products?${params.toString()}`,
          credentials: "omit"
        }

      },

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