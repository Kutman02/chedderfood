import type { Order } from "@/types"
import type { Product } from "@/types"

import { useOrderReceipt } from "@/components/OrderReceipt/hooks/useOrderReceipt"

import {
  OrderTypeInfo,
  OrderItemsList,
  OrderPricing,
  OrderPaymentInfo,
} from "./index"

interface Props {
  order: Order
  products: Product[]
}

export const OrderDetailsContent = ({ order, products }: Props) => {

  const receipt = useOrderReceipt(order, products)

  if (!receipt.order) {
    return null
  }

  const safeOrder = receipt.order

  return (
    <div className="flex-1 overflow-y-auto space-y-0 sm:space-y-4">

      <OrderItemsList items={receipt.orderItems} />

      <div className="space-y-0 sm:space-y-4">
        <OrderTypeInfo order={safeOrder} />
      </div>

      <div className="space-y-0 sm:space-y-4">
        <OrderPaymentInfo order={safeOrder} />
        <OrderPricing order={safeOrder} />
      </div>

    </div>
  )
}