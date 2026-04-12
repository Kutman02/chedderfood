import type { PublicOrder } from "@/types"

export const getOrderType = (order: PublicOrder): string => {
  return order.order_type || "delivery"
}

export const getOrderTypeDisplay = (orderType: string): string => {
  return orderType === "pickup"
    ? "🛍️ Заберу сам (самовывоз)"
    : "🚗 Доставка"
}

export const getShippingInfo = (order: PublicOrder) => {
  return {
    method: order.order_type === "pickup" ? "Самовывоз" : "Доставка",
    address: order.address || "Не указан",
    cost: 0,
    status: "В обработке",
  }
}
