import { useMemo } from "react"
import { format } from "date-fns"

import {
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} from "../../../../app/services/api"

import type { OrderItem } from "../../../../types"
import type { AnalyticsData } from "../types"

export const useAnalyticsData = (
  startDate: string,
  endDate: string
) => {

  const {
    data: ordersData,
    isLoading: ordersLoading
  } = useGetAnalyticsOrdersQuery({
    after: startDate,
    before: endDate,
    per_page: 100
  })

  const {
    data: productsData,
    isLoading: productsLoading
  } = useGetAnalyticsProductsQuery({
    per_page: 100
  })

  const analyticsData: AnalyticsData | null = useMemo(() => {

    if (!ordersData || !productsData) return null

    const validOrders =
      ordersData.filter(
        o => o.status !== "cancelled" && o.status !== "refunded"
      )

    const cancelledOrders =
      ordersData.filter(
        o => o.status === "cancelled" || o.status === "refunded"
      )

    const pendingOrders =
      ordersData.filter(
        o => o.status === "on-hold" || o.status === "pending"
      )

    const processingOrders =
      ordersData.filter(
        o => o.status === "processing"
      )

    const completedOrders =
      ordersData.filter(
        o => o.status === "completed"
      )

    const revenue =
      validOrders.reduce(
        (sum, order) => sum + parseFloat(order.total || "0"),
        0
      )

    const orders = validOrders.length

    const itemsSold =
      validOrders.reduce(
        (sum, order) =>
          sum +
          order.line_items.reduce(
            (itemSum: number, item: OrderItem) =>
              itemSum + item.quantity,
            0
          ),
        0
      )

    const averageOrderValue =
      orders > 0 ? revenue / orders : 0

    /* ---------- PRODUCTS ---------- */

    const productMap = new Map()

    validOrders.forEach(order => {

      order.line_items.forEach((item: OrderItem) => {

        const existing =
          productMap.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
            price:
              parseFloat(item.total || "0") /
              item.quantity
          }

        existing.quantity += item.quantity
        existing.revenue += parseFloat(item.total || "0")

        productMap.set(item.name, existing)

      })

    })

    const products =
      Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(product => ({
          name: product.name,
          items_sold: product.quantity,
          revenue: product.revenue,
          avg_price: product.price
        }))

    /* ---------- CATEGORIES ---------- */

    const categoryMap = new Map()

    const productCategoryMap = new Map()

    productsData.forEach(product => {

      productCategoryMap.set(product.name, {
        categories: product.categories || []
      })

    })

    validOrders.forEach(order => {

      order.line_items.forEach((item: OrderItem) => {

        const productInfo =
          productCategoryMap.get(item.name)

        const categories =
          productInfo?.categories || []

        if (categories.length === 0) {

          const name = "Без категории"

          if (!categoryMap.has(name)) {

            categoryMap.set(name, {
              name,
              items_sold: 0,
              revenue: 0,
              orders: 0
            })

          }

          const cat = categoryMap.get(name)

          cat.items_sold += item.quantity
          cat.revenue += parseFloat(item.total || "0")
          cat.orders += 1

        } else {

categories.forEach((category: { id: number; name: string; slug: string }) => {
            if (!categoryMap.has(category.name)) {

              categoryMap.set(category.name, {
                name: category.name,
                items_sold: 0,
                revenue: 0,
                orders: 0
              })

            }

            const cat = categoryMap.get(category.name)

            cat.items_sold += item.quantity
            cat.revenue += parseFloat(item.total || "0")
            cat.orders += 1

          })

        }

      })

    })

    const categories =
      Array.from(categoryMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8)

    /* ---------- DAILY STATS ---------- */

    const dailyStats = validOrders.reduce((acc, order) => {

      const date =
        format(new Date(order.date_created), "dd.MM")

      const existing =
        acc.find(item => item.date === date)

      const items =
        order.line_items.reduce(
          (sum: number, item: OrderItem) =>
            sum + item.quantity,
          0
        )

      if (existing) {

        existing.revenue += parseFloat(order.total || "0")
        existing.orders += 1
        existing.items_sold += items

      } else {

        acc.push({
          date,
          revenue: parseFloat(order.total || "0"),
          orders: 1,
          items_sold: items
        })

      }

      return acc

    }, [] as AnalyticsData["daily_stats"])

    return {
      revenue,
      orders,
      items_sold: itemsSold,
      average_order_value: averageOrderValue,

      cancelled_orders: cancelledOrders.length,
      pending_orders: pendingOrders.length,
      processing_orders: processingOrders.length,
      completed_orders: completedOrders.length,

      categories,
      products,
      daily_stats: dailyStats
    }

  }, [ordersData, productsData])

  return {
    analyticsData,
    loading: ordersLoading || productsLoading
  }

}