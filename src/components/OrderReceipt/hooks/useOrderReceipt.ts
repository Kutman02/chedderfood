import { useState, useLayoutEffect } from "react"

import { useGetPublicOrderQuery } from "@/app/services/publicApi"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import type { Product, OrderItem, PublicOrder, OrderMetaData } from "@/types"

import { formatDate } from "../utils/formatDate"

export const useOrderReceipt = (orderData: PublicOrder, products: Product[]) => {

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: latestOrder, refetch } = useGetPublicOrderQuery(
    orderData.id.toString(),
    {
      pollingInterval: 30000,
    }
  )

  useLayoutEffect(() => {
    lockScroll()

    return () => {
      unlockScroll()
    }
  }, [lockScroll, unlockScroll])

  const order = latestOrder || orderData

  const getOrderType = () => {
    const type = order.meta_data?.find(
      (m: OrderMetaData) => m.key === "order_type"
    )

    return type?.value || "delivery"
  }

  const orderType = getOrderType()

  const shippingInfo = {
    method: order.shipping_lines?.[0]?.method_title || "Стандартная доставка",

    address: `${
      order.shipping.address_1 || order.billing.address_1
    }, ${
      order.shipping.city || order.billing.city
    }`,

    cost: Number(order.shipping_total || 0),

    status: order.shipping_status || "В обработке",
  }

  const shippingCost = Number(order.shipping_total || 0)

  const subtotal = order.line_items.reduce(
    (sum: number, item: OrderItem) => {
      return sum + Number(item.total || 0)
    },
    0
  )

  const total = Number(order.total || 0)

  const SITE_URL = import.meta.env.VITE_SITE_URL

  const orderItems = order.line_items.map((item: OrderItem) => {
    const product = products.find((p) => p.id === item.product_id)

    return {
      ...item,
      name: product?.name || item.name,
      image: product?.images?.[0]?.src || "/placeholder-image.jpg",
      total: Number(item.total || 0),
      fallback: `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`,
    }
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Заказ #${order.id} - BurgerFood`,
          text: `Мой заказ #${order.id} на сумму ${total} сом`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share failed:", err)
      }
    }
  }

  return {
    order,
    latestOrder,

    orderType,

    orderItems,

    subtotal,
    shippingCost,
    total,

    shippingInfo,

    formatDate,

    isRefreshing,

    handleRefresh,
    handlePrint,
    handleShare,
  }
}