import type { DashboardAnalyticsResponse } from "@/types"

export const normalizeDashboardAnalyticsResponse = (
  response: DashboardAnalyticsResponse
): DashboardAnalyticsResponse["data"] => response.data
