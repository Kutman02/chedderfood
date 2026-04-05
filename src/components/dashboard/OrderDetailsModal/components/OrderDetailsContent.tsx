import type { Order } from "@/entities/order/model/types"
import type { Product } from "@/entities/product/model/types"

import { useOrderReceipt } from "@/components/OrderReceipt/hooks/useOrderReceipt"

import {
  OrderCustomerInfo,
  OrderTypeInfo,
  OrderItemsList,
  OrderPricing,
  OrderPaymentInfo,
  OrderNote
} from "./index"

interface Props {
  order: Order
  products: Product[]
}

export const OrderDetailsContent = ({ order, products }: Props) => {

  const receipt = useOrderReceipt(order, products)

  // 🔥 CRITICAL GUARD
  if (!receipt.order) return null

  const safeOrder = receipt.order

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

      {/* ITEMS */}
      <OrderItemsList items={receipt.orderItems} />

      {/* NOTE */}
      <OrderNote note={safeOrder.customer_note} />

      {/* TYPE */}
      <OrderTypeInfo order={safeOrder} />

      {/* CUSTOMER */}
      <OrderCustomerInfo order={safeOrder} />

      {/* PAYMENT */}
      <OrderPaymentInfo order={safeOrder} />

      {/* PRICING */}
      <OrderPricing order={safeOrder} />

    </div>
  )
}