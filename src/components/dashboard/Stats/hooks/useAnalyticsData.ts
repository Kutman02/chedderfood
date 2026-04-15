import { useMemo } from "react"
import { differenceInCalendarDays } from "date-fns"

import { useGetDashboardAnalyticsQuery } from "@/api"
import type { DashboardAnalyticsData } from "@/types"

import type { AnalyticsData } from "../types"

export const useAnalyticsData = (
  startDate: string,
  endDate: string
) => {
  const toNumber = (value: unknown): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const getStatusCount = (
    breakdown: Record<string, unknown>,
    keys: string[]
  ): number => {
    for (const key of keys) {
      if (key in breakdown) {
        return toNumber(breakdown[key])
      }
    }

    return 0
  }

  const period = useMemo(() => {
    const days = Math.max(
      differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1,
      1
    )

    if (days <= 1) return "1d" as const
    if (days <= 7) return "7d" as const
    if (days <= 30) return "30d" as const
    return "90d" as const
  }, [endDate, startDate])

  const {
    data: analytics,
    isLoading,
  } = useGetDashboardAnalyticsQuery({
    period,
    date_from: startDate,
    date_to: endDate,
  })

  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (!analytics) return null

    const typedAnalytics = analytics as DashboardAnalyticsData & {
      top_categories?: Array<{
        name?: string
        items_sold?: number
        revenue?: number
        orders?: number
      }>
    }

    const breakdown = (typedAnalytics.order_status_breakdown ?? {}) as Record<string, unknown>

    const pendingOrders = getStatusCount(breakdown, ["on-hold", "on_hold", "pending"])
    const processingOrders = getStatusCount(breakdown, ["processing", "ready"])
    const completedOrders = getStatusCount(breakdown, ["completed"])
    const cancelledOrders = getStatusCount(breakdown, ["cancelled", "failed"])

    const topCategories = Array.isArray(typedAnalytics.top_categories)
      ? typedAnalytics.top_categories
          .filter((category) => category?.name)
          .map((category) => ({
            name: category.name as string,
            items_sold: toNumber(category.items_sold),
            revenue: toNumber(category.revenue),
            orders: toNumber(category.orders),
          }))
      : []

    const dailyStats = Array.isArray(typedAnalytics.sales_chart)
      ? typedAnalytics.sales_chart
          .filter((stat) => stat?.date)
          .map((stat) => ({
            date: stat.date as string,
            revenue: toNumber(stat.revenue),
            orders: toNumber(stat.orders),
            items_sold: 0,
          }))
      : []

    return {
      revenue: toNumber(typedAnalytics.summary.total_revenue),
      orders: toNumber(typedAnalytics.summary.total_orders),
      items_sold: toNumber(typedAnalytics.summary.total_items_sold),
      average_order_value: toNumber(typedAnalytics.summary.average_order_value),

      cancelled_orders: cancelledOrders,
      pending_orders: pendingOrders,
      processing_orders: processingOrders,
      completed_orders: completedOrders,

      categories: topCategories,
      products: typedAnalytics.top_products.map((product) => ({
        name: product.name,
        items_sold: toNumber(product.quantity_sold),
        revenue: toNumber(product.total_revenue),
        avg_price: toNumber(product.price),
      })),
      daily_stats: dailyStats.length > 0
        ? dailyStats
        : [
            {
              date: typedAnalytics.summary.end_date || endDate,
              revenue: toNumber(typedAnalytics.summary.total_revenue),
              orders: toNumber(typedAnalytics.summary.total_orders),
              items_sold: toNumber(typedAnalytics.summary.total_items_sold),
            },
          ],
    }
  }, [analytics, endDate])

  return {
    analyticsData,
    loading: isLoading,
  }
}
