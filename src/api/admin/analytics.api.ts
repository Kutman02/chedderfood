import { baseApi } from "../base/baseApi"
import type { DashboardAnalyticsResponse } from "@/types"

export interface GetDashboardAnalyticsParams {
  period?:
    | "1d"
    | "7d"
    | "30d"
    | "90d"
    | "day"
    | "week"
    | "month"
    | "daily"
    | "weekly"
    | "monthly"
  date_from?: string
  date_to?: string
}

export const adminAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<
      DashboardAnalyticsResponse["data"],
      GetDashboardAnalyticsParams | void
    >({
      query: (params) => ({
        url: "/custom/v1/analytics/dashboard",
        method: "GET",
        params: params || {},
      }),

      transformResponse: (response: DashboardAnalyticsResponse) => response.data,
    }),
  }),
})

export const {
  useGetDashboardAnalyticsQuery,
} = adminAnalyticsApi
