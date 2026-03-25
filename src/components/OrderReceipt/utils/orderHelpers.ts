import type { PublicOrder, OrderMetaData } from "@/types"

export const getOrderType = (order: PublicOrder): string => {
  const orderTypeData = order.meta_data?.find(
    (m: OrderMetaData) => m.key === "order_type"
  )

  return orderTypeData?.value || "delivery"
}

export const getOrderTypeDisplay = (orderType: string): string => {
  return orderType === "pickup"
    ? "🛍️ Заберу сам (самовывоз)"
    : "🚗 Доставка"
}

export const getShippingInfo = (order: PublicOrder) => {
  const shipping = order.shipping
  const billing = order.billing

  return {
    method:
      order.shipping_lines?.[0]?.method_title ||
      "Стандартная доставка",

    address: `${
      shipping?.address_1 || billing?.address_1
    }, ${
      shipping?.city || billing?.city
    }`,

    cost: Number(order.shipping_total || 0),

    status: order.shipping_status || "В обработке",
  }
}