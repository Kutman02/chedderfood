import { useMemo } from "react"

import type { Order } from "@/types"
import type { Product } from "@/types"

import { formatDate } from "../utils/formatDate"

export const useOrderReceipt = (
  orderData: Order | null,
  products?: Product[]
) => {

  /* ===============================
     SOURCE OF TRUTH (NO NORMALIZE)
  =============================== */

  const order = orderData

  /* ===============================
     PRODUCTS MAP (O(1))
  =============================== */

  const productMap = useMemo(() => {
    const map = new Map<number, Product>()

    if (!Array.isArray(products)) return map

    for (const p of products) {
      if (p?.id) {
        map.set(p.id, p)
      }
    }

    return map
  }, [products])

  /* ===============================
     EMPTY STATE
  =============================== */

  if (!order) {
    return {
      order: null,

      orderType: "delivery" as const,

      orderItems: [],

      subtotal: 0,
      shippingCost: 0,
      total: 0,

      shippingInfo: {
        method: "",
        address: "",
        cost: 0,
        status: "",
      },

      formatDate,

      handlePrint: () => {},
      handleShare: async () => {},
    }
  }

  /* ===============================
     IMAGE RESOLVER (🔥 ВАЖНО)
  =============================== */

  const getImage = (item: any, product?: Product) => {
    if (typeof item.image === "string" && item.image.trim() !== "") {
      return item.image
    }

    if (item.image?.src) {
      return item.image.src
    }

    if (product?.images?.[0]?.src) {
      return product.images[0].src
    }

    return "/placeholder-image.jpg"
  }

  /* ===============================
     ORDER TYPE
  =============================== */

  const orderType = order.order_type

  /* ===============================
     SHIPPING
  =============================== */

  const shippingInfo = {
    method: orderType === "pickup" ? "Самовывоз" : "Доставка",

    address:
      orderType === "pickup"
        ? order.pickup_address || "Не указан"
        : order.address || "Не указан",

    cost: 0,
    status: "В обработке",
  }

  const shippingCost = 0

  /* ===============================
     TOTALS
  =============================== */

  const subtotal = order.items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  )

  const total = Number(order.total)

  /* ===============================
     ITEMS (СТАБИЛЬНЫЙ)
  =============================== */

  const orderItems = order.items.map((item) => {

    const product = productMap.get(item.product_id)

    return {
      id: item.id ?? item.product_id,
      product_id: item.product_id,

      name: product?.name || item.name || "Товар",

      quantity: item.quantity,
      price: item.price,

      image: getImage(item, product),

      total:
        Number(item.price) * Number(item.quantity),
    }
  })

  /* ===============================
     ACTIONS
  =============================== */

  const handlePrint = () => window.print()

  const handleShare = async () => {
    if (!navigator.share) return

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