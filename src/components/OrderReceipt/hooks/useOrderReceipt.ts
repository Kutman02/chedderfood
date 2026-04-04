import { useLayoutEffect } from "react"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import type { Product, PublicOrder, OrderMetaData } from "@/types"

import { formatDate } from "../utils/formatDate"

export const useOrderReceipt = (
  orderData: PublicOrder,
  products: Product[]
) => {

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  /* ===============================
     SCROLL LOCK
  =============================== */

  useLayoutEffect(() => {
    lockScroll()
    return () => unlockScroll()
  }, [lockScroll, unlockScroll])

  /* ===============================
     ORDER SOURCE
  =============================== */

  const order = orderData

  /* ===============================
     ORDER TYPE
  =============================== */

  const getOrderType = () => {
    const type = order.meta_data?.find(
      (m: OrderMetaData) => m.key === "order_type"
    )

    return type?.value || "delivery"
  }

  const orderType = getOrderType()

  /* ===============================
     SHIPPING
  =============================== */

  const shippingInfo = {
    method:
      order.shipping_lines?.[0]?.method_title ||
      "Стандартная доставка",

    address: `${
      order.shipping?.address_1 || order.billing?.address_1 || ""
    }, ${
      order.shipping?.city || order.billing?.city || ""
    }`,

    cost: Number(order.shipping_total || 0),

    status: (order as any).shipping_status || "В обработке",
  }

  const shippingCost = Number(order.shipping_total || 0)

  /* ===============================
     TOTALS (FIXED TS)
  =============================== */

  const subtotal = (order.line_items || []).reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  )

  const total = Number(order.total || 0)

  /* ===============================
     PRODUCTS MAPPING (FIXED TS)
  =============================== */

  const SITE_URL = import.meta.env.VITE_SITE_URL || ""

  const orderItems = (order.line_items || []).map((item) => {
    const product = products.find(
      (p) => p.id === item.product_id
    )

    return {
      ...item,

      // 🔥 фикс для optional id
      id: item.id ?? item.product_id,

      name: product?.name || item.name,

      image:
        product?.images?.[0]?.src ||
        "/placeholder-image.jpg",

      total: Number(item.total || 0),

      fallback: SITE_URL
        ? `${SITE_URL}/wp-content/uploads/fallback.png`
        : "/placeholder-image.jpg",
    }
  })

  /* ===============================
     ACTIONS
  =============================== */

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Заказ #${order.id} - KutMenu`,
          text: `Мой заказ #${order.id} на сумму ${total} сом`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share error:", err)
      }
    }
  }

  /* ===============================
     RETURN
  =============================== */

  return {
    order,

    orderType,

    orderItems,

    subtotal,
    shippingCost,
    total,

    shippingInfo,

    formatDate,

    handlePrint,
    handleShare,
  }
}