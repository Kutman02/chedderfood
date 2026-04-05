import { useMemo } from "react"
import { format } from "date-fns"

import {
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery
} from "@/api"

import type { Order, OrderItem } from "@/entities/order/model/types"
import type { Product } from "@/entities/product/model/types"
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

    const validOrders = ordersData.filter(
      (o: Order) =>
        o.status !== "cancelled" &&
        o.status !== "refunded"
    )

    const cancelledOrders = ordersData.filter(
      (o: Order) =>
        o.status === "cancelled" ||
        o.status === "refunded"
    )

    const pendingOrders = ordersData.filter(
      (o: Order) =>
        o.status === "on-hold" ||
        o.status === "pending"
    )

    const processingOrders = ordersData.filter(
      (o: Order) => o.status === "processing"
    )

    const completedOrders = ordersData.filter(
      (o: Order) => o.status === "completed"
    )

    const revenue = validOrders.reduce(
      (sum: number, order: Order) =>
        sum + parseFloat(order.total),
      0
    )

    const orders = validOrders.length

    /* ===============================
       ITEMS SOLD (FIX)
    =============================== */

    const itemsSold = validOrders.reduce(
      (sum: number, order: Order) =>
        sum +
        order.items.reduce(
          (itemSum: number, item: OrderItem) =>
            itemSum + item.quantity,
          0
        ),
      0
    )

    const averageOrderValue =
      orders > 0 ? revenue / orders : 0

    /* ===============================
       PRODUCTS
    =============================== */

    const productMap = new Map<string, {
      name: string
      quantity: number
      revenue: number
      price: number
    }>()

    validOrders.forEach((order: Order) => {
      order.items.forEach((item: OrderItem) => {

        const existing =
          productMap.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
            price:
              item.quantity > 0
                ? parseFloat(item.total) / item.quantity
                : 0
          }

        existing.quantity += item.quantity
        existing.revenue += parseFloat(item.total)

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

    /* ===============================
       CATEGORIES
    =============================== */

    const categoryMap = new Map<string, {
      name: string
      items_sold: number
      revenue: number
      orders: number
    }>()

    const productCategoryMap = new Map<string, Product>()

    productsData.forEach((product: Product) => {
      productCategoryMap.set(product.name, product)
    })

    validOrders.forEach((order: Order) => {
      order.items.forEach((item: OrderItem) => {

        const product = productCategoryMap.get(item.name)
        const categories = product?.categories || []

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

          const cat = categoryMap.get(name)!

          cat.items_sold += item.quantity
          cat.revenue += parseFloat(item.total)
          cat.orders += 1

        } else {

          categories.forEach((category) => {

            if (!categoryMap.has(category.name)) {
              categoryMap.set(category.name, {
                name: category.name,
                items_sold: 0,
                revenue: 0,
                orders: 0
              })
            }

            const cat = categoryMap.get(category.name)!

            cat.items_sold += item.quantity
            cat.revenue += parseFloat(item.total)
            cat.orders += 1
          })
        }
      })
    })

    const categories =
      Array.from(categoryMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8)

    /* ===============================
       DAILY
    =============================== */

    const dailyMap = new Map<string, {
      date: string
      revenue: number
      orders: number
      items_sold: number
    }>()

    validOrders.forEach((order: Order) => {

      const date = format(
        new Date(order.date_created),
        "dd.MM"
      )

      const items = order.items.reduce(
        (sum: number, item: OrderItem) =>
          sum + item.quantity,
        0
      )

      const existing = dailyMap.get(date)

      if (existing) {
        existing.revenue += parseFloat(order.total)
        existing.orders += 1
        existing.items_sold += items
      } else {
        dailyMap.set(date, {
          date,
          revenue: parseFloat(order.total),
          orders: 1,
          items_sold: items
        })
      }

    })

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
      daily_stats: Array.from(dailyMap.values())
    }

  }, [ordersData, productsData])

  return {
    analyticsData,
    loading: ordersLoading || productsLoading
  }
}