import type { Order } from "@/types"
import type { Product } from "@/types"

import { useOrderReceipt } from "@/components/OrderReceipt/hooks/useOrderReceipt"

import {
  OrderCustomerInfo,
  OrderTypeInfo,
  OrderItemsList,
  OrderPricing,
  OrderPaymentInfo,
  OrderNote,
  OrderAddressInfo
} from "./index"

interface Props {
  order: Order
  products: Product[]
}

export const OrderDetailsContent = ({ order, products }: Props) => {

  const receipt = useOrderReceipt(order, products)

  // 🔥 DEBUG вывод для диагностики
  console.group("📋 OrderDetails Debug")
  console.log("💰 Order ID:", order.id)
  console.log("📦 Raw order.items:", order.items)
  console.log("📦 Raw order.line_items:", (order as any).line_items)
  console.log("✅ Processed receipt.items count:", receipt.orderItems.length)
  console.log("✅ Processed items:", receipt.orderItems)
  console.log("📦 Available products:", products.length)
  console.groupEnd()

  // 🔥 CRITICAL GUARD
  if (!receipt.order) {
    console.warn("⚠️ Order is null - returning null")
    return null
  }

  const safeOrder = receipt.order

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

      {/* ITEMS */}
      <OrderItemsList items={receipt.orderItems} />

      {/* NOTE */}
      <OrderNote note={safeOrder.customer_note} />

      {/* TYPE */}
      <OrderTypeInfo order={safeOrder} />

      {/* ADDRESS */}
      <OrderAddressInfo order={safeOrder} />

      {/* CUSTOMER */}
      <OrderCustomerInfo order={safeOrder} />

      {/* PAYMENT */}
      <OrderPaymentInfo order={safeOrder} />

      {/* PRICING */}
      <OrderPricing order={safeOrder} />

    </div>
  )
}