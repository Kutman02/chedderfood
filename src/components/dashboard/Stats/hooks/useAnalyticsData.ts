import { useMemo } from "react"
import { differenceInCalendarDays } from "date-fns"

import { useGetDashboardAnalyticsQuery } from "@/api"

import type { AnalyticsData } from "../types"

export const useAnalyticsData = (
  startDate: string,
  endDate: string
) => {
  const period = useMemo(() => {
    const days = Math.max(
      differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1,
      1
    )

    if (days <= 1) return "day" as const
    if (days <= 7) return "week" as const
    return "month" as const
  }, [endDate, startDate])

  const {
    data: analytics,
    isLoading,
  } = useGetDashboardAnalyticsQuery({ period })

  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (!analytics) return null

    const breakdown = analytics.order_status_breakdown ?? {}

    return {
      revenue: analytics.summary.total_revenue,
      orders: analytics.summary.total_orders,
      items_sold: analytics.summary.total_items_sold,
      average_order_value: analytics.summary.average_order_value,

      cancelled_orders: breakdown.cancelled ?? 0,
      pending_orders: (breakdown.pending ?? 0) + (breakdown["on-hold"] ?? 0),
      processing_orders: breakdown.processing ?? 0,
      completed_orders: breakdown.completed ?? 0,

      categories: [],
      products: analytics.top_products.map((product) => ({
        name: product.name,
        items_sold: product.quantity_sold,
        revenue: product.total_revenue,
        avg_price: product.price,
      })),
      daily_stats: [
        {
          date: analytics.summary.period,
          revenue: analytics.summary.total_revenue,
          orders: analytics.summary.total_orders,
          items_sold: analytics.summary.total_items_sold,
        },
      ],
    }
  }, [analytics])

  return {
    analyticsData,
    loading: isLoading,
  }
}
